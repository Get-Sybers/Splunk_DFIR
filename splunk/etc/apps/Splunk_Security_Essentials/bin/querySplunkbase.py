
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


class querySplunkbase(PersistentServerConnectionApplication):
    def __init__(self, command_line, command_arg):
        PersistentServerConnectionApplication.__init__(self)

    def handle(self, in_string):
        debug = []
        debugEnabled = False
        splunkbase_url = "https://splunkbase.splunk.com/api/v1/app/"
        base_params = "archive=false&order=popular&include=support,created_by,rating,release,release.cim_compatibility,release.tags,release.tags_sourcetypes"
        url = splunkbase_url+"?"+base_params
        input = {}
        app = "Splunk_Security_Essentials"
        valid_params = {  
            "tag": "", 
            "sourcetype": "", 
            "limit": "",
            "type": "",
            "category": ""
        }
        # debug.append(json.dumps({"status": "INFO", "url": "Message ", "url": str(url)}))
        try: 
            input = json.loads(in_string)
            if "query" in input:
                for pair in input['query']:
                    if pair[0] in valid_params:
                        url += "&"+str(pair[0])+"="+str(pair[1])
                    else:
                        return {'payload': json.dumps({"response": "Error! Invalid query provided. "}),  
                                'status': 200          # HTTP status code
                        }
        except:
            return {'payload': json.dumps({"response": "Error! Couldn't find any initial input. This shouldn't happen."}),  
                    'status': 500          # HTTP status code
            }
        if (debugEnabled):
            return {'payload': {"message": "All debug logs","Debug":debug},  
                'status': 200
        }
        # import urllib library
        from urllib.request import urlopen

        # store the response of URL
        response = urlopen(url)

        # storing the JSON response 
        # from url in data
        data = json.loads(response.read())
        
        return {'payload': data,
                'status': 200
        }
        
