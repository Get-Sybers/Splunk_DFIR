"""EvtxECmd processor — Windows Event Logs (.evtx) -> normalised JSON.

Faithful port of the retired ``process-evtx-EvtxECmd.sh``: the analysis backend
cannot read binary ``.evtx``, so EvtxECmd (Eric Zimmerman, .NET, run via the dotnet
container) converts each log to ``<base>_EvtxECmd_Output.json`` (normalised records,
one JSON object per line -> host.EvtxEcmdJson) plus a best-effort ``.xml`` sidecar
(kept for manual review, not ingested).

Output is grouped by the sub-directory the ``.evtx`` came from, so per-host
collections stay separated; logs sitting directly under the input root go to
``unspecified_host``.

EvtxECmd is not vendored (we don't redistribute other people's builds) — the DLL is
operator-supplied under evtxecmd_dir; the processor locates it (root or nested).

Idempotent: a log whose ``.json`` output already exists (non-empty) is skipped.
EvtxECmd exits 0 on an empty/corrupt log, so a zero-record output is removed and
counted as failed (not treated as done). Emits a machine-readable summary as JSON on
stdout so the Ansible task can set an honest ``changed_when`` (``processed > 0``).

Run standalone or via the ``dfir`` CLI:

    python -m get_sybers_dfir.evtx --evtx-dir RAW/WinEvt --out-dir PROCESSED/windows_logs \
        --evtxecmd-dir DEPENDENCIES/evtxecmd
"""
from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys

_DOTNET_IMAGE = "mcr.microsoft.com/dotnet/sdk:8.0"


def discover(evtx_dir: str) -> list[str]:
    """Every .evtx under evtx_dir (recursed), sorted, absolute."""
    found = []
    for root, _dirs, files in os.walk(evtx_dir):
        for name in files:
            if name.lower().endswith(".evtx"):
                found.append(os.path.join(root, name))
    return sorted(found)


def locate_dll(evtxecmd_dir: str) -> str | None:
    """Path to EvtxECmd.dll RELATIVE to evtxecmd_dir, or None if absent.

    Releases sometimes nest the DLL under an ``EvtxECmd/`` folder, so search a few
    levels deep as the shell did (maxdepth 3), preferring the root.
    """
    root = os.path.join(evtxecmd_dir, "EvtxECmd.dll")
    if os.path.isfile(root):
        return "EvtxECmd.dll"
    for cur, _dirs, files in os.walk(evtxecmd_dir):
        # Depth relative to evtxecmd_dir, via os.sep splitting (portable — not a
        # literal "/" count, which breaks on Windows paths / redundant separators).
        rel = os.path.relpath(cur, evtxecmd_dir)
        depth = 0 if rel == "." else len(rel.split(os.sep))
        if depth > 3:
            continue
        if "EvtxECmd.dll" in files:
            return os.path.relpath(os.path.join(cur, "EvtxECmd.dll"), evtxecmd_dir)
    return None


def host_group(evtx_file: str, evtx_dir: str) -> str:
    """Output sub-dir for a log: its parent dir relative to evtx_dir, or
    'unspecified_host' when it sits directly under the input root."""
    rel_dir = os.path.dirname(os.path.relpath(evtx_file, evtx_dir))
    return rel_dir if rel_dir not in ("", ".") else "unspecified_host"


def out_names(evtx_file: str) -> tuple[str, str]:
    """(_EvtxECmd_Output.json, _EvtxECmd_Output.xml) names for a log."""
    base = os.path.basename(evtx_file)
    if base.lower().endswith(".evtx"):
        base = base[: -len(".evtx")]
    return f"{base}_EvtxECmd_Output.json", f"{base}_EvtxECmd_Output.xml"


