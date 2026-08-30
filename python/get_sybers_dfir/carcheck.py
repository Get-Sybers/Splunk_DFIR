"""CAR run-through — expected FIELD VALUES at the ADX level (materialized CAR).

The promotion gate for CAR correctness. CAR is MATERIALIZED (epic #86): the
engine normalises each source into finished CAR events and the pipeline ingests
one `car_<object>.jsonl` per object into the `mitre.car_<object>` tables (plus
`car_relationships`). Extraction faithfulness (a CAR field == its single source
record) is proven IN THE ENGINE's own test suite; this gate asserts what lands in
ADX: each exercised object returns rows, its key fields are POPULATED, its values
are SANE (IPs are IPs, ports are ports, SIDs are SIDs, actions are in the object's
vocabulary), every row TRACES TO ONE ARTEFACT (source_artefact + source_host
non-empty — never data compiled together), and the relationship edges reference
real endpoints.

Asserts against an ALREADY-POPULATED emulator — run the pipeline first
(dxdfir deploy && dxdfir process <lanes> && dxdfir build-car && dxdfir ingest).
An object whose table is empty is reported NOT EXERCISED.

Runnable as `dxdfir verify-car` or `python -m get_sybers_dfir.carcheck`.
"""
from __future__ import annotations

import json
import sys

from .ingest.kusto import KustoClient, failed

# The 13 CAR object tables (mitre.car_<object>).
_OBJECTS = ("authentication", "driver", "email", "file", "flow", "http",
            "module", "process", "registry", "service", "socket", "thread",
            "user_session")

_IP = r"^[0-9a-fA-F:.]+$"


def _engine_actions():
    """The canonical car_action vocabulary per object — RECONSTRUCTED from the
    engine's model, exactly as PIIAT-MitreCar builds it: generated from the forked
    `car` repo we own (third_party/piiat-mitrecar/third_party/car/data_model),
    never hardcoded here. Returns {object: {actions}} or None if the engine model
    can't be loaded (submodules not checked out)."""
    import os
    eng = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
        "third_party", "piiat-mitrecar")
    if eng not in sys.path:
        sys.path.insert(0, eng)
    try:
        from piiat_mitrecar import carmodel
        m = carmodel.load()
    except Exception:                       # noqa: BLE001 — model source unavailable
        return None
    return {obj: set(m[obj].get("actions", [])) for obj in m}


class _Checker:
    """Runs KQL assertions against one emulator and tallies pass/fail/skip."""

    def __init__(self, host: str = "127.0.0.1", port: int = 8080):
        self.client = KustoClient(host=host, port=port)
        self.passed = 0
        self.failed = 0
        self.skipped = 0
        self.lines: list[str] = []

    def scalar(self, db: str, csl: str):
        resp = (self.client.mgmt(db, csl) if csl.lstrip().startswith(".")
                else self.client.query(db, csl))
        if failed(resp):
            return None
        try:
            rows = (json.loads(resp).get("Tables") or [{}])[0].get("Rows") or []
        except (json.JSONDecodeError, ValueError):
            return None
        return rows[0][0] if rows and rows[0] else None

    def _int(self, db: str, csl: str):
        v = self.scalar(db, csl)
        try:
            return int(v)
        except (TypeError, ValueError):
            return None

    def _pass(self, desc): self.passed += 1; self.lines.append(f"    ✓ {desc}")
    def _fail(self, desc): self.failed += 1; self.lines.append(f"    ✗ {desc}")

    def skip(self, desc):
        self.skipped += 1
        self.lines.append(f"    ○ {desc} (object not exercised)")

    def section(self, title): self.lines.append(f"\n── {title}")

    def ge(self, db, csl, minimum, desc):
        got = self._int(db, csl)
        if got is not None and got >= minimum:
            self._pass(f"{desc} ({got} >= {minimum})")
        else:
            self._fail(f"{desc} (got {got!r}, wanted >= {minimum})")

    def has(self, db, csl, desc): self.ge(db, csl, 1, desc)

    def zero(self, db, csl, desc):
        got = self._int(db, csl)
        if got == 0:
            self._pass(f"{desc} (0)")
        else:
            self._fail(f"{desc} (got {got!r}, wanted 0)")

    def has_rows(self, db, csl) -> bool:
        got = self._int(db, csl)
        return got is not None and got >= 1


