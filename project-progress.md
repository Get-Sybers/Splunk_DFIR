# 🗂️ Splunk DFIR Pipeline Task Board

Tracks tasks for the DFIR automation project—from forensic data processing to
Splunk deployment.

**Release status: 🧪 `v0.1.0-alpha` — experimental.**

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
| [Log2timeline](https://github.com/log2timeline/plaso)         | ✅            | csv             | ✅     |    ✅   |     ❌     |
| [Zeek](https://zeek.org/)                                     | ✅            | tsv             | ✅     |    ✅   |     ❌     |
| [Kape](https://github.com/EricZimmerman/KapeFiles)            | ✅            | json, csv       | ✅     |    ⚠️   |     ❌     |
| [Velociraptor](https://github.com/Velocidex/velociraptor)     | ⚠️            | json            | ⚠️     |    ❌   |     ❌     |
| [Rekall](https://github.com/google/rekall)                    | ⚠️            | json            | ⚠️     |    ❌   |     ❌     |
| CSVs                                                          |               | csv             | ✅     |         |     ❌     |
| JSON                                                          |               | json            | ✅     |         |     ❌     |
| [WinEvent Logs](https://www.sans.org/white-papers/32949/)     |               | evt, evtx       | ❌     |         |     ❌     |
| Linux Logs                                                    |               |                 |        |         |            |
| [Sysmon](https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon) |    |                 |        |         |            |
| [Syslog](https://syslog-ng.github.io)                         |               |                 |        |         |            |
| [Zimmerman](https://github.com/EricZimmerman)                 |               |                 |        |         |            |
| [Hayabusa](https://github.com/Yamato-Security/hayabusa)       |               |                 |        |         |            |
| [Chainsaw](https://github.com/countercept/chainsaw)           |               |                 |        |         |            |

**The Data Model column is empty across the board.** MITRE CAR mapping is the
project's headline feature and none of it is wired up yet. That single gap is
the main reason this is alpha rather than beta.

---

# 🚨 Known Limitations

Things that are broken or unsafe right now. These block a beta.

### 🔻 `scripts/v2/` is broken — use `scripts/`

`scripts/v2/` is inconsistent with itself. The three genuinely refactored
scripts resolve the repo root as `$SCRIPT_DIR/../..`, which is correct from
`scripts/v2/`. The other four still use `$SCRIPT_DIR/..` — the depth that is
correct in `scripts/`, but one level short in `scripts/v2/` — so they resolve
the repo root to `<repo>/scripts`:

| Script | Repo root resolves to | Correct? |
|:---|:---|:---:|
| `process-log2timeline-Dynamic.sh` | `<repo>` | ✅ |
| `process-rekall-json.sh` | `<repo>` | ✅ |
| `process-zeek-ALL.sh` | `<repo>` | ✅ |
| `deploy-splunk.sh` | `<repo>/scripts` | ❌ |
| `setup-environment.sh` | `<repo>/scripts` | ❌ |
| `purge-splunk-container.sh` | `<repo>/scripts` | ❌ |
| `config-splunk-inputs.sh` | `<repo>/scripts` | ❌ |

`scripts/` (v1) resolves correctly for all seven and carries the same VMware
support, so nothing is lost by using it.

**`scripts/v2/` is not part of this release.** It stays in-tree as a
development sketch. Fix: change `$SCRIPT_DIR/..` to `$SCRIPT_DIR/../..` in the
four broken scripts, then re-test before promoting.

### 🔻 The Ansible layer is mostly inert

`ansible/` looks like a substantial Ansible codebase. It isn't. Ansible runs
*inside* the Splunk container via `SPLUNK_ANSIBLE_PRE_TASKS`; there is no
inventory, no `ansible.cfg`, no roles, and `ansible-playbook` is never invoked
on the host.

| Path | Files | Reality |
|:---|:---:|:---|
| `ansible/playbooks/` | 5 | Only dir mounted into the container — and only 3 of 5 are wired in |
| `ansible/tasks/` | 79 | Vendored splunk-ansible, **never executed**, nothing references it |
| `ansible/default_playbooks/` | 15 | Vendored splunk-ansible, **never executed** |
| `ansible/scripts/` | 2 | Both **0 bytes** — placeholders |

Original Ansible work in this project is **two playbooks**:
`Include-Custom-Apps.yml` and `Include-local-conf.yml`. `copy_installed_apps.yml`
and `disable_popups.yml` are present but unwired — the latter is superseded by
the `SPLUNK_DISABLE_POPUPS=True` env var.

Full detail in [docs/Ansible.md](/docs/Ansible.md). This matters for scoping
"Ansible it all" — see [Ansible-Roadmap.md](/docs/Ansible-Roadmap.md).

### 🔻 Other blockers

- **No automated tests anywhere.** Highest-value next step.
- **`chmod -R 777` on data directories.** Processing scripts widen permissions
  on `data_store/` to work around Docker UID mismatches. Don't run on a shared
  host.
- **`Splunk_TA_kape` is a stub** — contains only `transforms.conf`. No
  `app.conf`, no `props.conf`. It is not a functioning app.
- **Raw EVTX won't ingest.** Splunk sees the files but won't index them.
  Suspected to relate to how Windows update logs register changes to evtx files.
  Unresolved.
- **Two bundled Splunk apps have no licence grant.** `Splunk_TA_zeek` and
  `sankey_diagram_app` declare no licence in their manifests. Redistribution
  rights unconfirmed — see [THIRD_PARTY_NOTICES.md](/THIRD_PARTY_NOTICES.md).
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

### 🔹 **"Ansible it all"** — *beta target*
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

### 🔹 **Testing** — *new, and overdue*
- Add syntax/lint gating (`bash -n`, `shellcheck`, `Invoke-ScriptAnalyzer`).
- Add a smoke test that runs the pipeline against a small public sample image.
- Wire the above into CI so "✅" on this board means something checkable.

### 🔹 **KAPE & Raw EVTX Processing**
- Develop ingestion pipeline for **KAPE output** (targeting forensic triage artifacts).
  - looking at probably making a container that can handle Windows API calls
- Implement raw **EVTX file parsing** and ensure event logs are properly structured for Splunk ingestion.
  - currently splunk doesn't want to ingest the logs. it can see them but won't ingest them. I think it's possibly something to do with the Windows update log not registering a new change to evtx files.
- Complete `Splunk_TA_kape` — it is currently a `transforms.conf` with no app around it.

### 🔹 **Splunk Apps for Data Types**
- Ensure `_time` is correctly extracted from **artifact creation timestamps**.
- Normalize timestamps across all data sources for consistent correlation.

### 🔹 **Environment & Dependencies**
- Create a guide for **setting up the development environment**.

### 🔹 **Licensing follow-ups**
- Confirm redistribution rights for `Splunk_TA_zeek` and `sankey_diagram_app`,
  or remove them and fetch from Splunkbase at install time.
- Restore the missing `visualization.js.LICENSE.txt` in `sankey_diagram_app`.
- Mark the 17 modified `ansible/tasks/` files in-file per Apache-2.0 §4(b).
- **Decide whether to delete `ansible/tasks/` and `ansible/default_playbooks/`.**
  They are never executed, and removing them would drop the project's largest
  third-party obligation at zero functional cost. Deliberately deferred out of
  the alpha — deleting 94 files while also changing the release's story is two
  changes at once.
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
- Resolve the `scripts/` vs `scripts/v2/` split — see [Known Limitations](#-known-limitations).

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

### ✅ **Release hygiene** *(v0.1.0-alpha)*
- Audited every vendored dependency and settled the project licence — Apache-2.0.
- Added `LICENSE`, `NOTICE`, `THIRD_PARTY_NOTICES.md`, `CHANGELOG.md`.
- Corrected Splunk app versions from `1.0.0` to `0.1.0` — they were claiming
  stable while the project was pre-alpha.
- Documented how Ansible actually works here — [docs/Ansible.md](/docs/Ansible.md).

✅ **Closed an evidence-leak hole in `data_store/.gitignore`.**
  The old file was an extension blocklist, and it had already failed: VMware
  exports (`.vmdk`, `-flat.vmdk`, `.vmx`, `.ovf`, `.ova`, `.vmsd`, `.vmxf`) were
  fully committable, because VM support was added to the pipeline without
  updating the list — and `data_store/raw/VM_files/` is where the docs tell you
  to put them. Replaced with deny-by-default, which also covers extensionless
  files and any future format. Verified all 23 tracked skeleton files survive.

---
