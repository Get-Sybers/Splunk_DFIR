# syntax=docker/dockerfile:1
#
# EvtxECmd image for the DX_DFIR pipeline — bakes Eric Zimmerman's EvtxECmd (.NET
# build) and its Maps/ into an official .NET runtime image, so the dfir_evtx role
# has one pinnable image to run instead of an operator hand-placing EvtxECmd.dll
# under data_store/dependencies/evtxecmd/.
#
# EvtxECmd is MIT-licensed (Copyright (c) 2019 Eric Zimmerman) — redistribution is
# permitted with attribution. We still don't COMMIT the binary; this Dockerfile
# FETCHES the published release at build time, so the repo ships a recipe, not
# someone else's build. See ./README.md for licensing and the LABELs below.
#
# Build (from the repo root or this dir):
#   docker build -t dfir/evtxecmd:latest docker/evtxecmd
#
# Pin the release (recommended — the default URL serves "latest", so an unpinned
# build is not reproducible over time):
#   docker build -t dfir/evtxecmd:latest \
#     --build-arg EVTXECMD_SHA256=<sha256 of EvtxECmd.zip> docker/evtxecmd
#
# Run (matches how get_sybers_dfir.evtx invokes it in bundled mode — WORKDIR holds
# the DLL + Maps/, so EvtxECmd resolves its maps and needs no /evtxecmd mount):
#   docker run --rm -v "$PWD/in:/input:ro" -v "$PWD/out:/output" dfir/evtxecmd:latest \
#     dotnet /opt/evtxecmd/EvtxECmd.dll -f /input/Security.evtx \
#     --json /output --jsonf Security_EvtxECmd_Output.json

ARG DOTNET_VERSION=9.0
# Global so BOTH the fetch stage AND the final stage's provenance LABEL see the same
# default (ARG defaults do NOT cross a FROM — each stage redeclares it bare below).
ARG EVTXECMD_URL=https://download.ericzimmermanstools.com/net9/EvtxECmd.zip

# ---- fetch + unpack the EvtxECmd release -----------------------------------
# A throwaway stage with curl + unzip (the runtime image has neither). The .NET
# build's EvtxECmd.dll targets net9.0 (EvtxECmd.runtimeconfig.json), which is why
# the runtime base below is 9.0.
FROM debian:trixie-slim AS fetch
ARG EVTXECMD_URL
# Optional integrity pin: when non-empty, the downloaded zip must match this
# sha256 or the build fails loudly. Empty (default) skips the check and takes
# whatever "latest" currently serves.
ARG EVTXECMD_SHA256=""
RUN set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends curl ca-certificates unzip; \
    rm -rf /var/lib/apt/lists/*; \
    curl -fsSL -o /tmp/EvtxECmd.zip "${EVTXECMD_URL}"; \
    if [ -n "${EVTXECMD_SHA256}" ]; then \
        echo "${EVTXECMD_SHA256}  /tmp/EvtxECmd.zip" | sha256sum -c -; \
    fi; \
    unzip -q /tmp/EvtxECmd.zip -d /tmp/unz; \
    # Releases nest everything under an EvtxeCmd/ dir; flatten to /opt/evtxecmd.
    # Guard the find result itself — an empty match makes `dirname ""` return "."
    # (not empty), which would silently copy the whole stage root. Fail fast instead.
    dll="$(find /tmp/unz -name EvtxECmd.dll -print -quit)"; \
    test -n "${dll}"; \
    src="$(dirname "${dll}")"; \
    mkdir -p /opt/evtxecmd; \
    cp -a "${src}/." /opt/evtxecmd/; \
    test -f /opt/evtxecmd/EvtxECmd.dll; \
    test -d /opt/evtxecmd/Maps; \
    # The Windows single-file .exe is dead weight in a Linux image — drop it.
    rm -f /opt/evtxecmd/EvtxECmd.exe

# ---- the EvtxECmd image ----------------------------------------------------
FROM mcr.microsoft.com/dotnet/runtime:${DOTNET_VERSION}
ARG EVTXECMD_URL
LABEL org.opencontainers.image.title="dfir/evtxecmd" \
      org.opencontainers.image.description="Eric Zimmerman's EvtxECmd (.NET) baked into a dotnet runtime image for the DX_DFIR dfir_evtx role" \
      org.opencontainers.image.source="https://github.com/EricZimmerman/evtx" \
      org.opencontainers.image.licenses="MIT" \
      com.get-sybers.evtxecmd.url="${EVTXECMD_URL}"

# DLL + Maps/ live together in WORKDIR so EvtxECmd finds its maps by default.
COPY --from=fetch /opt/evtxecmd /opt/evtxecmd
WORKDIR /opt/evtxecmd

# Fail the build if the runtime can't load the tool (wrong .NET major, bad copy).
RUN dotnet /opt/evtxecmd/EvtxECmd.dll --help > /dev/null

# No ENTRYPOINT: callers pass the full `dotnet /opt/evtxecmd/EvtxECmd.dll …`
# command (identical to the operator-supplied path, just without the mount), which
# keeps get_sybers_dfir.evtx's two modes one code path apart.
