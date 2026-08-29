"""Windows event logs beyond Sysmon → CAR user_session / service (epic #86).

Ports the vetted KQL views (kusto/schema/40-mitre.kql) to the Python engine:

- **CarUserSession_Security** → ``evtx_security_sessions``: Security
  4624/4634/4647/4778/4779 → **user_session**. The stale KQL names are fixed to
  the authoritative model (car_data_model.json): ``login_id`` (the LUID, was
  logon_id) and ``login_type`` (new — the model moved the session-type
  vocabulary interactive/rdp/remote/local OUT of the action set INTO its own
  field; the canonical ACTIONS are now login/logout/reconnect/lock/unlock).
  Deliberately NOT mapped, unlike the older view:
    * 4625 — a FAILED logon opens **no** session (CAR-Relations "Limits"): it
      is an authentication event (core.py), never a user_session one.
    * 4648 — explicit-credential logon recorded at ISSUANCE; no service
      response exists in the record, and no session provably opens
      (CAR-Relations: "mapping it … would assert an outcome the evidence
      doesn't contain"). Rows stay raw.
    * 4800/4801 (lock/unlock of the workstation) are separate events NOT fed
      by this artefact key; the ``lock`` action therefore never fires here.
      LogonType 7 on a 4624 *is* the unlock relogon — see _LT_ACTION.

- **CarService_Evtx** → ``evtx_services``: System 7045 / Security 4697 →
  **service**, action ``create``. The two events name the same facts
  differently (7045: ImagePath/AccountName; 4697: ServiceFileName/
  ServiceAccount) — coalesced per field, exactly like the view.

NOTE: ``evtx_security_sessions`` reads the SAME Security_EvtxECmd_Output.json
rows as core.py's ``evtx_security`` (authentication) — one file feeds two
artefact keys; the pipeline runs both. Artefact keys and predicates are
prefixed to stay globally unique across mapping submodules.
"""
from __future__ import annotations

from ..normalize import (basename, concat, const, domain_of, epoch_ts, ext, exe_path,  # noqa: F401
                        first, hex_int, host_label, lower, map_value, payload, regex1)


# S-1-16-<RID> mandatory-label SID -> CAR integrity_level (the memory processes
# plugin's own vocabulary), so the field means the same across every source.
_INTEGRITY = {
    "S-1-16-0": "untrusted", "S-1-16-4096": "low", "S-1-16-8192": "medium",
    "S-1-16-8448": "medium", "S-1-16-12288": "high", "S-1-16-16384": "system",
}


# --- variant predicates (evtxwin_ prefix: globally unique) -------------------
# Channel guards mirror the KQL (`Channel has "Security"/"System"`): these
# EventIds are reused by other providers, so the channel is pinned.

def evtxwin_is_sec_4624(rec) -> bool:
    """Security 4624 — an account was successfully logged on: a session OPENS."""
    return rec.get("EventId") == 4624 and "Security" in str(rec.get("Channel", ""))


def evtxwin_is_sec_logoff(rec) -> bool:
    """Security 4634 (logged off) / 4647 (user-initiated logoff) / 4779 (RDP
    session disconnected). 4779 is a session DISCONNECT — the session ended
    from the user's side; CAR has no "disconnect" action, so "logout" is the
    nearest honest label (the view's earlier "remote" was wrong and was fixed
    there too)."""
    return (rec.get("EventId") in (4634, 4647, 4779)
            and "Security" in str(rec.get("Channel", "")))


def evtxwin_is_sec_4778(rec) -> bool:
    """Security 4778 — a session was RECONNECTED to a Window Station (RDP/fast
    user switching): the canonical `reconnect` action."""
    return rec.get("EventId") == 4778 and "Security" in str(rec.get("Channel", ""))


def evtxwin_is_sys_7045(rec) -> bool:
    """System 7045 — the Service Control Manager installed a new service."""
    return rec.get("EventId") == 7045 and "System" in str(rec.get("Channel", ""))


def evtxwin_is_sec_4697(rec) -> bool:
    """Security 4697 — a service was installed in the system (audit lane)."""
    return rec.get("EventId") == 4697 and "Security" in str(rec.get("Channel", ""))


def evtxwin_is_sec_4688(rec) -> bool:
    """Security 4688 — a new process has been created."""
    return rec.get("EventId") == 4688 and "Security" in str(rec.get("Channel", ""))


