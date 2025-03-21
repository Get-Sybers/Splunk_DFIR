#!/usr/bin/env python
from distutils.version import StrictVersion
from sklearn import __version__ as sklearn_version

kfold_cv_required_sklearn_version = '0.19.0'


def check_kfold_cv_available():
    """Raises runtime error if we're using an old version of sklearn."""
    if StrictVersion(sklearn_version) < StrictVersion(kfold_cv_required_sklearn_version):
        msg = 'kfold_cv cannot be used with this version of scikit-learn ({}): version {} or higher required'
        msg = msg.format(sklearn_version, kfold_cv_required_sklearn_version)
        raise RuntimeError(msg)
