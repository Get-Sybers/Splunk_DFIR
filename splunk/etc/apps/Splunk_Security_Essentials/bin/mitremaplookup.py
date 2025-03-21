#!/usr/bin/python

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
import six.moves.urllib.request, six.moves.urllib.parse, six.moves.urllib.error, six.moves.urllib.request, six.moves.urllib.error, six.moves.urllib.parse
import time



from splunk.clilib.cli_common import getConfKeyValue, getConfStanza
import splunklib.client as client
import splunk.entity, splunk.Intersplunk
from io import open
from six.moves import range

def strip_non_ascii(string):
    ''' Returns the string without non ASCII characters'''
    stripped = (c for c in string if 0 < ord(c) < 127)
    return ''.join(stripped)

def errorOut(msg):
    errorMessage = msg
    #print "_time,status,message"
    #print "%s,%s,\"%s\"" % (time.time(), "Error!", json.dumps(msg).replace('"', '""'))


which_killchain = "attack"
prettyPrint = True
debug = ""



(isgetinfo, sys.argv) = splunk.Intersplunk.isGetInfo(sys.argv)
args, kwargs = splunk.Intersplunk.getKeywordsAndOptions()

if isgetinfo:
    # streaming, generating, retevs, reqsop, preop
    splunk.Intersplunk.outputInfo(False, False, False, False, None)


results,dummyresults,settings = splunk.Intersplunk.getOrganizedResults()
sessionKey = settings['sessionKey']
owner = settings['owner']
app = "Splunk_Security_Essentials" 
mitre_attack_blob = {}
mitre_preattack_blob = {}
# setattr( "search_name", "search_name")
# setattr( "mitre_technique", "mitre_technique")
search_name = "search_name"
mitre_technique = "mitre_technique"
delim = ""
m = re.search("mitremaplookup[^\|]*mitre_technique=\"*\s*([^ \|\"]*)", settings['search'])
if m:
    mitre_technique = m.group(1)
m = re.search("mitremaplookup[^\|]*search_name=\"*\s*([^ \|\"]*)", settings['search'])
if m:
    search_name = m.group(1)
m = re.search("mitremaplookup[^\|]*delim=\"*\s*([^ \"]*)", settings['search'])
if m:
    delim = m.group(1)

try:
    # Getting configurations
    base_url = "https://" + getConfKeyValue('web', 'settings', 'mgmtHostPort')
except:
    errorOut({"response": "Error getting configurations!"})


try:
    # Getting configurations
    request = six.moves.urllib.request.Request(base_url + '/services/pullJSON?config=mitreattack',
        headers = { 'Authorization': ('Splunk %s' % sessionKey)})
    search_results = six.moves.urllib.request.urlopen(request)

    mitre_attack_blob = json.loads(search_results.read())
    debug += "Here we go... " + " - ".join(list(mitre_attack_blob.keys()))
except Exception as e:
    errorOut({"status": "ERROR", "description": "Error occurred while grabbing mitre attack", "message": str(e)})


searchTitleToSummaryName = {}
try:
    # Getting configurations
    request = six.moves.urllib.request.Request(base_url + '/services/SSEShowcaseInfo?fields=mini',
        headers = { 'Authorization': ('Splunk %s' % sessionKey)})
    search_results = six.moves.urllib.request.urlopen(request)

    ShowcaseInfo = json.loads(search_results.read())

    for summaryName in ShowcaseInfo['summaries']:
        searchTitles = ShowcaseInfo['summaries'][summaryName]['search_title'].split("|")
        for searchTitle in searchTitles:
            if searchTitle != "":
                searchTitleToSummaryName[searchTitle] = summaryName

except Exception as e:
    errorOut({"status": "ERROR", "description": "Error occurred while grabbing SSE ShowcaseInfo", "message": str(e)})



