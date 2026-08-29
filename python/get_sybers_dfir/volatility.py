"""Volatility 3 processor — memory images -> per-plugin JSON Lines.

Run a fixed set of
Volatility 3 plugins over each memory image with the custom ``jsonl_dfir`` renderer
(one flat JSON object per TreeGrid node — one process/connection/artefact per line),
writing ``<plugin>.jsonl`` per image. The ingest loader wraps each line as
``{Plugin, SourceFile, Record}`` into memory.VolatilityJson, where the plugin's
fields are reachable as ``Record.FieldName`` in KQL.

The renderer isn't built in, so it's imported before the CLI runs (when Volatility
discovers renderers) via a small ``python3 -c`` wrapper; the renderer file, custom
plugins dir, symbols dir, memory file and plugin are passed as argv (no path is
spliced into Python source). Container mode mounts them; a native run
(``vol_native``) puts them on PYTHONPATH / env instead.

⚠️ SYMBOLS. Windows plugins resolve the kernel against ISF symbol tables Volatility
fetches from the symbol servers on first use — that needs outbound network. On an
isolated host, pre-seed ``symbols_dir`` (VOLATILITY_SYMBOLS) or the Windows plugins
error; format-agnostic plugins (banners.Banners) work without symbols.

Idempotent: a plugin whose ``.jsonl`` output exists and whose first line parses as
JSON is skipped. Empty/failed plugin outputs are removed (not treated as done).
Emits a machine-readable summary as JSON on stdout for an honest ``changed_when``
(``processed > 0`` — processed counts plugin OUTPUTS, matching the shell).

    python -m get_sybers_dfir.volatility --memory-dir RAW/memory --out-dir PROCESSED/volatility \
        --symbols-dir DEPENDENCIES/volatility3-symbols \
        --renderer third_party/piiat-mem/jsonl_dfir_renderer.py \
        --plugins-dir third_party/piiat-mem/plugins
"""
from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys

from . import container

_IMAGE = "dfir/volatility:latest"

# The plugins run per image — kept to the ones the analysis backend uses (process
# tree, network, command lines, injected code). Order preserved from the shell.
DEFAULT_PLUGINS = [
    "banners.Banners",
    "windows.info",
    "windows.piiat.processes",        # -> CarProcess (psscan; full path, parent, DLLs)
    "windows.pslist",
    "windows.pstree",
    "windows.dlllist",                # -> CarModule
    "windows.modules",                # -> CarDriver
    "windows.netscan",                # -> CarFlow
    "windows.netstat",                # -> CarFlow
    "windows.sessions",               # -> CarUserSession
    "windows.filescan",               # -> CarFile
    "windows.svcscan",                # -> CarService
    "windows.thrdscan",               # -> CarThread
    "windows.piiat.registry",         # -> CarRegistry
    "windows.malfind",
]

_MEMORY_EXTS = (
    ".raw", ".mem", ".dmp", ".lime", ".vmem",
    ".bin", ".dump", ".vmsn", ".crash",
)

# Native runs import the renderer, then hand the CLI its argv (renderer
# discovered on import). Container runs use the image's BAKED wrapper instead
# (/opt/dfir/vol_wrapper.py — the only python entry the hardened image
# allow-lists), which does the same import-then-run with argv passed through.
_WRAPPER = (
    "import importlib.util, sys\n"
    "spec = importlib.util.spec_from_file_location('jsonl_dfir_renderer', sys.argv[1])\n"
    "mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)\n"
    "from volatility3.cli import CommandLine\n"
    "sys.argv = ['vol', '-q', '-p', sys.argv[2], '-s', sys.argv[3],\n"
    "            '-r', 'jsonl_dfir', '-f', sys.argv[4], sys.argv[5]]\n"
    "CommandLine().run()\n"
)


def is_memory_image(name: str) -> bool:
    """Match by common memory-dump extensions plus the M57 corpus '*dramimage'."""
    low = name.lower()
    return low.endswith(_MEMORY_EXTS) or low.endswith("dramimage")


def discover(memory_dir: str) -> list[str]:
    """Every memory image under memory_dir (recursed), sorted, absolute."""
    found = []
    for root, _dirs, files in os.walk(memory_dir):
        for name in files:
            if is_memory_image(name):
                found.append(os.path.join(root, name))
    return sorted(found)


def clean_name(rel: str) -> str:
    """Output-folder name from a path relative to the memory dir (dirs+space folded),
    so two corpora sharing a basename keep distinct output."""
    return rel.replace("/", "_").replace(" ", "_")


def _valid_jsonl(path: str) -> bool:
    """Non-empty and first line parses as JSON — the shell's done/valid guard."""
    try:
        if os.path.getsize(path) <= 0:
            return False
        with open(path, encoding="utf-8", errors="replace") as fh:
            first = fh.readline()
    except OSError:
        return False
    if not first.strip():
        return False
    try:
        json.loads(first)
        return True
    except json.JSONDecodeError:
        return False


