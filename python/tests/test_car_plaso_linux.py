"""Unit tests for the Plaso filesystem + Linux session CAR maps (epic #86).

Synthetic rows are shaped EXACTLY like the wrapped l2t rows the KQL views were
vetted against — {"SourceImage","Timestamp","Parser","Record"} as emitted by
`ingest.prepare.split_l2t` — with Record fields copied from real evidence
(data_store/processed/log2timeline/jsonl: dualserver_logs for utmp/ssh, M57-JO
for filestat/usnjrnl; no real mft rows exist, so those are synthetic per the
Plaso mft parser's documented fields).
"""
from get_sybers_dfir.car import normalize
from get_sybers_dfir.ingest import prepare


def _wrap(parser, record, ts="2020-09-16T13:14:30.462820Z",
          source="dualserver_logs.jsonl"):
    rec = dict(record, parser=parser)
    row = {"SourceImage": source, "Parser": parser, "Record": rec}
    if ts:
        row["Timestamp"] = ts
    return row


# ---- CarFile_Plaso: filestat ------------------------------------------------

_FILESTAT = {
    "data_type": "fs:stat",
    "display_name": "NTFS:\\Program Files\\app\\FPEXT.MSG",
    "filename": "\\Program Files\\app\\FPEXT.MSG",
    "file_entry_type": "file", "file_size": 78706,
    "file_system_type": "NTFS", "image_hostname": "M57-JO",
    "is_allocated": True, "inode": "281474976721211",
    "sha256_hash": "b64170b533469d8fe289f295d7a644bfd6f24949800b3be05e928b0da1"
                   "3289b6",
    "timestamp_desc": "Content Modification Time", "username": "-",
}


def test_filestat_modify_maps_own_hashes_and_paths():
    ev = normalize.normalize("l2t_filestat", _wrap("filestat", _FILESTAT,
                                                   source="M57-JO.jsonl"))
    assert ev["car_object"] == "file" and ev["car_action"] == "modify"
    assert ev["file_path"] == "\\Program Files\\app\\FPEXT.MSG"
    assert ev["file_name"] == "FPEXT.MSG"
    assert ev["sha256_hash"].startswith("b64170b5")   # the file's OWN hash
    assert ev.get("md5_hash") is None                 # hashing off -> honest null
    assert ev["hostname"] == "M57-JO" and ev["source_host"] == "M57-JO"
    assert ev["user"] is None                         # '-' is an honest blank
    assert ev.get("creation_time") is None            # modify is NOT creation
    assert ev["_native"]["SourceImage"] == "M57-JO.jsonl"
    assert ev["_native"]["timestamp_desc"] == "Content Modification Time"


def test_filestat_creation_time_only_on_create():
    rec = dict(_FILESTAT, timestamp_desc="Creation Time")
    ev = normalize.normalize("l2t_filestat", _wrap("filestat", rec))
    assert ev["car_action"] == "create"
    assert ev["creation_time"] == "2020-09-16T13:14:30.462820Z"


def test_filestat_read_delete_and_noncanonical_desc():
    read = normalize.normalize("l2t_filestat", _wrap(
        "filestat", dict(_FILESTAT, timestamp_desc="Last Access Time")))
    assert read["car_action"] == "read"
    dele = normalize.normalize("l2t_filestat", _wrap(
        "filestat", dict(_FILESTAT, timestamp_desc="Deletion Time")))
    assert dele["car_action"] == "delete"
    # 'Backup Time' has no canonical CAR file action -> row stays raw
    assert normalize.normalize("l2t_filestat", _wrap(
        "filestat", dict(_FILESTAT, timestamp_desc="Backup Time"))) is None


def test_filestat_display_name_prefix_strip_when_filename_empty():
    rec = dict(_FILESTAT, filename="",
               display_name="GZIP:\\.fseventsd\\fc007712b62e1122")
    ev = normalize.normalize("l2t_filestat", _wrap("filestat", rec))
    assert ev["file_path"] == "\\.fseventsd\\fc007712b62e1122"
    assert ev["file_name"] == "fc007712b62e1122"


