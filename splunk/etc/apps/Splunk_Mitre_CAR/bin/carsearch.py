#!/usr/bin/env python
# -*- coding: utf-8 -*-
import sys
import os
import json

# Getinfo probe: If the first argument equals "__GETINFO__" (ignoring case and whitespace),
# output a single JSON line and exit immediately.
if len(sys.argv) > 1 and sys.argv[1].strip().upper() == "__GETINFO__":
    info = {
        "version": "1.0",
        "build": "1.0",
        "display": {
            "title": "Car Search Command",
            "description": "Searches YAML files for MITRE CAR analytics."
        },
        "searchmode": "oneshot",
        "generating": True
    }
    sys.stdout.write(json.dumps(info) + "\n")
    sys.stdout.flush()
    sys.exit(0)

# Now import Splunk libraries and other modules.
try:
    from splunklib.searchcommands import dispatch, GeneratingCommand, Configuration, Option
except Exception as e:
    sys.stderr.write("Error importing Splunk libraries: " + str(e) + "\n")
    sys.exit(1)

# Determine the app root and the analytics directory.
APP_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
ANALYTICS_DIR = os.path.join(APP_ROOT, "analytics")

# Add the local directory (which should contain PyYAML) to the Python path.
sys.path.insert(0, os.path.dirname(__file__))
import yaml

@Configuration()
class CarSearchCommand(GeneratingCommand):
    platform = Option(require=False)
    tactic = Option(require=False)

    def generate(self):
        if not os.path.exists(ANALYTICS_DIR):
            self.error("Analytics directory not found: " + ANALYTICS_DIR)
            return

        # Iterate over YAML files in the analytics directory.
        for filename in os.listdir(ANALYTICS_DIR):
            if not filename.endswith(".yaml"):
                continue

            file_path = os.path.join(ANALYTICS_DIR, filename)
            try:
                with open(file_path, "r") as f:
                    analytic = yaml.safe_load(f)
            except Exception as e:
                self.error("Error loading file {}: {}".format(filename, e))
                continue

            # Filter on platform: support both "platform" and "platforms" keys.
            if self.platform:
                file_platforms = analytic.get("platform") or analytic.get("platforms")
                if file_platforms:
                    if isinstance(file_platforms, list):
                        if not any(self.platform.lower() == p.lower() for p in file_platforms):
                            continue
                    elif isinstance(file_platforms, str):
                        if file_platforms.lower() != self.platform.lower():
                            continue
                else:
                    continue

            # Filter on tactic: check direct "tactic" or inside a "coverage" list.
            if self.tactic:
                tactic_match = False
                file_tactic = analytic.get("tactic")
                if file_tactic:
                    if isinstance(file_tactic, list):
                        if any(self.tactic.lower() == t.lower() for t in file_tactic):
                            tactic_match = True
                    elif isinstance(file_tactic, str):
                        if file_tactic.lower() == self.tactic.lower():
                            tactic_match = True
                else:
                    coverage = analytic.get("coverage", [])
                    for cov in coverage:
                        tactics = cov.get("tactics")
                        if tactics:
                            if isinstance(tactics, list):
                                if any(self.tactic.lower() == t.lower() for t in tactics):
                                    tactic_match = True
                                    break
                            elif isinstance(tactics, str):
                                if self.tactic.lower() == tactics.lower():
                                    tactic_match = True
                                    break
                if not tactic_match:
                    continue

            # Yield an event with field variables (CSV headers will be generated automatically).
            # Here we yield only the fields we want (for example, filename, id, and title).
            event = {
                "filename": filename,
                "id": analytic.get("id", ""),
                "title": analytic.get("title", ""),
                "analytic": analytic
            }
            yield event

if __name__ == "__main__":
    dispatch(CarSearchCommand, sys.argv, sys.stdin, sys.stdout, __name__)