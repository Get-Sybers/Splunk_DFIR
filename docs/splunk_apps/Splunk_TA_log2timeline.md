# [Splunk_TA_log2timeline] Documentation

**Source:** [indigenous] 
**Owner:** [get-sybers]  
**Documentation:** [Splunk_TA_log2timeline Documentation](https://github.com/Get-Sybers/Splunk_DFIR/blob/main/docs/splunk_apps/Splunk_TA_log2timeline.md)  
**Purpose:** This app extracts fields prom log2timeline outputs when ingesting into splunk.

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

- **Data Sources:** `log2timeline with json_line output`
- **Indexes:** `index=host`, `sourcetype=lt2:<parser>`
- **Other Apps:** `n/a`

---

## Setup & Configuration

Step-by-step guide on installing and configuring the app.

1. **Installation:**
   - Download from [Splunk_DFIR GitHub Repository](https://github.com/Get-Sybers/Splunk_DFIR).
   - Install via [deploysplunk.sh](https://github.com/Get-Sybers/Splunk_DFIR/blob/main/scripts/deploysplunk.sh)

2. **Configuration:**
   - Configure inputs (`inputs.conf`, `props.conf`, `transform.conf` )
   - Modify knowledge objects if necessary

3. **Permissions & Access:**
   - Required roles/capabilities
   - Any special user/group access settings

---

## Usage

Explain how to use the app, including any notable dashboards, searches, or alerts.

- **Dashboards:** List major dashboards and their purpose.
- **Saved Searches:** Key searches used by the app.
- **Alerts:** Any built-in alerting mechanisms.
- **LookUps:** Any look-up tables
- **Field Aliases:** field aliases it contains

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

## Additional Notes

- Any performance considerations?
- Troubleshooting tips?
- Known issues?

---

_Last Updated: YYYY-MM-DD_