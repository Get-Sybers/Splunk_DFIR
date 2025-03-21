import hashlib
import json
import re
import time
import uuid
import numpy as np

import cexc
from util.constants import TELEMETRY_ID_REGEX
from util.error_util import safe_func

logger = cexc.get_logger('telemetry_logger')

example_names = {
    'server_power': 'Predict Server Power Consumption',
    'app_usage': 'Predict VPN Usage',
    'housing': 'Predict Median House Value',
    'energy_output': 'Predict Power Plant Energy Output',
    'future_logins': 'Predict Future Logins',
    'future_vpn_sinusoidal': 'Predict Future VPN Usage (sinusoidal time)',
    'future_vpn_categorical': 'Predict Future VPN Usage (categorical time)',
    'disk_failures': 'Predict Hard Drive Failure',
    'malware': 'Predict the Presence of Malware',
    'churn': 'Predict Telecom Customer Churn',
    'diabetes': 'Predict the Presence of Diabetes',
    'vehicle_type': 'Predict Vehicle Make and Model',
    'external_anomalies': 'Predict External Anomalies',
    'server_response_time': 'Detect Outliers in Server Response Time',
    'numeric_employee_logins': 'Detect Outliers in Number of Logins (vs. Predicted Value)',
    'numeric_supermarket_purchases': 'Detect Outliers in Supermarket Purchases',
    'power_plant_humidity': 'Detect Outliers in Power Plant Humidity',
    'call_center_cyclical': 'Detect Cyclical Outliers in Call Center Data',
    'logins_cyclical': 'Detect Cyclical Outliers in Logins',
    'categorical_disk_failures': 'Detect Outliers in Disk Failures',
    'bitcoin_transactions': 'Detect Outliers in Bitcoin Transactions',
    'categorical_supermarket_purchases': 'Detect Outliers in Supermarket Purchases',
    'mortage_loans_data_ny': 'Detect Outliers in Mortgage Contracts',
    'diabetic_data': 'Detect Outliers in Diabetes Patient Records',
    'phone_usage': 'Detect Outliers in Mobile Phone Activity',
    'internet_traffic': 'Forecast Internet Traffic',
    'forecast_employee_logins': 'Forecast the Number of Employee Logins',
    'souvenir_sales': 'Forecast Monthly Sales',
    'bluetooth_devices': 'Forecast the Number of Bluetooth Devices',
    'exchange_rate_ARIMA': 'Forecast Exchange Rate TWI using ARIMA',
    'hard_drives': 'Cluster Hard Drives by SMART Metrics',
    'apps': 'Cluster Behavior by App Usage',
    'cluster_housing': 'Cluster Neighborhoods by Properties',
    'vehicles': 'Cluster Vehicles by Onboard Metrics',
    'powerplant': 'Cluster Power Plant Operating Regimes',
    'business_anomalies': 'Cluster Business Anomalies to Reduce Noise',
    'sf_app_usage': 'Forecast App Expenses',
    'sf_call_center': 'Forecast the Number of Calls to a Call Center',
    'sf_app_logons': 'Forecast App Logons with Special Days',
    'sf_app_usage_multiple': 'Forecast App Expenses from Multiple Variables',
    'soda_disk_failure': 'Find Anomalies in Hard Drive Metrics',
    'soda_supermarket': 'Find Anomalies in Supermarket Purchases',
    'property_descriptions': 'Cluster Houses by Property Descriptions',
    'mortgage_loans': 'Cluster Mortgage Loans',
    'disk_utilization': 'Predict Disk Utilization',
    'firewall_traffic': 'Predict the Presence of Vulnerabilities',
}

