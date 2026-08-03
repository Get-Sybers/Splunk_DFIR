# Changelog

All notable changes to this project are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

While the major version is `0`, **anything may change without notice** — paths,
script names, sourcetypes, field names, and app layouts included.

## [Unreleased]

### To be resolved before `0.2.0-beta`

- MITRE CAR field mapping — the headline feature, currently unimplemented.
- Automated tests. Nothing in the repository is verified automatically.
- **"Ansible it all"** — drive the whole pipeline through Ansible rather than
  injecting three playbooks into the container at boot. Staged plan in
  [docs/Ansible-Roadmap.md](docs/Ansible-Roadmap.md). Note this requires
  publishing port 8089 first (see Known issues below).
- `scripts/v2/` path-resolution bug (see `0.1.0-alpha` notes below).
- Redistribution rights for the two bundled Splunk apps.
- Whether to delete the 94 never-executed vendored Ansible files, which would
  drop the project's largest third-party obligation at no functional cost.

## [0.1.0-alpha] - 2026-08-03

First tagged release. The project is roughly fifteen months old and had never
carried a version, a licence, or an accurate statement of what worked. This
release fixes that. **It does not change pipeline behaviour.**

### Added

- `LICENSE` — Apache-2.0. Chosen by auditing what the repository actually
  redistributes rather than by preference; see `THIRD_PARTY_NOTICES.md`.
- `NOTICE` — Apache-2.0 §4 attribution for splunk-ansible, Splunk Security
  Content, and MITRE CAR.
- `THIRD_PARTY_NOTICES.md` — full provenance for every vendored component and
  every tool the pipeline drives, separating obligations that bind the project
  from those that bind the operator. Three substantial vendored sources were
  identified: splunk-ansible (97 of the 101 files under `ansible/`), Splunk
  Security Content / ESCU lookups
  (77 files, ~3 MB, across the `DETECT` and `BASELINE` apps), and the MITRE CAR
  data model. All three are Apache-2.0, and none carried attribution before this
  release.
- `CHANGELOG.md` — this file.
- `docs/Ansible.md` — documents how Ansible actually works in this project.
  It runs *inside* the Splunk container via `SPLUNK_ANSIBLE_PRE_TASKS`; there is
  no inventory, no roles, and `ansible-playbook` is never run on the host. Of
  the 101 files under `ansible/`, only the 5 in `playbooks/` are mounted, only 3
  of those are wired in, and exactly 2 are original work. The 94 files in
  `tasks/` and `default_playbooks/` are never executed.
- `docs/Ansible-Roadmap.md` — staged plan for the "Ansible it all" beta target.
- `CONTRIBUTING.md` — the README invited PRs with no guidance behind it. Covers
  the evidence-safety rule, the attribution rule for vendored code, and what the
  task board's ✅/⚠️/❌ marks are supposed to mean.
- `SECURITY.md` — reporting process plus an explicit list of known weaknesses
  (`chmod -R 777`, no Splunk auth, unpinned `:latest` containers, unverified
  vendored apps) so they don't get reported as discoveries.
- Known Limitations section in `project-progress.md`.
- Explicit warnings in `README.md` covering KAPE's non-commercial restriction,
  Splunk's proprietary licence and auto-acceptance, and evidence-handling risk.

### Changed

- **Project status is now stated as alpha/experimental.** It was previously
  "In-Development", which understated how much of the headline feature is
  missing.
- **Splunk app versions demoted `1.0.0` → `0.1.0`** across the six first-party
  apps (`BASELINE`, `DETECT`, `Kape_App`, `Log2timeline_App`, `Rekall_App`,
  `Velociraptor_App`). They were declaring a stable release while the project
  had no release at all. Third-party app versions are left untouched, as they
  reflect upstream releases.
- `README.md` rewritten with a capability table distinguishing what works, what
  is partial, and what is not delivered.
- `project-progress.md` rewritten. Several items previously marked done are now
  marked partial, and the empty Data Model column is called out as the reason
  this is alpha rather than beta.
- Documentation corrected throughout — stale script names, wrong output paths,
  and broken cross-references.

### Security

- **Closed an evidence-leak hole in `data_store/.gitignore`.** It was an
  extension blocklist and had already failed in practice: VMware exports
  (`.vmdk`, `-flat.vmdk`, `.vmx`, `.ovf`, `.ova`, `.vmsd`, `.vmxf`) were fully
  committable, because VMware support was added to the pipeline without updating
  the list — and `data_store/raw/VM_files/` is the documented drop location.
  Replaced with deny-by-default plus a skeleton allowlist, which also covers
  extensionless files and any format added later. Verified that all 23 tracked
  skeleton files remain tracked and that the directory structure survives.

### Fixed

- `dev-scripts/structure-tree.sh` had an unclosed `$(` on line 7 and would not
  parse at all. Every shell script in the repository now passes `bash -n`. (The
  script's tree formatting is still rough; it is an unsupported dev helper.)
- Corrected a misleading mount message in `deploy-splunk.sh` — it announced
  `splunk/ansible → /data/ansible`, a directory that does not exist. The real
  mount is `ansible/playbooks → /data/ansible/playbooks`. Message only, no
  behaviour change.
- `docs/Dir-Structure.md` listed a `splunk/ansible/` tree that does not exist,
  and omitted `dev-scripts/`, `raw/VM_files/`, and `raw/memory/`.
- Author field typo `get-syebrs` → `get-sybers` in four `app.conf` files
  (`DETECT`, `Kape_App`, `Log2timeline_App`, `Rekall_App`).
- Empty `description` fields populated across first-party apps.
- Broken documentation links, including a case-mismatched `dir-structure.md`
  reference that fails on case-sensitive filesystems, and a link to a
  `Log2timeline_App.md` that does not exist.
- Documentation referenced `setup_environment.sh` and
  `process-log2timeline-ALL.sh`; the actual scripts are `setup-environment.sh`
  and `process-log2timeline-Dynamic.sh`.
- Documentation pointed raw PCAPs at `data_store/raw/pcap/`; the real directory
  is `data_store/raw/pcaps/`.
- Documentation claimed Plaso output lands in `processed/log2timeline/json/`; it
  lands in `csv/`.

### Known issues

- `scripts/v2/` is broken and excluded from this release. Four of its seven
  scripts still compute `REPO_ROOT_DIR` as `$SCRIPT_DIR/..` — correct in
  `scripts/`, one level short in `scripts/v2/` — and so resolve the repository
  root to `<repo>/scripts`. Use `scripts/`, which resolves correctly and
  carries the same feature set.
- **Splunk's management port 8089 is not published.** `deploy-splunk.sh` maps
  only 8000 and 8088, so the splunkd REST API is unreachable from the host. This
  does not affect the current pipeline, but it blocks any host-side Ansible that
  uses the `splunk_api` module — a prerequisite for the beta plan.
- Processing scripts `chmod -R 777` their working directories.
- `Splunk_TA_kape` is a stub containing only `transforms.conf`.
- Raw EVTX files are visible to Splunk but will not ingest.

[Unreleased]: https://github.com/Get-Sybers/Splunk_DFIR/compare/v0.1.0-alpha...HEAD
[0.1.0-alpha]: https://github.com/Get-Sybers/Splunk_DFIR/releases/tag/v0.1.0-alpha
