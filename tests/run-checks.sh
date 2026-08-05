#!/bin/bash
# ==============================================================================
# Splunk DFIR — repository checks
#
# The project had no automated verification of any kind, which meant every "✅"
# on the task board was a claim rather than a result. This script codifies the
# checks that can be run without Docker, Splunk, or evidence.
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
done < <(find scripts dev-scripts tests ansible -name "*.sh" -type f 2>/dev/null | sort)

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
group "Ansible task files"
# ------------------------------------------------------------------------------
if python3 -c "import yaml" 2>/dev/null; then
    while IFS= read -r f; do
        if python3 -c "import yaml,sys; yaml.safe_load(open(sys.argv[1]))" "$f" 2>/dev/null; then pass "$f (yaml)"
        else fail "$f is not valid YAML"; fi
    done < <(find ansible/playbooks -name "*.yml" -type f | sort)
else
    skip "pyyaml not installed"
fi

if command -v ansible-lint >/dev/null 2>&1; then
    # These are task files, not plays. ansible-lint must see them as tasks/ or
    # it reports a spurious "not a valid attribute for a Play".
    tmp=$(mktemp -d); mkdir -p "$tmp/tasks"
    # Every playbook, discovered rather than listed, so a new one is covered
    # automatically instead of silently escaping the gate.
    while IFS= read -r f; do
        cp "$f" "$tmp/tasks/main.yml"
        if (cd "$tmp" && ansible-lint tasks/main.yml >/dev/null 2>&1); then pass "$f (lint)"
        else fail "ansible-lint failures in $f"; fi
    done < <(find ansible/playbooks -name "*.yml" -type f | sort)
    rm -rf "$tmp"
else
    skip "ansible-lint not installed"
fi

# ------------------------------------------------------------------------------
group "Splunk configuration"
# ------------------------------------------------------------------------------
# `host = extracted_host` was a literal string, so Splunk labelled every event
# with the word "extracted_host". Catch any bareword host that is not a real
# value or a Splunk variable.
if grep -nE '^host[[:space:]]*=[[:space:]]*extracted_' splunk/etc/system/local/inputs.conf >/dev/null 2>&1; then
    fail "inputs.conf sets host to a literal 'extracted_*' string"
else
    pass "inputs.conf has no literal extracted_* host"
fi

# deploy and purge must agree on the index volume, or purge silently leaves
# every index behind while reporting success.
dep=$(grep -m1 'SPLUNK_VAR_VOLUME:-' scripts/deploy-splunk.sh 2>/dev/null | sed 's/.*:-\([^}]*\)}.*/\1/')
pur=$(grep -m1 'SPLUNK_VAR_VOLUME:-' scripts/purge-splunk-container.sh 2>/dev/null | sed 's/.*:-\([^}]*\)}.*/\1/')
if [[ -n "$dep" && "$dep" == "$pur" ]]; then pass "deploy/purge agree on volume '$dep'"
else fail "index volume mismatch: deploy='$dep' purge='$pur'"; fi

# Splunk's data directory must actually be persisted.
if grep -q ':/opt/splunk/var' scripts/deploy-splunk.sh 2>/dev/null; then
    pass "Splunk var is persisted"
else
    fail "nothing mounted at /opt/splunk/var — indexes will not survive the container"
fi

# This project redeploys the container every time, so the deploy must not
# block on a prompt and must accept a password non-interactively. Both have
# regressed before by being written as unconditional `read`.
if grep -q 'SPLUNK_REPLACE:-always' scripts/deploy-splunk.sh 2>/dev/null; then
    pass "redeploy is the default (SPLUNK_REPLACE=always)"
else
    fail "deploy-splunk.sh does not default to replacing the container"
fi
if grep -q 'SPLUNK_PASSWORD_FILE' scripts/deploy-splunk.sh 2>/dev/null; then
    pass "password can be supplied non-interactively"
else
    fail "deploy-splunk.sh has no non-interactive password path"
fi

