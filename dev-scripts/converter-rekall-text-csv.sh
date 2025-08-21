#!/bin/bash

# Simple Rekall Text to CSV Converter
# Uses sed for reliable regex conversion of spaces to commas

# Ensure correct filepath assigned when referenced
SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"
REPO_ROOT_DIR="$(realpath "$SCRIPT_DIR/..")"
INPUT_DIR="$REPO_ROOT_DIR/data_store/processed/rekall/raw_output"
OUTPUT_DIR="$REPO_ROOT_DIR/data_store/processed/rekall/csv_output"

################################################################################
echo ""
echo " ████████╗██╗  ██╗████████╗    ████████╗ ██████╗      ██████╗███████╗██╗   ██╗"
sleep 0.1
echo "╚══██╔══╝╚██╗██╔╝╚══██╔══╝    ╚══██╔══╝██╔═══██╗    ██╔════╝██╔════╝██║   ██║"
sleep 0.1
echo "   ██║    ╚███╔╝    ██║          ██║   ██║   ██║    ██║     ███████╗██║   ██║"
sleep 0.1
echo "   ██║    ██╔██╗    ██║          ██║   ██║   ██║    ██║     ╚════██║╚██╗ ██╔╝"
sleep 0.1
echo "   ██║   ██╔╝ ██╗   ██║          ██║   ╚██████╔╝    ╚██████╗███████║ ╚████╔╝ "
sleep 0.1
echo "   ╚═╝   ╚═╝  ╚═╝   ╚═╝          ╚═╝    ╚═════╝      ╚═════╝╚══════╝  ╚═══╝  "
echo ""
echo "Simple Rekall Text to CSV Converter"
echo ""
echo "Repository Root: $REPO_ROOT_DIR"
echo "Input Directory: $INPUT_DIR"
echo "Output Directory: $OUTPUT_DIR"
echo ""

# Ensure output directory exists
mkdir -p "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR/logs"

# Function to clean and prepare text for CSV conversion
clean_text_for_csv() {
    local input_text="$1"
    
    # Remove ANSI color codes and control characters
    echo "$input_text" | sed -e 's/\x1b\[[0-9;]*m//g' \
                           -e 's/\r//g' \
                           -e 's/\x00//g' \
                           -e 's/[\x01-\x08\x0B\x0C\x0E-\x1F\x7F]//g'
}

