"""The DX_DFIR CAR-event store + the JSON output ADX ingests (epic #86).

The same database model proven in PIIAT-Mem's car.db: one SQLite table per CAR
object (all 13), each row a finished CAR event — a common header plus the
object's canonical properties as nullable columns:

    event_id · timestamp · car_action · guid · owning_pid · owning_guid ·
    parent_pid · parent_guid · link_confidence · source_artefact · source_host ·
    native (JSON: kept fields with no CAR home — never faked into CAR columns)

The store is the pipeline artifact (car.db under the processed tree); the
**JSON output** is the ADX contract: `export_jsonl()` writes one
`car_<object>.jsonl` per populated object, each line a flat event object —
ingested as the new `mitre.car_*` tables so nothing already built changes.
"""
from __future__ import annotations

import json
import os
import sqlite3

from . import carmodel

HEADER = ["timestamp", "car_action", "guid", "owning_pid", "owning_guid",
          "parent_pid", "parent_guid", "link_confidence",
          "source_artefact", "source_host", "native"]


def _q(name: str) -> str:
    return '"' + name.replace('"', '""') + '"'


class CarStore:
    """Create/open a car.db and read/write finished CAR events."""

    def __init__(self, path: str):
        self.path = path
        self.model = carmodel.load()
        self.conn = sqlite3.connect(path)
        self.conn.row_factory = sqlite3.Row
        self._create()

    def _cols(self, obj: str) -> list[str]:
        return HEADER + [f for f in self.model[obj]["fields"] if f not in HEADER]

    def _create(self):
        cur = self.conn.cursor()
        for obj in self.model:
            cols = ", ".join(_q(c) for c in self._cols(obj))
            cur.execute(f"CREATE TABLE IF NOT EXISTS {_q(obj)} "
                        f"(event_id INTEGER PRIMARY KEY, {cols})")
            cur.execute(f"CREATE INDEX IF NOT EXISTS {_q('ix_' + obj + '_guid')} "
                        f"ON {_q(obj)} (guid)")
            cur.execute(f"CREATE INDEX IF NOT EXISTS {_q('ix_' + obj + '_ts')} "
                        f"ON {_q(obj)} (timestamp)")
        self.conn.commit()

    def insert_events(self, events: list[dict]) -> int:
        n = 0
        cur = self.conn.cursor()
        for ev in events:
            obj = ev["car_object"]
            cols = self._cols(obj)
            row = []
            for c in cols:
                if c == "native":
                    row.append(json.dumps(ev.get("_native") or {}, default=str))
                else:
                    v = ev.get(c)
                    row.append(json.dumps(v, default=str) if isinstance(v, (list, dict)) else v)
            cur.execute(f"INSERT INTO {_q(obj)} "
                        f"({', '.join(_q(c) for c in cols)}) "
                        f"VALUES ({', '.join('?' for _ in cols)})", row)
            n += 1
        self.conn.commit()
        return n

    def iter_object(self, obj: str):
        for row in self.conn.execute(f"SELECT * FROM {_q(obj)} ORDER BY event_id"):
            d = dict(row)
            d["car_object"] = obj
            try:
                d["native"] = json.loads(d.get("native") or "{}")
            except (TypeError, ValueError):
                pass
            yield d

    def counts(self) -> dict[str, int]:
        out = {}
        for obj in self.model:
            (n,) = self.conn.execute(f"SELECT COUNT(*) FROM {_q(obj)}").fetchone()
            if n:
                out[obj] = n
        return out

    # -- the ADX contract -----------------------------------------------------

    def export_jsonl(self, out_dir: str) -> dict[str, int]:
        """One `car_<object>.jsonl` per populated object — the JSON ADX ingests
        as the new `mitre.car_*` tables. Each line: the event header + the
        object's canonical properties (null or not) + `native` as a JSON object
        (lands in a dynamic column)."""
        os.makedirs(out_dir, exist_ok=True)
        written = {}
        for obj, count in self.counts().items():
            path = os.path.join(out_dir, f"car_{obj}.jsonl")
            with open(path, "w", encoding="utf-8") as fh:
                for ev in self.iter_object(obj):
                    ev.pop("event_id", None)
                    fh.write(json.dumps(ev, sort_keys=False, default=str))
                    fh.write("\n")
            written[obj] = count
        return written

    def close(self):
        self.conn.close()
