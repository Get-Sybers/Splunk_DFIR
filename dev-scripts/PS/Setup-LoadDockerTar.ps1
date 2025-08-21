# Setup-LoadDockerTar.ps1
# PowerShell version of setup_load_docker_tar.sh

################################################################################
#
# Docker Image Loader Script
# Description: Loads Docker images from tar files into Docker daemon
# Author: Original script enhanced for PowerShell
#
################################################################################

#------------------------------------------------------------------------------
# Configuration
#------------------------------------------------------------------------------
# Establish Splunk_DFIR repository filepath
$SCRIPT_DIR = $PSScriptRoot
$REPO_ROOT_DIR = Split-Path -Path $SCRIPT_DIR -Parent
$DOCKER_TAR_DIR = Join-Path $REPO_ROOT_DIR "data_store\docker_images"

################################################################################
Write-Host ""
Write-Host " ██████╗ ███████╗████████╗   ███████╗██╗   ██╗██████╗ ███████╗██████╗ ███████╗"
Start-Sleep 0.1
Write-Host "██╔════╝ ██╔════╝╚══██╔══╝   ██╔════╝╚██╗ ██╔╝██╔══██╗██╔════╝██╔══██╗██╔════╝"
Start-Sleep 0.1
Write-Host "██║  ███╗█████╗     ██║█████╗███████╗ ╚████╔╝ ██████╔╝█████╗  ██████╔╝███████╗"
Start-Sleep 0.1
Write-Host "██║   ██║██╔══╝     ██║╚════╝╚════██║  ╚██╔╝  ██╔══██╗██╔══╝  ██╔══██╗╚════██║"
Start-Sleep 0.1
Write-Host "╚██████╔╝███████╗   ██║      ███████║   ██║   ██████╔╝███████╗██║  ██║███████║"
Start-Sleep 0.1
Write-Host "╚═════╝ ╚══════╝   ╚═╝      ╚══════╝   ╚═╝   ╚═════╝ ╚══════╝╚═╝  ╚═╝╚══════╝"
Write-Host ""

Write-Host "$REPO_ROOT_DIR"

#------------------------------------------------------------------------------
# Display available Docker images
#------------------------------------------------------------------------------
Write-Host "═════════════════════════════════════════════════════"
Write-Host "Current Docker images in $DOCKER_TAR_DIR :"
Write-Host "───────────────────────────────────────────────────"

if (Test-Path $DOCKER_TAR_DIR) {
    $tarFiles = Get-ChildItem -Path $DOCKER_TAR_DIR -Filter "*.tar"
    if ($tarFiles.Count -gt 0) {
        foreach ($file in $tarFiles) {
            Write-Host $file.Name
        }
    }
    else {
        Write-Host "No .tar files found in directory"
    }
}
else {
    Write-Host "Directory does not exist: $DOCKER_TAR_DIR"
}

Write-Host "═════════════════════════════════════════════════════"

#------------------------------------------------------------------------------
# User prompt
#------------------------------------------------------------------------------
$userInput = Read-Host "Would you like to load the Docker images from tar balls? (y/n)"

#------------------------------------------------------------------------------
# Main processing
#------------------------------------------------------------------------------
if ($userInput -match "^[Yy]") {
    # Verify directory exists and contains files
    if ((Test-Path $DOCKER_TAR_DIR) -and (Get-ChildItem -Path $DOCKER_TAR_DIR -Filter "*.tar").Count -gt 0) {
        Write-Host "📦 Loading Docker images from $DOCKER_TAR_DIR..." -ForegroundColor Cyan
        Write-Host "───────────────────────────────────────────────────"
        
        # Process each tar file
        $tarFiles = Get-ChildItem -Path $DOCKER_TAR_DIR -Filter "*.tar"
        foreach ($tarfile in $tarFiles) {
            Write-Host "🔄 Loading $($tarfile.Name)..." -ForegroundColor Yellow
            try {
                & docker load -i $tarfile.FullName
                if ($LASTEXITCODE -eq 0) {
                    Write-Host "✅ Successfully loaded $($tarfile.Name)" -ForegroundColor Green
                }
                else {
                    Write-Host "❌ Error loading $($tarfile.Name)" -ForegroundColor Red
                }
            }
            catch {
                Write-Host "❌ Error loading $($tarfile.Name): $_" -ForegroundColor Red
            }
            Write-Host "───────────────────────────────────────────"
        }
        
        Write-Host "✨ Finished loading Docker images" -ForegroundColor Green
    }
    else {
        Write-Host "❌ Error: Docker tar directory is empty or does not exist" -ForegroundColor Red
        exit 1
    }
}
else {
    Write-Host "⏭️  Skipping Docker image loading" -ForegroundColor Yellow
}
