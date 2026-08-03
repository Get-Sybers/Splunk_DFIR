# 🅰️ Roadmap: "Ansible it all"

> **Status: planning.** This is the beta target, not alpha work. Nothing here is
> built. Read [docs/Ansible.md](/docs/Ansible.md) first — it describes what
> Ansible actually does today, which is the starting point this plan builds on.

## The goal

Drive the whole pipeline through Ansible — environment setup, evidence
processing, Splunk lifecycle — instead of a collection of bash and PowerShell
scripts with three playbooks injected into a container at boot.

## The thing to understand first: there are two Ansible surfaces

This is the single most important framing, and conflating the two will waste
effort.

| | **Surface A — exists today** | **Surface B — what "Ansible it all" needs** |
|:---|:---|:---|
| Runs where | Inside the Splunk container | On the host, as a control node |
| Driven by | The `splunk/splunk` image's own embedded splunk-ansible | `ansible-playbook`, invoked by the operator |
| Entry point | `SPLUNK_ANSIBLE_PRE_TASKS` env var | An inventory + playbooks |
| Scope | Configuring Splunk at startup | Everything: Docker, evidence processing, Splunk, KAPE |
| Status | Working, 3 playbooks wired | **Does not exist. Not a single line of it.** |

Surface A is not a foundation for Surface B. They share a vocabulary and
nothing else. "Ansible it all" means building Surface B from scratch, alongside
Surface A rather than on top of it.

The 94 vendored splunk-ansible files under `ansible/tasks/` and
`ansible/default_playbooks/` belong to neither surface — nothing executes them.
They are not a head start.

## Verified prerequisites

These are blocking, and each was confirmed against the code.

### 1. Publish Splunk's management port

`scripts/deploy-splunk.sh` publishes only `8000` (web) and `8088` (HEC):

```
-p 8088:8088 \
-p 8000:8000 \
```

Port **8089** — splunkd's management/REST interface — is not published. Every
REST-driven Ansible task, including the `splunk_api` module that most of the
vendored playbooks are built around, targets 8089. Until it is exposed, a
host-side Ansible layer cannot talk to Splunk at all.

One-line fix, but it must come first.

### 2. There is no control node, and nothing installs one

`ansible` is not a dependency of this project anywhere. `setup-environment.sh`
installs Docker and pulls images; it does not install Ansible. Bootstrapping the
control node is itself work that has to be designed — and it cannot be done
*in* Ansible.

### 3. The permission model has to be decided, not deferred

The scripts currently `chmod -R 777` across `data_store/`, `splunk/`, and
`ansible/` to work around Docker UID mismatch. Ansible does not fix this by
itself; it just moves where the `777` is written. Replacing the workaround means
choosing a real model — matching UIDs into the container, or user namespace
remapping, or accepting group-writable — and that decision gates any honest
migration of the processing scripts.

### 4. Docker group membership doesn't apply in the run that grants it

`setup-environment.sh` already acknowledges this: adding the user to the
`docker` group requires a new login session. A single "run this playbook and
you're set up" flow cannot work in one pass without handling that.

## Scope realism

An early signal from the design analysis: replacing the `ansible/` layer alone
was assessed as **very-large** effort (11 roles), and the Splunk lifecycle
scripts as **large** (10 roles).

For context, beta is *already* gated on:

- MITRE CAR field mapping — the headline feature, entirely unimplemented
- An automated test suite — currently zero coverage

Landing all three in one milestone is not realistic. The sequencing question
this roadmap has to answer is not "how do we Ansible everything" but "what is
the smallest Ansible scope that honestly justifies calling beta Ansible-driven,
and what gets explicitly deferred."

## Likely staging

Provisional, pending the completed analysis:

| Stage | Goal | Gated on |
|:---|:---|:---|
| 0 | Publish 8089; add a control-node bootstrap path | — |
| 1 | Splunk lifecycle as roles (deploy, configure, purge) — the part where Ansible's idempotency genuinely earns its place | Stage 0 |
| 2 | Environment setup as a role, resolving the permission model rather than re-encoding `777` | Stage 0 |
| 3 | Evidence processing wrapped, not rewritten — long Plaso runs need `async`/`poll` and `creates:` guards so reprocessing an E01 is never accidental | Stages 1-2 |
| — | KAPE/Windows over WinRM | Probably deferred past beta |

## Open questions

- **Is Ansible the right tool for the processing scripts at all?** Ansible's
  strength is idempotent configuration across many hosts. This is a
  single-analyst workstation tool. Wrapping a `for` loop over E01 files in YAML
  may be ceremony rather than value. The parts where Ansible clearly *does* earn
  its place are Splunk lifecycle, app deployment, and conf management.
- **Does the Windows/KAPE path justify a WinRM control path?** It adds
  credential handling, a second connection plugin, and an Ansible-on-Windows
  story, for scripts that already work.
- **Should `ansible/tasks/` and `ansible/default_playbooks/` be deleted first?**
  Building Surface B next to 94 dead files that look like Surface B is a
  recipe for confusion.

---

*This document will be revised with the completed staged plan, effort estimates,
and the adversarial feasibility/value/sequencing review.*
