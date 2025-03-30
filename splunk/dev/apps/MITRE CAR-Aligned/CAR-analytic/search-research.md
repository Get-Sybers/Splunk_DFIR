https://community.splunk.com/t5/Reporting/Parsing-YAML-file-with-Splunk/m-p/38196

    "Another option is to write your own search command. I'm not familiar with YAML, but I goggled it and quickly found a python parser [PyYAML](http://pyyaml.org/wiki/PyYAML) for it.

    I would suggest that you take a look at the search commands xmlkv and xpath that work with XML, and see if you could borrow the basic idea of those search commands and then write something similar for YAML using the PyYAML library.

    You can find many example search commands in the "search" app: $SPLUNK_HOME/etc/apps/search/bin/

    Specifically I think that xpath.py is a good example of a search command that loads a python module and then uses that module to extract some field based on the structured data stored within the splunk event, and then adds a new field back into your splunk event, which can be then used by subsequent search commands"

    "you may also find reviewing topics with the [custom-search-script](http://answers.splunk.com/questions/tagged/custom-search-script?_gl=1*11ui7hc*_gcl_au*NDc5ODIzMTQ1LjE3NDE3NzYzNjU.*FPAU*NDc5ODIzMTQ1LjE3NDE3NzYzNjU.*_ga*NDMxOTcyNDU1LjE3NDE3NzYzNjY.*_ga_5EPM2P39FV*MTc0MzMwMDY1NS42NS4xLjE3NDMzMDExODkuMC4wLjE3OTUyODk0MzY.*_fplc*V05jRGp6NG4wMlMlMkJkQnVSaFJxaXFpTFdlU0UlMkZrd250d0ZxOEsxQldBV0tIQ2xtcHNhJTJGREY3MWZvRyUyRkQyajFPZ1M0Z1Z1OVduY1NzTnc2YXRWaCUyRmtlVmc4bG1DeFBSTmY2Q3UzeThhdzN0Um5aTWIyajdadVpTWkQ3MmRtdyUzRCUzRA..) tag on this site to be helpful too."

# xpath.py
```python
    #   Version 4.0
import splunk.Intersplunk as si
import sys
if sys.version_info >= (3, 0):
    from io import StringIO
else:
    from StringIO import StringIO
import splunk.safe_lxml_etree as etree

def tostr(node):
    if isinstance(node, etree._Element):
        if len(node.getchildren()) == 0:
            return node.text or "Null"
        if sys.version_info >= (3, 0):
            return etree.tostring(node, encoding="unicode")
        else:
            return etree.tostring(node)
    return str(node)

if __name__ == '__main__':
    try:
        keywords,options = si.getKeywordsAndOptions()
        defaultval = options.get('default', None)
        field = options.get('field', '_raw')
        outfield = options.get('outfield', 'xpath')
        if len(keywords) != 1:
            si.generateErrorResults('Requires exactly one path argument.')
            exit(0)
        path = keywords[0]
        # Support for searching with absolute path
        if len(path) > 1 and path[0] == '/' and path[1] != '/':
            path = '/data' + path
        results,dummyresults,settings = si.getOrganizedResults()
        # for each results
        for result in results:
            # get field value
            myxml = result.get(field, None)
            added = False
            if myxml != None:
                # make event value valid xml
                myxml = "<data>%s</data>" % myxml
                try:
                    et = etree.parse(StringIO(myxml))
                    nodes = et.xpath(path)
                    values = [tostr(node) for node in nodes]
                    result[outfield] = values
                    added = True
                except Exception as e:
                    pass # consider throwing exception and explain path problem
                
            if not added and defaultval != None:
                result[outfield] = defaultval
                
        si.outputResults(results)
    except Exception as e:
        import traceback
        stack =  traceback.format_exc()
        si.generateErrorResults("Error '%s'. %s" % (e, stack))
```