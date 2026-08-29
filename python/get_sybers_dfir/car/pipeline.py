"""The per-file CAR pipeline — one ingested file, one CAR database (epic #86).

Owner's isolation rule: **each ingested file gets its OWN car database for
enrichment** — enrichment runs only within that file's events, so no source
ever depends on another source being present, and nothing is mixed. Cross-source
("final") enrichment is a separate, optional end-stage over the aggregate,
gated behind the capability determination — never part of the per-file product.

    python -m get_sybers_dfir.car --in <file> --out <dir> [--artefacts k1,k2]

One input file -> route to its artefact map(s) -> normalize -> enrich
(self-contained) -> <out>/car.db + <out>/car_<object>.jsonl (the ADX contract).
A PIIAT-Mem car.db input passes through 1:1 (already finished CAR).

Routing is by filename when --artefacts is not given; a Security log feeds BOTH
its authentication and its user_session maps (same file — the in-file LUID join
between them is legitimately self-contained).
"""
from __future__ import annotations

import argparse
import json
import os
import sys

from . import enrich, sources, store

# filename-pattern -> artefact map keys (explicit, first match wins)
ROUTES = [
    ("Security_EvtxECmd_Output", ["evtx_security", "evtx_security_sessions"]),
    ("System_EvtxECmd_Output", ["evtx_services"]),
    ("_EvtxECmd_Output", ["evtx_sysmon", "evtx_security", "evtx_security_sessions",
                          "evtx_services"]),   # mixed/unknown channel: all evtx maps
    ("conn.json", ["zeek_conn"]),
    ("http.json", ["zeek_http"]),
    (".L2tPrefetch", ["plaso_exec_prefetch"]),
    (".L2tWinreg", ["plaso_exec_winreg"]),
    (".L2tSyslog", ["plaso_exec_cron", "l2t_text"]),
    (".L2tCron", ["plaso_exec_cron"]),
    (".L2tFilestat", ["l2t_filestat"]),
    (".L2tMft", ["l2t_mft"]),
    (".L2tUsnjrnl", ["l2t_usnjrnl"]),
    (".L2tUtmp", ["l2t_utmp"]),
    (".L2tUtmpx", ["l2t_utmpx"]),
    (".L2tText", ["l2t_text"]),
]


def route(path: str) -> list[str]:
    name = os.path.basename(path)
    for pattern, keys in ROUTES:
        if pattern in name:
            return keys
    return []


def process_file(in_path: str, out_dir: str, artefacts: list[str] | None = None,
                 default_host: str | None = None) -> dict:
    """One file -> its own enriched CAR database + JSON export."""
    os.makedirs(out_dir, exist_ok=True)
    name = os.path.basename(in_path)

    if name == "car.db":                       # PIIAT-Mem finished CAR: passthrough
        events = sources.load_piiat_car(in_path)
        used = ["memory (passthrough)"]
    else:
        used = artefacts if artefacts else route(in_path)
        events = []
        for art in used:
            for ev in sources.iter_mapped(art, in_path, default_host=default_host):
                events.append(ev)

    # enrichment is SELF-CONTAINED: only this file's events are in scope
    events = enrich.enrich(events)

    db_path = os.path.join(out_dir, "car.db")
    if os.path.exists(db_path):
        os.remove(db_path)                     # rebuilt from this file each run
    st = store.CarStore(db_path)
    st.insert_events(events)
    counts = st.counts()
    written = st.export_jsonl(out_dir)
    st.close()
    return {"input": in_path, "artefacts": used, "events": sum(counts.values()),
            "objects": counts, "exported": written, "car_db": db_path}


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(
        prog="get_sybers_dfir.car",
        description="one ingested file -> its own enriched CAR database + JSON for ADX")
    ap.add_argument("--in", dest="in_path", required=True, help="one processed artefact file")
    ap.add_argument("--out", dest="out_dir", required=True, help="output dir for this file's car.db + car_*.jsonl")
    ap.add_argument("--artefacts", default=None, help="comma-separated artefact map keys (default: route by filename)")
    ap.add_argument("--host", default=None, help="fallback source_host where the map derives none")
    args = ap.parse_args(argv)

    arts = [a.strip() for a in args.artefacts.split(",") if a.strip()] if args.artefacts else None
    summary = process_file(args.in_path, args.out_dir, artefacts=arts, default_host=args.host)
    json.dump(summary, sys.stdout, default=str)
    sys.stdout.write("\n")
    return 0 if summary["events"] or summary["artefacts"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
