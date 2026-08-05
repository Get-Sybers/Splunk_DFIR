#!/bin/bash

set -o pipefail

# Ensure correct filepath assigned when referenced
SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"  # Resolves full path
REPO_ROOT_DIR="$(realpath "$SCRIPT_DIR/..")"

# Container lifecycle — replace policy, isolated network, log stream,
# readiness, egress verification, port readback, directory purge — is shared
# with deploy-kusto.sh. lib/docker-lifecycle.sh documents the defect each
# function encodes the fix for; several of them were paid for by this script.
# shellcheck source=lib/docker-lifecycle.sh
source "$SCRIPT_DIR/lib/docker-lifecycle.sh"

SPLUNK_CONTAINER="splunk-enterprise"

# ------------------------------------------------------------------------------
# Where Splunk's index data lives.
#
# Everything else this script mounts is staged under /data/ and copied into
# place by the pre-task playbooks — that is the project's design, and it is why
# splunk/etc, data_store/processed and ansible/playbooks are all :ro.
#
# The exception was `-v splunk/var:/data/var`, the ONLY read-write mount. That
# rw flag says what was intended: index data was meant to land in the repo at
# splunk/var. splunk/.gitignore has a `var/**` + `!var/.gitkeep` block built for
# exactly that, and the old purge script told you "you can find your indexes in
# Splunk_DFIR/splunk/var".
#
# It never worked, because Splunk reads $SPLUNK_DB -> /opt/splunk/var and
# nothing redirected it. The whole bug was the mount POINT, not the approach.
#
# Both approaches are supported now, because this is an operator's decision and
# not one this script should make silently:
#
#   SPLUNK_VAR_VOLUME  (default)  named Docker volume. Docker seeds it from the
#                                 image on first use, so /opt/splunk/var keeps
#                                 the container's splunk-user ownership.
#   SPLUNK_VAR_DIR / --var-dir    bind-mount a host directory instead. Restores
#                                 the original design — indexes are a directory
#                                 you can see, size with `du`, back up, and put
#                                 on whichever disk has room. Use
#                                 --var-dir "$REPO_ROOT_DIR/splunk/var" for
#                                 exactly what was originally intended.
#
# The bind mount needs the host directory owned by the image's splunk UID or
# Splunk will not start; this script handles that below rather than leaving you
# to discover it.
SPLUNK_VAR_VOLUME="${SPLUNK_VAR_VOLUME:-splunk-dfir-var}"
SPLUNK_VAR_DIR="${SPLUNK_VAR_DIR:-}"

# How long to wait for the container's internal Ansible run to finish. The
# first run also pulls the image, so this needs to be generous.
SPLUNK_READY_TIMEOUT="${SPLUNK_READY_TIMEOUT:-600}"

# Third-party Splunk apps are no longer vendored in this repository — neither
# Splunk_TA_zeek nor sankey_diagram_app declares a licence permitting
# redistribution. Drop their Splunkbase packages (.tgz/.spl) here; this script
# lists them in SPLUNK_APPS_URL and the image installs them itself.
THIRD_PARTY_APP_DIR="${THIRD_PARTY_APP_DIR:-$REPO_ROOT_DIR/data_store/dependencies/splunk_apps}"

# Whether this deploy keeps the index volume or wipes it.
#   persist (default) — redeploy, keep every indexed event and the fishbucket
#   purge             — redeploy from a clean slate, deleting the volume
# Network isolation.
#
# This container holds evidence. It has no business making outbound connections,
# and no business being reachable from the LAN.
#
#   SPLUNK_ISOLATED=1  attach to a bridge with IP masquerade disabled, so the
#                      container gets no useful egress. Splunk cannot phone
#                      home, check for updates, or reach Splunkbase. (NOT
#                      --internal — that blocks published ports too and shipped
#                      an unreachable UI once; see lib/docker-lifecycle.sh.)
#   SPLUNK_BIND_ADDR   host address the published ports bind to. 127.0.0.1 means
#                      only this machine can reach the UI. The previous
#                      behaviour, `-p 8000:8000`, bound 0.0.0.0 — every
#                      interface, so anyone on the network could reach it.
#
# NOTE: containers on the network can still reach each other and services on
# the host's bridge address. This is isolation from the network, not an airgap.
SPLUNK_ISOLATED="${SPLUNK_ISOLATED:-1}"
SPLUNK_NETWORK="${SPLUNK_NETWORK:-splunk-dfir-isolated}"
SPLUNK_BIND_ADDR="${SPLUNK_BIND_ADDR:-127.0.0.1}"

SPLUNK_DATA_MODE="${SPLUNK_DATA_MODE:-persist}"
SPLUNK_REPLACE="${SPLUNK_REPLACE:-always}"

# Skip confirmation prompts. Required for an unattended --purge, since that
# destroys indexed evidence.
ASSUME_YES="${ASSUME_YES:-0}"

# --purge wipes the indexes AND redeploys, because it is a flag on the deploy
# script. --purge-only wipes and stops, for when you just want the data gone.
PURGE_ONLY="${PURGE_ONLY:-0}"

