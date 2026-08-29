"""The per-file CAR pipeline: one ingested file -> its own self-contained
database (owner's isolation rule — no cross-source dependence)."""
import json
import os

from get_sybers_dfir.car import pipeline

_SEC = os.path.join(os.path.dirname(__file__), "..", "..",
                    "data_store/processed/windows_logs/lonewolf/Windows/System32/winevt/Logs/Security_EvtxECmd_Output.json")


def test_routing_by_filename():
    assert pipeline.route("Security_EvtxECmd_Output.json") == [
        "evtx_security", "evtx_security_sessions"]
    assert pipeline.route("conn.json") == ["zeek_conn"]
    assert pipeline.route("x.L2tPrefetch") == ["plaso_exec_prefetch"]
    assert pipeline.route("unknown.bin") == []


def test_one_file_one_enriched_db(tmp_path):
    if not os.path.isfile(_SEC):
        import pytest
        pytest.skip("lonewolf evidence absent")
    s = pipeline.process_file(_SEC, str(tmp_path))
    assert s["objects"] == {"authentication": 827, "user_session": 875}
    assert os.path.isfile(tmp_path / "car.db")
    assert os.path.isfile(tmp_path / "car_authentication.jsonl")
    # the in-file LUID join is self-contained and fires for every auth row
    import sqlite3
    c = sqlite3.connect(str(tmp_path / "car.db"))
    linked = c.execute(
        "SELECT COUNT(*) FROM authentication WHERE native LIKE '%session_guid%'").fetchone()[0]
    assert linked == 827
    row = json.loads(open(tmp_path / "car_authentication.jsonl").readline())
    assert row["native"].get("target_session_guid") or row["native"].get("subject_session_guid")
