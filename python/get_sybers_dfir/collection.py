"""Evidence collections and the ``data_store/raw`` auto-sorter for the dxdfir CLI.

A *collection* is a named case folder under
``data_store/raw/collections/<name>/`` holding the same per-lane subdirs the
processing roles read from (``pcaps/``, ``logs/winevt/``, ``memory/``,
``disk_images/``, ``VM_files/``). A registered collection carries a
``.collection`` marker and a ``.collection.log`` — an append-only record of what
was created, registered, sorted and processed, so a case keeps its own history.

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


# Mirrors each dfir_<lane> role's input-dir defaults (defaults/main.yml).
LANES: tuple[Lane, ...] = (
    Lane("zeek", ("pcaps",), ("dfir_zeek_pcap_dir",)),
    Lane("evtx", ("logs/winevt",), ("dfir_evtx_evtx_dir",)),
    Lane("volatility", ("memory",), ("dfir_volatility_memory_dir",)),
    Lane("plaso", ("disk_images", "VM_files"),
         ("dfir_plaso_input_dir", "dfir_plaso_vm_dir")),
    Lane("zimmerman", ("disk_images", "VM_files"),
         ("dfir_zimmerman_input_dir", "dfir_zimmerman_vm_dir")),
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
_MANIFEST = ".collection.sha1"


# --------------------------------------------------------------- paths / naming
def collections_root(repo: Path) -> Path:
    return repo.joinpath(*_COLLECTIONS_REL)


def dropzone(repo: Path) -> Path:
    return repo.joinpath(*_DROPZONE_REL)


def collection_dir(repo: Path, name: str) -> Path:
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
    return any(p.is_file() and not p.name.startswith(".") for p in d.rglob("*"))


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


# --------------------------------------------------------------- integrity (SHA-1)
def _sha1_file(path: Path) -> str:
    h = hashlib.sha1()
    with open(path, "rb") as fh:
        for chunk in iter(lambda: fh.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def evidence_files(root: Path) -> list[Path]:
    """Every evidence file under a collection (its lane subdirs), excluding the
    collection's own dotfiles (.collection, .collection.log, .collection.sha1)."""
    return sorted(p for p in root.rglob("*")
                  if p.is_file() and not p.name.startswith("."))


def hash_collection(repo: Path, name: str) -> tuple[list[tuple[str, str]], str]:
    """``([(relpath, sha1)], collection_sha1)``. Every evidence file is SHA-1'd;
    the collection's SHA-1 is the SHA-1 of every file's SHA-1 hex string sorted
    alphabetically and concatenated — order-independent, and it changes whenever
    any file's content changes."""
    root = collection_dir(repo, name)
    per_file = [(str(p.relative_to(root)), _sha1_file(p)) for p in evidence_files(root)]
    per_file.sort(key=lambda t: t[0])                    # manifest ordered by path
    rollup = hashlib.sha1(
        "".join(sorted(sha1 for _rel, sha1 in per_file)).encode("ascii")).hexdigest()
    return per_file, rollup


def write_manifest(repo: Path, name: str) -> tuple[str, int]:
    """(Re)compute the collection's SHA-1 manifest, persist it to
    ``.collection.sha1`` and log a 'hashed' event (when registered). Returns
    ``(collection_sha1, file_count)``. Note: hashes every evidence file, so it is
    as slow as the evidence is large."""
    root = collection_dir(repo, name)
    root.mkdir(parents=True, exist_ok=True)
    per_file, rollup = hash_collection(repo, name)
    header = (f"# DX_DFIR collection manifest (SHA-1)\n"
              f"# collection: {name}\n"
              f"# collection_sha1: {rollup}\n"
              f"# files: {len(per_file)}\n"
              f"# generated: {_now()}\n")
    body = "".join(f"{sha1}  {rel}\n" for rel, sha1 in per_file)
    (root / _MANIFEST).write_text(header + body, encoding="utf-8")
    if is_registered(repo, name):
        log_event(repo, name, "hashed", collection_sha1=rollup, files=len(per_file))
    return rollup, len(per_file)


def manifest_rollup(repo: Path, name: str) -> str | None:
    """The stored collection SHA-1 from the manifest header, or None if never
    hashed. Cheap — reads the header, does not re-hash."""
    p = collection_dir(repo, name) / _MANIFEST
    if not p.is_file():
        return None
    for line in p.read_text(encoding="utf-8").splitlines():
        if line.startswith("# collection_sha1:"):
            return line.split(":", 1)[1].strip() or None
    return None


def create(repo: Path, name: str) -> Path:
    """Create a collection — its lane subdirs and marker — and ensure the shared
    dropzone exists. Idempotent. Raises ValueError on a bad name."""
    if not valid_name(name):
        raise ValueError(
            f"invalid collection name {name!r} — use letters/digits then . _ -")
    root = collection_dir(repo, name)
    new = not (root / _MARKER).exists()
    for sub in LANE_SUBDIRS:
        (root / sub).mkdir(parents=True, exist_ok=True)
    _write_marker(root, name)
    dropzone(repo).mkdir(parents=True, exist_ok=True)
    if new:
        log_event(repo, name, "created")
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
        if p.is_dir() or p.name.startswith("."):
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
            n = sum(1 for f in d.rglob("*") if f.is_file()) if d.is_dir() else 0
            out.append((lane.name, var, d, n))
    return out
