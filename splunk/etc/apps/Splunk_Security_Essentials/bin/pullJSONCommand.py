#!/usr/bin/python
from __future__ import print_function

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

add_to_sys_path([make_splunkhome_path(['etc', 'apps', 'Splunk_Security_Essentials', 'lib', 'py23', 'splunklib'])], prepend=True)
# We should not rely on core enterprise packages:
add_to_sys_path([make_splunkhome_path(['etc', 'apps', 'Splunk_Security_Essentials', 'lib', 'py3'])], prepend=True)
# Common libraries like future
add_to_sys_path([make_splunkhome_path(['etc', 'apps', 'Splunk_Security_Essentials', 'lib', 'py23'])], prepend=True)
from six.moves import reload_module
try:
    if 'future' in sys.modules:
        import future
        reload_module(future)
except Exception:
    '''noop: future was not loaded yet'''



import json, csv, re, os
import six.moves.urllib.request, six.moves.urllib.parse, six.moves.urllib.error, six.moves.urllib.request, six.moves.urllib.error, six.moves.urllib.parse

splunk_home = os.getenv('SPLUNK_HOME')

# import logging as logger
# logger.basicConfig(filename=splunk_home + '/var/log/pullJsonCommand.log', level=logger.DEBUG)


from splunk.clilib.cli_common import getConfKeyValue, getConfStanza
import splunklib.client as client
from io import open
from six.moves import range

app = "Splunk_Security_Essentials"
desired_config = ""
sessionKey = ""
debug = []
EnableDebug = False
valid_config_files = {
            "usecases": {"file": "/components/localization/usecases"},
            "data_inventory": {"file": "/components/localization/data_inventory", "specialcustomcontent": "custom_content"},
            "htmlpanels": {"file": "/components/localization/htmlpanels"},
            "sselabels": {"file": "/components/localization/sselabels"},
            "config": {"file": "/components/data/system_config"},
            "showcaseinfo": {"file": "/components/localization/ShowcaseInfo", "kvstore": "sse_json_doc_storage", "key": "showcaseinfo"},
            "mitreattack": {"file": "/vendor/mitre/enterprise-attack", "kvstore": "sse_json_doc_storage", "key": "mitreattack"},
            "Splunk_Research_Baselines": {"file": "/vendor/splunk/Splunk_Research_Baselines", "kvstore": "sse_json_doc_storage", "key": "Splunk_Research_Baselines"},
            "Splunk_Research_Deployments": {"file": "/vendor/splunk/Splunk_Research_Deployments", "kvstore": "sse_json_doc_storage", "key": "Splunk_Research_Deployments"},
            "Splunk_Research_Detections": {"file": "/vendor/splunk/Splunk_Research_Detections", "kvstore": "sse_json_doc_storage", "key": "Splunk_Research_Detections"},
            "Splunk_Research_Lookups": {"file": "/vendor/splunk/Splunk_Research_Lookups", "kvstore": "sse_json_doc_storage", "key": "Splunk_Research_Lookups"},
            "Splunk_Research_Macros": {"file": "/vendor/splunk/Splunk_Research_Macros", "kvstore": "sse_json_doc_storage", "key": "Splunk_Research_Macros"},
            "Splunk_Research_Response_Tasks": {"file": "/vendor/splunk/Splunk_Research_Response_Tasks", "kvstore": "sse_json_doc_storage", "key": "Splunk_Research_Response_Tasks"},
            "Splunk_Research_Responses": {"file": "/vendor/splunk/Splunk_Research_Responses", "kvstore": "sse_json_doc_storage", "key": "Splunk_Research_Responses"},
            "Splunk_Research_Stories": {"file": "/vendor/splunk/Splunk_Research_Stories", "kvstore": "sse_json_doc_storage", "key": "Splunk_Research_Stories"},
            "Splunk_Research_Version": {"file": "/vendor/splunk/Splunk_Research_Version", "kvstore": "sse_json_doc_storage", "key": "Splunk_Research_Version"},
            "intro": {"file": "/components/localization/intro_content"}
        }
def strip_non_ascii(string):
    ''' Returns the string without non ASCII characters'''
    stripped = (c for c in string if 0 < ord(c) < 127)
    return ''.join(stripped)

def errorOut(obj):
  print("Error!")
  print('"' + json.dumps(obj).replace('"', '""') + '"')
  sys.exit()

for line in sys.stdin:
    m = re.search("search:\s*(.*?)$", line)
    if m:
        searchString = six.moves.urllib.parse.unquote(m.group(1))
        if searchString:
            m = re.search("ssedata[^\|]*config=\"*\s*([^ \"]*)", searchString)
            if m:
                config = m.group(1)
                if config in valid_config_files:
                    desired_config = config
    m = re.search("sessionKey:\s*(.*?)$", line)
    if m:
        sessionKey = m.group(1)
    m = re.search("owner:\s*(.*?)$", line)
    if m:
        owner = m.group(1)
