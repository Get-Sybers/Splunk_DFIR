import json
import sys
from splunk.appserver.mrsparkle.lib.util import make_splunkhome_path


def add_to_sys_path(paths, prepend=False):
    for path in paths:
        if prepend:
            if path in sys.path:
                sys.path.remove(path)
            sys.path.insert(0, path)
        elif not path in sys.path:
            sys.path.append(path)


add_to_sys_path(
    [
        make_splunkhome_path(
            ["etc", "apps", "Splunk_Security_Essentials", "lib", "py23", "splunklib"]
        )
    ],
    prepend=True,
)
# We should not rely on core enterprise packages:
add_to_sys_path(
    [make_splunkhome_path(["etc", "apps", "Splunk_Security_Essentials", "lib", "py3"])],
    prepend=True,
)
# Common libraries like future
add_to_sys_path(
    [
        make_splunkhome_path(
            ["etc", "apps", "Splunk_Security_Essentials", "lib", "py23"]
        )
    ],
    prepend=True,
)
from six.moves import reload_module

try:
    if "future" in sys.modules:
        import future

        reload_module(future)
except Exception:
    """noop: future was not loaded yet"""


import re, os
import six.moves.urllib.request, six.moves.urllib.parse, six.moves.urllib.error, six.moves.urllib.request, six.moves.urllib.error, six.moves.urllib.parse
import splunklib.results as results
import pprint
from time import sleep

pp = pprint.PrettyPrinter(indent=4)
from io import open


import splunk.entity, splunk.Intersplunk
from splunk.clilib.cli_common import getConfKeyValue, getConfStanza

if sys.platform == "win32":
    import msvcrt

    # Binary mode is required for persistent mode on Windows.
    msvcrt.setmode(sys.stdin.fileno(), os.O_BINARY)
    msvcrt.setmode(sys.stdout.fileno(), os.O_BINARY)
    msvcrt.setmode(sys.stderr.fileno(), os.O_BINARY)

splunk_home = os.getenv("SPLUNK_HOME")
sys.path.append(splunk_home + "/etc/apps/Splunk_Security_Essentials/bin/")
sys.path.append(splunk_home + "/etc/apps/Splunk_Security_Essentials/bin/splunklib/")

import splunklib.client as client
import splunklib.results as results


import logging as logger

logger.basicConfig(
    filename=splunk_home + "/var/log/generateSTRT.log", level=logger.DEBUG
)

logger.info("Got the ignition")

sessionKey = ""
owner = ""
app = "Splunk_Security_Essentials"
includeAllContent = "false"
ignoreChannelExclusion = "false"
includeJSON = False
cache = True

# Utils

filterSource = "source"
filterEventType = "eventtype"
filterSourceType = "sourcetype"
definition = "definition"

# Rex
rexSourceType = 'sourcetype ?= ?("|)([^"\s]*)(|")'
rexSource = 'source ?= ?("|)([^"\s]*)(|")'

# Session key
for line in sys.stdin:
    m = re.search("sessionKey:\s*(.*?)$", line)
    if m:
        sessionKey = m.group(1)

# Initialize general configurations

try:
    # Getting configurations
    mgmtHostname, mgmtHostPort = getConfKeyValue(
        "web", "settings", "mgmtHostPort"
    ).split(":")
    base_url = "https://" + mgmtHostname + ":" + mgmtHostPort
except Exception as e:
    logger.error("Config error %s", str(e))
    throwErrorMessage = True

# Util functions


def processRexResult(rexResult):
    if rexResult:
        rexData = []
        for initData in rexResult:
            for mainData in initData:
                if mainData != '"' and mainData != "":
                    rexData.append(mainData)
        if rexData:
            logger.debug(rexData)
        return rexData

