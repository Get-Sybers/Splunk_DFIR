
import sys,time
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

from splunk.clilib.cli_common import getConfKeyValue, getConfStanza, getConfStanzas

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

EnableDebug = True
debug = []
import requests
import logging as logger
logger.basicConfig(filename=splunk_home + '/var/log/downloadContentUpdate.log', level=logger.DEBUG)

# import logging as logger
# logger.basicConfig(filename=splunk_home + '/var/log/pullJSON.log', level=logger.DEBUG)

# fs = open("./splunkPGPkey.pub", "r")

SPLUNK_PGP_KEY_URL = "https://docs.splunk.com/images/6/6b/SplunkPGPKey.pub"

class downloadContentUpdate(PersistentServerConnectionApplication):
    def __init__(self, command_line, command_arg):
        PersistentServerConnectionApplication.__init__(self)
        self.config_map = {
            "mitreattack": {"file": "/vendor/mitre/enterprise-attack", "kvstore": "sse_json_doc_storage", "key": "mitreattack"},
            "Splunk_Research_Baselines": {"file": "/vendor/splunk/Splunk_Research_Baselines", "kvstore": "sse_json_doc_storage", "key": "Splunk_Research_Baselines"},
            "Splunk_Research_Deployments": {"file": "/vendor/splunk/Splunk_Research_Deployments", "kvstore": "sse_json_doc_storage", "key": "Splunk_Research_Deployments"},
            "Splunk_Research_Detections": {"file": "/vendor/splunk/Splunk_Research_Detections", "kvstore": "sse_json_doc_storage", "key": "Splunk_Research_Detections"},
            "Splunk_Research_Lookups": {"file": "/vendor/splunk/Splunk_Research_Lookups", "kvstore": "sse_json_doc_storage", "key": "Splunk_Research_Lookups"},
            "Splunk_Research_Macros": {"file": "/vendor/splunk/Splunk_Research_Macros", "kvstore": "sse_json_doc_storage", "key": "Splunk_Research_Macros"},
            "Splunk_Research_Stories": {"file": "/vendor/splunk/Splunk_Research_Stories", "kvstore": "sse_json_doc_storage", "key": "Splunk_Research_Stories"},
            "Splunk_Research_Version": {"file": "/vendor/splunk/Splunk_Research_Version", "kvstore": "sse_json_doc_storage", "key": "Splunk_Research_Version"},
            "custom": {"key": "custom"}
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
        version=""
        custom_key=""
        verification=""
        send_key=""
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
                    elif pair[0] == "version":
                        version = pair[1]
                    elif pair[0] == "custom_key":
                        custom_key = pair[1]
                    elif pair[0] == "verification":
                        verification = pair[1]
                    elif pair[0] == "sendPublicKey":
                        send_key = pair[1]
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
        
        # Get JSON property dynamically
        def getProperty(json, path):
            tokens = path.split(".")
            obj = json
            for token in tokens:
                obj = obj[token]
            return obj
        
        def getEssentialsUpdateConfig(config, field):
            cfg = getConfStanza('essentials_updates',config)
            # debug.append({"msg": "essentials_updates - got config", "cfg": cfg,"field": field,"value":cfg.get(field)})
            return cfg.get(field)
        
        def getSignature(url):
            try: 
                request = six.moves.urllib.request.Request(url)
                signature = six.moves.urllib.request.urlopen(request).read().lstrip()
                signature = signature.decode('utf-8')
                # logger.info("Sign: %s", signature)
                return signature
            except Exception as e:
                return False

        def getJSONContent(url):
            try: 
                request = six.moves.urllib.request.Request(url)
                content = six.moves.urllib.request.urlopen(request).read().lstrip()
                content = json.loads(content.decode('utf-8'))
                to_return = json.dumps(content)
                return to_return
            except Exception as e:
                return False
            
        def checkRedirectedURL(config):
            cfg = getConfStanza('essentials_updates',config)
            essentialDownloadUrl = cfg.get('content_download_url')

            try:
                response = requests.get(essentialDownloadUrl)
                if "securitycontent.scs.splunk.com" in response.url:
                    # logger.info("Updated url detected")
                    return True
                # logger.info("Old url detected")
                return False
            except Exception as e:
                # logger.info("No redirection here %s", e)
                return False
        
        def sendDataForVerification(config):
            cfg = getConfStanza('essentials_updates',config)
            try:
                essentialsDownloadUrl = cfg.get('content_download_url')
                essentialsKeyUrl = cfg.get('key')

                # Get JSON Content
                json_content = getJSONContent(essentialsDownloadUrl)
                signature = getSignature(essentialsKeyUrl)

                return json_content, signature
            except: 
                return False, False
            
        def getContentUpdate(config):
            cfg = getConfStanza('essentials_updates',config)
            essentialsUpdateDownloadUrl = cfg.get('content_download_url')
            essentialsUpdateBuildUrl = cfg.get('build_url')
            essentialsUpdateBuildField = cfg.get('build_field')
            content = ""
            build_id = ""

            try:
                request = six.moves.urllib.request.Request(essentialsUpdateDownloadUrl)
                content = six.moves.urllib.request.urlopen(request).read()
                content=json.loads(content.decode('utf-8'))

            except Exception as e:
                status = "Failed to get the content " + essentialsUpdateDownloadUrl
                return {'payload': {"message": "Failed to get the content from:" + essentialsUpdateDownloadUrl, "error": str(e)},  
                         'status': 200
                } 
            # TODO: build in the version check here instead if in the browser
            # if len(essentialsUpdateBuildUrl)>0:
            #     try:
            #         request = six.moves.urllib.request.Request(essentialsUpdateBuildUrl)
            #         build = six.moves.urllib.request.urlopen(request).read()
            #         build=build.decode('utf-8')
            #         debug.append({"msg": "build", "build": build})
            #         build_id=getProperty(json.loads(build),essentialsUpdateBuildField)
            #     except Exception as e:
            #         status = "Failed to get the Build URL " + essentialsUpdateBuildUrl
            #         return {'payload': {"message": "Failed to get the content from:" + essentialsUpdateBuildUrl, "error": str(e)},  
            #                 'status': 200
            #         }
            # else:
            #     # Get the build id from the length of the payload
            #     build_id = len(json.dumps(content))
            
            contentUpdate = {
                "content": content,
                "build_id": len(json.dumps(content))
            }
            debug.append({"msg": "contentUpdate", "contentUpdate": contentUpdate})
            return contentUpdate
        

        if len(custom_key)==0:
            contentKey = valid_config_files[desired_config]['key']
        else:
            contentKey=custom_key

        try:
            if(verification == "pending"):
                need_verification = checkRedirectedURL(contentKey)
                if(need_verification):
                    json_data, sign_data = sendDataForVerification(contentKey)
                    if(send_key == "True"):
                        request = six.moves.urllib.request.Request(SPLUNK_PGP_KEY_URL)
                        pgp_key = six.moves.urllib.request.urlopen(request).read().lstrip()
                        pgp_key = pgp_key.decode('utf-8')
                        
                        return {'payload': {"JSON": json_data, "sign": sign_data, "PGP": pgp_key},  
                                'status': 200
                        } 
                    
                    return {'payload': {"JSON": json_data, "sign": sign_data},  
                                'status': 200
                    } 

            # Now grab the content from the download URL
            contentUpdate = getContentUpdate(contentKey)
            debug.append({"msg": "contentUpdate", "contentUpdate": contentUpdate})
        except Exception as e:
            return {'payload': {"message": "Failed to getContentUpdate from:" + contentKey, "error": str(e)},  
                         'status': 200
                }

        try:
            description = getEssentialsUpdateConfig(contentKey,'description')
            # debug.append({"msg": "essentials_updates - got description", "description": description})
            
            compression = False
            if contentKey == "mitreattack":
                compression = True
            t = time.time()
            
            if len(version)==0:
                version=contentUpdate['build_id']

            jsonstorage = {
                "_key": contentKey,
                "_time": round(t,3),
                "version": version,
                "description": description,
                "json": six.moves.urllib.parse.quote(json.dumps(contentUpdate['content'])),
                "compression":compression, 
                "config": contentKey
            }

            # debug.append({"msg": "essentials_updates - jsonstorage", "jsonstorage": jsonstorage})
            # debug.append({"msg": "essentials_updates - jsonstorage encoded", "jsonstorage encoded": json.dumps(jsonstorage).encode()})
            # # Send new content to write endpoint
            url = base_url + '/services/pushJSON'
            headers = {
                "contentType": "text/json",
                "Authorization": ('Splunk %s' % sessionKey)
            }
            # debug.append({"msg": "essentials_updates - headers", "headers": headers})
            
            request = six.moves.urllib.request.Request(url, data=json.dumps(jsonstorage).encode(), headers=headers)
            urlopen = six.moves.urllib.request.urlopen(request)
            response=json.loads(urlopen.read())
            return {'payload': {"message": "Saved " + contentKey + " in kvstore", "build_id": version},  
                        'status': 200
                } 
            
        except Exception as e:
            return {'payload': {"section": "action"+" error", "message": str(e), "debug": debug},
                    'status': 500
            } 