#!/bin/bash
set -e

# Default values
INPUT_FILE=""
OUTPUT_DIR="/data/output"
TRIAGE_TYPE="1"
YARA_DIR="/data/yara"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -f|--file)
            INPUT_FILE="$2"
            shift 2
            ;;
        -o|--output)
            OUTPUT_DIR="$2"
            shift 2
            ;;
        -tt|--triage-type)
            TRIAGE_TYPE="$2"
            shift 2
            ;;
        -y|--yara)
            YARA_DIR="$2"
            shift 2
            ;;
        -h|--help)
            echo "SuperMem Docker Container Usage:"
            echo "  -f, --file          Memory dump file path (required)"
            echo "  -o, --output        Output directory (default: /data/output)"
            echo "  -tt, --triage-type  Triage type: 1=Quick, 2=Full, 3=Comprehensive (default: 1)"
            echo "  -y, --yara          Yara rules directory (default: /data/yara)"
            echo ""
            echo "Examples:"
            echo "  Quick Triage:        docker run -v /host/data:/data supermem-image -f /data/input/memdump.mem"
            echo "  Full Triage:         docker run -v /host/data:/data supermem-image -f /data/input/memdump.mem -tt 2"
            echo "  Comprehensive:       docker run -v /host/data:/data supermem-image -f /data/input/memdump.mem -tt 3"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use -h or --help for usage information"
            exit 1
            ;;
    esac
done

# Validate required parameters
if [[ -z "$INPUT_FILE" ]]; then
    echo "Error: Input file (-f) is required"
    echo "Use -h or --help for usage information"
    exit 1
fi

if [[ ! -f "$INPUT_FILE" ]]; then
    echo "Error: Input file '$INPUT_FILE' does not exist"
    exit 1
fi

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Display configuration
echo "SuperMem Analysis Starting..."
echo "Input File: $INPUT_FILE"
echo "Output Directory: $OUTPUT_DIR"
echo "Triage Type: $TRIAGE_TYPE"
echo "Yara Directory: $YARA_DIR"
echo ""

# Change to SuperMem directory and run analysis
cd /opt/SuperMem

# Build the command with optional yara directory
CMD_ARGS="-f $INPUT_FILE -o $OUTPUT_DIR -tt $TRIAGE_TYPE"
if [[ -d "$YARA_DIR" && -n "$(ls -A $YARA_DIR)" ]]; then
    CMD_ARGS="$CMD_ARGS -y $YARA_DIR"
    echo "Using Yara rules from: $YARA_DIR"
fi

echo "Running: python3 winSuperMem.py $CMD_ARGS"
echo ""

# Execute SuperMem
exec python3 winSuperMem.py $CMD_ARGS