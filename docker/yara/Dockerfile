# syntax=docker/dockerfile:1
#
# dfir/yara — YARA from Debian's pinned package, Splunk-style posture: ansible
# IS the container's only execution path. The ENTRYPOINT is pinned to the
# embedded run role (docker/runtime), which allow-lists exactly two argv[0]s:
# `yara` and the baked per-file scan script. uid 0 is renamed `ansible` and
# locked, sudo/su and package managers are gone, the tool runs as uid 2000.
#
#   docker build -t dfir/yara:latest -f docker/yara/Dockerfile docker
ARG BASE=debian:trixie-slim

FROM ${BASE} AS hardened
RUN set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends yara ansible-core
COPY runtime /opt/dfir
COPY yara/scan-list.sh /opt/dfir/scan-list.sh
COPY hardening/harden.yml /tmp/hardening/harden.yml
RUN set -eux; \
    ansible-playbook -c local -i localhost, /tmp/hardening/harden.yml; \
    rm -rf /tmp/hardening

FROM scratch
COPY --from=hardened / /
ENV PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin \
    HOME=/home/dfir \
    ANSIBLE_ROLES_PATH=/opt/dfir/roles \
    DFIR_ALLOWED_ARGV0=yara:/opt/dfir/scan-list.sh
USER 2000:2000
ENTRYPOINT ["ansible-playbook", "-i", "localhost,", "-c", "local", "/opt/dfir/entrypoint.yml"]
LABEL org.opencontainers.image.title="dfir/yara" \
      org.opencontainers.image.description="YARA for the DX_DFIR signatures lane. Ansible-only execution (allow-listed run role), uid0 renamed+locked, no sudo/su, no setuid, no package manager, runs as uid 2000." \
      com.get-sybers.hardened="true"
