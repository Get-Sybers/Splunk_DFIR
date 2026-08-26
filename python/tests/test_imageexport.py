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
