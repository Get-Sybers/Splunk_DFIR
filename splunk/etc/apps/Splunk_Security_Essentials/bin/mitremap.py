#!/usr/bin/python

import sys
from splunk.appserver.mrsparkle.lib.util import make_splunkhome_path
from MitreAttackInfo import MitreAttackInfo
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


import json, csv, re, os
import six.moves.urllib.request, six.moves.urllib.parse, six.moves.urllib.error, six.moves.urllib.request


from splunk.clilib.cli_common import getConfKeyValue

from io import open
from six.moves import range


app = "Splunk_Security_Essentials" 
which_killchain = "attack"
output="matrix"
matrix_lookup_file = ""
matrix_lookup_filename = ""
matrix_lookup_path = "../lookups/"
prettyPrint = True
debug = []
EnableDebug = True
sessionKey = ""
owner = ""
groups = []
platforms= []
inScopeOnly = False
popularOnly = False
forGroupOnly = False
techniquesOnly = False
techniques= []
popularity_threshold = 3
bookmarkedOnly = False
refresh_matrix_cache = False
use_cache = True

for line in sys.stdin:
  m = re.search("search:\s*(.*?)$", line)
  if m:
          searchString = six.moves.urllib.parse.unquote(m.group(1))
          if searchString:
            m = re.search("mitremap[^\|]*name=\"*\s*([^ \"]*)", searchString)
            if m:
              which_killchain = m.group(1)
            m = re.search("mitremap[^\|]*refresh_cache=\"*\s*([^ \"]*)", searchString)
            if m:
              if m.group(1).lower() == "true":
                refresh_matrix_cache = True
            m = re.search("mitremap[^\|]*pretty=\"*\s*([^ \"]*)", searchString)
            if m:
              if m.group(1).lower() == "false":
                prettyPrint = False
                use_cache = False
            m = re.search("mitremap[^\|]*content_available=\"*\s*([^ \"]*)", searchString)
            if m:
              if m.group(1).lower() == "true":
                inScopeOnly = True
                use_cache = False
            m = re.search("mitremap[^\|]*group_only=\"*\s*([^ \"]*)", searchString)
            if m:
              if m.group(1).lower() == "true":
                forGroupOnly = True
                use_cache = False
            m = re.search("mitremap[^\|]*bookmarked_only=\"*\s*([^ \"]*)", searchString)
            if m:
              if m.group(1).lower() == "true":
                bookmarkedOnly = True
                use_cache = False
            m = re.search("mitremap[^\|]*min_popularity=\"*\s*([^ \"]*)", searchString)
            if m:
              try:
                popularity_threshold = int(m.group(1))
              except:
                popularity_threshold = 3
            m = re.search("mitremap[^\|]*popular_only=\"*\s*([^ \"]*)", searchString)
            if m:
              if m.group(1).lower() == "true":
                popularOnly = True
                use_cache = False
            m = re.search("mitremap[^\|]*groups=\"([^ ]* [^=\"]*)\"", searchString)
            if m:
              groupstr = m.group(1)
              localgroups = groupstr.split(",")
              for group in localgroups:
                group = group.strip()
                if group not in groups:
                  groups.append(group)
              use_cache = False
            m = re.search("mitremap[^\|]*groups=\"([^\" ]*)\"", searchString)
            if m:
              groupstr = m.group(1)
              localgroups = groupstr.split(",")
              for group in localgroups:
                group = group.strip()
                if group not in groups:
                  groups.append(group)
              use_cache = False
            m = re.search("mitremap[^\|]*techniques=\"([^\"]*)\"", searchString)
            if m:
              techniquesstr = m.group(1)
              techniques_input = techniquesstr.split(",")
              techniquesOnly = True
              use_cache = False
              if (len(techniques_input)>0):
                for technique in techniques_input:
                  technique = technique.strip().split(".")[0]
                  if technique not in techniques:
                    techniques.append(technique)
                  if technique in "*":
                    techniquesOnly = False
                    use_cache = False
                    
            m = re.search("mitremap[^\|]*platforms=\"([^ ]*( |)[^=\"]*)\"", searchString)
            matrix_lookup_filename = "mitre_enterprise_matrix.csv"
            matrix_lookup_file = matrix_lookup_path+matrix_lookup_filename
            if m:
              platformstr = m.group(1)
              localgroups = platformstr.split(",")
              if len(localgroups)==1:
                if (localgroups[0].lower()=="enterprise" or localgroups[0].lower()=="*"):
                  matrix_lookup_filename = "mitre_enterprise_matrix.csv"
                else:
                  matrix_lookup_filename = "mitre_"+ localgroups[0].replace(" ", "_").lower()+ "_matrix.csv"
                matrix_lookup_file = matrix_lookup_path+matrix_lookup_filename
              elif len(localgroups)==5:
                # Special case for Cloud matrix
                platforms_input = ([x.lower() for x in localgroups]).sort()
                cloud = (["office 365","azure ad","google workspace","saas","iaas"]).sort()
                if (platforms_input == cloud):
                  matrix_lookup_filename = "mitre_cloud_matrix.csv"
                else:
                  refresh_matrix_cache = False
                  use_cache = False
              else:
                # It gets complicated when you select many platforms. Don't use the cache in that instance
                refresh_matrix_cache = False
                use_cache = False
              for platform in localgroups:
                platform = platform.strip()
                if platform.lower() not in platforms:
                  if (platform.lower()=="cloud"):
                    platforms.append("office 365")
                    platforms.append("azure ad")
                    platforms.append("google workspace")
                    platforms.append("saas")
                    platforms.append("iaas")
                  elif (platform.lower()=="enterprise" or platform.lower()=="*"):
                    platforms= []
                  else:
                    platforms.append(platform.lower())

            m = re.search("mitremap[^\|]*output=\"*\s*([^ \"]*)", searchString)
            if m:
              if m.group(1).lower() == "list":
                output = "list"
              else:
                output = "matrix"

  m = re.search("sessionKey:\s*(.*?)$", line)
  if m:
    sessionKey = m.group(1)
  m = re.search("owner:\s*(.*?)$", line)
  if m:
    owner = m.group(1)


