#!/usr/bin/env python

from base_scoring import BaseScoring, ClassificationScoringMixin
from util.param_util import convert_params


class AccuracyScoring(ClassificationScoringMixin, BaseScoring):
    """Implements sklearn.metrics.accuracy_score"""

    @staticmethod
    def convert_param_types(params):
        out_params = convert_params(params, bools=['normalize'])
        _meta_params = {}
        return out_params, _meta_params
