"""
Implementation of GMeans algorithm based on
"Learning the k in k-means", by Greg Hamerly, Charles Elkan
https://papers.nips.cc/paper/2526-learning-the-k-in-k-means.pdf
"""

import pandas as pd

from algos.KMeans import KMeans
from algos_support.clustering.derived_kmeans import Gmeans as _GMeans
from codec import codecs_manager
from codec.codecs import SimpleObjectCodec
from util.param_util import convert_params


class GMeans(KMeans):
    def __init__(self, options):
        self.handle_options(options)

        out_params = convert_params(options.get('params', {}), ints=['kmax', 'random_state'])
        kmax = out_params.get('kmax', 200)
        if kmax < 1:
            raise Exception("`kmax` cannot be less than 1")
        self.estimator = _GMeans(**out_params)
        self.estimator._n_threads = 1

    def summary(self, options):
        if len(options) != 2:  # only model name and mlspl_limits
            raise RuntimeError(
                "{} models do not take options for summarization".format(
                    self.__class__.__name__
                )
            )

        df = pd.DataFrame(data=self.estimator.cluster_centers_, columns=self.columns)
        df['cluster'] = pd.Series(
            list(map(str, list(range(len(self.estimator.cluster_centers_))))), df.index
        )
        df['inertia'] = self.estimator.inertia_
        df['n_clusters'] = self.estimator.n_clusters
        return df

    @staticmethod
    def register_codecs():
        codecs_manager.add_codec('algos.GMeans', 'GMeans', SimpleObjectCodec)
        codecs_manager.add_codec(
            'algos_support.clustering.derived_kmeans', 'Gmeans', SimpleObjectCodec
        )
