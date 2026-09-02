## Find Your Way Around

The pipeline is a three-layer design: the **`dxdfir` CLI** (the verbs) drives the
**`get_sybers.dfir` Ansible collection** (orchestration), which invokes the
**`get_sybers_dfir` Python package** (the per-item processing).

```
  $DX_DFIR
    └── python/                                       # get_sybers_dfir package + the dxdfir CLI — the front-end
    │   └── get_sybers_dfir/                          # processors (zeek/plaso/volatility/evtx/zimmerman/signatures), the CAR lane (mitrecar, carcheck), stix/, cli.py
    │   │   └── detect/rules/                         # the Elastic detection rules-as-code (ES|QL / EQL, one YAML per rule)
    │   └── man/                                      # dxdfir.1 man page
    │   └── tests/                                    # pytest unit tests (pure logic, no Docker)
    │
    └── ansible/collections/get_sybers.dfir/         # the Ansible collection — orchestration
    │   └── roles/                                    # one role per source + dfir_images + the SOF-ELK deploy/deliver roles
    │   └── playbooks/                                # dfir-process-* / dfir-build-images / dfir-deploy-sofelk / dfir-ingest-sofelk
    │
    └── scripts/                                      # Host provisioning: setup, image save/load, the offline bundle (bash)
    │
    └── docker/                                       # Container builds — the hardened dfir/* tool images, Byakugan's Elastic-native stack (elastic/), the retiring SOF-ELK stack (sof-elk/)
    │
    └── dev-scripts/                                  # Experimental/one-off helpers, unsupported (e.g. the Plaso output module)
    │
    └── third_party/                                  # Vendored engines, as submodules: PIIAT-MitreCar (CAR), PIIAT-Mem (memory)
    │
    └── tests/                                        # run-checks.sh (the check harness that gates CI), smoke-test.sh, the Elastic risk gate
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
        └── dependencies/                             # Operator-supplied tools (EvtxECmd, Hayabusa, rulesets, Volatility symbols)
        │
        └── processed/                                # One subtree per source — what `dxdfir build-car` normalises to CAR
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
            │   └── jsonl/                            # Plaso json_line, one file per host
            │   └── logs/                             # Job logs
            │
            └── windows_logs/                         # EvtxECmd JSON, per host
            │
            └── zeek/
            │   └── <capture>/                        # Zeek JSON (conn.json + every other log)
            │
            └── volatility/
            │   └── <image>/                          # Volatility 3 JSONL per plugin
            │
            └── zimmerman/                            # EZ-Tools artefacts (RECmd, SRUM, MFT, …)
            │
            └── signatures/
            │   └── yara/ suricata/ hayabusa/         # detection JSONL (YARA matches / Suricata EVE / Hayabusa Sigma)
            │
            └── car/
            │   └── <source>/                         # the materialised CAR: car.db + superset.db + car_<object>.jsonl (+ car_relationships.jsonl)
            │
            └── sofelk/<tool>/                        # --pipeline sofelk output, delivered by dfir-ingest-sofelk.yml
```

The Splunk-era tree (`splunk/` with its eight apps, and a since-removed
in-container provisioning `ansible/` — **unrelated to today's
`get_sybers.dfir` collection** under `ansible/collections/`) was retired when
the SIEM moved to the Kusto emulator (itself since retired in favour of the
Elastic-native stack), and the KAPE automation (`processed/kape/`, the two
PowerShell scripts) was removed in favour of the hardened EZ-tool containers.
All of it survives in git history and on the frozen
[`deprecated`](https://github.com/Get-Sybers/DX_DFIR/tree/deprecated) branch.
