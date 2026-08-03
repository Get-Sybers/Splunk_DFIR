# 🚀 Splunk DFIR Pipeline

> **Status: 🧪 Alpha — experimental.** `v0.1.0-alpha`
>
> Parts of this work well. Parts are half-built. The core promise — normalised
> MITRE CAR fields across every source — is **not delivered yet**. Read
> [What Actually Works](#what-actually-works) before you spend time here.

Automates the processing and ingestion of forensic data into
**[Splunk](https://www.splunk.com/)** using **[Plaso (log2timeline)](https://github.com/log2timeline/plaso)**,
**[Zeek](https://zeek.org/)**, and **[KAPE](https://www.kroll.com/en/services/cyber-risk/incident-response-litigation-support/kroll-artifact-parser-extractor-kape)**,
working toward field mappings aligned to the
**[MITRE CAR Data Model](https://car.mitre.org/data_model/)**.

---

## 📚 Repo

- [1. Overview](#overview)
- [2. Get-Started](/docs/Get-Started.md)
- [3. Dir-Structure](/docs/Dir-Structure.md)
- [4. Project-Progress](/project-progress.md)
- [5. Ansible](/docs/Ansible.md) — how it actually works here
- [6. Docs](/docs/)
- [7. Contributing](/CONTRIBUTING.md) · [Security](/SECURITY.md)

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

Point it at a disk image or a PCAP, and it processes the evidence, ships the
output into a Splunk container, and gives you a searchable timeline instead of a
pile of CSVs.

That's the idea. Here's where it honestly stands.

## 🧪 What Actually Works
<a name="what-actually-works"></a>

**Alpha means alpha.** This runs on the author's machine and has not been
validated anywhere else. Nothing here is production-ready, nothing has automated
tests, and interfaces will change without notice.

| Capability | State | Notes |
|:---|:---|:---|
| E01 → Plaso → Splunk | ✅ Works | Timeline search fully integrated; `_time` comes from Plaso's `datetime` field |
| VMware VM exports → Plaso | ✅ Works | Added recently, lightly tested |
| PCAP → Zeek → Splunk | ✅ Works | ISO8601 timestamps preserved |
| KAPE → Splunk | ⚠️ Partial | CSV/JSON ingest and timestamps map correctly. `Splunk_TA_kape` is a stub — `transforms.conf` only, no `app.conf` or `props.conf` |
| Splunk container deploy | ✅ Works | Dynamic path resolution. Configured by 3 playbooks injected into the container's own Ansible — [not a host-side Ansible setup](/docs/Ansible.md) |
| Rekall / Velociraptor ingest | ⚠️ Partial | Ingest apps exist; field extraction incomplete. Rekall upstream is archived |
| **MITRE CAR field mapping** | ❌ **Not delivered** | `car_data_model.json` and a data model conf exist. **No actual mapping is wired up.** This is the project's headline feature and it is not done |
| Raw EVTX ingest | ❌ Broken | Splunk sees the files but won't ingest them. Unresolved |
| Linux logs, Sysmon, Syslog, Hayabusa, Chainsaw | ❌ Not started | Directory structure only |

### Known limitations

- **No pipeline tests.** `./tests/run-checks.sh` now runs 90 static checks
  (shell syntax, shellcheck, path resolution, Splunk conf sanity, evidence
  gitignore, secrets, doc links) — but nothing exercises the actual pipeline.
  Every "✅" above still means "worked when the author last ran it by hand."
- **`scripts/v2/` is broken and unsupported.** Four of its seven scripts
  (`deploy-splunk.sh`, `setup-environment.sh`, `purge-splunk-container.sh`,
  `config-splunk-inputs.sh`) still compute `REPO_ROOT_DIR` as `$SCRIPT_DIR/..`,
  the depth that is correct in `scripts/` but one level short in `scripts/v2/`,
  so they resolve the repo root to `<repo>/scripts` instead of `<repo>`. **Use `scripts/`, not `scripts/v2/`.** See
  [project-progress.md](/project-progress.md).
- **Scripts `chmod -R 777` their working directories.** Convenient, not safe.
  Don't run this on a shared host.
- **Deploying accepts Splunk's licence for you** via
  `SPLUNK_START_ARGS=--accept-license`.
- **The `_time` normalisation story is inconsistent** across sources. Plaso and
  Zeek are good; KAPE is mostly right; everything else is unverified.
- **Seven defects were found and fixed during the alpha** — including one
  where Splunk kept no persistent state at all (`splunk/var` was mounted at
  `/data/var`, a path Splunk never reads, so every index died with the
  container). **None of the fixes are runtime-tested** — there is no Docker or
  Splunk in the development environment. See
  [project-progress.md](/project-progress.md#-defects-found-and-fixed-in-the-alpha).
- **The `ansible/` directory is mostly inert.** Ansible runs *inside* the Splunk
  container, not from a control node. Of its 101 files, 97 derive from
  splunk-ansible and 94 are never executed at all; exactly 2 playbooks are
  original work. See [docs/Ansible.md](/docs/Ansible.md). Driving the whole pipeline
  through Ansible — "Ansible it all" — is the
  [beta target](/docs/Ansible-Roadmap.md).

## 🛑 Before You Run Anything
<a name="before-you-run-anything"></a>

Three things that will bite you otherwise:

1. **KAPE is not free for commercial use.** KAPE Solo Edition is free for
   personal, educational, and law-enforcement use only. Using the KAPE
   automation here in a paid engagement or on a client network requires a
   **KAPE Enterprise licence** from Kroll. This is the tightest constraint in
   the project — see [THIRD_PARTY_NOTICES.md](/THIRD_PARTY_NOTICES.md).
2. **Splunk Enterprise is proprietary.** The deploy script auto-accepts the
   Splunk licence and runs the free tier, which is volume-capped and has no
   authentication features.
3. **This handles real evidence.** `data_store/` is now gitignored
   deny-by-default, so unknown and extensionless formats are covered. It is
   still a safety net, not a guarantee — check `git status` before you commit,
   every time. (Until `v0.1.0-alpha` this was an extension blocklist, and
   VMware exports were committable through it.)

## 🏴‍☠️ Why This Exists
<a name="why-this-exists"></a>

Most SOCs have already figured this problem out. Unfortunately, DeadBox
forensics still has its place, but it doesn't need to remain outdated. Learning
DFIR via DeadBox analysis is common and arguably a great starting point. DFIR
should be fast, efficient, and less tedious. This project automates messy tasks,
lowering the barrier to entry and encouraging faster DFIR skill development by
transforming forensic data into neatly mapped and standardized Splunk events.

## 🎯 The Problem - DeadBox Forensics
<a name="the-problem---deadbox-forensics"></a>

DFIR analysts juggle mountains of fragmented artifacts and data produced by
various tools, leading to extensive manual parsing. This slows junior DFIR
analyst skill development and risks overlooking crucial details precisely when
speed and accuracy matter most.

## 🌟 Get-Sybers Solution
<a name="get-sybers-solution"></a>

Automate and clarify the DeadBox DFIR data pipeline by normalizing data fields
consistent with the [MITRE CAR Data Model](https://car.mitre.org/data_model/).

*Aspiration, not current state — see [What Actually Works](#what-actually-works).*

## 🎁 Benefits
<a name="benefits"></a>

- **Less Pain, More Gain**: Automate tedious tasks, focusing your time on investigations.
- **Accuracy & Speed**: Consistent mappings and automated parsing reduce errors and accelerate response.
- **Ready to Roll**: Quick-deployment scripts get you operational swiftly.
- **Familiarity**: Simplify DFIR terminology: Artifact, Artifact Source, Field.

## 🛠️ Envisioned Endstate
<a name="envisioned-endstate"></a>

**This is the goal, not a working example.** The CAR field mapping that would
make this search return these results is not implemented yet.

```spl
process=* action=create
| table dtg, hostname, user, command_line, artifact
```

| dtg                 | hostname       | user         | command_line                                              | artifact                 |
|---------------------|----------------|--------------|-----------------------------------------------------------|--------------------------|
| 2025-01-01T10:14:29 | WKS-1          | analyst01    | `powershell.exe -nop -exec bypass Invoke-Mimikatz.ps1`    | Prefetch                 |
| 2025-01-01T11:05:52 | DC-1           | svc_backup   | `powershell.exe Get-ChildItem -Path \\server\share`       | WinEVTX:Security         |
| 2025-01-01T11:45:17 | WKS-2          | jdoe         | `powershell.exe -EncodedCommand JABzAD0AbgBlAHQAIAB1AH...`| Volatile:Get-Process     |

## ⚖️ Licence
<a name="licence"></a>

Apache-2.0 — see [LICENSE](/LICENSE).

Apache-2.0 was chosen by following the vendored code rather than by preference.
97 of the 101 files in `ansible/` derive from
[splunk-ansible](https://github.com/splunk/splunk-ansible); the `DETECT` and
`BASELINE` apps ship 77 lookup files from
[Splunk Security Content](https://github.com/splunk/security_content); and
`car_data_model.json` comes from
[MITRE CAR](https://github.com/mitre-attack/car) — all Apache-2.0. Matching that licence keeps the project compatible with what it
already redistributes.

Third-party components, the tools this pipeline drives, and the licensing
obligations that fall on *you* rather than on this code are documented in
[THIRD_PARTY_NOTICES.md](/THIRD_PARTY_NOTICES.md). Attribution required by
Apache-2.0 §4 is in [NOTICE](/NOTICE).

---

## 📌 Notes
<a name="notes"></a>

- Ensure your Docker environment is correctly set up before running scripts.
- Handle Splunk credentials and sensitive data securely.
- Changes are tracked in [CHANGELOG.md](/CHANGELOG.md).

🚀 **Happy hunting!**
