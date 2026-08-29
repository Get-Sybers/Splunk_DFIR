"""Plaso filesystem + Linux session → MITRE CAR maps (epic #86, Phase 2).

Port of the vetted KQL views (kusto/schema/40-mitre.kql):

- ``CarFile_Plaso``      → ``l2t_filestat`` / ``l2t_mft`` / ``l2t_usnjrnl``
- ``CarUserSession_Utmp`` → ``l2t_utmp`` / ``l2t_utmpx``
- ``CarUserSession_Ssh``  → ``l2t_text`` (only ``syslog:ssh:login`` rows)

The record shape is the WRAPPED l2t row that `ingest.prepare.split_l2t` emits —
``{"SourceImage", "Timestamp", "Parser", "Record"}`` with the raw Plaso event
under ``Record`` — the exact shape the KQL views were vetted against (one
artefact key per L2t* table file). ``payload(<field>, "Record")`` is the Python
analogue of KQL's ``Record.<field>`` (the payload marker's dict path; it also
turns Plaso's "-" placeholders into honest nulls).

Field semantics follow MITRE's own docs verbatim (car.mitre.org), with the
per-object limits of docs/CAR-Relations.md and car-store.md §3 (a canonical
column is left null rather than filled with a near-miss; forgeable/derived
values are recorded, not trusted; a row whose action is not canonical for the
object stays raw):

- **file** ← the three filesystem artefacts describe files DIFFERENTLY, so each
  gets its own map (the KQL's per-source union arms):
  - *filestat* — the parsed file IS the file: ``filename``/``display_name`` is
    the path, and Plaso's per-file hashes (when hashing was on) are the file's
    OWN hashes → md5/sha1/sha256_hash (MITRE: "MD5 hash of the file" — here
    provably of the file itself).
  - *mft* — ``Record.filename`` is the parsed $MFT artefact itself; the file an
    entry DESCRIBES is ``Record.path_hints[0]`` (else ``Record.name``).
  - *usnjrnl* — every event is stamped "Metadata Modification"; the real action
    is in the USN reason bits (FILE_CREATE 0x100 / FILE_DELETE 0x200 take
    precedence over the plain modify).
  For mft/usnjrnl any hash would be the $MFT/$UsnJrnl artefact's own, not the
  described file's — omitted (near-miss stays null). ``creation_time`` (MITRE:
  "Time the file was created") is asserted ONLY on action=create — on any other
  MACB row the event time is provably NOT the creation time.
- **user_session** ← Linux utmp/wtmp (typed) and syslog SSH logins.
  utmp ``login_type``: 6 (LOGIN_PROCESS) / 7 (USER_PROCESS) → login,
  8 (DEAD_PROCESS) → logout; BOOT_TIME (2), INIT_PROCESS (5) etc. are not user
  sessions and have no canonical action, so they stay raw (dropped here, still
  in the raw table). utmp record types are NOT the CAR ``login_type``
  vocabulary (that field describes HOW a user logged on, e.g. Windows logon
  types) — recording them there would be a near-miss, so they stay native.
  ``login_id`` (authoritative model name — the KQL's ``logon_id`` is stale) has
  no Linux LUID analogue → left null, never faked from pid/terminal.
  ``Record.hostname`` is the login SOURCE host for utmp (and the syslog
  reporter's hostname for ssh) — CAR user_session has no src_hostname field, so
  it stays native. Loopback/unset source addresses ("0.0.0.0", "::1",
  "127.0.0.1") are not a remote source → src_ip stays null (the KQL's iff-in
  denylist, as a full-string negative-lookahead so nothing else is touched).

Join keys carried natively (owner's capability-determination step decides the
actual joins — NO enrichment is implemented here):
- utmp ``pid`` (session leader) and ssh ``pid`` (the sshd handling the login)
  → ``owning_pid`` (bare PID: heuristic tier at best, per car-store §3).
- mft/usnjrnl ``file_reference``/``parent_file_reference`` (NTFS MFT entry
  identity) → ``_native`` (a usnjrnl↔mft equality key).
- ``SourceImage`` is kept on every row (the KQL's ``SourceFile`` roll-up
  identity).
"""
from __future__ import annotations

