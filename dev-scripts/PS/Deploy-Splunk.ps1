# Deploy-Splunk.ps1
# PowerShell version of deploy-splunk.sh

# Ensure correct filepath assigned when referenced
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
Write-Host ""

# Function to securely prompt for password and confirm it
do {
    $SPLUNK_PASSWORD = Read-Host "Enter Splunk admin password (or press Ctrl+C to exit)" -AsSecureString
    
    # Check if input is empty
    if ($SPLUNK_PASSWORD.Length -eq 0) {
        Write-Host "❌ No password entered. Exiting..." -ForegroundColor Red
        exit 1
    }

    $SPLUNK_PASSWORD_CONFIRM = Read-Host "Confirm Splunk admin password" -AsSecureString
    
    # Check if input is empty
    if ($SPLUNK_PASSWORD_CONFIRM.Length -eq 0) {
        Write-Host "❌ No password entered. Exiting..." -ForegroundColor Red
        exit 1
    }

    # Convert secure strings to plain text for comparison
    $pwd1 = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($SPLUNK_PASSWORD))
    $pwd2 = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($SPLUNK_PASSWORD_CONFIRM))

    if ($pwd1 -eq $pwd2) {
        Write-Host "✅ Password confirmed." -ForegroundColor Green
        $SPLUNK_PASSWORD_TEXT = $pwd1
        break
    } else {
        Write-Host "❌ Passwords do not match. Please try again." -ForegroundColor Red
    }
} while ($true)

# Set permissions using icacls (Windows equivalent of chmod/chown)
Write-Host "⚙️ Setting permissions for Splunk directories..."

# Get current user
$currentUser = [System.Security.Principal.WindowsIdentity]::GetCurrent().Name

# Set permissions for splunk directory
$splunkPath = Join-Path $REPO_ROOT_DIR "splunk"
if (Test-Path $splunkPath) {
    icacls "$splunkPath\*" /grant "${currentUser}:(OI)(CI)F" /T /Q 2>$null
}

# Set permissions for data_store directory
$dataStorePath = Join-Path $REPO_ROOT_DIR "data_store"
if (Test-Path $dataStorePath) {
    icacls "$dataStorePath\*" /grant "${currentUser}:(OI)(CI)F" /T /Q 2>$null
}

# Set permissions for ansible directory
$ansiblePath = Join-Path $REPO_ROOT_DIR "ansible"
if (Test-Path $ansiblePath) {
    icacls "$ansiblePath\*" /grant "${currentUser}:(OI)(CI)F" /T /Q 2>$null
}

Write-Host "🚀 Building Splunk Enterprise Docker container..."

Write-Host "⚙️ Mounting:      $REPO_ROOT_DIR\splunk\etc --> /data/etc:ro"
Write-Host "⚙️ Mounting:      $REPO_ROOT_DIR\splunk\var --> /data/var"
Write-Host "⚙️ Mounting:      $REPO_ROOT_DIR\data_store\processed --> /data/processed:ro"
Write-Host "⚙️ Mounting:      $REPO_ROOT_DIR\ansible --> /data/ansible:ro"
Write-Host ""

# Define Ansible pre-tasks
$ANSIBLE_PRE_TASKS = "file:///data/ansible/playbooks/Include-Custom-Apps.yml,file:///data/ansible/playbooks/Include-local-conf.yml,file:///data/ansible/playbooks/remove_first_login.yml"

Write-Host "📖 Queued Ansible Playbooks:"
$TASKS = $ANSIBLE_PRE_TASKS -split ","
foreach ($task in $TASKS) {
    $taskName = $task -replace "file:///data/ansible/playbooks/", ""
    Write-Host "📋 $taskName"
}
Write-Host "- find more @ $REPO_ROOT_DIR\ansible" 
Start-Sleep 3
Write-Host ""

