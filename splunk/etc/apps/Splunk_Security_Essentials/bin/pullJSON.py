
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



import os
import json 
import six.moves.urllib.request, six.moves.urllib.parse, six.moves.urllib.error, six.moves.urllib.request, six.moves.urllib.error, six.moves.urllib.parse
from io import open
import gzip

from splunk.clilib.cli_common import getConfKeyValue, getConfStanza

if sys.platform == "win32":
    import msvcrt
    # Binary mode is required for persistent mode on Windows.
    msvcrt.setmode(sys.stdin.fileno(), os.O_BINARY)
    msvcrt.setmode(sys.stdout.fileno(), os.O_BINARY)
    msvcrt.setmode(sys.stderr.fileno(), os.O_BINARY)

from splunk.persistconn.application import PersistentServerConnectionApplication

splunk_home = os.getenv('SPLUNK_HOME')
sys.path.append(splunk_home + '/etc/apps/Splunk_Security_Essentials/bin/')
sys.path.append(splunk_home + '/etc/apps/Splunk_Security_Essentials/bin/splunklib/')

import splunklib.client as client

# import logging as logger
# logger.basicConfig(filename=splunk_home + '/var/log/pullJSON.log', level=logger.DEBUG)

class pullJSON(PersistentServerConnectionApplication):
    def __init__(self, command_line, command_arg):
        PersistentServerConnectionApplication.__init__(self)
        self.config_map = {
            "usecases": {"file": "/components/localization/usecases"},
            "data_inventory": {"file": "/components/localization/data_inventory", "specialcustomcontent": "custom_content"},
            "htmlpanels": {"file": "/components/localization/htmlpanels"},
            "sselabels": {"file": "/components/localization/sselabels"},
            "config": {"file": "/components/data/system_config"},
            "showcaseinfo": {"file": "/components/localization/ShowcaseInfo", "kvstore": "sse_json_doc_storage", "key": "showcaseinfo"},
            "mitreattack": {"file": "/vendor/mitre/enterprise-attack", "kvstore": "sse_json_doc_storage", "key": "mitreattack"},
            "mitrepreattack": {"file": "/vendor/mitre/pre-attack", "kvstore": "sse_json_doc_storage", "key": "mitrepreattack"},
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

    def handle(self, in_string):
        input = {}
        payload = {}
        app = "Splunk_Security_Essentials"
        valid_config_files = self.config_map
        desired_config = ""
        valid_locales = ["ja-JP", "en-DEBUG"]
        desired_locale = ""
        path = ""
        try: 
            input = json.loads(in_string)
            # logger.info('Incoming request %s', input)
            sessionKey = input['session']['authtoken']
            owner = input['session']['user']
            if "query" in input:
                for pair in input['query']:
                    if pair[0] == "app":
                        app = pair[1]
                    elif pair[0] == "config":
                        if pair[1] in valid_config_files:
                            desired_config = pair[1]
                    elif pair[0] == "locale":
                        if pair[1] in valid_locales:
                            desired_locale = "." + pair[1]
        except:
            return {'payload': {"response": "Error! Couldn't find any initial input. This shouldn't happen."},
                    'status': 500          # HTTP status code
            }

        if desired_config=="":
            return {'payload': {"response": "Error! No valid configuration specified. Should be passed with ?config=config (to grab the config object)."},
                    'status': 500          # HTTP status code
            }
        
        try:
            # Getting configurations
            mgmtHostname, mgmtHostPort = getConfKeyValue('web', 'settings', 'mgmtHostPort').split(":")
            base_url = "https://" + mgmtHostname + ":" + mgmtHostPort
        except Exception as e:
            # debug.append(json.dumps({"status": "ERROR", "description": "Error getting the base_url configuration!", "message": str(e)}))
            throwErrorMessage = True


        try:
            service = client.connect(host=mgmtHostname, port=mgmtHostPort, token=sessionKey)
            service.namespace['owner'] = 'nobody'
            service.namespace['app'] = 'Splunk_Security_Essentials'
        except Exception as e:
            # debug.append(json.dumps({"status": "ERROR", "description": "Error grabbing a service object", "message": str(e)}))
            throwErrorMessage = True

        def decompressData(data): 
            try:
                if 'compression' in data:
                    isCompressedData = data['compression']
                    # logger.info('IsCompressed -> %s', isCompressedData)
                    if isCompressedData: 
                        data['json'] = gzip.decompress(bytes(list(bytes(data['json'], 'latin-1')))).decode('utf-8')
                        # logger.info('Original data --> %s', data['json'])
                # logger.info('Data after decompression -> %s', data)
                return data
            except Exception as e:
                # logger.error('Failed to decompress %s', e)
                throwErrorMessage = True
        
        def getKVStore(store):
            debug.append({"message": "I got a kvstore request", "store": store})
            try:
                kvstore_output = service.kvstore[store].data.query()
                # logger.info('KVstore try details -->> %s', kvstore_output)
                kvstore_output = decompressData(kvstore_output)
            except Exception as e:
                total_url = base_url + '/servicesNS/nobody/' + app + "/storage/collections/data/" + store
                debug.append({"status": "Failed to do primary method, reverting to old", "url": total_url, "traceback": traceback.format_exc(), "error": str(e)})
                request = six.moves.urllib.request.Request(total_url,
                    headers = { 'Authorization': ('Splunk %s' % sessionKey)})
                search_results = six.moves.urllib.request.urlopen(request)

                kvstore_output = json.loads(search_results.read())
                # logger.info('KVstore catch details -->> %s', kvstore_output)
                kvstore_output = decompressData(kvstore_output)
            return kvstore_output

        def getKVStoreById(store, id):
            try:
                kvstore_output = service.kvstore[store].data.query_by_id(id)
                # logger.info('KVstore try by id details -->> %s', kvstore_output)
                kvstore_output = decompressData(kvstore_output)
            except:
                total_url = base_url + '/servicesNS/nobody/' + app + "/storage/collections/data/" + store + "/" + id
                request = six.moves.urllib.request.Request(total_url,
                    headers = { 'Authorization': ('Splunk %s' % sessionKey)})
                search_results = six.moves.urllib.request.urlopen(request)

                kvstore_output = json.loads(search_results.read())
                # logger.info('KVstore catch by id details -->> %s', kvstore_output)
                kvstore_output = decompressData(kvstore_output)
            return kvstore_output
        try:
            # If there is a kvstore config, check and see if the data is in the kvstore
            if "kvstore" in valid_config_files[desired_config] and 1 == 1:
                kvstore_output = getKVStoreById( valid_config_files[desired_config]['kvstore'], valid_config_files[desired_config]['key'])
                #kvstore_output = service.kvstore[valid_config_files[desired_config]['kvstore']].data.query()
                data = json.loads(kvstore_output['json'])
                if (desired_config=="showcaseinfo"):
                    data['source']=valid_config_files[desired_config]['kvstore']+"/"+valid_config_files[desired_config]['key']
                data['version']=kvstore_output['version']
                return {'payload': data,  
                        'status': 200
                }
        except Exception as e:
                status = "eh, I guess we will move on..."
                #return {'payload': {"message": "Couldn't grab kvstore successfully", "error": str(e)},  
                #         'status': 200
                #}
        try:
            # Now to grab files off the filesystem
            path = os.environ['SPLUNK_HOME'] + "/etc/apps/" + app + "/appserver/static" + valid_config_files[desired_config]['file'] + desired_locale + ".json"
            source = valid_config_files[desired_config]['file'] + desired_locale + ".json"
            if desired_locale != "":
                if not os.path.exists(path):
                    path = os.environ['SPLUNK_HOME'] + "/etc/apps/" + app + "/appserver/static" + valid_config_files[desired_config]['file'] + ".json"
                    source = valid_config_files[desired_config]['file'] + ".json"
            
            with open(path) as f:
                data = json.load(f)
                if (desired_config=="showcaseinfo"):
                    data['source']=source
                debug = []
                # data['debug'] = debug
                debug.append("Testing")
                debug.append(valid_config_files[desired_config])
                try:
                    if "VendorSpecific" in data and "specialcustomcontent" in valid_config_files[desired_config] and 1 == 1:
                        debug.append("We are in it")
                        newTypes = {}
                        kvstore_output = getKVStore( valid_config_files[desired_config]['specialcustomcontent'])
                        debug.append("Got my output")
                        debug.append(kvstore_output)
                        for row in kvstore_output: 
                            debug.append("In the row")
                            customJSON = json.loads(row['json'])
                            debug.append("Looking at...")
                            debug.append(row)
                            if 'create_data_inventory' in customJSON and customJSON['create_data_inventory']:
                                dscid = "VendorSpecific-" + row['channel']
                                baseSearch = "index=NOTAPPLICABLE TERM(No baseSearch Provided)"
                                legacyName = "Unknown Channel: " + row["channel"]
                                shortUnifiedName = "Unknown Channel: " + row["channel"]
                                description = "No Description Provided"
                                commonProductNames = []
                                if "company_description" in customJSON:
                                    description = customJSON['company_description']
                                if "company_name" in customJSON:
                                    legacyName = customJSON['company_name']
                                    shortUnifiedName = customJSON['company_name']
                                    commonProductNames.append(customJSON['company_name'])
                                if "company_base_spl" in customJSON:
                                    baseSearch = customJSON['company_base_spl']
                                if dscid not in newTypes:
                                    newTypes[dscid] = {
                                        "baseSearch": baseSearch,
                                        "legacy_name": legacyName,
                                        "short_unified_name": shortUnifiedName,
                                        "description": description,
                                        "name": legacyName,
                                        "common_product_names": commonProductNames,
                                        "products": {
                                            "cim": {
                                                "basesearch": "index=placeholder",
                                                "errordescription": "...",
                                                "validation": "earliest=-4h | head 100 | stats count",
                                                "name": "Common Information Model"
                                            }
                                        },
                                        "readyForUse": True
                                    }
                        for dscid in newTypes:
                            data['VendorSpecific']['eventtypes'][dscid] = newTypes[dscid]
                except Exception as e:
                    return {'payload': {"section": "one", "message": str(e), "path": path},
                    'status': 500
                    }
                return {'payload': data,
                        'status': 200
                }
        except Exception as e:
            return {'payload': {"section": "one", "message": str(e), "path": path},
                    'status': 404
            }

        return {'payload': {"section": "two", "path": path},  
                'status': 404
        }
        