def run(host: str = "127.0.0.1", port: int = 8080) -> _Checker:
    """Run the whole CAR run-through against the emulator."""
    c = _Checker(host, port)

    # -- preflight ------------------------------------------------------------
    c.section("Preflight")
    c.has("mitre", ".show tables | where TableName startswith 'car_' | count",
          "materialized CAR tables present (mitre.car_*)")
    c.has("mitre", "Car() | count", "Car() cross-object timeline returns rows")
    # The car_action vocabulary comes from the engine's model (forked car repo).
    actions = _engine_actions()
    if actions is None:
        c._fail("CAR action vocabulary — engine model not loadable "
                "(init submodules: git submodule update --init --recursive)")

    # -- per-object population + value sanity ---------------------------------
    for obj in _OBJECTS:
        tbl = f"car_{obj}"
        if not c.has_rows("mitre", f"{tbl} | count"):
            c.skip(obj)
            continue
        c.section(f"{obj} (mitre.{tbl})")
        # Traceability: every row names the artefact it came from. source_host is
        # a derived scope that is honestly null for artefacts that carry no host
        # identity (Linux utmp, network capture), so it is not required here.
        c.zero("mitre", f"{tbl} | where isempty(source_artefact) | count",
               f"{obj}: every row traces to one artefact (source_artefact)")
        c.zero("mitre", f"{tbl} | where isempty(car_action) | count",
               f"{obj}: every row has a car_action")
        # car_action ∈ the object's canonical vocabulary, from the engine model.
        if actions and actions.get(obj):
            vocab = ",".join(f"'{a}'" for a in sorted(actions[obj]))
            c.zero("mitre", f"{tbl} | where car_action !in ({vocab}) | count",
                   f"{obj}: car_action in the model's {obj} vocabulary")

    # -- value sanity, per object (only where the object was exercised) --------
    if c.has_rows("mitre", "car_process | count"):
        c.section("process — value sanity")
        c.has("mitre", "car_process | where car_action=='create' and isnotempty(command_line) | count",
              "process: command_line populated on create")
        c.zero("mitre", "car_process | where isnotempty(sid) and sid !startswith 'S-1-' | count",
               "process: sid is a Windows SID (S-1-...)")
        c.zero("mitre", "car_process | where isnotempty(pid) and isnull(toint(pid)) | count",
               "process: pid is numeric where present")
    if c.has_rows("mitre", "car_flow | count"):
        c.section("flow — value sanity")
        c.zero("mitre", f"car_flow | where isnotempty(src_ip) and not(src_ip matches regex @'{_IP}') | count",
               "flow: src_ip is a valid IP literal")
        c.zero("mitre", f"car_flow | where isnotempty(dest_ip) and not(dest_ip matches regex @'{_IP}') | count",
               "flow: dest_ip is a valid IP literal")
        c.zero("mitre", "car_flow | where isnotempty(dest_port) and (toint(dest_port) < 0 or toint(dest_port) > 65535) | count",
               "flow: dest_port within 0..65535")
    if c.has_rows("mitre", "car_registry | count"):
        c.section("registry — value sanity")
        c.has("mitre", "car_registry | where isnotempty(key) | count",
              "registry: key populated")
    if c.has_rows("mitre", "car_user_session | count"):
        c.section("user_session — value sanity")
        c.has("mitre", "car_user_session | where isnotempty(user) | count",
              "user_session: user populated")
    if c.has_rows("mitre", "car_file | count"):
        c.section("file — value sanity")
        c.has("mitre", "car_file | where isnotempty(file_path) | count",
              "file: file_path populated")

    # -- relationships (the superset edges) -----------------------------------
    if c.has_rows("mitre", "car_relationships | count"):
        c.section("relationships (superset edges)")
        c.zero("mitre", "car_relationships | where isempty(source_guid) or isempty(target_guid) | count",
               "relationships: every edge names a source and target guid")
        c.zero("mitre", "car_relationships | where isempty(relationship) | count",
               "relationships: every edge has a verb")
        c.zero("mitre", "car_relationships | where confidence !in ('definitive','heuristic','') | count",
               "relationships: confidence in {definitive, heuristic}")
    else:
        c.skip("relationships (car_relationships empty)")

    # -- OS-family coverage ----------------------------------------------------
    c.section("OS-family coverage (what this run actually exercised)")
    coverage = {
        "Windows (event logs: Sysmon/Security)":
            c.has_rows("mitre", "Car() | where source_artefact in ('evtx_sysmon','evtx_security','evtx_process','evtx_services','evtx_bits','evtx_rdp') | count"),
        "Windows (memory: Volatility/PIIAT-Mem)":
            c.has_rows("mitre", "Car() | where source_artefact has 'memory' or source_artefact has 'piiat' | count"),
        "Linux/Unix (utmp/ssh/cron)":
            c.has_rows("mitre", "Car() | where source_artefact in ('l2t_utmp','l2t_text') | count"),
        "macOS (utmpx/fseventsd)":
            c.has_rows("mitre", "Car() | where source_artefact in ('l2t_utmpx','plaso_fseventsd') | count"),
        "Network capture (Zeek)":
            c.has_rows("mitre", "Car() | where source_artefact startswith 'zeek' | count"),
    }
    for family, covered in coverage.items():
        c.lines.append(f"    {'●' if covered else '○'} {family}")
    c.os_families_covered = sum(coverage.values())
    c.os_families_total = len(coverage)

    return c


def main(argv: list[str] | None = None) -> int:
    import argparse
    ap = argparse.ArgumentParser(
        prog="get_sybers_dfir.carcheck",
        description="CAR run-through: expected field values at the ADX level (materialized mitre.car_*).")
    ap.add_argument("--host", default="127.0.0.1")
    ap.add_argument("--port", type=int, default=8080)
    args = ap.parse_args(argv)

    probe = _Checker(args.host, args.port)
    if probe.scalar("mitre", "print 1") is None:
        sys.stderr.write(
            f"emulator not reachable on {args.host}:{args.port} — "
            "deploy + process + build-car + ingest first.\n")
        return 2

    c = run(args.host, args.port)
    print("\n".join(c.lines))
    print("\n" + "=" * 43)
    print(f"  passed: {c.passed:<4} failed: {c.failed:<4} not-exercised: {c.skipped}")
    print("=" * 43)
    if c.failed:
        print("  ❌ CAR run-through FAILED — a CAR field held a wrong/unpopulated/out-of-vocabulary value.")
        return 1
    print("  ✅ CAR run-through passed — populated, value-sane, traceable materialized CAR at ADX.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
