# 🚀 Script Overview

- Installs Docker if it is not already present on the system.
- Installs Docker.
- Manages Docker group permissions to allow non-root user execution.
- Provides an option for preparing Docker images.
- Sets restrictive permissions for required directories.

---

## 📋 Operation Steps

1. Checks if Docker is installed; if not, securely performs the installation.
2. Optionally adds the current user to the Docker group for non-root Docker execution.
3. Offers the option to prepare Docker images (`Plaso`, `Zeek`, `Splunk`) for offline use by:
   - Saving Docker images locally as tar files for offline deployment.
4. Sets permissions on the `Splunk_DFIR` directory if it exists.

---



