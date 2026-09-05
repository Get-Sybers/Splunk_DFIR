"""Unit tests for the dfir CLI (Typer CliRunner; subprocess mocked)."""
import os
import subprocess
from pathlib import Path
from unittest import mock

from typer.testing import CliRunner

from get_sybers_dxdfir import cli

runner = CliRunner()
_COLLECTION = "ansible/collections/get_sybers.dxdfir"


def _fake_repo(tmp_path: Path) -> Path:
    """A minimal repo tree the CLI can discover + drive."""
    (tmp_path / _COLLECTION / "playbooks").mkdir(parents=True)
    (tmp_path / _COLLECTION / "roles").mkdir(parents=True)
    for src in ("zeek", "evtx", "volatility", "plaso"):
        (tmp_path / _COLLECTION / "playbooks" / f"dxdfir-process-{src}.yml").write_text("---\n")
    (tmp_path / "tests").mkdir()
    (tmp_path / "tests" / "run-checks.sh").write_text("#!/bin/bash\n")
    return tmp_path


def test_version():
    from get_sybers_dxdfir import __version__
    r = runner.invoke(cli.app, ["--version"])
    assert r.exit_code == 0
    # assert against the package version so a bump doesn't require touching this test
    assert __version__ in r.stdout


def test_list_shows_all_sources():
    r = runner.invoke(cli.app, ["list"])
    assert r.exit_code == 0
    for src in ("zeek", "evtx", "volatility", "plaso"):
        assert src in r.stdout


def test_repo_root_explicit(tmp_path):
    repo = _fake_repo(tmp_path)
    assert cli._repo_root(repo) == repo.resolve()


def test_process_builds_playbook_command(tmp_path):
    repo = _fake_repo(tmp_path)
    with mock.patch.object(cli.subprocess, "call", return_value=0) as m, \
            mock.patch.object(cli, "_ansible_playbook", return_value="ansible-playbook"):
        r = runner.invoke(cli.app, [
            "process", "zeek", "--pipeline", "elastic", "--force",
            "--repo-root", str(repo), "-e", "dxdfir_zeek_pcap_dir=/x",
        ])
    assert r.exit_code == 0, r.stdout
    cmd = m.call_args.args[0]
    assert cmd[0] == "ansible-playbook"
    assert str(repo / _COLLECTION / "playbooks" / "dxdfir-process-zeek.yml") in cmd
    assert "dxdfir_zeek_pipeline=elastic" in cmd
    assert "dxdfir_zeek_force=true" in cmd
    assert "dxdfir_zeek_pcap_dir=/x" in cmd
    # role path is exported so the collection resolves without install
    env = m.call_args.kwargs["env"]
    assert env["ANSIBLE_ROLES_PATH"] == str(repo / _COLLECTION / "roles")


def test_process_defaults_to_the_elastic_pipeline(tmp_path):
    repo = _fake_repo(tmp_path)
    with mock.patch.object(cli.subprocess, "call", return_value=0) as m, \
            mock.patch.object(cli, "_ansible_playbook", return_value="ansible-playbook"):
        r = runner.invoke(cli.app, ["process", "zeek", "--repo-root", str(repo)])
    assert r.exit_code == 0, r.stdout
    assert "dxdfir_zeek_pipeline=elastic" in m.call_args.args[0]


def test_process_rejects_the_retired_adx_pipeline(tmp_path):
    repo = _fake_repo(tmp_path)
    r = runner.invoke(cli.app, ["process", "zeek", "--pipeline", "adx", "--repo-root", str(repo)])
    assert r.exit_code != 0


def test_process_unknown_source_rejected(tmp_path):
    repo = _fake_repo(tmp_path)
    r = runner.invoke(cli.app, ["process", "bogus", "--repo-root", str(repo)])
    assert r.exit_code != 0


def test_failing_command_propagates_exit_code(tmp_path):
    repo = _fake_repo(tmp_path)
    with mock.patch.object(cli.subprocess, "call", return_value=3), \
            mock.patch.object(cli, "_ansible_playbook", return_value="ansible-playbook"):
        r = runner.invoke(cli.app, ["process", "zeek", "--repo-root", str(repo)])
    assert r.exit_code == 3


def test_build_docker_drives_the_build_images_playbook(tmp_path):
    repo = _fake_repo(tmp_path)
    (repo / _COLLECTION / "playbooks" / "dxdfir-build-images.yml").write_text("---\n")
    with mock.patch.object(cli.subprocess, "call", return_value=0) as m, \
            mock.patch.object(cli, "_ansible_playbook", return_value="ansible-playbook"):
        r = runner.invoke(cli.app, [
            "build-docker", "--force", "-i", "yara", "-i", "zeek",
            "--repo-root", str(repo), "-e", "dxdfir_images_uid=3000",
        ])
    assert r.exit_code == 0, r.stdout
    cmd = m.call_args.args[0]
    assert cmd[0] == "ansible-playbook"
    assert str(repo / _COLLECTION / "playbooks" / "dxdfir-build-images.yml") in cmd
    assert "dxdfir_images_force=true" in cmd
    assert 'dxdfir_images_set=["yara", "zeek"]' in cmd
    assert "dxdfir_images_uid=3000" in cmd
    env = m.call_args.kwargs["env"]
    assert env["ANSIBLE_ROLES_PATH"] == str(repo / _COLLECTION / "roles")