# The deploy script's purge/persist flags are the documented interface for
# choosing whether a redeploy keeps or wipes indexed data.
for flag in --purge --persist --yes --help; do
    if grep -qF -- "$flag" scripts/deploy-splunk.sh 2>/dev/null; then
        pass "deploy-splunk.sh accepts $flag"
    else
        fail "deploy-splunk.sh does not accept $flag"
    fi
done
# --purge must actually remove the volume, and must do so after the container is
# gone — Docker will not remove a volume that is still attached.
if grep -q 'docker volume rm "$SPLUNK_VAR_VOLUME"' scripts/deploy-splunk.sh 2>/dev/null; then
    _rm=$(grep -n 'docker rm -f' scripts/deploy-splunk.sh | head -1 | cut -d: -f1)
    _vol=$(grep -n 'docker volume rm' scripts/deploy-splunk.sh | head -1 | cut -d: -f1)
    if [[ -n "$_rm" && -n "$_vol" && "$_rm" -lt "$_vol" ]]; then
        pass "--purge removes the volume after the container"
    else
        fail "--purge removes the volume before the container is gone (docker will refuse)"
    fi
else
    fail "--purge does not remove the index volume"
fi

# The container holds evidence: it must not be reachable from the LAN, and must
# not be able to reach out. Both defaults have to stay put.
if grep -q 'SPLUNK_BIND_ADDR:-127.0.0.1' scripts/deploy-splunk.sh 2>/dev/null; then
    pass "ports bind to localhost by default"
else
    fail "deploy-splunk.sh does not default to binding 127.0.0.1"
fi
if grep -q 'SPLUNK_ISOLATED:-1' scripts/deploy-splunk.sh 2>/dev/null; then
    pass "network isolation on by default"
else
    fail "deploy-splunk.sh does not default to an isolated network"
fi
# NOT --internal. An internal network blocks published ports too, which makes
# Splunk unreachable — that shipped once and had to be reverted.
if grep -Pzoq 'docker network create(\s|\\\n)+[^\n]*--internal' scripts/deploy-splunk.sh 2>/dev/null; then
    fail "network created with --internal — that blocks published ports and makes Splunk unreachable"
else
    pass "network is not --internal"
fi
if grep -q 'enable_ip_masquerade=false' scripts/deploy-splunk.sh 2>/dev/null; then
    pass "egress limited via disabled IP masquerade"
else
    fail "no egress restriction on the container network"
fi
# Isolation is a two-directional property. Verifying only egress is how the
# unreachable-UI bug got past the deploy's own check.
if grep -q 'ingress_ok' scripts/deploy-splunk.sh 2>/dev/null; then
    pass "deploy verifies Splunk is reachable (ingress)"
else
    fail "deploy does not verify Splunk is reachable — egress-only checks miss a dead UI"
fi
if grep -qF -- '--purge-only' scripts/deploy-splunk.sh 2>/dev/null; then
    pass "deploy-splunk.sh accepts --purge-only"
else
    fail "no --purge-only: wiping data should not force a redeploy"
fi
# Indexes must be storable in a host directory, not only a Docker volume. The
# original deploy bind-mounted splunk/var read-write — the only rw mount it had
# — so a visible, backup-able index directory was the intended design. The
# persistence fix swapped in a named volume; keeping --var-dir means that fix
# did not quietly discard the choice.
if grep -qF -- '--var-dir' scripts/deploy-splunk.sh 2>/dev/null; then
    pass "deploy-splunk.sh supports --var-dir (host directory for indexes)"
else
    fail "no --var-dir: indexes can only live in a Docker volume"
fi
# A purge that deletes .gitkeep leaves a spurious git change behind.
_gk_ok=1
for _s in scripts/deploy-splunk.sh scripts/purge-splunk-container.sh scripts/deploy-kusto.sh; do
    [[ -f "$_s" ]] || continue
    grep -q 'rm -rf\|-delete' "$_s" 2>/dev/null || continue
    grep -q "not -name '.gitkeep'" "$_s" 2>/dev/null || _gk_ok=0
