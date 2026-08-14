#!/bin/bash

# Ensure correct filepath assigned when referenced
SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"  # Resolves full path
REPO_ROOT_DIR="$(realpath "$SCRIPT_DIR/..")"

# Set the input directory containing E01 files
INPUT_DIR="$REPO_ROOT_DIR/data_store/raw/disk_images"
# Set the input directory containing VMware VM exports (one sub-folder per VM)
VM_INPUT_DIR="$REPO_ROOT_DIR/data_store/raw/VM_files"
HOST_OUTPUT_DIR="$REPO_ROOT_DIR/data_store/processed/log2timeline"

################################################################################
echo ""
echo " ██████╗ ███████╗████████╗   ███████╗██╗   ██╗██████╗ ███████╗██████╗ ███████╗"
sleep 0.1
echo "██╔════╝ ██╔════╝╚══██╔══╝   ██╔════╝╚██╗ ██╔╝██╔══██╗██╔════╝██╔══██╗██╔════╝"
sleep 0.1
echo "██║  ███╗█████╗     ██║█████╗███████╗ ╚████╔╝ ██████╔╝█████╗  ██████╔╝███████╗"
sleep 0.1
echo "██║   ██║██╔══╝     ██║╚════╝╚════██║  ╚██╔╝  ██╔══██╗██╔══╝  ██╔══██╗╚════██║"
sleep 0.1
echo "╚██████╔╝███████╗   ██║      ███████║   ██║   ██████╔╝███████╗██║  ██║███████║"
sleep 0.1
echo "╚═════╝ ╚══════╝   ╚═╝      ╚══════╝   ╚═╝   ╚═════╝ ╚══════╝╚═╝  ╚═╝╚══════╝"
echo ""

echo "$REPO_ROOT_DIR"
echo ""

# Output layout (ingest-kusto.sh globs data_store/processed/log2timeline/jsonl/*.jsonl):
#   jsonl/<hostname>.jsonl   enriched Plaso json_line, one per image, named by host
#   plaso/<name>.plaso       the durable Plaso storage db (reprocess without
#                            re-parsing the image), plus <name>.pinfo.json
#   logs/<name>.log          the per-image processing log
sudo mkdir -p "$HOST_OUTPUT_DIR"/jsonl "$HOST_OUTPUT_DIR"/plaso "$HOST_OUTPUT_DIR"/logs
sudo mkdir -p "$INPUT_DIR" "$VM_INPUT_DIR"
sudo chown -R "$(whoami):docker" "$HOST_OUTPUT_DIR" "$INPUT_DIR"
sudo chmod -R 777 "$HOST_OUTPUT_DIR" "$INPUT_DIR"
# NOTE: Do NOT recursively chown/chmod $VM_INPUT_DIR. VM exports can contain
# multi-GB .vmdk/-flat.vmdk files; recursing would be very slow and would
# mutate ownership/permission metadata of raw evidence. The VM folder is
# bind-mounted into the Plaso container read-only, so it only needs to be
# readable. Just make sure the top-level directory itself is traversable.
sudo chmod a+rx "$VM_INPUT_DIR" 2>/dev/null || true

# ------------------------------------------------------------------------------
# run_plaso <mount_dir> <source_rel> <output_name>
#
# Plaso two-step, with our DFIR json_line output module doing the enrichment
# natively FROM THE DB (no second pass over the logs):
#   1. log2timeline.py    parse the image into a .plaso storage db (kept — it
#                         lets an analyst re-run psort later without re-parsing).
#   2. psort.py -o        render the db to json_line with dev-scripts/plaso/
#      l2t_json_dfir       l2t_json_dfir.py, which adds image_hostname (from the
#                         db's system_configuration), username, disk_id and
#                         volume_id (from each event's path spec) to EVERY event.
#                         --output_fallback_hostname enables the mediator's
#                         host/user resolution. The module is loaded via a small
#                         import wrapper; the two paths are passed as argv so the
#                         output name never has to be spliced into Python source.
#   3. rename             name the output by the image_hostname the module put on
#                         the events (the box's own name), not the image filename.
#
# The raw output is written without a .jsonl extension so the ingest glob
# (*.jsonl) never picks up a half-finished file; only the final <host>.jsonl matches.
PLASO_OUTPUT_MODULE="$REPO_ROOT_DIR/dev-scripts/plaso/l2t_json_dfir.py"
run_plaso() {
    local mount_dir="$1" src_rel="$2" name="$3"
    local plaso_db="$HOST_OUTPUT_DIR/plaso/$name.plaso"
    local raw="$HOST_OUTPUT_DIR/jsonl/.$name.raw"
    local log="$HOST_OUTPUT_DIR/logs/$name.log"
    local host_name final

    docker run --rm -v "$mount_dir":/data:ro -v "$HOST_OUTPUT_DIR":/output log2timeline/plaso \
        log2timeline.py --status_view none --partitions all --vss-stores all \
        --storage-file /output/plaso/"$name".plaso /data/"$src_rel" > "$log" 2>&1
    if [[ ! -s "$plaso_db" ]]; then
        echo "Error: log2timeline produced no .plaso for $name" | tee -a "$log"; return 1
    fi

    docker run --rm -v "$HOST_OUTPUT_DIR":/output -v "$PLASO_OUTPUT_MODULE":/opt/l2t_json_dfir.py:ro \
        --entrypoint python3 log2timeline/plaso -c '
import importlib.util, sys
spec = importlib.util.spec_from_file_location("l2t_json_dfir", "/opt/l2t_json_dfir.py")
mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)
from plaso.scripts.psort import Main
sys.argv = ["psort.py", "--status_view", "none", "-o", "l2t_json_dfir",
            "--output_fallback_hostname", "-w", sys.argv[1], sys.argv[2]]
