#!/usr/bin/env python

import pandas as pd

from base_scoring import BaseScoring, DoubleArrayScoringMixin
from util.param_util import convert_params
from util.scoring_util import (
    add_default_params,
    prepare_statistical_scoring_data,
    get_and_check_fields_two_1d_arrays,
    warn_on_num_samples,
    check_alternative_param,
    warn_on_same_fields,
    update_with_hypothesis_decision,
    check_alpha_param,
)


class MannWhitneyUScoring(DoubleArrayScoringMixin, BaseScoring):
    """Implements scipy.stats.mannwhitneyu"""

    def handle_options(self, options):
        """Mannwhitneyu requires each array to be made of exactly 1 field."""
        params = options.get('params', {})
        params = self.convert_param_types(params)
        a_fields, b_fields = get_and_check_fields_two_1d_arrays(options, self.scoring_name)
        return params, a_fields, b_fields

    @staticmethod
    def convert_param_types(params):
        converted_params = convert_params(
            params, strs=['alternative'], bools=['use_continuity'], floats=['alpha']
        )
        converted_params = add_default_params(
            converted_params,
            {'alternative': 'two-sided', 'use_continuity': True, 'alpha': 0.05},
        )
        converted_params = check_alternative_param(converted_params)
        check_alpha_param(converted_params['alpha'])
        return converted_params

    def prepare_and_check_data(self, df):
        a_array, b_array = prepare_statistical_scoring_data(df, self.a_fields, self.b_fields)
        # Warn if the same field is being compared and if number of samples is low
        warn_on_same_fields(list(a_array.columns), list(b_array.columns))
        warn_on_num_samples(a_array, 20)  # normal approximation
        # pop 'alpha' from params into _meta_params
        _meta_params = {'alpha': self.params.pop('alpha')}
        return a_array, b_array, _meta_params

    def create_output(self, scoring_name, result, _meta_params=None):
        """Result is a scipy 'Mannwhitneyu' object."""
        dict_results = {'statistic': result.statistic, 'p-value': result.pvalue}
        # Annotate decision on whether to accept/reject null hypothesis
        null_hypothesis = (
            'it is equally likely that a randomly selected value from the first sample will be less '
            'than or greater than a randomly selected value from the second sample'
        )
        dict_results = update_with_hypothesis_decision(
            dict_results, _meta_params['alpha'], null_hypothesis
        )
        output_df = pd.DataFrame(dict_results, index=[''])
        return output_df
