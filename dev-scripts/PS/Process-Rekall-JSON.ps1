# Process-Rekall-JSON.ps1
# PowerShell version of process-rekall-json.sh (simplified)

# Ensure correct filepath assigned when referenced
$SCRIPT_DIR = $PSScriptRoot
$REPO_ROOT_DIR = Split-Path -Path $SCRIPT_DIR -Parent

# Set the input directory containing memory dump files
$INPUT_DIR = Join-Path $REPO_ROOT_DIR "data_store\raw\memory"

# Set the host output directory
$HOST_OUTPUT_DIR = Join-Path $REPO_ROOT_DIR "data_store\processed\rekall"

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
Write-Host "Rekall Memory Timeline Generation" -ForegroundColor Cyan
Write-Host ""
Write-Host "Repository Root: $REPO_ROOT_DIR"
Write-Host "Input Directory: $INPUT_DIR"
Write-Host "Output Directory: $HOST_OUTPUT_DIR"
Write-Host ""

# Ensure the host output directories exist
$jsonDir = Join-Path $HOST_OUTPUT_DIR "json"
$logsDir = Join-Path $HOST_OUTPUT_DIR "logs"
$profilesDir = Join-Path $HOST_OUTPUT_DIR "profiles"
$rawOutputDir = Join-Path $HOST_OUTPUT_DIR "raw_output"

@($jsonDir, $logsDir, $profilesDir, $rawOutputDir) | ForEach-Object {
    if (-not (Test-Path $_)) {
        New-Item -ItemType Directory -Path $_ -Force | Out-Null
    }
}

# Set permissions
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
Write-Host "Checking for memory dump files in: $INPUT_DIR" -ForegroundColor Cyan
if (Test-Path $INPUT_DIR) {
    Get-ChildItem -Path $INPUT_DIR | Select-Object Name, @{N='Size';E={"{0:N2} MB" -f ($_.Length / 1MB)}} | Format-Table -AutoSize
}
else {
    Write-Host "Input directory does not exist: $INPUT_DIR" -ForegroundColor Red
    exit 1
}

# Function to extract clean filename for output
function Get-CleanFilename {
    param([string]$FilePath)
    
    $filename = Split-Path -Leaf $FilePath
    # Remove all extensions and handle multi-part names better
    $baseName = $filename -split '\.' | Select-Object -First 1
    return $baseName
}

# Function to detect memory dump profile using imageinfo
function Get-MemoryProfile {
    param(
        [string]$MemoryFile,
        [string]$Filename
    )
    
    $profileFile = Join-Path $profilesDir "${Filename}_profile.txt"
    
    Write-Host "Detecting memory dump profile for: $Filename" -ForegroundColor Yellow
    
    # Run imageinfo to detect profile with timeout
    try {
        $dockerArgs = @(
            "run", "--rm",
            "-v", "${INPUT_DIR}:/data:ro",
            "remnux/rekall",
            "bash", "-c",
            "rekall -f /data/`"$(Split-Path -Leaf $MemoryFile)`" --quiet --logging_level ERROR imageinfo"
        )
        
        $output = & docker $dockerArgs 2>&1
        $output | Out-File -FilePath $profileFile -Encoding UTF8
        
        if ($LASTEXITCODE -eq 0) {
            # Extract suggested profile from imageinfo output
            $suggestedProfile = $output | Select-String -Pattern "Suggested Profile|Win.*x64|Win.*x86|Linux.*x64|Darwin.*x64" | Select-Object -First 1
            
            if ($suggestedProfile) {
                $profile = ($suggestedProfile.Line -split '\s+' | Where-Object { $_ -match "Win|Linux|Darwin" }) | Select-Object -First 1
                Write-Host "Detected profile: $profile" -ForegroundColor Green
                return $profile
            }
        }
    }
    catch {
        Write-Host "Warning: Profile detection failed for $Filename : $_" -ForegroundColor Yellow
        "Error: Profile detection failed - $_" | Out-File -FilePath $profileFile -Encoding UTF8
    }
    
    Write-Host "Could not detect profile for $Filename" -ForegroundColor Yellow
    return $null
}

# Function to run Rekall plugins
function Invoke-RekallPlugin {
    param(
        [string]$MemoryFile,
        [string]$Profile,
        [string]$Plugin,
        [string]$OutputFile,
        [string]$LogFile
    )
    
    Write-Host "  Running plugin: $Plugin" -ForegroundColor Cyan
    
    try {
        $dockerArgs = @(
            "run", "--rm",
            "-v", "${INPUT_DIR}:/data:ro",
            "-v", "${HOST_OUTPUT_DIR}:/output",
            "remnux/rekall",
            "bash", "-c",
            "rekall -f /data/`"$(Split-Path -Leaf $MemoryFile)`" --profile $Profile --quiet --logging_level ERROR $Plugin --output-filename /output/raw_output/$(Split-Path -Leaf $OutputFile)"
        )
        
        & docker $dockerArgs 2>>$LogFile
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "    ✅ $Plugin completed successfully" -ForegroundColor Green
            return $true
        }
        else {
            Write-Host "    ❌ $Plugin failed" -ForegroundColor Red
            return $false
        }
    }
    catch {
        Write-Host "    ❌ Error running $Plugin : $_" -ForegroundColor Red
        Add-Content -Path $LogFile -Value "Error running $Plugin : $_"
        return $false
    }
}

