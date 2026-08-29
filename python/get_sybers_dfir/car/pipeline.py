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
import shutil
import sys
import tempfile

from . import enrich, sources, store

# EvtxECmd output is ONE uniform shape across all ~110 Windows channels, so it
# is CONTENT-routed, not filename-routed: every *_EvtxECmd_Output.json feeds the
# whole evtx map family and each map's (Channel, EventId) predicate decides which
# rows it claims (a row matching none is dropped). Adding a channel/EventId is a
# map change, never a routing change.
EVTX_MAPS = ["evtx_security",           # Security 4624/4625/4672 -> authentication
             "evtx_security_sessions",  # Security 4624/4634/4647/4778/4779 -> user_session
             "evtx_process",            # Security 4688 -> process
             "evtx_services",           # System 7045 / Security 4697 -> service
             "evtx_sysmon",             # Sysmon EIDs -> process/flow/file/registry/module/driver/thread
             "evtx_bits",               # BITS-Client 59/60 -> http
             "evtx_rdp"]                # TerminalServices 21/24/25 -> user_session

# filename-pattern -> artefact map keys (explicit, first match wins)
ROUTES = [
    ("_EvtxECmd_Output", EVTX_MAPS),
    ("conn.json", ["zeek_conn"]),
    ("http.json", ["zeek_http"]),
    ("smtp.json", ["zeek_smtp"]),
    ("files.json", ["zeek_files"]),
    # Zeek logs with no dedicated CAR object — routed to nothing EXPLICITLY (known,
    # not unknown): their per-flow detail can enrich the flow by uid at the
    # cascade stage, but they are not CAR objects.
    ("dns.json", []), ("ssl.json", []), ("x509.json", []), ("dhcp.json", []),
    ("ntp.json", []), ("snmp.json", []), ("ocsp.json", []), ("weird.json", []),
    ("pe.json", []), ("packet_filter.json", []),
    (".L2tPrefetch", ["plaso_exec_prefetch"]),
    (".L2tWinreg", ["plaso_exec_winreg"]),
    (".L2tSyslog", ["plaso_exec_cron", "l2t_text"]),
    (".L2tCron", ["plaso_exec_cron"]),
    (".L2tFilestat", ["l2t_filestat"]),
    (".L2tMft", ["l2t_mft"]),
    (".L2tUsnjrnl", ["l2t_usnjrnl"]),
    (".L2tWinevt", ["l2t_winevt"]),     # Plaso legacy EVT  -> the winevtx CAR maps
    (".L2tWinevtx", ["l2t_winevt"]),    # Plaso modern EVTX -> the winevtx CAR maps
    (".L2tMsiecf", ["l2t_msiecf"]),     # IE index.dat visits -> http
    (".L2tFirefoxCache", ["l2t_firefox_cache"]),  # -> http (recorded method/status)
    (".L2tSqlite", ["l2t_firefox_places"]),       # firefox page visits -> http (gated by data_type)
    (".L2tJavaIdx", ["l2t_javaidx"]),   # Java download cache -> http
    (".L2tLnk", ["l2t_lnk"]),           # shortcut target MAC times -> file
    (".L2tRecycleBinInfo2", ["l2t_recyclebin"]),  # deletion events -> file/delete
    (".L2tRecycleBin", ["l2t_recyclebin"]),
    # l2t tables with NO CAR object — routed to [] EXPLICITLY (known, not
    # unknown): pe = compilation times (no CAR file action); olecf = document
    # internal streams; rplog = restore-point info; fseventsd = macOS flags
    # (2 rows, undecoded). Their rows stay raw.
    (".L2tPe", []), (".L2tOlecf", []), (".L2tRplog", []), (".L2tFseventsd", []),
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


def _is_raw_l2t(path: str) -> bool:
    """A raw log2timeline json_line file: unwrapped Plaso records (top-level
    data_type + parser, no `Record`), as opposed to the split per-table files
    the l2t maps consume."""
    if not path.endswith(".jsonl"):
        return False
    try:
        with open(path, encoding="utf-8", errors="replace") as fh:
            for line in fh:
                line = line.strip().rstrip(",")
                if not line or line in ("[", "]"):
                    continue
                r = json.loads(line)
                return isinstance(r, dict) and "data_type" in r and "Record" not in r
    except (OSError, ValueError):
        return False
    return False


def _iter_source_files(in_path: str):
    """The files that make up ONE source. A directory (a Zeek capture, a host's
    event-log export) is a single source: every file under it is routed and
    merged into ONE car.db, so within-source cross-log enrichment can run and no
    other source is depended on. A single file is a one-file source."""
    if os.path.isdir(in_path):
        for root, _dirs, files in os.walk(in_path):
            for fn in sorted(files):
                yield os.path.join(root, fn)
    else:
        yield in_path


def process_file(in_path: str, out_dir: str, artefacts: list[str] | None = None,
                 default_host: str | None = None) -> dict:
    """One SOURCE -> its own enriched CAR database + JSON export. The source is a
    single file, or a directory whose files together are one source (Zeek's per-
    protocol logs; a host's event-log channels) — same isolation either way."""
    os.makedirs(out_dir, exist_ok=True)
    name = os.path.basename(in_path.rstrip("/"))

    if name == "car.db":                       # PIIAT-Mem finished CAR: passthrough
        events = sources.load_piiat_car(in_path)
        used = ["memory (passthrough)"]
    else:
        events, used = [], []

        def _consume_rec(arts, rec):
            for art in arts:
                ev = sources.normalize.normalize(art, rec)
                if ev is None:
                    continue
                if not ev.get("source_host"):
                    ev["source_host"] = default_host
                events.append(ev)

        def _consume(arts, path):
            """Read `path` ONCE and run every routed map per record (content-
            routing sends an evtx file to all evtx maps — re-reading the file per
            map is what made this O(maps × file))."""
            arts = [a for a in arts if a]
            if not arts:
                return
            for a in arts:
                if a not in used:
                    used.append(a)
            # a Plaso winevt table is PORTED to the evtx maps: adapt each record
            # to the EvtxECmd shape, then run the existing EVTX_MAPS over it
            if arts == ["l2t_winevt"]:
                from . import winevt_adapter
                for a in EVTX_MAPS:
                    if a not in used:
                        used.append(a)
                for wrapped in sources.iter_jsonl(path):
                    shaped = winevt_adapter.adapt(wrapped)
                    if shaped is not None:
                        _consume_rec(EVTX_MAPS, shaped)
                return
            for rec in sources.iter_jsonl(path):
                _consume_rec(arts, rec)

        for f in _iter_source_files(in_path):
            if artefacts:
                _consume(artefacts, f)
            elif _is_raw_l2t(f):
                # a raw log2timeline json_line file is a CONTAINER of many
                # parsers; wrap+split it into per-parser tables (the shape the
                # l2t maps expect) and route each table by its name
                from ..ingest import prepare  # lazy: keeps the heavy ingest/kusto
                tmp = tempfile.mkdtemp(prefix="car_l2t_")   # deps out of the car import graph
                try:
                    tables = prepare.split_l2t(f, os.path.basename(f), tmp,
                                               os.path.basename(f))
                    for tpath in tables.values():
                        _consume(route(tpath), tpath)
                finally:
                    shutil.rmtree(tmp, ignore_errors=True)
            else:
                _consume(route(f), f)

    # enrichment is SELF-CONTAINED: only THIS source's events are in scope
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