PREDICATES = {
    "evtxwin_is_sec_4624": evtxwin_is_sec_4624,
    "evtxwin_is_sec_logoff": evtxwin_is_sec_logoff,
    "evtxwin_is_sec_4778": evtxwin_is_sec_4778,
    "evtxwin_is_sys_7045": evtxwin_is_sys_7045,
    "evtxwin_is_sec_4697": evtxwin_is_sec_4697,
    "evtxwin_is_sec_4688": evtxwin_is_sec_4688,
}


# --- user_session blocks -----------------------------------------------------

# login_type ← LogonType, per the vetted view's case logic (the model's
# vocabulary is interactive/rdp/remote/local). Only the ints the view asserted
# are mapped; every other LogonType (0 system, 4 batch, 5 service, 8/9
# cleartext/new-credentials, 11 cached) has NO proven canonical value and is
# left null — the raw int stays queryable in _native.LogonType. "local" has no
# LogonType source in this artefact (console feeders like utmp assert it).
# LogonType 7 is "the workstation was unlocked" — it drives the ACTION
# (unlock), not login_type: an unlock relogon happens on console AND on RDP
# sessions alike, so asserting a session type from it would be a near-miss.
_LOGIN_TYPE = {
    "2": "interactive",   # at-keyboard / console logon
    "3": "remote",        # network logon (SMB, RPC, WinRM, ...)
    "10": "rdp",          # RemoteInteractive (Terminal Services / RDP)
}

# 4624 action: LogonType 7 = unlock (canonical action in the model), every
# other successful logon = login. `first` falls through when map_value misses.
_LT_ACTION = first(map_value(payload("LogonType"), {"7": "unlock"}),
                   const("login"))


def _session_props():
    """Canonical user_session fields shared by every Security session event.

    The 4778/4779 pair names its fields differently from the 4624 family
    (AccountName / LogonID / ClientAddress instead of TargetUserName /
    TargetLogonId / IpAddress) — coalesced per field, exactly like the view
    (payload() returns None for a missing key, so `first` is the analogue of
    the KQL's iff(isempty(...))).
    """
    return {
        # the user whose session this is. UserName (EvtxECmd's own column) is
        # the view's last-resort fallback; in practice every in-scope EventId
        # carries one of the payload names.
        "user": first(payload("TargetUserName"), payload("AccountName"),
                      "UserName"),
        # the session user's SID — the model's uid (4778/4779 carry no SID:
        # honest null there).
        "uid": payload("TargetUserSid"),
        # the LUID — THE designed join key (CAR-Relations: unique per boot per
        # host; the authentication↔user_session join runs on it).
        "login_id": first(payload("TargetLogonId"), payload("LogonID")),
        "login_type": map_value(payload("LogonType"), _LOGIN_TYPE),
        # the host the session exists ON (Computer, first DNS label — the view's
        # split(Computer, ".")[0]).
        "hostname": host_label("Computer"),
        # origin address of the logon. The view nulls the non-addresses:
        # "-"/"" are engine blanks already; "LOCAL" is 4778/4779's
        # ClientAddress for a console session (not an IP), and loopback
        # carries no origin information. `^`-anchored, so regex1 cannot
        # slide past the guard.
        "src_ip": regex1(first(payload("IpAddress"), payload("ClientAddress")),
                         r"^(?!(?:::1|127\.0\.0\.1|LOCAL)$)(.+)$"),
        # 4624's IpPort; "0" and "-" mean no port (the view's toint guard).
        # Kept as the digit string — the engine has no int-cast marker.
        "src_port": regex1(payload("IpPort"), r"^(?!0$)(\d+)$"),
        # dest_ip/dest_port: the record names no destination ADDRESS (Computer
        # is the destination host, already in hostname) — honest nulls, per
        # the view's empty dest_ip / int(null) dest_port.
    }


_SESSION_KEEP = ["EventId", "EventRecordId", "Channel", "Computer", "Payload",
                 "SourceFile", "RemoteHost", "MapDescription"]
# parsed join keys / evidence buried in the Payload blob — surfaced for joins
# and analyst queries; never CAR-canonical columns (car-store §3 discipline).
_SESSION_NATIVE = {
    # the raw LogonType int — canonical login_type covers only the vetted subset
    "LogonType": payload("LogonType"),
    # 4624: the EXISTING session the logon was requested from (LUID join key)
    "SubjectLogonId": payload("SubjectLogonId"),
    # client-reported origin host (forgeable — recorded, not trusted; the
    # user_session model has no src_hostname field so it stays native)
    "WorkstationName": payload("WorkstationName"),
    # 4778/4779: the RDP client's host name and the Window Station session
    "ClientName": payload("ClientName"),
    "SessionName": payload("SessionName"),
}


