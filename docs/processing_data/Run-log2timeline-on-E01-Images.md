# 📂 Run log2timeline on E01 Images

This document describes the functionality and operation of the `process-log2timeline-ALL.sh` script, which processes multiple `.E01` forensic disk images using **Plaso (log2timeline)** within a Docker container. The script generates structured **csv logs** and associated error logs, intended for further analysis and ingestion into Splunk.

---

## 🚀 Functionality

### **Script:** `process-log2timeline-ALL.sh`

- Identifies all `.E01` disk image files within a specified directory (`data_store/raw/disk_images`).
- Processes each `.E01` file individually using Plaso's `psteal` utility inside a Docker container.
- Outputs results as structured csv logs in the `data_store/processed/log2timeline/tsv` directory.
- Captures and stores error logs separately in the `data_store/processed/log2timeline/logs` directory.

## Plaso [Dynamic Runtime Fields]("https://plaso.readthedocs.io/en/latest/sources/user/Output-and-formatting.html#dynamic-runtime-fields)
- this function arguably saves the need for transforming the data before ingestion into Splunk. Please reference the Dynamic Runtime Fields docs for specfics on the flags used during the execution of Plaso Psteal for further information.

---

## 📋 Operation Steps

1. Resolves the absolute paths for script and repository directories.
2. Prepares output directories for storing csv logs and error logs.
3. Sets appropriate permissions for Docker access.
4. Identifies `.E01` files in a case-insensitive manner.
5. Processes each identified `.E01` file using Dockerized Plaso execution.
6. Validates the creation of csv output files and logs errors if processing fails.
7. Provides terminal feedback on processing status, file outputs, and error log locations.

---

This script automates and streamlines the forensic processing of disk images, making the output immediately compatible with Splunk.