done
if [[ $_gk_ok -eq 1 ]]; then
    pass "every purge path spares .gitkeep"
else
    fail "purge would delete the tracked .gitkeep from an index directory"
fi
# `docker logs -f` never exits. Backgrounding it without stopping it buries
# every diagnostic printed afterwards — including the reachability failure —
# and orphans the process past script exit.
if grep -q 'docker logs -f' scripts/deploy-splunk.sh 2>/dev/null; then
    if grep -q 'stop_log_stream' scripts/deploy-splunk.sh 2>/dev/null \
       && grep -q 'trap stop_log_stream' scripts/deploy-splunk.sh 2>/dev/null; then
        pass "background log stream is stopped, with a trap for early exits"
    else
        fail "deploy backgrounds 'docker logs -f' but never stops it"
    fi
fi
# A bare `-p 8000:8000` binds 0.0.0.0 — every interface. Every publish must be
# address-qualified.
if grep -qE '^[[:space:]]+-p [0-9]+:[0-9]+' scripts/deploy-splunk.sh 2>/dev/null; then
    fail "deploy-splunk.sh publishes a port without a bind address (binds 0.0.0.0)"
else
    pass "all published ports are address-qualified"
fi
# ------------------------------------------------------------------------------
# Kusto emulator deploy (stage 1 of the port).
#
# The emulator has NO authentication and speaks plaintext HTTP, so the same
# mistakes cost more here than on the Splunk path. These assert the lessons
# already paid for did in fact carry across.
# ------------------------------------------------------------------------------
if [[ ! -f scripts/deploy-kusto.sh ]]; then fail "scripts/deploy-kusto.sh is missing"; else
    # Must survive line continuations: the script writes `docker network create \`
    # then the flags on following lines, so a single-line grep for
    # "docker network create --internal" can NEVER match — the original version
    # of this check was incapable of failing.
    if grep -Pzoq 'docker network create(\s|\\\n)+[^\n]*--internal' scripts/deploy-kusto.sh 2>/dev/null; then
        fail "deploy-kusto.sh uses --internal, which blocks published ports"
    else
        pass "deploy-kusto.sh does not use --internal (continuations checked)"
    fi
    if grep -q 'enable_ip_masquerade=false' scripts/deploy-kusto.sh 2>/dev/null; then
        pass "deploy-kusto.sh disables IP masquerade for isolation"
    else
        fail "deploy-kusto.sh has no egress control"
    fi
    if grep -q 'trap stop_log_stream' scripts/deploy-kusto.sh 2>/dev/null; then
        pass "deploy-kusto.sh stops its background log stream"
    else
        fail "deploy-kusto.sh leaves 'docker logs -f' running over its diagnostics"
    fi
    # Readiness must be a real health check. Grepping logs is what let a dead
    # Splunk report success.
    if grep -q '\.show version' scripts/deploy-kusto.sh 2>/dev/null; then
        pass "deploy-kusto.sh polls the engine rather than grepping logs"
    else
        fail "deploy-kusto.sh does not verify the engine actually answers"
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
        declared=$(grep -oE '^\.create database [A-Za-z_][A-Za-z0-9_]*' kusto/schema/00-databases.kql | awk '{print $3}' | sort -u)
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
fi

# Isolation is asserted at runtime, not assumed.
if grep -q 'ISOLATION_VERDICT' scripts/deploy-splunk.sh 2>/dev/null; then
    pass "deploy verifies isolation at runtime"
else
    fail "deploy does not verify isolation actually holds"
fi
# The purge script must not delete every dangling volume on the host. It used
# to, while announcing that it was removing volumes "related to Splunk" —
# destroying other projects' data on any shared Docker host.
if grep -qE 'dangling=true.*\|.*xargs docker volume rm|xargs docker volume rm' \
     scripts/purge-splunk-container.sh 2>/dev/null; then
    fail "purge removes ALL dangling volumes — that reaches outside this project"
else
    pass "purge does not blanket-remove dangling volumes"
fi

