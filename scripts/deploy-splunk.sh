#!/bin/bash

set -o pipefail

# Ensure correct filepath assigned when referenced
SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"  # Resolves full path
REPO_ROOT_DIR="$(realpath "$SCRIPT_DIR/..")"

SPLUNK_CONTAINER="splunk-enterprise"

# Splunk's index data lives in /opt/splunk/var inside the container. It is kept
# in a named Docker volume so it survives `docker rm`. This used to bind-mount
# $REPO_ROOT_DIR/splunk/var at /data/var — a path Splunk never reads — which
# meant every index was destroyed with the container. A named volume is used
# rather than a bind mount because Docker seeds it from the image on first use,
# preserving the container's splunk-user ownership; a host bind mount over
# /opt/splunk/var starts empty and breaks startup on a UID mismatch.
SPLUNK_VAR_VOLUME="${SPLUNK_VAR_VOLUME:-splunk-dfir-var}"

# How long to wait for the container's internal Ansible run to finish. The
# first run also pulls the image, so this needs to be generous.
SPLUNK_READY_TIMEOUT="${SPLUNK_READY_TIMEOUT:-600}"

# Third-party Splunk apps are no longer vendored in this repository — neither
# Splunk_TA_zeek nor sankey_diagram_app declares a licence permitting
# redistribution. Drop their Splunkbase packages (.tgz/.spl) here and they are
# installed into the container at start by Install-ThirdParty-Apps.yml.
THIRD_PARTY_APP_DIR="${THIRD_PARTY_APP_DIR:-$REPO_ROOT_DIR/data_store/dependencies/splunk_apps}"

# Whether this deploy keeps the index volume or wipes it.
#   persist (default) — redeploy, keep every indexed event and the fishbucket
#   purge             — redeploy from a clean slate, deleting the volume
# Network isolation.
#
# This container holds evidence. It has no business making outbound connections,
# and no business being reachable from the LAN.
#
#   SPLUNK_ISOLATED=1  attach to an --internal Docker network, which has no
#                      route off the host. Splunk cannot phone home, check for
#                      updates, or reach Splunkbase.
#   SPLUNK_BIND_ADDR   host address the published ports bind to. 127.0.0.1 means
#                      only this machine can reach the UI. The previous
#                      behaviour, `-p 8000:8000`, bound 0.0.0.0 — every
#                      interface, so anyone on the network could reach it.
#
# NOTE: --internal blocks egress off the host. Containers on the network can
# still reach each other and services on the host's bridge address. This is
# isolation from the network, not an airgap.
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

Container:
  --ask              Prompt before replacing an existing container.
  --no-replace       Abort if a container already exists.

Network:
  --isolated         Attach to an --internal Docker network so the container
                     has no route off the host.                     (default)
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

# 🔁 Replace any existing container. Redeploying is the normal path here, not
# an exception, so this does NOT prompt by default.
#
# That is only safe because index data lives in a named volume: removing the
# container no longer destroys anything. Before that fix, `docker rm` meant
# silent total data loss, and an unattended replace would have been reckless.
#
# It still must not simply collide. The original bug was `docker run --name`
# with no check at all: the second run failed on the name conflict, carried on
# (no `set -e`), then polled readiness by grepping the OLD container's logs,
# matched the completion string instantly, and exited 0 having deployed nothing.
#
#   --ask / SPLUNK_REPLACE=ask         prompt before removing
#   --no-replace / SPLUNK_REPLACE=never  abort if a container already exists
#   default                            remove and redeploy, no prompt

