#!/bin/bash
# Ensure correct filepath assigned when referenced
SCRIPT_DIR="$(dirname "$(readlink -f "$0")")" # Resolves full path
REPO_ROOT_DIR="$(realpath "$SCRIPT_DIR/../..")"

# Set the input directory containing PCAP files
INPUT_DIR="$(realpath "$REPO_ROOT_DIR/data_store/raw/pcaps")"
OUTPUT_DIR="$(realpath "$REPO_ROOT_DIR/data_store/processed/zeek")"

# Ensure output directory exists
mkdir -p "$OUTPUT_DIR"

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
echo "Zeek Network Traffic Analysis"
echo ""
echo "Repository Root: $REPO_ROOT_DIR"
echo "Input Directory: $INPUT_DIR"
echo "Output Directory: $OUTPUT_DIR"
echo ""

# Debugging Output (Check Paths)
echo "📂 Input Directory: $INPUT_DIR"
echo "📂 Output Directory: $OUTPUT_DIR"
echo ""

# Check if PCAP files exist
shopt -s nullglob nocaseglob
pcap_files=("$INPUT_DIR"/*.pcap "$INPUT_DIR"/*.pcapng)
if [ ${#pcap_files[@]} -eq 0 ]; then
  echo "⚠️ No PCAP files found in $INPUT_DIR. Exiting."
  exit 1
fi

echo "Checking for PCAP files in: $INPUT_DIR"
ls -lh "$INPUT_DIR" | awk '{print $5 "\t" $9}' | tail -n +2
echo ""
# Process each PCAP file
for pcap_file in "${pcap_files[@]}"; do
  # Extract filename without extension
  pcap_basename=$(basename "$pcap_file" .pcap)
  pcap_basename=$(basename "$pcap_basename" .pcapng) # Handle .pcapng too
  
  # Create a temporary directory for initial Zeek output
  temp_dir=$(mktemp -d)
  # Define final Zeek output directory for this PCAP
  ZEEK_OUTPUT_DIR="$OUTPUT_DIR/$pcap_basename"
  mkdir -p "$ZEEK_OUTPUT_DIR"
  
  echo "🚀 Processing: $pcap_basename"
  # Run Zeek container to generate logs in temporary directory
  docker run --name "zeek_$pcap_basename" \
    -v "$INPUT_DIR":/pcap:ro \
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
      docker run --rm -i -v "$temp_dir":/logs zeek/zeek bash -c "cat /logs/$log_filename | zeek-cut -C -U \"%Y-%m-%dT%H:%M:%S%z\"" > "$ZEEK_OUTPUT_DIR/$log_filename"
      echo "   ✓ Converted timestamps in $log_filename"
    fi
  done
  
  # Clean up temporary directory
  rm -rf "$temp_dir"
  
  # Clean up container
  docker rm -f "zeek_$pcap_basename" > /dev/null 2>&1
  
  echo "💾 Logs saved in: $ZEEK_OUTPUT_DIR"
done

echo "✅ All PCAPs processed with ISO8601 timestamps."
echo ""
echo "Output directories:"
echo "  - Zeek logs: $OUTPUT_DIR/"