"""Per-artefact → MITRE CAR maps for the DX_DFIR pipeline (epic #86).

Same declarative shape as PIIAT-Mem's mappings: one entry per artefact, variants
where one artefact's rows split across objects/actions, markers for the small
transforms, `keep`/`native_extract` for native evidence and join keys with no
CAR home (never faked into a canonical column).

Field semantics follow MITRE's own docs verbatim (car.mitre.org), including the
LIMITING principles determined per object (docs/design/car-relations.md):

- **authentication** ← Security 4624 (success) / 4625 (failure). 4648 is
  deliberately NOT mapped: it records an explicit-credential logon at ISSUANCE —
  no service response exists in the record, and CAR offers only
  success/failure/error, so asserting any of them would fake an outcome.
  hostname = the ORIGIN (WorkstationName — client-reported, recorded not
  trusted); auth_target = the machine authenticated TO (Computer). The LUID join
  keys (TargetLogonId/SubjectLogonId) are surfaced into _native for the
  user_session join.
- **http** ← Zeek http.log. hostname is NOT mapped: MITRE defines it as the host
  on which the request was SEEN (the vantage — carried by source_host), not the
  client-forgeable Host header (that is url_domain). url_full/url_scheme are
  reconstructed only for origin-form requests (never for CONNECT tunnels, whose
  request-target has no scheme).
- **email**: principles documented; no artefact feeds it yet (the one real
  smtp.json is STARTTLS-encrypted), so no map — an empty table is honest.

The memory artefact does NOT map here: PIIAT-Mem already emits finished CAR —
`sources.load_piiat_car()` passes it straight through.
"""
from __future__ import annotations

from .normalize import (basename, concat, const, domain_of, epoch_ts, ext,  # noqa: F401
                        first, host_label, lower, map_value, payload, regex1)


# --- variant predicates -----------------------------------------------------

def is_sec_4624(rec) -> bool:
    return rec.get("EventId") == 4624 and "Security" in str(rec.get("Channel", ""))


def is_sec_4625(rec) -> bool:
    return rec.get("EventId") == 4625 and "Security" in str(rec.get("Channel", ""))


def is_http_origin(rec) -> bool:
    """Origin-form requests — a URL is reconstructable (scheme+Host+uri)."""
    return str(rec.get("method", "")).upper() in ("GET", "POST", "PUT")


def is_http_tunnel(rec) -> bool:
    """CONNECT — authority-form request-target: no scheme, no URL to rebuild."""
    return str(rec.get("method", "")).upper() == "CONNECT"


PREDICATES = {
    "is_sec_4624": is_sec_4624, "is_sec_4625": is_sec_4625,
    "is_http_origin": is_http_origin, "is_http_tunnel": is_http_tunnel,
}


# --- shared blocks ----------------------------------------------------------

def _auth_props():
    return {
        # who was authenticated (the target of the request). MITRE's "only
        # pertains to privilege escalation" clause is its own copy-paste error —
        # Windows fills TargetUserName on every logon.
        "target_user": payload("TargetUserName"),
        "target_uid": payload("TargetUserSid"),
        "target_ad_domain": payload("TargetDomainName"),
        # the reporting/calling context (often a machine account — evidence,
        # never asserted as "the person who typed the password")
        "user": payload("SubjectUserName"),
        "uid": payload("SubjectUserSid"),
        "ad_domain": payload("SubjectDomainName"),
        # ORIGIN vs DESTINATION (4624/4625): WorkstationName is the requesting
        # host (client-reported — recorded, not trusted; no Computer fallback,
        # which is the DESTINATION); Computer is the machine authenticated TO.
        "hostname": payload("WorkstationName"),
        "auth_target": "Computer",
        # Negotiate means negotiated — a concrete protocol is NOT asserted
        "method": payload("AuthenticationPackageName"),
        "auth_service": payload("LogonProcessName"),
        "app_name": basename(payload("ProcessName")),
    }