sys.exit(Main())
' "/output/jsonl/.$name.raw" "/output/plaso/$name.plaso" >> "$log" 2>&1
    if [[ ! -s "$raw" ]]; then
        echo "Error: psort produced no json_line for $name (0 events?)" | tee -a "$log"
        rm -f "$raw"; return 1
    fi

    # Name by the image_hostname the module resolved (constant across the file).
    host_name=$(head -1 "$raw" | python3 -c 'import sys,json
try: print((json.loads(sys.stdin.readline()).get("image_hostname") or "").strip())
except Exception: print("")' 2>/dev/null)
    host_name=$(printf '%s' "$host_name" | tr -c 'A-Za-z0-9._-' '_' | sed 's/^_*//; s/_*$//')
    [[ -n "$host_name" ]] || host_name="$name"
    final="$HOST_OUTPUT_DIR/jsonl/${host_name}.jsonl"
    # Two images resolving to the same hostname keep distinct output.
    [[ -e "$final" ]] && final="$HOST_OUTPUT_DIR/jsonl/${host_name}_${name}.jsonl"
    mv -f "$raw" "$final"
    echo "✅ $src_rel -> jsonl/$(basename "$final") (host=$host_name, $(wc -l < "$final") events)" | tee -a "$log"
    return 0
}

# Enable case-insensitive globbing
shopt -s nocaseglob
shopt -s nullglob

# Debug: List available files before processing
echo "Checking for forensic image files in: $INPUT_DIR"
ls -lh "$INPUT_DIR"

# Derive a COLLISION-FREE output base name for one image.
#
# The dftt-2004 corpus ships the same logical image in several container formats
# under a shared stem: imageformat_mmls_1.E01, imageformat_mmls_1.vhd,
# imageformat_mmls_1.vmdk. Stripping the extension — the old behaviour —
# collapsed all three to "imageformat_mmls_1", so each psteal run overwrote the
# previous one's output and log and only the last format survived. Keep the format
# in the output name instead: the INPUT is never renamed, only the output base
# carries a "_<ext>" suffix, so every source file gets its own timeline.
#
# For a multi-segment EWF set only the .E01 is processed (libewf reads the rest),
# so the whole set yields a single "<stem>_E01" output — still unique, and it
# will not collide with a "<stem>.dd" of the same stem sitting beside it.
#
# The argument is a path RELATIVE to the input directory, because images live in
# per-source subfolders (data_store/raw/disk_images/<source>/…) that users and
# the sample collector both populate, and different sources routinely reuse the
# same basename. Deriving the name from the whole relative path — "src/img.E01"
# -> "src_img_E01" — keeps every source's output distinct and traceable.
get_clean_filename() {
    local rel="$1"
    rel="${rel//\//_}"          # subfolder separators -> underscore (provenance)
    rel="${rel// /_}"           # spaces would break the container -w path
    if [[ "$rel" == *.* ]]; then
        rel="${rel%.*}_${rel##*.}"   # final "name.ext" -> "name_ext"
    fi
    echo "$rel"
}

