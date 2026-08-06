#!/bin/bash
# ==============================================================================
# Lay out Velociraptor offline-collector output for ingestion.
#
# Velociraptor offline collectors — the planned replacement for the removed KAPE
# automation — run on the endpoint and produce a single collection ZIP. The
# collectors run the EZ Tools (RECmd / Registry Explorer, etc.), so the result
# files carry Eric Zimmerman's field names. This script is the analyst-side
# step: unpack each collection and lay its per-artefact JSON out where
# ingest-kusto.sh expects it.
#
#   data_store/raw/velociraptor/<collection>.zip     one ZIP per collection
#   data_store/processed/velociraptor/<collection>/<Artefact>.json
#
# ingest-kusto.sh --only velociraptor then wraps each record as
# {Artefact, SourceFile, Record} (Artefact = the filename) into
# host.VelociraptorJson, and CarRegistry() reads the registry artefacts from it.
#
# LAYOUT. A Velociraptor offline collection ZIP holds its query results as
# `results/<Artefact>.json` (JSON Lines). That is the documented layout; if a
# collection nests them differently, every *.json under results/ is still
# picked up. Non-results JSON (metadata) is left alone.
#
# Velociraptor is AGPL-3.0; it is run, not redistributed here.
# ==============================================================================
set -o pipefail

SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"
REPO_ROOT_DIR="$(realpath "$SCRIPT_DIR/..")"

RAW_DIR="$REPO_ROOT_DIR/data_store/raw/velociraptor"
OUTPUT_DIR="$REPO_ROOT_DIR/data_store/processed/velociraptor"

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
echo "📂 Collections: $RAW_DIR"
echo "📂 Output:      $OUTPUT_DIR"
echo ""

mkdir -p "$RAW_DIR" "$OUTPUT_DIR"

shopt -s nullglob nocaseglob
zips=("$RAW_DIR"/*.zip)
if [ ${#zips[@]} -eq 0 ]; then
    echo "⚠️  No Velociraptor collection ZIPs in $RAW_DIR"
    echo "    Drop offline-collector output there as <collection>.zip"
    exit 1
fi
echo "🗂️  Found ${#zips[@]} collection(s)"
echo ""

command -v unzip >/dev/null 2>&1 || { echo "❌ unzip not found on PATH."; exit 1; }

processed=0
failed=0
for zip in "${zips[@]}"; do
    name="$(basename "$zip" .zip)"
    dest="$OUTPUT_DIR/$name"
    mkdir -p "$dest"
    echo "🚀 $name"

    tmp="$(mktemp -d)"
    # Only extract the results tree; uploads can be large and are not ingested.
    if ! unzip -o -q "$zip" 'results/*' -d "$tmp" 2>/dev/null; then
        # Some collections store results at the root; fall back to a full extract.
        unzip -o -q "$zip" -d "$tmp" 2>/dev/null || {
            echo "   ❌ could not unzip $name"; failed=$((failed+1)); rm -rf "$tmp"; continue
        }
    fi

    count=0
    while IFS= read -r rj; do
        # Artefact name is the result filename (Velociraptor names them by
        # artefact). Copy verbatim; the ingest hook does the JSON shaping.
        base="$(basename "$rj")"
        cp -f "$rj" "$dest/$base"
        count=$((count+1))
    done < <(find "$tmp" -type f -iname '*.json' 2>/dev/null)

    rm -rf "$tmp"
    if [[ $count -gt 0 ]]; then
        echo "   ✓ $count artefact result file(s) -> velociraptor/$name/"
        processed=$((processed+1))
    else
        echo "   ⚠️ no JSON result files found in $name"
        failed=$((failed+1))
    fi
done

echo ""
echo "═══════════════════════════════════════════"
echo "  collections laid out: $processed   empty/failed: $failed"
echo "═══════════════════════════════════════════"
echo "💾 Output in: $OUTPUT_DIR"
echo ""
echo "ℹ️  Load into the analysis backend with:  ./scripts/ingest-kusto.sh --only velociraptor"
echo "   (-> host.VelociraptorJson; registry artefacts feed CarRegistry() in the"
echo "    mitre database. Check: VelociraptorArtefacts() and CarCoverage().)"

[[ $processed -eq 0 ]] && exit 1
exit 0
