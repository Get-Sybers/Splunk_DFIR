#!/bin/bash

# Ensure correct filepath assigned when referenced
SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"  # Resolves full path
REPO_ROOT_DIR="$(realpath "$SCRIPT_DIR/..")"

SPLUNK_CONTAINER="splunk-enterprise"
SPLUNK_VAR_DIR="$(realpath "$REPO_ROOT_DIR/splunk/var")"

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

echo "$REPO_ROOT_DIR"

echo -e "⚠️ WARNING: This will stop and remove the Splunk container, and DELETE all Splunk indexes."
echo -e "❌ This action CANNOT be undone."

# Ask for confirmation
read -p "Are you absolutely sure you want to PURGE the container and all indexes? (yes/no): " CONFIRMATION

# Check user input
if [[ "$CONFIRMATION" != "yes" ]]; then
    echo -e "\n🚫 Operation canceled. Your Splunk indexes are SAFE."
    echo "📂 You can find your indexes in: Splunk_DFIR/splunk/var"
    exit 0
fi

echo -e "\n🛑 Stopping and removing the Splunk container: $SPLUNK_CONTAINER..."
docker stop "$SPLUNK_CONTAINER"
docker rm "$SPLUNK_CONTAINER"

echo -e "\n🧹 Purging all Splunk index data from: $SPLUNK_VAR_DIR..."
sudo rm -rf "$SPLUNK_VAR_DIR"/*

echo -e "\n✅ Splunk container and indexes have been purged."