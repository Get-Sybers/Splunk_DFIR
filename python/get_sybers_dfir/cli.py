"""``dxdfir`` — the DX_DFIR pipeline front-end (Typer).

The three layers of epic #46 meet here: this CLI holds the user-facing verbs, the
``get_sybers.dfir`` Ansible collection holds the orchestration (one role per source,
one action per task), and the ``get_sybers_dfir`` package holds the heavy per-item
processing the roles invoke.

    dxdfir process zeek --pipeline elastic   # drive the dfir_zeek role
    dxdfir build-car                         # normalise every processed source into CAR
    dxdfir verify-car                        # the CAR correctness gate over the materialised CAR
    dxdfir validate                          # run the check harness
    dxdfir stix export                       # detections -> STIX 2.1 sightings (+ OpenCTI push)

``process`` drives the collection with ``ansible-playbook`` (preflight → process →
verify); the role's single action calls ``python -m get_sybers_dfir.<source>`` for
the tight loop. The analysis backend is the Elastic-native stack
(``docker/elastic``, deployed with compose; the Elastic detection rules live as
data under ``get_sybers_dfir/detect/rules``); ``validate`` runs the repo's check
harness (``tests/run-checks.sh``).
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
from . import collection as _collection
from .stix.cli import app as stix_app

app = typer.Typer(
    help="DX_DFIR forensic pipeline front-end (process / build-car / verify-car / validate).",
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
    all = "all"  # every evidence lane (see `dxdfir process all [<collection>]`)


class Pipeline(str, enum.Enum):
    # elastic: the processed tree the CAR lane builds from (the Elastic-native
    # path); sofelk: the retiring SOF-ELK delivery tree (processed/sofelk/).
    elastic = "elastic"
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
def _process_lane(ap: str, repo: Path, name: str, pipeline: Pipeline, force: bool,
                  extra_vars: list[str], scope_vars: list[str]) -> None:
    """Drive one lane's process role (preflight → process → verify). ``scope_vars``
    are extra ``KEY=VALUE`` input-dir overrides — how a collection narrows a lane."""
    playbook = repo / _COLLECTION / "playbooks" / f"dfir-process-{name}.yml"
    if not playbook.is_file():
        typer.secho(f"no playbook for source '{name}': {playbook}", fg=typer.colors.RED, err=True)
        raise typer.Exit(2)
    cmd = [
        ap, "-i", "localhost,", "-c", "local", str(playbook),
        "-e", f"dfir_{name}_pipeline={pipeline.value}",
        "-e", f"dfir_{name}_force={'true' if force else 'false'}",
    ]
    for kv in scope_vars:      # collection scope first, so an explicit --extra-var can still override
        cmd += ["-e", kv]
    for kv in extra_vars:
        cmd += ["-e", kv]
    # resolve the role without installing the collection
    env = {"ANSIBLE_ROLES_PATH": str(repo / _COLLECTION / "roles")}
    scoped = "  (collection-scoped)" if scope_vars else ""
    typer.secho(f"processing {name} → {pipeline.value}{scoped}", fg=typer.colors.GREEN)
    _run(cmd, cwd=repo, env=env)


@app.command()
def process(
    source: Source = typer.Argument(..., help="Evidence source to process, or 'all' for every lane."),
    collection: str = typer.Argument(
        None, help="Scope to a collection (data_store/raw/collections/<name>)."),
    pipeline: Pipeline = typer.Option(Pipeline.elastic, "--pipeline", "-p", help="Backend to target."),
    force: bool = typer.Option(False, "--force", help="Reprocess inputs that already have output."),
    repo_root: Path = typer.Option(None, "--repo-root", help="DX_DFIR repo (auto-detected otherwise)."),
    extra_var: list[str] = typer.Option(
        None, "--extra-var", "-e", help="Extra Ansible var KEY=VALUE (repeatable)."
    ),
) -> None:
    """Process one evidence source — or 'all' lanes — driving each role (preflight → process → verify).

    With a COLLECTION, each lane is scoped to that collection's subdir under
    data_store/raw/collections/<name>/. `dxdfir process all <collection>` runs
    every lane that has evidence staged in the collection.
    """
    _ap = _ansible_playbook()
    repo = _repo_root(repo_root)

    # A collection scopes each lane's input dir(s), and tells us which lanes have evidence.
    scope: dict[str, list[str]] = {}
    counts: dict[str, int] = {}
    if collection:
        if collection not in _collection.list_collections(repo):
            typer.secho(
                f"no such collection '{collection}'. Create it: "
                f"dxdfir collection create --name {collection}",
                fg=typer.colors.RED, err=True)
            raise typer.Exit(2)
        for lane_name, var, d, n in _collection.lane_inputs(repo, collection):
            scope.setdefault(lane_name, []).append(f"{var}={d}")
            counts[lane_name] = counts.get(lane_name, 0) + n

    if source is Source.all:
        lanes = [lane.name for lane in _collection.LANES]     # the five evidence lanes
        if collection:
            lanes = [ln for ln in lanes if counts.get(ln, 0) > 0]
            if not lanes:
                typer.secho(
                    f"collection '{collection}' has no evidence — drop files in "
                    f"data_store/raw/sort/ then: dxdfir collection sort {collection}",
                    fg=typer.colors.YELLOW)
                return
        typer.secho(f"process all → {', '.join(lanes)}"
                    + (f"  (collection '{collection}')" if collection else ""), bold=True)
    else:
        lanes = [source.value]

    for ln in lanes:
        _process_lane(_ap, repo, ln, pipeline, force, extra_var or [], scope.get(ln, []))


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
    car_dir: Path = typer.Option(
        None, "--car-dir", help="The materialised CAR tree (default: <repo>/data_store/processed/car)."),
    repo_root: Path = typer.Option(None, "--repo-root", help="DX_DFIR repo (auto-detected otherwise)."),
) -> None:
    """CAR run-through: assert EXPECTED FIELD VALUES in the materialised CAR.

    The promotion gate for CAR correctness over the car_<object>.jsonl the engine
    wrote — each exercised object populated, values sane (IPs, ports, SIDs,
    car_action in the model's vocabulary), every row traceable to one artefact,
    relationship edges naming real endpoints. Run the pipeline first
    (process -> build-car).
    """
    from . import carcheck
    if car_dir is None:
        car_dir = _repo_root(repo_root) / "data_store" / "processed" / "car"
    raise typer.Exit(carcheck.main(["--car-dir", str(car_dir)]))


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
        if name in ("signatures", "all"):
            continue  # signatures spans the other lanes (reported below); 'all' is not a real lane
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


# --------------------------------------------------------------------- collections
collection_app = typer.Typer(
    help="Group raw evidence into collections and auto-sort the raw/sort dropzone.",
    no_args_is_help=True,
    context_settings={"help_option_names": ["-h", "--help"]},
)
app.add_typer(collection_app, name="collection")


@collection_app.command("create")
def collection_create(
    name: str = typer.Option(..., "--name", "-n", help="Collection name (letters/digits then . _ -)."),
    repo_root: Path = typer.Option(None, "--repo-root", help="DX_DFIR repo (auto-detected otherwise)."),
) -> None:
    """Create a collection folder (its lane subdirs) under data_store/raw/collections/."""
    repo = _repo_root(repo_root)
    try:
        root = _collection.create(repo, name)
    except ValueError as e:
        typer.secho(str(e), fg=typer.colors.RED, err=True)
        raise typer.Exit(2)
    typer.secho(f"✅ collection '{name}' ready at {root.relative_to(repo)}/", fg=typer.colors.GREEN)
    typer.echo(f"   drop evidence in data_store/raw/sort/, then: dxdfir collection sort {name}")


@collection_app.command("list")
def collection_list(
    repo_root: Path = typer.Option(None, "--repo-root", help="DX_DFIR repo (auto-detected otherwise)."),
) -> None:
    """List collections and how much evidence each holds, per lane."""
    repo = _repo_root(repo_root)
    cols = _collection.list_collections(repo)
    if not cols:
        typer.echo("No collections yet. Create one:  dxdfir collection create --name <name>")
        return
    for c in cols:
        counts: dict[str, int] = {}
        for lane_name, var, d, n in _collection.lane_inputs(repo, c):
            counts[lane_name] = counts.get(lane_name, 0) + n
        total = sum(counts.values())
        detail = ", ".join(f"{ln}:{counts[ln]}" for ln in counts if counts[ln]) or "empty"
        colour = typer.colors.GREEN if total else typer.colors.BRIGHT_BLACK
        typer.echo(f"  {c:<22} {typer.style(f'{total:>4}', fg=colour)} file(s)  [{detail}]")


@collection_app.command("sort")
def collection_sort(
    name: str = typer.Argument(None, help="Target collection (defaults to the only one, if unambiguous)."),
    dry_run: bool = typer.Option(False, "--dry-run", help="Show what would move; move nothing."),
    repo_root: Path = typer.Option(None, "--repo-root", help="DX_DFIR repo (auto-detected otherwise)."),
) -> None:
    """Sort the data_store/raw/sort dropzone into a collection's lane subdirs by file type.

    Each file is classified by extension (the same lane/extension table `dxdfir list`
    uses). A file whose type is ambiguous (`.raw` is a memory OR a disk image) or
    unknown is left in the dropzone and reported — never guessed.
    """
    repo = _repo_root(repo_root)
    cols = _collection.list_collections(repo)
    if name is None:
        if len(cols) == 1:
            name = cols[0]
        elif not cols:
            typer.secho("No collections. Create one first:  dxdfir collection create --name <name>",
                        fg=typer.colors.RED, err=True)
            raise typer.Exit(2)
        else:
            typer.secho(f"Several collections ({', '.join(cols)}) — name one:  dxdfir collection sort <name>",
                        fg=typer.colors.RED, err=True)
            raise typer.Exit(2)
    try:
        res = _collection.sort_into(repo, name, dry_run=dry_run)
    except ValueError as e:
        typer.secho(str(e), fg=typer.colors.RED, err=True)
        raise typer.Exit(2)
    verb = "would move" if dry_run else "moved"
    if res.moved:
        typer.secho(f"✅ {verb} {res.moved_count} file(s) into collection '{name}':", fg=typer.colors.GREEN)
        for sub in sorted(res.moved):
            typer.echo(f"   {sub}/  ← {', '.join(res.moved[sub])}")
    else:
        typer.echo(f"Nothing to sort into '{name}' (dropzone: data_store/raw/sort/).")
    if res.skipped:
        typer.secho(f"⚠️  left in the dropzone ({len(res.skipped)} — place by hand):", fg=typer.colors.YELLOW)
        for fn, why in res.skipped:
            typer.echo(f"   {fn}  ({why})")


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
    """DX_DFIR forensic processing pipeline — process evidence, build + verify CAR, validate."""


if __name__ == "__main__":
    app()
