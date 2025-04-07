#!/bin/bash
#
# This script allows entering a running Docker container in interactive mode.
# Usage: ./into.sh <container_name>
#

ROOT_DIR=$(cd $(dirname $0)/..; pwd);

if [[ $# -eq 0 ]]; then
    echo "Usage: $0 <container>"
    exit 1
fi

docker exec \
    --env-file "$ROOT_DIR"/.env.defaults \
    --env-file "$ROOT_DIR"/.env \
    --privileged \
    -it "$1" bash