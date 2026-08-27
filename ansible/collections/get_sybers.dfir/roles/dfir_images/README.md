# dfir_images

Build **every runtime tool container from source, in-repo, hardened** — and
verify it. No third-party tool image is pulled at runtime: yara, suricata,
zeek, volatility, plaso and evtxecmd are all built from `docker/<name>/Dockerfile`
by this role.

## Hardening: the Splunk-docker posture

Ansible is not a build-time visitor here — **it is the container's only
execution path**, the way the Splunk docker images work:

- the image's ENTRYPOINT is **pinned to `ansible-playbook`** running the
  embedded run role ([`docker/runtime`](/docker/runtime)); *only that role can
  run inside the container*
- the run role **allow-lists argv[0]** per image (baked `DFIR_ALLOWED_ARGV0`),
  and where the tool is an interpreter (python3/dotnet) it also pins argv[1] to
  the baked wrapper/DLL — `python3 -c …` or an arbitrary script can never run
- the **uid-0 account is renamed `ansible`**, password-locked, nologin — there
  is no `root` login name; **sudo/su/pkexec and the account-manipulation suite
  are removed**, and every setuid/setgid bit is stripped
- **no package manager, no pip** (nothing installable at runtime); caches,
  docs, man pages purged; per-image extras stripped (zkg/zeekctl,
  suricata-update)
- the tool itself runs as the fixed unprivileged user (`USER 2000:2000`)

All of it is applied *by ansible inside the build*
([`docker/hardening/harden.yml`](/docker/hardening/harden.yml)) and squashed.
The role then verifies the contract twice per image: statically (USER,
ENTRYPOINT, label) and **from inside the running container** via the run
role's verify mode (`-e '{"dfir_run_verify": true}'`).

Runtime is the other half: the Python processors run every image with
`--cap-drop ALL --security-opt no-new-privileges` and `--network none`
(volatility gets an explicit opt-in for symbol fetch).

## What is removed vs. what remains (and why)

Verify any image: `docker run --rm --entrypoint /bin/sh dfir/<tool>:latest -c
'id -u; getent passwd 0; command -v apt-get dpkg pip sudo su || echo none'`.

**Removed** (confirmed in every image): the package managers (`apt`, `apt-get`,
`dpkg`), `pip`/`pip3`, `sudo`/`su`/`pkexec`, the account-manipulation suite
(`passwd`, `chsh`, `usermod`, …), and every setuid/setgid bit. The uid-0 account
is renamed `ansible` and locked; the tool runs as uid 2000.

**Deliberately kept**: a shell (`/bin/sh` → dash, and `bash`) and `python3`.
This is a direct consequence of the Splunk-docker posture — **ansible is the
container's only execution path**, and ansible's local connection executes every
module through `/bin/sh` with `python3`. Deleting them would break the run role
that enforces the allow-list. So the design does not pretend the shell is gone;
it makes the shell **unreachable**: the ENTRYPOINT is pinned to
`ansible-playbook /opt/dfir/entrypoint.yml`, which runs the allow-listed run
role and nothing else, so a caller cannot ask the container to run `sh` (only
the image's allow-listed tool argv). Combined with runtime `--cap-drop ALL
--security-opt no-new-privileges --network none`, an escape would need a defect
in ansible/the run role itself, not a handy interpreter — the shell is present
but has no path to invocation. Removing installers and escalation tooling means
even a hypothetical foothold cannot fetch or build more, or gain privilege.

## The one deviation

The Kusto emulator (`kustainer`) is proprietary and cannot be built from
source; `dfir_deploy_adx` pulls it and confines it to localhost instead.

## Role variables
| Variable | Default | Description |
|---|---|---|
| `dfir_images_context` | `<repo>/docker` | Build context (holds `<name>/Dockerfile` + `hardening/harden.yml`). |
| `dfir_images_set` | all six | Images to build. |
| `dfir_images_force` | `false` | Rebuild existing images (layer cache applies). |

## Usage
```bash
ansible-playbook playbooks/dfir-build-images.yml
# one image:
ansible-playbook playbooks/dfir-build-images.yml -e '{"dfir_images_set":["yara"]}'
```
