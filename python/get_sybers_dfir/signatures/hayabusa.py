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

Native Rust binary (no official image), so — unlike Volatility's in-container ISF
symbol fetch — there is no hardened tool container to fetch through; ``--fetch``
(also :func:`fetch`) provisions the pinned upstream release, the hayabusa binary
AND its bundled Sigma ``rules/`` tree, with the same pin + sha256 discipline as
``detectraptor.py`` — a host-side stdlib download like the rest of this package.
"""
from __future__ import annotations

import glob
import hashlib
import io
import json
import os
import platform
import subprocess
import tempfile
import urllib.request
import zipfile

from .. import imageexport
from . import list_images

# Pinned upstream Hayabusa release: the native binary + its bundled Sigma rules/
# tree, published per-arch as a zip on GitHub. Same discipline as detectraptor.py
# — pin the version AND the sha256 of the downloaded zip, so a moved or tampered
# asset is caught. To advance: bump _VERSION and paste the new digest(s) (a
# mismatch raises with the digest it got). The zip unpacks FLAT: a hayabusa*
# binary beside rules/ and config/ — exactly where find_binary() and the lane's
# <bin-dir>/rules default look.
_REPO = "Yamato-Security/hayabusa"
_VERSION = "3.4.0"                    # the pin the retired signatures shell lane used
# sha256 of hayabusa-<_VERSION>-lin-<arch>-gnu.zip, keyed by hayabusa's arch tag.
# Only an arch we have verified is pinned; an unpinned arch still fetches (version
# + HTTPS), just without the extra digest check.
_ZIP_SHA256 = {
    "x64": "c58860c9ad2bc00bec9935d6a5dc43060a37119bdff6c05177cc677257a3b946",
}


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


def _hb_asset(version: str) -> tuple[str, str]:
    """(release asset filename, hayabusa arch tag) for this host. Pure."""
    machine = platform.machine().lower()
    arch = "aarch64" if machine in ("aarch64", "arm64") else "x64"
    return f"hayabusa-{version}-lin-{arch}-gnu.zip", arch


def _download_zip(url: str, want_sha256: str | None) -> bytes:
    with urllib.request.urlopen(url, timeout=300) as resp:  # noqa: S310 — pinned https release URL
        blob = resp.read()
    if want_sha256:
        got = hashlib.sha256(blob).hexdigest()
        if got != want_sha256:
            raise ValueError(
                f"sha256 mismatch for {url}: expected {want_sha256}, got {got}")
    return blob


def _safe_extract(zf: zipfile.ZipFile, dest: str) -> None:
    """``extractall`` with a zip-slip guard — no member may escape ``dest``."""
    dest_abs = os.path.realpath(dest)
    for member in zf.namelist():
        target = os.path.realpath(os.path.join(dest, member))
        if target != dest_abs and not target.startswith(dest_abs + os.sep):
            raise ValueError(f"unsafe path in archive: {member!r}")
    zf.extractall(dest)


def fetch(hb_dir: str, *, version: str | None = None, force: bool = False) -> dict:
    """Provision the pinned Hayabusa release under ``hb_dir``.

    Downloads the per-arch release zip (in-memory), verifies its sha256 against the
    pin when the arch is pinned, unpacks it (the hayabusa binary + its bundled
    Sigma ``rules/`` tree) where :func:`find_binary` and the lane's
    ``<bin-dir>/rules`` default look, and makes the binary executable. Skips when a
    binary is already present (pass ``force=True`` to refresh). Returns a summary;
    raises on hash mismatch.

    Native binary, so — unlike Volatility's in-container symbol fetch — there is no
    hardened tool image to fetch through; this is a host-side stdlib download, the
    same pattern as :mod:`get_sybers_dfir.signatures.detectraptor`.
    """
    version = version or _VERSION
    existing = find_binary(hb_dir)
    if existing and not force:
        return {"tool": "hayabusa", "binary": existing, "skipped": True}
    asset, arch = _hb_asset(version)
    url = f"https://github.com/{_REPO}/releases/download/v{version}/{asset}"
    want = _ZIP_SHA256.get(arch) if version == _VERSION else None
    blob = _download_zip(url, want)
    os.makedirs(hb_dir, exist_ok=True)
    with zipfile.ZipFile(io.BytesIO(blob)) as zf:
        _safe_extract(zf, hb_dir)
    # The zip unpacks flat, so the binary is <hb_dir>/<asset without .zip>; fall
    # back to a name search for a layout that differs across future versions.
    # (find_binary() can't locate it yet — it requires +x, which we set below.)
    binary = os.path.join(hb_dir, asset[:-4])
    if not os.path.isfile(binary):
        cands = [c for c in sorted(
                     glob.glob(os.path.join(hb_dir, "**", "hayabusa*"), recursive=True))
                 if os.path.isfile(c) and not c.endswith(".zip")
                 and "." not in os.path.basename(c)]
        binary = cands[0] if cands else None
    if not binary:
        raise RuntimeError(f"no hayabusa binary found after unpacking {asset}")
    os.chmod(binary, 0o755)
    return {"tool": "hayabusa", "binary": binary, "version": version, "asset": asset,
            "rules_dir": os.path.join(os.path.dirname(binary), "rules"),
            "verified": want is not None, "skipped": False}


# Module-level alias so run() — which has a ``fetch`` bool parameter that would
# shadow the name in its local scope — can still reach the provisioner.
_fetch_release = fetch


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
        # omits them, which is what once made the detection lane emit empty
        # technique ids. Downstream readers (the sig-hayabusa-high rule's
        # matcher contract, the STIX exporter) parse MitreTags into technique
        # ids. A leaner custom profile (minimal + the two Mitre columns) would
        # need authoring into the operator-supplied config/profiles.yaml, which
        # isn't present to write to/verify here, so the built-in verbose profile
        # — guaranteed to emit both — is used; readers keep only the columns
        # they need, so the extra fields are inert.
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
    if (not hb_bin or not os.access(hb_bin, os.X_OK)) and fetch:
        # --fetch contract (mirrors the yara lane): provision the pinned Hayabusa
        # release — binary + bundled Sigma rules — when absent. Offline/failed
        # fetch is a note, not a failure.
        try:
            hb_bin = _fetch_release(hb_dir).get("binary") or find_binary(hb_dir)
        except Exception as exc:  # noqa: BLE001 — network/hash errors surface as a note
            res["note"] = f"hayabusa fetch failed: {exc}"
    if not hb_bin or not os.access(hb_bin, os.X_OK):
        res["note"] = res["note"] or f"no hayabusa binary in {hb_dir} — supply one or --fetch"
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
