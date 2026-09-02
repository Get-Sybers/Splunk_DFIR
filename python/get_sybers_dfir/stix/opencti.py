"""OpenCTI exchange client — two calls, one interface, no secrets.

OpenCTI is an EXCHANGE interface only (D4): the engine stays Elastic. This
client does exactly two things with the platform's GraphQL API over HTTPS with
a bearer token: it hands a finished STIX 2.1 bundle to the platform
(``push_bundle`` — sightings and indicators out), and it pulls the platform's
STIX 2.1 indicators back as a bundle (``pull_indicators`` — CTI in, which
:mod:`.cti.indicators` then copies into the ``cti-*`` index for Elastic's
indicator match).

The network call sits behind :class:`Transport` (``post(url, headers, body,
timeout) -> (status, text)``). :class:`UrllibTransport` is the stdlib default;
a test passes a recording stub and asserts the exact request — endpoint,
``Authorization`` header, serialised bundle or query — without a platform.
Endpoint and token are constructor arguments that the caller sources from the
environment or a config file (:mod:`.config`); nothing here knows a real URL or
token, and :class:`OpenCTIClient` never echoes the token (``repr`` masks it,
results omit it).
"""
from __future__ import annotations

import json
import urllib.error
import urllib.request
from collections.abc import Mapping
from dataclasses import asdict, dataclass
from typing import Protocol
from urllib.parse import urlparse

from .objects import DEFAULT_PRODUCER, SPEC_VERSION, global_id, stix_timestamp

DEFAULT_TIMEOUT = 60.0
DEFAULT_PAGE_SIZE = 200

# The platform's bundle-push mutation, kept in one place: the scaffold pins the
# exchange interface, not a particular OpenCTI schema revision — adjust here.
GRAPHQL_MUTATION = """\
mutation DxdfirStixBundlePush($connectorId: String!, $bundle: String!) {
  stixBundlePush(connectorId: $connectorId, bundle: $bundle)
}"""

