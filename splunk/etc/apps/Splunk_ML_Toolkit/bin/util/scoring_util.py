# !/usr/bin/env python
import importlib
from collections import OrderedDict

import numpy as np
import pandas as pd

import cexc
from .constants import HOWTO_CONFIGURE_MLSPL_LIMITS
from .df_util import assert_field_present, drop_unused_and_missing, assert_any_rows
from util.base_util import match_field_globs

messages = cexc.get_messages_logger()


#############################
# Common scoring utilities  #
#############################
def load_scoring_function(module_name, function_name):
    """Load the scoring function from correct module.

    Args:
        module_name (str): name of the module containing scoring function
        function_name (str): name of the scoring function to load

    Returns:
        scoring_function (function): scoring function loaded from module
    """
    try:
        scoring_module = importlib.import_module(module_name)
        scoring_function = getattr(scoring_module, function_name)
    except (ImportError, AttributeError):
        cexc.log_traceback()
        err_msg = (
            'Could not load scoring method "{}" -- double check that the '
            'method exists and is properly configured.)'.format(function_name)
        )
        raise RuntimeError(err_msg)
    return scoring_function


def warn_multiclass_series(series, msg=None):
    """Warns if the cardinality of the series is > 2.

    Args:
        series (pd.series): input series
        msg (str): Custom warning to raise if cardinality > 2

    Warns:
        Warns that the field is not binary
    """
    series_cardinality = series.nunique()
    if msg is None:
        msg = 'Expected field "{}" to be binary, but found {} classes.'.format(
            series.name, series_cardinality
        )
    if series_cardinality > 2:
        cexc.messages.warn(msg)


def convert_df_to_true_binary(df, pos_label):
    """Converts df fields to true-binary fields in {0, 1}/{-1, 1}.

    - converts df to true-binary with positive label "pos_label", inplace
    - applies to both multiclass and binary fields
    - data is assumed to be integer or string-type (no floats)

    Args:
        df (pd.dataframe): input dataframe
        pos_label (str or int): value to set as true-binary-positive (eg. 1)

    Returns:
        df (pd.dataframe): original df with data contained in
            fields converted to true-binary inplace
    """

    # Check if field values are already in true-binary form.
    # If not, update the specified fields of df with true-binary data.
    for j, (f_name, series) in enumerate(df.items()):
        classes_set = set(series.unique())
        if not (classes_set == {0, 1} or classes_set == {-1, 1}):
            # Create a binary mask; pos_label represented as positive; all other classes as negative
            positive_mask = series == pos_label
            df.iloc[:, j] = positive_mask.astype(int)  # Modify series inplace
    return df


def series_type_is_numeric(series):
    """Check if the given field is numeric.

    Args:
        series (pd.series): input series

    Returns:
        bool: whether series is numeric or not
    """
    return series.dtype.kind in ['i', 'u', 'f', 'c']


def series_is_float(series):
    """Checks whether a series is best defined as float-type.

    Args:
        series (pd.series): input series

    Returns:
        True if series can be cast as numeric and is not representable
            by integers, otherwise False.
    """
    try:
        float_series = series.astype(float)
        int_series = float_series.astype(int)
        if np.isclose(float_series, int_series, rtol=0.001, equal_nan=True).all():
            # If float-series is the same as int-series, assume it's natively int
            return False
        else:
            # Series cannot be cast as int
            return True
    except ValueError:
        return False


def get_union_of_field_values(actual_df, predicted_df):
    """Gets the union of values from each field.

    - Sorts output alphabetically to ensure consistency.
    - Converts elements to string.

    Args:
        actual_df (pd.DataFrame): actual dataframe
        predicted_df (list or None): predicted dataframe

    Return:
        all_classes (list): all classes variables from the union
            of actual and predicted dataframes. Sorted lexicographically.
    """
    # Get all unique classes in actual_df and predicted_df
    actual_classes = np.unique(actual_df.values.astype(str))
    predicted_classes = np.unique(predicted_df.values.astype(str))
    all_classes = np.unique(np.concatenate((actual_classes, predicted_classes)))
    all_classes = list(np.sort(all_classes))
    return all_classes


