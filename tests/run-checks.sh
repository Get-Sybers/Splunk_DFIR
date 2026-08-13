#!/bin/bash
# ==============================================================================
# DX_DFIR — repository checks
#
# The project had no automated verification of any kind, which meant every "✅"
# on the task board was a claim rather than a result. This script codifies the
# checks that can be run without Docker or evidence.
#
# It does NOT test the pipeline. It catches the class of defect that has
# actually bitten this repo: path-resolution bugs, literal-string config
# values, stale documentation links, and evidence-gitignore gaps.
#
#   ./tests/run-checks.sh          run everything
#   ./tests/run-checks.sh -v       show each passing check too
#
# Exit code is non-zero if any check fails, so this can gate CI.
# ==============================================================================
set -uo pipefail

SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"
REPO_ROOT="$(realpath "$SCRIPT_DIR/..")"
cd "$REPO_ROOT" || exit 1

VERBOSE=0
[[ "${1:-}" == "-v" || "${1:-}" == "--verbose" ]] && VERBOSE=1

PASS=0; FAIL=0; SKIP=0
pass() { PASS=$((PASS+1)); [[ $VERBOSE -eq 1 ]] && echo "    ✓ $1"; return 0; }
fail() { FAIL=$((FAIL+1)); echo "    ✗ $1"; return 0; }
skip() { SKIP=$((SKIP+1)); echo "    – skipped: $1"; return 0; }
group() { echo ""; echo "── $1"; }

# ------------------------------------------------------------------------------
group "Shell syntax"
# ------------------------------------------------------------------------------
while IFS= read -r f; do
    if bash -n "$f" 2>/dev/null; then pass "$f"; else fail "$f does not parse"; fi
done < <(find scripts dev-scripts tests -name "*.sh" -type f 2>/dev/null | sort)

# ------------------------------------------------------------------------------
group "Shellcheck"
# ------------------------------------------------------------------------------
if command -v shellcheck >/dev/null 2>&1; then
    while IFS= read -r f; do
        # -S error: only hard errors gate. Style warnings are noise for now.
        if shellcheck -S error "$f" >/dev/null 2>&1; then pass "$f"; else fail "shellcheck errors in $f"; fi
    done < <(find scripts dev-scripts tests -name "*.sh" -type f 2>/dev/null | sort)
else
    skip "shellcheck not installed"
fi

# ------------------------------------------------------------------------------
group "Repo-root path resolution"
# ------------------------------------------------------------------------------
# The now-deleted scripts/v2 shipped four scripts computing $SCRIPT_DIR/..
# while living one directory deeper, so they resolved the repo root to
# <repo>/scripts. Three more in scripts/deprecated/ had the same bug and were
# only found by this check. Every script that computes REPO_ROOT_DIR must land
# on the real repo root, whatever depth it lives at.
while IFS= read -r f; do
    line=$(grep -m1 'REPO_ROOT_DIR=' "$f" 2>/dev/null | sed 's/^[[:space:]]*//')
    [[ -z "$line" ]] && continue
    sd="$(dirname "$(readlink -f "$f")")"
    resolved=$(eval "SCRIPT_DIR='$sd'; $line; echo \$REPO_ROOT_DIR" 2>/dev/null)
    if [[ "$resolved" == "$REPO_ROOT" ]]; then pass "$f"
    else fail "$f resolves repo root to '$resolved' (expected '$REPO_ROOT')"; fi
done < <(find scripts -name "*.sh" -type f | sort)

