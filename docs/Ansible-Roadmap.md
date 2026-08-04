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

## Former blocking prerequisite: Splunk had no persistent state

**Fixed in v0.1.0-alpha, but not yet runtime-verified.** Kept here because it
is the reason the migration case collapsed.

`scripts/deploy-splunk.sh` used to mount the host's `splunk/var` at
**`/data/var`**:

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

**Now:** index data lives in a named Docker volume mounted at
`/opt/splunk/var`, and `purge-splunk-container.sh` removes that volume
explicitly. A named volume rather than a bind mount, so Docker seeds it from
the image and the container's splunk-user ownership survives.

**Still to do:** verify at runtime that indexes actually survive a container
recreate. That cannot be tested without Docker and Splunk.

## Verified defects — fixed in v0.1.0-alpha

These were each confirmed against the code and then fixed directly in bash
and YAML. **None needed Ansible**, which is itself the clearest argument
against the migration case: the plan's strongest evidence was this defect
list, and it was cleared in an afternoon without a control node.

Note none of the fixes are runtime-tested — see `project-progress.md`.

| # | Defect | Effect | Fix |
|:--|:---|:---|:---|
| 1 | `splunk/var` mounted at `/data/var`, `SPLUNK_DB` unset | All indexed data ephemeral | Named volume at `/opt/splunk/var`; purge removes it |
| 2 | `host = extracted_host` is a literal string | Every event labelled `extracted_host` | Removed; `[l2t:csv]` already sets host via `TRANSFORMS-set_host` |
| 3 | Four copy tasks gated on one `limits.conf` stat | Editing `indexes.conf`/`inputs.conf` was a silent no-op | Per-file stat; mode `0755`→`0644` |
| 4 | No `set -e`; no `docker rm` before `docker run --name` | Second run collided, greped the **old** container's logs, exited 0 having deployed nothing | Refuses to collide; polls by container ID; detects container death; 600s configurable timeout |
| 5 | Unquoted paths in `sudo chown -R`/`chmod -R` | A repo path with a space would target unintended directories | All quoted |
| 6 | 7 scripts resolved the repo root one level wrong | `scripts/v2/` ×4, `scripts/deprecated/` ×3 | Corrected; a check now asserts this for every script |

Defect 4 was the one case where `community.docker.docker_container` genuinely
does something bash struggles with: converging on a named container rather than
colliding with it. It has now been handled in bash — the script refuses to
collide, polls by container ID, and detects a container that dies mid-startup.
That removes the strongest single argument for Ansible in this repo.

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

1. ✅ **Fix the defects above.** Done in v0.1.0-alpha, runtime verification
   still outstanding.
2. **Delete `scripts/v2/`.** Its path resolution is now corrected, but it
   remains a divergent duplicate that does *not* carry the Splunk persistence,
   collision or readiness fixes — so running it still gets you the old
   behaviour. Delete rather than maintain two copies.
3. ✅ **Delete the 94 inert vendored files.** Done — `ansible/` is now 3 wired
   playbooks, and the project's largest third-party obligation went with them.
4. **Add a pipeline test suite.** `tests/run-checks.sh` provides 124 static
   checks in CI, but nothing exercises the pipeline. Idempotency is the entire value
   proposition of the Ansible work and remains unfalsifiable without one.

## Staging

| Stage | Goal | Gated on |
|:---|:---|:---|
| 0 | ✅ Splunk persistence fixed (named volume at `/opt/splunk/var`). **Still needs runtime verification** that indexes survive a container recreate | — |
| 1 | ✅ Defects 2-4 fixed in place. Still open: delete `scripts/v2/` and the 94 inert files | — |
| 2 | ◑ Static check gate exists (`tests/run-checks.sh`, 90 checks). Still needs a pipeline smoke test | Stage 1 |
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
