"""Enrichment — the CAR relationship + inheritance engine (epic #86).

The logic proven in PIIAT-Mem's store, generalized for the multi-artefact
pipeline. Joins are scoped per **evidence host** (`source_host`) — never across
hosts:

- **process is the hub.** Every spoke (module/flow/file/registry/service/
  thread/socket/http/authentication rows that carry a process reference)
  resolves its owner in two tiers:
    tier 1 — DEFINITIVE: the spoke natively carries the owning process's guid
      (e.g. Sysmon ProcessGuid on every Sysmon spoke event) and a process event
      with that guid exists;
    tier 2 — heuristic: the (pid, create-time window) join — the latest process
      created at-or-before the spoke's timestamp; a process created later can
      never own an earlier event. Marked `link_confidence`.
- **process → parent** by (ppid, create-time window) — heuristic (PID reuse) —
  unless the artefact natively carries ParentProcessGuid (Sysmon 1) —
  definitive.
- **inheritance fills only nulls** — a spoke inherits its owner's context
  (exe, image_path, command_line, user, sid, hostname, fqdn, ppid) only for
  fields its CAR object has and only where its own value is null. A natively
  extracted value is never overwritten.
- **dedupe** on (host, object, guid, action [, target_guid, access_level]) —
  the most-populated row wins; identity-less rows never collapse.
- **canonical well-known accounts** (S-1-5-18/19/20) so `user` means the same
  string in every table.
"""
from __future__ import annotations

from collections import defaultdict

from . import carmodel

_INHERIT = ["exe", "image_path", "command_line", "user", "sid",
            "fqdn", "hostname", "ppid"]

_WELL_KNOWN_SIDS = {
    "S-1-5-18": "Local System",
    "S-1-5-19": "Local Service",
    "S-1-5-20": "Network Service",
}


def _populated(ev: dict) -> int:
    return sum(1 for k, v in ev.items() if not k.startswith("_") and v not in (None, ""))


def _dedupe(events: list[dict]) -> list[dict]:
    best, order = {}, []
    for ev in events:
        k = (ev.get("source_host"), ev["car_object"], ev.get("guid"),
             ev.get("car_action"), ev.get("target_guid"), ev.get("access_level"))
        if ev.get("guid") is None:
            k = k + (id(ev),)          # no identity -> never collapse
        if k not in best:
            best[k] = ev
            order.append(k)
        elif _populated(ev) > _populated(best[k]):
            best[k] = ev
    return [best[k] for k in order]


def _is_process_create(ev: dict) -> bool:
    return ev["car_object"] == "process" and ev.get("car_action") == "create"


def _by_guid(events):
    """(host, guid) -> process create event."""
    idx = {}
    for ev in events:
        if _is_process_create(ev) and ev.get("guid"):
            idx[(ev.get("source_host"), str(ev["guid"]))] = ev
    return idx


def _by_pid(events):
    """(host, pid) -> [process create events sorted by create time]."""
    idx = defaultdict(list)
    for ev in events:
        if _is_process_create(ev) and ev.get("pid") is not None:
            try:
                idx[(ev.get("source_host"), int(ev["pid"]))].append(ev)
            except (TypeError, ValueError):
                continue
    for lst in idx.values():
        lst.sort(key=lambda e: e.get("timestamp") or "")
    return idx


def _match(candidates, ts):
    """The process a PID means at time `ts`: latest create <= ts. A timestamped
    event whose window disqualifies every candidate matches NOTHING; only a
    timestamp-less event falls back to an unambiguous single candidate."""
    if not candidates:
        return None
    if ts:
        eligible = [c for c in candidates if (c.get("timestamp") or "") <= ts]
        return eligible[-1] if eligible else None
    return candidates[0] if len(candidates) == 1 else None


def _inherit(ev, owner, obj_fields):
    for f in _INHERIT:
        if f in obj_fields and ev.get(f) in (None, "") and owner.get(f) not in (None, ""):
            ev[f] = owner[f]


def _resolve_owner(ev, by_guid, by_pid):
    """(owner_event, confidence) for a spoke, tier 1 then tier 2."""
    host = ev.get("source_host")
    native = ev.get("owning_guid_native")
    if native:
        owner = by_guid.get((host, str(native)))
        if owner is not None:
            return owner, "definitive"
    if ev.get("owning_pid") is not None:
        try:
            pid = int(ev["owning_pid"])
        except (TypeError, ValueError):
            return None, None
        owner = _match(by_pid.get((host, pid), []), ev.get("timestamp"))
        if owner is not None:
            return owner, "heuristic"
    return None, None


def enrich(events: list[dict]) -> list[dict]:
    """Dedupe, link, inherit, canonicalize. Returns the final event list."""
    model = carmodel.load()
    events = _dedupe(events)
    by_guid = _by_guid(events)
    by_pid = _by_pid(events)

    for ev in events:
        obj_fields = set(model[ev["car_object"]]["fields"])

        # canonical well-known account names, store-wide
        canonical = _WELL_KNOWN_SIDS.get(str(ev.get("sid") or ev.get("uid") or ""))
        if canonical and "user" in obj_fields:
            ev["user"] = canonical

        if _is_process_create(ev):
            # parent link: native ParentProcessGuid (definitive) else ppid window
            host = ev.get("source_host")
            parent, conf = None, None
            native_parent = (ev.get("_native") or {}).get("ParentProcessGuid")
            if native_parent:
                parent = by_guid.get((host, str(native_parent)))
                conf = "definitive" if parent is not None else None
            if parent is None and ev.get("parent_pid") is not None:
                try:
                    parent = _match(by_pid.get((host, int(ev["parent_pid"])), []),
                                    ev.get("timestamp"))
                except (TypeError, ValueError):
                    parent = None
                conf = "heuristic" if parent is not None else None
            if parent is not None and parent is not ev:
                ev["parent_guid"] = parent.get("guid")
                ev["link_confidence"] = conf
                for src, dst in (("exe", "parent_exe"),
                                 ("image_path", "parent_image_path"),
                                 ("command_line", "parent_command_line")):
                    if dst in obj_fields and ev.get(dst) in (None, "") \
                            and parent.get(src) not in (None, ""):
                        ev[dst] = parent[src]
            continue

        owner, conf = _resolve_owner(ev, by_guid, by_pid)
        if owner is not None:
            ev["owning_guid"] = owner.get("guid")
            ev["link_confidence"] = conf
            _inherit(ev, owner, obj_fields)
    return events
