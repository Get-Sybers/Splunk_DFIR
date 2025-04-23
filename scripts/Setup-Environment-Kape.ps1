# Check if dependencies exist
## Dependencies = kape + Arsenal Image Mounter
### Expected kape.exe filepath: data_store\dependencies\kape\kape.exe
### Expected aim_cli.exe filepath: data_store\dependencies\Arsenal-Image-Mounter-v\d+\.\d+\.\d+\aim_cli.exe

## If kape.exe missing propt user you sign up to Kroll and download kape https://www.kroll.com/en/services/cyber-risk/incident-response-litigation-support/kroll-artifact-parser-extractor-kape

## If aim_cli.exe missing propt user you download Arsenal Image Mounter prompt user if they would like to download Arsenal Image Mounter from https://www.arsenalrecon.com/arsenal-image-mounter
### If yes download from https://mega.nz/file/voJnEATD#1Pbc6A3mpBw2LlDt6pEj2bRUX69nqeX0YPqIkf5Cgho

# Check if running as administrator
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
$isAdmin = $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "ERROR: This script requires administrative privileges." -ForegroundColor Red
    Write-Host "Please restart the script as Administrator." -ForegroundColor Red
    exit 1
}
Sleep 1
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "         AUTO-KAPE ENVIRONMENT SETUP              " -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# Ensure correct filepath assigned when referenced
$SCRIPT_DIR = $PSScriptRoot
$REPO_ROOT_DIR = Split-Path -Path $SCRIPT_DIR -Parent

# Define directory structure
$DEPENDENCIES_DIR = Join-Path $REPO_ROOT_DIR "data_store\dependencies"  
$INPUT_DIR = Join-Path $REPO_ROOT_DIR "data_store\raw\disk_images"
$HOST_OUTPUT_DIR = Join-Path $REPO_ROOT_DIR "data_store\processed\kape"

Write-Host "Directory Information:" -ForegroundColor Cyan
Write-Host "  Script Directory: $SCRIPT_DIR"
Write-Host "  Repository Root: $REPO_ROOT_DIR"
Write-Host "  Dependencies Directory: $DEPENDENCIES_DIR"
Write-Host "  Input Directory: $INPUT_DIR"
Write-Host "  Output Directory: $HOST_OUTPUT_DIR"
Write-Host ""


Sleep 1
# Check if running in a supported environment for Arsenal Image Mounter
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "         SYSTEM COMPATIBILITY CHECK               " -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Checking system compatibility for Arsenal Image Mounter..." -ForegroundColor Cyan

# Check Windows version
$osInfo = Get-CimInstance -ClassName Win32_OperatingSystem
$osVersion = $osInfo.Version
$osCaption = $osInfo.Caption
$osBuildNumber = $osInfo.BuildNumber
$is64Bit = [Environment]::Is64BitOperatingSystem

$supportedOS = $false
$fullySupportedOS = $false
$osMessage = ""

if ($is64Bit) {
    # Windows 10 1703 or later (build 15063 or higher)
    if ($osCaption -match "Windows 10" -and [int]$osBuildNumber -ge 15063) {
        $supportedOS = $true
        $fullySupportedOS = $true
        $osMessage = "Windows 10 (version 1703 or later) detected - Fully supported"
    }
    # Windows 11
    elseif ($osCaption -match "Windows 11") {
        $supportedOS = $true
        $fullySupportedOS = $true
        $osMessage = "Windows 11 detected - Fully supported"
    }
    # Server 2016/2019
    elseif ($osCaption -match "Windows Server 2016|Windows Server 2019") {
        $supportedOS = $true
        $fullySupportedOS = $true
        $osMessage = "Windows Server 2016/2019 detected - Fully supported"
    }
    # Other Windows versions may work but not fully supported
    elseif ($osCaption -match "Windows") {
        $supportedOS = $true
        $osMessage = "Windows detected but not an officially recommended version for Arsenal Image Mounter"
    }
} else {
    $osMessage = "32-bit operating system detected. Arsenal Image Mounter requires 64-bit Windows"
}

# Check if running in a virtual machine
$hypervisorPresent = $false
$hypervisorMessage = ""

