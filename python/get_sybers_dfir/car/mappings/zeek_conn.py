"""Zeek conn.log → MITRE CAR `flow` events (epic #86, Phase 2).

Port of the vetted `CarFlow_Zeek` KQL view (kusto/schema/40-mitre.kql:134),
re-based from ZeekTyped()'s renames onto the RAW conn.json shape (ts, uid,
id.orig_h/p, id.resp_h/p, proto, service, duration, orig_bytes/resp_bytes,
conn_state, history, orig_pkts/resp_pkts, missed_bytes) and onto the
AUTHORITATIVE model names (car_data_model.json): the KQL's `protocol` is now
`transport_protocol`, its `flags` is now `tcp_flags` (see car-store.md §7's
rename list: `flow.protocol` → `transport_protocol` (+`application_protocol`,
`tcp_flags`)).

Judgement calls (each also commented at the field):

- **application_protocol, not proto_info** ← `service`. The KQL view's own
  comment says "Service is the app-layer protocol" — it landed on `proto_info`
  only because the OLD model had no better home. The refreshed model added
  `application_protocol`, which is exactly Zeek's `service` ("an identification
  of an application protocol being sent over the connection" — Zeek conn.log
  docs). MITRE's `proto_info` is *additional* protocol information; a bare
  service label would be a near-miss there, so `proto_info` stays null.
- **Byte-counter direction.** Our flow convention is src = the ORIGINATOR
  (src_ip ← id.orig_h), so the counters are taken from the src's perspective:
  `out_bytes` = bytes OUT of src = `orig_bytes` (Zeek: "number of payload bytes
  the originator sent"), `in_bytes` = bytes INTO src = `resp_bytes` (payload
  bytes the responder sent). Only the payload counters map; `orig_ip_bytes`/
  `resp_ip_bytes` count IP-level bytes — a different quantity, never a
  fallback. Absent counters (e.g. S0 attempts) stay null, not 0.
- **tcp_flags** ← `history` per the owner directive and the view
  (`flags = History`). Recorded, not literal: Zeek's history is its per-event
  state-history letter string (e.g. "ShADadFf" — uppercase = originator,
  lowercase = responder), present on UDP/ICMP rows too, NOT a raw TCP flag
  bitmask. Consumers must read it as Zeek history.
- **action** — the view's case() over conn_state, verbatim: SF ("normal
  establishment and termination") → end; S0 ("connection attempt seen, no
  reply") → start; REJ ("connection attempt rejected"), RSTO ("established,
  originator aborted"), RSTR ("responder sent a RST") → end; any OTHER
  non-empty state (S1, S2, OTH, RSTRH, SHR, …) → message — observed
  mid-state, neither a proven start nor a proven end. An EMPTY conn_state has
  no canonical action, so the row stays raw (variant default None) — the
  engine's analogue of the view's action "".
- **guid** = the Zeek `uid` itself — the sensor-minted connection identity that
  conn/http/files/… all share. **Run-scoped**: Zeek mints fresh uids per run
  (CAR-Relations.md), so cross-run correlation goes through time + 5-tuple,
  never uid equality. The uid is also kept in `_native` as the join key toward
  zeek_http (which keeps `uid` too) and a future zeek_files map.
- **No host/user/process identity** — a network capture carries none (the KQL
  view maps no exe/pid/user either): those columns stay null rather than
  guessed; `source_host` is the caller-supplied capture vantage.
- **model `flow.uid` is NOT the Zeek uid** — in the model `uid` is the user-id
  family field (cf. process/file `uid`); filling it with a connection id would
  be a category error. It stays null.
- **network_direction stays null** — `local_orig`/`local_resp` could derive it,
  but the vetted view does not assert direction; left for the owner's
  capability-determination step rather than half-ported here.

Arithmetic derivations (`end_time = ts + duration`, `packet_count =
orig_pkts + resp_pkts`): the engine's markers are transform-only, so the two
sums are computed in `zeek_conn_has_state` — the variant predicate, the one
seam this module owns that sees the record before the map resolves — and
stamped as `_zc_*` fields the map then references. Both follow the view's
null discipline: no duration → no end_time; neither packet counter present →
packet_count null ("a null stays null rather than fabricating a 0-packet
flow" — the view's own comment).

Normalization ONLY — no joins/enrichment here; candidate join keys are
surfaced (guid/_native uid) and reported for the owner's capability pass.
"""
from __future__ import annotations

