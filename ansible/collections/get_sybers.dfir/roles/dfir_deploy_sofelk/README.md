# dfir_deploy_sofelk

Deploy a **SOF-ELK stack** with an ingest volume, so `dfir_ingest_sofelk` can deliver
into a directory SOF-ELK watches. The role asserts inputs, runs a preflight (docker,
the host ingest dir), pulls + runs the container via `community.docker`, and reads
the container state back to confirm it is running.

> **SOF-ELK is distributed primarily as a VM** — there is no canonical public single
> container image, so this role has **no default image**: supply
> `dfir_deploy_sofelk_image` (a SOF-ELK container image or your own build). This role
> is the #45 deploy slice; it is **not exercised in the repo's CI environment**
> (no SOF-ELK image is available there), so validate it against your image.

## Role variables
| Variable | Default | Description |
|---|---|---|
| `dfir_deploy_sofelk_image` | — (**required**) | SOF-ELK container image (operator-supplied). |
| `dfir_deploy_sofelk_container` | `sof-elk` | Container name. |
| `dfir_deploy_sofelk_ingest_dir` | `<repo>/data_store/sofelk-delivered` | Host dir mounted into the container ingest path — **set `dfir_ingest_sofelk_target_dir` to the same path**. |
| `dfir_deploy_sofelk_container_ingest_path` | `/logstash` | Ingest path inside the container that SOF-ELK watches. |
| `dfir_deploy_sofelk_kibana_port` | `5601` | Host port for Kibana / OpenSearch Dashboards. |
| `dfir_deploy_sofelk_memory` | `4G` | Container memory limit. |

## Composition
`dfir_deploy_sofelk` mounts a host dir into the container's watch path;
`dfir_ingest_sofelk` delivers into that **same** host dir. Point both at the same
path and delivery lands where SOF-ELK ingests.

## Idempotence
`docker_image` / `docker_container` are idempotent, so a first deploy is
`changed=true` and a re-deploy against the same running container is `changed=false`.

## Example
```bash
ansible-playbook playbooks/dfir-deploy-sofelk.yml -e dfir_deploy_sofelk_image=<your-image>
```

## Testing
The **Molecule** scenario needs a SOF-ELK image (not shipped):
```bash
molecule test -- -e molecule_sofelk_image=<your-image>
```
It deploys a throwaway `sof-elk-moltest` container, converges, converges again
asserting zero changes, verifies it is running with the ingest mount, and tears it
down in `cleanup`.
