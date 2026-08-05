# DFIR test samples

Small, public, freely redistributable forensic images for exercising the
pipeline. They exist because the project's largest gap is that
**nothing has been run against real evidence** —
[issue #14](https://github.com/Get-Sybers/DX_DFIR/issues/14) is the checklist
these are meant to satisfy.

> **This is not case evidence, and this directory must never hold any.**
> Real evidence goes in `data_store/`, which is deny-by-default precisely so
> it cannot be committed. That control is unchanged; nothing here relaxes it.

Everything below was already public before it was copied here. Sources and
licences are recorded in [THIRD_PARTY_NOTICES.md](/THIRD_PARTY_NOTICES.md).

## Contents

| File | Format | Size | SHA-256 (first 16) |
|:---|:---|---:|:---|
| `disk/ntfs1-gen0.E01` | EnCase EWF | 1.1 MB | `96e525f53d50f986` |
| `disk/ntfs1-gen0.aff` | **AFF** | 272 KB | `bf0291a0ee840396` |
| `disk/nps-2010-emails.E01` | EnCase EWF | 508 KB | `c9ffd969954c2f9b` |
| `disk/exfat1.E01` | EnCase EWF (exFAT) | 272 KB | `9249cbb06fef129c` |
| `disk/ubnist1.casper-rw.gen0.E01` | EnCase EWF | 1.2 MB | `dd6408ab2ed13b42` |
| `disk/imageformat_mmls_1.E01` | EnCase EWF | 408 KB | `5125bbc40154a6ac` |
| `disk/imageformat_mmls_1.vmdk` | **VMDK** | 5.6 MB | `787a1a151cbafff6` |
| `disk/imageformat_mmls_1.vhd` | **VHD** | 19 MB | `eb2d0de0a1c45d95` |
| `raw/8-jpeg-search.dd` | **raw / dd** (NTFS) | 9.9 MB | `9c43d6a2dd5132cf` |
| `network/nitroba.pcap` | **pcap** | 54 MB | `2b77a9eaefc1d6af` |
| `archives/12-carve-ext2.zip` | zip → raw ext2 | 1.1 MB | `826c24466f2d7f94` |
| `archives/sleuthkit_test_data.zip` | zip → mixed | 18 MB | `41c3a784b7f4c2af` |

The three `imageformat_mmls_1.*` files are **the same disk in three container
formats** — the most useful thing here for testing whether a tool handles the
container or only the filesystem inside it.

## The one file that is not committed

`12-carve-ext2.dd` is **124 MB**, over GitHub's hard 100 MB per-file limit — a
push carrying it is rejected outright, not warned about. It is excluded in
`samples/.gitignore`. The data is still here, compressed:

```bash
cd samples/archives && unzip 12-carve-ext2.zip     # extraction is gitignored
```

Verify anything in this directory with:

```bash
sha256sum samples/disk/* samples/raw/*.dd samples/network/*.pcap
```

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
