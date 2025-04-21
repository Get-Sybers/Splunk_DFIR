# PowerShell script for processing E01 files with KAPE

# Ensure correct filepath assigned when referenced
$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
$REPO_ROOT_DIR = (Get-Item $SCRIPT_DIR).Parent.Parent.FullName

# Set the input directory containing E01 files
$INPUT_DIR = Join-Path -Path $REPO_ROOT_DIR -ChildPath "data_store/raw/disk_images"

# Set the host output directory for KAPE results
$HOST_OUTPUT_DIR = Join-Path -Path $REPO_ROOT_DIR -ChildPath "data_store/processed/kape"

# Path to KAPE executable (update this path as needed)
$KAPE_PATH = "C:\KAPE\kape.exe"

# Path to Arsenal Image Mounter (update as needed)
$AIM_CLI_PATH = "C:\Program Files\Arsenal Image Mounter\aim_cli.exe"

# Path to OSFMount (update as needed)
$OSF_PATH = "C:\Program Files\OSFMount\osfmount.exe"

################################################################################
Write-Host ""
Write-Host " ██████╗ ███████╗████████╗     ██╗  ██╗ █████╗ ██████╗ ███████╗" -ForegroundColor Cyan
Start-Sleep -Milliseconds 100
Write-Host "██╔════╝ ██╔════╝╚══██╔══╝     ██║ ██╔╝██╔══██╗██╔══██╗██╔════╝" -ForegroundColor Cyan
Start-Sleep -Milliseconds 100
Write-Host "██║  ███╗█████╗     ██║        █████╔╝ ███████║██████╔╝█████╗  " -ForegroundColor Cyan 
Start-Sleep -Milliseconds 100
Write-Host "██║   ██║██╔══╝     ██║        ██╔═██╗ ██╔══██║██╔═══╝ ██╔══╝  " -ForegroundColor Cyan
Start-Sleep -Milliseconds 100
Write-Host "╚██████╔╝███████╗   ██║        ██║  ██╗██║  ██║██║     ███████╗" -ForegroundColor Cyan
Start-Sleep -Milliseconds 100
Write-Host " ╚═════╝ ╚══════╝   ╚═╝        ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚══════╝" -ForegroundColor Cyan
Write-Host ""

Write-Host "Repository Root: $REPO_ROOT_DIR"
Write-Host ""

# Ensure the output directories exist
if (-not (Test-Path -Path $HOST_OUTPUT_DIR)) {
    New-Item -ItemType Directory -Path $HOST_OUTPUT_DIR -Force | Out-Null
}

$LogsDir = Join-Path -Path $HOST_OUTPUT_DIR -ChildPath "logs"
if (-not (Test-Path -Path $LogsDir)) {
    New-Item -ItemType Directory -Path $LogsDir -Force | Out-Null
}

# Check for required tools
if (-not (Test-Path -Path $KAPE_PATH)) {
    Write-Host "Error: KAPE not found at $KAPE_PATH" -ForegroundColor Red
    exit 1
}

# Check for available mounting tools
$hasAIM = Test-Path -Path $AIM_CLI_PATH
$hasOSF = Test-Path -Path $OSF_PATH

if (-not ($hasAIM -or $hasOSF)) {
    Write-Host "Warning: Neither Arsenal Image Mounter nor OSFMount found" -ForegroundColor Yellow
    Write-Host "Will attempt to use PowerShell to mount images instead" -ForegroundColor Yellow
}

# Debug: List available E01 files before processing
Write-Host "Checking for E01 files in: $INPUT_DIR" -ForegroundColor Green
if (Test-Path -Path $INPUT_DIR) {
    $E01_FILES = Get-ChildItem -Path $INPUT_DIR -Filter "*.E01" -File -Recurse
    if ($E01_FILES.Count -eq 0) {
        # Try case-insensitive search
        $E01_FILES = Get-ChildItem -Path $INPUT_DIR -Filter "*.e01" -File -Recurse
    }
} else {
    Write-Host "Error: Input directory not found: $INPUT_DIR" -ForegroundColor Red
    exit 1
}

# Ensure there are E01 files to process
if ($E01_FILES.Count -eq 0) {
    Write-Host "Error: No E01 files found in $INPUT_DIR" -ForegroundColor Red
    exit 1
}

