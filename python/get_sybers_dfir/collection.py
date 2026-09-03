"""Evidence collections and the ``data_store/raw`` auto-sorter for the dxdfir CLI.

A *collection* is a named case folder under
``data_store/raw/collections/<name>/`` holding the same per-lane subdirs the
processing roles read from (``pcaps/``, ``logs/winevt/``, ``memory/``,
``disk_images/``, ``VM_files/``).

Drop mixed evidence into the dropzone ``data_store/raw/sort/`` and
``dxdfir collection sort <name>`` files each item into that collection's matching
lane subdir. Classification is **not** reinvented here — it delegates to the
processors' own magic-byte detectors (:func:`zeek.is_pcap`,
:func:`plaso.detect_format` / :func:`plaso.ext_format`,
:func:`volatility.is_memory_image`), so the sorter and the pipeline always agree
on what a file is. **Content (magic bytes) wins over extension**, so an E01
mislabelled ``.raw`` files as a disk image by its real header, not its name.

``dxdfir process all <name>`` then drives every lane over just that collection,
each role scoped to the collection's subdir via its input-dir Ansible var.

Forensic-safe: a header-less file two lanes both claim by extension (``.raw`` is a
memory image AND a raw disk image) or that none recognise is never guessed — it
stays in the dropzone and is reported, for the operator to place by hand.
"""
from __future__ import annotations

import re
import shutil
from dataclasses import dataclass, field
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


# --------------------------------------------------------------- paths / naming
def collections_root(repo: Path) -> Path:
    return repo.joinpath(*_COLLECTIONS_REL)


def dropzone(repo: Path) -> Path:
    return repo.joinpath(*_DROPZONE_REL)


def collection_dir(repo: Path, name: str) -> Path:
    return collections_root(repo) / name


def valid_name(name: str) -> bool:
    return name not in (".", "..") and bool(_NAME_RE.match(name))


def list_collections(repo: Path) -> list[str]:
    """Names of collections (a dir under collections/ carrying the marker)."""
    root = collections_root(repo)
    if not root.is_dir():
        return []
    return sorted(p.name for p in root.iterdir()
                  if p.is_dir() and (p / _MARKER).exists())


def create(repo: Path, name: str) -> Path:
    """Create a collection — its lane subdirs and marker — and ensure the shared
    dropzone exists. Idempotent. Raises ValueError on a bad name."""
    if not valid_name(name):
        raise ValueError(
            f"invalid collection name {name!r} — use letters/digits then . _ -")
    root = collection_dir(repo, name)
    for sub in LANE_SUBDIRS:
        (root / sub).mkdir(parents=True, exist_ok=True)
    (root / _MARKER).write_text(f"name: {name}\n", encoding="utf-8")
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
    collection's matching lane subdir. Ambiguous/unknown files stay and are
    reported. Sub-directories and dotfiles in the dropzone are ignored."""
    if name not in list_collections(repo):
        raise ValueError(
            f"no such collection {name!r} — create it first: "
            f"dxdfir collection create --name {name}")
    dz = dropzone(repo)
    dz.mkdir(parents=True, exist_ok=True)
    root = collection_dir(repo, name)
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
