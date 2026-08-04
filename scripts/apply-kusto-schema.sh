#!/bin/bash
#
# Stage 2 of the Kusto port — create the databases, tables, ingestion mappings
# and CAR functions. See docs/Kusto-Port.md.
#
# Safe to re-run. Every statement in kusto/schema/*.kql uses an idempotent form
# (.create-merge, .create-or-alter) because `.execute database script` is
# "sequential, but non-transactional, and no rollback is performed upon error" —
# so a schema that half-applies must converge on the next run rather than wedge.
#
# The one command that is NOT idempotent is `.create database`, which fails if
# it already exists (and, in persist mode, fails if the target folders exist).
# Existing databases are therefore detected and skipped rather than assumed
# absent. That is the same class of assumption that once let deploy-splunk.sh
# report success having deployed nothing.

set -o pipefail

SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"
REPO_ROOT_DIR="$(realpath "$SCRIPT_DIR/..")"
# shellcheck source=lib/kusto-api.sh
source "$SCRIPT_DIR/lib/kusto-api.sh"

SCHEMA_DIR="${SCHEMA_DIR:-$REPO_ROOT_DIR/kusto/schema}"
KUSTO_PERSIST="${KUSTO_PERSIST:-0}"
DRY_RUN=0

usage() {
    cat <<'USAGE'
Usage: apply-kusto-schema.sh [OPTIONS]

Creates the databases and applies every schema file in kusto/schema/.
Safe to re-run: existing databases are skipped and every other statement is
an idempotent .create-merge / .create-or-alter form.

  --persist        Create databases with on-disk persistence rather than
                   volatile. Only meaningful if deploy-kusto.sh was run with
                   --persist too, and Microsoft advises against it.
  --dry-run        Print what would be sent; contact nothing.
  --schema-dir D   Where the .kql files live.  (default kusto/schema)
  -h, --help       Show this and exit.

Environment:
  KUSTO_HOST       default 127.0.0.1
  KUSTO_PORT       default 8080
USAGE
}

while [[ $# -gt 0 ]]; do
    case "$1" in
        --persist)    KUSTO_PERSIST=1 ;;
        --dry-run)    DRY_RUN=1 ;;
        --schema-dir) [[ -n "${2:-}" ]] || { echo "❌ --schema-dir needs a PATH."; exit 1; }
                      SCHEMA_DIR="$2"; shift ;;
        -h|--help)    usage; exit 0 ;;
        *) echo "❌ Unknown option: $1"; echo "Try --help."; exit 1 ;;
    esac
    shift
done

[[ -d "$SCHEMA_DIR" ]] || { echo "❌ No schema directory at $SCHEMA_DIR"; exit 1; }

echo ""
echo "🧊 Applying Kusto schema"
echo "─────────────────────────────────────────────────────────────"
echo "   Endpoint: $KUSTO_BASE"
echo "   Schema:   $SCHEMA_DIR"
echo ""

if [[ $DRY_RUN -eq 0 ]]; then
    if ! kusto_reachable; then
        echo "❌ Nothing answering at $KUSTO_BASE."
        echo "   Deploy first:  ./scripts/deploy-kusto.sh"
        exit 1
    fi
    echo "   ✅ Engine reachable."
    echo ""
fi

# ------------------------------------------------------------------------------
# Databases. Cluster-level, so sent individually rather than as a script.
# ------------------------------------------------------------------------------
DB_FILE="$SCHEMA_DIR/00-databases.kql"
[[ -f "$DB_FILE" ]] || { echo "❌ Missing $DB_FILE"; exit 1; }

