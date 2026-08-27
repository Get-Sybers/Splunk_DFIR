"""The ONLY python entry the volatility image may run (baked, allow-listed).

Imports the mounted jsonl_dfir renderer so Volatility discovers it, then hands
the CLI the remaining argv verbatim:

    python3 /opt/dfir/vol_wrapper.py <renderer.py> <vol args...>
"""
import importlib.util
import sys

spec = importlib.util.spec_from_file_location("jsonl_dfir_renderer", sys.argv[1])
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

from volatility3.cli import CommandLine

sys.argv = ["vol"] + sys.argv[2:]
CommandLine().run()
