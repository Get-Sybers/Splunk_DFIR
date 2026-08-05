# 📂 `data_store`

This directory contains **all raw and processed forensic data** utilized within the **DX_DFIR pipeline**.

---

## 📁 Directory Structure

```bash
data_store/
   └── raw/  # Unprocessed forensic data
   │   └── disk_images/  # Forensic disk images (E01, AFF, etc.)
   │   │   └── your-disk-image.E01
   │   │   └── yanother-disk-image.E01
   │   └── pcaps/  # Packet captures (PCAP files)
   │   │   └── yyour-network-capture.pcap
   │   │   └── yanother-net-capture.pcapng
   │   └── other_raw_data/  # Additional raw data sources
   │
   └── processed/
      │   └── <your-disk-image>/
      │       └── EventLogs/
      │       │   └── yyyymmddhhmmss_EvtxECmd_Output.json
      │       │   └── yyyymmddhhmmss_EvtxECmd_Output.json
      │       │   └── yyyymmddhhmmss_EvtxECmd_Output.json
      │       │   
      │       └── FileDeletion/
      │       │   └── yyyymmddhhmmss_RBCmd_Output.csv
      │       │
      │       └── FileFolderAccess/
      │       │   └── yyyyymmddhhmmss_<SID>.automaticDestinations-ms.json
      │       │   └── yyyyymmddhhmmss_<SID>.customDestinations-ms.json
      │       │   └── yyyyymmddhhmmss_LECmd_Output.json
      │       │   └── yyyyymmddhhmmss>_<your-disk-image>_<User>_NTUSER.csv
      │       │   └── yyyyymmddhhmmss>_<your-disk-image>_<User>_UsrClass.csv
      │       │   └── yyyyymmddhhmmss>_<your-disk-image>_<User>.<HOSTNAME>_NTUSER.csv
      │       │   └── yyyyymmddhhmmss>_<your-disk-image>_<User>.<HOSTNAME>_UsrClass.csv 
      │       │   └── yyyyymmddhhmmss>_<your-disk-image>_<User>_NTUSER.csv
      │       │
      │       └── ProgramExecution/
      │       │   └── yyyymmddhhmmss_PECmd_Output.json
      │       │
      │       └── SRUMDatabase/
      │       │   └── yyyymmddhhmmss_SrumECmd_AppResourceUseInfo_Output.csv
      │       │   └── yyyymmddhhmmss_SrumECmd_AppTimelineProvider_Output.csv
      │       │   └── yyyymmddhhmmss_SrumECmd_EnergyUsage_Output.csv
      │       │   └── yyyymmddhhmmss_SrumECmd_NetworkConnections_Output.csv
      │       │   └── yyyymmddhhmmss_SrumECmd_NetworkUsages_Output.csv
      │       │   └── yyyymmddhhmmss_SrumECmd_PushNotifications_Output.csv
      │       │   └── yyyymmddhhmmss_SrumECmd_vfuprov_Output.csv
      │       │
      │       └── Registry/
      │       │   └── yyyymmddhhmmss/
      │       │       └── yyyymmddhhmmss_FileExts_Users_<User>.mfa_NTUSER.DAT.csv
      │       │       └── yyyymmddhhmmss_LastVisitedPidlMRU_Users_<User>.<HOSTNAME>_NTUSER.DAT.csv
      │       │       └── yyyymmddhhmmss_UserAssist_Users_<User>.<HOSTNAME>_NTUSER.DAT.csv
      │       │       └── yyyymmddhhmmss_CIDSizeMRU_Users_<User>.<HOSTNAME>_NTUSER.DAT.csv
      │       │       └── yyyymmddhhmmss_FileExts_Users_.NET v4.5 Classic_NTUSER.DAT.csv
      │       │       └── yyyymmddhhmmss_FileExts_Users_.NET v4.5_NTUSER.DAT.csv
      │       │       └── yyyymmddhhmmss_FileExts_Users_<User>.<HOSTNAME>_NTUSER.DAT.csv
      │       │       └── yyyymmddhhmmss_OpenSavePidlMRU_Users_<User>.<HOSTNAME>_NTUSER.DAT.csv
      │       │       └── yyyymmddhhmmss_RecentDocs_Users_<User>.<HOSTNAME>_NTUSER.DAT.csv
      │       │       └── yyyymmddhhmmss_Taskband_Users_<User>.<HOSTNAME>_NTUSER.DAT.csv
      │       │       └── yyyymmddhhmmss_TaskCache_Windows_System32_config_RegBack_SOFTWARE.csv
      │       │       └── yyyymmddhhmmss_TaskCache_Windows_System32_config_SOFTWARE.csv
      │       │       └── yyyymmddhhmmss_TypedURLs_Users_<User>.<HOSTNAME>_NTUSER.DAT.csv
      │       │       └── yyyymmddhhmmss_WindowsPortableDevices_Windows_System32_config_RegBack_SOFTWARE.csv
      │       │       └── yyyymmddhhmmss_WindowsPortableDevices_Windows_System32_config_SOFTWARE.csv
      │       │       └── yyyymmddhhmmss_RECmd_Batch_AllRegExecutablesFoundOrRun_Output.csv
      │       │       └── yyyymmddhhmmss_RECmd_Batch_BasicSystemInfo_Output.csv
      │       │       └── yyyymmddhhmmss_RECmd_Batch_InstalledSoftware_Output.csv
      │       │       └── yyyymmddhhmmss_RECmd_Batch_Kroll_Batch_Output.csv
      │       │       └── yyyymmddhhmmss_RECmd_Batch_RECmd_Batch_MC_Output.csv
      │       │       └── yyyymmddhhmmss_RECmd_Batch_RegistryASEPs_Output.csv
      │       │       └── yyyymmddhhmmss_RECmd_Batch_SoftwareASEPs_Output.csv
      │       │       └── yyyymmddhhmmss_RECmd_Batch_SoftwareClassesASEPs_Output.csv
      │       │       └── yyyymmddhhmmss_RECmd_Batch_SoftwareWoW6432ASEPs_Output.csv
      │       │       └── yyyymmddhhmmss_RECmd_Batch_SystemASEPs_Output.csv
      │       │       └── yyyymmddhhmmss_RECmd_Batch_UserActivity_Output.csv
      │       │       └── yyyymmddhhmmss_RECmd_Batch_UserClassesASEPs_Output.csv
      │       │       └── yyyymmddhhmmss_AppCompatFlags_Windows_System32_config_RegBack_SOFTWARE.csv
      │       │       └── yyyymmddhhmmss_AppCompatFlags_Windows_System32_config_SOFTWARE.csv
      │       │       └── yyyymmddhhmmss_MountedDevices_Windows_System32_config_RegBack_SYSTEM.csv
      │       │       └── yyyymmddhhmmss_MountedDevices_Windows_System32_config_SYSTEM.csv
      │       │       └── yyyymmddhhmmss_TimeZoneInfo_Windows_System32_config_RegBack_SYSTEM.csv
      │       │       └── yyyymmddhhmmss_TimeZoneInfo_Windows_System32_config_SYSTEM.csv
      │       │       └── yyyymmddhhmmss_AppPaths_Windows_System32_config_RegBack_SOFTWARE.csv
      │       │       └── yyyymmddhhmmss_AppPaths_Windows_System32_config_SOFTWARE.csv
      │       │       └── yyyymmddhhmmss_DeviceClasses_Windows_System32_config_RegBack_SYSTEM.csv
      │       │       └── yyyymmddhhmmss_DeviceClasses_Windows_System32_config_SYSTEM.csv
      │       │       └── yyyymmddhhmmss_FirstFolder_Users_<User>_NTUSER.DAT.csv
      │       │       └── yyyymmddhhmmss_KnownNetworks_Windows_System32_config_RegBack_SOFTWARE.csv
      │       │       └── yyyymmddhhmmss_KnownNetworks_Windows_System32_config_SOFTWARE.csv
      │       │       └── yyyymmddhhmmss_ProfileList_Windows_System32_config_RegBack_SOFTWARE.csv
      │       │       └── yyyymmddhhmmss_ProfileList_Windows_System32_config_SOFTWARE.csv
      │       │       └── yyyymmddhhmmss_Services_Windows_System32_config_RegBack_SYSTEM.csv
      │       │       └── yyyymmddhhmmss_Services_Windows_System32_config_SYSTEM.csv
      │       │       └── yyyymmddhhmmss_TerminalServerClient_Users_<User>_NTUSER.DAT.csv
      │       │       └── yyyymmddhhmmss_UnInstall_Windows_System32_config_RegBack_SOFTWARE.csv
      │       │       └── yyyymmddhhmmss_UnInstall_Windows_System32_config_SOFTWARE.csv
      │       │       └── yyyymmddhhmmss_USB_Windows_System32_config_RegBack_SYSTEM.csv
      │       │       └── yyyymmddhhmmss_USB_Windows_System32_config_SYSTEM.csv
      │       │       └── yyyymmddhhmmss_UserAccounts_Windows_System32_config_RegBack_SAM.csv
      │       │       └── yyyymmddhhmmss_UserAccounts_Windows_System32_config_SAM.csv
      │       │       └── yyyymmddhhmmss_VolumeInfoCache_Windows_System32_config_RegBack_SOFTWARE.csv
      │       │       └── yyyymmddhhmmss_VolumeInfoCache_Windows_System32_config_SOFTWARE.csv
      │       │
      │       └── SOF-ELK/
      │           └── yyyymmddhhmmss_EvtxECmd_Output.json
      │           └── yyyymmddhhmmss_EvtxECmd_Output.json
      │           └── yyyymmddhhmmss_LECmd_Output.json
      │           └── yyyymmddhhmmss_PECmd_Output.json
      │           └── yyyymmddhhmmss_EvtxECmd_Output.json
      │           └── yyyymmddhhmmss_EvtxECmd_Output.json
      │           └── yyyymmddhhmmss_LECmd_Output.json
      │           └── yyyymmddhhmmss_EvtxECmd_Output.json
      │           └── yyyymmddhhmmss_EvtxECmd_Output.json
      │           └── yyyymmddhhmmss_PECmd_Output.json
      │       
      └── linux_logs/
      │   └── linux_logs/
      │
      └── log2timeline
      │   └── csv/
      │   │   └── <your-disk-image>.csv
      │   │   └── <your-disk-image>.csv
      │   │   └── <your-disk-image>.csv
      │   │ 
      │   └── logs/
      │       └── <your-disk-image>.log
      │       └── <your-disk-image>.log
      │       └── <your-disk-image>.log
      │      
      └── zeek/
      │   └── your-pcap-filename/
      │       └── packet_filter.log
      │       └── weird.log
      │       └── tunnel.log
      │       └── ssl.log
      │       └── dns.log
      │       └── x509.log
      │       └── ocsp.log
      │       └── files.log
      │       └── smb_mapping.log
      │       └── http.log
      │       └── analyzer.log
      │       └── dpd.log
      │       └── conn.log
      │       └── dce_rpc.log
      │       └── kerberos.log
      │       └── ldap_search.log
      │       └── ldap.log
      │       └── ntlm.log
      │       └── smb_files.log
      │       └── ntp.log
      │       └── dhcp.log
      │       └── rdp.log
      │       └── pe.log
      │       └── socks.log
      │ 
      └── zimmerman/
      │
      └── csv/
      │   └── csv-file.csv
      │
      └── json/
         └── json-file.json
```

