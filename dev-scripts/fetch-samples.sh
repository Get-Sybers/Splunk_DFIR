#!/bin/bash
#
# Fetch the large DFIR test samples that cannot live in git.
#
#   ./dev-scripts/fetch-samples.sh            # fetch and verify everything
#   ./dev-scripts/fetch-samples.sh --list     # show the manifest, download nothing
#   ./dev-scripts/fetch-samples.sh --verify   # re-check what is already on disk
#
# Why this exists rather than the files being committed:
#
#   GitHub blocks any file over 100 MB on the ordinary git path, and that
#   limit is fixed on every plan — it is not something a paid tier lifts.
#   Git LFS is the supported way around it, but LFS pushes go to
#   lfs.github.com, which is a different host from github.com and is not
#   reachable from every network. Where it is blocked, LFS fails at push
#   with a bare "Forbidden" that looks like a billing problem and is not.
#
#   So the images are not in the repository at all. This script fetches them
#   from the same public source they came from, and pins every one to a
#   SHA-256 computed from a byte-exact copy. That is reproducible anywhere
#   with outbound access to Digital Corpora, costs no LFS quota, and needs
#   no git-lfs on the client.
#
# The small samples committed under samples/ need none of this — they are
# already in the repository. This is only the set too big to go there.
#
# Everything lands in samples/large/, which is gitignored. Do not commit it.

set -euo pipefail

SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"
REPO_ROOT_DIR="$(realpath "$SCRIPT_DIR/..")"
cd "$REPO_ROOT_DIR"

DEST="samples/large"
BASE="https://digitalcorpora.s3.amazonaws.com/corpora/drives"

# name | bytes | sha256 | path under $BASE
#
# Sizes and hashes were taken from a verified download, each checked against
# the S3 Content-Length before hashing. A mismatch below means the upstream
# object changed, not that your download is merely incomplete — investigate
# rather than deleting and retrying.
MANIFEST=(
  "ubnist1.casper-rw.gen2.E01|116788106|c15c836993331b0e6ff37d2fdbbdf8798dfd92723b8839e1fcebe80892d97ad9|nps-2009-casper-rw/ubnist1.casper-rw.gen2.E01"
  "ubnist1.casper-rw.gen3.E01|168365166|f2ad970ab2c8ed41e2d26d0c7e821aaee0bb6fe71063ae17bea894306a8e55ff|nps-2009-casper-rw/ubnist1.casper-rw.gen3.E01"
  "ubnist1.gen0.E01|728367756|4c517df5e66c24e849fe43a460b50638f2c6cffb571e3e7fbb60255cc2392eaf|nps-2009-ubnist1/ubnist1.gen0.E01"
  "ubnist1.gen3.aff|890164681|60f427154ce917600873f96ecb4098cb2079f46aa80a3fe8ffe88c2bd212c932|nps-2009-ubnist1/ubnist1.gen3.aff"
  "ubnist1.gen3.001|536870912|0aebf1edbd2f4d4076d662ed5a8c1f9dafd7d9a264f0eecbe354c579e13665fa|nps-2009-ubnist1/ubnist1.gen3.001"
  "ubnist1.gen3.002|536870912|6a19d436c73166204cee238a977ec56b63bf68aa4bc9e1d75fc8ea6cfa9c8a0b|nps-2009-ubnist1/ubnist1.gen3.002"
  "ubnist1.gen3.003|536870912|c61c99532e4fc43b7532b1376ad9abd1f7d03aef636c295cae8bc41935e10d3f|nps-2009-ubnist1/ubnist1.gen3.003"
  "ubnist1.gen3.004|495976448|9081988c9e10cc0766e3ee5c274beba674816023f759e1958fd1ca1453d90eaa|nps-2009-ubnist1/ubnist1.gen3.004"
  "ubnist1.gen3.raw|2106589184|c0172d79ec23b2fce54e725b00062a38fc3988dfc036b4aa99bbaf243628b3fb|nps-2009-ubnist1/ubnist1.gen3.raw"
)