def add_default_params(params, default_params_dict):
    """ " Updates params with default params.

    Args:
        params (dict): params dict
        default_params_dict (dict): default parameters to update params with

    Returns:
        params (dict): updated params dict with defaults
    """
    for k, v in default_params_dict.items():
        params.setdefault(k, v)
    return params


def assert_nonempty_arrays(
    a_array, b_array=None, a_array_alias='a_array', b_array_alias='b_array'
):
    """Checks whether arrays have 1 or more column.

    Args:
        a_array (np.array or pd.dataframe): input a_array
        b_array (np.array, pd.dataframe or None): input b_array.
            If None, only checks a_array
        a_array_alias (str): identifier of "a_array" in error message
        b_array_alias (str): identifier of "b_array" in error message

    Raises:
        RuntimeError if a_array (b_array, if not None) have no columns.
    """
    if b_array is None:
        if a_array.size == 0:
            raise RuntimeError(
                'Value error: No valid numerical fields exist for scoring method.'
            )
    else:
        msg = 'Value error: arrays cannot be empty. No valid numerical fields exist to populate {}.'
        if a_array.size == 0:
            raise RuntimeError(msg.format(a_array_alias))
        elif b_array.size == 0:
            raise RuntimeError(msg.format(b_array_alias))


def warn_on_num_samples(df, n):
    """Warns if the number of samples is lower than specified.

    Currently message only applies for normal approximation.

    Params:
        df (pd.dataframe): the prepared input dataframe
        n (int): required number of samples to not produce warning

    Warns:
        Warns that number of samples found is less than specified.
    """
    if len(df) < n:
        msg = 'Number of samples found ({}) < {}, resulting in poor results since the normal approximation is used.'
        cexc.messages.warn(msg.format(len(df), n))


def warn_on_same_fields(a_fields, b_fields=None):
    """Warn that the same field is being compared.

    Checks whether there are duplicates between a_fields and b_fields.
    If b_fields is None, then looks for duplicates only in a_fields.


    - When b_fields is given, assumes a_fields and b_fields either
      have the same number of elements (pairwise comparison), or either
      a_field or b_field has a single element (broadcasting)

    Args:
        a_fields (list of str): fields comprising a_array
        b_fields (list of str): fields comprising b_array

    Warns:
        Warns if there are duplicates.
    """
    if b_fields:
        assert (len(a_fields) == len(b_fields)) or (len(a_fields) == 1)
    msg = (
        'Found duplicate field(s): {}. Comparing the same fields can '
        'result in ambiguous output for some scoring methods.'
    )

    if b_fields is None:
        unique_fields = list({}.fromkeys(a_fields).keys())
        duplicate_fields = [i for i in unique_fields if a_fields.count(i) > 1]
    else:
        if len(a_fields) == len(b_fields):
            # Looking for duplicate fields pairwise between arrays
            duplicate_fields = [
                a_fields[i] for i in range(len(a_fields)) if a_fields[i] == b_fields[i]
            ]
        else:
            # Looking for duplicate fields when broadcasting
            duplicate_fields = list(set(a_fields).intersection(set(b_fields)))
    if len(duplicate_fields) > 0:
        cexc.messages.warn(msg.format(', '.join(duplicate_fields)))


def validate_param_from_str_list(params, param_name, acceptable_values):
    """Asserts that param value is in acceptable_values.

    If param value is 'None', converts to None type and updates params.
    Method only applies when acceptable_values is a list of strings.

    Args:
        params (dict): input parameters
        param_name (str): name of param. Must be a key in params.
        acceptable_values (list of str): valid values for the parameter

    Returns:
        params (dict): updated params (value is lowered/converted to None-type)
    """
    param_value = params[param_name].lower()
    if param_value not in acceptable_values:
        msg = 'Value error: parameter "{}" must be one of: "{}". Found "{}={}".'
        messages.error(
            msg.format(param_name, ', '.join(acceptable_values), param_name, param_value)
        )
        raise RuntimeError('Invalid value for parameter "{}".'.format(param_name))
    elif 'none' in acceptable_values and param_value == 'none':
        param_value = None
    params[param_name] = param_value  # lower or None
    return params


