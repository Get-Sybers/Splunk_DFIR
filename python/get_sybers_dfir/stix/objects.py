"""STIX 2.1 object builders — pure, stdlib-only, deterministic.

Nothing here touches a network or a store: every function takes plain values
and returns a plain ``dict`` in STIX 2.1 JSON shape (``type`` / ``spec_version``
/ ``id`` / ``created`` / ``modified`` ...). The ``stix2`` library is deliberately
not a dependency — the object set the exchange needs is small, and hand-built
dicts keep the export unit-testable and the ids under our control.

Ids (decision D4 — content-keyed entities get deterministic GLOBAL ids;
observations get case-scoped ids). The spec says SDO/SRO ids SHOULD be UUIDv4
(STIX 2.1 §2.9); this exchange uses UUIDv5 under its own namespace so that a
re-export merges instead of duplicating on the platform (as the platform
itself does). §2.9's MUST is kept: only SCOs hash under the STIX SCO namespace.

GLOBAL
    An object whose identity IS its content: a detection rule (its indicator),
    the producer identity, a host identity, a relationship between two such
    objects, and every cyber observable (SCO — uuid5 under the spec's SCO
    namespace over the id-contributing properties, §2.9, so any conformant
    producer derives the SAME id for the same address, hash or connection).
    ATT&CK techniques are NOT built here: the export references MITRE's own
    ``attack-pattern`` ids (:mod:`.attack_index`; BP §5.2, §2.2).
CASE
    An observation — a ``sighting``, an ``observed-data`` — whose identity is
    "this observation in this case": uuid5 under a per-case namespace.

Versioning (STIX 2.1 §3.2 / §3.6, BP §3.1). A deterministic id makes every
export a VERSION of the same object, so ``created`` MUST NOT come from the
export clock — it never changes — and ``modified`` may move only when the
content does. Builders therefore take their times from stable data: a rule's
``created`` / ``updated`` for the indicator and its relationships, the
observation time for observed-data and sightings, a fixed release date for
identities and the extension definition. There is no ``now`` in a builder.

Extensions (STIX 2.1 §7.3; BP §2.3, §9). Everything DX_DFIR needs beyond the
spec's properties (case / run / CAR pointers, rule severity, the class of a
relationship) travels in ONE property extension, :data:`EXTENSION_ID`, whose
definition object rides in every bundle and whose JSON schema is committed
beside this package (``extension/dxdfir-extension.schema.json``). No ``x_``
custom property and no custom object type is produced.

Markings (BP §3.5). The four TLP marking-definitions are the spec's own fixed
instances and are never shipped; objects only reference them, and SCOs are
never marked ("it makes no sense to restrict the sharing of an IP address").
"""
from __future__ import annotations

import datetime
import ipaddress
import json
import re
import uuid

SPEC_VERSION = "2.1"
DEFAULT_PRODUCER = "DX_DFIR"
# BP §3.4: an identity that is not anonymised should carry contact information.
DEFAULT_CONTACT = "https://github.com/Get-Sybers/DX_DFIR/issues"

# uuid5(NAMESPACE_URL, "https://github.com/Get-Sybers/DX_DFIR/stix") — the root of
# every DX_DFIR-global deterministic id. Fixed for the life of the exchange:
# changing it forks every previously exported indicator / identity.
DX_NAMESPACE = uuid.UUID("518ade0c-8157-5d44-a810-9563a8af74ef")
# STIX 2.1 §2.9 — the namespace every producer uses for SCO ids (and MUST NOT
# use for anything else).
SCO_NAMESPACE = uuid.UUID("00abedb4-aa42-466c-9c01-fed23315a9b7")

# The identities' version: ``created`` is the exchange's first release and
# never moves; bump IDENTITY_MODIFIED when producer_identity() / host_identity()
# change what they emit (that is a new version of every identity, §3.6).
IDENTITY_CREATED = "2026-09-02T00:00:00.000Z"
IDENTITY_MODIFIED = "2026-09-03T00:00:00.000Z"

