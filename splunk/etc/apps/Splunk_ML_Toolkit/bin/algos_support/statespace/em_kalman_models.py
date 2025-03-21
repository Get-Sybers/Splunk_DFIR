from math import ceil, isnan
from operator import itemgetter

import numpy as np
import pandas as pd
from scipy import signal
from scipy.stats import norm

from .em_kalman_algo import Multivariate, ForecastResult


def find_period(ts):
    """
    Args:
    ts (pandas Series): univariate time series
    Return:
    a nonnegative number for the period. The number is 0 if no period is detected.

    The algorithm is similar to the one proposed in the paper "On Periodicity Detection and Structural Periodic Similarity"
    by Vlachos, Yu and Castelli. It consists of two main parts: First, compute a set of hints for the priod using spectral analysis,
    Then, compute the true period using autocorrelation analysis. Our algorithm follows the first part exactly as in that paper.
    For the second part, ours is similar but different. As in the paper, we find peaks in the autocorrelations, but choose a simpler approach,
    by using thresholds.
    """

    if np.all(ts.values == ts.values[0]):
        # all numbers are equaled
        return 1

    # truncate long data since it'd be slow to compute
    MAXLEN = 50000
    ts = ts[-MAXLEN:]  # take the most recent data as they should be more relevant to the future

    # deal with missing values
    ts.interpolate(method='linear', inplace=True)

    # compute period hints using spectral analysis
    num_perms = 100
    max_powers = []

    np.random.seed(12345)
    for i in range(num_perms):
        ts2 = np.random.permutation(ts.values)
        f, Pxx = signal.periodogram(ts2, window='hamming', scaling='spectrum')
        max_powers.append(Pxx.max())

    percentile = 0.99
    max_powers.sort()
    power_thres = max_powers[int(percentile * len(max_powers))]

    f, Pxx = signal.periodogram(ts.values, window='hamming', scaling='spectrum')
    period_hints = [1 / f[i] for i in range(len(f)) if f[i] > 0 and Pxx[i] > power_thres]

    if len(period_hints) == 0:
        # this means the power_thres above was too aggressive. We'll take the min of max_powers in order to
        # make sure we get some period hints.
        power_thres = min(max_powers)
        period_hints = [1 / f[i] for i in range(len(f)) if f[i] > 0 and Pxx[i] > power_thres]

    period_hints.sort()

    # Pick out the period using autocorrelation analysis
    R = 20
    thres = 0.01
    periods = {}
    for p in period_hints:
        if p < 1:
            continue
        if p > len(ts) / 2:
            break
        new_range = list(range(max(2, int(p) - R), int(p) + R))
        cur_lag = new_range[0]
        cur = ts.autocorr(cur_lag)
        prev = cur
        peak_val = 0
        peak_lag = 0
        for q in new_range[1:]:
            nxt = ts.autocorr(q)
            if cur > nxt and cur >= prev:
                if cur > peak_val + thres:
                    peak_val = cur
                    peak_lag = cur_lag
            prev = cur
            cur = nxt
            cur_lag = q
        periods[peak_lag] = peak_val

    if len(periods) == 0:
        return 0
    period = max(iter(periods.items()), key=itemgetter(1))[0]
    if periods[period] > thres:
        return period
    return 0


def find_common_period(df, tol=0.05):
    """
    Args:
    df (pandas DataFrame): multivariate time series

    The function calls find_period() on each column and store the results in a list A.
    If any of the results is 0, returns (0, A). Assume all are non-zero. We prune any number in A
    that is divisible by another in A. The intuition is that a multiple of a period can also be a period,
    but we don't want them since we only want the smallest one.
    Next, we compute the mean and std of A. If std <= tol*mean,
    return (int(mean), A). Otherwise, return (0, A) where 0 means there is no common period.
    """
    n = len(df.columns)
    A = [0] * n
    period = 0
    has_common_period = True
    for i in range(n):
        A[i] = period = find_period(df.iloc[:, i])
        if A[i] == 0:
            has_common_period = False
    if not has_common_period or n == 1:
        return (period, A)
    # prune A and store results in array B
    B = [min(A)]
    for p in A:
        keep = True
        for q in B:
            if p % q == 0:
                keep = False
                break
        if keep:
            B.append(p)
    # compute mean and std
    mean = np.mean(B)
    std = np.std(B)
    if std <= tol * mean:
        return (int(mean), A)
    return (0, A)


