# 🗂️ DX_DFIR Pipeline Task Board

Tracks tasks for the DFIR automation project — from forensic data processing to
the Kusto-emulator analysis backend.

Current release and its maturity: see the badge in
[README.md](/README.md) — it reads the latest
[Release](https://github.com/Get-Sybers/DX_DFIR/releases) directly. The
pre-release code is frozen on the
[`deprecated`](https://github.com/Get-Sybers/DX_DFIR/tree/deprecated)
branch.

> **The pivot.** This project was Splunk_DFIR. The SIEM layer is now the
> **Azure Data Explorer Kusto emulator** — offline, local, KQL — and the
> entire Splunk stack (two deploy scripts, eight Splunk apps, the
> in-container Ansible provisioning, ~3 MB of vendored ESCU lookups) was
> retired in one cut. Anything below marked *(Splunk era)* is preserved
> history, not live work. The Splunk implementation survives in git history
> and on the `deprecated` branch.

A note on what the ticks mean, because the previous version of this board was
generous with them:

| Mark | Meaning |
|:---:|:---|
| ✅ | Ran end-to-end by hand and produced correct output |
| ⚠️ | Runs, but incomplete, fragile, or unverified |
| ◑ | Built and internally consistent, never run against a live emulator |
| ❌ | Not working, or not started |

Nothing on this board is covered by pipeline tests. "✅" is the author's
word, not a test result.

---

# Data Pipeline Progress

Processing = the evidence-side scripts. Ingest / CAR = the Kusto backend.

| Processing Tool / Artefact                                    | Automate Data | File Type      | Kusto Ingest | CAR Functions |
|:--------------------------------------------------------------|:-------------:|:---------------|:------------:|:-------------:|
| [Log2timeline](https://github.com/log2timeline/plaso)         | ✅            | csv             | ◑            |     ◑        |
| [Zeek](https://zeek.org/)                                     | ✅            | tsv             | ◑ (`conn` only) | ◑         |
| [WinEvent Logs](https://www.sans.org/white-papers/32949/) (EvtxECmd) | ⚠️     | evtx → json     | ◑            |     ◑        |
| Velociraptor offline collectors ([EZ Tools](https://ericzimmerman.github.io/)) | ❌ planned — replaces the removed KAPE path | json | ❌ | ❌ |
| [Velociraptor](https://github.com/Velocidex/velociraptor)     | ⚠️            | json            | ❌ loader not implemented | ❌ |
| [Rekall](https://github.com/google/rekall)                    | ⚠️            | json            | ❌ loader not implemented | ❌ |
| Linux Logs                                                    |               |                 |              |               |
| [Sysmon](https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon) |    |                 |              |               |
| [Syslog](https://syslog-ng.github.io)                         |               |                 |              |               |
| [Zimmerman](https://github.com/EricZimmerman)                 |               |                 |              |               |
| [Hayabusa](https://github.com/Yamato-Security/hayabusa)       |               |                 |              |               |
| [Chainsaw](https://github.com/countercept/chainsaw)           |               |                 |              |               |

**The CAR column is ◑, not ✅.** The MITRE CAR data model is expressed as KQL
functions in the `mitre` database — `CarFlow()`, `CarUserSession()`,
`CarProcess()`, `CarService()`, `CarFile()`, with `CarCoverage()` reporting
what has data. Five of the nine CAR objects have a source. `registry` lost its
only source when the KAPE path was removed and awaits the Velociraptor/EZ-Tools
collectors; `driver`, `module` and `thread` have none, because nothing
dead-box produces driver loads, image loads or thread creation — those need
Sysmon or a live agent.

**None of it has been run against a live emulator.** ◑ means built and
internally consistent, not working. Turning those into ✅ is what stands
between this and `1.0.0`, and it needs a real deploy, not more code. The
runtime checklist is
[issue #14](https://github.com/Get-Sybers/DX_DFIR/issues/14).

---

# 🚨 Known Limitations

Things that are broken or unsafe right now.

- **No pipeline tests.** `tests/run-checks.sh` runs the static and behavioural
  repo checks in CI, but nothing exercises the actual pipeline. Until
  something does, every ✅ on this board is still a claim rather than a
  result. Highest-value next step.
- **Nothing has touched a real emulator.** Deploy, schema, ingestion and the
  CAR functions are verified against fakes and fixtures only.
- **`chmod -R 777` on data directories.** Processing scripts widen permissions
  on `data_store/` to work around Docker UID mismatches. Don't run on a shared
  host.
- **The emulator has no security features at all** — no auth, no access
  control, plaintext HTTP, no encryption at rest. The `127.0.0.1` binding is
  the only control; see [SECURITY.md](/SECURITY.md).
- **Raw EVTX processing is built but unverified.** `process-evtx-EvtxECmd.sh`
  has never been run against a real event log.

Superseded by the pivot *(Splunk era)*: the 74 inert ESCU lookups, the
zero-byte `BASELINE` confs, and the operator-supplied `Splunk_TA_zeek` /
`sankey_diagram_app` requirement all left with the Splunk stack.

---

# Update log

## 🔜 To Do

### 🔹 **Run the backend to ground** — *the blocker for everything*
- ⬜ **Run it.** Nothing has touched a real emulator. That gates everything
  below and is worth more than any further code —
  [issue #14](https://github.com/Get-Sybers/DX_DFIR/issues/14) is the ranked
  checklist.
- ⬜ Velociraptor and Rekall ingestion. Tables exist; the loader populates
  neither.
- ⬜ 68 of Zeek's 69 log types. Only `conn.log` is typed and ingested — it is
  the one `car_flow` needs.
- ⬜ Verify the `pid` hex conversion. `pid_hex` is always right; `pid` depends
  on `tolong()` accepting a `0x` prefix, which is untested
  ([issue #14](https://github.com/Get-Sybers/DX_DFIR/issues/14), item 6).

### 🔹 **Data Models & MITRE CAR Mapping**
- Validate the CAR field mappings against real Windows event logs, Zeek logs,
  and forensic artifacts (KQL functions exist; values unverified).
- Extend lookups for event IDs, log sources, and mapped MITRE techniques —
  potentially from CTI STIX data and
  https://github.com/ForensicArtifacts/artifacts.
- A visualisation story for CAR-mapped events (the emulator has no dashboard
  layer; Kusto.Explorer or a thin web UI are the candidates).

### 🔹 **Testing** — *partly done*
- ✅ Syntax/lint gating — `tests/run-checks.sh` (`bash -n`, shellcheck, path
  resolution, the container-lifecycle library's behavioural tests, Kusto
  schema consistency, gitignore, secrets, doc links). The count is whatever
  the harness prints; it is deliberately not restated here.
- ⬜ A smoke test that runs the pipeline against a small public sample image.

(The `Invoke-ScriptAnalyzer` CI job went with the KAPE PowerShell scripts —
there is no PowerShell in the repo now. If the Velociraptor collector path
brings any back, the job comes back with it.)

### 🔹 **Velociraptor offline collectors (EZ Tools) & Raw EVTX**
- Build the offline-collector path: Velociraptor collectors running the EZ
  Tools for artefact collection and parsing — the replacement for the removed
  KAPE automation. Same Zimmerman parsers and field names, so the retired
  `KapeJson` mapping in git history is the starting point; re-sources the
  `registry` CAR object when it lands. If the collectors emit EZ-tool CSV,
  the answer is typed per-artefact tables or JSON conversion — a CSV mapping
  cannot populate a `dynamic` column.
- Verify `process-evtx-EvtxECmd.sh` against a real event log.

### 🔹 **Environment & Dependencies**
- Create a guide for **setting up the development environment**.

---

## 🔄 In Progress

### 🔹 **Documentation**
- Update **READMEs** based on testing outcomes and any new features.

---

## ✅ Done

### 🔹 **The pivot: Splunk → Data Explorer emulator**
✅ Ported the SIEM layer to the Kusto emulator — 5 databases, typed tables and
ingestion mappings for Plaso/EvtxECmd/Zeek `conn`, MITRE CAR as KQL functions,
deploy/apply/ingest scripts with the container lessons the Splunk path paid
for (isolation verified both directions, honest purges, real readiness
checks).
✅ Retired the Splunk stack in one cut — scripts, eight apps, in-container
Ansible, vendored ESCU lookups. History and the `deprecated` branch keep it.
✅ Consolidated the container lifecycle into `scripts/lib/docker-lifecycle.sh`
and the ingest sources into a descriptor table.

### 🔹 **Field Extractions** *(Splunk era)*

✅ **Log2timeline field mappings**
  - log2timeline output was changed from json to "dynamic" which outputs a "comma delimited" output. The reason for this is l2t captures more timestamp formats than I knew existed and won't convert them into epoch unless --dynamic output is made.
  - the end result is surprisingly a looot better than I expected csv.
  - huge benefit is I was able to pass the "datetime" field l2t outputs in as the timeline `_time` value — the same field now drives `Timestamp` in `host.L2tCsv`.

⚠️ **Kape CSV and JSON** — *partial*
  - timestamps so far are mapped correctly. Need more data to test.
  - haven't been able to push SOF-ELK sourcetype to the rest of the Kape source types.

### 🔹 **Dynamic Scripts Testing**
✅ Test `process-log2timeline-Dynamic.sh` for processing **single and all E01 images**.
✅ Test `process-zeek-ALL.sh`.
✅ VMware VM export support added to log2timeline processing — lightly tested.

### 🔹 **Splunk Deployment Enhancements** *(Splunk era — retired)*

✅ Learned Ansible-in-the-container provisioning, wired custom apps, dynamic
path resolution, network isolation with both-direction verification, purge vs
persist semantics, `--var-dir` host-directory indexes. All of it is retired
with the Splunk stack; the transferable lessons live on in
`scripts/lib/docker-lifecycle.sh` and the defect table below.

### ✅ **Deployment & Ingestion** *(Splunk era)*
- Splunk container was deployed and properly configured; ingestion tested by
  hand against the author's data. That validation does **not** carry over to
  the Kusto backend — see Known Limitations.

### ✅ **log2timeline Processing**
- Functional pipeline for **E01 images → Plaso → CSV**.
  *(output was originally JSON, later changed to csv)*

### ✅ **Zeek Processing**
- PCAPs successfully converted into Zeek logs.

### ✅ **Repository Setup & Documentation**
- Created base directory structure (`data_store`, `scripts`).
- Wrote **README files** for root, `data_store`, and `scripts` directories.

### ✅ **Release hygiene** *(v0.2.0-beta)*
- Audited every vendored dependency and settled the project licence — Apache-2.0.
- Added `LICENSE`, `NOTICE`, `THIRD_PARTY_NOTICES.md`, `CHANGELOG.md`.
- Documented how the in-container Ansible actually worked (`docs/Ansible.md`,
  retired with the Splunk stack).

✅ **Closed an evidence-leak hole in `data_store/.gitignore`.**
  The old file was an extension blocklist, and it had already failed: VMware
  exports (`.vmdk`, `-flat.vmdk`, `.vmx`, `.ovf`, `.ova`, `.vmsd`, `.vmxf`) were
  fully committable, because VM support was added to the pipeline without
  updating the list — and `data_store/raw/VM_files/` is where the docs tell you
  to put them. Replaced with deny-by-default, which also covers extensionless
  files and any future format. Verified all 23 tracked skeleton files survive.

---

## 🐛 Defects found and fixed in the v0.2.0-beta release *(Splunk era)*

**None of these fixes were runtime-tested.** There was no Docker and no Splunk
in the environment they were written in, which is why the deploy scripts
verify themselves at run time rather than relying on assertions here. The
Splunk-specific fixes are retired with the stack; the lessons carried into
`scripts/lib/docker-lifecycle.sh`.

### Pre-existing — found by audit

| # | Defect | Effect | Fix |
|:--|:---|:---|:---|
| 1 | `splunk/var` mounted at `/data/var`; `SPLUNK_DB` never redirected | Splunk reads `/opt/splunk/var`, which wasn't mounted — **every index and the fishbucket died with the container**. Only the mount *point* was wrong: it was the script's one read-write mount, so a repo-local index directory was clearly the intent | Mounted at `/opt/splunk/var` — a named volume by default, or a host directory via `--var-dir` |
| 2 | `host = extracted_host` written as a literal | Every event labelled `extracted_host` | Removed; `[l2t:csv]` already set host via `TRANSFORMS-set_host` |
| 3 | Four copy tasks gated on a single `limits.conf` stat | Editing `indexes.conf` or `inputs.conf` was a silent no-op | Per-file stat; mode `0755`→`0644` |
| 4 | No `set -e`, no `docker rm` before `docker run --name` | A second run collided, then greped the **old** container's logs and exited 0 having deployed nothing | Refuses to collide; polls by container ID; detects a container that dies mid-startup |
| 5 | Unquoted paths in `sudo chown -R` / `chmod -R` | A repo path containing a space would target unintended directories | All quoted |
| 6 | 7 scripts resolved the repo root one level wrong | `scripts/v2/` ×4, `scripts/deprecated/` ×3 — the deprecated three were caught by the new check harness, not by reading | Corrected; a check now asserts this for every script |
| 7 | `data_store/.gitignore` was an extension blocklist | VMware exports were committable — see above | Deny-by-default |

### Introduced during that release, then fixed

Recorded because how they got in matters more than the diffs.

| # | Defect | Effect | Why it shipped |
|:--|:---|:---|:---|
| 8 | Isolation implemented with `docker network create --internal` | **Splunk unreachable on `localhost:8000`.** An internal network blocks published ports in *both* directions, not just egress | The deploy's isolation check tested egress only. It passed while the UI was dead — one-sided verification. Replaced with a bridge running `enable_ip_masquerade=false`, verified in both directions — the mechanism the Kusto deploy inherits via the shared lifecycle library |
| 9 | `--purge` lived only on the deploy script | No way to wipe indexes without also redeploying | The flag was added to the script that needed it without asking what "purge" alone should mean. `--purge-only` now wipes and exits — on the Kusto deploy too |
| 10 | CI step written as `command -v x \|\| a && b` | Shell precedence makes that `(command -v x \|\| a) && b`, so `b` ran unconditionally | Assumed C-style precedence. Rewritten as an explicit `if` block |

Defects 8 and 9 were reported by the user against a running deployment. Both
were real, and both were mine.
