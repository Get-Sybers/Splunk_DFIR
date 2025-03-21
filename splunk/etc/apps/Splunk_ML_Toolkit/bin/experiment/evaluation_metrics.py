from copy import deepcopy
from io import StringIO

from numpy import sqrt
import pandas as pd
from sklearn.model_selection import train_test_split

import cexc
from algos.AutoPrediction import AutoPrediction
from algos_support.density_function.column_name import make_column_name
from scorings.classification.Accuracy import AccuracyScoring
from scorings.classification.PrecisionRecallFscoreSupport import (
    PrecisionRecallFscoreSupportScoring,
)

from scorings.regression.R2 import R2Scoring
from scorings.regression.MeanSquaredError import MeanSquaredErrorScoring
from scorings.clustering.Silhouette import SilhouetteScoring

logger = cexc.get_logger('LogexperimentStatistics')
messages = cexc.get_messages_logger()

forecastMetadata = '_forecastMetadata'


def get_statistics_metadata(experiment, body):
    """Load experiment metadata and input data.

    Args:
        experiment (dict): fetched experiment from REST
        body (csv str): csv string data payload from CEXC

    Returns:
        exp_metadata (dict or None): experiment metadata, if was accessible.
            - experiment type (str)
            - ground-truth field name (str)
            - predicted field name (str)
            - data containing ground-truth/predicted data (pd.dataframe)
         If not accessible, returns None.
    """
    debugging_msg_prefix = 'Statistics could not be computed -- {}.'

    exp_type = experiment.get('type')
    # Get 'main' search stage, as it contains the desired target/feature variables
    search_stages = experiment.get('searchStages', [])
    if len(search_stages) == 0:
        logger.error(debugging_msg_prefix.format('experiment has no searchStages'))
        return None

    # We assume that each 'stage' is a python dictionary (search stages is a list of dictionaries)
    main_search_stages = [stage for stage in search_stages if stage.get('role') == 'main']
    if len(main_search_stages) != 1:
        logger.error(debugging_msg_prefix.format("require exactly one 'main' search stages."))
        return None

    # Get the target variables and predicted fields
    main_search_stage = main_search_stages[0]

    target_variables = main_search_stage.get('targetVariables')

    if target_variables is None:
        # check for univariate 'targetVariable' field
        target_variable = main_search_stage.get('targetVariable')
        if target_variable is None:
            logger.error(
                debugging_msg_prefix.format(
                    'No target variable(s) was found in main search stage.'
                )
            )
            return None
        else:
            target_variables = [target_variable]
    elif not (
        type(target_variables) is list
        and all(isinstance(t, str) for t in target_variables)
        and len(target_variables) > 0
    ):
        # check if we have a list, and have at least one string (target column name) in the list
        logger.error(
            debugging_msg_prefix.format(
                'Malformatted "targetVariables" field: {}'.format(target_variables)
            )
        )
        return None

    if exp_type == 'smart_outlier_detection':
        prefix = "IsOutlier"
        predicted_fields = [
            make_column_name(main_name=prefix, feature_variable=t) for t in target_variables
        ]
    elif exp_type == 'smart_clustering':
        predicted_fields = ['cluster']
    else:
        predicted_fields = ['predicted({})'.format(t) for t in target_variables]

    extract_fields_list = target_variables + predicted_fields
    if exp_type == 'smart_forecasting':
        extract_fields_list = extract_fields_list + [forecastMetadata]
    # pandas require unicode column names
    cols_to_extract = [str(f) for f in (extract_fields_list)]

    sio = StringIO(body)
    sio.seek(0)
    try:  # Ensure that the data contains the target variables and predicted fields
        applied_data = pd.read_csv(sio, usecols=cols_to_extract)
    except ValueError as e:
        msg = "data must contain the columns: {}"
        logger.debug(msg.format(cols_to_extract))
        logger.debug(e)
        return None

    algorithm_params = (
        search_stages[1].get('algorithmParams')
        if len(search_stages) > 1
        else search_stages[0].get('algorithmParams')
    )
    # Return the metadata required for scoring
    exp_metadata = {
        'type': exp_type,
        'target_variables': target_variables,
        'predicted': predicted_fields,
        'data': applied_data,
        'algorithmParams': algorithm_params,
    }
    return exp_metadata


def get_scoring_results(scoring_class, scoring_opts, data):
    """Call the scoring function and compute the results.

    Args:
        scoring_class (scoring obj): object capable of computing score
        scoring_opts (dict): options passed to scoring object
        data (pd.dataframe): data containing predicted and ground-truth data

    Returns:
        results (pd.dataframe): results of applying scoring function
    """
    scorer = scoring_class(scoring_opts)
    results = scorer.score(data, scoring_opts)
    return results


