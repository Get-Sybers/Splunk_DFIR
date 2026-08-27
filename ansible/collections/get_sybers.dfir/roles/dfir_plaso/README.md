# dfir_plaso

Process **forensic disk images** and **VMware VM exports** with **Plaso**
(log2timeline + psort) into enriched JSON Lines for the ADX or SOF-ELK pipeline. The
role is structure only — it asserts inputs, runs a preflight (docker, input dir, the
`l2t_json_dfir` output module), then invokes the `get_sybers_dfir.plaso` Python
processor as a **single action** (the two-step container work happens inside
Python). One `<host>.jsonl` per image (named by the resolved `image_hostname`), plus
the durable `.plaso` storage db and a per-image log.

## Role variables
| Variable | Default | Description |
|---|---|---|
| `dfir_plaso_pipeline` | `adx` | `adx` or `sofelk` — selects the output destination (the **playbook** decides this). |
| `dfir_plaso_input_dir` | `<repo>/data_store/raw/disk_images` | Disk-image tree (E01/raw/img/dd/vmdk/vhd/vhdx/aff), recursed. |
| `dfir_plaso_vm_dir` | `<repo>/data_store/raw/VM_files` | VMware VM export folders (one per VM); optional. |
| `dfir_plaso_adx_out_dir` | `<repo>/data_store/processed/log2timeline` | ADX-path output (`jsonl/`, `plaso/`, `logs/`). |
| `dfir_plaso_sofelk_out_dir` | `<repo>/data_store/processed/sofelk/log2timeline` | SOF-ELK-path output. |
| `dfir_plaso_module` | `<repo>/dev-scripts/plaso/l2t_json_dfir.py` | Custom psort output module. |
| `dfir_plaso_image` | `dfir/plaso:latest` | The hardened in-repo Plaso image (`playbooks/dfir-build-images.yml`). |
| `dfir_plaso_python_path` | `<repo>/python` | PYTHONPATH to `get_sybers_dfir` (in-repo runs). |
| `dfir_plaso_force` | `false` | Reprocess images that already have output. |

## Discovery
Content-first: each file is identified by magic bytes (EWF/EWF2, VMDK, VHD/VHDX,
QCOW2), with the extension as a fallback (raw/dd/img/aff carry no signature). Raw
VMDK extents and EWF continuation segments are never processed on their own. VM
exports pick the latest snapshot descriptor, else the single base descriptor; an
ambiguous/missing descriptor is a **warning** (skipped), not a failure.

## Idempotence
An image whose `.plaso` db AND recorded json_line output both exist is skipped — a
`.host` marker records the resolved output name, so a prior **failed** psort (db
present, no marker) is not mistaken for done. The skip lives in the Python
processor, never in a task `when:`. Per-image failures (a weird image yielding 0
events) are tolerated: the verify gate is "some timeline was produced, or there were
no sources".

## Example
```bash
ansible-playbook playbooks/dfir-process-plaso.yml -e dfir_plaso_pipeline=adx
```

## Testing
Python unit tests cover the pure logic (magic-byte format detection incl. the VHD
footer path, extension fallback, VM descriptor selection, discovery, the
`.plaso`+marker+jsonl idempotence guard, hostname sanitisation). The **Molecule**
scenario needs a small parseable image (large/binary — not shipped):
```bash
molecule test -- -e molecule_sample_image=/path/tiny.raw
```