usage() {
    cat <<'USAGE'
Usage: deploy-splunk.sh [OPTIONS]

Deploys the Splunk container. This project redeploys every time, so an existing
container is replaced without prompting by default.

Data:
  --persist          Keep the index volume across the redeploy.  (default)
                     Indexed events and the fishbucket survive, so
                     already-ingested files are not re-read.
  --purge            Delete the index volume, then redeploy.
                     ⚠️  DESTROYS ALL INDEXED EVIDENCE. Prompts unless --yes.
  --purge-only       Delete the container and index volume, then STOP.
                     No redeploy. Same as scripts/purge-splunk-container.sh.
  --var-dir PATH     Keep indexes in a host DIRECTORY at PATH instead of a
                     named Docker volume. You can see them, size them with
                     du, back them up, and choose which disk they land on.
                     Use --var-dir ./splunk/var for the layout this project
                     was originally built around.

Container:
  --ask              Prompt before replacing an existing container.
  --no-replace       Abort if a container already exists.

Network:
  --isolated         Attach to a Docker bridge with IP masquerade disabled,
                     so the container gets no useful egress.         (default)
  --no-isolated      Allow outbound network access. Only if you need it.
  --bind ADDR        Host address to publish ports on.  (default 127.0.0.1)
                     Use --bind 0.0.0.0 to expose on the LAN — think first;
                     this container holds evidence.

Other:
  --skip-chmod       Skip the permission fixup. It is O(files) over
                     data_store/processed and runs on every deploy.
  -y, --yes          Assume yes to prompts. Needed for unattended --purge.
  -h, --help         Show this and exit.

Environment (flags win):
  SPLUNK_PASSWORD_FILE   read the admin password from a file (preferred)
  SPLUNK_PASSWORD        admin password from the environment
  SPLUNK_DATA_MODE       persist | purge
  SPLUNK_REPLACE         always | ask | never
  SPLUNK_VAR_VOLUME      index volume name        (default splunk-dfir-var)
  SPLUNK_VAR_DIR         host directory for indexes; overrides the volume
  SPLUNK_READY_TIMEOUT   seconds to wait          (default 600)
  SPLUNK_SKIP_CHMOD      1 to skip permission fixup
  SPLUNK_ISOLATED        1 = no egress (default), 0 = allow outbound
  SPLUNK_NETWORK         network name          (default splunk-dfir-isolated)
  SPLUNK_BIND_ADDR       publish address       (default 127.0.0.1)
  THIRD_PARTY_APP_DIR    Splunkbase package directory

Examples:
  ./scripts/deploy-splunk.sh                          # redeploy, keep data
  ./scripts/deploy-splunk.sh --purge                  # redeploy, wipe indexes
  SPLUNK_PASSWORD_FILE=~/.splunk ./scripts/deploy-splunk.sh --purge --yes
USAGE
}

while [[ $# -gt 0 ]]; do
    case "$1" in
        --persist)     SPLUNK_DATA_MODE="persist" ;;
        --purge)       SPLUNK_DATA_MODE="purge" ;;
        --purge-only)  SPLUNK_DATA_MODE="purge"; PURGE_ONLY=1 ;;
        --var-dir)
            [[ -n "${2:-}" ]] || { echo "❌ --var-dir needs a PATH."; exit 1; }
            SPLUNK_VAR_DIR="$2"; shift ;;
        --ask)         SPLUNK_REPLACE="ask" ;;
        --no-replace)  SPLUNK_REPLACE="never" ;;
        --skip-chmod)  SPLUNK_SKIP_CHMOD=1 ;;
        --isolated)    SPLUNK_ISOLATED=1 ;;
        --no-isolated) SPLUNK_ISOLATED=0 ;;
        --bind)
            shift
            [[ -z "${1:-}" ]] && { echo "❌ --bind needs an address (e.g. --bind 127.0.0.1)"; exit 1; }
            SPLUNK_BIND_ADDR="$1"
            ;;
        -y|--yes)      ASSUME_YES=1 ;;
        -h|--help)     usage; exit 0 ;;
        *)
            echo "❌ Unknown option: $1"
            echo ""
            usage
            exit 1
            ;;
    esac
    shift
done

case "$SPLUNK_DATA_MODE" in
    persist|purge) ;;
    *) echo "❌ SPLUNK_DATA_MODE must be persist|purge (got '$SPLUNK_DATA_MODE')."; exit 1 ;;
esac

# ------------------------------------------------------------------------------
# Resolve where indexes live: named volume (default) or host directory.
#
# One place decides this, so the mount, the purge and the summary can never
# disagree about it.
# ------------------------------------------------------------------------------
if [[ -n "$SPLUNK_VAR_DIR" ]]; then
    VAR_MODE="dir"
    mkdir -p "$SPLUNK_VAR_DIR" 2>/dev/null || {
        echo "❌ Could not create --var-dir '$SPLUNK_VAR_DIR'."; exit 1; }
    SPLUNK_VAR_DIR="$(realpath "$SPLUNK_VAR_DIR")"
    VAR_MOUNT="$SPLUNK_VAR_DIR:/opt/splunk/var"
    VAR_DESC="host directory $SPLUNK_VAR_DIR"
