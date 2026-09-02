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
`DXDFIR_STIX_TLP`, `DXDFIR_STIX_RULES_DIR`) < flags. See
[`config.py`](config.py) for the file shape.

```bash
cd python && python -m pytest tests/test_stix_export.py
```
