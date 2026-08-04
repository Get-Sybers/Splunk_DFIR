# EvtxECmd Processing Script

> **🧪 Beta, and not runtime-tested.** Written without access to Windows, a
> `.evtx` sample, .NET, or a running Splunk. Everything below is statically
> verified only — the shell parses and lints clean, the conf files follow
> Splunk's documented syntax — but nothing here has processed a real event log.
> Treat it as a starting point to validate, not a finished feature.

## Overview

Splunk cannot read binary `.evtx`. `scripts/process-evtx-EvtxECmd.sh` converts
Windows Event Logs with [EvtxECmd](https://github.com/EricZimmerman/evtx) into
a form Splunk can index, and `EvtxECmd_App` maps EvtxECmd's field names onto the
ones the **Splunk Add-on for Microsoft Windows** uses.

```
data_store/raw/other_raw_data/WinEvt/<host>/*.evtx
        │
        ▼  EvtxECmd (in a .NET container)
data_store/processed/windows_logs/<host>/
        ├── <name>_EvtxECmd_Output.json     -> sourcetype evtxecmd:json   ✅ supported
        └── <name>_EvtxECmd_Output.xml      -> sourcetype evtxecmd:xml    ⚠️ best-effort
        │
        ▼  inputs.conf monitor
Splunk index=host, fields mapped by EvtxECmd_App
```

Sub-directories under `WinEvt/` are preserved in the output, so keep one folder
per host. Files placed directly in `WinEvt/` land under `unspecified_host`.

## Prerequisites

Extract the **.NET** build of EvtxECmd into
`data_store/dependencies/evtxecmd/`, including its `Maps/` folder. See
[the README there](/data_store/dependencies/evtxecmd/README.md).

EvtxECmd is **MIT licensed**, so unlike the KAPE path there is no restriction on
commercial use.

## Usage

```bash
./scripts/process-evtx-EvtxECmd.sh
```

Overrides:

| Variable | Default | Purpose |
|:---|:---|:---|
| `EVTXECMD_DIR` | `data_store/dependencies/evtxecmd` | Where EvtxECmd lives |
| `DOTNET_IMAGE` | `mcr.microsoft.com/dotnet/sdk:8.0` | .NET runtime image |

The script is **idempotent**: an `.evtx` whose JSON output already exists is
skipped. That is deliberate — re-parsing is expensive, and overwriting a file
Splunk has already indexed causes it to re-index the whole thing and duplicate
every event. Delete the output to force a re-parse.

Empty or corrupt logs have their zero-byte artefacts removed, so a failed parse
doesn't leave something behind that the skip-guard mistakes for success.

## Field mapping

`EvtxECmd_App` maps EvtxECmd's names onto the add-on's, then onto CIM.

| EvtxECmd | Splunk Add-on for Windows | CIM |
|:---|:---|:---|
| `EventId` | `EventCode` | `event_id`, `signature_id` |
| `EventRecordId` | `RecordNumber` | `event_record_id` |
| `Computer` | `ComputerName` | `dest`, `dvc`, `dvc_nt_host` |
| `Channel` | `LogName` | `app` |
| `Provider` | `SourceName` | `event_source`, `provider` |
| `Level` | `Type` | `vendor_severity_id` |
| `UserId` | `Sid` | — |
| `UserName` | `User` | `user` |
| `ProcessId` | — | `process_id` |
| `ThreadId` | — | `thread_id` |
| `RemoteHost` | — | `src` |
| `ExecutableInfo` | — | `process` |
| `MapDescription` | — | `signature` |

`host` is set at index time from each event's own `Computer` field by the
`evtxecmd_set_host` transform. Without that, every parsed record would be
attributed to the Splunk container rather than the machine the log came from.

**The official add-on is not required.** This app maps to its *field names* so
that searches and dashboards written against it work — it does not depend on it
being installed, and does not conflict if it is, because the add-on keys on the
`WinEventLog`/`XmlWinEventLog` sourcetypes rather than these.

## ⚠️ Why the XML lane is not `XmlWinEventLog`

The obvious idea is to emit XML and label it `XmlWinEventLog` so the real add-on
parses it. That is not safe, and the reason is in EvtxECmd's source.

- `Payload` in the JSON output is `reader.ReadOuterXml()` over `EventData` /
  `UserData` — the **data fragment only**, with no `<System>` block. It is not a
  whole `<Event>` record.
- `--xml` uses `ConvertPayloadToXml()`, which builds a full `<Event>` structure
  but **beautifies it and strips the namespace declaration**.

The add-on's `XmlWinEventLog` handling keys on the exact wire format a Windows
forwarder emits — one record per line, `<Event xmlns='http://schemas.microsoft.com/win/2004/08/events/event'>`.
Beautified, namespace-stripped XML is not that.

So the XML lane gets its own `evtxecmd:xml` sourcetype and is **disabled by
default** in `inputs.conf`. Mislabelling it `XmlWinEventLog` would look like it
worked, then silently under-extract.

If you need true `XmlWinEventLog` fidelity, a tool that emits the original XML
byte-for-byte — such as [`evtx_dump`](https://github.com/omerbenamram/evtx) —
is the right choice, and can sit alongside this rather than replace it.

## What still needs verifying

- That EvtxECmd runs under `mcr.microsoft.com/dotnet/sdk:8.0` with these
  arguments. The `--json`/`--jsonf`/`--xml`/`--xmlf` flags are documented, but
  the invocation has not been executed.
- That Splunk's ISO8601 recognition parses EvtxECmd's 7-digit fractional
  seconds. `TIME_FORMAT` is deliberately left unpinned because 7 digits does not
  map onto Splunk's `%3N`/`%6N`/`%9N`; `TIMESTAMP_FIELDS = TimeCreated` still
  pins which field is used.
- That `INDEXED_EXTRACTIONS = json` makes `Computer` available to the index-time
  host transform.
- Whether `MapDescription` is populated, which depends on `Maps/` being present.
