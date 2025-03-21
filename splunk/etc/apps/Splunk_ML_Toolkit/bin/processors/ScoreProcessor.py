#!/usr/bin/env python
# Copyright (C) 2015-2019 Splunk Inc. All Rights Reserved.

import pandas as pd

import cexc
from .BaseProcessor import BaseProcessor
from util.base_util import match_field_globs
from util.df_util import is_empty_df
from util.scorings import get_scoring_stanza
from util.processor_util import (
    split_options,
    load_resource_limits,
    load_sampler_limits,
    get_sampler,
    check_sampler,
)
from util.scorings import get_scoring_class_and_module
from util.mlspl_loader import MLSPLConf
from util.telemetry_util import log_scoring_details


logger = cexc.get_logger(__name__)
messages = cexc.get_messages_logger()


class ScoreProcessor(BaseProcessor):
    """The score processor receives and returns pandas DataFrames."""

    def __init__(self, process_options, searchinfo):
        """Initialize options for the processor.

        Args:
            process_options (dict): process options
            searchinfo (dict): information required for search
        """
        self.searchinfo = searchinfo
        mlspl_conf = MLSPLConf(searchinfo)
        scoring_stanza = get_scoring_stanza(process_options['scoring_name'], searchinfo)
        self.process_options, self.scoring_options = split_options(
            process_options, mlspl_conf, scoring_stanza
        )
        self.score_method, self.score_module_name = self.setup_score_method(
            self.scoring_options, self.searchinfo
        )

        self.resource_limits = load_resource_limits(scoring_stanza, mlspl_conf)
        self._sampler_time = 0.0
        self.sampler_limits = load_sampler_limits(
            self.process_options, scoring_stanza, mlspl_conf
        )
        self.sampler = get_sampler(self.sampler_limits)

    def setup_score_method(self, scoring_options, searchinfo):
        """Load scoring class and module name.

        Args:
            scoring_options (dict): scoring options
            searchinfo (dict): information required for search

        Returns:
            score_method (object): scoring class from sklearn
            scoring_module_name (str): scoring module name from scorings.conf
        """
        scoring_name = scoring_options['scoring_name']
        try:
            scoring_class, scoring_module_name = self.load_class_and_module_name(
                scoring_name, searchinfo
            )
            return scoring_class(scoring_options), scoring_module_name
        except Exception as e:
            cexc.log_traceback()
            err_msg = 'Error while initializing scoring method "{}": {}'
            raise RuntimeError(err_msg.format(scoring_name, str(e)))

    @staticmethod
    def load_class_and_module_name(scoring_name, searchinfo):
        """Load scoring class and module name

        Args:
            scoring_name (str): name of the scoring method
            searchinfo (dic): information required for search

        Returns:
            scoring_class (object): Scoring class from sklearn
            scoring_module_name (str): module from scorings.conf
        """
        scoring_class, scoring_module_name = get_scoring_class_and_module(
            scoring_name, searchinfo
        )
        return scoring_class, scoring_module_name

    def get_relevant_fields(self):
        """Return the needed variables.

        Returns:
            relevant_fields (list): relevant fields
        """
        relevant_fields = self.score_method.variables
        return relevant_fields

    def receive_input(self, df):
        """Receive dataframe and append to sampler if necessary.

        Args:
            df (dataframe): dataframe received from controller
        """
        if (
            self.sampler_limits['sample_count'] - len(df)
            < self.sampler.count
            <= self.sampler_limits['sample_count']
        ):
            check_sampler(
                sampler_limits=self.sampler_limits,
                class_name=self.scoring_options['scoring_name'],
            )

        with cexc.Timer() as sampler_t:
            self.sampler.append(df)
        self._sampler_time += sampler_t.interval

        logger.debug('sampler_time=%f', sampler_t.interval)

    @staticmethod
    def match_and_assign_variables(app_name, columns, score_method, scoring_options):
        """Match field globs and update scoring_options with new variables.

            - Only applies for scoring methods which has single array of fields
            - Does not apply for the ones with two arrays of fields (with against) and the ones with single field only.

        Args:
            app_name (str): application name which runs the score()
            columns (list): df column names
            score_method (object): the scoring method
            scoring_options (dict): options dictionary incuding a_variables and b_variables

        Returns:
            score_method (object): score_method with updated variables if glob (*) used
        """
        a_variables = scoring_options['a_variables']
        b_variables = scoring_options['b_variables']
        if a_variables and not b_variables:
            score_method.variables = match_field_globs(columns, a_variables)
            scoring_options['a_variables'] = score_method.variables
        log_scoring_details(app_name, score_method, scoring_options)
        return score_method

    @staticmethod
    def score(df, score_method, scoring_options):
        """Perform the literal predict from the estimator.

        Args:
            df (dataframe): input data
            score_method (object): initialized score_method object
            scoring_options (dict): scoring options

        Returns:
            score_df (dataframe): output dataframe
        """
        if not is_empty_df(df):
            try:
                score_df = score_method.score(df, scoring_options)
            except Exception as e:
                cexc.log_traceback()
                err_msg = 'Error while scoring "{}": {}'
                raise RuntimeError(err_msg.format(scoring_options['scoring_name'], str(e)))
            return score_df
        return df

    def process(self):
        """Simply call score method and return the result"""
        self.df = self.sampler.get_df()
        if not is_empty_df(self.df):
            assert 'mlspl_limits' in self.scoring_options
            # Support glob (*) for fields in single array score methods
            self.score_method = self.match_and_assign_variables(
                self.searchinfo.get('app'),
                list(self.df.columns),
                self.score_method,
                self.scoring_options,
            )
            self.df = self.score(self.df, self.score_method, self.scoring_options)
            if self.df is None:
                messages.warn('Score method did not return any results.')
                self.df = pd.DataFrame()
        else:
            messages.warning("The dataset has no events.")
