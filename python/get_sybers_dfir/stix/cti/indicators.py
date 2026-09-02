"""OpenCTI's STIX 2.1 indicators -> the ``cti-*`` copy Elastic's indicator-match reads.

The detection engine stays Elastic (decision D4): OpenCTI is only where the
indicators come from. This module turns STIX indicator objects — pulled by
:meth:`..opencti.OpenCTIClient.pull_indicators`, or read from any STIX bundle
— into documents for the ``cti-*`` index whose atomic values sit under ECS
``threat.indicator.*``, the ``threat_indicator_path`` the Detection Engine's
indicator-match rule (``detect/rules/cti/cti-indicator-match.yml``) reads.
Their ``_id`` is the STIX indicator id, so a re-pull upserts.

Which STIX comparison lands in which field is DATA (``pattern-mapping.yml``);
the index shape is DATA too (``cti.index-template.json``, strict mapping), and
:func:`to_cti_docs` refuses to emit a field the template does not map. The
pattern reader is deliberately not a STIX pattern parser: it lifts the
unnegated ``=`` comparisons out of a pattern (the only thing an indicator
match can use) and leaves the verbatim pattern under ``stix.pattern`` as the
authoritative expression. An indicator that yields no atomic (a YARA / Sigma
pattern, a CIDR, an unmapped observable) is skipped and counted, never
guessed. Pure apart from the file loaders; nothing here touches a store.
"""
from __future__ import annotations

import ipaddress
import json
import os
import re
from collections.abc import Iterable, Iterator
from dataclasses import dataclass

import yaml

from .. import objects as o
from ..config import StixConfig
from ..export import load_bundle, validate_bundle, write_bundle
from ..hits import flatten
from ..opencti import DEFAULT_PAGE_SIZE, OpenCTIClient, Transport

_HERE = os.path.dirname(os.path.abspath(__file__))
PATTERN_MAPPING = os.path.join(_HERE, "pattern-mapping.yml")
INDEX_TEMPLATE = os.path.join(_HERE, "cti.index-template.json")
DEFAULT_FEED = "opencti"
VALUE_TYPES = ("ip", "integer", "string")
# ECS threat.indicator.confidence, spelled as ECS expects (STIX 2.1 §3.2's
# None / Low / Med / High scale: 0, 1-29, 30-69, 70-100).
CONFIDENCE_LABELS = ("Not Specified", "None", "Low", "Medium", "High")
_TLP_RANK = {"WHITE": 0, "CLEAR": 0, "GREEN": 1, "AMBER": 2, "AMBER+STRICT": 3, "RED": 4}
_TLP_V2_ONLY = ("CLEAR", "AMBER+STRICT")
_SPEC_TLP_NAMES = {mid: level.upper() for level, mid in o.TLP_MARKING_IDS.items()}
_INDICATOR_ID_RE = re.compile(r"^indicator--[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$")
_FIELD_RE = re.compile(r"^[@a-z][a-z0-9_]*(?:\.[A-Za-z0-9_]+)*$")
_SCO_TYPE_RE = re.compile(r"^[a-z0-9][a-z0-9-]*$")
_INDEX_RE = re.compile(r"^cti-[a-z0-9_.*-]*$")       # a cti-* pattern or a concrete cti- name
_ES_TYPES = {"ip": ("ip",), "integer": ("long", "integer", "short"), "string": ("keyword", "wildcard", "text")}

# One STIX comparison expression: an object path (type:property, property
# segments plain or quoted, list indexes allowed), an optional NOT, a
# comparator and a literal. Only the unnegated '=' form with a string or
# number literal is an atomic indicator; everything else is passed over.
_PATH = (r"[a-z][a-z0-9-]*:(?:[A-Za-z0-9_]+|'[^']*'|\"[^\"]*\")"
         r"(?:\.(?:[A-Za-z0-9_-]+|'[^']*'|\"[^\"]*\")|\[[^\]]*\])*")
