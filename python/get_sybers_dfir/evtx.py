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

# Operator-supplied mode: a stock .NET runtime image mounts the operator's release.
# EvtxECmd's current .NET build targets net9.0, so the runtime must be 9.x — the old
# sdk:8.0 default silently fails against today's release.
_DOTNET_IMAGE = "mcr.microsoft.com/dotnet/runtime:9.0"
# Bundled mode: DX_DFIR's own image (docker/evtxecmd) with the DLL + Maps/ baked in.
_BUNDLED_IMAGE = "dfir/evtxecmd:latest"
# Where the bundled image keeps EvtxECmd.dll (its WORKDIR, alongside Maps/).
BUNDLED_DLL = "/opt/evtxecmd/EvtxECmd.dll"


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


def evtxecmd_argv(evtx_file, dest_dir, json_out, xml_out, image, *,
                  evtxecmd_dir=None, dll_rel=None, bundled_dll=BUNDLED_DLL):
    """The `docker run` argv for one EvtxECmd container run. Two modes, one shape:

    - operator-supplied (``evtxecmd_dir`` given): mount the release read-only at
      ``/evtxecmd`` and run ``dotnet /evtxecmd/<dll_rel>`` — the historic path.
    - bundled image (``evtxecmd_dir`` falsy): the DLL + Maps/ are baked into
      ``image`` at ``bundled_dll``'s dir (its WORKDIR), so no mount, and the DLL
      path is fixed.

    Pure (no I/O) so the argv is unit-testable without docker.
    """
    argv = [
        "docker", "run", "--rm",
        "-v", f"{os.path.dirname(evtx_file)}:/input:ro",
        "-v", f"{dest_dir}:/output",
    ]
    if evtxecmd_dir:
        argv += ["-v", f"{os.path.realpath(evtxecmd_dir)}:/evtxecmd:ro", "-w", "/evtxecmd"]
        dll = f"/evtxecmd/{dll_rel}"
    else:
        dll = bundled_dll
    argv += [
        image,
        "dotnet", dll,
        "-f", f"/input/{os.path.basename(evtx_file)}",
        "--json", "/output", "--jsonf", json_out,
        "--xml", "/output", "--xmlf", xml_out,
    ]
    return argv


def _run_evtxecmd(evtx_file, dest_dir, json_out, xml_out, image, *,
                  evtxecmd_dir=None, dll_rel=None):
    """One EvtxECmd container run over one log, JSON + XML into dest_dir."""
    subprocess.run(
        evtxecmd_argv(evtx_file, dest_dir, json_out, xml_out, image,
                      evtxecmd_dir=evtxecmd_dir, dll_rel=dll_rel),
        # EvtxECmd is chatty (version banner + per-record "time went backwards"
        # warnings). Capture it so nothing reaches OUR stdout, which carries only
        # the machine-readable JSON summary the role parses. On failure the output
        # is still attached to the CalledProcessError for the caller to surface.
        capture_output=True,
        check=True,
    )


def _nonempty(path: str) -> bool:
    try:
        return os.path.getsize(path) > 0
    except OSError:
        return False


def _has_records(path: str) -> bool:
    """True if the EvtxECmd JSON holds at least one record.

    EvtxECmd exits 0 on a log with no events and still writes a file — just a UTF-8
    BOM (3 bytes) and nothing else. That is NOT a real output: it has size > 0 but
    zero records, and if left on disk it (a) miscounts as ``processed`` and (b) makes
    the ADX multi-file ingest batch reject the whole batch ("0 bytes / ill formed").
    So the emptiness test must look past the BOM/whitespace, not at the byte size.
    """
    try:
        with open(path, "r", encoding="utf-8-sig") as fh:
            for line in fh:
                if line.strip():
                    return True
    except OSError:
        return False
    return False