def test_build_docker_defaults_are_a_bare_playbook_run(tmp_path):
    repo = _fake_repo(tmp_path)
    (repo / _COLLECTION / "playbooks" / "dxdfir-build-images.yml").write_text("---\n")
    with mock.patch.object(cli.subprocess, "call", return_value=0) as m, \
            mock.patch.object(cli, "_ansible_playbook", return_value="ansible-playbook"):
        r = runner.invoke(cli.app, ["build-docker", "--repo-root", str(repo)])
    assert r.exit_code == 0, r.stdout
    cmd = m.call_args.args[0]
    # no --force, no --image → neither knob is passed
    assert not any(a.startswith("dxdfir_images_force=") for a in cmd)
    assert not any(a.startswith("dxdfir_images_set=") for a in cmd)


def test_build_docker_missing_playbook_is_a_usage_error(tmp_path):
    repo = _fake_repo(tmp_path)
    with mock.patch.object(cli, "_ansible_playbook", return_value="ansible-playbook"):
        r = runner.invoke(cli.app, ["build-docker", "--repo-root", str(repo)])
    assert r.exit_code == 2


def test_collection_register_infers_name_from_from_path(tmp_path):
    repo = _fake_repo(tmp_path)
    from get_sybers_dxdfir import collection as _c
    with mock.patch.object(_c, "register") as reg:
        r = runner.invoke(cli.app, [
            "collection", "register", "--repo-root", str(repo),
            "--from", "data_store/raw/sort/scenarios-2019-narcos", "--no-hash",
        ])
    assert r.exit_code == 0, r.stdout
    assert reg.call_args.args[1] == "scenarios-2019-narcos"


def test_collection_register_requires_name_or_from(tmp_path):
    repo = _fake_repo(tmp_path)
    r = runner.invoke(cli.app, ["collection", "register", "--repo-root", str(repo)])
    assert r.exit_code == 2
    assert "NAME is required" in r.stdout or "NAME is required" in r.stderr


def test_register_promotes_matching_dropzone_folder(tmp_path):
    repo = _fake_repo(tmp_path)
    dropzone = repo / "data_store" / "raw" / "sort" / "narcos-2019"
    dropzone.mkdir(parents=True)
    from get_sybers_dxdfir import collection as _c
    with mock.patch.object(_c, "register") as reg:
        r = runner.invoke(cli.app, [
            "register", "narcos-2019", "--repo-root", str(repo), "--no-hash",
        ])
    assert r.exit_code == 0, r.stdout
    # promoted: from_path resolved to the dropzone dir
    assert reg.call_args.args[1] == "narcos-2019"
    assert reg.call_args.kwargs["from_path"] == dropzone


def test_register_without_dropzone_creates_empty_collection(tmp_path):
    repo = _fake_repo(tmp_path)
    from get_sybers_dxdfir import collection as _c
    with mock.patch.object(_c, "register") as reg:
        r = runner.invoke(cli.app, [
            "register", "fresh-case", "--repo-root", str(repo), "--no-hash",
        ])
    assert r.exit_code == 0, r.stdout
    assert reg.call_args.kwargs["from_path"] is None


def test_verify_car_defaults_to_the_processed_car_tree(tmp_path):
    from get_sybers_dxdfir import carcheck
    repo = _fake_repo(tmp_path)
    with mock.patch.object(carcheck, "main", return_value=0) as m:
        r = runner.invoke(cli.app, ["verify-car", "--repo-root", str(repo)])
    assert r.exit_code == 0, r.stdout
    assert m.call_args.args[0] == ["--car-dir", str(repo / "data_store" / "processed" / "car")]
    with mock.patch.object(carcheck, "main", return_value=1) as m:
        r = runner.invoke(cli.app, ["verify-car", "--car-dir", "/x/car"])
    assert r.exit_code == 1
    assert m.call_args.args[0] == ["--car-dir", "/x/car"]


def test_build_car_batch_defaults_to_processed_tree_and_rebuild(tmp_path):
    from get_sybers_dxdfir import mitrecar
    repo = _fake_repo(tmp_path)
    fake = subprocess.CompletedProcess([], 0, stdout="[]\n", stderr="")
    with mock.patch.object(mitrecar, "run", return_value=fake) as m:
        r = runner.invoke(cli.app, ["build-car", "--rebuild", "--repo-root", str(repo)])
    assert r.exit_code == 0, r.stdout
    argv = m.call_args.args[0]
    # user-facing --rebuild maps to the engine's own --force
    assert "--batch" in argv and "--force" in argv
    assert argv[argv.index("--batch") + 1] == str(repo / "data_store" / "processed")


def test_build_car_single_source_passes_in_out_host(tmp_path):
    from get_sybers_dxdfir import mitrecar
    fake = subprocess.CompletedProcess([], 0, stdout="{}\n", stderr="")
    with mock.patch.object(mitrecar, "run", return_value=fake) as m:
        r = runner.invoke(cli.app, ["build-car", "--in", "/x/a.jsonl", "--out", "/y", "--host", "H"])
    assert r.exit_code == 0, r.stdout
    argv = m.call_args.args[0]
    assert argv[:2] == ["--in", "/x/a.jsonl"]
    assert "--batch" not in argv
    assert "--out" in argv and "/y" in argv and "H" in argv
