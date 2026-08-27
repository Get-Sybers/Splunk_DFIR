#!/bin/bash
# ==============================================================================
# CAR run-through — expected FIELD VALUES at the ADX level, for every lane.
#
# smoke-test.sh proves the host/Sysmon lane end to end. This is the promotion
# gate for EVERYTHING: it asserts that each CAR source function returns the
# EXPECTED VALUES (not just rows / non-null) against a populated emulator, that
# every normalized CAR field is FAITHFUL to its single source record
# (round-trip: CAR field == the native source field in the same row), that
# every CAR row TRACES TO ONE ARTEFACT (a non-empty source identity — never
# data compiled together), and that the roll-up unions FABRICATE nothing
# (union count == sum of the per-source counts). Sources with no live producer
# in this environment (the velociraptor lane: Srum, RECmd) must be EMPTY.
#
# It asserts against an ALREADY-POPULATED emulator — run the pipeline first:
#   dxdfir deploy && dxdfir process <all lanes> && dxdfir ingest
#   tests/car-runthrough.sh                       # asserts :8080 by default
#   CAR_PORT=8095 tests/car-runthrough.sh         # a throwaway emulator
#
# A lane whose raw source table is empty is reported as NOT EXERCISED (informational);
# the gate FAILS on any wrong value, any round-trip mismatch, any fabricated or
# untraceable row, and any row in a no-producer source.
# ==============================================================================
set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT" || exit 1

CAR_PORT="${CAR_PORT:-8080}"
export CAR_PORT
export PYTHONPATH="$REPO_ROOT/python${PYTHONPATH:+:$PYTHONPATH}"

PASS=0; FAIL=0; SKIP=0
pass() { PASS=$((PASS+1)); echo "    ✓ $1"; }
fail() { FAIL=$((FAIL+1)); echo "    ✗ $1"; }
skip() { SKIP=$((SKIP+1)); echo "    ○ $1 (lane not exercised — no rows in the source table)"; }
die()  { echo "❌ $*" >&2; exit 1; }
section() { echo; echo "── $1"; }

# First cell of a query result via the framework's own kusto client.
kusto_scalar() {
    python3 - "$1" "$2" <<'PY'
import json, os, sys
from get_sybers_dfir.ingest.kusto import KustoClient, failed
db, csl = sys.argv[1], sys.argv[2]
client = KustoClient(host="127.0.0.1", port=int(os.environ["CAR_PORT"]))
resp = client.mgmt(db, csl) if csl.lstrip().startswith(".") else client.query(db, csl)
if failed(resp):
    sys.exit(1)
try:
    rows = (json.loads(resp).get("Tables") or [{}])[0].get("Rows") or []
except (json.JSONDecodeError, ValueError):
    sys.exit(1)
if not rows or not rows[0]:
    sys.exit(1)
print(rows[0][0])
PY
}

# assert_ge <db> <csl-number> <min> <desc>
assert_ge() {
    local db="$1" csl="$2" min="$3" desc="$4" got
    got="$(kusto_scalar "$db" "$csl" 2>/dev/null)"
    if [[ "$got" =~ ^-?[0-9]+$ ]] && (( got >= min )); then pass "$desc ($got >= $min)"
    else fail "$desc (got '${got:-<none>}', wanted >= $min)"; fi
}
assert_has() { assert_ge "$1" "$2" 1 "$3"; }
# assert_zero <db> <csl-count> <desc> — count MUST be 0 (round-trip mismatch,
# fabricated/untraceable rows, no-producer sources).
assert_zero() {
    local db="$1" csl="$2" desc="$3" got
    got="$(kusto_scalar "$db" "$csl" 2>/dev/null)"
    if [[ "$got" == "0" ]]; then pass "$desc (0)"
    else fail "$desc (got '${got:-<none>}', wanted 0)"; fi
}
# assert_eq <db> <csl-scalar> <expected> <desc>
assert_eq() {
    local db="$1" csl="$2" want="$3" desc="$4" got
    got="$(kusto_scalar "$db" "$csl" 2>/dev/null)"
    if [[ "$got" == "$want" ]]; then pass "$desc (= $want)"
    else fail "$desc (got '${got:-<none>}', wanted '$want')"; fi
}
# has_rows <db> <csl-count> — true if count >= 1 (to gate data-dependent blocks)
has_rows() { local g; g="$(kusto_scalar "$1" "$2" 2>/dev/null)"; [[ "$g" =~ ^[0-9]+$ ]] && (( g >= 1 )); }

