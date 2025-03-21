#!/usr/bin/env python
from collections import OrderedDict

import pandas as pd

from base_scoring import BaseScoring, SingleArrayScoringMixin
from util.param_util import convert_params
from util.scoring_util import (
    add_default_params,
    prepare_statistical_scoring_data,
    update_with_hypothesis_decision,
    check_alpha_param,
    check_fields_single_field_one_array,
)


class KSTestScoring(SingleArrayScoringMixin, BaseScoring):
    """Implements scipy.stats.kstest"""

    @staticmethod
    def convert_param_types(params):
        if 'cdf' in params:
            params['cdf'] = cdf_str = params['cdf'].lower()  # Convert to lowercase
        else:
            raise RuntimeError(
                'Value error: the cumulative distribution function (cdf) must be specified. '
                'Currently we support cdf values of: norm, lognorm and chi2.'
            )

        # Currently we only support chi2, lognorm and norm cdfs.
        # Order is important since args is un-named sequence
        cdf_params_type_map = {
            'chi2': OrderedDict([('df', 'int'), ('loc', 'float'), ('scale', 'float')]),
            'lognorm': OrderedDict([('s', 'float'), ('loc', 'float'), ('scale', 'float')]),
            'norm': OrderedDict([('loc', 'float'), ('scale', 'float')]),
        }

        if cdf_str not in cdf_params_type_map:
            msg = 'Value error: cdf="{}" is not currently supported. Please choose a cdf in: norm, lognorm or chi2.'
            raise RuntimeError(msg.format(cdf_str))

        # Get the parameters for the specified cdf. Assert that all are specified (since args is un-named sequence)
        unspecified_params = [
            p for p in cdf_params_type_map[cdf_str] if p not in [i.lower() for i in params]
        ]
        if len(unspecified_params) > 0:
            raise RuntimeError(
                'Value error: all distribution parameters must be given for cdf="{}". Please specify '
                'the following parameters: {}.'.format(cdf_str, ', '.join(unspecified_params))
            )

        # Finally check that the correct param types are provided
        converted_params = convert_params(
            params,
            strs=['cdf', 'mode', 'alternative'],
            ints=[p for (p, p_type) in cdf_params_type_map[cdf_str].items() if p_type == 'int'],
            floats=[
                p for (p, p_type) in cdf_params_type_map[cdf_str].items() if p_type == 'float'
            ]
            + ['alpha'],
        )
        # Check param values; scale, df and s must all be greater than zero
        for p in ['scale', 'df', 's']:
            if p in converted_params and converted_params[p] <= 0:
                raise RuntimeError(
                    'Value error: "{}" parameter must be greater than zero.'.format(p)
                )

        # pop the cdf args from params since they are passed to sklearn as un-named sequence "args"
        converted_params['args'] = [
            converted_params.pop(k) for k in cdf_params_type_map[cdf_str]
        ]
        # Add default params
        converted_params = add_default_params(
            converted_params, {'mode': 'approx', 'alternative': 'two-sided', 'alpha': 0.05}
        )
        check_alpha_param(converted_params['alpha'])
        return converted_params

    def prepare_and_check_data(self, df, fields):
        fields = check_fields_single_field_one_array(fields, self.scoring_name)
        prepared_df, _ = prepare_statistical_scoring_data(df, fields)
        # pop 'alpha' from params into _meta_params
        _meta_params = {'alpha': self.params.pop('alpha')}
        return prepared_df, _meta_params

    def create_output(self, scoring_name, result, _meta_params=None):
        """Result is scipy Kstest object"""
        dict_results = {'statistic': result.statistic, 'p-value': result.pvalue}
        # Annotate decision on whether to accept/reject null hypothesis
        null_hypothesis = 'the two distributions are identical.'
        dict_results = update_with_hypothesis_decision(
            dict_results, _meta_params['alpha'], null_hypothesis
        )
        output_df = pd.DataFrame(dict_results, index=[''])
        return output_df