# --- service blocks ----------------------------------------------------------

# the service binary: 7045 ImagePath / 4697 ServiceFileName. The view maps the
# SAME string to image_path AND exe (service binary is image_path, NOT
# module_path — that is a module/driver-only field). No basename/arg-split for
# exe: a 7045 ImagePath may embed arguments after an unquoted path — splitting
# them apart is a parse the record cannot prove, so the vetted whole-string
# port stands.
_SVC_RAW = first(payload("ImagePath"), payload("ServiceFileName"))
# the raw value can embed arguments after the executable (svchost -k ...):
# command_line keeps it verbatim; image_path/exe parse the path out (the same
# exe_path treatment the memory svcscan map applies to Binary (Registry))
_SVC_IMG = exe_path(_SVC_RAW)

_SVC_PROPS = {
    "name": payload("ServiceName"),
    "image_path": _SVC_IMG,
    "exe": basename(_SVC_IMG),
    "command_line": _SVC_RAW,
    # the account the service RUNS AS (7045 AccountName / 4697 ServiceAccount),
    # falling back to EvtxECmd's UserName column like the view. 4697's
    # SubjectUserName (who INSTALLED it) is a different entity — never
    # coalesced into `user`; it stays in the kept Payload.
    "user": first(payload("AccountName"), payload("ServiceAccount"), "UserName"),
    "hostname": host_label("Computer"),
    # the view: fqdn only when Computer actually is one (contains a dot) —
    # a bare NetBIOS name faked into fqdn would be a near-miss.
    "fqdn": regex1("Computer", r"^(.+\..+)$"),
    # pid/ppid: the event records the INSTALL, not the running instance; the
    # EvtxECmd ProcessId column is the event WRITER (services.exe / lsass),
    # not the service — honest nulls. command_line: not carried. uid: the
    # UserId column is the record writer's SID context, not the service
    # account's — kept native, never promoted.
}

_SVC_KEEP = ["EventId", "EventRecordId", "Channel", "Computer", "Payload",
             "SourceFile", "MapDescription", "UserId"]
_SVC_NATIVE = {
    # start/type detail — not CAR service fields, but prime persistence
    # evidence (7045: StartType/ServiceType; 4697: ServiceStartType/ServiceType)
    "StartType": first(payload("StartType"), payload("ServiceStartType")),
    "ServiceType": payload("ServiceType"),
    # 4697: the installer's session LUID — join candidate to user_session /
    # authentication (the same key CAR-Relations designates for the LUID join)
    "SubjectLogonId": payload("SubjectLogonId"),
}


