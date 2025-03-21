#!/usr/bin/env python

import numpy as np
import pandas as pd

import cexc
from util import scoring_util
from util.base_util import MLSPLNotImplementedError, match_field_globs
from util.param_util import convert_params
from util.scoring_util import (
    prepare_classification_scoring_data,
    prepare_statistical_scoring_data,
    assert_pos_label_in_series,
    get_union_of_field_values,
    assert_numeric_proba,
    convert_df_to_true_binary,
    check_class_intersection,
    convert_df_to_categorical,
    load_scoring_function,
    warn_multiclass_series,
    get_and_check_fields_two_2d_arrays,
    add_default_params,
    get_field_identifiers,
    validate_param_from_str_list,
    replicate_1d_array_to_nd,
    prepare_clustering_scoring_data,
    remove_duplicate_fields_and_warn,
)


class BaseScoring(object):
    """Defines the interface between ML-SPL score command methods."""

    def __init__(self, options):
        """The initialization function.
        Handle the options, 1) parse the params, 2) gather field names
        """
        self.variables = None
        msg = 'The {} scoring cannot be initialized.'
        msg = msg.format(self.__class__.__name__)
        raise MLSPLNotImplementedError(msg)

    def score(self, df, options):
        """The main function to be implemented for score command.

        Args:
            df (pd.dataframe): input dataframe
            options (dict): scoring options

        Returns:
            df_output (pd.dataframe): output dataframe
        """
        msg = 'The {} scoring does not support score.'
        msg = msg.format(self.__class__.__name__)
        raise MLSPLNotImplementedError(msg)


