"""CAR run-through — expected FIELD VALUES at the ADX level, for every lane.

The promotion gate for CAR correctness. Where smoke covers the host/Sysmon lane
end to end, this asserts that each CAR source function returns the EXPECTED
VALUES (not just rows) against a populated emulator, that every normalized CAR
field is FAITHFUL to its single source record (round-trip: CAR field == the
native source field in the same row), that every CAR row TRACES TO ONE ARTEFACT
(a non-empty source identity — never data compiled together), that the roll-up
unions FABRICATE nothing (union count == sum of the per-source counts), and that
sources with no live producer here (the velociraptor lane: Srum, RECmd) stay
EMPTY.

Asserts against an ALREADY-POPULATED emulator — run the pipeline first
(dxdfir deploy && dxdfir process <lanes> && dxdfir ingest). A lane whose raw
source table is empty is reported NOT EXERCISED; the gate fails on any wrong
value, round-trip mismatch, fabricated/untraceable row, or row in a no-producer
source.

Runnable as `dxdfir verify-car` or `python -m get_sybers_dfir.carcheck`.
"""
from __future__ import annotations

import json
import sys

from .ingest.kusto import KustoClient, failed


class _Checker:
    """Runs KQL assertions against one emulator and tallies pass/fail/skip."""

    def __init__(self, host: str = "127.0.0.1", port: int = 8080):
        self.client = KustoClient(host=host, port=port)
        self.passed = 0
        self.failed = 0
        self.skipped = 0
        self.lines: list[str] = []

    # -- primitive: first cell of a query result, or None on error/empty -------
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

    # -- outcomes --------------------------------------------------------------
    def _pass(self, desc): self.passed += 1; self.lines.append(f"    ✓ {desc}")
    def _fail(self, desc): self.failed += 1; self.lines.append(f"    ✗ {desc}")

    def skip(self, desc):
        self.skipped += 1
        self.lines.append(f"    ○ {desc} (lane not exercised)")

    def section(self, title): self.lines.append(f"\n── {title}")

    # -- assertions ------------------------------------------------------------
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

    def union_equals_sum(self, obj, sources):
        total = self._int("mitre", f"Car{obj}() | count")
        s = 0
        for src in sources:
            part = self._int("mitre", f"Car{obj}_{src}() | count")
            if part is not None:
                s += part
        if total is not None and total == s:
            self._pass(f"Car{obj}() == sum of its sources ({total} == {s})")
        else:
            self._fail(f"Car{obj}() roll-up ({total}) != sum of sources ({s})")


# regex fragments reused across assertions
_IP = r"^[0-9a-fA-F:.]+$"
_CONN_STATES = ("S0", "S1", "SF", "REJ", "S2", "S3", "RSTO", "RSTR",
                "RSTOS0", "RSTRH", "SH", "SHR", "OTH")
_MEM_OBJECTS = ("CarProcess_Memory", "CarFile_Memory", "CarModule_Memory",
                "CarDriver_Memory", "CarRegistry_Memory", "CarService_Memory",
                "CarUserSession_Memory")