else
    VAR_MODE="volume"
    VAR_MOUNT="$SPLUNK_VAR_VOLUME:/opt/splunk/var"
    VAR_DESC="Docker volume $SPLUNK_VAR_VOLUME"
fi

################################################################################
echo ""
echo " ██████╗ ███████╗████████╗   ███████╗██╗   ██╗██████╗ ███████╗██████╗ ███████╗"
sleep 0.1
echo "██╔════╝ ██╔════╝╚══██╔══╝   ██╔════╝╚██╗ ██╔╝██╔══██╗██╔════╝██╔══██╗██╔════╝"
sleep 0.1
echo "██║  ███╗█████╗     ██║█████╗███████╗ ╚████╔╝ ██████╔╝█████╗  ██████╔╝███████╗"
sleep 0.1
echo "██║   ██║██╔══╝     ██║╚════╝╚════██║  ╚██╔╝  ██╔══██╗██╔══╝  ██╔══██╗╚════██║"
sleep 0.1
echo "╚██████╔╝███████╗   ██║      ███████║   ██║   ██████╔╝███████╗██║  ██║███████║"
sleep 0.1
echo "╚═════╝ ╚══════╝   ╚═╝      ╚══════╝   ╚═╝   ╚═════╝ ╚══════╝╚═╝  ╚═╝╚══════╝"
echo ""

echo "$REPO_ROOT_DIR"
echo ""

# Fail on a missing/unreachable Docker before any prompt or destructive step,
# not at whatever line first happens to call it.
dl_require_docker || exit 1

# ------------------------------------------------------------------------------
# --purge confirmation — collected BEFORE anything is destroyed.
#
# The volume itself can only be deleted after the container is removed (Docker
# refuses to remove a volume still attached to one), but the QUESTION comes
# first: the replace block used to run before this prompt, so declining the
# purge still cost you the container. The Kusto deploy was built with the
# confirmation first for exactly that reason; now both order it the same way.
# ------------------------------------------------------------------------------
PURGE_REQUESTED=0
[[ "$SPLUNK_DATA_MODE" == "purge" ]] && PURGE_REQUESTED=1

purge_target=""
if [[ "$PURGE_REQUESTED" == "1" ]]; then
    # Is there actually anything to destroy? Ask before prompting, so a purge
    # with no data doesn't demand a scary confirmation for a no-op.
    if [[ "$VAR_MODE" == "dir" ]]; then
        [[ -n "$(ls -A "$SPLUNK_VAR_DIR" 2>/dev/null)" ]] && purge_target="$VAR_DESC"
    else
        docker volume ls -q | grep -qx "$SPLUNK_VAR_VOLUME" && purge_target="$VAR_DESC"
    fi

    if [[ -n "$purge_target" ]]; then
        echo "🔥 --purge: about to DELETE indexes in $purge_target."
        echo "   This destroys every indexed event and the fishbucket."
        echo "   Raw and processed evidence on disk is NOT touched."
        echo ""
        if [[ "$ASSUME_YES" != "1" ]]; then
            if [[ ! -t 0 ]]; then
                echo "❌ --purge needs confirmation and there is no terminal."
                echo "   Pass --yes to confirm non-interactively."
                exit 1
            fi
            read -r -p "Type 'yes' to delete all indexes: " purge_confirm
            if [[ "$purge_confirm" != "yes" ]]; then
                echo "🚫 Aborting. Indexes left intact."
                exit 1
            fi
        fi
        echo ""
    fi
fi

# 🔁 Replace any existing container. Redeploying is the normal path here, not
# an exception, so this does NOT prompt by default. That is only safe because
# index data lives in $VAR_DESC: removing the container no longer destroys
# anything. (The original bug was `docker run --name` with no check at all:
# the second run failed on the name conflict, carried on, then polled
# readiness against the OLD container's logs and exited 0 having deployed
# nothing. dl_replace_container exists so that cannot come back.)
#
# skip_policy is $PURGE_REQUESTED: --purge's documented contract is
# wipe-and-redeploy, so the replace policy is not consulted again — otherwise
# SPLUNK_REPLACE=never would veto the redeploy the operator just confirmed,
# and =ask would ask a second question about the same operation.
DL_REPLACE_NOTE="   Indexes and the fishbucket live in $VAR_DESC and survive the removal.
   (To delete indexes too, use scripts/purge-splunk-container.sh.)"
[[ "$PURGE_REQUESTED" == "1" ]] && DL_REPLACE_NOTE=""
dl_replace_container "$SPLUNK_CONTAINER" "$SPLUNK_REPLACE" "$PURGE_REQUESTED" || exit 1
DL_REPLACE_NOTE=""

