#!/bin/bash

set -o pipefail

# Ensure correct filepath assigned when referenced
SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"  # Resolves full path
REPO_ROOT_DIR="$(realpath "$SCRIPT_DIR/..")"

SPLUNK_CONTAINER="splunk-enterprise"

# Splunk's index data lives in /opt/splunk/var inside the container. It is kept
# in a named Docker volume so it survives `docker rm`. This used to bind-mount
# $REPO_ROOT_DIR/splunk/var at /data/var — a path Splunk never reads — which
# meant every index was destroyed with the container. A named volume is used
# rather than a bind mount because Docker seeds it from the image on first use,
# preserving the container's splunk-user ownership; a host bind mount over
# /opt/splunk/var starts empty and breaks startup on a UID mismatch.
SPLUNK_VAR_VOLUME="${SPLUNK_VAR_VOLUME:-splunk-dfir-var}"

# How long to wait for the container's internal Ansible run to finish. The
# first run also pulls the image, so this needs to be generous.
SPLUNK_READY_TIMEOUT="${SPLUNK_READY_TIMEOUT:-600}"

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

# 🚨 Refuse to collide with an existing container.
#
# Previously this script ran `docker run --name splunk-enterprise` with no
# check. On a second run docker failed with a name conflict, and because there
# is no `set -e` the script carried on and waited for readiness by grepping
# `docker logs splunk-enterprise` — the OLD container — found the completion
# string immediately, and exited 0 having deployed nothing at all.
if docker ps -a --format '{{.Names}}' | grep -qx "$SPLUNK_CONTAINER"; then
    echo "⚠️  A container named '$SPLUNK_CONTAINER' already exists."
    docker ps -a --filter "name=^${SPLUNK_CONTAINER}$" --format '   {{.Names}}  {{.Status}}  ({{.Image}})'
    echo ""
    echo "   Index data lives in the '$SPLUNK_VAR_VOLUME' volume and is NOT removed by this."
    echo "   To delete indexes as well, use scripts/purge-splunk-container.sh."
    echo ""
    read -p "Remove the existing container and redeploy? [y/N]: " replace_existing
    if [[ "${replace_existing,,}" != "y" && "${replace_existing,,}" != "yes" ]]; then
        echo "🚫 Aborting. Existing container left untouched."
        exit 1
    fi
    echo "🛑 Removing existing container..."
    docker rm -f "$SPLUNK_CONTAINER" >/dev/null || {
        echo "❌ Could not remove '$SPLUNK_CONTAINER'. Aborting."
        exit 1
    }
    echo "✅ Removed."
    echo ""
fi

# Function to securely prompt for password and confirm it
while true; do
    read -s -p "Enter Splunk admin password (or press Ctrl+C to exit): " SPLUNK_PASSWORD
    echo  # Move to a new line

    # Check if input is empty
    if [[ -z "$SPLUNK_PASSWORD" ]]; then
        echo "❌ No password entered. Exiting..."
        exit 1
    fi

    read -s -p "Confirm Splunk admin password: " SPLUNK_PASSWORD_CONFIRM
    echo  # Move to a new line

    # Check if input is empty
    if [[ -z "$SPLUNK_PASSWORD_CONFIRM" ]]; then
        echo "❌ No password entered. Exiting..."
        exit 1
    fi

    if [[ "$SPLUNK_PASSWORD" == "$SPLUNK_PASSWORD_CONFIRM" ]]; then
        echo "✅ Password confirmed."
        break
    else
        echo "❌ Passwords do not match. Please try again."
    fi
done

# Make sure all items in SPLUNK_DFIR/splunk are accessible by splunk.
#
# These paths were previously unquoted. A repository path containing a space
# would word-split and send a recursive, privileged chown/chmod at unintended
# targets. The directory is quoted; the trailing /* is left outside the quotes
# so the glob still expands.
#
# NOTE: 0777 is a workaround for the container/host UID mismatch, not a fix.
# Don't run this on a shared host. Tracked in project-progress.md.
SPLUNK_OWNER="$(whoami):docker"

