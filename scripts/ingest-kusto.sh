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
#    process-zeek-ALL.sh writes JSON Lines (Zeek's LogAscii::use_json=T), so
#    conn.json is ingested as-is by JSON path mapping — no header stripping, no
#    ordinal guard, immune to Zeek field reordering. Every OTHER log type is
#    wrapped {LogType, SourceFile, Record} by zeek_generic_prepare and loaded
#    into the generic network.Zeek table, so all ~69 log types land, not just
#    conn — the same constant-injection pattern the Volatility/Velociraptor
#    loaders use.

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
                   l2t | zeek | evtx | volatility | velociraptor
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
    ""|l2t|zeek|evtx|volatility|velociraptor) ;;
    *) echo "❌ --only must be one of: l2t zeek evtx volatility velociraptor"; exit 1 ;;
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
# Zeek generic hook — wrap every non-conn log with its constant columns.
# ------------------------------------------------------------------------------

# prepare hook: process-zeek-ALL.sh emits JSON Lines per log type. conn.json is
# handled by the typed ZeekConn source and is SKIPPED here (rc 1) so it is not
# double-loaded. Every other log is wrapped {LogType, SourceFile, Record} JSON
# Lines — LogType from the filename (dns.json -> "dns"), SourceFile from the path
# relative to processed/, Record the whole Zeek object — and staged as multijson
# into the generic network.Zeek table. rc 1 skips conn.json, an empty file, or a
# file that is not the JSON Lines Zeek emits.
#
# stdout is the HOST PATH to stage (captured by the driver); diagnostics, if any,
# go to stderr.
zeek_generic_prepare() {
    local f="$1" staged logtype rel
    logtype="$(basename "$f" .json)"
    # conn is the typed table's job; skip it here so it lands once, in ZeekConn.
    [[ "$logtype" == "conn" ]] && return 1
    rel="${f#"$PROCESSED_DIR"/}"
    staged="$STAGING_DIR/$(staged_name "$f")"
    if [[ $DRY_RUN -eq 0 ]]; then
        python3 - "$f" "$logtype" "$rel" > "$staged" <<'PY' || { rm -f "$staged"; return 1; }
import json, sys
path, logtype, rel = sys.argv[1], sys.argv[2], sys.argv[3]
raw = open(path, encoding="utf-8", errors="replace").read()
recs = []
try:
    data = json.loads(raw)                       # a single array or object
    recs = data if isinstance(data, list) else [data]
except Exception:
    for line in raw.splitlines():                # or JSON Lines (Zeek's default)
        line = line.strip()
        if not line:
            continue
        try:
            recs.append(json.loads(line))
        except Exception:
            continue
if not recs:
    sys.exit(1)
for rec in recs:
    sys.stdout.write(json.dumps({"LogType": logtype, "SourceFile": rel, "Record": rec}) + "\n")
PY
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

# prepare hook: Velociraptor offline collectors (running the EZ Tools) emit one
# result file per artefact — either a JSON array or JSON Lines, depending on the
# VQL. host.VelociraptorJson wants one row per record with Artefact and
# SourceFile alongside, both per-file constants .ingest cannot inject. Each file
# is rewritten to {Artefact, SourceFile, Record} JSON Lines. Artefact is the
# filename (Windows.Registry.RECmd.json -> "Windows.Registry.RECmd"), which is
# what CarRegistry() filters on; SourceFile is the path relative to processed/,
# so the collecting host's directory stays recoverable. rc 1 skips an empty or
# unparseable file.
velociraptor_prepare() {
    local f="$1" staged artefact rel
    artefact="$(basename "$f" .json)"
    rel="${f#"$PROCESSED_DIR"/}"
    staged="$STAGING_DIR/$(staged_name "$f")"
    if [[ $DRY_RUN -eq 0 ]]; then
        python3 - "$f" "$artefact" "$rel" > "$staged" <<'PY' || { rm -f "$staged"; return 1; }
import json, sys
path, artefact, rel = sys.argv[1], sys.argv[2], sys.argv[3]
raw = open(path, encoding="utf-8", errors="replace").read()
recs = []
try:
    data = json.loads(raw)                       # a single array or object
    recs = data if isinstance(data, list) else [data]
except Exception:
    for line in raw.splitlines():                # or JSON Lines
        line = line.strip()
        if not line:
            continue
        try:
            recs.append(json.loads(line))
        except Exception:
            continue
if not recs:
    sys.exit(1)
for rec in recs:
    sys.stdout.write(json.dumps({"Artefact": artefact, "SourceFile": rel, "Record": rec}) + "\n")
PY
        [[ -s "$staged" ]] || { rm -f "$staged"; return 1; }
    fi
    printf '%s\n' "$staged"
}

# prepare hook: Plaso's psort -o json_line writes one JSON event per line, but
# host.L2tJson wants each wrapped {SourceImage, Timestamp, Record}. Two things
# .ingest cannot do are done here:
#   Timestamp  Plaso's `timestamp` is an integer of MICROSECONDS since epoch; a
#              JSON ingestion mapping cannot call a conversion function, so it is
#              turned into an ISO-8601 datetime string once, here. Events with a
#              zero/absent/out-of-range timestamp get no Timestamp (stays null)
#              rather than a bogus 1970 value.
#   SourceImage  the per-file provenance constant.
# (hostname/volume are already injected into each Record by
# process-log2timeline-Dynamic.sh from pinfo, so they are not added here.)
l2t_prepare() {
    local f="$1" staged rel
    rel="${f#"$PROCESSED_DIR"/}"
    staged="$STAGING_DIR/$(staged_name "$f")"
    if [[ $DRY_RUN -eq 0 ]]; then
        python3 - "$f" "$rel" > "$staged" <<'PY' || { rm -f "$staged"; return 1; }
import json, sys, datetime
path, rel = sys.argv[1], sys.argv[2]
n = 0
for line in open(path, encoding="utf-8", errors="replace"):
    line = line.strip()
    if not line:
        continue
    try:
        rec = json.loads(line)
    except Exception:
        continue
    out = {"SourceImage": rel, "Record": rec}
    ts = rec.get("timestamp")
    if isinstance(ts, (int, float)) and ts > 0:
        try:
            out["Timestamp"] = datetime.datetime.fromtimestamp(
                ts / 1_000_000, datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%fZ")
        except (OverflowError, OSError, ValueError):
            pass
    sys.stdout.write(json.dumps(out) + "\n")
    n += 1
sys.exit(0 if n else 1)
PY
        [[ -s "$staged" ]] || { rm -f "$staged"; return 1; }
    fi
    printf '%s\n' "$staged"
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
#   db '-'       NOT IMPLEMENTED: announced honestly, nothing ingested. The
#                constant-column problem (.ingest cannot inject Artefact/Plugin,
#                which must be derived from the source path per file) is now
#                solved for the JSON sources by a prepare hook that wraps each
#                record as {Constant..., Record} JSON Lines — see
#                volatility_prepare / velociraptor_prepare.
# ------------------------------------------------------------------------------
SOURCES=(
    "l2t|Plaso (l2t:json_line -> host.L2tJson)|log2timeline/jsonl|*.jsonl|host|L2tJson|L2tJsonMapping|multijson|0|l2t_prepare|-"
    "evtx|EvtxECmd (evtxecmd:json -> host.EvtxEcmdJson)|windows_logs|*_EvtxECmd_Output.json|host|EvtxEcmdJson|EvtxEcmdJsonMapping|multijson|0|-|-"
    "zeek|Zeek conn (conn.json -> network.ZeekConn)|zeek|conn.json|network|ZeekConn|ZeekConnMapping|multijson|0|-|-"
    "zeek|Zeek other logs (-> network.Zeek)|zeek|*.json|network|Zeek|ZeekJsonMapping|multijson|0|zeek_generic_prepare|-"
    "volatility|Volatility 3 (-> memory.VolatilityJson)|volatility|*.json|memory|VolatilityJson|VolatilityJsonMapping|multijson|0|volatility_prepare|-"
    "velociraptor|Velociraptor collectors (-> host.VelociraptorJson)|velociraptor|*.json|host|VelociraptorJson|VelociraptorJsonMapping|multijson|0|velociraptor_prepare|-"
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
