#!/usr/bin/env python
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



import datetime, time
import json
import csv
import codecs, sys, operator
from cexc import BaseChunkHandler

import json, csv, re, os
import six.moves.urllib.request, six.moves.urllib.parse, six.moves.urllib.error, six.moves.urllib.request, six.moves.urllib.error, six.moves.urllib.parse
from io import open
import splunk.entity, splunk.Intersplunk
from splunk.clilib.cli_common import getConfKeyValue


def RaiseError(errormsg, metadata={ "finished": "finished"}):
  test=[{"ERROR": errormsg}]
  return (
          {'finished': metadata['finished']}, test
          
      )
class SSELookup(BaseChunkHandler):

    def _parse_arguments(self, args):
      setattr(self, "search_name", "search_name")
      self.fieldList = []
      for token in args:
        if not '=' in token:
          self.fieldList.append(token)
          
          continue
    
        (k,v) = token.split('=', 1)
        if k in ["search_name"]:
          setattr(self, k, v)

      if self.search_name == False:
        raise Exception("No field found -- please specify the field you want to analyze") 
      
    # metadata is a dict with the parsed JSON metadata payload.
    # data is a list of dicts, where each dict represents a search result.
    def handler(self, metadata, data):

        # The first chunk is a "getinfo" chunk.
        if metadata['action'] == 'getinfo':
          try:
            args = metadata['searchinfo']['args']
            self.isscheduled = False
            self.scheduled_search_name = ""
            self.debug = ""
            self.debug2 = ""
            self.debug3 = ""
            self.debug4 = ""
            self.dvdebug = []
            self.args = metadata
            self.sessionKey = metadata['searchinfo']['session_key']

            self.owner = metadata['searchinfo']['owner']
            self.app = metadata['searchinfo']['app']
            self.sid = metadata['searchinfo']['sid']
            self.dispatch_path = metadata['searchinfo']['dispatch_dir']
            self.dvdebug.append("Looking for: " + str( metadata['searchinfo']['sid']))
            self.includeAllContent = "false"
            self.globalSourceList = {}
            self.searchTitleToSummaryName = {}
            try:
                f = open(self.dispatch_path + "/info.csv")
                status = [{k: v for k, v in list(row.items())}
                            for row in csv.DictReader(f, skipinitialspace=True)]

                if status[0]['label'] != "":
                    self.isscheduled = True
                    self.scheduled_search_name = status[0]['label']
            except Exception as e:
                self.dvdebug.append("Failed to grab file")
                self.dvdebug.append(str(e))

            settings = dict()

            base_url = "https://" + getConfKeyValue('web', 'settings', 'mgmtHostPort')

            request = six.moves.urllib.request.Request(base_url + '/services/SSEShowcaseInfo?fields=mini&app=' + self.app + '&includeAllContent=' + self.includeAllContent,
                headers = { 'Authorization': ('Splunk %s' % self.sessionKey)})
            search_results = six.moves.urllib.request.urlopen(request)
            self.globalSourceList = json.loads(search_results.read())
            self.url_requested = base_url + '/servicesNS/' + self.owner + '/' + self.app + '/search/jobs/' + self.sid + "?output_mode=json"

            for summaryName in self.globalSourceList['summaries']:
                searchTitles = self.globalSourceList['summaries'][summaryName]['search_title'].split("|")
                for searchTitle in searchTitles:
                    if searchTitle != "":
                        self.searchTitleToSummaryName[searchTitle] = summaryName
          except:
            args = []

          
          self._parse_arguments(args)
          
          return {'type': 'streaming', 'required_fields':[ self.search_name ]}

