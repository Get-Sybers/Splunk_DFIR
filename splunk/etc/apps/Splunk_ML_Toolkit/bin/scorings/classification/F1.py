#!/usr/bin/env python

from base_scoring import BaseScoring, ClassificationScoringMixin
from util.param_util import convert_params
from util.scoring_util import (
    check_pos_label_and_average_against_data,
    initial_check_pos_label_and_average,
    add_default_params,
)


class F1Scoring(ClassificationScoringMixin, BaseScoring):
    """Implements sklearn.metrics.f1_score"""

    @staticmethod
    def convert_param_types(params):
        out_params = convert_params(params, strs=['average', 'pos_label'])
        out_params = add_default_params(out_params, {'average': 'binary'})
        out_params = initial_check_pos_label_and_average(out_params)
        # class_variable_headers is True when average=None
        _meta_params = {'class_variable_headers': True} if out_params['average'] is None else {}
        out_params = add_default_params(
            out_params, {'pos_label': '1'}
        )  # add positive label after checking average
        return out_params, _meta_params

    def check_params_with_data(self, actual_df, predicted_df):
        check_pos_label_and_average_against_data(actual_df, predicted_df, self.params)
