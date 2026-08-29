"""Tests for the evtx_windows CAR maps: Security logon sessions → user_session,
System 7045 / Security 4697 → service (epic #86, port of CarUserSession_Security
and CarService_Evtx from kusto/schema/40-mitre.kql).

Real-evidence verification runs over the lonewolf EvtxECmd exports where they
exist (Security: 4624/4634/4647; System: 7045). 4778/4779 (RDP reconnect/
disconnect) and 4697 do NOT occur in the real evidence — those variants are
verified with synthetic rows shaped exactly like EvtxECmd output.
"""
import collections
import json
import os

import pytest

from get_sybers_dfir.car import normalize, sources

_EVIDENCE = ("/opt/github/DX_DFIR/data_store/processed/windows_logs/lonewolf"
             "/Windows/System32/winevt/Logs")
_SECURITY = os.path.join(_EVIDENCE, "Security_EvtxECmd_Output.json")
_SYSTEM = os.path.join(_EVIDENCE, "System_EvtxECmd_Output.json")


def _evtx(event_id, channel, data, **cols):
    """A synthetic record shaped exactly like an EvtxECmd JSON row."""
    rec = {"EventId": event_id, "Channel": channel,
           "Computer": "WIN-1M3263ACE5D", "EventRecordId": "1234",
           "TimeCreated": "2018-03-27T12:11:45.4997252+00:00",
           "Payload": json.dumps({"EventData": {"Data": [
               {"@Name": k, "#text": v} for k, v in data.items()]}})}
    rec.update(cols)
    return rec


# --- user_session: 4624 login family ----------------------------------------

_4624_DATA = {
    "SubjectUserSid": "S-1-5-18", "SubjectUserName": "WIN-1M3263ACE5D$",
    "SubjectDomainName": "WORKGROUP", "SubjectLogonId": "0x3E7",
    "TargetUserSid": "S-1-5-21-2734969515-1644526556-1039763013-1000",
    "TargetUserName": "defaultuser0", "TargetDomainName": "DESKTOP-PM6C56D",
    "TargetLogonId": "0x18846", "LogonType": "2",
    "LogonProcessName": "User32", "AuthenticationPackageName": "Negotiate",
    "WorkstationName": "WIN-1M3263ACE5D", "ProcessId": "0x1FC",
    "IpAddress": "-", "IpPort": "-",
}


def test_4624_interactive_login():
    ev = normalize.normalize("evtx_security_sessions", _evtx(4624, "Security", _4624_DATA))
    assert ev["car_object"] == "user_session" and ev["car_action"] == "login"
    assert ev["login_type"] == "interactive"                 # LogonType 2
    assert ev["login_successful"] is True                    # the event's own assertion
    assert ev["user"] == "defaultuser0"
    assert ev["uid"] == "S-1-5-21-2734969515-1644526556-1039763013-1000"
    assert ev["login_id"] == "0x18846"                       # the LUID join key
    assert ev["hostname"] == "WIN-1M3263ACE5D"
    assert ev["src_ip"] is None and ev["src_port"] is None   # "-" is a blank
    assert ev["owning_pid"] == "0x1FC"                       # hex, enrich parses it
    assert ev["guid"] == "user_session-WIN-1M3263ACE5D-Security-1234"
    # join keys / non-canonical detail surfaced into _native, never canonical
    assert ev["_native"]["SubjectLogonId"] == "0x3E7"
    assert ev["_native"]["LogonType"] == "2"
    assert ev["_native"]["WorkstationName"] == "WIN-1M3263ACE5D"


def test_4624_login_type_vocabulary():
    # LogonType 3 → remote; 10 → rdp; unlisted ints (0/5/11/...) → honest null
    for lt, expected in (("3", "remote"), ("10", "rdp"), ("0", None),
                         ("5", None), ("11", None)):
        ev = normalize.normalize("evtx_security_sessions",
                                 _evtx(4624, "Security", dict(_4624_DATA, LogonType=lt)))
        assert ev["car_action"] == "login" and ev["login_type"] == expected, lt


