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
group "Ansible lint"
# ------------------------------------------------------------------------------
# Production-profile ansible-lint over the collection (config: the collection's
# .ansible-lint). Skipped when ansible-lint is not installed (CI installs it).
if command -v ansible-lint >/dev/null 2>&1; then
    if (cd ansible/collections/get_sybers.dfir && ansible-lint --profile production >/dev/null 2>&1); then
        pass "ansible-lint (production profile) on get_sybers.dfir"
    else
        fail "ansible-lint reported violations (run: cd ansible/collections/get_sybers.dfir && ansible-lint)"
    fi
else
    skip "ansible-lint not installed"
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
group "ADX deploy (dfir_deploy_adx role + get_sybers_dfir.deploy)"
# ------------------------------------------------------------------------------
# The emulator has NO authentication and speaks plaintext HTTP, so the same
# mistakes cost more here than anywhere else. The retired shell deploy earned
# these guarantees defect by defect; the framework (the role plus the Python
# schema applier) must keep every one of them.
ROLE_DEPLOY=ansible/collections/get_sybers.dfir/roles/dfir_deploy_adx
if [[ ! -d "$ROLE_DEPLOY" ]]; then fail "$ROLE_DEPLOY is missing"; else
    # Localhost by default — with no auth, the bind address is the only control.
    if grep -q '^dfir_deploy_adx_host: "127.0.0.1"' "$ROLE_DEPLOY/defaults/main.yml" 2>/dev/null; then
        pass "role binds to localhost by default"
    else
        fail "dfir_deploy_adx_host no longer defaults to 127.0.0.1 — the emulator has no auth"
    fi
    # The published port must carry the bind address; a bare port binds 0.0.0.0.
    if grep -q '"{{ dfir_deploy_adx_host }}:{{ dfir_deploy_adx_port }}:8080"' "$ROLE_DEPLOY/tasks/deploy.yml" 2>/dev/null; then
        pass "role publishes an address-qualified port"
    else
        fail "the role's port mapping is not address-qualified (would bind 0.0.0.0)"
    fi
    # ... and the REAL bindings are read back — Docker's published-port rules
    # sit ahead of the host firewall, so the -p mapping is not taken on faith.
    if grep -q 'docker_container_info' "$ROLE_DEPLOY/tasks/deploy.yml" 2>/dev/null \
       && grep -q "0.0.0.0" "$ROLE_DEPLOY/tasks/deploy.yml" 2>/dev/null; then
        pass "role reads the real port bindings back"
    else
        fail "the role does not verify the published bindings"
    fi
    # Binding an unauthenticated engine off-localhost must take deliberate
    # effort (the shell deploy demanded typing 'expose'; the role demands an
    # explicit second variable).
    if grep -q 'dfir_deploy_adx_expose | bool' "$ROLE_DEPLOY/tasks/preflight.yml" 2>/dev/null; then
        pass "role gates a non-local bind behind dfir_deploy_adx_expose"
    else
        fail "the role binds non-locally without friction — it has no auth"
    fi
    # Egress isolation on by default: a masquerade-off bridge, NOT --internal
    # (an internal network blocks published ports in both directions — that
    # shipped once and made a UI unreachable on localhost).
    if grep -q '^dfir_deploy_adx_isolated: true' "$ROLE_DEPLOY/defaults/main.yml" 2>/dev/null; then
        pass "network isolation on by default"
    else
        fail "dfir_deploy_adx_isolated no longer defaults to true"
    fi
    if grep -q 'enable_ip_masquerade: "false"' "$ROLE_DEPLOY/tasks/deploy.yml" 2>/dev/null; then
        pass "isolated network disables IP masquerade"
    else
        fail "the isolated network has no egress control"
    fi
    # Comments are stripped first — the network task's own comment names the
    # forbidden form, which would otherwise trip (or satisfy) a bare grep.
    if grep -v '^[[:space:]]*#' "$ROLE_DEPLOY/tasks/deploy.yml" 2>/dev/null | grep -q 'internal: true'; then
        fail "the role creates an --internal network — that blocks published ports"
    else
        pass "isolated network is not --internal"
    fi
    # ... and isolation is VERIFIED from inside the container, not assumed —
    # masquerade-off breaks return traffic rather than dropping packets, so a
    # host with its own forwarding rules can still leak.
    if grep -q '/dev/tcp/' "$ROLE_DEPLOY/tasks/deploy.yml" 2>/dev/null; then
        pass "role probes egress from inside the container"
    else
        fail "the role never verifies that isolation actually holds"
    fi
    # EULA: the role sets ACCEPT_EULA=Y, so the acceptance must be stated where
    # the operator can see it — the role docs AND the CLI verb that drives it.
    if grep -q 'ACCEPT_EULA: "Y"' "$ROLE_DEPLOY/tasks/deploy.yml" 2>/dev/null; then
        pass "role sets ACCEPT_EULA explicitly (visible, not buried)"
    else
        fail "ACCEPT_EULA is not set in deploy.yml — the emulator will not start"
    fi
    for _f in "$ROLE_DEPLOY/README.md" python/get_sybers_dfir/cli.py; do
        if grep -qi 'EULA' "$_f" 2>/dev/null; then
            pass "$(basename "$_f") discloses the EULA acceptance"
        else
            fail "$_f no longer warns that deploying accepts Microsoft's EULA"
        fi
    done
    # Ephemeral by default: Microsoft advises against persisting emulator data.
    if grep -q '^dfir_deploy_adx_persist: false' "$ROLE_DEPLOY/defaults/main.yml" 2>/dev/null; then
        pass "role defaults to ephemeral storage, per Microsoft's guidance"
    else
        fail "the role defaults to persisting, which Microsoft advises against"
    fi
    # Readiness must ask the ENGINE a real question — the ingest client's --ping
    # (which sends `.show version`; asserted behaviourally in the client group
    # below). Grepping logs is what let a dead Splunk report success.
    if grep -q -- '--ping' "$ROLE_DEPLOY/tasks/deploy.yml" 2>/dev/null; then
        pass "role readiness polls the engine (ingest --ping)"
    else
        fail "the role does not verify the engine actually answers"
    fi
    # The schema applier: volatile databases by default, --persist the explicit
    # opt-in, and a --dry-run that exits 0 without contacting anything.
    if grep -q '\] volatile' python/get_sybers_dfir/deploy.py 2>/dev/null \
       && grep -q '"--persist"' python/get_sybers_dfir/deploy.py 2>/dev/null; then
        pass "schema applier creates volatile databases unless --persist is given"
    else
        fail "get_sybers_dfir.deploy lost the volatile-default / --persist split"
    fi
    if PYTHONPATH=python python3 -m get_sybers_dfir.deploy --schema-dir kusto/schema --dry-run >/dev/null 2>&1; then
        pass "get_sybers_dfir.deploy --dry-run exits 0"
    else
        fail "get_sybers_dfir.deploy --dry-run fails"
    fi