def drop_categorical_fields_and_warn(df, requested_fields=None):
    """Drop categorical fields from data and warn on their removal

    Args:
        df (pd.dataframe): input dataframe
        requested_fields (list or None): desired fields; others are dropped.
            If None, defaults to all dataframe fields.

    Returns:
        used_numeric_df (pd.dataframe): original data with dropped
            categorical fields
    """
    if requested_fields is None:
        requested_fields = df.columns.tolist()
    # Get the names of all non-numeric df fields (including datetime, categorical, boolean, etc.)
    scols = [f for (f, series) in df.items() if not series_type_is_numeric(series)]
    # Get the intersection of requested fields and categorical fields -- warn that these fields are being dropped
    requested_categorical_fields = [i for i in requested_fields if i in scols]
    if len(requested_categorical_fields) > 0:
        cexc.messages.warn(
            'Dropping categorical fields: {}.'.format(', '.join(requested_categorical_fields))
        )

    requested_numeric_fields = [i for i in requested_fields if i not in scols]
    used_numeric_df = df[requested_numeric_fields]
    return used_numeric_df


def remove_nans_and_warn(df, requested_fields):
    """Remove nan rows from df; warn on percent removed

    Args:
        df (pd.dataframe): input dataframe
        requested_fields: required fields

    Returns:
        clean_df (pd.dataframe): dataframe with removed nans
        nans (np.array):  boolean array to indicate which rows have missing
            values in the original dataframe
    """
    n_rows_original = len(df)
    clean_df, nans = drop_unused_and_missing(df, requested_fields)
    total_nan = nans.sum().sum()
    if total_nan > 0:
        cexc.messages.warn(
            'Removed {} rows containing missing values ({} % of original '
            'data.)'.format(total_nan, round(float(total_nan) / n_rows_original * 100, 3))
        )
    assert_any_rows(clean_df)
    return clean_df, nans


def check_fields_one_array(fields, scoring_name):
    """Remove the duplicated fields and validate for single array

    Args:
        fields (list): field names to be removed and checked
        scoring_name (str): name of scoring function

    Returns:
        fields (list): list containing non-duplicate fields

    Raises:
        RuntimeError if after duplication removal there are no fields left in the fields list.
    """
    fields = remove_duplicate_fields_and_warn(fields)
    if len(fields) == 0:
        msg = 'Syntax error: expected " | score {} <field_1> <field_2> ... <field_n>."'
        raise RuntimeError(msg.format(scoring_name))
    return fields


def check_fields_single_field_one_array(fields, scoring_name):
    """Validate for single field array

    Args:
        fields (list): field names list to be checked
        scoring_name (str): name of scoring function

    Returns:
        fields (list): list containing field names

    Raises:
        RuntimeError if the number of fields is not one.
    """
    len_fields = len(fields)
    if len_fields != 1:
        msg = (
            'Value error: scoring method "{}" operates on a single field as input specified as '
            '".. | score {} <field> [options] ". Found {} passed fields.'
        )
        raise RuntimeError(msg.format(scoring_name, scoring_name, len_fields))
    return fields


def get_and_check_fields_two_1d_arrays(
    options, scoring_name, a_field_alias='a_field', b_field_alias='b_field'
):
    """Get fields from options and validate for 1d comparisons of a_array and b_array.

    Args:
        options (dict): scoring options
        scoring_name (str): name of scoring function
        a_field_alias (str): alias of a_field to use in error message
        b_field_alias (str): alias of b_field to use in error message

    Returns:
        a_fields (list): list containing the field corresponding to a_array
        b_fields (list): list containing the field corresponding to b_array

    Raises:
        RuntimeError if not exactly 1 field passed for a_array and b_array
    """
    a_fields = options.get('a_variables', [])
    b_fields = options.get('b_variables', [])

    if len(a_fields) != 1 or len(b_fields) != 1:
        msg = 'Syntax error: expected " | score {} <{}> against <{}>"'
        raise RuntimeError(msg.format(scoring_name, a_field_alias, b_field_alias))
    return a_fields, b_fields