# For collecting initial macro and definition results
def get_macros_and_definition():
    # Initialize the search service
    try:
        service = client.connect(host=mgmtHostname, port=mgmtHostPort, token=sessionKey)
        service.namespace["owner"] = "nobody"
        service.namespace["app"] = "Splunk_Security_Essentials"
    except Exception as e:
        logger.error("Init error %s", str(e))
        throwErrorMessage = True
        return False

    # Get all jobs
    try:
        # Get the collection of search jobs
        jobs = service.jobs
    except Exception as e:
        logger.error("Jobs error %s", str(e))
        throwErrorMessage = True
        return False

    try:
        query = """
    | inputlookup sse_json_doc_storage_lookup 
    | eval len=len(json), key=_key 
    | search key="*macros*" 
    | table key description version len json 
    | spath input=json path="macros{}" output="macros" 
    | fields macros 
    | mvexpand macros 
    | spath input=macros 
    | table name definition 
    | rename name AS macro
        """
        kwargs_normalsearch = {
            "exec_mode": "blocking",
            "count": 0,
            "preview": True,
            "earliest_time": "-1h",
            "latest_time": "now",
            "search_mode": "normal",
            "adhoc_search_level": "fast",
        }
        job = jobs.create(query, **kwargs_normalsearch)

        offset = 0
        count = 50000
        result_count = 0
        while offset < int(job["resultCount"]):
            reader = enumerate(
                results.JSONResultsReader(
                    job.preview(
                        **{"count": count, "offset": offset, "output_mode": "json"}
                    )
                )
            )

            resulting_dict = {}

            resulting_list = [resulting_dict]

            for idx, result in reader:
                if isinstance(result, dict):
                    # normalize the events and create components and connections here
                    result_count += 1
                    if idx == 0:
                        resulting_list[0] = {
                            "macro": result["macro"],
                            "definition": result["definition"],
                        }
                    else:
                        resulting_list.append(
                            {
                                "macro": result["macro"],
                                "definition": result["definition"],
                            }
                        )

            offset += count

            return resulting_list

        job.cancel()
    except Exception as e:
        logger.error("Creating job error %s", str(e))
        throwErrorMessage = True
        return False

def get_default_inventory_products():
    # Initialize the search service
    try:
        service = client.connect(host=mgmtHostname, port=mgmtHostPort, token=sessionKey)
        service.namespace["owner"] = "nobody"
        service.namespace["app"] = "Splunk_Security_Essentials"
    except Exception as e:
        logger.error("Init error %s", str(e))
        throwErrorMessage = True
        return False

    # Get all jobs
    try:
        # Get the collection of search jobs
        jobs = service.jobs
    except Exception as e:
        logger.error("Jobs error %s", str(e))
        throwErrorMessage = True
        return False

    try:
        query = """
| inputlookup SSE-default-data-inventory-products.csv 
    | eval eventtypeId=split(eventtypeId,"|") 
    | mvexpand eventtypeId 
    | search regex_pattern=* 
    | search NOT productId IN (MSSQL*, SQL*,MySQL*, Oracle*, ESXi* , VMWare*, Linux*, FireEye*, Fortinet*, Cylance*, Check*, Juniper*)
        """
        kwargs_normalsearch = {
            "exec_mode": "blocking",
            "count": 0,
            "preview": True,
            "earliest_time": "-1h",
            "latest_time": "now",
            "search_mode": "normal",
            "adhoc_search_level": "fast",
        }
        job = jobs.create(query, **kwargs_normalsearch)

        offset = 0
        count = 50000
        result_count = 0
        while offset < int(job["resultCount"]):
            reader = enumerate(
                results.JSONResultsReader(
                    job.preview(
                        **{"count": count, "offset": offset, "output_mode": "json"}
                    )
                )
            )

            resulting_list = []

            for idx, result in reader:
                if isinstance(result, dict):
                    # normalize the events and create components and connections here
                    result_count += 1
                    resulting_list.append(result)

            offset += count

            return resulting_list

    except Exception as e:
        logger.error("Creating job error %s", str(e))
        throwErrorMessage = True
        return False

# Process initial data to fetch sources and sourcetypes

def fetch_sources_and_sourcetypes(sourceData):
    for index, data in enumerate(sourceData):
        # print(index)
        sourcetype_init = re.findall(rexSourceType, data[definition])
        rexData = processRexResult(sourcetype_init)

        if rexData:
            sourceData[index][filterSourceType] = "|".join(rexData)


        source_init = re.findall(rexSource, data[definition])
        rexData = processRexResult(source_init)
        if source_init:
            sourceData[index][filterSource] = "|".join(rexData)


