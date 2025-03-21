from functools import wraps

import cexc

logger = cexc.get_logger('error_logger')


def safe_func(func):
    @wraps(func)
    def _safe_func(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            logger.error(
                "An error occurred during the execution of {}: {}".format(func.__name__, e)
            )

    return _safe_func
