# Velociraptor App for Splunk

## Overview

This Splunk app provides configuration for ingesting Velociraptor JSON output files into Splunk for DFIR analysis.

## Features

- **JSON Parsing**: Automatically parses Velociraptor JSON output with proper field extraction
- **Artifact Extraction**: Automatically extracts the artifact name from the source filename and sets it as the sourcetype
- **Timestamp Handling**: Supports multiple timestamp formats commonly used in Velociraptor output

## Sourcetype Configuration

### Base Sourcetype: `velociraptor:json`

All Velociraptor JSON files are initially assigned the `velociraptor:json` sourcetype, which is then dynamically updated based on the artifact name extracted from the filename.

### Dynamic Sourcetype Assignment

The app automatically extracts the artifact name from the filename and creates specific sourcetypes:

- `Windows.System.TaskScheduler.json` → `velociraptor:Windows.System.TaskScheduler`
- `Generic.Client.Info.json` → `velociraptor:Generic.Client.Info`
- `Linux.Sys.Pslist.json` → `velociraptor:Linux.Sys.Pslist`

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
sourcetype=velociraptor:*
```

Search for specific artifact:
```spl
sourcetype=velociraptor:Windows.System.TaskScheduler
```

View all available Velociraptor artifacts:
```spl
| metadata type=sourcetypes 
| search sourcetype=velociraptor:*
| table sourcetype
```

## Configuration Files

- `default/props.conf` - Defines the base sourcetype and parsing configuration
- `default/transforms.conf` - Extracts artifact name from filename
- `default/app.conf` - App metadata and settings
- `metadata/default.meta` - App permissions

## Supported Timestamp Fields

The app automatically extracts timestamps from the following fields:
- `_ts` - Velociraptor's internal timestamp
- `timestamp` - Generic timestamp field
- `Mtime`, `Atime`, `Ctime` - Filesystem timestamps
- `StartTime`, `EventTime` - Process and event timestamps

## Notes

- JSON files should follow the naming convention: `<artifact.name>.json`
- The artifact name will be extracted from everything before `.json` in the filename
- All JSON events are indexed with full field extraction enabled

## Version

1.0.0

## Author

get-sybers
