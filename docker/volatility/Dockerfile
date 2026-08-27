# syntax=docker/dockerfile:1
#
# dfir/volatility — minimal hardened Volatility 3. Volatility IS python, so
# python is irreducible; ansible (build-time hardener) and every shell are
# removed. The wrapper imports the mounted jsonl_dfir renderer then runs the
# CLI; it is the pinned ENTRYPOINT (python3 /opt/dfir/vol_wrapper.py).
#
# Symbol fetch (first use of Windows plugins) needs outbound network — the
# processor keeps every run on --network none unless --symbols-online is set.
#
#   docker build -t dfir/volatility:latest -f docker/volatility/Dockerfile docker
ARG BASE=python:3.12-slim
ARG VOLATILITY_VERSION=2.28.0
ARG YARA_PYTHON_VERSION=4.5.4

FROM ${BASE} AS hardened
ARG VOLATILITY_VERSION
ARG YARA_PYTHON_VERSION
RUN set -eux; \
    pip install --no-cache-dir \
      "volatility3==${VOLATILITY_VERSION}" \
      "yara-python==${YARA_PYTHON_VERSION}" \
      ansible-core
COPY volatility/vol_wrapper.py /opt/dfir/vol_wrapper.py
COPY hardening/harden.yml /tmp/hardening/harden.yml
RUN set -eux; \
    ansible-playbook -c local -i localhost, /tmp/hardening/harden.yml; \
    rm -rf /usr/local/bin/ansible* /usr/local/lib/python3*/site-packages/ansible* \
           /etc/ansible /root/.ansible /tmp/hardening \
           /bin/sh /bin/dash /bin/bash /bin/rbash /usr/bin/sh /usr/bin/dash /usr/bin/bash /usr/bin/rbash

FROM scratch
COPY --from=hardened / /
ENV PATH=/usr/local/bin:/usr/local/sbin:/usr/sbin:/usr/bin:/sbin:/bin \
    HOME=/tmp XDG_CACHE_HOME=/tmp/.cache PYTHONDONTWRITEBYTECODE=1
USER 2000:2000
ENTRYPOINT ["python3", "/opt/dfir/vol_wrapper.py"]
LABEL org.opencontainers.image.title="dfir/volatility" \
      org.opencontainers.image.description="Minimal hardened Volatility 3 (+ yara-python) for the DX_DFIR volatility lane and vadyarascan: uid0 renamed+locked, no ansible/apt/pip/sudo/setuid, no shell, runs as uid 2000 (python is irreducible)." \
      com.get-sybers.hardened="true"