# ------------------------------------------------------------------------------
group "Shared container lifecycle (lib/docker-lifecycle.sh)"
# ------------------------------------------------------------------------------
# The deploy routes its container lifecycle through one library. Each lesson
# here was paid for by a shipped defect (several on the retired Splunk path);
# they are asserted ONCE, on the lib — and the deploy must actually route
# through the lib instead of growing new inline copies, which is how the two
# deploys of the Splunk era drifted apart.
DL_LIB=scripts/lib/docker-lifecycle.sh
if [[ ! -f "$DL_LIB" ]]; then fail "$DL_LIB is missing"; else
    # NOT --internal: that blocks published ports in both directions and
    # shipped once as an unreachable Splunk UI. Continuation-aware — the
    # create is written `docker network create \` with flags on the next
    # line, which a single-line grep can never match.
    if grep -Pzoq 'docker network create(\s|\\\n)+[^\n]*--internal' "$DL_LIB" 2>/dev/null; then
        fail "lib creates an --internal network — that blocks published ports"
    else
        pass "lib network is not --internal (continuations checked)"
    fi
    if grep -q 'enable_ip_masquerade=false' "$DL_LIB" 2>/dev/null; then
        pass "lib disables IP masquerade for isolation"
    else
        fail "lib has no egress control on the isolated network"
    fi
    # find -delete refuses a non-empty directory (and -maxdepth 1 never
    # descends to empty it first), so a -delete purge cannot remove nested
    # data at all — Kusto's /kustodata/dbs/<db>/... is exactly that shape.
    # Comments are stripped before the grep: the function's own comment names
    # both forms, which once satisfied this check while the code regressed.
    if sed -n '/^dl_purge_dir_contents()/,/^}/p' "$DL_LIB" | grep -v '^[[:space:]]*#' \
       | grep -q -- '-exec rm -rf'; then
        pass "lib purge uses -exec rm -rf (find -delete cannot remove nested dirs)"
    else
        fail "lib purge cannot remove nested directories"
    fi
    # BEHAVIOURAL: the purge really empties nested content, spares .gitkeep,
    # and reports failure honestly when the delete (and its sudo escalation)
    # fail — the swallowed-failure version printed success over surviving data.
    if ( set +e
         # shellcheck source=../scripts/lib/docker-lifecycle.sh disable=SC2317
         source "$DL_LIB" 2>/dev/null
         _d=$(mktemp -d) || exit 1
         mkdir -p "$_d/dbs/host/md"; echo x > "$_d/dbs/host/md/meta.bin"; touch "$_d/.gitkeep"
         dl_purge_dir_contents "$_d" >/dev/null 2>&1 || exit 1
         [[ ! -e "$_d/dbs" ]] || exit 1                         # nested content gone
         [[ -e "$_d/.gitkeep" ]] || exit 1                      # .gitkeep spared
         find() { return 1; }; sudo() { return 1; }
         mkdir -p "$_d/dbs"
         dl_purge_dir_contents "$_d" >/dev/null 2>&1 && exit 1  # must report failure
         command rm -rf "$_d"; exit 0 ) 2>/dev/null; then
        pass "lib purge empties nested dirs, spares .gitkeep, reports failure honestly"
    else
        fail "lib purge misbehaves on nested content, .gitkeep, or a failed delete"
    fi
    # BEHAVIOURAL: readiness must detect a container that died mid-startup
    # (rc 2) rather than polling a corpse until timeout, and must enforce the
    # timeout on WALL-CLOCK time (rc 1) — counting only the sleeps once let a
    # 900s timeout run ~30 minutes, because each probe can block for seconds.
    if ( set +e
         # shellcheck source=../scripts/lib/docker-lifecycle.sh disable=SC2317
         source "$DL_LIB" 2>/dev/null
         docker() {
             [[ "$*" == *'.State.Running'* ]] && { echo "false"; return 0; }
             echo "1"; return 0
         }
         dl_wait_ready cid 5 1 true >/dev/null 2>&1
         [[ $? -eq 2 ]] || exit 1
         docker() { [[ "$*" == *'.State.Running'* ]] && { echo "true"; return 0; }; echo ""; }
         _slowprobe() { sleep 2; return 1; }
         _t0=$SECONDS
         dl_wait_ready cid 3 1 _slowprobe >/dev/null 2>&1
         [[ $? -eq 1 ]] || exit 1
         (( SECONDS - _t0 <= 6 )) || exit 1                     # wall-clock, not sleep-count
         exit 0 ) 2>/dev/null; then
        pass "lib readiness detects a died container and enforces wall-clock timeout"
    else
        fail "lib readiness misses a died container or overruns its timeout"
    fi
fi

