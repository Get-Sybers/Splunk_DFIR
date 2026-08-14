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

### 2. Strict conformance — canonical fields only
A CAR object projects **only** its canonical fields, plus minimal provenance
(`Timestamp`, `action`, `SourceFile`). No invented fields.

- Data an artefact has but CAR cannot represent stays in the **raw** table, not
  faked into the object. Example: SRUM's per-app byte counters are not a `flow`
  field (`flow` has no byte counter), so they stay in `host.VelociraptorJson`.
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
`CarRegistry_Recmd`). Splitting by artefact makes the `Origin` / `Artefact` /
`platform` columns **redundant** — the view name carries the source. The base
layer never unions sources; a roll-up or correlation view is the downstream stage
of principle 4.

## Runtime

Current course: **ADX / KQL**. The CAR objects are query-time KQL functions over
the `host` / `network` / `memory` databases; the ADX pipeline is the one we
ingest into. A Logstash / Elastic path (normalize to ECS + `car.object`/
`car.action`, output to Elasticsearch and/or ADX) is **deferred, not rejected** —
SOF-ELK is the reference for its per-artefact Logstash parsers (Plaso, Zeek,
EZ-Tools, Sysmon). The four principles above hold regardless of runtime, so the
per-artefact field-mapping work transfers directly if that pivot happens.

## Conformance check

Every CAR function's projected columns are diffed against `car_data_model.json`
(canonical fields + the allowed provenance helpers `Timestamp`/`action`/
`SourceFile`). Any other column is a violation to fix — either it maps to a
canonical field under a different name (rename) or the artefact data has no CAR
home (leave it in the raw table).
