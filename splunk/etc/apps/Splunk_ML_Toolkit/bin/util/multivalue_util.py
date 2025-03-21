#!/usr/bin/env python


def multivalue_encode(value):
    """
    Encode a value as part of a multivalue field expected by the Chunked External Command Protocol

    Args:
        value (str): the value to encode

    Returns:
        (str): encoded value with $ in the beginning and end. Also $$ for single $.
    """
    return '$%s$' % value.replace('$', '$$')
