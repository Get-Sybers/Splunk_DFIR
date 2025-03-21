# 🐳 Secure Docker Installation and Offline Setup

This document describes the functionality and operation of the provided shell script, designed to securely install Docker, manage permissions, and optionally set up Docker images for offline usage.

---

## 🚀 Script Overview

- Securely installs Docker if it is not already present on the system.
- Adds Docker's official GPG key and securely configures the Docker repository.
- Installs Docker with verified package versions.
- Manages Docker group permissions to allow non-root user execution.
- Provides an option for preparing Docker images for offline environments.
- Sets restrictive permissions for required directories.

---

## 📋 Operation Steps

1. Checks if Docker is installed; if not, securely performs the installation.
2. Optionally adds the current user to the Docker group for non-root Docker execution.
3. Offers the option to prepare Docker images (`Plaso`, `Zeek`, `Splunk`) for offline use by:
   - Pulling and verifying Docker images.
   - Saving Docker images locally as tar files for offline deployment.
   - Loading Docker images from local storage if not already present.
4. Sets secure, restrictive permissions on the `Splunk_DFIR/splunk/etc` directory if it exists.

---



