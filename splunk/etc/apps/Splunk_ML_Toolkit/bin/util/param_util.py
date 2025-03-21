#!/usr/bin/env python
import json
import re
from ast import literal_eval

from .base_util import is_valid_identifier

# Global parameter-parsing regex (scoring and fitting)
params_re = re.compile(r"([_a-zA-Z][_a-zA-Z0-9]*)\s*=\s*(.*)")


def is_truthy(s):
    return str(s).lower() in ['1', 't', 'true', 'y', 'yes', 'enable', 'enabled']


def is_falsy(s):
    return str(s).lower() in ['0', 'f', 'false', 'n', 'no', 'disable', 'disabled']


def booly(s):
    if is_truthy(s):
        return True
    elif is_falsy(s):
        return False

    raise RuntimeError('Failed to convert "%s" to a boolean value' % str(s))


def unquote_arg(arg):
    if len(arg) > 0 and (arg[0] == "'" or arg[0] == '"') and arg[0] == arg[-1]:
        return arg[1:-1]
    return arg


def _comma_separated_to_list(arg):
    return arg.strip(',').split(',')


def convert_params(
    params,
    floats=None,
    ints=None,
    strs=None,
    bools=None,
    ranges=None,
    multiple_floats=None,
    aliases=None,
    ignore_extra=False,
):
    """Convert key-value pairs into their types & error accordingly."""

    def _assign_default(obj, is_array=True, is_dict=False):
        if obj is None:
            if is_array:
                return []
            if is_dict:
                return {}
            else:
                raise RuntimeError("Must enable is_array or is_dict")
        return obj

    floats = _assign_default(floats)
    ints = _assign_default(ints)
    strs = _assign_default(strs)
    bools = _assign_default(bools)
    ranges = _assign_default(ranges)
    multiple_floats = _assign_default(multiple_floats)
    aliases = _assign_default(aliases, is_array=False, is_dict=True)
    out_params = {}
    for p in params:
        op = aliases.get(p, p)
        if p in floats:
            try:
                out_params[op] = float(params[p])
            except:
                raise RuntimeError("Invalid value for %s: must be a float" % p)
        elif p in ints:
            try:
                out_params[op] = int(params[p])
            except:
                raise RuntimeError("Invalid value for %s: must be an int" % p)
        elif p in strs:
            out_params[op] = str(unquote_arg(params[p]))
            if len(out_params[op]) == 0:
                raise RuntimeError("Invalid value for %s: must be a non-empty string" % p)
        elif p in bools:
            try:
                out_params[op] = booly(params[p])
            except RuntimeError:
                raise RuntimeError("Invalid value for %s: must be a boolean" % p)
        elif p in ranges:
            try:
                out_params[op] = tuple(int(i) for i in params[p].split('-'))
                if len(out_params[op]) != 2:
                    raise RuntimeError
            except:
                raise RuntimeError("Invalid value for %s: must be a range e.g. %s=1-5" % (p, p))
        elif p in multiple_floats:
            param = params[p]
            try:
                out_params[op] = (float(param),)
            except:
                try:
                    out_params[op] = tuple(
                        float(i) for i in (str(unquote_arg(param))).split(',')
                    )
                except:
                    raise RuntimeError(
                        'Invalid value for {}: must have one or multiple float values e.g. {}="0.01,0.02,0.03".'.format(
                            p, p
                        )
                    )
        elif not ignore_extra:
            raise RuntimeError("Unexpected parameter: %s" % p)

    return out_params


def parse_namespace_model_name(model_name):
    namespace = 'user'
    is_onnx = False
    if ':' in model_name:
        try:
            values = model_name.split(':')
            if len(values) == 3:
                if values[1].lower() == 'onnx':
                    namespace, real_model_name, is_onnx = values[0], values[2], True
                else:
                    raise RuntimeError('You may only specify `onnx` keyword after namespace:')
            elif len(values) == 2:
                namespace, real_model_name = values[0], values[1]
                namespace = namespace.lower()
                # Handle scenario where namespace is read incorrectly as onnx
                if namespace == 'onnx':
                    is_onnx = True
                    namespace = 'user'
            else:
                raise RuntimeError()
        except Exception:
            raise RuntimeError(
                'Invalid model name: you may have at most one ":" separating your namespace and model name, e.g. '
                '"app:example_model_name"'
            )
    else:
        real_model_name = model_name
    namespace = namespace.lower()

    if not is_valid_identifier(real_model_name):
        raise RuntimeError('Invalid model name "%s"' % real_model_name)

    if namespace not in ['user', 'app']:
        raise RuntimeError('You may only specify namespace "app", "user" .')

    if is_onnx:
        real_model_name = f"{real_model_name}.onnx"

    return namespace, real_model_name