class ClassificationScoringMixin(object):
    """Compute classification scorings."""

    def __init__(self, options):
        """Initialize scoring class, check options & parse params"""
        self.scoring_name = options.get('scoring_name')
        (
            self.params,
            self.actual_fields,
            self.predicted_fields,
            self._meta_params,
        ) = self.handle_options(options)
        self.scoring_function = self.load_scoring_function_with_options(options)
        self.variables = self.actual_fields + self.predicted_fields

    @staticmethod
    def load_scoring_function_with_options(options):
        """Load the correct scoring function from module."""
        scoring_module_name = 'sklearn.metrics'
        scoring_function = scoring_util.load_scoring_function(
            scoring_module_name, options.get('scoring_name')
        )
        return scoring_function

    def handle_options(self, options):
        """Utility to handle options. Verifies that valid options are passed.

        Args:
            options (dict): options containing scoring function params

        Returns:
            params (dict): validated parameters for scoring function
            actual_fields (list): requested ground-truth fields
            predicted_fields (list): requested predicted fields
            _meta_params (dict): parameters used in backend but not passed
                to scoring function
        """
        params = options.get('params', {})
        params, _meta_params = self.convert_param_types(params)
        actual_fields = options.get('a_variables', [])
        predicted_fields = options.get('b_variables', [])
        return params, actual_fields, predicted_fields, _meta_params

    @staticmethod
    def convert_param_types(params):
        """Convert scoring function parameters to their correct type.

        Args:
            params (dict): parameters passed through options

        Returns:
            converted_params (dict): Validated parameters of the correct type
            _meta_params (dict): parameters used in backend but not passed to
                                the scoring function
        """
        # Convert parameters
        converted_params = convert_params(params)
        # _meta_params dict holds parameters used in backend but not passed to scorer
        _meta_params = {}
        return converted_params, _meta_params

    def check_params_with_data(self, actual_df, predicted_df):
        """Check parameters against the data.

        Handle errors regarding cardinality of ground-truth labels
        and checks the pos_label param, if applicable. Assumes data
        has already been cleaned and made categorical.

        Args:
            actual_df (pd.dataframe): preprocessed ground-truth data
            predicted_df (pd.dataframe): preprocessed predicted data

        Raises:
            RuntimeError if params are incompatible with passed data
        """
        pass

    def prepare_input_data(self, df, mlspl_limits):
        """Prepare the data prior to scoring.

        Preprocess input data, perform parameter validation and
        handles errors.

        Args:
            df (pd.dataframe): input dataframe
            mlspl_limits (dict): limits on mlspl.conf

        Returns:
            actual_array (np.array): preprocessed ground-truth data
            predicted_array (np.array): preprocessed predicted data
        """
        # For classification scoring, we alias "a_fields" and "b_fields" to "actual" and "predicted", respectively
        self.actual_fields, self.predicted_fields = get_and_check_fields_two_2d_arrays(
            df,
            self.actual_fields,
            self.predicted_fields,
            self.scoring_name,
            a_field_alias='actual_field',
            b_field_alias='predicted_field',
        )
        # remove nans and check limits
        actual_df, predicted_df = prepare_classification_scoring_data(
            df, self.actual_fields, self.predicted_fields, mlspl_limits
        )

        # convert actual/predicted dfs to string-type (eg. ints -> str)
        categorical_actual_df = convert_df_to_categorical(actual_df)
        categorical_predicted_df = convert_df_to_categorical(predicted_df)

        # Check for inconsistencies with data
        self.check_params_with_data(categorical_actual_df, categorical_predicted_df)
        # check the intersection of actual/predicted class data; warn if applicable
        check_class_intersection(categorical_actual_df, categorical_predicted_df)

        # If scoring method uses the set of actual-field classes for labelling, update self.params
        if self._meta_params.get('class_variable_headers') is not None:
            self.params['labels'] = get_union_of_field_values(
                categorical_actual_df, predicted_df
            )

        # Identifying columns start with capitals to appear left in output
        self._meta_params['field_identifiers'] = get_field_identifiers(
            categorical_actual_df, 'Actual field', categorical_predicted_df, 'Predicted field'
        )

        # Get the predicted/actual arrays
        actual_array = categorical_actual_df.values
        predicted_array = categorical_predicted_df.values

        # If one-to-multiple, replicate single-column of actual_array to be compatible with predicted_array
        if actual_array.shape[1] == 1 and predicted_array.shape[1] > 1:
            actual_array = replicate_1d_array_to_nd(actual_array, predicted_array.shape[1])

        return actual_array, predicted_array

    def score(self, df, options):
        """Compute the score.

        Args:
            df (pd.DataFrame): input dataframe
            options (dict): passed options

        Returns:
            df_output (pd.dataframe): output dataframe
        """
        # Prepare ground-truth and predicted labels
        actual_array, predicted_array = self.prepare_input_data(
            df, options.get('mlspl_limits', {})
        )
        # Get the scoring result for each pair of columns in actual_df and predicted_df stored in a list
        result = [
            self.scoring_function(a, p, **self.params)
            for a, p in zip(actual_array.T, predicted_array.T)
        ]
        # Create the output df
        df_output = self.create_output(self.scoring_name, result)
        return df_output

    def create_output(self, scoring_name, results):
        """Create output dataframe

        Args:
            scoring_name (str): scoring function name
            results (list): list of outputs from scoring function

        Returns:
            df_output (pd.DataFrame): output dataframe
        """
        class_variables = self.params.get('labels', None)

        # Create output results
        result_array = np.array(results).reshape(len(results), -1)
        result_identifiers = class_variables if class_variables is not None else [scoring_name]
        results_dict = {k: v for k, v in zip(result_identifiers, result_array.T)}

        # Add field identifiers
        results_dict.update(self._meta_params['field_identifiers'])
        df_output = pd.DataFrame(results_dict)
        return df_output