# Function to analyze memory dump
function Invoke-MemoryAnalysis {
    param(
        [string]$MemoryFile,
        [string]$Filename,
        [string]$Profile
    )
    
    $logFile = Join-Path $logsDir "${Filename}_analysis.log"
    $jsonFile = Join-Path $jsonDir "${Filename}_timeline.json"
    
    Write-Host "Starting memory analysis for: $Filename" -ForegroundColor Green
    
    # Common Rekall plugins for timeline analysis
    $plugins = @(
        "pslist",
        "psscan", 
        "netscan",
        "filescan",
        "handles",
        "dlllist",
        "cmdline",
        "envars"
    )
    
    $successfulPlugins = @()
    
    foreach ($plugin in $plugins) {
        $outputFile = "${Filename}_${plugin}.txt"
        $success = Invoke-RekallPlugin -MemoryFile $MemoryFile -Profile $Profile -Plugin $plugin -OutputFile $outputFile -LogFile $logFile
        
        if ($success) {
            $successfulPlugins += $plugin
        }
    }
    
    # Create a summary JSON
    $summary = @{
        filename = $Filename
        profile = $Profile
        timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ"
        successful_plugins = $successfulPlugins
        total_plugins = $plugins.Count
        success_rate = [math]::Round(($successfulPlugins.Count / $plugins.Count) * 100, 2)
    }
    
    $summary | ConvertTo-Json -Depth 3 | Out-File -FilePath $jsonFile -Encoding UTF8
    
    Write-Host "Analysis complete for $Filename" -ForegroundColor Green
    Write-Host "  Successful plugins: $($successfulPlugins.Count)/$($plugins.Count)" -ForegroundColor Cyan
}

# Collect all memory dump files with supported extensions
$memoryFiles = @()

# Define patterns for different memory dump file types
$patterns = @(
    "*.dmp", "*.DMP",
    "*.raw", "*.RAW", 
    "*.img", "*.IMG",
    "*.mem", "*.MEM",
    "*.bin", "*.BIN",
    "*.dd", "*.DD",
    "*.vmem", "*.VMEM",
    "*.vmsn", "*.VMSN",
    "*.vmss", "*.VMSS",
    "*.lime", "*.LIME",
    "*.core", "*.CORE",
    "*.crash", "*.CRASH"
)

foreach ($pattern in $patterns) {
    $files = Get-ChildItem -Path $INPUT_DIR -Filter $pattern -File -ErrorAction SilentlyContinue
    $memoryFiles += $files
}

# Remove duplicates and sort
$memoryFiles = $memoryFiles | Sort-Object FullName -Unique

# Categorize files by potential OS (simplified heuristics)
$windowsFiles = $memoryFiles | Where-Object { $_.Name -match '\.(dmp|mem|img|raw|vmem)$' }
$linuxFiles = $memoryFiles | Where-Object { $_.Name -match '\.(lime|core|dd)$' }
$macosFiles = $memoryFiles | Where-Object { $_.Name -match '\.(crash|core)$' }

Write-Host "File categorization:" -ForegroundColor Cyan
Write-Host "  Windows-like files: $($windowsFiles.Count)" -ForegroundColor Yellow
Write-Host "  Linux-like files: $($linuxFiles.Count)" -ForegroundColor Yellow  
Write-Host "  macOS-like files: $($macosFiles.Count)" -ForegroundColor Yellow

$totalFiles = $memoryFiles.Count

if ($totalFiles -eq 0) {
    Write-Host "Error: No supported memory dump files found in $INPUT_DIR" -ForegroundColor Red
    Write-Host "Supported formats: dmp, raw, img, mem, bin, dd, vmem, vmsn, vmss, lime, core, crash" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Found $totalFiles memory dump files to process" -ForegroundColor Green
Write-Host ""

# Main processing loop
foreach ($memoryFile in $memoryFiles) {
    $filename = Get-CleanFilename $memoryFile.FullName
    
    Write-Host "Processing: $($memoryFile.Name)" -ForegroundColor Cyan
    Write-Host "Output name: $filename" -ForegroundColor Cyan
    
    # Detect profile
    $profile = Get-MemoryProfile -MemoryFile $memoryFile.FullName -Filename $filename
    
    if ($profile) {
        # Run analysis with detected profile
        Invoke-MemoryAnalysis -MemoryFile $memoryFile.FullName -Filename $filename -Profile $profile
    }
    else {
        Write-Host "Skipping analysis for $filename due to profile detection failure" -ForegroundColor Yellow
        
        # Log the failure
        $logFile = Join-Path $logsDir "${filename}_analysis.log"
        "Profile detection failed - cannot proceed with analysis" | Out-File -FilePath $logFile -Encoding UTF8
    }
    
    Write-Host ""
}

Write-Host "🎉 Memory analysis complete. Processed $totalFiles memory dump files." -ForegroundColor Green
Write-Host "Check individual JSON files and logs for detailed results." -ForegroundColor Cyan
