# dfir_detect_adx

Run the **detection orchestrator** over the pipeline's processed data. The role is
structure only — it asserts inputs, runs a preflight (the module imports, **and
that the emulator engine is reachable**), then invokes the `get_sybers_dfir.detect`
runner as a **single action**.

The runner is DetectRaptor's *StartHunts* model on the Kusto backend: a registry of
detections, each declaring the processed data it targets; a **survey** of what is
actually present (which ADX tables exist and are non-empty, which signature-lane
JSONL outputs are on disk); then execution of **only the applicable detections** —
KQL detections run engine-side (`.set-or-append`, no rows transit Python),
signature-lane detections stream their JSONL files. Every hit lands in
**`misc.Detections`**, tagged with the detection id, severity, ATT&CK techniques,
source and a per-sweep `RunId`.

## Role variables
| Variable | Default | Description |
|---|---|---|
| `dfir_detect_adx_processed_dir` | `<repo>/data_store/processed` | Tree holding the signature-lane JSONL outputs. |
| `dfir_detect_adx_only` | `""` (all) | Comma-separated registry detection id(s) to run. |
| `dfir_detect_adx_dry_run` | `false` | Report targeting decisions; execute nothing (read-only queries). |
| `dfir_detect_adx_limit` | `1000` | Max hits recorded per detection per sweep. |
| `dfir_detect_adx_jsonl_out` | `""` (none) | Also export the sweep's hits as JSON Lines here. |
| `dfir_detect_adx_kusto_host` | `127.0.0.1` | Emulator host. |
| `dfir_detect_adx_kusto_port` | `8080` | Emulator port. |
| `dfir_detect_adx_kusto_container` | `kusto-emulator` | Emulator container name (summaries only — pure HTTP, no docker). |
| `dfir_detect_adx_python_path` | `<repo>/python` | PYTHONPATH to `get_sybers_dfir` (in-repo runs). |

## Sweep semantics
Sweeps are **append-only**: each run gets a fresh, sortable `RunId` and never
mutates earlier results. The `DetectionsLatest()` / `DetectionSummary()` views
(`kusto/schema/50-detections.kql`) read the newest sweep, so re-running never
double-counts. A detection whose target data is absent or empty is **skipped**
and reported as such — not run, not failed. `changed` reflects whether the sweep
recorded any hits.

## Prerequisite
A deployed, schema-loaded emulator with processed data ingested — `dxdfir deploy`
then `dxdfir ingest`. The preflight fails clearly if the engine is unreachable.

## Example
```bash
dxdfir detect                                  # = this role, full sweep
dxdfir detect --dry-run                        # targeting report only
dxdfir detect --only vol-malfind-injection
ansible-playbook playbooks/dfir-detect-adx.yml -e dfir_detect_adx_only=sig-yara-match
```

## Testing
Python unit tests cover the pure logic (registry validation, applicability gating,
KQL envelope construction, JSONL matching/shaping, timestamp normalisation). The
**Molecule** scenario needs a running emulator: it stages a signature-lane fixture
with one promotable record, converges (`--only sig-hayabusa-high`), and verifies
the tagged hit is queryable in `misc.Detections`.