# Function to convert any Rekall output to CSV using simple sed approach
convert_to_csv_simple() {
    local input_file="$1"
    local output_file="$2"
    local plugin="$3"
    local filename="$4"
    
    echo "Converting $plugin output to CSV using simple sed approach..."
    
    # Skip if input file doesn't exist or is empty
    if [[ ! -f "$input_file" ]] || [[ ! -s "$input_file" ]]; then
        echo "Warning: Input file $input_file is missing or empty"
        return 1
    fi
    
    # Check if the file contains error messages
    if grep -q "Error: Plugin" "$input_file"; then
        echo "Warning: Input file contains plugin errors, skipping conversion"
        return 1
    fi
    
    # Clean the input text
    local cleaned_content=$(clean_text_for_csv "$(cat "$input_file")")
    
    # Create temporary file for processing
    local temp_file=$(mktemp)
    echo "$cleaned_content" > "$temp_file"
    
    # Process the file using sed and basic text processing
    {
        # Extract header (first non-empty line with alphabetic content, before dashes)
        header_found=false
        while IFS= read -r line; do
            # Skip empty lines and error messages
            if [[ -z "$line" ]] || [[ "$line" =~ ^Error: ]] || [[ "$line" =~ ^Plugin: ]] || [[ "$line" =~ ^Timestamp: ]]; then
                continue
            fi
            
            # Check if this looks like a header (alphabetic content)
            if [[ "$line" =~ ^[[:space:]]*[A-Za-z_] ]] && [[ ! "$line" =~ ^[[:space:]]*-+ ]]; then
                # Convert header spaces to commas
                echo "$line" | sed -E 's/^[[:space:]]+//; s/[[:space:]]+$//; s/[[:space:]]{2,}/,/g'
                header_found=true
                break
            fi
        done < "$temp_file"
        
        # If no header found, use default
        if [[ "$header_found" != true ]]; then
            echo "Field1,Field2,Field3,Field4,Field5,Field6,Field7,Field8,Field9,Field10"
        fi
        
        # Process data lines
        in_data=false
        current_record=""
        
        while IFS= read -r line; do
            # Skip empty lines before data section
            if [[ -z "$line" ]] && [[ "$in_data" != true ]]; then
                continue
            fi
            
            # Skip error/metadata lines
            if [[ "$line" =~ ^Error: ]] || [[ "$line" =~ ^Plugin: ]] || [[ "$line" =~ ^Timestamp: ]]; then
                continue
            fi
            
            # Skip header line (already processed)
            if [[ "$line" =~ ^[[:space:]]*[A-Za-z_] ]] && [[ ! "$line" =~ ^[[:space:]]*-+ ]] && [[ "$in_data" != true ]]; then
                continue
            fi
            
            # Skip dash separator line and mark start of data
            if [[ "$line" =~ ^[[:space:]]*-+ ]]; then
                in_data=true
                continue
            fi
            
            # Process data section
            if [[ "$in_data" == true ]]; then
                # Empty line - process accumulated record
                if [[ -z "$line" ]]; then
                    if [[ -n "$current_record" ]]; then
                        process_record "$current_record"
                        current_record=""
                    fi
                    continue
                fi
                
                # New record - starts with hex address or alphanumeric (if no current record)
                if [[ "$line" =~ ^0x[0-9a-fA-F]+ ]] || ([[ "$line" =~ ^[A-Za-z0-9] ]] && [[ -z "$current_record" ]]); then
                    # Process previous record if exists
                    if [[ -n "$current_record" ]]; then
                        process_record "$current_record"
                    fi
                    # Start new record
                    current_record="$line"
                # Continuation line - starts with spaces
                elif [[ "$line" =~ ^[[:space:]]+ ]] && [[ -n "$current_record" ]]; then
                    # Remove leading whitespace and append
                    continuation=$(echo "$line" | sed 's/^[[:space:]]*//')
                    current_record="$current_record $continuation"
                # Other lines
                else
                    if [[ -n "$current_record" ]]; then
                        process_record "$current_record"
                    fi
                    current_record="$line"
                fi
            fi
        done < "$temp_file"
        
        # Process final record
        if [[ -n "$current_record" ]] && [[ "$in_data" == true ]]; then
            process_record "$current_record"
        fi
        
    } > "$output_file"
    
    # Clean up temporary file
    rm -f "$temp_file"
    
    # Validate output
    local line_count=$(wc -l < "$output_file")
    if [[ $line_count -le 1 ]]; then
        echo "Warning: CSV conversion resulted in no data rows for $plugin"
        return 1
    else
        echo "Success: Converted $plugin to CSV with $((line_count - 1)) data rows"
        return 0
    fi
}

