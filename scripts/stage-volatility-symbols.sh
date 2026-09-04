#!/bin/bash
# ==============================================================================
# Stage the Volatility 3 ISF symbol packs for the OFFLINE volatility lane.
#
# WHY. data_store/dependencies/volatility3-symbols/ ships holding only a
# .gitkeep, so the network-isolated dfir/volatility container resolves no kernels
# — every Windows plugin returns empty even on a valid memory image ("symbol
# table requirement was not fulfilled"). The Volatility Foundation publishes bulk
# ISF symbol packs (windows/linux/mac) that cover the common kernels; staging them
# into that dir (the volatility lane mounts it as --symbols-dir) makes the lane
# work OFFLINE for ANY image.
#
# HOW. Host-side, pinned + sha256-verified, exactly the codebase's endorsed fetch
# pattern (python/get_sybers_dfir/signatures/detectraptor.py). This is a THIN
# wrapper: the real work — download, verify against the Foundation's SHA256SUMS,
# zip-slip-guarded extraction, idempotence — lives in the testable Python helper
# get_sybers_dfir.volatility_symbols. It is NOT fetched through a container: the
# hardened dfir/* images deliberately cannot do generic downloads, and Volatility's
# only network path (its per-kernel ISF fetch) is not the bulk packs.
#
# Robustness (mirrors setup-environment.sh):
#   - set -o pipefail, NO set -e; sudo is NOT assumed (no privileged step here).
#   - Idempotent: a pack already staged is skipped (--force re-fetches).
#   - Offline-tolerant and non-fatal: no python or no network -> it warns and exits
#     0, so a fresh/air-gapped setup-environment.sh run is never blocked. The lane
#     itself already degrades gracefully when symbols are absent.
#
# Windows is the priority pack; linux/mac are opt-in (--linux/--mac/--all).
#
# Usage:
#   scripts/stage-volatility-symbols.sh [--windows] [--linux] [--mac] [--all]
#                                       [--symbols-dir DIR] [--force] [--help]
# ==============================================================================

set -o pipefail

################################################################################
# Establish DX_DFIR repo filepath (identical resolution to the sibling scripts).
SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"
REPO_ROOT_DIR="$(realpath "$SCRIPT_DIR/..")"

# Default target lines up with the dfir_volatility role and the volatility processor.
SYMBOLS_DIR="${DXDFIR_SYMBOLS_DIR:-$REPO_ROOT_DIR/data_store/dependencies/volatility3-symbols}"
PACK_FLAGS=()   # forwarded verbatim to the python helper (default there: windows)
FORCE_FLAG=()

################################################################################
# Argument parsing — pack selection + --force are forwarded to the helper.
while [[ $# -gt 0 ]]; do
    case "$1" in
        --windows) PACK_FLAGS+=(--windows) ;;
        --linux)   PACK_FLAGS+=(--linux) ;;
        --mac)     PACK_FLAGS+=(--mac) ;;
        --all)     PACK_FLAGS+=(--all) ;;
        --force)   FORCE_FLAG=(--force) ;;
        --symbols-dir) SYMBOLS_DIR="$(realpath -m "$2")"; shift ;;
        -h|--help)
            sed -n '2,33p' "$0" | sed 's/^# \{0,1\}//'
            exit 0
            ;;
        *)
            echo "❌ Unknown option: $1" >&2
            echo "   Usage: $0 [--windows] [--linux] [--mac] [--all] [--symbols-dir DIR] [--force] [--help]" >&2
            exit 1
            ;;
    esac
    shift
done

warn() { echo "⚠️  $*" >&2; }

################################################################################
# Resolve a python that can drive the helper. Prefer the dxdfir venv (installed
# just above in setup-environment.sh); fall back to python3 on the in-repo package
# via PYTHONPATH (the same form the test suite uses).
DXDFIR_VENV="${DXDFIR_VENV:-/opt/dxdfir/venv}"
if [[ -x "$DXDFIR_VENV/bin/python" ]]; then
    PY="$DXDFIR_VENV/bin/python"
elif command -v python3 >/dev/null 2>&1; then
    PY="python3"
else
    warn "no python found to stage Volatility symbols (non-fatal)."
    exit 0
fi
export PYTHONPATH="$REPO_ROOT_DIR/python${PYTHONPATH:+:$PYTHONPATH}"

################################################################################
# Fetch + verify + stage (all in the Python helper). Non-fatal: a network/verify
# failure warns and exits 0 so setup is never blocked.
echo "🧠 Staging Volatility 3 ISF symbol packs (host-side, pinned + sha256-verified)"
echo "   target: $SYMBOLS_DIR"
if "$PY" -m get_sybers_dfir.volatility_symbols \
        --symbols-dir "$SYMBOLS_DIR" "${PACK_FLAGS[@]}" "${FORCE_FLAG[@]}" >/dev/null; then
    echo "✅ Volatility symbols staged (or already present) in $SYMBOLS_DIR"
    echo "   The volatility lane now resolves kernels OFFLINE (--network none)."
else
    warn "symbol staging skipped/failed (offline, or the download could not be verified) — non-fatal."
    echo "   Re-run online when able:  scripts/stage-volatility-symbols.sh"
    echo "   (or stage on an online host and carry the dir — scripts/package-offline.sh"
    echo "    bundles data_store/dependencies in deps.tar)."
    exit 0
fi