def get_and_check_fields_two_2d_arrays(
    df, a_fields, b_fields, scoring_name, a_field_alias='a_field', b_field_alias='b_field'
):
    """Get fields from options and validate for 2d comparisons of a_array and b_array.

    Args:
        df(pd.DataFrame): input dataframe
        a_fields (list): list containing the field corresponding to a_array
        b_fields (list): list containing the field corresponding to b_array, might include *
        scoring_name (str): name of scoring function
        a_field_alias (str): alias of a_field to use in error message
        b_field_alias (str): alias of b_field to use in error message

    Returns:
        a_fields (list): list containing the field corresponding to a_array
        b_fields (list): list containing the field corresponding to b_array (updated if * exists)

    Raises:
        RuntimeError if:
            - either a_array or b_array is empty
            - The arrays don't have the same shape and neither array
              has only a single column (broadcasting)
    """
    n1, n2 = len(a_fields), len(b_fields)
    # Since the order of the field names is important for n-to-n field cases for non-single array scoring methods,
    # We support glob only for 1-to-n field cases for these scoring methods:
    # classification, regression, clustering and statstest
    if n1 == 1:
        b_fields = match_field_globs(list(df.columns), b_fields)
    # empty arrays or 1) not the same shape and 2) not broadcasting
    if (n1 == 0 or n2 == 0) or (n1 != n2 and n1 != 1):
        msg = (
            'Syntax error: expected " | score {scoring_name} <{a_field_alias}_1> ... <{a_field_alias}_n> '
            'against <{b_field_alias}_1> ... <{b_field_alias}_n>"'
        )

        raise RuntimeError(
            msg.format(
                scoring_name=scoring_name,
                a_field_alias=a_field_alias,
                b_field_alias=b_field_alias,
            )
        )
    return a_fields, b_fields


def assert_numeric_type_df(df):
    """Asserts that all df columns are of numeric type.

    - Note that if we want to check for numeric data cast
      as string-type, we should use "series_is_float"

    Args:
        df (pd.dataframe): input dataframe

    Raises:
        RuntimeError if the df contains non-numeric-type fields
    """

    non_numeric_fields = [f for (f, series) in df.items() if not series_type_is_numeric(series)]
    if len(non_numeric_fields) > 0:
        msg = 'Non-numeric fields found in the data: "{}". Please provide only numerical fields'
        raise RuntimeError(msg.format(', '.join(non_numeric_fields)))


def remove_duplicate_fields_and_warn(fields):
    """Remove duplicate fields, preserving original order. Warn on removal.

    Args:
        fields (list): requested fields

    Returns:
        fields (list): fields with duplicated removed
    """
    # Get ordered set; warn on removal
    duplicates = list(OrderedDict.fromkeys([i for i in fields if fields.count(i) > 1]).keys())
    if len(duplicates) > 0:
        cexc.messages.warn('Removing duplicate fields: {}.'.format(', '.join(duplicates)))
    fields = list(OrderedDict.fromkeys(fields).keys())
    return fields


def replicate_1d_array_to_nd(array, num_replicate):
    """Expand an (m,1) array into an (m, num_replicate) of column-copies

    Args:
        array (numpy array): (m,1) numpy array
        num_replicate (int): the number of how many times the array's column is going to be replicated

    Returns:
        replicated_array (numpy array): num_replicate times replicated version of (m,1) numpy array
    """
    m1, n1 = array.shape
    if n1 == 1:
        replicated_array = np.repeat(array, num_replicate, axis=1)
    else:
        msg = "The input array does not have a single field. Please provide a single field."
        raise RuntimeError(msg)
    return replicated_array


def get_field_identifiers(a_df, label_a, b_df=None, label_b=None):
    """Get event identifiers for one or two dataframes.

    - Create the dictionary structure:
        {
            <label_a>: a_df.columns,
            <label_b>: b_df.columns
        }
      If b_df is None, only create identifiers for a_df.

    - If b_df is given, warn if the paired fields of a_df and b_df are equal

    Args:
        a_df (pd.dataframe): The df corresponding to a_fields
        label_a (str): the name of the identifying field for a_fields
        b_df (pd.dataframe): The df corresponding to b_fields
        label_b (str): the name of the identifying field for a_fields

    Returns:
        identifiers (dict): Dictionary containing fields of a_df/b_df
            under the headings label_a/label_b.
    """
    a_fields = a_df.columns.tolist()
    b_fields = b_df.columns.tolist() if b_df is not None else None

    if b_fields is not None and len(b_fields) > len(a_fields):
        # Broadcasting situation; duplicate a_fields len(b_fields) times
        a_fields *= len(b_fields)

    identifiers = {label_a: a_fields}

    if b_fields:
        identifiers.update({label_b: b_fields})
        # Warn if a field is being compared with itself
        warn_on_same_fields(a_fields, b_fields)

    return identifiers


