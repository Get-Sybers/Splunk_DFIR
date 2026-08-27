"""Load ``data_store/processed`` into the ADX (Kusto) emulator.

Each source's files are shaped (constant-column wrapping — see :mod:`.prepare`),
copied INTO the emulator container (it reads from its own filesystem, not the
host's), and loaded with a batched ``.ingest into``. Plaso l2t has its own driver:
one json_line file fans out into several ``L2t<Parser>`` tables.

A bare ``.ingest`` is additive (no fishbucket) — re-running would duplicate rows.
To make the role idempotent, a tiny in-DB **ledger** (``host._DfirIngestLedger``)
records the sha1 of every source file loaded; a file already in the ledger is
skipped unless ``force`` is set. The ledger lives in the (ephemeral) database, so a
redeploy wipes the ledger and the data together — they never drift.
"""
from __future__ import annotations

import datetime
import hashlib
import json
import os
import subprocess
import tempfile

from .kusto import KustoClient, error_message, failed
from . import prepare

CONTAINER_STAGE = "/tmp/dfir-ingest"
_LEDGER_DB = "host"
_LEDGER_TABLE = "_DfirIngestLedger"
_BATCH = 50

L2T_MAPPING = (
    '[{"Column":"SourceImage","Properties":{"Path":"$.SourceImage"}},'
    '{"Column":"Timestamp","Properties":{"Path":"$.Timestamp"}},'
    '{"Column":"Parser","Properties":{"Path":"$.Parser"}},'
    '{"Column":"Record","Properties":{"Path":"$.Record"}}]'
)

# key | label | subdir | glob | db | table | mapping | fmt | hdr | wrap-hook
SOURCES = [
    {"key": "evtx", "label": "EvtxECmd -> host.EvtxEcmdJson", "subdir": "windows_logs",
     "glob": "*_EvtxECmd_Output.json", "db": "host", "table": "EvtxEcmdJson",
     "mapping": "EvtxEcmdJsonMapping", "fmt": "multijson", "hdr": False, "wrap": None},
    {"key": "zeek", "label": "Zeek conn -> network.ZeekConn", "subdir": "zeek",
     "glob": "conn.json", "db": "network", "table": "ZeekConn",
     "mapping": "ZeekConnMapping", "fmt": "multijson", "hdr": False, "wrap": None},
    {"key": "zeek", "label": "Zeek other logs -> network.Zeek", "subdir": "zeek",
     "glob": "*.json", "db": "network", "table": "Zeek",
     "mapping": "ZeekJsonMapping", "fmt": "multijson", "hdr": False, "wrap": "zeek"},
    {"key": "volatility", "label": "Volatility 3 -> memory.VolatilityJson", "subdir": "volatility",
     "glob": "*.jsonl", "db": "memory", "table": "VolatilityJson",
     "mapping": "VolatilityJsonMapping", "fmt": "multijson", "hdr": False, "wrap": "volatility"},
    {"key": "velociraptor", "label": "Velociraptor -> host.VelociraptorJson", "subdir": "velociraptor",
     "glob": "*.json", "db": "host", "table": "VelociraptorJson",
     "mapping": "VelociraptorJsonMapping", "fmt": "multijson", "hdr": False, "wrap": "velociraptor"},
]

_WRAP_FUNCS = {
    "zeek": prepare.zeek_wrap,
    "volatility": prepare.volatility_wrap,
    "velociraptor": prepare.velociraptor_wrap,
}

VALID_SOURCES = ("l2t", "zeek", "evtx", "volatility", "velociraptor")


# ---- helpers ---------------------------------------------------------------
def _find(root: str, glob: str) -> list[str]:
    import fnmatch
    out = []
    for cur, _dirs, files in os.walk(root):
        for name in files:
            if fnmatch.fnmatch(name, glob):
                out.append(os.path.join(cur, name))
    return sorted(out)


def _file_hash(rel: str) -> str:
    return hashlib.sha1(rel.encode("utf-8")).hexdigest()


def _docker_exec(container: str, *args: str) -> bool:
    return subprocess.run(["docker", "exec", container, *args],
                          capture_output=True).returncode == 0


def _docker_cp(src: str, container: str, dest: str) -> bool:
    return subprocess.run(["docker", "cp", src, f"{container}:{dest}"],
                          capture_output=True).returncode == 0


