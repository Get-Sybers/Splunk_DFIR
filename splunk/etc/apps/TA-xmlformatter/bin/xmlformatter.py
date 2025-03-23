from splunklib.searchcommands import dispatch, StreamingCommand, Configuration, Option, validators
import sys
import lxml.etree as etree

@Configuration()
class XMLFormatCommand(StreamingCommand):
    infield = Option(
        doc="The field you would like to format",
        require=False, default='_raw')

    outfield = Option(
        doc="The field the formatted version gets outputted",
        require=False, default='_raw')

    def stream(self, records):
        for record in records:
            try:
                record[self.outfield] = etree.tostring(
                    etree.fromstring(record[self.infield]),
                    pretty_print=True, encoding="unicode"
                )
            except Exception as e:
                pass

            yield record


dispatch(XMLFormatCommand, sys.argv, sys.stdin, sys.stdout, __name__)