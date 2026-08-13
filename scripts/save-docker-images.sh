#!/bin/bash
# ==============================================================================
# Pre-seed the DX_DFIR analysis images as tarballs for offline hosts.
#
# The processing scripts pull their images from a registry on first use, which
# an air-gapped analysis host cannot do. This script is the online-side step:
# pull each image and `docker save` it into data_store/docker_images/ so the
# tarballs can be carried to the offline host, where `--load` (or the manual
# `docker load -i` in the docs) brings them back.
#
# Split out of setup-environment.sh, which now only prepares the host — image
# management is a separate concern with its own online/offline lifecycle.
#
# The daemon is reached the same way as setup-environment.sh: prefer the
# unprivileged socket, fall back to sudo, and say plainly when neither answers
# rather than letting a bare `docker` fail mid-loop.
#
# Usage:
#   scripts/save-docker-images.sh              pull and save every image
#   scripts/save-docker-images.sh --load       load every tarball already saved
#   scripts/save-docker-images.sh --list       show the images this manages
#   scripts/save-docker-images.sh --help
# ==============================================================================

set -o pipefail

SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"
REPO_ROOT_DIR="$(realpath "$SCRIPT_DIR/..")"
DOCKER_TAR_DIR="$REPO_ROOT_DIR/data_store/docker_images"

# Docker images the processing scripts run. Keep in step with the same list in
# setup-environment.sh's documentation and the individual process-*.sh scripts.
IMAGES=(
    "log2timeline/plaso:latest"
    "zeek/zeek:latest"
    "mcr.microsoft.com/azuredataexplorer/kustainer-linux:latest"
)

MODE="save"

while [[ $# -gt 0 ]]; do
    case "$1" in
        --load) MODE="load" ;;
        --list) MODE="list" ;;
        -h|--help)
            sed -n '2,21p' "$0" | sed 's/^# \{0,1\}//'
            exit 0
            ;;
        *)
            echo "❌ Unknown option: $1"
            echo "   Usage: $0 [--load] [--list] [--help]"
            exit 1
            ;;
    esac
    shift
done

die() { echo "❌ $*" >&2; exit 1; }

if [[ "$MODE" == "list" ]]; then
    echo "Images managed by this script:"
    printf '   • %s\n' "${IMAGES[@]}"
    echo "Tarball directory: $DOCKER_TAR_DIR"
    exit 0
fi

################################################################################
# Resolve how to talk to the daemon.
#
# `command -v docker` only proves the CLI exists; the daemon may be stopped and
# group membership does not apply until a new login session. Prefer the
# unprivileged socket, fall back to an escalated one when sudo is available.
DOCKER_CMD=""
if docker info >/dev/null 2>&1; then
    DOCKER_CMD="docker"
elif command -v sudo >/dev/null 2>&1 && sudo docker info >/dev/null 2>&1; then
    DOCKER_CMD="sudo docker"
    echo "ℹ️  Talking to the Docker daemon via sudo (group membership needs a new login session)."
fi
[[ -n "$DOCKER_CMD" ]] || die "The Docker daemon is not reachable. Start it with: sudo systemctl start docker"

image_to_filename() { echo "$1" | tr '/' '_' | tr ':' '_'; }

################################################################################
if [[ "$MODE" == "load" ]]; then
    shopt -s nullglob
    TARBALLS=("$DOCKER_TAR_DIR"/*.tar)
    shopt -u nullglob
    [[ ${#TARBALLS[@]} -gt 0 ]] || die "No tar balls found in $DOCKER_TAR_DIR"

    echo "📦 Loading Docker images from $DOCKER_TAR_DIR:"
    echo "───────────────────────────────────────────────────"
    failed=0
    for tarfile in "${TARBALLS[@]}"; do
        echo "📦 Loading ${tarfile##*/}..."
        if $DOCKER_CMD load -i "$tarfile"; then
            echo "✅ Loaded ${tarfile##*/}"
        else
            echo "❌ Error loading ${tarfile##*/}"
            failed=$((failed + 1))
        fi
        echo "───────────────────────────────────────────"
    done
    if [[ $failed -gt 0 ]]; then
        die "$failed tar ball(s) failed to load."
    fi
    echo "✨ Finished loading Docker images"
    exit 0
fi

################################################################################
# MODE=save: pull each image and save it to a tarball.
mkdir -p "$DOCKER_TAR_DIR"

echo "📥 Pulling and saving Docker images to $DOCKER_TAR_DIR..."
echo ""
failed=0
for image in "${IMAGES[@]}"; do
    echo "🔄 Pulling $image..."
    if ! $DOCKER_CMD pull "$image"; then
        echo "❌ Failed to pull $image"
        failed=$((failed + 1))
        continue
    fi
    echo "✅ Pulled $image"

    image_filename="$(image_to_filename "$image")"
    echo "💾 Saving $image as $image_filename.tar..."
    if $DOCKER_CMD save "$image" -o "$DOCKER_TAR_DIR/$image_filename.tar"; then
        echo "✅ Saved $image_filename.tar"
    else
        echo "❌ Failed to save $image_filename.tar"
        failed=$((failed + 1))
    fi
    echo ""
done

if [[ $failed -gt 0 ]]; then
    die "$failed operation(s) failed."
fi

echo "🎉 All images saved to: $DOCKER_TAR_DIR"
echo "   Carry these to the offline host and run: scripts/save-docker-images.sh --load"
