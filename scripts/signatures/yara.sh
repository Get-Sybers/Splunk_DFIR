#!/bin/bash
# ==============================================================================
# YARA signature lane of process-signatures.
#
# Scans evidence files with a YARA ruleset and emits one JSON object per MATCH:
#
#   data_store/raw/<target>                    files to scan (default: loose files)
#   data_store/dependencies/yara-rules/        the .yar / .yara ruleset (+ index)
#   data_store/processed/signatures/yara/matches.jsonl   one match per line
#
# Each JSONL record is self-describing:
#   {"tool":"yara","rule":"<name>","target":"<scanned file>",
#    "strings":[{"id":"$s1","offset":21,"data":"MZ"}, ...],"source":"<rel path>"}
#
# YARA has no native JSON output. We scan file-by-file (yara's recursive `-r` and
# `--scan-list` hang in the container image, but a single-file scan is reliable and
# — unlike a dir scan — prints the matched strings). To keep it to ONE container
# start, we loop over a generated file list inside the container. Output is yara's
# stable text form, parsed on the host: a line not starting with "0x" is a match
# line "<rule> <path>" (rule names never contain spaces → one split is
# unambiguous); "0x…" lines are that match's strings.
#
# YARA is BSD-3-Clause. Rules carry their own licenses — see the ruleset you drop
# into yara-rules/ (e.g. YARA-Forge, Neo23x0/signature-base).
# ==============================================================================
set -o pipefail

SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"
REPO_ROOT_DIR="$(realpath "$SCRIPT_DIR/../..")"

# What to scan. Default to the loose extracted files, NOT the multi-GB disk/memory
# images (scanning those is valid but slow; point YARA_TARGET at them explicitly).
YARA_TARGET="${YARA_TARGET:-$REPO_ROOT_DIR/data_store/raw/other_raw_data}"
YARA_RULES="${YARA_RULES:-$REPO_ROOT_DIR/data_store/dependencies/yara-rules}"
OUTPUT_DIR="${SIGNATURES_OUTPUT_DIR:-$REPO_ROOT_DIR/data_store/processed/signatures}/yara"
# Docker rejects relative volume mounts — normalize to absolute paths.
YARA_TARGET="$(realpath -m "$YARA_TARGET")"
YARA_RULES="$(realpath -m "$YARA_RULES")"

# Container by default (matching the rest of the pipeline); YARA_NATIVE names a
# local `yara` binary to run instead (offline / no-Docker hosts).
YARA_IMAGE="${YARA_IMAGE:-blacktop/yara:latest}"
YARA_NATIVE="${YARA_NATIVE:-}"
FETCH_RULES="${FETCH_RULES:-0}"       # --fetch clones a starter ruleset when online

for arg in "$@"; do [[ "$arg" == "--fetch" ]] && FETCH_RULES=1; done

echo "🔬 YARA"
echo "   target: ${YARA_TARGET#"$REPO_ROOT_DIR"/}"
echo "   rules:  ${YARA_RULES#"$REPO_ROOT_DIR"/}"
mkdir -p "$OUTPUT_DIR" "$YARA_RULES"

# --- rules ------------------------------------------------------------------
# A starter ruleset so the lane is useful out of the box; only when asked and
# online. Otherwise the user drops their own .yar files into yara-rules/.
if [[ "$FETCH_RULES" -eq 1 ]] && ! find "$YARA_RULES" \( -iname '*.yar' -o -iname '*.yara' \) 2>/dev/null | grep -q .; then
    echo "   ⬇️  fetching a starter ruleset (YARA-Forge full) ..."
    tmp="$(mktemp -d)"
    if command -v curl >/dev/null 2>&1 && curl -fsSL -o "$tmp/rules.zip" \
        "https://github.com/YARAHQ/yara-forge/releases/latest/download/yara-forge-rules-full.zip" 2>/dev/null; then
        (cd "$tmp" && unzip -qo rules.zip 2>/dev/null); find "$tmp" -name '*.yar' -exec cp {} "$YARA_RULES/" \; 2>/dev/null
    fi
    rm -rf "$tmp"
fi

