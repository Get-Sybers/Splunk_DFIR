"""Tests for the Sysmon (EvtxECmd) CAR mapping — epic #86 Phase 2.

Synthetic rows are shaped EXACTLY like EvtxECmd's Sysmon output (payload keys
copied from the real files under
data_store/processed/windows_logs/sysmon-attack-samples/); a final test runs
the map over that real evidence where present. EID 23 (FileDelete) has NO real
sample in the data_store — its coverage here is synthetic only.
"""
import glob
import json
import os

import pytest

from get_sybers_dfir.car import enrich, normalize, sources

_SAMPLES = os.path.join(os.path.dirname(__file__), "..", "..", "data_store",
                        "processed", "windows_logs", "sysmon-attack-samples")


def _rec(eid, data, computer="IEWIN7", record_id="4857"):
    """One EvtxECmd-shaped Sysmon record with the given payload dict."""
    return {
        "Computer": computer, "Channel": "Microsoft-Windows-Sysmon/Operational",
        "Provider": "Microsoft-Windows-Sysmon", "EventId": eid,
        "EventRecordId": record_id, "TimeCreated": "2019-05-26T04:01:42+00:00",
        "UserName": "IEWIN7\\IEUser", "SourceFile": "x.evtx",
        "Payload": json.dumps({"EventData": {"Data": [
            {"@Name": k, "#text": v} for k, v in data.items()]}}),
    }


_GUID = "365abb72-0fa6-5cea-0000-001049b50a00"
_PGUID = "365abb72-0f32-5cea-0000-0010b5460100"
_HASHES = ("SHA1=8CC66ED54FBEFF205151898D65F6415400124553,"
           "MD5=64FDBD98584331982A15B1F2DF7F08DA,"
           "SHA256=B5DE10A0091B7AAF491BDB810BCE6DAB3F6B4A1C7A917722B5DE014E4A08B6EB,"
           "IMPHASH=D3310CE6CBCACB3A9F0809BC33E38ABE")


def test_eid1_process_create_full_extraction():
    ev = normalize.normalize("evtx_sysmon", _rec(1, {
        "UtcTime": "2019-05-26 04:01:42.375", "ProcessGuid": _GUID,
        "ProcessId": "3836", "Image": r"C:\Users\IEUser\Desktop\jjs.exe",
        "CommandLine": '"C:\\Users\\IEUser\\Desktop\\jjs.exe" ',
        "CurrentDirectory": r"C:\Users\IEUser\Desktop" + "\\",
        "User": "IEWIN7\\IEUser", "LogonGuid": "365abb72-0f31-5cea-0000-002062290100",
        "LogonId": "0x12962", "IntegrityLevel": "High", "Hashes": _HASHES,
        "ParentProcessGuid": _PGUID, "ParentProcessId": "1372",
        "ParentImage": r"C:\Windows\explorer.exe",
        "ParentCommandLine": r"C:\Windows\Explorer.EXE"}))
    assert ev["car_object"] == "process" and ev["car_action"] == "create"
    assert ev["guid"] == _GUID                      # the REAL CAR identity
    assert ev["image_path"] == r"C:\Users\IEUser\Desktop\jjs.exe"
    assert ev["parent_image_path"] == r"C:\Windows\explorer.exe"
    assert ev["parent_command_line"] == r"C:\Windows\Explorer.EXE"
    assert ev["current_working_directory"].startswith(r"C:\Users")
    assert ev["integrity_level"] == "High"
    assert ev["pid"] == "3836" and ev["ppid"] == "1372"
    assert ev["md5_hash"] == "64FDBD98584331982A15B1F2DF7F08DA"
    assert ev["sha1_hash"].startswith("8CC66ED5") and ev["sha256_hash"].startswith("B5DE10A0")
    assert ev.get("sid") is None                    # EID 1 has no SID — honest null
    assert ev["hostname"] == "IEWIN7" and ev.get("fqdn") is None  # NetBIOS, no faked fqdn
    assert ev["source_host"] == "IEWIN7"
    # parent link + session join candidates surfaced native, never canonical
    assert ev["_native"]["ParentProcessGuid"] == _PGUID
    assert ev["_native"]["LogonId"] == "0x12962"
    assert ev["parent_pid"] == "1372"
    assert ev["_native"]["UtcTime"] == "2019-05-26 04:01:42.375"