class ROCMixin(ClassificationScoringMixin):
    """Mixin class for ROC_curve and ROC_AUC_score"""

    @staticmethod
    def convert_param_types(params):
        out_params = convert_params(params, strs=['pos_label'])
        _meta_params = {
            'pos_label': out_params.pop('pos_label', '1')
        }  # Pos label used to create true-binary
        return out_params, _meta_params

    def check_params_with_data(self, actual_df, predicted_df):
        """roc_auc_score does not accepts multiclass targets"""
        multiclass_warn_msg = (
            'Found multiclass actual field "{}". Converting to true binary by setting "{}" as positive and all '
            'other classes as negative'
        )

        # Convert fields to true binary (and warn on conversion); ensure pos_label is in each actual field
        for f, series in actual_df.items():
            warn_multiclass_series(
                series, multiclass_warn_msg.format(f, self._meta_params['pos_label'])
            )
            assert_pos_label_in_series(
                series, self._meta_params['pos_label'], default_pos_label='1'
            )

        # Assert that all fields of the predicted_df are numeric
        assert_numeric_proba(predicted_df)

    def prepare_input_data(self, df, mlspl_limits):
        """Overwriting parent method.

        Roc_curve & roc_auc_score require binary ground-truth labels in
        true-binary format; pos_label parameter allows for conversion to true
        binary; y_predicted values are scores and cardinality of predicted_fields is not
        limited; Since multiclass not supported, average param is disabled.
        """
        self.actual_fields, self.predicted_fields = get_and_check_fields_two_2d_arrays(
            df,
            self.actual_fields,
            self.predicted_fields,
            self.scoring_name,
            a_field_alias='actual_field',
            b_field_alias='predicted_field',
        )
        # remove nans and check limits on actual_field; don't check limits on predicted_field since it is numeric
        actual_df, predicted_df = prepare_classification_scoring_data(
            df,
            self.actual_fields,
            self.predicted_fields,
            mlspl_limits,
            limit_predicted_fields=False,
        )
        # Convert all ground-truth data to categorical
        actual_df = convert_df_to_categorical(actual_df)

        # Identifying columns start with capitals to appear left in output
        self._meta_params['field_identifiers'] = get_field_identifiers(
            actual_df, 'Actual field', predicted_df, 'Predicted field'
        )

        # Assert that predicted_df is numeric; check pos_label and field cardinality
        self.check_params_with_data(actual_df, predicted_df)
        # Convert the actual-df to true binary
        actual_df = convert_df_to_true_binary(actual_df, self._meta_params['pos_label'])

        actual_array = actual_df.values
        predicted_array = predicted_df.values

        # If one-to-multiple, replicate single-column of actual_array to be compatible with predicted_array
        if actual_array.shape[1] == 1:
            actual_array = np.repeat(actual_array, predicted_array.shape[1], axis=1)

        return actual_array, predicted_array


class SingleArrayScoringMixin(object):
    """Mixin class for computing score on single arrays."""

    def __init__(self, options):
        """Initialize scoring class, check options & parse params"""
        self.scoring_name = options.get('scoring_name')
        self.params, self.variables = self.handle_options(options)
        self.scoring_function = self.load_scoring_function_with_options(options)

    @staticmethod
    def load_scoring_function_with_options(options):
        """Load the correct scoring function from module."""
        scoring_module_name = 'scipy.stats'
        scoring_function = scoring_util.load_scoring_function(
            scoring_module_name, options.get('scoring_name')
        )
        return scoring_function

    def handle_options(self, options):
        """Utility to handle options. Verifies that valid options are passed.

        Since mixin operates on a single array, b_fields must be an empty list.

        Args:
            options (dict): options containing scoring function params

        Returns:
            params (dict): validated parameters for scoring function
            fields (list): requested fields comprising array
        """
        params = self.convert_param_types(options.get('params', {}))
        if len(options.get('b_variables', [])) != 0:
            msg = 'Syntax error: expected " | score {} <field_1> <field_2> ... <field_n>."'
            raise RuntimeError(msg.format(self.scoring_name))
        fields = options.get('a_variables', [])
        return params, fields

    @staticmethod
    def convert_param_types(params):
        """Convert scoring function parameters to their correct type.

        Also checks validity of input params prior to checking against data.

        Args:
            params (dict): parameters passed through options

        Returns:
            converted_params (dict): validated parameters of the correct type
        """
        return params

    @staticmethod
    def prepare_and_check_data(df, fields):
        """Perform pre-processing on data.

        Prepare data prior to scoring.

        Args:
            df (pd.dataframe): input dataframe
            fields (list): list of variable names

        Returns:
            a_df (pd.dataframe): preprocessed df corresponding to fields
            _meta_params (dict): parameters used in backend but not
                passed to scoring function
        """
        a_df = df
        _meta_params = {}
        return a_df, _meta_params

    def score(self, df, options):
        """Compute the score.

        Args:
            df (pd.DataFrame): input dataframe
            options (dict): passed options

        Returns:
            df_output (pd.dataframe): output dataframe
        """
        # Get preprocessed df and and meta-params for creating output
        df, _meta_params = self.prepare_and_check_data(df, self.variables)

        array = df.values

        if array.ndim == 2 and array.shape[1] == 1:
            array = array.reshape(-1)  # explicitly convert to 1d vector
        result = self.scoring_function(array, **self.params)
        # Create output with meta-params
        df_output = self.create_output(self.scoring_name, result, _meta_params)
        return df_output

    def create_output(self, scoring_name, result, _meta_params=None):
        """Create output dataframe.

        Args:
            scoring_name (str): name of scoring method
            result (scipy object, float or np.array): contains
                the result of the scipy scoring function
            _meta_params (dict): Additional parameters used to create output

        Returns:
            df_output (pd.DataFrame): output dataframe.
        """
        df_output = pd.DataFrame({scoring_name: result})
        return df_output


