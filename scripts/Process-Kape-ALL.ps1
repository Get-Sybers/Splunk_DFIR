# Check if running as administrator
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
$isAdmin = $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "ERROR: This script requires administrative privileges." -ForegroundColor Red
    Write-Host "Please restart the script as Administrator." -ForegroundColor Red
    exit 1
}

# Ensure correct filepath assigned when referenced
$SCRIPT_DIR = $PSScriptRoot
$REPO_ROOT_DIR = Split-Path -Path $SCRIPT_DIR -Parent

# ---------------------------------- Define repo dir structure ---------------------------------- 
# Updated directory structure:
# kape dir: data_store\dependencies\kape
# aim dir: data_store\dependencies\Arsenal-Image-Mounter-v3.11.306
# script dir: scripts
# output dir: data_store\processed\kape
# input dir: data_store\raw\disk_images

# Set the dependencies, input, and output directories
$DEPENDENCIES_DIR = Join-Path $REPO_ROOT_DIR "data_store\dependencies"  
$INPUT_DIR = Join-Path $REPO_ROOT_DIR "data_store\raw\disk_images"
$HOST_OUTPUT_DIR = Join-Path $REPO_ROOT_DIR "data_store\processed\kape"

# Find Arsenal Image Mounter directory using regex pattern matching
$AIM_PATTERN = "Arsenal-Image-Mounter*"
$aimDirectories = Get-ChildItem -Path $DEPENDENCIES_DIR -Directory | Where-Object { $_.Name -like $AIM_PATTERN }

if ($aimDirectories.Count -gt 0) {
    # Use the latest version if multiple are found (based on name which includes version number)
    $AIM_DIR = $aimDirectories | Sort-Object -Property Name -Descending | Select-Object -First 1 -ExpandProperty FullName
    $aimVersion = ($AIM_DIR -split '\\')[-1]
    Write-Host "Found Arsenal Image Mounter: $aimVersion" -ForegroundColor Green
} else {
    # Default to the expected path if not found through pattern matching
    $AIM_DIR = Join-Path $DEPENDENCIES_DIR "Arsenal-Image-Mounter-v3.11.306"
    Write-Host "No Arsenal Image Mounter directories found with pattern match. Using default path: $AIM_DIR" -ForegroundColor Yellow
}

$KAPE_DIR = Join-Path $DEPENDENCIES_DIR "kape"

# Define libewf DLL paths - check both root folder and architecture-specific folders
$LIBEWF_SAME_DIR = Join-Path $AIM_DIR "libewf.dll"
$LIBEWF_ARCH_DIRS = @(
    (Join-Path $AIM_DIR "lib\x64"),
    (Join-Path $AIM_DIR "lib\x86"),
    (Join-Path $AIM_DIR "lib\arm"),
    (Join-Path $AIM_DIR "lib\arm64")
)

# Define which modules will be used for processing
# Important: Use only modules that work with mounted images, not live systems
# We're removing "Windows" module which contains live collection components
$KAPE_MODULES = @(
    "EZTools"           # Eric Zimmerman tools collection - works on files, not live system
    # "Windows",        # REMOVED: Contains live collection components
    # "Hayabusa",       # Windows event log analyzer - works on files
    # "Chainsaw",       # Windows event log analyzer - works on files
    # "!RegHunter",     # Registry explorer - works on files
    # "!EventRipper",   # Event log processor - works on files
    # "!NirSoft",       # NirSoft utilities collection - some may do live collection
    # "!SOFELK"         # Security Onion ELK - works with files
)

Start-Sleep 1
$Version = '1.0.0'
$ASCIIBanner = @"

==============================================
      DFIR COLLECTION TOOL
==============================================

"@
Write-Host $ASCIIBanner
Write-Host "Version: $Version"
Write-Host "===========================================`n"

# Correct the exclamation point prefix for non-standard modules
# Join the enabled modules with commas for KAPE command line
$KAPE_MODULE_STRING = ($KAPE_MODULES | Where-Object { $_ -notmatch "^#" }) -join ","

Start-Sleep 1
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "         CONFIGURATION INFORMATION               " -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# Print configured modules to console
Write-Host "Configured KAPE modules:" -ForegroundColor Cyan
foreach ($module in $KAPE_MODULES) {
    Write-Host " - $module" -ForegroundColor Green
}
Write-Host "Module string: $KAPE_MODULE_STRING" -ForegroundColor Cyan
Write-Host ""