def test_eid5_terminate_shares_the_create_guid():
    ev = normalize.normalize("evtx_sysmon", _rec(5, {
        "UtcTime": "2019-05-26 04:02:00.000", "ProcessGuid": _GUID,
        "ProcessId": "3836", "Image": r"C:\Users\IEUser\Desktop\jjs.exe"}))
    assert ev["car_object"] == "process" and ev["car_action"] == "terminate"
    assert ev["guid"] == _GUID                      # same identity as the create
    assert ev["owning_guid_native"] == _GUID        # spoke-style definitive link
    assert ev.get("user") is None                   # absent pre-v11 — honest null


def test_eid3_flow_with_direction_and_transport_protocol():
    ev = normalize.normalize("evtx_sysmon", _rec(3, {
        "UtcTime": "2019-05-26 15:47:58.815", "ProcessGuid": _GUID,
        "ProcessId": "3388", "Image": r"C:\Windows\System32\notepad.exe",
        "User": "IIS APPPOOL\\DefaultAppPool", "Protocol": "tcp",
        "Initiated": "True", "SourceIp": "127.0.0.1", "SourceHostname": "IEWIN7",
        "SourcePort": "49166", "DestinationIp": "10.0.0.5",
        "DestinationHostname": "DC1", "DestinationPort": "135",
        "DestinationPortName": "epmap"}))
    assert ev["car_object"] == "flow" and ev["car_action"] == "start"
    assert ev["transport_protocol"] == "tcp"        # model name, not stale `protocol`
    assert "protocol" not in ev
    assert ev["network_direction"] == "outbound"    # Initiated=True
    assert ev["src_ip"] == "127.0.0.1" and ev["dest_port"] == "135"
    assert ev["start_time"] == ev["timestamp"]
    assert ev.get("application_protocol") is None   # PortName guess stays native
    assert ev["owning_guid_native"] == _GUID and ev["owning_pid"] == "3388"


def test_eid11_file_create_and_eid23_delete_hashes():
    create = normalize.normalize("evtx_sysmon", _rec(11, {
        "UtcTime": "2020-02-10 08:28:12.876", "ProcessGuid": _GUID,
        "ProcessId": "2780", "Image": r"C:\Windows\Explorer.EXE",
        "TargetFilename": r"C:\Users\IEUser\Desktop\dummy.sys",
        "CreationUtcTime": "2020-02-10 08:20:00.000"}))
    assert create["car_object"] == "file" and create["car_action"] == "create"
    assert create["file_name"] == "dummy.sys" and create["extension"] == "sys"
    assert create["creation_time"] == create["timestamp"]
    assert create["_native"]["CreationUtcTime"] == "2020-02-10 08:20:00.000"
    assert create.get("md5_hash") is None           # EID 11 carries no hashes
    # EID 23: SYNTHETIC ONLY — no real FileDelete sample exists in data_store
    delete = normalize.normalize("evtx_sysmon", _rec(23, {
        "UtcTime": "2020-02-10 08:30:00.000", "ProcessGuid": _GUID,
        "ProcessId": "2780", "User": "IEWIN7\\IEUser",
        "Image": r"C:\Windows\System32\cmd.exe",
        "TargetFilename": r"C:\Users\IEUser\Desktop\dummy.sys",
        "Hashes": _HASHES, "IsExecutable": "true", "Archived": "true"}))
    assert delete["car_action"] == "delete"
    assert delete["md5_hash"] == "64FDBD98584331982A15B1F2DF7F08DA"
    assert delete.get("creation_time") is None      # deletion proves no create time


