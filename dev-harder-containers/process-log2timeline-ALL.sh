#!/bin/bash

# Ensure correct filepath assigned when referenced
SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"  # Resolves full path
REPO_ROOT_DIR="$(realpath "$SCRIPT_DIR/..")"

# Enable case-insensitive globbing
shopt -s nocaseglob
shopt -s nullglob

# List E01 files in the raw_data volume
echo "Checking for E01 files in raw_data volume..."
docker run --rm -v raw_data:/raw alpine sh -c "ls -lh /raw/disk_images"

# Get a list of E01 files from the volume
E01_FILES=($(docker run --rm -v raw_data:/raw alpine sh -c "find /raw/disk_images -type f -iname '*.e01' | sort"))

# Ensure there are E01 files to process
if [[ ${#E01_FILES[@]} -eq 0 ]]; then
    echo "Error: No E01 files found in raw_data volume"
    exit 1
fi

# Create directory structure in process_data volume if it doesn't exist
docker run --rm -v process_data:/processed alpine sh -c 'mkdir -p /processed/log2timeline/csv /processed/log2timeline/logs'

# Create a temporary directory on the host for logs
TEMP_LOG_DIR=$(mktemp -d)
echo "Created temporary log directory: $TEMP_LOG_DIR"

# Loop through each E01 file in the volume
for INPUT_FILE in "${E01_FILES[@]}"; do
    # Extract filename without path and extension
    FILENAME=$(basename "$INPUT_FILE" | cut -d. -f1)
    
    # Map the path from the raw volume to the data path in plaso container
    # E01 files are in /raw/disk_images/ but need to be accessed at /data/disk_images/ in plaso
    PLASO_INPUT_PATH="/data${INPUT_FILE#/raw}"
    
    echo "Processing: $INPUT_FILE"

    # Run psteal inside the Plaso container for each file
    docker run --rm \
    -v raw_data:/data:ro \
    -v process_data:/processed \
    log2timeline/plaso \
    psteal --source "$PLASO_INPUT_PATH" \
    --output-format dynamic \
    --fields date,datetime,description,description_short,display_name,filename,host,hostname,inode,macb,message,message_short,source,sourcetype,source_long,tag,time,timestamp_desc,timezone,type,user,username,zone \
    --timezone UTC \
    --partitions all \
    -w /processed/log2timeline/csv/"$FILENAME".csv > "$TEMP_LOG_DIR/$FILENAME.log" 2>&1
    
    # Copy the log file to the process_data volume
    temp_container=$(docker create -v process_data:/processed alpine:latest /bin/true)
    docker cp "$TEMP_LOG_DIR/$FILENAME.log" $temp_container:/processed/log2timeline/logs/
    docker rm $temp_container > /dev/null

    # Check if csv output was created
    csv_exists=$(docker run --rm -v process_data:/processed alpine sh -c "[ -f /processed/log2timeline/csv/$FILENAME.csv ] && echo 'yes' || echo 'no'")
    
    if [[ "$csv_exists" == "no" ]]; then
        echo "Error: psteal failed to produce csv output for $FILENAME" | tee -a "$TEMP_LOG_DIR/$FILENAME.log"
        # Update the log file in the volume with the error message
        temp_container=$(docker create -v process_data:/processed alpine:latest /bin/true)
        docker cp "$TEMP_LOG_DIR/$FILENAME.log" $temp_container:/processed/log2timeline/logs/
        docker rm $temp_container > /dev/null
        continue
    fi

    echo "Saved csv output to: /processed/log2timeline/csv/$FILENAME.csv" | tee -a "$TEMP_LOG_DIR/$FILENAME.log"
    echo "Saved logs to: /processed/log2timeline/logs/$FILENAME.log" | tee -a "$TEMP_LOG_DIR/$FILENAME.log"
    
    # Update the log file in the volume with the success messages
    temp_container=$(docker create -v process_data:/processed alpine:latest /bin/true)
    docker cp "$TEMP_LOG_DIR/$FILENAME.log" $temp_container:/processed/log2timeline/logs/
    docker rm $temp_container > /dev/null
done

# Clean up the temporary directory
rm -rf "$TEMP_LOG_DIR"

echo "Processing complete."