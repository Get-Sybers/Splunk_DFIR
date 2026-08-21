"""Deploy helper — create the databases and apply the Kusto schema.

Port of ``scripts/apply-kusto-schema.sh``. The container itself is stood up by the
``dfir_deploy_adx`` role (``community.docker.docker_container``); this module does the
schema side against the running engine:

  1. parse the database names from ``00-databases.kql`` (the .kql stays the single
     source of truth; names are bracket-quoted because ``network`` is a reserved word).
  2. ``.show databases`` -> create only the ones that are missing (``.create database``
     is NOT idempotent and aborts on an existing db), volatile or persist().
  3. apply each ``[1-9]*.kql`` with ``.execute database script`` to the database named
     in its ``// Database:`` header. Those files use idempotent forms
     (.create-merge / .create-or-alter), so a re-applied schema converges.

Idempotent for the role: ``created_dbs`` counts only databases newly created, so a
re-deploy against an existing cluster reports ``created_dbs == 0`` (changed=false)
while still safely re-applying the idempotent schema.
"""
from __future__ import annotations

import argparse
import glob
import json
import os
import re
import sys

from .ingest.kusto import KustoClient, error_message, failed

_DB_RE = re.compile(r'^\.create database\s+\[?"?([A-Za-z_][A-Za-z0-9_]*)"?\]?')
_HDR_RE = re.compile(r"^//\s*Database:\s*([A-Za-z_][A-Za-z0-9_]*)")


def parse_databases(db_file: str) -> list[str]:
    """Database names declared in 00-databases.kql (bracket/quote stripped)."""
    out = []
    with open(db_file, encoding="utf-8") as fh:
        for line in fh:
            m = _DB_RE.match(line.strip())
            if m:
                out.append(m.group(1))
    return out


def schema_db(path: str) -> str | None:
    """The database a schema file targets, from its `// Database: <name>` header."""
    with open(path, encoding="utf-8") as fh:
        for line in fh:
            m = _HDR_RE.match(line.strip())
            if m:
                return m.group(1)
    return None


def _existing_databases(client: KustoClient) -> set[str] | None:
    resp = client.mgmt("NetDefaultDB", ".show databases | project DatabaseName")
    if failed(resp):
        return None
    try:
        d = json.loads(resp)
        rows = (d.get("Tables") or [{}])[0].get("Rows") or []
        return {r[0] for r in rows if r and r[0]}
    except (json.JSONDecodeError, ValueError, IndexError):
        return None


def apply_schema(schema_dir, host="127.0.0.1", port=8080, container="kusto-emulator",
                 persist=False, dry_run=False) -> dict:
    client = KustoClient(host=host, port=port, container=container)
    summary = {
        "tool": "deploy-schema", "endpoint": client.base, "schema_dir": schema_dir,
        "created_dbs": 0, "applied_files": 0, "failed": 0, "errors": [], "dry_run": dry_run,
    }
    db_file = os.path.join(schema_dir, "00-databases.kql")
    if not os.path.isfile(db_file):
        summary["error"] = f"missing {db_file}"
        return summary
    databases = parse_databases(db_file)
    if not databases:
        summary["error"] = f"no databases declared in {db_file}"
        return summary

    existing: set[str] = set()
    if not dry_run:
        if not client.reachable():
            summary["error"] = f"nothing answering at {client.base} (deploy the container first)"
            return summary
        got = _existing_databases(client)
        if got is None:
            summary["error"] = "could not list databases"
            return summary
        existing = got

    # 1) create missing databases
    for db in databases:
        if dry_run or db in existing:
            continue
        if persist:
            cmd = f'.create database ["{db}"] persist (@"/kustodata/dbs/{db}/md", @"/kustodata/dbs/{db}/data")'
        else:
            cmd = f'.create database ["{db}"] volatile'
        resp = client.mgmt("NetDefaultDB", cmd)
        if failed(resp):
            summary["failed"] += 1
            summary["errors"].append({"db": db, "error": error_message(resp)})
        else:
            summary["created_dbs"] += 1

    # 2) apply the per-database schema files
    for f in sorted(glob.glob(os.path.join(schema_dir, "[1-9]*.kql"))):
        db = schema_db(f)
        if not db:
            summary["errors"].append({"file": os.path.basename(f), "error": "no `// Database:` header"})
            continue
        if dry_run:
            summary["applied_files"] += 1
            continue
        with open(f, encoding="utf-8") as fh:
            contents = fh.read()
        resp = client.mgmt(db, ".execute database script <|\n" + contents)
        if failed(resp):
            summary["failed"] += 1
            summary["errors"].append({"file": os.path.basename(f), "db": db, "error": error_message(resp)})
        else:
            summary["applied_files"] += 1
    return summary


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(
        prog="get_sybers_dfir.deploy",
        description="create databases + apply the Kusto schema to the ADX emulator",
    )
    ap.add_argument("--schema-dir", required=True, help="dir of *.kql schema files")
    ap.add_argument("--host", default="127.0.0.1")
    ap.add_argument("--port", type=int, default=8080)
    ap.add_argument("--container", default="kusto-emulator")
    ap.add_argument("--persist", action="store_true", help="create persistent (on-disk) databases")
    ap.add_argument("--dry-run", action="store_true", help="print what would be sent; contact nothing")
    args = ap.parse_args(argv)

    summary = apply_schema(
        args.schema_dir, host=args.host, port=args.port, container=args.container,
        persist=args.persist, dry_run=args.dry_run,
    )
    json.dump(summary, sys.stdout)
    sys.stdout.write("\n")
    if summary.get("error"):
        sys.stderr.write(summary["error"] + "\n")
        return 2
    return 1 if summary["failed"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
