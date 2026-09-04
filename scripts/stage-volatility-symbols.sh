#!/bin/bash
# ==============================================================================
# Stage the Volatility 3 ISF kernel symbols for the OFFLINE volatility lane.
#
# WHY. data_store/dependencies/volatility3-symbols/ ships holding only a
# .gitkeep, so a network-isolated dfir/volatility container has no kernel symbol
# tables to resolve against — every Windows plugin returns empty even on a valid
# memory image ("symbol table requirement was not fulfilled"). This script
# pre-seeds that cache so the lane works with the container's default posture:
# --network none.
#
# HOW (and how NOT). The pipeline's rule is that tools run INSIDE the hardened
# images, never on the host — and python/get_sybers_dfir/container.py records
# that the Volatility ISF symbol fetch is the ONE sanctioned network=True opt-in.
# So this does NOT curl/wget symbol packs on the host. It drives the SAME
# dfir/volatility container the lane uses, with that sanctioned opt-in
# (--symbols-online), over the memory images already staged under
# data_store/raw/memory. Volatility resolves each image's kernel and fetches its
# ISF into the mounted /symbols cache; every later run — offline — reads it from
# there. The mechanism is exactly the volatility processor
# (get_sybers_dfir.volatility) with its network opt-in; there is no new machinery
# and no second download path to keep in sync.
#
# A cheap two-plugin warm pass does it: banners.Banners (symbol-free — identifies
# the kernel build) then windows.info (needs the kernel symbol table — this is
# what triggers and caches the ISF fetch). Windows is the priority; Linux/mac ISF
# are per-kernel DWARF builds Volatility cannot fetch remotely and stay
# operator-supplied (see the volatility3-symbols README / docs/Signature-Rules.md).
#
# Robustness (mirrors setup-environment.sh):
#   - set -o pipefail, NO set -e — every soft failure is a warning, never a die.
#   - sudo is NOT assumed. It talks to the daemon directly, falling back to sudo
#     only if that is the only way in (like save-docker-images.sh).
#   - Idempotent: if the symbols cache already holds tables it skips (—force
#     re-runs, e.g. to warm a newly added image's kernel).
#   - Offline-tolerant and non-fatal: no daemon, no built image, no PIIAT-Mem
#     submodule, no memory images, or no network -> it warns and exits 0, so a
#     fresh/air-gapped setup-environment.sh run is never blocked. The lane itself
#     already degrades gracefully when symbols are absent.
#
# Usage:
#   scripts/stage-volatility-symbols.sh [--memory-dir DIR] [--symbols-dir DIR]
#                                       [--image IMAGE] [--plugins LIST]
#                                       [--force] [--help]
# ==============================================================================

set -o pipefail

################################################################################
# Establish DX_DFIR repo filepath (identical resolution to the sibling scripts).
SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"
REPO_ROOT_DIR="$(realpath "$SCRIPT_DIR/..")"

# Defaults line up with the dfir_volatility role (defaults/main.yml) and the
# get_sybers_dfir.volatility processor, so this warms the very cache the lane reads.
SYMBOLS_DIR="${DXDFIR_SYMBOLS_DIR:-$REPO_ROOT_DIR/data_store/dependencies/volatility3-symbols}"
MEMORY_DIR="${DXDFIR_MEMORY_DIR:-$REPO_ROOT_DIR/data_store/raw/memory}"
VOL_IMAGE="${DXDFIR_VOL_IMAGE:-dfir/volatility:latest}"
# banners identifies the kernel without symbols; windows.info needs the kernel
# symbol table — running it with the network opt-in is what fetches + caches the ISF.
PLUGINS="banners.Banners,windows.info"
FORCE=0

################################################################################
# Argument parsing
while [[ $# -gt 0 ]]; do
    case "$1" in
        --memory-dir)  MEMORY_DIR="$(realpath -m "$2")"; shift ;;
        --symbols-dir) SYMBOLS_DIR="$(realpath -m "$2")"; shift ;;
        --image)       VOL_IMAGE="$2"; shift ;;
        --plugins)     PLUGINS="$2"; shift ;;
        --force)       FORCE=1 ;;
        -h|--help)
            sed -n '2,45p' "$0" | sed 's/^# \{0,1\}//'
            exit 0
            ;;
        *)
            echo "❌ Unknown option: $1" >&2
            echo "   Usage: $0 [--memory-dir DIR] [--symbols-dir DIR] [--image IMAGE] [--plugins LIST] [--force] [--help]" >&2
            exit 1
            ;;
    esac
    shift
done

warn() { echo "⚠️  $*" >&2; }

# A file (other than the .gitkeep placeholder) anywhere under a dir. Used both to
# tell "cache already populated" (idempotence) and "memory images present".
has_real_content() {
    [[ -d "$1" ]] || return 1
    find "$1" -type f ! -name '.gitkeep' -print -quit 2>/dev/null | grep -q .
}

echo "🧠 Volatility 3 symbol staging (ISF cache warm — through the hardened container)"
echo "   symbols cache : $SYMBOLS_DIR"
echo "   memory images : $MEMORY_DIR"
echo "   container     : $VOL_IMAGE (network opt-in: the one sanctioned Volatility fetch)"

