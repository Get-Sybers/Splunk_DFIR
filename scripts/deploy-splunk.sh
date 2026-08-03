#!/bin/bash

# Ensure correct filepath assigned when referenced
SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"  # Resolves full path
REPO_ROOT_DIR="$(realpath "$SCRIPT_DIR/..")"

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

# Make sure all items in SPLUNK_DFIR/splunk and accessible by splunk
echo "⚙️ Setting permissions of Splunk_DFIR/splunk/etc/* to $(whoami):docker and 777"
sudo chown -R $(whoami):docker $REPO_ROOT_DIR/splunk/*
sudo chmod -R 777 $REPO_ROOT_DIR/splunk/*
echo "⚙️ Setting permissions of $REPO_ROOT_DIR/data_store/* to $(whoami):docker and 777"
sudo chown -R $(whoami):docker $REPO_ROOT_DIR/data_store/*
sudo chmod -R 777 $REPO_ROOT_DIR/data_store/*
echo "⚙️ Setting permissions of $REPO_ROOT_DIR/ansible/* to $(whoami):docker and 777"
sudo chown -R $(whoami):docker $REPO_ROOT_DIR/ansible/*
sudo chmod -R 777 $REPO_ROOT_DIR/ansible/*

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

# Run Splunk Enterprise container with ansible_pre_tasks defined
docker run -d --name splunk-enterprise \
    --hostname splunk-enterprise \
    -p 8088:8088 \
    -p 8000:8000 \
    -v "$REPO_ROOT_DIR/splunk/etc":/data/etc:ro \
    -v "$REPO_ROOT_DIR/splunk/var":/data/var \
    -v "$REPO_ROOT_DIR/data_store/processed":/data/processed:ro \
    -v "$REPO_ROOT_DIR/ansible/playbooks":/data/ansible/playbooks:ro \
    -e SPLUNK_HTTP_ENABLESSL=true \
    -e SPLUNK_PASSWORD="$SPLUNK_PASSWORD" \
    -e SPLUNK_GENERAL_TERMS=--accept-sgt-current-at-splunk-com \
    -e SPLUNK_START_ARGS=--accept-license \
    -e SPLUNK_DISABLE_POPUPS='True' \
    -e SPLUNK_ROLE=splunk_standalone \
    -e SPLUNK_ANSIBLE_PRE_TASKS="$ANSIBLE_PRE_TASKS" \
    splunk/splunk:latest

# 🪵 Stream all logs immediately in background
docker logs -f splunk-enterprise &

# ⏳ In parallel, wait until Ansible is complete
echo "⏳ Waiting for Ansible to complete inside container..."

timeout=60
elapsed=0
interval=1

while ! docker logs splunk-enterprise 2>&1 | grep -q "Ansible playbook complete, will begin streaming splunkd_stderr.log"; do
    sleep $interval
    ((elapsed+=interval))
    if [[ $elapsed -ge $timeout ]]; then
        echo "❌ Timeout waiting for Ansible playbook to complete."
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


# Ensure the container is running before proceeding
if ! docker ps --format '{{.Names}}' | grep -q "splunk-enterprise"; then
    echo "❌ Error: Splunk container failed to start!"
    exit 1
fi

echo "✅ Splunk container setup completed successfully!"