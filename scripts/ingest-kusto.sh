#!/bin/bash
#
# Stage 3 of the Kusto port — load data_store/processed into the emulator.
#
# This is the loading step — there is no file monitoring:
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
#    temp copy with those lines stripped. The '#fields' line is read first to
#    verify the column order matches the ordinal mapping, then discarded.

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
                   l2t | zeek | evtx | volatility | velociraptor | rekall
  --dry-run        List what would be ingested; contact nothing.
  -h, --help       Show this and exit.

Environment:
  PROCESSED_DIR    default data_store/processed
  KUSTO_HOST       default 127.0.0.1
  KUSTO_PORT       default 8080
  KUSTO_CONTAINER  default kusto-emulator (files are docker-cp'd into it)

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
    ""|l2t|zeek|evtx|volatility|velociraptor|rekall) ;;
    *) echo "❌ --only must be one of: l2t zeek evtx volatility velociraptor rekall"; exit 1 ;;
esac

want() { [[ -z "$ONLY" || "$ONLY" == "$1" ]]; }

echo ""
echo "🧊 Ingesting into Kusto"
echo "─────────────────────────────────────────────────────────────"
echo "   Endpoint:  $KUSTO_BASE"
echo "   Processed: $PROCESSED_DIR"
echo ""

kusto_require_tools
[[ -d "$PROCESSED_DIR" ]] || { echo "❌ No processed directory at $PROCESSED_DIR"; exit 1; }

if [[ $DRY_RUN -eq 0 ]] && ! kusto_reachable; then
    echo "❌ Nothing answering at $KUSTO_BASE."
    echo "   Deploy first:  ./scripts/deploy-kusto.sh"
    exit 1
fi

TOTAL_FILES=0
TOTAL_FAILED=0

