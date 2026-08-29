"""Plaso execution evidence → MITRE CAR `process` maps (epic #86, Phase 2).

Port of the vetted KQL views `CarProcess_Plaso` and `CarProcess_Cron`
(kusto/schema/40-mitre.kql) onto the declarative engine. The raw shape is the
wrapped l2t JSONL the plaso lane emits (ingest/prepare.split_l2t):
``{"SourceImage", "Timestamp", "Parser", "Record": {<flat plaso event>}}`` —
`Record` fields are reached with the `payload` marker scoped to "Record".

Three artefact keys, matching the lane's per-parser table split:

- **plaso_exec_prefetch** ← L2tPrefetch. Only `windows:prefetch:execution`
  rows are runs; the parser's `windows:volume:creation` rows are volume
  metadata (no program) and stay raw.
- **plaso_exec_winreg** ← L2tWinreg (and an L2tAmcache / L2tBam table, should
  a plaso version emit those parsers outside winreg/): amcache, userassist,
  bam, appcompatcache. The KQL's `programscache` rows carry no program-path
  field at all — nothing provable maps, so they stay raw (canonical-or-raw).
- **plaso_exec_cron** ← L2tText: `syslog:cron:task_run`.

Field semantics follow MITRE's own docs (car.mitre.org) and the KQL view's
per-parser findings, with the engine's stricter null-over-near-miss rules
(docs/CAR-Relations.md; car-store.md §3):

- The EXECUTED PROGRAM's path lives in a different Record field per parser —
  NEVER in Record.filename/display_name, which name the parsed ARTEFACT file
  itself (the .pf file, the hive) and must not leak into exe/image_path.
  Likewise the top-level Record.sha256_hash is the ARTEFACT file's own hash —
  never a program hash (it is kept native as provenance only).
- `exe` is the executable NAME (MITRE: the process's executable) and
  `image_path` the FULL path — where only a bare name is provable (XP-era
  prefetch, a shell builtin in a cron command line) `exe` carries it and
  `image_path` stays an honest null, per the PIIAT-Mem process convention.
  (The KQL put the same value in both; the engine's rule is stricter.)
- `action="create"` records the vetted judgement that each row EVIDENCES a
  program execution (prefetch run, shimcache/amcache presence with the
  execution inference the KQL ratified, userassist run counter, bam last-run,
  cron task_run). The artefact timestamps differ in meaning (last-run,
  file-mtime, log-line time) — `timestamp_desc` is kept native so the analyst
  sees which.
- No native record identity exists (no EventRecordId analogue), so `guid` is
  left unset — engine-assigned later, never minted from forgeable content.
"""
from __future__ import annotations

from ..normalize import basename, first, payload, regex1  # noqa: F401


def _R(key):
    """A field out of the wrapped row's flat plaso `Record` dict."""
    return payload(key, "Record")


# --- variant predicates (globally-unique names, plaso_ prefixed) -------------

def plaso_is_prefetch_execution(rec) -> bool:
    """L2tPrefetch carries both windows:volume:creation (volume metadata, no
    program) and windows:prefetch:execution — only the latter is a run."""
    record = rec.get("Record") or {}
    return record.get("data_type") == "windows:prefetch:execution"


def _parser(rec) -> str:
    return str(rec.get("Parser") or "").lower()


def plaso_is_amcache(rec) -> bool:
    return "amcache" in _parser(rec)


def plaso_is_userassist_run(rec) -> bool:
    """Only userassist rows that EVIDENCE a program run map. XP-format value
    names: `UEME_RUNPATH:<path>` is a program execution; UEME_RUNPIDL (a
    shortcut/PIDL — no program path recorded), UEME_RUNCPL (a .cpl applet —
    the backing executable is unrecorded), UEME_CTL*/UEME_UISCUT (session and
    UI counters — not executions) stay raw. Win7+ plaso decodes value names to
    the bare path (no UEME_ prefix) — those map too. The vetted KQL mapped
    every userassist row; the store's canonical-or-raw rule tightens that: a
    `process create` whose exe would be `UEME_CTLSESSION` asserts an execution
    the evidence doesn't contain."""
    if "userassist" not in _parser(rec):
        return False
    vn = str((rec.get("Record") or {}).get("value_name") or "")
    return vn.startswith("UEME_RUNPATH:") or (bool(vn) and not vn.startswith("UEME_"))