####################################
# Classification scoring utilities #
####################################
def prepare_classification_scoring_data(
    df, actual_fields, predicted_fields, mlspl_limits=None, limit_predicted_fields=True
):
    """Prepare classification scoring data.

    - Assumes the length of actual_fields equals the length of predicted_fields
        (pairwise), or the length of actual_fields is 1 (broadcasting)

    This method defines conventional steps to prepare features:
        - drop unused columns
        - drop rows that have missing values
        - asserts ground-truth/predicted fields have reasonable cardinality

    Args:
        df (pd.dataframe): input dataframe
        actual_fields (list): ground-truth field names
        predicted_fields (list): predicted field names
        mlspl_limits (dict): a dictionary containing values from mlspl conf
        limit_predicted_fields (bool): whether or not to check cardinality
            of the predicted fields

    Returns:
        actual_df (pd.dataframe): prepared ground-truth classification-scoring data
             of shape mx1 or mxn
        predicted_df (pd.dataframe): prepared predicted classification-scoring data
             of shape mxn
    """
    all_fields = actual_fields + predicted_fields
    for f in all_fields:
        assert_field_present(df, f)

    # Remove all nans and warn on their removal;  Remove duplicates in fields
    df, nans = remove_nans_and_warn(df, list(set(all_fields)))

    if mlspl_limits is None:
        mlspl_limits = {}

    cardinality_error_msg = (
        'Value error: cardinality of {} field "{}" exceeds limit of {}. '
        + HOWTO_CONFIGURE_MLSPL_LIMITS
    )
    max_distinct_cat_values = int(mlspl_limits.get('max_distinct_cat_values_for_scoring', 100))
    # Check that the cardinality of actual fields is within limits (note that df[list] always returns dataframe)
    for f_a, series_a in df[list(set(actual_fields))].items():
        if series_a.nunique() > max_distinct_cat_values:
            raise RuntimeError(
                cardinality_error_msg.format('actual', f_a, max_distinct_cat_values)
            )

    # If applicable, Check that the cardinality of predicted fields is within limits
    if limit_predicted_fields:
        for f_p, series_p in df[list(set(predicted_fields))].items():
            if series_p.nunique() > max_distinct_cat_values:
                raise RuntimeError(
                    cardinality_error_msg.format('predicted', f_p, max_distinct_cat_values)
                )

    # Get the actual_df and predicted_df (note that broadcasting of actual_df is done later, if applicable)
    actual_df = df[actual_fields]
    predicted_df = df[predicted_fields]
    assert_nonempty_arrays(
        actual_df, predicted_df, a_array_alias='actual_array', b_array_alias='predicted_array'
    )
    return actual_df, predicted_df


def assert_pos_label_in_series(series, pos_label, default_pos_label='1'):
    """Assert that the pos_label parameter is present in df[field].

    Note that in classification methods, actual and predicted data
    is cast to categorical type prior to calling this method, and so
    pos_label is always a string.

    Args:
        series (pd.series): input series
        pos_label (str): string-type pos_label value
        default_pos_label (str): value to check for

    Raises:
        RuntimeError if pos_label not found in series
    """
    if series[series.isin([pos_label])].empty:
        msg = (
            'Value error: {} for pos_label not found in actual field "{}". '
            'Please specify a valid value for pos_label'
        )
        if pos_label == default_pos_label:
            raise RuntimeError(
                msg.format('default value "{}"'.format(default_pos_label), series.name)
            )
        else:
            raise RuntimeError(msg.format('value "{}"'.format(pos_label), series.name))


