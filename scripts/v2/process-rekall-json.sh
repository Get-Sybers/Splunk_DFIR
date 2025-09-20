#!/bin/bash

# Ensure correct filepath assigned when referenced
SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"  # Resolves full path
REPO_ROOT_DIR="$(realpath "$SCRIPT_DIR/../..")"

# Set the input directory containing memory dump files
INPUT_DIR="$REPO_ROOT_DIR/data_store/raw/memory"

# Set the output directory
OUTPUT_DIR="$REPO_ROOT_DIR/data_store/processed/rekall"

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
echo "Rekall Memory Timeline Generation"
echo ""
echo "Repository Root: $REPO_ROOT_DIR"
echo "Input Directory: $INPUT_DIR"
echo "Output Directory: $OUTPUT_DIR"
echo ""

# Ensure the output directories exist and set permissions
sudo mkdir -p "$OUTPUT_DIR"/{json,logs,profiles,raw_output}
sudo chown -R "$(whoami):docker" "$OUTPUT_DIR" "$INPUT_DIR"
sudo chmod -R 777 "$OUTPUT_DIR" "$INPUT_DIR"

# Enable case-insensitive globbing
shopt -s nocaseglob
shopt -s nullglob

# Debug: List available files before processing
echo "Checking for memory dump files in: $INPUT_DIR"
ls -lh "$INPUT_DIR" | awk '{print $5 "\t" $9}' | tail -n +2

# Function to extract clean filename for output
get_clean_filename() {
    local filepath="$1"
    local filename=$(basename "$filepath")
    
    # Remove all extensions and handle multi-part names better
    echo "${filename%%.*}"
}

