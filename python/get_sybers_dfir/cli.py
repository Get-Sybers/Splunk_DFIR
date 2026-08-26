"""``dxdfir`` — the DX_DFIR pipeline front-end (Typer).

The three layers of epic #46 meet here: this CLI holds the user-facing verbs, the
``get_sybers.dfir`` Ansible collection holds the orchestration (one role per source,
one action per task), and the ``get_sybers_dfir`` package holds the heavy per-item
processing the roles invoke.

    dxdfir process zeek --pipeline adx   # drive the dfir_zeek role
    dxdfir ingest --only zeek            # load processed output into the ADX emulator
    dxdfir detect                        # run every applicable registered detection
    dxdfir deploy                        # stand up + schema-load the emulator
    dxdfir validate                      # run the check harness

``process`` drives the collection with ``ansible-playbook`` (preflight → process →
verify); the role's single action calls ``python -m get_sybers_dfir.<source>`` for
the tight loop. ``ingest``, ``detect`` and ``deploy`` drive the ``dfir_ingest_adx``
/ ``dfir_detect_adx`` / ``dfir_deploy_adx`` roles the same way; ``validate`` runs
the repo's check harness (``tests/run-checks.sh``).
"""
from __future__ import annotations

import enum
import os
import shutil
import subprocess
import sys
from pathlib import Path

import typer

from . import __version__

app = typer.Typer(
    help="DX_DFIR forensic pipeline front-end (process / ingest / detect / deploy / validate).",
    no_args_is_help=True,
    add_completion=False,
)

_COLLECTION = "ansible/collections/get_sybers.dfir"


class Source(str, enum.Enum):
    zeek = "zeek"
    velociraptor = "velociraptor"
    evtx = "evtx"
    volatility = "volatility"
    plaso = "plaso"
    signatures = "signatures"


class Pipeline(str, enum.Enum):
    adx = "adx"
    sofelk = "sofelk"


# --------------------------------------------------------------------------- helpers
def _repo_root(explicit: Path | None) -> Path:
    """Locate the DX_DFIR repo: --repo-root, then $DFIR_REPO_ROOT, then walk up from
    cwd, then the installed package's in-repo location. Must hold the collection."""
    candidates: list[Path] = []
    if explicit:
        candidates.append(explicit)
    if os.environ.get("DFIR_REPO_ROOT"):
        candidates.append(Path(os.environ["DFIR_REPO_ROOT"]))
    cur = Path.cwd()
    candidates.extend([cur, *cur.parents])
    # get_sybers_dfir/cli.py -> get_sybers_dfir -> python -> <repo>
    candidates.append(Path(__file__).resolve().parents[2])
    for c in candidates:
        if (c / _COLLECTION).is_dir():
            return c.resolve()
    typer.secho(
        "Could not locate the DX_DFIR repo (no ansible/collections/get_sybers.dfir "
        "found). Pass --repo-root or set $DFIR_REPO_ROOT.",
        fg=typer.colors.RED, err=True,
    )
    raise typer.Exit(2)


def _run(cmd: list[str], *, cwd: Path | None = None, env: dict | None = None) -> None:
    """Echo and run a command; exit non-zero on failure (fail loud)."""
    typer.secho("→ " + " ".join(cmd), fg=typer.colors.BRIGHT_BLACK)
    full_env = {**os.environ, **(env or {})}
    rc = subprocess.call(cmd, cwd=str(cwd) if cwd else None, env=full_env)
    if rc != 0:
        typer.secho(f"command failed (exit {rc}): {cmd[0]}", fg=typer.colors.RED, err=True)
        raise typer.Exit(rc)


def _need(tool: str) -> None:
    if shutil.which(tool) is None:
        typer.secho(f"required tool not on PATH: {tool}", fg=typer.colors.RED, err=True)
        raise typer.Exit(127)