---

## 🛠️ Usage & Workflow

### 1️⃣ **Place Raw Data**

- **Disk Images**: Place `.E01` or similar forensic disk images into:
  ```bash
  data_store/raw/disk_images/
  ```

- **Network Captures**: Place `.pcap` and `.pcapng` files into:
  ```bash
  data_store/raw/pcaps/
  ```

- **Other Data Sources**: Store any additional raw files in:
  ```bash
  data_store/raw/other_raw_data/
  ```

### 2️⃣ **Data Processing**

- **Forensic Images**: Execute the following script to process disk images:
  ```bash
  ./scripts/process-log2timeline-Dynamic.sh
  ```
  Processed outputs are stored in `processed/log2timeline/csv/`, with job logs in `processed/log2timeline/logs/`.

- **Network Captures**: Execute the following script for packet analysis:
  ```bash
  ./scripts/process-zeek-ALL.sh
  ```
  Zeek outputs are stored in `processed/zeek/`.

### 3️⃣ **Load into the analysis backend**

- Load processed data into the Kusto emulator for analysis in KQL:
  ```bash
  ./scripts/deploy-kusto.sh          # once
  ./scripts/apply-kusto-schema.sh    # once per deploy
  ./scripts/ingest-kusto.sh          # after each processing run
  ```

---

## ⚠️ Notes

- **Ensure data integrity** when moving forensic images (`E01`)—always verify hashes.
- **Processed data should be version-controlled** where possible to track changes.
- **Naming conventions should be followed** for consistency across ingestion and processing.

🚀 **Stay organized, process efficiently, and hunt smart!**