MAPPINGS = {
    # ---- Security channel logon-session events → user_session ---------------
    "evtx_security_sessions": {
        "variants": [
            ("evtxwin_is_sec_4624", {
                "object": "user_session", "action": _LT_ACTION,
                "ts": "TimeCreated",
                # per-record identity, same recipe as core.py's authentication:
                # record ids are per-channel monotonic, unique within one .evtx
                # export (a 1102 log-clear reset is the documented caveat)
                "guid": {"fields": ["Computer", "Channel", "EventRecordId"]},
                "host": host_label("Computer"),
                # a mapped 4624 IS the successful login — the event's own
                # assertion, not a derivation (4625 never reaches this map)
                "props": dict(_session_props(), login_successful=const(True)),
                # the logon-requesting process, a HEX pid string ("0x3e7") —
                # enrich's create-time-window join parses hex and marks the
                # link heuristic (PID reuse; CAR-Relations "Joins")
                "owning_pid": payload("ProcessId"),
                "keep": _SESSION_KEEP, "native_extract": _SESSION_NATIVE,
            }),
            ("evtxwin_is_sec_logoff", {
                "object": "user_session", "action": "logout",
                "ts": "TimeCreated",
                "guid": {"fields": ["Computer", "Channel", "EventRecordId"]},
                "host": host_label("Computer"),
                # login_successful stays null: a logoff/disconnect event does
                # not RECORD a login decision (the session's existence implies
                # one, but the event itself asserts nothing about it)
                "props": _session_props(),
                "keep": _SESSION_KEEP, "native_extract": _SESSION_NATIVE,
            }),
            ("evtxwin_is_sec_4778", {
                "object": "user_session", "action": "reconnect",
                "ts": "TimeCreated",
                "guid": {"fields": ["Computer", "Channel", "EventRecordId"]},
                "host": host_label("Computer"),
                "props": _session_props(),
                "keep": _SESSION_KEEP, "native_extract": _SESSION_NATIVE,
            }),
            # 4625 (failure — no session opens) and 4648 (issuance — no
            # outcome) deliberately unmapped: rows stay raw. 4800/4801
            # (lock/unlock events proper) are not in this artefact's scope.
        ],
        "default": None,
    },
    # ---- System 7045 / Security 4697 → service create ------------------------
    "evtx_services": {
        "variants": [
            ("evtxwin_is_sys_7045", {
                "object": "service", "action": "create", "ts": "TimeCreated",
                "guid": {"fields": ["Computer", "Channel", "EventRecordId"]},
                "host": host_label("Computer"),
                "props": _SVC_PROPS,
                "keep": _SVC_KEEP, "native_extract": _SVC_NATIVE,
            }),
            ("evtxwin_is_sec_4697", {
                "object": "service", "action": "create", "ts": "TimeCreated",
                "guid": {"fields": ["Computer", "Channel", "EventRecordId"]},
                "host": host_label("Computer"),
                "props": _SVC_PROPS,
                "keep": _SVC_KEEP, "native_extract": _SVC_NATIVE,
            }),
        ],
        "default": None,   # 7036 state changes etc. have no canonical action here
    },
    # ---- Security 4688 → process create -------------------------------------
    # The audit-log analogue of Sysmon EID 1 / memory psscan: a new process.
    # 4688 field semantics (verified against real payloads): NewProcessId = THIS
    # process (hex), ProcessId = its CREATOR (the parent, hex), NewProcessName =
    # the image, Subject* = the creating security context, MandatoryLabel = the
    # new process's integrity, SubjectLogonId = the session it ran under.
    "evtx_process": {
        "variants": [
            ("evtxwin_is_sec_4688", {
                "object": "process", "action": "create", "ts": "TimeCreated",
                # no process guid in Security (unlike Sysmon's ProcessGuid) —
                # identity is the audit record; spokes link to it by pid+window
                "guid": {"fields": ["Computer", "Channel", "EventRecordId"]},
                "host": host_label("Computer"),
                # parent pid is 4688's ProcessId; enrich resolves the parent by
                # (ppid, create-time window) — heuristic (PID reuse)
                "parent_pid": payload("ProcessId"),
                "props": {
                    "pid": hex_int(payload("NewProcessId")),
                    "ppid": hex_int(payload("ProcessId")),
                    "image_path": payload("NewProcessName"),
                    "exe": basename(payload("NewProcessName")),
                    "parent_image_path": payload("ParentProcessName"),
                    "parent_exe": basename(payload("ParentProcessName")),
                    # only present with command-line auditing enabled — else
                    # an honest null, never fabricated
                    "command_line": payload("CommandLine"),
                    # the CREATING context (4688 Subject). A process launched to
                    # run AS a different user carries that in Target*; where
                    # Target is "-"/S-1-0-0 (the common case) the running user IS
                    # the creator, so Subject is the honest fill.
                    "user": first(payload("TargetUserName"), payload("SubjectUserName")),
                    # S-1-0-0 is the NULL SID ("Nobody") — 4688 sets Target to it
                    # when the process runs as the creator, so it falls through to
                    # the Subject SID (the name already blanks on "-")
                    "sid": first(regex1(payload("TargetUserSid"), r"^(?!S-1-0-0$)(S-.+)$"),
                                 payload("SubjectUserSid")),
                    "integrity_level": map_value(payload("MandatoryLabel"), _INTEGRITY),
                    "hostname": host_label("Computer"),
                },
                "keep": ["EventId", "EventRecordId", "Channel", "Computer",
                         "Payload", "SourceFile", "MapDescription"],
                # SubjectLogonId ties this process to its user_session (LUID);
                # TokenElevationType corroborates integrity. Surfaced, not faked.
                "native_extract": {
                    "SubjectLogonId": payload("SubjectLogonId"),
                    "TokenElevationType": payload("TokenElevationType"),
                    "MandatoryLabel": payload("MandatoryLabel"),
                },
            }),
        ],
        "default": None,
    },
}
