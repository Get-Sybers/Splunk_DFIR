"""Indicator-match alerts -> STIX 2.1 sightings of OpenCTI's own indicators.

The round trip's second half. When the Detection Engine's indicator-match rule
(``detect/rules/cti/cti-indicator-match.yml``) flags an evidence line against
the ``cti-*`` copy, the alert carries one ``threat.enrichments[]`` item per
matched indicator: the indicator's ``threat.indicator.*`` (whose ``id`` is the
STIX id the copy was made from) plus ``matched.{field, atomic, id, index}``.
This module reads those alerts and emits, per (indicator, host, matched
value), one ``sighting`` whose ``sighting_of_ref`` IS the platform's indicator
id — so OpenCTI attaches the sighting to the indicator it already holds
instead of receiving a second copy of it (BP §5.13: an SDO you observe is a
Sighting). Each alert's matched value becomes the spec's SCO in its own
``observed-data`` (one observation per alert time — a connected graph of one,
§4.14); the host that saw it (or, when the alert names none, the producer) is
``where_sighted_refs``. Alerts with the same (indicator, host, value)
collapse into one sighting: ``count``, ``first_seen`` / ``last_seen`` and the
observed-data references span them, the alert ids accumulate in the DX_DFIR
extension. Every time on an object is an observation time — ``created`` the
earliest, ``modified`` the latest alert — never the export clock, so
re-running over the same alerts in the same case yields the same objects
(case-scoped ids, decision D4; STIX 2.1 §3.2 / §3.6).

The platform's indicator is NOT re-emitted — an incoming object under its id
would be an update of the platform's own record — so ``validate_bundle``
warns (the reference resolves on the platform) and never errors on it.
Alerts without an enrichment, without a time, and enrichments without an
indicator id, are skipped and counted, never guessed.
"""
from __future__ import annotations

import re
from collections.abc import Iterable

from .. import objects as o
from ..config import StixConfig
from ..export import UNCASED, make_bundle, summarise, validate_bundle, write_bundle
from ..hits import flatten, iter_documents
from ..opencti import OpenCTIClient, Transport

_INDICATOR_ID_RE = re.compile(r"^indicator--[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$")
_HASH_FIELD_RE = re.compile(r"(?:^|\.)hash\.(md5|sha1|sha256|sha512)$")
_HASH_LABELS = {"md5": "MD5", "sha1": "SHA-1", "sha256": "SHA-256", "sha512": "SHA-512"}


def _scalar(v):
    if isinstance(v, (list, tuple)):
        return next((x for x in v if x is not None), None)
    return v


def _str(v) -> str:
    v = _scalar(v)
    return "" if v is None else str(v)


def _first(f: dict, *keys):
    for k in keys:
        v = f.get(k)
        if v not in (None, "", []):
            return v
    return None


def _clean(d: dict) -> dict:
    return {k: v for k, v in d.items() if v not in (None, "")}


def enrichments(doc: dict) -> list[dict]:
    """The alert's ``threat.enrichments`` items, each flattened to dotted keys
    (``indicator.id``, ``matched.atomic`` ...), from a nested or an already
    dotted document."""
    items = flatten(doc).get("threat.enrichments")
    if isinstance(items, dict):
        items = [items]
    return [flatten(e) for e in (items or []) if isinstance(e, dict)]


def matched_observable(field: str, atomic) -> dict | None:
    """The matched value as the spec's SCO — an address, a file (by the hash
    the field names), a domain name or a URL — or ``None`` when the field is
    none of those (a registry key match is sighted without an observable)."""
    if atomic in (None, ""):
        return None
    if field == "ip" or field.endswith(".ip"):
        return o.ip_address(atomic)
    m = _HASH_FIELD_RE.search(field)
    if m:
        return o.file_observable(hashes={_HASH_LABELS[m.group(1)]: atomic})
    if field == "dns.question.name" or field.endswith(".domain"):
        return o.domain_name(atomic)
    if field.startswith("url."):
        return o.url(atomic)
    return None


