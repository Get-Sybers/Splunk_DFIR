#!/bin/bash
# Ensure correct filepath assigned when referenced
SCRIPT_DIR="$(dirname "$(readlink -f "$0")")" # Resolves full path
REPO_ROOT_DIR="$(realpath "$SCRIPT_DIR/..")"
# Define input and output directories dynamically
PCAP_DIR="$(realpath "$SCRIPT_DIR/../data_store/raw/pcaps")"
ZEEK_LOGS_DIR="$(realpath "$SCRIPT_DIR/../data_store/processed/zeek")"
# Ensure output directory exists
mkdir -p "$ZEEK_LOGS_DIR"

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

# Debugging Output (Check Paths)
echo "📂 PCAP Directory: $PCAP_DIR"
echo "📂 Zeek Logs Directory: $ZEEK_LOGS_DIR"
# Check if PCAP files exist
shopt -s nullglob nocaseglob
pcap_files=("$PCAP_DIR"/*.pcap "$PCAP_DIR"/*.pcapng)
if [ ${#pcap_files[@]} -eq 0 ]; then
  echo "⚠️ No PCAP files found in $PCAP_DIR. Exiting."
  exit 1
fi
# Process each PCAP file
for pcap_file in "${pcap_files[@]}"; do
  # Extract filename without extension
  pcap_basename=$(basename "$pcap_file" .pcap)
  pcap_basename=$(basename "$pcap_basename" .pcapng) # Handle .pcapng too
  
  # Create a temporary directory for initial Zeek output
  temp_dir=$(mktemp -d)
  # Define final Zeek output directory for this PCAP
  output_dir="$ZEEK_LOGS_DIR/$pcap_basename"
  mkdir -p "$output_dir"
  
  echo "🚀 Processing: $pcap_basename"
  # Run Zeek container to generate logs in temporary directory
  docker run --name "zeek_$pcap_basename" \
    -v "$PCAP_DIR":/pcap:ro \
    -v "$temp_dir":/logs \
    zeek/zeek sh -c \
    "cd /logs && zeek -C -r /pcap/$(basename "$pcap_file")"
  echo "✅ Finished processing: $pcap_basename"
  
  # Process log files with zeek-cut to convert timestamps to ISO8601
  echo "🕒 Converting timestamps to ISO8601 format..."
  for log_file in "$temp_dir"/*.log; do
    if [ -f "$log_file" ]; then
      # Get just the filename
      log_filename=$(basename "$log_file")
      # Process with zeek-cut and write directly to final destination
      docker run --rm -i -v "$temp_dir":/logs zeek/zeek bash -c "cat /logs/$log_filename | zeek-cut -C -U \"%Y-%m-%dT%H:%M:%S%z\"" > "$output_dir/$log_filename"
      echo "   ✓ Converted timestamps in $log_filename"
    fi
  done
  
  # Clean up temporary directory
  rm -rf "$temp_dir"
  
  # Clean up container
  docker rm -f "zeek_$pcap_basename" > /dev/null 2>&1
  
  echo "💾 Logs saved in: $output_dir"
done
echo "✅ All PCAPs processed with ISO8601 timestamps."