# =============================================================================
section "Preflight"
python3 -m get_sybers_dfir.ingest --ping --host 127.0.0.1 --port "$CAR_PORT" >/dev/null 2>&1 \
    || die "emulator not reachable on :$CAR_PORT — deploy + process + ingest first."
assert_has mitre ".show functions | where Name startswith 'Car' | count" "CAR functions present"
pass "emulator reachable on :$CAR_PORT"

# =============================================================================
# HOST / Sysmon + Security  (host.EvtxEcmdJson)
# =============================================================================
if has_rows host "EvtxEcmdJson | count"; then
  section "HOST — Sysmon (host.EvtxEcmdJson)"
  if has_rows mitre "CarProcess_Sysmon() | count"; then
    assert_has mitre "CarProcess_Sysmon() | where action=='create' and isnotempty(command_line) | count" \
        "CarProcess_Sysmon: command_line populated (EvtxPayload JSON)"
    assert_has mitre "CarDriver_Sysmon() | where image_path has 'VBoxDrv.sys' | count" \
        "CarDriver_Sysmon: known BYOVD driver VBoxDrv.sys present"
    assert_has mitre "CarThread_Sysmon() | where action=='remote_create' and tgt_pid>0 and isnotempty(start_address) | count" \
        "CarThread_Sysmon: tgt_pid + start_address populated"
    assert_has mitre "CarFlow_Sysmon() | where isnotempty(src_ip) and dest_port>0 | count" \
        "CarFlow_Sysmon: src_ip + dest_port populated"
    assert_has mitre "CarRegistry_Sysmon() | where isnotempty(key) | count" \
        "CarRegistry_Sysmon: key populated"
    # round-trip fidelity: the normalized field equals the native payload key
    assert_zero mitre "CarRegistry_Sysmon() | where isnotempty(key) and key != tostring(EvtxPayload(Payload,'TargetObject')) | count" \
        "CarRegistry_Sysmon: key == payload TargetObject (round-trip faithful)"
  else skip "HOST Sysmon (no Provider~sysmon events in evidence)"; fi

  # Windows Security channel (4688/4624/...) — present when a Security.evtx is in
  # the evidence. PIDs here are HEX (unlike Sysmon's decimal) and the SID/logon_id
  # carry Windows-native shapes; assert those expected value shapes.
  if has_rows mitre "CarProcess_Security() | count"; then
    section "HOST — Windows Security channel (host.EvtxEcmdJson)"
    assert_has mitre "CarProcess_Security() | where isnotempty(image_path) and pid > 0 | count" \
        "CarProcess_Security: NewProcessName + hex-decoded pid populated"
    assert_zero mitre "CarProcess_Security() | where isnotempty(sid) and sid !startswith 'S-1-' | count" \
        "CarProcess_Security: sid is a Windows SID (S-1-...)"
    if has_rows mitre "CarUserSession_Security() | count"; then
      assert_has mitre "CarUserSession_Security() | where isnotempty(user) | count" \
          "CarUserSession_Security: logon user populated"
      assert_zero mitre "CarUserSession_Security() | where action !in ('login','logout','rdp','unlock','interactive','remote','reconnect','network','service','batch','') | count" \
          "CarUserSession_Security: action in the logon vocabulary"
    fi
  fi
else skip "HOST (host.EvtxEcmdJson empty)"; fi

