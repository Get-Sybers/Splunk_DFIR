#!/bin/bash
#
# Stage 3 of the Kusto port — load data_store/processed into the emulator.
#
# This replaces Splunk's inputs.conf monitor stanzas. There is no monitoring:
# the emulator has no managed ingestion pipeline and no streaming ingestion, so
# loading is an explicit batch step you run after processing evidence.
#
# That is not a downgrade for dead-box work. Re-ingest is cheap and
# deterministic, which is exactly why the deploy defaults to an ephemeral
# database rather than persisting one — see docs/Kusto-Port.md.
#
# ⚠️ ZEEK STAGING
#    zeek-cut emits TSV with '#'-prefixed header lines (#separator, #fields,
#    #types ...). Kusto's CSV/TSV ingestion has no property to skip them, so
#    they would land as junk rows. Each Zeek log is therefore staged through a
#    temp copy with those lines stripped. The '#fields' line is read first and
#    kept, because it is the only record of what the columns were.

set -o pipefail

SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"
REPO_ROOT_DIR="$(realpath "$SCRIPT_DIR/..")"
# shellcheck source=lib/kusto-api.sh
source "$SCRIPT_DIR/lib/kusto-api.sh"

PROCESSED_DIR="${PROCESSED_DIR:-$REPO_ROOT_DIR/data_store/processed}"
STAGING_DIR="${STAGING_DIR:-$REPO_ROOT_DIR/data_store/kusto-staging}"
DRY_RUN=0
ONLY=""

usage() {
    cat <<'USAGE'
Usage: ingest-kusto.sh [OPTIONS]

Loads data_store/processed into the Kusto emulator. Run after processing
evidence, and again after any redeploy — the database is ephemeral by default.

  --only SOURCE    Ingest one source only:
                   l2t | zeek | evtx | kape | velociraptor | rekall
  --dry-run        List what would be ingested; contact nothing.
  -h, --help       Show this and exit.

Environment:
  PROCESSED_DIR    default data_store/processed
  KUSTO_HOST       default 127.0.0.1
  KUSTO_PORT       default 8080

Ingestion is additive. Re-running loads the same files again and duplicates
rows — there is no fishbucket. To start clean, redeploy (the default database
is ephemeral) or drop the table.
USAGE
}

while [[ $# -gt 0 ]]; do
    case "$1" in
        --only)    [[ -n "${2:-}" ]] || { echo "❌ --only needs a SOURCE."; exit 1; }
                   ONLY="$2"; shift ;;
        --dry-run) DRY_RUN=1 ;;
        -h|--help) usage; exit 0 ;;
        *) echo "❌ Unknown option: $1"; echo "Try --help."; exit 1 ;;
    esac
    shift
done

case "$ONLY" in
    ""|l2t|zeek|evtx|kape|velociraptor|rekall) ;;
    *) echo "❌ --only must be one of: l2t zeek evtx kape velociraptor rekall"; exit 1 ;;
esac

want() { [[ -z "$ONLY" || "$ONLY" == "$1" ]]; }

echo ""
echo "🧊 Ingesting into Kusto"
echo "─────────────────────────────────────────────────────────────"
echo "   Endpoint:  $KUSTO_BASE"
echo "   Processed: $PROCESSED_DIR"
echo ""

[[ -d "$PROCESSED_DIR" ]] || { echo "❌ No processed directory at $PROCESSED_DIR"; exit 1; }

if [[ $DRY_RUN -eq 0 ]] && ! kusto_reachable; then
    echo "❌ Nothing answering at $KUSTO_BASE."
    echo "   Deploy first:  ./scripts/deploy-kusto.sh"
    exit 1
fi

TOTAL_FILES=0
TOTAL_FAILED=0

