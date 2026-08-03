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

### 🪟 **Step 5: Parse Windows Event Logs (optional)**
```bash
Splunk_DFIR/scripts/process-evtx-EvtxECmd.sh
```
- Converts `.evtx` in `data_store/raw/other_raw_data/WinEvt/<host>/` using EvtxECmd.
- Requires operator-supplied EvtxECmd — see
  [the README](/data_store/dependencies/evtxecmd/README.md). MIT licensed, no
  commercial-use restriction.
- ⚠️ Not runtime-tested — see
  [the script docs](/docs/scripts/processing_data/process-evtx-EvtxECmd.md).

### 📊 **Step 6: Deploy Splunk**
```bash
Splunk_DFIR/scripts/deploy-splunk.sh
```
- Deploys Splunk Enterprise using Docker, configured for automatic data ingestion.
- **Redeploying is the normal path.** An existing container is removed and
  rebuilt without prompting, because indexes live in a Docker volume and survive.
- ⚠️ This accepts the Splunk software licence on your behalf via
  `SPLUNK_START_ARGS=--accept-license`, and runs the volume-capped free tier.

**What survives a redeploy**

| | |
|:---|:---|
| **Persists** — `/opt/splunk/var` (volume `splunk-dfir-var`) | Indexed events, and the fishbucket — so already-ingested files are not re-read and events are not duplicated |
| **Rebuilt** — `/opt/splunk/etc` | Apps and confs re-seeded from `splunk/etc/` every deploy, so edits there take effect on the next one. **Changes made in the Splunk UI are lost.** |

Use `scripts/purge-splunk-container.sh` to wipe indexes as well.

**Purge vs persist**

The deploy script decides whether a redeploy keeps or wipes indexed data:

```bash
./scripts/deploy-splunk.sh                # --persist (default): keep indexes
./scripts/deploy-splunk.sh --purge        # wipe indexes, start clean
./scripts/deploy-splunk.sh --purge --yes  # ...without the confirmation prompt
./scripts/deploy-splunk.sh --help         # all options
```

`--purge` deletes the index volume, so **every indexed event and the fishbucket
go**. Raw and processed evidence on disk is untouched — you can re-ingest. It
prompts for confirmation unless `--yes`, and refuses outright if there is no
terminal to confirm on.

`scripts/purge-splunk-container.sh` still exists for purging *without*
redeploying.

**Unattended deploys**

| Variable | Default | Purpose |
|:---|:---|:---|
| `SPLUNK_PASSWORD_FILE` | — | Read the admin password from a file (preferred) |
| `SPLUNK_PASSWORD` | — | Admin password from the environment |
| `SPLUNK_REPLACE` | `always` | `always` \| `ask` \| `never` |
| `SPLUNK_READY_TIMEOUT` | `600` | Seconds to wait for the container's Ansible run |
| `SPLUNK_VAR_VOLUME` | `splunk-dfir-var` | Index volume name |
| `SPLUNK_SKIP_CHMOD` | `0` | Skip the permission fixup. It is O(files) over `data_store/processed` and runs every deploy; safe to skip once permissions are already right |

```bash
SPLUNK_PASSWORD_FILE=~/.splunk-admin ./scripts/deploy-splunk.sh
```

---

For detailed script usage, refer to the [📜 Scripts Overview](/docs/scripts/Scripts-Overview.md).