lookups = LookupHelper(sessionKey)

# If we have passed the refresh_cache flag, delete all existing cache files as we want to refresh all of them
if refresh_matrix_cache == True:
    import glob
    files = glob.glob(matrix_lookup_path+'mitre_*_matrix.csv')
    for file in files:
      lookup_filename = os.path.basename(file)    
      lookups.deleteLookup(lookup_filename)

# Only return the cached content from the lookup, rather than pull and parse it again
if output == "matrix" and refresh_matrix_cache == False and use_cache:
    if os.path.exists(matrix_lookup_file):
        with open(matrix_lookup_file) as f:
            print(f.read())
        exit()
    else:
      refresh_matrix_cache = True

def strip_non_ascii(string):
    ''' Returns the string without non ASCII characters'''
    stripped = (c for c in string if 0 < ord(c) < 127)
    return ''.join(stripped)

def errorOut(obj):
  print("Error!")
  print('"' + json.dumps(obj).replace('"', '""') + '"')
  sys.exit()

mitre_names = {}
phase_short_names_to_tactics = {}
mitre_tactics = {}
mitre_tactics_to_pretty_names = {}
mitre_techniques = {}
mitre_attack_blob = {}
mitre_groups = {}
mitre_software = {}
mitre_techniques_to_groups = {}
mitre_techniques_to_software = {}
mitre_techniques_to_malware = {}
mitre_refs_to_refs = {}
mitre_refs_to_names = {}
ShowcaseInfo = {"summaries": {}}
inScopeTechniques = {}
popularTechniques = {}
bookmarkedTechniques = {}
columns = {}

if inScopeOnly or bookmarkedOnly:
    try:
        # Getting configurations
        base_url = "https://" + getConfKeyValue('web', 'settings', 'mgmtHostPort')
    except:
        errorOut({"response": "Error getting configurations!"})

    try:
        # Getting configurations
        request = six.moves.urllib.request.Request(base_url + '/services/SSEShowcaseInfo',
            headers = { 'Authorization': ('Splunk %s' % sessionKey)})
        search_results = six.moves.urllib.request.urlopen(request)

        ShowcaseInfo = json.loads(search_results.read())
        for summaryName in ShowcaseInfo['summaries']:
          if "mitre_technique" in ShowcaseInfo['summaries'][summaryName] and ShowcaseInfo['summaries'][summaryName]["mitre_technique"] != "":
            mitres = ShowcaseInfo['summaries'][summaryName]["mitre_technique"].split("|")
            bookmark_status = ShowcaseInfo['summaries'][summaryName]["bookmark_status"]
            for mitre in mitres:
              if mitre != "" and mitre != "None":
                if mitre not in inScopeTechniques:
                  inScopeTechniques[mitre] = 1
                else:
                  inScopeTechniques[mitre] += 1
                if (bookmark_status != "none"):
                  if mitre not in bookmarkedTechniques:
                    bookmarkedTechniques[mitre] = 1
                  else:
                    bookmarkedTechniques[mitre] += 1
        
    except Exception as e:
        errorOut({"status": "ERROR", "description": "Error occurred while grabbing SSE ShowcaseInfo", "message": str(e)})