_COMPARISON_RE = re.compile(
    r"(?P<path>" + _PATH + r")\s*(?P<neg>NOT\s+)?"
    r"(?P<op>!=|<=|>=|=|<|>|IN|LIKE|MATCHES|ISSUBSET|ISSUPERSET)\s*"
    r"(?P<value>'(?:[^'\\]|\\.)*'|-?\d+(?:\.\d+)?|true|false)", re.I)


# ------------------------------------------------------------------ the pattern
def parse_pattern(pattern: str) -> list[tuple[str, str]]:
    """The unnegated ``=`` comparisons of a STIX pattern as ``(object path,
    value)`` pairs in order — quotes around property names stripped
    (``file:hashes.'SHA-256'`` -> ``file:hashes.SHA-256``), string escapes
    undone. Not a parser: qualifiers, observation operators and every other
    comparator are passed over; they cannot be atomic indicators."""
    out: list[tuple[str, str]] = []
    for m in _COMPARISON_RE.finditer(pattern or ""):
        if m.group("neg") or m.group("op") != "=":
            continue
        raw = m.group("value")
        value = re.sub(r"\\(.)", r"\1", raw[1:-1]) if raw.startswith("'") else raw
        out.append((re.sub(r"['\"]", "", m.group("path")), value))
    return out


def _key(path: str) -> str:
    """A lookup key that forgives the spellings producers use for the same
    property (``file:hashes.'SHA-256'`` / ``file:hashes.sha256``)."""
    return re.sub(r"[-_'\"]", "", str(path)).lower()


# ------------------------------------------------------------- pattern mapping
def validate_pattern_mapping(doc) -> None:
    """The mapping data must name an indicator path and a non-empty list of
    comparisons, each with a STIX object path, an ECS field under that path, a
    type and a value type — no two comparisons for the same path."""
    if not isinstance(doc, dict):
        raise ValueError("pattern-mapping: must be a mapping (indicator_path, comparisons)")
    ip = doc.get("indicator_path")
    if not isinstance(ip, str) or not _FIELD_RE.match(ip):
        raise ValueError("pattern-mapping: indicator_path must be a field path (threat.indicator)")
    comps = doc.get("comparisons")
    if not isinstance(comps, list) or not comps:
        raise ValueError("pattern-mapping: comparisons must be a non-empty list")
    seen: set[str] = set()
    for c in comps:
        if not isinstance(c, dict):
            raise ValueError("pattern-mapping: each comparison must be a mapping")
        stix = c.get("stix")
        if not isinstance(stix, str) or ":" not in stix or not stix.strip():
            raise ValueError(f"pattern-mapping: {c}: stix must be a STIX object path (<type>:<property>)")
        if _key(stix) in seen:
            raise ValueError(f"pattern-mapping: {stix!r} is mapped twice")
        seen.add(_key(stix))
        ecs = c.get("ecs")
        if not isinstance(ecs, str) or not _FIELD_RE.match(ecs) or not ecs.startswith(ip + "."):
            raise ValueError(f"pattern-mapping: {stix!r}: ecs must be a field under {ip}.")
        if not isinstance(c.get("type"), str) or not _SCO_TYPE_RE.match(c["type"]):
            raise ValueError(f"pattern-mapping: {stix!r}: type must be the STIX SCO type name")
        if c.get("value_type") not in VALUE_TYPES:
            raise ValueError(f"pattern-mapping: {stix!r}: value_type must be one of {VALUE_TYPES}")


class PatternMapping:
    """``pattern-mapping.yml`` loaded: which STIX comparison lands in which
    ``threat.indicator.*`` field."""

    def __init__(self, doc: dict):
        validate_pattern_mapping(doc)
        self.indicator_path: str = doc["indicator_path"]
        self.comparisons: list[dict] = list(doc["comparisons"])
        self._by_key = {_key(c["stix"]): c for c in self.comparisons}

    def lookup(self, path: str) -> dict | None:
        return self._by_key.get(_key(path))

    @property
    def ecs_fields(self) -> set[str]:
        return {c["ecs"] for c in self.comparisons}


def load_pattern_mapping(path: str = PATTERN_MAPPING) -> PatternMapping:
    with open(path, encoding="utf-8") as fh:
        try:
            doc = yaml.safe_load(fh)
        except yaml.YAMLError as e:
            raise ValueError(f"{path}: invalid YAML: {e}") from e
    return PatternMapping(doc)


