#!/bin/sh
# The ONLY script the yara image may run (baked, allow-listed): per-file scan
# over the mounted list with the mounted include index. No arguments accepted.
set -eu
while IFS= read -r f; do
    [ -n "$f" ] && yara -w -s -N /index.yar "$f" || true
done < /list.txt
