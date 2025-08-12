#!/bin/bash

# Batch processing script for SuperMem - automatically processes ALL memory dumps
# This script finds and processes all memory dump files without needing -f parameter

# Ensure correct filepath assigned when referenced
SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"
REPO_ROOT_DIR="$(realpath "$SCRIPT_DIR/..")"

# Set the input directory containing memory dump files
INPUT_DIR="$REPO_ROOT_DIR/data_store/raw/memory"

# Set the host output directory
HOST_OUTPUT_DIR="$REPO_ROOT_DIR/data_store/processed/supermem"

# Set optional yara rules directory
YARA_DIR="$REPO_ROOT_DIR/data_store/yara_rules"

# Default triage type (1=Quick, 2=Full, 3=Comprehensive)
TRIAGE_TYPE=2

################################################################################
echo ""
echo "███████╗██╗   ██╗██████╗ ███████╗██████╗ ███╗   ███╗███████╗███╗   ███╗"
sleep 0.1
echo "██╔════╝██║   ██║██╔══██╗██╔════╝██╔══██╗████╗ ████║██╔════╝████╗ ████║"
sleep 0.1
echo "███████╗██║   ██║██████╔╝█████╗  ██████╔╝██╔████╔██║█████╗  ██╔████╔██║"
sleep 0.1
echo "╚════██║██║   ██║██╔═══╝ ██╔══╝  ██╔══██╗██║╚██╔╝██║██╔══╝  ██║╚██╔╝██║"
sleep 0.1
echo "███████║╚██████╔╝██║     ███████╗██║  ██║██║ ╚═╝ ██║███████╗██║ ╚═╝ ██║"
sleep 0.1
echo "╚══════╝ ╚═════╝ ╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝╚═╝     ╚═╝"
echo ""
echo "Batch Windows Memory Analysis with SuperMem"
echo ""

echo "Repository root: $REPO_ROOT_DIR"
echo "Input directory: $INPUT_DIR"
echo "Output directory: $HOST_OUTPUT_DIR"
echo "Triage type: $TRIAGE_TYPE"
echo ""

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -tt|--triage-type)
            TRIAGE_TYPE="$2"
            shift 2
            ;;
        -i|--input)
            INPUT_DIR="$2"
            shift 2
            ;;
        -o|--output)
            HOST_OUTPUT_DIR="$2"
            shift 2
            ;;
        -y|--yara)
            YARA_DIR="$2"
            shift 2
            ;;
        -h|--help)
            echo "SuperMem Batch Processing Script"
            echo ""
            echo "This script automatically finds and processes ALL memory dump files"
            echo "No -f parameter needed - it discovers files automatically"
            echo ""
            echo "Options:"
            echo "  -tt, --triage-type  Triage type: 1=Quick, 2=Full, 3=Comprehensive (default: 2)"
            echo "  -i, --input         Input directory containing memory dumps"
            echo "  -o, --output        Output directory for results"
            echo "  -y, --yara          Yara rules directory (optional)"
            echo "  -h, --help          Show this help message"
            echo ""
            echo "Examples:"
            echo "  ./process-supermem-batch.sh                    # Process all files with defaults"
            echo "  ./process-supermem-batch.sh -tt 3              # Comprehensive analysis on all files"
            echo "  ./process-supermem-batch.sh -tt 1 -y /yara     # Quick with custom yara on all files"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use -h or --help for usage information"
            exit 1
            ;;
    esac
done

# Validate triage type
if [[ ! "$TRIAGE_TYPE" =~ ^[1-3]$ ]]; then
    echo "Error: Triage type must be 1, 2, or 3"
    exit 1
fi

# Ensure the host output directories exist
mkdir -p "$HOST_OUTPUT_DIR"
mkdir -p "$HOST_OUTPUT_DIR/logs"
# Fix permissions so the current user can write to these directories
chmod -R 777 "$HOST_OUTPUT_DIR" 2>/dev/null || true

# Change ownership and permissions for input directory
if [[ -d "$INPUT_DIR" ]]; then
    chmod -R 755 "$INPUT_DIR" 2>/dev/null || true
else
    echo "Error: Input directory $INPUT_DIR does not exist"
    exit 1
fi

