"""Normalize a raw artefact record into a MITRE CAR event (epic #86).

The same declarative-map + marker engine proven in PIIAT-Mem, generalized for
the DX_DFIR artefacts. A per-artefact map (see `mappings.py`) says which CAR
object/action a record is, its timestamp, the identity that becomes `guid`, and
how each raw field maps to a canonical CAR property. Markers (nestable) do the
small transforms; a canonical column is left null rather than filled with a
near-miss — never faked.

`normalize(artefact, record)` returns one CAR event dict, or None if the record
matches no map (unmapped rows are dropped, not guessed at).
"""
from __future__ import annotations

import ntpath
import posixpath
import re

_EPOCH_ZERO = re.compile(r"^(1601-01-01|1970-01-01|0001-01-01|1600-12-)")


# --- marker constructors (also importable by mappings.py) -------------------

def first(*srcs):
    """First non-empty of the given field names / markers."""
    return ("first", srcs)


def const(value):
    """A constant the observation itself proves."""
    return ("const", value)


def basename(src):
    """Windows-or-POSIX basename of a path field/marker."""
    return ("basename", src)


def ext(src):
    """Lowercase file extension (no dot) of a path field/marker."""
    return ("ext", src)


def lower(src):
    return ("lower", src)


def regex1(src, pattern):
    """First capture group of `pattern` against the field, or None."""
    return ("regex1", (src, pattern))


def domain_of(src):
    """The domain label of a dotted host/email/url field (after the first '@' or
    the host portion), lowercased — or None."""
    return ("domain_of", src)


def epoch_ts(src):
    """A timestamp field rendered as UTC ISO-8601: epoch-seconds (int/float) are
    converted; a value that is already an ISO string passes through (the zeek
    lane emits ISO8601 in processed json). The store's timestamp form —
    lexicographically ordered, comparable across artefacts."""
    return ("epoch_ts", src)


def map_value(src, table, upper=False):
    """Look the field's value up in a literal table ('GET' -> 'get'); None if
    absent. `upper=True` uppercases before the lookup."""
    return ("map_value", (src, table, upper))


def concat(*parts):
    """Concatenate resolved parts (field names or markers; use const("...") for
    literals) — null if ANY part is missing: a reconstruction made only from
    provable pieces."""
    return ("concat", parts)


def exe_path(src):
    """The executable path parsed out of an ImagePath-style command line
    ('"C:\\p q\\x.exe" -k net' -> 'C:\\p q\\x.exe'; unquoted svchost-style
    lines cut at .exe). Parsing, not guessing — the path is verbatim inside."""
    return ("exe_path", src)


def payload(key, field="Payload"):
    """A key out of an EvtxECmd `Payload` JSON string (EZ tools stamp the event
    data as a JSON blob) — the Python analogue of the KQL EvtxPayload()."""
    return ("payload", (field, key))


def host_label(src):
    """The first DNS label of a hostname/FQDN ('HOST1.dom.com' -> 'HOST1')."""
    return ("host_label", src)


def hex_int(src):
    """A PID/handle rendered as an int, accepting decimal or Windows-hex form
    ('0x150' -> 336) so a CAR column is uniform whatever the source's rendering.
    Parsing, not a near-miss — the value is exact."""
    return ("hex_int", src)


# --- resolver ---------------------------------------------------------------

def _blank(v) -> bool:
    return v is None or v == "" or v == "-"


def _clean_ts(v):
    if _blank(v):
        return None
    s = str(v)
    return None if _EPOCH_ZERO.match(s) else s


def _basename(v):
    if _blank(v):
        return None
    s = str(v)
    return (ntpath.basename(s) if "\\" in s else posixpath.basename(s)) or None