import re

from ..normalize import basename, ext, first, host_label, payload, regex1  # noqa: F401


def _r(field):
    """KQL ``Record.<field>`` — the raw Plaso event nested in the wrapped row."""
    return payload(field, "Record")


def _record(rec) -> dict:
    r = rec.get("Record")
    return r if isinstance(r, dict) else {}


# --- variant predicates -----------------------------------------------------
# Plaso timestamp_desc → CAR file action (the KQL case(); create is tested
# first so overlapping descriptions resolve to it).
_TD_CREATE = re.compile(r"(?i)creation|crtime|birth")
_TD_MODIFY = re.compile(r"(?i)modification|mtime")
_TD_READ = re.compile(r"(?i)last access|atime")
_TD_DELETE = re.compile(r"(?i)deletion|deleted")


def _td(rec) -> str:
    return str(_record(rec).get("timestamp_desc") or "")


def l2t_td_create(rec) -> bool:
    return bool(_TD_CREATE.search(_td(rec)))


def l2t_td_modify(rec) -> bool:
    return bool(_TD_MODIFY.search(_td(rec)))


def l2t_td_read(rec) -> bool:
    return bool(_TD_READ.search(_td(rec)))


def l2t_td_delete(rec) -> bool:
    return bool(_TD_DELETE.search(_td(rec)))


def _usn_flags(rec) -> int:
    try:
        return int(_record(rec).get("update_reason_flags") or 0)
    except (TypeError, ValueError):
        return 0


def l2t_usn_create(rec) -> bool:
    """USN_REASON_FILE_CREATE (0x100) — takes precedence over delete/modify."""
    return _usn_flags(rec) & 0x100 != 0


def l2t_usn_delete(rec) -> bool:
    """USN_REASON_FILE_DELETE (0x200)."""
    return _usn_flags(rec) & 0x200 != 0


def _login_type(rec):
    try:
        return int(_record(rec).get("login_type"))
    except (TypeError, ValueError):
        return None


def l2t_utmp_login(rec) -> bool:
    """LOGIN_PROCESS (6) / USER_PROCESS (7) — a session opening."""
    return _login_type(rec) in (6, 7)


def l2t_utmp_logout(rec) -> bool:
    """DEAD_PROCESS (8) — the session closing."""
    return _login_type(rec) == 8


def l2t_text_ssh_login(rec) -> bool:
    """The one L2tText row family with CAR semantics: a typed sshd 'Accepted'."""
    return str(_record(rec).get("data_type") or "") == "syslog:ssh:login"


PREDICATES = {
    "l2t_td_create": l2t_td_create, "l2t_td_modify": l2t_td_modify,
    "l2t_td_read": l2t_td_read, "l2t_td_delete": l2t_td_delete,
    "l2t_usn_create": l2t_usn_create, "l2t_usn_delete": l2t_usn_delete,
    "l2t_utmp_login": l2t_utmp_login, "l2t_utmp_logout": l2t_utmp_logout,
    "l2t_text_ssh_login": l2t_text_ssh_login,
}


# --- shared blocks ----------------------------------------------------------

_KEEP = ["SourceImage", "Parser"]   # the KQL SourceFile roll-up identity

# filestat/usnjrnl file_path (the KQL's shared _fn/_dn logic): filename, else
# display_name with its "TYPE:" prefix stripped (GZIP:\x → \x, OS:/y → /y),
# else display_name as-is (replace_regex leaves a non-matching string alone).
_FN_DN_PATH = first(_r("filename"),
                    regex1(_r("display_name"), r"\A[A-Z0-9]+:(.*)\Z"),
                    _r("display_name"))

# mft: the file the entry DESCRIBES. The KQL prefers Record.path_hints[0] (the
# reconstructed full path); the marker set has no list-index, so the hints list
# is preserved verbatim in _native and file_path falls back to Record.name —
# the KQL's own next-preferred source (then filename). Reported upstream: an
# index marker would make path_hints[0] expressible.
_MFT_PATH = first(_r("name"), _r("filename"))

