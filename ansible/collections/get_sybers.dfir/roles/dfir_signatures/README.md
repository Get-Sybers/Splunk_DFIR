# dfir_signatures

Run the **YARA**, **Suricata** and **Hayabusa** detection lanes over the evidence and
land their native events as JSON Lines for the ADX or SOF-ELK pipeline. The role is
structure only — it asserts inputs, runs a preflight (docker, the `data_store`
anchor, the module), then invokes the `get_sybers_dfir.signatures` Python processor
as a **single action**. One `<lane>/` folder of detections under the output base.

## Lanes
| Lane | Input | Output |
|---|---|---|
| `yara` | loose files under `raw/other_raw_data/`; disk images under `raw/disk_images/` (mounted read-only in place — needs `/dev/fuse` + `ewfmount`/`ntfs-3g` on the host, nothing extracted); memory images under `raw/memory/` (Volatility 3 `windows.vadyarascan`) | `yara/matches.jsonl`, `yara/disk.jsonl`, `yara/memory.jsonl` |
| `suricata` | PCAPs | `suricata/<name>.eve.jsonl` (alert + context event types) |
| `hayabusa` | loose Windows Event Logs (`.evtx`) under `raw/` (disk-image EVTX flows through the evtx lane's targeted extraction) | `hayabusa/timeline.jsonl` |

> **Mounting.** The YARA `disk` source needs `/dev/fuse` on the host (an LXC
> blocks it by default); without it the source records a note and produces
> nothing — it never extracts files out of an image. The `memory` source needs
> the Volatility 3 container image and pre-seeded symbols.

## Role variables
| Variable | Default | Description |
|---|---|---|
| `dfir_signatures_pipeline` | `adx` | `adx` or `sofelk` — selects the output destination (the **playbook** decides this). |
| `dfir_signatures_adx_out_dir` | `<repo>/data_store/processed/signatures` | ADX-path output base. |
| `dfir_signatures_sofelk_out_dir` | `<repo>/data_store/processed/sofelk/signatures` | SOF-ELK-path output base. |
| `dfir_signatures_lanes` | `[]` (all) | Lanes to run — any of `yara`, `suricata`, `hayabusa`. |
| `dfir_signatures_fetch` | `false` | Provision rules when online: the YARA lane fetches the pinned DetectRaptor ruleset into `yara-rules/detectraptor/` (sha256-verified, merged, idempotent) when it has no rules yet. The other lanes still record a note when their deps are missing — supply those rules/binaries yourself. |
| `dfir_signatures_python_path` | `<repo>/python` | PYTHONPATH to `get_sybers_dfir` (in-repo runs). |
| `dfir_signatures_force` | `false` | Regenerate lane outputs that already exist. |

## Rules / binaries
Operator-supplied: YARA rules under `data_store/dependencies/yara-rules`, ET Open
under `.../suricata-rules`, the Hayabusa binary under `.../hayabusa`.
`dfir_signatures_fetch` / `--fetch` provisions the DetectRaptor YARA ruleset when
the tree has no rules yet (see `docs/Signature-Rules.md` → *DetectRaptor
content*); Suricata rules and the Hayabusa binary are provisioned by the operator
(`suricata-update` / the pinned Hayabusa release). A lane with no rules/inputs
notes it and produces nothing (not a failure).

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
strings/offsets, `vadyarascan` → match JSONL, disk-mount/vadyarascan argv
construction and `mmls` offset parsing, Suricata EVE filtering/annotation,
Hayabusa tagging, binary discovery). The **Molecule** scenario runs the **yara lane
live** against a fixture rule + matching sample (needs the `blacktop/yara` image):
converge → idempotence → verify the recorded match.
