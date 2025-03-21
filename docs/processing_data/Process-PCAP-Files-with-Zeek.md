# 📂 Process PCAP Files with Zeek

This document describes the functionality and operation of the provided shell script, designed to process network traffic captures (PCAP files) using **Zeek** within a Docker container. The script generates structured **JSON logs** from each PCAP, intended for further analysis and ingestion into platforms like Splunk.

---

## 🚀 Functionality

### **Script Overview**

- Dynamically identifies all `.pcap` and `.pcapng` files within the specified input directory (`data_store/raw/pcaps`).
- Processes each PCAP file individually using Zeek within a Docker container.
- Generates structured JSON logs in dedicated directories under `data_store/processed/zeek` for each PCAP processed.

---

## 📋 Operation Steps

1. Determines absolute paths for input (PCAP files) and output (Zeek logs) directories.
2. Ensures that output directories exist, creating them if necessary.
3. Checks for the existence of PCAP files and exits with a warning if none are found.
4. Iterates through each identified PCAP file:
   - Creates a unique directory for each PCAP to store processed logs.
   - Runs Zeek inside a Docker container to process the PCAP file and generate JSON-formatted logs.
   - Streams real-time logging output for immediate feedback.
   - Cleans up Docker containers after processing is complete.

---

This script simplifies and automates the network forensic analysis of PCAP files, producing structured logs ready for immediate use and integration into analysis workflows.

