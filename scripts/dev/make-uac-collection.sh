#!/bin/bash
#
# Build a UAC (Unix-like Artifacts Collector) collection from a Linux disk
# image already in a case — the fixtures the UAC lane and godaemonhunter's
# collection support were developed against. A dev helper, like the rest of
# scripts/dev/: unsupported, and nothing here is case evidence handling the
# pipeline depends on.
#
#   scripts/dev/make-uac-collection.sh [options] <image>
#
#   --gomount BIN      the gomount binary to stage with (default: $GOMOUNT_BIN,
#                      else `gomount` on PATH); it must carry `stream --all`
#                      (gomount >= 0.3.0)
#   --lv vg/lv         the root volume as an LVM2 logical volume (identify lists
#                      the stack; a plain partition: --volume N; default: gomount's
#                      auto-select, the volume holding /etc/os-release)
#   --volume N         the root volume by its 1-based index in the resolved stack
#   --out DIR          where the collection lands (default: data_store/raw/UAC)
#   --formats LIST     tar, zip, or tar,zip (default: tar — UAC's zip dereferences
#                      symlinks, so the systemd *.wants/ links do not survive it)
#   --profile NAME     the UAC profile (default: offline_ir_triage)
#   --case ID          --case-number for UAC's acquisition log (default: the
#                      collection the image sits in, else "")
#   --uac-ref TAG      the UAC release to run (default: v3.4.0), cloned once into
#                      data_store/dependencies/uac/
#   --keep-runner      keep the runner image (dxdfir-uac-runner:<tag>) afterwards
#
# HOW IT WORKS. gomount reads the image in userspace (no mount, no loop device,
# no root) and `stream --all` emits the root volume as a tar carrying every
# directory, symlink and owner; that extracts into a throwaway container's own
# filesystem — not a bind mount, so nothing root-owned lands on the host — and
# UAC runs over it in `--mount-point` mode, the network off, writing
# uac-<hostname>-linux-<timestamp>.<tar.gz|zip> and the acquisition log
# (uac-<…>.log) into --out, chowned to you. A collection takes minutes per
# image: the bodyfile (stat of every file) and executable hashing dominate.
#
# Everything the run needs on the host is docker; the runner image is alpine
# plus the GNU find/stat/tar/gzip/zip UAC's collectors call.

set -euo pipefail

SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"
# this script lives in scripts/dev/, so the repo root is two levels up
REPO_ROOT_DIR="$(realpath "$SCRIPT_DIR/../..")"
cd "$REPO_ROOT_DIR"

GOMOUNT="${GOMOUNT_BIN:-}"
SELECT=()
OUT=""
FORMATS="tar"
PROFILE="offline_ir_triage"
CASE=""
UAC_REF="v3.4.0"
KEEP_RUNNER=false
IMAGE=""

usage() { sed -n '2,45p' "$0" | sed 's/^# \{0,1\}//'; exit "${1:-2}"; }

while [[ $# -gt 0 ]]; do
    case "$1" in
        --gomount)     GOMOUNT="${2:?}"; shift 2 ;;
        --lv)          SELECT=(--lv "${2:?}"); shift 2 ;;
        --volume)      SELECT=(--volume "${2:?}"); shift 2 ;;
        --out)         OUT="${2:?}"; shift 2 ;;
        --formats)     FORMATS="${2:?}"; shift 2 ;;
        --profile)     PROFILE="${2:?}"; shift 2 ;;
        --case)        CASE="${2:?}"; shift 2 ;;
        --uac-ref)     UAC_REF="${2:?}"; shift 2 ;;
        --keep-runner) KEEP_RUNNER=true; shift ;;
        -h|--help)     usage 0 ;;
        -*)            echo "unknown option: $1" >&2; usage 2 ;;
        *)             [[ -z "$IMAGE" ]] || { echo "one image at a time" >&2; usage 2; }; IMAGE="$1"; shift ;;
    esac
done
[[ -n "$IMAGE" ]] || usage 2
[[ -f "$IMAGE" ]] || { echo "no such image: $IMAGE" >&2; exit 2; }
command -v docker >/dev/null 2>&1 || { echo "docker is required" >&2; exit 2; }
if [[ -z "$GOMOUNT" ]]; then
    GOMOUNT="$(command -v gomount || true)"
fi
[[ -n "$GOMOUNT" && -x "$GOMOUNT" ]] || { echo "gomount binary not found: pass --gomount BIN or set GOMOUNT_BIN" >&2; exit 2; }
if ! "$GOMOUNT" stream --help 2>&1 | grep -q -- '--all'; then
    echo "this gomount has no 'stream --all' (needs gomount >= 0.3.0): $GOMOUNT" >&2; exit 2
