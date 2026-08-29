"""Zeek smtp -> email (gated) and files -> file, and zeek-as-one-source (epic #86)."""
import json, os
from get_sybers_dfir.car import normalize, pipeline


def test_smtp_starttls_stays_raw_but_content_maps_to_email():
    encrypted = {"ts": 1341856306.0, "uid": "Cs", "trans_depth": 1,
                 "id.orig_h": "10.0.0.5", "id.resp_h": "1.2.3.4",
                 "helo": "mail", "tls": True, "last_reply": "220 ready"}
    assert normalize.normalize("zeek_smtp", encrypted) is None   # no content -> raw
    withmsg = dict(encrypted, mailfrom="a@evil.com", rcptto="v@corp.com",
                   **{"from": "A <a@evil.com>", "to": "v@corp.com"}, subject="hi")
    ev = normalize.normalize("zeek_smtp", withmsg)
    assert ev["car_object"] == "email" and ev["car_action"] == "deliver"
    assert ev["src_address"] == "a@evil.com" and ev["dest_address"] == "v@corp.com"
    assert ev["src_domain"] == "evil.com" and ev["subject"] == "hi"


def test_files_is_network_observed_file_with_mime_and_flow_link():
    rec = {"ts": 1341856306.0, "fuid": "FdEQ", "uid": "Cno6", "source": "HTTP",
           "mime_type": "application/x-dosexec", "seen_bytes": 94208}
    ev = normalize.normalize("zeek_files", rec)
    assert ev["car_object"] == "file" and ev["car_action"] == "create"
    assert ev["guid"] == "file-FdEQ"
    assert ev["mime_type"] == "application/x-dosexec"
    assert ev["file_name"] is None                    # unnamed on the wire -> honest null
    assert ev["_native"]["uid"] == "Cno6"             # ties to its flow (cascade)
    assert ev["_native"]["source"] == "HTTP"
    named = normalize.normalize("zeek_files", dict(rec, filename="evil.exe"))
    assert named["file_name"] == "evil.exe" and named["extension"] == "exe"


def test_zeek_capture_dir_is_one_source_one_db(tmp_path):
    cap = "../data_store/processed/zeek/ngdc-exterior-2012-07-09_pcap"
    if not os.path.isdir(cap):
        import pytest; pytest.skip("zeek evidence absent")
    s = pipeline.process_file(cap, str(tmp_path), default_host="ngdc")
    # ALL zeek logs of the capture -> ONE car.db (flow+http+file; email 0 = STARTTLS)
    assert set(s["artefacts"]) == {"zeek_conn", "zeek_http", "zeek_smtp", "zeek_files"}
    assert s["objects"]["flow"] > 5000 and s["objects"]["http"] > 1000
    assert s["objects"]["file"] > 1000
    assert "email" not in s["objects"]                # all STARTTLS -> honest empty
    assert os.path.isfile(tmp_path / "car.db")
