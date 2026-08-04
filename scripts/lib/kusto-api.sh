#!/bin/bash
# shellcheck shell=bash
#
# Shared helpers for talking to the Kusto emulator's REST endpoints.
# Sourced by apply-kusto-schema.sh and ingest-kusto.sh — not executable.
#
# The emulator has no authentication, so there is no token handling here. That
# is a property of the emulator, not an omission: it does not support auth at
# all, which is why the deploy binds it to localhost.

KUSTO_HOST="${KUSTO_HOST:-127.0.0.1}"
KUSTO_PORT="${KUSTO_PORT:-8080}"
KUSTO_BASE="http://${KUSTO_HOST}:${KUSTO_PORT}"

# kusto_json_escape <string>
# Escape a string for embedding in a JSON document. KQL scripts contain
# quotes, backslashes and newlines, all of which must survive the trip.
kusto_json_escape() {
    python3 -c 'import json,sys; sys.stdout.write(json.dumps(sys.stdin.read()))'
}

# kusto_mgmt <database> <command>
# Run a management command. Prints the raw JSON response.
kusto_mgmt() {
    local db="$1" csl="$2" body
    body=$(printf '%s' "$csl" | kusto_json_escape)
    curl -s --max-time 300 -X POST "${KUSTO_BASE}/v1/rest/mgmt" \
        -H 'Content-Type: application/json' \
        -d "{\"db\":$(printf '%s' "$db" | kusto_json_escape),\"csl\":${body}}"
}

# kusto_query <database> <query>
kusto_query() {
    local db="$1" csl="$2" body
    body=$(printf '%s' "$csl" | kusto_json_escape)
    curl -s --max-time 300 -X POST "${KUSTO_BASE}/v1/rest/query" \
        -H 'Content-Type: application/json' \
        -d "{\"db\":$(printf '%s' "$db" | kusto_json_escape),\"csl\":${body}}"
}

# kusto_failed <response>
# The REST API returns HTTP 200 with an error document on failure, so the exit
# code of curl proves nothing. This is what actually detects a failure.
kusto_failed() {
    printf '%s' "$1" | grep -q '"OneApiErrors"\|"error"\s*:\|"@type"\s*:\s*"Kusto'
}

# kusto_error_message <response>
kusto_error_message() {
    printf '%s' "$1" | python3 -c '
import json, sys
try:
    d = json.load(sys.stdin)
except Exception:
    sys.stdout.write(sys.stdin.read()[:400]); sys.exit()
def find(o):
    if isinstance(o, dict):
        for k in ("message", "@message", "description"):
            if k in o and isinstance(o[k], str):
                return o[k]
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

# kusto_reachable
kusto_reachable() {
    curl -s --max-time 5 -X POST "${KUSTO_BASE}/v1/rest/mgmt" \
        -H 'Content-Type: application/json' \
        -d '{"csl":".show version"}' 2>/dev/null | grep -q .
}

# kusto_scalar <database> <query>
# Run a query expected to return one value, and print it bare.
kusto_scalar() {
    kusto_query "$1" "$2" | python3 -c '
import json, sys
try:
    d = json.load(sys.stdin)
except Exception:
    sys.exit(1)
# v1 query response: Tables[0].Rows[0][0]
for t in d.get("Tables", []):
    rows = t.get("Rows") or []
    if rows and rows[0]:
        print(rows[0][0]); break
' 2>/dev/null
}
