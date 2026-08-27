# syntax=docker/dockerfile:1
#
# dfir/plaso — Plaso pinned from PyPI (full libyal wheel stack), Splunk-style
# posture: ansible IS the container's only execution path (pinned ENTRYPOINT
# running the embedded allow-listed run role; only log2timeline.py, psort.py,
# image_export.py and the baked psort_wrapper.py may execute). uid 0 renamed
# `ansible` and locked, sudo/su, pip and package managers gone, runs as
# uid 2000.
#
#   docker build -t dfir/plaso:latest -f docker/plaso/Dockerfile docker
ARG BASE=python:3.12-slim
ARG PLASO_VERSION=20260720

# ---- wheel-build stage: compile the libyal stack from source ----------------
# The libyal bindings ship no cp312 wheels; build them (and every other dep)
# into wheels here with a full toolchain, so the hardened stage installs from
# local wheels only and never carries a compiler.
FROM ${BASE} AS wheels
ARG PLASO_VERSION
RUN set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends build-essential pkg-config \
        zlib1g-dev libssl-dev libfuse3-dev; \
    pip wheel --no-cache-dir --wheel-dir /wheels "plaso==${PLASO_VERSION}"

FROM ${BASE} AS hardened
ARG PLASO_VERSION
COPY --from=wheels /wheels /wheels
RUN set -eux; \
    pip install --no-cache-dir --no-index --find-links /wheels "plaso==${PLASO_VERSION}"; \
    pip install --no-cache-dir ansible-core; \
    rm -rf /wheels; \
    # the PyPI entry points drop the .py suffix the pipeline (and the GIFT debs)
    # use — provide both names so the invocation contract stays stable
    ln -s /usr/local/bin/log2timeline /usr/local/bin/log2timeline.py; \
    ln -s /usr/local/bin/psort /usr/local/bin/psort.py; \
    ln -s /usr/local/bin/image_export /usr/local/bin/image_export.py; \
    printf 'plaso %s (pypi, libyal built from source)\n' "${PLASO_VERSION}" > /etc/dfir-plaso-version
COPY runtime /opt/dfir
COPY plaso/psort_wrapper.py /opt/dfir/psort_wrapper.py
COPY hardening/harden.yml /tmp/hardening/harden.yml
RUN set -eux; \
    ansible-playbook -c local -i localhost, /tmp/hardening/harden.yml; \
    rm -rf /tmp/hardening

FROM scratch
COPY --from=hardened / /
ARG PLASO_VERSION
ENV PATH=/usr/local/bin:/usr/local/sbin:/usr/sbin:/usr/bin:/sbin:/bin \
    HOME=/home/dfir \
    LANG=C.UTF-8 PYTHONDONTWRITEBYTECODE=1 \
    ANSIBLE_ROLES_PATH=/opt/dfir/roles \
    DFIR_ALLOWED_ARGV0=log2timeline.py:psort.py:image_export.py:python3 \
    DFIR_ALLOWED_ARGV1=/opt/dfir/psort_wrapper.py
USER 2000:2000
ENTRYPOINT ["ansible-playbook", "-i", "localhost,", "-c", "local", "/opt/dfir/entrypoint.yml"]
LABEL org.opencontainers.image.title="dfir/plaso" \
      org.opencontainers.image.description="Plaso (pinned PyPI) for the DX_DFIR plaso/evtx-extraction lanes. Ansible-only execution (allow-listed run role, python restricted to the baked wrapper), uid0 renamed+locked, no sudo/su, no pip, runs as uid 2000." \
      com.get-sybers.plaso.version="${PLASO_VERSION}" \
      com.get-sybers.hardened="true"
