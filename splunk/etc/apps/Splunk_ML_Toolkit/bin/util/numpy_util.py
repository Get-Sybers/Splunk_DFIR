#!/usr/bin/env python

import numpy as np


def safe_str_infinity(value):
    """
    Return a more readable format of np.inf or -np.inf.

    Args:
        value (int): the value to be converted, a float or -np.inf or np.inf

    Returns:
        safe_v (str): converted value Infinity or -Infinity if it is np.inf or -np.inf respectively, untouched otherwise.
    """
    safe_v = value
    if value == -np.inf:
        safe_v = '-Infinity'
    elif value == np.inf:
        safe_v = 'Infinity'
    return safe_v
