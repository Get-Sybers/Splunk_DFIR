"""Unit tests for ingest pure logic (Kusto failure detection + record shaping)."""
import json

from get_sybers_dfir.ingest import kusto, prepare


# ---- kusto.failed / error_message -----------------------------------------
def test_failed_empty_and_nonjson():
    assert kusto.failed("") is True
    assert kusto.failed("   ") is True
    assert kusto.failed("<html>not kusto</html>") is True


def test_failed_error_envelope():
    assert kusto.failed('{"error": {"message": "boom"}}') is True
    assert kusto.failed('{"OneApiErrors": [1]}') is True


def test_failed_per_row_status():
    resp = json.dumps({"Tables": [{
        "Columns": [{"ColumnName": "Result"}], "Rows": [["Failed"]]}]})
    assert kusto.failed(resp) is True


def test_failed_ok_response():
    resp = json.dumps({"Tables": [{
        "Columns": [{"ColumnName": "BuildVersion"}], "Rows": [["1.0.0"]]}]})
    assert kusto.failed(resp) is False


def test_error_message_extracts():
    assert kusto.error_message('{"error": {"message": "table not found"}}') == "table not found"
    assert "unreachable" in kusto.error_message("")


# ---- staged_name -----------------------------------------------------------
def test_staged_name_hash_and_sanitised():
    n = prepare.staged_name('WinEvt/WKS"1/Security.json')
    assert '"' not in n and "/" not in n
    assert n.split("_", 1)[0].isalnum() and len(n.split("_", 1)[0]) == 8
    # different paths that sanitise the same still differ (hash prefix)
    assert prepare.staged_name("a b") != prepare.staged_name("a_b")


# ---- record shaping --------------------------------------------------------
def test_records_array_and_jsonl(tmp_path):
    arr = tmp_path / "a.json"
    arr.write_text('[{"x":1},{"x":2}]')
    assert list(prepare._records(str(arr))) == [{"x": 1}, {"x": 2}]
    jl = tmp_path / "b.jsonl"
    jl.write_text('{"x":1}\n\n{"x":2}\n')
    assert list(prepare._records(str(jl))) == [{"x": 1}, {"x": 2}]


def test_records_missing_file_yields_nothing(tmp_path):
    # a processor still running may prune an empty output between the loader
    # discovering it and reading it — a vanished file must yield nothing, not raise.
    assert list(prepare._records(str(tmp_path / "gone.jsonl"))) == []


def test_zeek_wrap_skips_conn(tmp_path):
    conn = tmp_path / "conn.json"
    conn.write_text('{"id":1}\n')
    assert prepare.zeek_wrap(str(conn), "zeek/cap/conn.json") is None
    dns = tmp_path / "dns.json"
    dns.write_text('{"q":"x"}\n')
    got = prepare.zeek_wrap(str(dns), "zeek/cap/dns.json")
    obj = json.loads(got[0])
    assert obj == {"LogType": "dns", "SourceFile": "zeek/cap/dns.json", "Record": {"q": "x"}}


def test_volatility_wrap(tmp_path):
    p = tmp_path / "windows.pslist.jsonl"
    p.write_text('{"PID": 4}\n')
    lines = prepare.volatility_wrap(str(p), "img/windows.pslist.jsonl")
    rec = json.loads(lines[0])
    assert rec["Plugin"] == "windows.pslist" and rec["Record"] == {"PID": 4}


def test_table_name():
    assert prepare.table_name("filestat") == "L2tFilestat"
    assert prepare.table_name("winreg/appcompatcache") == "L2tWinreg"
    assert prepare.table_name("firefox_cache") == "L2tFirefoxCache"
    assert prepare.table_name("") == "L2tUnknown"


def test_split_l2t_groups_and_converts_timestamp(tmp_path):
    f = tmp_path / "host.jsonl"
    f.write_text(
        '{"parser":"filestat","timestamp":1609459200000000,"image_hostname":"H"}\n'
        '{"parser":"winreg/appcompatcache","timestamp":0}\n'
    )
    out_dir = tmp_path / "stage"
    out_dir.mkdir()
    # streaming split: writes one file per table, returns {table: filepath}
    out = prepare.split_l2t(str(f), "log2timeline/jsonl/host.jsonl", str(out_dir), "H")
    assert set(out) == {"L2tFilestat", "L2tWinreg"}
    fs_lines = [json.loads(x) for x in open(out["L2tFilestat"]) if x.strip()]
    assert len(fs_lines) == 1
    fs = fs_lines[0]
    assert fs["Parser"] == "filestat" and fs["SourceImage"].endswith("host.jsonl")
    assert fs["Timestamp"] == "2021-01-01T00:00:00.000000Z"
    # the staged file is named {prefix}.{table}
    assert out["L2tFilestat"].endswith("H.L2tFilestat")
    # zero timestamp -> left unset (not 1970)
    wr = [json.loads(x) for x in open(out["L2tWinreg"]) if x.strip()][0]
    assert "Timestamp" not in wr


def test_l2t_tables_streaming_scan(tmp_path):
    f = tmp_path / "host.jsonl"
    f.write_text(
        '{"parser":"filestat","timestamp":1}\n'
        '{"parser":"filestat","timestamp":2}\n'
        '{"parser":"winreg/appcompatcache","timestamp":0}\n'
        '\n'                                  # blank line skipped
        'not-json\n'                          # bad line skipped
    )
    assert prepare.l2t_tables(str(f)) == {"L2tFilestat": 2, "L2tWinreg": 1}


def test_iter_jsonl_missing_file_yields_nothing(tmp_path):
    assert list(prepare._iter_jsonl(str(tmp_path / "gone.jsonl"))) == []
