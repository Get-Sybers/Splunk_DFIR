#!/usr/bin/env bash
# Start Filebeat (ships /logstash/<type>/ to Logstash on localhost:5044), then hand
# off to Logstash's own entrypoint in the foreground — Filebeat lives with Logstash
# on the SOF-ELK box, so they share this container.
set -e

if [ -d /usr/share/filebeat ]; then
  /usr/share/filebeat/filebeat \
    -c /usr/share/filebeat/filebeat.yml \
    --path.home /usr/share/filebeat \
    --path.data /usr/share/filebeat/data \
    --strict.perms=false &
fi

exec /usr/local/bin/docker-entrypoint
