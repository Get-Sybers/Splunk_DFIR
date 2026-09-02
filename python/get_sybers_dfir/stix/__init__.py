"""STIX 2.1 exchange — sightings/indicators out of detections, OpenCTI as the wire.

The engine stays Elastic; this package is the EXCHANGE interface of Byakugan
(decision D4). It does two things and deliberately nothing else:

1. **Detection hits -> STIX.** Every detection firing becomes a ``sighting`` of
   an ``indicator`` (the rule), linked ``indicates`` -> ``attack-pattern`` for
   each ATT&CK technique the hit carries. Hits are read from ``dxdfir detect
   --jsonl-out`` (the ``misc.Detections`` envelope) or from Elastic documents —
   a Detection Engine alert, a query-stamped evidence line, a ``car-detections``
   lookup row, or a whole ``_search`` response (:mod:`.hits`).
2. **PIIAT bundles pass through.** PIIAT projects its CAR stores to STIX itself
   (SCOs / observed-data / SROs derived from car.db + superset.db + native, both
   relationship classes labelled ``declared`` / ``derived``). DX never re-derives
   them and never imports PIIAT: a PIIAT bundle is merged object-for-object,
   ids untouched, into the same output bundle (:mod:`.export`).

Ids follow D4: content-keyed objects (indicator, attack-pattern, identity,
relationship, every SCO) get spec-deterministic GLOBAL ids; observations
(sighting, observed-data) get CASE-scoped ids (:mod:`.objects`).

Output is config-driven (:mod:`.config`): a bundle file and an optional push to
OpenCTI through a thin client whose transport is an interface, so the exchange
is unit-testable without a live platform (:mod:`.opencti`). Endpoint and token
come from the environment / a config file, never from the tree.

    dxdfir stix export --hits detections.jsonl --bundle piiat.json --out bundle.json [--push]
"""
from .config import StixConfig, load_config
from .export import build_bundle, run_export, validate_bundle
from .hits import Hit, hit_from_document, read_hits
from .opencti import OpenCTIClient, PushResult, Transport

__all__ = [
    "Hit", "OpenCTIClient", "PushResult", "StixConfig", "Transport",
    "build_bundle", "hit_from_document", "load_config", "read_hits",
    "run_export", "validate_bundle",
]
