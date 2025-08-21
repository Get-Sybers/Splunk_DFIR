# Setup-DisableAllSplunkInputs.ps1
# PowerShell version of setup-disable-all-splunk-inputs.sh

# Ensure correct filepath assigned when referenced
$SCRIPT_DIR = $PSScriptRoot
$REPO_ROOT_DIR = Split-Path -Path $SCRIPT_DIR -Parent

# Change all instances of disabled = false in splunk/etc/system/local/inputs.conf to disabled = true
$INPUTS_CONF_PATH = Join-Path $REPO_ROOT_DIR "splunk\etc\system\local\inputs.conf"

# Check if the file exists
if (-not (Test-Path $INPUTS_CONF_PATH)) {
    Write-Host "Error: inputs.conf file not found at $INPUTS_CONF_PATH" -ForegroundColor Red
    exit 1
}

# Read the file content
try {
    $content = Get-Content $INPUTS_CONF_PATH -Raw
    
    # Replace all instances of "disabled = false" with "disabled = true"
    $newContent = $content -replace "disabled = false", "disabled = true"
    
    # Write the modified content back to the file
    Set-Content -Path $INPUTS_CONF_PATH -Value $newContent -NoNewline
    
    # Count the number of replacements made by counting occurrences in the new content
    $replacements = ([regex]::Matches($newContent, "disabled = true")).Count
    
    Write-Host "Disabled $replacements inputs in $INPUTS_CONF_PATH" -ForegroundColor Green
    Write-Host "All Splunk inputs have been disabled successfully." -ForegroundColor Green
}
catch {
    Write-Host "Error processing inputs.conf file: $_" -ForegroundColor Red
    exit 1
}
