#!/bin/bash
#
# Deploy the Azure Data Explorer Kusto emulator for offline DFIR analysis.
#
# Stage 1 of the Kusto port — see docs/Kusto-Port.md for the design and the
# Microsoft documentation it is based on.
#
# The container lifecycle (replace policy, isolated network, readiness with
# died-container detection, log-stream management, isolation verified in BOTH
# directions, honest directory purge) lives in lib/docker-lifecycle.sh — each
# function there encodes a defect this project paid for, several of them on
# the retired Splunk path.
#
# Two things differ deliberately, and both come from Microsoft's own docs:
#
#   1. The database is EPHEMERAL by default. The emulator docs recommend
#      against persisting data outside the container ("potential incompatibility
#      between emulator versions and lack of extent merging"). data_store/processed
#      is the source of truth and re-ingest is cheap, so redeploy + re-ingest is
#      the intended workflow. --persist opts in, with that caveat.
#
#   2. Readiness is a real health check, not a log grep. The emulator exposes a
#      management endpoint, so this polls `.show version` and only reports ready
#      when the engine actually answers.
#
# ⚠️ The emulator has NO security whatsoever — no authentication, no access
#    control, plaintext HTTP, no encryption at rest. On a host holding evidence
#    the localhost binding is the only control there is.

set -o pipefail

SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"
REPO_ROOT_DIR="$(realpath "$SCRIPT_DIR/..")"

# KUSTO_CONTAINER and KUSTO_PORT defaults live in lib/kusto-api.sh (sourced
# after the argument parse); re-declaring them here made two sources of truth.
KUSTO_IMAGE="${KUSTO_IMAGE:-mcr.microsoft.com/azuredataexplorer/kustainer-linux:latest}"

# Docs: "at least 2 GB of RAM (4 GB or more recommended)".
KUSTO_MEMORY="${KUSTO_MEMORY:-4G}"

KUSTO_BIND_ADDR="${KUSTO_BIND_ADDR:-127.0.0.1}"

# The image is several GB; the first pull is slow.
KUSTO_READY_TIMEOUT="${KUSTO_READY_TIMEOUT:-900}"

# Ephemeral by default — see the header. --persist mounts this at /kustodata.
KUSTO_PERSIST="${KUSTO_PERSIST:-0}"
KUSTO_DATA_DIR="${KUSTO_DATA_DIR:-$REPO_ROOT_DIR/data_store/kusto}"

KUSTO_ISOLATED="${KUSTO_ISOLATED:-1}"
KUSTO_NETWORK="${KUSTO_NETWORK:-kusto-dfir-isolated}"

KUSTO_REPLACE="${KUSTO_REPLACE:-always}"
ASSUME_YES="${ASSUME_YES:-0}"
PURGE_ONLY="${PURGE_ONLY:-0}"

