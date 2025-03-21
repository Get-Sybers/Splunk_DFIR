import json, re, os, sys
from splunk.appserver.mrsparkle.lib.util import make_splunkhome_path
import six.moves.urllib.request, six.moves.urllib.parse, six.moves.urllib.error, six.moves.urllib.request
class LookupHelper:
    app = "" 
    base_url = ""

    def __init__(self, sessionKey):

        # sessionkey gets passed in when a new object is created
        self.sessionKey = sessionKey
        self.app = "Splunk_Security_Essentials" 
        self.debug = []
        self.EnableDebug = False

        # import the libraries we need
        from LookupHelper import LookupHelper

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

        import time

        from splunk.clilib.cli_common import getConfKeyValue

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
            self.base_url = "https://" + mgmtHostname + ":" + mgmtHostPort
        except Exception as e:
            # debug.append(json.dumps({"status": "ERROR", "description": "Error getting the base_url configuration!", "message": str(e)}))
            throwErrorMessage = True

        try: 
            service = client.connect(host=mgmtHostname, port=mgmtHostPort, token=self.sessionKey)
            service.namespace['owner'] = 'nobody'
            service.namespace['app'] = app
        except Exception as e:
            # debug.append(json.dumps({"status": "ERROR", "description": "Error grabbing a service object", "message": str(e)}))
            throwErrorMessage = True

     # only used above when trying to get session information
    def errorOut(self, obj):
        print("Error!")
        print('"' + json.dumps(obj).replace('"', '""') + '"')
        sys.exit()   
    # These functions are not using the service definition above. Straight api requests instead. 
    def listLookups(self,query=""):
        '''
        @param query: Wildcard query to list lookups with, i.e. mitre_*_matrix.csv. 
        '''
        lookup_list =""
        owner="nobody"
        namespace = self.app
        params = { 'output_mode' : 'json'}
        if (query!=""): 
            params = { 'output_mode' : 'json','search' : query}
            total_url = self.base_url + '/servicesNS/' + owner + '/' + namespace + '/data/lookup-table-files' + '?' + six.moves.urllib.parse.urlencode(params)
            # total_url = base_url + "/services/data/lookup-table-files/?f=" +query
        else:
            # total_url = base_url + "/services/data/lookup-table-files/"
            total_url = self.base_url + '/servicesNS/' + owner + '/' + namespace + '/data/lookup-table-files' + '?' + six.moves.urllib.parse.urlencode(params)
        try:
            
            request = six.moves.urllib.request.Request(total_url,
                headers = { 'Authorization': ('Splunk %s' % self.sessionKey)})
            search_results = six.moves.urllib.request.urlopen(request)
            # self.debug.append({"message": "search_results.read()", "search_results.read()": search_results.read()})
            lookup_list = json.loads(search_results.read())["entry"]
            lookup_filename = lookup_list[0]["content"]["eai:data"]
            # self.debug.append({"message": "lookup_filename returned", "lookup_filename": lookup_filename})
            # self.debug.append({"message": "lookup returned", "lookup": lookup_list})
        except Exception as e:
            self.debug.append({"status": "Failed to do get lookups method", "error": str(e)})
        return lookup_list
    def deleteLookup(self,lookup):
        '''
        @param lookup: The lookup FILE name (NOT the stanza name). 
        '''
        owner="nobody"
        namespace = self.app
        total_url = self.base_url + '/servicesNS/' + owner + '/' + namespace + '/data/lookup-table-files/' + lookup
        # self.debug.append({"message": "deleteLookup", lookup: lookup})
        try:
            request = six.moves.urllib.request.Request(total_url,method="DELETE",
                headers = { 'Authorization': ('Splunk %s' % self.sessionKey)})
            search_results = six.moves.urllib.request.urlopen(request)
        except Exception as e:
            self.debug.append({"status": "Failed to delete lookup", "error": str(e)})
        # if self.EnableDebug:
        #     print(json.dumps(self.debug))
        return "Lookup deleted"

    def getLookup(self,lookup):
        '''
        @param lookup: The lookup FILE name (NOT the stanza name). 
        '''
        lookupentry = listLookups(query=lookup)
        lookup_filename = matrix_lookup_path+lookupentry[0]["name"]
        # self.debug.append({"message": "lookup_filename", "lookup_filename": lookup_filename})
        if os.path.exists(lookup_filename):
            with open(lookup_filename) as f:
                return f.read()
        else:
            self.debug.append({"message": "lookup not found", "lookup_filename": lookup_filename})
            return "Lookup not found"

    def addLookup(self,lookup_file):
        '''
        @param lookup_file: The lookup FILE name (NOT the stanza name). This file should already exist in the lookup tmp folder. 
        '''
        owner="nobody"
        namespace = self.app
        total_url = self.base_url + '/servicesNS/' + owner + '/' + namespace + '/data/lookup-table-files/' + lookup_file
        lookup_tmp = make_splunkhome_path(['var', 'run', 'splunk', 'lookup_tmp'])
        if not os.path.exists(lookup_tmp):
            os.makedirs(lookup_tmp)
        destination_lookup_full_path = os.path.join(lookup_tmp, lookup_file)
        # self.debug.append({"message": "addLookup", destination_lookup_full_path: destination_lookup_full_path})
        # self.debug.append({"message": "addLookup", lookup_tmp: lookup_tmp})
    

        params = {
                'output_mode': 'json',
                'eai:data': str(destination_lookup_full_path),
                'name': lookup_file
            }
        data = six.moves.urllib.parse.urlencode(params)
        data = data.encode('utf-8')
        # self.debug.append({"message": "addLookup", data: data})

        try:
            request = six.moves.urllib.request.Request(total_url,data=data,method="POST",
                headers = { 'Authorization': ('Splunk %s' % self.sessionKey)})
            search_results = six.moves.urllib.request.urlopen(request)
        except Exception as e:
            self.debug.append({"status": "Failed to add lookup", "error": str(e)})
        # if self.EnableDebug:
        #     print(json.dumps(self.debug))
        return "Lookup added"