def _run_evtxecmd(evtx_file, dest_dir, evtxecmd_dir, dll_rel, json_out, xml_out, image):
    """One EvtxECmd container run over one log, JSON + XML into dest_dir."""
    subprocess.run(
        [
            "docker", "run", "--rm",
            "-v", f"{os.path.realpath(evtxecmd_dir)}:/evtxecmd:ro",
            "-v", f"{os.path.dirname(evtx_file)}:/input:ro",
            "-v", f"{dest_dir}:/output",
            "-w", "/evtxecmd",
            image,
            "dotnet", f"/evtxecmd/{dll_rel}",
            "-f", f"/input/{os.path.basename(evtx_file)}",
            "--json", "/output", "--jsonf", json_out,
            "--xml", "/output", "--xmlf", xml_out,
        ],
        check=True,
    )


def _nonempty(path: str) -> bool:
    try:
        return os.path.getsize(path) > 0
    except OSError:
        return False


def process(evtx_dir, out_dir, evtxecmd_dir, image=_DOTNET_IMAGE, force=False) -> dict:
    """Parse every .evtx under evtx_dir into out_dir/<host>/. Idempotent."""
    evtx_dir = os.path.realpath(evtx_dir)
    out_dir = os.path.realpath(out_dir)
    os.makedirs(out_dir, exist_ok=True)
    dll_rel = locate_dll(evtxecmd_dir)
    files = discover(evtx_dir)

    summary = {
        "tool": "evtx",
        "evtx_dir": evtx_dir,
        "out_dir": out_dir,
        "evtxecmd_dll": dll_rel,
        "files": len(files),
        "processed": 0,
        "skipped": 0,
        "failed": 0,
        "results": [],
    }
    if dll_rel is None:
        summary["error"] = "EvtxECmd.dll not found under evtxecmd_dir"
        return summary

    for evtx in files:
        host = host_group(evtx, evtx_dir)
        dest_dir = os.path.join(out_dir, host)
        json_out, xml_out = out_names(evtx)
        rel = os.path.relpath(evtx, evtx_dir)
        json_path = os.path.join(dest_dir, json_out)
        if not force and _nonempty(json_path):
            summary["skipped"] += 1
            continue
        os.makedirs(dest_dir, exist_ok=True)
        try:
            _run_evtxecmd(evtx, dest_dir, evtxecmd_dir, dll_rel, json_out, xml_out, image)
        except subprocess.CalledProcessError:
            for p in (json_path, os.path.join(dest_dir, xml_out)):
                if os.path.exists(p):
                    os.remove(p)
            summary["failed"] += 1
            summary["results"].append({"log": rel, "error": "EvtxECmd failed"})
            continue
        if _nonempty(json_path):
            summary["processed"] += 1
            summary["results"].append({"log": rel, "output": os.path.join(host, json_out)})
        else:
            # EvtxECmd exits 0 on an empty log — drop the empty artefact so the
            # skip-guard doesn't treat it as done.
            for p in (json_path, os.path.join(dest_dir, xml_out)):
                if os.path.exists(p):
                    os.remove(p)
            summary["failed"] += 1
            summary["results"].append({"log": rel, "error": "no records (empty or corrupt log)"})
    return summary


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(
        prog="get_sybers_dfir.evtx",
        description="Windows Event Logs (.evtx) -> EvtxECmd normalised JSON",
    )
    ap.add_argument("--evtx-dir", required=True, help="directory tree of .evtx logs (recursed)")
    ap.add_argument("--out-dir", required=True, help="output dir; grouped by source sub-dir (host)")
    ap.add_argument("--evtxecmd-dir", required=True, help="operator-supplied EvtxECmd release dir")
    ap.add_argument("--dotnet-image", default=_DOTNET_IMAGE, help="dotnet runtime image for EvtxECmd")
    ap.add_argument("--force", action="store_true", help="reparse logs that already have output")
    args = ap.parse_args(argv)

    summary = process(
        args.evtx_dir, args.out_dir, args.evtxecmd_dir,
        image=args.dotnet_image, force=args.force,
    )
    json.dump(summary, sys.stdout)
    sys.stdout.write("\n")
    if summary.get("error"):
        sys.stderr.write(summary["error"] + "\n")
        return 2
    return 1 if summary["failed"] and not summary["processed"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