# Common hypervisor detection methods
try {
    # Check for Hyper-V
    $hyperV = Get-CimInstance -ClassName Win32_ComputerSystem | Select-Object -ExpandProperty Model
    if ($hyperV -match "Virtual Machine") {
        $hypervisorPresent = $true
        $hypervisorMessage = "Hyper-V virtual machine detected"
    }
    # Check for VMware
    elseif (Get-CimInstance -ClassName Win32_BIOS | Where-Object { $_.Manufacturer -match "VMware" }) {
        $hypervisorPresent = $true
        $hypervisorMessage = "VMware virtual machine detected"
    }
    # Check for VirtualBox
    elseif (Get-CimInstance -ClassName Win32_BIOS | Where-Object { $_.Manufacturer -match "innotek|Oracle" }) {
        $hypervisorPresent = $true
        $hypervisorMessage = "VirtualBox virtual machine detected"
    }
    else {
        $hypervisorMessage = "No hypervisor detected - running on bare metal"
    }
} catch {
    $hypervisorMessage = "Unable to determine if running in a hypervisor"
}

# Display OS and hypervisor status
if ($fullySupportedOS) {
    Write-Host "OS Compatibility: $osMessage" -ForegroundColor Green
} elseif ($supportedOS) {
    Write-Host "OS Compatibility: $osMessage" -ForegroundColor Yellow
} else {
    Write-Host "OS Compatibility: $osMessage" -ForegroundColor Red
}

if ($hypervisorPresent) {
    Write-Host "Virtualization: $hypervisorMessage - Arsenal Image Mounter recommends running on bare metal for full functionality" -ForegroundColor Yellow
} else {
    Write-Host "Virtualization: $hypervisorMessage" -ForegroundColor Green
}
Write-Host ""


Sleep 1
# Check for .NET requirements
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "         .NET REQUIREMENTS CHECK                  " -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Arsenal Image Mounter requires .NET 6 or later" -ForegroundColor Cyan
Write-Host "KAPE requires .NET Framework 4.5 or later" -ForegroundColor Cyan
Write-Host ""

$requiredDotNetFrameworkVersion = "4.5"
$requiredDotNetCoreVersion = "6.0"

# Check .NET Framework version (traditional .NET)
function Get-DotNetFrameworkVersion {
    try {
        $ndpKey = "HKLM:SOFTWARE\Microsoft\NET Framework Setup\NDP\v4\Full\"
        if (Test-Path $ndpKey) {
            $release = Get-ItemPropertyValue -Path $ndpKey -Name "Release" -ErrorAction SilentlyContinue
            
            if ($release -ge 528040) { return "4.8 or later" }
            if ($release -ge 461808) { return "4.7.2" }
            if ($release -ge 461308) { return "4.7.1" }
            if ($release -ge 460798) { return "4.7" }
            if ($release -ge 394802) { return "4.6.2" }
            if ($release -ge 394254) { return "4.6.1" }
            if ($release -ge 393295) { return "4.6" }
            if ($release -ge 379893) { return "4.5.2" }
            if ($release -ge 378675) { return "4.5.1" }
            if ($release -ge 378389) { return "4.5" }
            return "4.0 or earlier"
        } else {
            return "Unknown"
        }
    } catch {
        return "Error determining .NET version"
    }
}

# Check for .NET 6+ (new .NET Core/5+)
function Get-DotNetCoreVersion {
    try {
        $dotnetCommand = Get-Command dotnet -ErrorAction SilentlyContinue
        if ($dotnetCommand) {
            $dotnetOutput = & dotnet --list-runtimes
            $dotnetVersions = @()
            
            foreach ($line in $dotnetOutput) {
                if ($line -match "Microsoft\.NETCore\.App\s+(\d+\.\d+\.\d+)") {
                    $dotnetVersions += $matches[1]
                }
            }
            
            return $dotnetVersions
        }
        return $null
    } catch {
        return $null
    }
}

$dotNetFrameworkVersion = Get-DotNetFrameworkVersion
$dotNetCoreVersions = Get-DotNetCoreVersion
$dotNet6Plus = $false

if ($dotNetCoreVersions) {
    foreach ($version in $dotNetCoreVersions) {
        if ($version -match "^6\.|^7\.|^8\.") {
            $dotNet6Plus = $true
            Write-Host ".NET Core/Runtime: .NET $version detected - meets Arsenal Image Mounter requirements" -ForegroundColor Green
            break
        }
    }
}

