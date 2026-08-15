"""Unit tests for the pure logic of the evtx processor (no docker/EvtxECmd needed)."""
import os

from get_sybers_dfir import evtx


def test_out_names():
    j, x = evtx.out_names("/x/Security.evtx")
    assert j == "Security_EvtxECmd_Output.json"
    assert x == "Security_EvtxECmd_Output.xml"
    # case-insensitive extension
    j2, _ = evtx.out_names("/x/System.EVTX")
    assert j2 == "System_EvtxECmd_Output.json"


def test_host_group_root_is_unspecified(tmp_path):
    root = tmp_path
    (root / "Security.evtx").write_bytes(b"x")
    assert evtx.host_group(str(root / "Security.evtx"), str(root)) == "unspecified_host"


def test_host_group_uses_subdir(tmp_path):
    sub = tmp_path / "HOST01"
    sub.mkdir()
    (sub / "Security.evtx").write_bytes(b"x")
    assert evtx.host_group(str(sub / "Security.evtx"), str(tmp_path)) == "HOST01"


def test_discover_recurses_and_sorts(tmp_path):
    (tmp_path / "a").mkdir()
    (tmp_path / "a" / "System.evtx").write_bytes(b"x")
    (tmp_path / "Security.EVTX").write_bytes(b"x")
    (tmp_path / "notes.txt").write_bytes(b"x")
    got = [os.path.relpath(p, tmp_path) for p in evtx.discover(str(tmp_path))]
    assert got == ["Security.EVTX", "a/System.evtx"]


def test_locate_dll_at_root(tmp_path):
    (tmp_path / "EvtxECmd.dll").write_bytes(b"MZ")
    assert evtx.locate_dll(str(tmp_path)) == "EvtxECmd.dll"


def test_locate_dll_nested(tmp_path):
    nested = tmp_path / "EvtxECmd"
    nested.mkdir()
    (nested / "EvtxECmd.dll").write_bytes(b"MZ")
    assert evtx.locate_dll(str(tmp_path)) == os.path.join("EvtxECmd", "EvtxECmd.dll")


def test_locate_dll_absent(tmp_path):
    assert evtx.locate_dll(str(tmp_path)) is None


def test_process_reports_missing_dll(tmp_path):
    evtx_dir = tmp_path / "in"
    evtx_dir.mkdir()
    (evtx_dir / "Security.evtx").write_bytes(b"x")
    s = evtx.process(str(evtx_dir), str(tmp_path / "out"), str(tmp_path / "noevtxecmd"))
    assert s["evtxecmd_dll"] is None and s.get("error")
    assert s["processed"] == 0
