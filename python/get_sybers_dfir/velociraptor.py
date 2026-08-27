"""Velociraptor processor — lay out offline-collector ZIPs for ingestion.

Unpack each collection
ZIP and lay its per-artefact ``results/<Artefact>.json`` (JSON Lines) out flat under
one folder per collection, where the ingest loader (``get_sybers_dfir.ingest``)
expects it. The ingest-side wrap does the ``{Artefact, SourceFile, Record}``
shaping; here we only copy verbatim.

Layout: a Velociraptor offline collection stores query results as
``results/<Artefact>.json``. Those are copied; if a collection nests them
differently, every ``*.json`` in the archive is still picked up. Non-JSON (uploads,
metadata blobs) are left alone — uploads can be large and are not ingested.

Idempotent: a collection whose output folder already holds ``*.json`` is skipped.
Emits a machine-readable summary as JSON on stdout so the Ansible task can set an
honest ``changed_when`` (``processed > 0``).

Run standalone or via the ``dfir`` CLI:

    python -m get_sybers_dfir.velociraptor --raw-dir RAW/velociraptor --out-dir PROCESSED/velociraptor
"""
from __future__ import annotations

import argparse
import json
import os
import shutil
import sys
import zipfile


def discover(raw_dir: str) -> list[str]:
    """Every collection ZIP directly under raw_dir, sorted, absolute."""
    found = []
    for name in os.listdir(raw_dir) if os.path.isdir(raw_dir) else []:
        p = os.path.join(raw_dir, name)
        if os.path.isfile(p) and name.lower().endswith(".zip"):
            found.append(p)
    return sorted(found)


def _result_members(names: list[str]) -> list[str]:
    """The JSON members to lay out: results/-tree JSON if present, else every JSON.

    Mirrors the shell (`unzip 'results/*'`, fall back to a full extract, then copy
    every *.json found): prefer the documented results/ tree, but never miss a
    collection that stores its result JSON at the archive root.
    """
    jsons = [n for n in names if not n.endswith("/") and n.lower().endswith(".json")]
    under_results = [n for n in jsons if n.lower().startswith("results/")]
    return under_results if under_results else jsons


def _already_done(output_dir: str) -> bool:
    # Case-insensitive: _lay_out preserves the member's original filename case, so a
    # collection producing e.g. "Windows.System.JSON" must still count as done.
    return os.path.isdir(output_dir) and any(
        n.lower().endswith(".json") for n in os.listdir(output_dir)
    )


def _lay_out(zip_path: str, output_dir: str) -> list[str]:
    """Copy each result JSON out of the ZIP into output_dir as its basename.

    Artefact name is the result filename (Velociraptor names results by artefact).
    Two members sharing a basename keep distinct output via a numeric suffix. Members
    are streamed (result JSON can be large) rather than read fully into memory.
    """
    os.makedirs(output_dir, exist_ok=True)
    written: list[str] = []
    with zipfile.ZipFile(zip_path) as zf:
        for member in _result_members(zf.namelist()):
            base = os.path.basename(member)
            dest = os.path.join(output_dir, base)
            if os.path.basename(dest) in written:
                stem, ext = os.path.splitext(base)
                dest = os.path.join(output_dir, f"{stem}_{len(written)}{ext}")
            with zf.open(member) as src, open(dest, "wb") as out:
                shutil.copyfileobj(src, out)
            written.append(os.path.basename(dest))
    return written


def process(raw_dir: str, out_dir: str, force: bool = False) -> dict:
    """Lay out every collection ZIP under raw_dir into out_dir/<collection>/. Idempotent."""
    raw_dir = os.path.realpath(raw_dir)
    out_dir = os.path.realpath(out_dir)
    os.makedirs(out_dir, exist_ok=True)
    collections = discover(raw_dir)

    processed, skipped, failed, results = 0, 0, 0, []
    for zip_path in collections:
        name = os.path.splitext(os.path.basename(zip_path))[0]
        output_dir = os.path.join(out_dir, name)
        if not force and _already_done(output_dir):
            skipped += 1
            continue
        try:
            artefacts = _lay_out(zip_path, output_dir)
        except (zipfile.BadZipFile, OSError):
            failed += 1
            results.append({"collection": name, "error": "could not read ZIP"})
            continue
        if artefacts:
            processed += 1
            results.append({"collection": name, "artefacts": artefacts})
        else:
            failed += 1
            results.append({"collection": name, "error": "no JSON result files"})

    return {
        "tool": "velociraptor",
        "raw_dir": raw_dir,
        "out_dir": out_dir,
        "collections": len(collections),
        "processed": processed,
        "skipped": skipped,
        "failed": failed,
        "results": results,
    }


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(
        prog="get_sybers_dfir.velociraptor",
        description="Velociraptor offline-collector ZIPs -> per-artefact JSON",
    )
    ap.add_argument("--raw-dir", required=True, help="directory of <collection>.zip files")
    ap.add_argument("--out-dir", required=True, help="output dir; one folder per collection")
    ap.add_argument("--force", action="store_true", help="re-lay-out collections that already have output")
    args = ap.parse_args(argv)

    summary = process(args.raw_dir, args.out_dir, force=args.force)
    json.dump(summary, sys.stdout)
    sys.stdout.write("\n")
    return 1 if summary["failed"] and not summary["processed"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