if desired_config=="":
    obj= {'payload': {"response": "Error! No valid configuration specified. Should be passed with config=config (to grab the config object)."},
            'status': 500          # HTTP status code
    }
    errorOut(obj)

try:
    # Getting configurations
    base_url = "https://" + getConfKeyValue('web', 'settings', 'mgmtHostPort')
except:
    errorOut({"response": "Error getting configurations!"})

w = csv.writer(sys.stdout)
columns = []
columns.append("config")
if desired_config == "data_inventory":
    columns.append("data_source")
    columns.append("data_source_description")
    columns.append("data_source_category")
    columns.append("data_source_category_baseSearch")
    columns.append("data_source_category_tags")
    columns.append("data_source_category_datamodel")
    columns.append("data_source_category_description")
    columns.append("data_source_category_name")
    columns.append("json")
elif desired_config == "Splunk_Research_Stories":
    columns.append("analytic_story")
    columns.append("story_details")
elif desired_config == "Splunk_Research_Detections":
    columns.append("analytic_story")
    columns.append("detections")
elif desired_config == "mitreattack":
    columns.append("type")
    columns.append("name")
    columns.append("description")
    columns.append("external_id")
    columns.append("id")
    columns.append("json")
else:
    columns.append("object")
    columns.append("json")
if EnableDebug:
    columns.append("debug")
w.writerow(columns)

try:
    # Getting configurations
    requestURL=base_url + '/services/pullJSON?config='+desired_config
    request = six.moves.urllib.request.Request(requestURL,
        headers = { 'Authorization': ('Splunk %s' % sessionKey)})
    search_results = six.moves.urllib.request.urlopen(request)

    json_blob = json.loads(search_results.read())
    # debug += "Here we go... " + " - ".join(list(json_blob.keys()))
    for key in json_blob:
        if desired_config == "data_inventory":
            for dsc in json_blob[key]["eventtypes"]:
                currentRow = []
                currentRow.append(desired_config)
                currentRow.append(key)
                currentRow.append(json_blob[key].get("description", ""))
                currentRow.append(dsc)
                currentRow.append(json_blob[key]["eventtypes"][dsc].get("baseSearch", ""))
                currentRow.append(json_blob[key]["eventtypes"][dsc].get("tags", ""))
                currentRow.append(json_blob[key]["eventtypes"][dsc].get("datamodel", ""))
                currentRow.append(json_blob[key]["eventtypes"][dsc].get("description", ""))
                currentRow.append(json_blob[key]["eventtypes"][dsc].get("name", ""))
                currentRow.append(json_blob[key]["eventtypes"][dsc])
                if EnableDebug:
                    currentRow.append(debug)
                w.writerow(currentRow)

        elif desired_config == "Splunk_Research_Stories":
            dicStories = {}

            for dsc in json_blob[key]:
                if dicStories.get(dsc["name"]) is None:
                    dicStories[dsc["name"]] = [dsc]
                else:
                    dicStories[dsc["name"]].append(dsc)
            for story in dicStories:
                currentRow = []
                currentRow.append(desired_config)
                currentRow.append(story)
                currentRow.append(json.dumps(dicStories[story]))
                w.writerow(currentRow)

        elif desired_config == "Splunk_Research_Detections":
            dicStories = {}
            for dsc in json_blob[key]:
                if dicStories.get(dsc["tags"]["analytic_story"][0]) is None:
                    dicStories[dsc["tags"]["analytic_story"][0]] = [dsc]
                else:
                    dicStories[dsc["tags"]["analytic_story"][0]].append(dsc)

            for story in dicStories:
                currentRow = []
                currentRow.append(desired_config)
                currentRow.append(story)
                currentRow.append(json.dumps(dicStories[story]))
                w.writerow(currentRow)
        elif desired_config == "mitreattack":
            if key == "objects":
                objects = json_blob[key]
                for obj in objects:
                    currentRow = []
                    currentRow.append(desired_config)
                    currentRow.append(obj.get("type", ""))
                    currentRow.append(obj.get("name", ""))
                    currentRow.append(obj.get("description", ""))
                    if obj.get("external_references",[""])[0] is "":
                        currentRow.append("")
                    else:
                        external_references = obj.get("external_references",[""])[0]
                        currentRow.append(external_references.get("external_id",""))
                    currentRow.append(obj.get("id", ""))
                    currentRow.append(json.dumps(obj))
                    if EnableDebug:
                        currentRow.append(debug)
                    w.writerow(currentRow)
        else:
            currentRow = []
            currentRow.append(desired_config)
            currentRow.append(key)
            currentRow.append(json_blob[key])
            if EnableDebug:
                currentRow.append(debug)
            w.writerow(currentRow)
except Exception as e:
    errorOut({"status": "ERROR", "description": "Error occurred while grabbing the json", "message": str(e)})