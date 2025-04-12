#!/bin/bash
#
# This script uses docker exec to directly run the restart_splunk.yml handler inside the Splunk container

CONTAINER="splunk-enterprise"
RESTART_HANDLER="/opt/ansible/roles/splunk_common/handlers/restart_splunk.yml"

echo "🔄 Restarting Splunk using Ansible..."

# Verify the container is running
if ! docker ps --format '{{.Names}}' | grep -qw "$CONTAINER"; then
    echo "❌ Error: Container '$CONTAINER' is not running."
    exit 1
fi

# Verify the handler exists inside the container
docker exec "$CONTAINER" test -f "$RESTART_HANDLER"
if [ $? -ne 0 ]; then
    echo "❌ Error: Restart handler '$RESTART_HANDLER' not found inside container '$CONTAINER'."
    exit 1
fi

# Create a temporary wrapper playbook to run the handler
echo "⚙️ Creating temporary playbook wrapper"
TEMP_PLAYBOOK="/tmp/restart_wrapper.yml"

cat << EOF > $TEMP_PLAYBOOK
---
- name: Execute Splunk Restart Handler
  hosts: localhost
  gather_facts: false
  tasks:
    - name: Include restart handler
      include_tasks: $RESTART_HANDLER
EOF

# Copy the wrapper playbook to the container
docker cp $TEMP_PLAYBOOK $CONTAINER:/tmp/restart_wrapper.yml

# Execute the wrapper playbook to run the restart handler
echo "⚙️ Executing restart handler"
docker exec -it "$CONTAINER" ansible-playbook /tmp/restart_wrapper.yml -v

# Clean up
rm $TEMP_PLAYBOOK
docker exec "$CONTAINER" rm /tmp/restart_wrapper.yml

echo "✅ Restart command executed successfully."