#!/usr/bin/env python
"""Utility library for "chunked" custom search commands.

This library abstracts away some of the low-level details of writing
"chunked" custom search commands for Splunk (e.g. byte-level protocol
parsing). However, it still requires a fair bit of background on how
the chunked protocol works at a semantic level. For a detailed
description of the protocol, read:

    https://confluence.splunk.com/display/PROD/Chunked+External+Command+Protocol+v1.0

At a high-level, the Splunk search pipeline operates on "chunks" of
search results. Thus, when a "chunked" custom search command is in a
search pipeline, Splunk will send chunks to the external command (on
stdin) and expect chunks in reply (on stdout).

This library implements a BaseChunkHandler class that handles most of
the details of receiving and sending chunks. Developers are expected
to extend this class with their own handler() method to actually do
useful work on search results.

Example:

    from cexc import BaseChunkHandler

    class MyHandler(BaseChunkHandler):
        def handler(self, metadata, data):
            if metadata['action'] == 'getinfo':
                return { 'type': 'reporting' }

            for record in data:
                record['foo'] = 'Hello world!'

            return ({}, data)

    if __name__ == "__main__":
        MyHandler().run()
"""

import sys
import json

if sys.version_info >= (3, 0):
    from io import StringIO
    bodytype = str
else:
    from cStringIO import StringIO
    bodytype = basestring
import re
import csv
import traceback
import logging
import logging.handlers
from collections import OrderedDict
import time

def abort(msg):
    """Helper method to abort gracefully with a user-visible message.

    Do NOT use this method from within a running
    BaseChunkHandler. Instead, raise an Exception or RuntimeError.

    Invoke this function to gracefully exit a custom search command
    before a BaseChunkHandler object has been created and run. You may
    use this, for instance, if there is an exception during an import
    in your __main__ module.
    """
    AbortHandler.abort(msg)

