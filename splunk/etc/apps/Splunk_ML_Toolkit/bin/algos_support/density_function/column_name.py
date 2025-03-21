def make_column_name(main_name, new_name=None, threshold=None, feature_variable=None):
    """
    Generates and returns the column name for either IsOutlier or SampledValue columns.
    Considers if there is a threshold to be attached with a dash ("_") to the column name.
    Assigns the new_name to the IsOutlier column if provided by the user with as clause during the search.
    Examples: make_column_name(main_name="IsOutlier", new_name="UserPreferredOutputName") will return "UserPreferredOutputName"
              make_column_name(main_name="IsOutlier", threshold=0.01, feature_variable="measurement") will return "IsOutlier_th=0.01(measurement)"
              make_column_name(new_name="UserPreferredOutputName", threshold=0.01) will return "UserPreferredOutputName_th=0.01"
              make_column_name(main_name="SampledValue", threshold=0.01) will return "SampledValue_th=0.01"

    Args:
        main_name (str): The base name of the column (IsOutlier or SampledValue).
        new_name (str): The user preferred name for the IsOutlier column provided with the as clause.
        threshold (float): The specific threshold for that column that will be placed in the column name.
        feature_variable (str): The feature variable name on which the DensityFunction is fitted, needed in IsOutlier column name.

    Returns:
        column_name (str): Final column name formed according to the conditions.
    """
    OUTPUT_NAME = 'IsOutlier'

    if threshold:
        if new_name:
            column_name = '{}_th={}'.format(new_name, threshold)
        elif main_name:
            column_name = '{}_th={}'.format(main_name, threshold)
    else:
        column_name = new_name or main_name
    if main_name == OUTPUT_NAME and new_name is None and feature_variable is not None:
        column_name = '{}({})'.format(column_name, feature_variable)
    return column_name
