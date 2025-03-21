#!/usr/bin/env python

from sklearn.decomposition import TruncatedSVD
from sklearn.feature_extraction.text import HashingVectorizer as _HashingVectorizer

import cexc
from base import BaseAlgo
from util import df_util
from util.param_util import convert_params

messages = cexc.get_messages_logger()


class HashingVectorizer(BaseAlgo):
    def handle_options(self, options):
        if (
            len(options.get('feature_variables', [])) != 1
            or len(options.get('target_variable', [])) > 0
        ):
            raise RuntimeError('Syntax error: You must specify exactly one field')

    def __init__(self, options):
        self.handle_options(options)

        out_params = convert_params(
            options.get('params', {}),
            ints=['max_features', 'random_state', 'n_iters', 'k'],
            strs=['stop_words', 'analyzer', 'norm', 'token_pattern'],
            ranges=['ngram_range'],
            bools=['reduce'],
            aliases={'max_features': 'n_features', 'k': 'n_components'},
        )

        if 'k' in out_params and 'reduce' in out_params and not out_params['reduce']:
            messages.warn('k parameter is ignored when reduce is set to false.')

        # Separate the SVD parameters
        svd_params = {}
        for opt in ['random_state', 'n_iters', 'n_components']:
            if opt in out_params:
                svd_params[opt] = out_params.pop(opt)

        self.do_reduce = out_params.pop('reduce', True)
        out_params.setdefault('n_features', 10000)
        self.estimator = _HashingVectorizer(**out_params)

        svd_params.setdefault('n_components', 100)

        # Check for invalid k
        n_components = svd_params['n_components']
        n_features = out_params['n_features']

        if self.do_reduce and n_components >= n_features:
            msg = 'the number of reduced fields (k={}) must be less than the number of features (max_features={})'
            raise RuntimeError(msg.format(n_components, n_features))

        self.reducer = TruncatedSVD(**svd_params)
        self.columns = []

    def fit(self, df, options):
        # Make a copy of data, to not alter original dataframe
        X = df.copy()

        # Make sure to turn off get_dummies
        X, nans, self.columns = df_util.prepare_features(
            X=X,
            variables=self.feature_variables,
            get_dummies=False,
            mlspl_limits=options.get('mlspl_limits'),
        )

        # If X is less than the reduction dimension, we can only reduce to that at max
        length = len(X)
        if length < self.reducer.n_components and self.do_reduce:
            msg = 'Number of valid events ({}) is less than k ({}). Setting k={}.'
            messages.warn(msg.format(length, self.reducer.n_components, length))
            self.reducer.n_components = length

        X = X.values.ravel().astype('str')
        X = self.estimator.fit_transform(X)
        if self.do_reduce:
            y_hat = self.reducer.fit_transform(X)
        else:
            y_hat = X.toarray()

        output_names = self.make_output_names(options)

        output = df_util.create_output_dataframe(
            y_hat=y_hat, output_names=output_names, nans=nans
        )

        df = df_util.merge_predictions(df, output)
        return df

    def make_output_names(self, options):
        default_name = self.feature_variables[0] + '_hashed'

        if self.do_reduce:
            number_of_fields = self.reducer.n_components
        else:
            number_of_fields = self.estimator.n_features

        output_name = options.get('output_name', default_name)
        output_names = [output_name + '_' + str(i) for i in range(number_of_fields)]
        return output_names