if which_killchain == "attack": 
  info = MitreAttackInfo(sessionKey)
  mitre_attack_blob = info.returnMitreAttackBlob()
  AllMitreTactics = info.returnMitreAttackIdsList()
  columns = AllMitreTactics
  
  for obj in mitre_attack_blob['objects']:
    if "name" in obj:
      obj['name'] = obj['name'].replace(u'\xe4', "a")
      obj['name'] = strip_non_ascii(obj['name'])
    if "external_references" in obj:
      for reference in obj['external_references']:
        if "url" in reference and "type" in obj and (obj["type"] == "attack-pattern" or obj["type"] == "x-mitre-tactic") and ( "https://attack.mitre.org/techniques/" in reference['url'] or "https://attack.mitre.org/tactics/" in reference['url'] ):
          mitre_names[ reference['external_id'] ] = obj['name']
          mitre_refs_to_names[obj['id']] = reference['external_id']
        if "url" in reference and "type" in obj and (obj["type"] == "attack-pattern" or obj["type"] == "x-mitre-tactic") and "https://attack.mitre.org/tactics/" in reference['url']:
          mitre_tactics[ reference['external_id'] ] = []
          mitre_tactics_to_pretty_names[ reference['external_id'] ] = obj['name']
          phase_short_names_to_tactics[ obj['x_mitre_shortname'] ] = reference['external_id']
      if "type" in obj and obj["type"] == "intrusion-set":
        mitre_refs_to_names[obj['id']] = obj['name']
        for reference in obj['external_references']:
          if "url" in reference and "https://attack.mitre.org/groups" in reference['url']: 
            mitre_groups[reference['external_id']] = {
              "url": reference['url'],
              "name": obj["name"]
            }
      if "type" in obj and (obj["type"] == "tool" or obj["type"] == "malware"):
        mitre_refs_to_names[obj['id']] = obj['name']
        for reference in obj['external_references']:
          if "url" in reference and "https://attack.mitre.org/software" in reference['url']: 
            mitre_software[reference['external_id']] = {
              "url": reference['url'],
              "name": obj["name"]
            }
      if "type" in obj and obj['type'] == "relationship":
          if "intrusion-set" in obj['source_ref'] and "attack-pattern" in obj['target_ref']:
              if obj['target_ref'] not in mitre_refs_to_refs:
                  mitre_refs_to_refs[obj['target_ref']] = []
              mitre_refs_to_refs[obj['target_ref']].append(obj['source_ref'])
          if "intrusion-set" in obj['target_ref'] and "attack-pattern" in obj['source_ref']:
              if obj['source_ref'] not in mitre_refs_to_refs:
                  mitre_refs_to_refs[obj['source_ref']] = []
              mitre_refs_to_refs[obj['source_ref']].append(obj['target_ref'])
              
          if ("tool" in obj['source_ref'] or "malware" in obj['source_ref']) and "attack-pattern" in obj['target_ref']:
              if obj['target_ref'] not in mitre_refs_to_refs:
                  mitre_refs_to_refs[obj['target_ref']] = []
              mitre_refs_to_refs[obj['target_ref']].append(obj['source_ref'])
          if ("tool" in obj['target_ref'] or "malware" in obj['target_ref']) and "attack-pattern" in obj['source_ref']:
              if obj['source_ref'] not in mitre_refs_to_refs:
                  mitre_refs_to_refs[obj['source_ref']] = []
              mitre_refs_to_refs[obj['source_ref']].append(obj['target_ref'])
  
  for ref in mitre_refs_to_refs:
      for refvalue in mitre_refs_to_refs[ref]:
          if mitre_refs_to_names[ref] not in popularTechniques:
            popularTechniques[mitre_refs_to_names[ref]] = 1
          else:
            popularTechniques[mitre_refs_to_names[ref]] += 1
          if ref in mitre_refs_to_names and refvalue in mitre_refs_to_names and ((mitre_refs_to_names[refvalue] in groups) or (output=="list")):
              if "intrusion-set" in refvalue and mitre_refs_to_names[ref] not in mitre_techniques_to_groups:
                  mitre_techniques_to_groups[mitre_refs_to_names[ref]] = []
              if "intrusion-set" in refvalue and mitre_refs_to_names[refvalue] not in mitre_techniques_to_groups[mitre_refs_to_names[ref]]:
                  mitre_techniques_to_groups[mitre_refs_to_names[ref]].append(mitre_refs_to_names[refvalue])
              if ("tool" in refvalue or "malware" in refvalue) and mitre_refs_to_names[ref] not in mitre_techniques_to_software:
                  mitre_techniques_to_software[mitre_refs_to_names[ref]] = []
              if ("tool" in refvalue or "malware" in refvalue) and mitre_refs_to_names[refvalue] not in mitre_techniques_to_software[mitre_refs_to_names[ref]]:
                  mitre_techniques_to_software[mitre_refs_to_names[ref]].append(mitre_refs_to_names[refvalue])
  
  for obj in mitre_attack_blob['objects']:
    if "external_references" in obj:
      for reference in obj['external_references']:
        if "url" in reference and  "https://attack.mitre.org/techniques/" in reference['url']:
          excluded=False
          if ("revoked" in obj and obj["revoked"]==True) or (obj["description"].find("This technique has been deprecated")>-1):
            excluded=True
          if "kill_chain_phases" in obj and not excluded and output=="matrix" and "." not in reference['external_id']:
            for phase in obj['kill_chain_phases']:
              if phase['kill_chain_name'] == "mitre-pre-attack" or phase['kill_chain_name'] == "mitre-attack":
                if phase['phase_name'] in phase_short_names_to_tactics:
                  num_content_string = ""
                  if popularOnly and (reference['external_id'] not in popularTechniques or popularTechniques[reference['external_id']] < popularity_threshold):
                    continue
                  if inScopeOnly and reference['external_id'] not in inScopeTechniques:
                    continue
                  if bookmarkedOnly and reference['external_id'] not in bookmarkedTechniques:
                    continue
                  if techniquesOnly and reference['external_id'] not in techniques:
                    continue
                  # if inScopeOnly:
                  #   if inScopeTechniques[reference['external_id']] > 1:
                  #     num_content_string = " (" + str(inScopeTechniques[reference['external_id']]) + " items)"
                  #   else:
                  #     num_content_string = " (" + str(inScopeTechniques[reference['external_id']]) + " item)"
                  
                  if len(platforms)>0:
                    platform_exclusion=True
                    for platform in platforms:
                      for x_mitre_platforms in obj['x_mitre_platforms']:
                        if platform in x_mitre_platforms.lower():
                          platform_exclusion=False
                    if platform_exclusion==True:
                      continue

                  if reference['external_id'] in mitre_techniques_to_groups:
                    if prettyPrint:
                      mitre_tactics[ phase_short_names_to_tactics[ phase['phase_name'] ] ].append(obj['name'] + " (" + ", ".join(mitre_techniques_to_groups[ reference['external_id'] ])  + ")" + num_content_string)
                    else:
                      mitre_tactics[ phase_short_names_to_tactics[ phase['phase_name'] ] ].append( reference['external_id'] )
                  else:
                    if forGroupOnly:
                      continue
                    if prettyPrint:
                      mitre_tactics[ phase_short_names_to_tactics[ phase['phase_name'] ] ].append(obj['name'] + num_content_string)
                    else:
                      mitre_tactics[ phase_short_names_to_tactics[ phase['phase_name'] ] ].append( reference['external_id'] )
          elif "kill_chain_phases" in obj and not excluded and output=="list":
            for phase in obj['kill_chain_phases']:              
              if phase['kill_chain_name'] == "mitre-pre-attack" or phase['kill_chain_name'] == "mitre-attack":
                if phase['phase_name'] in phase_short_names_to_tactics:
                  matrix_pretty_name="Enterprise ATT&CK"
                  if (phase['kill_chain_name'] == "mitre-pre-attack"):
                    matrix_pretty_name="PRE-ATT&CK"
                  
                  if "." in reference['external_id']:
                    techniqueId=reference['external_id'].split(".")[0]
                    techniqueName=mitre_names[techniqueId]
                    sub_techniqueId=reference['external_id']
                    sub_techniqueName=obj['name']
                    techniqueIdCombined=reference['external_id']
                  else:
                    techniqueId=reference['external_id']
                    techniqueName=mitre_names[reference['external_id']]
                    sub_techniqueId="-"
                    sub_techniqueName="-"
                    techniqueIdCombined=reference['external_id']
                  
                  platforms = ""
                  data_sources = "-"
                  threat_groups = "-"
                  software = "-"
                  
                  if reference['external_id'] in mitre_techniques_to_groups:
                    threat_groups = "|".join(mitre_techniques_to_groups[ reference['external_id'] ])
                  if techniqueIdCombined in mitre_techniques_to_software:
                    software = "|".join(mitre_techniques_to_software[ techniqueIdCombined ])
                    
                  if "x_mitre_platforms" in obj:  
                    platforms = "|".join(obj['x_mitre_platforms'])
                  if "x_mitre_data_sources" in obj:  
                    data_sources = "|".join(obj['x_mitre_data_sources'])

                  mitre_techniques[phase_short_names_to_tactics[phase['phase_name']]+" - "+reference['external_id']] = [matrix_pretty_name,phase_short_names_to_tactics[phase['phase_name']],mitre_tactics_to_pretty_names[phase_short_names_to_tactics[phase['phase_name']]],1,techniqueId,techniqueName, 1,sub_techniqueId,sub_techniqueName,1,techniqueIdCombined,threat_groups,platforms,data_sources,software]