def _resolve(src, rec):
    """Resolve a plain field name or a (nestable) marker against a record."""
    if isinstance(src, str):
        return rec.get(src)
    kind, arg = src[0], src[1]
    if kind == "first":
        for f in arg:
            v = _resolve(f, rec)
            if not _blank(v):
                return v
        return None
    if kind == "const":
        return arg
    if kind == "basename":
        return _basename(_resolve(arg, rec))
    if kind == "ext":
        v = _resolve(arg, rec)
        if _blank(v):
            return None
        e = ntpath.splitext(_basename(v) or "")[1].lstrip(".").lower()
        return e or None
    if kind == "lower":
        v = _resolve(arg, rec)
        return str(v).lower() if not _blank(v) else None
    if kind == "regex1":
        field, pattern = arg
        v = _resolve(field, rec)
        if _blank(v):
            return None
        m = re.search(pattern, str(v))
        return m.group(1) if m else None
    if kind == "domain_of":
        v = _resolve(arg, rec)
        if _blank(v):
            return None
        s = str(v)
        if "@" in s:
            s = s.split("@", 1)[1]
        s = s.split("/")[0]                    # strip any URL path
        return s.lower() or None
    if kind == "concat":
        out = []
        for part in arg:
            v = _resolve(part, rec)
            if _blank(v):
                return None
            out.append(str(v))
        return "".join(out)
    if kind == "payload":
        field, key = arg
        raw = rec.get(field)
        if _blank(raw):
            return None
        try:
            import json as _json
            data = raw if isinstance(raw, dict) else _json.loads(raw)
            # EvtxECmd payloads nest as {"EventData":{"Data":[{"@Name":..,"#text":..}]}}
            datas = (data.get("EventData") or {}).get("Data")
            if isinstance(datas, list):
                for d in datas:
                    if isinstance(d, dict) and d.get("@Name") == key:
                        v = d.get("#text")
                        if isinstance(v, str):
                            v = v.strip()      # MS pads values ('Advapi  ')
                        return None if _blank(v) else v
                return None
            v = data.get(key)
            if isinstance(v, str):
                v = v.strip()
            return None if _blank(v) else v
        except (ValueError, AttributeError, TypeError):
            return None
    if kind == "host_label":
        v = _resolve(arg, rec)
        if _blank(v):
            return None
        return str(v).split(".", 1)[0] or None
    if kind == "epoch_ts":
        v = _resolve(arg, rec)
        if _blank(v):
            return None
        try:
            import datetime as _dt
            return _dt.datetime.fromtimestamp(float(v), _dt.timezone.utc).isoformat()
        except (TypeError, ValueError, OverflowError):
            s2 = str(v)
            return s2 if s2[:4].isdigit() and "-" in s2 else None  # already ISO
    if kind == "exe_path":
        v = _resolve(arg, rec)
        if _blank(v):
            return None
        s2 = str(v).strip()
        if s2.startswith('"'):
            end = s2.find('"', 1)
            return s2[1:end] if end > 0 else s2.strip('"')
        i = s2.lower().find(".exe")
        if i >= 0:
            return s2[:i + 4]
        return s2.split(" ")[0]
    if kind == "map_value":
        field, table, upper = arg
        v = _resolve(field, rec)
        if _blank(v):
            return None
        s = str(v).upper() if upper else str(v)
        return table.get(s)
    if kind == "hex_int":
        v = _resolve(arg, rec)
        if _blank(v):
            return None
        try:
            return int(v)
        except (TypeError, ValueError):
            try:
                return int(str(v), 16)
            except (TypeError, ValueError):
                return None
    raise ValueError(f"unknown source marker: {src!r}")


def _guid(spec, obj, rec):
    """The event's CAR guid: an existing field, a marker, `<object>-<fields>`, or
    None (assigned later / genuinely absent). A None component voids a
    fields-guid; "" is a legitimate identity value."""
    if spec is None or spec.get("none"):
        return None
    if "marker" in spec:
        return _resolve(spec["marker"], rec)
    if "field" in spec:
        v = rec.get(spec["field"])
        return None if _blank(v) else v
    parts = [rec.get(f) for f in spec["fields"]]
    if any(p is None for p in parts):
        return None
    return f"{obj}-" + "-".join(str(p) for p in parts)


def _select(entry, rec):
    """The map for a record: the first matching variant, else the default/self."""
    from . import mappings  # deferred: mappings imports this module's markers
    if "variants" not in entry:
        return entry
    for pred_name, sub in entry["variants"]:
        if mappings.PREDICATES[pred_name](rec):
            return sub
    return entry.get("default")


def normalize(artefact: str, rec: dict) -> dict | None:
    """One raw record -> one CAR event, or None if unmapped."""
    from . import mappings  # deferred: mappings imports this module's markers
    entry = mappings.MAPPINGS.get(artefact)
    if entry is None:
        return None
    m = _select(entry, rec)
    if m is None:
        return None
    obj = m["object"]
    props = {car: _resolve(sp, rec) for car, sp in m["props"].items()}
    event = {
        "car_object": obj,
        "car_action": _resolve(m["action"], rec) if not isinstance(m["action"], str) else m["action"],
        "timestamp": None if m.get("ts") is None else _clean_ts(_resolve(m["ts"], rec)),
        "guid": _guid(m.get("guid"), obj, rec),
        # process-context links, resolved by enrich (docs: car-store §3 logic).
        # An artefact that natively carries the owning process's GUID (Sysmon's
        # ProcessGuid) links DEFINITIVELY; a bare PID gets the create-time-window
        # heuristic join.
        "owning_pid": _resolve(m["owning_pid"], rec) if m.get("owning_pid") else None,
        "owning_guid_native": _resolve(m["owning_guid"], rec) if m.get("owning_guid") else None,
        "parent_pid": _resolve(m["parent_pid"], rec) if m.get("parent_pid") else None,
        "owning_guid": None,
        "parent_guid": None,
        "link_confidence": None,
        "source_artefact": artefact,
        # the enrich scope key: a map may derive it per record (e.g. Computer);
        # the pipeline fills a caller-supplied default where the map does not.
        "source_host": _resolve(m["host"], rec) if m.get("host") else None,
        "_native": {k: rec.get(k) for k in m.get("keep", []) if k in rec},
    }
    # parsed values promoted into _native (join keys the raw blob buries —
    # e.g. an EvtxECmd payload's TargetLogonId); never CAR-canonical columns.
    for name, spec in (m.get("native_extract") or {}).items():
        v = _resolve(spec, rec)
        if v is not None:
            event["_native"][name] = v
    event.update(props)
    return event
