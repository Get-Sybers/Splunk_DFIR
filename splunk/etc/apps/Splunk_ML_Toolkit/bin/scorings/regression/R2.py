#!/usr/bin/env python

from base_scoring import BaseScoring, RegressionScoringMixin
from util.param_util import convert_params
from util.scoring_util import add_default_params, validate_param_from_str_list


class R2Scoring(RegressionScoringMixin, BaseScoring):
    """Implements sklearn.metrics.r2_score"""

    @staticmethod
    def convert_param_types(params):
        converted_params = convert_params(params, strs=['multioutput'])
        valid_multioutput_vals = ['raw_values', 'uniform_average', 'variance_weighted', 'none']
        converted_params = add_default_params(converted_params, {'multioutput': 'raw_values'})
        converted_params = validate_param_from_str_list(
            converted_params, 'multioutput', valid_multioutput_vals
        )
        return converted_params
