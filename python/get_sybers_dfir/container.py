"""Shared docker-run construction for the minimal hardened dfir/* tool images.

Posture (chosen for strongest resistance to container escape AND a
supply-chain-compromised tool): the images are stripped to the tool itself —
no runtime ansible, no package managers, no pip, no sudo/su, no setuid, uid 0
renamed and locked, tool runs as uid 2000, and NO shell/python beyond what the
tool irreducibly needs (yara's per-file scan loop needs sh; Volatility and
Plaso are python). The tool is the image's ENTRYPOINT.

Every invocation is confined at the runtime — which is what actually contains
both threats, since an attacker with code execution (the premise of a
compromised tool) does not need an on-image shell:

  --cap-drop ALL                 no capabilities (all pcap work is offline)
  --security-opt no-new-privileges
                                 execve can never regain privileges
  --read-only                    immutable root filesystem; the tool may write
                                 only to explicit mounts and tmpfs
  --tmpfs /tmp                   the one always-writable scratch area
  --pids-limit                   caps fork-bomb / parallel-exploit blast radius
  --network none                 no network by default — a compromised tool
                                 cannot exfiltrate or fetch a second stage.
                                 The single exception is Volatility ISF symbol
                                 fetch (``network=True``), an explicit opt-in.

Pure list builders so every argv stays unit-testable.
"""
from __future__ import annotations

# Base confinement applied to every tool container.
HARDENING_FLAGS = [
    "--cap-drop", "ALL",
    "--security-opt", "no-new-privileges",
    "--pids-limit", "512",
    "--read-only",
]
# tmpfs mounted read-write on every run (the tool's only rootfs-adjacent scratch).
_BASE_TMPFS = ["--tmpfs", "/tmp:rw,nosuid,nodev,exec,size=1g"]


def run_flags(network: bool = False, tmpfs: tuple = ()) -> list[str]:
    """The confinement flags for one ``docker run``. ``network=True`` keeps the
    default bridge (Volatility symbol fetch); everything else runs with no
    network. ``tmpfs`` adds per-tool writable tmpfs mounts (paths a tool touches
    on the read-only rootfs, e.g. suricata's /var/run)."""
    flags = list(HARDENING_FLAGS) + list(_BASE_TMPFS)
    for spec in tmpfs:
        flags += ["--tmpfs", spec]
    if not network:
        flags += ["--network", "none"]
    return flags


def run(image, after_image=(), *, mounts=(), network=False, tmpfs=(),
        workdir=None) -> list[str]:
    """``docker run`` argv for a minimal hardened dfir/* image.

    ``after_image`` is appended verbatim after the image name: for a tool-as-
    ENTRYPOINT image these are just the tool's arguments; for an image with no
    ENTRYPOINT (plaso, which has three entry tools) it is the full ``[tool,
    args...]``. ``workdir`` sets the tool's cwd (tools that write housekeeping
    files to cwd need it pointed at a writable mount or /tmp, since the root
    filesystem is immutable). The tool writes to the mounted output dir
    (read-write) and reads mounted evidence (read-only).
    """
    argv = ["docker", "run", "--rm", *run_flags(network, tmpfs)]
    if workdir:
        argv += ["-w", workdir]
    for mount in mounts:
        argv += ["-v", mount]
    argv += [image, *after_image]
    return argv