$dotNetFrameworkSufficient = $false

if ($dotNetFrameworkVersion -eq "Unknown" -or $dotNetFrameworkVersion -eq "Error determining .NET version" -or $dotNetFrameworkVersion -eq "4.0 or earlier") {
    Write-Host ".NET Framework: $dotNetFrameworkVersion - older than required version $requiredDotNetFrameworkVersion" -ForegroundColor Yellow
} else {
    Write-Host ".NET Framework: $dotNetFrameworkVersion detected" -ForegroundColor Green
    $dotNetFrameworkSufficient = $true
}
Write-Host ""

if (-not $dotNet6Plus) {
    Write-Host ".NET 6 or later not detected. Arsenal Image Mounter requires .NET 6+" -ForegroundColor Yellow
    Write-Host "Would you like to install .NET 6 Runtime? (Y/N)" -ForegroundColor Yellow
    $installDotNetCore = Read-Host
    
    if ($installDotNetCore -eq "Y" -or $installDotNetCore -eq "y") {
        Write-Host "Opening .NET 6 download page..." -ForegroundColor Cyan
        Start-Process "https://dotnet.microsoft.com/en-us/download/dotnet/6.0"
        Write-Host ""
        
        $continueSetup = Read-Host "After installing .NET 6, press Y to continue or N to exit"
        if ($continueSetup -ne "Y" -and $continueSetup -ne "y") {
            Write-Host "Setup aborted. Please run the script again after installing .NET 6." -ForegroundColor Red
            exit
        }
    } else {
        Write-Host "Arsenal Image Mounter may not function correctly without .NET 6+" -ForegroundColor Yellow
        $continueDespiteWarning = Read-Host "Continue anyway? (Y/N)"
        if ($continueDespiteWarning -ne "Y" -and $continueDespiteWarning -ne "y") {
            Write-Host "Setup aborted. Please install .NET 6+ and run this script again." -ForegroundColor Red
            exit
        }
    }
    Write-Host ""
}


Sleep 1
# Create directories
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "         CREATING REQUIRED DIRECTORIES            " -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Creating directories for Auto-KAPE..." -ForegroundColor Cyan

New-Item -ItemType Directory -Path $DEPENDENCIES_DIR -Force | Out-Null
New-Item -ItemType Directory -Path $INPUT_DIR -Force | Out-Null
New-Item -ItemType Directory -Path $HOST_OUTPUT_DIR -Force | Out-Null
New-Item -ItemType Directory -Path (Join-Path $HOST_OUTPUT_DIR "logs") -Force | Out-Null

Write-Host "Required directories created successfully." -ForegroundColor Green
Write-Host ""

# Define paths for dependency checks
$KAPE_DIR = Join-Path $DEPENDENCIES_DIR "kape"
$KAPE_EXE_PATH = Join-Path $KAPE_DIR "kape.exe"

# Define Arsenal Image Mounter variables
$AIM_PATTERN = "Arsenal-Image-Mounter*"


Sleep 1
# Check for dependencies
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "         CHECKING FOR DEPENDENCIES               " -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# Check for Arsenal Image Mounter
$aimDirectories = Get-ChildItem -Path $DEPENDENCIES_DIR -Directory -ErrorAction SilentlyContinue | Where-Object { $_.Name -like $AIM_PATTERN }

if ($aimDirectories.Count -gt 0) {
    # Use the latest version if multiple are found
    $AIM_DIR = $aimDirectories | Sort-Object -Property Name -Descending | Select-Object -First 1 -ExpandProperty FullName
    $AIM_EXE_PATH = Join-Path $AIM_DIR "aim_cli.exe"
    $aimVersion = ($AIM_DIR -split '\\')[-1]
    Write-Host "Arsenal Image Mounter: Found $aimVersion" -ForegroundColor Green
} else {
    Write-Host "Arsenal Image Mounter: Not found" -ForegroundColor Yellow
    $AIM_DIR = $null
    $AIM_EXE_PATH = $null
}

# Check if KAPE exists
if (Test-Path $KAPE_EXE_PATH) {
    Write-Host "KAPE: Found at $KAPE_EXE_PATH" -ForegroundColor Green
} else {
    Write-Host "KAPE: Not found at expected path" -ForegroundColor Yellow
}
Write-Host ""

