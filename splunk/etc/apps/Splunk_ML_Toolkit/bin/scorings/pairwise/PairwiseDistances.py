#!/usr/bin/env python

import pandas as pd
import numpy as np

import cexc
from base_scoring import BaseScoring
from scipy.stats import ks_2samp
from util.base_util import match_field_globs

from util.param_util import convert_params
from util.scoring_util import (
    prepare_statistical_scoring_data,
    load_scoring_function,
    add_default_params,
    validate_param_from_str_list,
)

# the metrics which we can not pass to sk-learn as a string but are implemented in scipy.stats.
# these metrics work on single field arrays only, in pairwise_distances we also support the multiple-field arrays
# for these scoring functions.
SCIPY_METRICS = ['ks_2samp', 'wasserstein_distance']
SCIPY_METRICS_FUNCTIONS = {'ks_2samp': ks_2samp}


class PairwiseDistancesScoring(BaseScoring):
    """Implements sklearn.metrics.pairwise.pairwise_distances for comparing fields against fields"""

    def __init__(self, options):
        """Initialize scoring class, check options & parse params"""
        self.scoring_name = options.get('scoring_name')
        self.params, self.a_fields, self.b_fields = self.handle_options(options)
        self.scoring_function = self.load_scoring_function_with_options(options)
        self.variables = self.a_fields + self.b_fields

    @staticmethod
    def load_scoring_function_with_options(options):
        """Load the correct scoring function from module."""
        scoring_module_name = 'sklearn.metrics.pairwise'
        scoring_function = load_scoring_function(
            scoring_module_name, options.get('scoring_name')
        )
        return scoring_function

    def handle_options(self, options):
        """Double-array statistics operate on 2 arrays.
        Args:
            options (dict): options containing scoring function params

        Returns:
            params (dict): validated parameters for scoring function
            a_fields (list): requested fields comprising a_array
            b_fields (list): requested fields comprising b_array
        """
        params = options.get('params', {})
        params = self.convert_param_types(params)
        a_fields = options.get('a_variables', [])
        b_fields = options.get('b_variables', [])
        return params, a_fields, b_fields

    @staticmethod
    def convert_param_types(params):
        converted_params = convert_params(params, strs=['metric', 'output'])
        valid_metrics = [
            'cityblock',
            'cosine',
            'euclidean',
            'l1',
            'l2',
            'manhattan',
            'braycurtis',
            'canberra',
            'chebyshev',
            'correlation',
            'hamming',
            'matching',
            'minkowski',
            'sqeuclidean',
        ] + SCIPY_METRICS

        converted_params = add_default_params(
            converted_params, {'metric': 'euclidean', 'output': 'matrix'}
        )
        converted_params = validate_param_from_str_list(
            converted_params, 'metric', valid_metrics
        )
        converted_params = validate_param_from_str_list(
            converted_params, 'output', ['list', 'matrix']
        )
        return converted_params

    def prepare_and_check_data(self, df, mlspl_limits):
        # apply glob * onto a_fields and b_fields
        self.a_fields = match_field_globs(list(df.columns), self.a_fields)
        self.b_fields = match_field_globs(list(df.columns), self.b_fields)
        if not (self.a_fields and self.b_fields):
            msg = (
                'Syntax error: "{}" requires fields specified as ".. | score {} '
                '<a_field_1> <a_field_2> ... <a_field_n> against <b_field_1> <b_field_2> ... <b_field_m>"'
            )
            raise RuntimeError(msg.format(self.scoring_name, self.scoring_name))
        if self.params['output'] == 'matrix':
            field_size_limit = int(mlspl_limits.get('max_fields', 50))
            len_b_fields = len(self.b_fields)
            if len_b_fields > field_size_limit:
                msg = (
                    'The number of columns of the second array ({}) is greater than {} '
                    'which results in poor performance. Please consider using output=list'
                )
                cexc.messages.warn(msg.format(len_b_fields, field_size_limit))
        prepared_df_a, prepared_df_b = prepare_statistical_scoring_data(
            df, self.a_fields, self.b_fields
        )
        _meta_params = {'output': self.params.pop('output')}
        return prepared_df_a, prepared_df_b, _meta_params

    def score(self, df, options):
        prepared_df_a, prepared_df_b, _meta_params = self.prepare_and_check_data(
            df, options.get('mlspl_limits', {})
        )
        if self.params.get('metric') in SCIPY_METRICS:
            result = self._score_on_scipy_metrics(df, self.a_fields, self.b_fields)
        else:
            result = self.scoring_function(
                prepared_df_a.transpose().values,
                prepared_df_b.transpose().values,
                **self.params
            )
        df_output = self.create_output(
            result, _meta_params, list(prepared_df_a.columns), list(prepared_df_b.columns)
        )
        return df_output

    def _score_on_scipy_metrics(self, df, a_fields, b_fields):
        """Calculates the pairwise distances on metrics which do not exist in sklearn's list
        but are supported by scipy.stats and which require single field name for both arrays.
        It calls the scoring function for each pair of fields (len(a_fields)* len(b_fields) times).

        Args:
            df (pd.dataFrame): input dataframe
            a_fields(list): requested fields each of which comprising individual a_array's
            b_fields(list): requested fields each of which comprising individual b_array's

        Returns:
            result(2d array): includes all pairwise scorings
        """
        # set the scoring_name as 'metric' to get the correct scoring method and delete it
        scoring_name = self.params.pop('metric')
        # load the scoring function
        if scoring_name == 'wasserstein_distance':
            from scipy.stats import wasserstein_distance

            SCIPY_METRICS_FUNCTIONS[scoring_name] = wasserstein_distance
        scoring_function = SCIPY_METRICS_FUNCTIONS[scoring_name]
        # all pairwise results will be stored in a list, then to be compatible with pairwise distances format
        # it will be reshaped as a 2d array according to field array lengths
        result_list = []
        for a in a_fields:
            a_array = df[a].values
            for b in b_fields:
                b_array = df[b].values
                # extract the scipy.stats scoring function object
                # store the scoring function's result on these two single fields in result_list
                pair_result = scoring_function(a_array, b_array, **self.params)
                result_list.append(
                    PairwiseDistancesScoring._extract_score_value(scoring_name, pair_result)
                )
        # reshape the result_list as a 2d array:(len(a_fields), len(b_fields))
        result = np.array(result_list).reshape((len(a_fields), len(b_fields)))
        return result

    @staticmethod
    def _extract_score_value(scoring_name, pair_result):
        """
        The results of the scoring methods do not always consist of a single value.
        This method extracts the actual scoring value from the output

        Args:
            scoring_name(str): spl name of the scoring function
            pair_result(scipy.stats.{scoring_name}.Result object ): Result object of the scoring function
            including additional variables such as p-value.

        Returns:
            (float): The actual scoring value extracted from the object
        """
        # ks_2samp stores its distance value under 'statistic'
        if scoring_name == 'ks_2samp':
            return pair_result.statistic
        else:  # scoring_name = wasserstein_distance
            return pair_result

    @staticmethod
    def create_output(result, _meta_params, a_fields, b_fields):
        if _meta_params['output'] == 'matrix':
            result = np.insert(result.astype(str), 0, [a_fields], axis=1)
            output_df = pd.DataFrame(
                result, columns=['A_field'] + ['B_field(' + x + ')' for x in b_fields]
            )
            return output_df
        else:  # output='list'
            a_fields_list = np.repeat(a_fields, len(b_fields))
            b_fields_list = b_fields * len(a_fields)
            result_field_list = result.flatten().tolist()
            output_df = pd.DataFrame(
                {
                    'A_field': a_fields_list,
                    'B_field': b_fields_list,
                    'Distance': result_field_list,
                }
            )
            return output_df