class DoubleArrayScoringMixin(object):
    """Mixin class for computing score on two arrays."""

    def __init__(self, options):
        """Initialize scoring class, check options & parse params"""
        self.scoring_name = options.get('scoring_name')
        self.params, self.a_fields, self.b_fields = self.handle_options(options)
        self.scoring_function = self.load_scoring_function_with_options(options)
        self.variables = self.a_fields + self.b_fields

    @staticmethod
    def load_scoring_function_with_options(options):
        """Load the correct scoring function from module."""
        scoring_module_name = 'scipy.stats'
        scoring_function = scoring_util.load_scoring_function(
            scoring_module_name, options.get('scoring_name')
        )
        return scoring_function

    def handle_options(self, options):
        """Double-array statistics operate on 2 arrays.

        Args:
            options (dict): options containing scoring function params

        Returns:
            params (dict): validated parameters for scoring function
            a_fields (list): requested fields comprising a_array
            b_fields (list): requested fields comprising b_array
        """
        params = options.get('params', {})
        params = self.convert_param_types(params)
        a_fields = options.get('a_variables', [])
        b_fields = options.get('b_variables', [])
        return params, a_fields, b_fields

    @staticmethod
    def convert_param_types(params):
        """Convert scoring function parameters to their correct type.

        Also checks validity of input params prior to checking against data.

        Args:
            params (dict): parameters passed through options

        Returns:
            converted_params (dict): validated parameters of the correct type
        """
        return params

    def prepare_and_check_data(self, df):
        """Perform preprocessing on data, and check params against data.

        Prepare data and validate params prior to scoring.

        Args:
            df (pd.dataframe): input dataframe

        Returns:
            a_df (pd.dataframe): preprocessed df for a_array
            b_df (pd.dataframe): preprocessed df for b_array
            _meta_params (dict): parameters used in backend but not
                passed to scoring function
        """
        self.a_fields, self.b_fields = get_and_check_fields_two_2d_arrays(
            df, self.a_fields, self.b_fields, self.scoring_name
        )
        a_df = df[self.a_fields]
        b_df = df[self.b_fields]
        _meta_params = {}
        return a_df, b_df, _meta_params

    def score(self, df, options):
        """Compute the score.

        When both arrays are 1-dimensional (i.e. single fields),
        we explicitly convert to a sample of observations.
        """
        # Get preprocessed df for creating output.
        a_df, b_df, _meta_params = self.prepare_and_check_data(df)
        a_array = a_df.values
        b_array = b_df.values

        # If single-fields passed, convert to 1d arrays for scoring methods such as Wilcoxon
        if (a_array.ndim == 2 and a_array.shape[1] == 1) and (
            b_array.ndim == 2 and b_array.shape[1] == 1
        ):
            a_array = a_array.reshape(-1)
            b_array = b_array.reshape(-1)

        # Perform scoring
        result = self.scoring_function(a_array, b_array, **self.params)
        # Create output with meta-params
        df_output = self.create_output(self.scoring_name, result, _meta_params)
        return df_output

    @staticmethod
    def create_output(scoring_name, result, _meta_params=None):
        """Create output dataframe.

        Args:
            scoring_name (str): name of scoring method
            result (scipy object, float, np.array): contains
                the result of the scipy scoring function
            _meta_params (dict): Additional parameters used to create output

        Returns:
            df_output (pd.DataFrame): output dataframe.
        """
        df_output = pd.DataFrame({scoring_name: result})
        return df_output


