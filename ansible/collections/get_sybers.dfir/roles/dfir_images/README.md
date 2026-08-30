# dfir_images

Build **every runtime tool container from source, in-repo, hardened** — and
verify it. No third-party tool image is pulled at runtime: yara, suricata,
zeek, volatility, plaso and evtxecmd are all built from `docker/<name>/Dockerfile`
(volatility from the PIIAT-Mem submodule's context). The **Eric Zimmerman tool
family** — recmd, mftecmd, pecmd, amcacheparser, appcompatcacheparser,
lecmd, jlecmd, sbecmd, sqlecmd, rbcmd, wxtcmd — builds from the ONE parameterized
`docker/eztool/Dockerfile` (the same recipe as evtxecmd; the tool is selected
per image via `dfir_images_build_overrides` args), so every Linux-capable EZ tool ships as an
identical minimal-hardened .NET container (SrumECmd is excluded — Windows-only
ESE dependency; SRUM parses via dfir/plaso's libesedb-based esedb/srum parser): no shell, no python, uid 2000
by this role.

## Hardening: minimal, attack-surface-reduction posture

Chosen for the strongest resistance to container escape AND to a
supply-chain-compromised tool: each image is **stripped to the tool itself** and
every run is confined hard. ansible does the hardening *at build time*
([`docker/hardening/harden.yml`](/docker/hardening/harden.yml)) and is then
**removed from the final image** — it never ships at runtime.

- the tool is the image **ENTRYPOINT**; no ansible, no run-role, no
  orchestration in the runtime image
- **uid 0 renamed `ansible`** and locked; **sudo/su/pkexec** and the
  account-manipulation suite removed; every setuid/setgid bit stripped
- **no package manager, no pip** (nothing installable at runtime)
- **no shell and no python** except where the tool needs them: `dfir/yara`
  keeps `sh` (its scan loop is a shell script), `dfir/volatility` and
  `dfir/plaso` keep python (the tools are python); `dfir/zeek`,
  `dfir/suricata`, `dfir/evtxecmd` carry neither
- the tool runs as **uid 2000**

The role verifies this twice per image: the static image config (USER, hardened
label) and a shell-free `docker export | tar -t` scan proving the removed
binaries — and, for the tool-only images, the shell and python — are absent.

Runtime confinement is what actually contains both threats (an attacker with
code execution does not need an on-image shell): every processor `docker run`
carries `--cap-drop ALL --security-opt no-new-privileges --read-only --tmpfs
/tmp --pids-limit 512 --network none` (Volatility symbol fetch is the one
`--symbols-online` opt-in).

## What is removed vs. what remains (and why)

Verify any image with a shell-free filesystem scan:
`cid=$(docker create dfir/<tool>:latest); docker export "$cid" | tar -t | grep -E 'apt-get|dpkg|sudo|/pip|/sh$|python3'; docker rm -f "$cid"`.

**Removed** (every image): package managers (`apt`/`apt-get`/`dpkg`), `pip`,
`sudo`/`su`/`pkexec`, the account-manipulation suite, every setuid/setgid bit,
and **ansible itself** (build-time only). The uid-0 account is renamed `ansible`
and locked; the tool runs as uid 2000.

**Kept only where the tool needs it**: `dfir/yara` keeps `sh` (its per-file
scan loop is a shell script — the image ENTRYPOINT); `dfir/volatility` and
`dfir/plaso` keep `python3` (the tools *are* python). `dfir/zeek`,
`dfir/suricata` and `dfir/evtxecmd` carry **no shell and no python** at all.

Why not strip the shell from *every* image on instinct? Removing it does not
stop an attacker who already has code execution — the premise of a compromised
tool — because they issue syscalls directly; and a compromised *allowed* tool
is executed regardless of any in-container policing. So the design minimises
what is present (fewer packages = smaller supply-chain surface) and confines
what runs at the boundary (`--cap-drop ALL --security-opt no-new-privileges
--read-only --network none`), rather than shipping an orchestrator to guard a
large image from inside. An escape or exfiltration then needs a defect in the
tool plus the kernel/runtime, against dropped capabilities and no network —
not a convenient interpreter.

## The one deviation

The Kusto emulator (`kustainer`) is proprietary and cannot be built from
source; `dfir_deploy_adx` pulls it and confines it to localhost instead.

## Role variables
| Variable | Default | Description |
|---|---|---|
| `dfir_images_context` | `<repo>/docker` | Build context (holds `<name>/Dockerfile` + `hardening/harden.yml`). |
| `dfir_images_set` | all eighteen | Images to build. |
| `dfir_images_force` | `false` | Rebuild existing images (layer cache applies). |

## Usage
```bash
ansible-playbook playbooks/dfir-build-images.yml
# one image:
ansible-playbook playbooks/dfir-build-images.yml -e '{"dfir_images_set":["yara"]}'
```
