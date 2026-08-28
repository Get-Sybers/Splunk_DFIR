# syntax=docker/dockerfile:1
#
# dfir/suricata — minimal hardened Suricata for OFFLINE pcap replay. Stripped
# to the suricata binary; ansible (build-time hardener), python and every shell
# removed from the final image. suricata is the pinned ENTRYPOINT. Runs with no
# network and every capability dropped — offline replay needs neither.
#
#   docker build -t dfir/suricata:latest -f docker/suricata/Dockerfile docker
ARG BASE=debian:trixie-slim

FROM ${BASE} AS hardened
RUN set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends suricata ansible-core
COPY hardening/harden.yml /tmp/hardening/harden.yml
RUN set -eux; \
    ansible-playbook -c local -i localhost, /tmp/hardening/harden.yml \
      -e '{"harden_extra_remove": ["/usr/bin/suricata-update", "/usr/bin/suricatasc", "/usr/bin/suricatactl", "/var/lib/suricata/update"]}'; \
    rm -rf /usr/bin/ansible* /usr/lib/python3/dist-packages/ansible* \
           /etc/ansible /root/.ansible /tmp/hardening \
           /usr/bin/python3* /usr/lib/python3* \
           /bin/sh /bin/dash /bin/bash /bin/rbash /usr/bin/sh /usr/bin/dash /usr/bin/bash /usr/bin/rbash

FROM scratch
COPY --from=hardened / /
ENV PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin HOME=/tmp
USER 2000:2000
ENTRYPOINT ["suricata"]
LABEL org.opencontainers.image.title="dfir/suricata" \
      org.opencontainers.image.description="Minimal hardened Suricata (offline pcap replay) for the DX_DFIR signatures lane: uid0 renamed+locked, no ansible/apt/pip/sudo/setuid, no shell, no python, runs as uid 2000." \
      com.get-sybers.hardened="true"
