## 🚀 Get Started

> **🧪 Beta.** These steps reflect the paths that actually work today. See
> [What Actually Works](/README.md#what-actually-works) before you start, and
> note that KAPE and Splunk carry licensing restrictions —
> [THIRD_PARTY_NOTICES.md](/THIRD_PARTY_NOTICES.md).
>
> Use the scripts in `scripts/`. **Do not use `scripts/v2/`** — four of its
> seven scripts resolve the repo root incorrectly. See
> [Known Limitations](/project-progress.md#-known-limitations).

### ⚙️ **Step 1: Setup Environment**
- **Run setup-environment.sh:**
  ```bash
  Splunk_DFIR/scripts/setup-environment.sh
  ```
_Refer to [📁 Setup_Environment](/docs/scripts/Setup_Environment.md) for details on the script._

### 🗂️ **Step 2: Place Raw Data**
- **Disk Images (`.E01`):**
  ```bash
  Splunk_DFIR/data_store/raw/disk_images/
  ```

- **VMware VM Exports (one folder per VM):**
  ```bash
  Splunk_DFIR/data_store/raw/VM_files/
  ```

- **Network Captures (`.pcap`, `.pcapng`):**
  ```bash
  Splunk_DFIR/data_store/raw/pcaps/
  ```

- **Other Raw Data Sources:**
  ```bash
  Splunk_DFIR/data_store/raw/other_raw_data/
  ```

_Refer to [📁 Dir-Structure](/docs/Dir-Structure.md) for detailed directory structures._

### 💾 **Step 3: Process Forensic Images (E01 / VMware)**
```bash
Splunk_DFIR/scripts/process-log2timeline-Dynamic.sh
```
- Automates forensic analysis of all `.E01` disk images and VMware VM exports using Plaso.
- Output lands in `data_store/processed/log2timeline/csv/`, with job logs in `logs/`.

### 🛜 **Step 4: Process PCAPs with Zeek**
```bash
Splunk_DFIR/scripts/process-zeek-ALL.sh
```
- Automates processing of all network capture files (`.pcap` and `.pcapng`) using Zeek.
- Output lands in `data_store/processed/zeek/<pcap-name>/`.

### 🪟 **Step 5: Parse Windows Event Logs (optional)**
```bash
Splunk_DFIR/scripts/process-evtx-EvtxECmd.sh
```
- Converts `.evtx` in `data_store/raw/other_raw_data/WinEvt/<host>/` using EvtxECmd.
- Requires operator-supplied EvtxECmd — see
  [the README](/data_store/dependencies/evtxecmd/README.md). MIT licensed, no
  commercial-use restriction.
- ⚠️ Not runtime-tested — see
  [the script docs](/docs/scripts/processing_data/process-evtx-EvtxECmd.md).

### 📊 **Step 6: Deploy Splunk**
```bash
Splunk_DFIR/scripts/deploy-splunk.sh
```
- Deploys Splunk Enterprise using Docker, configured for automatic data ingestion.
- **Redeploying is the normal path.** An existing container is removed and
  rebuilt without prompting, because indexes live in a Docker volume and survive.
- ⚠️ This accepts the Splunk software licence on your behalf via
  `SPLUNK_START_ARGS=--accept-license`, and runs the volume-capped free tier.

**What survives a redeploy**

| | |
|:---|:---|
| **Persists** — `/opt/splunk/var` (volume `splunk-dfir-var`) | Indexed events, and the fishbucket — so already-ingested files are not re-read and events are not duplicated |
| **Rebuilt** — `/opt/splunk/etc` | Apps and confs re-seeded from `splunk/etc/` every deploy, so edits there take effect on the next one. **Changes made in the Splunk UI are lost.** |

Use `scripts/purge-splunk-container.sh` to wipe indexes as well.

**Where indexes are stored**

Everything this project mounts is staged under `/data/` inside the container and
copied into place by the pre-task playbooks — which is why `splunk/etc`,
`data_store/processed` and `ansible/playbooks` are all mounted read-only.

Indexes are the exception, and you get to choose:

```bash
./scripts/deploy-splunk.sh                              # Docker volume (default)
./scripts/deploy-splunk.sh --var-dir ./splunk/var       # a directory you can see
./scripts/deploy-splunk.sh --var-dir /mnt/case01/idx    # ...on whichever disk has room
```

| | Why |
|:---|:---|
| **Docker volume** (default) | Docker seeds it from the image, so `/opt/splunk/var` keeps the container's splunk-user ownership. Nothing to set up. Lives wherever Docker's storage is — usually `/var/lib/docker`, which may not be the disk with your free space |
| **`--var-dir PATH`** | Indexes are a directory: visible, sizeable with `du`, backup-able, and on the disk you pick. Needs the directory owned by the container's splunk UID, which the deploy does for you |

`--var-dir ./splunk/var` is the layout this project was originally built
around — `splunk/.gitignore` already has a `var/**` rule for it. Indexing a
large case can run to hundreds of GB, so on a forensics workstation the disk it
lands on is worth deciding deliberately.

**Network isolation**

The container holds evidence, so by default it is **only reachable from this
machine** and **cannot usefully reach the network**:

- ports published on `127.0.0.1` only, not `0.0.0.0` — this is the solid half
- attached to a bridge with IP masquerade disabled, so outbound traffic gets no
  reply

> **An earlier version used `--internal` for this. That was wrong** — an internal
> network blocks published ports too, so Splunk became unreachable on localhost.
> If you hit that, redeploying picks up the fix; the script detects and
> recreates the bad network.

The deploy now tests **both directions** after starting: that the container
can't reach out, and that Splunk actually answers. Checking only egress is what
let the unreachable-UI bug through.

```bash
./scripts/deploy-splunk.sh                 # isolated, localhost-only (default)
./scripts/deploy-splunk.sh --no-isolated   # allow outbound — and to recover if
                                           # you still can't reach the UI
./scripts/deploy-splunk.sh --bind 0.0.0.0  # expose on the LAN — think first
```

Not an airgap. Disabling masquerade breaks return traffic rather than dropping
packets, so a host with its own forwarding rules can still let traffic out. For
a hard guarantee use a `DOCKER-USER` firewall rule on the network's subnet. See
[SECURITY.md](/SECURITY.md).

**Purge vs persist**

The deploy script decides whether a redeploy keeps or wipes indexed data:

```bash
./scripts/deploy-splunk.sh                # --persist (default): keep indexes
./scripts/deploy-splunk.sh --purge        # wipe indexes, THEN REDEPLOY
./scripts/deploy-splunk.sh --purge-only   # wipe indexes and STOP — no redeploy
./scripts/deploy-splunk.sh --purge --yes  # ...without the confirmation prompt
./scripts/deploy-splunk.sh --help         # all options
```

`--purge` is a flag on the *deploy* script, so it deploys afterwards. Use
`--purge-only` (or `scripts/purge-splunk-container.sh`) when you just want the
data gone.

`--purge` deletes the index volume, so **every indexed event and the fishbucket
go**. Raw and processed evidence on disk is untouched — you can re-ingest. It
prompts for confirmation unless `--yes`, and refuses outright if there is no
terminal to confirm on.

`scripts/purge-splunk-container.sh` still exists for purging *without*
redeploying.

**Unattended deploys**

| Variable | Default | Purpose |
|:---|:---|:---|
| `SPLUNK_PASSWORD_FILE` | — | Read the admin password from a file (preferred) |
| `SPLUNK_PASSWORD` | — | Admin password from the environment |
| `SPLUNK_REPLACE` | `always` | `always` \| `ask` \| `never` |
| `SPLUNK_READY_TIMEOUT` | `600` | Seconds to wait for the container's Ansible run |
| `SPLUNK_VAR_VOLUME` | `splunk-dfir-var` | Index volume name |
| `SPLUNK_VAR_DIR` | — | Host directory for indexes; overrides the volume. Same as `--var-dir`. Set the same value for `purge-splunk-container.sh` |
| `SPLUNK_ISOLATED` | `1` | `1` = masquerade-disabled bridge, no usable egress; `0` = allow outbound |
| `SPLUNK_BIND_ADDR` | `127.0.0.1` | Host address published ports bind to |
| `SPLUNK_NETWORK` | `splunk-dfir-isolated` | Isolated network name |
| `SPLUNK_SKIP_CHMOD` | `0` | Skip the permission fixup. It is O(files) over `data_store/processed` and runs every deploy; safe to skip once permissions are already right |

```bash
SPLUNK_PASSWORD_FILE=~/.splunk-admin ./scripts/deploy-splunk.sh
```

---

For detailed script usage, refer to the [📜 Scripts Overview](/docs/scripts/Scripts-Overview.md).
