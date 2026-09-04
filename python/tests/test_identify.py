"""Unit tests for collection evidence identification (docker/file mocked)."""
import json
from unittest import mock

from get_sybers_dfir import collection, identify


def _mk_collection(tmp_path, files):
    """Build a registered collection under tmp_path from {rel: bytes}."""
    root = collection.collection_dir(tmp_path, "c")
    root.mkdir(parents=True)
    (root / ".collection").write_text("name: c\nregistered_at: x\n")   # registered
    for rel, data in files.items():
        p = root / rel
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_bytes(data)
    return tmp_path


# --- _record: rule-name + dfVFS -> identity mapping -------------------------------
def test_record_disk_linux_streamoptimized():
    rec = identify._record(
        "VM_files/x.vmdk", "VM_files", 100, "VMware4 disk image",
        ["id_compression_streamoptimized", "id_format_vmdk"],
        {"storage_media": ["VMDK"], "volume_systems": ["GPT", "LVM"],
         "file_systems": ["EXT"], "vmdk_create_type": "streamOptimized"})
    assert rec["format"] == "vmdk"
    assert rec["compression"] == "streamoptimized"
    assert rec["filesystems"] == ["ext"]
    assert rec["os_family"] == "linux"        # derived from the ext filesystem
    assert "gpt" in rec["partition_schemes"]


def test_record_memory_windows_from_yara_only():
    # a memory dump gets no dfVFS scan; the NTFS strings in it still cue Windows
    rec = identify._record("memory/m.mem", "memory", 100, "data",
                           ["id_filesystem_ntfs_windows"], None)
    assert rec["filesystems"] == ["ntfs"]
    assert rec["os_family"] == "windows"


def test_record_compressed_without_inner_fs_is_noted():
    rec = identify._record("VM_files/x.vmdk", "VM_files", 100, None,
                           ["id_compression_streamoptimized", "id_format_vmdk"], None)
    assert rec["compression"] == "streamoptimized"
    assert rec["os_family"] is None
    assert any("decompression" in n for n in rec["notes"])


# --- identify_collection orchestration -------------------------------------------
def test_identify_collection_writes_records_and_logs(tmp_path):
    repo = _mk_collection(tmp_path, {
        "VM_files/d.vmdk": b"KDMV" + b"\0" * 60,
        "pcaps/c.pcap": b"\xd4\xc3\xb2\xa1"})
    with mock.patch.object(identify, "_yara_facts",
                           return_value={"VM_files/d.vmdk": ["id_format_vmdk"],
                                         "pcaps/c.pcap": ["id_format_pcap"]}), \
         mock.patch.object(identify, "_dfvfs_facts",
                           return_value={"storage_media": ["VMDK"],
                                         "file_systems": ["EXT"]}) as m_dfvfs, \
         mock.patch.object(identify, "_file_type", return_value="X"):
        recs = identify.identify_collection(repo, "c")

    assert {r["path"] for r in recs} == {"VM_files/d.vmdk", "pcaps/c.pcap"}
    # dfVFS runs ONLY for the disk/VM item, never the pcap
    assert m_dfvfs.call_count == 1
    vm = next(r for r in recs if r["path"].endswith(".vmdk"))
    pc = next(r for r in recs if r["path"].endswith(".pcap"))
    assert vm["filesystems"] == ["ext"] and vm["os_family"] == "linux"
    assert pc["filesystems"] == [] and pc["format"] == "pcap"
    # persisted + logged
    idf = collection.collection_dir(repo, "c") / identify.IDENTITY_FILE
    assert json.loads(idf.read_text())["collection"] == "c"
    assert any(e["event"] == "identified" for e in collection.read_log(repo, "c"))


def test_identity_file_is_never_evidence(tmp_path):
    repo = _mk_collection(tmp_path, {"pcaps/c.pcap": b"\xd4\xc3\xb2\xa1"})
    root = collection.collection_dir(repo, "c")
    (root / identify.IDENTITY_FILE).write_text("{}")
    ev = [str(p.relative_to(root)) for p in collection.evidence_files(root)]
    assert identify.IDENTITY_FILE not in ev      # not hashed/counted as evidence
    assert "pcaps/c.pcap" in ev


def test_file_type_uses_libmagic():
    fake = mock.Mock(return_value=mock.Mock(stdout="pcap capture file\n", returncode=0))
    from pathlib import Path
    assert identify._file_type(Path("/x"), run=fake) == "pcap capture file"
    assert fake.call_args.args[0][:2] == ["file", "-b"]
