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
BASE="https://digitalcorpora.s3.amazonaws.com/corpora"

# name | bytes | sha256 | path under $BASE
#
# Sizes and hashes were taken from a verified download, each checked against
# the S3 Content-Length before hashing. A mismatch below means the upstream
# object changed, not that your download is merely incomplete — investigate
# rather than deleting and retrying.
MANIFEST=(
  "ubnist1.casper-rw.gen2.E01|116788106|c15c836993331b0e6ff37d2fdbbdf8798dfd92723b8839e1fcebe80892d97ad9|drives/nps-2009-casper-rw/ubnist1.casper-rw.gen2.E01"
  "ubnist1.casper-rw.gen3.E01|168365166|f2ad970ab2c8ed41e2d26d0c7e821aaee0bb6fe71063ae17bea894306a8e55ff|drives/nps-2009-casper-rw/ubnist1.casper-rw.gen3.E01"
  "ubnist1.gen0.E01|728367756|4c517df5e66c24e849fe43a460b50638f2c6cffb571e3e7fbb60255cc2392eaf|drives/nps-2009-ubnist1/ubnist1.gen0.E01"
  "ubnist1.gen3.aff|890164681|60f427154ce917600873f96ecb4098cb2079f46aa80a3fe8ffe88c2bd212c932|drives/nps-2009-ubnist1/ubnist1.gen3.aff"
  "ubnist1.gen3.001|536870912|0aebf1edbd2f4d4076d662ed5a8c1f9dafd7d9a264f0eecbe354c579e13665fa|drives/nps-2009-ubnist1/ubnist1.gen3.001"
  "ubnist1.gen3.002|536870912|6a19d436c73166204cee238a977ec56b63bf68aa4bc9e1d75fc8ea6cfa9c8a0b|drives/nps-2009-ubnist1/ubnist1.gen3.002"
  "ubnist1.gen3.003|536870912|c61c99532e4fc43b7532b1376ad9abd1f7d03aef636c295cae8bc41935e10d3f|drives/nps-2009-ubnist1/ubnist1.gen3.003"
  "ubnist1.gen3.004|495976448|9081988c9e10cc0766e3ee5c274beba674816023f759e1958fd1ca1453d90eaa|drives/nps-2009-ubnist1/ubnist1.gen3.004"
  "ubnist1.gen3.raw|2106589184|c0172d79ec23b2fce54e725b00062a38fc3988dfc036b4aa99bbaf243628b3fb|drives/nps-2009-ubnist1/ubnist1.gen3.raw"

  # ── Linux threat-analysis scenario (2020) ────────────────────────────────
  # Feeds two lanes the task board still marks "not started": Linux logs and
  # syslog. The three log archives are small enough to iterate on quickly.
  "internaldns_logs.zip|1741837|63a0f1928b15e52f178db52c33e2aaaf7f75046a62149e01a0ead42262bf4c49|scenarios/2020-linux-threat-analysis/Stage2/internaldns_logs.zip"
  "pfsense_logs.zip|14187201|d7ae073400814a001a9d45350d597a8fc773e81fed6a969e7b628cb0d9f7c0a1|scenarios/2020-linux-threat-analysis/Stage2/pfsense_logs.zip"
  "dualserver_logs.zip|17998746|133d2139de15ac187f8a93cdbe949cae252271a2f3c1ab21bad1ac8060faf96d|scenarios/2020-linux-threat-analysis/Stage2/dualserver_logs.zip"
  "linux-swapfile.7z|5505845|a617a0646a7b6434dca917c83404b1b19fe226e30559f1bba608babc3566baf0|scenarios/2020-linux-threat-analysis/Stage5/swapfile.7z"
  "ggmemday1.7z|552477198|6d1f09d052be60a99c158f15e06b8ff5a9a3bd828910d6ac6756b13924f87d0f|scenarios/2020-linux-threat-analysis/Stage1/ggmemday1.7z"
  "mmmemend.7z|605380634|25e14f285683bd4a3e036ec539fc8120f9c423f644e285ab9f36b8a28c405576|scenarios/2020-linux-threat-analysis/Stage5/mmmemend.7z"

  # ── Network captures ─────────────────────────────────────────────────────
  "Day_1_Capture.7z|924827765|3f75a2f78beee4abe8876be311c5dd5729556482d1c903758eb7651a8cf7c31a|scenarios/2020-linux-threat-analysis/Stage1/Day_1_Capture.7z"
  "Day_2_Capture.7z|486142014|ae46a724b2f0a0de91a28511a4c69fb8786f538e8ce8ef516baa6dcc7a609701|scenarios/2020-linux-threat-analysis/Stage1/Day_2_Capture.7z"
  "multifile_25_21.pcap|52986978|7864cb02c73143da436696ceaef0d74f6def5525776ec161152d28c017b672be|packets/2013-httpxfer/multifile_25_21.pcap"
  "ngdc-interior-2012-07-10.pcap|26069999|d47a9e1144c92a5a818b295546bf5c3219a2bb18a21bb9dcc9702ee48f200548|scenarios/2012-ngdc/net/ngdc-interior-2012-07-10.pcap"
  "5gb-tcp-connection.pcap.gz|832659417|5e9e12de5f4e2b762645f3204af4d30a4f56b1a4a6c253b41b9104e3552997c6|packets/5gb-tcp-connection.pcap.gz"

  # ── DFRWS 2021 challenge ─────────────────────────────────────────────────
  "1_Skimmer_mSD.zip|36665139|1c5ad394daa49573f4088a31fb7f6a3f537dbcd092fdfd5abc8b572ebedbc262|dfrws/challenge-2021/1_Skimmer_mSD.zip"
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