# ingest_files <db> <table> <mapping|-> <format> <file...>
#
# One .ingest into carries multiple locators — "a single connection string
# refers to one file", so several files means several locators in one command.
# Batched at 50 to keep the command a sane length.
ingest_files() {
    local db="$1" table="$2" mapping="$3" fmt="$4"; shift 4
    local files=("$@")
    [[ ${#files[@]} -gt 0 ]] || return 0

    local batch=() locators cmd resp i=0
    for f in "${files[@]}"; do
        batch+=("$f")
        i=$((i + 1))
        if [[ ${#batch[@]} -ge 50 || $i -eq ${#files[@]} ]]; then
            locators=""
            for b in "${batch[@]}"; do
                [[ -n "$locators" ]] && locators+=", "
                locators+="@\"$b\""
            done
            cmd=".ingest into table $table ($locators) with (format=\"$fmt\""
            [[ "$mapping" != "-" ]] && cmd+=", ingestionMappingReference=\"$mapping\""
            cmd+=")"

            if [[ $DRY_RUN -eq 1 ]]; then
                echo "      would ingest ${#batch[@]} file(s) -> $db.$table"
            else
                resp=$(kusto_mgmt "$db" "$cmd")
                if kusto_failed "$resp"; then
                    echo "      ❌ $(kusto_error_message "$resp")"
                    TOTAL_FAILED=$((TOTAL_FAILED + ${#batch[@]}))
                else
                    echo "      ✅ ${#batch[@]} file(s) -> $db.$table"
                fi
            fi
            TOTAL_FILES=$((TOTAL_FILES + ${#batch[@]}))
            batch=()
        fi
    done
}

# The emulator reads files from ITS filesystem, not the host's. deploy-kusto.sh
# does not mount data_store, so files are copied in. This is the one place the
# design pays for the container boundary.
push_to_container() {
    local src="$1" dest="$2"
    docker cp "$src" "${KUSTO_CONTAINER:-kusto-emulator}:$dest" >/dev/null 2>&1
}

CONTAINER_STAGE="/tmp/dfir-ingest"
if [[ $DRY_RUN -eq 0 ]]; then
    docker exec "${KUSTO_CONTAINER:-kusto-emulator}" mkdir -p "$CONTAINER_STAGE" >/dev/null 2>&1 || {
        echo "❌ Could not reach container '${KUSTO_CONTAINER:-kusto-emulator}'."
        echo "   Is it running?  docker ps"
        exit 1
    }
fi

# ------------------------------------------------------------------------------
# Plaso — CSV, fixed 23-column schema
# ------------------------------------------------------------------------------
if want l2t; then
    echo "📄 Plaso (l2t:csv -> host.L2tCsv)"
    mapfile -t files < <(find "$PROCESSED_DIR/log2timeline/csv" -name '*.csv' -type f 2>/dev/null | sort)
    if [[ ${#files[@]} -eq 0 ]]; then
        echo "      (none)"
    else
        remote=()
        for f in "${files[@]}"; do
            r="$CONTAINER_STAGE/$(basename "$f")"
            [[ $DRY_RUN -eq 0 ]] && push_to_container "$f" "$r"
            remote+=("$r")
        done
        # psteal writes a header row; ignoreFirstRecord drops it.
        ingest_files host L2tCsv L2tCsvMapping csv "${remote[@]}"
    fi
fi

# ------------------------------------------------------------------------------
# EvtxECmd — line-delimited JSON
# ------------------------------------------------------------------------------
if want evtx; then
    echo "📄 EvtxECmd (evtxecmd:json -> host.EvtxEcmdJson)"
    mapfile -t files < <(find "$PROCESSED_DIR/windows_logs" -name '*_EvtxECmd_Output.json' -type f 2>/dev/null | sort)
    if [[ ${#files[@]} -eq 0 ]]; then
        echo "      (none)"
    else
        remote=()
        for f in "${files[@]}"; do
            r="$CONTAINER_STAGE/$(basename "$f")"
            [[ $DRY_RUN -eq 0 ]] && push_to_container "$f" "$r"
            remote+=("$r")
        done
        ingest_files host EvtxEcmdJson EvtxEcmdJsonMapping multijson "${remote[@]}"
    fi
fi

# ------------------------------------------------------------------------------
# Zeek — TSV, '#' header lines stripped into a staging copy
# ------------------------------------------------------------------------------
if want zeek; then
    echo "📄 Zeek (-> network.ZeekConn / network.Zeek)"
    mapfile -t files < <(find "$PROCESSED_DIR/zeek" -name '*.log' -type f 2>/dev/null | sort)
    if [[ ${#files[@]} -eq 0 ]]; then
        echo "      (none)"
    else
        [[ $DRY_RUN -eq 0 ]] && mkdir -p "$STAGING_DIR"
        conn_remote=()

        # ZeekConnMapping maps by ORDINAL, so it is only correct if conn.log's
        # columns are in the order the mapping assumes. Zeek's field order is
        # stable in practice, but a different version or a site script can
        # change it — and a silent shift would load destination IPs into the
        # source column. On forensic data that is not a cosmetic bug, so the
        # '#fields' header is checked before anything is ingested.
        ZEEK_CONN_EXPECTED="ts uid id.orig_h id.orig_p id.resp_h id.resp_p proto"
        zeek_fields_ok() {
            local log="$1" line actual
            line=$(grep -m1 '^#fields' "$log" 2>/dev/null) || return 0   # no header, cannot check
            [[ -n "$line" ]] || return 0
            # First 7 fields are the ones CAR depends on; the tail varies more.
            actual=$(printf '%s' "$line" | cut -f2-8 | tr '\t' ' ')
            [[ "$actual" == "$ZEEK_CONN_EXPECTED" ]]
        }

        for f in "${files[@]}"; do
            logtype="$(basename "$f" .log)"
            if [[ "$logtype" == "conn" ]] && ! zeek_fields_ok "$f"; then
                echo "      ❌ $f"
                echo "         conn.log column order does not match ZeekConnMapping."
                echo "         Expected first 7: $ZEEK_CONN_EXPECTED"
                echo "         Found:            $(grep -m1 '^#fields' "$f" | cut -f2-8 | tr '\t' ' ')"
                echo "         Refusing to ingest — an ordinal mapping against a"
                echo "         reordered file would put addresses in the wrong columns."
                TOTAL_FAILED=$((TOTAL_FAILED + 1))
                continue
            fi
            staged="$STAGING_DIR/$(echo "${f#"$PROCESSED_DIR"/}" | tr '/' '_')"
            if [[ $DRY_RUN -eq 0 ]]; then
                # Strip Zeek's '#' header lines. Kusto cannot skip them and
                # they would otherwise be ingested as data rows.
                grep -v '^#' "$f" > "$staged" 2>/dev/null || true
                [[ -s "$staged" ]] || { rm -f "$staged"; continue; }
            fi
            if [[ "$logtype" == "conn" ]]; then
                r="$CONTAINER_STAGE/$(basename "$staged")"
                [[ $DRY_RUN -eq 0 ]] && push_to_container "$staged" "$r"
                conn_remote+=("$r")
            fi
        done
        if [[ ${#conn_remote[@]} -gt 0 || $DRY_RUN -eq 1 ]]; then
            ingest_files network ZeekConn ZeekConnMapping tsv "${conn_remote[@]}"
        fi
        non_conn=$(printf '%s\n' "${files[@]}" | grep -cv '/conn\.log$' || true)
        if [[ "${non_conn:-0}" -gt 0 ]]; then
            echo "      ℹ️  ${non_conn} non-conn Zeek log(s) not ingested."
            echo "         Only conn.log is typed — it is the one CAR needs."
            echo "         The generic Zeek table exists; wiring the other 68"
            echo "         log types is deliberately left undone."
        fi
        [[ $DRY_RUN -eq 0 ]] && rm -rf "${STAGING_DIR:?}"
    fi
fi

# ------------------------------------------------------------------------------
# KAPE / Velociraptor / Rekall — semi-structured
#
# Not wired up. Their tables and mappings exist, but Artefact/Plugin has to be
# derived from the source path per file, which means a per-file ingest with an
# extra column — and the .ingest command cannot inject a constant. Doing it
# properly needs either an ingest-time property or a post-ingest update, and
# guessing at that without a running emulator to test against is how the
# --internal bug happened.
# ------------------------------------------------------------------------------
for src in kape velociraptor rekall; do
    if want "$src"; then
        echo "📄 ${src} — NOT IMPLEMENTED"
        echo "      Tables and mappings exist; the loader does not."
        echo "      See docs/Kusto-Port.md, 'What is not done'."
    fi
done

if [[ $DRY_RUN -eq 0 ]]; then
    docker exec "${KUSTO_CONTAINER:-kusto-emulator}" rm -rf "$CONTAINER_STAGE" >/dev/null 2>&1 || true
fi

echo ""
echo "─────────────────────────────────────────────────────────────"
if [[ $DRY_RUN -eq 1 ]]; then
    echo "🔍 Dry run — nothing was sent. $TOTAL_FILES file(s) would be ingested."
    exit 0
fi

echo "📊 $TOTAL_FILES file(s) submitted, $TOTAL_FAILED failed."
echo ""
echo "   Check what landed:"
echo "     CarCoverage() in the 'mitre' database"
echo ""
if [[ $TOTAL_FAILED -gt 0 ]]; then
    echo "❌ Some ingestion failed — see above."
    exit 1
fi
echo "✅ Done."
