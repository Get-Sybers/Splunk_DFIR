## Find Your Way Around

The pipeline is a three-layer design: the **`dxdfir` CLI** (the verbs) drives the
**`get_sybers.dfir` Ansible collection** (orchestration), which invokes the
**`get_sybers_dfir` Python package** (the per-item processing).

```
  $DX_DFIR
    └── python/                                       # get_sybers_dfir package + the dxdfir CLI — the front-end
    │   └── get_sybers_dfir/                          # processors (zeek/plaso/volatility/evtx/signatures), ingest/, cli.py
    │   └── man/                                      # dxdfir.1 man page
    │   └── tests/                                    # pytest unit tests (pure logic, no Docker)
    │
    └── ansible/collections/get_sybers.dfir/         # the Ansible collection — orchestration
    │   └── roles/                                    # one role per source + ingest/deploy roles (adx, sofelk)
    │   └── playbooks/                                # dfir-process-* / dfir-ingest-* / dfir-deploy-*
    │
    └── scripts/                                      # Deploy/apply/ingest + signature lanes (bash)
    │   └── lib/                                      # Shared bash libraries: docker lifecycle, Kusto REST API
    │
    └── docker/                                       # Container builds — Byakugan's Elastic-native stack (elastic/), the retiring SOF-ELK stack (sof-elk/)
    │
    └── dev-scripts/                                  # Experimental/one-off helpers, unsupported (e.g. the Plaso output module)
    │
    └── kusto/                                        # The analysis backend — offline Azure Data Explorer
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
        └── dependencies/                             # Operator-supplied tools (EvtxECmd)
        │
        └── processed/                                # Everything `dxdfir ingest` loads
            └── linux_logs/                           # Linux Distro logs (not wired into the backend)
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
            │   └── plaso/                            # Plaso storage files (.plaso) — also re-usable by Timesketch
            │   └── jsonl/                            # Plaso json_line      -> host.L2t<Parser> (one table per top-level parser)
            │   └── logs/                             # Job logs
            │
            └── windows_logs/                         # EvtxECmd JSON        -> host.EvtxEcmdJson
            │
            └── zeek/
            │   └── <capture>/                        # Zeek JSON            -> network.ZeekConn (conn) + network.Zeek (all others)
            │
            └── volatility/
            │   └── <image>/                          # Volatility 3 JSONL per plugin -> memory.VolatilityJson
            │
            └── signatures/
            │   └── yara/ suricata/ hayabusa/         # detection JSONL (YARA matches / Suricata EVE / Hayabusa Sigma)
            │
```

The Splunk-era tree (`splunk/` with its eight apps, and a since-removed
in-container provisioning `ansible/` — **unrelated to today's
`get_sybers.dfir` collection** under `ansible/collections/`) was retired when
the SIEM moved to the Kusto emulator, and the KAPE automation
(`processed/kape/`, the two PowerShell scripts) was removed in favour of
survives in git history and on the frozen
[`deprecated`](https://github.com/Get-Sybers/DX_DFIR/tree/deprecated) branch.
