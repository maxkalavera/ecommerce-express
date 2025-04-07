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


ROOT_DIR=$(cd $(dirname $0)/..; pwd);

docker compose \
    --env-file "$ROOT_DIR"/.env.defaults \
    --env-file "$ROOT_DIR"/.env \
    -f "$ROOT_DIR"/docker/docker-compose.yml \
    "$@"