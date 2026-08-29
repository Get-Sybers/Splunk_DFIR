"""Plaso Windows file-artefact evidence → CAR file (epic #86).

- **lnk (Windows shortcuts)** → file: a .lnk embeds its TARGET's MAC times as
  recorded at link time — each timestamped row maps by timestamp_desc exactly
  like filestat (create/modify/read); "Not a time" rows stay raw. file_path is
  the recorded target (local_path → network_path → link_target with its
  "<My Computer> " style prefix stripped) — recorded-not-trusted (the lnk can
  be stale or crafted).
- **recycle_bin / recycle_bin_info2** → file/delete: a Recycle Bin record IS
  the deletion event, carrying the file's ORIGINAL path, at its
  "Content Deletion Time".

Both consume the wrapped l2t row shape; field shapes verified against real M57
records.
"""
from __future__ import annotations

import re

from ..normalize import (basename, ext, first, host_label, payload, regex1,  # noqa: F401
                         unescape_backslashes)


def _r(field):
    return payload(field, "Record")


def _rec(rec) -> dict:
    r = rec.get("Record")
    return r if isinstance(r, dict) else {}


def _td(rec) -> str:
    return str(_rec(rec).get("timestamp_desc") or "")


_TD_CREATE = re.compile(r"(?i)creation|crtime|birth")
_TD_MODIFY = re.compile(r"(?i)modification|mtime")
_TD_READ = re.compile(r"(?i)last access|atime|access time")
_TD_DELETE = re.compile(r"(?i)deletion")


def plasoart_lnk_create(rec) -> bool:
    return _rec(rec).get("data_type") == "windows:lnk:link" and bool(_TD_CREATE.search(_td(rec)))


def plasoart_lnk_modify(rec) -> bool:
    return _rec(rec).get("data_type") == "windows:lnk:link" and bool(_TD_MODIFY.search(_td(rec)))


def plasoart_lnk_read(rec) -> bool:
    return _rec(rec).get("data_type") == "windows:lnk:link" and bool(_TD_READ.search(_td(rec)))


def plasoart_recycle_delete(rec) -> bool:
    return (_rec(rec).get("data_type") == "windows:metadata:deleted_item"
            and bool(_TD_DELETE.search(_td(rec))))


PREDICATES = {
    "plasoart_lnk_create": plasoart_lnk_create,
    "plasoart_lnk_modify": plasoart_lnk_modify,
    "plasoart_lnk_read": plasoart_lnk_read,
    "plasoart_recycle_delete": plasoart_recycle_delete,
}

# the recorded target: local_path -> network_path -> link_target with the
# "<My Computer> " style shell-item prefix stripped
_LNK_PATH = unescape_backslashes(first(_r("local_path"), _r("network_path"),
                  regex1(_r("link_target"), r"^(?:<[^>]+>\s*)?(.+)$")))

_HOST = host_label(_r("image_hostname"))
_LNK_NATIVE = {
    "data_type": _r("data_type"),
    "lnk_file": _r("display_name"),        # the shortcut itself (the artefact)
    "description": _r("description"),
    "working_directory": _r("working_directory"),
    "relative_path": _r("relative_path"),
    "file_size": _r("file_size"),
}


def _lnk_map(action):
    return {
        "object": "file", "action": action, "ts": "Timestamp",
        "guid": {"none": True}, "host": _HOST,
        "props": {
            "file_path": _LNK_PATH,
            "file_name": basename(_LNK_PATH),
            "extension": ext(_LNK_PATH),
            "hostname": _r("image_hostname"),
            "user": _r("username"),
        },
        "keep": [], "native_extract": _LNK_NATIVE,
    }


MAPPINGS = {
    # ---- Windows shortcuts: the target's recorded MAC times → file -----------
    "l2t_lnk": {
        "variants": [
            ("plasoart_lnk_create", _lnk_map("create")),
            ("plasoart_lnk_modify", _lnk_map("modify")),
            ("plasoart_lnk_read", _lnk_map("read")),
            # "Not a time" / other rows: the shortcut's existence, no CAR action
        ],
        "default": None,
    },
    # ---- Recycle Bin: the deletion event, with the ORIGINAL path -------------
    "l2t_recyclebin": {
        "variants": [
            ("plasoart_recycle_delete", {
                "object": "file", "action": "delete", "ts": "Timestamp",
                "guid": {"none": True}, "host": _HOST,
                "props": {
                    "file_path": _r("original_filename"),
                    "file_name": basename(_r("original_filename")),
                    "extension": ext(_r("original_filename")),
                    "hostname": _r("image_hostname"),
                    "user": _r("username"),
                },
                "keep": [],
                "native_extract": {"data_type": _r("data_type"),
                                   "file_size": _r("file_size"),
                                   "record_index": _r("record_index"),
                                   "drive_number": _r("drive_number"),
                                   "artefact_file": _r("display_name")},
            }),
        ],
        "default": None,
    },
}
