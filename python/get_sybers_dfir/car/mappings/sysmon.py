"""Sysmon (EvtxECmd, Channel Microsoft-Windows-Sysmon/Operational) → CAR maps.

Port of the vetted KQL views (kusto/schema/40-mitre.kql): CarProcess_Sysmon
(EID 1/5), CarFlow_Sysmon (3), CarFile_Sysmon (11/23), CarRegistry_Sysmon
(12/13/14), CarModule_Sysmon (7), CarDriver_Sysmon (6), CarThread_Sysmon (8).
One artefact key (``evtx_sysmon``) with per-EID variants.

Sysmon is the one host artefact that natively carries REAL CAR process guids:

- **ProcessGuid** is the process event's own ``guid`` (EID 1 create and EID 5
  terminate share it — the same process identity across its lifetime) AND every
  spoke event's ``owning_guid`` (flow/file/registry/module/thread rows link to
  their owner DEFINITIVELY, no pid-window heuristic needed — car-store §3
  tier 1). EID 8's acting process is the SOURCE (it performs the injection),
  so SourceProcessGuid is that spoke's owning guid.
- **ParentProcessGuid** (EID 1) is the parent-link candidate — surfaced via
  ``native_extract`` under the exact name ``enrich._resolve_owner``'s parent
  logic consumes; never a canonical column (process has parent_guid, but that
  is the RESOLVED link — enrich fills it, the map never asserts it).

Model-name fixes vs the stale KQL (authoritative car_data_model.json):
``transport_protocol`` (not ``protocol``) on flow; registry actions
``add``/``remove``/``key_edit``/``value_edit`` (never the model-less ``edit``).
The KQL's catch-all ``"edit"`` for an unrecognized registry EventType cannot be
ported — no such canonical action exists — so those rows stay raw (default
None), per docs/CAR-Relations.md: an action is canonical or the row is not CAR.

Additions beyond the KQL where the model has an exact-native home (the CAR
extraction rule is EXHAUSTIVE, additive extraction — never a near-miss):
parent_command_line / current_working_directory / integrity_level (EID 1),
network_direction (EID 3 Initiated), extension (file), signature_valid
(EID 6/7 SignatureStatus). Each is flagged at its line.
"""
from __future__ import annotations

import json

from ..normalize import (basename, const, ext, first, host_label,  # noqa: F401
                         map_value, payload, regex1)


# --- variant predicates -----------------------------------------------------
# Gate = the KQL's `Provider matches regex @"(?i)sysmon"` + EventId; registry
# variants additionally read the Payload's EventType (the action authority).

def _is_sysmon(rec) -> bool:
    return "sysmon" in str(rec.get("Provider", "")).lower()


def _eid(rec):
    try:
        return int(rec.get("EventId"))
    except (TypeError, ValueError):
        return None


def _payload_event_type(rec) -> str:
    """EventType out of the EvtxECmd Payload blob ('CreateKey', 'SetValue', …)."""
    raw = rec.get("Payload")
    if not raw:
        return ""
    try:
        data = raw if isinstance(raw, dict) else json.loads(raw)
        for d in (data.get("EventData") or {}).get("Data") or []:
            if isinstance(d, dict) and d.get("@Name") == "EventType":
                return str(d.get("#text") or "")
    except (ValueError, AttributeError, TypeError):
        pass
    return ""


def sysmon_proc_create(rec) -> bool:
    return _is_sysmon(rec) and _eid(rec) == 1


def sysmon_proc_terminate(rec) -> bool:
    return _is_sysmon(rec) and _eid(rec) == 5


def sysmon_flow_start(rec) -> bool:
    return _is_sysmon(rec) and _eid(rec) == 3


def sysmon_driver_load(rec) -> bool:
    return _is_sysmon(rec) and _eid(rec) == 6


def sysmon_module_load(rec) -> bool:
    return _is_sysmon(rec) and _eid(rec) == 7


def sysmon_thread_remote(rec) -> bool:
    return _is_sysmon(rec) and _eid(rec) == 8


