"""Unit tests for the DetectRaptor provisioning module (pure logic, no network)."""
import os

from get_sybers_dxdfir.signatures import detectraptor


_A = (
    'import "pe"\n'
    "rule Alpha : FILE {\n"
    "    strings:\n        $s = \"x\"\n    condition:\n        $s\n}\n"
    "private rule Helper {\n    condition:\n        true\n}\n"
)
_B = (
    'import "pe"\nimport "math"\n'
    "rule Alpha {\n    condition:\n        true\n}\n"     # duplicate id, different body
    "rule Beta {\n    condition:\n        math.entropy(0, filesize) > 7\n}\n"
)


def test_merge_dedupes_and_hoists_imports():
    text, stats = detectraptor.merge_rules([("a.yar", _A), ("b.yar", _B)])
    # imports hoisted once each, before any rule
    assert text.startswith('import "pe"\nimport "math"\n')
    assert text.count('import "pe"') == 1
    # first occurrence of Alpha wins (a.yar's tagged variant), b.yar's is dropped
    assert text.count("rule Alpha") == 1
    assert "rule Alpha : FILE" in text
    assert "private rule Helper" in text and "rule Beta" in text
    assert stats["a.yar"] == {"kept": 2, "dropped": 0, "incompatible": 0}
    assert stats["b.yar"] == {"kept": 1, "dropped": 1, "incompatible": 0}


def test_merge_drops_incompatible_features():
    bad = 'rule Telf {\n    condition:\n        elf.telfhash() == "t1"\n}\n'
    text, stats = detectraptor.merge_rules([("c.yar", bad + "rule Ok { condition: true }\n")])
    assert "Telf" not in text and "rule Ok" in text
    assert stats["c.yar"] == {"kept": 1, "dropped": 0, "incompatible": 1}


def test_merge_keeps_hex_continuation_lines_in_rule():
    # full_windows_file.yar spills multi-line hex strings to column 0; those lines
    # must stay inside their rule, not be treated as rule boundaries.
    hexy = (
        "rule Hexy {\n    strings:\n        $h = { AA BB\n"
        "CC DD }\n    condition:\n        $h\n}\n"
        "rule Next { condition: true }\n"
    )
    text, stats = detectraptor.merge_rules([("d.yar", hexy)])
    assert stats["d.yar"]["kept"] == 2
    assert "CC DD }" in text


def test_fetch_skips_when_merged_file_exists(tmp_path):
    out = tmp_path / "detectraptor" / "detectraptor.yar"
    out.parent.mkdir()
    out.write_text("// existing\n")
    res = detectraptor.fetch(str(tmp_path))          # would need network otherwise
    assert res["skipped"] is True and res["output"] == str(out)
    assert out.read_text() == "// existing\n"


def test_fetch_rejects_unknown_asset(tmp_path):
    try:
        detectraptor.fetch(str(tmp_path), assets=["nope"])
    except ValueError as exc:
        assert "unknown asset" in str(exc)
    else:
        raise AssertionError("expected ValueError")


def test_manifest_shape():
    # every pinned asset: yara/ file name, 64-hex sha256, gz flag matches extension
    assert detectraptor.ASSETS, "manifest must not be empty"
    for name, (fname, sha, gz) in detectraptor.ASSETS.items():
        assert fname.endswith(".yar.gz" if gz else ".yar"), name
        assert len(sha) == 64 and int(sha, 16) >= 0, name
    assert len(detectraptor._PIN) == 40 and int(detectraptor._PIN, 16) >= 0
