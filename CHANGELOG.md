# Changelog

All notable changes to this project are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

While the major version is `0`, **anything may change without notice** — paths,
script names, sourcetypes, field names, and app layouts included.

## [Unreleased]

### To be resolved before `0.2.0-beta`

- MITRE CAR field mapping — the headline feature, currently unimplemented.
- **A pipeline test.** `tests/run-checks.sh` gates CI on 142 static checks, but
  nothing exercises the pipeline. Every defect that actually bit — including the
  three this release introduced — was a runtime failure that static checks could
  not have caught.
- **Runtime verification of this release's fixes.** None have been executed;
  tracked as issues #5, #6, #8, #9 and #11.
- **"Ansible it all"** — drive the whole pipeline through Ansible rather than
  injecting playbooks into the container at boot. Staged plan in
  [docs/Ansible-Roadmap.md](docs/Ansible-Roadmap.md), which narrows the scope to
  Splunk lifecycle and config. Note this requires publishing port 8089 first
  (see Known issues below).
- **Delete `scripts/v2/`.** Its path resolution was corrected in
  `0.1.0-alpha`, but it remains a divergent duplicate carrying none of the
  persistence, collision or readiness fixes — so running it still gets the old
  broken behaviour.
- Whether to pin the Splunk image tag (see Known issues below).

## [0.1.0-alpha] - 2026-08-03

First tagged release. The project is roughly fifteen months old and had never
carried a version, a licence, or an accurate statement of what worked. This
release fixes that. **It does not change pipeline behaviour.**

### Added

- `LICENSE` — Apache-2.0. Chosen by auditing what the repository actually
  redistributes rather than by preference; see `THIRD_PARTY_NOTICES.md`.
- `NOTICE` — Apache-2.0 §4 attribution for splunk-ansible, Splunk Security
  Content, and MITRE CAR.
- `THIRD_PARTY_NOTICES.md` — full provenance for every vendored component and
  every tool the pipeline drives, separating obligations that bind the project
  from those that bind the operator. Three substantial vendored sources were
  identified: splunk-ansible (97 of the 101 files under `ansible/`), Splunk
  Security Content / ESCU lookups
  (77 files, ~3 MB, across the `DETECT` and `BASELINE` apps), and the MITRE CAR
  data model. All three are Apache-2.0, and none carried attribution before this
  release.
- `CHANGELOG.md` — this file.
- `docs/Ansible.md` — documents how Ansible actually works in this project.
  It runs *inside* the Splunk container via `SPLUNK_ANSIBLE_PRE_TASKS` and
  `SPLUNK_ANSIBLE_POST_TASKS`; there is no inventory, no roles, and
  `ansible-playbook` is never run on the host. The audit that prompted this
  found that of the 101 files then under `ansible/`, only the 5 in `playbooks/`
  were mounted and only 3 were wired in — the 94 files in `tasks/` and
  `default_playbooks/` were never executed. See Removed.
- `docs/Ansible-Roadmap.md` — staged plan for the "Ansible it all" beta target.
- **Windows Event Log ingestion** — `scripts/process-evtx-EvtxECmd.sh` and the
  `EvtxECmd_App` Splunk app. Splunk cannot read binary `.evtx`, and part of the
  long-standing "EVTX won't ingest" problem turned out to be simpler than
  suspected: **there was no monitor stanza for the EVTX directory at all.**

  The script runs EvtxECmd (MIT, operator-supplied) in a .NET container over
  `data_store/raw/other_raw_data/WinEvt/`, preserving per-host sub-directories,
  and is idempotent so re-running neither re-parses nor duplicates events in
  Splunk. `EvtxECmd_App` maps EvtxECmd's field names onto the ones the Splunk
  Add-on for Microsoft Windows uses — `EventCode`, `RecordNumber`, `LogName`,
  `SourceName`, `ComputerName` — plus CIM aliases, so searches written against
  that add-on work here. The add-on is not required and does not conflict.

  `host` is set at index time from each event's own `Computer` field, so records
  are attributed to the machine the log came from rather than to the Splunk
  container.

  The XML lane is deliberately **not** labelled `XmlWinEventLog` and is disabled
  by default. EvtxECmd's `Payload` is the `EventData` fragment only, and its
  `--xml` output is beautified with the namespace declaration stripped — so it
  is not the wire format the add-on's `XmlWinEventLog` sourcetype expects.
  Mislabelling it would look like it worked and silently under-extract.

  **None of this has been run against a real event log.** No Windows, no `.evtx`
  sample, no .NET, no Splunk in the environment it was written in.