def sysmon_file_create(rec) -> bool:
    return _is_sysmon(rec) and _eid(rec) == 11


def sysmon_file_delete(rec) -> bool:
    return _is_sysmon(rec) and _eid(rec) == 23


# EID 12 covers key AND value create/delete (Sysmon 'RegistryEvent (Object
# create and delete)') — EventType carries which; Create*→add, Delete*→remove
# (the KQL's contains-"Create"/"Delete" logic, actions per the authoritative
# model). An EID 12 with any other EventType falls to default None: raw.
def sysmon_reg_add(rec) -> bool:
    return _is_sysmon(rec) and _eid(rec) == 12 and "Create" in _payload_event_type(rec)


def sysmon_reg_remove(rec) -> bool:
    return _is_sysmon(rec) and _eid(rec) == 12 and "Delete" in _payload_event_type(rec)


# EID 13 is 'RegistryEvent (Value Set)' — EventType SetValue, and ONLY that:
# the authoritative action is value_edit (the KQL's stale bare "edit" fixed).
def sysmon_reg_value_set(rec) -> bool:
    return _is_sysmon(rec) and _eid(rec) == 13 and "Set" in _payload_event_type(rec)


# EID 14 is 'RegistryEvent (Key and Value Rename)' — a rename edits the KEY
# namespace (the object keeps its data, its name changes): key_edit. The KQL
# view maps 14 alongside 12/13; ported with the authoritative action.
def sysmon_reg_rename(rec) -> bool:
    return _is_sysmon(rec) and _eid(rec) == 14 and "Rename" in _payload_event_type(rec)


PREDICATES = {
    "sysmon_proc_create": sysmon_proc_create,
    "sysmon_proc_terminate": sysmon_proc_terminate,
    "sysmon_flow_start": sysmon_flow_start,
    "sysmon_driver_load": sysmon_driver_load,
    "sysmon_module_load": sysmon_module_load,
    "sysmon_thread_remote": sysmon_thread_remote,
    "sysmon_file_create": sysmon_file_create,
    "sysmon_file_delete": sysmon_file_delete,
    "sysmon_reg_add": sysmon_reg_add,
    "sysmon_reg_remove": sysmon_reg_remove,
    "sysmon_reg_value_set": sysmon_reg_value_set,
    "sysmon_reg_rename": sysmon_reg_rename,
}


# --- shared blocks ----------------------------------------------------------

# hostname/fqdn split from Computer, the KQL discipline everywhere: the first
# DNS label is hostname; fqdn is claimed ONLY when Computer actually is one
# (contains a dot) — a bare NetBIOS name is not faked into an fqdn.
_HOSTNAME = host_label("Computer")
_FQDN = regex1("Computer", r"^([^.]+\..+)$")

# The Hashes string ("SHA1=..,MD5=..,SHA256=..,IMPHASH=..") splits into the
# three canonical hash fields; IMPHASH has no CAR home and stays native in
# Payload (kept), never faked into a hash column.
def _hashes(src):
    return {
        "md5_hash": regex1(src, r"(?i)\bMD5=([0-9A-Fa-f]+)"),
        "sha1_hash": regex1(src, r"(?i)\bSHA1=([0-9A-Fa-f]+)"),
        "sha256_hash": regex1(src, r"(?i)\bSHA256=([0-9A-Fa-f]+)"),
    }


# MITRE module/driver.signature_valid: asserted True only on the one status
# WinVerifyTrust actually vouches for ('Valid'); every other status string
# (Unavailable/Errors/…) is evidence of a PROBLEM, not proof of forgery — it
# stays native in Payload (Signed/SignatureStatus) rather than a faked False.
_SIGNATURE_VALID = map_value(payload("SignatureStatus"), {"Valid": True})

# Native columns every variant keeps (EvtxECmd's own stamp; the full Payload
# blob preserves everything not canonically mapped — IMPHASH, RuleName,
# Signed/SignatureStatus, Source/TargetImage, …).
_KEEP = ["EventId", "EventRecordId", "Channel", "Computer", "Provider",
         "Payload", "SourceFile", "MapDescription", "UserName", "ExecutableInfo"]

