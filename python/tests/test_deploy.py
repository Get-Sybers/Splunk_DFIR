"""Unit tests for the deploy schema-applier (pure parsing; no engine)."""
from get_sybers_dfir import deploy


def test_parse_databases(tmp_path):
    f = tmp_path / "00-databases.kql"
    f.write_text(
        '// comment\n'
        '.create database ["host"]    volatile\n'
        '.create database ["network"] volatile\n'
        '.create database ["mitre"]   volatile\n'
    )
    assert deploy.parse_databases(str(f)) == ["host", "network", "mitre"]


def test_schema_db_from_header(tmp_path):
    f = tmp_path / "30-memory.kql"
    f.write_text("// Database: memory — Volatility 3\n.create-merge table X (a:string)\n")
    assert deploy.schema_db(str(f)) == "memory"
    g = tmp_path / "nohdr.kql"
    g.write_text("// nothing here\n")
    assert deploy.schema_db(str(g)) is None


def test_apply_schema_dry_run(tmp_path):
    (tmp_path / "00-databases.kql").write_text('.create database ["host"] volatile\n')
    (tmp_path / "10-host.kql").write_text("// Database: host\n.create-merge table T (a:string)\n")
    s = deploy.apply_schema(str(tmp_path), dry_run=True)
    assert s["dry_run"] is True
    assert s["applied_files"] == 1        # counted, but nothing sent
    assert s["created_dbs"] == 0 and s["failed"] == 0


def test_apply_schema_missing_dbfile(tmp_path):
    s = deploy.apply_schema(str(tmp_path))
    assert s.get("error") and "00-databases.kql" in s["error"]
