#!/usr/bin/env python

import json
from distutils.version import StrictVersion
import platform

import numpy as np

from . import codecs_manager

import cexc

logger = cexc.get_logger(__name__)
messages = cexc.get_messages_logger()

NUMPY_VERSION = "1.23.0"


class MLSPLEncoder(json.JSONEncoder):
    def default(
        self, obj
    ):  # pylint: disable=E0202 ; pylint doesn't like overriding default for some reason
        codec = codecs_manager.get_codec_table().get(
            (type(obj).__module__, type(obj).__name__), None
        )
        if codec is not None:
            return codec.encode(obj)

        try:
            # To fix "Not JSON serializable: numpy.intc" error, MLA-4304
            if platform.system() == "Windows" and isinstance(obj, np.intc):
                return int(obj)
            return json.JSONEncoder.default(self, obj)
        except Exception:
            raise TypeError(
                "Not JSON serializable: %s.%s" % (type(obj).__module__, type(obj).__name__)
            )


class MLSPLDecoder(json.JSONDecoder):
    def __init__(self, *args, **kwargs):
        super(MLSPLDecoder, self).__init__(*args, object_hook=self._object_hook, **kwargs)

    def _object_hook(self, obj):
        if isinstance(obj, dict) and "__mlspl_type" in obj:
            module_name, name = obj["__mlspl_type"]
            codec = codecs_manager.get_codec_table().get((module_name, name), None)
            if codec:
                return codec.decode(obj)
            logger.error(
                'Model might be old. No codec for record of type "%s.%s"' % (module_name, name)
            )
            raise ValueError(
                f'The model may not be compatible with this version of MLTK. Please try re-creating the model.'
            )
        return obj


def encode(obj):
    if StrictVersion(np.version.version) >= StrictVersion(NUMPY_VERSION):
        return MLSPLEncoder().encode(obj)
    else:
        raise RuntimeError(
            "Python for Scientific Computing version 1.1 or later is required to save models."
        )


def decode(payload):
    if StrictVersion(np.version.version) >= StrictVersion(NUMPY_VERSION):
        return MLSPLDecoder().decode(payload)
    else:
        raise RuntimeError(
            "Python for Scientific Computing version 1.1 or later is required to load models."
        )
