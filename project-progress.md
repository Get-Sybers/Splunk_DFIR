# 🗂️ Splunk DFIR Pipeline Task Board

Tracks tasks for the DFIR automation project—from forensic data processing to
Splunk deployment.

Current release and its maturity: see the badge in
[README.md](/README.md) — it reads the latest
[Release](https://github.com/Get-Sybers/Splunk_DFIR/releases) directly. The
pre-release code is frozen on the
[`deprecated`](https://github.com/Get-Sybers/Splunk_DFIR/tree/deprecated)
branch.

A note on what the ticks mean, because the previous version of this board was
generous with them:

| Mark | Meaning |
|:---:|:---|
| ✅ | Ran end-to-end by hand and produced correct output |
| ⚠️ | Runs, but incomplete, fragile, or unverified |
| ❌ | Not working, or not started |

Nothing on this board is covered by automated tests. "✅" is the author's
word, not a test result.

---

# Data Pipeline Progress

| Processing Tool / Artefact                                    | Automate Data | File Type      | Ingest | Extract | Data Model |
|:--------------------------------------------------------------|:-------------:|:---------------|:------:|:-------:|:----------:|
| [Log2timeline](https://github.com/log2timeline/plaso)         | ✅            | csv             | ✅     |    ✅   |     ◑     |
| [Zeek](https://zeek.org/)                                     | ✅            | tsv             | ✅     |    ✅   |     ◑     |
| [Kape](https://github.com/EricZimmerman/KapeFiles)            | ✅            | json, csv       | ✅     |    ⚠️   |     ◑     |
| [Velociraptor](https://github.com/Velocidex/velociraptor)     | ⚠️            | json            | ⚠️     |    ❌   |     ❌     |
| [Rekall](https://github.com/google/rekall)                    | ⚠️            | json            | ⚠️     |    ❌   |     ❌     |
| CSVs                                                          |               | csv             | ✅     |         |     ❌     |
| JSON                                                          |               | json            | ✅     |         |     ❌     |
| [WinEvent Logs](https://www.sans.org/white-papers/32949/)     | ⚠️            | evtx            | ⚠️     |    ⚠️   |     ◑     |
| Linux Logs                                                    |               |                 |        |         |            |
| [Sysmon](https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon) |    |                 |        |         |            |
| [Syslog](https://syslog-ng.github.io)                         |               |                 |        |         |            |
| [Zimmerman](https://github.com/EricZimmerman)                 |               |                 |        |         |            |
| [Hayabusa](https://github.com/Yamato-Security/hayabusa)       |               |                 |        |         |            |
| [Chainsaw](https://github.com/countercept/chainsaw)           |               |                 |        |         |            |

**The Data Model column is ◑, not ✅.** `MITRE_CAR_App` now exists: a data
model generated from MITRE's own `car_data_model.json`, plus the eventtype/tag
layer and field mappings that populate it from Plaso, Zeek, EvtxECmd and KAPE.
Six of the nine CAR objects have a source; `driver`, `module` and `thread` have
none, because nothing dead-box produces driver loads, image loads or thread
creation — those need Sysmon or a live agent.

**None of it has been run against Splunk.** ◑ means built and internally
consistent, not working. Turning those into ✅ is what stands between this and
`1.0.0`, and it needs a real deploy, not more code.

---

# 🚨 Known Limitations

Things that are broken or unsafe right now.

### ✅ The inert Ansible layer has been removed

`ansible/` held 101 files; **94 of them were never executed by anything**.
Ansible runs *inside* the Splunk container via `SPLUNK_ANSIBLE_PRE_TASKS`, only
`ansible/playbooks/` is mounted, and the container image ships its own copy of
splunk-ansible.

Removed in v0.2.0-beta: `ansible/tasks/` (79), `ansible/default_playbooks/`
(15), two zero-byte `ansible/scripts/` placeholders, and the two unwired
playbooks (`copy_installed_apps.yml`, `disable_popups.yml` — the latter
superseded by the `SPLUNK_DISABLE_POPUPS` env var).

**What remains is 3 files, all wired, all passing `ansible-lint` at its
`production` profile.** Two are original work. This also removed the project's
largest third-party obligation at zero functional cost.

There is still no inventory, no `ansible.cfg`, no roles, and `ansible-playbook`
is never run on the host — see [docs/Ansible.md](/docs/Ansible.md) and the
[roadmap](/docs/Ansible-Roadmap.md).

### ✅ Network isolation

The container ran on the default bridge with ports bound to `0.0.0.0` and full
outbound access. It now attaches to a dedicated bridge with **IP masquerade
disabled** and publishes on `127.0.0.1` only, and the deploy tests **both
directions** after starting: that the container can't usefully reach out, and
that Splunk actually answers on the published port. Not an airgap — see
[SECURITY.md](/SECURITY.md).

⚠️ The first attempt used `--internal`, which broke the UI — see
[the defect list](#-defects-found-and-fixed-in-this-release). Everything else here
remains unverified at runtime, which is precisely why the checks are built into
the deploy rather than asserted here.

### 🔻 Other blockers

- **No pipeline tests.** `tests/run-checks.sh` runs 138 static checks in CI, but
  nothing exercises the actual pipeline. Until something does, every ✅ on this
  board is still a claim rather than a result. Highest-value next step.
- **`chmod -R 777` on data directories.** Processing scripts widen permissions
  on `data_store/` to work around Docker UID mismatches. Don't run on a shared
  host.
- **77 lookup CSVs ship, and 74 of them are inert.** `DETECT` carries 61 files
  and its `lookups.conf` defines **one**; `BASELINE` carries 16 and its
  `lookups.conf` is zero bytes, so none are defined; `Log2timeline_App` defines
  1 of 2. An undefined lookup is invisible to Splunk — it cannot be used in
  `| lookup`, and no saved search can reach it. So ~3 MB of Splunk Security
  Content ships, carries the project's largest Apache-2.0 attribution
  obligation, and does nothing. Either define them or drop them; both are
  defensible, shipping them undefined is not.
- **`BASELINE` has four zero-byte conf files** (`props`, `transforms`, `fields`,
  `lookups`). A zero-byte conf contributes nothing to Splunk's config merge, so
  the app is 16 lookups and a handful of dashboards with no configuration
  behind them.
- **Raw EVTX ingest is built but unverified.** `process-evtx-EvtxECmd.sh` and
  `EvtxECmd_App` now exist and map EvtxECmd output onto the Splunk Add-on for
  Microsoft Windows field names. Part of the original problem was simpler than
  suspected: there was **no monitor stanza for the EVTX directory at all**, and
  Splunk cannot read binary `.evtx` in any case. Neither the script nor the
  conf has been run against a real event log.
- **Two third-party Splunk apps must now be supplied by you.**
  `Splunk_TA_zeek` and `sankey_diagram_app` are no longer shipped (neither
  declares a licence permitting redistribution). Put their Splunkbase packages
  in `data_store/dependencies/splunk_apps/` and they install at deploy time.
  **Without `Splunk_TA_zeek`, Zeek logs ingest unparsed.** `deploy-splunk.sh`
  warns before deploying. See
  [the README there](/data_store/dependencies/splunk_apps/README.md).
- **`DETECT` and `BASELINE` are mostly not original either.** 77 of their lookup
  files (~3 MB) come from Splunk Security Content, authored by the Splunk Threat
  Research Team, renamed with a local `bad_`/`com_`/`sus_` prefix. Apache-2.0
  and now attributed, but worth knowing when judging how much of these apps is
  this project's own work.
- **Duplicate/stale docs.** `docs/scripts/Environment-Setup.md` and
  `docs/scripts/Setup_Environment.md` document the same script.

---

# Update log

## 🔜 To Do

### 🔹 **"Ansible it all"** — *post-beta target*
The plan is for Ansible to drive the whole pipeline — environment setup,
evidence processing, Splunk lifecycle — rather than injecting three playbooks
into a container at boot. Note this means standing up a **second** Ansible
surface (a host-side control node), separate from the container-internal one
that exists today.

Staged plan, scope boundaries and risks: [Ansible-Roadmap.md](/docs/Ansible-Roadmap.md).

### 🔹 **Data Models & MITRE CAR Mapping** — *the blocker for beta*
- Implement **log normalization** to align fields with **MITRE CAR**.
- Validate field mappings against Windows event logs, Zeek logs, and forensic artifacts.
- Create **lookup tables** for event IDs, log sources, and mapped MITRE techniques.
  - looking at potentially doing this in splunk rather than outside of it.
  - Looking at the potential to use CTI STIX data for this as well as data within https://github.com/ForensicArtifacts/artifacts
- Develop a **Splunk dashboard** to visualize **MITRE CAR-mapped events**.

### 🔹 **Testing** — *partly done*
- ✅ Syntax/lint gating — `tests/run-checks.sh` (86 checks: `bash -n`,
  shellcheck, path resolution, `ansible-lint`, conf sanity, gitignore, secrets,
  doc links).
- ⬜ A smoke test that runs the pipeline against a small public sample image.
- ⬜ `Invoke-ScriptAnalyzer` for the PowerShell scripts.
- ⬜ Wire the above into CI so "✅" on this board means something checkable.

### 🔹 **KAPE & Raw EVTX Processing**
- Develop ingestion pipeline for **KAPE output** (targeting forensic triage artifacts).
  - looking at probably making a container that can handle Windows API calls
- Implement raw **EVTX file parsing** and ensure event logs are properly structured for Splunk ingestion.
  - currently splunk doesn't want to ingest the logs. it can see them but won't ingest them. I think it's possibly something to do with the Windows update log not registering a new change to evtx files.
- ~~Complete `Splunk_TA_kape`~~ — **not needed, and removed.** Tracing the git
  history showed its config was migrated into `Kape_App` on 2025-07-13
  (`99eb95d`), byte-for-byte: same 20 props stanzas, identical
  `extract_kape_sourcetype` transform. What was left behind was an empty
  directory holding one zero-byte `transforms.conf` and no `app.conf`. The docs
  had described that leftover as an unfinished stub for a year, so this sat on
  the roadmap as work that was already done.
- **Define or drop the 74 undefined lookups** — see Known Limitations. This is
  the larger KAPE/DETECT question: `DETECT` ships 61 lookup CSVs and defines 1.

### 🔹 **Splunk Apps for Data Types**
- Ensure `_time` is correctly extracted from **artifact creation timestamps**.
- Normalize timestamps across all data sources for consistent correlation.

### 🔹 **Environment & Dependencies**
- Create a guide for **setting up the development environment**.

### 🔹 **Licensing follow-ups**
- ✅ Redistribution of `Splunk_TA_zeek` / `sankey_diagram_app` — resolved by
  removing both and installing them from operator-supplied packages.
- Mark `remove_first_login.yml` in-file as modified, per Apache-2.0 §4(b).
- Review the `!dependencies/SuperMem/**` rule in `data_store/.gitignore`. It
  would vendor a third-party tool into the repo if SuperMem is placed there.

---

## 🔄 In Progress

### 🔹 **Splunk Apps for Data Types**
- Create individual Splunk apps for each data type (Zeek, log2timeline, EVTX, KAPE). This app will handle all conf files for ingestion.
- **Documentation Updates**
  - Update **READMEs** based on testing outcomes and any new features.

### 🔹 **Data Models & MITRE CAR Mapping**
- Design Splunk **data models** to map processed logs (Zeek, log2timeline) to **MITRE CAR fields**.
  - data model conf has been made. Mapping still needs to occur once ingested data sources' fields have been extracted.
  - working dir `$Splunk_DFIR/splunk/dev/apps/MITRE CAR-Aligned/MITRE_CAR_APP`

### 🔹 **Ansible Playbooks**
- Develop bash scripts to cater for laziness around typing commands to execute playbooks
- Develop playbook to persist important configs inside container

### 🔹 **Script consolidation**

---

## ✅ Done

### 🔹 **Field Extractions**

✅ **Log2timeline field mappings**
  - log2timeline output was changed from json to "dynamic" which outputs a "comma delimited" output. The reason for this is l2t captures more timestamp formats than I knew existed and won't convert them into epoch (one of few time formats Splunk can interpret) unless --dynamic output is made.
  - the end result is surprisingly a looot better than I expected csv.
  - huge benefit is I was able to pass the "datetime" field l2t outputs into splunk as the _time value. So the timeline search feature is fully integrated.

⚠️ **Kape CSV and JSON** — *partial*
  - timestamps so far are mapped correctly. Need more data to test if anything more will capture ingest time as `_time`.
  - haven't been able to push SOF-ELK sourcetype to the rest of the Kape source types.

### 🔹 **Dynamic Scripts Testing**
✅ Test `process-log2timeline-Dynamic.sh` for processing **single and all E01 images**.
✅ Test `process-zeek-ALL.sh`.
✅ VMware VM export support added to log2timeline processing — lightly tested.

### 🔹 **Splunk Deployment Enhancements**

✅ Learn how to better use Ansible for better splunk deployment
  - cry
  - write ansible playbook to install custom user apps for host directory
  - integrate ansible playbook with `deploy-splunk.sh`

✅ Finalize and test `deploy-splunk.sh` for **dynamic path resolution**.
✅ Review and refine folder structures in `data_store` and `scripts`.
✅ Validate that all **dynamic paths** work as expected across different environments.
⚠️ Integrate **Splunk authentication and security best practices** — *partial; free-tier Splunk has no auth features, and scripts still `chmod 777`.*

### ✅ **Deployment & Ingestion into Splunk**
- Splunk container is **deployed and properly configured**.
- Ingestion scripts tested by hand against the author's data.

### ✅ **log2timeline Processing**
- Functional pipeline for **E01 images → Plaso → CSV → Splunk**.
  *(output was originally JSON, later changed to csv)*

### ✅ **Zeek Processing**
- PCAPs successfully converted into Zeek logs and **ingested into Splunk**.

### ✅ **Repository Setup & Documentation**
- Created base directory structure (`data_store`, `scripts`, `splunk`).
- Wrote **README files** for root, `data_store`, and `scripts` directories.

### ✅ **Release hygiene** *(v0.2.0-beta)*
- Audited every vendored dependency and settled the project licence — Apache-2.0.
- Added `LICENSE`, `NOTICE`, `THIRD_PARTY_NOTICES.md`, `CHANGELOG.md`.
- Corrected Splunk app versions from `1.0.0` to `0.1.0` — they were claiming
  stable while the project had no release at all.
- Documented how Ansible actually works here — [docs/Ansible.md](/docs/Ansible.md).

✅ **Closed an evidence-leak hole in `data_store/.gitignore`.**
  The old file was an extension blocklist, and it had already failed: VMware
  exports (`.vmdk`, `-flat.vmdk`, `.vmx`, `.ovf`, `.ova`, `.vmsd`, `.vmxf`) were
  fully committable, because VM support was added to the pipeline without
  updating the list — and `data_store/raw/VM_files/` is where the docs tell you
  to put them. Replaced with deny-by-default, which also covers extensionless
  files and any future format. Verified all 23 tracked skeleton files survive.

---

## 🐛 Defects found and fixed in this release

**None of these fixes are runtime-tested.** There is no Docker and no Splunk in
the environment they were written in, which is why the deploy script now
verifies itself at run time rather than relying on assertions here.

### Pre-existing — found by audit

| # | Defect | Effect | Fix |
|:--|:---|:---|:---|
| 1 | `splunk/var` mounted at `/data/var`; `SPLUNK_DB` never redirected | Splunk reads `/opt/splunk/var`, which wasn't mounted — **every index and the fishbucket died with the container**. Only the mount *point* was wrong: it was the script's one read-write mount, so a repo-local index directory was clearly the intent | Mounted at `/opt/splunk/var` — a named volume by default (Docker seeds ownership from the image), or a host directory via `--var-dir`, which restores the original design. Purge handles both |
| 2 | `host = extracted_host` written as a literal | Every event labelled `extracted_host` | Removed; `[l2t:csv]` already sets host via `TRANSFORMS-set_host` |
| 3 | Four copy tasks gated on a single `limits.conf` stat | Editing `indexes.conf` or `inputs.conf` was a silent no-op | Per-file stat; mode `0755`→`0644` |
| 4 | No `set -e`, no `docker rm` before `docker run --name` | A second run collided, then greped the **old** container's logs and exited 0 having deployed nothing | Refuses to collide; polls by container ID; detects a container that dies mid-startup; 600s configurable timeout |
| 5 | Unquoted paths in `sudo chown -R` / `chmod -R` | A repo path containing a space would target unintended directories | All quoted |
| 6 | 7 scripts resolved the repo root one level wrong | `scripts/v2/` ×4, `scripts/deprecated/` ×3 — the deprecated three were caught by the new check harness, not by reading | Corrected; a check now asserts this for every script |
| 7 | `data_store/.gitignore` was an extension blocklist | VMware exports were committable — see above | Deny-by-default |

### Introduced during this release, then fixed

Recorded because how they got in matters more than the diffs.

| # | Defect | Effect | Why it shipped |
|:--|:---|:---|:---|
| 8 | Isolation implemented with `docker network create --internal` | **Splunk unreachable on `localhost:8000`.** An internal network blocks published ports in *both* directions, not just egress | The deploy's isolation check tested egress only. It passed while the UI was dead — one-sided verification. Replaced with a bridge running `enable_ip_masquerade=false`, and the deploy now checks ingress too |
| 9 | `--purge` lived only on the deploy script | No way to wipe indexes without also redeploying | The flag was added to the script that needed it without asking what "purge" alone should mean. `--purge-only` now wipes and exits |
| 10 | CI step written as `command -v x \|\| a && b` | Shell precedence makes that `(command -v x \|\| a) && b`, so `b` ran unconditionally | Assumed C-style precedence. Rewritten as an explicit `if` block |

Defects 8 and 9 were reported by the user against a running deployment. Both
were real, and both were mine.

---
