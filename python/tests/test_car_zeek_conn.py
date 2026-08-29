"""Tests for the Zeek conn.log → CAR flow map (epic #86, Phase 2)."""
import os

import pytest

from get_sybers_dfir.car import normalize, sources

_ZEEK_DIR = os.path.join(os.path.dirname(__file__), "..", "..",
                         "data_store", "processed", "zeek")

# a completed TCP connection, shaped exactly like the processed conn.json rows
_SF = {
    "ts": "2012-07-09T17:50:11.834184Z", "uid": "CtEReq24zLXEGt4V67",
    "id.orig_h": "10.10.1.116", "id.orig_p": 49207,
    "id.resp_h": "172.16.1.20", "id.resp_p": 80,
    "proto": "tcp", "service": "http", "duration": 1.5,
    "orig_bytes": 350, "resp_bytes": 4200, "conn_state": "SF",
    "local_orig": True, "local_resp": False, "missed_bytes": 0,
    "history": "ShADadFf", "orig_pkts": 6, "orig_ip_bytes": 590,
    "resp_pkts": 5, "resp_ip_bytes": 4400, "ip_proto": 6,
}


def test_sf_row_is_flow_end_with_full_fields():
    ev = normalize.normalize("zeek_conn", dict(_SF))
    assert ev["car_object"] == "flow" and ev["car_action"] == "end"
    assert ev["timestamp"] == "2012-07-09T17:50:11.834184Z"   # ISO passthrough
    assert ev["src_ip"] == "10.10.1.116" and ev["src_port"] == 49207
    assert ev["dest_ip"] == "172.16.1.20" and ev["dest_port"] == 80
    assert ev["transport_protocol"] == "tcp"                  # not `protocol`
    assert ev["application_protocol"] == "http"               # zeek service
    assert ev.get("proto_info") is None       # bare service label ≠ extra info
    assert ev["tcp_flags"] == "ShADadFf"                      # zeek history
    assert ev["start_time"] == "2012-07-09T17:50:11.834184Z"


def test_end_time_is_ts_plus_duration_in_same_style():
    ev = normalize.normalize("zeek_conn", dict(_SF))
    assert ev["end_time"] == "2012-07-09T17:50:13.334184Z"    # +1.5s, Z style


def test_byte_direction_src_is_originator():
    ev = normalize.normalize("zeek_conn", dict(_SF))
    assert ev["out_bytes"] == 350     # orig_bytes: payload OUT of src
    assert ev["in_bytes"] == 4200     # resp_bytes: payload INTO src
    # ip-level counters must never leak into the payload-byte columns
    assert 590 not in (ev["out_bytes"], ev["in_bytes"])


def test_packet_count_sums_both_counters():
    ev = normalize.normalize("zeek_conn", dict(_SF))
    assert ev["packet_count"] == 11


def test_guid_is_the_zeek_uid_and_native_keeps_join_keys():
    ev = normalize.normalize("zeek_conn", dict(_SF))
    assert ev["guid"] == "CtEReq24zLXEGt4V67"     # run-scoped connection id
    assert ev["_native"] == {"uid": "CtEReq24zLXEGt4V67", "service": "http",
                             "conn_state": "SF", "missed_bytes": 0}
    # network capture: no host/user/process identity is asserted
    assert ev.get("hostname") is None and ev.get("user") is None
    assert ev.get("pid") is None and ev["owning_pid"] is None
    # model flow.uid is the USER id family field — never the connection id
    assert ev.get("uid") is None


def test_s0_attempt_starts_and_fabricates_nothing():
    rec = {"ts": "2012-07-09T17:50:11.834184Z", "uid": "C3b4Fu37DEw3UFdLvd",
           "id.orig_h": "10.10.1.107", "id.orig_p": 137,
           "id.resp_h": "10.10.1.255", "id.resp_p": 137,
           "proto": "udp", "service": "dns", "conn_state": "S0",
           "missed_bytes": 0, "history": "D",
           "orig_pkts": 1, "orig_ip_bytes": 78,
           "resp_pkts": 0, "resp_ip_bytes": 0, "ip_proto": 17}
    ev = normalize.normalize("zeek_conn", rec)
    assert ev["car_action"] == "start"
    assert ev["end_time"] is None                 # no measured duration
    assert ev["in_bytes"] is None and ev["out_bytes"] is None  # absent ≠ 0
    assert ev["packet_count"] == 1                # counters present: 1 + 0


def test_terminal_and_message_states_follow_the_view_case():
    for state in ("REJ", "RSTO", "RSTR"):
        assert normalize.normalize("zeek_conn", dict(_SF, conn_state=state))[
            "car_action"] == "end"
    for state in ("S1", "S2", "OTH", "RSTRH", "SHR"):
        assert normalize.normalize("zeek_conn", dict(_SF, conn_state=state))[
            "car_action"] == "message"


def test_missing_conn_state_stays_raw():
    rec = dict(_SF)
    del rec["conn_state"]
    assert normalize.normalize("zeek_conn", rec) is None
    assert normalize.normalize("zeek_conn", dict(_SF, conn_state="")) is None


def test_packet_count_null_when_no_counter_present():
    rec = dict(_SF)
    del rec["orig_pkts"], rec["resp_pkts"]
    assert normalize.normalize("zeek_conn", rec)["packet_count"] is None


def test_epoch_seconds_ts_also_supported():
    # raw zeek json (no lane conversion) stamps epoch seconds
    rec = dict(_SF, ts=1341856211.834184)
    ev = normalize.normalize("zeek_conn", rec)
    assert ev["timestamp"].startswith("2012-07-09T17:50:11")
    assert ev["end_time"].startswith("2012-07-09T17:50:13")


@pytest.mark.parametrize("capture,expected_rows", [
    ("ngdc-exterior-2012-07-09_pcap", 5520),
    ("ngdc-interior-2012-07-09_pcap", 1409),
])
def test_real_conn_json_maps_every_row(capture, expected_rows):
    path = os.path.join(_ZEEK_DIR, capture, "conn.json")
    if not os.path.exists(path):
        pytest.skip("real zeek evidence not present")
    events = list(sources.iter_mapped("zeek_conn", path, default_host=capture))
    assert len(events) == expected_rows      # every row carries a conn_state
    assert all(e["car_object"] == "flow" for e in events)
    assert all(e["car_action"] in ("start", "end", "message") for e in events)
    assert all(e["guid"] for e in events)    # zeek always mints a uid
    # a null is honest, a fabricated 0 is not: end_time exists exactly for the
    # rows zeek measured a duration on
    with_duration = sum("duration" in r for r in sources.iter_jsonl(path))
    assert sum(e["end_time"] is not None for e in events) == with_duration
    ends = [e for e in events if e["car_action"] == "end" and e["end_time"]]
    assert ends and all(e["end_time"] >= e["start_time"] for e in ends)
