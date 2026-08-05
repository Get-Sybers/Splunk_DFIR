## 🗺️ Find Your Way Around
```
  $DX_DFIR
    └── scripts/                                      # Processing + emulator deploy/apply/ingest scripts
    │   │
    │   └── lib/                                      # Shared bash libraries: docker lifecycle, Kusto REST API
    │
    └── dev-scripts/                                  # Experimental/one-off helpers, unsupported
    │
    └── kusto/                                        # The analysis backend — offline Azure Data Explorer
    │   │
    │   └── schema/                                   # Databases, tables, ingestion mappings, MITRE CAR functions
    │
    └── tests/                                        # run-checks.sh — the check harness that gates CI
    │
    └── docs/                                         # Documentation for project usage and setup
    │
    └── data_store/                                   # Data storage for raw and processed forensic data
        │
        └── raw/                                      # Unprocessed forensic data
        │   └── disk_images/                          # Forensic disk images (E01, AFF, etc.)
        │   └── pcaps/                                # Packet captures (PCAP files)
        │   └── VM_files/                             # VMware VM exports (one folder per VM)
        │   └── memory/                               # Raw memory captures
        │   └── other_raw_data/                       # Additional raw data sources (WinEvt/<host>/ for .evtx)
        │
        └── dependencies/                             # Operator-supplied tools (EvtxECmd, KAPE)
        │
        └── processed/                                # Everything ingest-kusto.sh loads
            └── kape/                                 # Various kape outputs in the filestructure kape creates
            │   └── <your-disk-image>/
            │       └── EventLogs/
            │       │
            │       └── FileDeletion/
            │       │
            │       └── FileFolderAccess/
            │       │
            │       └── ProgramExecution/
            │       │
            │       └── SRUMDatabase/
            │       │
            │       └── Registry/
            │       │   └── yyyymmddhhmmss/
            │       │
            │       └── SOF-ELK/
            │
            └── linux_logs/                           # Linux Distro logs (not yet wired into the backend)
            │   └── syslog/                           # Global System Activity
            │   │
            │   └── auth/                             # Authentication (logon)
            │   │
            │   └── utmp/                             # Current User
            │   │
            │   └── wtmp/                             # Logon History
            │   │
            │   └── btmp/                             # Failed Logon History
            │   │
            │   └── mail/                             # Email (SMTP/postfix)
            │   │
            │   └── dpkg-yum/                         # Package Manager
            │   │
            │   └── audit/                            # Linux Daemon
            │   │
            │   └── cron/                             # Daemon Cron Jobs
            │
            └── log2timeline/
            │   └── csv/                              # Log2timeline Output  -> host.L2tCsv
            │   │
            │   └── logs/                             # Log2timeline Job Logs
            │
            └── windows_logs/                         # EvtxECmd JSON        -> host.EvtxEcmdJson
            │
            └── zeek/
            │   └── your-pcap-filename/               # Zeek logs            -> network.ZeekConn (conn.log)
            │
            └── zimmerman/                            # Zimmerman Tools Output
            │
            └── csv/                                  # Any CSV
            │
            └── json/                                 # Any JSON
```

The Splunk-era tree (`splunk/` with its eight apps, `ansible/` with the
in-container provisioning playbooks) was retired when the SIEM moved to the
Kusto emulator. It survives in git history and on the frozen
[`deprecated`](https://github.com/Get-Sybers/DX_DFIR/tree/deprecated) branch.
