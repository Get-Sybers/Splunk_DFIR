# 01_Containers

Every tool container the pipeline runs is **built in-repo, hardened** — nothing
third-party is pulled at runtime except the proprietary Kusto emulator. This
page lists the images, how they are built, and the posture they enforce.

---

## Build the hardened tool images

```sh
ansible-playbook ansible/collections/get_sybers.dfir/playbooks/dfir-build-images.yml
```

| Image | Tool | Source |
|---|---|---|
| `dfir/zeek` | PCAP → Zeek JSON | Zeek LTS from the project's OBS Debian repo (`docker/zeek/`) |
| `dfir/suricata` | signatures — Suricata (offline replay) | Debian package (`docker/suricata/`) |
| `dfir/yara` | signatures — YARA | Debian package (`docker/yara/`) |
| `dfir/volatility` | memory (Volatility 3) + `vadyarascan` | pinned PyPI (`docker/volatility/`) |
| `dfir/plaso` | Plaso timelining + `image_export` (dfVFS) | GIFT stable PPA (`docker/plaso/`) |
| `dfir/evtxecmd` | Windows Event Logs (EvtxECmd) | fetched EZ release, baked (`docker/evtxecmd/`) |

The `dfir_images` role builds each one and **verifies the hardening contract**
per build — statically and from inside the running container.

## The hardening posture (Splunk-docker style)

Applied by ansible *inside every build* (`docker/hardening/harden.yml`) and
squashed:

- **ansible is the container's only execution path** — the ENTRYPOINT is pinned
  to `ansible-playbook` running the embedded run role (`docker/runtime`), which
  **allow-lists argv[0]** per image; interpreters (python3/dotnet) are further
  pinned to the baked wrapper/DLL, so `python3 -c …` can never run
- the **uid-0 account is renamed `ansible`**, password-locked, nologin — no
  `root` login name exists; **sudo/su/pkexec** and the account-manipulation
  suite are removed; every setuid/setgid bit is stripped
- **no package manager, no pip** — nothing installable at runtime
- the tool runs as the fixed unprivileged user (`USER 2000:2000`)

Runtime adds the other half on every `docker run` the processors issue:
`--cap-drop ALL --security-opt no-new-privileges --network none`
(Volatility ISF symbol fetch is the one explicit opt-in:
`dfir_volatility_symbols_online` / `--symbols-online`).

## Pulled (unbuildable) images

```sh
mcr.microsoft.com/azuredataexplorer/kustainer-linux:latest   # analysis backend (Kusto emulator — proprietary)
mcr.microsoft.com/dotnet/runtime:9.0                         # evtxecmd operator-supplied mode only
```

The emulator cannot be built from source; `dfir_deploy_adx` confines it to
localhost instead (a non-local bind is refused unless
`dfir_deploy_adx_expose=true` is set deliberately).

## Offline hosts

`save-docker-images.sh` saves the built `dfir/*` images plus the two pulled
ones into `data_store/docker_images/`; `--load` restores them on an air-gapped
host. The SOF-ELK stack (`docker/sof-elk/`, from-source build) is handled by
`dfir_deploy_sofelk`.

**Not containers:** **Hayabusa** ships as a self-contained Rust binary (no
official image) — operator-supplied: download the pinned release into
`data_store/dependencies/hayabusa/`. Disk-image file access uses host tools
(`ewf-tools`, `sleuthkit`, `ntfs-3g`) installed by `setup-environment.sh`.

## Upstream documentation

- [Zeek](https://zeek.org/) · [Suricata](https://suricata.io/) · [YARA](https://virustotal.github.io/yara/)
- [Volatility 3](https://github.com/volatilityfoundation/volatility3) · [Plaso / GIFT PPA](https://launchpad.net/~gift)
- [EvtxECmd (Eric Zimmerman)](https://github.com/EricZimmerman/evtx) · [Hayabusa (Yamato Security)](https://github.com/Yamato-Security/hayabusa)
- [Azure Data Explorer Kusto emulator – Microsoft Learn](https://learn.microsoft.com/en-us/azure/data-explorer/kusto-emulator-overview)

Note: starting the Kusto emulator requires accepting Microsoft's Software
License Terms (`ACCEPT_EULA=Y`) — the deploy (`dxdfir deploy`) does this on your
behalf and says so. See [THIRD_PARTY_NOTICES.md](/THIRD_PARTY_NOTICES.md).