- `ansible/playbooks/Apply-App-Overrides.yml` — applies project overrides into
  each installed app's `local/` directory rather than editing `default/`, so
  they survive an app upgrade. Overlay lives in
  `splunk/etc/apps_local/<App>/local/`. Runs as a **post-task**; see Removed
  for why.
- `tests/run-checks.sh` — the repository had no automated verification of any
  kind. 142 static checks covering shell syntax, shellcheck, repo-root path
  resolution, Ansible task-file lint, Splunk conf sanity, app versioning,
  evidence-gitignore coverage, secret patterns, and documentation links. Exits
  non-zero, so it can gate CI.
- `CONTRIBUTING.md` — the README invited PRs with no guidance behind it. Covers
  the evidence-safety rule, the attribution rule for vendored code, and what the
  task board's ✅/⚠️/❌ marks are supposed to mean.
- `SECURITY.md` — reporting process plus an explicit list of known weaknesses
  (`chmod -R 777`, no Splunk auth, unpinned `:latest` containers, unverified
  vendored apps) so they don't get reported as discoveries.
- Known Limitations section in `project-progress.md`.
- Explicit warnings in `README.md` covering KAPE's non-commercial restriction,
  Splunk's proprietary licence and auto-acceptance, and evidence-handling risk.

### Removed

- **Third-party apps install via the image's own `SPLUNK_APPS_URL`.** An earlier
  iteration of this release used a custom `Install-ThirdParty-Apps.yml` playbook
  for it. That was unnecessary — the `splunk/splunk` image already reads
  `SPLUNK_APPS_URL` (comma-separated) and installs each entry during its
  provisioning role. `deploy-splunk.sh` now builds that value from the mounted
  package directory.

  This still works offline: splunk-ansible's `install_apps.yml` only downloads
  entries matching `http(s)://` or `file://`; a bare local path is stat'd and
  used directly. Which matters, because the container has no network access.

  The custom playbook is reduced to `Apply-App-Overrides.yml` — just the
  `local/` overlay — and moved to `SPLUNK_ANSIBLE_POST_TASKS`. `site.yml` runs
  `pre_tasks → role → post_tasks`, and the role is what installs the apps, so as
  a pre-task the overrides would have targeted directories that did not exist
  yet and silently applied nothing.
- **`Splunk_TA_zeek` and `sankey_diagram_app` are no longer vendored.** Neither
  declared a licence permitting redistribution — both carried
  `"license": {"name": null, "text": null, "uri": null}` in their
  `app.manifest`. They are now supplied by the operator: Splunkbase packages go
  in `data_store/dependencies/splunk_apps/` and are installed into the container
  at deploy time via `SPLUNK_APPS_URL`.

  Installation is offline-first — it reads local package files and never
  reaches the network, because Splunkbase requires an authenticated session and
  forensic workstations are often air-gapped.

  Both are load-bearing, so this has a real cost: without `Splunk_TA_zeek`, Zeek
  logs ingest unparsed (it supplies the TSV parsing and the `zeek:*` sourcetype
  routing), and without `sankey_diagram_app` three panels in the BASELINE
  *BSL-host_triage* dashboard error. `deploy-splunk.sh` now checks for both
  before deploying and names the specific consequence of continuing without each.

- **`splunk/etc/apps/Splunk_TA_kape/` deleted.** It was one zero-byte
  `transforms.conf` with no `app.conf`. Its real configuration was migrated into
  `Kape_App` on 2025-07-13 (`99eb95d`) — verified byte-identical: the same 20
  props stanzas and the same `extract_kape_sourcetype` transform. What remained
  was a leftover directory, but the docs described it as an unfinished stub, and
  "complete `Splunk_TA_kape`" sat on the roadmap for a year as work that had
  already been done elsewhere.
