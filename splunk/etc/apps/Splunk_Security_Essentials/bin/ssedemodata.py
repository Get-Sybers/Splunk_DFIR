# coding=utf-8

#
# Windag search operator
#
# Generates structured data for development use.
#
# Usage:
#
#   At the most basic level, you can just do 'windbag'.  The arguments
#   listed below in DEFAULT_ARGS can all be overridden as search arguments in
#   the search string, i.e., 'windbag multiline=true rowcount=3000'.  From the
#   current UI, prefix the search string with a pipe, i.e. '| windbag'
#

import os, sys, time, datetime
import splunk.util as utilq2
import splunk.Intersplunk as isp
import logging as logger
import copy, csv, re, urllib

splunk_home = os.getenv('SPLUNK_HOME')
sessionKey = ""
owner = "" 
app = "Splunk_Security_Essentials" 
dataset = ""
for line in sys.stdin:
  m = re.search("search:\s*(.*?)$", line)
  if m:
          searchString = urllib.unquote(m.group(1))
          if searchString:
            m = re.search("sseanalytics[^\|]*app=\"*\s*([^ \"]*)", searchString)
            if m:
              app = m.group(1)
            m = re.search("sseanalytics[^\|]*dataset\s*=\s*\"([^\"])", searchString)
            if m:
              dataset = m.group(1)
            m = re.search("sseanalytics[^\|]*dataset\s*=\s*(\w[^ ])", searchString)
            if m:
              dataset = m.group(1)
  m = re.search("sessionKey:\s*(.*?)$", line)
  if m:
          sessionKey = m.group(1)
  m = re.search("owner:\s*(.*?)$", line)
  if m:
          owner = m.group(1)


          owner = m.group(1)

class PANLogMessage(object):

    data = {
        "_raw": "May 10 21:10:43 host 0,2019/05/10 21:10:43,007200002536,TRAFFIC,end,0,2019/05/10 21:10:43,10.154.196.169,204.13.251.20,,,Watch Public DNS and SMTP,pancademo\jordan.bowery,,dns,vsys1,L3-TAP,L3-TAP,ethernet1/2,ethernet1/2,ToUS1RAMA,2019/05/10 21:10:43,539790,1,62070,53,0,0,0x64,udp,allow,280,89,191,2,2019/05/10 21:10:43,0,any,0,4411113453,0x8000000000000000,10.0.0.0-10.255.255.255,United States,0,1,1,aged-out,31,12,0,0,,us1,from-policy,,,0,,0,,N/A",
        "_time": str(time.time()),
        "action": "allow",
        "action_flags": "0x8000000000000000",
        "action_source": "from-policy",
        "app": "dns",
        "bytes": "280",
        "bytes_in": "191",
        "bytes_out": "89",
        "dest_interface": "ethernet1/2",
        "dest_ip": "204.13.251.20",
        "dest_location": "United States",
        "dest_port": "53",
        "dest_translated_ip": "",
        "dest_translated_port": "0",
        "dest_user": "",
        "dest_vm": "",
        "dest_zone": "L3-TAP",
        "devicegroup_level1": "31",
        "devicegroup_level2": "12",
        "devicegroup_level3": "0",
        "devicegroup_level4": "0",
        "duration": "0",
        "dvc_name": "us1",
        "future_use1": "May 10 21:10:43 host 0",
        "future_use2": "0",
        "future_use3": "43595.8824421296",
        "future_use4": "0",
        "future_use5": "0",
        "generated_time": "43595.8824421296",
        "host": "panfw.mydomain.local",
        "http_category": "any",
        "log_forwarding_profile": "ToUS1RAMA",
        "log_subtype": "end",
        "packets": "2",
        "packets_in": "1",
        "packets_out": "1",
        "punct": "#@&!#(%!",
        "receive_time": "43595.8824421296",
        "repeat_count": "1",
        "rule": "Watch Public DNS and SMTP",
        "sequence_number": "4411113453",
        "serial_number": "7200002536",
        "session_end_reason": "aged-out",
        "session_flags": "0x64",
        "session_id": "539790",
        "source": "pan:traffic",
        "sourcetype": "pan:traffic",
        "src_interface": "ethernet1/2",
        "src_ip": "10.154.196.169",
        "src_location": "10.0.0.0-10.255.255.255",
        "src_port": "62070",
        "src_translated_ip": "",
        "src_translated_port": "0",
        "src_user": "pancademo\jordan.bowery",
        "src_vm": "",
        "src_zone": "L3-TAP",
        "start_time": "43595.8824421296",
        "transport": "udp",
        "tunnel_id": "0",
        "tunnel_monitor_tag": "",
        "tunnel_session_id": "0",
        "tunnel_start_time": "",
        "tunnel_type": "N/A",
        "type": "TRAFFIC",
        "vsys": "vsys12",
        "vsys_name": " "
    }

    def __init__(self, log):
        self.data.update(log) #just merge your log data with the default settings
        try: #remove what appear to be unmapped fields 
            del self.data["user"]
            del self.data['category']
        except KeyError:
            pass