class TSAStatsToolsMixin(SingleArrayScoringMixin):
    """Compute time-series-analysis scorings from statsmodels.tsa.stattools"""

    @staticmethod
    def load_scoring_function_with_options(options):
        """Load scoring function from statsmodels.tsa.stattools."""
        scoring_module_name = 'statsmodels.tsa.stattools'
        scoring_function = load_scoring_function(
            scoring_module_name, options.get('scoring_name')
        )
        return scoring_function

    def handle_options(self, options):
        """stattools methods only operate on a single field."""
        params = options.get('params', {})
        params = self.convert_param_types(params)
        a_fields = options.get('a_variables', [])
        b_fields = options.get('b_variables', [])

        if len(b_fields) != 0:
            msg = (
                'Syntax error: scoring method "{}" operates on a single field '
                'specified as "..| score {} <field>"'
            )
            raise RuntimeError(msg.format(self.scoring_name, self.scoring_name))
        return params, a_fields

    def score(self, df, options):
        """stattools methods require 1d array input."""
        # Get preprocessed df and and meta-params for creating output
        a_df, _meta_params = self.prepare_and_check_data(df, self.variables)
        a_array = a_df.values.reshape(-1)
        # Input array expected to be 1d array vector
        result = self.scoring_function(a_array, **self.params)
        # Create output with meta-params
        df_output = self.create_output(self.scoring_name, result, _meta_params)
        return df_output