# =============================================================================
# NETWORK / Zeek  (network.ZeekConn)
# =============================================================================
if has_rows network "ZeekConn | count"; then
  section "NETWORK — Zeek (network.ZeekConn -> CarFlow_Zeek)"
  assert_has mitre "CarFlow_Zeek() | count" "CarFlow_Zeek returns rows"
  # every flow's normalized 5-tuple is FAITHFUL to the native Zeek columns
  assert_zero mitre "CarFlow_Zeek() | where src_ip != tostring(SrcIp) or dest_ip != tostring(DestIp) or dest_port != DestPort or src_port != SrcPort or protocol != tostring(Proto) | count" \
      "CarFlow_Zeek: normalized 5-tuple == native Zeek columns (round-trip faithful)"
  # value validity: IPv4 shapes, ports in range, conn-state a real Zeek token
  assert_zero mitre "CarFlow_Zeek() | where isnotempty(src_ip) and not(src_ip matches regex @'^[0-9a-fA-F:.]+$') | count" \
      "CarFlow_Zeek: src_ip is a valid IP literal"
  assert_zero mitre "CarFlow_Zeek() | where dest_port < 0 or dest_port > 65535 | count" \
      "CarFlow_Zeek: dest_port within 0..65535"
  assert_zero mitre "CarFlow_Zeek() | where ConnState !in ('S0','S1','SF','REJ','S2','S3','RSTO','RSTR','RSTOS0','RSTRH','SH','SHR','OTH') | count" \
      "CarFlow_Zeek: ConnState is a valid Zeek connection-state token"
  # protocol vocabulary
  # Zeek's own transport vocabulary — 'unknown_transport' is Zeek's label for a
  # flow it cannot classify as tcp/udp/icmp; the round-trip test above already
  # proved protocol == native Proto, so this just pins the known token set.
  assert_zero mitre "CarFlow_Zeek() | where protocol !in ('tcp','udp','icmp','unknown_transport','') | count" \
      "CarFlow_Zeek: protocol is a known Zeek transport token"
else skip "NETWORK (network.ZeekConn empty)"; fi

# =============================================================================
# MEMORY / Volatility  (memory.VolatilityJson)
# =============================================================================
if has_rows memory "VolatilityJson | count"; then
  section "MEMORY — Volatility (memory.VolatilityJson)"

  # CarProcess_Memory: canonical Windows processes must be present with pids
  assert_has mitre "CarProcess_Memory() | where image_path has 'winlogon.exe' | count" \
      "CarProcess_Memory: winlogon.exe present"
  assert_has mitre "CarProcess_Memory() | where image_path has 'services.exe' or image_path has 'svchost.exe' | count" \
      "CarProcess_Memory: service host process present"
  assert_zero mitre "CarProcess_Memory() | where isnotempty(image_path) and pid <= 0 | count" \
      "CarProcess_Memory: every process row has a positive pid"

  # CarDriver_Memory: the kernel image itself must be a loaded module
  assert_has mitre "CarDriver_Memory() | where image_path has 'ntoskrnl.exe' | count" \
      "CarDriver_Memory: kernel image ntoskrnl.exe present"
  assert_has mitre "CarDriver_Memory() | where image_path has 'hal.dll' | count" \
      "CarDriver_Memory: HAL (hal.dll) present"
  assert_zero mitre "CarDriver_Memory() | where isnotempty(module_name) and module_name != tostring(Record.Name) | count" \
      "CarDriver_Memory: module_name == Record.Name (round-trip faithful)"

  # CarModule_Memory
  assert_has mitre "CarModule_Memory() | where isnotempty(module_path) | count" \
      "CarModule_Memory: module_path populated"
  assert_zero mitre "CarModule_Memory() | where isnotempty(module_name) and module_name != tostring(Record.Name) | count" \
      "CarModule_Memory: module_name == Record.Name (round-trip faithful)"

  # CarRegistry_Memory
  assert_has mitre "CarRegistry_Memory() | where isnotempty(key) | count" \
      "CarRegistry_Memory: key populated"
  assert_zero mitre "CarRegistry_Memory() | where isnotempty(key) and key != tostring(Record.Key) | count" \
      "CarRegistry_Memory: key == Record.Key (round-trip faithful)"

  # CarFile_Memory
  assert_has mitre "CarFile_Memory() | where isnotempty(file_path) | count" \
      "CarFile_Memory: file_path populated"
  assert_zero mitre "CarFile_Memory() | where isnotempty(file_path) and file_path != tostring(Record.Name) | count" \
      "CarFile_Memory: file_path == Record.Name (round-trip faithful)"

  # CarService_Memory
  assert_has mitre "CarService_Memory() | where isnotempty(name) | count" \
      "CarService_Memory: service name populated"

  # CarUserSession_Memory: the canonical Windows boot chain, per-artefact
  assert_has mitre "CarUserSession_Memory() | where tostring(Record.Process)=='System' and toint(Record.['Process ID'])==4 | count" \
      "CarUserSession_Memory: System / PID 4 (boot chain) present"
  assert_has mitre "CarUserSession_Memory() | where tostring(Record.Process)=='smss.exe' | count" \
      "CarUserSession_Memory: smss.exe present"

  # CarThread_Memory round-trip
  if has_rows mitre "CarThread_Memory() | count"; then
    assert_zero mitre "CarThread_Memory() | where isnotempty(tostring(tgt_pid)) and tolong(tgt_pid) != tolong(Record.PID) | count" \
        "CarThread_Memory: tgt_pid == Record.PID (round-trip faithful)"
  fi

  # PER-ARTEFACT IDENTITY: every memory CAR row traces to ONE source file —
  # never data compiled together. (SourceFile is the artefact identity.)
  for fn in CarProcess_Memory CarFile_Memory CarModule_Memory CarDriver_Memory CarRegistry_Memory CarService_Memory CarUserSession_Memory; do
    assert_zero mitre "$fn() | where isempty(SourceFile) | count" \
        "$fn: every row traces to one artefact (SourceFile non-empty)"
  done
