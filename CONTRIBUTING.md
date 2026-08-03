# Contributing

Contributions are welcome. This is an alpha-stage personal project, so expect
loose process and slow responses.

## Before you start

Read [What Actually Works](/README.md#what-actually-works) and the
[Known Limitations](/project-progress.md#-known-limitations). A lot of what
looks broken is known to be broken, and some of it is deliberately deferred.

The most useful contributions right now, roughly in order:

1. **Tests.** There are none. Anything that makes a "✅" on the task board
   checkable rather than a claim is the highest-value change available.
2. **MITRE CAR field mapping.** The headline feature, unimplemented. This is
   what gates beta.
3. **Fixing `scripts/v2/`** — see below.
4. **EVTX ingest.** Splunk sees the files and won't index them. Unsolved.

## Ground rules

**Never commit evidence.** `data_store/` is gitignored deny-by-default, but it
is a safety net, not a guarantee. Check `git status` before every commit, and
never use `git add -f` inside `data_store/`.

**Don't add third-party code without recording it.** If you vendor anything —
a Splunk app, a script, a library — add it to
[THIRD_PARTY_NOTICES.md](/THIRD_PARTY_NOTICES.md) with its upstream and licence.
The project is Apache-2.0 and that only stays true if attribution keeps up. See
[why](/THIRD_PARTY_NOTICES.md#why-apache-20).

**Be honest in the task board.** `project-progress.md` uses ✅ for
"ran end-to-end and produced correct output", ⚠️ for "runs but incomplete or
unverified", ❌ for "doesn't work". Over-claiming is how the board got into the
state that prompted the alpha rewrite. If you haven't run it, it isn't ✅.

## Scripts

Use `scripts/`. It resolves paths correctly for all seven scripts.

`scripts/v2/` is **broken and unsupported**: four of its seven scripts still
compute `REPO_ROOT_DIR` as `$SCRIPT_DIR/..`, the depth that is correct one
directory up, so they resolve the repo root to `<repo>/scripts`. If you want to fix it, the change is
`$SCRIPT_DIR/..` → `$SCRIPT_DIR/../..` in `deploy-splunk.sh`,
`setup-environment.sh`, `purge-splunk-container.sh`, and
`config-splunk-inputs.sh` — but it needs real testing with Docker before it can
be promoted, which is why it wasn't done in the alpha.

`scripts/deprecated/` is kept for reference. Don't build on it.

## Checks

Run this before submitting anything:

```bash
./tests/run-checks.sh          # 90 static checks; -v to see each one
```

It covers shell syntax, shellcheck, repo-root path resolution, Ansible
task-file linting, Splunk conf sanity, app versioning, evidence-gitignore
coverage, secret patterns, and documentation links. It exits non-zero on
failure.

It does **not** test the pipeline — nothing does yet. That is the single most
valuable contribution available (see above).

For PowerShell, `Invoke-ScriptAnalyzer`.

## Documentation

Docs drift badly in this repo — the alpha fixed a batch of links pointing at
renamed or nonexistent files. If you rename a script or move a directory, grep
for it:

```bash
grep -rn "old-name" --include="*.md" .
```

Internal links are checked relative to the repo root; a link like
`/docs/Dir-Structure.md` must match the file's real case, or it breaks on
GitHub and on any case-sensitive filesystem.

## Commits and PRs

- Describe *why*, not just what. The reasoning is the part that isn't in the diff.
- Keep unrelated changes in separate commits.
- If something is too involved to finish, say so in the PR and add it to
  `project-progress.md` rather than leaving it undocumented.

## Licensing of contributions

By contributing you agree your work is licensed under
[Apache-2.0](/LICENSE), the project's licence.
