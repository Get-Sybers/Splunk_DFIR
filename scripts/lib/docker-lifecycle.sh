#!/bin/bash
# shellcheck shell=bash
#
# Shared Docker container lifecycle for the deploy scripts.
# Sourced by deploy-splunk.sh, deploy-kusto.sh and purge-splunk-container.sh —
# not executable.
#
# Every function here encodes a lesson one of the deploys paid for:
#
#   - the isolated network is NOT --internal, because --internal blocks
#     published ports in both directions and shipped an unreachable Splunk UI
#   - readiness polls by CONTAINER ID and detects a container that dies
#     mid-startup, because polling by name once matched a stale container's
#     logs and reported success having deployed nothing
#   - the background `docker logs -f` is stopped by PID before diagnostics
#     print, because it never exits on its own and buried the isolation
#     verdict and the failure banners
#   - the egress probe is bash /dev/tcp against an IP, so it depends on
#     neither curl nor DNS inside the container
#   - directory purges spare .gitkeep and REPORT failure, because a purge
#     that swallowed a failed sudo once reported evidence deleted while it
#     was still on disk
#
# Consolidated from two near-identical copies (~130 lines each) so the next
# fix lands in one place. Functions communicate results via DL_* globals where
# bash return codes are not enough; every DL_* is documented at its function.

# --- preflight ----------------------------------------------------------------

dl_require_docker() {
    command -v docker >/dev/null 2>&1 || { echo "❌ docker not found on PATH."; return 1; }
    docker info >/dev/null 2>&1 || { echo "❌ Cannot talk to the Docker daemon."; return 1; }
}

dl_container_exists() {
    docker ps -a --format '{{.Names}}' | grep -qx "$1"
}

# --- replace an existing container --------------------------------------------
#
# dl_replace_container <name> <policy always|ask|never> <skip_policy 0|1>
#
# skip_policy=1 is for a confirmed purge: the operator already authorised
# destroying the container, so =never must not veto it and =ask must not ask a
# second, redundant question about the same destruction.
#
# The caller may set DL_REPLACE_NOTE to extra lines (e.g. what survives the
# removal); they print after the found-header, before any prompt.
dl_replace_container() {
    local name="$1" policy="$2" skip_policy="${3:-0}"
    dl_container_exists "$name" || return 0

    echo "🔁 Existing container found:"
    docker ps -a --filter "name=^${name}$" --format '   {{.Names}}  {{.Status}}  ({{.Image}})'
    [[ -n "${DL_REPLACE_NOTE:-}" ]] && printf '%s\n' "$DL_REPLACE_NOTE"
    echo ""

    if [[ "$skip_policy" != "1" ]]; then
        case "$policy" in
            never)
                echo "🚫 replace policy is 'never' — aborting, container left untouched."
                return 1
                ;;
            ask)
                [[ -t 0 ]] || { echo "❌ replace policy 'ask' needs a terminal."; return 1; }
                local r
                read -r -p "Remove it and redeploy? [y/N]: " r
                if [[ "${r,,}" != "y" && "${r,,}" != "yes" ]]; then
                    echo "🚫 Aborting. Existing container left untouched."
                    return 1
                fi
                ;;
            always) ;;
            *)
                echo "❌ replace policy must be always|ask|never (got '$policy')."
                return 1
                ;;
        esac
    fi

    echo "🛑 Removing container..."
    docker rm -f "$name" >/dev/null || {
        echo "❌ Could not remove '$name'."; return 1; }
    echo "✅ Removed."
    echo ""
}