def test_4624_logon_type_7_is_unlock_action_not_a_type():
    # LogonType 7 = "workstation was unlocked": the canonical unlock ACTION.
    # login_type stays null — unlock relogons occur on console AND rdp alike.
    ev = normalize.normalize("evtx_security_sessions",
                             _evtx(4624, "Security", dict(_4624_DATA, LogonType="7")))
    assert ev["car_action"] == "unlock" and ev["login_type"] is None
    assert ev["login_successful"] is True


def test_4624_network_logon_src_endpoint():
    data = dict(_4624_DATA, LogonType="3", IpAddress="10.0.0.9", IpPort="49731")
    ev = normalize.normalize("evtx_security_sessions", _evtx(4624, "Security", data))
    assert ev["src_ip"] == "10.0.0.9" and ev["src_port"] == "49731"
    # loopback origins carry no origin information — nulled per the view
    for ip in ("127.0.0.1", "::1"):
        ev = normalize.normalize("evtx_security_sessions",
                                 _evtx(4624, "Security", dict(data, IpAddress=ip)))
        assert ev["src_ip"] is None, ip
    # port "0" means no port
    ev = normalize.normalize("evtx_security_sessions",
                             _evtx(4624, "Security", dict(data, IpPort="0")))
    assert ev["src_port"] is None


# --- user_session: logout family (4634/4647 real; 4779 synthetic) ------------

def test_4634_and_4647_are_logout():
    data = {"TargetUserSid": "S-1-5-21-1-2-3-1000", "TargetUserName": "defaultuser0",
            "TargetDomainName": "DESKTOP-PM6C56D", "TargetLogonId": "0x18846",
            "LogonType": "2"}
    ev = normalize.normalize("evtx_security_sessions", _evtx(4634, "Security", data))
    assert ev["car_action"] == "logout" and ev["login_id"] == "0x18846"
    assert ev["login_type"] == "interactive"     # the session that ended was one
    assert ev.get("login_successful") is None    # a logoff records no login decision
    del data["LogonType"]                        # 4647 carries no LogonType
    ev = normalize.normalize("evtx_security_sessions", _evtx(4647, "Security", data))
    assert ev["car_action"] == "logout" and ev["login_type"] is None


def test_4779_disconnect_is_logout_with_477x_field_names():
    """SYNTHETIC — no 4779 in the real evidence. 4778/4779 carry AccountName/
    LogonID/ClientAddress instead of the 4624-family names; a disconnect has no
    canonical CAR action, logout is the nearest honest label (per the view)."""
    data = {"AccountName": "jcloudy", "AccountDomain": "DESKTOP-PM6C56D",
            "LogonID": "0x2A5E1", "SessionName": "RDP-Tcp#1",
            "ClientName": "ATTACKER-PC", "ClientAddress": "192.168.1.50"}
    ev = normalize.normalize("evtx_security_sessions", _evtx(4779, "Security", data))
    assert ev["car_object"] == "user_session" and ev["car_action"] == "logout"
    assert ev["user"] == "jcloudy" and ev["login_id"] == "0x2A5E1"
    assert ev["src_ip"] == "192.168.1.50"
    assert ev["uid"] is None                     # 4779 carries no SID: honest null
    assert ev["_native"]["ClientName"] == "ATTACKER-PC"
    assert ev["_native"]["SessionName"] == "RDP-Tcp#1"


def test_4778_reconnect_and_local_console_address():
    """SYNTHETIC — no 4778 in the real evidence."""
    data = {"AccountName": "jcloudy", "LogonID": "0x2A5E1",
            "SessionName": "Console", "ClientName": "WIN-1M3263ACE5D",
            "ClientAddress": "LOCAL"}
    ev = normalize.normalize("evtx_security_sessions", _evtx(4778, "Security", data))
    assert ev["car_action"] == "reconnect"
    assert ev["src_ip"] is None                  # "LOCAL" is not an IP — nulled
    ev = normalize.normalize("evtx_security_sessions",
                             _evtx(4778, "Security", dict(data, ClientAddress="10.4.4.4")))
    assert ev["src_ip"] == "10.4.4.4"


# --- user_session: what must NOT map -----------------------------------------

