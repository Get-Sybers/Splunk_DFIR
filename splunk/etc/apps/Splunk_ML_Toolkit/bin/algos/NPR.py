#!/usr/bin/env python

import numpy as np
import pandas as pd
from scipy.sparse import csr_matrix

import cexc
from base import BaseAlgo
from codec.codecs import SimpleObjectCodec, SparseMatrixCodec
from codec import codecs_manager
from util.df_util import merge_predictions, drop_na_rows, verify_columns_are_categorical


class NPR(BaseAlgo):
    """Instance of NPR : Normalized Perich Ratio. It maps high cardinality categorical fields into numeric fields
    in predictive models"""

    UNOBSERVED_VALUE_TAG = 'unobserved'

    def __init__(self, options):
        """Initialization function

        Args:
            options (dict): contains SPL arguments passed to
                `...|<fit|apply> NPR`

        Returns:
            NPR: instance of NPR

        Raises:
            RuntimeError:
                -  When either of target variable and feature variables are not specified.
        """
        # Class variables to store Perich Ratios for target vs. feature variables
        self._matrix_index = None
        self._matrix_values = None
        self._matrix_columns = None

        # Check whether exactly one target variable and one feature variable is specified.
        self._handle_options(options)

    def _handle_options(self, options):
        """Utility to ensure there are both target variable and exactly one feature variable"""
        if (
            len(options.get('target_variable', [])) != 1
            or len(options.get('feature_variables', [])) != 1
        ):
            raise RuntimeError(
                'Syntax error: expected exactly one value for target and feature field as  "<target> FROM <feature>"'
            )

    def check_size_limits(self, df, mlspl_limits):
        """
        Function to verify size of the dataset for allowed number of distinct elements in categorical fields.

        Args:
           df (DataFrame) : Dataset consisting of feature and target variables.
           mlspl_limits (dict) : mlspl limits to define max allowed categorical values.

        Returns:
            None if size limitations are met, else Error/Warning.

        Raises:
            RuntimeError:
            - If df exceeds size limits (MAX_DISTINCT_CAT_VALUES_IN_X/Y) for distinct values in feature/target variables.
            Warning:
            - If no. of distinct elements of feature variable is less than that of target variable..

        """
        x_distinct = len(df[self.feature_variables].unique())
        y_distinct = len(df[self.target_variable].unique())

        max_npr_matrix_size = int(mlspl_limits.get('npr_max_matrix_size', 10000000))
        if (x_distinct * y_distinct) > max_npr_matrix_size:
            raise RuntimeError(
                'Matrix created by the model cannot exceed maximum size allowed for NPR which is {},'
                ' current values found for feature and target are {} and {}, which makes the matrix size {}. '
                'Please see the documentation for more details'.format(
                    max_npr_matrix_size, x_distinct, y_distinct, x_distinct * y_distinct
                )
            )
        if x_distinct < y_distinct:
            cexc.messages.warn(
                "The number of unique values in feature variable is less than the number of unique values in target "
                "variable, potentially leading to poor results. Please see the documentation for more details"
            )

    def _is_valid_field(self, df, mlspl_limits, skip_target):
        """
        Verification function that does the following:
        1. Check if specified fieldnames exists in the dataset
        2. Checks whether the elements of feature/target column are categorical
        3. Checks for the size limitation of the dataset for allowed number of distinct elements in categorical fields.

        Args:
            df (DataFrame) : original dataset consisting of feature and target variables.
            mlspl_limits (dict) : mlspl limits to define max allowed categorical values.
            skip_target (boolean) : False if you need to validate target variable in the dataset
                                    (for ex. during `apply` time), else True.

        Returns:
            None if all the three conditions (two for apply) above are verified, else Error.

        Raises:
            RuntimeError:
            - When specified fieldname does not match with any of the columns in the dataset.
            - 'df' Exceeds size limits for distinct values in feature/target variables.
            Warning:
            - If no. of distinct elements of feature variable is less than that of target variable.
        """
        if skip_target:
            # at the time of apply , we might not need target variables to be present in the dataset
            verify_columns_are_categorical(df, fields=[self.feature_variables])
        else:
            verify_columns_are_categorical(
                df, fields=[self.feature_variables, self.target_variable]
            )
            self.check_size_limits(df, mlspl_limits)

    def _load_matrix(self):
        return pd.DataFrame(
            data=self._matrix_values.todense(),
            index=self._matrix_index,
            columns=self._matrix_columns,
        )

    def _is_unobserved(self, value, unobserved_values):
        """Function to determine if the categorical value passed is unobserved or never seen before in training set.

        Args:
            value (str): Value of categorical data element.
            unobserved_values (list) : list of different elements occurring in feature variable.

        Returns:
            bool : True if either unobserved or new element, else False
        """
        return value in unobserved_values or value == NPR.UNOBSERVED_VALUE_TAG

    def _map_normalized_ratio(self, x, unobserved_values):
        """Function to map values of calculated normalized ratio to original dataframe.
           Dimension of the feature matrix is n-by-k, where each column follows the naming convention that
           the ith column is named as NPRYi, eg. NPRY0, NPRY1, ..., NPRY(k-1)

        Args:
            x (pandas Series) : categorical values from column specified in feature variables
            unobserved_values (list) : list of different elements occurring in feature variable.

        Returns:
            transform (DataFrame) : Final mapped DataFrame

        """
        col_names = [
            'NPR_{}_{}'.format(self.feature_variables, str(name)) for name in self._matrix_index
        ]

        matrix = self._load_matrix()
        # Create DataFrame to store the mapped values
        transform = pd.DataFrame(x)
        # Using pre-calculated NPR matrix, map elements to original dataset
        # Replace unobserved or new values with 'unobserved' field.
        transform = transform.apply(
            lambda row: matrix[row[self.feature_variables]]
            if not self._is_unobserved(row[self.feature_variables], unobserved_values)
            else matrix[NPR.UNOBSERVED_VALUE_TAG],
            axis=1,
        )
        transform.columns = col_names
        return transform

    def _unobserved_value_support(self, freq_xy):
        """Calculate the values for "unobserved" category, these values are calculated for the cases when
            1. Values of X shows up in test dataset but not the training dataset.
            2. Values of X are empty/missing/unobserved.

         Args:
            freq_xy (pandas DataFrame): Frequency matrix of target(Y) vs feature variable(X),
            calculated from crosstab function

        Returns:
            DataFrame of size k by 1.
        """
        x_unobserved = np.sqrt((freq_xy**2).sum(axis=1))
        x_unobserved = x_unobserved.divide(x_unobserved.sum())
        return pd.DataFrame(x_unobserved, columns=[NPR.UNOBSERVED_VALUE_TAG])

    def _create_npr_matrix(self, x, y):
        """Function to calculate NPR values from training samples.

        Args:
            x (DataFrame): feature variable sequence from input dataframe
            y (DataFrame) : target variable sequence from input dataframe
        Returns:
            calculated NPR ratio matrix from training samples,
            size: k by (n +1)
            k is no. of distinct values in target variables, n is no. of distinct elements in feature variables
        """
        # Find the frequency of categorical values of X in Y
        xy_crosstab = pd.crosstab(y, x)

        # Calculate perich ratios for missing/unobserved elements
        x_unobserved = self._unobserved_value_support(xy_crosstab)

        # Get the table for xy_i^j, where i represents the ith level of the X variable and jth level of the Y variable
        # We assume that i is in 1, 2, ...,m and j is in 1,2,..., k.
        # xy_i^j = c_i^j/xy_crosstab_j, where c_i^j represents the ith row, jth column of xy_crosstab, which is the
        # count of the occurrences when X=Xi, y=j, xy_crosstab_j is the frequency occurrences when y takes the jth level
        # to get the matrix of xy_i^j, we use each row of xy_crosstab to divide its row total,
        # each element of xy is xy_i^j
        xy = xy_crosstab.divide(xy_crosstab.sum(axis=1), axis=0)

        # xy is k-by-m matrix of the un-normalized Perich ratio
        # Denominator of each element is the square root the row sum of the square of each element in xy
        # We will get a vector of dimension k, where k is the number of levels in y
        pr_denom = np.sqrt((xy**2).sum(axis=1))
        pr_matrix = xy.divide(pr_denom, axis=0)

        # Normalization step
        pr_normalized = pr_matrix.divide(pr_matrix.sum(axis=0), axis=1)

        # Handling a very special case, where 'unobserved' tag exists already in one of the feature values.
        if NPR.UNOBSERVED_VALUE_TAG in x.values:
            x_unobserved.columns = [NPR.UNOBSERVED_VALUE_TAG + '_NPR']
        # Concatenate normalized perich ratios calculated along with unobserved value ratios
        calculated_ratio_matrix = pd.concat((pr_normalized, x_unobserved), axis=1)
        # Storing the above matrix (sparse) in a class variable to use for value mapping later
        self._matrix_values = csr_matrix(calculated_ratio_matrix)
        self._matrix_index = [item for item in calculated_ratio_matrix.index.values]
        self._matrix_columns = [item for item in calculated_ratio_matrix.columns.values]

    def fit(self, df_orig, options):
        """Fit performs the following steps:
        1. Calculate NPR transformation matrix from categorical fields specified in training samples as calculated_ratio_matrix
        2. Map specified categorical field elements in training samples with values in calculated_ratio_matrix
        3. Calculate NPR ratio for unobserved field value as 'x_unobserved', from elements in training samples
        4. Unobserved values are replaced with 'x_unobserved' field

        Args:
            df_orig (DataFrame): input dataframe containing all field values
            options (DataFrame) : optional argument
        Returns:
            output_df (DataFrame): calculated NPR ratio matrix mapped to test samples
        """

        # Lets not modify the original Dataframe
        df = df_orig.copy()

        self.feature_variables = options.get('feature_variables')[0]
        self.target_variable = options.get('target_variable')[0]

        if self.feature_variables == self.target_variable:
            cexc.messages.warn(
                "Same value found for feature and target variables, "
                "output generated will be same as that from one-hot encoder"
            )

        mlspl_limits = options.get('mlspl_limits', {})
        self._is_valid_field(df, mlspl_limits, skip_target=False)

        # For initial preprocessing, we drop rows with null values for feature/target
        # so they are not included in further npr_calculation
        df, nans = drop_na_rows(df[[self.feature_variables, self.target_variable]])
        x = df[self.feature_variables]
        y = df[self.target_variable]

        # Get NPR calculated matrix from _create_npr_matrix function and
        # use the normalized values to map the feature variables.
        self._create_npr_matrix(x, y)

        df_orig[self.feature_variables] = df_orig[self.feature_variables].fillna(
            NPR.UNOBSERVED_VALUE_TAG
        )
        unobserved = (df_orig[self.feature_variables][nans]).unique().tolist()
        transformed_df = self._map_normalized_ratio(df_orig[self.feature_variables], unobserved)
        # Concatenate transformed and original fields
        output_df = merge_predictions(df_orig, transformed_df)
        return output_df

    def apply(self, df_orig, options):
        """During apply, perform the following:
        1. Map specified categorical field elements in test samples with values in calculated_ratio_matrix
        2. Unobserved values and unique elements are replaced with 'x_unobserved' field

        Args:
            df_orig (DataFrame): input dataframe containing all field values
            options (DataFrame) : optional argument
        Returns:
            output_df (DataFrame): calculated NPR ratio matrix mapped to test samples
        """

        # Lets not modify the original Dataframe
        df = df_orig.copy()

        mlspl_limits = options.get('mlspl_limits', {})

        self._is_valid_field(df, mlspl_limits, skip_target=True)

        df = df.fillna(NPR.UNOBSERVED_VALUE_TAG)
        x_test = df[self.feature_variables]
        unique_x_variables = self._matrix_columns

        # Store unique variables which are different from the ones seen in training data
        unobserved_variables = list(set(x_test).difference(unique_x_variables))

        transformed_df = self._map_normalized_ratio(x_test, unobserved_variables)

        # Concatenate transformed and original fields to create output
        return merge_predictions(df_orig, transformed_df)

    def summary(self, options):
        """Only model_name and mlspl_limits are supported for summary"""
        if len(options) != 2:
            msg = '"%s" models do not take options for summarization' % self.__class__.__name__
            raise RuntimeError(msg)

        cols = self._matrix_columns
        matrix = self._load_matrix()
        df_names = pd.DataFrame(
            {'Feature_variables(X)': cols, 'Feature_variance(X)': matrix.var(axis=0, ddof=0)},
            index=cols,
        )

        df_opt = matrix.T
        df_opt.columns = ['NPR_X_({})'.format(name) for name in self._matrix_index]
        df_opt = merge_predictions(df_names, df_opt)
        return df_opt

    @staticmethod
    def register_codecs():
        codecs_manager.add_codec('algos.NPR', 'NPR', SimpleObjectCodec)
        codecs_manager.add_codec('scipy.sparse._csr', 'csr_matrix', SparseMatrixCodec)
