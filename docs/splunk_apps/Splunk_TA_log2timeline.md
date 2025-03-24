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

- **Data Sources:** `log2timeline with csv output`
- **Indexes:** `index=host`, `sourcetype=lt2:<parser>`
- **Other Apps:** `n/a`

---

## Setup & Configuration

Step-by-step guide on installing and configuring the app.

1. **Installation:**
   - Download from [Splunk_DFIR GitHub Repository](https://github.com/Get-Sybers/Splunk_DFIR).
   - Install via [deploy-splunk.sh](https://github.com/Get-Sybers/Splunk_DFIR/blob/main/scripts/deploysplunk.sh)

2. **Configuration:**
   - Configure inputs (`inputs.conf`, `props.conf`, `transform.conf` )
   - Modify knowledge objects if necessary

3. **Permissions & Access:**
   - Required roles/capabilities
   - Any special user/group access settings

---

## Usage

Explain how to use the app, including any notable dashboards, searches, or alerts.

- **Dashboards:** 
- **Saved Searches:**
- **Alerts:**
- **LookUps:**
- **Field Aliases:** ***list to come***

---

## Data Inputs

Current description and assigned sourcetypes

| source_long                                | sourcetype         |
|--------------------------------------------|--------------------|
| PE/COFF file                               | l2t:PE             |
| PE/COFF DLL import table                   | l2t:PE             |
| WinEVTX                                    | l2t:WinEVTX        |
| NTFS USN change                            | l2t:NTFS           |
| User Access Logging CLIENTS record         | l2t:User           |
| File stat                                  | l2t:File           |
| Registry Key                               | l2t:Registry       |
| MSIE WebCache container record             | l2t:MSIE           |
| Shutdown Registry Key                      | l2t:Shutdown       |
| User Access Logging ROLE_ACCESS record     | l2t:User           |
| Task Cache Registry Key                    | l2t:Task           |
| User Access Logging DNS record             | l2t:User           |
| UserAssist Registry Key                    | l2t:UserAssist     |
| Setup API Log                              | l2t:Setup          |
| File entry shell item                      | l2t:File           |
| BagMRU Registry Key                        | l2t:BagMRU         |
| MSIE WebCache containers record            | l2t:MSIE           |
| OLECF Dest list entry                      | l2t:OLECF          |
| OLECF Item                                 | l2t:OLECF          |
| Service/Driver Configuration Registry Key  | l2t:Service        |
| Winlogon Registry Key                      | l2t:Winlogon       |
| MRUListEx Registry Key                     | l2t:MRUListEx      |
| MRUList Registry Key                       | l2t:MRUList        |
| User Access Logging SYSTEM_IDENTITY record | l2t:User           |
| Typed URLs Registry Key                    | l2t:Typed          |
| Network Connection Registry Key            | l2t:Network        |
| Amcache Registry Entry                     | l2t:Amcache        |
| Run/Run Once Registry Key                  | l2t:Run            |
| System                                     | l2t:System         |
| Windows Shortcut                           | l2t:Windows        |
| Network Drive Registry Key                 | l2t:Network        |
| Chrome Cookies                             | l2t:Chrome         |
| OLECF Summary Info                         | l2t:OLECF          |
| AppCompatCache Registry Key                | l2t:AppCompatCache |
| OLECF Document Summary Info                | l2t:OLECF          |
| Google Analytics Cookies                   | l2t:Google         |
| Open XML Metadata                          | l2t:Open           |
| Windows Scheduled Task Job                 | l2t:Windows        |
| Windows Scheduled Task Trigger             | l2t:Windows        |
| Amcache Programs Registry Entry            | l2t:Amcache        |
| MSIE Cache File URL record                 | l2t:MSIE           |
| SCCM Log                                   | l2t:SCCM           |
| User Account Information Registry Key      | l2t:User           |
| WinPrefetch                                | l2t:WinPrefetch    |
| Chrome Cache                               | l2t:Chrome         |
| Chrome History                             | l2t:Chrome         |
| Chrome Preferences                         | l2t:Chrome         |
| Recycle Bin                                | l2t:Recycle        |
| USB Registry Key                           | l2t:USB            |
| RDP Connection Registry Key                | l2t:RDP            |

---

## App Contents

### Dashboards
- **[Dashboard Name]** - 

### Lookups
- **[Lookup Name].csv** - 

### Knowledge Objects
- **Macros:** 
- **Field Extractions:** 

---

## Additional Notes

- Known issues: 
   - log2timeline produces a considerable amount of data. Especially if more than one image file is processed. Start with refined queries or run the risk of potentially crashing your Splunk Search Head.

---

***Last Updated: 2025-03-24***