# 📜 Scripts Directory (`./scripts`)

This directory contains automation scripts for **forensic data processing** and
for **deploying, schema-loading and ingesting into the Kusto emulator** — the
DX_DFIR pipeline. Artefact collection is planned via **Velociraptor offline
collectors running the EZ Tools** (replacing the removed KAPE automation).

---

## 📂 Script Overview

Supported scripts — these live in `scripts/` and resolve paths correctly:

| Script Name                        | Platform | Description                                                                                          |
|------------------------------------|----------|------------------------------------------------------------------------------------------------------|
| `setup-environment.sh`             | Linux    | Installs Docker, manages group permissions, and optionally saves images for offline use.             |
| `process-log2timeline-Dynamic.sh`  | Linux    | Processes **E01 disk images and VMware VM exports** through Plaso, emitting dynamic CSV.             |
| `process-zeek-ALL.sh`              | Linux    | Processes **all PCAPs** in the dataset using Zeek, preserving ISO8601 timestamps.                    |
| `process-evtx-EvtxECmd.sh`         | Linux    | Parses raw **Windows Event Logs** (`.evtx`) with EvtxECmd into JSON. ⚠️ Requires operator-supplied EvtxECmd; not runtime-tested. |
| `deploy-kusto.sh`                  | Linux    | Deploys the **Kusto emulator** — the analysis backend. Localhost-only by default (the emulator has **no auth**), isolated network, ephemeral database by default. ⚠️ Sets `ACCEPT_EULA=Y` on your behalf. `--help` for all flags. |
| `apply-kusto-schema.sh`            | Linux    | Creates the Kusto databases, tables, ingestion mappings and MITRE CAR functions. Idempotent — safe to re-run. |
| `ingest-kusto.sh`                  | Linux    | Loads `data_store/processed` into the emulator. Plaso, EvtxECmd and Zeek `conn` only; the Velociraptor loader is not implemented yet. |

Shared libraries live in `scripts/lib/`: `docker-lifecycle.sh` (container
replace policy, isolated network, readiness, egress verification, honest
directory purge) and `kusto-api.sh` (the emulator's REST endpoints, failure
detection, reachability).

The Splunk-era scripts (`deploy-splunk.sh`, `purge-splunk-container.sh`,
`config-splunk-inputs.sh`) were retired with the Splunk stack, and the KAPE
PowerShell automation (`Process-Kape-ALL.ps1`, `Setup-Environment-Kape.ps1`)
was removed in favour of the planned Velociraptor collector path — git
history and the frozen `deprecated` branch keep them.

---

## ⚠️ Licensing before you run

- **`deploy-kusto.sh` accepts Microsoft's Software License Terms for you**
  (`ACCEPT_EULA=Y`). The emulator is provided *as-is*, without support or
  warranties, and is documented as generally unsuitable for production
  workloads.

Full detail in [THIRD_PARTY_NOTICES.md](/THIRD_PARTY_NOTICES.md).

## ⚙️ Usage

- Ensure **Docker** is installed and running.
- Scripts assume the repository follows the correct **directory structure** (see [`data_store/README.md`](/data_store/README.md) for raw data sources).
- Scripts resolve their own location, so they can be run from anywhere:

```bash
./scripts/deploy-kusto.sh
```

> ⚠️ The processing scripts run `chmod -R 777` on their working directories
> under `data_store/` to work around Docker UID mismatches. Don't run them on a
> shared host.
