"""Unit tests for get_sybers_dfir.collection — the raw/ auto-sorter.

Classification delegates to the processors' own magic-byte detectors, so these
tests assert the delegation: content (magic) beats extension, a header-less
``.raw`` is ambiguous, and create/sort file evidence into the right lane subdirs.
No docker/ansible — pure filesystem.
"""
from __future__ import annotations

from pathlib import Path

import pytest

from get_sybers_dfir import collection

# EWF/E01 header "EVF\x09\x0d\x0a\xff\x00" + fields_start + segment 1 (uint16 LE).
_EWF_MAGIC = b"\x45\x56\x46\x09\x0d\x0a\xff\x00\x01\x01\x00"
_PCAP_MAGIC = b"\xa1\xb2\xc3\xd4"


def _write(p: Path, data: bytes = b"") -> Path:
    p.write_bytes(data)
    return p


def test_classify_magic_beats_extension(tmp_path):
    # An E01 mislabelled .raw must file as a disk image by its header, not its name.
    f = _write(tmp_path / "image.raw", _EWF_MAGIC + b"padding")
    assert collection.classify(f) == ("disk_images", "ok")


def test_classify_pcap_magic_over_odd_extension(tmp_path):
    f = _write(tmp_path / "capture.dat", _PCAP_MAGIC + b"rest")
    assert collection.classify(f) == ("pcaps", "ok")


def test_classify_headerless_raw_is_ambiguous(tmp_path):
    subdir, reason = collection.classify(_write(tmp_path / "dump.raw", b"no magic here"))
    assert subdir is None
    assert reason == "ambiguous:disk_images,memory"


def test_classify_memory_extension(tmp_path):
    assert collection.classify(_write(tmp_path / "ram.mem"))[0] == "memory"


def test_classify_evtx_extension(tmp_path):
    assert collection.classify(_write(tmp_path / "Security.evtx"))[0] == "logs/winevt"


def test_classify_unknown(tmp_path):
    assert collection.classify(_write(tmp_path / "notes.txt", b"hello")) == (None, "unknown")


def test_create_makes_lane_subdirs_and_marker(tmp_path):
    root = collection.create(tmp_path, "case-a")
    assert (root / ".collection").is_file()
    for sub in collection.LANE_SUBDIRS:
        assert (root / sub).is_dir()
    assert collection.list_collections(tmp_path) == ["case-a"]
    assert collection.dropzone(tmp_path).is_dir()


def test_create_rejects_bad_name(tmp_path):
    with pytest.raises(ValueError):
        collection.create(tmp_path, "../escape")


def test_sort_routes_and_leaves_ambiguous(tmp_path):
    collection.create(tmp_path, "case-a")
    dz = collection.dropzone(tmp_path)
    _write(dz / "image.raw", _EWF_MAGIC)     # -> disk_images (magic)
    _write(dz / "capture.dat", _PCAP_MAGIC)  # -> pcaps (magic)
    _write(dz / "ram.mem")                   # -> memory (ext)
    _write(dz / "Security.evtx")             # -> logs/winevt (ext)
    _write(dz / "dump.raw", b"no magic")     # -> ambiguous, stays
    _write(dz / "notes.txt", b"x")           # -> unknown, stays
    res = collection.sort_into(tmp_path, "case-a")
    root = collection.collection_dir(tmp_path, "case-a")
    assert (root / "disk_images" / "image.raw").is_file()
    assert (root / "pcaps" / "capture.dat").is_file()
    assert (root / "memory" / "ram.mem").is_file()
    assert (root / "logs" / "winevt" / "Security.evtx").is_file()
    assert res.moved_count == 4
    assert (dz / "dump.raw").is_file() and (dz / "notes.txt").is_file()
    skipped = {n: why for n, why in res.skipped}
    assert skipped["dump.raw"].startswith("ambiguous")
    assert skipped["notes.txt"] == "unknown"


def test_sort_is_idempotent_on_second_run(tmp_path):
    collection.create(tmp_path, "case-a")
    _write(collection.dropzone(tmp_path) / "capture.dat", _PCAP_MAGIC)
    assert collection.sort_into(tmp_path, "case-a").moved_count == 1
    # nothing left to move; a re-run moves nothing and does not error
    assert collection.sort_into(tmp_path, "case-a").moved_count == 0


def test_sort_unknown_collection_raises(tmp_path):
    with pytest.raises(ValueError):
        collection.sort_into(tmp_path, "nope")
