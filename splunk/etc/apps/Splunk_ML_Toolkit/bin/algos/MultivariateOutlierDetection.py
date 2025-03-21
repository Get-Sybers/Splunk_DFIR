#!/usr/bin/env python

import json
from collections import OrderedDict

import numpy as np
import pandas as pd

from algos_support.density_function.distance_metric import DistanceMetric
from algos_support.density_function.outlier_threshold import OutlierThreshold
from algos_support.density_function.probability_distribution import (
    ApplyParams,
    DistributionType,
    DistributionName,
    ProbabilityDistribution,
)
from algos.DensityFunction import DensityFunction
from algos.PCA import PCA
from algos.StandardScaler import StandardScaler

from base import BaseAlgo
from codec import codecs_manager
from codec.codecs import SimpleObjectCodec
from util import df_util
from util.constants import NUM_PCA_COMPONENTS
from util.param_util import convert_params
import cexc

logger = cexc.get_logger(__name__)
messages = cexc.get_messages_logger()


class MultivariateOutlierDetection(BaseAlgo):
    def __init__(self, options):
        MultivariateOutlierDetection._handle_options(options)

        self._params = convert_params(
            options.get('params', {}),
            strs=['dist', 'metric', 'show_options', "exclude_dist"],
            bools=['show_density', 'full_sample', 'sample'],
            multiple_floats=['threshold', 'lower_threshold', 'upper_threshold'],
            ints=['random_state'],
        )
        acceptable_dists = (
            DistributionType.AUTO,
            DistributionType.NORMAL,
            DistributionType.EXPONENTIAL,
            DistributionType.GAUSSIAN_KDE,
            DistributionType.BETA,
        )
        acceptable_exclude_dist = (
            DistributionType.NORMAL,
            DistributionType.EXPONENTIAL,
            DistributionType.GAUSSIAN_KDE,
            DistributionType.BETA,
        )
        self._dist_type = self._params.pop('dist', DistributionType.AUTO)
        if self._dist_type not in acceptable_dists:
            msg = 'Invalid value error: dist must be one of {}, but found dist="{}".'
            dists = ', '.join(['\"{}\"'.format(x) for x in acceptable_dists])
            raise RuntimeError(msg.format(dists, self._dist_type))

        self._exclude_dist = None
        exclude_string = self._params.pop('exclude_dist', None)
        if self._dist_type == DistributionType.AUTO and exclude_string:
            self._exclude_dist = exclude_string.split(",")
            excludes = ', '.join(['\"{}\"'.format(x) for x in acceptable_exclude_dist])
            for i in range(len(self._exclude_dist)):
                self._exclude_dist[i] = self._exclude_dist[i].strip()
                if self._exclude_dist[i] not in acceptable_exclude_dist:
                    msg = 'Invalid value error: exclude_dist must be one or more of {}, but found "{}" in exclude_dist.'
                    raise RuntimeError(msg.format(excludes, self._exclude_dist[i]))
            if sorted(self._exclude_dist) == sorted(list(acceptable_exclude_dist)):
                raise RuntimeError(
                    f"You cannot exclude all of the distribution types when using the exclude_dist parameter. Update your SPL search parameters to include at least one distribution type and run the search again."
                )
        elif exclude_string:
            raise RuntimeError(
                'The exclude_dist parameter can only be used when dist=auto. Update your SPL search parameters and run the search again.'
            )

        self._metric = self._params.get('metric', DistanceMetric.WASSERSTEIN)
        acceptable_metrics = [DistanceMetric.KOLMOGOROV_SMIRNOV, DistanceMetric.WASSERSTEIN]
        if self._metric not in acceptable_metrics:
            msg = 'Invalid value error: metric must be one of {}, but found metric="{}".'
            metrics = ', '.join(['\"{}\"'.format(x) for x in acceptable_metrics])
            raise RuntimeError(msg.format(metrics, self._metric))

        self._distance = None
        # the value of self._dist is either a single instance of ProbabilityDistribution
        # (if no by-clause) is used or a map of groups to instances of
        # ProbabilityDistribution
        self._dist = None
        mlspl_limits = options.get('mlspl_limits', {})

        # threshold is a tuple of floats even if there is only one value
        self._threshold = OutlierThreshold(
            threshold=self._params.get('threshold'),
            lower=self._params.get('lower_threshold'),
            upper=self._params.get('upper_threshold'),
            default_threshold=(float(mlspl_limits.get('default_prob_threshold', 0.01)),),
        )
        max_threshold_num = mlspl_limits.get('max_threshold_num', 5)
        try:
            max_threshold_num = int(max_threshold_num)
        except:
            raise RuntimeError(
                '"max_threshold_num" must be an integer. Found "max_threshold_num"={}.'.format(
                    max_threshold_num
                )
            )
        if max_threshold_num < 0:
            msg = '"max_threshold_num" can not be a negative number. Found "max_threshold_num"={}.'
            raise RuntimeError(msg.format(max_threshold_num))
        self._check_threshold(self._threshold, max_threshold_num)

        self.split_by = options.get('split_by')

        show_options = self._params.get('show_options', None)
        self._show_options_values = None
        if show_options:
            self._show_options_values = DensityFunction._get_show_options_value(
                show_options, options
            )

        # Flag that is set to true when during `fit` data there are
        # too few training points for one or more of the groups
        self._warned_on_few_training_data = False
        # Flag that is set to true when during `apply` we encounter
        # a group that the model does not have a distribution for.
        self._warned_on_missing_group = False
        # Flag that is set to true when the distribution type is
        # Exponential and the one of the given thresholds is lower_threshold
        self._warned_on_expon_lower_threshold = False
        # Flag that is set to true when the distribution type is
        # Beta and the one of the given thresholds is upper_threshold
        self._warned_on_beta_upper_threshold = False

    def _check_threshold(self, threshold, max_num_threshold):
        """Verify the specified threshold is acceptable"""
        assert self._threshold.is_specified()
        if threshold.is_multiple():
            size_th = threshold.get_size()
            if size_th > max_num_threshold:
                raise RuntimeError(
                    'The maximum number of allowed thresholds are {}. Found {} thresholds.'.format(
                        max_num_threshold, size_th
                    )
                )

    def _set_random_state(self):
        random_state = self._params.get('random_state')
        if random_state is not None:
            logger.debug('Setting random state to %s' % random_state)
            np.random.seed(random_state)

    def _check_target_field_is_numeric(self, X):
        if not np.issubdtype(X[self.feature_variables[0]].dtype, np.number):
            raise RuntimeError(
                'Feature \"{}\" is not a numeric type'.format(self.feature_variables[0])
            )

    @staticmethod
    def _get_show_options_value(show_options, options):
        dict_show_options = OrderedDict()
        show_options = show_options.replace(" ", "")
        absent = []
        for k in show_options.split(","):
            if k not in options.keys():
                absent.append(k)
            else:
                dict_show_options[k] = options[k]
        return json.dumps(dict_show_options)

    @staticmethod
    def _handle_options(options):
        if len(options.get('feature_variables', [])) == 1:
            messages.warning(
                'Outlier detection on univariate data can be better provided using the DensityFunction algorithm rather than MultivariateOutlierDetection.'
            )
        mlspl_limits = options.get('mlspl_limits', {})
        max_fields_in_by_clause = int(mlspl_limits.get('max_fields_in_by_clause', 5))
        if len(options.get('split_by', [])) > max_fields_in_by_clause:
            raise RuntimeError(
                'The number of fields in the by clause cannot exceed {}'.format(
                    max_fields_in_by_clause
                )
            )
        if 'model_name' in options:
            summary_fnames = [
                'type',
                'min',
                'max',
                'mean',
                'std',
                'cardinality',
                'distance',
                'other',
            ]
            by_fields = options.get('split_by', [])
            for fname in by_fields:
                if fname in summary_fnames:
                    raise RuntimeError(
                        f'The field "{fname}" conflicts with summary field names "{", ".join(summary_fnames)}". '
                        f'Please rename "{fname}".'
                    )

    def _prepare_fit(self, df, options):
        self._set_random_state()
        mlspl_limits = options.get('mlspl_limits', {})
        # Scale the dataset first with StandardScaler
        ss_options = options.copy()
        # remove the as clause from StandardScaler if described, it will be used in DensityFunction
        ss_options.pop('output_name', None)
        ss_options['params'] = {}
        ss_estimator = StandardScaler(ss_options)
        ss_estimator.feature_variables = self.feature_variables.copy()
        ss_estimator.fit(df, ss_options)
        self.ss_estimator = ss_estimator
        ss_output = self.ss_estimator.apply(df, ss_options)

        # Run PCA on the scaled dataset and get a single principle component
        pca_options = options.copy()
        # remove the as clause from PCA if described, it will be used in DensityFunction
        pca_options.pop('output_name', None)
        pca_options['params'] = {}
        pca_options['params']['k'] = NUM_PCA_COMPONENTS

        pca_estimator = PCA(pca_options)
        pca_estimator.feature_variables = [
            'SS_' + feature for feature in self.feature_variables.copy()
        ]
        pca_estimator.fit(ss_output, pca_options)
        self.pca_estimator = pca_estimator
        pca_output = self.pca_estimator.apply(ss_output, pca_options)

        # Create DensityFunction object with its single feature_variable being the first principle component from PCA output
        pca_output_options = options.copy()
        pca_output_options['feature_variables'] = ['PC_1']
        pca_output_options['args'] = ['PC_1']
        den_func = DensityFunction(pca_output_options)
        den_func.feature_variables = pca_output_options['feature_variables']
        df_util.assert_field_present(pca_output, den_func.feature_variables[0])
        self._check_target_field_is_numeric(pca_output)

        return pca_output, den_func, mlspl_limits, pca_output_options

    def fit(self, df, options):
        pca_output, den_func, mlspl_limits, pca_output_options = self._prepare_fit(df, options)
        den_func_output = den_func.fit(pca_output, pca_output_options)
        self.den_func = den_func
        return den_func_output

    def partial_fit(self, df, options):
        pca_output, den_func, mlspl_limits, pca_output_options = self._prepare_fit(df, options)
        den_func_output = den_func.partial_fit(pca_output, pca_output_options)
        self.den_func = den_func
        return den_func_output

    def apply(self, df, options):
        df = self.ss_estimator.apply(df, options)
        df = self.pca_estimator.apply(df, options)
        pca_output_options = options.copy()
        pca_output_options['feature_variables'] = ['PC_1']
        pca_output_options['args'] = ['PC_1']
        return self.den_func.apply(df, pca_output_options)

    def summary(self, options):
        den_func_df = self.den_func.summary(options)
        pca_df = self.pca_estimator.summary(options)
        pca_df = pd.concat([pca_df] * len(den_func_df), ignore_index=True)
        den_func_pca_combined_df = pd.concat([den_func_df, pca_df], axis=1)
        return den_func_pca_combined_df

    @staticmethod
    def register_codecs():
        codecs_manager.add_codec(
            'algos.MultivariateOutlierDetection',
            'MultivariateOutlierDetection',
            SimpleObjectCodec,
        )
        DensityFunction.register_codecs()
        PCA.register_codecs()
        StandardScaler.register_codecs()
