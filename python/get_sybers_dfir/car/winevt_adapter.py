"""Plaso winevt(x) → EvtxECmd-shape adapter (epic #86).

log2timeline parses the SAME artefact EvtxECmd does — the Windows event log — so
the CAR mapping is PORTED, not rewritten: this adapter converts a Plaso
`windows:evtx:record` / `windows:evt:record` into the EvtxECmd record shape, and
the pipeline then runs the EXISTING evtx maps over it unchanged. Artefact logic
defined once; the processor is a format adapter.

Plaso exposes EventData as a POSITIONAL `strings` list, so we map position→name.
Two facts the real data forces:
  1. an EventId is only unique WITHIN a channel (59 = BITS *and* TerminalServices;
     25 = TS *and* Kernel-Boot), so rules key on (channel-keyword, EventId);
  2. some providers use the `UserData` payload shape (TerminalServices), which the
     evtx maps read via userdata(); others use EventData (Security, SCM, BITS).
Each rule therefore carries its channel keyword, its EventData/UserData shape,
and the ordered field names matching the keys the evtx maps read.

Layouts marked (v) were VERIFIED against real LoneWolf (Win10) records; the rest
use the documented Windows manifest order.
"""
from __future__ import annotations

import re

_CHANNEL_RE = re.compile(r"<Channel>([^<]+)</Channel>")
_COMPUTER_RE = re.compile(r"<Computer>([^<]+)</Computer>")

# (channel_keyword, event_id): (shape, [ordered field names]).
# shape "E" = EventData.Data ({@Name,#text}); "U" = UserData.EventXML {name:val}.
_P = "_"   # a position the evtx maps never read (placeholder, kept for alignment)
RULES = {
    # ---- Security channel: logon / privilege / process ----------------------
    ("Security", 4624): ("E", ["SubjectUserSid", "SubjectUserName",             # (v)
        "SubjectDomainName", "SubjectLogonId", "TargetUserSid", "TargetUserName",
        "TargetDomainName", "TargetLogonId", "LogonType", "LogonProcessName",
        "AuthenticationPackageName", "WorkstationName", "LogonGuid",
        "TransmittedServices", "LmPackageName", "KeyLength", "ProcessId",
        "ProcessName", "IpAddress", "IpPort"]),
    ("Security", 4625): ("E", ["SubjectUserSid", "SubjectUserName",             # manifest
        "SubjectDomainName", "SubjectLogonId", "TargetUserSid", "TargetUserName",
        "TargetDomainName", "Status", "FailureReason", "SubStatus", "LogonType",
        "LogonProcessName", "AuthenticationPackageName", "WorkstationName",
        "TransmittedServices", "LmPackageName", "KeyLength", "ProcessId",
        "ProcessName", "IpAddress", "IpPort"]),
    ("Security", 4634): ("E", ["TargetUserSid", "TargetUserName",               # (v)
        "TargetDomainName", "TargetLogonId", "LogonType"]),
    ("Security", 4647): ("E", ["TargetUserSid", "TargetUserName",               # (v)
        "TargetDomainName", "TargetLogonId"]),
    ("Security", 4672): ("E", ["SubjectUserSid", "SubjectUserName",             # (v)
        "SubjectDomainName", "SubjectLogonId", "PrivilegeList"]),
    ("Security", 4688): ("E", ["SubjectUserSid", "SubjectUserName",             # (v)
        "SubjectDomainName", "SubjectLogonId", "NewProcessId", "NewProcessName",
        "TokenElevationType", "ProcessId", "CommandLine", "TargetUserSid",
        "TargetUserName", "TargetDomainName", "TargetLogonId", "ParentProcessName",
        "MandatoryLabel"]),
    ("Security", 4697): ("E", ["SubjectUserSid", "SubjectUserName",             # manifest
        "SubjectDomainName", "SubjectLogonId", "ServiceName", "ServiceFileName",
        "ServiceType", "ServiceStartType", "ServiceAccount"]),
    ("Security", 4778): ("E", ["AccountName", "AccountDomain", "LogonID",       # manifest
        "SessionName", "ClientName", "ClientAddress"]),
    ("Security", 4779): ("E", ["AccountName", "AccountDomain", "LogonID",       # manifest
        "SessionName", "ClientName", "ClientAddress"]),
    # ---- System channel: Service Control Manager ----------------------------
    ("System", 7045): ("E", ["ServiceName", "ImagePath", "ServiceType",         # (v)
        "StartType", "AccountName"]),
    # ---- BITS-Client: a transfer (HTTP download) ----------------------------
    ("Bits-Client", 59): ("E", ["transferId", "name", "Id", "url", "peer", _P,  # (v, EID 60)
        "fileTime", "fileLength", "bytesTotal", "bytesTransferred"]),
    ("Bits-Client", 60): ("E", ["transferId", "name", "Id", "url", "peer", _P,  # (v)
        "fileTime", "fileLength", "bytesTotal", "bytesTransferred"]),
    # ---- TerminalServices: RDP/console session (UserData shape) -------------
    ("TerminalServices", 21): ("U", ["User", "SessionID", "Address"]),          # (v)
    ("TerminalServices", 24): ("U", ["User", "SessionID", "Address"]),          # (v)
    ("TerminalServices", 25): ("U", ["User", "SessionID", "Address"]),          # (v shape)
    # ---- Sysmon (channel Microsoft-Windows-Sysmon/Operational) --------------
    # Plaso prepends RuleName at [0], then the standard Sysmon EventData order.
    # Verified against real attack-sample records for 1/3/5/6/7/8/11/12/13.
    ("Sysmon", 1): ("E", ["RuleName", "UtcTime", "ProcessGuid", "ProcessId",     # (v)
        "Image", "FileVersion", "Description", "Product", "Company", "CommandLine",
        "CurrentDirectory", "User", "LogonGuid", "LogonId", "TerminalSessionId",
        "IntegrityLevel", "Hashes", "ParentProcessGuid", "ParentProcessId",
        "ParentImage", "ParentCommandLine"]),
    ("Sysmon", 3): ("E", ["RuleName", "UtcTime", "ProcessGuid", "ProcessId",     # (v)
        "Image", "User", "Protocol", "Initiated", "SourceIsIpv6", "SourceIp",
        "SourceHostname", "SourcePort", "SourcePortName", "DestinationIsIpv6",
        "DestinationIp", "DestinationHostname", "DestinationPort",
        "DestinationPortName"]),
    ("Sysmon", 5): ("E", ["RuleName", "UtcTime", "ProcessGuid", "ProcessId",     # (v)
        "Image"]),
    ("Sysmon", 6): ("E", ["RuleName", "UtcTime", "ImageLoaded", "Hashes",        # (v)
        "Signed", "Signature", "SignatureStatus"]),
    ("Sysmon", 7): ("E", ["RuleName", "UtcTime", "ProcessGuid", "ProcessId",     # (v)
        "Image", "ImageLoaded", "FileVersion", "Description", "Product",
        "Company", "Hashes", "Signed", "Signature", "SignatureStatus"]),
    ("Sysmon", 8): ("E", ["RuleName", "UtcTime", "SourceProcessGuid",            # (v)
        "SourceProcessId", "SourceImage", "TargetProcessGuid", "TargetProcessId",
        "TargetImage", "NewThreadId", "StartAddress", "StartModule",
        "StartFunction"]),
    ("Sysmon", 11): ("E", ["RuleName", "UtcTime", "ProcessGuid", "ProcessId",    # (v)
        "Image", "TargetFilename", "CreationUtcTime"]),
    ("Sysmon", 12): ("E", ["RuleName", "EventType", "UtcTime", "ProcessGuid",    # (v)
        "ProcessId", "Image", "TargetObject"]),
    ("Sysmon", 13): ("E", ["RuleName", "EventType", "UtcTime", "ProcessGuid",    # (v)
        "ProcessId", "Image", "TargetObject", "Details"]),
    ("Sysmon", 23): ("E", ["RuleName", "UtcTime", "ProcessGuid", "ProcessId",    # manifest
        "User", "Image", "TargetFilename", "Hashes", "IsExecutable", "Archived"]),
}