# Enable case-insensitive globbing
shopt -s nocaseglob
shopt -s nullglob

# Debug: List available files before processing
echo "Checking for memory dump files in: $INPUT_DIR"
ls -lh "$INPUT_DIR"

# Function to extract clean filename for output
get_clean_filename() {
    local filepath="$1"
    local filename=$(basename "$filepath")
    
    # Remove common memory dump extensions
    if [[ "$filename" =~ \.(mem|dmp|raw|dump|vmem|bin|MEM|DMP|RAW|DUMP|VMEM|BIN)$ ]]; then
        echo "${filename%.*}"  # Remove only the last extension
    else
        # Default case - just return the filename without any extension
        echo "${filename%.*}"
    fi
}

# Function to check if file is a memory dump
is_memory_dump() {
    local filepath="$1"
    local filename=$(basename "$filepath")
    
    # Check for common memory dump extensions (case-insensitive)
    if [[ "$filename" =~ \.(mem|dmp|raw|dump|vmem|bin|MEM|DMP|RAW|DUMP|VMEM|BIN)$ ]]; then
        return 0  # True - it's a memory dump
    else
        return 1  # False - not a recognized memory dump
    fi
}

# Collect all memory dump files with supported extensions (case-insensitive)
MEMORY_FILES=()
for pattern in "*.[Mm][Ee][Mm]" "*.[Dd][Mm][Pp]" "*.[Rr][Aa][Ww]" "*.[Dd][Uu][Mm][Pp]" "*.[Vv][Mm][Ee][Mm]" "*.[Bb][Ii][Nn]"; do
    for file in "$INPUT_DIR"/$pattern; do
        if [[ -f "$file" ]]; then
            MEMORY_FILES+=("$file")
        fi
    done
done

# Remove duplicates and sort
IFS=$'\n' MEMORY_FILES=($(printf '%s\n' "${MEMORY_FILES[@]}" | sort -u))

# Filter to only process valid memory dumps
PROCESSED_FILES=()
for file in "${MEMORY_FILES[@]}"; do
    if is_memory_dump "$file"; then
        PROCESSED_FILES+=("$file")
        echo "Will process: $(basename "$file")"
    else
        echo "Skipping non-memory dump: $(basename "$file")"
    fi
done

