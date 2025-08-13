#!/bin/bash
set -e

#!/bin/bash
set -e

# Enhanced vol3 detection and fixing - specifically for subprocess calls
if ! command -v vol3 &> /dev/null; then
    echo "vol3 not found, attempting to fix..."
    
    # Method 1: Check if volatility3 is installed as a Python module
    if python3 -c "import volatility3" >/dev/null 2>&1; then
        echo "Found volatility3 Python module, creating vol3 wrapper..."
        echo '#!/bin/bash' > /usr/local/bin/vol3
        echo 'python3 -m volatility3.cli "$@"' >> /usr/local/bin/vol3
        chmod +x /usr/local/bin/vol3
        
        # CRITICAL: Also create in /usr/bin for subprocess calls
        ln -sf /usr/local/bin/vol3 /usr/bin/vol3
        
    # Method 2: Look for vol.py in common locations
    elif [ -f /opt/volatility3/vol.py ]; then
        echo "Found vol.py at /opt/volatility3/vol.py, creating symlink..."
        ln -sf /opt/volatility3/vol.py /usr/local/bin/vol3
        chmod +x /usr/local/bin/vol3
        # CRITICAL: Also create in /usr/bin for subprocess calls
        ln -sf /usr/local/bin/vol3 /usr/bin/vol3
        
    elif [ -f /opt/SuperMem/vol.py ]; then
        echo "Found vol.py at /opt/SuperMem/vol.py, creating symlink..."
        ln -sf /opt/SuperMem/vol.py /usr/local/bin/vol3
        chmod +x /usr/local/bin/vol3
        # CRITICAL: Also create in /usr/bin for subprocess calls
        ln -sf /usr/local/bin/vol3 /usr/bin/vol3
        
    # Method 3: Try to install volatility3 via pip
    else
        echo "Attempting to install Volatility 3 via pip..."
        pip3 install volatility3 && {
            echo '#!/bin/bash' > /usr/local/bin/vol3
            echo 'python3 -m volatility3.cli "$@"' >> /usr/local/bin/vol3
            chmod +x /usr/local/bin/vol3
            # CRITICAL: Also create in /usr/bin for subprocess calls
            ln -sf /usr/local/bin/vol3 /usr/bin/vol3
        } || {
            echo "ERROR: Cannot locate or install Volatility 3"
            echo "Available Python packages:"
            pip3 list | grep -i vol || echo "No volatility packages found"
            echo "Searching for vol.py files:"
            find /opt -name "vol.py" 2>/dev/null || echo "No vol.py files found"
            echo "Trying to continue anyway - SuperMem might work without vol3..."
        }
    fi
fi

# Ensure vol3 is accessible from subprocess calls by fixing PATH
export PATH="/usr/local/bin:/usr/bin:$PATH"
echo "PATH for subprocess calls: $PATH"

# Test vol3 functionality with detailed diagnostics
if command -v vol3 &> /dev/null; then
    echo "vol3 found at: $(which vol3)"
    echo "vol3 accessible locations:"
    find /usr -name "vol3" 2>/dev/null || echo "vol3 not found in /usr"
    ls -la /usr/bin/vol3 2>/dev/null || echo "vol3 not in /usr/bin"
    ls -la /usr/local/bin/vol3 2>/dev/null || echo "vol3 not in /usr/local/bin"
    
    if vol3 --help > /dev/null 2>&1; then
        echo "✓ vol3 is working properly"
    else
        echo "⚠ vol3 exists but may not be working properly"
        echo "Contents of vol3 script:"
        cat $(which vol3) || echo "Cannot read vol3 script"
    fi
    
    # Test subprocess access specifically
    echo "Testing subprocess access to vol3:"
    python3 -c "
import subprocess
try:
    result = subprocess.run(['vol3', '--help'], capture_output=True, text=True, timeout=10)
    print('✓ Subprocess can call vol3 successfully')
    print(f'Return code: {result.returncode}')
except FileNotFoundError as e:
    print('✗ Subprocess cannot find vol3:', e)
except Exception as e:
    print('✗ Subprocess vol3 error:', e)
" || echo "Python subprocess test failed"
else
    echo "⚠ vol3 still not available - SuperMem may have limited functionality"
fi

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
echo "vol3 location: $(which vol3)"
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