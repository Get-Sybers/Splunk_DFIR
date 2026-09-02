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
    dxdfir stix export                   # detections -> STIX 2.1 sightings (+ OpenCTI push)

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
from .stix.cli import app as stix_app

app = typer.Typer(
    help="DX_DFIR forensic pipeline front-end (process / ingest / detect / deploy / validate).",
    no_args_is_help=True,
    add_completion=False,
    # Accept -h as well as --help at every level: the group and, by context
    # inheritance, each subcommand — so `dxdfir -h`, `dxdfir process -h`, etc. all work.
    context_settings={"help_option_names": ["-h", "--help"]},
)
# The STIX / OpenCTI exchange verbs live in their own sub-app (get_sybers_dfir.stix.cli).
app.add_typer(stix_app, name="stix")

_COLLECTION = "ansible/collections/get_sybers.dfir"


class Source(str, enum.Enum):
    zeek = "zeek"
    evtx = "evtx"
    volatility = "volatility"
    plaso = "plaso"
    zimmerman = "zimmerman"
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


def _ansible_playbook() -> str:
    """Path to ansible-playbook. Prefer the one installed alongside this CLI (same
    environment as sys.executable — ansible-core is a declared dependency of
    get_sybers_dfir), so `dxdfir` works however it was installed (venv, pipx, system)
    without ansible-playbook needing to be on PATH; fall back to PATH otherwise."""
    cand = os.path.join(os.path.dirname(sys.executable), "ansible-playbook")
    if os.path.isfile(cand) and os.access(cand, os.X_OK):
        return cand
    found = shutil.which("ansible-playbook")
    if found:
        return found
    typer.secho(
        "ansible-playbook not found. Install the CLI with its dependencies "
        "(`pip install ./python` or `scripts/setup-environment.sh`) — ansible-core "
        "ships with it.", fg=typer.colors.RED, err=True)
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
    _ap = _ansible_playbook()
    repo = _repo_root(repo_root)
    name = source.value
    playbook = repo / _COLLECTION / "playbooks" / f"dfir-process-{name}.yml"
    if not playbook.is_file():
        typer.secho(f"no playbook for source '{name}': {playbook}", fg=typer.colors.RED, err=True)
        raise typer.Exit(2)
    cmd = [
        _ap, "-i", "localhost,", "-c", "local", str(playbook),
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
    only: str = typer.Option(None, "--only", help="Load one source: l2t|zeek|evtx|volatility."),
    force: bool = typer.Option(False, "--force", help="Re-ingest files already in the ledger."),
    dry_run: bool = typer.Option(False, "--dry-run", help="List what would be loaded; contact nothing."),
    repo_root: Path = typer.Option(None, "--repo-root", help="DX_DFIR repo (auto-detected otherwise)."),
    extra_var: list[str] = typer.Option(None, "--extra-var", "-e", help="Extra Ansible var KEY=VALUE (repeatable)."),
) -> None:
    """Load processed output into the ADX (Kusto) emulator by driving dfir_ingest_adx."""
    _ap = _ansible_playbook()
    repo = _repo_root(repo_root)
    playbook = repo / _COLLECTION / "playbooks" / "dfir-ingest-adx.yml"
    if not playbook.is_file():
        typer.secho(f"ingest playbook not found: {playbook}", fg=typer.colors.RED, err=True)
        raise typer.Exit(2)
    cmd = [_ap, "-i", "localhost,", "-c", "local", str(playbook)]
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
    _ap = _ansible_playbook()
    repo = _repo_root(repo_root)
    playbook = repo / _COLLECTION / "playbooks" / "dfir-detect-adx.yml"
    if not playbook.is_file():
        typer.secho(f"detect playbook not found: {playbook}", fg=typer.colors.RED, err=True)
        raise typer.Exit(2)
    cmd = [_ap, "-i", "localhost,", "-c", "local", str(playbook)]
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
    _ap = _ansible_playbook()
    repo = _repo_root(repo_root)
    playbook = repo / _COLLECTION / "playbooks" / "dfir-deploy-adx.yml"
    if not playbook.is_file():
        typer.secho(f"deploy playbook not found: {playbook}", fg=typer.colors.RED, err=True)
        raise typer.Exit(2)
    cmd = [_ap, "-i", "localhost,", "-c", "local", str(playbook)]
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


@app.command(name="verify-car")
def verify_car(
    host: str = typer.Option("127.0.0.1", help="Emulator host."),
    port: int = typer.Option(8080, help="Emulator port."),
) -> None:
    """CAR run-through: assert EXPECTED FIELD VALUES at the ADX level for every lane.

    The promotion gate for CAR correctness against a populated emulator — expected
    values per source, round-trip fidelity (normalized == native), per-artefact
    identity, roll-up no-fabrication, and no-producer sources empty. Run the
    pipeline first (deploy -> process -> ingest).
    """
    from . import carcheck
    raise typer.Exit(carcheck.main(["--host", host, "--port", str(port)]))


