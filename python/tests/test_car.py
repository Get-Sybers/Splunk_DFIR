"""Unit tests for the DX_DFIR CAR normalization engine (epic #86)."""
import json

from get_sybers_dfir.car import carmodel, enrich, normalize, sources, store

_SEC_4624 = {
    "EventId": 4624, "Channel": "Security", "Computer": "HOST1.example.com",
    "EventRecordId": 14,
    "TimeCreated": "2019-01-28T19:40:32+00:00", "UserName": "x",
    "Payload": json.dumps({"EventData": {"Data": [
        {"@Name": "TargetUserName", "#text": "Steve"},
        {"@Name": "TargetUserSid", "#text": "S-1-5-21-1-2-3-1001"},
        {"@Name": "TargetDomainName", "#text": "DESKTOP-8"},
        {"@Name": "SubjectUserName", "#text": "-"},
        {"@Name": "AuthenticationPackageName", "#text": "Negotiate"},
        {"@Name": "LogonProcessName", "#text": "User32"},
        {"@Name": "WorkstationName", "#text": "DESKTOP-8"},
        {"@Name": "TargetLogonId", "#text": "0x338F0"},
        {"@Name": "ProcessName", "#text": r"C:\Windows\System32\svchost.exe"},
    ]}}),
}


def test_model_is_13_objects():
    assert len(carmodel.load()) == 13
    assert {"authentication", "email", "http", "socket"} <= set(carmodel.objects())


def test_security_4624_is_authentication_success():
    ev = normalize.normalize("evtx_security", _SEC_4624)
    assert ev["car_object"] == "authentication" and ev["car_action"] == "success"
    assert ev["target_user"] == "Steve" and ev["target_uid"] == "S-1-5-21-1-2-3-1001"
    assert ev["method"] == "Negotiate" and ev["auth_service"] == "User32"
    assert ev["hostname"] == "DESKTOP-8"                 # the REQUESTING host
    assert ev["auth_target"] == "HOST1.example.com"      # authenticated TO
    assert ev["source_host"] == "HOST1"                  # scope = first label
    assert ev["user"] is None                            # '-' is an honest blank
    assert ev["guid"].startswith("authentication-HOST1.example.com-Security-")
    assert ev["app_name"] == "svchost.exe"               # basename, per MITRE example
    assert ev["_native"]["TargetLogonId"] == "0x338F0"   # join key surfaced


def test_security_4625_is_failure_with_reason():
    rec = dict(_SEC_4624, EventId=4625)
    rec["Payload"] = json.dumps({"EventData": {"Data": [
        {"@Name": "TargetUserName", "#text": "admin"},
        {"@Name": "FailureReason", "#text": "%%2313"},
    ]}})
    ev = normalize.normalize("evtx_security", rec)
    assert ev["car_action"] == "failure" and ev["decision_reason"] == "%%2313"


def test_non_mapped_security_event_is_dropped():
    assert normalize.normalize("evtx_security", dict(_SEC_4624, EventId=4688)) is None
    # 4648 records an ATTEMPT at issuance — no response exists, so no CAR action
    assert normalize.normalize("evtx_security", dict(_SEC_4624, EventId=4648)) is None


def test_http_limits_hostname_and_url_reconstruction():
    rec = {"ts": "2012-07-09T17:51:46Z", "uid": "Cx", "trans_depth": 1,
           "id.orig_h": "10.0.0.5", "method": "GET", "host": "evil.example.com",
           "uri": "/p?q=1", "version": "1.1", "status_code": 200}
    ev = normalize.normalize("zeek_http", rec)
    assert ev.get("hostname") is None            # vantage, NOT the Host header
    assert ev["url_domain"] == "evil.example.com"
    assert ev["url_scheme"] == "http"
    assert ev["url_full"] == "http://evil.example.com/p?q=1"
    t = normalize.normalize("zeek_http", dict(rec, method="CONNECT"))
    assert t["car_action"] == "tunnel"
    assert t.get("url_full") is None and t.get("url_scheme") is None