# ------------------------------------------------------------------------------
# --purge: delete the index volume — after the container is gone, with the
# operator's answer already in hand.
# ------------------------------------------------------------------------------
if [[ "$PURGE_REQUESTED" == "1" ]]; then
    if [[ -n "$purge_target" ]]; then
        if [[ "$VAR_MODE" == "dir" ]]; then
            echo "🔥 Emptying $SPLUNK_VAR_DIR ..."
            # dl_purge_dir_contents spares .gitkeep, deletes contents rather
            # than the directory (it may be a mount point), and REPORTS
            # failure — the previous version discarded the exit status and
            # printed success while the indexes were still on disk.
            dl_purge_dir_contents "$SPLUNK_VAR_DIR" || exit 1
        else
            docker volume rm "$SPLUNK_VAR_VOLUME" >/dev/null || {
                echo "❌ Could not remove volume '$SPLUNK_VAR_VOLUME'. Aborting."
                exit 1
            }
            echo "✅ Volume removed."
        fi
    else
        echo "ℹ️  No index data in $VAR_DESC; nothing to delete."
    fi
    echo ""

    if [[ "$PURGE_ONLY" == "1" ]]; then
        echo "🛑 --purge-only: container and indexes removed. Not redeploying."
        echo "   Deploy again with: ./scripts/deploy-splunk.sh"
        exit 0
    fi
    echo "   Continuing with the redeploy — Splunk will start with empty indexes."
    echo "   (Use --purge-only if you want to wipe without redeploying.)"
    echo ""
fi

# 🔎 Warn about missing third-party apps before spending time on a deploy.
#
# Splunk_TA_zeek is load-bearing: it does the Zeek TSV parsing and routes
# sourcetype=zeek into zeek:conn / zeek:dns / etc. Without it, Zeek data lands
# in Splunk unparsed. sankey_diagram_app backs three panels in the BASELINE
# BSL-host_triage dashboard.
mkdir -p "$THIRD_PARTY_APP_DIR"

