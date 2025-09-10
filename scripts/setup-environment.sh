#!/bin/bash

################################################################################
# Establish Splunk_DFIR repo filepath
SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"
REPO_ROOT_DIR="$(realpath "$SCRIPT_DIR/..")"
DOCKER_TAR_DIR="$REPO_ROOT_DIR/data_store/docker_images"

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

# docker images to download
IMAGES=(
    "log2timeline/plaso:latest"
    "zeek/zeek:latest"
    "splunk/splunk:latest"
)

# Function to check for existing Docker tar balls
check_existing_tarballs() {
    if [ -d "$DOCKER_TAR_DIR" ] && [ "$(ls -A $DOCKER_TAR_DIR/*.tar 2>/dev/null)" ]; then
        return 0  # Tar balls exist
    else
        return 1  # No tar balls found
    fi
}

# Function to load existing Docker tar balls
load_existing_tarballs() {
    echo ""
    echo "📦 Found existing Docker tar balls in $DOCKER_TAR_DIR:"
    echo "───────────────────────────────────────────────────"
    ls -1 "$DOCKER_TAR_DIR"/*.tar 2>/dev/null | xargs -n1 basename
    echo "───────────────────────────────────────────────────"
    echo ""
    
    read -p "Would you like to load these existing Docker images? (y/n) " -n 1 -r
    echo -e "\n"
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🔄 Loading existing Docker images..."
        echo "───────────────────────────────────────────────────"
        
        # Process each tar file
        for tarfile in "$DOCKER_TAR_DIR"/*.tar; do
            if [ -f "$tarfile" ]; then
                echo "📦 Loading $(basename "$tarfile")..."
                if sudo docker load -i "$tarfile"; then
                    echo "✅ Successfully loaded $(basename "$tarfile")"
                else
                    echo "❌ Error loading $(basename "$tarfile")"
                fi
                echo "───────────────────────────────────────────"
            fi
        done
        
        echo "✨ Finished loading existing Docker images"
        return 0  # Images were loaded
    else
        echo "⏭️  Skipping existing Docker image loading"
        return 1  # User chose not to load
    fi
}

################################################################################
# 🚨 Check if running as root
if [[ "$EUID" -eq 0 ]]; then
    cat << "EOF"
        ⠀⠀⠀⠀⠀⠀⠀⣀⣀⣀⣀⣤⣤⣤⣤⣤⣤⣤⣀⡀⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⢀⣴⣿⣿⣿⠿⠟⠛⠉⠉⠀⠀⠉⠙⠻⢿⣷⣦⡀⠀⠀⠀
        ⠀⠀⠀⢠⣿⡿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⢿⣆⠀⠀
        ⠀⠀⢠⣿⠋⠀⠀⠀⣠⣶⣶⣶⣶⣶⣦⣄⠀⠀⠀⠀⠀⠀⠈⣿⣆⠀
        ⠀⢀⣿⠁⠀⠀⠀⠘⠛⠋⠁⠀⠀⠈⠉⠛⠀⠀⠀⠀⠀⠀⠀⢹⣿⠀
        ⠀⢸⣿⠀⠀⠀⢀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⠀⠀⠀⣿⡇
        ⠀⠈⢿⣧⠀⢀⡿⠛⠛⠃⠀⠀⠀⠀⠀⠀⠀⠘⠿⠟⠛⠂⠀⣼⡟⠀
        ⠀⠀⠀⠙⢿⣮⣅⣀⣀⣀⣀⣀⠀⠀⠀⠀⢀⣀⣀⣠⣤⣴⡾⠋⠀⠀

       🤨  NOT SURE IF YOU'RE SUPPOSED TO BE ROOT...
       ❌  OR YOU'RE ABOUT TO BREAK SOMETHING IMPORTANT

             This script doesn't need root, buddy.

EOF

    read -p "Are you *sure* you want to continue as root? [y/N]: " confirm_root
    confirm_root="${confirm_root,,}"  # to lowercase
    if [[ "$confirm_root" != "y" && "$confirm_root" != "yes" ]]; then
        echo "❌ Aborting to prevent running as root."
        exit 1
    fi
fi

################################################################################
# 🚨 Check if running as root
if [[ "$EUID" -eq 0 ]]; then
    cat << "EOF"
        ⠀⠀⠀⠀⠀⠀⠀⣀⣀⣀⣀⣤⣤⣤⣤⣤⣤⣤⣀⡀⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⢀⣴⣿⣿⣿⠿⠟⠛⠉⠉⠀⠀⠉⠙⠻⢿⣷⣦⡀⠀⠀⠀
        ⠀⠀⠀⢠⣿⡿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⢿⣆⠀⠀
        ⠀⠀⢠⣿⠋⠀⠀⠀⣠⣶⣶⣶⣶⣶⣦⣄⠀⠀⠀⠀⠀⠀⠈⣿⣆⠀
        ⠀⢀⣿⠁⠀⠀⠀⠘⠛⠋⠁⠀⠀⠈⠉⠛⠀⠀⠀⠀⠀⠀⠀⢹⣿⠀
        ⠀⢸⣿⠀⠀⠀⢀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⠀⠀⠀⣿⡇
        ⠀⠈⢿⣧⠀⢀⡿⠛⠛⠃⠀⠀⠀⠀⠀⠀⠀⠘⠿⠟⠛⠂⠀⣼⡟⠀
        ⠀⠀⠀⠙⢿⣮⣅⣀⣀⣀⣀⣀⠀⠀⠀⠀⢀⣀⣀⣠⣤⣴⡾⠋⠀⠀

       🤨  NOT SURE IF YOU'RE SUPPOSED TO BE ROOT...
       ❌  OR YOU'RE ABOUT TO BREAK SOMETHING IMPORTANT

             This script doesn't need root, buddy.

EOF

    read -p "Are you *sure* you want to continue as root? [y/N]: " confirm_root
    confirm_root="${confirm_root,,}"  # to lowercase
    if [[ "$confirm_root" != "y" && "$confirm_root" != "yes" ]]; then
        echo "❌ Aborting to prevent running as root."
        exit 1
    fi
fi

################################################################################
# Install Docker if not already installed
DOCKER_WAS_INSTALLED=true
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Installing Docker..."
    DOCKER_WAS_INSTALLED=false
    
    sudo apt-get update
    sudo apt-get install ca-certificates curl
    sudo install -m 0755 -d /etc/apt/keyrings
    sudo curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
    sudo chmod a+r /etc/apt/keyrings/docker.asc

    # Add the repository to Apt sources:
    echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian \
    $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
    sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update
    sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    
    echo "✅ Docker installed successfully!"
else
    echo "✅ Docker already installed: $(docker --version)"
fi

# Create docker group if it does not exist
if ! getent group docker > /dev/null; then
    sudo groupadd docker
fi

# Add current user to docker group
sudo usermod -aG docker "$USER"

# If Docker was just installed, remind user about group changes
if [ "$DOCKER_WAS_INSTALLED" = false ]; then
    echo ""
    echo "⚠️  Docker was just installed. You may need to log out and back in"
    echo "   for Docker group permissions to take effect properly."
    echo ""
fi

################################################################################
# Check for existing Docker tar balls (only if Docker is available)
IMAGES_LOADED=false
SKIP_DOWNLOAD=false

if command -v docker &> /dev/null; then
    if check_existing_tarballs; then
        if load_existing_tarballs; then
            IMAGES_LOADED=true
            SKIP_DOWNLOAD=true
            echo ""
            echo "✅ Docker images loaded from existing tar balls!"
        else
            SKIP_DOWNLOAD=false
        fi
    else
        echo "ℹ️  No existing Docker tar balls found in $DOCKER_TAR_DIR"
        SKIP_DOWNLOAD=false
    fi
else
    echo "⚠️  Docker not available, skipping tar ball check"
    SKIP_DOWNLOAD=false
fi

################################################################################
# Present user with what this script will do
echo -e "\n================== Setup Actions ==================\n"
echo "This script will:"
echo -e "\n1. ✅ Check and install Docker (completed)"
echo -e "2. ✅ Set up Docker group permissions (completed)"
if [ "$SKIP_DOWNLOAD" != true ]; then
    echo -e "3. 📥 Download Docker images and save as tar balls (optional):"
    printf '   • %s\n' "${IMAGES[@]}"
else
    echo -e "3. ✅ Docker images (already loaded from tar balls)"
fi
echo -e "4. 🔧 Set up Splunk DFIR environment permissions"
echo -e "\n==================================================\n"

# Prompt user if they wish to proceed
read -p "Do you wish to proceed? (y/n) " -n 1 -r
echo -e "\n"
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Setup cancelled."
    exit 1
fi

# Ask user if they would like to download the docker images as tar balls (only if not already loaded)
if [ "$SKIP_DOWNLOAD" != true ]; then
    read -p "Would you like to pre-download and save Docker images as tar balls for future use? (y/n) " -n 1 -r
    echo
    echo
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        SAVE_TARBALLS=true
        PULL_IMAGES=true
    else
        echo "ℹ️  Docker images will be pulled automatically when needed by the individual scripts."
        SAVE_TARBALLS=false
        PULL_IMAGES=false
    fi
else
    SAVE_TARBALLS=false
    PULL_IMAGES=false
fi

################################################################################
# Download and optionally save Docker images (only if not skipping)
echo "🔧 Preparing Splunk_DFIR directory permissions and setting ownership to $(whoami):docker"
sudo chown -R $(whoami):docker "$REPO_ROOT_DIR"
sudo chmod -R 744 "$REPO_ROOT_DIR"

if [ "$SKIP_DOWNLOAD" != true ] && [ "$PULL_IMAGES" = true ]; then
    # Create docker images directory if it doesn't exist
    mkdir -p "$DOCKER_TAR_DIR"
    
    echo ""
    echo "📥 Downloading and saving Docker images as tar balls..."
    for image in "${IMAGES[@]}"; do
        echo "🔄 Pulling $image..."
        if sudo docker pull "$image"; then
            echo "✅ Successfully pulled $image"
        else
            echo "❌ Failed to pull $image"
            continue
        fi
        
        # Always save as tar ball if we're pulling (since user said yes)
        image_filename=$(echo "$image" | tr '/' '_' | tr ':' '_')
        echo "💾 Saving $image as $image_filename.tar..."
        if sudo docker save "$image" -o "$DOCKER_TAR_DIR/$image_filename.tar"; then
            echo "✅ Successfully saved $image_filename.tar"
        else
            echo "❌ Failed to save $image_filename.tar"
        fi
        echo ""
    done
else
    echo "⏭️  Skipped Docker image download"
    if [ "$SKIP_DOWNLOAD" != true ]; then
        echo "     Images will be pulled automatically when needed by individual scripts."
    else
        echo "     (already loaded from existing tar balls)"
    fi
fi

################################################################################
# Set permissions for Splunk_DFIR
echo "🔧 Setting final permissions for Splunk_DFIR repository..."
if [ -d "$REPO_ROOT_DIR" ]; then
    # Use find to avoid issues with missing files
    sudo chown -R $(whoami):docker "$REPO_ROOT_DIR" 2>/dev/null || echo "⚠️  Some permission changes may have been skipped"
    sudo chmod -R 744 "$REPO_ROOT_DIR" 2>/dev/null || echo "⚠️  Some permission changes may have been skipped"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
if [ "$DOCKER_WAS_INSTALLED" = false ]; then
    echo "⚠️  IMPORTANT: Please log out and back in for Docker group changes to take effect."
else
    echo "✅ Docker group permissions should already be active."
fi

if [ "$PULL_IMAGES" = true ]; then
    echo ""
    echo "💾 Docker images have been saved as tar balls in: $DOCKER_TAR_DIR"
    echo "   You can share these files or use them for offline installations."
fi

echo ""
echo "🚀 You can now run the Splunk DFIR scripts!"