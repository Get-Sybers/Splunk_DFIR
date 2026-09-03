"""Detection hits — the one shape the export consumes, whatever produced it.

A *hit* is one detection firing on one piece of evidence. Two producers land
hits today and both are read here without importing either:

DX envelope
    The ``misc.Detections`` row the runner writes and ``dxdfir detect
    --jsonl-out`` exports: ``RunId, DetectionId, Title, Severity, AttackIds,
    Source, Timestamp, Entity, Details, DetectedAt``.
Elastic documents
    Byakugan's tagged evidence lines — a Detection Engine alert
    (``kibana.alert.rule.rule_id`` / ``kibana.alert.rule.threat``), a
    query-stamped line (``rule.id`` / ``threat.technique.id``), or a
    ``car-detections`` lookup row (``detection.*`` / ``rule.*`` / ``threat.*`` /
    ``event.id``) — read as a bare document, a JSON array, JSON Lines, or a
    whole ``_search`` response (``hits.hits[]._source``).

Only what a STIX consumer can use is lifted: the rule identity, the ATT&CK
technique ids, the time, the observed host, the connection (addresses, ports,
transport / application protocol — a ``network-traffic`` SCO and its
addresses, spec-deterministic ids) and the file, and the CAR guid
(``event.id``) that ties the sighting back to its CAR row. Everything else
stays in ``details``, which only decides whether two rows are the same
observation — it is not exported. Nothing is invented: a hit with no
recognisable address gets no address SCO.
"""
from __future__ import annotations

import ipaddress
import json
import re
from dataclasses import dataclass, field
from typing import Iterator

from .objects import canonical, stix_timestamp, technique_ids

_ARROW_RE = re.compile(r"^\s*(\S+?)\s*->\s*(\S+?)\s*$")     # "src -> dst[:port]"
_HASH_KEYS = (("file.hash.md5", "MD5"), ("file.hash.sha1", "SHA-1"),
              ("file.hash.sha256", "SHA-256"), ("file.hash.sha512", "SHA-512"))
_DETAIL_HOST_KEYS = ("Computer", "host.name", "Hostname", "HostName", "image_hostname")
_DETAIL_TRANSPORT_KEYS = ("network.transport", "proto", "Proto", "transport")
_DETAIL_PROTOCOL_KEYS = ("network.protocol", "app_proto", "service", "Protocol")
_ENVELOPE_KEY = "DetectionId"
_DROP_PREFIXES = ("kibana.", "signal.", "_")     # engine bookkeeping, not evidence


@dataclass
class Hit:
    detection_id: str
    title: str
    severity: str = ""
    attack_ids: list[str] = field(default_factory=list)
    technique_names: dict[str, str] = field(default_factory=dict)
    source: str = ""
    timestamp: str | None = None          # STIX-normalised (UTC, ms) or None
    entity: str = ""
    details: dict = field(default_factory=dict)
    run_id: str = ""
    detected_at: str | None = None
    host: str | None = None
    source_ip: str | None = None
    destination_ip: str | None = None
    destination_port: int | None = None
    source_port: int | None = None
    transport: str | None = None          # network.transport (tcp / udp)
    protocol: str | None = None           # network.protocol (dns / http ...)
    file_name: str | None = None
    file_hashes: dict[str, str] = field(default_factory=dict)
    car_guid: str | None = None

    def key(self) -> str:
        """What makes two rows the SAME observation: run, rule, time, subject, evidence."""
        return canonical([self.run_id, self.detection_id, self.timestamp or "",
                          self.entity, self.details])


# ------------------------------------------------------------------- small helpers
def _ip(value) -> str | None:
    if value is None:
        return None
    try:
        return str(ipaddress.ip_address(str(value).strip()))
    except ValueError:
        return None


def arrow_endpoints(entity: str) -> tuple[str | None, str | None, int | None]:
    """``(src, dst, port)`` from an ``"A -> B[:port]"`` entity when BOTH ends are
    IP addresses (the Suricata / Zeek hit shape); ``(None, None, None)`` otherwise."""
    m = _ARROW_RE.match(entity or "")
    if not m:
        return None, None, None
    src, dst_raw = _ip(m.group(1)), m.group(2)
    dst, port = _ip(dst_raw), None
    if dst is None and ":" in dst_raw:
        head, _, tail = dst_raw.rpartition(":")
        if tail.isdigit():
            dst = _ip(head.strip("[]"))
            port = int(tail) if dst else None
    if src and dst:
        return src, dst, port
    return None, None, None


