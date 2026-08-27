# Security Policy

## Supported versions

| Version | Supported |
|:---|:---|
| The [latest release](https://github.com/Get-Sybers/DX_DFIR/releases), and `main` | ⚠️ Best effort only |
| Any earlier release | ❌ No. Fixes land on `main` and ship in the next release; there is no backporting |
| The `deprecated` branch | ❌ No. It is the frozen pre-release line and carries known unfixed defects — see [DEPRECATED.md](https://github.com/Get-Sybers/DX_DFIR/blob/deprecated/DEPRECATED.md) |

This project is experimental. Nothing here is hardened, nothing exercises the
pipeline automatically, and none of the current release's fixes have been
verified against a running emulator. Do not treat it as a secure system.

## Reporting a vulnerability

Open a [security advisory](https://github.com/Get-Sybers/DX_DFIR/security/advisories/new)
rather than a public issue. If advisories are unavailable, open an issue that
describes the *class* of problem without a working exploit, and say you have
details to share privately.

Expect a slow response — this is a personal project, not a maintained product.

## Known weaknesses

These are already known. You do not need to report them.

- **The Kusto emulator has no security features at all.** No authentication, no
  access control, plaintext HTTP, no encryption at rest — Microsoft documents
  all four as absent. The deploy (`dxdfir deploy`, the `dfir_deploy_adx` role)
  binds it to `127.0.0.1` and refuses any other bind address without an explicit
  second variable (`dfir_deploy_adx_expose=true`), and that binding is the
  only control there is. Anyone who can reach the port can read and modify
  everything ingested, which is evidence. See
  [docs/Kusto-Port.md](/docs/Kusto-Port.md).
- **`chmod -R 777`.** The setup and processing scripts widen permissions
  across `data_store/` to work around container UID mismatch. Anyone with
  local access can read or modify evidence and configuration. Do not run this
  on a shared or multi-user host.
- **Evidence lives in the working tree.** `data_store/` is gitignored
  deny-by-default, but a determined `git add -f` defeats it.
- **Egress restriction is best-effort; the localhost binding is not.** The
  container publishes only on `127.0.0.1`, which is a real control.

  Outbound is restricted by disabling IP masquerade on the container's network.
  That breaks return traffic rather than dropping packets, so a host with its
  own forwarding rules can still let traffic out. For a hard guarantee, add a
  `DOCKER-USER` rule for the network's subnet.

  An `--internal` network was tried first (on the Splunk-era deploy this
  project grew up on) and reverted: it blocks published ports as well, making
  the service unreachable. Note also that Docker's published-port rules are
  inserted ahead of the host firewall, so `ufw` will not save you from a wrong
  bind address — which is why the deploy reads the real bindings back and
  fails if they are wider than requested.

  The deploy tests egress from inside the container and **reports** if
  isolation does not hold, rather than assuming a control it has not
  confirmed.
- **Third-party containers are pulled as `:latest`.** No digest pinning, no
  signature verification. You are trusting the registry at pull time.

## Handling evidence

This is DFIR tooling — the data it touches is usually sensitive and sometimes
legally significant.

- Work on copies, and verify hashes before and after processing.
- The processing scripts mount evidence directories into containers. The VMware
  path is mounted read-only; treat everything else as potentially mutable.
- The emulator holds ingested evidence unauthenticated on localhost, and
  the ingest loader (`dxdfir ingest`, `get_sybers_dfir.ingest`) stages copies
  of evidence inside the container during loading (cleaned up on exit,
  including on Ctrl-C).
- Nothing here is written to preserve chain of custody. If your work needs to
  stand up in a legal context, this project is not sufficient on its own.
