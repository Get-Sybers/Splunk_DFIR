"""Evidence collections and the ``data_store/raw`` auto-sorter for the dxdfir CLI.

A *collection* is a named case folder under
``data_store/raw/collections/<name>/`` holding the same per-lane subdirs the
processing roles read from (``pcaps/``, ``logs/winevt/``, ``memory/``,
``disk_images/``, ``VM_files/``). A registered collection carries a
``.collection`` marker and a ``.collection.log`` — an append-only record of what
was created, registered, sorted, hashed and processed, so a case keeps its history.

Two ways in:

* ``dxdfir collection create`` + drop into ``data_store/raw/sort/`` +
  ``dxdfir collection sort`` — the tool files each item into the right lane
  subdir. Classification is **not** reinvented: it delegates to the processors'
  own magic-byte detectors (:func:`zeek.is_pcap`, :func:`plaso.detect_format` /
  :func:`plaso.ext_format`, :func:`volatility.is_memory_image`), so **content
  beats extension** — an E01 mislabelled ``.raw`` files as a disk image by its
  header, not its name.
* Stage the lane subdirs by hand. Such a folder is an *unregistered* collection
  (no marker); the CLI detects it and offers to register it so the run is logged
  (see :func:`unregistered` / :func:`register`).

Forensic-safe: a header-less file two lanes both claim by extension (``.raw`` is
a memory image AND a raw disk image) or that none recognise is never guessed — it
stays in the dropzone and is reported, for the operator to place by hand.
"""
from __future__ import annotations

import hashlib
import json
import os
import re
import shutil
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path


@dataclass(frozen=True)
class Lane:
    """One processing lane: the ``raw/`` subdirs it reads and the Ansible
    input-dir var(s) that point there (parallel to ``subdirs``) — the hook a
    collection uses to scope ``dxdfir process`` to itself. Detection is the
    processors' job (see :func:`classify`); this only says where a lane reads."""

    name: str
    subdirs: tuple[str, ...]
    input_vars: tuple[str, ...]


# Mirrors each dxdfir_<lane> role's input-dir defaults (defaults/main.yml).
LANES: tuple[Lane, ...] = (
    Lane("zeek", ("pcaps",), ("dxdfir_zeek_pcap_dir",)),
    Lane("evtx", ("logs/winevt",), ("dxdfir_evtx_evtx_dir",)),
    Lane("volatility", ("memory",), ("dxdfir_volatility_memory_dir",)),
    Lane("plaso", ("disk_images", "VM_files"),
         ("dxdfir_plaso_input_dir", "dxdfir_plaso_vm_dir")),
    Lane("zimmerman", ("disk_images", "VM_files"),
         ("dxdfir_zimmerman_input_dir", "dxdfir_zimmerman_vm_dir")),
)

# The lane subdirs a collection materialises (order = display order).
LANE_SUBDIRS: tuple[str, ...] = ("pcaps", "logs/winevt", "memory", "disk_images", "VM_files")

# How a plaso image format (from detect_format / ext_format) maps to a raw/ subdir.
_DISK_FORMATS = ("ewf1", "ewf2", "ewf-cont", "qcow2", "aff", "raw")
_VM_FORMATS = ("vmdk", "vmdk-extent", "vhd", "vhdx")

_NAME_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._-]*$")
_COLLECTIONS_REL = ("data_store", "raw", "collections")
_DROPZONE_REL = ("data_store", "raw", "sort")
_MARKER = ".collection"
_LOG = ".collection.log"
_MANIFEST = ".collection.hashes"


# --------------------------------------------------------------- paths / naming
def collections_root(repo: Path) -> Path:
    return repo.joinpath(*_COLLECTIONS_REL)


def dropzone(repo: Path) -> Path:
    return repo.joinpath(*_DROPZONE_REL)


def collection_dir(repo: Path, name: str) -> Path:
    """The collection's directory. Validates ``name`` at this single choke point,
    so no caller can build a path outside collections/ (no traversal, no absolute
    or ``.``/``..`` segments). Raises ValueError on a bad name."""
    if not valid_name(name):
        raise ValueError(f"invalid collection name {name!r} — use letters/digits then . _ -")
    return collections_root(repo) / name


def valid_name(name: str) -> bool:
    return name not in (".", "..") and bool(_NAME_RE.match(name))


def _now() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


# --------------------------------------------------------------- registry / log
def is_registered(repo: Path, name: str) -> bool:
    """True when the collection carries the ``.collection`` marker."""
    return (collection_dir(repo, name) / _MARKER).is_file()


