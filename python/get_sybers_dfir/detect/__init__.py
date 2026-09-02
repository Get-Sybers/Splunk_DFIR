"""Detection orchestration — sweep every processed data type, run what applies.

The runner half of DetectRaptor's model, adapted to DX_DFIR's Kusto backend.
DetectRaptor's ``Server.StartHunts`` iterates a HuntList of detection artifacts,
filters them (``ArtifactRegex`` / ``TestTargeting``), and schedules each
applicable one against the data its artifact declares; applicability is settled
by the artifact's own preconditions. Here the same shape becomes:

    HuntList            -> :mod:`.registry` (each entry declares its target data)
    precondition         -> the SURVEY: which declared tables actually exist and
                            are non-empty in the emulator / which signature-lane
                            JSONL files are actually on disk
    TestTargeting        -> ``--dry-run`` (report the targeting decisions, run
                            nothing, write nothing)
    ArtifactRegex        -> ``--only`` (comma-separated detection ids)
    hunt() + hunt results-> execute each applicable detection and collect every
                            hit, uniformly tagged, in ``misc.Detections``

Execution is engine-side where the data is: a ``kusto`` detection becomes one
``.set-or-append misc.Detections <| <query> | ...tags`` management command, so
hit rows never transit Python. A ``jsonl`` detection streams its lane files
locally and lands its hits in the same table via inline ingest. Every hit row
carries the same envelope::

    RunId, DetectionId, Title, Severity, AttackIds, Source,
    Timestamp, Entity, Details, DetectedAt

A sweep is additive (append-only) and tagged with a fresh ``RunId``; the
``DetectionsLatest()`` / ``DetectionSummary()`` views (kusto/schema/
50-detections.kql) read the newest sweep, so re-running never double-counts.
``--jsonl-out`` additionally exports the sweep's hits as JSON Lines.

NOTE unlike ingest, ``--dry-run`` still talks to the emulator: targeting *is*
reading which tables are present and non-empty (read-only queries; DetectRaptor's
TestTargeting equally needs the server). It writes nothing.
"""
from __future__ import annotations

import csv
import datetime
import fnmatch
import io
import json
import os
import uuid

from ..ingest.kusto import KustoClient, error_message, failed
from .registry import DETECTIONS, validate

DETECTIONS_DB = "misc"
DETECTIONS_TABLE = "Detections"
DEFAULT_LIMIT = 1000

# Kept in lockstep with kusto/schema/50-detections.kql (same column order — the
# inline-CSV ingest below maps by ordinal). Ensured here too, like the ingest
# ledger, so the runner works against an emulator whose schema predates it.
_SCHEMA = (
    f".create-merge table {DETECTIONS_TABLE} ("
    "RunId:string, DetectionId:string, Title:string, Severity:string, "
    "AttackIds:string, Source:string, Timestamp:datetime, Entity:string, "
    "Details:dynamic, DetectedAt:datetime)"
)
_COLUMNS = ("RunId", "DetectionId", "Title", "Severity", "AttackIds", "Source",
            "Timestamp", "Entity", "Details", "DetectedAt")


# ---- small pure helpers (unit-tested) --------------------------------------
def _kql_str(s: str) -> str:
    """A KQL double-quoted string literal (for registry metadata tags)."""
    return '"' + str(s).replace("\\", "\\\\").replace('"', '\\"') + '"'


def _utc_now_iso() -> str:
    return datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%fZ")


