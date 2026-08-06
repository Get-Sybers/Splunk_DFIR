# 🧪 Runtime validation — fields, source types, and CAR coverage

This is the first record of the pipeline **run against a live Kusto emulator**
with data processed from the [Digital Corpora](https://digitalcorpora.org/)
sample URLs in [`dev-scripts/samples-manifest.tsv`](/dev-scripts/samples-manifest.tsv).
It establishes the fields each source actually emits, how one piece of evidence
breaks down into ADX *source types*, and which MITRE CAR objects those source
types populate. It also records the defects the live run surfaced — every one
of them a "parsed in review, failed the moment it ran" bug that no fake could
have caught.

> **What ran against real tooling vs. what was validated with a fixture.**
> This distinction is load-bearing and is kept honest throughout:
>
> | Lane | Input produced by | ADX ingest + mapping + CAR |
> |:---|:---|:---|
> | **Plaso → `host.L2tCsv`** | ✅ real `psteal` on three real `.E01` images | ✅ verified live |
> | **Zeek → `network.ZeekConn`** | ⚠️ format-accurate `conn.log` fixture¹ | ✅ verified live |
> | **EvtxECmd → `host.EvtxEcmdJson`** | ⚠️ format-accurate JSON fixture¹ | ✅ verified live |
>
> ¹ The Zeek image (`zeek/zeek`) and the OpenSUSE OBS Zeek packages are both
> refused at the network egress proxy (`403` on CONNECT), and there is no
> standalone `.evtx` in the corpus (real event logs live only inside the
> multi-GB Windows disk images — LoneWolf, Narcos). So the Zeek and EvtxECmd
> **engines** could not be run here. Their **output formats are deterministic**,
> so a byte-accurate fixture of what each tool emits was used to drive the ADX
> side — which is the half this project had never exercised. Plaso *was* run for
> real: it installs from PyPI (`pip install plaso`, pulling the compiled libyal
> readers), which the proxy allows.

The emulator image (`mcr.microsoft.com/azuredataexplorer/kustainer-linux`)
pulls from Microsoft Container Registry, which the proxy allows — so the ADX
backend itself is fully real.

---

## The headline: `CarCoverage()` against real + fixture data

Deploy → apply → ingest, from a clean container:

```
Object         Rows
file           1240     <- Plaso, three real .E01 images
flow              4     <- Zeek conn.log fixture
user_session      1     <- EvtxECmd 4624 fixture
service           1     <- EvtxECmd 7045 fixture
process           1     <- EvtxECmd 4688 fixture
registry          0     <- unsourced (awaits Velociraptor/EZ-Tools)
driver            0     <- unsourced (needs Sysmon/live agent)
module            0     <- unsourced
thread            0     <- unsourced
```

Five of nine CAR objects now carry data end-to-end; the four zeros are the
honest, documented gaps, not failures. The README's "envisioned endstate"
query returns a real row now:

```kusto
CarProcess() | where isnotempty(command_line)
| project dtg = Timestamp, hostname, user, command_line, artifact = Origin
```
```
dtg                          hostname  user       command_line                                         artifact
2025-01-01T10:14:29.123Z     WKS-1     analyst01  powershell.exe -nop -exec bypass Invoke-Mimikatz.ps1 evtx:4688
```

---

## Defects the live run surfaced (all fixed)

| # | File | Symptom on the live emulator | Fix |
|:--|:--|:--|:--|
| 1 | `kusto/schema/00-databases.kql` | `.create database network volatile` → **`General_BadRequest`**. `network` is a reserved word in the engine grammar; a bare name that read fine and failed on first contact. `host` created only because it happened to be first. | Bracket-quote every name: `.create database ["network"] volatile`. Downstream `database("network")` refs were already string-quoted. |
| 2 | `scripts/apply-kusto-schema.sh`, `tests/run-checks.sh` | The two places that parse database names out of the `.kql` expected the bare form and would have read every DB as absent once #1 was bracketed. | Bracket-tolerant regex that strips `["…"]` back to the plain name; command construction brackets the name too. |
| 3 | `kusto/schema/40-mitre.kql` — `CarCoverage()` | `print Object="registry", Rows = 0L` → **`SEM0100: Failed to resolve … '0L'`**. This emulator build rejects the typed-integer-literal suffix (`0L`), though it is valid in the cloud grammar. | `long(0)` — accepted by both, keeps the column a `long`. |
| 4 | `kusto/schema/40-mitre.kql` — `CarFile()` | 260 of 1240 real Plaso rows got an **empty `action`**. The `modify` regex matched only `content modification`, but a real NTFS image emits three modification descriptions. | Broaden the branch to `(?i)modification\|mtime`, capturing `Content`, `Metadata` and `File Last` modification times. All 1240 rows now classify. |

And one **unknown resolved rather than a bug** — [issue #14, item 6](https://github.com/Get-Sybers/DX_DFIR/issues/14):

> **`pid` hex conversion works.** `CarProcess` sets `pid = tolong(NewProcessId)`
> where `NewProcessId` is a hex string like `"0x1a4"`. Whether `tolong()`
> accepts a `0x` string *at runtime* (as opposed to a `0x` integer literal) was
> flagged untested. It does: `tolong("0x1a4")` → `420`, `tolong("0x1234")` →
> `4660`. Confirmed both in isolation and on the ingested 4688 row (`pid=420`,
> `pid_hex="0x1a4"`). Note `tolong("1a4")` *without* the prefix → `null`, so the
> `pid_hex` raw fallback is still worth keeping — but EvtxECmd always emits the
> `0x` form, so `pid` is populated.

---

## Fields established, per source

### Plaso — `host.L2tCsv` (real)

`psteal --output-format dynamic` with the 23-field list in
`process-log2timeline-Dynamic.sh`. The emitted CSV **header order matches the
`--fields` list and the `L2tCsvMapping` ordinals exactly** (verified column by
column), so the ordinal mapping is correct:

```
0 date        1 datetime(->Timestamp)  2 description   3 description_short
4 display_name 5 filename  6 host  7 hostname  8 inode  9 macb
10 message  11 message_short  12 source  13 sourcetype  14 source_long
15 tag  16 time  17 timestamp_desc  18 timezone  19 type  20 user
21 username  22 zone
```

- **`datetime` format** is `2008-12-31T22:44:02.215500+00:00` (microseconds +
  `+00:00` offset). Kusto parses it as `datetime` with **zero nulls** across
  1240 rows. Unset MACB times surface as `0001-01-01T00:00:00Z`, which is
  forensically correct (no timestamp), not a parse failure.
- **`ignoreFirstRecord=true` works**: the header row is dropped, no junk
  null-timestamp row leaks into `CarFile()`/`CarProcess()`.
- **The dynamic CSV quoted correctly**: every one of 1240 rows parsed to exactly
  23 fields; no embedded-comma column shift.

**How one image breaks into ADX source types.** Three filesystem test images
(`ntfs1-gen0.E01`, `exfat1.E01`, `imageformat_mmls_1.E01`) produced:

| `source` | `sourcetype` / `source_long` | Rows | CarFile regex `\bfs\b\|ntfs\|file` |
|:--|:--|--:|:--:|
| `FILE` | `NTFS file stat` | 752 | ✅ |
| `FILE` | `File stat` | 486 | ✅ |
| `FILE` | `MacOS File System Events Disk Log Stream` | 2 | ✅ |

`timestamp_desc` — the field that makes the CAR `action` derivable — took five
distinct values, now **all** mapped after fix #4:

| `timestamp_desc` | CarFile `action` |
|:--|:--|
| `Creation Time` | `create` |
| `Content Modification Time` | `modify` |
| `Metadata Modification Time` | `modify` *(was unmapped)* |
| `File Last Modification Time` | `modify` *(was unmapped)* |
| `Last Access Time` | `read` |

> These are filesystem-only test images, so they exercise the `CarFile` lane
> only — `CarProcess`-from-Plaso (Prefetch/Amcache/AppCompatCache) needs a
> Windows image. The value proved here is the **L2tCsv schema, mapping, datetime
> parsing, header handling, and the `source_long → CAR-object` routing** — the
> mechanics every Plaso source shares. On a Windows image the *same* `L2tCsv`
> table additionally carries `sourcetype` values like `WinPrefetch`,
> `Amcache`, and registry sources, which the same regexes fan out to
> `CarProcess`/`CarFile`.

### Zeek — `network.ZeekConn` (fixture-driven ADX validation)

`conn.log` after `zeek-cut -C -U "%Y-%m-%dT%H:%M:%S%z"`: TSV, `#`-prefixed
headers, 21 columns (ordinals 0–20 = `ZeekConnMapping`).

- **`ts` renders ISO8601 as `2008-07-22T02:51:23+0000`** (offset *without* a
  colon). Kusto parses it as `datetime` → `…Z`. This was an open question about
  the ISO8601 story; it holds.
- `ingest-kusto.sh`'s Zeek path did its job live: the `#fields` order guard
  passed, `#`-lines were stripped, and the 21 columns landed in the right typed
  columns (`SrcIp`, `SrcPort`, `DestIp`, `DestPort`, `Proto`, `Service`,
  `ConnState` all correct).
- **`CarFlow()`** derived `action` from `ConnState` (`SF`→`end`, `REJ`→`end`),
  `packet_count = orig_pkts + resp_pkts` (6+5=11, 20+18=38 ✓), and
  `end_time = ts + duration` (`02:52:10` + 12s = `02:52:22` ✓).

### EvtxECmd — `host.EvtxEcmdJson` (fixture-driven ADX validation)

EvtxECmd `--json`, one object per line (`multijson`). Mapping is by JSON path;
the 25 columns landed, and `TimeCreated` parsed even with 7-digit fractional
seconds (`2025-01-01T10:14:29.1234567+00:00`).

- **`Payload` XML extraction** via `EvtxPayload(Payload, "Name")` works: from a
  4688 record it pulled `NewProcessName`, `ParentProcessName`, `CommandLine`,
  `NewProcessId`, and the *creator* `ProcessId` (not the top-level column) into
  `CarProcess`.
- **`CarProcess`** — `pid=420` (`0x1a4`), `ppid=4` (`0x4`), full command line.
- **`CarUserSession`** — a 4624 `LogonType=10` became `action="rdp"`, with
  `src_ip`/`src_port`/`logon_id` pulled from the payload.
- **`CarService`** — a 7045 became `action="create"`, `name="EvilSvc"`,
  `module_path="C:\Windows\Temp\evil.exe"`.

---

## Reproducing this

```bash
# 1. Plaso (real) — installs from PyPI; the corpus URLs are in the manifest
python3 -m venv /tmp/plaso-venv && . /tmp/plaso-venv/bin/activate && pip install plaso
#    fetch three small images (see samples-manifest.tsv) into
#    data_store/raw/disk_images/, then run psteal with the exact --fields from
#    process-log2timeline-Dynamic.sh (the script itself uses the Docker image,
#    which is blocked here; native psteal takes the same arguments).

# 2. Backend (real)
./scripts/deploy-kusto.sh -y
./scripts/apply-kusto-schema.sh
./scripts/ingest-kusto.sh            # l2t + zeek + evtx

# 3. Check
#    CarCoverage() in the mitre database
```

The Zeek/EvtxECmd fixtures used here are format-accurate stand-ins for the
engines that egress policy blocks; swap in real `conn.log` / EvtxECmd JSON on a
network that permits `zeek/zeek` and where a real `.evtx` is available, and the
ADX side is already proven to accept them.
