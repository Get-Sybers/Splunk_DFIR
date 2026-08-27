# syntax=docker/dockerfile:1
#
# dfir/suricata — Suricata from Debian's pinned package for OFFLINE pcap replay,
# Splunk-style posture: ansible IS the container's only execution path (pinned
# ENTRYPOINT running the embedded allow-listed run role; only `suricata` may
# execute). uid 0 renamed `ansible` and locked, sudo/su and package managers
# gone, runs as uid 2000, and the lane invokes it with no network and no caps.
#
#   docker build -t dfir/suricata:latest -f docker/suricata/Dockerfile docker
ARG BASE=debian:trixie-slim

FROM ${BASE} AS hardened
RUN set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends suricata ansible-core
COPY runtime /opt/dfir
COPY hardening/harden.yml /tmp/hardening/harden.yml
RUN set -eux; \
    ansible-playbook -c local -i localhost, /tmp/hardening/harden.yml \
      -e '{"harden_extra_remove": ["/usr/bin/suricata-update", "/usr/bin/suricatasc", "/usr/bin/suricatactl", "/var/lib/suricata/update"]}'; \
    rm -rf /tmp/hardening; \
    # the lane writes eve.json into the mounted -l dir as uid 2000; the packaged
    # default log dir must not trip the startup check
    install -d -o 2000 -g 2000 /var/log/suricata /run/suricata

FROM scratch
COPY --from=hardened / /
ENV PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin \
    HOME=/home/dfir \
    ANSIBLE_ROLES_PATH=/opt/dfir/roles \
    DFIR_ALLOWED_ARGV0=suricata
USER 2000:2000
ENTRYPOINT ["ansible-playbook", "-i", "localhost,", "-c", "local", "/opt/dfir/entrypoint.yml"]
LABEL org.opencontainers.image.title="dfir/suricata" \
      org.opencontainers.image.description="Suricata (offline pcap replay) for the DX_DFIR signatures lane. Ansible-only execution (allow-listed run role), uid0 renamed+locked, no sudo/su, no setuid, no package manager, runs as uid 2000." \
      com.get-sybers.hardened="true"
