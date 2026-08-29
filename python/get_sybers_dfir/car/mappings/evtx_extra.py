"""Additional Windows operational-channel event-log grabs (epic #86).

More CAR-mappable info the event logs give us, beyond the Security/System/Sysmon
core — each mapped because it CARRIES a CAR object/action/properties:

- **BITS-Client 59/60 → http/get**: a Background Intelligent Transfer is an
  HTTP(S) download; the event carries the URL (staging/C2 evidence) and byte
  counts. hostname = the endpoint that made the request (the http vantage, per
  CAR-Relations — not the server).
- **TerminalServices-LocalSessionManager 21/24/25 → user_session**: RDP/console
  session logon / disconnect / reconnect, carrying the user and the source
  Address (the remote IP for RDP; "LOCAL" for console — recorded as a null
  src_ip, honest).

These channels use the `UserData` payload shape (one nested child dict), read
with the `userdata()` marker; BITS uses the ordinary EventData.Data shape.

Note deliberately NOT mapped: System 7040 (service start-type changed) — the CAR
service object has no `modify`/config-change action (create/delete/pause/start/
stop only), so forcing it would fake an action. It stays raw.
"""
from __future__ import annotations

from ..normalize import (basename, const, domain_of, first, host_label,  # noqa: F401
                         map_value, payload, regex1, userdata)


def evtxx_is_bits_transfer(rec) -> bool:
    return (rec.get("EventId") in (59, 60)
            and "Bits-Client" in str(rec.get("Channel", "")))


def evtxx_is_ts_session(rec) -> bool:
    return (rec.get("EventId") in (21, 24, 25)
            and "TerminalServices-LocalSessionManager" in str(rec.get("Channel", "")))


PREDICATES = {
    "evtxx_is_bits_transfer": evtxx_is_bits_transfer,
    "evtxx_is_ts_session": evtxx_is_ts_session,
}

_URL = payload("url")
_GUID = {"fields": ["Computer", "Channel", "EventRecordId"]}

MAPPINGS = {
    # ---- BITS-Client 59/60 → http (a download is an HTTP GET) ---------------
    "evtx_bits": {
        "variants": [
            ("evtxx_is_bits_transfer", {
                "object": "http", "action": const("get"), "ts": "TimeCreated",
                "guid": _GUID, "host": host_label("Computer"),
                "props": {
                    "url_full": _URL,
                    # a full URL: pull host and scheme out (domain_of alone would
                    # keep the scheme, which is for bare Host headers)
                    "url_domain": regex1(_URL, r"^https?://([^/?#]+)"),
                    "url_scheme": regex1(_URL, r"^(https?)"),
                    "url_remainder": regex1(_URL, r"^https?://[^/]+(/[^\s]*)"),
                    # bytes actually transferred (0 at 'started', final at 'stopped')
                    "response_body_bytes": payload("bytesTransferred"),
                    # the endpoint that issued the request = the http vantage
                    "hostname": host_label("Computer"),
                },
                "keep": ["EventId", "EventRecordId", "Channel", "Computer",
                         "Payload", "SourceFile", "MapDescription"],
                "native_extract": {
                    "transferId": payload("transferId"), "name": payload("name"),
                    "bytesTotal": payload("bytesTotal"), "fileTime": payload("fileTime"),
                    "peer": payload("peer"),
                },
            }),
        ],
        "default": None,
    },
    # ---- TerminalServices session logon/disconnect/reconnect → user_session --
    "evtx_rdp": {
        "variants": [
            ("evtxx_is_ts_session", {
                "object": "user_session",
                "action": map_value("EventId", {"21": "login", "24": "logout",
                                                "25": "reconnect"}),
                "ts": "TimeCreated", "guid": _GUID, "host": host_label("Computer"),
                "props": {
                    "user": userdata("User"),
                    # the remote source of an RDP session; "LOCAL" (console) is
                    # not an IP -> honest null via the negative-lookahead regex
                    "src_ip": regex1(userdata("Address"), r"^(?!LOCAL$)(.+)$"),
                    "hostname": host_label("Computer"),
                    # login_type left null: EID 21 fires for BOTH console and RDP
                    # (Address distinguishes) — asserting a type would be a guess
                },
                "keep": ["EventId", "EventRecordId", "Channel", "Computer",
                         "Payload", "SourceFile", "MapDescription", "UserName"],
                "native_extract": {"SessionID": userdata("SessionID"),
                                   "Address": userdata("Address")},
            }),
        ],
        "default": None,
    },
}