################################################################################
# 1. Idempotence — if the cache already holds symbol tables, we are done.
if [[ "$FORCE" -ne 1 ]] && has_real_content "$SYMBOLS_DIR"; then
    echo "✅ Symbols already staged in $SYMBOLS_DIR — skipping (use --force to re-warm, e.g. for a newly added image)."
    exit 0
fi

################################################################################
# 2. Resolve a python that can drive the processor. Prefer the dxdfir venv
#    (installed just above in setup-environment.sh); fall back to python3 on the
#    in-repo package via PYTHONPATH (the same form the test suite uses).
DXDFIR_VENV="${DXDFIR_VENV:-/opt/dxdfir/venv}"
if [[ -x "$DXDFIR_VENV/bin/python" ]]; then
    PY="$DXDFIR_VENV/bin/python"
elif command -v python3 >/dev/null 2>&1; then
    PY="python3"
else
    warn "no python found to drive the volatility lane — cannot stage symbols (non-fatal)."
    exit 0
fi
export PYTHONPATH="$REPO_ROOT_DIR/python${PYTHONPATH:+:$PYTHONPATH}"

################################################################################
# 3. Docker daemon reachable? (prefer the unprivileged socket, fall back to sudo —
#    same resolution as save-docker-images.sh). Symbols are fetched INSIDE the
#    container, so no daemon means nothing to do here.
if docker info >/dev/null 2>&1; then
    :
elif command -v sudo >/dev/null 2>&1 && sudo docker info >/dev/null 2>&1; then
    warn "talking to Docker via sudo (docker-group membership needs a fresh login session)."
else
    warn "Docker daemon not reachable — cannot warm the ISF cache now (non-fatal)."
    echo "   Re-run this after Docker is up:  scripts/stage-volatility-symbols.sh"
    exit 0
fi

################################################################################
# 4. Is the hardened image built? (built by playbooks/dfir-build-images.yml, not
#    pulled). Absent on a fresh host — warn and stand down, do not die.
if ! docker image inspect "$VOL_IMAGE" >/dev/null 2>&1 \
    && ! { command -v sudo >/dev/null 2>&1 && sudo docker image inspect "$VOL_IMAGE" >/dev/null 2>&1; }; then
    warn "$VOL_IMAGE is not built yet — cannot warm the ISF cache (non-fatal)."
    echo "   Build it first, then re-run this script:"
    echo "     ansible-playbook ansible/collections/get_sybers.dfir/playbooks/dfir-build-images.yml"
    exit 0
fi

################################################################################
# 5. Any memory images to warm against? Volatility's ISF fetch is per-kernel and
#    needs an image to resolve; with none present there is nothing to fetch yet.
if ! has_real_content "$MEMORY_DIR"; then
    warn "no memory images under $MEMORY_DIR — nothing to warm the ISF cache against (non-fatal)."
    echo "   Stage a Windows memory image there and re-run to pre-seed its kernel symbols"
    echo "   (or the lane fetches them on its first online run: dfir_volatility_symbols_online=true)."
    exit 0
fi

################################################################################
# 6. Warm the cache: drive the existing processor over the hardened container with
#    the sanctioned network opt-in. A throwaway --out-dir keeps the warm-pass plugin
#    output out of data_store/processed; the ISF tables land in the symbols cache.
WARM_OUT="$(mktemp -d)"
trap 'rm -rf "$WARM_OUT"' EXIT

echo "🌐 Warming symbols via '$PLUGINS' over the memory images (this needs network — the sanctioned Volatility ISF fetch)..."
"$PY" -m get_sybers_dfir.volatility \
    --memory-dir "$MEMORY_DIR" \
    --out-dir "$WARM_OUT" \
    --symbols-dir "$SYMBOLS_DIR" \
    --image "$VOL_IMAGE" \
    --symbols-online \
    --plugins "$PLUGINS" >/dev/null
# Per-plugin failure is NORMAL here (an image whose kernel ISF can't be fetched);
# never gate on the processor's rc — judge success by whether the cache filled.

################################################################################
# 7. Report by inspecting the cache the container populated.
if has_real_content "$SYMBOLS_DIR"; then
    count="$(find "$SYMBOLS_DIR" -type f ! -name '.gitkeep' 2>/dev/null | wc -l | tr -d ' ')"
    size="$(du -sh "$SYMBOLS_DIR" 2>/dev/null | cut -f1)"
    echo "✅ ISF cache populated: $count file(s), $size in $SYMBOLS_DIR"
    echo "   The volatility lane now resolves these kernels OFFLINE (--network none)."
else
    warn "the warm pass fetched no symbols — likely no outbound network (needed for the ISF fetch),"
    warn "the PIIAT-Mem submodule is not checked out, or the image's kernel has no published ISF."
    echo "   This is non-fatal: run the warm pass on an online host, then carry"
    echo "   data_store/dependencies/volatility3-symbols to the air-gapped host"
    echo "   (scripts/package-offline.sh bundles it in deps.tar)."
fi

exit 0
