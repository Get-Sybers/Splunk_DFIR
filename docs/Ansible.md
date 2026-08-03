# 🅰️ Ansible in this project

> **🧪 Alpha.** This documents what Ansible actually does here today, which is
> considerably less than the name suggests. The plan is to drive the whole
> pipeline through Ansible — see [The plan](#the-plan-ansible-it-all).

## How it works today

Ansible in this project runs **inside the Splunk container**, not from a control
node on your machine.

The `splunk/splunk` Docker image ships its own embedded copy of
[splunk-ansible](https://github.com/splunk/splunk-ansible) and runs it at
container start. This project hooks into that by passing extra playbooks through
the image's `SPLUNK_ANSIBLE_PRE_TASKS` environment variable:

```
scripts/deploy-splunk.sh
  │
  ├── bind-mounts  ansible/playbooks/  ->  /data/ansible/playbooks:ro
  │
  └── sets  SPLUNK_ANSIBLE_PRE_TASKS=file:///data/ansible/playbooks/<playbook>.yml,...
        │
        └── splunk/splunk entrypoint runs its OWN splunk-ansible,
            executing our playbooks as pre-tasks before Splunk starts
```

`deploy-splunk.sh` then blocks until it sees
`Ansible playbook complete, will begin streaming splunkd_stderr.log` in the
container logs.

There is **no inventory, no `ansible.cfg`, no roles directory, and no
`ansible-playbook` invocation anywhere in this repository.** Ansible is never
run on the host.

## What's actually in `ansible/`

Three files. All three are mounted into the container and wired as pre-tasks.

| Playbook | Origin | Purpose |
|:---|:---|:---|
| `Include-Custom-Apps.yml` | **Original work** | Copies `/data/etc/apps/` into the container's app directory |
| `Include-local-conf.yml` | **Original work** | Seeds `limits.conf`, `indexes.conf`, `inputs.conf` into `etc/system/local` if absent |
| `remove_first_login.yml` | Modified splunk-ansible | Touches `.ui_login` to skip the first-login wizard |

All three pass `ansible-lint` at its `production` profile. `tests/run-checks.sh`
enforces that.

### What used to be here

Until v0.1.0-alpha, `ansible/` held **101 files**: 79 in `tasks/`, 15 in
`default_playbooks/`, 5 playbooks, and 2 zero-byte scripts.

An audit established that **nothing in the repository executed 94 of them**.
Only `ansible/playbooks/` is bind-mounted into the container, and the
`splunk/splunk` image already ships its own copy of splunk-ansible internally,
so the vendored `tasks/` and `default_playbooks/` were reference copies that
carried the project's largest Apache-2.0 obligation for no runtime benefit.

Two of the five playbooks were also dead: `copy_installed_apps.yml` was never
referenced, and `disable_popups.yml` was superseded by the
`SPLUNK_DISABLE_POPUPS=True` environment variable in `deploy-splunk.sh`. The two
`ansible/scripts/` files were empty placeholders.

All of it was removed. The pipeline is unaffected — nothing ran any of it. The
files remain in git history, and `NOTICE` still carries the attribution for
anyone working from an older commit.

## The plan: "Ansible it all"

The intent is for Ansible to drive the whole pipeline — environment setup,
evidence processing, Splunk lifecycle — rather than just injecting three
playbooks into a container at boot.

This is a **beta** target, not an alpha one. Note that it means standing up a
*second* Ansible surface: a host-side control node, entirely separate from the
container-internal Ansible described above. The two should not be conflated.

The staged plan, scope boundaries, and risks are in
[Ansible-Roadmap.md](/docs/Ansible-Roadmap.md).

## Known issues

- **Splunk's management port 8089 is not published.** `deploy-splunk.sh` maps
  only `8000` (web) and `8088` (HEC). Every REST-driven Ansible task — anything
  using the `splunk_api` module — talks to `8089`. Any host-side Ansible layer
  needs that port published first. It is a one-line change to the `docker run`
  invocation, but exposing splunkd's management port on a workstation holding
  evidence deserves a deliberate decision, and binding it to localhost.
- `deploy-splunk.sh` runs `sudo chmod -R 777` over `ansible/`, `splunk/`, and
  `data_store/` to work around container UID mismatch. This is a workaround, not
  a fix, and it is one of the things a proper Ansible layer should eliminate.