# Insert memes
Write-Host "🚀 docker go brrr"
Write-Host "🫡 loading in your apps now with ansible"
Start-Sleep 0.1
Write-Host "        ⠀  _______________  "
Start-Sleep 0.1
Write-Host "        ⠀ /      ZERO      \ "
Start-Sleep 0.1
Write-Host "        ⠀ |      SUGAR     |"
Start-Sleep 0.1
Write-Host "        ⠀ |----------------|"
Start-Sleep 0.1
Write-Host "        ⠀ |  ██        ██  |"   
Start-Sleep 0.1
Write-Host "        ⠀ |  ████     ███  |"  
Start-Sleep 0.1
Write-Host "        ⠀ |  █████   ██ ██ |"  
Start-Sleep 0.1
Write-Host "        ⠀ |  ██  █████  ██ |" 
Start-Sleep 0.1
Write-Host "        ⠀ |  ██   ████  ██ |"
Start-Sleep 0.1
Write-Host "        ⠀ |  ██    ███  ██ |"
Start-Sleep 0.1
Write-Host "        ⠀ |  ██    ███  ██ |"
Start-Sleep 0.1
Write-Host "        ⠀ |  ██    ██   ██ |"
Start-Sleep 0.1
Write-Host "        ⠀ |  ██    ██   ██ |"       
Start-Sleep 0.1
Write-Host "        ⠀ |  ██     █   ██ |"
Start-Sleep 0.1
Write-Host "          |________________|"
Start-Sleep 0.1
Write-Host "        ⠀ |      MONSTER   |"
Start-Sleep 0.1
Write-Host "        ⠀ |      ENERGY    |"
Start-Sleep 0.1
Write-Host "        ⠀ |________________|"
Start-Sleep 0.1
Write-Host "        ⠀ |       ZERO     |"
Start-Sleep 0.1
Write-Host "        ⠀ |       ULTRA    |"
Start-Sleep 0.1
Write-Host "        ⠀ \________________/"
Start-Sleep 1
Write-Host ""
Write-Host "done. punch it chewie 🧌"
Write-Host ""

# Convert Windows paths to Docker-compatible paths
$splunkEtcPath = (Join-Path $REPO_ROOT_DIR "splunk\etc") -replace "\\", "/"
$splunkVarPath = (Join-Path $REPO_ROOT_DIR "splunk\var") -replace "\\", "/"
$processedPath = (Join-Path $REPO_ROOT_DIR "data_store\processed") -replace "\\", "/"
$ansiblePlaybooksPath = (Join-Path $REPO_ROOT_DIR "ansible\playbooks") -replace "\\", "/"

# Run Splunk Enterprise container with ansible_pre_tasks defined
$dockerArgs = @(
    "run", "-d", "--name", "splunk-enterprise",
    "--hostname", "splunk-enterprise",
    "-p", "8000:8000",
    "-v", "${splunkEtcPath}:/data/etc:ro",
    "-v", "${splunkVarPath}:/data/var",
    "-v", "${processedPath}:/data/processed:ro",
    "-v", "${ansiblePlaybooksPath}:/data/ansible/playbooks:ro",
    "-e", "SPLUNK_HTTP_ENABLESSL=true",
    "-e", "SPLUNK_PASSWORD=$SPLUNK_PASSWORD_TEXT",
    "-e", "SPLUNK_START_ARGS=--accept-license",
    "-e", "SPLUNK_DISABLE_POPUPS=True",
    "-e", "SPLUNK_ROLE=splunk_standalone",
    "-e", "SPLUNK_ANSIBLE_PRE_TASKS=$ANSIBLE_PRE_TASKS",
    "splunk/splunk:latest"
)

& docker $dockerArgs

# Start background job to stream logs
$logJob = Start-Job -ScriptBlock { & docker logs -f splunk-enterprise }

# Wait until Ansible is complete
Write-Host "⏳ Waiting for Ansible to complete inside container..."

$timeout = 60
$elapsed = 0
$interval = 1

do {
    Start-Sleep $interval
    $elapsed += $interval
    
    $logs = & docker logs splunk-enterprise 2>&1
    $ansibleComplete = $logs | Select-String "Ansible playbook complete, will begin streaming splunkd_stderr.log"
    
    if ($ansibleComplete) {
        break
    }
    
    if ($elapsed -ge $timeout) {
        Write-Host "❌ Timeout waiting for Ansible playbook to complete." -ForegroundColor Red
        Stop-Job $logJob -Force
        Remove-Job $logJob -Force
        exit 1
    }
} while ($true)

# Step 3: Check if container is running
Write-Host "✅ Ansible complete."
Start-Sleep 1
Write-Host ""
Write-Host "Splunk initialising..."
Write-Host ""
Write-Host "Splunk will be available at: https://localhost:8000"
Write-Host ""

# Ensure the container is running before proceeding
$runningContainers = & docker ps --format "{{.Names}}"
if ($runningContainers -notcontains "splunk-enterprise") {
    Write-Host "❌ Error: Splunk container failed to start!" -ForegroundColor Red
    Stop-Job $logJob -Force
    Remove-Job $logJob -Force
    exit 1
}

Write-Host "✅ Splunk container setup completed successfully!" -ForegroundColor Green

# Clean up background job
Stop-Job $logJob -Force
Remove-Job $logJob -Force
