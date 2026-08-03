# 🅰️ Roadmap: "Ansible it all"

> **Status: planning, and deliberately narrowed.** This is the beta target.
> Read [docs/Ansible.md](/docs/Ansible.md) first for what Ansible does today.
>
> This document was rewritten after a design-and-critique pass. The short
> version: **"Ansible it all" is the wrong goal, and most of the value people
> attribute to it is available without Ansible.** The plan below keeps the part
> that genuinely earns its place and explicitly drops the rest.

## The honest conclusion first

Four independent designs were produced for Ansible-ising the whole pipeline —
environment setup, evidence processing, Splunk lifecycle, and KAPE/Windows —
and then reviewed by three adversarial critics on feasibility, value, and
sequencing. Deduplicated, the designs proposed roughly 20-24 roles, two custom
Python modules, a filter-plugin pair, and CI from zero.

The reviews were not kind, and they were right:

1. **Ansible's core competence doesn't apply to most of this.** Ansible is for
   idempotent convergence across many hosts. This is one analyst on one
   workstation. Wrapping `for f in "$INPUT_DIR"/*.E01` in YAML is a job runner,
   not configuration management.
2. **Most of the claimed wins are bug fixes wearing a migration's clothes.**
   The plan's strongest evidence was a list of genuine defects in the current
   scripts. Every one of them is fixable in the existing bash, in days, without
   Ansible.
3. **The idempotency argument — the strongest one — isn't an Ansible feature.**
   It's a marker file. About 15 lines of bash.
4. **The scope cannot land in one milestone** alongside the two beta blockers
   that already exist (CAR mapping, and a test suite from zero), with one
   maintainer and no regression signal.

So the target is no longer "Ansible it all". It is: **fix the defects, delete
the dead weight, and use Ansible only where it demonstrably does something bash
cannot.**

## Blocking prerequisite: Splunk has no persistent state

Nothing else on this page matters until this is fixed, and it is not an Ansible
problem.

`scripts/deploy-splunk.sh:140` mounts the host's `splunk/var` at **`/data/var`**:

```
-v "$REPO_ROOT_DIR/splunk/var":/data/var \
```

Splunk does not read `/data/var`. Its actual data directory is `$SPLUNK_DB`,
which resolves inside the container to `/opt/splunk/var/lib/splunk` — and that
path is **not bind-mounted**. Nothing in `splunk/etc/` or `ansible/` sets
`SPLUNK_DB` or otherwise redirects it; `splunk/etc/system/local/indexes.conf`
uses `$SPLUNK_DB/host/db`, `$SPLUNK_DB/network/db` and so on, all of which land
on the container's ephemeral layer.

**Consequence: every index, and the fishbucket that tracks what has already been
ingested, is destroyed when the container is removed.** The `splunk/var` bind
mount is inert — it looks like persistence and provides none.

This matters more than it first appears:

- Re-deploying means re-ingesting everything, and because the fishbucket is gone
  too, Splunk has no memory of what it already read.
- Any "converge the container toward desired state" design — the entire
  idempotency case for `community.docker.docker_container` — is built on sand
  while a container recreate silently destroys all indexed evidence. Automating
  recreation would make accidental total data loss *more* likely than the
  current script does.

Fix this first, verify it by recreating the container and confirming indexes
survive, and only then consider automating container lifecycle.

## Verified defects to fix in bash, now

These were each confirmed against the code. None needs Ansible.

| # | Defect | Location | Effect |
|:--|:---|:---|:---|
| 1 | `splunk/var` mounted at `/data/var`, `SPLUNK_DB` unset | `deploy-splunk.sh:140` | All indexed data is ephemeral (above) |
| 2 | `host = extracted_host` is a literal string | `splunk/etc/system/local/inputs.conf:75,81` | Splunk sets `host` to the text `extracted_host`, not a value |
| 3 | All four copy tasks gated on one `limits.conf` stat | `ansible/playbooks/Include-local-conf.yml` | If `limits.conf` exists, `indexes.conf` and `inputs.conf` are never copied — editing them is a silent no-op |
| 4 | No `set -e`; no `docker rm`/`stop` before `docker run --name` | `deploy-splunk.sh:135`, readiness loop at `:162` | A second run collides on the container name, continues anyway, then greps the **old** container's logs, finds the completion string, and exits 0 having deployed nothing |

