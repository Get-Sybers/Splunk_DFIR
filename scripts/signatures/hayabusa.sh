#!/bin/bash
# ==============================================================================
# Hayabusa signature lane of process-signatures.
#
# Runs Hayabusa (Yamato Security) over Windows EVTX logs — a Sigma-based detection
# timeline — and emits its native JSONL:
#
#   data_store/raw/**/*.evtx                                  input event logs
#   data_store/dependencies/hayabusa/                         binary + bundled rules
#   data_store/processed/signatures/hayabusa/timeline.jsonl   one detection per line
#
# Hayabusa's `json-timeline -L` output is already JSON Lines: each record carries
# Timestamp, RuleTitle, Level, Computer, Channel, EventID, MitreTactics/Tags,
# RecordID and the matched Details. We add "tool":"hayabusa" per line.
#
# Hayabusa ships as a self-contained Rust binary with its rules bundled in the
# release, so — unlike the container-based lanes — this runs the NATIVE binary
# (there is no official Hayabusa image). --fetch downloads the pinned release into
# data_store/dependencies/hayabusa/ when online.
#
# Hayabusa is AGPL-3.0; its bundled Sigma rules are DRL/other per-rule licenses.
# ==============================================================================
set -o pipefail

SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"
REPO_ROOT_DIR="$(realpath "$SCRIPT_DIR/../..")"

# EVTX can live anywhere under raw/ (the WinEvt drop, extracted disk images, …).
INPUT_DIR="${HAYABUSA_INPUT:-$REPO_ROOT_DIR/data_store/raw}"
HB_DIR="${HAYABUSA_DIR:-$REPO_ROOT_DIR/data_store/dependencies/hayabusa}"
OUTPUT_DIR="${SIGNATURES_OUTPUT_DIR:-$REPO_ROOT_DIR/data_store/processed/signatures}/hayabusa"
INPUT_DIR="$(realpath -m "$INPUT_DIR")"

HAYABUSA_BIN="${HAYABUSA_BIN:-}"                       # explicit binary path wins
HAYABUSA_VERSION="${HAYABUSA_VERSION:-3.4.0}"          # pinned release for --fetch
FETCH="${FETCH:-0}"
for arg in "$@"; do [[ "$arg" == "--fetch" ]] && FETCH=1; done

echo "🦅 Hayabusa"
echo "   evtx in: ${INPUT_DIR#"$REPO_ROOT_DIR"/}"
mkdir -p "$OUTPUT_DIR" "$HB_DIR"

# --- locate (or fetch) the binary + rules -----------------------------------
if [[ -z "$HAYABUSA_BIN" ]]; then
    HAYABUSA_BIN="$(find "$HB_DIR" -maxdepth 2 -type f -name 'hayabusa*' -perm -u+x 2>/dev/null | grep -vi '\.zip$' | head -1)"
fi
if [[ -z "$HAYABUSA_BIN" || ! -x "$HAYABUSA_BIN" ]] && [[ "$FETCH" -eq 1 ]]; then
    ver="$HAYABUSA_VERSION"; zip="hayabusa-${ver}-lin-x64-gnu.zip"
    url="https://github.com/Yamato-Security/hayabusa/releases/download/v${ver}/${zip}"
    echo "   ⬇️  fetching Hayabusa v${ver} ..."
    tmp="$(mktemp -d)"
    if command -v curl >/dev/null 2>&1 && curl -fsSL -o "$tmp/$zip" "$url" 2>/dev/null; then
        (cd "$HB_DIR" && unzip -qo "$tmp/$zip") && \
        HAYABUSA_BIN="$(find "$HB_DIR" -maxdepth 2 -type f -name 'hayabusa*' ! -name '*.zip' | head -1)" && \
        chmod +x "$HAYABUSA_BIN" 2>/dev/null
    fi
    rm -rf "$tmp"
fi
if [[ -z "$HAYABUSA_BIN" || ! -x "$HAYABUSA_BIN" ]]; then
    echo "   ⚠️  no hayabusa binary in $HB_DIR."
    echo "      Get it with: $0 --fetch   (online), or drop the release there and set HAYABUSA_BIN."
    exit 0
fi
RULES_DIR="${HAYABUSA_RULES:-$(dirname "$HAYABUSA_BIN")/rules}"
echo "   binary: ${HAYABUSA_BIN#"$REPO_ROOT_DIR"/}"
[[ -d "$RULES_DIR" ]] && echo "   rules:  ${RULES_DIR#"$REPO_ROOT_DIR"/} ($(find "$RULES_DIR" -name '*.yml' 2>/dev/null | wc -l) rules)"

# --- any EVTX to scan? ------------------------------------------------------
evtx_n=$(find "$INPUT_DIR" -type f -iname '*.evtx' 2>/dev/null | wc -l)
if [[ "$evtx_n" -eq 0 ]]; then
    echo "   ℹ️  no *.evtx under $INPUT_DIR yet (e.g. drop logs in data_store/raw/other_raw_data/WinEvt). Nothing to do."
    exit 0
fi
echo "   🗂️  $evtx_n EVTX file(s)"

# --- run --------------------------------------------------------------------
# json-timeline over the whole tree; -L = JSONL, --no-wizard = use default ruleset
# non-interactively, -w skips update, -q quiet. Timezone UTC for consistent times.
raw="$OUTPUT_DIR/.timeline-raw.jsonl"
out="$OUTPUT_DIR/timeline.jsonl"
"$HAYABUSA_BIN" json-timeline \
    --directory "$INPUT_DIR" \
    --output "$raw" \
    --JSONL-output \
    --no-wizard \
    --UTC \
    --quiet \
    ${RULES_DIR:+--rules "$RULES_DIR"} 2>/dev/null

if [[ ! -s "$raw" ]]; then
    echo "   ⚠️  hayabusa produced no output."; rm -f "$raw"; exit 0
fi

# tag each detection with the tool name
python3 - "$raw" "$out" <<'PY'
import json, sys
src, out = sys.argv[1], sys.argv[2]
n = 0
with open(src, encoding="utf-8", errors="replace") as fh, open(out, "w") as w:
    for line in fh:
        line = line.strip()
        if not line:
            continue
        try:
            ev = json.loads(line)
        except Exception:
            continue
        ev["tool"] = "hayabusa"
        w.write(json.dumps(ev) + "\n"); n += 1
print(f"   ✓ {n} detection(s) -> {out}")
PY
rm -f "$raw"
exit 0
