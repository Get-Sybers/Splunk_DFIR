# dfir_zeek

Process PCAPs into **Zeek JSON logs** for the ADX or SOF-ELK pipeline. The role is
structure only — it asserts inputs, runs a preflight, then invokes the
`get_sybers_dfir.zeek` Python processor as a **single action** (one container run
per capture happens inside Python). One folder of `*.json` per capture.

## Role variables
| Variable | Default | Description |
|---|---|---|
| `dfir_zeek_pipeline` | `adx` | `adx` or `sofelk` — selects the output destination (the **playbook** decides this). |
| `dfir_zeek_pcap_dir` | `<repo>/data_store/raw/pcaps` | Capture tree to process (recursed). |
| `dfir_zeek_adx_out_dir` | `<repo>/data_store/processed/zeek` | ADX-path output. |
| `dfir_zeek_sofelk_out_dir` | `<repo>/data_store/processed/sofelk/zeek` | SOF-ELK-path output. |
| `dfir_zeek_image` | `zeek/zeek` | Zeek container image. |
| `dfir_zeek_python_path` | `<repo>/python` | PYTHONPATH to `get_sybers_dfir` (in-repo runs). |
| `dfir_zeek_force` | `false` | Reprocess captures that already have output. |

## Idempotence
A capture whose output folder already holds `*.json` is skipped — the skip lives in
the Python processor, never in a task `when:`. A first run that processes new
captures is `changed=true`; a second immediate run is `changed=false`.

## Example
```bash
ansible-playbook playbooks/dfir-process-zeek.yml -e dfir_zeek_pipeline=adx
```

## Testing
`molecule test` — converges against a fixture capture, converges again asserting
zero changes (idempotence), and verifies a `conn.json` was produced. Needs Docker
and the `zeek/zeek` image.
