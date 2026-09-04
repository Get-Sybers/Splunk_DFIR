"""Signature/detection processors — YARA, Suricata, Hayabusa.

Port of the retired ``process-signatures.sh`` (+ its ``signatures/{yara,suricata,
hayabusa}.sh`` lanes and ``lib/disk-image.sh``). Runs the three signature engines
over the evidence and lands their native events as ingest-ready JSON Lines under
``<output_dir>/<lane>/``:

    yara       loose files + disk images (mounted read-only, needs /dev/fuse) +
               memory (Volatility windows.vadyarascan)
    suricata   captures (magic-first discovery, same as the zeek processor)
               -> Suricata EVE alerts (+context event types)
    hayabusa   Windows Event Logs -> Sigma detection timeline: loose .evtx AND
               disk images (staged image_export extraction, shared with the
               evtx processor — no fuse needed, extracted once, reused)

Each lane is a standalone runner (run one, or all via :func:`process`) — no lane
requires a processor to have run first, and a lane never re-does raw processing a
prior processor/detection run already staged. Container-first (YARA, Suricata) or
native binary (Hayabusa). Only the YARA disk source still needs ``/dev/fuse``
(mount-only by policy — it never extracts files out of images); when the host
can't mount it says so and moves on.

The heavy lifting (docker, mounting, the native binary) lives in the lane runners;
the parsing logic (yara text output, EVE filtering, detection tagging) is factored
into pure functions for unit testing.
"""
from __future__ import annotations

import os

LANES = ("yara", "suricata", "hayabusa")


def clean_name(path: str, base_dir: str) -> str:
    """Unique, path-preserving output name: fold subdir separators + spaces so two
    corpora that share a basename keep distinct output."""
    rel = os.path.relpath(path, base_dir)
    return rel.replace("/", "_").replace(" ", "_")


def list_images(root: str) -> list[str]:
    """Every disk image under root, sorted. Delegates to the shared
    ``imageexport`` discovery so the detection lanes see exactly the image
    formats the processors do (E01/Ex01/raw/img/dd/VMDK/001/AFF4/VHD/VHDX/QCOW2)."""
    from .. import imageexport
    return imageexport.discover_images(root)


def have_fuse() -> bool:
    """True if a real read-only mount of an image is possible here (FUSE + ntfs-3g)."""
    import shutil
    return os.path.exists("/dev/fuse") and shutil.which("ntfs-3g") is not None


def process(output_dir: str, lanes=LANES, *, repo_root: str, fetch: bool = False,
            force: bool = False, config: dict | None = None) -> dict:
    """Run the requested lanes; return a combined summary.

    ``config`` carries per-lane overrides (paths, images); missing keys fall back to
    the repo defaults each lane computes from ``repo_root``.
    """
    from . import hayabusa, suricata, yara

    config = config or {}
    runners = {"yara": yara.run, "suricata": suricata.run, "hayabusa": hayabusa.run}
    results, processed, skipped, failed = {}, 0, 0, 0
    for lane in lanes:
        res = runners[lane](
            output_dir=os.path.join(output_dir, lane),
            repo_root=repo_root, fetch=fetch, force=force,
            **config.get(lane, {}),
        )
        results[lane] = res
        processed += res.get("produced", 0)
        skipped += res.get("skipped", 0)
        failed += res.get("failed", 0)
    return {
        "tool": "signatures",
        "output_dir": output_dir,
        "lanes": list(lanes),
        "processed": processed,
        "skipped": skipped,
        "failed": failed,
        "results": results,
    }


def provision(repo_root: str, lanes=LANES, *, force: bool = False,
              config: dict | None = None) -> dict:
    """Provision (fetch) each lane's rule set into data_store/dependencies/ and
    return a summary — the staging step (``--fetch-only`` /
    ``scripts/stage-detection-rules.sh``), WITHOUT running detection.

    Drives each lane's OWN pinned fetch: the DetectRaptor YARA provisioner, ET
    Open for suricata, and the pinned Hayabusa release (binary + bundled Sigma
    rules) for hayabusa — the same fetch the lanes' ``--fetch`` runs. Idempotent
    (a lane whose rules are already present is left untouched; operator YARA rules
    suppress the DetectRaptor fetch exactly as the yara lane does) and non-fatal (a
    lane that cannot be provisioned — offline, hash mismatch — records an error and
    the rest continue).
    """
    from . import detectraptor, hayabusa, suricata, yara

    ds = os.path.join(repo_root, "data_store", "dependencies")
    cfg = config or {}

    def _yara() -> dict:
        rules_dir = cfg.get("yara", {}).get("rules_dir") or os.path.join(ds, "yara-rules")
        if not force and yara._rule_files(rules_dir):
            return {"tool": "detectraptor", "skipped": True,
                    "reason": "operator YARA rules present"}
        return detectraptor.fetch(rules_dir, force=force)

    def _suricata() -> dict:
        rules_dir = cfg.get("suricata", {}).get("rules_dir") or os.path.join(ds, "suricata-rules")
        return suricata.fetch(rules_dir, force=force)

    def _hayabusa() -> dict:
        hb_dir = cfg.get("hayabusa", {}).get("hb_dir") or os.path.join(ds, "hayabusa")
        return hayabusa.fetch(hb_dir, force=force)

    runners = {"yara": _yara, "suricata": _suricata, "hayabusa": _hayabusa}
    results, provisioned, failed = {}, 0, 0
    for lane in lanes:
        try:
            results[lane] = runners[lane]()
            provisioned += 1
        except Exception as exc:  # noqa: BLE001 — offline/hash errors are non-fatal per lane
            results[lane] = {"lane": lane, "error": str(exc)}
            failed += 1
    return {
        "tool": "signatures-provision",
        "dependencies_dir": ds,
        "lanes": list(lanes),
        "provisioned": provisioned,
        "failed": failed,
        "results": results,
    }
