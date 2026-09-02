"""Assemble, merge, validate and write the STIX 2.1 bundle; drive the push.

``hit_objects()`` turns detection hits into the object graph — per hit one
``sighting`` of the rule's ``indicator``, ``indicates`` -> ``attack-pattern``
SROs (class ``declared``: the rule author declared the technique), the observed
host as an ``identity`` in ``where_sighted_refs``, and, when the hit names an
address or a file, spec-deterministic SCOs wrapped in an ``observed-data``.
Identical rows (same run, rule, time, subject, evidence) collapse into one
sighting with ``count`` incremented — the observation, not the row, is the
object.

``merge_objects()`` folds PIIAT's bundles in object-for-object. PIIAT projects
its CAR stores to STIX itself; DX does not re-derive anything, does not touch
ids, and resolves a duplicate id by keeping the newest ``modified`` — nothing
is dropped for being unfamiliar, so a superset of both producers reaches the
exchange.

``validate_bundle()`` is the well-formedness gate (structure = errors,
unresolved references = warnings: a PIIAT bundle may legitimately point at
objects held elsewhere, an ATT&CK collection say). ``run_export()`` is the
whole verb: read, assemble, validate, write, optionally push.
"""
from __future__ import annotations

import json
import os
import re
from collections import Counter
from collections.abc import Callable, Iterable

import yaml

from . import objects as o
from .config import StixConfig
from .hits import Hit, read_hits
from .opencti import OpenCTIClient, Transport

_ID_RE = re.compile(
    r"^([a-z][a-z0-9-]*)--[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$")
# Objects the export produces itself, whose created/modified are mandatory.
_DATED_TYPES = ("attack-pattern", "identity", "indicator", "observed-data",
                "relationship", "sighting")
UNCASED = "uncased"
PatternSource = Callable[[str], "tuple[str, str] | None"]


# ---------------------------------------------------------------- pattern source
def rules_pattern_source(rules_dir: str) -> PatternSource:
    """Indicator patterns from a rules-as-code directory: ``<detection id>.yml``
    with ``query`` + ``language`` (the Byakugan Elastic rule shape) supplies the
    real rule as the pattern, ``pattern_type`` = its language. A stub rule
    (``query: null``) or an unknown id falls back to the reference pattern."""
    cache: dict[str, tuple[str, str] | None] = {}

    def lookup(detection_id: str) -> tuple[str, str] | None:
        if detection_id in cache:
            return cache[detection_id]
        found = None
        for ext in (".yml", ".yaml"):
            path = os.path.join(rules_dir, detection_id + ext)
            if not os.path.isfile(path):
                continue
            with open(path, encoding="utf-8") as fh:
                try:
                    doc = yaml.safe_load(fh)
                except yaml.YAMLError as e:
                    raise ValueError(f"{path}: invalid YAML: {e}") from e
            if isinstance(doc, dict) and doc.get("query") and doc.get("language"):
                found = (str(doc["query"]).strip(), str(doc["language"]))
            break
        cache[detection_id] = found
        return found

    return lookup


# --------------------------------------------------------------- hits -> objects
def hit_objects(hits: Iterable[Hit], *, case_id: str | None = None,
                producer: str = o.DEFAULT_PRODUCER, tlp: str | None = "amber",
                pattern_source: PatternSource | None = None,
                now: str | None = None) -> dict[str, dict]:
    """The object graph for ``hits``, keyed by id (insertion-ordered)."""
    hits = list(hits)
    now = now or o.utc_now()
    case = case_id or next((h.run_id for h in hits if h.run_id), UNCASED)
    marking_ref = None
    objs: dict[str, dict] = {}

    def put(obj: dict) -> str:
        o.mark(obj, marking_ref)
        objs.setdefault(obj["id"], obj)
        return obj["id"]

    created_by = put(o.producer_identity(producer, now))
    if tlp and str(tlp).lower() not in ("none", "no", "off", ""):
        marking_ref = put(o.tlp_marking(tlp))
        o.mark(objs[created_by], marking_ref)

    for hit in hits:
        pattern = pattern_source(hit.detection_id) if pattern_source else None
        ind = put(o.indicator(
            hit.detection_id, hit.title, now, created_by, severity=hit.severity,
            source=hit.source, pattern=pattern[0] if pattern else None,
            pattern_type=pattern[1] if pattern else None))
        for tid in hit.attack_ids:
            ap = put(o.attack_pattern(tid, now, created_by, name=hit.technique_names.get(tid)))
            put(o.relationship(ind, ap, "indicates", now, created_by,
                               relationship_class=o.RELATIONSHIP_CLASS_DECLARED))
        where = [put(o.host_identity(hit.host, now, created_by))] if hit.host else None
        scos = [s for s in (o.ip_address(hit.source_ip), o.ip_address(hit.destination_ip),
                            o.file_observable(hit.file_name, hit.file_hashes)) if s]
        key = hit.key()
        observed = None
        if scos:
            when = hit.timestamp or hit.detected_at or now
            observed = [put(o.observed_data(case, key, [put(s) for s in scos], when, when,
                                            now, created_by))]
        sid = o.case_scoped_id("sighting", case, key)
        if sid in objs:
            objs[sid]["count"] = int(objs[sid].get("count", 1)) + 1
            continue
        custom = {"case_id": case, "run_id": hit.run_id, "detection_id": hit.detection_id,
                  "severity": hit.severity, "source": hit.source, "entity": hit.entity,
                  "details": hit.details}
        if hit.car_guid:
            custom["car_guid"] = hit.car_guid
        put(o.sighting(
            case, key, ind, hit.detected_at or now, created_by,
            first_seen=hit.timestamp, last_seen=hit.timestamp, count=1,
            observed_data_refs=observed, where_sighted_refs=where,
            description=f"{hit.title} — {hit.entity}" if hit.entity else hit.title,
            custom=custom))
    return objs