else:
  print("Error!")
  print('"' + "Could not find an attack phase called: " + which_killchain.replace('"', '""') + '"')
  sys.exit()

#print json.dumps(mitre_tactics, sort_keys = True, indent=4)
# w = csv.DictWriter(sys.stdout, mitre_tactics.keys())
# w.writeheader()
# w.writerow(mitre_tactics)

# w = csv.writer(sys.stdout)
# w.writerows(mitre_tactics.items())




w = csv.writer(sys.stdout)
all_rows = []
if output=="list":
  list_columns = []
  list_columns.append("Matrix")
  list_columns.append("TacticId")
  list_columns.append("Tactic")
  list_columns.append("Tactic_Order")
  list_columns.append("TechniqueId")
  list_columns.append("Technique")
  list_columns.append("Technique_Order")
  list_columns.append("Sub_TechniqueId")
  list_columns.append("Sub_Technique")
  list_columns.append("Sub_Technique_Order")
  list_columns.append("TechniqueIdCombined")
  list_columns.append("Threat_Groups")
  list_columns.append("Platforms")
  list_columns.append("Data_Sources")
  list_columns.append("Software")
  list_columns.append("Version")
  w.writerow(list_columns)
elif prettyPrint:
  pretty_columns = []
  for column in columns:
    mitre_tactics[column].sort()
    pretty_columns.append(mitre_tactics_to_pretty_names[column])
  #w.writerow(pretty_columns)
  all_rows.append(pretty_columns)
