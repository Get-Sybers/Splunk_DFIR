#!/bin/bash
# ==============================================================================
# Pipeline smoke test — does the pipeline actually WORK, end to end? (issue #10)
#
# run-checks.sh proves the repo is internally consistent; it never runs the
# pipeline, so a green tick there says nothing about correctness. The bug that
# motivated this — EvtxPayload parsing XML while EvtxECmd emits JSON, silently
# zeroing every Sysmon/Security-derived CAR field — passes every static check.
# Only running real evidence through and reading the CAR objects catches it.
#
# What it does, against a THROWAWAY emulator (its own container + port, torn down
# on exit — never touches a dev emulator on 8080):
#
#   deploy kustainer + schema via the FRAMEWORK (`dxdfir deploy` -> the
#   dfir_deploy_adx role) -> process pinned Sysmon .evtx through the real evtx
#   lane (EvtxECmd) -> ingest -> assert each Sysmon-sourced CAR object returns
#   rows AND its EvtxPayload-derived fields are populated with the expected
#   values.
#
# Fixtures: the `sysmon-attack-samples` group in dev-scripts/samples-manifest.tsv
# (real Sysmon telemetry from sbousseaden/EVTX-ATTACK-SAMPLES, sha256-pinned, a
# few tens of KB each). Fetched on demand if absent. Public research data, never
# real evidence.
#
# FAILS LOUDLY, never skips: a smoke test that no-ops when Docker is missing
# would recreate exactly the "green tick that tested nothing" problem (#10). If a
# prerequisite is missing it exits non-zero and says why.
#
#   ./tests/smoke-test.sh            # deploy throwaway emulator, run, tear down
#   KEEP=1 ./tests/smoke-test.sh     # leave the emulator up for inspection
#   SMOKE_PORT=8091 ./tests/smoke-test.sh
# ==============================================================================
set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT" || exit 1

# Throwaway emulator identity — deliberately NOT the defaults (kusto-emulator:8080)
# so this never collides with or pollutes a running dev instance.
SMOKE_CONTAINER="${SMOKE_CONTAINER:-kusto-smoke}"
SMOKE_PORT="${SMOKE_PORT:-8090}"
KEEP="${KEEP:-0}"
FIXTURE_DIR="data_store/raw/logs/winevt/sysmon-attack-samples"
OUT_DIR="$(mktemp -d)"
PROC_DIR="$(mktemp -d)"

PASS=0; FAIL=0
pass() { PASS=$((PASS+1)); echo "    ✓ $1"; }
fail() { FAIL=$((FAIL+1)); echo "    ✗ $1"; }
die()  { echo "❌ $*" >&2; exit 1; }
section() { echo; echo "── $1"; }

# In-repo run: the get_sybers_dfir package is under python/ (a deployed install
# would already be importable). Mirrors dfir_evtx_python_path in the role.
export PYTHONPATH="$REPO_ROOT/python${PYTHONPATH:+:$PYTHONPATH}"
# The query helper reads this — every assertion targets the throwaway emulator
# on :$SMOKE_PORT, never the default :8080 (a running dev emulator). Its shell
# predecessor got exactly that wrong once and passed by luck.
export SMOKE_PORT

# The framework front-end: the installed `dxdfir` if present, else the in-repo
# module (PYTHONPATH is already set; typer + ansible-playbook must exist either way).
if command -v dxdfir >/dev/null 2>&1; then
    DXDFIR=(dxdfir)
else
    DXDFIR=(python3 -m get_sybers_dfir.cli)
fi

cleanup() {
    rm -rf "$OUT_DIR" "$PROC_DIR"
    if [[ "$KEEP" == "1" ]]; then
        echo "   (KEEP=1: leaving $SMOKE_CONTAINER up on :$SMOKE_PORT)"
        return
    fi
    docker rm -f "$SMOKE_CONTAINER" >/dev/null 2>&1 || true
}
trap cleanup EXIT

