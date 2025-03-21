#!/usr/bin/env python

import pandas as pd

from base_scoring import BaseScoring, SingleArrayScoringMixin
from util.param_util import convert_params
from util.scoring_util import (
    load_scoring_function,
    add_default_params,
    prepare_statistical_scoring_data,
    warn_order_not_preserved,
    check_fields_one_array,
)


class TrimScoring(SingleArrayScoringMixin, BaseScoring):
    """Implements either scipy.stats.trim1 or scipy.stats.trimboth."""

    @staticmethod
    def load_scoring_function_with_options(options):
        """Decide whether to load trim1 or trimboth based on options.

        When parameter 'tail' is 'both', load 'trimboth'. Otherwise,
        load 'trim1'.
        """
        tail = options.get('params', {}).get('tail', 'both')  # default is 'both'
        if tail not in ['left', 'right', 'both']:
            msg = 'Value error: parameter "tail" must be one of: "left", "right" or "both". Found tail="{}".'
            raise RuntimeError(msg.format(tail))

        scoring_function_name = 'trimboth' if tail == 'both' else 'trim1'
        scoring_function = load_scoring_function('scipy.stats', scoring_function_name)
        return scoring_function

    @staticmethod
    def convert_param_types(params):
        converted_params = convert_params(params, strs=['tail'], floats=['proportiontocut'])
        converted_params = add_default_params(
            converted_params, {'tail': 'both', 'proportiontocut': 0}
        )
        warn_order_not_preserved()
        if converted_params['tail'] == 'both':
            converted_params.pop(
                'tail'
            )  # Remove 'tail' parameter since scipy's 'trimboth' doesn't accept it.
        if not 0 <= converted_params['proportiontocut'] <= 1:
            msg = 'Value error: parameter "proportiontocut" must be between 0 and 1, but found proportiontocut="{}".'
            raise RuntimeError(msg.format(converted_params['proportiontocut']))
        return converted_params

    def prepare_and_check_data(self, df, fields):
        fields = check_fields_one_array(fields, self.scoring_name)
        prepared_df, _ = prepare_statistical_scoring_data(df, fields)
        _meta_params = {
            'field_identifiers': ['trimmed({})'.format(i) for i in list(prepared_df.columns)]
        }
        return prepared_df, _meta_params

    def create_output(self, scoring_name, result, _meta_params=None):
        """Result is a numpy array."""
        output_df = pd.DataFrame(result, columns=_meta_params['field_identifiers'])
        return output_df
