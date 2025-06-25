# Load default environment variables from .env.defaults file if it exists
if [ -f "$ROOT_DIR"/.env.defaults ]; then
    source "$ROOT_DIR"/.env.defaults;
fi
# Load environment variables from .env file if it exists
if [ -f "$ROOT_DIR"/.env ]; then
    source "$ROOT_DIR"/.env;
fi

ROOT_DIR=$(cd $(dirname $0)/..; pwd);
DOCKER_COMPOSE_FILE="$ROOT_DIR/docker/docker-compose.yml";
LIST_CONTAINERS=$($ROOT_DIR/docker/run.sh ps | sed '1d' | awk '{print $1}');

if [ -z "$LIST_CONTAINERS" ]; then
    echo "No containers are currently running."
else
    echo "The following containers are currently running: "
    echo "$LIST_CONTAINERS"
fi
