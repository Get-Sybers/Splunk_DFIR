# dfir_volatility

Process **memory images** with **Volatility 3** into per-plugin JSON Lines for the
Elastic-native or SOF-ELK pipeline. The role is structure only — it asserts inputs, runs a
preflight (docker reachable, memory dir present, the [PIIAT-Mem](https://github.com/Get-Sybers/PIIAT-Mem) tool runnable), then
invokes the `get_sybers_dfir.volatility` processor as a **single action**. One
`<plugin>.jsonl` per plugin per image.

## How it works
[PIIAT-Mem](../../../../../third_party/piiat-mem) is a **standalone** Volatility
tool; this lane is its *automation*. Per image under `dfir_volatility_memory_dir`,
the processor drives the tool through its CLI — it never imports its internals or
re-implements the runner:

```
python -m piiat_mem -f <image> -o <dest> --plugins <CAR set> \
    --symbols <symbols_dir> --image <image> --no-timeline [--symbols-online]
```

and reads the raw `<dest>/plugins/<plugin>.jsonl` the tool writes (`--no-timeline`
skips the tool's own timeline; the pipeline timelines downstream). The lane owns
only discovery, per-plugin idempotency (it asks for just the not-yet-done plugins;
an image with none due is skipped entirely), and the JSON summary Ansible gates on.
PIIAT-Mem owns the runner, the `jsonl_dfir` renderer, the custom plugins
(`windows.piiat.processes`, `windows.piiat.registry`) and the hardened container.

## Role variables
| Variable | Default | Description |
|---|---|---|
| `dfir_volatility_pipeline` | `elastic` | `elastic` or `sofelk` — selects the output destination (the **playbook** decides this). |
| `dfir_volatility_memory_dir` | `<repo>/data_store/raw/memory` | Memory-image tree to process (recursed). |
| `dfir_volatility_elastic_out_dir` | `<repo>/data_store/processed/volatility` | Elastic-path output. |
| `dfir_volatility_sofelk_out_dir` | `<repo>/data_store/processed/sofelk/volatility` | SOF-ELK-path output. |
| `dfir_volatility_symbols_dir` | `<repo>/data_store/dependencies/volatility3-symbols` | Volatility 3 kernel-symbol cache (passed as `--symbols-dir`). |
| `dfir_volatility_piiat_mem_dir` | `<repo>/third_party/piiat-mem` | PIIAT-Mem submodule — the standalone Volatility tool the lane drives via `python -m piiat_mem` (owns the runner, renderer and custom plugins). |
| `dfir_volatility_image` | `dfir/volatility:latest` | The hardened in-repo Volatility 3 image (`playbooks/dfir-build-images.yml`). |
| `dfir_volatility_symbols_online` | `false` | Allow container network access for ISF symbol fetch — the one legitimate network need; pre-seed the symbols dir instead. |
| `dfir_volatility_python_path` | `<repo>/python` | PYTHONPATH to `get_sybers_dfir` (in-repo runs). |
| `dfir_volatility_force` | `false` | Rerun plugins that already have valid output. |

## Symbols (network)
Windows plugins resolve the kernel against ISF symbol tables Volatility fetches from
the symbol servers on first use — that needs **outbound network**. On an isolated
host, pre-seed `dfir_volatility_symbols_dir`, or the Windows plugins error with
"symbol table requirement was not fulfilled". `banners.Banners` needs no symbols.

## Idempotence
A plugin whose `.jsonl` output exists and whose first line parses as JSON is
skipped — the skip lives in the Python processor, never in a task `when:`.
Per-plugin failures (e.g. symbols unavailable) are **normal** and non-fatal: the
verify gate is "some plugin produced output, or there were no images", not
`failed == 0`.

## Example
```bash
ansible-playbook playbooks/dfir-process-volatility.yml -e dfir_volatility_pipeline=elastic
```

## Testing
Python unit tests cover the pure logic (image discovery, name folding, JSONL
validity, no-images path, the CAR plugin set, and a conformance check that shells
`piiat-mem --list-plugins`). The **Molecule** scenario needs a memory image
(large/binary — not shipped) and, for the Windows plugins, symbols:
```bash
molecule test -- -e molecule_sample_memory=/path/dump.raw
```

## Validated (real run, built image)
On 2026-08-29 the lane was run end-to-end through a built `dfir/volatility:latest`
image against a real dump (Magnet 2020 CTF `memdump-001.mem`, 5 GB, 64-bit Windows).
All 15 CAR plugins loaded and ran through the container; the run exited 0. The
pool-scan plugins produced valid JSON Lines — **`windows.piiat.processes`** (65
processes, with full path / parent path / loaded DLLs), `windows.netscan` (69),
`windows.thrdscan` (988), plus `banners.Banners` and `windows.info`. The
active-list plugins (`pslist`, `pstree`, `dlllist`, …) and `windows.piiat.registry`
returned 0 rows **on that dump** — an image property, not a defect: the built-in
`windows.registry.hivelist` also finds 0 resident hives there, and the psscan-based
`windows.piiat.processes` is precisely what recovers the process list when the
active list does not resolve. A dump with resident hives is still wanted to show
`windows.piiat.registry` emitting rows before the tool is tagged/promoted.
