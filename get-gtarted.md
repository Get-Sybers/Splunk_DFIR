## 🚀 Quick Start

### 🗂️ **Step 1: Place Raw Data**
- **Disk Images (`.E01`, `.AFF`, etc.):**
  ```bash
  data_store/raw/disk_images/
  ```

- **Network Captures (`.pcap`, `.pcapng`):**
  ```bash
  data_store/raw/pcap/
  ```

- **Other Raw Data Sources:**
  ```bash
  data_store/raw/other_raw_data/
  ```

_Refer to [📁 Dir-Structure](/dir-structure.md) for detailed directory structures._

### 1️⃣ **Deploy Splunk**
```bash
./scripts/deploy-splunk.sh
```
- Deploys Splunk Enterprise using Docker, configured for automatic data ingestion.

### 2️⃣ **Process Forensic Images (E01)**
```bash
./scripts/process-log2timeline-ALL.sh
```
- Automates forensic analysis of all `.E01` disk images using Plaso.

### 3️⃣ **Process PCAPs with Zeek**
```bash
./scripts/process-zeek-ALL.sh
```
- Automates processing of all network capture files (`.pcap` and `.pcapng`) using Zeek.

---

For detailed script usage, refer to the [📜 Scripts Overview](/docs/Scripts-Overview.md).