class RegressionScoringMixin(object):
    """Compute regression scores.

    If the provided input is in the form of:
    1)
        a) [a1 a2 a3] against [b1 b2 b3]
        b) [a1] against [b1]

        performing pairwise comparison (both arrays have the same number of columns)
        multioutput=raw_values by default unless it is set by the user to uniform_average or variance_weighted
    2)
        a) [a1] against [b1 b2 b3]
        b) [a1 a2 a3] against [b1]

        performing one-to-multiple (by replicating a1/b1, whichever has only a single column,
        such that we arrive at a pairwise problem again
        multioutput is updated as raw_values

        a) [a1 a1 a1] against [b1 b2 b3]
        b) [a1 a2 a3] against [b1 b1 b1]
    """

    def __init__(self, options):
        """Initialize scoring class, check options & parse params"""
        self.scoring_name = options.get('scoring_name')
        self.params, self.actual_fields, self.predicted_fields = self.handle_options(options)
        self.scoring_function = self.load_scoring_function_with_options(options)
        self.variables = self.actual_fields + self.predicted_fields

    @staticmethod
    def load_scoring_function_with_options(options):
        """Load the correct scoring function from module."""
        scoring_module_name = 'sklearn.metrics'
        scoring_function = load_scoring_function(
            scoring_module_name, options.get('scoring_name')
        )
        return scoring_function

    def handle_options(self, options):
        """Regression scorings operate on 2 arrays.

        Args:
            options (dict): options containing scoring function params

        Returns:
            params (dict): validated parameters for scoring function
            a_fields (list): requested fields comprising a_array
            b_fields (list): requested fields comprising b_array
        """
        params = options.get('params', {})
        params = self.convert_param_types(params)
        a_fields = options.get('a_variables', [])
        b_fields = options.get('b_variables', [])
        return params, a_fields, b_fields

    @staticmethod
    def convert_param_types(params):
        """Convert scoring function parameters to their correct type.

        Args:
             params (dict): Parameters passed through options

        Returns:
            converted_params(dict): Validated parameters of the correct type
        """
        converted_params = convert_params(params, strs=['multioutput'])
        valid_multioutput_vals = ['raw_values', 'uniform_average']
        converted_params = add_default_params(converted_params, {'multioutput': 'raw_values'})
        converted_params = validate_param_from_str_list(
            converted_params, 'multioutput', valid_multioutput_vals
        )
        return converted_params

    def prepare_and_check_data(self, df):
        """Perform pre-processing on data and check params against data.

        Prepare data and validate params prior to scoring.

        Args:
            df (pd.dataframe): input dataframe

        Returns:
            actual_array (numpy array): clean actual df values
            predicted_array (numpy array): clean predicted df values
            _meta_params (dict): parameters used in backend but not passed to scoring function
        """
        # For regression scoring, we alias "a_fields" and "b_fields" to "actual" and "predicted", respectively
        self.actual_fields, self.predicted_fields = get_and_check_fields_two_2d_arrays(
            df,
            self.actual_fields,
            self.predicted_fields,
            self.scoring_name,
            a_field_alias='actual_field',
            b_field_alias='predicted_field',
        )
        self.variables = self.actual_fields + self.predicted_fields
        actual_df, predicted_df = prepare_statistical_scoring_data(
            df, self.actual_fields, self.predicted_fields
        )

        _meta_params = {
            'field_identifiers': get_field_identifiers(
                actual_df, "Actual field", predicted_df, "Predicted field"
            )
        }

        actual_array = actual_df.values
        predicted_array = predicted_df.values

        # Get shape of actual/predicted dfs
        m1, n1 = actual_array.shape
        m2, n2 = predicted_array.shape

        # Set multioutput value to 'raw_values' if actual_array has a 1 column and predicted_array has >1 columns
        if n1 == 1 and n2 > 1:
            # Warn that multioutput value is changed to 'raw_values' (if it's not already)
            multioutput = self.params.get('multioutput')
            if multioutput and multioutput != 'raw_values':
                msg = 'Updating "multioutput" from "{}" to "raw_values" since one-to-multiple fields provided.'
                cexc.messages.warn(msg.format(multioutput))
            self.params['multioutput'] = 'raw_values'

            # If applicable, duplicate actual_array's column to make actual_array and predicted_array the same shape
            if n1 == 1:
                actual_array = replicate_1d_array_to_nd(actual_array, n2)

        if self.params.get('multioutput') == 'raw_values':
            # Generate a scoring result for each field-field comparison
            _meta_params['averaged_results'] = False
        return actual_array, predicted_array, _meta_params

    def score(self, df, options):
        """Compute the score.

        Args:
            df (pd.DataFrame): input dataframe
            options (dict): passed options

        Returns:
            df_output (pd.dataframe): output dataframe
        """
        actual_array, predicted_array, _meta_params = self.prepare_and_check_data(df)
        result = self.scoring_function(actual_array, predicted_array, **self.params)
        df_output = self.create_output(self.scoring_name, result, _meta_params)
        return df_output

    @staticmethod
    def create_output(scoring_name, result, _meta_params=None):
        """The result is either a numpy array or a float"""
        dict_results = {scoring_name: result}
        if not _meta_params.get('averaged_results'):
            # A result is returned for each field-field comparison; add identifiers
            dict_results.update(_meta_params['field_identifiers'])
            df_output = pd.DataFrame(dict_results)
        else:
            df_output = pd.DataFrame(dict_results, index=[''])
        return df_output


