#!/usr/bin/env python

import pandas as pd
from sklearn import __version__ as sklearn_version


from distutils.version import StrictVersion
from codec import codecs_manager
from base import BaseAlgo, ClassifierMixin
from util.param_util import convert_params


required_version = '0.18.2'
supported_activations = ('identity', 'logistic', 'tanh', 'relu')


# Checks sklearn version
def has_required_version():
    return StrictVersion(sklearn_version) >= StrictVersion(required_version)


def raise_import_error():
    msg = 'MLP Classifier is not available in this version of scikit-learn ({}): version {} or higher required'
    msg = msg.format(sklearn_version, required_version)
    raise ImportError(msg)


class MLPClassifier(ClassifierMixin, BaseAlgo):
    def __init__(self, options):
        self.handle_options(options)
        out_params = convert_params(
            options.get('params', {}),
            ints=['batch_size', 'max_iter', 'random_state'],
            floats=['tol', 'momentum'],
            strs=['activation', 'solver', 'learning_rate', 'hidden_layer_sizes'],
        )
        if has_required_version():
            from sklearn.neural_network import MLPClassifier as _MLPClassifier
        else:
            raise_import_error()

        if 'hidden_layer_sizes' in out_params:
            try:
                out_params['hidden_layer_sizes'] = tuple(
                    int(i) for i in out_params['hidden_layer_sizes'].split('-')
                )
                if len(out_params['hidden_layer_sizes']) < 1:
                    raise RuntimeError(
                        'Syntax Error:'
                        ' hidden_layer_sizes requires range (e.g., hidden_layer_sizes=60-80-100)'
                    )
            except RuntimeError:
                raise RuntimeError(
                    'Syntax Error:'
                    ' hidden_layer_sizes requires range (e.g., hidden_layer_sizes=60-80-100)'
                )

        # whitelist valid values for learning_rate, as error raised by sklearn for invalid values is uninformative
        valid_learning_methods = ['constant', 'invscaling', 'adaptive']

        if (
            'learning_rate' in out_params
            and out_params.get('learning_rate') not in valid_learning_methods
        ):
            msg = "learning_rate must be one of: {}".format(', '.join(valid_learning_methods))
            raise RuntimeError(msg)

        # stop trying to fit if tol value is invalid
        if out_params.get('tol', 0) < 0:
            raise RuntimeError(
                'Invalid value for tol: "{}" must be > 0.'.format(out_params['tol'])
            )

        if out_params.get('batch_size', 0) < 0:
            raise RuntimeError(
                'Invalid value for batch_size: "{}" must be > 0.'.format(
                    out_params['batch_size']
                )
            )

        if (
            'activation' in out_params
            and out_params.get('activation') not in supported_activations
        ):
            raise RuntimeError(
                'Invalid value for activation: "{}" must be one of {}.'.format(
                    out_params['activation'], str(supported_activations)
                )
            )

        if 'momentum' in out_params and not (0 <= out_params.get('momentum') <= 1):
            raise RuntimeError(
                'Invalid value for momentum: "{}" must be >= 0 and <= 1.'.format(
                    out_params['momentum']
                )
            )

        self.estimator = _MLPClassifier(**out_params)

    def summary(self, options):
        """Only model_name and mlspl_limits are supported for summary"""
        if len(options) != 2:
            msg = '"%s" models do not take options for summarization' % self.__class__.__name__
            raise RuntimeError(msg)

        # create dataFrame to include information scores
        df = pd.DataFrame(
            {
                'loss': round(self.estimator.loss_, 3),
                'n_iterations': self.estimator.n_iter_,
                'n_layers': self.estimator.n_layers_,
                'n_outputs': self.estimator.n_outputs_,
                'activation_function': self.estimator.out_activation_,
            },
            index=['values'],
        )

        return df

    @staticmethod
    def register_codecs():
        from codec.codecs import SimpleObjectCodec

        codecs_manager.add_codec('algos.MLPClassifier', 'MLPClassifier', SimpleObjectCodec)
        codecs_manager.add_codec(
            'sklearn.preprocessing._label', 'LabelBinarizer', SimpleObjectCodec
        )
        codecs_manager.add_codec(
            'sklearn.neural_network._multilayer_perceptron', 'MLPClassifier', SimpleObjectCodec
        )
        codecs_manager.add_codec(
            'sklearn.neural_network._stochastic_optimizers', 'AdamOptimizer', SimpleObjectCodec
        )
        codecs_manager.add_codec(
            'sklearn.neural_network._stochastic_optimizers', 'SGDOptimizer', SimpleObjectCodec
        )