# The indicator pull: the STIX 2.1 indicator properties plus the marking and
# creator objects they reference, paged by cursor in ``modified`` order so an
# incremental pull (``--since``) resumes where the last one ended. Same rule as
# the mutation — one schema revision (6.x list fields) pinned here, and
# :func:`node_to_indicator` reads both the list and the ``edges`` shapes.
GRAPHQL_INDICATORS_QUERY = """\
query DxdfirIndicators($first: Int!, $after: ID, $filters: FilterGroup) {
  indicators(first: $first, after: $after, filters: $filters, orderBy: modified, orderMode: asc) {
    edges {
      node {
        id
        standard_id
        name
        description
        pattern
        pattern_type
        valid_from
        valid_until
        revoked
        confidence
        created
        modified
        indicator_types
        x_opencti_score
        x_opencti_detection
        x_opencti_main_observable_type
        objectLabel { value }
        objectMarking { standard_id definition_type definition created }
        createdBy { standard_id name identity_class created modified }
        externalReferences { edges { node { source_name url external_id } } }
        killChainPhases { kill_chain_name phase_name }
      }
    }
    pageInfo { endCursor hasNextPage globalCount }
  }
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


@dataclass
class PullResult:
    ok: bool
    status: int
    message: str
    indicators: int                 # distinct indicators pulled
    pages: int = 0
    skipped: int = 0                # nodes without a STIX id / pattern
    bundle: dict | None = None      # the indicators + the markings / identities they reference

    def as_dict(self) -> dict:
        """For summaries: the bundle is counted, not repeated."""
        return {"ok": self.ok, "status": self.status, "message": self.message,
                "indicators": self.indicators, "pages": self.pages, "skipped": self.skipped,
                "bundle_id": self.bundle["id"] if self.bundle else None,
                "objects": len(self.bundle["objects"]) if self.bundle else 0}


def graphql_url(endpoint: str) -> str:
    base = endpoint.strip().rstrip("/")
    # Refuse a non-HTTPS endpoint up front: the client sends a bearer token, and
    # http:// (or a schemeless URL) would put it on the wire in cleartext.
    scheme = urlparse(base).scheme.lower()
    if scheme != "https":
        raise ValueError(
            "OpenCTI endpoint must be https:// (refusing to send the bearer token over "
            f"{scheme or 'a schemeless URL'}): {endpoint!r}")
    return base if base.endswith("/graphql") else base + "/graphql"


def default_connector_id(producer: str = DEFAULT_PRODUCER) -> str:
    """The connector id the push is attributed to when none is configured —
    deterministic, so it can be registered once on the platform."""
    return global_id("connector", "opencti", producer).split("--", 1)[1]


def indicator_filters(since: str | None) -> dict | None:
    """The platform's filter group for an incremental pull — indicators
    ``modified`` after ``since`` — or ``None`` for everything. ``ValueError``
    when ``since`` is not a timestamp."""
    if since in (None, ""):
        return None
    ts = stix_timestamp(since)
    if not ts:
        raise ValueError(f"since must be a timestamp (e.g. 2026-01-01T00:00:00Z): {since!r}")
    return {"mode": "and", "filterGroups": [],
            "filters": [{"key": "modified", "values": [ts], "operator": "gt", "mode": "or"}]}


def _nodes(value) -> list[dict]:
    """The items of an OpenCTI list field, whichever shape the schema revision
    uses — a plain list, or a connection with ``edges[].node``."""
    if isinstance(value, dict):
        value = [e.get("node") for e in value.get("edges") or [] if isinstance(e, dict)]
    return [v for v in (value or []) if isinstance(v, dict)]


def node_to_indicator(node) -> tuple[dict | None, list[dict]]:
    """One ``indicators`` node -> ``(STIX 2.1 indicator, context objects)`` —
    the marking-definitions and creator identity it references, as minimal
    STIX objects — or ``(None, [])`` when the node has no STIX id or pattern.
    Platform-only properties ride along as ``x_opencti_*``."""
    if not isinstance(node, dict):
        return None, []
    sid, pattern = node.get("standard_id"), node.get("pattern")
    if not isinstance(sid, str) or not sid.startswith("indicator--") \
            or not isinstance(pattern, str) or not pattern.strip():
        return None, []
    context: list[dict] = []
    marking_refs: list[str] = []
    for m in _nodes(node.get("objectMarking")):
        mid = m.get("standard_id")
        if not isinstance(mid, str) or not mid.startswith("marking-definition--"):
            continue
        marking_refs.append(mid)
        dtype = str(m.get("definition_type") or "statement").lower()
        definition = str(m.get("definition") or "")
        marking = {"type": "marking-definition", "spec_version": SPEC_VERSION, "id": mid,
                   "definition_type": dtype, "name": definition}
        created = stix_timestamp(m.get("created"))
        if created:
            marking["created"] = created
        marking["definition"] = {"tlp": definition.split(":", 1)[-1].lower()} if dtype == "tlp" \
            else {"statement": definition}
        context.append(marking)
    created_by = None
    creator = node.get("createdBy")
    if isinstance(creator, dict) and isinstance(creator.get("standard_id"), str) \
            and creator["standard_id"].startswith("identity--"):
        created_by = creator["standard_id"]
        identity = {"type": "identity", "spec_version": SPEC_VERSION, "id": created_by,
                    "name": str(creator.get("name") or created_by),
                    "identity_class": str(creator.get("identity_class") or "unknown")}
        for k in ("created", "modified"):
            ts = stix_timestamp(creator.get(k))
            if ts:
                identity[k] = ts
        context.append(identity)

    ind: dict = {"type": "indicator", "spec_version": SPEC_VERSION, "id": sid}
    for k in ("created", "modified", "valid_from", "valid_until"):
        ts = stix_timestamp(node.get(k))
        if ts:
            ind[k] = ts
    if "valid_from" not in ind and "created" in ind:
        ind["valid_from"] = ind["created"]          # what the platform itself defaults to
    if created_by:
        ind["created_by_ref"] = created_by
    for k in ("name", "description"):
        if node.get(k) not in (None, ""):
            ind[k] = str(node[k])
    ind["pattern"] = pattern
    ind["pattern_type"] = str(node.get("pattern_type") or "stix")
    ind["revoked"] = bool(node.get("revoked"))
    if isinstance(node.get("confidence"), int) and not isinstance(node.get("confidence"), bool):
        ind["confidence"] = node["confidence"]
    types = [str(t) for t in (node.get("indicator_types") or []) if t]
    if types:
        ind["indicator_types"] = types
    labels = [str(lab["value"]) for lab in _nodes(node.get("objectLabel")) if lab.get("value")]
    if labels:
        ind["labels"] = labels
    if marking_refs:
        ind["object_marking_refs"] = marking_refs
    refs = [{k: str(r[k]) for k in ("source_name", "url", "external_id") if r.get(k)}
            for r in _nodes(node.get("externalReferences"))]
    refs = [r for r in refs if r.get("source_name")]
    if refs:
        ind["external_references"] = refs
    phases = [{"kill_chain_name": str(p["kill_chain_name"]), "phase_name": str(p["phase_name"])}
              for p in _nodes(node.get("killChainPhases")) if p.get("kill_chain_name") and p.get("phase_name")]
    if phases:
        ind["kill_chain_phases"] = phases
    if node.get("id") not in (None, ""):
        ind["x_opencti_id"] = str(node["id"])
    for k in ("x_opencti_score", "x_opencti_detection", "x_opencti_main_observable_type"):
        if node.get(k) is not None:
            ind[k] = node[k]
    return ind, context


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

    def _envelope(self, query: str, variables: dict) -> tuple[str, dict[str, str], bytes]:
        headers = {"Authorization": f"Bearer {self._token}",
                   "Content-Type": "application/json", "Accept": "application/json"}
        payload = {"query": query, "variables": variables}
        return self.url, headers, json.dumps(payload, ensure_ascii=False).encode("utf-8")

    def request(self, bundle: dict) -> tuple[str, dict[str, str], bytes]:
        """The exact ``(url, headers, body)`` a push sends — pure, for tests."""
        return self._envelope(GRAPHQL_MUTATION, {
            "connectorId": self.connector_id,
            "bundle": json.dumps(bundle, ensure_ascii=False, separators=(",", ":"), default=str),
        })

    def request_indicators(self, *, first: int = DEFAULT_PAGE_SIZE, after: str | None = None,
                           since: str | None = None) -> tuple[str, dict[str, str], bytes]:
        """The exact ``(url, headers, body)`` one page of the pull sends — pure."""
        return self._envelope(GRAPHQL_INDICATORS_QUERY, {
            "first": int(first), "after": after, "filters": indicator_filters(since)})

    def _graphql(self, url: str, headers: Mapping[str, str], body: bytes, *,
                 refused: str) -> tuple[int, dict | None, str | None]:
        """POST one GraphQL document; ``(status, response, error)`` — ``error``
        is the operator-facing reason when the call did not succeed (the
        transport failed, the token was rejected, the platform answered with
        errors), ``None`` when the response is usable."""
        status, text = self._transport.post(url, headers, body, self.timeout)
        if status == 0:
            return 0, None, f"OpenCTI unreachable at {url}: {text or 'no response'}"
        if status in (401, 403):
            return status, None, "OpenCTI rejected the token (check DXDFIR_OPENCTI_TOKEN)"
        try:
            doc = json.loads(text) if text.strip() else {}
        except ValueError:
            doc = None
        if status != 200 or not isinstance(doc, dict):
            return status, None, f"OpenCTI HTTP {status}: {(text or '').strip()[:300]}"
        errors = doc.get("errors")
        if errors:
            first = errors[0] if isinstance(errors, list) and errors else errors
            msg = first.get("message", str(first)) if isinstance(first, dict) else str(first)
            return status, doc, f"{refused}: {msg}"
        return status, doc, None

    def push_bundle(self, bundle: dict) -> PushResult:
        """Upload ``bundle``; the result says whether the platform accepted it."""
        n = len(bundle.get("objects") or [])
        url, headers, body = self.request(bundle)
        status, doc, error = self._graphql(url, headers, body, refused="OpenCTI refused the bundle")
        if error:
            return PushResult(False, status, error, n, doc)
        return PushResult(True, status, f"pushed {n} object(s) to {url}", n, doc)

    def pull_indicators(self, *, since: str | None = None, page_size: int = DEFAULT_PAGE_SIZE,
                        max_pages: int | None = None) -> PullResult:
        """Every indicator the platform holds (``modified`` after ``since`` when
        given), paged, as one STIX 2.1 bundle with the markings and identities
        they reference. ``max_pages`` is a safety valve — the result says when
        it stopped the pull short."""
        if page_size <= 0:
            raise ValueError(f"page_size must be a positive integer, got {page_size!r}")
        if max_pages is not None and max_pages <= 0:
            raise ValueError(f"max_pages must be a positive integer or None, got {max_pages!r}")
        objects: dict[str, dict] = {}
        after: str | None = None
        pages = skipped = count = status = 0
        truncated = False
        while True:
            url, headers, body = self.request_indicators(first=page_size, after=after, since=since)
            status, doc, error = self._graphql(url, headers, body, refused="OpenCTI refused the indicator query")
            if error:
                return PullResult(False, status, error, count, pages, skipped)
            data = doc.get("data") if isinstance(doc, dict) else None
            conn = data.get("indicators") if isinstance(data, dict) else None
            if not isinstance(conn, dict):
                return PullResult(False, status, "OpenCTI answered without an indicators connection "
                                  "(schema drift? see GRAPHQL_INDICATORS_QUERY)", count, pages, skipped)
            pages += 1
            for edge in conn.get("edges") or []:
                ind, context = node_to_indicator(edge.get("node") if isinstance(edge, dict) else None)
                if ind is None:
                    skipped += 1
                    continue
                if ind["id"] not in objects:
                    count += 1
                objects[ind["id"]] = ind
                for obj in context:
                    objects.setdefault(obj["id"], obj)
            info = conn.get("pageInfo") or {}
            if not info.get("hasNextPage") or not info.get("endCursor"):
                break
            if max_pages and pages >= max_pages:
                truncated = True
                break
            after = str(info["endCursor"])
        # Same derivation as export.bundle_id: the same content is the same bundle.
        bundle = {"type": "bundle", "id": global_id("bundle", *sorted(objects)), "objects": list(objects.values())}
        message = f"pulled {count} indicator(s) from {self.url} in {pages} page(s)"
        if truncated:
            message += f" — stopped at max_pages={max_pages}, more remain"
        return PullResult(True, status, message, count, pages, skipped, bundle)