def pan_logs(log_array):
    fields = [
        "_time", "_raw", "host", "punct", "sourcetype", "_cd", "source",
        "action", "action_flags", "action_source", "app", "bytes", "bytes_in",
        "bytes_out", "dest_interface", "dest_ip", "dest_location", "dest_port",
        "dest_translated_ip", "dest_translated_port", "dest_user", "dest_vm",
        "dest_zone", "devicegroup_level1", "devicegroup_level2",
        "devicegroup_level3", "devicegroup_level4", "duration", "dvc_name",
        "future_use1", "future_use2", "future_use3", "future_use4",
        "future_use5", "generated_time", "http_category",
        "log_forwarding_profile", "log_subtype", "packets", "packets_in",
        "packets_out", "receive_time", "repeat_count", "rule",
        "sequence_number", "serial_number", "session_end_reason",
        "session_flags", "session_id", "src_interface", "src_ip",
        "src_location", "src_port", "src_translated_ip", "src_translated_port",
        "src_user", "src_vm", "src_zone", "start_time", "transport",
        "tunnel_id", "tunnel_monitor_tag", "tunnel_session_id",
        "tunnel_start_time", "tunnel_type", "type", "vsys", "vsys_name"
    ]

    fh = sys.stdout # write to stdout
    writer = csv.writer(fh,
                            quotechar='"',
                            quoting=csv.QUOTE_ALL)
    writer.writerow(fields)
    for index, log in enumerate(log_array, start=1):
      log['_cd'] = index
      log_as_list = [ log[k] for k in fields ]
      writer.writerow(log_as_list) 


def main():
    if dataset == "Sample Firewall Data" or True:
        csvfile = "od_splunklive_fw_data.csv"
        path = splunk_home + "/etc/apps/" + app + "/lookups/" + csvfile
        #csvfile = "short.csv"
        logs = []
        with open(path) as f:
            logs = [row for row in csv.DictReader(f, skipinitialspace=True) ]
            pan_logs(PANLogMessage(log).data for log in logs)


main()
# pan_logs([ {"source": "hiThere"}, {"source": "oh:sttaaahhp"}])


sys.exit(0)





# # coding=utf-8

# #
# # Windag search operator
# #
# # Generates structured data for development use.
# #
# # Usage:
# #
# #   At the most basic level, you can just do 'windbag'.  The arguments
# #   listed below in DEFAULT_ARGS can all be overridden as search arguments in
# #   the search string, i.e., 'windbag multiline=true rowcount=3000'.  From the
# #   current UI, prefix the search string with a pipe, i.e. '| windbag'
# #

# import os, sys, time, datetime
# import splunk.util as utilq2
# import splunk.Intersplunk as isp
# import logging as logger
# import copy, csv, re, urllib

# splunk_home = os.getenv('SPLUNK_HOME')
# sessionKey = ""
# owner = "" 
# app = "Splunk_Security_Essentials" 
# dataset = ""
# for line in sys.stdin:
#   m = re.search("search:\s*(.*?)$", line)
#   if m:
#           searchString = urllib.unquote(m.group(1))
#           if searchString:
#             m = re.search("sseanalytics[^\|]*app=\"*\s*([^ \"]*)", searchString)
#             if m:
#               app = m.group(1)
#             m = re.search("sseanalytics[^\|]*dataset\s*=\s*\"([^\"])", searchString)
#             if m:
#               dataset = m.group(1)
#             m = re.search("sseanalytics[^\|]*dataset\s*=\s*(\w[^ ])", searchString)
#             if m:
#               dataset = m.group(1)
#   m = re.search("sessionKey:\s*(.*?)$", line)
#   if m:
#           sessionKey = m.group(1)
#   m = re.search("owner:\s*(.*?)$", line)
#   if m:
#           owner = m.group(1)


