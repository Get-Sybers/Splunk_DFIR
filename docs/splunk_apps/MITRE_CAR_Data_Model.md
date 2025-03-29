# [App Name] Documentation

**Source:** [Official App URL](https://example.com)  
**Owner:** [App Vendor / Developer]  
**Documentation:** [Official documentation URL](https://example.com)  
**Purpose:** Brief description of what this app is used for.

https://www.youtube.com/watch?v=DmzcE-LZuF0&list=PLZ2P8UWIBhEaFyojaOFfIu-GHpiPaDo2g

---

## Table of Contents

- [Overview](#overview)
- [Dependencies](#dependencies)
- [Setup & Configuration](#setup--configuration)
- [Usage](#usage)
- [Data Inputs](#data-inputs)
- [App Contents](#app-contents)
- [Additional Notes](#additional-notes)

---

## Overview

Provide a high-level summary of the app, including its main function and role within your Splunk environment.

---

## Dependencies

List the required data sources, indexes, or other apps this depends on to function correctly.

- **Data Sources:** (e.g., Zeek logs, Windows Event Logs, Sysmon, etc.)
- **Indexes:** (e.g., `index=zeek`, `index=windows`, etc.)
- **Other Apps:** (e.g., MITRE ATT&CK for Splunk, Security Essentials, etc.)

---

## Setup & Configuration

Step-by-step guide on installing and configuring the app.

1. **Installation:**
   - Download from [Splunkbase](https://splunkbase.splunk.com).
   - Install via Splunk Web / CLI.

2. **Configuration:**
   - Configure inputs (`inputs.conf`)
   - Set up lookups (`lookups/`)
   - Modify knowledge objects if necessary

3. **Permissions & Access:**
   - Required roles/capabilities
   - Any special user/group access settings

---

## [MITRE CAR Data Models](https://github.com/mitre-attack/car/tree/master/docs/data_model)
- [authentication](https://github.com/mitre-attack/car/blob/master/docs/data_model/authentication.md)
- [driver](https://github.com/mitre-attack/car/blob/master/docs/data_model/driver.md)
- [email](https://github.com/mitre-attack/car/blob/master/docs/data_model/email.md)
- [file](https://github.com/mitre-attack/car/blob/master/docs/data_model/file.md)
- [flow](https://github.com/mitre-attack/car/blob/master/docs/data_model/flow.md)
- [http](https://github.com/mitre-attack/car/blob/master/docs/data_model/http.md)
- [module](https://github.com/mitre-attack/car/blob/master/docs/data_model/module.md)
- [process](https://github.com/mitre-attack/car/blob/master/docs/data_model/process.md)
- [registry](https://github.com/mitre-attack/car/blob/master/docs/data_model/registry.md)
- [service](https://github.com/mitre-attack/car/blob/master/docs/data_model/service.md)
- [socket](https://github.com/mitre-attack/car/blob/master/docs/data_model/socket.md)
- [thread](https://github.com/mitre-attack/car/blob/master/docs/data_model/thread.md)
- [user-session](https://github.com/mitre-attack/car/blob/master/docs/data_model/user_session.md)

## MITRE CAR Schema
- [Mitre CAR Data Data Model Schema](https://github.com/mitre-attack/car/blob/master/scripts/datamodel_schema.yaml)
- [Mitre CAR Data Analytic Schema](https://github.com/mitre-attack/car/blob/master/scripts/analytic_schema.yaml)
## Custom CAR Data Models
- usb

## Usage

Explain how to use the app, including any notable dashboards, searches, or alerts.

- **Dashboards:** List major dashboards and their purpose.
- **Saved Searches:** Key searches used by the app.
- **Alerts:** Any built-in alerting mechanisms.

---

## Data Inputs

Detail the expected data sources and their required formats.

| Data Source | Expected Format | Index | Required? |
|-------------|----------------|-------|-----------|
| Zeek Logs   | JSON/CSV        | `zeek` | Yes       |
| Sysmon      | XML/JSON        | `windows` | No       |

---

## App Contents

### Dashboards
- **[Dashboard Name]** - Description of what it visualizes.

### Lookups
- **[Lookup Name].csv** - Brief explanation of what it maps.

### Knowledge Objects
- **Macros:** Any reusable macros.
- **Field Extractions:** Key field extractions used.

---

# CAR Analytics Search Command for Splunk

The `carfind` command allows you to search through MITRE CAR (Cyber Analytics Repository) analytics rules directly from Splunk, without requiring them to be indexed. This command fully implements the CAR analytic schema, allowing you to search for rules based on any attribute defined in the schema.

## Features

1. **Full Schema Implementation** - Supports all elements in the CAR analytics schema
2. **Object-Oriented Model** - Breaks down schema into queryable fields that follow the structure
3. **Comprehensive Filtering** - Provides filters for all schema elements (core fields, coverage items, implementations, unit tests, d3fend mappings)
4. **Flattened Nested Structures** - Makes complex nested objects easily queryable from SPL with numbered indices (like `implementation_0_type`)
5. **Consolidated Arrays** - Creates fields like `all_techniques` to make it easier to search across multiple items
6. **Original Structure Preservation** - Maintains the original JSON structure while making it more searchable

## Command Syntax

```
| carfind 
    [id=<CAR-ID>] 
    [title=<keywords>] 
    [technique=<MITRE-technique>]
    [subtechnique=<MITRE-subtechnique>] 
    [tactic=<MITRE-tactic>] 
    [platform=<platform>] 
    [type=<analytic_type>] 
    [subtype=<subtype>] 
    [contributor=<contributor>]
    [information_domain=<domain>] 
    [d3fend_id=<id>]
    [d3fend_label=<label>]
    [daterange=<start_date>..<end_date>] 
    [implementation_type=<type>]
    [data_model=<data_model>] 
    [test_description=<description>]
    [true_positive_source=<source>] 
    [code_contains=<text>]
```

## Parameters

### Basic Fields
- **id**: Filter by CAR ID (e.g., "CAR-2022-03-001")
- **title**: Search for keywords in the title
- **information_domain**: Filter by information domain (e.g., "Host", "Network")

### List Fields
- **platform**: Filter by platform (e.g., "Windows", "Linux")
- **type**: Filter by analytic type (e.g., "TTP", "Situational Awareness")
- **subtype**: Filter by subtype (e.g., "Process", "Network")
- **contributor**: Filter by contributor name
- **data_model_reference**: Filter by data model reference
- **reference**: Filter by external reference

### Coverage Fields
- **technique**: Filter by MITRE ATT&CK technique (e.g., "T1562")
- **subtechnique**: Filter by MITRE ATT&CK subtechnique (e.g., "T1562.002")
- **tactic**: Filter by MITRE ATT&CK tactic (e.g., "TA0005")
- **coverage_level**: Filter by coverage level (e.g., "Moderate", "High")

### Implementation Fields
- **implementation_type**: Filter by implementation type (e.g., "Splunk", "Pseudocode")
- **implementation_name**: Filter by implementation name
- **data_model**: Filter by implementation data model
- **code_contains**: Search for text within implementation code

### Testing Fields
- **test_description**: Filter by unit test description
- **true_positive_source**: Filter by true positive source

### D3FEND Mappings
- **d3fend_id**: Filter by D3FEND ID (e.g., "D3-PSA")
- **d3fend_label**: Filter by D3FEND mapping label

### Date Fields
- **daterange**: Filter by submission or update date range (format: YYYY/MM/DD..YYYY/MM/DD)

## Examples

### Basic Searching

Find a specific CAR rule by ID:
```
| carfind id="CAR-2022-03-001"
```

Search for rules with a keyword in the title:
```
| carfind title="Event Logging"
```

Find rules for a specific platform:
```
| carfind platform="Windows"
```

### Advanced Filtering

Find rules implementing a specific MITRE ATT&CK technique:
```
| carfind technique="T1562"
```

Find rules for a specific MITRE ATT&CK subtechnique:
```
| carfind subtechnique="T1562.002"
```

Find rules created by a specific contributor:
```
| carfind contributor="John Smith"
```

Find rules created within a date range:
```
| carfind daterange="2021/01/01..2022/12/31"
```

### Implementation Searching

Find Splunk implementations:
```
| carfind implementation_type="Splunk"
```

Find implementations containing specific code:
```
| carfind implementation_type="Splunk" code_contains="EventCode=4688"
| table id title implementation_0_code
```

Find implementations for a specific data model:
```
| carfind data_model="Process"
| stats count by all_implementation_types
```

### Testing & Validation

Find rules with specific test descriptions:
```
| carfind test_description="Registry"
| table id title unit_test_0_description unit_test_0_commands
```

### Complex Queries

Combine technique and platform filters:
```
| carfind technique="T1562" platform="Windows" 
| stats count by all_subtechniques
```

Find coverage gaps or low coverage areas:
```
| carfind
| stats values(all_coverage_levels) as coverage_levels by id title
| search coverage_levels="*Low*"
```

Explore and analyze D3FEND mappings:
```
| carfind
| mvexpand all_d3fend_ids
| stats count by all_d3fend_ids all_d3fend_labels
| sort -count
```

## Output Fields

The command outputs the following field types:

### Top-Level Fields
- All basic fields from the CAR rule (id, title, description, etc.)
- List fields converted to comma-separated values or JSON strings

### Coverage Fields
- `coverage_X_technique`: Technique for coverage item X
- `coverage_X_subtechniques`: Subtechniques for coverage item X
- `coverage_X_tactics`: Tactics for coverage item X
- `coverage_X_level`: Coverage level for item X
- `all_techniques`: Array of all techniques
- `all_subtechniques`: Array of all subtechniques
- `all_tactics`: Array of all tactics
- `all_coverage_levels`: Array of all coverage levels

### Implementation Fields
- `implementation_X_type`: Type for implementation X
- `implementation_X_name`: Name for implementation X
- `implementation_X_description`: Description for implementation X
- `implementation_X_data_model`: Data model for implementation X
- `implementation_X_code`: Implementation code
- `all_implementation_types`: Array of all implementation types
- `all_implementation_names`: Array of all implementation names
- `all_data_models`: Array of all data models

### Unit Test Fields
- `unit_test_X_description`: Description for unit test X
- `unit_test_X_commands`: Commands for unit test X

### D3FEND Mapping Fields
- `d3fend_mapping_X_id`: ID for D3FEND mapping X
- `d3fend_mapping_X_label`: Label for D3FEND mapping X
- `d3fend_mapping_X_iri`: IRI for D3FEND mapping X
- `all_d3fend_ids`: Array of all D3FEND IDs
- `all_d3fend_labels`: Array of all D3FEND labels

### Metadata Fields
- `_file`: Filename of the YAML file
- `_path`: Full path to the YAML file

---

## Additional Notes

- Any performance considerations?
- Troubleshooting tips?
- Known issues?

---

_Last Updated: YYYY-MM-DD_