usage() {
    cat <<'USAGE'
Usage: deploy-kusto.sh [OPTIONS]

Deploys the Kusto emulator for offline analysis. The database is ephemeral by
default: redeploy and re-ingest rather than persisting, which is what Microsoft
recommends for this image.

Data:
  --ephemeral        Database lives and dies with the container.   (default)
                     Re-ingest from data_store/processed after a redeploy.
  --persist          Mount a host directory at /kustodata so databases survive.
                     ⚠️  Microsoft advises against this: emulator versions may
                     not read each other's on-disk format, and with no extent
                     merging the data never compacts.
  --data-dir PATH    Where --persist stores databases.
                     (default data_store/kusto)
  --purge            Delete the container and any persisted data, then deploy.
  --purge-only       Delete the container and persisted data, then STOP.

Container:
  --ask              Prompt before replacing an existing container.
  --no-replace       Abort if a container already exists.

Network:
  --isolated         Attach to a bridge with IP masquerade disabled, so the
                     container gets no useful egress.               (default)
  --no-isolated      Allow outbound network access.
  --bind ADDR        Host address to publish on.       (default 127.0.0.1)
                     ⚠️  The emulator has NO authentication and speaks plain
                     HTTP. Binding it anywhere but localhost exposes an
                     unauthenticated view of your evidence.
  --port PORT        Host port.                                (default 8080)

Other:
  -y, --yes          Assume yes to prompts.
  -h, --help         Show this and exit.

Environment (flags win):
  KUSTO_IMAGE            container image
  KUSTO_MEMORY           memory limit                        (default 4G)
  KUSTO_READY_TIMEOUT    seconds to wait for the engine      (default 900)
  KUSTO_BIND_ADDR        publish address              (default 127.0.0.1)
  KUSTO_PERSIST          1 to persist                        (default 0)
  KUSTO_DATA_DIR         persist location
  KUSTO_ISOLATED         1 isolated, 0 allow egress          (default 1)
  KUSTO_REPLACE          always | ask | never
  KUSTO_PORT             host port                           (default 8080)
  KUSTO_CONTAINER        container name             (default kusto-emulator)
  KUSTO_NETWORK          isolated network name  (default kusto-dfir-isolated)

Licence:
  Starting the container sets ACCEPT_EULA=Y, accepting Microsoft's Software
  License Terms on your behalf. The emulator is provided "as-is, without any
  support or warranties" and is "generally unsuitable for production
  workloads". See docs/Kusto-Port.md.
USAGE
}

while [[ $# -gt 0 ]]; do
    case "$1" in
        --ephemeral)   KUSTO_PERSIST=0 ;;
        --persist)     KUSTO_PERSIST=1 ;;
        --data-dir)
            [[ -n "${2:-}" ]] || { echo "❌ --data-dir needs a PATH."; exit 1; }
            KUSTO_DATA_DIR="$2"; shift ;;
        --purge)       PURGE=1 ;;
        --purge-only)  PURGE=1; PURGE_ONLY=1 ;;
        --ask)         KUSTO_REPLACE="ask" ;;
        --no-replace)  KUSTO_REPLACE="never" ;;
        --isolated)    KUSTO_ISOLATED=1 ;;
        --no-isolated) KUSTO_ISOLATED=0 ;;
        --bind)
            [[ -n "${2:-}" ]] || { echo "❌ --bind needs an ADDRESS."; exit 1; }
            KUSTO_BIND_ADDR="$2"; shift ;;
        --port)
            [[ -n "${2:-}" ]] || { echo "❌ --port needs a PORT."; exit 1; }
            KUSTO_PORT="$2"; shift ;;
        -y|--yes)      ASSUME_YES=1 ;;
        -h|--help)     usage; exit 0 ;;
        *) echo "❌ Unknown option: $1"; echo "Try --help."; exit 1 ;;
    esac
    shift
done
PURGE="${PURGE:-0}"
[[ "$PURGE_ONLY" == "1" ]] && PURGE=1

case "$KUSTO_REPLACE" in
    always|ask|never) ;;
    *) echo "❌ KUSTO_REPLACE must be always|ask|never (got '$KUSTO_REPLACE')."; exit 1 ;;
esac

# The library owns the endpoint and the readiness probe, so deploy's own probe
# cannot disagree with apply/ingest about where Kusto is.
#
# What sourcing does NOT do: propagate --bind/--port to the next scripts. They
# run in a fresh shell, so an `export` here reaches nothing (an earlier version
# claimed otherwise). For a non-default endpoint the closing banner prints the
# exact KUSTO_HOST=/KUSTO_PORT= prefix to run them with.
KUSTO_HOST="$KUSTO_BIND_ADDR"
# shellcheck source=lib/kusto-api.sh
source "$SCRIPT_DIR/lib/kusto-api.sh"
kusto_require_tools
MGMT_URL="${KUSTO_BASE}/v1/rest/mgmt"

# Container lifecycle — replace policy, isolated network, log stream,
# readiness, egress verification, port readback, directory purge.
# lib/docker-lifecycle.sh documents the defect each function encodes the
# fix for.
# shellcheck source=lib/docker-lifecycle.sh
source "$SCRIPT_DIR/lib/docker-lifecycle.sh"

