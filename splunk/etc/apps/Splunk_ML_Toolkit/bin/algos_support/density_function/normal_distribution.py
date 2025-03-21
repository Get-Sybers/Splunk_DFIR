from collections import OrderedDict
import numpy as np
import scipy.stats as stats

from algos_support.density_function import NUMERIC_PRECISION
from algos_support.density_function.probability_distribution import ProbabilityDistribution


class NormalDistribution(ProbabilityDistribution):
    """Wrapper around scipy.stats.norm"""

    Name = 'Normal'

    def fit(self, data, distance=None, exclude_dist=None):
        self.sample_first_chunk(data)
        self._mean, self._std = stats.norm.fit(data)
        # when the std of the density function is 0 smooth the function by updating std with a very low value
        if self._std == 0:
            self._std = ProbabilityDistribution.REPLACE_ZERO_STD
        if distance:
            self._metric = distance
            self._distance = self._get_distance(data, metric=distance)
            return self._distance

    @staticmethod
    def _make_boundary_ranges(lower_boundary, upper_boundary, threshold):
        lower_boundary = (
            [round(lower, NUMERIC_PRECISION) for lower in lower_boundary]
            if lower_boundary
            else None
        )
        upper_boundary = (
            [round(upper, NUMERIC_PRECISION) for upper in upper_boundary]
            if upper_boundary
            else None
        )
        # Boundary range is one of the following
        # [(-infinity, lower, area), (upper, infinity, area)]
        # [(-infinity, lower, area)]
        # [(upper, infinity, area)]
        boundary_ranges = OrderedDict()
        if threshold.is_lower_upper():
            if lower_boundary is not None and upper_boundary is not None:
                boundary_ranges["{},{}".format(threshold.lower[0], threshold.upper[0])] = [
                    [-np.inf, lower_boundary[0], threshold.lower[0]],
                    [upper_boundary[0], np.inf, threshold.upper[0]],
                ]
            elif lower_boundary is not None:
                for lower, thrshld in zip(lower_boundary, threshold.lower):
                    boundary_ranges["{}".format(thrshld)] = [[-np.inf, lower, thrshld]]
            elif upper_boundary is not None:
                for upper, thrshld in zip(upper_boundary, threshold.upper):
                    boundary_ranges["{}".format(thrshld)] = [[upper, np.inf, thrshld]]
        else:
            for thrshld, lower, upper in zip(
                threshold.threshold, lower_boundary, upper_boundary
            ):
                boundary_ranges[thrshld] = [
                    [-np.inf, lower, thrshld / 2],
                    [upper, np.inf, thrshld / 2],
                ]
        return boundary_ranges

    def apply(self, data, threshold, params):
        dist = stats.norm(loc=self._mean, scale=self._std)
        outliers = []
        if threshold.is_lower_upper():
            lower = [dist.ppf(l) for l in threshold.lower] if threshold.lower else None
            upper = [dist.ppf(1 - u) for u in threshold.upper] if threshold.upper else None
            if lower is not None and upper is not None:
                for l, u in zip(lower, upper):
                    tmp_outliers = np.zeros(data.shape[0])
                    tmp_outliers[(data < l)] = 1
                    tmp_outliers[(data > u)] = 1
                    outliers.append(tmp_outliers)
            else:
                if lower:
                    for l in lower:
                        tmp_outliers = np.zeros(data.shape[0])
                        tmp_outliers[(data < l)] = 1
                        outliers.append(tmp_outliers)
                if upper:
                    for u in upper:
                        tmp_outliers = np.zeros(data.shape[0])
                        tmp_outliers[(data > u)] = 1
                        outliers.append(tmp_outliers)
        else:
            lower = []
            upper = []
            for thrshld in threshold.threshold:
                lower.append(dist.ppf(thrshld / 2))
                upper.append(dist.ppf(1 - thrshld / 2))
                tmp_outliers = np.zeros(data.shape[0])
                tmp_outliers[(data < lower[-1])] = 1
                tmp_outliers[(data > upper[-1])] = 1
                outliers.append(tmp_outliers)
        densities = dist.pdf(data) if params.show_density else None
        boundary_ranges = NormalDistribution._make_boundary_ranges(lower, upper, threshold)
        full_samples = self.sample(data.size) if params.full_sample else None
        if params.sample:
            # in case of multiple thresholds make sure that the length of both lower and upper outlier ranges lists are same even though one of them is None
            if lower is None:
                len_ranges = len(upper)
                lower = [lower] * len_ranges
            elif upper is None:
                len_ranges = len(lower)
                upper = [upper] * len_ranges
            else:
                len_ranges = len(lower)
            samples = self.sample_within_boundaries(
                data.size,
                [
                    list(p)
                    for p in zip(
                        zip([-np.inf] * len_ranges, lower), zip(upper, [np.inf] * len_ranges)
                    )
                ],
            )
        else:
            samples = None
        return NormalDistribution._create_result(
            outliers, boundary_ranges, densities, full_samples, samples
        )

    def sample(self, size):
        return stats.norm(loc=self._mean, scale=self._std).rvs(size)