def remove_holiday1(endog, exog):
    """
    This function removes the holiday effects from given time series (endog).
    Args:
    endog (numpy array): time series
    exog (numpy array): indicator series. If exog[i] != 0, there's a holiday effect at endog[i].

    Returns:
    Two numpy arrays
    1. An array containing the endog series, but without the holiday effects.
    2. An array containing the coefficients (or weights) that measure the holiday effect magnitudes.

    Algorithm:
    step 1: for each interval (a,b) of consecutive indices with holiday effects (ie, indices i where exog[i] != 0),
            compute the average X of endog[a] and endog[b]. Then subtract X from endog[i] for every i in (a,b).
            Store the differences in a diffs array.
    step 2: Divide the diffs array by the exog array to get the weights array.
            Compute the mean of the weights, call it coeff.
    step 3: Obtain the time series with holiday effects removed, by subtracting coeff*exog[i] from endog[i] for every i.
    """
    diffs = []
    ex = []
    i = 0
    while i < len(endog):
        if not np.isnan(exog[i]) and exog[i] != 0:
            right = i + 1
            while right < len(endog) and not np.isnan(exog[right]) and exog[right] != 0:
                right += 1
            if i == 0 and right == len(endog):
                raise ValueError("holiday field is not sparse enough")

            ex.extend(exog[i:right])

            if i == 0 or np.isnan(endog[i - 1]):
                X = endog[right]
            elif right == len(endog) or np.isnan(endog[right]):
                X = endog[i - 1]
            else:
                X = (endog[i - 1] + endog[right]) / 2

            diffs.extend(endog[i:right] - X)
            i = right
        else:
            i += 1
    if len(ex) == 0:
        return endog, 0
    coeff = np.average([diffs[j] / ex[j] for j in range(len(diffs)) if not np.isnan(diffs[j])])
    if np.isnan(coeff):
        return endog, 0
    return np.array([endog[j] - coeff * exog[j] for j in range(len(endog))]), coeff


def remove_holiday(endog, exog):
    """
    Args:
    endog and exog are numpy arrays.
    endog may have more than one columns, but exog must have exactly one column.
    len(endog) must be <= len(exog).
    """
    assert len(endog) <= len(exog)
    res = np.zeros(endog.shape)
    ncol = endog.shape[1]
    coefs = np.zeros(ncol)
    for i in range(ncol):
        res[:, i], coefs[i] = remove_holiday1(endog[:, i], exog)
    return res, coefs


def add_holiday(exog, coefs, result):
    """
    exog is 1-dimensional numpy array
    coefs is an array of len equaled to number of columns in pred
    """
    nrow, ncol, _ = result.shape()
    EX = np.array([[t] * ncol for t in exog[:nrow]])
    EX = np.multiply(coefs, EX)
    tmp = np.array([[[t] for t in u] for u in EX])
    result.pred += tmp
    result.upper += tmp
    result.lower += tmp


def copy_on_nan(df1, df2):
    """
    Replace the NaN values in df1 by values in df2 at corresponding positions.

    Args:
    df1 (numpy.array): may contain NaNs
    df2 (numpy.array): contains no NaNs and has length >= len(df1).

    Returns: none.
    """
    df2 = df2[: len(df1)].reshape(df1.shape)
    mask = np.isnan(df1)
    df1[mask] = df2[mask]


class KfModel(object):
    CONF = 0.95

    def __init__(self, endog, exog=None):
        '''
        endog and exog are numpy arrays
        '''
        if endog is not None:
            for i in range(endog.shape[1]):
                first_val = None
                start = 0
                for j in range(len(endog)):
                    num = float(endog[j][i])
                    if not isnan(num):
                        first_val = endog[j][i]
                        start = j
                        break
                for j in range(0, start):
                    endog[j][i] = first_val

            self.setData(endog, exog)

    def setData(self, endog, exog):
        assert len(endog) > 0
        if exog is None:
            self.endog, self.coefs = endog, 0
        else:
            self.endog, self.coefs = remove_holiday(endog, exog)
        self.exog = exog

    def fit(self, endog=None, exog=None, forecast_k=0, conf=CONF, start_model=0):
        '''
        endog and exog are numpy arrays
        '''
        # If endog parameter is not None, then we are fitting an existing model on new data.
        if endog is not None:
            if exog is not None and len(endog) + forecast_k > len(exog):
                raise ValueError("len(endog) + forecast_k > len(exog)")
            coefs = self.coefs
            self.setData(endog, exog)
            self.coefs = (self.coefs + coefs) / 2

    def apply(self, endog, exog=None, endog2=None, forecast_k=0, conf=CONF):
        assert len(endog) > 0
        if exog is not None:
            if len(endog) + forecast_k > len(exog):
                raise ValueError("len(endog) + forecast_k > len(exog)")
            X = np.zeros(endog.shape)
            nrow, ncol = X.shape
            for i in range(ncol):
                X[:, i] = endog[:, i] - self.coefs[i] * exog[:nrow]
        else:
            X = endog
        return X


