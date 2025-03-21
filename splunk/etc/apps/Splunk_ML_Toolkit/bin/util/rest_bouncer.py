#!/usr/bin/env python
# Simple script to bounce the lookup-update-notify REST endpoint.
# Needed to trigger model replication in SHC environments.
#
# This needs to launch a subprocess for the simple reason that the
# interpreter that ML-SPL runs under (Splunk_SA_Scientific_Python)
# doesn't have OpenSSL. We marshall the required Splunk auth token
# through stdin to avoid leaks via environment variables/command line
# arguments/etc.
import json
import os
import subprocess
import sys

# Destination python path
SPLUNK_PYTHON_PATH = os.path.join(os.environ['SPLUNK_HOME'], 'bin', 'python3')


def _need_to_bounce():
    return sys.executable != SPLUNK_PYTHON_PATH


def make_rest_call(
    session_key, method, url, postargs=None, jsonargs=None, getargs=None, rawResult=False
):
    """
    Make REST call using a new python interpreter if necessary.

    If the current python interpreter is not Splunk's default, launch an external process to run the REST query
    with the Splunk's default python interpreter (because we need the SSL package not available in the PSC python
    interpreter). If the current python interpreter is already Splunk's default, just run the REST query.

    Args:
        payload (dict): request payload. If None, it will be read from stdin.

    Returns:
        reply (dict): Splunk REST response or False on error.
    """
    import cexc

    logger = cexc.get_logger(__name__)

    payload = {
        'session_key': session_key,
        'url': url,
        'method': method,
        'postargs': postargs,
        'jsonargs': jsonargs,
        'getargs': getargs,
        'rawResult': rawResult,
    }

    try:
        if _need_to_bounce():
            p = subprocess.Popen(
                [SPLUNK_PYTHON_PATH, os.path.abspath(__file__)],
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
            )
            (stdoutdata, stderrdata) = p.communicate(json.dumps(payload).encode())
            p.wait()

            for errline in stderrdata.splitlines():
                logger.debug('> %s', errline)

            if p.returncode != 0:
                raise RuntimeError(
                    "rest_bouncer subprocess exited with non-zero error code '%d'"
                    % p.returncode
                )

            reply = json.loads(stdoutdata)
        else:
            # No need to bounce.  We already have the correct Python interpreter (Splunk's default).
            reply = _make_rest_call_internal(payload)

    except Exception as e:
        logger.warn('rest_bouncer failure: %s: %s', type(e).__name__, str(e))
        return False

    return reply


def _make_rest_call_internal(payload=None):
    """
    Make REST call via Splunk REST API

    This does the real meat of the work.

    Args:
        payload (dict): request payload. If None, it will be read from stdin.

    Returns:
        reply (dict): Splunk REST response
    """
    from splunk import rest, RESTException

    import http.client

    reply = {
        'success': False,
        'response': None,
        'content': None,
        'error_type': None,
        'status': None,
    }

    # Read JSON payload from stdin
    try:
        if payload is None:
            line = next(sys.stdin)
            payload = json.loads(line)

        session_key = payload['session_key']
        method = payload['method']
        url = payload['url']
        postargs = payload['postargs']
        jsonargs = payload['jsonargs']
        getargs = payload['getargs']
        rawResult = payload['rawResult']

        response, content = rest.simpleRequest(
            url,
            method=method,
            postargs=postargs,
            sessionKey=session_key,
            raiseAllErrors=False,
            jsonargs=jsonargs,
            getargs=getargs,
            rawResult=rawResult,
        )

        reply['response'] = response
        reply['content'] = content.decode('utf-8')
        status = response.status
        reply['status'] = status

        if status > 199 and status < 300:
            reply['success'] = True
    except RESTException as e:
        reply['error_type'] = type(e).__name__
        reply['content'] = '{"messages":[{"type": "ERROR", "text": "%s"}]}' % str(e)
        reply['status'] = e.statusCode
    except Exception as e:
        error_type = type(e).__name__
        reply['content'] = '{"messages":[{"type": "%s", "text": "%s"}]}' % (error_type, str(e))
        reply['error_type'] = error_type
        reply['status'] = http.client.INTERNAL_SERVER_ERROR
    return reply


def main():
    print((json.dumps(_make_rest_call_internal())))


if __name__ == "__main__":
    main()
