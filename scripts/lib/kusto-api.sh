#!/bin/bash
# shellcheck shell=bash
#
# Shared helpers for talking to the Kusto emulator's REST endpoints.
# Sourced by deploy-kusto.sh, apply-kusto-schema.sh and ingest-kusto.sh.
#
# The emulator has no authentication, so there is no token handling here. That
# is a property of the emulator, not an omission — it does not support auth at
# all, which is why the deploy binds it to localhost.
#
# ENDPOINT SPLIT — this is not cosmetic. Kusto routes by request type:
#   /v1/rest/mgmt   control commands: anything starting with '.'
#   /v1/rest/query  KQL queries
# Sending `.show tables` to the query endpoint is rejected. The first version
# of this library got that wrong in kusto_scalar, which made a completely
# successful schema apply report failure and exit 1 every time.

KUSTO_HOST="${KUSTO_HOST:-127.0.0.1}"
KUSTO_PORT="${KUSTO_PORT:-8080}"
KUSTO_BASE="http://${KUSTO_HOST}:${KUSTO_PORT}"
KUSTO_CONTAINER="${KUSTO_CONTAINER:-kusto-emulator}"

# --- small shared conveniences ------------------------------------------------

kusto_die() { echo "❌ $*" >&2; exit 1; }

# kusto_need_value <flag> <value>
kusto_need_value() {
    [[ -n "${2:-}" ]] || kusto_die "$1 needs a value."
}

kusto_require_tools() {
    command -v curl >/dev/null 2>&1 || kusto_die "curl not found on PATH."
    command -v python3 >/dev/null 2>&1 || kusto_die "python3 not found on PATH."
}

# --- request plumbing ---------------------------------------------------------

# kusto_json_escape — escape stdin for embedding in a JSON document. KQL
# scripts contain quotes, backslashes and newlines, all of which must survive.
kusto_json_escape() {
    python3 -c 'import json,sys; sys.stdout.write(json.dumps(sys.stdin.read()))'
}

_kusto_post() {
    local path="$1" db="$2" csl="$3" body db_json
    body=$(printf '%s' "$csl" | kusto_json_escape) || return 1
    db_json=$(printf '%s' "$db" | kusto_json_escape) || return 1
    curl -s --max-time 600 -X POST "${KUSTO_BASE}${path}" \
        -H 'Content-Type: application/json' \
        -d "{\"db\":${db_json},\"csl\":${body}}"
}

# kusto_mgmt <database> <command>   — control commands (leading '.')
kusto_mgmt()  { _kusto_post /v1/rest/mgmt  "$1" "$2"; }
# kusto_query <database> <query>    — KQL queries
kusto_query() { _kusto_post /v1/rest/query "$1" "$2"; }

# --- failure detection --------------------------------------------------------
#
# Kusto returns HTTP 200 with an error document on failure, so curl's exit code
# proves nothing. Three distinct things must count as failure:
#
#   1. an error envelope        {"error": ...} / OneApiErrors / Kusto.*Exception
#   2. NO response at all       connection refused, OOM-killed container, timeout
#   3. a response that is not Kusto JSON at all   (something else on the port)
#
# (2) and (3) were both missing originally, so a container that died mid-run
# reported every remaining step as a success.
#
# It also has to catch failures reported as DATA rather than as an envelope:
# `.execute database script` is non-transactional with ThrowOnErrors=false, so
# a failing statement comes back in a normal result table with Result="Failed".

# kusto_failed <response>
kusto_failed() {
    local resp="$1"
    [[ -z "${resp//[[:space:]]/}" ]] && return 0          # no response = failure
    printf '%s' "$resp" | python3 -c '
import json, sys
raw = sys.stdin.read()
try:
    d = json.loads(raw)
except Exception:
    sys.exit(0)                      # not JSON at all -> failure
def walk(o):
    if isinstance(o, dict):
        for k, v in o.items():
            if k in ("error", "OneApiErrors", "Errors"):
                return True
            if k in ("@type",) and isinstance(v, str) and v.startswith("Kusto"):
                return True
            # .execute database script / .ingest report per-row status
            if k in ("Result", "Status") and isinstance(v, str) and v.lower() in ("failed", "error"):
                return True
            if k == "HasErrors" and v in (True, "true", "True"):
                return True
            if walk(v):
                return True
    elif isinstance(o, list):
        # A v1 result table is {"Tables":[{"Columns":[...],"Rows":[[...]]}]}.
        # Row values are positional, so check them against their column names.
        for v in o:
            if walk(v):
                return True
    return False
def tables(d):
    for t in d.get("Tables", []) if isinstance(d, dict) else []:
        cols = [c.get("ColumnName") for c in t.get("Columns", [])]
        for row in t.get("Rows", []) or []:
            for name, val in zip(cols, row):
                if name in ("Result", "Status") and isinstance(val, str) \
                   and val.lower() in ("failed", "error"):
                    return True
                if name == "HasErrors" and val in (True, "true", "True"):
                    return True
    return False
sys.exit(0 if (walk(d) or tables(d)) else 1)
' 2>/dev/null
}

# kusto_error_message <response>
kusto_error_message() {
    printf '%s' "$1" | python3 -c '
import json, sys
raw = sys.stdin.read()          # read ONCE — the original re-read after json.load
try:
    d = json.loads(raw)
except Exception:
    sys.stdout.write((raw.strip() or "(empty response — engine unreachable?)")[:400])
    sys.exit()
def find(o):
    if isinstance(o, dict):
        for k in ("message", "@message", "Reason", "description"):
            v = o.get(k)
            if isinstance(v, str) and v:
                return v
        for v in o.values():
            r = find(v)
            if r: return r
    elif isinstance(o, list):
        for v in o:
            r = find(v)
            if r: return r
    return None
sys.stdout.write(find(d) or json.dumps(d)[:400])
' 2>/dev/null
}

# kusto_reachable — is the ENGINE up, or just something on the port?
#
# Originally `grep -q .`, which accepts a 404 page, a proxy block page or a
# Jupyter server as proof that Kusto is running. It now requires a response
# that is actually Kusto's.
kusto_reachable() {
    local resp
    resp=$(kusto_mgmt "NetDefaultDB" ".show version" 2>/dev/null)
    kusto_failed "$resp" && return 1
    printf '%s' "$resp" | grep -q '"Tables"\|"Rows"'
}

# kusto_scalar <database> <command-or-query>
#
# Routes by leading '.' so callers cannot get the endpoint wrong.
kusto_scalar() {
    local db="$1" csl="$2" resp
    if [[ "$csl" == .* ]]; then
        resp=$(kusto_mgmt "$db" "$csl")
    else
        resp=$(kusto_query "$db" "$csl")
    fi
    kusto_failed "$resp" && return 1
    printf '%s' "$resp" | python3 -c '
import json, sys
try:
    d = json.load(sys.stdin)
except Exception:
    sys.exit(1)
# v1 shape: the PRIMARY result is Tables[0]. Do not fall through to later
# tables (QueryProperties etc.) when the primary result is legitimately empty.
ts = d.get("Tables") or []
if not ts:
    sys.exit(1)
rows = ts[0].get("Rows") or []
if not rows or not rows[0]:
    sys.exit(1)
print(rows[0][0])
' 2>/dev/null
}
