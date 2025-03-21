

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
import random
import json, csv, re, os
import sys
import splunk.entity, splunk.Intersplunk


from splunk.clilib.cli_common import getConfKeyValue
from io import open

if sys.platform == "win32":
    import msvcrt
    # Binary mode is required for persistent mode on Windows.
    msvcrt.setmode(sys.stdin.fileno(), os.O_BINARY)
    msvcrt.setmode(sys.stdout.fileno(), os.O_BINARY)
    msvcrt.setmode(sys.stderr.fileno(), os.O_BINARY)

from splunk.persistconn.application import PersistentServerConnectionApplication


class pullCSV(PersistentServerConnectionApplication):
    def __init__(self, command_line, command_arg):
        PersistentServerConnectionApplication.__init__(self)

    def handle(self, in_string):
        input = {}
        payload = {}
        app = "Splunk_Security_Essentials"
        valid_config_files = {  
            "data-inventory-config": "/lookups/SSE-data-inventory-config.csv", 
            "sse-default-products": "/lookups/SSE-default-data-inventory-products.csv",
            "datamodels": "/lookups/datamodels.csv",
            "mitre_enterprise_list": "/lookups/mitre_enterprise_list.csv"
        }
        desired_config = ""
        try: 
            input = json.loads(in_string)
            sessionKey = input['session']['authtoken']
            owner = input['session']['user']
            if "query" in input:
                for pair in input['query']:
                    if pair[0] == "app":
                        app = pair[1]
                    elif pair[0] == "config":
                        if pair[1] in valid_config_files:
                            desired_config = pair[1]
        except:
            return {'payload': json.dumps({"response": "Error! Couldn't find any initial input. This shouldn't happen."}),  
                    'status': 500          # HTTP status code
            }

        if desired_config=="":
            return {'payload': json.dumps({"response": "Error! No valid configuration specified. Should be passed with ?config=config (to grab the config object)."}),  
                    'status': 500          # HTTP status code
            }
        # return {'payload': {"response": "Hi there!", "value": "david", "desired": desired_config, "configs": valid_config_files, "result": valid_config_files[desired_config]},  
        #                 'status': 200
        #         }
        try:
            # Now to grab files off the filesystem
            path = os.environ['SPLUNK_HOME'] + "/etc/apps/" + app + valid_config_files[desired_config]
            with open(path) as f:
                if (desired_config == "mitre_enterprise_list"):
                    csv_reader = csv.DictReader(f, skipinitialspace=True)
                    data = {}
                    for row in csv_reader:
                        key = row["TechniqueIdCombined"]
                        if key not in data:
                            data[key] = row
                        else:
                            data[key]["Tactic"] = data[key]["Tactic"] + "|" + row["Tactic"]
                            data[key]["TacticId"] = data[key]["TacticId"] + "|" + row["TacticId"]
                    data = json.dumps(data)
                else:
                    data = [{k: v for k, v in list(row.items())}
                            for row in csv.DictReader(f, skipinitialspace=True)]
                return {'payload': data,  
                        'status': 200
                }
        except Exception as e: 
            return {'payload': {"error": str(e)},  
                    'status': 404
            }

        return {'payload': {},  
                'status': 404
        }
        
