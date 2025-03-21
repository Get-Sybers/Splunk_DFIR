#!/usr/bin/env python

import pandas as pd

from base_scoring import BaseScoring, DoubleArrayScoringMixin
from util.param_util import convert_params
from util.scoring_util import (
    prepare_statistical_scoring_data,
    get_and_check_fields_two_1d_arrays,
    warn_on_same_fields,
)


class PearsonrScoring(DoubleArrayScoringMixin, BaseScoring):
    """Implements scipy.stats.pearsonr"""

    def handle_options(self, options):
        """Pearsonr requires each array to be made of exactly 1 field."""
        params = options.get('params', {})
        params = self.convert_param_types(params)
        a_fields, b_fields = get_and_check_fields_two_1d_arrays(options, self.scoring_name)
        return params, a_fields, b_fields

    @staticmethod
    def convert_param_types(params):
        converted_params = convert_params(params)
        return converted_params

    def prepare_and_check_data(self, df):
        a_array, b_array = prepare_statistical_scoring_data(df, self.a_fields, self.b_fields)
        warn_on_same_fields(list(a_array.columns), list(b_array.columns))
        _meta_params = {}
        return a_array, b_array, _meta_params

    @staticmethod
    def create_output(scoring_name, result, _meta_params=None):
        """Result is a tuple."""
        dict_results = {'r': result[0], 'two-tailed p-value': result[1]}
        output_df = pd.DataFrame(dict_results, index=[''])
        return output_df
