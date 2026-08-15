# dfir_velociraptor

Lay out **Velociraptor offline-collector ZIPs** into per-artefact JSON for the ADX
or SOF-ELK pipeline. The role is structure only — it asserts inputs, runs a
preflight, then invokes the `get_sybers_dfir.velociraptor` Python processor as a
**single action**. One folder of result `*.json` per collection; the ingest hook
does the `{Artefact, SourceFile, Record}` shaping.

Pure Python (`zipfile`) — no container, so the preflight has no docker check.

## Role variables
| Variable | Default | Description |
|---|---|---|
| `dfir_velociraptor_pipeline` | `adx` | `adx` or `sofelk` — selects the output destination (the **playbook** decides this). |
| `dfir_velociraptor_raw_dir` | `<repo>/data_store/raw/velociraptor` | Directory of `<collection>.zip` files. |
| `dfir_velociraptor_adx_out_dir` | `<repo>/data_store/processed/velociraptor` | ADX-path output. |
| `dfir_velociraptor_sofelk_out_dir` | `<repo>/data_store/processed/sofelk/velociraptor` | SOF-ELK-path output. |
| `dfir_velociraptor_python_path` | `<repo>/python` | PYTHONPATH to `get_sybers_dfir` (in-repo runs). |
| `dfir_velociraptor_force` | `false` | Re-lay-out collections that already have output. |

## Idempotence
A collection whose output folder already holds `*.json` is skipped — the skip lives
in the Python processor, never in a task `when:`. A first run that lays out new
collections is `changed=true`; a second immediate run is `changed=false`.

## Example
```bash
ansible-playbook playbooks/dfir-process-velociraptor.yml -e dfir_velociraptor_pipeline=adx
```

## Testing
`molecule test` — converges against a fixture collection ZIP, converges again
asserting zero changes (idempotence), and verifies the registry artefact JSON was
laid out. No external tool or image needed.