# #print '_time,_raw,host,punct,sourcetype,_cd,source,action'
# #print '1557775277.696219,"May 10 21:10:43 host 0,2019/05/10 21:10:43,007200002536,TRAFFIC,end,0,2019/05/10 21:10:43,10.154.196.169,204.13.251.20,,,Watch Public DNS and SMTP,pancademo\jordan.bowery,,dns,vsys1,L3-TAP,L3-TAP,ethernet1/2,ethernet1/2,ToUS1RAMA,2019/05/10 21:10:43,539790,1,62070,53,0,0,0x64,udp,allow,280,89,191,2,2019/05/10 21:10:43,0,any,0,4411113453,0x8000000000000000,10.0.0.0-10.255.255.255,United States,0,1,1,aged-out,31,12,0,0,,us1,from-policy,,,0,,0,,N/A",panfw.mydomain.local,#@&!#(%!,pan:traffic,1,pan:traffic,allow'
# # print '1557774257.696219,أنا قادر على أكل الزجاج و هذا لا يؤلمني.,Arabic,#@&!#(%!,mysourcetype,1,mysource,allow'
# # print '1557773237.696219,Կրնամ ապակի ուտել և ինծի անհանգիստ չըներ։,Armenian,#@&!#(%!,mysourcetype,1,mysource,allow'


# def pan_logs(log_array):
#     fields = ["_time", "_raw", "host", "punct", "sourcetype", "_cd", "source", "action", "action_flags", "action_source", "app", "bytes", "bytes_in", "bytes_out", "dest_interface", "dest_ip", "dest_location", "dest_port", "dest_translated_ip", "dest_translated_port", "dest_user", "dest_vm", "dest_zone", "devicegroup_level1", "devicegroup_level2", "devicegroup_level3", "devicegroup_level4", "duration", "dvc_name", "future_use1", "future_use2", "future_use3", "future_use4", "future_use5", "generated_time", "http_category", "log_forwarding_profile", "log_subtype", "packets", "packets_in", "packets_out", "receive_time", "repeat_count", "rule", "sequence_number", "serial_number", "session_end_reason", "session_flags", "session_id", "src_interface", "src_ip", "src_location", "src_port", "src_translated_ip", "src_translated_port", "src_user", "src_vm", "src_zone", "start_time", "transport", "tunnel_id", "tunnel_monitor_tag", "tunnel_session_id", "tunnel_start_time", "tunnel_type", "type", "vsys", "vsys_name"]
#     print ','.join(fields)
#     templateLog = {
#         "_raw": "May 10 21:10:43 host 0,2019/05/10 21:10:43,007200002536,TRAFFIC,end,0,2019/05/10 21:10:43,10.154.196.169,204.13.251.20,,,Watch Public DNS and SMTP,pancademo\jordan.bowery,,dns,vsys1,L3-TAP,L3-TAP,ethernet1/2,ethernet1/2,ToUS1RAMA,2019/05/10 21:10:43,539790,1,62070,53,0,0,0x64,udp,allow,280,89,191,2,2019/05/10 21:10:43,0,any,0,4411113453,0x8000000000000000,10.0.0.0-10.255.255.255,United States,0,1,1,aged-out,31,12,0,0,,us1,from-policy,,,0,,0,,N/A",
#         "_time": "2019-05-13T15:21:17.696-0400",
#         "action": "allow",
#         "action_flags": "0x8000000000000000",
#         "action_source": "from-policy",
#         "app": "dns",
#         "bytes": "280",
#         "bytes_in": "191",
#         "bytes_out": "89",
#         "dest_interface": "ethernet1/2",
#         "dest_ip": "204.13.251.20",
#         "dest_location": "United States",
#         "dest_port": "53",
#         "dest_translated_ip": "",
#         "dest_translated_port": "0",
#         "dest_user": "",
#         "dest_vm": "",
#         "dest_zone": "L3-TAP",
#         "devicegroup_level1": "31",
#         "devicegroup_level2": "12",
#         "devicegroup_level3": "0",
#         "devicegroup_level4": "0",
#         "duration": "0",
#         "dvc_name": "us1",
#         "future_use1": "May 10 21:10:43 host 0",
#         "future_use2": "0",
#         "future_use3": "43595.8824421296",
#         "future_use4": "0",
#         "future_use5": "0",
#         "generated_time": "43595.8824421296",
#         "host": "panfw.mydomain.local",
#         "http_category": "any",
#         "log_forwarding_profile": "ToUS1RAMA",
#         "log_subtype": "end",
#         "packets": "2",
#         "packets_in": "1",
#         "packets_out": "1",
#         "punct": "#@&!#(%!",
#         "receive_time": "43595.8824421296",
#         "repeat_count": "1",
#         "rule": "Watch Public DNS and SMTP",
#         "sequence_number": "4411113453",
#         "serial_number": "7200002536",
#         "session_end_reason": "aged-out",
#         "session_flags": "0x64",
#         "session_id": "539790",
#         "source": "pan:traffic",
#         "sourcetype": "pan:traffic",
#         "src_interface": "ethernet1/2",
#         "src_ip": "10.154.196.169",
#         "src_location": "10.0.0.0-10.255.255.255",
#         "src_port": "62070",
#         "src_translated_ip": "",
#         "src_translated_port": "0",
#         "src_user": "pancademo\jordan.bowery",
#         "src_vm": "",
#         "src_zone": "L3-TAP",
#         "start_time": "43595.8824421296",
#         "transport": "udp",
#         "tunnel_id": "0",
#         "tunnel_monitor_tag": "",
#         "tunnel_session_id": "0",
#         "tunnel_start_time": "",
#         "tunnel_type": "N/A",
#         "type": "TRAFFIC",
#         "vsys": "vsys1",
#         "vsys_name": ""
#     }
#     eventNum = 1
#     for log in log_array:
#         output = ""
#         log["_cd"] = str(eventNum)
#         if "_time" not in log:
#             log["_time"] = int(time.time())
#         eventNum += 1
#         for field in fields:
#             if output != "":
#                 output += ','
#             if field in log: 
#                 output += '"' + log[field] + '"'
#             elif field in templateLog:
#                 output += '"' + templateLog[field] + '"'
#         print output



