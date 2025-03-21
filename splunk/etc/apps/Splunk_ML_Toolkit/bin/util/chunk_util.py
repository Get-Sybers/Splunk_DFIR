#!/usr/bin/env python

import sys
import json
from io import StringIO
import re
import csv
import traceback

getinfo = {}


def read_chunk(in_file):
    """Attempts to read a single "chunk" from self.in_file.

    Returns
    -------
    None, if EOF during read.
    (metadata, data) : dict, str
        metadata is the parsed contents of the chunk JSON metadata
        payload, and data is contents of the chunk data payload.

    Raises on any exception.
    """
    header_re = re.compile(r'chunked\s+1.0,(?P<metadata_length>\d+),(?P<body_length>\d+)')

    header = in_file.readline().decode('utf-8')

    if len(header) == 0:
        return None

    m = header_re.match(header)
    if m is None:
        raise ValueError('Failed to parse transport header: %s' % header)

    metadata_length = int(m.group('metadata_length'))
    body_length = int(m.group('body_length'))

    metadata_buf = in_file.read(metadata_length)
    body = in_file.read(body_length).decode('utf-8')

    metadata = json.loads(metadata_buf)
    return (metadata, body)


def write_chunk(out_file, metadata, body=''):
    """Attempts to write a single "chunk" to the given file.

    metadata should be a Python dict with the contents of the metadata
    payload. It will be encoded as JSON.

    body should be a string of the body payload.

    no return, may throw an IOException
    """
    metadata_buf = None
    if metadata:
        metadata_buf = json.dumps(metadata).encode('utf-8')

    metadata_length = len(metadata_buf) if metadata_buf else 0
    # we need the length in the number of bytes
    body = body.encode('utf-8')

    out_file.write(('chunked 1.0,%d,%d\n' % (metadata_length, len(body))).encode('utf-8'))

    if metadata:
        out_file.write(metadata_buf)

    out_file.write(body)
    out_file.flush()


def add_message(metadata, level, msg):
    ins = metadata.setdefault('inspector', {})
    msgs = ins.setdefault('messages', [])
    k = '[' + str(len(msgs)) + '] '
    msgs.append([level, k + msg])


def die(metadata=None, msg="Error in external search commmand", print_stacktrace=True):
    if print_stacktrace:
        traceback.print_exc(file=sys.stderr)

    if metadata is None:
        metadata = {}

    metadata['finished'] = True
    metadata['error'] = msg
    sio = StringIO()
    writer = csv.writer(sio)
    writer.writerow(['ERROR'])
    writer.writerow([msg])
    write_chunk(sys.stdout.buffer, metadata, sio.getvalue())
    sys.exit(1)


def log_and_warn(metadata, msg, search_msg=None):
    search_msg = search_msg or msg
    sys.stderr.write('WARNING: ' + msg)
    add_message(metadata, 'WARN', search_msg)


def log_and_die(metadata, msg, search_msg=None):
    search_msg = search_msg or msg
    sys.stderr.write('ERROR: ' + msg)
    die(metadata, msg)