def test_filestat_zero_timestamp_row_has_null_time():
    # Plaso stamps timestamp 0 on unset MACB values; split_l2t leaves the
    # wrapped Timestamp out entirely -> the event's timestamp is null
    ev = normalize.normalize("l2t_filestat", _wrap("filestat", _FILESTAT,
                                                   ts=None))
    assert ev is not None and ev["timestamp"] is None


# ---- CarFile_Plaso: usnjrnl -------------------------------------------------

_USN = {
    "data_type": "fs:ntfs:usn_change",
    "display_name": "NTFS:\\$Extend\\$UsnJrnl:$J",
    "filename": "a15f3474-ab93-46b9-8834-124287ab1646.tmp",
    "image_hostname": "M57-JO", "file_reference": 281474976727294,
    "parent_file_reference": 281474976725861,
    "timestamp_desc": "Metadata Modification Time",
    "update_reason_flags": 2147484416,     # CREATE|DELETE|CLOSE (real row)
    "update_source_flags": 0, "update_sequence_number": 1048576,
    "username": "-",
    "sha256_hash": "not-the-described-files-hash",
}


def test_usnjrnl_create_flag_takes_precedence():
    ev = normalize.normalize("l2t_usnjrnl", _wrap("usnjrnl", _USN))
    assert ev["car_action"] == "create"                # 0x100 beats 0x200
    assert ev["creation_time"] == "2020-09-16T13:14:30.462820Z"
    assert ev["file_path"] == "a15f3474-ab93-46b9-8834-124287ab1646.tmp"
    # the $UsnJrnl artefact's own hash is NOT the described file's hash
    assert ev.get("sha256_hash") is None
    assert ev["_native"]["update_reason_flags"] == 2147484416
    assert ev["_native"]["file_reference"] == 281474976727294  # join candidate


def test_usnjrnl_delete_and_default_modify():
    dele = normalize.normalize("l2t_usnjrnl", _wrap(
        "usnjrnl", dict(_USN, update_reason_flags=0x200)))
    assert dele["car_action"] == "delete"
    mod = normalize.normalize("l2t_usnjrnl", _wrap(
        "usnjrnl", dict(_USN, update_reason_flags=0x80008000)))  # BASIC_INFO|CLOSE
    assert mod["car_action"] == "modify"
    assert mod.get("creation_time") is None


# ---- CarFile_Plaso: mft (synthetic — no real mft rows in the evidence) ------

_MFT = {
    "data_type": "fs:stat:ntfs",
    "display_name": "NTFS:\\$MFT", "filename": "\\$MFT",
    "name": "notes.txt", "path_hints": ["\\Users\\jo\\notes.txt"],
    "file_reference": 843, "parent_file_reference": 29,
    "image_hostname": "M57-JO", "is_allocated": True,
    "timestamp_desc": "Creation Time", "username": "-",
}


def test_mft_maps_described_file_not_the_artefact():
    ev = normalize.normalize("l2t_mft", _wrap("mft", _MFT))
    assert ev["car_object"] == "file" and ev["car_action"] == "create"
    # marker set has no list-index: name is the file_path (the KQL's own
    # fallback); the full hints list is preserved verbatim as evidence
    assert ev["file_path"] == "notes.txt"
    assert ev["_native"]["path_hints"] == ["\\Users\\jo\\notes.txt"]
    assert ev.get("md5_hash") is None      # any hash would be $MFT's own
    assert ev["_native"]["file_reference"] == 843


# ---- CarUserSession_Utmp ----------------------------------------------------

_UTMP = {  # real dualserver wtmp row (USER_PROCESS)
    "data_type": "linux:utmp:event", "exit_status": 0,
    "hostname": "localhost", "image_hostname": "", "ip_address": "0.0.0.0",
    "login_type": 7, "pid": 3401, "terminal": "tty7",
    "terminal_identifier": 12346, "timestamp_desc": "Content Modification Time",
    "username": "logserv",
}