# --- isolated network ---------------------------------------------------------
#
# dl_ensure_isolated_network <network> <container-hint-for-messages>
#
# A user-defined bridge with IP masquerade disabled: published ports keep
# working (inbound DNAT), outbound traffic leaves with an unroutable source and
# gets no reply. NOT --internal — an internal network has no external
# connectivity in EITHER direction, so published ports stop forwarding; that
# mistake shipped once and made the Splunk UI unreachable on localhost. A
# pre-existing --internal network left by that version is detected and
# recreated.
dl_ensure_isolated_network() {
    local net="$1" ctr_hint="$2"
    if docker network inspect "$net" >/dev/null 2>&1; then
        if [[ "$(docker network inspect -f '{{.Internal}}' "$net" 2>/dev/null)" == "true" ]]; then
            echo "♻️  Network '$net' is --internal, which blocks published ports"
            echo "    and makes the service unreachable. Recreating it correctly..."
            docker network rm "$net" >/dev/null 2>&1 || {
                echo "❌ Could not remove '$net' — is a container still on it?"
                echo "   Try: docker rm -f $ctr_hint && docker network rm $net"
                return 1
            }
            docker network create \
                --opt com.docker.network.bridge.enable_ip_masquerade=false \
                "$net" >/dev/null || {
                echo "❌ Could not recreate network '$net'."; return 1; }
            echo "    ✅ Recreated."
        else
            echo "🔒 Using network: $net"
        fi
    else
        echo "🔒 Creating network (no IP masquerade): $net"
        docker network create \
            --opt com.docker.network.bridge.enable_ip_masquerade=false \
            "$net" >/dev/null || {
            echo "❌ Could not create network '$net'."; return 1; }
    fi
}

# --- background log stream ----------------------------------------------------
#
# `docker logs -f` never exits on its own, and bash does not SIGHUP background
# jobs when a non-interactive script exits — so untracked, it outlives the
# script and buries every diagnostic printed after it. Callers MUST:
#     dl_start_log_stream "$CID"
#     trap dl_stop_log_stream EXIT
# and call dl_stop_log_stream before printing anything they need read.
DL_LOG_STREAM_PID=""

dl_start_log_stream() {
    docker logs -f "$1" &
    DL_LOG_STREAM_PID=$!
}

dl_stop_log_stream() {
    if [[ -n "${DL_LOG_STREAM_PID:-}" ]] && kill -0 "$DL_LOG_STREAM_PID" 2>/dev/null; then
        kill "$DL_LOG_STREAM_PID" 2>/dev/null || true
        wait "$DL_LOG_STREAM_PID" 2>/dev/null || true
    fi
    DL_LOG_STREAM_PID=""
}

# --- readiness ----------------------------------------------------------------
#
# dl_wait_ready <cid> <timeout_s> <interval_s> <probe_fn>
#
# Polls <probe_fn> (a function or command returning 0 when the service is up)
# against REAL elapsed time — counting only the sleeps once let a 900s timeout
# run for ~30 minutes, because each probe can itself block for seconds.
#
# Returns 0 ready, 1 timeout, 2 the container died (its exit code and a logs
# hint are printed here, since that message was identical in both deploys).
dl_wait_ready() {
    local cid="$1" timeout_s="$2" interval_s="$3" probe="$4"
    local start=$SECONDS
    while (( SECONDS - start < timeout_s )); do
        if [[ "$(docker inspect -f '{{.State.Running}}' "$cid" 2>/dev/null)" != "true" ]]; then
            dl_stop_log_stream
            echo "❌ Container exited before becoming ready (exit code $(docker inspect -f '{{.State.ExitCode}}' "$cid" 2>/dev/null))."
            echo "   Logs:  docker logs ${cid:0:12}"
            return 2
        fi
        if "$probe"; then
            return 0
        fi
        sleep "$interval_s"
    done
    return 1
}

# --- egress verification ------------------------------------------------------
#
# dl_verify_egress_blocked <cid> <network>
#
# Sets DL_ISOLATION_VERDICT to: confirmed | FAILED | "could not test".
# Proves the control rather than assuming it: disabling masquerade breaks
# return traffic rather than dropping packets, so a host with its own
# forwarding rules can still let traffic out. A FAILED verdict is reported, not
# fatal — a weakened control is not a reason to leave the operator without a
# working service. Checking only this direction is what once let an
# unreachable-UI bug ship, so callers must ALSO verify their inbound path.
# Exported so shellcheck knows the sourcing scripts read it (SC2034).
export DL_ISOLATION_VERDICT="not checked"

