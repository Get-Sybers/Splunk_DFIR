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

# Anonymous volumes have to be identified BEFORE the container is removed —
# once it is gone, nothing links them back to Splunk. The image declares its
# own VOLUMEs, so a deploy that does not explicitly mount over them leaves an
# anonymous volume behind on every `docker rm`. Anonymous volume names are
# 64-hex; the named index volume is handled separately below.
ANON_VOLUMES=""
if docker inspect "$SPLUNK_CONTAINER" >/dev/null 2>&1; then
    ANON_VOLUMES=$(docker inspect -f \
        '{{range .Mounts}}{{if eq .Type "volume"}}{{.Name}}{{"\n"}}{{end}}{{end}}' \
        "$SPLUNK_CONTAINER" 2>/dev/null | grep -E '^[0-9a-f]{64}$' || true)
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

# Remove exactly the anonymous volumes this container owned — captured above,
# while the container still existed.
#
# This used to run `docker volume rm` over `docker volume ls -qf dangling=true`,
# which is EVERY dangling volume on the host, not Splunk's. On a machine with
# other Docker work that silently destroyed unrelated data, while the message
# said "related to Splunk". Narrowed deliberately.
if [[ -n "$ANON_VOLUMES" ]]; then
    echo -e "\n🧹 Removing anonymous volumes owned by the container..."
    while IFS= read -r vol; do
        [[ -z "$vol" ]] && continue
        docker volume rm "$vol" >/dev/null 2>&1 \
            && echo "   ✅ ${vol:0:12}" \
            || echo "   ⚠️  ${vol:0:12} — still in use, left alone"
    done <<< "$ANON_VOLUMES"
fi

# Older deploys (before the named-volume fix) orphaned their anonymous volumes
# on every `docker rm`, so there may be a pile of them holding old index data.
# They are REPORTED, not removed: nothing distinguishes them from another
# project's volumes once their container is gone, and guessing is how the
# blanket version above destroyed unrelated data.
DANGLING_COUNT=$(docker volume ls -qf dangling=true 2>/dev/null | wc -l | tr -d ' ')
if [[ "${DANGLING_COUNT:-0}" -gt 0 ]]; then
    echo -e "\nℹ️  $DANGLING_COUNT dangling Docker volume(s) exist on this host."
    echo "   Deploys before the named-volume fix orphaned one per redeploy, so"
    echo "   some may be old Splunk indexes taking up disk. They are NOT removed"
    echo "   here — they cannot be told apart from other projects' volumes."
    echo ""
    echo "   Review:  docker volume ls -qf dangling=true"
    echo "   Inspect: docker volume inspect <name>"
    echo "   Remove:  docker volume prune     ⚠️  affects ALL projects on this host"
fi

echo -e "\n✅ Splunk container and indexes have been purged."