# ------------------------------------------------------------------------------
group "Third-party app installation"
# ------------------------------------------------------------------------------
# Splunk_TA_zeek and sankey_diagram_app must not come back into the repo — they
# carry no licence permitting redistribution.
for app in Splunk_TA_zeek sankey_diagram_app; do
    if [[ -d "splunk/etc/apps/$app" ]]; then
        fail "$app is vendored again — it has no redistribution licence"
    else
        pass "$app not vendored"
    fi
done

# Every playbook referenced by ANSIBLE_PRE_TASKS must actually exist, or the
# container's Ansible run fails at start.
for var in ANSIBLE_PRE_TASKS ANSIBLE_POST_TASKS; do
    line=$(grep -m1 "^${var}=" scripts/deploy-splunk.sh | sed 's/.*="//;s/"$//')
    [[ -z "$line" ]] && { fail "$var is not set in deploy-splunk.sh"; continue; }
    IFS=',' read -ra _pt <<< "$line"
    for task in "${_pt[@]}"; do
        # splunk-ansible only executes entries matching ^(http|https|file)://
        if [[ ! "$task" =~ ^(http|https|file):// ]]; then
            fail "$var entry is not a URL, so splunk-ansible will skip it: $task"
            continue
        fi
        f="ansible/playbooks/$(basename "$task")"
        if [[ -f "$f" ]]; then pass "$var exists: $(basename "$f")"
        else fail "$var references missing playbook: $f"; fi
    done
done

# App installation is the image's job via SPLUNK_APPS_URL, not a custom
# playbook. And the overrides must be a POST task: site.yml runs
# pre_tasks -> role -> post_tasks, and the role is what installs the apps.
if grep -q 'SPLUNK_APPS_URL=' scripts/deploy-splunk.sh 2>/dev/null; then
    pass "apps installed via the image's SPLUNK_APPS_URL"
else
    fail "deploy-splunk.sh does not pass SPLUNK_APPS_URL"
fi
if grep -q 'ANSIBLE_POST_TASKS=.*Apply-App-Overrides' scripts/deploy-splunk.sh 2>/dev/null; then
    pass "app overrides run as a post-task (after apps install)"
else
    fail "Apply-App-Overrides must be a POST task — as a pre-task the apps do not exist yet"
fi

# Conversely, every playbook present should be wired — dead playbooks are how
# copy_installed_apps.yml and disable_popups.yml lingered unnoticed.
while IFS= read -r f; do
    if grep -q "$(basename "$f")" scripts/deploy-splunk.sh; then pass "wired: $(basename "$f")"
    else fail "$f is not referenced by deploy-splunk.sh"; fi
done < <(find ansible/playbooks -name "*.yml" -type f | sort)

# The package directory must be mounted, or the install playbook finds nothing.
if grep -q '/data/dependencies/splunk_apps' scripts/deploy-splunk.sh; then
    pass "third-party package dir is mounted"
else
    fail "deploy-splunk.sh does not mount the third-party package directory"
fi

# Announced mounts must match actual -v flags. They drifted before: the script
# announced splunk/ansible and splunk/var, neither of which was real.
announced=$(grep -cE '^echo "⚙️ Mounting' scripts/deploy-splunk.sh)
actual=$(grep -cE '^[[:space:]]+-v .*:/data/' scripts/deploy-splunk.sh)
if [[ "$announced" -eq "$actual" ]]; then pass "mount announcements match ($actual)"
else fail "deploy-splunk.sh announces $announced mounts but performs $actual"; fi

# Every sourcetype an input assigns should have a props.conf stanza somewhere,
# or the data lands in Splunk with no parsing at all — which is how the EVTX
# path sat broken: no input, and no props to receive it.
#
# Sourcetypes deliberately provided by an operator-supplied app rather than by
# this repository. Listed explicitly so the external dependency is visible and
# checkable, instead of the check either failing forever or being deleted.
declare -A EXTERNAL_SOURCETYPE=(
    [zeek]="Splunk_TA_zeek (Corelight Add-on for Zeek) — see data_store/dependencies/splunk_apps/"
)
while IFS= read -r st; do
    if grep -rqF "[$st]" splunk/etc/apps/*/default/props.conf splunk/etc/system/local/props.conf 2>/dev/null; then
        pass "sourcetype has props: $st"
    elif [[ -n "${EXTERNAL_SOURCETYPE[$st]:-}" ]]; then
        pass "sourcetype '$st' provided externally by ${EXTERNAL_SOURCETYPE[$st]}"
    else
        fail "inputs.conf assigns sourcetype '$st' with no props.conf stanza"
    fi
done < <(grep -hE '^sourcetype[[:space:]]*=' splunk/etc/system/local/inputs.conf 2>/dev/null \
         | sed 's/.*=[[:space:]]*//' | grep -v '\$' | sort -u)

# ------------------------------------------------------------------------------
group "Splunk app metadata"
# ------------------------------------------------------------------------------
FIRST_PARTY=(BASELINE DETECT Kape_App Log2timeline_App Rekall_App Velociraptor_App)
for app in "${FIRST_PARTY[@]}"; do
    conf="splunk/etc/apps/$app/default/app.conf"
    [[ -f "$conf" ]] || { fail "$conf missing"; continue; }
    v=$(grep -m1 '^version' "$conf" | sed 's/.*=[[:space:]]*//')
    if [[ "$v" =~ ^0\. ]]; then pass "$app version $v"
    else fail "$app declares version '$v' — pre-1.0 project should not ship 1.x"; fi
    if grep -q '^description[[:space:]]*=[[:space:]]*$' "$conf"; then fail "$app has an empty description"; fi
done
if grep -rq 'get-syebrs' splunk/etc/apps/*/default/app.conf 2>/dev/null; then
    fail "author typo 'get-syebrs' present"
else
    pass "no author typo"
fi

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
    # App versions track the project's major.minor.
    want_app="${PROJECT_VERSION%%-*}"
    for conf in splunk/etc/apps/*/default/app.conf; do
        [[ -f "$conf" ]] || continue
        app=$(basename "$(dirname "$(dirname "$conf")")")
        v=$(grep -m1 '^version' "$conf" | sed 's/.*=[[:space:]]*//')
        if [[ "$v" == "$want_app" ]]; then pass "$app version $v"
        else fail "$app version '$v' does not match project '$want_app'"; fi
    done
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
# MITRE CAR data model wiring.
#
# The model constrains each object on tag=car_<object>. If tags.conf does not
# produce that tag, the object is silently empty — which looks identical to
# "no data ingested yet". These assert the two halves actually meet, and that
# the model still matches MITRE's own file.
# ------------------------------------------------------------------------------
CAR_APP="splunk/etc/apps/MITRE_CAR_App"
CAR_MODEL="$CAR_APP/default/data/models/MITRE_CAR.json"
if [[ -f "$CAR_MODEL" ]]; then
    if python3 - "$CAR_MODEL" "$CAR_APP" car_data_model.json <<'PY' 2>/dev/null
import json, re, sys
model_p, app, src_p = sys.argv[1:4]
model = json.load(open(model_p))
src   = json.load(open(src_p))

# The generated model must still cover every object and field MITRE declares.
want = {o['name'][0]: set(o.get('fields', [])) for o in src['objects']}
have = {o['objectName'][4:]: {f['fieldName'] for f in o['fields']}
        for o in model['objects']}
assert set(want) == set(have), f"object drift: {set(want) ^ set(have)}"
for name, fields in want.items():
    missing = fields - have[name]
    assert not missing, f"{name} missing CAR fields: {missing}"

# Every tag the model constrains on must be produced by tags.conf.
tags = open(f"{app}/default/tags.conf").read()
produced = {m.group(1) for m in re.finditer(r'^(car_\w+)\s*=\s*enabled', tags, re.M)}
needed   = {o['constraints'][0]['search'].split('=', 1)[1] for o in model['objects']}
orphan   = produced - needed
assert not orphan, f"tags.conf produces tags no object uses: {orphan}"

# Coverage is the headline claim ("6 of 9 objects have a source"), and
# swapping which object gets tagged is structurally legal — so it would
# regress silently. Pinned: change this set deliberately when adding or
# losing a source, and update the app README's coverage table with it.
EXPECTED = {'car_flow', 'car_user_session', 'car_process',
            'car_service', 'car_registry', 'car_file'}
assert produced == EXPECTED, (
    f"CAR coverage changed: +{produced - EXPECTED} -{EXPECTED - produced}. "
    "Update EXPECTED here and the coverage table in the app README.")

# Every tagged eventtype must be declared.
ets  = {m.group(1) for m in re.finditer(r'^\[eventtype=(\w+)\]', tags, re.M)}
decl = set(re.findall(r'^\[(\w+)\]',
           open(f"{app}/default/eventtypes.conf").read(), re.M))
assert ets <= decl, f"tags.conf references undeclared eventtypes: {ets - decl}"
print(len(needed & produced))
PY
    then
        n=$(python3 -c "
import json,re,sys
m=json.load(open('$CAR_MODEL'))
t=open('$CAR_APP/default/tags.conf').read()
p={x.group(1) for x in re.finditer(r'^(car_\w+)\s*=\s*enabled',t,re.M)}
print(len(p))")
        pass "CAR model matches car_data_model.json; $n/9 objects have a source"
    else
        fail "MITRE CAR model/tags/eventtypes are inconsistent — see the app README"
    fi
    # The model is generated. A hand-edit would be silently overwritten.
    if grep -q 'Do not edit by hand' "$CAR_MODEL"; then
        pass "CAR model is marked generated"
    else
        fail "CAR model lost its generated marker"
    fi
else
    fail "MITRE CAR data model is missing"
fi

# Every app directory must have an app.conf. Splunk_TA_kape did not — it was a
# directory holding one zero-byte transforms.conf, left behind when its real
# config was migrated into Kape_App in 2025-07. It survived a year of docs
# describing it as "a stub to complete", which is work nobody needed to do.
for appdir in splunk/etc/apps/*/; do
    app=$(basename "$appdir")
    if [[ -f "$appdir/default/app.conf" ]]; then
        pass "$app has app.conf"
    else
        fail "$app has no default/app.conf — is it a real app, or a leftover?"
    fi
done

# Lookup CSVs that no lookups.conf defines are inert: they ship, they carry
# their upstream licence obligation, and Splunk cannot use them. Advisory
# rather than fatal — the current gap is tracked, not a regression.
for appdir in splunk/etc/apps/*/; do
    app=$(basename "$appdir")
    [[ -d "$appdir/lookups" ]] || continue
    n_csv=$(find "$appdir/lookups" -type f | wc -l | tr -d ' ')
    [[ "$n_csv" -gt 0 ]] || continue
    # `grep -c` prints 0 AND exits 1 on no match, so `|| echo 0` would emit "0\n0".
    n_def=$(grep -c '^\[' "$appdir/default/lookups.conf" 2>/dev/null || true)
    n_def=${n_def:-0}
    if [[ "$n_def" -ge "$n_csv" ]]; then
        pass "$app: $n_csv lookup file(s), $n_def defined"
    else
        skip "$app: $n_csv lookup file(s) but only $n_def defined in lookups.conf — the rest are inert"
    fi
done

# A zero-byte .conf contributes nothing to Splunk's config merge, so it is a
# placeholder rather than configuration. Advisory: it flags apps whose confs
# imply behaviour they do not have.
empty_confs=$(find splunk/etc/apps -name '*.conf' -type f -empty 2>/dev/null | sort)
if [[ -z "$empty_confs" ]]; then
    pass "no zero-byte .conf files in Splunk apps"
else
    while IFS= read -r c; do
        skip "zero-byte conf (does nothing in Splunk): $c"
    done <<< "$empty_confs"
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
    if ".git/" in str(md): continue
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
