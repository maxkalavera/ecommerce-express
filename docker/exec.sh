#!/bin/bash
#
# This script provides a convenient way to execute commands inside Docker containers. 
# It allows running commands in a specified container with proper environment 
# configuration and privileged access.
# Usage: ./into.sh <container_name> <command>

ROOT_DIR=$(cd $(dirname $0)/..; pwd);

if [[ $# -eq 0 ]]; then
    echo "Usage: $0 <container> <command>"
    exit 1
fi

docker exec \
    --env-file "$ROOT_DIR"/.env.defaults \
    --env-file "$ROOT_DIR"/.env \
    --privileged \
    -it "$1" bash \
    -c "${@:2}"