# Function to detect memory dump profile using imageinfo
detect_profile() {
    local memory_file="$1"
    local filename="$2"
    local profile_file="$OUTPUT_DIR/profiles/${filename}_profile.txt"
    
    echo "Detecting memory dump profile for: $filename"
    
    # Run imageinfo to detect profile with timeout and proper logging control
    timeout 120 docker run --rm -v "$INPUT_DIR":/data:ro remnux/rekall \
    bash -c "rekall -f /data/\"$(basename "$memory_file")\" --quiet --logging_level ERROR imageinfo" > "$profile_file" 2>&1
    
    local exit_code=$?
    
    # Check if the command timed out or failed
    if [[ $exit_code -eq 124 ]]; then
        echo "Warning: Profile detection timed out for $filename"
        echo "Error: Profile detection timed out after 120 seconds" > "$profile_file"
    elif [[ $exit_code -ne 0 ]]; then
        echo "Warning: Profile detection failed for $filename (exit code: $exit_code)"
        echo "Error: Profile detection failed with exit code $exit_code" > "$profile_file"
    fi
    
    # Check if the profile file was created and has content
    if [[ ! -f "$profile_file" ]] || [[ ! -s "$profile_file" ]]; then
        echo "Warning: Profile detection failed - no output file created"
        echo "Error: Profile detection failed" > "$profile_file"
    fi
    
    # Extract suggested profile from imageinfo output - support Windows, Linux, and macOS
    local suggested_profile=$(grep -E "Suggested Profile|Win.*x64|Win.*x86|Linux.*x64|Darwin.*x64|nt/GUID/|NT Build|Kernel version|Darwin Kernel" "$profile_file" | head -1)
    
    # Parse different profile formats for different operating systems
    if [[ "$suggested_profile" =~ Win[^[:space:]]* ]]; then
        # Windows traditional format
        suggested_profile=$(echo "$suggested_profile" | grep -oE "Win[^ ]*" | head -1)
        echo "Detected Windows profile: $suggested_profile"
        echo "$suggested_profile"
    elif [[ "$suggested_profile" =~ nt/GUID/ ]]; then
        # Windows GUID format
        suggested_profile=$(echo "$suggested_profile" | grep -oE "nt/GUID/[A-F0-9]+" | head -1)
        echo "Detected Windows profile (GUID): $suggested_profile"
        echo "$suggested_profile"
    elif [[ "$suggested_profile" =~ Linux.*x64 ]]; then
        # Linux profile format
        suggested_profile=$(echo "$suggested_profile" | grep -oE "Linux[^ ]*" | head -1)
        echo "Detected Linux profile: $suggested_profile"
        echo "$suggested_profile"
    elif [[ "$suggested_profile" =~ Darwin.*x64 ]]; then
        # macOS profile format
        suggested_profile=$(echo "$suggested_profile" | grep -oE "Darwin[^ ]*" | head -1)
        echo "Detected macOS profile: $suggested_profile"
        echo "$suggested_profile"
    elif [[ "$suggested_profile" == *"NT Build"* ]]; then
        # Windows NT Build info - determine appropriate profile
        if [[ "$suggested_profile" == *"19041"* ]]; then
            echo "Detected Windows NT Build 19041, using Win10x64_19041"
            echo "Win10x64_19041"
        elif [[ "$suggested_profile" == *"18362"* ]]; then
            echo "Detected Windows NT Build 18362, using Win10x64_18362"
            echo "Win10x64_18362"
        elif [[ "$suggested_profile" == *"17763"* ]]; then
            echo "Detected Windows NT Build 17763, using Win10x64_17763"
            echo "Win10x64_17763"
        elif [[ "$suggested_profile" == *"22000"* ]]; then
            echo "Detected Windows 11, using Win11x64_22000"
            echo "Win11x64_22000"
        else
            echo "Detected Windows build, using default Win10x64_19041"
            echo "Win10x64_19041"
        fi
    elif [[ "$suggested_profile" == *"Kernel version"* ]] && grep -q "Linux" "$profile_file"; then
        # Linux kernel version detection
        local kernel_version=$(grep "Kernel version" "$profile_file" | head -1)
        echo "Detected Linux system with $kernel_version"
        echo "LinuxGeneric64"  # Use generic Linux profile as fallback
    elif [[ "$suggested_profile" == *"Darwin Kernel"* ]]; then
        # macOS Darwin kernel detection
        local darwin_version=$(grep "Darwin Kernel" "$profile_file" | head -1)
        echo "Detected macOS system with $darwin_version"
        echo "OSXGeneric64"  # Use generic macOS profile as fallback
    else
        echo "Warning: Could not auto-detect profile. Trying common profiles..."
        
        # Try common profiles for different operating systems
        # Windows profiles - test with a simple, non-crashing plugin
        for fallback_profile in "Win10x64_19041" "Win10x64_18362" "Win10x64_17763" "Win7SP1x64" "Win8SP0x64" "Win11x64_22000"; do
            echo "Testing Windows profile: $fallback_profile"
            
            # Test if profile works by running a simple command (avoid plugins that might crash)
            if docker run --rm -v "$INPUT_DIR":/data:ro remnux/rekall \
               bash -c "timeout 30 rekall -f /data/\"$(basename "$memory_file")\" --profile \"$fallback_profile\" imageinfo 2>/dev/null | grep -q 'Kernel DTB'" 2>/dev/null; then
                echo "Successfully using Windows profile: $fallback_profile"
                echo "$fallback_profile"
                return 0
            fi
        done
        
        # Linux profiles (if .lime file detected or imageinfo suggests Linux)
        if [[ "$memory_file" == *".lime" ]] || grep -q -i "linux" "$profile_file"; then
            for fallback_profile in "LinuxGeneric64" "LinuxUbuntu64" "LinuxDebian64" "LinuxCentOS64"; do
                echo "Testing Linux profile: $fallback_profile"
                
                if docker run --rm -v "$INPUT_DIR":/data:ro remnux/rekall \
                   bash -c "timeout 30 rekall -f /data/\"$(basename "$memory_file")\" --profile \"$fallback_profile\" imageinfo 2>/dev/null | grep -q 'Kernel'" 2>/dev/null; then
                    echo "Successfully using Linux profile: $fallback_profile"
                    echo "$fallback_profile"
                    return 0
                fi
            done
        fi
        
        # macOS profiles (if Darwin detected)
        if grep -q -i "darwin\|osx\|macos" "$profile_file"; then
            for fallback_profile in "OSXGeneric64" "OSX10_14" "OSX10_15" "OSX11_0"; do
                echo "Testing macOS profile: $fallback_profile"
                
                if docker run --rm -v "$INPUT_DIR":/data:ro remnux/rekall \
                   bash -c "timeout 30 rekall -f /data/\"$(basename "$memory_file")\" --profile \"$fallback_profile\" imageinfo 2>/dev/null | grep -q 'Kernel'" 2>/dev/null; then
                    echo "Successfully using macOS profile: $fallback_profile"
                    echo "$fallback_profile"
                    return 0
                fi
            done
        fi
        
        echo "Error: No compatible profile found for this memory dump (tried Windows, Linux, and macOS profiles)"
        echo "FAILED"
    fi
}