class ClusteringScoringMixin(object):
    """Compute clustering scores."""

    def __init__(self, options):
        """Check options, parse params, check and load scoring method.

        Args:
            options (dict): options containing scoring function params
        """
        self.scoring_name = options.get('scoring_name')
        self.params, self.label_field, self.feature_fields = self.handle_options(options)
        self.variables = self.label_field + self.feature_fields
        self.scoring_module_name = 'sklearn.metrics'
        self.scoring_function = load_scoring_function(
            self.scoring_module_name, self.scoring_name
        )

    def handle_options(self, options):
        """Utility to handle options. Verifies that valid options are passed.

        Args:
            options (dict): options containing scoring function params

        Returns:
            params (dict): validated parameters for scoring function
            label_field (list): requested fields comprising label field
            feature_fields (list): requested fields comprising feature fields
        """
        params = options.get('params', {})
        params = self.convert_param_types(params)

        label_field = options.get('a_variables', [])
        feature_fields = options.get('b_variables', [])
        return params, label_field, feature_fields

    @staticmethod
    def convert_param_types(params):
        """Convert scoring function parameters to their correct type.

        Args:
            params (dict): parameters passed through options

        Returns:
            converted_params (dict): validated parameters of the correct type
        """
        converted_params = convert_params(params, strs=['metric'])
        return converted_params

    def prepare_and_check_data(self, df, mlspl_limits):
        """Perform pre-processing on data and check params against data.
        Prepare data and validate params prior to scoring.

        Args:
            df (pd.dataframe): input dataframe
            mlspl_limits (dict): limits in mlspl.conf

        Returns:
            feature_df (pd.dataframe): preprocessed feature_df dataframe
            labels_df (pd.dataframe): categorical cluster labels
        """
        # handle glob * operator
        self.feature_fields = match_field_globs(list(df.columns), self.feature_fields)
        if len(self.label_field) != 1 or len(self.feature_fields) == 0:
            msg = (
                'Value error: silhouette_score requires fields to be specified as '
                '"..| score silhouette_score <label_field> against <feature_f1> <feature_f2> ... <feature_fn>"'
            )
            raise RuntimeError(msg)

        if self.label_field[0] in self.feature_fields:
            msg = 'Value error: label field "{}" found in feature fields.'
            raise RuntimeError(msg.format(self.label_field[0]))

        self.feature_fields = remove_duplicate_fields_and_warn(self.feature_fields)

        feature_df, label_df = prepare_clustering_scoring_data(
            df, self.label_field, self.feature_fields, mlspl_limits
        )

        # Silhouette score is only defined if cardinality of labels is between [2, n_samples-1] (inclusive)
        labels_cardinality = label_df.nunique()
        if not 1 < float(labels_cardinality) < len(feature_df):
            msg = (
                "Value error: silhouette_score requires the number of label-classes to be greater than 1 "
                "and less than the number of samples ({}). Found {} label-classes."
            )
            raise RuntimeError(msg.format(label_df.count(), label_df.nunique()))

        return feature_df, label_df

    def score(self, df, options):
        """Compute the score.

        Args:
            df (pd.DataFrame): input dataframe
            options (dict): passed options

        Returns:
            df_output (pd.dataframe): output dataframe
        """
        # Get preprocessed feature_df and label_df
        feature_df, label_df = self.prepare_and_check_data(df, options.get('mlspl_limits', {}))
        feature_array = feature_df.values
        label_array = label_df.values

        result = self.scoring_function(feature_array, label_array, **self.params)
        df_output = self.create_output(self.scoring_name, result)
        return df_output

    @staticmethod
    def create_output(scoring_name, result, _meta_params=None):
        """Create output dataframe.

        Args:
            scoring_name (str): name of scoring method
            result (float): contains the result of the sklearn clustering scoring function.
            _meta_params (dict): Additional parameters used to create output

        Returns:
            df_output (pd.DataFrame): output dataframe.
        """
        dict_results = {scoring_name: result}
        df_output = pd.DataFrame(dict_results, index=[''])
        return df_output
