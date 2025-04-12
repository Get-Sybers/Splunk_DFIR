#!/bin/bash
set -e

# Resolve script and repository root directories
SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"
REPO_ROOT_DIR="$(realpath "$SCRIPT_DIR/..")"

# Define host raw data directories
RAW_DISK_IMAGES_DIR="$REPO_ROOT_DIR/data_store/raw/disk_images"
RAW_PCAPS_DIR="$REPO_ROOT_DIR/data_store/raw/pcaps"

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

# Check that the host raw directories exist
if [ ! -d "$RAW_DISK_IMAGES_DIR" ]; then
    echo "Error: Directory '$RAW_DISK_IMAGES_DIR' does not exist."
    exit 1
fi

if [ ! -d "$RAW_PCAPS_DIR" ]; then
    echo "Error: Directory '$RAW_PCAPS_DIR' does not exist."
    exit 1
fi

echo ""
echo "Files in disk_images directory on host:"
find "$RAW_DISK_IMAGES_DIR" -type f -iname "*.e01" | sort

echo ""
echo "Files in pcaps directory on host:"
find "$RAW_PCAPS_DIR" -type f \( -iname "*.pcap" -o -iname "*.pcapng" \) | sort

echo ""
# Check if directories contain files other than .gitkeep
E01_COUNT=$(find "$RAW_DISK_IMAGES_DIR" -type f -iname "*.e01" | wc -l)
PCAP_COUNT=$(find "$RAW_PCAPS_DIR" -type f \( -iname "*.pcap" -o -iname "*.pcapng" \) | wc -l)

if [ "$E01_COUNT" -eq 0 ]; then
    echo "Warning: No .E01 files found in '$RAW_DISK_IMAGES_DIR'."
fi

if [ "$PCAP_COUNT" -eq 0 ]; then
    echo "Warning: No .pcap or .pcapng files found in '$RAW_PCAPS_DIR'."
fi

echo ""
echo "Creating Docker volumes..."

# Create Docker volumes for raw and processed data
if ! docker volume create raw_data >/dev/null; then
    echo "Error: Failed to create 'raw_data' volume."
    exit 1
fi

if ! docker volume create process_data >/dev/null; then
    echo "Error: Failed to create 'process_data' volume."
    docker volume rm raw_data
    exit 1
fi

# Create splunk_data volume
if ! docker volume create splunk_data >/dev/null; then
    echo "Error: Failed to create 'splunk_data' volume."
    docker volume rm raw_data
    docker volume rm process_data
    exit 1
fi

echo "Docker volumes 'raw_data', 'process_data', and 'splunk_data' created."

echo ""
echo "Setting up volume directory structure..."

# Create consistent directory structure in raw_data volume
docker run --rm -v raw_data:/raw alpine sh -c 'mkdir -p /raw/disk_images /raw/pcaps'

# Create directory structure in process_data volume
docker run --rm -v process_data:/processed alpine sh -c 'mkdir -p /processed/log2timeline/csv /processed/log2timeline/logs /processed/zeek'

# Create initial directory structure in splunk_data volume
docker run --rm -v splunk_data:/data alpine sh -c 'mkdir -p /data/etc /data/var /data/ansible'

echo "Directory structure created in volumes."

echo ""
echo "Copying raw data from host into the raw_data volume..."
echo ""

# Create a temporary container for copying E01 files
echo "Copying E01 files:"
# Create temporary container
temp_container_e01=$(docker create -v raw_data:/raw alpine:latest /bin/true)

# Copy each E01 file
for e01_file in $(find "$RAW_DISK_IMAGES_DIR" -type f -iname "*.e01"); do
    filename=$(basename "$e01_file")
    echo "Copying $filename..."
    docker cp "$e01_file" $temp_container_e01:/raw/disk_images/
done

# Check if any files were copied by running a command in a new container
docker rm $temp_container_e01

# Count files in volume
e01_count=$(docker run --rm -v raw_data:/raw alpine sh -c 'find /raw/disk_images -type f -iname "*.e01" | wc -l')
if [ "$e01_count" -gt 0 ]; then
    echo "Successfully copied $e01_count disk image(s)."
else
    echo "No disk images were copied."
fi

echo ""
# Create a temporary container for copying PCAP files
echo "Copying PCAP files:"
temp_container_pcap=$(docker create -v raw_data:/raw alpine:latest /bin/true)

# Copy each PCAP file
for pcap_file in $(find "$RAW_PCAPS_DIR" -type f \( -iname "*.pcap" -o -iname "*.pcapng" \)); do
    filename=$(basename "$pcap_file")
    echo "Copying $filename..."
    docker cp "$pcap_file" $temp_container_pcap:/raw/pcaps/
done

# Remove temporary container
docker rm $temp_container_pcap

# Count files in volume
pcap_count=$(docker run --rm -v raw_data:/raw alpine sh -c 'find /raw/pcaps -type f \( -iname "*.pcap" -o -iname "*.pcapng" \) | wc -l')
if [ "$pcap_count" -gt 0 ]; then
    echo "Successfully copied $pcap_count PCAP file(s)."
else
    echo "No PCAP files were copied."
fi

echo ""
echo "Verifying data was copied correctly..."
echo ""
docker run --rm -v raw_data:/raw alpine sh -c '
    echo "Disk Images in raw_data volume:"
    find /raw/disk_images -type f -iname "*.e01" -exec ls -la {} \;
    
    echo ""
    echo "PCAP Files in raw_data volume:"
    find /raw/pcaps -type f \( -iname "*.pcap" -o -iname "*.pcapng" \) -exec ls -la {} \;'

echo ""
echo "Raw data has been copied into the 'raw_data' volume."
echo "Setup complete."