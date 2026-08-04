# 📜 Scripts Directory (`./scripts`)

This directory contains automation scripts for **forensic data processing, Splunk deployment, and Zeek processing** within the **Splunk DFIR** pipeline.

---

## 📂 Script Overview

Supported scripts — these live in `scripts/` and resolve paths correctly:

| Script Name                        | Platform | Description                                                                                          |
|------------------------------------|----------|------------------------------------------------------------------------------------------------------|
| `setup-environment.sh`             | Linux    | Installs Docker, manages group permissions, and optionally saves images for offline use.             |
| `process-log2timeline-Dynamic.sh`  | Linux    | Processes **E01 disk images and VMware VM exports** through Plaso, emitting dynamic CSV.             |
| `process-zeek-ALL.sh`              | Linux    | Processes **all PCAPs** in the dataset using Zeek, preserving ISO8601 timestamps.                    |
| `process-evtx-EvtxECmd.sh`         | Linux    | Parses raw **Windows Event Logs** (`.evtx`) with EvtxECmd into JSON/XML for Splunk. ⚠️ Requires operator-supplied EvtxECmd; not runtime-tested. |
| `process-rekall-json.sh`           | Linux    | Normalises Rekall JSON memory-analysis output for ingestion. ⚠️ Field extraction incomplete.         |
| `deploy-splunk.sh`                 | Linux    | Starts a **Splunk Enterprise Docker container**. Redeploys by default; `--persist` (default) keeps indexes, `--purge` wipes them. `--help` for all flags. ⚠️ Auto-accepts Splunk's licence. |
| `config-splunk-inputs.sh`          | Linux    | Generates and applies Splunk `inputs.conf` monitoring stanzas for the data store.                    |
| `purge-splunk-container.sh`        | Linux    | Stops and removes the Splunk container, permanently deleting all indexes (**irreversible**).        |
| `Setup-Environment-Kape.ps1`       | Windows  | Prepares the KAPE dependency layout. ⚠️ Requires operator-supplied `kape.exe`.                       |
| `Process-Kape-ALL.ps1`             | Windows  | Runs KAPE targets/modules and writes output into the data store. ⚠️ See KAPE licensing below.        |

### Directories you should not use

| Path                  | Status                                                                                                   |
|-----------------------|----------------------------------------------------------------------------------------------------------|
| `scripts/deprecated/` | Superseded. Kept for reference only. `process-log2timeline-ALL.sh` here is replaced by `process-log2timeline-Dynamic.sh`. |

---

## ⚠️ Licensing before you run

- **KAPE is not free for commercial use.** The two PowerShell scripts drive
  KAPE, which under its Solo Edition EULA is restricted to personal,
  educational, and law-enforcement use. A paid engagement or client network
  needs a KAPE Enterprise licence from Kroll.
- **`deploy-splunk.sh` accepts the Splunk licence for you** and runs the
  volume-capped free tier.

Full detail in [THIRD_PARTY_NOTICES.md](/THIRD_PARTY_NOTICES.md).

## ⚙️ Usage

- Ensure **Docker** is installed and running.
- Scripts assume the repository follows the correct **directory structure** (see [`data_store/README.md`](/data_store/README.md) for raw data sources).
- Scripts resolve their own location, so they can be run from anywhere:

```bash
./scripts/deploy-splunk.sh
```

> ⚠️ The processing scripts run `chmod -R 777` on their working directories
> under `data_store/` to work around Docker UID mismatches. Don't run them on a
> shared host.
