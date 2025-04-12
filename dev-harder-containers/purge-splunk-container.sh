#!/bin/bash
# Ensure correct filepath assigned when referenced
SCRIPT_DIR="$(dirname "$(readlink -f "$0")")" # Resolves full path
REPO_ROOT_DIR="$(realpath "$SCRIPT_DIR/..")"
SPLUNK_CONTAINER="splunk-enterprise"
SPLUNK_VOLUME="splunk_data"

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
echo ""

echo -e "⚠️ WARNING: This will stop and remove the Splunk container, and DELETE the splunk_data volume."
echo -e "❌ This action CANNOT be undone. All Splunk indexes and configurations will be lost."

# Ask for confirmation
read -p "Are you absolutely sure you want to PURGE the container and the Splunk volume? (yes/no): " CONFIRMATION

# Check user input
if [[ "$CONFIRMATION" != "yes" ]]; then
    echo -e "\n🚫 Operation canceled. Your Splunk data is SAFE."
    echo "📂 Your data remains in the Docker volume: $SPLUNK_VOLUME"
    exit 0
fi

echo -e "\n🛑 Stopping and removing the Splunk container: $SPLUNK_CONTAINER..."
docker stop "$SPLUNK_CONTAINER" 2>/dev/null || echo "Container was not running."
docker rm "$SPLUNK_CONTAINER" 2>/dev/null || echo "Container did not exist or was already removed."

echo -e "\n🧹 Removing Splunk data volume: $SPLUNK_VOLUME..."

# Check if volume exists before attempting to remove it
if docker volume ls -q | grep -q "^$SPLUNK_VOLUME$"; then
    docker volume rm "$SPLUNK_VOLUME"
    echo -e "✅ Volume $SPLUNK_VOLUME has been removed."
else
    echo -e "⚠️ Volume $SPLUNK_VOLUME did not exist."
fi

# Create a fresh volume
echo -e "\n🆕 Creating a fresh $SPLUNK_VOLUME volume..."
docker volume create "$SPLUNK_VOLUME"

# Create initial directory structure in the new volume
echo -e "📁 Setting up initial directory structure in new volume..."
docker run --rm -v "$SPLUNK_VOLUME":/data alpine sh -c 'mkdir -p /data/etc /data/var /data/ansible'

echo -e "\n✅ Splunk container and volume have been purged. A fresh volume has been created."
echo -e "🔄 You can now run the deploy-splunk.sh script to set up a new Splunk instance."