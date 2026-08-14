#!/bin/bash
# ==============================================================================
# YARA signature lane of process-signatures. Scans THREE sources with a ruleset:
#
#   files   loose files (default other_raw_data)      -> matches.jsonl
#   disk    files pulled OUT of disk images (E01/raw)  -> disk.jsonl
#           via Plaso image_export.py (mount-free — this LXC can't mount images)
#   memory  process memory, THROUGH Volatility 3       -> memory.jsonl
#           (windows.vadyarascan — matches carry PID/process context)
#
# Pick sources with YARA_SOURCES (default "files disk memory"). Each match is a
# self-describing JSON object:
#   {"tool":"yara","source":"<file|disk|memory>","rule":"<name>","target":"...",
#    "strings":[{"id":"$s1","offset":21,"data":"MZ"}...], "pid":123,"process":"..."}
#
# YARA has no JSON output and the container's recursive -r/--scan-list hang, so
# file/disk scans loop per-file inside one container (per-file scans print
# strings) and we parse yara's stable text form. Memory scans reuse the Volatility
# jsonl_dfir renderer.  YARA is BSD-3-Clause; rules carry their own licenses.
# ==============================================================================
set -o pipefail

SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"
REPO_ROOT_DIR="$(realpath "$SCRIPT_DIR/../..")"
# shellcheck source=/dev/null
source "$SCRIPT_DIR/lib/image-export.sh"

YARA_SOURCES="${YARA_SOURCES:-files disk memory}"
YARA_RULES="$(realpath -m "${YARA_RULES:-$REPO_ROOT_DIR/data_store/dependencies/yara-rules}")"
OUTPUT_DIR="${SIGNATURES_OUTPUT_DIR:-$REPO_ROOT_DIR/data_store/processed/signatures}/yara"

YARA_TARGET="$(realpath -m "${YARA_TARGET:-$REPO_ROOT_DIR/data_store/raw/other_raw_data}")"   # files source
YARA_DISK_DIR="$(realpath -m "${YARA_DISK_DIR:-$REPO_ROOT_DIR/data_store/raw/disk_images}")"  # disk source
YARA_MEMORY_DIR="$(realpath -m "${YARA_MEMORY_DIR:-$REPO_ROOT_DIR/data_store/raw/memory}")"   # memory source
YARA_DISK_SUBPATH="${YARA_DISK_SUBPATH:-}"   # narrow the mounted scan, e.g. "Users" or "Windows/Temp"
MNT_BASE="${SIG_MOUNT_BASE:-/mnt/dfir-sig}"
SIG_ALLOW_EXTRACT="${SIG_ALLOW_EXTRACT:-0}"
# only used by the opt-in extraction fallback (FUSE-less hosts)
YARA_DISK_EXTS="${YARA_DISK_EXTS:-exe,dll,sys,scr,com,ocx,cpl,ps1,psm1,vbs,vbe,js,jse,wsf,hta,bat,cmd,jar,lnk,doc,docx,xls,xlsx,ppt,pptx,pdf,rtf,zip,rar,7z}"

YARA_IMAGE="${YARA_IMAGE:-blacktop/yara:latest}"
YARA_NATIVE="${YARA_NATIVE:-}"
VOL_IMAGE="${VOLATILITY_IMAGE:-sk4la/volatility3:latest}"
VOL_SYMBOLS="${VOLATILITY_SYMBOLS:-$REPO_ROOT_DIR/data_store/dependencies/volatility3-symbols}"
VOL_RENDERER="${VOLATILITY_RENDERER:-$REPO_ROOT_DIR/dev-scripts/volatility/jsonl_dfir_renderer.py}"
FETCH_RULES="${FETCH_RULES:-0}"
for arg in "$@"; do [[ "$arg" == "--fetch" ]] && FETCH_RULES=1; done

echo "🔬 YARA   sources: $YARA_SOURCES"
mkdir -p "$OUTPUT_DIR" "$YARA_RULES"

# --- rules ------------------------------------------------------------------
if [[ "$FETCH_RULES" -eq 1 ]] && ! find "$YARA_RULES" \( -iname '*.yar' -o -iname '*.yara' \) 2>/dev/null | grep -q .; then
    echo "   ⬇️  fetching a starter ruleset (YARA-Forge full) ..."
    tmp="$(mktemp -d)"
    command -v curl >/dev/null 2>&1 && curl -fsSL -o "$tmp/r.zip" \
        "https://github.com/YARAHQ/yara-forge/releases/latest/download/yara-forge-rules-full.zip" 2>/dev/null \
        && (cd "$tmp" && unzip -qo r.zip 2>/dev/null) && find "$tmp" -name '*.yar' -exec cp {} "$YARA_RULES/" \; 2>/dev/null
    rm -rf "$tmp"