# ---- content-first format detection ------------------------------------------
#
# Extensions lie: a corpus image named .dd can actually be EWF, and images turn
# up with no extension at all. So each file is identified by its MAGIC BYTES
# first, with the extension used only as a fallback when the content is
# inconclusive. When the two disagree, content wins and the mismatch is logged.
#
# Detection stays cheap even on multi-GB images: it reads 8 header bytes (and,
# for a VHD, the 512-byte footer) — never the whole file.
#
# Positively recognised by content: EWF/EWF2 (E01…), VMDK (sparse "KDMV" or a
# text descriptor), VHD ("conectix" header/footer), VHDX, QCOW2. RAW/dd/img and
# AFF carry no reliable signature, so those depend on the extension fallback.

_first8_hex() { LC_ALL=C dd if="$1" bs=1 count=8 2>/dev/null | od -An -tx1 | tr -d ' \n'; }

detect_format() {           # file -> ewf1|ewf-cont|ewf2|vmdk|vhd|vhdx|qcow2|""
    local f="$1" h seg lo hi
    [[ -f "$f" ]] || { echo ""; return; }
    h="$(_first8_hex "$f")"
    case "$h" in
        455646090d0aff00)                       # "EVF\x09\x0d\x0a\xff\x00" — EWF
            # Segment number is a uint16 LE at offset 9; segment 1 is the head of
            # the set, so only it is handed to psteal (libewf reads the rest).
            seg="$(LC_ALL=C dd if="$f" bs=1 skip=9 count=2 2>/dev/null | od -An -tx1 | tr -d ' \n')"
            lo=$((16#${seg:0:2})); hi=$((16#${seg:2:2}))
            (( hi * 256 + lo == 1 )) && echo "ewf1" || echo "ewf-cont"; return ;;
        455646320d0a8100) echo "ewf2";  return ;;   # "EVF2\x0d\x0a\x81\x00"
        4b444d56*)        echo "vmdk";  return ;;   # "KDMV" monolithic sparse VMDK
        514649fb*)        echo "qcow2"; return ;;   # "QFI\xfb"
        7668647866696c65) echo "vhdx";  return ;;   # "vhdxfile"
        636f6e6563746978) echo "vhd";   return ;;   # "conectix" (dynamic VHD header)
    esac
    # VMDK text descriptor (points at -flat/-sNNN extents in the same directory).
    if LC_ALL=C head -c 64 -- "$f" 2>/dev/null | grep -q '^# Disk DescriptorFile'; then
        echo "vmdk"; return
    fi
    # A fixed-format VHD carries "conectix" only in its 512-byte footer.
    if [[ "$(LC_ALL=C tail -c 512 "$f" 2>/dev/null | head -c 8 | od -An -tx1 | tr -d ' \n')" == 636f6e6563746978 ]]; then
        echo "vhd"; return
    fi
    echo ""
}

# Format implied by the extension, for the fallback path. "vmdk-extent" flags a
# VMDK raw extent and "ewf-cont" an EWF continuation segment — neither is ever
# processed on its own.
ext_format() {              # name -> ewf1|ewf-cont|vmdk|vmdk-extent|vhd|vhdx|aff|raw|""
    local n; n="$(basename "$1" | tr '[:upper:]' '[:lower:]')"
    case "$n" in
        *-flat.vmdk|*-delta.vmdk|*-s[0-9]*.vmdk) echo "vmdk-extent" ;;
        *.e01)            echo "ewf1" ;;
        *.e[0-9][0-9])    echo "ewf-cont" ;;
        *.vmdk)           echo "vmdk" ;;
        *.vhd)            echo "vhd" ;;
        *.vhdx)           echo "vhdx" ;;
        *.aff)            echo "aff" ;;
        *.raw|*.img|*.dd) echo "raw" ;;
        *)                echo "" ;;
    esac
}

# Function to pick the correct .vmdk descriptor for a VMware VM folder.
# A VM export typically contains:
#   <NAME>.vmdk              -> base disk descriptor (small text file)
#   <NAME>-flat.vmdk         -> base disk raw data (referenced by descriptor)
#   <NAME>-sNNN.vmdk         -> split-extent raw data shards (NOT a descriptor)
#   <NAME>-NNNNNN.vmdk       -> snapshot descriptor (chains back to base)
#   <NAME>-NNNNNN-delta.vmdk -> snapshot raw data (referenced by snap descriptor)
# We must give psteal the descriptor file (a small text file, NOT raw data).
# When snapshots exist, the highest-numbered snapshot descriptor represents the
# current state of the VM and should be processed.
#
# Returns:
#   stdout: absolute path of the chosen descriptor on success
#   rc=0: success
#   rc=1: no descriptor candidate found
#   rc=2: ambiguous - multiple base descriptor candidates with no snapshot
is_vmdk_descriptor() {
    # A real VMDK descriptor is a small text file whose first line is
    # "# Disk DescriptorFile". The -flat / -delta / -sNNN raw extents are
    # binary and will not match.
    # 64 bytes is comfortably more than the 21-byte header signature and
    # avoids reading huge files (extents are often many GB) into the pipe.
    local f="$1"
    LC_ALL=C head -c 64 -- "$f" 2>/dev/null | grep -q '^# Disk DescriptorFile'
}