- **`ansible/` went from 101 files to 4.** An audit established that nothing in
  the repository executed 94 of them: only `ansible/playbooks/` is bind-mounted
  into the container, and the `splunk/splunk` image already ships its own copy
  of splunk-ansible internally. Removed `ansible/tasks/` (79 files),
  `ansible/default_playbooks/` (15), two zero-byte `ansible/scripts/`
  placeholders, and the two unwired playbooks — `copy_installed_apps.yml` (never
  referenced) and `disable_popups.yml` (superseded by the
  `SPLUNK_DISABLE_POPUPS` environment variable).

  What remains is four playbooks — three pre-tasks and one post-task — all
  wired in and all passing `ansible-lint` at its `production` profile. The
  pipeline is unaffected, since nothing ran any of the removed files.

  This also removed **the project's largest third-party obligation** at zero
  functional cost. splunk-ansible attribution now covers a single modified file
  rather than 97. The deleted files remain in git history, so `NOTICE` still
  carries the attribution for anyone working from an older commit.

### Changed

- **`deploy-splunk.sh` takes `--purge` and `--persist` flags.** It previously
  parsed no arguments at all — everything was environment variables. With the
  container redeployed every time, whether that deploy keeps or wipes indexed
  data is the decision you make most often, so it belongs on the command line.

  ```bash
  ./scripts/deploy-splunk.sh                # --persist (default): keep indexes
  ./scripts/deploy-splunk.sh --purge        # wipe indexes, THEN REDEPLOY
  ./scripts/deploy-splunk.sh --purge-only   # wipe indexes and STOP
  ./scripts/deploy-splunk.sh --purge --yes  # unattended
  ./scripts/deploy-splunk.sh --help
  ```

  Also `--ask`, `--no-replace`, `--skip-chmod`, `--isolated`, `--no-isolated`,
  `--bind ADDR`, `-y/--yes`, `-h/--help`. Flags win over the equivalent
  environment variables.

  `--purge` is a flag on the *deploy* script, so it wipes and then deploys.
  `--purge-only` wipes and exits, for when you just want the data gone — as
  does `scripts/purge-splunk-container.sh`.

  Either way the index volume is deleted **after** the container is removed,
  since Docker refuses to remove a volume still attached to one. It confirms
  unless `--yes`, and refuses outright when there is no terminal to confirm on
  rather than destroying evidence indexes unprompted. Raw and processed
  evidence on disk is untouched — only the Splunk indexes and fishbucket go.
- **Redeploying the Splunk container is now the default path, not an
  exception.** `deploy-splunk.sh` removes and rebuilds an existing container
  without prompting. The previous prompt defaulted to *No*, so a workflow that
  redeploys every time would have aborted on every run.

  This is only safe because index data now lives in a named volume — before that
  fix, an unattended `docker rm` meant silent total data loss. `SPLUNK_REPLACE`
  accepts `always` (default), `ask`, or `never`.
- **The admin password can be supplied non-interactively**, via
  `SPLUNK_PASSWORD_FILE` (preferred) or `SPLUNK_PASSWORD`. It still prompts when
  a terminal is available, and fails with a clear message when there is neither
  a password nor a TTY, instead of hanging. A file is preferred over the
  environment because a process's environment is more widely readable — though
  the password reaches the container as `-e SPLUNK_PASSWORD` either way, so it
  is visible in `docker inspect` regardless.
- `deploy-splunk.sh` now prints what survives a redeploy and what does not:
  indexes and the fishbucket persist in the volume; `/opt/splunk/etc` is rebuilt
  from `splunk/etc/` every deploy, so repo edits apply on the next one and
  UI-made changes are lost.
- `SPLUNK_SKIP_CHMOD=1` skips the permission fixup. It is O(files) over
  `data_store/processed` and, with redeploy-every-time, runs on every deploy —
  minutes of stat+chmod for no change on a large case. Left on by default
  because wrong permissions stop the container starting, and a slow deploy is a
  better failure than a broken one.
- Replaced an `ls | grep` third-party package check with a glob loop, so a
  filename containing a space cannot confuse the match.

