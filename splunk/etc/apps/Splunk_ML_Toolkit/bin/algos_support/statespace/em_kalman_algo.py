import numpy as np
from math import log
from numpy.linalg import inv, det
from numpy import array, ndarray, matmul as mm
from scipy.stats import norm

from algos_support.statespace.error import SingularMatrixError


"""
Implement Kalman Filter as in the book "Time Series Analysis and Its Applications with R Examples"
(Fourth Edition, Springer 2017) by Robert Shumway and David Stoffer.
"""


"""
This class implements the equations stated in Property 6.1 in the book.
"""


class KFilter(object):
    def __init__(self, data, mu0, Sigma0, Phi, Q, R):
        self.data = data  # numpy.ndarray
        assert len(self.data) > 0
        self.num = data.shape[0] + 1  # num data points plus the initial state
        self.dim = data.shape[1]  # state dim
        self.mu0 = mu0  # initial state
        self.Sigma0 = Sigma0  # initial state covariance
        self.Phi = Phi.copy()  # transition matrix
        self.Phit = self.Phi.T
        self.A = np.eye(self.dim)  # observation matrix
        self.Q = Q.copy()  # transition covariance
        self.R = R.copy()  # observation covariance
        self.xp = ndarray([self.num, self.dim, 1])  # xp = x_t^{t-1}
        self.xf = ndarray([self.num, self.dim, 1])  # xf = x_t^t
        self.Pp = ndarray([self.num, self.dim, self.dim])  # Pp = P_t^{t-1}
        self.Pf = ndarray([self.num, self.dim, self.dim])  # Pf = P_t^t
        self.K = ndarray([self.dim, self.dim])  # gain factor
        self.like = 0.0  # likelihood

    def update(self, y, x, P):
        """
        Update one step of the Kalman recursion.
        All parameters and returned values are numpy arrays of various dimensions.

        Args:
        y: observation at time step t
        x: previous state vector = x_(t-1)^(t-1) in the book
        P: previous state covariance = P_(t-1)^(t-1)

        Returns:
        xp: state vector after applying dynamics = x_t^(t-1)
        xf: state vector after incorporating y_t = x_t^t
        Pp: state covariance after applying dynamics = P_t^(t-1)
        Pf: state covariance after incorporating y_t = P_t^t
        K: gain factor at t
        like: likelihood given y_1, ..., y_t
        """
        xp = mm(self.Phi, x)
        Pp = mm(mm(self.Phi, P), self.Phit) + self.Q
        if np.any(np.isnan(y)):
            yc = y.copy()
            missing_vals = np.isnan(y).flatten()
            A = self.A
            for i in range(len(missing_vals)):
                if missing_vals[i]:
                    yc[i] = 0.0
                    A[i][i] = 0.0
            v = yc - mm(A, xp)
            sig = mm(mm(A, Pp), A) + self.R  # note: A.T = A
            try:
                siginv = inv(sig)
            except Exception as e:
                raise SingularMatrixError(e)
            K = mm(mm(Pp, A), siginv)
            xf = xp + mm(K, v)
            Pf = Pp - mm(mm(K, A), Pp)
            like = log(abs(det(sig))) + mm(mm(v.T, siginv), v)[0][0]
            for i in range(len(missing_vals)):
                if missing_vals[i]:
                    A[i][i] = 1.0
            return xp, xf, Pp, Pf, K, like
        v = y - xp
        sig = Pp + self.R
        try:
            siginv = inv(sig)
        except Exception as e:
            raise SingularMatrixError(e)
        K = mm(Pp, siginv)
        xf = xp + mm(K, v)
        Pf = Pp - mm(K, Pp)
        like = log(abs(det(sig))) + mm(mm(v.T, siginv), v)[0][0]
        return xp, xf, Pp, Pf, K, like

    def filter(self):
        self.xf[0][:] = self.mu0
        self.Pf[0][:] = self.Sigma0
        for i in range(1, self.num):
            [
                self.xp[i][:],
                self.xf[i][:],
                self.Pp[i][:],
                self.Pf[i][:],
                self.K,
                like,
            ] = self.update(self.data[i - 1], self.xf[i - 1], self.Pf[i - 1])
            self.like += like


