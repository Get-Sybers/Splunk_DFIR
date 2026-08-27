"""Unit tests for the signatures lanes' pure parsing logic (no engines needed)."""
import os

from get_sybers_dfir import signatures
from get_sybers_dfir.signatures import hayabusa, suricata, yara


# ---- shared helpers --------------------------------------------------------
def test_clean_name_folds(tmp_path):
    p = tmp_path / "a" / "b.pcap"
    assert signatures.clean_name(str(p), str(tmp_path)) == "a_b.pcap"


def test_list_images(tmp_path):
    (tmp_path / "case.E01").write_bytes(b"x")
    (tmp_path / "m.raw").write_bytes(b"x")
    (tmp_path / "notes.txt").write_bytes(b"x")
    got = [os.path.basename(p) for p in signatures.list_images(str(tmp_path))]
    assert got == ["case.E01", "m.raw"]


# ---- yara text parsing -----------------------------------------------------
def test_parse_yara_text_rule_and_strings():
    raw = (
        "EICAR_Test /scan/samples/eicar.txt\n"
        "0x0:$s1: X5O!P%@AP\n"
        "0x10:$s2: EICAR-STANDARD\n"
        "AnotherRule /scan/samples/eicar.txt\n"
    )
    matches = yara.parse_yara_text(raw, "file", "/scan/", "other_raw_data")
    assert len(matches) == 2
    first = matches[0]
    assert first["rule"] == "EICAR_Test"
    assert first["source"] == "file"
    assert first["target"] == "samples/eicar.txt"
    assert first["match"] == os.path.join("other_raw_data", "samples/eicar.txt")
    assert first["strings"][0] == {"id": "$s1", "offset": 0, "data": "X5O!P%@AP"}
    assert first["strings"][1]["offset"] == 16
    assert matches[1]["rule"] == "AnotherRule" and matches[1]["strings"] == []


def test_build_index_uses_rules_mount_paths():
    idx = yara.build_index(["/r/a.yar", "/r/sub/b.yara"], "/r")
    assert idx == 'include "/rules/a.yar"\ninclude "/rules/sub/b.yara"\n'


def test_yara_run_never_writes_into_rules_dir(tmp_path):
    # a read-only rules tree must not be mutated (index goes to a temp file). Point
    # files_target at a non-existent dir so the container scan is never reached.
    rules = tmp_path / "rules"
    rules.mkdir()
    (rules / "r.yar").write_text("rule X { condition: true }\n")
    before = set(os.listdir(rules))
    res = yara.run(output_dir=str(tmp_path / "out"), repo_root=str(tmp_path),
                   sources=("files",), rules_dir=str(rules),
                   files_target=str(tmp_path / "does_not_exist"))
    assert set(os.listdir(rules)) == before   # no _dfir_index.yar left behind
    assert res["lane"] == "yara"


def test_parse_yara_text_ignores_malformed():
    assert yara.parse_yara_text("", "file", "/scan/", "b") == []
    assert yara.parse_yara_text("justoneword\n", "file", "/scan/", "b") == []


def test_parse_vadyarascan():
    lines = (
        '{"Rule": "Cobalt", "PID": 123, "Process": "evil.exe", "Offset": 4096, "Value": "MZ"}\n'
        '{"nope": 1}\n'
        'garbage\n'
    )
    got = yara.parse_vadyarascan(lines, "mem/dump.raw")
    assert len(got) == 1
    assert got[0] == {
        "tool": "yara", "source": "memory", "rule": "Cobalt", "pid": 123,
        "process": "evil.exe", "offset": 4096, "value": "MZ",
        "target": "mem/dump.raw", "match": "mem/dump.raw",
    }


# ---- yara disk source: mount argv construction (pure, no FUSE needed) ------
_MMLS = """DOS Partition Table
Offset Sector: 0
Units are in 512-byte sectors

      Slot      Start        End          Length       Description
002:  000:000   0000000128   0031457279   0031457151   NTFS / exFAT (0x07)
003:  000:001   0031457280   0031459327   0000002048   Linux (0x83)
"""


