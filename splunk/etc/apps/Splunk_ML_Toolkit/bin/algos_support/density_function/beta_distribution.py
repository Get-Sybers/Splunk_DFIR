from operator import itemgetter

import numpy as np
import scipy.stats as stats

from algos_support.density_function import NUMERIC_PRECISION
from algos_support.density_function.error import DistributionFitError, SamplingError
from algos_support.density_function.probability_distribution import ProbabilityDistribution
import cexc

logger = cexc.get_logger(__name__)


class BetaDistribution(ProbabilityDistribution):
    """Wrapper around scipy.stats.beta"""

    Name = 'Beta'

    def __init__(self):
        super(BetaDistribution, self).__init__()
        self._alpha = None  # Alpha value of the distribution function
        self._beta = None  # Beta value of the distribution function

    def fit(self, data, distance=None, exclude_dist=None):
        # Error out and do not fit Beta if all the values in the dataset are the same.
        # Normal distribution will be fit instead in auto mode.
        if np.allclose(data, data[0], 0.0001):
            raise DistributionFitError(
                'Unable to fit a Beta distribution due to numerical errors. All values in the dataset are the same.'
            )

        self.sample_first_chunk(data)

        # Beta distribution fits only in 0-1 range, scale the data between 0-1.
        normalized_data = (data - self._min) / (self._max - self._min)
        try:
            self._alpha, self._beta, self._mean, self._std = stats.beta.fit(normalized_data)
        except Exception as e:
            logger.debug(
                f'Unable to fit a Beta distribution due to numerical errors. For further debugging: {e}'
            )
            raise DistributionFitError(
                'Unable to fit a Beta distribution due to numerical errors.'
            )

        if self._alpha <= 0 or self._beta <= 0:
            # scipy could return bad values for _alpha and _beta. In that case, we switch to using
            # the method of Moments to compute _alpha and _beta (see https://en.wikipedia.org/wiki/Beta_distribution#Parameter_estimation).
            # Note that scipy uses MLE to estimmate _alpha and _beta.
            m = normalized_data.mean()
            v = sum((normalized_data - m) ** 2) / len(normalized_data)
            # Why didn't we just use self._std? Answer: this formula for v guarantees that _alpha and _beta will
            # be positive. If we set v = self._std ** 2, we'd get a bigger v, because it is the 'sample' variance, which is bigger than
            # the 'population' variance we just computed. And a bigger v could make _alpha and _beta negative.
            u = ((m * (1 - m)) / v) - 1
            self._alpha = m * u
            self._beta = (1 - m) * u

        self._other_params['Alpha'] = self._alpha
        self._other_params['Beta'] = self._beta
        if distance:
            self._metric = distance
            self._distance = self._get_distance(data, metric=distance)
            return self._distance

    def _find_anomaly_ranges(self, beta, threshold):
        """
        Search for ranges in the random variable domain, where the sum of
        areas under the curve of Beta distribution is approximately equal to threshold.
        Formally speaking:
            1) Finds the smallest T, such that:
                - For all x_i in the domain (random variable) where PDF(x_i) < T,
                    sum{PDF(x) dx} ~= threshold

            2) Return all x_i as a set of continuous ranges.

        Args:
            beta (stats.beta): Beta distribution object
            threshold (float): Anomaly threshold

        Returns:
            (list[(begin, end, area)]): List of ranges for anomalous areas of the univariate distribution,
            where each range is specified by beginning and end points. The third element of each range is the
            area under the curve that's covered by that range.
        """
        # Steps:
        # 1. Divide the range of random variable to equally spaced slots and
        # get the PDF at division points.
        # 2. Imagine a horizontal line through the Y axis (Y axis is density of the Beta distribution).
        # Find the best placement of line (i.e., the smallest density value) so
        # that the sum of area under the curve for points whose density is below
        # the line, is close to threshold.

        x_range = np.linspace(0, 1, 1000)
        densities = beta.pdf(x_range)
        upper = densities.max()
        lower = 0
        prev_area = None
        lower_limit = threshold * 0.999
        upper_limit = threshold * 1.001
        # Cap the number of iterations to 1000, so we don't end up
        # in an infinite loop in case for some reason convergence
        # does not happen fast enough
        for i in range(1000):
            middle = (upper + lower) / 2
            items = BetaDistribution._get_auc(beta, x_range, densities, middle)
            area = sum(map(itemgetter(2), items))
            rounded_area = round(area, NUMERIC_PRECISION)
            # The U shape gets into this if condition very quickly. We added another condition (i> max_iter) to prevent this.
            max_iter = 100 if (self._alpha < 1 or self._beta < 1) else 1
            if rounded_area == prev_area and i > max_iter:
                # no progress
                break
            prev_area = rounded_area
            # if we're reasonably close to target threshold call it a success
            if lower_limit < area < upper_limit:
                break
            elif area < lower_limit:
                lower = middle
            else:
                upper = middle
        # Set the ranges smaller than 0 and/or bigger than 1 as outlier area when left and/or right tail goes upward, -to infinity, because the distribution curve does not cover those areas.
        if self._alpha <= 1:
            items.insert(0, [-np.inf, 0, 0])
        if self._beta <= 1:
            items.append([1, np.inf, 0])
        return items

    def _find_anomaly_ranges_lower(self, beta, t_lower):
        """
        Returns anomaly range for the left tail only.
        Start with the whole area under the density curve and move the right end point towards left.
        """
        items = []
        # skip if it is like an exponential shape
        if self._alpha > 1:
            right = 1.0
            prev_area = None
            prev_right = right
            lower_limit = t_lower * 0.999
            upper_limit = t_lower * 1.001
            for _ in range(1000):
                # no need to subtract beta.cdf(0.0) since it is always 0.
                lower_area = beta.cdf(right)
                items = [0.0, right, lower_area]
                rounded_lower_area = round(lower_area, NUMERIC_PRECISION)
                if rounded_lower_area == prev_area:
                    break
                prev_area = rounded_lower_area
                if lower_limit < lower_area < upper_limit:
                    break
                elif lower_area < lower_limit:
                    right = (right + prev_right) / 2
                else:
                    prev_right = right
                    right = right / 2
        else:
            items = [-np.inf, 0, 0]
        return [items]

    def _find_anomaly_ranges_upper(self, beta, t_upper):
        """
        Returns anomaly range for the right tail only.
        Start with the whole area under the density curve. Move the left end point towards right.
        """
        items = []
        # skip if it is like a mirrored exponential shape
        if self._beta > 1:
            left = 0.0
            prev_area = None
            prev_left = left
            lower_limit = t_upper * 0.999
            upper_limit = t_upper * 1.001
            for _ in range(1000):
                # beta.cdf(1.0)=1.0
                upper_area = 1.0 - beta.cdf(left)
                items = [left, 1.0, upper_area]
                rounded_upper_area = round(upper_area, NUMERIC_PRECISION)
                if rounded_upper_area == prev_area:
                    break
                prev_area = rounded_upper_area
                if lower_limit < upper_area < upper_limit:
                    break
                elif upper_area < lower_limit:
                    left = (left + prev_left) / 2
                else:
                    prev_left = left
                    left = (left + 1.0) / 2
        else:
            items = [1, np.inf, 0]
        return [items]

    @staticmethod
    def _get_auc(beta, x_range, densities, max_density):
        """Find the areas (i.e., ranges on the X axis) under the density function curve,
          where the corresponding density of all points in these areas are <= max_density.

        Args:
            beta (stats.beta): Beta distribution object
            x_range (numpy.array): Array of values on the X axis
            densities (numpy.array): Array of probability densities for values of x_range
            max_density (float): The density value that specifies which points in the X axis are selected

        Returns:
            (list[(begin, end, area)]): List of ranges for areas where density of X values are less than
            max_density. The third element of each range is the area under the curve that's covered by that range.

        """
        idx = densities < max_density
        begin = None
        items = []
        for i in range(len(x_range)):
            if idx[i] and not begin:
                begin = x_range[i]
            elif not idx[i] and begin:
                # We know that `densities[i-1] < max_density` and `densities[i] >= max_density`.
                # So, we take `((x_range[i-1] + x_range[i]) / 2)`, hoping to get a better approximation
                items.append(
                    [
                        begin,
                        x_range[i],
                        beta.cdf((x_range[i - 1] + x_range[i]) / 2) - beta.cdf(begin),
                    ]
                )
                begin = None
        if begin:
            items.append([begin, x_range[i], beta.cdf(x_range[i]) - beta.cdf(begin)])
        return items

    def _rescale_anomaly_ranges(self, anomaly_ranges):
        # Rescale the normalized boundary values that are in range 0-1 to the actual range
        if anomaly_ranges:
            for ind in range(len(anomaly_ranges)):
                for ind2 in range(len(anomaly_ranges[ind])):
                    for i in range(2):
                        anomaly_ranges[ind][ind2][i] = (
                            anomaly_ranges[ind][ind2][i] * (self._max - self._min) + self._min
                        )
                    # Arrange for the first and last boundary items so that if the first range is
                    # on the left-most side of the distribution, then its opening point is -INF
                    # and if the last item is on the right-most side of the distribution then its
                    # closing point is INF (only if the tails are going down not up)
                    if not (self._alpha <= 1 and self._beta <= 1):
                        if ind2 == 0 or ind2 == len(anomaly_ranges[ind]) - 1:
                            if abs(anomaly_ranges[ind][ind2][0] - self._min) <= 0.01:
                                anomaly_ranges[ind][ind2][0] = -np.inf
                            if abs(anomaly_ranges[ind][ind2][1] - self._max) <= 0.01:
                                anomaly_ranges[ind][ind2][1] = np.inf

    def apply(self, data, threshold, params):
        dist = stats.beta(a=self._alpha, b=self._beta, loc=self._mean, scale=self._std)
        outliers = []
        anomaly_ranges = []
        if threshold.is_lower_upper():
            if threshold.lower is not None and threshold.upper is not None:
                for t_lower, t_upper in zip(threshold.lower, threshold.upper):
                    lower_ranges = self._find_anomaly_ranges_lower(dist, t_lower)
                    upper_ranges = self._find_anomaly_ranges_upper(dist, t_upper)
                    anomaly_ranges.append([lower_ranges[0], upper_ranges[0]])
                    self._rescale_anomaly_ranges(anomaly_ranges)
                    # Use original dataset with the rescaled anomaly_ranges to detect the outliers
                    BetaDistribution._update_outliers(data, anomaly_ranges, outliers)
            elif threshold.lower is not None:
                for t_lower in threshold.lower:
                    anomaly_ranges.append(self._find_anomaly_ranges_lower(dist, t_lower))
                    self._rescale_anomaly_ranges(anomaly_ranges)
                    BetaDistribution._update_outliers(data, anomaly_ranges, outliers)
            elif threshold.upper is not None:
                for t_upper in threshold.upper:
                    anomaly_ranges.append(self._find_anomaly_ranges_upper(dist, t_upper))
                    self._rescale_anomaly_ranges(anomaly_ranges)
                    BetaDistribution._update_outliers(data, anomaly_ranges, outliers)
        else:
            for thrshld in threshold.threshold:
                anomaly_ranges.append(self._find_anomaly_ranges(dist, thrshld))
                self._rescale_anomaly_ranges(anomaly_ranges)
                BetaDistribution._update_outliers(data, anomaly_ranges, outliers)

        boundary_ranges = BetaDistribution._make_boundary_ranges(anomaly_ranges, threshold)
        samples = (
            self.sample_within_boundaries(data.size, anomaly_ranges) if params.sample else None
        )
        if params.show_density:
            # (self._max-self._min) is never 0. In fit we error out if all data points are same. This guarantees self._min and self._max to be different.
            normalized_data = (data - self._min) / (self._max - self._min)
            densities = dist.pdf(normalized_data)
        else:
            densities = None
        full_samples = self.sample(data.size) if params.full_sample else None

        return BetaDistribution._create_result(
            outliers, boundary_ranges, densities, full_samples, samples
        )

    def sample(self, size):
        try:
            samples = stats.beta.rvs(
                a=self._alpha, b=self._beta, loc=self._mean, scale=self._std, size=size
            )
        except Exception as e:
            msg = 'Unable to sample from Beta distribution due to numerical errors.'
            logger.debug(f'{msg} For further debugging: {e}')
            raise SamplingError(msg)

        # Rescale the sample values to the actual range
        samples = (samples * (self._max - self._min)) + self._min
        return samples
