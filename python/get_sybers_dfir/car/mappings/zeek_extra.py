"""Zeek logs beyond conn/http that carry a CAR object (epic #86).

Zeek is ONE source (all its per-protocol logs for a capture → one car.db). Of
the log types, four carry a CAR object: conn→flow (zeek_conn), http→http (core),
and here:

- **smtp → email**: an observed SMTP transaction. Mapped ONLY when the row
  carries actual message content (mailfrom/rcptto/from/subject) — a STARTTLS
  session exposes none of that (encrypted), so it stays raw rather than assert a
  phantom `deliver` with no recipient (matches CAR-Relations' email limits).
- **files → file**: a file object Zeek reconstructed from traffic. It is a
  NETWORK-OBSERVED file (source_artefact=zeek), not proven written to a host —
  `create` here means "the file object was first observed on the wire". Grabs
  mime_type (incl. application/x-dosexec = PE downloads), name/hash where the
  analyzers produced them, and the `uid`/`fuid` that tie it to its flow and its
  http/smtp transaction (the within-source cascade, by uid/fuid, is the
  end-stage).

The remaining Zeek logs (dns, ssl, x509, dhcp, ntp, snmp, ocsp, weird, pe,
packet_filter) have no dedicated CAR object; their per-flow detail can enrich the
flow by `uid` at the cascade stage, but they are not CAR objects and stay raw.
"""
from __future__ import annotations

from ..normalize import (basename, const, domain_of, epoch_ts, ext, first,  # noqa: F401
                         host_label, lower, map_value, regex1)


def zeek_is_smtp_message(rec) -> bool:
    """An SMTP row with real message content — not an encrypted STARTTLS shell."""
    return any(rec.get(k) for k in ("mailfrom", "rcptto", "from", "to", "subject"))


def zeek_is_file(rec) -> bool:
    return bool(rec.get("fuid"))


PREDICATES = {
    "zeek_is_smtp_message": zeek_is_smtp_message,
    "zeek_is_file": zeek_is_file,
}

MAPPINGS = {
    # ---- smtp.log → email (only when message content is present) -------------
    "zeek_smtp": {
        "variants": [
            ("zeek_is_smtp_message", {
                "object": "email", "action": const("deliver"), "ts": epoch_ts("ts"),
                "guid": {"fields": ["uid", "trans_depth"]},
                "props": {
                    "src_ip": "id.orig_h", "src_port": "id.orig_p",
                    "dest_ip": "id.resp_h", "dest_port": "id.resp_p",
                    # envelope (MAIL FROM / RCPT TO) is the real sender/recipient;
                    # from/to are the forgeable header display values
                    "src_address": first("mailfrom", "from"),
                    "dest_address": first("rcptto", "to"),
                    "src_domain": domain_of(first("mailfrom", "from")),
                    "from": "from", "to": "to", "subject": "subject", "date": "date",
                },
                "keep": ["uid", "trans_depth", "helo", "path", "tls", "fuids",
                         "last_reply", "id.orig_p", "id.resp_p"],
            }),
        ],
        "default": None,   # STARTTLS / contentless sessions -> raw
    },
    # ---- files.log → file (a network-observed file object) -------------------
    "zeek_files": {
        "variants": [
            ("zeek_is_file", {
                "object": "file", "action": const("create"), "ts": epoch_ts("ts"),
                "guid": {"fields": ["fuid"]},
                "props": {
                    "file_name": "filename",
                    "extension": ext("filename"),
                    "mime_type": "mime_type",
                    "md5_hash": "md5", "sha1_hash": "sha1", "sha256_hash": "sha256",
                },
                # uid ties the file to its flow; source (HTTP/SMTP/...) + fuid tie
                # it to the transaction; bytes/analyzers are the transfer evidence
                "keep": ["fuid", "uid", "source", "seen_bytes", "total_bytes",
                         "is_orig", "analyzers", "id.orig_h", "id.resp_h",
                         "mime_type"],
            }),
        ],
        "default": None,
    },
}
