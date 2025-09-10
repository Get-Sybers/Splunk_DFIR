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
    "pslist"
    "psscan"
    "netstat"
    "dlllist"
    "hives"
    "malfind"
    "cmdscan"
    'connections'
    "consoles"
    "handles"
    "mutantscan"
    "netscan"
    "filescan"
    "arp"
    "bash"
    "ifconfig"
    "mfind"
    "mls"
    "psaux"
    "maps"
    "zsh"
    
)

WINDOWS_PLUGIN_LIST=(
    "netscan"
    "filescan"

)

LINUX_PLUGIN_LIST=(
    "arp"
    "bash"

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

# Function to run individual Rekall plugins with better error handling
run_rekall_plugin() {
    local plugin="$1"
    local filename="$2"
    local profile="$3"
    local memory_file="$4"

    local log_file="$HOST_OUTPUT_DIR/logs/$filename.log"
    local text_output="$HOST_OUTPUT_DIR/raw_output/${filename}/${plugin}.txt"

    # Custom messages for different plugins
    echo "Running Rekall plugin: $plugin on $filename with profile: $profile"

    # Create output directory for this file if it doesn't exist
    mkdir -p "$HOST_OUTPUT_DIR/raw_output/$filename"

    # Run the Rekall plugin and save raw output
    docker run --rm -v "$INPUT_DIR":/data:ro -v "$HOST_OUTPUT_DIR/raw_output/$filename":/output remnux/rekall \
    bash -c "rekall -f /data/\"$(basename "$memory_file")\" --profile \"$profile\" $plugin --output_style full" \
    > "$text_output" 2>> "$log_file"
    
    local exit_code=$?
    
    # Check exit codes
    if [[ $exit_code -eq 124 ]]; then
        echo "Warning: $plugin timed out for $filename" | tee -a "$log_file"
        echo "Error: Plugin timeout - Plugin execution timed out after 300 seconds" > "$text_output"
        echo "Plugin: $plugin" >> "$text_output"
        echo "Timestamp: $(date)" >> "$text_output"
        return 1
    elif [[ $exit_code -ne 0 ]]; then
        echo "Warning: $plugin failed with exit code $exit_code for $filename" | tee -a "$log_file"
        echo "Error: Plugin failed with exit code $exit_code" > "$text_output"
        echo "Plugin: $plugin" >> "$text_output"
        echo "Timestamp: $(date)" >> "$text_output"
        return 1
    fi
    
    # Check if we got valid output
    if [[ -s "$text_output" ]] && ! grep -q -E "Error:|Traceback|No profiles match" "$text_output"; then
        echo "SUCCESS: $plugin completed for $filename"
    else
        echo "Warning: $plugin failed for $filename" | tee -a "$log_file"
        echo "Error: Plugin execution failed" > "$text_output"
        echo "Plugin: $plugin" >> "$text_output"
        echo "Timestamp: $(date)" >> "$text_output"
        echo "Check $log_file for detailed error information" >> "$text_output"
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
    
    # Validate text output files
    echo "Validating text output files for $filename..."
    for plugin in "${plugins[@]}"; do
        text_file="$HOST_OUTPUT_DIR/raw_output/${filename}/${plugin}.txt"
        if [[ -f "$text_file" ]]; then
            if [[ -s "$text_file" ]] && ! grep -q "Error: Plugin" "$text_file"; then
                echo "  ✅ $plugin: Output file created successfully"
            else
                echo "  ⚠️  $plugin: Failed or empty output"
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
        
        # Check if any substantial output was created
        successful_files=0
        failed_files=0
        for text_file in "$HOST_OUTPUT_DIR/raw_output/${filename}"_*.txt; do
            if [[ -f "$text_file" ]]; then
                if grep -q "Error: Plugin" "$text_file" || [[ ! -s "$text_file" ]]; then
                    ((failed_files++))
                else
                    ((successful_files++))
                fi
            fi
        done

        echo ""
        echo "Results for $filename:"
        echo "  Successful extractions: $successful_files"
        echo "  Failed extractions: $failed_files"
        
        if [[ $successful_files -eq 0 ]]; then
            echo "WARNING: All Rekall plugins failed for $filename - check logs for details"
        else
            echo "SUCCESS: Processed $filename with $successful_files successful extractions"
        fi
        
        # Log file locations
        echo "Output files for $filename:"
        for text_file in "$HOST_OUTPUT_DIR/raw_output/${filename}"_*.txt; do
            if [[ -f "$text_file" ]]; then
                plugin_name=$(basename "$text_file" | sed "s/${filename}_//" | sed 's/.txt$//')
                if grep -q "Error: Plugin" "$text_file" || [[ ! -s "$text_file" ]]; then
                    echo "  ❌ $plugin_name: $(basename "$text_file") (failed)"
                else
                    echo "  ✅ $plugin_name: $(basename "$text_file") (success)"
                fi
            fi
        done
        echo "  📋 Profile: $HOST_OUTPUT_DIR/profiles/${filename}_profile.txt"
        echo "  📝 Logs: $HOST_OUTPUT_DIR/logs/$filename.log"
        echo ""
    else
        echo "Skipping $filename - profile detection failed"
    fi
done

# Final summary
total_files=$((${#MEMORY_FILES[@]} + ${#LINUX_FILES[@]} + ${#MACOS_FILES[@]}))
echo "COMPLETE: Processing complete. Analyzed $total_files memory dump files across all platforms."
echo ""
echo "Output directories:"
echo "  - Text extractions: $HOST_OUTPUT_DIR/raw_output/"
echo "  - Profile information: $HOST_OUTPUT_DIR/profiles/"
echo "  - Processing logs: $HOST_OUTPUT_DIR/logs/"
echo ""
echo "Note: Some plugins may fail due to Rekall/Capstone compatibility issues."
echo "Check individual text files and logs for detailed results."