#!/bin/bash
# ==============================================================================
# Process memory images with Volatility 3 into ingestable per-plugin JSON.
#
# Volatility 3 is the memory-forensics tool for this pipeline. Its `-r json`
# renderer writes ONE JSON ARRAY of row objects per plugin; ingest-kusto.sh
# wraps each row as {Plugin, SourceFile, Record} and loads it into
# memory.VolatilityJson, where the plugin-specific fields are reachable as
# Record.FieldName in KQL.
#
#   data_store/raw/memory/<image>              memory dump (raw/dd/lime/…)
#   data_store/processed/volatility/<image>/<plugin>.json   one file per plugin
#
# ⚠️ SYMBOLS. Volatility 3's Windows plugins resolve the kernel against symbol
#    tables (ISF) it fetches from the Volatility symbol server / Microsoft's
#    symbol server on first use. That needs outbound network. On an isolated or
#    egress-filtered host those downloads fail and the Windows plugins error
#    with "symbol table requirement was not fulfilled" — pre-seed the symbol
#    cache (VOLATILITY_SYMBOLS) on a connected host, or run this where the
#    symbol servers are reachable. Format-agnostic plugins (banners.Banners)
#    work without symbols.
#
# Volatility 3 is Volatility Software License 1.0 (BSD-style) — no restriction
# on use.
# ==============================================================================
set -o pipefail

SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"
REPO_ROOT_DIR="$(realpath "$SCRIPT_DIR/..")"

MEMORY_DIR="$REPO_ROOT_DIR/data_store/raw/memory"
OUTPUT_DIR="$REPO_ROOT_DIR/data_store/processed/volatility"

# Volatility 3 runs either from a container image (default, matching the rest of
# the pipeline) or from a native install (pip install volatility3) if VOL_NATIVE
# names the executable. The image needs outbound network for symbols on first
# use; an isolated run must pre-seed VOLATILITY_SYMBOLS.
VOLATILITY_IMAGE="${VOLATILITY_IMAGE:-sk4la/volatility3:latest}"
VOL_NATIVE="${VOL_NATIVE:-}"
VOLATILITY_SYMBOLS="${VOLATILITY_SYMBOLS:-$REPO_ROOT_DIR/data_store/dependencies/volatility3-symbols}"

# The plugins run per image. Kept to the ones the analysis backend has a use for
# (process tree, network, command lines, injected code); extend as needed.
PLUGINS=(
    "banners.Banners"
    "windows.info"
    "windows.pslist"
    "windows.pstree"
    "windows.cmdline"
    "windows.netscan"
    "windows.netstat"
    "windows.malfind"
)

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
echo "📂 Memory images: $MEMORY_DIR"
echo "📂 Output:        $OUTPUT_DIR"
if [[ -n "$VOL_NATIVE" ]]; then
    echo "🔧 Volatility:    native ($VOL_NATIVE)"
else
    echo "🔧 Volatility:    container ($VOLATILITY_IMAGE)"
fi
echo ""

mkdir -p "$MEMORY_DIR" "$OUTPUT_DIR" "$VOLATILITY_SYMBOLS"

shopt -s nullglob nocaseglob
# Memory dumps have no single canonical extension; take common ones plus
# extensionless raw dumps in a memory/ directory the operator curated.
images=()
for pat in "$MEMORY_DIR"/*.raw "$MEMORY_DIR"/*.mem "$MEMORY_DIR"/*.dmp "$MEMORY_DIR"/*.lime \
           "$MEMORY_DIR"/*.vmem "$MEMORY_DIR"/*dramimage "$MEMORY_DIR"/*.bin; do
    [[ -f "$pat" ]] && images+=("$pat")
done
if [ ${#images[@]} -eq 0 ]; then
    echo "⚠️  No memory images found in $MEMORY_DIR"
    echo "    Supported: *.raw *.mem *.dmp *.lime *.vmem *dramimage *.bin"
    exit 1
fi
echo "🗂️  Found ${#images[@]} memory image(s)"
echo ""

# run_vol <image-abs-path> <plugin> <out-json>
# stdout of the tool (the JSON array) is captured to the out file; stderr shows.
run_vol() {
    local img="$1" plugin="$2" out="$3"
    if [[ -n "$VOL_NATIVE" ]]; then
        VOLATILITY3_SYMBOL_DIRECTORIES="$VOLATILITY_SYMBOLS" \
            "$VOL_NATIVE" -q -r json -f "$img" "$plugin" > "$out" 2>/dev/null
    else
        docker run --rm \
            -v "$(dirname "$img")":/mem:ro \
            -v "$VOLATILITY_SYMBOLS":/symbols \
            "$VOLATILITY_IMAGE" \
            -q -r json -s /symbols -f "/mem/$(basename "$img")" "$plugin" > "$out" 2>/dev/null
    fi
}

processed=0
failed=0
for img in "${images[@]}"; do
    name="$(basename "$img")"
    dest="$OUTPUT_DIR/$name"
    mkdir -p "$dest"
    echo "🚀 $name"
    for plugin in "${PLUGINS[@]}"; do
        out="$dest/$plugin.json"
        # Idempotency: a non-empty JSON array already there is left alone.
        if [[ -s "$out" ]] && python3 -c 'import json,sys; d=json.load(open(sys.argv[1])); sys.exit(0 if isinstance(d,list) and d else 1)' "$out" 2>/dev/null; then
            echo "   ⏭️  $plugin (already parsed)"
            continue
        fi
        run_vol "$img" "$plugin" "$out"
        if [[ -s "$out" ]] && python3 -c 'import json,sys; d=json.load(open(sys.argv[1])); sys.exit(0 if isinstance(d,list) else 1)' "$out" 2>/dev/null; then
            n=$(python3 -c 'import json,sys; print(len(json.load(open(sys.argv[1]))))' "$out")
            echo "   ✓ $plugin — $n row(s)"
            processed=$((processed+1))
        else
            # Empty/failed plugins (often "symbols unavailable" for Windows) are
            # removed so the ingest glob does not pick up junk and the
            # skip-guard above does not treat them as done.
            rm -f "$out"
            echo "   ⚠️ $plugin — no rows (unsupported plugin or symbols unavailable)"
            failed=$((failed+1))
        fi
    done
done

echo ""
echo "═══════════════════════════════════════════"
echo "  plugin outputs: $processed   empty/failed: $failed"
echo "═══════════════════════════════════════════"
echo "💾 Output in: $OUTPUT_DIR"
echo ""
echo "ℹ️  Load into the analysis backend with:  ./scripts/ingest-kusto.sh --only volatility"
echo "   (JSON arrays -> memory.VolatilityJson, one row per element, with the"
echo "    plugin name and source path injected. Query: VolatilityPlugins() and"
echo "    VolatilityPslist() in the memory database.)"

[[ $processed -eq 0 ]] && exit 1
exit 0
