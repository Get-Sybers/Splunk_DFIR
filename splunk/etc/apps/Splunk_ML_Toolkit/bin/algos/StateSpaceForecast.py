#!/usr/bin/env python

import datetime
import importlib
from math import isnan
import re
import pandas as pd
import numpy as np

from base import BaseAlgo
from util import df_util
from util.algo_util import confidence_interval_to_alpha
from util.algo_util import alpha_to_confidence_interval
from util.param_util import convert_params
from util.time_util import HumanTime
from util.base_util import match_field_globs
from algos_support.statespace.em_kalman_models import MasterKf
import cexc

from codec import codecs_manager
from codec.codecs import BaseCodec

# pd.options.mode.chained_assignment = "raise"
# Do not delete the above comment. When uncommented, it'll catch errors pandas may raise.
# But if we leave it uncommented, things break in some parts of our codebase.

HOLIDAY_OPTION_NAME = 'specialdays'
OUTPUT_METADATA_NAME = 'output_metadata'
METADATA_FIELDNAME = '_forecastMetadata'


class KalmanModelCodec(BaseCodec):
    @classmethod
    def encode(cls, obj):
        dct = obj.encode()
        dct['__mlspl_type'] = [type(obj).__module__, type(obj).__name__]
        return dct

    @classmethod
    def decode(cls, obj):
        module_name, name = obj['__mlspl_type']
        module = importlib.import_module(module_name)
        class_ref = getattr(module, name)
        return class_ref.decode(obj)


