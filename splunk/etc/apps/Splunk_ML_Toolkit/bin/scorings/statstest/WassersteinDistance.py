#!/usr/bin/env python

import pandas as pd

from base_scoring import BaseScoring, DoubleArrayScoringMixin
from util.param_util import convert_params
from util.scoring_util import (
    prepare_statistical_scoring_data,
    get_and_check_fields_two_1d_arrays,
    warn_on_same_fields,
)


class WassersteinDistanceScoring(DoubleArrayScoringMixin, BaseScoring):
    """Implements scipy.stats.wasserstein_distance"""

    def handle_options(self, options):
        """wasserstein_distance requires each array to be made of exactly 1 field."""
        params = options.get('params', {})
        params = WassersteinDistanceScoring.convert_param_types(params)
        a_fields, b_fields = get_and_check_fields_two_1d_arrays(options, self.scoring_name)
        return params, a_fields, b_fields

    @staticmethod
    def convert_param_types(params):
        converted_params = convert_params(params)
        return converted_params

    def prepare_and_check_data(self, df):
        a_array, b_array = prepare_statistical_scoring_data(df, self.a_fields, self.b_fields)
        # Warn if the same field is being compared
        warn_on_same_fields(list(a_array.columns), list(b_array.columns))
        _meta_params = {}
        return a_array, b_array, _meta_params

    @staticmethod
    def create_output(scoring_name, result, _meta_params=None):
        """Create output dataframe.

        Args:
            scoring_name (str): name of scoring method
            result (scipy object, float, np.array): contains
                the result of the scipy scoring function
            _meta_params (dict): Additional parameters used to create output

        Returns:
            df_output (pd.DataFrame): output dataframe.
        """
        df_output = pd.DataFrame({scoring_name: result}, index=[''])
        return df_output
