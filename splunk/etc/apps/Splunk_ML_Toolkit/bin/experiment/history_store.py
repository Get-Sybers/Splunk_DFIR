import http.client
import json
import logging
import time
from copy import deepcopy

import cexc
from .experiment_validation import validate_experiment_history_json
from rest.proxy import SplunkKVStoreProxy, SplunkRestProxyException
from util.searchinfo_util import searchinfo_from_request

logger = cexc.get_logger(__name__)


class ExperimentHistoryStore(SplunkKVStoreProxy):
    """
    API for experiment history's KVstore storage
    """

    EXPERIMENT_HISTORY_COLLECTION_NAME = 'experiment_history'

    _with_admin_token = False
    _with_raw_result = False

    def __init__(self, with_admin_token):
        self._with_admin_token = with_admin_token

    @property
    def with_admin_token(self):
        return self._with_admin_token

    @property
    def with_raw_result(self):
        return self._with_raw_result

    def _get_kv_store_collection_name(self):
        """
        - Mandatory overridden
        - see SplunkKVStoreProxy._get_kv_store_collection_name()
        """
        return self.EXPERIMENT_HISTORY_COLLECTION_NAME

    def _transform_request_options(self, rest_options, url_parts, request):
        """
        - Overridden from SplunkRestEndpointProxy
        - Handling experiment specific modification/handling of the request before
        sending the request to kvstore
        - See RestProxy.make_rest_call() for a list of available items for `rest_options`

        Args:
            rest_options (dict): default rest_options constructed by the request method (get, post, delete)
            url_parts (list): a list of url parts without /mltk/experiments
            request (dict): the original request from the rest call to /mltk/experiments/*

        Raises:
            SplunkRestProxyException: some error occurred during this process

        Returns:
            options (tuple) : a two element tuple.  the first element is a dictionary that stores parameters needed by
            RestProxy.make_rest_call(), and the second element stores parameters for _handle_reply, if any.
        """

        if len(url_parts) > 0:
            experiment_id = url_parts[0]
        else:
            raise SplunkRestProxyException(
                'No experiment id specified', logging.ERROR, http.client.BAD_REQUEST
            )

        if rest_options['method'] == 'GET' or rest_options['method'] == 'DELETE':
            rest_options['getargs'] = dict(
                rest_options.get('getargs', [])
                + [("query", json.dumps({'experimentId': experiment_id}))]
            )

        if rest_options['method'] == 'POST':
            experiment_history = self._get_experiment_history_from_request(request)
            experiment_history["experimentId"] = experiment_id
            try:
                validate_experiment_history_json(experiment_history)

                # these are intentionally added after validation, since we don't want to allow the user to submit them
                experiment_history = self._add_internal_fields(experiment_history, request)
            except Exception as e:
                logger.error(str(e))
                raise SplunkRestProxyException(
                    'Cannot validate experiment history', logging.ERROR, http.client.BAD_REQUEST
                )
            rest_options['jsonargs'] = json.dumps(experiment_history)

        return rest_options, {}

    @staticmethod
    def _get_payload_from_request(request):
        return json.loads(request.get('payload', '{}'))

    @classmethod
    def _get_experiment_history_from_request(cls, request):
        payload = cls._get_payload_from_request(request)
        experiment_history = {}
        for k, v in payload.items():
            # Splunk adds some additional fields
            if not k.startswith('eai:'):
                experiment_history[k] = v

        # Apply defaults.
        defaults = {'from_schedule': False}
        for k, v in defaults.items():
            if experiment_history.get(k) is None:
                experiment_history[k] = v

        return experiment_history

    @staticmethod
    def _add_internal_fields(experiment_history, request):
        searchinfo = searchinfo_from_request(request)
        exp_hist = deepcopy(experiment_history)
        exp_hist["_time"] = time.time()
        exp_hist["user"] = searchinfo["username"]
        exp_hist["app"] = searchinfo["app"]
        return exp_hist

    def _handle_reply(self, reply, reply_options, request, url_parts, method):
        """
        - Overridden from SplunkRestEndpointProxy

        Args:
            reply (dict): the reply we got from kvstore
            reply_options (dict): the reply options from '_transform_request_options'
            request (dict): the request from rest endpoint
            url_parts (list): a list of url parts without /mltk/experiments
            method (string): original request's method

        Returns:
            reply: reply from input after the filtering
        """
        return {
            'status': reply.get('status', http.client.OK),
            'payload': reply.get('content', ''),
        }
