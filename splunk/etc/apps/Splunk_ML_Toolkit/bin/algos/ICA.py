from sklearn.decomposition import FastICA as _FastICA

from base import TransformerMixin, BaseAlgo
from codec import codecs_manager
from codec.codecs import SimpleObjectCodec
from util.param_util import convert_params


class ICA(TransformerMixin, BaseAlgo):
    def __init__(self, options):
        self.handle_options(options)
        out_params = convert_params(
            options.get('params', {}),
            ints=['n_components', 'max_iter', 'random_state'],
            floats=['tol'],
            bools=['whiten'],
            strs=['algorithm', 'fun'],
        )

        if 'n_components' in out_params and out_params['n_components'] <= 0:
            raise RuntimeError(
                'Invalid value for "n_components". Only positive values are supported.'
            )

        if 'algorithm' in out_params and out_params['algorithm'] not in [
            'parallel',
            'deflation',
        ]:
            raise RuntimeError(
                'Invalid value for "algorithm". Supported values are - "parallel", "deflation".'
            )

        if 'fun' in out_params and out_params['fun'] not in ['logcosh', 'exp', 'cube']:
            raise RuntimeError(
                'Invalid value for "fun". Supported values are - "logcosh", "exp", "cube".'
            )

        if 'max_iter' in out_params and out_params['max_iter'] <= 0:
            raise RuntimeError(
                'Invalid value for "max_iter". Only positive values are supported.'
            )

        if 'tol' in out_params and out_params['tol'] < 0:
            raise RuntimeError('Invalid value for "tol". Only positive values are supported.')

        self.estimator = _FastICA(**out_params)

    @staticmethod
    def register_codecs():
        codecs_manager.add_codec('algos.ICA', 'ICA', SimpleObjectCodec)
        codecs_manager.add_codec('sklearn.decomposition._fastica', 'FastICA', SimpleObjectCodec)

    def rename_output(self, default_names, new_names=None):
        if new_names is None:
            new_names = 'IC'
        output_names = ['{}_{}'.format(new_names, i + 1) for i in range(len(default_names))]
        return output_names
