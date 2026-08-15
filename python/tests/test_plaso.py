"""Unit tests for the pure logic of the plaso processor (no docker needed)."""
import os

from get_sybers_dfir import plaso


# ---- content-first format detection ----------------------------------------
def _w(p, b):
    p.write_bytes(b)
    return str(p)


def test_detect_ewf_segment1_vs_continuation(tmp_path):
    head = b"\x45\x56\x46\x09\x0d\x0a\xff\x00"  # "EVF\x09\x0d\x0a\xff\x00"
    seg1 = _w(tmp_path / "a.E01", head + b"\x00" + b"\x01\x00")
    segN = _w(tmp_path / "a.E02", head + b"\x00" + b"\x02\x00")
    assert plaso.detect_format(seg1) == "ewf1"
    assert plaso.detect_format(segN) == "ewf-cont"


def test_detect_ewf2_vmdk_qcow_vhdx_vhd(tmp_path):
    assert plaso.detect_format(_w(tmp_path / "x", b"\x45\x56\x46\x32\x0d\x0a\x81\x00")) == "ewf2"
    assert plaso.detect_format(_w(tmp_path / "k", b"KDMV____")) == "vmdk"
    assert plaso.detect_format(_w(tmp_path / "q", b"QFI\xfb___")) == "qcow2"
    assert plaso.detect_format(_w(tmp_path / "h", b"vhdxfile")) == "vhdx"
    assert plaso.detect_format(_w(tmp_path / "v", b"conectix")) == "vhd"


def test_detect_vmdk_text_descriptor(tmp_path):
    assert plaso.detect_format(_w(tmp_path / "d.vmdk", b"# Disk DescriptorFile\nversion=1\n")) == "vmdk"


def test_detect_vhd_footer_only(tmp_path):
    # header is NOT conectix; last 512 bytes START with conectix (fixed-format VHD).
    body = b"\x00" * 88 + b"conectix" + b"\x00" * (512 - 8)
    assert plaso.detect_format(_w(tmp_path / "fixed.vhd", body)) == "vhd"


def test_detect_raw_has_no_signature(tmp_path):
    assert plaso.detect_format(_w(tmp_path / "r.dd", b"\x00" * 32)) == ""


# ---- extension fallback ----------------------------------------------------
def test_ext_format():
    assert plaso.ext_format("base-flat.vmdk") == "vmdk-extent"
    assert plaso.ext_format("d-s001.vmdk") == "vmdk-extent"
    assert plaso.ext_format("img.E01") == "ewf1"
    assert plaso.ext_format("img.E02") == "ewf-cont"
    assert plaso.ext_format("d.vmdk") == "vmdk"
    assert plaso.ext_format("d.VHD") == "vhd"
    assert plaso.ext_format("d.vhdx") == "vhdx"
    assert plaso.ext_format("d.aff") == "aff"
    assert plaso.ext_format("d.dd") == "raw"
    assert plaso.ext_format("readme.txt") == ""


def test_get_clean_filename():
    assert plaso.get_clean_filename("src/img.E01") == "src_img_E01"
    assert plaso.get_clean_filename("a b.raw") == "a_b_raw"


# ---- VM descriptor selection ----------------------------------------------
def test_is_vmdk_descriptor(tmp_path):
    good = _w(tmp_path / "b.vmdk", b"# Disk DescriptorFile\nCID=1\n")
    bad = _w(tmp_path / "b-flat.vmdk", b"\x00" * 64)
    assert plaso.is_vmdk_descriptor(good) is True
    assert plaso.is_vmdk_descriptor(bad) is False


def test_get_vm_descriptor_base_only(tmp_path):
    _w(tmp_path / "vm.vmdk", b"# Disk DescriptorFile\n")
    _w(tmp_path / "vm-flat.vmdk", b"\x00" * 32)   # raw extent, ignored
    path, status = plaso.get_vm_descriptor(str(tmp_path))
    assert status == "ok" and os.path.basename(path) == "vm.vmdk"


