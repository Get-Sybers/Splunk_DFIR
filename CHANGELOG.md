# Changelog

All notable changes are documented here, following
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and
[Semantic Versioning](https://semver.org/spec/v2.0.0.html). While the major version
is `0`, anything may change without notice.

## [Unreleased]

## [0.4.0] — 2026-08-27

### Added
- **Build-it-yourself hardened tool containers** (`docker/{yara,suricata,zeek,
  volatility,plaso,evtxecmd}`), Splunk-docker posture: ansible is the
  container's only execution path (pinned `ansible-playbook` ENTRYPOINT running
  the embedded allow-listed run role, `docker/runtime`); interpreters are
  pinned to baked wrappers; the uid-0 account is renamed `ansible` and locked;
  sudo/su and package managers removed; every setuid bit stripped; tools run as
  uid 2000. Hardening is applied by ansible inside every build
  (`docker/hardening/harden.yml`) and squashed.
- `dfir_images` role + `dfir-build-images.yml` playbook: builds every image and
  verifies the hardening contract statically and from inside the running
  container; molecule scenario proves a non-allow-listed argv is refused.
- Runtime breakout mitigations on every processor `docker run`
  (`get_sybers_dfir.container`): `--cap-drop ALL`,
  `--security-opt no-new-privileges`, `--network none`; Volatility ISF symbol
  fetch is an explicit opt-in (`--symbols-online` /
  `dfir_volatility_symbols_online`).
- Suricata per-pcap tuning template with the consolidated `SURICATA_VARS`
  registry; every stock suricata.yaml var auto-derived from each capture's own
  traffic and recorded for the operator.
- ansible-lint (production profile) gate; `requirements.yml` wired into
  setup-environment and enforced in CI; pipeline-agnostic `process.yml` per
  role with block/rescue diagnostics and check-mode support; molecule
  scenarios repaired and runnable via the containerised harness.

### Changed
- Plaso is built from pinned PyPI with the libyal stack compiled from source
  (GIFT stable lags the `--output_fallback_hostname` the pipeline requires).
- No third-party tool image is pulled at runtime; the proprietary Kusto
  emulator (localhost-gated) and the stock .NET runtime (operator-supplied
  EvtxECmd mode) are the only remaining pulls.
- `data_store/.gitignore` prunes traversal (anchored skeleton whitelist);
  `git status` 25s → 0.014s.