try:
    # Getting configurations
    request = six.moves.urllib.request.Request(base_url + '/services/pullJSON?config=mitreattack',
        headers = { 'Authorization': ('Splunk %s' % sessionKey)})
    search_results = six.moves.urllib.request.urlopen(request)

    mitre_preattack_blob = json.loads(search_results.read())
    
except Exception as e:
    errorOut({"status": "ERROR", "description": "Error occurred while grabbing mitre preattack", "message": str(e)})

prettyPrint = True
which_killchain = "attack"
mitre_names = {}
phase_short_names_to_tactics = {}
mitre_tactics = {}
mitre_tactics_to_pretty_names = {}
try:
    if which_killchain == "attack": 
        with open("../appserver/static/vendor/mitre/enterprise-attack.json") as f:

            if len(list(mitre_attack_blob.keys())) == 0:
                mitre_attack_blob = json.load(f)
                debug += "Error -- no mitre attack data found, so failing back to file"
            for obj in mitre_attack_blob['objects']:
                if "name" in obj:
                    obj['name'] = obj['name'].replace(u'\xe4', "a")
                    obj['name'] = strip_non_ascii(obj['name'])
                if "external_references" in obj:
                    for reference in obj['external_references']:
                        if "url" in reference and (obj["type"] == "attack-pattern" or obj["type"] == "x-mitre-tactic") and  ( "https://attack.mitre.org/techniques/" in reference['url'] or "https://attack.mitre.org/tactics/" in reference['url'] ):
                            mitre_names[ reference['external_id'] ] = obj['name']
                        if "url" in reference and (obj["type"] == "attack-pattern" or obj["type"] == "x-mitre-tactic") and  "https://attack.mitre.org/tactics/" in reference['url']:
                            mitre_tactics[ reference['external_id'] ] = []
                            mitre_tactics_to_pretty_names[ reference['external_id'] ] = obj['name']
                            phase_short_names_to_tactics[ obj['x_mitre_shortname'] ] = reference['external_id']
            
            for obj in mitre_attack_blob['objects']:
                if "external_references" in obj:
                    for reference in obj['external_references']:
                        if "url" in reference and (obj["type"] == "attack-pattern" or obj["type"] == "x-mitre-tactic") and   "https://attack.mitre.org/techniques/" in reference['url'] :
                            if "kill_chain_phases" in obj:
                                for phase in obj['kill_chain_phases']:
                                    if phase['kill_chain_name'] == "mitre-pre-attack" or phase['kill_chain_name'] == "mitre-attack":
                                        if phase['phase_name'] in phase_short_names_to_tactics:
                                            mitre_tactics[ phase_short_names_to_tactics[ phase['phase_name'] ] ].append( reference['external_id'] )
            
    elif which_killchain == "preattack":
        with open("../appserver/static/vendor/mitre/pre-attack.json") as f:
            if len(list(mitre_preattack_blob.keys())) == 0:
                mitre_attack_blob = json.load(f)
            else:
                mitre_attack_blob = mitre_preattack_blob #lazy
            mitre_attack_blob = json.load(f)
            for obj in mitre_attack_blob['objects']:
                if "external_references" in obj:
                    for reference in obj['external_references']:
                        if "url" in reference and (obj["type"] == "attack-pattern" or obj["type"] == "x-mitre-tactic") and  ( "https://attack.mitre.org/techniques/" in reference['url'] or "https://attack.mitre.org/tactics/" in reference['url'] ):
                            mitre_names[reference['external_id']] = obj['name']
                        if "url" in reference and (obj["type"] == "attack-pattern" or obj["type"] == "x-mitre-tactic") and  "https://attack.mitre.org/tactics/" in reference['url']:
                            mitre_tactics[reference['external_id']] = []
                            mitre_tactics_to_pretty_names[ reference['external_id'] ] = obj['name']
                            phase_short_names_to_tactics[ obj['x_mitre_shortname'] ] = reference['external_id']

            for obj in mitre_attack_blob['objects']:
                if "external_references" in obj:
                    for reference in obj['external_references']:
                        if "url" in reference and (obj["type"] == "attack-pattern" or obj["type"] == "x-mitre-tactic") and   "https://attack.mitre.org/techniques/" in reference['url'] :
                            if "kill_chain_phases" in obj:
                                for phase in obj['kill_chain_phases']:
                                    if phase['kill_chain_name'] == "mitre-pre-attack" or phase['kill_chain_name'] == "mitre-attack":
                                        if phase['phase_name'] in phase_short_names_to_tactics:
                                            mitre_tactics[ phase_short_names_to_tactics[ phase['phase_name'] ] ].append( reference['external_id'] )

