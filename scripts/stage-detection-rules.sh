#!/bin/bash
# ==============================================================================
# Stage the detection rule sets the `signatures` lane reads.
#
# The signature lanes (python/get_sybers_dfir/signatures/) detect against rules
# provisioned under data_store/dependencies/. A fresh checkout ships only a
# .gitkeep in each of those directories, so yara/suricata/hayabusa run clean but
# find NOTHING. This is a THIN wrapper: all downloading lives in the pipeline's
# OWN, sanctioned fetch path — it invents no parallel machinery and reimplements
# no downloading here. It drives:
#
#     python -m get_sybers_dfir.signatures --fetch-only --repo-root <repo>
#
# which provisions each lane through the lane's own pinned fetch:
#
#   yara-rules/     the DetectRaptor provisioner (commit-pinned + sha256-verified),
#                   merged into detectraptor/detectraptor.yar. Operator rules in
#                   the tree win, so the fetch stands down when any *.yar exists.
#   suricata-rules/ ET Open, merged into the single suricata.rules the lane loads
#                   with `-S`. (The hardened dfir/suricata image deliberately
#                   strips suricata-update and runs with no network, so ET Open is
#                   provisioned by the lane's host-side pinned fetch, not inside
#                   the tool container — same discipline as detectraptor.)
#   hayabusa/       the pinned Hayabusa release (native binary + its bundled Sigma
#                   rules/ tree). Hayabusa has no tool image, so the lane's fetch
#                   is a host-side pinned + sha256-verified download.
#
# Everything under data_store/** is gitignored — nothing staged here is ever
# committed; this is a re-runnable ONLINE provisioning step.
#
# Idempotent:  a lane whose rules are already present is left untouched (the
#              fetch itself skips it); --force re-stages.
# Non-fatal:   a lane that can't be provisioned (offline) is reported and the run
#              moves on — the script NEVER aborts its caller (setup-environment.sh
#              runs it as a single best-effort step).
# No sudo/root is assumed (matches setup-environment.sh).
#
# Usage: scripts/stage-detection-rules.sh [--force] [--only LANE]... [--help]
#          --force        re-stage even if a lane's rules are already present
#          --only LANE    stage only this lane (yara|suricata|hayabusa); repeatable
# ==============================================================================
set -o pipefail

SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"
REPO_ROOT_DIR="$(realpath "$SCRIPT_DIR/..")"

# A python that can import get_sybers_dfir. The provisioners are stdlib-only, so
# any python3 works with the repo's python/ on PYTHONPATH — no install required;
# the dxdfir venv (if present) is preferred so this matches how the pipeline runs.
DXDFIR_VENV="${DXDFIR_VENV:-/opt/dxdfir/venv}"
if [[ -x "$DXDFIR_VENV/bin/python" ]]; then
    PYTHON_BIN="$DXDFIR_VENV/bin/python"
elif command -v python3 >/dev/null 2>&1; then
    PYTHON_BIN="python3"
else
    echo "⚠️  No python3 found — cannot stage detection rules (skipping)." >&2
    exit 0
fi
# Prefer the repo's own package (so a locally-updated fetch is what runs) over any
# copy installed in the venv's site-packages.
export PYTHONPATH="$REPO_ROOT_DIR/python${PYTHONPATH:+:$PYTHONPATH}"

FETCH_ARGS=()
ONLY=()

usage() { sed -n '2,/^# =\{10,\}$/p' "$0" | sed '$d' | sed 's/^# \{0,1\}//'; }

while [[ $# -gt 0 ]]; do
    case "$1" in
        -f|--force) FETCH_ARGS+=("--force") ;;
        --only)
            shift
            [[ -n "${1:-}" ]] || { echo "❌ --only needs a lane (yara|suricata|hayabusa)" >&2; exit 2; }
            ONLY+=("$1") ;;
        --only=*) ONLY+=("${1#*=}") ;;
        -h|--help) usage; exit 0 ;;
        *)
            echo "❌ Unknown option: $1" >&2
            echo "   Usage: $0 [--force] [--only LANE]... [--help]" >&2
            exit 2 ;;
    esac
    shift
done

for _l in "${ONLY[@]}"; do
    case "$_l" in
        yara|suricata|hayabusa) FETCH_ARGS+=("--only" "$_l") ;;
        *) echo "❌ --only: unknown lane '$_l' (choose from yara, suricata, hayabusa)" >&2; exit 2 ;;
    esac
done

echo "🔎 Staging detection rule sets into data_store/dependencies/ ..."
echo "   (via the signatures lanes' own pinned fetch; data_store/** is gitignored)"

# Drive the sanctioned provisioning path. --fetch-only provisions each lane's
# rules and exits WITHOUT running detection. It is best-effort: an offline host
# gets a per-lane note in the JSON summary and a non-zero exit, which we soften to
# a warning so this step never fails the caller.
if "$PYTHON_BIN" -m get_sybers_dfir.signatures --fetch-only \
        --repo-root "$REPO_ROOT_DIR" "${FETCH_ARGS[@]}"; then
    echo "🎉 Detection rule sets staged."
else
    echo "⚠️  One or more lanes could not be provisioned (usually offline)." >&2
    echo "    Re-run when online:  scripts/stage-detection-rules.sh" >&2
fi
echo "   Detect with:  dxdfir process signatures"

# Best-effort by design: staging is network-dependent and must never fail the
# caller, so the exit status stays success regardless.
exit 0
