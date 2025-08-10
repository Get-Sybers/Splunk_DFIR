# Network Baseline Components

## 1. Traffic Volume and Patterns
- **Source**: Zeek (`conn.log`)
- **Fields**: `bytes`, `packets`, `duration`

## 2. Protocols Used
- **Source**: Zeek (Protocol-specific logs like `http.log`, `dns.log`, `ssl.log`)
- **Fields**: `proto`, `service`

## 3. Baseline of Services
- **Source**: Zeek (`conn.log`, `service` detection logs)
- **Fields**: `service`, `id.resp_p` (destination port), `id.orig_p` (source port)

## 4. Device Identification
- **Source**: Raw pcap for IP and MAC addresses (requires packet-level analysis); Zeek for higher-level identification (`known_hosts.log`, `dhcp.log`)
- **Fields**: `id.orig_h` (source IP), `id.resp_h` (destination IP), MAC addresses (from pcap)

## 5. DNS Activity
- **Source**: Zeek (`dns.log`)
- **Fields**: `query`, `qtype`, `rcode`

## 6. Established Connections and Network Flows
- **Source**: Zeek (`conn.log`)
- **Fields**: `conn_state`, `id.orig_h` (source IP), `id.resp_h` (destination IP), `id.resp_p` (destination port), `id.orig_p` (source port)

## 7. Encryption
- **Source**: Zeek (`ssl.log`)
- **Fields**: `version`, `cipher`

## 8. Error Rates and Types
- **Source**: Zeek (`conn.log` for TCP errors, `dns.log` for DNS errors)
- **Fields**: TCP flags (within `conn.log`), `rcode` (within `dns.log`)

## 9. File Transfers
- **Source**: Zeek (`files.log`, `http.log` for HTTP file transfers)
- **Fields**: `filename`, `mime_type`, `total_bytes`

## 10. Behavior of Critical Assets
- **Source**: Zeek (Various logs depending on the asset type, e.g., `http.log`, `ssl.log`, `conn.log`)
- **Fields**: `id.orig_h`, `id.resp_h`, `service`, `conn_state`

## 11. User Behavior Analytics (UBA)
- **Source**: Zeek (if integrated with authentication logs or scripts to capture user IDs, otherwise raw pcap for basic activity)
- **Fields**: User IDs (custom scripts or logs), `timestamp`, `id.orig_h`, `id.resp_h`