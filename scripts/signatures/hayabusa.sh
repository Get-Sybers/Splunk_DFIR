#!/bin/bash
# ==============================================================================
# Hayabusa signature lane of process-signatures.
#
# Sigma-based Windows event-log detection -> native JSONL. EVTX come from:
#   1. loose *.evtx under data_store/raw
#   2. disk images (E01/raw/img) MOUNTED read-only and scanned IN PLACE — Hayabusa
#      reads <mount>\Windows\System32\winevt\Logs\*.evtx directly, nothing copied.
#      (Mount = ewfmount + ntfs-3g via FUSE; see lib/image-export.sh. Needs
#      /dev/fuse — blocked in this LXC until the host allows it; the lane skips
#      disk images with a fix message until then. SIG_ALLOW_EXTRACT=1 falls back to
#      pulling EVTX out with image_export.)
#
# Output: data_store/processed/signatures/hayabusa/timeline.jsonl (tool:"hayabusa").
# Native Rust binary (no official image); --fetch downloads the pinned release.
# Hayabusa AGPL-3.0; bundled Sigma rules DRL/other per-rule.
# ==============================================================================
set -o pipefail

SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"
REPO_ROOT_DIR="$(realpath "$SCRIPT_DIR/../..")"
# shellcheck source=/dev/null
source "$SCRIPT_DIR/lib/image-export.sh"

LOOSE_DIR="$(realpath -m "${HAYABUSA_INPUT:-$REPO_ROOT_DIR/data_store/raw}")"
DISK_DIR="$(realpath -m "${HAYABUSA_DISK_DIR:-$REPO_ROOT_DIR/data_store/raw/disk_images}")"
HB_DIR="${HAYABUSA_DIR:-$REPO_ROOT_DIR/data_store/dependencies/hayabusa}"
OUTPUT_DIR="${SIGNATURES_OUTPUT_DIR:-$REPO_ROOT_DIR/data_store/processed/signatures}/hayabusa"
MNT_BASE="${SIG_MOUNT_BASE:-/mnt/dfir-sig}"

HAYABUSA_BIN="${HAYABUSA_BIN:-}"
HAYABUSA_VERSION="${HAYABUSA_VERSION:-3.4.0}"
HAYABUSA_DISK="${HAYABUSA_DISK:-1}"
SIG_ALLOW_EXTRACT="${SIG_ALLOW_EXTRACT:-0}"
FETCH="${FETCH:-0}"
for arg in "$@"; do [[ "$arg" == "--fetch" ]] && FETCH=1; done

echo "🦅 Hayabusa"
mkdir -p "$OUTPUT_DIR" "$HB_DIR"

# --- binary + rules ---------------------------------------------------------
[[ -z "$HAYABUSA_BIN" ]] && HAYABUSA_BIN="$(find "$HB_DIR" -maxdepth 2 -type f -name 'hayabusa*' ! -name '*.zip' -perm -u+x 2>/dev/null | head -1)"
if [[ -z "$HAYABUSA_BIN" || ! -x "$HAYABUSA_BIN" ]] && [[ "$FETCH" -eq 1 ]]; then
    ver="$HAYABUSA_VERSION"; zip="hayabusa-${ver}-lin-x64-gnu.zip"
    echo "   ⬇️  fetching Hayabusa v${ver} ..."; tmp="$(mktemp -d)"
    command -v curl >/dev/null 2>&1 && curl -fsSL -o "$tmp/$zip" \
        "https://github.com/Yamato-Security/hayabusa/releases/download/v${ver}/${zip}" 2>/dev/null \
        && (cd "$HB_DIR" && unzip -qo "$tmp/$zip") \
        && HAYABUSA_BIN="$(find "$HB_DIR" -maxdepth 2 -type f -name 'hayabusa*' ! -name '*.zip' | head -1)" \
        && chmod +x "$HAYABUSA_BIN" 2>/dev/null
    rm -rf "$tmp"
fi
if [[ -z "$HAYABUSA_BIN" || ! -x "$HAYABUSA_BIN" ]]; then
    echo "   ⚠️  no hayabusa binary in $HB_DIR — run: $0 --fetch (online), or set HAYABUSA_BIN. Skipping."; exit 0