- **Project status is now stated as alpha/experimental.** It was previously
  "In-Development", which understated how much of the headline feature is
  missing.
- **Splunk app versions demoted `1.0.0` → `0.1.0`** across the six first-party
  apps (`BASELINE`, `DETECT`, `Kape_App`, `Log2timeline_App`, `Rekall_App`,
  `Velociraptor_App`). They were declaring a stable release while the project
  had no release at all. Third-party app versions are left untouched, as they
  reflect upstream releases.
- `README.md` rewritten with a capability table distinguishing what works, what
  is partial, and what is not delivered.
- `project-progress.md` rewritten. Several items previously marked done are now
  marked partial, and the empty Data Model column is called out as the reason
  this is alpha rather than beta.
- Documentation corrected throughout — stale script names, wrong output paths,
  and broken cross-references.

### Security

- **The Splunk container no longer reaches the network, and is no longer
  reachable from it.** It previously ran on the default bridge with
  `-p 8000:8000` / `-p 8088:8088`, which binds `0.0.0.0` — every interface, so
  anyone on the LAN could reach the UI — with unrestricted outbound access. On
  a workstation holding evidence, both are wrong by default.

  Now: attached to a dedicated Docker bridge with **IP masquerade disabled**, so
  outbound traffic leaves with an unroutable source address and gets no reply,
  with ports published on `127.0.0.1` only. `--no-isolated` and `--bind ADDR`
  opt out deliberately.

  ⚠️ **This was first implemented with `--internal`, which broke the UI.** An
  internal network removes external connectivity in *both* directions, so
  published ports stop forwarding and Splunk becomes unreachable on
  `localhost:8000` — see Fixed. The masquerade approach is deliberately weaker:
  it breaks return traffic rather than dropping packets, so a host with its own
  forwarding rules can still let traffic out. For a hard guarantee, add a
  `DOCKER-USER` firewall rule on the network's subnet.

  **The deploy proves it rather than claiming it, in both directions.** It opens
  a TCP connection from inside the container to a public address and warns if
  that succeeds, and it retries the published port from the host and **fails the
  deploy** if Splunk doesn't answer. It also reads back the real port bindings,
  because Docker's rules sit ahead of the host firewall and `ufw` won't catch a
  wrong bind address.

  Egress failure warns rather than aborting: a weakened control is not a reason
  to leave the operator without a working Splunk. Ingress failure is fatal,
  because that deploy is unusable.

  Not an airgap, and documented as such: containers on that network can still
  reach each other and host services on the bridge address.

- **Closed an evidence-leak hole in `data_store/.gitignore`.** It was an
  extension blocklist and had already failed in practice: VMware exports
  (`.vmdk`, `-flat.vmdk`, `.vmx`, `.ovf`, `.ova`, `.vmsd`, `.vmxf`) were fully
  committable, because VMware support was added to the pipeline without updating
  the list — and `data_store/raw/VM_files/` is the documented drop location.
  Replaced with deny-by-default plus a skeleton allowlist, which also covers
  extensionless files and any format added later. Verified that all 23 tracked
  skeleton files remain tracked and that the directory structure survives.

### Fixed

Three of these were introduced by this release's own changes and found only
when someone ran it. They are listed first, because how they got in matters.

- **The Splunk UI was unreachable on `localhost:8000`.** The network isolation
  above was first built with `docker network create --internal`, on the
  assumption that published ports would keep working. They do not — an internal
  network has no external connectivity in either direction, so the container was
  isolated from the host as well as from the internet.

  It shipped because **the deploy's isolation check tested egress and only
  egress.** Isolation is a two-directional property verified in one direction,
  so the deploy printed `✅ isolation holds` over a Splunk nobody could reach.
  The fix is the mechanism swap above *plus* an ingress check; the missing check
  is the actual defect. A redeploy detects the bad network and recreates it.
- **`--purge` redeployed the container.** It is a flag on the deploy script, so
  wiping the indexes was always followed by a fresh deploy — never stated, and
  not what "purge" implies. Added `--purge-only`, which wipes and exits.