class LinearKf(KfModel):
    """
    This class builds the most basic Kalman filter for a given multivariate time series.
    It learns the state dynamics, covariance of the noise, and initial state vector and state covariance from
    the data.

    The main attributes are:
    - mu0 (numpy array): initial state vector
    - Sigma0 (numpy matrix): initial state covariance
    - Phi (numpy matrix): state transition dynamics
    - Q (numpy matrix): transition noise covariance
    - R (numpy matrix): observation noise covariance
    - coefs (numpy array): coefficients for holiday effects
    """

    def __init__(self, endog, exog=None, mu0=None, Sigma0=None, Phi=None, Q=None, R=None):
        '''
        endog and exog are numpy arrays
        '''
        super(LinearKf, self).__init__(endog, exog)
        self.mu0, self.Sigma0, self.Phi, self.Q, self.R = mu0, Sigma0, Phi, Q, R

    def fit(self, endog=None, exog=None, forecast_k=0, conf=KfModel.CONF, start_model=0):
        super(LinearKf, self).fit(endog=endog, exog=exog, forecast_k=forecast_k)
        self.kf = Multivariate(self.endog)
        result = self.kf.fit(
            mu0=self.mu0,
            Sigma0=self.Sigma0,
            Phi=self.Phi,
            Q=self.Q,
            R=self.R,
            forecast_k=forecast_k,
            conf=conf,
        )
        self.mu0, self.Sigma0, self.Phi, self.Q, self.R = (
            self.kf.mu0,
            self.kf.Sigma0,
            self.kf.Phi,
            self.kf.Q,
            self.kf.R,
        )
        # add holiday effects back to forecasts
        if self.exog is not None:
            add_holiday(self.exog, self.coefs, result)
        return result

    def smooth_states(self):
        return self.kf.smooth_states()

    def forecast(self, exog=None, steps=0, conf=KfModel.CONF):
        result = self.kf.forecast(steps=steps, conf=conf)
        if exog is not None:
            add_holiday(exog, self.coefs, result)
        return result

    def apply(
        self,
        endog,
        exog=None,
        endog2=None,
        forecast_k=0,
        conf=KfModel.CONF,
        start_model=0,
        return_smooth_states=False,
    ):
        if endog is None:
            return None, None, None, None
        X = super(LinearKf, self).apply(
            endog=endog, exog=exog, endog2=endog2, forecast_k=forecast_k
        )
        self.kf = Multivariate(
            X, mu0=self.mu0, Sigma0=self.Sigma0, Phi=self.Phi, Q=self.Q, R=self.R
        )
        result, smooth_states = self.kf.apply(X, data2=endog2, forecast_k=forecast_k, conf=conf)
        # add holiday effects back to forecasts
        if exog is not None:
            add_holiday(exog, self.coefs, result)
        if return_smooth_states:
            return result, smooth_states
        return result

    def encode(self):
        return {
            "KfModel": "LinearKf",
            "mu0": self.mu0,
            "Sigma0": self.Sigma0,
            "Phi": self.Phi,
            "Q": self.Q,
            "R": self.R,
            "coefs": self.coefs,
        }

    @classmethod
    def decode(cls, dct):
        model = LinearKf(None)
        model.mu0 = dct["mu0"]
        model.Sigma0 = dct["Sigma0"]
        model.Phi = dct["Phi"]
        model.Q = dct["Q"]
        model.R = dct["R"]
        model.coefs = dct["coefs"]
        return model


