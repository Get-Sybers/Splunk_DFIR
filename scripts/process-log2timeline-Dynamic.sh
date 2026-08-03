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

# Ensure the host output directories exist and set permissions
sudo mkdir -p "$HOST_OUTPUT_DIR"/{csv,jsonl,logs}
sudo mkdir -p "$INPUT_DIR" "$VM_INPUT_DIR"
sudo chown -R "$(whoami):docker" "$HOST_OUTPUT_DIR" "$INPUT_DIR"
sudo chmod -R 777 "$HOST_OUTPUT_DIR" "$INPUT_DIR"
# NOTE: Do NOT recursively chown/chmod $VM_INPUT_DIR. VM exports can contain
# multi-GB .vmdk/-flat.vmdk files; recursing would be very slow and would
# mutate ownership/permission metadata of raw evidence. The VM folder is
# bind-mounted into the Plaso container read-only, so it only needs to be
# readable. Just make sure the top-level directory itself is traversable.
sudo chmod a+rx "$VM_INPUT_DIR" 2>/dev/null || true

# Enable case-insensitive globbing
shopt -s nocaseglob
shopt -s nullglob

# Debug: List available files before processing
echo "Checking for forensic image files in: $INPUT_DIR"
ls -lh "$INPUT_DIR"

# Function to extract clean filename for output
get_clean_filename() {
    local filepath="$1"
    local filename=$(basename "$filepath")
    
    # For E0x files, remove only the E0x extension
    if [[ "$filename" =~ \.[Ee][0-9][0-9]$ ]]; then
        echo "${filename%.*}"  # Remove only the last extension
    # For other supported formats
    elif [[ "$filename" =~ \.(raw|img|dd|vmdk|RAW|IMG|DD|VMDK|Raw|Img|Dd|Vmdk)$ ]]; then
        echo "${filename%.*}"  # Remove only the last extension
    # Handle .txt or other metadata files that might be alongside the forensic images
    elif [[ "$filename" =~ \.[Ee][0-9][0-9]\.[a-zA-Z]+$ ]]; then
        echo "${filename%.*.*}"  # Remove the last two extensions (.E01.txt → remove both)
    else
        # Default case - just return the filename without any extension
        echo "${filename%.*}"
    fi
}