# -------------------------------------------------------------- index template
def load_template(path: str = INDEX_TEMPLATE) -> dict:
    with open(path, encoding="utf-8") as fh:
        return json.load(fh)


def _properties(template: dict) -> dict:
    return (((template.get("template") or {}).get("mappings") or {}).get("properties")) or {}


def mapping_node(template: dict, path: str) -> dict | None:
    """The mapping definition at dotted ``path`` (a leaf field or an object
    with ``properties``), or ``None`` when the template does not map it."""
    node: dict = {"properties": _properties(template)}
    for seg in path.split("."):
        nxt = (node.get("properties") or {}).get(seg)
        if not isinstance(nxt, dict):
            return None
        node = nxt
    return node


def template_fields(template: dict) -> dict[str, str]:
    """Every leaf field the template maps, ``{dotted path: Elasticsearch type}``."""
    out: dict[str, str] = {}

    def walk(properties: dict, prefix: str) -> None:
        for name, spec in (properties or {}).items():
            path = prefix + str(name)
            if isinstance(spec, dict) and isinstance(spec.get("properties"), dict):
                walk(spec["properties"], path + ".")
            else:
                out[path] = str((spec or {}).get("type", "object")) if isinstance(spec, dict) else "?"
    walk(_properties(template), "")
    return out


def validate_template(template, mapping: PatternMapping | None = None) -> None:
    """The cti-* template must be an index template over ``cti-*`` patterns
    with a STRICT mapping that carries the indicator path as an object, its
    ``id``, and the ``stix.*`` fields the rule's ``threat_query`` reads; with
    ``mapping`` given, every ECS target of the pattern mapping must be mapped
    with an Elasticsearch type that accepts its value type."""
    if not isinstance(template, dict):
        raise ValueError("cti template: must be a mapping")
    patterns = template.get("index_patterns")
    if not isinstance(patterns, list) or not patterns or not all(
            isinstance(p, str) and _INDEX_RE.match(p) for p in patterns):
        raise ValueError("cti template: index_patterns must be a non-empty list of cti-* patterns")
    mappings = (template.get("template") or {}).get("mappings") or {}
    if mappings.get("dynamic") != "strict":
        raise ValueError("cti template: mappings.dynamic must be 'strict' (an unmapped field cannot slip in)")
    fields = template_fields(template)
    ip = (template.get("_meta") or {}).get("indicator_path") or (mapping.indicator_path if mapping else "threat.indicator")
    if mapping and ip != mapping.indicator_path:
        raise ValueError(f"cti template: _meta.indicator_path {ip!r} != pattern-mapping indicator_path {mapping.indicator_path!r}")
    node = mapping_node(template, ip)
    if not node or not isinstance(node.get("properties"), dict):
        raise ValueError(f"cti template: {ip} must be mapped as an object (threat_indicator_path)")
    for field, es_type in ((ip + ".id", "keyword"), ("@timestamp", "date"), ("stix.revoked", "boolean"),
                           ("stix.valid_until", "date"), ("stix.pattern", "keyword")):
        if fields.get(field) != es_type:
            raise ValueError(f"cti template: {field} must be mapped as {es_type}")
    for c in (mapping.comparisons if mapping else []):
        if c["ecs"] not in fields:
            raise ValueError(f"cti template: pattern-mapping target {c['ecs']} ({c['stix']}) is not mapped")
        if fields[c["ecs"]] not in _ES_TYPES[c["value_type"]]:
            raise ValueError(f"cti template: {c['ecs']} is {fields[c['ecs']]}, which does not hold a {c['value_type']}")


# --------------------------------------------------------------- normalisation
def confidence_label(value) -> str:
    """STIX ``confidence`` (0..100) as ECS ``threat.indicator.confidence``."""
    if value is None or isinstance(value, bool):
        return "Not Specified"
    try:
        n = int(value)
    except (TypeError, ValueError):
        return "Not Specified"
    if n < 0 or n > 100:
        return "Not Specified"
    if n == 0:
        return "None"
    return "Low" if n <= 29 else "Medium" if n <= 69 else "High"


