# get_sybers.dfir

The DX_DFIR forensic processing pipeline as an Ansible Galaxy collection. The heavy
logic lives in the `get_sybers_dfir` Python package (`python/`); each Ansible **task
is one action** that invokes it, and the **playbook** holds every decision — which
roles run and the `--pipeline adx|sofelk` selection.

Conforms to the Get-Sybers Ansible standards (naming/structuring + one-action-per-task
+ robustness) — see `Get-Sybers/Ludus-Ansible` `docs/standards/ansible/`.

## Roles
| Role | Source | Status |
|---|---|---|
| `dfir_zeek` | PCAPs → Zeek JSON | exemplar (this PR) |
| `dfir_plaso`, `dfir_volatility`, `dfir_evtx`, `dfir_signatures` | — | planned (#46) |
| `dfir_ingest_adx`, `dfir_ingest_sofelk`, `dfir_deploy_*` | — | planned (#46) |

## Usage
```bash
ansible-playbook playbooks/dfir-process-zeek.yml -e dfir_zeek_pipeline=adx
```