if docker ps -a --format '{{.Names}}' | grep -qx "$SPLUNK_CONTAINER"; then
    echo "🔁 Existing container found:"
    docker ps -a --filter "name=^${SPLUNK_CONTAINER}$" --format '   {{.Names}}  {{.Status}}  ({{.Image}})'
    echo ""

    case "$SPLUNK_REPLACE" in
        never)
            echo "🚫 SPLUNK_REPLACE=never — aborting, container left untouched."
            exit 1
            ;;
        ask)
            read -r -p "Remove it and redeploy? [y/N]: " replace_existing
            if [[ "${replace_existing,,}" != "y" && "${replace_existing,,}" != "yes" ]]; then
                echo "🚫 Aborting. Existing container left untouched."
                exit 1
            fi
            ;;
        always) ;;
        *)
            echo "❌ SPLUNK_REPLACE must be always|ask|never (got '$SPLUNK_REPLACE')."
            exit 1
            ;;
    esac

    echo "   Indexes and the fishbucket live in volume '$SPLUNK_VAR_VOLUME' and survive this."
    echo "   (To delete indexes too, use scripts/purge-splunk-container.sh.)"
    echo "🛑 Removing container..."
    docker rm -f "$SPLUNK_CONTAINER" >/dev/null || {
        echo "❌ Could not remove '$SPLUNK_CONTAINER'. Aborting."
        exit 1
    }
    echo "✅ Removed."
    echo ""
fi

# ------------------------------------------------------------------------------
# --purge: delete the index volume.
#
# Must happen AFTER the container is removed — Docker refuses to remove a volume
# that is still attached to one. This is the destructive path, so it confirms
# unless --yes, and refuses outright if there is no way to confirm.
# ------------------------------------------------------------------------------
if [[ "$SPLUNK_DATA_MODE" == "purge" ]]; then
    if docker volume ls -q | grep -qx "$SPLUNK_VAR_VOLUME"; then
        echo "🔥 --purge: about to DELETE volume '$SPLUNK_VAR_VOLUME'."
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
        docker volume rm "$SPLUNK_VAR_VOLUME" >/dev/null || {
            echo "❌ Could not remove volume '$SPLUNK_VAR_VOLUME'. Aborting."
            exit 1
        }
        echo "✅ Volume removed."
    else
        echo "ℹ️  Volume '$SPLUNK_VAR_VOLUME' does not exist; nothing to delete."
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
    read -p "Continue without them? [y/N]: " continue_missing
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
# Isolated network
# ------------------------------------------------------------------------------
# A `--internal` network was used here originally. That was wrong: an internal
# network has no external connectivity in EITHER direction, so published ports
# stop working and the Splunk UI becomes unreachable from the host. The egress
# check passed while the UI was dead, because it only tested one direction.
#
# Instead: a normal user-defined bridge with IP masquerade disabled. Published
# ports still work (that is inbound DNAT), but outbound traffic leaves with an
# unroutable source address and gets no reply, so the container cannot usefully
# reach anything off the host.
#
# This is weaker than a firewall rule — it breaks return traffic rather than
# dropping the packet — so it is verified after start rather than assumed, and
# both directions are checked now.
NETWORK_ARGS=()
if [[ "$SPLUNK_ISOLATED" == "1" ]]; then
    if docker network inspect "$SPLUNK_NETWORK" >/dev/null 2>&1; then
        if [[ "$(docker network inspect -f '{{.Internal}}' "$SPLUNK_NETWORK" 2>/dev/null)" == "true" ]]; then
            # Left behind by the earlier, broken version of this script. It
            # makes the UI unreachable, so replace it rather than attach.
            echo "♻️  Network '$SPLUNK_NETWORK' is --internal, which blocks published"
            echo "    ports and makes Splunk unreachable. Recreating it correctly..."
            docker network rm "$SPLUNK_NETWORK" >/dev/null 2>&1 || {
                echo "❌ Could not remove '$SPLUNK_NETWORK' — is a container still on it?"
                echo "   Try: docker rm -f $SPLUNK_CONTAINER && docker network rm $SPLUNK_NETWORK"
                exit 1
            }
            docker network create \
                --opt com.docker.network.bridge.enable_ip_masquerade=false \
                "$SPLUNK_NETWORK" >/dev/null || {
                echo "❌ Could not recreate network '$SPLUNK_NETWORK'."; exit 1; }
            echo "    ✅ Recreated."
        else
            echo "🔒 Using network: $SPLUNK_NETWORK"
        fi
    else
        echo "🔒 Creating network (no IP masquerade): $SPLUNK_NETWORK"
        docker network create \
            --opt com.docker.network.bridge.enable_ip_masquerade=false \
            "$SPLUNK_NETWORK" >/dev/null || {
            echo "❌ Could not create network '$SPLUNK_NETWORK'."; exit 1; }
    fi
    NETWORK_ARGS=(--network "$SPLUNK_NETWORK")
