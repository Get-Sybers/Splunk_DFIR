#!/bin/bash

# Ensure correct filepath assigned when referenced
SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"  # Resolves full path
REPO_ROOT_DIR="$(realpath "$SCRIPT_DIR/..")"
INPUT_DIR="$REPO_ROOT_DIR/data_store/raw/memory"
HOST_OUTPUT_DIR="$REPO_ROOT_DIR/data_store/processed/rekall"

# Define memory file extensions to process
MEMORY_EXTENSIONS=(
    "*.dmp" "*.raw" "*.img" "*.mem" "*.bin" "*.dd"
    "*.vmem" "*.vmsn" "*.vmss" "*.ad1" "*.sys"
    "*.nvram" "*.lime" "*.core" "*.crash"
)

# Define plugin lists for different operating systems
GENERIC_PLUGIN_LIST=(
    "arp"
    "bash"
    "cmdscan"
    "consoles"
    "dlllist"
    "filescan"
    "handles"
    "hives"
    "ifconfig"
    "malfind"
    "maps"
    "mfind"
    "mls" 
    "mutantscan"
    "netscan"
    "netstat"
    "psaux"
    "pslist"
    "psscan"
    "pstree"
    "zsh"
    
)

WINDOWS_PLUGIN_LIST=(
    "netscan"
    "filescan"
    "dlllist"
    "hives"
    "psscan"
    "malfind"
    "cmdscan"
    "consoles"
    "handles"
    "mutantscan"
)

LINUX_PLUGIN_LIST=(
    "arp"
    "bash"
    "ifconfig"
    "mfind"
    "mls"
    "psaux"
    "maps"
    "zsh"
)

MAC_PLUGIN_LIST=(
    "zsh"
)

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
echo "Output Directory: $HOST_OUTPUT_DIR"
echo ""

# Ensure the host output directories exist
mkdir -p "$HOST_OUTPUT_DIR/json"
mkdir -p "$HOST_OUTPUT_DIR/logs"
mkdir -p "$HOST_OUTPUT_DIR/profiles"
mkdir -p "$HOST_OUTPUT_DIR/raw_output"

