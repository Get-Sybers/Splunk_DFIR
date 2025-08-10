# Network Baselining with Zeek Logs

## Remote Access Protocols

### Remote Desktop Protocol (RDP)

```splunk
sourcetype="zeek:conn" (id.resp_p=3389 OR service="rdp")
| table _time, id.orig_h, id.orig_p, id.resp_h, id.resp_p, username, client_name, ciphers, rdp.client.build
```

### Secure Shell (SSH)

```splunk
sourcetype="zeek:conn" (id.resp_p=22 OR service="ssh")
| table _time, id.orig_h, id.orig_p, id.resp_h, id.resp_p, username, host_key, kex_algorithms
```

### Telnet

```splunk
sourcetype="zeek:conn" (id.resp_p=23 OR service="telnet")
| table _time, id.orig_h, id.orig_p, id.resp_h, id.resp_p, username, cmd, password
```

### Virtual Network Computing (VNC)

```splunk
sourcetype="zeek:conn" (id.resp_p=5900 OR service="vnc")
| table _time, id.orig_h, id.orig_p, id.resp_h, id.resp_p, password, display
```

### File Transfer Protocol (FTP)

```splunk
sourcetype="zeek:conn" (id.resp_p=21 OR service="ftp")
| table _time, id.orig_h, id.orig_p, id.resp_h, id.resp_p, username
```

### Server Message Block (SMB/CIFS)

```splunk
sourcetype="zeek:conn" (id.resp_p=445 OR service="smb" OR service="cifs")
| table _time, id.orig_h, id.orig_p, id.resp_h, id.resp_p, smb_cmd, smb_tree
```

### Internet Message Access Protocol (IMAP)

```splunk
sourcetype="zeek:conn" (id.resp_p=143 OR service="imap")
| table _time, id.orig_h, id.orig_p, id.resp_h, id.resp_p, imap.command, imap.arg
```

### Post Office Protocol version 3 (POP3)

```splunk
sourcetype="zeek:conn" (id.resp_p=110 OR service="pop3")
| table _time, id.orig_h, id.orig_p, id.resp_h, id.resp_p, pop3.command, pop3.arg
```

### Simple Network Management Protocol (SNMP)

```splunk
sourcetype="zeek:conn" (id.resp_p=161 OR service="snmp")
| table _time, id.orig_h, id.orig_p, id.resp_h, id.resp_p, snmp.community, snmp.version
```

### Remote Procedure Call (RPC)

Since RPC port numbers can vary, you might need to customize this query based on the specific port or behavior in your environment.

```splunk
sourcetype="zeek:conn" service="rpc"
| table _time, id.orig_h, id.orig_p, id.resp_h, id.resp_p, rpc.operation, rpc.object
```

## Process Execution Analysis

### Zeek "conn" Log

Search for process execution-related connections in the Zeek "conn" log. Focus on connections to and from your servers on common service ports:

```splunk
sourcetype="zeek:conn" (id.orig_h=<server_ip> OR id.resp_h=<server_ip>) service=http OR service=https
| table _time, id.orig_h, id.orig_p, id.resp_h, id.resp_p, service, proto
```

This query shows the timestamp, source and destination IP addresses, source and destination ports, service, and protocol for connections involving your server.

### Zeek "files" Log

Search for file transfers that might indicate process execution events:

```splunk
sourcetype="zeek:files" (tx_hosts=<server_ip> OR rx_hosts=<server_ip>)
| table _time, tx_hosts, rx_hosts, mime_type, filename
```

This query displays the timestamp, source and destination hosts, MIME type, and filename for file transfers involving your server.

## Visualizations for Anomalies

### Time Chart for Connections

Visualize the frequency of process execution-related connections over time using a time chart:

```splunk
sourcetype="zeek:conn" (id.orig_h=<server_ip> OR id.resp_h=<server_ip>) service=http OR service=https
| timechart span=1h count
```

In the Splunk interface:
- Click on "Visualizations" > "Chart"
- Select "Time Chart" as the visualization type
- In the search query, replace "1h" with the desired time span if needed

### Top Sources/Destinations

Create a bar chart to show the top source IP addresses associated with process execution:

```splunk
sourcetype="zeek:conn" (id.orig_h=<server_ip> OR id.resp_h=<server_ip>) service=http OR service=https
| top id.orig_h limit=10
```

In the Splunk interface:
- Click on "Visualizations" > "Chart"
- Select "Bar Chart" as the visualization type
- In the search query, replace "10" with the desired limit

### File Transfer Types

Visualize the distribution of transferred file types associated with potential process execution:

```splunk
sourcetype="zeek:files" (tx_hosts=<server_ip> OR rx_hosts=<server_ip>)
| chart count by mime_type
```

In the Splunk interface:
- Click on "Visualizations" > "Chart"
- Select "Column Chart" as the visualization type

### Behavioral Anomalies

Create an anomaly detection visualization using Splunk's Machine Learning Toolkit:

