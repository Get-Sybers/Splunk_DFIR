# dfir_evtx

Parse **Windows Event Logs (`.evtx`)** with **EvtxECmd** into normalised JSON for
the ADX or SOF-ELK pipeline. The role is structure only — it asserts inputs, runs a
preflight (docker, input dir, **the operator-supplied `EvtxECmd.dll`**), then invokes
the `get_sybers_dfir.evtx` Python processor as a **single action** (one dotnet
container run per log happens inside Python). One `<base>_EvtxECmd_Output.json` per
log (+ an `.xml` sidecar, not ingested), grouped by the source sub-dir (host).

## Role variables
| Variable | Default | Description |
|---|---|---|
| `dfir_evtx_pipeline` | `adx` | `adx` or `sofelk` — selects the output destination (the **playbook** decides this). |
| `dfir_evtx_evtx_dir` | `<repo>/data_store/raw/other_raw_data/WinEvt` | `.evtx` tree to parse (recursed). |
| `dfir_evtx_adx_out_dir` | `<repo>/data_store/processed/windows_logs` | ADX-path output. |
| `dfir_evtx_sofelk_out_dir` | `<repo>/data_store/processed/sofelk/windows_logs` | SOF-ELK-path output. |
| `dfir_evtx_evtxecmd_dir` | `<repo>/data_store/dependencies/evtxecmd` | Operator-supplied EvtxECmd release (must hold `EvtxECmd.dll`; include `Maps/`). |
| `dfir_evtx_dotnet_image` | `mcr.microsoft.com/dotnet/sdk:8.0` | dotnet runtime image for EvtxECmd. |
| `dfir_evtx_python_path` | `<repo>/python` | PYTHONPATH to `get_sybers_dfir` (in-repo runs). |
| `dfir_evtx_force` | `false` | Reparse logs that already have output. |

## Operator dependency
EvtxECmd is **not vendored** — download the .NET release (incl. `Maps/`) from
<https://github.com/EricZimmerman/evtx/releases> and extract it under
`dfir_evtx_evtxecmd_dir`. Without `Maps/`, `MapDescription`/`signature` is empty.

## Idempotence
A log whose `.json` output already exists (non-empty) is skipped — the skip lives in
the Python processor, never in a task `when:`. EvtxECmd exits 0 on an empty/corrupt
log; a zero-record output is removed and counted `failed`, not treated as done.

## Example
```bash
ansible-playbook playbooks/dfir-process-evtx.yml -e dfir_evtx_pipeline=adx
```

## Testing
Python unit tests cover the pure logic (DLL location, host grouping, output naming,
discovery, missing-DLL handling). The **Molecule** scenario needs operator inputs
(a sample `.evtx` and an EvtxECmd release — neither is redistributable), supplied
as extra-vars:
```bash
molecule test -- -e molecule_sample_evtx=/path/Security.evtx \
                 -e molecule_evtxecmd_dir=/path/to/evtxecmd
```