def alert_sightings(alerts: Iterable[dict], *, case_id: str | None = None,
                    producer: str = o.DEFAULT_PRODUCER, tlp: str | None = "amber",
                    contact: str | None = o.DEFAULT_CONTACT,
                    confidence: int | None = None) -> tuple[dict[str, dict], dict]:
    """The object graph for indicator-match ``alerts`` (keyed by id, insertion
    ordered) and a report: alerts read, enrichments seen, sightings made, and
    what was skipped by reason."""
    alerts = [a for a in alerts if isinstance(a, dict)]
    flat = [flatten(a) for a in alerts]
    case = case_id or next((_str(f.get("kibana.alert.rule.execution.uuid"))
                            for f in flat if f.get("kibana.alert.rule.execution.uuid")), UNCASED)
    marking_ref = o.tlp_marking_ref(tlp) if tlp and str(tlp).lower() not in ("none", "no", "off", "") else None
    objs: dict[str, dict] = {}
    report: dict = {"alerts": len(alerts), "enrichments": 0, "sightings": 0, "skipped": {}}

    def put(obj: dict) -> str:
        o.mark(obj, marking_ref)
        objs.setdefault(obj["id"], obj)
        return obj["id"]

    def skip(reason: str) -> None:
        report["skipped"][reason] = report["skipped"].get(reason, 0) + 1

    created_by = put(o.producer_identity(producer, contact))
    put(o.extension_definition(created_by))

    for a, f in zip(alerts, flat, strict=True):
        items = enrichments(a)
        if not items:
            skip("no_enrichment")
            continue
        host = _str(_first(f, "host.name", "host.hostname"))
        detected_at = o.stix_timestamp(_scalar(f.get("@timestamp")))
        seen_at = o.stix_timestamp(_scalar(_first(f, "kibana.alert.original_time", "@timestamp"))) or detected_at
        if not seen_at:
            skip("undated_alert")
            continue
        detected_at = max(detected_at or seen_at, seen_at)
        rule_id = _str(_first(f, "kibana.alert.rule.rule_id", "rule.id"))
        rule_name = _str(_first(f, "kibana.alert.rule.name", "rule.name"))
        alert_id = _str(_first(f, "kibana.alert.uuid", "_id"))
        source = _str(_first(f, "_index", "kibana.alert.ancestors.index"))
        for e in items:
            report["enrichments"] += 1
            ref = _str(_first(e, "indicator.id", "matched.id"))
            if not _INDICATOR_ID_RE.match(ref):
                skip("no_indicator_ref")
                continue
            field, atomic = _str(e.get("matched.field")), _scalar(e.get("matched.atomic"))
            key = o.canonical([ref, host, field, "" if atomic is None else str(atomic)])
            sid = o.case_scoped_id("sighting", case, key)
            observed = None
            sco = matched_observable(field, atomic)
            if sco:
                observed = put(o.observed_data(case, o.canonical([key, seen_at]), "match", [put(sco)],
                                               seen_at, seen_at, created_by=created_by))
            if sid in objs:
                s = objs[sid]
                s["count"] = int(s.get("count", 1)) + 1
                s["first_seen"] = min(s.get("first_seen") or seen_at, seen_at)
                s["last_seen"] = max(s.get("last_seen") or seen_at, seen_at)
                s["created"] = min(s["created"], seen_at)
                s["modified"] = max(s["modified"], detected_at)
                if observed and observed not in s.setdefault("observed_data_refs", []):
                    s["observed_data_refs"].append(observed)
                ids = s["extensions"][o.EXTENSION_ID].setdefault("alert_ids", [])
                if alert_id and alert_id not in ids:
                    ids.append(alert_id)
                continue
            where = [put(o.host_identity(host, created_by))] if host else [created_by]
            description = f"{rule_name or rule_id or 'indicator match'}: {field} = {atomic}" + \
                (f" on {host}" if host else "")
            put(o.sighting(
                case, key, ref, created=seen_at, modified=detected_at, created_by=created_by,
                first_seen=seen_at, last_seen=seen_at, count=1,
                observed_data_refs=[observed] if observed else None, where_sighted_refs=where,
                description=description, confidence=confidence,
                dx={"case_id": case, "detection_id": rule_id, "source": source, "feed": _str(e.get("feed.name")),
                    "matched": _clean({"field": field, "atomic": atomic, "index": _str(e.get("matched.index")),
                                       "id": _str(e.get("matched.id"))}),
                    "indicator": _clean({"type": _str(e.get("indicator.type")),
                                         "name": _str(e.get("indicator.name")),
                                         "provider": _str(e.get("indicator.provider"))}),
                    "alert_ids": [alert_id] if alert_id else []}))
            report["sightings"] += 1
    return objs, report