def vol_argv(img, plugin, symbols_dir, renderer, plugins_dir, image,
             symbols_online=False):
    """The ``docker run`` argv for one plugin pass on the minimal hardened
    dfir/volatility image: the baked wrapper (python3 /opt/dfir/vol_wrapper.py)
    is the ENTRYPOINT, so only the renderer path + CLI args are passed; the
    plugin's JSONL goes to stdout. No caps, read-only rootfs, and no network
    unless ``symbols_online`` (ISF symbol fetch) is requested. Pure."""
    return container.run(
        image,
        ["/opt/jsonl_dfir_renderer.py",
         "-q", "-p", "/plugins", "-s", "/symbols", "-r", "jsonl_dfir",
         "-f", f"/mem/{os.path.basename(img)}", plugin],
        mounts=[f"{os.path.dirname(img)}:/mem:ro",
                f"{os.path.realpath(symbols_dir)}:/symbols",
                f"{os.path.realpath(renderer)}:/opt/jsonl_dfir_renderer.py:ro",
                f"{os.path.realpath(plugins_dir)}:/plugins:ro"],
        network=symbols_online,
    )


def _run_vol(img, plugin, out_path, symbols_dir, renderer, plugins_dir, image,
             native, symbols_online=False):
    """Run one plugin over one image, JSONL to out_path (stdout captured)."""
    if native:
        env = dict(os.environ, VOLATILITY3_SYMBOL_DIRECTORIES=symbols_dir)
        with open(out_path, "w") as out:
            subprocess.run(
                [native, "-c", _WRAPPER, renderer, plugins_dir, symbols_dir, img, plugin],
                stdout=out, stderr=subprocess.DEVNULL, env=env, check=False,
            )
        return
    with open(out_path, "w") as out:
        subprocess.run(
            vol_argv(img, plugin, symbols_dir, renderer, plugins_dir, image,
                     symbols_online),
            stdout=out, stderr=subprocess.DEVNULL, check=False,
        )


def process(memory_dir, out_dir, symbols_dir, renderer, plugins_dir,
            image=_IMAGE, plugins=None, native=None, force=False,
            symbols_online=False) -> dict:
    """Run the plugin set over every image under memory_dir. Idempotent per plugin.

    ``symbols_online`` allows the container network access for ISF symbol fetch
    (the ONE legitimate network need); default is fully offline — pre-seed
    ``symbols_dir`` or expect Windows plugins to produce nothing on first use.
    """
    memory_dir = os.path.realpath(memory_dir)
    out_dir = os.path.realpath(out_dir)
    os.makedirs(out_dir, exist_ok=True)
    os.makedirs(symbols_dir, exist_ok=True)
    try:
        # the container's uid-2000 volatility caches fetched symbols here
        os.chmod(symbols_dir, 0o777)
    except OSError:
        pass
    plugins = plugins or DEFAULT_PLUGINS
    images = discover(memory_dir)

    processed, skipped, failed, results = 0, 0, 0, []
    for img in images:
        rel = os.path.relpath(img, memory_dir)
        dest = os.path.join(out_dir, clean_name(rel))
        os.makedirs(dest, exist_ok=True)
        per_image = {"image": rel, "produced": [], "empty": []}
        for plugin in plugins:
            out_path = os.path.join(dest, f"{plugin}.jsonl")
            if not force and _valid_jsonl(out_path):
                skipped += 1
                continue
            _run_vol(img, plugin, out_path, symbols_dir, renderer, plugins_dir,
                     image, native, symbols_online)
            if _valid_jsonl(out_path):
                processed += 1
                per_image["produced"].append(plugin)
            else:
                if os.path.exists(out_path):
                    os.remove(out_path)
                failed += 1
                per_image["empty"].append(plugin)
        results.append(per_image)

    return {
        "tool": "volatility",
        "memory_dir": memory_dir,
        "out_dir": out_dir,
        "images": len(images),
        "plugins": len(plugins),
        "processed": processed,
        "skipped": skipped,
        "failed": failed,
        "results": results,
    }


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(
        prog="get_sybers_dfir.volatility",
        description="memory images -> Volatility 3 per-plugin JSON Lines",
    )
    ap.add_argument("--memory-dir", required=True, help="directory tree of memory images")
    ap.add_argument("--out-dir", required=True, help="output dir; one folder per image")
    ap.add_argument("--symbols-dir", required=True, help="Volatility symbol cache (VOLATILITY_SYMBOLS)")
    ap.add_argument("--renderer", required=True, help="path to jsonl_dfir_renderer.py")
    ap.add_argument("--plugins-dir", required=True, help="custom plugins dir (windows.piiat.processes, windows.piiat.registry)")
    ap.add_argument("--image", default=_IMAGE, help="Volatility 3 container image")
    ap.add_argument("--vol-native", default=None, help="native volatility executable (skip container)")
    ap.add_argument("--plugins", default=None, help="comma-separated plugin override (default: the CAR set)")
    ap.add_argument("--force", action="store_true", help="rerun plugins that already have valid output")
    ap.add_argument("--symbols-online", action="store_true",
                    help="allow the container network access for ISF symbol fetch — the "
                         "one legitimate network need; default is fully offline "
                         "(pre-seed --symbols-dir instead)")
    args = ap.parse_args(argv)

    plugins = [p.strip() for p in args.plugins.split(",") if p.strip()] if args.plugins else None
    summary = process(
        args.memory_dir, args.out_dir, args.symbols_dir, args.renderer, args.plugins_dir,
        image=args.image, plugins=plugins, native=args.vol_native, force=args.force,
        symbols_online=args.symbols_online,
    )
    json.dump(summary, sys.stdout)
    sys.stdout.write("\n")
    # Fail only when the run produced nothing AND nothing was already done: inputs
    # that can never produce output (e.g. a Volatility plugin unsupported by this
    # image) are retried on every run, and must not flip an otherwise-complete,
    # idempotent re-run (processed=0, everything else skipped) into a failure.
    return 1 if summary["failed"] and not summary["processed"] and not summary["skipped"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
