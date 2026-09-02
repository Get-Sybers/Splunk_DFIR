"""STIX 2.1 object builders — pure, stdlib-only, deterministic.

Nothing here touches a network or a store: every function takes plain values
and returns a plain ``dict`` in STIX 2.1 JSON shape (``type`` / ``spec_version``
/ ``id`` / ``created`` / ``modified`` ...). The ``stix2`` library is deliberately
not a dependency — the object set the exchange needs is small, and hand-built
dicts keep the export unit-testable and the ids under our control.

Two id classes (decision D4 — content-keyed entities get spec-deterministic
GLOBAL ids; instance/observation entities get case-scoped ids):

GLOBAL
    An object whose identity IS its content: an ATT&CK technique, a detection
    rule (its indicator), the producer identity, a host identity, a relationship
    between two such objects, and every cyber observable (SCO). SCO ids follow
    the spec's own scheme (uuid5 under the STIX SCO namespace over the
    id-contributing properties, STIX 2.1 §2.9), so any conformant producer
    derives the SAME id for the same address or file hash; SDO / SRO ids hash
    under :data:`DX_NAMESPACE`. Re-exporting, or exporting from another case,
    yields the same ids, so a platform merges instead of duplicating.
CASE
    An observation — a ``sighting``, an ``observed-data`` — whose identity is
    "this observation in this case": uuid5 under a per-case namespace derived
    from the case id. Re-exporting a case is idempotent; two cases never
    collide.

Relationships carry their class (``declared`` / ``derived``) as a label, so a
consumer can tell a rule author's ATT&CK mapping from an inferred link.
"""
from __future__ import annotations

import datetime
import ipaddress
import json
import re
import uuid

SPEC_VERSION = "2.1"
DEFAULT_PRODUCER = "DX_DFIR"

# uuid5(NAMESPACE_URL, "https://github.com/Get-Sybers/DX_DFIR/stix") — the root of
# every DX_DFIR-global deterministic id. Fixed for the life of the exchange:
# changing it forks every previously exported indicator / attack-pattern / identity.
DX_NAMESPACE = uuid.UUID("518ade0c-8157-5d44-a810-9563a8af74ef")
# STIX 2.1 §2.9 — the namespace every producer uses for SCO ids.
SCO_NAMESPACE = uuid.UUID("00abedb4-aa42-466c-9c01-fed23315a9b7")

RELATIONSHIP_CLASS_DECLARED = "declared"
RELATIONSHIP_CLASS_DERIVED = "derived"
RELATIONSHIP_CLASSES = (RELATIONSHIP_CLASS_DECLARED, RELATIONSHIP_CLASS_DERIVED)

