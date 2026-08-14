#!/bin/bash
# ==============================================================================
# Hayabusa signature lane of process-signatures.
#
# Sigma-based Windows event-log detection -> native JSONL. EVTX come from:
#   1. loose *.evtx under data_store/raw
#   2. disk images (E01/raw/img). Preferred: MOUNT read-only and scan winevt\Logs
#      in place (ewfmount + ntfs-3g via FUSE — needs /dev/fuse, blocked in this LXC
#      until the host allows it, nothing copied). Otherwise: a TARGETED triage
#      extraction pulls ONLY the event logs with image_export --artifact_filters
#      WindowsEventLogs (dfVFS, E01-capable), scans, and discards. Only the event
#      logs are ever pulled (Hayabusa needs real .evtx; its -J JSON input yields 0
#      detections on Plaso/evtx_dump JSON vs 792 natively, #1324).
#
# Output: data_store/processed/signatures/hayabusa/timeline.jsonl (tool:"hayabusa").
# Native Rust binary (no official image); --fetch downloads the pinned release.
# Hayabusa AGPL-3.0; bundled Sigma rules DRL/other per-rule.
# ==============================================================================
set -o pipefail

SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"
REPO_ROOT_DIR="$(realpath "$SCRIPT_DIR/../..")"
# shellcheck source=/dev/null
source "$SCRIPT_DIR/lib/disk-image.sh"

LOOSE_DIR="$(realpath -m "${HAYABUSA_INPUT:-$REPO_ROOT_DIR/data_store/raw}")"
DISK_DIR="$(realpath -m "${HAYABUSA_DISK_DIR:-$REPO_ROOT_DIR/data_store/raw/disk_images}")"
HB_DIR="${HAYABUSA_DIR:-$REPO_ROOT_DIR/data_store/dependencies/hayabusa}"
OUTPUT_DIR="${SIGNATURES_OUTPUT_DIR:-$REPO_ROOT_DIR/data_store/processed/signatures}/hayabusa"
MNT_BASE="${SIG_MOUNT_BASE:-/mnt/dfir-sig}"

HAYABUSA_BIN="${HAYABUSA_BIN:-}"
HAYABUSA_VERSION="${HAYABUSA_VERSION:-3.4.0}"
HAYABUSA_DISK="${HAYABUSA_DISK:-1}"
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
        # No mount here (needs host /dev/fuse) — pull ONLY the event logs out with a
        # triage-style artefact extraction (image_export --artifact_filters
        # WindowsEventLogs), scan, and discard. Scoped to Hayabusa: nothing else is
        # extracted, and the YARA lane never does this. (Hayabusa's -J JSON input
        # can't substitute — 0 detections on Plaso/evtx_dump JSON vs 792 natively,
        # #1324.)
        echo "   ↪ no mount — extracting event logs (WindowsEventLogs), transient"
        for img in "${images[@]}"; do
            ex="$(mktemp -d)"
            if sig_extract_artifacts "$img" "$ex" --artifact_filters WindowsEventLogs 2>/dev/null; then
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
