"""Signature/detection processors — YARA, Suricata, Hayabusa.

Port of the retired ``process-signatures.sh`` (+ its ``signatures/{yara,suricata,
hayabusa}.sh`` lanes and ``lib/disk-image.sh``). Runs the three signature engines
over the evidence and lands their native events as ingest-ready JSON Lines under
``<output_dir>/<lane>/``:

    yara       loose files, disk images (mounted read-only in place, never
               extracted) and process memory (Volatility 3 windows.vadyarascan)
    suricata   PCAPs -> Suricata EVE alerts (+context event types)
    hayabusa   Windows Event Logs (.evtx) -> Sigma detection timeline

Each lane is a standalone runner (run one, or all via :func:`process`). Container-first
(YARA, Suricata) or native binary (Hayabusa). Disk-image mounting needs ``/dev/fuse``
(an LXC device-cgroup restriction blocks it by default); a lane that can't mount says
so and moves on — nothing is extracted for the YARA lane.

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
    """Every disk image under root (by the common container extensions), sorted."""
    exts = (".e01", ".raw", ".img", ".dd", ".vmdk", ".001", ".aff4")
    found = []
    for cur, _dirs, files in os.walk(root):
        for name in files:
            if name.lower().endswith(exts):
                found.append(os.path.join(cur, name))
    return sorted(found)


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