@app.command(name="build-car")
def build_car(
    processed_dir: str = typer.Argument(
        None, help="Processed tree to build from (default: <repo>/data_store/processed). Ignored with --in."),
    in_path: str = typer.Option(None, "--in", help="Single-source: one processed file/dir → one car.db."),
    out: str = typer.Option(None, "--out", help="Output dir (single-source: this source's car dir; batch: the car/ root)."),
    host: str = typer.Option(None, "--host", help="Single-source: fallback source_host where the map derives none."),
    artefacts: str = typer.Option(None, "--artefacts", help="Single-source: comma-separated artefact map keys (default: route by filename)."),
    rebuild: bool = typer.Option(False, "--rebuild", help="Rebuild CAR stores that already exist (e.g. after a map/coverage change)."),
    repo_root: Path = typer.Option(None, "--repo-root", help="DX_DFIR repo (auto-detected otherwise)."),
) -> None:
    """Build the per-source CAR stores (car.db + superset.db) from processed evidence.

    Default (batch): discover every source under the processed tree and build each
    one's car.db + superset.db + car_<object>.jsonl. Single-source (--in): one
    file/dir → one car.db.

    A source whose car.db already exists is left as-is; pass --rebuild to re-derive
    it from the current maps — required after a coverage/map change, otherwise the
    existing (stale) stores keep skipping the newly-mapped events.
    """
    from . import mitrecar
    if in_path:
        argv = ["--in", in_path]
        for flag, val in (("--out", out), ("--host", host), ("--artefacts", artefacts)):
            if val:
                argv += [flag, val]
    else:
        batch = processed_dir or str(_repo_root(repo_root) / "data_store" / "processed")
        argv = ["--batch", batch]
        if out:
            argv += ["--out", out]
        if rebuild:                      # the engine's own flag for "rebuild existing"
            argv.append("--force")
    proc = mitrecar.run(argv)
    sys.stdout.write(proc.stdout)
    sys.stderr.write(proc.stderr)
    raise typer.Exit(proc.returncode)


@app.command(name="car-timeline")
def car_timeline(
    car_dir: str = typer.Argument(..., help="A source's car directory, or a tree to aggregate."),
    out: str = typer.Option(None, "--out", help="Output path (default: <car_dir>/timeline.jsonl)."),
    host: str = typer.Option(None, help="Only events whose source_host matches."),
    after: str = typer.Option(None, help="Only events at/after this ISO timestamp."),
    before: str = typer.Option(None, help="Only events at/before this ISO timestamp."),
) -> None:
    """Build one property-rich, time-ordered CAR timeline from car.db + superset.db.

    Unions the object events (every populated CAR property + native) and the
    relationship edges (source→verb→target, confidence/method) from a source's
    stores into <car_dir>/timeline.jsonl. Point it at one source's car directory,
    or a tree to aggregate every source under it.
    """
    from . import mitrecar
    argv = [car_dir]
    for flag, val in (("--out", out), ("--host", host),
                      ("--after", after), ("--before", before)):
        if val:
            argv += [flag, val]
    proc = mitrecar.run_timeline(argv)
    sys.stdout.write(proc.stdout)
    sys.stderr.write(proc.stderr)
    raise typer.Exit(proc.returncode)


@app.command(name="verify-images")
def verify_images() -> None:
    """Audit the hardened dfir/* tool-image inventory.

    Fails if any expected tool image is missing or un-hardened (no
    com.get-sybers.hardened label / not uid 2000), or if an UNEXPECTED dfir/*
    image is present — something added to the namespace that should not be. The
    processors also run the per-image form of this at start, so a substituted
    image never processes evidence.
    """
    from . import images
    result = images.audit()
    if result["ok"]:
        typer.secho(
            f"✅ image inventory clean — {len(result['checked'])} hardened tool "
            "images present, nothing unexpected.", fg=typer.colors.GREEN)
        return
    typer.secho("❌ image inventory violations:", fg=typer.colors.RED, err=True)
    for v in result["violations"]:
        typer.secho(f"   • {v}", fg=typer.colors.RED, err=True)
    raise typer.Exit(1)


# Where each source reads its evidence from (relative to data_store/raw), and the
# file types that count as evidence there — mirrors the roles' input-dir defaults.
_EVIDENCE: dict[str, tuple[tuple[str, ...], tuple[str, ...]]] = {
    "zeek":         (("pcaps",),                 (".pcap", ".pcapng", ".cap")),
    "evtx":         (("logs/winevt",), (".evtx",)),
    "volatility":   (("memory",),                (".dmp", ".mem", ".lime", ".vmem", ".raw", ".dump", ".bin")),
    "plaso":        (("disk_images", "VM_files"), (".e01", ".ex01", ".dd", ".raw", ".img", ".vmdk",
                                                   ".vhd", ".vhdx", ".001", ".aff4", ".vmx", ".ova")),
    "zimmerman":    (("disk_images", "VM_files"), (".e01", ".ex01", ".dd", ".raw", ".img", ".vmdk",
                                                   ".vhd", ".vhdx", ".001", ".aff4", ".vmx", ".ova")),
}


@app.command(name="list")
def list_sources(
    repo_root: Path = typer.Option(None, "--repo-root", help="DX_DFIR repo (auto-detected otherwise)."),
) -> None:
    """List staged evidence under data_store/raw — what `dxdfir process <source>` will read."""
    repo = _repo_root(repo_root)
    raw = repo / "data_store" / "raw"
    typer.secho(f"Evidence under {raw.relative_to(repo)}/", bold=True)
    for src in Source:
        name = src.value
        if name == "signatures":
            continue  # spans the other lanes' inputs; reported separately below
        subs, exts = _EVIDENCE[name]
        count = 0
        missing = []
        for sub in subs:
            d = raw / sub
            if d.is_dir():
                count += sum(1 for p in d.rglob("*") if p.is_file() and p.suffix.lower() in exts)
            else:
                missing.append(sub)
        colour = typer.colors.GREEN if count else typer.colors.BRIGHT_BLACK
        loc = ", ".join(subs) + "/"
        note = typer.style("  (not staged)", fg=typer.colors.BRIGHT_BLACK) if count == 0 else ""
        typer.echo(f"  {name:<13} {typer.style(f'{count:>5}', fg=colour)} file(s)  {loc}{note}")
    typer.echo(f"  {'signatures':<13} {'—':>5}          scans pcaps / files / disk images / evtx (the lanes above)")
    typer.echo("")
    typer.echo("Process one with:  dxdfir process <source>   (see  dxdfir process -h)")


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
