"""Fast, rule-based identification of a collection's RAW evidence.

What each item *actually is* — container format, compression, partition scheme,
filesystem, OS family — recorded once per raw item so processors can be cued
(a streamOptimized VMDK → decompress; a Linux disk → skip the Windows-only
zimmerman lane; a Windows memory image → the right Volatility symbols).

Two tools, each doing what it is quickest at (no full ``log2timeline`` just to
learn what a thing is):

* **YARA (the ``dfir/yara`` lane) is the primary identifier.** The fixed-offset
  magic dfVFS/TSK key on are expressed as YARA rules whose FACTS live in the rule
  NAME (``id_<category>_<value>``), so the lane's existing scan path returns them
  directly. Scanned over a **header slice** (``_HEADER_BYTES``), so it stays fast
  on multi-GB evidence. Extend identification by adding ``id_*`` rules.
* **dfVFS (the ``dfir/plaso`` image) supplies the partition/filesystem detail on
  disk/VM images** — it parses the partition table and, for a compressed
  (streamOptimized) VMDK, decompresses to read the inner filesystem, which a flat
  YARA scan of the compressed bytes cannot.

Only RAW evidence under the collection is identified; the processed tree is never
read, hashed, or identified. The record is written beside the hash manifest as
``.collection.identity.json``.
"""
from __future__ import annotations

import json
import os
import subprocess
import tempfile
from pathlib import Path

from . import collection as _collection
from . import container
from .imageexport import PLASO_IMAGE

_YARA_IMAGE = "dfir/yara:latest"
_HEADER_BYTES = 64 * 1024 * 1024          # identify off the header, not the whole file
IDENTITY_FILE = ".collection.identity.json"

# The lane subdirs that get the deeper dfVFS partition/filesystem scan.
_DISK_SUBDIRS = ("disk_images", "VM_files")

# YARA identification rules — facts in the rule NAME as id_<category>_<value>, so
# the dfir/yara lane's plain rule+path output is enough (no --meta needed). These
# are the fixed-offset container/format/OS magics; the partition/FS structure of a
# disk comes from dfVFS below (it, not a flat scan, walks the partition table).
IDENTIFY_RULES = r'''
rule id_format_vmdk { strings: $m = { 4B 44 4D 56 } condition: $m at 0 }
rule id_compression_streamoptimized { strings: $d = "createType=\"streamOptimized\"" condition: $d }
rule id_format_ewf { strings: $m = { 45 56 46 09 0D 0A FF 00 } condition: $m at 0 }
rule id_format_ewf2 { strings: $m = { 45 56 46 32 0D 0A 81 00 } condition: $m at 0 }
rule id_format_qcow { strings: $m = { 51 46 49 FB } condition: $m at 0 }
rule id_format_vhdx { strings: $m = "vhdxfile" condition: $m at 0 }
rule id_format_evtx { strings: $m = { 45 6C 66 46 69 6C 65 00 } condition: $m at 0 }
rule id_format_pcap { strings: $le = { D4 C3 B2 A1 } $be = { A1 B2 C3 D4 } $n = { 4D 3C B2 A1 } condition: $le at 0 or $be at 0 or $n at 0 }
rule id_format_pcapng { strings: $m = { 0A 0D 0D 0A } condition: $m at 0 }
rule id_partition_gpt { strings: $m = "EFI PART" condition: $m in (0..0x100000) }
rule id_filesystem_ntfs_windows { strings: $m = "NTFS    " condition: $m }
rule id_filesystem_fat_windows { strings: $a = "FAT32   " $b = "FAT16   " $c = "FAT12   " condition: any of them }
rule id_filesystem_xfs_linux { strings: $m = "XFSB" condition: $m at 0 }
rule id_os_windows_hive { strings: $m = "regf" condition: $m at 0 }
rule id_os_linux_banner { strings: $m = "Linux version " condition: $m }
rule id_os_linux_osrelease { strings: $p = "PRETTY_NAME=" $i = "ID_LIKE=" condition: $p and $i }
'''

