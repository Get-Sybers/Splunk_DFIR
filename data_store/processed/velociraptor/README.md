# Velociraptor Processed Data

This directory contains processed Velociraptor JSON output files.

## Structure

Place Velociraptor JSON output files here. To have these files ingested into Splunk, ensure a corresponding `monitor` stanza for `/data/processed/velociraptor/...` (or your environment's equivalent) is configured in `splunk/etc/system/local/inputs.conf` or the appropriate Splunk app.

## Naming Convention

Velociraptor artifact names will be automatically extracted from the source filename.
Example: `Windows.System.TaskScheduler.json` will extract the artifact name from the filename.
