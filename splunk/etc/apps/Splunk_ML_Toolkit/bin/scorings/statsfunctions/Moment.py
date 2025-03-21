#!/usr/bin/env python

import pandas as pd

from base_scoring import BaseScoring, SingleArrayScoringMixin
from util.param_util import convert_params
from util.scoring_util import (
    add_default_params,
    prepare_statistical_scoring_data,
    get_field_identifiers,
    check_fields_one_array,
)


class MomentScoring(SingleArrayScoringMixin, BaseScoring):
    """Implements scipy.stats.moment"""

    @staticmethod
    def convert_param_types(params):
        converted_params = convert_params(params, ints=['moment'])
        converted_params = add_default_params(converted_params, {'moment': 1})
        return converted_params

    def prepare_and_check_data(self, df, fields):
        fields = check_fields_one_array(fields, self.scoring_name)
        prepared_df, _ = prepare_statistical_scoring_data(df, fields)
        _meta_params = {'field_identifiers': get_field_identifiers(prepared_df, "Field")}
        return prepared_df, _meta_params

    def create_output(self, scoring_name, result, _meta_params=None):
        """Result is a numpy array."""
        dict_results = {'moment': result}
        dict_results.update(_meta_params['field_identifiers'])
        output_df = pd.DataFrame(dict_results)
        return output_df
