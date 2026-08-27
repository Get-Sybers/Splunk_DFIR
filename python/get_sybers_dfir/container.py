"""Shared docker-run construction for the hardened dfir/* tool containers.

The images are built to the Splunk-docker posture (see docker/hardening and
docker/runtime): the ENTRYPOINT is pinned to ``ansible-playbook`` running an
embedded run role, which allow-lists exactly which binary the image may
execute; uid 0 is renamed ``ansible`` and locked; sudo/su, package managers and
pip are gone; the tool runs as uid 2000.

This module is the runtime half of the same posture, applied to EVERY
invocation:

  --cap-drop ALL                 no capabilities — none of the tools need any
                                 (all pcap work is offline file replay)
  --security-opt no-new-privileges
                                 execve can never regain privileges
  --network none                 no network by default — every lane reads
                                 mounted evidence and writes mounted output.
                                 The single legitimate exception is Volatility
                                 symbol fetch (``network=True``, exposed to the
                                 operator as an explicit opt-in).

``ansible_run`` builds the full argv for a hardened image: the tool invocation
is handed to the in-container run role as one ``-e`` JSON document
(``dfir_run_argv``), so only the image's allow-listed binary can execute.
Pure (no I/O) so every call site stays unit-testable.
"""
from __future__ import annotations

import json

HARDENING_FLAGS = ["--cap-drop", "ALL", "--security-opt", "no-new-privileges"]

# The pinned entrypoint every dfir/* image ships (documented for tests/debug;
# docker supplies it from the image config, callers never pass it).
ENTRYPOINT = ["ansible-playbook", "-i", "localhost,", "-c", "local",
              "/opt/dfir/entrypoint.yml"]


def run_flags(network: bool = False) -> list[str]:
    """The hardening flags for one ``docker run``. ``network=True`` keeps the
    default bridge (Volatility symbol fetch); everything else runs with no
    network at all."""
    flags = list(HARDENING_FLAGS)
    if not network:
        flags += ["--network", "none"]
    return flags


def ansible_run(image, tool_argv, *, mounts=(), network=False,
                stdout_file=None, chdir=None) -> list[str]:
    """``docker run`` argv for a hardened dfir/* image.

    ``tool_argv`` is executed by the image's embedded run role — argv[0] must be
    on the image's baked allow-list or the role refuses. ``stdout_file`` makes
    the role write the tool's stdout to that (mounted) path, for lanes that
    parse tool output rather than files the tool writes. ``chdir`` sets the
    tool's working directory (zeek writes its logs to cwd).
    """
    extra_vars: dict = {"dfir_run_argv": list(tool_argv)}
    if stdout_file:
        extra_vars["dfir_run_stdout_file"] = stdout_file
    if chdir:
        extra_vars["dfir_run_chdir"] = chdir
    argv = ["docker", "run", "--rm", *run_flags(network)]
    for mount in mounts:
        argv += ["-v", mount]
    argv += [image, "-e", json.dumps(extra_vars)]
    return argv
