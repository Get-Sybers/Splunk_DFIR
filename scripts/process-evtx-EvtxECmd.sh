#!/bin/bash
# ==============================================================================
# Parse Windows Event Logs (.evtx) with EvtxECmd into an ingestable form.
#
# The analysis backend cannot read binary .evtx. This converts them to:
#
#   *_EvtxECmd_Output.json   normalised records  -> host.EvtxEcmdJson (Kusto)
#   *_EvtxECmd_Output.xml    full <Event> XML    -> not ingested; kept for
#                                                   manual review
#
# The JSON lane is the supported one: ingest-kusto.sh loads it into
# host.EvtxEcmdJson via a JSON path mapping, and the MITRE CAR functions
# (CarProcess, CarUserSession, CarService, …) read their fields from it.
#
# EvtxECmd is MIT licensed (Copyright (c) 2019 Eric Zimmerman), so unlike the
# KAPE path there is no restriction on commercial use.
# ==============================================================================
set -o pipefail

# Ensure correct filepath assigned when referenced
SCRIPT_DIR="$(dirname "$(readlink -f "$0")")" # Resolves full path
REPO_ROOT_DIR="$(realpath "$SCRIPT_DIR/..")"

# Define input and output directories dynamically
EVTX_DIR="$REPO_ROOT_DIR/data_store/raw/other_raw_data/WinEvt"
OUTPUT_DIR="$REPO_ROOT_DIR/data_store/processed/windows_logs"

# EvtxECmd is not vendored. Drop the published release here — see the README in
# that directory. Operator-supplied because we don't redistribute other
# people's builds.
EVTXECMD_DIR="${EVTXECMD_DIR:-$REPO_ROOT_DIR/data_store/dependencies/evtxecmd}"

# EvtxECmd targets .NET; this image supplies the runtime on Linux.
DOTNET_IMAGE="${DOTNET_IMAGE:-mcr.microsoft.com/dotnet/sdk:8.0}"

################################################################################
echo ""
echo " ██████╗ ███████╗████████╗   ███████╗██╗   ██╗██████╗ ███████╗██████╗ ███████╗"
sleep 0.1
echo "██╔════╝ ██╔════╝╚══██╔══╝   ██╔════╝╚██╗ ██╔╝██╔══██╗██╔════╝██╔══██╗██╔════╝"
sleep 0.1
echo "██║  ███╗█████╗     ██║█████╗███████╗ ╚████╔╝ ██████╔╝█████╗  ██████╔╝███████╗"
sleep 0.1
echo "██║   ██║██╔══╝     ██║╚════╝╚════██║  ╚██╔╝  ██╔══██╗██╔══╝  ██╔══██╗╚════██║"
sleep 0.1
echo "╚██████╔╝███████╗   ██║      ███████║   ██║   ██████╔╝███████╗██║  ██║███████║"
sleep 0.1
echo "╚═════╝ ╚══════╝   ╚═╝      ╚══════╝   ╚═╝   ╚═════╝ ╚══════╝╚═╝  ╚═╝╚══════╝"
echo ""

echo "$REPO_ROOT_DIR"
echo ""
echo "📂 EVTX Directory:    $EVTX_DIR"
echo "📂 Output Directory:  $OUTPUT_DIR"
echo "📂 EvtxECmd:          $EVTXECMD_DIR"
echo ""

mkdir -p "$EVTX_DIR" "$OUTPUT_DIR" "$EVTXECMD_DIR"

# ------------------------------------------------------------------------------
# Locate EvtxECmd
# ------------------------------------------------------------------------------
EVTXECMD_DLL=""
if [[ -f "$EVTXECMD_DIR/EvtxECmd.dll" ]]; then
    EVTXECMD_DLL="EvtxECmd.dll"
else
    # Releases sometimes nest under an EvtxECmd/ folder
    found=$(find "$EVTXECMD_DIR" -maxdepth 3 -name "EvtxECmd.dll" -type f 2>/dev/null | head -1)
    [[ -n "$found" ]] && EVTXECMD_DLL="${found#"$EVTXECMD_DIR"/}"
fi

