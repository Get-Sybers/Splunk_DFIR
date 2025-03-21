import os

from util.validation_util import validate_json, valid_keys
from util.form_util import convert_form_args_to_dict

json_keys = ['searchStages']


def _full_path(filename):
    return os.path.join(os.path.dirname(__file__), filename)


def experiment_history_schema_file():
    return _full_path("experiment_history_schema.json")


def validate_experiment_form_args(form_args, experiment_schema_file=None):
    if experiment_schema_file is None:
        experiment_schema_file = _full_path("experiment_schema.json")
    form_dict = convert_form_args_to_dict(
        form_args, valid_keys(experiment_schema_file), json_keys
    )
    validate_json(form_dict, schema_file=experiment_schema_file)


def validate_experiment_history_json(json_data):
    validate_json(json_data, schema_file=experiment_history_schema_file())


def experiment_history_valid_keys():
    return valid_keys(experiment_history_schema_file())
