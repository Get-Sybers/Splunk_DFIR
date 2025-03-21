"use strict"

var version // unused?

var ShowcaseInfo = []
$.ajax({
    url:
        $C["SPLUNKD_PATH"] +
        "/services/SSEShowcaseInfo?locale=" +
        window.localeString,
    async: false,
    success: function (returneddata) {
        ShowcaseInfo = returneddata
    },
})

var UseCasesBySource = new Object()

try {
    for (var summary in ShowcaseInfo["summaries"]) {
        var datasources =
            ShowcaseInfo["summaries"][summary]["datasource"]?.split("|")
        if(!datasources) continue;
        for (var i = 0; i < datasources.length; i++) {
            datasource = datasources[i]
            if (typeof UseCasesBySource[datasource] == "undefined") {
                UseCasesBySource[datasource] = new Object()
                UseCasesBySource[datasource]["count"] = 0
                UseCasesBySource[datasource]["listAll"] = []
                UseCasesBySource[datasource]["listRecommended"] = []
                UseCasesBySource[datasource]["shownList"] = []
            }
            UseCasesBySource[datasource]["count"]++
            if (
                typeof ShowcaseInfo["summaries"][summary]["highlight"] !=
                    "undefined" &&
                (ShowcaseInfo["summaries"][summary]["highlight"] == "true" ||
                    ShowcaseInfo["summaries"][summary]["highlight"] == "Yes" ||
                    ShowcaseInfo["summaries"][summary]["highlight"] == true)
            ) {
                UseCasesBySource[datasource]["listRecommended"].push(
                    ShowcaseInfo["summaries"][summary]["name"]
                )
            } else {
                UseCasesBySource[datasource]["listAll"].push(
                    ShowcaseInfo["summaries"][summary]["name"]
                )
            }
        }
    }
} catch (error) {
    console.log(error);
}

for (var Source in UseCasesBySource) {
    if (UseCasesBySource[Source]["listRecommended"].length < 6) {
        UseCasesBySource[Source]["shownList"] =
            UseCasesBySource[Source]["listRecommended"]
    } else {
        UseCasesBySource[Source]["shownList"] = UseCasesBySource[Source][
            "listRecommended"
        ].slice(0, 6)
    }
    if (UseCasesBySource[Source]["shownList"].length < 6) {
        if (
            UseCasesBySource[Source]["listAll"].length +
                UseCasesBySource[Source]["shownList"].length >=
            6
        ) {
            UseCasesBySource[Source]["shownList"] = UseCasesBySource[Source][
                "shownList"
            ].concat(
                UseCasesBySource[Source]["listAll"].slice(
                    0,
                    6 - UseCasesBySource[Source]["shownList"].length
                )
            )
        } else {
            UseCasesBySource[Source]["shownList"] = UseCasesBySource[Source][
                "shownList"
            ].concat(UseCasesBySource[Source]["listAll"])
        }
    }
}

var validDataSources = new Object()

validDataSources["Authentication"] = {
    technologies: [
        "Windows Security Logs",
        "Linux Auth Logs",
        "Cisco ISE",
        "Okta",
        "Duo",
    ],
    description:
        "<p>Authentication logs are some of the most ubiquitious across an environment, so it can be hard to know where to start. Everything from workstations to CRM systems to firewalls will track authentication activity. For most of those log sources, you will naturally get the authentication data as you use the Splunk Technology Add-ons to ingest all of the data, but there are a few that are typically a great place to start, particularly Windows Security Logs and, if you have them, Linux Auth logs. If you have a centralized authentication service such as Cisco ISE, that's also a great datasource.</p>",
}

validDataSources["Anti-Virus"] = {
    technologies: ["Symantec EP", "Trend Micro AV", "McAfee AV Plus"],
    description:
        "<p>Antivirus software was originally developed to detect and remove computer viruses, hence the name. However, with the proliferation of other kinds of malware, antivirus software started to provide protection from other computer threats.</p>",
}
validDataSources["Any Host Logs"] = {
    technologies: ["All Splunk Logs"],
    description:
        "Any Logs that exist in Splunk from the host itself can meet this need.",
}
validDataSources["Audit Trail"] = {
    technologies: [
        "AWS CloudTrail",
        "Salesforce.com Event Log File",
        "Okta",
        "Duo",
    ],
    description:
        "<p>Anything that tracks a user's activity will qualify under audit trail logs, whether it includes the activities from a SaaS Application, a custom in house application, or just what searches people run in Splunk.</p>",
}
validDataSources["CRM Logs"] = {
    technologies: ["Salesforce.com Event Log File"],
    description:
        "<p>Customer Relationship Management software is the life blood of your customer interactions, powers your sales force, and typically contains every important bit of data your competitors would want. Are you moniitoring that?</p>",
}
validDataSources["Configuration Management"] = {
    technologies: ["ServiceNow", "Puppet"],
    description:
        "<p>Ensuring that the right configurations are deployed in the right places is an arduous task at even a small company, but so configuration management tools make that easy by having access to data about your entire environment. Sounds like opportunity!</p>",
}
validDataSources["DHCP"] = {
    technologies: ["Windows", "Cisco", "Infoblox"],
    description:
        "<p>Dynamic Host Control Protocol is what gives every system in your environment an IP Address. That means their logs are key to understanding the movement of an asset, the sudden appearance of unusual behavior, or more. While there are few correlations built on DHCP, it is a key data source for investigation.</p>",
}
validDataSources["DLP"] = {
    technologies: [
        "Symantec DLP",
        "Digital Guardian",
        "Forcepoint",
        "Intel Security",
    ],
    description:
        "<p>Data Loss Prevention plays a key role in any insider threat, advanced attacker, or even accidental disclosure scenario. DLP allows you to track the content of information leaving the network, and often block anything that isn't approved and shouldn't be sent.</p>",
}
validDataSources["DNS"] = {
    technologies: [
        "Zscaler",
        "Splunk Stream DNS",
        "Windows DNS",
        "Microsoft Sysmon",
        "Cisco Umbrella",
        "Infoblox",
    ],
    description:
        "<p>DNS is one of the most undervalued data sources we see in many organizations starting out for Security. It keeps and authoritative record of what domains a user was trying to browse to, serving as a great investigative resource (particularly in a world of CDNs) and also providing extensive use for detection of threat intel hits or algorithmically generated domain names.</p>",
}
validDataSources["Electronic Medical Record System"] = {
    technologies: ["Cerner", "Epic"],
    description:
        "<p>The requirement to digitize Medical Records has resulted in a huge volume of sensitive information about all of us being written into databases around the world. Fortunately, it is easy to monitor the audit logs of those applications to find suspicious elements.</p>",
}
validDataSources["Email"] = {
    technologies: [
        "Office 365",
        "Cisco Email Security Applicance",
        "Proofpoint",
        "Symantec ES",
        "Mimecast",
    ],
    description:
        "<p>Email is not just a key communication channel in modern businesses, it is also a great way to for attackers to reach victims, or for data to leave your organization. There are a number of detections for email, so it's a key data source to ingest.</p>",
}
validDataSources["Endpoint Detection and Response"] = {
    technologies: [
        "Windows Process Launch Logs",
        "Microsoft Sysmon",
        "Tanium",
        "PAN Traps",
        "Carbon Black",
        "Symantec EP",
        "CrowdStrike",
        "Cylance",
        "Ziften",
    ],
    description:
        "<p>Endpoint Detection and Response products are all about providing telemetry from the endpoint itself. While individual products can vary, you will always find common trends like tracking running processes (including the process hash, allowing you to identify the file regardless of filename, parent process, command line string, and more), system changes, and if desired many other sources of visibility such as network traffic, and file system changes.</p>",
}
validDataSources["Backup"] = {
    technologies: ["Symantec NetBackup"],
    description:
        "<p>The Security Triad is Confidentiality, Integrity, and Availability. With many attacks occuring on availability, it's key to have a strong and monitored backup strategy in your portfolio. Make sure to monitor those logs, so that you can ensure everything is occurring as you'd expect.</p>",
}
validDataSources["IDS or IPS"] = {
    technologies: ["Palo Alto Networks", "Cisco FirePOWER", "Check Point"],
    description:
        "<p>Intrusion Detection or Prevention Systems will sit on your network and detect or block attacks before they effect your users. Monitoring these logs will allow you to find suspicious signals, or corroborate alerts from Anti-Virus.</p>",
}
validDataSources["Malware Detonation"] = {
    technologies: ["Zscaler", "FireEye", "PAN Traps", "Check Point"],
    description:
        "<p>Malware Detonation (aka Malware Sandbox, aka Malware Explosion, aka many other things) is the process of taking files, running them in a sandbox, and seeing what actions they take.</p>",
}
validDataSources["Network Communication"] = {
    technologies: [
        "Zscaler",
        "Palo Alto Networks",
        "Cisco ASA",
        "AWS VPC Flow",
        "Cisco iOS",
        "Juniper Devices",
        "Check Point",
        "Netflow",
        "Splunk Stream",
    ],
    description:
        "<p>Tracking any network connections inside your environment, or between your environment and the outside world, is typically one of the first actions any new Splunk user takes. The data is easy to bring in, and it provides immense value to security investigation and detection.</p>",
}
validDataSources["Patch Management"] = {
    technologies: ["ServiceNow", "Remedy"],
    description:
        "<p>Ensuring that your products are patched is a key priority for every business, living at #4 on the SANS Critical Security Control. Track that data in Splunk, so that you can enrich detections and investigations with patching context, realize a single pane of glass, and also serve as a detailed check for when you need to go deeper around failed patches.</p>",
}
validDataSources["Print Server Logs"] = {
    technologies: ["Windows Print Server"],
    description:
        "<p>Almost exclusively serving the concern of insiders exfiltrating data by printing it (perhaps with other operational needs like managing print costs), printer data is low volume and can have a high ROI for the organization.</p>",
}
validDataSources["Source Code Respository"] = {
    technologies: ["GitLabl", "Git", "BitBucket", "SVN", "Microsoft TFS"],
    description:
        "<p>For software companies, often their source code is the only intellectual property that truly matters. That means auditing access to it is key.</p>",
}
validDataSources["Ticketing System"] = {
    technologies: [
        "ServiceNow",
        "Atlassian Jira",
        "Splunk Enterprise Security",
    ],
    description:
        "<p>Ticketing systems can become the workflow engine of a SOC, or IT organization. Stage 5 in the Security Journey is all about operationalizing your ticketing system -- tracking when there are problems, helping customers be successful. If you are using an external ticketing system, it's important to be able to analyze those logs (and the current ticket status) in Splunk.</p>",
}
validDataSources["UEBA Alerts"] = {
    technologies: ["Splunk UBA"],
    description:
        "<p>Splunk is one solution across the products, so make sure to bring your alerts from Splunk UBA into Splunk ES or Splunk Enterprise, and conversely send your alert data from Splunk Enterprise or ES into Splunk UBA.</p>",
}
validDataSources["VPN"] = {
    technologies: ["Zscaler", "Cisco AnyConnect", "Juniper VPN"],
    description:
        "<p>VPNs by definition allow remote access to your environment, and so it's key to track who is accessing, what they are sending / receiving (and how much), and where they're connecting from / to. VPN is a foundational data source that should be in every Splunk environment.</p>",
}
validDataSources["Vulnerability Detection"] = {
    technologies: ["Qualys", "Tenable"],
    description:
        "<p>Vulnerability Detection is a great source of contextual data to have in Splunk. At a high level, it is similar to Patch Management, but it will usually sweep the entire environment also finding unknown hosts, hosts where you aren't tracking the patch status, and more. It's also usually a low volume data source, making it an easy win for Splunk ingestion.</p>",
}
validDataSources["Web Proxy"] = {
    technologies: [
        "Zscaler",
        "BlueCoat",
        "WebSense",
        "Palo Alto Networks",
        "Check Point",
        "Fortinet",
    ],
    description:
        "<p>Also on the list of the first few data sources you should ingest into Splunk, Proxy logs will tell you everything about where your users are going on the internet, and are key for everything from detecting insider threat to seeing drive-by-download malware to detecting command and control.</p>",
}
validDataSources["Web Server"] = {
    technologies: ["Apache", "IIS"],
    description:
        "<p>Ingesting data from your web server access logs is key if you're interested in detecting web attacks. Paired with general endpoint monitoring on the servers (including Endpoint Detection and Response), and with Splunk Stream network capture, you have a very strong solution for detecting and investigating web attacks.",
}
validDataSources["Windows Security"] = {
    technologies: ["Windows Security Logs"],
    description: "",
}
validDataSources["Other"] = {
    technologies: ["Other"],
    description: "Generic catch-all, generally for typos.",
}

var validTechnologies = new Object()
validTechnologies["Windows Process Launch Logs"] = {
    difficulty: "Easy",
    last_updated: "02/22/2018",
    description:
        "Windows Process Launch Logs will not give advanced telemetry around network connections, file writes, etc., but if you're looking for process launch information and the command line string (the most basic of EDR capabilities), it is built into Windows with a little bit of work.",
    guide: [
        "GI-1-DSOG-overview",
        "GI-2-expectationsandscale",
        "GI-3-indexesAndSourcetypes",
        "GI-4-forwarderOnWindows",
        "GI-5-outputsconf",
        "GI-6-References",
        "SC-WinSecurity-1-SizingEstimate",
        "SC-WinSecurity-2-InstallTA",
        "SC-WinSecurity-3-IndexesAndSourcetypes",
        "SC-WinSecurity-4-inputsconf",
        "SC-WinSecurity-5-References",
        "VC-WinSecurity-1-EnablingLog",
        "VC-WinSecurity-2-turnon4688",
        "VC-WinSecurity-3-CommandLineAuditing",
        "VC-WinSecurity-4-MaybePatch",
        "VC-WinSecurity-5-References",
    ],
}
validTechnologies["Windows Security Logs"] = {
    difficulty: "Easy",
    last_updated: "02/22/2018",
    description: "",
    guide: [
        "GI-1-DSOG-overview",
        "GI-2-expectationsandscale",
        "GI-3-indexesAndSourcetypes",
        "GI-4-forwarderOnWindows",
        "GI-5-outputsconf",
        "GI-6-References",
        "SC-WinSecurity-1-SizingEstimate",
        "SC-WinSecurity-2-InstallTA",
        "SC-WinSecurity-3-IndexesAndSourcetypes",
        "SC-WinSecurity-4-inputsconf",
        "SC-WinSecurity-5-References",
        "VC-WinSecurity-1-EnablingLog",
    ],
}
validTechnologies["Microsoft Sysmon"] = {
    difficulty: "Medium",
    last_updated: "02/22/2018",
    description:
        "Microsoft Sysmon is a free product from the Microsoft Sysinternals team that has been leveraged across many Splunk customers to provide fantastic visibility.",
    guide: [
        "GI-1-DSOG-overview",
        "GI-2-expectationsandscale",
        "GI-3-indexesAndSourcetypes",
        "GI-4-forwarderOnWindows",
        "GI-5-outputsconf",
        "GI-6-References",
        "SC-Sysmon-1-Overview",
        "SC-Sysmon-2-SizingEstimate",
        "SC-Sysmon-3-InstallTA",
        "SC-WinSecurity-3-IndexesAndSourcetypes",
        "SC-Sysmon-4-configurationfiles",
        "VC-Sysmon-1-SingleServer",
        "VC-Sysmon-1-LargeScale",
    ],
}
validTechnologies["Linux Auth Logs"] = {
    difficulty: "Easy",
    description: "",
    guide: [
        "GI-1-DSOG-overview",
        "GI-2-expectationsandscale",
        "GI-3-indexesAndSourcetypes",
        "GI-4-forwarderOnLinux",
        "GI-5-outputsconf",
        "GI-6-References",
        "SC-LinuxSecurity-1-SizingEstimate",
        "SC-LinuxSecurity-2-InstallTA",
        "SC-LinuxSecurity-3-IndexesAndSourcetypes",
        "SC-LinuxSecurity-4-inputsconf",
        "SC-LinuxSecurity-5-leastprivilege",
        "SC-LinuxSecurity-5-References",
        "VC-LinuxSecurity-1-EnablingLog",
    ],
}
validTechnologies["Tanium"] = { description: "" }
validTechnologies["Carbon Black"] = { description: "" }
validTechnologies["All Splunk Logs"] = { description: "", link: "" }
validTechnologies["Apache"] = { description: "", link: "" }
validTechnologies["Atlassian Jira"] = { description: "", link: "" }
validTechnologies["AWS CloudTrail"] = {
    difficulty: "Hard",
    last_updated: "02/22/2018",
    description: "",
    link: "",
    guide: [
        "GI-1-DSOG-overview",
        "GI-2-expectationsandscale",
        "GI-3-indexesAndSourcetypes",
        "GI-4-forwarderOnLinux",
        "GI-5-outputsconf",
        "GI-6-References",
        "VC-AWS-1-Overview",
        "VC-AWS-2-awsiam",
        "VC-AWS-3-awssns",
        "VC-AWS-4-awssqs",
        "VC-AWS-5-cloudtrail",
        "SC-AWS-1-WhereToCollect",
        "SC-AWS-2-InstallTA",
        "SC-AWS-3-IndexesAndSourcetypes",
        "SC-AWS-4-accountconfig",
        "SC-AWS-5-cloudtrailinput",
        "SC-AWS-6-updateAWSApp",
    ],
}
validTechnologies["AWS VPC Flow"] = {
    difficulty: "Hard",
    description: "",
    link: "",
    last_updated: "02/22/2018",
    guide: [
        "GI-1-DSOG-overview",
        "GI-2-expectationsandscale",
        "GI-3-indexesAndSourcetypes",
        "GI-4-forwarderOnLinux",
        "GI-5-outputsconf",
        "GI-6-References",
        "VC-AWS-1-Overview",
        "VC-AWS-2-awsiam",
        "VC-AWS-3-awssns",
        "VC-AWS-4-awssqs",
        "VC-AWS-5-vpcflow",
        "SC-AWS-1-WhereToCollect",
        "SC-AWS-2-InstallTA",
        "SC-AWS-3-IndexesAndSourcetypes",
        "SC-AWS-4-accountconfig",
        "SC-AWS-5-vpcflowinput",
        "SC-AWS-6-updateAWSApp",
    ],
}
validTechnologies["BitBucket"] = { description: "", link: "" }
validTechnologies["BlueCoat"] = { description: "", link: "" }
validTechnologies["Cerner"] = { description: "", link: "" }
validTechnologies["Check Point"] = { description: "", link: "" }
validTechnologies["Cisco"] = { description: "", link: "" }
validTechnologies["Cisco ASA"] = {
    difficulty: "Easy",
    last_updated: "02/22/2018",
    description:
        "Cisco ASA is one of most populate firewall data sources for Splunk ES. The Splunk Add-on for Cisco ASA has most number of downloads/installs on Splunkbase.",
    guide: [
        "GI-1-DSOG-overview",
        "GI-2-expectationsandscale",
        "GI-3-indexesAndSourcetypes",
        "GI-4-forwarderOnLinux",
        "GI-5-outputsconf",
        "GI-6-References",
        "VC-General-1-syslogoverview",
        "VC-ASA-2-rsyslog-config",
        "VC-ASA-3-logrotate",
        "VC-ASA-4-enablesyslog",
        "VC-ASA-5-ruleconfiguration",
        "SC-ASA-1-SizingEstimate",
        "SC-ASA-2-InstallTA",
        "SC-ASA-3-IndexesAndSourcetypes",
        "SC-ASA-4-inputsconf",
    ],
}
validTechnologies["Cisco AnyConnect"] = { description: "", link: "" }
validTechnologies["Cisco Email Security Applicance"] = {
    description: "",
    link: "",
}
validTechnologies["Cisco FirePOWER"] = { description: "", link: "" }
validTechnologies["Cisco ISE"] = { description: "", link: "" }
validTechnologies["Cisco Umbrella"] = { description: "", link: "" }
validTechnologies["Cisco iOS"] = { description: "", link: "" }
validTechnologies["CrowdStrike"] = { description: "", link: "" }
validTechnologies["Cylance"] = { description: "", link: "" }
validTechnologies["Digital Guardian"] = { description: "", link: "" }
validTechnologies["Duo"] = { description: "", link: "" }
validTechnologies["Epic"] = { description: "", link: "" }
validTechnologies["FireEye"] = { description: "", link: "" }
validTechnologies["Forcepoint"] = { description: "", link: "" }
validTechnologies["Fortinet"] = { description: "", link: "" }
validTechnologies["IIS"] = { description: "", link: "" }
validTechnologies["Infoblox"] = { description: "", link: "" }
validTechnologies["Intel Security"] = { description: "", link: "" }
validTechnologies["Juniper Devices"] = { description: "", link: "" }
validTechnologies["Juniper VPN"] = { description: "", link: "" }
validTechnologies["McAfee AV Plus"] = { description: "", link: "" }
validTechnologies["Microsoft TFS"] = { description: "", link: "" }
validTechnologies["Mimecast"] = { description: "", link: "" }
validTechnologies["Netflow"] = { description: "", link: "" }
validTechnologies["Office 365"] = {
    difficulty: "Hard",
    description: "",
    last_updated: "02/22/2018",
    link: "",
    guide: [
        "GI-1-DSOG-overview",
        "GI-2-expectationsandscale",
        "GI-3-indexesAndSourcetypes",
        "GI-4-forwarderOnLinux",
        "GI-5-outputsconf",
        "GI-6-References",
        "VC-o365-1-Overview",
        "VC-o365-2-configureo365",
        "SC-o365-1-SizingEstimate",
        "SC-o365-2-WhereToCollect",
        "SC-o365-3-InstallTA",
        "SC-o365-4-IndexesAndSourcetypes",
        "SC-o365-5-configuration",
    ],
}
validTechnologies["Okta"] = { description: "", link: "" }
validTechnologies["PAN Traps"] = { description: "", link: "" }
validTechnologies["Palo Alto Networks"] = {
    difficulty: "Medium",
    last_updated: "02/22/2018",
    description: "",
    guide: [
        "GI-1-DSOG-overview",
        "GI-2-expectationsandscale",
        "GI-3-indexesAndSourcetypes",
        "GI-4-forwarderOnLinux",
        "GI-5-outputsconf",
        "GI-6-References",
        "VC-General-1-syslogoverview",
        "VC-PAN-2-rsyslog-config",
        "VC-PAN-3-logrotate",
        "VC-PAN-4-enablesyslog",
        "SC-PAN-1-SizingEstimate",
        "SC-PAN-2-InstallTA",
        "SC-PAN-3-IndexesAndSourcetypes",
        "SC-PAN-4-inputsconf",
        "SC-PAN-5-pan_app_changes",
    ],
}
validTechnologies["Proofpoint"] = { description: "", link: "" }
validTechnologies["Puppet"] = { description: "", link: "" }
validTechnologies["Qualys"] = { description: "", link: "" }
validTechnologies["Remedy"] = { description: "", link: "" }
validTechnologies["SVN"] = { description: "", link: "" }
validTechnologies["Salesforce.com Event Log File"] = {
    description: "",
    link: "",
}
validTechnologies["ServiceNow"] = { description: "", link: "" }
validTechnologies["Splunk Enterprise Security"] = { description: "", link: "" }
//validTechnologies["Splunk Stream"] = { "description": "", "last_updated": "02/22/2018", "guide": ["GI-1-DSOG-overview", "GI-2-expectationsandscale", "GI-3-indexesAndSourcetypes", "GI-4-forwarderOnWindows", "GI-5-outputsconf", "GI-6-References", "SC-Stream-1-Overview", "SC-Stream-2-SizingEstimate", "SC-Stream-3-IndexesAndSourcetypes", "SC-Stream-4-InstallStream", "SC-Stream-6-MultiServer"] }
validTechnologies["Splunk Stream DNS"] = {
    difficulty: "Medium",
    last_updated: "02/22/2018",
    description: "",
    guide: [
        "GI-1-DSOG-overview",
        "GI-2-expectationsandscale",
        "GI-3-indexesAndSourcetypes",
        "GI-4-forwarderOnWindows",
        "GI-5-outputsconf",
        "GI-6-References",
        "SC-Stream-1-Overview",
        "SC-Stream-2-SizingEstimate",
        "SC-Stream-3-IndexesAndSourcetypes",
        "SC-Stream-4-InstallStream",
        "SC-Stream-5-DNS",
        "SC-Stream-6-MultiServer",
    ],
}
validTechnologies["Splunk UBA"] = { description: "", link: "" }
validTechnologies["Symantec EP"] = {
    difficulty: "Easy",
    last_updated: "02/22/2018",
    description: "",
    guide: [
        "GI-1-DSOG-overview",
        "GI-2-expectationsandscale",
        "GI-3-indexesAndSourcetypes",
        "GI-4-forwarderOnWindows",
        "GI-5-outputsconf",
        "GI-6-References",
        "SC-Symantec-1-Overview",
        "SC-Symantec-2-SizingEstimate",
        "SC-Symantec-3-InstallTA",
        "SC-Symantec-4-IndexesAndSourcetypes",
        "SC-Symantec-5-configurationfiles",
        "VC-Symantec-1-Configuration",
    ],
}
validTechnologies["Symantec ES"] = {
    description: "",
    link: "https://www.symantec.com/connect/groups/symantec-apps-splunk",
}
validTechnologies["Symantec NetBackup"] = { description: "", link: "" }
validTechnologies["Tenable"] = { description: "", link: "" }
validTechnologies["Trend Micro AV"] = { description: "", link: "" }
validTechnologies["WebSense"] = { description: "", link: "" }
validTechnologies["Windows"] = { description: "", link: "" }
validTechnologies["Windows DNS"] = { description: "", link: "" }
// validTechnologies["Microsoft Sysmon"] = { "description": "", "link": "" }
validTechnologies["Windows Print Server"] = { description: "", link: "" }
validTechnologies["Ziften"] = { description: "", link: "" }
validTechnologies["Zscaler"] = {
    difficulty: "Medium",
    last_updated: "09/09/2021",
    description:
        "Zscaler can stream logs into the customer environments. This is facilitated via Zscaler supplied virtual machines which execute in a customer’s (or partner’s) hosted compute environment. ",
    guide: ["VC-ZSCALER-1-overview"],
}
validTechnologies["Other"] = { description: "Other", guide: ["SC-Other"] }

function TemplateTechnologies() {
    var OutputBlock = ""
    var technologies = new Object()
    var keys = []
    for (var validDataSource in validDataSources) {
        for (var technology in validDataSources[validDataSource][
            "technologies"
        ]) {
            technologies[
                validDataSources[validDataSource]["technologies"][technology]
            ] = 1
        }
    }
    for (k in technologies) {
        if (technologies.hasOwnProperty(k)) {
            keys.push(k)
        }
    }

    keys.sort()

    for (var i = 0; i < keys.length; i++) {
        if (keys[i].indexOf("function") == -1)
            if (typeof validTechnologies[keys[i]] == "undefined")
                OutputBlock +=
                    'validTechnologies["' +
                    keys[i] +
                    '"] = {"description": "", "link":""}\n'
    }

    // console.log(OutputBlock)
    window.OutputBlock = OutputBlock
}

function generateOutputs(servers) {
    var autoLBGroup = ""
    var serverList = ""
    // console.log("Generating zip file for ", servers)
    for (var i = 0; i < servers.length; i++) {
        if (autoLBGroup != "") autoLBGroup += ","
        autoLBGroup += servers[i] + ":9997"

        serverList += "\n\n[tcpout-server://" + servers[i] + ":9997]"
    }
    var outputs =
        "[tcpout]\ndefaultGroup = default-autolb-group\n\n[tcpout:default-autolb-group]\nserver = " +
        autoLBGroup +
        serverList
    var apps =
        "[launcher]\ndescription = org_all_forwarder_outputs\nauthor = \nversion = 1.0.0\n\n[package]\nid = localCompany-basic-outputs\n\n[ui]\nis_visible = 0\n"
    //var FileSaver = require('file-saver');
    // console.log("Here's my outputs..", outputs)
    require([
        "jquery",
        Splunk.util.make_full_url(
            "/static/app/Splunk_Security_Essentials/vendor/jszip/jszip.js"
        ),
        Splunk.util.make_full_url(
            "/static/app/Splunk_Security_Essentials/properties.js"
        ),
        Splunk.util.make_full_url(
            "/static/app/Splunk_Security_Essentials/vendor/FileSaver/FileSaver.js"
        ),
    ], function ($, JSZip, props) {
        // console.log("JSZip Loaded", JSZip)
        version = props.version // this is not used?
        var zip = new JSZip()
        var folder1 = zip.folder("org_all_forwarder_outputs")
        var myDefault = folder1.folder("default")
        myDefault.file("app.conf", apps)
        myDefault.file("outputs.conf", outputs)
        zip.generateAsync({ type: "blob" }).then(function (content) {
            // see FileSaver.js
            saveAs(content, "org_all_forwarder_outputs.zip")
            //console.log("Here's my content", content)
        })
    })
}

function generateIndexes() {
    var apps =
        "[launcher]\ndescription = org_all_indexes\nauthor = \nversion = 1.0.0\n\n[package]\nid = localCompany-standard-indexes\n\n[ui]\nis_visible = 0\n"

    require([
        "jquery",
        Splunk.util.make_full_url(
            "/static/app/Splunk_Security_Essentials/vendor/jszip/jszip.js"
        ),
        Splunk.util.make_full_url(
            "/static/app/Splunk_Security_Essentials/vendor/FileSaver/FileSaver.js"
        ),
    ], function ($, JSZip) {
        // console.log("JSZip Loaded", JSZip)
        var zip = new JSZip()
        var folder1 = zip.folder("org_all_indexes")
        var myDefault = folder1.folder("default")
        myDefault.file("app.conf", apps)
        myDefault.file("indexes.conf", $("pre[generatezip='indexes']").text())
        zip.generateAsync({ type: "blob" }).then(function (content) {
            // see FileSaver.js
            saveAs(content, "org_all_indexes.zip")
            //console.log("Here's my content", content)
        })
    })
}

