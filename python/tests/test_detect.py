"""Unit tests for the detection orchestrator's pure logic (no emulator needed)."""
import csv
import io
import json

import pytest

from get_sybers_dfir import detect
from get_sybers_dfir.detect import registry


# ---- registry hygiene ------------------------------------------------------
def test_seeded_registry_validates():
    registry.validate()


def test_registry_ids_unique_and_kebab():
    ids = [d["id"] for d in registry.DETECTIONS]
    assert len(ids) == len(set(ids))
    assert all(i == i.lower() and " " not in i for i in ids)


def test_validate_rejects_bad_entries():
    base = {"id": "x-1", "title": "t", "severity": "low", "attack": [],
            "kind": "kusto", "target": "db.T", "requires": ["db.T"], "query": "T"}
    for patch in (
        {"id": "Bad_Case"},
        {"severity": "urgent"},
        {"kind": "sql"},
        {"title": 'has "quotes"'},
        {"requires": ["notdotted"]},
        {"query": "   "},
        {"attack": "T1055"},
    ):
        with pytest.raises(ValueError):
            registry.validate([{**base, **patch}])
    with pytest.raises(ValueError):        # duplicate id
        registry.validate([base, dict(base)])
    with pytest.raises(ValueError):        # jsonl needs a callable match
        registry.validate([{**base, "kind": "jsonl", "subdir": "s", "glob": "*",
                            "match": "not-callable"}])


# ---- kusto command construction -------------------------------------------
def test_kusto_command_wraps_query_with_envelope():
    det = {"id": "x-1", "title": "Ti", "severity": "high", "attack": ["T1", "T2"],
           "target": "host.T", "kind": "kusto", "requires": ["host.T"],
           "query": "database(\"host\").T | project Timestamp, Entity, Details"}
    cmd = detect.kusto_command(det, "RUN1", 50)
    assert cmd.startswith(".set-or-append Detections <|")
    assert "| take 50" in cmd
    assert '"RUN1"' in cmd and '"x-1"' in cmd and '"T1,T2"' in cmd
    # ends with the full envelope projection, in table column order
    assert cmd.splitlines()[-1] == "| project " + ", ".join(detect._COLUMNS)


def test_kql_str_escapes():
    assert detect._kql_str('a"b\\c') == '"a\\"b\\\\c"'


# ---- timestamp normalisation ----------------------------------------------
def test_iso_timestamp_variants():
    # hayabusa: "2018-03-27 12:11:53.899 +00:00"
    assert detect.iso_timestamp("2018-03-27 12:11:53.899 +00:00") == \
        "2018-03-27T12:11:53.899000Z"
    # suricata: legacy +0000 offset without a colon
    assert detect.iso_timestamp("2011-06-18T18:17:15.107810+0000") == \
        "2011-06-18T18:17:15.107810Z"
    # already-UTC Z form and naive form survive
    assert detect.iso_timestamp("2020-01-02T03:04:05Z") == "2020-01-02T03:04:05.000000Z"
    assert detect.iso_timestamp("2020-01-02T03:04:05") == "2020-01-02T03:04:05.000000Z"
    # non-UTC offsets are converted
    assert detect.iso_timestamp("2020-01-02T03:04:05+02:00") == "2020-01-02T01:04:05.000000Z"
    # unparseable / missing stays a Kusto null
    assert detect.iso_timestamp(None) == ""
    assert detect.iso_timestamp("not a time") == ""


# ---- jsonl scanning + CSV shaping ------------------------------------------
def test_scan_jsonl_applies_predicate_and_cap(tmp_path):
    f = tmp_path / "lane.jsonl"
    f.write_text("\n".join(json.dumps({"n": i}) for i in range(10)) + "\nnot json\n")
    hits, bad = detect.scan_jsonl(
        [str(f)], lambda r: {"Entity": str(r["n"]), "Details": r} if r["n"] % 2 == 0 else None,
        limit=3)
    assert [h["Entity"] for h in hits] == ["0", "2", "4"]   # capped at 3
    # the cap stopped the scan before the bad line; without it the line counts
    hits, bad = detect.scan_jsonl([str(f)], lambda r: None, limit=10)
    assert hits == [] and bad == 1


def test_hits_to_csv_column_order_and_dynamic_json():
    det = {"id": "sig-x", "title": "T", "severity": "low", "attack": ["T9"],
           "target": "signatures/x"}
    out = detect.hits_to_csv(det, [{
        "Timestamp": "2020-01-02T03:04:05Z", "Entity": 'host,with"comma',
        "Details": {"k": "v", "path": "C:\\x"},
    }], "RUNZ")
    row = next(csv.reader(io.StringIO(out)))
    assert row[:6] == ["RUNZ", "sig-x", "T", "low", "T9", "signatures/x"]
    assert row[6] == "2020-01-02T03:04:05.000000Z"
    assert row[7] == 'host,with"comma'
    assert json.loads(row[8]) == {"k": "v", "path": "C:\\x"}   # dynamic column
    assert len(row) == len(detect._COLUMNS)


def test_hits_to_csv_attack_ids_are_per_hit():
    # The signature lanes declare no static attack ids, so AttackIds must come
    # from each hit: a hit that parsed its own techniques carries them, a tagless
    # hit stays ''.
    det = {"id": "sig-x", "title": "T", "severity": "low", "attack": [],
           "target": "signatures/x"}
    out = detect.hits_to_csv(det, [
        {"Entity": "a", "Details": {}, "AttackIds": ["T1059.003", "T1204.002"]},
        {"Entity": "b", "Details": {}},                       # no tags -> ''
    ], "RUNZ")
    rows = list(csv.reader(io.StringIO(out)))
    assert rows[0][4] == "T1059.003,T1204.002"                # AttackIds column
    assert rows[1][4] == ""