# Glob rather than `ls | grep`, so a package name containing a space or a
# newline cannot confuse the match.
shopt -s nullglob
tp_pkgs=("$THIRD_PARTY_APP_DIR"/*.tgz "$THIRD_PARTY_APP_DIR"/*.tar.gz "$THIRD_PARTY_APP_DIR"/*.spl)
shopt -u nullglob

# Hand the packages to the image's own installer.
#
# The splunk/splunk image reads SPLUNK_APPS_URL (comma-separated) and installs
# each entry during its provisioning role. splunk-ansible's install_apps.yml
# stats a bare local path and uses it directly — only http(s):// and file://
# entries are downloaded — so mounted packages install with no network access,
# which matters because this container has none.
#
# CAVEAT: Splunk's own APP_INSTALL.md documents SPLUNK_APPS_URL as the mechanism
# for URL downloads, and bind-mounting the extracted app directory as the route
# for local apps. Passing a local .tgz path is verified against install_apps.yml
# but is not a documented contract, so a future image could change it. Chosen
# because operators have .tgz packages from Splunkbase, not extracted trees.
# Fallback if it breaks: extract at deploy time and bind-mount each app dir.
# See docs/Ansible.md.
#
# Paths are the CONTAINER-side mount point, not the host path.
APPS_URL_LIST=""
for pkg in "${tp_pkgs[@]}"; do
    APPS_URL_LIST+="${APPS_URL_LIST:+,}/data/dependencies/splunk_apps/$(basename "$pkg")"
done

missing_apps=()
for want in Splunk_TA_zeek sankey_diagram_app; do
    found=0
    # Splunkbase filenames vary — hyphens or underscores, any version suffix.
    needle="$(echo "${want//_/-}" | tr '[:upper:]' '[:lower:]')"
    for pkg in "${tp_pkgs[@]}"; do
        hay="$(basename "$pkg" | tr '[:upper:]_' '[:lower:]-')"
        if [[ "$hay" == *"$needle"* ]]; then found=1; break; fi
    done
    [[ $found -eq 0 ]] && missing_apps+=("$want")
done
if [[ ${#missing_apps[@]} -gt 0 ]]; then
    echo ""
    echo "⚠️  Third-party Splunk app package(s) not found in:"
    echo "      $THIRD_PARTY_APP_DIR"
    for m in "${missing_apps[@]}"; do echo "      • $m"; done
    echo ""
    echo "   These are not shipped with this repository because neither declares a"
    echo "   licence permitting redistribution. Download them from Splunkbase and"
    echo "   place the .tgz/.spl files in the directory above."
    echo ""
    echo "   Impact if you continue:"
    echo "      • Splunk_TA_zeek missing    -> Zeek logs ingest UNPARSED (no field"
    echo "                                     extraction, no zeek:* sourcetypes)"
    echo "      • sankey_diagram_app missing -> 3 panels in the BASELINE"
    echo "                                     BSL-host_triage dashboard will error"
    echo ""
    read -r -p "Continue without them? [y/N]: " continue_missing
    if [[ "${continue_missing,,}" != "y" && "${continue_missing,,}" != "yes" ]]; then
        echo "🚫 Aborting."
        exit 1
    fi
    echo ""
fi

# Splunk admin password.
#
# Redeploying every time means typing this every time, so it can be supplied
# non-interactively. Falls back to prompting when a terminal is available.
#
#   SPLUNK_PASSWORD_FILE=/path/to/file   read the first line (preferred)
#   SPLUNK_PASSWORD=...                  environment
#   otherwise                            prompt, with confirmation
#
# A file is preferred over the environment because the environment of a running
# process is more widely readable. Neither is a strong secret store: the
# password is passed to the container as -e SPLUNK_PASSWORD regardless, so it is
# visible in `docker inspect` either way. Tracked in SECURITY.md.
if [[ -n "${SPLUNK_PASSWORD_FILE:-}" ]]; then
    if [[ ! -r "$SPLUNK_PASSWORD_FILE" ]]; then
        echo "❌ SPLUNK_PASSWORD_FILE is not readable: $SPLUNK_PASSWORD_FILE"
        exit 1
    fi
    SPLUNK_PASSWORD="$(head -n1 "$SPLUNK_PASSWORD_FILE")"
    [[ -z "$SPLUNK_PASSWORD" ]] && { echo "❌ SPLUNK_PASSWORD_FILE is empty."; exit 1; }
    echo "🔑 Password read from $SPLUNK_PASSWORD_FILE"
elif [[ -n "${SPLUNK_PASSWORD:-}" ]]; then
    echo "🔑 Password taken from the environment."
elif [[ -t 0 ]]; then
    while true; do
        read -r -s -p "Enter Splunk admin password (or press Ctrl+C to exit): " SPLUNK_PASSWORD
        echo
        if [[ -z "$SPLUNK_PASSWORD" ]]; then
            echo "❌ No password entered. Exiting..."
            exit 1
        fi
        read -r -s -p "Confirm Splunk admin password: " SPLUNK_PASSWORD_CONFIRM
        echo
        if [[ "$SPLUNK_PASSWORD" == "$SPLUNK_PASSWORD_CONFIRM" ]]; then
            echo "✅ Password confirmed."
            break
        fi
        echo "❌ Passwords do not match. Please try again."
    done
else
    echo "❌ No password available and no terminal to prompt on."
    echo "   Set SPLUNK_PASSWORD_FILE=/path/to/file or SPLUNK_PASSWORD=..."
    exit 1
fi

# Make sure all items in SPLUNK_DFIR/splunk are accessible by splunk.
#
# These paths were previously unquoted. A repository path containing a space
# would word-split and send a recursive, privileged chown/chmod at unintended
# targets. The directory is quoted; the trailing /* is left outside the quotes
# so the glob still expands.
#
# NOTE: 0777 is a workaround for the container/host UID mismatch, not a fix.
# Don't run this on a shared host. Tracked in project-progress.md.
SPLUNK_OWNER="$(whoami):docker"

# Because this project redeploys every time, this runs on every deploy — and it
# is O(files) over data_store/processed, which can hold millions of parsed
# records. On a large case that is minutes of stat+chmod for no change at all.
#
# SPLUNK_SKIP_CHMOD=1 skips it. Only safe once permissions are already correct,
# which after the first successful deploy they usually are. Left ON by default
# because getting it wrong stops the container starting, and a slow deploy is a
# better failure than a broken one.
if [[ "${SPLUNK_SKIP_CHMOD:-0}" == "1" ]]; then
    echo "⏭️  Skipping permission fixup (SPLUNK_SKIP_CHMOD=1)"
else

echo "⚙️ Setting permissions of Splunk_DFIR/splunk/* to $SPLUNK_OWNER and 777"
sudo chown -R "$SPLUNK_OWNER" "$REPO_ROOT_DIR"/splunk/*
sudo chmod -R 777 "$REPO_ROOT_DIR"/splunk/*
echo "⚙️ Setting permissions of $REPO_ROOT_DIR/data_store/* to $SPLUNK_OWNER and 777"
sudo chown -R "$SPLUNK_OWNER" "$REPO_ROOT_DIR"/data_store/*
sudo chmod -R 777 "$REPO_ROOT_DIR"/data_store/*
echo "⚙️ Setting permissions of $REPO_ROOT_DIR/ansible/* to $SPLUNK_OWNER and 777"
sudo chown -R "$SPLUNK_OWNER" "$REPO_ROOT_DIR"/ansible/*
sudo chmod -R 777 "$REPO_ROOT_DIR"/ansible/*

fi

# ------------------------------------------------------------------------------
# Isolated network — shared with deploy-kusto.sh. The lib uses a bridge with IP
# masquerade disabled, NOT --internal: an internal network has no external
# connectivity in EITHER direction, so published ports stop working — that
# shipped here once as an unreachable UI while the one-directional egress check
# passed. The lib also detects and recreates a leftover --internal network from
# that version. Weaker than a firewall rule (it breaks return traffic rather
# than dropping packets), so it is verified after start, in both directions.
# ------------------------------------------------------------------------------
NETWORK_ARGS=()
if [[ "$SPLUNK_ISOLATED" == "1" ]]; then
    dl_ensure_isolated_network "$SPLUNK_NETWORK" "$SPLUNK_CONTAINER" || exit 1
    NETWORK_ARGS=(--network "$SPLUNK_NETWORK")
else
    echo "⚠️  SPLUNK_ISOLATED=0 — container will have outbound network access."
fi

echo "🚀 Building Splunk Enterprise Docker container..."

echo "⚙️ Mounting:      $REPO_ROOT_DIR/splunk/etc --> /data/etc:ro"
echo "⚙️ Mounting:      $REPO_ROOT_DIR/data_store/processed --> /data/processed:ro"
echo "⚙️ Mounting:      $REPO_ROOT_DIR/ansible/playbooks --> /data/ansible/playbooks:ro"
echo "⚙️ Mounting:      $THIRD_PARTY_APP_DIR --> /data/dependencies/splunk_apps:ro"
echo "🔒 Network:       $([[ "$SPLUNK_ISOLATED" == "1" ]] && echo "$SPLUNK_NETWORK (no IP masquerade — no egress)" || echo "default bridge (egress ALLOWED)")"
echo "🔒 Published on:  $SPLUNK_BIND_ADDR:8000 (web), $SPLUNK_BIND_ADDR:8088 (HEC)"
if [[ -n "$APPS_URL_LIST" ]]; then
    echo "📦 SPLUNK_APPS_URL: ${#tp_pkgs[@]} package(s) for the image to install"
else
    echo "📦 SPLUNK_APPS_URL: (none — no packages found)"
fi
echo "📦 Indexes:       $VAR_DESC --> /opt/splunk/var"

# ------------------------------------------------------------------------------
# Bind-mount mode: the host directory must be owned by the image's splunk user
# or splunkd cannot write its own data directory and the container dies during
# startup, with the reason buried in the container log.
#
# A named volume does not need this — Docker seeds it from the image, ownership
# included. That is the only reason the volume is the default.
#
# The UID is read from the image rather than hardcoded, so this survives an
# upstream change; 41812 is the fallback.
# ------------------------------------------------------------------------------
if [[ "$VAR_MODE" == "dir" ]]; then
    SPLUNK_UID=$(docker run --rm --entrypoint id splunk/splunk:latest -u splunk 2>/dev/null | tr -dc '0-9')
    SPLUNK_UID="${SPLUNK_UID:-41812}"
    current_owner=$(stat -c '%u' "$SPLUNK_VAR_DIR" 2>/dev/null || echo "")
    if [[ "$current_owner" != "$SPLUNK_UID" ]]; then
        echo "🔑 Giving $SPLUNK_VAR_DIR to the container's splunk user (uid $SPLUNK_UID)..."
        if sudo chown -R "$SPLUNK_UID:$SPLUNK_UID" "$SPLUNK_VAR_DIR"; then
            echo "   ✅ Done."
        else
            echo "   ⚠️  chown failed. Splunk will probably fail to start, because"
            echo "      splunkd cannot write $SPLUNK_VAR_DIR. Fix with:"
            echo "        sudo chown -R $SPLUNK_UID:$SPLUNK_UID '$SPLUNK_VAR_DIR'"
            echo "      or drop --var-dir to use a Docker volume instead."
        fi
    fi
fi
echo ""

# Define Ansible pre-tasks
ANSIBLE_PRE_TASKS="file:///data/ansible/playbooks/Include-Custom-Apps.yml,file:///data/ansible/playbooks/Include-local-conf.yml,file:///data/ansible/playbooks/remove_first_login.yml"

# Overrides must run AFTER the provisioning role, because that is when
# SPLUNK_APPS_URL installs the third-party apps. site.yml runs
# pre_tasks -> role -> post_tasks, so as a pre-task this would write into app
# directories that do not exist yet and silently do nothing.
ANSIBLE_POST_TASKS="file:///data/ansible/playbooks/Apply-App-Overrides.yml"

echo "📖 Queued Ansible Playbooks:"
IFS=',' read -ra TASKS <<< "$ANSIBLE_PRE_TASKS"
for task in "${TASKS[@]}"; do
    echo "📋 ${task#file:///data/ansible/playbooks/}"
done
echo "- find more @ $REPO_ROOT_DIR/ansible" 
sleep 3
echo ""

# insert memes
echo "🚀 docker go brrr"
echo "🫡 loading in your apps now with ansible"
sleep 0.1
echo "        ⠀  _______________  "
sleep 0.1
echo "        ⠀ /      ZERO      \ "
sleep 0.1
echo "        ⠀ |      SUGAR     |"
sleep 0.1
echo "        ⠀ |----------------|"
sleep 0.1
echo "        ⠀ |  ██        ██  |"   
sleep 0.1
echo "        ⠀ |  ████     ███  |"  
sleep 0.1
echo "        ⠀ |  █████   ██ ██ |"  
sleep 0.1
echo "        ⠀ |  ██  █████  ██ |" 
sleep 0.1
echo "        ⠀ |  ██   ████  ██ |"
sleep 0.1
echo "        ⠀ |  ██    ███  ██ |"
sleep 0.1
echo "        ⠀ |  ██    ███  ██ |"
sleep 0.1
echo "        ⠀ |  ██    ██   ██ |"
sleep 0.1
echo "        ⠀ |  ██    ██   ██ |"       
sleep 0.1
echo "        ⠀ |  ██     █   ██ |"
sleep 0.1
echo "          |________________|"
sleep 0.1
echo "        ⠀ |      MONSTER   |"
sleep 0.1
echo "        ⠀ |      ENERGY    |"
sleep 0.1
echo "        ⠀ |________________|"
sleep 0.1
echo "        ⠀ |       ZERO     |"
sleep 0.1
echo "        ⠀ |       ULTRA    |"
sleep 0.1
echo "        ⠀ \________________/"
sleep 1
echo
echo "done. punch it chewie 🧌"
echo

# Run Splunk Enterprise container with ansible_pre_tasks defined.
# Capture the container ID so readiness is checked against THIS container and
# never against a leftover one with the same name.
SPLUNK_CID=$(docker run -d --name "$SPLUNK_CONTAINER" \
    --hostname splunk-enterprise \
    "${NETWORK_ARGS[@]}" \
    -p "$SPLUNK_BIND_ADDR":8088:8088 \
    -p "$SPLUNK_BIND_ADDR":8000:8000 \
    -v "$REPO_ROOT_DIR/splunk/etc":/data/etc:ro \
    -v "$VAR_MOUNT" \
    -v "$REPO_ROOT_DIR/data_store/processed":/data/processed:ro \
    -v "$REPO_ROOT_DIR/ansible/playbooks":/data/ansible/playbooks:ro \
    -v "$THIRD_PARTY_APP_DIR":/data/dependencies/splunk_apps:ro \
    -e SPLUNK_HTTP_ENABLESSL=true \
    -e SPLUNK_PASSWORD="$SPLUNK_PASSWORD" \
    -e SPLUNK_GENERAL_TERMS=--accept-sgt-current-at-splunk-com \
    -e SPLUNK_START_ARGS=--accept-license \
    -e SPLUNK_DISABLE_POPUPS='True' \
    -e SPLUNK_ROLE=splunk_standalone \
    -e SPLUNK_ANSIBLE_PRE_TASKS="$ANSIBLE_PRE_TASKS" \
    -e SPLUNK_ANSIBLE_POST_TASKS="$ANSIBLE_POST_TASKS" \
    -e SPLUNK_APPS_URL="$APPS_URL_LIST" \
    splunk/splunk:latest)

if [[ -z "$SPLUNK_CID" ]]; then
    echo "❌ docker run failed — no container was started."
    exit 1
fi
echo "🆔 Container: ${SPLUNK_CID:0:12}"

# 🪵 Stream all logs in background so the wait isn't a blank screen. The lib
# tracks the PID: `docker logs -f` never exits on its own and would bury every
# verification line printed below — which is how the unreachable-UI bug went
# unnoticed for as long as it did.
dl_start_log_stream "$SPLUNK_CID"
# Covers the early `exit 1` paths below as well as a normal finish.
trap dl_stop_log_stream EXIT

# ⏳ In parallel, wait until Ansible is complete.
#
# Splunk gives this script nothing better than a log grep to poll (the Kusto
# deploy asks its engine directly). Polls by container ID, not name, and
# dl_wait_ready bails out if the container dies — a crashed container used to
# look identical to a slow one until timeout. It also counts REAL elapsed time:
# the old loop counted only its sleeps, and each `docker logs` pass over a
# growing log takes time of its own, so the timeout ran long.
splunk_ansible_complete() {
    docker logs "$SPLUNK_CID" 2>&1 | grep -q "Ansible playbook complete, will begin streaming splunkd_stderr.log"
}

echo "⏳ Waiting for Ansible to complete inside container (timeout ${SPLUNK_READY_TIMEOUT}s)..."
ready_rc=0
dl_wait_ready "$SPLUNK_CID" "$SPLUNK_READY_TIMEOUT" 2 splunk_ansible_complete || ready_rc=$?
if (( ready_rc == 2 )); then
    # The container died; dl_wait_ready printed its exit code and a logs hint.
    exit 1
fi
if (( ready_rc != 0 )); then
    echo "❌ Timeout after ${SPLUNK_READY_TIMEOUT}s waiting for Ansible playbook to complete."
    echo "   Raise it with:  SPLUNK_READY_TIMEOUT=1200 $0"
    exit 1
fi

# Stop the log firehose here. Everything below is verification output, and it
# is the part you actually need to read.
dl_stop_log_stream
echo ""
echo "✅ Ansible complete.  (log streaming stopped — follow with:"
echo "   docker logs -f $SPLUNK_CONTAINER)"
sleep 1
echo
echo "Splunk initialising..."
echo
echo "Splunk will be available at: https://localhost:8000"
echo


# Ensure the container is running before proceeding. Checked by ID so a
# same-named leftover cannot satisfy this.
if [[ "$(docker inspect -f '{{.State.Running}}' "$SPLUNK_CID" 2>/dev/null)" != "true" ]]; then
    echo "❌ Error: Splunk container failed to start!"
    exit 1
fi

# ------------------------------------------------------------------------------
# Prove the isolation rather than assume it. Disabled masquerade is a claim
# about Docker's behaviour on THIS host, not something to take on faith — a
# security control that silently does not hold is worse than no control,
# because it is believed. The lib probes with bash /dev/tcp against an IP, so
# the result depends on neither curl nor DNS inside the container.
# ------------------------------------------------------------------------------
if [[ "$SPLUNK_ISOLATED" == "1" ]]; then
    dl_verify_egress_blocked "$SPLUNK_CID" "$SPLUNK_NETWORK"
fi

# Confirm the published ports really did bind where we asked. Docker inserts
# its own iptables rules ahead of the host firewall, so a wrong bind address is
# not something ufw will save you from. Fatal now (it used to warn and carry
# on): a port exposed to the LAN when localhost was requested means the deploy
# is not what was asked for, on a host holding evidence.
dl_assert_port_bindings "$SPLUNK_CID" "$SPLUNK_BIND_ADDR" || {
    echo "      The container is still running and exposed — remove it with:"
    echo "        docker rm -f $SPLUNK_CONTAINER"
    exit 1
}
echo ""

# ------------------------------------------------------------------------------
# Ingress check — can we actually REACH Splunk?
#
# This is the check that was missing. The previous version verified only that
# egress was blocked, so when `--internal` also blocked published ports the
# deploy reported success while the UI was unreachable. A one-directional test
# of a two-directional property.
#
# Splunk Web takes a while after Ansible finishes, so retry rather than
# one-shot.
# ------------------------------------------------------------------------------
echo "🔎 Verifying Splunk is reachable on $SPLUNK_BIND_ADDR:8000 ..."
ingress_ok=0
for _ in $(seq 1 30); do
    if curl -sk --max-time 4 -o /dev/null "https://$SPLUNK_BIND_ADDR:8000" 2>/dev/null \
       || curl -s  --max-time 4 -o /dev/null "http://$SPLUNK_BIND_ADDR:8000" 2>/dev/null; then
        ingress_ok=1; break
    fi
    sleep 4
done

if [[ $ingress_ok -eq 1 ]]; then
    echo "   ✅ Reachable at https://$SPLUNK_BIND_ADDR:8000"
else
    echo ""
    echo "   ╔══════════════════════════════════════════════════════════════╗"
    echo "   ║  ❌ SPLUNK IS NOT REACHABLE — the deploy is not usable        ║"
    echo "   ╚══════════════════════════════════════════════════════════════╝"
    echo ""
    echo "   The container is running but nothing answers on"
    echo "   $SPLUNK_BIND_ADDR:8000."
    echo ""
    if [[ "$SPLUNK_ISOLATED" == "1" ]]; then
        echo "   Most likely the network isolation is blocking inbound traffic."
        echo "   Recover with:"
        echo "     ./scripts/deploy-splunk.sh --no-isolated"
        echo ""
        echo "   Then please report it on:"
        echo "     https://github.com/Get-Sybers/Splunk_DFIR/issues/11"
    else
        echo "   Splunk may still be starting. Check:"
        echo "     docker logs $SPLUNK_CONTAINER"
    fi
    echo ""
    exit 1
fi
echo ""

echo "✅ Splunk container setup completed successfully!"
echo ""
echo "─────────────────────────────────────────────────────────────"
echo " This project assumes the container is redeployed every time."
echo " What that means:"
echo ""
if [[ "$SPLUNK_DATA_MODE" == "purge" ]]; then
echo "  PURGED     $VAR_DESC was emptied this run —"
echo "             Splunk started with empty indexes and an empty fishbucket,"
echo "             so monitored files will be re-read from scratch."
else
echo "  PERSISTS   /opt/splunk/var  ->  $VAR_DESC"
echo "             • indexed events survive the redeploy"
echo "             • the fishbucket survives too, so already-ingested"
echo "               files are NOT re-read and events are not duplicated"
fi
echo ""
echo "  REBUILT    /opt/splunk/etc  (container-local, every deploy)"
echo "             • apps and confs are re-seeded from splunk/etc by the"
echo "               pre-task playbooks — so edits there take effect on the"
echo "               next deploy, which is the point"
echo "             • changes made in the Splunk UI are LOST"
echo ""
echo ""
echo "  NETWORK    $([[ "$SPLUNK_ISOLATED" == "1" ]] && echo "isolated ($DL_ISOLATION_VERDICT) — no route off this host" || echo "NOT isolated — outbound allowed")"
echo "             reachable on $SPLUNK_BIND_ADDR only"
echo ""
echo " To wipe indexes as well: scripts/purge-splunk-container.sh"
echo "─────────────────────────────────────────────────────────────"