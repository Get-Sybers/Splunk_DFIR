# get_sybers.dfir

The DX_DFIR forensic processing pipeline as an Ansible Galaxy collection. The heavy
logic lives in the `get_sybers_dfir` Python package (`python/`); each Ansible **task
is one action** that invokes it, and the **playbook** holds every decision — which
roles run and the `--pipeline adx|sofelk` selection.

Conforms to the Get-Sybers Ansible standards (naming/structuring + one-action-per-task
+ robustness) — see `Get-Sybers/Ludus-Ansible` `docs/standards/ansible/`.

## Roles
One role per evidence source; each invokes its `get_sybers_dfir.<source>` processor
as a single action. Roles land per source as epic #46 retires the matching
`process-*.sh` script (`dfir_zeek` is the exemplar).

| Role | Source | Processor |
|---|---|---|
| `dfir_zeek` | PCAPs → Zeek JSON | `get_sybers_dfir.zeek` |
| `dfir_velociraptor` | Velociraptor collector ZIPs → per-artefact JSON | `get_sybers_dfir.velociraptor` |
| `dfir_volatility` | Memory images → Volatility 3 per-plugin JSONL | `get_sybers_dfir.volatility` |
| `dfir_evtx` | Windows Event Logs (`.evtx`) → EvtxECmd JSON | `get_sybers_dfir.evtx` |
| `dfir_plaso` | Disk images / VM exports → Plaso JSONL | `get_sybers_dfir.plaso` (following) |
| `dfir_signatures` | YARA / Suricata / Hayabusa detections | `get_sybers_dfir.signatures` |

Ingest and deploy roles (`dfir_ingest_*`, `dfir_deploy_*`) follow as later slices of #46.

## Usage
Each source has a playbook under `playbooks/`; the playbook selects the role and
passes the pipeline.
```bash
ansible-playbook playbooks/dfir-process-zeek.yml -e dfir_zeek_pipeline=adx
ansible-playbook playbooks/dfir-process-velociraptor.yml -e dfir_velociraptor_pipeline=adx
ansible-playbook playbooks/dfir-process-volatility.yml -e dfir_volatility_pipeline=adx
ansible-playbook playbooks/dfir-process-evtx.yml -e dfir_evtx_pipeline=adx
ansible-playbook playbooks/dfir-process-signatures.yml -e dfir_signatures_pipeline=adx
```