# ---- ledger ----------------------------------------------------------------
def ensure_ledger(client: KustoClient) -> None:
    client.mgmt(_LEDGER_DB, f".create-merge table {_LEDGER_TABLE} (Hash:string, IngestedAt:datetime)")


def ledger_hashes(client: KustoClient) -> set[str]:
    resp = client.query(_LEDGER_DB, f"{_LEDGER_TABLE} | distinct Hash")
    if failed(resp):
        return set()
    try:
        d = json.loads(resp)
        rows = (d.get("Tables") or [{}])[0].get("Rows") or []
        return {r[0] for r in rows if r and r[0]}
    except (json.JSONDecodeError, ValueError, IndexError):
        return set()


def record_hashes(client: KustoClient, hashes: list[str]) -> None:
    if not hashes:
        return
    now = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%fZ")
    csv = "\n".join(f"{h},{now}" for h in hashes)
    client.mgmt(_LEDGER_DB, f".ingest inline into table {_LEDGER_TABLE} <|\n{csv}")


# ---- ingest ----------------------------------------------------------------
def _ingest_cmd(table: str, locators: list[str], mapping: str, fmt: str, hdr: bool) -> str:
    locs = ", ".join(f'@"{p}"' for p in locators)
    cmd = f'.ingest into table {table} ({locs}) with (format="{fmt}"'
    if mapping and mapping != "-":
        cmd += f', ingestionMappingReference="{mapping}"'
    if hdr:
        cmd += ", ignoreFirstRecord=true"
    return cmd + ")"


def _ingest_batched(client, db, table, mapping, fmt, hdr, locators, dry_run, summary) -> bool:
    """Ingest locators in batches of 50. Returns True if all batches succeeded."""
    ok = True
    for i in range(0, len(locators), _BATCH):
        batch = locators[i:i + _BATCH]
        summary["submitted"] += len(batch)
        if dry_run:
            continue
        resp = client.mgmt(db, _ingest_cmd(table, batch, mapping, fmt, hdr))
        if failed(resp):
            ok = False
            summary["failed"] += len(batch)
            summary["errors"].append({"table": f"{db}.{table}", "error": error_message(resp)})
    return ok


def _stage(files, processed_dir, wrap_key, container, staging_dir, dry_run, summary):
    """Return [(container_path, file_hash), ...] for files to ingest, staging each
    (docker cp the original, or a wrapped rewrite) into the container."""
    staged = []
    wrap_fn = _WRAP_FUNCS.get(wrap_key)
    for f in files:
        rel = os.path.relpath(f, processed_dir)
        name = prepare.staged_name(rel)
        dest = f"{CONTAINER_STAGE}/{name}"
        fh = _file_hash(rel)
        if dry_run:
            staged.append((dest, fh))
            continue
        if wrap_fn is None:                       # stage the original as-is
            if _docker_cp(f, container, dest):
                staged.append((dest, fh))
            else:
                summary["failed"] += 1
        else:
            lines = wrap_fn(f, rel)
            if not lines:                          # skipped (e.g. conn.json) or empty
                continue
            host_tmp = os.path.join(staging_dir, name)
            with open(host_tmp, "w") as w:
                w.write("\n".join(lines) + "\n")
            if _docker_cp(host_tmp, container, dest):
                staged.append((dest, fh))
            else:
                summary["failed"] += 1
    return staged


def run_source(client, row, processed_dir, container, staging_dir, seen, dry_run, summary):
    subdir = os.path.join(processed_dir, row["subdir"])
    if not os.path.isdir(subdir):
        return
    files = _find(subdir, row["glob"])
    # idempotence: skip files already in the ledger (unless forced -> seen is empty)
    todo = [f for f in files if _file_hash(os.path.relpath(f, processed_dir)) not in seen]
    if not todo:
        summary["sources"][row["label"]] = {"found": len(files), "ingested": 0, "skipped": len(files)}
        return
    staged = _stage(todo, processed_dir, row["wrap"], container, staging_dir, dry_run, summary)
    if not staged:
        summary["sources"][row["label"]] = {"found": len(files), "ingested": 0, "skipped": len(files) - len(todo)}
        return
    ok = _ingest_batched(client, row["db"], row["table"], row["mapping"],
                         row["fmt"], row["hdr"], [p for p, _ in staged], dry_run, summary)
    if ok and not dry_run:
        record_hashes(client, [h for _, h in staged])
    summary["sources"][row["label"]] = {
        "found": len(files), "ingested": len(staged), "skipped": len(files) - len(todo)}


