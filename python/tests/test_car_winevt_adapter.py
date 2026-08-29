"""Plaso winevt(x) -> EvtxECmd-shape adapter -> the ported winevtx CAR maps (epic #86)."""
from get_sybers_dfir.car import winevt_adapter, normalize


def _wrapped(eid, strings, ts="2018-03-27T12:11:42.0Z",
             xml="<Event><System><Channel>Security</Channel>"
                 "<Computer>WIN-1M3263ACE5D</Computer></System></Event>"):
    return {"SourceImage": "LoneWolf.E01", "Timestamp": ts, "Parser": "winevtx",
            "Record": {"data_type": "windows:evtx:record", "event_identifier": eid,
                       "strings": strings, "xml_string": xml,
                       "source_name": "Microsoft-Windows-Security-Auditing",
                       "record_number": 2623, "hostname": "WIN-1M3263ACE5D"}}


def test_adapt_4688_to_evtxecmd_shape_then_process_map():
    # real LoneWolf 4688 positional strings
    strings = ["S-1-5-18", "-", "-", "0x00000000000003e7", "0x0000000000000174",
               r"C:\Windows\System32\smss.exe", "%%1936", "0x0000000000000004",
               None, "S-1-0-0", "-", "-", "0x0000000000000000", None, "S-1-16-16384"]
    shaped = winevt_adapter.adapt(_wrapped(4688, strings))
    assert shaped["EventId"] == 4688 and shaped["Channel"] == "Security"
    assert shaped["Computer"] == "WIN-1M3263ACE5D"
    # the SAME evtx_process map that handles EvtxECmd output consumes it
    ev = normalize.normalize("evtx_process", shaped)
    assert ev["car_object"] == "process" and ev["car_action"] == "create"
    assert ev["pid"] == 0x174 and ev["ppid"] == 4          # positional -> named -> hex_int
    assert ev["exe"] == "smss.exe" and ev["integrity_level"] == "system"
    assert ev["sid"] == "S-1-5-18"                          # null-target -> Subject


def test_adapt_4624_and_4672_feed_auth_and_session_maps():
    s4624 = ["S-1-5-18", "WIN$", "WORKGROUP", "0x3e7", "S-1-5-21-1-1-1-1001",
             "jcloudy", "DESKTOP-8", "0x16bebd", "2", "User32", "Negotiate",
             "DESKTOP-8", "{0}", "-", "-", "0", "0x238",
             r"C:\Windows\System32\lsass.exe", "10.0.0.9", "445"]
    shaped = winevt_adapter.adapt(_wrapped(4624, s4624))
    auth = normalize.normalize("evtx_security", shaped)
    assert auth["car_object"] == "authentication" and auth["target_user"] == "jcloudy"
    assert auth["_native"]["TargetLogonId"] == "0x16bebd"   # join key surfaced
    sess = normalize.normalize("evtx_security_sessions", shaped)
    assert sess["car_object"] == "user_session" and sess["car_action"] == "login"
    assert sess["login_type"] == "interactive"             # LogonType 2
    admin = normalize.normalize("evtx_security",
                                winevt_adapter.adapt(_wrapped(4672, ["S-1-5-18", "SYSTEM", "NT AUTHORITY", "0x3e7", "SeDebugPrivilege"])))
    assert admin["user_role"] == "administrator"


def test_adapt_unmapped_eventid_is_none():
    assert winevt_adapter.adapt(_wrapped(4907, ["x"])) is None   # no CAR layout -> raw
