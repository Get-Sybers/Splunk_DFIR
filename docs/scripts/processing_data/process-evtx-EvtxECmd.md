# EvtxECmd Processing Script

> **⚠️ Not runtime-tested.** Written without access to Windows, a
> `.evtx` sample, .NET, or a running emulator. Everything below is statically
> verified only — the shell parses and lints clean — but nothing here has
> processed a real event log. Treat it as a starting point to validate, not a
> finished feature.

## Overview

The analysis backend cannot read binary `.evtx`.
`scripts/process-evtx-EvtxECmd.sh` converts Windows Event Logs with
[EvtxECmd](https://github.com/EricZimmerman/evtx) into line-delimited JSON,
which `ingest-kusto.sh` loads into the `host.EvtxEcmdJson` table. The MITRE
CAR functions in the `mitre` database (`CarProcess()`, `CarUserSession()`,
`CarService()`, …) read their Windows-event fields from that table.

```
data_store/raw/other_raw_data/WinEvt/<host>/*.evtx
        │
        ▼  EvtxECmd (in a .NET container)
data_store/processed/windows_logs/<host>/
        ├── <name>_EvtxECmd_Output.json     -> host.EvtxEcmdJson   ✅ supported
        └── <name>_EvtxECmd_Output.xml      -> not ingested        ⚠️ manual review only
        │
        ▼  ./scripts/ingest-kusto.sh --only evtx
Kusto database `host`, table EvtxEcmdJson (JSON path mapping, incl. Payload)
```

Sub-directories under `WinEvt/` are preserved in the output, so keep one folder
per host. Files placed directly in `WinEvt/` land under `unspecified_host`.
Per-host files with the same channel name cannot collide at ingest — the
loader stages by full relative path, hashed.

## Prerequisites

Extract the **.NET** build of EvtxECmd into
`data_store/dependencies/evtxecmd/`, including its `Maps/` folder. See
[the README there](/data_store/dependencies/evtxecmd/README.md).

EvtxECmd is **MIT licensed** — no restriction on commercial use.

## Usage

```bash
./scripts/process-evtx-EvtxECmd.sh
./scripts/ingest-kusto.sh --only evtx     # then load it
```

Overrides:

| Variable | Default | Purpose |
|:---|:---|:---|
| `EVTXECMD_DIR` | `data_store/dependencies/evtxecmd` | Where EvtxECmd lives |
| `DOTNET_IMAGE` | `mcr.microsoft.com/dotnet/sdk:8.0` | .NET runtime image |

The script is **idempotent**: an `.evtx` whose JSON output already exists is
skipped. That is deliberate — re-parsing is expensive, and Kusto ingestion is
additive with no fishbucket, so re-parsed files would duplicate rows on the
next ingest. Delete the output to force a re-parse.

Empty or corrupt logs have their zero-byte artefacts removed, so a failed parse
doesn't leave something behind that the skip-guard mistakes for success.

## Field mapping

`host.EvtxEcmdJson` is typed for EvtxECmd's own JSON field names
(`EventId`, `EventRecordId`, `Computer`, `Channel`, `Provider`, `Level`,
`UserId`, `UserName`, `ProcessId`, `ThreadId`, `RemoteHost`,
`ExecutableInfo`, `MapDescription`, `TimeCreated`, `Payload`, …) via a JSON
path mapping — see `kusto/schema/10-host.kql`.

The CAR functions then derive the model fields at query time:
`hostname = Computer`, `event id`/`signature` from `EventId`/`MapDescription`,
and per-event fields (`TargetUserName`, `NewProcessId`, `ServiceName`, …)
extracted from the `Payload` EventData fragment by the `EvtxPayload()` helper
in `kusto/schema/40-mitre.kql`. Mapping fixes are query-time changes, not
re-ingests.

## ⚠️ Why the XML lane is not ingested

- `Payload` in the JSON output is `reader.ReadOuterXml()` over `EventData` /
  `UserData` — the **data fragment only**, with no `<System>` block. It is not a
  whole `<Event>` record. (This is exactly what `EvtxPayload()` expects.)
- `--xml` uses `ConvertPayloadToXml()`, which builds a full `<Event>` structure
  but **beautifies it and strips the namespace declaration** — it is not the
  wire format a Windows forwarder emits, and nothing downstream should be
  taught to pretend it is.

The XML files are kept next to the JSON for manual review only. If you need
byte-for-byte original XML, a tool like
[`evtx_dump`](https://github.com/omerbenamram/evtx) is the right choice, and
can sit alongside this rather than replace it.

## What still needs verifying

- That EvtxECmd runs under `mcr.microsoft.com/dotnet/sdk:8.0` with these
  arguments. The `--json`/`--jsonf`/`--xml`/`--xmlf` flags are documented, but
  the invocation has not been executed.
- That Kusto's `datetime` coercion accepts EvtxECmd's 7-digit fractional
  seconds in `TimeCreated` (ISO8601 with ticks). Tracked with the other
  runtime assumptions in
  [issue #14](https://github.com/Get-Sybers/DX_DFIR/issues/14).
- Whether `MapDescription` is populated, which depends on `Maps/` being
  present.
