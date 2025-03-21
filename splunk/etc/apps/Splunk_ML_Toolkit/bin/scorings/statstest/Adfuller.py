#!/usr/bin/env python

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


class AdfullerScoring(TSAStatsToolsMixin, BaseScoring):
    """Implements statsmodels.tsa.stattools.adfuller"""

    @staticmethod
    def convert_param_types(params):
        converted_params = convert_params(
            params, strs=['autolag', 'regression'], ints=['maxlag'], floats=['alpha']
        )
        converted_params = add_default_params(
            converted_params, {'autolag': 'AIC', 'regression': 'c', 'alpha': 0.05}
        )
        converted_params = validate_param_from_str_list(
            converted_params, 'autolag', ['aic', 'bic', 't-stat', 'none']
        )
        converted_params = validate_param_from_str_list(
            converted_params, 'regression', ['c', 'ct', 'ctt', 'nc']
        )
        check_alpha_param(converted_params['alpha'])
        return converted_params

    def prepare_and_check_data(self, df, fields):
        fields = check_fields_single_field_one_array(fields, self.scoring_name)
        a_array, b_array = prepare_statistical_scoring_data(df, a_fields=fields, b_fields=None)
        # Set the default maxlag param
        maxlag = self.params.setdefault('maxlag', 10)
        if maxlag >= len(a_array):
            raise RuntimeError(
                'Value error: parameter "maxlag" must be less than the number of samples.'
            )

        # pop 'alpha' from params into _meta_params
        _meta_params = {'alpha': self.params.pop('alpha')}
        return a_array, _meta_params

    def score(self, df, options):
        # Get preprocessed df and and meta-params for creating output
        preprocessed_df, _meta_params = self.prepare_and_check_data(df, self.variables)
        try:
            result = self.scoring_function(preprocessed_df.values.reshape(-1), **self.params)
        except Exception:
            # Known bug when maxlag is close to sample size and autolag=t-stat
            # Perhaps other uncaught exceptions with adfuller method
            raise RuntimeError(
                "Cannot compute 'adfuller' on sample. Try increasing the number of samples, reducing "
                "the 'maxlag' parameter or modifying the value of autolag."
            )

        # Create output with meta-params
        df_output = self.create_output(self.scoring_name, result, _meta_params)
        return df_output

    def create_output(self, scoring_name, result, _meta_params=None):
        """Result is a tuple."""
        dict_results = {
            'statistic': result[0],
            'p-value': result[1],
            'usedlag': result[2],
            'nobs': result[3],
            'critical values (1%)': result[4]['1%'],
            'critical values (5%)': result[4]['5%'],
            'critical values (10%)': result[4]['10%'],
        }
        if self.params['autolag'] is not None:
            dict_results['icbest'] = result[
                5
            ]  # icbest is only available if autolag is not None

        # Annotate decision on whether to accept/reject null hypothesis
        null_hypothesis = 'there is a unit root.'
        dict_results = update_with_hypothesis_decision(
            dict_results, _meta_params['alpha'], null_hypothesis
        )
        output_df = pd.DataFrame(dict_results, index=[''])
        return output_df
