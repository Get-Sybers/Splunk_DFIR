# get_sybers_dfir

The processing logic of the DX_DFIR pipeline as an importable, unit-tested Python
package, plus the **`dfir`** command-line front-end (Typer) — the top layer of epic
#46. The heavy per-item work (container runs, JSON reshaping) lives here; the
`get_sybers.dfir` Ansible collection orchestrates it one action per task.

## Processors
Each source is a module runnable standalone or through its role:
```bash
python -m get_sybers_dfir.zeek        --pcap-dir RAW/pcaps --out-dir PROCESSED/zeek
python -m get_sybers_dfir.velociraptor --raw-dir RAW/velociraptor --out-dir PROCESSED/velociraptor
python -m get_sybers_dfir.evtx        --evtx-dir RAW/WinEvt --out-dir PROCESSED/windows_logs --evtxecmd-dir DEPS/evtxecmd
python -m get_sybers_dfir.volatility  --memory-dir RAW/memory --out-dir PROCESSED/volatility --symbols-dir DEPS/symbols --renderer … --plugins-dir …
python -m get_sybers_dfir.plaso       --input-dir RAW/disk_images --out-dir PROCESSED/log2timeline --module dev-scripts/plaso/l2t_json_dfir.py
python -m get_sybers_dfir.signatures  --output-dir PROCESSED/signatures --repo-root .
```
Every processor prints a machine-readable JSON summary (`processed`/`skipped`/
`failed`/…) so its role can set an honest `changed_when`.

## The `dfir` CLI
```bash
dfir process zeek --pipeline adx        # drive the dfir_zeek role (preflight → process → verify)
dfir process signatures -e dfir_signatures_lanes='["yara"]'
dfir ingest --only zeek                 # load processed output into the ADX emulator
dfir deploy                             # stand up + schema-load the emulator
dfir validate                           # run the check harness
dfir list                               # list processable sources
```
`process` drives the collection with `ansible-playbook` (the role's one action calls
the matching `python -m get_sybers_dfir.<source>` for the tight loop). `ingest` /
`deploy` / `validate` currently front the repo's shell scripts — they become roles
in later #46 slices. The repo is auto-detected (or pass `--repo-root` /
`$DFIR_REPO_ROOT`).

## Install
```bash
pip install ./python          # provides the `dfir` entry point + the package
```
In-repo runs need no install — set `PYTHONPATH=python` (the roles do this via
`dfir_<source>_python_path`).

## Test
```bash
cd python && PYTHONPATH=. python -m pytest        # 64 unit tests (pure logic; no docker)
```