# Check and handle KAPE dependency
if (-not (Test-Path $KAPE_EXE_PATH)) {
    Write-Host "KAPE not found at expected path: $KAPE_EXE_PATH" -ForegroundColor Yellow
    Write-Host "KAPE requires registration with Kroll:" -ForegroundColor Cyan
    Write-Host "Please visit: https://www.kroll.com/en/services/cyber-risk/incident-response-litigation-support/kroll-artifact-parser-extractor-kape" -ForegroundColor Cyan
    Write-Host "After downloading, extract the contents to: $KAPE_DIR" -ForegroundColor Cyan
    
    $downloadKape = Read-Host "Would you like to open the KAPE download page in your browser? (Y/N)"
    if ($downloadKape -eq "Y" -or $downloadKape -eq "y") {
        Start-Process "https://www.kroll.com/en/services/cyber-risk/incident-response-litigation-support/kroll-artifact-parser-extractor-kape"
    }
    
    $kapeInstalled = $false
    while (-not $kapeInstalled) {
        $checkAgain = Read-Host "Have you downloaded and extracted KAPE to $KAPE_DIR? (Y/N)"
        if ($checkAgain -eq "Y" -or $checkAgain -eq "y") {
            if (Test-Path $KAPE_EXE_PATH) {
                Write-Host "KAPE found successfully!" -ForegroundColor Green
                $kapeInstalled = $true
            } else {
                Write-Host "KAPE still not found at $KAPE_EXE_PATH" -ForegroundColor Red
                $exit = Read-Host "Would you like to exit and try again later? (Y/N)"
                if ($exit -eq "Y" -or $exit -eq "y") {
                    exit
                }
            }
        } else {
            $exit = Read-Host "Would you like to exit and try again later? (Y/N)"
            if ($exit -eq "Y" -or $exit -eq "y") {
                exit
            }
        }
    }
} else {
    Write-Host "KAPE found at: $KAPE_EXE_PATH" -ForegroundColor Green
}

# Check and handle Arsenal Image Mounter dependency
if (-not $AIM_EXE_PATH -or -not (Test-Path $AIM_EXE_PATH)) {
    Write-Host "Arsenal Image Mounter not found." -ForegroundColor Yellow
    Write-Host "Arsenal Image Mounter is required for mounting E01 images." -ForegroundColor Cyan
    Write-Host "Official website: https://www.arsenalrecon.com/downloads/" -ForegroundColor Cyan
    
    $downloadAIM = Read-Host "Would you like to download Arsenal Image Mounter directly? (Y/N)"
    
    if ($downloadAIM -eq "Y" -or $downloadAIM -eq "y") {
        # Set up download info
        $aimZipUrl = "https://mega.nz/file/voJnEATD#1Pbc6A3mpBw2LlDt6pEj2bRUX69nqeX0YPqIkf5Cgho"
        $aimZipPath = Join-Path $DEPENDENCIES_DIR "arsenal_image_mounter.zip"
        
        Write-Host "The direct download link is a MEGA link which requires special handling." -ForegroundColor Yellow
        Write-Host "Please manually download from: $aimZipUrl" -ForegroundColor Yellow
        Write-Host "After downloading, place the ZIP file at: $aimZipPath" -ForegroundColor Yellow
        
        $openBrowser = Read-Host "Would you like to open the download page in your browser? (Y/N)"
        if ($openBrowser -eq "Y" -or $openBrowser -eq "y") {
            Start-Process $aimZipUrl
        }
        
        $aimInstalled = $false
        while (-not $aimInstalled) {
            $checkZip = Read-Host "Have you downloaded Arsenal Image Mounter? (Y/N)"
            
            if ($checkZip -eq "Y" -or $checkZip -eq "y") {
                $zipPath = Read-Host "Please enter the full path to the downloaded ZIP file"
                
                if (Test-Path $zipPath) {
                    # Create AIM directory with version in name
                    $aimVersionDir = Join-Path $DEPENDENCIES_DIR "Arsenal-Image-Mounter-v3.11.306"
                    New-Item -ItemType Directory -Path $aimVersionDir -Force | Out-Null
                    
                    Write-Host "Extracting Arsenal Image Mounter..." -ForegroundColor Cyan
                    try {
                        Expand-Archive -Path $zipPath -DestinationPath $aimVersionDir -Force
                        
                        # Verify extraction by checking for aim_cli.exe
                        $AIM_EXE_PATH = Join-Path $aimVersionDir "aim_cli.exe"
                        if (Test-Path $AIM_EXE_PATH) {
                            Write-Host "Arsenal Image Mounter extracted successfully!" -ForegroundColor Green
                            $aimInstalled = $true
                            $AIM_DIR = $aimVersionDir
                        } else {
                            Write-Host "aim_cli.exe not found after extraction. The ZIP may be invalid or structured differently." -ForegroundColor Red
                        }
                    } catch {
                        Write-Host "Failed to extract ZIP file: $($_.Exception.Message)" -ForegroundColor Red
                    }
                } else {
                    Write-Host "File not found at path: $zipPath" -ForegroundColor Red
                }
            } else {
                $exit = Read-Host "Would you like to exit and try again later? (Y/N)"
                if ($exit -eq "Y" -or $exit -eq "y") {
                    exit
                }
            }
        }
    } else {
        Write-Host "Please download and install Arsenal Image Mounter manually before proceeding." -ForegroundColor Yellow
        $exit = Read-Host "Would you like to exit? (Y/N)"
        if ($exit -eq "Y" -or $exit -eq "y") {
            exit
        }
    }
} else {
    Write-Host "Arsenal Image Mounter found at: $AIM_EXE_PATH" -ForegroundColor Green
}