def list_collections(repo: Path) -> list[str]:
    """Registered collections (a dir under collections/ carrying the marker)."""
    root = collections_root(repo)
    if not root.is_dir():
        return []
    return sorted(p.name for p in root.iterdir()
                  if p.is_dir() and (p / _MARKER).exists())


def _has_evidence(d: Path) -> bool:
    return bool(evidence_files(d))


def unregistered(repo: Path) -> list[str]:
    """collections/ subdirs that hold evidence but carry NO marker — a case an
    operator staged by hand instead of via ``collection create`` + ``sort``."""
    root = collections_root(repo)
    if not root.is_dir():
        return []
    return sorted(p.name for p in root.iterdir()
                  if p.is_dir() and not (p / _MARKER).exists()
                  and valid_name(p.name) and _has_evidence(p))


def _write_marker(root: Path, name: str) -> None:
    (root / _MARKER).write_text(f"name: {name}\nregistered_at: {_now()}\n", encoding="utf-8")


def log_event(repo: Path, name: str, event: str, **detail) -> None:
    """Append one JSONL record ({ts, event, ...detail}) to the collection log."""
    root = collection_dir(repo, name)
    root.mkdir(parents=True, exist_ok=True)
    rec = {"ts": _now(), "event": event, **detail}
    with open(root / _LOG, "a", encoding="utf-8") as fh:
        fh.write(json.dumps(rec, sort_keys=False) + "\n")


def read_log(repo: Path, name: str) -> list[dict]:
    """The collection's log events, oldest first (``[]`` if none)."""
    p = collection_dir(repo, name) / _LOG
    if not p.is_file():
        return []
    out: list[dict] = []
    for line in p.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            out.append(json.loads(line))
        except json.JSONDecodeError:
            continue
    return out


# ------------------------------------------------- integrity (SHA-256 + SHA-1)
def _hash_file(path: Path) -> tuple[str, str]:
    """(sha1, sha256) of a file, computed in a single read pass."""
    h1, h256 = hashlib.sha1(), hashlib.sha256()
    with open(path, "rb") as fh:
        for chunk in iter(lambda: fh.read(1 << 20), b""):
            h1.update(chunk)
            h256.update(chunk)
    return h1.hexdigest(), h256.hexdigest()


def _walk_files(root: Path):
    """Regular, non-symlink files under ``root`` WITHOUT following symlinked dirs —
    a symlink loop can't hang it and a symlink can't pull in files outside the
    collection (integrity + no traversal)."""
    for dirpath, _dirs, filenames in os.walk(root, followlinks=False):
        base = Path(dirpath)
        for fn in filenames:
            p = base / fn
            if p.is_symlink() or not p.is_file():
                continue
            yield p


def evidence_files(root: Path) -> list[Path]:
    """Every evidence file under a collection, excluding ONLY the collection's own
    control files (.collection, .collection.log, .collection.hashes). Dot-prefixed
    EVIDENCE (.bash_history, .ssh/…) is included — it is real forensic data.
    Symlinks are skipped and symlinked directories are not followed."""
    control = {root / _MARKER, root / _LOG, root / _MANIFEST}
    return sorted(p for p in _walk_files(root) if p not in control)


def hash_collection(repo: Path, name: str) -> tuple[list[tuple[str, str, str]], dict[str, str]]:
    """``([(relpath, sha1, sha256)], {"sha1": rollup, "sha256": rollup})``.

    Every evidence file is SHA-256'd AND SHA-1'd (one read pass); each collection
    rollup is the hash — in that algorithm — of every file's hex digest sorted
    alphabetically and concatenated, so it is order-independent and changes
    whenever any file's content changes. SHA-256 is the primary integrity hash
    (forensic strength); SHA-1 is kept alongside it."""
    root = collection_dir(repo, name)
    if not root.is_dir():
        raise ValueError(f"no such collection {name!r} to hash")
    per_file: list[tuple[str, str, str]] = []
    for p in evidence_files(root):
        s1, s256 = _hash_file(p)
        per_file.append((str(p.relative_to(root)), s1, s256))
    per_file.sort(key=lambda t: t[0])                    # manifest ordered by path
    rollups = {
        "sha1": hashlib.sha1(
            "".join(sorted(t[1] for t in per_file)).encode("ascii")).hexdigest(),
        "sha256": hashlib.sha256(
            "".join(sorted(t[2] for t in per_file)).encode("ascii")).hexdigest(),
    }
    return per_file, rollups