class PeriodicKf(KfModel):
    """
    This model deals with periodic time series.
    It divides the time series into p ( = period) sub-series, build a linear model for each,
    and uses the models' forecasts to forecast for the original series.

    The main attributes are:
    - period (int): period of the time series. The user must supply this period in the constructor.
    - linearKf (str): name of the linear model class. Default to "LinearKf". Its purpose is to make the code
        flexible, in case we decide to use other linear models in the future.
    - coefs (numpy array of floats): stores the holiday effect coefficients for the individual time series.
        See the discription in remove_holiday1() function above.
    """

    def __init__(self, endog, period=2, exog=None, linearKf="LinearKf"):
        '''
        endog and exog are numpy arrays
        '''
        if endog is not None:
            super(PeriodicKf, self).__init__(endog, exog)
            assert period > 1
            self.period = period
            self.linearKf = linearKf

    def _process_submodels(self, endog, endog2, exog, forecast_k, conf, start_model, func_obj):
        result = ForecastResult(endog.shape[0] + forecast_k, endog.shape[1])
        period = self.period
        steps = int(ceil(float(forecast_k) / period))
        for i in range(period):
            model_num = (start_model + i) % period
            inp = endog[i::period]
            inp2 = endog2[i::period] if endog2 is not None else None
            sub_result = func_obj(model_num, inp, inp2, steps)
            result.copy(sub_result, start=i, step=period)
        if exog is not None:
            add_holiday(exog, self.coefs, result)
        return result

    def fit(self, endog=None, exog=None, forecast_k=0, conf=KfModel.CONF, start_model=0):
        super(PeriodicKf, self).fit(endog=endog, exog=exog, forecast_k=forecast_k)
        self.models = [None] * self.period
        linearKf = KFMODELS[self.linearKf]

        def fit_submodel(model_num, inp, inp2, steps):
            mu0, Sigma0, Phi, Q, R = None, None, None, None, None
            model = linearKf(inp, mu0=mu0, Sigma0=Sigma0, Phi=Phi, Q=Q, R=R)
            sub_result = model.fit(forecast_k=steps, conf=conf)
            self.models[model_num] = model
            return sub_result

        return self._process_submodels(
            self.endog, None, self.exog, forecast_k, conf, start_model, fit_submodel
        )

    def apply(
        self, endog, exog=None, endog2=None, forecast_k=0, conf=KfModel.CONF, start_model=0
    ):
        if endog is None:
            return None, None, None, None
        X = super(PeriodicKf, self).apply(
            endog=endog, exog=exog, endog2=endog2, forecast_k=forecast_k
        )

        def apply_submodel(model_num, inp, inp2, steps):
            sub_result = self.models[model_num].apply(
                inp, endog2=inp2, forecast_k=steps, conf=conf
            )
            return sub_result

        return self._process_submodels(
            X, endog2, exog, forecast_k, conf, start_model, apply_submodel
        )

    def encode(self):
        return {
            "KfModel": "PeriodicKf",
            "models": [md.encode() for md in self.models],
            "linearKf": self.linearKf,
            "coefs": self.coefs,
            "period": self.period,
        }

    @classmethod
    def decode(cls, dct):
        model = PeriodicKf(None)
        model.linearKf = dct["linearKf"]
        model.models = []
        linearKf = KFMODELS[model.linearKf]
        for md in dct["models"]:
            model.models.append(linearKf.decode(md))
        model.period = dct["period"]
        model.coefs = dct["coefs"]
        return model


