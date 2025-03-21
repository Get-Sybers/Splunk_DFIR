# mlspl.conf contains configuration for the "fit", "apply" and
# "score" commands included with the Machine Learning Toolkit.
#
# Put global settings in the [default] stanza and algorithm-specific
# settings in a stanza named for the algorithm
# (e.g. [LinearRegression] for the LinearRegression algorithm).
#
# Stanzas given by [score:<subpackage>] do not reference algorithms but rather
# "score" methods (e.g. [score:classification] for classification
# scoring methods such as accuracy_score. Attributes/values for
# these stanzas apply to all scoring methods in the subpackage.

# When the comments (the second line of comment for each stanza) are updated
# ml-app/src/main/webapp/models/properties/MLSPL.es file must be updated as well
# if you want the comments to be seen in the UI in help text.

[default]
handle_new_cat = <string>
* defaults to default
* Action to perform when new value(s) for categorical variable/explanatory
  variable is encountered in partial_fit
  default   : set all values of the column that corresponds to the new
              categorical value to 0's
  skip      : skip over rows that contain the new value(s) and raise a
              warning
  stop      : stop the operation by raising an error

max_distinct_cat_values = <int>
* defaults to 100
* determines the upper limit for the number of categorical values that will be encoded
in one-hot encoding
* if the number of distinct values exceeds this limit, the field will be dropped
  (with a warning)

max_distinct_cat_values_for_classifiers = <int>
* defaults to 100
* determines the upper limit for the number of distinct values in a categorical field that is
the target (or response) variable in a classifier algorithm
* if the number of distinct values exceeds this limit, the field will be dropped
  (with a warning)

max_distinct_cat_values_for_scoring = <int>
* defaults to 100
* determines the upper limit for the number of distinct values in a categorical field that is
the target (or response) variable in a scoring method
* if the number of distinct values exceeds this limit, the field will be dropped
  (with an appropriate warning or error message)

max_fit_time = <int>
* defaults to 600
* The maximum time, in seconds, to spend in the "fit" phase of an
  algorithm.
* This setting does not relate to the other phases of a search (e.g.
  retrieving events from an index).

max_inputs = <int>
* defaults to 100000
* The maximum number of events an algorithm considers when fitting a
  model.
* If this limit is exceeded and use_sampling is true, the fit command
  downsamples its input using the Reservoir Sampling algorithm before
  fitting a model.
* If use_sampling is false and this limit is exceeded, the fit command
  throws an error.

max_memory_usage_mb = <int>
* defaults to 4000
* The maximum allowed memory usage, in megabytes, by the fit command
  while fitting a model.

max_model_size_mb = <int>
* defaults to 30
* maximum allowed size of a model, in megabytes, created by the fit
  command.
* Some algorithms (e.g. SVM and RandomForest) might create unusually
  large models, which can lead to performance problems with bundle
  replication.

max_score_time = <int>
* defaults to 600
* The maximum time, in seconds, to spend in the "score" phase of an
  algorithm.
* This setting does not relate to the other phases of a search (e.g.
  retrieving events from an index).

use_sampling = true|false
* defaults to true
* Indicates whether to use Reservoir Sampling for data sets that exceed
  max_inputs or to instead throw an error.


# Algorithm-specific configuration
# Note: Not all global settings can be overwritten in algorithm-specific
# section
[ARIMA]
use_sampling = true|false
* defaults to false

[Birch]
max_inputs = <int>
* defaults to 2000
* Works well at 20000, but models are quite large.

[DecisionTreeClassifier]
summary_depth_limit = <int>
* defaults to 5

summary_return_json = true|false
* defaults to false

[DecisionTreeRegressor]
summary_depth_limit = <int>
* defaults to 5

summary_return_json = true|false
* defaults to false

[DensityFunction]
default_prob_threshold = <float>
* defaults to 0.01
* The default value for the area under the fitted probability density function curve, that is assigned as anomalous area.
"0.01" refers to that: "1%" of the area under the fitted density function curve will be assigned as outliers.
"default_prob_threshold" must have a value between 0.000000001 and 1.

max_fields_in_by_clause = <int>
* defaults to 5
* The maximum number of fields that can be provided in the "by" clause.

max_groups = <int>
* defaults to 1024
* The maximum number of groups created with the "by" clause.
"max_groups" prevents the model file from growing too large.
The bigger that cap the larger the size of your model file is going to be
and it will take longer to load at "apply" time.
Decreasing "max_kde_parameter_size" will allow increasing "max_groups"
and keeping model size small as a trade-off of accuracy for more groups.

max_kde_parameter_size = <int>
* defaults to 10000
* The maximum number of data points as the parameter size for Gaussian KDE density function.
Decreasing "max_kde_parameter_size" will allow increasing "max_groups"
and keeping model size small as a trade-off of accuracy for more groups.

max_threshold_num = <int>
* defaults to 5
* The maximum number of thresholds that can be provided at the same time.

min_data_size_to_fit = <int>
* defaults to 50
* The minimum number of data points required to fit a density function.
Warning about the inaccuracy of the density function if there are less than
"min_data_size_to_fit" data points in the training dataset.

[GradientBoostingClassifier]
max_model_size_mb = <int>
* defaults to 30

[KernelPCA]
max_inputs = <int>
* defaults to 5000

[KernelRidge]
max_inputs = <int>
* defaults to 5000

[MLPClassifier]
max_fit_time = <int>
* defaults to 1800

[NPR]
npr_max_matrix_size = <int>
* defaults to 10000000
* The maximum allowed size of the NPR matrix, in terms of number of matrix cells (rows times columns).
The size of the NPR matrix equals the number of unique values of the feature variable times the number
of unique values of the target variable. For example if |X| = 1000 and |Y|=100 then NPR matrix size is 100,000.
Increasing the value of npr_max_matrix_size results in longer fit/apply times and larger model files.


[OneClassSVM]
max_inputs = <int>
* defaults to 10000

# This algorithm is especially slow.
[SpectralClustering]
max_fit_time = <int>
* defaults to 1800

max_inputs = <int>
* defaults to 2000

[StateSpaceForecast]
max_inputs = <int>
* defaults to 50000

[SVM]
max_inputs = <int>
* defaults to 10000
* Works well at 20000, but models are quite large.

[TFIDF]
max_inputs = <int>
* defaults to 200000

# Score-command-specific configuration
[score:classification]
* defaults to algorithm defaults

[score:clustering]
* defaults to algorithm defaults

[score:pairwise]
max_fields = <int>
* default to 50

[score:regression]
* defaults to algorithm defaults

[score:statsfunctions]
* defaults to algorithm defaults

[score:statstest]
* defaults to algorithm defaults