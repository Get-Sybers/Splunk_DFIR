#!/bin/bash

################################################################################
# Establish Splunk_DFIR repo filepath
SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"
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

# docker images to download
IMAGES=(
    "log2timeline/plaso:latest"
    "zeek/zeek:latest"
    "splunk/splunk:latest"
)

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

             This script doesn’t need root, buddy.

EOF

    read -p "Are you *sure* you want to continue as root? [y/N]: " confirm_root
    confirm_root="${confirm_root,,}"  # to lowercase
    if [[ "$confirm_root" != "y" && "$confirm_root" != "yes" ]]; then
        echo "❌ Aborting to prevent running as root."
        exit 1
    fi
fi

################################################################################
# Present user with what this script will do
echo -e "\n================== Setup Actions ==================\n"
echo "This script will:"
echo -e "\n1. Check and install Docker if not present"
echo -e "2. Set up Docker group permissions"
echo -e "3. Download required Docker images:"
printf '   • %s\n' "${IMAGES[@]}"
echo -e "4. Set up Splunk DFIR environment permissions"
echo -e "\n==================================================\n"

# Prompt user if they wish to proceed
read -p "Do you wish to proceed? (y/n) " -n 1 -r
echo -e "\n"
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Setup cancelled."
    exit 1
fi

# Ask user if they would like to download the docker images as tar balls
read -p "Would you like to download Docker images as tar balls? (y/n) " -n 1 -r
echo
echo
echo
SAVE_TARBALLS=$([[ $REPLY =~ ^[Yy]$ ]] && echo true || echo false)

################################################################################
# Install Docker if not already installed
if ! command -v docker &> /dev/null; then
    echo "Docker not found. Installing Docker..."
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
else
    echo "Docker version: $(docker --version)"
fi

# Create docker group if it does not exist
if ! getent group docker > /dev/null; then
    sudo groupadd docker
fi

# Add current user to docker group
sudo usermod -aG docker "$USER"

################################################################################
# Download and optionally save Docker images
echo "Preparing Splunk_DFIR directory permissions and setting ownership to $(whoami):docker"
sudo chown -R $(whoami):docker "$REPO_ROOT_DIR"
sudo chmod -R 744 "$REPO_ROOT_DIR"
for image in "${IMAGES[@]}"; do
    echo "Pulling $image..."
    sudo docker pull "$image"
    
    if [ "$SAVE_TARBALLS" = true ]; then
        image_filename=$(echo "$image" | tr '/' '_' | tr ':' '_')
        echo "Saving $image as $image_filename.tar..."
        sudo docker save "$image" -o "$REPO_ROOT_DIR/data_store/docker_images/$image_filename.tar"
    fi
done

################################################################################
# Set permissions for Splunk_DFIR

if [ -d "$REPO_ROOT_DIR" ]; then
    echo "Setting permissions for Splunk_DFIR repo $(whoami):docker"
    sudo chown -R $(whoami):docker "$REPO_ROOT_DIR/*"
    sudo chmod -R 744 "$REPO_ROOT_DIR/*"
fi
echo
echo "Setup complete! Please log out and back in for docker group changes to take effect."
echo
echo "To install docker tar images run: $REPO_ROOT_DIR/scripts/setup_load_docker_tar.sh"
