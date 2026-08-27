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
    ap.add_argument("--fetch", action="store_true",
                    help="provision rules when online: the yara lane fetches the pinned "
                         "DetectRaptor ruleset when it has no rules yet (see "
                         "signatures/detectraptor.py); the other lanes still record a "
                         "note when their deps are missing")
    ap.add_argument("--force", action="store_true", help="regenerate outputs that already exist")
    # YARA source selection (the shell lane's YARA_SOURCES).
    ap.add_argument("--yara-sources",
                    help="comma list of yara sources to run: files,disk,memory "
                         "(default all three). disk needs /dev/fuse + ewfmount/ntfs-3g "
                         "on the host; memory needs the Volatility 3 image + symbols.")
    # Suricata tuning (HOME_NET is Suricata's primary tuning variable: rule direction
    # keys off $HOME_NET/$EXTERNAL_NET).
    ap.add_argument("--home-net", help="Suricata HOME_NET, e.g. '[10.0.0.0/8,192.168.0.0/16]'. "
                    "Applies to every pcap; EXTERNAL_NET defaults to its complement.")
    ap.add_argument("--external-net", help="Suricata EXTERNAL_NET (default: !$HOME_NET).")
    ap.add_argument("--auto-home-net", action="store_true",
                    help="derive HOME_NET per-pcap from its own traffic (a cheap default-vars "
                         "pass first). Ignored if --home-net is given.")
    ap.add_argument("--suricata-set", action="append", metavar="KEY=VALUE",
                    help="raw Suricata --set tuning entry, repeatable (e.g. "
                         "vars.port-groups.HTTP_PORTS=8080).")
    args = ap.parse_args(argv)

    lanes = tuple(args.only) if args.only else LANES
    config = {"suricata": {
        "home_net": args.home_net,
        "external_net": args.external_net,
        "auto_home_net": args.auto_home_net,
        "extra_sets": args.suricata_set or [],
    }}
    if args.yara_sources:
        srcs = tuple(s.strip() for s in args.yara_sources.split(",") if s.strip())
        bad = [s for s in srcs if s not in ("files", "disk", "memory")]
        if bad:
            ap.error(f"--yara-sources: unknown source(s) {','.join(bad)} "
                     "(choose from files,disk,memory)")
        config["yara"] = {"sources": srcs}
    summary = process(
        args.output_dir, lanes, repo_root=args.repo_root,
        fetch=args.fetch, force=args.force, config=config,
    )
    json.dump(summary, sys.stdout)
    sys.stdout.write("\n")
    return 1 if summary["failed"] and not summary["processed"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