def _rule(channel: str, source: str, eid):
    hay = f"{channel} {source}"
    for (kw, e), spec in RULES.items():
        if e == eid and kw in hay:
            return spec
    return None


def adapt(wrapped: dict) -> dict | None:
    """One wrapped Plaso l2t row ({SourceImage, Timestamp, Parser, Record}) ->
    an EvtxECmd-shaped record the evtx maps consume, or None if (channel,
    EventId) has no CAR-relevant layout (the row stays raw)."""
    rec = wrapped.get("Record") or {}
    eid = rec.get("event_identifier")
    xml = rec.get("xml_string") or ""
    chan = _CHANNEL_RE.search(xml)
    channel = chan.group(1) if chan else ""
    source = rec.get("source_name") or ""
    spec = _rule(channel, source, eid)
    if spec is None:
        return None
    shape, names = spec
    strings = rec.get("strings")
    if not isinstance(strings, list):
        strings = []

    def val(i):
        return strings[i] if i < len(strings) else None

    if shape == "U":
        payload = {"UserData": {"EventXML": {
            nm: val(i) for i, nm in enumerate(names) if nm != _P}}}
    else:
        payload = {"EventData": {"Data": [
            {"@Name": nm, "#text": val(i)} for i, nm in enumerate(names) if nm != _P]}}
    comp = _COMPUTER_RE.search(xml)
    return {
        "EventId": eid,
        # the Sysmon map gates on Provider ("sysmon" in Provider); Plaso's
        # source_name IS the provider (Microsoft-Windows-Sysmon)
        "Provider": source,
        "Channel": channel or source,
        "Computer": rec.get("computer_name") or rec.get("hostname")
        or (comp.group(1) if comp else None),
        "EventRecordId": rec.get("record_number"),
        "TimeCreated": wrapped.get("Timestamp"),
        "Payload": payload,
        "SourceFile": rec.get("display_name"),
        "MapDescription": None,
    }
