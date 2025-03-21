import re
from math import isnan
import numpy as np
import pandas as pd
import time


class HumanTime(object):
    """
    This class helps implement time-based quantities, originally for the StateSpaceForecast algorithm.

    Previously, a typical example of using the algorithm would be:

    ... | fit StateSpaceForecast field_X holdback=3 forecast_k=14

    Here, holdback and forecast_k specify 3 and 14 events, respectively. If the user wants to forecast say, 2 weeks worth of events,
    they would need to translate that into event numbers, taking into account the time interval between two consecutive events.

    We want a more intuitive way to specify holdback and forecast_k, such as:

    ... | fit StateSpaceForecast field_X holdback=3days forecast_k=2weeks

    The goal of HumanTime is to convert such quantities into event numbers. The class should also interpret
    the quantities the same way as before if they are given as integers. Hence, this query should work:

    ... | fit StateSpaceForecast field_X holdback=3 forecast_k=2weeks

    The quantities to be converted are of this form: XY where
        X is either empty or a non-negative integer
        Y is either empty or in the following table:

            s, sec, secs, second, seconds
            m, min, minute, minutes
            h, hr, hrs, hour, hours
            d, day, days
            w, week, weeks
            mon, month, months
            q, qtr, qtrs, quarter, quarters
            y, yr, yrs, year, years

    X and Y can't both be empty.
    If X is empty, it is understood as 1. For example, forecast_k=mon is the same as forecast_k=1mon.

    """

    TIME_UNITS = {  # follows the convention in Splunk Core's src/util/TimeParser.cpp
        'seconds': 1,
        'minutes': 60,
        'hours': 3600,
        'days': 24 * 3600,
        'weeks': 7 * 24 * 3600,
        'months': 30 * 24 * 3600,
        'quarters': 90 * 24 * 3600,
        'years': 365 * 24 * 3600,
    }  # we use plurals here because they will be converted to pandas DateOffsets, for which plurals and singulars mean different things.

    INV_TIME_UNITS = {v: k for k, v in list(TIME_UNITS.items())}

    SPLUNK_PANDAS_TIME = {
        # translate Splunk time units to pandas time units.
        # The last string in each value list is the equivalent pandas unit.
        's': ['s', 'sec', 'secs', 'second', 'seconds'],
        'm': ['m', 'min', 'mins', 'minute', 'minutes'],
        'h': ['h', 'hr', 'hrs', 'hour', 'hours'],
        'd': ['d', 'day', 'days'],
        'w': ['w', 'week', 'weeks'],
        'mo': ['mon', 'month', 'months'],
        'q': ['q', 'qtr', 'qtrs', 'quarter', 'quarters'],
        'y': ['y', 'yr', 'yrs', 'year', 'years'],
    }

    def __init__(self, time_str):
        self.time_str = time_str
        self.time_amount, self.time_unit = self.parse(time_str)

    @staticmethod
    def pandas_unit(time_unit):
        '''
        Args:
        time_unit (str): time unit in Splunk format

        Returns:
        the equivalent pandas unit. If not found, output units with the same
        first char as time_unit. In case time_unit begins with 'mo', output the month units.
        '''
        if not time_unit:
            return ''

        match_obj = re.match(r'(s|mo|m|h|d|w|q|y)[a-z]*?', time_unit)
        if not match_obj:
            raise ValueError("Unrecognized time unit: {}".format(time_unit))

        units = HumanTime.SPLUNK_PANDAS_TIME[match_obj.group(1)]
        if time_unit not in units:
            raise ValueError(
                "Unrecognized time unit: {}. Supported: {}".format(time_unit, units)
            )

        return units[-1]

    @staticmethod
    def parse(time_str):
        match_obj = re.match(r'(\-*\d+)([a-z]*)', time_str)
        if not match_obj:
            raise ValueError(
                "Invalid time amount: {}. The syntax is <time_integer>[time_unit]".format(
                    time_str
                )
            )

        time_amount = int(match_obj.group(1))
        if time_amount < 0:
            raise ValueError(
                "Invalid time amount: {}. Only non-negative integers allowed.".format(
                    time_amount
                )
            )
        time_unit = HumanTime.pandas_unit(match_obj.group(2))
        return time_amount, time_unit

    def to_seconds(self):
        unit_in_seconds = self.TIME_UNITS[self.time_unit]
        return self.time_amount * unit_in_seconds

    @staticmethod
    def from_seconds(num_seconds):
        for unit in sorted(list(HumanTime.INV_TIME_UNITS.keys()), reverse=True):
            if num_seconds >= unit:
                time_unit = HumanTime.INV_TIME_UNITS[unit]
                time_amount = int(num_seconds / unit)
                return HumanTime('{}{}'.format(time_amount, time_unit))

    @staticmethod
    def add_offset(time_anchor, time_offset, future=True):
        """
        Args:
        time_anchor (pd.Timestamp): time from which to add.
        time_offset (HumanTime): time offset, e.g. '3mon'
        future (bool): direction from time_anchor to count the offset

        Returns:
        pd.Timestamp, conceptually equal to time_anchor +(-) time_offset
        """
        direction = 1 if future else -1
        if time_offset.time_unit != 'quarters':
            res = time_anchor + (direction * time_offset.to_DateOffset())
        else:  # pandas's DateOffset does not have a 'quarters' parameter, hence we need to handle it different
            res = time_anchor + (
                direction
                * pd.offsets.QuarterBegin(time_offset.time_amount + (1 + direction) / 2)
            )
            res = res - pd.DateOffset(months=1) + pd.DateOffset(days=time_anchor.day - 1)
        return res

    def to_DateOffset(self):
        return pd.DateOffset(**{self.time_unit: self.time_amount})

    def __lt__(self, other):
        return self.to_seconds() < other.to_seconds()