# unset/loopback source is NOT a remote origin — src_ip stays null. \A/\Z
# anchor the lookahead so re.search cannot slide past it and match a suffix.
_SRC_IP = regex1(_r("ip_address"),
                 r"\A(?!(?:0\.0\.0\.0|127\.0\.0\.1|::1)\Z)(.+)\Z")


def _file_map(action, path_marker, hashes=False, native=None):
    """One CAR file variant. creation_time (MITRE: 'Time the file was
    created') only when the event IS the creation — any other MACB row's
    time is provably not it."""
    props = {
        "file_path": path_marker,
        "extension": ext(path_marker),
        # MITRE "Name of the file" — the KQL replace_regex(@"^.*[\\/]", "")
        "file_name": basename(path_marker),
        # hostname/user are the imaged host's context stamped by Plaso —
        # recorded evidence ('-' is an honest blank via the payload marker)
        "hostname": _r("image_hostname"),
        "user": _r("username"),
    }
    if hashes:
        # filestat only: the parsed file IS the file, so Plaso's hashes are
        # the file's own (canonical). For mft/usnjrnl a hash would be the
        # $MFT/$UsnJrnl artefact's own — omitted, never a near-miss fill.
        props.update(md5_hash=_r("md5_hash"), sha1_hash=_r("sha1_hash"),
                     sha256_hash=_r("sha256_hash"))
    if action == "create":
        props["creation_time"] = "Timestamp"
    return {
        "object": "file", "action": action, "ts": "Timestamp",
        # no per-record guid: a MACB row has no native stable identity
        # (assigned later / genuinely absent, per the engine contract)
        "host": host_label(_r("image_hostname")),
        "props": props, "keep": _KEEP, "native_extract": native or {},
    }


_FILESTAT_NATIVE = {
    "timestamp_desc": _r("timestamp_desc"), "data_type": _r("data_type"),
    "file_entry_type": _r("file_entry_type"), "file_size": _r("file_size"),
    "file_system_type": _r("file_system_type"),
    "is_allocated": _r("is_allocated"), "inode": _r("inode"),
    "display_name": _r("display_name"),
}
_MFT_NATIVE = {
    "timestamp_desc": _r("timestamp_desc"), "data_type": _r("data_type"),
    # the described path candidates the KQL indexes as path_hints[0]
    "path_hints": _r("path_hints"),
    # NTFS entry identity — the usnjrnl↔mft equality key (join candidate)
    "file_reference": _r("file_reference"),
    "parent_file_reference": _r("parent_file_reference"),
    "is_allocated": _r("is_allocated"),
    "file_attribute_flags": _r("file_attribute_flags"),
    "display_name": _r("display_name"),
}
_USN_NATIVE = {
    "timestamp_desc": _r("timestamp_desc"), "data_type": _r("data_type"),
    # the raw reason/source bits the action was decided from — evidence
    "update_reason_flags": _r("update_reason_flags"),
    "update_source_flags": _r("update_source_flags"),
    "update_sequence_number": _r("update_sequence_number"),
    # NTFS entry identity — the usnjrnl↔mft equality key (join candidate)
    "file_reference": _r("file_reference"),
    "parent_file_reference": _r("parent_file_reference"),
    "file_attribute_flags": _r("file_attribute_flags"),
    "display_name": _r("display_name"),
}


def _macb_entry(path_marker, hashes, native):
    """filestat/mft: action from Plaso's timestamp_desc (create first so
    overlaps resolve to it). A description matching none of the four (e.g.
    'Backup Time', 'Expiration Time') has no canonical CAR file action — the
    row stays raw (the KQL kept it with action="", which this store forbids)."""
    return {
        "variants": [
            ("l2t_td_create", _file_map("create", path_marker, hashes, native)),
            ("l2t_td_modify", _file_map("modify", path_marker, hashes, native)),
            ("l2t_td_read", _file_map("read", path_marker, hashes, native)),
            ("l2t_td_delete", _file_map("delete", path_marker, hashes, native)),
        ],
        "default": None,
    }