echo "⚙️ Setting permissions of Splunk_DFIR/splunk/* to $SPLUNK_OWNER and 777"
sudo chown -R "$SPLUNK_OWNER" "$REPO_ROOT_DIR"/splunk/*
sudo chmod -R 777 "$REPO_ROOT_DIR"/splunk/*
echo "⚙️ Setting permissions of $REPO_ROOT_DIR/data_store/* to $SPLUNK_OWNER and 777"
sudo chown -R "$SPLUNK_OWNER" "$REPO_ROOT_DIR"/data_store/*
sudo chmod -R 777 "$REPO_ROOT_DIR"/data_store/*
echo "⚙️ Setting permissions of $REPO_ROOT_DIR/ansible/* to $SPLUNK_OWNER and 777"
sudo chown -R "$SPLUNK_OWNER" "$REPO_ROOT_DIR"/ansible/*
sudo chmod -R 777 "$REPO_ROOT_DIR"/ansible/*

echo "🚀 Building Splunk Enterprise Docker container..."

echo "⚙️ Mounting:      $REPO_ROOT_DIR/splunk/etc --> /data/etc:ro"
echo "⚙️ Mounting:      $REPO_ROOT_DIR/splunk/var --> /data/var"
echo "⚙️ Mounting:      $REPO_ROOT_DIR/data_store/processed --> /data/processed:ro"
echo "⚙️ Mounting:      $REPO_ROOT_DIR/ansible/playbooks --> /data/ansible/playbooks:ro"
echo ""

# Define Ansible pre-tasks
ANSIBLE_PRE_TASKS="file:///data/ansible/playbooks/Include-Custom-Apps.yml,file:///data/ansible/playbooks/Include-local-conf.yml,file:///data/ansible/playbooks/remove_first_login.yml"

echo "📖 Queued Ansible Playbooks:"
IFS=',' read -ra TASKS <<< "$ANSIBLE_PRE_TASKS"
for task in "${TASKS[@]}"; do
    echo "📋 ${task#file:///data/ansible/playbooks/}"
done
echo "- find more @ $REPO_ROOT_DIR/ansible" 
sleep 3
echo ""

# insert memes
echo "🚀 docker go brrr"
echo "🫡 loading in your apps now with ansible"
sleep 0.1
echo "        ⠀  _______________  "
sleep 0.1
echo "        ⠀ /      ZERO      \ "
sleep 0.1
echo "        ⠀ |      SUGAR     |"
sleep 0.1
echo "        ⠀ |----------------|"
sleep 0.1
echo "        ⠀ |  ██        ██  |"   
sleep 0.1
echo "        ⠀ |  ████     ███  |"  
sleep 0.1
echo "        ⠀ |  █████   ██ ██ |"  
sleep 0.1
echo "        ⠀ |  ██  █████  ██ |" 
sleep 0.1
echo "        ⠀ |  ██   ████  ██ |"
sleep 0.1
echo "        ⠀ |  ██    ███  ██ |"
sleep 0.1
echo "        ⠀ |  ██    ███  ██ |"
sleep 0.1
echo "        ⠀ |  ██    ██   ██ |"
sleep 0.1
echo "        ⠀ |  ██    ██   ██ |"       
sleep 0.1
echo "        ⠀ |  ██     █   ██ |"
sleep 0.1
echo "          |________________|"
sleep 0.1
echo "        ⠀ |      MONSTER   |"
sleep 0.1
echo "        ⠀ |      ENERGY    |"
sleep 0.1
echo "        ⠀ |________________|"
sleep 0.1
echo "        ⠀ |       ZERO     |"
sleep 0.1
echo "        ⠀ |       ULTRA    |"
sleep 0.1
echo "        ⠀ \________________/"
sleep 1
echo
echo "done. punch it chewie 🧌"
echo

# Run Splunk Enterprise container with ansible_pre_tasks defined.
# Capture the container ID so readiness is checked against THIS container and
# never against a leftover one with the same name.
SPLUNK_CID=$(docker run -d --name "$SPLUNK_CONTAINER" \
    --hostname splunk-enterprise \
    -p 8088:8088 \
    -p 8000:8000 \
    -v "$REPO_ROOT_DIR/splunk/etc":/data/etc:ro \
    -v "$SPLUNK_VAR_VOLUME":/opt/splunk/var \
    -v "$REPO_ROOT_DIR/data_store/processed":/data/processed:ro \
    -v "$REPO_ROOT_DIR/ansible/playbooks":/data/ansible/playbooks:ro \
    -e SPLUNK_HTTP_ENABLESSL=true \
    -e SPLUNK_PASSWORD="$SPLUNK_PASSWORD" \
    -e SPLUNK_GENERAL_TERMS=--accept-sgt-current-at-splunk-com \
    -e SPLUNK_START_ARGS=--accept-license \
    -e SPLUNK_DISABLE_POPUPS='True' \
    -e SPLUNK_ROLE=splunk_standalone \
    -e SPLUNK_ANSIBLE_PRE_TASKS="$ANSIBLE_PRE_TASKS" \
    splunk/splunk:latest)

if [[ -z "$SPLUNK_CID" ]]; then
    echo "❌ docker run failed — no container was started."
    exit 1
fi
echo "🆔 Container: ${SPLUNK_CID:0:12}"

# 🪵 Stream all logs immediately in background
docker logs -f "$SPLUNK_CID" &

# ⏳ In parallel, wait until Ansible is complete
echo "⏳ Waiting for Ansible to complete inside container (timeout ${SPLUNK_READY_TIMEOUT}s)..."

timeout=$SPLUNK_READY_TIMEOUT
elapsed=0
interval=2

# Poll by container ID, not by name. Also bail out if the container dies —
# otherwise a crashed container looks identical to a slow one until timeout.
while ! docker logs "$SPLUNK_CID" 2>&1 | grep -q "Ansible playbook complete, will begin streaming splunkd_stderr.log"; do
    if [[ "$(docker inspect -f '{{.State.Running}}' "$SPLUNK_CID" 2>/dev/null)" != "true" ]]; then
        echo "❌ Container exited before Ansible finished (exit code $(docker inspect -f '{{.State.ExitCode}}' "$SPLUNK_CID" 2>/dev/null))."
        echo "   Logs:  docker logs ${SPLUNK_CID:0:12}"
        exit 1
    fi
    sleep $interval
    ((elapsed+=interval))
    if [[ $elapsed -ge $timeout ]]; then
        echo "❌ Timeout after ${timeout}s waiting for Ansible playbook to complete."
        echo "   Raise it with:  SPLUNK_READY_TIMEOUT=1200 $0"
        exit 1
    fi
done

# Step 3: Stream splunkd_stderr.log from inside the container in background
echo "✅ Ansible complete."
sleep 1
echo
echo "Splunk initialising..."
echo
echo "Splunk will be available at: https://localhost:8000"
echo


# Ensure the container is running before proceeding. Checked by ID so a
# same-named leftover cannot satisfy this.
if [[ "$(docker inspect -f '{{.State.Running}}' "$SPLUNK_CID" 2>/dev/null)" != "true" ]]; then
    echo "❌ Error: Splunk container failed to start!"
    exit 1
fi

echo "✅ Splunk container setup completed successfully!"
echo "📦 Index data persists in Docker volume: $SPLUNK_VAR_VOLUME"