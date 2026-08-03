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
- `scripts/v2/` path-resolution bug (see `0.1.0-alpha` notes below).
- Redistribution rights for the two bundled Splunk apps.

## [0.1.0-alpha] - 2026-08-03

First tagged release. The project is roughly fifteen months old and had never
carried a version, a licence, or an accurate statement of what worked. This
release fixes that. **It does not change pipeline behaviour.**

### Added

- `LICENSE` — Apache-2.0. Chosen by auditing what the repository actually
  redistributes rather than by preference; see `THIRD_PARTY_NOTICES.md`.
- `NOTICE` — Apache-2.0 §4 attribution for splunk-ansible and MITRE CAR.
- `THIRD_PARTY_NOTICES.md` — full provenance for every vendored component and
  every tool the pipeline drives, separating obligations that bind the project
  from those that bind the operator.
- `CHANGELOG.md` — this file.
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

### Fixed

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
  scripts were copied from `scripts/` without adjusting path depth and resolve
  the repository root to `<repo>/scripts`. Use `scripts/`, which resolves
  correctly and carries the same feature set.
- Processing scripts `chmod -R 777` their working directories.
- `Splunk_TA_kape` is a stub containing only `transforms.conf`.
- Raw EVTX files are visible to Splunk but will not ingest.

[Unreleased]: https://github.com/Get-Sybers/Splunk_DFIR/compare/v0.1.0-alpha...HEAD
[0.1.0-alpha]: https://github.com/Get-Sybers/Splunk_DFIR/releases/tag/v0.1.0-alpha