if [[ -z "$EVTXECMD_DLL" ]]; then
    echo "❌ EvtxECmd.dll not found under: $EVTXECMD_DIR"
    echo ""
    echo "   EvtxECmd is not shipped with this repository. Download the .NET"
    echo "   release and extract it there:"
    echo "     https://github.com/EricZimmerman/evtx/releases"
    echo "     (or https://ericzimmerman.github.io/)"
    echo ""
    echo "   Include the Maps/ folder — without it, MapDescription is empty and"
    echo "   the 'signature' field will not be populated."
    echo ""
    echo "   See $EVTXECMD_DIR/README.md"
    exit 1
fi
echo "🔎 Using EvtxECmd: $EVTXECMD_DLL"

# ------------------------------------------------------------------------------
# Find input
# ------------------------------------------------------------------------------
shopt -s nullglob nocaseglob globstar
evtx_files=("$EVTX_DIR"/**/*.evtx)
if [ ${#evtx_files[@]} -eq 0 ]; then
    echo "⚠️ No .evtx files found in $EVTX_DIR. Exiting."
    exit 1
fi
echo "🗂️  Found ${#evtx_files[@]} .evtx file(s)"
echo ""

# ------------------------------------------------------------------------------
# Process
# ------------------------------------------------------------------------------
processed=0
skipped=0
failed=0

for evtx_file in "${evtx_files[@]}"; do
    evtx_basename="$(basename "$evtx_file" .evtx)"

    # Group output by the sub-directory the evtx came from, so per-host
    # collections stay separated. Files sitting directly in WinEvt/ go to
    # "unspecified_host".
    rel_dir="$(dirname "${evtx_file#"$EVTX_DIR"/}")"
    [[ "$rel_dir" == "." ]] && rel_dir="unspecified_host"
    dest_dir="$OUTPUT_DIR/$rel_dir"
    mkdir -p "$dest_dir"

    json_out="${evtx_basename}_EvtxECmd_Output.json"
    xml_out="${evtx_basename}_EvtxECmd_Output.xml"

    # Idempotency: forensic parsing is expensive and re-running should not
    # silently redo or duplicate work. (Kusto ingestion is additive with no
    # fishbucket, so re-parsed files would also duplicate rows on re-ingest.)
    if [[ -s "$dest_dir/$json_out" ]]; then
        echo "⏭️  Skipping (already parsed): $rel_dir/$evtx_basename"
        skipped=$((skipped+1))
        continue
    fi

    echo "🚀 Processing: $rel_dir/$evtx_basename"

    # --json  normalised records, one JSON object per line
    # --xml   full <Event> XML
    # -f      single file
    if docker run --rm \
        -v "$EVTXECMD_DIR":/evtxecmd:ro \
        -v "$(dirname "$evtx_file")":/input:ro \
        -v "$dest_dir":/output \
        -w /evtxecmd \
        "$DOTNET_IMAGE" \
        dotnet "/evtxecmd/$EVTXECMD_DLL" \
            -f "/input/$(basename "$evtx_file")" \
            --json /output --jsonf "$json_out" \
            --xml  /output --xmlf  "$xml_out"
    then
        if [[ -s "$dest_dir/$json_out" ]]; then
            echo "   ✓ $(wc -l < "$dest_dir/$json_out") record(s) -> $rel_dir/$json_out"
            processed=$((processed+1))
        else
            # EvtxECmd exits 0 on an empty log. Remove the empty artefact so the
            # skip-guard above doesn't treat it as done.
            echo "   ⚠️ No records extracted (empty or corrupt log)"
            rm -f "$dest_dir/$json_out" "$dest_dir/$xml_out"
            failed=$((failed+1))
        fi
    else
        echo "   ❌ EvtxECmd failed on $evtx_basename"
        rm -f "$dest_dir/$json_out" "$dest_dir/$xml_out"
        failed=$((failed+1))
    fi
done

echo ""
echo "═══════════════════════════════════════════"
echo "  parsed: $processed   skipped: $skipped   failed: $failed"
echo "═══════════════════════════════════════════"
echo "💾 Output in: $OUTPUT_DIR"
echo ""
echo "ℹ️  Load into the analysis backend with:  ./scripts/ingest-kusto.sh --only evtx"
echo "   (JSON -> host.EvtxEcmdJson; the CAR functions in the mitre database"
echo "   read from it.)"
echo ""
echo "⚠️  The XML lane is best-effort and is NOT ingested — EvtxECmd beautifies"
echo "   its XML and strips the xmlns declaration. The JSON lane is the"
echo "   supported one. See docs/scripts/processing_data/process-evtx-EvtxECmd.md"

[[ $failed -gt 0 ]] && exit 1
exit 0