echo ""
echo "🧊 Kusto emulator — offline DFIR analysis"
echo "─────────────────────────────────────────────────────────────"

# The exposure decision is checked BEFORE anything else, including whether
# Docker is even reachable. Refusing an unsafe request should not depend on
# unrelated preconditions passing first.
if [[ "$KUSTO_BIND_ADDR" != "127.0.0.1" && "$KUSTO_BIND_ADDR" != "localhost" ]]; then
    echo ""
    echo "   ⚠️  BINDING TO $KUSTO_BIND_ADDR"
    echo ""
    echo "      The emulator has NO authentication, NO access control and speaks"
    echo "      plaintext HTTP. Anyone who can reach $KUSTO_BIND_ADDR:$KUSTO_PORT can read"
    echo "      and modify everything you have ingested — which is evidence."
    echo ""
    if [[ "$ASSUME_YES" != "1" ]]; then
        [[ -t 0 ]] || { echo "❌ Refusing to bind non-locally without a terminal. Pass --yes."; exit 1; }
        read -r -p "Type 'expose' to continue: " c
        [[ "$c" == "expose" ]] || { echo "🚫 Aborted."; exit 1; }
    fi
fi

dl_require_docker || exit 1

# ------------------------------------------------------------------------------
# Replace an existing container.
# ------------------------------------------------------------------------------
# Confirmation comes FIRST — before anything is destroyed. Originally the
# container was removed by the replace block above the purge prompt, so typing
# "no" at the prompt still lost the container. In the default ephemeral mode
# that container IS the database, so declining a purge destroyed the data the
# prompt was asking about.
if [[ "$PURGE" == "1" ]]; then
    has_data=0
    [[ -d "$KUSTO_DATA_DIR" && -n "$(ls -A "$KUSTO_DATA_DIR" 2>/dev/null)" ]] && has_data=1
    dl_container_exists "$KUSTO_CONTAINER" && has_data=1
    if [[ $has_data -eq 1 ]]; then
        echo "🔥 --purge will DELETE the container and any persisted databases."
        [[ "$KUSTO_PERSIST" == "1" ]] && echo "   Directory: $KUSTO_DATA_DIR"
        echo "   Processed evidence on disk is NOT touched — you can re-ingest."
        if [[ "$ASSUME_YES" != "1" ]]; then
            [[ -t 0 ]] || { echo "❌ --purge needs confirmation and there is no terminal."; exit 1; }
            read -r -p "Type 'yes' to delete: " c
            [[ "$c" == "yes" ]] || { echo "🚫 Aborted. Nothing was removed."; exit 1; }
        fi
    fi
fi

# skip_policy is $PURGE: a confirmed --purge already authorised destroying the
# container, so the replace policy is not consulted again — otherwise
# KUSTO_REPLACE=never would veto a purge the operator just typed 'yes' to, and
# =ask would ask a second, redundant question about the same destruction.
DL_REPLACE_NOTE=""
[[ "$KUSTO_PERSIST" != "1" ]] && \
    DL_REPLACE_NOTE="   Ephemeral mode: this container IS the database. Removing it deletes
   everything ingested; re-ingest from data_store/processed afterwards."
dl_replace_container "$KUSTO_CONTAINER" "$KUSTO_REPLACE" "$PURGE" || exit 1
DL_REPLACE_NOTE=""

# ------------------------------------------------------------------------------
# Purge persisted data.
# ------------------------------------------------------------------------------
if [[ "$PURGE" == "1" ]]; then
    if [[ -d "$KUSTO_DATA_DIR" && -n "$(ls -A "$KUSTO_DATA_DIR" 2>/dev/null)" ]]; then
        echo "🔥 Deleting persisted databases in $KUSTO_DATA_DIR ..."
        if ! dl_purge_dir_contents "$KUSTO_DATA_DIR"; then
            echo "      .create database refuses a non-empty target, so a --persist"
            echo "      apply would fail later."
            exit 1
        fi
    else
        echo "ℹ️  No persisted data to delete."
    fi
    if [[ "$PURGE_ONLY" == "1" ]]; then
        echo "🛑 --purge-only: container and data removed. Not redeploying."
        exit 0
    fi
    echo ""
