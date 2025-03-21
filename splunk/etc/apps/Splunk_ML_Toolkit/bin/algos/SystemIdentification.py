#!/usr/bin/env python


import re
import fnmatch

import numpy as np
import pandas as pd
import pandas.core.series
import pandas.core.internals
import sklearn
from sklearn.neural_network import MLPRegressor

from algos_support.si.dataset import DataSet
from base import BaseAlgo
from codec import codecs_manager
from codec.codecs import BaseCodec
from util.param_util import convert_params
from util.base_util import match_field_globs
from util.df_util import remove_duplicates


HORIZON = 0
EPOCHS = 500
L2_REGULARIZATION = 0.01
VALIDATION_FRACTION = 0.2
HIDDEN_SIZE = 64
SHUFFLE = True
RANDOM_STATE = 1234
CONF = 95


class MLPCodec(BaseCodec):
    @classmethod
    def encode(cls, obj):
        assert type(obj) == sklearn.neural_network.MLPRegressor

        return {
            '__mlspl_type': [type(obj).__module__, type(obj).__name__],
            'coefs_': obj.coefs_,
            'intercepts_': obj.intercepts_,
            'n_layers_': obj.n_layers_,
            'hidden_layer_sizes': obj.hidden_layer_sizes,
            'n_outputs_': obj.n_outputs_,
            'out_activation_': obj.out_activation_,
            'n_iter_': obj.n_iter_,
            't_': obj.t_,
            'loss_curve_': obj.loss_curve_,
            'best_loss_': obj.best_loss_,
        }

    @classmethod
    def decode(cls, obj):
        t = MLPRegressor(hidden_layer_sizes=obj['n_layers_'] - 2)
        t.coefs_ = obj['coefs_']
        t.intercepts_ = obj['intercepts_']
        t.n_layers_ = obj['n_layers_']
        t.hidden_layer_sizes = obj['hidden_layer_sizes']
        t.n_outputs_ = obj['n_outputs_']
        t.out_activation_ = obj['out_activation_']
        t.n_iter_ = obj['n_iter_']
        t.t_ = obj['t_']
        t.loss_curve_ = obj['loss_curve_']
        t.best_loss_ = obj['best_loss_']
        return t


