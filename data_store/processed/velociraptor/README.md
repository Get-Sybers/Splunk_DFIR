# Velociraptor Processed Data

This directory contains processed Velociraptor JSON output files.

## Structure

Place Velociraptor JSON output files here. To have these files ingested into Splunk, ensure a corresponding `monitor` stanza for `/data/processed/velociraptor/...` (or your environment's equivalent) is configured in `splunk/etc/system/local/inputs.conf` or the appropriate Splunk app.

## Data Requirements

Velociraptor JSON files must contain a `src_artifact` field for proper sourcetype assignment. This field is automatically included in Velociraptor's JSON output and identifies the artifact type (e.g., `artifact_Windows_EventLogs_Evtx`, `artifact_Linux_Search_FileFinder`).

The `src_artifact` field is used to:
1. Dynamically set the sourcetype (converted to lowercase)
2. Determine the appropriate timestamp field for the artifact type

## Example

```json
{
  "src_artifact": "artifact_Windows_EventLogs_Evtx",
  "TimeCreated": "2024-01-15T10:30:45Z",
  "EventID": 4624,
  ...
}
```

This event would be indexed with sourcetype `artifact_windows_eventlogs_evtx` and the timestamp extracted from the `TimeCreated` field.
