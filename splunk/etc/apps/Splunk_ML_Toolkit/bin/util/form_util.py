import json

import cexc


logger = cexc.get_logger(__name__)


def convert_form_args_to_dict(form_args, key_whitelist=None, json_keys=None):
    """Convert form args to a dictionary.

    Args:
        form_args (dict): a dictionary of the incoming form request
        key_whitelist (list): a list to use for checking key validity
        json_keys (list): a list of keys that are in a json string blob

    Returns:
        data (dict): the dictionary of processed form args
    """
    data = {}

    if key_whitelist is None:
        key_whitelist = []

    if json_keys is None:
        json_keys = []

    for key, value in form_args.items():
        # Load json keys
        if key in json_keys:
            _load_json_value(data, key, value)
        # Load whitelist keys
        elif key_whitelist:
            if key in key_whitelist:
                data[key] = value
        else:
            data[key] = value

    return data


def _load_json_value(data, key, value):
    """Take a dictionary and try to load json from a value into dict[key].

    Args:
        data (dict): dictionary of data we're updating
        key (str): key to use in dictionary
        value (str): presumably a json string

    Raises:
        ValueError when json is invalid
    """
    if value:
        try:
            data[key] = json.loads(value)
        except ValueError as err:
            logger.debug('json.loads(%s) : %s', value, err)
            raise ValueError('Could not decode JSON: {}'.format(value))
