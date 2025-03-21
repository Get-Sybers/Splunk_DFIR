#!/usr/bin/env python

import pandas as pd

from base_scoring import BaseScoring, SingleArrayScoringMixin
from util.param_util import convert_params
from util.scoring_util import (
    add_default_params,
    prepare_statistical_scoring_data,
    get_field_identifiers,
    update_with_hypothesis_decision,
    check_alpha_param,
    check_fields_one_array,
)


class NormalTestScoring(SingleArrayScoringMixin, BaseScoring):
    """Implements scipy.stats.normaltest"""

    @staticmethod
    def convert_param_types(params):
        converted_params = convert_params(params, floats=['alpha'])
        converted_params = add_default_params(converted_params, {'alpha': 0.05})
        check_alpha_param(converted_params['alpha'])
        return converted_params

    def prepare_and_check_data(self, df, fields):
        fields = check_fields_one_array(fields, self.scoring_name)
        prepared_df, _ = prepare_statistical_scoring_data(df, fields)
        # pop 'alpha' from params into _meta_params and add the field identifier
        _meta_params = {
            'field_identifiers': get_field_identifiers(prepared_df, "Field"),
            'alpha': self.params.pop('alpha'),
        }
        return prepared_df, _meta_params

    def create_output(self, scoring_name, result, _meta_params=None):
        """Result is a scipy 'normaltest' object."""
        dict_results = {'statistic': result.statistic, 'p-value': result.pvalue}
        # Update dict_results with field identifiers
        dict_results.update(_meta_params['field_identifiers'])
        # Annotate decision on whether to accept/reject null hypothesis
        null_hypothesis = 'the sample comes from a normal distribution.'
        dict_results = update_with_hypothesis_decision(
            dict_results, _meta_params['alpha'], null_hypothesis
        )
        output_df = pd.DataFrame(dict_results)
        return output_df