algorithm_and_parameter_white_list = {
    'ACF': {'k', 'conf_interval', 'fft'},
    'ARIMA': {'order', 'forecast_k', 'conf_interval', 'holdback'},
    'AutoPrediction': {
        'target_type',
        'test_split_ratio',
        'random_state',
        'n_estimators',
        'max_depth',
        'min_samples_split',
        'max_leaf_nodes',
        'max_features',
        'criterion',
    },
    'BernoulliNB': {'alpha', 'binarize', 'fit_prior'},
    'Birch': {'k'},
    'DBSCAN': {'eps'},
    'DecisionTreeClassifier': {
        'random_state',
        'max_depth',
        'min_samples_split',
        'max_leaf_nodes',
        'criterion',
        'splitter',
        'max_features',
    },
    'DecisionTreeRegressor': {
        'random_state',
        'max_depth',
        'min_samples_split',
        'max_leaf_nodes',
        'splitter',
        'max_features',
    },
    'DensityFunction': {
        'dist',
        'show_density',
        'threshold',
        'lower_threshold',
        'upper_threshold',
        'metric',
    },
    'ElasticNet': {'fit_intercept', 'normalize', 'alpha', 'l1_ratio'},
    'FieldSelector': {'param', 'type', 'mode'},
    'GaussianNB': {},
    'GMeans': {'kmax', 'random_state'},
    'GradientBoostingClassifier': {
        'loss',
        'max_features',
        'learning_rate',
        'min_weight_fraction_leaf',
        'n_estimators',
        'max_depth',
        'min_samples_split',
        'min_samples_leaf',
        'max_leaf_nodes',
        'random_state',
    },
    'GradientBoostingRegressor': {
        'loss',
        'max_features',
        'learning_rate',
        'min_weight_fraction_leaf',
        'alpha',
        'subsample',
        'n_estimators',
        'max_depth',
        'min_samples_split',
        'min_samples_leaf',
        'max_leaf_nodes',
        'random_state',
    },
    'HashingVectorizer': {
        'max_features',
        'random_state',
        'n_iters',
        'k',
        'stop_words',
        'analyzer',
        'norm',
        'token_pattern',
        'ngram_range',
        'reduce',
    },
    'ICA': {'n_components', 'max_iter', 'random_state', 'tol', 'whiten', 'algorithm', 'fun'},
    'Imputer': {'missing_values', 'strategy', 'field'},
    'KernelPCA': {'k', 'degree', 'alpha', 'max_iteration', 'gamma', 'tolerance'},
    'KernelRidge': {'gamma'},
    'KMeans': {'k', 'random_state'},
    'Lasso': {'alpha'},
    'LinearRegression': {'fit_intercept', 'normalize'},
    'LocalOutlierFactor': {
        'n_neighbors',
        'leaf_size',
        'p',
        'contamination',
        'algorithm',
        'metric',
        'anomaly_score',
    },
    'LogisticRegression': {'fit_intercept', 'probabilities'},
    'MLPClassifier': {
        'batch_size',
        'max_iter',
        'random_state',
        'tol',
        'momentum',
        'activation',
        'solver',
        'learning_rate',
        'hidden_layer_sizes',
    },
    'MultivariateOutlierDetection': {
        'dist',
        'show_density',
        'threshold',
        'lower_threshold',
        'upper_threshold',
        'metric',
    },
    'NPR': {},
    'OneClassSVM': {'gamma', 'coef0', 'tol', 'nu', 'degree', 'shrinking', 'kernel'},
    'PACF': {'k', 'conf_interval', 'method'},
    'PCA': {'k'},
    'RandomForestClassifier': {
        'random_state',
        'n_estimators',
        'max_depth',
        'min_samples_split',
        'max_leaf_nodes',
        'max_features',
        'criterion',
    },
    'RandomForestRegressor': {
        'random_state',
        'n_estimators',
        'max_depth',
        'min_samples_split',
        'max_leaf_nodes',
        'max_features',
    },
    'Ridge': {'fit_intercept', 'normalize', 'alpha'},
    'RobustScaler': {'with_centering', 'with_scaling', 'quantile_range'},
    'SGDClassifier': {
        'fit_intercept',
        'random_state',
        'n_iter',
        'l1_ratio',
        'alpha',
        'eta0',
        'power_t',
        'loss',
        'penalty',
        'learning_rate',
    },
    'SGDRegressor': {
        'fit_intercept',
        'random_state',
        'n_iter',
        'l1_ratio',
        'alpha',
        'eta0',
        'power_t',
        'penalty',
        'learning_rate',
    },
    'SpectralClustering': {'gamma', 'affinity', 'k', 'random_state'},
    'StandardScaler': {'with_mean', 'with_std'},
    'StateSpaceForecast': {
        'conf_interval',
        'forecast_k',
        'holdback',
        'output_fit',
        'period',
        'specialdays',
        'update_last',
    },
    'SVM': {'gamma', 'C'},
    'SystemIdentification': {
        'time_field',
        'dynamics',
        'layers',
        'conf_interval',
        'horizon',
        'epochs',
        'random_state',
        'shuffle',
    },
    'TFIDF': {
        'max_features',
        'max_df',
        'min_df',
        'ngram_range',
        'stop_words',
        'analyzer',
        'norm',
        'token_pattern',
    },
    'XMeans': {'kmax', 'random_state'},
    'onnx': {},
}

apps_white_list = {
    'search',
    'dga_analysis',
    'Splunk_ML_Toolkit',
    'Splunk_ML_Toolkit_beta',
    'Splunk_ML_Toolkit_advisory',
    'itsi',
    'SplunkEnterpriseSecuritySuite',
    'SA_mltk_contrib_app',
    'Splunk_Essentials_Predictive_Maintenance_for_IOT',
    'Splunk-SE-Fraud-Detection',
}