# if dataset == "Sample Firewall Data" or True:
#     csvfile = "od_splunklive_fw_data.csv"
#     #csvfile = "ping_firewall_data_anon.csv"
#     path = splunk_home + "/etc/apps/" + app + "/lookups/" + csvfile
#     logs = []

#     fields = ["_time", "_raw", "host", "punct", "sourcetype", "_cd", "source", "action", "action_flags", "action_source", "app", "bytes", "bytes_in", "bytes_out", "dest_interface", "dest_ip", "dest_location", "dest_port", "dest_translated_ip", "dest_translated_port", "dest_user", "dest_vm", "dest_zone", "devicegroup_level1", "devicegroup_level2", "devicegroup_level3", "devicegroup_level4", "duration", "dvc_name", "future_use1", "future_use2", "future_use3", "future_use4", "future_use5", "generated_time", "http_category", "log_forwarding_profile", "log_subtype", "packets", "packets_in", "packets_out", "receive_time", "repeat_count", "rule", "sequence_number", "serial_number", "session_end_reason", "session_flags", "session_id", "src_interface", "src_ip", "src_location", "src_port", "src_translated_ip", "src_translated_port", "src_user", "src_vm", "src_zone", "start_time", "transport", "tunnel_id", "tunnel_monitor_tag", "tunnel_session_id", "tunnel_start_time", "tunnel_type", "type", "vsys", "vsys_name"]
#     print ','.join(fields)
#     templateLog = {
#         "_raw": "May 10 21:10:43 host 0,2019/05/10 21:10:43,007200002536,TRAFFIC,end,0,2019/05/10 21:10:43,10.154.196.169,204.13.251.20,,,Watch Public DNS and SMTP,pancademo\jordan.bowery,,dns,vsys1,L3-TAP,L3-TAP,ethernet1/2,ethernet1/2,ToUS1RAMA,2019/05/10 21:10:43,539790,1,62070,53,0,0,0x64,udp,allow,280,89,191,2,2019/05/10 21:10:43,0,any,0,4411113453,0x8000000000000000,10.0.0.0-10.255.255.255,United States,0,1,1,aged-out,31,12,0,0,,us1,from-policy,,,0,,0,,N/A",
#         "_time": "2019-05-13T15:21:17.696-0400",
#         "action": "allow",
#         "action_flags": "0x8000000000000000",
#         "action_source": "from-policy",
#         "app": "dns",
#         "bytes": "280",
#         "bytes_in": "191",
#         "bytes_out": "89",
#         "dest_interface": "ethernet1/2",
#         "dest_ip": "204.13.251.20",
#         "dest_location": "United States",
#         "dest_port": "53",
#         "dest_translated_ip": "",
#         "dest_translated_port": "0",
#         "dest_user": "",
#         "dest_vm": "",
#         "dest_zone": "L3-TAP",
#         "devicegroup_level1": "31",
#         "devicegroup_level2": "12",
#         "devicegroup_level3": "0",
#         "devicegroup_level4": "0",
#         "duration": "0",
#         "dvc_name": "us1",
#         "future_use1": "May 10 21:10:43 host 0",
#         "future_use2": "0",
#         "future_use3": "43595.8824421296",
#         "future_use4": "0",
#         "future_use5": "0",
#         "generated_time": "43595.8824421296",
#         "host": "panfw.mydomain.local",
#         "http_category": "any",
#         "log_forwarding_profile": "ToUS1RAMA",
#         "log_subtype": "end",
#         "packets": "2",
#         "packets_in": "1",
#         "packets_out": "1",
#         "punct": "#@&!#(%!",
#         "receive_time": "43595.8824421296",
#         "repeat_count": "1",
#         "rule": "Watch Public DNS and SMTP",
#         "sequence_number": "4411113453",
#         "serial_number": "7200002536",
#         "session_end_reason": "aged-out",
#         "session_flags": "0x64",
#         "session_id": "539790",
#         "source": "pan:traffic",
#         "sourcetype": "pan:traffic",
#         "src_interface": "ethernet1/2",
#         "src_ip": "10.154.196.169",
#         "src_location": "10.0.0.0-10.255.255.255",
#         "src_port": "62070",
#         "src_translated_ip": "",
#         "src_translated_port": "0",
#         "src_user": "pancademo\jordan.bowery",
#         "src_vm": "",
#         "src_zone": "L3-TAP",
#         "start_time": "43595.8824421296",
#         "transport": "udp",
#         "tunnel_id": "0",
#         "tunnel_monitor_tag": "",
#         "tunnel_session_id": "0",
#         "tunnel_start_time": "",
#         "tunnel_type": "N/A",
#         "type": "TRAFFIC",
#         "vsys": "vsys1",
#         "vsys_name": ""
#     }
        
