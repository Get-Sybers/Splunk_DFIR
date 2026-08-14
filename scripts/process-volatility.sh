#!/bin/bash
# ==============================================================================
# Process memory images with Volatility 3 into ingestable per-plugin JSON.
#
# Volatility 3 is the memory-forensics tool for this pipeline. Our custom
# renderer (`-r jsonl_dfir`, dev-scripts/volatility/jsonl_dfir_renderer.py) writes
# JSON LINES — one flat object per TreeGrid node (one process/connection/artefact
# per line); ingest-kusto.sh wraps each line as {Plugin, SourceFile, Record} and
# loads it into memory.VolatilityJson, where the plugin-specific fields are
# reachable as Record.FieldName in KQL.
#
#   data_store/raw/memory/<image>              memory dump (raw/dd/lime/…)
#   data_store/processed/volatility/<image>/<plugin>.jsonl  one file per plugin (JSON Lines)
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

# Output is JSON Lines via our custom renderer (dev-scripts/volatility/
# jsonl_dfir_renderer.py, `-r jsonl_dfir`): one flat JSON object per TreeGrid node
# — one process/connection/artefact per line, ingest-ready — instead of the
# built-in `-r json`'s single nested array. The renderer is auto-registered by
# importing it (Volatility 3 discovers CLIRenderer subclasses), loaded via a small
# import wrapper, the same pattern as the Plaso l2t_json_dfir output module.
VOLATILITY_RENDERER="${VOLATILITY_RENDERER:-$REPO_ROOT_DIR/dev-scripts/volatility/jsonl_dfir_renderer.py}"

# Custom plugin directory (loaded with `-p`). dfir_processes.DfirProcesses emits
# the CarProcess-shaped record: psscan process list (so unlinked processes are
# found) with the full image path, parent path and loaded DLLs resolved from each
# process's rebuilt address space.
VOLATILITY_PLUGINS="${VOLATILITY_PLUGINS:-$REPO_ROOT_DIR/dev-scripts/volatility/plugins}"

# The plugins run per image. Kept to the ones the analysis backend has a use for
# (process tree, network, command lines, injected code); extend as needed.
PLUGINS=(
    "banners.Banners"
    "windows.info"
    "dfir_processes.DfirProcesses"  # -> CarProcess (psscan; full path, parent
                                    #    path, command line, loaded DLLs, Hidden)
    "windows.pslist"        # process list (active) — kept for cross-check
    "windows.pstree"
    "windows.dlllist"       # -> CarModule  (loaded DLLs per process)
    "windows.modules"       # -> CarDriver  (kernel modules/drivers)
    "windows.netscan"       # -> CarFlow    (connections; Win7+ pool scan)
    "windows.netstat"       # -> CarFlow    (connections)
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
# The container runs as a non-root UID and caches downloaded kernel symbol tables
# into the mounted symbol dir; make it writable so the cache persists across runs
# (otherwise every run re-resolves symbols and warns it "cannot write").
chmod 777 "$VOLATILITY_SYMBOLS" 2>/dev/null || sudo chmod 777 "$VOLATILITY_SYMBOLS" 2>/dev/null || true

# Discover memory images anywhere UNDER the memory tree — users drop their own
# dumps in and the sample collector nests them per corpus
# (memory/<corpus>/<name>.mddramimage/…), so a flat glob of $MEMORY_DIR/* missed
# every one. Memory dumps have no reliable magic bytes, so match by the common
# extensions plus the M57 corpus's *dramimage naming; recurse to any depth.
mapfile -t images < <(find "$MEMORY_DIR" -type f \( \
        -iname '*.raw'  -o -iname '*.mem'   -o -iname '*.dmp'  -o -iname '*.lime' \
     -o -iname '*.vmem' -o -iname '*dramimage' -o -iname '*.bin' -o -iname '*.dump' \
     -o -iname '*.vmsn' -o -iname '*.crash' \) 2>/dev/null | sort)
if [ ${#images[@]} -eq 0 ]; then
    echo "⚠️  No memory images found under $MEMORY_DIR"
    echo "    Supported: *.raw *.mem *.dmp *.lime *.vmem *dramimage *.bin *.dump *.vmsn *.crash"
    exit 1
fi
echo "🗂️  Found ${#images[@]} memory image(s)"
echo ""

# Output-folder name from the path RELATIVE to the memory dir, so two corpora
# that share a basename (e.g. lonewolf/memdump.mem and magnet/…/memdump.mem)
# keep distinct output instead of overwriting each other.
clean_name() {
    local rel="${1#"$MEMORY_DIR"/}"
    rel="${rel//\//_}"; rel="${rel// /_}"
    echo "$rel"
}

# run_vol <image-abs-path> <plugin> <out-json>
# stdout of the tool (the JSON array) is captured to the out file; stderr shows.
# The renderer is not built in, so it is imported before the CLI runs (which is
# when Volatility discovers renderers). For the container that means an
# --entrypoint python3 wrapper; the file and plugin are passed as argv so no path
# is spliced into the Python source. Native runs put the renderer's dir on
# PYTHONPATH and import it the same way.
# argv to the wrapper: renderer_path, plugins_dir, symbols_dir, memory_file, plugin
_VOL_WRAPPER='
import importlib.util, sys
spec = importlib.util.spec_from_file_location("jsonl_dfir_renderer", sys.argv[1])
mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)
from volatility3.cli import CommandLine
sys.argv = ["vol", "-q", "-p", sys.argv[2], "-s", sys.argv[3],
            "-r", "jsonl_dfir", "-f", sys.argv[4], sys.argv[5]]
CommandLine().run()
'
run_vol() {
    local img="$1" plugin="$2" out="$3"
    if [[ -n "$VOL_NATIVE" ]]; then
        VOLATILITY3_SYMBOL_DIRECTORIES="$VOLATILITY_SYMBOLS" \
            python3 -c "$_VOL_WRAPPER" "$VOLATILITY_RENDERER" "$VOLATILITY_PLUGINS" "$VOLATILITY_SYMBOLS" "$img" "$plugin" > "$out" 2>/dev/null
    else
        docker run --rm \
            -v "$(dirname "$img")":/mem:ro \
            -v "$VOLATILITY_SYMBOLS":/symbols \
            -v "$VOLATILITY_RENDERER":/opt/jsonl_dfir_renderer.py:ro \
            -v "$VOLATILITY_PLUGINS":/plugins:ro \
            --entrypoint python3 "$VOLATILITY_IMAGE" \
            -c "$_VOL_WRAPPER" /opt/jsonl_dfir_renderer.py /plugins /symbols "/mem/$(basename "$img")" "$plugin" > "$out" 2>/dev/null
    fi
}

processed=0
failed=0
for img in "${images[@]}"; do
    name="$(clean_name "$img")"
    dest="$OUTPUT_DIR/$name"
    mkdir -p "$dest"
    echo "🚀 ${img#"$MEMORY_DIR"/}"
    for plugin in "${PLUGINS[@]}"; do
        out="$dest/$plugin.jsonl"
        # Idempotency: a non-empty JSON Lines file whose first line parses is done.
        if [[ -s "$out" ]] && head -1 "$out" | python3 -c 'import json,sys; json.loads(sys.stdin.readline())' 2>/dev/null; then
            echo "   ⏭️  $plugin (already parsed)"
            continue
        fi
        run_vol "$img" "$plugin" "$out"
        if [[ -s "$out" ]] && head -1 "$out" | python3 -c 'import json,sys; json.loads(sys.stdin.readline())' 2>/dev/null; then
            n=$(wc -l < "$out")
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
