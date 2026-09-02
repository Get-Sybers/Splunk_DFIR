"""Hayabusa lane — Sigma-based Windows event-log detection -> native JSONL.

Scans loose ``*.evtx`` under the raw tree AND disk images, standalone — no fuse
mount and no prior processor run required. Disk-image EVTX come from the SHARED
staged extraction (``imageexport.extract_staged``: log2timeline/plaso
``image_export.py --artifact_filters WindowsEventLogs``): the stage defaults to the
same location the evtx processor uses, so whichever lane runs first extracts and
every later run — detection or processor — reuses the staged logs instead of
re-processing the raw image. (Hayabusa's ``-J`` JSON input yields 0 detections on
Plaso/evtx_dump JSON vs 792 natively, #1324, so real .evtx is required — which is
why extraction, not JSON conversion, is the path.)

The evtx pipeline's inline enrichment (``get_sybers_dfir.evtx.run_hayabusa``)
reuses ``scan_directory`` / ``find_binary`` / ``tag_detections`` here — one
Hayabusa implementation either way.

Native Rust binary (no official image); operator-supplied. ``--fetch`` is accepted
for parity with the bash script but not yet implemented here.
"""
from __future__ import annotations

import glob
import json
import os
import subprocess
import tempfile

from .. import imageexport
from . import list_images


def tag_detections(text: str) -> list[dict]:
    """Tag each Hayabusa JSONL detection with tool="hayabusa". Pure."""
    out: list[dict] = []
    for line in text.splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            ev = json.loads(line)
        except json.JSONDecodeError:
            continue
        ev["tool"] = "hayabusa"
        out.append(ev)
    return out


def find_binary(hb_dir: str) -> str | None:
    """The hayabusa executable under hb_dir (not a .zip, executable), or None."""
    for cand in sorted(glob.glob(os.path.join(hb_dir, "**", "hayabusa*"), recursive=True)):
        if cand.endswith(".zip"):
            continue
        if os.path.isfile(cand) and os.access(cand, os.X_OK):
            return cand
    return None


def _dir_has_evtx(d: str) -> bool:
    for _cur, _dirs, files in os.walk(d):
        if any(n.lower().endswith(".evtx") for n in files):
            return True
    return False


def scan_directory(hb_bin, scan_dir, rules_dir) -> str:
    """Run hayabusa over scan_dir; return its JSONL detections (empty if none).

    Public so the evtx pipeline (get_sybers_dfir.evtx.run_hayabusa) can scan the
    same .evtx it collected — loose or image-extracted — without duplicating this.
    """
    if not _dir_has_evtx(scan_dir):
        return ""
    # Hayabusa won't overwrite an existing --output file. Use a fresh temp DIR and a
    # path inside it that does not exist yet — unique without the deprecated,
    # TOCTOU-prone tempfile.mktemp(); the dir (and file) are cleaned up on exit.
    with tempfile.TemporaryDirectory() as tmpd:
        tmp_out = os.path.join(tmpd, "timeline.jsonl")
        # `--profile verbose` so each JSONL detection carries its MITRE ATT&CK
        # columns (%MitreTactics% / %MitreTags%) — the default (standard) profile
        # omits them, which is what made the detect lane emit empty AttackIds. The
        # detect registry's match_hayabusa_high parses MitreTags into technique ids
        # (get_sybers_dfir.detect.registry). A leaner custom profile (minimal +
        # the two Mitre columns) would need authoring into the operator-supplied
        # config/profiles.yaml, which isn't present to write to/verify here, so
        # the built-in verbose profile — guaranteed to emit both — is used; the
        # matcher keeps only the columns it needs, so the extra fields are inert.
        argv = [
            hb_bin, "json-timeline", "--directory", scan_dir, "--output", tmp_out,
            "--JSONL-output", "--profile", "verbose",
            "--no-wizard", "--UTC", "--quiet",
        ]
        if rules_dir:
            argv += ["--rules", rules_dir]
        subprocess.run(argv, capture_output=True, check=False)
        if os.path.isfile(tmp_out) and os.path.getsize(tmp_out) > 0:
            with open(tmp_out, encoding="utf-8", errors="replace") as fh:
                return fh.read()
        return ""


def default_stage_dir(repo_root: str) -> str:
    """The disk-image EVTX stage shared with the evtx processor: the processor
    defaults its stage to ``<out-dir>/_extracted_evtx`` under
    ``data_store/processed/windows_logs`` — the SAME path, so an image staged by
    either lane is never extracted twice."""
    return os.path.join(repo_root, "data_store", "processed", "windows_logs",
                        "_extracted_evtx")


def run(*, output_dir, repo_root, fetch=False, force=False,
        loose_dir=None, disk_dir=None, stage_dir=None, plaso_image=None, vss=False,
        hb_dir=None, hb_bin=None, rules_dir=None, scan_disk=True, **_ignored) -> dict:
    ds = os.path.join(repo_root, "data_store")
    loose_dir = loose_dir or os.path.join(ds, "raw")
    disk_dir = disk_dir or os.path.join(ds, "raw", "disk_images")
    stage_dir = stage_dir or default_stage_dir(repo_root)
    hb_dir = hb_dir or os.path.join(ds, "dependencies", "hayabusa")
    os.makedirs(output_dir, exist_ok=True)

    res = {"lane": "hayabusa", "produced": 0, "skipped": 0, "failed": 0, "note": None}
    out = os.path.join(output_dir, "timeline.jsonl")
    if not force and os.path.exists(out) and os.path.getsize(out) > 0:
        res["skipped"] += 1
        return res

    hb_bin = hb_bin or find_binary(hb_dir)
    if not hb_bin or not os.access(hb_bin, os.X_OK):
        res["note"] = f"no hayabusa binary in {hb_dir} — supply one or --fetch"
        return res
    rules_dir = rules_dir or os.path.join(os.path.dirname(hb_bin), "rules")

    raw = ""
    # 1) loose EVTX
    if _dir_has_evtx(loose_dir):
        raw += scan_directory(hb_bin, loose_dir, rules_dir)

    # 2) disk images: stage WindowsEventLogs out of each image (userspace, no fuse)
    #    and scan the stage. Reuse-aware: an image the evtx processor (or a prior
    #    detection run) already staged is not re-extracted — `force` here only
    #    regenerates the timeline, never the extraction.
    if scan_disk and os.path.isdir(disk_dir) and list_images(disk_dir):
        extract = imageexport.extract_staged(
            disk_dir, stage_dir,
            plaso_image=plaso_image or imageexport.PLASO_IMAGE, vss=vss,
        )
        res["extract"] = {k: extract[k] for k in ("images", "extracted", "reused", "failed")}
        if extract["failed"]:
            res["note"] = f"disk: image_export failed on {extract['failed']} image(s)"
        if _dir_has_evtx(stage_dir):
            raw += scan_directory(hb_bin, stage_dir, rules_dir)

    if not raw.strip():
        res["note"] = res["note"] or "no detections (no EVTX reachable)"
        return res
    detections = tag_detections(raw)
    with open(out, "w") as w:
        for ev in detections:
            w.write(json.dumps(ev) + "\n")
    res["produced"] += len(detections)
    return res
