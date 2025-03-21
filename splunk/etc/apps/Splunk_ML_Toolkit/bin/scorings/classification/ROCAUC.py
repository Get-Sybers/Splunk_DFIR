#!/usr/bin/env python


from base_scoring import BaseScoring, ROCMixin


class ROCAUCScoring(ROCMixin, BaseScoring):
    """Implements sklearn.metrics.roc_auc_score"""

    pass
