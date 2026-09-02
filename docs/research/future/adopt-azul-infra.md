# Adopting Azul infrastructure in DX_DFIR

Researched against public Azul repositories, existing DX_DFIR pipeline source,
and PIIAT-MitreCar design documents on 2026-08-31. Every claim carries a direct
link to the source used.

> **Note (post-retirement):** §5–6 describe the ADX/KQL ingest baseline, which
> was retired in favour of the Elastic-native stack (#111). Those sections are
> now historical; source links to the removed `kusto/` schema and `ingest`/`deploy`
> packages have been de-linked. See #112 for the follow-up rewrite of this doc.

---

## 1. What Azul is

Azul is an Australian Signals Directorate (ASD) open-source **malware repository,
analytical engine, and clustering suite** designed to safely store and analyse
malware at scale (tens of millions of samples). Reverse engineers turn common
analysis steps into analysis plugins, reducing repeated manual work and enabling
clustering across samples beyond YARA rules.
([about.md](https://github.com/AustralianCyberSecurityCentre/azul-docs/blob/main/docs/overview/about.md))

Critically, **Azul does not perform binary triage** (i.e., it does not decide
whether something is malicious) and it does **not model Windows event-log timeline
activity**. Anything submitted to Azul is assumed to already be identified as
suspicious or malicious. This distinction matters for PIIAT-MitreCar: Azul is a
downstream enrichment tier for binary artefacts discovered during an investigation,
not a replacement for the CAR event/object representation.
([about.md](https://github.com/AustralianCyberSecurityCentre/azul-docs/blob/main/docs/overview/about.md))

---

## 2. Azul's public repository ecosystem

### 2.1 Inventory

| Repository | Language | Role | Why it matters for DX_DFIR |
|---|---|---|---|
| [`azul`](https://github.com/AustralianCyberSecurityCentre/azul) | — | Umbrella / entry point | Starting point; links to all sub-repos |
| [`azul-docs`](https://github.com/AustralianCyberSecurityCentre/azul-docs) | Markdown | Architecture, sysadmin, developer guides | Authoritative source on topology, data models, plugin lifecycle |
| [`azul-bedrock`](https://github.com/AustralianCyberSecurityCentre/azul-bedrock) | Python / Go | Shared models, Avro schemas, file-type identification | Avro event contract; `identify.yaml` file-type taxonomy; BACKWARD_TRANSITIVE schema evolution rules |
| [`azul-runner`](https://github.com/AustralianCyberSecurityCentre/azul-runner) | Python | Plugin SDK | The interface for writing a PIIAT-facing enrichment plugin |
| [`azul-metastore`](https://github.com/AustralianCyberSecurityCentre/azul-metastore) | Python | OpenSearch ingestor and query layer | Informs the OpenSearch index design and ingestor loop pattern |
| [`azul-restapi-server`](https://github.com/AustralianCyberSecurityCentre/azul-restapi-server) | Python | REST API composition surface | API surface for scripted submission and result retrieval |
| [`azul-client`](https://github.com/AustralianCyberSecurityCentre/azul-client) | Python | Client library for scripted access | Ready-made upload/query client for DX_DFIR tooling |
| [`azul-plugin-maco`](https://github.com/AustralianCyberSecurityCentre/azul-plugin-maco) | Python | Maco-format config extraction plugin | Concrete ATT&CK-bearing feature output example with real CobaltStrike sample output |

### 2.2 What each repo contributes to an integration

#### `azul-bedrock`
Shared library for Azul models and operations.
([README](https://github.com/AustralianCyberSecurityCentre/azul-bedrock/blob/main/README.md))

- Contains the **Avro schemas** for all events exchanged on Kafka (the messages in
  flight between Dispatcher, Metastore, and plugins). Schema changes must maintain
  `BACKWARD_TRANSITIVE` Avro compatibility: fields can be deleted or optional fields
  added; incompatible changes require a version increment and an upgrade path in
  `msginflight/conversion_avro.go`.
  ([bedrock README — Avro compatibility](https://github.com/AustralianCyberSecurityCentre/azul-bedrock/blob/main/README.md))

  Current schema version is **v6**. Key event types:

  | Schema file | Event type | Primary fields |
  |---|---|---|
  | `v6/1_binary.json` | `BinaryEvent` | `model_version`, `kafka_key`, `timestamp`, `author{name,version,category,security}`, `source{name,references,path[],settings}`, `entity{sha256,sha512,sha1,md5,ssdeep,tlsh,size,mime,features[],datastreams[]}`, `action`, `flags` |
  | `v6/2_plugin.json` | `PluginEvent` | `author{name,version,contact}`, `entity{features[{name,type,tags[]}],config{}}` |
  | `v6/2_status.json` | `StatusEvent` | Plugin execution status / error |
  | `v6/2_delete.json` | `DeleteEvent` | Binary deletion events |
  | `v6/2_insert.json` | `InsertEvent` | Binary ingest notification |
  | `v6/2_retrohunt.json` | `RetrohuntEvent` | Re-scan / retrohunt trigger |

  ([azul-bedrock/gosrc/events/schemas/v6/](https://github.com/AustralianCyberSecurityCentre/azul-bedrock/tree/main/gosrc/events/schemas/v6))

  The `BinaryEvent.action` field is a `BinaryAction` enum that controls routing and
  validation at the Dispatcher. The five values are:

  | Value | Meaning | Required in `entity.datastreams` |
  |---|---|---|
  | `Sourced` | New sighting from an external source | `label=content` stream |
  | `Extracted` | Binary extracted from an archive/container | `label=content` stream |
  | `Augmented` | Existing binary with additional data streams | `label=content` + at least one other label |
  | `Enriched` | Metadata enrichment only — no file content supplied | None |
  | `Mapped` | Association/mapping data — no content label in streams | None |

  For a DFIR timeline enrichment plugin, `Enriched` is the correct action since
  DX_DFIR produces metadata (timeline events) rather than binary content.
  ([azul-bedrock/gosrc/events/event_binary.go](https://github.com/AustralianCyberSecurityCentre/azul-bedrock/blob/main/gosrc/events/event_binary.go))

  **Kafka key and retention model:** Each `Source` carries its own Kafka configuration.
  Sources with `expire_events_after="0"` use `cleanup.policy=compact` (log compaction
  — keeps the latest value per key; suitable for deduplication of the CAR index).
  Time-bounded sources use `cleanup.policy=delete` + `retention.ms`. Partition key
  construction: `source.<MD5 of sorted key-value reference pairs>` for source tracking;
  `parent_sha256.child_sha256.timestamp.category.name.version` for link tracking.
  ([azul-bedrock/azul_bedrock/models_settings.py](https://github.com/AustralianCyberSecurityCentre/azul-bedrock/blob/main/azul_bedrock/models_settings.py),
  [event_binary.go — UpdateTrackingFields](https://github.com/AustralianCyberSecurityCentre/azul-bedrock/blob/main/gosrc/events/event_binary.go))

- Contains **`identify.yaml`** — a 771-line YARA-x-based file type taxonomy that
  Azul plugins use to filter which files they should process. Its type strings (e.g.
  `text/plain`, `document/`, `executable/windows/pe`) are the values used in a
  plugin's `filter_data_types` setting to restrict intake to relevant content.
  ([identify.yaml](https://github.com/AustralianCyberSecurityCentre/azul-bedrock/blob/main/gosrc/identify.yaml),
  [azul-runner README — filter example](https://github.com/AustralianCyberSecurityCentre/azul-runner/blob/main/README.md))

#### `azul-runner`
The Python plugin SDK. Handles filtering, event fetching, data streams, and result
posting so plugin authors only implement the analysis logic.
([README](https://github.com/AustralianCyberSecurityCentre/azul-runner/blob/main/README.md))

Key SDK interfaces:
- `BinaryPlugin(Plugin)` — base class for plugins that process binary entities. The
  author implements `execute(self, job: Job)` and calls `self.add_feature_values()`
  and optionally `self.add_child_with_data()`.
- `Feature(name, description, FeatureType)` — a named, typed output value. Supported
  types: `String`, `Integer`, `Float`, `Bytes`, `Datetime`, `FilePath`, `Uri`.
  `FilePath` and `Uri` are decomposed at index time for sub-path pivot queries.
- `Job.get_data()` — returns a file-like object for the binary being processed.
  Content may be streamed in parts if the file is large or non-local.
- `State.Label.OPT_OUT` — returned from `execute()` when the plugin chooses not to
  process the current entity (e.g. wrong content).
- Plugins run locally with `azul-plugin-<name> local_file.bin` or against a live
  dispatcher with `azul-plugin-<name> --server http://server.address/path`.
  ([runner README](https://github.com/AustralianCyberSecurityCentre/azul-runner/blob/main/README.md))

Feature naming conventions (relevant for any PIIAT-facing feature bridge):
- Names describe the **data or technique**, not the tool: `pe_compile_time` not
  `lief_pe_compile_time`; `config_callback_domain` not `zeus_c2`.
- **Reuse existing feature names** where the same logical value already exists in
  Azul; different names for the same value break cross-plugin correlation entirely.
- Boolean flags are expressed as `tag = "antivm_checks"` not `has_antivm_checks = True`.
- Structured metadata that cannot be cleanly flattened goes into an `info` JSON blob
  alongside specific features for the correlation-relevant parts.
  ([features.md](https://github.com/AustralianCyberSecurityCentre/azul-docs/blob/main/docs/developer-guide/components/core/runner/docs/features.md))

#### `azul-metastore`
Storage and query layer. Runs as pods that poll Kafka (via the Dispatcher) for
binary, plugin, and status events, index them into OpenSearch, and expose query
endpoints via `azul-restapi-server`.
([metastore README](https://github.com/AustralianCyberSecurityCentre/azul-metastore/blob/main/README.md))

Ingestor commands:
```
azul-metastore ingest-binary   # poll Kafka for binary topics; index into OpenSearch
azul-metastore ingest-plugin   # poll Kafka for plugin result events
azul-metastore ingest-status   # poll Kafka for status events
azul-metastore age-off         # delete expired indices from OpenSearch
azul-metastore force-update-templates  # push new OpenSearch templates after schema changes
azul-metastore apply-opensearch-config # create OIDC-aligned roles in OpenSearch
```

The OpenSearch document model (`binary2`):
([binary2.md](https://github.com/AustralianCyberSecurityCentre/azul-docs/blob/main/docs/developer-guide/components/core/metastore/docs/binary2.md))

- Documents are **not merged before storage** to avoid painful OpenSearch painless-script updates and complex deletion paths.
- Parent-child relationship: one parent `Binary` document per sha256, all result documents are children.
- Index names: `binary2.0` through `binary2.f` (first hex character of sha256), so all documents for a sha256 land on the same shard.
- Document IDs encode provenance: `{sha256}` (parent), `{sha256}.{author}` (result), `{sha256}.{author}.{submission}` (submission), `{sha256}.{author}.{submission}.{link}` (link).
- A deduplication cache prevents duplicate writes; repeat events for unchanged content are dropped unless the author version increments.
- OpenSearch templates are updated with `force-update-templates` when the index prefix increments.

#### `azul-client`
Full Python mapping of the Azul REST API, documented with Swagger in the Azul UI.
([client API reference](https://github.com/AustralianCyberSecurityCentre/azul-client/blob/main/docs/api.md))

Key endpoints relevant to DX_DFIR integration:

| Method | Function | Endpoint | Use in DX_DFIR |
|---|---|---|---|
| `POST` | `upload` | `/api/v0/binaries/source` | Submit a binary discovered during investigation |
| `POST` | `upload_child` | `/api/v0/binaries/child` | Submit a child binary (e.g. extracted payload) |
| `POST` | `expedite_processing` | `/api/v0/binaries/{sha256}/expedite` | Fast-track analysis of a case-relevant binary |
| `GET` | `get_meta` | `/api/v0/binaries/{sha256}` | Retrieve all metadata for a known hash |
| `GET` | `get_binary_documents` | `/api/v0/binaries/{sha256}/events` | Get all result documents for a binary |
| `GET` | `find_features` | `/api/v0/features` | Search across feature values (e.g. find all binaries sharing a C2 domain) |
| `GET` | `find_values_in_feature` | `/api/v0/features/feature/{feature}` | Enumerate all values ever seen for a named feature |
| `GET` | `get_similar_feature_entities` | `/api/v0/binaries/{sha256}/similar/features` | Find binaries sharing features with a case sample |

#### `azul-plugin-maco`
A production plugin mapping [Maco](https://github.com/CybercentreCanada/maco)-format malware config extractors to Azul. Its CobaltStrike output demonstrates the ATT&CK feature shape:
([azul-plugin-maco README](https://github.com/AustralianCyberSecurityCentre/azul-plugin-maco/blob/main/README.md))

- `attack`: list of ATT&CK technique IDs (e.g. `T1001.003`, `T1059.001`)
- `family`: `CobaltStrike`
- `connection_c2`: C2 addresses and paths
- `algorithm_communication`: `RSA`
- `category`: `apt`, `backdoor`, `downloader`, `rat`, `trojan`
- `header_fields`, `header_values`, `headers`: HTTP profile metadata
- `public_key`, `inject_exe`, `sleep_delay`, etc.: specific config fields

This is the canonical example of how Azul outputs map to ATT&CK. The `attack`
feature is the pivot point from Azul enrichment into PIIAT-MitreCar annotation.

---

## 3. Azul's full architecture and data flow

From the authoritative architecture diagram:
([architecture.md](https://github.com/AustralianCyberSecurityCentre/azul-docs/blob/main/docs/sysadmin-guide/20-architecture.md))

```
User Browser / azul-client
         │ HTTPS
         ▼
  Ingress / Reverse Proxy
    │               │
    ▼               ▼
 RestAPI          Azul Web UI
    │
    ├──HTTP(s)──► Dispatcher ◄──messages (TCP)──► Kafka
    │                 │
    │                 ├──► AssemblylinePlugin ──► Assemblyline
    │                 ├──► VirusTotalPlugin ──► VirusTotal
    │                 ├──► CAPEPlugin ──► CAPE
    │                 ├──► SyncPlugin ──► Git
    │                 ├──► ReportCollectorPlugin ──► RSS feeds
    │                 └──► [custom plugins]
    │
    ├──HTTPS──► OpenSearch (metadata + features)
    │
    └──HTTPS──► S3 (binary content)

Ingestor (metastore)
    ├──HTTP(s)──► Dispatcher (poll Kafka for new events)
    └──HTTPS──► OpenSearch (index result documents)

OIDC / IDM (authentication for RestAPI and Azul Web UI)
```

The Dispatcher is the central message bus abstraction sitting in front of Kafka. Plugins consume from Dispatcher (not directly from Kafka topics), which handles queueing, back-pressure, and retry. Kafka provides the durable message storage between submission, plugin dispatch, and ingest.

**Kubernetes is the assumed deployment target.** Azul ships as Helm charts and
supports Prometheus/Loki/Grafana for monitoring.
([about.md](https://github.com/AustralianCyberSecurityCentre/azul-docs/blob/main/docs/overview/about.md))

---

## 4. Current DX_DFIR elastic stack: what exists and what does not

### 4.1 What is already running

DX_DFIR's `docker/sof-elk/` compose stack provides:

- **Elasticsearch 9.4.3** — single-node, no security, localhost-only, with
  persistent volume `esdata`. Health-probed with `/_cluster/health`.
  ([docker-compose.yml](../../../docker/sof-elk/docker-compose.yml))

- **SOF-ELK container (from source)** — Logstash + co-located Filebeat, built from
  `philhagen/sof-elk` (main branch). The Dockerfile clones the SOF-ELK repo to
  `/usr/local/sof-elk`, installs all non-default Logstash plugins from SOF-ELK's
  own declared list (`ansible/roles/logstash/defaults/main.yaml`), seeds GeoLite2
  databases from the bundled plugin copies, and applies one upstream patch: making
  the Elasticsearch output host configurable via `${ES_HOSTS}`.
  ([Dockerfile](../../../docker/sof-elk/Dockerfile),
  [SOF-ELK upstream](https://github.com/philhagen/sof-elk))

- **Filebeat** (co-located in the SOF-ELK container) — watches
  `/logstash/<type>/` directories using SOF-ELK's per-type input prospectors
  (`/usr/local/sof-elk/lib/filebeat_inputs/*.yml`); ships to Logstash on
  `localhost:5044`. Each `<type>/` subdirectory maps to a SOF-ELK pipeline.
  ([filebeat.yml](../../../docker/sof-elk/filebeat.yml))

- **Logstash** — loads SOF-ELK's order-prefixed parsing configs as one pipeline
  (`/usr/local/sof-elk/configfiles/*.conf`). The output config is patched to read
  the Elasticsearch host from `${ES_HOSTS}`.
  ([pipelines.yml](../../../docker/sof-elk/pipelines.yml))

- **Kibana 9.4.3** — standard Kibana pointing at the Elasticsearch service.
  ([docker-compose.yml](../../../docker/sof-elk/docker-compose.yml))

### 4.2 What does not exist today

| Component | Status | Needed for |
|---|---|---|
| Kafka | ❌ Not present | Azul-style async decoupling; Phase 4 of this roadmap |
| Dedicated CAR JSONL ingest pipeline | ❌ Not present | Routing `car_*.jsonl` to typed OpenSearch indices |
| OpenSearch index templates for CAR | ❌ Not present | Typed mappings for CAR objects and relationships |
| Plaso elastic output | ❌ Not used | Higher-fidelity ECS-aligned field delivery to Elasticsearch |
| `run_car_elastic()` ingest backend | ❌ Not present | Replacing KQL ingest path with OpenSearch equivalent |
| Azul enrichment bridge | ❌ Not present | Submitting discovered binaries to Azul and handling results |

---

## 5. Current DX_DFIR pipeline: source→store contract

Understanding the existing contract precisely is essential before changing any storage
backend. The complete path today:

### 5.1 Plaso lane

1. `log2timeline.py` parses the image into a `.plaso` storage database.
   ([plaso.py — `run_plaso()`](../../../python/get_sybers_dfir/plaso.py))

2. `psort.py` renders the `.plaso` db through a baked wrapper
   (`/opt/dfir/psort_wrapper.py`) that imports the custom
   `l2t_json_dfir` output module, which adds four attribution fields
   (`image_hostname`, `username`, `disk_id`, `volume_id`) to **every** event by
   reading them once from the `.plaso` storage's `system_configuration` container.
   ([dev-scripts/plaso/l2t_json_dfir.py](../../../dev-scripts/plaso/l2t_json_dfir.py))

3. The output is named `<image_hostname>.jsonl` under
   `data_store/processed/log2timeline/jsonl/`. Idempotence is via a `.host` marker
   file; a failed psort (no marker) is not mistaken for done.
   ([plaso.py — `_already_done()`](../../../python/get_sybers_dfir/plaso.py))

4. On `dxdfir ingest`, `run_l2t()` streams each JSONL (never fully buffering —
   the files can be multi-GB), splits by parser into per-table staging files, and
   ingests them into `host.L2t<Parser>` tables in the ADX emulator via `.ingest into`.
   (ingest/__init__.py — `run_l2t()`)

### 5.2 CAR lane

1. `dxdfir build-car` invokes PIIAT-MitreCar (vendored submodule at
   `third_party/piiat-mitrecar`) which produces, per evidence source:
   - `car.db` (SQLite, one table per CAR object)
   - `superset.db` (SQLite, relationship-instance timeline)
   - `car_<object>.jsonl` (one file per populated object)
   - `car_relationships.jsonl`
   - `sources.yaml` manifest
   ([mitrecar.py](../../../python/get_sybers_dfir/mitrecar.py),
   [CAR-Pipeline.md](../../../docs/CAR-Pipeline.md))

2. `dxdfir ingest --only car` invokes `run_car()`, which:
   - walks `data_store/processed/car/` for `car_*.jsonl` files;
   - derives the target Kusto table name from the filename (`car_<object>.jsonl`
     → `mitre.car_<object>`);
   - `docker cp`s the file into the ADX emulator container at `/tmp/dfir-ingest/`;
   - runs `.ingest into table car_<object> (locator) with (format="multijson")`
     in batches of 50;
   - records the file's SHA-1 hash in `host._DfirIngestLedger` for idempotence.
   (ingest/__init__.py — `run_car()`)

3. Kusto tables are defined in `kusto/schema/40-mitre.kql`. Every column name is
   bracket-quoted because many CAR fields collide with KQL keywords (`from`, `to`,
   `type`, `user`, `group`, `key`, `value`, `data`). Numeric-looking fields (`pid`,
   `port`, `bytes`) are stored as strings because evidence is type-inconsistent.
   `native` is a `dynamic` column (KQL's JSON blob type).
   (40-mitre.kql)

### 5.3 The 13 CAR objects and the relationships table

Tables created in `mitre` database by `40-mitre.kql`:

| Table | Common header fields | Object-specific MITRE fields |
|---|---|---|
| `car_authentication` | `car_object`, `timestamp`, `car_action`, `guid`, `owning_guid`, `link_confidence`, `source_artefact`, `source_host`, `native` | `app_name`, `method`, `auth_service`, `auth_target`, `target_ad_domain`, `decision_reason`, `response_time`, `fqdn`, `hostname`, `ad_domain`, `uid`, `user_role`, `user_type`, `user`, `user_agent`, `target_uid`, `target_user_role`, `target_user_type` |
| `car_driver` | (same header) | `base_address`, `fqdn`, `hostname`, `image_path`, `md5_hash`, `module_name`, `sha1_hash`, `sha256_hash`, `signer` |
| `car_email` | (same header) | `action`, `attachment_mime_type`, `attachment_name`, `attachment_size`, `date`, `dest_address`, `dest_port`, `from`, `message_body`, `message_links`, `message_type`, `reply_to`, `return_path`, `server_relay`, `smtp_uid`, `subject`, `to` |
| `car_file` | (same header) | `company`, `content`, `creation_time`, `extension`, `file_name`, `file_path`, `fqdn`, `hostname`, `image_path`, `link_target`, `md5_hash`, `mime_type`, `modification_time`, `owner`, `sha1_hash`, `sha256_hash`, `signer`, `size` |
| `car_flow` | (same header) | `application_protocol`, `content`, `dest_fqdn`, `dest_hostname`, `dest_ip`, `dest_port`, `end_time`, `exe`, `flags`, `fqdn`, `hostname`, `image_path`, `in_bytes`, `network_direction`, `out_bytes`, `packet_count`, `pid`, `ppid`, `proto`, `src_fqdn`, `src_hostname`, `src_ip`, `src_port`, `start_time`, `uid` |
| `car_http` | (same header) | `cmd`, `content`, `dest_hostname`, `dest_ip`, `dest_port`, `fqdn`, `hostname`, `http_version`, `request_body_len`, `request_header_size`, `request_method`, `response_body_len`, `response_header_size`, `response_status_content`, `response_status_msg`, `src_hostname`, `src_ip`, `src_port`, `uid`, `url_domain`, `url_fragment`, `url_full`, `url_params`, `url_path`, `url_port`, `url_scheme`, `user_agent` |
| `car_module` | (same header) | `base_address`, `fqdn`, `hostname`, `image_path`, `md5_hash`, `module_name`, `module_path`, `sha1_hash`, `sha256_hash`, `signer`, `tid` |
| `car_process` | (same header) plus `parent_guid` | `command_line`, `current_directory`, `env_vars`, `exe`, `fqdn`, `hostname`, `image_path`, `integrity_level`, `md5_hash`, `parent_command_line`, `parent_exe`, `parent_image_path`, `pid`, `ppid`, `sha1_hash`, `sha256_hash`, `signer`, `uid`, `user`, `user_role`, `user_type` |
| `car_registry` | (same header) | `data`, `fqdn`, `hive`, `hostname`, `image_path`, `key`, `new_content`, `pid`, `type`, `uid`, `user`, `value` |
| `car_service` | (same header) | `command_line`, `exe`, `fqdn`, `hostname`, `image_path`, `name`, `pid`, `ppid`, `uid`, `user`, `user_role`, `user_type` |
| `car_socket` | (same header) | `addr`, `bound`, `family`, `fd`, `fqdn`, `hostname`, `image_path`, `pid`, `ppid`, `protocol`, `uid` |
| `car_thread` | (same header) | `hostname`, `inject_exe`, `src_pid`, `src_tid`, `stack_base`, `stack_limit`, `start_address`, `start_function`, `start_module`, `start_module_name`, `subprocess_tag`, `tgt_pid`, `tgt_tid` |
| `car_user_session` | (same header) | `addr`, `dest_hostname`, `dest_ip`, `fqdn`, `hostname`, `logon_id`, `logon_type`, `login_failure_type`, `login_successful`, `login_type`, `port`, `relative_logon_id`, `session_id`, `src_hostname`, `src_ip`, `uid`, `user`, `user_role`, `user_type` |
| `car_relationships` | `source_guid`, `target_guid`, `relationship_verb`, `source_car_object`, `target_car_object`, `source_host`, `timestamp` | — |

---

## 6. Roadmap: adopting the elastic stack

Each phase can be validated independently. The ordering moves from smallest surface
area to largest.

---

### Phase 1 — Switch log2timeline to its built-in elastic output

**Motivation:** The current `l2t_json_dfir` custom module writes JSON Lines that are
then picked up by Filebeat and parsed by Logstash. Plaso ships a native
`ElasticSearchOutputModule` (`-o elastic`) that writes directly to Elasticsearch
using ECS-aligned field names with richer parser-specific mappings. Using it removes
the custom module intermediary and delivers higher-fidelity fields to Logstash for
PIIAT-MitreCar's artefact-to-CAR mappings — which matters because log2timeline is
currently the primary processor used for raw image processing.
([PIIAT-MitreCar author note, optional-azul-elastic-path.md](https://github.com/Get-Sybers/PIIAT-MitreCar/blob/main/docs/research/ideas/optional-azul-elastic-path.md))

**How `psort -o elastic` works:**

The `ElasticSearchOutputModule` posts events directly to Elasticsearch via its
bulk API. Key CLI flags (passed through `psort`):
- `--server` — Elasticsearch host (default `localhost`)
- `--port` — Elasticsearch port (default `9200`)
- `--index_name` — index name (default `plaso`)
- `--use_ssl` / `--username` / `--password` for TLS/auth

Field mapping: the module outputs events with ECS-standard field names where
applicable, preserving the per-parser rich metadata that the `l2t_json_dfir` module
currently loses or encodes into a flat `Record` blob.
([Plaso output module source — elasticsearch.py](https://github.com/log2timeline/plaso/tree/main/plaso/output))

**Retained value of `l2t_json_dfir`:** The custom module adds
`image_hostname` (from the `.plaso` storage `system_configuration`, not from the
per-event hostname which is the login source for remote events), `disk_id`, and
`volume_id` — fields that are not present in the standard elastic output. These are
essential for the current per-host isolation model.
([dev-scripts/plaso/l2t_json_dfir.py](../../../dev-scripts/plaso/l2t_json_dfir.py))

**Decision options:**

| Option | Description | Trade-off |
|---|---|---|
| A | Keep `l2t_json_dfir` as-is for the PIIAT mapping path; separately deliver to Elasticsearch with `-o elastic` for analyst queries | Two outputs per image; more disk use; best field coverage for both audiences |
| B | Upstream `image_hostname`/`disk_id`/`volume_id` into Plaso's elastic module; use only `-o elastic` | One output; requires Plaso upstream contribution or maintained fork |
| C | Switch to `-o elastic`; add `image_hostname` via a Logstash enrichment filter reading the `.plaso` metadata | Logstash dependency for attribution; operationally complex |

**Files to change in DX_DFIR for Option A:**

- [`python/get_sybers_dfir/plaso.py`](../../../python/get_sybers_dfir/plaso.py) —
  add a second `psort` invocation after the existing one, passing
  `["python3", _PSORT_WRAPPER_PATH, ..., "-o", "elastic", "--server", es_host, "--port", es_port, "--index_name", f"plaso-{hostname}"]`
  using the Elasticsearch host from environment or config.
- [`docker/sof-elk/docker-compose.yml`](../../../docker/sof-elk/docker-compose.yml) —
  expose Elasticsearch host/port as environment variables consumable by the Plaso
  container.
- [`dev-scripts/plaso/l2t_json_dfir.py`](../../../dev-scripts/plaso/l2t_json_dfir.py) —
  document as the PIIAT mapping path output; add upstream proposal note.

---

### Phase 2 — Dedicated CAR pipeline in the existing SOF-ELK stack

**Motivation:** PIIAT-MitreCar already produces `car_*.jsonl` and
`car_relationships.jsonl`. The existing SOF-ELK stack can receive these via a new
Filebeat input block and a new Logstash pipeline config, routing them to typed
OpenSearch/Elasticsearch indices in parallel with the ADX path.

This is **additive** — it does not remove ADX and does not require changes to
PIIAT-MitreCar or the `car.db`/`superset.db` contract.
([optional-azul-elastic-path.md — Option A](https://github.com/Get-Sybers/PIIAT-MitreCar/blob/main/docs/research/ideas/optional-azul-elastic-path.md))

#### 2a. Filebeat input

Add a new input prospector under the SOF-ELK image for CAR JSONL. The SOF-ELK
Filebeat config loads all prospectors from
`/usr/local/sof-elk/lib/filebeat_inputs/*.yml` at startup.
([filebeat.yml](../../../docker/sof-elk/filebeat.yml),
[SOF-ELK filebeat_inputs](https://github.com/philhagen/sof-elk/tree/main/lib/filebeat_inputs))

New file: `docker/sof-elk/filebeat_inputs/car.yml` (baked into the image, or
mounted):
```yaml
- type: filestream
  id: dfir-car
  paths:
    - /logstash/car/**/*.jsonl
  parsers:
    - ndjson:
        target: ""
        overwrite_keys: true
  fields:
    labels.type: car
  fields_under_root: false
```

The `labels.type: car` field is how SOF-ELK's Logstash configs route events to the
correct parsing pipeline. The `SOFELK_INGEST_DIR` volume mount (already present in
`docker-compose.yml`) exposes the host-side ingest directory at `/logstash/` inside
the container.
([docker-compose.yml — `SOFELK_INGEST_DIR`](../../../docker/sof-elk/docker-compose.yml))

`dxdfir sofelk` delivers processed output into the watch directory via SHA-1-keyed
idempotence. Adding a `car/` subdirectory delivery step to
[`sofelk.py` — `deliver()`](../../../python/get_sybers_dfir/sofelk.py) would route CAR
JSONL through the same path.

#### 2b. Logstash CAR pipeline

Add `docker/sof-elk/logstash/car.conf` (new file):

```ruby
filter {
  if [labels][type] == "car" {
    # derive index name and document id from fields already in the CAR JSONL
    mutate {
      add_field => {
        "[@metadata][target_index]" => "car-%{[car_object]}"
        "[@metadata][document_id]"  => "%{[guid]}"
      }
    }
    # coerce timestamp to @timestamp
    date {
      match => ["timestamp", "ISO8601"]
      target => "@timestamp"
    }
  }
}

output {
  if [labels][type] == "car" {
    elasticsearch {
      hosts => ["${ES_HOSTS:localhost:9200}"]
      index => "%{[@metadata][target_index]}"
      document_id => "%{[@metadata][document_id]}"
      # document_id on guid makes every ingest idempotent
    }
  }
}
```

Register in `docker/sof-elk/pipelines.yml`:
```yaml
- pipeline.id: sof-elk
  path.config: "/usr/local/sof-elk/configfiles/*.conf"
- pipeline.id: car
  path.config: "/usr/share/logstash/pipeline/car.conf"
```

The `document_id => guid` makes every bulk ingest idempotent: re-delivering the same
CAR JSONL will overwrite rather than duplicate.
([Logstash Elasticsearch output — `document_id`](https://www.elastic.co/guide/en/logstash/current/plugins-outputs-elasticsearch.html#plugins-outputs-elasticsearch-document_id))

> **SOF-ELK contribution note:** The SOF-ELK project requires custom parsers to be
> placed in `configfiles-UNSUPPORTED/` when submitted as PRs — they are only moved
> to `configfiles/` after maintainer review for universal applicability. Since
> `car.conf` is DX_DFIR-specific it should live in the DX_DFIR `docker/sof-elk/`
> overlay rather than being upstreamed to SOF-ELK.
> ([SOF-ELK PULLREQUESTS.md](https://github.com/philhagen/sof-elk/blob/main/PULLREQUESTS.md))

#### 2c. OpenSearch / Elasticsearch index templates

Create `kusto/opensearch/car_index_templates.json` — one index template per CAR
object type plus one for relationships.

Design principles derived directly from `40-mitre.kql`:
(40-mitre.kql,
[OpenSearch index templates](https://opensearch.org/docs/latest/im-plugin/index-templates/))

- `guid` → `keyword`; used as `_id` → natural document-level idempotence.
- `timestamp` → `date` (ISO 8601).
- All string CAR fields → `keyword` (for exact-match aggregations) with a `.text`
  multi-field for free-text search where useful.
- `pid`, `port`, `bytes`, `size` and other numeric-looking fields → `keyword`
  (matching the KQL schema's deliberate choice to keep them as strings because
  evidence is type-inconsistent; cast at query time as
  `40-mitre.kql` notes).
- `native` → `object` with `dynamic: true` (preserves the structured JSON that
  currently maps to KQL's `dynamic` column type).
- Index pattern: `car-*` — one index per CAR object (e.g. `car-process`,
  `car-file`).

Example template fragment for `car-process`:
```json
{
  "index_patterns": ["car-process"],
  "template": {
    "settings": { "number_of_shards": 1 },
    "mappings": {
      "dynamic": false,
      "_source": { "enabled": true },
      "properties": {
        "car_object":       { "type": "keyword" },
        "timestamp":        { "type": "date" },
        "car_action":       { "type": "keyword" },
        "guid":             { "type": "keyword" },
        "owning_guid":      { "type": "keyword" },
        "parent_guid":      { "type": "keyword" },
        "link_confidence":  { "type": "keyword" },
        "source_artefact":  { "type": "keyword" },
        "source_host":      { "type": "keyword" },
        "native":           { "type": "object", "dynamic": true },
        "pid":              { "type": "keyword" },
        "ppid":             { "type": "keyword" },
        "exe":              { "type": "keyword" },
        "image_path":       { "type": "keyword" },
        "command_line":     { "type": "keyword" },
        "sha256_hash":      { "type": "keyword" },
        "user":             { "type": "keyword" },
        "hostname":         { "type": "keyword" },
        "fqdn":             { "type": "keyword" }
      }
    }
  }
}
```

#### 2d. New `run_car_elastic()` ingest backend

Add to `python/get_sybers_dfir/ingest/__init__.py`:

```python
def run_car_elastic(processed_dir, es_host, es_port, seen, dry_run, summary):
    """Ingest car_*.jsonl directly into OpenSearch/Elasticsearch.
    Uses the guid field as _id for idempotence; mirrors run_car()'s
    discovery and ledger contract."""
    car_dir = os.path.join(processed_dir, "car")
    ...
    # opensearch-py or elasticsearch-py bulk helpers
    # document_id = event["guid"]
    # index = "car-" + event["car_object"]
```

This replaces the `docker cp` + `.ingest into` path with a direct bulk API call.
([opensearch-py bulk helpers](https://opensearch-project.github.io/opensearch-py/api-ref/helpers.html),
ingest/__init__.py)

Add `--backend elastic` flag to `dxdfir ingest` in
[`cli.py`](../../../python/get_sybers_dfir/cli.py), defaulting to `adx` until the
elastic path is validated end-to-end.

---

### Phase 3 — Replace the KQL ingest harness and deprecate ADX

**Precondition:** Phase 2 validated end-to-end with parity checks between the
`mitre.car_*` Kusto tables and the `car-*` OpenSearch indices.

**Steps:**

1. **Make `run_car_elastic()` the default** in `ingest/__init__.py`; deprecate
   `run_car()` (keep it, gate it behind `--backend adx`).
   (ingest/__init__.py)

2. **Archive `kusto/` schema** to `docs/research/legacy/kusto/` so the column
   definitions remain as a human-readable reference. The OpenSearch templates in
   `kusto/opensearch/` become the live schema source.

3. **Remove the ADX emulator service** from
   [`docker-compose.yml`](../../../docker/sof-elk/docker-compose.yml) and from the
   `dfir_deploy_adx` Ansible role.

4. **Update `dxdfir deploy`** in [`cli.py`](../../../python/get_sybers_dfir/cli.py)
   to deploy the SOF-ELK stack by default instead of the ADX emulator. The
   `dfir_deploy_sofelk` Ansible role handles this today; make it the primary path.

5. **Update `dxdfir validate`** / `carcheck.py` to query OpenSearch instead of
   Kusto. The current `CarObjects()` / `Car()` KQL functions (defined in
   `40-mitre.kql`) have OpenSearch DSL equivalents.
   ([carcheck.py](../../../python/get_sybers_dfir/carcheck.py),
   40-mitre.kql)

6. **Update the test suite**: `python/tests/test_ingest.py` must cover the
   OpenSearch backend path before the Kusto path is removed.
   (test_ingest.py)

7. **Update documentation**: `docs/Kusto-Port.md`, `docs/Get-Started.md`, and
   `README.md` reference the ADX emulator explicitly; rewrite these sections.
   (Kusto-Port.md,
   [Get-Started.md](../../../docs/Get-Started.md))

---

### Phase 4 — Add Kafka and align with Azul's architecture

**Motivation:** Azul's Dispatcher/Kafka layer provides asynchronous decoupling
between submission, analysis dispatch, and result ingest. Adding Kafka to DX_DFIR
enables buffered fan-out (multiple consumers of the same events), deeper integration
with an Azul instance, and a path to the Azul plugin dispatch model.

**Precondition:** Phase 3 stable. Kafka is not justified by
Logstash/OpenSearch alone — it is justified when async decoupling, fan-out, or Azul
plugin dispatch are genuinely needed.
([Azul architecture](https://github.com/AustralianCyberSecurityCentre/azul-docs/blob/main/docs/sysadmin-guide/20-architecture.md),
[optional-azul-elastic-path.md — Option B](https://github.com/Get-Sybers/PIIAT-MitreCar/blob/main/docs/research/ideas/optional-azul-elastic-path.md))

#### 4a. Kafka in the compose stack

Add to `docker/sof-elk/docker-compose.yml`:
```yaml
services:
  kafka:
    image: apache/kafka:3.8.0
    # KRaft mode — no ZooKeeper
    environment:
      KAFKA_NODE_ID: 1
      KAFKA_PROCESS_ROLES: broker,controller
      KAFKA_LISTENERS: PLAINTEXT://:9092,CONTROLLER://:9093
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092
      KAFKA_CONTROLLER_QUORUM_VOTERS: 1@kafka:9093
      KAFKA_CONTROLLER_LISTENER_NAMES: CONTROLLER
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: "false"
    ports:
      - "127.0.0.1:9092:9092"
```

([Kafka KRaft docs](https://kafka.apache.org/documentation/#kraft),
[Kafka intro — topics](https://kafka.apache.org/documentation/#intro_topics))

#### 4b. Logstash Kafka input plugin

Install the `logstash-input-kafka` plugin in the SOF-ELK Dockerfile:
([Logstash Kafka input plugin](https://www.elastic.co/guide/en/logstash/current/plugins-inputs-kafka.html))

```dockerfile
RUN /usr/share/logstash/bin/logstash-plugin install logstash-input-kafka
```

Add `docker/sof-elk/logstash/car-kafka.conf`:
```ruby
input {
  kafka {
    bootstrap_servers => "${KAFKA_BOOTSTRAP_SERVERS:kafka:9092}"
    topics_pattern    => "car\\..+"
    codec             => "json"
    group_id          => "logstash-car"
    auto_offset_reset => "earliest"
    consumer_threads  => 4
  }
}

filter {
  mutate {
    add_field => {
      "[@metadata][target_index]" => "car-%{[car_object]}"
      "[@metadata][document_id]"  => "%{[guid]}"
    }
  }
  date {
    match => ["timestamp", "ISO8601"]
    target => "@timestamp"
  }
}

output {
  elasticsearch {
    hosts       => ["${ES_HOSTS:localhost:9200}"]
    index       => "%{[@metadata][target_index]}"
    document_id => "%{[@metadata][document_id]}"
  }
}
```

#### 4c. Topic design

Kafka guarantees ordering only within a partition. The message key must be set to
`source_host` (or a composite `case_id + source_host`) so all events from the same
host's timeline land in the same partition and maintain temporal order within a source.
([Kafka docs — topics and partitions](https://kafka.apache.org/documentation/#intro_topics))

| Topic | Producer | Consumer(s) |
|---|---|---|
| `car.<object>` (one per CAR object type, 13 total) | PIIAT-MitreCar pipeline | Logstash `car-kafka.conf`; optional future Azul plugin |
| `car.relationships` | PIIAT-MitreCar superset | Logstash `car-kafka.conf` |
| `dfir.plaso` (optional) | `plaso.py` elastic output or a Logstash → Kafka bridge | Downstream enrichment or Azul ingestor |

#### 4d. PIIAT-MitreCar producer wiring

`store.export_jsonl()` currently writes files; a Kafka producer path would emit
each CAR row as a message instead. This is a PIIAT-MitreCar change, not a DX_DFIR
change:
([optional-azul-elastic-path.md](https://github.com/Get-Sybers/PIIAT-MitreCar/blob/main/docs/research/ideas/optional-azul-elastic-path.md))

```python
# piiat_mitrecar/store.py — proposed kafka producer path
from kafka import KafkaProducer
import json

producer = KafkaProducer(
    bootstrap_servers=os.environ.get("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092"),
    value_serializer=lambda v: json.dumps(v).encode("utf-8"),
    key_serializer=lambda k: k.encode("utf-8"),
)
for row in car_rows:
    producer.send(
        topic=f"car.{row['car_object']}",
        key=row["source_host"],   # partition key = source isolation
        value=row,
    )
producer.flush()
```

---

### Phase 5 — Azul as a malware enrichment tier (parallel, independent)

**Motivation:** During an investigation, DX_DFIR's Plaso lane and file CAR object
production discover binary artefacts (executables, DLLs, scripts). Submitting these
to Azul (a running instance or the ACSC's deployment) returns ATT&CK technique IDs,
malware family attribution, extracted config, C2 addresses, and other features that
PIIAT-MitreCar can use as analyst leads without promoting them to first-class CAR
entries without corroborating evidence.

This phase is independent of Phases 1–4 and can be prototyped whenever an Azul
instance is reachable.

#### 5a. Submission workflow

Using `azul-client`:
([azul-client README](https://github.com/AustralianCyberSecurityCentre/azul-client/blob/main/README.md),
[azul-client API](https://github.com/AustralianCyberSecurityCentre/azul-client/blob/main/docs/api.md))

```python
from azul_client import AzulClient

client = AzulClient(server="https://azul.instance/")

# submit a binary discovered in a CAR file event
with open(binary_path, "rb") as f:
    client.upload(
        data=f,
        source="dfir_investigation",
        source_references={
            "case_id": case_id,
            "host": source_host,
            "source_car_guid": car_file_guid,
            "sha256": sha256_hash,
        }
    )

# retrieve enrichment results
meta = client.get_meta(sha256_hash)
docs = client.get_binary_documents(sha256_hash)

# pivot: find other binaries sharing the same C2 domain
similar = client.get_similar_feature_entities(sha256_hash)
```

Upload endpoint: `POST /api/v0/binaries/source`
([azul-client API](https://github.com/AustralianCyberSecurityCentre/azul-client/blob/main/docs/api.md))

#### 5b. Writing a DX_DFIR-facing Azul plugin

A plugin that processes Windows PE files extracted by the Plaso lane and emits
DFIR-relevant features (compilation time, import hash, suspicious imports, linked
C2 if CobaltStrike beacon) would be structured as:

```python
from azul_runner import BinaryPlugin, Feature, Job, State, FeatureType

class DfirPePlugin(BinaryPlugin):
    """Extract DFIR-relevant features from Windows PE binaries."""
    VERSION = "1.0"
    SETTINGS = add_settings(
        filter_data_types={"content": ["executable/windows/pe"]}
    )
    FEATURES = [
        Feature("pe_compile_time", "PE header compile timestamp", FeatureType.Datetime),
        Feature("pe_imphash", "Import hash", FeatureType.String),
        Feature("pe_pdb_path", "PDB debug path", FeatureType.FilePath),
        Feature("attack", "ATT&CK technique IDs", FeatureType.String),
    ]

    def execute(self, job: Job):
        data = job.get_data()
        # ... analysis ...
        self.add_feature_values("pe_compile_time", compile_time)
        self.add_feature_values("attack", "T1059.001")
```

File type strings come from `azul-bedrock/gosrc/identify.yaml`.
([identify.yaml](https://github.com/AustralianCyberSecurityCentre/azul-bedrock/blob/main/gosrc/identify.yaml),
[azul-runner README](https://github.com/AustralianCyberSecurityCentre/azul-runner/blob/main/README.md))

Note: feature names that already exist in Azul should be reused to enable
cross-plugin correlation. Check the Azul UI (Features → Explore) before naming new
features. The `attack` feature name is already used by `azul-plugin-maco` for
ATT&CK technique IDs and must not be renamed.
([features.md](https://github.com/AustralianCyberSecurityCentre/azul-docs/blob/main/docs/developer-guide/components/core/runner/docs/features.md),
[azul-plugin-maco README](https://github.com/AustralianCyberSecurityCentre/azul-plugin-maco/blob/main/README.md))

#### 5c. The enrichment bridge policy

Azul enrichment results must not be promoted to first-class CAR rows without
independent evidence. The following handling rules govern the bridge:

| Azul feature | Bridge action | Target namespace | Rationale |
|---|---|---|---|
| `attack` | Annotate only | `enrichment.azul.attack` | ATT&CK IDs from malware config indicate capability, not observed host activity |
| `family` | Annotate only | `enrichment.azul.family` | Family attribution is supplementary; the CAR `file` or `process` is the primary observation |
| `connection_c2` / `connection` | Candidate gap-fill | `analyst_leads.network` | C2 addresses tell analysts where to look in `car_flow`; they are not themselves observed flow events |
| `config_*` | Annotate only | `enrichment.azul.config` | Extracted config is enrichment; promote to CAR only if independently corroborated |
| `uri` feature type | Candidate gap-fill | `analyst_leads.network_uri` | Extracted URIs inform what to look for in `car_http`; not direct observations |
| `tag` | Annotate only | `enrichment.azul.tag` | Informational tags (e.g. `antivm_checks`) are analyst context |

---

## 7. Static mappings and relationship definitions

The issue requires hard-drawn mappings, relationships, and sources in a static
state (YAML, STIX, or a combination). The following are proposed PIIAT-side designs
that should live in `docs/mappings/` and be version-controlled alongside the pipeline.

### 7.1 YAML: log2timeline output routing

```yaml
# docs/mappings/plaso-output-routing.yaml
kind: piiat_plaso_output_routing
version: 1

outputs:
  - name: elastic
    module: elastic
    description: >
      ECS-aligned direct output to Elasticsearch/OpenSearch.
      Phase 1 adoption: higher field fidelity for CAR mapping.
      Does not include image_hostname/disk_id/volume_id; use l2t_json_dfir
      for PIIAT mapping path until upstream contribution lands.
    destination:
      type: elasticsearch
      host: "${ELASTIC_HOST:-localhost}"
      port: "${ELASTIC_PORT:-9200}"
      index: "plaso-{hostname}-{+YYYY.MM.dd}"
    flags:
      - "--server"
      - "--port"
      - "--index_name"
    reference: https://github.com/log2timeline/plaso/tree/main/plaso/output

  - name: l2t_json_dfir
    module: l2t_json_dfir
    description: >
      PIIAT mapping path. Adds image_hostname, disk_id, volume_id
      to every event from .plaso system_configuration.
      Retained until elastic module covers these fields.
    destination:
      type: file
      path: "PROCESSED/log2timeline/jsonl/{hostname}.jsonl"
    reference: dev-scripts/plaso/l2t_json_dfir.py
```

### 7.2 YAML: CAR-to-OpenSearch index mapping

```yaml
# docs/mappings/car-opensearch-indices.yaml
kind: piiat_car_index_map
version: 1
source: kusto/schema/40-mitre.kql
notes: >
  All numeric-looking fields (pid, port, bytes, size) stay keyword to
  match the deliberate KQL type discipline — evidence is type-inconsistent.
  Cast at query time. native is dynamic to preserve the structured JSON.
  guid is used as OpenSearch _id for idempotent bulk ingest.

common_fields:
  - { name: car_object,      type: keyword }
  - { name: timestamp,       type: date }
  - { name: car_action,      type: keyword }
  - { name: guid,            type: keyword, id_field: true }
  - { name: owning_guid,     type: keyword }
  - { name: link_confidence, type: keyword }
  - { name: source_artefact, type: keyword }
  - { name: source_host,     type: keyword }
  - { name: native,          type: object,  dynamic: true }

indices:
  - { object: authentication, index: car-authentication }
  - { object: driver,         index: car-driver         }
  - { object: email,          index: car-email          }
  - { object: file,           index: car-file           }
  - { object: flow,           index: car-flow           }
  - { object: http,           index: car-http           }
  - { object: module,         index: car-module         }
  - { object: process,        index: car-process,       extra_fields: [parent_guid] }
  - { object: registry,       index: car-registry       }
  - { object: service,        index: car-service        }
  - { object: socket,         index: car-socket         }
  - { object: thread,         index: car-thread         }
  - { object: user_session,   index: car-user-session   }

relationships_index:
  index: car-relationships
  id_field: composite  # sha1(source_guid + target_guid + relationship_verb)
  fields:
    - { name: source_guid,        type: keyword }
    - { name: target_guid,        type: keyword }
    - { name: relationship_verb,  type: keyword }
    - { name: source_car_object,  type: keyword }
    - { name: target_car_object,  type: keyword }
    - { name: source_host,        type: keyword }
    - { name: timestamp,          type: date    }
```

### 7.3 YAML: Azul enrichment policy

```yaml
# docs/mappings/azul-enrichment-policy.yaml
kind: piiat_enrichment_policy
name: azul_feature_bridge
version: 1
description: >
  Governs how Azul plugin output features are handled when bridged into
  PIIAT-MitreCar. All Azul features are supplementary. The CAR event/object
  from timeline evidence is the primary authoritative observation.
  An Azul-derived value is never promoted to a first-class CAR field without
  independent corroborating evidence from the host timeline.

rules:
  - match:
      azul_feature: attack
    action: annotate_only
    target:
      namespace: enrichment.azul.attack
    promote_to_car_field: false
    rationale: >
      ATT&CK technique IDs extracted from malware config reflect capability
      not observed host activity. T1059.001 in a CobaltStrike beacon does not
      mean powershell.exe was executed; the car_process observation is the
      evidence.
    reference: https://github.com/AustralianCyberSecurityCentre/azul-plugin-maco/blob/main/README.md

  - match:
      azul_feature: family
    action: annotate_only
    target:
      namespace: enrichment.azul.family
    promote_to_car_field: false
    rationale: >
      Malware family attribution is analyst context, not a timeline observation.
      The primary CAR object is car_file or car_process — the observed entity.

  - match:
      azul_feature_type: uri
    action: candidate_gap_fill
    target:
      namespace: analyst_leads.network_uri
    promote_to_car_field: false
    rationale: >
      Extracted URIs from malware config tell analysts where to look next
      in car_http and car_flow records. Do not create car_http rows from them.

  - match:
      azul_feature_prefix: connection
    action: candidate_gap_fill
    target:
      namespace: analyst_leads.network
    promote_to_car_field: false
    rationale: >
      C2 addresses and paths from config extraction are investigative leads
      not observed network events.

  - match:
      azul_feature_prefix: config_
    action: annotate_only
    target:
      namespace: enrichment.azul.config
    promote_to_car_field: false
    rationale: >
      Extracted configuration values are enrichment. Promote specific fields
      (e.g. a confirmed beacon sleep time) only when corroborated by endpoint
      telemetry (car_flow bytes/timing patterns, Sysmon network events).

  - match:
      azul_feature: tag
    action: annotate_only
    target:
      namespace: enrichment.azul.tag
    promote_to_car_field: false
    rationale: >
      Informational tags such as antivm_checks are analyst context not
      timeline assertions.
```

### 7.4 STIX 2.1 relationship sketch

The pattern: **CAR observation = primary; Azul enrichment = annotating note**.
([result_document.md](https://github.com/AustralianCyberSecurityCentre/azul-docs/blob/main/docs/developer-guide/components/core/metastore/docs/result_document.md),
[CAR-Relations.md](../../../docs/CAR-Relations.md))

```json
{
  "type": "bundle",
  "id": "bundle--00000000-0000-4000-8000-000000000001",
  "spec_version": "2.1",
  "objects": [
    {
      "type": "observed-data",
      "spec_version": "2.1",
      "id": "observed-data--00000000-0000-4000-8000-000000000002",
      "created": "2026-08-31T00:00:00.000Z",
      "modified": "2026-08-31T00:00:00.000Z",
      "first_observed": "2026-08-31T00:00:00Z",
      "last_observed": "2026-08-31T00:00:00Z",
      "number_observed": 1,
      "object_refs": ["file--00000000-0000-4000-8000-000000000003"],
      "x_piiat_car_object": "file",
      "x_piiat_car_action": "write",
      "x_piiat_source_host": "WORKSTATION01",
      "x_piiat_source_artefact": "plaso_filestat",
      "x_piiat_guid": "file-WORKSTATION01-Security-1234567"
    },
    {
      "type": "file",
      "spec_version": "2.1",
      "id": "file--00000000-0000-4000-8000-000000000003",
      "hashes": { "SHA-256": "<sha256>" },
      "name": "payload.bin",
      "x_piiat_image_path": "C:\\Windows\\Temp\\payload.bin"
    },
    {
      "type": "malware",
      "spec_version": "2.1",
      "id": "malware--00000000-0000-4000-8000-000000000004",
      "created": "2026-08-31T00:00:00.000Z",
      "modified": "2026-08-31T00:00:00.000Z",
      "name": "CobaltStrike",
      "is_family": true,
      "sample_refs": ["file--00000000-0000-4000-8000-000000000003"],
      "x_azul_features": {
        "attack": ["T1001.003", "T1059.001", "T1055"],
        "connection_c2": ["119.3.152.152/g.pixel"],
        "algorithm_communication": "RSA"
      }
    },
    {
      "type": "note",
      "spec_version": "2.1",
      "id": "note--00000000-0000-4000-8000-000000000005",
      "created": "2026-08-31T00:00:00.000Z",
      "modified": "2026-08-31T00:00:00.000Z",
      "content": "Azul enrichment result: CobaltStrike family attributed by azul-plugin-maco. ATT&CK features and C2 addresses are supplementary analyst leads — not observed host activity. Corroborate against car_flow and car_process before promoting.",
      "object_refs": [
        "observed-data--00000000-0000-4000-8000-000000000002",
        "malware--00000000-0000-4000-8000-000000000004"
      ]
    }
  ]
}
```

The STIX direction is explicitly supported by Azul maintainers as a future goal,
specifically for knowledge sharing with OpenCTI and external systems.
([Azul Issue #4 maintainer comment](https://github.com/AustralianCyberSecurityCentre/azul/issues/4#issuecomment-3949198963))
Building toward this structure now means a future Azul STIX export path is a
translation problem rather than a rewrite.

---

## 8. Contribution opportunities

Azul welcomes pull requests. The contributing guide requires Python 3.10+, `ruff`
for formatting and linting, `tox` for testing, inclusion of tests with new
functionality, and Google-style docstrings.
([contributing.md](https://github.com/AustralianCyberSecurityCentre/azul-docs/blob/main/docs/developer-guide/01-contributing.md))

| Opportunity | Description | Azul entry point |
|---|---|---|
| STIX export plugin or metastore command | Maintainers have stated STIX/OpenCTI is a future direction; a `piiat_stix_export` metastore command or plugin that transforms result documents into STIX 2.1 bundles could be contributed | [Issue #4 — maintainer comment](https://github.com/AustralianCyberSecurityCentre/azul/issues/4#issuecomment-3949198963), [metastore README](https://github.com/AustralianCyberSecurityCentre/azul-metastore/blob/main/README.md) |
| DFIR timeline enrichment plugin | An `azul-plugin-dfir-pe` plugin that processes Windows PE executables discovered during incident response, emitting `pe_compile_time`, `pe_imphash`, `pe_pdb_path` features with DFIR-specific context | [runner plugin development guide](https://github.com/AustralianCyberSecurityCentre/azul-docs/blob/main/docs/developer-guide/components/core/runner/docs/index.md) |
| OpenSearch CAR index templates | Contribute validated OpenSearch index templates for CAR objects as a reference for DFIR use cases in the Azul ecosystem | [metastore README](https://github.com/AustralianCyberSecurityCentre/azul-metastore/blob/main/README.md), [binary2.md](https://github.com/AustralianCyberSecurityCentre/azul-docs/blob/main/docs/developer-guide/components/core/metastore/docs/binary2.md) |
| `image_hostname` contribution to Plaso elastic output | Upstream the `image_hostname`/`disk_id`/`volume_id` fields into Plaso's `ElasticSearchOutputModule` to match what the custom `l2t_json_dfir` module already emits | [Plaso output module source](https://github.com/log2timeline/plaso/tree/main/plaso/output), [dev-scripts/plaso/l2t_json_dfir.py](../../../dev-scripts/plaso/l2t_json_dfir.py) |
| `azul-generator` boilerplate for DFIR-domain plugins | A generator template for DFIR-context Azul plugins that pre-populates file type filters for PE, OLE, PDF (artefact types commonly encountered in IR) | [contributing.md — create basic source repository](https://github.com/AustralianCyberSecurityCentre/azul-docs/blob/main/docs/developer-guide/components/core/runner/docs/index.md) |

---

## 9. Third-party repos to pin under `third_party/`

If vendoring Azul components:

| Repo | Pin rationale | Source |
|---|---|---|
| `azul-bedrock` | Avro schemas; `identify.yaml` file type taxonomy; stable shared models | [azul-bedrock](https://github.com/AustralianCyberSecurityCentre/azul-bedrock) |
| `azul-runner` | Plugin SDK; needed to write or consume a PIIAT enrichment plugin | [azul-runner](https://github.com/AustralianCyberSecurityCentre/azul-runner) |
| `azul-metastore` | OpenSearch index design reference; ingestor loop pattern | [azul-metastore](https://github.com/AustralianCyberSecurityCentre/azul-metastore) |
| `azul-restapi-server` | API composition surface; needed for scripted export | [azul-restapi-server](https://github.com/AustralianCyberSecurityCentre/azul-restapi-server) |
| `azul-client` | Ready-made Python client for submissions and queries | [azul-client](https://github.com/AustralianCyberSecurityCentre/azul-client) |

Note: `azul-bedrock` uses `uv` with a private registry pin (`uv.lock`). External
contributors must delete `uv.lock` and update `pyproject.toml` to use the public
PyPI registry before running `uv sync`.
([azul-bedrock README — uv note](https://github.com/AustralianCyberSecurityCentre/azul-bedrock/blob/main/README.md))

---

## 10. Risks and constraints

| Risk | Detail | Mitigation |
|---|---|---|
| `l2t_json_dfir` custom fields absent from Plaso elastic output | `image_hostname`, `disk_id`, `volume_id` are not emitted by `-o elastic`; PIIAT mapping fidelity depends on them | Run both outputs (Phase 1 Option A); contribute upstream (contribution opportunity) |
| ADX emulator limitations discovered late | The emulator has no security, persistence caveats, and no benchmarking permitted (Kusto-Port.md); these already motivate the migration | Phase 2 validates parity before Phase 3 removes ADX |
| Azul's `uv.lock` private registry pin | External use requires deleting `uv.lock` ([bedrock README](https://github.com/AustralianCyberSecurityCentre/azul-bedrock/blob/main/README.md)) | Document requirement in `third_party/` README; script the delete + reinstall step |
| Kafka ordering within topic | Only guaranteed within a partition; using the wrong key allows cross-host event interleaving | Key must be `source_host` (or composite); documented in Phase 4 topic design |
| Azul's binary2 index routing | All documents for a sha256 must land on the same OpenSearch shard (`binary2.{sha256[0]}`); custom index templates must honour the same shard routing logic ([binary2.md](https://github.com/AustralianCyberSecurityCentre/azul-docs/blob/main/docs/developer-guide/components/core/metastore/docs/binary2.md)) | CAR indices use a different keying scheme (guid not sha256) — no collision; document clearly |
| No current STIX export in Azul | Maintainers confirm STIX/OpenCTI is future direction only; no automated export path exists today ([Issue #4](https://github.com/AustralianCyberSecurityCentre/azul/issues/4#issuecomment-3949198963)) | Build toward STIX-compatible static mapping now; the contribution opportunity is the near-term path |

---

## 11. Summary roadmap

| Phase | Scope | Risk | Prerequisite |
|---|---|---|---|
| 1 — log2timeline elastic output | Add `-o elastic` second psort run; environment config | Low | Reachable Elasticsearch endpoint |
| 2 — CAR JSONL → SOF-ELK | Filebeat input + Logstash config + index templates + `run_car_elastic()` | Low–Medium | Phase 1 optional |
| 3 — Replace KQL ingest harness | Default to OpenSearch; archive ADX; update docs and tests | Medium | Phase 2 parity validated |
| 4 — Add Kafka | Compose service + Logstash Kafka pipeline + PIIAT producer wiring | High | Phase 3 stable |
| 5 — Azul enrichment tier | `azul-client` submissions + enrichment bridge policy | Low–Medium (parallel) | Azul instance reachable |

---

## Related documents

- [PIIAT-MitreCar: Optional Azul-style Logstash/Kafka/OpenSearch path](https://github.com/Get-Sybers/PIIAT-MitreCar/blob/main/docs/research/ideas/optional-azul-elastic-path.md)
- [PIIAT-MitreCar: Azul research](https://github.com/Get-Sybers/PIIAT-MitreCar/blob/main/docs/research/ideas/azul.md)
- [PIIAT-MitreCar issue #26](https://github.com/Get-Sybers/PIIAT-MitreCar/issues/26)
- [DX_DFIR issue #101](https://github.com/Get-Sybers/DX_DFIR/issues/101)
- [Azul about](https://github.com/AustralianCyberSecurityCentre/azul-docs/blob/main/docs/overview/about.md)
- [Azul architecture](https://github.com/AustralianCyberSecurityCentre/azul-docs/blob/main/docs/sysadmin-guide/20-architecture.md)
- [Azul contributing guide](https://github.com/AustralianCyberSecurityCentre/azul-docs/blob/main/docs/developer-guide/01-contributing.md)
- [Azul plugin development guide](https://github.com/AustralianCyberSecurityCentre/azul-docs/blob/main/docs/developer-guide/components/core/runner/docs/index.md)
- [Azul feature naming guide](https://github.com/AustralianCyberSecurityCentre/azul-docs/blob/main/docs/developer-guide/components/core/runner/docs/features.md)
- [azul-bedrock README](https://github.com/AustralianCyberSecurityCentre/azul-bedrock/blob/main/README.md)
- [azul-runner README](https://github.com/AustralianCyberSecurityCentre/azul-runner/blob/main/README.md)
- [azul-metastore README](https://github.com/AustralianCyberSecurityCentre/azul-metastore/blob/main/README.md)
- [azul-client API reference](https://github.com/AustralianCyberSecurityCentre/azul-client/blob/main/docs/api.md)
- [azul-plugin-maco README](https://github.com/AustralianCyberSecurityCentre/azul-plugin-maco/blob/main/README.md)
- [binary2 document model](https://github.com/AustralianCyberSecurityCentre/azul-docs/blob/main/docs/developer-guide/components/core/metastore/docs/binary2.md)
- [result document model](https://github.com/AustralianCyberSecurityCentre/azul-docs/blob/main/docs/developer-guide/components/core/metastore/docs/result_document.md)
- [Azul STIX issue #4](https://github.com/AustralianCyberSecurityCentre/azul/issues/4#issuecomment-3949198963)
- [SOF-ELK upstream](https://github.com/philhagen/sof-elk)
- [Logstash Kafka input plugin](https://www.elastic.co/guide/en/logstash/current/plugins-inputs-kafka.html)
- [Logstash Elasticsearch output plugin](https://www.elastic.co/guide/en/logstash/current/plugins-outputs-elasticsearch.html)
- [Kafka topics and partitions](https://kafka.apache.org/documentation/#intro_topics)
- [Kafka KRaft mode](https://kafka.apache.org/documentation/#kraft)
- [OpenSearch index templates](https://opensearch.org/docs/latest/im-plugin/index-templates/)
- [opensearch-py bulk helpers](https://opensearch-project.github.io/opensearch-py/api-ref/helpers.html)
- [docs/CAR-Pipeline.md](../../../docs/CAR-Pipeline.md)
- [docs/CAR-Relations.md](../../../docs/CAR-Relations.md)
- docs/Kusto-Port.md
- kusto/schema/40-mitre.kql
- [docker/sof-elk/docker-compose.yml](../../../docker/sof-elk/docker-compose.yml)
- [docker/sof-elk/Dockerfile](../../../docker/sof-elk/Dockerfile)
- [docker/sof-elk/filebeat.yml](../../../docker/sof-elk/filebeat.yml)
- [docker/sof-elk/pipelines.yml](../../../docker/sof-elk/pipelines.yml)
- [python/get_sybers_dfir/plaso.py](../../../python/get_sybers_dfir/plaso.py)
- python/get_sybers_dfir/ingest/__init__.py
- [python/get_sybers_dfir/cli.py](../../../python/get_sybers_dfir/cli.py)
- [python/get_sybers_dfir/sofelk.py](../../../python/get_sybers_dfir/sofelk.py)
- [dev-scripts/plaso/l2t_json_dfir.py](../../../dev-scripts/plaso/l2t_json_dfir.py)