def assert_numeric_proba(predicted_df):
    """Assert each field of predicted_df is of numeric-type.

    Used for roc_curve and roc_auc_score to assert
    that the predicted fields are numeric (corresponding to
    probability estimates or confidence intervals, etc.)

    Args:
        predicted_df (pd.dataframe): predicted classification-scoring data

    Raises:
        RuntimeError if any field in predicted_df is not numeric.
    """
    error_msg = (
        'Expected field "{}" to be numeric and correspond to probability estimates or confidence intervals '
        'of the positive class, but field contains non-numeric events.'
    )
    for f_name, series in predicted_df.items():
        if not series_type_is_numeric(series):
            raise RuntimeError(error_msg.format(f_name))


def check_class_intersection(actual_df, predicted_df):
    """Checks class intersection between predicted and actual fields

    Warns if there is no intersection/partial intersection between
        class labels. Assumes that actual_df and predicted_df either
        have the same number of columns (pairwise), or actual_df has
        a single column (broadcasting)

    Args:
        actual_df (pd.dataframe): preprocessed actual data
        predicted_df (pd.dataframe): preprocessed predicted data

    Raises:
        Warning that there is no/partial intersection, if applicable.
    """
    no_intersection_msg = (
        'There are no common classes between predicted ({}) and actual ({}) fields. '
        'Please ensure the fields are properly identified.'
    )

    partial_intersection_msg = "The predicted ({}) and actual ({}) classes don't fully overlap."

    if actual_df.shape[1] == 1 and actual_df.shape != predicted_df.shape:
        _actual_df = pd.concat(
            [actual_df] * predicted_df.shape[1], axis=1
        )  # Replicate for zipping
    else:
        _actual_df = actual_df

    # Iterate over the columns of actual/predicted dataframes; check the intersection of values
    for (f_a, s_a), (f_p, s_p) in zip(iter(_actual_df.items()), iter(predicted_df.items())):
        actual_set, predicted_set = set(s_a.values), set(s_p.values)
        intersection = actual_set.intersection(predicted_set)

        # No intersection
        if len(intersection) == 0:
            cexc.messages.warn(no_intersection_msg.format(f_p, f_a))

        # Partial intersection
        elif actual_set != predicted_set:
            not_in_predicted = actual_set.difference(predicted_set)
            if len(not_in_predicted) > 0:
                append_msg = (
                    ' actual field "{}" contains {} classes not in predicted field "{}".'
                )
                partial_intersection_msg += append_msg.format(f_a, len(not_in_predicted), f_p)

            not_in_actual = predicted_set.difference(actual_set)
            if len(not_in_actual) > 0:
                append_msg = (
                    ' Predicted field "{}" contains {} classes not in actual field "{}".'
                )
                partial_intersection_msg += append_msg.format(f_p, len(not_in_actual), f_a)

            cexc.messages.warn(partial_intersection_msg.format(f_p, f_a))


def convert_df_to_categorical(df, warn_on_float_series=False):
    """Converts field values to categorical representations.

    - Doesn't affect categorical and mixed-type columns. If numeric columns can
      be cast to integer-type, convert to integer before casting to string.
    - Floats are integer candidates if relative error less than 1%

    Args:
        df (pd.dataframe): input dataframe
        warn_on_float_series (bool): Warn when a field is float-type
            (i.e. float-type is not equivalent to int-type)

    Returns:
        df (pd.dataframe): input dataframe converted to categorical inplace
    """
    for j, (f, series) in enumerate(df.items()):
        if series_type_is_numeric(series):
            # See if the entire series can be cast as integer unambiguously
            int_series = series.astype(int)
            if np.isclose(series, int_series, rtol=0.01, equal_nan=True).all():
                # Update the dataframe inplace
                df.iloc[:, j] = int_series

        if warn_on_float_series:
            if series_is_float(series):
                cexc.messages.warn(
                    'Expected field "{}" to be categorical, but numeric field found. '
                    'Please ensure the correct field was identified'.format(f)
                )

    # Convert entire df to string-type
    df = df.astype(str)
    return df


