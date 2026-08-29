"""The per-artefact CAR map registry (epic #86).

Each submodule owns one artefact family and exports `MAPPINGS` and (optionally)
`PREDICATES`; this package aggregates them so the engine sees one registry.
Auto-discovery keeps parallel additions conflict-free — a new artefact port is a
new file, never an edit to a shared one. A duplicate artefact key or predicate
name across submodules is a hard error (silent shadowing would mis-map records).
"""
from __future__ import annotations

import importlib
import pkgutil

MAPPINGS: dict = {}
PREDICATES: dict = {}

for _mod_info in pkgutil.iter_modules(__path__):
    _mod = importlib.import_module(f"{__name__}.{_mod_info.name}")
    for _k, _v in getattr(_mod, "MAPPINGS", {}).items():
        if _k in MAPPINGS:
            raise ImportError(f"duplicate CAR artefact map {_k!r} in {_mod_info.name}")
        MAPPINGS[_k] = _v
    for _k, _v in getattr(_mod, "PREDICATES", {}).items():
        if _k in PREDICATES:
            raise ImportError(f"duplicate CAR predicate {_k!r} in {_mod_info.name}")
        PREDICATES[_k] = _v
