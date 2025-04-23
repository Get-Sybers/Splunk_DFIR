# KAPE Processing Scripts Documentation

## Process-Kape-ALL.ps1

### Overview
The `Process-Kape-ALL.ps1` script automates the analysis of forensic disk images (E01 format) using KAPE (Kroll Artifact Parser and Extractor) and Arsenal Image Mounter. The script mounts E01 files as virtual drives and executes selected KAPE modules against the mounted file systems for comprehensive artifact collection.

### Requirements
- Windows 10 (version 1703 or later) or Windows 11
- Administrative privileges
- KAPE (Kroll Artifact Parser and Extractor)
- Arsenal Image Mounter (AIM) v3.11.306 or later
- .NET Framework 4.5 or later (for KAPE)
- .NET 6.0 or later (for Arsenal Image Mounter)

### Directory Structure
- Input: `$REPO_ROOT_DIR/data_store/raw/disk_images`
- Output: `$REPO_ROOT_DIR/data_store/processed/kape`
- Dependencies: `$REPO_ROOT_DIR/data_store/dependencies`
  - KAPE: `$REPO_ROOT_DIR/data_store/dependencies/kape`
  - AIM: `$REPO_ROOT_DIR/data_store/dependencies/Arsenal-Image-Mounter-*`

### Usage
```powershell
# Run as Administrator
.\scripts\process-kape-ALL.ps1
```

### Workflow
1. The script verifies administrative privileges
2. It searches for E01 files in the input directory
3. For each E01 file:
   - Mounts the image using Arsenal Image Mounter with write-overlay protection
   - Identifies mounted drive letters
   - Runs configured KAPE modules against each mounted drive
   - Saves output to a case-specific directory
   - Unmounts the image when processing completes
4. Generates detailed logs for each step of the process

### Enabled KAPE Modules
- EZTools: Eric Zimmerman's suite of forensic analysis tools

### Output Format
- Module-specific outputs in JSON format
- Organized by case name and drive letter
- Comprehensive logging for troubleshooting

### Troubleshooting
- Check log files in `$REPO_ROOT_DIR/data_store/processed/kape/logs`
- Ensure Arsenal Image Mounter is properly installed with libewf support
- Verify that KAPE modules are properly configured
- For mounting issues, check system compatibility with Arsenal Image Mounter
- For processing failures, review the specific case and drive log files

## Setup-Environment.ps1

### Overview
The `Setup-Environment.ps1` script prepares the environment for KAPE automated processing by checking system compatibility, verifying dependencies, and creating the required directory structure. It assists with downloading and installing necessary components if they're missing.

### Requirements
- Windows 10 (version 1703 or later) or Windows 11
- Administrative privileges
- Internet connection for downloading dependencies

### Directory Structure Setup
- Creates all required directories:
  - `$REPO_ROOT_DIR/data_store/dependencies`
  - `$REPO_ROOT_DIR/data_store/raw/disk_images`
  - `$REPO_ROOT_DIR/data_store/processed/kape`
  - `$REPO_ROOT_DIR/data_store/processed/kape/logs`

### Workflow
1. Verifies administrative privileges
2. Checks system compatibility (OS version, architecture, virtualization status)
3. Verifies .NET requirements (.NET Framework 4.5+ and .NET 6.0+)
4. Creates required directory structure
5. Checks for KAPE and Arsenal Image Mounter installations
6. Assists with downloading missing dependencies
7. Offers to launch the main processing script after setup

### System Compatibility Check
- Verifies Windows version (recommends Windows 10 v1703+ or Windows 11)
- Checks for hypervisor presence (recommends bare metal)
- Validates .NET Framework and .NET Core versions
- Ensures system architecture is 64-bit

### Dependency Installation
- KAPE: Guides user to download from Kroll's website
- Arsenal Image Mounter: Provides direct download link
- .NET 6: Directs to official download page if missing

### Usage
```powershell
# Run as Administrator
.\scripts\Setup-Environment.ps1
```

### Notes
- The script will detect existing installations in non-standard locations
- It verifies the presence of libewf DLLs required for E01 support
- Permissions and file access are automatically configured
- The script can be re-run to verify the environment without duplicating setup
