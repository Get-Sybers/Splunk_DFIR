# Setup Environment Script

## Overview
The `setup_environment.sh` script automates the setup process for the Splunk DFIR (Digital Forensics and Incident Response) environment. It handles Docker installation, permissions, and pulls necessary Docker images required for forensic analysis.

## Prerequisites
- A Debian-based Linux distribution
- Internet connectivity for downloading Docker and container images
- Sudo privileges (the script does not need to be run as root)

## What the Script Does

1. **Root Check**: Warns if running as root and requires confirmation to continue
2. **Docker Setup**:
   - Checks if Docker is installed; installs it if not present
   - Creates a Docker group if it doesn't exist
   - Adds the current user to the Docker group
3. **Docker Images**:
   - Downloads the following Docker images:
     - `log2timeline/plaso:latest` - Timeline analysis tools
     - `zeek/zeek:latest` - Network traffic analysis
     - `splunk/splunk:latest` - Log aggregation and analysis
   - Optionally saves Docker images as tar files for offline use
4. **Permission Management**:
   - Sets appropriate permissions on the Splunk_DFIR repository directories
   - Sets ownership to the current user and Docker group

## Usage

### Running the Script
Execute the script from the terminal:

```bash
Splunk_DFIR/scripts/setup_environment.sh
```

### Script Execution Flow
1. Displays what actions will be performed
2. Prompts for confirmation before proceeding
3. Asks if you want to download Docker images as tar files (for offline use)
4. Performs the installation and setup process
5. Provides completion message with next steps

## Post-Installation
After running the script:

1. **Log out and log back in** to apply the Docker group membership changes
2. If you downloaded Docker image tarballs, you can load them using:
   ```bash
   Splunk_DFIR/scripts/setup_load_docker_tar.sh
   ```

## Troubleshooting

- If you encounter permission issues, ensure you have sudo privileges
- Docker installation may require additional configuration on some systems
- Network issues might prevent downloading Docker images; check your connectivity
