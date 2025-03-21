from collections import OrderedDict
from sklearn.impute import SimpleImputer as _Imputer

import numpy as np
import pandas as pd

from base import BaseAlgo, TransformerMixin
from codec import codecs_manager
from util.param_util import convert_params
from util.df_util import assert_any_fields, assert_any_rows, warn_on_missing_fields

import cexc


WARN_FIELDS_LIMIT = 20

messages = cexc.get_messages_logger()


def is_nan(x):
    """Check if input is "NaN".

    Args:
        x (numeric or string): any string or numeric data

    Returns:
        bool
    """
    return x is np.nan or str(x).lower() == 'nan'


def is_all_nan(series):
    """Check if series is all "NaN".

    Args:
       series (pandas.core.series.Series)

    Returns:
        bool
    """
    return series.apply(is_nan).all()


def is_any_nan(series):
    """Check if there are any "NaN" in series.

    Args:
       series (pandas.core.series.Series)

    Returns:
        bool
    """
    return series.apply(is_nan).any()


def not_missing(df, missing):
    """Return True wherever `df` values are not `missing`, else False.

    Args:
        df (pandas.DataFrame)
        missing (string or integer): value that represents missing data

    Returns:
        pandas.DataFrame: DataFrame with values that are False where
            the corresponding value in `df` is missing (i.e., matches `missing`)
            and True otherwise.
    """
    tt = type(missing)
    if tt is int:
        return df != missing
    if missing is np.NaN or (tt is str and missing.lower() == "nan"):
        return ~df.applymap(is_nan)
    # This case shouldn't happen as Imputer is currently defined:
    if tt is str:
        return ~df.applymap(lambda x: str(x) == missing)
    assert False, 'Never reach'


