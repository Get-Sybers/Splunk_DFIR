#!/usr/bin/env python
# -*- coding: utf-8 -*-
import sys
import os
import time
import json

# Strictly handle the getinfo probe
if "--getinfo" in sys.argv:
    info = {
        "version": "1.0",
        "build": "1.0",
        "display": {
            "title": "Car Search Command",
            "description": "Searches MITRE CAR analytics YAML files."
        },
        "searchmode": "oneshot"
    }
    sys.stdout.write(json.dumps(info))
    sys.stdout.flush()
    sys.exit(0)

try:
    from splunklib.searchcommands import dispatch, GeneratingCommand, Configuration, Option
except ModuleNotFoundError:
    sys.stderr.write("[!] This script is meant to be run by Splunk, not directly.\n")
    sys.exit(1)

# Locate app root and analytics directory
APP_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
ANALYTICS_DIR = os.path.join(APP_ROOT, 'analytics')

# Add vendored PyYAML to path
sys.path.insert(0, os.path.dirname(__file__))
import yaml

@Configuration()
class CarSearchCommand(GeneratingCommand):
    platform = Option(require=False)
    tactic = Option(require=False)

    def generate(self):
        if not os.path.exists(ANALYTICS_DIR):
            self.error("Analytics directory not found: {}".format(ANALYTICS_DIR))
            return

        for filename in os.listdir(ANALYTICS_DIR):
            if not filename.endswith(".yaml"):
                continue
            path = os.path.join(ANALYTICS_DIR, filename)
            try:
                with open(path, "r") as f:
                    analytic = yaml.safe_load(f)
            except Exception as e:
                self.error("Error loading file {}: {}".format(filename, e))
                continue

            if self.platform:
                file_platforms = analytic.get('platform') or analytic.get('platforms')
                if file_platforms:
                    if isinstance(file_platforms, list):
                        if not any(self.platform.lower() == p.lower() for p in file_platforms):
                            continue
                    elif isinstance(file_platforms, str):
                        if file_platforms.lower() != self.platform.lower():
                            continue
                else:
                    continue

            if self.tactic:
                tactic_match = False
                file_tactic = analytic.get('tactic')
                if file_tactic:
                    if isinstance(file_tactic, list):
                        if any(self.tactic.lower() == t.lower() for t in file_tactic):
                            tactic_match = True
                    elif isinstance(file_tactic, str):
                        if file_tactic.lower() == self.tactic.lower():
                            tactic_match = True
                else:
                    coverage = analytic.get('coverage', [])
                    for cov in coverage:
                        tactics_list = cov.get('tactics')
                        if tactics_list:
                            if isinstance(tactics_list, list):
                                if any(self.tactic.lower() == t.lower() for t in tactics_list):
                                    tactic_match = True
                                    break
                            elif isinstance(tactics_list, str):
                                if self.tactic.lower() == tactics_list.lower():
                                    tactic_match = True
                                    break
                if not tactic_match:
                    continue

            event = {
                "filename": filename,
                "analytic": analytic,
                "_time": time.time()
            }
            yield event

if __name__ == '__main__':
    dispatch(CarSearchCommand, sys.argv, sys.stdin, sys.stdout, __name__)