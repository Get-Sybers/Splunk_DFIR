#!/bin/bash

################################################################################
#
# Docker Image Loader Script
# Description: Loads Docker images from tar files into Docker daemon
# Author: Original script enhanced for readability
#
################################################################################

#------------------------------------------------------------------------------
# Configuration
#------------------------------------------------------------------------------
# Establish Splunk_DFIR repository filepath
SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"
REPO_ROOT_DIR="$(realpath "$SCRIPT_DIR/../..")"
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

#------------------------------------------------------------------------------
# Display available Docker images
#------------------------------------------------------------------------------
echo "═════════════════════════════════════════════════════"
echo "Current Docker images in $DOCKER_TAR_DIR:"
echo "───────────────────────────────────────────────────"
ls -1 "$DOCKER_TAR_DIR"
echo "═════════════════════════════════════════════════════"

#------------------------------------------------------------------------------
# User prompt
#------------------------------------------------------------------------------
read -p "Would you like to load the Docker images from tar balls? (y/n) " -n 1 -r
echo -e "\n"

#------------------------------------------------------------------------------
# Main processing
#------------------------------------------------------------------------------
if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Verify directory exists and contains files
    if [ -d "$DOCKER_TAR_DIR" ] && [ "$(ls -A $DOCKER_TAR_DIR)" ]; then
        echo "📦 Loading Docker images from $DOCKER_TAR_DIR..."
        echo "───────────────────────────────────────────────────"
        
        # Process each tar file
        for tarfile in "$DOCKER_TAR_DIR"/*.tar; do
            if [ -f "$tarfile" ]; then
                echo "🔄 Loading $(basename "$tarfile")..."
                if docker load < "$tarfile"; then
                    echo "✅ Successfully loaded $(basename "$tarfile")"
                else
                    echo "❌ Error loading $(basename "$tarfile")"
                fi
                echo "───────────────────────────────────────────"
            fi
        done
        
        echo "✨ Finished loading Docker images"
    else
        echo "❌ Error: Docker tar directory is empty or does not exist"
        exit 1
    fi
else
    echo "⏭️  Skipping Docker image loading"
fi