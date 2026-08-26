# Changelog

All notable changes are documented here, following
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and
[Semantic Versioning](https://semver.org/spec/v2.0.0.html). While the major version
is `0`, anything may change without notice.

## [Unreleased]

### Added
- **Detection orchestration** (`get_sybers_dfir.detect` + `dfir_detect_adx` role +
  `dxdfir detect`), modelled on DetectRaptor's StartHunts runner: a registry where
  each detection declares the processed data it targets (an ADX `db.Table` or a
  signature-lane JSONL output), a runner that surveys what is actually present and
  executes only the applicable detections (KQL detections run engine-side via
  `.set-or-append`; JSONL detections stream their lane files), and a unified
  `misc.Detections` output — every hit tagged with detection id, severity, ATT&CK
  techniques, source and a per-sweep `RunId` (`kusto/schema/50-detections.kql`,
  with `DetectionsLatest()`/`DetectionSummary()` views over the newest sweep).
  Seeded with 11 detections spanning EvtxECmd, Plaso prefetch, Zeek, Volatility,
  Velociraptor and the three signature lanes.

## [0.2.0] - 2026-08-21

### Changed
- Rebuilt the pipeline as three layers: the **`dxdfir` CLI** → the
  **`get_sybers.dfir` Ansible collection** (one role per source, one action per task)
  → the **`get_sybers_dfir` Python package**. Ten per-source roles/processors, each
  targeting ADX or SOF-ELK via `--pipeline adx|sofelk`. The legacy `process-*.sh`
  scripts remain as the legacy layer.
- Ran the Kusto backend end-to-end against the real `kustainer-linux` engine; all
  nine MITRE CAR objects return live rows (`CarCoverage()` 9/9).
- Made ADX ingest idempotent via an in-DB ledger, and tolerant of a processed file
  vanishing mid-read (concurrent processing).
- Collapsed the `ingest-kusto.sh` sources into a descriptor table and consolidated
  container lifecycle into `scripts/lib/docker-lifecycle.sh`.

### Added
- `dxdfir` CLI (Typer): `process` / `ingest` / `deploy` / `validate`, a man page, and
  80+ unit tests.
- From-source SOF-ELK image (`docker/sof-elk/`) and a bundled `dfir/evtxecmd` image
  (`docker/evtxecmd/`, DLL + `Maps/` baked in).
- Memory lane (Volatility 3) → `memory.VolatilityJson`, feeding the memory CAR
  objects (process/module/driver/service/thread/user_session/file/registry).
- Velociraptor loader → `host.VelociraptorJson`, re-sourcing `CarRegistry()`.
- Linux log processing with Plaso (syslog / auditd / utmp) and cross-platform
  `CarUserSession()` / `CarService()` / `CarProcess()`.
- Kusto schema: five databases, typed tables + ingestion mappings, and the MITRE CAR
  model as KQL functions pinned against MITRE's `car_data_model.json`.

### Fixed
- First live-emulator run: bracket-quote reserved database names (`network`),
  `0L` → `long(0)`, broadened the `CarFile` `modify` classifier, confirmed `tolong()`
  hex-pid conversion, and a dozen first-cut defects (query-vs-mgmt endpoint routing,
  per-host EvtxECmd staging collisions, empty-response handling, Zeek sentinel
  coercion, `ppid` source, header/`ignoreFirstRecord` handling).

### Removed
- The entire Splunk stack — deploy scripts, the eight Splunk apps, the in-container
  Ansible, and the ESCU lookups. The Kusto emulator is the analysis backend now.
- The KAPE automation (PowerShell, `KapeJson`); Velociraptor offline collectors
  (EZ Tools) take its place.
- Renamed the project `Splunk_DFIR` → `DX_DFIR`.

## [0.2.0-beta] - 2026-08-04

First versioned release, on the (since-retired) Splunk backend.

### Added
- Licensing: `LICENSE` (Apache-2.0), `NOTICE`, and `THIRD_PARTY_NOTICES.md`.
- The MITRE CAR data model + field mapping (Splunk `MITRE_CAR_App`), generated from
  the vendored `car_data_model.json`.
- Windows Event Log ingestion (`process-evtx-EvtxECmd.sh` + `EvtxECmd_App`), and this
  `CHANGELOG.md`.

### Changed
- `deploy-splunk.sh` gained `--purge` / `--persist`; redeploy became the default;
  first-party app versions demoted `1.0.0` → `0.2.0`.

### Security
- Network-isolated the Splunk container and closed an evidence-leak hole in
  `data_store/.gitignore`.

### Fixed
- Ten defects found by auditing the pre-versioned line — Splunk UI reachability,
  `--purge` safety, the `host` inputs-field literal, and the repository-root
  resolution across seven scripts, among others.

The pre-beta line is frozen on the
[`deprecated`](https://github.com/Get-Sybers/DX_DFIR/tree/deprecated) branch.
