"""Minimal client for the Kusto emulator's REST endpoints.

The emulator has no auth (it binds to localhost), so there is no token handling.
Kusto routes by request type: ``/v1/rest/mgmt`` for control commands (leading
``.``) and ``/v1/rest/query`` for KQL — a ``.`` command sent to the query endpoint
is rejected. The engine returns HTTP 200 with an error *document* on failure, so
the status code proves nothing — :func:`failed` inspects the body (error envelope,
a per-row ``Result="Failed"``, a non-JSON body, or no body at all).
"""
from __future__ import annotations

import json
import urllib.error
import urllib.request

_TIMEOUT = 600


def failed(resp: str) -> bool:
    """True if a Kusto response is a failure (envelope, per-row Failed, non-JSON,
    or empty)."""
    if not resp or not resp.strip():
        return True                         # no response = failure
    try:
        d = json.loads(resp)
    except (json.JSONDecodeError, ValueError):
        return True                         # not JSON at all = failure

    def walk(o) -> bool:
        if isinstance(o, dict):
            for k, v in o.items():
                if k in ("error", "OneApiErrors", "Errors"):
                    return True
                if k == "@type" and isinstance(v, str) and v.startswith("Kusto"):
                    return True
                if k in ("Result", "Status") and isinstance(v, str) and v.lower() in ("failed", "error"):
                    return True
                if k == "HasErrors" and v in (True, "true", "True"):
                    return True
                if walk(v):
                    return True
        elif isinstance(o, list):
            for v in o:
                if walk(v):
                    return True
        return False

    def tables(doc) -> bool:
        for t in (doc.get("Tables", []) if isinstance(doc, dict) else []):
            cols = [c.get("ColumnName") for c in t.get("Columns", [])]
            for row in t.get("Rows", []) or []:
                for name, val in zip(cols, row):
                    if name in ("Result", "Status") and isinstance(val, str) and val.lower() in ("failed", "error"):
                        return True
                    if name == "HasErrors" and val in (True, "true", "True"):
                        return True
        return False

    return walk(d) or tables(d)


def error_message(resp: str) -> str:
    """A human-readable message pulled from a failure response."""
    try:
        d = json.loads(resp)
    except (json.JSONDecodeError, ValueError):
        return (resp.strip() or "(empty response — engine unreachable?)")[:400]

    def find(o):
        if isinstance(o, dict):
            for k in ("message", "@message", "Reason", "description"):
                v = o.get(k)
                if isinstance(v, str) and v:
                    return v
            for v in o.values():
                r = find(v)
                if r:
                    return r
        elif isinstance(o, list):
            for v in o:
                r = find(v)
                if r:
                    return r
        return None

    return find(d) or json.dumps(d)[:400]


class KustoClient:
    """POST control/query commands to the emulator."""

    def __init__(self, host: str = "127.0.0.1", port: int = 8080, container: str = "kusto-emulator"):
        self.base = f"http://{host}:{port}"
        self.container = container

    def _post(self, path: str, db: str, csl: str) -> str:
        body = json.dumps({"db": db, "csl": csl}).encode("utf-8")
        req = urllib.request.Request(
            self.base + path, data=body,
            headers={"Content-Type": "application/json"}, method="POST",
        )
        try:
            with urllib.request.urlopen(req, timeout=_TIMEOUT) as r:
                return r.read().decode("utf-8", "replace")
        except urllib.error.HTTPError as e:                # engine 4xx/5xx: body still useful
            try:
                return e.read().decode("utf-8", "replace")
            except OSError:
                return ""
        except (urllib.error.URLError, OSError):           # unreachable / timeout = no response
            return ""

    def mgmt(self, db: str, csl: str) -> str:
        return self._post("/v1/rest/mgmt", db, csl)

    def query(self, db: str, csl: str) -> str:
        return self._post("/v1/rest/query", db, csl)

    def reachable(self) -> bool:
        """Is the ENGINE up (not just something on the port)?"""
        resp = self.mgmt("NetDefaultDB", ".show version")
        if failed(resp):
            return False
        return '"Tables"' in resp or '"Rows"' in resp
