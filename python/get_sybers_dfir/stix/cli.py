"""``dxdfir stix`` — the exchange verbs (Typer sub-app registered by ``cli.py``).

    dxdfir stix export --hits detections.jsonl [--bundle piiat.json] --out bundle.json [--push]

Exit codes: 0 exported (and pushed, if asked); 1 the bundle failed validation
or the push was refused; 2 bad input / missing configuration.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

import typer

from . import export as _export
from .config import load_config
from .objects import TLP_LEVELS

app = typer.Typer(
    help="STIX 2.1 exchange — detections as sightings/indicators, PIIAT bundles passed through, optional OpenCTI push.",
    no_args_is_help=True,
    add_completion=False,
    context_settings={"help_option_names": ["-h", "--help"]},
)


@app.command()
def export(
    hits: list[Path] = typer.Option(
        None, "--hits", help="Detection hits: `dxdfir detect --jsonl-out` JSONL, an Elasticsearch "
                             "_search response, or alert / car-detections documents (repeatable)."),
    bundle: list[Path] = typer.Option(
        None, "--bundle", help="STIX 2.1 bundle(s) to pass through unchanged, e.g. PIIAT's projection (repeatable)."),
    out: Path = typer.Option(None, "--out", help="Write the bundle here (default: config `out`, else stdout)."),
    config: Path = typer.Option(None, "--config", help="JSON/YAML config file (see stix/README.md)."),
    case: str = typer.Option(None, "--case", help="Case id scoping the observation ids (default: the hits' run id)."),
    tlp: str = typer.Option(None, "--tlp", help="TLP marking on exported objects: " + "|".join(TLP_LEVELS) + "|none."),
    rules_dir: Path = typer.Option(
        None, "--rules-dir",
        help="Rules-as-code directory: indicators carry <id>.yml query/language as their pattern."),
    push: bool = typer.Option(
        False, "--push",
        help="Also push to OpenCTI (endpoint/token from $DXDFIR_OPENCTI_URL / $DXDFIR_OPENCTI_TOKEN "
             "or the config file — never flags)."),
    compact: bool = typer.Option(False, "--compact", help="Single-line JSON output instead of indented."),
) -> None:
    """Export detections as STIX 2.1 sightings + indicators (ATT&CK refs from their
    technique ids), merge PIIAT bundles through, write the bundle, optionally push it.
    """
    if not hits and not bundle:
        typer.secho("nothing to export: give --hits and/or --bundle", fg=typer.colors.RED, err=True)
        raise typer.Exit(2)
    try:
        cfg = load_config(str(config) if config else None, case_id=case, tlp=tlp,
                          out=str(out) if out else None, rules_dir=str(rules_dir) if rules_dir else None,
                          push=True if push else None)
    except (OSError, ValueError) as e:
        typer.secho(f"bad config: {e}", fg=typer.colors.RED, err=True)
        raise typer.Exit(2) from None
    if cfg.push and not (cfg.opencti_url and cfg.opencti_token):
        typer.secho("--push needs the OpenCTI endpoint AND token: set $DXDFIR_OPENCTI_URL and "
                    "$DXDFIR_OPENCTI_TOKEN (or opencti.url / opencti.token in --config).",
                    fg=typer.colors.RED, err=True)
        raise typer.Exit(2)
    try:
        summary, bundle_doc = _export.run_export(
            cfg, [str(p) for p in hits or []], [str(p) for p in bundle or []])
    except (OSError, ValueError) as e:
        typer.secho(f"export failed: {e}", fg=typer.colors.RED, err=True)
        raise typer.Exit(2) from None

    indent = None if compact else 2
    to_stdout = not cfg.out and summary["ok"]
    if to_stdout:                       # the bundle IS the output; the summary goes to stderr
        sys.stdout.write(json.dumps(bundle_doc, indent=indent, ensure_ascii=False, default=str) + "\n")
        sys.stderr.write(json.dumps(summary, indent=indent, ensure_ascii=False, default=str) + "\n")
    else:
        sys.stdout.write(json.dumps(summary, indent=indent, ensure_ascii=False, default=str) + "\n")
    if not summary["ok"]:
        for problem in summary["validation"]["errors"]:
            typer.secho(f"   • {problem}", fg=typer.colors.RED, err=True)
        if summary.get("push") and not summary["push"]["ok"]:
            typer.secho(f"   • {summary['push']['message']}", fg=typer.colors.RED, err=True)
        raise typer.Exit(1)