# The four TLP marking-definitions have FIXED ids in the spec (§7.2.1.4).
_TLP_CREATED = "2017-01-20T00:00:00.000Z"
TLP_MARKING_IDS = {
    "white": "marking-definition--613f2e26-407d-48c7-9eca-b8e91df99dc9",
    "green": "marking-definition--34098fce-860f-48ae-8e50-ebd3cc5e41da",
    "amber": "marking-definition--f88d31f6-dadc-4b46-af9e-88246e2fbd0c",
    "red": "marking-definition--5e57c739-391a-4eb3-b6be-7d15ca92d5ed",
}
TLP_LEVELS = tuple(TLP_MARKING_IDS)

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
    ``YYYY-MM-DDTHH:MM:SS.mmmZ``. Accepts the lane forms (ISO with ``Z`` /
    offset / naive, Hayabusa's ``Y-m-d H:M:S.f z``, Suricata's ``+0000``),
    and epoch seconds / milliseconds. ``None`` when absent or unparseable —
    never a made-up time."""
    if value is None or isinstance(value, bool):
        return None
    if isinstance(value, (int, float)):
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


def reference_pattern(detection_id: str) -> str:
    """The indicator pattern when the rule body is not to hand: a syntactically
    valid STIX pattern that NAMES the detection rather than pretending to
    express it. ``rules_pattern_source`` (export.py) supplies the real query."""
    esc = detection_id.replace("\\", "\\\\").replace("'", "\\'")
    return f"[x-dxdfir-detection:id = '{esc}']"


# ----------------------------------------------------------------------- builders
def _sdo(stix_type: str, obj_id: str, now: str, created_by: str | None = None, **props) -> dict:
    obj = {"type": stix_type, "spec_version": SPEC_VERSION, "id": obj_id,
           "created": now, "modified": now}
    if created_by:
        obj["created_by_ref"] = created_by
    obj.update({k: v for k, v in props.items() if v is not None and v != [] and v != {}})
    return obj


def producer_identity(name: str = DEFAULT_PRODUCER, now: str | None = None) -> dict:
    """The identity every exported object is ``created_by_ref`` — the pipeline."""
    return _sdo("identity", global_id("identity", "producer", name), now or utc_now(),
                name=name, identity_class="system",
                description="Byakugan DFIR detection pipeline (Elastic-native); STIX exchange producer.")


def host_identity(name: str, now: str, created_by: str) -> dict:
    """The observed host, as the identity that ``where_sighted`` a detection."""
    return _sdo("identity", global_id("identity", "system", name), now, created_by,
                name=name, identity_class="system")


def attack_pattern(tid: str, now: str, created_by: str, name: str | None = None) -> dict:
    """An ATT&CK technique. The id is ours (deterministic per technique id); the
    ``mitre-attack`` external reference is what a platform merges on."""
    return _sdo("attack-pattern", global_id("attack-pattern", tid), now, created_by,
                name=name or tid,
                external_references=[{"source_name": "mitre-attack", "external_id": tid,
                                      "url": technique_url(tid)}],
                x_mitre_id=tid)


def indicator(detection_id: str, title: str, now: str, created_by: str, *,
              severity: str = "", source: str = "", pattern: str | None = None,
              pattern_type: str | None = None, description: str | None = None) -> dict:
    """The detection rule as an indicator (one per detection id, global)."""
    if not pattern:
        pattern, pattern_type = reference_pattern(detection_id), "stix"
    if description is None:
        description = f"DX_DFIR detection '{detection_id}'" + (f" over {source}" if source else "")
    return _sdo("indicator", global_id("indicator", detection_id), now, created_by,
                name=title, description=description, indicator_types=["malicious-activity"],
                pattern=pattern, pattern_type=pattern_type or "stix", valid_from=now,
                x_dxdfir={"detection_id": detection_id, "severity": severity, "source": source})


def relationship(source_ref: str, target_ref: str, relationship_type: str, now: str,
                 created_by: str, *, relationship_class: str) -> dict:
    """An SRO between two global objects, labelled with its class (D4)."""
    if relationship_class not in RELATIONSHIP_CLASSES:
        raise ValueError(f"relationship class must be one of {RELATIONSHIP_CLASSES}")
    return _sdo("relationship",
                global_id("relationship", relationship_type, source_ref, target_ref), now,
                created_by, relationship_type=relationship_type, source_ref=source_ref,
                target_ref=target_ref, labels=[relationship_class])


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


def observed_data(case_id: str, key: str, object_refs: list[str], first: str, last: str,
                  now: str, created_by: str) -> dict:
    """The observation wrapping a hit's SCOs (case-scoped)."""
    return _sdo("observed-data", case_scoped_id("observed-data", case_id, key), now,
                created_by, first_observed=first, last_observed=last, number_observed=1,
                object_refs=list(object_refs))


def sighting(case_id: str, key: str, sighting_of_ref: str, now: str, created_by: str, *,
             first_seen: str | None = None, last_seen: str | None = None, count: int = 1,
             observed_data_refs: list[str] | None = None,
             where_sighted_refs: list[str] | None = None, description: str | None = None,
             custom: dict | None = None) -> dict:
    """One detection firing, as a sighting of its indicator (case-scoped). The
    DX envelope rides along under ``x_dxdfir`` so nothing is lost in exchange."""
    obj = _sdo("sighting", case_scoped_id("sighting", case_id, key), now, created_by,
               description=description, first_seen=first_seen, last_seen=last_seen,
               count=count, sighting_of_ref=sighting_of_ref,
               observed_data_refs=observed_data_refs or None,
               where_sighted_refs=where_sighted_refs or None)
    if custom:
        obj["x_dxdfir"] = custom
    return obj


def tlp_marking(level: str) -> dict:
    """The spec's TLP marking-definition for ``level`` (white/green/amber/red)."""
    level = str(level).lower()
    if level not in TLP_MARKING_IDS:
        raise ValueError(f"tlp must be one of {TLP_LEVELS} (or none)")
    return {"type": "marking-definition", "spec_version": SPEC_VERSION,
            "id": TLP_MARKING_IDS[level], "created": _TLP_CREATED,
            "definition_type": "tlp", "name": f"TLP:{level.upper()}",
            "definition": {"tlp": level}}


def mark(obj: dict, marking_ref: str | None) -> dict:
    """Apply a marking to an object (markings themselves are never marked)."""
    if marking_ref and obj.get("type") != "marking-definition":
        refs = obj.setdefault("object_marking_refs", [])
        if marking_ref not in refs:
            refs.append(marking_ref)
    return obj