def tlp_names(objects: Iterable[dict]) -> dict[str, str]:
    """``{marking-definition id: TLP level}`` — the spec's four fixed ids plus
    every TLP marking carried in ``objects`` (OpenCTI's TLP 2.0 levels have
    platform ids, so they resolve only through their marking objects)."""
    names = dict(_SPEC_TLP_NAMES)
    for x in objects:
        if not isinstance(x, dict) or x.get("type") != "marking-definition" or not isinstance(x.get("id"), str):
            continue
        level = None
        definition = x.get("definition")
        if isinstance(definition, dict) and definition.get("tlp"):
            level = str(definition["tlp"])
        elif str(x.get("definition_type") or "").lower() == "tlp" and x.get("name"):
            level = str(x["name"]).split(":", 1)[-1]
        if level:
            names[x["id"]] = level.strip().upper()
    return names


def tlp_of(refs, names: dict[str, str]) -> str | None:
    """The most restrictive TLP level among ``object_marking_refs``, or None."""
    levels = [names[r] for r in (refs or []) if isinstance(r, str) and r in names and names[r] in _TLP_RANK]
    return max(levels, key=_TLP_RANK.__getitem__) if levels else None


def coerce_value(value, value_type: str):
    """``value`` as the Elasticsearch field accepts it, or ``None`` when it
    cannot index (a CIDR in an ``ip`` field, text in an integer)."""
    s = str(value).strip() if value is not None else ""
    if not s:
        return None
    if value_type == "ip":
        try:
            return str(ipaddress.ip_address(s))
        except ValueError:
            return None
    if value_type == "integer":
        try:
            return int(s)
        except ValueError:
            return None
    return s


def _set(doc: dict, path: str, value) -> None:
    if value is None or value == "" or value == []:
        return
    node = doc
    parts = path.split(".")
    for seg in parts[:-1]:
        node = node.setdefault(seg, {})
    node[parts[-1]] = value


@dataclass
class Normalised:
    doc: dict | None
    reason: str | None = None       # why there is no document
    dropped: int = 0                # values the pattern named that cannot index