# The deploy must route through the lib, not re-grow inline copies.
for _dep in scripts/deploy-kusto.sh; do
    _b=$(basename "$_dep")
    if grep -q 'source .*lib/docker-lifecycle.sh' "$_dep" 2>/dev/null; then
        pass "$_b sources the lifecycle lib"
    else
        fail "$_b does not source lib/docker-lifecycle.sh"
        continue
    fi
    for _fn in dl_replace_container dl_ensure_isolated_network dl_wait_ready \
               dl_verify_egress_blocked dl_assert_port_bindings; do
        if grep -q "^[[:space:]]*$_fn " "$_dep" 2>/dev/null; then
            pass "$_b calls $_fn"
        else
            fail "$_b does not call $_fn"
        fi
    done
    # `docker logs -f` never exits on its own; only the lib may background it,
    # and the deploy must stop it on every exit path.
    if grep -q 'trap dl_stop_log_stream EXIT' "$_dep" 2>/dev/null; then
        pass "$_b traps dl_stop_log_stream for early exits"
    else
        fail "$_b never stops its background log stream on early exits"
    fi
    if grep -qE 'docker logs -f.*&[[:space:]]*$' "$_dep" 2>/dev/null; then
        fail "$_b backgrounds docker logs -f outside the lib"
    else
        pass "$_b has no unmanaged log stream"
    fi
    # Direct network creation would bypass the lib's --internal detection and
    # masquerade handling.
    if grep -q 'docker network create' "$_dep" 2>/dev/null; then
        fail "$_b creates a network directly instead of via the lib"
    else
        pass "$_b creates no network outside the lib"
    fi
    # The closing banner must state the VERIFIED verdict, not a guess.
    if grep -q 'DL_ISOLATION_VERDICT' "$_dep" 2>/dev/null; then
        pass "$_b reports the runtime isolation verdict"
    else
        fail "$_b does not report the isolation verdict"
    fi
done

# Every script that empties a data/index directory must use the lib's honest
# purge — and carry no inline deletion that could bring the old defects back.
# The call grep is line-anchored so a comment naming the function cannot
# satisfy it.
for _s in scripts/deploy-kusto.sh; do
    _b=$(basename "$_s")
    if grep -qE 'rm -rf|find .*-delete' "$_s" 2>/dev/null; then
        fail "$_b deletes directories inline instead of via dl_purge_dir_contents"
    elif grep -qE '^[[:space:]]*(if ! )?dl_purge_dir_contents ' "$_s" 2>/dev/null; then
        pass "$_b purges directories via the lib"
    else
        fail "$_b has no directory purge — expected a dl_purge_dir_contents call"
    fi
