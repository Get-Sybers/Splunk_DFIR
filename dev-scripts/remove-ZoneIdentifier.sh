#!/bin/bash

# Define the root directory for the repository
# Ensure correct filepath assigned when referenced
SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"  # Resolves full path
REPO_ROOT_DIR="$(realpath "$SCRIPT_DIR/..")"

# Function to remove Zone.Identifier files recursively
remove_zone_identifiers() {
    local target_dir="$1"
    
    ## Print zone identifier files found
    echo "Searching for Zone.Identifier files in $target_dir..."
    # This find command is already recursive - it will search through all subdirectories
    zone_files=($(find "$target_dir" -name "*_Zone.Identifier" 2>/dev/null))
    
    if [ ${#zone_files[@]} -eq 0 ]; then
        echo "No Zone.Identifier files found."
        exit 0
    fi
    
    echo "Found ${#zone_files[@]} Zone.Identifier files:"
    for file in "${zone_files[@]}"; do
        # Extract the parent file name
        parent_file="${file%:Zone.Identifier}"
        echo "  - $file (attached to: $parent_file)"
    done
    
    ## prompt user if they wish to remove
    echo ""
    read -p "Do you want to remove these Zone.Identifier files? (y/n): " confirm
    
    ### If yes remove
    if [[ "$confirm" =~ ^[Yy]$ ]]; then
        echo "Removing Zone.Identifier files..."
        for file in "${zone_files[@]}"; do
            rm -f "$file"
            echo "Removed: $file"
        done
        echo "All Zone.Identifier files have been removed."
    ### If no exit
    else
        echo "Operation cancelled. No files were removed."
        exit 0
    fi
}

# Execute the function with the repository root directory
remove_zone_identifiers "$REPO_ROOT_DIR"
