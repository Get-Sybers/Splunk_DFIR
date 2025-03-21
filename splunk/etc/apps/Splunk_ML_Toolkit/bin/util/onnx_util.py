import cexc
import csv
import errno
import os
import json
import sys

import base64

from util.telemetry_onnx_util import (
    Timer,
    log_onnx_model_upload_time,
    log_onnx_model_upload_size_on_disk,
    log_onnx_app_algo_details,
    log_onnx_upload_uuid,
    log_onnx_model_upload_fs,
)

logger = cexc.get_logger(__name__)
messages = cexc.get_messages_logger()

from util.exec_anaconda_for_model_upload import exec_anaconda_or_die

from util.constants import (
    MODEL_EXTENSION,
    ONNX_MODEL_EXTENSION,
    DEFAULT_LOOKUPS_DIR,
    HOWTO_CONFIGURE_MLSPL_LIMITS,
)
from util.base_util import is_valid_identifier, get_staging_area_path
from util.lookups_util import file_name_to_path, parse_model_reply
from util.rest_url_util import get_user_capabilities
import util.models_util as models_util
from util.mlspl_loader import MLSPLConf
from util.searchinfo_util import is_parsetmp


class ModelUploadResponse:
    def __init__(self, payload=None, message=None):
        self.status = 500
        self.message = message
        self.payload = payload

    def get_response_error(self):
        return {"payload": {"message": self.message}, "status": 500}

    def get_response_success(self):
        if type(self.payload) == dict():
            self.payload["message"] = self.message
        return {"payload": self.payload, "status": 200}


def encode_model_file(model_file):
    try:
        if isinstance(model_file, str):
            with open(model_file, "rb") as f:
                encoded_model = base64.b64encode(f.read())
        elif isinstance(model_file, bytes):
            encoded_model = base64.b64encode(model_file)
        else:
            raise RuntimeError("UnknownModelFormat")
    except UnicodeEncodeError as e:
        raise RuntimeError(f"Error found while encoding model object to base64 : {str(e)}")
    return encoded_model


def decode_model_file(content):
    try:
        return base64.b64decode(content)
    except UnicodeDecodeError as e:
        raise RuntimeError(f"Error found while decoding model object to base64 : {str(e)}")


def get_max_size_for_onnx_lookup(process_options):
    mlspl_limits = process_options.get("mlspl_limits")
    if "max_model_size_mb" not in mlspl_limits:
        raise RuntimeError(
            "MLSPLlimitsNotFound: Please make sure to specify `max_model_size_mb` parameter in Settings page."
        )
    allowed_model_size_mb = float(mlspl_limits.get("max_model_size_mb"))
    return allowed_model_size_mb


def check_model_for_size_limitation(model_data, process_options):
    """
    Check model object for its size limitation from mlspl_limits, if exceeds raise error
    Args:
        model_data: model byte string
        process_options: options containing max_model_size_mb as limit.

    Returns: Error if size limit exceeded, else True

    """
    # Convert size in mbs
    model_size = sys.getsizeof(model_data["model"]) / (1024 * 1024)
    allowed_model_size_mb = get_max_size_for_onnx_lookup(process_options)
    if model_size > allowed_model_size_mb:
        cexc.log_traceback()
        raise RuntimeError(
            f"ModelSizeLimitExceeded: Expected size : {allowed_model_size_mb}, found : {model_size}. {HOWTO_CONFIGURE_MLSPL_LIMITS}"
        )
    return True


def create_onnx_model_lookup_entry(
    model_name,
    algo_name,
    options,
    max_size,
    tmp=False,
    searchinfo=None,
    namespace=None,
    local=False,
):
    """
    1. Create a lookup entry for csv lookup table :
    https://docs.splunk.com/Documentation/Splunk/9.0.2/Knowledge/Usefieldlookupstoaddinformationtoyourevents#Handle_large_CSV_lookup_tables
    2. Lookup entry contains :
        a. onnx model file (compatible format)
        b. process_options containing metadata content provided for the model
    3. find lookup entry name from onnx model name and place it in staging.
    4. move the lookup entry from staging to main
    :return: REST response from the model creation
    """

    opaque = encode_model_file(options.get("payload"))
    logger.info("Model file encoded successfully to create lookup")
    # Checking model size limitations
    model_size_mb = sys.getsizeof(opaque) / (1024 * 1024)
    if max_size and 0 < max_size < model_size_mb:
        raise RuntimeError(
            "ModelSizeLimitExceeded: Model exceeds size limit ({} > {}). {}".format(
                len(opaque), max_size * 1024 * 1024, HOWTO_CONFIGURE_MLSPL_LIMITS
            )
        )
    log_onnx_model_upload_size_on_disk(model_size_mb)
    try:
        model_staging_dir = get_staging_area_path()
        if not os.path.isdir(model_staging_dir):
            os.makedirs(model_staging_dir)
    except OSError as e:
        if e.errno == errno.EEXIST and os.path.isdir(model_staging_dir):
            pass
        else:
            # TODO: Log traceback
            raise Exception(f"Error Reading ONNX model: {model_name},{e}")

    model_lookup_name = onnx_model_name_to_lookup(model_name)
    lookup_file_path = file_name_to_path(model_lookup_name, model_staging_dir)

    with open(lookup_file_path, mode='w') as f:
        model_writer = csv.writer(f)

        # TODO: Version attribute
        model_writer.writerow(['algo', 'model', 'options'])
        model_writer.writerow([algo_name, opaque, json.dumps(options)])

    if not (tmp or local):
        reply = models_util.move_model_file_from_staging(
            model_lookup_name, searchinfo, namespace, lookup_file_path
        )
    if not reply.get('success'):
        parse_model_reply(reply)

    return reply


