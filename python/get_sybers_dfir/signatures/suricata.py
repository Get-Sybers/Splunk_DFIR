"""Suricata lane — replay each PCAP (IDS mode, offline) into EVE JSON.

EVE is already newline-delimited JSON, one event per line. We add ``source_pcap`` +
``tool`` to each line and keep the alert-bearing event types (alert plus the protocol
records that give an alert its context); SURICATA_EVE_ALL keeps the full stream.
"""
from __future__ import annotations

import ipaddress
import json
import os
import subprocess
import tempfile

from . import clean_name

_SURICATA_IMAGE = "jasonish/suricata:latest"
_WANTED = {"alert", "anomaly", "http", "dns", "tls", "fileinfo", "flow"}

# Ranges that count as "home" when auto-deriving HOME_NET: RFC1918 + CGNAT +
# link-local. EXTERNAL_NET is then the complement (!$HOME_NET).
_PRIVATE_SUPERNETS = [
    "10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16",
    "100.64.0.0/10", "169.254.0.0/16",
]
# Suricata's own default HOME_NET, used as the fallback when a capture shows no
# private address at all (e.g. a public-to-public capture).
_DEFAULT_HOME_NET = ["10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16"]


def derive_home_net(ips) -> str:
    """Recommended HOME_NET for a capture, as a Suricata address-group literal
    ``[a,b,...]`` — the private supernets actually observed among ``ips`` (falls back
    to the RFC1918 set when none appear). Pure, so it is unit-testable without a PCAP.

    HOME_NET is Suricata's primary tuning variable: ET/Sigma-style rules key their
    direction off ``$HOME_NET`` / ``$EXTERNAL_NET``, so a HOME_NET that matches the
    capture's real internal range is what makes directional rules fire correctly.
    """
    nets = [ipaddress.ip_network(n) for n in _PRIVATE_SUPERNETS]
    parsed = []
    for ip in ips:
        try:
            parsed.append(ipaddress.ip_address(ip))
        except ValueError:
            continue
    seen = [str(net) for net in nets if any(a in net for a in parsed)]
    return "[" + ",".join(seen or _DEFAULT_HOME_NET) + "]"


def var_sets(home_net=None, external_net=None, extra_sets=None) -> list[str]:
    """Suricata ``--set`` values for address-group tuning + any operator passthroughs.
    HOME_NET implies EXTERNAL_NET=!$HOME_NET unless one is given explicitly. Pure."""
    sets: list[str] = []
    if home_net:
        sets.append(f"vars.address-groups.HOME_NET={home_net}")
        sets.append(f"vars.address-groups.EXTERNAL_NET={external_net or '!' + home_net}")
    elif external_net:
        sets.append(f"vars.address-groups.EXTERNAL_NET={external_net}")
    sets.extend(extra_sets or [])
    return sets


def collect_ips(eve_text: str) -> list[str]:
    """Every src_ip/dest_ip seen in an EVE JSON stream — the input to derive_home_net
    for a first (default-vars) pass. Pure."""
    ips = set()
    for line in eve_text.splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            ev = json.loads(line)
        except json.JSONDecodeError:
            continue
        for k in ("src_ip", "dest_ip"):
            v = ev.get(k)
            if v:
                ips.add(v)
    return sorted(ips)


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


def suricata_argv(pcap, out_dir, rules_dir, rules_file, image, sets=None):
    """The ``docker run`` argv for one offline Suricata pass. ``sets`` are Suricata
    ``--set key=value`` tuning entries (HOME_NET etc. from ``var_sets``). Pure."""
    argv = [
        "docker", "run", "--rm",
        "-v", f"{os.path.dirname(pcap)}:/pcaps:ro",
        "-v", f"{os.path.realpath(rules_dir)}:/rules:ro",
        "-v", f"{out_dir}:/out",
        image, "suricata", "-r", f"/pcaps/{os.path.basename(pcap)}", "-l", "/out", "-k", "none",
    ]
    if rules_file:
        argv += ["-S", f"/rules/{os.path.basename(rules_file)}"]
    for s in (sets or []):
        argv += ["--set", s]
    return argv


def _run_suricata(pcap, out_dir, rules_dir, rules_file, image, sets=None):
    subprocess.run(suricata_argv(pcap, out_dir, rules_dir, rules_file, image, sets),
                   capture_output=True, check=False)


def _suricata_pass(pcap, rules_dir, rules_file, image, sets):
    """One Suricata pass into a fresh temp dir; return its raw EVE text ('' on no output)."""
    with tempfile.TemporaryDirectory() as tmp:
        os.chmod(tmp, 0o777)
        _run_suricata(pcap, tmp, rules_dir, rules_file, image, sets)
        eve = os.path.join(tmp, "eve.json")
        if os.path.isfile(eve) and os.path.getsize(eve) > 0:
            with open(eve, encoding="utf-8", errors="replace") as fh:
                return fh.read()
    return ""


def run(*, output_dir, repo_root, fetch=False, force=False,
        pcap_dir=None, rules_dir=None, image=_SURICATA_IMAGE, keep_all=False,
        home_net=None, external_net=None, extra_sets=None, auto_home_net=False,
        **_ignored) -> dict:
    ds = os.path.join(repo_root, "data_store")
    pcap_dir = pcap_dir or os.path.join(ds, "raw", "pcaps")
    rules_dir = rules_dir or os.path.join(ds, "dependencies", "suricata-rules")
    os.makedirs(output_dir, exist_ok=True)
    os.makedirs(rules_dir, exist_ok=True)

    res = {"lane": "suricata", "produced": 0, "skipped": 0, "failed": 0, "note": None,
           "tuning": {}}

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

    # Operator-supplied tuning (HOME_NET / EXTERNAL_NET / arbitrary --set) applies to
    # every pcap. When --auto-home-net is set AND no HOME_NET was given, each pcap gets
    # a HOME_NET derived from its own traffic (a cheap default-vars pass first).
    base_sets = var_sets(home_net, external_net, extra_sets)

    for pcap in pcaps:
        out = os.path.join(output_dir, clean_name(pcap, pcap_dir) + ".eve.jsonl")
        if not force and os.path.exists(out) and os.path.getsize(out) > 0:
            res["skipped"] += 1
            continue

        sets = base_sets
        if auto_home_net and not home_net:
            probe = _suricata_pass(pcap, rules_dir, rules_file, image, base_sets)
            derived = derive_home_net(collect_ips(probe))
            sets = var_sets(derived, external_net, extra_sets)
            res["tuning"][clean_name(pcap, pcap_dir)] = {"HOME_NET": derived, "auto": True}
        elif home_net:
            res["tuning"][clean_name(pcap, pcap_dir)] = {"HOME_NET": home_net, "auto": False}

        eve_text = _suricata_pass(pcap, rules_dir, rules_file, image, sets)
        if eve_text:
            events = filter_eve(eve_text, os.path.relpath(pcap, repo_root), keep_all)
            with open(out, "w") as w:
                for ev in events:
                    w.write(json.dumps(ev) + "\n")
            res["produced"] += 1
        else:
            res["failed"] += 1
    return res