fi
mapfile -t rulefiles < <(find "$YARA_RULES" -type f \( -iname '*.yar' -o -iname '*.yara' \) ! -name '_*.yar' 2>/dev/null | sort)
if [ ${#rulefiles[@]} -eq 0 ]; then
    echo "   ⚠️  no rules in $YARA_RULES — drop *.yar files there (or --fetch while online). Skipping."; exit 0
fi
echo "   ${#rulefiles[@]} rule file(s)"
# index for file/disk scans (yara resolves the includes at /rules)
index="$YARA_RULES/_dfir_index.yar"; : > "$index"
for rf in "${rulefiles[@]}"; do printf 'include "/rules/%s"\n' "${rf#"$YARA_RULES"/}" >> "$index"; done
# single combined file for Volatility's --yara-file (naive concat; unique names assumed)
combined="$OUTPUT_DIR/.combined.yar"; cat "${rulefiles[@]}" > "$combined" 2>/dev/null

# ---------------------------------------------------------------------------
# parse yara text output (rule+path[+strings]) -> JSONL, tagging source/base.
# args: <raw-file> <out-file> <source> <path-strip-prefix> <base-label>
# ---------------------------------------------------------------------------
parse_yara() {
    SRC="$3" STRIP="$4" BASE="$5" python3 - "$1" "$2" <<'PY'
import json, os, re, sys
raw, out = sys.argv[1], sys.argv[2]
src = os.environ["SRC"]; strip = os.environ["STRIP"]; base = os.environ["BASE"]
sre = re.compile(r'^0x([0-9a-fA-F]+):(\$[^:]*):\s?(.*)$')
n = 0; cur = None
def flush(w):
    global cur, n
    if cur is not None: w.write(json.dumps(cur)+"\n"); n += 1; cur = None
with open(raw, encoding="utf-8", errors="replace") as fh, open(out, "a") as w:
    for line in fh:
        line = line.rstrip("\n")
        if not line: continue
        m = sre.match(line)
        if m and cur is not None:
            cur["strings"].append({"id": m.group(2), "offset": int(m.group(1),16), "data": m.group(3)}); continue
        flush(w)
        p = line.split(None, 1)
        if len(p) != 2: continue
        rule, path = p
        rel = path[len(strip):].lstrip("/") if strip and path.startswith(strip) else path
        cur = {"tool":"yara","source":src,"rule":rule,"target":rel,
               "match":os.path.join(base, rel) if base else rel,"strings":[]}
    flush(w)
print(n)
PY
}

# scan a mounted-in dir of files, one container, per-file loop. args: <dir> <out> <source> <base>
scan_dir() {
    local dir="$1" out="$2" source="$3" base="$4"
    find "$dir" -type f 2>/dev/null | grep -q . || return 0
    local listf raw; listf="$(mktemp)"; raw="$(mktemp)"
    while IFS= read -r f; do printf '/scan/%s\n' "${f#"$dir"/}" >> "$listf"; done < <(find "$dir" -type f 2>/dev/null)
    if [[ -n "$YARA_NATIVE" ]]; then
        while IFS= read -r f; do "$YARA_NATIVE" -w -s -N "$index" "$f" >> "$raw" 2>/dev/null; done < <(find "$dir" -type f 2>/dev/null)
    else
        docker run --rm --entrypoint sh -v "$YARA_RULES":/rules:ro -v "$dir":/scan:ro -v "$listf":/list.txt:ro \
            "$YARA_IMAGE" -c 'while IFS= read -r f; do [ -n "$f" ] && yara -w -s -N /rules/_dfir_index.yar "$f"; done < /list.txt' > "$raw" 2>/dev/null
    fi
    local got; got="$(parse_yara "$raw" "$out" "$source" "/scan/" "$base")"
    rm -f "$listf" "$raw"; echo "${got:-0}"
}

# ====================== source: files ======================================
if [[ " $YARA_SOURCES " == *" files "* ]]; then
    out="$OUTPUT_DIR/matches.jsonl"; : > "$out"
    if [ -d "$YARA_TARGET" ]; then
        n="$(scan_dir "$YARA_TARGET" "$out" "file" "$(basename "$YARA_TARGET")")"
        echo "   📄 files: ${n:-0} match(es) -> matches.jsonl"
    else echo "   📄 files: target $YARA_TARGET absent, skipped"; fi
fi

# ====================== source: disk (MOUNT read-only, scan in place) =======
if [[ " $YARA_SOURCES " == *" disk "* ]]; then
    out="$OUTPUT_DIR/disk.jsonl"; : > "$out"
    mapfile -t images < <(sig_list_images "$YARA_DISK_DIR")
    echo "   💽 disk: ${#images[@]} image(s)"
    total=0
    if sig_have_fuse; then
        i=0
        for img in "${images[@]}"; do
            mnt="$MNT_BASE/y$i"; i=$((i+1))
            if sig_mount_image "$img" "$mnt"; then
                scanroot="$mnt${YARA_DISK_SUBPATH:+/$YARA_DISK_SUBPATH}"
                [[ -d "$scanroot" ]] || scanroot="$mnt"
                n="$(scan_dir "$scanroot" "$out" "disk" "${img##*/}")"
                [[ "${n:-0}" -gt 0 ]] && echo "   🔒 ${img##*/} — ${n} match(es)"
                total=$((total + ${n:-0}))
                sig_unmount_image "$mnt"
            else
                echo "   ·  ${img##*/} — not a mountable Windows volume (skipped)"
            fi
        done
        echo "   💽 disk: $total match(es) -> disk.jsonl"
    else
        # No FUSE mount here (needs host /dev/fuse) — extract the targeted file
        # types mount-free with the log2timeline container (image_export), scan,
        # then discard the temp copies.
        echo "   ↪ no FUSE mount — extracting {$YARA_DISK_EXTS} via image_export (transient)"
        for img in "${images[@]}"; do
            ex="$(mktemp -d)"; chmod 777 "$ex"
            sig_image_export "$img" "$ex" -x "$YARA_DISK_EXTS" 2>/dev/null && \
                total=$((total + $(scan_dir "$ex" "$out" "disk" "${img##*/}") ))
            rm -rf "$ex"
        done
        echo "   💽 disk: $total match(es) -> disk.jsonl"
    fi
fi

# ====================== source: memory (Volatility vadyarascan) =============
if [[ " $YARA_SOURCES " == *" memory "* ]]; then
    out="$OUTPUT_DIR/memory.jsonl"; : > "$out"
    chmod 777 "$VOL_SYMBOLS" 2>/dev/null || true
    mapfile -t mems < <(find "$YARA_MEMORY_DIR" -type f \( -iname '*.raw' -o -iname '*.mem' -o -iname '*.dmp' -o -iname '*.lime' -o -iname '*.vmem' -o -iname '*dramimage' -o -iname '*.bin' \) 2>/dev/null | sort)
    echo "   🧠 memory: ${#mems[@]} image(s) via windows.vadyarascan"
    WRAP='
import importlib.util, sys
spec=importlib.util.spec_from_file_location("r", sys.argv[1]); m=importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
from volatility3.cli import CommandLine
sys.argv=["vol","-q","-s",sys.argv[2],"-r","jsonl_dfir","-f",sys.argv[3],"windows.vadyarascan.VadYaraScan","--yara-file",sys.argv[4]]
CommandLine().run()
'
    total=0
    for mem in "${mems[@]}"; do
        raw="$(mktemp)"
        docker run --rm -v "$(dirname "$mem")":/mem:ro -v "$VOL_SYMBOLS":/symbols \
            -v "$VOL_RENDERER":/opt/r.py:ro -v "$combined":/rules/combined.yar:ro \
            --entrypoint python3 "$VOL_IMAGE" -c "$WRAP" /opt/r.py /symbols "/mem/$(basename "$mem")" /rules/combined.yar > "$raw" 2>/dev/null
        # vadyarascan JSONL -> yara-match JSONL (Rule, PID, Process/Value/Offset)
        MEM="${mem#"$YARA_MEMORY_DIR"/}" python3 - "$raw" "$out" <<'PY'
import json, os, sys
raw, out = sys.argv[1], sys.argv[2]; mem = os.environ.get("MEM","")
n = 0
with open(raw, encoding="utf-8", errors="replace") as fh, open(out, "a") as w:
    for line in fh:
        line = line.strip()
        if not line: continue
        try: r = json.loads(line)
        except Exception: continue
        rule = r.get("Rule") or r.get("rule")
        if not rule: continue
        w.write(json.dumps({"tool":"yara","source":"memory","rule":rule,
            "pid": r.get("PID"), "process": r.get("Process"),
            "offset": r.get("Offset"), "value": r.get("Value"),
            "target": mem, "match": mem}) + "\n"); n += 1
print(n)
PY
        rm -f "$raw"
    done
    echo "   🧠 memory: $(wc -l < "$out") match(es) -> memory.jsonl"
fi

rm -f "$index" "$combined"
echo "   ✓ YARA done -> $OUTPUT_DIR/{matches,disk,memory}.jsonl"
exit 0
