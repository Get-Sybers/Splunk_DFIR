"""Unit tests for the pure logic of the disk-image extractor (no docker needed)."""
import os

from get_sybers_dfir import imageexport


def test_argv_matches_disk_image_sh_recipe(tmp_path):
    img = tmp_path / "Host.E01"
    img.write_bytes(b"x")
    out = tmp_path / "out"
    argv = imageexport.image_export_argv(str(img), str(out))
    # container + mounts
    assert argv[:3] == ["docker", "run", "--rm"]
    assert "-v" in argv and f"{tmp_path}:/data:ro" in argv
    assert f"{out}:/out" in argv
    # the plaso tool and its flags (mirrors sig_extract_artifacts)
    assert "image_export.py" in argv
    assert argv[argv.index("--partitions") + 1] == "all"
    assert argv[argv.index("--vss_stores") + 1] == "none"
    assert argv[argv.index("--artifact_filters") + 1] == "WindowsEventLogs"
    # the image is referenced by its basename under the /data mount, and is last
    assert argv[-1] == "/data/Host.E01"
    assert argv[argv.index("-w") + 1] == "/out"


def test_argv_vss_and_multiple_filters(tmp_path):
    img = tmp_path / "Host.raw"
    img.write_bytes(b"x")
    argv = imageexport.image_export_argv(
        str(img), str(tmp_path / "o"),
        artifact_filters=("WindowsEventLogs", "WindowsRegistry"), vss=True)
    assert argv[argv.index("--vss_stores") + 1] == "all"
    # multiple filters are comma-joined into the single flag image_export expects
    assert argv[argv.index("--artifact_filters") + 1] == "WindowsEventLogs,WindowsRegistry"


def test_argv_custom_plaso_image(tmp_path):
    img = tmp_path / "d.vmdk"
    img.write_bytes(b"x")
    argv = imageexport.image_export_argv(str(img), str(tmp_path / "o"),
                                         plaso_image="log2timeline/plaso:20240101")
    assert "log2timeline/plaso:20240101" in argv


def test_discover_single_image_file(tmp_path):
    img = tmp_path / "Host.E01"
    img.write_bytes(b"x")
    assert imageexport.discover_images(str(img)) == [os.path.realpath(str(img))]


def test_discover_non_image_file_is_empty(tmp_path):
    f = tmp_path / "notes.txt"
    f.write_bytes(b"x")
    assert imageexport.discover_images(str(f)) == []


def test_discover_dir_recurses_and_filters_by_ext(tmp_path):
    (tmp_path / "a").mkdir()
    (tmp_path / "a" / "one.E01").write_bytes(b"x")
    (tmp_path / "two.raw").write_bytes(b"x")
    (tmp_path / "skip.evtx").write_bytes(b"x")   # a log, not an image
    (tmp_path / "readme.md").write_bytes(b"x")
    found = imageexport.discover_images(str(tmp_path))
    assert [os.path.basename(p) for p in found] == ["one.E01", "two.raw"]
    assert all(os.path.isabs(p) for p in found)


def test_discover_is_case_insensitive(tmp_path):
    (tmp_path / "UPPER.E01").write_bytes(b"x")
    (tmp_path / "lower.e01").write_bytes(b"x")
    assert len(imageexport.discover_images(str(tmp_path))) == 2


def test_discover_covers_vhd_vhdx_qcow2(tmp_path):
    for name in ("a.vhd", "b.vhdx", "c.qcow2", "d.E01"):
        (tmp_path / name).write_bytes(b"x")
    (tmp_path / "notes.txt").write_bytes(b"x")
    got = sorted(os.path.basename(p) for p in imageexport.discover_images(str(tmp_path)))
    assert got == ["a.vhd", "b.vhdx", "c.qcow2", "d.E01"]


def test_extract_staged_reuses_existing(tmp_path, monkeypatch):
    """An image whose stage subdir already holds a matching file is not re-extracted."""
    img = tmp_path / "host.E01"
    img.write_bytes(b"x")
    stage = tmp_path / "stage" / "host"
    stage.mkdir(parents=True)
    (stage / "Security.evtx").write_bytes(b"ElfFile")

    def boom(*a, **kw):
        raise AssertionError("extract() must not run when files are already staged")

    monkeypatch.setattr(imageexport, "extract", boom)
    s = imageexport.extract_staged(str(img), str(tmp_path / "stage"))
    assert s["images"] == 1 and s["reused"] == 1 and s["extracted"] == 0


def test_extract_staged_runs_and_counts(tmp_path, monkeypatch):
    img = tmp_path / "host.E01"
    img.write_bytes(b"x")
    stage = tmp_path / "stage"

    def fake_extract(image, out_dir, **kw):
        os.makedirs(out_dir, exist_ok=True)
        p = os.path.join(out_dir, "System.evtx")
        with open(p, "wb") as fh:
            fh.write(b"ElfFile")
        return [p, os.path.join(out_dir, "ignored.txt")]

    monkeypatch.setattr(imageexport, "extract", fake_extract)
    s = imageexport.extract_staged(str(img), str(stage))
    assert s["extracted"] == 1 and s["reused"] == 0 and s["failed"] == 0
    assert s["results"][0]["files"] == 1


def test_extract_staged_force_reextracts(tmp_path, monkeypatch):
    img = tmp_path / "host.E01"
    img.write_bytes(b"x")
    stage = tmp_path / "stage"
    pre = stage / "host"
    pre.mkdir(parents=True)
    (pre / "old.evtx").write_bytes(b"ElfFile")
    ran = []
    monkeypatch.setattr(imageexport, "extract",
                        lambda image, out_dir, **kw: ran.append(image) or [])
    s = imageexport.extract_staged(str(img), str(stage), force=True)
    assert ran and s["reused"] == 0
