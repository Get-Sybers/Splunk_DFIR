#!/bin/bash

set -e  # Exit on error
set -o pipefail  # Exit if any command in a pipeline fails
set -u  # Treat unset variables as an error

# Ensure correct filepath assigned when referenced
SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"
REPO_ROOT_DIR="$(realpath "$SCRIPT_DIR/..")"

# Function to check if a command exists
command_exists() {
    command -v "$1" &> /dev/null
}

# Ask if the user intends to use this setup offline
read -p "Do you intend to use this setup offline? (yes/no): " USE_OFFLINE

### Install Docker securely
if ! command_exists docker; then
    echo "🔹 Docker is not installed. Proceeding with secure installation..."

    # Install prerequisites
    sudo apt-get update
    sudo apt-get install -y ca-certificates curl gnupg

    # Ensure keyrings directory exists
    sudo install -m 0755 -d /etc/apt/keyrings

    # Fetch and verify Docker GPG key
    DOCKER_GPG_KEY="/etc/apt/keyrings/docker.gpg"
    sudo curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o "$DOCKER_GPG_KEY"
    echo "🔹 Verifying Docker GPG key..."
    gpg --show-keys "$DOCKER_GPG_KEY"

    # Add Docker repository securely
    echo "🔹 Adding the Docker repository..."
    echo "deb [arch=$(dpkg --print-architecture) signed-by=$DOCKER_GPG_KEY] \
    https://download.docker.com/linux/debian $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
    sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

    # Install Docker with version locking
    echo "🔹 Installing Docker with verified packages..."
    sudo apt-get update
    DOCKER_VERSION=$(apt-cache madison docker-ce | awk '{print $3}' | head -n 1)
    sudo apt-get install -y docker-ce=$DOCKER_VERSION docker-ce-cli=$DOCKER_VERSION containerd.io

    echo "✅ Docker installation complete."
else
    echo "✅ Docker is already installed. Skipping installation."
fi

### Ensure docker group exists
if ! getent group docker > /dev/null; then
    echo "🔹 Creating 'docker' group..."
    sudo groupadd docker
fi

# Prompt user before adding them to the 'docker' group
if ! groups | grep -q '\bdocker\b'; then
    read -p "Would you like to add $(whoami) to the 'docker' group? This allows running Docker without sudo. (yes/no): " ADD_USER
    if [[ "$ADD_USER" == "yes" ]]; then
        sudo usermod -aG docker $USER
        echo "⚠️  You must log out and back in (or restart your session) for changes to take effect."
        echo "Alternatively, run: newgrp docker"
        exit 1
    else
        echo "🔹 Skipping 'docker' group addition. You will need sudo to run Docker commands."
    fi
else
    echo "✅ User $(whoami) is already in the 'docker' group."
fi

### Handle offline mode
if [[ "$USE_OFFLINE" == "yes" ]]; then
    echo "🔹 Preparing Docker images for offline use..."
    mkdir -p "$REPO_ROOT_DIR/offline_container_tarballs"

    IMAGES=(
        "log2timeline/plaso:latest"
        "zeek/zeek:latest"
        "splunk/splunk:latest"
    )

    export DOCKER_CONTENT_TRUST=1  # Enable Docker image verification

    for IMAGE in "${IMAGES[@]}"; do
        IMAGE_NAME=$(echo "$IMAGE" | sed 's/[:\/]/_/g').tar
        if [ -f "$REPO_ROOT_DIR/offline_container_tarballs/$IMAGE_NAME" ]; then
            echo "✅ Image $IMAGE already exists in offline storage. Skipping download."
        else
            echo "🔹 Pulling $IMAGE with verification..."
            docker pull "$IMAGE"
            echo "🔹 Saving $IMAGE for offline use..."
            docker save -o "$REPO_ROOT_DIR/offline_container_tarballs/$IMAGE_NAME" "$IMAGE"
        fi
    done

    echo "🔹 Checking for missing images in the Docker daemon..."
    MISSING_IMAGES=()
    for IMAGE in "${IMAGES[@]}"; do
        if ! docker images --format "{{.Repository}}:{{.Tag}}" | grep -q "^$IMAGE$"; then
            echo "⚠️  Image $IMAGE is missing from the daemon."
            MISSING_IMAGES+=("$IMAGE")
        else
            echo "✅ Image $IMAGE is already loaded in the daemon."
        fi
    done

    if [ ${#MISSING_IMAGES[@]} -gt 0 ]; then
        echo "🔹 Loading missing images into the Docker daemon..."
        for IMAGE in "${MISSING_IMAGES[@]}"; do
            IMAGE_TAR=$(echo "$IMAGE" | sed 's/[:\/]/_/g').tar
            echo "🔹 Loading $IMAGE from offline tarball..."
            docker load -i "$REPO_ROOT_DIR/offline_container_tarballs/$IMAGE_TAR"
        done
    else
        echo "✅ All images are already present in the Docker daemon."
    fi

    echo "✅ Offline image setup complete."
fi

### Set permissions for Splunk_DFIR/splunk/etc securely
if [ -d "$REPO_ROOT_DIR/splunk/etc" ]; then
    echo "🔹 Setting permissions for Splunk_DFIR/splunk/etc/*..."
    sudo chown -R $(whoami):docker "$REPO_ROOT_DIR/splunk/etc"
    sudo chmod -R 770 "$REPO_ROOT_DIR/splunk/etc"  # More restrictive permissions
else
    echo "⚠️  Directory $REPO_ROOT_DIR/splunk/etc does not exist. Skipping permission changes."
fi

echo "✅ Docker setup complete. You can now use Docker."