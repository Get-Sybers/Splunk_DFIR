#!/bin/bash

# Ensure correct filepath assigned when referenced
SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"  # Resolves full path
REPO_ROOT_DIR="$(realpath "$SCRIPT_DIR/..")"

# Set the input directory containing E01 files
INPUT_DIR="$REPO_ROOT_DIR/data_store/raw/disk_images"

# Set the host output directory
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

# Ensure the host output directories exist
mkdir -p "$HOST_OUTPUT_DIR/csv"
mkdir -p "$HOST_OUTPUT_DIR/logs"

# Change ownership and permissions
chmod -R 777 "$INPUT_DIR"

# Enable case-insensitive globbing
shopt -s nocaseglob
shopt -s nullglob

# Debug: List available E01 files before processing
echo "Checking for E01 files in: $INPUT_DIR"
ls -lh "$INPUT_DIR"

# Find E01 files with case-insensitive matching
E01_FILES=("$INPUT_DIR"/*.[Ee]01)

# Ensure there are E01 files to process
if [[ ${#E01_FILES[@]} -eq 0 ]]; then
    echo "Error: No E01 files found in $INPUT_DIR"
    exit 1
fi

# Loop through each E01 file in the directory
for INPUT_FILE in "${E01_FILES[@]}"; do
    # Extract filename without extension
    FILENAME=$(basename "$INPUT_FILE" | cut -d. -f1)

    echo "Processing: $INPUT_FILE"

    # Run psteal inside the Plaso container for each file
    docker run --rm -v "$INPUT_DIR":/data:ro -v "$HOST_OUTPUT_DIR":/output log2timeline/plaso \
    psteal --source /data/"$(basename "$INPUT_FILE")" \
    --output-format dynamic \
    --fields date,datetime,description,description_short,display_name,filename,host,hostname,inode,macb,message,message_short,source,sourcetype,source_long,tag,time,timestamp_desc,timezone,type,user,username,zone \
    --timezone UTC \
    --partitions all \
    -w /output/csv/"$FILENAME".csv 2> "$HOST_OUTPUT_DIR/logs/$FILENAME".log

    # Check if csv output was created
    if [[ ! -f "$HOST_OUTPUT_DIR/csv/$FILENAME.csv" ]]; then
        echo "Error: psteal failed to produce csv output for $FILENAME" | tee -a "$HOST_OUTPUT_DIR/logs/$FILENAME.log"
        continue
    fi

    echo "Saved csv output to: $HOST_OUTPUT_DIR/csv/$FILENAME.csv" | tee -a "$HOST_OUTPUT_DIR/logs/$FILENAME.log"
    echo "Saved logs to: $HOST_OUTPUT_DIR/logs/$FILENAME.log" | tee -a "$HOST_OUTPUT_DIR/logs/$FILENAME.log"

done

echo "Processing complete."