# The DX_DFIR property extension (STIX 2.1 §7.3). One definition, versioned:
# bump EXTENSION_VERSION and EXTENSION_MODIFIED together when the schema changes.
EXTENSION_ID = f"extension-definition--{uuid.uuid5(DX_NAMESPACE, 'extension-definition|dxdfir')}"
EXTENSION_TYPE = "property-extension"
EXTENSION_VERSION = "1.0.0"
EXTENSION_CREATED = "2026-09-03T00:00:00.000Z"
EXTENSION_MODIFIED = "2026-09-03T00:00:00.000Z"
EXTENSION_NAME = "DX_DFIR detection exchange"
EXTENSION_SCHEMA_URL = ("https://raw.githubusercontent.com/Get-Sybers/DX_DFIR/dev/python/"
                        "get_sybers_dfir/stix/extension/dxdfir-extension.schema.json")
EXTENSION_DOC_URL = "https://github.com/Get-Sybers/DX_DFIR/blob/dev/python/get_sybers_dfir/stix/README.md"

RELATIONSHIP_CLASS_DECLARED = "declared"
RELATIONSHIP_CLASS_DERIVED = "derived"
RELATIONSHIP_CLASSES = (RELATIONSHIP_CLASS_DECLARED, RELATIONSHIP_CLASS_DERIVED)

# The four TLP marking-definitions have FIXED ids in the spec (§7.2.1.4); they
# are referenced, never emitted (BP §3.5).
_TLP_CREATED = "2017-01-20T00:00:00.000Z"
TLP_MARKING_IDS = {
    "white": "marking-definition--613f2e26-407d-48c7-9eca-b8e91df99dc9",
    "green": "marking-definition--34098fce-860f-48ae-8e50-ebd3cc5e41da",
    "amber": "marking-definition--f88d31f6-dadc-4b46-af9e-88246e2fbd0c",
    "red": "marking-definition--5e57c739-391a-4eb3-b6be-7d15ca92d5ed",
}
TLP_LEVELS = tuple(TLP_MARKING_IDS)

# The SCO types the spec defines (§6). Never marked (BP §3.5); ids per §2.9.
SCO_TYPES = frozenset({
    "artifact", "autonomous-system", "directory", "domain-name", "email-addr", "email-message", "file",
    "ipv4-addr", "ipv6-addr", "mac-addr", "mutex", "network-traffic", "process", "software", "url",
    "user-account", "windows-registry-key", "x509-certificate",
})
# What mark() leaves alone besides SCOs: definitions are public, a bundle is a container.
_UNMARKED_TYPES = frozenset({"marking-definition", "extension-definition", "bundle"})

# A MITRE ATT&CK technique id, T#### with an optional .### sub-technique; the
# lanes also write the ET Open underscore form (t1059_003). Same shape as the
# detect registry's parser, kept local so the exchange never imports the runner.
_TECHNIQUE_RE = re.compile(r"T\d{4}(?:[._]\d{3})?", re.IGNORECASE)
_UTC = datetime.timezone.utc
_TS_FORMATS = (
    "%Y-%m-%dT%H:%M:%S.%f%z", "%Y-%m-%dT%H:%M:%S%z",
    "%Y-%m-%d %H:%M:%S.%f %z", "%Y-%m-%d %H:%M:%S %z",
    "%Y-%m-%d %H:%M:%S.%f", "%Y-%m-%d %H:%M:%S",
)
# §2.9: when hashes contribute to a file id, ONE hash does, in this preference order.
_HASH_PREFERENCE = ("MD5", "SHA-1", "SHA-256", "SHA-512")
_EMPTY = (None, "", [], {})