def flatten(doc: dict, prefix: str = "") -> dict:
    """Nested ``{"host": {"name": ..}}`` -> dotted ``{"host.name": ..}`` (lists kept)."""
    out: dict = {}
    for k, v in doc.items():
        key = f"{prefix}{k}"
        if isinstance(v, dict) and v:
            out.update(flatten(v, key + "."))
        else:
            out[key] = v
    return out


def _scalar(v):
    if isinstance(v, (list, tuple)):
        return next((x for x in v if x is not None), None)
    return v


def _as_list(v) -> list:
    if v is None:
        return []
    return list(v) if isinstance(v, (list, tuple)) else [v]


def _str(v) -> str:
    return "" if v is None else str(v)


def _first(f: dict, *keys):
    for k in keys:
        v = f.get(k)
        if v not in (None, "", []):
            return v
    return None


def _port(v) -> int | None:
    v = _scalar(v)
    if isinstance(v, bool):
        return None
    if isinstance(v, int) or (isinstance(v, str) and v.strip().isdigit()):
        n = int(v)
        return n if 0 <= n <= 65535 else None
    return None


def _proto(v) -> str | None:
    s = _str(_scalar(v)).strip().lower()
    return s or None


def _kibana_threat(threat) -> list[tuple[str, str | None]]:
    """``(technique id, name)`` pairs from a rule's ``threat`` block (framework /
    tactic / technique[] / subtechnique[])."""
    out: list[tuple[str, str | None]] = []
    for entry in _as_list(threat):
        if not isinstance(entry, dict):
            continue
        for t in _as_list(entry.get("technique")):
            if not isinstance(t, dict):
                continue
            for tid in technique_ids(t.get("id")):
                out.append((tid, t.get("name")))
            for sub in _as_list(t.get("subtechnique")):
                if isinstance(sub, dict):
                    for tid in technique_ids(sub.get("id")):
                        out.append((tid, sub.get("name")))
    return out


# ------------------------------------------------------------------ the two shapes
def _from_envelope(doc: dict) -> Hit | None:
    detection_id = _str(doc.get("DetectionId")).strip()
    if not detection_id:
        return None
    details = doc.get("Details")
    if isinstance(details, str):
        try:
            details = json.loads(details)
        except ValueError:
            details = {"value": details}
    if details is None:
        details = {}
    elif not isinstance(details, dict):
        details = {"value": details}
    entity = _str(doc.get("Entity"))
    hit = Hit(
        detection_id=detection_id, title=_str(doc.get("Title")) or detection_id,
        severity=_str(doc.get("Severity")).lower(), attack_ids=technique_ids(doc.get("AttackIds")),
        source=_str(doc.get("Source")), timestamp=stix_timestamp(doc.get("Timestamp")),
        entity=entity, details=details, run_id=_str(doc.get("RunId")),
        detected_at=stix_timestamp(doc.get("DetectedAt")),
    )
    hit.source_ip, hit.destination_ip, hit.destination_port = arrow_endpoints(entity)
    for k in _DETAIL_HOST_KEYS:
        if details.get(k):
            hit.host = str(details[k])
            break
    hit.transport = _proto(_first(details, *_DETAIL_TRANSPORT_KEYS))
    hit.protocol = _proto(_first(details, *_DETAIL_PROTOCOL_KEYS))
    return hit