"""
This class implements the equations stated in Property 6.2 in the book.
"""


class KSmooth(object):
    def __init__(self, data, mu0, Sigma0, Phi, Q, R):
        self.kf = KFilter(data, mu0, Sigma0, Phi, Q, R)
        self.num = num = self.kf.num
        self.dim = dim = self.kf.dim
        self.xs = ndarray([num, dim, 1])  # xs = x_t^n
        self.Ps = ndarray([num, dim, dim])  # Ps = P_t^n
        self.J = ndarray([num, dim, dim])  # J = J_t

    def smooth(self):
        kf = self.kf
        kf.filter()
        self.like = kf.like
        self.K = kf.K
        self.Pf = kf.Pf
        xs = self.xs
        Ps = self.Ps
        J = self.J
        xs[-1][:] = kf.xf[-1]
        Ps[-1][:] = kf.Pf[-1]
        for k in range(kf.num - 1, 0, -1):
            try:
                J[k - 1][:] = mm(mm(kf.Pf[k - 1], kf.Phit), inv(kf.Pp[k]))
            except Exception as e:
                raise SingularMatrixError(e)
            xs[k - 1][:] = kf.xf[k - 1] + mm(J[k - 1], (xs[k] - kf.xp[k]))
            Ps[k - 1][:] = kf.Pf[k - 1] + mm(mm(J[k - 1], (Ps[k] - kf.Pp[k])), J[k - 1].T)


"""
This class implements the equations stated in Property 6.3, The Lag-One Covariance Smoother,
and equations (6.65), (6.66), (6.67), (6.68), (6.69), (6.70), and (6.71) in the book.
"""


class KEM(object):
    def __init__(self, data, mu0, Sigma0, Phi, Q, R):
        self.data = data  # numpy.ndarray
        assert len(self.data) > 0
        self.num = len(data) + 1  # num data points plus the initial state
        self.dim = len(data[0])  # state dim
        self.mu0 = mu0.copy()  # initial state
        self.Sigma0 = Sigma0.copy()  # initial state covariance
        self.Phi = Phi.copy()  # transition matrix
        self.Phit = self.Phi.T
        self.A = np.eye(self.dim)  # observation matrix
        self.Q = Q.copy()  # transition covariance
        self.R = R.copy()  # observation covariance

    def em(self, maxiter=50, tol=0.05):
        like = np.zeros(maxiter)
        mu0 = self.mu0
        Sigma0 = self.Sigma0
        Phi = self.Phi
        Q = self.Q
        R = self.R
        Pcs = ndarray([self.num, self.dim, self.dim])
        eye = np.eye(self.dim)
        zero = np.zeros([self.dim, self.dim])
        S11 = ndarray([self.dim, self.dim])
        S10 = ndarray([self.dim, self.dim])
        S00 = ndarray([self.dim, self.dim])
        A = self.A
        for i in range(maxiter):
            ks = KSmooth(self.data, mu0, Sigma0, Phi, Q, R)
            ks.smooth()
            like[i] = ks.like
            if i > 0:
                cvg = like[i - 1] - like[i]
                if cvg < 0 or abs(cvg) < tol * abs(like[i - 1]):
                    # Likelihood not increasing enough
                    break
            # Compute Lag-One covariance smoothers
            if np.any(np.isnan(self.data[-1])):
                missing_vals = np.isnan(self.data[-1]).flatten()
                A = self.A
                for i in range(len(missing_vals)):
                    if missing_vals[i]:
                        A[i][i] = 0
                Pcs[-1][:] = mm(mm(eye - mm(ks.K, A), Phi), ks.Pf[-2])
                for i in range(len(missing_vals)):
                    if missing_vals[i]:
                        A[i][i] = 1
            else:
                Pcs[-1][:] = mm(mm(eye - ks.K, Phi), ks.Pf[-2])
            for k in range(self.num - 1, 0, -1):
                Jprime = ks.J[k - 2].T
                Pcs[k - 1][:] = mm(ks.Pf[k - 1], Jprime) + mm(
                    mm(ks.J[k - 1], Pcs[k] - mm(Phi, ks.Pf[k - 1])), Jprime
                )
            # Estimation
            S11[:] = zero
            S10[:] = zero
            S00[:] = zero
            R[:] = zero
            for k in range(1, self.num):
                S11 += mm(ks.xs[k], ks.xs[k].T) + ks.Ps[k]
                S10 += mm(ks.xs[k], ks.xs[k - 1].T) + Pcs[k]
                S00 += mm(ks.xs[k - 1], ks.xs[k - 1].T) + ks.Ps[k - 1]
                if np.any(np.isnan(self.data[k - 1])):
                    missing_vals = np.isnan(self.data[k - 1]).flatten()
                    yc = self.data[k - 1].copy()
                    for i in range(len(missing_vals)):
                        if missing_vals[i]:
                            A[i][i] = 0
                            yc[i] = 0
                    u = yc - mm(A, ks.xs[k])
                    R += mm(u, u.T) + mm(mm(A, ks.Ps[k]), A)
                    for i in range(len(missing_vals)):
                        if missing_vals[i]:
                            A[i][i] = 1
                else:
                    u = self.data[k - 1] - ks.xs[k]
                    R += mm(u, u.T) + ks.Ps[k]
            R = R / self.num
            try:
                Phi = mm(S10, inv(S00))
            except Exception as e:
                raise SingularMatrixError(e)
            Q = (S11 - mm(Phi, S10.T)) / self.num
            mu0 = ks.xs[0]
            Sigma0 = ks.Ps[0]
        self.Phi[:] = Phi
        self.Q[:] = Q
        self.R[:] = R
        self.mu0[:] = mu0
        self.Sigma0[:] = Sigma0
        self.xs = ks.xs
        self.Ps = ks.Ps


