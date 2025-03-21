#!/usr/bin/env python

from pandas import DataFrame
from sklearn.ensemble import GradientBoostingRegressor as _GradientBoostingRegressor

from base import RegressorMixin, BaseAlgo
from util.param_util import convert_params
from util.algo_util import handle_max_features
from codec import codecs_manager


class GradientBoostingRegressor(RegressorMixin, BaseAlgo):
    def __init__(self, options):
        self.handle_options(options)
        params = options.get('params', {})
        out_params = convert_params(
            params,
            strs=['loss', 'max_features'],
            floats=['learning_rate', 'min_weight_fraction_leaf', 'alpha', 'subsample'],
            ints=[
                'n_estimators',
                'max_depth',
                'min_samples_split',
                'min_samples_leaf',
                'max_leaf_nodes',
                'random_state',
            ],
        )

        valid_loss = ['squared_error', 'absolute_error', 'huber', 'quantile']
        if 'loss' in out_params:
            if out_params['loss'] not in valid_loss:
                msg = "loss must be one of: {}".format(', '.join(valid_loss))
                raise RuntimeError(msg)

        if 'max_features' in out_params:
            out_params['max_features'] = handle_max_features(out_params['max_features'])

        self.estimator = _GradientBoostingRegressor(**out_params)

    def apply(self, df, options):
        # needed for backward compatibility with sklearn 0.17
        # since n_features_ was added in version 0.18
        self.estimator.n_features_ = len(self.columns)
        return super(GradientBoostingRegressor, self).apply(df, options)

    def summary(self, options):
        if len(options) != 2:  # only model name and mlspl_limits
            msg = '"%s" models do not take options for summarization' % self.__class__.__name__
            raise RuntimeError(msg)
        df = DataFrame(
            {'feature': self.columns, 'importance': self.estimator.feature_importances_.ravel()}
        )
        return df

    @staticmethod
    def register_codecs():
        from codec.codecs import SimpleObjectCodec, TreeCodec, NoopCodec
        from algos.GradientBoostingClassifier import GBTCodec

        codecs_manager.add_codec(
            'algos.GradientBoostingRegressor', 'GradientBoostingRegressor', SimpleObjectCodec
        )
        codecs_manager.add_codec('sklearn.ensemble._gb', 'GradientBoostingRegressor', GBTCodec)
        codecs_manager.add_codec(
            'sklearn.ensemble._gb.gradient_boosting', 'MeanEstimator', SimpleObjectCodec
        )
        codecs_manager.add_codec(
            'sklearn.ensemble._gb_losses', 'LeastAbsoluteError', SimpleObjectCodec
        )
        codecs_manager.add_codec(
            'sklearn.ensemble._gb_losses', 'HuberLossFunction', SimpleObjectCodec
        )
        codecs_manager.add_codec(
            'sklearn.ensemble._gb_losses', 'QuantileEstimator', SimpleObjectCodec
        )
        codecs_manager.add_codec(
            'sklearn.ensemble._gb_losses', 'QuantileLossFunction', SimpleObjectCodec
        )
        codecs_manager.add_codec(
            'sklearn.ensemble._gb_losses', 'LeastSquaresError', SimpleObjectCodec
        )
        codecs_manager.add_codec(
            'sklearn.tree._classes', 'DecisionTreeRegressor', SimpleObjectCodec
        )
        codecs_manager.add_codec('sklearn.tree._tree', 'Tree', TreeCodec)
        codecs_manager.add_codec('sklearn.tree._tree', 'Tree', TreeCodec)
        codecs_manager.add_codec('sklearn._loss.loss', 'HalfSquaredError', SimpleObjectCodec)
        codecs_manager.add_codec('_loss', 'CyHalfSquaredError', NoopCodec)
        codecs_manager.add_codec('sklearn._loss.link', 'IdentityLink', SimpleObjectCodec)
        codecs_manager.add_codec('sklearn._loss.link', 'Interval', SimpleObjectCodec)
        codecs_manager.add_codec('sklearn._loss.loss', 'PinballLoss', SimpleObjectCodec)
        codecs_manager.add_codec('_loss', 'CyPinballLoss', NoopCodec)
        codecs_manager.add_codec('sklearn._loss.loss', 'HuberLoss', SimpleObjectCodec)
        codecs_manager.add_codec('_loss', 'CyHuberLoss', NoopCodec)