def _from_elastic(doc: dict) -> Hit | None:
    f = flatten(doc)
    detection_id = _str(_scalar(_first(
        f, "detection.id", "rule.id", "kibana.alert.rule.rule_id", "signal.rule.id"))).strip()
    if not detection_id:
        return None
    ids = technique_ids(f.get("threat.technique.id"))
    names: dict[str, str] = {}
    tids, tnames = _as_list(f.get("threat.technique.id")), _as_list(f.get("threat.technique.name"))
    if tids and len(tids) == len(tnames):
        for raw, name in zip(tids, tnames, strict=True):
            for tid in technique_ids(raw):
                if name:
                    names[tid] = str(name)
    for tid, name in _kibana_threat(f.get("kibana.alert.rule.threat")):
        if tid not in ids:
            ids.append(tid)
        if name:
            names.setdefault(tid, str(name))
    src, dst = _ip(_scalar(f.get("source.ip"))), _ip(_scalar(f.get("destination.ip")))
    port, sport = _port(f.get("destination.port")), _port(f.get("source.port"))
    host = _str(_scalar(_first(f, "host.name", "host.hostname")))
    file_name = _str(_scalar(_first(f, "file.name", "file.path")))
    hashes = {label: str(v) for key, label in _HASH_KEYS if (v := _scalar(f.get(key)))}
    car_guid = _str(_scalar(f.get("event.id"))) or None
    if src and dst:
        arrow = f"{src} -> {dst}" + (f":{port}" if port else "")
    else:
        arrow = ""
    entity = host or arrow or file_name or _str(_scalar(f.get("process.name"))) or car_guid or ""
    return Hit(
        detection_id=detection_id,
        title=_str(_scalar(_first(f, "rule.name", "kibana.alert.rule.name"))) or detection_id,
        severity=_str(_scalar(_first(
            f, "detection.severity", "kibana.alert.severity", "event.severity"))).lower(),
        attack_ids=ids, technique_names=names,
        source=_str(_scalar(_first(f, "detection.source_index", "_index", "event.dataset"))),
        timestamp=stix_timestamp(_scalar(_first(f, "kibana.alert.original_time", "@timestamp"))),
        entity=entity,
        details={k: v for k, v in f.items() if not k.startswith(_DROP_PREFIXES)},
        run_id=_str(_scalar(_first(f, "detection.run_id", "kibana.alert.rule.execution.uuid"))),
        detected_at=stix_timestamp(_scalar(_first(
            f, "detection.detected_at", "kibana.alert.last_detected", "kibana.alert.start"))),
        host=host or None, source_ip=src, destination_ip=dst, destination_port=port, source_port=sport,
        transport=_proto(f.get("network.transport")), protocol=_proto(f.get("network.protocol")),
        file_name=file_name or None, file_hashes=hashes, car_guid=car_guid,
    )


def hit_from_document(doc) -> Hit | None:
    """One document -> one :class:`Hit`, or ``None`` when it names no detection
    (a context row, a flow record, an unrelated document) — never a guess."""
    if not isinstance(doc, dict):
        return None
    if _ENVELOPE_KEY in doc:
        return _from_envelope(doc)
    return _from_elastic(doc)


# ---------------------------------------------------------------------- readers
def iter_documents(path: str) -> Iterator[dict]:
    """Documents in ``path``: a JSON array, a single document, an Elasticsearch
    ``_search`` response (``hits.hits[]._source``, with ``_index`` / ``_id``
    kept), or JSON Lines. Unparseable JSONL lines are skipped (counted by
    :func:`read_hits`). A STIX bundle is refused — it goes through ``--bundle``."""
    with open(path, encoding="utf-8", errors="replace") as fh:
        text = fh.read()
    stripped = text.strip()
    if not stripped:
        return
    if stripped[0] in "[{":
        try:
            doc = json.loads(stripped)
        except ValueError:
            doc = None                      # multi-line JSONL: fall through
        if isinstance(doc, list):
            yield from (d for d in doc if isinstance(d, dict))
            return
        if isinstance(doc, dict):
            if doc.get("type") == "bundle" and "objects" in doc:
                raise ValueError(f"{path} is a STIX bundle — pass it with --bundle, not --hits")
            hits = doc.get("hits")
            if isinstance(hits, dict) and isinstance(hits.get("hits"), list):
                for h in hits["hits"]:
                    if not isinstance(h, dict):
                        continue
                    src = dict(h.get("_source") or {})
                    for k in ("_index", "_id"):
                        if k in h:
                            src[k] = h[k]
                    yield src
                return
            yield doc
            return
    for line in text.splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            rec = json.loads(line)
        except ValueError:
            yield {"__unparseable__": True}
            continue
        if isinstance(rec, dict):
            yield rec


def read_hits(path: str) -> tuple[list[Hit], dict]:
    """Every hit in ``path`` plus a small report: documents seen, hits lifted,
    documents skipped (no detection / unparseable)."""
    hits: list[Hit] = []
    report = {"path": str(path), "kind": "hits", "documents": 0, "hits": 0, "skipped": 0}
    for doc in iter_documents(str(path)):
        report["documents"] += 1
        hit = None if doc.get("__unparseable__") else hit_from_document(doc)
        if hit is None:
            report["skipped"] += 1
            continue
        hits.append(hit)
    report["hits"] = len(hits)
    return hits, report