def test_auth_session_luid_join_and_failure_never_joins():
    sess = {"car_object": "user_session", "car_action": "login", "guid": "us-1",
            "login_id": "0x338F0", "timestamp": "2019-01-28T19:40:32+00:00",
            "source_host": "HOST1", "_native": {}}
    ok = {"car_object": "authentication", "car_action": "success", "guid": "a1",
          "timestamp": "2019-01-28T19:40:32+00:00", "source_host": "HOST1",
          "_native": {"TargetLogonId": "0x338f0", "SubjectLogonId": "0x3e7"}}
    fail = {"car_object": "authentication", "car_action": "failure", "guid": "a2",
            "timestamp": "2019-01-28T19:41:00+00:00", "source_host": "HOST1",
            "_native": {"TargetLogonId": "0x338f0"}}
    out = enrich.enrich([sess, ok, fail])
    by = {e.get("guid"): e for e in out}
    assert by["a1"]["_native"]["target_session_guid"] == "us-1"
    assert by["a1"]["_native"]["target_session_link"] == "definitive"  # case-normalized
    assert "subject_session_guid" not in by["a1"]["_native"]  # 0x3e7 session absent
    assert "target_session_guid" not in by["a2"]["_native"]   # failure NEVER joins


def test_canonicalization_never_overwrites_native_evidence():
    machine = {"car_object": "authentication", "car_action": "success", "guid": "a3",
               "timestamp": "t", "source_host": "H", "uid": "S-1-5-18",
               "user": "DESKTOP-X$", "_native": {}}
    alias = {"car_object": "user_session", "car_action": "login", "guid": "us-2",
             "timestamp": "t", "source_host": "H", "uid": "S-1-5-18",
             "user": "systemprofile", "login_id": "0x999", "_native": {}}
    out = enrich.enrich([machine, alias])
    by = {e.get("guid"): e for e in out}
    assert by["a3"]["user"] == "DESKTOP-X$"        # native evidence untouched
    assert by["us-2"]["user"] == "Local System"    # alias of the SAME account unified


def test_hex_pid_join():
    proc = {"car_object": "process", "car_action": "create", "guid": "p1",
            "timestamp": "2020-01-01T00:00:10+00:00", "pid": 508,
            "exe": "wininit.exe", "source_host": "H", "_native": {}}
    spoke = {"car_object": "module", "car_action": "load", "guid": "m1",
             "timestamp": "2020-01-01T00:00:20+00:00", "owning_pid": "0x1FC",
             "owning_guid_native": None, "source_host": "H", "_native": {}}
    out = enrich.enrich([proc, spoke])
    m = [e for e in out if e.get("guid") == "m1"][0]
    assert m.get("owning_guid") == "p1"            # 0x1FC == 508
    assert m.get("link_confidence") == "heuristic"


def test_zeek_http_get_and_iso_or_epoch_ts():
    rec = {"ts": "2012-07-09T17:51:46.593202Z", "uid": "Cabc", "trans_depth": 1,
           "id.orig_h": "10.0.0.5", "id.resp_h": "1.2.3.4", "id.orig_p": 1024,
           "id.resp_p": 80, "method": "GET", "host": "www.example.com",
           "uri": "/x?q=1", "version": "1.1", "user_agent": "UA",
           "request_body_len": 0, "response_body_len": 100, "status_code": 200}
    ev = normalize.normalize("zeek_http", rec)
    assert ev["car_object"] == "http" and ev["car_action"] == "get"
    assert ev["timestamp"] == "2012-07-09T17:51:46.593202Z"   # ISO passes through
    assert ev["guid"] == "http-Cabc-1"
    assert ev["url_domain"] == "www.example.com" and ev["response_status_code"] == 200
    ev2 = normalize.normalize("zeek_http", dict(rec, ts=1341856306.5))
    assert ev2["timestamp"].startswith("2012-07-09T")          # epoch converts
    assert normalize.normalize("zeek_http", dict(rec, method="HEAD")) is None


