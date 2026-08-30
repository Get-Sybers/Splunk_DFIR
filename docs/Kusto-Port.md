# The Kusto emulator — the analysis backend

The analysis backend is the **Azure Data Explorer Kusto emulator**
(`kustainer`) — the real Kusto query engine in a Linux container. No Azure, no
account, no network once pulled.

```bash
docker run -e ACCEPT_EULA=Y -m 4G -d -p 8080:8080 \
  -t mcr.microsoft.com/azuredataexplorer/kustainer-linux:latest
```

Query and management run over HTTP (`http://localhost:8080/v1/rest/query` and
`/v1/rest/mgmt`), so the whole backend is driven with no client library —
`get_sybers_dfir.deploy` and `.ingest` speak to it directly.

The emulator is chosen over the ADX free cluster because dead-box forensics needs
storage limited only by host capacity (not ~100 GB) and external tables to local
files, and it runs with no network once pulled.

## Ephemeral by default — re-ingest, don't persist

`data_store/processed/` is the source of truth; the backend only reads from it.
So the default is **destroy the container, redeploy, re-ingest** — fast and
deterministic (`.ingest into` from local files), and it sidesteps the emulator's
own caveats against persistence (on-disk format may not survive an image bump,
and with no extent merging the data degrades rather than settling). `--persist`
is opt-in.

> ⚠️ `.create database <name> persist(...)` **fails if the target folders already
> exist**, so a persistent redeploy must detect an existing database and skip it
> rather than blindly re-create.

## Isolation is the only control

The emulator has **no security features at all** — no authentication, no access
control, plaintext HTTP, no encryption at rest — on a container holding evidence.
The localhost binding is therefore mandatory, not a default to override casually:
`dxdfir deploy` (the `dfir_deploy_adx` role) refuses any other bind address unless
`dfir_deploy_adx_expose=true` is also set. It publishes localhost-only with the
real port bindings **read back** after start (Docker's port rules sit ahead of
the host firewall), puts the container on an isolated (masquerade-off, never
`--internal`) network with egress **probed from inside**, and confirms **both
directions** — no useful egress, and the engine actually answers (`.show
version`, the ingest client's `--ping`).

## Databases and schema

Five databases mirror the data domains: `host`, `network`, `memory`, `misc`,
`mitre`. Reserved engine keywords are bracket-quoted at creation (`["network"]`).

Schema lives in `kusto/schema/*.kql`, applied by `get_sybers_dfir.deploy` with
`.execute database script` (routed to the database named in each file's
`// Database:` header). That command is sequential and **non-transactional**, so
every statement uses an **idempotent form** — `.create-merge table`,
`.create-or-alter function` — and a re-applied schema converges rather than
half-applying. Ingestion needs the table to exist first (there is no schema
inference), so every table carries explicit DDL and a precreated JSON ingestion
mapping.

## MITRE CAR is materialized

The `mitre` database is the CAR model as **ingested tables**, not query-time
views. The engine (PIIAT-MitreCar) normalises each evidence source into finished
CAR events and the pipeline ingests one `car_<object>.jsonl` per object as the
13 `mitre.car_<object>` tables, plus `car_relationships` (the superset
relationship edges). `Car()` unions the objects into one timestamp-ordered
timeline; `CarObjects()` counts them.

Extraction happens **once, in the engine** (which has its own test suite), so KQL
just stores the result — a mapping fix is an engine change, not per-artefact KQL
that drifts from what the engine emits. The table schemas are generated from the
engine's object model (`store.HEADER` + each object's fields), so they cannot
drift. Every column is bracket-quoted (`['from']`, `['type']`) because many CAR
field names are KQL keywords; numeric-looking fields (pid, ports, bytes) are
strings — the evidence is inconsistent about type and the honest value is the
verbatim one, cast at query time.

`dxdfir verify-car` (`get_sybers_dfir.carcheck`) is the promotion gate: it asserts
each exercised table is populated, values are sane (IPs are IPs, ports in range,
SIDs are `S-1-*`, `car_action` is in the object's model vocabulary), every row
traces to a `source_artefact`, and the relationship edges name real endpoints.

## Licensing — read before any engagement

The emulator carries obligations recorded in `THIRD_PARTY_NOTICES.md`:

- **Provided *as-is*, without support or warranties**
- **Generally unsuitable for production workloads**
- The licence terms prohibit benchmarking
- `ACCEPT_EULA=Y` auto-accepts on your behalf — `dxdfir deploy`, the role README
  and the top-level README all say so

Treat commercial use as an open question.

## Sources

- [Kusto emulator overview](https://learn.microsoft.com/en-us/azure/data-explorer/kusto-emulator-overview) — capability comparison, ingestion model
- [Kusto emulator limitations](https://github.com/MicrosoftDocs/dataexplorer-docs/blob/main/data-explorer/includes/kusto-emulator-limitations.md) — the no-security and persistence limitations
- [Install the Kusto emulator](https://learn.microsoft.com/en-us/azure/data-explorer/kusto-emulator-install) — run commands, volume mount, `.create database ... persist`
- [`.ingest into` command](https://learn.microsoft.com/en-us/kusto/management/data-ingestion/ingest-into-command) — one-locator-per-file, schema coercion
- [`.execute database script`](https://learn.microsoft.com/en-us/kusto/management/execute-database-script) — non-transactional, idempotent-form recommendation
- [Ingestion mappings](https://learn.microsoft.com/en-us/kusto/management/mappings) — JSON mapping form
