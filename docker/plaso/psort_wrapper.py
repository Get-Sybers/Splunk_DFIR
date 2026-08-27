"""The ONLY python entry the plaso image may run (baked, allow-listed).

Imports the mounted custom output module so psort discovers it, then hands
psort the remaining argv verbatim:

    python3 /opt/dfir/psort_wrapper.py <module.py> <psort args...>
"""
import importlib.util
import sys

spec = importlib.util.spec_from_file_location("l2t_json_dfir", sys.argv[1])
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

from plaso.scripts.psort import Main

sys.argv = ["psort.py"] + sys.argv[2:]
sys.exit(Main())
