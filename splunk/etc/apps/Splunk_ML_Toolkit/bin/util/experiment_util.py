import json

import cexc
from experiment.experiment_validation import experiment_history_valid_keys, json_keys
from util.constants import EXPERIMENT_MODEL_PREFIX, EXPERMENT_DRAFT_MODEL_PREFIX
from util.rest_url_util import make_splunk_url

logger = cexc.get_logger(__name__)


def get_experiment_draft_model_name(model_name):
    """
    generate a draft model name based on our format. insert a '_draft' after EXPERIMENT_MODEL_PREFIX ('_exp_' here)
    Args:
        model_name (str): model name

    Returns:
        an experiment draft version of model name
    """
    draft_position = model_name.index(EXPERIMENT_MODEL_PREFIX) + len(EXPERIMENT_MODEL_PREFIX)
    return (
        model_name[:draft_position] + EXPERMENT_DRAFT_MODEL_PREFIX + model_name[draft_position:]
    )


def expand_nested_json_strings(experiment):
    """
    Bring JSON structures that are have been serialized into strings back to life.

    Args:
        experiment (dict): experiment object whose schema with some non-primitive nested fields
                        (searchStages) as strings.

    Returns:
        experiment (dict): the same experiment object with the non-primitive nested fields turned into their
                        corresponding JSON structures.
    """
    for key in json_keys:
        val = experiment.get(key)
        if val:
            experiment[key] = json.loads(val)
    return experiment


def get_experiment_by_id(rest_proxy, exp_id):
    """
    Fetch experiment via a REST call using the experiment ID

    Args:
        rest_proxy (SplunkRestProxy): SplunkRestProxy object to make the REST request with
        exp_id (str): experiment ID

    Returns:
        experiment (dict): Fetched experiment object

    Raises:
        RuntimeError: if the returned REST response contains an error
    """
    url = make_splunk_url(rest_proxy, 'user', extra_url_parts=['mltk', 'experiments', exp_id])
    resp = rest_proxy.make_rest_call('GET', url)
    if resp['success']:
        return expand_nested_json_strings(json.loads(resp['content'])['entry'][0]['content'])
    else:
        logger.error(resp)
        raise RuntimeError("Failed to retrieve experiment with ID '{}'".format(exp_id))


def get_history_fields_from_experiment(experiment):
    """
    Extract experiment history fields from an experiment object

    Args:
        experiment (dict): an experiment object

    Returns:
        (dict): a new object with fields from the given experiment object that should also
                be written to experiment history
    """
    exp_hist_keys = experiment_history_valid_keys()
    return {k: v for k, v in experiment.items() if k in exp_hist_keys}