def build_sightings_bundle(alerts: Iterable[dict], **kw) -> dict:
    """Indicator-match alerts -> one STIX 2.1 bundle (see :func:`alert_sightings` for ``kw``)."""
    return make_bundle(alert_sightings(alerts, **kw)[0])


def read_alerts(path: str) -> tuple[list[dict], dict]:
    """Every document in ``path`` (an Elasticsearch ``_search`` response over
    ``.alerts-security.alerts-*``, a JSON array, one document, or JSON Lines)
    plus a small report; unparseable JSONL lines are counted, not read."""
    docs: list[dict] = []
    report = {"path": str(path), "kind": "alerts", "documents": 0, "unparseable": 0}
    for doc in iter_documents(str(path)):
        if doc.get("__unparseable__"):
            report["unparseable"] += 1
            continue
        docs.append(doc)
    report["documents"] = len(docs)
    return docs, report


def run_sightings(cfg: StixConfig, alert_paths: Iterable[str], *,
                  transport: Transport | None = None) -> tuple[dict, dict]:
    """Read alerts, build the sightings bundle, validate, write ``cfg.out``
    (if set), push to OpenCTI (if ``cfg.push``). Returns ``(summary, bundle)``;
    ``summary["ok"]`` is False when validation failed (nothing is written or
    pushed then) or the push was refused. ``ValueError`` when no alert was
    read or none carries an indicator-match enrichment."""
    summary: dict = {"tool": "stix-sightings", "config": cfg.redacted(), "inputs": [],
                     "bundle": None, "validation": {"errors": [], "warnings": []},
                     "push": None, "ok": True}
    alerts: list[dict] = []
    for p in alert_paths:
        docs, report = read_alerts(str(p))
        alerts.extend(docs)
        summary["inputs"].append(report)
    if not alerts:
        raise ValueError("nothing to sight: no alerts were read")
    objs, report = alert_sightings(alerts, case_id=cfg.case_id, producer=cfg.producer, tlp=cfg.tlp,
                                   contact=cfg.contact, confidence=cfg.confidence)
    summary["sightings"] = report
    if not report["sightings"]:
        raise ValueError("no indicator-match enrichment in the alerts "
                         "(threat.enrichments[] with an indicator id) — nothing to sight")
    bundle = make_bundle(objs)
    errors, warnings = validate_bundle(bundle)
    summary["validation"] = {"errors": errors, "warnings": warnings}
    summary["summary"] = summarise(bundle)
    summary["bundle_id"] = bundle["id"]
    if errors:
        summary["ok"] = False
        return summary, bundle
    if cfg.out:
        write_bundle(bundle, cfg.out)
        summary["bundle"] = cfg.out
    if cfg.push:
        client = OpenCTIClient(cfg.opencti_url, cfg.opencti_token, connector_id=cfg.opencti_connector_id,
                               transport=transport, timeout=cfg.timeout)
        result = client.push_bundle(bundle)
        summary["push"] = result.as_dict()
        summary["ok"] = result.ok
    return summary, bundle
