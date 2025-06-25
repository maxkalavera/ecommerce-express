#!/bin/bash
#
# Docker Compose Runner Script
# 
# This script provides a convenient way to run Docker Compose commands for the ecommerce-express
# application. It automatically loads environment variables from .env.defaults and .env files,
# and uses the docker-compose.yml configuration from the docker directory.
#
# Usage: ./run.sh [docker-compose commands and arguments]
#

# Load default environment variables from .env.defaults file if it exists
if [ -f "$ROOT_DIR"/.env.defaults ]; then
    source "$ROOT_DIR"/.env.defaults
fi

# Load environment variables from .env file if it exists
if [ -f "$ROOT_DIR"/.env ]; then
    source "$ROOT_DIR"/.env
fi

ROOT_DIR=$(cd $(dirname $0)/..; pwd);
DOCKER_COMPOSE_FILE="$ROOT_DIR"/docker/docker-compose.yml;

docker compose \
    --env-file "$ROOT_DIR"/.env.defaults \
    --env-file "$ROOT_DIR"/.env \
    -f "$DOCKER_COMPOSE_FILE" \
    "$@"