# --------------------------------------------------------------------- primitives
def technique_ids(value) -> list[str]:
    """ATT&CK technique ids in ``value`` (a string — comma / space / ``¦``
    separated — or a list/dict of them), canonical upper-case dotted form,
    de-duplicated in first-seen order. Anything that is not a technique id is
    ignored; ``None`` / ``''`` yields ``[]``. Pure."""
    if not value:
        return []
    if isinstance(value, (set, frozenset)):
        text = " ".join(str(v) for v in sorted(value, key=str))
    elif isinstance(value, (list, tuple)):
        text = " ".join(str(v) for v in value if v is not None)
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


def canonical(obj) -> str:
    """Compact, key-sorted JSON — the serialisation the deterministic ids hash
    (for flat string properties this is RFC 8785 canonical JSON, as §2.9 asks)."""
    return json.dumps(obj, separators=(",", ":"), sort_keys=True, ensure_ascii=False, default=str)


def stix_timestamp(value) -> str | None:
    """``value`` as a STIX 2.1 timestamp: UTC, millisecond precision,
    ``YYYY-MM-DDTHH:MM:SS.mmmZ`` (§2.10; BP §4.5 — exactly three sub-second
    digits). Accepts the lane forms (ISO with ``Z`` / offset / naive,
    Hayabusa's ``Y-m-d H:M:S.f z``, Suricata's ``+0000``), epoch seconds /
    milliseconds, and ``date`` / ``datetime`` objects (a rule file's
    ``created``). ``None`` when absent or unparseable — never a made-up time."""
    if value is None or isinstance(value, bool):
        return None
    if isinstance(value, datetime.datetime):
        dt = value
    elif isinstance(value, datetime.date):
        dt = datetime.datetime(value.year, value.month, value.day)
    elif isinstance(value, (int, float)):
        secs = value / 1000.0 if abs(value) >= 1e11 else float(value)
        try:
            dt = datetime.datetime.fromtimestamp(secs, tz=_UTC)
        except (OverflowError, OSError, ValueError):
            return None
    else:
        s = str(value).strip()
        if not s:
            return None
        dt = None
        try:
            dt = datetime.datetime.fromisoformat(s[:-1] + "+00:00" if s.endswith("Z") else s)
        except ValueError:
            for fmt in _TS_FORMATS:
                try:
                    dt = datetime.datetime.strptime(s, fmt)
                    break
                except ValueError:
                    continue
        if dt is None:
            return None
    dt = dt.replace(tzinfo=_UTC) if dt.tzinfo is None else dt.astimezone(_UTC)
    return dt.strftime("%Y-%m-%dT%H:%M:%S.") + f"{dt.microsecond // 1000:03d}Z"


def utc_now() -> str:
    return stix_timestamp(datetime.datetime.now(_UTC))


def global_id(stix_type: str, *parts) -> str:
    """A DX_DFIR-global deterministic id: the same content always gets the same id."""
    name = "|".join((stix_type, *(str(p) for p in parts)))
    return f"{stix_type}--{uuid.uuid5(DX_NAMESPACE, name)}"


def case_namespace(case_id: str) -> uuid.UUID:
    return uuid.uuid5(DX_NAMESPACE, f"case|{case_id}")


def case_scoped_id(stix_type: str, case_id: str, *parts) -> str:
    """A case-scoped deterministic id: idempotent within a case, distinct across cases."""
    name = "|".join((stix_type, *(str(p) for p in parts)))
    return f"{stix_type}--{uuid.uuid5(case_namespace(case_id), name)}"


def sco_id(stix_type: str, contributing: dict) -> str:
    """The spec's SCO id (§2.9): uuid5 under the STIX SCO namespace over the
    canonical JSON of the id-contributing properties."""
    return f"{stix_type}--{uuid.uuid5(SCO_NAMESPACE, canonical(contributing))}"


def technique_url(tid: str) -> str:
    return "https://attack.mitre.org/techniques/" + tid.replace(".", "/") + "/"


def is_sco(obj: dict) -> bool:
    return obj.get("type") in SCO_TYPES