# Parse the database names out of the file rather than hardcoding them here,
# so the .kql stays the single source of truth.
mapfile -t DATABASES < <(grep -oE '^\.create database [A-Za-z_][A-Za-z0-9_]*' "$DB_FILE" | awk '{print $3}')
[[ ${#DATABASES[@]} -gt 0 ]] || { echo "❌ No databases declared in $DB_FILE"; exit 1; }

echo "📚 Databases: ${DATABASES[*]}"

if [[ $DRY_RUN -eq 0 ]]; then
    existing=$(kusto_mgmt "" ".show databases | project DatabaseName" 2>/dev/null)
fi

for db in "${DATABASES[@]}"; do
    if [[ $DRY_RUN -eq 1 ]]; then
        echo "   would create: $db"
        continue
    fi
    if printf '%s' "$existing" | grep -q "\"$db\""; then
        echo "   ⏭️  $db already exists — skipping creation"
        continue
    fi
    if [[ "$KUSTO_PERSIST" == "1" ]]; then
        cmd=".create database $db persist (@\"/kustodata/dbs/$db/md\", @\"/kustodata/dbs/$db/data\")"
    else
        cmd=".create database $db volatile"
    fi
    resp=$(kusto_mgmt "" "$cmd")
    if kusto_failed "$resp"; then
        echo "   ❌ $db: $(kusto_error_message "$resp")"
        if [[ "$KUSTO_PERSIST" == "1" ]]; then
            echo "      In persist mode this usually means /kustodata/dbs/$db already"
            echo "      exists. .create database refuses a non-empty target."
        fi
        exit 1
    fi
    echo "   ✅ created $db"
done
echo ""

# ------------------------------------------------------------------------------
# Schema files. Each 10-*.kql .. 90-*.kql maps to the database named in it.
# ------------------------------------------------------------------------------
shopt -s nullglob
applied=0
for f in "$SCHEMA_DIR"/[1-9]*.kql; do
    base="$(basename "$f")"
    # `// Database: <name>` on any line names the target.
    db=$(grep -m1 -oE '^// Database:[[:space:]]*[A-Za-z_][A-Za-z0-9_]*' "$f" | awk '{print $3}')
    if [[ -z "$db" ]]; then
        echo "   ⚠️  $base has no '// Database: <name>' header — skipped"
        continue
    fi
    echo "📄 $base -> database '$db'"

    if [[ $DRY_RUN -eq 1 ]]; then
        echo "   would apply $(grep -c '^\.' "$f") statements"
        applied=$((applied + 1))
        continue
    fi

    script_body=$(cat "$f")
    resp=$(kusto_mgmt "$db" ".execute database script <|
$script_body")
    if kusto_failed "$resp"; then
        echo "   ❌ $(kusto_error_message "$resp")"
        echo ""
        echo "   .execute database script is NOT transactional — earlier statements"
        echo "   in this file may have applied. Every statement is an idempotent"
        echo "   form, so fix the error and re-run; it will converge."
        exit 1
    fi
    echo "   ✅ applied"
    applied=$((applied + 1))
done
shopt -u nullglob

[[ $applied -gt 0 ]] || { echo "❌ No schema files found in $SCHEMA_DIR"; exit 1; }

echo ""
if [[ $DRY_RUN -eq 1 ]]; then
    echo "🔍 Dry run — nothing was sent."
    exit 0
fi

# ------------------------------------------------------------------------------
# Prove it. Creating a table and having it be queryable are different claims.
# ------------------------------------------------------------------------------
echo "🔎 Verifying..."
fail=0
for db in "${DATABASES[@]}"; do
    n=$(kusto_scalar "$db" ".show tables | count")
    f=$(kusto_scalar "$db" ".show functions | count")
    printf '   %-8s tables=%-4s functions=%s\n' "$db" "${n:-?}" "${f:-?}"
done

# The CAR layer is the point of the whole port; if it did not land, say so.
car=$(kusto_scalar "mitre" ".show functions | where Name startswith 'Car' | count")
if [[ "${car:-0}" -ge 6 ]]; then
    echo "   ✅ CAR functions present ($car)"
else
    echo "   ❌ Expected at least 6 Car* functions in 'mitre', found ${car:-0}"
    fail=1
fi

echo ""
if [[ $fail -eq 0 ]]; then
    echo "✅ Schema applied."
    echo "   Next:  ./scripts/ingest-kusto.sh"
else
    echo "❌ Schema applied with problems — see above."
    exit 1
fi
echo "─────────────────────────────────────────────────────────────"
