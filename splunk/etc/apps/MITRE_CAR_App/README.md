# MITRE_CAR_App

The [MITRE CAR](https://car.mitre.org/data_model/) data model, and the field
mappings that populate it from this pipeline's sources.

> ## ⚠️ Not verified against a running Splunk
>
> The confs parse, the data model is valid JSON generated from MITRE's own
> file, and every tag the model constrains on is produced by `tags.conf`. None
> of that proves a single field extracts correctly from real evidence. Treat
> this as a mapping to validate, not a finished feature — and see
> [issue #13](https://github.com/Get-Sybers/Splunk_DFIR/issues/13).

## How it fits together

```
car_data_model.json  (vendored from mitre-attack/car, Apache-2.0)
        │
        │  dev-scripts/generate-car-datamodel.py
        ▼
default/data/models/MITRE_CAR.json     9 objects, constrained on tag=car_<object>
        ▲
        │  tag
default/tags.conf                      attaches car_* tags to eventtypes
        ▲
        │
default/eventtypes.conf                which sourcetypes can populate each object
        │
        │  and separately
        ▼
default/props.conf                     source field names -> CAR field names
```

Two halves, and both are required. The eventtype/tag layer decides *which
events* enter an object; props.conf decides *what their fields are called*
once they are in. A data model with only the first half returns rows of nulls.

**Do not edit `MITRE_CAR.json` by hand.** Regenerate it:

```bash
./dev-scripts/generate-car-datamodel.py
```

## Coverage — what is actually populated

| CAR object | Source | State |
|:---|:---|:---|
| `car_flow` | Zeek `conn.log` | ✅ Mapped. Needs operator-supplied `Splunk_TA_zeek` to produce `zeek:conn` |
| `car_user_session` | EvtxECmd — 4624/4625/4634/4647/4648/4778/4779 | ✅ Mapped, including logon type → CAR action |
| `car_process` | EvtxECmd 4688/4689; Plaso Prefetch/Amcache/AppCompatCache; KAPE ProgramExecution | ◑ Partial — see below |
| `car_service` | EvtxECmd 7045/4697 | ✅ Mapped |
| `car_registry` | KAPE Registry | ◑ Mapped on the field names Zimmerman's registry tools share |
| `car_file` | Plaso filesystem rows; KAPE FileFolderAccess / FileDeletion | ✅ Mapped |
| `car_driver` | — | ❌ **No source.** Needs driver load/unload events |
| `car_module` | — | ❌ **No source.** Needs image-load events |
| `car_thread` | — | ❌ **No source.** Needs thread-create / remote-thread events |

Those last three return nothing, and that is deliberate. Nothing this pipeline
ingests produces driver loads, module loads or thread creation — they come from
Sysmon (events 6, 7, 8) or a live EDR agent, neither of which is a dead-box
source. Leaving the objects empty is a true statement about the data; wiring
them to something approximate would not be.

### Why `car_process` is only partial

Only EvtxECmd 4688 carries a pid, ppid, parent and command line. The other
process sources are execution *artefacts* — Prefetch, Amcache, AppCompatCache
and KAPE's ProgramExecution record that a binary ran, not the process tree that
ran it. So for those rows `exe` and `image_path` populate and `pid`, `ppid`,
`parent_exe` and `command_line` stay null.

That is the honest shape of dead-box process data, and it is why the README's
example search — `process=* action=create | table dtg, hostname, user,
command_line` — returns a command line only for 4688 rows.

## Design notes

**Field aliases cannot target a data model.** An earlier attempt at this lived
commented-out in `Log2timeline_App/default/props.conf`, dated 20 April 2025, and
would not have worked:

```
FIELDALIAS-car_process_exe = filename AS process.exe
```

`FIELDALIAS` creates a field named literally `process.exe`. It does not place
`exe` into a `process` data model object. Objects are populated by constraint —
here, by tag — and their fields are ordinary flat fields. Hence the split above.

**Nulls are kept.** Where a source cannot supply a CAR field it is left unset
rather than defaulted. `coalesce(X, "unknown")` would make every object look
fully populated in `| tstats`, which for forensic data is worse than a gap you
can see.

**pids are converted from hex.** Windows 4688 writes `NewProcessId` as `0x1a4`.
CAR's `pid` is a number, so props.conf strips the prefix and converts base 16 —
otherwise `pid=420` never matches anything.

**Zeek `end_time` is derived, not read.** `conn.log` has `ts` and `duration`,
not an end timestamp, so `end_time` is `_time + duration` and is null when
`duration` is.

## Verifying it

Once a real deploy exists:

```spl
| tstats count FROM datamodel=MITRE_CAR BY nodename
```

Every object with a source in the table above should be non-zero; the three
without should be zero. Then check the mapping actually landed:

```spl
| datamodel MITRE_CAR car_user_session search
| table _time, hostname, user, action, src_ip, logon_id
```

and the search the project's README has always promised:

```spl
| datamodel MITRE_CAR car_process search
| search action=create
| table _time, hostname, user, command_line, exe
```

If a column is entirely null, the mapping for that source is wrong — report it
on issue #13 with the sourcetype rather than assuming the model is broken.
