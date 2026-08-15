"""CLI for the signatures processors: python -m get_sybers_dfir.signatures ..."""
from __future__ import annotations

import argparse
import json
import sys

from . import LANES, process


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(
        prog="get_sybers_dfir.signatures",
        description="YARA / Suricata / Hayabusa detection lanes -> JSONL",
    )
    ap.add_argument("--output-dir", required=True, help="base output dir (one <lane>/ per lane)")
    ap.add_argument("--repo-root", required=True, help="repo root (lane input/dep defaults hang off it)")
    ap.add_argument("--only", action="append", choices=list(LANES),
                    help="run only this lane (repeatable); default all")
    ap.add_argument("--fetch", action="store_true", help="provision rules/binaries when online")
    ap.add_argument("--force", action="store_true", help="regenerate outputs that already exist")
    args = ap.parse_args(argv)

    lanes = tuple(args.only) if args.only else LANES
    summary = process(
        args.output_dir, lanes, repo_root=args.repo_root,
        fetch=args.fetch, force=args.force,
    )
    json.dump(summary, sys.stdout)
    sys.stdout.write("\n")
    return 1 if summary["failed"] and not summary["processed"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