def to_cti_doc(indicator: dict, *, mapping: PatternMapping, now: str,
               markings: dict[str, str] | None = None, identities: dict[str, str] | None = None,
               feed: str = DEFAULT_FEED) -> Normalised:
    """One STIX indicator -> one ``cti-*`` document (``Normalised.doc``), or
    the reason there is none: ``not_indicator``, ``bad_id``,
    ``pattern_type:<x>`` (only STIX patterns hold atomics), ``no_pattern``,
    ``no_comparison``, ``unmapped`` (no comparison the mapping knows),
    ``bad_value`` (every known comparison's value cannot index)."""
    if not isinstance(indicator, dict) or indicator.get("type") != "indicator":
        return Normalised(None, "not_indicator")
    sid = indicator.get("id")
    if not isinstance(sid, str) or not _INDICATOR_ID_RE.match(sid):
        return Normalised(None, "bad_id")
    ptype = str(indicator.get("pattern_type") or "stix").lower()
    if ptype != "stix":
        return Normalised(None, f"pattern_type:{ptype}")
    pattern = indicator.get("pattern")
    if not isinstance(pattern, str) or not pattern.strip():
        return Normalised(None, "no_pattern")
    comparisons = parse_pattern(pattern)
    if not comparisons:
        return Normalised(None, "no_comparison")
    atomics: dict[str, list] = {}
    types: list[str] = []
    known = dropped = 0
    for path, value in comparisons:
        entry = mapping.lookup(path)
        if entry is None:
            continue
        known += 1
        v = coerce_value(value, entry["value_type"])
        if v is None:
            dropped += 1
            continue
        values = atomics.setdefault(entry["ecs"], [])
        if v not in values:
            values.append(v)
        if entry["type"] not in types:
            types.append(entry["type"])
    if not atomics:
        return Normalised(None, "unmapped" if not known else "bad_value", dropped)

    doc: dict = {"@timestamp": now}
    _set(doc, "event.kind", "enrichment")
    _set(doc, "event.category", ["threat"])
    _set(doc, "event.type", ["indicator"])
    _set(doc, "event.dataset", f"cti.{feed}")
    _set(doc, "event.module", feed)
    _set(doc, "threat.feed.name", feed)
    ip = mapping.indicator_path
    _set(doc, ip + ".id", sid)
    _set(doc, ip + ".type", types[0])
    for ecs, values in atomics.items():
        _set(doc, ecs, values[0] if len(values) == 1 else values)
    _set(doc, ip + ".name", _text(indicator.get("name")))
    _set(doc, ip + ".description", _text(indicator.get("description")))
    _set(doc, ip + ".confidence", confidence_label(indicator.get("confidence")))
    _set(doc, ip + ".first_seen", o.stix_timestamp(indicator.get("valid_from")))
    _set(doc, ip + ".modified_at", o.stix_timestamp(indicator.get("modified")))
    provider = (identities or {}).get(indicator.get("created_by_ref") or "")
    _set(doc, ip + ".provider", provider)
    refs = [r for r in (indicator.get("external_references") or []) if isinstance(r, dict)]
    _set(doc, ip + ".reference", next((str(r["url"]) for r in refs if r.get("url")), None))
    level = tlp_of(indicator.get("object_marking_refs"), markings or _SPEC_TLP_NAMES)
    _set(doc, ip + ".marking.tlp", level)
    if level in _TLP_V2_ONLY:
        _set(doc, ip + ".marking.tlp_version", "2.0")
    _set(doc, "stix.id", sid)
    _set(doc, "stix.pattern", pattern)
    _set(doc, "stix.pattern_type", ptype)
    for k in ("valid_from", "valid_until", "created", "modified"):
        _set(doc, "stix." + k, o.stix_timestamp(indicator.get(k)))
    _set(doc, "stix.revoked", bool(indicator.get("revoked")))
    confidence = indicator.get("confidence")
    if isinstance(confidence, int) and not isinstance(confidence, bool):
        _set(doc, "stix.confidence", confidence)
    _set(doc, "stix.indicator_types", [str(t) for t in (indicator.get("indicator_types") or []) if t])
    _set(doc, "tags", [str(t) for t in (indicator.get("labels") or []) if t])
    _set(doc, "opencti.id", _text(indicator.get("x_opencti_id")))
    score = indicator.get("x_opencti_score")
    if isinstance(score, int) and not isinstance(score, bool):
        _set(doc, "opencti.score", score)
    if isinstance(indicator.get("x_opencti_detection"), bool):
        _set(doc, "opencti.detection", indicator["x_opencti_detection"])
    _set(doc, "opencti.main_observable_type", _text(indicator.get("x_opencti_main_observable_type")))
    return Normalised(doc, None, dropped)


def _text(value) -> str | None:
    if value is None:
        return None
    s = str(value).strip()
    return s or None


def document_id(doc: dict) -> str:
    """The ``_id`` a cti-* document is written under: its STIX indicator id."""
    return str(flatten(doc).get("threat.indicator.id") or "")


def to_cti_docs(objects: Iterable[dict], *, mapping: PatternMapping | None = None, now: str | None = None,
                feed: str = DEFAULT_FEED, template: dict | None = None) -> tuple[list[dict], dict]:
    """Every indicator in ``objects`` (a bundle's object list — its
    marking-definitions resolve TLP, its identities the provider) as cti-*
    documents, plus a report: indicators seen, documents made, values dropped,
    and the skipped indicators counted by reason. With ``template`` given, a
    document carrying a field the template does not map is a defect in this
    module's data and raises."""
    mapping = mapping or load_pattern_mapping()
    now = now or o.utc_now()
    objs = [x for x in objects if isinstance(x, dict)]
    markings = tlp_names(objs)
    identities = {x["id"]: str(x["name"]) for x in objs
                  if x.get("type") == "identity" and isinstance(x.get("id"), str) and x.get("name")}
    fields = template_fields(template) if template else None
    docs: list[dict] = []
    report: dict = {"indicators": 0, "docs": 0, "dropped_values": 0, "skipped": {}}
    for x in objs:
        if x.get("type") != "indicator":
            continue
        report["indicators"] += 1
        result = to_cti_doc(x, mapping=mapping, now=now, markings=markings, identities=identities, feed=feed)
        report["dropped_values"] += result.dropped
        if result.doc is None:
            report["skipped"][result.reason] = report["skipped"].get(result.reason, 0) + 1
            continue
        if fields is not None:
            extra = sorted(k for k in flatten(result.doc) if k not in fields)
            if extra:
                raise ValueError(f"{x.get('id')}: document carries field(s) the cti-* template does not map: "
                                 f"{extra} — pattern-mapping.yml and cti.index-template.json disagree")
        docs.append(result.doc)
    report["docs"] = len(docs)
    return docs, report


