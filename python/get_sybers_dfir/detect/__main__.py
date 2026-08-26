"""CLI for the detection orchestrator: python -m get_sybers_dfir.detect ..."""
from __future__ import annotations

import argparse
import json
import sys

from . import DEFAULT_LIMIT, process
from .registry import DETECTIONS, validate


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(
        prog="get_sybers_dfir.detect",
        description="Sweep the processed data in the ADX (Kusto) emulator with "
                    "every applicable registered detection",
    )
    ap.add_argument("--processed-dir",
                    help="data_store/processed tree (for the signature-lane JSONL detections)")
    ap.add_argument("--list", action="store_true", dest="list_",
                    help="list the registered detections and exit")
    ap.add_argument("--ping", action="store_true",
                    help="check the emulator is reachable; exit 0/1")
    ap.add_argument("--only", help="run only these detection id(s), comma-separated")
    ap.add_argument("--dry-run", action="store_true",
                    help="report which detections would run against the present "
                         "data (read-only targeting queries); execute nothing")
    ap.add_argument("--limit", type=int, default=DEFAULT_LIMIT,
                    help=f"max hits recorded per detection (default {DEFAULT_LIMIT})")
    ap.add_argument("--jsonl-out", help="also export this sweep's hits as JSON Lines here")
    ap.add_argument("--host", default="127.0.0.1", help="emulator host (default 127.0.0.1)")
    ap.add_argument("--port", type=int, default=8080, help="emulator port (default 8080)")
    ap.add_argument("--container", default="kusto-emulator", help="emulator container name")
    args = ap.parse_args(argv)

    if args.ping:
        from ..ingest.kusto import KustoClient
        up = KustoClient(host=args.host, port=args.port, container=args.container).reachable()
        sys.stdout.write(("reachable" if up else "unreachable") + f" {args.host}:{args.port}\n")
        return 0 if up else 1

    if args.list_:
        validate()
        for d in DETECTIONS:
            attack = ",".join(d["attack"]) or "-"
            sys.stdout.write(f"{d['id']}\t{d['kind']}\t{d['severity']}\t{attack}\t"
                             f"{d['target']}\t{d['title']}\n")
        return 0

    summary = process(
        processed_dir=args.processed_dir, only=args.only, dry_run=args.dry_run,
        limit=args.limit, jsonl_out=args.jsonl_out,
        host=args.host, port=args.port, container=args.container,
    )
    json.dump(summary, sys.stdout)
    sys.stdout.write("\n")
    if summary.get("error"):
        sys.stderr.write(summary["error"] + "\n")
        return 2
    return 1 if summary["failed"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