def test_failures_and_non_session_events_stay_raw():
    # 4625: a FAILED logon opens no session; 4648: issuance, no outcome;
    # 4800/4801 lock events are outside this artefact's scope; wrong channel.
    for eid in (4625, 4648, 4688, 4800, 4801):
        assert normalize.normalize("evtx_security_sessions",
                                   _evtx(eid, "Security", _4624_DATA)) is None, eid
    assert normalize.normalize("evtx_security_sessions",
                               _evtx(4624, "System", _4624_DATA)) is None


# --- service: 7045 (real) / 4697 (synthetic) ---------------------------------

def test_7045_service_create():
    data = {"ServiceName": "EvilSvc",
            "ImagePath": "C:\\Windows\\system32\\svchost.exe -k netsvcs",
            "ServiceType": "user mode service", "StartType": "auto start",
            "AccountName": "LocalSystem"}
    ev = normalize.normalize("evtx_services",
                             _evtx(7045, "System", data, UserId="S-1-5-18"))
    assert ev["car_object"] == "service" and ev["car_action"] == "create"
    assert ev["name"] == "EvilSvc"
    # audit fix: ImagePath can embed arguments — command_line keeps the verbatim
    # string; image_path parses the executable path out; exe is its basename (
    # unquoted paths with spaces make that parse unprovable)
    assert ev["image_path"] == "C:\\Windows\\system32\\svchost.exe"
    assert ev["exe"] == "svchost.exe"
    assert ev["command_line"] == "C:\\Windows\\system32\\svchost.exe -k netsvcs"
    assert ev["user"] == "LocalSystem"
    assert ev["hostname"] == "WIN-1M3263ACE5D"
    assert ev["fqdn"] is None                    # NetBIOS name is not an fqdn
    assert ev.get("pid") is None                 # install event: no running pid
    assert ev["_native"]["StartType"] == "auto start"
    assert ev["_native"]["ServiceType"] == "user mode service"
    assert ev["guid"] == "service-WIN-1M3263ACE5D-System-1234"


def test_4697_service_create_field_names():
    """SYNTHETIC — no 4697 in the real evidence. 4697 names the same facts
    differently: ServiceFileName/ServiceAccount/ServiceStartType."""
    data = {"SubjectUserSid": "S-1-5-21-1-2-3-1000", "SubjectUserName": "jcloudy",
            "SubjectDomainName": "DESKTOP-PM6C56D", "SubjectLogonId": "0x2A5E1",
            "ServiceName": "PwnSvc", "ServiceFileName": "C:\\Tools\\pwn.exe",
            "ServiceType": "0x10", "ServiceStartType": "2",
            "ServiceAccount": "LocalSystem"}
    ev = normalize.normalize("evtx_services", _evtx(4697, "Security", data))
    assert ev["car_action"] == "create" and ev["name"] == "PwnSvc"
    assert ev["image_path"] == "C:\\Tools\\pwn.exe" and ev["exe"] == "pwn.exe"
    assert ev["command_line"] == "C:\\Tools\\pwn.exe"
    assert ev["user"] == "LocalSystem"           # the run-as account, NOT the installer
    assert ev["_native"]["SubjectLogonId"] == "0x2A5E1"   # installer LUID join key
    assert ev["_native"]["StartType"] == "2"


def test_service_fqdn_when_computer_is_one():
    data = {"ServiceName": "S", "ImagePath": "C:\\x.exe"}
    ev = normalize.normalize("evtx_services",
                             _evtx(7045, "System", data, Computer="HOST1.example.com"))
    assert ev["fqdn"] == "HOST1.example.com" and ev["hostname"] == "HOST1"


def test_service_wrong_channel_and_ids_stay_raw():
    data = {"ServiceName": "S", "ImagePath": "C:\\x.exe"}
    assert normalize.normalize("evtx_services", _evtx(7045, "Security", data)) is None
    assert normalize.normalize("evtx_services", _evtx(4697, "System", data)) is None
    assert normalize.normalize("evtx_services", _evtx(7036, "System", data)) is None


# --- real evidence (lonewolf) ------------------------------------------------