get_vm_descriptor() {
    local vm_dir="$1"
    local f name
    local -a snapshot_candidates=()
    local -a base_candidates=()

    while IFS= read -r f; do
        name=$(basename "$f")
        # Skip well-known raw-data file naming patterns up front so we don't
        # waste a head/grep on huge binaries.
        [[ "$name" =~ -flat\.vmdk$ ]]      && continue
        [[ "$name" =~ -delta\.vmdk$ ]]     && continue
        [[ "$name" =~ -s[0-9]+\.vmdk$ ]]   && continue   # split-extent shards
        # Validate by content: only real text descriptors qualify.
        is_vmdk_descriptor "$f" || continue

        if [[ "$name" =~ -[0-9]{6}\.vmdk$ ]]; then
            snapshot_candidates+=("$f")
        else
            base_candidates+=("$f")
        fi
    done < <(find "$vm_dir" -maxdepth 1 -type f -iname '*.vmdk' 2>/dev/null | sort)

    # Snapshot descriptor (latest) wins if present - it chains back to the base.
    if (( ${#snapshot_candidates[@]} > 0 )); then
        printf '%s\n' "${snapshot_candidates[@]}" | sort | tail -n 1
        return 0
    fi

    if (( ${#base_candidates[@]} == 1 )); then
        echo "${base_candidates[0]}"
        return 0
    elif (( ${#base_candidates[@]} > 1 )); then
        echo "ERROR: $vm_dir contains multiple base .vmdk descriptors; cannot pick one automatically:" >&2
        printf '  %s\n' "${base_candidates[@]}" >&2
        return 2
    fi

    return 1
}

# Collect processable images from the input directory TREE. Users drop their own
# evidence into data_store/raw/disk_images/, and the sample collector sources
# data into per-corpus subfolders beneath it, so we discover images at any depth
# dynamically — no subfolder names are hardcoded. Content-first: each regular
# file is identified by magic bytes (extension as fallback), so a misnamed or
# extension-less image is still found and a raw shard/segment that must not be
# processed alone is still skipped.
PROCESSED_FILES=()
while IFS= read -r -d '' file; do
    rel="${file#"$INPUT_DIR"/}"     # path relative to the input dir, for messages

    efmt="$(ext_format "$file")"
    # VMDK raw extents are never standalone images, whatever their content says.
    if [[ "$efmt" == "vmdk-extent" ]]; then
        echo "Skipping VMDK extent (needs its descriptor): $rel"
        continue
    fi

    cfmt="$(detect_format "$file")"
    if [[ -n "$cfmt" ]]; then
        fmt="$cfmt"
        # Normalise the EWF family before comparing, so .E01 vs 'ewf1' etc. do
        # not read as a disagreement.
        enorm="$efmt"; [[ "$enorm" == ewf-cont ]] && enorm="ewf1"
        cnorm="$cfmt"; [[ "$cnorm" == ewf2 || "$cnorm" == ewf-cont ]] && cnorm="ewf1"
        if [[ -n "$efmt" && "$enorm" != "$cnorm" ]]; then
            echo "⚠️  $rel: extension implies '$efmt' but content is '$cfmt' — trusting content"
        fi
        src="content"
    else
        fmt="$efmt"            # fallback: extension (covers raw/img/dd/aff)
        src="extension"
    fi

    case "$fmt" in
        ewf-cont)
            echo "Skipping EWF continuation segment: $rel" ;;
        ""|vmdk-extent)
            : ;;               # unidentified non-image (README, sidecar, junk)
        *)
            PROCESSED_FILES+=("$file")
            echo "Will process: $rel  [$fmt, by $src]" ;;
    esac
done < <(find "$INPUT_DIR" -type f -print0 | sort -z)

# Stable order, and de-dup in case a name resolved twice.
if [[ ${#PROCESSED_FILES[@]} -gt 0 ]]; then
    IFS=$'\n' PROCESSED_FILES=($(printf '%s\n' "${PROCESSED_FILES[@]}" | sort -u)); unset IFS
fi

# Warn (but don't exit) if there are no flat disk image files; we may still
# have VMware VM exports to process below.
if [[ ${#PROCESSED_FILES[@]} -eq 0 ]]; then
    echo "Notice: No supported forensic image files found in $INPUT_DIR"
    echo "Supported formats: E01 (+E02… segments), raw, img, dd, vmdk, vhd, vhdx, aff (case-insensitive)"
else
    echo ""
    echo "Found ${#PROCESSED_FILES[@]} file(s) to process"
    echo ""
fi

# Loop through each forensic image file
for INPUT_FILE in "${PROCESSED_FILES[@]}"; do
    # Path relative to the input dir: it locates the file inside the mounted
    # tree AND is the basis for a unique, provenance-preserving output name.
    REL="${INPUT_FILE#"$INPUT_DIR"/}"
    FILENAME=$(get_clean_filename "$REL")

    echo "Processing: $REL"
    echo "Output name: $FILENAME"

    # Mount the whole input tree so a multi-segment set or a VMDK descriptor's
    # sibling extents resolve, and point Plaso at the file by its relative path.
    run_plaso "$INPUT_DIR" "$REL" "$FILENAME" || continue
    echo ""
done

################################################################################
# VMware VM export processing
#
# Each VM lives in its own sub-folder of $VM_INPUT_DIR and contains many files
# (.vmx, .vmsd, .nvram, *.vmdk descriptor, *-flat.vmdk, snapshot *-NNNNNN.vmdk,
# *-NNNNNN-delta.vmdk, etc.). The whole folder must be mounted into the Plaso
# container so the descriptor can resolve its referenced flat / delta files.
################################################################################
echo ""
echo "Checking for VMware VM exports in: $VM_INPUT_DIR"

VM_DIRS=()
if [[ -d "$VM_INPUT_DIR" ]]; then
    for vm_dir in "$VM_INPUT_DIR"/*/; do
        [[ -d "$vm_dir" ]] && VM_DIRS+=("${vm_dir%/}")
    done
fi

VM_PROCESSED_COUNT=0
if [[ ${#VM_DIRS[@]} -eq 0 ]]; then
    echo "Notice: No VMware VM export folders found in $VM_INPUT_DIR"
else
    echo "Found ${#VM_DIRS[@]} VM folder(s) to inspect"
    echo ""

    for VM_DIR in "${VM_DIRS[@]}"; do
        VM_NAME=$(basename "$VM_DIR")
        DESCRIPTOR=$(get_vm_descriptor "$VM_DIR")
        DESC_RC=$?

        if [[ $DESC_RC -eq 2 ]]; then
            echo "⚠️  Skipping VM '$VM_NAME': ambiguous .vmdk descriptors (see ERROR above)"
            continue
        fi
        if [[ $DESC_RC -ne 0 || -z "$DESCRIPTOR" ]]; then
            echo "⚠️  Skipping VM '$VM_NAME': no usable .vmdk descriptor found (only -flat/-delta/-sNNN extents, or no '# Disk DescriptorFile' header)"
            continue
        fi

        DESCRIPTOR_NAME=$(basename "$DESCRIPTOR")
        # Use the VM folder name as the output base name so multiple VMs don't
        # collide on output files.
        FILENAME="$VM_NAME"

        echo "Processing VM: $VM_NAME"
        echo "  Descriptor : $DESCRIPTOR_NAME"
        echo "  Output name: $FILENAME"

        # Mount the VM folder as /data so the descriptor's relative references to
        # -flat / -delta files resolve inside the container.
        run_plaso "$VM_DIR" "$DESCRIPTOR_NAME" "$FILENAME" || continue
        echo ""
        VM_PROCESSED_COUNT=$((VM_PROCESSED_COUNT + 1))
    done
fi

# If we found nothing at all in either input source, exit with an error.
if [[ ${#PROCESSED_FILES[@]} -eq 0 && $VM_PROCESSED_COUNT -eq 0 ]]; then
    echo "Error: No forensic disk images or VMware VM exports were processed."
    echo "  - Place E01/raw/img/dd/vmdk/vhd/vhdx/aff files in: $INPUT_DIR"
    echo "  - Place VMware VM folders in:                      $VM_INPUT_DIR/<VM_NAME>/"
    exit 1
fi

echo "🎉 Processing complete. Processed ${#PROCESSED_FILES[@]} forensic image file(s) and ${VM_PROCESSED_COUNT} VMware VM export(s)."