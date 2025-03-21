class OutlierThreshold(object):
    """Class to represent and work with outlier detection threshold.

    The purpose of this class is to consolidate these different forms and
    provide an interface for validation.
    Outlier threshold is specified in (only) one of the following forms:
    - threshold
    - lower_threshold
    - upper_threshold
    - (lower_threshold, upper_threshold)
    """

    MIN_ACCEPTABLE_THRESHOLD = 0.000000001
    MAX_ACCEPTABLE_THRESHOLD = 1

    def __init__(self, threshold, lower=None, upper=None, default_threshold=None):
        if threshold and (lower or upper):
            raise RuntimeError(
                'Thresholds are ambiguous: "threshold", and "lower_threshold"/"upper_threshold" can not be specified together.'
            )

        OutlierThreshold._check_is_in_range(threshold, 'threshold')
        OutlierThreshold._check_is_in_range(lower, 'lower_threshold')
        OutlierThreshold._check_is_in_range(upper, 'upper_threshold')

        if lower and upper:
            if (len(lower) > 1 and len(upper) > 0) or (len(upper) > 1 and len(lower) > 0):
                raise RuntimeError(
                    'With multiple thresholds, only one of "lower_threshold", "upper_threshold", or "threshold" can be specified.'
                )
            if len(lower) == 1 and len(upper) == 1 and lower[0] + upper[0] > 1.0:
                raise RuntimeError(
                    'The sum of "lower_threshold" and "upper_threshold" can not be larger than 1'
                )

        self.threshold = threshold or default_threshold
        self.lower = lower
        self.upper = upper

    @staticmethod
    def _check_is_in_range(threshold=None, name=None):
        if threshold:
            for thr in threshold:
                if (
                    thr < OutlierThreshold.MIN_ACCEPTABLE_THRESHOLD
                    or thr > OutlierThreshold.MAX_ACCEPTABLE_THRESHOLD
                ):
                    raise RuntimeError(
                        'Parameter "{}" must be between {:.9f} and {}'.format(
                            name,
                            OutlierThreshold.MIN_ACCEPTABLE_THRESHOLD,
                            OutlierThreshold.MAX_ACCEPTABLE_THRESHOLD,
                        )
                    )

    def is_lower_upper(self):
        return (self.lower or self.upper) is not None

    def is_specified(self):
        return bool(self.lower or self.upper or self.threshold)

    def total(self):
        if not self.is_specified():
            raise RuntimeError('Error obtaining the total value of an unspecified threshold')

        if self.is_lower_upper():
            if self.lower and self.upper:
                return ((self.lower[0] + self.upper[0]),)
            elif self.lower:
                return self.lower
            elif self.upper:
                return self.upper
        else:
            return self.threshold

    def is_multiple(self):
        return (
            (self.threshold is not None and len(self.threshold) > 1)
            or (self.lower is not None and len(self.lower) > 1)
            or (self.upper is not None and len(self.upper) > 1)
        )

    def get_size(self):
        assert self.is_multiple()
        # since threshold is never None by default we have to check it last
        if self.lower is not None:
            return len(self.lower)
        elif self.upper is not None:
            return len(self.upper)
        elif self.threshold is not None:
            return len(self.threshold)

    def get_multiple_thresholds(self):
        assert self.is_multiple()
        # since threshold is never None by default we have to check it last.
        # lower and upper can not exist together when they have multiple thresholds.
        return self.lower or self.upper or self.threshold

    def __repr__(self):
        return 'threshold {}, lower: {}, upper: {}'.format(
            self.threshold, self.lower, self.upper
        )
