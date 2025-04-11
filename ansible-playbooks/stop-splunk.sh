#!/bin/bash
# run-playbook.sh
#
# Usage: ./run-playbook.sh <container_name> <playbook_file>
#
# This script uses docker exec to run an Ansible playbook inside a specified Docker container.
# Ensure the container is running and that Ansible and the playbooks are available inside it.

CONTAINER="splunk-enterprise"
PLAYBOOK="stop_splunk.yml"


# Verify the container is running
if ! docker ps --format '{{.Names}}' | grep -qw "$CONTAINER"; then
    echo "Error: Container '$CONTAINER' is not running."
    exit 1
fi

# Optionally, check if the playbook exists inside the container.
# This step requires the container to have 'test' command available.
docker exec "$CONTAINER" test -f "$PLAYBOOK"
if [ $? -ne 0 ]; then
    echo "Error: Playbook '$PLAYBOOK' not found inside container '$CONTAINER'."
    exit 1
fi

# Execute the playbook using ansible-playbook inside the container
docker exec -it "$CONTAINER" ansible-playbook "$PLAYBOOK"

# End of script