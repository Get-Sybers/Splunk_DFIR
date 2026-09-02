"""Export configuration: file < environment < explicit overrides.

Secrets never live in the tree: the OpenCTI endpoint and token are read from
the environment (``DXDFIR_OPENCTI_URL`` / ``DXDFIR_OPENCTI_TOKEN``) or from an
operator-held config file (JSON or YAML) that is not committed. The CLI has no
``--token`` flag on purpose — a flag lands in shell history and ``ps``.

Config file shape (every key optional)::

    case: CASE-2026-017          # scopes the observation ids (default: the run id)
    producer: DX_DFIR
    tlp: amber                   # white | green | amber | red | none
    out: exchange/bundle.json
    rules_dir: python/get_sybers_dfir/detect/rules
    push: false
    timeout: 60
    opencti:
      url: https://opencti.example.internal
      token: ...                 # prefer DXDFIR_OPENCTI_TOKEN
      connector_id: ...          # optional; a deterministic default otherwise
"""
from __future__ import annotations

import json
import os
from collections.abc import Mapping
from dataclasses import asdict, dataclass

import yaml

from .objects import DEFAULT_PRODUCER

ENV_URL = "DXDFIR_OPENCTI_URL"
ENV_TOKEN = "DXDFIR_OPENCTI_TOKEN"
ENV_CONNECTOR_ID = "DXDFIR_OPENCTI_CONNECTOR_ID"
ENV_CASE = "DXDFIR_STIX_CASE"
ENV_TLP = "DXDFIR_STIX_TLP"
ENV_RULES_DIR = "DXDFIR_STIX_RULES_DIR"

_ENV_KEYS = {ENV_URL: "opencti_url", ENV_TOKEN: "opencti_token",
             ENV_CONNECTOR_ID: "opencti_connector_id", ENV_CASE: "case_id",
             ENV_TLP: "tlp", ENV_RULES_DIR: "rules_dir"}
_FILE_KEYS = {"case": "case_id", "case_id": "case_id", "producer": "producer", "tlp": "tlp",
              "out": "out", "rules_dir": "rules_dir", "push": "push", "timeout": "timeout",
              "opencti_url": "opencti_url", "opencti_token": "opencti_token",
              "opencti_connector_id": "opencti_connector_id"}
_OPENCTI_KEYS = {"url": "opencti_url", "token": "opencti_token", "connector_id": "opencti_connector_id"}


@dataclass
class StixConfig:
    case_id: str | None = None
    producer: str = DEFAULT_PRODUCER
    tlp: str | None = "amber"
    out: str | None = None
    rules_dir: str | None = None
    push: bool = False
    timeout: float = 60.0
    opencti_url: str | None = None
    opencti_token: str | None = None
    opencti_connector_id: str | None = None

    def redacted(self) -> dict:
        """For summaries and logs: the token is only ever shown as present/absent."""
        d = asdict(self)
        d["opencti_token"] = "***" if self.opencti_token else None
        return d


def _read_file(path: str) -> dict:
    with open(path, encoding="utf-8") as fh:
        text = fh.read()
    if path.lower().endswith((".yml", ".yaml")):
        try:
            doc = yaml.safe_load(text)
        except yaml.YAMLError as e:
            raise ValueError(f"{path}: invalid YAML: {e}") from e
    else:
        try:
            doc = json.loads(text) if text.strip() else {}
        except json.JSONDecodeError as e:
            raise ValueError(f"{path}: invalid JSON: {e}") from e
    if doc is None:
        return {}
    if not isinstance(doc, dict):
        raise ValueError(f"{path}: config must be a mapping")
    out: dict = {}
    for k, v in doc.items():
        if k == "opencti" and isinstance(v, dict):
            out.update({_OPENCTI_KEYS[kk]: vv for kk, vv in v.items() if kk in _OPENCTI_KEYS})
        elif k in _FILE_KEYS:
            out[_FILE_KEYS[k]] = v
    return out


def load_config(path: str | None = None, env: Mapping[str, str] | None = None,
                **overrides) -> StixConfig:
    """Layered: the file (if any) < ``env`` (``os.environ`` by default) <
    ``overrides`` whose value is not ``None``."""
    values: dict = {}
    if path:
        values.update(_read_file(str(path)))
    env = os.environ if env is None else env
    for var, key in _ENV_KEYS.items():
        v = env.get(var)
        if v not in (None, ""):
            values[key] = v
    values.update({k: v for k, v in overrides.items() if v is not None})
    cfg = StixConfig()
    for k, v in values.items():
        if not hasattr(cfg, k):
            raise ValueError(f"unknown config key {k!r}")
        setattr(cfg, k, v)
    cfg.push = _truthy(cfg.push)
    cfg.timeout = float(cfg.timeout)
    if cfg.tlp is not None:
        cfg.tlp = str(cfg.tlp).lower()
    for k in ("case_id", "out", "rules_dir", "opencti_url", "opencti_token", "opencti_connector_id"):
        v = getattr(cfg, k)
        if v is not None:
            setattr(cfg, k, str(v))
    return cfg


def _truthy(v) -> bool:
    if isinstance(v, bool):
        return v
    return str(v).strip().lower() in ("1", "true", "yes", "on")
