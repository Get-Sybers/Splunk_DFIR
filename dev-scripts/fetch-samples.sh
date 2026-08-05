#!/bin/bash
#
# Fetch DFIR test samples that cannot live in git.
#
#   ./dev-scripts/fetch-samples.sh --list              # every group and its size
#   ./dev-scripts/fetch-samples.sh --list <group>      # the files in one group
#   ./dev-scripts/fetch-samples.sh --fetch <group>     # fetch one group
#   ./dev-scripts/fetch-samples.sh --fetch all --yes   # fetch everything (2.8 TB)
#   ./dev-scripts/fetch-samples.sh --verify [<group>]  # re-check what is on disk
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
#   from the public source they came from. That is reproducible anywhere with
#   outbound access to Digital Corpora, costs no LFS quota, and needs no
#   git-lfs on the client.
#
# TWO LEVELS OF VERIFICATION, and the difference matters:
#
#   sha256 present  — pinned to a hash computed by streaming the object
#                     through sha256sum. A mismatch means the upstream object
#                     changed or the download was tampered with.
#   sha256 is "-"   — size-verified only. The manifest carries S3's own
#                     Content-Length, so a truncated or wrong-file download is
#                     still caught, but a same-size substitution is not.
#                     Hashing all 2.8 TB takes roughly a day of streaming;
#                     entries are promoted from "-" as that work is done.
#
# The small samples committed under samples/ need none of this. Everything
# here lands in samples/large/<group>/, which is gitignored. Do not commit it.

set -euo pipefail

SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"
REPO_ROOT_DIR="$(realpath "$SCRIPT_DIR/..")"
cd "$REPO_ROOT_DIR"

DEST="samples/large"
BASE="https://digitalcorpora.s3.amazonaws.com/corpora"
MANIFEST_FILE="dev-scripts/samples-manifest.tsv"

[[ -f "$MANIFEST_FILE" ]] || { echo "missing $MANIFEST_FILE" >&2; exit 1; }

human() { numfmt --to=iec --suffix=B "$1" 2>/dev/null || echo "$1 bytes"; }

# A progress bar is worth having on a multi-GB file, but curl falls back to its
# full transfer table when stdout is not a terminal, which turns a CI log into
# noise. Show the bar interactively, stay quiet when piped.
if [[ -t 1 ]]; then CURL_PROGRESS=(--progress-bar); else CURL_PROGRESS=(--no-progress-meter); fi

# Every read of the manifest goes through here, so the comment convention is
# defined in exactly one place.
manifest_rows() { grep -v '^#' "$MANIFEST_FILE" | grep -v '^[[:space:]]*$'; }

rows_for() { # group, where "all" matches everything
    if [[ "$1" == "all" ]]; then manifest_rows
    else manifest_rows | awk -F'\t' -v g="$1" '$1==g'
    fi
}

list_groups() {
    printf '%-38s %6s %10s %s\n' GROUP FILES SIZE PINNED
    manifest_rows | awk -F'\t' '
        { n[$1]++; b[$1]+=$3; if ($4!="-") p[$1]++ }
        END { for (g in n) printf "%s\t%d\t%d\t%d\n", g, n[g], b[g], p[g]+0 }' \
    | sort | while IFS=$'\t' read -r g n b p; do
        printf '%-38s %6d %10s %d/%d\n' "$g" "$n" "$(human "$b")" "$p" "$n"
    done
    echo
    manifest_rows | awk -F'\t' '
        { n++; b+=$3; if ($4!="-") p++ }
        END { printf "%d files, %.1f GB total, %d hash-pinned\n", n, b/1024/1024/1024, p+0 }'
}

list_group() { # group
    local rows; rows="$(rows_for "$1")"
    [[ -n "$rows" ]] || { echo "no such group: $1" >&2; echo "try --list" >&2; exit 2; }
    printf '%-44s %10s  %s\n' NAME SIZE SHA256
    while IFS=$'\t' read -r _ name bytes sha _; do
        printf '%-44s %10s  %s\n' "$name" "$(human "$bytes")" \
            "$( [[ "$sha" == "-" ]] && echo 'size only' || echo "${sha:0:16}…" )"
    done <<< "$rows"
}