# ----------------------------------------------------------------------- builders
def _sdo(stix_type: str, obj_id: str, created: str, modified: str | None = None,
         created_by: str | None = None, **props) -> dict:
    obj = {"type": stix_type, "spec_version": SPEC_VERSION, "id": obj_id,
           "created": created, "modified": modified or created}
    if created_by:
        obj["created_by_ref"] = created_by
    obj.update({k: v for k, v in props.items() if v not in _EMPTY})
    return obj


def extend(obj: dict, **props) -> dict:
    """Attach DX_DFIR's property extension to ``obj`` (empty values dropped;
    nothing attached when nothing remains)."""
    body = {k: v for k, v in props.items() if v not in _EMPTY}
    if body:
        obj.setdefault("extensions", {})[EXTENSION_ID] = {"extension_type": EXTENSION_TYPE, **body}
    return obj


def extension_of(obj: dict) -> dict:
    """The DX_DFIR extension properties on ``obj`` (``{}`` when it carries none)."""
    ext = obj.get("extensions") if isinstance(obj.get("extensions"), dict) else {}
    body = ext.get(EXTENSION_ID)
    return {k: v for k, v in body.items() if k != "extension_type"} if isinstance(body, dict) else {}


def extension_definition(created_by: str) -> dict:
    """The one extension-definition every DX_DFIR bundle carries (STIX 2.1
    §7.3; BP §9: a globally unique id, a description, an external reference to
    the documentation and the URL of the JSON schema)."""
    return _sdo("extension-definition", EXTENSION_ID, EXTENSION_CREATED, EXTENSION_MODIFIED, created_by,
                name=EXTENSION_NAME,
                description=("Properties the DX_DFIR (Byakugan) detection exchange adds to its indicators, "
                             "sightings and relationships: the detection rule's id, severity and status; the case, "
                             "run, CAR-object and alert pointers of a sighting and the indicator-match value it "
                             "sighted; whether a relationship was declared by a rule author or derived."),
                schema=EXTENSION_SCHEMA_URL, version=EXTENSION_VERSION, extension_types=[EXTENSION_TYPE],
                external_references=[{"source_name": "dxdfir", "url": EXTENSION_DOC_URL,
                                      "description": "DX_DFIR STIX exchange documentation (stix/README.md)"}])


def producer_identity(name: str = DEFAULT_PRODUCER, contact: str | None = DEFAULT_CONTACT) -> dict:
    """The identity every exported object is ``created_by_ref`` — the pipeline
    (BP §3.4: with contact information; §3.6: carried in every bundle)."""
    return _sdo("identity", global_id("identity", "producer", name), IDENTITY_CREATED, IDENTITY_MODIFIED,
                name=name, identity_class="system",
                description="Byakugan DFIR detection pipeline (Elastic-native); STIX exchange producer.",
                contact_information=contact)


def host_identity(name: str, created_by: str) -> dict:
    """The observed host, as the identity that ``where_sighted`` a detection
    (identity-class-ov ``system``: "a computer system")."""
    return _sdo("identity", global_id("identity", "system", name), IDENTITY_CREATED, IDENTITY_MODIFIED,
                created_by, name=name, identity_class="system")