# Sysmon stamps its OWN event time (UtcTime) inside the payload; TimeCreated
# (the ts) is the log-write time. Surfaced as evidence, never swapped in.
_UTC = {"UtcTime": payload("UtcTime")}

# a stable per-record identity for spoke events (unique per channel within one
# .evtx export; log-clear resets are the documented caveat) — process events
# instead use the REAL identity Sysmon gives them (ProcessGuid).
_RECORD_GUID = {"fields": ["Computer", "Channel", "EventRecordId"]}


def _proc_ctx():
    """The initiating-process block every Sysmon spoke event carries: canonical
    pid/image_path plus the DEFINITIVE tier-1 owner link (ProcessGuid)."""
    return {
        "owning_pid": payload("ProcessId"),
        "owning_guid": payload("ProcessGuid"),
    }


def _file_props(hashed: bool):
    """CarFile_Sysmon's field block. EID 23 (delete) carries the deleted
    file's own Hashes — canonical there; EID 11 (create) has none."""
    props = {
        "file_path": payload("TargetFilename"),
        "file_name": basename(payload("TargetFilename")),
        # model file.extension — exact native derivation the KQL omitted
        "extension": ext(payload("TargetFilename")),
        "image_path": payload("Image"),
        "pid": payload("ProcessId"),
        "user": payload("User"),
        "hostname": _HOSTNAME, "fqdn": _FQDN,
    }
    if hashed:
        props.update(_hashes(payload("Hashes")))
    return props


def _registry_props(with_value: bool, with_data: bool):
    """CarRegistry_Sysmon's field block. `key` is the full TargetObject (for a
    value event that path INCLUDES the value name — the KQL's shape, kept);
    `value` is split out only where the event is about a value (EID 13).
    type/hive: Sysmon gives neither (the KQL's "" placeholders) — honest nulls.
    User is absent from registry events on pre-v11 Sysmon — an honest null."""
    props = {
        "key": payload("TargetObject"),
        "image_path": payload("Image"),
        "pid": payload("ProcessId"),
        "user": payload("User"),
        "hostname": _HOSTNAME, "fqdn": _FQDN,
    }
    if with_value:
        props["value"] = basename(payload("TargetObject"))
    if with_data:
        props["data"] = payload("Details")
        # the row IS the value_edit and Details the written data — exactly CAR
        # new_content (same convention as the memory registry map)
        props["new_content"] = payload("Details")
    return props


def _registry_variant(action: str, with_value=False, with_data=False, native=None):
    return {
        "object": "registry", "action": action, "ts": "TimeCreated",
        "guid": _RECORD_GUID, "host": _HOSTNAME,
        **_proc_ctx(),
        "props": _registry_props(with_value, with_data),
        "keep": _KEEP,
        "native_extract": dict(_UTC, **(native or {})),
    }


def _image_load_props():
    """Shared EID 6/7 block: hashes + signer (Signature = WHO signed; the
    validity verdict is signature_valid; Signed/SignatureStatus stay native)."""
    return {
        **_hashes(payload("Hashes")),
        "signer": payload("Signature"),
        "signature_valid": _SIGNATURE_VALID,
        "hostname": _HOSTNAME, "fqdn": _FQDN,
    }