def compute_pcf_statistics(exp_metadata, ndigits=2):
    """Compute the statistics for a PCF experiment.

    Computes precision, recall, f1 and accuracy scores.

    -For precision, recall and f1, a 'weighted' averaging
        scheme is used.

    Args:
        exp_metadata (dict): Metadata of an experiment, containing:
            - experiment type (str)
            - ground-truth field names (list)
            - predicted field names (list)
            - data containing ground-truth/predicted data (pd.dataframe)
        ndigits (int): Number of digits to keep after the decimal place

    Returns:
        statistics_dict (dict): Dictionary of computed statistics
    """
    opts_skeleton = {
        'scoring_name': '',
        'params': {},
        'variables': [],
        'a_variables': exp_metadata['target_variables'],
        'b_variables': exp_metadata['predicted'],
    }

    try:
        # Get the precision, recall and f1-score
        opts = deepcopy(opts_skeleton)
        opts['scoring_name'] = 'precision_recall_fscore_support'
        opts['params']['average'] = 'weighted'
        p_r_f_s = get_scoring_results(
            PrecisionRecallFscoreSupportScoring, opts, exp_metadata['data']
        )

        # Get the accuracy score
        opts = deepcopy(opts_skeleton)
        opts['scoring_name'] = 'accuracy_score'
        accuracy = get_scoring_results(AccuracyScoring, opts, exp_metadata['data'])

        # Create statistics dictionary; keys must be compatible with experiment schema
        statistics_dict = {
            'stats_precision': round(float(p_r_f_s['precision'][0]), ndigits),
            'stats_recall': round(float(p_r_f_s['recall'][0]), ndigits),
            'stats_f1': round(float(p_r_f_s['fbeta_score'][0]), ndigits),
            'stats_accuracy': round(float(accuracy['accuracy_score'][0]), ndigits),
        }
    except Exception as e:
        msg = 'PCF statistics could not be computed -- failed to evaluate scoring metrics on experiment metadata.'
        logger.debug(msg)
        logger.debug(e)
        statistics_dict = {}

    return statistics_dict


def compute_pnf_statistics(exp_metadata, ndigits_rmse=2, ndigits_r2=4):
    """Compute the statistics for a PNF experiment.

    - Computes r^2 (coefficient of determination) and
        RMSE (root mean squared error)

    Args:
        exp_metadata (dict): Metadata of an experiment, containing:
            - experiment type (str)
            - ground-truth field names (list)
            - predicted field names (list)
            - data containing ground-truth/predicted data (pd.dataframe)
        ndigits_rmse (int): Number of digits to keep after the decimal place
            for root-mean-squared-error metric
        ndigits_r2 (int): Number of digits to keep after the decimal place
            for r^2 metric
    Returns:
        statistics_dict (dict): Dictionary of computed statistics
    """
    opts_skeleton = {
        'scoring_name': '',
        'params': {},
        'a_variables': exp_metadata['target_variables'],
        'b_variables': exp_metadata['predicted'],
        'variables': [],
    }

    try:
        # Get the r^2 statistic
        opts = deepcopy(opts_skeleton)
        opts['scoring_name'] = 'r2_score'
        r2 = get_scoring_results(R2Scoring, opts, exp_metadata['data'])

        # Get the RMSE statistic
        opts = deepcopy(opts_skeleton)
        opts['scoring_name'] = 'mean_squared_error'
        mse = get_scoring_results(MeanSquaredErrorScoring, opts, exp_metadata['data'])

        # Create statistics dictionary; keys must be compatible with experiment schema
        statistics_dict = {
            # For r^2, we round to 4 decimal places for historical reasons
            'stats_rSquared': round(float(r2['r2_score'][0]), ndigits_r2),
            # Take the square root to obtain RMSE
            'stats_RMSE': round(sqrt(float(mse['mean_squared_error'][0])), ndigits_rmse),
        }

    except Exception as e:
        msg = 'PNF statistics could not be computed -- failed to evaluate scoring metrics on experiment metadata.'
        logger.debug(msg)
        logger.debug(e)
        statistics_dict = {}

    return statistics_dict


