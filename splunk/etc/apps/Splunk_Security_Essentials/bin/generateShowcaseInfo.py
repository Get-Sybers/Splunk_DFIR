from __future__ import absolute_import

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
import traceback
import os
import json 
import re
import six.moves.urllib.request, six.moves.urllib.parse, six.moves.urllib.error, six.moves.urllib.request, six.moves.urllib.error, six.moves.urllib.parse
import time
import csv


splunk_home = os.getenv('SPLUNK_HOME')
sys.path.append(splunk_home + '/etc/apps/Splunk_Security_Essentials/bin/')
sys.path.append(splunk_home + '/etc/apps/Splunk_Security_Essentials/bin/splunklib/')


from bs4 import BeautifulSoup

import traceback

import splunk.rest as rest


import splunk.entity, splunk.Intersplunk
from splunk.clilib.cli_common import getConfKeyValue, getConfStanza, getConfStanzas
from io import open
from six.moves import range

if sys.platform == "win32":
    import msvcrt
    # Binary mode is required for persistent mode on Windows.
    msvcrt.setmode(sys.stdin.fileno(), os.O_BINARY)
    msvcrt.setmode(sys.stdout.fileno(), os.O_BINARY)
    msvcrt.setmode(sys.stderr.fileno(), os.O_BINARY)

from splunk.persistconn.application import PersistentServerConnectionApplication

import splunklib.client as client
from splunklib.client import ConfigurationFile
import logging as logger
logger.basicConfig(filename=splunk_home + '/var/log/showcaseInfo.log', level=logger.DEBUG)

