# DX_DFIR Pipeline

[![release](https://img.shields.io/github/v/release/Get-Sybers/DX_DFIR?include_prereleases&label=release)](https://github.com/Get-Sybers/DX_DFIR/releases)
[![checks](https://github.com/Get-Sybers/DX_DFIR/actions/workflows/checks.yml/badge.svg)](https://github.com/Get-Sybers/DX_DFIR/actions/workflows/checks.yml)
[![licence](https://img.shields.io/badge/licence-Apache--2.0-blue)](/LICENSE)

Point DX_DFIR at a disk image or a PCAP; it processes the evidence with
**[Plaso](https://github.com/log2timeline/plaso)**, **[Zeek](https://zeek.org/)**,
**[EvtxECmd](https://github.com/EricZimmerman/evtx)**,
**[Volatility 3](https://github.com/volatilityfoundation/volatility3)** and the
**[Zimmerman EZ-Tools](https://ericzimmerman.github.io/)**, normalises it into the
**[MITRE CAR](https://car.mitre.org/data_model/)** data model, and loads it into a
local **[Azure Data Explorer Kusto emulator](https://learn.microsoft.com/en-us/azure/data-explorer/kusto-emulator-overview)**
— the real Kusto engine in a container, no Azure, no account, no cloud. You get
KQL over normalised `mitre.car_*` tables instead of a pile of CSVs.

> **Pre-release software** — the version and maturity are whatever the badge above
> says (it reads the latest [Release](https://github.com/Get-Sybers/DX_DFIR/releases)
> live). Runs on the author's corpus; interfaces may still change. Release notes:
> [CHANGELOG.md](/CHANGELOG.md).

## Quick start

Fresh Debian/Ubuntu host — installs Docker and the `dxdfir` CLI:

```bash
git clone --recursive https://github.com/Get-Sybers/DX_DFIR.git
cd DX_DFIR
./scripts/setup-environment.sh      # Docker + dxdfir CLI (log out/in once for the docker group)
```

Deploy the backend and run the pipeline:

```bash
dxdfir deploy                       # Kusto emulator + schema (localhost-only, no auth; accepts the MS EULA)
# drop evidence under data_store/raw/<type>/ (see data_store/README.md), then per source:
dxdfir process evtx                 # zeek | evtx | volatility | plaso | zimmerman | signatures
dxdfir ingest --only evtx           # load that source's processed output into the emulator
dxdfir build-car                    # normalise every source into per-source CAR stores
dxdfir ingest --only car            # load the CAR stores into the mitre.car_* tables
dxdfir detect                       # sweep detections over what's present -> misc.Detections
```

Query at `127.0.0.1:8080`. The CAR objects live in the **`mitre` database** —
select it, then use the bare table names (`mitre.car_process` isn't valid KQL):
`car_process`, `car_flow`, …; `Car()` for the cross-object timeline,
`car_relationships` for the edges — plus `DetectionsLatest()`. `dxdfir --help`
lists every command (`man dxdfir` for the manual); `dxdfir car-timeline <car-dir>`
writes a property-rich, time-ordered timeline JSONL.

## How it runs
<a name="how-it-runs"></a>

A three-layer stack — the **`dxdfir` CLI** → the **`get_sybers.dfir` Ansible
collection** (one role per source, one action per task) → the **`get_sybers_dfir`
Python package** — targeting the Kusto emulator (default) or SOF-ELK
(`--pipeline sofelk`). Each source runs as `dxdfir process <source>` (driving the
matching `dfir_<source>` role); processors are also runnable as
`python -m get_sybers_dfir.<source>`.

## What it produces

| Source | Command | Lands in |
|:---|:---|:---|
| Disk images / VM exports (Plaso) | `process plaso` | per-parser `host.L2t<Parser>` tables |
| PCAP (Zeek) | `process zeek` | `network.ZeekConn` (typed) + generic `network.Zeek` |
| Windows event logs + Sysmon (EvtxECmd) | `process evtx` | `host.EvtxEcmdJson` |
| Memory (Volatility 3 / PIIAT-Mem) | `process volatility` | `memory.VolatilityJson` |
| EZ-Tools artefacts — SRUM, registry, … | `process zimmerman` | processed output → CAR (`mitre.car_*`, via `build-car`) |
| YARA / Suricata / Hayabusa | `process signatures` | JSONL under `processed/signatures/` |

The **CAR layer is materialised**: the [PIIAT-MitreCar](https://github.com/Get-Sybers/PIIAT-MitreCar)
engine normalises each processed source into finished CAR events, and the pipeline
ingests one `car_<object>.jsonl` per object as the 13 `mitre.car_<object>` tables
plus `car_relationships`. Extraction happens once, in the engine, so the schema is
generated from the model and can't drift from what it emits.

**Validated on the Kusto emulator** by the CI **smoke test** (the real
EVTX → EvtxECmd → CAR path over pinned Sysmon fixtures) and by **`dxdfir verify-car`**
(each CAR table populated, values sane — IPs, ports, SIDs — `car_action` checked
against the engine's model vocabulary, every row traceable to a source). The other
lanes (Plaso, Zeek, Volatility, Zimmerman) are run by hand on the author's corpus.
The signature-lane JSONL is not loaded into the backend.

## Before you run anything

- **The emulator has no security** — no auth, no access control, plaintext HTTP,
  no encryption at rest (documented properties, not misconfigurations). `dxdfir
  deploy` binds it to `127.0.0.1` and refuses any other address unless
  `dfir_deploy_adx_expose=true`; it runs on an isolated network by default. That
  binding is the only control there is. See [SECURITY.md](/SECURITY.md).
- **Deploying accepts Microsoft's licence terms for you** (`ACCEPT_EULA=Y`); the
  emulator is provided *as-is* and "generally unsuitable for production" — see
  [THIRD_PARTY_NOTICES.md](/THIRD_PARTY_NOTICES.md).
- **This handles real evidence.** `data_store/` is gitignored deny-by-default, so
  unknown/extensionless formats are covered — a safety net, not a guarantee. Check
  `git status` before you commit.

## Docs

- [Get started](/docs/Get-Started.md) · [Directory structure](/docs/Dir-Structure.md)
- [The Kusto backend](/docs/Kusto-Port.md) — design, schema, the materialised CAR
- [CAR pipeline](/docs/CAR-Pipeline.md) · [extraction rules](/docs/CAR-Extraction-Rules.md) · [relations](/docs/CAR-Relations.md)
- [Task board](/project-progress.md) · [Contributing](/CONTRIBUTING.md) · [Security](/SECURITY.md)

> The pre-beta code lives on the frozen
> [`deprecated`](https://github.com/Get-Sybers/DX_DFIR/tree/deprecated) branch —
> unsupported, keeps every defect later releases fixed. Don't build on it.

## Licence

Apache-2.0 at the repository root (see [LICENSE](/LICENSE)) — matched to the
vendored `car_data_model.json` from [MITRE CAR](https://github.com/mitre-attack/car).
The pipeline code is offered under the more permissive **MIT** licence as
self-contained components: the `get_sybers_dfir` package + `dxdfir` CLI
(`python/`) and the `get_sybers.dfir` collection (`ansible/collections/`); each
subtree carries its own declared licence. Third-party tool obligations that fall
on *you* are in [THIRD_PARTY_NOTICES.md](/THIRD_PARTY_NOTICES.md); Apache-2.0 §4
attribution is in [NOTICE](/NOTICE).

---

🚀 **Happy hunting!**