def onnx_model_name_to_lookup(name, tmp=False):
    assert isinstance(name, str)
    suffix = '.tmp' if tmp else ''
    if name.endswith(ONNX_MODEL_EXTENSION):
        assert is_valid_identifier(name.split('.')[0]), "Invalid model name"
        return f'__mlspl_{name}{MODEL_EXTENSION}{suffix}'
    assert is_valid_identifier(name), "Invalid model name"
    return f'__mlspl_{name}{ONNX_MODEL_EXTENSION}{MODEL_EXTENSION}{suffix}'


def validate_feature_and_target_variables(sample_df, model_options):
    """
     check if feature_variables and target_variables exists in dataset
    :param sample_df: (pd.dataFrame) sample of the dataset
    :param model_options: (dict) to store model options like location,feature and target
    :return: True if valid variables , else Exception
    """
    t = model_options.get("target_variable")
    assert t in sample_df.columns
    features = model_options.get("feature_variables")
    for f in features:
        assert f in sample_df.columns
    return True


def extract_feature_and_target_from_request(request):
    feature_variables = str(request["payload"]["features"]["content"], 'utf-8').strip()
    if feature_variables is None:
        raise RuntimeError("No feature_variables found, Please provide valid feature variables")

    if type(feature_variables) is str:
        feature_variables = feature_variables.split(",")

    target_variable = str(request["payload"]["targets"]["content"], 'utf-8').strip()
    # TODO: extracting only 1 target variable for now, modify next line for multiple target support
    if type(target_variable) is str:
        target_variable = target_variable.strip().split(",")[0]
    return feature_variables, target_variable


def validate_user_capabilities_for_upload(
    searchinfo, required_capabiities=['upload_lookup_files', 'upload_onnx_model_file']
):
    splunkd_uri = searchinfo.get("splunkd_uri")
    token = searchinfo.get("session_key")
    user = searchinfo.get("username")
    capabilities = get_user_capabilities(splunkd_uri, token, username=user)
    for items in required_capabiities:
        if items not in capabilities:
            raise RuntimeError(
                "Permission denied: User is not authenticated to upload model. Please check the docs for reference"
            )
    return True


def fetch_model_from_staging(request, model_file_name):
    model_content = request["payload"]["file"]["content"]
    # Create onnx file for the model received

    try:
        staging_location = get_staging_area_path()
        if not os.path.isdir(staging_location):
            os.makedirs(staging_location)
    except OSError as e:
        if e.errno == errno.EEXIST and os.path.isdir(staging_location):
            pass
        else:
            raise Exception(f"StagingFolderNotFoundError:{e}")
    fname = f"{staging_location}/{model_file_name}"
    with open(fname, "wb") as f:
        f.write(model_content)
    return fname


def create_process_options_for_rest(request, searchinfo, process_options):
    """
    Populates process options for models received through rest requests
    :return: process_options: (dict) contains model attributes
    """
    process_options["is_onnx"] = True
    process_options["namespace"] = "user"
    model_file_name = str(request["payload"]["model_name"]["content"], 'utf-8')
    if model_file_name:
        process_options["model_name"] = os.path.splitext(model_file_name)[0]
        assert is_valid_identifier(
            process_options["model_name"]
        ), f"Invalid model name found '{model_file_name}'. Please provide a valid model name"
    else:
        raise RuntimeError("ModelFilenameNotFound")
    # Setting dispatch dir as empty
    process_options["dispatch_dir"] = None
    process_options["mlspl_conf"] = MLSPLConf(searchinfo)

    fname = fetch_model_from_staging(request, model_file_name)
    process_options["payload"] = fname

    (
        process_options["feature_variables"],
        process_options["target_variable"],
    ) = extract_feature_and_target_from_request(request)
    return process_options


def validate_model_and_upload(process_options, searchinfo):
    with Timer() as t:
        namespace = process_options.pop('namespace', "user")
        mlspl_conf = process_options.pop('mlspl_conf')

        try:
            assert validate_user_capabilities_for_upload(searchinfo)
        except Exception as e:
            logger.error(f"OnnxUserValidationError : {e}")
            raise RuntimeError(f"OnnxUserValidationError : {e}")
        logger.info("User validated for upload access.")

        # Validate model for onnx schema
        resp = exec_anaconda_or_die(process_options["payload"])
        if resp is not None and "Error" in resp:
            raise RuntimeError(f"OnnxModelValidationError: ")

        if is_parsetmp(searchinfo):
            process_options['mlspl_limits'] = {}
            process_options['feature_variables'] = ['*']
            return None, None, process_options, None

        algo_name = ONNX_MODEL_EXTENSION[1:]
        # TODO: Can load specific limits for onnx later
        process_options['mlspl_limits'] = mlspl_conf.get_stanza(algo_name)
        max_size = get_max_size_for_onnx_lookup(process_options)

        log_onnx_app_algo_details(searchinfo.get("app"), algo_name, process_options)

        try:
            # Once validated and verified, create lookup table entry
            reply = create_onnx_model_lookup_entry(
                process_options['model_name'],
                algo_name=algo_name,
                options=process_options,
                max_size=max_size,
                tmp=False,
                searchinfo=searchinfo,
                namespace=namespace,
                local=False,
            )
            logger.debug(
                f"Lookup entry successfully created for model file: {process_options['model_name']}"
            )
            log_onnx_model_upload_fs(int(1))
        except Exception as e:
            log_onnx_model_upload_fs(int(0))
            cexc.log_traceback()
            raise RuntimeError(f"LookupEntryCreationFailed: {e}")

    log_onnx_upload_uuid()
    log_onnx_model_upload_time(t.interval)
    return reply
