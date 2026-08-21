# dfir_evtx

Parse **Windows Event Logs (`.evtx`)** with **EvtxECmd** into normalised JSON for
the ADX or SOF-ELK pipeline. The role is structure only — it asserts inputs, runs a
preflight (docker, input dir, **the EvtxECmd image or operator-supplied release**),
then invokes the `get_sybers_dfir.evtx` Python processor as a **single action** (one
container run per log happens inside Python). One `<base>_EvtxECmd_Output.json` per
log (+ an `.xml` sidecar, not ingested), grouped by the source sub-dir (host).

## Supplying EvtxECmd — two modes
Selected by `dfir_evtx_use_bundled_image` (default **bundled**):

- **Bundled (default).** The `dfir/evtxecmd` image (built from
  [`docker/evtxecmd`](/docker/evtxecmd)) bakes `EvtxECmd.dll` **and `Maps/`** onto a
  .NET runtime. Build it once and forget it — no files to place by hand:
  ```bash
  docker build -t dfir/evtxecmd:latest docker/evtxecmd
  ```
- **Operator-supplied.** Set `dfir_evtx_use_bundled_image=false` and drop the .NET
  EvtxECmd release (incl. `Maps/`) under `dfir_evtx_evtxecmd_dir`. Download it from
  <https://github.com/EricZimmerman/evtx/releases>. It is mounted read-only into a
  stock .NET runtime image (`dfir_evtx_dotnet_image`, which **must be .NET 9.x** —
  EvtxECmd's current build targets net9.0). Without `Maps/`, `MapDescription` /
  `signature` comes out empty.

Both modes produce byte-identical output; the bundled image is just the release run
without a mount. EvtxECmd is **not vendored** either way — the Dockerfile *fetches*
the MIT-licensed release at build time; the repo ships the recipe, not the binary.

## Role variables
| Variable | Default | Description |
|---|---|---|
| `dfir_evtx_pipeline` | `adx` | `adx` or `sofelk` — selects the output destination (the **playbook** decides this). |
| `dfir_evtx_evtx_dir` | `<repo>/data_store/raw/other_raw_data/WinEvt` | `.evtx` tree to parse (recursed). |
| `dfir_evtx_adx_out_dir` | `<repo>/data_store/processed/windows_logs` | ADX-path output. |
| `dfir_evtx_sofelk_out_dir` | `<repo>/data_store/processed/sofelk/windows_logs` | SOF-ELK-path output. |
| `dfir_evtx_use_bundled_image` | `true` | Use the bundled `dfir/evtxecmd` image; `false` = mount an operator release. |
| `dfir_evtx_bundled_image` | `dfir/evtxecmd:latest` | Bundled image tag (built from `docker/evtxecmd`). |
| `dfir_evtx_evtxecmd_dir` | `<repo>/data_store/dependencies/evtxecmd` | Operator-supplied EvtxECmd release (must hold `EvtxECmd.dll`; include `Maps/`). |
| `dfir_evtx_dotnet_image` | `mcr.microsoft.com/dotnet/runtime:9.0` | Operator mode: the .NET **9.x** runtime image the release mounts into. |
| `dfir_evtx_image` | (computed) | The image actually run; override to pin a digest. |
| `dfir_evtx_python_path` | `<repo>/python` | PYTHONPATH to `get_sybers_dfir` (in-repo runs). |
| `dfir_evtx_force` | `false` | Reparse logs that already have output. |

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
