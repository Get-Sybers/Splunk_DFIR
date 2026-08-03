#!/bin/bash

# Ensure correct filepath assigned when referenced
SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"  # Resolves full path
REPO_ROOT_DIR="$(realpath "$SCRIPT_DIR/..")"

SPLUNK_CONTAINER="splunk-enterprise"

# Index data lives in this named Docker volume (see deploy-splunk.sh). It must
# match SPLUNK_VAR_VOLUME there, or the purge silently leaves every index behind.
SPLUNK_VAR_VOLUME="${SPLUNK_VAR_VOLUME:-splunk-dfir-var}"

# Legacy host directory. Kept only so an existing checkout that still has data
# here gets cleaned up too; nothing writes to it any more.
SPLUNK_VAR_DIR="$(realpath "$REPO_ROOT_DIR/splunk/var" 2>/dev/null || echo "")"

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

echo -e "ℹ️  To purge as part of a redeploy instead, use: ./scripts/deploy-splunk.sh --purge"
echo ""
echo -e "⚠️ WARNING: This will stop and remove the Splunk container, and DELETE all Splunk indexes."
echo -e "❌ This action CANNOT be undone."

# Ask for confirmation
read -p "Are you absolutely sure you want to PURGE the container and all indexes? (yes/no): " CONFIRMATION

# Check user input
if [[ "$CONFIRMATION" != "yes" ]]; then
    echo -e "\n🚫 Operation canceled. Your Splunk indexes are SAFE."
    echo "📂 Your indexes are in the Docker volume: $SPLUNK_VAR_VOLUME"
    echo "   (inspect with: docker volume inspect $SPLUNK_VAR_VOLUME)"
    exit 0
fi

echo -e "\n🛑 Stopping and removing the Splunk container: $SPLUNK_CONTAINER..."
docker stop "$SPLUNK_CONTAINER" 2>/dev/null || echo "   (not running)"
docker rm "$SPLUNK_CONTAINER" 2>/dev/null || echo "   (no such container)"

# The index volume must be removed explicitly. `docker rm` on the container
# does not touch a named volume, so without this the purge would report success
# while every index survived.
echo -e "\n🧹 Removing Splunk index volume: $SPLUNK_VAR_VOLUME..."
if docker volume ls -q | grep -qx "$SPLUNK_VAR_VOLUME"; then
    docker volume rm "$SPLUNK_VAR_VOLUME" >/dev/null && echo "   ✅ Volume removed." \
        || echo "   ❌ Could not remove volume — is a container still using it?"
else
    echo "   ℹ️ Volume does not exist (nothing to remove)."
fi

# Legacy: older deployments bind-mounted splunk/var. Clean it if it holds data.
if [[ -n "$SPLUNK_VAR_DIR" && -d "$SPLUNK_VAR_DIR" ]] && [[ -n "$(ls -A "$SPLUNK_VAR_DIR" 2>/dev/null)" ]]; then
    echo -e "\n🧹 Clearing legacy index directory: $SPLUNK_VAR_DIR..."
    sudo rm -rf "${SPLUNK_VAR_DIR:?}"/*
fi

echo -e "\n🔍 Checking for dangling Docker volumes related to Splunk..."
# Identify and remove volumes related to the Splunk container
DANGLING_VOLUMES=$(docker volume ls -qf dangling=true)
if [ -n "$DANGLING_VOLUMES" ]; then
    echo -e "🗑️ Removing dangling Docker volumes..."
    echo "$DANGLING_VOLUMES" | xargs docker volume rm
    echo -e "✅ Dangling volumes removed."
else
    echo -e "ℹ️ No dangling volumes found."
fi

echo -e "\n✅ Splunk container and indexes have been purged."