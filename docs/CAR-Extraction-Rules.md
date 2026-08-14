# CAR Extraction Rules

The MITRE CAR data model is the extraction target for DX_DFIR. `car_data_model.json`
(repo root, MITRE's own file) is the **single source of truth** for which fields
belong to each object. These rules govern how every CAR object is built, in the
KQL layer today (`kusto/schema/40-mitre.kql`) and in any future runtime.

## The four principles

### 1. CAR is the extraction goal — exhaustively, per artefact
For every artefact, for every CAR object that artefact can represent, extract
**every canonical CAR field the artefact is capable of supplying** — regardless
of what the artefact calls it natively. If a field exists on a CAR object and the
artefact holds that information under any name, we map it.

- Completeness is measured **per artefact against `car_data_model.json`** — "which
  of this object's canonical fields does this artefact fill?" — not "does the
  object have any rows?".
- Example: Sysmon's `Hashes` ("MD5=…,SHA256=…") → `md5_hash` / `sha1_hash` /
  `sha256_hash`. Security 4688's `SubjectUserSid` → `sid`. Don't leave a canonical
  field null when the artefact actually carries the data.

### 2. Fill the CAR object — additive, never a replacement
Filling the canonical CAR fields is the **goal**, not a rule that strips the row
down. The mapping is **additive**: each view keeps the source table's native
fields as normal named columns and **adds** the canonical CAR fields alongside
(`| extend exe = …, pid = …`). Nothing is lost — every native field stays directly
queryable by its own name, and the CAR fields never replace the raw output.

- Map to a **canonical field** whenever the artefact's data has a CAR home, under
  the correct canonical name (no invented look-alikes and no name drift — e.g.
  `tgt_pid`, not `target_pid`; `image_path`, not `module_path` on service/driver).
- Data an artefact has but CAR has **no field for** is not faked into a
  canonical-looking column — it simply stays as its own native column (e.g. SRUM's
  per-app byte counters are not a `flow` field, so they remain `Record.BytesSent`).
- `action` must be one of the object's canonical actions (e.g. process →
  `create`/`terminate`; flow → `start`/`end`/`message`).

### 3. One artefact per object, tied to identity
Each object is sourced from a **single authoritative artefact** that natively
provides the whole object **with its canonical identity fields** — not assembled
from fragments of many artefacts. Identity fields are per-object:

| Object | Canonical identity fields |
| --- | --- |
| process, flow, file, registry, service | `fqdn`, `hostname`, `user` |
| thread | `hostname`, `user` (no `fqdn`) |
| module, driver | `hostname`, `fqdn` (no `user`) |
| user_session | `hostname`, `user`, `logon_id` |

Populate every identity field the artefact natively provides; where the artefact
genuinely lacks one, it stays null (an honest gap), never faked.

### 4. Combine downstream, only if joinable
Bringing observations together — across artefacts (same object) or across objects
(correlation) — is a **separate downstream stage**, performed **only where a
shared identity key** (`hostname`/`user`/`logon_id`/`pid`/time) actually allows
the join. It is never baked into the base object definitions.

## Structural consequence

Structure the extraction layer as one view per **(artefact × object)**:
`Car<Object>_<Artefact>()` (e.g. `CarProcess_Sysmon`, `CarProcess_Memory`,
`CarRegistry_Recmd`). Each view is `<source table> | where … | extend <CAR
fields>` — native columns kept, CAR fields added. Splitting by artefact makes the
`Origin` / `Artefact` / `platform` columns **redundant** — the view name carries
the source. The base layer never unions sources; the roll-up (`CarProcess()`, a
`union isfuzzy`) is the downstream stage of principle 4: every row has the canonical
CAR fields, plus whatever native columns its source brought (null for the others).

## Runtime

Current course: **ADX / KQL**. The CAR objects are query-time KQL functions over
the `host` / `network` / `memory` databases; the ADX pipeline is the one we
ingest into. A Logstash / Elastic path (normalize to ECS + `car.object`/
`car.action`, output to Elasticsearch and/or ADX) is **deferred, not rejected** —
SOF-ELK is the reference for its per-artefact Logstash parsers (Plaso, Zeek,
EZ-Tools, Sysmon). The four principles above hold regardless of runtime, so the
per-artefact field-mapping work transfers directly if that pivot happens.

## Conformance check

The check is about **naming discipline, not stripping data**. Native source columns
are expected to be present and are ignored by the check. What it verifies is that
the CAR fields a view adds are named exactly as `car_data_model.json` defines them
(`Timestamp`/`action`/`SourceFile` are the allowed provenance helpers) — so a
canonical-looking column with the wrong name (`target_pid` for `tgt_pid`,
`module_path` for a service/driver `image_path`) is the violation to fix, either by
renaming to the canonical field or, if the data has no CAR home, leaving it as its
own plain native column rather than dressing it up as a CAR field.