# Function to convert Rekall text output to JSON format
convert_to_json() {
    local input_file="$1"
    local output_file="$2"
    local plugin_name="$3"
    
    # Use Python to parse Rekall output and convert to JSON
    python3 -c "
import re
import json
import sys
from datetime import datetime

def parse_rekall_output(input_file, output_file, plugin_name):
    with open(input_file, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    lines = content.split('\n')
    json_data = []
    headers = []
    found_separator = False
    
    # Different parsing logic based on plugin
    if plugin_name == 'pslist':
        for i, line in enumerate(lines):
            line = line.strip()
            
            # Find the header line - contains _EPROCESS and column names
            if '_EPROCESS' in line and 'name' in line and 'pid' in line:
                header_parts = line.split()
                headers = [h.strip() for h in header_parts if h.strip()]
                continue
            
            # Find separator line with dashes
            elif re.match(r'^-+\s+-+', line):
                found_separator = True
                continue
                
            # Parse data lines after separator
            elif found_separator and re.match(r'^0x[0-9a-fA-F]+', line):
                parts = line.split()
                if len(parts) >= 8:
                    row_data = {}
                    for idx, header in enumerate(headers[:len(parts)]):
                        row_data[header] = parts[idx] if idx < len(parts) else ''
                    # Add metadata for SIEM correlation
                    row_data['extraction_timestamp'] = datetime.now().isoformat()
                    row_data['plugin'] = plugin_name
                    row_data['event_type'] = 'process'
                    json_data.append(row_data)
        
        # Fallback headers if not found
        if not headers:
            headers = ['_EPROCESS', 'name', 'pid', 'ppid', 'thread_count', 'handle_count', 'session_id', 'wow64', 'process_create_time', 'process_exit_time']
    
    elif plugin_name == 'netscan':
        for i, line in enumerate(lines):
            line = line.strip()
            
            # Find header line
            if 'offset' in line and 'protocol' in line and 'local_addr' in line:
                header_parts = line.split()
                headers = [h.strip() for h in header_parts if h.strip()]
                continue
                
            # Find separator
            elif re.match(r'^-+\s+-+', line):
                found_separator = True
                continue
                
            # Parse data lines
            elif found_separator and re.match(r'^0x[0-9a-fA-F]+', line):
                parts = line.split()
                if len(parts) >= 6:
                    row_data = {}
                    for idx, header in enumerate(headers[:len(parts)]):
                        row_data[header] = parts[idx] if idx < len(parts) else ''
                    # Add metadata for network analysis
                    row_data['extraction_timestamp'] = datetime.now().isoformat()
                    row_data['plugin'] = plugin_name
                    row_data['event_type'] = 'network_connection'
                    json_data.append(row_data)
        
        # Fallback headers
        if not headers:
            headers = ['offset', 'protocol', 'local_addr', 'remote_addr', 'state', 'pid', 'owner', 'created']
    
    elif plugin_name == 'filescan':
        for i, line in enumerate(lines):
            line = line.strip()
            
            # Find header line with 'offset', 'ptr_no', etc.
            if 'offset' in line and 'ptr_no' in line and 'hnd_no' in line:
                header_parts = line.split()
                headers = [h.strip() for h in header_parts if h.strip() and h != '-']
                continue
                
            # Find separator
            elif re.match(r'^-\s+-+', line):
                found_separator = True
                continue
                
            # Parse data lines
            elif found_separator and re.match(r'^0x[0-9a-fA-F]+', line):
                # Split carefully to preserve file paths
                parts = line.split(None, len(headers)-1) if headers else line.split(None, 7)
                row_data = {}
                for idx, header in enumerate(headers[:len(parts)]):
                    row_data[header] = parts[idx] if idx < len(parts) else ''
                # Add metadata for file analysis
                row_data['extraction_timestamp'] = datetime.now().isoformat()
                row_data['plugin'] = plugin_name
                row_data['event_type'] = 'file_object'
                json_data.append(row_data)
        
        # Fallback headers
        if not headers:
            headers = ['offset', 'ptr_no', 'hnd_no', 'access', 'Owner', 'name', 'pid', 'path']
    
    elif plugin_name == 'hives':
        for i, line in enumerate(lines):
            line = line.strip()
            
            # Find header line
            if 'Offset' in line and 'Name' in line and not line.startswith('0x'):
                header_parts = line.split()
                headers = [h.strip() for h in header_parts if h.strip()]
                continue
                
            # Find separator
            elif re.match(r'^-+\s+-+', line):
                found_separator = True
                continue
                
            # Parse data lines
            elif found_separator and re.match(r'^0x[0-9a-fA-F]+', line):
                parts = line.split(None, 1)  # Split into offset and name
                row_data = {
                    'Offset': parts[0] if len(parts) > 0 else '', 
                    'Name': parts[1] if len(parts) > 1 else '',
                    'extraction_timestamp': datetime.now().isoformat(),
                    'plugin': plugin_name,
                    'event_type': 'registry_hive'
                }
                json_data.append(row_data)
        
        # Fallback headers
        if not headers:
            headers = ['Offset', 'Name']
    
    elif plugin_name == 'dlllist':
        current_process = {}
        for i, line in enumerate(lines):
            line = line.strip()
            
            # Skip process separators and metadata
            if (line.startswith('-') or 
                'Unable to read' in line or 
                not line):
                continue
                
            # Process info lines
            if line.startswith('Process:'):
                current_process = {'process_info': line}
            elif line.startswith('Command line:'):
                current_process['command_line'] = line
            elif line.startswith('pid:'):
                current_process['pid_info'] = line
            # Find header line
            elif 'base' in line and 'size' in line and 'reason' in line:
                header_parts = line.split()
                headers = [h.strip() for h in header_parts if h.strip()]
                continue
            # Parse DLL entries (start with 0x)
            elif re.match(r'^0x[0-9a-fA-F]+', line):
                parts = line.split(None, 3)  # Split into max 4 parts
                if len(parts) >= 3:
                    dll_entry = current_process.copy()
                    dll_entry.update({
                        'base': parts[0] if len(parts) > 0 else '',
                        'size': parts[1] if len(parts) > 1 else '',
                        'reason': parts[2] if len(parts) > 2 else '',
                        'dll_path': parts[3] if len(parts) > 3 else '',
                        'extraction_timestamp': datetime.now().isoformat(),
                        'plugin': plugin_name,
                        'event_type': 'dll_loaded'
                    })
                    json_data.append(dll_entry)
        
        # Fallback headers
        if not headers:
            headers = ['base', 'size', 'reason', 'dll_path']
    
    elif plugin_name == 'malfind':
        # Parse suspicious processes - different format
        current_process = ''
        
        for line in lines:
            line = line.strip()
            if line.startswith('Process:'):
                current_process = line
            elif line.startswith('Vad Tag:') or line.startswith('Address:'):
                entry = {
                    'process_info': current_process,
                    'vad_info': line,
                    'extraction_timestamp': datetime.now().isoformat(),
                    'plugin': plugin_name,
                    'event_type': 'suspicious_process_vad'
                }
                json_data.append(entry)
            elif re.match(r'^0x[0-9a-fA-F]+', line):
                entry = {
                    'process_info': current_process,
                    'hex_data': line,
                    'extraction_timestamp': datetime.now().isoformat(),
                    'plugin': plugin_name,
                    'event_type': 'suspicious_process_hex'
                }
                json_data.append(entry)
    
    # Write JSON file - one JSON object per line for SIEM ingestion
    if json_data:
        with open(output_file, 'w', encoding='utf-8') as jsonfile:
            for entry in json_data:
                jsonfile.write(json.dumps(entry) + '\n')
    else:
        # Create error entry if no data found
        error_entry = {
            'error': 'No data extracted',
            'plugin': plugin_name,
            'extraction_timestamp': datetime.now().isoformat(),
            'event_type': 'error',
            'details': 'Plugin produced no parseable output'
        }
        with open(output_file, 'w', encoding='utf-8') as jsonfile:
            jsonfile.write(json.dumps(error_entry) + '\n')

parse_rekall_output('$input_file', '$output_file', '$plugin_name')
"
}

# Function to run individual Rekall plugins with better error handling
run_rekall_plugin() {
    local plugin="$1"
    local filename="$2"
    local profile="$3"
    local memory_file="$4"

    local json_output="$OUTPUT_DIR/json/${filename}/${plugin}.json"
    local log_file="$OUTPUT_DIR/logs/$filename.log"
    local temp_output="$OUTPUT_DIR/raw_output/${filename}/${plugin}.txt"

    # Custom messages for different plugins
    case "$plugin" in
        "pslist") echo "Extracting process list..." ;;
        "netscan") echo "Extracting network connections..." ;;
        "filescan") echo "Extracting file objects..." ;;
        "hives") echo "Extracting registry information..." ;;
        "malfind") echo "Scanning for suspicious processes (with timeout)..." ;;
        "dlllist") echo "Extracting DLL information..." ;;
        *) echo "Extracting $plugin..." ;;
    esac
    
    # Run the Rekall plugin and save raw output (matching CSV script approach)
    docker run --rm -v "$INPUT_DIR":/data:ro -v "$OUTPUT_DIR/raw_output":/output remnux/rekall \
    bash -c "rekall -f /data/\"$(basename "$memory_file")\" --profile \"$profile\" $plugin" --output_style full \
    > "$temp_output" 2>> "$log_file"
    
    # Check if we got valid output
    if [[ -s "$temp_output" ]] && ! grep -q -E "Error:|Traceback|No profiles match" "$temp_output"; then
        # Convert text output to JSON
        convert_to_json "$temp_output" "$json_output" "$plugin"
        
        # Verify JSON was created successfully
        if [[ -f "$json_output" ]] && [[ -s "$json_output" ]]; then
            echo "SUCCESS: $plugin completed for $filename"
        else
            echo "Warning: $plugin text-to-JSON conversion failed for $filename" | tee -a "$log_file"
            echo '{"error": "Conversion failed", "plugin": "'$plugin'", "extraction_timestamp": "'$(date -Iseconds)'", "details": "Text to JSON conversion failed"}' > "$json_output"
        fi
    else
        echo "Warning: $plugin failed for $filename" | tee -a "$log_file"
        
        # Handle malfind special case with JSON fallback (matching CSV script)
        if [[ "$plugin" == "malfind" ]]; then
            echo "Warning: malfind failed, using alternative methods..."
            
            # Create fallback suspicious analysis using process list
            echo '{"extraction_timestamp": "'$(date -Iseconds)'", "event_type": "warning", "description": "Malfind analysis failed due to plugin issues", "source": "analysis", "details": "Used alternative methods for suspicious process detection"}' > "$json_output"
            
            # Try to get some suspicious indicators from process list instead
            if [[ -f "$HOST_OUTPUT_DIR/raw_output/${filename}_pslist.txt" ]]; then
                # Look for suspicious process names in the already extracted process list
                grep -iE "(cmd\.exe|powershell|wscript|cscript|rundll32)" "$HOST_OUTPUT_DIR/raw_output/${filename}_pslist.txt" | while read -r line; do
                    echo '{"extraction_timestamp": "'$(date -Iseconds)'", "event_type": "suspicious_process", "description": "Process with potential for abuse", "source": "pslist_analysis", "details": "'$line'"}' >> "$json_output"
                done 2>/dev/null || true
            fi
        else
            echo '{"error": "Plugin execution failed", "plugin": "'$plugin'", "extraction_timestamp": "'$(date -Iseconds)'", "details": "Plugin execution failed"}' > "$json_output"
        fi
    fi
}