else:
  w.writerow(columns)

if (output=="matrix"):
  longest_key = len(mitre_tactics[max(mitre_tactics, key= lambda x: len(set(mitre_tactics[x])))])
  for i in range(0, longest_key):
    currentRow = []
    for tactic in columns:
      if i < len(mitre_tactics[tactic]):
        if len(groups)>0:
          if tactic in mitre_techniques_to_groups:
            currentRow.append(", ".join(mitre_techniques_to_groups[tactic]))
          else:  
            currentRow.append(mitre_tactics[tactic][i])
        else:
          currentRow.append(mitre_tactics[tactic][i])
      else:
        currentRow.append("")
    # right here is where we would need to add each list to a list and start iterating through
    all_rows.append(currentRow)

  # the way this works is using a list of lists we first identify how many columns there are
  # a dict then gets created with a numberic key starting at 0 for each column
  # the value for that key gets initialized with an empty list
  # iterate through the rows and check each element in the row. 
  # the end result is a dict that each key corresponds to a row and has a list that tracks whether or not it has an element
  # use that to then find all of the columns that do not have any content and create a new list of columns to delete

  final_rows = []
  total_columns = 0
  columns_to_delete = []
  # get the total number of columns
  for i in all_rows:
    total_columns = len(i)


  csv_tracker = {}
  for i in range(0,total_columns):
      csv_tracker[i] = []

  # create this  as an iterator outside the loop since we need to skip the first row with the tactic names
  allRows = iter(all_rows)
  next(allRows)
  for row in allRows:
    # check each column of our one row and update our dict. if a cell has a value we add a 1                            
    # if not we add a 0                                                                                                 
    # dict gets updated based on the key and the column number                                                          
    for column in range(0,total_columns):
      if row[column] == "":
        csv_tracker[column].append(0)
      else:
        csv_tracker[column].append(1)

  # now that we have somewhat of a structure find any of the lists that are all 0's                                           
  for i in csv_tracker:
      delete = True
      # iterate through each k,v pair in the dict                                                                             
      for j in csv_tracker[i]:
          # iterate through the list for the key. if we find a 1 we set delete to false                                       
          if j == 1:
              delete = False
      # assuming we didn't find a 1 we add that key from our dict to our final list of columns to remove                      
      if delete == True:
          columns_to_delete.append(i)

  cols_to_remove = sorted(columns_to_delete, reverse=True) # Reverse so we remove from the end first                          
  row_count = 0 # Current amount of rows processed

  # Determine if the matrix lookup cache should be updated or not. Only do this if anything actually returned. 
  matrix_writer = None
  if refresh_matrix_cache == True and longest_key>0 and use_cache:
    lookup_tmp =  make_splunkhome_path(['var', 'run', 'splunk', 'lookup_tmp'])
    if not os.path.exists(lookup_tmp):
      os.makedirs(lookup_tmp)
    matrix_lookup_filename_tmp = str(lookup_tmp) + "/" + str(matrix_lookup_filename)
    # debug.append({"message": "lookup_tmp", lookup_tmp: lookup_tmp})
    # debug.append({"message": "matrix_lookup_filename_tmp", matrix_lookup_filename_tmp: matrix_lookup_filename_tmp})
    # if EnableDebug:
    #   print(json.dumps(debug))
    # Write the new lookup to the temp folder on the local sh
    matrix_file = open(matrix_lookup_filename_tmp, "w")
    matrix_writer = csv.writer(matrix_file)

  for row in all_rows:
    row_count += 1                                             
    for col_index in cols_to_remove:
      del row[col_index]
    w.writerow(row)
    if matrix_writer:
        matrix_writer.writerow(row)

