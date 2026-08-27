# get_sybers.dfir

The DX_DFIR forensic processing pipeline as an Ansible Galaxy collection. The heavy
logic lives in the `get_sybers_dfir` Python package (`python/`); each Ansible **task
is one action** that invokes it, and the **playbook** holds every decision — which
roles run and the `--pipeline adx|sofelk` selection.

Conforms to the Get-Sybers Ansible standards (naming/structuring + one-action-per-task
+ robustness) — see `Get-Sybers/Ludus-Ansible` `docs/standards/ansible/`.

## Roles
One role per evidence source; each invokes its `get_sybers_dfir.<source>` processor
as a single action.

| Role | Source | Processor |
|---|---|---|
| `dfir_zeek` | PCAPs → Zeek JSON | `get_sybers_dfir.zeek` |
| `dfir_velociraptor` | Velociraptor collector ZIPs → per-artefact JSON | `get_sybers_dfir.velociraptor` |
| `dfir_volatility` | Memory images → Volatility 3 per-plugin JSONL | `get_sybers_dfir.volatility` |
| `dfir_evtx` | Windows Event Logs (`.evtx`) → EvtxECmd JSON | `get_sybers_dfir.evtx` |
| `dfir_plaso` | Disk images / VM exports → Plaso JSONL | `get_sybers_dfir.plaso` |
| `dfir_signatures` | YARA / Suricata / Hayabusa detections | `get_sybers_dfir.signatures` |

Deploy + load roles: **`dfir_deploy_adx`** (emulator + schema), **`dfir_ingest_adx`**
(processed → ADX, idempotent via an in-DB ledger), **`dfir_ingest_sofelk`** (deliver
into SOF-ELK's watch dir), **`dfir_deploy_sofelk`** (builds the from-source SOF-ELK
stack — `docker/sof-elk/`). `dxdfir deploy` / `dxdfir ingest` drive the ADX pair.

Analysis role: **`dfir_detect_adx`** — the detection orchestrator
(`get_sybers_dfir.detect`). It surveys which processed data is actually present
(ADX tables + signature-lane JSONL outputs), runs only the registered detections
whose target data is there, and lands every hit — uniformly tagged — in
`misc.Detections`. `dxdfir detect` drives it.

## Usage
The **`dxdfir` CLI** (Python package `get_sybers_dfir`) is the front-end — it drives
these roles for you:
```bash
dxdfir process zeek --pipeline adx      # = the dfir_zeek role, preflight → process → verify
dxdfir process signatures               # all lanes
```
Or run a playbook directly; each source has one under `playbooks/`, which selects
the role and passes the pipeline:
```bash
ansible-playbook playbooks/dfir-process-zeek.yml -e dfir_zeek_pipeline=adx
ansible-playbook playbooks/dfir-process-velociraptor.yml -e dfir_velociraptor_pipeline=adx
ansible-playbook playbooks/dfir-process-volatility.yml -e dfir_volatility_pipeline=adx
ansible-playbook playbooks/dfir-process-evtx.yml -e dfir_evtx_pipeline=adx
ansible-playbook playbooks/dfir-process-plaso.yml -e dfir_plaso_pipeline=adx
ansible-playbook playbooks/dfir-process-signatures.yml -e dfir_signatures_pipeline=adx
```

## Testing (molecule)

Every role ships a molecule scenario (`roles/<role>/molecule/default/`,
delegated driver — the role runs its own tool containers). Run them without
installing molecule on the host via the containerised harness:

```bash
./tests/run-molecule.sh                    # default set (see script header)
./tests/run-molecule.sh dfir_zeek          # one role
```

Scenarios that need operator-supplied fixtures (a sample `.evtx` + EvtxECmd
release, a disk image, a memory image) read them from `MOLECULE_SAMPLE_*` /
`MOLECULE_EVTXECMD_DIR` env vars and are skipped with a note when absent —
see the script header for the full list.

## Standards alignment

The collection tracks the common Ansible best-practice set; where a practice
does not fit a localhost forensic pipeline, the deviation is deliberate and
recorded here rather than half-implemented.

| Practice | Where it lives here |
|---|---|
| Structure, naming, docs | One role per evidence source; `main -> preflight -> process` task files; house task-name prefix `<role>-<stage> \| description`; per-role `README.md` + `meta/argument_specs.yml`; collection `CHANGELOG.md`; playbooks under `playbooks/`. |
| Variables, no hardcoding | Everything flows through `defaults/main.yml` with the `dfir_<role>_` prefix; inputs validated with `assert` at play start; the adx\|sofelk decision is a resolved variable (`dfir_<role>_out_dir`), not duplicated task files. |
| Idempotency | State lives in the Python processors (skip-if-done); `changed_when` reads each processor's JSON summary; exit codes are re-run-safe; molecule enforces `changed=0` on the second run. Check mode is supported: command tasks skip and their gates skip with them. |
| Roles for reusability | Single-responsibility roles invoked by thin playbooks; shared behaviour lives in the Python package, not copy-pasted tasks; versioned as a collection (`galaxy.yml`, pinned deps in `requirements.yml`). |
| Error handling & validation | Preflight asserts prerequisites before anything runs; the process/verify/gate unit runs in a `block` whose `rescue` surfaces the processor's JSON summary and stderr as one diagnostic before failing. |
| Dynamic inventory | **Deviation:** the pipeline is localhost-only by design (evidence never leaves the analysis host); there is no fleet to discover. |
| Testing in CI/CD | `ansible-lint` (production profile, config in `.ansible-lint`) + the repo harness run on every push/PR; molecule scenarios run the roles for real (`tests/run-molecule.sh`), idempotence included. |
| Cross-platform conditionals | **Deviation:** targets are containers on a Linux analysis host; the only branch point is the adx\|sofelk pipeline, handled by variable resolution rather than `when` ladders. |
| Vault / secrets | **No secrets exist in the collection by design** — the Kusto emulator is auth-less and localhost-bound. The repo harness scans for leaked secrets on every run; if a credentialled backend is ever added, its secrets go through Ansible Vault, never defaults. |
| Monitor, log, audit | Repo-root `ansible.cfg` appends every run to `logs/ansible.log` (gitignored) and enables `ansible.posix.profile_tasks` for per-task timing; every processor emits a machine-readable JSON summary that the roles gate on. |
