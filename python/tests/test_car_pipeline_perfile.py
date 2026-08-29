"""The per-file CAR pipeline: one ingested file -> its own self-contained
database (owner's isolation rule — no cross-source dependence)."""
import json
import os

from get_sybers_dfir.car import pipeline

_SEC = os.path.join(os.path.dirname(__file__), "..", "..",
                    "data_store/processed/windows_logs/lonewolf/Windows/System32/winevt/Logs/Security_EvtxECmd_Output.json")


def test_routing_by_filename():
    # EvtxECmd is content-routed: any *_EvtxECmd_Output.json feeds the whole
    # evtx family; each map's (Channel, EventId) predicate decides its rows
    assert pipeline.route("Security_EvtxECmd_Output.json") == pipeline.EVTX_MAPS
    assert "evtx_process" in pipeline.EVTX_MAPS
    assert pipeline.route("conn.json") == ["zeek_conn"]
    assert pipeline.route("x.L2tPrefetch") == ["plaso_exec_prefetch"]
    assert pipeline.route("unknown.bin") == []


def test_one_file_one_enriched_db(tmp_path):
    if not os.path.isfile(_SEC):
        import pytest
        pytest.skip("lonewolf evidence absent")
    s = pipeline.process_file(_SEC, str(tmp_path))
    assert s["objects"] == {"authentication": 1616, "process": 40, "user_session": 875}
    assert os.path.isfile(tmp_path / "car.db")
    assert os.path.isfile(tmp_path / "car_authentication.jsonl")
    # the in-file LUID join is self-contained and fires for every auth row
    import sqlite3
    c = sqlite3.connect(str(tmp_path / "car.db"))
    linked = c.execute(
        "SELECT COUNT(*) FROM authentication WHERE native LIKE '%session_guid%'").fetchone()[0]
    assert linked == 1616   # 4624 (target LUID) + 4672 (subject LUID) all cascade-linked
    row = json.loads(open(tmp_path / "car_authentication.jsonl").readline())
    assert row["native"].get("target_session_guid") or row["native"].get("subject_session_guid")


def test_batch_discovery_and_isolation(tmp_path):
    import json as _json
    from get_sybers_dfir.car import pipeline
    # a mini processed tree: one evtx host dir + one zeek capture dir
    (tmp_path / "windows_logs" / "hostA").mkdir(parents=True)
    (tmp_path / "windows_logs" / "hostA" / "Security_EvtxECmd_Output.json").write_text(
        _json.dumps({"EventId": 4624, "Channel": "Security", "Computer": "HOSTA",
                     "EventRecordId": 1, "TimeCreated": "2020-01-01T00:00:00Z",
                     "Payload": _json.dumps({"EventData": {"Data": [
                         {"@Name": "TargetUserName", "#text": "alice"},
                         {"@Name": "TargetLogonId", "#text": "0x111"}]}})}) + "\n")
    (tmp_path / "zeek" / "cap1").mkdir(parents=True)
    (tmp_path / "zeek" / "cap1" / "conn.json").write_text(_json.dumps(
        {"ts": "2020-01-01T00:00:01Z", "uid": "C1", "id.orig_h": "10.0.0.1",
         "id.orig_p": 1, "id.resp_h": "10.0.0.2", "id.resp_p": 80,
         "proto": "tcp", "conn_state": "SF"}) + "\n")
    srcs = {n for n, _p, _h in pipeline.discover_sources(str(tmp_path))}
    assert srcs == {"windows_logs_hostA", "zeek_cap1"}
    out = tmp_path / "car"
    results = pipeline.run_batch(str(tmp_path), str(out))
    assert all("error" not in r for r in results)
    # ISOLATION: each source got its OWN car.db
    assert (out / "windows_logs_hostA" / "car.db").is_file()
    assert (out / "zeek_cap1" / "car.db").is_file()
    # idempotent: second run skips both
    again = pipeline.run_batch(str(tmp_path), str(out))
    assert all(r.get("skipped") == "exists" for r in again)
