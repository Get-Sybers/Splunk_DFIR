"""Unit coverage for the CAR run-through over a materialised CAR tree (no
backend — the gate reads car_<object>.jsonl)."""
import json

import pytest

from get_sybers_dfir import carcheck


def _write(car_dir, source, obj, rows):
    d = car_dir / source
    d.mkdir(parents=True, exist_ok=True)
    (d / f"car_{obj}.jsonl").write_text("".join(json.dumps(r) + "\n" for r in rows))


def _row(obj, action, artefact="evtx_sysmon", **fields):
    return {"car_object": obj, "timestamp": "2020-01-01T00:00:00Z", "car_action": action,
            "guid": f"{obj}-1", "owning_guid": "", "link_confidence": "definitive",
            "source_artefact": artefact, "source_host": "PC1", "native": {}, **fields}


def _failures(c):
    return [line for line in c.lines if line.strip().startswith("✗")]


@pytest.fixture(autouse=True)
def _vocab(monkeypatch):
    # the engine model is a submodule; the tally logic is tested without it
    monkeypatch.setattr(carcheck, "_engine_actions",
                        lambda: {"process": {"create", "terminate"}, "flow": {"start", "end"}})


def test_populated_sane_tree_passes(tmp_path):
    _write(tmp_path, "sysmon", "process", [
        _row("process", "create", command_line="cmd.exe /c whoami", sid="S-1-5-18", pid="4536"),
        _row("process", "terminate", pid="0x11b8"),          # the hex PID encoding is numeric too
    ])
    _write(tmp_path, "sysmon", "flow", [
        _row("flow", "start", src_ip="10.0.0.1", dest_ip="fe80::1", dest_port="445")])
    _write(tmp_path, "sysmon", "relationships", [{
        "id": 1, "timestamp": "2020-01-01T00:00:00Z", "source_host": "PC1",
        "relationship": "created", "source_object": "process", "source_guid": "process-1",
        "target_object": "flow", "target_guid": "flow-1", "confidence": "definitive", "method": "pid"}])
    c = carcheck.run(str(tmp_path))
    assert c.failed == 0, _failures(c)
    assert c.passed > 0
    # every object without rows is reported NOT EXERCISED, never failed
    assert c.skipped == len(carcheck._OBJECTS) - 2
    assert c.os_families_covered == 1 and c.os_families_total == 5


def test_unpopulated_and_insane_values_fail(tmp_path):
    _write(tmp_path, "s", "process", [
        _row("process", "create", artefact="", command_line="x", sid="not-a-sid", pid="abc"),
        _row("process", "terminate"),
        _row("process", "delete"),                             # not in the model's vocabulary
    ])
    _write(tmp_path, "s", "flow", [
        _row("flow", "start", src_ip="999.example", dest_ip="::1", dest_port="70000")])
    c = carcheck.run(str(tmp_path))
    failed = _failures(c)
    assert any("source_artefact" in line for line in failed)
    assert any("vocabulary" in line for line in failed)
    assert any("Windows SID" in line for line in failed)
    assert any("pid is numeric" in line for line in failed)
    assert any("src_ip" in line for line in failed)
    assert any("dest_port" in line for line in failed)
    assert not any("dest_ip" in line for line in failed)       # ::1 is a valid literal
    assert c.failed == 6


def test_relationship_edges_are_checked(tmp_path):
    _write(tmp_path, "s", "process", [_row("process", "create", command_line="x")])
    _write(tmp_path, "s", "relationships", [
        {"relationship": "created", "source_guid": "a", "target_guid": "", "confidence": "definitive"},
        {"relationship": "", "source_guid": "a", "target_guid": "b", "confidence": "guessed"},
    ])
    c = carcheck.run(str(tmp_path))
    failed = _failures(c)
    assert any("source and target guid" in line for line in failed)
    assert any("verb" in line for line in failed)
    assert any("confidence" in line for line in failed)


def test_empty_tree_fails_preflight_and_main_exits_2(tmp_path):
    c = carcheck.run(str(tmp_path))
    assert c.passed == 0 and c.failed == 2                     # no files, no timeline rows
    assert c.skipped == len(carcheck._OBJECTS) + 1              # every object + relationships
    assert carcheck.main(["--car-dir", str(tmp_path)]) == 2


def test_main_exit_codes(tmp_path, capsys):
    _write(tmp_path, "s", "registry", [_row("registry", "add", key="HKLM\\x")])
    assert carcheck.main(["--car-dir", str(tmp_path)]) == 0
    assert "CAR run-through passed" in capsys.readouterr().out
    _write(tmp_path, "s", "registry", [_row("registry", "add", artefact="")])
    assert carcheck.main(["--car-dir", str(tmp_path)]) == 1
    assert "FAILED" in capsys.readouterr().out


def test_load_rows_spans_sources_and_skips_bad_lines(tmp_path):
    (tmp_path / "a").mkdir()
    (tmp_path / "a" / "car_file.jsonl").write_text('{"guid": "1"}\n\nnot json\n[1, 2]\n')
    (tmp_path / "b").mkdir()
    (tmp_path / "b" / "car_file.jsonl").write_text('{"guid": "2"}\n')
    assert [r["guid"] for r in carcheck.load_rows(str(tmp_path), "file")] == ["1", "2"]
    assert carcheck.load_rows(str(tmp_path), "flow") == []


def test_value_helpers():
    assert carcheck._int("4536") == 4536 and carcheck._int("0x11b8") == 4536
    assert carcheck._int("abc") is None and carcheck._int("") is None
    assert carcheck.empty(None) and carcheck.empty("  ") and not carcheck.empty("0")
    assert carcheck.has_term("piiat_memory_pslist", "memory")
    assert not carcheck.has_term("memoryless", "memory")