class ForecastResult(object):
    def __init__(self, nrow=1, ncol=1):
        shape = (nrow, ncol, 1)
        self.pred = np.zeros(shape)
        self.upper = np.zeros(shape)
        self.lower = np.zeros(shape)
        self.var = np.zeros(shape)

    def __len__(self):
        return len(self.pred)

    def shape(self):
        return self.pred.shape

    def copy(self, other, start=0, step=1):
        for i, j in zip(range(start, len(self), step), range(len(other))):
            self.pred[i][:] = other.pred[j]
            self.upper[i][:] = other.upper[j]
            self.lower[i][:] = other.lower[j]
            self.var[i][:] = other.var[j]

    def append(self, other):
        self.pred = np.append(self.pred, other.pred, axis=0)
        self.upper = np.append(self.upper, other.upper, axis=0)
        self.lower = np.append(self.lower, other.lower, axis=0)
        self.var = np.append(self.var, other.var, axis=0)


class Multivariate(object):
    CONF = 0.95

    def __init__(self, data, mu0=None, Sigma0=None, Phi=None, Q=None, R=None):
        """
        Args:
        data (numpy array): observed time series
        """
        self.y = np.array([np.array([x]).T for x in data])
        self.dim = np.shape(data)[1]
        self.initKf(mu0, Sigma0, Phi, Q, R)

    def initKf(self, mu0, Sigma0, Phi, Q, R):
        n = self.dim
        self.Phi = np.eye(n) if Phi is None else Phi
        self.Q = np.eye(n) if Q is None else Q
        self.R = np.eye(n) if R is None else R
        self.mu0 = self.y[0] if mu0 is None else mu0
        self.Sigma0 = np.eye(n) if Sigma0 is None else Sigma0
        self.kf = KEM(self.y, self.mu0, self.Sigma0, self.Phi, self.Q, self.R)

    def fit(
        self,
        mu0=None,
        Sigma0=None,
        Phi=None,
        Q=None,
        R=None,
        maxiter=50,
        forecast_k=0,
        conf=CONF,
    ):
        if Phi is not None:
            self.initKf(mu0, Sigma0, Phi, Q, R)
        self.kf.em(maxiter=maxiter)
        self.mu0, self.Sigma0, self.Phi, self.Q, self.R = (
            self.kf.mu0,
            self.kf.Sigma0,
            self.kf.Phi,
            self.kf.Q,
            self.kf.R,
        )
        predict_result = self.predict(conf=conf)
        forecast_result = self.forecast(steps=forecast_k, conf=conf)
        predict_result.append(forecast_result)
        return predict_result

    def smooth_states(self):
        return self.kf.xs

    def _set_conf_interval(self, result, idx, obs_cov, conf_factor):
        result.var[idx][:] = array([[abs(obs_cov[i][i])] for i in range(self.dim)])
        conf_interval = conf_factor * np.sqrt(result.var[idx])
        result.upper[idx][:] = result.pred[idx] + conf_interval
        result.lower[idx][:] = result.pred[idx] - conf_interval

    def predict(self, conf=CONF):
        prediction = self.kf.xs[1:]
        result = ForecastResult(*prediction.shape[:2])
        result.pred = prediction
        conf_factor = norm.interval(conf)[1]
        for i in range(len(prediction)):
            obs_cov = self.kf.Ps[i] + self.R
            self._set_conf_interval(result, i, obs_cov, conf_factor)
        return result

    def forecast(self, steps=0, conf=CONF):
        dim = self.dim
        result = ForecastResult(steps, dim)
        if steps == 0:
            return result
        cur_state = self.kf.xs[-1]
        cur_cov = self.kf.Ps[-1]
        Phi = self.kf.Phi
        Phit = Phi.T
        conf_factor = norm.interval(conf)[1]
        for i in range(steps):
            next_state = mm(Phi, cur_state)
            result.pred[i][:] = next_state
            cur_cov = mm(mm(Phi, cur_cov), Phit) + self.Q
            obs_cov = cur_cov + self.R
            self._set_conf_interval(result, i, obs_cov, conf_factor)
            cur_state = next_state
        return result

    def apply(self, data, data2=None, forecast_k=0, conf=CONF):
        """
        Args:
        data (numpy array): time series to forecast on
        data2 (numpy array): other time series to help forecasting data

        Returns:
        a ForecastResult object
        the smooth states (numpy.array) of the kalman filter
        """
        y = np.array([np.array([x]).T for x in data])
        kf = KSmooth(y, self.mu0, self.Sigma0, self.Phi, self.Q, self.R)
        kf.smooth()

        dim = self.dim
        num = len(y)
        result = ForecastResult(num + forecast_k, dim)
        result.pred[:num] = kf.xs[1:]
        conf_factor = norm.interval(conf)[1]
        for i in range(num):
            obs_cov = kf.Ps[i] + self.R
            self._set_conf_interval(result, i, obs_cov, conf_factor)

        # forecast
        if forecast_k > 0:
            xf = kf.xs[-1]
            Pf = kf.Ps[-1]
            Phi = self.kf.Phi
            Phit = Phi.T
            Q = self.Q
            R = self.R
            num2 = len(data2) if data2 is not None else 0
            A = np.eye(dim)
            for i in range(forecast_k):
                j = num + i
                xp = mm(Phi, xf)
                Pp = mm(mm(Phi, Pf), Phit) + Q
                if i < num2:
                    missing_vals = []
                    if np.any(np.isnan(data2[i])):
                        yc = np.array([data2[i]]).T
                        missing_vals = np.isnan(yc).flatten()
                        for k in range(len(missing_vals)):
                            yc[k] = 0
                            A[k][k] = 0
                    v = yc - mm(A, xp)
                    sig = mm(mm(A, Pp), A) + R  # note: A.T = A
                    try:
                        siginv = inv(sig)
                    except Exception as e:
                        raise SingularMatrixError(e)
                    K = mm(mm(Pp, A), siginv)
                    xf = xp + mm(K, v)
                    Pf = Pp - mm(mm(K, A), Pp)
                    for k in range(len(missing_vals)):
                        if missing_vals[k]:
                            A[k][k] = 1
                else:
                    xf = xp
                    Pf = Pp
                result.pred[j][:] = xf
                obs_cov = Pf + R
                self._set_conf_interval(result, j, obs_cov, conf_factor)
        return result, kf.xs
