#!/usr/bin/env python

from base_scoring import BaseScoring, RegressionScoringMixin


class MeanAbsoluteErrorScoring(RegressionScoringMixin, BaseScoring):
    """Implements sklearn.metrics.mean_absolute_error"""
