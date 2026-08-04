#!/bin/bash
#
# Deploy the Azure Data Explorer Kusto emulator for offline DFIR analysis.
#
# Stage 1 of the Kusto port — see docs/Kusto-Port.md for the design and the
# Microsoft documentation it is based on.
#
# This deliberately mirrors deploy-splunk.sh, because that script encodes
# several defects' worth of behaviour that took a while to learn: refusing to
# collide with an existing container, polling by container ID rather than name,
# detecting a container that dies during startup, stopping its own log stream
# before printing diagnostics, and verifying isolation in BOTH directions.
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

KUSTO_CONTAINER="${KUSTO_CONTAINER:-kusto-emulator}"
KUSTO_IMAGE="${KUSTO_IMAGE:-mcr.microsoft.com/azuredataexplorer/kustainer-linux:latest}"

# Docs: "at least 2 GB of RAM (4 GB or more recommended)".
KUSTO_MEMORY="${KUSTO_MEMORY:-4G}"

KUSTO_PORT="${KUSTO_PORT:-8080}"
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

case "$KUSTO_REPLACE" in
    always|ask|never) ;;
    *) echo "❌ KUSTO_REPLACE must be always|ask|never (got '$KUSTO_REPLACE')."; exit 1 ;;
esac

MGMT_URL="http://$KUSTO_BIND_ADDR:$KUSTO_PORT/v1/rest/mgmt"

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

command -v docker >/dev/null 2>&1 || { echo "❌ docker not found on PATH."; exit 1; }
docker info >/dev/null 2>&1 || { echo "❌ Cannot talk to the Docker daemon."; exit 1; }

# ------------------------------------------------------------------------------
# Replace an existing container.
# ------------------------------------------------------------------------------
if docker ps -a --format '{{.Names}}' | grep -qx "$KUSTO_CONTAINER"; then
    case "$KUSTO_REPLACE" in
        never) echo "🚫 KUSTO_REPLACE=never — container left untouched."; exit 1 ;;
        ask)
            [[ -t 0 ]] || { echo "❌ --ask needs a terminal."; exit 1; }
            read -r -p "Replace existing container '$KUSTO_CONTAINER'? [y/N] " r
            [[ "$r" =~ ^[Yy]$ ]] || { echo "🚫 Aborted."; exit 1; }
            ;;
    esac
    echo "🛑 Removing existing container..."
    docker rm -f "$KUSTO_CONTAINER" >/dev/null || {
        echo "❌ Could not remove '$KUSTO_CONTAINER'."; exit 1; }
fi

# ------------------------------------------------------------------------------
# Purge persisted data.
# ------------------------------------------------------------------------------
if [[ "$PURGE" == "1" ]]; then
    if [[ -d "$KUSTO_DATA_DIR" && -n "$(ls -A "$KUSTO_DATA_DIR" 2>/dev/null)" ]]; then
        echo "🔥 --purge: about to DELETE persisted databases in $KUSTO_DATA_DIR"
        echo "   Processed evidence on disk is NOT touched — you can re-ingest."
        if [[ "$ASSUME_YES" != "1" ]]; then
            [[ -t 0 ]] || { echo "❌ --purge needs confirmation and there is no terminal."; exit 1; }
            read -r -p "Type 'yes' to delete: " c
            [[ "$c" == "yes" ]] || { echo "🚫 Aborted."; exit 1; }
        fi
        sudo find "${KUSTO_DATA_DIR:?}" -mindepth 1 -maxdepth 1 \
            -not -name '.gitkeep' -exec rm -rf {} + 2>/dev/null || true
        echo "   ✅ Emptied."
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
# Isolated network — same mechanism as deploy-splunk.sh, and for the same
# reason. `--internal` is NOT used: it blocks published ports in both
# directions, which would make the endpoint unreachable from the host. That
# mistake shipped once on the Splunk path already.
# ------------------------------------------------------------------------------
NETWORK_ARGS=()
if [[ "$KUSTO_ISOLATED" == "1" ]]; then
    if docker network inspect "$KUSTO_NETWORK" >/dev/null 2>&1; then
        if [[ "$(docker network inspect -f '{{.Internal}}' "$KUSTO_NETWORK" 2>/dev/null)" == "true" ]]; then
            echo "♻️  Network '$KUSTO_NETWORK' is --internal, which blocks published ports."
            docker network rm "$KUSTO_NETWORK" >/dev/null 2>&1 || {
                echo "❌ Could not remove '$KUSTO_NETWORK'."; exit 1; }
            docker network create \
                --opt com.docker.network.bridge.enable_ip_masquerade=false \
                "$KUSTO_NETWORK" >/dev/null || {
                echo "❌ Could not recreate '$KUSTO_NETWORK'."; exit 1; }
            echo "    ✅ Recreated."
        else
            echo "🔒 Using network: $KUSTO_NETWORK"
        fi
    else
        echo "🔒 Creating network (no IP masquerade): $KUSTO_NETWORK"
        docker network create \
            --opt com.docker.network.bridge.enable_ip_masquerade=false \
            "$KUSTO_NETWORK" >/dev/null || {
            echo "❌ Could not create '$KUSTO_NETWORK'."; exit 1; }
    fi
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
    echo "   Re-ingest with scripts/ingest-kusto.sh after each deploy."