except Exception as e:
    debug += str(e)

listOfTechniques = []
for record in results:
    if mitre_technique in record and record[mitre_technique] != "":
        mitres = []
        if isinstance(record[mitre_technique], list):
            mitres = record[mitre_technique]
        else:
            if delim != "":
                mitres = record[mitre_technique].split(delim)
            else:
                mitres = [record['mitre_technique']]
        # mitres = record[mitre_technique].split(delim)
        for mitre in mitres:
            mitre = re.sub(r'[^tT0-9].*', '', mitre)
            if mitre!="" and mitre!="None":
                listOfTechniques.append(mitre)
    if search_name in record and record[search_name] in searchTitleToSummaryName:
        regex = '"'
        summaryName = searchTitleToSummaryName[ record[search_name] ]
        if "mitre_technique" in ShowcaseInfo['summaries'][summaryName]:
            mitres = ShowcaseInfo['summaries'][summaryName]['mitre_technique'].split("|")
            for mitre in mitres:
                if mitre!="" and mitre!="None":
                    listOfTechniques.append(mitre)

columns = sorted(list(mitre_tactics.keys()))

for column in columns:
    mitre_tactics[column].sort()
    newColumn = []
    for technique in mitre_tactics[column]:
        if technique in listOfTechniques:
            newColumn.append(technique)
    mitre_tactics[column] = newColumn
longest_key = len(mitre_tactics[max(mitre_tactics, key= lambda x: len(set(mitre_tactics[x])))])
returnObj = []



columns = sorted(list(mitre_tactics.keys()))

w = csv.writer(sys.stdout)

if prettyPrint:
  pretty_columns = []
  for column in columns:
    mitre_tactics[column].sort()
    pretty_columns.append(mitre_tactics_to_pretty_names[column])
  w.writerow(pretty_columns)
else:
  w.writerow(columns)

# longest_key = len(mitre_tactics[max(mitre_tactics, key= lambda x: len(set(mitre_tactics[x])))])
for i in range(0, longest_key):
  currentRow = []
  for tactic in columns:
    if i < len(mitre_tactics[tactic]) and mitre_tactics[tactic][i] in mitre_names:
        # currentRow.append(debug)
        currentRow.append(mitre_names[mitre_tactics[tactic][i]])
    else:
        currentRow.append("")
  w.writerow(currentRow)












# sys.exit()
# def strip_non_ascii(string):
#     ''' Returns the string without non ASCII characters'''
#     stripped = (c for c in string if 0 < ord(c) < 127)
#     return ''.join(stripped)
# def errorOut(obj):
#   print "Error!"
#   print '"' + json.dumps(obj).replace('"', '""') + '"'
#   sys.exit()

# mitre_names = {}
# phase_short_names_to_tactics = {}
# mitre_tactics = {}
# mitre_tactics_to_pretty_names = {}
# mitre_attack_blob = {}
# mitre_preattack_blob = {}
# mitre_groups = {}
# mitre_techniques_to_groups = {}
# mitre_refs_to_refs = {}
# mitre_refs_to_names = {}
# ShowcaseInfo = {"summaries": {}}
# inScopeTechniques = {}
# popularTechniques = {}

# try:
#     # Getting configurations
#     base_url = "https://" + getConfKeyValue('web', 'settings', 'mgmtHostPort')
# except:
#     errorOut({"response": "Error getting configurations!"})


