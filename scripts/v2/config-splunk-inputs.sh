#!/bin/bash

# Ensure correct filepath assigned when referenced
SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"  # Resolves full path
REPO_ROOT_DIR="$(realpath "$SCRIPT_DIR/../..")"

# Set the inputs.conf path
INPUTS_CONF_PATH="$REPO_ROOT_DIR/splunk/etc/system/local/inputs.conf"

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

# Check if the file exists
if [ ! -f "$INPUTS_CONF_PATH" ]; then
    echo "❌ Error: inputs.conf file not found at $INPUTS_CONF_PATH"
    exit 1
fi

# Function to show usage
show_usage() {
    echo "Usage: $0 [--enable|--disable]"
    echo ""
    echo "Options:"
    echo "  --enable   Enable all Splunk inputs (set disabled = false)"
    echo "  --disable  Disable all Splunk inputs (set disabled = true)"
    echo ""
    echo "Examples:"
    echo "  $0 --disable    # Disable all inputs"
    echo "  $0 --enable     # Enable all inputs"
    exit 1
}

# Function to disable inputs
disable_inputs() {
    echo "🔄 Disabling all Splunk inputs in inputs.conf..."
    
    # Replace all instances of "disabled = false" with "disabled = true"
    sed -i 's/disabled = false/disabled = true/g' "$INPUTS_CONF_PATH"
    
    # Count the number of disabled inputs
    DISABLED_COUNT=$(grep -c "disabled = true" "$INPUTS_CONF_PATH")
    
    echo "✅ Disabled $DISABLED_COUNT inputs in inputs.conf"
    echo ""
    echo "📋 Current status:"
    grep -n "disabled =" "$INPUTS_CONF_PATH" | head -10
    if [ $(grep -c "disabled =" "$INPUTS_CONF_PATH") -gt 10 ]; then
        echo "   ... and $(( $(grep -c "disabled =" "$INPUTS_CONF_PATH") - 10 )) more"
    fi
}

# Function to enable inputs
enable_inputs() {
    echo "🔄 Enabling all Splunk inputs in inputs.conf..."
    
    # Replace all instances of "disabled = true" with "disabled = false"
    sed -i 's/disabled = true/disabled = false/g' "$INPUTS_CONF_PATH"
    
    # Count the number of enabled inputs
    ENABLED_COUNT=$(grep -c "disabled = false" "$INPUTS_CONF_PATH")
    
    echo "✅ Enabled $ENABLED_COUNT inputs in inputs.conf"
    echo ""
    echo "📋 Current status:"
    grep -n "disabled =" "$INPUTS_CONF_PATH" | head -10
    if [ $(grep -c "disabled =" "$INPUTS_CONF_PATH") -gt 10 ]; then
        echo "   ... and $(( $(grep -c "disabled =" "$INPUTS_CONF_PATH") - 10 )) more"
    fi
}

# Function to show current status
show_status() {
    echo "📊 Current Splunk inputs status:"
    echo ""
    
    ENABLED_COUNT=$(grep -c "disabled = false" "$INPUTS_CONF_PATH")
    DISABLED_COUNT=$(grep -c "disabled = true" "$INPUTS_CONF_PATH")
    TOTAL_COUNT=$((ENABLED_COUNT + DISABLED_COUNT))
    
    echo "   ✅ Enabled:  $ENABLED_COUNT inputs"
    echo "   ❌ Disabled: $DISABLED_COUNT inputs"
    echo "   📊 Total:    $TOTAL_COUNT inputs"
    echo ""
    
    if [ $TOTAL_COUNT -gt 0 ]; then
        echo "📋 Input details:"
        grep -B1 -A1 "disabled =" "$INPUTS_CONF_PATH" | grep -E "^\[|disabled =" | while read line; do
            if [[ $line =~ ^\[ ]]; then
                INPUT_NAME=$(echo "$line" | tr -d '[]')
                echo -n "   $INPUT_NAME: "
            elif [[ $line =~ disabled ]]; then
                if [[ $line =~ "disabled = false" ]]; then
                    echo "✅ ENABLED"
                else
                    echo "❌ DISABLED"
                fi
            fi
        done
    fi
}

# Parse command line arguments
case "$1" in
    --enable)
        enable_inputs
        echo ""
        echo "⚠️  Note: You may need to restart Splunk for changes to take effect:"
        echo "   docker restart splunk-enterprise"
        ;;
    --disable)
        disable_inputs
        echo ""
        echo "⚠️  Note: You may need to restart Splunk for changes to take effect:"
        echo "   docker restart splunk-enterprise"
        ;;
    --status)
        show_status
        ;;
    *)
        show_status
        echo ""
        show_usage
        ;;
esac