"""Record-shaping for ingest — the constant-column wrapping ``.ingest`` cannot do.

``.ingest into`` cannot inject a per-file constant (which log type / plugin /
artefact / image a row came from), and it cannot convert Plaso's microsecond epoch
to a datetime. So each source's files are rewritten to JSON Lines with the constant
columns alongside the original record before staging:

  zeek (non-conn) -> {"LogType", "SourceFile", "Record"}   (conn is the typed table's job)
  volatility      -> {"Plugin",  "SourceFile", "Record"}
  velociraptor    -> {"Artefact","SourceFile", "Record"}
  plaso l2t       -> {"SourceImage","Timestamp","Parser","Record"}, one table per top parser

These functions are pure (path in, list-of-JSONL-strings out) so they unit-test
without a Kusto engine.
"""
from __future__ import annotations

import datetime
import hashlib
import json
import os
import re

_SAFE = re.compile(r"[^A-Za-z0-9._-]")


def staged_name(rel: str) -> str:
    """A collision-free, KQL-safe stage name for a file, from its path relative to
    the processed dir: an 8-char sha1 of the path (uniqueness) + the sanitised path
    (safety — staged names are spliced into KQL as @"..." verbatim strings)."""
    safe = _SAFE.sub("_", rel)
    digest = hashlib.sha1(rel.encode("utf-8")).hexdigest()[:8]
    return f"{digest}_{safe}"


def _records(path: str):
    """Yield the records in a processed file — a JSON array/object, or JSON Lines."""
    with open(path, encoding="utf-8", errors="replace") as fh:
        raw = fh.read()
    stripped = raw.lstrip()
    if stripped[:1] == "[":
        try:
            data = json.loads(stripped)
        except (json.JSONDecodeError, ValueError):
            return
        yield from (data if isinstance(data, list) else [data])
        return
    if stripped[:1] == "{" and "\n" not in stripped.strip():
        try:
            yield json.loads(stripped)
        except (json.JSONDecodeError, ValueError):
            return
        return
    for line in raw.splitlines():                 # JSON Lines
        line = line.strip()
        if not line:
            continue
        try:
            yield json.loads(line)
        except (json.JSONDecodeError, ValueError):
            continue


def wrap(path: str, key: str, value: str, source_rel: str) -> list[str]:
    """Wrap each record as {key: value, "SourceFile": source_rel, "Record": rec}."""
    return [
        json.dumps({key: value, "SourceFile": source_rel, "Record": rec})
        for rec in _records(path)
    ]


def zeek_logtype(path: str) -> str:
    return os.path.basename(path)[: -len(".json")] if path.lower().endswith(".json") else os.path.basename(path)


def zeek_wrap(path: str, source_rel: str) -> list[str] | None:
    """None for conn.json (skipped — the typed ZeekConn table loads it); else the
    generic {LogType, SourceFile, Record} lines."""
    logtype = zeek_logtype(path)
    if logtype == "conn":
        return None
    return wrap(path, "LogType", logtype, source_rel)


def volatility_plugin(path: str) -> str:
    base = os.path.basename(path)
    for ext in (".jsonl", ".json"):
        if base.lower().endswith(ext):
            base = base[: -len(ext)]
            break
    return base


def volatility_wrap(path: str, source_rel: str) -> list[str]:
    return wrap(path, "Plugin", volatility_plugin(path), source_rel)


def velociraptor_artefact(path: str) -> str:
    return os.path.basename(path)[: -len(".json")] if path.lower().endswith(".json") else os.path.basename(path)


def velociraptor_wrap(path: str, source_rel: str) -> list[str]:
    return wrap(path, "Artefact", velociraptor_artefact(path), source_rel)


# ---- plaso l2t: fan one json_line file out into per-parser tables ----------
def table_name(parser: str) -> str:
    """Top-level parser -> table name: filestat -> L2tFilestat,
    winreg/appcompatcache -> L2tWinreg, firefox_cache -> L2tFirefoxCache."""
    top = re.split(r"/", parser or "unknown")[0] or "unknown"
    parts = [p for p in re.split(r"[^A-Za-z0-9]+", top) if p]
    return "L2t" + "".join(p[:1].upper() + p[1:] for p in parts) if parts else "L2tUnknown"


def split_l2t(path: str, source_rel: str) -> dict[str, list[str]]:
    """Group a Plaso json_line file by top-level parser; return
    {table -> [wrapped JSONL strings]} with {SourceImage, Timestamp, Parser, Record}.
    A zero/absent/out-of-range timestamp is left unset (not 1970)."""
    out: dict[str, list[str]] = {}
    for rec in _records(path):
        parser = str(rec.get("parser") or "unknown")
        table = table_name(parser)
        row = {"SourceImage": source_rel, "Parser": parser, "Record": rec}
        ts = rec.get("timestamp")
        if isinstance(ts, (int, float)) and ts > 0:
            try:
                row["Timestamp"] = datetime.datetime.fromtimestamp(
                    ts / 1_000_000, datetime.timezone.utc
                ).strftime("%Y-%m-%dT%H:%M:%S.%fZ")
            except (OverflowError, OSError, ValueError):
                pass
        out.setdefault(table, []).append(json.dumps(row))
    return out
