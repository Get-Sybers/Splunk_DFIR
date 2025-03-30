# MITRE CAR Analytics for Splunk - Setup Guide

This guide will help you set up and use the MITRE CAR Analytics custom search command in Splunk.

## Overview

The Splunk_Mitre_CAR app allows you to search and analyze MITRE Cyber Analytics Repository (CAR) analytics directly within Splunk using SPL-like syntax. The app loads CAR analytics from YAML files and lets you query their metadata, implementations, and other properties.

## Installation

1. Create a new Splunk app directory structure:

```
$SPLUNK_HOME/etc/apps/Splunk_Mitre_CAR/
├── bin/
│   ├── analytic_class.py
│   ├── car_search.py
│   └── load_analytics.py
├── car_analytics/  # Directory for your CAR yaml files
├── default/
│   ├── app.conf
│   └── commands.conf
└── README.md
```

2. Copy the provided Python files to the `bin/` directory:
   - analytic_class.py
   - car_search.py
   - load_analytics.py

3. Copy the configuration files to the `default/` directory:
   - commands.conf
   - app.conf

4. Create the `car_analytics/` directory and populate it with CAR YAML files.
   You can get these files from the [MITRE CAR GitHub repository](https://github.com/mitre-attack/car/tree/master/analytics).

5. Restart Splunk to load the new app and custom command.

## Required Python Dependencies

The app requires the following Python modules:
- PyYAML (for parsing YAML files)

You can install the required dependencies using:
```
$SPLUNK_HOME/bin/splunk cmd python -m pip install pyyaml
```

## Usage

Once installed, you can use the `car_search` command in your Splunk searches:

```
| car_search id=* | table id, title, platforms
```

### Query Syntax

The query syntax is similar to SPL:

```
| car_search <field>=<value> [<field>=<value> ...] | table <field1>, <field2>, ...
```

### Examples:

1. List all analytics:
```
| car_search id=* | table id, title, submission_date
```

2. Find analytics for a specific platform:
```
| car_search platforms=Windows | table id, title, analytic_types
```

3. View implementations for a specific analytic:
```
| car_search id=CAR-2013-01-002 | table id, title, implementations
```

4. Extract specific implementation details:
```
| car_search id=* platforms=Windows | table id, title, implementations.code, implementations.type
```

5. Find analytics by technique:
```
| car_search id=* | table id, title, coverage
```

### Wildcards

You can use wildcards in your queries:
- `id=CAR-2013-*` - All analytics from 2013
- `platforms=*` - All analytics with any platform defined
- `title=*Registry*` - All analytics with "Registry" in the title

## Troubleshooting

If you encounter issues:

1. Check Splunk logs at `$SPLUNK_HOME/var/log/splunk/splunkd.log`
2. Verify that your YAML files are valid and in the correct directory
3. Ensure all required Python dependencies are installed
4. Check that file permissions allow Splunk to read the files

## Advanced Configuration

You can specify a custom directory for CAR analytics by adding the `analytics_dir` option:

```
| car_search analytics_dir=/path/to/analytics id=* | table id, title
```