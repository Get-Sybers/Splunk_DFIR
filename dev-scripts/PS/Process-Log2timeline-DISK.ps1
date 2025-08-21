# Process-Log2timeline-DISK.ps1
# PowerShell version of process-log2timeline-DISK.sh

# Ensure correct filepath assigned when referenced
$SCRIPT_DIR = $PSScriptRoot
$REPO_ROOT_DIR = Split-Path -Path $SCRIPT_DIR -Parent

# Set the input directory containing forensic image files
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

# Set permissions for directories
if (Test-Path $HOST_OUTPUT_DIR) {
    try {
        $currentUser = [System.Security.Principal.WindowsIdentity]::GetCurrent().Name
        icacls "$HOST_OUTPUT_DIR" /grant "${currentUser}:(OI)(CI)F" /T /Q 2>$null
    }
    catch {
        Write-Host "Warning: Could not set permissions for $HOST_OUTPUT_DIR" -ForegroundColor Yellow
    }
}

if (Test-Path $INPUT_DIR) {
    try {
        $currentUser = [System.Security.Principal.WindowsIdentity]::GetCurrent().Name
        icacls "$INPUT_DIR" /grant "${currentUser}:(OI)(CI)F" /T /Q 2>$null
    }
    catch {
        Write-Host "Warning: Could not set permissions for $INPUT_DIR" -ForegroundColor Yellow
    }
}

# Debug: List available files before processing
Write-Host "Checking for forensic image files in: $INPUT_DIR"
if (Test-Path $INPUT_DIR) {
    Get-ChildItem -Path $INPUT_DIR | Select-Object Name, Length | Format-Table -AutoSize
}
else {
    Write-Host "Input directory does not exist: $INPUT_DIR" -ForegroundColor Red
    exit 1
}

# Function to extract clean filename for output
function Get-CleanFilename {
    param([string]$FilePath)
    
    $filename = Split-Path -Leaf $FilePath
    
    # For E0x files, remove only the E0x extension
    if ($filename -match '\.[Ee][0-9][0-9]$') {
        return [System.IO.Path]::GetFileNameWithoutExtension($filename)
    }
    # For other supported formats
    elseif ($filename -match '\.(raw|img|dd|vmdk)$') {
        return [System.IO.Path]::GetFileNameWithoutExtension($filename)
    }
    # Handle .txt or other metadata files that might be alongside the forensic images
    elseif ($filename -match '\.[Ee][0-9][0-9]\.[a-zA-Z]+$') {
        # Remove the last two extensions (.E01.txt → remove both)
        $nameWithoutExt = [System.IO.Path]::GetFileNameWithoutExtension($filename)
        return [System.IO.Path]::GetFileNameWithoutExtension($nameWithoutExt)
    }
    else {
        # Default case - just return the filename without any extension
        return [System.IO.Path]::GetFileNameWithoutExtension($filename)
    }
}

# Function to check if file is first in multi-volume set
function Test-FirstVolume {
    param([string]$FilePath)
    
    $filename = Split-Path -Leaf $FilePath
    
    # Check if it's an E01 file (first in series) or single volume format
    if ($filename -match '\.[Ee]01$') {
        return $true  # It's E01 (first volume)
    }
    elseif ($filename -match '\.(raw|img|dd|vmdk)$') {
        return $true  # Single volume formats (case-insensitive)
    }
    else {
        return $false  # It's E02, E03, etc.
    }
}

# Collect all forensic image files with supported extensions (case-insensitive)
$forensicFiles = @()

# Define patterns for different file types
$patterns = @("*.E01", "*.e01", "*.RAW", "*.raw", "*.IMG", "*.img", "*.DD", "*.dd", "*.VMDK", "*.vmdk")

foreach ($pattern in $patterns) {
    $files = Get-ChildItem -Path $INPUT_DIR -Filter $pattern -File -ErrorAction SilentlyContinue
    $forensicFiles += $files
}

# Also look for other E0x files
for ($i = 0; $i -le 99; $i++) {
    $ext = "E{0:D2}" -f $i
    $pattern = "*.$ext"
    $files = Get-ChildItem -Path $INPUT_DIR -Filter $pattern -File -ErrorAction SilentlyContinue
    $forensicFiles += $files
    
    # Also check lowercase
    $extLower = $ext.ToLower()
    $patternLower = "*.$extLower"
    $files = Get-ChildItem -Path $INPUT_DIR -Filter $patternLower -File -ErrorAction SilentlyContinue
    $forensicFiles += $files
}

# Remove duplicates and sort
$forensicFiles = $forensicFiles | Sort-Object FullName -Unique

# Filter to only process first volumes of multi-part sets
$processedFiles = @()
foreach ($file in $forensicFiles) {
    if (Test-FirstVolume $file.FullName) {
        $processedFiles += $file
        Write-Host "Will process: $($file.Name)" -ForegroundColor Green
    }
    else {
        Write-Host "Skipping multi-volume part: $($file.Name)" -ForegroundColor Yellow
    }
}

# Ensure there are files to process
if ($processedFiles.Count -eq 0) {
    Write-Host "Error: No supported forensic image files found in $INPUT_DIR" -ForegroundColor Red
    Write-Host "Supported formats: E01, raw, img, dd, vmdk (case-insensitive)" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Found $($processedFiles.Count) file(s) to process" -ForegroundColor Cyan
Write-Host ""

# Loop through each forensic image file
foreach ($inputFile in $processedFiles) {
    # Extract clean filename for output
    $filename = Get-CleanFilename $inputFile.FullName
    
    Write-Host "Processing: $($inputFile.Name)" -ForegroundColor Cyan
    Write-Host "Output name: $filename" -ForegroundColor Cyan

    # Prepare paths for Docker
    $outputCsvPath = Join-Path $csvDir "$filename.csv"
    $outputLogPath = Join-Path $logsDir "$filename.log"
    
    # Docker arguments for psteal
    $dockerArgs = @(
        "run", "--rm",
        "-v", "${INPUT_DIR}:/data:ro",
        "-v", "${HOST_OUTPUT_DIR}:/output",
        "log2timeline/plaso",
        "psteal",
        "--source", "/data/$($inputFile.Name)",
        "--output-format", "dynamic",
        "--fields", "date,datetime,description,description_short,display_name,filename,host,hostname,inode,macb,message,message_short,source,sourcetype,source_long,tag,time,timestamp_desc,timezone,type,user,username,zone",
        "--timezone", "UTC",
        "--vss-stores", "all",
        "--partitions", "all",
        "--quiet",
        "-w", "/output/csv/$filename.csv"
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

        $successMsg = "✅ Saved csv output to: $outputCsvPath"
        Write-Host $successMsg -ForegroundColor Green
        Add-Content -Path $outputLogPath -Value $successMsg
        
        $logMsg = "📋 Saved logs to: $outputLogPath"
        Write-Host $logMsg -ForegroundColor Green
        Add-Content -Path $outputLogPath -Value $logMsg
        Write-Host ""
    }
    catch {
        $errorMsg = "Error processing $($inputFile.Name): $_"
        Write-Host $errorMsg -ForegroundColor Red
        Add-Content -Path $outputLogPath -Value $errorMsg
    }
}

Write-Host "🎉 Processing complete. Processed $($processedFiles.Count) forensic image file(s)." -ForegroundColor Green