dl_verify_egress_blocked() {
    local cid="$1" net="$2"
    DL_ISOLATION_VERDICT="not checked"
    echo "🔎 Verifying the container cannot reach the network..."
    if docker exec "$cid" bash -c 'true' >/dev/null 2>&1; then
        if docker exec "$cid" bash -c \
             'timeout 4 bash -c "echo > /dev/tcp/1.1.1.1/443" 2>/dev/null' >/dev/null 2>&1; then
            DL_ISOLATION_VERDICT="FAILED"
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
            echo "        docker network inspect $net -f '{{(index .IPAM.Config 0).Subnet}}'"
            echo ""
            echo "      Not failing the deploy — a weakened control is not a reason"
            echo "      to leave you without a working service. Reported so you can"
            echo "      decide."
            echo ""
        else
            DL_ISOLATION_VERDICT="confirmed"
            echo "   ✅ Outbound TCP blocked."
        fi
    else
        DL_ISOLATION_VERDICT="could not test"
        echo "   ⚠️  Could not run the test inside the container (no shell?)."
        echo "      Isolation is UNVERIFIED. Check manually:"
        echo "        docker exec $cid bash -c 'echo > /dev/tcp/1.1.1.1/443'"
    fi
}

# --- published-port readback --------------------------------------------------
#
# dl_assert_port_bindings <name_or_cid> <bind_addr>
#
# Reads back the REAL bindings — Docker's published-port rules are inserted
# ahead of the host firewall, so ufw does not protect a wrongly-bound port and
# the -p flag must not be taken on faith. Returns 1 if anything is bound to
# 0.0.0.0 while a narrower bind address was requested.
dl_assert_port_bindings() {
    local target="$1" bind_addr="$2"
    echo "🔎 Published ports:"
    docker port "$target" 2>/dev/null | sed 's/^/   /' || echo "   (could not read)"
    if [[ "$bind_addr" != "0.0.0.0" ]]; then
        if docker port "$target" 2>/dev/null | grep -q '0\.0\.0\.0'; then
            echo "   ❌ A port is bound to 0.0.0.0 despite bind address $bind_addr."
            return 1
        fi
    fi
}

# --- directory purge ----------------------------------------------------------
#
# dl_purge_dir_contents <dir>
#
# Empties a directory's contents, sparing .gitkeep (it keeps the skeleton in
# git; deleting it shows up as a spurious change). Deletes CONTENTS, not the
# directory — it may be a mount point, and removing it would silently change
# where data lands next time.
#
# Escalates to sudo only if the unprivileged delete fails, and REPORTS failure
# instead of swallowing it: an earlier version discarded stderr and the exit
# status, then printed success — so a sudo that could not run reported
# evidence-index data deleted while it was still on disk.
dl_purge_dir_contents() {
    local dir="$1"
    [[ -d "$dir" ]] || return 0
    [[ -n "$(ls -A "$dir" 2>/dev/null)" ]] || return 0
    # -exec rm -rf, NOT -delete: find's -delete refuses a non-empty directory
    # (and -maxdepth 1 never descends to empty it), so a -delete version could
    # not purge nested data at all — Kusto's /kustodata/dbs/<name>/... layout
    # is exactly that, and the unit test caught it failing. find still reports
    # failure honestly with -exec: it exits non-zero if any rm invocation does.
    local purge_cmd=(find "${dir:?}" -mindepth 1 -maxdepth 1 -not -name '.gitkeep'
                     -exec rm -rf -- '{}' +)
    if ! "${purge_cmd[@]}" 2>/dev/null; then
        if ! sudo "${purge_cmd[@]}"; then
            echo "   ❌ Could not empty $dir — its contents are still there."
            return 1
        fi
    fi
    echo "   ✅ Emptied $dir"
}