def compute_sf_statistics(exp_metadata, ndigits_rmse=2, ndigits_r2=4):
    """Compute the statistics for a Smart Forecast experiment.

    - Computes r^2 (coefficient of determination) and
        RMSE (root mean squared error)

    Args:
        exp_metadata (dict): Metadata of an experiment, containing:
            - experiment type (str)
            - ground-truth field names (list)
            - predicted field names (list)
            - data containing ground-truth/predicted data (pd.dataframe)
        ndigits_rmse (int): Number of digits to keep after the decimal place
            for root-mean-squared-error metric
        ndigits_r2 (int): Number of digits to keep after the decimal place
            for r^2 metric
    Returns:
        statistics_dict (dict): Dictionary of computed statistics
    """
    opts_skeleton = {
        'scoring_name': '',
        'params': {},
        'a_variables': exp_metadata['target_variables'],
        'b_variables': exp_metadata['predicted'],
        'variables': [],
    }

    try:
        # Get the r^2 statistic
        opts = deepcopy(opts_skeleton)
        opts['scoring_name'] = 'r2_score'
        dataset = exp_metadata['data'].copy()
        exp_metadata['data'] = dataset[(dataset[forecastMetadata] == "hf")]
        r2 = get_scoring_results(R2Scoring, opts, exp_metadata['data'])

        # Get the RMSE statistic
        opts = deepcopy(opts_skeleton)
        opts['scoring_name'] = 'mean_squared_error'
        mse = get_scoring_results(MeanSquaredErrorScoring, opts, exp_metadata['data'])

        stats_rSquared, stats_RMSE = [], []

        for idx, t in enumerate(exp_metadata['target_variables']):
            stats_rSquared.append(
                {'key': t, 'value': round(float(r2['r2_score'][idx]), ndigits_r2)}
            )  # For r^2, we round to 4 decimal places for historical reasons
            stats_RMSE.append(
                {
                    'key': t,
                    'value': round(sqrt(float(mse['mean_squared_error'][idx])), ndigits_rmse),
                }
            )  # Take the square root to obtain RMSE

        # Create statistics dictionary; keys must be compatible with experiment schema
        statistics_dict = {'stats_rSquared': stats_rSquared, 'stats_RMSE': stats_RMSE}

    except Exception as e:
        msg = 'Smart Forecast statistics could not be computed -- failed to evaluate scoring metrics on experiment metadata.'
        logger.debug(msg)
        logger.debug(e)
        statistics_dict = {}

    return statistics_dict


def compute_soda_statistics(exp_metadata, outlier_value=1.0):
    """Compute the statistics for a Smart Outlier Detection experiment.

    - Computes number of outliers given a field to predict on

    Args:
        exp_metadata (dict): Metadata of an experiment, containing:
            - experiment type (str)
            - ground-truth field names (list)
            - predicted field names (list)
            - data containing ground-truth/predicted data (pd.dataframe)
        outlier_value (int): Default value for entry in data being predicted as outlier
    Returns:
        statistics_dict (dict): Dictionary of computed statistics
    """

    try:
        # Get the outlier count statistic
        data = deepcopy(exp_metadata['data'])
        statistics_dict, stats_outlierCount = {}, []
        # Count outliers for each target variable
        for idx, t in enumerate(exp_metadata['target_variables']):
            outlierCol = make_column_name(
                main_name="IsOutlier", feature_variable=exp_metadata['target_variables'][idx]
            )
            outlierCount = int((data[outlierCol] == outlier_value).sum())
            stats_outlierCount.append(
                {'key': exp_metadata['target_variables'][idx], 'value': outlierCount}
            )

        # Create statistics dictionary; keys must be compatible with experiment schema
        statistics_dict['stats_outlierCount'] = stats_outlierCount

    except Exception as e:
        msg = 'Smart Outlier Detection statistics could not be computed -- failed to evaluate scoring metrics on experiment metadata.'
        logger.debug(msg)
        logger.debug(e)
        statistics_dict = {}

    return statistics_dict


def compute_sc_statistics(exp_metadata, ndigits_silhouette=2):
    """Compute the statistics for a Smart Clustering experiment.

    - Computes Silhouette Score

    Args:
        exp_metadata (dict): Metadata of an experiment, containing:
            - experiment type (str)
            - predicted field name (list which includes only label field name)
            - target variables field names (list)
            - data containing target_variables/label data (pd.dataframe)
        ndigits_silhouette (int): Number of digits to keep after the decimal place for silhouette metric
    Returns:
        statistics_dict (dict): Dictionary of computed statistics
    """
    opts = {
        'scoring_name': 'silhouette_score',
        'params': {},
        'a_variables': exp_metadata['predicted'],
        'b_variables': exp_metadata['target_variables'],
        'variables': [],
    }
    try:
        # Get the silhouette score
        silhouette = get_scoring_results(SilhouetteScoring, opts, exp_metadata['data'])
        # Create statistics dictionary; keys must be compatible with experiment schema
        statistics_dict = {
            'stats_silhouette_score': round(
                float(silhouette['silhouette_score']), ndigits_silhouette
            )
        }
    except Exception as e:
        msg = 'Smart Clustering statistics could not be computed -- failed to evaluate scoring metrics on experiment metadata.'
        logger.debug(msg)
        logger.debug(e)
        statistics_dict = {}
    return statistics_dict


