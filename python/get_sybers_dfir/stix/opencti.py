"""OpenCTI exchange client — a scaffold: one call, one interface, no secrets.

OpenCTI is an EXCHANGE interface only (D4): the engine stays Elastic, and all
this client does is hand a finished STIX 2.1 bundle to the platform. It speaks
the platform's GraphQL bundle-push mutation over HTTPS with a bearer token.

The network call sits behind :class:`Transport` (``post(url, headers, body,
timeout) -> (status, text)``). :class:`UrllibTransport` is the stdlib default;
a test passes a recording stub and asserts the exact request — endpoint,
``Authorization`` header, serialised bundle — without a platform. Endpoint and
token are constructor arguments that the caller sources from the environment
or a config file (:mod:`.config`); nothing here knows a real URL or token, and
:class:`OpenCTIClient` never echoes the token (``repr`` masks it, results omit
it).
"""
from __future__ import annotations

import json
import urllib.error
import urllib.request
from collections.abc import Mapping
from dataclasses import asdict, dataclass
from typing import Protocol

from .objects import DEFAULT_PRODUCER, global_id

DEFAULT_TIMEOUT = 60.0

# The platform's bundle-push mutation, kept in one place: the scaffold pins the
# exchange interface, not a particular OpenCTI schema revision — adjust here.
GRAPHQL_MUTATION = """\
mutation DxdfirStixBundlePush($connectorId: String!, $bundle: String!) {
  stixBundlePush(connectorId: $connectorId, bundle: $bundle)
}"""


class Transport(Protocol):
    """The one network primitive the client needs."""

    def post(self, url: str, headers: Mapping[str, str], body: bytes,
             timeout: float) -> tuple[int, str]: ...


class UrllibTransport:
    """POST with the standard library. ``(status, body)``; a transport-level
    failure (unreachable, timeout) is ``(0, reason)`` — never an exception."""

    def post(self, url: str, headers: Mapping[str, str], body: bytes,
             timeout: float) -> tuple[int, str]:
        req = urllib.request.Request(url, data=body, headers=dict(headers), method="POST")
        try:
            with urllib.request.urlopen(req, timeout=timeout) as resp:   # noqa: S310 — https to a configured endpoint
                return resp.status, resp.read().decode("utf-8", "replace")
        except urllib.error.HTTPError as e:
            try:
                return e.code, e.read().decode("utf-8", "replace")
            except OSError:
                return e.code, ""
        except (urllib.error.URLError, OSError, ValueError) as e:
            return 0, str(getattr(e, "reason", e))


@dataclass
class PushResult:
    ok: bool
    status: int
    message: str
    objects: int
    response: dict | None = None

    def as_dict(self) -> dict:
        return asdict(self)


def graphql_url(endpoint: str) -> str:
    base = endpoint.strip().rstrip("/")
    return base if base.endswith("/graphql") else base + "/graphql"


def default_connector_id(producer: str = DEFAULT_PRODUCER) -> str:
    """The connector id the push is attributed to when none is configured —
    deterministic, so it can be registered once on the platform."""
    return global_id("connector", "opencti", producer).split("--", 1)[1]


class OpenCTIClient:
    def __init__(self, url: str | None, token: str | None, *, connector_id: str | None = None,
                 transport: Transport | None = None, timeout: float = DEFAULT_TIMEOUT):
        if not url:
            raise ValueError("OpenCTI endpoint is not configured (DXDFIR_OPENCTI_URL / opencti.url)")
        if not token:
            raise ValueError("OpenCTI token is not configured (DXDFIR_OPENCTI_TOKEN / opencti.token)")
        self.url = graphql_url(url)
        self.connector_id = connector_id or default_connector_id()
        self.timeout = float(timeout)
        self._token = token
        self._transport: Transport = transport or UrllibTransport()

    def __repr__(self) -> str:
        return f"OpenCTIClient(url={self.url!r}, connector_id={self.connector_id!r}, token='***')"

    def request(self, bundle: dict) -> tuple[str, dict[str, str], bytes]:
        """The exact ``(url, headers, body)`` a push sends — pure, for tests."""
        payload = {
            "query": GRAPHQL_MUTATION,
            "variables": {
                "connectorId": self.connector_id,
                "bundle": json.dumps(bundle, ensure_ascii=False, separators=(",", ":"), default=str),
            },
        }
        headers = {"Authorization": f"Bearer {self._token}",
                   "Content-Type": "application/json", "Accept": "application/json"}
        return self.url, headers, json.dumps(payload, ensure_ascii=False).encode("utf-8")

    def push_bundle(self, bundle: dict) -> PushResult:
        """Upload ``bundle``; the result says whether the platform accepted it."""
        n = len(bundle.get("objects") or [])
        url, headers, body = self.request(bundle)
        status, text = self._transport.post(url, headers, body, self.timeout)
        if status == 0:
            return PushResult(False, 0, f"OpenCTI unreachable at {url}: {text or 'no response'}", n)
        if status in (401, 403):
            return PushResult(False, status, "OpenCTI rejected the token (check DXDFIR_OPENCTI_TOKEN)", n)
        try:
            doc = json.loads(text) if text.strip() else {}
        except ValueError:
            doc = None
        if status != 200 or not isinstance(doc, dict):
            return PushResult(False, status, f"OpenCTI HTTP {status}: {(text or '').strip()[:300]}", n)
        errors = doc.get("errors")
        if errors:
            first = errors[0] if isinstance(errors, list) and errors else errors
            msg = first.get("message", str(first)) if isinstance(first, dict) else str(first)
            return PushResult(False, status, f"OpenCTI refused the bundle: {msg}", n, doc)
        return PushResult(True, status, f"pushed {n} object(s) to {url}", n, doc)
