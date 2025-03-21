#!/usr/bin/env python

import numpy as np
import pandas as pd

from base_scoring import BaseScoring, TSAStatsToolsMixin
from util.param_util import convert_params
from util.scoring_util import (
    add_default_params,
    prepare_statistical_scoring_data,
    validate_param_from_str_list,
    update_with_hypothesis_decision,
    check_alpha_param,
    check_fields_single_field_one_array,
)


class KPSSScoring(TSAStatsToolsMixin, BaseScoring):
    """Implements statsmodels.tsa.stattools.kpss"""

    @staticmethod
    def convert_param_types(params):
        converted_params = convert_params(
            params, strs=['regression'], ints=['nlags'], floats=['alpha']
        )
        converted_params = add_default_params(
            converted_params, {'regression': 'c', 'alpha': 0.05}
        )
        converted_params = validate_param_from_str_list(
            converted_params, 'regression', ['c', 'ct']
        )
        check_alpha_param(converted_params['alpha'])
        return converted_params

    def prepare_and_check_data(self, df, fields):
        fields = check_fields_single_field_one_array(fields, self.scoring_name)
        a_array, b_array = prepare_statistical_scoring_data(df, a_fields=fields, b_fields=None)
        # Set the default lags param
        maxlag = self.params.setdefault(
            'nlags', int(np.ceil(12.0 * np.power(len(a_array) / 100.0, 1 / 4.0)))
        )
        if maxlag >= len(a_array):
            raise RuntimeError(
                'Value error: parameter "nlags" must be less than the number of samples.'
            )

        # pop 'alpha' from params into _meta_params
        _meta_params = {'alpha': self.params.pop('alpha')}
        return a_array, _meta_params

    def create_output(self, scoring_name, result, _meta_params=None):
        """Result is a tuple."""
        dict_results = {
            'statistic': result[0],
            'p-value': result[1],
            'lags': result[2],
            'critical values (1%)': result[3]['1%'],
            'critical values (2.5%)': result[3]['2.5%'],
            'critical values (5%)': result[3]['5%'],
            'critical values (10%)': result[3]['10%'],
        }

        # Annotate decision on whether to accept/reject null hypothesis
        null_hypothesis = 'the field is level or trend stationary.'
        dict_results = update_with_hypothesis_decision(
            dict_results, _meta_params['alpha'], null_hypothesis
        )
        output_df = pd.DataFrame(dict_results, index=[''])
        return output_df
