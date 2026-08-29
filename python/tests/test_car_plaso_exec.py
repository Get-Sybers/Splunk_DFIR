"""Tests for the plaso execution-evidence CAR maps (mappings/plaso_exec.py).

Rows are shaped exactly like the wrapped l2t JSONL the plaso lane emits
(ingest/prepare.split_l2t): {"SourceImage","Timestamp","Parser","Record"} —
field values copied from the real evidence in
data_store/processed/log2timeline/jsonl/ where it exists (prefetch,
appcompatcache, userassist, cron); amcache and bam rows are synthetic, shaped
per the plaso parsers, as no real evidence carries those parsers yet.
"""
from __future__ import annotations

import json
import os

from get_sybers_dfir.car import normalize

_MODEL = os.path.join(os.path.dirname(__file__), "..", "..", "car_data_model.json")


# --- rows (wrapped shape) ---------------------------------------------------

_PREFETCH_EXEC = {
    "SourceImage": "log2timeline/jsonl/M57-JO.jsonl",
    "Timestamp": "2009-11-20T09:31:29.671875Z",
    "Parser": "prefetch",
    "Record": {
        "data_type": "windows:prefetch:execution",
        "display_name": "NTFS:\\WINDOWS\\Prefetch\\SVCHOST.EXE-3530F672.pf",
        "executable": "SVCHOST.EXE",
        "image_hostname": "M57-JO",
        "parser": "prefetch",
        "path_hints": [],
        "prefetch_hash": 892401266,
        "run_count": 3,
        "sha256_hash": "12f31dcc" + "0" * 56,
        "timestamp_desc": "Last Time Executed",
        "username": "-",
        "version": 17,
    },
}

_PREFETCH_VOLUME = {
    "SourceImage": "log2timeline/jsonl/M57-JO.jsonl",
    "Timestamp": "2009-11-20T09:38:03.625000Z",
    "Parser": "prefetch",
    "Record": {
        "data_type": "windows:volume:creation",
        "display_name": "NTFS:\\WINDOWS\\Prefetch\\SVCHOST.EXE-3530F672.pf",
        "image_hostname": "M57-JO",
        "origin": "SVCHOST.EXE-3530F672.pf",
        "parser": "prefetch",
    },
}

_APPCOMPAT = {
    "SourceImage": "log2timeline/jsonl/M57-JO.jsonl",
    "Timestamp": "2004-02-10T18:31:30.000000Z",
    "Parser": "winreg/appcompatcache",
    "Record": {
        "control_set": 2,
        "data_type": "windows:registry:appcompatcache",
        "display_name": "NTFS:\\WINDOWS\\system32\\config\\system",
        "entry_index": 49,
        "image_hostname": "M57-JO",
        "key_path": "HKEY_LOCAL_MACHINE\\System\\ControlSet002\\Control\\"
                    "Session Manager\\AppCompatibility",
        "parser": "winreg/appcompatcache",
        "path": "\\??\\C:\\WINDOWS\\system32\\hkcmd.exe",
        "timestamp_desc": "File Last Modification Time",
        "username": "-",
    },
}

_USERASSIST_RUNPATH = {
    "SourceImage": "log2timeline/jsonl/M57-JO.jsonl",
    "Timestamp": "2009-11-20T01:23:45.000000Z",
    "Parser": "winreg/userassist",
    "Record": {
        "data_type": "windows:registry:userassist",
        "display_name": "NTFS:\\Documents and Settings\\Administrator\\"
                        "NTUSER_S-1-5-21-606747145-1547161642-1644491937-500",
        "image_hostname": "M57-JO",
        "key_path": "HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\"
                    "CurrentVersion\\Explorer\\UserAssist\\"
                    "{75048700-EF1F-11D0-9888-006097DEACF9}\\Count",
        "number_of_executions": 1,
        "parser": "winreg/userassist",
        "username": "-",
        "value_name": "UEME_RUNPATH:E:\\R54402.EXE",
    },
}

_AMCACHE = {  # synthetic (no real amcache evidence yet); plaso AMCacheFileEventData shape
    "SourceImage": "log2timeline/jsonl/synth.jsonl",
    "Timestamp": "2023-05-01T10:00:00.000000Z",
    "Parser": "amcache",
    "Record": {
        "data_type": "windows:registry:amcache",
        # the parsed HIVE, never the program:
        "display_name": "NTFS:\\Windows\\appcompat\\Programs\\Amcache.hve",
        "filename": "Amcache.hve",
        "full_path": "c:\\users\\bob\\downloads\\evil.exe",
        "image_hostname": "HOST1",
        "parser": "amcache",
        "program_identifier": "0006a1c48f048a1c",
        "sha1": "a94a8fe5ccb19ba61c4c0873d391e987982fbbd3",
        "sha1_hash": "ffffffffffffffffffffffffffffffffffffffff",  # hive's own
        "timestamp_desc": "Link Time",
        "username": "-",
    },
}

