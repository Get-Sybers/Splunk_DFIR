"""Drive the standalone **PIIAT-MitreCar** tool (the vendored
``third_party/piiat-mitrecar`` submodule) — DX_DFIR uses it in an automated
fashion via its CLI, exactly like the PIIAT-Mem lane: the tool stays a
standalone public project; this module only decides what to run and invokes
``python -m piiat_mitrecar``.

The tool turns each processed evidence SOURCE into its own MITRE CAR database
(one SQLite table per CAR object) plus per-object ``car_<object>.jsonl`` — the
JSON the ADX ingest lane loads as the ``mitre.car_*`` tables (epic #86).

    python -m get_sybers_dfir.mitrecar --batch data_store/processed
    python -m get_sybers_dfir.mitrecar --in <file-or-dir> --out <dir> [--host H]
"""
from __future__ import annotations

import argparse
import os
import subprocess
import sys

_REPO_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
# The vendored PIIAT-MitreCar submodule — invoked as `python -m piiat_mitrecar`.
_PIIAT_MITRECAR_DIR = os.path.join(_REPO_ROOT, "third_party", "piiat-mitrecar")


def _env() -> dict:
    env = dict(os.environ)
    env["PYTHONPATH"] = _PIIAT_MITRECAR_DIR + (
        os.pathsep + env["PYTHONPATH"] if env.get("PYTHONPATH") else "")
    return env


# PIIAT-MitreCar reconstructs its object model LIVE from ITS OWN pinned
# submodules (car + attack-datasources), so the submodule must be initialised
# RECURSIVELY — a plain `--init` leaves the model sources missing.
_MODEL_SOURCES = (
    os.path.join(_PIIAT_MITRECAR_DIR, "third_party", "car", "data_model"),
    os.path.join(_PIIAT_MITRECAR_DIR, "third_party", "attack-datasources",
                 "docs", "attack_data_sources_objects.yaml"),
)
_INIT_HINT = ("git submodule update --init --recursive third_party/piiat-mitrecar")


def _model_sources_present() -> bool:
    car, ads = _MODEL_SOURCES
    return os.path.isdir(car) and bool(os.listdir(car)) and os.path.exists(ads)


def _ensure_ready() -> None:
    """Make the vendored engine runnable: the package present AND its nested
    model submodules checked out. Self-plumbs with a recursive init, then
    verifies — raising a precise, actionable error if it still can't."""
    if os.path.isdir(_PIIAT_MITRECAR_DIR) and _model_sources_present():
        return
    subprocess.run(["git", "submodule", "update", "--init", "--recursive",
                    "third_party/piiat-mitrecar"],
                   cwd=_REPO_ROOT, capture_output=True, text=True)
    if not os.path.isdir(_PIIAT_MITRECAR_DIR):
        raise RuntimeError(f"third_party/piiat-mitrecar is not initialised — run `{_INIT_HINT}`")
    if not _model_sources_present():
        raise RuntimeError(
            "PIIAT-MitreCar's model submodules (car, attack-datasources) are "
            f"missing — run `{_INIT_HINT}`")


def run(tool_argv: list[str]) -> subprocess.CompletedProcess:
    """One ``python -m piiat_mitrecar`` invocation with the given tool argv.
    stdout is the tool's JSON summary (returned, not swallowed)."""
    _ensure_ready()
    return subprocess.run([sys.executable, "-m", "piiat_mitrecar"] + tool_argv,
                          env=_env(), capture_output=True, text=True, check=False)


def main(argv: list[str] | None = None) -> int:
    """A transparent pass-through: every flag is the tool's own (see the
    PIIAT-MitreCar README) — this lane only supplies the vendored location."""
    ap = argparse.ArgumentParser(
        prog="get_sybers_dfir.mitrecar", add_help=False,
        description="drive the vendored PIIAT-MitreCar CLI (all flags pass through)")
    _known, passthrough = ap.parse_known_args(argv)
    proc = run(passthrough if passthrough else ["--help"])
    sys.stdout.write(proc.stdout)
    sys.stderr.write(proc.stderr)
    return proc.returncode


if __name__ == "__main__":
    raise SystemExit(main())
