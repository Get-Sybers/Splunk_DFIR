"""CLI for the ingest loader: python -m get_sybers_dfir.ingest ..."""
from __future__ import annotations

import argparse
import json
import sys

from . import VALID_SOURCES, process


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(
        prog="get_sybers_dfir.ingest",
        description="Load data_store/processed into the ADX (Kusto) emulator",
    )
    ap.add_argument("--processed-dir", help="data_store/processed tree to load")
    ap.add_argument("--ping", action="store_true", help="check the emulator is reachable; exit 0/1")
    ap.add_argument("--only", choices=list(VALID_SOURCES), help="load one source only")
    ap.add_argument("--dry-run", action="store_true", help="list what would be loaded; contact nothing")
    ap.add_argument("--force", action="store_true", help="re-ingest files already in the ledger")
    ap.add_argument("--host", default="127.0.0.1", help="emulator host (default 127.0.0.1)")
    ap.add_argument("--port", type=int, default=8080, help="emulator port (default 8080)")
    ap.add_argument("--container", default="kusto-emulator", help="emulator container name")
    args = ap.parse_args(argv)

    if args.ping:
        from .kusto import KustoClient
        up = KustoClient(host=args.host, port=args.port, container=args.container).reachable()
        sys.stdout.write(("reachable" if up else "unreachable") + f" {args.host}:{args.port}\n")
        return 0 if up else 1

    if not args.processed_dir:
        ap.error("--processed-dir is required unless --ping is given")

    summary = process(
        args.processed_dir, only=args.only, dry_run=args.dry_run, force=args.force,
        host=args.host, port=args.port, container=args.container,
    )
    json.dump(summary, sys.stdout)
    sys.stdout.write("\n")
    if summary.get("error"):
        sys.stderr.write(summary["error"] + "\n")
        return 2
    return 1 if summary["failed"] and not summary["submitted"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
