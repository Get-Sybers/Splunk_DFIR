import pandas as pd
from util.time_util import extend_data_frame


class DataSet(object):
    def __init__(self, df, time_field):
        self.df = df.copy()
        self.time_field = time_field
        if time_field not in df:
            raise RuntimeError("The {} field is not in the data frame".format(time_field))

    def select_columns(self, column_names):
        self.df = self.df[column_names]

        for field in column_names:
            if field != self.time_field:
                if self.df[field].values.dtype == object:
                    raise ValueError(
                        'field \'{}\' contains non-numeric data. SystemIdentification only accepts numeric data.'.format(
                            field
                        )
                    )
                else:
                    self.df[field] = self.df[field].astype(float)

    def drop_columns(self, column_names):
        self.df.drop(column_names, axis=1, inplace=True)

    def set_lags(self, targets, dynamics, horizon, fit_mode=True):
        """
        Compute lags of self.df by the dynamics and horizon specifications.
        * lags are stored in df_lag data frame.
        * target columns are stored in df_target.
        * SystemIdentification will use df_lag to predict df_target.
        * let h = horizon.
        * for each column x, we add d+1 columns to df_lag, where d = dynamics[x]. These columns are obtained from
        x by shifting it by h, h+1, ..., h+d amounts. They are named x-h, x-(h+1), ..., x-(h+d].
        * when h = 0 the x column shifted by h is itself. If x is a target column, we add it
        to df_target but not df_lag. If x is not a target column we add it to df_lag with column name x0.
        * if fit_mode is True, meaning we're in fit mode, we drop all rows with NaN.
        * if fit_mode is False, meaning we're in apply mode, we drop all rows with NaN, except the ones where only the target
        fields are NaN. The reason is that we are predicting these latter fields, so they can be NaN to be NaN to begin with.

        Example1:
        suppose self.df is
            a  b  c
            1  5  9
            2  6  10
            3  7  11
            4  8  12
        suppose targets = ['a', 'b'], dynamics = {'a': 1, 'b': 1, 'c': 2} and horizon = 0.
        Then the shifted data frame is
            a  a-1  b  b-1  c0  c-1  c-2
            1  NaN  5  NaN  9   NaN  NaN
            2  1    6  5    10  9    NaN
            3  2    7  6    11  10   9
            4  3    8  7    12  11   10
            0  4    0  8    0   12   11
            0  0    0  0    0   0    12
        Note that there are 2 new rows, because column 'c' is shifted by 2. We also add 0s to the bottom rows of
        each column if it's not long enough (but leave the top items NaN).
        Next we drop all rows with NaN:
            a  a-1  b  b-1  c0  c-1  c-2
            3  2    7  6    11  10   9
            4  3    8  7    12  11   10
            0  4    0  8    0   12   11
            0  0    0  0    0   0    12
        The goal of SystemIdentification is to use a-1, b-1, c0, c-1, c-2 to predict a and b.
        Thus we stored 'a' and 'b' columns in self.df_target.
        The remaining data frame is named self.df_lag.
        Hence, self.df_target is
            a  b
            3  7
            4  8
            0  4
            0  0
        and self.df_lag is
            a-1 b-1 c0  c-1 c-2
            2   6   11  10  9
            3   7   12  11  10
            4   8   0   12  11
            0   0   0   0   12

        Example2:
        suppose self.df is
            a  b  c
            1  5  9
            2  6  10
            3  7  11
            4  8  12
        suppose targets = ['a', 'b'], dynamics = {'a': 1, 'b': 1, 'c': 2} and horizon = 1.
        The shifted data frame is:
            a  a-1 a-2  b  b-1  b-2  c0  c-1  c-2  c-3
            1  NaN NaN  5  NaN  NaN  9   NaN  NaN  NaN
            2  1   NaN  6  5    NaN  10  9    NaN  NaN
            3  2   1    7  6    5    11  10   9    NaN
            4  3   2    8  7    6    12  11   10   9
            0  4   3    0  8    7    0   12   11   10
            0  0   4    0  0    8    0   0    12   11
            0  0   0    0  0    0    0   0    0    12
        self.df_target is
            a  b
            4  8
            0  0
            0  0
            0  0
        and self.df_lag is
            a-1 a-2  b-1  b-2  c-1  c-2  c-3
            3   2    7    6    11   10   9
            4   3    8    7    12   11   10
            0   4    0    8    0    12   11
            0   0    0    0    0    0    12

        Args:
        targets (list of strs): names of columns to bbe shifted
        dynamics (list of ints): lags to shift the columns bby
        horizon (int): position from which to shift the dynamics

        Returns:
        None
        """
        if not set(targets) <= set(self.df.columns):
            raise RuntimeError(
                "The set {} is not a subset of the data frame's columns {}".format(
                    targets, self.df.columns
                )
            )
        self.df = extend_data_frame(self.df, self.time_field, num_new_rows=horizon, init_val=0)

        df_all = [self.df[targets].copy()]
        for field in self.df.columns:
            if field != self.time_field:
                for i in range(horizon, horizon + dynamics[field] + 1):
                    if i != 0 or field not in targets:
                        df_i = self.df[[field]].shift(i)
                        df_i.columns = self.df[[field]].columns + str(-i)
                        df_all.append(df_i)
        if fit_mode:
            df_lag = pd.concat(df_all, axis=1).dropna()
            self.df_target = pd.concat([df_lag.pop(c) for c in targets], axis=1)
        else:
            df_lag = pd.concat(df_all, axis=1)
            self.df_target = pd.concat([df_lag.pop(c) for c in targets], axis=1)
            df_lag = df_lag.dropna()
        self.df_lag = df_lag.reindex(sorted(df_lag.columns), axis=1)

    def normalize(self, train_stats=None):
        if train_stats is None:
            train_stats = self.df_lag.describe().transpose()
        self.df_lag = (self.df_lag - train_stats['mean']) / train_stats['std']
        return train_stats

    def get_time(self):
        return self.df[[self.time_field]]
