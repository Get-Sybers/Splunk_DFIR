# 📂 `data_store`

All raw and processed forensic data for the **DX_DFIR pipeline** lives here.
Everything under `data_store/` is gitignored deny-by-default — read
[Before You Run Anything](/README.md#before-you-run-anything) before you commit.

---

## 📁 Directory Structure

The full annotated tree (including the analysis backend) is in
[Dir-Structure.md](/docs/Dir-Structure.md); this is the evidence-side view.

```bash
data_store/
   ├── raw/                        # Unprocessed evidence — you place it here
   │   ├── disk_images/            # Disk images (.E01, .raw/.dd, .vmdk, …)
   │   ├── pcaps/                  # Packet captures (.pcap, .pcapng)
   │   ├── VM_files/               # VMware VM exports (one folder per VM)
   │   ├── memory/                 # Memory captures
   │   └── other_raw_data/         # e.g. WinEvt/<host>/*.evtx for the EVTX path
   │
   ├── dependencies/               # Operator-supplied tools (e.g. EvtxECmd)
   │
   └── processed/                  # One subtree per source — what `dxdfir build-car` reads
       ├── log2timeline/
       │   ├── plaso/              # .plaso databases (reusable by Timesketch / SOF-ELK)
       │   ├── jsonl/              # Plaso json_line, one file per host
       │   └── logs/               # Job logs
       ├── windows_logs/           # EvtxECmd JSON, per host
       ├── zeek/<capture>/         # Zeek JSON (conn.json, dns.json, …)
       ├── volatility/<image>/     # Volatility 3 JSONL per plugin
       ├── zimmerman/              # EZ-Tools artefacts (RECmd, SRUM, MFT, …)
       ├── signatures/             # yara/ suricata/ hayabusa/ detection JSONL
       ├── linux_logs/             # syslog/auth/utmp/… (not yet wired into the backend)
       ├── car/<source>/           # the materialised CAR: car.db + car_<object>.jsonl (+ car_relationships.jsonl)
       └── sofelk/<tool>/          # --pipeline sofelk output, delivered by dfir-ingest-sofelk.yml
```

---

## 🛠️ Usage & Workflow

**1. Place raw evidence** in the matching `raw/` subdirectory above.

**2. Process it.** The `dxdfir` CLI is the front-end (see
[How It Runs](/README.md#how-it-runs)):

```bash
dxdfir process plaso        # disk images / VM exports
dxdfir process zeek         # pcaps
dxdfir process evtx         # Windows event logs
dxdfir process volatility   # memory
dxdfir process zimmerman    # EZ-Tools artefacts from disk images
dxdfir process signatures   # yara / suricata / hayabusa
```

Add `--pipeline sofelk` to write the retiring SOF-ELK delivery tree instead of the
default processed tree (output lands under `processed/sofelk/<tool>/`).

**3. Build and verify the CAR:**

```bash
dxdfir build-car            # every source -> processed/car/<source>/car_<object>.jsonl
dxdfir verify-car           # the correctness gate over what was written
```

**4. Bring up the analysis backend** — the Elastic-native stack under
[`docker/elastic/`](/docker/elastic/README.md) (docker compose, localhost-only,
security on). Filebeat ships the delivered evidence tree into `logs-dfir.<type>-*`
data streams; see [Get-Started](/docs/Get-Started.md) steps 7–9.

---

## ⚠️ Notes

- **Verify hashes** when moving forensic images (`.E01`).
- **Never commit evidence.** `data_store/` is gitignored deny-by-default, but it
  is a safety net, not a guarantee — check `git status` before every commit.
- Follow the layout above so the CAR lane and the shipper find each source.

🚀 **Stay organized, process efficiently, and hunt smart!**
