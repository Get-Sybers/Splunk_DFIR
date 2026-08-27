# syntax=docker/dockerfile:1
#
# dfir/zeek — Zeek LTS from the project's own OBS Debian repository for OFFLINE
# capture parsing, Splunk-style posture: ansible IS the container's only
# execution path (pinned ENTRYPOINT running the embedded allow-listed run role;
# only `zeek` may execute — zkg/zeekctl are stripped). uid 0 renamed `ansible`
# and locked, sudo/su and package managers gone, runs as uid 2000.
#
#   docker build -t dfir/zeek:latest -f docker/zeek/Dockerfile docker
ARG BASE=debian:trixie-slim
# The project's LTS package from the security:zeek OBS repo (installs /opt/zeek).
ARG ZEEK_PACKAGE=zeek-lts

FROM ${BASE} AS hardened
ARG ZEEK_PACKAGE
RUN set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends curl ca-certificates gnupg ansible-core; \
    curl -fsSL https://download.opensuse.org/repositories/security:zeek/Debian_13/Release.key \
      | gpg --dearmor -o /usr/share/keyrings/zeek.gpg; \
    echo "deb [signed-by=/usr/share/keyrings/zeek.gpg] https://download.opensuse.org/repositories/security:/zeek/Debian_13/ /" \
      > /etc/apt/sources.list.d/zeek.list; \
    apt-get update; \
    apt-get install -y --no-install-recommends "${ZEEK_PACKAGE}"; \
    apt-get purge -y curl gnupg; apt-get autoremove -y --purge
COPY runtime /opt/dfir
COPY hardening/harden.yml /tmp/hardening/harden.yml
RUN set -eux; \
    ansible-playbook -c local -i localhost, /tmp/hardening/harden.yml \
      -e '{"harden_extra_remove": ["/opt/zeek/bin/zkg", "/opt/zeek/bin/zeekctl", "/opt/zeek/bin/zeek-client", "/opt/zeek/var"]}'; \
    rm -rf /tmp/hardening

FROM scratch
COPY --from=hardened / /
ENV PATH=/opt/zeek/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin \
    HOME=/home/dfir \
    ANSIBLE_ROLES_PATH=/opt/dfir/roles \
    DFIR_ALLOWED_ARGV0=zeek
USER 2000:2000
ENTRYPOINT ["ansible-playbook", "-i", "localhost,", "-c", "local", "/opt/dfir/entrypoint.yml"]
LABEL org.opencontainers.image.title="dfir/zeek" \
      org.opencontainers.image.description="Zeek LTS (offline pcap parsing) for the DX_DFIR zeek lane. Ansible-only execution (allow-listed run role), uid0 renamed+locked, no sudo/su, no setuid, no package manager, no zkg/zeekctl, runs as uid 2000." \
      com.get-sybers.hardened="true"
