#!/bin/bash

# Ensure correct filepath assigned when referenced
SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"  # Resolves full path

# Define input and output directories dynamically
PCAP_DIR="$(realpath "$SCRIPT_DIR/../data_store/raw/pcaps")"
ZEEK_LOGS_DIR="$(realpath "$SCRIPT_DIR/../data_store/processed/zeek")"

# Ensure output directory exists
mkdir -p "$ZEEK_LOGS_DIR"

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

    # Define Zeek output directory for this PCAP
    output_dir="$ZEEK_LOGS_DIR/$pcap_basename"
    mkdir -p "$output_dir"

    echo "🚀 Processing: $pcap_basename"

    # Run Zeek container **in the foreground** to stream logs in real-time
    docker run --name "zeek_$pcap_basename" \
        -v "$PCAP_DIR":/pcap:ro \
        -v "$output_dir":/logs \
        zeek/zeek sh -c \
        "cd /logs && zeek -C -r /pcap/$(basename "$pcap_file") LogAscii::use_json=T"

    echo "✅ Finished processing: $pcap_basename → Logs saved in: $output_dir"

    # Clean up container (since --rm was removed)
    docker rm -f "zeek_$pcap_basename" > /dev/null 2>&1
done

echo "✅ All PCAPs processed."