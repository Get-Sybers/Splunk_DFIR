#!/bin/bash
set -euo pipefail

# Ensure correct filepath assigned when referenced
SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"  # Resolves full path
REPO_ROOT_DIR="$(realpath "$SCRIPT_DIR/..")"

# Set the input directory containing E01 files
INPUT_DIR="$REPO_ROOT_DIR/data_store/raw/disk_images"

# Set the host output directory for logs (HEC sends directly to Splunk)
HOST_OUTPUT_DIR="$REPO_ROOT_DIR/data_store/processed/log2timeline"

# Set the log2timeline plugin directory 
PLUGIN_DIR="$REPO_ROOT_DIR/data_store/dependencies/log2timeline"

# Set the Splunk configuration file path
SPLUNK_SERVER_CONF="$REPO_ROOT_DIR/splunk/etc/system/local/server.conf"

# Function to parse Splunk server.conf
parse_splunk_config() {
    if [[ ! -f "$SPLUNK_SERVER_CONF" ]]; then
        echo "📋 server.conf not found at: $SPLUNK_SERVER_CONF"
        echo "   Using default HEC settings"
        return 1
    fi
    
    echo "📋 Reading Splunk configuration from: $SPLUNK_SERVER_CONF"
    
    # Parse HEC settings from server.conf
    local hec_port=$(awk -F'=' '/^\[http_input\]/,/^\[/ {if(/^port\s*=/) print $2}' "$SPLUNK_SERVER_CONF" | tr -d ' ')
    local hec_ssl=$(awk -F'=' '/^\[http_input\]/,/^\[/ {if(/^enableSSL\s*=/) print $2}' "$SPLUNK_SERVER_CONF" | tr -d ' ')
    local hec_disabled=$(awk -F'=' '/^\[http_input\]/,/^\[/ {if(/^disabled\s*=/) print $2}' "$SPLUNK_SERVER_CONF" | tr -d ' ')
    
    # Also check for token in server.conf (though tokens are usually in inputs.conf)
    local hec_token=$(awk -F'=' '/^\[http_input\]/,/^\[/ {if(/^token\s*=/) print $2}' "$SPLUNK_SERVER_CONF" | tr -d ' ')
    
    # Set values from config file
    if [[ -n "$hec_port" ]]; then
        SPLUNK_PORT="$hec_port"
    fi
    
    if [[ -n "$hec_token" ]]; then
        SPLUNK_TOKEN="$hec_token"
    fi
    
    # Determine SSL setting
    if [[ "$hec_ssl" == "true" ]]; then
        USE_SSL="true"
    elif [[ "$hec_ssl" == "false" ]]; then
        USE_SSL="false"
    fi
    
    # Check if HEC is disabled
    if [[ "$hec_disabled" == "true" ]]; then
        echo "⚠️  Warning: HEC appears to be disabled in server.conf (disabled = true)"
        echo "   You may need to enable it in Splunk before proceeding"
    fi
    
    return 0
}

