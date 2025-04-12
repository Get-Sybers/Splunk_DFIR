#!/bin/bash

# Ensure correct filepath assigned when referenced
SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"  # Resolves full path
REPO_ROOT_DIR="$(realpath "$SCRIPT_DIR/..")"

# Change all instances of disabled = true in splunk/etc/system/local/inputs.conf to disabled = false
INPUTS_CONF_PATH="$REPO_ROOT_DIR/splunk/etc/system/local/inputs.conf"

# Check if the file exists
if [ ! -f "$INPUTS_CONF_PATH" ]; then
    echo "Error: inputs.conf file not found at $INPUTS_CONF_PATH"
    exit 1
fi

# Replace all instances of "disabled = true" with "disabled = false"
sed -i 's/disabled = true/disabled = false/g' "$INPUTS_CONF_PATH"

# Count the number of replacements made
REPLACEMENTS=$(grep -c "disabled = false" "$INPUTS_CONF_PATH")
echo "Enabled $REPLACEMENTS inputs in $INPUTS_CONF_PATH"

echo "All Splunk inputs have been enabled successfully."