"""The detection registry — WHAT can run, and WHAT DATA each detection needs.

DetectRaptor keeps its runnable detections in a HuntList table inside
``DetectRaptor.Server.StartHunts``: one row per detection artifact, each artifact
naming the data it consumes, the runner filtering and scheduling the applicable
ones. This module is that HuntList for DX_DFIR: one entry per detection, each
declaring the processed data it TARGETS, so the runner (:mod:`get_sybers_dfir.
detect`) can sweep everything that is actually present and skip the rest.

Two kinds of entry, matching the two places processed data lives:

``kind: "kusto"``
    The detection is a KQL query over the ADX tables. ``requires`` lists the
    ``db.Table`` sources that must exist AND be non-empty for the detection to be
    applicable. The query may reference any database (``database("host").X``) —
    the runner executes it once, engine-side, and appends the hits straight into
    ``misc.Detections`` (no rows transit Python). CONTRACT: the query's final
    output must carry exactly three columns —

        Timestamp   datetime (or null) — when the detected activity happened
        Entity      string — the subject (host, process, IP, key, file, ...)
        Details     dynamic — the evidence, packed (pack()/Record)

``kind: "jsonl"``
    The detection is a predicate over a signature-lane JSONL output under
    ``data_store/processed`` (those files are not in Kusto). ``subdir``/``glob``
    locate the files; ``match(record)`` returns None for a non-hit, or a dict
    with the same three keys (Timestamp ISO-ish string or None, Entity str,
    Details dict) and an OPTIONAL ``AttackIds`` (list of ATT&CK technique ids
    parsed from the record's own tags — Hayabusa MitreTags, Suricata
    ``mitre_technique_id``, a YARA rule's meta); when present it fills the hit's
    ``AttackIds`` column, otherwise the detection's static ``attack`` list does.
    The runner streams the files, applies the predicate, and ingests the hits
    into the same ``misc.Detections`` table.

Shared metadata: ``id`` (stable, kebab-case), ``title``, ``severity`` (info/low/
medium/high/critical), ``attack`` (MITRE ATT&CK technique ids), ``target`` (the
human-readable data source, shown in every hit's ``Source`` column).

Detections are seeded across every processed lane the pipeline lands — Windows
event logs, the Plaso timeline, Zeek, Volatility memory analysis,
and the three signature-lane outputs — several adapted from DetectRaptor's
detection content where it maps onto DX_DFIR's tables. Adding a detection is
adding an entry here; the runner needs no change.
"""
from __future__ import annotations

import re

SEVERITIES = ("info", "low", "medium", "high", "critical")
KINDS = ("kusto", "jsonl")

# A MITRE ATT&CK technique id: T#### with an optional .### sub-technique. The
# lanes render tags in different shapes (Hayabusa joins several tags in one
# string, Suricata metadata is a list, ET Open sometimes writes t1059_003), so
# every per-hit tag source is run through _technique_ids() below, which pulls the
# technique ids out of whatever it is given and drops everything else (tactic
# names/ids, software/group ids, CAR ids).
_TECHNIQUE_RE = re.compile(r"T\d{4}(?:[._]\d{3})?", re.IGNORECASE)
# Meta keys that name an ATT&CK reference (attack / att&ck / att_ck / mitre_attack
# / mitre / technique). Matches "attack" but not "pattern"/"attribute".
_MITRE_META_KEY_RE = re.compile(r"att.?ck|mitre|technique", re.IGNORECASE)


def _technique_ids(value) -> list[str]:
    """ATT&CK technique ids found in ``value`` (a string, or a list/tuple/dict of
    them), normalised to canonical upper-case dotted form (``T1059.003``) and
    de-duplicated in first-seen order. Non-technique tags are ignored; ``''`` /
    ``None`` / no match yields ``[]``. Pure."""
    if not value:
        return []
    if isinstance(value, (list, tuple, set)):
        text = " ".join(str(v) for v in value)
    elif isinstance(value, dict):
        text = " ".join(str(v) for v in value.values())
    else:
        text = str(value)
    out: list[str] = []
    seen: set[str] = set()
    for tok in _TECHNIQUE_RE.findall(text):
        tid = tok.upper().replace("_", ".")
        if tid not in seen:
            seen.add(tid)
            out.append(tid)
    return out


def _yara_meta_attack(meta) -> list[str]:
    """Technique ids declared in a YARA rule's ``meta``. Prefers values under an
    ATT&CK-named key (``attack``, ``mitre_technique``, ...); with no such key,
    falls back to scanning every value (the technique-id pattern is distinctive).
    Pure."""
    if not isinstance(meta, dict):
        return _technique_ids(meta)
    keyed = [v for k, v in meta.items() if _MITRE_META_KEY_RE.search(str(k))]
    return _technique_ids(keyed) or _technique_ids(list(meta.values()))


