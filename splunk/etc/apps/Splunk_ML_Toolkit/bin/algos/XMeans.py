"""
Implementation of XMeans algorithm based on
Pelleg, Dan, and Andrew W. Moore. "X-means: Extending K-means with Efficient Estimation of the Number of Clusters."
ICML. Vol. 1. 2000.
https://www.cs.cmu.edu/~dpelleg/download/xmeans.pdf
"""

import pandas as pd

from algos.KMeans import KMeans
from algos_support.clustering.derived_kmeans import Xmeans as _XMeans
from codec import codecs_manager
from codec.codecs import SimpleObjectCodec
from util.param_util import convert_params


class XMeans(KMeans):
    def __init__(self, options):
        self.handle_options(options)

        out_params = convert_params(options.get('params', {}), ints=['kmax', 'random_state'])
        kmax = out_params.get('kmax', 200)
        if kmax < 1:
            raise Exception("`kmax` cannot be less than 1")
        self.estimator = _XMeans(**out_params)
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
        codecs_manager.add_codec('algos.XMeans', 'XMeans', SimpleObjectCodec)
        codecs_manager.add_codec('algos.XMeans', '_XMeans', SimpleObjectCodec)
        # this _XMeans codec is added so that older models that were created using the old implemmentation still work
        codecs_manager.add_codec(
            'algos_support.clustering.derived_kmeans', 'Xmeans', SimpleObjectCodec
        )