def bulk_lines(docs: Iterable[dict], index: str) -> Iterator[str]:
    """Elasticsearch ``_bulk`` body lines for ``docs`` — an ``index`` action
    keyed on the STIX id (so a re-pull upserts), then the document — ready for
    ``POST /_bulk``. The index must be one the cti-* template covers."""
    if not isinstance(index, str) or not _INDEX_RE.match(index) or "*" in index:
        raise ValueError(f"cti index must be a concrete cti-* name (the template covers cti-*): {index!r}")
    for doc in docs:
        yield json.dumps({"index": {"_index": index, "_id": document_id(doc)}}, separators=(",", ":"))
        yield json.dumps(doc, ensure_ascii=False, separators=(",", ":"), default=str)


# ---------------------------------------------------------------------- the verb
def run_pull(cfg: StixConfig, *, out: str | None = None, bundle_out: str | None = None,
             from_bundle: str | None = None, since: str | None = None,
             page_size: int = DEFAULT_PAGE_SIZE, max_pages: int | None = None,
             transport: Transport | None = None, now: str | None = None) -> tuple[dict, list[str]]:
    """Pull OpenCTI's indicators (or read an already-pulled bundle with
    ``from_bundle`` — no platform needed), validate them, keep the bundle
    (``bundle_out``), normalise to cti-* documents and write the ``_bulk``
    lines to ``out``. Returns ``(summary, lines)``; ``summary["ok"]`` is False
    when the platform refused or the bundle failed validation (nothing is
    written then). ``ValueError`` on a bad ``since`` or an input that is not a
    bundle."""
    summary: dict = {"tool": "stix-pull", "config": cfg.redacted(), "index": cfg.cti_index,
                     "pull": None, "validation": {"errors": [], "warnings": []},
                     "bundle": None, "copy": None, "out": None, "ok": True}
    if from_bundle:
        bundle = load_bundle(str(from_bundle))
        summary["pull"] = {"from_bundle": str(from_bundle), "objects": len(bundle["objects"])}
    else:
        client = OpenCTIClient(cfg.opencti_url, cfg.opencti_token, connector_id=cfg.opencti_connector_id,
                               transport=transport, timeout=cfg.timeout)
        result = client.pull_indicators(since=since, page_size=page_size, max_pages=max_pages)
        summary["pull"] = result.as_dict()
        if not result.ok or result.bundle is None:
            summary["ok"] = False
            return summary, []
        bundle = result.bundle
    if bundle["objects"]:
        errors, warnings = validate_bundle(bundle)
        summary["validation"] = {"errors": errors, "warnings": warnings}
        if errors:
            summary["ok"] = False
            return summary, []
    if bundle_out:
        write_bundle(bundle, bundle_out)
        summary["bundle"] = bundle_out
    docs, report = to_cti_docs(bundle["objects"], now=now, template=load_template())
    summary["copy"] = report
    lines = list(bulk_lines(docs, cfg.cti_index))
    if out:
        parent = os.path.dirname(os.path.abspath(out))
        os.makedirs(parent, exist_ok=True)
        with open(out, "w", encoding="utf-8") as fh:
            for line in lines:
                fh.write(line + "\n")
        summary["out"] = out
    return summary, lines
