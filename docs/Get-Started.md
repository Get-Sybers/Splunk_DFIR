## 🚀 Get Started

### ⚙️ **Step 1: Setup Environment**
- **Run setup_environment.sh:**
  ```bash
  Splunk_DFIR/scripts/setup_environment.sh
  ```
_Refer to [📁 setup_environment](/docs/scripts/Setup_Environment.md) for details on the script._

### 🗂️ **Step 2: Place Raw Data**
- **Disk Images (`.E01`):**
  ```bash
  Splunk_DFIR/data_store/raw/disk_images/
  ```

- **Network Captures (`.pcap`, `.pcapng`):**
  ```bash
  Splunk_DFIR/data_store/raw/pcap/
  ```

- **Other Raw Data Sources:**
  ```bash
  Splunk_DFIR/data_store/raw/other_raw_data/
  ```

_Refer to [📁 Dir-Structure](/docs/dir-structure.md) for detailed directory structures._

### 💾 **Step 3: Process Forensic Images (E01)**
```bash
Splunk_DFIR/scripts/process-log2timeline-ALL.sh
```
- Automates forensic analysis of all `.E01` disk images using Plaso.

### 🛜 **Step 4: Process PCAPs with Zeek**
```bash
Splunk_DFIR/scripts/process-zeek-ALL.sh
```
- Automates processing of all network capture files (`.pcap` and `.pcapng`) using Zeek.

### 📊 **Step 5: Deploy Splunk**
```bash
Splunk_DFIR/scripts/deploy-splunk.sh
```
- Deploys Splunk Enterprise using Docker, configured for automatic data ingestion.

---

For detailed script usage, refer to the [📜 Scripts Overview](/docs/scripts/Scripts-Overview.md).