def test_get_vm_descriptor_latest_snapshot_wins(tmp_path):
    _w(tmp_path / "vm.vmdk", b"# Disk DescriptorFile\n")
    _w(tmp_path / "vm-000001.vmdk", b"# Disk DescriptorFile\n")
    _w(tmp_path / "vm-000002.vmdk", b"# Disk DescriptorFile\n")
    path, status = plaso.get_vm_descriptor(str(tmp_path))
    assert status == "ok" and os.path.basename(path) == "vm-000002.vmdk"


def test_get_vm_descriptor_ambiguous(tmp_path):
    _w(tmp_path / "one.vmdk", b"# Disk DescriptorFile\n")
    _w(tmp_path / "two.vmdk", b"# Disk DescriptorFile\n")
    path, status = plaso.get_vm_descriptor(str(tmp_path))
    assert path is None and status == "ambiguous"


def test_get_vm_descriptor_none(tmp_path):
    _w(tmp_path / "vm-flat.vmdk", b"\x00" * 32)
    path, status = plaso.get_vm_descriptor(str(tmp_path))
    assert path is None and status == "none"


# ---- discovery -------------------------------------------------------------
def test_discover_images_skips_extents_and_segments(tmp_path):
    head = b"\x45\x56\x46\x09\x0d\x0a\xff\x00"
    _w(tmp_path / "case1.E01", head + b"\x00\x01\x00")       # ewf1 (content) -> keep
    _w(tmp_path / "case1.E02", head + b"\x00\x02\x00")       # ewf-cont -> skip
    _w(tmp_path / "raw.dd", b"\x00" * 16)                    # raw (ext) -> keep
    _w(tmp_path / "vm-flat.vmdk", b"\x00" * 16)              # vmdk-extent -> skip
    _w(tmp_path / "notes.txt", b"hello")                     # junk -> skip
    got = {(d["rel"], d["format"]) for d in plaso.discover_images(str(tmp_path))}
    assert ("case1.E01", "ewf1") in got
    assert ("raw.dd", "raw") in got
    assert all(rel != "case1.E02" for rel, _ in got)
    assert all(rel != "vm-flat.vmdk" for rel, _ in got)
    assert len(got) == 2


def test_discover_vms(tmp_path):
    (tmp_path / "VM-A").mkdir()
    (tmp_path / "VM-B").mkdir()
    (tmp_path / "loose.txt").write_bytes(b"x")
    got = [os.path.basename(p) for p in plaso.discover_vms(str(tmp_path))]
    assert got == ["VM-A", "VM-B"]


# ---- idempotence marker ----------------------------------------------------
def test_already_done_requires_db_marker_and_jsonl(tmp_path):
    out = tmp_path
    (out / "plaso").mkdir()
    (out / "jsonl").mkdir()
    (out / "plaso" / "case_E01.plaso").write_bytes(b"PLASO")
    # db present but no marker -> a prior failed psort, NOT done
    assert plaso._already_done(str(out), "case_E01") is False
    # marker + jsonl present -> done
    (out / "jsonl" / "HOST.jsonl").write_text('{"a":1}\n')
    (out / "plaso" / "case_E01.host").write_text("HOST.jsonl")
    assert plaso._already_done(str(out), "case_E01") is True
    # marker points at a missing jsonl -> not done
    (out / "plaso" / "case_E01.host").write_text("GONE.jsonl")
    assert plaso._already_done(str(out), "case_E01") is False


def test_sanitize_host():
    assert plaso._sanitize_host("DESKTOP-ABC 1!") == "DESKTOP-ABC_1"
    assert plaso._sanitize_host("__weird__") == "weird"


def test_process_no_inputs_is_clean(tmp_path):
    s = plaso.process(str(tmp_path / "in"), "", str(tmp_path / "out"), "module.py")
    assert s["images"] == 0 and s["vms"] == 0 and s["processed"] == 0 and s["failed"] == 0
