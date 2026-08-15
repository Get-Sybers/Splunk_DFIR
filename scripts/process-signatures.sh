#!/bin/bash
# ==============================================================================
# process-signatures — signature/detection processors for the DFIR pipeline.
#
# Runs three signature engines over the evidence and lands their native events as
# ingest-ready JSON Lines under data_store/processed/signatures/<tool>/:
#
#   yara       scripts/signatures/yara.sh      files   -> YARA rule matches
#   suricata   scripts/signatures/suricata.sh  pcaps   -> Suricata EVE alerts
#   hayabusa   scripts/signatures/hayabusa.sh  EVTX    -> Hayabusa Sigma detections
#
# Each lane is a standalone sub-script (run one directly, or all via this driver).
# They are container-first (YARA, Suricata) or native binary (Hayabusa — no
# official image), each with a clear message when its tool, rules or inputs are
# missing, and a --fetch that provisions rules/binaries when online.
#
# Usage:
#   ./scripts/process-signatures.sh                 # run all three
#   ./scripts/process-signatures.sh --only suricata # one lane (repeatable)
#   ./scripts/process-signatures.sh --fetch         # provision rules/binaries first
#
# Load the results with:  ./scripts/ingest-kusto.sh --only signatures   (once wired)
# ==============================================================================
set -o pipefail

SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"
LANES_DIR="$SCRIPT_DIR/signatures"

# Clean up docker layers left dangling when a pulled :latest tag moves (the lanes
# run yara/suricata/plaso containers), so they don't accumulate across runs. Runs
# on exit; prunes only untagged, unreferenced images — tools/live containers safe.
prune_dangling() { command -v docker >/dev/null 2>&1 && docker image prune -f >/dev/null 2>&1 || true; }
trap prune_dangling EXIT

ALL_LANES=(yara suricata hayabusa)
want=()
passthru=()

while [[ $# -gt 0 ]]; do
    case "$1" in
        --only) want+=("$2"); shift 2 ;;
        --only=*) want+=("${1#*=}"); shift ;;
        --fetch) passthru+=("--fetch"); shift ;;
        -h|--help) grep -E '^#( |$)' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
        *) echo "❌ unknown arg: $1"; exit 2 ;;
    esac
done
[[ ${#want[@]} -eq 0 ]] && want=("${ALL_LANES[@]}")

# validate lane names
for l in "${want[@]}"; do
    case " ${ALL_LANES[*]} " in *" $l "*) ;; *) echo "❌ --only must be one of: ${ALL_LANES[*]}"; exit 2 ;; esac
done

echo ""
echo "🔎 process-signatures — lanes: ${want[*]}"
echo "════════════════════════════════════════════"

rc=0
for lane in "${want[@]}"; do
    echo ""
    if [[ ! -x "$LANES_DIR/$lane.sh" ]]; then
        chmod +x "$LANES_DIR/$lane.sh" 2>/dev/null
    fi
    bash "$LANES_DIR/$lane.sh" "${passthru[@]}" || { echo "   ⚠️ $lane lane exited non-zero"; rc=1; }
done

echo ""
echo "════════════════════════════════════════════"
echo "✅ process-signatures done."
echo "   Output: data_store/processed/signatures/{${want[*]// /,}}/"
exit $rc