# A JSON-shape EvtxECmd Payload field, extracted inline so the registry does not
# depend on the mitre database's EvtxPayload() helper being deployed. Used inside
# a KQL @'...' verbatim string, so the backslashes reach RE2 as written.
_EVTX_FIELD = r'"@Name":"%s","#text":"((?:[^"\\]|\\.)*)"'


# --------------------------------------------------------------------- jsonl matchers
def match_hayabusa_high(rec: dict):
    """Hayabusa (Sigma over EVTX) already scored the event — promote the ones it
    called high/critical into the unified detections output.

    The Sigma rule's ATT&CK technique ids ride along in the ``MitreTags`` column
    (emitted by the lane's ``--profile verbose``); they are parsed out and
    attached as ``AttackIds`` so the hit carries its real techniques instead of
    the detection's empty static list."""
    if str(rec.get("Level", "")).lower() not in ("high", "crit", "critical"):
        return None
    hit = {
        "Timestamp": rec.get("Timestamp"),
        "Entity": str(rec.get("Computer", "") or ""),
        "Details": {k: rec[k] for k in
                    ("RuleTitle", "Level", "Channel", "EventID", "RecordID",
                     "RuleID", "Details") if k in rec},
    }
    attack = _technique_ids([rec.get("MitreTags"), rec.get("MitreTactics")])
    if attack:
        hit["AttackIds"] = attack
    return hit


def match_suricata_alert(rec: dict):
    """Promote Suricata EVE alerts (the eve.jsonl also carries flow/dns/... context
    events — only event_type=alert is a detection)."""
    if rec.get("event_type") != "alert":
        return None
    alert = rec.get("alert") or {}
    hit = {
        "Timestamp": rec.get("timestamp"),
        "Entity": "%s -> %s:%s" % (rec.get("src_ip", "?"), rec.get("dest_ip", "?"),
                                   rec.get("dest_port", "?")),
        "Details": {
            "Signature": alert.get("signature"),
            "SignatureId": alert.get("signature_id"),
            "Category": alert.get("category"),
            "SuricataSeverity": alert.get("severity"),
            "Proto": rec.get("proto"),
            "AppProto": rec.get("app_proto"),
        },
    }
    # ET Open populates rule metadata with mitre_technique_id (a list) for many
    # rules; carry the techniques through as the hit's AttackIds when present.
    metadata = alert.get("metadata")
    if isinstance(metadata, dict):
        attack = _technique_ids(metadata.get("mitre_technique_id"))
        if attack:
            hit["AttackIds"] = attack
    return hit


def match_yara(rec: dict):
    """Every YARA match is a detection by definition — the rule already encodes
    the judgement. String captures are trimmed to ids/offsets (the matched data
    can be binary and belongs in the lane output, not the hit row)."""
    if rec.get("tool") != "yara" or not rec.get("rule"):
        return None
    strings = rec.get("strings") or []
    hit = {
        "Timestamp": None,   # a YARA match has no event time
        "Entity": str(rec.get("target", "") or rec.get("match", "") or ""),
        "Details": {
            "Rule": rec.get("rule"),
            "Source": rec.get("source"),
            "Match": rec.get("match"),
            "StringIds": sorted({s.get("id", "?") for s in strings if isinstance(s, dict)}),
        },
    }
    # When the rule's meta carries ATT&CK technique ids, surface them as AttackIds.
    attack = _yara_meta_attack(rec.get("meta"))
    if attack:
        hit["AttackIds"] = attack
    return hit