def _session_map(action, extra_props=None, native=None):
    props = {
        # MITRE "The name of the user" / the machine of the session. The
        # authoritative model field is login_id (the KQL's logon_id is
        # stale) — and Linux has no LUID analogue, so it stays null.
        "user": _r("username"),
        "hostname": _r("image_hostname"),
        "src_ip": _SRC_IP,
    }
    props.update(extra_props or {})
    return {
        "object": "user_session", "action": action, "ts": "Timestamp",
        "host": host_label(_r("image_hostname")),
        # the session-leader / handling-daemon PID — a bare PID join key
        # (heuristic tier at best); the owner decides the actual join
        "owning_pid": _r("pid"),
        "props": props, "keep": _KEEP, "native_extract": native or {},
    }


_UTMP_NATIVE = {
    "data_type": _r("data_type"),
    # utmp record-type vocabulary, NOT CAR's login_type (how a user logged
    # on) — a near-miss stays out of the canonical column
    "login_type": _r("login_type"),
    # the login SOURCE host — CAR user_session has no src_hostname field
    "hostname": _r("hostname"),
    "terminal": _r("terminal"),
    "terminal_identifier": _r("terminal_identifier"),
    "exit_status": _r("exit_status"),
}

_SSH_NATIVE = {
    "data_type": _r("data_type"),
    # how the login authenticated (password/publickey) — no CAR home
    "authentication_method": _r("authentication_method"),
    "protocol": _r("protocol"),          # ssh2 — native, not CAR's transport_protocol
    "reporter": _r("reporter"),
    # the syslog reporter's hostname — recorded, not the CAR hostname
    # (which is the imaged host, per the vetted view)
    "hostname": _r("hostname"),
}


# utmp and utmpx carry the same typed fields — one entry serves both tables
# (the KQL unions L2tUtmp/L2tUtmpx into one view).
_UTMP_ENTRY = {
    "variants": [
        ("l2t_utmp_login", _session_map("login", native=_UTMP_NATIVE)),
        ("l2t_utmp_logout", _session_map("logout", native=_UTMP_NATIVE)),
    ],
    # BOOT_TIME/INIT_PROCESS/… are not user sessions — no canonical action,
    # rows stay raw (the KQL's `where _lt in (6, 7, 8)`)
    "default": None,
}


MAPPINGS = {
    # ---- Plaso filesystem MACB → file events (CarFile_Plaso) ----------------
    "l2t_filestat": _macb_entry(_FN_DN_PATH, hashes=True, native=_FILESTAT_NATIVE),
    "l2t_mft": _macb_entry(_MFT_PATH, hashes=False, native=_MFT_NATIVE),
    "l2t_usnjrnl": {
        # every USN row is stamped "Metadata Modification" — the real action
        # is in the reason bits; create/delete take precedence over modify
        "variants": [
            ("l2t_usn_create", _file_map("create", _FN_DN_PATH, native=_USN_NATIVE)),
            ("l2t_usn_delete", _file_map("delete", _FN_DN_PATH, native=_USN_NATIVE)),
        ],
        "default": _file_map("modify", _FN_DN_PATH, native=_USN_NATIVE),
    },
    # ---- Linux utmp/wtmp → user_session events (CarUserSession_Utmp) --------
    "l2t_utmp": _UTMP_ENTRY,
    "l2t_utmpx": _UTMP_ENTRY,
    # ---- syslog SSH logins → user_session events (CarUserSession_Ssh) -------
    "l2t_text": {
        "variants": [
            ("l2t_text_ssh_login", _session_map(
                # a typed sshd "Accepted …" line IS a completed login
                "login",
                extra_props={"src_port": _r("port")},
                native=_SSH_NATIVE)),
        ],
        # every other text/syslog row (cron, dpkg, plain lines) has no
        # canonical user_session semantics — stays raw
        "default": None,
    },
}
