# Purge-SplunkContainer.ps1
# PowerShell version of purge-splunk-container.sh

# Ensure correct filepath assigned when referenced
$SCRIPT_DIR = $PSScriptRoot
$REPO_ROOT_DIR = Split-Path -Path $SCRIPT_DIR -Parent

$SPLUNK_CONTAINER = "splunk-enterprise"
$SPLUNK_VAR_DIR = Join-Path $REPO_ROOT_DIR "splunk\var"

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

Write-Host "⚠️ WARNING: This will stop and remove the Splunk container, and DELETE all Splunk indexes." -ForegroundColor Yellow
Write-Host "❌ This action CANNOT be undone." -ForegroundColor Red

# Ask for confirmation
$CONFIRMATION = Read-Host "Are you absolutely sure you want to PURGE the container and all indexes? (yes/no)"

# Check user input
if ($CONFIRMATION -ne "yes") {
    Write-Host "`n🚫 Operation canceled. Your Splunk indexes are SAFE." -ForegroundColor Green
    Write-Host "📂 You can find your indexes in: Splunk_DFIR\splunk\var" -ForegroundColor Cyan
    exit 0
}

Write-Host "`n🛑 Stopping and removing the Splunk container: $SPLUNK_CONTAINER..." -ForegroundColor Yellow

# Stop and remove container
try {
    & docker stop $SPLUNK_CONTAINER 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Container stopped successfully" -ForegroundColor Green
    }
    else {
        Write-Host "⚠️ Container may not have been running" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "⚠️ Error stopping container: $_" -ForegroundColor Yellow
}

try {
    & docker rm $SPLUNK_CONTAINER 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Container removed successfully" -ForegroundColor Green
    }
    else {
        Write-Host "⚠️ Container may not have existed" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "⚠️ Error removing container: $_" -ForegroundColor Yellow
}

Write-Host "`n🧹 Purging all Splunk index data from: $SPLUNK_VAR_DIR..." -ForegroundColor Yellow

if (Test-Path $SPLUNK_VAR_DIR) {
    try {
        Get-ChildItem -Path $SPLUNK_VAR_DIR -Recurse | Remove-Item -Force -Recurse
        Write-Host "✅ Splunk index data purged successfully" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Error purging index data: $_" -ForegroundColor Red
        Write-Host "You may need to run this script as Administrator" -ForegroundColor Yellow
    }
}
else {
    Write-Host "ℹ️ Splunk var directory does not exist: $SPLUNK_VAR_DIR" -ForegroundColor Cyan
}

Write-Host "`n🔍 Checking for dangling Docker volumes related to Splunk..." -ForegroundColor Cyan

# Get dangling volumes
try {
    $danglingVolumes = & docker volume ls -qf dangling=true 2>$null
    if ($danglingVolumes -and $danglingVolumes.Count -gt 0) {
        Write-Host "🗑️ Removing dangling Docker volumes..." -ForegroundColor Yellow
        foreach ($volume in $danglingVolumes) {
            & docker volume rm $volume 2>$null
        }
        Write-Host "✅ Dangling volumes removed." -ForegroundColor Green
    }
    else {
        Write-Host "ℹ️ No dangling volumes found." -ForegroundColor Cyan
    }
}
catch {
    Write-Host "⚠️ Error checking for dangling volumes: $_" -ForegroundColor Yellow
}

Write-Host "`n✅ Splunk container and indexes have been purged." -ForegroundColor Green