def parse_args(argv):
    options = {}

    from_seen = False

    while argv:
        arg = argv.pop(0)
        if arg.lower() == 'into':
            if 'model_name' in options:
                raise RuntimeError('Syntax error: you may specify "into" only once')

            try:
                raw_model_name = unquote_arg(argv.pop(0))
            except:
                raise RuntimeError('Syntax error: "into" keyword requires argument')
            options['namespace'], options['model_name'] = parse_namespace_model_name(
                raw_model_name
            )
            if len(options['model_name']) == 0 or len(options['namespace']) == 0:
                raise RuntimeError('Syntax error: "into" keyword requires argument')
        elif arg.lower() == 'by':
            if 'split_by' in options:
                raise RuntimeError('Syntax error: you may specify "by" only once')

            try:
                split_by = unquote_arg(argv.pop(0))
                assert len(split_by) > 0
            except:
                raise RuntimeError('Syntax error: "by" keyword requires argument')
            options['split_by'] = _comma_separated_to_list(split_by)
        elif arg.lower() == 'as':
            if 'output_name' in options:
                raise RuntimeError('Syntax error: you may specify "as" only once')

            try:
                options['output_name'] = unquote_arg(argv.pop(0))
                assert len(options['output_name']) > 0
            except:
                raise RuntimeError('Syntax error: "as" keyword requires argument')
        elif arg.lower() == 'from' or arg == "~":
            if from_seen:
                raise RuntimeError('Syntax error: you may specify "from" only once')

            options.setdefault('feature_variables', [])
            if len(options['feature_variables']) > 0:
                options['target_variable'] = options.pop('feature_variables')

            from_seen = True
        else:
            m = params_re.match(arg)
            if m:
                params = options.setdefault('params', {})
                params[m.group(1)] = m.group(2)
            else:
                arg = unquote_arg(arg)
                if len(arg) == 0:
                    continue
                args = options.setdefault('args', [])
                args.append(arg)

                variables = options.setdefault('feature_variables', [])
                assert isinstance(arg, str)
                variables.append(arg)

    return options


def parse_score_args(argv):
    options = {}
    against_seen = False

    while argv:
        arg = argv.pop(0)
        if arg.lower() == 'against' or arg == "~":
            # For two-array scoring methods, syntax is ..| score <scoring_method> a1 a2 .. AGAINST b1 b2 ..
            # For single-array methods, syntax is ..| score <scoring_method> a1 a2 ..
            if against_seen:
                raise RuntimeError('Syntax error: you may specify "against" only once.')

            options.setdefault('b_variables', [])
            if len(options['b_variables']) > 0:
                # All fields before "AGAINST" are a_variables, after are b_variables.
                options['a_variables'] = options.pop('b_variables')

            against_seen = True

        else:
            m = params_re.match(arg)
            if m:
                params = options.setdefault('params', {})
                params[m.group(1)] = m.group(2)
            else:
                arg = unquote_arg(arg)
                if len(arg) == 0:
                    continue
                args = options.setdefault('args', [])
                args.append(arg)

                # Append to 'b_variables' until 'against' is seen
                variables = options.setdefault('b_variables', [])
                assert isinstance(arg, str)
                variables.append(arg)

    if 'a_variables' not in options:
        # If "AGAINST" is not provided, set all fields to a_variables.
        options.setdefault('a_variables', options.pop('b_variables', []))

    # Set b_variables to be an empty list by default
    options.setdefault('b_variables', [])
    return options


def missing_keys_in_dict(keys, dct):
    """
    Return missing keys in the specified dict from the list of keys passed in

    Args:
        keys (list or tuple): list of keys (strings)
        dct (dict): a dict to check for the keys in

    Returns:
        (list): missing keys from the dict

    """
    return [key for key in keys if key not in dct]


def object_to_dict(obj):
    """
    Convert an object structure to a dict

    i.e. attributes -> dict keys

    Args:
        obj (object): Python object

    Returns:
        (dict): dict with all attributes converted to keys

    """
    return obj.__dict__


def unicode_to_str_in_dict(dct):
    """
    Convert keys and values of a dict that are unicode to str

    Args:
        dct (dict): dict whose keys and values may be of type unicode

    Returns:
        (dict): a new dict with the unicode keys and values converted to str
    """
    return literal_eval(json.dumps(dct))


def get_param_choice(params, param_name, value_choices, default_value):
    """
    Get the value of a parameter from a dict of parameter names and values.
    If the parameter name is None, return a default value. Otherwise, return its value
    from the dict. In addition, check that the value must belong to a given list. If not,
    raise a RuntimeError.

    Args:
        params (dict): the keys are the parameter names, and the values are parameter values
        param_name (str): name of the parameter of interest
        param_choice (list): the list of acceptable parameter values
        default_choice (str): default value to return in case param_name is None

    Returns:
        (str) value of parameter given by param_name
    """
    if param_name is None:
        return default_value
    param_val = params.get(param_name, default_value)
    if param_val not in value_choices:
        choices = ", ".join(value_choices)
        raise RuntimeError(f"Invalid value error: '{param_name}' must be one of {choices}")
    return param_val
