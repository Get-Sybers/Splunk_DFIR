# Adopting Azul infrastructure in DX_DFIR

Generated from public Azul repositories, existing DX_DFIR pipeline code, and
PIIAT-MitreCar research documents on 2026-08-31.

## Executive summary

- Azul is an Australian Cyber Security Centre (ACSC) open-source **malware repository
  and plugin-driven analysis platform**. Its infrastructure stack centres on Kafka,
  OpenSearch, S3, a Go-based REST API, and a plugin runner model. It is not a DFIR
  event-log normaliser, but several of its infrastructure components directly overlap
  with the technology already present in DX_DFIR (Logstash, Elasticsearch/OpenSearch,
  Filebeat). ([Azul README](https://github.com/AustralianCyberSecurityCentre/azul/blob/main/README.md),
  [Azul about](https://github.com/AustralianCyberSecurityCentre/azul-docs/blob/main/docs/overview/about.md))

- DX_DFIR already ships a SOF-ELK-based Filebeat → Logstash → Elasticsearch/OpenSearch
  pipeline. Adopting Azul's elastic stack is largely a matter of **extending what
  already exists** rather than replacing it wholesale.
  ([docker-compose.yml](../../docker/sof-elk/docker-compose.yml),
  [filebeat.yml](../../docker/sof-elk/filebeat.yml),
  [pipelines.yml](../../docker/sof-elk/pipelines.yml))

- The most impactful near-term change is adopting **log2timeline's built-in
  `elasticsearch` output** (`psort -o elastic`) instead of the current
  `l2t_json_dfir` JSON Lines path. This increases the fidelity of available fields
  delivered to Logstash and reduces bespoke mapping work.
  ([log2timeline elastic output](https://plaso.readthedocs.io/en/latest/sources/api/plaso.output.html#plaso.output.elastic.ElasticSearchOutputModule),
  [plaso.py](../../python/get_sybers_dfir/plaso.py))

- If KQL/ADX becomes a limiting factor, OpenSearch is a viable successor store for
  CAR objects and relationships. The current `40-mitre.kql` schema defines every
  column; those columns become the first set of OpenSearch index templates.
  ([40-mitre.kql](../../kusto/schema/40-mitre.kql))

- Adding Kafka is the larger change and the one most aligned with Azul's own
  architecture. It should come after the file-based Filebeat/Logstash/OpenSearch path
  is validated, not before.

---

## 1. What Azul offers

### 1.1 Public repositories

| Repository | Purpose | Relevance to DX_DFIR |
|---|---|---|
| [`azul`](https://github.com/AustralianCyberSecurityCentre/azul) | Umbrella repository and main documentation entry point | Starting point for orientation |
| [`azul-docs`](https://github.com/AustralianCyberSecurityCentre/azul-docs) | Operator and developer guides, architecture diagrams, API docs | Architecture, Kafka/OpenSearch topology, plugin model |
| [`azul-bedrock`](https://github.com/AustralianCyberSecurityCentre/azul-bedrock) | Core data schemas (BinaryEvent, identify.yaml, source typing) | Schema patterns for provenance and feature naming |
| [`azul-runner`](https://github.com/AustralianCyberSecurityCentre/azul-runner) | Plugin SDK for analysis runners | Reference model for enrichment plugin wiring |
| [`azul-metastore`](https://github.com/AustralianCyberSecurityCentre/azul-metastore) | Storage and query layer; OpenSearch-backed entity/result store | Index and mapping design reference |
| [`azul-restapi-server`](https://github.com/AustralianCyberSecurityCentre/azul-restapi-server) | REST API server; plugin endpoint composition | API integration and export surface |
| [`azul-client`](https://github.com/AustralianCyberSecurityCentre/azul-client) | Client library for scripted uploads and queries | Scripted submission from DX_DFIR or PIIAT tooling |
| [`azul-plugin-maco`](https://github.com/AustralianCyberSecurityCentre/azul-plugin-maco) | ATT&CK-bearing malware config extraction plugin | Concrete example of ATT&CK feature output |

### 1.2 Infrastructure stack

Azul's documented stack
([Azul architecture](https://github.com/AustralianCyberSecurityCentre/azul-docs/blob/main/docs/sysadmin-guide/20-architecture.md)):

- **Kafka** — message bus between submission, runner dispatch, and result storage.
- **OpenSearch** — primary search and analytics store for entities, results, features,
  and cluster outputs.
- **S3-compatible storage** — binary and large-blob storage.
- **Go REST API** (`azul-restapi-server`) — submission, query, and plugin endpoint
  composition.
- **Plugin runners** (`azul-runner`) — isolated execution units that consume a binary
  artefact from Kafka, run analysis, and emit structured features back onto Kafka.
- **OIDC authentication** — pluggable identity layer.

### 1.3 Elastic stack components DX_DFIR already runs

DX_DFIR's SOF-ELK container provides:

- **Filebeat** — watches `/logstash/<type>/` directories and ships to Logstash.
  ([filebeat.yml](../../docker/sof-elk/filebeat.yml))
- **Logstash** — parses and normalises inbound data under SOF-ELK's pipeline configs.
  ([pipelines.yml](../../docker/sof-elk/pipelines.yml),
  [Dockerfile](../../docker/sof-elk/Dockerfile))
- **Elasticsearch / OpenSearch backend** — indexed, searchable store.
  ([docker-compose.yml](../../docker/sof-elk/docker-compose.yml))

Kafka and Beats for non-file sources are **not present** today.

### 1.4 What Azul does not offer for this use case

- Azul does not model Windows event-log timeline activity. Its entity model centres on
  binary malware artefacts, parent/child entity chains, and analysis plugin results.
  ([Azul about](https://github.com/AustralianCyberSecurityCentre/azul-docs/blob/main/docs/overview/about.md))
- Azul has no current automated STIX export; a maintainer has described STIX/OpenCTI
  integration as a future direction rather than a current deliverable.
  ([Issue #4 maintainer comment](https://github.com/AustralianCyberSecurityCentre/azul/issues/4#issuecomment-3949198963))

---

## 2. Adaptation assessment

### 2.1 Strong matches with the DX_DFIR pipeline

| Azul concept | DX_DFIR / PIIAT-MitreCar equivalent |
|---|---|
| Source/provenance metadata on every entity | `source_host`, `source_artefact` on every CAR row ([40-mitre.kql](../../kusto/schema/40-mitre.kql)) |
| Normalised feature naming discipline | CAR object/action taxonomy from MITRE ([docs/CAR-Pipeline.md](../../docs/CAR-Pipeline.md)) |
| Parent/child entity relationships | `car_relationships` + `owning_guid`/`guid` linking ([40-mitre.kql](../../kusto/schema/40-mitre.kql)) |
| Kafka → Logstash → OpenSearch topology | File → Logstash → Elasticsearch/OpenSearch already present; Kafka is the gap |
| Plugin/enrichment extensibility | Signature rules, Hayabusa, Sigma, Suricata all feed DX_DFIR today ([docs/Signature-Rules.md](../../docs/Signature-Rules.md)) |

### 2.2 Weak matches / limits

- Azul's data model is centred on **malware binary entities**; CAR models
  **host-activity events**. The two can sit alongside each other (Azul enriches a
  file artefact discovered during CAR event production), but they should not be merged
  into one schema.
- Replacing KQL/ADX with OpenSearch requires new index templates for every CAR object
  type and a new ingest path; it is additive work, not a one-line swap.

---

## 3. Roadmap: adopting Azul's elastic stack in DX_DFIR

The roadmap is ordered from smallest change to largest. Each phase can be validated
independently before the next is started.

### Phase 1 — Adopt log2timeline's elastic output (immediate, low risk)

**What changes:** `plaso.py` switches `psort -o l2t_json_dfir` to
`psort -o elastic` (or `psort -o elastic_ts`), directing Plaso output directly at
the existing Elasticsearch/OpenSearch backend instead of writing JSON Lines for later
Filebeat pickup.

**Why it matters:** The elastic output module ships richer ECS-aligned fields with the
same event content, improving extraction fidelity when PIIAT-MitreCar maps events to
CAR entries. Field names already used in the custom `l2t_json_dfir` output module are
preserved or superseded by ECS equivalents.

**Files to change in DX_DFIR:**

- [`python/get_sybers_dfir/plaso.py`](../../python/get_sybers_dfir/plaso.py) — swap
  the `-o l2t_json_dfir` flag for `-o elastic`; pass `--server`, `--port`, and
  `--index_name` from configuration.
  ([Plaso elastic output docs](https://plaso.readthedocs.io/en/latest/sources/api/plaso.output.html#plaso.output.elastic.ElasticSearchOutputModule))
- [`dev-scripts/plaso/l2t_json_dfir.py`](../../dev-scripts/plaso/l2t_json_dfir.py) —
  retained as fallback or deprecated; document the decision.
- [`docker/sof-elk/filebeat.yml`](../../docker/sof-elk/filebeat.yml) — remove the
  Plaso-specific Filebeat input if the elastic output is used directly; keep the
  generic log input prospectors for other pipeline stages.

**References:**

- [log2timeline elastic output module](https://plaso.readthedocs.io/en/latest/sources/api/plaso.output.html#plaso.output.elastic.ElasticSearchOutputModule)
- [psort output format flag](https://plaso.readthedocs.io/en/latest/sources/user/Using-psort.html)

---

### Phase 2 — Add a dedicated CAR JSONL pipeline to the existing SOF-ELK stack

**What changes:** PIIAT-MitreCar already exports `car_*.jsonl` and
`car_relationships.jsonl`. A new Filebeat input configuration and a new Logstash
pipeline pick those up and index them into OpenSearch/Elasticsearch under
`car-<object>` indices, replacing or running alongside the current ADX ingest path.

**This is Option A from the PIIAT research** (reuse the existing SOF-ELK delivery
model before considering Kafka).
([optional-azul-elastic-path.md in PIIAT-MitreCar](https://github.com/Get-Sybers/PIIAT-MitreCar/blob/main/docs/research/ideas/optional-azul-elastic-path.md))

**Files to create or change in DX_DFIR:**

| File | Change |
|---|---|
| `docker/sof-elk/filebeat.yml` | Add a new input block watching `data_store/processed/car/` for `car_*.jsonl` |
| `docker/sof-elk/logstash/car.conf` (new) | Parse `car_*.jsonl`: route by filename prefix to target index; set `_id` to `guid` for idempotence |
| `docker/sof-elk/pipelines.yml` | Register `car.conf` as an additional pipeline or append to the SOF-ELK pipeline |
| `kusto/opensearch/car_index_templates.json` (new) | OpenSearch index templates mirroring every column in `40-mitre.kql` |
| `python/get_sybers_dfir/ingest/__init__.py` | Add an OpenSearch ingest backend (`run_car_elastic()`) alongside or replacing `run_car()` |
| `python/get_sybers_dfir/cli.py` | Expose `--backend elastic` flag on `dxdfir ingest` |

**Index template design:**

- One template per CAR object, named `car-<object>`, matching `40-mitre.kql` columns.
  ([40-mitre.kql](../../kusto/schema/40-mitre.kql))
- One template `car-relationships` for the relationship export.
- `native` mapped as `object` with `dynamic: true` to preserve the structured JSON
  already present in the store.
- Numeric-looking CAR fields (`pid`, `port`, etc.) stay `keyword`/`text` to match
  current KQL type discipline (evidence is type-inconsistent).
- `_id` set to the CAR row's `guid` value; the Logstash pipeline derives this from
  the filename or the `guid` field, providing natural idempotence.

**References:**

- [OpenSearch index templates](https://docs.opensearch.org/latest/im-plugin/index-templates/)
- [OpenSearch ingest pipelines](https://docs.opensearch.org/latest/ingest-pipelines/)
- [Logstash Elasticsearch output plugin](https://www.elastic.co/guide/en/logstash/current/plugins-outputs-elasticsearch.html)
- [Logstash Filebeat input](https://www.elastic.co/guide/en/logstash/current/plugins-inputs-beats.html)

---

### Phase 3 — Replace or supplement the current KQL/ADX ingest harness

**What changes:** The `run_car()` function in
[`ingest/__init__.py`](../../python/get_sybers_dfir/ingest/__init__.py) currently:

1. discovers `car_*.jsonl` files under `data_store/processed/car`;
2. maps filenames to `mitre.car_<object>` Kusto tables;
3. stages files into the ADX emulator container;
4. records SHA-1 hashes in `_DfirIngestLedger` for idempotence.

An OpenSearch replacement must provide the same operational features:

| Feature | ADX path | OpenSearch equivalent |
|---|---|---|
| Discovery and routing | Filename → table name | Filename → index name |
| Idempotence | SHA-1 hash in `_DfirIngestLedger` | Deterministic `_id` (guid) in target index; or a sidecar ledger index |
| Batching / retry | Single-file `.ingest` commands | Logstash bulk API with retry plugin; or opensearch-py bulk with retry |
| Operator-visible output | Ingest summary JSON on stdout | Same summary format; `dxdfir ingest` output contract unchanged |

If KQL is deprecated, the ADX emulator container can be removed from
[`docker-compose.yml`](../../docker/sof-elk/docker-compose.yml) and the `kusto/`
directory archived under `docs/research/legacy/`.

**References:**

- [opensearch-py bulk helpers](https://opensearch-project.github.io/opensearch-py/api-ref/helpers.html)
- [`ingest/__init__.py`](../../python/get_sybers_dfir/ingest/__init__.py)
- [`cli.py`](../../python/get_sybers_dfir/cli.py)

---

### Phase 4 — Add Kafka and align with Azul's architecture

**What changes:** A Kafka broker is added to the DX_DFIR compose stack. PIIAT-MitreCar
emits CAR JSONL as Kafka messages instead of writing files; Logstash reads from those
topics via the Kafka input plugin and writes to OpenSearch.

**This is Option B from the PIIAT research** (larger change, justified when
asynchronous decoupling or multiple consumers are genuinely required).
([optional-azul-elastic-path.md in PIIAT-MitreCar](https://github.com/Get-Sybers/PIIAT-MitreCar/blob/main/docs/research/ideas/optional-azul-elastic-path.md))

**Files to create or change in DX_DFIR:**

| File | Change |
|---|---|
| `docker/sof-elk/docker-compose.yml` | Add `kafka` service (KRaft mode to avoid ZooKeeper); expose broker to Logstash |
| `docker/sof-elk/Dockerfile` | Install `logstash-input-kafka` plugin |
| `docker/sof-elk/logstash/car-kafka.conf` (new) | Kafka input → JSON codec → OpenSearch output; same index/routing logic as Phase 2 |
| `docker/sof-elk/pipelines.yml` | Register `car-kafka.conf` pipeline |

**Topic design:**

Kafka only guarantees ordering within a partition. The Kafka message key must be set to
`source_host` (or a composite `case_id + source_host`) so that all events from the
same source timeline land in the same partition.
([Kafka documentation — topics and partitions](https://kafka.apache.org/documentation/#intro_topics))

Topics:

| Topic | Producers | Consumers |
|---|---|---|
| `car.<object>` (one per CAR object type) | PIIAT-MitreCar pipeline | Logstash car-kafka pipeline |
| `car.relationships` | PIIAT-MitreCar superset | Logstash car-kafka pipeline |
| `dfir.plaso` (optional) | `plaso.py` if Kafka output added to Plaso | Logstash or downstream enrichment |

**References:**

- [Logstash Kafka input plugin](https://www.elastic.co/guide/en/logstash/current/plugins-inputs-kafka.html)
- [Logstash Elasticsearch output plugin](https://www.elastic.co/guide/en/logstash/current/plugins-outputs-elasticsearch.html)
- [Kafka documentation — topics](https://kafka.apache.org/documentation/#intro_topics)
- [Azul architecture](https://github.com/AustralianCyberSecurityCentre/azul-docs/blob/main/docs/sysadmin-guide/20-architecture.md)

---

### Phase 5 — Use Azul as a malware enrichment tier (optional, parallel)

**What changes:** Files discovered during DX_DFIR processing (e.g. binaries extracted
from a Plaso timeline, Zimmerman parser outputs) are submitted to an Azul instance via
`azul-client`. Enrichment results (ATT&CK IDs, malware family, extracted configs) are
associated with the relevant CAR `file` or `process` object but kept as separate
enrichment annotations rather than first-class CAR rows.

This phase is independent of Phases 1–4 and can be prototyped at any time once an Azul
instance is reachable.

**References:**

- [azul-client README](https://github.com/AustralianCyberSecurityCentre/azul-client/blob/main/README.md)
- [azul-client API](https://github.com/AustralianCyberSecurityCentre/azul-client/blob/main/docs/api.md)
- [azul-restapi-server README](https://github.com/AustralianCyberSecurityCentre/azul-restapi-server/blob/main/README.md)
- [azul-plugin-maco (ATT&CK feature example)](https://github.com/AustralianCyberSecurityCentre/azul-plugin-maco/blob/main/README.md)

---

## 4. Static mappings, relationships, and sources in YAML and STIX

The issue requests **hard-drawn mappings, relationships, and sources in a static state**
(YAML, STIX, or a combination). The following proposals are designed for the DX_DFIR
pipeline's context, borrowing Azul's provenance discipline.

### 4.1 Proposed YAML: log2timeline output routing

```yaml
# docs/mappings/plaso-output-routing.yaml
# Maps log2timeline output modules to their downstream destination.
# Phase 1 adopts the elastic path; l2t_json_dfir is retained as fallback.

kind: piiat_plaso_output_routing
version: 1

outputs:
  - name: elastic
    module: elastic
    description: >
      ECS-aligned Elasticsearch/OpenSearch direct output.
      Adopted in Phase 1; higher field fidelity for CAR mapping.
    destination:
      type: elasticsearch
      host: "${ELASTIC_HOST:-localhost}"
      port: "${ELASTIC_PORT:-9200}"
      index: "plaso-{+YYYY.MM.dd}"
    reference: https://plaso.readthedocs.io/en/latest/sources/api/plaso.output.html#plaso.output.elastic.ElasticSearchOutputModule

  - name: l2t_json_dfir
    module: l2t_json_dfir
    description: >
      Legacy JSON Lines output with image_hostname/disk_id/volume_id enrichment.
      Retained as fallback until elastic output is validated.
    destination:
      type: file
      path: "PROCESSED/log2timeline/{hostname}.jsonl"
    reference: dev-scripts/plaso/l2t_json_dfir.py
```

### 4.2 Proposed YAML: CAR index template sources

```yaml
# docs/mappings/car-opensearch-indices.yaml
# Canonical list of CAR object types and their target OpenSearch index names.
# Generated from 40-mitre.kql; update when the CAR object model changes.

kind: piiat_car_index_map
version: 1
source: kusto/schema/40-mitre.kql

common_fields:
  - name: car_object
    type: keyword
  - name: timestamp
    type: date
  - name: car_action
    type: keyword
  - name: guid
    type: keyword
    id_field: true        # used as OpenSearch _id
  - name: owning_guid
    type: keyword
  - name: link_confidence
    type: keyword
  - name: source_artefact
    type: keyword
  - name: source_host
    type: keyword
  - name: native
    type: object
    dynamic: true

indices:
  - object: authentication
    index: car-authentication
  - object: email
    index: car-email
  - object: file
    index: car-file
  - object: flow
    index: car-flow
  - object: http
    index: car-http
  - object: module
    index: car-module
  - object: network_connection
    index: car-network-connection
  - object: process
    index: car-process
  - object: registry
    index: car-registry
  - object: service
    index: car-service
  - object: socket
    index: car-socket
  - object: thread
    index: car-thread
  - object: user_activity
    index: car-user-activity
  - object: user_session
    index: car-user-session

relationships_index:
  index: car-relationships
  fields:
    - name: source_guid
      type: keyword
    - name: target_guid
      type: keyword
    - name: relationship_verb
      type: keyword
    - name: source_car_object
      type: keyword
    - name: target_car_object
      type: keyword
    - name: source_host
      type: keyword
    - name: timestamp
      type: date
```

### 4.3 Proposed YAML: Azul enrichment bridge policy

```yaml
# docs/mappings/azul-enrichment-policy.yaml
# Defines how Azul plugin features are handled when bridged into PIIAT-MitreCar.
# Rules are applied by the enrichment bridge, not by CAR cascade rules.

kind: piiat_enrichment_policy
name: azul_feature_bridge
version: 1

rules:
  - match:
      azul_feature: attack
    action: annotate_only
    target:
      namespace: enrichment.azul.attack
    rationale: >
      ATT&CK IDs extracted from malware config are useful pivot points but are
      not direct evidence of host activity. Do not promote to a first-class
      CAR row without corroborating timeline evidence.
    reference: https://github.com/AustralianCyberSecurityCentre/azul-plugin-maco/blob/main/README.md

  - match:
      azul_feature_type: uri
    action: candidate_gap_fill
    target:
      namespace: analyst_leads.network_uri
    rationale: >
      Extracted URIs from malware config indicate where to look next but should
      not become observed CAR flow/http rows without matching network evidence.

  - match:
      azul_feature: family
    action: annotate_only
    target:
      namespace: enrichment.azul.family
    rationale: >
      Malware family attribution from Azul is supplementary context; the
      authoritative CAR object is the file or process observed on the host.

  - match:
      azul_feature: config
    action: annotate_only
    target:
      namespace: enrichment.azul.config
    rationale: >
      Extracted malware configuration data is enrichment. Promote individual
      config values to CAR fields only when independently corroborated.
```

### 4.4 Proposed STIX-sketch: Azul enrichment relationship

The following is a minimal STIX 2.1 bundle showing how an Azul enrichment result
relates to a CAR file object. The CAR observation remains the primary authoritative
record; the Azul result is a `note` referencing it.

```json
{
  "type": "bundle",
  "id": "bundle--00000000-0000-4000-8000-000000000001",
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
      "x_piiat_source_host": "HOSTNAME",
      "x_piiat_guid": "GUID-FROM-CAR-STORE"
    },
    {
      "type": "file",
      "spec_version": "2.1",
      "id": "file--00000000-0000-4000-8000-000000000003",
      "hashes": { "SHA-256": "<sha256>" },
      "name": "payload.bin"
    },
    {
      "type": "malware",
      "spec_version": "2.1",
      "id": "malware--00000000-0000-4000-8000-000000000004",
      "created": "2026-08-31T00:00:00.000Z",
      "modified": "2026-08-31T00:00:00.000Z",
      "name": "Family identified by Azul enrichment",
      "is_family": true,
      "sample_refs": ["file--00000000-0000-4000-8000-000000000003"]
    },
    {
      "type": "note",
      "spec_version": "2.1",
      "id": "note--00000000-0000-4000-8000-000000000005",
      "created": "2026-08-31T00:00:00.000Z",
      "modified": "2026-08-31T00:00:00.000Z",
      "content": "Azul enrichment result: family classification and ATT&CK feature extracted from binary payload. Treat as supplementary annotation only until corroborated by timeline evidence.",
      "object_refs": [
        "observed-data--00000000-0000-4000-8000-000000000002",
        "malware--00000000-0000-4000-8000-000000000004"
      ]
    }
  ]
}
```

The pattern: **CAR event/object = primary observation; Azul output = annotating note**.
Only promote an Azul-derived value into a first-class CAR row when independent evidence
confirms it. This preserves the DX_DFIR discipline: native evidence first, null when
unknown, explicit distinction between definitive and heuristic relationships.
([docs/CAR-Relations.md](../../docs/CAR-Relations.md),
[docs/CAR-Pipeline.md](../../docs/CAR-Pipeline.md))

---

## 5. Contribution opportunities

| Area | Opportunity | Azul entry point |
|---|---|---|
| STIX export | Azul maintainers have stated STIX is a future direction; a PIIAT-informed STIX export plugin could be contributed back | [Issue #4 maintainer comment](https://github.com/AustralianCyberSecurityCentre/azul/issues/4#issuecomment-3949198963) |
| DFIR timeline enrichment plugin | An `azul-runner` plugin that accepts a Plaso-output file artefact and emits CAR-aligned features | [azul-runner README](https://github.com/AustralianCyberSecurityCentre/azul-runner/blob/main/README.md) |
| OpenSearch index templates | Contribute tested CAR-object index templates to the Azul ecosystem as a reference for DFIR use cases | [azul-metastore README](https://github.com/AustralianCyberSecurityCentre/azul-metastore/blob/main/README.md) |
| Contributing docs | Azul docs say pull requests are welcome | [Azul contributing](https://github.com/AustralianCyberSecurityCentre/azul-docs/blob/main/docs/developer-guide/01-contributing.md) |

---

## 6. Recommended third-party repos to pin

If vendoring Azul components, prioritise these repositories under `third_party/`:

| Repo | Pin rationale |
|---|---|
| `azul-bedrock` | Core schemas; stable reference for provenance and feature typing |
| `azul-runner` | Plugin SDK; needed if writing a PIIAT enrichment plugin |
| `azul-metastore` | Storage layer reference; informs OpenSearch index design |
| `azul-restapi-server` | API surface; needed for scripted CAR export or enrichment retrieval |
| `azul-client` | Ready-made client for scripted Azul submissions from DX_DFIR workflows |

References:
- [azul-bedrock](https://github.com/AustralianCyberSecurityCentre/azul-bedrock)
- [azul-runner](https://github.com/AustralianCyberSecurityCentre/azul-runner)
- [azul-metastore](https://github.com/AustralianCyberSecurityCentre/azul-metastore)
- [azul-restapi-server](https://github.com/AustralianCyberSecurityCentre/azul-restapi-server)
- [azul-client](https://github.com/AustralianCyberSecurityCentre/azul-client)

---

## 7. KQL deprecation path

If the ADX emulator is superseded by OpenSearch:

1. Archive `kusto/` as `docs/research/legacy/kusto/` to preserve the schema
   definitions as reference material.
2. Keep `40-mitre.kql` as the authoritative field list from which OpenSearch index
   templates are generated; do not hand-edit the templates independently.
3. Update `python/get_sybers_dfir/ingest/kusto.py` to either delegate to an OpenSearch
   ingest module or be retired with a deprecation notice.
4. Update `docker-compose.yml` to remove the ADX emulator service once the OpenSearch
   path is validated end-to-end.
5. Remove the `--backend kusto` flag from `cli.py` after a deprecation cycle.

The test suite in `python/tests/test_ingest.py` must be updated to cover the
OpenSearch path before the Kusto path is removed.
([test_ingest.py](../../python/tests/test_ingest.py))

---

## 8. Summary table

| Phase | Scope | Risk | Prerequisite |
|---|---|---|---|
| 1 — log2timeline elastic output | Switch `psort` output flag; update `plaso.py` | Low | Reachable Elasticsearch/OpenSearch endpoint |
| 2 — CAR JSONL → SOF-ELK pipeline | New Filebeat input + Logstash config + index templates | Low-medium | Phase 1 optional |
| 3 — Replace KQL ingest harness | New `run_car_elastic()` + `--backend elastic` CLI flag | Medium | Phase 2 validated |
| 4 — Add Kafka | New compose service + Logstash Kafka pipeline | High | Phase 3 stable |
| 5 — Azul enrichment tier | `azul-client` submissions from DX_DFIR; enrichment bridge policy | Low-medium (parallel) | Azul instance reachable |
| KQL deprecation | Archive kusto/; remove ADX container | Medium | Phase 3 validated |

---

## Related documents

- [PIIAT-MitreCar: Optional Azul-style Logstash/Kafka/OpenSearch path](https://github.com/Get-Sybers/PIIAT-MitreCar/blob/main/docs/research/ideas/optional-azul-elastic-path.md)
- [PIIAT-MitreCar: Azul research](https://github.com/Get-Sybers/PIIAT-MitreCar/blob/main/docs/research/ideas/azul.md)
- [PIIAT-MitreCar issue #26](https://github.com/Get-Sybers/PIIAT-MitreCar/issues/26)
- [DX_DFIR issue #101](https://github.com/Get-Sybers/DX_DFIR/issues/101)
- [docs/CAR-Pipeline.md](../../docs/CAR-Pipeline.md)
- [docs/CAR-Relations.md](../../docs/CAR-Relations.md)
- [kusto/schema/40-mitre.kql](../../kusto/schema/40-mitre.kql)
- [docker/sof-elk/docker-compose.yml](../../docker/sof-elk/docker-compose.yml)
- [python/get_sybers_dfir/plaso.py](../../python/get_sybers_dfir/plaso.py)
- [python/get_sybers_dfir/ingest/__init__.py](../../python/get_sybers_dfir/ingest/__init__.py)
