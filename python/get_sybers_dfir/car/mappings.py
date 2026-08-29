"""Per-artefact → MITRE CAR maps for the DX_DFIR pipeline (epic #86).

Same declarative shape as PIIAT-Mem's mappings: one entry per artefact, variants
where one artefact's rows split across objects/actions, markers for the small
transforms, `keep` for native fields with no CAR home (never faked into a
canonical column).

This foundation ships the two objects memory cannot supply (researched from
car.mitre.org) plus the engine; the remaining artefact ports (user_session,
process/Sysmon, Plaso, SRUM, …) land per-artefact on top:

- **authentication** ← EvtxECmd Security 4624/4625/4648 — the authentication
  EVENT (success/failure), distinct from the user_session it may open.
- **http** ← Zeek http.log — one CAR http event per request
  (get/post/put/tunnel; other methods have no canonical action and stay raw).

The memory artefact does NOT map here: PIIAT-Mem already emits finished CAR —
`sources.load_piiat_car()` passes it straight through.
"""
from __future__ import annotations

from .normalize import (basename, const, domain_of, epoch_ts, ext, first,  # noqa: F401
                        host_label, lower, map_value, payload, regex1)


# --- variant predicates -----------------------------------------------------

def is_sec_4624(rec) -> bool:
    return rec.get("EventId") == 4624 and "Security" in str(rec.get("Channel", ""))


def is_sec_4625(rec) -> bool:
    return rec.get("EventId") == 4625 and "Security" in str(rec.get("Channel", ""))


def is_sec_4648(rec) -> bool:
    return rec.get("EventId") == 4648 and "Security" in str(rec.get("Channel", ""))


def is_http_canonical(rec) -> bool:
    """CAR http has actions get/post/put/tunnel only; other methods stay raw."""
    return str(rec.get("method", "")).upper() in ("GET", "POST", "PUT", "CONNECT")


PREDICATES = {
    "is_sec_4624": is_sec_4624, "is_sec_4625": is_sec_4625,
    "is_sec_4648": is_sec_4648, "is_http_canonical": is_http_canonical,
}


# --- shared authentication field block (the 4624-family payload shape) ------

def _auth_props():
    return {
        # who was authenticated (the target of the request)
        "target_user": payload("TargetUserName"),
        "target_uid": payload("TargetUserSid"),
        "target_ad_domain": payload("TargetDomainName"),
        # who/where initiated it
        "user": payload("SubjectUserName"),
        "uid": payload("SubjectUserSid"),
        "ad_domain": payload("SubjectDomainName"),
        # the requesting host: WorkstationName where present; the Computer that
        # logged the event is the machine authenticated TO -> auth_target
        "hostname": first(payload("WorkstationName"), host_label("Computer")),
        "auth_target": "Computer",
        # NTLM / Kerberos / Negotiate — the CAR `method`
        "method": payload("AuthenticationPackageName"),
        "auth_service": payload("LogonProcessName"),
        "app_name": payload("ProcessName"),
    }


MAPPINGS = {
    # ---- EvtxECmd Security channel → authentication events -------------------
    "evtx_security": {
        "variants": [
            ("is_sec_4624", {
                "object": "authentication", "action": "success", "ts": "TimeCreated",
                "guid": {"none": True}, "host": host_label("Computer"),
                "props": _auth_props(),
                "keep": ["EventId", "Channel", "Computer", "Payload", "SourceFile",
                         "RemoteHost", "MapDescription"],
            }),
            ("is_sec_4625", {
                "object": "authentication", "action": "failure", "ts": "TimeCreated",
                "guid": {"none": True}, "host": host_label("Computer"),
                "props": dict(_auth_props(),
                              # the WHY of the failure — CAR decision_reason
                              decision_reason=first(payload("FailureReason"),
                                                    payload("Status"))),
                "keep": ["EventId", "Channel", "Computer", "Payload", "SourceFile",
                         "RemoteHost", "MapDescription"],
            }),
            ("is_sec_4648", {
                # a logon attempted with EXPLICIT credentials — an authentication
                # request; Security logs it at issuance (treated as success-path).
                "object": "authentication", "action": "success", "ts": "TimeCreated",
                "guid": {"none": True}, "host": host_label("Computer"),
                "props": _auth_props(),
                "keep": ["EventId", "Channel", "Computer", "Payload", "SourceFile",
                         "RemoteHost", "MapDescription"],
            }),
        ],
        "default": None,   # other Security rows: no CAR map here (yet) — stay raw
    },
    # ---- Zeek http.log → http events ----------------------------------------
    "zeek_http": {
        "variants": [
            ("is_http_canonical", {
                "object": "http",
                "action": map_value("method", {"GET": "get", "POST": "post",
                                               "PUT": "put", "CONNECT": "tunnel"},
                                    upper=True),
                "ts": epoch_ts("ts"),
                "guid": {"fields": ["uid", "trans_depth"]},
                "props": {
                    "hostname": "host",
                    "url_domain": domain_of("host"),
                    "url_remainder": "uri",
                    "http_version": "version",
                    "requester_ip_address": "id.orig_h",
                    "request_body_bytes": "request_body_len",
                    "response_body_bytes": "response_body_len",
                    "response_status_code": "status_code",
                    "request_referrer": "referrer",
                    "user_agent_full": "user_agent",
                },
                "keep": ["uid", "id.orig_p", "id.resp_h", "id.resp_p", "method",
                         "status_msg", "resp_mime_types", "trans_depth", "tags"],
            }),
        ],
        "default": None,   # HEAD/DELETE/... have no canonical CAR http action
    },
}