else
    echo "⚠️  SPLUNK_ISOLATED=0 — container will have outbound network access."
fi

echo "🚀 Building Splunk Enterprise Docker container..."

echo "⚙️ Mounting:      $REPO_ROOT_DIR/splunk/etc --> /data/etc:ro"
echo "⚙️ Mounting:      $REPO_ROOT_DIR/data_store/processed --> /data/processed:ro"
echo "⚙️ Mounting:      $REPO_ROOT_DIR/ansible/playbooks --> /data/ansible/playbooks:ro"
echo "⚙️ Mounting:      $THIRD_PARTY_APP_DIR --> /data/dependencies/splunk_apps:ro"
echo "🔒 Network:       $([[ "$SPLUNK_ISOLATED" == "1" ]] && echo "$SPLUNK_NETWORK (internal — no egress)" || echo "default bridge (egress ALLOWED)")"
echo "🔒 Published on:  $SPLUNK_BIND_ADDR:8000 (web), $SPLUNK_BIND_ADDR:8088 (HEC)"
if [[ -n "$APPS_URL_LIST" ]]; then
    echo "📦 SPLUNK_APPS_URL: ${#tp_pkgs[@]} package(s) for the image to install"
else
    echo "📦 SPLUNK_APPS_URL: (none — no packages found)"
fi
echo "📦 Volume:        $SPLUNK_VAR_VOLUME --> /opt/splunk/var  (indexes persist here)"
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
    -v "$SPLUNK_VAR_VOLUME":/opt/splunk/var \
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

# 🪵 Stream all logs immediately in background, so the wait isn't a blank screen.
#
# The PID is tracked because this has to be STOPPED once the wait is over.
# `docker logs -f` never exits on its own, and bash does not SIGHUP background
# jobs when a non-interactive script exits — so without this it outlives the
# script and keeps writing to the terminal. Worse, everything the deploy prints
# after this point (isolation verdict, port bindings, the reachability failure
# banner) would be interleaved with a log firehose and effectively invisible.
#
# That is not hypothetical: it is how the unreachable-UI bug went unnoticed for
# as long as it did. The original script started this stream immediately before
# exiting, so it never mattered; it only became a problem once verification
# steps were added after it.
docker logs -f "$SPLUNK_CID" &
LOG_STREAM_PID=$!

stop_log_stream() {
    if [[ -n "${LOG_STREAM_PID:-}" ]] && kill -0 "$LOG_STREAM_PID" 2>/dev/null; then
        kill "$LOG_STREAM_PID" 2>/dev/null || true
        wait "$LOG_STREAM_PID" 2>/dev/null || true
    fi
    LOG_STREAM_PID=""
}
# Covers the early `exit 1` paths below as well as a normal finish.
trap stop_log_stream EXIT

# ⏳ In parallel, wait until Ansible is complete
echo "⏳ Waiting for Ansible to complete inside container (timeout ${SPLUNK_READY_TIMEOUT}s)..."

timeout=$SPLUNK_READY_TIMEOUT
elapsed=0
interval=2

# Poll by container ID, not by name. Also bail out if the container dies —
# otherwise a crashed container looks identical to a slow one until timeout.
while ! docker logs "$SPLUNK_CID" 2>&1 | grep -q "Ansible playbook complete, will begin streaming splunkd_stderr.log"; do
    if [[ "$(docker inspect -f '{{.State.Running}}' "$SPLUNK_CID" 2>/dev/null)" != "true" ]]; then
        echo "❌ Container exited before Ansible finished (exit code $(docker inspect -f '{{.State.ExitCode}}' "$SPLUNK_CID" 2>/dev/null))."
        echo "   Logs:  docker logs ${SPLUNK_CID:0:12}"
        exit 1
    fi
    sleep $interval
    ((elapsed+=interval))
    if [[ $elapsed -ge $timeout ]]; then
        echo "❌ Timeout after ${timeout}s waiting for Ansible playbook to complete."
        echo "   Raise it with:  SPLUNK_READY_TIMEOUT=1200 $0"
        exit 1
    fi