def write_manifest(repo: Path, name: str) -> tuple[dict[str, str], int]:
    """(Re)compute the collection's hash manifest, persist it to
    ``.collection.hashes`` and log a 'hashed' event (when registered). Returns
    ``({"sha1", "sha256"}, file_count)``. Hashes every evidence file, so it is as
    slow as the evidence is large."""
    root = collection_dir(repo, name)
    root.mkdir(parents=True, exist_ok=True)
    per_file, rollups = hash_collection(repo, name)
    header = (f"# DX_DFIR collection manifest\n"
              f"# collection: {name}\n"
              f"# collection_sha256: {rollups['sha256']}\n"
              f"# collection_sha1: {rollups['sha1']}\n"
              f"# files: {len(per_file)}\n"
              f"# generated: {_now()}\n"
              f"# columns: sha256  sha1  path\n")
    body = "".join(f"{s256}  {s1}  {rel}\n" for rel, s1, s256 in per_file)
    (root / _MANIFEST).write_text(header + body, encoding="utf-8")
    if is_registered(repo, name):
        log_event(repo, name, "hashed", collection_sha256=rollups["sha256"],
                  collection_sha1=rollups["sha1"], files=len(per_file))
    return rollups, len(per_file)


def manifest_rollup(repo: Path, name: str) -> str | None:
    """The stored collection SHA-256 (primary rollup) from the manifest header, or
    None if never hashed. Cheap — reads the header, does not re-hash."""
    p = collection_dir(repo, name) / _MANIFEST
    if not p.is_file():
        return None
    for line in p.read_text(encoding="utf-8").splitlines():
        if line.startswith("# collection_sha256:"):
            return line.split(":", 1)[1].strip() or None
    return None


def create(repo: Path, name: str) -> Path:
    """Create a collection — its lane subdirs and marker — and ensure the shared
    dropzone exists. Idempotent. Raises ValueError on a bad name."""
    if not valid_name(name):
        raise ValueError(
            f"invalid collection name {name!r} — use letters/digits then . _ -")
    root = collection_dir(repo, name)
    dir_existed = root.is_dir()
    had_marker = (root / _MARKER).exists()
    for sub in LANE_SUBDIRS:
        (root / sub).mkdir(parents=True, exist_ok=True)
    if not had_marker:            # write the marker (and its registered_at) ONCE — idempotent
        _write_marker(root, name)
        # a folder that already existed (hand-staged) is a REGISTRATION, not a creation
        log_event(repo, name, "registered" if dir_existed else "created",
                  **({"source": "create"} if dir_existed else {}))
    dropzone(repo).mkdir(parents=True, exist_ok=True)
    return root


def register(repo: Path, name: str, *, source: str = "detected") -> Path:
    """Register an EXISTING (hand-staged) collection dir: write the marker and log
    it. Does not create lane subdirs. Raises ValueError if the dir is absent or
    the name is invalid. Idempotent (a registered collection is left as-is)."""
    if not valid_name(name):
        raise ValueError(
            f"invalid collection name {name!r} — use letters/digits then . _ -")
    root = collection_dir(repo, name)
    if not root.is_dir():
        raise ValueError(f"no collection folder to register at {root}")
    if not (root / _MARKER).exists():
        _write_marker(root, name)
        log_event(repo, name, "registered", source=source)
    dropzone(repo).mkdir(parents=True, exist_ok=True)
    return root


def unregister(repo: Path, name: str) -> bool:
    """Remove the ``.collection`` marker so ``name`` is no longer tracked; the
    evidence and log are left in place. Returns True when a marker was removed.
    Raises ValueError on a bad name or missing folder."""
    root = collection_dir(repo, name)
    if not root.is_dir():
        raise ValueError(f"no such collection {name!r}")
    marker = root / _MARKER
    if not marker.is_file():
        return False
    # log BEFORE removing the marker so the event lands in the collection's log
    log_event(repo, name, "unregistered")
    marker.unlink()
    return True


# --------------------------------------------------------------- classification
def _content_subdir(path: Path) -> str | None:
    """The lane subdir from CONTENT (magic bytes) alone — the definitive signal,
    reusing the processors' own magic checks. None when nothing matches by magic."""
    from . import plaso, zeek  # lazy import: keep `dxdfir` startup light
    p = str(path)
    try:
        with open(p, "rb") as fh:
            head4 = fh.read(4).hex()
    except OSError:
        head4 = ""
    if head4 in zeek._PCAP_MAGIC:            # zeek's authoritative pcap magic set
        return "pcaps"
    cfmt = plaso.detect_format(p)            # plaso's image magic (EWF/VMDK/VHDX/QCOW2)
    if cfmt in _DISK_FORMATS:
        return "disk_images"
    if cfmt in _VM_FORMATS:
        return "VM_files"
    return None


