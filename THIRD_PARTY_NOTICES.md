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
| MITRE CAR data model | `car_data_model.json` | [mitre-attack/car](https://github.com/mitre-attack/car) | Apache-2.0 |

### MITRE CAR

`car_data_model.json` is the MITRE CAR object/field/action model. Apache-2.0,
attribution required — hence `NOTICE`. The check harness pins the CAR functions
in `kusto/schema/40-mitre.kql` against it, so it is load-bearing, not
decorative.

### DFIR test samples — catalogued, not redistributed

**This repository ships no sample data at all.** `dev-scripts/samples-manifest.tsv`
catalogues 860 files (2.8 TB) held by [Digital Corpora](https://digitalcorpora.org/),
recording their public URLs, sizes and hashes so `dev-scripts/fetch-samples.sh`
can retrieve them. Nothing is copied into this repository, so **no
redistribution obligation attaches to this project** for any of it.

That is a genuine change in kind, not bookkeeping. An earlier revision did
commit twelve of these files, two of them GPL-licensed, which meant carrying
their licence texts and passing them on. Fetching instead of vendoring retires
that obligation entirely.

The terms still bind whoever downloads them, and they are not uniform:

| Source | Licence / terms |
|---|---|
| NPS corpora (`drives-nps-*`, `scenarios-2011-nps-*`) | Public domain / unrestricted research use |
| DFTT images — `8-jpeg-search`, `12-carve-ext2` (Brian Carrier, Nick Mikus) | **GPL.** Redistributing them means carrying the GPL text and their READMEs; simply downloading them does not |
| The Sleuth Kit test data | IBM-PL / CPL / GPL, mixed per file |
| Magnet CTF sets (`scenarios-magnet`) | Published by Magnet Forensics for **training and competition**. Not public domain — check their terms before commercial use or onward redistribution |
| DFRWS challenge data (`dfrws-challenge-2021`) | Released for the DFRWS forensic challenge; research and education |
| Scenario corpora (LoneWolf, Narcos, Owl, Tuck, NGDC, Linux threat-analysis) | Produced for forensic education; generally free for research and teaching, several with citation requests recorded in their Digital Corpora READMEs |

None of these are case evidence. `data_store/` remains deny-by-default and
holds nothing, and `samples/` is now written the same way.

---

---

## Formerly vendored components

Removed from the working tree, but **still in git history** — their
attributions continue to apply to anyone working from an older commit. All of
these left with the Splunk stack when the SIEM moved to the Kusto emulator.

### splunk-ansible (Apache-2.0)

One modified file (`ansible/playbooks/remove_first_login.yml`) shipped until
the Splunk retirement. Before that, earlier releases vendored 97 further files
under `ansible/tasks/` and `ansible/default_playbooks/`; an audit established
that *nothing in the repository ever executed them* — only
`ansible/playbooks/` was bind-mounted into the container, and the
`splunk/splunk` image ships its own copy of splunk-ansible internally. They
were removed in v0.2.0-beta; the provenance audit (61 byte-identical to
upstream `develop`, 18 modified, none original) is recorded in that release's
history.

### Splunk Security Content (ESCU) lookups (Apache-2.0)

The `DETECT` and `BASELINE` Splunk apps shipped **77 lookup files, roughly
3 MB**, from [splunk/security_content](https://github.com/splunk/security_content),
authored by the Splunk Threat Research Team and contributors. Filenames
carried a local taxonomy prefix (`bad_`, `com_`, `sus_`); contents and their
upstream identifiers were unmodified, and the YAML sidecars retained upstream
provenance. Some aggregate other projects' data upstream (HijackLibs,
LOLDrivers, LOLBAS). Removed with the Splunk apps.

### Third-party Splunk apps — never vendored after v0.2.0-beta

`Splunk_TA_zeek` (Corelight Add-on for Zeek, by Aplura, LLC) and
`sankey_diagram_app` (Splunk Inc., EOL) were vendored until `v0.2.0-beta`.
Both declared `"license": {"name": null, ...}` in their `app.manifest` — no
licence grant permitting redistribution — so they were removed and supplied by
the operator instead, until the Splunk path itself was retired. They remain in
git history before `v0.2.0-beta`; the position above applies to anyone working
from those commits.

---

## Invoked tools

Run by this project, not shipped with it. **These bind the operator, not this
repository.**

| Tool | How it is used | Licence | Operator obligation |
|---|---|---|---|
| [Plaso / log2timeline](https://github.com/log2timeline/plaso) | `log2timeline/plaso:latest` container | Apache-2.0 | None |
| [Zeek](https://zeek.org/) | `zeek/zeek:latest` container | BSD-3-Clause | None |
| [Azure Data Explorer Kusto emulator](https://learn.microsoft.com/en-us/azure/data-explorer/kusto-emulator-overview) | `mcr.microsoft.com/azuredataexplorer/kustainer-linux:latest` container — **the analysis backend** | **Proprietary** — Microsoft Software License Terms | See below |
| [EvtxECmd](https://github.com/EricZimmerman/evtx) | `scripts/process-evtx-EvtxECmd.sh` runs operator-supplied `EvtxECmd.dll` in a .NET container | **MIT** | None — no commercial-use restriction |
| [Velociraptor](https://github.com/Velocidex/velociraptor) | JSON output normalised by `dev-scripts/`; Kusto loader not yet implemented | AGPL-3.0 | None — output ingestion does not trigger AGPL |
| [Rekall](https://github.com/google/rekall) | JSON output normalised by `scripts/process-rekall-json.sh`; Kusto loader not yet implemented | Apache-2.0 | None. Upstream is archived/unmaintained |

No tool binaries are vendored in this repository — every tool above is either
pulled as a container image or supplied by the operator.

**Formerly invoked: KAPE** (Kroll Artifact Parser and Extractor). The KAPE
PowerShell automation was removed in favour of the planned **Velociraptor
offline collectors running the EZ Tools** — the same Zimmerman parsers under
MIT-style licences, without KAPE Solo's non-commercial restriction, which was
the sharpest licensing constraint this project carried. Nothing of KAPE was
ever vendored, so no attribution debt remains; the scripts are in git
history.

### Azure Data Explorer Kusto emulator — read before commercial use

The Kusto emulator is the analysis backend, deployed by
`scripts/deploy-kusto.sh`. It is **not vendored** — the image is pulled from
Microsoft's registry — so this is a constraint on you rather than on this
code.

Microsoft's own documentation states the emulator is:

- **"Provided *as-is*, without any support or warranties"**
- **"generally unsuitable for production workloads"**

and its licence terms prohibit publishing benchmark results, since the emulator
is not optimised for that.

Three consequences worth stating plainly:

1. **`ACCEPT_EULA=Y` is set on your behalf** by `deploy-kusto.sh`. You are
   accepting Microsoft's Software License Terms by running it. Read them if
   that matters for your engagement.
2. **Whether "unsuitable for production" bars use in paid DFIR work is a
   question this project cannot answer for you.** It is Microsoft's framing of
   the tool's fitness, not an explicit non-commercial clause — but it is close
   enough to the same class of question to deserve care. For casework where
   the answer matters, read the EULA — or use a licensed Azure Data Explorer
   cluster, to which the same KQL schema applies.
3. The emulator has **no security features at all** — no authentication, no
   access control, plaintext HTTP, no encryption at rest. That is a documented
   property, not a misconfiguration. `deploy-kusto.sh` binds it to localhost
   and requires an explicit confirmation to do otherwise; see
   [docs/Kusto-Port.md](/docs/Kusto-Port.md).

Kusto Query Language itself, and the CAR mappings in `kusto/schema/`, are this
project's own work under Apache-2.0.

---

## Why Apache-2.0

The project licence was chosen to follow the vendored code rather than
preference:

1. The vendored code is Apache-2.0: `car_data_model.json` from MITRE today,
   and previously the ESCU lookups and splunk-ansible playbooks (retired, but
   still redistributed via git history). Matching that licence removes any
   compatibility question over anything the repository has ever shipped.
2. Apache-2.0's §4 obligations (retain licence, retain `NOTICE`, state
   modifications) are met naturally by shipping `LICENSE`, `NOTICE`, and this
   file, rather than bolted on.
3. Copyleft would be a poor fit. Nothing vendored is copyleft. Velociraptor is
   AGPL-3.0 but is *not* vendored — this project only processes its JSON
   output, which does not trigger AGPL obligations.
4. A more permissive licence such as MIT would be legally workable but would
   sit awkwardly over Apache-2.0 vendored code, and would not carry the
   `NOTICE` obligation the vendored code actually requires.

---

## Outstanding items

Known gaps. Listed because a release that hides them is worse than one that
does not.

- **Formerly vendored files were not individually marked as modified.**
  Apache-2.0 §4(b) requires modified files to carry prominent notices. The
  modified `remove_first_login.yml` and the renamed ESCU lookups were recorded
  in `NOTICE` but never marked in-file; they are now history-only, and this
  note is the record.
