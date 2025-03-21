import json
import sys
from splunk.appserver.mrsparkle.lib.util import make_splunkhome_path
from six.moves import reload_module
try:
    if 'future' in sys.modules:
        import future
        reload_module(future)
except Exception:
    '''noop: future was not loaded yet'''

import os
import six.moves.urllib.request, six.moves.urllib.error
from splunk.clilib.cli_common import getConfKeyValue, getConfStanza

class MitreAttackHelper:
    base_url = ""
    service = ""
    mitre_attack_object = False
    debug = []
    debugEnabled = False
    tactics_for_zero_trust = ["Initial Access","Persistence","Privilege Escalation","Credential Access","Lateral Movement","Exfiltration"]


    def __init__(self, sessionKey):

        # sessionkey gets passed in when a new object is created
        self.sessionKey = sessionKey

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

    # only used above when trying to get session information
    def errorOut(self, obj):
        print("Error!")
        print('"' + json.dumps(obj).replace('"', '""') + '"')
        sys.exit()
        
    def getMitreLookup(self):
        # Getting MITRE ATT&CK Object from lookup
        url = self.base_url + '/services/pullCSV?config=mitre_enterprise_list'
        request = six.moves.urllib.request.Request(url,
            headers = { 'Authorization': ('Splunk %s' % self.sessionKey)})
        csv_results = six.moves.urllib.request.urlopen(request)
        mitre_attack_object = json.loads(csv_results.read())
        return mitre_attack_object

    def addMitreEnrichment(self,updated_dict):
        if not self.mitre_attack_object:
            self.mitre_attack_object=self.getMitreLookup()
        mitre_attack_object=self.mitre_attack_object
        debug = self.debug
        tactics_for_zero_trust = self.tactics_for_zero_trust
        if ("mitre_id" in updated_dict):
            techniques=updated_dict["mitre_id"].split("|")
        else:
            techniques=updated_dict.get("mitre_technique","").split("|") + updated_dict.get("mitre_sub_technique","").split("|")
        techniques = list(filter(None, techniques))

        try:
            # Fields added as enrichment to Showcaseinfo
            mitre_matrix = [] # merged TechniqueId and Sub_TechniqueId fields
            mitre_platforms = [] # Platforms
            mitre_software = [] # Software
            mitre_sub_technique_display = [] # Sub_Technique
            mitre_tactic = [] # TacticId
            mitre_tactic_display = [] # Tactic
            mitre_id = [] # TechniqueId and Sub_TechniqueId
            mitre_id_combined = [] # TechniqueId and Sub_TechniqueId - Technique and Sub_Technique
            mitre_technique_combined = [] # TechniqueId - Technique
            mitre_technique_display = [] # Technique
            mitre_techniques_avg_group_popularity = [] # Average count of Threat Groups for the Techniques linked to the content item
            mitre_threat_groups = [] # Threat_Groups
            mitre_threat_groups_counts = [] # count(Threat_Groups)

            techniques = list(filter(None, techniques))
            #check to see if we have the Technique in our csv file and extract the enrichments
            technique_found = False
            for technique in techniques:
                technique = technique.upper()
                if(technique in mitre_attack_object):
                    technique_found = True
                    mitre_id.append(mitre_attack_object[technique]["TechniqueIdCombined"])
                    mitre_id_combined.append(mitre_attack_object[technique]["TechniqueIdCombined"] + " - " + (mitre_attack_object[technique]["Sub_Technique"] if mitre_attack_object[technique]["Sub_Technique"] != '-' else mitre_attack_object[technique]["Technique"]))
                    if("Matrix" in mitre_attack_object[technique] and mitre_attack_object[technique]["Matrix"] != "-"):
                        mitre_matrix.append(mitre_attack_object[technique]["Matrix"])
                    if("Platforms" in mitre_attack_object[technique] and mitre_attack_object[technique]["Platforms"] != "-"):
                        mitre_platforms.append(mitre_attack_object[technique]["Platforms"])
                    if("Software" in mitre_attack_object[technique] and mitre_attack_object[technique]["Software"] != "-"):
                        mitre_software.append(mitre_attack_object[technique]["Software"])
                    if("Sub_Technique" in mitre_attack_object[technique] and mitre_attack_object[technique]["Sub_Technique"] != "-"):
                        mitre_sub_technique_display.append(mitre_attack_object[technique]["Sub_Technique"])
                    if("Tactic" in mitre_attack_object[technique] and mitre_attack_object[technique]["Tactic"] != "-"):
                        mitre_tactic_display.append(mitre_attack_object[technique]["Tactic"])
                        mitre_tactic.append(mitre_attack_object[technique]["TacticId"])
                    if("Technique" in mitre_attack_object[technique] and mitre_attack_object[technique]["Technique"] != "-"):
                        mitre_technique_display.append(mitre_attack_object[technique]["Technique"])
                        mitre_technique_combined.append(mitre_attack_object[technique]["TechniqueId"] + " - " + mitre_attack_object[technique]["Technique"])
                    if("Threat_Groups" in mitre_attack_object[technique] and mitre_attack_object[technique]["Threat_Groups"] != "-"):
                        mitre_threat_groups.append(mitre_attack_object[technique]["Threat_Groups"])
                        mitre_threat_groups_counts.append(str(len(mitre_attack_object[technique]["Threat_Groups"].split("|"))))
                else:
                    debug.append({"msg": "MITRE ATT&CK Technique not found", "mitre_technique":technique,"App":updated_dict["app"],"Content":updated_dict["name"]})
            if technique_found:
                # Create a dictionary with all the lists
                mitre_enrichment_fields = {
                    "mitre_matrix": mitre_matrix,
                    "mitre_platforms": mitre_platforms,
                    "mitre_software": mitre_software,
                    "mitre_sub_technique_display": mitre_sub_technique_display,
                    "mitre_tactic": mitre_tactic,
                    "mitre_tactic_display": mitre_tactic_display,
                    "mitre_id": mitre_id,
                    "mitre_id_combined": mitre_id_combined,
                    "mitre_technique_combined": mitre_technique_combined,
                    "mitre_technique_display": mitre_technique_display,
                    "mitre_threat_groups": mitre_threat_groups,
                    "mitre_threat_groups_counts": mitre_threat_groups_counts,
                    "mitre_techniques_avg_group_popularity": self.calculate_average(mitre_threat_groups_counts)
                }
                for mitre_enrichment_field, value in mitre_enrichment_fields.items():
                    if value and isinstance(value, (list, str)):
                        fieldValues = "|".join(value).split("|")
                        uniqueValues = [] 
                        [uniqueValues.append(x) for x in fieldValues if x not in uniqueValues] 
                        merged_value = "|".join(uniqueValues)
                        if merged_value:
                            updated_dict[mitre_enrichment_field] = merged_value.strip("|").replace('$', '\$')

                # Add Cloud to the Platforms list
                cloud_platforms = ["AWS", "GCP", "Azure", "Azure AD", "Office 365", "SaaS"]
                cloud_matrix=False
                for platform in updated_dict["mitre_platforms"].split("|"):
                    if platform in cloud_platforms:
                        cloud_matrix=True
                        break  # exit the loop once a match is found
                if cloud_matrix:
                    updated_dict["mitre_platforms"] = updated_dict["mitre_platforms"] + "|Cloud"
                
                # Add Zero Trust category
                has_zero_trust=False
                for i in updated_dict["mitre_tactic_display"].split("|"):
                    if i in tactics_for_zero_trust:
                        #Append the Zero Trust category if one of the tactics linked to ZT
                        has_zero_trust=True
                if (has_zero_trust):
                    updated_dict["category"] = updated_dict["category"]+"|Zero Trust"
            if self.debugEnabled:
                updated_dict["debug"] = str(debug)
            return updated_dict

        except Exception as e:
            debug.append({"msg": "Error when adding MITRE enrichments", "error": str(e),"mitre_technique":updated_dict["mitre_technique"],"Content":updated_dict["name"]})
            throwErrorMessage = True
            if self.debugEnabled:
                updated_dict["debug"] = str(debug)
            return updated_dict
    
    def calculate_average(self,lst):
        debug=self.debug
        try:
            # Check if the list is None or empty
            if not lst:
                return 0

            # Filter out non-numeric values from the list
            numbers = [int(num) for num in lst if str(num).isdigit()]

            # If there are no valid numbers, return 0
            if not numbers:
                return 0

            # Calculate the average of the valid numbers and round it to 2 decimal places
            average = str(round(sum(numbers) / len(numbers), 2))
            return [average]
        except Exception as e:
            debug.append({"msg": "Error when calculating average Threat Group counts", "error": str(e),"Treat Group Counts":lst})
            return average