done
# ------------------------------------------------------------------------------
# Kusto emulator deploy (stage 1 of the port).
#
# The emulator has NO authentication and speaks plaintext HTTP, so the same
# mistakes cost more here than on the Splunk path. These assert the lessons
# already paid for did in fact carry across.
# ------------------------------------------------------------------------------
if [[ ! -f scripts/deploy-kusto.sh ]]; then fail "scripts/deploy-kusto.sh is missing"; else
    # Network mechanism, log-stream handling and the purge are asserted on the
    # shared lib (lifecycle group above). Here: the Kusto-specific choices.
    #
    # Readiness must be a real health check against the ENGINE — the probe
    # handed to the shared dl_wait_ready must be kusto_reachable, which asks
    # for `.show version` (asserted in the kusto-api checks below). Grepping
    # logs is what let a dead Splunk report success.
    if grep -qE 'dl_wait_ready .* kusto_reachable' scripts/deploy-kusto.sh 2>/dev/null; then
        pass "deploy-kusto.sh polls the engine (kusto_reachable) rather than grepping logs"
    else
        fail "deploy-kusto.sh does not verify the engine actually answers"
    fi
    # The emulator has NO auth and speaks plaintext HTTP, so the safe defaults
    # the Splunk deploy earned must hold here too.
    if grep -q 'KUSTO_BIND_ADDR:-127.0.0.1' scripts/deploy-kusto.sh 2>/dev/null; then
        pass "kusto binds to localhost by default"
    else
        fail "deploy-kusto.sh does not default to 127.0.0.1 — the emulator has no auth"
    fi
    if grep -q 'KUSTO_ISOLATED:-1' scripts/deploy-kusto.sh 2>/dev/null; then
        pass "kusto network isolation on by default"
    else
        fail "deploy-kusto.sh does not default to an isolated network"
    fi
    if grep -q 'KUSTO_REPLACE:-always' scripts/deploy-kusto.sh 2>/dev/null; then
        pass "kusto redeploy is the default (KUSTO_REPLACE=always)"
    else
        fail "deploy-kusto.sh does not default to replacing the container"
    fi
    if grep -qE '^[[:space:]]+-p [0-9]+:[0-9]+' scripts/deploy-kusto.sh 2>/dev/null; then
        fail "deploy-kusto.sh publishes a port without a bind address (binds 0.0.0.0)"
    else
        pass "kusto published ports are address-qualified"
    fi
    # Binding an unauthenticated engine off-localhost must take deliberate effort.
    if grep -q "Type 'expose' to continue" scripts/deploy-kusto.sh 2>/dev/null; then
        pass "deploy-kusto.sh gates non-local binding behind a confirmation"
    else
        fail "deploy-kusto.sh binds non-locally without friction — it has no auth"
    fi
    # apply must resolve persist from the CONTAINER, with an explicit override —
    # deploy's flag cannot reach a fresh shell. Parse-level: --volatile accepted,
    # and a dry run exits 0 without contacting anything.
    if grep -qF -- '--volatile' scripts/apply-kusto-schema.sh 2>/dev/null; then
        pass "apply-kusto-schema.sh accepts --volatile"
    else
        fail "apply-kusto-schema.sh has no --volatile override for auto-detected persist"
    fi
    if ./scripts/apply-kusto-schema.sh --dry-run >/dev/null 2>&1; then
        pass "apply-kusto-schema.sh --dry-run exits 0"
    else
        fail "apply-kusto-schema.sh --dry-run fails"
    fi
    # Every script sourcing the lib must run the tool preflight, or a missing
    # python3 sends the literal body {"db":,"csl":} — a helper existed for this
    # and was called by NOTHING, the same promised-never-wired class as the
    # ignoreFirstRecord comment.
    for _s in scripts/deploy-kusto.sh scripts/apply-kusto-schema.sh scripts/ingest-kusto.sh; do
        if grep -q '^kusto_require_tools$' "$_s" 2>/dev/null; then
            pass "$(basename "$_s") runs the tool preflight"
        else
            fail "$(basename "$_s") never calls kusto_require_tools"
        fi
    done

    # Ephemeral must stay the default: Microsoft advises against persisting.
    if grep -qE '^KUSTO_PERSIST="\$\{KUSTO_PERSIST:-0\}"' scripts/deploy-kusto.sh 2>/dev/null; then
        pass "deploy-kusto.sh defaults to ephemeral storage, per Microsoft's guidance"
    else
        fail "deploy-kusto.sh defaults to persisting, which Microsoft advises against"
    fi
    if grep -qF -- '--purge-only' scripts/deploy-kusto.sh 2>/dev/null; then
        pass "deploy-kusto.sh accepts --purge-only"
    else
        fail "deploy-kusto.sh has no --purge-only"
    fi
fi