# --------------------------------------------------------------------------- commands
@app.command()
def process(
    source: Source = typer.Argument(..., help="Which evidence source to process."),
    pipeline: Pipeline = typer.Option(Pipeline.adx, "--pipeline", "-p", help="Backend to target."),
    force: bool = typer.Option(False, "--force", help="Reprocess inputs that already have output."),
    repo_root: Path = typer.Option(None, "--repo-root", help="DX_DFIR repo (auto-detected otherwise)."),
    extra_var: list[str] = typer.Option(
        None, "--extra-var", "-e", help="Extra Ansible var KEY=VALUE (repeatable)."
    ),
) -> None:
    """Process one evidence source by driving its role (preflight → process → verify)."""
    _need("ansible-playbook")
    repo = _repo_root(repo_root)
    name = source.value
    playbook = repo / _COLLECTION / "playbooks" / f"dfir-process-{name}.yml"
    if not playbook.is_file():
        typer.secho(f"no playbook for source '{name}': {playbook}", fg=typer.colors.RED, err=True)
        raise typer.Exit(2)
    cmd = [
        "ansible-playbook", "-i", "localhost,", "-c", "local", str(playbook),
        "-e", f"dfir_{name}_pipeline={pipeline.value}",
        "-e", f"dfir_{name}_force={'true' if force else 'false'}",
    ]
    for kv in extra_var or []:
        cmd += ["-e", kv]
    # resolve the role without installing the collection
    env = {"ANSIBLE_ROLES_PATH": str(repo / _COLLECTION / "roles")}
    typer.secho(f"processing {name} → {pipeline.value}", fg=typer.colors.GREEN)
    _run(cmd, cwd=repo, env=env)


@app.command()
def ingest(
    only: str = typer.Option(None, "--only", help="Load one source: l2t|zeek|evtx|volatility|velociraptor."),
    force: bool = typer.Option(False, "--force", help="Re-ingest files already in the ledger."),
    dry_run: bool = typer.Option(False, "--dry-run", help="List what would be loaded; contact nothing."),
    repo_root: Path = typer.Option(None, "--repo-root", help="DX_DFIR repo (auto-detected otherwise)."),
    extra_var: list[str] = typer.Option(None, "--extra-var", "-e", help="Extra Ansible var KEY=VALUE (repeatable)."),
) -> None:
    """Load processed output into the ADX (Kusto) emulator by driving dfir_ingest_adx."""
    _need("ansible-playbook")
    repo = _repo_root(repo_root)
    playbook = repo / _COLLECTION / "playbooks" / "dfir-ingest-adx.yml"
    if not playbook.is_file():
        typer.secho(f"ingest playbook not found: {playbook}", fg=typer.colors.RED, err=True)
        raise typer.Exit(2)
    cmd = ["ansible-playbook", "-i", "localhost,", "-c", "local", str(playbook)]
    if only:
        cmd += ["-e", f"dfir_ingest_adx_only={only}"]
    if force:
        cmd += ["-e", "dfir_ingest_adx_force=true"]
    if dry_run:
        cmd += ["-e", "dfir_ingest_adx_dry_run=true"]
    for kv in extra_var or []:
        cmd += ["-e", kv]
    env = {"ANSIBLE_ROLES_PATH": str(repo / _COLLECTION / "roles")}
    typer.secho("ingesting processed → ADX emulator", fg=typer.colors.GREEN)
    _run(cmd, cwd=repo, env=env)