# Function to check if file is first in multi-volume set
is_first_volume() {
    local filepath="$1"
    local filename=$(basename "$filepath")
    
    # Check if it's an E01 file (first in series) or single volume format
    if [[ "$filename" =~ \.[Ee]01$ ]]; then
        return 0  # True - it's E01 (first volume)
    elif [[ "$filename" =~ \.(raw|img|dd|vmdk|RAW|IMG|DD|VMDK|Raw|Img|Dd|Vmdk)$ ]]; then
        return 0  # True - single volume formats (case-insensitive)
    else
        return 1  # False - it's E02, E03, etc.
    fi
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

# Collect all forensic image files with supported extensions (case-insensitive)
FORENSIC_FILES=()
for pattern in "*.[Ee]01" "*.[Rr][Aa][Ww]" "*.[Ii][Mm][Gg]" "*.[Dd][Dd]" "*.[Vv][Mm][Dd][Kk]" "*.[Ee][0-9][0-9]"; do
    for file in "$INPUT_DIR"/$pattern; do
        if [[ -f "$file" ]]; then
            FORENSIC_FILES+=("$file")
        fi
    done
done

# Remove duplicates and sort
IFS=$'\n' FORENSIC_FILES=($(printf '%s\n' "${FORENSIC_FILES[@]}" | sort -u))

# Filter to only process first volumes of multi-part sets
PROCESSED_FILES=()
for file in "${FORENSIC_FILES[@]}"; do
    if is_first_volume "$file"; then
        PROCESSED_FILES+=("$file")
        echo "Will process: $(basename "$file")"
    else
        echo "Skipping multi-volume part: $(basename "$file")"
    fi
done

# Warn (but don't exit) if there are no flat disk image files; we may still
# have VMware VM exports to process below.
if [[ ${#PROCESSED_FILES[@]} -eq 0 ]]; then
    echo "Notice: No supported forensic image files found in $INPUT_DIR"
    echo "Supported formats: E01, raw, img, dd, vmdk (case-insensitive)"
else
    echo ""
    echo "Found ${#PROCESSED_FILES[@]} file(s) to process"
    echo ""
fi

# Loop through each forensic image file
for INPUT_FILE in "${PROCESSED_FILES[@]}"; do
    # Extract clean filename for output
    FILENAME=$(get_clean_filename "$INPUT_FILE")
    
    echo "Processing: $(basename "$INPUT_FILE")"
    echo "Output name: $FILENAME"

    # Run psteal inside the Plaso container for each file
    docker run --rm -v "$INPUT_DIR":/data:ro \
    -v "$HOST_OUTPUT_DIR":/output log2timeline/plaso \
    psteal --source /data/"$(basename "$INPUT_FILE")" \
    --output-format dynamic \
    --fields date,datetime,description,description_short,display_name,filename,host,hostname,inode,macb,message,message_short,source,sourcetype,source_long,tag,time,timestamp_desc,timezone,type,user,username,zone \
    --timezone UTC \
    --vss-stores all \
    --partitions all \
    --quiet \
    -w /output/csv/"$FILENAME".csv 2> "$HOST_OUTPUT_DIR/logs/$FILENAME".log

    # Check if csv output was created
    if [[ ! -f "$HOST_OUTPUT_DIR/csv/$FILENAME.csv" ]]; then
        echo "Error: psteal failed to produce csv output for $FILENAME" | tee -a "$HOST_OUTPUT_DIR/logs/$FILENAME.log"
        continue
    fi

    echo "✅ Saved csv output to: $HOST_OUTPUT_DIR/csv/$FILENAME.csv" | tee -a "$HOST_OUTPUT_DIR/logs/$FILENAME.log"
    echo "📋 Saved logs to: $HOST_OUTPUT_DIR/logs/$FILENAME.log" | tee -a "$HOST_OUTPUT_DIR/logs/$FILENAME.log"
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

        # Mount the VM folder as /data so descriptor's relative references to
        # -flat / -delta files resolve inside the container.
        docker run --rm -v "$VM_DIR":/data:ro \
        -v "$HOST_OUTPUT_DIR":/output log2timeline/plaso \
        psteal --source /data/"$DESCRIPTOR_NAME" \
        --output-format dynamic \
        --fields date,datetime,description,description_short,display_name,filename,host,hostname,inode,macb,message,message_short,source,sourcetype,source_long,tag,time,timestamp_desc,timezone,type,user,username,zone \
        --timezone UTC \
        --vss-stores all \
        --partitions all \
        --quiet \
        -w /output/csv/"$FILENAME".csv 2> "$HOST_OUTPUT_DIR/logs/$FILENAME".log

        if [[ ! -f "$HOST_OUTPUT_DIR/csv/$FILENAME.csv" ]]; then
            echo "Error: psteal failed to produce csv output for VM $FILENAME" | tee -a "$HOST_OUTPUT_DIR/logs/$FILENAME.log"
            continue
        fi

        echo "✅ Saved csv output to: $HOST_OUTPUT_DIR/csv/$FILENAME.csv" | tee -a "$HOST_OUTPUT_DIR/logs/$FILENAME.log"
        echo "📋 Saved logs to: $HOST_OUTPUT_DIR/logs/$FILENAME.log" | tee -a "$HOST_OUTPUT_DIR/logs/$FILENAME.log"
        echo ""
        VM_PROCESSED_COUNT=$((VM_PROCESSED_COUNT + 1))
    done
fi

# If we found nothing at all in either input source, exit with an error.
if [[ ${#PROCESSED_FILES[@]} -eq 0 && $VM_PROCESSED_COUNT -eq 0 ]]; then
    echo "Error: No forensic disk images or VMware VM exports were processed."
    echo "  - Place E01/raw/img/dd/vmdk files in: $INPUT_DIR"
    echo "  - Place VMware VM folders in:        $VM_INPUT_DIR/<VM_NAME>/"
    exit 1
fi

echo "🎉 Processing complete. Processed ${#PROCESSED_FILES[@]} forensic image file(s) and ${VM_PROCESSED_COUNT} VMware VM export(s)."