def run(host: str = "127.0.0.1", port: int = 8080) -> _Checker:
    """Run the whole CAR run-through against the emulator. Returns the checker
    with .passed/.failed/.skipped and .lines populated."""
    c = _Checker(host, port)

    # -- preflight ------------------------------------------------------------
    c.section("Preflight")
    c.has("mitre", ".show functions | where Name startswith 'Car' | count",
          "CAR functions present")

    # -- HOST / Sysmon --------------------------------------------------------
    if c.has_rows("host", "EvtxEcmdJson | count"):
        if c.has_rows("mitre", "CarProcess_Sysmon() | count"):
            c.section("HOST — Sysmon (host.EvtxEcmdJson)")
            c.has("mitre", "CarProcess_Sysmon() | where action=='create' and isnotempty(command_line) | count",
                  "CarProcess_Sysmon: command_line populated (EvtxPayload JSON)")
            c.has("mitre", "CarDriver_Sysmon() | where image_path has 'VBoxDrv.sys' | count",
                  "CarDriver_Sysmon: known BYOVD driver VBoxDrv.sys present")
            c.has("mitre", "CarThread_Sysmon() | where action=='remote_create' and tgt_pid>0 and isnotempty(start_address) | count",
                  "CarThread_Sysmon: tgt_pid + start_address populated")
            c.has("mitre", "CarFlow_Sysmon() | where isnotempty(src_ip) and dest_port>0 | count",
                  "CarFlow_Sysmon: src_ip + dest_port populated")
            c.has("mitre", "CarRegistry_Sysmon() | where isnotempty(key) | count",
                  "CarRegistry_Sysmon: key populated")
            c.zero("mitre", "CarRegistry_Sysmon() | where isnotempty(key) and key != tostring(EvtxPayload(Payload,'TargetObject')) | count",
                   "CarRegistry_Sysmon: key == payload TargetObject (round-trip faithful)")
        # Windows Security channel (hex PIDs, SIDs, logon vocabulary)
        if c.has_rows("mitre", "CarProcess_Security() | count"):
            c.section("HOST — Windows Security channel (host.EvtxEcmdJson)")
            c.has("mitre", "CarProcess_Security() | where isnotempty(image_path) and pid > 0 | count",
                  "CarProcess_Security: NewProcessName + hex-decoded pid populated")
            c.zero("mitre", "CarProcess_Security() | where isnotempty(sid) and sid !startswith 'S-1-' | count",
                   "CarProcess_Security: sid is a Windows SID (S-1-...)")
            if c.has_rows("mitre", "CarUserSession_Security() | count"):
                c.has("mitre", "CarUserSession_Security() | where isnotempty(user) | count",
                      "CarUserSession_Security: logon user populated")
                c.zero("mitre", "CarUserSession_Security() | where action !in ('login','logout','rdp','unlock','interactive','remote','reconnect','network','service','batch','') | count",
                       "CarUserSession_Security: action in the logon vocabulary")
    else:
        c.skip("HOST (host.EvtxEcmdJson empty)")

    # -- NETWORK / Zeek -------------------------------------------------------
    if c.has_rows("network", "ZeekConn | count"):
        c.section("NETWORK — Zeek (network.ZeekConn -> CarFlow_Zeek)")
        c.has("mitre", "CarFlow_Zeek() | count", "CarFlow_Zeek returns rows")
        c.zero("mitre", "CarFlow_Zeek() | where src_ip != tostring(SrcIp) or dest_ip != tostring(DestIp) or dest_port != DestPort or src_port != SrcPort or protocol != tostring(Proto) | count",
               "CarFlow_Zeek: normalized 5-tuple == native Zeek columns (round-trip faithful)")
        c.zero("mitre", f"CarFlow_Zeek() | where isnotempty(src_ip) and not(src_ip matches regex @'{_IP}') | count",
               "CarFlow_Zeek: src_ip is a valid IP literal")
        c.zero("mitre", "CarFlow_Zeek() | where dest_port < 0 or dest_port > 65535 | count",
               "CarFlow_Zeek: dest_port within 0..65535")
        states = ",".join(f"'{s}'" for s in _CONN_STATES)
        c.zero("mitre", f"CarFlow_Zeek() | where ConnState !in ({states}) | count",
               "CarFlow_Zeek: ConnState is a valid Zeek connection-state token")
        c.zero("mitre", "CarFlow_Zeek() | where protocol !in ('tcp','udp','icmp','unknown_transport','') | count",
               "CarFlow_Zeek: protocol is a known Zeek transport token")
    else:
        c.skip("NETWORK (network.ZeekConn empty)")

    # -- MEMORY / Volatility --------------------------------------------------
    if c.has_rows("memory", "VolatilityJson | count"):
        c.section("MEMORY — Volatility (memory.VolatilityJson)")
        c.has("mitre", "CarProcess_Memory() | where image_path has 'winlogon.exe' | count",
              "CarProcess_Memory: winlogon.exe present")
        c.has("mitre", "CarProcess_Memory() | where image_path has 'services.exe' or image_path has 'svchost.exe' | count",
              "CarProcess_Memory: service host process present")
        c.zero("mitre", "CarProcess_Memory() | where isnotempty(image_path) and pid <= 0 | count",
               "CarProcess_Memory: every process row has a positive pid")
        c.has("mitre", "CarDriver_Memory() | where image_path has 'ntoskrnl.exe' | count",
              "CarDriver_Memory: kernel image ntoskrnl.exe present")
        c.has("mitre", "CarDriver_Memory() | where image_path has 'hal.dll' | count",
              "CarDriver_Memory: HAL (hal.dll) present")
        c.zero("mitre", "CarDriver_Memory() | where isnotempty(module_name) and module_name != tostring(Record.Name) | count",
               "CarDriver_Memory: module_name == Record.Name (round-trip faithful)")
        c.has("mitre", "CarModule_Memory() | where isnotempty(module_path) | count",
              "CarModule_Memory: module_path populated")
        c.zero("mitre", "CarModule_Memory() | where isnotempty(module_name) and module_name != tostring(Record.Name) | count",
               "CarModule_Memory: module_name == Record.Name (round-trip faithful)")
        c.has("mitre", "CarRegistry_Memory() | where isnotempty(key) | count",
              "CarRegistry_Memory: key populated")
        c.zero("mitre", "CarRegistry_Memory() | where isnotempty(key) and key != tostring(Record.Key) | count",
               "CarRegistry_Memory: key == Record.Key (round-trip faithful)")
        c.has("mitre", "CarFile_Memory() | where isnotempty(file_path) | count",
              "CarFile_Memory: file_path populated")
        c.zero("mitre", "CarFile_Memory() | where isnotempty(file_path) and file_path != tostring(Record.Name) | count",
               "CarFile_Memory: file_path == Record.Name (round-trip faithful)")
        c.has("mitre", "CarService_Memory() | where isnotempty(name) | count",
              "CarService_Memory: service name populated")
        c.has("mitre", "CarUserSession_Memory() | where tostring(Record.Process)=='System' and toint(Record.['Process ID'])==4 | count",
              "CarUserSession_Memory: System / PID 4 (boot chain) present")
        c.has("mitre", "CarUserSession_Memory() | where tostring(Record.Process)=='smss.exe' | count",
              "CarUserSession_Memory: smss.exe present")
        if c.has_rows("mitre", "CarThread_Memory() | count"):
            c.zero("mitre", "CarThread_Memory() | where isnotempty(tostring(tgt_pid)) and tolong(tgt_pid) != tolong(Record.PID) | count",
                   "CarThread_Memory: tgt_pid == Record.PID (round-trip faithful)")
        # per-artefact identity: every memory CAR row traces to one source file
        for fn in _MEM_OBJECTS:
            c.zero("mitre", f"{fn}() | where isempty(SourceFile) | count",
                   f"{fn}: every row traces to one artefact (SourceFile non-empty)")
    else:
        c.skip("MEMORY (memory.VolatilityJson empty)")

    # -- TIMELINE / Plaso -----------------------------------------------------
    if c.has_rows("host", "union isfuzzy=true database('host').L2tFilestat, database('host').L2tMft, database('host').L2tUsnjrnl | count"):
        c.section("TIMELINE — Plaso (host.L2t* -> CarFile_Plaso)")
        c.has("mitre", "CarFile_Plaso() | where isnotempty(file_path) | count",
              "CarFile_Plaso: file_path populated")
        # A filesystem ROOT (path "\\" or "/") legitimately has no basename, so
        # exempt it — every non-root file_path must still yield a file_name.
        c.zero("mitre", "CarFile_Plaso() | where isnotempty(file_path) and file_path !in ('\\\\','/') and isempty(file_name) | count",
               "CarFile_Plaso: file_name derived for every non-root file_path")
        c.zero("mitre", "CarFile_Plaso() | where action !in ('create','modify','read','delete','') | count",
               "CarFile_Plaso: action in the file-action vocabulary")
        # H3 guard — an MFT entry names the file it DESCRIBES, never the parsed
        # $MFT itself (the bug labelled every row \$MFT). Only the genuine $MFT
        # metadata records may keep that path, so the vast majority resolve to a
        # real file.
        if c.has_rows("host", "database('host').L2tMft | count"):
            c.ge("mitre", "CarFile_Plaso() | where tostring(Parser)=='mft' | summarize toint(100.0*countif(file_path !in ('\\\\','/',@'\\$MFT'))/count())",
                 90, "CarFile_Plaso[mft]: >=90% resolve to a real file, not \\$MFT (H3)")
        # M3 guard — UsnJrnl carries deletes/creates, not only 'modify'.
        if c.has_rows("host", "database('host').L2tUsnjrnl | count"):
            c.has("mitre", "CarFile_Plaso() | where tostring(Parser)=='usnjrnl' and action=='delete' | count",
                  "CarFile_Plaso[usnjrnl]: file deletes surfaced as delete (M3)")
        # H1/H2 guard — Plaso execution artefacts name the executed PROGRAM,
        # never the parsed artefact file (a .pf, a registry hive, $MFT).
        if c.has_rows("mitre", "CarProcess_Plaso() | count"):
            c.has("mitre", "CarProcess_Plaso() | where isnotempty(exe) | count",
                  "CarProcess_Plaso: exe populated")
            c.zero("mitre", "CarProcess_Plaso() | where exe has '.pf' or exe has 'NTUSER' or exe has @'\\$MFT' or exe endswith '.hve' | count",
                   "CarProcess_Plaso: exe is a program, never the parsed .pf/hive/$MFT (H1/H2)")
    else:
        c.skip("TIMELINE (host.L2t* filesystem tables empty)")

    # -- NO-PRODUCER sources must be empty ------------------------------------
    c.section("NO-PRODUCER sources must be empty (no fabrication without velociraptor)")
    c.zero("mitre", "CarProcess_Srum() | count", "CarProcess_Srum empty (no velociraptor/SRUM producer)")
    c.zero("mitre", "CarFlow_Srum() | count", "CarFlow_Srum empty (no velociraptor/SRUM producer)")
    c.zero("mitre", "CarRegistry_Recmd() | count", "CarRegistry_Recmd empty (no velociraptor/RECmd producer)")

    # -- ROLL-UP fidelity: union == sum of sources ----------------------------
    c.section("Roll-up unions fabricate nothing (union count == sum of sources)")
    c.union_equals_sum("Process", ("Sysmon", "Security", "Memory", "Plaso", "Cron", "Srum"))
    c.union_equals_sum("File", ("Plaso", "Sysmon", "Memory"))
    c.union_equals_sum("Registry", ("Recmd", "Sysmon", "Memory"))
    c.union_equals_sum("Module", ("Sysmon", "Memory"))
    c.union_equals_sum("Driver", ("Sysmon", "Memory"))
    c.union_equals_sum("Thread", ("Sysmon", "Memory"))
    c.union_equals_sum("Flow", ("Zeek", "Sysmon", "Memory", "Srum"))
    c.union_equals_sum("UserSession", ("Security", "Utmp", "Ssh", "Memory"))
    c.union_equals_sum("Service", ("Evtx", "Memory"))

    return c


def main(argv: list[str] | None = None) -> int:
    import argparse
    ap = argparse.ArgumentParser(
        prog="get_sybers_dfir.carcheck",
        description="CAR run-through: expected field values at the ADX level for every lane.")
    ap.add_argument("--host", default="127.0.0.1")
    ap.add_argument("--port", type=int, default=8080)
    args = ap.parse_args(argv)

    # Reachability first — a clear message beats a wall of failed assertions.
    probe = _Checker(args.host, args.port)
    if probe.scalar("mitre", "print 1") is None:
        sys.stderr.write(
            f"emulator not reachable on {args.host}:{args.port} — "
            "deploy + process + ingest first.\n")
        return 2

    c = run(args.host, args.port)
    print("\n".join(c.lines))
    print("\n" + "=" * 43)
    print(f"  passed: {c.passed:<4} failed: {c.failed:<4} not-exercised: {c.skipped}")
    print("=" * 43)
    if c.failed:
        print("  ❌ CAR run-through FAILED — a CAR field held a wrong/unfaithful/fabricated value.")
        return 1
    print("  ✅ CAR run-through passed — expected field values at ADX, faithful per-artefact, no fabrication.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
