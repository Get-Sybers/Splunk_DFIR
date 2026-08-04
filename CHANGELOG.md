# Changelog

All notable changes to this project are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

While the major version is `0`, **anything may change without notice** — paths,
script names, sourcetypes, field names, and app layouts included.

## [Unreleased]

### To be resolved before `0.2.0-beta`

- MITRE CAR field mapping — the headline feature, currently unimplemented.
- Automated tests. Nothing in the repository is verified automatically.
- **"Ansible it all"** — drive the whole pipeline through Ansible rather than
  injecting three playbooks into the container at boot. Staged plan in
  [docs/Ansible-Roadmap.md](docs/Ansible-Roadmap.md). Note this requires
  publishing port 8089 first (see Known issues below).
- `scripts/v2/` path-resolution bug (see `0.1.0-alpha` notes below).
- Redistribution rights for the two bundled Splunk apps.
- Whether to delete the 94 never-executed vendored Ansible files, which would
  drop the project's largest third-party obligation at no functional cost.

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
  It runs *inside* the Splunk container via `SPLUNK_ANSIBLE_PRE_TASKS`; there is
  no inventory, no roles, and `ansible-playbook` is never run on the host. Of
  the 101 files under `ansible/`, only the 5 in `playbooks/` are mounted, only 3
  of those are wired in, and exactly 2 are original work. The 94 files in
  `tasks/` and `default_playbooks/` are never executed.
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
- `ansible/playbooks/Install-ThirdParty-Apps.yml` — installs operator-supplied
  Splunk app packages at container start, then applies project overrides into
  each app's `local/` directory rather than editing `default/`, so they survive
  an app upgrade. Overlay lives in `splunk/etc/apps_local/<App>/local/`.
- `tests/run-checks.sh` — the repository had no automated verification of any
  kind. 90 static checks covering shell syntax, shellcheck, repo-root path
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

- **`Splunk_TA_zeek` and `sankey_diagram_app` are no longer vendored.** Neither
  declared a licence permitting redistribution — both carried
  `"license": {"name": null, "text": null, "uri": null}` in their
  `app.manifest`. They are now supplied by the operator: Splunkbase packages go
  in `data_store/dependencies/splunk_apps/` and are installed into the container
  at deploy time by the new `Install-ThirdParty-Apps.yml` playbook.

  Installation is offline-first — it reads local package files and never
  reaches the network, because Splunkbase requires an authenticated session and
  forensic workstations are often air-gapped.

  Both are load-bearing, so this has a real cost: without `Splunk_TA_zeek`, Zeek
  logs ingest unparsed (it supplies the TSV parsing and the `zeek:*` sourcetype
  routing), and without `sankey_diagram_app` three panels in the BASELINE
  *BSL-host_triage* dashboard error. `deploy-splunk.sh` now checks for both
  before deploying and names the specific consequence of continuing without each.

- **`ansible/` went from 101 files to 3.** An audit established that nothing in
  the repository executed 94 of them: only `ansible/playbooks/` is bind-mounted
  into the container, and the `splunk/splunk` image already ships its own copy
  of splunk-ansible internally. Removed `ansible/tasks/` (79 files),
  `ansible/default_playbooks/` (15), two zero-byte `ansible/scripts/`
  placeholders, and the two unwired playbooks — `copy_installed_apps.yml` (never
  referenced) and `disable_popups.yml` (superseded by the
  `SPLUNK_DISABLE_POPUPS` environment variable).

  What remains is three playbooks, all wired as pre-tasks, all passing
  `ansible-lint` at its `production` profile. The pipeline is unaffected, since
  nothing ran any of the removed files.

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
  ./scripts/deploy-splunk.sh --purge        # wipe indexes, start clean
  ./scripts/deploy-splunk.sh --purge --yes  # unattended
  ./scripts/deploy-splunk.sh --help
  ```

  Also `--ask`, `--no-replace`, `--skip-chmod`, `-y/--yes`, `-h/--help`. Flags
  win over the equivalent environment variables.

  `--purge` deletes the index volume **after** the container is removed, since
  Docker refuses to remove a volume still attached to one. It confirms unless
  `--yes`, and refuses outright when there is no terminal to confirm on rather
  than destroying evidence indexes unprompted. Raw and processed evidence on
  disk is untouched — only the Splunk indexes and fishbucket go.

  `scripts/purge-splunk-container.sh` remains, for purging without redeploying,
  and now points at the flag.
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

  Now: attached to an `--internal` Docker network (no route off the host), with
  ports published on `127.0.0.1` only. `--no-isolated` and `--bind ADDR` opt out
  deliberately.

  **The deploy proves it rather than claiming it.** After the container is up it
  opens a TCP connection from inside to a public address; if that succeeds while
  isolation was requested, the deploy fails loudly instead of reporting a
  control that isn't holding. It also reads back the real port bindings, because
  Docker's rules sit ahead of the host firewall and `ufw` won't catch a wrong
  bind address.

  If the network already exists but isn't `Internal`, the deploy refuses rather
  than silently attaching to it.

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
- `Splunk_TA_kape` is a stub containing only `transforms.conf`.
- Raw EVTX files are visible to Splunk but will not ingest.

[Unreleased]: https://github.com/Get-Sybers/Splunk_DFIR/compare/v0.1.0-alpha...HEAD
[0.1.0-alpha]: https://github.com/Get-Sybers/Splunk_DFIR/releases/tag/v0.1.0-alpha