def plaso_is_bam(rec) -> bool:
    # token match — "bam" as a path segment ("winreg/bam"), not a substring
    import re
    return bool(re.search(r"(?:^|/)bam(?:/|$)", _parser(rec)))


def plaso_is_appcompatcache(rec) -> bool:
    return "appcompatcache" in _parser(rec)


def plaso_is_cron_task_run(rec) -> bool:
    record = rec.get("Record") or {}
    return record.get("data_type") == "syslog:cron:task_run"


PREDICATES = {
    "plaso_is_prefetch_execution": plaso_is_prefetch_execution,
    "plaso_is_amcache": plaso_is_amcache,
    "plaso_is_userassist_run": plaso_is_userassist_run,
    "plaso_is_bam": plaso_is_bam,
    "plaso_is_appcompatcache": plaso_is_appcompatcache,
    "plaso_is_cron_task_run": plaso_is_cron_task_run,
}


# --- shared blocks ----------------------------------------------------------

# hostname: MITRE "The hostname of the machine [the process ran on]" — the
# image's identity, stamped by the lane (Record.image_hostname), verbatim as
# the KQL maps it. Doubles as the enrich scope key (host).
_IMG_HOST = _R("image_hostname")

_KEEP = ["SourceImage", "Parser"]

# provenance of the observation — the ARTEFACT file (never exe/image_path) and
# its own hash, plus which plaso event this was
_PROVENANCE = {
    "data_type": _R("data_type"),
    "timestamp_desc": _R("timestamp_desc"),   # last-run vs file-mtime vs …
    "artefact_file": _R("display_name"),      # the .pf / hive / log file
    "artefact_sha256": _R("sha256_hash"),     # the ARTEFACT file's hash
}


def _win_props(image_path_marker):
    """The common process props for the Windows execution artefacts: full path
    into image_path, its basename into exe, plus user and host identity."""
    return {
        "exe": basename(image_path_marker),
        "image_path": image_path_marker,
        # plaso's username is "-" on most registry/prefetch rows — the payload
        # marker's blank rules turn that into an honest null
        "user": _R("username"),
        "hostname": _IMG_HOST,
    }


# userassist: the program is provable only from the value name — XP format
# carries it after "UEME_RUNPATH:", Win7+ plaso decodes to the bare path.
_UA_PROG = first(regex1(_R("value_name"), r"^UEME_RUNPATH:(.+)$"),
                 regex1(_R("value_name"), r"^(?!UEME_)(.+)$"))


