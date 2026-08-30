# CAR relations — identity, joins, inheritance, limits (epic #86)

The relational discipline of PIIAT-Mem's `car-store.md` §3, applied to the CAR
objects the **memory artefact cannot supply** — determined from MITRE's own doc
pages (car.mitre.org, field semantics read verbatim) and ratified against real
evidence. The ten memory-fed objects are governed by
`third_party/piiat-mem/docs/design/car-store.md`; this document covers
**authentication**, **http**, and **email**, and the engine rules they added.

The test, unchanged: *a property may be attributed across objects only via a key
that identifies the same entity instance beyond doubt; anything else is marked
heuristic; what cannot be known is an honest null.*

## authentication (← Security 4624 / 4625)

**Identity.** One event = one Security record of one auth decision:
`guid = authentication-<Computer>-<Channel>-<EventRecordId>` (record ids are
per-channel monotonic; unique within one `.evtx` export — a log-clear (1102)
resets them, the documented caveat). MITRE's authentication object has no `guid`
field — this is the engine's event identity, not a canonical property.

**Joins.**
- → **user_session** via the LUID — the *designed* key: `TargetLogonId` names
  the session a successful authentication opened; `SubjectLogonId` the existing
  session it was requested *from* (valid on failures too). LUIDs are unique per
  boot per host, so a same-host match is **definitive** within the evidence
  window — except the well-known per-boot singletons (`0x3e7/0x3e5/0x3e4`),
  which recur every boot and are marked **heuristic** across multi-boot logs.
  `0x0`/blank is a null session, never a key. Case-normalized (hex case differs
  between artefacts). This join works **cross-artefact** — an evtx 4624 to a
  memory-extracted session.
- → **process** via `Payload.ProcessId` (a **hex** string — the engine parses
  `0x…`) — the create-time-window PID join, **heuristic** (PID reuse).
- `LogonGuid` is the designed *cross-host* correlation key (Kerberos) but is
  all-zero in workgroup evidence — joined only where non-zero.