fi

# ------------------------------------------------------------------------------
# Isolated network — a bridge with IP masquerade disabled, NOT --internal
# (which blocks published ports in both directions; that mistake shipped once
# on the retired Splunk path).
# ------------------------------------------------------------------------------
NETWORK_ARGS=()
if [[ "$KUSTO_ISOLATED" == "1" ]]; then
    dl_ensure_isolated_network "$KUSTO_NETWORK" "$KUSTO_CONTAINER" || exit 1
    NETWORK_ARGS=(--network "$KUSTO_NETWORK")
else
    echo "🌐 NOT isolated — the container has outbound network access."
fi

# ------------------------------------------------------------------------------
# Storage
# ------------------------------------------------------------------------------
VOLUME_ARGS=()
if [[ "$KUSTO_PERSIST" == "1" ]]; then
    mkdir -p "$KUSTO_DATA_DIR" || { echo "❌ Could not create $KUSTO_DATA_DIR."; exit 1; }
    KUSTO_DATA_DIR="$(realpath "$KUSTO_DATA_DIR")"
    VOLUME_ARGS=(-v "$KUSTO_DATA_DIR":/kustodata)
    echo "💾 Persisting databases -> $KUSTO_DATA_DIR (/kustodata)"
    echo "   ⚠️  Microsoft advises against this. Emulator versions may not read"
    echo "      each other's on-disk format, and with no extent merging the data"
    echo "      never compacts. If a redeploy comes up empty or refuses to create"
    echo "      a database, purge and re-ingest — that is the supported path."
else
    echo "💾 Ephemeral — databases live and die with the container."
    echo "   Re-ingest after each deploy:  ./scripts/ingest-kusto.sh"
fi

echo "🖥️  Endpoint:  http://$KUSTO_BIND_ADDR:$KUSTO_PORT"
echo "⚖️  ACCEPT_EULA=Y is set on your behalf. Provided as-is, no warranty."
echo ""

# ------------------------------------------------------------------------------
# Run
# ------------------------------------------------------------------------------
echo "🚀 Starting $KUSTO_CONTAINER ..."
# -t matches Microsoft's documented invocation exactly
# (`docker run -e ACCEPT_EULA=Y -m 4G -d -p 8080:8080 -t ...`).
KUSTO_CID=$(docker run -d -t --name "$KUSTO_CONTAINER" \
    --hostname kusto-emulator \
    "${NETWORK_ARGS[@]}" \
    "${VOLUME_ARGS[@]}" \
    -m "$KUSTO_MEMORY" \
    -p "$KUSTO_BIND_ADDR":"$KUSTO_PORT":8080 \
    -e ACCEPT_EULA=Y \
    "$KUSTO_IMAGE")

if [[ -z "$KUSTO_CID" ]]; then
    echo "❌ docker run failed — no container was started."
    exit 1
fi
echo "🆔 Container: ${KUSTO_CID:0:12}"

# Stream logs while waiting — the lib tracks the PID, because `docker logs -f`
# never exits on its own and left running it buries every diagnostic below.
dl_start_log_stream "$KUSTO_CID"
trap dl_stop_log_stream EXIT

# ------------------------------------------------------------------------------
# Readiness — a real health check.
#
# The retired Splunk deploy had to grep container logs for a magic string.
# The emulator has a management endpoint, so ask the engine whether it is
# actually serving queries.
# ------------------------------------------------------------------------------
echo "⏳ Waiting for the engine to answer (timeout ${KUSTO_READY_TIMEOUT}s)..."
echo "   The first run pulls a multi-GB image."

# dl_wait_ready tracks REAL elapsed time (counting only the sleeps once let a
# 900s timeout run ~30 minutes) and detects a container that dies mid-startup.
ready_rc=0
dl_wait_ready "$KUSTO_CID" "$KUSTO_READY_TIMEOUT" 5 kusto_reachable || ready_rc=$?

