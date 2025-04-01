#!/bin/bash

# Define the root directory for the repository
# Ensure correct filepath assigned when referenced
SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"  # Resolves full path
REPO_ROOT_DIR="$(realpath "$SCRIPT_DIR/..")"
REPO_ROOT="$(realpath "$REPO_ROOT_DIR/data_store/processed"

# Function to generate a structured directory tree
generate_tree() {
    local dir="$1"
    echo "${dir#./}"  # Print the root directory without "./"

    find "$dir" -print | sed -E '
        s|/([0-9]{14})|/yyyymmddhhmmss|g;  # Replace timestamps in folder names
        s/^([0-9]{14})_/yyyymmddhhmmss_/g; # Replace timestamps in filenames
    ' | awk -v root="$dir" '
    BEGIN {
        last_depth = -1;
    }
    {
        # Remove the root directory prefix from the path
        sub("^" root "/", "", $0);

        # Count depth by number of slashes
        depth = gsub(/\//, "/");

        # Generate indentation based on depth
        indent = "";
        for (i = 0; i < depth; i++) {
            indent = indent "│   ";
        }

        # Determine whether to use ├── or └──
        if (depth > last_depth) {
            prefix = "├── ";
        } else {
            prefix = "└── ";
        }

        # Print formatted structure
        print indent prefix $0;

        # If depth decreases, add a blank spacer to separate directories
        if (depth < last_depth) {
            print "";
        }

        # Update tracking variable
        last_depth = depth;
    }'
}

# Generate the formatted directory tree
generate_tree "$REPO_ROOT"