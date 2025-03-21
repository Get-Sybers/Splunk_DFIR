#!/usr/bin/env python

import pandas as pd

from base_scoring import BaseScoring, ROCMixin
from util.param_util import convert_params
from util.scoring_util import get_and_check_fields_two_1d_arrays


class ROCCurveScoring(ROCMixin, BaseScoring):
    """Implements sklearn.metrics.roc_curve"""

    def handle_options(self, options):
        """Only single-field against single-field comparisons supported."""
        params = options.get('params', {})
        params, _meta_params = self.convert_param_types(params)
        actual_fields, predicted_fields = get_and_check_fields_two_1d_arrays(
            options,
            self.scoring_name,
            a_field_alias='actual_field',
            b_field_alias='predicted_field',
        )
        return params, actual_fields, predicted_fields, _meta_params

    @staticmethod
    def convert_param_types(params):
        out_params = convert_params(params, strs=['pos_label'], bools=['drop_intermediate'])
        _meta_params = {'pos_label': out_params.pop('pos_label', '1')}
        return out_params, _meta_params

    def create_output(self, scoring_name, result):
        """Outputs false-positive rate, true-positive rate and thresholds.

        - Note that roc_curve only works on a pair of 1d columns,
            and so 'result' contains exactly 1 element
        """
        fpr, tpr, thresholds = result[0]
        return pd.DataFrame({'fpr': fpr, 'tpr': tpr, 'thresholds': thresholds})