def indicator(detection_id: str, name: str, *, created: str, modified: str | None, created_by: str,
              pattern: str, pattern_type: str, pattern_version: str | None = None,
              description: str | None = None, severity: str = "", status: str = "",
              techniques: list[str] | tuple[str, ...] = (), kill_chain_phases: list[dict] | None = None,
              rule_url: str | None = None, confidence: int | None = None) -> dict:
    """The detection rule as an indicator (one per detection id, global).
    ``created`` / ``modified`` are the RULE's authoring / last-change dates,
    ``valid_from`` its authoring date (§3.2: never the export clock). The
    detection id and every declared technique are external references (BP
    §4.1: the ``mitre-attack`` source name); rule severity and status ride in
    the extension."""
    refs = [{"source_name": "dxdfir", "external_id": detection_id, **({"url": rule_url} if rule_url else {})}]
    refs += [{"source_name": "mitre-attack", "external_id": t, "url": technique_url(t)} for t in techniques]
    obj = _sdo("indicator", global_id("indicator", detection_id), created, modified, created_by,
               name=name, description=description, indicator_types=["malicious-activity"],
               pattern=pattern, pattern_type=pattern_type, pattern_version=pattern_version,
               valid_from=created, kill_chain_phases=kill_chain_phases, external_references=refs,
               confidence=confidence)
    return extend(obj, detection_id=detection_id, severity=severity, status=status)


def relationship(source_ref: str, target_ref: str, relationship_type: str, *, created: str,
                 modified: str | None, created_by: str, relationship_class: str) -> dict:
    """An SRO between two global objects. Its class (``declared`` by a rule
    author / ``derived`` by inference) is an extension property — not a label
    (BP §4.6: labels only for what no other property can express, and never
    unprefixed private terms)."""
    if relationship_class not in RELATIONSHIP_CLASSES:
        raise ValueError(f"relationship class must be one of {RELATIONSHIP_CLASSES}")
    obj = _sdo("relationship", global_id("relationship", relationship_type, source_ref, target_ref),
               created, modified, created_by, relationship_type=relationship_type,
               source_ref=source_ref, target_ref=target_ref)
    return extend(obj, relationship_class=relationship_class)


def ip_address(value) -> dict | None:
    """An ``ipv4-addr`` / ``ipv6-addr`` SCO with the spec's deterministic id, or
    ``None`` when ``value`` is not an address (nothing is invented)."""
    try:
        ip = ipaddress.ip_address(str(value).strip())
    except ValueError:
        return None
    stix_type = "ipv4-addr" if ip.version == 4 else "ipv6-addr"
    v = str(ip)
    return {"type": stix_type, "spec_version": SPEC_VERSION,
            "id": sco_id(stix_type, {"value": v}), "value": v}


def domain_name(value) -> dict | None:
    """A ``domain-name`` SCO (spec id over the lower-cased name, trailing dot
    dropped), or ``None`` when ``value`` is not a name."""
    v = str(value or "").strip().rstrip(".").lower()
    if not v or " " in v or "/" in v:
        return None
    return {"type": "domain-name", "spec_version": SPEC_VERSION,
            "id": sco_id("domain-name", {"value": v}), "value": v}


def url(value) -> dict | None:
    """A ``url`` SCO (spec id over the value as given), or ``None`` when empty."""
    v = str(value or "").strip()
    if not v or " " in v:
        return None
    return {"type": "url", "spec_version": SPEC_VERSION, "id": sco_id("url", {"value": v}), "value": v}


def file_observable(name: str | None = None, hashes: dict | None = None) -> dict | None:
    """A ``file`` SCO. Id-contributing properties per §2.9: ONE hash (MD5 >
    SHA-1 > SHA-256 > SHA-512) and the name, whichever are present."""
    hashes = {k: str(v) for k, v in (hashes or {}).items() if v}
    contributing: dict = {}
    if hashes:
        chosen = next((h for h in _HASH_PREFERENCE if h in hashes), sorted(hashes)[0])
        contributing["hashes"] = {chosen: hashes[chosen]}
    if name:
        contributing["name"] = name
    if not contributing:
        return None
    obj = {"type": "file", "spec_version": SPEC_VERSION, "id": sco_id("file", contributing)}
    if hashes:
        obj["hashes"] = dict(sorted(hashes.items()))
    if name:
        obj["name"] = name
    return obj


