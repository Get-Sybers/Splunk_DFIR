#!/usr/bin/env python

import os
import sys
import time
import platform
from multiprocessing import Process

import psutil

import cexc
from util.constants import HOWTO_CONFIGURE_MLSPL_LIMITS
from util.chunk_util import write_chunk

MONITORING_INTERVAL = 1.0


class Watchdog(object):
    def __init__(
        self, time_limit=60, memory_limit=100 * 1024 * 1024, finalize_file=None, pid=None
    ):
        self.time_limit = time_limit
        self.memory_limit = memory_limit
        self.finalize_file = finalize_file
        self.started = False
        self._process = None
        self.start_time = None
        self._pid = pid or os.getpid()
        self._victim = None  # do not access directly. Use self._get_victim()
        self._init_victim()

    def _get_current_process(self):
        return psutil.Process(pid=self._pid)

    def _init_victim(self):
        # On Windows psutil.Process is not pickle-able (https://bugs.python.org/issue29168)
        # whereas this class needs to be pickleale. As such, on Windows
        # we do not instantiate an instance during class initializatoin but instead
        # create an instance each time we need one.
        if platform.system() in ('Windows', 'Darwin'):
            return
        self._victim = self._get_current_process()

    def _get_victim(self):
        return self._victim or self._get_current_process()

    def start(self):
        self._process = Process(target=self.main, name="ML-SPL Watchdog")
        self._process.daemon = True
        self._process.start()
        self.started = True

    def __del__(self):
        if hasattr(self, '_process') and isinstance(self._process, Process):
            self.join()

    def join(self):
        self._process.terminate()
        self._process.join(1)

    def main(self):
        logger = cexc.setup_logging.get_logger('mlspl_watchdog')

        self.start_time = time.time()

        while True:
            # Check to see if parent is still running...
            if not self._get_victim().is_running():
                logger.info(
                    'Watchdog exiting because parent %s disappeared.', self._get_victim()
                )
                return 0

            delta = time.time() - self.start_time
            # Check time_limit
            if self.time_limit >= 0 and delta > self.time_limit:
                logger.info(
                    'Terminate %s: exceeded time limit (%d > %d)',
                    self._get_victim(),
                    delta,
                    self.time_limit,
                )
                # Note: this chunk output may race with our parent...
                write_chunk(  # pylint: disable=W0212
                    sys.stdout.buffer,
                    {
                        'error': 'Time limit exceeded (> {} seconds). {}'.format(
                            self.time_limit, HOWTO_CONFIGURE_MLSPL_LIMITS
                        )
                    },
                )
                self._get_victim().terminate()
                return 1

            # Check memory limit
            rss = self._get_victim().memory_info().rss
            if self.memory_limit >= 0 and rss > self.memory_limit:
                logger.info(
                    'Terminating %s: exceeded memory limit (%d > %d)',
                    self._get_victim(),
                    rss,
                    self.memory_limit,
                )
                # Note: this chunk output may race with our parent...
                write_chunk(  # pylint: disable=W0212
                    sys.stdout.buffer,
                    {
                        'error': 'Memory limit exceeded (> {} bytes). {}'.format(
                            self.memory_limit, HOWTO_CONFIGURE_MLSPL_LIMITS
                        )
                    },
                )
                self._get_victim().terminate()
                return 2

            # Check if finalize file exists
            if self.finalize_file and os.path.exists(self.finalize_file):
                logger.info('Terminating %s: finalize file detected', self._get_victim())
                # Note: this chunk output may race with our parent...
                write_chunk(  # pylint: disable=W0212
                    sys.stdout.buffer,
                    {'error': 'Aborting because job finalization was requested.'},
                )
                self._get_victim().terminate()
                return 3

        logger.debug(
            'Monitoring %s: Running for %.1f secs, rss %d', self._get_victim(), delta, rss
        )
        time.sleep(MONITORING_INTERVAL)

        return 0
