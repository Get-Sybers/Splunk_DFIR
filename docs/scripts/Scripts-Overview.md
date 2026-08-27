# Scripts Directory (`./scripts`)

This directory contains automation scripts for **forensic data processing** and
for **deploying, schema-loading and ingesting into the Kusto emulator** — the
DX_DFIR pipeline. Host artefacts are collected with **Velociraptor offline
collectors running the EZ Tools** (replacing the removed KAPE automation).

> **The `dxdfir` CLI and the `get_sybers.dfir` collection are the supported
> front-end** — see [How It Runs](/README.md#how-it-runs). The retired per-source
> `process-*.sh` scripts have been removed; their behaviour lives in the
> `get_sybers_dfir` processors (`dxdfir process <source>`). The deploy/apply/ingest
> scripts (`dxdfir deploy` / `dxdfir ingest`) and the signature lanes
> (`process-signatures.sh`) remain, and this page documents them.

---

## Processing scripts

Per-source processing runs through the **`dxdfir` CLI** (`dxdfir process <source>`),
which drives the `get_sybers.dfir` roles and the `get_sybers_dfir` Python processors
(see [How It Runs](/README.md#how-it-runs)); each is also runnable as
`python -m get_sybers_dfir.<source>`. The retired per-source `process-*.sh` scripts
have been removed — their behaviour lives in those processors. The one processing
script that remains is the signature orchestrator:

| Script | Reads | Produces |
|---|---|---|
| `process-signatures.sh` | pcaps / files / images / EVTX | Signature/detection lanes — see **Signature detection** below. |

### Signature detection (`process-signatures.sh`)

Three standalone lanes under `scripts/signatures/`, each emitting self-describing
JSONL to `data_store/processed/signatures/<tool>/`. Run all, or `--only <lane>`;
`--fetch` provisions rules/binaries when online (the Python YARA lane fetches the
pinned [DetectRaptor](https://github.com/mgreen27/DetectRaptor) ruleset). To supply
your own YARA or Suricata rules (and tune Suricata's `HOME_NET`), see
[Signature-Rules](/docs/Signature-Rules.md).

**Hayabusa** now also runs inside the **evtx pipeline** (`dxdfir process evtx`,
or `python -m get_sybers_dfir.evtx --hayabusa`): it scans the same `.evtx` that
lane collects — loose logs or those extracted from a disk image via `--image-src`
— so disk-image EVTX reaches Hayabusa through the evtx lane's extraction rather
than needing a `/dev/fuse` mount. The standalone `hayabusa.sh` lane remains for
mount-based scans.

| Lane | Input | Output |
|---|---|---|
| `suricata.sh` | PCAPs | Suricata EVE JSON, `source_pcap`-tagged, alert+context event types. |
| `yara.sh` | **files**, **disk images** (mounted in place — `ewfmount`+`ntfs-3g`, never extracts), **memory** (via Volatility `windows.vadyarascan`, matches carry PID context) | one JSON object per match (rule, target, offsets/strings). |
| `hayabusa.sh` | loose `.evtx` + disk images | Hayabusa Sigma detection timeline (native binary). Disk-image EVTX come from a mount, or a **targeted** `image_export --artifact_filters WindowsEventLogs` pull (event logs only, transient). |

> **Mounting note.** Disk-image mounting needs `/dev/fuse`, which an LXC blocks by
> default; the lanes skip disk images with a host-fix message until it's enabled.
> **Hayabusa's `-J` JSON input does not detect** (0 hits vs 792 natively) — real
> `.evtx` is required, from a mount or the targeted extraction.

---

## Deployment & ingest scripts

The analysis container images are catalogued in [Containers](/docs/Containers.md).


| Script | Description |
|---|---|
| `setup-environment.sh` | Installs Docker and userland deps (distro-aware); image seeding split into `save-docker-images.sh`. |
| `save-docker-images.sh` | Pull / save / load the analysis Docker images for offline / air-gapped hosts. |
| `deploy-kusto.sh` | Deploys the **Kusto emulator** (analysis backend). Localhost-only by default (the emulator has **no auth**), isolated network, ephemeral database. ⚠️ Sets `ACCEPT_EULA=Y` on your behalf; `--help` for flags. |
| `apply-kusto-schema.sh` | Creates the Kusto databases, tables, ingestion mappings and the MITRE CAR functions. Idempotent. |
| `ingest-kusto.sh` | Loads `data_store/processed` into the emulator: **Plaso `L2t*`, EvtxECmd, Zeek (conn + generic), Volatility, Velociraptor**. `--only <source>` to load one. |

Shared libraries in `scripts/lib/`: `docker-lifecycle.sh` (container replace
policy, isolated network, readiness, egress verification), `kusto-api.sh` (the
emulator's REST endpoints, failure detection, reachability), and `l2t-split.py`
(splits Plaso json_line into per-parser `L2t*` tables). Signature-lane helpers live
in `scripts/signatures/lib/`.

The Splunk-era and KAPE PowerShell scripts were retired (git history and the frozen
`deprecated` branch keep them).

---

## Self-cleanup

`process-signatures.sh` runs a `prune_dangling` trap on exit that removes docker
layers left dangling when a pulled `:latest` tag moves — only untagged, unreferenced
images; tool images and live containers are untouched.

---

## Licensing before you run

- **`deploy-kusto.sh` accepts Microsoft's Software License Terms for you**
  (`ACCEPT_EULA=Y`). The emulator is *as-is*, unsupported, and documented as
  generally unsuitable for production.

Full detail in [THIRD_PARTY_NOTICES.md](/THIRD_PARTY_NOTICES.md).

## Usage

- Ensure **Docker** is installed and running.
- Scripts assume the repository's **directory structure** (see
  [`data_store/README.md`](/data_store/README.md) for raw data sources).

```bash
./scripts/deploy-kusto.sh
dxdfir process zeek
./scripts/ingest-kusto.sh --only zeek
```

> ⚠️ The processing scripts run `chmod -R 777` on their working directories under
> `data_store/` to work around Docker UID mismatches. Don't run them on a shared host.
