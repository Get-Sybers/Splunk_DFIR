"""CTI in, sightings out — the OpenCTI wiring around Elastic's indicator match.

OpenCTI stays an exchange interface (decision D4); the matching is Elastic's
own. Two verbs, both behind the stubbed-transport client of :mod:`..opencti`:

- :func:`run_pull` — OpenCTI's STIX 2.1 indicators -> ``cti-*`` documents
  (Elasticsearch ``_bulk`` lines) with their atomics under ECS
  ``threat.indicator.*``, which the Detection Engine's indicator-match rule
  (``detect/rules/cti/cti-indicator-match.yml``) reads (:mod:`.indicators`;
  the field mapping is ``pattern-mapping.yml``, the index shape
  ``cti.index-template.json``).
- :func:`run_sightings` — indicator-match alerts -> STIX ``sighting`` objects
  of the platform's own indicators, pushed back (:mod:`.sightings`).
"""
from .indicators import (
    INDEX_TEMPLATE, PATTERN_MAPPING, PatternMapping, bulk_lines, load_pattern_mapping, load_template,
    parse_pattern, run_pull, template_fields, to_cti_doc, to_cti_docs, validate_pattern_mapping,
    validate_template,
)
from .sightings import alert_sightings, build_sightings_bundle, enrichments, read_alerts, run_sightings

__all__ = [
    "INDEX_TEMPLATE", "PATTERN_MAPPING", "PatternMapping", "alert_sightings", "build_sightings_bundle",
    "bulk_lines", "enrichments", "load_pattern_mapping", "load_template", "parse_pattern", "read_alerts",
    "run_pull", "run_sightings", "template_fields", "to_cti_doc", "to_cti_docs",
    "validate_pattern_mapping", "validate_template",
]