def test_parse_mmls_offset_first_ntfs_partition():
    assert yara.parse_mmls_offset(_MMLS) == 128 * 512


def test_parse_mmls_offset_basic_data_and_none():
    text = "005:  000:002   0000206848   0104855551   0104648704   Basic data partition\n"
    assert yara.parse_mmls_offset(text) == 206848 * 512
    assert yara.parse_mmls_offset("") == 0                       # partitionless volume
    assert yara.parse_mmls_offset("no table\n") == 0


def test_mount_argvs():
    assert yara.ewfmount_argv("/d/case.E01", "/tmp/ewf") == \
        ["ewfmount", "/d/case.E01", "/tmp/ewf"]
    assert yara.mmls_argv("/tmp/ewf/ewf1") == ["mmls", "-a", "/tmp/ewf/ewf1"]
    argv = yara.ntfs3g_argv("/tmp/ewf/ewf1", "/mnt/y0", 65536)
    assert argv == ["ntfs-3g", "-o", "ro,offset=65536,streams_interface=windows",
                    "/tmp/ewf/ewf1", "/mnt/y0"]
    assert "ro," in argv[2]                                      # read-only, always


# ---- yara memory source: vadyarascan argv + rules concat --------------------
def test_vadyarascan_argv_mounts_and_wrapper_args(tmp_path):
    mem = tmp_path / "case" / "memdump.mem"
    mem.parent.mkdir()
    mem.write_bytes(b"x")
    sym = tmp_path / "symbols"; sym.mkdir()
    ren = tmp_path / "r.py"; ren.write_text("")
    rules = tmp_path / "combined.yar"; rules.write_text("rule X { condition: true }")
    argv = yara.vadyarascan_argv(str(mem), str(sym), str(ren), str(rules), "vol:img")
    assert argv[:3] == ["docker", "run", "--rm"]
    assert f"{mem.parent}:/mem:ro" in argv                       # image dir read-only
    assert f"{sym}:/symbols" in argv                             # symbols writable (ISF cache)
    assert f"{rules}:/rules/combined.yar:ro" in argv
    assert "vol:img" in argv
    # wrapper argv: renderer, symbols, image, rules file — in that order
    assert argv[-4:] == ["/opt/jsonl_dfir_renderer.py", "/symbols",
                         "/mem/memdump.mem", "/rules/combined.yar"]
    assert "windows.vadyarascan.VadYaraScan" in argv[argv.index("-c") + 1]


def test_combine_rules_concatenates(tmp_path):
    a = tmp_path / "a.yar"; a.write_text("rule A { condition: true }")
    b = tmp_path / "b.yar"; b.write_text("rule B { condition: false }")
    got = yara.combine_rules([str(a), str(b)])
    assert "rule A" in got and "rule B" in got
    assert got.index("rule A") < got.index("rule B")


# ---- suricata EVE filtering ------------------------------------------------
def test_filter_eve_keeps_wanted_and_annotates():
    stream = (
        '{"event_type": "alert", "alert": {"signature": "ET X"}}\n'
        '{"event_type": "stats", "x": 1}\n'          # dropped
        '{"event_type": "dns", "dns": {}}\n'
        'not-json\n'
    )
    got = suricata.filter_eve(stream, "raw/pcaps/a.pcap")
    assert [e["event_type"] for e in got] == ["alert", "dns"]
    assert all(e["source_pcap"] == "raw/pcaps/a.pcap" and e["tool"] == "suricata" for e in got)


def test_filter_eve_keep_all():
    stream = '{"event_type": "stats"}\n{"event_type": "alert"}\n'
    assert len(suricata.filter_eve(stream, "p", keep_all=True)) == 2


# ---- hayabusa tagging ------------------------------------------------------
def test_tag_detections():
    raw = '{"RuleTitle": "Susp Logon", "Level": "high"}\ngarbage\n{"RuleTitle": "X"}\n'
    got = hayabusa.tag_detections(raw)
    assert len(got) == 2
    assert all(d["tool"] == "hayabusa" for d in got)
    assert got[0]["RuleTitle"] == "Susp Logon"


