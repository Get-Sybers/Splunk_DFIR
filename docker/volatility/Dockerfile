# syntax=docker/dockerfile:1
#
# dfir/volatility — Volatility 3 from PyPI (pinned) with yara-python for
# windows.vadyarascan, Splunk-style posture: ansible IS the container's only
# execution path (pinned ENTRYPOINT running the embedded allow-listed run
# role). python3 may only execute the baked vol_wrapper.py — `python3 -c` or an
# arbitrary script can never run. uid 0 renamed `ansible` and locked, sudo/su,
# pip and package managers gone, runs as uid 2000.
#
# Symbol fetch (first use of Windows plugins) needs outbound network — the
# processor keeps every run on --network none unless explicitly allowed
# (dfir_volatility_symbols_online / --symbols-online).
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
COPY runtime /opt/dfir
COPY volatility/vol_wrapper.py /opt/dfir/vol_wrapper.py
COPY hardening/harden.yml /tmp/hardening/harden.yml
RUN set -eux; \
    ansible-playbook -c local -i localhost, /tmp/hardening/harden.yml; \
    rm -rf /tmp/hardening

FROM scratch
COPY --from=hardened / /
ENV PATH=/usr/local/bin:/usr/local/sbin:/usr/sbin:/usr/bin:/sbin:/bin \
    HOME=/home/dfir \
    PYTHONDONTWRITEBYTECODE=1 \
    ANSIBLE_ROLES_PATH=/opt/dfir/roles \
    DFIR_ALLOWED_ARGV0=vol:python3 \
    DFIR_ALLOWED_ARGV1=/opt/dfir/vol_wrapper.py
USER 2000:2000
ENTRYPOINT ["ansible-playbook", "-i", "localhost,", "-c", "local", "/opt/dfir/entrypoint.yml"]
LABEL org.opencontainers.image.title="dfir/volatility" \
      org.opencontainers.image.description="Volatility 3 (pinned PyPI) + yara-python for the DX_DFIR volatility lane and vadyarascan. Ansible-only execution (allow-listed run role, python restricted to the baked wrapper), uid0 renamed+locked, no sudo/su, no pip, runs as uid 2000." \
      com.get-sybers.hardened="true"
