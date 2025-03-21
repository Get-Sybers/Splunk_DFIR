#!/usr/bin/env python

import json
from collections import defaultdict
from collections import OrderedDict
from itertools import chain
from functools import partial

import numpy as np
import pandas as pd
from vendor.toolz import itertoolz

from algos_support.density_function.column_name import make_column_name
from algos_support.density_function.distance_metric import DistanceMetric
from algos_support.density_function.distribution_factory import get_distribution
from algos_support.density_function.outlier_threshold import OutlierThreshold
from algos_support.density_function.probability_distribution import (
    ApplyParams,
    DistributionType,
    DistributionName,
    ProbabilityDistribution,
)
from algos.DecisionTreeRegressor import DecisionTreeRegressor

from base import BaseAlgo
from codec import codecs_manager
from codec.codecs import SimpleObjectCodec, TreeCodec
from util import df_util, algo_util
from util.multivalue_util import multivalue_encode
from util.numpy_util import safe_str_infinity
from util.param_util import convert_params
import cexc

logger = cexc.get_logger(__name__)
messages = cexc.get_messages_logger()


class LabeledDistribution(object):
    """A serializable named tuple to group one instance of
    a ProbabilityDistribution and a set of field names/values
    that form the instance's corresponding group"""

    def __init__(self, dist, fields):
        """
        Args:
            dist (ProbabilityDistribution): A probability distribution
            fields (dict): Mapping of field names to field values
        """
        self.dist = dist
        self.fields = fields


