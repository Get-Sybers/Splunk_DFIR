"""Volatility 3 ISF symbol-pack provisioning — fetch, verify, stage for offline use.

``data_store/dependencies/volatility3-symbols/`` ships holding only a ``.gitkeep``,
so the network-isolated ``dfir/volatility`` container resolves no kernels — every
Windows plugin returns empty even on a valid memory image ("symbol table
requirement was not fulfilled"). The Volatility Foundation publishes bulk ISF
symbol packs (``windows.zip`` / ``linux.zip`` / ``mac.zip``) that cover the common
kernels; staging them into that directory (the volatility lane mounts it as
``--symbols-dir``) makes the lane work OFFLINE for ANY image, not just kernels
warmed one at a time.

Why HOST-SIDE (not through a container): the hardened ``dfir/*`` images
deliberately cannot do generic downloads (``dfir/suricata`` strips
suricata-update and runs ``--network none``); the ONE network-enabled path,
Volatility's per-kernel ISF fetch, is not the bulk packs. Adding a non-hardened
fetch image would break the container posture. So the endorsed pattern is a
host-side, pinned + sha256-verified, stdlib-``urllib`` fetch — the same discipline
as :mod:`get_sybers_dfir.signatures.detectraptor`.

VERIFY. The packs are a rolling "latest" at a stable URL; there is NO immutable
versioned URL, so — unlike detectraptor, which pins a git commit + digest — there
is no stable digest to freeze in this repo (the Foundation rebuilds the packs
periodically). Each download is instead verified against the Foundation's OWN
``SHA256SUMS``, fetched alongside it: that catches the truncated/corrupt download
that is the real "every plugin returns empty" failure mode. An operator may pin an
expected digest (``expected=``) for a reproducible or audited air-gapped build. A
download with no digest available (SHA256SUMS unreachable and no pin) is REFUSED,
never staged unverified.

EXTRACT. The verified pack is unzipped into the symbols directory with a strict
zip-slip guard (:func:`safe_extract` rejects absolute paths, ``..`` traversal and
symlink members). The packs carry their OS namespace in the archive paths
(``windows/...`` etc.), so the extracted tree is exactly what Volatility scans —
identical to the layout it reads when a pack is left zipped, so nothing about the
lane's mount changes.

Idempotent: a pack whose ``.staged`` marker (or OS subdirectory) is already
present is skipped; ``force=True`` re-fetches. Windows is the priority pack;
linux/mac are opt-in. Stdlib only (urllib, hashlib, zipfile), like the rest of the
provisioning code. Nothing is vendored: the packs land under
``data_store/dependencies/`` (deny-by-default gitignored) and are re-fetchable.

    python -m get_sybers_dfir.volatility_symbols --symbols-dir <dir> [--windows] \
        [--linux] [--mac] [--all] [--force]
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import stat
import sys
import tempfile
import time
import urllib.request
import zipfile

# Pinned upstream location. The packs themselves roll (see module docstring), so
# what is pinned is the URL set; integrity comes from the Foundation's SHA256SUMS.
_BASE = "https://downloads.volatilityfoundation.org/volatility3/symbols"
_SUMS = "SHA256SUMS"

# name -> upstream zip filename. windows is the default/priority pack.
PACKS: dict[str, str] = {
    "windows": "windows.zip",
    "linux": "linux.zip",
    "mac": "mac.zip",
}
_DEFAULT = "windows"

# Provenance markers live under this hidden subdir; Volatility ignores it (it is
# neither an ISF file nor a .zip), and it makes idempotence independent of the
# pack's internal layout.
_MARKER_DIR = ".staged"
_TIMEOUT = 120
_SHA_RE = re.compile(r"^[0-9a-f]{64}$")


# --- pure helpers (unit-tested without network / docker / evidence) ----------

def parse_sha256sums(text: str) -> dict[str, str]:
    """Parse ``<hex>  <filename>`` lines (coreutils ``sha256sum`` format) into a
    ``{basename: digest}`` map. Tolerates the ``*`` binary marker and any path in
    the name column, ignores anything that is not a 64-hex digest. Pure."""
    out: dict[str, str] = {}
    for line in text.splitlines():
        parts = line.split()
        if len(parts) < 2:
            continue
        digest = parts[0].lower()
        if not _SHA_RE.match(digest):
            continue
        name = os.path.basename(parts[-1].lstrip("*"))
        if name:
            out[name] = digest
    return out


def sha256_file(path: str, *, chunk: int = 1 << 20) -> str:
    """Streaming sha256 of a file (never loads a multi-GB pack into memory). Pure."""
    h = hashlib.sha256()
    with open(path, "rb") as fh:
        for block in iter(lambda: fh.read(chunk), b""):
            h.update(block)
    return h.hexdigest()


def _is_within(directory: str, target: str) -> bool:
    """True if ``target`` resolves inside ``directory`` — the zip-slip guard. Pure."""
    directory = os.path.realpath(directory)
    target = os.path.realpath(target)
    return target == directory or target.startswith(directory + os.sep)


def safe_extract(zf: zipfile.ZipFile, dest: str, *, chunk: int = 1 << 20) -> list[str]:
    """Extract every member of ``zf`` under ``dest``, refusing anything unsafe.

    Rejects (raising ``ValueError``) absolute paths, ``..`` traversal that would
    escape ``dest`` (zip-slip), and symlink members (a symlink could redirect a
    later write outside the tree). Directories are created; regular files are
    streamed. Returns the list of extracted regular-file names. Pure w.r.t. the
    network — touches only ``dest`` on the local filesystem.
    """
    dest = os.path.realpath(dest)
    extracted: list[str] = []
    for info in zf.infolist():
        name = info.filename
        if not name or name.endswith("/"):
            # directory entry — create it (still guarded) and move on
            target = os.path.realpath(os.path.join(dest, name))
            if not _is_within(dest, target):
                raise ValueError(f"path traversal in archive: {name!r}")
            os.makedirs(target, exist_ok=True)
            continue
        if name.startswith(("/", "\\")) or os.path.isabs(name) or ".." in name.split("/"):
            raise ValueError(f"unsafe member path in archive: {name!r}")
        # reject symlink members (Unix mode in the high bits of external_attr)
        if stat.S_ISLNK(info.external_attr >> 16):
            raise ValueError(f"symlink member not allowed in archive: {name!r}")
        target = os.path.realpath(os.path.join(dest, name))
        if not _is_within(dest, target):
            raise ValueError(f"path traversal in archive: {name!r}")
        os.makedirs(os.path.dirname(target), exist_ok=True)
        with zf.open(info) as src, open(target, "wb") as dst:
            for block in iter(lambda s=src: s.read(chunk), b""):
                dst.write(block)
        extracted.append(name)
    return extracted


def extract_pack(zip_path: str, dest: str) -> list[str]:
    """Open ``zip_path`` and :func:`safe_extract` it under ``dest``. Returns the
    extracted regular-file names. No network — unit-testable with a fixture zip."""
    with zipfile.ZipFile(zip_path) as zf:
        return safe_extract(zf, dest)


def select_packs(*, windows: bool = False, linux: bool = False,
                 mac: bool = False, all_: bool = False) -> list[str]:
    """Resolve the requested pack list from CLI-style flags. ``--all`` wins; with
    no flag at all the default is the priority pack (windows). Pure."""
    if all_:
        return list(PACKS)
    chosen = [n for n, want in (("windows", windows), ("linux", linux), ("mac", mac)) if want]
    return chosen or [_DEFAULT]


def _marker_path(symbols_dir: str, pack: str) -> str:
    return os.path.join(symbols_dir, _MARKER_DIR, f"{pack}.json")


def pack_present(symbols_dir: str, pack: str) -> bool:
    """A pack counts as already staged if we left its marker OR its OS subdirectory
    exists with content (so operator-supplied symbols are respected too). Pure."""
    if os.path.exists(_marker_path(symbols_dir, pack)):
        return True
    sub = os.path.join(symbols_dir, pack)
    if os.path.isdir(sub):
        for _root, _dirs, files in os.walk(sub):
            if files:
                return True
    return False


# --- network edge (thin; kept out of the pure helpers above) -----------------

def _download_to(url: str, dest_path: str) -> str:
    """Stream ``url`` to ``dest_path`` and return its sha256 (never buffers the
    whole pack in memory). Raises on any network/HTTP error."""
    h = hashlib.sha256()
    with urllib.request.urlopen(url, timeout=_TIMEOUT) as resp:  # noqa: S310 — pinned https URL
        with open(dest_path, "wb") as fh:
            for block in iter(lambda: resp.read(1 << 20), b""):
                fh.write(block)
                h.update(block)
    return h.hexdigest()


def _fetch_sums() -> dict[str, str]:
    """Fetch + parse the Foundation's SHA256SUMS; ``{}`` if it cannot be read (the
    subsequent download will surface the offline error more precisely)."""
    try:
        with urllib.request.urlopen(f"{_BASE}/{_SUMS}", timeout=_TIMEOUT) as resp:  # noqa: S310
            return parse_sha256sums(resp.read().decode("utf-8", "replace"))
    except Exception:  # noqa: BLE001 — unreachable SHA256SUMS is handled by the caller
        return {}


def _write_marker(symbols_dir: str, pack: str, record: dict) -> None:
    os.makedirs(os.path.join(symbols_dir, _MARKER_DIR), exist_ok=True)
    tmp = _marker_path(symbols_dir, pack) + ".part"
    with open(tmp, "w", encoding="utf-8") as fh:
        json.dump(record, fh, indent=2, sort_keys=True)
    os.replace(tmp, _marker_path(symbols_dir, pack))


def fetch(symbols_dir: str, *, packs: list[str] | None = None, force: bool = False,
          expected: dict[str, str] | None = None) -> dict:
    """Provision the requested ISF symbol packs under ``symbols_dir``.

    Downloads each pack, verifies its sha256 against the Foundation's SHA256SUMS
    (or an operator ``expected`` pin), extracts it with the zip-slip guard, and
    writes a provenance marker. Skips a pack already present unless ``force``.
    Returns a summary dict; raises on hash mismatch, a missing digest, or a network
    error (the CLI/shell treat those as non-fatal).
    """
    names = list(packs) if packs else [_DEFAULT]
    unknown = [n for n in names if n not in PACKS]
    if unknown:
        raise ValueError(f"unknown pack(s): {', '.join(unknown)} (have: {', '.join(PACKS)})")
    expected = {k: v.lower() for k, v in (expected or {}).items()}
    os.makedirs(symbols_dir, exist_ok=True)

    results: list[dict] = []
    sums: dict[str, str] | None = None  # fetched lazily, only when a download is due
    for name in names:
        if not force and pack_present(symbols_dir, name):
            results.append({"pack": name, "skipped": True})
            continue
        fname = PACKS[name]
        if sums is None:
            sums = _fetch_sums()
        want = expected.get(name) or sums.get(fname)
        # Verify FIRST: if there is no digest (SHA256SUMS unreachable — usually
        # offline — and no operator pin) refuse BEFORE pulling a multi-GB pack we
        # could not check. This also makes the offline path fail after one probe
        # instead of waiting out a second long download timeout.
        if not want:
            raise ValueError(
                f"cannot verify {fname}: SHA256SUMS unreachable (offline?) and no "
                f"--sha256 pin — not downloading unverified symbols")

        fd, tmp = tempfile.mkstemp(prefix=f".{name}.", suffix=".zip.part", dir=symbols_dir)
        os.close(fd)
        try:
            got = _download_to(f"{_BASE}/{fname}", tmp)
            if got != want:
                raise ValueError(f"sha256 mismatch for {fname}: expected {want}, got {got}")
            files = extract_pack(tmp, symbols_dir)
            _write_marker(symbols_dir, name, {
                "pack": name, "url": f"{_BASE}/{fname}", "sha256": got,
                "source": "operator-pin" if name in expected else "SHA256SUMS",
                "files": len(files), "staged_at": int(time.time()),
            })
            results.append({"pack": name, "skipped": False, "sha256": got, "files": len(files)})
        finally:
            if os.path.exists(tmp):
                os.remove(tmp)
    return {"tool": "volatility-symbols", "symbols_dir": symbols_dir, "packs": results}


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(
        prog="get_sybers_dfir.volatility_symbols",
        description="Fetch the Volatility 3 ISF symbol packs (pinned URLs, sha256-verified) "
                    "and stage them into <symbols-dir> for the offline volatility lane.",
    )
    ap.add_argument("--symbols-dir", required=True,
                    help="symbol cache (normally data_store/dependencies/volatility3-symbols)")
    ap.add_argument("--windows", action="store_true", help="stage the Windows pack (default)")
    ap.add_argument("--linux", action="store_true", help="stage the Linux pack")
    ap.add_argument("--mac", action="store_true", help="stage the macOS pack")
    ap.add_argument("--all", action="store_true", help="stage windows + linux + mac")
    ap.add_argument("--force", action="store_true", help="re-fetch even if already staged")
    ap.add_argument("--sha256", action="append", metavar="PACK=DIGEST", default=None,
                    help="operator pin for reproducible builds (repeatable), e.g. windows=<64hex>")
    args = ap.parse_args(argv)

    expected: dict[str, str] = {}
    for item in args.sha256 or []:
        key, _, val = item.partition("=")
        if key.strip() and val.strip():
            expected[key.strip()] = val.strip()

    packs = select_packs(windows=args.windows, linux=args.linux, mac=args.mac, all_=args.all)
    try:
        res = fetch(args.symbols_dir, packs=packs, force=args.force, expected=expected or None)
    except Exception as exc:  # noqa: BLE001 — offline / hash errors are reported, non-zero exit
        print(f"volatility-symbols: {exc}", file=sys.stderr)
        return 1
    json.dump(res, sys.stdout)
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