# Check for libewf DLL files which are needed for E01 support
$LIBEWF_SAME_DIR = Join-Path $AIM_DIR "libewf.dll"
$LIBEWF_ARCH_DIRS = @(
    (Join-Path $AIM_DIR "lib\x64"),
    (Join-Path $AIM_DIR "lib\x86"),
    (Join-Path $AIM_DIR "lib\arm"),
    (Join-Path $AIM_DIR "lib\arm64")
)

# Check if libewf DLLs exist in any of the possible locations
$libewfFound = Test-Path $LIBEWF_SAME_DIR
if (-not $libewfFound) {
    foreach ($archDir in $LIBEWF_ARCH_DIRS) {
        if (Test-Path $archDir) {
            $dllFiles = Get-ChildItem -Path $archDir -Filter "*.dll" -ErrorAction SilentlyContinue
            if ($dllFiles.Count -gt 0) {
                $libewfFound = $true
                break
            }
        }
    }
}

if (-not $libewfFound) {
    Write-Host "Warning: libewf DLL files not found. E01 files may not mount properly." -ForegroundColor Yellow
    Write-Host "Please ensure libewf DLL files are present in one of these locations:" -ForegroundColor Yellow
    Write-Host "1. Same directory as aim_cli.exe: $AIM_DIR" -ForegroundColor Yellow
    foreach ($archDir in $LIBEWF_ARCH_DIRS) {
        Write-Host "2. Architecture-specific directory: $archDir" -ForegroundColor Yellow
    }
}

# Final verification
$allDependenciesFound = (Test-Path $KAPE_EXE_PATH) -and (Test-Path $AIM_EXE_PATH)


Sleep 1
if ($allDependenciesFound) {
    Write-Host "`nAll required dependencies have been installed and verified!" -ForegroundColor Green
    Write-Host "You can now run the Process-Kape-ALL.ps1 script to process E01 files." -ForegroundColor Green
    Write-Host "Place your E01 files in: $INPUT_DIR" -ForegroundColor Cyan
    Write-Host "Results will be saved to: $HOST_OUTPUT_DIR" -ForegroundColor Cyan
} else {
    Write-Host "`nSome dependencies are still missing. Please address the issues above before proceeding." -ForegroundColor Red
}

# Ask if user wants to run the main script now
if ($allDependenciesFound) {
    $runMain = Read-Host "Would you like to run the Process-Kape-ALL.ps1 script now? (Y/N)"
    if ($runMain -eq "Y" -or $runMain -eq "y") {
        $mainScriptPath = Join-Path $SCRIPT_DIR "Process-Kape-ALL.ps1"
        if (Test-Path $mainScriptPath) {
            Write-Host "Running Process-Kape-ALL.ps1..." -ForegroundColor Cyan
            & $mainScriptPath
        } else {
            Write-Host "Error: Process-Kape-ALL.ps1 not found at $mainScriptPath" -ForegroundColor Red
        }
    }
}