# In-container dfVFS source scan (validated on the hardened dfir/plaso image): a
# structural read — storage-media type, volume systems, filesystems — plus the
# VMDK descriptor's createType (cheap header read). Prints one JSON line. The
# streamOptimized inner FS is reachable here because dfVFS decompresses.
_DFVFS_SCAN = r'''
import json, sys, struct
path = sys.argv[1]
rec = {"storage_media": [], "volume_systems": [], "file_systems": [],
       "vmdk_create_type": None, "readable_fs": False, "scan_error": None}
try:
    with open(path, "rb") as f:
        hdr = f.read(64)
        if hdr[:4] == b"KDMV":
            do = struct.unpack("<Q", hdr[28:36])[0]; ds = struct.unpack("<Q", hdr[36:44])[0]
            if do and ds:
                f.seek(do * 512)
                desc = f.read(ds * 512).split(b"\x00", 1)[0].decode("ascii", "replace")
                for line in desc.splitlines():
                    if "createType" in line:
                        rec["vmdk_create_type"] = line.split("=", 1)[1].strip().strip('"')
except Exception as exc:
    rec["vmdk_create_type"] = "(header error: %s)" % exc
from dfvfs.helpers import source_scanner
scanner = source_scanner.SourceScanner(); ctx = source_scanner.SourceScannerContext()
ctx.OpenSourcePath(path)
try:
    scanner.Scan(ctx)
except Exception as exc:
    rec["scan_error"] = "%s: %s" % (type(exc).__name__, exc)
STORAGE = {"EWF", "QCOW", "VMDK", "VHDI", "RAW", "MODI", "PHDI"}
VOLUME = {"TSK_PARTITION", "GPT", "APM", "LVM", "VSHADOW", "APFS_CONTAINER", "CS", "BDE", "LUKSDE"}
FS = {"TSK", "NTFS", "EXT", "XFS", "FAT", "APFS", "HFS"}
def visit(node):
    if node is None:
        return
    ti = node.type_indicator
    if ti in STORAGE:
        rec["storage_media"].append(ti)
    elif ti in VOLUME:
        rec["volume_systems"].append(ti)
    elif ti in FS:
        rec["file_systems"].append(ti); rec["readable_fs"] = True
    for sub in node.sub_nodes:
        visit(sub)
visit(ctx.GetRootScanNode())
for key in ("storage_media", "volume_systems", "file_systems"):
    rec[key] = sorted(set(rec[key]))
print(json.dumps(rec))
'''

# filesystem type (lower-case, from either tool) -> OS family it implies.
_FS_OS = {"ntfs": "windows", "fat": "windows", "ext": "linux", "xfs": "linux",
          "hfs": "macos", "apfs": "macos"}


def _file_type(path: Path, *, run=subprocess.run) -> str | None:
    """libmagic's human-readable type — the quickest 'what is this' for the simple
    formats (pcap/pcapng/evtx/…). Runs on the host (no container); a missing
    ``file`` binary is just an absent label."""
    try:
        proc = run(["file", "-b", str(path)], capture_output=True, text=True, check=False)
    except OSError:
        return None
    return (proc.stdout or "").strip() or None


def _slice_header(src: Path, dst: Path, n: int = _HEADER_BYTES) -> None:
    """Copy the first ``n`` bytes of ``src`` to ``dst`` — the header is all the
    identification magics need, and bounds the YARA scan on multi-GB evidence."""
    with open(src, "rb") as fh, open(dst, "wb") as out:
        remaining = n
        while remaining > 0:
            chunk = fh.read(min(1 << 20, remaining))
            if not chunk:
                break
            out.write(chunk)
            remaining -= len(chunk)


def _yara_facts(items: dict[str, Path], *, image: str = _YARA_IMAGE) -> dict[str, list[str]]:
    """Map each item (keyed by its collection-relative path) to the id_* YARA
    rules that matched its header slice. Reuses the dfir/yara lane's scan path."""
    from .signatures import yara as _yara  # lazy: keeps dxdfir startup light
    if not items:
        return {}
    with tempfile.TemporaryDirectory() as scan_dir, tempfile.TemporaryDirectory() as rules_dir:
        # TemporaryDirectory is 0700 root:root; the hardened image reads its mounts
        # as uid 2000, which must be able to traverse the dir and read the files
        # (same reason the yara lane chmods its list file to 0644).
        os.chmod(scan_dir, 0o755)
        os.chmod(rules_dir, 0o755)
        # header slices -> scan dir (flat, safe names); remember the mapping back
        keys: dict[str, str] = {}
        for i, (rel, src) in enumerate(sorted(items.items())):
            safe = f"{i:04d}"
            dst = Path(scan_dir) / safe
            _slice_header(src, dst)
            os.chmod(dst, 0o644)
            keys[safe] = rel
        rules_file = Path(rules_dir) / "identify.yar"
        rules_file.write_text(IDENTIFY_RULES, encoding="utf-8")
        index = Path(rules_dir) / "_index.yar"
        index.write_text(_yara.build_index([str(rules_file)], rules_dir), encoding="utf-8")
        os.chmod(rules_file, 0o644)
        os.chmod(index, 0o644)
        matches = _yara._scan_dir(scan_dir, rules_dir, str(index), "identify", "", image)
    out: dict[str, list[str]] = {rel: [] for rel in items}
    for m in matches:
        rel = keys.get(m["target"])
        if rel is not None and m["rule"] not in out[rel]:
            out[rel].append(m["rule"])
    return {rel: sorted(rules) for rel, rules in out.items()}