_AUTH_KEEP = ["EventId", "EventRecordId", "Channel", "Computer", "Payload",
              "SourceFile", "RemoteHost", "MapDescription"]
# parsed join keys / evidence buried in the Payload blob — surfaced for the
# user_session (LUID) and process (hex PID) joins; not CAR-canonical columns
_AUTH_NATIVE = {
    "TargetLogonId": payload("TargetLogonId"),
    "SubjectLogonId": payload("SubjectLogonId"),
    "LogonType": payload("LogonType"),
    "IpAddress": payload("IpAddress"),
}

_HTTP_PROPS = {
    # MITRE http.hostname = "hostname on which the request was seen" — the
    # VANTAGE (source_host), never the client-sent Host header. Host lives in
    # url_domain, per "Domain portion of the URL".
    "url_domain": domain_of("host"),
    "url_remainder": "uri",
    "http_version": "version",
    "requester_ip_address": "id.orig_h",
    "request_body_bytes": "request_body_len",
    "response_body_bytes": "response_body_len",
    "response_status_code": "status_code",
    "request_referrer": "referrer",
    "user_agent_full": "user_agent",
}
_HTTP_KEEP = ["uid", "id.orig_p", "id.resp_h", "id.resp_p", "method",
              "status_msg", "trans_depth", "tags", "resp_fuids", "orig_fuids",
              "resp_mime_types", "orig_mime_types", "resp_filenames",
              "origin", "username"]


MAPPINGS = {
    # ---- EvtxECmd Security channel → authentication events -------------------
    "evtx_security": {
        "variants": [
            ("is_sec_4624", {
                "object": "authentication", "action": "success", "ts": "TimeCreated",
                # a stable per-record identity (unique per channel within one
                # .evtx export; log-clear resets are the documented caveat)
                "guid": {"fields": ["Computer", "Channel", "EventRecordId"]},
                "host": host_label("Computer"),
                "props": _auth_props(),
                "keep": _AUTH_KEEP, "native_extract": _AUTH_NATIVE,
            }),
            ("is_sec_4625", {
                "object": "authentication", "action": "failure", "ts": "TimeCreated",
                "guid": {"fields": ["Computer", "Channel", "EventRecordId"]},
                "host": host_label("Computer"),
                "props": dict(_auth_props(),
                              # the stable NTSTATUS codes carry the real why;
                              # FailureReason is an unresolved %% resource token
                              decision_reason=first(payload("SubStatus"),
                                                    payload("Status"),
                                                    payload("FailureReason"))),
                "keep": _AUTH_KEEP, "native_extract": _AUTH_NATIVE,
            }),
            # 4648 deliberately unmapped: an explicit-credential logon recorded
            # at issuance carries NO service response — asserting
            # success/failure/error would fake an outcome. Rows stay raw.
        ],
        "default": None,
    },
    # ---- Zeek http.log → http events ----------------------------------------
    "zeek_http": {
        "variants": [
            ("is_http_origin", {
                "object": "http",
                "action": map_value("method", {"GET": "get", "POST": "post",
                                               "PUT": "put"}, upper=True),
                "ts": epoch_ts("ts"),
                "guid": {"fields": ["uid", "trans_depth"]},
                "props": dict(_HTTP_PROPS,
                              # reconstruction from provable parts only: the
                              # request line + Host header ARE the URL for
                              # origin-form requests
                              url_scheme=const("http"),
                              url_full=concat(const("http://"), "host", "uri")),
                "keep": _HTTP_KEEP,
            }),
            ("is_http_tunnel", {
                "object": "http", "action": "tunnel", "ts": epoch_ts("ts"),
                "guid": {"fields": ["uid", "trans_depth"]},
                # no scheme/url_full: a CONNECT target is authority-form; and a
                # tunnel event proves a tunnel was REQUESTED — nothing inside it
                "props": _HTTP_PROPS,
                "keep": _HTTP_KEEP,
            }),
        ],
        "default": None,   # HEAD/OPTIONS/DELETE/… have no canonical CAR action
    },
}
