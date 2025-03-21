
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
import time
import six.moves.urllib.request, six.moves.urllib.parse, six.moves.urllib.error, six.moves.urllib.request, six.moves.urllib.error, six.moves.urllib.parse
import requests, ssl, shutil
import re

import pprint
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

from splunk.persistconn.application import PersistentServerConnectionApplication

splunk_home = os.getenv('SPLUNK_HOME')
sys.path.append(splunk_home + '/etc/apps/Splunk_Security_Essentials/bin/')
sys.path.append(splunk_home + '/etc/apps/Splunk_Security_Essentials/bin/splunklib/')

import splunklib.client as client

sys.path.append(splunk_home + '/etc/apps/Splunk_Security_Essentials/lib/analytic_story_execution/bin/')


class addKnowledgeObject(PersistentServerConnectionApplication):
    def __init__(self, command_line, command_arg):
        PersistentServerConnectionApplication.__init__(self)

    def handle(self, in_string):
        debug = []
        debugEnabled = False
        doWrite = True 
        app = "Splunk_Security_Essentials"

        path = os.environ['SPLUNK_HOME'] + "/etc/apps/" + app + "/appserver/static/"
        pathToShowcaseInfo = os.environ['SPLUNK_HOME'] + "/etc/apps/" + app + "/appserver/static/components/localization/"

        try: 
            input = json.loads(in_string)
            sessionKey = input['session']['authtoken']
            owner = input['session']['user']
            ko = json.loads(input.get("payload",""))
        except:
            return {'payload': json.dumps({"response": "Error! Couldn't find any initial input. This shouldn't happen."}),  
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
        

        if "macro" in ko["objectType"]:
            #Add macro            
            if ("arguments" in ko and len(ko["arguments"])>0):
                ko['name']=ko['name']+"("+str(len(ko["arguments"]))+")"
                service.post('properties/macros', __stanza=ko['name'])
                service.post('properties/macros/' + ko['name'], definition=ko['definition'], description=ko['description'], args=",".join(ko["arguments"]))
            else:
                service.post('properties/macros', __stanza=ko['name'])
                service.post('properties/macros/' + ko['name'], definition=ko['definition'], description=ko['description'])
            return {'payload': {"message": "Macro added","Name":ko["name"]},  
                        'status': 200
                    }
        elif "lookup" in ko["objectType"]:
            lookup = ko
            #Code from asx_lib.py, minor modifications
            kwargs = {}
            
            if 'filename' in lookup:
                kwargs.update({"filename": lookup['filename']})
                if not os.path.exists(splunk_home + '/etc/apps/' + app + '/lookups/' + lookup['filename']):
                    if not os.path.exists(splunk_home + '/var/run/splunk/lookup_tmp'):
                        os.makedirs(splunk_home + '/var/run/splunk/lookup_tmp')
                    url = 'https://security-content.s3-us-west-2.amazonaws.com/lookups/' + lookup['filename']
                    r = requests.get(url, allow_redirects=True)
                    lookup_table_file_path = splunk_home + '/var/run/splunk/lookup_tmp/' + lookup['filename']
                    open(lookup_table_file_path, 'wb').write(r.content)
                    kwargs2 = {}
                    kwargs2.update({"eai:data": lookup_table_file_path})
                    kwargs2.update({"name": lookup['filename']})
                    try:
                        service.post('data/lookup-table-files', **kwargs2)
                    except Exception as e:
                        self.logger.error("Failed to store lookup file " + lookup['filename'] + " with error: " + str(e))
                
            else:
                kwargs.update({"collection": lookup['collection']})
                kwargs.update({"external_type": 'kvstore'})
                #Add collection object
                kwargs2 = {}
                kwargs2.update({"enforceTypes": "false"})
                try:
                    service.post('properties/collections', __stanza=lookup['collection'])
                    service.post('properties/collections/' + lookup['collection'], **kwargs2)
                except Exception as e:
                    self.logger.error("Failed to store lookup collection " + lookup['collection'] + " with error: " + str(e))                 
                      
            if 'default_match' in lookup:
                kwargs.update({"default_match": lookup['default_match']})
            if 'case_sensitive_match' in lookup:
                kwargs.update({"case_sensitive_match": lookup['case_sensitive_match']})
            if 'description' in lookup:
                kwargs.update({"#description": lookup['description']})
            if 'match_type' in lookup:
                kwargs.update({"match_type": lookup['match_type']})
            if 'max_matches' in lookup:
                kwargs.update({"max_matches": lookup['max_matches']})
            if 'min_matches' in lookup:
                kwargs.update({"min_matches": lookup['min_matches']})
            if 'fields_list' in lookup:
                kwargs.update({"fields_list": lookup['fields_list']})
            if 'filter' in lookup:
                kwargs.update({"filter": lookup['filter']})
                
            try:
                service.post('properties/transforms', __stanza=lookup['name'])
                service.post('properties/transforms/' + lookup['name'], **kwargs)
            except Exception as e:
                self.logger.error("Failed to store lookup " + lookup['name'] + " with error: " + str(e))
            
            return {'payload': {"message": "Lookup added","Name":ko["name"]},  
                        'status': 200
                    }
        else:
             return {'payload': {"message": "Error did not find anything added","Object":ko},  
                        'status': 200
                    }