MAPPINGS = {
    "evtx_sysmon": {
        "variants": [
            # ---- EID 1 ProcessCreate — the richest single source ------------
            ("sysmon_proc_create", {
                "object": "process", "action": "create", "ts": "TimeCreated",
                # the REAL CAR identity: create and terminate share it
                "guid": {"marker": payload("ProcessGuid")},
                "host": _HOSTNAME,
                **_proc_ctx(),                 # self-reference; enrich skips creates
                "parent_pid": payload("ParentProcessId"),
                "props": {
                    "exe": payload("Image"),
                    "image_path": payload("Image"),
                    "parent_exe": payload("ParentImage"),
                    "parent_image_path": payload("ParentImage"),
                    "command_line": payload("CommandLine"),
                    # model process.parent_command_line — native on EID 1, the
                    # KQL omitted it (exhaustive-extraction addition)
                    "parent_command_line": payload("ParentCommandLine"),
                    # model process.current_working_directory / integrity_level
                    # — likewise exact natives the KQL left in Payload
                    "current_working_directory": payload("CurrentDirectory"),
                    "integrity_level": payload("IntegrityLevel"),
                    "pid": payload("ProcessId"),
                    "ppid": payload("ParentProcessId"),
                    "user": payload("User"),
                    # sid/signer: EID 1 carries neither (the KQL's "") — null
                    **_hashes(payload("Hashes")),
                    "hostname": _HOSTNAME, "fqdn": _FQDN,
                },
                "keep": _KEEP,
                "native_extract": dict(
                    _UTC,
                    # THE parent-link candidate: the exact key enrich's parent
                    # logic consumes for the tier-1 definitive link
                    ParentProcessGuid=payload("ParentProcessGuid"),
                    # LUID + logon guid: the user_session join candidates
                    LogonId=payload("LogonId"),
                    LogonGuid=payload("LogonGuid"),
                ),
            }),
            # ---- EID 5 ProcessTerminate (Image/ProcessId/Guid only) ---------
            ("sysmon_proc_terminate", {
                "object": "process", "action": "terminate", "ts": "TimeCreated",
                "guid": {"marker": payload("ProcessGuid")},
                "host": _HOSTNAME,
                # non-create process rows enrich as spokes: the guid link makes
                # terminate↔create definitive
                **_proc_ctx(),
                "props": {
                    "exe": payload("Image"),
                    "image_path": payload("Image"),
                    "pid": payload("ProcessId"),
                    "user": payload("User"),   # absent pre-v11 — honest null
                    "hostname": _HOSTNAME, "fqdn": _FQDN,
                },
                "keep": _KEEP, "native_extract": _UTC,
            }),
            # ---- EID 3 NetworkConnect — the connection AS MADE --------------
            ("sysmon_flow_start", {
                "object": "flow", "action": "start", "ts": "TimeCreated",
                "guid": _RECORD_GUID, "host": _HOSTNAME,
                **_proc_ctx(),
                "props": {
                    "src_ip": payload("SourceIp"),
                    "src_port": payload("SourcePort"),
                    "src_hostname": payload("SourceHostname"),
                    "dest_ip": payload("DestinationIp"),
                    "dest_port": payload("DestinationPort"),
                    "dest_hostname": payload("DestinationHostname"),
                    # authoritative-model fix: transport_protocol, not the
                    # KQL's stale `protocol`
                    "transport_protocol": payload("Protocol"),
                    # model flow.network_direction — Sysmon's Initiated IS the
                    # host-relative direction (the process initiated → outbound);
                    # any other rendering stays raw. Exhaustive-extraction
                    # addition over the KQL.
                    "network_direction": map_value(
                        payload("Initiated"),
                        {"TRUE": "outbound", "FALSE": "inbound"}, upper=True),
                    "exe": payload("Image"),
                    "image_path": payload("Image"),
                    "pid": payload("ProcessId"),
                    "user": payload("User"),
                    "start_time": "TimeCreated",
                    # end_time/packet_count/bytes: a single connect event —
                    # none exist (the KQL's nulls). Source/DestinationPortName
                    # are name-table guesses, NOT application_protocol — native.
                    "hostname": _HOSTNAME, "fqdn": _FQDN,
                },
                "keep": _KEEP, "native_extract": _UTC,
            }),
            # ---- EID 11 FileCreate / EID 23 FileDelete ----------------------
            ("sysmon_file_create", {
                "object": "file", "action": "create", "ts": "TimeCreated",
                "guid": _RECORD_GUID, "host": _HOSTNAME,
                **_proc_ctx(),
                # the KQL's creation_time = TimeCreated on the create event
                # (Payload's CreationUtcTime — the pre-existing file's stamp on
                # an overwrite — stays native evidence)
                "props": dict(_file_props(hashed=False),
                              creation_time="TimeCreated"),
                "keep": _KEEP,
                "native_extract": dict(_UTC,
                                       CreationUtcTime=payload("CreationUtcTime")),
            }),
            ("sysmon_file_delete", {
                "object": "file", "action": "delete", "ts": "TimeCreated",
                "guid": _RECORD_GUID, "host": _HOSTNAME,
                **_proc_ctx(),
                # EID 23 carries the DELETED file's own Hashes — canonical here
                "props": _file_props(hashed=True),
                "keep": _KEEP, "native_extract": _UTC,
            }),
            # ---- EID 12/13/14 RegistryEvent — action from EventType ---------
            ("sysmon_reg_add", _registry_variant("add")),
            ("sysmon_reg_remove", _registry_variant("remove")),
            # SetValue: the value name is TargetObject's last segment (the
            # KQL's split), Details is the written data
            ("sysmon_reg_value_set",
             _registry_variant("value_edit", with_value=True, with_data=True)),
            # Rename: NewName is the rename target — evidence, no CAR column
            ("sysmon_reg_rename",
             _registry_variant("key_edit", native={"NewName": payload("NewName")})),
            # ---- EID 7 ImageLoaded — ImageLoaded is the MODULE, Image the
            # loading process ------------------------------------------------
            ("sysmon_module_load", {
                "object": "module", "action": "load", "ts": "TimeCreated",
                "guid": _RECORD_GUID, "host": _HOSTNAME,
                **_proc_ctx(),
                "props": {
                    "module_path": payload("ImageLoaded"),
                    "module_name": basename(payload("ImageLoaded")),
                    "image_path": payload("Image"),
                    "pid": payload("ProcessId"),
                    **_image_load_props(),
                },
                "keep": _KEEP, "native_extract": _UTC,
            }),
            # ---- EID 6 DriverLoad — a driver loads into the KERNEL, so
            # ImageLoaded IS image_path (driver has no module_path) and there
            # is no initiating process (no pid/ProcessGuid in the event) ------
            ("sysmon_driver_load", {
                "object": "driver", "action": "load", "ts": "TimeCreated",
                "guid": _RECORD_GUID, "host": _HOSTNAME,
                "props": {
                    "module_name": basename(payload("ImageLoaded")),
                    "image_path": payload("ImageLoaded"),
                    **_image_load_props(),
                },
                "keep": _KEEP, "native_extract": _UTC,
            }),
            # ---- EID 8 CreateRemoteThread — cross-process injection: Source
            # creates a thread in Target. The ACTING process is the source, so
            # SourceProcessGuid/Id are the spoke's owner link; TargetProcessGuid
            # is the injected process — a join candidate with no CAR thread
            # column (thread has tgt_pid, not a guid), surfaced native.
            # Source/TargetImage are not thread fields — they stay in Payload.
            ("sysmon_thread_remote", {
                "object": "thread", "action": "remote_create", "ts": "TimeCreated",
                "guid": _RECORD_GUID, "host": _HOSTNAME,
                "owning_pid": payload("SourceProcessId"),
                "owning_guid": payload("SourceProcessGuid"),
                "props": {
                    "src_pid": payload("SourceProcessId"),
                    "tgt_pid": payload("TargetProcessId"),
                    "tgt_tid": payload("NewThreadId"),
                    "start_address": payload("StartAddress"),
                    "start_module": payload("StartModule"),
                    "start_module_name": basename(payload("StartModule")),
                    "start_function": payload("StartFunction"),
                    # model thread has hostname but NO fqdn — none mapped
                    "hostname": _HOSTNAME,
                },
                "keep": _KEEP,
                "native_extract": dict(
                    _UTC, TargetProcessGuid=payload("TargetProcessGuid")),
            }),
        ],
        # every other Sysmon EID (2, 4, 9, 10, 13-with-odd-EventType, 15, 22,
        # …) has no canonical action ported yet — rows stay raw, never guessed.
        "default": None,
    },
}
