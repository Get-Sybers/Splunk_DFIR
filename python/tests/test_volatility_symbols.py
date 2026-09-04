"""Unit tests for the Volatility 3 ISF symbol-pack provisioning module.

Pure logic only — no network, no docker, no evidence. The verify/extract/idempotence
paths are exercised with in-memory fixture zips; the one network edge (``fetch``)
is checked only along the branch that must NOT touch the network (idempotence).
"""
import hashlib
import stat
import zipfile

import pytest

from get_sybers_dfir import volatility_symbols as vs


# --- SHA256SUMS parsing ------------------------------------------------------

def test_parse_sha256sums_standard_and_tolerant():
    text = (
        "231d69735b9a5482b16bdbf1ec356e0a95574c44079e68dfb02ebddb34d55f3e  windows.zip\n"
        "58BB7DA2ED1E491CE922D04A59881D201E233B5605C9FD5A7F0C08EE528253C6 *linux.zip\n"  # star + upper
        "fd12c8338724b175b0c5765af3313328b700ad53de4a00b4aa50e9a8bcef9129  ./sub/mac.zip\n"  # path
        "not-a-digest  junk.zip\n"                                                          # ignored
        "\n"
    )
    sums = vs.parse_sha256sums(text)
    assert sums["windows.zip"].startswith("231d6973")
    assert sums["linux.zip"] == "58bb7da2ed1e491ce922d04a59881d201e233b5605c9fd5a7f0c08ee528253c6"
    assert sums["mac.zip"].startswith("fd12c833")   # basename only
    assert "junk.zip" not in sums


def test_sha256_file(tmp_path):
    p = tmp_path / "blob"
    p.write_bytes(b"volatility")
    assert vs.sha256_file(str(p)) == hashlib.sha256(b"volatility").hexdigest()


# --- pack selection ----------------------------------------------------------

def test_select_packs_default_is_windows():
    assert vs.select_packs() == ["windows"]


def test_select_packs_flags_and_all():
    assert vs.select_packs(linux=True, mac=True) == ["linux", "mac"]
    assert vs.select_packs(windows=True, all_=True) == ["windows", "linux", "mac"]  # all wins


# --- extraction (benign) -----------------------------------------------------

def _zip(path, members):
    with zipfile.ZipFile(path, "w") as zf:
        for name, data in members.items():
            zf.writestr(name, data)


def test_extract_pack_preserves_os_namespace(tmp_path):
    src = tmp_path / "windows.zip"
    _zip(src, {"windows/ntkrnlmp.pdb/GUID.json.xz": b"ISF", "windows/readme.txt": b"x"})
    dest = tmp_path / "symbols"
    dest.mkdir()
    files = vs.extract_pack(str(src), str(dest))
    assert (dest / "windows" / "ntkrnlmp.pdb" / "GUID.json.xz").read_bytes() == b"ISF"
    assert set(files) == {"windows/ntkrnlmp.pdb/GUID.json.xz", "windows/readme.txt"}


# --- extraction (zip-slip guard) ---------------------------------------------

def test_safe_extract_rejects_parent_traversal(tmp_path):
    bad = tmp_path / "evil.zip"
    _zip(bad, {"../escape.txt": b"pwn"})
    dest = tmp_path / "symbols"
    dest.mkdir()
    with pytest.raises(ValueError, match="unsafe member path|traversal"):
        vs.extract_pack(str(bad), str(dest))
    assert not (tmp_path / "escape.txt").exists()   # nothing written outside dest


def test_safe_extract_rejects_absolute_path(tmp_path):
    bad = tmp_path / "abs.zip"
    with zipfile.ZipFile(bad, "w") as zf:
        zf.writestr(zipfile.ZipInfo("/abs.txt"), b"pwn")
    dest = tmp_path / "symbols"
    dest.mkdir()
    with pytest.raises(ValueError, match="unsafe member path|traversal"):
        vs.extract_pack(str(bad), str(dest))


def test_safe_extract_rejects_symlink_member(tmp_path):
    bad = tmp_path / "link.zip"
    with zipfile.ZipFile(bad, "w") as zf:
        info = zipfile.ZipInfo("link")
        info.external_attr = (stat.S_IFLNK | 0o777) << 16
        zf.writestr(info, "/etc/passwd")
    dest = tmp_path / "symbols"
    dest.mkdir()
    with pytest.raises(ValueError, match="symlink"):
        vs.extract_pack(str(bad), str(dest))


# --- idempotence (the one fetch branch that must not hit the network) --------

def test_pack_present_via_marker_and_subdir(tmp_path):
    d = tmp_path
    assert vs.pack_present(str(d), "windows") is False
    (d / "windows").mkdir()
    assert vs.pack_present(str(d), "windows") is False          # empty subdir doesn't count
    (d / "windows" / "a.json.xz").write_text("{}")
    assert vs.pack_present(str(d), "windows") is True           # subdir with content
    assert vs.pack_present(str(d), "linux") is False


def test_fetch_skips_present_pack_without_network(tmp_path, monkeypatch):
    calls = {"n": 0}

    def _offline(*_a, **_k):
        calls["n"] += 1
        raise OSError("network is unreachable")
    monkeypatch.setattr(vs.urllib.request, "urlopen", _offline)

    (tmp_path / "windows").mkdir()
    (tmp_path / "windows" / "ntkrnlmp.json.xz").write_text("{}")
    res = vs.fetch(str(tmp_path), packs=["windows"], force=False)
    assert res["packs"] == [{"pack": "windows", "skipped": True}]
    assert calls["n"] == 0                        # present pack -> never hit the network

    # force bypasses idempotence -> it attempts the fetch; offline, the verify-first
    # gate refuses BEFORE any multi-GB download (proving both bypass and fail-fast).
    with pytest.raises(ValueError, match="cannot verify|SHA256SUMS"):
        vs.fetch(str(tmp_path), packs=["windows"], force=True)
    assert calls["n"] >= 1                         # force DID reach the network probe


def test_fetch_rejects_unknown_pack(tmp_path):
    with pytest.raises(ValueError, match="unknown pack"):
        vs.fetch(str(tmp_path), packs=["solaris"])


# --- manifest shape ----------------------------------------------------------

def test_pack_manifest_shape():
    assert vs.PACKS and vs._DEFAULT in vs.PACKS
    assert vs._BASE.startswith("https://")
    for name, fname in vs.PACKS.items():
        assert fname == f"{name}.zip"
