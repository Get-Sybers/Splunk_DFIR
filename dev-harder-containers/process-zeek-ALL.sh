#!/bin/bash

# Ensure correct filepath assigned when referenced
SCRIPT_DIR="$(dirname "$(readlink -f "$0")")" # Resolves full path
REPO_ROOT_DIR="$(realpath "$SCRIPT_DIR/..")"
# Define input and output directories dynamically
PCAP_DIR="$(realpath "$SCRIPT_DIR/../data_store/raw/pcaps")"
ZEEK_LOGS_DIR="$(realpath "$SCRIPT_DIR/../data_store/processed/zeek")"
# Ensure output directory exists

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

# Debugging Output
echo "📂 Reading PCAPs from raw_data Docker volume"
echo "📂 Writing Zeek logs to process_data Docker volume"

# Check if PCAP files exist in raw_data volume
pcap_files=$(docker run --rm -v raw_data:/raw alpine sh -c "find /raw/pcaps -type f \( -iname '*.pcap' -o -iname '*.pcapng' \) | sort")

# Check if we have any PCAP files
if [ -z "$pcap_files" ]; then
  echo "⚠️ No PCAP files found in raw_data volume. Exiting."
  exit 1
fi

# Ensure zeek directory exists in process_data volume
docker run --rm -v process_data:/processed alpine sh -c "mkdir -p /processed/zeek"

# Process each PCAP file
echo "$pcap_files" | while read pcap_file; do
  # Extract filename without extension
  pcap_basename=$(basename "$pcap_file")
  pcap_basename=${pcap_basename%.*} # Remove extension
  
  # Create a temporary container name
  container_name="zeek_${pcap_basename//[^a-zA-Z0-9]/_}"
  
  echo "🚀 Processing: $pcap_basename"
  
  # Create temporary directory in container for initial processing
  docker run --rm -v process_data:/processed alpine sh -c "mkdir -p /processed/zeek/$pcap_basename"
  
  # Run Zeek container to process the PCAP
  docker run --name "$container_name" \
    -v raw_data:/raw:ro \
    -v process_data:/processed \
    zeek/zeek sh -c \
    "cd /tmp && zeek -C -r $pcap_file && \
     for log_file in *.log; do \
       cat \$log_file | zeek-cut -C -U \"%Y-%m-%dT%H:%M:%S%z\" > /processed/zeek/$pcap_basename/\$log_file; \
     done"
  
  echo "✅ Finished processing: $pcap_basename"
  
  # Clean up container
  docker rm -f "$container_name" > /dev/null 2>&1
  
  echo "💾 Logs saved in process_data volume: /processed/zeek/$pcap_basename"
done

echo "✅ All PCAPs processed with ISO8601 timestamps."