_BAM = {  # synthetic (no real bam evidence yet); plaso BackgroundActivityModerator shape
    "SourceImage": "log2timeline/jsonl/synth.jsonl",
    "Timestamp": "2023-05-01T11:00:00.000000Z",
    "Parser": "winreg/bam",
    "Record": {
        "data_type": "windows:registry:bam",
        "display_name": "NTFS:\\Windows\\System32\\config\\SYSTEM",
        "image_hostname": "HOST1",
        "key_path": "HKEY_LOCAL_MACHINE\\System\\ControlSet001\\Services\\bam\\"
                    "State\\UserSettings\\S-1-5-21-1-2-3-1001",
        "parser": "winreg/bam",
        "path": "\\Device\\HarddiskVolume2\\Windows\\System32\\notepad.exe",
        "timestamp_desc": "Last Time Executed",
        "user_identifier": "S-1-5-21-1-2-3-1001",
        "username": "-",
    },
}

_CRON = {
    "SourceImage": "log2timeline/jsonl/dualserver_logs.jsonl",
    "Timestamp": "2020-08-26T11:46:13.000000Z",
    "Parser": "text/syslog_traditional",
    "Record": {
        "command": "test -x /etc/cron.daily/popularity-contest && "
                   "/etc/cron.daily/popularity-contest --crond",
        "data_type": "syslog:cron:task_run",
        "display_name": "OS:/data/dualserver_logs/logserver-logs-day2/log/message",
        "hostname": "pits-gatsby",
        "image_hostname": "",
        "parser": "text/syslog_traditional",
        "pid": 2534,
        "reporter": "CRON",
        "username": "root",
    },
}


# --- prefetch ---------------------------------------------------------------

def test_prefetch_execution_maps_to_process_create():
    ev = normalize.normalize("plaso_exec_prefetch", _PREFETCH_EXEC)
    assert ev is not None
    assert ev["car_object"] == "process" and ev["car_action"] == "create"
    assert ev["timestamp"] == "2009-11-20T09:31:29.671875Z"
    # exe is the bare NAME plaso proves; image_path is NOT faked from it
    assert ev["exe"] == "SVCHOST.EXE"
    assert ev.get("image_path") is None
    # the .pf ARTEFACT file must never leak into exe/image_path
    assert ".pf" not in str(ev["exe"])
    assert ev["_native"]["artefact_file"].endswith(".pf")
    assert ev["_native"]["run_count"] == 3
    assert ev["hostname"] == "M57-JO" and ev["source_host"] == "M57-JO"
    # "-" username is an honest null, never an identity
    assert ev.get("user") is None


def test_prefetch_volume_creation_stays_raw():
    assert normalize.normalize("plaso_exec_prefetch", _PREFETCH_VOLUME) is None


# --- winreg family ----------------------------------------------------------

def test_appcompatcache_maps_path_verbatim():
    ev = normalize.normalize("plaso_exec_winreg", _APPCOMPAT)
    assert ev is not None
    assert ev["car_action"] == "create"
    assert ev["image_path"] == "\\??\\C:\\WINDOWS\\system32\\hkcmd.exe"
    assert ev["exe"] == "hkcmd.exe"
    assert ev["_native"]["control_set"] == 2
    assert ev["_native"]["timestamp_desc"] == "File Last Modification Time"


def test_userassist_runpath_maps_and_extracts_hive_sid():
    ev = normalize.normalize("plaso_exec_winreg", _USERASSIST_RUNPATH)
    assert ev is not None
    assert ev["exe"] == "R54402.EXE"
    assert ev["image_path"] == "E:\\R54402.EXE"
    # join candidate: the NTUSER hive owner's SID (native, never canonical sid)
    assert ev["_native"]["hive_user_sid"] == \
        "S-1-5-21-606747145-1547161642-1644491937-500"
    assert ev.get("sid") is None


def test_userassist_counters_and_pidl_stay_raw():
    for vn in ("UEME_CTLCUACount:ctor", "UEME_CTLSESSION", "UEME_UISCUT",
               "UEME_RUNPIDL:%csidl2%\\x.lnk", "UEME_RUNCPL:timedate.cpl",
               "UEME_RUNPATH", ""):
        rec = json.loads(json.dumps(_USERASSIST_RUNPATH))
        rec["Record"]["value_name"] = vn
        assert normalize.normalize("plaso_exec_winreg", rec) is None, vn