def test_enrich_two_tier_owner_and_inheritance():
    proc = {"car_object": "process", "car_action": "create", "guid": "{sysmon-guid-1}",
            "timestamp": "2020-01-01T00:00:10+00:00", "pid": 10, "ppid": 4,
            "exe": "x.exe", "image_path": r"C:\x.exe", "user": "HOST\\u",
            "source_host": "HOST1", "_native": {}}
    spoke_native = {"car_object": "module", "car_action": "load", "guid": "m1",
                    "timestamp": "2020-01-01T00:00:20+00:00",
                    "owning_guid_native": "{sysmon-guid-1}", "owning_pid": 10,
                    "source_host": "HOST1", "_native": {}}
    spoke_pid = {"car_object": "module", "car_action": "load", "guid": "m2",
                 "timestamp": "2020-01-01T00:00:30+00:00",
                 "owning_guid_native": None, "owning_pid": 10,
                 "source_host": "HOST1", "_native": {}}
    other_host = {"car_object": "module", "car_action": "load", "guid": "m3",
                  "timestamp": "2020-01-01T00:00:30+00:00",
                  "owning_guid_native": None, "owning_pid": 10,
                  "source_host": "HOST2", "_native": {}}
    out = enrich.enrich([proc, spoke_native, spoke_pid, other_host])
    by = {e.get("guid"): e for e in out}
    assert by["m1"].get("owning_guid") == "{sysmon-guid-1}"
    assert by["m1"].get("link_confidence") == "definitive"    # native guid match
    assert by["m1"].get("image_path") == r"C:\x.exe"          # inherited
    assert by["m2"].get("link_confidence") == "heuristic"     # pid window
    assert by["m3"].get("owning_guid") is None                # never across hosts


def test_store_roundtrip_and_jsonl_export(tmp_path):
    ev = normalize.normalize("evtx_security", _SEC_4624)
    st = store.CarStore(str(tmp_path / "car.db"))
    assert st.insert_events(enrich.enrich([ev])) == 1
    assert st.counts() == {"authentication": 1}
    written = st.export_jsonl(str(tmp_path / "json"))
    assert written == {"authentication": 1}
    row = json.loads(open(tmp_path / "json" / "car_authentication.jsonl").readline())
    assert row["car_action"] == "success" and row["target_user"] == "Steve"
    assert row["native"]["EventId"] == 4624                   # dynamic-column ready
    assert "event_id" not in row
    st.close()


def test_piiat_car_passthrough(tmp_path):
    import sqlite3
    src = str(tmp_path / "piiat.db")
    c = sqlite3.connect(src)
    c.execute("CREATE TABLE process (timestamp, car_action, guid, owning_pid, owning_offset,"
              " owning_guid, parent_pid, parent_guid, link_confidence, source_plugin,"
              " source_image, native, pid, exe, hostname)")
    c.execute("INSERT INTO process VALUES ('2019-01-28T19:40:32+00:00','create','proc-a',"
              "NULL,NULL,NULL,4,'proc-b','heuristic','windows.piiat.processes',"
              "'img.dmp','{}',10,'x.exe','DESKTOP-8')")
    c.commit(); c.close()
    events = sources.load_piiat_car(src, "img.dmp")
    assert len(events) == 1
    ev = events[0]
    assert ev["car_object"] == "process" and ev["guid"] == "proc-a"
    assert ev["parent_guid"] == "proc-b"                      # links preserved verbatim
    assert ev["link_confidence"] == "heuristic"
    assert ev["source_artefact"] == "memory/windows.piiat.processes"
    assert ev["source_host"] == "DESKTOP-8"                   # its own hostname wins


def test_security_4672_admin_logon_grabs_role_and_privileges():
    rec = dict(_SEC_4624, EventId=4672)
    rec["Payload"] = json.dumps({"EventData": {"Data": [
        {"@Name": "SubjectUserName", "#text": "SYSTEM"},
        {"@Name": "SubjectUserSid", "#text": "S-1-5-18"},
        {"@Name": "SubjectDomainName", "#text": "NT AUTHORITY"},
        {"@Name": "SubjectLogonId", "#text": "0x3E7"},
        {"@Name": "PrivilegeList", "#text": "SeDebugPrivilege, SeTcbPrivilege"},
    ]}})
    ev = normalize.normalize("evtx_security", rec)
    assert ev["car_object"] == "authentication" and ev["car_action"] == "success"
    assert ev["user_role"] == "administrator"          # 4672 = admin privileges granted
    assert ev["uid"] == "S-1-5-18"
    assert ev["_native"]["SubjectLogonId"] == "0x3E7"  # LUID for the end-cascade
    assert "SeDebugPrivilege" in ev["_native"]["PrivilegeList"]