### Added
- The `dfir_deploy_adx` role now carries the retired shell deploy's remaining
  security properties: an isolated (masquerade-off, never `--internal`) docker
  network on by default (`dfir_deploy_adx_isolated`) with egress probed from
  inside the container after start, a read-back assertion that no port is bound
  to the wildcard address, and a preflight gate that refuses a non-local bind
  unless `dfir_deploy_adx_expose=true` is set as well (the Ansible equivalent
  of the shell's "type `expose`" prompt).
- The YARA lane's **disk** and **memory** sources are now in the Python processor
  (`get_sybers_dfir.signatures.yara`): disk images mounted read-only in place
  (ewfmount → ntfs-3g, FUSE; nothing extracted) → `disk.jsonl`, and process
  memory via Volatility 3 `windows.vadyarascan` (matches carry PID context) →
  `memory.jsonl`. `--yara-sources` selects sources; the mount/scan invocations
  are pure, unit-tested helpers.

### Removed
- The last data-pipeline shell scripts: `deploy-kusto.sh`,
  `apply-kusto-schema.sh`, `ingest-kusto.sh` and `scripts/lib/`
  (`docker-lifecycle.sh`, `kusto-api.sh`, `l2t-split.py`). The framework fully
  implements them — `dxdfir deploy` (the `dfir_deploy_adx` role +
  `get_sybers_dfir.deploy`) and `dxdfir ingest` (the `dfir_ingest_adx` role +
  `get_sybers_dfir.ingest`, whose `prepare.split_l2t` superseded `l2t-split.py`).
  The smoke test now deploys its throwaway emulator through `dxdfir deploy`,
  and the check harness asserts the localhost-bind, EULA-disclosure, isolation,
  ephemeral-default, readiness, endpoint-routing, Zeek-routing, l2t fan-out and
  staging-hygiene guarantees against the role and the Python modules instead of
  the deleted scripts. Not carried over: `KUSTO_REPLACE` (the role converges
  idempotently; remove the container for a fresh ephemeral instance) and
  `--purge`/`--purge-only` (ephemeral default — `docker rm -f kusto-emulator`
  is the purge).
- The retired per-source `process-*.sh` scripts (`process-zeek-ALL.sh`,
  `process-evtx-EvtxECmd.sh`, `process-volatility.sh`,
  `process-log2timeline-Dynamic.sh`, `process-velociraptor.sh`) and the dead
  `process-log2timeline-JSON_Line.sh` — their behaviour lives in the
  `get_sybers_dfir` processors (`dxdfir process <source>`). The deploy/apply/ingest
  scripts remain.
- The signature-lane shell scripts (`process-signatures.sh`,
  `scripts/signatures/{yara,suricata,hayabusa}.sh`, `scripts/signatures/lib/disk-image.sh`)
  — fully ported to `get_sybers_dfir.signatures` (the `dfir_signatures` role /
  `python -m get_sybers_dfir.signatures`). Not carried over: the shell lanes'
  online provisioning of the YARA-Forge starter, ET Open (`suricata-update`) and
  the Hayabusa binary — rules/binaries are operator-supplied (the Python
  `--fetch` provisions the pinned DetectRaptor YARA set).

## [0.3.1] - 2026-08-26

### Fixed
- `dxdfir` CLI worked only where `ansible-playbook` happened to be on `PATH`.
  `ansible-core` is now a declared dependency of the package and the CLI resolves the
  `ansible-playbook` installed alongside it, so `dxdfir process`/`ingest`/`deploy`/`detect`
  work on a clean install.
- `scripts/setup-environment.sh` now installs the `dxdfir` CLI (into a dedicated venv),
  not just Docker and the userland tools.
- `dxdfir list` now inventories the evidence staged under `data_store/raw` (per source,
  with file counts and whether it is staged) instead of just naming the source types.
- `-h` is accepted everywhere as an alias for `--help` (`dxdfir -h`, `dxdfir process -h`,
  …), each level showing its own options.

### Added
- Root `README.md` **Quick Start**: clone -> `setup-environment.sh` -> `dxdfir deploy`
  -> `process` / `ingest` / `detect`.


## [0.3.0] - 2026-08-26

### Added
- Hayabusa (Sigma detection) inside the evtx lane (`get_sybers_dfir.evtx --hayabusa`,
  `dfir_evtx_hayabusa`), scanning the same `.evtx` the lane collects — loose or
  disk-image-extracted.
- Disk-image EVTX extraction in the evtx lane (`--image-src`): WindowsEventLogs pulled
  from E01/raw/VMDK with log2timeline/plaso `image_export.py` (`get_sybers_dfir.imageexport`).
- Suricata tuning: `--home-net` / `--external-net` / `--suricata-set`, and
  `--auto-home-net` (HOME_NET derived per-pcap from the observed private subnets).
- DetectRaptor YARA provisioning (`get_sybers_dfir.signatures.detectraptor`): commit-pinned,
  sha256-verified fetch merged into the yara-rules ruleset.
- Pipeline smoke test (`tests/smoke-test.sh` + the `smoke` CI workflow): runs the real
  evtx -> EvtxECmd -> ingest pipeline over sha256-pinned Sysmon fixtures and asserts the
  CAR objects populate correctly.
- `docs/Signature-Rules.md`: adding your own YARA / Suricata rules (and tuning HOME_NET).
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

### Fixed
- `EvtxPayload()` parses EvtxECmd's JSON payload; it matched only the legacy XML shape
  before, silently emptying every Sysmon/Security-derived CAR field (command line, parent,
  service name/path, Sysmon network 5-tuple, driver/module/thread).
- `CarFlow` end_time preserves sub-second connection duration (was truncated to whole seconds).
- `ZeekSsl()` drops the always-null `Ja3` projection (base Zeek never emits it).

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