def test_find_binary(tmp_path):
    assert hayabusa.find_binary(str(tmp_path)) is None
    b = tmp_path / "hayabusa-3.4.0-lin"
    b.write_bytes(b"#!/bin/sh\n")
    os.chmod(b, 0o755)
    (tmp_path / "hayabusa.zip").write_bytes(b"zip")   # ignored
    assert hayabusa.find_binary(str(tmp_path)) == str(b)


# ---- orchestrator ----------------------------------------------------------
def test_process_no_rules_no_pcaps_is_clean(tmp_path):
    repo = tmp_path
    (repo / "data_store").mkdir()
    s = signatures.process(str(tmp_path / "out"), repo_root=str(repo))
    assert s["tool"] == "signatures"
    assert s["processed"] == 0 and s["failed"] == 0
    assert set(s["results"]) == {"yara", "suricata", "hayabusa"}


# ---- Suricata tuning (HOME_NET / --set), all pure ---------------------------
from get_sybers_dfir.signatures import suricata


def test_derive_home_net_picks_observed_private_supernets():
    hn = suricata.derive_home_net(["10.1.2.3", "192.168.1.5", "8.8.8.8"])
    assert hn == "[10.0.0.0/8,192.168.0.0/16]"          # only the seen privates, in order


def test_derive_home_net_falls_back_when_no_private():
    hn = suricata.derive_home_net(["8.8.8.8", "1.1.1.1", "garbage"])
    assert hn == "[10.0.0.0/8,172.16.0.0/12,192.168.0.0/16]"   # RFC1918 default


def test_var_sets_home_net_implies_external_complement():
    s = suricata.var_sets(home_net="[10.0.0.0/8]")
    assert "vars.address-groups.HOME_NET=[10.0.0.0/8]" in s
    assert "vars.address-groups.EXTERNAL_NET=![10.0.0.0/8]" in s


def test_var_sets_explicit_external_and_extra_passthrough():
    s = suricata.var_sets(home_net="[10.0.0.0/8]", external_net="[1.2.3.0/24]",
                          extra_sets=["vars.port-groups.HTTP_PORTS=8080"])
    assert "vars.address-groups.EXTERNAL_NET=[1.2.3.0/24]" in s
    assert "vars.port-groups.HTTP_PORTS=8080" in s


def test_var_sets_empty_when_nothing_given():
    assert suricata.var_sets() == []


def test_suricata_argv_carries_sets_and_rules(tmp_path):
    pcap = tmp_path / "c.pcap"; pcap.write_bytes(b"x")
    rules = tmp_path / "r"; rules.mkdir(); rf = rules / "suricata.rules"; rf.write_text("")
    argv = suricata.suricata_argv(str(pcap), "/out", str(rules), str(rf), "img",
                                  sets=["vars.address-groups.HOME_NET=[10.0.0.0/8]"])
    assert "-r" in argv and "/pcaps/c.pcap" in argv
    assert argv[argv.index("-S") + 1] == "/rules/suricata.rules"
    i = argv.index("--set")
    assert argv[i + 1] == "vars.address-groups.HOME_NET=[10.0.0.0/8]"


def test_collect_ips_from_eve_stream():
    eve = '\n'.join([
        '{"event_type":"flow","src_ip":"10.0.0.1","dest_ip":"8.8.8.8"}',
        '{"event_type":"alert","src_ip":"10.0.0.2","dest_ip":"10.0.0.1"}',
        'not json',
        '{"event_type":"stats"}',
    ])
    assert suricata.collect_ips(eve) == ["10.0.0.1", "10.0.0.2", "8.8.8.8"]


# ---- Hayabusa in the evtx pipeline (no-binary note path) --------------------
from get_sybers_dfir import evtx


def test_evtx_run_hayabusa_notes_missing_binary(tmp_path):
    empty = tmp_path / "hb"; empty.mkdir()
    out = tmp_path / "out"; out.mkdir()
    res = evtx.run_hayabusa([str(tmp_path)], str(out), hb_dir=str(empty))
    assert res["produced"] == 0 and res["output"] is None
    assert "no hayabusa binary" in res["note"]
