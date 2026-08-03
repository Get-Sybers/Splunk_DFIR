# Third-Party Notices

This project redistributes third-party code and drives third-party tools. This
file records what comes from where, under what licence, and which obligations
are outstanding.

Two categories matter, and they matter differently:

- **Vendored** — code copied into this repository and redistributed with it.
  These licences bind the project and constrain what licence it can carry.
- **Invoked** — tools this project runs but does not ship. These impose no
  licence obligation on this repository, but they do constrain *you*, the
  operator, at run time.

---

## Vendored components

Code that ships inside this repository.

| Component | Path | Upstream | Licence |
|---|---|---|---|
| splunk-ansible | `ansible/tasks/`, `ansible/default_playbooks/` | [splunk/splunk-ansible](https://github.com/splunk/splunk-ansible) | Apache-2.0 |
| Splunk Security Content (ESCU) lookups | `splunk/etc/apps/DETECT/lookups/`, `splunk/etc/apps/BASELINE/lookups/` | [splunk/security_content](https://github.com/splunk/security_content) | Apache-2.0 |
| MITRE CAR data model | `car_data_model.json` | [mitre-attack/car](https://github.com/mitre-attack/car) | Apache-2.0 |
| Corelight Add-on for Zeek v1.0.8 | `splunk/etc/apps/Splunk_TA_zeek/` | Aplura, LLC (via Splunkbase) | Not declared |
| Sankey Diagram v1.6.0 | `splunk/etc/apps/sankey_diagram_app/` | Splunk Inc. (via Splunkbase, EOL) | Not declared |
| d3 sankey plugin | `splunk/etc/apps/sankey_diagram_app/appserver/static/visualizations/sankey_diagram/contrib/sankey.js` | [soxofaan/d3-plugin-captain-sankey](https://github.com/soxofaan/d3-plugin-captain-sankey) | d3-derived (BSD-3-Clause) |

### splunk-ansible

The Ansible layer is almost entirely not original work. Every one of the 79
files in `ansible/tasks/` traces to splunk-ansible: 61 are byte-identical to
upstream `develop`, and 18 differ. All 15 files in `ansible/default_playbooks/`
come from the same source, as do 3 of the 5 playbooks in `ansible/playbooks/`.
There are no original files in `tasks/` or `default_playbooks/` at all.

**97 of the 101 files under `ansible/` derive from splunk-ansible.** The
remainder is 2 original playbooks and 2 empty placeholder scripts.

This was verified by fetching each upstream file and diffing it.

Because splunk-ansible is Apache-2.0, redistributing it obliges this project to
retain the licence, carry a `NOTICE`, and state that modifications were made.
That is why this project is Apache-2.0 — see [Why Apache-2.0](#why-apache-20).

**The 94 files in `tasks/` and `default_playbooks/` are never executed.**
Nothing in the repository references
`ansible/tasks/` or `ansible/default_playbooks/`. Only `ansible/playbooks/` is
bind-mounted into the Splunk container, and the `splunk/splunk` image already
ships its own copy of splunk-ansible internally — see
[docs/Ansible.md](/docs/Ansible.md).

They are therefore a reference copy carrying the project's largest third-party
obligation for no runtime benefit. Deleting them would remove that obligation
entirely without affecting the pipeline. The alpha keeps them and complies;
whether to keep them is revisited in beta.

The three playbooks in `ansible/playbooks/` that *are* derived from
splunk-ansible (`copy_installed_apps.yml` verbatim, `disable_popups.yml` and
`remove_first_login.yml` modified) are covered by the same attribution.

### Splunk Security Content (ESCU) lookups

The `DETECT` and `BASELINE` apps ship **77 lookup files, roughly 3 MB**, that are
not original work. They come from Splunk Security Content (the Enterprise
Security Content Update project).

The YAML sidecars retain their upstream provenance:

```yaml
name: loldrivers
id: a4c71880-bb4a-4e2c-9b44-be70cf181fb3
author: Splunk Threat Research Team
description: A list of known vulnerable drivers
```

All 38 YAML sidecars carry an author field: 35 credit the Splunk Threat Research
Team and 3 credit Steven Dick, an ESCU contributor.

The filenames were given a local taxonomy prefix — `bad_`, `com_`, `sus_` — but
the `name:` field inside each file still holds the upstream name
(`sus_loldrivers.yml` → `name: loldrivers`, `bad_hijacklibs.yml` →
`name: hijacklibs`). The content is upstream; only the filenames changed.

splunk/security_content is Apache-2.0, so this is compatible and requires
attribution.

Note that some of these lookups aggregate other projects' data upstream —
`hijacklibs`, `loldrivers`, and `lolbas_file_path` derive from the HijackLibs,
LOLDrivers, and LOLBAS projects respectively. They are vendored here as Splunk
packaged them, and their own upstream terms sit behind Splunk's redistribution.

### MITRE CAR

`car_data_model.json` is the MITRE CAR object/field/action model. Apache-2.0,
attribution required.

### Bundled Splunk apps

`Splunk_TA_zeek` and `sankey_diagram_app` were both obtained from Splunkbase.
Both declare `"license": {"name": null, "text": null, "uri": null}` in their
`app.manifest` — that is, **neither carries a licence grant permitting
redistribution**. They are vendored here on the assumption that redistributing
freely-downloadable Splunkbase content is acceptable; that assumption has not
been confirmed with either publisher.

See [Outstanding items](#outstanding-items).

---

## Invoked tools

Run by this project, not shipped with it. **These bind the operator, not this
repository.**

| Tool | How it is used | Licence | Operator obligation |
|---|---|---|---|
| [Plaso / log2timeline](https://github.com/log2timeline/plaso) | `log2timeline/plaso:latest` container | Apache-2.0 | None |
| [Zeek](https://zeek.org/) | `zeek/zeek:latest` container | BSD-3-Clause | None |
| [Splunk Enterprise](https://www.splunk.com/) | `splunk/splunk:latest` container | **Proprietary** — Splunk General Terms | See below |
| [KAPE](https://www.kroll.com/en/services/cyber-risk/incident-response-litigation-support/kroll-artifact-parser-extractor-kape) | `scripts/Process-Kape-ALL.ps1` invokes operator-supplied `kape.exe` | **Proprietary** — Kroll EULA | See below |
| [Velociraptor](https://github.com/Velocidex/velociraptor) | JSON output ingested by `Velociraptor_App` | AGPL-3.0 | None — output ingestion does not trigger AGPL |
| [Rekall](https://github.com/google/rekall) | JSON output ingested by `Rekall_App` | Apache-2.0 | None. Upstream is archived/unmaintained |

No tool binaries are vendored in this repository. KAPE in particular is never
shipped — the PowerShell scripts expect the operator to place `kape.exe` under
`dependencies/kape/`.

### Splunk Enterprise licensing

`scripts/deploy-splunk.sh` starts the container with
`SPLUNK_START_ARGS=--accept-license`. **Running the deploy script accepts the
Splunk Software License Agreement on your behalf.** The default is Splunk's free
tier, which is volume-capped and lacks authentication and alerting features
relevant to multi-user work. Anything beyond evaluation needs a licence from
Splunk.

### KAPE licensing — read this before commercial use

KAPE Solo Edition is free **for non-commercial personal use, and for law
enforcement and comparable government agencies**. It is not free for business
use.

Kroll defines commercial use as use "undertaken for a business purpose, rather
than hobby, recreational, educational, or other purpose". Running the KAPE
automation in this repository as part of a paid engagement, on a client network,
or otherwise for a for-profit purpose requires a **KAPE Enterprise licence** from
Kroll.

This is the sharpest licensing constraint in the project, and it is a constraint
on you rather than on this code. Everything else here can be used commercially
under Apache-2.0. The KAPE path cannot, without a Kroll licence.

---

## Why Apache-2.0

The project licence was chosen to follow the vendored code rather than
preference:

1. The three largest vendored components are all Apache-2.0: the `ansible/`
   tree (97 of 101 files from splunk-ansible), the ESCU lookups (77 files
   across `DETECT` and `BASELINE`), and `car_data_model.json` from MITRE.
   Matching that licence removes any compatibility question.
2. Apache-2.0's §4 obligations (retain licence, retain `NOTICE`, state
   modifications) are met naturally by shipping `LICENSE`, `NOTICE`, and this
   file, rather than bolted on.
3. Copyleft would be a poor fit. Nothing vendored is copyleft. Velociraptor is
   AGPL-3.0 but is *not* vendored — this project only ingests its JSON output,
   which does not trigger AGPL obligations.
4. A more permissive licence such as MIT would be legally workable but would sit
   awkwardly over Apache-2.0 vendored code, and would not carry the `NOTICE`
   obligation the vendored code actually requires.

---

## Outstanding items

Known gaps. Listed because an alpha that hides them is worse than one that
does not.

- **Splunkbase redistribution is unconfirmed.** `Splunk_TA_zeek` and
  `sankey_diagram_app` declare no licence. Redistribution rights should be
  confirmed with Aplura/Corelight and Splunk respectively. If confirmation is
  not obtained, the cleaner fix is to remove both from the repository and have
  the deployment fetch them from Splunkbase at install time.
- **A referenced licence file is missing.**
  `sankey_diagram_app/.../visualization.js` opens with
  `/*! For license information please see visualization.js.LICENSE.txt */`, but
  `visualization.js.LICENSE.txt` was not included when the app was vendored. The
  bundle's own attribution for its minified dependencies is therefore
  unavailable. It should be restored from the upstream package.
- **`contrib/sankey.js` carries no licence header** — only a source URL comment.
  The upstream d3 licence text should accompany it.
- **Upstream modifications are not individually marked.** Apache-2.0 §4(b)
  requires modified files to carry prominent notices. The 18 modified
  `ansible/tasks/` files, the 2 modified playbooks, and the renamed ESCU lookups
  are recorded in aggregate in `NOTICE`, but not marked in-file.
- **The 94 never-executed Ansible files should probably just go.** Deleting
  `ansible/tasks/` and `ansible/default_playbooks/` would remove the single
  largest third-party obligation in this repository without affecting the
  pipeline, because nothing runs them. Deferred out of the alpha deliberately;
  see [docs/Ansible.md](/docs/Ansible.md).
- **`data_store/.gitignore` re-includes `dependencies/SuperMem/**`.** If SuperMem
  is placed there it would be committed, vendoring another third-party tool with
  unrecorded provenance. The rule is retained from the previous `.gitignore` and
  flagged for review.
