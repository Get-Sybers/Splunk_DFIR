## 🚀 Get Started

> **🧪 Alpha.** These steps reflect the paths that actually work today. See
> [What Actually Works](/README.md#what-actually-works) before you start, and
> note that KAPE and Splunk carry licensing restrictions —
> [THIRD_PARTY_NOTICES.md](/THIRD_PARTY_NOTICES.md).
>
> Use the scripts in `scripts/`. **Do not use `scripts/v2/`** — four of its
> seven scripts resolve the repo root incorrectly. See
> [Known Limitations](/project-progress.md#-known-limitations).

### ⚙️ **Step 1: Setup Environment**
- **Run setup-environment.sh:**
  ```bash
  Splunk_DFIR/scripts/setup-environment.sh
  ```
_Refer to [📁 Setup_Environment](/docs/scripts/Setup_Environment.md) for details on the script._

### 🗂️ **Step 2: Place Raw Data**
- **Disk Images (`.E01`):**
  ```bash
  Splunk_DFIR/data_store/raw/disk_images/
  ```

- **VMware VM Exports (one folder per VM):**
  ```bash
  Splunk_DFIR/data_store/raw/VM_files/
  ```

- **Network Captures (`.pcap`, `.pcapng`):**
  ```bash
  Splunk_DFIR/data_store/raw/pcaps/
  ```

- **Other Raw Data Sources:**
  ```bash
  Splunk_DFIR/data_store/raw/other_raw_data/
  ```

_Refer to [📁 Dir-Structure](/docs/Dir-Structure.md) for detailed directory structures._

### 💾 **Step 3: Process Forensic Images (E01 / VMware)**
```bash
Splunk_DFIR/scripts/process-log2timeline-Dynamic.sh
```
- Automates forensic analysis of all `.E01` disk images and VMware VM exports using Plaso.
- Output lands in `data_store/processed/log2timeline/csv/`, with job logs in `logs/`.

### 🛜 **Step 4: Process PCAPs with Zeek**
```bash
Splunk_DFIR/scripts/process-zeek-ALL.sh
```
- Automates processing of all network capture files (`.pcap` and `.pcapng`) using Zeek.
- Output lands in `data_store/processed/zeek/<pcap-name>/`.

### 📊 **Step 5: Deploy Splunk**
```bash
Splunk_DFIR/scripts/deploy-splunk.sh
```
- Deploys Splunk Enterprise using Docker, configured for automatic data ingestion.
- ⚠️ This accepts the Splunk software licence on your behalf via
  `SPLUNK_START_ARGS=--accept-license`, and runs the volume-capped free tier.

---

For detailed script usage, refer to the [📜 Scripts Overview](/docs/scripts/Scripts-Overview.md).