# Function to process a single record
process_record() {
    local record="$1"
    
    # Skip empty records
    if [[ -z "$record" ]]; then
        return
    fi
    
    # Clean up the record - trim leading/trailing spaces
    record=$(echo "$record" | sed 's/^[[:space:]]*//; s/[[:space:]]*$//')
    
    # Handle empty fields (single dash surrounded by spaces)
    record=$(echo "$record" | sed 's/ - / EMPTY /g')
    
    # Convert multiple spaces to commas - THIS IS THE KEY FIX
    record=$(echo "$record" | sed -E 's/[[:space:]]{2,}/,/g')
    
    # Clean up empty field markers
    record=$(echo "$record" | sed 's/,EMPTY,/,,/g; s/^EMPTY,/,/; s/,EMPTY$/,/')
    
    # Quote fields containing backslashes, colons, or remaining spaces
    # Split by comma and process each field
    IFS=',' read -ra fields <<< "$record"
    result=""
    
    for i in "${!fields[@]}"; do
        field="${fields[i]}"
        # Quote if contains backslashes, colons, or spaces
        if [[ "$field" =~ [\\:[:space:]] ]] && [[ ! "$field" =~ ^\".*\"$ ]]; then
            field="\"$field\""
        fi
        if [[ $i -eq 0 ]]; then
            result="$field"
        else
            result="$result,$field"
        fi
    done
    
    echo "$result"
}

# Function to process all text files for a memory dump
process_memory_dump() {
    local dump_dir="$1"
    local dump_name=$(basename "$dump_dir")
    
    echo ""
    echo "Processing memory dump: $dump_name"
    echo "Input directory: $dump_dir"
    
    # Create output directory for this dump
    local output_dump_dir="$OUTPUT_DIR/$dump_name"
    mkdir -p "$output_dump_dir"
    
    local success_count=0
    local fail_count=0
    
    # Process each text file
    for txt_file in "$dump_dir"/*.txt; do
        if [[ -f "$txt_file" ]]; then
            local plugin=$(basename "$txt_file" .txt)
            local csv_file="$output_dump_dir/${plugin}.csv"
            
            echo "  Converting $plugin..."
            
            if convert_to_csv_simple "$txt_file" "$csv_file" "$plugin" "$dump_name"; then
                ((success_count++))
                echo "    ✅ $plugin -> $(basename "$csv_file")"
                
                # Show sample of output for verification
                local sample_line=$(head -3 "$csv_file" | tail -1 | cut -c1-80)
                echo "    📋 Sample: ${sample_line}..."
                
                # Show field count
                local field_count=$(head -3 "$csv_file" | tail -1 | tr ',' '\n' | wc -l)
                echo "    📊 Fields: $field_count"
            else
                ((fail_count++))
                echo "    ❌ $plugin -> conversion failed"
                # Remove empty or invalid CSV files
                [[ -f "$csv_file" ]] && rm -f "$csv_file"
            fi
        fi
    done
    
    echo ""
    echo "Results for $dump_name:"
    echo "  Successful conversions: $success_count"
    echo "  Failed conversions: $fail_count"
    echo "  Output directory: $output_dump_dir"
}

# Main processing loop
echo "Scanning for memory dump directories..."

if [[ ! -d "$INPUT_DIR" ]]; then
    echo "Error: Input directory $INPUT_DIR does not exist"
    echo "Please run the Rekall analysis script first to generate text output files"
    exit 1
fi

processed_count=0
total_success=0

# Process each memory dump directory
for dump_dir in "$INPUT_DIR"/*; do
    if [[ -d "$dump_dir" ]]; then
        process_memory_dump "$dump_dir"
        ((processed_count++))
        
        # Count files in output directory
        csv_count=$(find "$OUTPUT_DIR/$(basename "$dump_dir")" -name "*.csv" 2>/dev/null | wc -l)
        total_success=$((total_success + csv_count))
    fi
done

echo ""
echo "================================================================================"
echo "CONVERSION COMPLETE"
echo "================================================================================"
echo "Processed $processed_count memory dump directories"
echo "Total CSV files created: $total_success"
echo "Output location: $OUTPUT_DIR"
echo ""
echo "CSV files are organized by memory dump:"
for dump_dir in "$OUTPUT_DIR"/*; do
    if [[ -d "$dump_dir" ]]; then
        csv_count=$(find "$dump_dir" -name "*.csv" 2>/dev/null | wc -l)
        echo "  $(basename "$dump_dir"): $csv_count CSV files"
    fi
done
echo ""
echo "Key features of this simple version:"
echo "- Uses sed with reliable regex: s/[[:space:]]{2,}/,/g"
echo "- Handles headers and dash separation correctly"
echo "- Processes multi-line entries (wrapped paths)"
echo "- Shows field count for verification"
echo "- Pure bash/sed implementation (no complex AWK)"