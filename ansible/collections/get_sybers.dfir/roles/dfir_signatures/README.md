# dfir_signatures

Run the **YARA**, **Suricata** and **Hayabusa** detection lanes over the evidence and
land their native events as JSON Lines for the ADX or SOF-ELK pipeline. The role is
structure only — it asserts inputs, runs a preflight (docker, the `data_store`
anchor, the module), then invokes the `get_sybers_dfir.signatures` Python processor
as a **single action**. One `<lane>/` folder of detections under the output base.

## Lanes
| Lane | Input | Output |
|---|---|---|
| `yara` | files, mounted disk images (FUSE), process memory (Volatility `vadyarascan`) | `yara/{matches,disk,memory}.jsonl` |
| `suricata` | PCAPs | `suricata/<name>.eve.jsonl` (alert + context event types) |
| `hayabusa` | Windows Event Logs (`.evtx`), loose or from disk images | `hayabusa/timeline.jsonl` |

Disk-image mounting needs `/dev/fuse` (an LXC device-cgroup restriction blocks it by
default); a lane that can't mount notes it and moves on — the YARA lane never
extracts files out of images.

## Role variables
| Variable | Default | Description |
|---|---|---|
| `dfir_signatures_pipeline` | `adx` | `adx` or `sofelk` — selects the output destination (the **playbook** decides this). |
| `dfir_signatures_adx_out_dir` | `<repo>/data_store/processed/signatures` | ADX-path output base. |
| `dfir_signatures_sofelk_out_dir` | `<repo>/data_store/processed/sofelk/signatures` | SOF-ELK-path output base. |
| `dfir_signatures_lanes` | `[]` (all) | Lanes to run — any of `yara`, `suricata`, `hayabusa`. |
| `dfir_signatures_fetch` | `false` | Provision rules/binaries when online. |
| `dfir_signatures_python_path` | `<repo>/python` | PYTHONPATH to `get_sybers_dfir` (in-repo runs). |
| `dfir_signatures_force` | `false` | Regenerate lane outputs that already exist. |

## Rules / binaries
Operator-supplied (or `--fetch` while online): YARA rules under
`data_store/dependencies/yara-rules`, ET Open under `.../suricata-rules`, the Hayabusa
binary under `.../hayabusa`. A lane with no rules/inputs notes it and produces nothing
(not a failure).

## Idempotence
A lane whose output already exists is skipped — the skip lives in the Python
processor, never in a task `when:`. The verify gate tolerates a zero-detection run
(no rules/inputs) but surfaces real Suricata failures.

## Example
```bash
ansible-playbook playbooks/dfir-process-signatures.yml -e dfir_signatures_pipeline=adx
# one lane:
ansible-playbook playbooks/dfir-process-signatures.yml -e '{"dfir_signatures_lanes":["yara"]}'
```

## Testing
Python unit tests cover the pure parsing logic (YARA text → match JSONL incl.
strings/offsets, `vadyarascan` → match JSONL, Suricata EVE filtering/annotation,
Hayabusa tagging, binary discovery). The **Molecule** scenario runs the **yara lane
live** against a fixture rule + matching sample (needs the `blacktop/yara` image):
converge → idempotence → verify the recorded match.
