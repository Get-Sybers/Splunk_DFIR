# `dfir/evtxecmd` image

Eric Zimmerman's **EvtxECmd** (.NET build) and its `Maps/` baked onto an official
`.NET` runtime image, so the [`dfir_evtx`](/ansible/collections/get_sybers.dfir/roles/dfir_evtx)
role has **one pinnable image** to run instead of an operator hand-placing
`EvtxECmd.dll` under `data_store/dependencies/evtxecmd/`.

The `.NET` build's `EvtxECmd.dll` targets **net9.0** (its `runtimeconfig.json`), so
the base is `mcr.microsoft.com/dotnet/runtime:9.0`.

## Build
```bash
# from the repo root
docker build -t dfir/evtxecmd:latest docker/evtxecmd
```
The build fetches the release from `EVTXECMD_URL` (default the net9 "latest" zip),
flattens `EvtxECmd.dll` + `Maps/` into `/opt/evtxecmd` (the image `WORKDIR`, so
EvtxECmd finds its maps), drops the Windows `.exe`, and smoke-tests
`dotnet EvtxECmd.dll --help` so a broken copy fails the build.

### Pin the release (recommended)
The default URL serves **latest**, so an unpinned build is not reproducible over
time. Pass the expected checksum to fail loudly on drift:
```bash
sha256=$(curl -fsSL https://download.ericzimmermanstools.com/net9/EvtxECmd.zip | sha256sum | cut -d' ' -f1)
docker build -t dfir/evtxecmd:latest --build-arg EVTXECMD_SHA256="$sha256" docker/evtxecmd
```

### Build args
| Arg | Default | Purpose |
|---|---|---|
| `DOTNET_VERSION` | `9.0` | .NET runtime major (EvtxECmd's current build is net9.0). |
| `EVTXECMD_URL` | net9 latest zip | Where to fetch the EvtxECmd `.NET` release. |
| `EVTXECMD_SHA256` | *(empty)* | If set, the zip must match this sha256 or the build fails. |

## Run
The image sets no `ENTRYPOINT`: callers pass the full `dotnet …` command, identical
to the operator-supplied path but with no `/evtxecmd` mount — which is what keeps the
`get_sybers_dfir.evtx` processor's two modes one branch apart.
```bash
docker run --rm -v "$PWD/in:/input:ro" -v "$PWD/out:/output" dfir/evtxecmd:latest \
  dotnet /opt/evtxecmd/EvtxECmd.dll -f /input/Security.evtx \
  --json /output --jsonf Security_EvtxECmd_Output.json \
  --xml  /output --xmlf  Security_EvtxECmd_Output.xml
```
Normally you don't run it by hand — `dfir_evtx` (bundled mode, the default) does.

## Updating `Maps/`
The maps are frozen at build time (whatever the release shipped). Rebuild the image
to refresh them; there's no in-image `--sync` step (that needs network at run time
and would make runs non-deterministic).

## Licence & provenance
EvtxECmd is **MIT** — Copyright (c) 2019 Eric Zimmerman
(<https://github.com/EricZimmerman/evtx>). MIT permits redistribution with
attribution, but this project still does **not commit the binary**: the Dockerfile
*fetches* the published release at build time, so the repo ships a recipe, not
someone else's build. The image records the source URL in an OCI label
(`com.get-sybers.evtxecmd.url`) and `org.opencontainers.image.source`.