def initial_check_pos_label_and_average(params):
    """Validates average parameter and warns if pos_label is ignored.

    - If pos_label is explicitly set and average is not binary, warns
        that pos_label is ignored
    - Returns updated with average value lowered/converted to None

    Args:
        params (dict): input parameters

    Returns:
        params (dict): updated params with 'average' lowered or set to None
    """
    average = params['average'].lower()
    params = validate_param_from_str_list(
        params, 'average', ['none', 'binary', 'macro', 'micro', 'weighted']
    )
    if (
        average != 'binary' and params.get('pos_label', None) is not None
    ):  # pos_label set by user
        # Warn that positive label is ignored if 'average' is not 'binary' and pos_label is not the default (1)
        msg = 'Warning: pos_label will be ignored since average is not binary (found average="{}")'
        cexc.messages.warn(msg.format(average))
    return params


def check_pos_label_and_average_against_data(
    actual_df, predicted_df, params, default_pos_label='1'
):
    """Validates pos_label & average params against fields in actual_df.

    - Checks that pos_label is contained in each actual field
    - Asserts that the combined cardinality of each pair of actual-predicted
      fields is less than or equal to 2

    Args:
        actual_df (pd.DataFrame): ground-truth classification-scoring data
        predicted_df (pd.DataFrame): predicted classification scoring data
        params (dict): parameters dictionary
        default_pos_label (str): default value of pos_label

    Raises:
        RuntimeError if params are incompatible with passed data
    """
    for (f_a, s_a), (f_p, s_p) in zip(iter(actual_df.items()), iter(predicted_df.items())):
        a_p_combined_cardinality = len(set(s_a.values).union(set(s_p.values)))
        if a_p_combined_cardinality > 2 and params['average'] == 'binary':
            msg = (
                'Value error: the combined cardinality of actual field "{}" and predicted field "{}" is greater '
                'than 2, which is invalid for average=binary. Please choose another average setting.'
            )
            raise RuntimeError(msg.format(f_a, f_p))

        if params['average'] == 'binary':
            assert_pos_label_in_series(
                s_a, params.get('pos_label', default_pos_label), default_pos_label
            )


###############################################
# Statstest/Statsfunctions scoring utilities  #
###############################################
def prepare_statistical_scoring_data(df, a_fields, b_fields=None):
    """Filter nan rows, unused and categorical columns; warns appropriately

    Args:
        df (pd.dataframe): input dataframe
        a_fields (list): fields comprising a_array
        b_fields (list Or None): fields comprising b_array

    Returns:
        a_array (pd.dataframe): a_array with dropped unused/categorical
        b_array (pd.dataframe or None): b_array with dropped unused/categorical
    """
    all_fields = a_fields + b_fields if b_fields is not None else a_fields
    for f in all_fields:
        assert_field_present(df, f)
    # Statistical methods require all numeric data
    assert_numeric_type_df(df[a_fields])
    if b_fields:
        assert_numeric_type_df(df[b_fields])

    # TODO: MLA-2428 ; some statistical methods (eg. chi2) operate on discrete distributions
    # Remove all nans and warn on their removal;  Remove duplicates in fields
    df, nans = remove_nans_and_warn(df, list(set(all_fields)))
    # Split dataframe into a_array and b_array. If b_fields is None, b_array is also None.
    a_array = df[[i for i in a_fields if i in df.columns]]
    b_array = df[[i for i in b_fields if i in df.columns]] if b_fields is not None else None
    assert_nonempty_arrays(a_array, b_array)
    return a_array, b_array


def check_alternative_param(params):
    """Check that a valid 'alternative' parameter is passed.

    Args:
        params (dict): input parameters with containing 'alternative' key

    Returns:
        params (dict): updated parameters dict (if necessary)
    """
    params = validate_param_from_str_list(
        params, 'alternative', ['none', 'two-sided', 'less', 'greater']
    )
    return params


def check_zero_method_param(params):
    """Check that a valid 'zero_method' parameter is passed.

    Args:
        params (dict): input parameters with containing 'zero_method' key

    Returns:
        params (dict): updated parameters dict (if necessary)
    """
    params = validate_param_from_str_list(params, 'zero_method', ['pratt', 'wilcox', 'zsplit'])
    return params


