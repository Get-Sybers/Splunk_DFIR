# syntax=docker/dockerfile:1
#
# EvtxECmd image for the DX_DFIR pipeline — bakes Eric Zimmerman's EvtxECmd (.NET
# build) and its Maps/ into a .NET runtime, minimal-hardened. EvtxECmd is
# MIT-licensed; we FETCH the published release at build time (a recipe, not a
# committed binary). ansible (build-time hardener), python and every shell are
# removed from the final image; the tool is the pinned ENTRYPOINT
# (dotnet /opt/evtxecmd/EvtxECmd.dll).
#
#   docker build -t dfir/evtxecmd:latest -f docker/evtxecmd/Dockerfile docker
# Pin the release (recommended):
#   docker build -t dfir/evtxecmd:latest \
#     --build-arg EVTXECMD_SHA256=<sha256 of EvtxECmd.zip> -f docker/evtxecmd/Dockerfile docker
# Run (the caller supplies only the flags — the DLL is the entrypoint):
#   docker run --rm -v "$PWD/in:/input:ro" -v "$PWD/out:/output" dfir/evtxecmd:latest \
#     -f /input/Security.evtx --json /output --jsonf Security_EvtxECmd_Output.json

ARG DOTNET_VERSION=9.0
ARG EVTXECMD_URL=https://download.ericzimmermanstools.com/net9/EvtxECmd.zip

# ---- fetch + unpack the EvtxECmd release ------------------------------------
FROM debian:trixie-slim AS fetch
ARG EVTXECMD_URL
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
    dll="$(find /tmp/unz -name EvtxECmd.dll -print -quit)"; \
    test -n "${dll}"; \
    src="$(dirname "${dll}")"; \
    mkdir -p /opt/evtxecmd; \
    cp -a "${src}/." /opt/evtxecmd/; \
    test -f /opt/evtxecmd/EvtxECmd.dll; \
    test -d /opt/evtxecmd/Maps; \
    rm -f /opt/evtxecmd/EvtxECmd.exe

# ---- minimal hardened EvtxECmd image ----------------------------------------
FROM mcr.microsoft.com/dotnet/runtime:${DOTNET_VERSION} AS hardened
COPY --from=fetch /opt/evtxecmd /opt/evtxecmd
RUN dotnet /opt/evtxecmd/EvtxECmd.dll --help > /dev/null
COPY hardening/harden.yml /tmp/hardening/harden.yml
RUN set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends ansible-core; \
    ansible-playbook -c local -i localhost, /tmp/hardening/harden.yml; \
    rm -rf /usr/bin/ansible* /usr/lib/python3/dist-packages/ansible* \
           /etc/ansible /root/.ansible /tmp/hardening \
           /usr/bin/python3* /usr/lib/python3* \
           /bin/sh /bin/dash /bin/bash /bin/rbash /usr/bin/sh /usr/bin/dash /usr/bin/bash /usr/bin/rbash

FROM scratch
COPY --from=hardened / /
ARG EVTXECMD_URL
ENV PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin \
    HOME=/tmp DOTNET_CLI_HOME=/tmp \
    DOTNET_RUNNING_IN_CONTAINER=true DOTNET_EnableDiagnostics=0 \
    DOTNET_NOLOGO=1
WORKDIR /opt/evtxecmd
USER 2000:2000
ENTRYPOINT ["dotnet", "/opt/evtxecmd/EvtxECmd.dll"]
LABEL org.opencontainers.image.title="dfir/evtxecmd" \
      org.opencontainers.image.description="Minimal hardened EvtxECmd (.NET) for the DX_DFIR dfir_evtx role: uid0 renamed+locked, no ansible/apt/pip/sudo/setuid, no shell, no python, runs as uid 2000." \
      org.opencontainers.image.source="https://github.com/EricZimmerman/evtx" \
      org.opencontainers.image.licenses="MIT" \
      com.get-sybers.evtxecmd.url="${EVTXECMD_URL}" \
      com.get-sybers.hardened="true"