fi

echo "🖥️  Endpoint:  http://$KUSTO_BIND_ADDR:$KUSTO_PORT"
echo "⚖️  ACCEPT_EULA=Y is set on your behalf. Provided as-is, no warranty."
echo ""

# ------------------------------------------------------------------------------
# Run
# ------------------------------------------------------------------------------
echo "🚀 Starting $KUSTO_CONTAINER ..."
KUSTO_CID=$(docker run -d --name "$KUSTO_CONTAINER" \
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

# Stream logs while waiting, but track the PID — `docker logs -f` never exits,
# and left running it buries every diagnostic printed below.
docker logs -f "$KUSTO_CID" &
LOG_STREAM_PID=$!
stop_log_stream() {
    if [[ -n "${LOG_STREAM_PID:-}" ]] && kill -0 "$LOG_STREAM_PID" 2>/dev/null; then
        kill "$LOG_STREAM_PID" 2>/dev/null || true
        wait "$LOG_STREAM_PID" 2>/dev/null || true
    fi
    LOG_STREAM_PID=""
}
trap stop_log_stream EXIT

# ------------------------------------------------------------------------------
# Readiness — a real health check.
#
# deploy-splunk.sh greps container logs for a magic string because Splunk gives
# it nothing better. The emulator has a management endpoint, so ask the engine
# whether it is actually serving queries.
# ------------------------------------------------------------------------------
echo "⏳ Waiting for the engine to answer (timeout ${KUSTO_READY_TIMEOUT}s)..."
echo "   The first run pulls a multi-GB image."

elapsed=0; interval=5; ready=0
while [[ $elapsed -lt $KUSTO_READY_TIMEOUT ]]; do
    if [[ "$(docker inspect -f '{{.State.Running}}' "$KUSTO_CID" 2>/dev/null)" != "true" ]]; then
        stop_log_stream
        echo "❌ Container exited before becoming ready (exit code $(docker inspect -f '{{.State.ExitCode}}' "$KUSTO_CID" 2>/dev/null))."
        echo "   Logs:  docker logs ${KUSTO_CID:0:12}"
        exit 1
    fi
    if curl -s --max-time 5 -X POST "$MGMT_URL" \
         -H 'Content-Type: application/json' \
         -d '{"csl":".show version"}' 2>/dev/null | grep -q .; then
        ready=1; break
    fi
    sleep $interval
    elapsed=$((elapsed + interval))
done

stop_log_stream
echo ""

if [[ $ready -ne 1 ]]; then
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
# Isolation, verified in both directions.
# ------------------------------------------------------------------------------
ISOLATION_VERDICT="not checked"
if [[ "$KUSTO_ISOLATED" == "1" ]]; then
    echo "🔎 Verifying the container cannot reach the network..."
    if docker exec "$KUSTO_CID" bash -c 'true' >/dev/null 2>&1; then
        if docker exec "$KUSTO_CID" bash -c \
             'timeout 4 bash -c "echo > /dev/tcp/1.1.1.1/443" 2>/dev/null' >/dev/null 2>&1; then
            ISOLATION_VERDICT="FAILED"
            echo "   ⚠️  ISOLATION NOT HOLDING — the container reached the network."
            echo "      It works, but it can make outbound connections while holding"
            echo "      evidence. Disabling masquerade breaks return traffic rather"
            echo "      than dropping packets, so a host with its own forwarding"
            echo "      rules can still let traffic out. For a hard guarantee add a"
            echo "      DOCKER-USER rule for this network's subnet:"
            echo "        docker network inspect $KUSTO_NETWORK -f '{{(index .IPAM.Config 0).Subnet}}'"
            echo "      Not failing the deploy — reported so you can decide."
        else
            ISOLATION_VERDICT="confirmed"
            echo "   ✅ Outbound TCP blocked."
        fi
    else
        ISOLATION_VERDICT="could not test"
        echo "   ⚠️  Could not run the test inside the container. Isolation UNVERIFIED."
    fi
fi

# Read back the real bindings — Docker's published-port rules sit ahead of the
# host firewall, so a wrong bind address is not caught by ufw.
echo "🔎 Published ports:"
docker port "$KUSTO_CONTAINER" 2>/dev/null | sed 's/^/   /'
if [[ "$KUSTO_BIND_ADDR" != "0.0.0.0" ]]; then
    if docker port "$KUSTO_CONTAINER" 2>/dev/null | grep -q '0\.0\.0\.0'; then
        echo "   ❌ A port is bound to 0.0.0.0 despite --bind $KUSTO_BIND_ADDR."
        exit 1
    fi
fi

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
echo "  NETWORK    $([[ "$KUSTO_ISOLATED" == "1" ]] && echo "isolated ($ISOLATION_VERDICT)" || echo "NOT isolated")"
echo "             NO authentication, NO encryption — localhost only by default"
echo ""
echo "  Next:  scripts/apply-kusto-schema.sh    (stage 2)"
echo "         scripts/ingest-kusto.sh          (stage 3)"
echo "─────────────────────────────────────────────────────────────"
