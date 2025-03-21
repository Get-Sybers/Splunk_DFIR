#!/user/bin/env python

from sklearn.neighbors import LocalOutlierFactor as _LocalOutlierFactor

from base import ClustererMixin, BaseAlgo
from util import df_util
from util.param_util import convert_params


class LocalOutlierFactor(ClustererMixin, BaseAlgo):
    def __init__(self, options):
        self.handle_options(options)
        out_params = convert_params(
            options.get('params', {}),
            ints=['n_neighbors', 'leaf_size', 'p'],
            floats=['contamination'],
            strs=['algorithm', 'metric'],
            bools=['anomaly_score'],
        )
        # dump the value of anomaly score parameter in a local variable, to retrieve it later
        self.return_scores = out_params.pop('anomaly_score', True)

        #   whitelist n_neighbors should be > 0
        if 'n_neighbors' in out_params and out_params['n_neighbors'] <= 0:
            msg = 'Invalid value error: n_neighbors must be greater than 0, but found n_neighbors="{}".'
            raise RuntimeError(msg.format(out_params['n_neighbors']))

        #   whitelist leaf_size should be >= 1
        if 'leaf_size' in out_params and out_params['leaf_size'] < 1:
            msg = 'Invalid value error: leaf_size must be greater than or equal to 1, but found leaf_size="{}".'
            raise RuntimeError(msg.format(out_params['leaf_size']))

        #   whitelist valid values for algorithm, as error raised by sklearn for invalid values is uninformative
        valid_algorithms = ['brute', 'kd_tree', 'ball_tree', 'auto']
        if 'algorithm' in out_params and out_params['algorithm'] not in valid_algorithms:
            msg = (
                'Invalid value error: Valid values for algorithm are "brute", "kd_tree", "ball_tree", "auto", '
                'but found algorithm="{}".'
            )
            raise RuntimeError(msg.format(out_params['algorithm']))

        #   whitelist valid values for metric relative to algorithm, as error raised by sklearn for invalid values
        if 'metric' in out_params:
            # Default value of the algorithm is 'auto'
            self.check_valid_algorithm_metric_combination(
                out_params.get('algorithm', 'auto'), out_params['metric']
            )

        #   whitelist contamination should be in (0.0, 0.5] as error raised by sklearn for values out of range
        if 'contamination' in out_params and not (0.0 < out_params['contamination'] <= 0.5):
            msg = (
                'Invalid value error: Valid values for contamination are in (0.0, 0.5], '
                'but found contamination="{}".'
            )
            raise RuntimeError(msg.format(out_params['contamination']))

        #   whitelist p should be >= 1 for minkowski metric
        if (
            'p' in out_params
            and (out_params['p'] < 1)
            and out_params.get('metric', 'minkowski') == 'minkowski'
        ):
            msg = 'Invalid value error: p must be greater than or equal to 1 for minkowski metric, but found p="{}".'
            raise RuntimeError(msg.format(out_params['p']))

        self.estimator = _LocalOutlierFactor(**out_params)

    @staticmethod
    def check_valid_algorithm_metric_combination(algorithm, metric):
        """Check if the provided metric is valid for the algorithm, raise an error if not."""
        kd_tree_metric = [
            'cityblock',
            'euclidean',
            'l1',
            'l2',
            'manhattan',
            'chebyshev',
            'minkowski',
        ]
        ball_tree_metric = kd_tree_metric + [
            'braycurtis',
            'canberra',
            'dice',
            'hamming',
            'jaccard',
            'kulsinski',
            'matching',
            'rogerstanimoto',
            'russellrao',
            'sokalmichener',
            'sokalsneath',
        ]
        all_valid_metric = ball_tree_metric + ['cosine', 'correlation', 'sqeuclidean', 'yule']

        # all metrics are valid for brute and auto since auto already takes care of algorithm-metric match
        valid_algorithm_metric = {
            'brute': all_valid_metric,
            'auto': all_valid_metric,
            'ball_tree': ball_tree_metric,
            'kd_tree': kd_tree_metric,
        }
        if not (metric in valid_algorithm_metric[algorithm]):
            msg = (
                'Invalid value error: metric "{}" is invalid for algorithm "{}". Please see documentation '
                'for a complete list of valid algorithm-metric combinations.'
            )
            raise RuntimeError(msg.format(metric, algorithm))

    def fit(self, df, options):
        #   Make a copy of data, to not alter original data frame
        X = df.copy()
        X, nans, _ = df_util.prepare_features(
            X=X, variables=self.feature_variables, mlspl_limits=options.get('mlspl_limits')
        )

        #   y_hat is 1d array of inliers/outliers in [1, -1], respectively.
        #   inverting y_hat to represent outliers as '1', inliers as '-1' for consistency.
        y_hat = self.estimator.fit_predict(X.values) * -1
        default_name = 'isOutlier'
        output_name = options.get('output_name', default_name)

        #  Code segment to include negative outlier score in the output.
        if self.return_scores:
            anomaly_scores = self.estimator.negative_outlier_factor_.round(2)
            output_name = [output_name] + ['anomaly_score']
            y_hat = list(zip(y_hat, anomaly_scores))

        output = df_util.create_output_dataframe(
            y_hat=y_hat, nans=nans, output_names=output_name
        )
        df = df_util.merge_predictions(df, output)
        return df