# Change ownership and permissions
sudo chmod -R 777 "$INPUT_DIR"

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
    local profile_file="$HOST_OUTPUT_DIR/profiles/${filename}_profile.txt"
    
    echo "Detecting memory dump profile for: $filename"
    
    # Run imageinfo to detect profile with timeout and proper logging control
    docker run --rm -v "$INPUT_DIR":/data:ro remnux/rekall \
    bash -c "rekall -f /data/\"$(basename "$memory_file")\" --quiet --autodetect_build_local basic --logging_level ERROR imageinfo" > "$profile_file" 2>&1
    
    local exit_code=$?
    
    # Check if the command timed out or failed
    if [[ $exit_code -eq 124 ]]; then
        echo "Warning: Profile detection timed out for $filename"
        echo "Error: Profile detection timed out" > "$profile_file"
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
    else
        echo "Warning: Could not auto-detect profile from imageinfo output."
        
        # For Windows memory dumps, try common Windows profiles
        echo "Trying common Windows profiles since this appears to be a Windows memory dump..."
        for fallback_profile in "Win10x64_19041" "Win10x64_18362" "Win10x64_17763" "Win7SP1x64" "Win8SP0x64" "Win11x64_22000"; do
            echo "Testing Windows profile: $fallback_profile"
            
            # Test if profile works by running pslist (safer than imageinfo)
            if docker run --rm -v "$INPUT_DIR":/data:ro remnux/rekall \
               bash -c "rekall -f /data/\"$(basename "$memory_file")\" --profile \"$fallback_profile\" pslist --max_output_lines 1 2>/dev/null | grep -q '_EPROCESS'" 2>/dev/null; then
                echo "Successfully using Windows profile: $fallback_profile"
                echo "$fallback_profile"
                return 0
            fi
        done
        
        echo "Error: No compatible profile found for this memory dump"
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
        header_line = None
        separator_line = None
        
        # First pass: find header and separator
        for i, line in enumerate(lines):
            line_stripped = line.strip()
            if '_EPROCESS' in line_stripped and 'name' in line_stripped and 'pid' in line_stripped:
                header_line = line
                continue
            elif re.match(r'^-+\s+-+', line_stripped) and header_line:
                separator_line = line
                found_separator = True
                break
        
        # Parse using fixed-width columns based on header positions
        if header_line and separator_line:
            # Find column positions from the header
            eprocess_start = header_line.find('_EPROCESS')
            name_start = header_line.find('name')
            fullpath_start = header_line.find('fullpath')
            pid_start = header_line.find('pid')
            ppid_start = header_line.find('ppid', pid_start + 3)  # Skip first 'ppid' column
            thread_start = header_line.find('thread_count')
            handle_start = header_line.find('handle_count')
            session_start = header_line.find('session_id')
            wow64_start = header_line.find('wow64')
            create_time_start = header_line.find('process_create_time')
            exit_time_start = header_line.find('process_exit_time')
            
            # Define column boundaries
            columns = [
                ('_EPROCESS', eprocess_start, name_start),
                ('name', name_start, fullpath_start),
                ('fullpath', fullpath_start, pid_start),
                ('pid', pid_start, ppid_start),
                ('ppid', ppid_start, thread_start),
                ('thread_count', thread_start, handle_start),
                ('handle_count', handle_start, session_start),
                ('session_id', session_start, wow64_start),
                ('wow64', wow64_start, create_time_start),
                ('process_create_time', create_time_start, exit_time_start),
                ('process_exit_time', exit_time_start, len(header_line))
            ]
            
            # Parse data lines using fixed positions
            for line in lines:
                line_stripped = line.strip()
                if found_separator and re.match(r'^0x[0-9a-fA-F]+', line_stripped):
                    row_data = {}
                    
                    for col_name, start_pos, end_pos in columns:
                        if start_pos < len(line) and start_pos >= 0:
                            if end_pos > len(line):
                                end_pos = len(line)
                            value = line[start_pos:end_pos].strip()
                            row_data[col_name] = value if value and value != '-' else ''
                        else:
                            row_data[col_name] = ''
                    
                    # Add metadata
                    row_data['extraction_timestamp'] = datetime.now().isoformat()
                    row_data['plugin'] = plugin_name
                    row_data['event_type'] = 'process'
                    json_data.append(row_data)
        
        # Fallback for simple parsing if fixed-width fails
        if not json_data:
            for i, line in enumerate(lines):
                line_stripped = line.strip()
                if found_separator and re.match(r'^0x[0-9a-fA-F]+', line_stripped):
                    # Simple space-split with maximum splits to preserve paths
                    parts = line_stripped.split(None, 10)
                    if len(parts) >= 4:
                        row_data = {
                            '_EPROCESS': parts[0] if len(parts) > 0 else '',
                            'name': parts[1] if len(parts) > 1 else '',
                            'fullpath': parts[2] if len(parts) > 2 else '',
                            'pid': parts[3] if len(parts) > 3 else '',
                            'ppid': parts[4] if len(parts) > 4 else '',
                            'thread_count': parts[5] if len(parts) > 5 else '',
                            'handle_count': parts[6] if len(parts) > 6 else '',
                            'session_id': parts[7] if len(parts) > 7 else '',
                            'wow64': parts[8] if len(parts) > 8 else '',
                            'process_create_time': parts[9] if len(parts) > 9 else '',
                            'process_exit_time': parts[10] if len(parts) > 10 else '',
                            'extraction_timestamp': datetime.now().isoformat(),
                            'plugin': plugin_name,
                            'event_type': 'process'
                        }
                        json_data.append(row_data)
    
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

    local json_output="$HOST_OUTPUT_DIR/json/${filename}_${plugin}.json"
    local log_file="$HOST_OUTPUT_DIR/logs/$filename.log"
    local temp_output="$HOST_OUTPUT_DIR/raw_output/${filename}_${plugin}.txt"

    # Custom messages for different plugins
    echo "Running Rekall plugin: $plugin on $filename with profile: $profile"

    # Run the Rekall plugin and save raw output
    docker run --rm -v "$INPUT_DIR":/data:ro -v "$HOST_OUTPUT_DIR/raw_output":/output remnux/rekall \
    bash -c "rekall -f /data/\"$(basename "$memory_file")\" --profile \"$profile\" $plugin --output_style full" \
    > "$temp_output" 2>> "$log_file"
    
    local exit_code=$?
    
    # Check exit codes
    if [[ $exit_code -eq 124 ]]; then
        echo "Warning: $plugin timed out for $filename" | tee -a "$log_file"
        echo '{"error": "Plugin timeout", "plugin": "'$plugin'", "extraction_timestamp": "'$(date -Iseconds)'", "details": "Plugin execution timed out after 300 seconds"}' > "$json_output"
        return 1
    elif [[ $exit_code -ne 0 ]]; then
        echo "Warning: $plugin failed with exit code $exit_code for $filename" | tee -a "$log_file"
        echo '{"error": "Plugin failed", "plugin": "'$plugin'", "extraction_timestamp": "'$(date -Iseconds)'", "exit_code": '$exit_code', "details": "Plugin execution failed"}' > "$json_output"
        return 1
    fi
    
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
    fi
}