#     with open(path) as f:
#         # logs = [{k: v for k, v in row.items()}
#         #     for row in csv.DictReader(f, skipinitialspace=True)]
#         for rawlog in f:
#             log = rawlog.split(",");
#         # logs = [{k: v for k, v in row.items()}
#         #     for row in csv.DictReader(f, skipinitialspace=True)]
#         # for log in logs:
#             print '{!s},"May 10 21:10:43 host 0,2019/05/10 21:10:43,007200002536,TRAFFIC,end,0,2019/05/10 21:10:43,10.154.196.169,204.13.251.20,,,Watch Public DNS and SMTP,pancademo\jordan.bowery,,dns,vsys1,L3-TAP,L3-TAP,ethernet1/2,ethernet1/2,ToUS1RAMA,2019/05/10 21:10:43,539790,1,62070,53,0,0,0x64,udp,allow,280,89,191,2,2019/05/10 21:10:43,0,any,0,4411113453,0x8000000000000000,10.0.0.0-10.255.255.255,United States,0,1,1,aged-out,31,12,0,0,,us1,from-policy,,,0,,0,,N/A","panfw.mydomain.local","#@&!#(%!","pan:traffic","1","pan:traffic","{!s}","0x8000000000000000","from-policy","{!s}",{!s},{!s},{!s},"ethernet1/2",{!s},"United States",{!s},"","0","","","L3-TAP","31","12","0","0",{!s},"us1","May 10 21:10:43 host 0","0","43595.8824421296","0","0","43595.8824421296","any","ToUS1RAMA","end",{!s},{!s},{!s},"43595.8824421296","1","Watch Public DNS and SMTP","4411113453","7200002536","aged-out","0x64","539790","ethernet1/2",{!s},"10.0.0.0-10.255.255.255","62070","","0","{!s}","","L3-TAP","43595.8824421296","udp","0","","0","","N/A","TRAFFIC","vsys1",""'.format(
#             log[0] if log[0] != "" else templateLog["_time"], log[1] if log[1] != "" else templateLog["action"], log[2] if log[2] != "" else templateLog["app"], log[3] if log[3] != "" else templateLog["bytes"], log[4] if log[4] != "" else templateLog["bytes_in"], log[5] if log[5] != "" else templateLog["bytes_out"], log[6] if log[6] != "" else templateLog["dest_ip"], log[7] if log[7] != "" else templateLog["dest_port"], log[8] if log[8] != "" else templateLog["duration"], log[9] if log[9] != "" else templateLog["packets"], log[10] if log[10] != "" else templateLog["packets_in"], log[11] if log[12] != "" else templateLog["packets_out"], log[13] if log[13] != "" else templateLog["src_ip"], log[14] if log[14] != "" else templateLog["user"])
#     #pan_logs(logs)



