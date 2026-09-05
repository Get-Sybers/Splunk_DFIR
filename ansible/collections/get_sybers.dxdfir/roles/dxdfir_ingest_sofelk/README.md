# dxdfir_ingest_sofelk

Deliver the **sofelk-pipeline output** into **SOF-ELK's watch directory**. SOF-ELK
ingests by watching filesystem dirs (its Logstash pipelines), so "ingest" here is
*delivery*: the role asserts inputs, runs a preflight (source dir, the module), then
invokes the `get_sybers_dxdfir.sofelk` helper as a **single action** to mirror
`processed/sofelk/<tool>/` into the SOF-ELK ingest location, preserving the per-tool
layout so SOF-ELK's per-type pipelines pick the files up.

Pure Python file delivery — no container, so the preflight has no docker check.

## Role variables
| Variable | Default | Description |
|---|---|---|
| `dxdfir_ingest_sofelk_src_dir` | `<repo>/data_store/processed/sofelk` | sofelk-pipeline output to deliver. |
| `dxdfir_ingest_sofelk_target_dir` | `<repo>/data_store/sofelk-delivered` | SOF-ELK ingest/watch dir — **point at the SOF-ELK host path or a mount**. |
| `dxdfir_ingest_sofelk_python_path` | `<repo>/python` | PYTHONPATH to `get_sybers_dxdfir` (in-repo runs). |
| `dxdfir_ingest_sofelk_force` | `false` | Re-deliver files already in the target's delivery ledger. |

## Idempotence
Re-delivering a file would make Logstash re-read and duplicate it, so a JSON ledger
in the target (`.dxdfir-delivered.json`) records the sha1 of every file delivered; a
file already recorded is skipped unless `dxdfir_ingest_sofelk_force` is set. A first
run delivers new files (`changed=true`); an immediate re-run delivers nothing
(`changed=false`).

## Prerequisite
Run the processors with `--pipeline sofelk` first (they write `processed/sofelk/…`).
Delivery into a live SOF-ELK requires `dxdfir_ingest_sofelk_target_dir` to point at a
directory SOF-ELK watches (a mount, or a path on the SOF-ELK host via a delegated
run). See #45.

## Example
```bash
ansible-playbook playbooks/dxdfir-ingest-sofelk.yml \
  -e dxdfir_ingest_sofelk_target_dir=/mnt/sofelk/logstash
```

## Testing
Python unit tests cover the delivery logic (mirror + ledger idempotence + force). The
**Molecule** scenario stages a sofelk source tree, converges (delivers), converges
again asserting zero changes (ledger idempotence), and verifies the per-tool layout
in the target.
