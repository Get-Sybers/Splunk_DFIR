# dfir_ingest_adx

Load **`data_store/processed`** into the **ADX (Kusto) emulator**. The role is
structure only — it asserts inputs, runs a preflight (docker, the processed dir, the
module, **and that the emulator engine is reachable**), then invokes the
`get_sybers_dfir.ingest` Python loader as a **single action**. This is the ADX
ingest path; the SOF-ELK ingest is a separate role.

Each source's files are shaped with their constant columns (see the loader), copied
INTO the emulator container (it reads from its own filesystem), and batch-ingested;
Plaso l2t fans one json_line file out into per-parser `L2t<Parser>` tables.

## Role variables
| Variable | Default | Description |
|---|---|---|
| `dfir_ingest_adx_processed_dir` | `<repo>/data_store/processed` | Tree to load. |
| `dfir_ingest_adx_only` | `""` (all) | Load one source: `l2t`, `zeek`, `evtx`, `volatility`, `velociraptor`. |
| `dfir_ingest_adx_kusto_host` | `127.0.0.1` | Emulator host. |
| `dfir_ingest_adx_kusto_port` | `8080` | Emulator port. |
| `dfir_ingest_adx_kusto_container` | `kusto-emulator` | Emulator container (files are docker-cp'd into it). |
| `dfir_ingest_adx_python_path` | `<repo>/python` | PYTHONPATH to `get_sybers_dfir` (in-repo runs). |
| `dfir_ingest_adx_force` | `false` | Re-ingest files already in the ledger (additive — duplicates rows). |
| `dfir_ingest_adx_dry_run` | `false` | List what would be loaded; contact nothing. |

## Idempotence
The shell ingest was additive (no fishbucket) — re-running duplicated rows. This
loader keeps an in-DB **ledger** (`host._DfirIngestLedger`) of the sha1 of every file
loaded, and skips files already recorded unless `dfir_ingest_adx_force` is set. The
ledger lives in the (ephemeral) database, so a redeploy wipes the ledger and the data
together — they never drift. A first run loads new files (`changed=true`); an
immediate re-run loads nothing (`changed=false`).

## Prerequisite
A deployed, schema-loaded emulator — `dxdfir deploy` (the `dfir_deploy_adx`
role). The preflight fails clearly if the engine is unreachable.

## Example
```bash
dxdfir ingest                       # = this role, all sources
dxdfir ingest --only zeek
ansible-playbook playbooks/dfir-ingest-adx.yml -e dfir_ingest_adx_only=volatility
```

## Testing
Python unit tests cover the pure logic (Kusto failure detection, record shaping,
staged-name safety, l2t split). The **Molecule** scenario needs a running emulator:
it stages a probe artefact, converges (loads it), converges again asserting zero
changes (ledger idempotence), and verifies the probe row is queryable.