- **The deploy's own diagnostics were buried by a log firehose.** The script
  backgrounds `docker logs -f` while waiting for Ansible, inherited from the
  original where it was the last thing before exit. Verification steps were then
  added *after* it — so the isolation verdict, the port bindings and the
  reachability failure banner all printed into a stream of Splunk logs. `docker
  logs -f` never exits and bash does not SIGHUP background jobs on exit, so it
  also outlived the script. Now tracked by PID, stopped once the wait ends, with
  an EXIT trap for the early-failure paths.
- **`purge-splunk-container.sh` removed every dangling Docker volume on the
  host**, while announcing it was removing volumes "related to Splunk". On a
  machine with other Docker work that destroyed unrelated data. It now captures
  the container's own anonymous volumes *before* `docker rm` and removes exactly
  those; other dangling volumes are reported, not deleted.
- **A stale `**` allowlist in `data_store/.gitignore`.** The deny-by-default
  rewrite carried `!dependencies/SuperMem/**` over from the old blocklist
  without checking whether it still applied — SuperMem was deleted in 2025-09
  (`dc58d8c`). That left an open-ended hole pointed at a memory-forensics tool's
  directory, in the file whose whole purpose is keeping evidence out. Removed,
  and a check now fails on any allowlist rule targeting a path that doesn't
  exist.
- **A CI step ran unconditionally.** Written as
  `command -v x || echo skip && run x`, which shell precedence groups as
  `(command -v x || echo skip) && run x` — so `run x` executed whether or not
  the tool was present. Rewritten as an explicit `if` block.

- **The persistence fix had quietly dropped the original storage design.**
  Every other mount in this project is staged under `/data/` and copied into
  place by a playbook, which is why they are all `:ro`. `splunk/var` was the one
  read-write mount — index data was meant to land in the repo, and
  `splunk/.gitignore` still carries a `var/**` + `!var/.gitkeep` block for
  exactly that. The bug was only the mount *point*: `/data/var` instead of
  `/opt/splunk/var`.

  Replacing it with a named volume fixed persistence but moved indexes into
  Docker's internal storage, out of sight and onto whichever disk holds
  `/var/lib/docker` — which on a workstation indexing a large case may not be
  the one with room. `--var-dir PATH` / `SPLUNK_VAR_DIR` restores the host
  directory as an option (`--var-dir ./splunk/var` for the original layout).
  The volume stays the default because Docker seeds it from the image with the
  right ownership; in `--var-dir` mode the deploy reads the splunk UID from the
  image and chowns the directory rather than letting startup fail obscurely.
- **Splunk kept no persistent state.** `deploy-splunk.sh` mounted `splunk/var`
  at `/data/var`, which Splunk never reads, while its real data directory
  (`$SPLUNK_DB` → `/opt/splunk/var`) was not mounted at all — so every index and
  the fishbucket were destroyed with the container. Index data now lives in a
  named Docker volume (`SPLUNK_VAR_VOLUME`, default `splunk-dfir-var`) mounted
  at `/opt/splunk/var`. A named volume rather than a bind mount, so Docker seeds
  it from the image and the container's splunk-user ownership survives.
- **`purge-splunk-container.sh` would have left every index behind**, since
  `docker rm` does not remove a named volume. It now removes the volume
  explicitly and still clears the legacy directory.
- **`host = extracted_host`** in `inputs.conf` was a literal string, so Splunk
  labelled every event with the text `extracted_host`. Removed — `[l2t:csv]`
  already sets host via `TRANSFORMS-set_host` from the CSV's `hostname` field.
- **`Include-local-conf.yml` gated all four copy tasks on one `limits.conf`
  stat**, making edits to `indexes.conf` and `inputs.conf` permanent no-ops.
  Each file is now stat'd individually; conf mode corrected `0755` → `0644`.
- **`deploy-splunk.sh` could report success having deployed nothing.** It now
  refuses to collide with an existing container, captures the container ID and
  polls readiness by ID rather than by name, detects a container that dies
  mid-startup, and uses a configurable 600s timeout instead of a hard 60s.
- **Privileged recursive `chown`/`chmod` ran on unquoted paths**, so a repo path
  containing a space would have word-split and targeted unintended directories.
  All quoted across `scripts/`, `scripts/v2/` and `scripts/deprecated/`.
