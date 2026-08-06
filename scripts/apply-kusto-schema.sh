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
# absent. That is the same class of assumption that once let the old Splunk deploy
# report success having deployed nothing.

set -o pipefail

SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"
REPO_ROOT_DIR="$(realpath "$SCRIPT_DIR/..")"
# shellcheck source=lib/kusto-api.sh
source "$SCRIPT_DIR/lib/kusto-api.sh"

SCHEMA_DIR="${SCHEMA_DIR:-$REPO_ROOT_DIR/kusto/schema}"
# Empty means "not decided" — resolved after parsing by asking the CONTAINER
# whether /kustodata is mounted, because deploy's --persist cannot propagate to
# this fresh shell and repeating the flag by hand is exactly the step people
# forget. --persist / --volatile / the env var all override detection.
KUSTO_PERSIST="${KUSTO_PERSIST:-}"
DRY_RUN=0

usage() {
    cat <<'USAGE'
Usage: apply-kusto-schema.sh [OPTIONS]

Creates the databases and applies every schema file in kusto/schema/.
Safe to re-run: existing databases are skipped and every other statement is
an idempotent .create-merge / .create-or-alter form.

  --persist        Create databases with on-disk persistence. Requires the
                   container to have /kustodata mounted (deploy-kusto.sh
                   --persist); refused otherwise, because persist() against an
                   unmounted path writes into the container's ephemeral layer —
                   it LOOKS persisted and dies with the container.
  --volatile       Force volatile databases even on a persist-capable container.
  (neither)        Ask the running container: /kustodata mounted -> persist,
                   otherwise volatile. Deploy's choice cannot propagate to this
                   fresh shell, so the container itself is the source of truth.
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
        --volatile)   KUSTO_PERSIST=0 ;;
        --dry-run)    DRY_RUN=1 ;;
        --schema-dir) [[ -n "${2:-}" ]] || { echo "❌ --schema-dir needs a PATH."; exit 1; }
                      SCHEMA_DIR="$2"; shift ;;
        -h|--help)    usage; exit 0 ;;
        *) echo "❌ Unknown option: $1"; echo "Try --help."; exit 1 ;;
    esac
    shift
done

kusto_require_tools
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

    # Resolve persist mode against the container's actual mount state.
    kusto_data_mount_state; mount_state=$?
    case "$KUSTO_PERSIST:$mount_state" in
        1:1)
            echo "❌ --persist requested but container '$KUSTO_CONTAINER' has NO"
            echo "   /kustodata mount. persist() would write into the container's"
            echo "   ephemeral layer — it would LOOK persisted and die with the"
            echo "   container. Redeploy first:  ./scripts/deploy-kusto.sh --persist"
            exit 1
            ;;
        :0) KUSTO_PERSIST=1
            echo "💾 Container persists /kustodata — creating persistent databases."
            echo "   (Override with --volatile.)" ;;
        :1) KUSTO_PERSIST=0 ;;
        :2) KUSTO_PERSIST=0
            echo "ℹ️  Cannot inspect container '$KUSTO_CONTAINER' (remote engine or"
            echo "   no docker here) — defaulting to volatile. Pass --persist if the"
            echo "   container was deployed with --persist." ;;
        0:0)
            echo "ℹ️  Container persists /kustodata but --volatile was given —"
            echo "   creating volatile databases as requested." ;;
    esac
    echo ""
fi
# Dry runs never contact the container, so undecided means volatile for display.
[[ -z "$KUSTO_PERSIST" ]] && KUSTO_PERSIST=0

# ------------------------------------------------------------------------------
# Databases. Cluster-level, so sent individually rather than as a script.
# ------------------------------------------------------------------------------
DB_FILE="$SCHEMA_DIR/00-databases.kql"
[[ -f "$DB_FILE" ]] || { echo "❌ Missing $DB_FILE"; exit 1; }

# Parse the database names out of the file rather than hardcoding them here,
# so the .kql stays the single source of truth. Names are bracket-quoted there
# (`["network"]`) because `network` is a reserved engine keyword — the plain
# name is stripped back out so existence checks and command construction below
# work with `network`, not `["network"]`. The optional-bracket regex still
# accepts the legacy bare form.
mapfile -t DATABASES < <(grep -oE '^\.create database +\[?"?[A-Za-z_][A-Za-z0-9_]*"?\]?' "$DB_FILE" \
    | sed -E 's/^\.create database +//; s/^\["?//; s/"?\]$//')
[[ ${#DATABASES[@]} -gt 0 ]] || { echo "❌ No databases declared in $DB_FILE"; exit 1; }

echo "📚 Databases: ${DATABASES[*]}"

if [[ $DRY_RUN -eq 0 ]]; then
    existing=$(kusto_mgmt "NetDefaultDB" ".show databases | project DatabaseName" 2>/dev/null)
    if kusto_failed "$existing"; then
        # "Safe to re-run" depends entirely on this probe. If it failed and we
        # carried on, every database would read as absent and the first
        # .create database against an existing one would abort the whole apply.
        echo "❌ Could not list databases: $(kusto_error_message "$existing")"
        exit 1
    fi
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
    # Bracket-quote the name in the command too: `network` is a reserved word,
    # so `.create database network ...` is rejected. The path literals in the
    # persist form take the plain name — they are string arguments, not entity
    # identifiers.
    if [[ "$KUSTO_PERSIST" == "1" ]]; then
        cmd=".create database [\"$db\"] persist (@\"/kustodata/dbs/$db/md\", @\"/kustodata/dbs/$db/data\")"
    else
        cmd=".create database [\"$db\"] volatile"
    fi
    resp=$(kusto_mgmt "NetDefaultDB" "$cmd")
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

# Assert, do not merely print. This block previously computed these counts and
# discarded them, so a database whose script half-applied showed tables=0 and
# the script still reported success.
for db in "${DATABASES[@]}"; do
    n=$(kusto_scalar "$db" ".show tables | count")
    f=$(kusto_scalar "$db" ".show functions | count")
    printf '   %-8s tables=%-4s functions=%s\n' "$db" "${n:-?}" "${f:-?}"
    # `misc` is declared for uncategorised sources but has no schema file yet.
    [[ "$db" == "misc" ]] && continue
    if ! [[ "${n:-x}" =~ ^[0-9]+$ ]]; then
        echo "      ❌ could not read a table count for '$db'"; fail=1; continue
    fi
    if [[ "$n" -eq 0 && "$db" != "mitre" ]]; then
        echo "      ❌ '$db' has no tables — its schema did not apply"; fail=1
    fi
done

# The CAR layer is the point of the whole port. The expected count is DERIVED
# from the schema, not hardcoded: a literal threshold silently stops matching
# the moment an object is added, and the original `-ge 6` passed with only 6 of
# the 7 Car* functions present.
expected_car=$(grep -cE '^Car[A-Za-z]+\(\)' "$SCHEMA_DIR/40-mitre.kql" 2>/dev/null || echo 0)
car=$(kusto_scalar "mitre" ".show functions | where Name startswith 'Car' | count")
if ! [[ "${car:-x}" =~ ^[0-9]+$ ]]; then
    echo "   ❌ Could not read the CAR function count from 'mitre'."
    fail=1
elif [[ "$car" -eq "$expected_car" ]]; then
    echo "   ✅ CAR functions present ($car/$expected_car)"
else
    echo "   ❌ Expected $expected_car Car* functions in 'mitre', found $car"
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