# --- scalar assertion helper -------------------------------------------------
# kusto_scalar <db> <csl> — first cell of the primary result, via the framework's
# own client (get_sybers_dfir.ingest.kusto). Control commands (leading '.') go to
# /v1/rest/mgmt, KQL to /v1/rest/query — Kusto rejects a '.' command on the query
# endpoint, so the routing lives here, not in each call site.
kusto_scalar() {
    python3 - "$1" "$2" <<'PY'
import json, os, sys
from get_sybers_dfir.ingest.kusto import KustoClient, failed
db, csl = sys.argv[1], sys.argv[2]
client = KustoClient(host="127.0.0.1", port=int(os.environ["SMOKE_PORT"]))
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

# assert_ge <db> <csl-returning-a-number> <min> <description>
assert_ge() {
    local db="$1" csl="$2" min="$3" desc="$4" got
    got="$(kusto_scalar "$db" "$csl" 2>/dev/null)"
    if [[ "$got" =~ ^-?[0-9]+$ ]] && (( got >= min )); then
        pass "$desc ($got >= $min)"
    else
        fail "$desc (got '${got:-<none>}', wanted >= $min)"
    fi
}
# assert_has <db> <csl-returning-a-count> <description>  (count must be >= 1)
assert_has() { assert_ge "$1" "$2" 1 "$3"; }

# =============================================================================
section "Preflight (fail loudly — never skip)"
command -v docker >/dev/null 2>&1 || die "docker not found. This test RUNS the pipeline; it cannot be skipped."
docker info >/dev/null 2>&1 || die "docker daemon not reachable."
command -v python3 >/dev/null 2>&1 || die "python3 not found."
"${DXDFIR[@]}" --version >/dev/null 2>&1 \
    || die "the dxdfir CLI does not run — install it (pip install ./python; it brings typer + ansible-core)."
docker image inspect dfir/evtxecmd:latest >/dev/null 2>&1 \
    || die "image dfir/evtxecmd:latest missing — build it: docker build -t dfir/evtxecmd:latest -f docker/evtxecmd/Dockerfile docker"
pass "docker, python3, the dxdfir CLI, and dfir/evtxecmd:latest present"

# =============================================================================
section "Fixtures (sha256-pinned Sysmon .evtx)"
# --fetch is idempotent: it sha256-verifies files already on disk and downloads
# only what is missing. (Don't gate on --verify — it reports missing files as
# "not fetched", not a failure, so it exits 0 on an empty checkout and would skip
# the fetch entirely — exactly what happened on the first CI run.)
echo "   fetching sysmon-attack-samples (checksum-verified, idempotent)…"
./dev-scripts/fetch-samples.sh --fetch sysmon-attack-samples >/dev/null 2>&1 \
    || die "could not fetch the Sysmon fixtures (network? manifest?)."
n_fix=$(find "$FIXTURE_DIR" -iname '*.evtx' 2>/dev/null | wc -l)
(( n_fix > 0 )) || die "no fixtures on disk under $FIXTURE_DIR after fetch."
pass "$n_fix Sysmon .evtx fixtures present and verified"

# =============================================================================
section "Deploy throwaway emulator + schema ($SMOKE_CONTAINER on :$SMOKE_PORT) via the framework"
# The role CONVERGES an existing container rather than force-replacing it, so a
# stale throwaway from an earlier run must go first — the test's contract is a
# fresh, EMPTY (ephemeral, volatile-schema) emulator.
docker rm -f "$SMOKE_CONTAINER" >/dev/null 2>&1 || true
# `dxdfir deploy` drives dfir_deploy_adx: container up (localhost-only,
# egress-isolated), engine readiness, databases + schema, apply asserted clean.
DEPLOY_LOG="$OUT_DIR/dxdfir-deploy.log"
if ! "${DXDFIR[@]}" deploy --port "$SMOKE_PORT" \
        -e "dfir_deploy_adx_container=$SMOKE_CONTAINER" >"$DEPLOY_LOG" 2>&1; then
    tail -40 "$DEPLOY_LOG" >&2
    die "dxdfir deploy failed (full log above)."
fi
# The role already waited for readiness; re-confirm the engine answers HERE.
python3 -m get_sybers_dfir.ingest --ping --host 127.0.0.1 --port "$SMOKE_PORT" >/dev/null 2>&1 \
    || die "emulator did not become reachable on :$SMOKE_PORT."
pass "emulator deployed and answering (dfir_deploy_adx via dxdfir)"
assert_has mitre ".show functions | where Name startswith 'Car' | count" "CAR functions created"

# =============================================================================
section "Process fixtures through the real evtx lane (EvtxECmd)"
summary="$(python3 -m get_sybers_dfir.evtx --evtx-dir "$FIXTURE_DIR" --out-dir "$OUT_DIR" 2>/dev/null)"
processed="$(printf '%s' "$summary" | python3 -c 'import sys,json;print(json.load(sys.stdin).get("processed",0))' 2>/dev/null)"
if ! [[ "$processed" =~ ^[0-9]+$ ]] || (( processed == 0 )); then
    die "evtx processor produced nothing (summary: $summary)"
fi
pass "EvtxECmd processed $processed log(s)"

section "Ingest into the emulator"
ln -s "$OUT_DIR" "$PROC_DIR/windows_logs"
python3 -m get_sybers_dfir.ingest --only evtx --processed-dir "$PROC_DIR" \
    --host 127.0.0.1 --port "$SMOKE_PORT" --container "$SMOKE_CONTAINER" >/dev/null 2>&1 \
    || die "ingest failed."
assert_has host "EvtxEcmdJson | count" "EvtxEcmdJson populated"

# =============================================================================
# The heart of the test: CORRECTNESS. Each CAR object must return rows AND its
# EvtxPayload-derived fields must be populated (all empty under the XML bug),
# and where a fixture value is known, it must be present.
section "CAR correctness assertions (Sysmon EID 1/3/5/6/7/8/11/12/13)"

assert_has  mitre "CarDriver_Sysmon()   | where isnotempty(image_path) and isnotempty(signer) | count" \
    "CarDriver (EID6): image_path + signer populated"
assert_has  mitre "CarDriver_Sysmon()   | where image_path has 'VBoxDrv.sys' | count" \
    "CarDriver: known BYOVD driver VBoxDrv.sys present"

assert_has  mitre "CarModule_Sysmon()   | where isnotempty(module_path) and pid > 0 | count" \
    "CarModule (EID7): module_path + pid populated"

assert_has  mitre "CarThread_Sysmon()   | where action == 'remote_create' and tgt_pid > 0 and isnotempty(start_address) | count" \
    "CarThread (EID8): tgt_pid + start_address populated"

assert_has  mitre "CarProcess_Sysmon()  | where action == 'create' and isnotempty(command_line) | count" \
    "CarProcess (EID1): command_line populated (EvtxPayload)"
assert_has  mitre "CarProcess_Sysmon()  | where action == 'terminate' | count" \
    "CarProcess (EID5): terminate rows present"

assert_has  mitre "CarFlow_Sysmon()     | where isnotempty(src_ip) and dest_port > 0 | count" \
    "CarFlow (EID3): src_ip + dest_port populated (EvtxPayload)"

assert_has  mitre "CarFile_Sysmon()     | where isnotempty(file_path) | count" \
    "CarFile (EID11): file_path populated"

assert_has  mitre "CarRegistry_Sysmon() | where isnotempty(key) | count" \
    "CarRegistry (EID12/13): key populated"

# The roll-up objects (per-artefact unions) must also surface the Sysmon rows.
assert_has  mitre "CarDriver()   | count" "CarDriver() roll-up returns rows"
assert_has  mitre "CarThread()   | count" "CarThread() roll-up returns rows"

# =============================================================================
echo
echo "═══════════════════════════════════════════"
printf "  passed: %-4d failed: %d\n" "$PASS" "$FAIL"
echo "═══════════════════════════════════════════"
if (( FAIL > 0 )); then
    echo "  ❌ smoke test FAILED — the pipeline produced wrong or empty CAR output."
    exit 1
fi
echo "  ✅ pipeline smoke test passed — real evidence → correct CAR rows."