def new_run_id() -> str:
    """Sortable per-sweep tag: UTC time + entropy (max(RunId) is the latest run)."""
    now = datetime.datetime.now(datetime.timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    return f"{now}-{uuid.uuid4().hex[:8]}"


def iso_timestamp(ts) -> str:
    """Normalise a lane timestamp (ISO variants, Hayabusa's 'Y-m-d H:M:S.f z')
    to the ISO-8601 UTC form Kusto ingests; '' (null) when unparseable."""
    if ts is None:
        return ""
    s = str(ts).strip()
    if not s:
        return ""
    dt = None
    try:
        dt = datetime.datetime.fromisoformat(s.replace("Z", "+00:00"))
    except ValueError:
        for fmt in ("%Y-%m-%dT%H:%M:%S.%f%z", "%Y-%m-%dT%H:%M:%S%z",
                    "%Y-%m-%d %H:%M:%S.%f %z", "%Y-%m-%d %H:%M:%S %z"):
            try:
                dt = datetime.datetime.strptime(s, fmt)
                break
            except ValueError:
                continue
    if dt is None:
        return ""
    if dt.tzinfo is not None:
        dt = dt.astimezone(datetime.timezone.utc).replace(tzinfo=None)
    return dt.strftime("%Y-%m-%dT%H:%M:%S.%fZ")


def kusto_command(det: dict, run_id: str, limit: int) -> str:
    """The single engine-side command a kusto detection compiles to: run the
    query where the data lives, cap it, stamp the envelope, append the hits."""
    attack = ",".join(det.get("attack", []))
    return (
        f".set-or-append {DETECTIONS_TABLE} <|\n"
        f"{det['query'].strip()}\n"
        f"| project Timestamp = todatetime(Timestamp), Entity = tostring(Entity), Details\n"
        f"| take {int(limit)}\n"
        f"| extend RunId = {_kql_str(run_id)}, DetectionId = {_kql_str(det['id'])},\n"
        f"         Title = {_kql_str(det['title'])}, Severity = {_kql_str(det['severity'])},\n"
        f"         AttackIds = {_kql_str(attack)}, Source = {_kql_str(det['target'])},\n"
        f"         DetectedAt = now()\n"
        f"| project {', '.join(_COLUMNS)}"
    )


def hits_to_csv(det: dict, hits: list[dict], run_id: str) -> str:
    """jsonl-lane hits as inline-ingest CSV rows (column order = table order).

    AttackIds is per-hit: a hit that parsed its own ATT&CK technique ids (from
    Hayabusa MitreTags, a Suricata alert's ``mitre_technique_id``, or a YARA
    rule's meta) carries them; a hit without falls back to the detection's static
    ``attack`` list — '' for the signature lanes, which declare none."""
    default_attack = det.get("attack", [])
    now = _utc_now_iso()
    buf = io.StringIO()
    w = csv.writer(buf, lineterminator="\n")
    for h in hits:
        attack = ",".join(h.get("AttackIds") or default_attack)
        w.writerow([
            run_id, det["id"], det["title"], det["severity"], attack, det["target"],
            iso_timestamp(h.get("Timestamp")), str(h.get("Entity", "") or ""),
            json.dumps(h.get("Details") or {}, ensure_ascii=False, default=str), now,
        ])
    return buf.getvalue().rstrip("\n")


def scan_jsonl(paths: list[str], match, limit: int) -> tuple[list[dict], int]:
    """Stream the lane files through the detection's predicate.
    Returns (hits capped at limit, count of unparseable lines)."""
    hits: list[dict] = []
    bad = 0
    for path in paths:
        try:
            fh = open(path, encoding="utf-8", errors="replace")
        except OSError:
            continue                       # pruned mid-run — same stance as ingest
        with fh:
            for line in fh:
                line = line.strip()
                if not line:
                    continue
                try:
                    rec = json.loads(line)
                except json.JSONDecodeError:
                    bad += 1
                    continue
                hit = match(rec)
                if hit:
                    hits.append(hit)
                    if len(hits) >= limit:
                        return hits, bad
    return hits, bad


def _find(root: str, glob: str) -> list[str]:
    out = []
    for cur, _dirs, files in os.walk(root):
        for name in files:
            if fnmatch.fnmatch(name, glob):
                p = os.path.join(cur, name)
                try:
                    if os.path.getsize(p) > 0:
                        out.append(p)
                except OSError:
                    continue
    return sorted(out)


# ---- survey: what data is actually present ---------------------------------
def _rows(resp: str) -> list[list]:
    try:
        d = json.loads(resp)
        return (d.get("Tables") or [{}])[0].get("Rows") or []
    except (json.JSONDecodeError, ValueError, IndexError):
        return []


def survey(client: KustoClient, tables: set[str]) -> dict[str, int | None]:
    """Row counts for every ``db.Table`` a registered detection targets.
    None = the table (or its database) does not exist; 0 = exists but empty."""
    counts: dict[str, int | None] = {}
    by_db: dict[str, set[str]] = {}
    for t in tables:
        db, name = t.split(".", 1)
        by_db.setdefault(db, set()).add(name)
    for db in sorted(by_db):
        resp = client.mgmt(db, ".show tables")
        have = set() if failed(resp) else {r[0] for r in _rows(resp) if r}
        for name in sorted(by_db[db]):
            key = f"{db}.{name}"
            if name not in have:
                counts[key] = None
                continue
            r = client.query(db, f"['{name}'] | count")
            counts[key] = None if failed(r) else int(_rows(r)[0][0])
    return counts


# ---- per-detection execution -----------------------------------------------
def _applicable_kusto(det: dict, counts: dict) -> tuple[bool, str]:
    for req in det["requires"]:
        n = counts.get(req)
        if n is None:
            return False, f"target table {req} does not exist"
        if n == 0:
            return False, f"target table {req} is empty"
    return True, ""


def _count_hits(client: KustoClient, run_id: str, det_id: str) -> int:
    r = client.query(
        DETECTIONS_DB,
        f'{DETECTIONS_TABLE} | where RunId == {_kql_str(run_id)} '
        f'and DetectionId == {_kql_str(det_id)} | count')
    rows = _rows(r)
    return int(rows[0][0]) if not failed(r) and rows else 0


def _run_kusto(client, det, run_id, limit, entry, summary):
    resp = client.mgmt(DETECTIONS_DB, kusto_command(det, run_id, limit))
    if failed(resp):
        entry.update(status="failed", error=error_message(resp))
        summary["failed"] += 1
        summary["errors"].append({"detection": det["id"], "error": entry["error"]})
        return
    entry.update(status="ran", hits=_count_hits(client, run_id, det["id"]))
    summary["ran"] += 1
    summary["hits_total"] += entry["hits"]


def _run_jsonl(client, det, files, run_id, limit, entry, summary):
    hits, bad = scan_jsonl(files, det["match"], limit)
    if bad:
        entry["unparseable_lines"] = bad
    if hits:
        csv_rows = hits_to_csv(det, hits, run_id)
        resp = client.mgmt(
            DETECTIONS_DB,
            f".ingest inline into table {DETECTIONS_TABLE} <|\n{csv_rows}")
        if failed(resp):
            entry.update(status="failed", error=error_message(resp))
            summary["failed"] += 1
            summary["errors"].append({"detection": det["id"], "error": entry["error"]})
            return
    entry.update(status="ran", hits=len(hits))
    summary["ran"] += 1
    summary["hits_total"] += len(hits)


def export_jsonl(client: KustoClient, run_id: str, out_path: str) -> int:
    """Write this sweep's hits (queried back from misc.Detections) as JSONL."""
    r = client.query(
        DETECTIONS_DB,
        f"{DETECTIONS_TABLE} | where RunId == {_kql_str(run_id)} "
        f"| order by DetectionId asc, Timestamp asc")
    if failed(r):
        raise RuntimeError(f"could not read back hits: {error_message(r)}")
    d = json.loads(r)
    table = (d.get("Tables") or [{}])[0]
    cols = [c.get("ColumnName") for c in table.get("Columns", [])]
    rows = table.get("Rows") or []
    os.makedirs(os.path.dirname(os.path.abspath(out_path)), exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as fh:
        for row in rows:
            fh.write(json.dumps(dict(zip(cols, row)), ensure_ascii=False,
                                default=str) + "\n")
    return len(rows)


# ---- the sweep --------------------------------------------------------------
def process(processed_dir: str | None = None, only: str | None = None,
            dry_run: bool = False, limit: int = DEFAULT_LIMIT,
            jsonl_out: str | None = None, host: str = "127.0.0.1",
            port: int = 8080, container: str = "kusto-emulator") -> dict:
    """Run every applicable registered detection; return the sweep summary."""
    validate()
    client = KustoClient(host=host, port=port, container=container)
    run_id = new_run_id()
    summary = {
        "tool": "detect", "endpoint": client.base, "run_id": run_id,
        "dry_run": dry_run, "limit": limit,
        "registered": 0, "ran": 0, "skipped": 0, "failed": 0, "hits_total": 0,
        "detections": {}, "errors": [],
    }

    wanted = {s.strip() for s in only.split(",") if s.strip()} if only else None
    selected = [d for d in DETECTIONS if wanted is None or d["id"] in wanted]
    if wanted:
        unknown = wanted - {d["id"] for d in selected}
        if unknown:
            summary["error"] = f"unknown detection id(s): {', '.join(sorted(unknown))}"
            return summary
    summary["registered"] = len(selected)

    if not client.reachable():
        summary["error"] = f"nothing answering at {client.base} (deploy first)"
        return summary

    # Targeting: what does the selected registry need, and what is present?
    kusto_targets = {req for d in selected if d["kind"] == "kusto" for req in d["requires"]}
    counts = survey(client, kusto_targets) if kusto_targets else {}
    summary["present"] = counts

    if not dry_run:
        resp = client.mgmt(DETECTIONS_DB, _SCHEMA)
        if failed(resp):
            summary["error"] = f"could not ensure {DETECTIONS_DB}.{DETECTIONS_TABLE}: {error_message(resp)}"
            return summary

    for det in selected:
        entry = {"kind": det["kind"], "target": det["target"], "hits": 0}
        summary["detections"][det["id"]] = entry
        if det["kind"] == "kusto":
            ok, reason = _applicable_kusto(det, counts)
            if not ok:
                entry.update(status="skipped", reason=reason)
                summary["skipped"] += 1
            elif dry_run:
                entry["status"] = "would-run"
            else:
                _run_kusto(client, det, run_id, limit, entry, summary)
        else:
            root = os.path.join(processed_dir or "", det["subdir"])
            files = _find(root, det["glob"]) if processed_dir and os.path.isdir(root) else []
            if not files:
                entry.update(status="skipped",
                             reason=f"no non-empty {det['glob']} under {det['subdir']}")
                summary["skipped"] += 1
            elif dry_run:
                entry.update(status="would-run", files=len(files))
            else:
                _run_jsonl(client, det, files, run_id, limit, entry, summary)

    if jsonl_out and not dry_run:
        try:
            summary["jsonl_out"] = {"path": jsonl_out,
                                    "rows": export_jsonl(client, run_id, jsonl_out)}
        except (RuntimeError, OSError) as e:
            summary["errors"].append({"detection": "(export)", "error": str(e)})
    return summary