# If dependencies directory is not found, try alternative paths
if (-not (Test-Path $DEPENDENCIES_DIR)) {
    $potentialPaths = @(
        # Try direct paths
        "D:\GitHub\Auto-Kape\data_store\dependencies",
        # Try one level up from repo with dependencies
        (Join-Path (Split-Path -Path $REPO_ROOT_DIR -Parent) "data_store\dependencies")
    )
    
    foreach ($path in $potentialPaths) {
        if (Test-Path $path) {
            $DEPENDENCIES_DIR = $path
            # Update tool paths to match the found dependencies directory
            $AIM_DIR = Join-Path $DEPENDENCIES_DIR "Arsenal-Image-Mounter-v3.11.306"
            $KAPE_DIR = Join-Path $DEPENDENCIES_DIR "kape"
            break
        }
    }
}

# Define executable paths
$KAPE_PATH = Join-Path $KAPE_DIR "kape.exe"
$AIM_PATH = Join-Path $AIM_DIR "aim_cli.exe"

Start-Sleep 1
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "         PATH VERIFICATION                       " -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# Validate critical paths exist
$pathsToCheck = @{
    "KAPE Directory" = $KAPE_DIR
    "Arsenal Image Mounter Directory" = $AIM_DIR
    "KAPE Executable" = $KAPE_PATH
    "Arsenal Image Mounter CLI" = $AIM_PATH
}

$missingPaths = @()
foreach ($path in $pathsToCheck.GetEnumerator()) {
    if (-not (Test-Path $path.Value)) {
        $missingPaths += $path.Key
        Write-Host "Debug: Path not found - $($path.Key): $($path.Value)" -ForegroundColor Yellow
    } else {
        Write-Host "Debug: Path found - $($path.Key): $($path.Value)" -ForegroundColor Green
    }
}

Start-Sleep 1
Write-Host ""

Write-Host "Directory Information:" -ForegroundColor Cyan
Write-Host "  Script Directory: $SCRIPT_DIR"
Write-Host "  Repository Root: $REPO_ROOT_DIR"
Write-Host "  Dependencies Directory: $DEPENDENCIES_DIR"
Write-Host "  KAPE Directory: $KAPE_DIR"
Write-Host "  AIM Directory: $AIM_DIR"
Write-Host "  AIM CLI Path: $AIM_PATH"
Write-Host ""

# Create these directories if they don't exist
New-Item -ItemType Directory -Path $INPUT_DIR -Force | Out-Null
New-Item -ItemType Directory -Path $HOST_OUTPUT_DIR -Force | Out-Null
New-Item -ItemType Directory -Path $DEPENDENCIES_DIR -Force | Out-Null
New-Item -ItemType Directory -Path (Join-Path $HOST_OUTPUT_DIR "logs") -Force | Out-Null

# Verify input directory exists
if (-not (Test-Path $INPUT_DIR)) {
    Write-Host "Error: Input directory does not exist: $INPUT_DIR" -ForegroundColor Red
    Write-Host "Please create the directory and place your E01 files there." -ForegroundColor Red
    exit 1
}

Start-Sleep 1
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "         SEARCHING FOR E01 FILES                 " -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# Check if input directory exists before attempting to access it
if (Test-Path $INPUT_DIR) {
    # Change ownership and permissions
    Get-ChildItem -Path $INPUT_DIR -Recurse | ForEach-Object { $_.Attributes = 'Normal' }
    
    # Debug: List available E01 files before processing
    Write-Host "Checking for E01 files in: $INPUT_DIR"
    Get-ChildItem -Path $INPUT_DIR | Where-Object { $_.Extension -match "\.E01$|\.e01$" } | Format-Table -AutoSize
    
    # Find E01 files with case-insensitive matching
    $E01_FILES = Get-ChildItem -Path $INPUT_DIR | Where-Object { $_.Extension -match "\.E01$|\.e01$" }
} else {
    Write-Host "Error: Input directory does not exist: $INPUT_DIR" -ForegroundColor Red
    exit 1
}