MAPPINGS = {
    # ---- L2tPrefetch → process create ---------------------------------------
    "plaso_exec_prefetch": {
        "variants": [
            ("plaso_is_prefetch_execution", {
                "object": "process", "action": "create", "ts": "Timestamp",
                "host": _IMG_HOST,
                "props": {
                    # Record.executable is the bare NAME plaso always fills —
                    # exactly MITRE's exe. The KQL's preferred full path,
                    # Record.path_hints[0], is a LIST the marker set cannot
                    # index (and it is empty on XP-era .pf, version 17, as in
                    # the real evidence) — the list is surfaced native below
                    # and image_path stays an honest null rather than carrying
                    # the bare name (null-over-near-miss).
                    "exe": _R("executable"),
                    "user": _R("username"),
                    "hostname": _IMG_HOST,
                },
                "keep": _KEEP,
                "native_extract": dict(
                    _PROVENANCE,
                    path_hints=_R("path_hints"),   # full-path candidates (list)
                    run_count=_R("run_count"),
                    prefetch_hash=_R("prefetch_hash"),
                ),
            }),
        ],
        "default": None,   # windows:volume:creation rows are not executions
    },
    # ---- L2tWinreg → process create (amcache/userassist/bam/appcompatcache) -
    "plaso_exec_winreg": {
        "variants": [
            ("plaso_is_amcache", {
                "object": "process", "action": "create", "ts": "Timestamp",
                "host": _IMG_HOST,
                "props": dict(
                    _win_props(_R("full_path")),
                    # Record.sha1 is the PROGRAM's SHA-1 (plaso already strips
                    # the hive's 4-char "0000" prefix). Record.sha1_hash would
                    # be the parsed hive's own hash — deliberately not used.
                    # The KQL's coalesce fallback onto Record.filename is
                    # dropped: filename names the ARTEFACT file (owner
                    # directive) — full_path or null.
                    sha1_hash=_R("sha1"),
                ),
                "keep": _KEEP,
                "native_extract": dict(
                    _PROVENANCE,
                    key_path=_R("key_path"),
                    program_identifier=_R("program_identifier"),
                    file_reference=_R("file_reference"),
                ),
            }),
            ("plaso_is_userassist_run", {
                "object": "process", "action": "create", "ts": "Timestamp",
                "host": _IMG_HOST,
                "props": {
                    # basename of the run target ("E:\R54402.EXE" → R54402.EXE)
                    "exe": basename(_UA_PROG),
                    # full path only when the value actually IS a path (has a
                    # separator) — a bare decoded name never fakes image_path
                    "image_path": regex1(_UA_PROG, r"^(.*[\\/].*)$"),
                    "user": _R("username"),
                    "hostname": _IMG_HOST,
                },
                "keep": _KEEP,
                "native_extract": dict(
                    _PROVENANCE,
                    key_path=_R("key_path"),
                    value_name=_R("value_name"),
                    number_of_executions=_R("number_of_executions"),
                    # the OWNING USER's SID, provable from the NTUSER hive
                    # path the artefact was read out of — a join candidate for
                    # the user attribution step, never a canonical `sid` (the
                    # record itself does not state it)
                    hive_user_sid=regex1(_R("display_name"),
                                         r"(S-1-5-21-[0-9-]+)"),
                ),
            }),
            ("plaso_is_bam", {
                "object": "process", "action": "create", "ts": "Timestamp",
                "host": _IMG_HOST,
                "props": dict(
                    _win_props(_R("path")),
                    # BAM keys the entry per user — the SID is native here
                    sid=_R("user_identifier"),
                ),
                "keep": _KEEP,
                "native_extract": dict(_PROVENANCE, key_path=_R("key_path")),
            }),
            ("plaso_is_appcompatcache", {
                "object": "process", "action": "create", "ts": "Timestamp",
                "host": _IMG_HOST,
                # path is the recorded NT form ("\??\C:\...") — verbatim, as
                # the KQL keeps it. Timestamp is the cached FILE's mtime
                # (timestamp_desc kept native says so). Entries repeat per
                # ControlSet — dedupe is a downstream concern.
                "props": _win_props(_R("path")),
                "keep": _KEEP,
                "native_extract": dict(
                    _PROVENANCE,
                    key_path=_R("key_path"),
                    entry_index=_R("entry_index"),
                    control_set=_R("control_set"),
                ),
            }),
            # programscache rows (in the KQL's `where` but its case-else): no
            # program-path field exists on them — nothing provable maps; raw.
        ],
        "default": None,
    },
    # ---- L2tText → process create (Linux cron task_run) ---------------------
    "plaso_exec_cron": {
        "variants": [
            ("plaso_is_cron_task_run", {
                "object": "process", "action": "create", "ts": "Timestamp",
                # scope/host: the image identity where the lane has one; a
                # log-only source (image_hostname empty — e.g. an aggregating
                # log server) falls back to the syslog-RECORDED hostname
                # (Record.hostname, per-line: pits-gatsby vs pits-adams in one
                # file) — recorded, not trusted.
                "host": first(_IMG_HOST, _R("hostname")),
                "props": {
                    # the KQL's extract(@"^(\S+)"): first token of the command
                    # line. exe = its basename ("/usr/bin/php" → php; a shell
                    # builtin like "test" stays as-is); image_path only when
                    # the token is a ROOTED path — "test"/"cd" never fake one.
                    "exe": basename(regex1(_R("command"), r"^(\S+)")),
                    "image_path": regex1(_R("command"), r"^(/\S+)"),
                    "command_line": _R("command"),
                    # the crond worker pid the syslog line names — the
                    # process's own pid (heuristic join key: pid + time)
                    "pid": _R("pid"),
                    "user": _R("username"),
                    "hostname": first(_IMG_HOST, _R("hostname")),
                },
                "keep": _KEEP,
                "native_extract": dict(
                    _PROVENANCE,
                    reporter=_R("reporter"),
                    syslog_hostname=_R("hostname"),
                ),
            }),
        ],
        "default": None,   # other syslog lines are not cron executions
    },
}
