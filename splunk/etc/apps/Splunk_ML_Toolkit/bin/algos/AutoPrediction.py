import numpy as np
from pandas import DataFrame, isnull
from sklearn.metrics import (
    accuracy_score,
    precision_recall_fscore_support,
    r2_score,
    mean_squared_error,
)
from sklearn.model_selection import train_test_split

from algos.RandomForestClassifier import RandomForestClassifier
from algos.RandomForestRegressor import RandomForestRegressor
from base import BaseAlgo, ClassifierMixin, RegressorMixin
from codec import codecs_manager
from util import df_util
from util.param_util import convert_params, get_param_choice

import cexc

logger = cexc.get_logger(__name__)


class AutoPrediction(ClassifierMixin, RegressorMixin, BaseAlgo):
    AUTO_TYPE = 'auto'
    CATEGORY_TYPE = 'categorical'
    NUMERIC_TYPE = 'numeric'

    SPLIT_FIELD_NAME = '_split'
    TEST_SPLIT_NAME = 'Test'
    TRAIN_SPLIT_NAME = 'Training'

    TARGET_TYPE_FIELD_NAME = '_target_type'

    def __init__(self, options):
        self._handle_options(options)

        params = convert_params(
            options.get('params', {}),
            floats=['test_split_ratio'],
            ints=[
                'random_state',
                'n_estimators',
                'max_depth',
                'min_samples_split',
                'max_leaf_nodes',
            ],
            strs=['target_type', 'max_features', 'criterion'],
        )

        acceptable_target_types = (
            AutoPrediction.AUTO_TYPE,
            AutoPrediction.CATEGORY_TYPE,
            AutoPrediction.NUMERIC_TYPE,
        )
        self._target_type = get_param_choice(
            params, 'target_type', acceptable_target_types, AutoPrediction.AUTO_TYPE
        )

        self.test_split_ratio = params.get('test_split_ratio', 0)
        if self.test_split_ratio < 0:
            raise RuntimeError("'test_split_ratio' must be nonnegative")
        elif self.test_split_ratio >= 1:
            raise RuntimeError("'test_split_ratio' must be less than 1")

        self._set_random_state(params)

    def _handle_options(self, options):
        """Utility to ensure there are both target and feature variables"""
        if (
            len(options.get('target_variable', [])) != 1
            or len(options.get('feature_variables', [])) == 0
        ):
            raise RuntimeError('Syntax error: expected "<target> FROM <field> ..."')

    def _set_random_state(self, params):
        random_state = params.get('random_state')
        if random_state is not None:
            logger.debug("Setting random state to {}".format(random_state))
            np.random.seed(random_state)

    @staticmethod
    def is_categorical(df, field, params):
        df_util.assert_field_present(df, field)
        categorical_types = (bool, str, np.bool, np.object)
        int_types = (
            int,
            np.int8,
            np.int16,
            np.int32,
            np.int64,
            np.uint8,
            np.uint16,
            np.uint32,
            np.uint64,
        )
        field_type = df[[field]].dtypes[field]

        return (field_type in categorical_types) or (
            field_type in int_types and params and 'criterion' in params
        )

    def _set_model_type(self, df, options):
        if self._target_type == 'auto':
            if AutoPrediction.is_categorical(df, self.target_variable, options.get('params')):
                self.model_type = 'classification'
            else:
                self.model_type = 'regression'
        elif self._target_type == 'categorical':
            self.model_type = 'classification'
        else:
            self.model_type = 'regression'

    def fit(self, df, options):
        self._set_model_type(df, options)
        if 'params' in options:
            [
                options['params'].pop(x)
                for x in ['target_type', 'test_split_ratio']
                if x in options['params']
            ]
            if self.model_type == 'regression' and 'criterion' in options['params']:
                options['params'].pop('criterion')
                cexc.messages.warn(
                    "'criterion' option will be ignored for numeric target types"
                )

        self._algo = (
            RandomForestClassifier(options)
            if self.model_type == 'classification'
            else RandomForestRegressor(options)
        )
        self._algo.target_variable = self.target_variable
        self._algo.feature_variables = self.feature_variables

        if self.test_split_ratio > 0:
            train, test = train_test_split(df, test_size=self.test_split_ratio)
            test_idx = test.index.values
            self.num_test_points = len(test)
        else:
            train = df
            test_idx = []
            self.num_test_points = 0
        train_idx = train.index.values
        self.num_train_points = len(train)
        fit_output = self._algo.fit(train, options)
        if fit_output is not None:
            return fit_output

        output_df = self.apply(df, options)
        output_df.loc[
            train_idx, AutoPrediction.SPLIT_FIELD_NAME
        ] = AutoPrediction.TRAIN_SPLIT_NAME
        output_df.loc[
            test_idx, AutoPrediction.SPLIT_FIELD_NAME
        ] = AutoPrediction.TEST_SPLIT_NAME

        default_name = 'predicted({})'.format(self.target_variable)
        new_name = options.get('output_name')
        self.output_name = new_name if new_name is not None else default_name

        self._scores = self._compute_train_test_scores(
            output_df, train_idx, AutoPrediction.TRAIN_SPLIT_NAME
        )
        if self.test_split_ratio > 0:
            test_scores = self._compute_train_test_scores(
                output_df, test_idx, AutoPrediction.TEST_SPLIT_NAME
            )
            [self._scores[k].extend(test_scores[k]) for k in self._scores]

        return output_df

    def apply(self, df, options):
        output_df = self._algo.apply(df, options)

        if self._target_type == AutoPrediction.AUTO_TYPE:
            output_df[AutoPrediction.TARGET_TYPE_FIELD_NAME] = (
                f"{AutoPrediction.AUTO_TYPE}:{AutoPrediction.CATEGORY_TYPE}"
                if self.model_type == 'classification'
                else f"{AutoPrediction.AUTO_TYPE}:{AutoPrediction.NUMERIC_TYPE}"
            )
        elif self._target_type == AutoPrediction.NUMERIC_TYPE:
            output_df[AutoPrediction.TARGET_TYPE_FIELD_NAME] = f"{AutoPrediction.NUMERIC_TYPE}"
        else:
            output_df[AutoPrediction.TARGET_TYPE_FIELD_NAME] = f"{AutoPrediction.CATEGORY_TYPE}"

        return output_df

    def _compute_classify_scores(self, y_true, y_pred):
        if len(y_true) == 0 or len(y_pred) == 0:
            accuracy, precision, recall, f1 = None, None, None, None
        else:
            accuracy = accuracy_score(y_true, y_pred)
            precision, recall, f1, _ = precision_recall_fscore_support(
                y_true, y_pred, average='weighted'
            )
        return {
            'accuracy': [accuracy],
            'f1': [f1],
            'precision': [precision],
            'recall': [recall],
        }

    def _compute_regress_scores(self, y_true, y_pred):
        if len(y_true) == 0 or len(y_pred) == 0:
            rmse, r2 = None, None
        else:
            rmse = np.sqrt(mean_squared_error(y_true, y_pred))
            r2 = r2_score(y_true, y_pred)
        return {'RMSE': [rmse], 'rSquared': [r2]}

    def _compute_train_test_scores(self, output_df, idx, mode):
        label_null_idx = np.where(isnull(output_df[self.target_variable]))
        pred_null_idx = np.where(isnull(output_df[self.output_name]))
        null_idx = np.union1d(label_null_idx, pred_null_idx)
        idx = np.setdiff1d(idx, null_idx)

        y_true = output_df.loc[idx, self.target_variable]
        y_pred = output_df.loc[idx, self.output_name]
        scores = (
            self._compute_classify_scores(y_true, y_pred)
            if self.model_type == 'classification'
            else self._compute_regress_scores(y_true, y_pred)
        )
        scores['split'] = [mode]
        return scores

    def summary(self, options):
        if len(options) != 2:  # only model name and mlspl_limits
            raise RuntimeError(
                f"'{self.__class__.__name__}' models do not take options for summarization"
            )

        algo_summary = self._algo.summary(options)
        feature_importance = {row[0]: row[1] for col, row in algo_summary.iterrows()}

        summary_dict = {
            'model type': self.model_type,
            'num test data points': self.num_test_points,
            'num train data points': self.num_train_points,
            'test split ratio': self.test_split_ratio,
        }
        summary_dict.update(feature_importance)
        summary_dict.update(self._scores)

        df = DataFrame(summary_dict)
        return df

    @staticmethod
    def register_codecs():
        from codec.codecs import SimpleObjectCodec, TreeCodec

        codecs_manager.add_codec('algos.AutoPrediction', 'AutoPrediction', SimpleObjectCodec)
        codecs_manager.add_codec(
            'algos.RandomForestClassifier', 'RandomForestClassifier', SimpleObjectCodec
        )
        codecs_manager.add_codec(
            'sklearn.ensemble._forest', 'RandomForestClassifier', SimpleObjectCodec
        )
        codecs_manager.add_codec(
            'sklearn.tree._classes', 'DecisionTreeClassifier', SimpleObjectCodec
        )
        codecs_manager.add_codec(
            'algos.RandomForestRegressor', 'RandomForestRegressor', SimpleObjectCodec
        )
        codecs_manager.add_codec(
            'sklearn.ensemble._forest', 'RandomForestRegressor', SimpleObjectCodec
        )
        codecs_manager.add_codec(
            'sklearn.tree._classes', 'DecisionTreeRegressor', SimpleObjectCodec
        )
        codecs_manager.add_codec('sklearn.tree._tree', 'Tree', TreeCodec)