import datetime as _dt

from ..normalize import const, epoch_ts, first, map_value  # noqa: F401


# --- derivation helpers (arithmetic the marker set cannot express) ----------

def _parse_ts(v):
    """Zeek ts: the processed lane emits ISO-8601 (`...Z`); raw zeek json may
    carry epoch seconds. Either way → aware datetime, else None."""
    if v is None or v == "":
        return None
    try:
        return _dt.datetime.fromtimestamp(float(v), _dt.timezone.utc)
    except (TypeError, ValueError, OverflowError):
        pass
    try:
        return _dt.datetime.fromisoformat(str(v).replace("Z", "+00:00"))
    except ValueError:
        return None


def _derive(rec) -> None:
    """Stamp the two sums the view computes, under `_zc_` names no zeek column
    uses (they never reach `_native`: keep/native_extract are explicit)."""
    # end_time = ts + duration — only when zeek MEASURED a duration (the view:
    # iff(isnotnull(DurationSec), ...) — S0/REJ attempts have none).
    if "_zc_end_time" not in rec:
        start = _parse_ts(rec.get("ts"))
        dur = rec.get("duration")
        if start is not None and isinstance(dur, (int, float)):
            end = start + _dt.timedelta(seconds=dur)
            # emit the store's UTC ISO-8601, in the zeek lane's `Z` style so
            # end_time collates with the passthrough start_time
            rec["_zc_end_time"] = end.isoformat().replace("+00:00", "Z")
    # packet_count = orig_pkts + resp_pkts — only when at least one counter is
    # present (a genuine 0 is a real count; a missing pair is NOT a 0)
    if "_zc_packet_count" not in rec:
        op, rp = rec.get("orig_pkts"), rec.get("resp_pkts")
        counters = [c for c in (op, rp) if isinstance(c, (int, float))]
        if counters:
            rec["_zc_packet_count"] = int(sum(counters))


# --- variant predicate ------------------------------------------------------

def zeek_conn_has_state(rec) -> bool:
    """The view's isnotempty(ConnState) gate — an empty conn_state has no
    canonical flow action, so the row stays raw. Also the derivation seam
    (see module docstring)."""
    _derive(rec)
    return bool(rec.get("conn_state"))


PREDICATES = {"zeek_conn_has_state": zeek_conn_has_state}


# --- the map ----------------------------------------------------------------

# the view's case(): terminal states → end, pure attempt → start, any other
# observed state → message (see module docstring for the Zeek state glossary)
_ACTIONS = {"SF": "end", "REJ": "end", "RSTO": "end", "RSTR": "end",
            "S0": "start"}

MAPPINGS = {
    "zeek_conn": {
        "variants": [
            ("zeek_conn_has_state", {
                "object": "flow",
                # unmapped-but-present states fall through to "message"
                "action": first(map_value("conn_state", _ACTIONS),
                                const("message")),
                "ts": epoch_ts("ts"),
                # the sensor-minted connection identity — run-scoped (see
                # module docstring); shared verbatim with http/files events
                "guid": {"field": "uid"},
                "props": {
                    # the 5-tuple, src = originator by convention
                    "src_ip": "id.orig_h", "src_port": "id.orig_p",
                    "dest_ip": "id.resp_h", "dest_port": "id.resp_p",
                    "transport_protocol": "proto",       # tcp/udp/icmp
                    # exact home for zeek `service` in the refreshed model;
                    # proto_info (ADDITIONAL info) stays null — near-miss
                    "application_protocol": "service",
                    # zeek state-history letters — recorded, not a TCP bitmask
                    "tcp_flags": "history",
                    # src = originator ⇒ out = originator-sent payload bytes,
                    # in = responder-sent; ip_bytes are NOT a fallback
                    "out_bytes": "orig_bytes",
                    "in_bytes": "resp_bytes",
                    "start_time": epoch_ts("ts"),
                    "end_time": "_zc_end_time",          # ts + duration
                    "packet_count": "_zc_packet_count",  # only when counted
                },
                # native evidence + join keys (owner-directed list): uid (the
                # flow↔http/files join), service, conn_state (the raw action
                # evidence), missed_bytes (capture-loss caveat on the counters)
                "keep": ["uid", "service", "conn_state", "missed_bytes"],
            }),
        ],
        "default": None,   # no conn_state → no canonical action → stays raw
    },
}
