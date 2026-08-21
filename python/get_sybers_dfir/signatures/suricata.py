"""Suricata lane — replay each PCAP (IDS mode, offline) into EVE JSON.

EVE is already newline-delimited JSON, one event per line. We add ``source_pcap`` +
``tool`` to each line and keep the alert-bearing event types (alert plus the protocol
records that give an alert its context); SURICATA_EVE_ALL keeps the full stream.
"""
from __future__ import annotations

import json
import os
import subprocess
import tempfile

from . import clean_name

_SURICATA_IMAGE = "jasonish/suricata:latest"
_WANTED = {"alert", "anomaly", "http", "dns", "tls", "fileinfo", "flow"}


def filter_eve(text: str, source_pcap: str, keep_all: bool = False) -> list[dict]:
    """Filter/annotate an EVE JSON stream. Pure — mirrors the shell's inline PY."""
    out: list[dict] = []
    for line in text.splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            ev = json.loads(line)
        except json.JSONDecodeError:
            continue
        if not keep_all and ev.get("event_type") not in _WANTED:
            continue
        ev["source_pcap"] = source_pcap
        ev["tool"] = "suricata"
        out.append(ev)
    return out


def discover(pcap_dir: str) -> list[str]:
    exts = (".pcap", ".pcapng", ".cap")
    found = []
    for cur, _dirs, files in os.walk(pcap_dir):
        for name in files:
            if name.lower().endswith(exts):
                found.append(os.path.join(cur, name))
    return sorted(found)


def _run_suricata(pcap, out_dir, rules_dir, rules_file, image):
    argv = [
        "docker", "run", "--rm",
        "-v", f"{os.path.dirname(pcap)}:/pcaps:ro",
        "-v", f"{os.path.realpath(rules_dir)}:/rules:ro",
        "-v", f"{out_dir}:/out",
        image, "suricata", "-r", f"/pcaps/{os.path.basename(pcap)}", "-l", "/out", "-k", "none",
    ]
    if rules_file:
        argv += ["-S", f"/rules/{os.path.basename(rules_file)}"]
    subprocess.run(argv, capture_output=True, check=False)


def run(*, output_dir, repo_root, fetch=False, force=False,
        pcap_dir=None, rules_dir=None, image=_SURICATA_IMAGE, keep_all=False, **_ignored) -> dict:
    ds = os.path.join(repo_root, "data_store")
    pcap_dir = pcap_dir or os.path.join(ds, "raw", "pcaps")
    rules_dir = rules_dir or os.path.join(ds, "dependencies", "suricata-rules")
    os.makedirs(output_dir, exist_ok=True)
    os.makedirs(rules_dir, exist_ok=True)

    res = {"lane": "suricata", "produced": 0, "skipped": 0, "failed": 0, "note": None}

    rules_file = None
    for cur, _dirs, files in os.walk(rules_dir):
        if "suricata.rules" in files:
            rules_file = os.path.join(cur, "suricata.rules")
            break
    if not rules_file:
        res["note"] = "no suricata.rules — using the image's bundled rules"

    pcaps = discover(pcap_dir)
    if not pcaps:
        res["note"] = f"no pcaps under {pcap_dir}"
        return res

    for pcap in pcaps:
        out = os.path.join(output_dir, clean_name(pcap, pcap_dir) + ".eve.jsonl")
        if not force and os.path.exists(out) and os.path.getsize(out) > 0:
            res["skipped"] += 1
            continue
        with tempfile.TemporaryDirectory() as tmp:
            os.chmod(tmp, 0o777)
            _run_suricata(pcap, tmp, rules_dir, rules_file, image)
            eve = os.path.join(tmp, "eve.json")
            if os.path.isfile(eve) and os.path.getsize(eve) > 0:
                with open(eve, encoding="utf-8", errors="replace") as fh:
                    events = filter_eve(fh.read(), os.path.relpath(pcap, repo_root), keep_all)
                with open(out, "w") as w:
                    for ev in events:
                        w.write(json.dumps(ev) + "\n")
                res["produced"] += 1
            else:
                res["failed"] += 1
    return res
