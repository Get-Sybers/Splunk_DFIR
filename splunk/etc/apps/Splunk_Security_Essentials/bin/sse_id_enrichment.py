#!/usr/bin/env python
import json
import os
import sys
from splunk.appserver.mrsparkle.lib.util import make_splunkhome_path

def add_to_sys_path(paths, prepend=False):
    for path in paths:
        if prepend:
            if path in sys.path:
                sys.path.remove(path)
            sys.path.insert(0, path)
        elif path not in sys.path:
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
    """noop: future was not loaded yet"""



splunk_home = os.getenv('SPLUNK_HOME')
sys.path.append(splunk_home + '/etc/apps/Splunk_Security_Essentials/bin/')
sys.path.append(splunk_home + '/etc/apps/Splunk_Security_Essentials/bin/splunklib/')

from cexc import BaseChunkHandler
import six.moves.urllib.error
import six.moves.urllib.parse
import six.moves.urllib.request
import splunklib.client as client
from splunk.clilib.cli_common import getConfKeyValue


def strip_non_ascii(string):
    """Returns the string without non ASCII characters."""
    stripped = (c for c in string if 0 < ord(c) < 127)
    return ''.join(stripped)


class SSELookup(BaseChunkHandler):

    def _parse_arguments(self, args):
        self.type = None
        self.field = None
        self.fieldList = []
        for token in args:
            if '=' not in token:
                self.fieldList.append(token)

                continue

            (k, v) = token.split('=', 1)
            if k in ['type', 'field']:
                setattr(self, k, v)

        if self.type == None:
            raise Exception('No type found -- please specify what type of enrichment you\'d like to do')
        elif self.type not in self.available_types:
            raise Exception('Invalid type provided. Valid types include: ' + ', '.join(self.available_types))
        if self.field == None:
            raise Exception('No field found -- please specify the field you want to enrich')

            # metadata is a dict with the parsed JSON metadata payload.

    # data is a list of dicts, where each dict represents a search result.
    def handler(self, metadata, data):

        # The first chunk is a "getinfo" chunk.
        if metadata['action'] == 'getinfo':
            self.available_types = ['datasourceid', 'dscid', 'mitreid', 'productid']
            try:
                self.dvdebug = []

                args = metadata['searchinfo']['args']
                self.args = metadata
                self.sessionKey = metadata['searchinfo']['session_key']
                self.owner = metadata['searchinfo']['owner']
                self.app = metadata['searchinfo']['app']
                self.includeAllContent = 'false'
                self.globalSourceList = {}

            except Exception:
                args = []

            self._parse_arguments(args)

            return {'type': 'streaming', 'required_fields': [self.field]}

        # Now we switch from tabs to spaces, because someone is a monster and I'm not smart enough to figure it out.

        if self.type == 'datasourceid':
            base_url = "https://" + getConfKeyValue('web', 'settings', 'mgmtHostPort')

            request = six.moves.urllib.request.Request(base_url + '/services/pullJSON?config=data_inventory',
                                                       headers={'Authorization': ('Splunk %s' % self.sessionKey)})
            search_results = six.moves.urllib.request.urlopen(request)
            data_inventory = json.loads(search_results.read())

            dsids = list(data_inventory.keys())

            for record in data:
                if record[self.field] in dsids:
                    record.update({"data_source": data_inventory[record[self.field]]['name']})
        elif self.type == "dscid":
            base_url = "https://" + getConfKeyValue('web', 'settings', 'mgmtHostPort')

            request = six.moves.urllib.request.Request(base_url + '/services/pullJSON?config=data_inventory',
                                                       headers={'Authorization': ('Splunk %s' % self.sessionKey)})
            search_results = six.moves.urllib.request.urlopen(request)
            data_inventory = json.loads(search_results.read())
            dscids = {}
            for dsid in data_inventory:
                for dscid in data_inventory[dsid]['eventtypes']:
                    dscids[dscid] = data_inventory[dsid]['eventtypes'][dscid]['name']

            for record in data:
                if record[self.field] in dscids:
                    record.update({"data_source_category": dscids[record[self.field]]})
        elif self.type == "mitreid":
            base_url = "https://" + getConfKeyValue('web', 'settings', 'mgmtHostPort')

            request = six.moves.urllib.request.Request(base_url + '/services/pullJSON?config=mitreattack',
                                                       headers={'Authorization': ('Splunk %s' % self.sessionKey)})
            search_results = six.moves.urllib.request.urlopen(request)
            mitre_attack_blob = json.loads(search_results.read())
            mitre_names = {}
            mitre_urls = {}

            # Updated by Dimitris Lambou 2020-05-12 to add MITRE ATT&CK Threat Groups to the enrichment of MITRE ATT&CK Techniques

            mitre_tactic_ids = {}
            mitre_intrusion_set_id = {}
            mitre_group_technique_relationship = []

            if 'objects' in mitre_attack_blob:
                for obj in mitre_attack_blob['objects']:
                    if 'name' in obj:
                        obj['name'] = obj['name'].replace(u'\xe4', 'a')
                        obj['name'] = strip_non_ascii(obj['name'])
                    if 'external_references' in obj:
                        for reference in obj['external_references']:
                            if 'url' in reference and 'type' in obj and (
                                    obj['type'] == 'attack-pattern' or obj['type'] == 'x-mitre-tactic' or obj[
                                'type'] == 'intrusion-set') and ('https://attack.mitre.org/techniques/' in reference[
                                'url'] or 'https://attack.mitre.org/groups/' in reference[
                                                                     'url'] or 'https://attack.mitre.org/tactics/' in
                                                                 reference['url']):
                                mitre_names[reference['external_id']] = obj['name']
                                mitre_urls[reference['external_id']] = reference['url']

                                mitre_tactic_ids[reference['external_id']] = obj['id']

                    if 'type' in obj:
                        if obj['type'] == 'intrusion-set':
                            mitre_intrusion_set_id[obj['id']] = obj['name']

                    if 'relationship_type' in obj:
                        if obj['relationship_type'] == 'uses' and 'attack-pattern-' in obj['target_ref'] and 'intrusion-set' in obj['source_ref']:
                            relationship = {}
                            relationship['id'] = obj['id']
                            relationship['source_ref'] = obj['source_ref']
                            relationship['target_ref'] = obj['target_ref']
                            mitre_group_technique_relationship.append(relationship)

            # request = six.moves.urllib.request.Request(base_url + '/services/pullJSON?config=mitrepreattack',
            # 	headers = { 'Authorization': ('Splunk %s' % self.sessionKey)})
            # search_results = six.moves.urllib.request.urlopen(request)
            # mitre_preattack_blob = json.loads(search_results.read())

            # if "objects" in mitre_preattack_blob:
            # 	for obj in mitre_preattack_blob['objects']:
            # 		if "name" in obj:
            # 			obj['name'] = obj['name'].replace(u'\xe4', "a")
            # 			obj['name'] = strip_non_ascii(obj['name'])
            # 		if "external_references" in obj:
            # 			for reference in obj['external_references']:
            # 				if "url" in reference and ( "https://attack.mitre.org/techniques/" in reference['url'] or "https://attack.mitre.org/tactics/" in reference['url'] ):
            # 					mitre_names[ reference['external_id'] ] = obj['name']

            for record in data:
                if record[self.field] in mitre_names:
                    if "TA" in record[self.field]:
                        record.update({'mitre_tactic_display': mitre_names[record[self.field]]})
                        record.update({'mitre_tactic_url': mitre_urls[record[self.field]]})
                    elif "G" in record[self.field]:
                        record.update({'mitre_group_display': mitre_names[record[self.field]]})
                        record.update({'mitre_group_url': mitre_urls[record[self.field]]})
                    else:
                        mitre_group_uses = []
                        record.update({'mitre_technique_display': mitre_names[record[self.field]]})
                        record.update({'mitre_technique_url': mitre_urls[record[self.field]]})

                        for entry in mitre_group_technique_relationship:
                            if mitre_tactic_ids[record[self.field]] == entry['target_ref']:
                                mitre_group_uses.append(mitre_intrusion_set_id[entry['source_ref']])
                        mitre_threat_groups = [str(elem) for elem in sorted(mitre_group_uses)]
                        record.update({'mitre_threat_groups': '\n'.join(mitre_threat_groups)})
                        record.update({'__mv_mitre_threat_groups': '$' + '$;$'.join(mitre_threat_groups) + '$'})

                else:
                    # Fix for error handling
                    record.update({'dvtest': record[self.field]})

        elif self.type == 'productid':
            products = {}
            # debug = "hi"
            try:
                service = client.connect(token=self.sessionKey)
                service.namespace['owner'] = 'nobody'
                service.namespace['app'] = 'Splunk_Security_Essentials'
                kvstore_output = service.kvstore['data_inventory_products'].data.query()
                for row in kvstore_output:
                    products[row['productId']] = row

            except Exception as e:
                debug = str(e)
                throwErrorMessage = True

            for record in data:
                if record[self.field] in products:
                    record.update({'productName': products[record[self.field]]['productName']})
                    record.update({'vendorName': products[record[self.field]]['vendorName']})
                    record.update({'status': products[record[self.field]]['status']})
                    if 'basesearch' in products[record[self.field]] and products[record[self.field]][
                        'basesearch'] != "":
                        record.update({'basesearch': products[record[self.field]]['basesearch']})

        return (
            {'finished': metadata['finished']},
            data
        )


if __name__ == '__main__':
    SSELookup().run()
