#!/usr/bin/env python

import pandas as pd

from base_scoring import BaseScoring, DoubleArrayScoringMixin
from util.param_util import convert_params
from util.scoring_util import (
    add_default_params,
    prepare_statistical_scoring_data,
    get_and_check_fields_two_1d_arrays,
    warn_on_num_samples,
    check_zero_method_param,
    warn_on_same_fields,
    update_with_hypothesis_decision,
    check_alpha_param,
)


class WilcoxonScoring(DoubleArrayScoringMixin, BaseScoring):
    """Implements scipy.stats.wilcoxon"""

    def handle_options(self, options):
        """Wilcoxon requires each array to be made of exactly 1 field."""
        params = options.get('params', {})
        params = self.convert_param_types(params)
        a_fields, b_fields = get_and_check_fields_two_1d_arrays(options, self.scoring_name)
        if 'zero_method' in params:
            WilcoxonScoring._check_equal_fields_for_zero_method(
                params['zero_method'], a_fields, b_fields
            )
        return params, a_fields, b_fields

    @staticmethod
    def _check_equal_fields_for_zero_method(zero_method, a_fields, b_fields):
        if (
            (zero_method == "wilcox" or zero_method == "pratt")
            and a_fields == b_fields
            and a_fields[0] != '*'
        ):
            raise RuntimeError(
                'The two vectors can not be equal when zero_method is "wilcox" or "pratt"'
            )

    @staticmethod
    def convert_param_types(params):
        converted_params = convert_params(
            params, strs=['zero_method'], bools=['correction'], floats=['alpha']
        )
        converted_params = add_default_params(
            converted_params, {'zero_method': 'wilcox', 'correction': False, 'alpha': 0.05}
        )
        converted_params = check_zero_method_param(converted_params)
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
        """Result is scipy.stats 'Wilcoxon' object."""
        dict_results = {'statistic': result.statistic, 'p-value': result.pvalue}
        # Annotate decision on whether to accept/reject null hypothesis
        null_hypothesis = 'the related paired samples come from the same distribution.'
        dict_results = update_with_hypothesis_decision(
            dict_results, _meta_params['alpha'], null_hypothesis
        )
        output_df = pd.DataFrame(dict_results, index=[''])
        return output_df
