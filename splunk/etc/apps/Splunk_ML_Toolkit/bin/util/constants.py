import os


class EXPERIMENT_TYPES_LONG(object):
    # If this Enum is modified
    # modify `experiment/experiment_schema.json` accordingly
    pnf = "predict_numeric_fields"
    pcf = "predict_categorical_fields"
    dno = "detect_numeric_outliers"
    dco = "detect_categorical_outliers"
    fts = "forecast_time_series"
    sf = "smart_forecast"
    sod = "smart_outlier_detection"
    sc = "smart_clustering"
    sp = "smart_prediction"
    cne = "cluster_numeric_events"


EXPERIMENT_TYPES_MAP = {
    EXPERIMENT_TYPES_LONG.pnf: "pnf",
    EXPERIMENT_TYPES_LONG.pcf: "pcf",
    EXPERIMENT_TYPES_LONG.dno: "dno",
    EXPERIMENT_TYPES_LONG.dco: "dco",
    EXPERIMENT_TYPES_LONG.fts: "fts",
    EXPERIMENT_TYPES_LONG.sf: "sf",
    EXPERIMENT_TYPES_LONG.sod: "sod",
    EXPERIMENT_TYPES_LONG.sc: "sc",
    EXPERIMENT_TYPES_LONG.cne: "cne",
}

DEFAULT_LOOKUPS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "lookups")
CSV_FILESIZE_LIMIT = 2**30
EXPERIMENT_MODEL_PREFIX = "_exp_"
EXPERMENT_DRAFT_MODEL_PREFIX = 'draft_'
MODEL_EXTENSION = '.mlmodel'
ONNX_MODEL_EXTENSION = ".onnx"
MODEL_FILE_REGEX = r'.*__mlspl_(?P<model_name>[a-zA-Z_][a-zA-Z0-9_]*){}'.format(MODEL_EXTENSION)
ONNX_MODEL_FILE_REGEX = r'.*__mlspl_(?P<model_name>[a-zA-Z_][a-zA-Z0-9_]*){}'.format(
    ONNX_MODEL_EXTENSION
)
TELEMETRY_ID_REGEX = r'^(?:_exp_)?(?:draft_)?([0-9a-f]+)(?:_[a-zA-z]+_[0-9]+)?$'

HOWTO_CONFIGURE_MLSPL_LIMITS = (
    'To configure limits, use mlspl.conf or the "Settings" tab in the app navigation bar.'
)

NUM_PCA_COMPONENTS = 1