done

# Stop the log firehose here. Everything below is verification output, and it
# is the part you actually need to read.
stop_log_stream
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
# Prove the isolation rather than assume it.
#
# --internal is documented to block egress, but that is a claim about Docker's
# behaviour on THIS host and Docker version, not something this script can take
# on faith. A security control that silently does not hold is worse than no
# control, because it is believed. So: test it, from inside the container.
#
# Uses bash's /dev/tcp against an IP rather than curl against a hostname, so the
# result does not depend on curl being installed or on DNS.
# ------------------------------------------------------------------------------
ISOLATION_VERDICT="not checked"
if [[ "$SPLUNK_ISOLATED" == "1" ]]; then
    echo "🔎 Verifying the container cannot reach the network..."
    if docker exec "$SPLUNK_CID" bash -c 'true' >/dev/null 2>&1; then
        if docker exec "$SPLUNK_CID" bash -c \
             'timeout 4 bash -c "echo > /dev/tcp/1.1.1.1/443" 2>/dev/null' >/dev/null 2>&1; then
            ISOLATION_VERDICT="FAILED"
        else
            ISOLATION_VERDICT="confirmed"
        fi
    else
        ISOLATION_VERDICT="could not test"
    fi

    case "$ISOLATION_VERDICT" in
        confirmed)
            echo "   ✅ Outbound TCP blocked — isolation holds."
            ;;
        "could not test")
            echo "   ⚠️  Could not run the test inside the container (no shell?)."
            echo "      Isolation is UNVERIFIED. Check manually:"
            echo "        docker exec $SPLUNK_CONTAINER bash -c 'echo > /dev/tcp/1.1.1.1/443'"
            ;;
        FAILED)
            echo ""
            echo "   ⚠️  ISOLATION NOT HOLDING — the container reached the network."
            echo ""
            echo "      It is running and usable, but it can make outbound"
            echo "      connections. That matters: it holds evidence."
            echo ""
            echo "      Disabling IP masquerade breaks return traffic rather than"
            echo "      dropping packets, so a host with its own forwarding rules"
            echo "      can still let traffic through. For a hard guarantee, add a"
            echo "      DOCKER-USER firewall rule for this network's subnet:"
            echo "        docker network inspect $SPLUNK_NETWORK -f '{{(index .IPAM.Config 0).Subnet}}'"
            echo ""
            echo "      Not failing the deploy — a weakened control is not a reason"
            echo "      to leave you without a working Splunk. Reported so you can"
            echo "      decide."
            echo ""
            ;;
    esac
fi

# Confirm the published ports really did bind where we asked. Docker inserts its
# own iptables rules ahead of the host firewall, so a wrong bind address is not
# something ufw will save you from.
echo "🔎 Published port bindings:"
docker port "$SPLUNK_CID" 2>/dev/null | sed 's/^/   /' || echo "   (could not read)"
if [[ "$SPLUNK_BIND_ADDR" != "0.0.0.0" ]]; then
    if docker port "$SPLUNK_CID" 2>/dev/null | grep -q "0\.0\.0\.0"; then
        echo "   ⚠️  A port is bound to 0.0.0.0 despite SPLUNK_BIND_ADDR=$SPLUNK_BIND_ADDR"
        echo "      That port is reachable from the network."
    else
        echo "   ✅ Bound to $SPLUNK_BIND_ADDR only — not reachable from the LAN."
    fi
fi
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
echo "  PURGED     volume '$SPLUNK_VAR_VOLUME' was deleted this run —"
echo "             Splunk started with empty indexes and an empty fishbucket,"
echo "             so monitored files will be re-read from scratch."
else
echo "  PERSISTS   /opt/splunk/var  ->  volume '$SPLUNK_VAR_VOLUME'"
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
echo "  NETWORK    $([[ "$SPLUNK_ISOLATED" == "1" ]] && echo "isolated ($ISOLATION_VERDICT) — no route off this host" || echo "NOT isolated — outbound allowed")"
echo "             reachable on $SPLUNK_BIND_ADDR only"
echo ""
echo " To wipe indexes as well: scripts/purge-splunk-container.sh"
echo "─────────────────────────────────────────────────────────────"