@pytest.mark.skipif(not os.path.exists(_SECURITY), reason="lonewolf evidence absent")
def test_real_security_sessions():
    evs = list(sources.iter_mapped("evtx_security_sessions", _SECURITY))
    assert len(evs) == 875                       # 827×4624 + 45×4634 + 3×4647
    actions = collections.Counter(e["car_action"] for e in evs)
    assert actions == {"login": 827, "logout": 48}
    assert all(e["car_object"] == "user_session" for e in evs)
    assert all(e["login_id"] for e in evs)       # the LUID join key: always present
    assert all(e["uid"] for e in evs)            # 4624-family always carries the SID
    types = collections.Counter(e.get("login_type") for e in evs)
    assert types["interactive"] == 114           # the rest (LogonType 0/5/...) honest null
    logins = [e for e in evs if e["car_action"] == "login"]
    assert all(e["login_successful"] is True for e in logins)
    assert all(e["owning_pid"] for e in logins)  # hex ProcessId, every 4624
    assert len({e["guid"] for e in evs}) == len(evs)   # identity is per-record


@pytest.mark.skipif(not os.path.exists(_SYSTEM), reason="lonewolf evidence absent")
def test_real_system_services():
    evs = list(sources.iter_mapped("evtx_services", _SYSTEM))
    assert len(evs) == 57                        # every System 7045
    assert all(e["car_object"] == "service" and e["car_action"] == "create"
               for e in evs)
    # audit fix: image_path is the parsed executable path, exe its basename,
    # command_line the verbatim ImagePath (which may embed arguments)
    assert all(e["name"] and e["image_path"] and e["command_line"]
               and "\\" not in e["exe"] for e in evs)
    assert len({e["guid"] for e in evs}) == len(evs)


@pytest.mark.skipif(not os.path.exists(_SECURITY), reason="lonewolf evidence absent")
def test_real_cross_feed_yields_nothing_wrong():
    # the Security file holds no 4697 in this evidence; the System file holds
    # no session events — cross-feeding drops everything instead of mis-mapping
    assert list(sources.iter_mapped("evtx_services", _SECURITY)) == []
    assert list(sources.iter_mapped("evtx_security_sessions", _SYSTEM)) == []


def _sec_4688(**over):
    import json
    data = [
        {"@Name": "SubjectUserSid", "#text": "S-1-5-18"},
        {"@Name": "SubjectUserName", "#text": "WIN-ABC$"},
        {"@Name": "SubjectLogonId", "#text": "0x3E7"},
        {"@Name": "NewProcessId", "#text": "0x150"},
        {"@Name": "NewProcessName", "#text": r"C:\Windows\System32\smss.exe"},
        {"@Name": "TokenElevationType", "#text": "%%1936"},
        {"@Name": "ProcessId", "#text": "0x4"},
        {"@Name": "CommandLine", "#text": None},
        {"@Name": "TargetUserSid", "#text": "S-1-0-0"},
        {"@Name": "TargetUserName", "#text": "-"},
        {"@Name": "ParentProcessName", "#text": r"C:\Windows\System32\wininit.exe"},
        {"@Name": "MandatoryLabel", "#text": "S-1-16-16384"},
    ]
    rec = {"EventId": 4688, "Channel": "Security", "Computer": "WIN-ABC",
           "EventRecordId": 9, "TimeCreated": "2018-03-27T12:11:42+00:00",
           "Payload": json.dumps({"EventData": {"Data": data}})}
    rec.update(over)
    return rec


def test_sec_4688_is_process_create():
    from get_sybers_dfir.car import normalize
    ev = normalize.normalize("evtx_process", _sec_4688())
    assert ev["car_object"] == "process" and ev["car_action"] == "create"
    assert ev["pid"] == 336 and ev["ppid"] == 4          # NewProcessId=0x150, parent=ProcessId
    assert ev["exe"] == "smss.exe" and ev["image_path"] == r"C:\Windows\System32\smss.exe"
    assert ev["parent_exe"] == "wininit.exe"
    assert ev["integrity_level"] == "system"             # S-1-16-16384
    assert ev["sid"] == "S-1-5-18"                        # Target is the NULL SID -> Subject
    assert ev["user"] == "WIN-ABC$"                       # Target "-" -> Subject
    assert ev["command_line"] is None                    # cmdline auditing off — honest null
    assert ev["parent_pid"] == "0x4"                     # raw for enrich's hex-aware join
    assert ev["_native"]["SubjectLogonId"] == "0x3E7"    # process -> user_session key
    # a process running AS a distinct target user keeps that user, not the creator
    ev2 = normalize.normalize("evtx_process", _sec_4688(Payload=__import__("json").dumps(
        {"EventData": {"Data": [
            {"@Name": "SubjectUserSid", "#text": "S-1-5-18"},
            {"@Name": "NewProcessId", "#text": "0x10"}, {"@Name": "ProcessId", "#text": "0x4"},
            {"@Name": "NewProcessName", "#text": r"C:\x.exe"},
            {"@Name": "TargetUserSid", "#text": "S-1-5-21-1-1-1-1001"},
            {"@Name": "TargetUserName", "#text": "alice"}]}})))
    assert ev2["user"] == "alice" and ev2["sid"] == "S-1-5-21-1-1-1-1001"