class Imputer(TransformerMixin, BaseAlgo):
    """Instance of Imputer algorithm to fill in missing values in data."""

    SKLEARN_STRATEGIES = ['mean', 'median', 'most_frequent']

    def __init__(self, options):
        """Initialize instance of Imputer.

        Args:
            options (dict): contains SPL arguments passed to
                `...|<fit|apply|summary> Imputer`

        Returns:
            Imputer: instance of Imputer

        Raises:
            RuntimeError:
                - Invalid value for "missing_values" parameter: must be
                integer or "NaN" (case-insensitive).
                - Invalid value for "strategy" parameter: must be one
                of ["mean", "median", "most_frequent", "field"].
        """
        valid_strategies = Imputer.SKLEARN_STRATEGIES + ['field']

        # Check that the user supplied one or more feature_variables and no
        # target_variable. If these conditions are not met, `handle_options`
        # raises an error.
        self.handle_options(options)

        # Convert parameters to the correct types for Imputer.
        params = convert_params(
            options.get('params', {}), strs=['missing_values', 'strategy', 'field']
        )

        # Check if the user supplied a valid `missing_values` (either integer
        # or 'NaN', as required by sklearn), otherwise use sklearn's default.
        self.missing_values = 'NaN'
        if 'missing_values' in params:
            params['missing_values'] = Imputer.cast_to_nan_or_int(params['missing_values'])
            self.missing_values = params['missing_values']

        # Check if the user supplied a valid `strategy`, otherwise use
        # sklearn's default strategy of "mean".
        self.strategy = params.get('strategy', 'mean')
        if self.strategy not in valid_strategies:
            err_msg = 'Invalid value for "strategy" parameter: must be one of {{{}}}.'.format(
                ', '.join(valid_strategies)
            )
            raise RuntimeError(err_msg)
        if self.strategy == 'field' and 'field' not in params:
            err_msg = 'You must specify the "field" parameter when using the "field" strategy.'
            raise RuntimeError(err_msg)

        self.field = params.get('field')
        if 'field' in params and self.strategy != 'field':
            err_msg = 'The parameter "field" can only be used with strategy="field".'
            raise RuntimeError(err_msg)

        # Store input column names and initialize Imputer. The
        # `feature_variables` attribute is also assigned in
        # `get_relevant_fields` in the FitBatchProcessor. If the instance does
        # not have the `feature_variables` attribute (e.g.,
        # `get_relevant_fields` is not run) then `feature_variables` will not
        # be updated appropriately by the processor when '*' is used (see
        # `match_and_assign_variables`).
        self.feature_variables = options['feature_variables']
        self._params = params
        self.estimator = None

    def _init_estimator_and_fix_input(self, df):
        """Initialize the estimator and modify the input
        according to the strategy"""

        # Scikit Learn does not support strategy="field", so we can't initialize
        # it with that parameter setting.
        if self.strategy not in Imputer.SKLEARN_STRATEGIES:
            return
        # If `missing_values` is a variant of NaN (i.e.,
        # np.nan, 'NaN, or 'nan' then we need to setup the
        # sklearn's SimpleImputer differently. In particular,
        # if the strategy is 'mean' or 'median', SimpleImputer
        # will convert data to float, so the passed missing_values
        # to SimpleImputer must be np.nan. If the strategy is
        # 'most_frequent' then the passed missing_values
        # must be 'nan' but since we want the SimpleImputer
        # to impute both 'nan' and 'NaN' values then
        # we need to replace 'NaN' with 'nan' in the input data.
        missing_values = self._params.get('missing_values')
        if (
            missing_values
            and missing_values is np.nan
            or (type(missing_values) == str and missing_values.lower() == 'nan')
        ):
            if self.strategy != 'most_frequent':
                self._params['missing_values'] = np.NaN
            else:
                for field in self.imputable:
                    # Replace 'NaN's with 'nan's
                    df[field].where(df[field] != 'NaN', 'nan', inplace=True)
                self._params['missing_values'] = 'nan'
        if self.estimator:
            return
        self.estimator = _Imputer(**self._params)

    @staticmethod
    def truncate_warn_fields(fields, limit=WARN_FIELDS_LIMIT, truncidx=3):
        """Cast field list to string, truncating if the length is greater than `limit`.

        Args:
            fields (list of strings): the list of fields to pring
            limit (integer): the max length to print before truncating

        Returns:
            string: list of fields as string (possibly truncated)
        """
        if len(fields) > limit:
            return ', '.join(fields[:truncidx]) + '...' + ', '.join(fields[-truncidx:])
        else:
            return ', '.join(fields)

    @staticmethod
    def cast_to_nan_or_int(val):
        """Cast input to valid "missing_values" value: "NaN" or integer.

        Args:
            val: value to cast

        Returns:
            string or integer: "NaN" or integer

        Raises:
            RuntimeError: Invalid value for "missing_values" parameter: must be
                integer or "NaN" (case-insensitive).
        """
        if val.lower() == 'nan':
            return np.NaN
        try:
            return int(val)
        except:
            err_msg = (
                'Invalid value for "missing_values" parameter:'
                ' must be integer or "NaN" (case-insensitive).'
            )
            raise RuntimeError(err_msg)

    def get_imputable_fields(self, df):
        """Return subset of input fields that can be imputed, not dropped.

        `sklearn.preprocessing.Imputer` drops columns whose values are all
        missing, or columns that contain NaN (case-insensitive "NaN" or np.nan)
        when `strategy="mean"` or `strategy="median"` and `missing_values` is
        an integer. Therefore, don't impute those, otherwise there is a
        mismatch between the number of output column names and the number of
        output columns when trying to name the output columns later.

        Args:
            self (Imputer): instance of Imputer
            df (pandas.DataFrame): the input data

        Returns:
            list: list of fields that are imputable
        """
        fields_present = [f for f in self.feature_variables if f in df.columns]
        fields_present = list(OrderedDict.fromkeys(fields_present))  # deduplicate

        # Warn about input fields that are not missing any data.
        none_missing = ~(df[fields_present] == self.missing_values).any()
        contains_nan = df[fields_present].apply(is_any_nan)
        fields_copied = df[fields_present].columns[none_missing & ~contains_nan]
        warn_fields = Imputer.truncate_warn_fields(fields_copied)
        if warn_fields:
            warn_msg = (
                'The fields {} are not missing any data. '
                'Imputed fields will be a copy.'.format(warn_fields)
            )
            messages.warn(warn_msg)

        # No fields are dropped when strategy="field".
        if self.strategy == 'field':
            return df[fields_present].columns.tolist()

        # sklearn.preprocessing.Imputer drops fields with all missing values.
        # This applies when strategy is "mean", "median", or "most_frequent".
        all_missing = (df[fields_present] == self.missing_values).all()
        all_nan = df[fields_present].apply(is_all_nan)
        cant_impute = all_missing | all_nan
        warn_fields = Imputer.truncate_warn_fields(df[fields_present].columns[cant_impute])
        if warn_fields:
            warn_msg = 'Cannot impute fields {} with strategy={}: all values missing.'.format(
                warn_fields, self.strategy
            )
            messages.warn(warn_msg)

        # sklearn.preprocessing.Imputer drops fields containing NaNs when the
        # missing_values parameter is integer and strategy is "mean" or "median".
        if isinstance(self.missing_values, int) and self.strategy in ["mean", "median"]:
            warn_fields = Imputer.truncate_warn_fields(
                df[fields_present].columns[contains_nan & ~cant_impute]
            )
            if warn_fields:
                warn_msg = (
                    'Cannot impute {}: "contains "NaN" and "missing_values" is integer.'.format(
                        warn_fields
                    )
                )
                messages.warn(warn_msg)
            cant_impute = cant_impute | contains_nan

        return df[fields_present].columns[~cant_impute].tolist()

    def _impute(self, df, fn, replacements):
        """Internal method to impute the missing values of `df`.

        This method imputes using either the `fn` (when "strategy" is "mean",
        "median", or "most_frequent") or `replacements` (when "strategy" is
        "field").  Either `fn` or `replacements` must be not None.

        `sklearn.preprocessing.Imputer` drops columns whose values are all
        missing, or columns that contain NaN (case-insensitive "NaN" or np.nan)
        when `strategy="mean"` or `strategy="median"` and `missing_values` is
        an integer.  Therefore, the DataFrame returned may be missing these
        dropped columns in these cases.

        Args:
            self (Imputer): instance of Imputer
            df (pandas.DataFrame): the input data
            fn (instancemethod): `sklearn.preprocessing.Imputer.fit` or
                `sklearn.preprocessing.Imputer.fit_transform`
            replacements (pandas.core.series.Series): the series containing the
                replacement values

        Returns:
            pandas.DataFrame: df with missing values replaced (and possibly with
                some columns dropped, see method docstring) or None (if fn and
                replacements are both None)

        Raises:
            RuntimeError: Cannot impute string data.
        """
        if fn is not None:
            try:
                return fn(df)
            except ValueError as e:  # Use a more helpful error message.
                if 'could not convert string to float' in str(e):
                    err_msg = 'Cannot impute string data.'
                    raise RuntimeError(err_msg)
                else:
                    raise e
        if replacements is not None:
            return df.where(
                not_missing(df, self.missing_values), other=replacements, axis=0
            ).values

    def _fit_or_apply(self, df, options):
        """Internal method to compute fill values and add imputed field.

        Called by `fit` or `apply`, which passes in `fn`. Then this calls `fn`,
        which should be `sklearn.preprocessing.Imputer.fit_transform` or
        `sklearn.preprocessing.Imputer.transform`.

        Args:
            df (pandas.DataFrame): the input data
            options (dict): the SPL arguments supplied to `fit`

        Returns:
            pandas.DataFrame: the original DataFrame concatenated with
                additional imputed columns
        """
        # By default, sklearn.preprocessing.Imputer makes a copy of the input
        # dataframe, so it is not necessary to make a copy to avoid overwrite.

        # The value passed to the `as` clause gets put in "output_name". If the
        # field with that name already exists (e.g., "output_name" is "") then
        # the field with that name is overwritten.
        output_prefix = options.get('output_name', 'Imputed')

        # Make sure input fields (feature_variables) are in the dataset.
        assert_any_fields(df)
        assert_any_rows(df)
        warn_on_missing_fields(df, self.feature_variables)
        fields_present = [f for f in self.feature_variables if f in df.columns]

        if self.strategy == 'field':
            if self.field not in df.columns:
                err_msg = 'Cannot impute using {}: field not present in dataset.'.format(
                    self.field
                )
                raise RuntimeError(err_msg)

        field_map = OrderedDict([(f'{output_prefix}_{f}', f) for f in fields_present])

        self.imputable = self.get_imputable_fields(df)

        self._init_estimator_and_fix_input(df)
        fn = self.estimator.fit_transform if self.estimator else None

        replacements = df[self.field] if self.field is not None else None
        if self.imputable:
            self.imputed = [k for (k, v) in field_map.items() if v in self.imputable]
            y_hat = self._impute(df[self.imputable], fn, replacements)
            y_hat = pd.DataFrame(y_hat, columns=self.imputed)

        # If the field was imputable, then the imputed version should be used.
        # Otherwise, use the original field.
        assignments = {}
        for imp, orig in field_map.items():
            if orig in self.imputable:
                assignments[imp] = y_hat[imp]
            else:  # dropped
                assignments[imp] = df[field_map[imp]]

        # This returns a copy of df with imputed fields appended.
        return df.assign(**assignments)

    def fit(self, df, options):
        """Call `fit_transform` to compute fill values and add imputed fields.

        If fields that are not in the dataset are passed in to impute, these
        are ignored. If passed-in fields are:
            - all `missing_values` or all not a number (case-insensitive "NaN"
              or all `np.nan`, or
            - contain "NaN" (case-insensitive or `np.nan`) when `strategy` is
              "mean" or "median",
        then the "imputed" versions of these fields are just copies of the
        originals, including missing values. Otherwise they are copies with
        missing values imputed.

        Args:
            df (pandas.DataFrame): the input data
            options (dict): the SPL arguments supplied to `fit`

        Returns:
            pandas.DataFrame: the original DataFrame concatenated with
                additional imputed columns
        """
        return self._fit_or_apply(df, options)

    def apply(self, df, options):
        """Call `transform` to add imputed field with pre-computed fill values.

        Assumes `fit` has already been called. See `fit` docstring for cases
        when fields are copied rather than imputed.

        Args:
            df (pandas.DataFrame): the input data
            options (dict): the SPL arguments supplied to `apply`

        Returns:
            pandas.DataFrame: the original DataFrame concatenated with
                additional imputed columns
        """
        return self._fit_or_apply(df, options)

    def summary(self, options):
        """Provide the imputation fill values for each imputed field.

        Args:
            options (dict): the SPL arguments supplied to `summary`

        Returns:
            pandas.DataFrame: contains for each input field, the name of the
                imputed field, and the imputation fill value
        """
        statistics = 'Values in {}'.format(self.field)
        if self.estimator is not None and hasattr(self.estimator, "statistics_"):
            statistics = self.estimator.statistics_
        return pd.DataFrame(
            {
                'imputable_field': self.imputable,
                'imputed_field': self.imputed,
                'imputed_value': statistics,
                'imputation_strategy': self.strategy,
            }
        )

    @staticmethod
    def register_codecs():
        from codec.codecs import SimpleObjectCodec

        codecs_manager.add_codec('algos.Imputer', 'Imputer', SimpleObjectCodec)
        codecs_manager.add_codec('sklearn.impute._base', 'SimpleImputer', SimpleObjectCodec)