def bundle_id(objects: Iterable[dict]) -> str:
    """Deterministic over the object ids: the same content is the same bundle."""
    return o.global_id("bundle", *sorted(obj["id"] for obj in objects))


def make_bundle(objects: dict[str, dict]) -> dict:
    return {"type": "bundle", "id": bundle_id(objects.values()), "objects": list(objects.values())}


def build_bundle(hits: Iterable[Hit], **kw) -> dict:
    """Detection hits -> one STIX 2.1 bundle (see :func:`hit_objects` for ``kw``)."""
    return make_bundle(hit_objects(hits, **kw))


# ------------------------------------------------------------------ pass-through
def load_bundle(path: str) -> dict:
    """A STIX bundle from disk; ``ValueError`` when the file is not one."""
    with open(path, encoding="utf-8") as fh:
        doc = json.load(fh)
    if not isinstance(doc, dict) or doc.get("type") != "bundle" or not isinstance(doc.get("objects"), list):
        raise ValueError(f"{path} is not a STIX bundle (expected type 'bundle' with 'objects')")
    return doc


def merge_objects(objects: dict[str, dict], incoming: Iterable[dict]) -> dict:
    """Fold ``incoming`` into ``objects`` by id. New ids are added; a duplicate
    keeps the newest ``modified`` (ties keep what is there). Nothing is
    dropped for its type — the exchange carries what both producers emit."""
    counts = {"added": 0, "replaced": 0, "kept": 0, "invalid": 0}
    for obj in incoming:
        if not isinstance(obj, dict) or not isinstance(obj.get("id"), str) or not obj.get("type"):
            counts["invalid"] += 1
            continue
        have = objects.get(obj["id"])
        if have is None:
            objects[obj["id"]] = obj
            counts["added"] += 1
        elif (o.stix_timestamp(obj.get("modified")) or "") > (o.stix_timestamp(have.get("modified")) or ""):
            objects[obj["id"]] = obj
            counts["replaced"] += 1
        else:
            counts["kept"] += 1
    return counts


def assemble(hits: Iterable[Hit], passthrough: Iterable[dict] = (), **kw) -> tuple[dict, dict]:
    """Hits + pass-through bundles -> ``(bundle, report)``."""
    objs = hit_objects(hits, **kw)
    report = {"from_hits": len(objs), "merged": []}
    for bundle in passthrough:
        counts = merge_objects(objs, bundle.get("objects") or [])
        counts["bundle_id"] = bundle.get("id")
        report["merged"].append(counts)
    return make_bundle(objs), report


# -------------------------------------------------------------------- validation
def validate_bundle(bundle) -> tuple[list[str], list[str]]:
    """``(errors, warnings)``. Errors: not a bundle, bad/duplicate ids, an id
    whose prefix is not its type, a produced object missing what the spec
    requires. Warnings: a non-2.1 ``spec_version``, references that do not
    resolve inside the bundle."""
    errors: list[str] = []
    warnings: list[str] = []
    if not isinstance(bundle, dict) or bundle.get("type") != "bundle":
        return ["not a STIX bundle (type != 'bundle')"], warnings
    bid = bundle.get("id")
    if not isinstance(bid, str) or not bid.startswith("bundle--") or not _ID_RE.match(bid):
        errors.append(f"bad bundle id {bid!r}")
    objs = bundle.get("objects")
    if not isinstance(objs, list) or not objs:
        errors.append("bundle has no objects")
        return errors, warnings
    ids: set[str] = set()
    valid: list[dict] = []
    for i, obj in enumerate(objs):
        if not isinstance(obj, dict):
            errors.append(f"objects[{i}] is not an object")
            continue
        t, oid = obj.get("type"), obj.get("id")
        if not isinstance(t, str) or not t or not isinstance(oid, str) or not _ID_RE.match(oid):
            errors.append(f"objects[{i}] has no valid type/id")
            continue
        if not oid.startswith(f"{t}--"):
            errors.append(f"{oid}: id prefix does not match type {t!r}")
        if oid in ids:
            errors.append(f"{oid}: duplicate id")
        ids.add(oid)
        valid.append(obj)
        if obj.get("spec_version") != o.SPEC_VERSION:
            warnings.append(f"{oid}: spec_version is {obj.get('spec_version')!r}, not '2.1'")
        if t in _DATED_TYPES:
            for k in ("created", "modified"):
                if not obj.get(k):
                    errors.append(f"{oid}: missing {k}")
        required = {"relationship": ("relationship_type", "source_ref", "target_ref"),
                    "sighting": ("sighting_of_ref",),
                    "indicator": ("pattern", "pattern_type", "valid_from"),
                    "observed-data": ("first_observed", "last_observed", "number_observed", "object_refs")}
        for k in required.get(t, ()):
            if obj.get(k) in (None, "", []):
                errors.append(f"{oid}: missing {k}")
    for obj in valid:
        for k, v in obj.items():
            refs = [v] if k.endswith("_ref") and isinstance(v, str) else \
                   [r for r in v if isinstance(r, str)] if k.endswith("_refs") and isinstance(v, list) else []
            for ref in refs:
                if ref not in ids:
                    warnings.append(f"{obj['id']}: {k} -> {ref} not in bundle")
    return errors, warnings


