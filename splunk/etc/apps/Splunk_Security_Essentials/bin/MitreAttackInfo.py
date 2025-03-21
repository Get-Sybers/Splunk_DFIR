import json

class MitreAttackInfo:
    final_attack_id_list = []
    final_attack_name_list = []
    mitre_attack_blob = []

    def __init__(self, sessionKey):

        # sessionkey gets passed in when a new object is created
        self.sessionKey = sessionKey

        # import the libraries we need
        import sys
        from splunk.appserver.mrsparkle.lib.util import make_splunkhome_path
        from MitreAttackInfo import MitreAttackInfo

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

        import pprint
        pp = pprint.PrettyPrinter(indent=4)

        from splunk.clilib.cli_common import getConfKeyValue, getConfStanza

        if sys.platform == "win32":
            import msvcrt
            # Binary mode is required for persistent mode on Windows.
            msvcrt.setmode(sys.stdin.fileno(), os.O_BINARY)
            msvcrt.setmode(sys.stdout.fileno(), os.O_BINARY)
            msvcrt.setmode(sys.stderr.fileno(), os.O_BINARY)
            
        import splunklib.client as client
        
        try:
            # Getting configurations
            mgmtHostname, mgmtHostPort = getConfKeyValue('web', 'settings', 'mgmtHostPort').split(":")
            base_url = "https://" + mgmtHostname + ":" + mgmtHostPort
        except Exception as e:
            # debug.append(json.dumps({"status": "ERROR", "description": "Error getting the base_url configuration!", "message": str(e)}))
            throwErrorMessage = True

        try: 
            service = client.connect(host=mgmtHostname, port=mgmtHostPort, token=self.sessionKey)
            service.namespace['owner'] = 'nobody'
            service.namespace['app'] = 'Splunk_Security_Essentials'
        except Exception as e:
            # debug.append(json.dumps({"status": "ERROR", "description": "Error grabbing a service object", "message": str(e)}))
            throwErrorMessage = True
        
        #Get the MITRE JSON using the pullJSON endpoint which will pick kvstore or flat file depending on what is available
        try:
            request = six.moves.urllib.request.Request(base_url + '/services/pullJSON?config=mitreattack',
                headers = { 'Authorization': ('Splunk %s' % sessionKey)})
            search_results = six.moves.urllib.request.urlopen(request)

            self.mitre_attack_blob = json.loads(search_results.read())
            data = self.mitre_attack_blob["objects"]
            for i in data:
                if i["type"] == "x-mitre-matrix":
                    tactic_refs = i["tactic_refs"]
                    
                    for i in tactic_refs:
                        for j in data:
                            if j["id"] == i:
                                self.final_attack_name_list.append(str(j["name"]))
                                self.final_attack_id_list.append(str(j["external_references"][0]["external_id"]))

        except Exception as e:
            self.errorOut({"status": "ERROR", "description": "Error occurred reading enterprise-attack.json", "message": str(e)})

    # only used above when trying to get session information
    def errorOut(self, obj):
        print("Error!")
        print('"' + json.dumps(obj).replace('"', '""') + '"')
        sys.exit()

    # returns a list of all the current mitre attack id's in a list
    def returnMitreAttackIdsList(self):
        return self.final_attack_id_list

    # returns a list of tactic names
    def returnMitreAttackNameList(self):
        return self.final_attack_name_list
    
    def returnMitreAttackBlob(self):
        return self.mitre_attack_blob

    # converts the name of a tactic to an id. returns a string
    def convertTacticName(self, tactic_name):
        # create an empty dict that we'll populate using the names and ids
        name_to_tactic_list = {}
        tactid_id = ""

        # populate the dict
        for i,j in zip(self.final_attack_name_list, self.final_attack_id_list):
            name_to_tactic_list[i] = j
            
        if tactic_name in name_to_tactic_list:
            # return tactic id based on the name
             tactid_id = name_to_tactic_list[tactic_name]
        
        return tactid_id

    # converts the tactic id to the actual tactic name
    def convertTacticId(self, tactic_id):
        tactic_to_name_list = {}
        
        for i,j in zip(self.final_attack_id_list, self.final_attack_name_list):
            tactic_to_name_list[i] = j

        return tactic_to_name_list[tactic_id]