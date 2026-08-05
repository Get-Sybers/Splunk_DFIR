# 🧊 DX_DFIR Pipeline

[![release](https://img.shields.io/github/v/release/Get-Sybers/DX_DFIR?include_prereleases&label=release)](https://github.com/Get-Sybers/DX_DFIR/releases)
[![checks](https://github.com/Get-Sybers/DX_DFIR/actions/workflows/checks.yml/badge.svg)](https://github.com/Get-Sybers/DX_DFIR/actions/workflows/checks.yml)
[![licence](https://img.shields.io/badge/licence-Apache--2.0-blue)](/LICENSE)

> **Pre-release software.** The version and its maturity are whatever the badge
> above says — that reads the latest [Release](https://github.com/Get-Sybers/DX_DFIR/releases)
> directly, so it is never out of date. Release notes are in
> [CHANGELOG.md](/CHANGELOG.md).
>
> Whatever the label, **nothing here has been verified against a running
> emulator.** The core promise — normalised MITRE CAR fields you can query in
> KQL — is built rather than absent, but built is not the same as working.
> Read [What Actually Works](#what-actually-works) before you spend time here.

Automates the processing of forensic evidence with
**[Plaso (log2timeline)](https://github.com/log2timeline/plaso)**,
**[Zeek](https://zeek.org/)**, and
**[EvtxECmd](https://github.com/EricZimmerman/evtx)**,
and loads it into a local, offline
**[Azure Data Explorer Kusto emulator](https://learn.microsoft.com/en-us/azure/data-explorer/kusto-emulator-overview)**
— the real Kusto query engine in a container, no Azure, no account, no cloud —
with field mappings aligned to the
**[MITRE CAR Data Model](https://car.mitre.org/data_model/)** exposed as KQL
functions.

---

## 📚 Repo

- [1. Overview](#overview)
- [2. Get-Started](/docs/Get-Started.md)
- [3. Dir-Structure](/docs/Dir-Structure.md)
- [4. Project-Progress](/project-progress.md)
- [5. The Kusto backend](/docs/Kusto-Port.md) — design, schema, and known gaps
- [6. Docs](/docs/)
- [7. Contributing](/CONTRIBUTING.md) · [Security](/SECURITY.md)

> The pre-beta code lives on the frozen
> [`deprecated`](https://github.com/Get-Sybers/DX_DFIR/tree/deprecated)
> branch. It is unsupported and keeps every defect later releases fixed.
> Don't build on it.

### 📚 This Page

- [Overview](#overview)
- [What Actually Works](#what-actually-works)
- [Before You Run Anything](#before-you-run-anything)
- [Why This Exists](#why-this-exists)
- [The Problem - DeadBox Forensics](#the-problem---deadbox-forensics)
- [Get-Sybers Solution](#get-sybers-solution)
- [Benefits](#benefits)
- [Envisioned Endstate](#envisioned-endstate)
- [Licence](#licence)
- [Notes](#notes)

---

## ‼️ Disclaimer

Running DFIR tools in a containerized environment can be risky. Ensure you
understand the implications and risks before proceeding. This project is
intended for educational purposes only. Use at your own risk.

I have begun to consolidate resources in [research.md](/docs/research.md) — if
you have resources you'd like to add, please submit a PR.

This project is not affiliated with or endorsed by any of the tools used or
organizations mentioned.

## 🚀 Overview
<a name="overview"></a>

Point it at a disk image or a PCAP, and it processes the evidence, loads the
output into a local Kusto emulator, and gives you KQL over normalised tables
instead of a pile of CSVs.

That's the idea. Here's where it honestly stands.

## 🧪 What Actually Works
<a name="what-actually-works"></a>

This runs on the author's machine and has not been validated anywhere else.
Nothing here is production-ready, nothing exercises the pipeline automatically,
and interfaces may still change. What the current line buys you over the
[pre-release line](https://github.com/Get-Sybers/DX_DFIR/tree/deprecated) is
that the defects below are known and written down rather than waiting to be
discovered.

| Capability | State | Notes |
|:---|:---|:---|
| E01 → Plaso timeline CSV | ✅ Works | `process-log2timeline-Dynamic.sh`; `psteal` dynamic CSV, job logs kept |
| VMware VM exports → Plaso | ✅ Works | Added recently, lightly tested |
| PCAP → Zeek logs | ✅ Works | ISO8601 timestamps preserved |
| Raw EVTX → EvtxECmd JSON | ⚠️ Built, untested | `process-evtx-EvtxECmd.sh`; operator-supplied EvtxECmd (MIT). **Never run against a real event log** |
| Velociraptor offline collectors (EZ Tools) | ❌ Not started | **The planned artefact-collection path, replacing the removed KAPE automation** — same Zimmerman parsers, no Kroll licence constraint |
| Rekall / Velociraptor processing | ⚠️ Partial | Normalisation scripts exist; Rekall upstream is archived |
| **Kusto emulator deploy** | ◑ Built, unverified | `deploy-kusto.sh` — localhost-only by default (the emulator has **no auth**), isolated network, real engine health check. **Never run against a live emulator** |
| **Schema + ingestion** | ◑ Built, unverified | 5 databases; typed tables + ingestion mappings for Plaso CSV, EvtxECmd JSON, Zeek `conn`; loaders for Velociraptor / Rekall are **not implemented** |
| **MITRE CAR field mapping (KQL)** | ◑ **Built, unverified** | CAR objects as KQL functions in the `mitre` database — `CarFlow()`, `CarProcess()`, `CarUserSession()`, `CarService()`, `CarFile()`, plus `CarCoverage()`. **5 of 9 CAR objects have a source**; `registry` (awaiting the Velociraptor/EZ-Tools path), `driver`, `module`, `thread` have none. See [docs/Kusto-Port.md](/docs/Kusto-Port.md) |
| Linux logs, Sysmon, Syslog, Hayabusa, Chainsaw | ❌ Not started | Directory structure only |

### Known limitations

- **No pipeline tests.** `./tests/run-checks.sh` runs the static and
  behavioural repo checks in CI (shell syntax, shellcheck, path resolution,
  the container-lifecycle library, Kusto schema consistency, evidence
  gitignore, secrets, doc links) — but nothing exercises the actual pipeline.
  Every "✅" above still means "worked when the author last ran it by hand."
- **Nothing has run against a real emulator.** The deploy, schema apply,
  ingestion and CAR functions are verified against fakes and fixtures only.
  The runtime checklist is
  [issue #14](https://github.com/Get-Sybers/DX_DFIR/issues/14).
- **Scripts `chmod -R 777` their working directories.** Convenient, not safe.
  Don't run this on a shared host.
- **Deploying accepts Microsoft's licence terms for you** via `ACCEPT_EULA=Y`,
  and the emulator is provided *as-is* and documented as "generally unsuitable
  for production workloads" — see
  [THIRD_PARTY_NOTICES.md](/THIRD_PARTY_NOTICES.md).
- **The `_time`/timestamp normalisation story is inconsistent** across
  sources. Plaso and Zeek are good; everything else is unverified.

## 🛑 Before You Run Anything
<a name="before-you-run-anything"></a>

Three things that will bite you otherwise:

1. **The emulator has no security features at all.** No authentication, no
   access control, plaintext HTTP, no encryption at rest — documented
   properties, not misconfigurations. `deploy-kusto.sh` binds it to
   `127.0.0.1` and requires typing `expose` to bind anywhere else; that
   binding is the only control there is. It also runs isolated by default —
   no outbound network access. Not an airgap — see [SECURITY.md](/SECURITY.md).
2. **Deploying accepts Microsoft's Software License Terms on your behalf**
   (`ACCEPT_EULA=Y`), and Microsoft provides the emulator *as-is*, without
   support or warranties. Whether that fits your engagement is your call to
   make, not this project's.
3. **This handles real evidence.** `data_store/` is gitignored
   deny-by-default, so unknown and extensionless formats are covered. It is
   still a safety net, not a guarantee — check `git status` before you commit,
   every time.

## 🏴‍☠️ Why This Exists
<a name="why-this-exists"></a>

Most SOCs have already figured this problem out. Unfortunately, DeadBox
forensics still has its place, but it doesn't need to remain outdated. Learning
DFIR via DeadBox analysis is common and arguably a great starting point. DFIR
should be fast, efficient, and less tedious. This project automates messy
tasks, lowering the barrier to entry and encouraging faster DFIR skill
development by transforming forensic data into neatly mapped, standardized
tables you can query in KQL — offline, on your own machine.

## 🎯 The Problem - DeadBox Forensics
<a name="the-problem---deadbox-forensics"></a>

DFIR analysts juggle mountains of fragmented artifacts and data produced by
various tools, leading to extensive manual parsing. This slows junior DFIR
analyst skill development and risks overlooking crucial details precisely when
speed and accuracy matter most.

## 🌟 Get-Sybers Solution
<a name="get-sybers-solution"></a>

Automate and clarify the DeadBox DFIR data pipeline by normalizing data fields
consistent with the [MITRE CAR Data Model](https://car.mitre.org/data_model/),
queryable in [KQL](https://learn.microsoft.com/en-us/kusto/query/) against a
local Data Explorer emulator.

*Aspiration, not current state — see [What Actually Works](#what-actually-works).*

## 🎁 Benefits
<a name="benefits"></a>

- **Less Pain, More Gain**: Automate tedious tasks, focusing your time on investigations.
- **Accuracy & Speed**: Consistent mappings and automated parsing reduce errors and accelerate response.
- **Ready to Roll**: Quick-deployment scripts get you operational swiftly.
- **Offline by Design**: The real ADX query engine with no cloud, no account, and no network.

## 🛠️ Envisioned Endstate
<a name="envisioned-endstate"></a>

**This is the goal, not a working example.** The CAR functions that would make
this query return these results exist but are unverified.

```kusto
CarProcess()
| where isnotempty(command_line)
| project dtg = Timestamp, hostname, user, command_line, artifact = SourceType
```

| dtg                 | hostname       | user         | command_line                                              | artifact                 |
|---------------------|----------------|--------------|-----------------------------------------------------------|--------------------------|
| 2025-01-01T10:14:29 | WKS-1          | analyst01    | `powershell.exe -nop -exec bypass Invoke-Mimikatz.ps1`    | Prefetch                 |
| 2025-01-01T11:05:52 | DC-1           | svc_backup   | `powershell.exe Get-ChildItem -Path \\server\share`       | WinEVTX:Security         |
| 2025-01-01T11:45:17 | WKS-2          | jdoe         | `powershell.exe -EncodedCommand JABzAD0AbgBlAHQAIAB1AH...`| Volatile:Get-Process     |

## ⚖️ Licence
<a name="licence"></a>

Apache-2.0 — see [LICENSE](/LICENSE).

Apache-2.0 was chosen by following the vendored code rather than by
preference. `car_data_model.json` comes from
[MITRE CAR](https://github.com/mitre-attack/car) (Apache-2.0), and earlier
releases vendored substantially more Apache-2.0 code (Splunk Security Content
lookups, splunk-ansible playbooks — since retired with the Splunk stack, but
still in git history). Matching that licence keeps the project compatible with
everything it has ever redistributed.

Third-party components, the tools this pipeline drives, and the licensing
obligations that fall on *you* rather than on this code are documented in
[THIRD_PARTY_NOTICES.md](/THIRD_PARTY_NOTICES.md). Attribution required by
Apache-2.0 §4 is in [NOTICE](/NOTICE).

---

## 📌 Notes
<a name="notes"></a>

- Ensure your Docker environment is correctly set up before running scripts.
- The emulator holds your evidence with no authentication — keep it on
  `127.0.0.1` and treat the host as sensitive.
- Changes are tracked in [CHANGELOG.md](/CHANGELOG.md).

🚀 **Happy hunting!**