def _dfvfs_facts(host_dir: Path, filename: str, *, image: str = PLASO_IMAGE,
                 run=subprocess.run) -> dict:
    """dfVFS structural scan of one disk/VM image, run in the hardened dfir/plaso
    image (container.run adds the group that owns the read-only evidence mount, so
    the uid-2000 tool can read locked-down evidence)."""
    argv = container.run(
        image, ["python3", "-c", _DFVFS_SCAN, f"/in/{filename}"],
        mounts=[f"{os.path.realpath(host_dir)}:/in:ro"])
    proc = run(argv, capture_output=True, text=True, check=False)
    line = (proc.stdout or "").strip().splitlines()
    if proc.returncode != 0 and not line:
        return {"scan_error": f"dfvfs container rc={proc.returncode}: "
                              f"{(proc.stderr or '').strip()[:200]}"}
    try:
        return json.loads(line[-1]) if line else {"scan_error": "no output"}
    except json.JSONDecodeError as exc:
        return {"scan_error": f"bad dfvfs output: {exc}"}


def _record(rel: str, subdir: str, size: int, file_type: str | None,
            yara_rules: list[str], dfvfs: dict | None) -> dict:
    """Fold libmagic's type, the YARA rule matches and the optional dfVFS scan into
    one identity record."""
    rec: dict = {"path": rel, "lane_subdir": subdir, "size": size,
                 "file_type": file_type, "format": None, "compression": None,
                 "partition_schemes": [], "filesystems": [], "os_family": None,
                 "yara_rules": yara_rules, "notes": []}
    fs: set[str] = set()
    for r in yara_rules:
        if r.startswith("id_format_"):
            rec["format"] = rec["format"] or r[len("id_format_"):]
        elif r.startswith("id_compression_"):
            rec["compression"] = r[len("id_compression_"):]
        elif r.startswith("id_partition_"):
            rec["partition_schemes"].append(r[len("id_partition_"):])
        elif r.startswith("id_filesystem_"):
            fs.add(r[len("id_filesystem_"):].split("_")[0])
        elif r.startswith("id_os_"):
            fam = r[len("id_os_"):].split("_")[0]
            rec["os_family"] = rec["os_family"] or fam
    if dfvfs:
        if dfvfs.get("storage_media"):
            rec["format"] = rec["format"] or dfvfs["storage_media"][0].lower()
        if dfvfs.get("vmdk_create_type") and not rec["compression"] \
                and "stream" in dfvfs["vmdk_create_type"].lower():
            rec["compression"] = dfvfs["vmdk_create_type"]
        for v in dfvfs.get("volume_systems", []):
            if v in ("GPT",) and "gpt" not in rec["partition_schemes"]:
                rec["partition_schemes"].append("gpt")
        for f in dfvfs.get("file_systems", []):
            fs.add(f.lower())
        if dfvfs.get("scan_error"):
            rec["notes"].append(f"dfvfs: {dfvfs['scan_error']}")
    rec["filesystems"] = sorted(fs)
    for f in rec["filesystems"]:
        if f in _FS_OS:
            rec["os_family"] = rec["os_family"] or _FS_OS[f]
    if rec["compression"] and not rec["filesystems"]:
        rec["notes"].append("compressed container — inner filesystem/OS not "
                            "identifiable without decompression")
    return rec


def identify_collection(repo: Path, name: str, *, run=subprocess.run) -> list[dict]:
    """Identify every RAW evidence item in the collection and write the records to
    ``.collection.identity.json`` (raw only — the processed tree is never read).
    Returns the records. Logs an 'identified' event when the collection is
    registered."""
    root = _collection.collection_dir(repo, name)
    if not root.is_dir():
        raise ValueError(f"no such collection {name!r}")
    items: dict[str, Path] = {}
    for f in _collection.evidence_files(root):
        items[str(f.relative_to(root))] = f
    yara_rules = _yara_facts(items)
    records: list[dict] = []
    for rel, path in sorted(items.items()):
        subdir = rel.split("/", 1)[0]
        dfvfs = None
        if subdir in _DISK_SUBDIRS:
            dfvfs = _dfvfs_facts(path.parent, path.name, run=run)
        records.append(_record(rel, subdir, path.stat().st_size,
                               _file_type(path, run=run), yara_rules.get(rel, []), dfvfs))
    (root / IDENTITY_FILE).write_text(
        json.dumps({"collection": name, "generated": _collection._now(),
                    "items": records}, indent=2) + "\n", encoding="utf-8")
    if _collection.is_registered(repo, name):
        _collection.log_event(repo, name, "identified", items=len(records))
    return records
