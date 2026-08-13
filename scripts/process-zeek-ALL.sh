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
shopt -s nullglob

# Is this file a packet capture? Content-first (magic bytes), extension as a
# fallback — so a misnamed or extension-less capture is still found. Covers
# classic pcap (µs and ns, both byte orders) and pcapng.
is_pcap() { # file -> 0 if it looks like a capture
    local h
    h="$(LC_ALL=C dd if="$1" bs=1 count=4 2>/dev/null | od -An -tx1 | tr -d ' \n')"
    case "$h" in
        a1b2c3d4|d4c3b2a1|a1b23c4d|4d3cb2a1|0a0d0d0a) return 0 ;;
    esac
    case "$(printf '%s' "$1" | tr '[:upper:]' '[:lower:]')" in
        *.pcap|*.pcapng|*.cap) return 0 ;;
    esac
    return 1
}

# Output-folder name derived from the path RELATIVE to the pcap dir, so two
# captures that share a basename in different subfolders keep distinct output.
clean_name() { # relpath -> provenance name
    local rel="$1"
    rel="${rel//\//_}"; rel="${rel// /_}"
    [[ "$rel" == *.* ]] && rel="${rel%.*}_${rel##*.}"
    echo "$rel"
}

# Discover captures anywhere under the pcap tree. Users drop their own data into
# data_store/raw/pcaps/ and the sample collector sources into per-corpus
# subfolders, so we recurse dynamically — no layout is hardcoded.
pcap_files=()
while IFS= read -r -d '' f; do
    is_pcap "$f" && pcap_files+=("$f")
done < <(find "$PCAP_DIR" -type f -print0 | sort -z)

if [ ${#pcap_files[@]} -eq 0 ]; then
  echo "⚠️ No PCAP files found under $PCAP_DIR. Exiting."
  exit 1
fi

# Process each capture: one output folder per capture, holding its Zeek logs.
for pcap_file in "${pcap_files[@]}"; do
  rel="${pcap_file#"$PCAP_DIR"/}"          # path inside the mounted /pcap tree
  name="$(clean_name "$rel")"              # unique, provenance-preserving

  # Temporary directory for Zeek's raw output, then convert into the final dir.
  temp_dir=$(mktemp -d)
  output_dir="$ZEEK_LOGS_DIR/$name"
  mkdir -p "$output_dir"

  echo "🚀 Processing: $rel"
  # Zeek writes JSON directly (LogAscii::use_json=T) with ISO-8601 timestamps
  # (json_timestamps=JSON::TS_ISO8601) — typed values, produced entirely inside
  # the container with no post-processing. Mount the whole pcap tree so nested
  # captures resolve, and read the file by rel path.
  docker run --rm \
    -v "$PCAP_DIR":/pcap:ro \
    -v "$temp_dir":/logs \
    zeek/zeek sh -c "cd /logs && zeek -C -r '/pcap/$rel' LogAscii::use_json=T 'LogAscii::json_timestamps=JSON::TS_ISO8601'"
  echo "✅ Finished processing: $rel"

  # Zeek keeps the .log extension even for JSON content; move each into the
  # output folder as .json so the format is obvious on disk.
  for log_file in "$temp_dir"/*.log; do
    [ -f "$log_file" ] || continue
    base="$(basename "$log_file")"                  # e.g. conn.log
    mv "$log_file" "$output_dir/${base%.log}.json"  # -> conn.json
    echo "   ✓ ${base} -> ${base%.log}.json"
  done

  rm -rf "$temp_dir"
  echo "💾 JSON logs saved in: $output_dir"
done
echo "✅ All PCAPs processed with ISO8601 timestamps."