def network_traffic(src_ref: str | None, dst_ref: str | None, *, src_port: int | None = None,
                    dst_port: int | None = None, protocols: list[str] | tuple[str, ...]) -> dict | None:
    """A ``network-traffic`` SCO (§6.12) — the ROOT that makes an observation
    of two addresses a connected graph (§4.14 / BP §5.9: "a Network Traffic
    object and two IPv4 Address objects related via the src_ref and dst_ref
    properties can be contained in the same Observed Data"). ``protocols`` is
    required by the spec, outer to inner. Id-contributing (§2.9): start, end,
    src_ref, dst_ref, src_port, dst_port, protocols, extensions."""
    protocols = [str(p).lower() for p in protocols if p]
    if not (src_ref or dst_ref) or not protocols:
        return None
    contributing: dict = {}
    for k, v in (("src_ref", src_ref), ("dst_ref", dst_ref), ("src_port", src_port),
                 ("dst_port", dst_port), ("protocols", protocols)):
        if v not in _EMPTY:
            contributing[k] = v
    obj = {"type": "network-traffic", "spec_version": SPEC_VERSION, "id": sco_id("network-traffic", contributing)}
    obj.update(contributing)
    return obj


def observed_data(case_id: str, key: str, kind: str, object_refs: list[str], first: str, last: str,
                  *, created_by: str, number_observed: int = 1) -> dict:
    """The observation wrapping ONE connected SCO graph (case-scoped; ``kind``
    tells the graphs of one hit apart — ``network`` / ``file``). Its
    ``created`` is the observation time: stable, never the export clock."""
    return _sdo("observed-data", case_scoped_id("observed-data", case_id, key, kind), first, first,
                created_by, first_observed=first, last_observed=last, number_observed=number_observed,
                object_refs=list(object_refs))


def sighting(case_id: str, key: str, sighting_of_ref: str, *, created: str, modified: str | None = None,
             created_by: str, first_seen: str | None = None, last_seen: str | None = None, count: int = 1,
             observed_data_refs: list[str] | None = None, where_sighted_refs: list[str] | None = None,
             description: str | None = None, confidence: int | None = None, dx: dict | None = None) -> dict:
    """One detection firing, as a sighting of its indicator (case-scoped).
    ``created`` is the detection time. ``dx`` (case_id, run_id, car_guid,
    alert_ids, matched ...) goes into the property extension."""
    obj = _sdo("sighting", case_scoped_id("sighting", case_id, key), created, modified, created_by,
               description=description, first_seen=first_seen, last_seen=last_seen, count=count,
               sighting_of_ref=sighting_of_ref, observed_data_refs=observed_data_refs or None,
               where_sighted_refs=where_sighted_refs or None, confidence=confidence)
    return extend(obj, **(dx or {}))


def tlp_marking_ref(level: str) -> str:
    """The spec's fixed marking-definition id for TLP ``level`` (white/green/amber/red)."""
    level = str(level).lower()
    if level not in TLP_MARKING_IDS:
        raise ValueError(f"tlp must be one of {TLP_LEVELS} (or none)")
    return TLP_MARKING_IDS[level]


def tlp_marking(level: str) -> dict:
    """The spec's TLP marking-definition object for ``level`` — for a consumer
    resolving a reference locally (and tests). Never put in a bundle (BP §3.5)."""
    return {"type": "marking-definition", "spec_version": SPEC_VERSION, "id": tlp_marking_ref(level),
            "created": _TLP_CREATED, "definition_type": "tlp", "name": f"TLP:{str(level).upper()}",
            "definition": {"tlp": str(level).lower()}}


def mark(obj: dict, marking_ref: str | None) -> dict:
    """Apply a marking to an SDO / SRO / observed-data. SCOs are left alone
    (BP §3.5: mark the Observed Data, not the address), as are definitions."""
    if marking_ref and obj.get("type") not in SCO_TYPES and obj.get("type") not in _UNMARKED_TYPES:
        refs = obj.setdefault("object_marking_refs", [])
        if marking_ref not in refs:
            refs.append(marking_ref)
    return obj