class ShowcaseInfo(PersistentServerConnectionApplication):
    def __init__(self, command_line, command_arg):
        PersistentServerConnectionApplication.__init__(self)
    def handle(self, in_string):
        input = {}
        payload = {}
        caching = "requireupdate"
        sessionKey = ""
        owner = "" 
        app = "Splunk_Security_Essentials" 
        includeSSEFilter = True
        settings = dict()
        base_url =""
        bookmarks = dict()
        kvstore_usernames = dict()
        kvstore_conversion = dict()
        # kvstore_data_status = dict()
        eventtypes_data_status = dict()
        # eventtypes_coverage_level = dict()
        eventtype_names = {}
        dsc_to_ds_name = {}
        eventtype_to_legacy_names = {}
        myApps = [app]
        globalSourceList = dict()
        debug = []
        globalSearchList = dict()
        mitre_attack_blob = dict()
        mitre_names = {"attack": {}}
        mitre_refs_to_names = {}
        mitre_refs_to_refs = {}
        mitre_techniques_to_groups = {}
        mitre_techniques_to_software = {}
        # mitre_techniques_to_group_objs = {}
        # group_ref_technique_ref_to_details = {}
        mitre_group_name_to_description = {}
        mitre_group_name_to_id = {}
        mitre_software_name_to_id = {}
        mitre_refs_to_ids = {}
        mitre_technique_descriptions = {}
        mitre_sub_technique_descriptions = {}
        mitre_keywords = {}
        mitre_platforms = {}
        desired_locale = ""
        valid_locales = ["ja-JP", "en-DEBUG"]
        custom_content = []
        channel_exclusion = {}
        ignore_channel_exclusion = False
        channel_to_name = {}
        dsc_to_productIds = {}
        dsc_to_da_scores = {}
        product_details = {}
        popularity_threshold = 5
        popularTechniques = {}
        field_list_version = "all"
        summary_id = ""
        mini_fields = ["id", "includeSSE", "examples", "mitre_keywords", "dashboard", "bookmark_status", "bookmark_status_display", "bookmark_notes", "icon", "name", "description", "usecase", "category", "mitre_id", "mitre_technique_combined", "mitre_technique_display", "mitre_sub_technique_display", "mitre_tactic_display", "data_source_categories_display", "channel", "displayapp", "journey", "highlight", "alertvolume", "domain", "mitre_threat_groups","mitre_platforms","mitre_software", "data_available", "enabled", "killchain", "hasSearch", "SPLEase", "advancedtags", "released", "searchKeywords", "datasource", "datamodel","search_title","hasContentMapping", "industryMapping", "escu_nist", "escu_cis", "soarPlaybookAvailable","analytic_story", "risk_object_type", "threat_object_type", "risk_score", "risk_message", "securityDataJourney"]
        start_time = time.time()
        search_mappings = {}
        #bookmark_display_names = { "none": "Not On List", "bookmarked": "Bookmarked", "inQueue": "Ready for Deployment", "needData": "Waiting on Data", "issuesDeploying": "Deployment Issues", "needsTuning": "Needs Tuning", "successfullyImplemented": "Successfully Implemented" }
        bookmark_display_names = {"none": "Not On List", "bookmarked": "Bookmarked", "successfullyImplemented": "Successfully Implemented"}
        throwErrorMessage = False
        pathToShowcaseInfoMini = os.environ['SPLUNK_HOME'] + "/etc/apps/" + app + "/appserver/static/components/localization/"
        key_checking = {
            "app":   "text",
            "analytic_story":   "text",
            "bookmark_notes":   "text",
            "bookmark_status":   "text",
            "bookmark_status_display":   "text",
            "bookmark_user":   "text",
            "datasource":   "text",
            "create_data_inventory": "boolean",
            "datasources":   "text",
            "datamodel":   "text",
            "name":   "text",
            "inSplunk":   "text",
            "journey":   "text",
            "usecase":   "text",
            "highlight":   "text",
            "alertvolume":   "text",
            "severity":   "text",
            "category":   "text",
            "description":   "text",
            "displayapp":   "text",
            "domain":   "text",
            "gdpr":   "text",
            "gdprtext":   "text",
            "hasSearch":   "text",
            "hasContentMapping":   "text",
            "industryMapping": "text",
            "escu_nist": "text",
            "escu_cis": "text",
            "soarPlaybookAvailable": "text",
            "mitre":   "text",
            "released":   "text",
            "killchain":   "text",
            "SPLEase":   "text",
            "searchkeywords":   "text",
            "advancedtags":   "text",
            "printable_image":   "text",
            "icon":   "text",
            "company_logo":   "text",
            "company_logo_width":   "text",
            "company_logo_height":   "text",
            "company_name":   "text",
            "company_description":   "text",
            "company_link":   "text",
            "dashboard":   "text",
            "relevance":   "text",
            "help":   "text",
            "howToImplement":   "text",
            "knownFP":   "text",
            "operationalize":   "text",
            "search":   "spl",
            "data_source_categories":   "text",
            "mitre_technique":   "text",
            "mitre_sub_technique":   "text",
            "mitre_tactic":   "text",
            "additional_context": "array",
            "additional_context.title": "text",   
            "additional_context.search_label": "text",
            "additional_context.detail": "text",
            "additional_context.link": "text",
            "additional_context.search_lang": "text",
            "additional_context.search": "spl",
            "additional_context.open_panel": "boolean",
            "open_search_panel": "boolean",
            "securityDataJourney": "text"
        }
        
        debug.append("Stage -5 Time Check:" + str(time.time() - start_time) )
        try: 
            input = json.loads(in_string)
            sessionKey = input['session']['authtoken']
            owner = input['session']['user']
            if "query" in input:
                for pair in input['query']:
                    if pair[0] == "app":
                        app = pair[1]
                    elif pair[0] == "hideExcludedContent":
                        if pair[1] == "false":
                            includeSSEFilter = False
                    elif pair[0] == "ignoreChannelExclusion":
                        if pair[1] == "true":
                            ignore_channel_exclusion = True
                    elif pair[0] == "fields":
                        if pair[1] == "mini":
                            field_list_version = "mini"
                    elif pair[0] == "summaryId":
                        summary_id = pair[1]
                    # elif pair[0] == "caching":
                    #     if pair[1] == "cached":
                    #         caching = "cached"
                    #     if pair[1] == "requireupdate":
                    #         caching = "requireupdate"
                    #     if pair[1] == "updateonly":
                    #         caching = "updateonly"
                    elif pair[0] == "locale":
                        if pair[1] in valid_locales:
                            desired_locale = "." + pair[1]
        except:
            return {'payload': json.dumps({"response": "Error! Couldn't find any initial input. This shouldn't happen."}),  
                    'status': 500          # HTTP status code
            }
        #caching = "cached"

        debug.append("Stage -4 Time Check:" + str(time.time() - start_time) )
        try:
            # Getting configurations
            mgmtHostname, mgmtHostPort = getConfKeyValue('web', 'settings', 'mgmtHostPort').split(":")
            base_url = "https://" + mgmtHostname + ":" + mgmtHostPort
        except Exception as e:
            debug.append(json.dumps({"status": "ERROR", "description": "Error getting the base_url configuration!", "message": str(e), "traceback": traceback.format_exc()}))
            throwErrorMessage = True

        debug.append("Stage -3 Time Check:" + str(time.time() - start_time) )


        try: 
            service = client.connect(host=mgmtHostname, port=mgmtHostPort, token=sessionKey)
            service.namespace['owner'] = 'nobody'
            service.namespace['app'] = 'Splunk_Security_Essentials'
        except Exception as e:
            debug.append(json.dumps({"status": "ERROR", "description": "Error grabbing a service object", "message": str(e), "traceback": traceback.format_exc()}))
            throwErrorMessage = True

        debug.append("Stage -4 Time Check:" + str(time.time() - start_time) )

        def clean_content(obj, key_checking, path=""):
            for field in list(obj.keys()):
                try:
                    if path + field not in key_checking:
                        del obj[field]
                        debug.append({"status": "WARN", "msg": "clean_content, deleting field not in key_checking", "path": path, "field": field, "key_checking": key_checking})
                    elif obj[field] == None:
                        del obj[field]
                        debug.append({"status": "WARN", "msg": "clean_content, deleting field set to None", "field": field})
                    elif key_checking[path + field] == "text":
                        obj[field] = BeautifulSoup(obj[field], "lxml").text
                    elif key_checking[path + field] == "boolean":
                        if not isinstance(obj[field], bool):
                            debug.append({"status": "WARN", "msg": "clean_content, deleting field because it's not actually a bool", "path": path, "field": field, "value": obj[field]})
                            del obj[field]
                    elif key_checking[path + field] == "number":
                        obj[field] = BeautifulSoup(obj[field], "lxml").text
                    elif key_checking[path + field] == "object":
                        obj[field] = clean_content(obj[field], key_checking, path + field + ".")
                    elif key_checking[path + field] == "array":
                        debug.append({"status": "INFO", "msg": "clean_content, found an array field", "field": field})
                        for i in list(range(0, len(obj[field]) )):
                            debug.append({"status": "INFO", "msg": "clean_content, looking at an array row", "field": field, "row": obj[field][i], "isInstance": isinstance(row, object)})
                            if isinstance(obj[field][i], object):
                                obj[field][i] = clean_content(obj[field][i], key_checking, path + field + ".")
                                debug.append({"status": "INFO", "msg": "clean_content, got my final row", "field": field, "row": obj[field][i], "isInstance": isinstance(row, object)})
                        # obj[field] = clean_content(obj[field], key_checking, path + field + ".")
                    elif key_checking[path + field] == "spl":
                        nochecking = True
                        # We handle this in javascript by doing $("<pre>").text(summary.search) -- jquery strips out invalid characters.
                except Exception as e:
                    del obj[field]
                    debug.append({"status": "ERROR", "msg": "clean_content, error'd while trying to clean content", "error": str(e), "path": path, "field": field, "key_checking": key_checking})

            # debug.append({"status": "INFO", "msg": "clean_content, final obj", "obj": obj})
            return obj
        def isSPLDangerous(spl):
            try: 
                total_url = "/services/search/jobs"
                request = six.moves.urllib.request.Request(total_url,
                    headers = { 'Authorization': ('Splunk %s' % sessionKey)})
                search_results = six.moves.urllib.request.urlopen(request)
            except:
                return true

        def getKVStoreById(store, id):

            try:
                # service = client.connect(token=sessionKey)
                # service.namespace['owner'] = 'nobody'
                # service.namespace['app'] = 'Splunk_Security_Essentials'
                kvstore_output = service.kvstore[store].data.query_by_id(id)
                debug.append({"message": "I got a kvstorebyid request", "store": store, "id": id, "returningkey": kvstore_output["_key"]})
            except Exception as e:
                #request = urllib2.Request(base_url + '/servicesNS/nobody/' + app + '/storage/collections/data/sse_json_doc_storage/?query={"_key":"' + "sseshowcase" + desired_locale + '"}',
                total_url = base_url + '/servicesNS/nobody/' + app + "/storage/collections/data/" + store + "/" + id
                debug.append({"status": "Failed to do primary method, reverting to old", "url": total_url, "error": str(e)})
                request = six.moves.urllib.request.Request(total_url,
                    headers = { 'Authorization': ('Splunk %s' % sessionKey)})
                search_results = six.moves.urllib.request.urlopen(request)

                kvstore_output = json.loads(search_results.read())
                debug.append({"message": "I got a kvstorebyid request", "store": store, "id": id, "returningkey": kvstore_output["_key"]})
            
            return kvstore_output

        def getKVStore(store):
            debug.append({"message": "I got a kvstore request", "store": store})
            try:
                # service = client.connect(token=sessionKey)
                # service.namespace['owner'] = 'nobody'
                # service.namespace['app'] = 'Splunk_Security_Essentials'
                kvstore_output = service.kvstore[store].data.query()
            except Exception as e:
                total_url = base_url + '/servicesNS/nobody/' + app + "/storage/collections/data/" + store
                debug.append({"status": "Failed to do primary method, reverting to old", "url": total_url, "traceback": traceback.format_exc(), "error": str(e)})
                request = six.moves.urllib.request.Request(total_url,
                    headers = { 'Authorization': ('Splunk %s' % sessionKey)})
                search_results = six.moves.urllib.request.urlopen(request)

                kvstore_output = json.loads(search_results.read())
            return kvstore_output
        debug.append({"localecheck": desired_locale})
        # if caching == "cached":
        #     total_url = ""
        #     try:
        #         # Now to grab kvstore collection data
        #         kvstore_output = getKVStoreById("sse_json_doc_storage", "sseshowcase" + desired_locale)

        #         debug.append("We're using a kvstore cache for this page load")
        #         # debug.append(kvstore_output)
        #         if kvstore_output:
        #             globalSourceList = json.loads(kvstore_output['json'])
        #             debug.append("I found a kvstore cache for the showcase")
        #             #debug.append(kvstore_output['json'])

        #             try:
        #                 debug.append("Time to render:" + str(time.time() - start_time) )
        #             except:
        #                 debug.append("Couldn't add the time taken")

                    
        #             globalSourceList['debug'] = debug
        #             globalSourceList['throwError'] = throwErrorMessage
        #             return {'payload': globalSourceList,  
        #                     'status': 200          # HTTP status code
        #             }

        #     except Exception as e:
        #         debug.append(json.dumps({"status": "ERROR", "description": "Failed to grab cached sseshowcase", "backup_url": total_url, "desired_locale": desired_locale, "message": str(e), "traceback": traceback.format_exc()}))
        #         throwErrorMessage = False
        # else:
        #     debug.append("Not going cached! Prepare for a long ride.")

        
        debug.append("Stage -1 Time Check:" + str(time.time() - start_time) )
        try: 
            conf_Stanzas = getConfStanzas("essentials_updates")
            debug.append({"msg": "Channels Configuration Stanzas", "output": conf_Stanzas})
            # standardObjects = ["ES", "ESCU", "UBA", "SSE"]
            for cfg in conf_Stanzas:
                # cfg = getConfStanza('essentials_updates', stanza)
                # setting = cfg.get('disabled')
                # channel = cfg.get('channel')
                # debug.append({"msg": "Channels - got config", "cfg": cfg})
                setting = None 
                if "disabled" in conf_Stanzas[cfg]:
                    setting = conf_Stanzas[cfg]["disabled"]
                channel = None 
                if "channel" in conf_Stanzas[cfg]:
                    channel = conf_Stanzas[cfg]['channel']    
                name = channel 
                if "name" in conf_Stanzas[cfg]:
                    name = conf_Stanzas[cfg]['name']    
                # debug.append({"msg": "Channels - got stanza", "stanzaName": cfg, "disabled": setting, "channel": channel})
                if channel is not None and channel != "":    
                    channel_to_name[channel] = name
                    if setting is None or setting == "" or setting == 0 or setting == False or setting == "false" or setting == "FALSE":
                        channel_exclusion[channel] = False
                    else:
                        channel_exclusion[channel] = True
            debug.append({"msg": "Final Channel Exclusion", "channel_exclusion": channel_exclusion, "override": ignore_channel_exclusion})
        except Exception as e:
            debug.append(json.dumps({"status": "ERROR", "description": "Error grabbing config objects", "message": str(e), "traceback": traceback.format_exc()}))
            throwErrorMessage = True
        
        debug.append("Stage 0 Time Check:" + str(time.time() - start_time) )

        debug.append("Stage 1 Time Check:" + str(time.time() - start_time) )
            

        debug.append("Stage 2 Time Check:" + str(time.time() - start_time) )
        try:
            # Now to grab kvstore collection data
            kvstore_output = getKVStore("bookmark") #service.kvstore['bookmark'].data.query()
            for i in kvstore_output:
                bookmarks[i['_key']] = i

        except Exception as e:
            debug.append(json.dumps({"status": "ERROR", "description": "Error occurred while grabbing bookmark kvstore", "message": str(e), "traceback": traceback.format_exc()}))
            throwErrorMessage = True
        
        # convert the ids to the actual display names from the kvstore
        try: 
            bookmark_names = getKVStore("bookmark_names")
            bookmark_content = json.loads(json.dumps(bookmark_names))

            for i in bookmark_content:
                if i["referenceName"] == "":
                    s = i["name"].title().replace(" ", "")
                    s = s[0].lower() + s[1:]
                    i["referenceName"] = s

                bookmark_display_names[i["referenceName"]] = i["name"]
        except Exception as e:
            debug.append(json.dumps({"status": "ERROR", "description": "Error occurred while grabbing bookmark_names kvstore", "message": str(e), "traceback": traceback.format_exc()}))
            throwErrorMessage = True
        
        debug.append("Stage 3 Time Check:" + str(time.time() - start_time) )
        try:
            kvstore_output = getKVStore("local_search_mappings")# service.kvstore['local_search_mappings'].data.query()
            for i in kvstore_output:
                if ('showcaseId' in i and i['showcaseId']!="" and i['showcaseId'] not in search_mappings):
                    search_mappings[i['showcaseId']] = []
                if ('showcaseId' in i and i['showcaseId']!=""):
                    search_mappings[i['showcaseId']].append(i['search_title'])
        except Exception as e:
            debug.append(json.dumps({"status": "ERROR", "description": "Error occurred while grabbing local_search_mappings", "message": str(e), "traceback": traceback.format_exc()}))
            throwErrorMessage = True
        
        debug.append("Stage 4 Time Check:" + str(time.time() - start_time) )
        # try:
            # kvstore_output = getKVStore("data_source_check") # service.kvstore['data_source_check'].data.query()
            # for i in kvstore_output:
            #     if " - Demo" in i['searchName'] or ( i['showcaseId'] in kvstore_data_status and kvstore_data_status[ i['showcaseId'] ] == "Good" ):
            #         continue
            #     kvstore_data_status[i['showcaseId']] = i['status']

        # except Exception as e:
        #     debug.append(json.dumps({"status": "ERROR", "description": "Error occurred while grabbing data_source_check", "message": str(e), "traceback": traceback.format_exc()}))
        #     throwErrorMessage = True
        
        debug.append("Stage 5 Time Check:" + str(time.time() - start_time) )
        
        try:
            kvstore_output = getKVStore("data_inventory_products") # service.kvstore['data_inventory_products'].data.query()
            # debug.append({"msg": "Got my kvstore output", "output": kvstore_output})
            for row in kvstore_output:
                if "eventtypeId" in row and row["eventtypeId"] != "" and row["eventtypeId"] != None:
                    eventtypes = row['eventtypeId'].split("|")
                    # debug.append({"msg": "Product Prep", "product": row['productId'], "dsc_string": row['eventtypeId'], "dsc": eventtypes, "stage": row['stage'], "status": row['status'], "row": row })
                    for eventtype in eventtypes:
                        if eventtype not in dsc_to_productIds:
                            dsc_to_productIds[eventtype] = []
                            dsc_to_da_scores[eventtype] = []
                            
                        dsc_to_productIds[eventtype].append(row['productId'])
                        
                        if row['stage'] in ['all-done', 'step-review', 'step-eventsize', 'step-volume', 'manualnodata']:
                            if 'coverage_level' in row and row['coverage_level'] != "" and int(row['coverage_level']) != -1:
                                dsc_to_da_scores[eventtype].append(int(row['coverage_level']))
                                # debug.append({"msg": "ADDED PRODUCT W/ Real Coverage", "product": row['productId'], "dsc": eventtype, "stage": row['stage'], "status": row['status'], "coverage_level": row['coverage_level'], "row": row })
                            else: 
                                dsc_to_da_scores[eventtype].append(100)
                                # debug.append({"msg": "ADDED PRODUCT but made up coverage", "product": row['productId'], "dsc": eventtype, "stage": row['stage'], "status": row['status'], "row": row })
                        # else:
                        #     debug.append({"msg": "DID NOT ADD PRODUCT", "product": row['productId'], "dsc": eventtype, "stage": row['stage'], "status": row['status'], "row": row })
                        product_details[row['productId']] = row
            for eventtype in dsc_to_productIds:
                dsc_to_productIds[eventtype] = "|".join(dsc_to_productIds[eventtype])
            # debug.append({"step": "genningProductIdFinal", "list": dsc_to_productIds})

        except Exception as e:
            debug.append(json.dumps({"status": "ERROR", "description": "Error occurred while grabbing data_inventory_products", "message": str(e), "traceback": traceback.format_exc()}))
            throwErrorMessage = True
        
        debug.append("Stage 6 Time Check:" + str(time.time() - start_time) )
        try:
            custom_content_input = getKVStore('custom_content')
            for row in custom_content_input:
                try:
                    row['json'] = json.dumps(clean_content(json.loads(row['json']), key_checking))
                    custom_content.append(row)
                    debug.append({"msg": "successfully added cleaned custom content", "showcaseId": row['showcaseId'], "obj": json.loads(row['json'])})
                except Exception as e:
                    debug.append({"msg": "Got an error when trying to clean custom content", "obj": row, "error": str(e)})
                # for field in custom_content:
            #     debug.append(i)
        except Exception as e:
            debug.append(json.dumps({"status": "ERROR", "description": "Error occurred while grabbing custom_content", "message": str(e), "traceback": traceback.format_exc()}))
            throwErrorMessage = True
        
        # debug.append("Stage 7 Time Check:" + str(time.time() - start_time) )
        # try:
        #     kvstore_output = getKVStore('data_inventory_eventtypes')
        #     for i in kvstore_output:
        #         eventtypes_data_status[i['eventtypeId']] = i['status']
        #         if "coverage_level" in i and i["coverage_level"] != "" and i['status'] == "complete":
        #             eventtypes_coverage_level[i['eventtypeId']] = i['coverage_level']
        # except Exception as e:
        #     debug.append(json.dumps({"status": "ERROR", "description": "Error occurred while grabbing data_inventory_eventtypes", "message": str(e), "traceback": traceback.format_exc()}))
        #     throwErrorMessage = True
        
            
        debug.append("Stage 8 Time Check:" + str(time.time() - start_time) )
        try:
            # Now to grab files off the filesystem
            for myApp in myApps:                
                # Getting Showcaseinfo using pullJSON endpoint
                try:
                    # Getting configurations
                    url = base_url + '/services/pullJSON?config=showcaseinfo&locale=' + desired_locale
                    request = six.moves.urllib.request.Request(url,
                        headers = { 'Authorization': ('Splunk %s' % sessionKey)})
                    search_results = six.moves.urllib.request.urlopen(request)

                    data = json.loads(search_results.read())
                    
                except Exception as e:
                    debug.append(json.dumps({"status": "ERROR", "description": "Error occurred while grabbing mitre attack", "url": url, "message": str(e), "traceback": traceback.format_exc()}))
                    throwErrorMessage = True
                
                if "summaries" not in globalSourceList:
                    globalSourceList = data 
                else:
                    for summaryName in data['summaries']:
                        if summaryName not in globalSourceList['summaries']:
                            data['summaries'][summaryName]['channel'] = "Splunk_Security_Essentials"
                            data['summaries'][summaryName]['showcaseId'] = summaryName
                            globalSourceList['summaries'][summaryName] = data['summaries'][summaryName]
                            globalSourceList['roles']['default']['summaries'].append(summaryName)
        except Exception as e:
                debug.append(json.dumps({"status": "ERROR", "description": "Fatal Error grabbing ShowcaseInfo", "message": str(e), "traceback": traceback.format_exc()}))
                throwErrorMessage = True

        debug.append("Stage 9 Time Check:" + str(time.time() - start_time) )
        try: 
            # debug.append("# of summaries: " + str(len(globalSourceList['roles']['default']['summaries'])))
            mitre_helper = False
            from MitreAttackHelper import MitreAttackHelper
            for content in custom_content:
                showcase = json.loads(content['json'])
                if "create_data_inventory" in showcase: 
                    showcase["data_source_categories"] = "VendorSpecific-" + content['channel']
                showcase['custom_user'] = content['user']
                showcase['custom_time'] = content['_time']
                showcase['includeSSE'] = "Yes"
                if "search" in showcase and showcase["search"] != "" and "hasSearch" not in showcase:
                    showcase['hasSearch'] = "Yes"
                showcase['channel'] = content['channel']
                if content['channel'] in channel_to_name:
                    showcase['displayapp'] = channel_to_name[content['channel']]
                    showcase['app'] = content['channel']
                elif content['channel'].startswith('custom_'):
                    showcase['displayapp'] = content['channel'].split("_")[1]
                    showcase['app'] = 'custom'
                    showcase['channel'] = 'custom'
                else:
                    showcase['displayapp'] = content['channel']
                    showcase['app'] = content['channel']
                if 'icon' not in showcase or showcase['icon'] == "" and content['channel'].startswith('custom_') and content['channel'].split('custom_')[1][0].isalpha():
                    showcase['icon'] = showcase['displayapp'][0].lower()+".png"
                elif 'icon' not in showcase or showcase['icon'] == "" or showcase['icon'] == ".png":
                    showcase['icon'] = "custom_content.png"
                if 'showcaseId' in content and content['showcaseId'] != "" and 'dashboard' not in showcase or showcase['dashboard'] == "":
                    showcase['dashboard'] = "showcase_custom?showcaseId=" + content['showcaseId']
                if("mitre_technique" in showcase):
                    # Add mitre enrichment
                    if not mitre_helper:
                        mitre_helper = MitreAttackHelper(sessionKey)
                    showcase = mitre_helper.addMitreEnrichment(showcase)
                globalSourceList['roles']['default']['summaries'].append(content['showcaseId'])
                globalSourceList['summaries'][content['showcaseId']] = showcase
                debug.append("# of summaries: " + str(len(globalSourceList['roles']['default']['summaries'])))
            # debug.append("# of summaries: " + str(len(globalSourceList['roles']['default']['summaries'])))
        except Exception as e:
            debug.append(json.dumps({"status": "ERROR", "description": "Error occurred while enriching with custom content", "message": str(e), "traceback": traceback.format_exc()}))
            throwErrorMessage = True
        
        debug.append("Stage 10 Time Check:" + str(time.time() - start_time) )

        try:
            # Getting configurations
            url = base_url + '/services/pullJSON?config=data_inventory'
            request = six.moves.urllib.request.Request(url,
                headers = { 'Authorization': ('Splunk %s' % sessionKey)})
            search_results = six.moves.urllib.request.urlopen(request)

            data_inventory = json.loads(search_results.read())
            for datasource in data_inventory:
                eventtype_names[datasource] = data_inventory[datasource]['name']
                for eventtype in data_inventory[datasource]['eventtypes']:
                    dsc_to_ds_name[eventtype] = data_inventory[datasource]['name'] 
                    eventtype_names[eventtype] = data_inventory[datasource]['eventtypes'][eventtype]['name']
                    if "legacy_name" in data_inventory[datasource]['eventtypes'][eventtype]:
                        eventtype_to_legacy_names[eventtype] = data_inventory[datasource]['eventtypes'][eventtype]["legacy_name"]
        except Exception as e:
            debug.append(json.dumps({"status": "ERROR", "description": "Error grabbing data_inventory.json", "message": str(e), "traceback": traceback.format_exc()}))
            throwErrorMessage = True

        debug.append("Stage 11 Time Check:" + str(time.time() - start_time) )

        try:
            myAssistants = ["showcase_first_seen_demo", "showcase_standard_deviation", "showcase_simple_search"]
            for assistant in myAssistants:
                with open(os.environ['SPLUNK_HOME'] + "/etc/apps/" + myApps[0] + "/appserver/static/components/data/sampleSearches/" + assistant + ".json") as f:
                    data = json.load(f)
                    globalSearchList.update(data)
        except Exception as e:
            debug.append(json.dumps({"status": "ERROR", "description": "Error grabbing showcase JSONs", "message": str(e), "traceback": traceback.format_exc()}))
            throwErrorMessage = True

        debug.append("Stage 12 Time Check:" + str(time.time() - start_time) )
   

        debug.append("Stage 13 Time Check:" + str(time.time() - start_time) )
        try:
            # Now we clear out any invalid characters in IDs and names
            keys = list(globalSourceList['summaries'].keys())
            debug.append("Debug Starting")
            for summaryName in keys:
                m = re.search("[^a-zA-Z0-9_]", summaryName)
                if m:
                    newSummaryName = re.sub(r"[^a-zA-Z0-9_\-]", "", summaryName)
                    globalSourceList['summaries'][newSummaryName] = globalSourceList['summaries'].pop(summaryName)
                    index = globalSourceList['roles']['default']['summaries'].index(summaryName)
                    globalSourceList['roles']['default']['summaries'][index] = newSummaryName
            
            for summaryName in globalSourceList['summaries']:    
                regex = r"\&[a-zA-Z0-9#]{2,10};"
                m = re.search(regex, globalSourceList['summaries'][summaryName]['name'])
                if m:
                    newName = re.sub(regex, "", globalSourceList['summaries'][summaryName]['name'])
                    globalSourceList['summaries'][summaryName]['name'] = newName
                # elif "Allowed" in globalSourceList['summaries'][summaryName]['name']:
                    # debug.append("NO NAME match " + globalSourceList['summaries'][summaryName]['name'])
        except Exception as e:
            debug.append(json.dumps({"status": "ERROR", "description": "Error Clearing!", "message": str(e), "traceback": traceback.format_exc()}))
            throwErrorMessage = True

        debug.append("Stage 14 Time Check:" + str(time.time() - start_time) )
        try:
            # Now we do enrichment and processing
            for summaryName in globalSourceList['summaries']:
                # Define all the defaults for enrichment
                globalSourceList['summaries'][summaryName]["id"] = summaryName
                globalSourceList['summaries'][summaryName]['enabled'] = "No"
                globalSourceList['summaries'][summaryName]["data_available"] = "Unknown"
                globalSourceList['summaries'][summaryName]["data_available_numeric"] = ""
        except Exception as e:
            debug.append(json.dumps({"status": "ERROR", "description": "Error setting the defaults for all enrichment", "message": str(e), "traceback": traceback.format_exc()}))
            throwErrorMessage = True

        debug.append("Stage 14.5 Time Check:" + str(time.time() - start_time) )
        try:
            # Now we do enrichment and processing
            for summaryName in globalSourceList['summaries']:
                # Define all the defaults for enrichment
                if globalSourceList['summaries'][summaryName]["displayapp"] == "Enterprise Security Content Update":
                    if "searchKeywords" in globalSourceList['summaries'][summaryName]:
                        globalSourceList['summaries'][summaryName]["searchKeywords"] += " ESCU"
                    else:
                        globalSourceList['summaries'][summaryName]["searchKeywords"] = "ESCU"
                elif globalSourceList['summaries'][summaryName]["displayapp"] == "Splunk Security Essentials":
                    if "searchKeywords" in globalSourceList['summaries'][summaryName]:
                        globalSourceList['summaries'][summaryName]["searchKeywords"] += " SSE"
                    else:
                        globalSourceList['summaries'][summaryName]["searchKeywords"] = "SSE"
                elif globalSourceList['summaries'][summaryName]["displayapp"] == "Splunk Enterprise Security":
                    if "searchKeywords" in globalSourceList['summaries'][summaryName]:
                        globalSourceList['summaries'][summaryName]["searchKeywords"] += " ES"
                    else:
                        globalSourceList['summaries'][summaryName]["searchKeywords"] = "ES"
                elif globalSourceList['summaries'][summaryName]["displayapp"] == "Splunk User Behavior Analytics":
                    if "AT" in summaryName:
                        if "advancedtags" in globalSourceList['summaries'][summaryName]:
                            globalSourceList['summaries'][summaryName]["advancedtags"] += "|UBA Anomaly"
                        else: 
                            globalSourceList['summaries'][summaryName]["advancedtags"] = "UBA Anomaly"
                        if "searchKeywords" in globalSourceList['summaries'][summaryName]:
                            globalSourceList['summaries'][summaryName]["searchKeywords"] += " Anomaly"
                        else:
                            globalSourceList['summaries'][summaryName]["searchKeywords"] = "Anomaly"
                    elif "TT" in summaryName:
                        if "advancedtags" in globalSourceList['summaries'][summaryName]:
                            globalSourceList['summaries'][summaryName]["advancedtags"] += "|UBA Threat"
                        else: 
                            globalSourceList['summaries'][summaryName]["advancedtags"] = "UBA Threat"
                        if "searchKeywords" in globalSourceList['summaries'][summaryName]:
                            globalSourceList['summaries'][summaryName]["searchKeywords"] += " Threat"
                        else:
                            globalSourceList['summaries'][summaryName]["searchKeywords"] = "Threat"
        except Exception as e:
            debug.append(json.dumps({"status": "ERROR", "description": "Error adding in the UBA Threat and Anomaly", "message": str(e), "traceback": traceback.format_exc()}))
            throwErrorMessage = True


        debug.append("Stage 15 Time Check:" + str(time.time() - start_time) )
        try:
            # Now we do enrichment and processing
            for summaryName in globalSourceList['summaries']:

                # Handle bookmark status
                if summaryName in bookmarks:
                    globalSourceList['summaries'][summaryName]['bookmark_status'] = bookmarks[summaryName]['status']
                    if "user" in bookmarks[summaryName]:
                        globalSourceList['summaries'][summaryName]['bookmark_user'] = bookmarks[summaryName]['user']
                    else: 
                        globalSourceList['summaries'][summaryName]['bookmark_user'] = "none"
                    if "notes" in bookmarks[summaryName] and bookmarks[summaryName]['notes'] != "":
                        globalSourceList['summaries'][summaryName]['bookmark_notes'] = bookmarks[summaryName]['notes']
                    else: 
                        globalSourceList['summaries'][summaryName]['bookmark_notes'] = "None"
                    if globalSourceList['summaries'][summaryName]['bookmark_status'] in bookmark_display_names:
                        globalSourceList['summaries'][summaryName]['bookmark_status_display'] = bookmark_display_names[globalSourceList['summaries'][summaryName]['bookmark_status']]
                    else:
                        globalSourceList['summaries'][summaryName]['bookmark_status_display'] = globalSourceList['summaries'][summaryName]['bookmark_status']
                
                    if globalSourceList['summaries'][summaryName]['bookmark_status'] == "successfullyImplemented":
                        globalSourceList['summaries'][summaryName]['enabled'] = "Yes"
                else:
                    globalSourceList['summaries'][summaryName]['bookmark_status'] = "none"
                    globalSourceList['summaries'][summaryName]['bookmark_status_display'] = "Not Bookmarked"
                    globalSourceList['summaries'][summaryName]['bookmark_notes'] = "None"
        except Exception as e:
            debug.append(json.dumps({"status": "ERROR", "description": "Error during bookmark enrichment", "message": str(e), "traceback": traceback.format_exc()}))
            throwErrorMessage = True

        debug.append("Stage 16 Time Check:" + str(time.time() - start_time) )
        try:
            for summaryName in globalSourceList['summaries']:
                # Enrich examples with the example data
                if "examples" in globalSourceList['summaries'][summaryName] and len(globalSourceList['summaries'][summaryName]['examples']) > 0:
                    for i in range(0, len(globalSourceList['summaries'][summaryName]['examples'])):
                        if globalSourceList['summaries'][summaryName]['examples'][i]['name'] in globalSearchList:
                            globalSourceList['summaries'][summaryName]['examples'][i]['showcase'] = globalSearchList[globalSourceList['summaries'][summaryName]['examples'][i]['name']]

        except Exception as e:
            debug.append(json.dumps({"status": "ERROR", "description": "Error during actual search enrichment", "message": str(e), "traceback": traceback.format_exc()}))
            throwErrorMessage = True

        debug.append("Stage 17 Time Check:" + str(time.time() - start_time) )

        try:
            for summaryName in globalSourceList['summaries']:
                globalSourceList['summaries'][summaryName]['search_title'] = []
                # Enrich examples with the example data
                if summaryName in search_mappings:
                    for i in range(0, len(search_mappings[summaryName])):
                        globalSourceList['summaries'][summaryName]['search_title'].append(search_mappings[summaryName][i])
                globalSourceList['summaries'][summaryName]["search_title"] = "|".join( set(globalSourceList['summaries'][summaryName]["search_title"]) )
                if len(globalSourceList['summaries'][summaryName]["search_title"])>0:
                    globalSourceList['summaries'][summaryName]["hasContentMapping"] = "Yes"
            
        except Exception as e:
            debug.append(json.dumps({"status": "ERROR", "description": "Error during search mapping enrichment", "message": str(e), "traceback": traceback.format_exc()}))
            throwErrorMessage = True

        debug.append("Stage 18 Time Check:" + str(time.time() - start_time) )
        try:
            for summaryName in globalSourceList['summaries']:           
                globalSourceList['summaries'][summaryName]['productId'] = ""     
                # eventtypes_data_status
                if "data_source_categories" in globalSourceList['summaries'][summaryName]:
                    eventtypes = globalSourceList['summaries'][summaryName]['data_source_categories'].split("|")
                    eventtype_display = []
                    datasources = []
                    productIds = []
                    productNames = []
                    eventtype_data = []
                    da_score = 0
                    da_score_count = 0
                    for eventtype in eventtypes:
                        if eventtype in dsc_to_da_scores:
                            # debug.append({"msg": "Adding..", "summary": summaryName,  "dsc": eventtype, "scores": dsc_to_da_scores[eventtype]})
                            for score in dsc_to_da_scores[eventtype]:
                                da_score += score
                                da_score_count += 1
                        if eventtype in dsc_to_productIds:
                            products = dsc_to_productIds[eventtype].split("|")
                            for product in products:
                                productIds.append(product)
                                if product in product_details:
                                    if product_details[ product ]['productName'] != "":
                                        productNames.append( product_details[ product ]['vendorName'] + " - " + product_details[ product ]['productName'] )
                                    else:
                                        productNames.append( product_details[ product ]['vendorName'])
                        if eventtype in eventtype_names:
                            eventtype_display.append( eventtype_names[eventtype] )
                            if eventtype in eventtype_to_legacy_names:
                                datasources += eventtype_to_legacy_names[eventtype].split("|")
                            else:
                                datasources += dsc_to_ds_name[eventtype].split("|")
                        # if eventtype in eventtypes_coverage_level and eventtypes_coverage_level[eventtype] != "unknown":
                        #     eventtype_data.append(eventtypes_coverage_level[eventtype])
                        # elif eventtype in eventtypes_data_status and eventtypes_data_status[eventtype] != "unknown":
                        #     if isinstance(eventtypes_data_status[eventtype], str) or isinstance(eventtypes_data_status[eventtype], basestring):
                        #         if eventtypes_data_status[eventtype] == "success":
                        #             eventtype_data.append(100)
                        #         else:
                        #             eventtype_data.append(0)
                        #     elif isinstance(eventtypes_data_status[eventtype], int):
                        #         eventtype_data.append(eventtypes_data_status[eventtype])
                    # if len(eventtype_data) > 0:
                        # total = 0
                        # for num in eventtype_data:
                        #     total += num
                    if da_score_count > 0:
                        # debug.append({"msg": "analyzing da_Score", "summary": summaryName, "eventtypes": eventtypes, "total": da_score, "count": da_score_count, "avg": round(da_score / da_score_count)})
                        globalSourceList['summaries'][summaryName]["data_available_numeric"] = round(da_score / da_score_count)
                        if globalSourceList['summaries'][summaryName]["data_available_numeric"] >= 20:
                            globalSourceList['summaries'][summaryName]["data_available"] = "Available"
                        else:
                            globalSourceList['summaries'][summaryName]["data_available"] = "Unavailable"
                            globalSourceList['summaries'][summaryName]["data_available_numeric"] = 0
                    else:
                        # debug.append({"msg": "analyzing ZERO da_score_count", "summary": summaryName, "eventtypes": eventtypes, "total": da_score, "count": da_score_count})
                        globalSourceList['summaries'][summaryName]["data_available"] = "Unavailable"
                        globalSourceList['summaries'][summaryName]["data_available_numeric"] = 0
                    # else:
                    #     globalSourceList['summaries'][summaryName]["data_available"] = "Bad"
                    #     globalSourceList['summaries'][summaryName]["data_available_numeric"] = 0
                    
                    globalSourceList['summaries'][summaryName]['data_source_categories_display'] = "|".join( eventtype_display )
                    globalSourceList['summaries'][summaryName]['datasource'] = "|".join( set( datasources ) )
                    if globalSourceList['summaries'][summaryName]['datasource'] == "":
                        globalSourceList['summaries'][summaryName]['datasource'] = "None"
                    globalSourceList['summaries'][summaryName]['productId'] = "|".join( productIds )
                    globalSourceList['summaries'][summaryName]['product'] = "|".join( productNames )

                # globalSourceList['summaries'][summaryName]['data_source_categories'] = globalSourceList['summaries'][summaryName]['data_source_categories']
                # globalSourceList['summaries'][summaryName]['data_source_categories_display'] = globalSourceList['summaries'][summaryName]['data_source_categories_display']
                # Probably this should be disabled...
                # if summaryName in kvstore_data_status:
                #   globalSourceList['summaries'][summaryName]['data_available'] = kvstore_data_status[summaryName]
                
                # Check if data is inSplunk=no
                if "inSplunk" in globalSourceList['summaries'][summaryName]:
                    inSplunk = globalSourceList['summaries'][summaryName]['inSplunk']
                    if inSplunk.lower() == "no":
                        globalSourceList['summaries'][summaryName]["data_available"] = "Available"
                        globalSourceList['summaries'][summaryName]["data_available_numeric"] = 100


        except Exception as e:
            debug.append(json.dumps({"status": "ERROR", "description": "Error during Data Availability Enrichment", "message": str(e), "traceback": traceback.format_exc()}))
            throwErrorMessage = True

        debug.append("Stage 19 Time Check:" + str(time.time() - start_time) )
            

        debug.append("Stage 20 Time Check:" + str(time.time() - start_time) )
        try:
            # Now we default anything that needs to be defaulted
            provide_No_Fields = ["hasSearch","hasContentMapping","soarPlaybookAvailable"]
            provide_NA_Fields = ["data_source_categories", "data_source_categories_display"]
            provide_none_Fields = []
            provide_Other_Fields = ["category"]
            provide_Empty_String_Fields = ["mitre_techniques_avg_group_popularity"]
            provide_zero_String_Fields = []
            ensure_no_null_fields = ["custom_time", "custom_user","printable_image"]
            provide_Uppercasenone_Fields = ["killchain", "mitre_id", "mitre", "mitre_tactic", "mitre_technique", "mitre_sub_technique", "mitre_id_combined", "mitre_tactic_display", "mitre_technique_display", "mitre_sub_technique_display","mitre_technique_combined","mitre_threat_groups","mitre_software","mitre_matrix","mitre_platforms","category", "SPLEase","domain","datamodel","analytic_story","industryMapping","escu_nist","escu_cis"]

            for summaryName in globalSourceList['summaries']:
                if "channel" not in globalSourceList['summaries'][summaryName] or globalSourceList['summaries'][summaryName]['channel'] == "":
                    if "app" in globalSourceList['summaries'][summaryName]:
                        globalSourceList['summaries'][summaryName]['channel'] = globalSourceList['summaries'][summaryName]['app']
                    else:
                        globalSourceList['summaries'][summaryName]['channel'] = "Unknown"

                for field in provide_NA_Fields:
                    if (field not in globalSourceList['summaries'][summaryName] or globalSourceList['summaries'][summaryName][field] is None or globalSourceList['summaries'][summaryName][field] == "") and field in provide_NA_Fields:
                        globalSourceList['summaries'][summaryName][field] = "N/A"

                for field in provide_No_Fields:
                    if (field not in globalSourceList['summaries'][summaryName] or globalSourceList['summaries'][summaryName][field] is None or globalSourceList['summaries'][summaryName][field] == "") and field in provide_No_Fields:
                        globalSourceList['summaries'][summaryName][field] = "No"

                for field in provide_Empty_String_Fields:
                    if (field not in globalSourceList['summaries'][summaryName] or globalSourceList['summaries'][summaryName][field] is None or globalSourceList['summaries'][summaryName][field] == "") and field in provide_Empty_String_Fields:
                        globalSourceList['summaries'][summaryName][field] = ""

                for field in provide_zero_String_Fields:
                    if (field not in globalSourceList['summaries'][summaryName] or globalSourceList['summaries'][summaryName][field] is None or globalSourceList['summaries'][summaryName][field] == ""):
                        globalSourceList['summaries'][summaryName][field] = 0

                for field in provide_none_Fields:
                    if (field not in globalSourceList['summaries'][summaryName] or globalSourceList['summaries'][summaryName][field] is None or globalSourceList['summaries'][summaryName][field] == "") and field in provide_none_Fields:
                        globalSourceList['summaries'][summaryName][field] = "none"

                for field in provide_Other_Fields:
                    if (field not in globalSourceList['summaries'][summaryName] or globalSourceList['summaries'][summaryName][field] is None or globalSourceList['summaries'][summaryName][field] == "") and field in provide_Other_Fields:
                        globalSourceList['summaries'][summaryName][field] = "Other"

                for field in provide_Uppercasenone_Fields:
                    if (field not in globalSourceList['summaries'][summaryName] or globalSourceList['summaries'][summaryName][field] is None or globalSourceList['summaries'][summaryName][field] == "") and field in provide_Uppercasenone_Fields:
                        globalSourceList['summaries'][summaryName][field] = "None"
                    elif field=="mitre_platforms":
                        new_mitre_platforms = "|".join([globalSourceList['summaries'][summaryName]["mitre_platforms"]] + ["Enterprise"])
                        globalSourceList['summaries'][summaryName][field] = new_mitre_platforms

                # for field in ensure_no_null_fields:
                #     if (field not in globalSourceList['summaries'][summaryName] or globalSourceList['summaries'][summaryName][field] == "") and field in ensure_no_null_fields:
                #         globalSourceList['summaries'][summaryName][field] = ""


        except Exception as e:
            debug.append(json.dumps({"status": "ERROR", "description": "Error while defaulting", "message": str(e), "traceback": traceback.format_exc()}))
            throwErrorMessage = True

        debug.append("Stage 21 Time Check:" + str(time.time() - start_time) )
        try:
            # Clear out excluded content
            keys = list(globalSourceList['summaries'].keys())
            for summaryName in keys:
                if "includeSSE" not in globalSourceList['summaries'][summaryName] or globalSourceList['summaries'][summaryName]["includeSSE"].lower() != "yes":
                    globalSourceList['summaries'].pop(summaryName)
                elif ignore_channel_exclusion == False and "channel" in globalSourceList['summaries'][summaryName] and globalSourceList['summaries'][summaryName]['channel'] in channel_exclusion and channel_exclusion[ globalSourceList['summaries'][summaryName]['channel'] ]:
                    globalSourceList['summaries'].pop(summaryName)
                    # if summaryName in globalSourceList['roles']['default']['summaries']:
                    #     globalSourceList['roles']['default']['summaries'].remove(summaryName)
            globalSourceList['roles']['default']['summaries'] = list(globalSourceList['summaries'].keys())
            # Now ignoring the roles default summaries in the actual json -- everything is driven by includeSSE
        except Exception as e:
            debug.append(json.dumps({"status": "ERROR", "description": "Error pulling excluded content", "message": str(e), "traceback": traceback.format_exc()}))
            throwErrorMessage = True
        globalSourceList['debug'] = debug
        globalSourceList['throwError'] = throwErrorMessage

        debug.append("Stage 22 Time Check:" + str(time.time() - start_time) )


        try:
            fields = ["search_title", "mitre_id", "mitre_technique_combined", "mitre_sub_technique_combined", "mitre_tactic_combined", "killchain", "name", "category", "analytic_story"]
            kvstore_output = getKVStore("sse_content_exported")
            collection = service.kvstore['sse_content_exported']
            for summaryName in globalSourceList['summaries']:
                if "search_title" in globalSourceList['summaries'][summaryName] and globalSourceList['summaries'][summaryName]["search_title"] != "":
                    record = {
                        "_key": summaryName,
                        "summaryId": summaryName
                    }
                    for field in fields:
                        if field == "mitre_technique_combined":
                            mitres = globalSourceList['summaries'][summaryName]["mitre_technique"].split("|")
                            record["mitre_technique"] = []
                            record["mitre_technique_combined"] = []
                            record["mitre_technique_description"] = []
                            for mitre in mitres:
                                if mitre != "":
                                    record["mitre_technique"].append(mitre)
                                if mitre in mitre_names['attack']:
                                    record["mitre_technique_combined"].append(mitre + " - " + mitre_names['attack'][mitre])    
                                # elif mitre in mitre_names['preattack']:
                                #     record["mitre_technique_combined"].append(mitre + " - " + mitre_names['preattack'][mitre])    
                                if mitre in mitre_technique_descriptions:
                                    record["mitre_technique_description"].append( mitre_technique_descriptions[mitre] )
                        elif field == "mitre_sub_technique_combined":
                            mitres = globalSourceList['summaries'][summaryName]["mitre_sub_technique"].split("|")
                            record["mitre_sub_technique"] = []
                            record["mitre_sub_technique_combined"] = []
                            record["mitre_sub_technique_description"] = []
                            for mitre in mitres:
                                if mitre != "":
                                    record["mitre_sub_technique"].append(mitre)
                                if mitre in mitre_names['attack']:
                                    record["mitre_sub_technique_combined"].append(mitre + " - " + mitre_names['attack'][mitre])
                        elif field == "mitre_tactic_combined":
                            mitres = globalSourceList['summaries'][summaryName]["mitre_tactic"].split("|")
                            record["mitre_tactic"] = []
                            record["mitre_tactic_combined"] = []
                            record["mitre_tactic_display"] = []
                            for mitre in mitres:
                                if mitre != "":
                                    record["mitre_tactic"].append(mitre)
                                if mitre in mitre_names['attack']:
                                    record["mitre_tactic_combined"].append(mitre + " - " + mitre_names['attack'][mitre])
                                    record["mitre_tactic_display"].append(mitre_names['attack'][mitre])    
                                # elif mitre in mitre_names['preattack']:
                                #     record["mitre_tactic_combined"].append(mitre + " - " + mitre_names['preattack'][mitre])   
                        elif field == "mitre_id":
                            mitres = globalSourceList['summaries'][summaryName]["mitre_id"].split("|")
                            record["mitre_id"] = []
                            record["mitre_display"] = []
                            record["mitre_description"] = []
                            for mitre in mitres:
                                if mitre != "":
                                    record["mitre_id"].append(mitre)
                                if mitre in mitre_names['attack']:
                                    record["mitre_display"].append(mitre_names['attack'][mitre])    
                                if mitre in mitre_technique_descriptions:
                                    record["mitre_description"].append( mitre_technique_descriptions[mitre] ) 
                        elif field == "name":
                            record["summaryName"] = globalSourceList['summaries'][summaryName][field]
                        elif field == "search_title":
                            search_titles = globalSourceList['summaries'][summaryName]["search_title"].split("|")
                            record["search_title"] = []
                            for search_title in search_titles:
                                if search_title != "":
                                    record["search_title"].append(search_title)
                        elif field == "category":
                            categories = globalSourceList['summaries'][summaryName]["category"].split("|")
                            record["category"] = []
                            for category in categories:
                                if category != "":
                                    record["category"].append(category)
                        elif field == "killchain":
                            killchains = globalSourceList['summaries'][summaryName]["killchain"].split("|")
                            record["killchain"] = []
                            for killchain in killchains:
                                if killchain != "":
                                    record["killchain"].append(killchain)
                        elif field == "analytic_story":
                            analytic_stories = globalSourceList['summaries'][summaryName]["analytic_story"].split("|")
                            record["analytic_story"] = []
                            for analytic_story in analytic_stories:
                                if (analytic_story != "" and analytic_story != "None"):
                                    record["analytic_story"].append(analytic_story)
                        elif field in globalSourceList['summaries'][summaryName]:
                            record[field] = globalSourceList['summaries'][summaryName][field]
                    should = "insert"
                    for row in kvstore_output:
                        if row['_key'] == record['_key']:
                            should = "update"
                            if '_user' in row:
                                del row['_user']
                            if json.dumps(row, sort_keys=True) == json.dumps(record, sort_keys=True):
                                should = "pass"
                            # debug.append({"msg": "Checking exported", "showcase": summaryName, "timecheck": str(time.time() - start_time), "should": should, "row": json.dumps(row, sort_keys=True), "record": json.dumps(record, sort_keys=True)})
                    
                    try:
                        if should == "update":
                            collection.data.update(summaryName, json.dumps(record))
                        elif should == "insert":
                            collection.data.insert(json.dumps(record))
                    except Exception as e:
                        debug.append(json.dumps({"status": "ERROR", "description": "Couldn't add content into the kvstore built for ES Integration.", "insert_message": str(e), "update_message": str(update_e)}))
        except Exception as e:
            debug.append(json.dumps({"status": "ERROR", "description": "Couldn't handle the kvstore built for ES Integration.", "message": str(e), "traceback": traceback.format_exc()}))
            throwErrorMessage = True

        debug.append("Stage 23 Time Check:" + str(time.time() - start_time) )

        # debug.append({"msg": "Here's the dsc_to_scores", "values": dsc_to_da_scores})



        # ## Disabling Caching because it's not enough of a performance benefit
        # ## (Discovered that time to download was the real problem, not time to gen the showcase)
        # try: 
        #     collection = service.kvstore['sse_json_doc_storage']
        # except Exception as e: 
        #     debug.append(json.dumps({"status": "ERROR", "description": "Couldn't establish the kvstore collection... expect more errors.", "message": str(e), "traceback": traceback.format_exc()}))

        # try:
        #     record = {
        #         "_key": "sseshowcase" + desired_locale,
        #         "description": "Cached version of SSE Showcase",
        #         "version": "Not Applicable",
        #         "json": json.dumps(globalSourceList)
        #     }
            
        #     collection.data.update("sseshowcase" + desired_locale, json.dumps(record))
        #     if caching == "updateonly":
        #         return {'payload': {"update": "successful"},  
        #                 'status': 200          # HTTP status code
        #         }
        # except Exception as initial:
        #     try:
        #         collection.data.insert(json.dumps(record))
        #         if caching == "updateonly":
        #             return {'payload': {"update": "successful"},  
        #                     'status': 200          # HTTP status code
        #             }
        #     except Exception as e:
        #         debug.append(json.dumps({"status": "ERROR", "description": "Error occurred while updating sseshowcase", "message": str(e), "traceback": traceback.format_exc()}))
        #         throwErrorMessage = True
        #         try:
        #             total_url = base_url + '/servicesNS/nobody/' + app + "/storage/collections/data/sse_json_doc_storage/" + "sseshowcase" + desired_locale
        #             debug.append({"status": "Failed to update the kvstore via the python sdk, deleting the cache because we can't be trusted.", "url": total_url})
        #             headers = {
        #             'Authorization': ('Splunk %s' % sessionKey)
        #             }
        #             opener = urllib2.build_opener(urllib2.HTTPHandler)
        #             req = urllib2.Request(total_url, None, headers)
        #             req.get_method = lambda: 'DELETE'  # creates the delete method
        #             url = urllib2.urlopen(req)  # deletes database item
        #         except Exception as e: 
        #             if str(e) != "HTTP Error 404: Not Found":
        #                 debug.append(json.dumps({"status": "ERROR", "description": "Error, we couldn't even delete the kvstore entry! What a sad day.", "message": str(e), "traceback": traceback.format_exc()}))
        #                 throwErrorMessage = True
        #             else:
        #                 debug.append(json.dumps({"status": "WARN", "description": "We weren't the first ones here. No cache existed.", "message": ""}))
        
        debug.append("Stage 24 Time Check:" + str(time.time() - start_time) )
        try:
            if field_list_version == "mini":
                del globalSourceList['escu_stories']
                for summaryName in globalSourceList['summaries']:
                    for key in list(globalSourceList['summaries'][summaryName].keys()):
                        if key not in mini_fields:
                            del globalSourceList['summaries'][summaryName][key]
                try:
                    showcase_info_file = open(pathToShowcaseInfoMini+"ShowcaseInfoMini.json", "w")
                    if showcase_info_file.writable():
                        showcase_info_file.write(json.dumps(globalSourceList))
                        showcase_info_file.close()
                except Exception as e:
                        logger.error("Error: ", str(e))  
        except Exception as e:
            debug.append(json.dumps({"status": "ERROR", "description": "Error while minifying", "message": str(e), "traceback": traceback.format_exc()}))

        
        debug.append("Stage 25 Time Check:" + str(time.time() - start_time) )
        
        return {'payload': globalSourceList,  
                'status': 200,          # HTTP status code
                'debug': debug
        }
