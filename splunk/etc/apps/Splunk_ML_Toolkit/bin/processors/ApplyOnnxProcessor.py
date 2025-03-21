#!/usr/bin/env python
# Copyright (C) 2015-2019 Splunk Inc. All Rights Reserved.
import gc

import pandas as pd
import numpy as np

import cexc
import models.base

from .BaseProcessor import BaseProcessor
from util import search_util
from util.searchinfo_util import is_parsetmp
from util.df_util import merge_predictions
from util.constants import ONNX_MODEL_EXTENSION
import util.onnx_util as onnx_util
from util.telemetry_onnx_util import (
    log_onnx_model_input_shape,
    log_onnx_app_algo_details,
)

logger = cexc.get_logger(__name__)
messages = cexc.get_messages_logger()


class ApplyOnnxProcessor(BaseProcessor):
    """The apply processor receives and returns pandas DataFrames."""

    def __init__(self, process_options, searchinfo):
        """Initialize options for the processor.

        Args:
            process_options (dict): process options
            searchinfo (dict): information required for search
        """
        self.upload = self._is_upload(process_options)
        self.searchinfo = searchinfo
        self.session = None
        self.algo = None
        # There is no option for upload through spl currently, therefore this if condition will never be triggered.
        if self.upload:
            # if ran in upload phase, setup model with validation and verification steps
            # else, check model entry in lookup table and return results.
            (
                self.algo_name,
                self.process_options,
                self.namespace,
            ) = ApplyOnnxProcessor.setup_model(process_options, self.searchinfo)
        else:
            # if not an upload stage, populate entries from lookup table for the model provided.
            (
                self.algo_name,
                self.process_options,
                self.namespace,
            ) = self.get_model_attributes(process_options, self.searchinfo)
        log_onnx_app_algo_details(
            self.searchinfo.get("app"), self.algo_name, self.process_options
        )

        self.resource_limits = ApplyOnnxProcessor.load_resource_limits(
            self.algo_name, self.process_options
        )

    def _is_upload(self, process_options):
        params = process_options.get("params", None)
        if params:
            upload = params.get('upload')
            if upload:
                return True
        return False

    @classmethod
    def get_model_attributes(cls, process_options, searchinfo):
        """
        Populate process_options with required fields: features, target, model_names, limits, model_folder_location,
        :param process_options:
        :param searchinfo:
        :return:
        """
        searchinfo = search_util.add_distributed_search_info(process_options, searchinfo)
        namespace = process_options.pop('namespace', None)

        # Fetch model name from process options parameter
        model_name = process_options["model_name"]
        if model_name.endswith(ONNX_MODEL_EXTENSION):
            model_name = model_name.split('.')[0]
        algo_name, model_data, model_options = models.base.get_model_options_from_disk(
            model_name, searchinfo, namespace
        )

        # Updating process_options with the metadata information from model file.
        model_options.update(process_options)
        process_options = model_options

        if onnx_util.check_model_for_size_limitation(model_data, process_options):
            return algo_name, process_options, namespace

    def get_relevant_fields(self):
        """For onnx models,
        2. Within model_location, access feature and target variables from metadata info.
        4. check sample.csv (if exists) to verify whether these feature/target variables exists
        5. If it does, update self.process_options with these params, else raise feature not found error.
        7. Return the feature variables as relevant fields.

        Returns:
            relevant_fields (list): relevant fields
        """

        relevant_fields = self.process_options['feature_variables'] + self.process_options.get(
            'split_by', []
        )

        # TODO MLA-1589: require explicit _* usage
        if '*' in relevant_fields:
            relevant_fields.append('_*')

        if '_time' not in relevant_fields:
            relevant_fields.append('_time')
        if 'target_variable' in self.process_options:
            # TODO : Modify for multi target support
            x = self.process_options['target_variable']
            if x not in relevant_fields:
                relevant_fields.append(x)
        return relevant_fields

    @classmethod
    def setup_model(cls, process_options, searchinfo):
        """
        Load temp model, try to load real model, validate user capabilities for model upload.
        Parse feature variables and mlspl_limits
        Remove the tmp_dir in the process.

        Args:
            process_options (dict): process_options
            searchinfo (dict): information required for search
        Returns:
            algo_name (str): algorithm name
            algo (object): algorithm object
            process_options (dict): updated process options
            namespace (str): namespace of the model
        """

        searchinfo = search_util.add_distributed_search_info(process_options, searchinfo)

        namespace = process_options.pop('namespace', None)

        mlspl_conf = process_options.pop('mlspl_conf')

        assert onnx_util.validate_user_capabilities_for_upload(searchinfo)
        # For MLA-1989 we cannot properly load a model in parsetmp search
        if is_parsetmp(searchinfo):
            process_options['mlspl_limits'] = {}
            process_options['feature_variables'] = ['*']
            return None, None, process_options, None

        algo_name = ONNX_MODEL_EXTENSION[1:]
        process_options['mlspl_limits'] = mlspl_conf.get_stanza(algo_name)

        # Once validated and verified, create lookup table entry
        reply = onnx_util.create_onnx_model_lookup_entry(
            process_options['model_name'],
            algo_name=algo_name,
            options=process_options,
            max_size=None,
            tmp=False,
            searchinfo=searchinfo,
            namespace=namespace,
            local=False,
        )

        return algo_name, process_options, namespace

    @staticmethod
    def load_resource_limits(algo_name, process_options):
        """Load algorithm-specific limits.

        Args:
            algo_name (str): algorithm name
            process_options (dict): the mlspl limits from the conf files

        Returns:
            resource_limits (dict): dictionary of resource limits
        """
        resource_limits = {}
        limits = process_options['mlspl_limits']
        resource_limits['max_memory_usage_mb'] = int(limits.get('max_memory_usage_mb', -1))
        resource_limits['streaming_apply'] = False
        resource_limits['max_model_size_mb'] = int(limits.get('max_model_size_mb', -1))
        return resource_limits

    @staticmethod
    def get_input_fields(df, input_cols):
        # types of inputs:
        len_input_cols = len(input_cols)
        if len_input_cols > 1:
            # 1) where input_cols > 1
            # multiple input sources, each source can represent 1 column
            inputs = {c: df[c].values for c in df.columns}
            df_shape = df.shape
            log_onnx_model_input_shape(
                "Multiple columns single-dim input", str(len_input_cols), str(df_shape)
            )
            if len_input_cols != len(df.columns):
                raise RuntimeError(
                    f"Expected number of inputs in the dataset is {len_input_cols} but found {len(df.columns)}"
                )
            for items in input_cols:
                field_name = items.name
                # we need to minus one, because the first dimension is reserved for something else,
                # and is usually None for ONNX
                input_cols_shape_size = items.shape[1]
                if field_name not in df.columns:
                    raise RuntimeError(
                        f"Required field {field_name} of type {items.type} does not exist"
                    )
                else:
                    df_field_type = str(df[field_name].dtypes)
                    expected_field_type = items.type
                    print(
                        f"df_field_type: {df_field_type} expected_field_type: {expected_field_type}"
                    )
                    if df_field_type == "int64" or expected_field_type == "tensor(int64)":
                        inputs[field_name] = inputs[field_name].astype(np.int64)
                    elif df_field_type == "float32" or expected_field_type == "tensor(float)":
                        inputs[field_name] = inputs[field_name].astype(np.float32)
                    elif df_field_type == "float64" or expected_field_type == "tensor(float)":
                        inputs[field_name] = inputs[field_name].astype(np.float64)
                    elif df_field_type == "double" or expected_field_type == "tensor(double)":
                        inputs[field_name] = inputs[field_name].astype(np.float64)
                    else:
                        raise RuntimeError(
                            f"Only Integer and Float feature variables are "
                            f"supported. Found unknown values in {field_name} variable"
                        )
        elif len_input_cols == 1:
            # 2) input_cols == 1
            # maybe just one input source,
            # but it can be multi-dimension
            input_cols_shape = input_cols[0].shape
            df_shape = df.shape
            input_cols_shape_size = len(input_cols_shape)
            log_onnx_model_input_shape(
                "Single column multi-dim input", str(input_cols_shape), str(df_shape)
            )
            if input_cols_shape_size <= 3:
                # Scenarios with single input , 2d tensors. Ex. [None, 4]
                # it's not possible to have a 3D df straight from splunk's search result
                # FIXME: casting everything to float32 is not safe, nor precise
                if input_cols_shape[1] != df_shape[1]:
                    raise RuntimeError(
                        f"Data has shape of {df_shape}, but ONNX model requires shape {input_cols_shape}"
                    )
                if type(df) == pd.DataFrame:
                    inputs = {input_cols[0].name: df.to_numpy().astype(np.float32)}
                elif type(df) == np.array or type(df) == np.ndarray:
                    inputs = {input_cols[0].name: df.astype(np.float32)}
                return inputs
            elif input_cols_shape_size > df.shape[1] and input_cols_shape_size > 3:
                # we have a 2d df, but we need a 3d tensor
                for column in df:
                    if str(df[column].dtypes) != "str":
                        # non string value, we can not pretend that we can split the value into an array
                        raise RuntimeError(
                            f"data has shape of {df_shape}, but ONNX model requires shape {input_cols[0].shape}"
                        )
                    # Splunk multi-value fields have the values separated by new line
                    df = df[column].str.split("\n")
                if type(df) == pd.DataFrame:
                    inputs = {input_cols[0].name: df.to_numpy().astype(np.float32)}
                elif type(df) == np.array or type(df) == np.ndarray:
                    inputs = {input_cols[0].name: df.astype(np.float32)}
                return inputs
            else:
                raise RuntimeError(
                    f"data has shape of {df.shape}, but ONNX model requires shape {input_cols_shape}"
                )
        else:
            # not input, error case
            raise RuntimeError("ONNX model does not have input")
        # Reshaping inputs
        for k in inputs:
            inputs[k] = inputs[k].reshape((inputs[k].shape[0], 1))
        return inputs

    @staticmethod
    def find_fields_to_drop(df, process_options):
        to_drop = [process_options.get("target_variable")]
        # TODO: ONNX- replace with preprocessing column functions
        for cols in df.columns:
            if cols.startswith('_'):
                to_drop.append(cols)
        return to_drop

    @staticmethod
    def fetch_output_col(process_options, target_var):
        """
        Function to fetch the output variable name when 'as' keyword is specified in the SPL
        """
        # FIXME: Make sure to update this logic when adding multi-target support for apply command.
        output_var = process_options.get("output_name")
        if output_var:
            return [f"{output_var}"]
        else:
            return [f"predicted({target_var})"]

    @staticmethod
    def apply(df, algo, process_options, session_obj=None):
        """Perform the literal predict from the estimator.

        Args:
            df (dataframe): input data
            algo (object): initialized algo object
            process_options (dict): process options
            session_obj (object) : specific session obj for onnx models

        Returns:
            prediction_df (dataframe): output dataframe
        """
        try:
            assert onnx_util.validate_feature_and_target_variables(df.head(), process_options)
            # TODO - ONNX can store the results for validation "df['output_column']", like scoring options.
            to_drop = ApplyOnnxProcessor.find_fields_to_drop(df, process_options)
            df_new = df.drop(to_drop, axis=1, inplace=False)

            input_names = session_obj.get_inputs()
            label_name = session_obj.get_outputs()[0].name if session_obj else None
            inputs = ApplyOnnxProcessor.get_input_fields(df_new, input_names)
            try:
                prediction = session_obj.run(output_names=[label_name], input_feed=inputs)
                prediction_df = pd.Series(prediction)
                target_var = process_options.get('target_variable')
                output = merge_predictions(
                    df,
                    pd.DataFrame(
                        prediction_df[0],
                        columns=ApplyOnnxProcessor.fetch_output_col(
                            process_options, target_var
                        ),
                    ),
                )
            except Exception as e:
                raise RuntimeError(f"Error found during model inferencing : {e}")

            gc.collect()
        except Exception as e:
            cexc.log_traceback()
            cexc.messages.warn(
                'Error while applying model "%s": %s' % (process_options['model_name'], str(e))
            )
            raise RuntimeError(e)
        return output

    def process(self):
        if self.upload:
            # if uploading, then return empty dataframe with appropriate warning/error
            self.df = pd.json_normalize(self.process_options)
        else:
            # Else, return apply results if model lookup entry is found, else error
            """If algo isn't loaded, load the model. Create the output dataframe."""
            if self.algo is None:
                self.session = models.base.load_onnx_model(
                    model_name=self.process_options['model_name'],
                    searchinfo=self.searchinfo,
                    namespace=self.namespace,
                )
            if len(self.df) > 0:
                self.df = self.apply(
                    self.df, self.algo, self.process_options, session_obj=self.session
                )
            if self.df is None:
                messages.warn('Apply method did not return any results.')
                self.df = pd.DataFrame()