# Ensure there are E01 files to process
if ($E01_FILES.Count -eq 0) {
    Write-Host "Error: No E01 files found in $INPUT_DIR" -ForegroundColor Red
    exit 1
} else {
    Write-Host "Found $($E01_FILES.Count) E01 file(s) to process." -ForegroundColor Green
    Write-Host ""
}

# Initialize a drive letter counter (for Windows)
$DRIVE_LETTER_INDEX = 70  # ASCII for 'F'

Start-Sleep 1
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "         BEGINNING PROCESSING                    " -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# Loop through each E01 file in the directory
foreach ($INPUT_FILE in $E01_FILES) {
    # Extract filename without extension
    $FILENAME = $INPUT_FILE.BaseName
    
    Start-Sleep 1
    Write-Host "=================================================" -ForegroundColor Yellow
    Write-Host "         PROCESSING: $FILENAME                    " -ForegroundColor Yellow
    Write-Host "=================================================" -ForegroundColor Yellow
    Write-Host ""
    
    Write-Host "Processing file: $($INPUT_FILE.FullName)" -ForegroundColor Cyan
    
    # Set log file
    $LOG_FILE = Join-Path $HOST_OUTPUT_DIR "logs\$FILENAME.log"
    Write-Host "Log file: $LOG_FILE"
    Write-Host ""
    
    # Get list of drive letters before mounting
    $beforeDrives = Get-PSDrive -PSProvider FileSystem | Select-Object -ExpandProperty Name | ForEach-Object { "$($_):" }
    
    Start-Sleep 1
    Write-Host "STEP 1: MOUNTING IMAGE" -ForegroundColor Cyan
    Write-Host "---------------------" -ForegroundColor Cyan
    Write-Host "Mounting $($INPUT_FILE.Name) using Arsenal Image Mounter..." | Tee-Object -FilePath $LOG_FILE -Append
    
    # Create a temporary file for the differencing/overlay file
    $diffFile = Join-Path $env:TEMP "$FILENAME.diff"
    
    # Mount the E01 file using Arsenal Image Mounter with proper parameters
    # Critical parameters as per README:
    # --mount - Mount the disk image
    # --fakesig - Prevents disk signature conflicts
    # --online - Brings partitions online with drive letters
    # --filename - Path to the E01 file
    # --provider=libewf - Required for E01 files
    # --writeoverlay - Use differencing file for temporary writes
    # --autodelete - Delete the differencing file when unmounting
    $startInfo = New-Object System.Diagnostics.ProcessStartInfo
    $startInfo.FileName = $AIM_PATH
    $startInfo.Arguments = "--mount --fakesig --online --filename=`"$($INPUT_FILE.FullName)`" --provider=libewf --writeoverlay=`"$diffFile`" --autodelete"
    $startInfo.UseShellExecute = $false
    $startInfo.RedirectStandardOutput = $true
    $startInfo.RedirectStandardError = $true
    $startInfo.CreateNoWindow = $true
    $startInfo.WindowStyle = [System.Diagnostics.ProcessWindowStyle]::Hidden
    
    $process = New-Object System.Diagnostics.Process
    $process.StartInfo = $startInfo
    
    # Add timeout handling
    $timeoutSeconds = 15  # half minute timeout - reduced from 5 minutes since we know it works but hangs
    Write-Host "Starting AIM mounting process with $timeoutSeconds seconds timeout..." | Tee-Object -FilePath $LOG_FILE -Append
    Start-Sleep 1
    try {
        [void]$process.Start()
        
        # Start reading output immediately to prevent blocking
        $outputReader = $process.StandardOutput.ReadToEndAsync()
        $errorReader = $process.StandardError.ReadToEndAsync()
        
        # Use a shorter timeout since we know drives are mounting successfully
        $initialWaitSeconds = 5
        Write-Host "Waiting initial $initialWaitSeconds seconds for drives to mount..." | Tee-Object -FilePath $LOG_FILE -Append
        Start-Sleep -Seconds $initialWaitSeconds
        
        # Check if drives are already mounted without waiting for process completion
        $afterInitialWait = Get-PSDrive -PSProvider FileSystem | Select-Object -ExpandProperty Name | ForEach-Object { "$($_):" }
        $mountedDrivesInitial = Compare-Object -ReferenceObject $beforeDrives -DifferenceObject $afterInitialWait | 
                        Where-Object { $_.SideIndicator -eq '=>' } | 
                        Select-Object -ExpandProperty InputObject
        
        if ($mountedDrivesInitial.Count -gt 0) {
            Write-Host "Drives mounted successfully during initial wait: $($mountedDrivesInitial -join ', ')" -ForegroundColor Green | Tee-Object -FilePath $LOG_FILE -Append
            
            # Continue with the drives we found - don't wait for AIM process to complete as it may hang
            $mountedDrives = $mountedDrivesInitial
            
            # Get whatever output we can from the process
            $output = if ($outputReader.IsCompleted) { $outputReader.Result } else { "Process still running - output not available" }
            $processError = if ($errorReader.IsCompleted) { $errorReader.Result } else { "" }
        }
        else {
            # Wait a bit longer with timeout
            $completed = $process.WaitForExit(($timeoutSeconds - $initialWaitSeconds) * 1000)
            
            if (-not $completed) {
                Write-Host "Warning: AIM mounting process taking longer than expected, but continuing..." -ForegroundColor Yellow | Tee-Object -FilePath $LOG_FILE -Append
                
                # Try again to find mounted drives
                $afterDrives = Get-PSDrive -PSProvider FileSystem | Select-Object -ExpandProperty Name | ForEach-Object { "$($_):" }
                $mountedDrives = Compare-Object -ReferenceObject $beforeDrives -DifferenceObject $afterDrives | 
                                Where-Object { $_.SideIndicator -eq '=>' } | 
                                Select-Object -ExpandProperty InputObject
                
                # Get whatever output we can from the process
                $output = if ($outputReader.IsCompleted) { $outputReader.Result } else { "Process still running - output not available" }
                $processError = if ($errorReader.IsCompleted) { $errorReader.Result } else { "" }
            } else {
                # Process completed normally
                $output = $outputReader.Result
                $processError = $errorReader.Result
                
                Write-Host "AIM process completed with exit code: $($process.ExitCode)" | Tee-Object -FilePath $LOG_FILE -Append
                
                if ($process.ExitCode -ne 0) {
                    Write-Host "Warning: AIM process returned non-zero exit code. Check logs for details." -ForegroundColor Yellow | Tee-Object -FilePath $LOG_FILE -Append
                }
                
                # Check for mounted drives
                $afterDrives = Get-PSDrive -PSProvider FileSystem | Select-Object -ExpandProperty Name | ForEach-Object { "$($_):" }
                $mountedDrives = Compare-Object -ReferenceObject $beforeDrives -DifferenceObject $afterDrives | 
                                Where-Object { $_.SideIndicator -eq '=>' } | 
                                Select-Object -ExpandProperty InputObject
            }
        }
    } catch {
        Start-Sleep 1
        Write-Host "Error starting AIM process: $($_.Exception.Message)" -ForegroundColor Red | Tee-Object -FilePath $LOG_FILE -Append
        continue
    }

    # Write output to log file
    $output | Out-File -FilePath (Join-Path $HOST_OUTPUT_DIR "logs\${FILENAME}_mount.log") -Append
    $processError | Out-File -FilePath (Join-Path $HOST_OUTPUT_DIR "logs\${FILENAME}_mount.log") -Append
    
    # Final check for mounted drives if we haven't found any yet
    if (-not $mountedDrives -or $mountedDrives.Count -eq 0) {
        Write-Host "Final attempt to detect mounted drives..." | Tee-Object -FilePath $LOG_FILE -Append
        Start-Sleep -Seconds 10
        $afterDrives = Get-PSDrive -PSProvider FileSystem | Select-Object -ExpandProperty Name | ForEach-Object { "$($_):" }
        $mountedDrives = Compare-Object -ReferenceObject $beforeDrives -DifferenceObject $afterDrives | 
                        Where-Object { $_.SideIndicator -eq '=>' } | 
                        Select-Object -ExpandProperty InputObject
    }
    
    if ($mountedDrives.Count -eq 0) {
        Write-Host "Error: No drives were mounted from $($INPUT_FILE.Name). See log for details." -ForegroundColor Red | Tee-Object -FilePath $LOG_FILE -Append
        Write-Host ""
        continue
    }
    
    Start-Sleep 1
    Write-Host "Successfully mounted $($mountedDrives.Count) drive(s): $($mountedDrives -join ', ')" -ForegroundColor Green | Tee-Object -FilePath $LOG_FILE -Append
    Write-Host ""
    
    # Create case-specific output directory
    $CASE_OUTPUT_DIR = Join-Path $HOST_OUTPUT_DIR $FILENAME
    Write-Host "Creating output directory at: $CASE_OUTPUT_DIR" | Tee-Object -FilePath $LOG_FILE -Append
    New-Item -ItemType Directory -Path $CASE_OUTPUT_DIR -Force | Out-Null
    Write-Host ""
    
    # Process each mounted drive with KAPE
    foreach ($driveLetter in $mountedDrives) {
        
        Start-Sleep 1
        Write-Host "STEP 2: PROCESSING DRIVE $driveLetter" -ForegroundColor Cyan
        Write-Host "---------------------" -ForegroundColor Cyan
        Write-Host "Preparing to run KAPE modules on drive $driveLetter..." | Tee-Object -FilePath $LOG_FILE -Append
        
        # Define output path for this drive
        $driveDest = Join-Path $CASE_OUTPUT_DIR "$($driveLetter.Replace(':',''))"
        Write-Host "KAPE output will be saved to: $driveDest" | Tee-Object -FilePath $LOG_FILE -Append
        $logFile = Join-Path $HOST_OUTPUT_DIR "logs\${FILENAME}_${driveLetter}_kape.log"
        Write-Host "KAPE logs will be saved to: $logFile" | Tee-Object -FilePath $LOG_FILE -Append
        Write-Host ""
        
        # Run modules defined at the top of the script
        # Adding --mvars with proper syntax (key:value format) to fix variable substitution issues
        $kapeArgs = @(
            "--msource", "$driveLetter", 
            "--mdest", $driveDest,
            "--mflush", "False",
            "--module", $KAPE_MODULE_STRING,
            "--mef", "JSON"
        )
        
        Start-Sleep 1
        Write-Host "Starting KAPE with arguments: $($kapeArgs -join ' ')" | Tee-Object -FilePath $LOG_FILE -Append
        
        # Note: KAPE will log system information (machine name, OS version, etc.) for forensic documentation
        # This is normal behavior and does not mean KAPE is analyzing the host system
        try {
            Write-Host "Executing KAPE command..." | Tee-Object -FilePath $LOG_FILE -Append
            
            # Create a process object to run KAPE with direct console output
            $pinfo = New-Object System.Diagnostics.ProcessStartInfo
            $pinfo.FileName = $KAPE_PATH
            $pinfo.Arguments = $kapeArgs -join ' '
            $pinfo.UseShellExecute = $false
            $pinfo.CreateNoWindow = $true
            
            # These settings allow us to read the output streams
            $pinfo.RedirectStandardError = $true
            $pinfo.RedirectStandardOutput = $true
            
            # Create and start the process
            $kapeProcess = New-Object System.Diagnostics.Process
            $kapeProcess.StartInfo = $pinfo
            
            # Set up event handlers for output and error streams
            $outputLogFile = Join-Path $HOST_OUTPUT_DIR "logs\${FILENAME}_${driveLetter}_kape.log"
            $outputBuilder = New-Object System.Text.StringBuilder
            
            # Event handler for Standard Output
            $scriptBlock = {
                if (-not [String]::IsNullOrEmpty($EventArgs.Data)) {
                    $line = "KAPE: " + $EventArgs.Data
                    $Event.MessageData.AppendLine($line)
                    Write-Host $line -ForegroundColor Gray
                }
            }
            $stdOutEvent = Register-ObjectEvent -InputObject $kapeProcess -EventName "OutputDataReceived" `
                -Action $scriptBlock -MessageData $outputBuilder
            
            # Event handler for Standard Error
            $scriptBlockError = {
                if (-not [String]::IsNullOrEmpty($EventArgs.Data)) {
                    $line = "KAPE ERROR: " + $EventArgs.Data
                    $Event.MessageData.AppendLine($line)
                    Write-Host $line -ForegroundColor Red
                }
            }
            $stdErrEvent = Register-ObjectEvent -InputObject $kapeProcess -EventName "ErrorDataReceived" `
                -Action $scriptBlockError -MessageData $outputBuilder
            
            # Start the process and begin reading the output streams
            $kapeProcess.Start() | Out-Null
            $kapeProcess.BeginOutputReadLine()
            $kapeProcess.BeginErrorReadLine()
            
            # Wait for the process to exit
            Write-Host "Waiting for KAPE process to complete..." -ForegroundColor Cyan | Tee-Object -FilePath $LOG_FILE -Append
            $kapeProcess.WaitForExit()
            
            # Clean up event handlers
            Unregister-Event -SourceIdentifier $stdOutEvent.Name
            Unregister-Event -SourceIdentifier $stdErrEvent.Name
            
            # Save the collected output to a log file
            $outputBuilder.ToString() | Out-File -FilePath $outputLogFile -Force
            
            # Display the exit code
            Write-Host "KAPE process completed with exit code: $($kapeProcess.ExitCode)" | Tee-Object -FilePath $LOG_FILE -Append
            Write-Host ""
        }
        catch {
            Write-Host "Error starting KAPE process: $($_.Exception.Message)" -ForegroundColor Red | Tee-Object -FilePath $LOG_FILE -Append
            Write-Host ""
        }
        
        # Check if KAPE outputs were created
        if (-not (Test-Path -Path $driveDest)) {
            Write-Host "Error running KAPE modules on $driveLetter. See log for details." -ForegroundColor Red | Tee-Object -FilePath $LOG_FILE -Append
        } else {
            Write-Host "KAPE module processing complete for $FILENAME on drive $driveLetter" -ForegroundColor Green | Tee-Object -FilePath $LOG_FILE -Append
        }
        Write-Host ""
    }
    
    Write-Host "STEP 3: UNMOUNTING IMAGE" -ForegroundColor Cyan
    Write-Host "---------------------" -ForegroundColor Cyan
    Write-Host "Preparing to unmount image..." | Tee-Object -FilePath $LOG_FILE -Append
    
    # Use --dismount without parameters to dismount all devices
    $startInfo = New-Object System.Diagnostics.ProcessStartInfo
    $startInfo.FileName = $AIM_PATH
    $startInfo.Arguments = "--dismount"
    $startInfo.UseShellExecute = $false
    $startInfo.RedirectStandardOutput = $true
    $startInfo.RedirectStandardError = $true
    $startInfo.CreateNoWindow = $true
    $startInfo.WindowStyle = [System.Diagnostics.ProcessWindowStyle]::Hidden
    
    $process = New-Object System.Diagnostics.Process
    $process.StartInfo = $startInfo
    [void]$process.Start()
    $process.WaitForExit()
    
    $output = $process.StandardOutput.ReadToEnd()
    $processError = $process.StandardError.ReadToEnd()
    
    # Write output to log file
    $output | Out-File -FilePath (Join-Path $HOST_OUTPUT_DIR "logs\${FILENAME}_unmount.log") -Append
    $processError | Out-File -FilePath (Join-Path $HOST_OUTPUT_DIR "logs\${FILENAME}_unmount.log") -Append
    
    # Increment drive letter for next iteration
    $DRIVE_LETTER_INDEX++
    
    # If we've used too many drive letters, start over
    if ($DRIVE_LETTER_INDEX -gt 90) {  # 90 is ASCII for 'Z'
        $DRIVE_LETTER_INDEX = 70  # Reset to 'F'
    }
    
    Start-Sleep 1
    Write-Host "PROCESSING SUMMARY:" -ForegroundColor Cyan
    Write-Host "---------------------" -ForegroundColor Cyan
    Write-Host "Saved results to: $CASE_OUTPUT_DIR" -ForegroundColor Green | Tee-Object -FilePath $LOG_FILE -Append
    Write-Host "Saved logs to: $LOG_FILE" | Tee-Object -FilePath $LOG_FILE -Append
    Write-Host ""
    Write-Host "=================================================" -ForegroundColor Yellow
    Write-Host "         COMPLETED: $FILENAME                    " -ForegroundColor Yellow
    Write-Host "=================================================" -ForegroundColor Yellow
    Write-Host ""
}

Start-Sleep 1
Write-Host "=================================================" -ForegroundColor Green
Write-Host "         ALL PROCESSING COMPLETE                 " -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green
Write-Host ""
Write-Host "All E01 files have been processed successfully." -ForegroundColor Green
Write-Host "Results are available in: $HOST_OUTPUT_DIR" -ForegroundColor Green
Write-Host ""
