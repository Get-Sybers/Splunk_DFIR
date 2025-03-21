
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


sessionKey = ""
owner = "" 
app = "Splunk_Security_Essentials" 
includeAllContent = "false"
ignoreChannelExclusion = "false"
includeJSON = False
cache = True
for line in sys.stdin:
  m = re.search("search:\s*(.*?)$", line)
  if m:
          searchString = six.moves.urllib.parse.unquote(m.group(1))
          if searchString:
            m = re.search("sseanalytics[^\|]*app=\"*\s*([^ \"]*)", searchString)
            if m:
              app = m.group(1)
            m = re.search("sseanalytics[^\|]*include_all=\"*\s*(true|True|TRUE|yes|Yes|YES|1)", searchString)
            if m:
              includeAllContent = "true"
            m = re.search("sseanalytics[^\|]*cache=\"*\s*(false|False|FALSE|no|No|NO|0)", searchString)
            if m:
              cache = False
            m = re.search("sseanalytics[^\|]*ignore_channel_exclusion=\"*\s*(true|True|TRUE|yes|Yes|YES|1)", searchString)
            if m:
              ignoreChannelExclusion = "true"
            m = re.search("sseanalytics[^\|]*include_json=\"*\s*(true|True|TRUE|yes|Yes|YES|1)", searchString)
            if m:
              includeJSON = True
  m = re.search("sessionKey:\s*(.*?)$", line)
  if m:
          sessionKey = m.group(1)
  m = re.search("owner:\s*(.*?)$", line)
  if m:
          owner = m.group(1)

import splunk.entity, splunk.Intersplunk
settings = dict()

from splunk.clilib.cli_common import getConfKeyValue


base_url = "https://" + getConfKeyValue('web', 'settings', 'mgmtHostPort')
caching = "cached"
if not cache:
  caching = "requireupdate"
request = six.moves.urllib.request.Request(base_url + '/services/SSEShowcaseInfo?app=' + app + '&ignoreChannelExclusion=' + ignoreChannelExclusion + '&includeAllContent=' + includeAllContent,
     headers = { 'Authorization': ('Splunk %s' % sessionKey)})
search_results = six.moves.urllib.request.urlopen(request)
globalSourceList = json.loads(search_results.read())

provide_NA_Fields = ["data_source_categories", "data_source_categories_display"]
fields = ["name", "channel", "id", "usecase", "__mv_usecase", "category", "__mv_category", "domain", "__mv_domain", "journey", "securityDataJourney", "highlight", "bookmark_status", "bookmark_status_display", "bookmark_user", "displayapp", "app", "datasource", "__mv_datasource", "data_source_categories", "__mv_data_source_categories", "data_source_categories_display", "__mv_data_source_categories_display", "data_available", "data_available_numeric", "productId", "__mv_productId", "enabled", "description", "hasSearch", "includeSSE", "dashboard", "mitre", "__mv_mitre", "mitre_tactic", "__mv_mitre_tactic", "mitre_tactic_display", "__mv_mitre_tactic_display", "mitre_technique", "__mv_mitre_technique", "mitre_technique_display", "__mv_mitre_technique_display", "mitre_sub_technique","__mv_mitre_sub_technique", "mitre_sub_technique_display","__mv_mitre_sub_technique_display","mitre_technique_combined","__mv_mitre_technique_combined", "mitre_id","__mv_mitre_id", "mitre_id_combined","__mv_mitre_id_combined", "mitre_techniques_avg_group_popularity", "mitre_matrix", "__mv_mitre_matrix", "mitre_threat_groups", "__mv_mitre_threat_groups", "killchain", "__mv_killchain", "search_title", "__mv_search_title", "alertvolume", "SPLEase", "released", "printable_image", "custom_user", "custom_time", "icon", "mitre_platforms","__mv_mitre_platforms", "mitre_software","__mv_mitre_software", "hasContentMapping", "industryMapping", "escu_nist", "escu_cis", "soarPlaybookAvailable","datamodel", "__mv_datamodel","analytic_story", "__mv_analytic_story", "risk_object_type", "__mv_risk_object_type", "threat_object_type", "__mv_threat_object_type", "risk_score", "risk_message"]
doMVConversion = ["usecase", "category" , "domain", "datasource", "data_source_categories", "data_source_categories_display", "mitre", "mitre_tactic", "mitre_tactic_display", "mitre_technique", "mitre_technique_display", "mitre_sub_technique", "mitre_sub_technique_display","mitre_technique_combined","mitre_id","mitre_id_combined", "mitre_threat_groups", "mitre_matrix", "killchain", "search_title" , "productId","mitre_platforms","mitre_software","datamodel","analytic_story","risk_object_type","threat_object_type"]
if includeJSON:
  print(",".join(fields) + ",summaries")
else:
  print(",".join(fields))


regex = '"'
for summaryName in globalSourceList['summaries']:
  line = json.dumps(globalSourceList['summaries'][summaryName], sort_keys=True)
  output = ""
  for field in fields:
    if "__mv_" not in field:
      if (field not in globalSourceList['summaries'][summaryName] or globalSourceList['summaries'][summaryName][field] == "") and field in provide_NA_Fields:
        globalSourceList['summaries'][summaryName][field] = "N/A"
      if field in globalSourceList['summaries'][summaryName]:
        # output += '"' + re.sub('\n', '\r', re.sub('"', '""', globalSourceList['summaries'][summaryName][field])) + '",'
        if field in doMVConversion:
          items = globalSourceList['summaries'][summaryName][field].split("|")
          output += '"' + re.sub('"', '""', "\n".join(items) ) + '",'
          output += '"' + re.sub('"', '""', "$" + "$;$".join(items) + "$") + '",'
          #output += '"' + re.sub('"', '""', re.sub('\n', '', "$" + "$\n$".join(items) + "$")) + '",'
          #output += '"' + re.sub('"', '""', re.sub('\|', '\n', re.sub('\n', '', globalSourceList['summaries'][summaryName][field]))) + '",'
        else: #if type(globalSourceList['summaries'][summaryName][field]) == str:
          output += '"' + re.sub('\n', '\r', re.sub('"', '""', str(globalSourceList['summaries'][summaryName][field]))) + '",'
        #else:
        #  output += '"' + str(globalSourceList['summaries'][summaryName][field]) + '",'
      else:
        output += ','
  if includeJSON:
    output += '"' + re.sub('\n', '', re.sub('"', '""', line)) + '"'
  print(output)