function ShowOutputsModal() {
    // set the runtime environment, which controls cache busting
    var runtimeEnvironment = "production" // unused.

    // get app and page names
    var pathComponents = location.pathname.split("?")[0].split("/")
    var appName = "Splunk_Security_Essentials"
    var pageIndex = pathComponents.indexOf(appName)
    var pageName = pathComponents[pageIndex + 1] // unused.

    // path to the root of the current app
    var appPath = "../app/" + appName

    // This code is originally from setRequireConfig.es6 and is injected into runPageScript.es6 and every visualization.es6 file using @setRequireConfig.es6@

    var requireConfigOptions = {
        paths: {
            // app-wide path shortcuts
            components: appPath + "/components",
            vendor: appPath + "/vendor",
            Options: appPath + "/components/data/parameters/Options",

            // requirejs loader modules
            text: appPath + "/vendor/text/text",
            json: appPath + "/vendor/json/json",
            css: appPath + "/vendor/require-css/css",

            // srcviewer shims
            prettify: appPath + "/vendor/prettify/prettify",
            showdown: appPath + "/vendor/showdown/showdown",
            codeview: appPath + "/vendor/srcviewer/codeview",
        },
        config: {
            Options: {
                // app-wide options
                options: {
                    appName: "Splunk_Security_Essentials",
                    // the number of points that's considered "large" - how each plot handles this is up to it
                    plotPointThreshold: 1000,
                    maxSeriesThreshold: 1000,
                    smallLoaderScale: 0.4,
                    largeLoaderScale: 1,
                    defaultModelName: "default_model_name",
                    defaultRoleName: "default",
                    dashboardHistoryTablePageSize: 5,
                },
            },
        },
    }

    require.config(requireConfigOptions)

    require([
        "jquery",
        Splunk.util.make_full_url(
            "/static/app/Splunk_Security_Essentials/components/controls/Modal.js"
        ),
    ], function ($, Modal) {
        var initModal = function () {
            //this function is actually called at the end, because it depends on the enabledFilters being defined, which requires page load for a first time user.
            var myModal = new Modal(
                "chooseOutputsModal",
                {
                    title: "Provide Splunk Indexer Locations",
                    destroyOnHide: true,
                    type: "wide",
                },
                $
            )

            $(myModal.$el).on("hide", function () {
                // Not taking any action on hide, but you can if you want to!
            })

            var bodyContent =
                '<p style="display: block">While you can manually create your own outputs app that will tell your Splunk Search Head (if a dedicated one exists) and your Splunk Forwarders where the indexers are, that\'s not much fun. Below you can provide the DNS Name(s) or IP Address(es) for your Splunk indexer(s).</p><p>If you have just a single Splunk Server, just put that IP Address / DNS Name. If you have multiple Splunk servers, you should put the IP Addresses / DNS Names of all of the servers that are indexers. When you click "Get App" we will generate a zip file that contains the app you should put on anything Splunk that is *not* listed below. All your Forwarders, any dedicated Search Heads you have (for bigger environments only), should all send their data to the indexers, and this will tell them how. Splunk will the automatically distribute data to any of the hosts that are up -- you don\'t need to do any load balancing, HA support, or other configuration, just let Splunk do its thing.</p><form id="outputServers" name="outputServers"><div id="div_outputServers1"><input id="outputServers1" type="text" /></div><br/><button onClick="AddRow(\'outputServers\'); return false;">Add Server</button></form>'

            myModal.body
                .addClass("mlts-modal-form-inline")
                .append($(bodyContent))

            myModal.footer.append(
                $("<button>")
                    .addClass("mlts-modal-submit")
                    .attr({
                        type: "button",
                    })
                    .addClass("btn btn-primary mlts-modal-submit")
                    .text("Generate Zip")
                    .on("click", function () {
                        // console.log("Closing modal..")
                        var servers = []
                        $("#outputServers")
                            .find("input")
                            .each(function (count, element) {
                                if (
                                    typeof element.value != "undefined" &&
                                    element.value != "" &&
                                    element.value.replace(/\s*/g, "") != ""
                                ) {
                                    servers.push(element.value.replace())
                                }
                            })
                        // console.log("Got my servers!", servers)
                        generateOutputs(servers)
                        myModal.hide()
                        $("[data-bs-dismiss=modal").click()
                    })
            )
            window.FiltersModal = myModal
        }
        initModal()
        window.FiltersModal.show()
    })
}

function AddRow(id) {
    // console.log("Adding Row..", id)

    var maxNum = 0
    $("#" + id)
        .find("input")
        .each(function (count, element) {
            if (
                typeof element != "undefined" &&
                typeof element.id != "undefined"
            ) {
                if (
                    element.id.indexOf("outputServers") == 0 &&
                    parseInt(element.id.replace("outputServers", "")) > maxNum
                )
                    maxNum = parseInt(element.id.replace("outputServers", ""))
            }
        })
    var newNum = maxNum + 1

    var div = $("<div>").attr("id", "div_outputServers" + newNum)
    div.append('<input id="outputServers' + newNum + '" type="text" />')
    div.append(
        '<div style="display: inline-block; height: 1.4em; line-height: 1.4em; width: 2.5em;"><a href="#" class="close" onclick="$(\'#div_outputServers' +
            newNum +
            "').remove(); return false;\">Remove</a></div>"
    )
    div.insertAfter("#div_outputServers" + maxNum)
    // console.log("Just added ", div, "to go after item", maxNum, "element", "#div_outputServers" + maxNum)
}
/*
window.addEventListener('popstate', function(event) {
    if (event.state) {
        // console.log("Got a state request!", event.state)
        if(typeof event.state.myDS != "undefined" && event.state.myDS != window.myDS){ // the second is for the intra-page links.
            SetDataSource(event.state.myDS)
        }else if(typeof event.state.myTechnology != "undefined" && event.state.myDS != window.myTechnology){ // the second is for the intra-page links.
            $(".row, .contents-body").remove()
            SetTechnology(event.state.myTechnology)
        }else{
            ClearTokens()
        }
    }
}, false);
*/

function ClearTokens(tech) {
    require([
        "jquery",
        "splunkjs/mvc",
        "splunkjs/mvc/utils",
        "splunkjs/mvc/tokenutils",
        "splunkjs/mvc/simplexml",
        "splunkjs/ready!",
    ], function ($, mvc, utils, TokenUtils, DashboardController, Ready) {
        var unsubmittedTokens = mvc.Components.getInstance("default")
        var submittedTokens = mvc.Components.getInstance("submitted")

        unsubmittedTokens.unset("technology")
        unsubmittedTokens.unset("datasource")
        unsubmittedTokens.unset("dataSourcesTextRow")
        submittedTokens.unset("technology")
        submittedTokens.unset("datasource")
        submittedTokens.unset("dataSourcesTextRow")
    })
    ApplyTokens()
}

function SetTechnology(tech) {
    require([
        "jquery",
        "splunkjs/mvc",
        "splunkjs/mvc/utils",
        "splunkjs/mvc/tokenutils",
        "splunkjs/mvc/simplexml",
        "splunkjs/ready!",
    ], function ($, mvc, utils, TokenUtils, DashboardController, Ready) {
        var unsubmittedTokens = mvc.Components.getInstance("default")
        var submittedTokens = mvc.Components.getInstance("submitted")
        unsubmittedTokens.set("technology", tech)

        unsubmittedTokens.unset("datasource")
        unsubmittedTokens.unset("dataSourcesTextRow")
        submittedTokens.set(unsubmittedTokens.toJSON())

        submittedTokens.unset("datasource")
        submittedTokens.unset("dataSourcesTextRow")
    })
    ApplyTokens()
}

function SetDataSource(DS) {
    require([
        "jquery",
        "splunkjs/mvc",
        "splunkjs/mvc/utils",
        "splunkjs/mvc/tokenutils",
        "splunkjs/mvc/simplexml",
        "splunkjs/ready!",
    ], function ($, mvc, utils, TokenUtils, DashboardController, Ready) {
        var unsubmittedTokens = mvc.Components.getInstance("default")
        var submittedTokens = mvc.Components.getInstance("submitted")
        unsubmittedTokens.set("datasource", DS)

        unsubmittedTokens.unset("technology")
        //unsubmittedTokens.unset("dataSourcesTextRow");
        submittedTokens.set(unsubmittedTokens.toJSON())

        submittedTokens.unset("technology")
        //submittedTokens.unset("dataSourcesTextRow");
    })
    ApplyTokens()
}

function descriptionForDataSource(dataSourceName, disclaimerText) {
    var ReadyIt = "<h2>Description</h2>"
    ReadyIt += validDataSources[dataSourceName]["description"]
    if (typeof disclaimerText != "undefined") ReadyIt += disclaimerText
    ReadyIt += "<h2>Technologies</h2>"

    ReadyIt +=
        '<table class="table"><thead><tr><th style="width: 200px">Technology</th><th style="width: 100px">Guide Available</th><th style="width: 100px">Difficulty</th><th>Description</th></tr></thead><tbody>'
    validDataSources[dataSourceName]["technologies"].forEach(function (
        dataSourceName
    ) {
        if (
            typeof validTechnologies[dataSourceName] != "undefined" &&
            typeof validTechnologies[dataSourceName]["guide"] != "undefined" &&
            validTechnologies[dataSourceName]["guide"].length > 0
        ) {
            var difficulty = "Easy"
            if (
                typeof validTechnologies[dataSourceName]["difficulty"] !=
                    "undefined" &&
                validTechnologies[dataSourceName]["difficulty"] != ""
            )
                difficulty = validTechnologies[dataSourceName]["difficulty"]
            ReadyIt +=
                '<tr><td style="width: 200px"><a target="_blank" class="datasourcelink" href="data_source?technology=' +
                dataSourceName +
                '" >' +
                dataSourceName +
                "</a></td><td>Yes</td><td>" +
                difficulty +
                "</td><td>" +
                validTechnologies[dataSourceName]["description"] +
                "</td></tr>\n"
        } else if (
            typeof validTechnologies[dataSourceName] != "undefined" &&
            typeof validTechnologies[dataSourceName]["link"] != "undefined" &&
            validTechnologies[dataSourceName]["link"] != ""
        ) {
            ReadyIt +=
                '<tr><td style="width: 200px"><a class="datasourcelink external drilldown-link" href="' +
                validTechnologies[dataSourceName]["link"] +
                '" target="_blank" >' +
                dataSourceName +
                "</a></td><td></td><td></td><td>" +
                validTechnologies[dataSourceName]["description"] +
                "</td></tr>\n"
        } else {
            ReadyIt +=
                '<tr><td style="width: 200px">' +
                dataSourceName +
                "</td><td></td><td></td>"
            if (
                typeof validTechnologies[dataSourceName] != "undefined" &&
                typeof validTechnologies[dataSourceName]["description"] !=
                    "undefined"
            )
                ReadyIt +=
                    "<td>" +
                    validTechnologies[dataSourceName]["description"] +
                    "</td>"
            else ReadyIt += "<td></td>"
            ReadyIt += "</tr>\n"
        }
    })
    ReadyIt += "</tbody></table>"
    if (typeof UseCasesBySource[dataSourceName] != "undefined") {
        // console.log("Prepping, ", dataSourceName, UseCasesBySource[dataSourceName])
        ReadyIt +=
            "<h2>Number of Examples</h2><b>" +
            UseCasesBySource[dataSourceName]["count"] +
            "</b> Examples<h2>Sample Examples</h2><ul>"
        for (
            var i = 0;
            i < UseCasesBySource[dataSourceName]["shownList"].length;
            i++
        ) {
            ReadyIt +=
                "<li>" +
                UseCasesBySource[dataSourceName]["shownList"][i] +
                "</li>"
        }
        ReadyIt += "</ul>"
    }

    return ReadyIt
}

