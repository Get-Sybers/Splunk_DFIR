#!/usr/bin/env python3
"""
Generate the Splunk data model for MITRE CAR from car_data_model.json.

Run from the repo root:

    ./dev-scripts/generate-car-datamodel.py

Writes splunk/etc/apps/MITRE_CAR_App/default/data/models/MITRE_CAR.json.

Why generate rather than hand-write: the model is 9 objects and 59 fields, and
a hand-typed copy drifts from MITRE's the moment either changes. This reads
car_data_model.json — the file this project already vendors from
https://github.com/mitre-attack/car — so the model provably matches it.

Each CAR object becomes a root event dataset constrained on a tag:

    car_process, car_file, car_flow, ...

Nothing is tagged by default. `eventtypes.conf` + `tags.conf` in the same app
attach those tags to the sourcetypes that can actually populate each object,
and props.conf maps their native field names onto the CAR field names. An
object with no tagged events returns nothing — which is the honest outcome for
a source this project cannot map yet.
"""

import json
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(REPO, "car_data_model.json")
OUT = os.path.join(
    REPO, "splunk/etc/apps/MITRE_CAR_App/default/data/models/MITRE_CAR.json"
)

# CAR types are not declared in car_data_model.json. Splunk needs one per field,
# and getting it wrong makes a field unusable in tstats, so they are pinned here
# rather than defaulted to string wholesale.
NUMERIC = {
    "pid", "ppid", "tid", "src_pid", "src_tid", "tgt_pid", "tgt_tid",
    "src_port", "dest_port", "packet_count",
}
TIMESTAMP = {"creation_time", "previous_creation_time", "start_time", "end_time"}


def field(name):
    if name in NUMERIC:
        ftype = "number"
    elif name in TIMESTAMP:
        ftype = "timestamp"
    else:
        ftype = "string"
    return {
        "fieldName": name,
        "owner": "BaseEvent",
        "type": ftype,
        "required": False,
        "multivalue": False,
        "hidden": False,
        "editable": True,
        "displayName": name,
        "comment": "",
    }


def main():
    if not os.path.exists(SRC):
        sys.exit(f"missing {SRC}")
    with open(SRC) as fh:
        car = json.load(fh)

    objects = []
    for obj in car["objects"]:
        name = obj["name"][0]
        tag = f"car_{name}"
        fields = sorted(set(obj.get("fields", [])))
        actions = obj.get("actions", [])

        datasets_fields = [field(f) for f in fields]
        # `action` is CAR's verb (create/delete/...). It is not in the object's
        # field list but every object has one, and it is what makes a search
        # like `process action=create` work.
        datasets_fields.insert(0, field("action"))

        objects.append({
            "objectName": tag,
            "displayName": f"{name} ({', '.join(actions)})" if actions else name,
            "parentName": "BaseEvent",
            "comment": (
                f"MITRE CAR '{name}' object. Actions: {', '.join(actions) or 'none'}. "
                f"Populated only for events tagged {tag} — see eventtypes.conf."
            ),
            "fields": datasets_fields,
            "calculations": [],
            "constraints": [{"search": f"tag={tag}", "owner": tag}],
            "lineage": tag,
        })

    model = {
        "modelName": "MITRE_CAR",
        "displayName": "MITRE CAR",
        "description": (
            "MITRE Cyber Analytics Repository data model, generated from "
            "car_data_model.json by dev-scripts/generate-car-datamodel.py. "
            "Do not edit by hand."
        ),
        "objectSummary": {
            "Event-Based": len(objects), "Transaction-Based": 0, "Search-Based": 0
        },
        "objects": objects,
    }

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w") as fh:
        json.dump(model, fh, indent=2)
        fh.write("\n")

    print(f"wrote {os.path.relpath(OUT, REPO)}")
    print(f"  {len(objects)} objects, "
          f"{sum(len(o['fields']) for o in objects)} field definitions")
    for o in objects:
        print(f"    {o['objectName']:18} {len(o['fields']):2} fields")


if __name__ == "__main__":
    main()