else skip "MEMORY (memory.VolatilityJson empty)"; fi

# =============================================================================
# TIMELINE / Plaso  (host.L2t*)
# =============================================================================
if has_rows host "union isfuzzy=true database('host').L2tFilestat, database('host').L2tMft, database('host').L2tUsnjrnl | count"; then
  section "TIMELINE — Plaso (host.L2t* -> CarFile_Plaso)"
  assert_has mitre "CarFile_Plaso() | where isnotempty(file_path) | count" \
      "CarFile_Plaso: file_path populated"
  assert_zero mitre "CarFile_Plaso() | where isnotempty(file_path) and isempty(file_name) | count" \
      "CarFile_Plaso: file_name derived wherever file_path is set"
  assert_zero mitre "CarFile_Plaso() | where action !in ('create','modify','read','delete','') | count" \
      "CarFile_Plaso: action in the file-action vocabulary"
else skip "TIMELINE (host.L2t* filesystem tables empty)"; fi

# =============================================================================
# NO LIVE PRODUCER — the velociraptor lane is not run here, so these CAR
# sources MUST be empty. A row here would be a fabricated join.
# =============================================================================
section "NO-PRODUCER sources must be empty (no fabrication without velociraptor)"
assert_zero mitre "CarProcess_Srum() | count"  "CarProcess_Srum empty (no velociraptor/SRUM producer)"
assert_zero mitre "CarFlow_Srum() | count"      "CarFlow_Srum empty (no velociraptor/SRUM producer)"
assert_zero mitre "CarRegistry_Recmd() | count" "CarRegistry_Recmd empty (no velociraptor/RECmd producer)"

# =============================================================================
# ROLL-UP FIDELITY — a union roll-up must equal the SUM of its per-source parts:
# it may not drop, duplicate, or invent rows when data is combined.
# =============================================================================
section "Roll-up unions fabricate nothing (union count == sum of sources)"
check_union() {
    local obj="$1"; shift
    local total=0 part sum=0
    total="$(kusto_scalar mitre "Car${obj}() | count" 2>/dev/null)"
    for src in "$@"; do
        part="$(kusto_scalar mitre "Car${obj}_${src}() | count" 2>/dev/null)"
        [[ "$part" =~ ^[0-9]+$ ]] && sum=$((sum + part))
    done
    if [[ "$total" =~ ^[0-9]+$ ]] && (( total == sum )); then
        pass "Car${obj}() == sum of its sources ($total == $sum)"
    else
        fail "Car${obj}() roll-up ($total) != sum of sources ($sum)"
    fi
}
check_union Process Sysmon Security Memory Plaso Cron Srum
check_union File    Plaso Sysmon Memory
check_union Registry Recmd Sysmon Memory
check_union Module  Sysmon Memory
check_union Driver  Sysmon Memory
check_union Thread  Sysmon Memory
check_union Flow    Zeek Sysmon Memory Srum
check_union UserSession Security Utmp Ssh Memory
check_union Service Evtx Memory

# =============================================================================
echo
echo "═══════════════════════════════════════════"
printf "  passed: %-4d failed: %-4d not-exercised: %d\n" "$PASS" "$FAIL" "$SKIP"
echo "═══════════════════════════════════════════"
if (( FAIL > 0 )); then
    echo "  ❌ CAR run-through FAILED — a CAR field held a wrong/unfaithful/fabricated value."
    exit 1
fi
echo "  ✅ CAR run-through passed — expected field values at ADX, faithful per-artefact, no fabrication."