def test_sec_4688_not_claimed_by_other_evtx_maps():
    from get_sybers_dfir.car import normalize
    assert normalize.normalize("evtx_security", _sec_4688()) is None       # not auth
    assert normalize.normalize("evtx_security_sessions", _sec_4688()) is None
    assert normalize.normalize("evtx_services", _sec_4688()) is None


def _sec_4688(**over):
    import json as _json
    data = [
        {"@Name": "SubjectUserSid", "#text": "S-1-5-18"},
        {"@Name": "SubjectUserName", "#text": "-"},
        {"@Name": "SubjectLogonId", "#text": "0x3E7"},
        {"@Name": "NewProcessId", "#text": "0x150"},
        {"@Name": "NewProcessName", "#text": r"C:\Windows\System32\smss.exe"},
        {"@Name": "TokenElevationType", "#text": "%%1936"},
        {"@Name": "ProcessId", "#text": "0x4"},
        {"@Name": "CommandLine", "#text": None},
        {"@Name": "TargetUserSid", "#text": "S-1-0-0"},
        {"@Name": "TargetUserName", "#text": "-"},
        {"@Name": "MandatoryLabel", "#text": "S-1-16-16384"},
    ]
    rec = {"EventId": 4688, "Channel": "Security", "Computer": "WIN-1M3263ACE5D",
           "EventRecordId": 9, "TimeCreated": "2018-03-27T12:11:42+00:00",
           "Payload": _json.dumps({"EventData": {"Data": data}})}
    rec.update(over)
    return rec


def test_sec_4688_is_process_create():
    from get_sybers_dfir.car import normalize
    ev = normalize.normalize("evtx_process", _sec_4688())
    assert ev["car_object"] == "process" and ev["car_action"] == "create"
    assert ev["pid"] == 0x150 and ev["ppid"] == 4        # NewProcessId / ProcessId(parent), hex->int
    assert ev["exe"] == "smss.exe"
    assert ev["image_path"] == r"C:\Windows\System32\smss.exe"
    assert ev["integrity_level"] == "system"             # S-1-16-16384
    assert ev["sid"] == "S-1-5-18"                       # null-target falls through to Subject
    assert ev["command_line"] is None                    # not audited -> honest null
    assert ev["_native"]["SubjectLogonId"] == "0x3E7"    # process -> session join key
    assert ev["source_host"] == "WIN-1M3263ACE5D"
    # a real runas: Target names a different user -> that wins
    import json as _json
    runas = _sec_4688()
    runas["Payload"] = _json.dumps({"EventData": {"Data": [
        {"@Name": "NewProcessId", "#text": "0x200"},
        {"@Name": "NewProcessName", "#text": r"C:\tmp\x.exe"},
        {"@Name": "ProcessId", "#text": "0x150"},
        {"@Name": "SubjectUserSid", "#text": "S-1-5-18"},
        {"@Name": "TargetUserSid", "#text": "S-1-5-21-1-2-3-1001"},
        {"@Name": "TargetUserName", "#text": "alice"},
    ]}})
    r2 = normalize.normalize("evtx_process", runas)
    assert r2["user"] == "alice" and r2["sid"] == "S-1-5-21-1-2-3-1001"


def test_sec_4688_not_claimed_by_other_evtx_maps():
    from get_sybers_dfir.car import normalize
    # a 4688 is a process, not a session/service/auth
    assert normalize.normalize("evtx_security_sessions", _sec_4688()) is None
    assert normalize.normalize("evtx_services", _sec_4688()) is None
