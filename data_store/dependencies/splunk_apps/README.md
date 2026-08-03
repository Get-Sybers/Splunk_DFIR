# Third-party Splunk app packages

Drop Splunkbase packages (`.tgz`, `.tar.gz`, `.spl`) here. They are installed
into the Splunk container at deploy time by
[`Install-ThirdParty-Apps.yml`](/ansible/playbooks/Install-ThirdParty-Apps.yml).

## Required

| App | Why it's needed | Splunkbase |
|:---|:---|:---|
| **Splunk_TA_zeek** (Corelight Add-on for Zeek) | **Load-bearing.** Does the Zeek TSV parsing — `INDEXED_EXTRACTIONS`, `TIMESTAMP_FIELDS = ts` — and routes `sourcetype=zeek` into `zeek:conn`, `zeek:dns`, … Without it Zeek logs ingest unparsed. | [app/5466](https://splunkbase.splunk.com/app/5466) |
| **sankey_diagram_app** | Backs three panels in the `BASELINE` → *BSL-host_triage* dashboard. Splunk has marked it EOL, so it may be hard to obtain. | [Splunkbase](https://splunkbase.splunk.com/) |

## Why these aren't in the repository

Both declare `"license": {"name": null, "text": null, "uri": null}` in their
`app.manifest` — no licence grant permitting redistribution. They were vendored
here until `v0.1.0-alpha`; shipping them was not clearly permitted, so the
operator now supplies them instead. See
[THIRD_PARTY_NOTICES.md](/THIRD_PARTY_NOTICES.md).

## Note

Splunkbase requires an authenticated session to download, so there is no URL to
curl — fetch them through a browser. This is also why installation is
offline-first: it reads packages from this directory and never touches the
network, which matters on an air-gapped forensic workstation.

Package files here are gitignored. Only this README is tracked.
