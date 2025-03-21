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



import os
import json 
import re
import time
import csv
from io import open
import traceback

import splunk.rest as rest


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
if(os.path.isdir(splunk_home + "/etc/apps/slave-apps")):
    sys.path.append(splunk_home + '/etc/apps/Splunk_Security_Essentials/bin/')
    sys.path.append(splunk_home + '/etc/apps/Splunk_Security_Essentials/bin/splunklib/')
else:    
    sys.path.append(splunk_home + '/etc/apps/Splunk_Security_Essentials/bin/')
    sys.path.append(splunk_home + '/etc/apps/Splunk_Security_Essentials/bin/splunklib/')

import splunklib.client as client

class ResetLocalNav(PersistentServerConnectionApplication):
    def __init__(self, command_line, command_arg):
        PersistentServerConnectionApplication.__init__(self)

    def handle(self, in_string):
        default_nav = ""
        # f = open("/tmp/dvtest.log", "wb")
        from time import gmtime, strftime
        # f.write("STARTING - " + strftime("%Y-%m-%d %H:%M:%S", gmtime()) + "\n")
        try: 
            input = json.loads(in_string)
            sessionKey = input['session']['authtoken']
        except Exception as e:
            # f.write("Error Early")
            return {'payload': {"status": "error early", "message": str(e)},  
                    'status': 200          # HTTP status code
            }

        try:
            localfilepath = make_splunkhome_path(['etc', 'apps', 'Splunk_Security_Essentials', 'local', 'data', 'ui', 'nav', 'default.xml'])
            if not os.path.exists(localfilepath):
                # f.write("No Update Needed\n")
                return {'payload': {"status": "no update needed"},  
                        'status': 200          # HTTP status code
                }
        except Exception as e:
            # f.write("Error 1 - " + str(e) + "\n")
            return {'payload': {"status": "error", "message": str(e)},  
                    'status': 200          # HTTP status code
            }

        try:
            filepath = make_splunkhome_path(['etc', 'apps', 'Splunk_Security_Essentials', 'default', 'data', 'ui', 'nav', 'default.xml'])
            with open(filepath, 'rU') as fh:
                default_nav = fh.read()
            url = "/servicesNS/nobody/Splunk_Security_Essentials/data/ui/nav/default"
            postargs = {
                "eai:data": default_nav
            }

            rest.simpleRequest(url, postargs=postargs, sessionKey=sessionKey, raiseAllErrors=True)
            # f.write("Update Successful\n")
            return {'payload': {"status": "update successful", "more": default_nav},  
                    'status': 200          # HTTP status code
            }
        except Exception as e:
            # f.write("error 2 - " + str(e) + "\n")
            return {'payload': {"status": "error", "message": str(e)},  
                    'status': 200          # HTTP status code
            }