# Function to run Rekall analysis and create timeline
analyze_memory() {
    local memory_file="$1"
    local filename="$2"
    local profile="$3"
    
    echo "Analyzing memory dump: $filename using profile: $profile"
    
    # Define the plugins to run - ordered by reliability and importance
    local plugins=("pslist" "netscan" "filescan" "hives" "dlllist" "malfind")
    
    # Run each plugin with improved error handling
    for plugin in "${plugins[@]}"; do
        run_rekall_plugin "$plugin" "$filename" "$profile" "$memory_file"
    done
    
    # Validate JSON output files
    echo "Validating JSON output files for $filename..."
    for plugin in "${plugins[@]}"; do
        json_file="$OUTPUT_DIR/json/${filename}/${plugin}.json"
        if [[ -f "$json_file" ]]; then
            # Basic JSON validation
            if python3 -c "import json; json.load(open('$json_file'))" 2>/dev/null; then
                echo "  ✅ $plugin: Valid JSON format"
            elif python3 -c "
import json
with open('$json_file', 'r') as f:
    for line_num, line in enumerate(f, 1):
        if line.strip():
            try:
                json.loads(line.strip())
            except json.JSONDecodeError as e:
                print(f'Line {line_num}: {e}')
                exit(1)
print('Valid JSON lines format')
" 2>/dev/null; then
                echo "  ✅ $plugin: Valid JSON lines format"
            else
                echo "  ⚠️  $plugin: Invalid JSON format - check output"
            fi
        fi
    done
}

