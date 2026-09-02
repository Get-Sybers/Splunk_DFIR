"""get_sybers_dfir — the DX_DFIR processing package.

Pure Python processors (zeek, plaso, volatility, evtx, zimmerman, signatures),
the CAR lane (mitrecar, carcheck), the Elastic detection rules (detect/) and the
`dxdfir` CLI. The Ansible collection `get_sybers.dfir` invokes these as single
actions; the playbook holds the decisions. See docs/CAR-Extraction-Rules.md and
epic #46.
"""

__version__ = "0.6.0"