def test_registry_actions_are_authoritative_never_bare_edit():
    base = {"UtcTime": "2019-05-16 14:17:15.763", "ProcessGuid": _GUID,
            "ProcessId": "3132", "Image": r"C:\Windows\regedit.exe"}
    add = normalize.normalize("evtx_sysmon", _rec(12, dict(
        base, EventType="CreateKey",
        TargetObject=r"HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\policies\system")))
    assert add["car_object"] == "registry" and add["car_action"] == "add"
    assert add.get("value") is None                 # a key event names no value
    rem = normalize.normalize("evtx_sysmon", _rec(12, dict(
        base, EventType="DeleteKey", TargetObject=r"HKU\S-1-5-21-1\Software\X")))
    assert rem["car_action"] == "remove"
    st = normalize.normalize("evtx_sysmon", _rec(13, dict(
        base, EventType="SetValue",
        TargetObject=r"HKLM\SOFTWARE\...\system\EnableLUA",
        Details="DWORD (0x00000000)")))
    assert st["car_action"] == "value_edit"         # authoritative, not "edit"
    assert st["value"] == "EnableLUA" and st["data"] == "DWORD (0x00000000)"
    rn = normalize.normalize("evtx_sysmon", _rec(14, dict(
        base, EventType="RenameKey", TargetObject=r"HKLM\SOFTWARE\A",
        NewName=r"HKLM\SOFTWARE\B")))
    assert rn["car_action"] == "key_edit"
    assert rn["_native"]["NewName"] == r"HKLM\SOFTWARE\B"
    # an EID 12 with an unrecognized EventType has no canonical action — raw
    assert normalize.normalize("evtx_sysmon", _rec(12, dict(
        base, EventType="Mystery", TargetObject=r"HKLM\X"))) is None
    for e in (add, rem, st, rn):
        assert e.get("type") is None and e.get("hive") is None  # Sysmon gives neither
        assert e["owning_guid_native"] == _GUID


def test_eid7_module_and_eid6_driver_signature_semantics():
    mod = normalize.normalize("evtx_sysmon", _rec(7, {
        "UtcTime": "2020-02-10 08:28:13.147", "ProcessGuid": _GUID,
        "ProcessId": "2780", "Image": r"C:\tools\loader.exe",
        "ImageLoaded": r"C:\Windows\System32\version.dll", "Hashes": _HASHES,
        "Signed": "true", "Signature": "Microsoft Windows",
        "SignatureStatus": "Valid"}))
    assert mod["car_object"] == "module" and mod["car_action"] == "load"
    assert mod["module_path"] == r"C:\Windows\System32\version.dll"
    assert mod["module_name"] == "version.dll"
    assert mod["image_path"] == r"C:\tools\loader.exe"   # the LOADING process
    assert mod["signer"] == "Microsoft Windows"
    assert mod["signature_valid"] is True
    assert mod["owning_guid_native"] == _GUID
    drv = normalize.normalize("evtx_sysmon", _rec(6, {
        "UtcTime": "2020-02-10 08:28:12.981",
        "ImageLoaded": r"C:\Windows\System32\drivers\VBoxDrv.sys",
        "Hashes": _HASHES, "Signed": "true",
        "Signature": "ChongKim Chan", "SignatureStatus": "Unavailable"}))
    assert drv["car_object"] == "driver" and drv["car_action"] == "load"
    assert drv["image_path"].endswith("VBoxDrv.sys")     # kernel: the driver IS the image
    assert drv["module_name"] == "VBoxDrv.sys"
    assert drv.get("module_path") is None                # driver has no module_path
    assert drv.get("signature_valid") is None            # only 'Valid' asserts True
    assert drv["owning_guid_native"] is None             # no initiating process exists


