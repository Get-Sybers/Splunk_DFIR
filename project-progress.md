# 🗂️ Splunk DFIR Pipeline Task Board

This board tracks tasks for the DFIR automation project—from forensic data processing to Splunk deployment.

---

# Data Pipeline Progress

| Processing Tool / Artefact                                    | Automate Data | File Type      | Ingest | Extract | Data Model |
|:--------------------------------------------------------------|:-------------:|:---------------|:------:|:-------:|:----------:|
| [Log2timeline](https://github.com/log2timeline/plaso)         | ✅            | csv             | ✅     |    ✅   |            |
| [Zeek](https://zeek.org/)                                     | ✅            | tsv             | ✅     |    ✅   |            |
| [Kape](https://github.com/EricZimmerman/KapeFiles)            | ✅            | json, csv       | ✅✅    |   ✅✅  |            |
| CSVs                                                          |               | csv             | ✅     |         |            |
| JSON                                                          |               | json            | ✅     |         |            |
| [WinEvent Logs](https://www.sans.org/white-papers/32949/)     |               | evt, evtx       |        |         |            |
| Linux Logs                                                    |               |                 |        |         |            |
| [Symon](https://github.com/mandiant/Symon)                    |               |                 |        |         |            |
| [Syslog](https://syslog-ng.github.io)                         |               |                 |        |         |            |
| [Zimmerman](https://github.com/EricZimmerman)                 |               |                 |        |         |            |
| [Hayabusa](https://github.com/Yamato-Security/hayabusa)       |               |                 |        |         |            |
| [Chainsaw](https://github.com/countercept/chainsaw)           |               |                 |        |         |            |

# Update log

## 🔜 To Do
### 🔹 **KAPE & Raw EVTX Processing**  
- Develop ingestion pipeline for **KAPE output** (targeting forensic triage artifacts).
  - looking at probably making a container that can handle Windows API calls
- Implement raw **EVTX file parsing** and ensure event logs are properly structured for Splunk ingestion.
  - currently splunk doesn't want to ingest the logs. it can see them but won't ingest them. I think it's possibly something to do with the Windows update log not registering a new a change to evtx files.

### 🔹 **Splunk Apps for Data Types**  
- Ensure `_time` is correctly extracted from **artifact creation timestamps**.  
- Normalize timestamps across all data sources for consistent correlation.  

### 🔹 **Data Models & MITRE CAR Mapping**  
- Implement **log normalization** to align fields with the **MITRE Cyber Analytics Repository (CAR)**.  
- Validate field mappings against Windows event logs, Zeek logs, and forensic artifacts.  
- Create **lookup tables** for event IDs, log sources, and mapped MITRE techniques.
  - looking at potentially doing this in splunk rather outside of it.
  - Looking at the potential to use CTI STIX data for this as well as data within https://github.com/ForensicArtifacts/artifacts
- Develop a **Splunk dashboard** to visualize **MITRE CAR-mapped events**.  

### 🔹 **Environment & Dependencies**  
- Create a guide for **setting up the development environment**.  

### 🔹 **Field Mappings**  

---

## 🔄 In Progress
### 🔹 **Field Extraction**  


### 🔹 **Splunk Apps for Data Types**  
- Create individual Splunk apps for each data type (Zeek, log2timeline, EVTX, KAPE). This app will handle all conf files for ingestion.
- **Documentation Updates**  
  - Update **READMEs** based on testing outcomes and any new features. 
### 🔹 **Data Models & MITRE CAR Mapping**  
- Design Splunk **data models** to map processed logs (Zeek, log2timeline) to **MITRE CAR fields**.
  - data model conf as been made. Mapping still needs to occur once ingested data sources fields have been extracted.
  - working dir `$Splunk_DFIR/splunk/dev/apps/MITRE CAR-Aligned/MITRE_CAR_APP`
### 🔹 **Ansible Playbooks**  
- Develop bash scripts to cater for lainess around typing commands to execute playbooks
- Develop playbook to persist important configs inside container
---

## ✅ Done
### 🔹 **Field Extractions**

✅ - Log2timeline field mappings
  - log2timeline output was changed from json to "dynamic" which outputs a "comma delimited" output. The reason for this is l2t captures more timestamp formats than I knew existed and won't convert them into epoch (one of few time formats Splunk can interpet) unless --dynamic output is made.
  - the end result is surprisingly a looot better than I expected csv.
  - huge benefit is I was able to pass the "datetime" field l2t outputs into splunk as the _time value. So the timeline search feature is fully integrated.

✅ - Kape CSV and JSON
  - timestamps so far are mappped correctly. Need more data to test if anything more will capture ingest time as _time
  - haven't been able to push SOF-ELK sourcetype to the rest of the Kape source types.

### 🔹 **Dynamic Scripts Testing**  
✅- Test `log2timeline-dynamic.sh` for processing **single E01 images**.  
✅- Test `log2timeline-ALL-dynamic.sh` for processing **all E01 images**.  
✅- Test `zeek-process-single-dynamic.sh` and `zeek-process-all-dynamic.sh`.  

### 🔹 **Splunk Deployment Enhancements**

✅ Learn how to better use Ansible for better splunk deployment
  - cry
  - write ansible playbook to install custom user apps for host directory
  - integrate ansible playbook with `deploy-splunk.sh`

✅ - Finalize and test `deploysplunk-dynamic.sh` for **dynamic path resolution**.  
- Integrate **Splunk authentication and security best practices**.  
- **Repository Structure Refinement**

✅  - Review and refine folder structures in `data_store` and `scripts`.  
- **File Path Validation**  

✅  - Validate that all **dynamic paths** work as expected across different environments.

### ✅ **Deployment & Ingestion into Splunk**
- Splunk container is **deployed and properly configured**.  
- All ingestion scripts successfully tested and validated.  

### ✅ **log2timeline Processing**  
- Fully functional pipeline for **E01 images → Plaso → JSON logs → Splunk**.  get-sybers "(output was later changed from JSON to csv)"

### ✅ **Zeek Processing**  
- PCAPs successfully converted into Zeek logs and **ingested into Splunk**.  

### ✅ **Static & Dynamic Script Implementations**  
- Developed and tested **static scripts**.  
- **Dynamic versions created**, pending final validation.  

### ✅ **Repository Setup & Documentation**  
- Created base directory structure (`data_store`, `scripts`, `splunk`).  
- Wrote **README files** for root, `data_store`, and `scripts` directories.  

---

