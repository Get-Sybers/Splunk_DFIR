"""Unit tests for the signatures lanes' pure parsing logic (no engines needed)."""
import os

from get_sybers_dfir import signatures
from get_sybers_dfir.signatures import hayabusa, suricata, yara


# ---- shared helpers --------------------------------------------------------
def test_clean_name_folds(tmp_path):
    p = tmp_path / "a" / "b.pcap"
    assert signatures.clean_name(str(p), str(tmp_path)) == "a_b.pcap"


def test_list_images(tmp_path):
    (tmp_path / "case.E01").write_bytes(b"x")
    (tmp_path / "m.raw").write_bytes(b"x")
    (tmp_path / "notes.txt").write_bytes(b"x")
    got = [os.path.basename(p) for p in signatures.list_images(str(tmp_path))]
    assert got == ["case.E01", "m.raw"]


# ---- yara text parsing -----------------------------------------------------
def test_parse_yara_text_rule_and_strings():
    raw = (
        "EICAR_Test /scan/samples/eicar.txt\n"
        "0x0:$s1: X5O!P%@AP\n"
        "0x10:$s2: EICAR-STANDARD\n"
        "AnotherRule /scan/samples/eicar.txt\n"
    )
    matches = yara.parse_yara_text(raw, "file", "/scan/", "other_raw_data")
    assert len(matches) == 2
    first = matches[0]
    assert first["rule"] == "EICAR_Test"
    assert first["source"] == "file"
    assert first["target"] == "samples/eicar.txt"
    assert first["match"] == os.path.join("other_raw_data", "samples/eicar.txt")
    assert first["strings"][0] == {"id": "$s1", "offset": 0, "data": "X5O!P%@AP"}
    assert first["strings"][1]["offset"] == 16
    assert matches[1]["rule"] == "AnotherRule" and matches[1]["strings"] == []


def test_parse_yara_text_ignores_malformed():
    assert yara.parse_yara_text("", "file", "/scan/", "b") == []
    assert yara.parse_yara_text("justoneword\n", "file", "/scan/", "b") == []


def test_parse_vadyarascan():
    lines = (
        '{"Rule": "Cobalt", "PID": 123, "Process": "evil.exe", "Offset": 4096, "Value": "MZ"}\n'
        '{"nope": 1}\n'
        'garbage\n'
    )
    got = yara.parse_vadyarascan(lines, "mem/dump.raw")
    assert len(got) == 1
    assert got[0] == {
        "tool": "yara", "source": "memory", "rule": "Cobalt", "pid": 123,
        "process": "evil.exe", "offset": 4096, "value": "MZ",
        "target": "mem/dump.raw", "match": "mem/dump.raw",
    }


# ---- suricata EVE filtering ------------------------------------------------
def test_filter_eve_keeps_wanted_and_annotates():
    stream = (
        '{"event_type": "alert", "alert": {"signature": "ET X"}}\n'
        '{"event_type": "stats", "x": 1}\n'          # dropped
        '{"event_type": "dns", "dns": {}}\n'
        'not-json\n'
    )
    got = suricata.filter_eve(stream, "raw/pcaps/a.pcap")
    assert [e["event_type"] for e in got] == ["alert", "dns"]
    assert all(e["source_pcap"] == "raw/pcaps/a.pcap" and e["tool"] == "suricata" for e in got)


def test_filter_eve_keep_all():
    stream = '{"event_type": "stats"}\n{"event_type": "alert"}\n'
    assert len(suricata.filter_eve(stream, "p", keep_all=True)) == 2


# ---- hayabusa tagging ------------------------------------------------------
def test_tag_detections():
    raw = '{"RuleTitle": "Susp Logon", "Level": "high"}\ngarbage\n{"RuleTitle": "X"}\n'
    got = hayabusa.tag_detections(raw)
    assert len(got) == 2
    assert all(d["tool"] == "hayabusa" for d in got)
    assert got[0]["RuleTitle"] == "Susp Logon"


def test_find_binary(tmp_path):
    assert hayabusa.find_binary(str(tmp_path)) is None
    b = tmp_path / "hayabusa-3.4.0-lin"
    b.write_bytes(b"#!/bin/sh\n")
    os.chmod(b, 0o755)
    (tmp_path / "hayabusa.zip").write_bytes(b"zip")   # ignored
    assert hayabusa.find_binary(str(tmp_path)) == str(b)


# ---- orchestrator ----------------------------------------------------------
def test_process_no_rules_no_pcaps_is_clean(tmp_path):
    repo = tmp_path
    (repo / "data_store").mkdir()
    s = signatures.process(str(tmp_path / "out"), repo_root=str(repo))
    assert s["tool"] == "signatures"
    assert s["processed"] == 0 and s["failed"] == 0
    assert set(s["results"]) == {"yara", "suricata", "hayabusa"}
