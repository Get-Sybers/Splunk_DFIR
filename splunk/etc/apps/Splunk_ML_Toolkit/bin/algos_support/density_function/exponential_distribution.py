import numpy as np
import scipy.stats as stats

from algos_support.density_function.error import DistributionFitError
from algos_support.density_function.probability_distribution import ProbabilityDistribution


class ExponentialDistribution(ProbabilityDistribution):
    """Wrapper around scipy.stats.expon"""

    Name = 'Exponential'

    def fit(self, data, distance=None, exclude_dist=None):
        # Error out and do not fit Exponential if all the values in the dataset are the same.
        # Normal distribution will be fit instead in auto mode.
        if np.allclose(data, data[0], 0.0001):
            raise DistributionFitError(
                'Unable to fit an Exponential distribution due to numerical errors. All values in the dataset are the same.'
            )
        self.sample_first_chunk(data)
        self._mean, self._std = stats.expon.fit(data)
        if distance:
            self._metric = distance
            self._distance = self._get_distance(data, metric=distance)
            return self._distance

    def apply(self, data, threshold, params):
        dist = stats.expon(loc=self._mean, scale=self._std)
        outliers = []
        anomaly_ranges = []
        if threshold.is_lower_upper():
            if threshold.upper is not None and threshold.lower is not None:
                for u in threshold.upper:
                    anomaly_ranges.append(
                        [[-np.inf, self._min, 0], [dist.ppf(1 - u), np.inf, u]]
                    )
                    ExponentialDistribution._update_outliers(data, anomaly_ranges, outliers)
            elif threshold.upper is not None:
                for u in threshold.upper:
                    anomaly_ranges.append([[dist.ppf(1 - u), np.inf, u]])
                    ExponentialDistribution._update_outliers(data, anomaly_ranges, outliers)
            else:
                for _ in threshold.lower:
                    anomaly_ranges.append([[-np.inf, self._min, 0]])
                    ExponentialDistribution._update_outliers(data, anomaly_ranges, outliers)
        else:
            for thrshld in threshold.threshold:
                anomaly_ranges.append(
                    [[-np.inf, self._min, 0], [dist.ppf(1 - thrshld), np.inf, thrshld]]
                )
                ExponentialDistribution._update_outliers(data, anomaly_ranges, outliers)
        boundary_ranges = ExponentialDistribution._make_boundary_ranges(
            anomaly_ranges, threshold
        )
        densities = dist.pdf(data) if params.show_density else None
        full_samples = self.sample(data.size) if params.full_sample else None
        samples = (
            self.sample_within_boundaries(data.size, anomaly_ranges) if params.sample else None
        )
        return self._create_result(outliers, boundary_ranges, densities, full_samples, samples)

    def sample(self, size):
        return stats.expon(loc=self._mean, scale=self._std).rvs(size)