# try:
#     # Getting configurations
#     request = urllib2.Request(base_url + '/services/pullJSON?config=mitreattack',
#         headers = { 'Authorization': ('Splunk %s' % sessionKey)})
#     search_results = urllib2.urlopen(request)

#     mitre_attack_blob = json.loads(search_results.read())
    
# except Exception as e:
#     errorOut({"status": "ERROR", "description": "Error occurred while grabbing mitre attack", "message": str(e)})


# try:
#     # Getting configurations
#     request = urllib2.Request(base_url + '/services/SSEShowcaseInfo',
#         headers = { 'Authorization': ('Splunk %s' % sessionKey)})
#     search_results = urllib2.urlopen(request)

#     ShowcaseInfo = json.loads(search_results.read())
#     for summaryName in ShowcaseInfo['summaries']:
#       if "mitre_technique" in ShowcaseInfo['summaries'][summaryName] and ShowcaseInfo['summaries'][summaryName]["mitre_technique"] != "":
#         mitres = ShowcaseInfo['summaries'][summaryName]["mitre_technique"].split("|")
#         for mitre in mitres:
#           if mitre != "" and mitre != "None":
#             if mitre not in inScopeTechniques:
#               inScopeTechniques[mitre] = 1
#             else:
#               inScopeTechniques[mitre] += 1

    
# except Exception as e:
#     errorOut({"status": "ERROR", "description": "Error occurred while grabbing SSE ShowcaseInfo", "message": str(e)})



# try:
#     # Getting configurations
#     request = urllib2.Request(base_url + '/services/pullJSON?config=mitrepreattack',
#         headers = { 'Authorization': ('Splunk %s' % sessionKey)})
#     search_results = urllib2.urlopen(request)

#     mitre_preattack_blob = json.loads(search_results.read())
    
# except Exception as e:
#     errorOut({"status": "ERROR", "description": "Error occurred while grabbing mitre preattack", "message": str(e)})

# if which_killchain == "attack": 
#   with open("../appserver/static/vendor/mitre/enterprise-attack.json") as f:
#     if len(mitre_attack_blob.keys()) == 0:
#         mitre_attack_blob = json.load(f)
#         debug.append("Using the file version of the attack blob")
#     else:
#         debug.append("Found the rest endpoint version of the attack blob")
#     debug.append("Attack count" + str(len(mitre_attack_blob['objects'])))
#     for obj in mitre_attack_blob['objects']:
#       if "name" in obj:
#         obj['name'] = obj['name'].replace(u'\xe4', "a")
#         obj['name'] = strip_non_ascii(obj['name'])
#       if "external_references" in obj:
#         for reference in obj['external_references']:
#           if "url" in reference and "type" in obj and (obj["type"] == "attack-pattern" or obj["type"] == "x-mitre-tactic") and ( "https://attack.mitre.org/techniques/" in reference['url'] or "https://attack.mitre.org/tactics/" in reference['url'] ):
#             mitre_names[ reference['external_id'] ] = obj['name']
#             mitre_refs_to_names[obj['id']] = reference['external_id']
#           if "url" in reference and "type" in obj and (obj["type"] == "attack-pattern" or obj["type"] == "x-mitre-tactic") and "https://attack.mitre.org/tactics/" in reference['url']:
#             mitre_tactics[ reference['external_id'] ] = []
#             mitre_tactics_to_pretty_names[ reference['external_id'] ] = obj['name']
#             phase_short_names_to_tactics[ obj['x_mitre_shortname'] ] = reference['external_id']
#         if "type" in obj and obj["type"] == "intrusion-set":
#           mitre_refs_to_names[obj['id']] = obj['name']
#           for reference in obj['external_references']:
#             if "url" in reference and "https://attack.mitre.org/groups" in reference['url']: 
#               mitre_groups[reference['external_id']] = {
#                 "url": reference['url'],
#                 "name": obj["name"]
#               }
#         if "type" in obj and obj['type'] == "relationship":
#             if "intrusion-set" in obj['source_ref'] and "attack-pattern" in obj['target_ref']:
#                 if obj['target_ref'] not in mitre_refs_to_refs:
#                     mitre_refs_to_refs[obj['target_ref']] = []
#                 mitre_refs_to_refs[obj['target_ref']].append(obj['source_ref'])
#             if "intrusion-set" in obj['target_ref'] and "attack-pattern" in obj['source_ref']:
#                 if obj['source_ref'] not in mitre_refs_to_refs:
#                     mitre_refs_to_refs[obj['source_ref']] = []
#                 mitre_refs_to_refs[obj['source_ref']].append(obj['target_ref'])
    
