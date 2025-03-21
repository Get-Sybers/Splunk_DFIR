#!/usr/bin/env python
import watchdog
from cexc import BaseChunkHandler, CommandType, get_logger
from chunked_controller import ChunkedController

logger = get_logger(__name__)


def get_watchdog(time_limit=-1, memory_limit=-1, finalize_file=None):
    """Setup up 'watchdog' process to monitor resources.

    Returns:
        watchdog_instance (object): watchdog instance
    """
    watchdog_instance = watchdog.Watchdog(
        time_limit=time_limit,
        memory_limit=memory_limit * 1024 * 1024,
        finalize_file=finalize_file,
    )
    return watchdog_instance


def is_getinfo_chunk(metadata):
    """Simply return true if the metadata action is 'getinfo'.

    Args:
        metadata (dict): metadata information from CEXC
    Returns:
        (bool)
    """
    return metadata['action'] == 'getinfo'


def should_early_return(metadata):
    """
    If this is a 'getinfo' chunk and we have indications
    that it will not lead to an 'execute' chunk we optimize
    by an early-return from this getinfo().
    See MLA-2347 for details.

    Args:
        metadata (dict): metadata information from CEXC
    Returns:
        (bool)
    """
    if is_getinfo_chunk(metadata):
        info = metadata.get('searchinfo')
        if not info:
            return False
        sid = info.get('sid')
        if sid in ['', None, 'tmp'] or sid.startswith('searchparsetmp') or sid.endswith('_tmp'):
            logger.debug('Returning early from getinfo invocation. sid: {}'.format(sid))
            return True
    return False


class GeneratingCommand(BaseChunkHandler):
    """Mixin for commands that need a setup in order to avoid code duplication

    handle_arguments needs to be overridden by the subclasses.
    """

    @staticmethod
    def handle_arguments(getinfo):  # abstract method
        return None

    def setup(self):
        """Get options, start controller, return command type.

        Returns:
            (dict): get info response (command type)
        """
        self.controller_options = self.handle_arguments(self.getinfo)  # pylint: disable=W1111
        self.controller = ChunkedController(self.getinfo, self.controller_options)
        return {'type': CommandType.REPORTING, 'generating': True}