def printOutput(data):
    for idx, result in enumerate(data):
        if idx == 0:
            print("macro, definition, _timediff, eventtypeId, productId,  source, sourcetype")

        print(
            "%s, %s, %s, %s, %s, %s, %s"
            % (
                result.get("macro", ""),
                result.get("definition", ""),
                result.get("_timediff", ""),
                result.get("eventtypeId", ""),
                result.get("productId", ""),
                result.get("source", ""),
                result.get("sourcetype", "")
            )
        )


def checkForEdgeCases(data):
    # Check for custom sourceTypes
    for idx, x in enumerate(data):
        if filterEventType in str(x[definition]) and "cisco_ios" in str(x[definition]):
            x[filterSourceType] = "eventtype=cisco_ios"
        elif filterEventType in str(x[definition]) and "osquery-process" in str(
            x[definition]
        ):
            x[filterSourceType] = "osquery:results"
        elif filterEventType in str(x[definition]) and "okta_log" in str(x[definition]):
            x[filterSourceType] = "Okta"
    # Check for custom sources
    for idx, x in enumerate(data):
        if filterEventType in str(x[definition]) and "wineventlog_security" in str(
            x[definition]
        ):
            x[filterSource] = "WinEventLog:Security"
        elif filterEventType in str(x[definition]) and "wineventlog_system" in str(
            x[definition]
        ):
            x[filterSource] = "WinEventLog:System"

def fetch_events_and_products(regexData, mainData):

    for indexRex,dataRex in enumerate(regexData):
        for indexMain,dataMain in enumerate(mainData):
            
            try:
                # case 1: sourcetype
                if(dataMain.get(filterSourceType)):
                    matchRegexSourceType = re.search(dataRex["regex_pattern"], dataMain[filterSourceType])
                    if(matchRegexSourceType):

                        # Case 1: eventtypeId
                        # If eventtypeId exists
                        if(mainData[indexMain].get("eventtypeId")):
                            # If *Vendor* exists, skip
                            if(re.search("Vendor*", dataRex.get("eventtypeId"))):
                                # If upcoming data includes *Vendor*
                                mainData[indexMain]["eventtypeId"] = dataRex["eventtypeId"]
                            else:
                                mainData[indexMain]["eventtypeId"] = (mainData[indexMain]["eventtypeId"]+"|"+dataRex["eventtypeId"])
                       
                        # If eventtypeId does not exist
                        else:
                            mainData[indexMain]["eventtypeId"] = dataRex["eventtypeId"]

                        # case 2: productId
                        mainData[indexMain]["productId"] = dataRex["productId"]


                # case 2: source
                if(dataMain.get(filterSource)):
                    matchRegexSource = re.search(dataRex["regex_pattern"], dataMain[filterSource])
                    if(matchRegexSource):

                        # Case 1: eventtypeId
                        # If eventtypeId exists
                        if(mainData[indexMain].get("eventtypeId")):
                            # If *Vendor* exists, skip
                            if(re.search("Vendor*", dataRex.get("eventtypeId"))):
                                # If upcoming data includes *Vendor*
                                mainData[indexMain]["eventtypeId"] = dataRex["eventtypeId"]
                            else:
                                mainData[indexMain]["eventtypeId"] = (mainData[indexMain]["eventtypeId"]+"|"+dataRex["eventtypeId"])
                       
                        # If eventtypeId does not exist
                        else:
                            mainData[indexMain]["eventtypeId"] = dataRex["eventtypeId"]

                         # case 2: productId
                        mainData[indexMain]["productId"] = dataRex["productId"]

            
            except Exception as e:
                logger.error(indexMain, indexRex)
                logger.error("Error %s", str(e))

try:
    # Stage 1: Get all data
    macros_and_definition = get_macros_and_definition()

    # Stage 2: Filter data which contains the source & eventtype in the definition
    filteredData = list(
        filter(
            lambda x: filterSource in str(x[definition])
            or filterEventType in str(x[definition]),
            macros_and_definition,
        )
    )

    # Stage 3: extract sources and sourcetypes
    fetch_sources_and_sourcetypes(filteredData)
    checkForEdgeCases(filteredData)

    # Stage 4: Get regex data
    defaultData = get_default_inventory_products()

    # Stage 5: extract eventtypeID and productID
    fetch_events_and_products(defaultData, filteredData)
    
    # Stage 6: print output
    printOutput(list(filteredData))
    
except Exception as e:
    logger.error("Exception %s", str(e))