def check_limits_param(params):
    """Check that a valid 'upper_limit'/'lower_limit' parameter is passed.

    Args:
        params (dict): input parameters

    Returns:
        params (dict): updated parameters dict (if necessary)
    """
    # scipy takes single 'limits' parameter (tuple or None). Exposed lower/upper limit for usability
    lower_limit, upper_limit = params.pop('lower_limit', None), params.pop('upper_limit', None)
    if type(lower_limit) == float and type(upper_limit) == float and upper_limit <= lower_limit:
        raise RuntimeError('Value error: upper limit must be greater than lower limit.')
    limits = (lower_limit, upper_limit) if (lower_limit or upper_limit) is not None else None
    params['limits'] = limits
    return params


def warn_order_not_preserved():
    """Warns that the scoring method does not preserve order of events."""
    msg = (
        'Scoring method does not preserve order of events, and so event indices are arbitrary.'
    )
    cexc.messages.warn(msg)


def check_alpha_param(alpha):
    """Assert that alpha has a valid value.

    Args:
        alpha (float): alpha-level for test
    """
    if alpha <= 0 or alpha >= 1:
        raise RuntimeError(
            "Value error: parameter 'alpha' must be between 0 and 1 (not inclusive)."
        )


def decision_annotation(p_value, alpha, null_hypothesis):
    """Create a decision whether to reject null hypothesis or not.

    Args:
        p_value (float): statistic p-value
        alpha (float): statistic alpha-level
        null_hypothesis (str): null hypothesis of experiment

    Returns:
        annotation (str): annotation of the decision on whether to
            reject or fail-to-reject the null hypothesis
    """
    decision = "Reject" if p_value <= alpha else "Fail to reject"
    annotation = "{} the null hypothesis that {}".format(decision, null_hypothesis)
    return annotation


def update_with_hypothesis_decision(dict_results, alpha, null_hypothesis):
    """Update "dict_results" with whether to reject/accept null hypothesis

    - dict_results must have a key "p-value" which takes on either a
        single float value or a list of floats

    Args:
        dict_results (dict): A dictionary of results
        alpha (float): alpha level (1-confidence level)
        null_hypothesis (str): the null hypothesis of the statistical test

    Returns:
        dict_results (dict): original dict_results updated with decision
    """

    # Check if results corresponds to a single or multiple events
    try:
        # Single event
        p_value = float(dict_results['p-value'])
        update_dict = {
            "Test decision (alpha={})".format(alpha): decision_annotation(
                p_value, alpha, null_hypothesis
            )
        }
    except TypeError:
        # Multiple events
        decision_annotations = []
        for p_value in dict_results['p-value']:
            decision_annotations.append(decision_annotation(p_value, alpha, null_hypothesis))
        update_dict = {"Test decision (alpha={})".format(alpha): decision_annotations}

    dict_results.update(update_dict)
    return dict_results


#################################
# Clustering scoring utilities  #
#################################
def prepare_clustering_scoring_data(df, label_field, feature_fields, mlspl_limits=None):
    """Utility function for handling clustering preparing and validation steps.

    Args:
        df (pd.dataframe): input dataframe
        feature_fields (list of str): requested fields
        label_field (list of a single str): labels field name
        mlspl_limits (dict): limits from mlspl.conf

    Returns:
        feature_df (pd.dataframe): prepared and validated dataframe
        label_df (pd.dataframe): prepared and validated labels dataframe
    """
    all_fields = label_field + feature_fields
    for f in label_field + feature_fields:
        assert_field_present(df, f)

    # Use only numeric fields.
    assert_numeric_type_df(df[feature_fields])

    df, nans = remove_nans_and_warn(df, list(set(all_fields)))
    feature_df = df[[i for i in feature_fields if i in df.columns]]

    if mlspl_limits is None:
        mlspl_limits = {}

    # Convert label_df to categorical; warn if it appears to be numeric
    label_df = convert_df_to_categorical(df[label_field], warn_on_float_series=True)
    max_distinct_cat_values = int(mlspl_limits.get('max_distinct_cat_values_for_scoring', 100))
    if int(label_df.nunique()) > max_distinct_cat_values:
        raise RuntimeError(
            'Value error: cardinality of label-field "{}" exceeds limit of {}. {}'.format(
                label_field[0], max_distinct_cat_values, HOWTO_CONFIGURE_MLSPL_LIMITS
            )
        )  # label_field has 1 element

    assert_nonempty_arrays(feature_df, label_df)
    return feature_df, label_df
