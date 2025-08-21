# Process-Log2timeline-ALL.ps1
# PowerShell version of process-log2timeline-ALL.sh

# Ensure correct filepath assigned when referenced
$SCRIPT_DIR = $PSScriptRoot
$REPO_ROOT_DIR = Split-Path -Path $SCRIPT_DIR -Parent

# Set the input directory containing E01 files
$INPUT_DIR = Join-Path $REPO_ROOT_DIR "data_store\raw\disk_images"

# Set the host output directory
$HOST_OUTPUT_DIR = Join-Path $REPO_ROOT_DIR "data_store\processed\log2timeline"

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

# Ensure the host output directories exist
$csvDir = Join-Path $HOST_OUTPUT_DIR "csv"
$logsDir = Join-Path $HOST_OUTPUT_DIR "logs"

if (-not (Test-Path $csvDir)) {
    New-Item -ItemType Directory -Path $csvDir -Force | Out-Null
}
if (-not (Test-Path $logsDir)) {
    New-Item -ItemType Directory -Path $logsDir -Force | Out-Null
}

# Set permissions (Windows equivalent)
if (Test-Path $INPUT_DIR) {
    try {
        $currentUser = [System.Security.Principal.WindowsIdentity]::GetCurrent().Name
        icacls "$INPUT_DIR" /grant "${currentUser}:(OI)(CI)F" /T /Q 2>$null
    }
    catch {
        Write-Host "Warning: Could not set permissions for $INPUT_DIR" -ForegroundColor Yellow
    }
}

# Debug: List available E01 files before processing
Write-Host "Checking for E01 files in: $INPUT_DIR"
if (Test-Path $INPUT_DIR) {
    Get-ChildItem -Path $INPUT_DIR | Select-Object Name, Length | Format-Table -AutoSize
}
else {
    Write-Host "Input directory does not exist: $INPUT_DIR" -ForegroundColor Red
    exit 1
}

# Find E01 files with case-insensitive matching
$E01_FILES = Get-ChildItem -Path $INPUT_DIR -Filter "*.E01" -File
if ($E01_FILES.Count -eq 0) {
    # Try lowercase
    $E01_FILES = Get-ChildItem -Path $INPUT_DIR -Filter "*.e01" -File
}

# Ensure there are E01 files to process
if ($E01_FILES.Count -eq 0) {
    Write-Host "Error: No E01 files found in $INPUT_DIR" -ForegroundColor Red
    exit 1
}

# Convert Windows paths to Docker-compatible format
$inputDirDocker = $INPUT_DIR -replace "\\", "/" -replace "^C:", "/c"
$outputDirDocker = $HOST_OUTPUT_DIR -replace "\\", "/" -replace "^C:", "/c"

# Loop through each E01 file in the directory
foreach ($inputFile in $E01_FILES) {
    # Extract filename without extension
    $filename = [System.IO.Path]::GetFileNameWithoutExtension($inputFile.Name)

    Write-Host "Processing: $($inputFile.Name)" -ForegroundColor Cyan

    # Prepare paths for Docker
    $inputFileDocker = "/data/$($inputFile.Name)"
    $outputCsvPath = Join-Path $csvDir "$filename.csv"
    $outputLogPath = Join-Path $logsDir "$filename.log"
    
    # Convert output paths for Docker
    $outputCsvDocker = "/output/csv/$filename.csv"

    # Docker arguments for psteal
    $dockerArgs = @(
        "run", "--rm",
        "-v", "${INPUT_DIR}:/data:ro",
        "-v", "${HOST_OUTPUT_DIR}:/output",
        "log2timeline/plaso",
        "psteal",
        "--source", $inputFileDocker,
        "--output-format", "dynamic",
        "--fields", "date,datetime,description,description_short,display_name,filename,host,hostname,inode,macb,message,message_short,source,sourcetype,source_long,tag,time,timestamp_desc,timezone,type,user,username,zone",
        "--timezone", "UTC",
        "--vss-stores", "all",
        "--partitions", "all",
        "--quiet",
        "-w", $outputCsvDocker
    )

    # Run psteal inside the Plaso container for each file
    try {
        & docker $dockerArgs 2>$outputLogPath
        
        # Check if csv output was created
        if (-not (Test-Path $outputCsvPath)) {
            $errorMsg = "Error: psteal failed to produce csv output for $filename"
            Write-Host $errorMsg -ForegroundColor Red
            Add-Content -Path $outputLogPath -Value $errorMsg
            continue
        }

        $successMsg = "Saved csv output to: $outputCsvPath"
        Write-Host $successMsg -ForegroundColor Green
        Add-Content -Path $outputLogPath -Value $successMsg
        
        $logMsg = "Saved logs to: $outputLogPath"
        Write-Host $logMsg -ForegroundColor Green
        Add-Content -Path $outputLogPath -Value $logMsg
    }
    catch {
        $errorMsg = "Error processing $($inputFile.Name): $_"
        Write-Host $errorMsg -ForegroundColor Red
        Add-Content -Path $outputLogPath -Value $errorMsg
    }
}

Write-Host "Processing complete." -ForegroundColor Green