def convert_time_to_seconds(time_values):
    """
    Convert timestamps to numbers of seconds since epoch.

    Args:
    time_values: a list of time values which are either timestamps or nanoseconds or seconds

    Returns:
    a list containing the values of the time field in seconds
    """

    if time_values.values.dtype == object or time_values.values.dtype == 'datetime64[ns]':
        return pd.to_datetime(time_values).values.astype('int64') // 1e9
    return time_values.values.astype('int64')


def compute_timestep(df, time_field):
    """
    Calculates the dominant difference between two consecutive timestamps.

    Args:
    df (pd.DataFrame): data frame with a time field
    time_field (str): name of time field in df

    Returns:
    a dict as follows:
    {
        timestep = dominant timestep between consecutive timestamps (unit = seconds),
        first_timestamp = number of seconds since epoch,
        last_timestamp = number of seconds since epoch,
        length = len(df)
    }
    """
    datetime_information = dict(
        timestep=1,
        first_timestamp=None,  # number of seconds since epoch
        last_timestamp=None,
        length=len(df),
    )

    if time_field not in df:
        return datetime_information

    X = convert_time_to_seconds(df[time_field])
    if len(X) == 0:
        return datetime_information

    datetime_information['first_timestamp'] = X[0]
    datetime_information['last_timestamp'] = X[-1]

    cands = []
    for i in range(len(X) - 1, 0, -1):
        if not isnan(X[i]) and not isnan(X[i - 1]):
            cands.append(X[i] - X[i - 1])
    datetime_information['timestep'] = np.median(cands)

    return datetime_information


def extend_data_frame(df, time_field, num_new_rows=1, init_val=None):
    """
    Append new rows to data frame. The new timestamps are automatically computed by using the
    dominant timestep. The other new values are given by init_val.

    Args:
    df (pd.DataFrame): data frame with a time field
    time_field (str): name of time field in df
    num_new_rows (int): number of new rows

    Returns:
    new pd.DataFrame with extra rows
    """
    if num_new_rows <= 0:
        return df
    extra_rows = pd.DataFrame(columns=df.columns, index=range(len(df), len(df) + num_new_rows))
    if init_val is not None:
        extra_rows = extra_rows.fillna(init_val)
    if time_field in df:
        datetime_information = compute_timestep(df, time_field)
        start_time = datetime_information['last_timestamp']
        start_time = datetime_information['last_timestamp'] + datetime_information['timestep']
        start_time = time.strftime('%Y-%m-%d %H:%M:%S', time.gmtime(start_time))
        freq = '{}S'.format(datetime_information['timestep'])
        extra_time = pd.date_range(start=start_time, periods=num_new_rows, freq=freq)
        extra_rows[time_field] = extra_time.values
        if df[time_field].values.dtype == 'int64' or df[time_field].values.dtype == 'float64':
            extra_rows[time_field] = convert_time_to_seconds(extra_rows[time_field])

    return df.combine_first(extra_rows)