# --------------------------------------------------------------------- the registry
DETECTIONS: list[dict] = [
    # ---- host: Windows event logs (EvtxECmd) --------------------------------
    {
        "id": "win-eventlog-cleared",
        "title": "Windows event log cleared",
        "severity": "high",
        "attack": ["T1070.001"],
        "kind": "kusto",
        "target": "host.EvtxEcmdJson",
        "requires": ["host.EvtxEcmdJson"],
        # DetectRaptor Evtx.yaml win_eventlog_clear: 1102 (Security) / 104 (System).
        # 517 is the pre-Vista Security-cleared id. Channel-scoped: many modern
        # Operational channels reuse ids 104/1102 for unrelated events.
        "query": r"""
database("host").EvtxEcmdJson
| where (EventId == 1102 and Channel =~ "Security")
     or (EventId ==  104 and Channel =~ "System")
     or (EventId ==  517 and Channel =~ "Security")
| project Timestamp = TimeCreated, Entity = Computer,
          Details = pack("EventId", EventId, "Channel", Channel,
                         "UserName", UserName, "MapDescription", MapDescription,
                         "SourceFile", SourceFile)
""",
    },
    {
        "id": "win-defender-tamper",
        "title": "Windows Defender disabled or reconfigured",
        "severity": "medium",
        "attack": ["T1562.001"],
        "kind": "kusto",
        "target": "host.EvtxEcmdJson",
        "requires": ["host.EvtxEcmdJson"],
        # DetectRaptor win_disable_defender (5001/5010/5012) + 5007 (configuration
        # changed — how exclusions land in the log).
        "query": r"""
database("host").EvtxEcmdJson
| where Channel == "Microsoft-Windows-Windows Defender/Operational"
    and EventId in (5001, 5007, 5010, 5012)
| project Timestamp = TimeCreated, Entity = Computer,
          Details = pack("EventId", EventId, "MapDescription", MapDescription,
                         "Payload", Payload, "SourceFile", SourceFile)
""",
    },
    {
        "id": "win-service-suspicious-path",
        "title": "Service installed from a suspicious path or command",
        "severity": "high",
        "attack": ["T1543.003"],
        "kind": "kusto",
        "target": "host.EvtxEcmdJson",
        "requires": ["host.EvtxEcmdJson"],
        # DetectRaptor win_sus_service: 7045/4697 whose image is a shell one-liner,
        # a user-writable path, or an admin share.
        "query": (r"""
database("host").EvtxEcmdJson
| where (EventId == 7045 and Channel =~ "System")
     or (EventId == 4697 and Channel =~ "Security")
| extend ServicePath = iff(isnotempty(ExecutableInfo), ExecutableInfo,
                           extract(@'""" + _EVTX_FIELD % "(?:ImagePath|ServiceFileName)" + r"""', 1, Payload))
| where ServicePath matches regex
        @'(?i)(\\Users\\|\\Temp\\|\\AppData\\|COMSPEC|powershell|cmd\.exe|\\ADMIN\$|\\C\$|\.bat\b|\.ps1\b)'
| project Timestamp = TimeCreated, Entity = Computer,
          Details = pack("EventId", EventId, "ServiceName", PayloadData1,
                         "ServicePath", ServicePath, "SourceFile", SourceFile)
"""),
    },
    # ---- host: Plaso timeline ----------------------------------------------
    {
        "id": "win-prefetch-dualuse-tool",
        "title": "Prefetch evidence of dual-use / attack tooling execution",
        "severity": "medium",
        "attack": ["T1059", "T1053.005"],
        "kind": "kusto",
        "target": "host.L2tPrefetch",
        "requires": ["host.L2tPrefetch"],
        # DetectRaptor's MFT/Evtx lists of offensive + recon + RMM tooling, cut to
        # names with prefetch-visible execution semantics.
        "query": r"""
database("host").L2tPrefetch
| extend Executable = tostring(Record.executable)
| where Executable matches regex
        @'(?i)^(PSEXEC|PSEXESVC|MIMIKATZ|PROCDUMP|LAZAGNE|SHARPHOUND|ADFIND|DSQUERY|NLTEST|RCLONE|MEGACMD|MEGASYNC|NCAT|NMAP|WCE|SDELETE|SCHTASKS|WHOAMI|WMIC|QUSER|ANYDESK|TEAMVIEWER|ATERA|SPLASHTOP|SCREENCONNECT)\.EXE$'
| project Timestamp,
          Entity = strcat(tostring(Record.image_hostname), ": ", Executable),
          Details = pack("Executable", Executable, "RunCount", Record.run_count,
                         "Path", tostring(Record.display_name), "Parser", Parser,
                         "SourceImage", SourceImage)
""",
    },
    # ---- network: Zeek ------------------------------------------------------
    {
        "id": "zeek-notice-promoted",
        "title": "Zeek notice raised",
        "severity": "low",
        "attack": [],
        "kind": "kusto",
        "target": "network.Zeek (notice)",
        "requires": ["network.Zeek"],
        # Zeek's own detection layer — surface notice.log in the unified output.
        "query": r"""
database("network").Zeek
| where LogType == "notice"
| project Timestamp = Ts,
          Entity = strcat(tostring(Record.["id.orig_h"]), " -> ",
                          tostring(Record.["id.resp_h"])),
          Details = pack("Note", tostring(Record.note), "Msg", tostring(Record.msg),
                         "Uid", tostring(Record.uid), "SourceFile", SourceFile)
""",
    },
    {
        "id": "zeek-dns-oversized-query",
        "title": "Oversized DNS queries (tunnelling / exfiltration indicator)",
        "severity": "medium",
        "attack": ["T1071.004", "T1048.003"],
        "kind": "kusto",
        "target": "network.Zeek (dns)",
        "requires": ["network.Zeek"],
        # One hit per querying host, not per query — 8k raw rows is a lead list,
        # a per-source summary is a detection.
        "query": r"""
database("network").Zeek
| where LogType == "dns"
| extend Query = tostring(Record.query)
| where strlen(Query) >= 60
    and not(Query endswith ".in-addr.arpa" or Query endswith ".ip6.arpa")
| summarize QueryCount = count(), SampleQuery = take_any(Query),
            FirstSeen = min(Ts), LastSeen = max(Ts)
          by SrcIp = tostring(Record.["id.orig_h"])
| project Timestamp = FirstSeen, Entity = SrcIp,
          Details = pack("QueryCount", QueryCount, "SampleQuery", SampleQuery,
                         "FirstSeen", FirstSeen, "LastSeen", LastSeen)
""",
    },
    # ---- memory: Volatility 3 ----------------------------------------------
    {
        "id": "vol-malfind-injection",
        "title": "Injected / unbacked executable memory (Volatility malfind)",
        "severity": "high",
        "attack": ["T1055"],
        "kind": "kusto",
        "target": "memory.VolatilityJson (windows.malfind)",
        "requires": ["memory.VolatilityJson"],
        # One hit per process per memory image; the raw regions stay in the lane.
        "query": r"""
database("memory").VolatilityJson
| where Plugin == "windows.malfind"
| extend Proc = tostring(Record.Process), Pid = tolong(Record.PID)
| summarize Regions = count(),
            Protections = make_set(tostring(Record.Protection), 10)
          by SourceFile, Proc, Pid
| project Timestamp = datetime(null),
          Entity = strcat(Proc, " (pid ", tostring(Pid), ")"),
          Details = pack("MemoryImage", SourceFile, "Regions", Regions,
                         "Protections", Protections)
""",
    },
    # ---- signature lanes (JSONL outputs, not in Kusto) ----------------------
    {
        "id": "sig-hayabusa-high",
        "title": "Hayabusa high/critical Sigma detection",
        "severity": "high",
        "attack": [],
        "kind": "jsonl",
        "target": "signatures/hayabusa",
        "subdir": "signatures/hayabusa",
        "glob": "*.jsonl",
        "match": match_hayabusa_high,
    },
    {
        "id": "sig-suricata-alert",
        "title": "Suricata IDS alert",
        "severity": "medium",
        "attack": [],
        "kind": "jsonl",
        "target": "signatures/suricata",
        "subdir": "signatures/suricata",
        "glob": "*.jsonl",
        "match": match_suricata_alert,
    },
    {
        "id": "sig-yara-match",
        "title": "YARA rule match",
        "severity": "medium",
        "attack": [],
        "kind": "jsonl",
        "target": "signatures/yara",
        "subdir": "signatures/yara",
        "glob": "*.jsonl",
        "match": match_yara,
    },
]