# Collect all memory dump files with supported extensions (case-insensitive)
MEMORY_FILES=()
LINUX_FILES=()
MACOS_FILES=()
UNSUPPORTED_FILES=()

for pattern in "*.[Dd][Mm][Pp]" "*.[Rr][Aa][Ww]" "*.[Ii][Mm][Gg]" "*.[Mm][Ee][Mm]" "*.[Bb][Ii][Nn]" "*.[Dd][Dd]" "*.vmem" "*.vmsn" "*.vmss" "*.[Aa][Dd]1" "*.[Ss][Yy][Ss]" "*.lime" "*.nvram" "*.core" "*.crash" "*.dmp"; do
    for file in "$INPUT_DIR"/$pattern; do
        if [[ -f "$file" ]]; then
            filename=$(basename "$file")
            
            # Categorize files by type and likely OS
            if [[ "$filename" == *".lime" ]]; then
                LINUX_FILES+=("$file")
            elif [[ "$filename" == *".core" ]] || [[ "$filename" == *".crash" ]]; then
                # Could be Linux or macOS, add to general memory files for analysis
                MACOS_FILES+=("$file")
            elif [[ "$filename" == *".ad1" ]] || [[ "$filename" == *".sys" ]] || [[ "$filename" == *".nvram" ]]; then
                UNSUPPORTED_FILES+=("$file")
            else
                # Windows and general memory dumps
                MEMORY_FILES+=("$file")
            fi
        fi
    done