def test_eid8_remote_thread_owner_is_the_source():
    ev = normalize.normalize("evtx_sysmon", _rec(8, {
        "UtcTime": "2019-05-26 04:01:43.567", "SourceProcessGuid": _GUID,
        "SourceProcessId": "3836", "SourceImage": r"C:\Users\IEUser\Desktop\jjs.exe",
        "TargetProcessGuid": _PGUID, "TargetProcessId": "2996",
        "TargetImage": r"C:\Windows\System32\svchost.exe", "NewThreadId": "2072",
        "StartAddress": "0x0000000000090000",
        "StartModule": r"C:\Windows\System32\kernel32.dll",
        "StartFunction": "LoadLibraryA"}))
    assert ev["car_object"] == "thread" and ev["car_action"] == "remote_create"
    assert ev["src_pid"] == "3836" and ev["tgt_pid"] == "2996"
    assert ev["tgt_tid"] == "2072" and ev["start_function"] == "LoadLibraryA"
    assert ev["start_module_name"] == "kernel32.dll"
    # the ACTING process (source) is the owner; the injected target is a join
    # candidate surfaced native (thread has no guid column for it)
    assert ev["owning_guid_native"] == _GUID and ev["owning_pid"] == "3836"
    assert ev["_native"]["TargetProcessGuid"] == _PGUID
    assert "fqdn" not in ev                              # thread model has no fqdn


def test_non_sysmon_provider_and_unported_eids_stay_raw():
    r = _rec(1, {"ProcessGuid": _GUID, "Image": "x"})
    assert normalize.normalize("evtx_sysmon", dict(r, Provider="Microsoft-Windows-Security-Auditing")) is None
    for eid in (2, 4, 9, 10, 15, 22):
        assert normalize.normalize("evtx_sysmon", _rec(eid, {"ProcessGuid": _GUID})) is None


def test_enrich_links_sysmon_spokes_definitively():
    proc = normalize.normalize("evtx_sysmon", _rec(1, {
        "ProcessGuid": _GUID, "ProcessId": "3836",
        "Image": r"C:\evil.exe", "CommandLine": "evil -x",
        "User": "IEWIN7\\IEUser", "Hashes": _HASHES,
        "ParentProcessGuid": _PGUID, "ParentProcessId": "1372",
        "ParentImage": r"C:\Windows\explorer.exe"}))
    flow = normalize.normalize("evtx_sysmon", _rec(3, dict(
        {"ProcessGuid": _GUID, "ProcessId": "3836", "Protocol": "tcp",
         "Initiated": "True", "SourceIp": "10.0.0.9", "SourcePort": "1024",
         "DestinationIp": "1.2.3.4", "DestinationPort": "443"}), record_id="4858"))
    out = enrich.enrich([proc, flow])
    f = [e for e in out if e["car_object"] == "flow"][0]
    assert f["owning_guid"] == _GUID
    assert f["link_confidence"] == "definitive"          # tier 1: native guid
    assert f["exe"] == r"C:\evil.exe"                    # inherited, not overwritten
    assert f["src_ip"] == "10.0.0.9"                     # native value untouched


@pytest.mark.skipif(not os.path.isdir(_SAMPLES), reason="real evidence not present")
def test_real_sysmon_attack_samples_normalize():
    counts = {}
    for path in sorted(glob.glob(os.path.join(_SAMPLES, "*.json"))):
        for ev in sources.iter_mapped("evtx_sysmon", path):
            counts[ev["car_object"]] = counts.get(ev["car_object"], 0) + 1
            assert ev["car_action"] is not None
            assert ev["timestamp"] and ev["timestamp"][:2] == "20"
            assert ev["source_host"]                      # Computer always present
            if ev["car_object"] == "process":
                assert ev["guid"]                         # ProcessGuid identity
            elif ev["car_object"] not in ("driver",):
                assert ev["owning_guid_native"]           # every spoke owner-linked
    # every object the sample set carries (EID 23 absent → no file delete;
    # the one EID-6-only export is a single BOM-prefixed line — see caveats)
    assert {"process", "flow", "file", "registry", "module", "thread"} <= set(counts)
    assert counts["process"] >= 9 and counts["flow"] >= 7 and counts["registry"] >= 9
