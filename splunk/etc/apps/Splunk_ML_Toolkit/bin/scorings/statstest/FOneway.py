#!/usr/bin/env python

import pandas as pd

from base_scoring import BaseScoring, SingleArrayScoringMixin
from util.param_util import convert_params
from util.scoring_util import (
    add_default_params,
    prepare_statistical_scoring_data,
    update_with_hypothesis_decision,
    check_alpha_param,
    remove_duplicate_fields_and_warn,
)


class FOnewayScoring(SingleArrayScoringMixin, BaseScoring):
    """Implements scipy.stats.f_oneway"""

    @staticmethod
    def convert_param_types(params):
        converted_params = convert_params(params, floats=['alpha'])
        converted_params = add_default_params(converted_params, {'alpha': 0.05})
        check_alpha_param(converted_params['alpha'])
        return converted_params

    def prepare_and_check_data(self, df, fields):
        fields = remove_duplicate_fields_and_warn(fields)
        if len(fields) < 2:
            raise RuntimeError(
                'Value error: need 2 or more unique fields to perform a one-way ANOVA. '
                'Please specify fields as: ..| score f_oneway <field_1> <field_2> ... <field_n>.'
            )
        prepared_df, _ = prepare_statistical_scoring_data(df, fields)
        # pop 'alpha' from params into _meta_params
        _meta_params = {'alpha': self.params.pop('alpha')}
        if len(prepared_df) < 2:
            raise RuntimeError('Value error: need at least 2 samples to score on.')
        return prepared_df, _meta_params

    def score(self, df, options):
        """f_oneway requires a sequence of 1d array inputs."""
        # Get preprocessed df and and meta-params for creating output
        preprocessed_df, _meta_params = self.prepare_and_check_data(df, self.variables)
        result = self.scoring_function(*preprocessed_df.values.T)  # No arguments taken
        # Create output with meta-params
        df_output = self.create_output(self.scoring_name, result, _meta_params)
        return df_output

    def create_output(self, scoring_name, result, _meta_params=None):
        """Result is a scipy 'f_oneway' object."""
        dict_results = {'statistic': result.statistic, 'p-value': result.pvalue}
        # Annotate decision on whether to accept/reject null hypothesis
        null_hypothesis = 'the provided groups have the same population mean.'
        dict_results = update_with_hypothesis_decision(
            dict_results, _meta_params['alpha'], null_hypothesis
        )
        output_df = pd.DataFrame(dict_results, index=[''])
        return output_df