# 0 when the file matches its manifest row: size always, hash when pinned.
verify_one() { # path bytes sha
    local path="$1" bytes="$2" sha="$3" actual
    [[ -f "$path" ]] || return 1
    [[ "$(stat -c%s "$path")" == "$bytes" ]] || return 1
    [[ "$sha" == "-" ]] && return 0
    actual="$(sha256sum "$path" | cut -d' ' -f1)"
    [[ "$actual" == "$sha" ]]
}

verify_all() { # group
    local ok=0 bad=0 missing=0 sizeonly=0 group name bytes sha _ f
    while IFS=$'\t' read -r group name bytes sha _; do
        f="$DEST/$group/$name"
        if [[ ! -f "$f" ]]; then
            missing=$(( missing + 1 ))
        elif verify_one "$f" "$bytes" "$sha"; then
            if [[ "$sha" == "-" ]]; then
                printf '  ◑ %-42s %s (size only)\n' "$name" "$(human "$bytes")"
                sizeonly=$(( sizeonly + 1 ))
            else
                printf '  ✅ %-42s %s\n' "$name" "$(human "$bytes")"
                ok=$(( ok + 1 ))
            fi
        else
            printf '  ❌ %-42s FAILED verification\n' "$name"
            bad=$(( bad + 1 ))
        fi
    done <<< "$(rows_for "${1:-all}")"
    echo
    echo "hash-verified: $ok   size-only: $sizeonly   failed: $bad   not fetched: $missing"
    [[ "$bad" -eq 0 ]]
}

fetch_group() { # group
    local group="$1" rows total avail failed=0 g name bytes sha rel out
    rows="$(rows_for "$group")"
    [[ -n "$rows" ]] || { echo "no such group: $group" >&2; echo "try --list" >&2; exit 2; }

    total=$(awk -F'\t' '{b+=$3} END{print b+0}' <<< "$rows")
    echo "Group: $group"
    echo "Size:  $(human "$total") across $(wc -l <<< "$rows") file(s)"
    echo "Source: Digital Corpora (public). Nothing here is case evidence."

    # Refusing up front beats dying half way through a 400 GB fetch.
    avail=$(stat -f --format="%a" . )
    avail=$(( avail * $(stat -f --format="%S" .) ))
    if (( avail < total )); then
        echo
        echo "❌ not enough disk: $(human "$avail") free, $(human "$total") needed" >&2
        return 1
    fi
    echo

    while IFS=$'\t' read -r g name bytes sha rel; do
        mkdir -p "$DEST/$g"
        out="$DEST/$g/$name"
        if verify_one "$out" "$bytes" "$sha"; then
            printf '  ✅ %-42s already present\n' "$name"
            continue
        fi
        printf '  ⬇  %-42s %s\n' "$name" "$(human "$bytes")"
        # -C - resumes a partial file. A dropped connection part way through a
        # multi-GB image is the normal failure here, not a rare one.
        if ! curl -fSL "${CURL_PROGRESS[@]}" --retry 3 --retry-delay 5 -C - -o "$out" "$BASE/$rel"; then
            printf '  ❌ %-42s download failed\n' "$name"; failed=$(( failed + 1 )); continue
        fi
        if verify_one "$out" "$bytes" "$sha"; then
            printf '  ✅ %-42s verified\n' "$name"
        else
            printf '  ❌ %-42s verification FAILED\n' "$name"; failed=$(( failed + 1 ))
        fi
    done <<< "$rows"

    echo
    if (( failed > 0 )); then
        echo "❌ $failed file(s) failed. Re-run to resume; downloads continue where they stopped."
        return 1
    fi
    echo "✅ $group fetched and verified"
}

case "${1:---list}" in
    --list)   if [[ -n "${2:-}" ]]; then list_group "$2"; else list_groups; fi ;;
    --verify) verify_all "${2:-all}" ;;
    --fetch)
        group="${2:-}"
        [[ -n "$group" ]] || { echo "usage: $0 --fetch <group|all>" >&2; exit 2; }
        if [[ "$group" == "all" && "${3:-}" != "--yes" ]]; then
            echo "Refusing to fetch all 2.8 TB without --yes." >&2
            echo "Pick a group instead: $0 --list" >&2
            exit 2
        fi
        fetch_group "$group"
        ;;
    -h|--help) sed -n '2,37p' "$0" | sed 's/^# \{0,1\}//' ;;
    *)
        echo "unknown option: $1" >&2
        echo "usage: $0 [--list [group]|--fetch <group|all>|--verify [group]|--help]" >&2
        exit 2
        ;;
esac