```splunk
sourcetype="zeek:conn" (id.orig_h=<server_ip> OR id.resp_h=<server_ip>) service=http OR service=https 
| mstats avg(count) as avg_conn by _time span=1h
| `outliers(avg_conn)`
```

In the Splunk interface: Click on "Visualizations" > "Machine Learning" > "Outlier Detection". Use the search query within the ML model creation process.

## Other Network Visualizations

### Time Series Anomaly Detection

- **Visualization:** Time Chart
- **Description:** Track the count of connections over time to spot sudden spikes, drops, or unusual patterns.

```splunk
sourcetype="zeek:conn" | timechart span=1h count as "Connection Count"
```

### Geographical Anomaly Detection

- **Visualization:** Geographical Heat Map
- **Description:** Display connection frequencies on a map to pinpoint unusual source locations.

```splunk
sourcetype="zeek:conn" | iplocation id.orig_h | geostats sum(count) as "Connection Count" by lat, lon
```

### Protocol Distribution Analysis

- **Visualization:** Donut Chart
- **Description:** Examine the distribution of protocols to identify uncommon or overused ones.

```splunk
sourcetype="zeek:conn" | stats count by service | eval Service=coalesce(service, "Unknown") | chart count by Service
```

### User and Host Behavior Analysis

- **Visualization:** Bar Chart
- **Description:** Visualize top users or hosts by connection count to pinpoint anomalies.

```splunk
sourcetype="zeek:conn" | top limit=10 id.orig_h
```

### Outlier Analysis

- **Visualization:** Scatter Plot
- **Description:** Plot average duration against standard deviation to highlight connections with unusual durations.

```splunk
sourcetype="zeek:conn"
| chart avg(duration) as "Average Duration", stdev(duration) as "Duration StDev" by id.orig_h
```

### Protocol-specific Anomalies

- **Visualization:** Table
- **Description:** Examine specific attributes like User-Agent strings in HTTP logs to find anomalies.

```splunk
sourcetype="zeek:http"
| top user_agent
```

### Flow Analysis

- **Visualization:** Sankey Diagram
- **Description:** Map flows between source and destination IPs to detect unexpected connections.

```splunk
sourcetype="zeek:conn"
| stats sum(orig_bytes) as "Total Bytes" by id.orig_h, id.resp_h
```

### Session Duration Analysis

- **Visualization:** Histogram
- **Description:** Plot distribution of session durations to identify connections with unusual session times.

```splunk
sourcetype="zeek:conn"
| histogram duration as "Session Duration" bins=20
```

## Finding Servers

### GitLab

```splunk
sourcetype="zeek:conn" (id.resp_p=80 OR id.resp_p=443) uri_path="/api/v4/internal/allowed" method="POST"
| stats values(id.resp_h) as servers
```

### Web Servers (HTTP/HTTPS)

```splunk
sourcetype="zeek:conn" (id.resp_p=80 OR id.resp_p=443)
| stats values(id.resp_h) as servers
```

### Kerberos

```splunk
sourcetype="zeek:kerberos"
| stats values(id.resp_h) as servers
```

### Domain Controllers (DC)

```splunk
sourcetype="zeek:conn" (id.resp_p=53 AND service="dns") zdns.qtype_name="SRV"
| stats values(id.resp_h) as servers
```

### Domain Name System (DNS)

```splunk
sourcetype="zeek:dns"
| stats values(id.resp_h) as servers
```

### Jira

```splunk
sourcetype="zeek:conn" (id.resp_p=80 OR id.resp_p=443) uri_path="/rest/api/2/serverInfo" method="GET"
| stats values(id.resp_h) as servers
```

## Find Servers Combined

```splunk
| multisearch
[ index=zeek sourcetype="zeek:conn" id.resp_p=53 AND service="dns" zdns.qtype_name="SRV"
| eval ServerName=id.resp_h, ServerType="Domain Controller (DC)", ServerIP=id.resp_h
| table ServerName, ServerType, ServerIP ]
[ index=zeek sourcetype="zeek:kerberos"
| eval ServerName=id.resp_h, ServerType="Kerberos", ServerIP=id.resp_h
| table ServerName, ServerType, ServerIP ]
[ index=zeek sourcetype="zeek:dns"
| eval ServerName=id.resp_h, ServerType="DNS Server", ServerIP=id.resp_h
| table ServerName, ServerType, ServerIP ]
[ index=zeek sourcetype="zeek:http"
| eval ServerName=id.resp_h, ServerType="Web Server", ServerIP=id.resp_h
| table ServerName, ServerType, ServerIP ]
[ index=zeek sourcetype="zeek:conn" (id.resp_p=21 OR service="ftp")
| eval ServerName=id.resp_h, ServerType="FTP Server", ServerIP=id.resp_h
| table ServerName, ServerType, ServerIP ]
[ index=zeek sourcetype="zeek:http" uri_path="/api/v4/internal/allowed" method="POST"
| eval ServerName=id.resp_h, ServerType="GitLab", ServerIP=id.resp_h
| table ServerName, ServerType, ServerIP ]
| dedup ServerName, ServerType, ServerIP
| table ServerName, ServerType, ServerIP
```