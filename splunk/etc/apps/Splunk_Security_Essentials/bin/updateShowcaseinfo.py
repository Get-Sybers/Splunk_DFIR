import sys
from splunk.appserver.mrsparkle.lib.util import make_splunkhome_path
from MitreAttackHelper import MitreAttackHelper

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
from time import sleep
import six.moves.urllib.request, six.moves.urllib.parse, six.moves.urllib.error, six.moves.urllib.request, six.moves.urllib.error, six.moves.urllib.parse
import requests, ssl, shutil
import re

import pprint
pp = pprint.PrettyPrinter(indent=4)
from io import open


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

# import logging as logger

# logger.basicConfig(filename=splunk_home + '/var/log/splunk/updateShowcaseinfo.log', level=logger.DEBUG)
# logger.debug("Logger Configured")
sys.path.append(splunk_home + '/etc/apps/Splunk_Security_Essentials/bin/')
sys.path.append(splunk_home + '/etc/apps/Splunk_Security_Essentials/bin/splunklib/')

import splunklib.client as client
import splunklib.results as results

SPLUNK_PGP_KEY_URL = "https://docs.splunk.com/images/6/6b/SplunkPGPKey.pub"

class updateShowcaseinfo(PersistentServerConnectionApplication):
    def __init__(self, command_line, command_arg):
        PersistentServerConnectionApplication.__init__(self)

    def handle(self, in_string):
        debug = []
        debugEnabled = False
        doWrite = True
        app = "Splunk_Security_Essentials"
        kvstore = "sse_json_doc_storage"
        kvstore_showcaseinfo = "showcaseinfo"
        q=""
        tactics_for_zero_trust = ["Initial Access","Persistence","Privilege Escalation","Credential Access","Lateral Movement","Exfiltration"]

        path = os.environ['SPLUNK_HOME'] + "/etc/apps/" + app + "/appserver/static/"
        pathToShowcaseInfo = os.environ['SPLUNK_HOME'] + "/etc/apps/" + app + "/appserver/static/components/localization/"
        pathToLookups = os.environ['SPLUNK_HOME'] + "/etc/apps/" + app + "/lookups/"

        try:
            input = json.loads(in_string)
            sessionKey = input['session']['authtoken']
            owner = input['session']['user']
            reason = ""
            forJson = ""
            if "query" in input:
                for pair in input['query']:
                    if pair[0] == "reason":
                        reason = pair[1]
                    if pair[0] == "for":
                        forJson = pair[1]
            #This takes input queries. Disabled in normal operations
            # if "query" in input:
            #     for pair in input['query']:
            #         if pair[0] == "q":
            #             q = pair[1]
        except:
            return {'payload': json.dumps({"response": "Error! Couldn't find any initial input. This shouldn't happen."}),
                    'status': 500          # HTTP status code
            }

        try:
            # Getting configurations
            mgmtHostname, mgmtHostPort = getConfKeyValue('web', 'settings', 'mgmtHostPort').split(":")
            base_url = "https://" + mgmtHostname + ":" + mgmtHostPort
        except Exception as e:
            # debug.append(json.dumps({"status": "ERROR", "description": "Error getting the base_url configuration!", "message": str(e)}))
            throwErrorMessage = True

        try:
            service = client.connect(host=mgmtHostname, port=mgmtHostPort, token=sessionKey)
            service.namespace['owner'] = 'nobody'
            service.namespace['app'] = 'Splunk_Security_Essentials'
        except Exception as e:
            # debug.append(json.dumps({"status": "ERROR", "description": "Error grabbing a service object", "message": str(e)}))
            throwErrorMessage = True

        input = {}
        payload = {}
        mitre_helper = MitreAttackHelper(sessionKey)

        def getKVStore(store,query=""):
            debug.append({"message": "I got a kvstore request", "store": store})
            try:
                service = client.connect(token=sessionKey)
                service.namespace['owner'] = 'nobody'
                service.namespace['app'] = 'Splunk_Security_Essentials'
                # debug.append({"message": "input is", "q": q})
                if (query!=""):
                    debug.append({"message": "Inside kvstore with query", "query": query})
                    kvstore_output = service.kvstore[store].data.query(query=query)
                else:
                    kvstore_output = service.kvstore[store].data.query()
            except Exception as e:
                total_url = base_url + '/servicesNS/nobody/' + app + "/storage/collections/data/" + store
                #debug.append({"status": "Failed to do primary method, reverting to old", "url": total_url, "traceback": traceback.format_exc(), "error": str(e)})
                request = six.moves.urllib.request.Request(total_url,
                    headers = { 'Authorization': ('Splunk %s' % sessionKey)})
                search_results = six.moves.urllib.request.urlopen(request)

                kvstore_output = json.loads(search_results.read())
            debug.append({"message": "kvstore_output", "kvstore_output": kvstore_output})
            return kvstore_output
        def getKVStoreById(store, id):
            try:
                kvstore_output = service.kvstore[store].data.query_by_id(id)
            except:
                #sseshowcase.ja-JP
                #request = urllib2.Request(base_url + '/servicesNS/nobody/' + app + '/storage/collections/data/sse_json_doc_storage/?query={"_key":"' + "sseshowcase" + desired_locale + '"}',
                total_url = base_url + '/servicesNS/nobody/' + app + "/storage/collections/data/" + store + "/" + id
                request = six.moves.urllib.request.Request(total_url,
                    headers = { 'Authorization': ('Splunk %s' % sessionKey)})
                search_results = six.moves.urllib.request.urlopen(request)

                kvstore_output = json.loads(search_results.read())
            return kvstore_output

        def runSearch(query):
            searchquery_normal = query
            kwargs_normalsearch = {"exec_mode": "normal"}
            job = service.jobs.create(searchquery_normal, **kwargs_normalsearch)

            # A normal search returns the job's SID right away, so we need to poll for completion
            # while True:
            #     while not job.is_ready():
            #         pass
            #     stats = {"isDone": job["isDone"],
            #             "doneProgress": float(job["doneProgress"])*100,
            #             "scanCount": int(job["scanCount"]),
            #             "eventCount": int(job["eventCount"]),
            #             "resultCount": int(job["resultCount"])}
            #     if stats["isDone"] == "1":
            #         break
            #     sleep(1)

            # # Get the results and display them
            # # for result in results.ResultsReader(job.results()):
            # result = results.ResultsReader(job.results())
            # job.cancel()
            return job

        # Keys from Security Research API
        #0 Splunk_Research_Baselines
        #1 Splunk_Research_Deployments
        #2 Splunk_Research_Detections
        #3 Splunk_Research_Lookups
        #4 Splunk_Research_Macros
        #5 Splunk_Research_Stories
        #6 Splunk_Research_Version
        #7 mitreattack

        # generates the datasource based on the old mappings and tries to map new objects.
        # also generates the journey and a category to return
        def generate_datasource_journey(description, name, search):
            journey = ""
            category = ""
            killchain = ""
            usecase = ""
            description = description.lower()
            name = name.lower()

            #read csv, and split on "," the line
            try:
                csv_file = csv.reader(open(pathToShowcaseInfo+'sse_legacy_datasource_mapping.csv', "r"), delimiter=",")
            except Exception as e:
                    debug.append({"msg": "Got an error!", "error": str(e)})
                    throwErrorMessage = True

            #check to see if we have the sourcetype in our csv file
            for r in csv_file:
                if(r[0].lower() == name):
                    journey = r[8]
                    category = r[9]
                    killchain = r[10]
                    usecase = r[11]
                    break

            if(usecase == ""):
                usecase = "Security Monitoring"

            return journey, category, killchain, usecase

        def map_datasource_to_securityDataJourney(data_source_categories):
            data_source_category_list = data_source_categories.split("|")
            securityDataJourney = "Level_2"

            try:
                csv_file = csv.reader(open(pathToLookups+'SSE_securityDataJourney.csv', "r"), delimiter=",")
            except Exception as e:
                debug.append({"msg": "Got an error!", "error": str(e)})
                throwErrorMessage = True

            for eventtypeid in data_source_category_list:
                for r in csv_file:
                    if(r[4].lower() == eventtypeid.lower()):
                        securityDataJourney = r[6]
                        break
                if(securityDataJourney):
                    break

            return securityDataJourney

        macros_lookup = list(csv.reader(open(pathToLookups+'SSE-STRT-macros-to-data_source_categories.csv', "r"), delimiter=","))
        datamodel_lookup = list(csv.reader(open(pathToLookups+'datamodels.csv', "r"), delimiter=","))

        def getDataSourceCategoryFromSearch(query):
            datamodel = None
            nodename = None
            macro = None
            rest = None
            data_source_categories = []
            try:


                m_datamodel = re.findall(r".datamodel(?:=\"|:\"|\(\"|\s|:|=)(?:\"|)([a-z,A-Z,_]*)", query)
                m_nodename = re.findall(r".datamodel(?:=\"|:\"|\(\"|\s|:|=)(?:\"|)[a-z,A-Z,_]*(?:\"|)\.(?:\"|)([a-z,A-Z,_]*)", query)
                m_macro = re.search(r"`([^`]*)`", query)
                m_rest = re.search("\|( |)rest", query)
                # lookup_match = re.search(r'.*(?:input| )lookup (?:[a-z,A-Z,_]*=[a-z,A-Z,_]{1,4} |)([a-z,A-Z,_,0-9]*)', i["search"])
                # if (lookup_match is not None):
                if m_datamodel:
                    datamodel = m_datamodel
                if m_nodename:
                    nodename = m_nodename
                if nodename and nodename!="" and len(nodename)>0:
                    if len(nodename)<2:
                        datamodel[0]=datamodel[0]+"."+nodename[0]
                    else:
                        for i in range(len(datamodel)):
                            datamodel[i]=datamodel[i]+"."+nodename[i]
                if m_macro:
                    macro = m_macro.group(1)

                if m_rest:
                    rest = m_rest.group(1)

                if datamodel:
                    for d in datamodel:
                        for r in datamodel_lookup:
                            if(r[0]!="" and r[0].lower() == d.lower()):
                                data_source_categories.append(r[6])
                                break
                if macro:
                    for r in macros_lookup:
                        if(r[0]!="" and r[0].lower() == macro.lower()):
                            data_source_categories.append(r[3].replace("\n", "|"))
                            break
                if rest:
                    data_source_categories.append("VendorSpecific-SplunkInternal")

                return "|".join(data_source_categories)

            except Exception as e:
                debug.append({"msg": "Error when extracting data source category from search!", "error": str(e),"data_source_categories":data_source_categories,"datamodel":datamodel,"nodename":nodename,"macro":macro})
                throwErrorMessage = True


        # this function takes a list as an argument and returns it as a string with a pipe delimeter
        def convert_list_to_string(list_to_convert):

            converted_string = "|".join(list_to_convert)
            return converted_string

        # this is used for the detections from the research api since some things are formatted AWS and some are Aws this capitalizes everything
        # and capitalized all proper acronyms
        def format_proper_names(name):
            proper_names = ["aws", "wmi", "mltk", "smb", "rc4", "gcp", "gcr", "dns", "dll", "mac", "acl", "usb", "eks", "icmp", "api", "dhcp", "ec2", "lsass", "ip", "uba", "cve", "rce","ami","mfa","iam"]

            name = name.split()
            final_name = ""

            for word in name:
                if word.lower() in proper_names:
                    final_name += (" " + word.upper())
                else:
                    final_name += (" " + word.title())


            return final_name
        # this is the final structure for showcaseinfo
        final_showcase_info = {
                "escu_stories": {},
                "roles": {
                    "default": {
                    }
                },
                "summaries": {}
        }

        # Execute searches that will generate the link between macros, sourcetypes, datamodels and data_source_categories (aka eventtypeId)
        job1 = runSearch("| savedsearch \"Generate Local Saved Search Lookup\"")
        job2 = runSearch("| savedsearch \"Generate STRT Macros to Data Source Categories Lookup\"")

        #Load up the kvstore - this one gets everything, now just the Splunk Research content
        response = {}
        try:
            query = { "$or": [
                { "_key":"Splunk_Research_Baselines" },
                { "_key":"Splunk_Research_Deployments" },
                { "_key":"Splunk_Research_Detections" },
                { "_key":"Splunk_Research_Lookups" },
                { "_key":"Splunk_Research_Macros" },
                { "_key":"Splunk_Research_Stories" },
                { "_key":"Splunk_Research_Version" },
                { "_key":kvstore_showcaseinfo }
                ] }

            response = getKVStore(kvstore,json.dumps(query))
            # now write output to a file
        except Exception as e:
            debug.append({"msg": "Got an error!", "error": str(e)})
            return {'payload': {"message": "Did not get response from kvstore","Error":str(e)},
                    'status': 500
                }
            throwErrorMessage = True

        # get all of the detections
        json_detections = {}
        json_detections_version = ""
        json_analytic_stories = {}
        json_baselines = {}
        json_lookups = {}

        try:
            json_baselines = json.loads(response[0]["json"])
            json_detections = json.loads(response[2]["json"])
            json_detections_version = response[2]["version"]
            json_lookups = json.loads(response[3]["json"])
            json_analytic_stories = json.loads(response[5]["json"])
            json_version = json_detections_version
        except Exception as e:
            debug.append({"msg": "Got an error!", "error": str(e)})
            throwErrorMessage = True

         # now write output to a file
        #json_detections_file = open(pathToShowcaseInfo+"json_detections.json", "w")
        # write it pretty so we can read it later
        #json_detections_file.write(json_detections)
        #json_detections_file.close()

        # iterate through the detections from the kv store to add to the summaries dict in final_showcase_info
        if "detections" in json_detections:
            for i in json_detections["detections"]:

                updated_dict = {
                    "SPLEase": "None",
                    "dashboard": "showcase_security_content?showcaseId={}".format(i["name"].replace(" ", "_").lower()),
                    "displayapp": "Enterprise Security Content Update",
                    "icon": "ES_Use_Case.png",
                    "includeSSE": "Yes",
                    "released": i.get("date", ""),
                    "date": i.get("date", ""),
                    "description": i.get("description", ""),
                    "app": "Enterprise_Security_Content_Update",
                    "domain":"Threat",
                    "search_name": "ESCU - {} - Rule".format(i["name"]),
                    "includeSSE": "Yes",
                    "highlight": "No",
                    "search": i.get("search", ""),
                    "hasSearch": "Yes",
                    "how_to_implement":i.get("how_to_implement", ""),
                    "known_false_positives": i.get("known_false_positives", ""),
                    "version":i.get("version", ""),
                    "references":i.get("references", ""),
                    "author":i.get("author", ""),
                    "asset_type":i["tags"].get("asset_type", ""),
                    "dataset":i["tags"].get("dataset", ""),
                    "macros":i.get("macros", ""),
                    "baselines":i.get("baselines", ""),
                    "tags":i.get("tags", "")
                }

                # add the id using the name and replace with underscores
                stories_name_underscore = i.get("name", "").replace(" ", "_").lower().strip()
                updated_dict["id"] = stories_name_underscore

                updated_dict["name"] = i.get("name", "").strip()

                data_source_categories = getDataSourceCategoryFromSearch(updated_dict["search"])
                journey, category, killchain, usecase = generate_datasource_journey(updated_dict["description"], updated_dict["name"], updated_dict["search"])
                updated_dict["data_source_categories"] = data_source_categories
                updated_dict["journey"] = journey if journey is not None and journey!="" else "Stage_3"
                updated_dict["category"] = category if category is not None and category!="" else "Other"
                if category.strip().endswith("|"):
                    updated_dict["category"] = category[0: -1]
                if data_source_categories:
                    updated_dict["securityDataJourney"] = map_datasource_to_securityDataJourney(data_source_categories)
                else:
                    updated_dict["securityDataJourney"] = "Level_2"
                updated_dict["killchain"] = killchain
                updated_dict["usecase"] = usecase if usecase is not None and usecase!="" else "Other"

                if(updated_dict["category"] == "-" or updated_dict["category"] == ""):
                    updated_dict["category"] = "Adversary Tactics"

                datamodel=""
                datamodel_match = re.findall(r'.datamodel(?:=\"|:\"|\(\"|\s|:|=)(?:\"|)([a-z,A-Z,_]*(?:\.[a-z,A-Z,_]*|))', i["search"])
                if (datamodel_match is not None):
                    datamodel=datamodel_match

                datamodel_type_str = convert_list_to_string(set(datamodel))
                if datamodel_type_str.strip().endswith("|"):
                    datamodel_type_str = datamodel_type_str[0: -1]
                datamodel=datamodel_type_str

                updated_dict["datamodel"] = datamodel

                lookup=""
                lookup_match = re.search(r'.*(?:input| )lookup (?:[a-z,A-Z,_]*=[a-z,A-Z,_]{1,4} |)([a-z,A-Z,_,0-9]*)', i["search"])
                if (lookup_match is not None):
                    updated_dict["lookups"] = []
                    #debug.append({"message": "Lookup regex", "lookup": lookup})
                    lookup=lookup_match.group(1)
                    try:
                        for l in json_lookups["lookups"]:
                            if(l["name"] == lookup):
                                updated_dict["lookups"].append(l)
                                break
                    except Exception as e:
                        debug.append({"msg": "Got an error!", "error": str(e)})
                        throwErrorMessage = True
                else:
                    updated_dict["lookups"] = ""


                # this is mapping the analytics story to the story_id since that's what we use when displaying content
                analytics_story_tags = []
                if("analytic_story" in i["tags"]):
                    try:
                        for story in i["tags"]["analytic_story"]:
                            for j in json_analytic_stories["stories"]:
                                if(j["name"] == story):
                                    analytics_story_tags.append(j["id"])
                                    break
                    except Exception as e:
                        debug.append({"msg": "Got an error!", "error": str(e)})
                        throwErrorMessage = True
                    updated_dict["analytic_story"] = convert_list_to_string(i["tags"]["analytic_story"])
                    updated_dict["story"] = convert_list_to_string(analytics_story_tags)


                # check to see if there are any cis20 tags
                if("cis20" in i["tags"]):
                    updated_dict["escu_cis"] = convert_list_to_string(i["tags"]["cis20"])
                else:
                    updated_dict["escu_cis"] = "None"

                if("nist" in i["tags"]):
                    updated_dict["escu_nist"] = convert_list_to_string(i["tags"]["nist"])
                else:
                    updated_dict["escu_nist"] = "None"
                if("mitre_attack_id" in i["tags"]):
                    mitre_attack_ids = i["tags"]["mitre_attack_id"]
                    # add everything as the sub_technique first, if it is a sub-technique
                    mitre_sub_technique_list = []
                    for mitre_sub_technique in i["tags"]["mitre_attack_id"]:
                        if "." in mitre_sub_technique:
                            mitre_sub_technique_list.append(mitre_sub_technique)
                    if len(mitre_sub_technique_list)>0:
                        updated_dict["mitre_sub_technique"] = convert_list_to_string(list(set(mitre_sub_technique_list)))
                        
                    # remove the period and anything after it for the Technique field
                    mitre_attack_ids_final = list(set([mitre_attack_id.split(".")[0] for mitre_attack_id in mitre_attack_ids if isinstance(mitre_attack_id, str)]))
                    updated_dict["mitre_technique"] = convert_list_to_string(mitre_attack_ids_final)
                    updated_dict["mitre_id"] = convert_list_to_string(mitre_attack_ids)
                    if("mitre_id" in updated_dict):
                        updated_dict = mitre_helper.addMitreEnrichment(updated_dict)
                        # debug.append({"message": "Debug from MitreAttackHelper", "debug": updated_dict.get("debug")})

                if("how_to_implement" in i):
                    updated_dict["help"] = (i["how_to_implement"])

                if("known_false_positives" in i):
                    if["known_false_positives"] == "None at this time":
                        updated_dict["alertvolume"] = "Low"
                    else:
                        updated_dict["alertvolume"] = "None"

                # Add industryMapping
                if("mitre_attack_groups" in i["tags"]):
                    updated_dict["mitre_threat_groups"] = convert_list_to_string(i["tags"]["mitre_attack_groups"])
                    #read csv, and split on "," the line. This gets the link to the Industry from Threat Group
                    try:
                        industryMappings = ""
                        for g in i["tags"]["mitre_attack_groups"]:
                            threat_group_csv_file = list(csv.reader(open(pathToLookups+'mitre_threat_groups.csv', "r"), delimiter=","))
                            #check to see if we the Threat Group in our csv file and extrat the Industry
                            # debug.append({"message": "Looking up group in csv", "group": g, "name":i["name"]})
                            for r in threat_group_csv_file:
                                #debug.append({"message": "Matching csv with threat group in content", "r": r, "g": g})
                                if(r[0].lower() == g.lower()):
                                    #debug.append({"message": "Found match for", "group": g})
                                    if r[1] != "-":
                                        industryMappings += r[1].replace("\n", "|")+"|"
                                    break
                        updated_dict["industryMapping"] = convert_list_to_string(list(set(industryMappings[:-1].split("|"))))
                    except Exception as e:
                            debug.append({"msg": "Error opening the threat group csv!", "error": str(e)})
                            throwErrorMessage = True

                if("tags" in i):
                    if("security_domain" in i["tags"]):
                        updated_dict["security_domain"] = i["tags"]["security_domain"]

                    if "observable" in i["tags"]:
                        observables = i["tags"]["observable"]
                        risk_object_type = []
                        threat_object_type = []

                        if len(observables) > 0:
                            for observable in observables:
                                if "role" in observable:
                                    if "Victim" in observable["role"]:
                                        risk_object_type.append(observable.get("type", ""))
                                    else:
                                        threat_object_type.append(observable.get("type", ""))

                        risk_object_type_str = convert_list_to_string(set(risk_object_type))
                        if risk_object_type_str.strip().endswith("|"):
                            risk_object_type_str = risk_object_type_str[0: -1]
                        updated_dict["risk_object_type"] = risk_object_type_str if risk_object_type_str is not None and risk_object_type_str != "" else "None"

                        threat_object_type_str = convert_list_to_string(set(threat_object_type))
                        if threat_object_type_str.strip().endswith("|"):
                            threat_object_type_str = threat_object_type_str[0: -1]
                        updated_dict["threat_object_type"] = threat_object_type_str if threat_object_type_str is not None and threat_object_type_str != "" else "None"

                    if "risk_score" in i["tags"]:
                        updated_dict["risk_score"] = i["tags"]["risk_score"]

                    if "message" in i["tags"]:
                        updated_dict["risk_message"] = i["tags"]["message"]


                # if("macros" in i):
                #     macro_list = []
                #     for j in i["macros"]:
                #         macro_list.append(j)

                #     updated_dict["macros"] = macro_list

                # if("baselines" in i):
                #     baselines_list = []
                #     for j in i["baselines"]:
                #         baselines_list.append(j)

                #     updated_dict["baselines"] = baselines_list

                if(updated_dict["usecase"]  == "-"):
                    updated_dict["usecase"] = "Security Monitoring"

                final_showcase_info["summaries"].update({stories_name_underscore:updated_dict})
        else:
            return {'payload': {"message": "Update failed. Detection endpoint not in the KVStore"},
                    'status': 500
                }

        # print(json.dumps(final_showcase_info))

        def getContentData(url, reasonFun):
            try: 
                if reasonFun == "verification":
                    payload = {}
                    response = requests.request("GET", url, data=payload)
                    return response.text
                else:
                    response = requests.get(url)
                    content_url = response.url
                    request = six.moves.urllib.request.Request(content_url)
                    content = six.moves.urllib.request.urlopen(request).read()
                    content = json.loads(content.decode("utf-8"))
                    return content
            except Exception as e:
                return False

        def getContentSignature(url, name):
            try:
                response = requests.get(url)
                signature_url = response.url.replace(name+".json", name+".json.asc")
                request = six.moves.urllib.request.Request(signature_url)
                signature = six.moves.urllib.request.urlopen(request).read().lstrip()
                signature = signature.decode('utf-8')
                return signature
            except:
                return False
            
        def getSplunkKey(url):
            try:
                request = six.moves.urllib.request.Request(url)
                signature = six.moves.urllib.request.urlopen(request).read().lstrip()
                signature = signature.decode('utf-8')
                # logger.info("Sign: %s", signature)
                return signature
            except:
                return False

        def getContentsToPass():
            content_names = [
                "es_content",
                "soar_content",
                "sse_content",
                "uba_content"
            ]
            base_url = "https://splk.it/"
            contents = []
            signatures = []
            for item in content_names:
                contents.append(getContentData(base_url+item, "verification"))
                signatures.append(getContentSignature(base_url+item, item))
            splunk_key = getSplunkKey(SPLUNK_PGP_KEY_URL)

            return [splunk_key, contents, signatures, content_names]
        
        def writeJSONFiles(filename, data):
            # now write output to a file
            current_file = open(pathToShowcaseInfo+filename+".json", "w")
            # write it pretty so we can read it later
            current_file.write(json.dumps(data, indent=4))
            current_file.close()
        # iterate through the individual content files to add the data to summaries in the dict we're creating
        # this can also be modifed to use os.listdir() if we have more files and don't want to hardcode names in
        if reason == "verification":
            try:
                splunk_key, json_data, signatures, names = getContentsToPass()
                return {'payload': {"Public_Key": splunk_key,"JSON": json_data, "sign": signatures, "name": names},  
                                'status': 200
                    }
            except Exception as e:
                # Exception here
                print(e)
        elif reason == "update":
            base_url="https://splk.it/"
            try:
                # Get the contents
                contentMain = getContentData(base_url+forJson, "updation")

                # Now update the file
                writeJSONFiles(forJson, contentMain)
                # return {'payload': {"message": "Content updated for " + forJson},'status': 200}
            except Exception as e:
                return {'payload': {"message": "Exception while updating JSON data for " + forJson},'status': 500}


        file_names = ["sse_content.json", "es_content.json", "soar_content.json", "ps_content.json", "uba_content.json"]
        for i in file_names:
            try:
                with open(pathToShowcaseInfo+"{}".format(i)) as json_file:
                    data = json.load(json_file)
                    for k,v in data.items():
                        name = k.replace(" ", "_").lower()
                        updated_dict = json.dumps(v)
                        updated_dict = json.loads(updated_dict)
                        if(i == "uba_content.json"):
                            if("id" in updated_dict):
                                updated_dict["id"] = updated_dict["id"].lower()
                            if("anomalies" in updated_dict):
                                temp_list = []
                                for x in updated_dict["anomalies"]:
                                    temp_list.append(x.lower())
                                updated_dict["anomalies"] = temp_list
                            if("contributes_to_threats" in updated_dict):
                                temp_list = []
                                for x in updated_dict["contributes_to_threats"]:
                                    temp_list.append(x.lower())
                                updated_dict["contributes_to_threats"] = temp_list

                        if(i != "uba_content.json"):
                            if("data_source_categories" in updated_dict):
                                updated_dict["securityDataJourney"] = map_datasource_to_securityDataJourney(updated_dict["data_source_categories"])
                            else:
                                updated_dict["securityDataJourney"] = "Level_2"
                        else:
                            updated_dict["securityDataJourney"] = "Level_3"

                        #Add mitre enrichments to all content that have mitre techniques linked
                        if("mitre_technique" in updated_dict):
                            updated_dict = mitre_helper.addMitreEnrichment(updated_dict)
                            # debug.append({"message": "Debug from MitreAttackHelper 2nd", "debug": updated_dict.get("debug")})

                        #Add industryMapping to all content that have mitre threat groups linked
                        if("mitre_threat_groups" in updated_dict):
                            try:
                                threat_group_csv_file = list(csv.reader(open(pathToLookups+'mitre_threat_groups.csv', "r"), delimiter=","))
                                threat_groups=updated_dict["mitre_threat_groups"].split("|")
                                threat_groups = list(filter(None, threat_groups))
                                industryMappings = ""
                                for g in threat_groups:
                                    #check to see if we the Threat Group in our csv file and extrat the Industry
                                    # debug.append({"message": "Looking up group in csv", "group": g})
                                    for r in threat_group_csv_file:
                                        if(r[0].lower() == g.lower()):
                                            # debug.append({"message": "Found match for", "group": g})
                                            if r[1] != "-":
                                                industryMappings += r[1].replace("\n", "|")+"|"
                                            break
                                updated_dict["industryMapping"] = convert_list_to_string(list(set(industryMappings[:-1].split("|"))))
                            except Exception as e:
                                debug.append({"msg": "Error when adding industry mapping!", "error": str(e), "threat_groups":updated_dict["mitre_threat_groups"]})
                                throwErrorMessage = True

                        final_showcase_info["summaries"].update({name:updated_dict})
            except Exception as e:
                    debug.append({"msg": "Got an error!", "error": str(e)})
                    throwErrorMessage = True

        # now that we've updated showcaseinfo with all of the data let's fill in the list of summaries with all the data
        summaries = []
        for i in final_showcase_info["summaries"]:
            summaries.append(i)
            final_showcase_info["roles"]["default"].update({"summaries": summaries})

        # work on getting everything put into escu_stories
        # still need to add the content in the support field

        try:
            for i in json_analytic_stories["stories"]:
                # the id gets used at the end when we're adding this back to the escu_stories part of showcaseinfo
                id = i["id"]

                updated_dict = {
                    "escu_category": i["tags"].get("category", ""),
                    "name": i.get("name", ""),
                    "modification_date": i.get("date", ""),
                    "narrative": i.get("narrative", ""),
                    "description": i.get("description", ""),
                    "version": i.get("version", ""),
                    "author": i.get("author", ""),
                    "type": i.get("type", ""),
                    "responses": [], # this looks like it's always empty?
                    "story_id": id
                }

                if i["references"]:
                    updated_dict["references"] = i.get("references", "")
                else:
                    updated_dict["references"] = []

                # Update our dict with the detections
                detections_list = []
                try:
                    if "detections" in i:
                        for j in i["detections"]:
                            # this takes the name and adds detections_ as well as replaces spaces with underscores and lower cases it
                            story_detection_id="{}".format(j.get("name", "").replace(" ", "_").lower())
                            detections_list.append(story_detection_id)
                            #detections_list.story_detection_id = j["name"]
                    elif "detection_names" in i:
                        for j in i["detection_names"]:
                            story_detection_id="{}".format(j.replace(" ", "_").lower())
                            detections_list.append(story_detection_id)
                except Exception as e:
                    print("Got the exception in block - ",e)

                updated_dict["detections"] = detections_list

                # last part is to add the baselines to the support section
                baselines_list = []
                if ("baselines" in json_baselines):
                    for baseline in json_baselines["baselines"]:
                        if "tags" in baseline:
                            if "analytic_story" in baseline["tags"]:
                                for story in baseline["tags"]["analytic_story"]:
                                    if story == i["name"]:
                                        baselines_list.append(baseline["name"])


                updated_dict["support"] = baselines_list

                final_showcase_info["escu_stories"].update({id:updated_dict})
                #print(updated_dict)

            # add the version from the resarch api to our showcaseinfo
            final_showcase_info["research_version"] = json_version.replace("v", "")


            # after creating the final form of showcase info, create the information for the use case library
            # user_story_conf_path = os.environ['SPLUNK_HOME'] + "/etc/apps/" + app + "/default/analyticstories.conf"

            # analytic_story_file = open(user_story_conf_path, "w")

            json_analytic_stories = json_analytic_stories.get("stories", "{}")
            json_detections = json_detections.get("detections", "{}")
            json_baselines = json_baselines.get("baselines", "{}")

            # analytic_story_file.write("### STORIES ###\n\n")
            # for i in json_analytic_stories:

            #     # search detections first in order to populate the searches below
            #     included_searches = []
            #     for j in json_detections:
            #         if("tags" in j):
            #             if("analytic_story" in j["tags"]):
            #                 for k in j["tags"]["analytic_story"]:
            #                     if(i.get("name", "") == k):
            #                         included_searches.append("ESCU - " + j.get("name", "") + " - Rule")

            #     # split the author since it is formatted with name,company
            #     company_author = i.get("author", "").split(",")
            #     author = company_author[0]
            #     if len(company_author) > 1:
            #         company = company_author[1].lstrip()
            #     else:
            #         company = "-"

            #     analytic_story_file.write("[analytic_story://{}]\n".format(i.get("name", "")))
            #     if i.get("tags", {}).get("category"):
            #         analytic_story_file.write("category = {}\n".format(i["tags"]["category"][0]))
            #     else:
            #         analytic_story_file.write("category = \n")
            #     analytic_story_file.write("last_updated = {}\n".format(i.get("date", "")))
            #     analytic_story_file.write("version = {}\n".format(i.get("version", "")))
            #     analytic_story_file.write("references = {}\n".format(str(json.dumps(i.get("references", "")))))
            #     analytic_story_file.write("maintainers = [{\"company\": \"" + company + "\", \"email\": \"-\", \"name\": \"" + author + "\"}]\n")
            #     analytic_story_file.write("spec_version = 3\n")
            #     analytic_story_file.write("searches = " + str(json.dumps(included_searches)) + "\n")
            #     analytic_story_file.write("description = {}\n".format(i.get("description", "")))
            #     if("narrative" in i):
            #         analytic_story_file.write("narrative = {}\n".format(i.get("narrative", "")))
            #     analytic_story_file.write("\n")
            # analytic_story_file.write("### END STORIES ###\n\n")

            # analytic_story_file.write("### DETECTIONS ###\n\n")
            # for i in json_detections:
            #     analytic_story_file.write("[savedsearch://{} - {} - Rule]\n".format(i.get("type", ""), i.get("name", "")))
            #     analytic_story_file.write("type = detection\n")
            #     if("tags" in i):
            #         if("asset_type" in i["tags"]):
            #             analytic_story_file.write("asset_type = {}\n".format(i["tags"].get("asset_type", "")))
            #     analytic_story_file.write("confidence = medium\n")
            #     analytic_story_file.write("explanation = {}\n".format(i.get("description", "")))
            #     if("how_to_implement" in i):
            #         analytic_story_file.write("how_to_implement = {}\n".format(i.get("how_to_implement", "")))
            #     else:
            #         analytic_story_file.write("how_to_implement = none")
            #     analytic_story_file.write("annotations = {}\n")
            #     analytic_story_file.write("known_false_positives = {}\n".format(i.get("known_false_positives", "")))
            #     analytic_story_file.write("providing_technologies = []\n\n")
            # analytic_story_file.write("### END DETECTIONS ###\n\n")

            # analytic_story_file.write("### BASELINES ###\n\n")
            # for i in json_baselines:
            #     analytic_story_file.write("[savedsearch://ESCU - {}]\n".format(i.get("name", "")))
            #     analytic_story_file.write("type = support\n")
            #     analytic_story_file.write("explanation = {}\n".format(i.get("description", "")))
            #     analytic_story_file.write("how_to_implement = {}\n".format(i.get("how_to_implement", "")))
            #     analytic_story_file.write("known_false_positives = not defined\n")
            #     analytic_story_file.write("providing_technologies = none\n\n")

            # analytic_story_file.write("### END BASELINES ###")
        except Exception as e:
            return {'payload': {"message": "Error while parsing stories","Error":str(e)},
                'status': 500
            }

        if (debugEnabled):
            return {'payload': {"message": "All debug logs","Debug":debug},
                'status': 200
            }

        #Do some basic sanity checking on the resulting JSON so it won't break anything if we update file and the KVstore.
        if ("research_version" in final_showcase_info and "summaries" in final_showcase_info and len(final_showcase_info["summaries"])>550):

            try:
                # now write output to a file
                showcase_info_file = open(pathToShowcaseInfo+"ShowcaseInfo.json", "w")
                # write it pretty so we can read it later
                showcase_info_file.write(json.dumps(final_showcase_info, indent=4, sort_keys=True))
                showcase_info_file.close()
            except Exception:
                '''Skip this part'''

            #Update the KVStore with the new content
            collection = service.kvstore[kvstore]
            record = {
                "_key":kvstore_showcaseinfo,
                "_time":str(time.time()),
                "description":"ShowcaseInfo.json - Contains all content in SSE",
                "version":json_detections_version,
                "json":json.dumps(final_showcase_info)
            }
            should = "insert"
            for row in response:
                if row['_key'] == kvstore_showcaseinfo:
                    should = "update"
            try:
                if should == "update":
                    collection.data.update(kvstore_showcaseinfo, json.dumps(record))
                    return {'payload': {"message": "Content update complete. KVStore updated","version":json_detections_version,"KVstore row count":len(response)},
                        'status': 200
                    }
                elif should == "insert":
                    collection.data.insert(json.dumps(record))
                    return {'payload': {"message": "Content update complete. KVStore inserted with new version","version":json_detections_version},
                        'status': 200
                    }
            except Exception as e:
                debug.append(json.dumps({"status": "ERROR", "description": "Couldn't add content into the kvstore built for ES Integration.", "insert_message": str(e), "update_message": str(e)}))
                return {'payload': {"message": "Update failed","Error":str(e)},
                        'status': 200
                    }
        else:
            return {'payload': {"message": "Update failed. Resulting ShowcaseInfo did not appear to be valid","ShowcaseInfo Detection Count":len(final_showcase_info["summaries"])},
                        'status': 200
                    }
