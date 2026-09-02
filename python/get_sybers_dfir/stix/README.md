# STIX 2.1 exchange (`dxdfir stix`)

The exchange interface of Byakugan: detections out as STIX 2.1, PIIAT's STIX
projection passed through, OpenCTI as the wire. The engine stays Elastic; this
package never imports PIIAT and never re-derives what PIIAT already projected.

```bash
dxdfir stix export --hits detections.jsonl --out bundle.json
dxdfir stix export --hits alerts.json --bundle piiat-case.json --case CASE-17 --push
```

## What a hit becomes

| hit field | STIX |
|---|---|
| `DetectionId` / `rule.id` / `detection.id` / `kibana.alert.rule.rule_id` | `indicator` (one per rule, global id); `pattern` = the rule from `--rules-dir` (`<id>.yml` `query` + `language`), else a reference pattern naming the detection |
| `AttackIds` / `threat.technique.id` / `kibana.alert.rule.threat` | `attack-pattern` per technique (`mitre-attack` external reference) + `indicator --indicates--> attack-pattern` SRO labelled `declared` |
| the row itself | `sighting` of the indicator (case-scoped id); `first_seen`/`last_seen` = the hit time; identical rows collapse into one sighting with `count` |
| `host.name` / `Details.Computer` | `identity` (`identity_class: system`) in `where_sighted_refs` |
| `source.ip` / `destination.ip` / an `"A -> B:port"` entity | `ipv4-addr` / `ipv6-addr` SCOs with the spec's deterministic ids, wrapped in an `observed-data` the sighting references |
| `file.name` / `file.hash.*` | `file` SCO (id over one hash, MD5 > SHA-1 > SHA-256 > SHA-512, and the name) |
| `event.id` (the CAR guid) | `sighting.x_dxdfir.car_guid` — the pointer back to the CAR row |
| everything else | `sighting.x_dxdfir.{run_id, detection_id, severity, source, entity, details}` |

Inputs (`--hits`, repeatable): `dxdfir detect --jsonl-out` JSON Lines, a JSON
array, a single document, or an Elasticsearch `_search` response
(`hits.hits[]._source`). Documents that name no detection are skipped and
counted, never guessed.

## Ids (decision D4)

- **Global, content-keyed**: indicator (by detection id), attack-pattern (by
  technique id), identities, relationships, and every SCO (STIX 2.1 §2.9 —
  uuid5 under the SCO namespace over the id-contributing properties, so any
  conformant producer derives the same id for the same address or hash).
- **Case-scoped**: sighting and observed-data — uuid5 under a namespace derived
  from `--case` (default: the hits' run id). Re-exporting a case is idempotent;
  two cases never collide.

## Pass-through (`--bundle`, repeatable)

PIIAT projects its CAR stores (car.db + superset.db + native) to STIX itself —
SCOs, observed-data, and SROs for both relationship classes, labelled
`declared` / `derived`. A PIIAT bundle is merged object-for-object with ids
untouched; a duplicate id keeps the newest `modified`. The summary counts
relationships per class.

## Output and OpenCTI

`--out` (or config `out`) writes the bundle; without either it goes to stdout
and the summary to stderr. `--push` uploads the same bundle through
[`opencti.py`](opencti.py): endpoint and token come from `DXDFIR_OPENCTI_URL` /
`DXDFIR_OPENCTI_TOKEN` (or `opencti.url` / `opencti.token` in a `--config`
JSON/YAML file that is **not committed**). There is deliberately no `--token`
flag. The transport is an interface (`post(url, headers, body, timeout)`), so
the push is tested with a stub and no platform — see
[`test_stix_export.py`](../../tests/test_stix_export.py).

Config precedence: file < environment (`DXDFIR_OPENCTI_URL`,
`DXDFIR_OPENCTI_TOKEN`, `DXDFIR_OPENCTI_CONNECTOR_ID`, `DXDFIR_STIX_CASE`,
`DXDFIR_STIX_TLP`, `DXDFIR_STIX_RULES_DIR`, `DXDFIR_CTI_INDEX`) < flags. See
[`config.py`](config.py) for the file shape.

## CTI: OpenCTI indicators in, sightings back out (`pull` / `sightings`)

OpenCTI stays the wire; the matching is Elastic's own indicator-match rule.
The CTI direction runs through the same client and the same stubbed transport:

```bash
dxdfir stix pull --out cti.ndjson [--since 2026-08-01T00:00:00Z] [--bundle-out pulled.json]
curl -sS -XPOST "$ES/_bulk" -H 'Content-Type: application/x-ndjson' --data-binary @cti.ndjson
dxdfir stix sightings --alerts alerts.json --case CASE-17 --push
```

1. **Pull** — `OpenCTIClient.pull_indicators()` pages the platform's STIX 2.1
   indicators (with the markings and creator identities they reference) into
   one bundle; `--since` makes it incremental (`modified` after the watermark).
2. **Copy** — [`cti/indicators.py`](cti/indicators.py) breaks every pattern
   into its `=` comparisons and lands each value under the ECS
   `threat.indicator.*` field that [`cti/pattern-mapping.yml`](cti/pattern-mapping.yml)
   names (`[ipv4-addr:value = '…']` -> `threat.indicator.ip`,
   `file:hashes.'SHA-256'` -> `threat.indicator.file.hash.sha256`, …), plus
   `threat.indicator.{id,type,name,confidence,provider,marking.tlp,…}`,
   `stix.{pattern,valid_from,valid_until,revoked,…}` and
   `opencti.{id,score,detection}`. Out come `_bulk` lines keyed on the STIX id
   (`_id`, so a re-pull upserts) for the `cti-*` index that
   [`cti/cti.index-template.json`](cti/cti.index-template.json) describes
   (`PUT _index_template/cti`; strict mapping — the copy refuses to emit a
   field the template does not map). YARA/Sigma patterns, CIDRs and unmapped
   observables are skipped and counted. `--from-bundle` normalises an
   already-pulled bundle offline, no platform needed.
3. **Match** — the indicator-match rule
   [`detect/rules/cti/cti-indicator-match.yml`](../detect/rules/cti/cti-indicator-match.yml)
   compares `logs-dfir.*` / `logs-car.*` evidence fields with `threat.indicator.*`
   (`threat_mapping`); its alerts carry `threat.enrichments[]` — the indicator's
   fields and `matched.{field,atomic,id,index}`.
4. **Sightings back** — [`cti/sightings.py`](cti/sightings.py) turns those
   alerts into one `sighting` per (indicator, host, matched value) whose
   `sighting_of_ref` is the platform's own indicator id (the indicator is not
   re-emitted), the matched value as the spec's SCO in an `observed-data`, the
   host as `where_sighted_refs`, alerts of the same match collapsed into
   `count`; case-scoped ids, pushed through `push_bundle`.

`cti.index` / `DXDFIR_CTI_INDEX` / `--index` names the concrete `cti-*` index
the bulk lines target (default `cti-opencti`). Both verbs are exercised in
[`test_cti.py`](../../tests/test_cti.py) against recording transports — no
platform, no Elasticsearch, no secrets.

```bash
cd python && python -m pytest tests/test_stix_export.py tests/test_cti.py
```