dl_stop_log_stream
echo ""

if (( ready_rc == 2 )); then
    # The container died; dl_wait_ready printed its exit code and a logs hint.
    exit 1
fi
if (( ready_rc != 0 )); then
    echo "   ╔══════════════════════════════════════════════════════════════╗"
    echo "   ║  ❌ THE ENGINE NEVER ANSWERED — this deploy is not usable     ║"
    echo "   ╚══════════════════════════════════════════════════════════════╝"
    echo ""
    echo "   The container is running but nothing answered on"
    echo "   $MGMT_URL after ${KUSTO_READY_TIMEOUT}s."
    echo ""
    if [[ "$KUSTO_ISOLATED" == "1" ]]; then
        echo "   If the image had not been pulled yet, isolation blocked the pull."
        echo "   Pull it once with network access, then redeploy isolated:"
        echo "     docker pull $KUSTO_IMAGE"
        echo "     ./scripts/deploy-kusto.sh"
    fi
    echo "   Check:  docker logs ${KUSTO_CID:0:12}"
    echo ""
    exit 1
fi
echo "   ✅ Engine is answering."

# ------------------------------------------------------------------------------
# Isolation, verified in both directions: egress probed from inside the
# container, and the published bindings read back (Docker's port rules sit
# ahead of the host firewall, so a wrong bind address is not caught by ufw).
# ------------------------------------------------------------------------------
if [[ "$KUSTO_ISOLATED" == "1" ]]; then
    dl_verify_egress_blocked "$KUSTO_CID" "$KUSTO_NETWORK"
fi

dl_assert_port_bindings "$KUSTO_CONTAINER" "$KUSTO_BIND_ADDR" || {
    echo "      The container is still running and exposed — remove it with:"
    echo "        docker rm -f $KUSTO_CONTAINER"
    exit 1
}

echo ""
echo "✅ Kusto emulator ready."
echo "─────────────────────────────────────────────────────────────"
echo "  ENDPOINT   http://$KUSTO_BIND_ADDR:$KUSTO_PORT"
echo "  MGMT       $MGMT_URL"
echo ""
if [[ "$KUSTO_PERSIST" == "1" ]]; then
echo "  STORAGE    persisted -> $KUSTO_DATA_DIR"
echo "             ⚠️  unsupported by Microsoft; purge and re-ingest if it"
echo "                misbehaves after an image update"
else
echo "  STORAGE    ephemeral — everything is lost when this container is removed"
echo "             That is the recommended mode. data_store/processed is the"
echo "             source of truth; re-ingest rather than persisting."
fi
echo ""
echo "  NETWORK    $([[ "$KUSTO_ISOLATED" == "1" ]] && echo "isolated ($DL_ISOLATION_VERDICT)" || echo "NOT isolated")"
echo "             NO authentication, NO encryption — localhost only by default"
echo ""
# apply/ingest run in a fresh shell and default to 127.0.0.1:8080. A deploy on
# a non-default endpoint must hand them the address explicitly, or they will
# probe the wrong one and advise redeploying a cluster that is already up.
NEXT_PREFIX=""
if [[ "$KUSTO_HOST" != "127.0.0.1" ]]; then NEXT_PREFIX+="KUSTO_HOST=$KUSTO_HOST "; fi
if [[ "$KUSTO_PORT" != "8080" ]]; then NEXT_PREFIX+="KUSTO_PORT=$KUSTO_PORT "; fi
echo "  The engine is running and EMPTY. Two steps left:"
echo "    1.  ${NEXT_PREFIX}./scripts/apply-kusto-schema.sh    databases, tables, CAR functions"
echo "    2.  ${NEXT_PREFIX}./scripts/ingest-kusto.sh          load data_store/processed"
echo ""
echo "  Then, in the 'mitre' database:  CarCoverage()"
echo "  Plan and known gaps: docs/Kusto-Port.md"
echo "─────────────────────────────────────────────────────────────"