# Function to run Rekall analysis and create timeline
analyze_memory() {
    local memory_file="$1"
    local filename="$2"
    local profile="$3"
    
    echo "Analyzing memory dump: $filename using profile: $profile"
    
    # Define the plugins to run
    if [[ $profile =~ ^Win.*$ ]]; then
        # Windows profile detected
        plugins=("${GENERIC_PLUGIN_LIST[@]}" "${WINDOWS_PLUGIN_LIST[@]}")
    elif [[ $profile =~ ^Linux.*$ ]]; then
        # Linux profile detected
        plugins=("${GENERIC_PLUGIN_LIST[@]}" "${LINUX_PLUGIN_LIST[@]}")
    elif [[ $profile =~ ^Darwin.*$ ]] || [[ $profile =~ ^OSX.*$ ]]; then
        # macOS profile detected
        plugins=("${GENERIC_PLUGIN_LIST[@]}" "${MAC_PLUGIN_LIST[@]}")
    else
        # Generic profile, run only generic plugins
        plugins=("${GENERIC_PLUGIN_LIST[@]}")
    fi
    
    # Run each plugin with improved error handling
    for plugin in "${plugins[@]}"; do
        run_rekall_plugin "$plugin" "$filename" "$profile" "$memory_file"
    done
    
    # Validate JSON output files
    echo "Validating JSON output files for $filename..."
    for plugin in "${plugins[@]}"; do
        json_file="$HOST_OUTPUT_DIR/json/${filename}_${plugin}.json"
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

# MAIN PROCESSING LOOP - Process all collected files
ALL_FILES=("${MEMORY_FILES[@]}" "${LINUX_FILES[@]}" "${MACOS_FILES[@]}")

for memory_file in "${ALL_FILES[@]}"; do
    filename=$(get_clean_filename "$memory_file")
    profile=$(detect_profile "$memory_file" "$filename")
    
    if [[ "$profile" != "FAILED" ]]; then
        analyze_memory "$memory_file" "$filename" "$profile"
    else
        echo "Skipping $filename - profile detection failed"
    fi
done

# Final summary
total_files=$((${#MEMORY_FILES[@]} + ${#LINUX_FILES[@]} + ${#MACOS_FILES[@]}))
echo "COMPLETE: Processing complete. Analyzed $total_files memory dump files across all platforms."
echo ""
echo "Output directories:"
echo "  - JSON extractions: $HOST_OUTPUT_DIR/json/"
echo "  - Profile information: $HOST_OUTPUT_DIR/profiles/"
echo "  - Raw output: $HOST_OUTPUT_DIR/raw_output/"
echo "  - Processing logs: $HOST_OUTPUT_DIR/logs/"
echo ""
echo "Note: Some plugins may fail due to Rekall/Capstone compatibility issues."
echo "Check individual JSON files and logs for detailed results."