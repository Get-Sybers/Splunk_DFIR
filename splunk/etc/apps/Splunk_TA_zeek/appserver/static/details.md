# Corelight Add-on for Zeek Documentation

The TA for Zeek allows a Splunk Enterprise administrator to parse open source Zeek data in JSON or TSV format, and map it into the Common Information Model for use by multiple Splunk security apps.

## About Corelight Add-on for Zeek

|                            |                   |
|----------------------------|-------------------|
| Author                     | Aplura, LLC       |
| App Version                | 1.0.8             |
| App Build                  | 14                |
| Creates an index           | False             |
| Implements summarization   | No                |
| Summary Indexing           | False             |
| Data Model Acceleration    | None              |
| Report Acceleration        | None              |
| Splunk Enterprise versions | 9.x, 8.x          |
| Platforms                  | Splunk Enterprise |

## Scripts and binaries

This App provides the following scripts:

- None

## Overview

## Lookups

Corelight Add-on for Zeek contains the following lookup files.

- bro_conn_state.csv

- bro_note_alert_type.csv

- bro_protocols.csv

- bro_status_action.csv

- bro_tc_flag.csv

- bro_vendor_info.csv

## Event Generator

Corelight Add-on for Zeek does not include an event generator.

## Acceleration

- Summary Indexing: No

- Data Model Acceleration: No

- Report Acceleration: No

## binary file declaration

- None

# Release Notes

## Version 1.0.8

- Bug

  - \[DESK-1539\] - Updated `props.conf` for `zeek:files` to remove an incorrect evaluator (`!==`) from an eval statement.

## Version 1.0.7

- Bug

  - \[DESK-1537\] - Updated `props.conf` for `zeek:ssl` to include the proper lookup definition.

## Version 1.0.6

- CIM Updates for v5.2