fi
RULES_DIR="${HAYABUSA_RULES:-$(dirname "$HAYABUSA_BIN")/rules}"
echo "   binary: ${HAYABUSA_BIN#"$REPO_ROOT_DIR"/}"

raw="$OUTPUT_DIR/.timeline-raw.jsonl"; : > "$raw"
run_hayabusa() { # <dir>  -> append JSONL detections to $raw
    local dir="$1" t; t="$(mktemp -u).jsonl"   # -u: name only; hayabusa won't overwrite an existing -o file
    find "$dir" -type f -iname '*.evtx' 2>/dev/null | grep -q . || return 0
    "$HAYABUSA_BIN" json-timeline --directory "$dir" --output "$t" \
        --JSONL-output --no-wizard --UTC --quiet ${RULES_DIR:+--rules "$RULES_DIR"} >/dev/null 2>&1
    [[ -s "$t" ]] && cat "$t" >> "$raw"; rm -f "$t"
}

# --- 1) loose EVTX ----------------------------------------------------------
if find "$LOOSE_DIR" -type f -iname '*.evtx' -not -path "$OUTPUT_DIR/*" 2>/dev/null | grep -q .; then
    echo "   📄 scanning loose EVTX under ${LOOSE_DIR#"$REPO_ROOT_DIR"/}"; run_hayabusa "$LOOSE_DIR"
fi

# --- 2) disk images: mount read-only, scan in place -------------------------
if [[ "$HAYABUSA_DISK" == "1" && -d "$DISK_DIR" ]]; then
    mapfile -t images < <(sig_list_images "$DISK_DIR")
    echo "   💽 ${#images[@]} disk image(s)"
    if sig_have_fuse; then
        i=0
        for img in "${images[@]}"; do
            mnt="$MNT_BASE/$i"; i=$((i+1))
            if sig_mount_image "$img" "$mnt"; then
                logs="$mnt/Windows/System32/winevt/Logs"
                [[ -d "$logs" ]] || logs="$mnt"          # non-standard layout: scan whole mount
                n=$(find "$logs" -iname '*.evtx' 2>/dev/null | wc -l)
                echo "   🔒 ${img##*/} mounted — $n EVTX"; run_hayabusa "$logs"
                sig_unmount_image "$mnt"
            else
                echo "   ·  ${img##*/} — not a mountable Windows volume (skipped)"
            fi
        done
    else
        # No FUSE mount here (needs host /dev/fuse), and Hayabusa's -J JSON input
        # does NOT produce detections from evtx_dump/Plaso JSON (verified: 0 hits
        # vs 792 on the same events natively — Hayabusa issue #1324). So the working
        # path is real .evtx: extract them mount-free with the log2timeline container
        # (image_export, dfVFS), scan, and DISCARD the temp copies.
        echo "   ↪ extracting EVTX via the log2timeline container (image_export), transient"
        for img in "${images[@]}"; do
            ex="$(mktemp -d)"
            if sig_image_export "$img" "$ex" --artifact_filters WindowsEventLogs 2>/dev/null; then
                echo "   ✓ ${img##*/} — $(find "$ex" -iname '*.evtx' | wc -l) EVTX"; run_hayabusa "$ex"
            fi
            rm -rf "$ex"
        done
    fi
fi

# --- emit -------------------------------------------------------------------
out="$OUTPUT_DIR/timeline.jsonl"
if [[ ! -s "$raw" ]]; then
    echo "   ℹ️  no detections (no EVTX reachable). Nothing written."; rm -f "$raw"; exit 0
fi
python3 - "$raw" "$out" <<'PY'
import json, sys
n = 0
with open(sys.argv[1], encoding="utf-8", errors="replace") as fh, open(sys.argv[2], "w") as w:
    for line in fh:
        line = line.strip()
        if not line: continue
        try: ev = json.loads(line)
        except Exception: continue
        ev["tool"] = "hayabusa"
        w.write(json.dumps(ev) + "\n"); n += 1
print(f"   ✓ {n} detection(s) -> {sys.argv[2]}")
PY
rm -f "$raw"
exit 0
