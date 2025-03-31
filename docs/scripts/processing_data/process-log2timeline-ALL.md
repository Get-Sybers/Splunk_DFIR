# Log2Timeline Processing Script Documentation

## Overview
The `process-log2timeline-ALL.sh` script automates the extraction of forensic timeline data from disk images (E01 format) using the Plaso toolset. The script processes all E01 files in a designated input directory and outputs structured CSV timeline data for further forensic analysis.

## Requirements
- Docker installed and running
- The log2timeline/plaso Docker image
- Disk image files in E01 format
- Read/write permissions for the data directories

## Directory Structure
- Input: `$REPO_ROOT_DIR/data_store/raw/disk_images`
- Output: `$REPO_ROOT_DIR/data_store/processed/log2timeline`
  - CSV files: `$REPO_ROOT_DIR/data_store/processed/log2timeline/csv`
  - Log files: `$REPO_ROOT_DIR/data_store/processed/log2timeline/logs`

## Usage
```bash
./scripts/process-log2timeline-ALL.sh
```

## Workflow
1. The script identifies all E01 files in the input directory (case-insensitive)
2. For each E01 file:
   - Extracts the filename for output naming
   - Runs the `psteal` tool from the Plaso toolkit within a Docker container
   - Generates a comprehensive timeline in CSV format
   - Captures processing logs for troubleshooting
3. Verifies successful processing by checking for output files

## Output Format
The CSV output contains the following fields:
- date, datetime, description, description_short, display_name
- filename, host, hostname, inode, macb
- message, message_short, source, sourcetype, source_long
- tag, time, timestamp_desc, timezone, type, user, username, zone

## Troubleshooting
- Ensure Docker is running before executing the script
- Check permissions on input and output directories
- Review log files in the logs directory for specific error messages
- Verify E01 files are not corrupted
- For processing failures, examine the individual log file for the specific disk image

## Notes
- The script processes all partitions in each disk image
- All timestamps are normalized to UTC timezone
- Output files maintain the same base filename as the input files
- The script sets necessary permissions (777) on input directories
- Case-insensitive matching is used for E01 file detection
