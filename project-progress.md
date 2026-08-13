# 🗂️ DX_DFIR Pipeline Task Board

Tracks tasks for the DFIR automation project — from forensic data processing to
the Kusto-emulator analysis backend.

Current release and its maturity: see the badge in
[README.md](/README.md) — it reads the latest
[Release](https://github.com/Get-Sybers/DX_DFIR/releases) directly. The
pre-release code is frozen on the
[`deprecated`](https://github.com/Get-Sybers/DX_DFIR/tree/deprecated)
branch.

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
| [Log2timeline](https://github.com/log2timeline/plaso)         | ✅            | csv             | ✅           |     ✅ (`file`) |
| [Zeek](https://zeek.org/)                                     | ✅            | tsv             | ✅ (`conn` only) | ✅ (`flow`) |
| [WinEvent Logs](https://www.sans.org/white-papers/32949/) (EvtxECmd) | ⚠️     | evtx → json     | ✅           |     ✅ (`process`/`user_session`/`service`) |
| Velociraptor offline collectors ([EZ Tools](https://ericzimmerman.github.io/)) | ✅ `process-velociraptor.sh` (unpack collection) | json | ✅ `host.VelociraptorJson` | ✅ (`registry`) |
| [Velociraptor](https://github.com/Velocidex/velociraptor)     | ⚠️            | json            | ✅ `host.VelociraptorJson` | ✅ (`registry`) |
| [Volatility 3](https://github.com/volatilityfoundation/volatility3) | ✅ `process-volatility.sh` | json (per plugin) | ✅ `memory.VolatilityJson` | n/a (memory ≠ CAR dead-box object) |
| Linux Logs (syslog / auditd / utmp, via Plaso)                | ✅            | csv             | ✅ `host.L2tCsv` | ✅ (`user_session` utmp+PAM, `process` cron, `service` systemd) |
| [Sysmon](https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon) |    |                 |              |               |
| [Syslog](https://syslog-ng.github.io)                         |               |                 |              |               |
| [Zimmerman](https://github.com/EricZimmerman)                 |               |                 |              |               |
| [Hayabusa](https://github.com/Yamato-Security/hayabusa)       |               |                 |              |               |
| [Chainsaw](https://github.com/countercept/chainsaw)           |               |                 |              |               |

**The CAR column has now run against a live emulator.** The MITRE CAR data
model is expressed as KQL functions in the `mitre` database — `CarFlow()`,
`CarUserSession()`, `CarProcess()`, `CarService()`, `CarFile()`, `CarRegistry()`,
with `CarCoverage()` reporting what has data. All **six** sourced objects
returned real rows on the live engine (`file`=1240 from three real `.E01`
images, plus `flow`/`process`/`user_session`/`service`, and `registry` from
Velociraptor/RECmd output) — see
[docs/Runtime-Validation.md](/docs/Runtime-Validation.md). `registry` is sourced
again via the Velociraptor offline-collector/EZ-Tools path; `driver`, `module`
and `thread` still have none, because nothing dead-box produces driver loads,
image loads or thread creation — those need Sysmon or a live agent.

**What the live run still does not cover.** Plaso was run for real, but only on
filesystem test images — a Windows image (for `CarProcess`-from-Plaso via
Prefetch/Amcache) has not been run. The Zeek and EvtxECmd **engines** could not
run here (egress policy blocks the `zeek/zeek` image and there is no standalone
`.evtx` in the corpus), so their ingest/mapping/CAR paths were proven with
format-accurate fixtures rather than live tool output. The remaining runtime
checklist is [issue #14](https://github.com/Get-Sybers/DX_DFIR/issues/14).

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

---

# Update log

## 🔜 To Do

### 🔹 **Run the backend to ground** — *the blocker for everything*
- ⬜ **Run it.** Nothing has touched a real emulator. That gates everything
  below and is worth more than any further code —
  [issue #14](https://github.com/Get-Sybers/DX_DFIR/issues/14) is the ranked
  checklist.
- ⬜ Velociraptor ingestion. The table exists; the loader does not populate it.
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

### 🔹 **First run against a live Kusto emulator** — *the blocker, broken*
✅ Deploy → apply → ingest → `CarCoverage()` executed end-to-end on the real
`kustainer-linux` engine, with data processed from the Digital Corpora sample
URLs. Five of nine CAR objects returned real rows. Full write-up, including the
field/source-type breakdown, in
[docs/Runtime-Validation.md](/docs/Runtime-Validation.md).
✅ Processed three real `.E01` images with Plaso (`psteal --output-format
dynamic`) — 1240 filesystem events. Confirmed the 23-field CSV header order
matches the `L2tCsvMapping` ordinals, the `datetime` field parses with zero
nulls, and `ignoreFirstRecord` drops the header cleanly.
✅ Fixed four defects the live run surfaced, each invisible until first contact:
`network` is a **reserved database name** (bracket-quoted now); the `0L` long
literal in `CarCoverage()` is rejected by this build (`long(0)` now); the two
database-name parsers updated to match; and `CarFile()` left 260/1240 real rows
with an empty `action` because its `modify` regex missed `Metadata`/`File Last`
modification times (broadened now — all rows classify).
✅ Resolved [issue #14](https://github.com/Get-Sybers/DX_DFIR/issues/14) item 6:
`tolong()` **does** parse a `0x` hex string at run time, so `CarProcess.pid` is
populated (`0x1a4` → 420).
✅ Validated the Zeek `conn` and EvtxECmd ingest/mapping/CAR paths (including
`CarProcess`/`CarUserSession`/`CarService` and the Payload-XML extraction)
against the live engine with format-accurate fixtures — the tool engines
themselves are blocked by egress policy here.
✅ **Memory** processed with Volatility 3 → `memory.VolatilityJson`,
proving the constant-column injection the Velociraptor loader needs
([#16](https://github.com/Get-Sybers/DX_DFIR/issues/16)).
✅ **Android and macOS** artefacts processed with real Plaso parsers into
`host.L2tCsv`: Android `LOG`/"Android SMS messages"·"Android Call History"
([#17](https://github.com/Get-Sybers/DX_DFIR/issues/17)), macOS `WEBHIST`/"Safari
History Database" and the real `fseventsd` `MacOS File System Events`
([#18](https://github.com/Get-Sybers/DX_DFIR/issues/18)). These mobile/browser
source types correctly do **not** map to a CAR object (CAR's objects are
host dead-box: file/process/flow/…); they're queried directly by `SourceLong`.
Full Android/macOS *disk images* (5–48 GB) exceed the working disk here; the
real artefact formats were parsed instead. See
[docs/Runtime-Validation.md](/docs/Runtime-Validation.md).

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

### 🔹 **Field Extractions**

✅ **Log2timeline field mappings**
  - log2timeline output was changed from json to "dynamic" which outputs a "comma delimited" output. The reason for this is l2t captures more timestamp formats than I knew existed and won't convert them into epoch unless --dynamic output is made.
  - the end result is surprisingly a looot better than I expected csv.
  - huge benefit is I was able to pass the "datetime" field l2t outputs in as the timeline `_time` value — the same field now drives `Timestamp` in `host.L2tCsv`.

### 🔹 **Dynamic Scripts Testing**
✅ Test `process-log2timeline-Dynamic.sh` for processing **single and all E01 images**.
✅ Test `process-zeek-ALL.sh`.
✅ VMware VM export support added to log2timeline processing — lightly tested.

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

✅ **Closed an evidence-leak hole in `data_store/.gitignore`.**
  The old file was an extension blocklist, and it had already failed: VMware
  exports (`.vmdk`, `-flat.vmdk`, `.vmx`, `.ovf`, `.ova`, `.vmsd`, `.vmxf`) were
  fully committable, because VM support was added to the pipeline without
  updating the list — and `data_store/raw/VM_files/` is where the docs tell you
  to put them. Replaced with deny-by-default, which also covers extensionless
  files and any future format. Verified all 23 tracked skeleton files survive.