# Ensure there are files to process
if [[ ${#PROCESSED_FILES[@]} -eq 0 ]]; then
    echo "Error: No supported memory dump files found in $INPUT_DIR"
    echo "Supported formats: .mem, .dmp, .raw, .dump, .vmem, .bin (case-insensitive)"
    exit 1
fi

echo ""
echo "Found ${#PROCESSED_FILES[@]} memory dump file(s) to process"
echo "Triage type: $TRIAGE_TYPE ($(case $TRIAGE_TYPE in 1) echo "Quick";; 2) echo "Full";; 3) echo "Comprehensive";; esac))"
echo ""

# Build docker command arguments
YARA_MOUNT=""
YARA_ARG=""

# Check if yara directory exists and has files
if [[ -d "$YARA_DIR" && -n "$(ls -A "$YARA_DIR" 2>/dev/null)" ]]; then
    YARA_MOUNT="-v $YARA_DIR:/data/yara:ro"
    YARA_ARG="-y /data/yara"
    echo "Using Yara rules from: $YARA_DIR"
    ls -la "$YARA_DIR"/*.yar 2>/dev/null | head -5
    echo ""
elif [[ -n "$YARA_ARG" ]]; then
    echo "Warning: Yara directory $YARA_DIR is empty or doesn't exist. Proceeding without Yara rules."
    echo ""
fi

# Check if SuperMem image exists
if ! docker image inspect supermem-image >/dev/null 2>&1; then
    echo "Error: SuperMem Docker image 'supermem-image' not found."
    echo "Please build the image first using: docker build -t supermem-image ."
    exit 1
fi

# Loop through each memory dump file
for INPUT_FILE in "${PROCESSED_FILES[@]}"; do
    # Extract clean filename for output
    FILENAME=$(get_clean_filename "$INPUT_FILE")
    
    echo "=========================================="
    echo "Processing: $(basename "$INPUT_FILE")"
    echo "Output name: $FILENAME"
    echo "File size: $(du -h "$INPUT_FILE" | cut -f1)"
    echo "Start time: $(date)"
    echo "=========================================="

    # Create individual output directory for this file
    INDIVIDUAL_OUTPUT="$HOST_OUTPUT_DIR/$FILENAME"
    mkdir -p "$INDIVIDUAL_OUTPUT"
    
    # Run SuperMem inside the container for each file
    echo "Running SuperMem analysis..."
    docker run --rm \
        --name "supermem-$(echo "$FILENAME" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g')" \
        -v "$INPUT_DIR":/data/input:ro \
        -v "$INDIVIDUAL_OUTPUT":/data/output \
        $YARA_MOUNT \
        supermem-image \
        -f /data/input/"$(basename "$INPUT_FILE")" \
        -o /data/output \
        -tt $TRIAGE_TYPE \
        $YARA_ARG \
        2>&1 | tee "$HOST_OUTPUT_DIR/logs/$FILENAME.log"

    # Check if analysis completed successfully
    if [[ ${PIPESTATUS[0]} -eq 0 ]]; then
        echo ""
        echo "✅ SuperMem analysis completed successfully for $FILENAME"
        
        # List key output files
        echo "📁 Output directory: $INDIVIDUAL_OUTPUT"
        if [[ -f "$INDIVIDUAL_OUTPUT/Logging.log" ]]; then
            echo "📋 SuperMem log: $INDIVIDUAL_OUTPUT/Logging.log"
        fi
        if [[ -f "$INDIVIDUAL_OUTPUT/IOCs.csv" ]]; then
            echo "🚨 IOCs found: $INDIVIDUAL_OUTPUT/IOCs.csv"
            IOC_COUNT=$(tail -n +2 "$INDIVIDUAL_OUTPUT/IOCs.csv" 2>/dev/null | wc -l)
            echo "   Total IOCs: $IOC_COUNT"
        fi
        
        # Show directory contents
        echo "📊 Analysis results:"
        ls -la "$INDIVIDUAL_OUTPUT" | grep -E "(^total|^d)" | head -10
        
    else
        echo ""
        echo "❌ SuperMem analysis failed for $FILENAME"
        echo "Check logs at: $HOST_OUTPUT_DIR/logs/$FILENAME.log"
    fi
    
    echo "End time: $(date)"
    echo "Script log: $HOST_OUTPUT_DIR/logs/$FILENAME.log"
    echo ""
done

echo "🎉 Processing complete. Processed ${#PROCESSED_FILES[@]} memory dump file(s)."
echo ""
echo "📁 All results saved to: $HOST_OUTPUT_DIR/"
echo "📋 All logs saved to: $HOST_OUTPUT_DIR/logs/"

# Generate summary report
SUMMARY_FILE="$HOST_OUTPUT_DIR/processing_summary.txt"
echo "SuperMem Batch Processing Summary" > "$SUMMARY_FILE"
echo "Generated: $(date)" >> "$SUMMARY_FILE"
echo "Triage Type: $TRIAGE_TYPE" >> "$SUMMARY_FILE"
echo "Files Processed: ${#PROCESSED_FILES[@]}" >> "$SUMMARY_FILE"
echo "" >> "$SUMMARY_FILE"

for INPUT_FILE in "${PROCESSED_FILES[@]}"; do
    FILENAME=$(get_clean_filename "$INPUT_FILE")
    echo "File: $(basename "$INPUT_FILE")" >> "$SUMMARY_FILE"
    echo "  Output: $HOST_OUTPUT_DIR/$FILENAME" >> "$SUMMARY_FILE"
    echo "  Log: $HOST_OUTPUT_DIR/logs/$FILENAME.log" >> "$SUMMARY_FILE"
    
    # Check for IOCs
    if [[ -f "$HOST_OUTPUT_DIR/$FILENAME/IOCs.csv" ]]; then
        IOC_COUNT=$(tail -n +2 "$HOST_OUTPUT_DIR/$FILENAME/IOCs.csv" 2>/dev/null | wc -l)
        echo "  IOCs: $IOC_COUNT" >> "$SUMMARY_FILE"
    fi
    echo "" >> "$SUMMARY_FILE"
done

echo "📊 Summary report saved to: $SUMMARY_FILE"