def relationship_class(obj: dict) -> str:
    """``declared`` / ``derived`` from an SRO's labels (or an explicit
    ``x_relationship_class``); ``unlabelled`` when a producer said nothing."""
    labels = obj.get("labels") if isinstance(obj.get("labels"), list) else []
    for cls in o.RELATIONSHIP_CLASSES:
        if cls in labels:
            return cls
    explicit = obj.get("x_relationship_class")
    return explicit if explicit in o.RELATIONSHIP_CLASSES else "unlabelled"


def summarise(bundle: dict) -> dict:
    objs = [x for x in bundle.get("objects", []) if isinstance(x, dict)]
    by_type = Counter(str(x.get("type")) for x in objs)
    classes = Counter(relationship_class(x) for x in objs if x.get("type") == "relationship")
    return {"objects": len(objs), "by_type": dict(sorted(by_type.items())),
            "sightings": by_type.get("sighting", 0), "indicators": by_type.get("indicator", 0),
            "relationship_classes": dict(sorted(classes.items()))}


def write_bundle(bundle: dict, path: str, pretty: bool = True) -> None:
    parent = os.path.dirname(os.path.abspath(path))
    os.makedirs(parent, exist_ok=True)
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(bundle, fh, indent=2 if pretty else None, ensure_ascii=False, default=str)
        fh.write("\n")


# ---------------------------------------------------------------------- the verb
def run_export(cfg: StixConfig, hit_paths: Iterable[str] = (), bundle_paths: Iterable[str] = (),
               *, transport: Transport | None = None, now: str | None = None) -> tuple[dict, dict]:
    """Read hits + bundles, assemble, validate, write ``cfg.out`` (if set), push
    to OpenCTI (if ``cfg.push``). Returns ``(summary, bundle)``; ``summary["ok"]``
    is False when validation failed (nothing is written or pushed then) or the
    push was refused. ``ValueError`` when there is nothing to export or an input
    is not what it claims to be."""
    summary: dict = {"tool": "stix-export", "config": cfg.redacted(), "inputs": [],
                     "bundle": None, "validation": {"errors": [], "warnings": []},
                     "push": None, "ok": True}
    hits: list[Hit] = []
    for p in hit_paths:
        found, report = read_hits(str(p))
        hits.extend(found)
        summary["inputs"].append(report)
    passthrough: list[dict] = []
    for p in bundle_paths:
        b = load_bundle(str(p))
        passthrough.append(b)
        summary["inputs"].append({"path": str(p), "kind": "bundle", "objects": len(b["objects"])})
    if not hits and not passthrough:
        raise ValueError("nothing to export: no detection hits and no bundles were read")

    pattern_source = rules_pattern_source(cfg.rules_dir) if cfg.rules_dir else None
    bundle, merge = assemble(hits, passthrough, case_id=cfg.case_id, producer=cfg.producer,
                             tlp=cfg.tlp, pattern_source=pattern_source, now=now)
    errors, warnings = validate_bundle(bundle)
    summary["validation"] = {"errors": errors, "warnings": warnings}
    summary["merge"] = merge
    summary["summary"] = summarise(bundle)
    summary["bundle_id"] = bundle["id"]
    if errors:
        summary["ok"] = False
        return summary, bundle

    if cfg.out:
        write_bundle(bundle, cfg.out)
        summary["bundle"] = cfg.out
    if cfg.push:
        client = OpenCTIClient(cfg.opencti_url, cfg.opencti_token,
                               connector_id=cfg.opencti_connector_id,
                               transport=transport, timeout=cfg.timeout)
        result = client.push_bundle(bundle)
        summary["push"] = result.as_dict()
        summary["ok"] = result.ok
    return summary, bundle