- **Seven scripts resolved the repository root one level wrong** — four in
  `scripts/v2/` and three in `scripts/deprecated/`. All corrected.
- `dev-scripts/structure-tree.sh` had an unclosed `$(` on line 7 and would not
  parse at all. Every shell script in the repository now passes `bash -n`. (The
  script's tree formatting is still rough; it is an unsupported dev helper.)
- Corrected a misleading mount message in `deploy-splunk.sh` — it announced
  `splunk/ansible → /data/ansible`, a directory that does not exist. The real
  mount is `ansible/playbooks → /data/ansible/playbooks`. Message only, no
  behaviour change.
- `docs/Dir-Structure.md` listed a `splunk/ansible/` tree that does not exist,
  and omitted `dev-scripts/`, `raw/VM_files/`, and `raw/memory/`.
- Author field typo `get-syebrs` → `get-sybers` in four `app.conf` files
  (`DETECT`, `Kape_App`, `Log2timeline_App`, `Rekall_App`).
- Empty `description` fields populated across first-party apps.
- Broken documentation links, including a case-mismatched `dir-structure.md`
  reference that fails on case-sensitive filesystems, and a link to a
  `Log2timeline_App.md` that does not exist.
- Documentation referenced `setup_environment.sh` and
  `process-log2timeline-ALL.sh`; the actual scripts are `setup-environment.sh`
  and `process-log2timeline-Dynamic.sh`.
- Documentation pointed raw PCAPs at `data_store/raw/pcap/`; the real directory
  is `data_store/raw/pcaps/`.
- Documentation claimed Plaso output lands in `processed/log2timeline/json/`; it
  lands in `csv/`.

### Known issues

- `scripts/v2/` is broken and excluded from this release. Four of its seven
  scripts still compute `REPO_ROOT_DIR` as `$SCRIPT_DIR/..` — correct in
  `scripts/`, one level short in `scripts/v2/` — and so resolve the repository
  root to `<repo>/scripts`. Use `scripts/`, which resolves correctly and
  carries the same feature set.
- **`chmod -R 777` remains** on `data_store/`, `splunk/` and `ansible/`. It is
  a workaround for the container/host UID mismatch; replacing it needs a
  permission model decided against a running container.
- **None of this release's fixes are runtime-tested.** There is no Docker,
  Splunk, or evidence in the environment they were made in. They are statically
  verified only.
- **Splunk's management port 8089 is not published.** `deploy-splunk.sh` maps
  only 8000 and 8088, so the splunkd REST API is unreachable from the host. This
  does not affect the current pipeline, but it blocks any host-side Ansible that
  uses the `splunk_api` module — a prerequisite for the beta plan.
- Processing scripts `chmod -R 777` their working directories.
- **77 lookup CSVs ship and 74 are inert** — `DETECT` defines 1 of 61,
  `BASELINE` 0 of 16 (its `lookups.conf` is zero bytes), `Log2timeline_App` 1 of
  2. Splunk cannot use an undefined lookup, so ~3 MB of Splunk Security Content
  ships, carries the project's largest attribution obligation, and does nothing.
- **The EVTX lane is built but unverified.** `process-evtx-EvtxECmd.sh` and
  `EvtxECmd_App` have never been run against a real event log — no Windows, no
  `.evtx` sample, no .NET in the environment they were written in.
- **The image is `splunk/splunk:latest` and the documented upgrade path does
  not apply.** Splunk requires both `/opt/splunk/var` and `/opt/splunk/etc`
  mounted plus `SPLUNK_UPGRADE=true` to upgrade an instance; this project mounts
  only `var` by design, so `etc` is rebuilt drift-free from the repo. If
  `latest` rolls to a new version, a redeploy puts newer Splunk against an
  existing index volume outside the supported procedure. Pinning the tag would
  make that deliberate — deferred, because it is a decision about which version
  you want to run.

[Unreleased]: https://github.com/Get-Sybers/Splunk_DFIR/compare/v0.1.0-alpha...HEAD
[0.1.0-alpha]: https://github.com/Get-Sybers/Splunk_DFIR/releases/tag/v0.1.0-alpha
