"""Tool-image inventory guard — refuse to run against anything but the known,
hardened dfir/* images, and flag anything added to that namespace that should
not be there.

Two checks:

- ``require(image)`` — run at the START of every processor (its role preflight):
  the exact image the lane is about to run must exist, carry the
  ``com.get-sybers.hardened`` label, and run as uid 2000. A substituted or
  un-hardened dfir/* image stops the run before any evidence is touched.
- ``audit()`` — the full inventory: every expected hardened image must be
  present and compliant, and **no other ``dfir/*`` image may exist on the host**
  except the curated non-tool ones (the SOF-ELK stack, the molecule harness). An
  unexpected ``dfir/<x>`` image is something added that should not be — a
  supply-chain red flag — and the audit fails on it.

``docker image inspect`` is the trust anchor; the checks are pure over its JSON
so the logic is unit-testable without docker.
"""
from __future__ import annotations

import json
import subprocess
import sys

# The tool images the pipeline runs. Each MUST be hardened (label + uid 2000).
HARDENED_IMAGES = (
    "dfir/yara:latest",
    "dfir/suricata:latest",
    "dfir/zeek:latest",
    "dfir/volatility:latest",
    "dfir/plaso:latest",
    "dfir/evtxecmd:latest",
    # The Eric Zimmerman tool family (dfir_zimmerman lane) — all built from the
    # one parameterized docker/eztool/Dockerfile (see dfir_images_set).
    "dfir/recmd:latest",
    "dfir/mftecmd:latest",
    "dfir/amcacheparser:latest",
    "dfir/appcompatcacheparser:latest",
    "dfir/lecmd:latest",
    "dfir/jlecmd:latest",
    "dfir/sbecmd:latest",
    "dfir/sqlecmd:latest",
    "dfir/rbcmd:latest",
    "dfir/wxtcmd:latest",
)
# Other dfir/* images that legitimately exist but are not tool containers, so
# they are exempt from the hardened-tool contract (but still allow-listed, so
# they don't trip the "unexpected image" audit). Tags are matched by repo.
ALLOWED_NON_TOOL_REPOS = ("dfir/sof-elk", "dfir/molecule")

HARDENED_LABEL = "com.get-sybers.hardened"
REQUIRED_USER = "2000:2000"


def _inspect(image: str) -> dict | None:
    """The image's Config (User, Labels, ...) via ``docker image inspect``, or
    None if the image is absent. Not pure (shells out); kept thin."""
    proc = subprocess.run(
        ["docker", "image", "inspect", "--format", "{{json .Config}}", image],
        capture_output=True, text=True, check=False,
    )
    if proc.returncode != 0:
        return None
    try:
        return json.loads(proc.stdout.strip() or "null")
    except json.JSONDecodeError:
        return None


def check_config(config: dict | None) -> list[str]:
    """Hardening violations for one image's Config. Pure. Empty list = OK."""
    if config is None:
        return ["image not present"]
    problems = []
    if (config.get("User") or "") != REQUIRED_USER:
        problems.append(f"runs as {config.get('User') or 'root'}, not uid {REQUIRED_USER}")
    labels = config.get("Labels") or {}
    if labels.get(HARDENED_LABEL) != "true":
        problems.append(f"missing {HARDENED_LABEL}=true label")
    return problems


def _repo(image: str) -> str:
    return image.rsplit(":", 1)[0]


def require(image: str) -> None:
    """Assert one image is a known hardened dfir/* tool image before the lane
    runs it. Raises RuntimeError with the reason otherwise. A non-dfir image
    (the documented operator-supplied .NET runtime, the Kusto emulator) is out
    of scope and passes untouched."""
    if not image.startswith("dfir/"):
        return
    repo = _repo(image)
    tool_repos = {_repo(i) for i in HARDENED_IMAGES}
    if repo not in tool_repos:
        raise RuntimeError(
            f"refusing to run {image}: not a known DX_DFIR tool image "
            f"(expected one of {sorted(tool_repos)})")
    problems = check_config(_inspect(image))
    if problems:
        raise RuntimeError(
            f"refusing to run {image}: it is not hardened — {'; '.join(problems)}. "
            "Rebuild it with playbooks/dfir-build-images.yml.")


def _list_dfir_images() -> list[str]:
    proc = subprocess.run(
        ["docker", "image", "ls", "--format", "{{.Repository}}:{{.Tag}}"],
        capture_output=True, text=True, check=False,
    )
    return [ln for ln in proc.stdout.splitlines()
            if ln.startswith("dfir/") and not ln.endswith(":<none>")]


def audit() -> dict:
    """Full inventory audit. Returns {ok, violations:[...]}:
      - every HARDENED_IMAGES entry present + compliant
      - no unexpected ``dfir/*`` image on the host (allow-list = the hardened
        tool images + ALLOWED_NON_TOOL_REPOS)."""
    violations = []
    for image in HARDENED_IMAGES:
        for problem in check_config(_inspect(image)):
            violations.append(f"{image}: {problem}")
    allowed = set(HARDENED_IMAGES)
    allowed_repos = {_repo(i) for i in HARDENED_IMAGES} | set(ALLOWED_NON_TOOL_REPOS)
    for present in _list_dfir_images():
        if present in allowed:
            continue
        if _repo(present) in allowed_repos:
            continue           # e.g. dfir/sof-elk:test, dfir/molecule:latest
        violations.append(
            f"{present}: unexpected dfir/* image — not a known DX_DFIR image "
            "(something was added to the namespace that should not be)")
    return {"ok": not violations, "violations": violations,
            "checked": list(HARDENED_IMAGES)}


def main(argv: list[str] | None = None) -> int:
    import argparse
    ap = argparse.ArgumentParser(
        prog="get_sybers_dfir.images",
        description="Guard the hardened dfir/* tool-image inventory.")
    ap.add_argument("--require", metavar="IMAGE",
                    help="assert one image is a known hardened tool image (start-time gate)")
    ap.add_argument("--audit", action="store_true",
                    help="audit the whole dfir/* inventory for missing/unhardened/unexpected images")
    args = ap.parse_args(argv)
    if args.require:
        try:
            require(args.require)
        except RuntimeError as exc:
            sys.stderr.write(str(exc) + "\n")
            return 1
        sys.stdout.write(f"ok: {args.require} is a hardened DX_DFIR tool image\n")
        return 0
    result = audit()
    json.dump(result, sys.stdout)
    sys.stdout.write("\n")
    if not result["ok"]:
        for v in result["violations"]:
            sys.stderr.write("VIOLATION: " + v + "\n")
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