def run_l2t(client, processed_dir, container, staging_dir, seen, dry_run, summary):
    jsonl_dir = os.path.join(processed_dir, "log2timeline", "jsonl")
    if not os.path.isdir(jsonl_dir):
        return
    files = _find(jsonl_dir, "*.jsonl")
    todo = [f for f in files if _file_hash(os.path.relpath(f, processed_dir)) not in seen]
    ingested = 0
    ensured = set()
    for f in todo:
        rel = os.path.relpath(f, processed_dir)
        fh = _file_hash(rel)
        prefix = prepare.staged_name(rel)
        if dry_run:
            # cheap streaming scan — never holds the (multi-GB) file in memory
            for _table in prepare.l2t_tables(f):
                summary["submitted"] += 1
            continue
        # Stream the split to per-table files on disk (staging_dir), one record at a
        # time — a Plaso json_line output can be many GB and must not be buffered.
        table_files = prepare.split_l2t(f, rel, staging_dir, prefix)
        if not table_files:
            continue
        file_ok = True
        for table, host_tmp in table_files.items():
            if table not in ensured:
                client.mgmt("host", f".create-merge table {table} "
                            "(SourceImage:string, Timestamp:datetime, Parser:string, Record:dynamic)")
                client.mgmt("host", f'.create-or-alter table {table} ingestion json mapping '
                            f'"L2tMapping" ```{L2T_MAPPING}```')
                ensured.add(table)
            dest = f"{CONTAINER_STAGE}/{prefix}.{table}"
            if not _docker_cp(host_tmp, container, dest):
                summary["failed"] += 1
                file_ok = False
            elif not _ingest_batched(client, "host", table, "L2tMapping", "multijson", False,
                                     [dest], dry_run, summary):
                file_ok = False
            # free the host staging file as we go — keeps disk use bounded
            try:
                os.remove(host_tmp)
            except OSError:
                pass
        if file_ok:
            record_hashes(client, [fh])
            ingested += 1
    summary["sources"]["Plaso l2t -> host.L2t<Parser>"] = {
        "found": len(files), "ingested": ingested, "skipped": len(files) - len(todo)}


def process(processed_dir, only=None, dry_run=False, force=False,
            host="127.0.0.1", port=8080, container="kusto-emulator") -> dict:
    processed_dir = os.path.realpath(processed_dir)
    client = KustoClient(host=host, port=port, container=container)
    summary = {
        "tool": "ingest", "endpoint": client.base, "processed_dir": processed_dir,
        "dry_run": dry_run, "submitted": 0, "failed": 0, "sources": {}, "errors": [],
    }
    if not os.path.isdir(processed_dir):
        summary["error"] = f"no processed dir at {processed_dir}"
        return summary
    if not dry_run and not client.reachable():
        summary["error"] = f"nothing answering at {client.base} (deploy first)"
        return summary

    seen: set[str] = set()
    if not dry_run:
        ensure_ledger(client)
        if not force:
            seen = ledger_hashes(client)
        if not _docker_exec(container, "mkdir", "-p", CONTAINER_STAGE):
            summary["error"] = f"could not reach container '{container}'"
            return summary

    # Stage on the same (disk-backed) filesystem as the processed data, NOT the
    # default /tmp — which is often tmpfs (RAM). The l2t split can write several GB
    # of per-table staging files, and buffering that in RAM would OOM the box.
    staging_base = os.path.dirname(processed_dir)
    if not (staging_base and os.path.isdir(staging_base)):
        staging_base = None  # fall back to the system default
    with tempfile.TemporaryDirectory(prefix="dfir-ingest-", dir=staging_base) as staging_dir:
        for row in SOURCES:
            if only and only != row["key"]:
                continue
            run_source(client, row, processed_dir, container, staging_dir, seen, dry_run, summary)
        if not only or only == "l2t":
            run_l2t(client, processed_dir, container, staging_dir, seen, dry_run, summary)

    if not dry_run:
        _docker_exec(container, "rm", "-rf", CONTAINER_STAGE)
    return summary
