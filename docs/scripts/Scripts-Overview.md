# Scripts Directory (`./scripts`)

This directory contains **host provisioning** scripts: installing the
environment and seeding the analysis container images. Host artefacts are
collected with **the hardened GoDFIR-toolz containers**.

## Provisioning scripts

The analysis container images are catalogued in [Containers](../Containers.md).

| Script | Description |
|---|---|
| `setup-environment.sh` | Bootstraps ansible (userland deps, venv, pinned collections), then provisions the Docker engine THROUGH it (`dxdfir-bootstrap.yml` → the `dxdfir_stack` role's `docker_ensure`); the git submodules; the Python venv, the Go toolchain and the `dx` front-end. The Byakugan CAR engine is cloned + built into the `get-sybers/byakugan` image by `dx build images`, not checked out on the host. Image seeding is split into `save-docker-images.sh`. |
| `save-docker-images.sh` | Save the built hardened `get-sybers/*` images (+ the pulled Elastic-stack images) as tarballs; `--load` / `--verify` restore them and assert the hardened inventory. A launcher only: the sets, pulls, exports and loads are the `dxdfir_images` role's save/load tasks (`dxdfir-images-save.yml` / `dxdfir-images-load.yml`). |

### make-uac-collection

`scripts/dev/make-uac-collection.sh` builds a **UAC collection** from a Linux
disk image already in a case — the fixtures the `UAC` lane and godaemonhunter's
collection support were developed against. It is a dev helper (unsupported,
like the rest of `scripts/dev/`): gomount (`stream --all`) stages the image's
root volume into a throwaway container's own filesystem, directories, symlinks
and ownership intact, and the pinned [UAC](https://github.com/tclahr/uac)
release runs over that tree in `--mount-point` mode with the network off,
writing `uac-<host>-linux-<ts>.tar.gz` (and/or `.zip`) plus the acquisition log
into the lane you name. Nothing runs on the host but docker.

```bash
scripts/dev/make-uac-collection.sh --gomount ~/go/bin/gomount --lv ubuntu-vg/ubuntu-lv \
    --out data_store/raw/collections/LS24/UAC --case LS24 \
    data_store/raw/collections/LS24/VM_files/5g-image-1.vmdk
```

`--formats tar,zip` picks the containers (default `tar`; prefer tar — UAC's zip
dereferences symlinks), `--profile` the UAC profile (default
`offline_ir_triage`), `--uac-ref` the UAC release (default `v3.4.0`, cloned
once into `data_store/dependencies/uac/`), `--volume N` addresses a plain
partition instead of `--lv`. The gomount binary must carry `stream --all`
(gomount ≥ 0.3.0); a collection takes a few minutes per image (the bodyfile
and executable hashing dominate).
