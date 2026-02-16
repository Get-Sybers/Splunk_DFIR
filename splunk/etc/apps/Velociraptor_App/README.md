# Velociraptor App for Splunk

## Overview

This Splunk app provides configuration for ingesting Velociraptor JSON output files into Splunk for DFIR analysis. It uses the Splunk-recommended VQL artifact configuration approach for optimal ingestion.

## Features

- **JSON Parsing**: Automatically parses Velociraptor JSON output with proper field extraction
- **Artifact-Based Sourcetype**: Automatically extracts the artifact name from the `src_artifact` field in the JSON data and sets it as the sourcetype
- **Smart Timestamp Handling**: Artifact-specific timestamp extraction using `INGEST_EVAL` for accurate event timing
- **Optimized Performance**: Configured with recommended settings from Splunk's VQL artifact flow

## Sourcetype Configuration

### Base Sourcetype: `velociraptor:json`

All Velociraptor JSON files are initially assigned the `velociraptor:json` sourcetype, which is then dynamically updated based on the `src_artifact` field in the JSON data.

### Dynamic Sourcetype Assignment

The app automatically extracts the artifact name from the `src_artifact` field and processes it for the sourcetype:

1. Removes "All " prefix (if present at the beginning)
2. Replaces URL-encoded characters (e.g., `%2F` → `/`)
3. Converts to lowercase

Examples:
- `src_artifact: "artifact_Windows_EventLogs_Evtx"` → `sourcetype: artifact_windows_eventlogs_evtx`
- `src_artifact: "artifact_Linux_Search_FileFinder"` → `sourcetype: artifact_linux_search_filefinder`
- `src_artifact: "artifact_Windows_Registry_UserAssist"` → `sourcetype: artifact_windows_registry_userassist`
- `src_artifact: "All DetectRaptor.Windows.Detection.LolRMM%2FResolvedDomains.json"` → `sourcetype: detectraptor.windows.detection.lolrmm/resolveddomains.json`

## Installation

1. Place this app in `$SPLUNK_HOME/etc/apps/`
2. Verify the monitor stanza for Velociraptor files exists in `splunk/etc/system/local/inputs.conf`:
   ```conf
   [monitor:///data/processed/velociraptor/*.json]
   disabled = false
   index = host
   sourcetype = velociraptor:json
   ```
   (This should already be configured if you're using the repository's default setup)
3. Restart Splunk
4. Place Velociraptor JSON files in the monitored directory: `data_store/processed/velociraptor/`

## Usage

### Example Searches

Find all Velociraptor events:
```spl
sourcetype=artifact_*
```

Search for specific artifact (Windows Event Logs):
```spl
sourcetype=artifact_windows_eventlogs_evtx
```

Search for User Assist artifacts:
```spl
sourcetype=artifact_windows_registry_userassist
```

View all available Velociraptor artifacts:
```spl
| metadata type=sourcetypes 
| search sourcetype=artifact_*
| table sourcetype
```

## Configuration Files

- `default/props.conf` - Defines the base sourcetype and parsing configuration based on Splunk VQL recommendations
- `default/transforms.conf` - Uses `INGEST_EVAL` to extract artifact name from `src_artifact` field and set artifact-specific timestamps
- `default/app.conf` - App metadata and settings
- `metadata/default.meta` - App permissions

## Supported Artifacts and Timestamp Fields

The app includes timestamp extraction for the following artifacts:

| Artifact | Timestamp Field | Format |
|----------|----------------|--------|
| Linux_Search_FileFinder | CTime | ISO 8601 |
| System_VFS_ListDirectory | ctime | ISO 8601 with nanoseconds |
| Windows_Timeline_MFT | event_time | ISO 8601 with nanoseconds |
| Windows_NTFS_MFT | Created0x10 | ISO 8601 with nanoseconds |
| Windows_EventLogs_Evtx | TimeCreated | ISO 8601 |
| Windows_EventLogs_RDPAuth | EventTime | ISO 8601 |
| Windows_Registry_UserAssist | LastExecution | ISO 8601 |
| Windows_Registry_RecentDocs | LastWriteTime | ISO 8601 |
| Windows_Forensics_UserAccessLogs_* | Various | ISO 8601 |
| MacOS_Applications_Chrome_History | last_visit_time | ISO 8601 |

And many more - see `transforms.conf` for the complete list.

## Notes

- JSON files must contain a `src_artifact` field for proper sourcetype assignment
- Timestamps are extracted based on artifact-specific field names
- The configuration uses `DATETIME_CONFIG = CURRENT` and `TZ = GMT` for consistent timestamp handling
- All JSON events are indexed with field extraction enabled via `INDEXED_EXTRACTIONS = json`

## Version

1.0.0

## Author

get-sybers
