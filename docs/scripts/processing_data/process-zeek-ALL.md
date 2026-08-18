# Zeek Network Traffic Processing Script Documentation

## Overview
The `process-zeek-ALL.sh` script automates the processing of network packet capture files (PCAP/PCAPNG) using the Zeek network security monitor within a Docker container. The script processes all packet capture files in a designated input directory and generates structured logs with normalized timestamps.

## Requirements
- Docker installed and running
- The zeek/zeek Docker image
- Network packet capture files (PCAP or PCAPNG format)
- Read/write permissions for the data directories

## Directory Structure
- Input: `$REPO_ROOT_DIR/data_store/raw/pcaps`
- Output: `$REPO_ROOT_DIR/data_store/processed/zeek/[pcap_filename]`

## Usage
```bash
./scripts/process-zeek-ALL.sh
```

## Workflow
1. The script identifies all PCAP/PCAPNG files in the input directory
2. For each packet capture file:
   - Creates a temporary directory for initial processing
   - Runs Zeek analysis inside a Docker container
   - Zeek writes JSON directly (`LogAscii::use_json=T`) with ISO-8601 timestamps
   - Saves the processed logs to a dedicated output directory
3. Cleans up temporary files and Docker containers after processing

## Output Format
- Each PCAP file gets its own directory of Zeek logs
- Zeek writes JSON natively (`LogAscii::use_json=T`); each log is renamed from
  Zeek's `.log` extension to `.json` on the way out (`conn.json`, `dns.json`,
  `http.json`, …)
- Content is JSON, one object per line, with ISO-8601 timestamps
  (`LogAscii::json_timestamps=JSON::TS_ISO8601`) — not TSV

## Troubleshooting
- Check Docker is running
- Verify PCAP/PCAPNG files are valid
- Ensure sufficient disk space for log generation
- Check for Docker container error messages in the script output

## Notes
- Supports both .pcap and .pcapng file formats
- Automatically handles timestamp normalization
- Creates separate output folders for each processed capture file
- Contains detailed progress indicators and error messages
