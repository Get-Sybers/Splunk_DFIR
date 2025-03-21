# This file implements util functions to capture params for onnx model upload (REST handler).
# Could not be added to existing `telemetry_util.py` because of numpy imports
import time
import uuid

import cexc
from util.error_util import safe_func

logger = cexc.get_logger('telemetry_logger')


@safe_func
def log_onnx_model_upload_time(interval):
    logger.debug(
        "command=upload, metrics_type=onnx_upload, onnx_model_validate_and_upload_time=%f"
        % interval
    )


@safe_func
def log_onnx_model_upload_size_on_disk(size):
    logger.debug(
        "command=upload, metrics_type=onnx_upload, onnx_model_size_on_disk_mb=%f" % size
    )


## 0 == not uploaded, 1 == uploaded
@safe_func
def log_onnx_model_upload_fs(status):
    logger.debug(f"command=upload, metrics_type=onnx_upload, model_upload={status}")


@safe_func
def log_onnx_model_input_shape(dim, input_shape, df_shape):
    logger.debug(
        f"metrics_type=onnx_infer, col_dimension={dim}, onnx_input_shape={input_shape}, dataframe_shape={df_shape}"
    )


@safe_func
def log_onnx_app_algo_details(app_name, algo_name, model_options):
    options_params = model_options.get('params')
    params_to_log = options_params if options_params else '{null}'
    logger.debug(f"app_context={app_name}, algo_name={algo_name}, params={params_to_log}")


@safe_func
def log_onnx_upload_uuid():
    logger.debug(f"UUID={str(uuid.uuid4())}")


class Timer(object):
    def __enter__(self):
        self.start = time.time()
        return self

    def __exit__(self, *args):
        self.end = time.time()
        self.interval = self.end - self.start
