# Log2Timeline Splunk Plugin

## Key Features

### Main Plugin (splunk.py)
- Integrates with plaso's output manager
- Handles field value conversion for Splunk format
- Manages timestamp conversion from plaso microseconds to epoch seconds
- Buffers events for efficient batch sending

### Shared Module (shared_splunk.py)
- HTTP Event Collector connection management
- SSL/TLS support with optional certificate verification
- Configurable buffering and flushing
- Proper error handling and logging
- Support for all standard Splunk HEC fields (index, sourcetype, source, host)

## Usage

Once installed, you'd use it like:

```bash
psort.py -o splunk --server splunk.example.com --port 8088 --token your-hec-token --index main --sourcetype plaso_timeline timeline.plaso
```

## Installation

1. Place `splunk.py` in your plaso `output/` directory
2. Place `shared_splunk.py` in the same `output/` directory
3. The plugin will auto-register when plaso loads

## Configuration Options

The plugin supports all the standard Splunk HEC parameters:

- Server/port configuration
- HEC token authentication
- Index, sourcetype, source, and host settings
- SSL configuration
- Batch size tuning

## Notes

You'll need to add the command-line argument parsing to plaso's argument parser to expose these options to users, but the core functionality is all there. The plugin follows the same patterns as the existing OpenSearch/Elasticsearch modules, so it should integrate seamlessly.