def test_hits_to_csv_static_attack_is_the_fallback():
    # A hit without its own AttackIds still inherits a detection's static list
    # (kusto detections keep theirs; this keeps jsonl behaviour uniform).
    det = {"id": "x", "title": "T", "severity": "low", "attack": ["T9"],
           "target": "t"}
    out = detect.hits_to_csv(det, [{"Entity": "a", "Details": {}}], "R")
    assert next(csv.reader(io.StringIO(out)))[4] == "T9"


# ---- applicability gating --------------------------------------------------
def test_applicable_kusto_gates_on_presence_and_rows():
    det = {"requires": ["host.A", "network.B"]}
    ok, _ = detect._applicable_kusto(det, {"host.A": 5, "network.B": 1})
    assert ok
    ok, reason = detect._applicable_kusto(det, {"host.A": 5, "network.B": 0})
    assert not ok and "empty" in reason
    ok, reason = detect._applicable_kusto(det, {"host.A": 5})
    assert not ok and "does not exist" in reason


def test_run_id_sortable():
    a, b = detect.new_run_id(), detect.new_run_id()
    assert len(a.split("-")) == 2 and a[:8].isdigit()
    assert max(a, b)[:16] >= min(a, b)[:16]


# ---- seeded jsonl matchers --------------------------------------------------
def test_match_hayabusa_promotes_only_high():
    high = {"Level": "high", "Computer": "PC1", "RuleTitle": "R", "EventID": 1}
    assert registry.match_hayabusa_high(high)["Entity"] == "PC1"
    assert registry.match_hayabusa_high({"Level": "info"}) is None
    assert registry.match_hayabusa_high({}) is None


def test_match_suricata_only_alerts():
    assert registry.match_suricata_alert({"event_type": "flow"}) is None
    hit = registry.match_suricata_alert({
        "event_type": "alert", "src_ip": "1.1.1.1", "dest_ip": "2.2.2.2",
        "dest_port": 80, "alert": {"signature": "SIG", "severity": 1}})
    assert hit["Entity"] == "1.1.1.1 -> 2.2.2.2:80"
    assert hit["Details"]["Signature"] == "SIG"


def test_match_yara_trims_string_data():
    hit = registry.match_yara({
        "tool": "yara", "rule": "R", "target": "t.bin", "source": "file",
        "strings": [{"id": "$a", "offset": 0, "data": "\x00binary"}]})
    assert hit["Details"]["StringIds"] == ["$a"]
    assert "data" not in json.dumps(hit["Details"])
    assert registry.match_yara({"tool": "other", "rule": "R"}) is None


# ---- ATT&CK technique-id propagation (the tag-leak fix) ---------------------
def test_technique_ids_normalises_and_dedupes():
    # canonical dotted upper-case, first-seen order; ET Open underscore form and
    # a plain string both parse; non-technique tags (tactics, software/CAR ids)
    # are dropped; empties yield [].
    assert registry._technique_ids(["t1059.003", "T1204", "t1059_003"]) == \
        ["T1059.003", "T1204"]
    assert registry._technique_ids("attack.t1112, attack.ta0005, S0002, TA0002") == \
        ["T1112"]
    assert registry._technique_ids(None) == [] and registry._technique_ids("") == []
    assert registry._technique_ids("no ids here") == []


def test_match_hayabusa_extracts_mitre_tags():
    hit = registry.match_hayabusa_high({
        "Level": "high", "Computer": "PC1", "RuleTitle": "R",
        "MitreTactics": "Execution", "MitreTags": "T1059.001 ¦ T1204.002"})
    assert hit["AttackIds"] == ["T1059.001", "T1204.002"]
    # a high hit with no MITRE columns simply carries no per-hit tags
    assert "AttackIds" not in registry.match_hayabusa_high(
        {"Level": "high", "Computer": "PC1"})


def test_match_suricata_reads_mitre_technique_id():
    hit = registry.match_suricata_alert({
        "event_type": "alert", "src_ip": "1.1.1.1", "dest_ip": "2.2.2.2",
        "dest_port": 80,
        "alert": {"signature": "SIG", "metadata": {
            "mitre_technique_id": ["t1204"], "mitre_tactic_id": ["TA0002"]}}})
    assert hit["AttackIds"] == ["T1204"]
    # an alert without ATT&CK metadata carries no per-hit tags
    assert "AttackIds" not in registry.match_suricata_alert({
        "event_type": "alert", "alert": {"signature": "SIG"}})


def test_match_yara_reads_meta_attack():
    hit = registry.match_yara({
        "tool": "yara", "rule": "R", "target": "t.bin",
        "meta": {"description": "x", "attack": "T1027"}})
    assert hit["AttackIds"] == ["T1027"]
    # no meta -> no per-hit tags (the lane does not always emit meta)
    assert "AttackIds" not in registry.match_yara(
        {"tool": "yara", "rule": "R", "target": "t.bin"})


# ---- process() error paths (no emulator contact needed) ---------------------
def test_process_unknown_only_id_errors():
    summary = detect.process(only="no-such-detection", dry_run=True)
    assert "unknown detection id" in summary["error"]


def test_process_unreachable_reports(monkeypatch):
    monkeypatch.setattr(detect.KustoClient, "reachable", lambda self: False)
    summary = detect.process(dry_run=True)
    assert "nothing answering" in summary["error"]