scoring_and_parameter_white_list = {
    'accuracy_score': {'normalize'},
    'confusion_matrix': {},
    'f1_score': {'average', 'pos_label'},
    'precision_score': {'average', 'pos_label'},
    'precision_recall_fscore_support': {'pos_label', 'average', 'beta'},
    'recall_score': {'average', 'pos_label'},
    'roc_auc_score': {},
    'roc_curve': {'pos_label', 'drop_intermediate'},
    'silhouette_score': {'metric'},
    'pairwise_distances': {'metric', ' output'},
    'explained_variance_score': {'multioutput'},
    'mean_absolute_error': {},
    'mean_squared_error': {},
    'r2_score': {'multioutput'},
    'describe': {'ddof', 'bias'},
    'moment': {'moment'},
    'pearsonr': {},
    'spearmanr': {},
    'tmean': {'lower_limit', 'upper_limit'},
    'trim': {'tail', 'proportiontocut'},
    'tvar': {'ddof', 'lower_limit', 'upper_limit'},
    'adfuller': {'autolag', 'regression', 'maxlag', 'alpha'},
    'anova': {'type', 'output', 'test', 'robust', 'formula', 'scale'},
    'energy_distance': {},
    'f_oneway': {'alpha'},
    'kpss': {'regression', 'lags', 'alpha'},
    'kstest': {'cdf', 'mode', 'alternative', 'alpha', 'scale', 'df', 's', 'loc'},
    'ks_2samp': {'alpha'},
    'mannwhitneyu': {'alternative', 'use_continuity', 'alpha'},
    'normaltest': {'alpha'},
    'ttest_1samp': {'alpha', 'popmean'},
    'ttest_ind': {'equal_var', 'alpha'},
    'ttest_rel': {'alpha'},
    'wasserstein_distance': {},
    'wilcoxon': {'zero_method', 'correction', 'alpha'},
}


@safe_func
def log_algo_details(app_name, algo, algo_options):
    # Number of fields that have been preprocessed. i.e. contains SS_ prefix, etc.
    # Number of pre-processed fields with Standard Scaler
    num_fields_SS = len([f for f in algo.feature_variables if f.startswith('SS_')])
    # Robust Scaler
    num_fields_RS = len([f for f in algo.feature_variables if f.startswith('RS_')])
    # PCA or Kernel_PCA
    num_fields_PC = len([f for f in algo.feature_variables if f.startswith('PC_')])
    # Field Selector
    num_fields_fs = len([f for f in algo.feature_variables if f.startswith('fs_')])
    # TFIDF
    num_fields_tfidf = len([f for f in algo.feature_variables if '_tfidf_' in f])

    logger.debug(
        f'num_fields={len(algo.feature_variables)}, num_fields_prefixed={num_fields_SS + num_fields_RS + num_fields_PC + num_fields_tfidf + num_fields_fs}, num_fields_SS={num_fields_SS}, num_fields_RS={num_fields_RS}, num_fields_PC={num_fields_PC}, num_fields_fs={num_fields_fs}, num_fields_tfidf={num_fields_tfidf}'
    )
    algo_name = algo_options.get('algo_name')
    options_params = algo_options.get('params')
    _log_algorithm_and_param_info(app_name, algo_name, options_params)


@safe_func
def log_scoring_details(app_name, scoring, scoring_options):
    logger.debug(f'num_fields={len(scoring.variables)}')
    scoring_name = scoring_options.get('scoring_name')
    options_params = scoring_options.get('params')
    _log_scoring_and_param_info(app_name, scoring_name, options_params)


@safe_func
def log_uuid():
    logger.debug("UUID=%s" % str(uuid.uuid4()))


@safe_func
def log_apply_time(interval):
    logger.debug("command=apply, apply_time=%f" % interval)


@safe_func
def log_fit_time(interval):
    logger.debug("command=fit, fit_time=%f" % interval)


@safe_func
def log_scoring_time(interval):
    logger.debug("command=score, scoringTimeSec=%f" % interval)


@safe_func
def log_partial_fit():
    logger.debug("partialFit=True")


@safe_func
def log_experiment_details(model_name):
    if model_name.startswith('_exp_'):
        id_regex = re.compile(TELEMETRY_ID_REGEX)
        id_match = id_regex.match(model_name)
        number_match = re.search(r'(?:_)(\d+)$', model_name)
        if id_match:
            logger.debug("experiment_id=%s" % id_match.group(1))
        if number_match:
            logger.debug("pipeline_stage=%d" % int(number_match.group(1)))


@safe_func
def log_example_details(model_name):
    if model_name.startswith('example_'):
        model_name = model_name[8:]
        if model_name in example_names:
            logger.debug("example_name='%s'" % example_names[model_name])


