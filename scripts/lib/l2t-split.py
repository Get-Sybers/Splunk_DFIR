#!/usr/bin/env python3
"""Split a Plaso json_line file by TOP-LEVEL parser for per-parser ADX tables.

Reads one psort json_line file and writes one staged JSON-Lines file per
top-level parser, wrapping each event {SourceImage, Timestamp, Parser, Record}:

  SourceImage  per-file provenance (a constant .ingest cannot inject)
  Timestamp    Plaso's microsecond `timestamp` converted to an ISO-8601 datetime
               (a JSON ingestion mapping cannot call a conversion function); a
               zero/absent/out-of-range timestamp is left unset rather than 1970
  Parser       the FULL parser string ("winreg/appcompatcache"), kept as a field
               in every table so the plugin stays distinguishable
  Record       the whole Plaso event (already carries image_hostname/disk_id/…)

The destination TABLE is the top-level parser (before the first "/"): filestat ->
L2tFilestat, winreg/appcompatcache -> L2tWinreg, firefox_cache -> L2tFirefoxCache.
Prints one "<TableName>\\t<staged_path>" line per table produced, for the loader.
"""
import json, sys, os, re, datetime

path, rel, stage_dir, prefix = sys.argv[1:5]


def table_name(parser):
    top = re.split(r"/", parser or "unknown")[0] or "unknown"
    parts = [p for p in re.split(r"[^A-Za-z0-9]+", top) if p]
    return "L2t" + "".join(p[:1].upper() + p[1:] for p in parts) if parts else "L2tUnknown"


handles = {}
paths = {}
for line in open(path, encoding="utf-8", errors="replace"):
    line = line.strip()
    if not line:
        continue
    try:
        rec = json.loads(line)
    except Exception:
        continue
    parser = str(rec.get("parser") or "unknown")
    table = table_name(parser)

    out = {"SourceImage": rel, "Parser": parser, "Record": rec}
    ts = rec.get("timestamp")
    if isinstance(ts, (int, float)) and ts > 0:
        try:
            out["Timestamp"] = datetime.datetime.fromtimestamp(
                ts / 1_000_000, datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%fZ")
        except (OverflowError, OSError, ValueError):
            pass

    handle = handles.get(table)
    if handle is None:
        staged_path = os.path.join(stage_dir, "{}.{}.jsonl".format(prefix, table))
        handle = handles[table] = open(staged_path, "w", encoding="utf-8")
        paths[table] = staged_path
    handle.write(json.dumps(out) + "\n")

for handle in handles.values():
    handle.close()
for table, staged_path in paths.items():
    sys.stdout.write("{}\t{}\n".format(table, staged_path))
