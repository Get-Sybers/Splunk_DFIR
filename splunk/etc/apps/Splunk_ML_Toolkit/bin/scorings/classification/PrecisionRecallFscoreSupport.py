#!/usr/bin/env python

import pandas as pd
import numpy as np

import cexc
from base_scoring import BaseScoring, ClassificationScoringMixin
from util.param_util import convert_params
from util.scoring_util import (
    check_pos_label_and_average_against_data,
    initial_check_pos_label_and_average,
    add_default_params,
)


class PrecisionRecallFscoreSupportScoring(ClassificationScoringMixin, BaseScoring):
    """Implements sklearn.metrics.precision_recall_fscore_support

    - note that multi-field comparisons is only enabled when average != None
    """

    @staticmethod
    def convert_param_types(params):
        out_params = convert_params(params, strs=['pos_label', 'average'], floats=['beta'])
        out_params = add_default_params(out_params, {'average': 'None'})
        out_params = initial_check_pos_label_and_average(out_params)
        # class_variable_headers is True when average=None
        _meta_params = {'class_variable_headers': True} if out_params['average'] is None else {}
        out_params = add_default_params(
            out_params, {'pos_label': '1'}
        )  # add positive label after checking average

        # For precision_recall_fscore_support, "support" is undefined when average != None; warn appropriately
        average = out_params.get('average', None)
        if average is not None:
            msg = (
                '"support" metric is not defined when average is not None (found average="{}")'
            )
            cexc.messages.warn(msg.format(average))
        return out_params, _meta_params

    def check_params_with_data(self, actual_df, predicted_df):
        # assert that if average=None, arrays are comprised of exactly 1 field
        if self.params.get('average') is None and predicted_df.shape[1] > 1:
            msg = (
                'Value error: multi-field comparisons not supported when average=None. Single fields must be '
                'specified as "..| score {} <actual_field> against <predicted_field>".'
            )
            raise RuntimeError(msg.format(self.scoring_name, self.scoring_name))

        check_pos_label_and_average_against_data(actual_df, predicted_df, self.params)

    def create_output(self, scoring_name, results):
        """Output dataframe differs from parent.

        The output shape of precision_recall_fscore_support depends on the
        average value. If average!=None, the output shape is
        n-comparisons x (4-metrics + 2 field identifiers). If average=None,
        the output is
        actual-class-variable-cardinality x (4-metrics + 2 field identifiers)
        """
        # Labels is populated when average=None. In this case, metrics are computed for each class variable.
        class_variables = self.params.get('labels', None)

        if class_variables is not None:
            # In this case, the dataframe headers are unique class-labels + field identifiers
            results_array = np.vstack(results)  # 4 x n-classes
            row_labels = np.array(['precision', 'recall', 'fbeta_score', 'support']).reshape(
                -1, 1
            )  # 4 x 1
            output_array = np.hstack((row_labels, results_array))  # 4 x (n-classes + 1)
            col_labels = ['scored({})'.format(i) for i in class_variables]
            output_df = pd.DataFrame(
                data=output_array, columns=['Metric'] + col_labels
            )  # 4 x (n-classes + 1)
        else:
            result_array = np.array(results).reshape(len(results), -1)  # n-comparisons x 4
            col_labels = ['precision', 'recall', 'fbeta_score', 'support']
            output_df = pd.DataFrame(data=result_array, columns=col_labels)  # n-comparisons x 4
            # Add compared-fields information to the output df
            for k, v in self._meta_params[
                'field_identifiers'
            ].items():  # n-comparisons x (4 + 2)
                output_df[k] = v

        return output_df
