"""Unit tests for the velociraptor processor (pure logic + real zipfile, no tool)."""
import json
import os
import zipfile

from get_sybers_dfir import velociraptor


def _make_zip(path, entries):
    with zipfile.ZipFile(path, "w") as zf:
        for name, data in entries.items():
            zf.writestr(name, data)


def test_result_members_prefers_results_tree():
    names = ["results/Windows.System.json", "uploads/x.bin", "collection_metadata.json"]
    assert velociraptor._result_members(names) == ["results/Windows.System.json"]


def test_result_members_falls_back_to_all_json():
    names = ["Windows.Registry.json", "uploads/x.bin"]
    assert velociraptor._result_members(names) == ["Windows.Registry.json"]


def test_discover_finds_only_top_level_zips(tmp_path):
    (tmp_path / "a.zip").write_bytes(b"")
    (tmp_path / "b.ZIP").write_bytes(b"")
    (tmp_path / "notes.txt").write_bytes(b"")
    os.mkdir(tmp_path / "sub")
    (tmp_path / "sub" / "c.zip").write_bytes(b"")
    got = [os.path.basename(p) for p in velociraptor.discover(str(tmp_path))]
    assert got == ["a.zip", "b.ZIP"]


def test_process_lays_out_results_and_is_idempotent(tmp_path):
    raw = tmp_path / "raw"
    out = tmp_path / "out"
    raw.mkdir()
    _make_zip(
        raw / "HOST01.zip",
        {
            "results/Windows.Registry.RecentApps.json": '{"a":1}\n',
            "uploads/big.bin": "x" * 100,
            "collection_metadata.json": "{}",  # root metadata ignored when results/ present
        },
    )
    s1 = velociraptor.process(str(raw), str(out))
    assert s1["collections"] == 1 and s1["processed"] == 1 and s1["skipped"] == 0
    laid = os.listdir(out / "HOST01")
    assert laid == ["Windows.Registry.RecentApps.json"]

    # second run: output exists -> skipped, changed=false territory
    s2 = velociraptor.process(str(raw), str(out))
    assert s2["processed"] == 0 and s2["skipped"] == 1

    # force re-lays out
    s3 = velociraptor.process(str(raw), str(out), force=True)
    assert s3["processed"] == 1


def test_already_done_is_case_insensitive(tmp_path):
    # a prior run that produced an uppercase .JSON must still count as done
    out = tmp_path / "HOST01"
    out.mkdir()
    (out / "Windows.System.JSON").write_text("{}")
    assert velociraptor._already_done(str(out)) is True


def test_process_reports_empty_collection_as_failed(tmp_path):
    raw = tmp_path / "raw"
    out = tmp_path / "out"
    raw.mkdir()
    _make_zip(raw / "EMPTY.zip", {"uploads/only.bin": "no json here"})
    s = velociraptor.process(str(raw), str(out))
    assert s["processed"] == 0 and s["failed"] == 1
