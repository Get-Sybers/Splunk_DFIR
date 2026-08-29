"""Plaso winevt(x) → EvtxECmd-shape adapter (epic #86).

log2timeline parses the SAME artefact EvtxECmd does — the Windows event log — so
the CAR mapping is PORTED, not rewritten: this adapter converts a Plaso
`windows:evtx:record` / `windows:evt:record` into the EvtxECmd record shape
(named `Payload.EventData`), and the pipeline then runs the EXISTING evtx maps
(evtx_security, evtx_process, evtx_security_sessions, evtx_services, …) over it
unchanged. Artefact logic defined once; the processor is a format adapter.

Plaso exposes EventData as a POSITIONAL `strings` list, not named fields, so we
map position→name per EventId. The layouts below were VERIFIED against real
LoneWolf (Win10) records for 4624/4634/4647/4672/4688; 4625/4778/4779 use the
documented Windows manifest order (stable; not present in that corpus to verify —
flagged). Channel comes from the record's XML (`<Channel>`); Computer from
Plaso's resolved hostname.
"""
from __future__ import annotations

import re

_CHANNEL_RE = re.compile(r"<Channel>([^<]+)</Channel>")
_COMPUTER_RE = re.compile(r"<Computer>([^<]+)</Computer>")

# EventId -> ordered EventData names, matching the EvtxECmd payload keys the evtx
# maps read. (v) = verified against real LoneWolf records.
POSITIONS = {
    4624: ["SubjectUserSid", "SubjectUserName", "SubjectDomainName",          # (v)
           "SubjectLogonId", "TargetUserSid", "TargetUserName",
           "TargetDomainName", "TargetLogonId", "LogonType", "LogonProcessName",
           "AuthenticationPackageName", "WorkstationName", "LogonGuid",
           "TransmittedServices", "LmPackageName", "KeyLength", "ProcessId",
           "ProcessName", "IpAddress", "IpPort"],
    4625: ["SubjectUserSid", "SubjectUserName", "SubjectDomainName",          # manifest
           "SubjectLogonId", "TargetUserSid", "TargetUserName",
           "TargetDomainName", "Status", "FailureReason", "SubStatus",
           "LogonType", "LogonProcessName", "AuthenticationPackageName",
           "WorkstationName", "TransmittedServices", "LmPackageName",
           "KeyLength", "ProcessId", "ProcessName", "IpAddress", "IpPort"],
    4634: ["TargetUserSid", "TargetUserName", "TargetDomainName",             # (v)
           "TargetLogonId", "LogonType"],
    4647: ["TargetUserSid", "TargetUserName", "TargetDomainName",             # (v)
           "TargetLogonId"],
    4672: ["SubjectUserSid", "SubjectUserName", "SubjectDomainName",          # (v)
           "SubjectLogonId", "PrivilegeList"],
    4688: ["SubjectUserSid", "SubjectUserName", "SubjectDomainName",          # (v)
           "SubjectLogonId", "NewProcessId", "NewProcessName",
           "TokenElevationType", "ProcessId", "CommandLine", "TargetUserSid",
           "TargetUserName", "TargetDomainName", "TargetLogonId",
           "ParentProcessName", "MandatoryLabel"],
    # 4778/4779 (RDP reconnect/disconnect) — manifest order; the session map
    # coalesces AccountName/LogonID/ClientAddress via first().
    4778: ["AccountName", "AccountDomain", "LogonID", "SessionName",          # manifest
           "ClientName", "ClientAddress"],
    4779: ["AccountName", "AccountDomain", "LogonID", "SessionName",          # manifest
           "ClientName", "ClientAddress"],
}


def adapt(wrapped: dict) -> dict | None:
    """One wrapped Plaso l2t row ({SourceImage, Timestamp, Parser, Record}) ->
    an EvtxECmd-shaped record the evtx maps consume, or None if the EventId has
    no CAR-relevant layout (the row stays raw)."""
    rec = wrapped.get("Record") or {}
    eid = rec.get("event_identifier")
    names = POSITIONS.get(eid)
    if names is None:
        return None
    strings = rec.get("strings")
    if not isinstance(strings, list):
        strings = []
    data = [{"@Name": nm, "#text": (strings[i] if i < len(strings) else None)}
            for i, nm in enumerate(names)]
    xml = rec.get("xml_string") or ""
    chan = _CHANNEL_RE.search(xml)
    comp = _COMPUTER_RE.search(xml)
    return {
        "EventId": eid,
        # authoritative channel from the record XML; source_name (the provider)
        # is the fallback — for Security-Auditing it still contains "Security"
        "Channel": chan.group(1) if chan else (rec.get("source_name") or ""),
        "Computer": rec.get("computer_name") or rec.get("hostname")
        or (comp.group(1) if comp else None),
        "EventRecordId": rec.get("record_number"),
        "TimeCreated": wrapped.get("Timestamp"),
        "Payload": {"EventData": {"Data": data}},
        "SourceFile": rec.get("display_name"),
        "MapDescription": None,
    }
