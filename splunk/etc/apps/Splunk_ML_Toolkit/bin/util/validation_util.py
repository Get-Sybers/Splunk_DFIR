import json
import os
from urllib.request import pathname2url

from vendor.jsonschema import Draft4Validator, RefResolver, SchemaError, ValidationError
from vendor.jsonschema import validate


def schema_file_to_dict(schema_file):
    with open(schema_file) as f:
        return json.load(f)


def validate_json(json_data, schema_file):
    schema = schema_file_to_dict(schema_file)
    schema_dir = os.path.dirname(schema_file)
    schema_path = 'file://{0}/'.format(pathname2url(schema_dir))

    resolver = RefResolver(schema_path, schema)

    try:
        Draft4Validator.check_schema(schema)
        validate(json_data, schema, resolver=resolver)
    except SchemaError as e:
        raise RuntimeError("Failed to check JSON schema in {}: {}".format(schema_file, str(e)))
    except ValidationError as e:
        raise RuntimeError(
            "Unable to validate data against json schema in {}: {}, {}, {}, {}, {}".format(
                schema_file, str(e), e.context, list(e.path), list(e.schema_path), e.cause
            )
        )


def valid_keys(schema_file):
    schema = schema_file_to_dict(schema_file)
    return list(schema['properties'].keys())
