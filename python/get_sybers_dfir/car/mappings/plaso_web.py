"""Plaso browser/download evidence → CAR http (epic #86).

Endpoint-side records that a URL was REQUESTED — browser history, browser cache,
Java download cache. Per CAR-Relations, `hostname` here is the host the request
was seen ON (these artefacts live on the requesting endpoint, so the imaged
host IS the vantage — unlike a pcap, where it stays null).

All maps consume the wrapped l2t row {SourceImage, Timestamp, Parser, Record}
(field access via the payload(..., "Record") shorthand). Field shapes verified
against real M57 records:

- **msiecf (IE index.dat)** → http/get. Only `msiecf:url` rows at their
  "Last Visited Time" map (the visit event); Expiration rows and the url-less
  msiecf:leak / cached-object rows stay raw. History entries render the url as
  "Visited: <user>@<url>" — the real URL is extracted; a non-URL target
  (about:Home) honestly yields null url_domain/scheme.
- **firefox_cache** → http, action from the RECORDED request_method (GET/POST/
  PUT — others raw); response_status_code parsed from "HTTP/1.1 200 OK"; the
  cache prefixes url with "HTTP:" which is stripped.
- **firefox places page_visited (sqlite table)** → http/get: the visit record,
  with from_visit as the request_referrer (its " (host)" suffix stripped) —
  recorded client-side data, never proof of real navigation provenance.
- **java_idx** → http/get: a Java download-cache record; the server IP the
  cache recorded stays native (CAR http has no dest_ip field).
"""
from __future__ import annotations

from ..normalize import (basename, const, domain_of, ext, first, hex_int,  # noqa: F401
                         host_label, map_value, payload, regex1)


def _r(field):
    return payload(field, "Record")


def _dt(rec) -> str:
    r = rec.get("Record")
    return str((r or {}).get("data_type") or "")


def _td(rec) -> str:
    r = rec.get("Record")
    return str((r or {}).get("timestamp_desc") or "")


def plasoweb_is_ie_visit(rec) -> bool:
    """msiecf:url at its Last Visited Time — the visit event (Expiration and
    the url-less leak/cached rows stay raw)."""
    return _dt(rec) == "msiecf:url" and "Last Visited" in _td(rec)


def plasoweb_is_ff_cache(rec) -> bool:
    return _dt(rec) == "firefox:cache:record"


def plasoweb_is_ff_visit(rec) -> bool:
    """firefox:places:page_visited inside the generic sqlite table — gated
    strictly by data_type (bookmarks/annotations stay raw)."""
    return _dt(rec) == "firefox:places:page_visited"


def plasoweb_is_javaidx(rec) -> bool:
    return _dt(rec) == "java:download:idx"


PREDICATES = {
    "plasoweb_is_ie_visit": plasoweb_is_ie_visit,
    "plasoweb_is_ff_cache": plasoweb_is_ff_cache,
    "plasoweb_is_ff_visit": plasoweb_is_ff_visit,
    "plasoweb_is_javaidx": plasoweb_is_javaidx,
}

# IE history renders "Visited: user@<url>"; plain cache rows carry the bare url.
_IE_URL = first(regex1(_r("url"), r"^Visited:\s*[^@]*@(.+)$"), _r("url"))
# firefox cache prefixes the url with "HTTP:".
_FFC_URL = first(regex1(_r("url"), r"^HTTP:(.+)$"), _r("url"))

_HOST = host_label(_r("image_hostname"))


def _http_props(url_marker):
    """The shared derivations for an endpoint-recorded URL request."""
    return {
        "url_full": url_marker,
        "url_scheme": regex1(url_marker, r"^(https?)://"),
        "url_domain": regex1(url_marker, r"^https?://([^/?#:]+)"),
        "url_remainder": regex1(url_marker, r"^https?://[^/]+(/[^\s]*)"),
        # the imaged endpoint IS the vantage these artefacts were seen on
        "hostname": _r("image_hostname"),
    }


MAPPINGS = {
    # ---- IE index.dat visits → http/get -------------------------------------
    "l2t_msiecf": {
        "variants": [
            ("plasoweb_is_ie_visit", {
                "object": "http", "action": "get", "ts": "Timestamp",
                "guid": {"none": True}, "host": _HOST,
                "props": _http_props(_IE_URL),
                "keep": [],
                "native_extract": {"data_type": _r("data_type"),
                                   "raw_url": _r("url"),
                                   "number_of_hits": _r("number_of_hits"),
                                   "artefact_file": _r("display_name")},
            }),
        ],
        "default": None,   # Expiration rows, msiecf:leak / cached objects: raw
    },
    # ---- Firefox cache → http (recorded method + status) ---------------------
    "l2t_firefox_cache": {
        "variants": [
            ("plasoweb_is_ff_cache", {
                "object": "http",
                "action": map_value(_r("request_method"),
                                    {"GET": "get", "POST": "post", "PUT": "put"},
                                    upper=True),
                "ts": "Timestamp",
                "guid": {"none": True}, "host": _HOST,
                "props": dict(_http_props(_FFC_URL),
                              response_status_code=hex_int(
                                  regex1(_r("response_code"), r"\s(\d{3})\s"))),
                "keep": [],
                "native_extract": {"data_type": _r("data_type"),
                                   "fetch_count": _r("fetch_count"),
                                   "data_size": _r("data_size"),
                                   "artefact_file": _r("display_name")},
            }),
        ],
        "default": None,   # a method outside the CAR action set stays raw
    },
    # ---- Firefox places page visits (sqlite table) → http/get ----------------
    "l2t_firefox_places": {
        "variants": [
            ("plasoweb_is_ff_visit", {
                "object": "http", "action": "get", "ts": "Timestamp",
                "guid": {"none": True}, "host": _HOST,
                "props": dict(_http_props(_r("url")),
                              # from_visit is the recorded referring page —
                              # "url (host)" rendered; keep the url part only
                              request_referrer=first(
                                  regex1(_r("from_visit"), r"^(\S+)"),
                                  _r("from_visit"))),
                "keep": [],
                "native_extract": {"data_type": _r("data_type"),
                                   "title": _r("title"),
                                   "visit_count": _r("visit_count"),
                                   "visit_type": _r("visit_type"),
                                   "typed": _r("typed"),
                                   "artefact_file": _r("display_name")},
            }),
        ],
        "default": None,   # bookmarks/annotations/other sqlite plugins: raw
    },
    # ---- Java download cache (IDX) → http/get --------------------------------
    "l2t_javaidx": {
        "variants": [
            ("plasoweb_is_javaidx", {
                "object": "http", "action": "get", "ts": "Timestamp",
                "guid": {"none": True}, "host": _HOST,
                "props": _http_props(_r("url")),
                "keep": [],
                # the SERVER ip the cache recorded — CAR http has no dest_ip
                "native_extract": {"data_type": _r("data_type"),
                                   "ip_address": _r("ip_address"),
                                   "idx_version": _r("idx_version"),
                                   "artefact_file": _r("display_name")},
            }),
        ],
        "default": None,
    },
}