# Function to parse inputs.conf for HEC tokens
parse_inputs_conf() {
    local inputs_conf="$REPO_ROOT_DIR/splunk/etc/system/local/inputs.conf"
    
    if [[ -f "$inputs_conf" ]]; then
        echo "📋 Checking inputs.conf for HEC token: $inputs_conf"
        
        # Debug: Show the HEC section we're trying to parse
        echo "🔍 HEC section found:"
        grep -A10 "\[http://" "$inputs_conf" | head -15
        
        # Look for HEC token - simplified approach
        local hec_token=$(awk '
            /^\[http:\/\/.*\]/ { in_http=1; next }
            /^\[.*\]/ && !/^\[http:\/\/.*\]/ { in_http=0; next }
            in_http && /^token/ { 
                split($0, parts, "=")
                gsub(/^[ \t]+|[ \t]+$/, "", parts[2])
                if (parts[2] != "") {
                    print parts[2]
                    exit
                }
            }
        ' "$inputs_conf")
        
        if [[ -n "$hec_token" ]]; then
            SPLUNK_TOKEN="$hec_token"
            echo "✅ Found HEC token in inputs.conf: ${hec_token:0:8}..."
            return 0
        else
            echo "⚠️  No token found in [http://...] sections of inputs.conf"
            echo "🔍 Debug: Trying manual extraction..."
            # Fallback: simple grep approach
            hec_token=$(grep -A5 "\[http://" "$inputs_conf" | grep "^token" | cut -d'=' -f2 | tr -d ' ' | head -1)
            if [[ -n "$hec_token" ]]; then
                SPLUNK_TOKEN="$hec_token"
                echo "✅ Found HEC token via fallback method: ${hec_token:0:8}..."
                return 0
            fi
        fi
    fi
    
    return 1
}

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
echo "╚██████╔╝███████╗   ██║      ███████║   ██║   ██████╔╝███████╗██║  ██║███████╗"
sleep 0.1
echo "╚═════╝ ╚══════╝   ╚═╝      ╚══════╝   ╚═╝   ╚═════╝ ╚══════╝╚═╝  ╚═╝╚══════╝"
echo ""

echo "$REPO_ROOT_DIR"
echo ""

# Splunk HEC Configuration - Start with environment variables or defaults
SPLUNK_SERVER="${SPLUNK_SERVER:-localhost}"
SPLUNK_TOKEN="${SPLUNK_TOKEN:-}"  # Start empty, will be populated from config files
SPLUNK_INDEX="${SPLUNK_INDEX:-host}"
SPLUNK_PORT="${SPLUNK_PORT:-8088}"
USE_SSL="${USE_SSL:-true}"

# Parse Splunk configuration files
CONFIG_FOUND=false
if parse_splunk_config; then
    CONFIG_FOUND=true
fi

# Try to find token in inputs.conf if not found in server.conf
if [[ -z "$SPLUNK_TOKEN" ]] && parse_inputs_conf; then
    CONFIG_FOUND=true
fi

# If still no token found, use the default
if [[ -z "$SPLUNK_TOKEN" ]]; then
    SPLUNK_TOKEN="your-hec-token-here"
    echo "⚠️  No HEC token found in config files, using default: your-hec-token-here"
fi

# Display configuration and validate
echo "🔧 Splunk HEC Configuration:"
echo "   Server: $SPLUNK_SERVER:$SPLUNK_PORT $(if [[ "$CONFIG_FOUND" == "true" ]]; then echo "(from config files)"; else echo "(default)"; fi)"
echo "   Index: $SPLUNK_INDEX"
echo "   SSL: $USE_SSL $(if [[ "$CONFIG_FOUND" == "true" ]]; then echo "(from config files)"; else echo "(default)"; fi)"

# Show token source
if [[ -n "$SPLUNK_TOKEN" ]]; then
    if [[ "$SPLUNK_TOKEN" == "your-hec-token-here" ]]; then
        echo "   Token: ${SPLUNK_TOKEN} (default - not found in config files)"
    else
        echo "   Token: ${SPLUNK_TOKEN:0:8}... (from Splunk config files)"
    fi
else
    echo "❌ Error: No HEC token available"
    echo "   Please configure HEC in Splunk or set SPLUNK_TOKEN environment variable"
    exit 1
fi
echo ""

# Ensure the host output directories exist
sudo mkdir -p "$HOST_OUTPUT_DIR/logs"
sudo mkdir -p "$HOST_OUTPUT_DIR/plaso"
sudo mkdir -p "$PLUGIN_DIR"
# Fix permissions so the current user can write to these directories
sudo chmod -R 777 "$HOST_OUTPUT_DIR"
sudo chmod -R 777 "$PLUGIN_DIR"

# Change ownership and permissions
sudo chmod -R 777 "$INPUT_DIR"

# Check if Splunk plugins exist
if [[ ! -f "$PLUGIN_DIR/splunk.py" ]] || [[ ! -f "$PLUGIN_DIR/shared_splunk.py" ]]; then
    echo "❌ Error: Splunk HEC plugins not found in $PLUGIN_DIR"
    echo "Please ensure the following files exist:"
    echo "   - $PLUGIN_DIR/splunk.py"
    echo "   - $PLUGIN_DIR/shared_splunk.py"
    exit 1
fi

echo "✅ Found Splunk HEC plugins in $PLUGIN_DIR"

# Enable case-insensitive globbing
shopt -s nocaseglob
shopt -s nullglob

# Debug: List available files before processing
echo "Checking for forensic image files in: $INPUT_DIR"
ls -lh "$INPUT_DIR"

# Function to extract clean filename for output
get_clean_filename() {
    local filepath="$1"
    local filename=$(basename "$filepath")
    
    # For E0x files, remove only the E0x extension
    if [[ "$filename" =~ \.[Ee][0-9][0-9]$ ]]; then
        echo "${filename%.*}"  # Remove only the last extension
    # For other supported formats
    elif [[ "$filename" =~ \.(raw|img|dd|vmdk|RAW|IMG|DD|VMDK|Raw|Img|Dd|Vmdk)$ ]]; then
        echo "${filename%.*}"  # Remove only the last extension
    # Handle .txt or other metadata files that might be alongside the forensic images
    elif [[ "$filename" =~ \.[Ee][0-9][0-9]\.[a-zA-Z]+$ ]]; then
        echo "${filename%.*.*}"  # Remove the last two extensions (.E01.txt → remove both)
    else
        # Default case - just return the filename without any extension
        echo "${filename%.*}"
    fi
}

# Function to check if file is first in multi-volume set
is_first_volume() {
    local filepath="$1"
    local filename=$(basename "$filepath")
    
    # Check if it's an E01 file (first in series) or single volume format
    if [[ "$filename" =~ \.[Ee]01$ ]]; then
        return 0  # True - it's E01 (first volume)
    elif [[ "$filename" =~ \.(raw|img|dd|vmdk|RAW|IMG|DD|VMDK|Raw|Img|Dd|Vmdk)$ ]]; then
        return 0  # True - single volume formats (case-insensitive)
    else
        return 1  # False - it's E02, E03, etc.
    fi
}

# Function to test HEC connectivity
test_hec_connection() {
    echo "🔍 Testing Splunk HEC connectivity..."
    
    local protocol="https"
    if [[ "$USE_SSL" == "false" ]]; then
        protocol="http"
    fi
    
    # Correct HEC event format
    local test_event='{"event":"log2timeline HEC test","sourcetype":"l2t:hec","index":"host"}'
    
    if command -v curl &> /dev/null; then
        local curl_opts="-k"  # Always ignore SSL certificate issues
        
        # Try both /services/collector/event and /services/collector endpoints
        local endpoints=("/services/collector/event" "/services/collector")
        
        for endpoint in "${endpoints[@]}"; do
            echo "🔗 Testing HEC endpoint: $protocol://$SPLUNK_SERVER:$SPLUNK_PORT$endpoint"
            
            local response
            response=$(curl -s $curl_opts -w "HTTPSTATUS:%{http_code}" \
                -H "Authorization: Splunk $SPLUNK_TOKEN" \
                -H "Content-Type: application/json" \
                -d "$test_event" \
                "$protocol://$SPLUNK_SERVER:$SPLUNK_PORT$endpoint" 2>/dev/null)
            
            local http_code=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
            local response_body=$(echo "$response" | sed -e 's/HTTPSTATUS:.*//')
            
            if [[ "$http_code" == "200" ]]; then
                echo "✅ HEC connection successful via $endpoint"
                if [[ -n "$response_body" ]]; then
                    echo "Response: $response_body"
                fi
                # Update the HEC URL for the plugin to use the working endpoint
                HEC_ENDPOINT="$endpoint"
                return 0
            else
                echo "❌ HEC connection failed for $endpoint (HTTP $http_code)"
                if [[ -n "$response_body" ]]; then
                    echo "Response: $response_body"
                fi
            fi
        done
        
        # Try alternative protocol if HTTPS failed on both endpoints
        if [[ "$protocol" == "https" ]]; then
            echo "🔄 Trying HTTP (non-SSL) with /services/collector/event..."
            response=$(curl -s -w "HTTPSTATUS:%{http_code}" \
                -H "Authorization: Splunk $SPLUNK_TOKEN" \
                -H "Content-Type: application/json" \
                -d "$test_event" \
                "http://$SPLUNK_SERVER:$SPLUNK_PORT/services/collector/event" 2>/dev/null)
            
            http_code=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
            response_body=$(echo "$response" | sed -e 's/HTTPSTATUS:.*//')
            
            if [[ "$http_code" == "200" ]]; then
                echo "✅ HEC connection successful via HTTP /services/collector/event"
                echo "Response: $response_body"
                USE_SSL="false"
                HEC_ENDPOINT="/services/collector/event"
                return 0
            else
                echo "❌ HTTP connection also failed (HTTP $http_code)"
                if [[ -n "$response_body" ]]; then
                    echo "Response: $response_body"
                fi
            fi
        fi
        
        return 1
    else
        echo "⚠️  curl not available, skipping connectivity test"
        return 0
    fi
}

# Test HEC connection before processing
if ! test_hec_connection; then
    echo "❌ HEC connectivity test failed. Please check your configuration."
    exit 1
fi

# Collect all forensic image files with supported extensions (case-insensitive)
FORENSIC_FILES=()
for pattern in "*.[Ee]01" "*.[Rr][Aa][Ww]" "*.[Ii][Mm][Gg]" "*.[Dd][Dd]" "*.[Vv][Mm][Dd][Kk]" "*.[Ee][0-9][0-9]"; do
    for file in "$INPUT_DIR"/$pattern; do
        if [[ -f "$file" ]]; then
            FORENSIC_FILES+=("$file")
        fi
    done
done

# Remove duplicates and sort
IFS=$'\n' FORENSIC_FILES=($(printf '%s\n' "${FORENSIC_FILES[@]}" | sort -u))

# Filter to only process first volumes of multi-part sets
PROCESSED_FILES=()
for file in "${FORENSIC_FILES[@]}"; do
    if is_first_volume "$file"; then
        PROCESSED_FILES+=("$file")
        echo "Will process: $(basename "$file")"
    else
        echo "Skipping multi-volume part: $(basename "$file")"
    fi
done

# Ensure there are files to process
if [[ ${#PROCESSED_FILES[@]} -eq 0 ]]; then
    echo "Error: No supported forensic image files found in $INPUT_DIR"
    echo "Supported formats: E01, raw, img, dd, vmdk (case-insensitive)"
    exit 1
fi

echo ""
echo "Found ${#PROCESSED_FILES[@]} file(s) to process"
echo ""

# Loop through each forensic image file
for INPUT_FILE in "${PROCESSED_FILES[@]}"; do
    # Extract clean filename for output
    FILENAME=$(get_clean_filename "$INPUT_FILE")
    
    echo "Processing: $(basename "$INPUT_FILE")"
    echo "Output target: Splunk HEC ($SPLUNK_SERVER:$SPLUNK_PORT)"
    echo "Host identifier: $FILENAME"

    # Prepare SSL option
    SSL_OPTION=""
    if [[ "$USE_SSL" == "false" ]]; then
        SSL_OPTION="--no-ssl"
    fi

    # Run log2timeline + psort inside the Plaso container with HEC output for each file
    echo "🔄 Stage 1: Extracting timeline data from $(basename "$INPUT_FILE")..."
    docker run --rm \
    -v "$INPUT_DIR":/data:ro \
    -v "$HOST_OUTPUT_DIR":/output \
    log2timeline/plaso \
    log2timeline.py \
        --storage_file /output/plaso/$FILENAME.plaso \
        --timezone UTC \
        --vss-stores all \
        --partitions all \
        /data/$(basename "$INPUT_FILE") 2>&1 | tee "$HOST_OUTPUT_DIR/logs/$FILENAME-extraction.log"

    # Check if plaso file was created
    if [[ ! -f "$HOST_OUTPUT_DIR/plaso/$FILENAME.plaso" ]]; then
        echo "❌ Error: log2timeline failed to create plaso storage file for $FILENAME" | tee -a "$HOST_OUTPUT_DIR/logs/$FILENAME-extraction.log"
        echo "📋 Check extraction log: $HOST_OUTPUT_DIR/logs/$FILENAME-extraction.log"
        continue
    fi

    echo "✅ Timeline extraction complete for $FILENAME ($(du -h "$HOST_OUTPUT_DIR/plaso/$FILENAME.plaso" | cut -f1))"
    echo "🔄 Stage 2: Sending data to Splunk HEC..."

    # Then run psort with Splunk HEC output
    if ! docker run --rm \
    -v "$HOST_OUTPUT_DIR":/output \
    -v "$PLUGIN_DIR":/plaso_plugins:ro \
    -e PYTHONPATH="/plaso_plugins:/usr/lib/python3/dist-packages" \
    log2timeline/plaso \
    psort.py -o splunk \
        --server "$SPLUNK_SERVER" \
        --port "$SPLUNK_PORT" \
        --token "$SPLUNK_TOKEN" \
        --index "$SPLUNK_INDEX" \
        --sourcetype 'l2t:hec' \
        --source 'log2timeline' \
        --host "$FILENAME" \
        $SSL_OPTION \
        /output/plaso/$FILENAME.plaso 2>&1 | tee "$HOST_OUTPUT_DIR/logs/$FILENAME-hec.log"
    then
    echo "❌ Error: Failed to send data to Splunk HEC for $FILENAME" | tee -a "$HOST_OUTPUT_DIR/logs/$FILENAME-hec.log"
    continue
    fi

    # Check exit status
    if [[ $? -eq 0 ]]; then
        echo "✅ Successfully sent data to Splunk HEC for $FILENAME" | tee -a "$HOST_OUTPUT_DIR/logs/$FILENAME-hec.log"
    else
        echo "❌ Error: Failed to send data to Splunk HEC for $FILENAME" | tee -a "$HOST_OUTPUT_DIR/logs/$FILENAME-hec.log"
    fi

    echo "📋 Extraction logs: $HOST_OUTPUT_DIR/logs/$FILENAME-extraction.log"
    echo "📋 HEC logs: $HOST_OUTPUT_DIR/logs/$FILENAME-hec.log"
    echo ""
done

echo "🎉 Processing complete. Processed ${#PROCESSED_FILES[@]} forensic image file(s) via Splunk HEC."
echo ""
echo "📊 Data should now be available in Splunk:"
echo "   Index: $SPLUNK_INDEX"
echo "   Sourcetype: l2t:hec"
echo "   Search example: index=$SPLUNK_INDEX sourcetype=l2t:hec"