# Add the returned matrix to the lookup cache. Only do this if antyhing actually returned.
  if refresh_matrix_cache and longest_key>0 and use_cache:
    matrix_file.close()      
    lookups.addLookup(matrix_lookup_filename)
    

else:
  mitre_techniques = dict( sorted(mitre_techniques.items(),
                           key=lambda item: item[1],
                           reverse=False))
  tacticCounter=1
  techniqueCounter=1
  sub_techniqueCounter=0
  currentTactic = ""
  currentTechnique = ""
  version = "-"
  if "version" in mitre_attack_blob:
      version = mitre_attack_blob['version']
  for technique in mitre_techniques:
    currentRow = []
    if (len(currentTactic) == 0):
      currentTactic=mitre_techniques[technique][1]
    if (len(currentTechnique) == 0):
      currentTechnique=mitre_techniques[technique][4]
    if currentTactic not in mitre_techniques[technique][1]:
      tacticCounter+=1
      techniqueCounter=1
      sub_techniqueCounter=1
      currentTactic=mitre_techniques[technique][1]
    if currentTechnique not in mitre_techniques[technique][4]:
      techniqueCounter+=1
      currentTechnique=mitre_techniques[technique][4]
      sub_techniqueCounter=0
    
    for i in range(0, len(mitre_techniques[technique])):
      if technique in mitre_techniques and i<len(mitre_techniques[technique]):
        if (i==3):
          currentRow.append(AllMitreTactics.index(currentTactic)+1)
        elif (i==6):
          currentRow.append(techniqueCounter)
        elif (i==9):
          if sub_techniqueCounter==0:
            currentRow.append("")
          else:
            currentRow.append(sub_techniqueCounter)
          sub_techniqueCounter+=1
        else:
          currentRow.append(mitre_techniques[technique][i])
    currentRow.append(version)
    
    w.writerow(currentRow)