human() { numfmt --to=iec --suffix=B "$1" 2>/dev/null || echo "$1 bytes"; }

total_bytes() {
    local sum=0 entry
    for entry in "${MANIFEST[@]}"; do
        IFS='|' read -r _ bytes _ _ <<< "$entry"
        sum=$(( sum + bytes ))
    done
    echo "$sum"
}

list_manifest() {
    printf '%-30s %10s  %s\n' NAME SIZE SHA256
    local entry name bytes sha _
    for entry in "${MANIFEST[@]}"; do
        IFS='|' read -r name bytes sha _ <<< "$entry"
        printf '%-30s %10s  %s\n' "$name" "$(human "$bytes")" "${sha:0:16}…"
    done
    echo
    echo "Total: $(human "$(total_bytes)") into $DEST/"
}

# Returns 0 when the file on disk matches both size and hash.
verify_one() {
    local path="$1" bytes="$2" sha="$3" actual
    [[ -f "$path" ]] || return 1
    [[ "$(stat -c%s "$path")" == "$bytes" ]] || return 1
    actual="$(sha256sum "$path" | cut -d' ' -f1)"
    [[ "$actual" == "$sha" ]]
}

verify_all() {
    local entry name bytes sha _ ok=0 bad=0 missing=0
    for entry in "${MANIFEST[@]}"; do
        IFS='|' read -r name bytes sha _ <<< "$entry"
        if [[ ! -f "$DEST/$name" ]]; then
            printf '  –  %-30s not fetched\n' "$name"; missing=$(( missing + 1 ))
        elif verify_one "$DEST/$name" "$bytes" "$sha"; then
            printf '  ✅ %-30s %s\n' "$name" "$(human "$bytes")"; ok=$(( ok + 1 ))
        else
            printf '  ❌ %-30s FAILED verification\n' "$name"; bad=$(( bad + 1 ))
        fi
    done
    echo
    echo "verified: $ok   failed: $bad   not fetched: $missing"
    [[ "$bad" -eq 0 ]]
}

fetch_all() {
    mkdir -p "$DEST"
    echo "Fetching $(human "$(total_bytes)") into $DEST/"
    echo "Source: Digital Corpora (public). Nothing here is case evidence."
    echo

    local entry name bytes sha rel failed=0
    for entry in "${MANIFEST[@]}"; do
        IFS='|' read -r name bytes sha rel <<< "$entry"

        if verify_one "$DEST/$name" "$bytes" "$sha"; then
            printf '  ✅ %-30s already present and verified\n' "$name"
            continue
        fi

        printf '  ⬇  %-30s %s\n' "$name" "$(human "$bytes")"
        # -C - resumes a partial file; a truncated download is the normal
        # failure here, and re-fetching 2 GB to recover a dropped connection
        # is not worth it.
        if ! curl -fSL --retry 3 --retry-delay 5 -C - -o "$DEST/$name" "$BASE/$rel"; then
            printf '  ❌ %-30s download failed\n' "$name"
            failed=$(( failed + 1 ))
            continue
        fi

        if verify_one "$DEST/$name" "$bytes" "$sha"; then
            printf '  ✅ %-30s verified\n' "$name"
        else
            printf '  ❌ %-30s verification FAILED after download\n' "$name"
            failed=$(( failed + 1 ))
        fi
    done

    echo
    if [[ "$failed" -gt 0 ]]; then
        echo "❌ $failed file(s) failed. Re-run to resume; downloads continue where they stopped."
        return 1
    fi
    echo "✅ all samples fetched and verified"
}

case "${1:---fetch}" in
    --list)   list_manifest ;;
    --verify) verify_all ;;
    --fetch)  fetch_all ;;
    -h|--help)
        sed -n '2,20p' "$0" | sed 's/^# \{0,1\}//'
        ;;
    *)
        echo "unknown option: $1" >&2
        echo "usage: $0 [--fetch|--list|--verify|--help]" >&2
        exit 2
        ;;
esac
