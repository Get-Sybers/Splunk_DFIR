import re

import pandas as pd
import numpy as np
from statsmodels.formula.api import ols

from base_scoring import BaseScoring, DoubleArrayScoringMixin
from util.df_util import assert_field_present
from util.param_util import convert_params
from util.scoring_util import (
    add_default_params,
    validate_param_from_str_list,
    load_scoring_function,
    remove_nans_and_warn,
    assert_nonempty_arrays,
)


class AnovaTableScoring(DoubleArrayScoringMixin, BaseScoring):
    """Implements statsmodels.stats.anova_lm
    Three types of outputs:
        - anova: returns the actual anova table which anova_lm returns
        - ols: returns the model's summary other than intercept table
        - intercept: returns the intercept table
    """

    NOT_SUPPORTED = re.compile(r'[&%$#@!`\|";<>^]')

    def __init__(self, options):
        """Initialize scoring class, check options & parse params"""
        self.scoring_name = options.get('scoring_name')
        self.params = self.handle_options(options)
        self.scoring_function = AnovaTableScoring._load_scoring_function()
        self.variables = []

    @staticmethod
    def _load_scoring_function():
        """Load scoring function from statsmodels.stats"""
        scoring_module_name = 'statsmodels.api'
        scoring_function = load_scoring_function(scoring_module_name, 'stats')
        return scoring_function

    def handle_options(self, options):
        """Anova table operates on two arrays of fields where
        - first array consists of a single field and
        - second array consists of multiple fields.
        These fields will be extracted from the "formula" string.
        So, they are both empty in the beginning.
        """
        params = options.get('params', {})
        params = self.convert_param_types(params)
        a_fields = options.get('a_variables', [])
        b_fields = options.get('b_variables', [])

        n1, n2 = len(a_fields), len(b_fields)
        # a_array and b_array must be empty, will grab field names from formula
        if n1 != 0 or n2 != 0:
            raise RuntimeError('Syntax error: Not expecting field names')
        return params

    @staticmethod
    def convert_param_types(params):
        converted_params = convert_params(
            params,
            ints=['type'],
            strs=['output', 'test', 'robust', 'formula'],
            floats=['scale'],
        )
        converted_params = add_default_params(
            converted_params,
            {'type': 1, 'output': 'anova', 'scale': 'none', 'test': 'F', 'robust': 'none'},
        )
        converted_params = validate_param_from_str_list(
            converted_params, 'output', ['anova', 'model_accuracy', 'coefficients']
        )
        converted_params = validate_param_from_str_list(
            converted_params, 'test', ['f', 'chisq', 'cp', 'none']
        )
        # set the first letter capitalized for 'test' parameter, statsmodels requires them this way
        test = converted_params['test']
        converted_params['test'] = None if test is None else test.capitalize()
        converted_params = validate_param_from_str_list(
            converted_params, 'robust', ['hc0', 'hc1', 'hc2', 'hc3', 'none']
        )
        typ = converted_params['type']
        if typ not in [1, 2, 3]:
            raise RuntimeError(
                'Value error: parameter "type" must be one of 1, 2 or 3. Found {}.'.format(typ)
            )
        formula = converted_params['formula']
        if formula == '':
            raise RuntimeError('Value error: parameter "formula" can not be empty.')
        if formula.count('~') != 1:
            raise RuntimeError(
                'Value error: "~" must be used exactly once in parameter "formula": "<a_field> ~ <b_field_1> <arithmetic operations> <b_field_2> ... <b_field_n>"'
            )
        return converted_params

    @staticmethod
    def get_field_names_from_formula(formula):
        if re.search(AnovaTableScoring.NOT_SUPPORTED, formula) is not None:
            raise RuntimeError(
                'There are operators in the formula which are not supported by Patsy. For a full list of supported operators please visit https://patsy.readthedocs.io/en/v0.1.0/formulas.html'
            )

        fields = formula.split('~')
        a_fields = fields[0].strip().split()
        tmp = fields[1]
        pattern = r'[,+*/:(){}\[\]\s-]+'
        digit = r'[\d]+'
        tmp2 = re.split(pattern, tmp)
        b_fields = list(
            set(
                [
                    name
                    for name in tmp2
                    if name != ''
                    and name[0:3] != 'np.'
                    and name != 'C'
                    and name != 'I'
                    and re.match(digit, name) is None
                ]
            )
        )
        if len(a_fields) != 1 or len(b_fields) == 0:
            raise RuntimeError(
                'Syntax error: expected "formula="<a_field> ~ <b_field_1> <arithmetic_operations> <b_field_2> ... <b_field_n>"'
            )
        return a_fields, b_fields

    @staticmethod
    def prepare_anova_scoring_data(df, a_fields, b_fields):
        """Filter nan rows, unused columns; warns appropriately
            Difference from prepare_statistical_scoring_data is allows categorical fields and b_fields can not be None

        Args:
            df (pd.dataframe): input dataframe
            a_fields (list): fields comprising a_array
            b_fields (list): fields comprising b_array

        Returns:
            a_array (pd.dataframe): a_array with dropped unused/categorical
            b_array (pd.dataframe ): b_array with dropped unused/categorical
        """
        all_fields = a_fields + b_fields
        for f in all_fields:
            assert_field_present(df, f)

        # Remove all nans and warn on their removal;  Remove duplicates in fields
        df, nans = remove_nans_and_warn(df, list(set(all_fields)))
        # Split dataframe into a_array and b_array. If b_fields is None, b_array is also None.
        a_array = df[[i for i in a_fields if i in df.columns]]
        b_array = df[[i for i in b_fields if i in df.columns]]
        assert_nonempty_arrays(a_array, b_array)
        return a_array, b_array

    def prepare_and_check_data(self, df):
        a_fields, b_fields = self.get_field_names_from_formula(self.params.get('formula', ''))
        a_array, b_array = self.prepare_anova_scoring_data(
            df, a_fields=a_fields, b_fields=b_fields
        )
        _meta_params = {
            'output': self.params.pop('output'),
            'formula': self.params.get('formula', ''),
        }

        return a_array, b_array, _meta_params

    def score(self, df, options):
        """statstest AnovaTable requires 1d arrays input."""
        a_array, b_array, _meta_params = self.prepare_and_check_data(df)
        formula = _meta_params.get('formula')

        model = ols(formula, df).fit()
        # get the result in csv format from the ols model
        ols_result = model.summary().as_csv()
        result = self.scoring_function.anova_lm(
            model,
            typ=self.params['type'],
            test=self.params['test'],
            robust=self.params['robust'],
            scale=self.params['scale'],
        )
        df_output = self.create_output(result, ols_result, _meta_params)
        return df_output

    def create_output(self, result, ols_result, _meta_params=None):
        if _meta_params['output'] == 'anova':
            output_df = result
        else:
            ols_df, intercept_df = self.parse_ols_result(ols_result)
            if _meta_params['output'] == 'model_accuracy':
                output_df = ols_df
            else:  # output = 'coefficients'
                output_df = intercept_df
        return output_df

    @staticmethod
    def parse_ols_result(ols_result):
        """Parse ols_result_lines and generate necessary dataframes (ols_df, intercept_df)

        - dict_results must have a key "p-value" which takes on either a
            single float value or a list of floats

        Args:
            ols_result (string): text containing ols results

        Returns:
            ols_df (pd.dataframe): dataframe containing ols results except intercept table
            intercept_df (pd.dataframe): dataframe containing intercept table
        """

        def _parse_row_string(row_content):
            """Parse a line of string with the delimiter comma

            Args:
                row_content(string): The line of string

            Returns:
                list: list of parsed elements
            """
            row_elements = row_content.split(',')
            # Date is in one of the rows in ols_result.
            # The comma in Date info (Ex: "Friday, 2 Nov 2018") is handled below.
            if 'Date' in row_content:
                # row_elements[0]='Date' and row_elements[1]=Day(Ex: Friday) and
                # row_elements[2]=Day Month Year (Ex: 2 Nov 2018)
                return (
                    [row_elements[0].strip()]
                    + [row_elements[1].strip() + ', ' + row_elements[2].strip()]
                    + [p.strip() for p in row_elements[3:]]
                )
            else:
                return [p.strip() for p in row_elements]

        intercept_size = 7  # intercept table consists of 7 rows

        ols_result_lines = ols_result.split('\n')

        ols_list = []

        # Parses the ols csv string which includes 3 different tables.
        # Separates and stores the ols table and intercept table contents into two different dataframes
        # There are 3 sections of output, 1st one belongs to ols,
        # 2nd one belongs to intercept and 3rd one belongs to ols again.
        # We do this because the format of the first and third tables are same.
        # More info here: https://confluence.splunk.com/display/~pkavak/Anova+Table+what+are+we+parsing

        # load the first part of ols_list
        for string_row in ols_result_lines[1:10]:  # skip header
            ols_list = ols_list + _parse_row_string(string_row)

        # there is an empty line between the end of the table and the warning message, this search is to find that line number so that we know where our table ends
        end_of_list = -1
        for i in range(len(ols_result_lines) - 1, -1, -1):
            if ols_result_lines[i] == "":
                end_of_list = i

        # load the second part of ols list
        for string_row in ols_result_lines[
            end_of_list - 4 : end_of_list
        ]:  # last 4 lines belong to ols list too
            ols_list = ols_list + _parse_row_string(string_row)

        # load the intercept list
        tmp_intercept_list = []
        for string_row in ols_result_lines[
            11 : end_of_list - 4
        ]:  # intercept table is in between these rows
            tmp_intercept_list = tmp_intercept_list + _parse_row_string(string_row)

        # reshape the intercept list into a table with 7 columns, appropriate for the dataframe
        intercept_list = (
            np.reshape(
                tmp_intercept_list,
                (len(ols_result_lines[11 : end_of_list - 4]), intercept_size),
            )
        ).tolist()
        # ols_list[0::2] contains the column labels. strip the char (':') at the end of each label
        # eg. [<label>, <value>, <label>, <value> ... ]
        ols_list[0::2] = [x.strip(':') for x in ols_list[0::2]]
        # ols_list[0::2] contains 'column labels', ols_list[1::2] contains 'values'
        ols_df = pd.DataFrame(dict(zip(ols_list[0::2], ols_list[1::2])), index=[''])
        intercept_df = pd.DataFrame(
            intercept_list,
            columns=[
                'Field',
                'coef',
                'standard error',
                't-Stat',
                'p-value > |t-Stat|',
                'bound lower [0.025',
                'bound upper 0.975]',
            ],
        )
        return ols_df, intercept_df
