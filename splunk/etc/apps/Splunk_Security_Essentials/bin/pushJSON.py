
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
import six.moves.urllib.request, six.moves.urllib.parse, six.moves.urllib.error, six.moves.urllib.request, six.moves.urllib.error
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
app = 'Splunk_Security_Essentials'
sys.path.append(splunk_home + '/etc/apps/' + app + '/bin/')
sys.path.append(splunk_home + '/etc/apps/' + app + '/bin/splunklib/')

# import logging as logger
# logger.basicConfig(filename=splunk_home + '/var/log/pushJSON.log', level=logger.DEBUG)

import splunklib.client as client


class pushJSON(PersistentServerConnectionApplication):
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

    def isNotBlank(myString):
        return bool(myString and myString.strip())       

    def handle(self, in_string):

        input = {}
        payload = {}
        app = "Splunk_Security_Essentials"
        valid_config_files = self.config_map
        desired_config = ""
        valid_locales = ["ja-JP", "en-DEBUG"]
        desired_locale = ""
        path = ""
        jsonData = ""
        requestJSON = {}
        shouldCompress = False

        try: 
            input = json.loads(in_string)
            sessionKey = input['session']['authtoken']
            owner = input['session']['user']

            # logger.debug('Incoming data %s', input)
            
            if "payload" in input:
                payload = json.loads(input["payload"])
                payload['json'] = six.moves.urllib.parse.unquote(payload['json'])
                jsonData = payload['json']

                if "compression" in payload:
                    shouldCompress = payload["compression"]

                if "app" in payload:
                        app = payload["app"]
                elif "config" in payload:
                    if payload["config"] in valid_config_files:
                        desired_config = payload["config"]
                elif "locale" in payload:
                    if payload["locale"] in valid_locales:
                        desired_locale = "." + payload["locale"]
                    
                        
            elif "query" in input:
                # logger.debug('Going in query')
                for pair in input['query']:
                    if pair[0] == "app":
                        app = pair[1]
                    elif pair[0] == "config":
                        if pair[1] in valid_config_files:
                            desired_config = pair[1]
                    elif pair[0] == "locale":
                        if pair[1] in valid_locales:
                            desired_locale = "." + pair[1]
        except Exception as e:
            # logger.error(e)
            return {'payload': {"response": "Error! Couldn't find any initial input. This shouldn't happen."},
                    'status': 500          # HTTP status code
            }

        if desired_config=="":
            return {'payload': {"response": "Error! No valid configuration specified. Should be passed with ?config=config (to grab the config object)."},
                    'status': 500          # HTTP status code
            }
        
        if not hasattr(jsonData, "strip"):
            return {'payload': {"response": "Error! Not valid data passed.","jsonData":jsonData},
                    'status': 500          # HTTP status code
            }

        try:
            requestJSON = payload.copy()
            requestJSON.pop('config')
            if shouldCompress:
                # Let's compress the data
                compressedValue = gzip.compress(bytes(jsonData, 'utf-8'))

                # Create final request json to import in kvstore
                requestJSON.pop('json')            
                requestJSON["json"] = str(compressedValue, 'latin-1')
                
                # Storing string is causing an issue while retrieving the data
                # And if we store data as bytes array then it causes size issue at the DB side.
                # requestJSON["json"] = list(compressedValue)
        except Exception as e:
            throwErrorMessage = True

        try:
            # Getting configurations
            mgmtHostname, mgmtHostPort = getConfKeyValue('web', 'settings', 'mgmtHostPort').split(":")
            base_url = "https://" + mgmtHostname + ":" + mgmtHostPort
        except Exception as e:
            # debug.append(json.dumps({"status": "ERROR", "description": "Error getting the base_url configuration!", "message": str(e)}))
            throwErrorMessage = True

        try:

            try:
                # Getting configurations
                mgmtHostname, mgmtHostPort = getConfKeyValue('web', 'settings', 'mgmtHostPort').split(":")
                base_url = "https://" + mgmtHostname + ":" + mgmtHostPort
            except Exception as e:
                # debug.append(json.dumps({"status": "ERROR", "description": "Error getting the base_url configuration!", "message": str(e), "traceback": traceback.format_exc()}))
                throwErrorMessage = True

            try: 
                service = client.connect(host=mgmtHostname, port=mgmtHostPort, token=sessionKey)
                service.namespace['owner'] = 'nobody'
                service.namespace['app'] = app
            except Exception as e:
                # debug.append(json.dumps({"status": "ERROR", "description": "Error grabbing a service object", "message": str(e), "traceback": traceback.format_exc()}))
                throwErrorMessage = True

            def getKVStoreById(store, id):
                try:
                    kvstore_output = service.kvstore[store].data.query_by_id(id)
                except:
                    total_url = base_url + '/servicesNS/nobody/' + app + "/storage/collections/data/" + store + "/" + id
                    request = six.moves.urllib.request.Request(total_url,
                        headers = { 'Authorization': ('Splunk %s' % sessionKey)})
                    search_results = six.moves.urllib.request.urlopen(request)
                    kvstore_output = json.loads(search_results.read())
                return kvstore_output
            try:
                # If there is a kvstore config, check and see if the data is in the kvstore
                kvstore_output = getKVStoreById(valid_config_files[desired_config]['kvstore'], valid_config_files[desired_config]['key'])
            except Exception as e:
                status = "eh, I guess we will move on..."
                kvstore_output = {}

            try:
                # Start updating data into kvstore
                collection = service.kvstore['sse_json_doc_storage']
                action =  "insert"  

                if "compression" in kvstore_output:
                    action =  "update"
                elif 'json' in kvstore_output:
                    # Delete entry and enter new data
                    collection.data.delete_by_id(valid_config_files[desired_config]['key'])
                
                if action == "insert":
                    collection.data.insert(json.dumps(requestJSON))
                elif action == "update":
                    collection.data.update(valid_config_files[desired_config]['key'], json.dumps(requestJSON))
            except Exception as e:
                return {'payload': {"section": action+" error", "message": str(e), "path": requestJSON},
                        'status': 500
                }        
        except Exception as e:
            return {'payload': {"section": "one", "message": str(e), "path": path},
                    'status': 500
            }

        return {'payload': {"section": "two", "path": path, "data":requestJSON},  
                'status': 200
        }
        
