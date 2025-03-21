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

# Installation, Prerequisites, and Configuration

Because this App runs on Splunk Enterprise, all the [Splunk Enterprise system requirements](https://docs.splunk.com/Documentation/Splunk/latest/Installation/Systemrequirements) apply.

## Download

Download Corelight Add-on for Zeek on [Splunkbase](https://splunkbase.splunk.com/app/5446).

### Deploy to single server instance

Follow these steps to install the app in a single server instance of Splunk Enterprise:

- Deploy as you would any App, and restart Splunk.

- Configure.

### Deploy to Splunk Cloud

- Install via the Apps Browser in Splunk Cloud.

- If there are issues, or you need help, have your Splunk Cloud Support handle this installation.

### Deploy to a Distributed Environment

- For each Search Head in the environment, deploy a copy of the App.

# Troubleshooting and Support

## Questions and answers

Access questions and answers specific to Corelight Add-on for Zeek at <https://answers.splunk.com>. Be sure to tag your question with the App.

## Support

- Support Email: <appsupport@corelight.com>

- Support Website: <https://www.corelight.com/support>

- Support Offered: Email, Web

## Known Issues

Version 1.0.8 of Corelight Add-on for Zeek has the following known issues:

- None

# Third Party Notices

Version 1.0.8 of Corelight Add-on for Zeek incorporates the following Third-party software or third-party services.

- None