def test_userassist_decoded_bare_name_gets_exe_but_no_image_path():
    # Win7+ plaso decodes value names; one with no separator can never fake a
    # full image_path
    rec = json.loads(json.dumps(_USERASSIST_RUNPATH))
    rec["Record"]["value_name"] = "notepad.exe"
    ev = normalize.normalize("plaso_exec_winreg", rec)
    assert ev["exe"] == "notepad.exe" and ev.get("image_path") is None


def test_amcache_program_hash_not_hive_hash_and_no_filename_leak():
    ev = normalize.normalize("plaso_exec_winreg", _AMCACHE)
    assert ev is not None
    assert ev["image_path"] == "c:\\users\\bob\\downloads\\evil.exe"
    assert ev["exe"] == "evil.exe"
    # Record.sha1 (program) — never Record.sha1_hash (the hive's own hash)
    assert ev["sha1_hash"] == "a94a8fe5ccb19ba61c4c0873d391e987982fbbd3"
    # Amcache.hve (Record.filename/display_name) must never leak into exe
    assert "Amcache" not in str(ev["exe"]) + str(ev["image_path"])


def test_amcache_without_full_path_leaves_paths_null():
    rec = json.loads(json.dumps(_AMCACHE))
    del rec["Record"]["full_path"]
    ev = normalize.normalize("plaso_exec_winreg", rec)
    # filename ("Amcache.hve") is the ARTEFACT — the KQL's fallback onto it is
    # deliberately dropped; null over near-miss
    assert ev is not None
    assert ev.get("exe") is None and ev.get("image_path") is None


def test_bam_maps_sid_natively():
    ev = normalize.normalize("plaso_exec_winreg", _BAM)
    assert ev is not None
    assert ev["exe"] == "notepad.exe"
    assert ev["image_path"] == \
        "\\Device\\HarddiskVolume2\\Windows\\System32\\notepad.exe"
    assert ev["sid"] == "S-1-5-21-1-2-3-1001"


def test_programscache_and_plain_winreg_stay_raw():
    for parser in ("winreg/explorer_programscache", "winreg/winreg_default",
                   "winreg/windows_usbstor_devices"):
        rec = {"SourceImage": "x.jsonl", "Parser": parser,
               "Record": {"parser": parser, "key_path": "HKLM\\X",
                          "image_hostname": "M57-JO"}}
        assert normalize.normalize("plaso_exec_winreg", rec) is None, parser


# --- cron -------------------------------------------------------------------

def test_cron_task_run_maps_command_pid_user():
    ev = normalize.normalize("plaso_exec_cron", _CRON)
    assert ev is not None
    assert ev["car_object"] == "process" and ev["car_action"] == "create"
    assert ev["command_line"].startswith("test -x /etc/cron.daily/")
    # first token: a shell builtin — exe carries it, image_path is not faked
    assert ev["exe"] == "test" and ev.get("image_path") is None
    assert ev["pid"] == 2534 and ev["user"] == "root"
    # image_hostname is empty (log-only source) — the syslog-RECORDED hostname
    # fills hostname/source_host (recorded, not trusted)
    assert ev["hostname"] == "pits-gatsby"
    assert ev["source_host"] == "pits-gatsby"


def test_cron_rooted_first_token_fills_image_path():
    rec = json.loads(json.dumps(_CRON))
    rec["Record"]["command"] = "/usr/lib/php/sessionclean 2>/dev/null"
    ev = normalize.normalize("plaso_exec_cron", rec)
    assert ev["image_path"] == "/usr/lib/php/sessionclean"
    assert ev["exe"] == "sessionclean"


def test_cron_image_hostname_wins_when_present():
    rec = json.loads(json.dumps(_CRON))
    rec["Record"]["image_hostname"] = "webserver01"
    ev = normalize.normalize("plaso_exec_cron", rec)
    assert ev["hostname"] == "webserver01"


def test_other_syslog_lines_stay_raw():
    rec = json.loads(json.dumps(_CRON))
    rec["Record"]["data_type"] = "syslog:line"
    assert normalize.normalize("plaso_exec_cron", rec) is None


# --- model conformance ------------------------------------------------------

def test_all_mapped_props_exist_on_the_model_process_object():
    with open(_MODEL, encoding="utf-8") as fh:
        model = json.load(fh)
    proc = next(o for o in model["objects"] if o["name"] == ["process"])
    fields, actions = set(proc["fields"]), set(proc["actions"])
    from get_sybers_dfir.car.mappings import plaso_exec

    def maps(entry):
        for _, sub in entry.get("variants", []):
            if sub:
                yield sub

    for key, entry in plaso_exec.MAPPINGS.items():
        for m in maps(entry):
            assert m["object"] == "process"
            assert m["action"] in actions, key
            for prop in m["props"]:
                assert prop in fields, (key, prop)