class BaseChunkHandler(object):
    """Base class for custom search commands using the "chunked" protocol.

    This is a low-level implementation. You are strongly encouraged to
    use the Splunk Python SDK instead.

    To write an external search command, extend this class, override
    the handler() method, and invoke its run() method, e.g.:

        class Handler(BaseChunkHandler):
            def handler(self, metadata, data):
                ...
        if __name__ == "__main__":
            Handler().run()

    run() will read a chunk from stdin, call handler() with the
    metadata and data payloads, and write a chunk containing
    handler()'s return value. It will continue doing this in a loop
    until EOF is read.

    Parameters
    ----------
    handler_data : DATA_DICT | DATA_CSVROW | DATA_RAW
        Specifies how/whether data payload should be parsed.
        Defaults to DATA_DICT.

    in_file, out_file, err_file : file
        Files to use for input, output, and errors, respectively.
        Defaults to sys.stdin, sys.stdout, sys.stderr.

    Attributes
    ----------
    getinfo : dict, class attribute
        Metadata from the getinfo exchange. Set when
        action:getinfo is observed in _read_chunk().

    """

    (DATA_DICT, # parse data payload with csv.DictReader
     DATA_CSVROW, # parse data payload with csv.reader
     DATA_RAW # don't parse data payload
    ) = range(3)

    def __init__(self,
                 handler_data=None,
                 in_file=sys.stdin, out_file=sys.stdout,
                 err_file=sys.stderr):
        if handler_data:
            self.handler_data = handler_data
        else:
            self.handler_data = self.DATA_DICT
        self.in_file = in_file
        self.out_file = out_file
        self.err_file = err_file
        self.getinfo = {}

        # Unmangle line-endings in Windows.
        if sys.platform == "win32":
            import os, msvcrt
            msvcrt.setmode(self.in_file.fileno(), os.O_BINARY)
            msvcrt.setmode(self.out_file.fileno(), os.O_BINARY)
            msvcrt.setmode(self.err_file.fileno(), os.O_BINARY)

        # Logger instance for internal messages. Forwards to stderr.
        self.logger = logging.getLogger(__name__)
        self.logger.setLevel(logging.DEBUG)
        stream_handler = logging.StreamHandler()
        stream_handler.setFormatter(logging.Formatter('%(levelname)s %(message)s'))
        self.logger.addHandler(stream_handler)        

        # Logger instance for user-visible messages.
        self.messages = self.logger.getChild('messages')
        self.messages_handler = logging.handlers.BufferingHandler(100000)
        self.messages.addHandler(self.messages_handler)

        # Variables to track time spent in different chunk handling
        # states.
        self._read_time = 0.0
        self._handle_time = 0.0
        self._write_time = 0.0

    def run(self):
        """Handle chunks in a loop until EOF is read.

        If an exception is raised during chunk handling, a chunk
        indicating the error will be written and the process will exit.
        """
        try:
            while self._handle_chunk():
                pass
        except Exception as e:
            if isinstance(e, RuntimeError):
                error_message = str(e)
            else:
                error_message = '(%s) %s' % (
                    type(e).__name__, e
                )
            self.die(error_message)
            laskdjflakj # ;-)

    def handler(self, metadata=None, records=None):
        """Default chunk handler, returns empty metadata and data payloads."""
        return ({}, [])


    def die(self, message, log_traceback=True):
        """Logs a message, writes a user-visible error, and exits."""

        self.logger.error(message)
        if log_traceback:
            self.logger.error(traceback.format_exc())

        metadata = {'finished': True, 'error': message}

        # Insert inspector messages from messages logger.
        messages = self._pop_messages()
        # Convert non-DEBUG messages to ERROR so the user can see them...
        messages = [['ERROR', y] for x,y in messages if x != 'DEBUG']

        if len(messages) > 0:
            metadata.setdefault('inspector', {}).setdefault('messages', []).extend(messages)

        # Sort the keys in reverse order! 'inspector' must come before 'error'.
        metadata = OrderedDict([(k,metadata[k]) for k in sorted(metadata, reverse=True)])

        self._write_chunk(metadata, '')
        sys.exit(1)


    _header_re = re.compile(r'chunked\s+1.0,(?P<metadata_length>\d+),(?P<body_length>\d+)')
    def _read_chunk(self):
        """Attempts to read a single "chunk" from self.in_file.

        Returns
        -------
        None, if EOF during read.
        (metadata, data) : dict, str
            metadata is the parsed contents of the chunk JSON metadata
            payload, and data is contents of the chunk data payload.

        Raises on any exception.
        """
        header = self.in_file.readline()

        if len(header) == 0:
            return None

        m = self._header_re.match(header)
        if m is None:
            raise ValueError('Failed to parse transport header: %s' % header)

        metadata_length = int(m.group('metadata_length'))
        body_length = int(m.group('body_length'))

        metadata_buf = self.in_file.read(metadata_length)
        body = self.in_file.read(body_length)

        metadata = json.loads(metadata_buf)

        return (metadata, body)

    def _write_chunk(self, metadata=None, body=''):
        """Attempts to write a single "chunk" to self.out_file.

        Parameters
        ----------
        metadata : dict or None, metadata payload.
        body : str, body payload

        Returns None. Raises on exception.
        """
        self._internal_write_chunk(self.out_file, metadata, body)

    @staticmethod
    def _internal_write_chunk(out_file, metadata=None, body=''):
        metadata_buf = None
        if metadata:
            metadata_buf = json.dumps(metadata)

        metadata_length = len(metadata_buf) if metadata_buf else 0
        body_length = len(body)

        out_file.write('chunked 1.0,%d,%d\n' % (metadata_length, body_length))

        if metadata:
            out_file.write(metadata_buf)

        out_file.write(body)
        out_file.flush()


    def _handle_chunk(self):
        """Handle (read, process, write) a chunk."""
        with Timer() as t:
            ret = self._read_chunk()
            if not ret:
                return False # EOF

            metadata, body = ret

            if self.handler_data == self.DATA_DICT:
                body = list(csv.DictReader(StringIO(body)))
            elif self.handler_data == self.DATA_CSVROW:
                body = list(csv.reader(StringIO(body)))
            elif self.handler_data == self.DATA_RAW:
                pass

            # Cache a copy of the getinfo metadata.
            if metadata.get('action', None) == 'getinfo':
                self.getinfo = dict(metadata)

        self._read_time += t.interval

        with Timer() as t:
            # Invoke handler. Hopefully someone overloaded it!
            ret = self.handler(metadata, body)

            if isinstance(ret, dict):
                metadata, body = ret, None
            else:
                try:
                    metadata, body = ret
                except:
                    raise TypeError("Handler must return (metadata, body), got: %.128s" % repr(ret))

            # Insert inspector messages from messages logger.
            messages = self._pop_messages()
            if len(messages) > 0:
                metadata.setdefault('inspector', {}).setdefault('messages', []).extend(messages)

        self._handle_time += t.interval

        with Timer() as t:
            if body is not None and len(body) > 0:
                sio = StringIO()

                if self.handler_data == self.DATA_DICT:
                    assert hasattr(body, '__iter__')

                    keys = set()
                    for r in body:
                        keys.update(r.keys())

                    writer = csv.DictWriter(sio, fieldnames=list(keys))
                    writer.writeheader()

                    for r in body:
                        writer.writerow(r)
                    body = sio.getvalue()

                elif self.handler_data == self.DATA_CSVROW:
                    writer = csv.writer(sio)
                    for r in body:
                        writer.writerow(r)
                    body = sio.getvalue()
                elif self.handler_data == self.DATA_RAW:
                    pass

                assert isinstance(body, bodytype)

            else:
                body = ''

            self._write_chunk(metadata, body)

        self._write_time += t.interval

        return True


    def _pop_messages(self):
        """Drain logging.MemoryHandler holding user-visible messages."""
        messages = []
        for r in self.messages_handler.buffer:
            # Map message levels to Splunk equivalents.
            level = {'DEBUG': 'DEBUG', 'INFO': 'INFO', 'WARNING': 'WARN',
                     'ERROR': 'ERROR', 'CRITICAL': 'ERROR'}[r.levelname]
            messages.append([level, r.message])

        self.messages_handler.flush()
        return messages

class AbortHandler(BaseChunkHandler):
    """Helper class to abort gracefully with a user-visible message.

    Do not use this class directly. Instead, use cexc.abort(msg)."""
    def __init__(self, msg):
        self.msg = msg
        super(self.__class__, self).__init__()
    def handler(self, metadata, body):
        raise RuntimeError(self.msg)
    @classmethod
    def abort(cls, msg):
        cls(msg).run()
        sys.exit(1)

class Timer:
    def __enter__(self):
        self.start = time.process_time()
        return self

    def __exit__(self, *args):
        self.end = time.process_time()
        self.interval = self.end - self.start
