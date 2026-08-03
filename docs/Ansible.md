# 🅰️ Ansible in this project

> **🧪 Alpha.** This documents what Ansible actually does here today, which is
> less than the size of the `ansible/` directory suggests. The plan is to drive
> the whole pipeline through Ansible — see [The plan](#the-plan-ansible-it-all).

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

Only `ansible/playbooks/` is mounted into the container. Everything else is
inert.

| Path | Files | Status |
|:---|:---:|:---|
| `ansible/playbooks/` | 5 | The only directory used at runtime — and only 3 of the 5 are wired in |
| `ansible/tasks/` | 79 | Vendored splunk-ansible. **Never executed.** Not mounted, not referenced |
| `ansible/default_playbooks/` | 15 | Vendored splunk-ansible. **Never executed.** Not mounted, not referenced |
| `ansible/scripts/` | 2 | Both **0 bytes** — placeholders for planned helper scripts |

### The playbooks, honestly

Each of the five was diffed against upstream splunk-ansible:

| Playbook | Origin | Wired as a pre-task? |
|:---|:---|:---:|
| `Include-Custom-Apps.yml` | **Original work** — copies `/data/etc/apps/` into the container's app dir | ✅ |
| `Include-local-conf.yml` | **Original work** — conditionally seeds `limits.conf`, `indexes.conf` etc. if absent | ✅ |
| `remove_first_login.yml` | Modified splunk-ansible — touches `.ui_login` to skip the first-login wizard | ✅ |
| `copy_installed_apps.yml` | Verbatim splunk-ansible | ❌ Not referenced |
| `disable_popups.yml` | Modified splunk-ansible | ❌ Not referenced — superseded by `SPLUNK_DISABLE_POPUPS=True` in `deploy-splunk.sh` |

**The project's original Ansible work is two playbooks.** That is not a
criticism of the approach — riding the container's built-in Ansible is a
legitimate and economical way to configure Splunk. It is simply a much smaller
foundation than 101 files implies, and it matters when scoping the work below.

### Why the vendored copies are a liability

`ansible/tasks/` (79 files) and `ansible/default_playbooks/` (15 files) are
reference copies of splunk-ansible that nothing runs — 94 files in total. They
carry the project's entire Apache-2.0 vendoring obligation — attribution,
`NOTICE`, marking modifications — in exchange for no runtime benefit, because
the container already ships its own copy.

Two options, both legitimate:

1. **Keep them** as a local reference for what the container will do, and comply
   properly (this is what the alpha does — see [NOTICE](/NOTICE) and
   [THIRD_PARTY_NOTICES.md](/THIRD_PARTY_NOTICES.md)).
2. **Delete them.** The pipeline is unaffected. This removes the largest
   third-party obligation in the repository at zero functional cost.

Option 2 is worth serious consideration during beta. It is deliberately *not*
done in the alpha, because deleting 94 files is not a change to make while
also changing the release's story.

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
  only `8000` (web) and `8088` (HEC). Every REST-driven Ansible task — including
  the `splunk_api` module that most of the vendored playbooks depend on — talks
  to `8089`. Any host-side Ansible layer needs that port published first. This
  is a hard prerequisite for "Ansible it all", and it is a one-line change to
  the `docker run` invocation.
- `deploy-splunk.sh` runs `sudo chmod -R 777` over `ansible/`, `splunk/`, and
  `data_store/` to work around container UID mismatch. This is a workaround, not
  a fix, and it is one of the things a proper Ansible layer should eliminate.
- Two of five playbooks are dead. They should be either wired in or removed.
- `ansible/scripts/*.sh` are empty files.