class SystemIdentification(BaseAlgo):
    def __init__(self, options):
        self.handle_options(options)

        initial_params = convert_params(
            options.get('params', {}),
            strs=['time_field', 'dynamics', 'layers'],
            ints=['conf_interval', 'horizon', 'epochs', 'random_state'],
            bools=['shuffle'],
        )

        self.get_time_field(initial_params)
        self.get_dynamics(initial_params)
        self.get_layers(initial_params)
        self.get_horizon(initial_params)
        self.get_epochs(initial_params)
        self.get_conf_interval(initial_params)
        self.create_model(initial_params)
        self.is_partial_fit = False
        self.num_partial_fits = 0
        self.train_stats = None

    def handle_options(self, options):
        """Utility to ensure there are both target and feature variables"""
        self.init_feature_variables = options.get('feature_variables', [])
        self.init_target_variables = options.get('target_variable', [])
        if len(self.init_target_variables) == 0 or len(self.init_feature_variables) == 0:
            raise RuntimeError('Syntax error: expected "<target> ... FROM <field> ..."')

        combined_variables = self.init_target_variables[:]
        for field in self.init_feature_variables:
            if field not in combined_variables:
                combined_variables.append(field)
        self.init_combined_variables = combined_variables

    def get_time_field(self, params):
        self.time_field = params.get('time_field', '_time')

    def get_dynamics(self, params):
        dynamics = params.get('dynamics', '')
        if len(dynamics) == 0:
            raise RuntimeError("Please enter dynamics")
        dynamics = dynamics.split('-')
        if len(dynamics) != len(self.init_combined_variables):
            raise RuntimeError(
                'Expected {} dynamics but got {}'.format(
                    len(self.init_combined_variables), len(dynamics)
                )
            )
        try:
            dynamics = list(map(int, dynamics))
        except Exception:
            raise RuntimeError(
                'Invalid dynamics: {}. Dynamics must be integers'.format(dynamics)
            )

        for d in dynamics:
            if d < 0:
                raise RuntimeError(
                    'Invalid dynamics: {}. Dynamics must be nonnegative'.format(d)
                )

        self.dynamics = {}
        i = 0
        for j in range(len(self.init_combined_variables)):
            field = self.init_combined_variables[j]
            self.dynamics[field] = dynamics[i]
            i += 1

    def expand_dynamics(self, input_fields, requested_fields):
        """Intersect input_fields with glob expansion of requested_fields. For each new field obtained from the wild cards,
        add a new entry to self.dynamics.
        Example: suppose a requested field is FOO* and we expand that to FOO_1 and FOO_2.
        Assume that self.dynamics['FOO*'] = 2 ('FOO*' must exists in self.dynamics, a condition the get_dynamics() function checked earlier).
        Then we set self.dynamics['FOO_1'] = 2 and self.dynamics['FOO_2'] = 2.

        Args:
            input_fields (list): the fields that are present
            requested_fields (list): the fields that are requested

        Returns:
            None
        """
        for f in requested_fields:
            if (
                f not in self.dynamics
            ):  # this happens in partial_fit, when self.dynamics was loaded from disk.
                # It means the wildcards were already resolved.
                continue
            if '*' in f:  # f contains a glob
                pat = re.compile(fnmatch.translate(f))
                matches = [
                    x for x in list(input_fields) if not x.startswith('__mv_') and pat.match(x)
                ]
                if len(matches) > 0:
                    for x in matches:
                        self.dynamics[x] = self.dynamics[f]
                    del self.dynamics[f]

    def get_layers(self, params):
        layers = params.get('layers', '')
        if len(layers) == 0:
            self.layers = [HIDDEN_SIZE, HIDDEN_SIZE]
        else:
            try:
                self.layers = list(map(int, layers.split('-')))
            except Exception as e:
                raise RuntimeError(e)

            for l in self.layers:
                if l < 1:
                    raise RuntimeError('Invalid layer size: {} (must be at least 1)'.format(l))

    def get_horizon(self, params):
        self.horizon = params.get('horizon', HORIZON)
        if self.horizon < 0:
            raise RuntimeError('Invalid horizon: {} (must be nonnegative)'.format(self.horizon))

    def get_epochs(self, params):
        self.epochs = params.get('epochs', EPOCHS)
        if self.epochs < 1:
            raise RuntimeError('Invalid epochs: {} (must be at least 1)'.format(self.epochs))

    def get_conf_interval(self, params):
        self.conf = params.get('conf_interval', CONF)
        if self.conf >= 100 or self.conf <= 0:
            raise RuntimeError('\"conf_interval\" must be an integer between 1 and 99')

    def create_model(self, params):
        self.estimator = MLPRegressor(
            hidden_layer_sizes=self.layers,
            max_iter=self.epochs,
            alpha=L2_REGULARIZATION,
            validation_fraction=VALIDATION_FRACTION,
            shuffle=params.get('shuffle', SHUFFLE),
            random_state=params.get('random_state', RANDOM_STATE),
        )

    def get_prediction(self, df, ds, fit_mode=True):
        pred = self.estimator.predict(ds.df_lag)
        self.output_names = ['predicted({})'.format(field) for field in self.target_variables]
        lower_names = ['lower{}({})'.format(self.conf, n) for n in self.output_names]
        upper_names = ['upper{}({})'.format(self.conf, n) for n in self.output_names]
        self.output_names.extend(upper_names)
        self.output_names.extend(lower_names)

        pred = self.estimator.predict(ds.df_lag)
        pred = self.compute_conf_intervals(ds, pred, fit_mode=fit_mode)

        df_pred = pd.DataFrame(data=pred, columns=self.output_names, index=ds.df_lag.index)
        df = df.combine_first(df_pred)

        df_pred = pd.DataFrame(data=pred, columns=self.output_names, index=ds.df_lag.index)
        # df_pred contains no time field, so we need to add it
        df_pred[self.time_field] = ds.get_time()
        return df.combine_first(df_pred)

    def prepare_data(self, df, fit_mode=True):
        ds = DataSet(df, self.time_field)
        ds.select_columns(self.combined_variables)
        ds.set_lags(self.target_variables, self.dynamics, self.horizon, fit_mode=fit_mode)
        return ds

    def compute_conf_intervals(self, ds, pred, fit_mode):
        '''
        We compute empirical confidence intervals.
        Suppose we want 90% confidence intervals. Denote predictions by x and corresponding observations by y.
        Let y_i be the observed value, and let x_i be the predicted value for i-th event.
        Let p5 and p95 be the 5th and 95th percentiles in the sequence x_i - y_i.
        Then Prob(p5 < x - y < p95) = .9. Equivalently, P(x - p95 < y < x - p5) = .9. Thus [x - p95, x - p5] is the 90%
        confidence interval. Hence we will compute percentiles of the sequence x_i - y_i and use them to compute confidence intervals.

        For partial fit, we need to update the confidence intervals when new data arrives. We do that by storing the percentiles and
        updating them by taking averages. Taking averages isn't as accurate as storing the entire x_i - y_i sequence for each
        partial fit, then merge them and recompute the percentiles. However, memory would increase linearly with the data.
        Therefore we choose to simply store the percentiles and take averages.
        '''
        if len(pred.shape) == 1:
            target_values = ds.df_target.values.reshape((len(ds.df_target.values), 1))
            pred = pred.reshape((len(pred), 1))
        else:
            target_values = ds.df_target.values

        if fit_mode:
            residuals = pred - target_values
            N = pred.shape[0]

            # update percentiles
            if self.num_partial_fits == 0:
                self.percentiles = np.ndarray((100, pred.shape[1]))
            for i in range(pred.shape[1]):
                x = np.sort(residuals[:, i], axis=None)
                per = np.array([x[int((j / 100) * N)] for j in range(100)])
                if self.num_partial_fits == 0:
                    self.percentiles[:, i] = per
                else:
                    a = self.num_partial_fits
                    b = 1.0 / a
                    self.percentiles[:, i] = (((a - 1) * b) * self.percentiles[:, i]) + (
                        b * per
                    )
            self.num_partial_fits += 1

        upper_percentile = int((100 + self.conf) // 2)
        lower_percentile = int((100 - self.conf) // 2)
        upper = np.ndarray(pred.shape)
        lower = np.ndarray(pred.shape)

        for i in range(pred.shape[1]):
            upper[:, i] = pred[:, i] - self.percentiles[lower_percentile, i]
            lower[:, i] = pred[:, i] - self.percentiles[upper_percentile, i]

        return np.concatenate((pred, upper, lower), axis=1)

    def fit(self, df, options):
        self.target_variables = match_field_globs(df.columns, self.init_target_variables)
        self.target_variables = remove_duplicates(self.target_variables)
        self.feature_variables = remove_duplicates(self.feature_variables)

        # ensure that target_variables and feature_variables are distinct
        common_variables = list(set(self.target_variables) & set(self.feature_variables))
        if len(common_variables) > 0:
            raise RuntimeError(
                '{} appeared in both target and feature variables'.format(common_variables[0])
            )

        self.combined_variables = self.target_variables[:]
        for field in self.feature_variables:
            if field not in self.combined_variables:
                self.combined_variables.append(field)

        if self.time_field not in self.combined_variables:
            self.combined_variables.append(self.time_field)

        self.expand_dynamics(df.columns, self.init_target_variables)
        self.expand_dynamics(df.columns, self.init_feature_variables)

        ds = self.prepare_data(df)
        if self.train_stats is None:
            train_stats = ds.normalize()
            self.train_stats = train_stats[['mean', 'std']].copy()
        else:
            ds.normalize(self.train_stats)

        self.estimator.fit(ds.df_lag, ds.df_target)
        df = self.get_prediction(df, ds)

        # Copy variables in self.feature_variables to options so that
        # they will be loaded by |apply. If we don't do this, |apply
        # won't know about the extra feature variables we added in fit().
        for var in self.combined_variables:
            if var not in options['feature_variables']:
                options['feature_variables'].append(var)

        df = df[
            : len(df) - self.horizon
        ]  # the last horizon rows belong to the future and have no expected values,
        # so we exclude them in the output.
        return df

    '''
    Important note: if partial_fit() is called, apply() will always be called next.
    '''

    def partial_fit(self, df, options):
        self.fit(
            df, options
        )  # this call only initializes the MLP's coeffs when called the first time.
        # On subsequent calls, it'll load the MLP's existing coefficients and train the model on new data.
        # Check sklearn source code:
        # https://github.com/scikit-learn/scikit-learn/blob/7813f7efb/sklearn/neural_network/multilayer_perceptron.py#L965
        self.is_partial_fit = True

    def apply(self, df, options):
        if self.is_partial_fit:
            self.is_partial_fit = False
            return df

        params = convert_params(
            options.get('params', {}),
            strs=['time_field', 'dynamics', 'layers'],
            ints=['conf_interval', 'horizon', 'epochs', 'random_state'],
            bools=['shuffle'],
        )

        self.conf = params.get('conf_interval', self.conf)
        if self.conf >= 100 or self.conf <= 0:
            raise RuntimeError('conf_interval must be an integer between 1 and 99')

        ds = self.prepare_data(df, fit_mode=False)
        ds.normalize(self.train_stats)

        return self.get_prediction(df, ds, fit_mode=False)

    def summary(self, options):
        if len(options) != 2:  # only model name and mlspl_limits
            raise RuntimeError(
                "{} models do not take options for summarization".format(
                    self.__class__.__name__
                )
            )
        state = self.estimator.__getstate__()
        df_summary = pd.DataFrame(
            {
                'targets': [' '.join(self.target_variables)],
                'features': [' '.join(self.feature_variables)],
                'dynamics': [
                    ' '.join(['{}: {}'.format(k, v) for k, v in self.dynamics.items()])
                ],
                'coefs': [' '.join(map(str, state['coefs_']))],
                'intercepts': [' '.join(map(str, state['intercepts_']))],
                'n_layers': [str(state['n_layers_'])],
                'hidden_layer_sizes': [' '.join(map(str, state['hidden_layer_sizes']))],
                'n_outputs': [str(state['n_outputs_'])],
                'epochs': [str(self.epochs)],
            }
        )
        return df_summary

    @staticmethod
    def register_codecs():
        from codec.codecs import SimpleObjectCodec

        codecs_manager.add_codec(
            "algos.SystemIdentification", "SystemIdentification", SimpleObjectCodec
        )
        codecs_manager.add_codec(
            "sklearn.neural_network._multilayer_perceptron", "MLPRegressor", MLPCodec
        )
