#!/bin/bash

# Ensure correct filepath assigned when referenced
SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"  # Resolves full path
REPO_ROOT_DIR="$(realpath "$SCRIPT_DIR/..")"

# Set the input directory containing E01 files
INPUT_DIR="$REPO_ROOT_DIR/data_store/raw/disk_images"

# Set the host output directory
HOST_OUTPUT_DIR="$REPO_ROOT_DIR/data_store/processed/log2timeline"
# LIBVMDK_DIR="$REPO_ROOT_DIR/data_store/dependencies/libvmdk"

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

# Change ownership and permissions
# Fix permissions so the current user can write to these directories
echo "⚙️ Setting permissions of Splunk_DFIR/splunk/etc/* to $(whoami):docker and 777"
sudo chown -R $(whoami):docker "$HOST_OUTPUT_DIR/*"
sudo chmod -R 777 "$HOST_OUTPUT_DIR/*"
sudo chown -R $(whoami):docker "$INPUT_DIR/*"
sudo chmod -R 777 "$INPUT_DIR/*"

# Ensure the host output directories exist
sudo mkdir -p "$HOST_OUTPUT_DIR/csv"
sudo mkdir -p "$HOST_OUTPUT_DIR/jsonl"
sudo mkdir -p "$HOST_OUTPUT_DIR/logs"
sudo chmod -R 777 "$HOST_OUTPUT_DIR"

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

# Collect all forensic image files with supported extensions (case-insensitive)
# Only collect first volumes and single-file formats to avoid duplicates
FORENSIC_FILES=()
for pattern in "*.[Ee]01" "*.[Rr][Aa][Ww]" "*.[Ii][Mm][Gg]" "*.[Dd][Dd]" "*.[Vv][Mm][Dd][Kk]"; do
    for file in "$INPUT_DIR"/$pattern; do
        if [[ -f "$file" ]]; then
            FORENSIC_FILES+=("$file")
        fi
    done
done

# Remove duplicates and sort
IFS=$'\n' FORENSIC_FILES=($(printf '%s\n' "${FORENSIC_FILES[@]}" | sort -u))

# All collected files should be processable now
PROCESSED_FILES=()
for file in "${FORENSIC_FILES[@]}"; do
    PROCESSED_FILES+=("$file")
    echo "Will process: $(basename "$file")"
done

# Ensure there are files to process
if [[ ${#PROCESSED_FILES[@]} -eq 0 ]]; then
    echo "Error: No supported forensic image files found in $INPUT_DIR"
    echo "Supported formats: E01, raw, img, dd, vmdk (case-insensitive)"
    exit 1
fi

echo ""
echo "Found ${#PROCESSED_FILES[@]} file(s) to process"
echo ""

# Loop through each forensic image file
for INPUT_FILE in "${PROCESSED_FILES[@]}"; do
    # Extract clean filename for output
    FILENAME=$(get_clean_filename "$INPUT_FILE")
    
    echo "Processing: $(basename "$INPUT_FILE")"
    echo "Output name: $FILENAME"

    # Run psteal inside the Plaso container for each file to generate CSV
    echo "Step 1: Generating CSV timeline..."
    docker run --rm -v "$INPUT_DIR":/data:ro \
    -v "$HOST_OUTPUT_DIR":/output log2timeline/plaso \
    psteal --source /data/"$(basename "$INPUT_FILE")" \
    --output-format dynamic \
    --fields date,datetime,description,description_short,display_name,filename,host,hostname,inode,macb,message,message_short,source,sourcetype,source_long,tag,time,timestamp_desc,timezone,type,user,username,zone \
    --timezone UTC \
    --vss-stores all \
    --partitions all \
    --quiet \
    -w /output/csv/"$FILENAME".csv 2> "$HOST_OUTPUT_DIR/logs/$FILENAME.log"

    # Check if csv output was created
    if [[ ! -f "$HOST_OUTPUT_DIR/csv/$FILENAME.csv" ]]; then
        echo "❌ Error: psteal failed to produce csv output for $FILENAME" | tee -a "$HOST_OUTPUT_DIR/logs/$FILENAME.log"
        continue
    fi

    # Run psort to convert CSV to JSONL format
    echo "Step 2: Converting CSV to JSONL..."
    docker run --rm -v "$HOST_OUTPUT_DIR/csv":/data:ro \
    -v "$HOST_OUTPUT_DIR":/output log2timeline/plaso \
    psort --source /data/"$FILENAME.csv" \
    --output-format json_line \
    --timezone UTC \
    -w /output/jsonl/"$FILENAME".jsonl 2>> "$HOST_OUTPUT_DIR/logs/$FILENAME.log"

    # Check if jsonl output was created
    if [[ ! -f "$HOST_OUTPUT_DIR/jsonl/$FILENAME.jsonl" ]]; then
        echo "❌ Error: psort failed to produce jsonl output for $FILENAME" | tee -a "$HOST_OUTPUT_DIR/logs/$FILENAME.log"
        continue
    fi

    echo "✅ Saved CSV output to: $HOST_OUTPUT_DIR/csv/$FILENAME.csv" | tee -a "$HOST_OUTPUT_DIR/logs/$FILENAME.log"
    echo "✅ Saved JSONL output to: $HOST_OUTPUT_DIR/jsonl/$FILENAME.jsonl" | tee -a "$HOST_OUTPUT_DIR/logs/$FILENAME.log"
    echo "📋 Saved logs to: $HOST_OUTPUT_DIR/logs/$FILENAME.log" | tee -a "$HOST_OUTPUT_DIR/logs/$FILENAME.log"
    echo ""
done

echo "🎉 Processing complete. Processed ${#PROCESSED_FILES[@]} forensic image file(s)."