**Inheritance.** `user`/`uid` ← the owning process (they are, per MITRE, the
*requesting process's* identity) — fill-only-null via the heuristic link.
`fqdn` ← host identity. Everything target-side is native to the event.

**Limits.**
- A **failed** authentication opens **no** session — the target-session join
  never runs for `failure`.
- **4648 is not mapped**: it records an explicit-credential logon at *issuance*;
  no service response exists in the record — mapping it to `success` would
  assert an outcome the evidence doesn't contain. Rows stay raw.
- `hostname` (origin) and `auth_target` (destination) point opposite ways and
  the direction flips by EventId; the origin (`WorkstationName`) is
  client-reported and forgeable — *recorded, not trusted* (no fallback to
  `Computer`, which is the destination).
- `method="Negotiate"` means *negotiated* — never assert NTLM vs Kerberos.
- Subject `user`/`uid` is the calling context (often a machine account) — never
  "the person who typed the password"; the canonicalization pass may unify
  alternate renderings of a well-known account but never overwrites an
  arbitrary native value.

## http (← Zeek http.log)

**Identity.** One event = one HTTP *transaction*:
`guid = http-<uid>-<trans_depth>` (sensor-minted connection id + pipeline
depth). **Run-scoped**: zeek mints fresh uids per run — cross-run correlation
goes through time + 5-tuple, never uid equality.

**Joins.** → **flow** via the shared zeek `uid` — sensor-assigned, content-
independent: **definitive** within the capture (the 5-tuple+window fallback for
cross-source flows is heuristic — ephemeral ports recycle). → **file** (zeek
files.log) via `resp_fuids`/`orig_fuids` — definitive within the capture (a
file-in-transit, not a host filesystem file). → process/user_session: **none** —
a pcap carries no endpoint identity.

**Inheritance.** None today; kept keys (`uid`, fuids) carry the future joins.

**Limits.**
- `hostname` is the host the request was **seen on** (the vantage) — **not**
  the Host header; the header is `url_domain` and is client-forgeable (domain
  fronting): the connection-truth destination is `id.resp_h`, kept native.
- `url_scheme`'s MITRE description is a copy-paste error — implement the field
  *name* (scheme), not the pasted text.
- `url_full` is reconstructed (`http://` + Host + uri) only for origin-form
  requests; a CONNECT target is authority-form — no scheme, no URL, and a
  tunnel event proves a tunnel was *requested*, nothing about what's inside.
- No response captured (null `status_code`) asserts **no outcome**.
- `request_referrer`/`user_agent_*` are client-supplied strings — never proof
  of provenance or real client software.
- The CAR action set (get/post/put/tunnel) is deliberately incomplete — the
  car_http table is **not** a complete web-traffic record; absence proves
  nothing (HEAD/OPTIONS/… stay raw).

## email (no artefact yet — principles recorded for the first mapper)

**Identity.** `(source_host, smtp_uid, action, time)` — `smtp_uid` is the
server-**local** queue/transaction id (MITRE's designated discriminator), *not*
the RFC 5322 Message-ID: it re-assigns per relay hop and **never joins across
hosts**. Multiple actions on one message at one server (deliver→delete) share
it — definitive within that server's log.

**Joins.** → flow via a shared capture uid (definitive within the capture) or
4-tuple+window (heuristic). → file (attachments) via zeek fuids (definitive
within capture); name/size matching is heuristic at best. → http via
`message_links` vs later requests — **temporal correlation only** (presence ≠
click; scanners follow links). → authentication/process: **none** (a mailbox
address maps to an account only through an external directory).

**Limits.** `from` is trivially forged (MITRE says so verbatim) — never
attribute; `to` is not the recipient list (envelope `dest_address` is);
`return_address` is attacker-chosen (mismatch = signal, not identity); `date`
is the *client's* header — never the event timestamp; `server_relay` is
trustworthy only from the observing server inward; `attachment_mime_type` is
declared, not actual; only `deliver` means delivery reached the recipient
server-side — nothing implies a human read it. The one real smtp capture on
hand is STARTTLS-encrypted — an empty `car_email` table is the honest output.

## Engine rules added by this pass

- `payload()` values are stripped (Microsoft pads e.g. `LogonProcessName`).
- PID parsing accepts Windows hex strings (`0x1FC`) everywhere joins use PIDs.
- Canonicalization of well-known accounts fills blanks and unifies *alternate
  renderings of the same account* only — a natively extracted value (e.g. a
  machine account on a 4624 Subject) is evidence and is never overwritten.
- `native_extract` promotes parsed join keys out of raw blobs into `native`
  (never into canonical columns).
- The authentication↔user_session LUID join writes
  `native.target_session_guid` / `native.subject_session_guid` with its tier.

## Additional inference rules discovered from ingested data (epic #86, Phase C)

Phase C mines the REAL per-source stores for within-source join keys the cascade
does not yet exploit. Every rule below is **within one `car.db`** (per-source,
scoped per `source_host`) and is a **candidate — not yet implemented**; each is
grounded in a measured key in the ingested evidence. Implementation (adding them
to `relationships.yml` + `enrich.py`) is gated behind this catalogue.
Cross-source correlation (memory + disk + network) is a separate very-end stage
— see `docs/CAR-CrossSource.md` — and is explicitly out of Phase C scope.

| # | rule | join key (tier) | fills | evidence (measured) | status |
|---|---|---|---|---|---|
| R1 | **user_session lifecycle** — pair logout→login, close the session | TS id24 by `SessionID`+user; Security 4634 by `TargetLogonId` LUID (definitive within window; well-known LUID heuristic) | session `end_time`, duration, still-open-at-EOL flag | lonewolf evtx: 831 login / 49 logout rows sit **unpaired** today | candidate |
| R2 | **process lifetime bounding** — pair terminate→create; then reject a pid-owner that had already exited before the spoke ts | ProcessGuid (definitive) / pid+window (heuristic) | process `end_time`; **tightens** the owner/parent pid-window heuristic | Sysmon: 14 create / **3 terminate**; evtx 4689 where audited (0 here). `_match` currently checks only create≤ts | candidate |
| R3 | **zeek uid spoke→flow** — link each http/file to its connection | `uid` (definitive within capture); `fuid` = file identity | http/file inherit the conn 5-tuple (src/dst ip+port), transport, duration | zeek exterior: `uid` on flow(5520), http(1309), file(1232); http/file carry **no** owner link today | candidate |
| R4 | **BITS transfer correlation** — assemble one transfer from its events | `transferId` GUID (definitive) | final bytes/URL, completion; owner from the BITS job-created event's process | lonewolf: id59 start ×114 + id60 complete ×101, 114 distinct `transferId`; **13 never completed = interrupted (signal)** | candidate |
| R5 | **thread injection dual-link** — link BOTH source and target process | source + target ProcessGuid (both native, definitive) | the injection relationship (src → tgt), not just one owner | Sysmon id8 remote_create ×3, single-linked (2/3) today | candidate |
| R6 | **auth caller-process owner** — link an auth to the process that requested it | 4624/4625 Payload `ProcessId`+`ProcessName` → owning_pid (heuristic pid+window) | auth `owning_guid` (today auth links only to its *session* via LUID) | verified present (`ProcessId`=0x4…); **honest null** for network logons where it is System/`-` | candidate |
| R7 | **service→process by image** (weak) — link a 7045 install to a run of its binary | 7045 `ImagePath` ↔ 4688 `NewProcessName` exe+window (heuristic) | service `owning_guid` | low confidence: install time ≠ run time; SCM (not the installer) starts it | optional |

**Deferred to the very-end aggregate stage (NOT Phase C — different `car.db`s):**
service↔registry service-key writes (evtx and registry are *separate* sources),
the WIN-1M3263ACE5D↔DESKTOP-PM6C56D rename lineage (a host-identity call — one
box renamed, seen in one store but a cross-scope decision), and any
`community_id` zeek↔host-flow bridge.

**What the measured cascade already does right (baseline, lonewolf evtx):**
parent link 36/40 (heuristic); auth↔session LUID join 1616/1616 (104
definitive); user_session owner 692/880; well-known accounts unified (Local
System ×790). `service`/`http`/`authentication` show 0 *owner* links because the
artefact carries no owning-process key — honest nulls, and exactly what R3–R6
above set out to add where a real key does exist.
