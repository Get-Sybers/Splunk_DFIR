# Cross-source CAR enrichment — capability determination + data assessment

*Epic [Get-Sybers/DX_DFIR#86](https://github.com/Get-Sybers/DX_DFIR#86), Phase C.
This is the analysis that MUST precede any cross-source enrichment code (owner
sequencing: capability → assessment → implementation). No enrichment is
implemented here — this determines what is possible, what is impossible, and
what must be built first.*

Scope reminder: per-source enrichment is self-contained and DONE (one source →
one `car.db`, `docs/CAR-Pipeline.md`). "Cross-source" is the OPTIONAL final
stage that correlates events **across** the per-source databases of the same
investigation. It never mixes into the per-source products.

## Data assessment (measured on the real per-source stores)

Nine real `car.db` sources from the batch run, plus the memory and zimmerman
stores. Key facts, measured:

**1. Host identity is fragmented across lanes — the master blocker.**
The SAME physical host (LoneWolf) renders differently per lane, and many
sources carry no host at all:

| source (LoneWolf host) | `source_host` values |
|---|---|
| event logs (EvtxECmd) | `WIN-1M3263ACE5D`, `DESKTOP-PM6C56D` |
| zimmerman (SRUM/RECmd) | `LONEWOLF` (the `--host` arg), `desktop-pm6c56d` (from hive paths) |
| memory | its own image hostname |
| l2t dualserver / exfat / internaldns / pfsense | **empty** (Linux/appliance — no image_hostname) |
| zeek captures | the capture-dir label (`ngdc-exterior-…`), not a host |

So even for one host, no `source_host` value is shared across lanes. A
**host-identity reconciliation** (casefold + alias table + derive from the
image/`ComputerName` hive value, not an arbitrary `--host`) is prerequisite #1
for any host-scoped cross-source join.

**2. Process-instance identity does NOT share a namespace across lanes.**
Measured `guid` forms for a process create:

- event logs: `process-DESKTOP-PM6C56D-Security-2623` (audit-record identity)
- Sysmon: `dfae8213-70eb-5cdd-0000-0010f66d0a00` (the real ProcessGuid)
- memory: `proc-<_EPROCESS offset>`
- SRUM (zimmerman): **None** — SRUM has no process-instance identity at all

⇒ **No definitive cross-lane process-instance join exists.** A process seen in
two lanes cannot be proven the same instance by identity — only heuristically
(host + pid + create-time window), and only where BOTH lanes carry pid+time.

**3. SID is the one strong cross-lane key — fully populated.**

| | with SID/uid |
|---|---|
| event-log process | 40/40 |
| SRUM process | 15055/15055 |
| SRUM flow (uid) | 2358/2471 |
| event-log user_session (uid) | 875/880 |

A SID is a stable principal, so **(canonical host, SID) is a definitive
cross-lane USER-CONTEXT key** — it attributes events to the same account, not
to the same process instance.

**4. The strong within-source keys do not bridge lanes.** The LUID auth↔session
join is real (827 event-log auths carry `TargetLogonId`; owning_guid 692/880 on
sessions) but the LUID appears in **zero** SRUM/registry rows. Sysmon
ProcessGuid links are definitive but exist only inside the Sysmon source.

## Capability determination (per candidate join)

| # | cross-source join | possible? | tier | blocker / basis |
|---|---|---|---|---|
| A | **host identity reconciliation** | prerequisite | — | must canonicalise host across lanes before any host-scoped join; empty-host sources (Linux/appliance) can't participate |
| B | any event ↔ **user context** by (host, SID) | **yes** | **definitive (as identity)** | SID fully populated across lanes; links account, not instance |
| C | process ↔ process across lanes by (host, pid, create-time window) | yes, narrow | **heuristic** | PID reuse; needs pid+time in BOTH lanes → only memory↔Sysmon↔event-log-4688; **SRUM excluded** (no pid) |
| D | process-instance join by shared **guid** across lanes | **no** | — | guids are per-lane namespaces (measured); no shared instance identity survives cross-lane |
| E | SRUM execution/flow ↔ host process instance | **no (instance)** / yes (user via B) | — | SRUM has no pid/guid and hourly-aggregate times; only user-context (B) is defensible |
| F | zeek flow ↔ host (5-tuple + time) | not in this corpus | heuristic | needs a host with network CAR in the same timeframe; the 2012 NGDC captures have no matching host source |
| G | file/registry/module ↔ its process across lanes | **no** | — | spokes carry no cross-lane process key; owning_guid is in-source only |

### Verdict
Cross-source enrichment is **fundamentally heuristic** between lanes — the only
*definitive* cross-lane relationship is **user-context by (canonical host,
SID)** (join B). Everything process-instance-level is either heuristic and
narrow (C) or impossible (D, E-instance, G). Definitive linkage is a
WITHIN-source property (guid) and must stay there.

## Recommended scope for the enrichment stage (when built)

1. **Build host-identity reconciliation first** (join A) — nothing host-scoped
   works without it; also fixes the arbitrary `--host` and empty-host cases.
2. **Implement join B** (user-context by canonical host + SID) — the one
   high-value, defensible, definitive cross-lane enrichment.
3. **Implement join C** narrowly (heuristic, confidence-tagged, only
   pid+time-bearing lanes).
4. **Do NOT** attempt D/E-instance/G — they cannot be done honestly; leave the
   raw cross-lane evidence for analyst query instead.
5. Keep it an **opt-in end stage over the aggregate**; never mixed into a
   per-source `car.db`.

## Still to measure (Phase E field-coverage audit)
A per-(artefact × object) fill-rate audit across the full real corpus — pairs
with this assessment; not required to scope the joins above.