def process(evtx_dir, out_dir, evtxecmd_dir=None, image=None, force=False) -> dict:
    """Parse every .evtx under evtx_dir into out_dir/<host>/. Idempotent.

    Two ways to supply EvtxECmd, chosen by ``evtxecmd_dir``:

    - given -> operator-supplied release: locate EvtxECmd.dll under it and mount it
      into a stock .NET runtime ``image`` (defaults to ``_DOTNET_IMAGE``).
    - falsy -> the bundled dfir/evtxecmd image (DLL + Maps/ baked in); no release dir
      is needed and none is looked for. ``image`` defaults to ``_BUNDLED_IMAGE``.

    Pass ``image`` to override either default.
    """
    evtx_dir = os.path.realpath(evtx_dir)
    out_dir = os.path.realpath(out_dir)
    os.makedirs(out_dir, exist_ok=True)
    bundled = not evtxecmd_dir
    # Default the image to match the mode, so a bare process(dir, out) is coherent
    # (bundled mode -> bundled image, not the stock runtime that has no baked DLL).
    if image is None:
        image = _BUNDLED_IMAGE if bundled else _DOTNET_IMAGE
    dll_rel = None if bundled else locate_dll(evtxecmd_dir)
    files = discover(evtx_dir)

    summary = {
        "tool": "evtx",
        "evtx_dir": evtx_dir,
        "out_dir": out_dir,
        "image": image,
        "bundled": bundled,
        "evtxecmd_dll": BUNDLED_DLL if bundled else dll_rel,
        "files": len(files),
        "processed": 0,
        "skipped": 0,
        # Empty logs are normal (a Windows channel with no events), NOT failures —
        # counted apart so the role's failed==0 assert doesn't trip on them.
        "empty": 0,
        "failed": 0,
        "results": [],
    }
    if not bundled and dll_rel is None:
        summary["error"] = "EvtxECmd.dll not found under evtxecmd_dir"
        return summary

    for evtx in files:
        host = host_group(evtx, evtx_dir)
        dest_dir = os.path.join(out_dir, host)
        json_out, xml_out = out_names(evtx)
        rel = os.path.relpath(evtx, evtx_dir)
        json_path = os.path.join(dest_dir, json_out)
        # Skip only a real prior output — one with records. A BOM-only leftover from
        # an empty log is not "done"; re-checking it is cheap.
        if not force and _has_records(json_path):
            summary["skipped"] += 1
            continue
        os.makedirs(dest_dir, exist_ok=True)
        try:
            _run_evtxecmd(evtx, dest_dir, json_out, xml_out, image,
                          evtxecmd_dir=evtxecmd_dir, dll_rel=dll_rel)
        except subprocess.CalledProcessError:
            for p in (json_path, os.path.join(dest_dir, xml_out)):
                if os.path.exists(p):
                    os.remove(p)
            summary["failed"] += 1
            summary["results"].append({"log": rel, "error": "EvtxECmd failed"})
            continue
        if _has_records(json_path):
            summary["processed"] += 1
            summary["results"].append({"log": rel, "output": os.path.join(host, json_out)})
        else:
            # EvtxECmd exits 0 on an empty log and writes a BOM-only file — drop it
            # so it isn't ingested (an empty file fails the ADX batch) or miscounted
            # as processed. This is expected, not a failure.
            for p in (json_path, os.path.join(dest_dir, xml_out)):
                if os.path.exists(p):
                    os.remove(p)
            summary["empty"] += 1
            summary["results"].append({"log": rel, "empty": True})
    return summary


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(
        prog="get_sybers_dfir.evtx",
        description="Windows Event Logs (.evtx) -> EvtxECmd normalised JSON",
    )
    ap.add_argument("--evtx-dir", required=True, help="directory tree of .evtx logs (recursed)")
    ap.add_argument("--out-dir", required=True, help="output dir; grouped by source sub-dir (host)")
    ap.add_argument(
        "--evtxecmd-dir", default="",
        help="operator-supplied EvtxECmd release dir (holds EvtxECmd.dll). Omit to "
             "use the bundled image (docker/evtxecmd), which bakes the DLL + Maps/.",
    )
    ap.add_argument(
        "--image", "--dotnet-image", dest="image", default=None,
        help="container image: the bundled dfir/evtxecmd (default when --evtxecmd-dir "
             "is omitted) or a stock .NET runtime that mounts the operator release.",
    )
    ap.add_argument("--force", action="store_true", help="reparse logs that already have output")
    args = ap.parse_args(argv)

    # Image and mode are coupled; process() picks the mode-appropriate default when
    # --image is omitted (bundled image without a release dir, stock runtime with).
    summary = process(
        args.evtx_dir, args.out_dir, args.evtxecmd_dir or None,
        image=args.image, force=args.force,
    )
    json.dump(summary, sys.stdout)
    sys.stdout.write("\n")
    if summary.get("error"):
        sys.stderr.write(summary["error"] + "\n")
        return 2
    return 1 if summary["failed"] and not summary["processed"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