def compute_sp_statistics(exp_metadata, ndigits=2, ndigits_r2=4):
    """Compute the statistics for a Smart Prediction experiment.

    - Computes r^2 (coefficient of determination) and
        RMSE (root mean squared error) when the experiment is numerical
    - Computes accuracy, precision, f1_score, recall when the experiment is categorical.

    Args:
        exp_metadata (dict): Metadata of an experiment, containing:
            - experiment type (str)
            - ground-truth field names (list)
            - predicted field names (list)
            - data containing ground-truth/predicted data (pd.dataframe)
        ndigits (int): Number of digits to keep after the decimal place
            for any scoring metric
        ndigits_r2 (int): Number of digits to keep after the decimal place
            for r^2 metric
    Returns:
        statistics_dict (dict): Dictionary of computed statistics
    """
    opts_skeleton = {
        'scoring_name': '',
        'params': {},
        'a_variables': exp_metadata.get('target_variables'),
        'b_variables': exp_metadata.get('predicted'),
        'variables': [],
    }
    data = exp_metadata.get('data')
    algo_params = exp_metadata.get('algorithmParams')
    test_split_ratio = algo_params.get('test_split_ratio', 0)
    if test_split_ratio > 0:
        train, test = train_test_split(data, test_size=test_split_ratio)
    else:
        train = data
        test = pd.DataFrame()

    try:
        # there is only one target variable in Smart Prediction. send it as a field to _is_categorical method
        categorical = AutoPrediction.is_categorical(
            data, exp_metadata.get('target_variables')[0], algo_params
        )
        stats_rSquared, stats_RMSE, stats_accuracy, stats_precision, stats_recall, stats_f1 = (
            [],
            [],
            [],
            [],
            [],
            [],
        )
        if categorical:
            # Get the Accuracy statistic
            opts = deepcopy(opts_skeleton)
            opts['scoring_name'] = 'accuracy_score'
            accuracy_train = get_scoring_results(AccuracyScoring, opts, train)
            if test_split_ratio > 0:
                accuracy_test = get_scoring_results(AccuracyScoring, opts, test)

            # Get the Precision, Recall, F1 statistic
            opts = deepcopy(opts_skeleton)
            opts['scoring_name'] = 'precision_recall_fscore_support'
            opts['params'] = {'average': 'weighted'}
            precision_recall_f1_train = get_scoring_results(
                PrecisionRecallFscoreSupportScoring, opts, train
            )
            if test_split_ratio > 0:
                precision_recall_f1_test = get_scoring_results(
                    PrecisionRecallFscoreSupportScoring, opts, test
                )

            # there is only one target_variable in Smart Prediction so we get the first value for all scores
            stats_accuracy.append(
                {
                    'key': 'Training',
                    'value': round(float(accuracy_train['accuracy_score'][0]), ndigits),
                }
            )
            stats_f1.append(
                {
                    'key': 'Training',
                    'value': round(float(precision_recall_f1_train['fbeta_score'][0]), ndigits),
                }
            )
            stats_precision.append(
                {
                    'key': 'Training',
                    'value': round(float(precision_recall_f1_train['precision'][0]), ndigits),
                }
            )
            stats_recall.append(
                {
                    'key': 'Training',
                    'value': round(float(precision_recall_f1_train['recall'][0]), ndigits),
                }
            )
            # Calculate the test scores only if there is test data
            if test_split_ratio > 0:
                stats_accuracy.append(
                    {
                        'key': 'Testing',
                        'value': round(float(accuracy_test['accuracy_score'][0]), ndigits),
                    }
                )
                stats_f1.append(
                    {
                        'key': 'Testing',
                        'value': round(
                            float(precision_recall_f1_test['fbeta_score'][0]), ndigits
                        ),
                    }
                )
                stats_precision.append(
                    {
                        'key': 'Testing',
                        'value': round(
                            float(precision_recall_f1_test['precision'][0]), ndigits
                        ),
                    }
                )
                stats_recall.append(
                    {
                        'key': 'Testing',
                        'value': round(float(precision_recall_f1_test['recall'][0]), ndigits),
                    }
                )
        else:
            # Get the r^2 statistic
            opts = deepcopy(opts_skeleton)
            opts['scoring_name'] = 'r2_score'
            r2_train = get_scoring_results(R2Scoring, opts, train)
            if test_split_ratio > 0:
                r2_test = get_scoring_results(R2Scoring, opts, test)

            # Get the RMSE statistic
            opts = deepcopy(opts_skeleton)
            opts['scoring_name'] = 'mean_squared_error'
            mse_train = get_scoring_results(MeanSquaredErrorScoring, opts, train)
            if test_split_ratio:
                mse_test = get_scoring_results(MeanSquaredErrorScoring, opts, test)

            stats_rSquared.append(
                {'key': 'Training', 'value': round(float(r2_train['r2_score'][0]), ndigits_r2)}
            )
            stats_RMSE.append(
                {
                    'key': 'Training',
                    'value': round(sqrt(float(mse_train['mean_squared_error'][0])), ndigits),
                }
            )  # Take the square root to obtain RMSE

            # Calculate the test scores only if there is test data and append them as well
            if test_split_ratio > 0:
                stats_rSquared.append(
                    {
                        'key': 'Testing',
                        'value': round(float(r2_test['r2_score'][0]), ndigits_r2),
                    }
                )
                stats_RMSE.append(
                    {
                        'key': 'Testing',
                        'value': round(sqrt(float(mse_test['mean_squared_error'][0])), ndigits),
                    }
                )

        statistics_dict = {
            'stats_rSquared': stats_rSquared,
            'stats_RMSE': stats_RMSE,
            'stats_accuracy': stats_accuracy,
            'stats_f1': stats_f1,
            'stats_precision': stats_precision,
            'stats_recall': stats_recall,
        }
    except Exception as e:
        msg = 'Smart Prediction statistics could not be computed -- failed to evaluate scoring metrics on experiment metadata.'
        logger.debug(msg)
        logger.debug(e)
        statistics_dict = {}

    return statistics_dict


