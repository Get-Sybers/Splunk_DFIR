# Setup-Environment.ps1
# PowerShell version of setup_environment.sh

# Establish Splunk_DFIR repo filepath
$SCRIPT_DIR = $PSScriptRoot
$REPO_ROOT_DIR = Split-Path -Path $SCRIPT_DIR -Parent

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

# Docker images to download
$IMAGES = @(
    "log2timeline/plaso:latest",
    "zeek/zeek:latest",
    "splunk/splunk:latest"
)

################################################################################
# Check if running as administrator
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
$isAdmin = $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if ($isAdmin) {
    Write-Host @"
        ⠀⠀⠀⠀⠀⠀⠀⣀⣀⣀⣀⣤⣤⣤⣤⣤⣤⣤⣀⡀⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⢀⣴⣿⣿⣿⠿⠟⠛⠉⠉⠀⠀⠉⠙⠻⢿⣷⣦⡀⠀⠀⠀
        ⠀⠀⠀⢠⣿⡿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⢿⣆⠀⠀
        ⠀⠀⢠⣿⠋⠀⠀⠀⣠⣶⣶⣶⣶⣶⣦⣄⠀⠀⠀⠀⠀⠀⠈⣿⣆⠀
        ⠀⢀⣿⠁⠀⠀⠀⠘⠛⠋⠁⠀⠀⠈⠉⠛⠀⠀⠀⠀⠀⠀⠀⢹⣿⠀
        ⠀⢸⣿⠀⠀⠀⢀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⠀⠀⠀⣿⡇
        ⠀⠈⢿⣧⠀⢀⡿⠛⠛⠃⠀⠀⠀⠀⠀⠀⠀⠘⠿⠟⠛⠂⠀⣼⡟⠀
        ⠀⠀⠀⠙⢿⣮⣅⣀⣀⣀⣀⣀⠀⠀⠀⠀⢀⣀⣀⣠⣤⣴⡾⠋⠀⠀

       🤨  RUNNING AS ADMINISTRATOR...
       ❌  THIS MIGHT NOT BE NECESSARY

             Consider running without admin privileges.

"@ -ForegroundColor Yellow

    $confirm_admin = Read-Host "Are you *sure* you want to continue as administrator? [y/N]"
    if ($confirm_admin -notmatch "^[Yy]") {
        Write-Host "❌ Aborting to prevent running as administrator." -ForegroundColor Red
        exit 1
    }
}

################################################################################
# Present user with what this script will do
Write-Host "`n================== Setup Actions ==================`n"
Write-Host "This script will:"
Write-Host "`n1. Check and install Docker Desktop if not present"
Write-Host "2. Download required Docker images:"
foreach ($image in $IMAGES) {
    Write-Host "   • $image"
}
Write-Host "3. Set up Splunk DFIR environment permissions"
Write-Host "`n==================================================`n"

# Prompt user if they wish to proceed
$proceed = Read-Host "Do you wish to proceed? (y/n)"
if ($proceed -notmatch "^[Yy]") {
    Write-Host "Setup cancelled."
    exit 1
}

# Ask user if they would like to download the docker images as tar balls
$saveTarballs = Read-Host "Would you like to download Docker images as tar balls? (y/n)"
$SAVE_TARBALLS = $saveTarballs -match "^[Yy]"

################################################################################
# Check if Docker is installed and running
$dockerInstalled = $false
try {
    $dockerVersion = & docker --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Docker version: $dockerVersion" -ForegroundColor Green
        $dockerInstalled = $true
    }
}
catch {
    $dockerInstalled = $false
}

if (-not $dockerInstalled) {
    Write-Host "Docker not found. Please install Docker Desktop for Windows from:" -ForegroundColor Yellow
    Write-Host "https://docs.docker.com/desktop/windows/install/" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "After installing Docker Desktop:" -ForegroundColor Yellow
    Write-Host "1. Restart your computer"
    Write-Host "2. Start Docker Desktop"
    Write-Host "3. Re-run this script"
    Write-Host ""
    $openUrl = Read-Host "Would you like to open the Docker Desktop download page? (y/n)"
    if ($openUrl -match "^[Yy]") {
        Start-Process "https://docs.docker.com/desktop/windows/install/"
    }
    exit 1
}

# Check if Docker is running
try {
    & docker info 2>$null | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Docker is installed but not running. Please start Docker Desktop and try again." -ForegroundColor Yellow
        exit 1
    }
}
catch {
    Write-Host "Docker is installed but not running. Please start Docker Desktop and try again." -ForegroundColor Yellow
    exit 1
}

################################################################################
# Download and optionally save Docker images
Write-Host "Preparing Splunk_DFIR directory permissions..."

# Get current user
$currentUser = [System.Security.Principal.WindowsIdentity]::GetCurrent().Name

# Set permissions for the entire repository
if (Test-Path $REPO_ROOT_DIR) {
    try {
        icacls "$REPO_ROOT_DIR" /grant "${currentUser}:(OI)(CI)F" /T /Q 2>$null
        Write-Host "✅ Set permissions for $REPO_ROOT_DIR" -ForegroundColor Green
    }
    catch {
        Write-Host "⚠️ Warning: Could not set permissions for $REPO_ROOT_DIR" -ForegroundColor Yellow
    }
}

# Create docker images directory if it doesn't exist
$dockerImagesDir = Join-Path $REPO_ROOT_DIR "data_store\docker_images"
if (-not (Test-Path $dockerImagesDir)) {
    New-Item -ItemType Directory -Path $dockerImagesDir -Force | Out-Null
}

foreach ($image in $IMAGES) {
    Write-Host "Pulling $image..." -ForegroundColor Cyan
    try {
        & docker pull $image
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Successfully pulled $image" -ForegroundColor Green
        }
        else {
            Write-Host "❌ Failed to pull $image" -ForegroundColor Red
            continue
        }
    }
    catch {
        Write-Host "❌ Error pulling $image : $_" -ForegroundColor Red
        continue
    }
    
    if ($SAVE_TARBALLS) {
        $image_filename = $image -replace "/", "_" -replace ":", "_"
        $tarPath = Join-Path $dockerImagesDir "$image_filename.tar"
        Write-Host "Saving $image as $image_filename.tar..." -ForegroundColor Cyan
        try {
            & docker save $image -o $tarPath
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Successfully saved $image to $tarPath" -ForegroundColor Green
            }
            else {
                Write-Host "❌ Failed to save $image" -ForegroundColor Red
            }
        }
        catch {
            Write-Host "❌ Error saving $image : $_" -ForegroundColor Red
        }
    }
}

################################################################################
# Final permissions setup
if (Test-Path $REPO_ROOT_DIR) {
    Write-Host "Setting final permissions for Splunk_DFIR repo..." -ForegroundColor Cyan
    try {
        Get-ChildItem $REPO_ROOT_DIR -Recurse | ForEach-Object {
            icacls $_.FullName /grant "${currentUser}:(OI)(CI)F" /Q 2>$null
        }
        Write-Host "✅ Permissions set successfully" -ForegroundColor Green
    }
    catch {
        Write-Host "⚠️ Warning: Some permissions may not have been set correctly" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
if ($SAVE_TARBALLS) {
    Write-Host "To install docker tar images run: $REPO_ROOT_DIR\scripts\Setup-LoadDockerTar.ps1" -ForegroundColor Cyan
}
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Place your forensic evidence in the appropriate data_store directories"
Write-Host "2. Run Deploy-Splunk.ps1 to start the Splunk environment"
