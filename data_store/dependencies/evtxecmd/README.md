# EvtxECmd

Extract the published EvtxECmd release here. Used by
[`scripts/process-evtx-EvtxECmd.sh`](/scripts/process-evtx-EvtxECmd.sh) to turn
raw `.evtx` files into something Splunk can index.

## Get it

- <https://github.com/EricZimmerman/evtx/releases>
- or <https://ericzimmerman.github.io/>

Take the **.NET** build — the script runs it on Linux inside a
`mcr.microsoft.com/dotnet/sdk` container, so `EvtxECmd.dll` is what's needed,
not `EvtxECmd.exe`.

Expected layout (either works):

```
data_store/dependencies/evtxecmd/
├── EvtxECmd.dll
├── EvtxECmd.deps.json
├── EvtxECmd.runtimeconfig.json
└── Maps/
    └── *.map
```

## Include `Maps/`

Without the `Maps/` folder EvtxECmd still parses, but `MapDescription` comes out
empty — and that field is what `EvtxECmd_App` uses to populate CIM's
`signature`. You lose the human-readable "what this event means" summary.

Update the maps with `EvtxECmd.dll --sync` (needs network).

## Licence

**MIT** — Copyright (c) 2019 Eric Zimmerman.

Worth noting explicitly: EvtxECmd carries **no restriction on commercial
use** — one reason this project standardises on the EZ Tools (here directly,
and via the planned Velociraptor offline collectors) rather than KAPE, whose
Solo Edition EULA forbids business use. See
[THIRD_PARTY_NOTICES.md](/THIRD_PARTY_NOTICES.md).

It is not vendored here for the same reason nothing else is: this project does
not redistribute other people's builds.

Binaries in this directory are gitignored. Only this README is tracked.
