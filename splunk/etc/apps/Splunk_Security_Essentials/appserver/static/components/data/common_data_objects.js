require(
    [
        'jquery',
        'underscore',
        'json!' + $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/bookmark_names'
        //'backbone',
        //"splunk.util"

    ],
    function(
        $,
        _,
        bookmark_names
        //Backbone,
        //splunkUtil
    ) {
        // console.log("Starting common data objects");

        //var BookmarkStatus = { "none": "Not On List", "bookmarked": "Bookmarked", "needData": "Waiting on Data", "inQueue": "Ready for Deployment", "issuesDeploying": "Deployment Issues", "needsTuning": "Needs Tuning", "successfullyImplemented": "Successfully Implemented" }
        
        var BookmarkStatus = {"bookmarked": "Bookmarked"}
        for(let i = 0; i < bookmark_names.length; i++) {
            // need this since there's usually an empty row at the end of the kvstore
            if(bookmark_names[i]["name"] != "") {
                let bookmarkKey;
                if(bookmark_names[i]["referenceName"]) {
                    bookmarkKey = bookmark_names[i]["referenceName"];
                    BookmarkStatus[bookmarkKey] = bookmark_names[i]["name"]
                } else{
                    bookmarkKey = bookmark_names[i]["name"].split(" ").join("");
                    bookmarkKey = bookmarkKey.charAt(0).toLowerCase() + bookmarkKey.slice(1)
                    BookmarkStatus[bookmarkKey] = bookmark_names[i]["name"]
                }
            }
        }
        BookmarkStatus["successfullyImplemented"] = "Successfully Implemented"
        //console.log(BookmarkStatus)

        window.BookmarkStatus = BookmarkStatus

        

        var JourneyStageIds = ["Stage_1", "Stage_2", "Stage_3", "Stage_4", "Stage_5", "Stage_6"]
        window.JourneyStageIds = JourneyStageIds

        var JourneyStageNames = ["N/A", "Collection", "Normalization", "Expansion", "Enrichment", "Automation and Orchestration", "Advanced Detection", "Other"]
        window.JourneyStageNames = JourneyStageNames;
        var prettyDescriptions = {
            "usecase": {
                "Security Monitoring": "The foundation of security, looking for common activities from common malware and attackers.",
                "Advanced Threat Detection": "Focused on detecting advanced persistent threats, experienced and motivated attackers, and nation-state actors.",
                "Compliance": "Provides assistance in ensuring that organizations are implementing all required monitoring for the regulatory environment.",
                "Insider Threat": "Detect internal employees who have gone rogue, and are looking to hurt the company, defraud the company, or steal from customers.",
                "Application Security": "Monitor application logs to detect signs that a web application is being directly attacked."
            }
        }
        window.prettyDescriptions = prettyDescriptions;
        window.searchEngineDefaults = {
            "description": 3,
            "display_app": 3,
            "searchKeywords": 5,
            "name": 5,
            "relevance": 2,
            "gdprtext": 1,
            "story": 5,
            "knownFP": 1,
            "category": 3,
            "howToImplement": 1
        }
        // create an array of bookmark names for the filter
        bookmarkFilterNames = ["Not Bookmarked"]
        for(let i = 0; i < bookmark_names.length; i++) {
            bookmarkFilterNames.push(bookmark_names[i]["name"])
        }
        var allFilters = [{ //This is from the list of all filters for the modal, not for the default!
                "fieldName": "journey",
                "displayName": _("Journey").t(),
                "type": "search",
                "export": "yes",
                "itemSort": JourneyStageIds, //JourneyAdjustment //NumJourneys
                "style": "height: 1.75em;",
                "width": "250px",
                "ulStyle": "column-count: 1;",
                "manipulateDisplay": function(label) {
                    //console.log("Manipulating label..", label)
                    label = label.replace("_", " ")
                    if (typeof JourneyStageNames[parseInt(label.replace("Stage ", ""))] != "undefined") {
                        label = label + " - " + JourneyStageNames[parseInt(label.replace("Stage ", ""))]
                    }
                    return label
                },
                "tooltip": _("Splunk's Security Journey maps examples to relative technical maturity of a Splunk deployment, letting newcomers focus on the basics and advanced users target their needs.").t()
            }, //This is from the list of all filters for the modal, not for the default!
            { //This is from the list of all filters for the modal, not for the default!
                "fieldName": "usecase",
                "displayName": _("Security Use Case").t(),
                "type": "search",
                "export": "yes",
                "itemSort": [_("Security Monitoring").t(), _("Compliance").t(), _("Advanced Threat Detection").t(), _("Incident Investigation & Forensics").t(), _("Incident Response").t(), _("SOC Automation").t(), _("Insider Threat").t(), _("Fraud Detection").t(), _("Application Security").t(), _("Other").t()],
                "style": "height: 1.75em; width: 225px;",
                "headerStyle": "width: 225px",
                "width": "225px",
                "ulStyle": "column-count: 1;",
                "tooltip": _("Shows the high level use case of an example.").t()
            }, //This is from the list of all filters for the modal, not for the default!
            { //This is from the list of all filters for the modal, not for the default!
                "fieldName": "category",
                "displayName": _("Category").t(),
                "type": "search",
                "export": "yes",
                "style": "width:220px; padding-bottom: 2px; display: inline-block",
                "headerStyle": "width: 240px",
                "width": "240px",
                "ulStyle": "column-count: 1 !important;",
                "tooltip": _("Shows the more detailed category of an example.").t()
            }, { //This is from the list of all filters for the modal, not for the default!
                "fieldName": "datasource",
                "displayName": _("Data Sources").t(),
                "type": "search",
                "export": "yes",
                "style": "width:250px; padding-bottom: 2px; display: inline-block",
                "headerStyle": "width: 550px",
                "width": "250px",
                "ulStyle": "column-count: 2;",
                "tooltip": _("The data sources that power ths use cases. These are mapped to individual technologies.").t()
            }, //This is from the list of all filters for the modal, not for the default!
            { //This is from the list of all filters for the modal, not for the default!
                "fieldName": "highlight",
                "displayName": _("Featured").t(),
                "type": "exact",
                "width": "150px",
                "export": "yes",
                "style": " padding-bottom: 2px; width: 150px;",
                "ulStyle": "column-count: 1;",
                "tooltip": _("Featured searches are those that come highly recommended by Splunk's Security SMEs.").t()
            }, //This is from the list of all filters for the modal, not for the default!
            { //This is from the list of all filters for the modal, not for the default!
                "fieldName": "alertvolume",
                "displayName": _("Alert Volume").t(),
                "type": "exact",
                "width": "120px",
                "export": "yes",
                "itemSort": ["Low", "Medium", "High", "None"],
                "style": "height: 1.75em; display: inline-block; width: 120px;",
                "ulStyle": "column-count: 1;",
                "tooltip": _("Shows whether an example is expected to generate a high amount of noise, or should be high confidence. ").t()
            }, { //This is from the list of all filters for the modal, not for the default!
                "fieldName": "domain",
                "displayName": _("Domain").t(),
                "type": "exact",
                "export": "yes",
                "style": "height: 1.75em; width: 175px;",
                "width": "175px",
                "ulStyle": "column-count: 1;",
                "tooltip": _("What high level area of security does this apply to, such as Endpoint, Access, or Network.").t()
            }, //This is from the list of all filters for the modal, not for the default! 
            { //This is from the list of all filters for the modal, not for the default!
                "fieldName": "mitre_tactic_display",
                "displayName": _("ATT&CK Tactic").t(),
                "type": "search",
                "export": "yes",
                "itemSort": ["Persistence", "Privilege Escalation", "Defense Evasion", "Credential Access", "Discovery", "Lateral Movement", "Execution", "Collection", "Exfiltration", "Command and Control"],
                "style": "height: 1.75em; width: 200px;",
                "headerStyle": "width: 200px;",
                "width": "200px",
                "ulStyle": "column-count: 1;",
                "tooltip": _("Tactics are the higher-level categories (containing many techniques) from MITRE ATT&CK and PRE-ATT&CK. MITRE’s Adversarial Tactics, Techniques, and Common Knowledge (ATT&CK™) is a curated knowledge base and model for cyber adversary behavior, reflecting the various phases of an adversary’s lifecycle and the platforms they are known to target. ATT&CK is useful for understanding security risk against known adversary behavior, for planning security improvements, and verifying defenses work as expected. <br /><a href=\"https://attack.mitre.org/wiki/Main_Page\">Read More...</a>").t()
            }, //This is from the list of all filters for the modal, not for the default!
            { //This is from the list of all filters for the modal, not for the default!
                "fieldName": "mitre_technique_display",
                "displayName": _("ATT&CK Technique").t(),
                "type": "search",
                "export": "yes",
                "style": "height: 1.75em; width: 200px;",
                "headerStyle": "width: 200px;",
                "width": "200px",
                "ulStyle": "column-count: 1;",
                "tooltip": _("Techniques are the detailed capabilities from MITRE ATT&CK and PRE-ATT&CK. MITRE’s Adversarial Tactics, Techniques, and Common Knowledge (ATT&CK™) is a curated knowledge base and model for cyber adversary behavior, reflecting the various phases of an adversary’s lifecycle and the platforms they are known to target. ATT&CK is useful for understanding security risk against known adversary behavior, for planning security improvements, and verifying defenses work as expected. <br /><a href=\"https://attack.mitre.org/wiki/Main_Page\">Read More...</a>").t()
            }, //This is from the list of all filters for the modal, not for the default!
            { //This is from the list of all filters for the modal, not for the default!
                "fieldName": "mitre_threat_groups",
                "displayName": _("MITRE Threat Groups").t(),
                "type": "search",
                "export": "yes",
                "style": "height: 1.75em; width: 200px;",
                "headerStyle": "width: 200px;",
                "width": "200px",
                "ulStyle": "column-count: 1;",
                "tooltip": _("MITRE ATT&CK and PRE-ATT&CK map out the threat groups that are known to use particular techniques. This is of particular value for organizations who have a solid understanding of who their attackers are, and can build defenses specifically tied to those attacking groups.<a href=\"https://attack.mitre.org/wiki/Main_Page\">Read More...</a>").t()
            }, //This is from the list of all filters for the modal, not for the default!
            { //This is from the list of all filters for the modal, not for the default!
                "fieldName": "data_source_categories_display",
                "displayName": _("Data Source Category").t(),
                "type": "search",
                "export": "yes",
                "style": "height: 1.75em; width: 200px;",
                "headerStyle": "width: 200px;",
                "width": "200px",
                "ulStyle": "column-count: 1;",
                "tooltip": _("New in SSE 2.4, this more detailed data source allows us to build a closer link between the data in your environment and the content that Splunk creates").t()
            }, //This is from the list of all filters for the modal, not for the default!
            { //This is from the list of all filters for the modal, not for the default!
                "fieldName": "data_available",
                "displayName": _("Data Availability").t(),
                "type": "search",
                "export": "yes",
                "style": "height: 1.75em; width: 200px;",
                "headerStyle": "width: 200px;",
                "width": "200px",
                "ulStyle": "column-count: 1;",
                "tooltip": _("If you've gone through the Data Inventory configuration, the app knows what data you have. This configuration will let you filter to content you have the data to support.").t()
            }, //This is from the list of all filters for the modal, not for the default!
            { //This is from the list of all filters for the modal, not for the default!
                "fieldName": "enabled",
                "displayName": _("Content Enabled").t(),
                "type": "search",
                "export": "yes",
                "style": "height: 1.75em; width: 200px;",
                "headerStyle": "width: 200px;",
                "width": "200px",
                "ulStyle": "column-count: 1;",
                "tooltip": _("New in SSE 2.4, you can easily track what content you have enabled, allowing you to filter for content that you have turned on or content that you don't.").t()
            }, //This is from the list of all filters for the modal, not for the default!
            { //This is from the list of all filters for the modal, not for the default!
                "fieldName": "killchain",
                "displayName": _("Kill Chain Phase").t(),
                "type": "search",
                "width": "200px",
                "export": "yes",
                "itemSort": ["Reconnaissance", "Weaponization", "Delivery", "Exploitation", "Installation", "Command and Control", "Actions On Objectives"],
                "style": "height: 1.75em; width: 200px;",
                "headerStyle": "width: 200px;",
                "ulStyle": "column-count: 1;",
                "tooltip": _("Developed by Lockheed Martin, the Cyber Kill Chain® framework is part of the Intelligence Driven Defense® model for identification and prevention of cyber intrusions activity. The model identifies what the adversaries must complete in order to achieve their objective. The seven steps of the Cyber Kill Chain® enhance visibility into an attack and enrich an analyst’s understanding of an adversary’s tactics, techniques and procedures.<br/><a href=\"https://www.lockheedmartin.com/us/what-we-do/aerospace-defense/cyber/cyber-kill-chain.html\">Read More...</a>").t()
            }, //This is from the list of all filters for the modal, not for the default!
            { //This is from the list of all filters for the modal, not for the default!
                "fieldName": "hasSearch",
                "displayName": _("Search Included").t(),
                "type": "exact",
                "export": "yes",
                "width": "180px",
                "style": "height: 1.75em; width: 180px;",
                "ulStyle": "column-count: 1;",
                "tooltip": _("This filter will let you include only those searches that come with Splunk Security Essentials (and aren't from Premium Apps)").t()
            }, //This is from the list of all filters for the modal, not for the default!
            { //This is from the list of all filters for the modal, not for the default!
                "fieldName": "SPLEase",
                "displayName": _("SPL Difficulty").t(),
                "type": "exact",
                "export": "yes",
                "width": "180px",
                "style": "height: 1.75em; width: 180px;",
                "itemSort": ["Basic", "Medium", "Hard", "Advanced", "Accelerated"],
                "ulStyle": "column-count: 1;",
                "tooltip": _("If you are using Splunk Security Essentials to learn SPL, you can filter here for the easier or more difficult SPL.").t()
            }, //This is from the list of all filters for the modal, not for the default!
            { //This is from the list of all filters for the modal, not for the default!
                "fieldName": "displayapp",
                "displayName": _("Originating App").t(),
                "type": "search",
                "export": "yes",
                "width": "180px",
                "style": " padding-bottom: 2px; width: 300px;",
                "ulStyle": "column-count: 1;",
                "tooltip": _("The source of the search, whether it is Splunk Enterprise Security, UBA, or Splunk Security Essentials").t()
            }, //This is from the list of all filters for the modal, not for the default!
            { //This is from the list of all filters for the modal, not for the default!
                "fieldName": "advancedtags",
                "displayName": _("Advanced").t(),
                "type": "search",
                "width": "180px",
                "style": "height: 1.75em; width: 180px;",
                "ulStyle": "column-count: 1;",
                "tooltip": _("A catch-all of several other items you might want to filter on.").t()
            }, //This is from the list of all filters for the modal, not for the default!
            { //This is from the list of all filters for the modal, not for the default!
                "fieldName": "bookmark_status_display",
                "displayName": _("Bookmarked").t(),
                "type": "search",
                "export": "yes",
                "width": "180px",
                "style": "height: 1.75em; width: 180px;",
                "ulStyle": "column-count: 1;",
                "itemSort": ["Not Bookmarked", "Waiting on Data", "Ready for Deployment", "Needs Tuning", "Issues Deploying", "Successfully Implemented"],
                "tooltip": _("Examples you are tracking").t()
            }, //This is from the list of all filters for the modal, not for the default!
            { //This is from the list of all filters for the modal, not for the default!
                "fieldName": "released",
                "displayName": _("Released Version").t(),
                "type": "search",
                "width": "180px",
                "style": "height: 1.75em; width: 180px;",
                "ulStyle": "column-count: 1;",
                "tooltip": _("A little used filter, shows when the example was first released.").t()
            } //This is from the list of all filters for the modal, not for the default!
        ];
        window.allFilters = allFilters;

        // console.log("Completed common_data_objects")


        function formatDate(date) {
            var monthNames = [
                "January", "February", "March",
                "April", "May", "June", "July",
                "August", "September", "October",
                "November", "December"
            ];

            var day = date.getDate();
            var monthIndex = date.getMonth();
            var year = date.getFullYear();

            return day + ' ' + monthNames[monthIndex] + ' ' + year;
        }
        window.formatDate = formatDate
    })

//# sourceURL=common_data_objects.js
