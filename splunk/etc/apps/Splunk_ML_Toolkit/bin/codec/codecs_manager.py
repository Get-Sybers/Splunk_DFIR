#!/usr/bin/env python

from . import codecs

_codec_table = dict([(x, getattr(codecs, y)) for x, y in list(codecs.CODECS.items())])


def get_codec_table():
    return _codec_table


def add_codec(codec_module, codec_name, codec_obj):
    _codec_table[(codec_module, codec_name)] = codec_obj