function ApplyTokens() {
    require([
        "jquery",
        "splunkjs/mvc",
        "splunkjs/mvc/utils",
        "splunkjs/mvc/tokenutils",
        "splunkjs/mvc/simplexml",
        "splunkjs/ready!",
    ], function ($, mvc, utils, TokenUtils, DashboardController, Ready) {
        // console.log("Kicking off!")
        var unsubmittedTokens = mvc.Components.getInstance("default")
        var submittedTokens = mvc.Components.getInstance("submitted")
        var myTechnology = unsubmittedTokens.get("technology")
        var myDS = unsubmittedTokens.get("datasource")
        if (
            typeof myTechnology != "undefined" &&
            myTechnology != null &&
            myTechnology.indexOf("#") >= 0
        ) {
            myTechnology = myTechnology.replace(/#.*/, "")
            SetTechnology(myTechnology)
            return false
        }
        if (
            typeof myDS != "undefined" &&
            myDS != null &&
            myDS.indexOf("#") >= 0
        ) {
            myDS = myDS.replace(/#.*/, "")
            SetDataSource(myDS)
            return false
        }
        var currentURL = window.location.href.replace(/[\?#].*/, "")
        if (typeof myDS != "undefined") {
            // console.log("Hey, I have a datasource!", validDataSources[myDS])
            if (typeof validDataSources[myDS] == "undefined") myDS = "Other"
            if (validDataSources[myDS]["technologies"].length == 1) {
                myTechnology = validDataSources[myDS]["technologies"][0]
            } else {
                var ReadyIt = ""
                $(".dashboard-header-title").text(myDS)

                ReadyIt += descriptionForDataSource(
                    myDS,
                    "<p>Splunk accepts data from any sources you have, and isn't limited to any particular vendors. One of our fundamental technologies is what is called Schema on the Fly (or Schema at Read) which allows us to ingest anything that is text, or can be converted to text, and get the same value out of it without implementation headaches. So while we don't play favorites, to make your life easier, we've included documentation on a some of common data sources that we get asked about the most.</p>\n"
                )
                ReadyIt += "\n</table>"
                // console.log("Setting Data Source", ReadyIt)
                unsubmittedTokens.set("dataSourcesTextRow", "Test")
                submittedTokens.set(unsubmittedTokens.toJSON())

                $("#dataSourceToTechnology").html(ReadyIt)
                $("#introTextRow").hide()
                $(".contents-body").hide()
            }
            currentURL = currentURL + "?datasource=" + myDS
        }
        if (typeof myTechnology != "undefined") {
            // console.log("Hey, I have a technology!", myTechnology)
            require([
                "components/data/sendTelemetry",
                "json!" +
                    $C["SPLUNKD_PATH"] +
                    "/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/sse_app_config",
            ], function (Telemetry, appConfig) {
                let record = { status: "docLoaded", pageName: myTechnology }
                for (let i = 0; i < appConfig.length; i++) {
                    if (
                        appConfig[i].param == "demoMode" &&
                        appConfig[i].value == "true"
                    ) {
                        record.demoMode = true
                    }
                }
                Telemetry.SendTelemetryToSplunk("PageStatus", record)
            })
            if (typeof validTechnologies[myTechnology] == "undefined")
                myTechnology = "Other"
            // console.log("Going to load", validTechnologies[myTechnology])
            $(".dashboard-header-title").text(myTechnology)
            if (
                typeof validTechnologies[myTechnology]["last_updated"] !=
                "undefined"
            ) {
                $(".dashboard-header-description").text(
                    "Last Updated: " +
                        validTechnologies[myTechnology]["last_updated"]
                )
            }
            var myDocs = []
            var collectedReferences = new Object()
            var currentSection = ""
            if (
                validTechnologies[myTechnology] &&
                validTechnologies[myTechnology]["guide"]
            ) {
                validTechnologies[myTechnology]["guide"]?.forEach(function (
                    step
                ) {
                    allDocItems.forEach(function (guide) {
                        if (guide["id"] == step) {
                            if (currentSection == "")
                                currentSection = guide["category"][0]

                            if (
                                currentSection != guide["category"][0] &&
                                Object.keys(collectedReferences).length > 0
                            ) {
                                if (
                                    currentSection !=
                                    "Data Source Onboarding Guide Overview"
                                ) {
                                    //id, title, short-description, category
                                    var mystring = ""
                                    for (var reference in collectedReferences) {
                                        if (
                                            typeof collectedReferences[
                                                reference
                                            ]["title"] != "undefined" &&
                                            collectedReferences[reference][
                                                "title"
                                            ] != ""
                                        ) {
                                            mystring +=
                                                '<li><a href="' +
                                                collectedReferences[reference][
                                                    "href"
                                                ] +
                                                '">' +
                                                collectedReferences[reference][
                                                    "title"
                                                ] +
                                                "</a></li>"
                                        } else {
                                            mystring +=
                                                '<li><a href="' +
                                                collectedReferences[reference][
                                                    "href"
                                                ] +
                                                '">' +
                                                collectedReferences[reference][
                                                    "href"
                                                ] +
                                                "</a></li>"
                                        }
                                    }
                                    var newElement = {
                                        id:
                                            currentSection.replace(
                                                /[^a-zA-Z0-9]/g,
                                                ""
                                            ) + "_references",
                                        title: currentSection + " References",
                                        "short-description":
                                            "<p>Here are links from this section:\n<ul>\n" +
                                            mystring +
                                            "</ul></p>",
                                        category: [currentSection],
                                    }
                                    // console.log("Adding references for", currentSection, newElement)
                                    myDocs.push(newElement)
                                }

                                collectedReferences = new Object()
                                currentSection = guide["category"][0]
                            }

                            $(guide["short-description"])
                                .find("a")
                                .each(function (num, obj) {
                                    if (
                                        typeof $(obj).attr("href") !=
                                            "undefined" &&
                                        $(obj).attr("href").indexOf("ttp") >=
                                            0 &&
                                        typeof $(obj).attr("noreferences") ==
                                            "undefined"
                                    ) {
                                        // console.log("going to add the following link, ", $(obj).attr("href"), $(obj).attr("title"), "to ", collectedReferences)
                                        if (
                                            typeof collectedReferences[
                                                $(obj).attr("href")
                                            ] == "undefined"
                                        ) {
                                            collectedReferences[
                                                $(obj).attr("href")
                                            ] = new Object()
                                            collectedReferences[
                                                $(obj).attr("href")
                                            ]["title"] = ""
                                            collectedReferences[
                                                $(obj).attr("href")
                                            ]["href"] = $(obj).attr("href") // duplicate I know, but it's prettier.
                                        }
                                        if (
                                            typeof $(obj).attr("title") !=
                                                "undefined" &&
                                            $(obj).attr("title").length >
                                                collectedReferences[
                                                    $(obj).attr("href")
                                                ]["title"].length
                                        ) {
                                            collectedReferences[
                                                $(obj).attr("href")
                                            ]["title"] = $(obj).attr("title")
                                        }
                                    }
                                })
                            if (guide["title"] != "References")
                                myDocs.push(guide)
                        }
                    })
                })
            }
            if (
                currentSection != "Data Source Onboarding Guide Overview" &&
                Object.keys(collectedReferences).length > 0
            ) {
                var mystring = ""
                for (var reference in collectedReferences) {
                    if (
                        typeof collectedReferences[reference]["title"] !=
                            "undefined" &&
                        collectedReferences[reference]["title"] != ""
                    ) {
                        mystring +=
                            '<li><a href="' +
                            collectedReferences[reference]["href"] +
                            '">' +
                            collectedReferences[reference]["title"] +
                            "</a></li>"
                    } else {
                        mystring +=
                            '<li><a href="' +
                            collectedReferences[reference]["href"] +
                            '">' +
                            collectedReferences[reference]["href"] +
                            "</a></li>"
                    }
                }
                var newElement = {
                    id:
                        currentSection.replace(/[^a-zA-Z0-9]/g, "") +
                        "_references",
                    title: currentSection + " References",
                    "short-description":
                        "<p>Here are links from this section:\n<ul>\n" +
                        mystring +
                        "</ul></p>",
                    category: [currentSection],
                }
                // console.log("Adding references for", currentSection, newElement)
                myDocs.push(newElement)
            }
            $("#introTextRow").hide()
            //$("#dataSourcesTextRowID").hide()

            currentURL = currentURL + "?technology=" + myTechnology
            HandleItExternal(myDocs)
        }
        if (typeof myDS == "undefined" && typeof myTechnology == "undefined") {
            $("#introTextRow").show()
            $(".dashboard-header-description")
                .removeClass("hidden")
                .text(
                    "Splunk can ingest data from any type of product. The following examples show data that has been ingested into Splunk Security Essentials."
                )
            $("#layout1").css("margin-top", "10px")
            var listOfGuides =
                "<p>Below, you will find a detailed list of the Data Sources that commonly make Splunk for Security (and certainly Splunk Security Essentials) tick, along with some of the common products for each.</p> <p>Among the full list, we have several products where we've built out full data onboarding guides, to help walk you through the process:"
            Object.keys(validTechnologies).forEach(function (techName) {
                if (
                    typeof validTechnologies[techName]["guide"] !=
                        "undefined" &&
                    validTechnologies[techName]["guide"].length > 0 &&
                    techName != "Other"
                ) {
                    listOfGuides +=
                        '<div style="display: inline-block; padding-right: 15px; line-height: 1.5em;"><a href="data_source?technology=' +
                        techName +
                        '" target="_blank">' +
                        techName +
                        "</a></div>\n"
                }
            })
            listOfGuides += "</p>"
            var ReadyIt =
                listOfGuides +
                '<div style="width: 920px; display: inline-block;"><table class="table table-chrome"><thead><tr><th><i class="icon-info"></i></th><th style="width: 350px">Data Source</th><th style="width: 260px"># of Common Products</th><th style="width: 260px"># of Data Source Guides</th></tr></thead><tbody>'
            Object.keys(validDataSources).forEach(function (dataSourceName) {
                if (dataSourceName != "Other") {
                    ReadyIt +=
                        '<tr><td class="expands"><a href="#" id="' +
                        dataSourceName.replace(/ /g, "_") +
                        '_link" class="expandlink"><i class="icon-chevron-right" /></a></td><td><div style="margin-bottom: 0px;" class="coredatasource"><a class="datasourcelink" href="onclick:return false;" >' +
                        dataSourceName +
                        "</a></div></td>\n"
                    ReadyIt +=
                        "<td>" +
                        validDataSources[dataSourceName]["technologies"]
                            .length +
                        "</td>"
                    var NumSourcesWithGuides = 0
                    for (
                        var i = 0;
                        i <
                        validDataSources[dataSourceName]["technologies"].length;
                        i++
                    ) {
                        if (
                            typeof validTechnologies[
                                validDataSources[dataSourceName][
                                    "technologies"
                                ][i]
                            ] != "undefined" &&
                            typeof validTechnologies[
                                validDataSources[dataSourceName][
                                    "technologies"
                                ][i]
                            ]["guide"] != "undefined"
                        )
                            NumSourcesWithGuides++
                    }
                    ReadyIt += "<td>" + NumSourcesWithGuides + "</td>"
                    ReadyIt += "</tr>"
                    ReadyIt +=
                        '<tr><td id="' +
                        dataSourceName.replace(/ /g, "_") +
                        '_detail"  style="display: none; border-top: 0;" colspan="4">'

                    ReadyIt += descriptionForDataSource(dataSourceName)

                    ReadyIt += "</td></tr>"
                }
            })
            ReadyIt += "</tbody></table></div>"
            $("#introTextRow").find(".panel-body").html(ReadyIt)
            $(".contents-body").hide()

            $(".expandlink").each(function (a, obj) {
                $(obj).click(function () {
                    $(
                        "#" + $(obj).attr("id").replace("_link", "") + "_detail"
                    ).toggle()
                    if (
                        $(obj)
                            .find("i")
                            .attr("class")
                            .indexOf("icon-chevron-right") >= 0
                    ) {
                        $(obj).find("i").attr("class", "icon-chevron-down")
                    } else {
                        $(obj).find("i").attr("class", "icon-chevron-right")
                    }
                    return false
                })
            })
            $(".expandlink").each(function (num, obj) {
                var linkobj = $(obj).parent().parent().find(".coredatasource")

                linkobj.click(function () {
                    $(
                        "#" + $(obj).attr("id").replace("_link", "") + "_detail"
                    ).toggle()
                    if (
                        $(obj)
                            .find("i")
                            .attr("class")
                            .indexOf("icon-chevron-right") >= 0
                    ) {
                        $(obj).find("i").attr("class", "icon-chevron-down")
                    } else {
                        $(obj).find("i").attr("class", "icon-chevron-right")
                    }

                    return false
                })
            })

            //$("#dataSourcesTextRowID").hide()
            //$("#introTextRow").hide()
        }
        //window.history.pushState({"myDS":myDS,"myTechnology":myTechnology},"", currentURL);
        // unsubmittedTokens.set(myDataset.replace(/\W/g,""),"Test");
        // submittedTokens.set(unsubmittedTokens.toJSON());
        window.myDS = myDS
        window.myTechnology = myTechnology

        /*HandleIt(exampleLayoutJSONforWindows)*/
    })
}
ApplyTokens()

function triggerDocsRead(id) {
    // console.log("Opening Trigger")
    if (
        typeof localStorage["sse-docs-" + id] == "undefined" ||
        localStorage["sse-docs-" + id] != "complete"
    ) {
        buttonText =
            '<img style="height: 1.2em; width: 1.2em;" src="' +
            Splunk.util.make_full_url(
                "/static/app/Splunk_Security_Essentials/images/general_images/ok_ico.gif"
            ) +
            '" /> Section Completed'
        $("#docsButton-" + id).html(buttonText)
        // console.log("Running it", buttonText)
        localStorage["sse-docs-" + id] = "complete"
        navCheckmark =
            '<img style="height: 1em; width: 1em;" src="' +
            Splunk.util.make_full_url(
                "/static/app/Splunk_Security_Essentials/images/general_images/ok_ico.gif"
            ) +
            '" />&nbsp;'
        $("#navLink-" + id).prepend(navCheckmark)
    } else {
        buttonText = "Mark Complete"
        $("#docsButton-" + id).html(buttonText)
        // console.log("Running it", buttonText)
        localStorage["sse-docs-" + id] = "notcomplete"
        $("#navLink-" + id).html(
            $("#navLink-" + id)
                .html()
                .replace(/\<img[^>]*[^;]*;/, "")
        )
    }
}

function DoImageSubtitles(numLoops) {
    if (typeof numLoops == "undefined") numLoops = 1
    var doAnotherLoop = false
    // console.log("Starting the Subtitle..")
    $(".documentation")
        .find("img")
        .each(function (count, img) {
            if (
                typeof $(img).css("width") != "undefined" &&
                parseInt($(img).css("width").replace("px")) > 10 &&
                typeof $(img).attr("processed") == "undefined"
            ) {
                var width = "width: " + $(img).css("width")

                var myTitle = ""
                if (
                    typeof $(img).attr("title") != "undefined" &&
                    $(img).attr("title") != ""
                ) {
                    myTitle =
                        '<p style="color: gray; display: inline-block; clear:both;' +
                        width +
                        '"><center><i>' +
                        $(img).attr("title") +
                        "</i></center>"
                }
                $(img).attr("processed", "true")
                if (
                    typeof $(img).attr("zoomin") != "undefined" &&
                    $(img).attr("zoomin") != ""
                ) {
                    $(img).replaceWith(
                        '<div style="display: block; margin:10px; border: 1px solid lightgray;' +
                            width +
                            '"><a href="' +
                            $(img).attr("src") +
                            '" target="_blank">' +
                            img.outerHTML +
                            "</a>" +
                            myTitle +
                            "</div>"
                    )
                } else {
                    $(img).replaceWith(
                        '<div style="display: block; margin:10px; border: 1px solid lightgray;' +
                            width +
                            '">' +
                            img.outerHTML +
                            myTitle +
                            "</div>"
                    )
                }
            } else {
                doAnotherLoop = true
                // console.log("Analyzing image: ", $(img).css("width"), $(img).attr("processed"), $(img))
            }
        })
    if (doAnotherLoop && numLoops < 30) {
        numLoops++
        setTimeout(function () {
            DoImageSubtitles(numLoops)
        }, 500)
    }
}

var allDocItems = [
    {
        id: "GI-1-DSOG-overview",
        title: "Overview",
        "short-description":
            "<p>Welcome to the Splunk Data Source Onboarding Guides (DSOGs)!</p> <p>Splunk has lots of docs, so why are we creating more? The primary goal of the DSOGs is to provide you with a curated, easy-to-digest view of the most common ways that Splunk users ingest data from our most popular sources, including how to configure the systems that will send us data (such as turning on AWS logging or Windows Security's process-launch logs, for example). While these guides won't cover every single possible option for installation or configuration, they will give you the most common, easiest way forward. </p> <p>How to use these docs: We've broken the docs out into different segments that get linked together. Many of them will be shared across multiple products. We suggest clicking the \"Mark Complete\" button above to remind yourself of those you've completed. Since this info will be stored locally in your browser, you won't have to worry about it affecting anyone else's view of the document. And when you're reading about ingesting Sysmon logs, for example, it's a convenient way to keep track of the fact that you already installed the forwarder in order to onboard your Windows Security logs.</p> <p>So, go on and dive right in! And don't forget, Splunk is here to make sure you're successful. Feel free to ask questions of your Sales Engineer or Professional Services Engineer, if you run into trouble. You can also look for answers or post your questions on <a title=\"Splunk Answers\" href=\"https://answers.splunk.com/\">https://answers.splunk.com/</a>.</p> ",
        category: ["Data Source Onboarding Guide Overview"],
    },
    {
        id: "GI-2-expectationsandscale",
        title: "Instruction Expectations and Scaling",
        "short-description":
            '<h4>Expectations</h4><p>This doc is intended to be an easy guide to onboarding data from Splunk, as opposed to comprehensive set of docs. We\'ve specifically chosen only straightforward technologies to implement here (avoiding ones that have lots of complications), but if at any point you feel like you need more traditional documentation for the deployment or usage of Splunk, <a title="Splunk Docs"  href="' +
            window.makeHelpLinkURL(
                "Splunk_Security_Essentials",
                "dataSource.docs",
                "latest"
            ) +
            "\">Splunk Docs</a> has you covered with over 10,000 pages of docs (let alone other languages!).</p><p>Because simpler is almost always better when getting started, we are also not worrying about more complicated capabilities like Search Head Clustering, Indexer Clustering, or anything else of a similar vein. If you do have those requirements, Splunk Docs is a great place to get started, and you can also always avail yourself of Splunk Professional Services so that you don't have to worry about any of the setup.</p><h4>Scaling</h4><p>While Splunk scales to hundreds or thousands of indexers with ease, we usually have some pretty serious architecture conversation before ordering tons of hardware. That said, these docs aren't just for lab installs. We've found that they will work just fine with most customers in the 5 GB to 500 GB range, even some larger! Regardless of whether you have a single Splunk box doing everything, or a distributed install with a Search Head and a set of Indexers, you should be able to get the data and the value flowing quickly.</p><p><b>There's one important note:</b> the first request we get for orchestration as customers scale, is to distribute configurations across many different universal forwarders. Imagine that you've just vetted out the Windows Process Launch Logs guide on a few test systems, and it's working great. Now you want to deploy it to 500, or 50,000 other Windows boxes. Well, there are a variety of ways to do this:<ul><li>The standard Splunk answer is to use the Deployment Server. The deployment server is designed for exactly this task, and is free with Splunk. We aren't going to document it here, mostly because it's extremely well documented by our EDU and also docs.splunk.com, <a title=\"Deployment Server Overview from Splunk Docs\" href=\"" +
            window.makeHelpLinkURL(
                "Splunk_Security_Essentials",
                "dataSource.splunk.updating.aboutDeploymentServer",
                "latest"
            ) +
            "\">here</a>.</li><li>If you are a decent sized organization, you've probably already got a way to deploy configurations and code, like Puppet, Chef, SCCM, Ansible, etc. All of those tools are used to deploy splunk on a regular basis. Now, you might not <b>want</b> to go down this route if it requires onerous change control, or reliance on other teams, etc. -- many large Splunk environments with well developed software deployment systems prefer to use the Deployment Server because it can be owned by Splunk and is optimized for Splunk's needs. But many customers are very happy with using Puppet to distribute Splunk configurations.</li></ul>Ultimately, Splunk configurations are almost all just text files, so you can distribute the configurations with our packaged software, with your own favorite tools, or even by just copying configuration files around.</p>",
        category: ["General Infrastructure"],
    },
    {
        id: "GI-3-indexesAndSourcetypes",
        title: "Indexes and Sourcetypes Overview",
        "short-description":
            '<h4>Overview</h4> <p>The DSOGs talk a lot about indexes and sourcetypes. Here\'s a quick overview. </p> <p><a title="The Splexicon -- a dictionary for Splunk terms" href="' +
            window.makeHelpLinkURL(
                "Splunk_Security_Essentials",
                "dataSource.splexicon",
                "latest"
            ) +
            '">Splexicon</a> (Splunk\'s Lexicon, a glossary of Splunk-specific terms) defines an index as the repository for data in Splunk Enterprise. When Splunk Enterprise indexes raw <a title="Splexicon: Event Data" href="http://docs.splunk.com/Splexicon:Eventdata">event data</a>, it transforms the data into searchable <a title="Splexicon: Event" href="http://docs.splunk.com/Splexicon:Event">events</a>. Indexes are the collections of flat files on the Splunk Enterprise instance. That instance is known as an <a title="Splexicon: Indexer" href="http://docs.splunk.com/Splexicon:Indexer">Indexer</a> because it stores data. Splunk instances that users log into and run searches from are known as <a title="Splexicon: Search Head" href="http://docs.splunk.com/Splexicon:Searchhead">Search Heads</a>. When you have a single instance, it takes on both the search head and indexer roles.</p> <p>"Sourcetype" is defined as a default field that identifies the data structure of an event. A sourcetype determines how Splunk Enterprise formats the data during the indexing process. Example sourcetypes include access_combined and cisco_syslog.</p> <p>In other words, an index is where we store data, and the sourcetype is a label given to similar types of data. All Windows Security Logs will have a sourcetype of WinEventLog:Security, which means you can always search for source=*wineventlog:security (when searching, the word sourcetype is case sensitive, the value is not).</p> <p>Why is this important? We\'re going to guide you to use indexes that our professional services organization recommends to customers as an effective starting point. Using standardized sourcetypes (those shared by other customers) makes it much easier to use Splunk and avoid headaches down the road. Splunk will allow you to use any sourcetype you can imagine, which is great for custom log sources, but for common log sources, life is easier sticking with standard sourcetypes. These docs will walk you through standard sourcetypes. </p> <h4>Implementation</h4> <p>Below is a sample indexes.conf that will prepare you for all of the data sources we use in these docs. You will note that we separate OS logs from Network logs and Security logs from Application logs. The idea here is to separate them for performance reasons, but also for isolation purposes-you may want to expose the application or system logs to people who shouldn\'t view security logs. Putting them in separate indexes prevents that. </p> <p>To install this configuration, you should download the app below and put it in the apps directory. </p> <p>For Windows systems, this will typically be: c:\\Program Files\\Splunk\\etc\\apps. Once you\'ve extracted the app there, you can restart Splunk via the Services Control Panel applet, or by running "c:\\Program Files\\Splunk\\bin\\splunk.exe" restart. </p> <p>For Linux systems, this will typically be /opt/splunk/etc/apps/. Once you\'ve extracted the app there, you can restart Splunk by running /opt/splunk/bin/splunk restart.</p> <p>You can view the indexes.conf below, but it\'s easiest to just click <b>Click here to download a Splunk app with this indexes.conf</b>, below.</p> <p><b>Splunk Cloud Customers</b>: You won\'t copy the files onto your Splunk servers because you don\'t have access. You could go one-by-one through the UI and create all of the indexes below, but it might be easiest if you download the app, and open a ticket with CloudOps to have it installed.</p><pre generatezip="indexes" class="codeSample"># Overview. Below you will find the basic indexes.conf settings for\n# setting up your indexes in Splunk. We separate into different indexes \n# to allow for performance (in some cases) or data isolation in others. \n# All indexes come preconfigured with a relatively short retention period \n# that should work for everyone, but if you have more disk space, we \n# encourage (and usually see) longer retention periods, particularly \n# for security customers.\n\n# Endpoint Indexes used for Splunk Security Essentials. \n# If you have the sources, other standard indexes we recommend include:\n# epproxy - Local Proxy Activity\n\n[epav]\ncoldPath = $SPLUNK_DB/epav/colddb\nhomePath = $SPLUNK_DB/epav/db\nthawedPath = $SPLUNK_DB/epav/thaweddb\nfrozenTimePeriodInSecs = 2592000\n#30 days\n\n[epfw]\ncoldPath = $SPLUNK_DB/epnet/colddb\nhomePath = $SPLUNK_DB/epnet/db\nthawedPath = $SPLUNK_DB/epnet/thaweddb\nfrozenTimePeriodInSecs = 2592000\n#30 days\n\n[ephids]\ncoldPath = $SPLUNK_DB/epmon/colddb\nhomePath = $SPLUNK_DB/epmon/db\nthawedPath = $SPLUNK_DB/epmon/thaweddb\nfrozenTimePeriodInSecs = 2592000\n#30 days\n\n[epintel]\ncoldPath = $SPLUNK_DB/epweb/colddb\nhomePath = $SPLUNK_DB/epweb/db\nthawedPath = $SPLUNK_DB/epweb/thaweddb\nfrozenTimePeriodInSecs = 2592000\n#30 days\n\n[oswin]\ncoldPath = $SPLUNK_DB/oswin/colddb\nhomePath = $SPLUNK_DB/oswin/db\nthawedPath = $SPLUNK_DB/oswin/thaweddb\nfrozenTimePeriodInSecs = 2592000\n#30 days\n\n[oswinsec]\ncoldPath = $SPLUNK_DB/oswinsec/colddb\nhomePath = $SPLUNK_DB/oswinsec/db\nthawedPath = $SPLUNK_DB/oswinsec/thaweddb\nfrozenTimePeriodInSecs = 2592000\n#30 days\n\n[oswinscript]\ncoldPath = $SPLUNK_DB/oswinscript/colddb\nhomePath = $SPLUNK_DB/oswinscript/db\nthawedPath = $SPLUNK_DB/oswinscript/thaweddb\nfrozenTimePeriodInSecs = 2592000\n#30 days\n\n[oswinperf]\ncoldPath = $SPLUNK_DB/oswinperf/colddb\nhomePath = $SPLUNK_DB/oswinperf/db\nthawedPath = $SPLUNK_DB/oswinperf/thaweddb\nfrozenTimePeriodInSecs = 604800 \n#7 days\n\n[osnix]\ncoldPath = $SPLUNK_DB/osnix/colddb\nhomePath = $SPLUNK_DB/osnix/db\nthawedPath = $SPLUNK_DB/osnix/thaweddb\nfrozenTimePeriodInSecs = 2592000\n#30 days\n\n[osnixsec]\ncoldPath = $SPLUNK_DB/osnixsec/colddb\nhomePath = $SPLUNK_DB/osnixsec/db\nthawedPath = $SPLUNK_DB/osnixsec/thaweddb\nfrozenTimePeriodInSecs = 2592000\n#30 days\n\n[osnixscript]\ncoldPath = $SPLUNK_DB/osnixscript/colddb\nhomePath = $SPLUNK_DB/osnixscript/db\nthawedPath = $SPLUNK_DB/osnixscript/thaweddb\nfrozenTimePeriodInSecs = 2592000\n#30 days\n\n[osnixperf]\ncoldPath = $SPLUNK_DB/osnixperf/colddb\nhomePath = $SPLUNK_DB/osnixperf/db\nthawedPath = $SPLUNK_DB/osnixperf/thaweddb\nfrozenTimePeriodInSecs = 604800 \n#7 days\n\n# Network Indexes used for Splunk Security Essentials\n# If you have the sources, other standard indexes we recommend include:\n# netauth - for network authentication sources\n# netflow - for netflow data\n# netids - for dedicated IPS environments\n# netipam - for IPAM systems\n# netnlb - for non-web server load balancer data (e.g., DNS, SMTP, SIP, etc.)\n# netops - for general network system data (such as Cisco iOS non-netflow logs)\n# netvuln - for Network Vulnerability Data\n\n[netdns]\ncoldPath = $SPLUNK_DB/netdns/colddb\nhomePath = $SPLUNK_DB/netdns/db\nthawedPath = $SPLUNK_DB/netdns/thaweddb\nfrozenTimePeriodInSecs = 2592000\n#30 days\n\n[mail]\ncoldPath = $SPLUNK_DB/mail/colddb\nhomePath = $SPLUNK_DB/mail/db\nthawedPath = $SPLUNK_DB/mail/thaweddb\nfrozenTimePeriodInSecs = 2592000\n#30 days\n\n[netfw]\ncoldPath = $SPLUNK_DB/netfw/colddb\nhomePath = $SPLUNK_DB/netfw/db\nthawedPath = $SPLUNK_DB/netfw/thaweddb\nfrozenTimePeriodInSecs = 2592000\n#30 days\n\n[netops]\ncoldPath = $SPLUNK_DB/netops/colddb\nhomePath = $SPLUNK_DB/netops/db\nthawedPath = $SPLUNK_DB/netops/thaweddb\nfrozenTimePeriodInSecs = 2592000\n#30 days\n\n[netproxy]\ncoldPath = $SPLUNK_DB/netproxy/colddb\nhomePath = $SPLUNK_DB/netproxy/db\nthawedPath = $SPLUNK_DB/netproxy/thaweddb\nfrozenTimePeriodInSecs = 2592000\n#30 days\n\n[netvpn]\ncoldPath = $SPLUNK_DB/netvpn/colddb\nhomePath = $SPLUNK_DB/netvpn/db\nthawedPath = $SPLUNK_DB/netvpn/thaweddb\nfrozenTimePeriodInSecs = 2592000\n#30 days\n\n\n# Splunk Security Essentials doesn\'t have examples of Application Security, \n# but if you want to ingest those logs, here are the recommended indexes:\n# appwebint - Internal WebApp Access Logs\n# appwebext - External WebApp Access Logs\n# appwebintrp - Internal-facing Web App Load Balancers\n# appwebextrp - External-facing Web App Load Balancers\n# appwebcdn - CDN logs for your website\n# appdbserver - Database Servers\n# appmsgserver - Messaging Servers\n# appint - App Servers for internal-facing apps \n# appext - App Servers for external-facing apps </pre> <h4>Validation</h4> <p>Once this is complete, you will be able to find the list of indexes that the system is aware of by logging into Splunk, and going into Settings -&gt; Indexes.</p> ',
        category: ["General Infrastructure"],
    },
    {
        id: "GI-4-forwarderOnWindows",
        title: "Forwarder on Windows Systems",
        "short-description":
            '<h4>Overview</h4>\nInstalling the Windows forwarder is a straightforward process, similar to installing any Windows program. These instructions will walk you through a manual instruction for getting started (perfect for a lab, a few laptops, or when you\'re just getting started on domain controllers). \n<h4>Implementation</h4>\n<p>Note for larger environments: When you want to automatically roll out the forwarder to hundreds (or thousands or hundreds of thousands) of systems, you will want to leverage your traditional software-deployment techniques. The Splunk forwarder is an MSI package and we have docs on recommended ways to deploy it:</p>\n<ul><li>Via a logon script that runs a silent CLI installation: <a title="Splunk Docs: Install Forwarder via CLI" href="' +
            window.makeHelpLinkURL(
                "Splunk_Security_Essentials",
                "dataSource.forwarder.installAWindowsUniversalForwarderFromTheCommandLine",
                "latest"
            ) +
            '">http://docs.splunk.com/Documentation/Forwarder/7.0.1/Forwarder/InstallaWindowsuniversalforwarderfromthecommandline</a></li>\n<li>With a static configuration via CLI: <a title="Splunk Docs: Install Splunk Forwarder Remotely with a Static Configuration" href="' +
            window.makeHelpLinkURL(
                "Splunk_Security_Essentials",
                "dataSource.forwarder.installAWindowsUniversalForwarderRemotellyWithAStaticConfiguration",
                "latest"
            ) +
            '">http://docs.splunk.com/Documentation/Forwarder/7.0.1/Forwarder/InstallaWindowsuniversalforwarderremotelywithastaticconfiguration</a></li> \n<li>How to bake it into your gold image: <a title="Splunk Docs: Incorporate Forwarder into your System Images" href="' +
            window.makeHelpLinkURL(
                "Splunk_Security_Essentials",
                "dataSource.forwarder.makeAUniversalForwarderPartOfAHostImage",
                "latest"
            ) +
            '">http://docs.splunk.com/Documentation/Forwarder/7.0.1/Forwarder/Makeauniversalforwarderpartofahostimage</a></li>\n</ul> \n<p>Of course, you can also deploy it with traditional system-configuration management software. This can vary a lot from environment to environment. For this doc we\'ll just walk you through the installation so that you know what\'s coming.</p>\n<p>The first thing to do is download the Universal Forwarder from Splunk\'s website (<a title="Download Universal Forwarder" href="https://www.splunk.com/en_us/download/universal-forwarder.html">https://www.splunk.com/en_us/download/universal-forwarder.html</a>). This is a separate download from the main Splunk installer, as the universal forwarder is lightweight, so it can be installed on all of the systems in your environment. Most users today will download the x64 version as an MSI installer.</p>\n<p>When you double click the downloaded file, the standard MSI installer will appear.</p><img src="%SSEDOCIMAGEPATH%/winta/winta-1-maininstallscreen.png" title="The initial installer screen for the Splunk Forwarder. Click Next to continue, don\'t worry about customizing the options. You can also install the package silently." />\n<p>Don\'t worry about the Cloud checkbox -- we will use the same settings for both.</p>\n<p>While you can click "Customize Settings" here and manually insert the address of your indexers or manually choose the log sources you would like to index, etc., we generally don\'t recommend that, unless you\'re never going to move beyond the one source you\'re looking at. (Harder to go find those settings and then apply them to other systems.) Ignore "Customize Options" and click on "Next."\nThe setup will now go through its process, and you\'ll be finished with a freshly installed forwarder. There are three more steps you\'ll want to take before you can see the data in Splunk:</p>\n<ul><li>You will need an outputs.conf to tell the forwarder where to send data (next section)</li>\n<li>You will need an inputs.conf to tell the forwarder what data to send (below, in the Splunk Configuration for Data Source)</li>\n<li>You will need an indexes.conf on the indexers to tell them where to put the data that is received (Previous section)</li></ul>\n<h4>Validation</h4>\n<p>You can now check Task Manager and you should see Splunk running. Alternatively, check under Services in the Control Panel. You will see Splunk listed and started.</p>\n\n\n',
        category: ["General Infrastructure"],
    },
    {
        id: "GI-5-outputsconf",
        title: "Sending Data from Forwarders to Indexers",
        "short-description":
            '<h4>Overview</h4>\n<p>For any Splunk system in the environment, whether it\'s a Universal Forwarder on a Windows host, a Linux Heavy-Weight Forwarder pulling the more difficult AWS logs, or even a dedicated Search Head that dispatches searches to your indexers, every system in the environment that is not an indexers (i.e., any system that doesn\'t store its data locally) should have an outputs.conf that points to your indexers. </p>\n<h4>Implementation</h4>\n<p>Fortunately the outputs.conf will be the same across the entire environment, and is fairly simple. There are three steps:</p>\n<ol><li>Create the app using the button below (SplunkCloud customers: use the app you received from SplunkCloud).</li>\n<li>Extract the file (it will download a zip file).</li>\n<li>Place in the etc/apps directory.</li>\n</ol>\n\n<p>For Windows systems, this will typically be: c:\\Program Files\\Splunk\\etc\\apps. Once you\'ve extracted the app there, you can restart Splunk via the Services Control Panel applet, or by running "c:\\Program Files\\Splunk\\bin\\splunk.exe" restart.</p>\n\n<p>For Linux systems, this will typically be /opt/splunkforwarder/etc/apps/. Once you\'ve extracted the app there, you can restart Splunk by running /opt/splunk/bin/splunk restart.</p>\n\n<p>For customers not using SplunkCloud:<pre generatezip="outputs" class="codeSample">\n[tcpout]\ndefaultGroup = default-autolb-group\n\n[tcpout:default-autolb-group]\nserver = MySplunkServer.mycompany.local:9997\n\n[tcpout-server://MySplunkServer.mycompany.local:9997]</pre></p>\n<img src="%SSEDOCIMAGEPATH%/winta/winta-3-outputsfolder.png" title="Here is the completed folder." />\n\n<h4>Validation</h4>\n<p>Run a search in the Splunk environment for the host you\'ve installed the forwarder on. E.g., index=* host=mywinsystem1*</p>\n<p>You can also review all hosts that are sending data from via | metadata index=* type=hosts</p>\n\n',
        category: ["General Infrastructure"],
    },
    {
        id: "SC-WinSecurity-1-SizingEstimate",
        title: "Sizing Estimate",
        "short-description":
            '<p>Windows event volume can vary greatly based on the type of host. At a very high level, common ranges we’ve seen are:</p>\n<ul><li>Workstation: 4-6 MB/day (Including Application, System, and Security Logs)</li>\n<li>Application Servers: 25-50 MB/day</li>\n<li>Domain Controllers: 50-500 MB/day depending on the number of users</li>\n</ul>\n<p>Obviously, these ranges can vary dramatically. For high horsepower AD controllers with thousands of simultaneous users, you could see more volume.</p>\n<p>A common follow-on question we often get is what the expected volume is just for the Process Launch Logs (Event ID 4688) – this can vary based on how many new processes spin up, of course, but it is usually a rounding error on event volume. It’s often said that Event ID 4688 is the best bang for the buck in all of security logging!</p><p>The last question we get when having these discussions is: "what first?" If you have a formal risk assessment process, it\'s always best to there, but generally speaking we see most customers start with Domain Controllers as they have the most sensitive information, move on to member servers, and reach the desktops last.</p>',
        category: ["Splunk Configuration for Data Source"],
    },
    {
        id: "SC-WinSecurity-2-InstallTA",
        title: "Install the Technology Add-On -- TA",
        "short-description":
            '<h4>Overview</h4>\n<p>Splunk has a detailed Technology Add-on that supports ingesting all manner of Windows logs. Like all Splunk Technology Add-ons, it also includes everything needed in order to parse out the fields, and give them names that are compliant with Splunk’s Common Information Model, so they can easily be used by the searches in Splunk Security Essentials, along with searches you will find in other community supported and premium apps. </p>\n<h4>Implementation</h4>\n<p>Find the TA along with all your other Splunk apps / needs on SplunkBase. You could go to <a title="Splunkbase" href="https://splunkbase.splunk.com/">https://splunkbase.splunk.com/</a> and search for it, or you could just follow the direct link here: <a title="Splunkbase: Download Windows Add-on" href="https://splunkbase.splunk.com/app/742/">https://splunkbase.splunk.com/app/742/</a>.</p>\n\n<p>As with all Splunk TAs, we recommend you deploy it to all parts of your Splunk environment for simplicity and uniformity, so plan to install the TA on your Search Head, Indexers, and any Windows Forwarders in your environment. <ol><li>To install the app, start by downloading the file from the SplunkBase just shown, and then extract it. Note: The app itself is a tgz file, or a gzipped tarball. If you’re a pure Windows environment, this means that you will need a third party program to extract it – fortunately tgz is the most common format in the world behind zip, so virtually any extraction program you have (WinZip, 7z, WinRAR, etc.) will all extract it.</li><li>Once you have the extracted folder, move it into %SPLUNK_HOME%/etc/apps/ folder. For most modern Splunk environments, that will be C:\\Program Files\\SplunkUniversalForwarder\\etc\\apps.<img src="%SSEDOCIMAGEPATH%/winta/winta-6-wintafolder.png" title="Here is the Windows TA extracted into the proper location (note the path) on a Windows Universal Forwarder." /></li><li>Once you’ve extracted the app, you can restart Splunk via the Services Control Panel applet, or by just running "c:\\Program Files\\SplunkUniversalForwarder\\bin\\splunk.exe" restart.</li></ol>\n\n<h4>Validation</h4>\n<p>You can make sure that Splunk has picked up the presence of the app by running: "c:\\Program Files\\SplunkUniversalForwarder\\bin\\splunk.exe" display app, which after asking you to log in, will provide you with a list of installed apps. Usually though if you see the folder listed alongside the other apps (learned, search, splunk_httpinput, etc.) you will know that it’s there successfully. </p><p><b>Splunk Cloud Customers</b>: you won\'t be copying any files or folders to your indexers or search heads, but good news! The Splunk Add-on for Microsoft Windows is Cloud Self-Service Enabled. So you can just got to Find Apps, and be up and running in seconds.</p>\n\n\n',
        category: ["Splunk Configuration for Data Source"],
    },
    {
        id: "SC-WinSecurity-3-IndexesAndSourcetypes",
        title: "General Windows Indexes and Sourcetypes",
        "short-description":
            '<h4>Overview</h4>\n<p>Amongst Splunk’s 15000+ customers, we’ve done a lot of implementations, and we’ve learned a few things along the way. While you can use any sourcetypes or indexes that you want in the land of Splunk, we’ve found that the most successful customers follow specific patterns, as it sets them up for success moving forward.<p>\n<h4>Implementation</h4>\n<p>The most common Windows data types are the Security Log, System Log, and Application Log, but there are a few others as well including Microsoft Sysmon. Here are our most commonly used Windows Data Types and the recommended indexes and sourcetypes.<p>\n<table class="table"><tr><td>Data Type</td><td>Input (inputs.conf, below)</td><td>Source</td><td>Index</td><td>Notes</td></tr>\n<tr><td>Windows Security Logs</td><td>WinEventLog://Security</td><td>wineventlog:security</td><td>oswinsec</td><td>We leverage a blacklist for common “noise” events, below.</td></tr>\n<tr><td>Windows Application Logs</td><td>WinEventLog://Application</td><td>wineventlog:application</td><td>oswin</td><td> </td></tr>\n<tr><td>Windows System Logs</td><td>WinEventLog://System</td><td>wineventlog:system</td><td>oswin</td><td> </td></tr>\n<tr><td>Windows Update Log</td><td>monitor://$WINDIR\\WindowsUpdate.log</td><td>WindowsUpdateLog</td><td>oswinsec</td><td> </td></tr>\n<tr><td>Microsoft Sysmon Logs</td><td>WinEventLog://Microsoft-Windows-Sysmon/Operational</td><td>XmlWinEventLog:Microsoft-Windows-Sysmon/Operational</td><td>epintel</td><td>Based on the sysmon sysinternals tool, not out of the box.</td></tr>\n</table>\n<p>If you have already started ingesting the data sources into another index, then you can usually proceed (though consider if you should separate Windows Security logs from Process Launch Logs and both from Application and System logs, based on who likely will need access or be prohibited access). If you have already started ingesting data with a different sourcetype, we would recommend you switch over to the standardized sourcetypes if at all possible. If you\'re not using the Splunk TA for Windows to ingest data, then keep in mind you may need to go through extra work to align field names to get value out of Splunk Security Essentials, and other Splunk content.</p>\n<p>To support your Windows sources, follow the procedure mentioned above in <a href="#General_Infrastructure_References">General Infrastructure - Indexes and Sourcetypes</a> to add the new indexes for the data you will be bringing in (generally it’s easiest if you just create oswin, oswinsec, epintel). <p>\n<p>For the sourcetypes and monitor statements, we will show those next in the Configuration Files.\n',
        category: ["Splunk Configuration for Data Source"],
    },
    {
        id: "SC-WinSecurity-4-inputsconf",
        title: "Configuration Files",
        "short-description":
            '<h4>Overview</h4>\n<p>Configuration files for Windows inputs tends to be pretty simple. In this case, we just have a single inputs.conf file that will go on the Windows Hosts you will be monitoring. As detailed above in <a href="#Instruction_Expectations_and_Scaling">Instruction Expectations and Scaling</a>, you will need some mechanism to distribute these files to the hosts you’re monitoring. For initial tests, or deployments to just your most sensitive systems, it is easy to copy the files to the hosts. For larger distributions, you can use the Splunk Deployment Server, or use another code distribution system such as SCCM, Puppet, Chef, Ansible, or others. </p>\n<h4>Implementation</h4>\n<p>Distribute the below inputs.conf file to all of the hosts that you will be monitoring in the %SPLUNK_HOME%/etc/apps/Splunk_TA_windows/local folder. If the folder doesn’t exist, you will need to create it. For most customers, the path to this file will end up being: C:/Program Files/SplunkUniversalForwarder/etc/apps/Splunk_TA_windows/local/inputs.conf.<img src="%SSEDOCIMAGEPATH%/winta/winta-7-localfolderwinta.png" title="We created a new folder called local inside of the Windows TA folder." /><img src="%SSEDOCIMAGEPATH%/winta/winta-8-inputsconf.png" title="Inside of the local folder, we moved over the inputs.conf file shown (and downloaded from) below." /></p>\n<pre filename="inputs.conf" class="codeSample">\n[WinEventLog://Security]\ndisabled = 0\nevt_resolve_ad_obj = 1\ncheckpointInterval = 5\nblacklist1 = EventCode="4662" Message="Object Type:\\s+(?!groupPolicyContainer)"\nblacklist2 = EventCode="566" Message="Object Type:\\s+(?!groupPolicyContainer)"\nblacklist3 = EventCode="4688" Message="New Process Name: (?i)(?:[C-F]:\\Program Files\\Splunk(?:UniversalForwarder)?\\bin\\(?:btool|splunkd|splunk|splunk-(?:MonitorNoHandle|admon|netmon|perfmon|powershell|regmon|winevtlog|winhostinfo|winprintmon|wmi)).exe)"\nindex = oswinsec\n\n[WinEventLog://Application]\ndisabled = 0\ncheckpointInterval = 5\nindex = oswin\n\n[WinEventLog://System]\ndisabled = 0\ncheckpointInterval = 5\nindex = oswin\n\n[monitor://$WINDIR\\WindowsUpdate.log]\ndisabled = 0\nsourcetype = WindowsUpdateLog\nindex = oswinsec\n\n[WinHostMon://Service]\ninterval = 3600\ndisabled = 0\ntype = Service\nindex = oswinscript\n</pre>\n',
        category: ["Splunk Configuration for Data Source"],
    },
    {
        id: "VC-WinSecurity-1-EnablingLog",
        title: "Enabling Windows Security Log",
        "short-description":
            '<h4>Overview</h4>\n<p>To maintain a good Security Posture, and to leverage the examples provided in Splunk Security Essentials, we recommend following Microsoft’s official guidance for “Stronger” security visibility. The Audit Policy Recommendations page from Microsoft TechNet provides very detailed configuration settings per operating system from Windows 7 / Server 2008 and up here: <a title="Microsoft Docs - Audit Policy Recommendations" href="https://docs.microsoft.com/en-us/windows-server/identity/ad-ds/plan/security-best-practices/audit-policy-recommendations">https://docs.microsoft.com/en-us/windows-server/identity/ad-ds/plan/security-best-practices/audit-policy-recommendations</a>\n\n<h4>Implementation</h4>\n\n<p><b>Important Note:</b> Splunk is a monitoring product, and not an Active Directory system, so while we’re working hard to centralize some of the recommendations you should follow in one place to make your life easy, we cannot offer support for the actual configuration of anything other than Splunk itself, and strongly recommend that you leverage trained Microsoft resources when making any changes. That’s in large part why we’re pointing you to Microsoft docs for the nitty gritty details!</p>\n\n<p>If you are new to configuring auditing on Microsoft systems, there are two primary ways in which you can go about configuring auditing: a one-off (typically lab) system via the Local Security Policy, or a managed system via Group Policy. Virtually all Splunk customers will configure their Windows audit logging via Group Policy, but you absolutely can use Local Security Policy if you only have a small number of machines, or you are trialing on a few systems.</p>\n\n<p>If you do want to configure via Local Security Policy, you can click Start (or highlight Cortana Search) and then type in “Local Security Policy” to open the policy editor. Finding the right configuration settings is straightforward, just expand “System Audit Policies – Local Group Policy” at the bottom of the list, and then the next item with the same name. If you compare these items to the link above (also included under “References”), you will find that they map directly and you can proceed to mirror what Microsoft recommends – use the Stronger column for adequate security visibility. </p>\n\n<p>To configure via Group Policy, you should open the Group Policy Editor for a group policy that covers any computer accounts that are in scope for monitoring. Most medium to large organizations that we work have a separate admin or group for configuring these types of Group Policy Settings, so it’s usually easiest to send the quoted paragraph below over to that group to apply the settings. </p>\n\n<p>If you do manage Group Policy as well, here’s how you can make the changes on your own – note that Microsoft has different recommendations for servers versus workstations, so if possible it’s best to apply separate policies to each (when in doubt, we usually opt for more visibility):<ol>\n<li>Open the Group Policy Manager by opening the Microsoft Management Console (mmc.exe)<img src="%SSEDOCIMAGEPATH%/winsecurity/winsec-1-openmmc.png" title="Opening the Microsoft Management Console on a Windows 10 system." /></li><li>Add the Group Policy Management snap-in (File -> Add)<img src="%SSEDOCIMAGEPATH%/winsecurity/winsec-2-addsnapin.png" title="Add the Snap-in for Group Policy Management" /></li>\n<li>Choose or create a policy that is applied to your in-scope systems, and right-click to Edit the policy.<img src="%SSEDOCIMAGEPATH%/winsecurity/winsec-3-gpmc.png" title="Choosing a policy that applies to your in scope systems. Generally you should apply to all systems, but for this lab environment we are applying only to Domain Controllers" /><img src="%SSEDOCIMAGEPATH%/winsecurity/winsec-4-editgpo.png" title="Right clicking on the group policy object allows us to edit it." /></li>\n<li>Find the policy settings that match the Microsoft Document under: Computer Configuration -> Policies -> Windows Settings -> Security Settings -> Advanced Audit Policy Configuration -> Audit Policy<img src="%SSEDOCIMAGEPATH%/winsecurity/winsec-5-pathtosecuritylog.png" title="Here you can see the path to the Advanced Audit Policy Configuration settings." /></li>\n<li>Go through the Microsoft Doc to implement their recommendations for the stronger audit policy.</li>\n<li>You might have noticed a warning about one other key that you need to have set in order for these audit policies to take effect – don’t worry, it’s been default to on since Vista, but you might as well configure it as well, under Configuration -> Policies -> Windows Settings -> Security Settings -> Local Settings -> Audit: Force audit policy subcategory setting (Windows Vista and later) to override Audit Policy Category Settings</li>\n</ol>\nSettings take effect as soon as the systems refresh their global policy, which is usually within 15-60 minutes depending on your environment.</p>\n\n<p>If you can’t (or don’t want to) run through the above on your own, here’s a paragraph you can just send to whoever in your organization manages Active Directory.</p> \n<div style="border: solid gray 1px; background-color: #F0F0F0; margin-left: 25px;"><p>To conform to the Microsoft recommendations for strong security auditing, we would like to have the following changes made to Group Policy objects that cover our servers and our workstations. Microsoft has made separate recommendations for workstation configurations, and for server configurations. The settings are:</p><ol>\n<li>Turn on the Advanced Audit Policy (defaults to enabled) at:\nConfiguration -> Policies -> Windows Settings -> Security Settings -> Local Settings -> Audit: Force audit policy subcategory setting (Windows Vista and later) to override Audit Policy Category Settings</li>\n<li>Find the Advanced Audit Policy Configuration at:\nComputer Configuration -> Policies -> Windows Settings -> Security Settings -> Advanced Audit Policy Configuration -> Audit Policy</li>\n<li>Walk through the Microsoft “Stronger” column to apply the settings: <a title="Microsoft Docs - Audit Policy Recommendations" href="https://docs.microsoft.com/en-us/windows-server/identity/ad-ds/plan/security-best-practices/audit-policy-recommendations">https://docs.microsoft.com/en-us/windows-server/identity/ad-ds/plan/security-best-practices/audit-policy-recommendations</a></li></ol>\n<p>Thank you for your help!</p></div>\n\n<h4>Validation</h4>\n<p>Usually the first thing people will see when deploying audit policies is either new systems showing up in Splunk, or at least an increase in system log messages. If you already have some logs coming in and want to validate that you’re getting the new ones, look for the delta between your old policy and your new one, and google “Windows <setting> Event ID” – that will usually give you something specific to search for (though you may have to go take the action that gets logged, if it’s less common). An easy example is “Windows Process Creation Event ID” which quickly nets you “Event ID 4688” as the first result. </p>',
        category: ["Windows Configuration"],
    },
    {
        id: "VC-WinSecurity-2-turnon4688",
        title: "Turning On Process Launch Logs, Event 4688",
        "short-description":
            "<h4>Overview</h4>\n<p>Fortunately, if you followed through the steps above, you already have Process Logging turned on! If you already had an audit policy configured and skipped the above, give it another read through – we recommend that people follow the official Microsoft Recommendation for a “Stronger” audit policy which turns on many things that would likely be valuable to you, without being too much. </p>\n\n<h4>Implementation</h4>\n<p><b>Important Note:</b> Splunk is a monitoring product, and not an Active Directory system, so while we’re working hard to centralize some of the recommendations you should follow in one place to make your life easy, we cannot offer support for the actual configuration of anything other than Splunk itself, and strongly recommend that you leverage trained Microsoft resources when making any changes. That’s in large part why we’re pointing you to Microsoft docs for the nitty gritty details!</p>\n\n<p>If you are persistent and want to go your own road though, we are happy to point you in the right path. You will use the same Local Security Policy or Group Policy configuration that is referenced above, but there are two different places where you might configure this setting. </p>\n<p>If you are using the older Windows Audit Policies defined at the category level, you can turn Process Logging in either of the following locations:</p>\n<ul>\n<li>Local Security Policy: Local Policies -> Audit Policy -> Audit Process Tracking (Success Only)</li>\n<li>Group Policy: Computer Configuration -> Policies -> Windows Settings -> Security Settings -> Local Policies -> Audit Policy -> Audit Process Tracking (Success Only)</li>\n</ul>\n<p>Settings take effect as soon as the systems refresh their global policy, which is usually within 15-60 minutes depending on your environment.</p>\n<p>If you are using the newer Advanced Audit Policies defined at the subcategory level, you can turn on Process Logging in either of the following locations:</p>\n<ul><li>Local Security Policy: System Audit Policies – Local Group Policy -> System Audit Policies – Local Group Policy -> Detailed Tracking -> Audit Process Creation (Success and Failure)</li>\n<li>Group Policy: Computer Configuration -> Policies -> Windows Settings -> Security Settings -> Advanced Audit Policy Configuration -> Audit Policy -> Detailed Tracking -> Audit Process Creation (Success and Failure)</li>\n</ul>\n<h4>Validation</h4>\n<p>Validation for this step is simple. Open a program, such as Outlook and then search for the filename in Splunk: outlook.exe.</p>",
        category: ["Windows Configuration"],
    },
    {
        id: "VC-WinSecurity-3-CommandLineAuditing",
        title: "(Optional) Turn on Command Line Auditing - Part One",
        "short-description":
            '<h4>Overview</h4>\n<p>So far we’ve turned on Process Launch logging, which will tell you what processes a user has run. This is a great start, and provides fantastic visibility! You’ll now know every time that a user launches a PDF Reader, or some other software that could be exploited, and you’ll know about suspicious process launches that could be malware! </p>\n<p>But how great would it be if you could not only know that a PDF Reader was launched, but know what file it actually opened? (You’d probably respond differently to something in the Outlook temp directory versus something on a corporate file share, right?) And what if rather than just knowing that cmd.exe was launched, you could actually know what commands were passed to it? Fortunately Command Line Auditing gets us all that information, with almost no extra log volume.</p>\n<h4>Implementation</h4>\n<p>Things get a bit more complicated here, and vary based on what version of Windows is used in your environment, but it’s not too bad. You’ll start by wanting to apply one more group policy setting (or Registry Key, for those on individual machines):</p>\n<ul><li>Computer Configurations -> Policies -> Administrative Templates -> System -> Audit Process Configuration -> Include command line in process creation events <img src="%SSEDOCIMAGEPATH%/winsecurity/winsec-6-pathtoauditcli.png" title="Path to the Audit CLI GPO setting." /></li></ul>\n<p>Here is the Microsoft Doc so you’ll know we’re not making this up: <a title="Windows KB to Improve Auditing" href="https://support.microsoft.com/en-us/help/3004375/microsoft-security-advisory-update-to-improve-windows-command-line-aud">https://support.microsoft.com/en-us/help/3004375/microsoft-security-advisory-update-to-improve-windows-command-line-aud</a> </p>\n<p>If you are on an individual machine, there is a registry key that makes the same change:</p>\n<ol><li>Go under: HKEY_LOCAL_MACHIN\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\policies\\system\\Audit </li>\n<li>Create a new REG_DWORD called ProcessCreationIncludeCmdLine_Enabled</li>\n<li>Set the value to 1</li>\n</ol>\n<p>It’s mostly documented in Digital Forensics and Windows Logging Cheatsheet sites, though you can find it here at Microsoft’s Azure Security site: <a title="Azure Security Center" href="https://docs.microsoft.com/sl-si/azure/security-center/security-center-alert-validation">https://docs.microsoft.com/sl-si/azure/security-center/security-center-alert-validation</a></p>\n<h4>Verification</h4>\n<p>Verification here is also very simple. Search through your Splunk logs for source=*WinEventLog:Security EventCode=4688 and look for the CLI parameters.</p>\n\n',
        category: ["Windows Configuration"],
    },
    {
        id: "VC-WinSecurity-4-MaybePatch",
        title: "(Optional) Turn on Command Line Auditing - Part Two",
        "short-description":
            '<p>There’s one final step that you will need to take if you have machines that are older than Windows 10 / Server 2016 (you probably do, right?).</p>\n<p>The same KB Article we linked to above is tied to a patch, that needs to be applied to your systems in order to get the command line auditing. This patch came out in Feb 10, 2015, and was bundled in a critical Security update, so it is likely already installed in your environment. However, if it is not there, then you may need to distribute this patch via your normal Microsoft Software Update approaches.</p>\n<p>Here are the full details: <a title="Windows KB to Enable CLI Auditing"  href="https://support.microsoft.com/en-us/help/3004375/microsoft-security-advisory-update-to-improve-windows-command-line-aud">https://support.microsoft.com/en-us/help/3004375/microsoft-security-advisory-update-to-improve-windows-command-line-aud</a></p>',
        category: ["Windows Configuration"],
    },
    {
        id: "VC-WinSecurity-5-References",
        title: "References",
        "short-description":
            '<ul><li>Overall Microsoft Recommendation for Windows Auditing Configuration. Splunk recommends following the “Stronger Recommendation” for necessary visibility: <a title="Microsoft Audit Policy Recommendation"  href="https://technet.microsoft.com/en-us/windows-server-docs/identity/ad-ds/plan/security-best-practices/audit-policy-recommendations">https://technet.microsoft.com/en-us/windows-server-docs/identity/ad-ds/plan/security-best-practices/audit-policy-recommendations</a></li>\n<li>GPO Setting for turning on Process Command Line: <a title="Windows KB to Enable CLI Auditing" ref="https://docs.microsoft.com/en-us/windows-server/identity/ad-ds/manage/component-updates/command-line-process-auditing">https://docs.microsoft.com/en-us/windows-server/identity/ad-ds/manage/component-updates/command-line-process-auditing</a> </li>\n<li>KB3004375, detailing the Process Command Line: <a title="Windows KB3004375 to enable CLI Auditing" href="https://support.microsoft.com/en-us/help/3004375/microsoft-security-advisory-update-to-improve-windows-command-line-aud">https://support.microsoft.com/en-us/help/3004375/microsoft-security-advisory-update-to-improve-windows-command-line-aud</a></li>\n<li>Microsoft Recommendations around Event Log Size (300 MB Maximum): <a title="Microsoft Recommendation around Event Log Size" href="https://technet.microsoft.com/en-us/library/cc778402(v=ws.10).aspx">https://technet.microsoft.com/en-us/library/cc778402(v=ws.10).aspx</a></li>\n<li>Azure Security Center showing the registry key to turn on Process Command Line: <a title="Microsoft Azure Security Center Configuration Page for Process Command Line via Registry Key" href="https://docs.microsoft.com/sl-si/azure/security-center/security-center-alert-validation">https://docs.microsoft.com/sl-si/azure/security-center/security-center-alert-validation</a></li></ul>\n',
        category: ["Windows Configuration"],
    },
    {
        id: "GI-4-forwarderOnLinux",
        title: "Forwarder on Linux Systems",
        "short-description":
            '  <h4>Overview</h4>\n<p>Installing the Windows forwarder is a straightforward process, similar to installing any Linux program. These instructions will walk you through a manual instruction for getting started (perfect for a lab, a few laptops, or when you\'re just getting started on domain controllers). You will have three options for how to proceed -- using an RPM package (easiest for any Red Hat or similar system with rpm), using a DEB package (easiest for any Ubuntu or similiar system with dpkg), or using just the compressed .tgz file (will work across Linux platforms).</p>\n<p><strong>Note: </strong>For full and latest information on installing a forwarder, please follow the instructions in the Linux installation manual: <br>\n <a title="Splunk Docs: Install Forwarder on Linux" href="' +
            window.makeHelpLinkURL(
                "Splunk_Security_Essentials",
                "dataSource.forwarder.latest.installAnixUniversalForwarder",
                "latest"
            ) +
            '">http://docs.splunk.com/Documentation/Forwarder/latest/Forwarder/Installanixuniversalforwarder</a></p>\n <h4>Implementation</h4>\n    <strong>Prerequisites </strong>\n <ol><li>You will need to have elevated permissions to install the software and configure correctly</li>\n </ol>\n \n<strong>Installation using an RPM file:</strong> \n<p>Make sure you have downloaded the universal forwarder package from Splunk&rsquo;s website: <a title="Download the Universal Forwarder" href="https://www.splunk.com/en_us/download/universal-forwarder.html">https://www.splunk.com/en_us/download/universal-forwarder.html</a> and have it on the system you want to install Splunk on.</p>\n<p>Run: rpm -i&nbsp;splunkforwarder&lt;version&gt;.rpm</p>\n<p>This will install the Splunk forwarder into the default directory of /opt/splunkforwarder</p>\n<p>To enable Splunk to run each time your server is restarted use the following command:<br/>\n&nbsp;&nbsp;&nbsp;&nbsp;/opt/splunkforwarder/bin/splunk&nbsp;enable boot-start </p>\n\n\n<strong>Installation using an DEB file:</strong>\n <p> Make sure you have downloaded the universal forwarder package from Splunk&rsquo;s website: <a title="Download the Universal Forwarder" href="https://www.splunk.com/en_us/download/universal-forwarder.html">https://www.splunk.com/en_us/download/universal-forwarder.html</a> and have it on the system on which you want to install Splunk.\n    &nbsp;&nbsp; </p>\n <p>Run: dpkg -i splunkforwarder&lt;version&gt;.rpm </p>\n<p>This will install the Splunk forwarder into the default directory of /opt/splunkforwarder </p>\n<p>To enable Splunk to run each time your server is restarted use the following command:<br/>\n    &nbsp;&nbsp;&nbsp;&nbsp;/opt/splunkforwarder/bin/splunk&nbsp;enable boot-start</p>\n<p><strong>Installation using the&nbsp;.tgz&nbsp;file:</strong></p>\n<p>Make sure you have copied the&nbsp;tarball&nbsp;(or appropriate package for your system) and extract or install it into the /opt directory.</p>\n<p>Run: tar&nbsp;zxvf&nbsp;&lt;splunk_tarball_file.tgz&gt; -C /opt\n\n<pre>[root@ip-172-31-94-210&nbsp;~]#&nbsp;tar&nbsp;zxvf&nbsp;splunkforwarder-7.0.1-2b5b15c4ee89-Linux-x86_64.tgz -C /opt\nsplunkforwarder/\nsplunkforwarder/etc/\nsplunkforwarder/etc/deployment-apps/\nsplunkforwarder/etc/deployment-apps/README\nsplunkforwarder/etc/apps/</pre>\n\n<p>Check your extraction:</p>\n<p>Run: ls -l /opt</p>\n<pre>[root@ip-172-31-94-210 apps]# ls -l /opt\ntotal 8\ndrwxr-xr-x 8 splunk splunk 4096 Nov 29 20:21 splunkforwarder</pre>\n<p>If you would like Splunk to run at&nbsp;startup&nbsp;then execute the following command<br/>\n    &nbsp;&nbsp;&nbsp;&nbsp;/opt/splunkforwarder/bin/splunk&nbsp;enable boot-start</p>\n<strong>Wrap Up</strong>\n<p>After following any of the above three options, you will have a fully installed Splunk forwarder. There are three more steps you&rsquo;ll want to take before you can see the data in Splunk:</p>\n<ul>\n <li>You will need an outputs.conf to tell the forwarder where to send data (next section)</li>\n <li>You will need an inputs.conf to tell the forwarder what data to send (below, in the &quot;Splunk Configuration for Data Source&quot;)</li>\n <li>You will need an indexes.conf on the indexers to tell them where to put the data received. (You just passed that section.)</li>\n</ul>\n',
        category: ["General Infrastructure"],
    },
    {
        id: "SC-LinuxSecurity-1-SizingEstimate",
        title: "Sizing Estimate",
        "short-description":
            "<p>Linux event volume can vary greatly based on the type of host. At a very high level, common ranges we&rsquo;ve seen are:\n  <ul><li>Workstation: 4-6 MB/day </li>\n<li>Application Servers: 25-50 MB/day</li></ul></p>\n<p>Obviously, these ranges can vary dramatically. For high horsepower Linux servers with thousands of simultaneous users, you may see more dramatically volume.</p>\n  <p>A common follow-on question we often get is regarding the expected volume for the Process Launch Logs alone, pulled from auditd. This can vary based on how many new processes spin up, of course, but it is usually a rounding error on event volume. It&rsquo;s often said that process auditing is the best bang for the buck in all of security logging!</p>\n  \n  <p>The last question we get when having these discussions is: &quot;What first?&quot; If you have a formal risk-assessment process or information-security audit policy or standards documentation, it's always best to start there. However, we generally see most customers start with servers that contain the most sensitive information and then move on from there. Importantly, remember that some organizations also run Linux desktops too, so don&rsquo;t miss those.</p>",
        category: ["Splunk Configuration for Data Source"],
    },
    {
        id: "SC-LinuxSecurity-2-InstallTA",
        title: "Install the Technology Add-On -- TA",
        "short-description":
            '<h4>Overview</h4>\n  <p>Splunk has a detailed technology add-on (Splunk add-on for Unix and Linux) that supports ingesting all manner of Linux logs. Like all Splunk technology add-ons, it also includes everything needed in order to parse out the fields and give them names that are compliant with&nbsp;Splunk&rsquo;s&nbsp;Common Information Model (<a title="Splunk Docs: Common Information Model" href="' +
            window.makeHelpLinkURL(
                "Splunk_Security_Essentials",
                "dataSource.cim.user.overview",
                "latest"
            ) +
            '">Common Information Model Overview</a>), so they can easily be used by the searches in Splunk Security Essentials. It also includes searches you will find in other community-supported and premium apps.</p>\n\n  <h4>Implementation</h4>\n  <p>Find the TA along with all your other Splunk apps/needs on&nbsp;SplunkBase. You can go to&nbsp;<a title="Splunkbase" href="https://splunkbase.splunk.com/">https://splunkbase.splunk.com/</a>&nbsp;and search for it or follow the direct link here:&nbsp;<a title="Splunkbase: Linux Add-on" href="https://splunkbase.splunk.com/app/833/">https://splunkbase.splunk.com/app/833/</a>. <br>\n  As with all Splunk TAs, we recommend you deploy it to all parts of your Splunk environment for simplicity and uniformity. So plan to install the TA on your search head, indexers, and any Linux forwarders in your environment.</p>\n<ol><li>To install the app, start by downloading the file from the&nbsp;SplunkBase&nbsp;mentioned above and extract it. <br>\n  &nbsp;<strong>Note:</strong>&nbsp;The app itself is a&nbsp;.tgz&nbsp;file, or a&nbsp;gzipped&nbsp;tarball. Fortunately, Linux systems make extraction easy, using the tar command tar&nbsp;(zxvf&nbsp;&lt;filename.tgz&gt;) installed on most distributions.</li>\n  <li>Once you have the extracted folder, move it into $SPLUNK_HOME/etc/apps/ folder. If you follow the default installation path, this will be in /opt/splunkforwarder/etc/apps</li></ol>\n<p>Here is an example of the Linux TA extracted into the proper location (note the path) on a Linux universal forwarder.</p>\n<pre>[root@ip-172-31-94-210 apps]# cd /opt/splunkforwarder/etc/apps/\n[root@ip-172-31-94-210 apps]# ls -l \ntotal 24\ndrwxr-xr-x 4 root   root   4096 Nov 29 20:14 introspection_generator_addon\ndrwxr-xr-x 4 root   root    4096 Nov 29 20:14 learned \ndrwxr-xr-x 4 root   root    4096 Nov 29 20:14 search \ndrwxr-xr-x 3 root   root    4096 Nov 29 20:14 splunk_httpinput \ndrwxr-xr-x 9 root   root    4096 Jan 25 13:34 Splunk_TA_nix \ndrwxr-xr-x 4 root   root    4096 Nov 29 20:14 SplunkUniversalForwarder</pre>\n<p>Once you&rsquo;ve extracted the app, you can restart Splunk using the command $SPLUNK_HOME/bin/splunk&nbsp;restart ($SPLUNK_HOME is /opt/splunkforwarder&nbsp;if using our default location).</p>\n  <h4>Validation</h4>\n<p>You can make sure that Splunk has picked up the presence of the app by running $SPLUNK_HOME/bin/splunk&nbsp;display app, will, after asking you to log in, provide you with a list of installed apps. Usually if you see the folder listed alongside the other apps (learned, search,&nbsp;splunk_httpinput, etc.) you will know that it&rsquo;s there successfully.</p><p><b>Splunk Cloud Customers</b>: you won\'t be copying any files or folders to your indexers or search heads, but good news! The Splunk Add-on for Unix and Linux is Cloud Self-Service Enabled. So you can just got to Find Apps, and be up and running in seconds.</p>\n',
        category: ["Splunk Configuration for Data Source"],
    },
    {
        id: "SC-LinuxSecurity-3-IndexesAndSourcetypes",
        title: "Linux Indexes and Sourcetypes",
        "short-description":
            ' <h4>Overview</h4> \n<p>  Amongst&nbsp;Splunk&rsquo;s&nbsp;15,000+ customers, we&rsquo;ve done a lot of implementations, and we&rsquo;ve learned a few things along the way. While you can use any sourcetypes or indexes that you want in the &quot;land of Splunk,&quot; we&rsquo;ve found that the most successful customers follow specific patterns, as it sets them up for success moving forward. </p>\n  <h4>Implementation</h4> \n  <p>The most common Linux data types are listed below, along with the recommended indexes and sourcetypes. Other inputs may be included in your configuration by enabling them in the local/inputs.conf&nbsp;(as described in &quot;Configuration Files&quot; section below. </p>\n<table class="table" border="0" cellspacing="0" cellpadding="0" width="601">\n  <thead><tr>\n    <th width="80" valign="top"><p>Data   Type</p></th>\n    <th width="194" valign="top"><p>Input   (inputs.conf, below)</p></th>\n    <th valign="top"><p>Sourcetype</p></th>\n    <th valign="top"><p>Index</p></th>\n    <th valign="top"><p>Notes</p></th>\n  </tr></thead><tbody>\n  <tr>\n    <td width="80" valign="top"><p>Running   processes</p></td>\n    <td width="194" valign="top"><p>script://./bin/ps.sh</p></td>\n    <td valign="top"><p>ps</p></td>\n    <td valign="top"><p>osnixscript</p></td>\n    <td valign="top"><p>Scripted   input, for running processes sampled every 30s</p></td>\n  </tr>\n  <tr>\n    <td width="80" valign="top"><p>Network   Ports</p></td>\n    <td width="194" valign="top"><p>script://./bin/netstat.sh</p></td>\n    <td valign="top"><p>netstat</p></td>\n    <td valign="top"><p>osnixscript</p></td>\n    <td valign="top"><p>Network(s)   port status sampled every 60s</p></td>\n  </tr>\n  <tr>\n    <td width="80" valign="top"><p>Open   Files</p></td>\n    <td width="194" valign="top"><p>script://./bin/lsof.sh</p></td>\n    <td valign="top"><p>lsof</p></td>\n    <td valign="top"><p>osnixperf</p></td>\n    <td valign="top"><p>Open   files to process ID map sampled every 10m</p></td>\n  </tr>\n  <tr>\n    <td width="80" valign="top"><p>Audited   Events</p></td>\n    <td width="194" valign="top"><p>script://./bin/rlog.sh</p></td>\n    <td valign="top"><p>auditd</p></td>\n    <td valign="top"><p>osnixsec</p></td>\n    <td valign="top"><p>System   events (adds / moves and changes)/privilege escalation,&nbsp;etc.</p></td>\n  </tr>\n  <tr>\n    <td width="80" valign="top"><p>System   Log Directory</p></td>\n    <td width="194" valign="top"><p>monitor:///var/log</p></td>\n    <td valign="top"><p>syslog</p></td>\n    <td valign="top"><p>osnix</p></td>\n    <td valign="top"><p>DHCP   leases, scheduled tasks, service information,&nbsp;etc.</p></td>\n  </tr>\n  <tr>\n    <td width="80" valign="top"><p>&nbsp;</p></td>\n    <td width="194" valign="top"><p>monitor:///var/log/secure</p></td>\n    <td valign="top"><p>syslog</p></td>\n    <td valign="top"><p>osnixsec</p></td>\n    <td valign="top"><p>&nbsp;</p></td>\n  </tr>\n  <tr>\n    <td width="80" valign="top"><p>System   Connections</p></td>\n    <td width="194" valign="top"><p>monitor:///var/log/auth.log</p></td>\n    <td valign="top"><p>Syslog</p></td>\n    <td valign="top"><p>osnixsec</p></td>\n    <td valign="top"><p>Multiple   protocols (sshd,&nbsp;logind,&nbsp;cron,&nbsp;sudo, etc.)</p></td>\n  </tr>\n  <tr>\n    <td width="80" valign="top"><p>Command   History</p></td>\n    <td width="194" valign="top"><p>monitor:///root/.bash_history<br>\n      monitor:///home/.../.bash_history</p></td>\n    <td valign="top"><p>bash_history</p></td>\n    <td valign="top"><p>osnixbash</p></td>\n    <td valign="top"><p>All   commands typed in the bash shell</p></td>\n  </tr>\n  <tr>\n    <td width="80" valign="top"><p>&nbsp;</p></td>\n    <td width="194" valign="top"><p>&nbsp;</p></td>\n    <td valign="top"><p>&nbsp;</p></td>\n    <td valign="top"><p>&nbsp;</p></td>\n    <td valign="top"><p>&nbsp;</p></td>\n  </tr></tbody>\n</table>\n<p>If you have already started ingesting the data sources into another index, then you can usually proceed (though consider if you should separate logs, based on who likely will need access or be prohibited access). If you have already started ingesting data with a different sourcetype, we recommend you switch over to the standardized sourcetypes, if possible. If you\'re not using the Splunk TA for Linux to ingest data, keep in mind you may need to go through extra work to align field names to get value out of Splunk Security Essentials and other Splunk content. </p>\n  <p>To support your Linux sources, follow the procedure mentioned above in&nbsp;<a href="#General_Infrastructure_References">General Infrastructure - Indexes and Sourcetypes</a>&nbsp;to add the new indexes for the data you will be bringing in.</p>\n  <p>We will show the sourcetypes and monitor statements next in the configuration files.</p>',
        category: ["Splunk Configuration for Data Source"],
    },
    {
        id: "SC-LinuxSecurity-4-inputsconf",
        title: "Configuration Files",
        "short-description":
            '  <h4>Overview</h4>\n<p>Configuration files for Linux inputs tend to be relatively simple. In this case, we just have a single&nbsp;inputs.conf&nbsp;file that will go on the Linux hosts you will be monitoring. As detailed above in&nbsp;<a href="#Instruction_Expectations_and_Scaling">Instruction Expectations and Scaling</a>, you will need some mechanism to distribute these files to the hosts you&rsquo;re monitoring. For initial tests or deployments to only your most sensitive systems, it is easy to copy the files to the hosts. For larger distributions, you can use the Splunk deployment server or use another code-distribution system, such as Puppet, Chef,&nbsp;Ansible, or others.</p>\n  <h4>Implementation</h4>\n<ul>\n  <li>Download the&nbsp;Splunk_TA_nix&nbsp;app and extract it, as described earlier</li>\n  <li>Create a folder called &quot;local&quot; in the app</li>\n  <li>Download the inputs.conf from below, and place it into the local folder. It should now be stored at Splunk_TA_nix/local/inputs.conf </li>\n    <li>Distribute the&nbsp;Splunk_TA_nix&nbsp;directory (and its contents) to all of the hosts you will be monitoring.</li>\n</ul>\n<pre filename="inputs.conf" class="codeSample">\n### bash history\n[monitor:///root/.bash_history]\nsourcetype = bash_history\nindex = osnixbash\ndisabled = 0\n\n[monitor:///home/.../.bash_history]\nsourcetype = bash_history\nindex = osnixbash\ndisabled = 0\n\n[script://$SPLUNK_HOME/etc/apps/Splunk_TA_nix/bin/netstat.sh]\ninterval = 120\nsourcetype = netstat\nsource = netstat\nindex = osnixscript\ndisabled = 0\n\n[script://$SPLUNK_HOME/etc/apps/Splunk_TA_nix/bin/lsof.sh]\ninterval = 300\nsourcetype = lsof\nsource = lsof\nindex = osnixperf\ndisabled = 0\n\n[monitor:///var/log]\nwhitelist=(log$|messages|mesg$|cron$|acpid$|\\.out)\nblacklist=(\\.gz$|\\.zip$|\\.bz2$|auth\\.log|lastlog|secure|anaconda\\.syslog)\nindex=osnix\nsourcetype=syslog\ndisabled = 0\n\n[monitor:///var/log/secure]\nblacklist=(\\.gz$|\\.zip$|\\.bz2$)\nindex=osnixsec\nsourcetype=syslog\nsource=secure\ndisabled = 0\n\n[monitor:///var/log/auth.log*]\nblacklist=(\\.gz$|\\.zip$|\\.bz2$)\nindex=osnixsec\nsourcetype=syslog\ndisabled = 0\n\n# This script reads the auditd logs translated with ausearch\n[script://./bin/rlog.sh]\nsourcetype = auditd\nsource = auditd\ninterval = 60\nindex = osnixsec\ndisabled = 0\n\n[script://./bin/ps.sh]\ninterval = 30\nsourcetype = ps\nsource = ps\nindex = osnixscript\ndisabled = 0\n</pre>\n ',
        category: ["Splunk Configuration for Data Source"],
    },
    {
        id: "VC-LinuxSecurity-1-EnablingLog",
        title: "Enabling Monitoring",
        "short-description":
            '\n  <h4>Overview</h4> \n  <p>To maintain a good security posture and to leverage the examples provided in Splunk Security Essentials, we recommend following your own security or audit policy. In the absence of that, there are a number of industry standard guides to help.</p>\n  <h4>Implementation</h4> \n  <p><strong>Important Note:</strong>&nbsp;Splunk is a monitoring product, so while we&rsquo;re working hard to centralize some of the recommendations you should follow in one place to make your life easier, we cannot offer support for the actual configuration of anything other than Splunk itself. We strongly recommend that you leverage trained expert resources when making any changes. That&rsquo;s in large part why we&rsquo;re pointing you to the documentation for the nitty-gritty details!</p>\n  <p>Fortunately, on most Linux distributions, the monitored inputs we typically see at Splunk are already logged into log files, ready for you to monitor. Typically, some of the audit controls maybe resident in different files, but using the&nbsp;inputs.conf&nbsp;above, you&rsquo;ve already got that covered!</p>\n  <p>If after reviewing your company&rsquo;s policies or industry standard guide you need a finer-grained level of monitoring, you should look to configure the auditd daemon. On most distributions,&nbsp;auditd&nbsp;is installed by default. For those of you with Ubuntu 14.04, you would need to install it. Here&rsquo;s a&nbsp;<a title="Reference for auditing Ubuntu" href="https://askubuntu.com/questions/92243/logging-program-use">document</a>&nbsp;&nbsp;that explains how to do that. As a sneak preview &quot;apt-get install&nbsp;auditd&quot; will be your friend!&nbsp;&nbsp;Once installed (if it is not already), you may configure it to monitor a number of events, such as user and process tracking. The Ubuntu configuration guide is&nbsp;<a title="Ubuntu Configuration Guide" href="http://manpages.ubuntu.com/manpages/trusty/man8/auditd.8.html">here</a>. The daemon is pretty universal across distributions. Once you have amended your audit policy, these events will be reported in the audit.log that we are monitoring as part of our&nbsp;auditd&nbsp;sourcetype in&nbsp;inputs.conf.</p>\n  <p><strong>Important Note:</strong>&nbsp;As with all system-administration tasks and auditing controls, make sure you seek the appropriate authorization and go through the testing first, to ensure the right level of monitoring and system resource.</p>\n<h4>Validation</h4>\n  <p>Usually the first thing people will see when deploying audit policies is either new systems showing up in Splunk or, at least, an increase in system log messages. If you already have some logs coming in and want to validate that you&rsquo;re getting the new ones, look for the delta between your old policy and your new one. </p>',
        category: ["System Configuration"],
    },
    {
        id: "SC-LinuxSecurity-5-leastprivilege",
        title: "(Optional) Deploy Least Permission",
        "short-description":
            '<h4>Overview</h4>\n<p>At Splunk we don&rsquo;t advise you to run our software with any more privilege than necessary. However, on monitoring systems, there is an argument to do just that. Consider this scenario: an attacker gains unauthorized access to your systems. The attacker\'s next objective is to gain privilege escalation to a system administrator. Once achieved, you can manipulate the monitored files\' (the ones that alert you of an intruder presence) permissions, so that your monitoring tool can no longer read and is effectively blind.</p>\n<h4>Implementation</h4>\n<p>If you do wish to restrict the user, you may wish to look at the following solution:</p>\n<ol><li>Change the&nbsp;group&nbsp;permission set to allow the &quot;Splunk&quot; group to <b>read</b> and ensure that only the Splunk user belongs to that group. (We have a monitoring solution for that!) <br /> <img src="%SSEDOCIMAGEPATH%/linuxta/linuxta-1-filepermissionrestricted.png" title="Above, we see the secure file has no read access for anyone other than the owner (root)." /></li>\n<li>If you followed our best practice for installing Splunk on a Linux system, you will by now have a user and group called&nbsp;&quot;Splunk.&quot; If not, create them.\n<pre>[root@ip-172-31-94-210 ec2-user]# groupadd splunk\n[root@ip-172-31-94-210 ec2-user]# useradd -g splunk splunk\n[root@ip-172-31-94-210 ec2-user]# </pre></li>\n<li>Amend the permission set on the files you need to monitor to allow users in the &quot;Splunk&quot; group to read the files. <br /> <img src="%SSEDOCIMAGEPATH%/linuxta/linuxta-1-filepermissiongranted.png" title="Above, you can see some configuration where the Splunk Forwarder will have access." /></li>\n<li>Provided Splunk is running as the splunk user and is a member of the &quot;splunk&quot; group, you will now be able to successfully monitor.</li>\n</ol>\n<p>One &quot;gotcha&quot; to this solution is that the files will often be automatically rolled and (alas) your changes will be lost. To avoid this situation, you should amend the&nbsp;logrotate&nbsp;configuration to generate the new file with the permission set we have just configured. As another sneak preview, the &quot;create&quot; statement will help. However, please see the <a title="logrotate Docs" href="https://linux.die.net/man/8/logrotate">man page</a>&nbsp;and (like always) be sure to thoroughly test and seek the appropriate approvals.</p>',
        category: ["Splunk Configuration for Data Source"],
    },
    {
        id: "SC-Sysmon-1-Overview",
        title: "Sysmon Overview",
        "short-description":
            '\n    <p >Sysmon, a component of Microsoft&rsquo;s Sysinternals suite of Windows utilities, is a very powerful host-level tool that can assist you in detecting advanced threats on your network by providing intricate host-operation details in real time. In contrast to common Antivirus/Host-Based Intrusion-detection (HIDS) solutions, Sysmon performs system activity deep monitoring and logs high-confidence indicators of advanced attacks. Read more about Sysmon in <a title="Sysmon Download" href="https://docs.microsoft.com/en-us/sysinternals/downloads/sysmon">Microsoft&rsquo;s documentation</a>. </p>\n <p >A fantastic way to collect detailed information about your Windows endpoints in Splunk, Sysmon is free of charge, installs painlessly on many variants of Windows, and integrates well with Splunk deployments. In fact, Mark Russinovich, Sysmon&rsquo;s author, has spoken about Sysmon at the past two RSA conferences and showcases Splunk as an excellent mechanism for the collection and analysis of Sysmon data. <a title="Hunting blog post from Mark Russinovich, creator of SysInternals, about Sysmon" href="http://myitforum.com/myitforumwp/2017/02/17/mark-russinovich-how-to-go-from-responding-to-hunting-with-sysinternals-sysmon/">Check out his slide deck</a>.</p>\n    <p >As of the most recent version, Sysmon is capable of producing extensive details on the following一much of it very useful in the early detection of malicious code execution or other nefarious behavior:</p>\n    <ul>\n      <li >\n         Process executions, including parent/child relationships, user that launched process, and hash data \n      </li>\n      <li >\n         File creations  \n      </li>\n      <li >\n         File creation time changes \n      </li>\n      <li >\n         Network activity, down to the process level \n      </li>\n      <li >\n         Image loads \n      </li>\n      <li >\n         Creation of &nbsp;remote threads \n      </li>\n      <li >\n         Interprocess accesses \n      </li>\n      <li >\n         Windows registry modifications \n      </li>\n      <li >\n         NTFS alternate data stream (ADS) creations \n      </li>\n      <li >\n         Pipe creations and connections \n      </li>\n      <li >\n         WMI event monitoring \n      </li>\n    </ul>\n    <p >Assuming you have already installed a recent version of the Splunk universal forwarder (UF) for Windows, follow these high-level steps to configure Splunk to properly ingest Sysmon data:</p>\n    <ol>\n      <li >\n         Install Sysmon on the endpoint running the UF and configure it to collect the information you require. \n      </li>\n      <li >\n         Configure Splunk to properly parse the Sysmon event logs. \n      </li>\n      <li >\n         Configure Splunk to collect the Sysmon event log from the endpoint. \n      </li>\n    </ol>\n    ',
        category: ["Splunk Configuration for Data Source"],
    },
    {
        id: "SC-Sysmon-2-SizingEstimate",
        title: "Sysmon Sizing Estimate",
        "short-description":
            '<p >Sizing can vary significantly, depending on the Sysmon configuration, but the SwiftOnSecurity configuration linked below reduces the information returned by Sysmon to the minimum needed to be useful. Since the UF operation can also result in significant process-execution events, we also recommend specific configurations to filter out this data here. We will cover this in the Installing Sysmon section below.</p>\n<p >A properly configured Windows endpoint running Sysmon will result in 2-4MB of Sysmon data ingested in Splunk daily—sometimes much less. Of course, particularly busy or compromised machines may generate more data. You may also select &ldquo;critical&rdquo; machines or machines owned by &ldquo;most likely targets&rdquo; and voluntarily increase the verbosity of logging on these systems. For example, the NetworkConnect (Event Code 3) and Image Load (Event Code 7) logging may be increased for these systems.</p>\n<p>For a recent success story involving the deployment of Sysmon (plus other Windows endpoint data sources) that resulted in 10-12MB of data per endpoint ingested, <a title="Conf Presentation: TransAlta" href="https://conf.splunk.com/files/2017/slides/effectively-enhancing-our-soc-with-sysmon-powershell-logging-and-machine-learning-to-detect-and-respond-to-todays-threats.pdf">review the .conf2017 presentation delivered by Splunk customer TransAlta</a>.</p>\n',
        category: ["Splunk Configuration for Data Source"],
    },
    {
        id: "SC-Sysmon-3-InstallTA",
        title: "Install the Technology Add-On -- TA",
        "short-description":
            '<p>The Sysmon TA is a Splunk app that configures Splunk to understand the Sysmon data format. It is located on <a title="Splunkbase: Download the Sysmon Add-on" href="https://splunkbase.splunk.com/app/1914/">SplunkBase</a>. </p>\n<p>Splunk recommends that you install TAs (particularly the files props.conf and transforms.conf) on all Splunk installs, including the universal forwarder. This isn&rsquo;t &nbsp;necessarily required for Sysmon, but we recommend you stick with the best practices across the board. </p>\n<p><b>Installing on Search Heads, Indexers, or on a Single Splunk Environment</b></p>\n<p>While you can opt to install the TA by copying the files into your directory structure in the same way explained for forwarders below, you can take a simpler approach for a Splunk system with UI. In fact, it&rsquo;s the same approach you probably took for installing Splunk Security Essentials in the first place—via the web interface, as documented <a title="Splunk Docs: Instructions for Single Server Installation" href="' +
            window.makeHelpLinkURL(
                "Splunk_Security_Essentials",
                "dataSource.addOns.released.overview.singleServerInstal",
                "latest"
            ) +
            '">here</a>. The Sysmon TA does not have a user interface, so it will not appear in the list of apps. However, once it&rsquo;s installed, you will be able to see it under <b>Manage Apps.</b></p>\n<p><b>Installing on forwarders</b></p>\n<ol>\n  <li>\n    <p>To install the app, start by <a title="Splunkbase: Download the Sysmon Add-on"  href="https://splunkbase.splunk.com/app/1914/">downloading the file from the SplunkBase</a>, then extract it. Note: The app itself is a .tgz file, or a gzipped tarball. If you&rsquo;re running a pure Windows environment, this means that you will need a third-party program to extract it. Fortunately, .tgz is the most common format in the world after .zip, so virtually any extraction program you have (WinZip, 7z, WinRAR, etc.) will all extract it.</p>\n  </li>\n  <li>\n    <p>Once you have the extracted folder, move it into <pre>%SPLUNK_HOME%/etc/apps/</pre> folder. For most modern Splunk environments, that will be <pre>C:\\Program Files\\SplunkUniversalForwarder\\etc\\apps</pre>.</p>\n  </li>\n  <li>\n    <p>Once you&rsquo;ve extracted the app, you must restart Splunk, either via the Services Control Panel applet or by running <pre>C:\\Program Files\\SplunkUniversalForwarder\\bin\\splunk.exe restart</pre>.</p>\n  </li>\n</ol>\n<h4>Validation</h4>\n<p>You can make sure that Splunk has picked up the presence of the app by running: <pre>C:\\Program Files\\SplunkUniversalForwarder\\bin\\splunk.exe</pre> display app, will, after asking you to log in, provide you with a list of installed apps. Usually, however, if you see the folder listed alongside the other apps (learned, search, splunk_httpinput, etc.), you can be assured that it&rsquo;s there.</p><p><b>Splunk Cloud Customers</b>: you won\'t be copying any files or folders to your indexers or search heads, but good news! Even though the Sysmon TA is not Cloud Self-Service Enabled, you will still be able to open a ticket with Cloud Ops and be ready to go in short order.</p>\n\n',
        category: ["Splunk Configuration for Data Source"],
    },
    {
        id: "SC-Sysmon-4-configurationfiles",
        title: "Configuration Files",
        "short-description":
            '<h4>Overview</h4>\n<p>Configuration files for Sysmon are pretty simple. In this case, we just have a single inputs.conf file that will go on the Windows hosts you will be monitoring. You’ll need to collect another Windows Event Log to collect the information from Sysmon running on the endpoint.  While Splunk supports a few mechanisms for collecting event logs, almost all customers follow our Professional Services’ best practices and pull them in via the universal forwarder (UF).</p>\n<p>As detailed in Instruction Expectations and Scaling, you will need some mechanism to distribute these files to the hosts you’re monitoring. For initial tests or deployments to just your most sensitive systems, it is easy to copy the files to the hosts. For larger distributions, you can use the Splunk deployment server or use another code-distribution system, such as SCCM, Puppet, Chef, Ansible, or others.</p>\n<h4>Implementation</h4>\n<p>Distribute the below inputs.conf file to your hosts in the %SPLUNK_HOME%\\etc\\apps\\TA-microsoft-sysmon\\local folder. If the folder doesn’t exist, you will need to create it. For most customers, the path to this file will end up being C:\\Program Files\\SplunkUniversalForwarder\\etc\\apps\\TA-microsoft-sysmon\\local\\inputs.conf.</p>\n\n<pre filename="inputs.conf" class="codeSample">[WinEventLog://Microsoft-Windows-Sysmon/Operational]\ndisabled = false\nrenderXml = 1\nindex = epintel\n</pre>\n<h4>Verification</h4>\n<p>If all is properly configured, you should be able to find your data using the following Splunk search:\n<pre>index=* source=XmlWinEventLog:Microsoft-Windows-Sysmon/Operational</pre></p>\n<p>You should see data coming into Splunk and then verify correct timestamps, event breaking, and field extraction.</p>\n',
        category: ["Splunk Configuration for Data Source"],
    },
    {
        id: "VC-Sysmon-1-SingleServer",
        title: "Single System Sysmon Installation",
        "short-description":
            '<h4>Implementation</h4>\n<p><a title="Download Sysmon" href="https://docs.microsoft.com/en-us/sysinternals/downloads/sysmon">Download Sysmon</a>. </p>\n<p>Sysmon can generate large amounts of logs. You will want to tune your collection configuration. We recommend starting with this Sysmon configuration: <a title="Recommended Sysmon Configuration from Twitter InfoSec Expert SwiftOnSecurity" href="https://github.com/SwiftOnSecurity/sysmon-config">https://github.com/SwiftOnSecurity/sysmon-config</a>. Advanced users may also want to look at <a title="Sysmon Templates mapped to MITRE ATT&CK Framework from expert MHaggis" href="https://github.com/MHaggis/sysmon-dfir">https://github.com/MHaggis/sysmon-dfir</a>. </p>\n\n<p>In either case, be sure to include configuration lines to exclude Splunk forwarder execution activity, especially for <a title="Official Readme for Splunk Sysmon Add-on" href="https://github.com/splunk/TA-microsoft-sysmon/blob/master/README.txt">process-creation events</a>. </p>\n\n<p>To install on your endpoint, run the following with administrator rights:\n<pre>sysmon.exe -accepteula -i sysmonconfig-export.xml</pre></p>\n\n<p>Update existing configuration, again, with administrator rights:\n<pre>sysmon.exe -c sysmonconfig-export.xml</pre></p>\n\n<p>Upon installation, Sysmon will begin logging events to the operational event log. \n<pre>C:\\Windows\\System32\\winevt\\Logs\\Microsoft-Windows-Sysmon%4Operational.evtx</pre></p>\n<h3>Verify your installation</h3>\n<p>After successful installation, you should be able to see the Sysmon log in your Windows Event Viewer.</p>\n',
        category: ["System Configuration"],
    },
    {
        id: "VC-Sysmon-1-LargeScale",
        title: "(Optional) Large Scale Sysmon Installation",
        "short-description":
            '<p>Large-scale deployments of Sysmon can be automated using Group Policy Objects (GPO), as described <a title="Installing Sysmon via GPO" href="https://blogs.technet.microsoft.com/motiba/2017/12/07/sysinternals-sysmon-suspicious-activity-guide/">here</a>. </p>',
        category: ["System Configuration"],
    },
    {
        id: "SC-Symantec-1-Overview",
        title: "Overview",
        "short-description":
            "<p>Most Symantec environments will have a Windows Server running the Symantec Endpoint Protection Management (SEPM) server, where you install the Universal Forwarder (UF), the Symantec Technology Add-In (TA), and the inputs.conf. You don't need to apply this configuration to all of the devices in your environment.</p>\n<p>SEPM creates log files, called dump files, in the local file system. The UF is configured to ingest these log files through a deployed configuration file called inputs.conf.</p>\n",
        category: ["Splunk Configuration for Data Source"],
    },
    {
        id: "SC-Symantec-2-SizingEstimate",
        title: "Sizing Estimate",
        "short-description":
            '<p>Sizing of the SEPM logs depend on policy, activity and number of clients. In table 1-6 (page 22) of the <a title="Symantec Docs: SEP 14 Sizing and Scalability" href="https://support.symantec.com/en_US/article.DOC4448.html">Symantec Endpoint Protection 14 Sizing and Scalability Best Practices White Paper</a>, Symantec gives an example of average events per log. Based on this example, the daily ingest into Splunk for Viruses logs could be 0.5MB per 1,000 clients per day.</p>\n',
        category: ["Splunk Configuration for Data Source"],
    },
    {
        id: "SC-Symantec-3-InstallTA",
        title: "Install the Technology Add-On -- TA",
        "short-description":
            '<h4>Overview</h4>\n<p>Splunk has a detailed TA that supports ingesting all the different data types generated by your Symantec Endpoint Protection Manager. Like all Splunk TAs, it also includes everything needed to parse out the fields and give them names that are compliant with Splunk&rsquo;s Common Information Model (CIM), so they can easily be used by the searches in Splunk Security Essentials (SSE), along with searches you will find in other community-supported and premium apps. </p>\n<h4>Implementation</h4>\n<p>Find the TA, along with all your other Splunk apps needs, on SplunkBase. You can <a title="Splunkbase" href="https://splunkbase.splunk.com/">https://splunkbase.splunk.com/</a> and search for it or follow the direct link, <a title="Splunkbase: Symantec Endpoint Protection Add-on" href="https://splunkbase.splunk.com/app/2772/">here</a>.</p>\n\n<p>As with all Splunk TAs, we recommend you deploy it to all parts of your Splunk environment, for simplicity and uniformity. To install the app, start by downloading the file from the SplunkBase URL just shown and then extract it into %SPLUNK_HOME%/etc/apps/ folder. For most modern Splunk environments, that will be C:\\Program Files\\SplunkUniversalForwarder\\etc\\apps. </p>\n<p>Note: The app itself is a .tgz file, or a gzipped tarball. If you&rsquo;re running in a pure Windows environment, this means that you will need a third-party program to extract it. Fortunately, .tgz is the most common format in the world after .zip, so virtually any extraction program you have (WinZip, 7z, WinRAR, etc.) will all extract it.</p>\n<p>Once you&rsquo;ve extracted the app, you can restart Splunk via the Services Control Panel applet, or by just running: <pre>c:\\Program Files\\SplunkUniversalForwarder\\bin\\splunk.exe restart </pre></p>\n\n<h4>Validation</h4>\n<p>You can make sure that Splunk has picked up the presence of the app by running: <pre>"C:\\program files\\splunk\\bin\\splunk.exe" display app</pre>, will, after asking you to log in, provide you with a list of installed apps. Usually, if you see the folder listed alongside the other apps (learned, search, splunk_httpinput, etc.) you will know that it&rsquo;s there successfully. </p><p><b>Splunk Cloud Customers</b>: you won\'t be copying any files or folders to your indexers or search heads, but good news! Even though the Splunk Add-on for Symantec Endpoint Protection is not Cloud Self-Service Enabled, you will still be able to open a ticket with Cloud Ops and be ready to go in short order.</p>',
        category: ["Splunk Configuration for Data Source"],
    },
    {
        id: "SC-Symantec-4-IndexesAndSourcetypes",
        title: "Symantec Indexes and Sourcetypes",
        "short-description":
            '<h4>Overview</h4>\n<p>Amongst Splunk&rsquo;s 15000+ customers, we&rsquo;ve done a lot of implementations and we&rsquo;ve learned a few things along the way. While you can use any sourcetypes or indexes that you want in &ldquo;Splunk land,&rdquo; we&rsquo;ve found that the most successful customers follow specific patterns, as it sets them up for success moving forward.</p>\n<h4>Implementation</h4>\n<p>The most common SEPM data types are the Security Log, System Log, and Application Log, but there are a few others as well. Here is a list of the recommended indexes and sourcetypes.</p>\n<table border="0" class="table">\n <thead> <tr>\n    <th valign="top">\n      Data Type </th>\n    <th valign="top"><p>Input   (inputs.conf, below)</p></th>\n    <th valign="top"><p>Sourcetype</p></th>\n    <th valign="top"><p>Index</p></th>\n    <th valign="top"><p></p></th>\n  </tr>\n </thead> <tr>\n    <td valign="top"><p>Client scan data</p></td>\n    <td valign="top"><p>agt_scan.tmp </p></td>\n    <td valign="top"><p>symantec:ep:scan:file </p></td>\n    <td valign="top"><p>epav</p></td>\n    <td valign="top"></td>\n  </tr>\n  <tr>\n    <td valign="top"><p>Client risk data</p></td>\n    <td valign="top"><p>agt_risk.tmp </p></td>\n    <td valign="top"><p>symantec:ep:risk:file </p></td>\n    <td valign="top"><p>epav</p></td>\n    <td valign="top"></td>\n  </tr>\n  <tr>\n    <td valign="top"><p>Client proactive   threat data</p></td>\n    <td valign="top"><p>agt_proactive.tmp </p></td>\n    <td valign="top"><p>symantec:ep:proactive:file </p></td>\n    <td valign="top"><p>epav</p></td>\n    <td valign="top"></td>\n  </tr>\n  <tr>\n    <td valign="top"><p>Application and device   control data</p></td>\n    <td valign="top"><p>Agt_behavior.tmp</p></td>\n    <td valign="top"><p>symantec:ep:behavior:file</p></td>\n    <td valign="top"><p>ephids</p></td>\n    <td valign="top"></td>\n  </tr>\n  <tr>\n    <td valign="top"><p>Client security   data</p></td>\n    <td valign="top"><p>Agt_security.tmp</p></td>\n    <td valign="top"><p>Symantec:ep:security:file</p></td>\n    <td valign="top"><p>ephids</p></td>\n    <td valign="top"></td>\n  </tr>\n  <tr>\n    <td valign="top"><p>Server client data</p></td>\n    <td valign="top"><p>Scm_agent_act.tmp</p></td>\n    <td valign="top"><p>Symantec:ep:agent:file</p></td>\n    <td valign="top"><p>ephids</p></td>\n    <td valign="top"><p>&nbsp;</p></td>\n  </tr>\n  <tr>\n    <td valign="top"><p>Client traffic   data</p></td>\n    <td valign="top"><p>Agt_traffic.tmp</p></td>\n    <td valign="top"><p>Symantec:ep:traffic:file</p></td>\n    <td valign="top"><p>epfw</p></td>\n    <td valign="top"><p>&nbsp;</p></td>\n  </tr>\n  <tr>\n    <td valign="top"><p>Client packet data</p></td>\n    <td valign="top"><p>Agt_packet.tmp</p></td>\n    <td valign="top"><p>Symantec:ep:packet:file</p></td>\n    <td valign="top"><p>epfw</p></td>\n    <td valign="top"><p>&nbsp;</p></td>\n  </tr>\n  <tr>\n    <td valign="top"><p>Server system data</p></td>\n    <td valign="top"><p>Scm_system.tmp</p></td>\n    <td valign="top"><p>Symantec:ep:scm_system:file</p></td>\n    <td valign="top"><p>epav </p></td>\n    <td valign="top"><p>&nbsp;</p></td>\n  </tr>\n  <tr>\n    <td valign="top"><p>Client system data</p></td>\n    <td valign="top"><p>Agt_system.tmp</p></td>\n    <td valign="top"><p>Symantec:ep:agt_system:file</p></td>\n    <td valign="top"><p>epav </p></td>\n    <td valign="top"><p>&nbsp;</p></td>\n  </tr>\n  <tr>\n    <td valign="top"><p>Server policy data</p></td>\n    <td valign="top"><p>Scm_policy.tmp</p></td>\n    <td valign="top"><p>Symantec:ep:scm_policy:file</p></td>\n    <td valign="top"><p>epav </p></td>\n    <td valign="top"><p>&nbsp;</p></td>\n  </tr>\n  <tr>\n    <td valign="top"><p>Server administration data</p></td>\n    <td valign="top"><p>Scm_admin.tmp</p></td>\n    <td valign="top"><p>Symantec:ep:scm_admin:file</p></td>\n    <td valign="top"><p>epav </p></td>\n    <td valign="top"><p>&nbsp;</p></td>\n  </tr>\n  <tr>\n    <td valign="top"><p>&nbsp;</p></td>\n    <td valign="top"><p>&nbsp;</p></td>\n    <td valign="top"><p>&nbsp;</p></td>\n    <td valign="top"><p>&nbsp;</p></td>\n    <td valign="top"><p>&nbsp;</p></td>\n  </tr>\n</table>\n<p>If you have already started ingesting the data sources into another index, you can usually proceed (do consider, however, whether you should separate security logs from administration logs, application, and system logs, based on who likely will need access or be prohibited access). If you have already started ingesting data with a different sourcetype, we recommend you switch over to the standardized sourcetypes, if possible. If you\'re not using the Splunk TA for SEPM to ingest data, keep in mind you may need to go through extra work to align field names to get value out of Splunk Security Essentials and other Splunk content.</p>\n<p>To support your SEPM sources, follow the procedure mentioned above in&nbsp;&ldquo;<a href="#General_Infrastructure_References">General Infrastructure--Indexes and Sourcetypes</a>&rdquo;&nbsp;to add the new indexes for the data you will be bringing in.</p>\n<p>For the sourcetypes and monitor statements, we will show those next in &ldquo;Symantec Configuration Files.&rdquo;</p>\n',
        category: ["Splunk Configuration for Data Source"],
    },
    {
        id: "SC-Symantec-5-configurationfiles",
        title: "Symantec Configuration Files",
        "short-description":
            '<h4>Overview</h4>\n<p>Configuration files for SEP Manager inputs tend to be pretty simple. In this case, we just have a single inputs.conf file that will go on the Windows SEPM hosts you will be monitoring. As detailed above in <a href="#Instruction_Expectations_and_Scaling"><b>Instruction Expectations and Scaling</b></a>, you will need some mechanism to distribute these files to the hosts you\'re monitoring. For initial tests or deployments to just your most sensitive systems, it is easy to copy the files to the hosts. For larger distributions, you can use the Splunk Deployment Server, or use another code distribution system such as SCCM, Puppet, Chef, Ansible, or others. </p>\n<h4>Implementation</h4>\n<p>Distribute the below inputs.conf file to your hosts in the %SPLUNK_HOME%\\etc\\apps\\Splunk_TA_symantec_ep\\localfolder. If the folder doesn\'t exist, you will need to create it. For most customers, the path to this file will end up being C:\\Program Files\\SplunkUniversalForwarder\\etc\\apps\\Splunk_TA_symantec_ep\\local\\inputs.conf.</p>\n\n<p>Example of inputs.conf that can be deployed to the Splunk UF on the SEP Manager system:</p>\n<pre filename="inputs.conf" class="codeSample">[monitor://C:\\Program Files (x86)\\Symantec\\Symantec Endpoint Protection Manager\\data\\dump\\agt_scan.tmp]\ndisabled = false\nindex = epav\nsourcetype = symantec:ep:scan:file\n\n[monitor://C:\\Program Files (x86)\\Symantec\\Symantec Endpoint Protection Manager\\data\\dump\\scm_admin.tmp]\nindex = epav\nsourcetype = symantec:ep:admin:file\ndisabled = false\n\n[monitor://C:\\Program Files (x86)\\Symantec\\Symantec Endpoint Protection Manager\\data\\dump\\agt_behavior.tmp]\nindex = ephids\nsourcetype = symantec:ep:behavior:file\ndisabled = false\n\n[monitor://C:\\Program Files (x86)\\Symantec\\Symantec Endpoint Protection Manager\\data\\dump\\scm_agent_act.tmp]\nindex = ephids\nsourcetype = symantec:ep:agent:file\ndisabled = false\n\n[monitor://C:\\Program Files (x86)\\Symantec\\Symantec Endpoint Protection Manager\\data\\dump\\scm_policy.tmp]\nindex = epav\nsourcetype = symantec:ep:policy:file\ndisabled = false\n\n[monitor://C:\\Program Files (x86)\\Symantec\\Symantec Endpoint Protection Manager\\data\\dump\\scm_system.tmp]\nindex = epav\nsourcetype = symantec:ep:scm_system:file\ndisabled = false\n\n[monitor://C:\\Program Files (x86)\\Symantec\\Symantec Endpoint Protection Manager\\data\\dump\\agt_packet.tmp]\nindex = epfw\nsourcetype = symantec:ep:packet:file\ndisabled = false\n\n[monitor://C:\\Program Files (x86)\\Symantec\\Symantec Endpoint Protection Manager\\data\\dump\\agt_proactive.tmp]\nindex = epav\nsourcetype = symantec:ep:proactive:file\ndisabled = false\n\n[monitor://C:\\Program Files (x86)\\Symantec\\Symantec Endpoint Protection Manager\\data\\dump\\agt_risk.tmp]\nindex = epav\nsourcetype = symantec:ep:risk:file\ndisabled = false\n\n[monitor://C:\\Program Files (x86)\\Symantec\\Symantec Endpoint Protection Manager\\data\\dump\\agt_security.tmp]\nindex = ephids\nsourcetype = symantec:ep:security:file\ndisabled = false\n\n[monitor://C:\\Program Files (x86)\\Symantec\\Symantec Endpoint Protection Manager\\data\\dump\\agt_system.tmp]\nindex = epav\nsourcetype = symantec:ep:agt_system:file\ndisabled = false\n\n[monitor://C:\\Program Files (x86)\\Symantec\\Symantec Endpoint Protection Manager\\data\\dump\\agt_traffic.tmp]\nindex = epfw\nsourcetype = symantec:ep:traffic:file\ndisabled = false\n</pre>\n',
        category: ["Splunk Configuration for Data Source"],
    },
    {
        id: "VC-Symantec-1-Configuration",
        title: "Enabling Logging in Symantec Endpoint Protection Manager",
        "short-description":
            '<h4>Overview</h4>\n<p>To maintain a good security posture and to leverage the examples provided in SSE, we recommend following logging configured in the SEPM.</p>\n<h4>Implementation</h4>\n<b>Step One</b>\n<ul><li>Open the admin console on Symantec Endpoint Protection Manager (SEPM).</li>\n<li>Open the admin panel, click Servers, select your site and select "Configure External Logging."</li>\n<li>Enable export logs to a dump file.</li></ul>\n<img src="%SSEDOCIMAGEPATH%/symantec/symantec-1-ConfigureExternalLogging.png" title="Here we are configuring the External Logging Policy." />\n<b>Step Two</b>\n<ul><li>Click on the <b>Log Filter</b> tab and select the logs to export to a file.</li>\n<li><b>Severity level Info</b> should be enabled as well, as it gives for example information on privileged account access (into SEPM), files submitted to Symantec, or functions enabled/disabled.</li></ul>\n<img src="%SSEDOCIMAGEPATH%/symantec/symantec-2-LogFilter.png" title="Here we are defining the log filter policy." />\n<b>Step Three</b>\n<p>The last step (often overlooked!) is to verify that log handling is configured, so that all events on the endpoint are sent to the SEPM.</p>\n<ul><li>Open the Policies panel, select the <b>Virus and Spyware Protection Policy</b> that is in use, and open it.</li>\n<li>Open <b>Miscellaneous</b> and select the <b>Log Handling</b> tab.</li>\n<li>Select <b>show all virus and spyware protection events</b> and select all event types.</li></ul>\n<img src="%SSEDOCIMAGEPATH%/symantec/symantec-3-VirusPolicy.png" title="Here we are configuring the policy to send events from endpoints to the server." />\n<h4>Validation</h4>\n<p>Once all configured correctly, the events should flow into Splunk. Below an example of how the source, sourcetype, and index should look. Search example: <pre>index=ep* | stats count by source, sourcetype, index</pre></p>\n<img src="%SSEDOCIMAGEPATH%/symantec/symantec-4-validation.png" title="Confirmed -- we can see events in the ep* indexes!" />',
        category: ["System Configuration"],
    },
    {
        id: "VC-o365-1-Overview",
        title: "Office 365 Overview",
        "short-description":
            "<p>The Office365 Reporting Add-on lets you collect Exchange message-tracking logs by querying the Office 365 Reporting web service API and indexing the results.</p><p>Exchange message-tracking logs record email message activity as they flow through the transport pipeline on Exchange mail servers. These are particularly helpful not only for exchange troubleshooting and diagnosing, but also from a security-operations perspective.</p><p>They can help you:<ul><li>Find out what happened to a message sent by a specific sender.</li><li>Find out if a transport rule acted on a message.</li><li>Find out if a message sent from an Internet sender made it into your Exchange organization.</li><li>Correlate sender domains against threat intelligence or look for non-standard senders.</li></ul></p>\n",
        category: ["System Configuration"],
    },
    {
        id: "VC-o365-2-configureo365",
        title: "Validate Office 365 Permissions",
        "short-description":
            '<p>The Office365 Reporting Add-on requires an Exchange admin account to query the message trace APIs to retrieve data.</p><p>To validate that the account you are using has sufficient access:<ol><li>Login to <a title="Office Online" href="https://portal.office.com">https://portal.office.com</a></li><li>Access the Exchange Admin Center</li><li>Select <b>mail flow</b>, then <b>message trace</b>. If you\'re able to successfully run a message trace, the account will suffice.</p><img src="%SSEDOCIMAGEPATH%/o365/o365-1-configuremessagetrace.png" title="Confirmed -- we\'re able to configure Message Traces, so our account works." />\n',
        category: ["System Configuration"],
    },
    {
        id: "SC-o365-1-SizingEstimate",
        title: "Sizing Estimate",
        "short-description":
            "<p>There is a large amount of variability in the volume of O365 logs. There are several areas that impact volumes:<ul><li>Subscription type and Workloads (Apps) used</li><li>Size of organisation</li><li>O365 adoption inside of the organization</li><li>Kinds of federation / ADsync / ExpressRoute, and etc.</li></ul></p><p>Message trace events tend to be about 650 bytes each, with multiple events per email. Management logs tend to be about 1200 bytes each, and Azure Audit logs tend to be north of 3000 bytes each.</p><p>If you're trying to use this information to accurately size your environment, unfortunately there's not an easy way to size this information without just ingesting it. The way that most customers will determine their data ingest is to just start ingesting data, and then look at how much data has been ingested.</p>\n",
        category: ["Splunk Configuration for Data Source"],
    },
    {
        id: "SC-o365-2-WhereToCollect",
        title: "Where to Collect",
        "short-description":
            '<p>Pulling logs from Office 365 requires a web service. It is functionally very different from grabbing data from local logs or events, since it must be configured via the Office 365 Reporting Add-on on a Splunk box with a web UI. It\'s deployed in one of the following two ways:<ol><li>Single instance: Splunk customers who have a smaller Splunk load that fits on a single system often add the Technology Add-on (TA) to the same system. Sizing here is environment specific, so you will want to ensure adequate performance (although this setup is usually quite workable in smaller environments). If you need to, you can always redo the configuration later, using a dedicated heavy forwarder.</li><li>Heavy forwarder: In most environments, customers will install the TA on a dedicated heavy forwarder. A heavy forwarder is just like a normal Splunk install (in effect, not a universal forwarder), but its only role is to pull in data from special sources and send it to indexers.</li></ol></p><p>The Office 365 Reporting Add-on requires Internet connectivity to run REST API queries to the reporting web service. </p>\n<p>While, generally speaking, it is Splunk best practice to install TAs across all parts of your Splunk environment (particularly props and transforms), in the case of the Office 365 Reporting Add-on, we will be reaching out to a cloud service, which makes the configuration slightly different. We separate out installing the TA from configuring the inputs. <br>\n  <p><strong>Configuring the inputs:</strong> You will only configure the inputs on one system in your environment, such as a heavy forwarder or a single instance. (See &quot;Overview&quot; for more detail.)</p>\n  <p><strong>Installing the TA:</strong> The TA itself should reside wherever you configure the inputs (since the TA is the mechanism that allows you to configure the inputs). If you have a larger or more advanced environment where you configure the inputs on a heavy forwarder, you should also install the TA on your search heads, so you can see the Office 365 field extractions. </p>\n  <p><em>Advanced tip: Hide the app on your search heads, so you don&rsquo;t accidentally reconfigure and duplicate your data later. To do this, click the app dropdown on the upper left-hand corner of the screen, then select <b>Manage Apps.</b> then <b>Edit Properties</b> next to the Office 365 Reporting Add-on. Next, click <b>Visible: No</b> and then save.</em></p>\n  <p>The following table provides a reference for installing this specific add-on to a distributed deployment of Splunk Enterprise: </p>\n<table class="table">\n <thead> <tr>\n    <th>    <strong>Splunk Platform Component</strong></th>\n    <th><p><strong>Supported?</strong></p></th>\n    <th><p><strong>Required</strong></p></th>\n  </tr>\n</thead><tbody>  <tr>\n    <td><p>Search heads</p></td>\n    <td><p>Yes</p></td>\n    <td><p>Yes</p></td>\n  </tr>\n  <tr>\n    <td><p>Heavy forwarders</p></td>\n    <td><p>Yes</p></td>\n    <td><p>Depends on size</p></td>\n  </tr>\n  <tr>\n    <td><p>Indexers</p></td>\n    <td><p>Yes</p></td>\n    <td><p>No</p></td>\n  </tr>\n  <tr>\n    <td><p>Universal forwarders</p></td>\n    <td><p>No</p></td>\n    <td><p>No</p></td>\n  </tr></tbody>\n</table>\n',
        category: ["Splunk Configuration for Data Source"],
    },
    {
        id: "SC-o365-3-InstallTA",
        title: "Install the Technology Add-On -- TA",
        "short-description":
            '<p>Log into Splunk and click <b>Splunk Apps</b>.<img src="%SSEDOCIMAGEPATH%/stream/stream-1-splunkappslink.png"  title="Click Splunk Apps to find the AWS Add-on." /></p><p>Search for "Office 365 Reporting." Click the <b>Install</b> button. <img src="%SSEDOCIMAGEPATH%/o365/o365-7-installaddon.png"  title="Search for Office 365 Reporting in Apps" /></p><p>After installation, click <b>Restart Now.</b> <img src="%SSEDOCIMAGEPATH%/stream/stream-3-restartnow.png"  title="When asked, restart Splunk." /></p><p>Log back into Splunk and select the Microsoft Office 365 Reporting Add-on app.</p><p><b>Splunk Cloud Customers</b>: you won\'t be copying any files or folders to your indexers or search heads, but good news! Even though the Office 365 Reporting Add-on is not Cloud Self-Service Enabled, you will still be able to open a ticket with Cloud Ops and be ready to go in short order.</p>\n',
        category: ["Splunk Configuration for Data Source"],
    },
    {
        id: "SC-o365-4-IndexesAndSourcetypes",
        title: "O365 Indexes and Sourcetypes",
        "short-description":
            '<h2>Overview</h2>\n<p>Amongst&nbsp;Splunk&rsquo;s&nbsp;15,000+ customers, we&rsquo;ve done a lot of implementations, and we&rsquo;ve learned a few things along the way. While you can use any sourcetypes or indexes that you want in the &quot;land of Splunk,&quot; we&rsquo;ve found that the most successful customers follow specific patterns, as it sets them up for success moving forward. </p>\n<h2>Implementation</h2>\n<p>Here is a table of sourcetypes and indexes we recommend. If you have already followed the recommended indexes.conf setup above, then the index is already configured for you and everything will run automatically. If you are blazing your own path, we strongly recommend creating an index called &ldquo;mail&rdquo; now. (<a title="Splunk Docs: Creating an Index" href="' +
            window.makeHelpLinkURL(
                "Splunk_Security_Essentials",
                "dataSource.splunk.indexer.setupMultipleIndexes.createAndEditEventIndexes",
                "latest"
            ) +
            '">on premise link</a>, <a title="Splunk Docs: Creating an index in SplunkCloud" href="' +
            window.makeHelpLinkURL(
                "Splunk_Security_Essentials",
                "dataSource.splunkCloud.user.manageIndexes.createASplunkCloudIndex",
                "latest"
            ) +
            '">cloud link</a>) </p>\n<table border="1" cellspacing="0" cellpadding="0" width="662">\n  <tr>\n    <td width="142" valign="top"><p>Data source</p></td>\n    <td width="265" valign="top"><p>Description</p></td>\n    <td width="208" valign="top"><p>Sourcetype</p></td>\n    <td width="47" valign="top"><p>Index</p></td>\n  </tr>\n  <tr>\n    <td width="142" valign="top"><p>ms_o365_message_trace</p></td>\n    <td width="265" valign="top"><p>REST API data from the   O365 reporting web service</p></td>\n    <td width="208" valign="top"><p>ms:o365:reporting:messagetrace</p></td>\n    <td width="47" valign="top"><p>mail</p></td>\n  </tr>\n</table>\n',
        category: ["Splunk Configuration for Data Source"],
    },
    {
        id: "SC-o365-5-configuration",
        title: "Configuration",
        "short-description":
            '<h4>Implementation</h4><ol><li>In the Microsoft Office 365 Reporting Add-on for Splunk, select <b>Configuration</b> in the navigation, and then <b>Add</b>.<img src="%SSEDOCIMAGEPATH%/o365/o365-2-addconfiguration.png" title="Here we are adding a new O365 configuration." /></li><li>Enter Name, Username, and Password. Select Add.<img src="%SSEDOCIMAGEPATH%/o365/o365-3-enterconfig.png" title="Now we add in the account information we validated above." /></li><li>Now that we\'ve configured our account, select the <b>Inputs</b> tab, then <b>Create New Input</b>.<img src="%SSEDOCIMAGEPATH%/o365/o365-4-addinput.png" title="Here we can do an input." /></li><li>Enter Name and Interval. Select Index and Office365 Account. Enter Start date/time and select Add.<img src="%SSEDOCIMAGEPATH%/o365/o365-5-configureinput.png" title="Here we are adding a new O365 configuration." />Note: Depending on the size of the environment, you may run into issues with Azure limits when trying to retrieve too many previous events. If historical data is not essential, set the start date/time as the current day.</li></ol><h4>Validation</h4><p>Validate the input and confirm the data is being ingested by running the following search: index=mail sourcetype=ms:o365:reporting:messagetrace</p><img src="%SSEDOCIMAGEPATH%/o365/o365-6-validation.png" title="O365 Message Traces Successfully Ingested!" />\n',
        category: ["Splunk Configuration for Data Source"],
    },
    {
        id: "VC-AWS-1-Overview",
        title: "AWS Setup Overview",
        "short-description":
            '<p>Amazon Web Services (AWS) has become an integral part of several organizations&rsquo; IT infrastructure. Splunk offers an easy method to ingest various data sources from the AWS platform, which Splunk Security Essentials (SSE) uses to enhance your overall security posture. This overview will provide step-by-step guidance on setting up this integration—specifically for the CloudTrail and VPC Flow Logs\' data sources. CloudTrail provides a comprehensive trail of account activity related to actions across your AWS infrastructure. VPC Flow Logs contain a comprehensive record of network traffic in and out of your AWS environment.</p>\n  <p>To set up this integration on your&nbsp;<a title="Splunk Docs: AWS Add-on Hardware and Software Requirement" href="' +
            window.makeHelpLinkURL(
                "Splunk_Security_Essentials",
                "dataSource.addOns.released.aws.hardwareAndSoftwareRequirements",
                "latest"
            ) +
            '">supported platform</a>, follow these steps: </p>\n <ol>\n<li><a title="Splunk Docs: Configure AWS" href="' +
            window.makeHelpLinkURL(
                "Splunk_Security_Essentials",
                "dataSource.addOns.released.aws.configureAws",
                "latest"
            ) +
            '">Configure your AWS accounts and services</a> or confirm your existing configurations.</li>\n<li><a title="Splunk Docs: Configure AWS Permissions" href="' +
            window.makeHelpLinkURL(
                "Splunk_Security_Essentials",
                "dataSource.addOns.released.aws.configureAwsPermissions6",
                "latest"
            ) +
            '">Configure accounts or EC2 roles with IAM permissions</a>&nbsp;to match those required by the add-on.</li>\n<li><a title="Splunk Docs: AWS Distributed Deployment" href="' +
            window.makeHelpLinkURL(
                "Splunk_Security_Essentials",
                "dataSource.addOns.released.aws.distributedDeployment",
                "latest"
            ) +
            '">Install the add-on</a>.</li>\n<li>On your data-collection node,&nbsp;<a title="Splunk Docs: Set up the AWS Add-on" href="' +
            window.makeHelpLinkURL(
                "Splunk_Security_Essentials",
                "dataSource.addOns.released.aws.setUpTheAddOn",
                "latest"
            ) +
            '">configure the AWS accounts</a>&nbsp;you want to use to collect data with the add-on.</li>\n<li><a title="Splunk Docs: Configure AWS Inputs" href="' +
            window.makeHelpLinkURL(
                "Splunk_Security_Essentials",
                "dataSource.addOns.released.aws.configureInputs",
                "latest"
            ) +
            '">Configure your inputs</a>&nbsp;to get your AWS data into the Splunk platform.</li>\n </ol>\n  <p>Comprehensive documentation for configuring both your AWS and Splunk environments can be found at <a title="Splunk Docs: AWS Overview" href="' +
            window.makeHelpLinkURL(
                "Splunk_Security_Essentials",
                "dataSource.addOns.released.aws3",
                "latest"
            ) +
            '">https://docs.splunk.com/Documentation/AddOns/released/AWS</a>.</p>\n  <p><strong>Prerequisite:</strong>&nbsp;Performing all the steps below requires administrator access to your AWS account. If you do not have the required permissions to perform all the actions yourself, work with an AWS admin to complete all steps, including creating the accounts or EC2 IAM roles, with the permissions that the Splunk Add-on for AWS uses to connect. </p>',
        category: ["System Configuration"],
    },
    {
        id: "VC-AWS-2-awsiam",
        title: "Set Up AWS Identity Access Management -- IAM",
        "short-description":
            '<h4>Overview</h4><p>Correctly configuring the AWS IAM policy is required for ingesting the subsequent data streams into your Splunk environment.</p><h4>Implementation</h4><p>Splunk documentation contains comprehensive information on how to setup IAM roles in AWS, either for individual data sources or globally, for all AWS data sources. Please see <a title="Splunk Docs: Configure AWS Permissions" href="' +
            window.makeHelpLinkURL(
                "Splunk_Security_Essentials",
                "dataSource.addOns.released.aws.configureAwsPermissions5",
                "latest"
            ) +
            '">http://docs.splunk.com/Documentation/AddOns/released/AWS/ConfigureAWSpermissions</a> for detailed information.</p><h4>Create Splunk Access user</h4><p>Within the AWS IAM configuration menu, create a new user, splunk_access. Attach the SplunkAccess policy created in the previous step and grant the user only programmatic access. Once complete, download the user credentials, as shown in the screenshot below.<img src="%SSEDOCIMAGEPATH%/aws/aws-1-downloadiamkeys.png" title="A successfully created AWS IAM User, with the Download .csv link." /></p>',
        category: ["System Configuration"],
    },
    {
        id: "VC-AWS-3-awssns",
        title: "Set Up AWS Simple Notification Service -- SNS",
        "short-description":
            '<h4>Overview</h4><p>You need to grant permissions to the AWS accounts or EC2 IAM roles that the add-on uses to connect to the Amazon SNS API. See Configure AWS permissions for details.</p><h4>Implementation</h4><p>If you plan to use the Simple Queue Service (SQS) -based S3 input, you must enable Amazon S3 bucket events to send notification messages to an SQS queue whenever the events occur. For instructions on setting up S3 bucket event notifications, see the following AWS documentation pages: <ul><li><a title="AWS Docs: Set up Bucket Notifications" href="https://docs.aws.amazon.com/AmazonS3/latest/UG/SettingBucketNotifications.html">https://docs.aws.amazon.com/AmazonS3/latest/UG/SettingBucketNotifications.html</a></li><li><a title="AWS Docs: S3 Notifications" href="http://docs.aws.amazon.com/AmazonS3/latest/dev/NotificationHowTo.html">http://docs.aws.amazon.com/AmazonS3/latest/dev/NotificationHowTo.html</a></p>',
        category: ["System Configuration"],
    },
    {
        id: "VC-AWS-4-awssqs",
        title: "Set up AWS Simple Queueing Service - SQS",
        "short-description":
            '<h4>Overview</h4>\n<p>You need to grant permissions to the AWS accounts or EC2 IAM roles that the add-on uses to connect to the Amazon SQS API. See&nbsp;<a title="Splunk Docs: Configure AWS Permissions" href="' +
            window.makeHelpLinkURL(
                "Splunk_Security_Essentials",
                "dataSource.addOns.released.aws.configureAwsPermissions4",
                "latest"
            ) +
            '">Configure AWS permissions</a>&nbsp;for details.</p>\n<h4>Implementation</h4>\n<p>If you plan to use the SQS-based S3 input, you must perform the following:</p>\n<ul>\n  <li>Set up a dead-letter queue for the SQS queue to be used for the input for storing invalid messages. <a title="AWS Docs: SQS Dead Letter Queues" href="http://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html.">Read more about SQS dead-letter queues and how to configure them</a>.&nbsp; </li>\n  <li>Configure the SQS visibility timeout to prevent multiple inputs from receiving and processing messages in a queue more than once. We recommend that you set your SQS visibility timeout to 5 minutes or longer. If the visibility timeout for a message is reached before the message has been fully processed by the SQS-based S3 input, the message will reappear in the queue and will be retrieved and processed again, resulting in duplicate data.&nbsp;<a title="AWS Docs: SQS Visibility Timeouts" href="http:/docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html.">Read more about SQS visibility timeout and how to configure it</a>.&nbsp;</li>\n</ul>',
        category: ["System Configuration"],
    },
    {
        id: "VC-AWS-5-cloudtrail",
        title: "Set up AWS CloudTrail",
        "short-description":
            '<h4>Overview></h4>\n<p>Enabling AWS CloudTrail inputs into Splunk will allows you to record AWS API calls for your account and ingest the resulting dataset. This data can then be used for searching, visualization, and correlation.</p>\n<h4>Implementation</h4>\n<p>The Splunk Add-on for AWS collects events from an SQS that subscribes to the SNS notification events from CloudTrail. Configure CloudTrail to produce these notifications, then create an SQS in each region for the add-on to access them.</p>\n<ol>\n<li>Enable CloudTrail. <a title="AWS Docs: Update Cloudtrail Configurations" href="http://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-create-and-update-a-trail.html">Follow the instructions in the AWS documentation</a>.</li>\n<li>Create an S3 Bucket in which to store the CloudTrail events. Follow the <a title="AWS Docs: S3 Bucket Policy for CloudTrail" href="http://docs.aws.amazon.com/awscloudtrail/latest/userguide/create-s3-bucket-policy-for-cloudtrail.html">AWS documentation</a> to ensure the permissions for this bucket are correct. </li>\n<li>Enable SNS Notifications. See the <a title="AWS Docs: Getting Notifications" href="http://docs.aws.amazon.com/awscloudtrail/latest/userguide/getting_notifications_top_level.html">AWS documentation</a> for instructions.&nbsp; </li>\n<li>Create a new SQS.</li>\n<li>If you are in the China region, explicitly grant DeleteMessage and SendMessage permissions to the SQS you just created. This step is not necessary in commercial regions.</li>\n<li>Subscribe the SQS to the SNS Notifications that you enabled in step 3.</li>\n<li>Grant IAM permissions to access the S3 bucket and SQS to the AWS account that the add-on uses to connect to your AWS environment. See&nbsp;<a title="Splunk Docs: Configure AWS Permissions" href="' +
            window.makeHelpLinkURL(
                "Splunk_Security_Essentials",
                "dataSource.addOns.released.aws.configureAwsPermissions3",
                "latest"
            ) +
            '">Configure AWS Permissions</a>&nbsp;for details.</li>\n</ol>',
        category: ["System Configuration"],
    },
    {
        id: "VC-AWS-5-vpcflow",
        title: "Set up AWS VPC Flow",
        "short-description":
            '<h4>Overview></h4>\n<p>VPC Flow Logs provide a complete record of traffic into and out of your AWS environment. Several Splunk Security Essentials (SSE) searches leverage this data to give you deeper insights into the security posture of your environment.</p>\n <h4>Implementation</h4>\n<p>The CloudWatch service is automatically enabled to collect free metrics for your AWS services and requires no additional configuration for the Splunk Add-on for AWS. However, you do need to grant permissions to the AWS account(s) that the add-on uses to connect to the CloudWatch API. See&nbsp;<a title="Splunk Docs: Configure AWS Permissions" href="' +
            window.makeHelpLinkURL(
                "Splunk_Security_Essentials",
                "dataSource.addOns.released.aws.configureAwsPermissions2",
                "latest"
            ) +
            '">Configure AWS Permissions</a>&nbsp;for details. </p>\n<p>Ingesting data from CloudWatch Logs requires no additional configuration beyond that described in the AWS documentation. Similarly, VPC Flow Logs require no additional configuration for the Splunk Add-on for AWS, other than enabling them for your VPCs. However, you do need to grant permissions to the AWS account(s) that the add-on uses to connect to the VPC Flow Log groups and streams. See&nbsp;<a title="Splunk Docs: Configure AWS Permissions" href="' +
            window.makeHelpLinkURL(
                "Splunk_Security_Essentials",
                "dataSource.addOns.released.aws.configureAwsPermissions1",
                "latest"
            ) +
            '">Configure AWS Permissions</a>&nbsp;for details.</p>\n<p>See the <a title="AWS Docs: VPC Flow Logs" href="http://docs.aws.amazon.com/AmazonVPC/latest/UserGuide/flow-logs.html">AWS documentation</a> for information on how to enable flow logs for your VPCs and configure an IAM role for them.</p>',
        category: ["System Configuration"],
    },
    {
        id: "SC-AWS-1-WhereToCollect",
        title: "Where to Collect Logs From",
        "short-description":
            '<p>Pulling logs from AWS requires a web service. It is functionally very different from grabbing data from local logs    or events, since it must be configured via the Splunk Add-on for Amazon Web Services on a Splunk box with a web UI. It\'s deployed    in one of the following two ways:    <ol>        <li>Single instance: Splunk customers who have a smaller Splunk load that fits on a single system often add the Technology            Add-on (TA) to the same system. Sizing here is environment specific, so you will want to ensure adequate performance            (although this setup is usually quite workable in smaller environments). If you need to, you can always redo            the configuration later, using a dedicated heavy forwarder.</li>        <li>Heavy forwarder: In most environments, customers will install the TA on a dedicated heavy forwarder. A heavy forwarder            is just like a normal Splunk install (in effect, not a universal forwarder), but its only role is to pull in            data from special sources and send it to indexers.</li>    </ol></p><p>The Splunk Add-on for Amazon Web Services requires Internet connectivity to send queries to the AWS APIs. </p>\n<p>While, generally speaking, it is Splunk best practice to install TAs across all parts of your Splunk environment (particularly    props and transforms), in the case of the Splunk Add-on for Amazon Web Services, we will be reaching out to a cloud service, which    makes the configuration slightly different. We separate out installing the TA from configuring the inputs.    <br>\n    <p>        <strong>Configuring the inputs:</strong> You will only configure the inputs on one system in your environment, such as a        heavy forwarder or a single instance. (See &quot;Overview&quot; for more detail.)</p>\n    <p>        <strong>Installing the TA:</strong> The TA itself should reside wherever you configure the inputs (since the TA is the mechanism        that allows you to configure the inputs). If you have a larger or more advanced environment where you configure the        inputs on a heavy forwarder, you should also install the TA on your search heads, so you can see the Splunk Add-on for Amazon Web Services field        extractions. </p>\n    <p>        <em>Advanced tip: Hide the app on your search heads, so you don&rsquo;t accidentally reconfigure and duplicate your data            later. To do this, click the app dropdown on the upper left-hand corner of the screen, then select <b>Manage            Apps.</b> then <b>Edit Properties</b> next to the Splunk Add-on for Amazon Web Services. Next, click <b>Visible: No</b> and then save.</em>    </p>\n    <p>The following table provides a reference for installing this specific add-on to a distributed deployment of Splunk Enterprise:        </p>\n    <table class="table">\n     <thead>   <tr>\n            <th><strong>Splunk Platform Component</strong></th>\n  <th><strong>Supported?</strong></th>\n            <th><strong>Required</strong></th>\n </tr>\n </thead>       <tr>\n            <td>                <p>Search heads</p>            </td>\n            <td>                <p>Yes</p>            </td>\n            <td>                <p>Yes</p>            </td>\n </tr>\n        <tr>\n            <td>                <p>Heavy forwarders</p>            </td>\n            <td>                <p>Yes</p>            </td>\n            <td>                <p>Depends on size</p>            </td>\n </tr>\n        <tr>\n            <td>                <p>Indexers</p>            </td>\n            <td>                <p>Yes</p>            </td>\n            <td>                <p>No</p>            </td>\n </tr>\n        <tr>\n            <td>                <p>Universal forwarders</p>            </td>\n            <td>                <p>No</p>            </td>\n            <td>                <p>No</p>            </td>\n </tr>\n</table>',
        category: ["Splunk Configuration for Data Source"],
    },
    {
        id: "SC-AWS-2-InstallTA",
        title: "Installing the Technology Add-on -- TA",
        "short-description":
            '<p>Log into Splunk and click <b>Splunk Apps</b>.<img src="%SSEDOCIMAGEPATH%/stream/stream-1-splunkappslink.png"  title="Click Splunk Apps to find the AWS Add-on." /></p><p>Search for "Amazon Web Services Add-on." Click the <b>Install</b> button. <img src="%SSEDOCIMAGEPATH%/aws/aws-8-installaddon.png"  title="Search for Amazon Web Services Add-on in Apps" /></p><p>After installation, click <b>Restart Now.</b> <img src="%SSEDOCIMAGEPATH%/stream/stream-3-restartnow.png"  title="When asked, restart Splunk." /></p><p>Log back into Splunk and select the Splunk Add-on for Amazon Web Services app.</p><p><b>Splunk Cloud Customers</b>: you won\'t be copying any files or folders to your indexers or search heads, but good news! Even though the Amazon Web Services Add-on is not Cloud Self-Service Enabled, you will still be able to open a ticket with Cloud Ops and be ready to go in short order.</p>',
        category: ["Splunk Configuration for Data Source"],
    },
    {
        id: "SC-AWS-3-IndexesAndSourcetypes",
        title: "AWS Indexes and Sourcetypes",
        "short-description":
            '<h4>Overview</h4>\n<p>  Amongst Splunk&rsquo;s 15,000+ customers, we&rsquo;ve done a lot of implementations, and we&rsquo;ve learned a few things along the way. While you can use any sourcetypes or indices that you want in &ldquo;Splunk land,&rdquo;, we&rsquo;ve found that the most successful customers follow specific patterns, as it sets them up for success moving forward.</p>\n<h4>Implementation</h4>\n  <p>The most common relevant AWS data types to Splunk Security Essentials are CloudTrail and VPC Flow Logs, but there are many others available to you. The following is an overview of SSE-relevant AWS data types and the recommended indices and sourcetypes. Other AWS data sources are outlined in more detail later.</p>\n<table class="table" border="1" cellspacing="0" cellpadding="0" width="652">\n  <tr>\n    <td width="104" valign="top"><p><strong>Data source</strong></p></td>\n    <td width="208" valign="top"><p><strong>Description</strong></p></td>\n    <td width="198" valign="top"><p><strong>Sourcetype</strong></p></td>\n    <td width="142" valign="top"><p><strong>Index</strong></p></td>\n  </tr>\n  <tr>\n    <td width="104" valign="top"><p><strong>CloudTrail</strong></p></td>\n    <td width="208" valign="top"><p>AWS API call history from the AWS CloudTrail service.</p></td>\n    <td width="198" valign="top"><p>aws:cloudtrail </p></td>\n    <td width="142" valign="top"><p>awscloudtrail</p></td>\n  </tr>\n  <tr>\n    <td width="104" valign="top"><p><strong>CloudWatch Logs</strong></p></td>\n    <td width="208" valign="top"><p>VPC Flow Logs from the CloudWatch Logs service.</p></td>\n    <td width="198" valign="top"><p>aws:cloudwatchlogs:vpcflow </p></td>\n    <td width="142" valign="top"><p>awsflow</p></td>\n  </tr>\n</table>\n<p>To support your AWS data sources, follow the procedure mentioned above in &lt;a href=&quot;#AWS-IndexesAndSourcetypes&quot;&gt;AWS Indexes and Sourcetypes&lt;/a&gt; to add the new indices for the data you will be bringing in (it&rsquo;s generally easiest if you just create awscloudtrail, awsflow, awscloudwatch, etc). </p>\n<p>As mentioned, there are several other AWS data sources you could opt to bring in. If you wish to ingest those, here are our recommended sourcetypes for that data:</p>\n<table  class="table" border="1" cellspacing="0" cellpadding="0" width="482">\n  <tr>\n    <td width="76" valign="top"><p><strong>Data source</strong></p></td>\n    <td width="236" valign="top"><p><strong>Description</strong></p></td>\n    <td width="170" valign="top"><p><strong>Sourcetype</strong></p></td>\n  </tr>\n  <tr>\n    <td width="76" rowspan="2" valign="top"><p><strong>Config</strong></p></td>\n    <td width="236" valign="top"><p>Configuration snapshots and historical configuration data from   the AWS Config service</p></td>\n    <td width="170" valign="top"><p>aws:config </p></td>\n  </tr>\n  <tr>\n    <td width="236" valign="top"><p>Configuration change notifications from the AWS Config service</p></td>\n    <td width="170" valign="top"><p>aws:config:notification </p></td>\n  </tr>\n  <tr>\n    <td width="76" valign="top"><p><strong>Description</strong></p></td>\n    <td width="236" valign="top"><p>Descriptions of your AWS EC2 instances, reserved instances, and   EBS snapshots. Used to improve dashboard readability</p></td>\n    <td width="170" valign="top"><p>aws:description </p></td>\n  </tr>\n  <tr>\n    <td width="76" valign="top"><p><strong>Config Rules</strong></p></td>\n    <td width="236" valign="top"><p>Compliance details, compliance summary, and evaluation status of   your AWS Config rules </p></td>\n    <td width="170" valign="top"><p>aws:config:rule </p></td>\n  </tr>\n  <tr>\n    <td width="76" valign="top"><p><strong>Inspector</strong></p></td>\n    <td width="236" valign="top"><p>Assessment runs and findings data from the Amazon Inspector service</p></td>\n    <td width="170" valign="top"><p>aws:inspector </p></td>\n  </tr>\n  <tr>\n    <td width="76" valign="top"><p><strong>CloudTrail</strong></p></td>\n    <td width="236" valign="top"><p>AWS API call history from the AWS CloudTrail service</p></td>\n    <td width="170" valign="top"><p>aws:cloudtrail </p></td>\n  </tr>\n  <tr>\n    <td width="76" rowspan="2" valign="top"><p><strong>CloudWatch Logs</strong></p></td>\n    <td width="236" valign="top"><p>Data from the CloudWatch Logs service</p></td>\n    <td width="170" valign="top"><p>aws:cloudwatchlogs </p></td>\n  </tr>\n  <tr>\n    <td width="236" valign="top"><p>VPC Flow Logs from the CloudWatch Logs service</p></td>\n    <td width="170" valign="top"><p>aws:cloudwatchlogs:vpcflow </p></td>\n  </tr>\n  <tr>\n    <td width="76" valign="top"><p><strong>CloudWatch</strong></p></td>\n    <td width="236" valign="top"><p>Performance and billing metrics from the AWS CloudWatch service</p></td>\n    <td width="170" valign="top"><p>aws:cloudwatch </p></td>\n  </tr>\n  <tr>\n    <td width="76" valign="top"><p><strong>Billing</strong></p></td>\n    <td width="236" valign="top"><p>Billing reports that you have configured in AWS</p></td>\n    <td width="170" valign="top"><p>aws:billing </p></td>\n  </tr>\n  <tr>\n    <td width="76" rowspan="5" valign="top"><p><strong>S3</strong></p></td>\n    <td width="236" valign="top"><p>Generic log data from your S3 buckets</p></td>\n    <td width="170" valign="top"><p>aws:s3 </p></td>\n  </tr>\n  <tr>\n    <td width="236" valign="top"><p>S3 access logs</p></td>\n    <td width="170" valign="top"><p>aws:s3:accesslogs </p></td>\n  </tr>\n  <tr>\n    <td width="236" valign="top"><p>CloudFront access logs</p></td>\n    <td width="170" valign="top"><p>aws:cloudfront:accesslogs </p></td>\n  </tr>\n  <tr>\n    <td width="236" valign="top"><p>ELB access logs</p></td>\n    <td width="170" valign="top"><p>aws:elb:accesslogs </p></td>\n  </tr>\n  <tr>\n    <td width="236" valign="top"><p>CloudTrail data</p></td>\n    <td width="170" valign="top"><p>aws:cloudtrail </p></td>\n  </tr>\n  <tr>\n    <td width="76" valign="top"><p><strong>Kinesis</strong></p></td>\n    <td width="236" valign="top"><p>Data from Kinesis streams</p></td>\n    <td width="170" valign="top"><p>aws:kinesis </p></td>\n  </tr>\n  <tr>\n    <td width="76" valign="top"><p><strong>SQS</strong></p></td>\n    <td width="236" valign="top"><p>Generic data from SQS</p></td>\n    <td width="170" valign="top"><p>aws:sqs </p></td>\n  </tr>\n</table>',
        category: ["Splunk Configuration for Data Source"],
    },
    {
        id: "SC-AWS-4-accountconfig",
        title: "Configure AWS Account Information",
        "short-description":
            '<ol><li>The first step to configure the Splunk add-on for AWS to ingest data is to add the account created above. Go to Configuration > Account, and then click <b>Add</b>.<img src="%SSEDOCIMAGEPATH%/aws/aws-2-addconfiguration.png" title="From the AWS Add-on Configuration page, click Add." /></li><li>Supply the information, and click <b>Add</b>.<img src="%SSEDOCIMAGEPATH%/aws/aws-3-addaccountinfo.png" title="The Add Account pane. Provide the information, then click Add." /></li></ol>',
        category: ["Splunk Configuration for Data Source"],
    },
    {
        id: "SC-AWS-5-cloudtrailinput",
        title: "Configure CloudTrail Input",
        "short-description":
            '<h4>Overview</h4><p>After completing the above steps, configuring the data inputs within the Splunk interface is simple. The steps are outlined in more detail here.</p><h4>Implementation</h4><p>In the Splunk add-on for AWS, go to data inputs, and select <b>Create new input &gt; CloudTrail</b>.<img src="%SSEDOCIMAGEPATH%/aws/aws-4-addCloudTrail.png" title="From the Inputs page, click Create New Input - CloudTrail - CloudTrail." /></p><p>Select the desired configuration.<img src="%SSEDOCIMAGEPATH%/aws/aws-5-ConfigureAWSCloudtrail.png" title="Configure the new AWS CloudTrail Input." /></p><p>The Splunk add-on for AWS will subsequently ingest data from the configured AWS API endpoints, and perform the relevant field extractions and CIM data model mappings for use by the SSE app. You can always find more detail on configuration in our <a title="Splunk Docs: AWS Overview" href="' +
            window.makeHelpLinkURL(
                "Splunk_Security_Essentials",
                "dataSource.addOns.released.aws2",
                "latest"
            ) +
            '">docs</a>.</p><h4>Validation</h4><p>You can make sure that Splunk has begun ingesting the data from AWS by running Splunk searches. The Splunk add-on for AWS also has a built-in health-overview dashboard that will provide initial troubleshooting information.</p>',
        category: ["Splunk Configuration for Data Source"],
    },
    {
        id: "SC-AWS-5-vpcflowinput",
        title: "Configure VPC Flow Input",
        "short-description":
            '<h4>Overview</h4><p>After completing the above steps, configuring the data inputs within the Splunk interface is simple. The steps are outlined in more detail here.</p><p><b>Note:</b> we are following the non-Kinesis input, which works for small to medium environments. If you have a large AWS environment, we recommend configuring the (somewhat more complicated) Kinesis Firehose configuration. For more detail: <a title="Splunk Blogs: Kinesis Firehose" href="https://www.splunk.com/blog/2017/11/29/ready-set-stream-with-the-kinesis-firehose-and-splunk-integration.html">Click Here</a>.</p><h4>Implementation</h4><p>In the Splunk add-on for AWS, go to data inputs, and select <b>Create New Input > VPC Flow Logs > CloudWatch Logs.</b><img src="%SSEDOCIMAGEPATH%/aws/aws-6-addVPCFlow.png" title="Add a new VPC Flow Log Input." /></p><p>Choose the relevant regions and configurations for your environment.<img src="%SSEDOCIMAGEPATH%/aws/aws-7-ConfigureAWSVPCFlowInput.png" title="Configure the new AWS VPC Flow Input." /></p><p>The Splunk add-on for AWS will subsequently ingest data from the configured AWS API endpoints, and perform the relevant field extractions and CIM data model mappings for use by the SSE app. You can always find more detail on configuration in our <a title="Splunk Docs: AWS Overview" href="' +
            window.makeHelpLinkURL(
                "Splunk_Security_Essentials",
                "dataSource.addOns.released.aws1",
                "latest"
            ) +
            '">docs</a>.</p><h4>Validation</h4><p>You can make sure that Splunk has begun ingesting the data from AWS by running Splunk searches. The Splunk add-on for AWS also has a built-in health-overview dashboard that will provide initial troubleshooting information.</p>',
        category: ["Splunk Configuration for Data Source"],
    },
    {
        id: "SC-AWS-6-updateAWSApp",
        title: "(Optional) Update AWS App, If Used",
        "short-description":
            '<p>By default, the Splunk App for AWS and add-on send the data into the Splunk Main (default) index. From there, a saved search will run to populate the summary indices. The summary indices are used to populate the dashboards in the Splunk App for AWS. Sending data to custom indices will require making changes to the macros supporting this app. To modify this to meet Splunk best practices, follow these steps:<ol><li>Create a new index for AWS data.</li><li>Update the proper macros and make sure the saved searches are running to populate the summary indices. (See <a title="Splunk Docs: AWS Macros" href="' +
            window.makeHelpLinkURL(
                "Splunk_Security_Essentials",
                "datasource.aws.installation.Macros",
                "latest"
            ) +
            '">http://docs.splunk.com/Documentation/AWS/5.0.2/Installation/Macros</a>)</li><li>Make sure the saved searches are running properly. (See <a title="Splunk Docs: AWS Saved Searches" href="' +
            window.makeHelpLinkURL(
                "Splunk_Security_Essentials",
                "dataSource.aws.installation.savedSearches",
                "latest"
            ) +
            '">http://docs.splunk.com/Documentation/AWS/5.0.2/Installation/Savedsearches</a>)</li></ol></p>\n',
        category: ["Splunk Configuration for Data Source"],
    },
    {
        id: "VC-General-1-syslogoverview",
        title: "Syslog Overview",
        "short-description":
            "<p>While Splunk can receive syslog messages directly from syslog devices like Cisco ASA, Palo Alto Networks, and others, this is not a best practice for production deployments. Using a separate syslog server allows for less impact to Splunk configuration reloads (which take longer and are more frequent), along with leveraging best of breed tools. We recommend either utilizing an existing syslog server or deploying one, such as rsyslog or syslog-ng on Linux, or Kiwi Syslog Server on Windows. There are many example configurations available for ingesting data with any of these technologies, but for convenience we will provide detailed setup instructions for setting up rsyslog on Linux to ingest data for Splunk in line with our best practices.</p><p>Rsyslog server that writes files per source-type to disk, place file .conf in /etc/rsyslog.d/ with a config to receive logs over UDP. Logrotate should be configured on this server to prevent logs from flooding the disk. We will also walk through configuring the Splunk Universal Forwarder on this rsyslog server with to forward logs to Splunk.</p><p><b>If you are setting this up in a lab</b> and just want to get started quickly, you can follow the online documentation about ingesting data directly into Splunk via syslog.</p>",
        category: ["System Configuration"],
    },
    {
        id: "VC-PAN-2-rsyslog-config",
        title: "Configuring rsyslog",
        "short-description":
            '<h4>Overview</h4><p>Before we configure the Palo Alto Networks device, we need to setup a rsyslog server. The supplied config assumes a "vanilla" install of rsyslog. If you already have a rsyslog server in place, you need to validate this config for your deployment.</p><h4>Implementation</h4><p>Many customers have experienced issues, as the version of rsyslog shipped with RHEL and Ubuntu is out of date and no longer supported.  Run <b>rsyslogd -version</b> and validate that it is running a version higher than or equal to 8.32.0:<img src="%SSEDOCIMAGEPATH%/pan/pan-1-rsyslog.png" title="rsyslog version of at least 8.32.0." /></p><p>If the version is not higher or equal to 8.32.0-even after updating your distribution-please add the rsyslog repositories to your distribution and update again. These repos can be found here:<ul><li><a title="rsyslog: Install on RHEL" href="http://www.rsyslog.com/rhelcentos-rpms/">http://www.rsyslog.com/rhelcentos-rpms/</a></li><li><a title="rsyslog Docs: Ubuntu Docs" href="http://www.rsyslog.com/ubuntu-repository/">http://www.rsyslog.com/ubuntu-repository/</a></li></ul></p><p>Install rsyslog  server on your choice of Linux flavors using the appropriate command, i.e., Yum install rsyslog or apt-get install rsyslog. Some distributions come with rsyslog preinstalled.  Make sure that your /etc/rsyslog.conf has a rule that reads $IncludeConfig /etc/rsyslog.d/*.conf.</p><p>Copy the following two files into /etc/rsyslog.d/ -- we recommend calling them file splunk.conf and splunk-pan.conf. splunk.conf will contain all of the global rsyslog configurations, splunk-pan.conf contains all of the Palo Alto Networks specific configurations.</p><pre filename="splunk.conf" class="codeSample"># Provides UDP syslog reception, leave these out if your server is already listening to a network port for receiving syslog.\n# for parameters see http://www.rsyslog.com/doc/imudp.html\n# alternatively these can be commented out from /etc/rsyslog.conf\nmodule(load="imudp") # needs to be done just once\ninput(type="imudp" port="514")\n \n# Provides TCP syslog reception Optional; in case you would like to use TCP as a preferred transport mechanism.\n# for parameters see http://www.rsyslog.com/doc/imtcp.html\n# module(load="imtcp") # needs to be done just once\n# input(type="imtcp" port="514")\n</pre><pre filename="splunk-pan.conf" class="codeSample"># The purpose of this config is to receive data from a Palo Alto Networks device on a vanilla rsyslog environment\n# and stage it for a Splunk universal forwarder\n# For an existing server read the comments\n# 2018-26-01 Filip Wijnholds fwijnholds@splunk.com\nmodule(load="builtin:omfile")\n$Umask 0022\n# If you are running Splunk in limited privilege mode, make sure to configure the file ownership:\n# $FileOwner splunk\n# $FileGroup splunk\n \n \n#Filters Data and writes to files per Sourcetype:\n#Palo alto knows different sourcetypes, this creates file a per sourcetype per host per day.\n$template threat,"/var/log/rsyslog/pan/threat/%HOSTNAME%-%timegenerated:::date-strftime(%S)%.log"\n$template traffic,"/var/log/rsyslog/pan/traffic/%HOSTNAME%-%timegenerated:::date-strftime(%S)%.log"\n$template system,"/var/log/rsyslog/pan/system/%HOSTNAME%.log"\n$template config,"/var/log/rsyslog/pan/config/%HOSTNAME%.log"\n$template hipmatch,"/var/log/rsyslog/pan/hipmatch/%HOSTNAME%.log"\n$template endpoint,"/var/log/rsyslog/pan/endpoint/%HOSTNAME%.log"\n$template wildfire,"/var/log/rsyslog/pan/wildfire/%HOSTNAME%.log"\n$template correlation,"/var/log/rsyslog/pan/correlation/%HOSTNAME%.log"\n$template aperture,"/var/log/rsyslog/pan/aperture/%HOSTNAME%.log"\n \n#Looks for sourcetypes in the data, to\n:msg, contains, "THREAT" ?threat\n:msg, contains, "TRAFFIC" ?traffic\n:msg, contains, "SYSTEM" ?system\n:msg, contains, "CONFIG" ?config\n:msg, contains, "HIPMATCH" ?hipmatch\n:msg, contains, "ENDPOINT" ?endpoint\n:msg, contains, "WILDFIRE" ?wildfire\n:msg, contains, "CORRELATION" ?correlation</pre><p>Restart the rsyslog service by running: sudo service rsyslog restart</p><h4>Validation</h4><p>After the daemon is restarted and traffic is sent to rsyslog, you should see at least directories being created:<ul><li>/var/logs/rsyslog/pan/<Firewall Hostname>/traffic/</li><li>/var/logs/rsyslog/pan/<Firewall Hostname>/threat/</li></ul></p>',
        category: ["System Configuration"],
    },
    {
        id: "VC-PAN-3-logrotate",
        title: "Configuring logrotate",
        "short-description":
            '<h4>Overview</h4><p>With the above configuration, we will be able to receive data via UDP syslog from our PAN device. However, left to its own whims, rsyslog would fill up all the disk space available to it -- not desireable. The most common way to handle this is to use logrotate, which is ubiquitous on Linux. The below configuration will automatically rotate all of your PAN log files every day, compress the older ones, and then delete the oldest files.</p><h4>Implementation</h4><p>Create a file called splunk-pan in the logrotate directory /etc/logrotate.d/ with the following contents, or just click download below.</p><pre filename="splunk-pan" class="codeSample">/var/log/rsyslog/pan/*/*.log\n{\n    daily\n    compress\n    delaycompress\n    rotate 3\n    ifempty\n    maxage 4\n    nocreate\n    missingok\n    sharedscripts\n    postrotate\n        /bin/kill -HUP `cat /var/run/syslogd.pid 2> /dev/null` 2> /dev/null || true\n    endscript\n}</pre><p>For 99.9% of environmemts, you should be set now, as logrotate will run regularly. If you don\'t see the log files being rotated (see Validation below), you may fall into the 0.01% of environments where you need to configure logrotate to run. The easy way to do this is using crontab (another of those ubiquitous Linux tools).</p><p>To edit your crontab, from the terminal run: crontab -e. For a daily schedule that rolls the log at midnight, the following cron job will do:<pre>0 0 * * * root logrotate -f /etc/logrotate.d/splunk-pan</pre></p><p>If you are unfamiliar with cron and want a different schedule, visit this website: <a title="Crontab Docs" href="https://crontab.guru/#0_0_*_*_*">https://crontab.guru/#0_0_*_*_*</a>.</p><h4>Implementation</h4><p>After 24 hours you should see a .1 appended to the log files when you run: ls -l /var/log/rsyslog/pan/<Firewall Hostname>/traffic/:<img src="%SSEDOCIMAGEPATH%/pan/pan-2-logrotate.png" title="Successful file rotation." /></p>',
        category: ["System Configuration"],
    },
    {
        id: "VC-PAN-4-enablesyslog",
        title: "Enable Syslog in PAN Management",
        "short-description":
            '<h4>Overview</h4><p>To leverage uses cases in Splunk Security Essentials (SSE), we must first get the data from the firewall to our syslog server.</p><h4>Implementation</h4><p>First, we must create a server syslog profile. Do so by navigating to Device -> Server Profiles -> syslog and click <b>add.</b> Give your server a name and add the IP address or FQDN in the Syslog Server field and change the port (if it differs on your deployment).<img src="%SSEDOCIMAGEPATH%/pan/pan-3-syslogserver.png" title="Configuration of a syslog destination inside of PAN Management." /></p><p>Under Device -> Log Settings, find the system box and select every topic of your interest. Next, and add the syslog profile for the configured syslog server.</p><p>Now find the HIP Match box, and click the gear icon: <img src="%SSEDOCIMAGEPATH%/pan/pan-4-gearicon.png" /> Select the server profile you configured for syslog, per the screenshot below.<img src="%SSEDOCIMAGEPATH%/pan/pan-5-HIPMatch.png" title="Configure Syslog Out for HIP Match." /></p><p>Do the same for config.<img src="%SSEDOCIMAGEPATH%/pan/pan-6-config.png" title="Configure Syslog Out for Config." /></p><p>Now that we\'ve configured the high level syslog destination, we need to configure the actual profile. You can do this under Object -> Log Forwarding and click <b>add.</b><img src="%SSEDOCIMAGEPATH%/pan/pan-7-syslogprofile.png" title="Configure a syslog profile under Object -> Log Forwarding." /></p><p>You\'re almost there! You\'ve now got the device all set up to send syslog out, all you have to do now is actually configure the rules so that the device will know when to send. Navigate to policies -> Security and select the policy you are interested in. You\'ll have to configure the syslog profile for each rule, per the screenshot below.<img src="%SSEDOCIMAGEPATH%/pan/pan-8-rulelogconfig.png" title="On a rule-by-rule basis, you can enable logging by clicking the Actions tab, and then configuring forwarding." /></p><p>Great! You\'ve got everything configured. As with all PAN policy changes though, don\'t forget to commit before you sip your victory coffee.</p><h4>Validation</h4><p>Perform the following search on your Splunk instance: <pre>index=* sourcetype=pan* | stats count by sourcetype index</pre></p><p>This should return something similar to the screenshot below.<img src="%SSEDOCIMAGEPATH%/pan/pan-9-validation.png" title="Logs are present in Splunk!" /></p>',
        category: ["System Configuration"],
    },
    {
        id: "SC-PAN-1-SizingEstimate",
        title: "PAN Sizing Estimate",
        "short-description":
            "<p>There is a wild amount of variability in the size for Palo Alto Networks logs. Each message is typically around 850 bytes and we typically see one message per connection (as we recommend logging allows, along with denies). The volume then depends on the size of your PAN device and can be in the hundreds of MB/day for a branch office, all the way to north of 250 GB/day for a main datacenter cluster.</p><p>Using only Palo Alto's built-in tools, the <b>show session info</b> command will tell you how many connections there have been since bootup. So, one way of estimating event volume is to check that number at the same time on subsequent days and then calculate the number of connections you typically see per day. When multiplied by the general 850 byte number, you will get a decent expectation for data size. </p><p>Another common approach is to implement the rsyslog config referenced above and then track the size of the files created on disk, to determine volume.</p>",
        category: ["Splunk Configuration for Data Source"],
    },
    {
        id: "SC-PAN-2-InstallTA",
        title: "Installing the Technology Addon -- TA",
        "short-description":
            '<h4>Overview</h4><p>Splunk has a detailed technology add-on that supports ingesting all the different data types generated by your Palo Alto Next-Generation Firewall. Like all Splunk technology add-ons, it also includes everything needed to parse out the fields and give them names that are compliant with Splunk\'s Common Information Model, so they can easily be used by the searches in Splunk Security Essentials-along with searches you will find in other community-supported and premium apps.</p><h4>Implementation</h4><p>Find the TA along with all your other Splunk apps and needs on SplunkBase. You can visit <a title="Splunkbase" href="https://splunkbase.splunk.com/">https://splunkbase.splunk.com/</a> and search for it or you could just follow the direct link: <a title="Splunkbase: Palo Alto Networks Add-on" href="https://splunkbase.splunk.com/app/2757/">https://splunkbase.splunk.com/app/2757/</a></p><p>As with all Splunk TAs, we recommend you deploy it to all parts of your Splunk environment, for simplicity and uniformity. To install the app, start by downloading the file from the SplunkBase location just shown, and then extract it into the apps folder. On Windows systems, this will be %SPLUNK_HOME%\\etc\\apps folder, or usually C:\\Program Files\\Splunk\\etc\\apps. On Linux systems, this will be $SPLUNK_HOME/etc/apps, or usually /opt/splunk/etc/apps.</p><h4>Validation</h4><p>You can make sure that Splunk has picked up the presence of the app by running $SPLUNK_HOME/bin/splunk display app (or on Windows, %SPLUNK_HOME%\\bin\\splunk display app), will, after asking you to log in, provide you with a list of installed apps. Most likely, if you see the folder listed alongside the other apps (learned, search, splunk_httpinput, etc.) you will know that it\'s there successfully.</p><p><b>Splunk Cloud Customers</b>: you won\'t be copying any files or folders to your indexers or search heads, but good news! The Palo Alto Networks add-on is Cloud Self-Service Enabled. So you can just got to Find Apps, and be up and running in seconds.</p>',
        category: ["Splunk Configuration for Data Source"],
    },
    {
        id: "SC-PAN-3-IndexesAndSourcetypes",
        title: "PAN Indexes and Sourcetypes",
        "short-description":
            '<h4>Overview</h4>\n<p>  Amongst Splunk&rsquo;s 15,000+ customers, we&rsquo;ve done a lot of implementations, and we&rsquo;ve learned a few things along the way. While you can use any sourcetypes or indices that you want in &ldquo;Splunk land,&rdquo;, we&rsquo;ve found that the most successful customers follow specific patterns, as it sets them up for success moving forward.</p>\n<h4>Implementation</h4><p>The PAN Firewall uses six different sourcetypes. Best practice dictates that sourcetypes that fit a specific data model go in to a separate index, per the table below.</p><table  class="table" border="1" cellspacing="0" cellpadding="0">\n  <tr>\n    <td width="312" valign="top"><p>pan:threat</p></td>\n    <td width="312" valign="top"><p>netproxy</p></td>\n  </tr>\n  <tr>\n    <td width="312" valign="top"><p>pan:traffic</p></td>\n    <td width="312" valign="top"><p>netfw</p></td>\n  </tr>\n  <tr>\n    <td width="312" valign="top"><p>pan:system</p></td>\n    <td width="312" valign="top"><p>netops</p></td>\n  </tr>\n  <tr>\n    <td width="312" valign="top"><p>pan:config</p></td>\n    <td width="312" valign="top"><p>netops</p></td>\n  </tr>\n  <tr>\n    <td width="312" valign="top"><p>pan:hipmatch</p></td>\n    <td width="312" valign="top"><p>epintel</p></td>\n  </tr>\n  <tr>\n    <td width="312" valign="top"><p>pan:endpoint</p></td>\n    <td width="312" valign="top"><p>epintel</p></td>\n  </tr>\n  <tr>\n    <td width="312" valign="top"><p>pan:correlation</p></td>\n    <td width="312" valign="top"><p>netintel</p></td>\n  </tr>\n  <tr>\n    <td width="312" valign="top"><p>pan:aperture</p></td>\n    <td width="312" valign="top"><p>netintel</p></td>\n  </tr>\n  <tr>\n    <td width="312" valign="top"><p>pan:wildfire</p></td>\n    <td width="312" valign="top"><p>epintel</p></td>\n  </tr>\n</table>',
        category: ["Splunk Configuration for Data Source"],
    },
    {
        id: "SC-PAN-4-inputsconf",
        title: "PAN Inputs",
        "short-description":
            '<h4>Overview</h4><p>Configuration files for PAN inputs tend to be pretty simple. In this case, we just have a single inputs.conf file that will go on the syslog server you will be monitoring. As detailed above in <a href="#Instruction_Expectations_and_Scaling">Instruction Expectations and Scaling</a>, you will need some mechanism to distribute these files to the hosts you\'re monitoring. For initial tests or deployments to only your most sensitive systems, it is easy to copy the files to the hosts. For larger distributions, you can use the Splunk deployment server or another code-distribution system, such as SCCM, Puppet, Chef, Ansible, or others.</p><h4>Implementation</h4><p>Distribute the below inputs.conf file to the Universal Forwarder installed on your syslog server (only where you actually have the rsyslog information). You should create a "local" folder inside of the TA folder. For most customers, the path to this file will end up being /opt/splunk/etc/apps/Splunk_TA_paloalto/local/inputs.conf (or on Windows, C:\\Program Files\\Splunk\\etc\\apps\\Splunk_TA_paloalto\\local\\inputs.conf. You can click Download File below to grab the file.</p><pre filename="inputs.conf" class="codeSample">[monitor:///var/log/rsyslog/pan/traffic/*.log]\nhost_regex = traffic/(.*?)-\\d+.log$\nsourcetype = pan:traffic\nindex = netfw\ndisabled = 0\n\n[monitor:///var/log/rsyslog/pan/threat/*.log]\nhost_regex = threat/(.*?)-\\d+.log$\nsourcetype = pan:threat\nindex = netproxy\ndisabled = 0\n\n[monitor:///var/log/rsyslog/pan/system/*.log]\nhost_regex = system/(.*?)-\\d+.log$\nsourcetype = pan:system\nindex = netops\ndisabled = 0\n\n\n[monitor:///var/log/rsyslog/pan/config/*.log]\nhost_regex = config/(.*?)-\\d+.log$\nsourcetype = pan:config\nindex = netops\ndisabled = 0\n\n[monitor:///var/log/rsyslog/pan/hipmatch/*.log]\nhost_regex = hipmatch/(.*?)-\\d+.log$\nsourcetype = pan:hipmatch\nindex = epintel\ndisabled = 0\n\n[monitor:///var/log/rsyslog/pan/endpoint/*.log]\nhost_regex = endpoint/(.*?)-\\d+.log$\nsourcetype = pan:endpoint\nindex = epintel\ndisabled = 0\n\n[monitor:///var/log/rsyslog/pan/correlation/*.log]\nhost_regex = correlation/(.*?)-\\d+.log$\nsourcetype = pan:correlation\nindex = pan\ndisabled = 0\n\n[monitor:///var/log/rsyslog/pan/aperture/*.log]\nhost_regex = aperture/(.*?)-\\d+.log$\nsourcetype = pan:aperture\nindex = pan\ndisabled = 0\n\n[monitor:///var/log/rsyslog/pan/wildfire/*.log]\nhost_regex = wildfire/(.*?)-\\d+.log$\nsourcetype = pan:wildfire\nindex = epintel\ndisabled = 0</pre>',
        category: ["Splunk Configuration for Data Source"],
    },
    {
        id: "VC-ASA-2-rsyslog-config",
        title: "Configuring rsyslog",
        "short-description":
            '<h4>Overview</h4><p>Before we configure the Cisco ASA device, we need to setup a rsyslog server. The supplied config assumes a "vanilla" install of rsyslog. If you already have a rsyslog server in place, you need to validate this config for your deployment.</p><h4>Implementation</h4><p>Many customers have experienced issues, as the version of rsyslog shipped with RHEL and Ubuntu is out of date and no longer supported.  Run <b>rsyslogd -version</b> and validate that it is running a version higher than or equal to 8.32.0:<img src="%SSEDOCIMAGEPATH%/pan/pan-1-rsyslog.png" title="rsyslog version of at least 8.32.0." /></p><p>If the version is not higher or equal to 8.32.0-even after updating your distribution-please add the rsyslog repositories to your distribution and update again. These repos can be found here:<ul><li><a title="rsyslog Docs: RHEL Installation" href="http://www.rsyslog.com/rhelcentos-rpms/">http://www.rsyslog.com/rhelcentos-rpms/</a></li><li><a title="rsyslog Docs: Ubuntu Installation" href="http://www.rsyslog.com/ubuntu-repository/">http://www.rsyslog.com/ubuntu-repository/</a></li></ul></p><p>Install rsyslog  server on your choice of Linux flavors using the appropriate command, i.e., Yum install rsyslog or apt-get install rsyslog. Some distributions come with rsyslog preinstalled.  Make sure that your /etc/rsyslog.conf has a rule that reads $IncludeConfig /etc/rsyslog.d/*.conf.</p><p>Copy the following two files into /etc/rsyslog.d/ -- we recommend calling them file splunk.conf and splunk-cisco_asa.conf. splunk.conf will contain all of the global rsyslog configurations, splunk-cisco_asa.conf contains all of the Cisco ASA specific configurations.</p><pre filename="splunk.conf" class="codeSample"># Provides UDP syslog reception, leave these out if your server is already listening to a network port for receiving syslog.\n# for parameters see http://www.rsyslog.com/doc/imudp.html\n# alternatively these can be commented out from /etc/rsyslog.conf\nmodule(load="imudp") # needs to be done just once\ninput(type="imudp" port="514")\n \n# Provides TCP syslog reception Optional; in case you would like to use TCP as a preferred transport mechanism.\n# for parameters see http://www.rsyslog.com/doc/imtcp.html\n# module(load="imtcp") # needs to be done just once\n# input(type="imtcp" port="514")\n</pre><pre filename="splunk-cisco_asa.conf" class="codeSample"># Rsyslog configuration file\n# The purpose of this config is to receive data from a Cisco ASA firewall on a vanilla rsyslog environment\n# and stage it for a Splunk universal forwarder\n# For an existing server read the comments\n# 2018-26-01 Filip Wijnholds fwijnholds@splunk.com\n# 2018-30-01 Modified for Cisco ASA - Kyle Champlin kchamplin@splunk.com\n\n\nmodule(load="builtin:omfile")\n$Umask 0022\n# If you are running Splunk in limited privilege mode, make sure to configure the file ownership:\n# $FileOwner splunk\n# $FileGroup splunk\n \n#Filters Data and writes to files per Sourcetype:\n$template asa,"/var/log/rsyslog/cisco/asa/%HOSTNAME%-%$MINUTE%.log"\n\n\n#From splunk transforms.conf in Cisco ASA TA\n#[force_sourcetype_for_cisco_asa]\n#DEST_KEY = MetaData:Sourcetype\n#REGEX = %ASA-\\d-\\d{6}\n#FORMAT = sourcetype::cisco:asa\n\n#Looks for sourcetypes in the data, to\n:msg, regex, "%ASA-\\d-\\d{6}" ?asa</pre></p><p>Restart the rsyslog service by running: sudo service rsyslog restart</p><h4>Validation</h4><p>After the daemon is restarted and traffic is sent to rsyslog, you should see at least this directory being created:<ul><li>/var/logs/rsyslog/cisco/asa/</li></ul></p>',
        category: ["System Configuration"],
    },
    {
        id: "VC-ASA-3-logrotate",
        title: "Configuring logrotate",
        "short-description":
            '<h4>Overview</h4><p>With the above configuration, we will be able to receive data via UDP syslog from our Cisco ASA device. However, left to its own whims, rsyslog would fill up all the disk space available to it -- not desireable. The most common way to handle this is to use logrotate, which is ubiquitous on Linux. The below configuration will automatically rotate all of your Cisco ASA log files every day, compress the older ones, and then delete the oldest files.</p><h4>Implementation</h4><p>Create a file called splunk-ciscoasa in the logrotate directory /etc/logrotate.d/ with the following contents, or just click download below.</p><pre filename="splunk-ciscoasa" class="codeSample">/var/log/rsyslog/cisco/asa/*.log\n{\n    daily\n    compress\n    delaycompress\n    rotate 3\n    ifempty\n    maxage 4\n    nocreate\n    missingok\n    sharedscripts\n    postrotate\n        /bin/kill -HUP `cat /var/run/syslogd.pid 2> /dev/null` 2> /dev/null || true\n    endscript\n}</pre><p>For 99.9% of environmemts, you should be set now, as logrotate will run regularly. If you don\'t see the log files being rotated (see Validation below), you may fall into the 0.01% of environments where you need to configure logrotate to run. The easy way to do this is using crontab (another of those ubiquitous Linux tools).</p><p>To edit your crontab, from the terminal run: crontab -e. For a daily schedule that rolls the log at midnight, the following cron job will do:<pre>0 0 * * * root logrotate -f /etc/logrotate.d/splunk-ciscoasa</pre></p><p>If you are unfamiliar with cron and want a different schedule, visit this website: <a title="Crontab Docs" href="https://crontab.guru/#0_0_*_*_*">https://crontab.guru/#0_0_*_*_*</a>.</p><h4>Implementation</h4><p>After 24 hours you should see a .1 appended to the log files when you run: ls -l /var/log/rsyslog/cisco/asa/</p>',
        category: ["System Configuration"],
    },
    {
        id: "VC-ASA-4-enablesyslog",
        title: "General Logging Configuration for Cisco ASA",
        "short-description":
            '<p>The Cisco ASA should utilize TCP as the syslog transport and will maintain an open TCP port with the rsyslog server. Note: A load balancer must not be placed between the ASA and the syslog server.</p><p><b>DNS Prerequisites:</b><ul><li>For each IP address assigned for management of the ASA, ensure both A and R records exist and match</li><li>For each egress NAT address assigned to the device, ensure A and R records exist and match</li><li>For each ingress NAT address assigned to the device, ensure the R record matches the internal destination A. The A record for this IP is not required (might cause communication issues)</li></ul></p><p>Update the ASA configuration to direct syslog messages to the rsyslog server. You can do this either via the <a title="Cisco ASA Docs" href="https://www.cisco.com/c/en/us/support/docs/security/pix-500-series-security-appliances/63884-config-asa-00.html#anc6">command line</a> or via the Cisco Adaptive Security Device Manager (ASDM)-IPS Device Manager (IDM) GUI.</p><p>Here is an example of the Cisco Logging Configuration -- click to zoom in:<img src="%SSEDOCIMAGEPATH%/asa/asa-1-ciscoasalogging.png" zoomin="true" style="width: 1000px"  title="Cisco ASA Logging Setup Configuration" /></p><p>Here is an example of the Cisco Syslog Server Configuration -- click to zoom in:<img src="%SSEDOCIMAGEPATH%/asa/asa-2-ciscoasasyslogserver.png" zoomin="true" style="width: 1000px"  title="Cisco ASA Syslog Server Configuration" /></p>\n',
        category: ["System Configuration"],
    },
    {
        id: "VC-ASA-5-ruleconfiguration",
        title: "Enable Logging of Events",
        "short-description":
            '<p>Cisco ASA provides many configuration options for logging and thus can dictate how much visibility you have on your network. Generally speaking, the following are best practices for balancing between load on the system, logging fidelity, and data volume.</p><p><strong>All</strong>\n<ul>\n  <ul>\n    <li>Review and implement <a title="Cisco ASA Docs: Firewall Best Practices" href="https://www.cisco.com/c/en/us/about/security-center/firewall-best-practices.html">Cisco Firewall Best Practices Guide</a>\'s critical sections</li>\n    <li>Ensure network time protocol is synchronized with your company\'s standard server. If a standard does not exist, create one before continuing</li>\n    <li>If Terminal Access Controller Access Control System+ is utilized, ensure that command accounting is enabled.</li>\n    <li>Logging Level:</li>\n    <ul>\n      <li>&quot;Level 6 (informational)&quot; is a good option, but can be chatty</li>\n      <li>Reference for examples of logs you\'ll see at each level:&nbsp;<a title="Cisco Security Log Levels" href="http://www.cisco.com/c/en/us/td/docs/security/asa/syslog-guide/syslogs/logsevp.html">http://www.cisco.com/c/en/us/td/docs/security/asa/syslog-guide/syslogs/logsevp.html</a></li>\n    </ul>\n  </ul>\n</ul>\n  </p>\n<p><strong>Specific Subsystem Logging Levels </strong>\n<ul>\n  <li>Edge Firewall:</li>\n  <ul>\n    <li>Ensure the default deny rule from external interface is <strong>not</strong> configured to log</li>\n    <li>Ensure the inbound allow rule for well-known servers (public web, SMTP, VPN, DNS) is <strong>not </strong>configured to log<br>\n    </li>\n  </ul>\n  <li>Border Firewall:</li>\n  <ul>\n    <li>Ensure the default deny rule is configured to log in <strong>all directions</strong></li>\n    <li>Configure rule logging</li>\n    <li>Ensure ICMP egress is logged</li>\n    <li>Ensure egress for the following protocols are <strong>not logged from specifically authorized servers</strong>:</li>\n    <ul>\n      <li>HTTP(s) from web proxy servers</li>\n      <li>SMTP from email gateway servers</li>\n      <li>DNS from internal recursion servers<br>\n      </li>\n    </ul>\n    <li>Ensure ingress for the following protocols are <strong>not logged to specifically authorized servers:<u></u></strong></li>\n    <ul>\n      <li>HTTP(s) web servers</li>\n      <li>DNS authoritative servers</li>\n      <li>SMTP to email gateway servers</li>\n    </ul>\n  </ul>\n  <li>VPN</li>\n  <ul>\n    <li>Ensure all authentication and tunnel status events are logged for <strong>accept and failure</strong></li>\n    <li>Ensure all user names are logged without masking</li>\n    <li>Ensure ingress/egress rules are logged except the following:</li>\n    <ul>\n      <li>Traffic to the web proxy</li>\n      <li>Traffic to the internal DNS servers</li>\n    </ul>\n  </ul>\n</ul>\n    </p><p>Here is an example of the Cisco Logging Filters Configuration -- click to zoom in:<img src="%SSEDOCIMAGEPATH%/asa/asa-3-ciscoasaloggingfilters.png" zoomin="true" style="width: 1000px"   title="Cisco ASA Logging Filters Configuration" /></p><p>Here is an example of the Cisco Access Rules Logging Configuration -- click to zoom in:<img src="%SSEDOCIMAGEPATH%/asa/asa-4-ciscoasaaccessruleslogging.png" zoomin="true" style="width: 1000px" title="Cisco ASA Access Rules Logging Configuration" /></p>\n',
        category: ["System Configuration"],
    },
    {
        id: "SC-ASA-1-SizingEstimate",
        title: "Sizing Estimate",
        "short-description":
            '<p>There is a wide amount of variability in the size of Cisco ASA logs. Each firewall message is typically around 230 bytes. We typically see one message per connection (we recommend logging allowed connections, along with denied connections). The volume depends on the size of your ASA device. It can be +/- 10MB/day for a branch office to north of 50 GB/day for a main datacenter cluster. </p><p>Using only Cisco\'s built-in tools, the <b> show ip inspect statistics</b> command will tell you how many connections there have been since last reset. So, one way of estimating event volume is to check that number at the same time on subsequent days and then calculate the number of connections you typically see per day. When multiplied by the general 230 byte number, you will get a decent expectation for data size.</p><p>Another common approach is to implement the rsyslog configuration referenced above and then track the size of the files created on disk to determine volume.</p><p>These estimates are predicated on logging configuration of "level 6 (informational)," which is detailed later in "Cisco ASA Configuration:"<ul><li>Edge firewall: Negligible</li><li>Zone-based firewall: 230 bytes per event</li><li>VPN Services: 10 kb per session, plus firewall activity</li><li>Operational: Variable, but typically < 200 MB per day, per Cisco ASA</li></ul></p>\n',
        category: ["Splunk Configuration for Data Source"],
    },
    {
        id: "SC-ASA-2-InstallTA",
        title: "Install the Cisco ASA Technology Addon -- TA",
        "short-description":
            '<h4>Overview</h4><p>Splunk has a detailed technology add-on that supports ingesting all the different data types generated by your Cisco ASA Firewall. Like all Splunk technology add-ons, it also includes everything needed to parse out the fields and give them names that are compliant with Splunk\'s Common Information Model, so they can easily be used by the searches in Splunk Security Essentials-along with searches you will find in other community-supported and premium apps.</p><h4>Implementation</h4><p>Find the TA along with all your other Splunk apps and needs on SplunkBase. You can visit <a title="Splunkbase" href="https://splunkbase.splunk.com/">https://splunkbase.splunk.com/</a> and search for it or you could just follow the direct link: <a title="Splunkbase: Cisco ASA" href="https://splunkbase.splunk.com/app/1620/">https://splunkbase.splunk.com/app/1620/</a></p><p>As with all Splunk TAs, we recommend you deploy it to all parts of your Splunk environment, for simplicity and uniformity. To install the app, start by downloading the file from the SplunkBase location just shown, and then extract it into the apps folder. On Windows systems, this will be %SPLUNK_HOME%\\etc\\apps folder, or usually C:\\Program Files\\Splunk\\etc\\apps. On Linux systems, this will be $SPLUNK_HOME/etc/apps, or usually /opt/splunk/etc/apps.</p><h4>Validation</h4><p>You can make sure that Splunk has picked up the presence of the app by running $SPLUNK_HOME/bin/splunk display app (or on Windows, %SPLUNK_HOME%\\bin\\splunk display app), will, after asking you to log in, provide you with a list of installed apps. Most likely, if you see the folder listed alongside the other apps (learned, search, splunk_httpinput, etc.) you will know that it\'s there successfully.</p><p><b>Splunk Cloud Customers</b>: you won\'t be copying any files or folders to your indexers or search heads, but good news! The Splunk Add-on for Cisco ASA is Cloud Self-Service Enabled. So you can just got to Find Apps, and be up and running in seconds.</p>\n',
        category: ["Splunk Configuration for Data Source"],
    },
    {
        id: "SC-ASA-3-IndexesAndSourcetypes",
        title: "Indexes and Sourcetypes",
        "short-description":
            '<h4>Overview</h4>\n<p>Amongst&nbsp;Splunk&rsquo;s&nbsp;15,000+ customers, we&rsquo;ve done a lot of implementations, and we&rsquo;ve learned a few things along the way. While you can use any sourcetypes or indexes that you want in the &quot;land of Splunk,&quot; we&rsquo;ve found that the most successful customers follow specific patterns, as it sets them up for success moving forward.</p>\n<h4>Implementation</h4>\n<p>The following is a table of sourcetypes from Splunk documentation. The Splunk Add-on for Cisco ASA provides the index-time and search-time knowledge for the Cisco ASA, Cisco PIX, and Cisco Firewall Services Module (FWSM) devices, using the following sourcetypes. We will be focused on the <strong>cisco:asa</strong> sourcetype.</p>\n<table  class="table" border="1" cellspacing="0" cellpadding="0">\n  <tr>\n    <td width="98" valign="top"><p>Sourcetype</p></td>\n    <td width="64" valign="top"><p>Index</p></td>\n    <td width="272" valign="top"><p>Description</p></td>\n    <td width="190" valign="top"><p>Common   Information Model (CIM) Data Model</p></td>\n  </tr>\n  <tr>\n    <td width="98" valign="top"><p>cisco:asa</p></td>\n    <td width="64" valign="top"><p>netfw</p></td>\n    <td width="272" valign="top"><p>The system logs of   Cisco ASA record user authentication, user session, VPN and intrusion   messages.</p></td>\n    <td width="190" valign="top"><p><a title="Splunk Docs: Authentication Data Model" href="' +
            window.makeHelpLinkURL(
                "Splunk_Security_Essentials",
                "dataSource.cim.user.authentication3",
                "latest"
            ) +
            '">Authentication</a>,&nbsp;<a title="Splunk Docs: Change Analysis Data Model" href="' +
            window.makeHelpLinkURL(
                "Splunk_Security_Essentials",
                "dataSource.cim.user.changeAnalysis",
                "latest"
            ) +
            '">Change Analysis</a>,&nbsp;<a title="Splunk Docs: Network Sessions Data Model" href="' +
            window.makeHelpLinkURL(
                "Splunk_Security_Essentials",
                "dataSource.cim.user.networkSessions3",
                "latest"
            ) +
            '">Network Sessions</a>,&nbsp;<a title="Splunk Docs: Network Traffic Data Model" href="' +
            window.makeHelpLinkURL(
                "Splunk_Security_Essentials",
                "dataSource.cim.user.networkTraffic3",
                "latest"
            ) +
            '">Network Traffic</a>,&nbsp;<a title="Splunk Docs: Malware Data Model" href="' +
            window.makeHelpLinkURL(
                "Splunk_Security_Essentials",
                "dataSource.cim.user.malware",
                "latest"
            ) +
            '">Malware</a></p></td>\n  </tr>\n  <tr>\n    <td width="98" valign="top"><p>cisco:fwsm</p></td>\n    <td width="64" valign="top"><p>netfw</p></td>\n    <td width="272" valign="top"><p>The system logs of Cisco FWSM record user authentication,   user session, and firewall messages.</p></td>\n    <td width="190" valign="top"><p><a title="Splunk Docs: Authentication Data Model" href="' +
            window.makeHelpLinkURL(
                "Splunk_Security_Essentials",
                "dataSource.cim.user.authentication2",
                "latest"
            ) +
            '">Authentication</a>,&nbsp;<a title="Splunk Docs: Network Sessions Data Model" href="' +
            window.makeHelpLinkURL(
                "Splunk_Security_Essentials",
                "dataSource.cim.user.networkSessions2",
                "latest"
            ) +
            '">Network Sessions</a>,&nbsp;<a title="Splunk Docs: Network Traffic Data Model" href="' +
            window.makeHelpLinkURL(
                "Splunk_Security_Essentials",
                "dataSource.cim.user.networkTraffic2",
                "latest"
            ) +
            '">Network Traffic</a></p></td>\n  </tr>\n  <tr>\n    <td width="98" valign="top"><p>cisco:pix</p></td>\n    <td width="64" valign="top"><p>netfw</p></td>\n    <td width="272" valign="top"><p>The system logs of Cisco PIX record user authentication,   user session, and intrusion messages.</p></td>\n    <td width="190" valign="top"><p><a title="Splunk Docs: Authentication Data Model" href="' +
            window.makeHelpLinkURL(
                "Splunk_Security_Essentials",
                "dataSource.cim.user.authentication1",
                "latest"
            ) +
            '">Authentication</a>,&nbsp;<a title="Splunk Docs: Network Sessions Data Model" href="' +
            window.makeHelpLinkURL(
                "Splunk_Security_Essentials",
                "dataSource.cim.user.networkSessions1",
                "latest"
            ) +
            '">Network   Sessions</a>,&nbsp;<a title="Splunk Docs: Network Traffic Data Model" href="' +
            window.makeHelpLinkURL(
                "Splunk_Security_Essentials",
                "dataSource.cim.user.networkTraffic1",
                "latest"
            ) +
            '">Network   Traffic</a></p></td>\n  </tr>\n</table>\n<p>For our index, we will standardize on the netfw index to store all firewall logs. If you went through the &quot;Indexes Configuration&quot; above in &quot;Indexes and Sourcetypes,&quot; you already have this index configured across your environment. If you are forging your own path, we recommend creating the netfw index on any search heads or indexers in your environment or on your single-instance server. </p>',
        category: ["Splunk Configuration for Data Source"],
    },
    {
        id: "SC-ASA-4-inputsconf",
        title: "Cisco ASA inputs.conf",
        "short-description":
            '<h4>Overview</h4><p>Configuration files for Cisco ASA inputs tend to be pretty simple. In this case, we just have a single inputs.conf file that will go on the syslog server you will be monitoring. As detailed above in <a href="#Instruction_Expectations_and_Scaling">Instruction Expectations and Scaling</a>, you will need some mechanism to distribute these files to the hosts you\'re monitoring. For initial tests or deployments to only your most sensitive systems, it is easy to copy the files to the hosts. For larger distributions, you can use the Splunk deployment server or another code-distribution system, such as SCCM, Puppet, Chef, Ansible, or others.</p><h4>Implementation</h4><p>Distribute the below inputs.conf file to the Universal Forwarder installed on your syslog server (only where you actually have the rsyslog information). You should create a "local" folder inside of the TA folder. For most customers, the path to this file will end up being /opt/splunk/etc/apps/Splunk_TA_cisco-asa/local/inputs.conf (or on Windows, C:\\Program Files\\Splunk\\etc\\apps\\Splunk_TA_cisco-asa\\local\\inputs.conf. You can click Download File below to grab the file.</p><pre filename="inputs.conf" class="codeSample">[monitor:///var/log/rsyslog/cisco/asa/*.log]\nhost_regex = asa/(.*?)-\\d+.log$\nsourcetype = cisco:asa\nindex = netfw\ndisabled = 0\n\n# search to check\n# index=netfw sourcetype=cisco:asa\n\n</pre>',
        category: ["Splunk Configuration for Data Source"],
    },
    {
        id: "SC-Stream-1-Overview",
        title: "Stream Overview",
        "short-description":
            '<p>Splunk Stream is great way to monitor network traffic from a host or via a network tap or span port. The software acts as a network traffic "sniffer." The web GUI interface allows you to choose individual metadata fields that are specific to a network protocol and write that metadata to your Splunk indexers for searching.</p><p>This means that you can capture all kinds of useful metadata through Splunk Stream, and even do limited full packet capture! The top use cases for Stream are DNS and DHCP (both protocols where logging is notoriously weak), but many people use Stream to capture HTTP transactions, database queries, emails, and more. Check out <a title="Splunk Docs: Protocol Detection" href="' +
            window.makeHelpLinkURL(
                "Splunk_Security_Essentials",
                "dataSource.streamApp.deployStreamApp.protocolDetection",
                "latest"
            ) +
            '">all the protocols</a> that Stream can handle!</p><p>The simplest way to get Stream set up is as a full, standalone Splunk instance with the Stream app installed. While this initially will act as an indexer, you will add an output configuration to direct Splunk to send the data out to indexers in the Splunk environment. This converts the instance into what is known as a "heavy-weight forwarder" and is the most common way to set up a new Stream environment. </p><p>The most common scenario for stream is to just install it on the host that\'s generating the traffic you want to capture, frequently a Windows domain Controller serving DHCP and DNS Server roles. The next most common model is to install Stream on a SPAN port or a network tap, allowing you to have an out-of-band Stream host monitoring the network. The Splunk configuration for that setup is identical, you only need to lean on your network team to help make it happen. Finally, advanced users might configure stream on a universal forwarder (see the Multi-Forwarder Environments section at the bottom).</p> \n',
        category: ["Splunk Configuration for Data Source"],
    },
    {
        id: "SC-Stream-2-SizingEstimate",
        title: "Sizing for Splunk Stream",
        "short-description":
            "<p>Stream is perhaps the most difficult product to properly estimate sizing for inside of the Splunk world, for two reasons. The first is that you can choose what protocols you want to capture, and even then you can apply filters so that you only get a certain percentage of that traffic (for example, only HTTP transactions headed out to the internet). The second reason is that even once you've decided to capture a data stream (such as DNS logs), you can then decide what individual fields you're looking for -- just the query, type, and response? Or everything?</p><p>For this reason, the easiest way to size your stream ingest is to just give it a shot. Don't put an outputs.conf on your heavy-weight forwarder, and just see what volume it brings in. Or send it into your Splunk environment and closely monitor the volume.</p>\n",
        category: ["Splunk Configuration for Data Source"],
    },
    {
        id: "SC-Stream-3-IndexesAndSourcetypes",
        title: "Stream Indexes and Sourcetypes",
        "short-description":
            '<h4>Overview</h4>\n<p>Amongst&nbsp;Splunk&rsquo;s&nbsp;15,000+ customers, we&rsquo;ve done a lot of implementations, and we&rsquo;ve learned a few things along the way. While you can use any sourcetypes or indexes that you want in the &quot;land of Splunk,&quot; we&rsquo;ve found that the most successful customers follow specific patterns, as it sets them up for success moving forward.</p>\n<h4>Implementation</h4>Below is a list of the Stream data types from Splunk docs, along with the recommended sourcetypes and indexes.</p>\n\n<table class="table">\n  <thead>\n    <tr>\n      <th>Protocol</th>\n      <th>Description</th>\n      <th>Sourcetype</th>\n      <th>Index</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>AMQP</td>\n      <td>Advanced Messaging Queuing Protocol</td>\n      <td>stream:amqp</td>\n      <td>netfw</td>\n    </tr>\n    <tr>\n      <td>DHCP</td>\n      <td>Dynamic Host Configuration Protocol</td>\n      <td>stream:dhcp</td>\n      <td>netipam</td>\n    </tr>\n    <tr>\n      <td>DIAMETER</td>\n      <td>Authentication Protocol</td>\n      <td>stream:diameter</td>\n      <td>streamsec</td>\n    </tr>\n    <tr>\n      <td>DNS</td>\n      <td>Domain Name Service</td>\n      <td>stream:dns</td>\n      <td>netdns</td>\n    </tr>\n    <tr>\n      <td>FTP</td>\n      <td>File Transfer Protocol</td>\n      <td>stream:ftp</td>\n      <td>stream</td>\n    </tr>\n    <tr>\n      <td>HTTP</td>\n      <td>Hypertext Transfer Protocol</td>\n      <td>stream:http</td>\n      <td>netproxy / appwebint / appwebext as appropriate</td>\n    </tr>\n    <tr>\n      <td>ICMP</td>\n      <td>Internet Control Message Protocol</td>\n      <td>stream:icmp</td>\n      <td>stream</td>\n    </tr>\n    <tr>\n      <td>IMAP</td>\n      <td>Internet Message Access Protocol</td>\n      <td>stream:imap</td>\n      <td>mail</td>\n    </tr>\n    <tr>\n      <td>IP</td>\n      <td>Internet Protocol</td>\n      <td>stream:ip</td>\n      <td>stream</td>\n    </tr>\n    <tr>\n      <td>IRC</td>\n      <td>Internet Relay Chat</td>\n      <td>stream:irc</td>\n      <td>streamsec</td>\n    </tr>\n    <tr>\n      <td>LDAP</td>\n      <td>Lightweight Directory Access Protocol</td>\n      <td>stream:ldap</td>\n      <td>stream</td>\n    </tr>\n    <tr>\n      <td>MAPI</td>\n      <td>Messaging Application Programming Interface</td>\n      <td>stream:mapi</td>\n      <td>mail</td>\n    </tr>\n    <tr>\n      <td>MySQL</td>\n      <td>MySQL client/server protocol</td>\n      <td>stream:mysql</td>\n      <td>db</td>\n    </tr>\n    <tr>\n      <td>NetBIOS</td>\n      <td>Network Basic Input/Output System</td>\n      <td>stream:netbios</td>\n      <td>stream</td>\n    </tr>\n    <tr>\n      <td>NFS</td>\n      <td>Network File System</td>\n      <td>stream:nfs</td>\n      <td>stream</td>\n    </tr>\n    <tr>\n      <td>POP3</td>\n      <td>Post Office Protocol v3</td>\n      <td>stream:pop3</td>\n      <td>mail</td>\n    </tr>\n    <tr>\n      <td>Postgres</td>\n      <td>PostgreSQL</td>\n      <td>stream:postgres</td>\n      <td>db</td>\n    </tr>\n    <tr>\n      <td>RADIUS</td>\n      <td>Remote Authentication Dial In User Service</td>\n      <td>stream:radius</td>\n      <td>streamsec</td>\n    </tr>\n    <tr>\n      <td>RTP</td>\n      <td>Real-time Transport Protocol</td>\n      <td>stream:rtp</td>\n      <td>stream</td>\n    </tr>\n    <tr>\n      <td>SIP</td>\n      <td>Session Initiation Protocol</td>\n      <td>stream:sip</td>\n      <td>stream</td>\n    </tr>\n    <tr>\n      <td>SMB</td>\n      <td>Server Message Block</td>\n      <td>stream:smb</td>\n      <td>stream</td>\n    </tr>\n    <tr>\n      <td>SMPP</td>\n      <td>Short Message Peer to Peer</td>\n      <td>stream:smpp</td>\n      <td>stream</td>\n    </tr>\n    <tr>\n      <td>SNMP</td>\n      <td>Simple Network Management Protocol</td>\n      <td>stream:snmp</td>\n      <td>stream</td>\n    </tr>\n    <tr>\n      <td>TCP</td>\n      <td>Transmission Control Protocol</td>\n      <td>stream:tcp</td>\n      <td>stream</td>\n    </tr>\n    <tr>\n      <td>TDS</td>\n      <td>Tabular Data Stream - Sybase/MSSQL</td>\n      <td>stream:tds</td>\n      <td>db</td>\n    </tr>\n    <tr>\n      <td>TNS</td>\n      <td>Transparent Network Substrate (Oracle)</td>\n      <td>stream:tns</td>\n      <td>db</td>\n    </tr>\n    <tr>\n      <td>UDP</td>\n      <td>User Datagram Protocol</td>\n      <td>stream:udp</td>\n      <td>stream</td>\n    </tr>\n    <tr>\n      <td>XMPP</td>\n      <td>Extensible Messaging and Presence Protocol</td>\n      <td>stream:xmpp</td>\n      <td>streamsec</td>\n    </tr>\n  </tbody>\n</table>\n',
        category: ["Splunk Configuration for Data Source"],
    },
    {
        id: "SC-Stream-4-InstallStream",
        title: "Install the Stream App",
        "short-description":
            '<p>Log into Splunk and click <b>Splunk Apps</b>.<img src="%SSEDOCIMAGEPATH%/stream/stream-1-splunkappslink.png"  title="Click Splunk Apps to find Splunk Stream." /></p><p>Search for "Splunk Stream." Click the <b>Install</b> button. <img src="%SSEDOCIMAGEPATH%/stream/stream-2-searchForStreamInApps.png"  title="Search for Splunk Stream in Apps" /></p><p>After installation, click <b>Restart Now.</b> <img src="%SSEDOCIMAGEPATH%/stream/stream-3-restartnow.png"  title="When asked, restart Splunk." /></p><p>Log back into Splunk and select the Splunk Stream app. Accept the defaults and click <b>Let\'s Get Started</b>.</p><p>Now you\'re ready to configure Stream to monitor the relevant network interface on your Windows server and forward the resulting DNS metadata to your Splunk indexers.</p>\n',
        category: ["Splunk Configuration for Data Source"],
    },
    {
        id: "SC-Stream-5-DNS",
        title: "Configure a New DNS Stream",
        "short-description":
            '<h4>Implementation</h4><p>Within the Splunk Stream app, select <b>Configuration > Configure Streams</b>. <img src="%SSEDOCIMAGEPATH%/stream/stream-4-configurestream.png"  title="Click Configure Streams, under Configuration." /></p><p>The <b>Configure Streams</b> dashboard will display the default settings for protocol information to be collected. You\'ll want to disable the defaults, then select the protocol and details to create your new stream.</p><p>You can select all of the available protocols and disable them all at once, by clicking the checkbox next to <b>Name</b> on the title bar. <img src="%SSEDOCIMAGEPATH%/stream/stream-5-disableexistingstreams.png"  title="Select All, and then click Disable to turn off the default streams." /></p><p>After selecting all of the protocols, click the <b>Disable</b> option.</p><p>Now that you\'ve disabled the defaults, create a new stream for collecting the DNS details that you\'d like to capture. Start by selecting the <b>New Stream</b> button, then <b>Metadata Stream</b>. <img src="%SSEDOCIMAGEPATH%/stream/stream-6-newmetadatastream.png"  title="Most value from Stream comes from the Metadata Streams, here we create a new Metadata Stream." /></p><p>This will bring you into a workflow that allows you to configure the stream.</p><p>Select <b>DNS</b> as the protocol in the first step. <img src="%SSEDOCIMAGEPATH%/stream/stream-7-newdnsstream.png"  title="We are basing our new stream off the DNS protocol" /></p><p>Once <b>DNS</b> is selected, give it a name and description with some context to help you to identify the data. Click <b>Next.</b> <img src="%SSEDOCIMAGEPATH%/stream/stream-8-namethestream.png"  title="Give that stream a name and description" /></p><p>On the aggregation step, ensure that <b>No</b> is selected for aggregation, then click <b>Next.</b> (You don\'t want aggregation because you want to see the individual DNS records.) <img src="%SSEDOCIMAGEPATH%/stream/stream-9-defineaggregation.png"  title="Select No for aggregation, because we aren\'t generating summary statistics." /></p><p>On the <b>Fields</b> screen, you\'ll select the fields (specific to DNS) that you want to collect and store in Splunk. Note that some-but not all-fields are selected by default. <img src="%SSEDOCIMAGEPATH%/stream/stream-10-fields.png"  title="Enable or disable any fields you want to collect on DNS traffic." /></p><p>Once you\'ve selected the DNS fields that you\'d like to collect, click <b>Next</b>.</p><p>You define filtering of the collected data on the <b>Filters</b> screen. The filters are based on the fields you selected on the previous screen. For instance, if you only wanted Stream to capture data from type "A" queries, you could define that here. <img src="%SSEDOCIMAGEPATH%/stream/stream-11-filters.png"  title="If you want to apply filters for what kinds of queries to record, you can apply those." /></p><p>Filters are something that you may want to go back and tweak later, once you\'ve collected data for a while and know what you have and what you\'d like to keep (or discard). <img src="%SSEDOCIMAGEPATH%/stream/stream-12-individualfilter.png"  title="An example filter, if you decided you only cared about A records (not generally recommended)." /></p><p>After defining filters, select the <b>Next</b> button again to go to the <b>Settings</b> screen, where you\'ll define the destination index for your DNS data.</p><p>Select the destination index from the dropdown menu. You should select netdns in this dropdown. If you don\'t see netdns listed here, it is because you missed a step in the Indexes and Sourcetypes section. We recommend installing the standard set of indexes on any Heavy-weight Forwarder running Splunk Stream not because it will actually store data in those indexes, but because it will show up in the dropdown here. If you missed that step, don\'t fret -- you\'re almost done. Go ahead and finish this section, then go up to <a href="#Indexes_and_Sourcetypes_Overview">Indexes and Sourcetypes Overview</a> to install the indexes. You can come back here and edit your stream afterwards. <img src="%SSEDOCIMAGEPATH%/stream/stream-13-selectingindex.png"  title="Selecting the netdns index for our new stream configuration." /></p><p>After selecting the destination index, you can choose to save the configuration in <b>Disabled</b> mode, if you\'re not quite ready to begin collecting data. You can also put it into <b>Estimate</b> mode to get an idea of how much data you\'ll be collecting once the configuration is enabled.<img src="%SSEDOCIMAGEPATH%/stream/stream-14-choosingstatus.png"  title="We will select Enabled here, because we\'re ready to ingest!" /></p><p>On the <b>Groups</b> screen, you\'ll have the ability to select a group with which to associate the Stream configuration. In this case, because you are not configuring distributed forwarders, you have not created separate groups-so leave <b>defaultgroup</b> selected. Finally, click <b>Create Stream</b> to save your configuration! You\'re done!<img src="%SSEDOCIMAGEPATH%/stream/stream-15-createstream.png"  title="Everything is done, we can create the stream!" /></p><h4>Validation</h4><p>If you\'ve enabled the configuration, you should now be collecting DNS data. You can validate this by searching for: <pre>index=netdns sourcetype=stream:dns</pre></p><p>You should able to see beautiful JSON blobs of DNS transactions, with fields available on the left.</p><img src="%SSEDOCIMAGEPATH%/stream/stream-16-validation.png"  title="Lovely, Lovely DNS data." />\n',
        category: ["Splunk Configuration for Data Source"],
    },
    {
        id: "SC-Stream-6-MultiServer",
        title: "(Optional) Multi-Forwarder Environments",
        "short-description":
            '<h4>Overview</h4><p>If you only have a small handful of stream hosts, it is by far easiest to just install the Heavy-weight forwarder and manually configure it. But if you are planning to roll out a fleet of Stream sensors throughout your network, you will want to centrally monitor them. While Stream can be deployed via the Deployment Server, the actual stream configuration is managed via a different model. We will walk through that model below, but the high level summary is that you can deploy the Stream Technology Add-on (TA) onto Universal Forwarders (no requirement for heavy-weight forwarders for the TA), and tell them to all point to a central Stream configuration server over your standard Splunk port (default http over 8000). See below for the full setup.</p><h4>Implementation</h4><p>Note that there are two primary components in Splunk Stream. First is the Splunk Stream app, which provides the web interface and allows stream configuration. This component exposes the configuration you build to clients. The client (Splunk_TA_stream) gets its configuration from the Splunk Stream app via REST API. In the above example of a standalone configuration, both of these components are installed (Splunk_TA_stream comes as part of the Stream app that you download from Splunkbase). In a standalone configuration, the request and transfer of configuration information from server to client takes place on the local network stack. In a distributed configuration, the request and transfer of configuration takes place over the wire.</p><img src="%SSEDOCIMAGEPATH%/stream/stream-17-diagram.png"  title="Stream traffic: Management Plane at the top, Data Plane at the bottom." /><p>The location of the Splunk Stream management server is stored in inputs.conf. <img src="%SSEDOCIMAGEPATH%/stream/stream-18-inputs.png"  title="A sample inputs.conf, directing the stream server to localhost:8000. Generally this would be a dedicated stream configuration server in your environment." /></p><p>You\'ll need the Splunk_TA_stream app for a forwarder configuration. The custom inputs.conf that resides in that app should point to your remote Stream server, as below.<pre>[streamfwd://streamfwd]\nsplunk_stream_app_location = http://remote_stream_server:8000/en-us/custom/splunk_app_stream/\nstream_forwarder_id = \ndisabled = 0</pre></p><p>Don\'t forget to modify the protocol if you\'re using if you\'re utilizing SSL/TLS on your Stream server.</p><p><b>Final Notes:</b> when using this configuration, don\'t forget that your stream forwarders will need to connect home to the Splunk Stream server, so network access will be required. You will also need to adjust the frequency that they call home if you deploy a large number (hundreds or thousands), which you can do by adding the "pingInterval" setting on the streamfwd.conf. The default value is 5 seconds, but in larger environments an interval of many minutes is usually more than sufficient.</p>\n',
        category: ["Splunk Configuration for Data Source"],
    },
    {
        id: "VC-ZSCALER-1-overview",
        title: "Zscaler Overview",
        "short-description":
            "<h4>Overview</h4><p>Zscaler can stream logs into the customer environments. This is facilitated via Zscaler supplied virtual machines which execute in a customer’s (or partner’s) hosted compute environment. These virtual machines attach to the Zscaler cloud via outbound connections and receive encrypted and tokenized logs to stream into customer log collection and SIEM platforms.</p><p>For full details on how to configure Zscaler data collection and onboarding, visit the Splunk Lantern site for Zscaler. <a href='https://lantern.splunk.com/Data_Descriptors/Data_Sources/Zscaler/Zscaler' target='_blank' rel='noopener noreferrer'>https://lantern.splunk.com/Data_Descriptors/Data_Sources/Zscaler/Zscaler</a></p>",
        category: ["System Configuration"],
    },
    {
        id: "SC-Placeholder",
        title: "Placeholder",
        "short-description":
            "<p>Placeholder -- we do not have content for this technology yet.</p>",
        category: ["Splunk Configuration for Data Source"],
    },
    {
        id: "SC-Other",
        title: "Other Data Source",
        "short-description":
            '<p>We weren\'t able to find that data source. This likely means that we haven\'t built out documentation for this data source yet. Please check the <a title="Splunkbase" href="https://splunkbase.splunk.com/">Splunkbase</a> page for the app.</p>\n',
        category: ["System Configuration"],
    },
]
