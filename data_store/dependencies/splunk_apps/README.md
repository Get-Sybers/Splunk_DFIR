# Third-party Splunk app packages

Drop Splunkbase packages (`.tgz`, `.tar.gz`, `.spl`) here. `deploy-splunk.sh`
mounts this directory into the container and lists each package in
**`SPLUNK_APPS_URL`**, which is the `splunk/splunk` image's own installation
mechanism — nothing custom.

splunk-ansible only downloads entries matching `http(s)://` or `file://`; a bare
local path is stat'd and used directly. So these install with **no network
access**, which matters because the container has none.

## Required

| App | Why it's needed | Splunkbase |
|:---|:---|:---|
| **Splunk_TA_zeek** (Corelight Add-on for Zeek) | **Load-bearing.** Does the Zeek TSV parsing — `INDEXED_EXTRACTIONS`, `TIMESTAMP_FIELDS = ts` — and routes `sourcetype=zeek` into `zeek:conn`, `zeek:dns`, … Without it Zeek logs ingest unparsed. | [app/5466](https://splunkbase.splunk.com/app/5466) |
| **sankey_diagram_app** | Backs three panels in the `BASELINE` → *BSL-host_triage* dashboard. Splunk has marked it EOL, so it may be hard to obtain. | [Splunkbase](https://splunkbase.splunk.com/) |

## Why these aren't in the repository

Both declare `"license": {"name": null, "text": null, "uri": null}` in their
`app.manifest` — no licence grant permitting redistribution. They were vendored
here until `v0.2.0-beta`; shipping them was not clearly permitted, so the
operator now supplies them instead. See
[THIRD_PARTY_NOTICES.md](/THIRD_PARTY_NOTICES.md).

## Note

Splunkbase requires an authenticated session to download, so there is no URL to
curl — fetch them through a browser. This is also why installation is
offline-first: it reads packages from this directory and never touches the
network, which matters on an air-gapped forensic workstation.

Package files here are gitignored. Only this README is tracked.
