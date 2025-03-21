#!/usr/bin/env python

import pandas as pd

from base_scoring import BaseScoring, SingleArrayScoringMixin
from util.param_util import convert_params
from util.scoring_util import (
    add_default_params,
    prepare_statistical_scoring_data,
    check_limits_param,
    check_fields_one_array,
)


class TVarScoring(SingleArrayScoringMixin, BaseScoring):
    """Implements scipy.stats.tvar"""

    @staticmethod
    def convert_param_types(params):
        # When user explicitly sets a limit to None, pop it since we expect floats and set default to None
        for p in ['upper_limit', 'lower_limit']:
            if params.get(p, '').lower() == 'none':
                params.pop(p)

        converted_params = convert_params(
            params, ints=['ddof'], floats=['lower_limit', 'upper_limit']
        )
        converted_params = add_default_params(
            converted_params, {'lower_limit': None, 'upper_limit': None, 'ddof': 1}
        )
        return check_limits_param(converted_params)

    def prepare_and_check_data(self, df, fields):
        fields = check_fields_one_array(fields, self.scoring_name)
        prepared_df, _ = prepare_statistical_scoring_data(df, fields)
        _meta_params = {}
        return prepared_df, _meta_params

    def create_output(self, scoring_name, result, _meta_params=None):
        """Result is a float."""
        idx = [''] * result.shape[0] if result.shape else ['']
        return pd.DataFrame(result, columns=['trimmed-variance'], index=idx)
