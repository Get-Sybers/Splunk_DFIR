"""get_sybers_dfir — the DX_DFIR processing package.

Pure Python processors (zeek, plaso, volatility, evtx, signatures, ingest) and the
`dxdfir` CLI. The Ansible collection `get_sybers.dfir` invokes these as single
actions; the playbook holds the decisions. See docs/CAR-Extraction-Rules.md and
epic #46.
"""

__version__ = "0.4.0"