#     for ref in mitre_refs_to_refs:
#         for refvalue in mitre_refs_to_refs[ref]:
#             if mitre_refs_to_names[ref] not in popularTechniques:
#               popularTechniques[mitre_refs_to_names[ref]] = 1
#             else:
#               popularTechniques[mitre_refs_to_names[ref]] += 1
#             if ref in mitre_refs_to_names and refvalue in mitre_refs_to_names and mitre_refs_to_names[refvalue] in groups:
#                 if mitre_refs_to_names[ref] not in mitre_techniques_to_groups:
#                     mitre_techniques_to_groups[mitre_refs_to_names[ref]] = []
#                 if mitre_refs_to_names[refvalue] not in mitre_techniques_to_groups[mitre_refs_to_names[ref]]:
#                     mitre_techniques_to_groups[mitre_refs_to_names[ref]].append(mitre_refs_to_names[refvalue])
    
#     for obj in mitre_attack_blob['objects']:
#       if "external_references" in obj:
#         for reference in obj['external_references']:
#           if "url" in reference and  "https://attack.mitre.org/techniques/" in reference['url'] :
#             if "kill_chain_phases" in obj:
#               for phase in obj['kill_chain_phases']:
#                 if phase['kill_chain_name'] == "mitre-pre-attack" or phase['kill_chain_name'] == "mitre-attack":
#                   if phase['phase_name'] in phase_short_names_to_tactics:
#                     num_content_string = ""
#                     if popularOnly and (reference['external_id'] not in popularTechniques or popularTechniques[reference['external_id']] < popularity_threshold):
#                       continue
#                     if inScopeOnly and reference['external_id'] not in inScopeTechniques:
#                       continue
#                     # if inScopeOnly:
#                     #   if inScopeTechniques[reference['external_id']] > 1:
#                     #     num_content_string = " (" + str(inScopeTechniques[reference['external_id']]) + " items)"
#                     #   else:
#                     #     num_content_string = " (" + str(inScopeTechniques[reference['external_id']]) + " item)"
#                     if reference['external_id'] in mitre_techniques_to_groups:
#                       if prettyPrint:
#                         mitre_tactics[ phase_short_names_to_tactics[ phase['phase_name'] ] ].append(obj['name'] + " (" + ", ".join(mitre_techniques_to_groups[ reference['external_id'] ])  + ")" + num_content_string)
#                       else:
#                         mitre_tactics[ phase_short_names_to_tactics[ phase['phase_name'] ] ].append( reference['external_id'] )
#                     else:
#                       if forGroupOnly:
#                         continue
#                       if prettyPrint:
#                         mitre_tactics[ phase_short_names_to_tactics[ phase['phase_name'] ] ].append(obj['name'] + num_content_string)
#                       else:
#                         mitre_tactics[ phase_short_names_to_tactics[ phase['phase_name'] ] ].append( reference['external_id'] )

