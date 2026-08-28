# Get Started

> These steps reflect the paths that actually work today. See
> [What Actually Works](/README.md#what-actually-works) before you start, and
> note that the Kusto emulator carries licensing terms you are accepting
> — [THIRD_PARTY_NOTICES.md](/THIRD_PARTY_NOTICES.md).

### Driving the pipeline

The **`dxdfir` CLI** is the pipeline's front-end (three-layer design — see
[How It Runs](/README.md#how-it-runs)). Install it, then the numbered steps below
walk a run end to end:

```bash
pip install ./python     # provides dxdfir + ansible-core; or run scripts/setup-environment.sh
dxdfir process plaso     # sources: plaso | zeek | evtx | volatility | velociraptor | signatures
dxdfir deploy            # stand up the ADX (Kusto) emulator + apply schema
dxdfir ingest            # load data_store/processed into it
dxdfir detect            # sweep detections across what's present
dxdfir validate          # run the repo check harness
```

`dxdfir deploy`/`ingest` target the ADX emulator; the SOF-ELK path is
`dxdfir process <source> --pipeline sofelk`, then the collection's
`dfir-deploy-sofelk.yml` / `dfir-ingest-sofelk.yml` playbooks. `man dxdfir` for
the manual.

### Step 1: Setup Environment
- **Run setup-environment.sh:**
  ```bash
  DX_DFIR/scripts/setup-environment.sh
  ```
_Refer to [📁 Setup_Environment](/docs/scripts/Setup_Environment.md) for details on the script._

### Step 2: Place Raw Data
- **Disk Images (`.E01`):**
  ```bash
  DX_DFIR/data_store/raw/disk_images/
  ```

- **VMware VM Exports (one folder per VM):**
  ```bash
  DX_DFIR/data_store/raw/VM_files/
  ```

- **Network Captures (`.pcap`, `.pcapng`):**
  ```bash
  DX_DFIR/data_store/raw/pcaps/
  ```

- **Other Raw Data Sources:**
  ```bash
  DX_DFIR/data_store/raw/other_raw_data/
  ```

_Refer to [📁 Dir-Structure](/docs/Dir-Structure.md) for detailed directory structures._

### Step 3: Process Forensic Images (E01 / VMware)
```bash
dxdfir process plaso
```
- Automates forensic analysis of all `.E01` disk images and VMware VM exports using Plaso.
- Output lands in `data_store/processed/log2timeline/jsonl/` (Plaso `json_line`,
  fanned out into one `host.L2t<Parser>` table per top-level parser on ingest),
  the `.plaso` databases in `plaso/`, and job logs in `logs/`.

### Step 4: Process PCAPs with Zeek
```bash
dxdfir process zeek
```
- Automates processing of all network capture files (`.pcap` and `.pcapng`) using Zeek.
- Output lands in `data_store/processed/zeek/<pcap-name>/`.

### Step 5: Parse Windows Event Logs (optional)
```bash
dxdfir process evtx
```
- Converts `.evtx` in `data_store/raw/logs/winevt/<host>/` using EvtxECmd.
- Requires operator-supplied EvtxECmd — see
  [the README](/data_store/dependencies/evtxecmd/README.md). MIT licensed, no
  commercial-use restriction.
- See [Scripts-Overview](/docs/scripts/Scripts-Overview.md) for the pipeline layers.

### Step 6: Deploy the Kusto emulator + schema
```bash
dxdfir deploy
```
- Starts the **Azure Data Explorer Kusto emulator** in Docker — the real Kusto
  engine, entirely local (no Azure, no account, no cloud) — waits for the
  engine to answer, then creates the databases (`host`, `network`, `memory`,
  `misc`, `mitre`), typed tables, ingestion mappings, and the MITRE CAR
  functions from `kusto/schema/`. Idempotent — safe to re-run. It drives the
  `dfir_deploy_adx` role; `ansible-playbook playbooks/dfir-deploy-adx.yml`
  works too.
- ⚠️ This sets `ACCEPT_EULA=Y`, **accepting Microsoft's Software License Terms
  on your behalf.** The emulator is provided *as-is*, without support or
  warranties, and Microsoft documents it as generally unsuitable for
  production workloads.
- ⚠️ **The emulator has NO authentication and speaks plaintext HTTP.** It is
  published on `127.0.0.1` only; any other bind address is refused unless
  `dfir_deploy_adx_expose=true` is set as well. It also runs on an isolated
  (masquerade-off) network with no usable egress, and the deploy reads the
  port bindings back and probes egress from inside the container after start.

**Ephemeral by default — and that is the recommended mode.** Microsoft advises
against persisting emulator data outside the container (version compatibility,
no extent merging). `data_store/processed/` is the source of truth here, so the
intended workflow is redeploy + re-ingest, which is cheap:

```bash
dxdfir deploy                              # ephemeral, volatile databases (default)
dxdfir deploy --persist                    # opt in to on-disk databases, with the caveats above
docker rm -f kusto-emulator                # ephemeral: removing the container IS the purge
dxdfir deploy --port 8081                  # non-default port
dxdfir deploy -e dfir_deploy_adx_memory=8G # any role variable via -e
```

Role variables (`-e KEY=VALUE`, repeatable): see the
[`dfir_deploy_adx` README](/ansible/collections/get_sybers.dfir/roles/dfir_deploy_adx/README.md)
for the full table (image, container, host/port, memory, isolation, persist).

### Step 7: Ingest processed evidence
```bash
dxdfir ingest
```
- Loads `data_store/processed/` into the emulator (the `dfir_ingest_adx` role /
  `get_sybers_dfir.ingest`): Plaso `json_line` fanned out
  into per-parser `host.L2t<Parser>` tables, EvtxECmd JSON → `host.EvtxEcmdJson`,
  Zeek `conn` → `network.ZeekConn` (every other Zeek log → the generic
  `network.Zeek`), Volatility JSONL → `memory.VolatilityJson`, and Velociraptor
  JSON → `host.VelociraptorJson` (each record wrapped with its `Artefact`/`SourceFile`).
- The Velociraptor **ingest** loader is wired; what's still partial is the
  **upstream** collection path — the Velociraptor offline collectors running the
  EZ Tools (the KAPE replacement) aren't built yet, so in practice there is
  usually no processed Velociraptor data to load.
- An in-DB ledger makes re-runs idempotent (already-loaded files are skipped;
  `--force` re-ingests). The ledger lives in the ephemeral database, so a
  redeploy resets ledger and data together.
- `--only l2t|zeek|evtx|volatility|velociraptor` limits to one source;
  `--dry-run` lists without contacting anything.

### Step 8: Query

Connect any Kusto client to `http://127.0.0.1:8080` (for example
[Kusto.Explorer](https://learn.microsoft.com/en-us/kusto/tools/kusto-explorer)
on Windows), or drive it with `curl` — the deploy banner prints the endpoints.

Start in the `mitre` database:

```kusto
CarCoverage()          // which CAR objects have data right now
CarProcess() | take 50
CarFlow() | where dest_port == 445
```

---

For detailed script usage, refer to the [📜 Scripts Overview](/docs/scripts/Scripts-Overview.md).
The design, the schema layout, and what is deliberately not done yet:
[docs/Kusto-Port.md](/docs/Kusto-Port.md).