fi
case "$FORMATS" in tar|zip|tar,zip|zip,tar) ;; *) echo "--formats must be tar, zip or tar,zip" >&2; exit 2 ;; esac

IMAGE="$(readlink -f "$IMAGE")"
IMAGE_DIR="$(dirname "$IMAGE")"
IMAGE_BASE="$(basename "$IMAGE")"
# the collection the image sits in, when it does: data_store/raw/collections/<name>/…
if [[ -z "$CASE" ]]; then
    case "$IMAGE" in
        "$REPO_ROOT_DIR"/data_store/raw/collections/*)
            CASE="${IMAGE#"$REPO_ROOT_DIR"/data_store/raw/collections/}"; CASE="${CASE%%/*}" ;;
    esac
fi
if [[ -z "$OUT" ]]; then
    if [[ -n "$CASE" && -d "data_store/raw/collections/$CASE" ]]; then
        OUT="data_store/raw/collections/$CASE/UAC"
    else
        OUT="data_store/raw/UAC"
    fi
fi
mkdir -p "$OUT"
OUT="$(readlink -f "$OUT")"

# the UAC release, cloned once beside the other operator-supplied tools
UAC_DIR="data_store/dependencies/uac"
if [[ ! -x "$UAC_DIR/uac" ]]; then
    echo "fetching UAC $UAC_REF into $UAC_DIR"
    git clone --quiet --depth 1 --branch "$UAC_REF" https://github.com/tclahr/uac.git "$UAC_DIR"
fi
UAC_HAVE="$(git -C "$UAC_DIR" describe --tags --always 2>/dev/null || echo unknown)"
[[ "$UAC_HAVE" == "$UAC_REF" ]] || echo "note: $UAC_DIR is at $UAC_HAVE, not $UAC_REF (remove it to re-fetch)"
UAC_DIR="$(readlink -f "$UAC_DIR")"

# the runner: alpine + the GNU userland UAC's collectors call, built once
RUNNER="dxdfir-uac-runner:3.22"
if ! docker image inspect "$RUNNER" >/dev/null 2>&1; then
    echo "building the runner image $RUNNER"
    docker build -q -t "$RUNNER" - <<'DOCKERFILE' >/dev/null
FROM alpine:3.22
RUN apk add --no-cache tar gzip zip coreutils findutils
DOCKERFILE
fi

OWNER="$(id -u):$(stat -c %g "$OUT")"
echo "image:    $IMAGE"
echo "volume:   ${SELECT[*]:-auto}"
echo "out:      $OUT  (case: ${CASE:-none}, formats: $FORMATS, profile: $PROFILE, UAC $UAC_REF)"

docker run --rm --network none \
    -v "$IMAGE_DIR:/evidence:ro" -v "$GOMOUNT:/opt/gomount:ro" -v "$UAC_DIR:/uac:ro" -v "$OUT:/out" \
    -e IMAGE_BASE="$IMAGE_BASE" -e SELECT="${SELECT[*]:-}" -e FORMATS="${FORMATS//,/ }" \
    -e PROFILE="$PROFILE" -e CASE="$CASE" -e OWNER="$OWNER" \
    --entrypoint sh "$RUNNER" -c '
set -eu
mkdir -p /mnt/image
echo "== staging: gomount stream --all $SELECT /evidence/$IMAGE_BASE"
start=$(date +%s)
# shellcheck disable=SC2086
/opt/gomount stream --all $SELECT "/evidence/$IMAGE_BASE" | tar -xpf - --same-owner --numeric-owner -C /mnt/image
echo "== staged in $(( $(date +%s) - start ))s: $(find /mnt/image | wc -l) entries"
cd /uac
for fmt in $FORMATS; do
  echo "== uac -p $PROFILE -f $fmt --mount-point /mnt/image"
  start=$(date +%s)
  ./uac -p "$PROFILE" --mount-point /mnt/image --operating-system linux -f "$fmt" --temp-dir /tmp \
    --case-number "$CASE" --evidence-number "$IMAGE_BASE" --examiner dx_dfir \
    --description "UAC offline collection of $IMAGE_BASE, root volume staged by gomount stream --all" /out \
    2>&1 | tail -6
  echo "== uac $fmt done in $(( $(date +%s) - start ))s"
done
chown "$OWNER" /out/uac-*
chmod 0640 /out/uac-*
ls -la /out
'
if [[ "$KEEP_RUNNER" != true ]]; then
    docker image rm -f "$RUNNER" >/dev/null 2>&1 || true
fi
echo "done: $OUT"