class PeriodicKf2(KfModel):
    """
    This model deals with periodic time series, just like PeriodicKf. The difference is that it uses two models, a PeriodicKf
    and a LinearKf, to forecast. The PeriodicKf model accounts for the periodicity in the data, while the LinearKf model accounts
    for the immidate past data.
    """

    def __init__(self, endog, period=2, exog=None, linearKf="LinearKf"):
        '''
        endog and exog are numpy arrays
        '''
        if endog is not None:
            super(PeriodicKf2, self).__init__(endog, exog)
            assert period > 1
            self.lin = LinearKf(self.endog)
            self.per = PeriodicKf(self.endog, period, linearKf=linearKf)

    def _combine_results(self, res1, res2, conf=KfModel.CONF):
        res = ForecastResult()
        tmp = res1.var + res2.var
        # tmp can't have any 0 because if it did, then both var1 and var2 would be 0.
        # That means both linear and periodic models predicted exactly, which couldn't be unless period = 1, which we excluded.
        res.pred = ((res2.var * res1.pred) + (res1.var * res2.pred)) / tmp
        res.var = (res1.var * res2.var) / tmp
        conf_factor = norm.interval(conf)[1]
        conf_interval = conf_factor * np.sqrt(res.var)
        res.upper = res.pred + conf_interval
        res.lower = res.pred - conf_interval
        return res

    def fit(self, endog=None, exog=None, forecast_k=0, start_model=0, conf=KfModel.CONF):
        super(PeriodicKf2, self).fit(endog=endog, exog=exog, forecast_k=forecast_k)
        result1 = self.lin.fit(endog=endog, exog=exog, forecast_k=forecast_k, conf=conf)

        # If endog or self.endog have too many nan, it may result in some submodel
        # of self.per to have input consisting of only nan. Hence we will impute
        # all nan values by copying the smooth states of self.lin to the positions where endog is nan.
        if endog is None:
            copy_on_nan(self.per.endog, self.lin.smooth_states())
        else:
            copy_on_nan(endog, self.lin.smooth_states())

        result2 = self.per.fit(
            endog=endog, exog=exog, forecast_k=forecast_k, conf=conf, start_model=start_model
        )
        result = self._combine_results(result1, result2, conf=conf)
        if self.exog is not None:
            add_holiday(self.exog, self.coefs, result)
        return result

    def apply(
        self, endog, exog=None, endog2=None, forecast_k=0, start_model=0, conf=KfModel.CONF
    ):
        if endog is None:
            return None, None, None, None
        X = super(PeriodicKf2, self).apply(
            endog=endog, exog=exog, endog2=endog2, forecast_k=forecast_k
        )
        result1, smooth_states = self.lin.apply(
            X, endog2=endog2, forecast_k=forecast_k, conf=conf, return_smooth_states=True
        )
        copy_on_nan(endog, smooth_states)
        if len(endog) + len(result1) > self.per.period:
            if len(endog) < self.per.period:
                padding = [x.flatten() for x in result1.pred[: self.per.period - len(endog)]]
                endog = np.append(endog, padding, axis=0)
                forecast_k -= len(padding)
                X = super(PeriodicKf2, self).apply(
                    endog=endog, exog=exog, endog2=endog2, forecast_k=forecast_k
                )
            result2 = self.per.apply(
                X, endog2=endog2, forecast_k=forecast_k, conf=conf, start_model=start_model
            )
            result = self._combine_results(result1, result2, conf=conf)
        else:
            result = result1
        if exog is not None:
            add_holiday(exog, self.coefs, result)
        return result

    def encode(self):
        return {
            "KfModel": "PeriodicKf2",
            "lin": self.lin.encode(),
            "per": self.per.encode(),
            "coefs": self.coefs,
        }

    @classmethod
    def decode(cls, dct):
        model = PeriodicKf2(None)
        model.lin = LinearKf.decode(dct["lin"])
        model.per = PeriodicKf.decode(dct["per"])
        model.coefs = dct["coefs"]
        return model


KFMODELS = {"LinearKf": LinearKf, "PeriodicKf": PeriodicKf, "PeriodicKf2": PeriodicKf2}


class MasterKf(KfModel):
    """
    This model combines all of the above models. It first checks if the user input a period. If not, the model
    calculates it. If there is no periodicity, the model constructs a LinearKf model and uses it to forecast. Otherwise,
    it constructs a PeriodicKf2 model to do the forecasting.
    The StateSpaceForecast algorithm will only know about this class.
    """

    def __init__(self, endog, exog=None, period=0, linearKf="LinearKf"):
        '''
        endog and exog are numpy arrays
        '''
        if endog is not None:
            if (
                period == 0
            ):  # this means the user didn't set the period option, so we compute it
                period, _ = find_common_period(pd.DataFrame(endog))
            if period <= 1:
                self.model = LinearKf(endog, exog=exog)
            else:
                self.model = PeriodicKf2(endog, period, exog=exog, linearKf=linearKf)
            self.period = period
            self.with_holiday = True if exog is not None else False

    def fit(self, endog=None, exog=None, forecast_k=0, start_model=0, conf=KfModel.CONF):
        return self.model.fit(
            endog=endog, exog=exog, forecast_k=forecast_k, conf=conf, start_model=start_model
        )

    def apply(
        self, endog, exog=None, endog2=None, forecast_k=0, start_model=0, conf=KfModel.CONF
    ):
        return self.model.apply(
            endog=endog,
            exog=exog,
            endog2=endog2,
            forecast_k=forecast_k,
            conf=conf,
            start_model=start_model,
        )

    def encode(self):
        dct = self.model.encode()
        dct["model_type"] = type(self.model).__name__
        dct["period"] = self.period
        dct["with_holiday"] = self.with_holiday
        return dct

    @classmethod
    def decode(cls, dct):
        kf = MasterKf(None)
        kf.model = KFMODELS[dct["model_type"]].decode(dct)
        kf.period = dct["period"]
        kf.with_holiday = dct["with_holiday"]
        return kf
