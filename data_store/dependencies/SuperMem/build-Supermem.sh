#/bin/bash
SUPERMEM_DOCKER_DIR="$(dirname "$(readlink -f "$0")")"
docker build -t supermem-image ${SUPERMEM_DOCKER_DIR}