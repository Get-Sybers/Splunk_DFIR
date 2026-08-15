#!/bin/bash
# ==============================================================================
# Suricata signature lane of process-signatures.
#
# Replays each PCAP through Suricata (IDS mode, offline) against a rules set and
# emits Suricata's native EVE JSON — which is already newline-delimited JSON, one
# event per line — filtered to the signature-relevant event types:
#
#   data_store/raw/pcaps/<...>.pcap                          input captures
#   data_store/dependencies/suricata-rules/suricata.rules    the ruleset (ET Open)
#   data_store/processed/signatures/suricata/<name>.eve.jsonl one event per line
#
# EVE already carries timestamp / src_ip / dest_ip / proto / alert.signature /
# flow / http / dns / tls, etc. We add "source_pcap" to each line so a record is
# self-describing, and keep the alert-bearing event types (alert, plus the
# protocol records that give an alert its context). Set SURICATA_EVE_ALL=1 to keep
# the full EVE stream (all flows) instead.
#
# Suricata is GPLv2. The Emerging Threats Open ruleset is MIT/BSD-style (per-rule).
# ==============================================================================
set -o pipefail

SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"
REPO_ROOT_DIR="$(realpath "$SCRIPT_DIR/../..")"

PCAP_DIR="${SURICATA_PCAP_DIR:-$REPO_ROOT_DIR/data_store/raw/pcaps}"
RULES_DIR="${SURICATA_RULES:-$REPO_ROOT_DIR/data_store/dependencies/suricata-rules}"
OUTPUT_DIR="${SIGNATURES_OUTPUT_DIR:-$REPO_ROOT_DIR/data_store/processed/signatures}/suricata"
# Docker rejects relative volume mounts — normalize input dirs to absolute paths.
PCAP_DIR="$(realpath -m "$PCAP_DIR")"
RULES_DIR="$(realpath -m "$RULES_DIR")"

SURICATA_IMAGE="${SURICATA_IMAGE:-jasonish/suricata:latest}"
SURICATA_NATIVE="${SURICATA_NATIVE:-}"
SURICATA_EVE_ALL="${SURICATA_EVE_ALL:-0}"      # keep all EVE event types, not just alerts+context
FETCH_RULES="${FETCH_RULES:-0}"                # --fetch runs suricata-update (online)

for arg in "$@"; do [[ "$arg" == "--fetch" ]] && FETCH_RULES=1; done

echo "🛡️  Suricata"
echo "   pcaps: ${PCAP_DIR#"$REPO_ROOT_DIR"/}"
echo "   rules: ${RULES_DIR#"$REPO_ROOT_DIR"/}"
mkdir -p "$OUTPUT_DIR" "$RULES_DIR"

run_suricata() { # <pcap-abs> <out-dir-abs>  (leaves eve.json in out-dir)
    local pcap="$1" od="$2"
    if [[ -n "$SURICATA_NATIVE" ]]; then
        "$SURICATA_NATIVE" -r "$pcap" -l "$od" -k none \
            ${RULES_FILE:+-S "$RULES_FILE"} >/dev/null 2>&1
    else
        docker run --rm \
            -v "$(dirname "$pcap")":/pcaps:ro \
            -v "$RULES_DIR":/rules:ro \
            -v "$od":/out \
            "$SURICATA_IMAGE" \
            suricata -r "/pcaps/$(basename "$pcap")" -l /out -k none \
            ${RULES_FILE:+-S "/rules/$(basename "$RULES_FILE")"} >/dev/null 2>&1
    fi
}

# --- rules ------------------------------------------------------------------
RULES_FILE=""
merged="$(find "$RULES_DIR" -maxdepth 2 -name 'suricata.rules' 2>/dev/null | head -1)"
if [[ -z "$merged" ]] && [[ "$FETCH_RULES" -eq 1 ]]; then
    echo "   ⬇️  fetching ET Open via suricata-update ..."
    if [[ -n "$SURICATA_NATIVE" ]]; then
        suricata-update --no-test -o "$RULES_DIR" >/dev/null 2>&1 || true
    else
        docker run --rm -v "$RULES_DIR":/rules "$SURICATA_IMAGE" \
            suricata-update --no-test -o /rules >/dev/null 2>&1 || true
    fi
    merged="$(find "$RULES_DIR" -maxdepth 2 -name 'suricata.rules' 2>/dev/null | head -1)"
fi
if [[ -n "$merged" ]]; then
    RULES_FILE="$merged"; echo "   ruleset: ${RULES_FILE#"$REPO_ROOT_DIR"/}"
else
    echo "   ℹ️  no suricata.rules found — running with the image's bundled rules"
    echo "      (drop ET Open into $RULES_DIR, or re-run with --fetch while online)"
fi

# --- discover pcaps ---------------------------------------------------------
mapfile -t pcaps < <(find "$PCAP_DIR" -type f \( -iname '*.pcap' -o -iname '*.pcapng' -o -iname '*.cap' \) 2>/dev/null | sort)
if [ ${#pcaps[@]} -eq 0 ]; then
    echo "   ⚠️  no pcaps under $PCAP_DIR. Skipping."; exit 0
fi
echo "   🗂️  ${#pcaps[@]} pcap(s)"

# unique, path-preserving output name (two corpora can share a basename)
clean_name() { local rel="${1#"$PCAP_DIR"/}"; rel="${rel//\//_}"; echo "${rel// /_}"; }

processed=0; failed=0
for pcap in "${pcaps[@]}"; do
    name="$(clean_name "$pcap")"
    out="$OUTPUT_DIR/$name.eve.jsonl"
    if [[ -s "$out" ]] && head -1 "$out" | python3 -c 'import json,sys;json.loads(sys.stdin.readline())' 2>/dev/null; then
        echo "   ⏭️  $name (done)"; continue
    fi
    tmp="$(mktemp -d)"
    run_suricata "$pcap" "$tmp"
    if [[ -s "$tmp/eve.json" ]]; then
        # add source_pcap to every event; keep alert+context types unless EVE_ALL
        REL="${pcap#"$REPO_ROOT_DIR"/}" KEEP_ALL="$SURICATA_EVE_ALL" \
        python3 - "$tmp/eve.json" "$out" <<'PY'
import json, os, sys
src, out = sys.argv[1], sys.argv[2]
rel = os.environ.get("REL", "")
keep_all = os.environ.get("KEEP_ALL", "0") == "1"
wanted = {"alert", "anomaly", "http", "dns", "tls", "fileinfo", "flow"}
n = 0
with open(src, encoding="utf-8", errors="replace") as fh, open(out, "w") as w:
    for line in fh:
        line = line.strip()
        if not line:
            continue
        try:
            ev = json.loads(line)
        except Exception:
            continue
        if not keep_all and ev.get("event_type") not in wanted:
            continue
        ev["source_pcap"] = rel
        ev["tool"] = "suricata"
        w.write(json.dumps(ev) + "\n"); n += 1
print(f"   ✓ {os.path.basename(out)} — {n} event(s)")
PY
        processed=$((processed+1))
    else
        echo "   ⚠️ $name — no eve.json (suricata failed?)"; failed=$((failed+1))
        rm -f "$out"
    fi
    rm -rf "$tmp"
done

echo "   ─── suricata: $processed pcap(s) with events, $failed failed ───"
exit 0
