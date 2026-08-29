"""Unit tests for the pure logic of the volatility processor (no docker needed)."""
import os

from get_sybers_dfir import volatility as vol


def test_is_memory_image_extensions():
    assert vol.is_memory_image("dump.raw")
    assert vol.is_memory_image("box.MEM")
    assert vol.is_memory_image("charlie-2009-12-11.mddramimage")  # M57 corpus
    assert not vol.is_memory_image("notes.txt")
    assert not vol.is_memory_image("capture.pcap")


def test_clean_name_folds_dirs_and_spaces():
    assert vol.clean_name("lonewolf/mem dump.mem") == "lonewolf_mem_dump.mem"


def test_discover_recurses_and_sorts(tmp_path):
    (tmp_path / "a").mkdir()
    (tmp_path / "a" / "x.raw").write_bytes(b"m")
    (tmp_path / "b.vmem").write_bytes(b"m")
    (tmp_path / "readme.txt").write_bytes(b"m")
    got = [os.path.relpath(p, tmp_path) for p in vol.discover(str(tmp_path))]
    assert got == ["a/x.raw", "b.vmem"]


def test_valid_jsonl(tmp_path):
    good = tmp_path / "good.jsonl"
    good.write_text('{"PID": 4}\n{"PID": 8}\n')
    assert vol._valid_jsonl(str(good)) is True

    empty = tmp_path / "empty.jsonl"
    empty.write_text("")
    assert vol._valid_jsonl(str(empty)) is False

    junk = tmp_path / "junk.jsonl"
    junk.write_text("not json at all\n")
    assert vol._valid_jsonl(str(junk)) is False


def test_process_no_images_is_clean(tmp_path):
    s = vol.process(
        str(tmp_path / "mem"), str(tmp_path / "out"), str(tmp_path / "sym"),
        "renderer.py", "plugins",
    )
    assert s["images"] == 0 and s["processed"] == 0 and s["failed"] == 0
    assert s["plugins"] == len(vol.DEFAULT_PLUGINS)


def test_default_plugins_include_car_set():
    assert "windows.PIIAT_processes" in vol.DEFAULT_PLUGINS
    assert "windows.PIIAT_registry" in vol.DEFAULT_PLUGINS
    assert vol.DEFAULT_PLUGINS[0] == "banners.Banners"
