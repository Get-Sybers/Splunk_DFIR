#!/usr/bin/env python

from base_scoring import BaseScoring, ClusteringScoringMixin
from util.param_util import convert_params
from util.scoring_util import add_default_params, validate_param_from_str_list


class SilhouetteScoring(ClusteringScoringMixin, BaseScoring):
    """Implements sklearn.metrics.silhouette_score"""

    @staticmethod
    def convert_param_types(params):
        converted_params = convert_params(params, strs=['metric'])
        valid_metric_vals = [
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
        ]

        converted_params = add_default_params(converted_params, {'metric': 'euclidean'})
        # whitelist metric should be one of the valid metric values
        converted_params = validate_param_from_str_list(
            converted_params, 'metric', valid_metric_vals
        )
        return converted_params