def test_utmp_user_process_is_login():
    ev = normalize.normalize("l2t_utmp", _wrap("utmp", _UTMP))
    assert ev["car_object"] == "user_session" and ev["car_action"] == "login"
    assert ev["user"] == "logserv"
    assert ev.get("src_ip") is None           # 0.0.0.0 is not a remote source
    assert ev.get("login_id") is None         # no Linux LUID — never faked
    assert ev["owning_pid"] == 3401           # session leader, join candidate
    assert ev["_native"]["login_type"] == 7   # utmp vocab stays native
    assert ev["_native"]["hostname"] == "localhost"   # login SOURCE host
    assert ev["_native"]["terminal"] == "tty7"


def test_utmp_dead_process_is_logout_and_remote_ip_kept():
    rec = dict(_UTMP, login_type=8, ip_address="10.0.0.9")
    ev = normalize.normalize("l2t_utmp", _wrap("utmp", rec))
    assert ev["car_action"] == "logout"
    assert ev["src_ip"] == "10.0.0.9"


def test_utmp_non_session_types_stay_raw():
    for lt in (0, 1, 2, 5):   # EMPTY/RUN_LVL/BOOT_TIME/INIT_PROCESS
        assert normalize.normalize("l2t_utmp", _wrap(
            "utmp", dict(_UTMP, login_type=lt))) is None


def test_utmpx_shares_the_utmp_map():
    ev = normalize.normalize("l2t_utmpx", _wrap("utmpx", _UTMP))
    assert ev["car_object"] == "user_session" and ev["car_action"] == "login"


# ---- CarUserSession_Ssh -----------------------------------------------------

_SSH = {  # real dualserver syslog row (typed sshd Accepted)
    "data_type": "syslog:ssh:login", "authentication_method": "password",
    "hostname": "pits-insec", "image_hostname": "",
    "ip_address": "156.59.33.60", "pid": 3756, "port": "54544",
    "protocol": "ssh2", "reporter": "sshd",
    "timestamp_desc": "Content Modification Time", "username": "insec",
}


def test_ssh_login_maps_source_and_keeps_method_native():
    ev = normalize.normalize("l2t_text", _wrap("text/syslog_traditional", _SSH))
    assert ev["car_object"] == "user_session" and ev["car_action"] == "login"
    assert ev["user"] == "insec"
    assert ev["src_ip"] == "156.59.33.60" and ev["src_port"] == "54544"
    assert ev["owning_pid"] == 3756           # the handling sshd, join candidate
    assert ev["_native"]["authentication_method"] == "password"
    assert ev["_native"]["hostname"] == "pits-insec"  # reporter host — native
    assert ev.get("login_id") is None


def test_ssh_loopback_source_is_null():
    ev = normalize.normalize("l2t_text", _wrap(
        "text/syslog_traditional", dict(_SSH, ip_address="127.0.0.1")))
    assert ev.get("src_ip") is None


def test_other_text_rows_stay_raw():
    plain = {"data_type": "syslog:line", "hostname": "pits-gatsby",
             "image_hostname": "", "reporter": "kernel", "username": "-"}
    assert normalize.normalize("l2t_text", _wrap(
        "text/syslog_traditional", plain)) is None


# ---- shape lock: the maps consume exactly what split_l2t emits --------------

def test_wrapped_shape_matches_prepare_l2t_row():
    import json
    raw = dict(_UTMP, parser="utmp", timestamp=1600262099805465)
    table, line = prepare._l2t_row(raw, "dualserver_logs.jsonl")
    assert table == "L2tUtmp"
    ev = normalize.normalize("l2t_utmp", json.loads(line))
    assert ev["car_action"] == "login"
    assert ev["timestamp"].startswith("2020-09-16T")