# Now let's actually apply that baseline
	provide_NA_Fields = ["data_source_categories", "data_source_categories_display"]
	fields = ["name", "channel", "id", "usecase", "__mv_usecase", "category", "__mv_category", "domain", "__mv_domain", "journey", "highlight", "bookmark_status", "bookmark_status_display", "bookmark_user", "displayapp", "app", "datasource", "__mv_datasource", "data_source_categories", "__mv_data_source_categories", "data_source_categories_display", "__mv_data_source_categories_display", "data_available", "data_available_numeric", "productId", "__mv_productId", "enabled", "description", "hasSearch", "includeSSE", "dashboard", "mitre", "__mv_mitre", "mitre_tactic", "__mv_mitre_tactic", "mitre_tactic_display", "__mv_mitre_tactic_display", "mitre_technique", "__mv_mitre_technique", "mitre_technique_display", "__mv_mitre_technique_display", "mitre_sub_technique","__mv_mitre_sub_technique", "mitre_sub_technique_display","__mv_mitre_sub_technique_display", "mitre_techniques_avg_group_popularity", "mitre_matrix", "__mv_mitre_matrix", "mitre_threat_groups", "__mv_mitre_threat_groups", "killchain", "__mv_killchain", "search_title", "__mv_search_title", "alertvolume", "SPLEase", "released", "printable_image", "custom_user", "custom_time", "icon", "mitre_platforms","__mv_mitre_platforms", "hasContentMapping", "industryMapping", "escu_nist", "escu_cis", "soarPlaybookAvailable"]
	doMVConversion = ["usecase", "category" , "domain", "datasource", "data_source_categories", "data_source_categories_display", "mitre", "mitre_tactic", "mitre_tactic_display", "mitre_technique", "mitre_technique_display", "mitre_sub_technique", "mitre_sub_technique_display", "mitre_threat_groups", "mitre_matrix", "killchain", "search_title" , "productId","mitre_platforms"]
	actualFields = self.fieldList
	addAllfields = False
	addMITRE = False
	addMetadata = False
	if len(actualFields) == 0:
		addMetadata = True
	for field in actualFields:
		if field == "mitre" or field == "rba":
			addMITRE = True
		if field == "metadata":
			addMetadata = True
		if field == "all":
			addAllfields = True
	if addAllfields:
		actualFields = fields
	elif addMetadata:
		myFields = ["usecase", "category", "domain", "data_source_categories", "data_source_categories_display", "mitre_tactic", "mitre_tactic_display", "mitre_technique", "mitre_technique_display", "mitre_sub_technique", "mitre_sub_technique_display", "mitre_matrix", "mitre_threat_groups","mitre_platforms", "killchain", "alertvolume","industryMapping", "escu_nist", "escu_cis", "soarPlaybookAvailable"]
		for field in myFields:
			if field not in actualFields:
				actualFields.append(field)
	elif addMITRE:
		actualFields.append("mitre_tactic")
		actualFields.append("mitre_tactic_display")
		actualFields.append("mitre_technique")
		actualFields.append("mitre_technique_display")
		actualFields.append("mitre_sub_technique")
		actualFields.append("mitre_sub_technique_display")
		actualFields.append("mitre_threat_groups")
		actualFields.append("mitre_matrix")
		actualFields.append("mitre_platforms")
	
	
	for record in data:
		summaryName = ""
		if self.isscheduled == True and  self.scheduled_search_name in self.searchTitleToSummaryName:
			summaryName = self.searchTitleToSummaryName[self.scheduled_search_name]
		if self.search_name in record and record[self.search_name] in self.searchTitleToSummaryName:
			summaryName = self.searchTitleToSummaryName[ record[self.search_name] ]
		if summaryName in self.globalSourceList['summaries']:
			for field in actualFields:
				if "__mv_" not in field:
					if (field not in self.globalSourceList['summaries'][summaryName] or self.globalSourceList['summaries'][summaryName][field] == "") and field in provide_NA_Fields:
						self.globalSourceList['summaries'][summaryName][field] = "N/A"
					if field in self.globalSourceList['summaries'][summaryName]:
						if field in doMVConversion:
							items = self.globalSourceList['summaries'][summaryName][field].split("|")
							mvfield = "__mv_" + field
							record.update({field: "\n".join(items)})
							record.update({mvfield: "$" + "$;$".join(items) + "$"})
						else:
							record.update({field: str(self.globalSourceList['summaries'][summaryName][field])})
				
			

	return (
							{'finished': metadata['finished']},
							data
					)


if __name__ == "__main__":
    SSELookup().run()

