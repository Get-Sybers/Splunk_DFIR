## 🗺️ Find Your Way Around
```
  $Splunk_DFIR                                 
    └── scripts/                                      # Processing scripts for forensic data
    │
    └── ansible/                                      # Ansible playbooks/tasks (derived from splunk-ansible, Apache-2.0)
    │
    └── docs/                                         # Documentation for project usage and setup
    │
    └── data_store/                                   # Data storage for raw and processed forensic data
    │   │
    │   └── raw/                                      # Unprocessed forensic data
    │   │   └── disk_images/                          # Forensic disk images (E01, AFF, etc.)
    │   │   └── pcaps/                                # Packet captures (PCAP files)
    │   │   └── VM_files/                             # VMware VM exports (one folder per VM)
    │   │   └── memory/                               # Raw memory captures
    │   │   └── other_raw_data/                       # Additional raw data sources
    │   │
    │   └── processed/                                # all data to be ingested by splunk)
    │       └── kape/                                 # Various kape outputs in filestrucutre kape creates
    │       │   └── <your-disk-image>/
    │       │       └── EventLogs/
    │       │       │   
    │       │       └── FileDeletion/
    │       │       │
    │       │       └── FileFolderAccess/
    │       │       │
    │       │       └── ProgramExecution/
    │       │       │
    │       │       └── SRUMDatabase/
    │       │       │
    │       │       └── Registry/
    │       │       │   └── yyyymmddhhmmss/
    │       │       │
    │       │       └── SOF-ELK/
    │       │       
    │       └── linux_logs                            # Linux Distro logs
    │       │   └── linux_logs/
    │       │       └── syslog/                       # Gloval System Activity
    │       │       │
    │       │       └── auth/                         # Authentication (logon)
    │       │       │
    │       │       └── utmp/                         # Current User
    │       │       │
    │       │       └── wtmp/                         # Logon History
    │       │       │
    │       │       └── btmp/                         # Failed Logon History
    │       │       │
    │       │       └── mail/                         # Email (SMTP/postfix)
    │       │       │
    │       │       └── dpkg-yum/                     # Package Manager
    │       │       │
    │       │       └── audit/                        # Linux Daemon
    │       │       │
    │       │       └── cron/                         # Daemon Cron Jobs
    │       │
    │       └── log2timeline/
    │       │   └── csv/                             # Log2timeline Output
    │       │   │ 
    │       │   └── logs/                             # Log2timeline Job Logs
    │       │      
    │       └── zeek/
    │       │   └── your-pcap-filename/               # Zeek Packet Inspection Logs
    │       │ 
    │       └── zimmerman/                            # Zimmerman Tools Output
    │       │
    │       └── csv/                                  # Any CSV
    │       │
    │       └── json/                                 # Any JSON
    │
    └── splunk/                                       # Splunk deployment and configurations
        │
        └── ansible/                                  # Production Splunk configurations
        │       └── custom_playbooks/                 # Ansible playbooks in the deployment of Splunk
        │       │
        │       └── default_playbooks/
        │
        └── etc/                                      # Production Splunk configurations
        │   └── system/
        │   │   └── local/                            # Local configuration overrides
        │   └── apps/                                 # Installed Splunk apps
        │
        └── var/                                      # Development environment for Splunk (testing before production)
            └── Splunk Indexes/
```