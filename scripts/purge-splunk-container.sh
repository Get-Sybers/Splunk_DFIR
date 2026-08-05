#!/bin/bash

# Ensure correct filepath assigned when referenced
SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"  # Resolves full path
REPO_ROOT_DIR="$(realpath "$SCRIPT_DIR/..")"

# Shared with the deploy scripts — used here for dl_purge_dir_contents, which
# spares .gitkeep and REPORTS a failed delete instead of printing success over
# indexes that are still on disk.
# shellcheck source=lib/docker-lifecycle.sh
source "$SCRIPT_DIR/lib/docker-lifecycle.sh"

SPLUNK_CONTAINER="splunk-enterprise"

# Index data lives in a named Docker volume by default. These must match
# deploy-splunk.sh, or the purge silently leaves every index behind.
SPLUNK_VAR_VOLUME="${SPLUNK_VAR_VOLUME:-splunk-dfir-var}"

# If the deploy was run with --var-dir / SPLUNK_VAR_DIR, indexes are in a host
# directory instead. Set the same value here and both get cleaned.
SPLUNK_VAR_DIR="${SPLUNK_VAR_DIR:-}"

# The repo's own splunk/var — the location this project was originally built
# around. Always checked, so a checkout that used --var-dir ./splunk/var (or the
# pre-fix layout) gets cleaned up whether or not SPLUNK_VAR_DIR is set here.
LEGACY_VAR_DIR="$(realpath "$REPO_ROOT_DIR/splunk/var" 2>/dev/null || echo "")"

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
read -r -p "Are you absolutely sure you want to PURGE the container and all indexes? (yes/no): " CONFIRMATION

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

# Host index directories: whatever --var-dir was pointed at, plus the repo's own
# splunk/var. dl_purge_dir_contents deletes CONTENTS rather than the directory
# (it may be a mount point), spares the tracked .gitkeep, and reports failure —
# this used to swallow a failed sudo and print success over surviving indexes.
purge_failures=0
cleared_dirs=""
for d in "$SPLUNK_VAR_DIR" "$LEGACY_VAR_DIR"; do
    [[ -n "$d" && -d "$d" ]] || continue
    case "$cleared_dirs" in *"|$d|"*) continue ;; esac   # both may point at the same path
    cleared_dirs="$cleared_dirs|$d|"
    [[ -n "$(ls -A "$d" 2>/dev/null)" ]] || continue
    echo -e "\n🧹 Clearing index directory: $d..."
    dl_purge_dir_contents "$d" || purge_failures=1
done

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

if [[ "$purge_failures" == "1" ]]; then
    echo -e "\n❌ Purge finished with errors — at least one index directory could"
    echo "   not be emptied. Its indexes are still on disk."
    exit 1
fi
echo -e "\n✅ Splunk container and indexes have been purged."