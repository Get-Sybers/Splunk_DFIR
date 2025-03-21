#!/usr/bin/env python

from sklearn.decomposition import PCA as _PCA
import pandas as pd

from base import BaseAlgo, TransformerMixin
from codec import codecs_manager
from util.param_util import convert_params


class PCA(TransformerMixin, BaseAlgo):
    def __init__(self, options):
        self.handle_options(options)
        out_params = convert_params(
            options.get('params', {}),
            ints=['k'],
            floats=['variance'],
            aliases={'k': 'n_components'},
        )
        if 'variance' in out_params:
            if 'n_components' in out_params:
                msg = "Only one of k = {} or variance={} should be provided. Both cannot be respected.".format(
                    out_params['n_components'], out_params['variance']
                )
                raise RuntimeError(msg)
            elif out_params['variance'] <= 0 or out_params['variance'] > 1:
                msg = "Valid value for variance is 0 < variance <= 1"
                raise RuntimeError(msg)
            else:
                # If we are doing PCA based on variance_ratio_explained, based on scikit-learn implementation,
                # we set the n_components to that percentage, which will select the number of components such
                # that the amount of variance that needs to be explained is greater than the percentage
                # specified by n_components.

                if 0 < out_params['variance'] < 1:
                    out_params['n_components'] = out_params['variance']
                del out_params['variance']

        self.estimator = _PCA(**out_params)

    def rename_output(self, default_names, new_names):
        if new_names is None:
            new_names = 'PC'
        output_names = ['{}_{}'.format(new_names, i + 1) for i in range(len(default_names))]
        return output_names

    def summary(self, options):
        """Only model_name and mlspl_limits are supported for summary"""
        if len(options) != 2:
            msg = '"%s" models do not take options for summarization' % self.__class__.__name__
            raise RuntimeError(msg)
        n_components = ['PC_{}'.format(i + 1) for i in range(self.estimator.n_components_)]
        return pd.DataFrame(
            {
                'components': n_components,
                'explained_variance': self.estimator.explained_variance_.round(4),
                'explained_variance_ratio': self.estimator.explained_variance_ratio_.round(4),
                'singular_values': self.estimator.singular_values_.round(4),
            },
            index=n_components,
        )

    @staticmethod
    def register_codecs():
        from codec.codecs import SimpleObjectCodec

        codecs_manager.add_codec('algos.PCA', 'PCA', SimpleObjectCodec)
        codecs_manager.add_codec('sklearn.decomposition._pca', 'PCA', SimpleObjectCodec)
