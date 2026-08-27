# Scripts Directory (`./scripts`)

This directory contains automation scripts for **forensic data processing** and
for **deploying, schema-loading and ingesting into the Kusto emulator** — the
DX_DFIR pipeline. Host artefacts are collected with **Velociraptor offline
collectors running the EZ Tools** (replacing the removed KAPE automation).

> **The `dxdfir` CLI and the `get_sybers.dfir` collection are the supported
> front-end** — see [How It Runs](/README.md#how-it-runs). The retired per-source
> `process-*.sh` scripts and the signature-lane shell scripts have been removed;
> their behaviour lives in the `get_sybers_dfir` processors (`dxdfir process
> <source>`, signatures included). The deploy/apply/ingest scripts (`dxdfir
> deploy` / `dxdfir ingest`) remain, and this page documents them.

---

## Processing

Per-source processing runs through the **`dxdfir` CLI** (`dxdfir process <source>`),
which drives the `get_sybers.dfir` roles and the `get_sybers_dfir` Python processors
(see [How It Runs](/README.md#how-it-runs)); each is also runnable as
`python -m get_sybers_dfir.<source>`. The retired per-source `process-*.sh` scripts
have been removed — their behaviour lives in those processors. No processing shell
scripts remain.

### Signature detection (`get_sybers_dfir.signatures`)

The three signature lanes (formerly `scripts/process-signatures.sh` +
`scripts/signatures/`) are Python: `python -m get_sybers_dfir.signatures`, or the
`dfir_signatures` role. Each lane emits self-describing JSONL to
`data_store/processed/signatures/<tool>/`. Run all, or `--only <lane>`; `--fetch`
provisions rules when online (the YARA lane fetches the pinned
[DetectRaptor](https://github.com/mgreen27/DetectRaptor) ruleset). To supply
your own YARA or Suricata rules (and tune Suricata's `HOME_NET`), see
[Signature-Rules](/docs/Signature-Rules.md).

**Hayabusa** also runs inside the **evtx pipeline** (`dxdfir process evtx`,
or `python -m get_sybers_dfir.evtx --hayabusa`): it scans the same `.evtx` that
lane collects — loose logs or those extracted from a disk image via `--image-src`
— so disk-image EVTX reaches Hayabusa through the evtx lane's extraction rather
than needing a `/dev/fuse` mount.

| Lane | Input | Output |
|---|---|---|
| `suricata` | PCAPs | Suricata EVE JSON, `source_pcap`-tagged, alert+context event types. |
| `yara` | **files**, **disk images** (mounted read-only in place — `ewfmount`+`ntfs-3g`, never extracts; `--yara-sources` selects), **memory** (via Volatility `windows.vadyarascan`, matches carry PID context) | one JSON object per match (rule, target, offsets/strings). |
| `hayabusa` | loose `.evtx` (+ disk-image EVTX via the evtx lane's targeted `image_export --artifact_filters WindowsEventLogs` pull — event logs only, transient) | Hayabusa Sigma detection timeline (native binary). |

> **Mounting note.** Disk-image mounting needs `/dev/fuse`, which an LXC blocks by
> default; the YARA disk source skips images with a host-fix note until it's
> enabled (nothing is ever extracted out of an image for YARA).
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
(splits Plaso json_line into per-parser `L2t*` tables).

The Splunk-era and KAPE PowerShell scripts were retired (git history and the frozen
`deprecated` branch keep them).

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

> ⚠️ The processing lanes `chmod 777` their working directories under
> `data_store/` to work around Docker UID mismatches. Don't run them on a shared host.
