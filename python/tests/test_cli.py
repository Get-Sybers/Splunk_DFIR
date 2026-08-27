"""Unit tests for the dfir CLI (Typer CliRunner; subprocess mocked)."""
import os
from pathlib import Path
from unittest import mock

from typer.testing import CliRunner

from get_sybers_dfir import cli

runner = CliRunner()
_COLLECTION = "ansible/collections/get_sybers.dfir"


def _fake_repo(tmp_path: Path) -> Path:
    """A minimal repo tree the CLI can discover + drive."""
    (tmp_path / _COLLECTION / "playbooks").mkdir(parents=True)
    (tmp_path / _COLLECTION / "roles").mkdir(parents=True)
    for src in ("zeek", "velociraptor"):
        (tmp_path / _COLLECTION / "playbooks" / f"dfir-process-{src}.yml").write_text("---\n")
    (tmp_path / _COLLECTION / "playbooks" / "dfir-ingest-adx.yml").write_text("---\n")
    (tmp_path / _COLLECTION / "playbooks" / "dfir-deploy-adx.yml").write_text("---\n")
    (tmp_path / "tests").mkdir()
    (tmp_path / "tests" / "run-checks.sh").write_text("#!/bin/bash\n")
    return tmp_path


def test_version():
    from get_sybers_dfir import __version__
    r = runner.invoke(cli.app, ["--version"])
    assert r.exit_code == 0
    # assert against the package version so a bump doesn't require touching this test
    assert __version__ in r.stdout


def test_list_shows_all_sources():
    r = runner.invoke(cli.app, ["list"])
    assert r.exit_code == 0
    for src in ("zeek", "velociraptor", "evtx", "volatility", "plaso", "signatures"):
        assert src in r.stdout


def test_repo_root_explicit(tmp_path):
    repo = _fake_repo(tmp_path)
    assert cli._repo_root(repo) == repo.resolve()


def test_process_builds_playbook_command(tmp_path):
    repo = _fake_repo(tmp_path)
    with mock.patch.object(cli.subprocess, "call", return_value=0) as m, \
            mock.patch.object(cli, "_ansible_playbook", return_value="ansible-playbook"):
        r = runner.invoke(cli.app, [
            "process", "zeek", "--pipeline", "adx", "--force",
            "--repo-root", str(repo), "-e", "dfir_zeek_pcap_dir=/x",
        ])
    assert r.exit_code == 0, r.stdout
    cmd = m.call_args.args[0]
    assert cmd[0] == "ansible-playbook"
    assert str(repo / _COLLECTION / "playbooks" / "dfir-process-zeek.yml") in cmd
    assert "dfir_zeek_pipeline=adx" in cmd
    assert "dfir_zeek_force=true" in cmd
    assert "dfir_zeek_pcap_dir=/x" in cmd
    # role path is exported so the collection resolves without install
    env = m.call_args.kwargs["env"]
    assert env["ANSIBLE_ROLES_PATH"] == str(repo / _COLLECTION / "roles")


def test_process_unknown_source_rejected(tmp_path):
    repo = _fake_repo(tmp_path)
    r = runner.invoke(cli.app, ["process", "bogus", "--repo-root", str(repo)])
    assert r.exit_code != 0


def test_ingest_drives_the_role(tmp_path):
    repo = _fake_repo(tmp_path)
    with mock.patch.object(cli.subprocess, "call", return_value=0) as m, \
            mock.patch.object(cli, "_ansible_playbook", return_value="ansible-playbook"):
        r = runner.invoke(cli.app, ["ingest", "--only", "zeek", "--force", "--repo-root", str(repo)])
    assert r.exit_code == 0, r.stdout
    cmd = m.call_args.args[0]
    assert cmd[0] == "ansible-playbook"
    assert str(repo / _COLLECTION / "playbooks" / "dfir-ingest-adx.yml") in cmd
    assert "dfir_ingest_adx_only=zeek" in cmd
    assert "dfir_ingest_adx_force=true" in cmd
    assert m.call_args.kwargs["env"]["ANSIBLE_ROLES_PATH"] == str(repo / _COLLECTION / "roles")


def test_deploy_drives_the_role(tmp_path):
    repo = _fake_repo(tmp_path)
    with mock.patch.object(cli.subprocess, "call", return_value=0) as m, \
            mock.patch.object(cli, "_ansible_playbook", return_value="ansible-playbook"):
        r = runner.invoke(cli.app, ["deploy", "--persist", "--port", "8090", "--repo-root", str(repo)])
    assert r.exit_code == 0, r.stdout
    cmd = m.call_args.args[0]
    assert cmd[0] == "ansible-playbook"
    assert str(repo / _COLLECTION / "playbooks" / "dfir-deploy-adx.yml") in cmd
    assert "dfir_deploy_adx_persist=true" in cmd
    assert "dfir_deploy_adx_port=8090" in cmd


def test_failing_command_propagates_exit_code(tmp_path):
    repo = _fake_repo(tmp_path)
    with mock.patch.object(cli.subprocess, "call", return_value=3), \
            mock.patch.object(cli, "_ansible_playbook", return_value="ansible-playbook"):
        r = runner.invoke(cli.app, ["ingest", "--repo-root", str(repo)])
    assert r.exit_code == 3
