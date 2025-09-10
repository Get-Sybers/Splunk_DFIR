# splunk_output.py — CLI arguments helper for the Splunk HEC output module.

from plaso.cli.helpers import interface as helpers_interface
from plaso.cli.helpers import manager as helpers_manager

class SplunkOutputArgumentsHelper(helpers_interface.ArgumentsHelper):
    """Adds and parses CLI arguments for the 'splunk' output module."""
    NAME = 'splunk'          # must match your output module NAME
    CATEGORY = 'output'      # psort looks up helpers by this category
    DESCRIPTION = 'Arguments for Splunk HEC output module.'

    @classmethod
    def AddArguments(cls, argument_group):
        argument_group.add_argument('--server', dest='splunk_server',
                                    help='Splunk HEC server (host or IP).')
        argument_group.add_argument('--port', dest='splunk_port', type=int, default=8088,
                                    help='Splunk HEC port (default 8088).')
        argument_group.add_argument('--token', dest='splunk_token',
                                    help='Splunk HEC token.')
        argument_group.add_argument('--index', dest='splunk_index',
                                    help='Splunk index.')
        argument_group.add_argument('--sourcetype', dest='splunk_sourcetype', default='l2t:hec',
                                    help='HEC sourcetype (default l2t:hec).')
        argument_group.add_argument('--source', dest='splunk_source', default='log2timeline',
                                    help='HEC source (default log2timeline).')
        argument_group.add_argument('--host', dest='splunk_host',
                                    help='HEC host field.')
        argument_group.add_argument('--endpoint', dest='splunk_endpoint', default='/services/collector/event',
                                    help='HEC endpoint path (default /services/collector/event).')
        argument_group.add_argument('--batch-size', dest='splunk_batch', type=int, default=500,
                                    help='Batch size before flushing to HEC (default 500).')
        argument_group.add_argument('--insecure', dest='splunk_insecure', action='store_true',
                                    help='Disable TLS verification (HTTPS).')
        argument_group.add_argument('--custom-fields', dest='splunk_custom_fields', default='',
                                    help='Extra HEC "fields" as key=value[,key=value].')

    @classmethod
    def ParseOptions(cls, options, output_module):
        """Let the output module consume the parsed args."""
        # Your output module already has SetOutputOptions(options)
        output_module.SetOutputOptions(options)

# Register helper so psort can find it.
helpers_manager.ArgumentHelperManager.RegisterHelper(SplunkOutputArgumentsHelper)