Defect 4 is the one case where `community.docker.docker_container` genuinely
does something bash struggles to: converge on a named container rather than
colliding with it. That is the strongest single argument for Ansible in this
repo — and it is still cheaper to fix in bash first.

## What Ansible should and should not own

### Worth doing

- **Splunk container lifecycle** — `docker_container` replaces the
  `--name` collision failure mode outright, and a `uri` poll of
  `/services/server/info` with `retries`/`until` replaces
  `docker logs | grep -q` on a hard 60-second timeout, which today cannot
  distinguish a slow image pull from a real failure.
- **Splunk config convergence** — `copy`/`template` with their own checksum
  idempotency fixes defect 3 properly, instead of re-encoding the sentinel.

That is the honest scope of "Ansible-driven". It is Splunk lifecycle and
config. It is not the pipeline.

### Explicitly out of scope

| Not doing | Why |
|:---|:---|
| Evidence discovery loops | `nocaseglob`, first-volume filtering, and extension matching are already correct in bash. Turning E01 files into Ansible hosts via `add_host` is a rewrite, not a migration |
| Batch `docker run` for psteal/zeek/rekall | `docker_container` converges long-lived services; these are one-shot batch jobs. `detach: false` also aborts on the Docker API read timeout (60s default) — fatal for multi-hour Plaso runs, and `async` terminates the child at its time limit rather than waiting |
| The Rekall path entirely | `convert_to_json` is ~250 lines of per-plugin text parsing. Rewriting it in YAML is a downgrade, and the profile-detection ladder is broken independently of any role structure |
| KAPE / Windows | `kape.exe` and `aim_cli.exe` cannot be provisioned by Ansible at all — Kroll registration and a Solo Edition licence that forbids commercial use. WinRM's 30-minute default operation timeout is exceeded by real KAPE runs, and multi-GB output can't cross WinRM anyway, so transport stays robocopy/SMB |
| `ansible-vault` for the Splunk password | Trades a TTY prompt for a TTY prompt, or writes a vault key to the same disk as the evidence. Today the password exists only in shell memory; the proposed `default.yml` would put it on disk in cleartext |
| Custom Python modules / filter plugins | `vmdk_descriptor.py`, `dfir_names.py`, `rekall_to_json.py` — a rewrite of working logic, for beta, with no tests |

## Higher value than any of this

Both the value and sequencing critics independently identified the same work as
the best return, and none of it is Ansible:

1. **Fix the four defects above**, starting with Splunk persistence.
2. **Delete `scripts/v2/`.** Four of its seven scripts resolve the repo root to
   `<repo>/scripts`. Delete rather than port — `scripts/` already carries the
   same features.
3. **Delete the 94 inert vendored files** in `ansible/tasks/` and
   `ansible/default_playbooks/`. Nothing executes them, and they carry the
   project's largest third-party obligation. One deliberate commit.
4. **Add a test suite.** Idempotency is the entire value proposition of the
   Ansible work, and it is currently unfalsifiable — there is no way to
   demonstrate that a migration preserved behaviour.

## Staging

| Stage | Goal | Gated on |
|:---|:---|:---|
| 0 | Fix Splunk persistence (`SPLUNK_DB` / mount `/opt/splunk/var`); verify indexes survive a container recreate | — |
| 1 | Fix defects 2-4 in place; delete `scripts/v2/` and the 94 inert files | — (parallel with 0) |
| 2 | Minimal test/lint gate so stage 3 has a regression signal | Stage 1 |
| 3 | Splunk lifecycle + config as Ansible roles — the genuinely justified scope | Stages 0-2 |
| — | Everything else above | Not in beta |

Publishing port **8089** is required before any host-side Ansible touches the
Splunk REST API. The reviews disagreed on whether to do it at all, because
exposing splunkd's management port on a workstation holding evidence has its own
risk. Decide it deliberately when stage 3 starts, not before — and bind it to
localhost if it is opened.

## What "Ansible-driven beta" honestly means

Splunk deployment and configuration converge idempotently through Ansible, on a
container whose data actually persists. The evidence pipeline stays shell, and
is documented as staying shell.

That is a smaller claim than "Ansible it all", and it is one the project can
actually make good on.
