# Changelog — get_sybers.dfir collection

Collection-level changes only; the project-wide history lives in the repository
root [CHANGELOG.md](../../../CHANGELOG.md).

## 0.4.0

- New `dfir_images` role: builds the hardened dfir/* tool images from in-repo
  Dockerfiles (ansible-only execution, allow-listed run role, uid0 renamed and
  locked, no sudo/su, no package managers, non-root runtime) and verifies the
  contract per build, statically and in-container.
- Processor roles default to the dfir/* images; `dfir_volatility_symbols_online`
  gates the one legitimate network need.
- Process tasks pass runtime hardening through the shared
  `get_sybers_dfir.container` invocation layer.

## 0.3.1

- One pipeline-agnostic `tasks/process.yml` per processor role; the adx|sofelk
  decision is carried by the resolved `dfir_<role>_out_dir` default.
- Process tasks run as a guarded `block`; a `rescue` surfaces the processor's
  JSON summary and stderr as one diagnostic. Gates are check-mode-safe.
- Molecule scenarios repaired (local connection, roles path) and runnable via
  the containerised harness (`tests/run-molecule.sh`); idempotence enforced.
- New role vars: `dfir_signatures_{stage_dir,vss,yara_sources,suricata_tuning_file}`;
  `dfir_evtx_stage_dir` pinned to the canonical shared extraction stage.
- ansible-lint (production profile) adopted; collection metadata completed
  (repository/issues, requires_ansible >= 2.16.0).

## 0.2.0

- Initial collection: one role per evidence source (zeek, velociraptor, evtx,
  volatility, plaso, signatures), deploy/ingest/detect roles, adx and sofelk
  pipelines, argument specs and per-role molecule scenarios.