@app.command()
def detect(
    only: str = typer.Option(None, "--only", help="Run only these detection id(s), comma-separated."),
    dry_run: bool = typer.Option(False, "--dry-run", help="Report targeting decisions; execute nothing."),
    limit: int = typer.Option(None, "--limit", help="Max hits recorded per detection."),
    jsonl_out: Path = typer.Option(None, "--jsonl-out", help="Also export the sweep's hits as JSON Lines."),
    repo_root: Path = typer.Option(None, "--repo-root", help="DX_DFIR repo (auto-detected otherwise)."),
    extra_var: list[str] = typer.Option(None, "--extra-var", "-e", help="Extra Ansible var KEY=VALUE (repeatable)."),
) -> None:
    """Sweep the processed data with every applicable registered detection (dfir_detect_adx).

    The detection orchestrator surveys which processed data is actually present
    (ADX tables + signature-lane JSONL) and runs only the registered detections
    whose target data is there; hits land uniformly tagged in misc.Detections.
    """
    _need("ansible-playbook")
    repo = _repo_root(repo_root)
    playbook = repo / _COLLECTION / "playbooks" / "dfir-detect-adx.yml"
    if not playbook.is_file():
        typer.secho(f"detect playbook not found: {playbook}", fg=typer.colors.RED, err=True)
        raise typer.Exit(2)
    cmd = ["ansible-playbook", "-i", "localhost,", "-c", "local", str(playbook)]
    if only:
        cmd += ["-e", f"dfir_detect_adx_only={only}"]
    if dry_run:
        cmd += ["-e", "dfir_detect_adx_dry_run=true"]
    if limit is not None:
        cmd += ["-e", f"dfir_detect_adx_limit={limit}"]
    if jsonl_out is not None:
        cmd += ["-e", f"dfir_detect_adx_jsonl_out={jsonl_out}"]
    for kv in extra_var or []:
        cmd += ["-e", kv]
    env = {"ANSIBLE_ROLES_PATH": str(repo / _COLLECTION / "roles")}
    typer.secho("running detections over processed data → misc.Detections", fg=typer.colors.GREEN)
    _run(cmd, cwd=repo, env=env)


@app.command()
def deploy(
    persist: bool = typer.Option(False, "--persist", help="Persist emulator data (opt-in)."),
    port: int = typer.Option(None, "--port", help="Emulator port override."),
    repo_root: Path = typer.Option(None, "--repo-root", help="DX_DFIR repo (auto-detected otherwise)."),
    extra_var: list[str] = typer.Option(None, "--extra-var", "-e", help="Extra Ansible var KEY=VALUE (repeatable)."),
) -> None:
    """Deploy the ADX (Kusto) emulator + schema by driving dfir_deploy_adx.

    ⚠️ Running this accepts Microsoft's EULA on your behalf (ACCEPT_EULA=Y); the
    emulator has no auth and is localhost-only by default.
    """
    _need("ansible-playbook")
    repo = _repo_root(repo_root)
    playbook = repo / _COLLECTION / "playbooks" / "dfir-deploy-adx.yml"
    if not playbook.is_file():
        typer.secho(f"deploy playbook not found: {playbook}", fg=typer.colors.RED, err=True)
        raise typer.Exit(2)
    cmd = ["ansible-playbook", "-i", "localhost,", "-c", "local", str(playbook)]
    if persist:
        cmd += ["-e", "dfir_deploy_adx_persist=true"]
    if port is not None:
        cmd += ["-e", f"dfir_deploy_adx_port={port}"]
    for kv in extra_var or []:
        cmd += ["-e", kv]
    env = {"ANSIBLE_ROLES_PATH": str(repo / _COLLECTION / "roles")}
    typer.secho("deploying ADX emulator + schema", fg=typer.colors.GREEN)
    _run(cmd, cwd=repo, env=env)


@app.command()
def validate(
    repo_root: Path = typer.Option(None, "--repo-root", help="DX_DFIR repo (auto-detected otherwise)."),
) -> None:
    """Run the repository check harness (fronts tests/run-checks.sh)."""
    _need("bash")
    repo = _repo_root(repo_root)
    checks = repo / "tests" / "run-checks.sh"
    if not checks.is_file():
        typer.secho(f"check harness not found: {checks}", fg=typer.colors.RED, err=True)
        raise typer.Exit(2)
    _run(["bash", str(checks)], cwd=repo)


@app.command(name="list")
def list_sources() -> None:
    """List the evidence sources the CLI can process."""
    typer.echo("Evidence sources (dxdfir process <source>):")
    for s in Source:
        typer.echo(f"  {s.value}")


def _version_cb(value: bool) -> None:
    if value:
        typer.echo(f"dxdfir (get_sybers_dfir) {__version__}")
        raise typer.Exit()


@app.callback()
def main(
    version: bool = typer.Option(
        False, "--version", callback=_version_cb, is_eager=True, help="Show version and exit."
    ),
) -> None:
    """DX_DFIR forensic processing pipeline — process evidence, then deploy/ingest/validate."""


if __name__ == "__main__":
    app()