@safe_func
def log_model_id(model_name):
    hash_model_id = hashlib.sha256('{}'.format(model_name).encode())
    logger.debug("modelId=%s" % (hash_model_id.hexdigest()))


@safe_func
def log_apply_details(app_name, algo_name, model_options):
    options_params = model_options.get('params')
    _log_algorithm_and_param_info(app_name, algo_name, options_params)


@safe_func
def log_app_details(app_name):
    logger.debug("app_context=%s" % (app_name if app_name in apps_white_list else 'Other'))


def _log_algorithm_and_param_info(app_name, algo_name, params):
    if app_name in apps_white_list:
        # Log the name of the algorithm which exists in the white list, also log its parameters if in the white list
        if algo_name in algorithm_and_parameter_white_list:
            params_in_white_list = (
                {
                    p: v
                    for p, v in list(params.items())
                    if p in algorithm_and_parameter_white_list[algo_name]
                }
                if params
                else None
            )
            # Change format of params from dictionary to string while logging
            params_to_log = json.dumps(params_in_white_list)
            # Log also the number of customer parameters which are not white listed
            num_custom_params = (
                len(params) - len(params_in_white_list) if params and params_to_log else 0
            )
            params_to_log = (
                f'{params_to_log}, num_custom_params: {num_custom_params}'
                if num_custom_params
                else params_to_log
            )
            params_to_log = '{%s}' % params_to_log if params_to_log else None
            logger.debug(f'algo_name={algo_name}, params={params_to_log}')
        # Log the hash of the algorithm name if it is not in the white list and do not log its parameters
        else:
            hash_algo_name = hashlib.sha256(f'{algo_name}'.encode())
            logger.debug(
                "algo_name={}, params=not_available".format(hash_algo_name.hexdigest())
            )
    else:
        logger.debug("algo_name=custom_app_algo, params=not_available")


def _log_scoring_and_param_info(app_name, scoring_name, params):
    if app_name in apps_white_list:
        # Log the name of the scoring which exists in the white list, also log its parameters if in the white list
        if scoring_name in scoring_and_parameter_white_list:
            params_in_white_list = (
                {
                    p: v
                    for p, v in list(params.items())
                    if p in scoring_and_parameter_white_list[scoring_name]
                }
                if params
                else None
            )
            # Change format of params from dictionary to string while logging
            params_to_log = json.dumps(params_in_white_list)
            # Log also the number of custom parameters which are not white listed
            num_custom_params = (
                len(params) - len(params_in_white_list) if params and params_to_log else 0
            )
            params_to_log = (
                f'{params_to_log}, num_custom_params: {num_custom_params}'
                if num_custom_params
                else params_to_log
            )
            params_to_log = '{%s}' % params_to_log if params_to_log else None
            logger.debug(f'scoringName={scoring_name}, params={params_to_log}')
        # Log the hash of the scoring name if it is not in the white list and do not log its parameters
        else:
            hash_scoring_name = hashlib.sha256(f'{scoring_name}'.encode())
            logger.debug(
                "scoringName={}, params=not_available".format(hash_scoring_name.hexdigest())
            )
    else:
        logger.debug("scoringName=custom_app_scoring, params=not_available")


def _field_value(df, fieldname, row_idx=-1):
    try:
        return df[fieldname].values[row_idx]
    except (KeyError, IndexError):
        return ''


@safe_func
def log_sourcetype_inference(df, row_idx=-1):
    """
    Log information required for sourcetype inference.

    Args:
        df (DataFrame): pandas data frame
        row_idx (int): index of the row to log.
            Negative index indicates a random row.

    Returns:
        True if logged, False otherwise.
    """
    if row_idx < 0:
        try:
            row_idx = np.random.randint(df.shape[0])
        except ValueError:
            # If we can't get a random row, just log the first row.
            row_idx = 0

    raw = _field_value(df, '_raw', row_idx)

    if raw:
        full_punct = re.sub(r'\w', '', raw)
        full_punct = re.sub(r'\n', '\\n', full_punct)
        full_punct = re.sub(r'\t', '\\t', full_punct)
        full_punct = re.sub(r' ', 's', full_punct)
    else:
        full_punct = ''

    sourcetype = _field_value(df, '_sourcetype', row_idx)

    if full_punct and sourcetype:
        logger.debug(
            "Sourcetype inference: Punct {} has sourcetype {}".format(full_punct, sourcetype)
        )
        return True
    else:
        return False


class Timer(object):
    def __enter__(self):
        self.start = time.time()
        return self

    def __exit__(self, *args):
        self.end = time.time()
        self.interval = self.end - self.start
