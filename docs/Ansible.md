# 🅰️ Ansible in this project

> **🧪 Alpha.** This documents what Ansible actually does here today, which is
> considerably less than the name suggests. The plan is to drive the whole
> pipeline through Ansible — see [The plan](#the-plan-ansible-it-all).

## How it works today

Ansible in this project runs **inside the Splunk container**, not from a control
node on your machine.

The `splunk/splunk` Docker image ships its own embedded copy of
[splunk-ansible](https://github.com/splunk/splunk-ansible) and runs it at
container start. This project hooks into that through the image's own
environment variables — it does not run Ansible itself:

```
scripts/deploy-splunk.sh
  │
  ├── bind-mounts  ansible/playbooks/                -> /data/ansible/playbooks:ro
  ├── bind-mounts  data_store/dependencies/splunk_apps -> /data/dependencies/splunk_apps:ro
  │
  ├── sets  SPLUNK_ANSIBLE_PRE_TASKS  = file:///data/ansible/playbooks/<pb>.yml,...
  ├── sets  SPLUNK_APPS_URL           = /data/dependencies/splunk_apps/<pkg>.tgz,...
  └── sets  SPLUNK_ANSIBLE_POST_TASKS = file:///data/ansible/playbooks/<pb>.yml
        │
        └── splunk/splunk entrypoint runs its OWN splunk-ansible:
              pre_tasks  ->  provisioning role  ->  post_tasks
                             (installs SPLUNK_APPS_URL here)
```

`deploy-splunk.sh` then blocks until it sees
`Ansible playbook complete, will begin streaming splunkd_stderr.log` in the
container logs.

There is **no inventory, no `ansible.cfg`, no roles directory, and no
`ansible-playbook` invocation anywhere in this repository.** Ansible is never
run on the host.

## What's actually in `ansible/`

Four playbooks, all mounted into the container and all wired in — three as
pre-tasks, one as a post-task.

| Playbook | Hook | Origin | Purpose |
|:---|:---|:---|:---|
| `Include-Custom-Apps.yml` | pre | **Original work** | Copies `/data/etc/apps/` into the container's app directory |
| `Include-local-conf.yml` | pre | **Original work** | Seeds `limits.conf`, `indexes.conf`, `inputs.conf` into `etc/system/local` if absent |
| `remove_first_login.yml` | pre | Modified splunk-ansible | Touches `.ui_login` to skip the first-login wizard |
| `Apply-App-Overrides.yml` | **post** | **Original work** | Copies `splunk/etc/apps_local/<App>/local/*.conf` onto installed apps |

### Why one of them is a post-task

`site.yml` runs **`pre_tasks` → provisioning role → `post_tasks`**, and the role
is what installs third-party apps from `SPLUNK_APPS_URL`. So overrides that
target those apps have to run after it. As a pre-task they would write into
directories that don't exist yet and silently apply nothing.

### App installation is the image's job

Third-party apps are **not** installed by a playbook here. `deploy-splunk.sh`
lists the mounted packages in `SPLUNK_APPS_URL`, and the image installs them
itself. splunk-ansible's `install_apps.yml` only downloads entries matching
`http(s)://` or `file://` — a bare local path is stat'd and used directly — so
this works with the container's network isolation in place.

An earlier version of this project used a custom `Install-ThirdParty-Apps.yml`
for the same job. It was removed: the image already did it, better.

All four pass `ansible-lint` at its `production` profile, and
`tests/run-checks.sh` enforces both that and the hook wiring.

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

## Why the pre-tasks matter more than they look

This project **redeploys the container every time**, so `/opt/splunk/etc` is
rebuilt on every deploy — it lives on the container's ephemeral layer, not in
the index volume.

That makes these playbooks, plus `SPLUNK_APPS_URL`, the entire mechanism by
which configuration reaches Splunk. They are not a convenience; without them a
redeployed container comes up with no apps and none of this project's confs.

It also means:

- Editing anything under `splunk/etc/` takes effect on the next deploy. That is
  the intended workflow.
- **Changes made in the Splunk UI are lost on redeploy**, because they are
  written into `/opt/splunk/etc` inside the container.
- The `Include-local-conf.yml` "only if absent" logic is effectively always
  "absent" on a fresh container, so it copies every time. The per-file stat
  fixed in v0.1.0-alpha still matters for the case where a container is *not*
  recreated.

## What the image's own docs say

Read after the fact, and worth recording because two things here came out
differently than assumed.

Sources: [docker-splunk `STORAGE_OPTIONS.md`](https://github.com/splunk/docker-splunk/blob/develop/docs/STORAGE_OPTIONS.md),
[`ADVANCED.md`](https://github.com/splunk/docker-splunk/blob/develop/docs/ADVANCED.md),
[`advanced/APP_INSTALL.md`](https://github.com/splunk/docker-splunk/blob/develop/docs/advanced/APP_INSTALL.md).

### ✅ The persistence fix matches their guidance

> "Splunk only supports data persistence to volumes mounted outside of the
> container. Data persistence for folders inside of the container is not
> supported."

Their documented pattern is a **named volume at `/opt/splunk/var`** — created
with `docker volume create` — and they state plainly that "using named volume is
recommended". That is exactly what `deploy-splunk.sh` now does. The earlier
`splunk/var → /data/var` bind mount was persisting nothing, and this is not an
improvised fix but the vendor's own approach.

### ⚠️ `SPLUNK_APPS_URL` with a local path is source-verified, not documented

`APP_INSTALL.md` frames the choice as:

> "either through a file/directory volume-mounted inside the container, or
> through an external URL for dynamic downloads. Nothing is required for the
> former, and the environment variable `SPLUNK_APPS_URL` supports the latter."

So the *documented* route for a local app is bind-mounting the extracted app
directory at `/opt/splunk/etc/apps/<app>/`. `SPLUNK_APPS_URL` is presented as
the URL mechanism.

This project passes local `.tgz` **paths** in `SPLUNK_APPS_URL`. That works —
`install_apps.yml` stats a bare path and uses it directly, and only calls
`get_url` for `^(https?|file)://` — but it is behaviour read from the source
rather than a documented contract, so a future image could change it.

It was chosen because operators download `.tgz` packages from Splunkbase, and
bind-mounting would mean extracting them first. If it ever breaks, the
documented fallback is: extract each package into a gitignored directory at
deploy time and bind-mount each app directory.

### ⚠️ Supported upgrades need an `/opt/splunk/etc` volume too

> "Upgrading Splunk instances requires volumes to be mounted for
> `/opt/splunk/var` **and** `/opt/splunk/etc`" — plus `SPLUNK_UPGRADE=true`.

This project mounts only `var`, deliberately: `etc` is rebuilt from the repo on
every deploy, which is what keeps configuration drift-free. Splunk names that
same tradeoff — persisting `etc` "can make it easier to save modified
configurations, but simultaneously allows configuration drift to occur".

The consequence is that **the documented upgrade path does not apply here**, and
the image is pulled as `splunk/splunk:latest`. See Known issues below.

### Native mechanisms not used, and why

- **`default.yml`** (mounted at `/tmp/defaults/default.yml`, or
  `SPLUNK_DEFAULTS_URL`) can carry configuration including a `splunk.conf` key
  that writes conf files declaratively. That is a documented alternative to
  `Include-local-conf.yml`. Not adopted: this project's `inputs.conf` is long
  and hand-maintained, and re-expressing it as YAML would be harder to read, not
  easier. Environment variables take precedence over `default.yml` regardless.
- **`SPLUNKBASE_USERNAME` / `SPLUNKBASE_PASSWORD`** let the image download
  Splunkbase apps directly. Not usable here — the container has no network
  access by design.
- **`SPLUNK_LICENSE_URI`** applies a Splunk licence, if you have one beyond the
  free tier.

## Known issues

- **Splunk's management port 8089 is not published.** `deploy-splunk.sh` maps
  only `8000` (web) and `8088` (HEC). Every REST-driven Ansible task — anything
  using the `splunk_api` module — talks to `8089`. Any host-side Ansible layer
  needs that port published first. It is a one-line change to the `docker run`
  invocation, but exposing splunkd's management port on a workstation holding
  evidence deserves a deliberate decision, and binding it to localhost.
- **The image is `splunk/splunk:latest`, and the documented upgrade path is not
  available.** Splunk requires both `/opt/splunk/var` and `/opt/splunk/etc`
  mounted, plus `SPLUNK_UPGRADE=true`, to upgrade an instance. This project
  mounts only `var` by design. So if `latest` rolls to a new Splunk version, a
  redeploy puts a newer Splunk against an existing index volume without the
  supported upgrade procedure.

  Pinning the tag (`splunk/splunk:9.x.y`) would make that a deliberate,
  scheduled action instead of something that happens on whichever redeploy
  happens to follow an upstream release. Not changed yet — pinning is a
  decision about which version you want to run.
- `deploy-splunk.sh` runs `sudo chmod -R 777` over `ansible/`, `splunk/`, and
  `data_store/` to work around container UID mismatch. This is a workaround, not
  a fix, and it is one of the things a proper Ansible layer should eliminate.
