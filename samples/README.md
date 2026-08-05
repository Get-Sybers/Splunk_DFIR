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

Nine bigger images — 5.7 GB in total — are **not in this repository** and are
pulled on demand:

```bash
./dev-scripts/fetch-samples.sh            # fetch and verify all of it
./dev-scripts/fetch-samples.sh --list     # see the manifest first
./dev-scripts/fetch-samples.sh --verify   # re-check what you already have
```

They land in `samples/large/`, which is gitignored. Every file is pinned to a
SHA-256 taken from a byte-exact copy, so a corrupted or substituted download
fails loudly rather than silently becoming your test evidence.

| File | Size | Why it is worth the download |
|:---|---:|:---|
| `ubnist1.gen3.aff` | 849 MB | A realistic **AFF**. The committed one is 272 KB — enough to prove the reader opens, nothing more |
| `ubnist1.gen0.E01` | 695 MB | A whole Ubuntu image rather than a fragment |
| `ubnist1.gen3.001`–`.004` | 512 MB ×3, 473 MB | **Split raw segments** — segmented-image handling, which nothing else here exercises |
| `ubnist1.gen3.raw` | 2.0 GB | The same disk as a single raw file; pair it with the segments above |
| `ubnist1.casper-rw.gen2/gen3.E01` | 112 / 161 MB | Live-USB persistence layer |

**Why they are not committed, since it is a fair question.** GitHub blocks any
file over 100 MB on the ordinary git path, on every plan — no paid tier lifts
it. Git LFS is the supported route around that, but LFS traffic goes to
`lfs.github.com`, a different host from `github.com`, and networks that
allowlist the latter often do not permit the former. Where that happens LFS
fails at push with a bare `Forbidden` that reads like a billing fault and is
not one. A pinned fetch script has none of those failure modes, costs no LFS
quota, and needs no `git-lfs` on the client.

## Formats not present

- **Memory images** — Digital Corpora carries none, and every other DFIR
  sample host tried (NIST CFReDS, Netresec, malware-traffic-analysis.net,
  the Wireshark wiki) is unreachable from the build environment.
- **`-flat.vmdk`** — a VMware export artifact, not published in this corpus.
  `disk/imageformat_mmls_1.vmdk` is a monolithic VMDK, so it exercises the
  VMDK reader but not the descriptor + flat-extent pair.

Both remain open if a reachable source turns up.

## Provenance

All files come from [Digital Corpora](https://digitalcorpora.org/), which
mirrors the NPS corpora and Brian Carrier's Digital Forensics Tool Testing
(DFTT) images. The DFTT images (`8-jpeg-search.dd`, `12-carve-ext2.zip`) are
**GPL-licensed** — their `README` and `COPYING-GNU.txt` ship alongside them in
`raw/` and `archives/`, and must stay with them on any redistribution.