mapfile -t rulefiles < <(find "$YARA_RULES" -type f \( -iname '*.yar' -o -iname '*.yara' \) ! -name '_dfir_index.yar' 2>/dev/null | sort)
if [ ${#rulefiles[@]} -eq 0 ]; then
    echo "   ⚠️  no rules in $YARA_RULES — drop *.yar files there (or re-run with --fetch while online). Skipping."
    exit 0
fi
if [ ! -d "$YARA_TARGET" ] || ! find "$YARA_TARGET" -type f 2>/dev/null | grep -q .; then
    echo "   ⚠️  no files to scan under $YARA_TARGET. Skipping."
    exit 0
fi

# An index file that `include`s every rule, so one yara invocation covers them all.
# Written inside the rules dir so its container path (/rules) resolves the includes.
index="$YARA_RULES/_dfir_index.yar"
: > "$index"
for rf in "${rulefiles[@]}"; do
    printf 'include "/rules/%s"\n' "${rf#"$YARA_RULES"/}" >> "$index"
done

# The file list to scan (container paths under /scan). Count for the log.
listfile="$OUTPUT_DIR/.scanlist.txt"
: > "$listfile"
nfiles=0
while IFS= read -r f; do
    printf '/scan/%s\n' "${f#"$YARA_TARGET"/}" >> "$listfile"
    nfiles=$((nfiles+1))
done < <(find "$YARA_TARGET" -type f 2>/dev/null)
echo "   ${#rulefiles[@]} rule file(s), $nfiles file(s) to scan"

out="$OUTPUT_DIR/matches.jsonl"
raw="$OUTPUT_DIR/.yara-raw.txt"

if [[ -n "$YARA_NATIVE" ]]; then
    # native yara handles -r fine, but loop per file for identical (string-bearing) output
    : > "$raw"
    while IFS= read -r f; do
        [[ -n "$f" ]] && "$YARA_NATIVE" -w -s -N "$index" "$f" >> "$raw" 2>/dev/null
    done < <(find "$YARA_TARGET" -type f 2>/dev/null)
else
    # one container, per-file loop inside it (avoids the container's broken -r)
    docker run --rm --entrypoint sh \
        -v "$YARA_RULES":/rules:ro \
        -v "$YARA_TARGET":/scan:ro \
        -v "$listfile":/list.txt:ro \
        "$YARA_IMAGE" -c \
        'while IFS= read -r f; do [ -n "$f" ] && yara -w -s -N /rules/_dfir_index.yar "$f"; done < /list.txt' \
        > "$raw" 2>/dev/null
fi

# --- parse the yara text output into JSONL ----------------------------------
TARGET_ROOT="$YARA_TARGET" python3 - "$raw" "$out" <<'PY'
import json, os, sys, re
raw_path, out_path = sys.argv[1], sys.argv[2]
target_root = os.environ.get("TARGET_ROOT", "").rstrip("/")
base = os.path.basename(target_root)
str_re = re.compile(r'^0x([0-9a-fA-F]+):(\$[^:]*):\s?(.*)$')
n = 0
with open(raw_path, encoding="utf-8", errors="replace") as fh, open(out_path, "w") as w:
    cur = None
    def flush():
        global cur, n
        if cur is not None:
            w.write(json.dumps(cur) + "\n"); n += 1; cur = None
    for line in fh:
        line = line.rstrip("\n")
        if not line:
            continue
        m = str_re.match(line)
        if m and cur is not None:                      # a matched-string line
            cur["strings"].append({"id": m.group(2), "offset": int(m.group(1), 16), "data": m.group(3)})
            continue
        flush()                                        # new match line: "<rule> <path>"
        parts = line.split(None, 1)
        if len(parts) != 2:
            continue
        rule, path = parts
        if path.startswith("/scan/"):
            rel = path[len("/scan/"):]
        elif target_root and path.startswith(target_root):
            rel = path[len(target_root):].lstrip("/")
        else:
            rel = path
        cur = {"tool": "yara", "rule": rule, "target": rel,
               "source": os.path.join(base, rel) if rel else base, "strings": []}
    flush()
print(f"   ✓ {n} match(es) -> {out_path}")
PY
rm -f "$raw" "$index" "$listfile"
[[ -s "$out" ]] || { echo "   (no matches)"; : > "$out"; }
exit 0