# PowerShell Native Disk Mounting Capabilities:
# 
# 1. Mount-DiskImage: Mounts VHD, VHDX, ISO files
#    - Usage: Mount-DiskImage -ImagePath "C:\path\to\image.vhdx" -PassThru
#
# 2. Dismount-DiskImage: Unmounts previously mounted images
#    - Usage: Dismount-DiskImage -ImagePath "C:\path\to\image.vhdx"
#
# 3. Get-Disk, Get-Partition, Get-Volume: Access mounted disk information
#    - Usage: $diskImage = Mount-DiskImage -ImagePath $path -PassThru
#             $disk = Get-Disk -Number ($diskImage | Get-DiskImage).Number
#             $volumes = Get-Partition -DiskNumber $disk.Number | Get-Volume
#
# 4. Add-PartitionAccessPath: Assign mount points to partitions
#    - Usage: Add-PartitionAccessPath -DiskNumber 1 -PartitionNumber 2 -AccessPath "C:\MountPoint"
#
# Limitations:
# - Native PowerShell cmdlets cannot directly mount forensic image formats like E01
# - For E01/AFF/DD files, third-party tools like Arsenal Image Mounter or FTK Imager are required
# - PowerShell can still manage the process by calling these external tools
#
# When mounting forensic images in PowerShell:
# - Always mount read-only for forensic integrity
# - Consider validation of mounted image hash values
# - Ensure proper unmounting to prevent resource leaks