# ------------------------------------------------------------------------------
# Kusto schema and ingestion (stages 2-4).
# ------------------------------------------------------------------------------
if [[ ! -d kusto/schema ]]; then fail "kusto/schema is missing"; else
    # Every schema file must name its target database, or apply-kusto-schema.sh
    # silently skips it and the tables never exist.
    for f in kusto/schema/[1-9]*.kql; do
        [[ -f "$f" ]] || continue
        if grep -qE '^// Database:[[:space:]]*[A-Za-z_]' "$f"; then
            pass "$(basename "$f") declares its database"
        else
            fail "$(basename "$f") has no '// Database:' header — it would be skipped"
        fi
    done
    # .execute database script is non-transactional, so a non-idempotent form
    # leaves a half-applied schema that cannot be fixed by re-running.
    if grep -hoE '^\.create (table|function)\b' kusto/schema/[1-9]*.kql 2>/dev/null | grep -q .; then
        fail "a schema file uses non-idempotent .create — use .create-merge / .create-or-alter"
    else
        pass "all schema statements are idempotent forms"
    fi
    # A table column that no ingestion mapping covers can never be populated,
    # and an always-empty column is indistinguishable from "captured nothing".
    # ZeekConn shipped a SourceFile column its 21-ordinal mapping could not
    # reach, and CarFlow() projected it.
    _phantom=""
    for _tbl in ZeekConn L2tCsv; do
        _f=$(grep -l "create-merge table $_tbl " kusto/schema/*.kql 2>/dev/null | head -1)
        [[ -n "$_f" ]] || continue
        _ncol=$(sed -n "/create-merge table $_tbl (/,/^)/p" "$_f" | grep -cE '^[[:space:]]+[A-Za-z_]+:')
        _nmap=$(sed -n "/ingestion csv mapping \"${_tbl}Mapping\"/,/\]\`\`\`/p" "$_f" | grep -c '"Ordinal"')
        [[ "$_ncol" -eq "$_nmap" ]] || _phantom="$_phantom $_tbl($_ncol cols/$_nmap mapped)"
    done
    if [[ -z "$_phantom" ]]; then
        pass "no CSV table has columns its mapping cannot populate"
    else
        fail "column(s) no mapping can fill:$_phantom"
    fi

    # Databases in 00-databases.kql must match what the CAR functions reference.
    if [[ -f kusto/schema/00-databases.kql ]]; then
        # Names are bracket-quoted (`["network"]`) because `network` is a
        # reserved engine keyword; strip the brackets/quotes back to the plain
        # name. The optional-bracket regex still accepts the legacy bare form.
        declared=$(grep -oE '^\.create database +\[?"?[A-Za-z_][A-Za-z0-9_]*"?\]?' kusto/schema/00-databases.kql \
            | sed -E 's/^\.create database +//; s/^\["?//; s/"?\]$//' | sort -u)
        referenced=$(grep -hoE 'database\("[a-z]+"\)' kusto/schema/[1-9]*.kql 2>/dev/null | sed 's/database("\(.*\)")/\1/' | sort -u)
        missing=""
        for r in $referenced; do
            printf '%s\n' "$declared" | grep -qx "$r" || missing="$missing $r"
        done
        if [[ -z "$missing" ]]; then
            pass "every cross-database reference names a declared database"
        else
            fail "CAR functions reference undeclared database(s):$missing"
        fi
    fi

    # CAR coverage, PINNED. Swapping which CAR object has a source is
    # structurally legal KQL, so it would regress silently. The contract: these
    # six objects are sourced (driver/module/thread are declared unsourced in
    # CarCoverage — nothing dead-box produces them; registry is sourced again
    # via the Velociraptor/EZ-Tools path), each has its Car<Object>() function
    # in 40-mitre.kql, and every pinned name exists in MITRE's own
    # car_data_model.json — so the model file stays load-bearing, not
    # decorative. Change the set deliberately, updating docs/Kusto-Port.md
    # coverage with it.
    _car_missing=$(python3 - <<'PY' 2>/dev/null
import json
objs = {o['name'][0] for o in json.load(open('car_data_model.json'))['objects']}
pinned = {'flow', 'user_session', 'process', 'service', 'file', 'registry'}
print(' '.join(sorted(pinned - objs)))
PY
)
    if [[ -z "$_car_missing" ]]; then
        pass "all six sourced CAR objects exist in MITRE's model"
    else
        fail "pinned CAR object(s) not in car_data_model.json:$_car_missing"
    fi
    for _fn in CarFlow CarUserSession CarProcess CarService CarFile CarRegistry CarCoverage; do
        if grep -q "^${_fn}()" kusto/schema/40-mitre.kql 2>/dev/null; then
            pass "40-mitre.kql defines ${_fn}()"
        else
            fail "40-mitre.kql lost ${_fn}() — CAR coverage regressed"
        fi
    done
fi
if [[ ! -f scripts/ingest-kusto.sh ]]; then fail "scripts/ingest-kusto.sh is missing"; else
    # Zeek is mapped by ordinal. Without the header guard, a reordered conn.log
    # silently loads destination addresses into the source columns.
    # BEHAVIOURAL. Run the real script against fixtures and assert it refuses a
    # conn.log whose columns are not in the order ZeekConnMapping assumes.
    #
    # Two earlier versions of this check were string-matching and both were
    # wrong: the first grepped for a constant's name and passed after the guard
    # was broken; the second used a fixed grep -A8 window and failed on a
    # legitimate refactor. Mapping Zeek by ordinal against a reordered file puts
    # destination addresses in the source column, so this is worth testing for
    # real rather than spelling-checking.
    _zt=$(mktemp -d)
    mkdir -p "$_zt/zeek/case"
    _hdr_ok=$'#fields\tts\tuid\tid.orig_h\tid.orig_p\tid.resp_h\tid.resp_p\tproto'
    _hdr_bad=$'#fields\tts\tuid\tid.resp_h\tid.resp_p\tid.orig_h\tid.orig_p\tproto'
    _row=$'2025-01-01T00:00:00+0000\tC1\t10.0.0.1\t1\t10.0.0.2\t2\ttcp'
    _guard_ok=1
    # Output is captured, not piped: `grep -q` exits on first match, which
    # SIGPIPEs the script upstream, and `set -o pipefail` then reports the whole
    # pipeline as failed. That made this check fail against a working guard.
    _zrun() { PROCESSED_DIR="$_zt" ./scripts/ingest-kusto.sh --only zeek --dry-run 2>&1; }
    printf '%s\n%s\n' "$_hdr_ok" "$_row" > "$_zt/zeek/case/conn.log"
    _out=$(_zrun)
    [[ "$_out" == *"would ingest"* ]] || _guard_ok=0        # correct order must ingest
    printf '%s\n%s\n' "$_hdr_bad" "$_row" > "$_zt/zeek/case/conn.log"
    _out=$(_zrun)
    [[ "$_out" == *"Refusing to ingest"* ]] || _guard_ok=0  # swapped order must refuse
    printf '%s\n' "$_row" > "$_zt/zeek/case/conn.log"
    _out=$(_zrun)
    [[ "$_out" == *"Refusing to ingest"* ]] || _guard_ok=0  # no header must FAIL CLOSED
    rm -rf "$_zt"
    if [[ $_guard_ok -eq 1 ]]; then
        pass "Zeek column-order guard ingests correct order, refuses swapped and headerless"
    else
        fail "Zeek column-order guard does not behave correctly — see tests for the three cases"
    fi
    # Zeek '#' header lines would otherwise be ingested as data rows.
    if grep -q "grep -v '\^#'" scripts/ingest-kusto.sh 2>/dev/null; then
        pass "ingest strips Zeek '#' header lines"
    else
        fail "ingest does not strip Zeek header lines — they would become rows"
    fi
    # psteal writes a header row; without this it is ingested as data.
    if grep -q 'ignoreFirstRecord=true' scripts/ingest-kusto.sh 2>/dev/null; then
        pass "ingest drops the Plaso CSV header row"
    else
        fail "ingest does not set ignoreFirstRecord — header rows become data"
    fi
    # Staging by bare basename silently drops evidence: per-host EvtxECmd output
    # collides on the channel name, so only the last host survives.
    if grep -qE '\$\(basename "\$f"\)' scripts/ingest-kusto.sh 2>/dev/null; then
        fail "ingest stages by bare basename — per-host files collide and are lost"
    else
        pass "ingest stages by full relative path, so per-host files cannot collide"
    fi
    # Both staging areas hold copies of the evidence; Ctrl-C must not leak them.
    if grep -q 'trap cleanup_staging' scripts/ingest-kusto.sh 2>/dev/null; then
        pass "ingest cleans up staging on interrupt"
    else
        fail "ingest leaves full evidence copies behind if interrupted"
    fi
fi
if [[ ! -f scripts/lib/kusto-api.sh ]]; then fail "scripts/lib/kusto-api.sh is missing"; else
    # The REST API returns HTTP 200 with an error document, so curl's exit code
    # proves nothing. This is the only thing standing between a failed schema
    # apply and a success message.
    # Behavioural, not a name grep. The original asserted that the string
    # "kusto_failed" appeared in the file that DEFINES kusto_failed, so it could
    # not fail. This actually calls it against the response shapes that matter.
    if ( set +e
         # shellcheck source=../scripts/lib/kusto-api.sh
         source scripts/lib/kusto-api.sh 2>/dev/null
         kusto_failed "" || exit 1                                    # no response
         kusto_failed '<html>502</html>' || exit 1                    # not Kusto
         kusto_failed '{"error":{"message":"x"}}' || exit 1           # error envelope
         kusto_failed '{"Tables":[{"Columns":[{"ColumnName":"Result"}],"Rows":[["Failed"]]}]}' || exit 1
         kusto_failed '{"Tables":[{"Columns":[{"ColumnName":"n"}],"Rows":[[7]]}]}' && exit 1
         exit 0 ) >/dev/null 2>&1; then
        pass "kusto_failed detects empty, non-Kusto, envelope and in-table failures"
    else
        fail "kusto_failed misses a failure shape — see tests for which"
    fi
    # kusto_scalar must route '.' commands to /mgmt. Sending them to /query is
    # rejected by Kusto and made every schema verification report zero.
    if grep -A4 'kusto_scalar()' scripts/lib/kusto-api.sh 2>/dev/null | grep -q 'kusto_mgmt'; then
        pass "kusto_scalar routes control commands to the management endpoint"
    else
        fail "kusto_scalar sends '.' commands to the query endpoint — always fails"
    fi
    # kusto_reachable is the readiness probe both deploy and apply lean on. It
    # must ask the engine a real question — `grep -q .` once accepted a proxy
    # block page as a running Kusto.
    if sed -n '/^kusto_reachable()/,/^}/p' scripts/lib/kusto-api.sh 2>/dev/null | grep -q '\.show version'; then
        pass "kusto_reachable asks the engine for .show version"
    else
        fail "kusto_reachable does not query the engine — reachability degrades to a port check"
    fi
fi
# ------------------------------------------------------------------------------
group "Versioning and documentation"
# ------------------------------------------------------------------------------
# One project version, stated in one form. Relabelling alpha -> beta touched a
# dozen files by hand; this is what stops the next one leaving a stray behind.
PROJECT_VERSION=$(grep -m1 -oE '^## \[[0-9]+\.[0-9]+\.[0-9]+[^]]*\]' CHANGELOG.md 2>/dev/null | tr -d '#[] ')
if [[ -n "$PROJECT_VERSION" ]]; then
    pass "project version from CHANGELOG: $PROJECT_VERSION"
    # The README must NOT declare the current version in prose — it carries a
    # badge that reads the latest Release, so a promotion is a tag and nothing
    # else. Hardcoding it is what made alpha -> beta a twelve-file edit.
    if grep -qE 'img\.shields\.io/github/v/release' README.md 2>/dev/null; then
        pass "README version comes from a live release badge"
    else
        fail "README has no release badge — the version would have to be hand-maintained"
    fi
    if grep -qE '^> \*\*(Status|Release status):' README.md project-progress.md 2>/dev/null; then
        fail "a hardcoded status/version line is back — let the badge state it"
    else
        pass "no hardcoded status line in README or task board"
    fi
else
    fail "could not read a version heading from CHANGELOG.md"
fi
# No document may restate the number of checks. It was hand-copied into six
# files, every harness change meant editing all six, and one still said 86 long
# after the real count passed 160. The harness prints the number; documents
# point at the harness.
_counts=$(grep -rnE '[0-9]{2,4} (static )?checks' --include='*.md' . 2>/dev/null \
          | grep -v '^./.git/' || true)
if [[ -z "$_counts" ]]; then
    pass "no document hardcodes the check count"
else
    fail "documents restate the check count (it goes stale): $(printf '%s' "$_counts" | head -3 | tr '\n' ' ')"
fi

# The project is past alpha; a stray "Alpha" label contradicts the release.
if grep -rIl -E '(Status:.*Alpha|🧪 Alpha)' --include='*.md' . 2>/dev/null | grep -qv '^./.git/'; then
    fail "a document still labels this project Alpha"
else
    pass "no stale Alpha status labels"
fi

# ------------------------------------------------------------------------------
group "Evidence safety"
# ------------------------------------------------------------------------------
# data_store/.gitignore must deny by default. An extension blocklist silently
# missed VMware exports once already.
probe_dir="data_store/raw/VM_files/.checkprobe"
mkdir -p "$probe_dir" 2>/dev/null
leaked=0
for name in probe.vmdk probe-flat.vmdk probe.E01 probe.pcap probe.vmx probe.ova probe.unknownext noextension; do
    : > "$probe_dir/$name" 2>/dev/null || continue
    git check-ignore -q "$probe_dir/$name" 2>/dev/null || { fail "$name is NOT gitignored under data_store"; leaked=1; }
done
[[ $leaked -eq 0 ]] && pass "all evidence probes gitignored (incl. extensionless)"
rm -rf "$probe_dir" 2>/dev/null

# The skeleton must survive the deny-by-default rules.
for keep in data_store/README.md data_store/raw/disk_images/.gitkeep; do
    [[ -f "$keep" ]] || continue
    if git check-ignore -q "$keep" 2>/dev/null; then fail "$keep is wrongly ignored"; else pass "$keep kept"; fi
done

# No un-negated `**` allowlist may point at a directory that does not exist.
# The deny-by-default rewrite carried over `!dependencies/SuperMem/**` from the
# old blocklist without checking: SuperMem was deleted in 2025-09, so that was
# an open-ended hole aimed at a memory-forensics tool's directory. A stale
# allowlist is invisible until someone puts evidence behind it.
stale_allow=0
while IFS= read -r rule; do
    target="${rule#!}"; target="${target%%\**}"; target="${target%/}"
    [[ -z "$target" || "$target" == .* ]] && continue
    if [[ ! -e "data_store/$target" ]]; then
        fail "data_store/.gitignore allowlists '$target', which does not exist"
        stale_allow=1
    fi
done < <(grep -E '^!.*\*\*' data_store/.gitignore 2>/dev/null)
[[ $stale_allow -eq 0 ]] && pass "no stale ** allowlist rules in data_store/.gitignore"

# ------------------------------------------------------------------------------
group "Secrets"
# ------------------------------------------------------------------------------
if git grep -InE '(BEGIN [A-Z ]*PRIVATE KEY|AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{36}|xox[baprs]-[A-Za-z0-9-]{10,})' -- . >/dev/null 2>&1; then
    fail "possible secret material in the working tree"
else
    pass "no secret patterns in tree"
fi

# ------------------------------------------------------------------------------
group "Documentation links"
# ------------------------------------------------------------------------------
if command -v python3 >/dev/null 2>&1; then
    broken=$(python3 - <<'PY'
import re, pathlib
root = pathlib.Path(".").resolve()
lr = re.compile(r'\[[^\]]*\]\(([^)]+)\)')
bad = []
for md in sorted(root.rglob("*.md")):
    rel = str(md.relative_to(root))
    # Skip VCS internals and evidence corpora — data_store/ holds raw and
    # processed forensic samples (whole disk images, vendored OS docs), whose
    # internal links are not this project's documentation to validate.
    if ".git/" in str(md) or rel.startswith("data_store/"): continue
    for m in lr.finditer(md.read_text(errors="ignore")):
        t = m.group(1).split("#")[0].strip()
        if not t or t.startswith(("http://", "https://", "mailto:")): continue
        tgt = (root / t.lstrip("/")) if t.startswith("/") else (md.parent / t)
        if not tgt.exists():
            bad.append(f"{md.relative_to(root)} -> {t}")
print("\n".join(bad))
PY
)
    if [[ -z "$broken" ]]; then pass "all internal doc links resolve"
    else while IFS= read -r b; do fail "broken link: $b"; done <<< "$broken"; fi
else
    skip "python3 not available"
fi

# ------------------------------------------------------------------------------
echo ""
echo "═══════════════════════════════════════════"
printf "  passed: %-4s failed: %-4s skipped: %s\n" "$PASS" "$FAIL" "$SKIP"
echo "═══════════════════════════════════════════"
if [[ $FAIL -gt 0 ]]; then
    echo "  ❌ $FAIL check(s) failed"
    exit 1
fi
echo "  ✅ all checks passed"
