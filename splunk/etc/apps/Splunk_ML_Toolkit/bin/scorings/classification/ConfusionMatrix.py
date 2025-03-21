#!/usr/bin/env python

import pandas as pd

from base_scoring import BaseScoring, ClassificationScoringMixin
from util.param_util import convert_params
from util.scoring_util import get_and_check_fields_two_1d_arrays


class ConfusionMatrixScoring(ClassificationScoringMixin, BaseScoring):
    """Implements sklearn.metrics.confusion_matrix"""

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
        out_params = convert_params(params)
        _meta_params = {
            'class_variable_headers': True
        }  # Confusion matrix populates rows & cols with class-variables
        return out_params, _meta_params

    def score(self, df, options):
        """Confusion matrix requires arrays to be reshaped."""
        # Prepare ground-truth and predicted labels
        actual_array, predicted_array = self.prepare_input_data(
            df, options.get('mlspl_limits', {})
        )
        # Get the scoring result
        result = self.scoring_function(actual_array, predicted_array)
        # Create the output df
        df_output = self.create_output(self.scoring_name, result)
        return df_output

    def create_output(self, scoring_name, result):
        """Output dataframe differs from parent.

        The indices of confusion matrix columns/rows should correspond.
        Columns represent predicted results, rows represent ground-truth.
        """
        class_variables = self.params['labels']  # labels = union of predicted & actual classes
        # Predicted (column) and ground-truth (row) labels
        col_labels = ['Label'] + ['predicted({})'.format(i) for i in class_variables]
        row_labels = pd.DataFrame(['actual({})'.format(i) for i in class_variables])
        # Create output df
        result_df = pd.DataFrame(result)
        output_df = pd.concat((row_labels, result_df), axis=1)
        output_df.columns = col_labels
        return output_df
