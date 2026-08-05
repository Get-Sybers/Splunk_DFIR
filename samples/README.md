# DFIR test samples

**No sample data is committed to this repository.** This directory is
documentation and a landing place; everything is fetched on demand from
[Digital Corpora](https://digitalcorpora.org/) by
[`dev-scripts/fetch-samples.sh`](/dev-scripts/fetch-samples.sh).

They exist because the project's largest gap is that **nothing has been run
against real evidence** —
[issue #14](https://github.com/Get-Sybers/DX_DFIR/issues/14) is the checklist
they are meant to satisfy.

> **None of this is case evidence, and this directory must never hold any.**
> Real evidence goes in `data_store/`, which is deny-by-default precisely so it
> cannot be committed. That control is unchanged. `samples/.gitignore` is now
> written the same way — deny everything, re-include only this file and the
> `.gitignore` itself — so a new image format cannot slip in the way it once
> did in `data_store/` (defect 7).

## A small starter set

Twelve small files, 91 MB in total, that used to be committed here. They are
now fetched like everything else, and every one is hash-pinned:

```bash
./dev-scripts/fetch-samples.sh --fetch drives-dftt-2004
./dev-scripts/fetch-samples.sh --fetch drives-nps-2009-ntfs1
./dev-scripts/fetch-samples.sh --fetch scenarios-2008-nitroba
```

| File | Format | Size | Group |
|:---|:---|---:|:---|
| `ntfs1-gen0.E01` | EnCase EWF | 1.1 MB | `drives-nps-2009-ntfs1` |
| `ntfs1-gen0.aff` | **AFF** | 272 KB | `drives-nps-2009-ntfs1` |
| `nps-2010-emails.E01` | EnCase EWF | 508 KB | `drives-nps-2010-emails` |
| `exfat1.E01` | EnCase EWF (exFAT) | 272 KB | `drives-dftt-2004` |
| `ubnist1.casper-rw.gen0.E01` | EnCase EWF | 1.2 MB | `drives-nps-2009-casper-rw` |
| `imageformat_mmls_1.E01` | EnCase EWF | 408 KB | `drives-dftt-2004` |
| `imageformat_mmls_1.vmdk` | **VMDK** | 5.6 MB | `drives-dftt-2004` |
| `imageformat_mmls_1.vhd` | **VHD** | 19 MB | `drives-dftt-2004` |
| `8-jpeg-search.zip` → `.dd` | **raw / dd** (NTFS) | 1.9 MB | `drives-dftt-2004` |
| `12-carve-ext2.zip` → `.dd` | raw ext2 (124 MB extracted) | 1.1 MB | `drives-dftt-2004` |
| `sleuthkit_test_data.zip` | mixed | 18 MB | `drives-tsk-2024` |
| `nitroba.pcap` | **pcap** | 54 MB | `scenarios-2008-nitroba` |

The three `imageformat_mmls_1.*` files are **the same disk in three container
formats** — the most useful thing here for testing whether a tool handles the
container or only the filesystem inside it.

## Larger samples, fetched not committed

The full Digital Corpora inventory — **856 files, 2.8 TB, in 56 groups** — is
catalogued in [`dev-scripts/samples-manifest.tsv`](/dev-scripts/samples-manifest.tsv)
and fetched on demand. Nothing of it is in this repository.

```bash
./dev-scripts/fetch-samples.sh --list                 # all 56 groups and their sizes
./dev-scripts/fetch-samples.sh --list <group>         # the files in one group
./dev-scripts/fetch-samples.sh --fetch <group>        # fetch one group
./dev-scripts/fetch-samples.sh --verify [<group>]     # re-check what is on disk
```

Fetch **by group**. `--fetch all` needs an explicit `--yes` because it is 2.8 TB,
and the script refuses any group that would not fit the free space it measures
first — dying half way through a 400 GB download is a worse outcome than
refusing up front.

**Two verification levels, and the difference is not cosmetic.** An entry with a
SHA-256 is pinned to a hash computed by streaming the object through
`sha256sum`; a mismatch means the upstream object changed or the download was
tampered with. An entry showing `size only` is checked against S3's own
`Content-Length`, which catches a truncated or wrong file but *not* a same-size
substitution. Hashing all 2.8 TB is roughly a day of continuous streaming, so
entries are promoted from `size only` as that work is done.

### The groups worth starting with

| Group | Size | Why |
|:---|---:|:---|
| `scenarios-2020-linux-threat-analysis` | 34 GB | The **Linux and syslog** lanes the board marks not started. `pfsense_logs`, `dualserver_logs` and `internaldns_logs` are 1.7–18 MB — iterable in seconds. Also Linux memory, swap, and two days of capture from one intrusion |
| `scenarios-2018-lonewolf` | 79 GB | **Windows 10**: nine-part `.E01`, `pagefile.sys`, and a 17 GB `memdump.mem`. The realistic source of `.evtx` for the EVTX lane, which has never seen a real event log |
| `drives-nps-2009-ubnist1` | 7 GB | A realistic **AFF** (849 MB), a whole Ubuntu `.E01`, and the same disk as both a single 2 GB raw file and four split segments — segmented-image handling nothing else here exercises |
| `scenarios-magnet` | 203 GB | Magnet CTF sets across Windows, macOS, Linux, iOS and Android. `2020 CTF - Windows Memory.zip` is 1.25 GB — Windows memory small enough to iterate on |
| `packets-*`, `scenarios-2012-ngdc` | varies | Captures for the Zeek lane, including a single very long TCP conversation as a reassembly stress case |
| `scenarios-2019-narcos` | 153 GB | ~86 GB of Windows memory across five hosts |
| `scenarios-2019-tuck` | 45 GB | **macOS**, segmented `.E01` — a platform nothing else here covers |

**Why they are not committed, since it is a fair question.** GitHub blocks any
file over 100 MB on the ordinary git path, on every plan — no paid tier lifts
it. Git LFS is the supported route around that, but LFS traffic goes to
`lfs.github.com`, a different host from `github.com`, and networks that
allowlist the latter often do not permit the former. Where that happens LFS
fails at push with a bare `Forbidden` that reads like a billing fault and is
not one. A pinned fetch script has none of those failure modes, costs no LFS
quota, and needs no `git-lfs` on the client.

## Formats not present

- **`-flat.vmdk`** — a VMware export artifact, not published in this corpus.
  `disk/imageformat_mmls_1.vmdk` is a monolithic VMDK, so it exercises the
  VMDK reader but not the descriptor + flat-extent pair. Still open if a
  reachable source turns up.
- **SANS challenge material** — `digital-forensics.sans.org`, `sans.org`,
  `forensicscontest.com` and `for572.com` are all refused at the network
  proxy (`403` on the CONNECT tunnel), and none of it is mirrored in the
  Digital Corpora bucket. This is an egress-policy limit, not an absence:
  allowlisting those hosts is what would unblock it. The same refusal covers
  NIST CFReDS, Netresec, malware-traffic-analysis.net and the Wireshark wiki,
  which is why Digital Corpora is the single source used here.

Memory images *were* listed here as unavailable. That was wrong, and the
mistake is worth recording because of how it happened: `corpora/ram/` exists
in the bucket and is empty, and the m57-patents scenario has no memory
capture, so two reasonable checks both came back negative. The memory dumps
are filed under the *scenarios* that produced them, not under a format-named
prefix — LoneWolf, Narcos, and the Linux threat-analysis set all carry them.
Searching by format missed what searching by scenario found.

## Provenance

All files come from [Digital Corpora](https://digitalcorpora.org/), which
mirrors the NPS corpora and Brian Carrier's Digital Forensics Tool Testing
(DFTT) images. The DFTT images (`8-jpeg-search.dd`, `12-carve-ext2.zip`) are
**GPL-licensed** — their `README` and `COPYING-GNU.txt` ship alongside them in
`raw/` and `archives/`, and must stay with them on any redistribution.
