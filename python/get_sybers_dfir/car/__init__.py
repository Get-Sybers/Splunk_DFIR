"""CAR normalization for DX_DFIR — the materialized MITRE CAR data model (epic #86).

The pipeline-wide application of the PIIAT-Mem approach: an owned normalization
stage turns each artefact's raw records into finished **MITRE CAR** events and
emits JSON, which ADX ingests as new `mitre.car_*` tables — so the query layer
just reads the model instead of re-deriving it. The mapping engine (markers +
`normalize`) and the `carmodel` loader are the same design proven in PIIAT-Mem
v1.0.0; the memory artefact reuses PIIAT-Mem's already-finished CAR directly.

`car_data_model.json` (repo root, MITRE's authoritative 13-object model) is the
single source of truth for objects / actions / properties.
"""