class DensityFunction(BaseAlgo):
    OUTPUT_NAME = 'IsOutlier'
    SAMPLED_VALUE = 'SampledValue'
    BOUNDARY_RANGES = 'BoundaryRanges'
    OPTIONS = '_Options'

    def __init__(self, options):
        DensityFunction._handle_options(options)

        self._params = convert_params(
            options.get('params', {}),
            strs=['dist', 'metric', 'show_options', "exclude_dist"],
            bools=['show_density', 'full_sample', 'sample', 'supervise_split_by'],
            floats=['regul'],
            multiple_floats=['threshold', 'lower_threshold', 'upper_threshold'],
            ints=['random_state', 'max_depth', 'max_leaf_nodes', 'min_samples_leaf'],
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

        self._regul = self._params.get('regul', 0.0)
        if self._regul < 0.0 or self._regul > 1.0:
            msg = 'Invalid value error: regul must be a float between 0 and 1, but found regul={}.'
            raise RuntimeError(msg.format(self._regul))
        self._max_depth = self._params.get('max_depth', 10)
        self._max_leaf_nodes = self._params.get('max_leaf_nodes', 1024)
        self._supervise_split_by = self._params.get('supervise_split_by', False)

        self._distance = None
        # the value of self._dist is either a single instance of ProbabilityDistribution
        # (if no by-clause) is used or a map of groups to instances of
        # ProbabilityDistribution
        self._dist = None
        mlspl_limits = options.get('mlspl_limits', {})
        self._min_data_size = int(mlspl_limits.get('min_data_size_to_fit', 50))

        self._min_samples_leaf = self._params.get('min_samples_leaf', self._min_data_size)
        self._tree = None
        self._options_dt = None

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
        # The most common cases this if condition occurs are: the user forgets to put quotation marks at the start and end of by fields or thresholds.
        # In that case the search command understands it as there are multiple feature_variables.
        if len(options.get('feature_variables', [])) != 1 or 'target_variable' in options:
            raise RuntimeError(
                'Syntax error: If multiple values of by field or any parameter are used with comma (",") they should be given in quotation marks e.g. by "DayOfWeek,HourOfDay" or threshold="0.01,0.02".'
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

    @staticmethod
    def _generate_key(field_value_tuple):
        """Generate a string from the tuple of field values,
        where a tuple specifies a data group defined by the values.
        """
        return '_'.join(map(str, field_value_tuple))

    def _warn_on_few_training_data(self):
        if self._warned_on_few_training_data:
            if self.split_by:
                msg = (
                    'Too few training points in some groups will likely result in poor '
                    'accuracy for those groups. Please see model summary to inspect such groups.'
                )
            else:
                msg = 'Too few training points in data set will likely result in poor accuracy. Please see model summary.'
            messages.warning(msg)

    def _warn_on_dist_name_mismatches_threshold(self, dist_name, threshold):
        if threshold.is_lower_upper:
            if (
                dist_name == DistributionName.EXPONENTIAL
                and threshold.lower is not None
                and not self._warned_on_expon_lower_threshold
            ):
                messages.warn(
                    'Exponential Distribution type can have an outlier region only at the right tail. Ignoring "lower_threshold" value for Exponential distribution.'
                )
                self._warned_on_expon_lower_threshold = True

    def _fit_data(self, distribution, data, mlspl_limits):
        """Fit an instance of ProbabilityDistribution over data.
        Warn if there are too few data points in the data array"""
        min_data_size = int(mlspl_limits.get('min_data_size_to_fit', 50))
        if len(data) < min_data_size and not self._warned_on_few_training_data:
            self._warned_on_few_training_data = True
            self._warn_on_few_training_data()
        # To fix the error of object not having "_exclude_dist" attribute, when partial_fit is used on a smaller dataset and with an earlier version of MLTK (<=5.3.0)
        self._exclude_dist = self._exclude_dist if hasattr(self, '_exclude_dist') else None
        distribution.fit(data.values, self._metric, self._exclude_dist)
        self._warn_on_dist_name_mismatches_threshold(distribution.get_name(), self._threshold)
        self._distance = distribution.distance

    @staticmethod
    def _get_max_groups(mlspl_limits):
        max_groups = mlspl_limits.get('max_groups', 1024)
        try:
            return int(max_groups)
        except:
            raise RuntimeError(
                'Invalid value for max_groups={}: max_groups (in Settings or mlspl.conf file) must be an int'.format(
                    max_groups
                )
            )

    def _fit_groups(self, X, mlspl_limits):
        """Split data into groups and fit each group separately"""
        groups = df_util.split_by(
            X, self.split_by, max_groups=DensityFunction._get_max_groups(mlspl_limits)
        )
        self._dist = {}
        for label, group_df in groups:
            dist = get_distribution(self._dist_type, mlspl_limits)
            self._fit_data(dist, group_df[self.feature_variables[0]], mlspl_limits)
            # If the 'groupby' operation uses only one field, then 'label'
            # is a single value, otherwise its a tuple. So, we convert the
            # single value to a tuple of only one value, so we don't have to
            # deal with a special case later.
            if not isinstance(label, tuple):
                label = (label,)
            field_name_vals = {k: v for k, v in zip(self.split_by, label)}
            self._dist[DensityFunction._generate_key(label)] = LabeledDistribution(
                dist, field_name_vals
            )

    def _update_data(self, distribution, data):
        """Update an instance of ProbabilityDistribution over data."""
        distribution.update(data.values)
        self._distance = distribution.distance

    def _update_groups(self, X, mlspl_limits):
        """Split data into groups and update each group separately"""
        max_groups = DensityFunction._get_max_groups(mlspl_limits)
        groups = df_util.split_by(X, self.split_by, max_groups=max_groups)
        for label, group_df in groups:
            if not isinstance(label, tuple):
                label = (label,)
            label_key = DensityFunction._generate_key(label)
            if label_key in self._dist:
                dist = self._dist[label_key].dist
                self._update_data(dist, group_df[self.feature_variables[0]])
            else:
                dist = get_distribution(self._dist_type, mlspl_limits)
                self._fit_data(dist, group_df[self.feature_variables[0]], mlspl_limits)
                field_name_vals = {k: v for k, v in zip(self.split_by, label)}
                self._dist[label_key] = LabeledDistribution(dist, field_name_vals)
                if len(self._dist) > max_groups:
                    raise RuntimeError(
                        "The number of groups exceeds the max ({}) specified in mlspl.conf file".format(
                            max_groups
                        )
                    )

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

    def _check_target_field_is_numeric(self, X):
        if not np.issubdtype(X[self.feature_variables[0]].dtype, np.number):
            raise RuntimeError(
                'Feature \"{}\" is not a numeric type'.format(self.feature_variables[0])
            )

    def _set_random_state(self):
        random_state = self._params.get('random_state')
        if random_state is not None:
            logger.debug('Setting random state to %s' % random_state)
            np.random.seed(random_state)

    def _prepare_fit(self, df, options):
        self._set_random_state()
        X = df.copy()
        X, nans, _ = df_util.prepare_features(
            X=X,
            variables=self.feature_variables + (self.split_by or []),
            mlspl_limits=options.get('mlspl_limits'),
            get_dummies=False,
        )
        mlspl_limits = options.get('mlspl_limits', {})

        if getattr(self, '_supervise_split_by', False):
            X = self._fit_groups_encoder(df, options)

        df_util.assert_field_present(df, self.feature_variables[0])
        self._check_target_field_is_numeric(X)
        return X, nans, mlspl_limits

    def fit(self, df, options):
        dfc = df.copy()
        X, nans, mlspl_limits = self._prepare_fit(df, options)
        if self.split_by:
            self._fit_groups(X, mlspl_limits)
        else:
            self._dist = get_distribution(self._dist_type, mlspl_limits)
            self._fit_data(self._dist, X[self.feature_variables[0]], mlspl_limits)

        _params = ApplyParams(
            self._params.get('show_density', False),
            self._params.get('full_sample', False),
            self._params.get('sample', False),
            self._params.get('show_options', None),
        )
        new_name = options.get('output_name', None)
        res = self._call_apply_on_probability_distribution(
            X, nans, self._threshold, _params, new_name=new_name
        )
        if getattr(self, '_supervise_split_by', False):
            groups = X['__group'].to_frame()
            dfc = df_util.merge_predictions(dfc, groups)
        else:
            tree_opts = ['max_depth', 'max_leaf_nodes', 'min_samples_leaf', 'regul']
            check_sum = sum([1 for v in options.get('params', {}).keys() if v in tree_opts])
            if check_sum > 0:
                log_msg = "Ignoring any options in ({}) when supervise_split_by=false or omitted.".format(
                    ', '.join(tree_opts)
                )
                cexc.messages.warn(log_msg)
                logger.warn(log_msg)

        return df_util.merge_predictions(dfc, res)

    def partial_fit(self, df, options):
        X, nans, mlspl_limits = self._prepare_fit(df, options)
        if self._dist is None:
            # First chunk of data. Fit model as in fit().
            if self.split_by:
                self._fit_groups(X, mlspl_limits)
            else:
                self._dist = get_distribution(self._dist_type, mlspl_limits)
                self._fit_data(self._dist, X[self.feature_variables[0]], mlspl_limits)
        else:
            # subsequent chunks of data. Update existing model.
            if self.split_by:
                self._update_groups(X, mlspl_limits)
            else:
                self._update_data(self._dist, X[self.feature_variables[0]])

    def _set_df_columns_to_none(self, X, params, new_name):
        X[
            make_column_name(
                DensityFunction.OUTPUT_NAME,
                new_name=new_name,
                feature_variable=self.feature_variables[0],
            )
        ] = None
        X[make_column_name(DensityFunction.BOUNDARY_RANGES)] = None
        X[make_column_name('__mv_{}'.format(DensityFunction.BOUNDARY_RANGES))] = None
        if params.show_density:
            X['ProbabilityDensity({})'.format(self.feature_variables[0])] = None
        if params.full_sample:
            X['FullSampledValue'] = None
        if params.sample:
            X[DensityFunction.SAMPLED_VALUE] = None
        if params.show_options:
            X[DensityFunction.OPTIONS] = None

    def _set_columns(
        self, X, results_dict, main_name, threshold, key, new_name=None, feature_variable=None
    ):
        # N.B. See ProbabilityDensity.apply() docstring for the key values of the dictionary
        if threshold.is_multiple():
            if results_dict[key]:
                for thrsh, values in zip(
                    threshold.get_multiple_thresholds(), results_dict[key]
                ):
                    X[
                        make_column_name(
                            main_name, new_name, thrsh, feature_variable=feature_variable
                        )
                    ] = values
            else:
                for thrsh in threshold.get_multiple_thresholds():
                    X[
                        make_column_name(
                            main_name, new_name, thrsh, feature_variable=feature_variable
                        )
                    ] = None
        else:
            X[make_column_name(main_name, new_name, feature_variable=feature_variable)] = (
                results_dict[key][0] if results_dict[key] else None
            )

    def _set_df_column_values(self, X, results_dict, new_name, threshold):
        """Populate Dataframe columns from the input dictionary"""
        self._set_columns(
            X,
            results_dict,
            DensityFunction.OUTPUT_NAME,
            threshold,
            ProbabilityDistribution.DICT_KEY_OUTLIERS,
            new_name=new_name,
            feature_variable=self.feature_variables[0],
        )
        (
            str_boundary_ranges,
            multivalue_boundary_ranges,
        ) = self._get_multivalue_of_boundary_ranges(
            results_dict[ProbabilityDistribution.DICT_KEY_BOUNDARY_RANGES], X.shape[0]
        )
        # add formatted boundary ranges (boundary ranges are string and each range is on a new line), each threshold gets a new column
        self._set_columns(
            X,
            {ProbabilityDistribution.DICT_KEY_BOUNDARY_RANGES: str_boundary_ranges},
            DensityFunction.BOUNDARY_RANGES,
            threshold,
            ProbabilityDistribution.DICT_KEY_BOUNDARY_RANGES,
        )
        # add multivalued fields
        self._set_columns(
            X,
            {
                '__mv_{}'.format(
                    ProbabilityDistribution.DICT_KEY_BOUNDARY_RANGES
                ): multivalue_boundary_ranges
            },
            '__mv_{}'.format(DensityFunction.BOUNDARY_RANGES),
            threshold,
            '__mv_{}'.format(ProbabilityDistribution.DICT_KEY_BOUNDARY_RANGES),
        )
        densities = results_dict.get(ProbabilityDistribution.DICT_KEY_DENSITIES)
        if densities is not None:
            X['ProbabilityDensity({})'.format(self.feature_variables[0])] = densities
        samples = results_dict.get(ProbabilityDistribution.DICT_KEY_SAMPLE)
        full_samples = results_dict.get(ProbabilityDistribution.DICT_KEY_FULL_SAMPLE)
        if full_samples is not None:
            X[ProbabilityDistribution.DICT_KEY_FULL_SAMPLE] = full_samples
        if samples is not None:
            self._set_columns(
                X,
                results_dict,
                main_name=DensityFunction.SAMPLED_VALUE,
                threshold=threshold,
                key=ProbabilityDistribution.DICT_KEY_SAMPLE,
            )
        if self._show_options_values is not None:
            X[DensityFunction.OPTIONS] = np.full(X.shape[0], self._show_options_values).astype(
                object
            )

    def _apply_groups(self, X, threshold, params, new_name):
        """Split data into groups and apply the corresponding distribution to each group separately"""
        # Find the right label for the group by taking the relevant field values
        # of the first row
        label = tuple(X[field_val].values[0] for field_val in self.split_by)
        try:
            dist = self._dist[DensityFunction._generate_key(label)].dist
        except KeyError:
            # No stored group found for this data, so we set the value to an empty string
            if not self._warned_on_missing_group:
                self._warned_on_missing_group = True
                messages.warn('Some of the data groups do not have a distribution in the model')
            self._set_df_columns_to_none(X, params=params, new_name=new_name)
        else:
            apply = dist.apply(X[self.feature_variables[0]], threshold=threshold, params=params)
            self._set_df_column_values(
                X, results_dict=apply, new_name=new_name, threshold=threshold
            )
        return X

    def _fit_groups_encoder(self, data, options):
        df = data.copy()

        # parameters for DecisionTree algo
        params = options.get('params', {})
        params_dt = {
            'max_depth': self._max_depth,
            'max_leaf_nodes': self._max_leaf_nodes,
            'min_samples_leaf': self._min_samples_leaf,
            'ccp_alpha': 0.0,
        }
        options_dt = {
            'target_variable': self.feature_variables,
            'feature_variables': self.split_by,
            'params': params_dt,
        }

        dtr = DecisionTreeRegressor(options_dt)
        dtr.target_variable = options_dt.get('target_variable')[0]
        dtr.feature_variables = options_dt.get('feature_variables')

        # Estimate ccp_alpha if regul parameter is given (TODO)
        if self._regul > 0:
            alphas = algo_util._cost_complexity_pruning_path(dtr.estimator, df, options_dt)
            # linear mapped search to normalized parameter
            lins = np.linspace(0, 1, len(alphas))
            goal_idx = (np.abs(lins - self._regul)).argmin()
            ccp_alpha = np.round(alphas[goal_idx], 5)
            dtr.ccp_alpha = ccp_alpha
            options_dt['params']['ccp_alpha'] = ccp_alpha

        # fit the decision tree
        dtr.fit(df, options_dt)

        # Store estimator and add encoded groups to dataframe
        if dtr.estimator is not None:
            self._tree = dtr
            self._options_dt = options_dt
            self.split_by = ['__group']
            df = dtr._apply(df, options_dt)
        else:
            msg = 'Failed to supervise groups with target {} and features {}.'
            raise RuntimeError(
                msg.format(
                    options_dt.get('target_variable'), options_dt.get('feature_variables')
                )
            )
        return df

    def _apply_groups_encoder(self, data):
        # Encode features
        df = data.copy()
        encoder = self._tree
        options_dt = self._options_dt
        if encoder is not None:
            df = encoder._apply(df, options_dt)
        else:
            msg = 'Missing pretrained supervisor to create groups for features {}.'
            raise RuntimeError(msg.format(options_dt.get('feature_variables')))
        return df

    def _get_columns(self, main_name, threshold, new_name=None, feature_variable=None):
        field_names = [make_column_name(main_name, new_name, feature_variable=feature_variable)]
        if threshold.is_multiple():
            field_names = [
                make_column_name(
                    main_name, new_name, thrshld, feature_variable=self.feature_variables[0]
                )
                for thrshld in threshold.get_multiple_thresholds()
            ]
        return field_names

    def _get_df_column_names(self, params, new_name, threshold):
        """Get target DataFrame column name.
        NOTE: The order of these column names are important in the way
        we extract/populate values.
        """
        field_names = self._get_columns(
            main_name='IsOutlier',
            threshold=threshold,
            new_name=new_name,
            feature_variable=self.feature_variables[0],
        )
        field_names.extend(
            self._get_columns(main_name=DensityFunction.BOUNDARY_RANGES, threshold=threshold)
        )
        field_names.extend(
            self._get_columns(
                main_name='__mv_{}'.format(DensityFunction.BOUNDARY_RANGES), threshold=threshold
            )
        )
        if params.show_density:
            field_names.append('ProbabilityDensity({})'.format(self.feature_variables[0]))
        if params.full_sample:
            field_names.append('FullSampledValue')
        if params.sample:
            field_names.extend(
                self._get_columns(main_name=DensityFunction.SAMPLED_VALUE, threshold=threshold)
            )
        if params.show_options:
            field_names.append(DensityFunction.OPTIONS)
        return field_names

    def _get_multivalue_of_boundary_ranges(self, boundary_ranges, size):
        """
        Reformat the boundary ranges by replacing the list value with a string where the values in the list are separated with a comma.
        Also create the multivalue encodings for the reformatted boundary ranges.
        Replicate string values and multivalue encodings size times

        Example for reformatted boundary ranges:
        boundary_ranges = {
        0.03: [[-np.inf, 6.9617, 0.0127], [9.0031,9.2788,0.0127], [10.6631, np.inf, 0.0058]],
        0.005: [[-np.inf,6.6919,0.0032],[10.7804,np.inf,0.0018]]
        }
        --->
        str_boundary_list = [
        -Infinity:6.9617:0.0127\n
        9.0031:9.2788:0.0127\n
        10.6631:Infinity:0.0058,
        -Infinity:6.6919:0.0032\n
        10.7804:Infinity:0.0018
        ]
        multivalue_boundary_list = [
        '$-Infinity:6.9617:0.0127$;
        $9.0031:9.2788:0.0127$;
        $10.6631:Infinity:0.0058$,
        $-Infinity:6.6919:0.0032$;
        $10.7804:Infinity:0.0018$
        ]
        Args:
            boundary_ranges (dict): the value to encode
            size (int): Size of the array of output values, boundary ranges are replicated by size.

        Returns:
        (tuple): str_boundary_list is a list containing the reformatted version of boundary ranges
                 multivalue_boundary_list is a list containing the encoded multivalues of the str_boundary_list elements
        """
        str_boundary_list = []
        multivalue_boundary_list = []
        for value in boundary_ranges.values():
            val_list = []
            for l in value:
                line = '{}:{}:{}'.format(safe_str_infinity(l[0]), safe_str_infinity(l[1]), l[2])
                val_list.append(line)
            boundary_value = '\n'.join(val_list)
            encoded_multivalue = ";".join(map(multivalue_encode, val_list))
            str_boundary_list.append(np.full(size, boundary_value).astype(object))
            multivalue_boundary_list.append(np.full(size, encoded_multivalue).astype(object))
        return str_boundary_list, multivalue_boundary_list

    def _call_apply_on_probability_distribution(self, X, nans, threshold, params, new_name):
        column_names = self._get_df_column_names(
            params=params, new_name=new_name, threshold=threshold
        )
        if self.split_by:
            transformed = df_util.split_by(X, self.split_by).apply(
                partial(
                    self._apply_groups, threshold=threshold, params=params, new_name=new_name
                )
            )
            applied = transformed[column_names].values
        else:
            tmp_applied = self._dist.apply(
                X[self.feature_variables[0]], threshold, params=params
            )
            applied = [elem for elem in tmp_applied['Outliers']]
            (
                str_boundary_ranges,
                multivalue_boundary_ranges,
            ) = self._get_multivalue_of_boundary_ranges(
                tmp_applied['BoundaryRanges'], len(applied[0])
            )
            applied.extend(str_boundary_ranges)
            applied.extend(multivalue_boundary_ranges)
            end_point = len(tmp_applied)
            # SampledValue list exists at the end of the output list and it might consist of one or multiple lists.
            # We want to append those SampledValue lists not the list which is containing them.
            # We go up to the last element in the output list and handle the last element specially.
            if params.sample:
                end_point = end_point - 1
            # Since the first two elements, Outliers and BoundaryRanges, are already added start with index 2.
            for elem in itertoolz.take(end_point - 2, itertoolz.drop(2, tmp_applied.items())):
                applied.append(elem[1])
            if params.sample:
                for elem in tmp_applied[DensityFunction.SAMPLED_VALUE]:
                    applied.append(elem)
            if params.show_options:
                applied.append(np.full(X.shape[0], self._show_options_values).astype(object))
            applied = np.stack(applied, axis=1)
        return df_util.create_output_dataframe(
            y_hat=applied, nans=nans, output_names=column_names
        )

    def _make_threshold_tuple(self):
        """Updates the self._threshold type as a tuple if it is a float.
        The type of threshold is float in the old models, whereas it is tuple in the new models.
        This method is to make our models backward compatible after the changes of multiple threshold support.
        It helps us to process forward in apply when we see a model whose threshold is a float.
        """
        if self._threshold.threshold is not None and type(self._threshold.threshold) == float:
            self._threshold.threshold = (self._threshold.threshold,)
        if self._threshold.lower is not None and type(self._threshold.lower) == float:
            self._threshold.lower = (self._threshold.lower,)
        if self._threshold.upper is not None and type(self._threshold.upper) == float:
            self._threshold.upper = (self._threshold.upper,)

    def apply(self, df, options):
        mlspl_limits = options.get('mlspl_limits', {})
        params = convert_params(
            options.get('params', {}),
            strs=['dist', 'metric', 'show_options', 'exclude_dist'],
            bools=['show_density', 'full_sample', 'sample', 'supervise_split_by'],
            floats=['regul'],
            multiple_floats=['threshold', 'lower_threshold', 'upper_threshold'],
            ints=['random_state', 'max_depth', 'max_leaf_nodes', 'min_samples_leaf'],
        )

        _params = ApplyParams(
            params.get('show_density', False),
            params.get('full_sample', False),
            params.get('sample', False),
            params.get('show_options', None),
        )

        threshold = OutlierThreshold(
            params.get('threshold'),
            lower=params.get('lower_threshold'),
            upper=params.get('upper_threshold'),
        )
        self._make_threshold_tuple()
        threshold = threshold if threshold.is_specified() else self._threshold
        self._check_threshold(threshold, int(mlspl_limits.get('max_threshold_num', 5)))

        _dist = params.get('dist')
        if _dist and _dist != self._dist_type:
            msg = 'Invalid parameter for apply: Discarding "dist" value. Using dist={}.'
            cexc.messages.warn(msg.format(self._dist_type))
        _metric = params.get('metric')
        if _metric and _metric != self._metric:
            msg = 'Invalid parameter for apply: Discarding "metric" value. Using metric={}.'
            cexc.messages.warn(msg.format(self._metric))

        show_options = params.get('show_options', None)
        self._show_options_values = None
        if show_options:
            self._show_options_values = DensityFunction._get_show_options_value(
                show_options, options
            )
        X = df.copy()
        # when groups are supervised, the original feature names are stored in the tree estimator
        split_by = self.split_by
        if getattr(self, '_supervise_split_by', False):
            split_by = self._tree.feature_variables

        X, nans, _ = df_util.prepare_features(
            X=X,
            variables=self.feature_variables + (split_by or []),
            mlspl_limits=mlspl_limits,
            get_dummies=False,
        )

        if getattr(self, '_supervise_split_by', False):
            X = self._apply_groups_encoder(X)

        df_util.assert_field_present(X, self.feature_variables[0])
        self._check_target_field_is_numeric(X)
        new_name = options.get('output_name', None)

        self._warn_on_few_training_data()

        res = self._call_apply_on_probability_distribution(
            X, nans, threshold, params=_params, new_name=new_name
        )
        return df_util.merge_predictions(df, res)

    def summary(self, options):
        if self.split_by:
            # Columns of the summary are:
            # 1) Fields that were used to group data
            # 2) Parameters of the fitted distribution
            groups = defaultdict(list)
            for group in self._dist.values():
                for field, value in chain(
                    iter(group.fields.items()), iter(group.dist.summary().items())
                ):
                    groups[field].append(value)
            return pd.DataFrame({k: pd.Series(v) for k, v in groups.items()})
        else:
            return pd.DataFrame({param: [val] for param, val in self._dist.summary().items()})

    @staticmethod
    def register_codecs():
        codecs_manager.add_codec('algos.DensityFunction', 'DensityFunction', SimpleObjectCodec)
        codecs_manager.add_codec(
            'algos_support.density_function.distribution_factory',
            'AutoSelectDistribution',
            SimpleObjectCodec,
        )
        codecs_manager.add_codec(
            'algos_support.density_function.exponential_distribution',
            'ExponentialDistribution',
            SimpleObjectCodec,
        )
        codecs_manager.add_codec(
            'algos_support.density_function.kde_distribution',
            'KDEDistribution',
            SimpleObjectCodec,
        )
        codecs_manager.add_codec(
            'algos.DensityFunction', 'LabeledDistribution', SimpleObjectCodec
        )
        codecs_manager.add_codec(
            'algos_support.density_function.normal_distribution',
            'NormalDistribution',
            SimpleObjectCodec,
        )
        codecs_manager.add_codec(
            'algos_support.density_function.outlier_threshold',
            'OutlierThreshold',
            SimpleObjectCodec,
        )
        codecs_manager.add_codec(
            'algos_support.density_function.beta_distribution',
            'BetaDistribution',
            SimpleObjectCodec,
        )
        codecs_manager.add_codec(
            'algos.DecisionTreeRegressor', 'DecisionTreeRegressor', SimpleObjectCodec
        )
        codecs_manager.add_codec(
            'sklearn.tree._classes', 'DecisionTreeRegressor', SimpleObjectCodec
        )
        codecs_manager.add_codec('sklearn.tree._tree', 'Tree', TreeCodec)