done

# Remove duplicates and sort
MEMORY_FILES=($(printf '%s\n' "${MEMORY_FILES[@]}" | sort -u))
LINUX_FILES=($(printf '%s\n' "${LINUX_FILES[@]}" | sort -u))
MACOS_FILES=($(printf '%s\n' "${MACOS_FILES[@]}" | sort -u))
UNSUPPORTED_FILES=($(printf '%s\n' "${UNSUPPORTED_FILES[@]}" | sort -u))

# Report file categorization
linux_count=${#LINUX_FILES[@]}
macos_count=${#MACOS_FILES[@]}
unsupported_count=${#UNSUPPORTED_FILES[@]}

if [[ $linux_count -gt 0 ]]; then
    echo ""
    echo "Found $linux_count Linux memory dump files (.lime):"
    for file in "${LINUX_FILES[@]}"; do
        echo "   - $(basename "$file") (Linux memory dump - will attempt analysis)"
    done
fi

if [[ $macos_count -gt 0 ]]; then
    echo ""
    echo "Found $macos_count possible macOS memory dump files (.core/.crash):"
    for file in "${MACOS_FILES[@]}"; do
        echo "   - $(basename "$file") (Possible macOS memory dump - will attempt analysis)"
    done
fi

if [[ $unsupported_count -gt 0 ]]; then
    echo ""
    echo "Found $unsupported_count unsupported files:"
    for file in "${UNSUPPORTED_FILES[@]}"; do
        filename=$(basename "$file")
        if [[ "$filename" == *".ad1" ]]; then
            echo "   - $filename (.ad1 - AccessData forensic image, not memory dump)"
        elif [[ "$filename" == *".sys" ]]; then
            echo "   - $filename (.sys - likely pagefile, not memory dump)"
        elif [[ "$filename" == *".nvram" ]]; then
            echo "   - $filename (.nvram - VMware NVRAM, not memory dump)"
        else
            echo "   - $filename (unsupported format)"
        fi
    done
fi

# Combine all processable files
ALL_FILES=()
for file in "${MEMORY_FILES[@]}"; do
    ALL_FILES+=("$file")
done
for file in "${LINUX_FILES[@]}"; do
    ALL_FILES+=("$file")
done
for file in "${MACOS_FILES[@]}"; do
    ALL_FILES+=("$file")
done

# Ensure there are memory files to process
total_files=${#ALL_FILES[@]}
memory_count=${#MEMORY_FILES[@]}
linux_count=${#LINUX_FILES[@]}
macos_count=${#MACOS_FILES[@]}

if [[ $total_files -eq 0 ]]; then
    echo "Error: No supported memory dump files found in $INPUT_DIR"
    echo "Supported formats:"
    echo "  Windows: .dmp, .raw, .img, .mem, .bin, .dd, .vmem, .vmsn, .vmss (case-insensitive)"
    echo "  Linux: .lime"
    echo "  macOS: .core, .crash"
    
    exit 1
fi

echo ""
echo "Found $total_files memory dump files to process (Windows: $memory_count, Linux: $linux_count, macOS: $macos_count)"
echo ""

# Main processing loop - now handles all OS types with better error handling
for MEMORY_FILE in "${ALL_FILES[@]}"; do
    # Extract clean filename for output
    FILENAME=$(get_clean_filename "$MEMORY_FILE")
    
    echo "Processing: $(basename "$MEMORY_FILE")"
    echo "Output name: $FILENAME"

    # Detect the appropriate profile
    PROFILE=$(detect_profile "$MEMORY_FILE" "$FILENAME")
    
    if [[ "$PROFILE" == "FAILED" ]]; then
        echo "FAILED: Could not determine appropriate profile for $FILENAME" | tee -a "$HOST_OUTPUT_DIR/logs/$FILENAME.log"
        continue
    fi

    # Analyze memory dump and create artifacts
    analyze_memory "$MEMORY_FILE" "$FILENAME" "$PROFILE"

    # Check if any substantial output was created (check for files that aren't just error messages)
    successful_files=0
    failed_files=0
    for json_file in "$HOST_OUTPUT_DIR/json/${FILENAME}"_*.json; do
        if [[ -f "$json_file" ]]; then
            if grep -q '"error"' "$json_file"; then
                ((failed_files++))
            else
                ((successful_files++))
            fi
        fi
    done

    echo ""
    echo "Results for $FILENAME:"
    echo "  Successful extractions: $successful_files"
    echo "  Failed extractions: $failed_files"
    
    if [[ $successful_files -eq 0 ]]; then
        echo "WARNING: All Rekall plugins failed for $FILENAME - check logs for details" | tee -a "$OUTPUT_DIR/logs/$FILENAME.log"
    else
        echo "SUCCESS: Processed $FILENAME with $successful_files successful extractions" | tee -a "$OUTPUT_DIR/logs/$FILENAME.log"
    fi
    
    # Log file locations
    echo "Output files for $FILENAME:"
    for json_file in "$OUTPUT_DIR/json/${FILENAME}"_*.json; do
        if [[ -f "$json_file" ]]; then
            plugin_name=$(basename "$json_file" | sed "s/${FILENAME}_//" | sed 's/.json$//')
            if grep -q '"error"' "$json_file"; then
                echo "  ❌ $plugin_name: $(basename "$json_file") (failed)"
            else
                echo "  ✅ $plugin_name: $(basename "$json_file") (success)"
            fi
        fi
    done
    echo "  📋 Profile: $OUTPUT_DIR/profiles/${FILENAME}_profile.txt"
    echo "  📝 Logs: $OUTPUT_DIR/logs/$FILENAME.log"
    echo ""
done

# Final summary
total_files=${#ALL_FILES[@]}
echo "COMPLETE: Processing complete. Analyzed $total_files memory dump files across all platforms."
echo ""
echo "Output directories:"
echo "  - JSON extractions: $OUTPUT_DIR/json/"
echo "  - Profile information: $OUTPUT_DIR/profiles/"
echo "  - Raw output: $OUTPUT_DIR/raw_output/"
echo "  - Processing logs: $OUTPUT_DIR/logs/"
echo ""
echo "Note: Some plugins may fail due to Rekall/Capstone compatibility issues."
echo "Check individual JSON files and logs for detailed results."