# elif which_killchain == "preattack":
#   with open("../appserver/static/vendor/mitre/pre-attack.json") as f:
#     if len(mitre_preattack_blob.keys()) == 0:
#         mitre_attack_blob = json.load(f)
#         debug.append("Using the file version of the preattack blob")
#     else:
#         mitre_attack_blob = mitre_preattack_blob #lazy
#         debug.append("Found the rest endpoint version of the preattack blob")
#     debug.append("Preattack count" + str(len(mitre_attack_blob['objects'])))
#     for obj in mitre_attack_blob['objects']:
#       if "external_references" in obj:
#         for reference in obj['external_references']:
#           if "url" in reference and "type" in obj and (obj["type"] == "attack-pattern" or obj["type"] == "x-mitre-tactic") and ( "https://attack.mitre.org/techniques/" in reference['url'] or "https://attack.mitre.org/tactics/" in reference['url'] ):
#             mitre_names[reference['external_id']] = obj['name']
#           if "url" in reference and "type" in obj and (obj["type"] == "attack-pattern" or obj["type"] == "x-mitre-tactic") and "https://attack.mitre.org/tactics/" in reference['url']:
#             mitre_tactics[reference['external_id']] = []
#             mitre_tactics_to_pretty_names[ reference['external_id'] ] = obj['name']
#             phase_short_names_to_tactics[ obj['x_mitre_shortname'] ] = reference['external_id']

#     for obj in mitre_attack_blob['objects']:
#       if "external_references" in obj:
#         for reference in obj['external_references']:
#           if "url" in reference and  "https://attack.mitre.org/techniques/" in reference['url'] :
#             if "kill_chain_phases" in obj:
#               for phase in obj['kill_chain_phases']:
#                 if phase['kill_chain_name'] == "mitre-pre-attack" or phase['kill_chain_name'] == "mitre-attack":
#                   if phase['phase_name'] in phase_short_names_to_tactics:
#                     num_content_string = ""
#                     if inScopeOnly and reference['external_id'] not in inScopeTechniques:
#                       continue
#                     # if inScopeOnly:
#                     #   if inScopeTechniques[reference['external_id']] > 1:
#                     #     num_content_string = " (" + str(inScopeTechniques[reference['external_id']]) + " items)"
#                     #   else:
#                     #     num_content_string = " (" + str(inScopeTechniques[reference['external_id']]) + " item)"
#                     if prettyPrint:
#                       mitre_tactics[ phase_short_names_to_tactics[ phase['phase_name'] ] ].append(obj['name'] + num_content_string)
#                     else:
#                       mitre_tactics[ phase_short_names_to_tactics[ phase['phase_name'] ] ].append( reference['external_id'] )

# else:
#   print "Error!"
#   print '"' + "Could not find an attack phase called: " + which_killchain.replace('"', '""') + '"'
#   sys.exit()

# #print json.dumps(mitre_tactics, sort_keys = True, indent=4)
# # w = csv.DictWriter(sys.stdout, mitre_tactics.keys())
# # w.writeheader()
# # w.writerow(mitre_tactics)

# # w = csv.writer(sys.stdout)
# # w.writerows(mitre_tactics.items())

# columns = mitre_tactics.keys()
# columns.sort()

# w = csv.writer(sys.stdout)

# if prettyPrint:
#   pretty_columns = []
#   for column in columns:
#     mitre_tactics[column].sort()
#     pretty_columns.append(mitre_tactics_to_pretty_names[column])
#   w.writerow(pretty_columns)
# else:
#   w.writerow(columns)

# longest_key = len(mitre_tactics[max(mitre_tactics, key= lambda x: len(set(mitre_tactics[x])))])
# for i in range(0, longest_key):
#   currentRow = []
#   for tactic in columns:
#     if i < len(mitre_tactics[tactic]):
#       if len(groups)>0:
#         if tactic in mitre_techniques_to_groups:
#           currentRow.append(", ".join(mitre_techniques_to_groups[tactic]))
#         else:  
#           currentRow.append(mitre_tactics[tactic][i])
#       else:
#         currentRow.append(mitre_tactics[tactic][i])
#     else:
#       currentRow.append("")
#   w.writerow(currentRow)
