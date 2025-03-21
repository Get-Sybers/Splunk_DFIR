#!/usr/bin/env python

import pandas as pd

from base_scoring import BaseScoring, DoubleArrayScoringMixin
from util.param_util import convert_params
from util.scoring_util import (
    add_default_params,
    prepare_statistical_scoring_data,
    get_and_check_fields_two_2d_arrays,
    get_field_identifiers,
    update_with_hypothesis_decision,
    check_alpha_param,
)


class TTestTwoIndSampleScoring(DoubleArrayScoringMixin, BaseScoring):
    """Implements scipy.stats.ttest_ind"""

    @staticmethod
    def convert_param_types(params):
        converted_params = convert_params(params, bools=['equal_var'], floats=['alpha'])
        converted_params = add_default_params(
            converted_params, {'equal_var': True, 'alpha': 0.05}
        )
        check_alpha_param(converted_params['alpha'])
        return converted_params

    def prepare_and_check_data(self, df):
        self.a_fields, self.b_fields = get_and_check_fields_two_2d_arrays(
            df, self.a_fields, self.b_fields, self.scoring_name
        )
        a_array, b_array = prepare_statistical_scoring_data(df, self.a_fields, self.b_fields)
        # pop 'alpha' from params into _meta_params and add the field identifier
        _meta_params = {
            'field_identifiers': get_field_identifiers(a_array, "A_field", b_array, "B_field"),
            'alpha': self.params.pop('alpha'),
        }
        return a_array, b_array, _meta_params

    def create_output(self, scoring_name, result, _meta_params=None):
        """Result is a scipy 'Ttest_ind' object."""
        dict_results = {'statistic': result.statistic, 'p-value': result.pvalue}
        # Update dict_results with field identifiers
        dict_results.update(_meta_params['field_identifiers'])
        # Annotate decision on whether to accept/reject null hypothesis
        null_hypothesis = 'the independent samples have identical average (expected) values.'
        dict_results = update_with_hypothesis_decision(
            dict_results, _meta_params['alpha'], null_hypothesis
        )
        output_df = pd.DataFrame(dict_results)
        return output_df