# Function to improve forensic image mounting with available tools
function Mount-ForensicImage {
    param (
        [string]$ImagePath,
        [switch]$ReadOnly = $true
    )
    
    $mountedDrive = $null
    $logFile = Join-Path -Path $LogsDir -ChildPath "$([System.IO.Path]::GetFileNameWithoutExtension($ImagePath))_mount.log"
    
    try {
        if ($ImagePath -match "\.(E01|e01)$") {
            # Store drive letters before mounting
            $beforeDrives = Get-CimInstance -ClassName Win32_LogicalDisk | Select-Object -ExpandProperty DeviceID
            
            # Try mounting with available tools in order of preference
            if (Test-Path -Path $AIM_CLI_PATH) {
                # Use Arsenal Image Mounter
                Write-Host "Mounting image with Arsenal Image Mounter: $ImagePath" -ForegroundColor Yellow
                $writeProtectFlag = if ($ReadOnly) { "--writeprotect" } else { "" }
                
                Start-Process -FilePath $AIM_CLI_PATH -ArgumentList "--mount", "--filename=$ImagePath", $writeProtectFlag -NoNewWindow -Wait -PassThru -RedirectStandardOutput $logFile
                
                # Wait for mounting to complete
                Start-Sleep -Seconds 5
                $mountSuccess = $true
            }
            elseif (Test-Path -Path $OSF_PATH) {
                # Use OSFMount instead
                Write-Host "Mounting image with OSFMount: $ImagePath" -ForegroundColor Yellow
                
                # OSFMount command arguments for E01 files
                # -a: mount (-d for dismount)
                # -t: disk type (auto, disk, optical, floppy, memory)
                # -f: file path
                # -m: driver letter to mount to (e.g., Z:)
                # -o: read-only flag
                
                # Get an available drive letter
                $availableDrive = Get-AvailableDriveLetter
                if (-not $availableDrive) {
                    Write-Host "No available drive letters found" -ForegroundColor Red
                    return $null
                }
                
                # OSFMount prefers drive letter without colon
                $driveLetter = $availableDrive.Replace(":", "")
                
                # Mount with OSFMount
                $osfArgs = @(
                    "-a",                   # mount action
                    "-t", "disk",           # disk type
                    "-f", "`"$ImagePath`"", # file path (quoted)
                    "-m", $driveLetter      # mount point
                )
                
                if ($ReadOnly) {
                    $osfArgs += "-o"        # read-only flag
                }
                
                $osfCommand = "$OSF_PATH $($osfArgs -join ' ')"
                Write-Host "OSFMount command: $osfCommand" -ForegroundColor DarkYellow
                
                $process = Start-Process -FilePath $OSF_PATH -ArgumentList $osfArgs -NoNewWindow -Wait -PassThru -RedirectStandardOutput $logFile
                
                # Wait for mounting to complete
                Start-Sleep -Seconds 5
                $mountSuccess = $true
                
                # Specify the drive letter explicitly since we assigned it
                $mountedDrive = "$($driveLetter):\"
                Write-Host "Image mounted at: $mountedDrive" -ForegroundColor Green
                return $mountedDrive
            }
            else {
                Write-Host "No suitable tool found for mounting E01 images" -ForegroundColor Red
                Add-Content -Path $logFile -Value "No suitable tool found for mounting E01 images."
                return $null
            }
            
            # Check for new drives if we used AIM (for OSF we already know the drive)
            if ($mountSuccess -and (Test-Path -Path $AIM_CLI_PATH)) {
                # Get newly added drives
                $afterDrives = Get-CimInstance -ClassName Win32_LogicalDisk | Select-Object -ExpandProperty DeviceID
                $newDrives = Compare-Object -ReferenceObject $beforeDrives -DifferenceObject $afterDrives -PassThru | 
                            Where-Object { $_.SideIndicator -eq "=>" } | 
                            Select-Object -ExpandProperty InputObject
                
                if ($newDrives) {
                    # Return the first new drive letter
                    $mountedDrive = $newDrives
                    Write-Host "Image mounted at: $mountedDrive" -ForegroundColor Green
                } else {
                    Write-Host "Failed to identify mount point. Check logs." -ForegroundColor Red
                }
            }
        }
        elseif ($ImagePath -match "\.(vhd|vhdx|iso)$") {
            # Native PowerShell mounting for supported formats
            Write-Host "Mounting image using PowerShell: $ImagePath" -ForegroundColor Yellow
            $diskImage = Mount-DiskImage -ImagePath $ImagePath -StorageType VHDX -Access ReadOnly -PassThru
            $diskNumber = ($diskImage | Get-DiskImage).Number
            $volumes = Get-Partition -DiskNumber $diskNumber | Get-Volume
            
            # Find the first volume with drive letter
            foreach ($volume in $volumes) {
                if ($volume.DriveLetter) {
                    $mountedDrive = "$($volume.DriveLetter):\"
                    Write-Host "Image mounted at: $mountedDrive" -ForegroundColor Green
                    break
                }
            }
        }
        else {
            Write-Host "Unsupported image format" -ForegroundColor Red
        }
    }
    catch {
        Write-Host "Error mounting image: $_" -ForegroundColor Red
        Add-Content -Path $logFile -Value "Error mounting image: $_"
    }
    
    return $mountedDrive
}

# Function to get first available drive letter for mounting
function Get-AvailableDriveLetter {
    $usedLetters = Get-CimInstance -ClassName Win32_LogicalDisk | Select-Object -ExpandProperty DeviceID | ForEach-Object { $_.Replace(":", "") }
    $allLetters = 67..90 | ForEach-Object { [char]$_ }  # C through Z
    
    foreach ($letter in $allLetters) {
        if ($usedLetters -notcontains $letter) {
            return "$letter`:"  # Return letter with colon
        }
    }
    
    return $null  # No available letters
}

# Function to unmount forensic image
function Unmount-ForensicImage {
    param (
        [string]$ImagePath,
        [string]$MountPoint
    )
    
    $logFile = Join-Path -Path $LogsDir -ChildPath "$([System.IO.Path]::GetFileNameWithoutExtension($ImagePath))_unmount.log"
    
    try {
        if ($ImagePath -match "\.(E01|e01)$") {
            if (Test-Path -Path $AIM_CLI_PATH) {
                # Use Arsenal Image Mounter to dismount
                Write-Host "Unmounting image with Arsenal Image Mounter" -ForegroundColor Yellow
                $process = Start-Process -FilePath $AIM_CLI_PATH -ArgumentList "--dismount", "--all" -NoNewWindow -Wait -PassThru -RedirectStandardOutput $logFile
            }
            elseif (Test-Path -Path $OSF_PATH) {
                # Use OSFMount to dismount
                Write-Host "Unmounting image with OSFMount" -ForegroundColor Yellow
                
                # Extract drive letter from mount point (e.g., "C:\" -> "C")
                $driveLetter = $MountPoint.Substring(0, 1)
                
                $osfArgs = @(
                    "-d",           # dismount action
                    "-m", $driveLetter  # drive letter to dismount
                )
                
                $process = Start-Process -FilePath $OSF_PATH -ArgumentList $osfArgs -NoNewWindow -Wait -PassThru -RedirectStandardOutput $logFile
            }
        }
        else {
            # Use built-in PowerShell for VHD/ISO
            Write-Host "Unmounting image using PowerShell" -ForegroundColor Yellow
            Dismount-DiskImage -ImagePath $ImagePath | Out-Null
        }
        
        Write-Host "Image unmounted successfully" -ForegroundColor Green
    }
    catch {
        Write-Host "Error unmounting image: $_" -ForegroundColor Red
        Add-Content -Path $logFile -Value "Error unmounting image: $_"
    }
}

# Process each E01 file
foreach ($e01File in $E01_FILES) {
    $inputFile = $e01File.FullName
    $filename = [System.IO.Path]::GetFileNameWithoutExtension($inputFile)
    $targetDir = Join-Path -Path $HOST_OUTPUT_DIR -ChildPath $filename
    
    # Create output directory for this specific E01 file
    if (-not (Test-Path -Path $targetDir)) {
        New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
    }
    
    $logFile = Join-Path -Path $LogsDir -ChildPath "$filename.log"
    
    Write-Host "=================================" -ForegroundColor Cyan
    Write-Host "Processing: $inputFile" -ForegroundColor Cyan
    Write-Host "=================================" -ForegroundColor Cyan
    
    # Mount the E01 file
    $mountPoint = Mount-ForensicImage -ImagePath $inputFile -ReadOnly
    
    if ($mountPoint) {
        try {
            # Run KAPE against the mounted image
            Write-Host "Running KAPE against mounted image at $mountPoint..." -ForegroundColor Yellow
            
            # Configure KAPE to run Eric Zimmerman modules with JSON output
            $kapeArgs = @(
                "--msource $mountPoint",                        # Source for module processing is the mounted drive
                "--mdest $targetDir\modules",                   # Output directory for module processing
                "--mflush",                                     # Clear any existing module output files
                # Run Eric Zimmerman modules - use ! prefix for module groups
                "--module !EZTools",                           # Use the EZTools group which includes all EZ modules
                "--mvars jsonf=true",                           # Set JSON output format for modules
                "--gui",                                        # Show module progress dialog
                "--debug",                                      # Provide more verbose console output
                "--zsource $targetDir\modules",                 # Compress from the module output directory
                "--zdest $targetDir\compressed",                # Save compressed output here
                "--zflush",                                     # Clear any existing compression files
                "--zip $filename-EZtools-json"                  # Create a zip with this name
            )
            
            $kapeCommand = "$KAPE_PATH $($kapeArgs -join ' ')"
            Write-Host "Executing: $kapeCommand" -ForegroundColor DarkYellow
            
            # Create the compression directory if it doesn't exist
            $compressDir = Join-Path -Path $targetDir -ChildPath "compressed"
            if (-not (Test-Path -Path $compressDir)) {
                New-Item -ItemType Directory -Path $compressDir -Force | Out-Null
            }
            
            # Execute KAPE
            $process = Start-Process -FilePath $KAPE_PATH -ArgumentList $kapeArgs -NoNewWindow -Wait -PassThru -RedirectStandardOutput "$targetDir\kape_stdout.log" -RedirectStandardError "$targetDir\kape_stderr.log"
            
            if ($process.ExitCode -eq 0) {
                Write-Host "KAPE processing completed successfully" -ForegroundColor Green
            } else {
                Write-Host "KAPE processing completed with exit code: $($process.ExitCode)" -ForegroundColor Yellow
            }
        } catch {
            Write-Host "Error running KAPE: $_" -ForegroundColor Red
            Add-Content -Path $logFile -Value "Error running KAPE: $_"
        } finally {
            # Always attempt to unmount the image
            Unmount-ForensicImage -ImagePath $inputFile -MountPoint $mountPoint
        }
    } else {
        Write-Host "Failed to mount image. Skipping KAPE processing for $inputFile" -ForegroundColor Red
        Add-Content -Path $logFile -Value "Failed to mount image. KAPE processing skipped."
    }
    
    Write-Host "Results saved to: $targetDir" -ForegroundColor Cyan
    Write-Host "Logs saved to: $logFile" -ForegroundColor Cyan
    Write-Host ""
}

Write-Host "All processing complete." -ForegroundColor Green