# ingest_files <db> <table> <mapping|-> <format> <ignore_header 0|1> <file...>
#
# One .ingest into carries multiple locators — "a single connection string
# refers to one file", so several files means several locators in one command.
# Batched at 50 to keep the command a sane length.
ingest_files() {
    local db="$1" table="$2" mapping="$3" fmt="$4" ignore_header="$5"; shift 5
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
            [[ "$ignore_header" == "1" ]] && cmd+=", ignoreFirstRecord=true"
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
#
# push_to_container FAILS LOUDLY. Originally it discarded docker cp's status,
# so a failed copy still had its path added to the ingest command — reported as
# a successful ingest of a file that was not there.
push_to_container() {
    local src="$1" dest="$2"
    docker cp "$src" "${KUSTO_CONTAINER}:$dest" >/dev/null 2>&1
}

# staged_name <file>
#
# The container stage is flat, so the name must encode the whole relative path.
# Using bare basename LOSES EVIDENCE: process-evtx-EvtxECmd.sh writes one
# "<channel>_EvtxECmd_Output.json" per host directory, so three hosts all
# produce "Security_EvtxECmd_Output.json". Copying them by basename means the
# last one wins, the earlier hosts are never ingested, and the survivor is
# ingested once per collision — while the script reports success.
#
# The name is also SANITISED to [A-Za-z0-9._-]. Staged names are spliced into
# KQL as @"..." verbatim strings, where an embedded double-quote terminates the
# literal — and host directories are operator-named, so a path like
# WinEvt/WKS"1/ would otherwise break (or worse, reshape) the ingest command.
# Sanitising can collide ("a b" and "a_b" both become "a_b"), so an 8-char hash
# of the original path is prefixed: uniqueness comes from the hash, safety from
# the charset.
staged_name() {
    local rel="${1#"$PROCESSED_DIR"/}" safe hash
    safe=$(printf '%s' "$rel" | tr -c 'A-Za-z0-9._-' '_')
    hash=$(printf '%s' "$rel" | sha1sum | cut -c1-8)
    printf '%s_%s' "$hash" "$safe"
}

# stage_and_collect <array-name> <file...>
# Copies each file into the container under a collision-free name and appends
# the container path to the named array. Returns non-zero if any copy failed.
stage_and_collect() {
    local -n _out="$1"; shift
    local f r rc=0
    for f in "$@"; do
        r="$CONTAINER_STAGE/$(staged_name "$f")"
        if [[ $DRY_RUN -eq 0 ]]; then
            if ! push_to_container "$f" "$r"; then
                echo "      ❌ could not copy into the container: $f"
                TOTAL_FAILED=$((TOTAL_FAILED + 1))
                rc=1
                continue
            fi
        fi
        _out+=("$r")
    done
    return $rc
}

CONTAINER_STAGE="/tmp/dfir-ingest"

# Both staging areas hold full copies of the evidence. Without a trap, Ctrl-C
# during a multi-GB ingest leaves them behind — silently doubling the on-disk
# footprint, and inside an ephemeral container where nobody thinks to look.
cleanup_staging() {
    [[ $DRY_RUN -eq 1 ]] && return 0
    rm -rf "${STAGING_DIR:?}" 2>/dev/null || true
    docker exec "$KUSTO_CONTAINER" rm -rf "$CONTAINER_STAGE" >/dev/null 2>&1 || true
}
# EXIT alone is not enough, and INT/TERM alone is wrong in a different way: a
# trap handler that does not exit lets bash RESUME the script after Ctrl-C —
# with the staging directories now deleted, every later copy fails confusingly.
# So INT/TERM clean up and then actually exit (130 = interrupted).
trap cleanup_staging EXIT
trap 'cleanup_staging; trap - EXIT; exit 130' INT TERM

if [[ $DRY_RUN -eq 0 ]]; then
    docker exec "$KUSTO_CONTAINER" mkdir -p "$CONTAINER_STAGE" >/dev/null 2>&1 || {
        echo "❌ Could not reach container '$KUSTO_CONTAINER'."
        echo "   Is it running?  docker ps"
        exit 1
    }
fi

# ------------------------------------------------------------------------------
# Zeek hooks — the one source whose files cannot be staged as-is.
# ------------------------------------------------------------------------------

# ZeekConnMapping maps by ORDINAL, so it is only correct if conn.log's columns
# are in the order the mapping assumes. Zeek's field order is stable in
# practice, but a different version or a site script can change it — and a
# silent shift would load destination IPs into the source column. On forensic
# data that is not a cosmetic bug, so the '#fields' header is checked before
# anything is ingested.
ZEEK_CONN_EXPECTED="ts uid id.orig_h id.orig_p id.resp_h id.resp_p proto"
# FAILS CLOSED. Originally `|| return 0` — no header meant "verified", which is
# backwards: a file with no #fields is exactly the case where the ordinal
# mapping cannot be checked, so ingesting it is the risk the guard exists to
# prevent.
zeek_fields_ok() {
    local log="$1" line actual
    line=$(grep -m1 '^#fields' "$log" 2>/dev/null)
    [[ -n "$line" ]] || return 1
    # First 7 fields are the ones CAR depends on; the tail varies more.
    actual=$(printf '%s' "$line" | cut -f2-8 | tr '\t' ' ')
    [[ "$actual" == "$ZEEK_CONN_EXPECTED" ]]
}

# prepare hook: stdout is the HOST PATH to stage (captured by the driver), so
# all diagnostics go to stderr. Return 1 to skip the file quietly, 2 to refuse
# it (the driver counts that as a failure).
zeek_prepare() {
    local f="$1" staged
    # Only conn.log is typed and ingested. Staging the other 68 log types read
    # and rewrote every byte of them for nothing — on a large capture that is
    # tens of GB of pointless I/O and transient disk.
    [[ "$(basename "$f" .log)" == "conn" ]] || return 1
    if ! zeek_fields_ok "$f"; then
        {
            echo "      ❌ $f"
            echo "         conn.log column order does not match ZeekConnMapping."
            echo "         Expected first 7: $ZEEK_CONN_EXPECTED"
            if grep -q '^#fields' "$f" 2>/dev/null; then
                echo "         Found:            $(grep -m1 '^#fields' "$f" | cut -f2-8 | tr '\t' ' ')"
            else
                echo "         Found:            (no #fields header — cannot verify)"
            fi
            echo "         Refusing to ingest — an ordinal mapping against a"
            echo "         reordered file would put addresses in the wrong columns."
        } >&2
        return 2
    fi
    staged="$STAGING_DIR/$(staged_name "$f")"
    if [[ $DRY_RUN -eq 0 ]]; then
        # Strip Zeek's '#' header lines. Kusto cannot skip them and they would
        # otherwise be ingested as data rows.
        grep -v '^#' "$f" > "$staged" 2>/dev/null || true
        [[ -s "$staged" ]] || { rm -f "$staged"; return 1; }
    fi
    printf '%s\n' "$staged"
}

# ------------------------------------------------------------------------------
# Volatility hook — inject the two constant columns .ingest cannot.
# ------------------------------------------------------------------------------

# prepare hook: Volatility 3's `-r json` renderer writes ONE JSON ARRAY of row
# objects per plugin. The memory.VolatilityJson table wants one row per element
# with Plugin and SourceFile alongside — both per-file constants that
# `.ingest into` cannot inject. So each array is rewritten to {Plugin,
# SourceFile, Record} JSON Lines here, and staged as multijson. Plugin is the
# filename (windows.pslist.json -> "windows.pslist"); SourceFile is the path
# relative to processed/, so which image and plugin produced a row stays
# recoverable. rc 1 skips a file that is empty or not the array vol3 emits.
volatility_prepare() {
    local f="$1" staged plugin rel
    plugin="$(basename "$f" .json)"
    rel="${f#"$PROCESSED_DIR"/}"
    staged="$STAGING_DIR/$(staged_name "$f")"
    if [[ $DRY_RUN -eq 0 ]]; then
        python3 - "$f" "$plugin" "$rel" > "$staged" <<'PY' || { rm -f "$staged"; return 1; }
import json, sys
path, plugin, rel = sys.argv[1], sys.argv[2], sys.argv[3]
try:
    data = json.load(open(path))
except Exception:
    sys.exit(1)
if isinstance(data, dict):
    data = [data]
if not isinstance(data, list):
    sys.exit(1)
for rec in data:
    sys.stdout.write(json.dumps({"Plugin": plugin, "SourceFile": rel, "Record": rec}) + "\n")
PY
        [[ -s "$staged" ]] || { rm -f "$staged"; return 1; }
    fi
    printf '%s\n' "$staged"
}

# post hook: runs after the source's ingest, with every found file as args.
zeek_post() {
    local non_conn
    non_conn=$(printf '%s\n' "$@" | grep -cv '/conn\.log$' || true)
    if [[ "${non_conn:-0}" -gt 0 ]]; then
        echo "      ℹ️  ${non_conn} non-conn Zeek log(s) not ingested."
        echo "         Only conn.log is typed — it is the one CAR needs."
        echo "         The generic Zeek table exists; wiring the other 68"
        echo "         log types is deliberately left undone."
    fi
}

# ------------------------------------------------------------------------------
# Source table — one row per source, one driver below. The three ingest paths
# were near-identical blocks that had already drifted in small ways; a new
# source is now a row (plus hooks only if its files need rewriting).
#
#   key | label | subdir | glob | db | table | mapping | format | hdr | prepare | post
#
#   prepare '-'  stage the found files as-is (batched)
#   prepare fn   per file: prints the host path to stage (a rewritten copy is
#                fine), prints nothing/rc 1 to skip, rc 2 to refuse (counted
#                as a failure)
#   db '-'       NOT IMPLEMENTED: announced honestly, nothing ingested. Their
#                tables and mappings exist, but Artefact/Plugin must be derived
#                from the source path per file and .ingest cannot inject a
#                constant column — doing it properly needs an ingest-time
#                property or a post-ingest update, and guessing at that without
#                a running emulator to test against is how the --internal bug
#                happened. See docs/Kusto-Port.md, 'What is not done'.
# ------------------------------------------------------------------------------
SOURCES=(
    "l2t|Plaso (l2t:csv -> host.L2tCsv)|log2timeline/csv|*.csv|host|L2tCsv|L2tCsvMapping|csv|1|-|-"
    "evtx|EvtxECmd (evtxecmd:json -> host.EvtxEcmdJson)|windows_logs|*_EvtxECmd_Output.json|host|EvtxEcmdJson|EvtxEcmdJsonMapping|multijson|0|-|-"
    "zeek|Zeek (-> network.ZeekConn / network.Zeek)|zeek|*.log|network|ZeekConn|ZeekConnMapping|tsv|0|zeek_prepare|zeek_post"
    "volatility|Volatility 3 (-> memory.VolatilityJson)|volatility|*.json|memory|VolatilityJson|VolatilityJsonMapping|multijson|0|volatility_prepare|-"
    "velociraptor|velociraptor — NOT IMPLEMENTED|-|-|-|-|-|-|-|-|-"
    "rekall|rekall — NOT IMPLEMENTED|-|-|-|-|-|-|-|-|-"
)

# hdr=1 sets ignoreFirstRecord for the ingest. psteal writes a header row;
# without it the header is ingested as data: ordinal 1 maps to
# Timestamp:datetime and receives the literal string "datetime", giving one
# null-timestamped junk row per file that then flows into CarFile()/
# CarProcess(). The comment used to claim this was handled while the property
# was never emitted.
run_source() {
    local key label subdir glob db table mapping fmt hdr prepare post
    IFS='|' read -r key label subdir glob db table mapping fmt hdr prepare post <<< "$1"
    want "$key" || return 0
    echo "📄 $label"
    if [[ "$db" == "-" ]]; then
        echo "      Tables and mappings exist; the loader does not."
        echo "      See docs/Kusto-Port.md, 'What is not done'."
        return 0
    fi

    local files=() remote=() f hostpath rc r
    mapfile -t files < <(find "$PROCESSED_DIR/$subdir" -name "$glob" -type f 2>/dev/null | sort)
    if [[ ${#files[@]} -eq 0 ]]; then
        echo "      (none)"
        return 0
    fi

    if [[ "$prepare" == "-" ]]; then
        stage_and_collect remote "${files[@]}" || true
    else
        [[ $DRY_RUN -eq 0 ]] && mkdir -p "$STAGING_DIR"
        for f in "${files[@]}"; do
            hostpath=$("$prepare" "$f"); rc=$?
            if (( rc == 2 )); then
                TOTAL_FAILED=$((TOTAL_FAILED + 1))
                continue
            fi
            (( rc != 0 )) && continue
            [[ -n "$hostpath" ]] || continue
            # The container-side name still derives from the ORIGINAL file, so
            # per-host files stay collision-free regardless of staging layout.
            r="$CONTAINER_STAGE/$(staged_name "$f")"
            if [[ $DRY_RUN -eq 0 ]]; then
                if ! push_to_container "$hostpath" "$r"; then
                    echo "      ❌ could not copy into the container: $f"
                    TOTAL_FAILED=$((TOTAL_FAILED + 1))
                    continue
                fi
            fi
            remote+=("$r")
        done
    fi

    ingest_files "$db" "$table" "$mapping" "$fmt" "$hdr" "${remote[@]}"
    [[ "$post" != "-" ]] && "$post" "${files[@]}"
    return 0
}

for _row in "${SOURCES[@]}"; do
    run_source "$_row"
done

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
