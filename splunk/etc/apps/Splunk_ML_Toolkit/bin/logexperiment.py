#!/usr/bin/env python
# Copyright (C) 2015-2019 Splunk Inc. All Rights Reserved.
from exec_anaconda import exec_anaconda_or_die

exec_anaconda_or_die()

import json
import re
import sys
import cexc
from cexc import BaseChunkHandler, CommandType

from util.rest_proxy import rest_proxy_from_searchinfo
from util import command_util
from util.searchinfo_util import searchinfo_from_cexc
from util.param_util import parse_args
from util.rest_url_util import make_splunk_url
from util.experiment_util import get_experiment_by_id, get_history_fields_from_experiment
from experiment.evaluation_metrics import compute_statistics, get_statistics_metadata

logger = cexc.get_logger('logexperiment')
messages = cexc.get_messages_logger()


class LogExperimentCommand(BaseChunkHandler):
    """LogExperimentCommand logs the results of an experiment."""

    def __init__(
        self,
        handler_data=None,
        in_file=sys.stdin.buffer,
        out_file=sys.stdout.buffer,
        err_file=sys.stderr,
    ):
        super(LogExperimentCommand, self).__init__(handler_data, in_file, out_file, err_file)
        self.exp_id = None
        self.app = None
        self.searchinfo = None
        self.experiment = None
        self.exp_metadata_list = []

    @staticmethod
    def handle_arguments(getinfo):
        """Take the getinfo metadata and return controller_options.

        Args:
            getinfo (dict): getinfo metadata

        Returns:
            controller_options (dict): options to be sent to controller
        """
        options = parse_args(getinfo['searchinfo']['args'])

        if options.get('params') is None or options['params'].get('id') is None:
            raise RuntimeError('Experiment ID must be specified, e.g: logexperiment id=... ')

        return options

    def setup(self):
        """Parse search string and choose processor.

        Returns:
            (dict): get info response (command type) and required fields. This
                response will be sent back to the CEXC process on the getinfo
                exchange (first chunk) to establish our execution type and
                required fields.
        """
        options = self.handle_arguments(self.getinfo)
        self.exp_id = options['params']['id']

        # The 'app' argument value is needed to correctly locate the experiment
        # as it may be a different app than the current app context this is invoked from.
        # By default, it's the current app the command is executed from, but override it
        # if the user specified a value for the app arg.
        app = options['params'].get("app")
        if app:
            self.searchinfo["app"] = app

        return {'type': CommandType.REPORTING}

    @staticmethod
    def _from_schedule(sid):
        # Assume no realtime data (realtime searches start with 'rt_scheduler__').
        return re.match(r'scheduler__', sid) is not None

    def handler(self, metadata, body):
        """Main handler we override from BaseChunkHandler.

        Handles the reading and writing of data to the CEXC process, and
        finishes negotiation of the termination of the process.

        Args:
            metadata (dict): metadata information
            body (str): data payload from CEXC

        Returns:
            (dict): metadata to be sent back to CEXC
            output_body (str): data payload to be sent back to CEXC
        """
        if command_util.should_early_return(metadata):
            return {'type': CommandType.REPORTING}

        if command_util.is_getinfo_chunk(metadata):
            self.searchinfo = searchinfo_from_cexc(metadata['searchinfo'], extra_fields=['sid'])
            return self.setup()

        # Save info we need to calculate stats when we process the final chunk.
        if self.experiment is None:
            rest_proxy = rest_proxy_from_searchinfo(self.searchinfo)
            self.experiment = get_experiment_by_id(rest_proxy, self.exp_id)

        self.exp_metadata_list.append(get_statistics_metadata(self.experiment, body))

        finished_flag = metadata.get('finished', False)
        if finished_flag:
            rest_proxy = rest_proxy_from_searchinfo(self.searchinfo)
            experiment = get_experiment_by_id(rest_proxy, self.exp_id)
            experiment_history = get_history_fields_from_experiment(experiment)
            sid = self.searchinfo['sid']
            json_body = {'sid': sid, 'from_schedule': self._from_schedule(sid)}
            # Update json_body with experiment history
            json_body.update(experiment_history)

            # Update the json body with statistics. If statistics can't be computed, update with empty dictionary.
            statistics_dict = compute_statistics(self.exp_metadata_list)
            json_body.update(statistics_dict)

            # Send json_body to the history store
            url = make_splunk_url(
                rest_proxy,
                'user',
                extra_url_parts=['mltk', 'experiments', self.exp_id, 'history'],
            )
            reply = rest_proxy.make_rest_call('POST', url, jsonargs=json.dumps(json_body))
            if not reply['success']:
                content = reply['content']
                logger.warn(content)
                raise RuntimeError(json.loads(content)['messages'][0]['text'])

        # Our final farewell
        return {'finished': finished_flag}, body


if __name__ == "__main__":
    logger.debug("Starting logexperiment.py.")
    LogExperimentCommand(handler_data=BaseChunkHandler.DATA_RAW).run()
    logger.debug("Exiting gracefully. Byee!!")