def validate(detections: list[dict] | None = None) -> None:
    """Fail fast on a malformed registry — a bad entry must stop the run before
    anything executes, not corrupt the output table halfway through a sweep."""
    detections = DETECTIONS if detections is None else detections
    seen: set[str] = set()
    for d in detections:
        did = d.get("id", "")
        prefix = f"detection {did!r}: "
        if not did or not all(c.islower() or c.isdigit() or c == "-" for c in did):
            raise ValueError(prefix + "id must be non-empty kebab-case")
        if did in seen:
            raise ValueError(prefix + "duplicate id")
        seen.add(did)
        if d.get("kind") not in KINDS:
            raise ValueError(prefix + f"kind must be one of {KINDS}")
        if d.get("severity") not in SEVERITIES:
            raise ValueError(prefix + f"severity must be one of {SEVERITIES}")
        for field in ("title", "target"):
            v = d.get(field, "")
            if not v or '"' in v or "\\" in v:
                raise ValueError(prefix + f"{field} must be non-empty, without quotes/backslashes")
        if not isinstance(d.get("attack"), list):
            raise ValueError(prefix + "attack must be a list of ATT&CK ids")
        if d["kind"] == "kusto":
            reqs = d.get("requires")
            if not reqs or not all(isinstance(r, str) and r.count(".") == 1 for r in reqs):
                raise ValueError(prefix + "requires must be a non-empty list of 'db.Table'")
            if not d.get("query", "").strip():
                raise ValueError(prefix + "query must be non-empty KQL")
        else:
            if not d.get("subdir") or not d.get("glob"):
                raise ValueError(prefix + "jsonl entries need subdir and glob")
            if not callable(d.get("match")):
                raise ValueError(prefix + "jsonl entries need a callable match")
