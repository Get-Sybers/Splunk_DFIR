# Security Policy

## Supported versions

| Version | Supported |
|:---|:---|
| `0.1.x-alpha` | ⚠️ Alpha — best effort only |

This project is experimental. Nothing here is hardened, and there is no
automated test coverage. Do not treat it as a secure system.

## Reporting a vulnerability

Open a [security advisory](https://github.com/Get-Sybers/Splunk_DFIR/security/advisories/new)
rather than a public issue. If advisories are unavailable, open an issue that
describes the *class* of problem without a working exploit, and say you have
details to share privately.

Expect a slow response — this is a personal project, not a maintained product.

## Known weaknesses

These are already known. You do not need to report them.

- **`chmod -R 777`.** `deploy-splunk.sh` and the processing scripts widen
  permissions across `data_store/`, `splunk/`, and `ansible/` to work around
  container UID mismatch. Anyone with local access can read or modify evidence
  and configuration. Do not run this on a shared or multi-user host.
- **Splunk runs with no meaningful authentication.** The deploy script uses the
  free tier, which has no auth features. The admin password is prompted for and
  passed to the container as an environment variable, where it is visible via
  `docker inspect`.
- **Evidence lives in the working tree.** `data_store/` is gitignored
  deny-by-default, but a determined `git add -f` defeats it.
- **Network isolation is not an airgap.** Since `v0.1.0-alpha` the container
  attaches to an `--internal` Docker network and publishes only on
  `127.0.0.1`. (Before that it bound `0.0.0.0` — reachable from the whole LAN —
  with unrestricted outbound access.)

  What that does *not* cover: `--internal` blocks egress off the host, but
  containers on the network can still reach each other and services on the
  host's bridge address. And Docker's published-port rules are inserted ahead
  of the host firewall, so `ufw` will not save you from a wrong bind address.

  The deploy tests egress from inside the container and **fails** if isolation
  does not hold, rather than reporting a control it has not confirmed.
- **Third-party containers are pulled as `:latest`.** No digest pinning, no
  signature verification. You are trusting Docker Hub at pull time.
- **Operator-supplied Splunk apps are not verified.** `Splunk_TA_zeek` and
  `sankey_diagram_app` are installed from packages you place in
  `data_store/dependencies/splunk_apps/`. Nothing checks their integrity — no
  checksums, no signatures. (They are no longer vendored in this repository;
  see `THIRD_PARTY_NOTICES.md`.)

## Handling evidence

This is DFIR tooling — the data it touches is usually sensitive and sometimes
legally significant.

- Work on copies, and verify hashes before and after processing.
- The processing scripts mount evidence directories into containers. The VMware
  path is mounted read-only; treat everything else as potentially mutable.
- Nothing here is written to preserve chain of custody. If your work needs to
  stand up in a legal context, this project is not sufficient on its own.