fi

# ------------------------------------------------------------------------------
group "Kusto schema and ingestion (kusto/schema + get_sybers_dfir.ingest)"
# ------------------------------------------------------------------------------
if [[ ! -d kusto/schema ]]; then fail "kusto/schema is missing"; else
    # Every schema file must name its target database, or the schema applier
    # (get_sybers_dfir.deploy) cannot route it and the tables never exist.
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
    # ZeekConn once shipped a SourceFile column its 21-ordinal mapping could not
    # reach, and CarFlow() projected it. Counts columns against mapping entries
    # for both the CSV (Ordinal) and JSON (Path) tables — ZeekConn is JSON-mapped
    # now, so a csv-only check would have gone blind to exactly this table.
    # Explicit table:mapping pairs — the mapping name is not always <table>Mapping
    # (the generic Zeek table's is ZeekJsonMapping), and "Zeek" is a prefix of
    # "ZeekConn", so deriving one from the other would mis-pair them. The column
    # regex allows digits ([A-Za-z_][A-Za-z0-9_]*) so PayloadData1..6 count.
    _phantom=""
    for _pair in "ZeekConn:ZeekConnMapping" "Zeek:ZeekJsonMapping" \
                 "EvtxEcmdJson:EvtxEcmdJsonMapping" \
                 "VelociraptorJson:VelociraptorJsonMapping"; do
        _tbl=${_pair%%:*}; _map=${_pair##*:}
        _f=$(grep -l "create-merge table $_tbl " kusto/schema/*.kql 2>/dev/null | head -1)
        [[ -n "$_f" ]] || continue
        _ncol=$(sed -n "/create-merge table $_tbl (/,/^)/p" "$_f" | grep -cE '^[[:space:]]+[A-Za-z_][A-Za-z0-9_]*:')
        _nmap=$(sed -n "/ingestion .* mapping \"$_map\"/,/\]\`\`\`/p" "$_f" | grep -cE '"Ordinal"|"Path"')
        [[ "$_ncol" -eq "$_nmap" ]] || _phantom="$_phantom $_tbl($_ncol cols/$_nmap mapped)"
    done
    if [[ -z "$_phantom" ]]; then
        pass "no table has columns its ingestion mapping cannot populate"
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
    # structurally legal KQL, so it would regress silently. The contract: all
    # nine objects are sourced now — the six dead-box/agent objects plus
    # driver/module/thread from Sysmon (events 6/7/8) — each has its Car<Object>()
    # function in 40-mitre.kql, and every pinned name exists in MITRE's own
    # car_data_model.json, so the model file stays load-bearing, not decorative.
    # Change the set deliberately, updating docs/Kusto-Port.md coverage with it.
    _car_missing=$(python3 - <<'PY' 2>/dev/null
import json
objs = {o['name'][0] for o in json.load(open('car_data_model.json'))['objects']}
pinned = {'flow', 'user_session', 'process', 'service', 'file', 'registry',
          'driver', 'module', 'thread'}
print(' '.join(sorted(pinned - objs)))
PY
)
    if [[ -z "$_car_missing" ]]; then
        pass "all nine sourced CAR objects exist in MITRE's model"
    else
        fail "pinned CAR object(s) not in car_data_model.json:$_car_missing"
    fi
    for _fn in CarFlow CarUserSession CarProcess CarService CarFile CarRegistry \
               CarDriver CarModule CarThread CarCoverage; do
        if grep -q "^${_fn}()" kusto/schema/40-mitre.kql 2>/dev/null; then
            pass "40-mitre.kql defines ${_fn}()"
        else
            fail "40-mitre.kql lost ${_fn}() — CAR coverage regressed"
        fi
    done
fi
if [[ ! -f python/get_sybers_dfir/ingest/__init__.py ]]; then fail "the ingest module is missing"; else
    # Zeek is JSON (the zeek lane: LogAscii::use_json=T). BEHAVIOURAL: assert
    # the ROUTING the JSON cutover has to keep — conn.json to the typed
    # ZeekConn table, every other log wrapped into the generic Zeek table, and
    # conn.json NOT double-loaded (zeek_wrap skips it for the generic pass).
    if PYTHONPATH=python python3 - <<'PY' >/dev/null 2>&1
import json, os, tempfile
from get_sybers_dfir.ingest import SOURCES, prepare
conn = [s for s in SOURCES if s["key"] == "zeek" and s["glob"] == "conn.json"]
assert conn and conn[0]["table"] == "ZeekConn" and conn[0]["wrap"] is None
gen = [s for s in SOURCES if s["key"] == "zeek" and s["glob"] == "*.json"]
assert gen and gen[0]["table"] == "Zeek" and gen[0]["wrap"] == "zeek"
with tempfile.TemporaryDirectory() as d:
    cp, dp = os.path.join(d, "conn.json"), os.path.join(d, "dns.json")
    open(cp, "w").write('{"uid":"C1"}\n')
    open(dp, "w").write('{"query":"evil.example"}\n')
    assert prepare.zeek_wrap(cp, "zeek/case/conn.json") is None   # typed table's job
    got = [json.loads(x) for x in prepare.zeek_wrap(dp, "zeek/case/dns.json")]
    assert got == [{"LogType": "dns", "SourceFile": "zeek/case/dns.json",
                    "Record": {"query": "evil.example"}}]
PY
    then
        pass "Zeek routing: conn.json -> ZeekConn, other logs -> generic Zeek, no double-load"
    else
        fail "Zeek routing is wrong — the conn/generic split or the wrap shape regressed"
    fi
    # The JSON cutover: ZeekConn must map by PATH (immune to Zeek field reorder),
    # including Zeek's dotted id keys. A leftover ordinal mapping would silently
    # reintroduce the column-shift risk the TSV path had.
    if grep -q "\$\['id.orig_h'\]" kusto/schema/20-network.kql 2>/dev/null; then
        pass "ZeekConn maps by JSON path, dotted id keys included"
    else
        fail "ZeekConn no longer maps the dotted id.* JSON paths — check ZeekConnMapping"
    fi
    # BEHAVIOURAL: the Plaso l2t fan-out (which replaced the CSV header lane —
    # no header row to drop any more) must split records into per-parser L2t*
    # tables, convert the µs-epoch timestamp, and leave a zero timestamp UNSET
    # rather than writing 1970.
    if PYTHONPATH=python python3 - <<'PY' >/dev/null 2>&1
import json, os, tempfile
from get_sybers_dfir.ingest import prepare
with tempfile.TemporaryDirectory() as d:
    src = os.path.join(d, "img.jsonl")
    with open(src, "w") as w:
        w.write(json.dumps({"parser": "filestat", "timestamp": 1735689600000000}) + "\n")
        w.write(json.dumps({"parser": "winreg/appcompatcache", "timestamp": 0}) + "\n")
    out = prepare.split_l2t(src, "img.raw", d, "p")
    assert set(out) == {"L2tFilestat", "L2tWinreg"}
    r1 = json.loads(open(out["L2tFilestat"]).read())
    assert r1["Timestamp"].startswith("2025-01-01T00:00:00")
    r2 = json.loads(open(out["L2tWinreg"]).read())
    assert "Timestamp" not in r2 and r2["Parser"] == "winreg/appcompatcache"
PY
    then
        pass "l2t fan-out: per-parser tables, µs timestamps converted, zero left unset"
    else
        fail "the l2t fan-out (split_l2t) regressed — tables, timestamps, or zero handling"
    fi
    # Staging by bare basename silently drops evidence: per-host EvtxECmd output
    # collides on the channel name, so only the last host survives. BEHAVIOURAL:
    # two files with the same basename must stage under different names.
    if PYTHONPATH=python python3 - <<'PY' >/dev/null 2>&1
from get_sybers_dfir.ingest.prepare import staged_name
a = staged_name("hostA/Security_EvtxECmd_Output.json")
b = staged_name("hostB/Security_EvtxECmd_Output.json")
assert a != b
PY
    then
        pass "staging names are path-derived, so per-host files cannot collide"
    else
        fail "staging collides on the bare basename — per-host files are lost"
    fi
    # Both staging areas hold copies of the evidence; an interrupt must not
    # leak them. Host staging must live in a TemporaryDirectory context
    # (cleaned even when an exception/Ctrl-C unwinds), and the in-container
    # stage must be removed after the run.
    if grep -q 'with tempfile.TemporaryDirectory' python/get_sybers_dfir/ingest/__init__.py 2>/dev/null \
       && grep -q '"rm", "-rf", CONTAINER_STAGE' python/get_sybers_dfir/ingest/__init__.py 2>/dev/null; then
        pass "ingest staging is context-managed on the host and removed in the container"
    else
        fail "ingest can leave evidence copies behind in a staging area"
    fi
fi
if [[ ! -f python/get_sybers_dfir/ingest/kusto.py ]]; then fail "python/get_sybers_dfir/ingest/kusto.py is missing"; else
    # The REST API returns HTTP 200 with an error document, so transport
    # success proves nothing. failed() is the only thing standing between a
    # failed schema apply and a success message — call it against the response
    # shapes that matter, don't grep for its name.
    if PYTHONPATH=python python3 - <<'PY' >/dev/null 2>&1
from get_sybers_dfir.ingest.kusto import failed
assert failed("")                                              # no response
assert failed("<html>502</html>")                              # not Kusto at all
assert failed('{"error":{"message":"x"}}')                     # error envelope
assert failed('{"Tables":[{"Columns":[{"ColumnName":"Result"}],"Rows":[["Failed"]]}]}')
assert not failed('{"Tables":[{"Columns":[{"ColumnName":"n"}],"Rows":[[7]]}]}')
PY
    then
        pass "failed() detects empty, non-Kusto, envelope and in-table failures"
    else
        fail "failed() misses a failure shape — see the check for which"
    fi
    # Kusto routes by request type: '.' commands to /v1/rest/mgmt, KQL to
    # /v1/rest/query — a '.' command on the query endpoint is rejected (that
    # once made every schema verification report zero). And the reachability
    # probe every deploy/ingest leans on must ask the engine a real question
    # (`.show version`) — accepting any listener once let a proxy block page
    # pass for a running Kusto. BEHAVIOURAL, via a captured _post.
    if PYTHONPATH=python python3 - <<'PY' >/dev/null 2>&1
from get_sybers_dfir.ingest.kusto import KustoClient
calls = []
client = KustoClient()
client._post = lambda path, db, csl: (
    calls.append((path, csl)) or '{"Tables":[{"Columns":[],"Rows":[[1]]}]}')
client.mgmt("db", ".show tables")
client.query("db", "T | count")
assert client.reachable() is True
assert calls[0][0] == "/v1/rest/mgmt"
assert calls[1][0] == "/v1/rest/query"
assert calls[2] == ("/v1/rest/mgmt", ".show version")
PY
    then
        pass "client routes mgmt vs query correctly; reachable() asks for .show version"
    else
        fail "client endpoint routing or the reachability probe regressed"
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
          | grep -vE '^\./(\.git|data_store)/' || true)
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
    # Skip VCS internals, evidence corpora — data_store/ holds raw and
    # processed forensic samples (whole disk images, vendored OS docs), whose
    # internal links are not this project's documentation to validate — and
    # third-party caches (ansible-lint installs the collection's pinned deps
    # under .ansible/; their changelogs are not ours to validate).
    if ".git/" in str(md) or rel.startswith("data_store/"): continue
    if "/.ansible/" in str(md) or rel.startswith(".ansible/"): continue
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