class StateSpaceForecast(BaseAlgo):
    def __init__(self, options):
        self.get_variables(options)

        params = convert_params(
            options.get('params', {}),
            strs=[HOLIDAY_OPTION_NAME, 'time_field', 'holdback', 'forecast_k'],
            bools=['update_last', 'output_fit', OUTPUT_METADATA_NAME],
            ints=['period', 'conf_interval'],
        )
        self._assign_params(params)
        self.estimator = None
        self.is_partial_fit = False

    def _assign_params(self, params):
        self.out_params = dict(model_params=dict(), forecast_function_params=dict())

        # Default forecast_k set to zero
        self.out_params['forecast_function_params']['forecast_k'] = params.get(
            'forecast_k', '0'
        )

        if 'conf_interval' in params:
            self.out_params['forecast_function_params']['alpha'] = confidence_interval_to_alpha(
                params['conf_interval']
            )
        else:
            self.out_params['forecast_function_params'][
                'alpha'
            ] = 0.05  # the default value that statsmodels uses.

        if 'holdback' in params:
            self.holdback_str = params.pop('holdback')
        else:
            self.holdback_str = '0'

        if 'period' in params:
            self._test_period(params['period'])
            self.period = params.pop('period')
        else:
            self.period = getattr(self, 'period', 0)

        self.holiday_field = params.get(HOLIDAY_OPTION_NAME, None)

        alpha = self.out_params['forecast_function_params']['alpha']
        self.conf = 1 - alpha

        self.update_last = params.get('update_last', False)
        self.output_fit = params.get('output_fit', False)
        self.output_metadata = params.get(OUTPUT_METADATA_NAME, False)

        if 'target' in params:
            self.target = params.get("target", None)

        if not hasattr(self, 'time_field'):
            self.time_field = params.get('time_field', '_time')
            if self.time_field in self.time_series:
                raise RuntimeError('Target variables must not include time field')

    def get_variables(self, options):
        """Utility to ensure there is a feature_variables and or _time"""
        self.feature_variables = options.get('feature_variables', [])
        self.target_variable = options.get('target_variable', [])

        if len(self.target_variable) > 0:
            self.time_series = self.target_variable
        else:
            self.time_series = [v for v in self.feature_variables]

    @staticmethod
    def _test_forecast_k(x):
        if x < 0:
            raise RuntimeError(
                'forecast_k should be a non-negative integer. Found "forecast_k={}'.format(x)
            )

    @staticmethod
    def _test_holdback(x):
        if x < 0:
            raise RuntimeError(
                'holdback should be a non-negative integer. Found holdback={}'.format(x)
            )

    @staticmethod
    def _test_period(x):
        if x < 1:
            raise RuntimeError('period should be a positive integer. Found period={}'.format(x))

    @staticmethod
    def _check_missing_rows(X, timestep):
        """
        Check whether the numpy array X contains any missing row.
        Args:
        X (np.array): array containing time values in seconds
        timestep (int): time interval (seconds) between consecutive timestamp.
        """
        missing_timestamp_threshold = 1.5
        y = np.diff(X)
        missing_rows = np.where(y >= missing_timestamp_threshold * timestep)[0]

        if len(missing_rows) > 0:
            missing_time1 = datetime.datetime.fromtimestamp(X[missing_rows[0]])
            missing_time2 = datetime.datetime.fromtimestamp(X[missing_rows[0] + 1])

            if len(missing_rows) == 1:
                error_msg = (
                    'timestamps not continuous: missing row between \"{}\" and \"{}\"'.format(
                        missing_time1, missing_time2
                    )
                )
                raise ValueError(error_msg)
            else:
                missing_time3 = datetime.datetime.fromtimestamp(X[-1])
                missing_time4 = datetime.datetime.fromtimestamp(X[-1] + 1)
                error_msg = (
                    'timestamps not continuous: at least {} missing rows,'
                    ' the earliest between \"{}\" and \"{}\",'
                    ' the latest between \"{}\" and \"{}\"'.format(
                        len(missing_rows),
                        missing_time1,
                        missing_time2,
                        missing_time3,
                        missing_time4,
                    )
                )
                raise ValueError(error_msg)

    @staticmethod
    def convert_timefield_to_seconds(df, time_field):
        if time_field not in df:
            return []
        time_values = df[time_field]
        if time_values.values.dtype == object:
            try:
                return pd.to_datetime(time_values).values.astype('int64') // 1e9
            except ValueError as e:
                cexc.log_traceback()
                cexc.messages.error("Unable to parse time field {}".format(time_field))
                raise ValueError(e)
        return time_values.values

    def compute_timestep(self, df):
        """
        Calculates the dominant value of differences between two consecutive timestamps.
        Args:
        df (DataFrame): input data
        """
        self.datetime_information = dict(
            timestep=1,
            first_timestamp=None,  # number of seconds since epoch
            last_timestamp=None,
            length=len(df),
        )
        effective_length = StateSpaceForecast._compute_effective_length(df, self.time_series)
        if effective_length == 0:
            return
        self.datetime_information['length'] = effective_length

        X = self.convert_timefield_to_seconds(df, self.time_field)
        if len(X) == 0:
            return
        self.datetime_information['first_timestamp'] = X[0]
        self.datetime_information['last_timestamp'] = X[effective_length - 1]

        cands = []
        for i in range(effective_length - 1, 0, -1):
            if not isnan(X[i]) and not isnan(X[i - 1]):
                cands.append(X[i] - X[i - 1])
        candidate = np.median(cands)
        self._check_missing_rows(X, candidate)
        self.datetime_information['timestep'] = candidate
        self.datetime_information['length'] = effective_length

    @staticmethod
    def _check_for_nans(df, fields):
        """
        Args:
        df (DataFrame): check for missing values in df
        fields (list): restrict to values in these fields
        Returns:
        Nothing. We output a warning message in case there is a missing value.
        """
        for field in fields:
            if df[field].isna().any().any():
                cexc.messages.warn(
                    'Field {} contains null value(s). We will try to impute them.'.format(field)
                )
                break

    @staticmethod
    def _compute_effective_length(df, fields):
        """
        Compute the true length of the time series data given by the fields argument.
        These are the fields that we want to forecast on. They should not include the time field and
        the specialdays field.
        The effective length is computed by determining the effective end of the time series. This effective end
        is defined to be the last point such that at least one of the given fields is non-empty, and
        beyond it all of the given fields are empty.
        Note that the effectiive end may be different from the end of the data frame df, because the specialdays column
        may be longer than the time series columns. This arises if we add future specialdays to an existing data frame (in
        order to help forecast the time series.)

        Args:
        df (DataFrame): the data frame, containing time series data and probably time and specialdays columns
        fields (list): names of the time series columns

        Returns:
        (int) the effective length
        """
        non_empty_rows = df[fields].notnull().any(axis=1)
        idx = np.where(non_empty_rows)[0]
        if len(idx) > 0:
            return idx[-1] + 1
        return 0

    @staticmethod
    def _check_input_length(df, effective_length, fields, holdback, period=0):
        if effective_length > 0 and holdback >= effective_length:
            raise RuntimeError(
                'holdback value equates to too many events being withheld ({} >= {}).'.format(
                    holdback, effective_length
                )
            )

        non_nan_counts = df[fields][: effective_length - holdback].count()
        zero_idx = np.where(non_nan_counts == 0)[0]
        if len(zero_idx) > 0:
            raise RuntimeError(
                'The "{}" column is empty, due to too many missing values.'.format(
                    fields[zero_idx[0]]
                )
            )
        if (
            period > 0
        ):  # user has set the period. We make sure it is not greater than the number of non-null values in each column
            small_idx = np.where(non_nan_counts < period)[0]
            if len(small_idx) > 0:
                bad_field_idx = small_idx[0]
                raise RuntimeError(
                    'The period ({}) is greater than the number of non-null values ({}) in "{}" column'.format(
                        period, non_nan_counts[bad_field_idx], fields[bad_field_idx]
                    )
                )

    def compute_num_timesteps(self, time_anchor, time_offset, future=True):
        """
        Args:
        time_anchor (int): time from which to count. Given as number of seconds since epoch.
        time_offset (string): time offset, e.g. '3mon'
        future (bool): direction from time_anchor to count the offset. The offset is to the future if 'future' is
        True, and to the past otherwise.
        """
        timestep = HumanTime.from_seconds(self.datetime_information['timestep'])
        time_offset = HumanTime(time_offset)
        if time_offset.time_unit == '':
            return (
                time_offset.time_amount
            )  # if no time unit, time_offset must already be number of timesteps

        if time_anchor is None:
            raise RuntimeError(
                "time amount ({}) is invalid because the time field doesn't exist. Try integers instead.".format(
                    time_offset.time_str
                )
            )

        if time_offset < timestep:
            cexc.messages.warn(
                "time amount {} is less than the timestep ({})".format(
                    time_offset.time_str, timestep.time_str
                )
            )
            return 0
        time_anchor = pd.Timestamp(time_anchor * 1e9)
        end_time = HumanTime.add_offset(time_anchor, time_offset, future=future)
        freq = timestep.to_DateOffset()
        time_range = (
            pd.date_range(start=time_anchor, end=end_time, freq=freq)
            if future
            else pd.date_range(start=end_time, end=time_anchor, freq=freq)
        )
        num_timesteps = len(time_range) - 1
        return num_timesteps

    def compute_forecast_k(self, df):
        start_time = self.datetime_information['last_timestamp']
        self.out_params['forecast_function_params']['steps'] = self.compute_num_timesteps(
            start_time, self.out_params['forecast_function_params']['forecast_k']
        )

    def compute_holdback(self, df):
        end_time = self.datetime_information['last_timestamp']
        self.holdback = self.compute_num_timesteps(end_time, self.holdback_str, future=False)

    def add_output_metadata(self, df):
        if self.output_metadata:
            metadata = [None] * len(df)
            s1 = self.datetime_information['length'] - self.holdback
            holdback = s1 + self.holdback
            forecast_k = s1 + self.out_params['forecast_function_params']['steps']
            s2 = min(holdback, forecast_k)
            for i in range(s1, s2):
                metadata[i] = 'hf'
            for i in range(s2, holdback):
                metadata[i] = 'h'
            for i in range(s2, forecast_k):
                metadata[i] = 'f'
            return df.assign(**{METADATA_FIELDNAME: metadata})
        return df

    def generate_extra_time(self, df, effective_length, output, output_start):
        if self.time_field not in df or self.datetime_information['last_timestamp'] is None:
            return
        forecast_k = HumanTime(self.out_params['forecast_function_params']['forecast_k'])
        steps = self.out_params['forecast_function_params']['steps']
        if len(df) >= effective_length - self.holdback + steps:  # no extra time needed
            return
        existing_time = df[self.time_field][output_start:]
        timestep = HumanTime.from_seconds(self.datetime_information['timestep'])
        start_time = pd.Timestamp(self.datetime_information['last_timestamp'] * 1e9)
        freq = timestep.to_DateOffset()
        end_time = (
            HumanTime.add_offset(start_time, forecast_k)
            if forecast_k.time_unit
            else start_time + (forecast_k.time_amount * freq)
        )
        extra_time = pd.date_range(start=start_time, end=end_time, freq=freq)
        if self.time_field == '_time':
            try:
                extra_time = (extra_time.values.astype('int64') // 1e9)[
                    len(df) - effective_length + 1 : steps - self.holdback + 1
                ]
            except Exception as e:
                cexc.messages.error("'_time' column contains non-integer values")
                cexc.log_traceback()
                raise ValueError(e)
        else:
            extra_time = list(extra_time)[
                len(df) - effective_length + 1 : steps - self.holdback + 1
            ]

        output[self.time_field] = np.append(existing_time, extra_time)

    def _fit(self, df):
        if self.holiday_field and self.holiday_field not in self.feature_variables:
            self.feature_variables.append(self.holiday_field)
        if self.time_field in df.columns and self.time_field not in self.feature_variables:
            self.feature_variables.append(self.time_field)

        self.used_variables = (
            self.feature_variables + [self.target_variable]
            if (self.target_variable is not None and len(self.target_variable) > 0)
            else self.feature_variables
        )
        self.used_variables = match_field_globs(df.columns, self.used_variables)
        for variable in self.used_variables:
            df_util.assert_field_present(df, variable)
        df_util.assert_any_fields(df)
        df_util.assert_any_rows(df)

        holiday = df[self.holiday_field].values if self.holiday_field else None
        target = df[: self.datetime_information['length'] - self.holdback][
            self.time_series
        ].values

        self._check_for_nans(df, self.time_series)

        if target.dtype == object:
            raise ValueError(
                '{} contains non-numeric data. {} only accepts numeric data.'.format(
                    self.time_series, self.__class__.__name__
                )
            )
        target = target.astype(float)

        if holiday is not None:
            try:
                holiday = np.nan_to_num(holiday).astype(float)
            except Exception:
                raise ValueError(
                    '{} contains non-numeric data. {} only accepts numeric data.'.format(
                        self.holiday_field, self.__class__.__name__
                    )
                )

        steps = self.out_params['forecast_function_params']['steps']
        try:
            if holiday is not None and ((len(target) + steps) > len(holiday)):
                cexc.messages.warn(
                    "{} field does not have enough values to forecast."
                    "Will append 0 for extra values.".format(HOLIDAY_OPTION_NAME)
                )
                holiday = np.append(holiday, np.zeros(len(target) + steps - len(holiday)))

            res = None
            self.target = None
            self.holiday = None
            if self.estimator is None:
                self.estimator = MasterKf(target, exog=holiday, period=self.period)
                res = self.estimator.fit(forecast_k=steps, conf=self.conf)
            elif not self.update_last:
                res = self.estimator.fit(
                    endog=target, exog=holiday, forecast_k=steps, conf=self.conf
                )
            else:
                res = self.estimator.apply(
                    endog=target, exog=holiday, forecast_k=steps, conf=self.conf
                )
                self.target = target
                self.holiday = holiday

            return res

        except ValueError as e:
            cexc.log_traceback()
            raise ValueError(e)
        except Exception as e:
            cexc.log_traceback()
            raise RuntimeError(e)

    def fit(self, df, options=None):
        self.time_series = match_field_globs(df.columns, self.time_series)
        self.time_series = df_util.remove_duplicates(self.time_series)

        self.compute_timestep(df)
        self.compute_forecast_k(df)
        self.compute_holdback(df)
        self._check_input_length(
            df,
            self.datetime_information['length'],
            self.time_series,
            self.holdback,
            self.period,
        )

        res = self._fit(df)
        if res is None:
            return df

        # Copy variables in self.feature_variables to options so that
        # they will be loaded by |apply. If we don't do this, |apply
        # won't know about the extra feature variables we added in _fit().
        for var in self.feature_variables:
            if var not in options['feature_variables']:
                options['feature_variables'].append(var)

        steps = self.out_params['forecast_function_params']['steps']

        output_names = ['predicted({})'.format(n) for n in self.time_series]
        alias = options.get('output_name', None)
        if alias:
            alias = re.split(r'[\,\s]+', alias)
            output_names[: len(alias)] = alias

        alpha = self.out_params['forecast_function_params']['alpha']
        lower_names = [
            'lower{}({})'.format(alpha_to_confidence_interval(alpha), n) for n in output_names
        ]
        upper_names = [
            'upper{}({})'.format(alpha_to_confidence_interval(alpha), n) for n in output_names
        ]

        output_start = 0
        conf_start = (
            0 if self.output_fit else self.datetime_information['length'] - self.holdback
        )

        columns = []
        for i in range(len(self.time_series)):
            columns.extend(
                (self.time_series[i], output_names[i], upper_names[i], lower_names[i])
            )
        output = pd.DataFrame(
            columns=columns,
            index=range(
                output_start, self.datetime_information['length'] - self.holdback + steps
            ),
        )
        for i in range(len(output_names)):
            output[output_names[i]] = res.pred[output_start:, i].flatten()
            output.loc[conf_start:, upper_names[i]] = res.upper[conf_start:, i].flatten()
            output.loc[conf_start:, lower_names[i]] = res.lower[conf_start:, i].flatten()

        self.generate_extra_time(df, self.datetime_information['length'], output, output_start)

        extra_columns = set(output.columns).difference(df)
        for col in extra_columns:
            df.loc[:, col] = np.nan
        df = df.combine_first(output)
        df = self.add_output_metadata(df)
        return df

    '''
    Important note: if partial_fit() is called, apply() will always be called next.
    '''

    def partial_fit(self, df, options):
        """
        One of the paramaters is 'update_last'. Its purpose is to tell the model to forecast on the new data,
        and then update the model. This is opposite the usual behavior of parital_fit, which is to update the model
        and then forecast.
        """
        params = convert_params(
            options.get('params', {}),
            strs=[HOLIDAY_OPTION_NAME, 'time_field', 'forecast_k', 'holdback'],
            bools=['update_last', 'output_fit'],
            ints=['period', 'conf_interval'],
        )
        self.update_last = params.get("update_last", False)
        self.df_new = self.fit(df, options)
        self.is_partial_fit = True

    def _apply(self, df, out_params):
        steps = out_params["steps"]
        if steps <= 0:
            return df, None, None
        alpha = out_params["alpha"]

        if self.period == 0:
            self.period = self.estimator.period
        elif self.period != self.estimator.period:
            raise RuntimeError(
                'The period {} is different from the one obtained from |fit ({})'.format(
                    self.period, self.estimator.period
                )
            )

        if (
            self.time_field in df
            and self.period > 1
            and self.datetime_information['timestep'] is not None
            and self.datetime_information['first_timestamp'] is not None
            and self.datetime_information['last_timestamp'] is not None
        ):
            time_values = self.convert_timefield_to_seconds(df, self.time_field)
            timestep = self.datetime_information['timestep']
            self._check_missing_rows(time_values, timestep)

            cur_first_timestamp = time_values[0]
            start_model = (
                cur_first_timestamp - self.datetime_information['first_timestamp']
            ) / timestep
            start_model = int(start_model) % self.period
        else:
            start_model = 0

        effective_length = StateSpaceForecast._compute_effective_length(df, self.time_series)
        if effective_length == 0:
            return df, None, None
        self._check_input_length(df, effective_length, self.time_series, self.holdback)
        X = df[self.time_series][: effective_length - self.holdback].values
        if X.dtype == object:
            raise ValueError(
                '{} contains non-numeric data. {} only accepts numeric data.'.format(
                    self.time_series, self.__class__.__name__
                )
            )
        X = X.astype(float)

        targets = None
        if self.target:
            targets = re.split(r'[\,\s]+', self.target)
            for t in targets:
                if t not in df:
                    raise Exception(
                        "Field {} not present. Did you include it during |fit?".format(t)
                    )
            output_names = ['predicted({})'.format(t) for t in targets]
            X2 = df[self.time_series][len(X) :].copy()
            X2[targets] = np.nan
            X2 = X2.values.astype(float)
        else:
            output_names = ['predicted({})'.format(t) for t in self.time_series]
            X2 = None
        lower_names = [
            'lower{}({})'.format(alpha_to_confidence_interval(alpha), n) for n in output_names
        ]
        upper_names = [
            'upper{}({})'.format(alpha_to_confidence_interval(alpha), n) for n in output_names
        ]

        if self.holiday_field:
            if not self.estimator.with_holiday or self.holiday_field not in df:
                raise Exception(
                    "Field {} not present. This is probably because you forgot to specify \
                                {}={} during fit".format(
                        self.holiday_field, HOLIDAY_OPTION_NAME, self.holiday_field
                    )
                )
            holiday = df[self.holiday_field].values
            try:
                exog = np.nan_to_num(holiday).astype(float)
            except Exception:
                raise ValueError(
                    '{} contains non-numeric data. {} only accepts numeric data.'.format(
                        self.holiday_field, self.__class__.__name__
                    )
                )

            if len(exog) < len(X) + steps:
                cexc.messages.warn(
                    "{} field does not have enough values to forecast."
                    " Will append 0 for extra values.".format(HOLIDAY_OPTION_NAME)
                )
                exog = np.append(exog, np.zeros(steps + len(X) - len(exog)))
            res = self.estimator.apply(
                X,
                endog2=X2,
                forecast_k=steps,
                exog=exog,
                start_model=start_model,
                conf=1 - alpha,
            )
        else:
            res = self.estimator.apply(
                X, endog2=X2, forecast_k=steps, start_model=start_model, conf=1 - alpha
            )
            holiday = None

        output_start = len(X)
        output = pd.DataFrame(index=range(output_start, len(res)))
        if targets:
            for i in range(len(self.time_series)):
                if self.time_series[i] in targets:
                    j = targets.index(self.time_series[i])
                    output[output_names[j]] = res.pred[output_start:, i].flatten()
                    output[upper_names[j]] = res.upper[output_start:, i].flatten()
                    output[lower_names[j]] = res.lower[output_start:, i].flatten()
        else:
            for i in range(len(output_names)):
                output[output_names[i]] = res.pred[output_start:, i].flatten()
                output[upper_names[i]] = res.upper[output_start:, i].flatten()
                output[lower_names[i]] = res.lower[output_start:, i].flatten()

        self.generate_extra_time(df, effective_length, output, output_start)

        extra_columns = set(output.columns).difference(df)
        for col in extra_columns:
            df[col] = np.nan
        df = df.combine_first(output)
        return df, X, holiday

    def apply(self, df, options=None):
        if self.is_partial_fit:
            if self.update_last and self.target is not None:
                self.estimator.fit(endog=self.target, exog=self.holiday)
                # reset self.target and self.holiday to None since they are nolonger needed
                self.target = None
                self.holiday = None
            df_new = self.df_new
            self.df_new = None
            self.is_partial_fit = False
            return df_new

        params = convert_params(
            options.get('params', {}),
            strs=[HOLIDAY_OPTION_NAME, 'time_field', 'target', 'forecast_k', 'holdback'],
            bools=['update_last', OUTPUT_METADATA_NAME],
            ints=['period', 'conf_interval'],
        )
        self._assign_params(params)
        self.compute_forecast_k(df)
        self.compute_holdback(df)

        df, X, holiday = self._apply(df, self.out_params['forecast_function_params'])
        df = self.add_output_metadata(df)
        df = df.sort_index(ascending=True)
        return df

    def summary(self, options):
        if len(options) != 2:
            msg = '"{}" models do not take options for summarization'.format(
                self.__class__.__name__
            )
            raise RuntimeError(msg)

        period = self.estimator.period
        if period == 0:
            period = "None"
        df = pd.DataFrame(
            {
                '{} Summary'.format(self.__class__.__name__): [
                    'time series used for training: {}'.format(self.time_series),
                    '{} field: {}'.format(HOLIDAY_OPTION_NAME, self.holiday_field),
                    'periodicity: {}'.format(period),
                ]
            }
        )
        return df

    @staticmethod
    def register_codecs():
        from codec.codecs import SimpleObjectCodec

        codecs_manager.add_codec(
            'algos.StateSpaceForecast', 'StateSpaceForecast', SimpleObjectCodec
        )
        codecs_manager.add_codec(
            'algos_support.statespace.em_kalman_models', 'LinearKf', KalmanModelCodec
        )
        codecs_manager.add_codec(
            'algos_support.statespace.em_kalman_models', 'PeriodicKf', KalmanModelCodec
        )
        codecs_manager.add_codec(
            'algos_support.statespace.em_kalman_models', 'PeriodicKf2', KalmanModelCodec
        )
        codecs_manager.add_codec(
            'algos_support.statespace.em_kalman_models', 'MasterKf', KalmanModelCodec
        )
