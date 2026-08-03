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
# scripts/v2 shipped four scripts computing $SCRIPT_DIR/.. while living one
# directory deeper, so they resolved the repo root to <repo>/scripts. Every
# script that computes REPO_ROOT_DIR must land on the real repo root.
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
    for f in ansible/playbooks/Include-Custom-Apps.yml \
             ansible/playbooks/Include-local-conf.yml \
             ansible/playbooks/remove_first_login.yml; do
        [[ -f "$f" ]] || continue
        cp "$f" "$tmp/tasks/main.yml"
        if (cd "$tmp" && ansible-lint tasks/main.yml >/dev/null 2>&1); then pass "$f (lint)"
        else fail "ansible-lint failures in $f"; fi
    done
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
