# 📜 Scripts Directory (`./scripts`)

This directory contains automation scripts for **forensic data processing, Splunk deployment, and Zeek processing** within the **Splunk DFIR** pipeline.

---

## 📂 Script Overview

| Script Name                     | Description                                                                                         |
|---------------------------------|-----------------------------------------------------------------------------------------------------|
| `deploy-splunk.sh`              | Starts a **Splunk Enterprise Docker container** with predefined settings.                           |
| `process-log2timeline-ALL.sh`   | Automates **log2timeline** processing of multiple **E01** disk images via Docker.                   |
| `process-zeek-ALL.sh`           | Processes **all PCAPs** within the dataset automatically using Zeek.                               |
| `purge-splunk-container.sh`     | Safely stops and removes the Splunk container, permanently deleting all indexes (**irreversible**). |
| `setup_environment.sh`          | Securely installs Docker, manages permissions, and optionally prepares images for offline environments.|

---

## ⚙️ Usage

- Ensure **Docker** is installed and running.
- Scripts assume the repository follows the correct **directory structure** (see [`data_store/README.md`](/data_store/README.md) for raw data sources).
- Execute scripts from the repo root, e.g.:

```bash
./scripts/deploy-splunk.sh
```