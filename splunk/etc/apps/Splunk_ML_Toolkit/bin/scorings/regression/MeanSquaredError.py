#!/usr/bin/env python

from base_scoring import BaseScoring, RegressionScoringMixin


class MeanSquaredErrorScoring(RegressionScoringMixin, BaseScoring):
    """Implements sklearn.metrics.mean_squared_error"""