def _merge_exp_metadata(exp_metadata_list):
    """
    Merge the list of experiment metadata into a single entry

    Args:
        exp_metadata_list (list): list of experiment metadata dicts
            (each metadata dict is the output of get_statistics_metadata())

    Returns:
        exp_metadata (dict): Single experiment metadata with merged 'data' field
    """
    data_fieldname = 'data'
    data_list = [exp_metadata.get(data_fieldname) for exp_metadata in exp_metadata_list]

    # Fix the index after merging the data field
    data_df = pd.concat(data_list)
    data_df.index = list(range(len(data_df)))

    # All metadata entries should have the same fields and values except for the data.
    exp_metadata = exp_metadata_list[-1]
    exp_metadata[data_fieldname] = data_df
    return exp_metadata


def compute_statistics(exp_metadata_list):
    """Compute the statistics for the given prediction problem.

    Accepted prediction problems are:
        - Predict categorical fields (PCF)

    Args:
        exp_metadata_list (list): list of experiment metadata dicts
            (each metadata dict is the output of get_statistics_metadata())

    Returns:
        statistics (dict): PCF dictionary of statistics results.
            Empty dictionary returned if results could not be calculated.
    """
    # If any chunk is None, don't compute statistics
    if not all(exp_metadata_list):
        return {}

    exp_metadata = _merge_exp_metadata(exp_metadata_list)

    exp_type = exp_metadata.get('type')
    if exp_type == 'predict_categorical_fields':
        statistics_dict = compute_pcf_statistics(exp_metadata)
    elif exp_type == 'predict_numeric_fields':
        statistics_dict = compute_pnf_statistics(exp_metadata)
    elif exp_type == 'cluster_numeric_events':
        # cluster_numeric_events are not implemented yet
        statistics_dict = {}
    elif exp_type == 'smart_forecast':
        statistics_dict = compute_sf_statistics(exp_metadata)
    elif exp_type == 'smart_outlier_detection':
        statistics_dict = compute_soda_statistics(exp_metadata)
    elif exp_type == 'smart_clustering':
        statistics_dict = compute_sc_statistics(exp_metadata)
    elif exp_type == 'smart_prediction':
        statistics_dict = compute_sp_statistics(exp_metadata)
    else:
        logger.debug(
            "Cannot compute experiment statistics on experiment of type: {}.".format(exp_type)
        )
        statistics_dict = {}
    return statistics_dict
