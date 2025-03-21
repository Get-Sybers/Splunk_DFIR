from operator import itemgetter

from algos_support.density_function import MAX_DEFAULT_PARAM_SIZE
from algos_support.density_function.distance_metric import DistanceMetric
from algos_support.density_function.error import DistributionFitError, SamplingError
from algos_support.density_function.exponential_distribution import ExponentialDistribution
from algos_support.density_function.kde_distribution import KDEDistribution
from algos_support.density_function.normal_distribution import NormalDistribution
from algos_support.density_function.probability_distribution import (
    ProbabilityDistribution,
    DistributionType,
)
from algos_support.density_function.beta_distribution import BetaDistribution
import cexc

logger = cexc.get_logger(__name__)


def get_distribution(name, mlspl_limits):
    """Factory function to create an instance of ProbabilityDistribution given the parameters"""
    distributions = {
        DistributionType.NORMAL: NormalDistribution,
        DistributionType.EXPONENTIAL: ExponentialDistribution,
        DistributionType.GAUSSIAN_KDE: KDEDistribution,
        DistributionType.BETA: BetaDistribution,
        DistributionType.AUTO: AutoSelectDistribution,
    }

    dist = distributions.get(name)
    if not dist:
        raise RuntimeError('Invalid distribution {}'.format(name))

    kwargs = {}
    if name == DistributionType.GAUSSIAN_KDE:
        kwargs['max_param_size'] = int(
            mlspl_limits.get('max_kde_parameter_size', MAX_DEFAULT_PARAM_SIZE)
        )
    elif name == DistributionType.AUTO:
        kwargs = mlspl_limits
    return dist(**kwargs)


class AutoSelectDistribution(ProbabilityDistribution):
    """A ProbabilityDistribution that itself is a wrapper
    around a dynamically chosen instance of ProbabilityDistribution"""

    Name = 'Auto'

    # The set of distributions that we will fit and select from
    distributions = [
        DistributionType.NORMAL,
        DistributionType.EXPONENTIAL,
        DistributionType.GAUSSIAN_KDE,
        DistributionType.BETA,
    ]

    def __init__(self, **kwargs):
        super(AutoSelectDistribution, self).__init__()
        self._dist = None
        self._distance = None
        self._metric = None
        self._exclude_dist = None
        self._mlspl_limits = kwargs

    def fit(self, data, distance=DistanceMetric.KOLMOGOROV_SMIRNOV, exclude_dist=None):
        fitted_dists = []
        self._exclude_dist = exclude_dist
        distribution_list = (
            [d for d in AutoSelectDistribution.distributions if d not in self._exclude_dist]
            if self._exclude_dist
            else AutoSelectDistribution.distributions
        )
        for dist_type in distribution_list:
            dist = get_distribution(dist_type, self._mlspl_limits)
            try:
                score = dist.fit(data, distance)
            except (DistributionFitError, SamplingError) as ex:
                # Log and ignore in the auto mode
                logger.info(ex)
            else:
                fitted_dists.append((dist, score))
        best_fit = min(fitted_dists, key=itemgetter(1))
        self._dist = best_fit[0]
        self._dist._distance = best_fit[1]
        self._dist._metric = distance
        self._metric = distance
        self._data = dist._data
        if self._cardinality is None:
            self._cardinality = data.shape[0]
        return best_fit[1]

    def apply(self, data, threshold, params):
        return self._dist.apply(data, threshold=threshold, params=params)

    def summary(self):
        summary = self._dist.summary()
        summary['type'] = '{}: {}'.format(self.Name, summary['type'])
        summary['cardinality'] = self._cardinality
        return summary

    def sample_within_boundaries(self, size, boundaries):
        return self._dist.sample_within_boundaries(size, boundaries)

    def sample(self, size):
        return self._dist.sample(size)

    def get_name(self):
        return self._dist.get_name()
