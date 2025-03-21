##  Corrected Query: Extract All Fields in log2timeline
    index=host sourcetype=log2timeline_json
    | fieldsummary
    | table field

## Identify Fields That Exist in Every Event (Root Fields)
    index=host sourcetype=log2timeline_json
    | stats values(field) AS fields BY parser


## Build a Hierarchical Data Model
**python**
    import json

    # Load all fields extracted from Splunk
    with open("all_fields.txt", "r") as f:
        all_fields = [line.strip() for line in f.readlines()]

    # Load parser-specific fields extracted from Splunk
    with open("parser_fields.json", "r") as f:
        parser_fields = json.load(f)

    # Initialize the Splunk Data Model
    splunk_data_model = {
        "modelName": "Log2Timeline_DM",
        "displayName": "Log2Timeline Data Model",
        "description": "Hierarchical Data Model for log2timeline",
        "version": 1,
        "objects": []
    }

    # Add Root Dataset (log2timeline)
    root_object = {
        "objectName": "log2timeline",
        "displayName": "Log2Timeline",
        "fields": [{"fieldName": field, "type": "string"} for field in all_fields]
    }
    splunk_data_model["objects"].append(root_object)

    # Add Child Datasets for Parsers
    for parser, fields in parser_fields.items():
        child_object = {
            "objectName": parser,
            "displayName": parser.capitalize(),
            "parentName": "log2timeline",
            "fields": [{"fieldName": field, "type": "string"} for field in fields]
        }
        splunk_data_model["objects"].append(child_object)

    # Save JSON
    data_model_file = "/mnt/data/fieldsummary_data_model.json"
    with open(data_model_file, "w") as file:
        json.dump(splunk_data_model, file, indent=4)

    # Return file path
    data_model_file