def _ext_subdirs(path: Path) -> set[str]:
    """Lane subdirs claiming this file by NAME/extension — the fallback used only
    when no magic matched. Reuses the processors' own extension logic."""
    from . import plaso, volatility, zeek  # lazy import
    claims: set[str] = set()
    if zeek.is_pcap(str(path)):                 # .pcap/.pcapng/.cap (magic already missed)
        claims.add("pcaps")
    efmt = plaso.ext_format(str(path))
    if efmt in _DISK_FORMATS:
        claims.add("disk_images")
    elif efmt in _VM_FORMATS:
        claims.add("VM_files")
    if volatility.is_memory_image(path.name):   # memory-dump extensions
        claims.add("memory")
    if path.name.lower().endswith(".evtx"):     # Windows event log
        claims.add("logs/winevt")
    return claims


def classify(path: Path) -> tuple[str | None, str]:
    """Where a file sorts to, magic-first via the processors' detectors.

    ``(subdir, "ok")`` — a single lane owns it; ``(None, "ambiguous:a,b")`` —
    several lanes claim it by extension with no magic to break the tie (a
    header-less ``.raw`` is a memory OR a disk image); ``(None, "unknown")`` —
    nothing recognises it. Content beats extension, so a mislabelled image is
    filed by its real type.
    """
    magic = _content_subdir(path)
    if magic:
        return magic, "ok"
    claims = _ext_subdirs(path)
    if not claims:
        return None, "unknown"
    if len(claims) > 1:
        return None, "ambiguous:" + ",".join(sorted(claims))
    return next(iter(claims)), "ok"


# --------------------------------------------------------------- sort / inspect
@dataclass
class SortResult:
    moved: dict[str, list[str]] = field(default_factory=dict)      # subdir -> filenames
    skipped: list[tuple[str, str]] = field(default_factory=list)   # (filename, reason)

    @property
    def moved_count(self) -> int:
        return sum(len(v) for v in self.moved.values())


def sort_into(repo: Path, name: str, *, dry_run: bool = False) -> SortResult:
    """Classify each file directly in the dropzone and move it into the named
    collection's matching lane subdir. Works on any existing collection dir
    (registered or not); logs the move only when the collection is registered.
    Ambiguous/unknown files stay and are reported; dirs/dotfiles are ignored."""
    root = collection_dir(repo, name)
    if not root.is_dir():
        raise ValueError(
            f"no such collection {name!r} — create it first: "
            f"dxdfir collection create --name {name}")
    dz = dropzone(repo)
    dz.mkdir(parents=True, exist_ok=True)
    res = SortResult()
    for p in sorted(dz.iterdir()):
        if p.name.startswith("."):
            continue
        if p.is_dir():
            # a subfolder in the dropzone is almost certainly a hand-staged case
            # of its own; surface it so the operator can register it or flatten it
            res.skipped.append((p.name + "/", "directory — register as its own collection or move its files up"))
            continue
        subdir, reason = classify(p)
        if subdir is None:
            res.skipped.append((p.name, reason))
            continue
        dest = root / subdir / p.name
        if dest.exists():
            res.skipped.append((p.name, f"already in {subdir}/"))
            continue
        if not dry_run:
            dest.parent.mkdir(parents=True, exist_ok=True)
            shutil.move(str(p), str(dest))
        res.moved.setdefault(subdir, []).append(p.name)
    if not dry_run and res.moved_count and is_registered(repo, name):
        log_event(repo, name, "sorted", moved=res.moved_count, skipped=len(res.skipped))
    return res


def lane_inputs(repo: Path, name: str) -> list[tuple[str, str, Path, int]]:
    """For ``process all``: one ``(lane, input_var, dir, file_count)`` per lane
    input, scoped to the collection."""
    root = collection_dir(repo, name)
    out: list[tuple[str, str, Path, int]] = []
    for lane in LANES:
        for var, sub in zip(lane.input_vars, lane.subdirs):
            d = root / sub
            n = sum(1 for _ in _walk_files(d)) if d.is_dir() else 0
            out.append((lane.name, var, d, n))
    return out
