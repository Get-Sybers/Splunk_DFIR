function customContentModal(successCallback, summary, potentialExtractions) {
    require([
        "underscore",
        "json!" +
            $C["SPLUNKD_PATH"] +
            "/services/SSEShowcaseInfo?locale=" +
            window.localeString,
        "json!" +
            $C["SPLUNKD_PATH"] +
            "/services/pullJSON?config=data_inventory&locale=" +
            window.localeString,
        "json!" +
            $C["SPLUNKD_PATH"] +
            "/services/pullJSON?config=mitreattack&locale=" +
            window.localeString,
        "json!" +
            $C["SPLUNKD_PATH"] +
            "/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/bookmark_names",
        "components/controls/Modal",
        "components/controls/BuildTile",
        Splunk.util.make_full_url(
            "/static/app/Splunk_Security_Essentials/vendor/lunr.js/lunr.js"
        ),
        "jquery",
        Splunk.util.make_full_url(
            "/static/app/Splunk_Security_Essentials/components/controls/SavedSearchSelectorModal.js"
        ),
        Splunk.util.make_full_url(
            "/static/app/Splunk_Security_Essentials/components/controls/ProcessSummaryUI.js"
        ),
    ], function (
        _,
        localShowcaseInfo,
        data_inventory,
        mitre_attack,
        bookmark_names,
        Modal,
        BuildTile,
        lunr,
        SavedSearchSelectorModal,
        ProcessSummaryUI
    ) {
        let documents = []
        let fields = Object.keys(window.searchEngineDefaults)
        for (let SummaryName in localShowcaseInfo["roles"]["default"][
            "summaries"
        ]) {
            SummaryName =
                localShowcaseInfo["roles"]["default"]["summaries"][SummaryName]
            if (
                typeof localShowcaseInfo["summaries"][SummaryName] == "object"
            ) {
                let myobj = { id: SummaryName }
                for (let myfield in fields) {
                    myfield = fields[myfield]
                    if (
                        typeof localShowcaseInfo["summaries"][SummaryName][
                            myfield
                        ] != "undefined"
                    ) {
                        myobj[myfield] =
                            localShowcaseInfo["summaries"][SummaryName][myfield]
                    }
                }
                documents.push(myobj)
            }
        }
        let index = lunr(function () {
            for (let field in window.searchEngineDefaults) {
                this.field(field, {
                    boost: window.searchEngineDefaults[field],
                })
            }
            this.ref("id")
            documents.forEach(function (doc) {
                this.add(doc)
            }, this)
        })

        // // add these to the beginning and end of the array since we need them later to get an accurate count of bookmarks
        bookmark_names.unshift({
            name: "Bookmarked",
            referenceName: "bookmarked",
            count: 0,
            description:
                "Bookmarked is the default status -- it's provided just so that you can remember items to review later.",
        })
        bookmark_names.push({
            name: "Successfully Implemented",
            referenceName: "successfullyImplemented",
            count: 0,
            description:
                "Successfully Implemented is the ideal state -- it means that detections are deployed and working pretty well!",
        })

        function getKeyByValue(object, value) {
            return Object.keys(object).find((key) => object[key] === value)
        }

        // Remove duplicates from list of bookmark statuses
        const set = new Set(bookmark_names.map((item) => JSON.stringify(item)))
        bookmark_names = [...set].map((item) => JSON.parse(item))

        // since the kvstore doesn't expect a reference name we look it up based on the bookmark object in common_objects
        for (let i = 0; i < bookmark_names.length; i++) {
            if (bookmark_names[i]["referenceName"] == "") {
                bookmark_names[i]["referenceName"] = getKeyByValue(
                    window.BookmarkStatus,
                    bookmark_names[i]["name"]
                )
            }
        }

        function handleNewContentTelemetry(status, obj) {
            let allowedKeys = [
                "mitre_technique",
                "mitre_tactic",
                "killchain",
                "usecase",
                "category",
                "data_source_categories",
            ]
            let record = { status: status }
            for (let i = 0; i < allowedKeys.length; i++) {
                if (obj[allowedKeys[i]] && obj[allowedKeys[i]] != "") {
                    record[allowedKeys[i]] = obj[allowedKeys[i]]
                }
            }
            // console.log("ADDING TELEMETRY", "CustomContentCreated", record)
            require([
                "components/data/sendTelemetry",
                "json!" +
                    $C["SPLUNKD_PATH"] +
                    "/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/sse_app_config",
            ], function (Telemetry, appConfig) {
                for (let i = 0; i < appConfig.length; i++) {
                    if (
                        appConfig[i].param == "demoMode" &&
                        appConfig[i].value == "true"
                    ) {
                        record.demoMode = true
                    }
                }
                Telemetry.SendTelemetryToSplunk("CustomContentCreated", record)
            })
        }

        if ($("#newCustom").length > 0) {
            $("#newCustom").modal("hide")
        }

        var newCustomModal = new Modal(
            "newCustom",
            {
                title: "Add Custom Content",
                destroyOnHide: true,
                type: "wide",
            },
            $
        )
        var dataSources = ""
        var myKeys = Object.keys(window.allDataSources).sort()
        for (var i = 0; i < myKeys.length; i++) {
            if (myKeys[i] != "Other")
                dataSources +=
                    '<option value="' +
                    myKeys[i] +
                    '">' +
                    myKeys[i] +
                    "</option>"
        }
        dataSources += '<option value="Other">Other</option>'

        let bookmarkSelectorDropdown = ""
        for (let i = 0; i < bookmark_names.length; i++) {
            bookmarkSelectorDropdown += `<option value="${bookmark_names[i]["referenceName"]}">${bookmark_names[i]["name"]}</option>\\`
        }

        let myBodyText =
            '<table class="object">\
        <tbody>\
            <tr>\
                <tr><td colspan="2"><h2>' +
            _("Required Fields").t() +
            '</h2></td></tr>\
                <td class="prop-name">\
                    <label for="BrutusinForms#0_16" class="required">' +
            _("Name").t() +
            ':\
                        <sup>*\
                        </sup>\
                    </label>\
                </td>\
                <td class="prop-value">\
                    <input data-field="name" type="text" id="BrutusinForms#0_16" class=" ">\
                </td>\
            </tr>\
            <tr><td colspan="2">' +
            _(
                'The name of the example, e.g. "New Local Admin Account." You should have a maximum of 150 characters, and avoid crazy punctuation.'
            ).t() +
            '</td></tr>\
            <tr>\
                <td class="prop-name">\
                    <label for="BrutusinForms#inSplunk" class="required">' +
            _("Solved in Splunk").t() +
            ':\
                        <sup>*\
                        </sup>\
                    </label>\
                </td>\
                <td class="prop-value" data-children-count="2">\
                    <div><input type="radio" name="inSplunk" value="yes" data-field="inSplunk" id="BrutusinForms#inSplunk" class="   " title="" checked> ' +
            _("Solved In Splunk").t() +
            '</div>\
                    <div><input type="radio" name="inSplunk" value="no" data-field="inSplunk" id="BrutusinForms#inSplunk" class="   " title=""> ' +
            _("Solved Outside of Splunk").t() +
            '</div>\
                </td>\
            </tr>\
            <tr><td colspan="2">' +
            _(
                "If you would like to track functionality that exists in your environment, but exists outside the realm of Splunk (for example, Crowdstrike or Carbon Black detection rules tied to specific MITRE ATT&CK tactics), you can mark it as outside of Splunk here."
            ).t() +
            '</td></tr>\
            <tr id="displayapp">\
                <td class="prop-name">\
                    <label for="BrutusinForms#displayapp">' +
            _("Originating App").t() +
            ':\
                    </label>\
                </td>\
                <td class="prop-value">\
                <input data-field="displayapp" type="text" id="BrutusinForms#displayapp" class=" ">\
                </td>\
            </tr>\
            <tr>\
                <td class="prop-name">\
                    <label for="BrutusinForms#bookmarked" class="required">' +
            _("Bookmarked Status").t() +
            ':\
                        <sup>*\
                        </sup>\
                    </label>\
                </td>\
                <td class="prop-value" data-children-count="2">\
                    <select data-field="bookmark_status" id="BrutusinForms#bookmarked"\
                        class="   " title="" >\\'
        myBodyText += bookmarkSelectorDropdown
        myBodyText +=
            '</select>\
        </td>\
    </tr>\
    <tr><td colspan="2">' +
            _(
                'Bookmark Status is how SSE tracks content, either simply "bookmarked" or even tracking implementation status, e.g. "Waiting On Data" or "Successfully Implemented."'
            ).t() +
            '</td></tr>\
    <tr>\
        <td class="prop-name">\
            <label for="BrutusinForms#0_13" class="required">' +
            _("Security Data Journey").t() +
            ':\
                <sup>*\
                </sup>\
            </label>\
        </td>\
        <td class="prop-value" data-children-count="2">\
            <select data-field="securityDataJourney" id="BrutusinForms#0_13"\
                class="   " title="" >\
                <option value="Level_1">Level 1\
                </option>\
                <option value="Level_2">Level 2\
                </option>\
                <option value="Level_3">Level 3\
                </option>\
                <option value="Level_4">Level 4\
                </option>\
            </select>\
        </td>\
    </tr>\
    <tr><td colspan="2">' +
            _(
                "The stage of the Security data journey that this content will appear in."
            ).t() +
            '</td></tr>\
    <tr>\
        <td class="prop-name">\
            <label for="BrutusinForms#0_22" class="required">' +
            _("Use Case").t() +
            ':\
                <sup>*\
                </sup>\
            </label>\
        </td>\
        <td class="prop-value" data-children-count="2">\
            <select data-field="usecase" id="BrutusinForms#0_22"\
                class="   " title="" >\
                <option value=""></option>\
                <option value="Security Monitoring">' +
            _("Security Monitoring").t() +
            '\
                </option>\
                <option value="Advanced Threat Detection">' +
            _("Advanced Threat Detection").t() +
            '\
                </option>\
                <option value="Insider Threat">' +
            _("Insider Threat").t() +
            '\
                </option>\
                <option value="Compliance">' +
            _("Compliance").t() +
            '\
                </option>\
                <option value="Application Security">' +
            _("Application Security").t() +
            '\
                </option>\
                <option value="Other">' +
            _("Other").t() +
            '\
                </option>\
            </select>\
        </td>\
    </tr>\
    <tr>\
        <td class="prop-name">\
            <label for="BrutusinForms#0_9" class="required">' +
            _("Featured").t() +
            ':\
                <sup>*\
                </sup>\
            </label>\
        </td>\
        <td class="prop-value" data-children-count="2">\
            <select data-field="highlight" id="BrutusinForms#0_9"\
                class="   " title="" >\
                <option value="No">' +
            _("No").t() +
            '\
                </option>\
                <option value="Yes">' +
            _("Yes").t() +
            '\
                </option>\
            </select>\
        </td>\
    </tr>\
    <tr><td colspan="2">' +
            _(
                "Should this show up as a featured example on the main page. When we build content, we target having approximately 15% of the content be featured, just the most prominent, highest value content."
            ).t() +
            '</td></tr>\
    <tr>\
        <td class="prop-name">\
            <label for="BrutusinForms#0_1" class="required">' +
            _("Alert Volume").t() +
            ':\
                <sup>*\
                </sup>\
            </label>\
        </td>\
        <td class="prop-value" data-children-count="2">\
            <select data-field="alertvolume" id="BrutusinForms#0_1"\
                class="   " title="" >\
                <option value=""></option>\
                <option value="Very High">' +
            _("Very High").t() +
            '\
                </option>\
                <option value="High">' +
            _("High").t() +
            '\
                </option>\
                <option value="Medium">' +
            _("Medium").t() +
            '\
                </option>\
                <option value="Low">' +
            _("Low").t() +
            '\
                </option>\
                <option value="Very Low">' +
            _("Very Low").t() +
            '\
                </option>\
                <option value="Other">' +
            _("Other").t() +
            '\
                </option>\
            </select>\
        </td>\
    </tr>\
    <tr><td colspan="2">' +
            _(
                "Is this a high volume search that will create lots of noise, or a low volume / high fidelity search that a human could handle the results of?"
            ).t() +
            '</td></tr>\
    <tr>\
        <td class="prop-name">\
            <label for="BrutusinForms#severity" class="required">' +
            _("Severity").t() +
            ':\
                <sup>*\
                </sup>\
            </label>\
        </td>\
        <td class="prop-value" data-children-count="2">\
            <select data-field="severity" id="BrutusinForms#severity"\
            class="   " title="" >\
            <option value=""></option>\
            <option value="Very High">' +
            _("Very High").t() +
            '\
            </option>\
            <option value="High">' +
            _("High").t() +
            '\
            </option>\
            <option value="Medium">' +
            _("Medium").t() +
            '\
            </option>\
            <option value="Low">' +
            _("Low").t() +
            '\
            </option>\
            <option value="Very Low">' +
            _("Very Low").t() +
            '\
            </option>\
            <option value="Other">' +
            _("Other").t() +
            '\
            </option>\
            </select>\
        </td>\
    </tr>\
    <tr><td colspan="2">' +
            _(
                "Impact indicates the severity of this event when it fires. It is not directly surfaced in the UI today, but is available as an enrichment field via the | sseanalytics search command or the scripted lookup."
            ).t() +
            '</td></tr>\
    <tr>\
        <td class="prop-name">\
            <label for="BrutusinForms_category"  class="required">' +
            _("Category").t() +
            ':\
                <sup>*\
                </sup>\
            </label>\
        </td>\
        <td class="prop-value">\
            <select data-field="category" id="BrutusinForms_category"\
                class="   " title="" multiple="multiple">\
                <option value="Abuse">' +
            _("Abuse").t() +
            '</option>\
                <option value="Account Compromise">' +
            _("Account Compromise").t() +
            '</option>\
                <option value="Account Sharing">' +
            _("Account Sharing").t() +
            '</option>\
                <option value="Adversary Tactics">' +
            _("Adversary Tactics").t() +
            '</option>\
                <option value="Best Practices">' +
            _("Best Practices").t() +
            '</option>\
                <option value="Cloud Security">' +
            _("Cloud Security").t() +
            '</option>\
                <option value="Command and Control">' +
            _("Command and Control").t() +
            '</option>\
                <option value="Compliance">' +
            _("Compliance").t() +
            '</option>\
                <option value="Data Exfiltration">' +
            _("Data Exfiltration").t() +
            '</option>\
                <option value="Denial of Service">' +
            _("Denial of Service").t() +
            '</option>\
                <option value="Endpoint Compromise">' +
            _("Endpoint Compromise").t() +
            '</option>\
                <option value="GDPR">' +
            _("GDPR").t() +
            '</option>\
                <option value="IAM Analytics">' +
            _("IAM Analytics").t() +
            '</option>\
                <option value="Insider Threat">' +
            _("Insider Threat").t() +
            '</option>\
                <option value="Lateral Movement">' +
            _("Lateral Movement").t() +
            '</option>\
                <option value="Malware">' +
            _("Malware").t() +
            '</option>\
                <option value="Network Attack">' +
            _("Network Attack").t() +
            '</option>\
                <option value="Operations">' +
            _("Operations").t() +
            '</option>\
                <option value="Other">' +
            _("Other").t() +
            '</option>\
                <option value="Privilege Escalation">' +
            _("Privilege Escalation").t() +
            '</option>\
                <option value="Ransomware">' +
            _("Ransomware").t() +
            '</option>\
                <option value="SaaS">' +
            _("SaaS").t() +
            '</option>\
                <option value="Scanning">' +
            _("Scanning").t() +
            '</option>\
                <option value="Shadow IT">' +
            _("Shadow IT").t() +
            '</option>\
                <option value="Threat Intelligence">' +
            _("Threat Intelligence").t() +
            '</option>\
                <option value="Unauthorized Software">' +
            _("Unauthorized Software").t() +
            '</option>\
                <option value="Vulnerability">' +
            _("Vulnerability").t() +
            '</option>\
                <option value="Web Attack">' +
            _("Web Attack").t() +
            '</option>\
            </select>\
        </td>\
    </tr>\
    <tr>\
        <td class="prop-name">\
            <label for="BrutusinForms#dsc" class="required">' +
            _("Data Source Category or Categories").t() +
            ':\
                <sup>*\
                </sup>\
            </label>\
        </td>\
        <td class="prop-value">\
        </td>\
    </tr>\
    <tr><td colspan="2"><div id="data_source_categories"></div></td></tr>\
    <tr>\
        <td class="prop-name">\
            <label for="BrutusinForms#0_4" class="required">' +
            _("Description").t() +
            ':\
                <sup>*\
                </sup>\
            </label>\
        </td>\
        <td class="prop-value">\
            <textarea style="width: 100%; height: 200px;" data-field="description" id="BrutusinForms#0_4" class=" "></textarea>\
        </td>\
    </tr>\
    <tr><td colspan="2">' +
            _(
                "This is the key description of your custom content. Should generally be under 250-300 characters."
            ).t() +
            '</td></tr>\
    <!--<tr>\
        <td class="prop-name">\
            <label for="BrutusinForms#0_5" class="required">' +
            _("App Display Name").t() +
            ':\
                <sup>*\
                </sup>\
            </label>\
        </td>\
        <td class="prop-value">\
            <input data-field="displayapp" default="Splunk Security Essentials" type="text" id="BrutusinForms#0_5" class=" " value="Splunk Security Essentials">\
        </td>\
    </tr>\
    <tr><td colspan="2">' +
            _(
                "The display name of the app that provides this content (frequently Splunk Security Essentials)."
            ).t() +
            '</td></tr>\
    <tr>\
        <td class="prop-name">\
            <label for="BrutusinForms#0_5" class="required">' +
            _("App Real Name").t() +
            ':\
                <sup>*\
                </sup>\
            </label>\
        </td>\
        <td class="prop-value">\
            <input data-field="displayapp" default="Splunk_Security_Essentials" type="text" id="BrutusinForms#0_5" class=" " value="Splunk_Security_Essentials">\
        </td>\
    </tr>\
    <tr><td colspan="2">' +
            _(
                "The app ID of the app that provides this content (frequently Splunk_Security_Essentials)."
            ).t() +
            '</td></tr>\
    --></tbody></table>\
    <table class="dvexpand table table-chrome"><thead><tr><th colspan="2" class="expands">\
    <h2 style="line-height: 1.5em; font-size: 1.2em; margin-top: 0; margin-bottom: 0;"><a href="#" class="dropdowntext" style="color: black;" onclick=\'$("#customContentMetadata").toggle(); if($("#customContentMetadata_arrow").attr("class")=="icon-chevron-right"){$("#customContentMetadata_arrow").attr("class","icon-chevron-down"); $("#customContentMetadata_table").addClass("expanded"); $("#customContentMetadata_table").removeClass("table-chrome");  $("#customContentMetadata_table").find("th").css("border-top","1px solid darkgray");  }else{$("#customContentMetadata_arrow").attr("class","icon-chevron-right");  $("#customContentMetadata_table").removeClass("expanded");  $("#customContentMetadata_table").addClass("table-chrome"); } return false;\'>&nbsp;&nbsp;<i id="customContentMetadata_arrow" class="icon-chevron-right"></i>\
    Metadata Fields</a></h2></th></tr></thead><tbody style="display: none" id="customContentMetadata">\
    <tr>\
        <td class="prop-name">\
            <label for="BrutusinForms#0_6" class="">' +
            _("Security Domain").t() +
            ':\
                <sup>\
                </sup>\
            </label>\
        </td>\
        <td class="prop-value" data-children-count="2">\
            <select data-field="domain" id="BrutusinForms#0_6"\
                class="   " title="" >\
                <option value=""></option>\
                <option value="Access">' +
            _("Access").t() +
            '\
                </option>\
                <option value="Audit">' +
            _("Audit").t() +
            '\
                </option>\
                <option value="Data">' +
            _("Data").t() +
            '\
                </option>\
                <option value="Endpoint">' +
            _("Endpoint").t() +
            '\
                </option>\
                <option value="Identity">' +
            _("Identity").t() +
            '\
                </option>\
                <option value="Network">' +
            _("Network").t() +
            '\
                </option>\
                <option value="Operations">' +
            _("Operations").t() +
            '\
                </option>\
                <option value="Other">' +
            _("Other").t() +
            '\
                </option>\
                <option value="Threat">' +
            _("Threat").t() +
            '\
                </option>\
            </select>\
        </td>\
    </tr>\
    <tr>\
        <td class="prop-name">\
            <label for="BrutusinForms#killchain" class="">' +
            _("Kill Chain Phase").t() +
            ':\
                <sup>\
                </sup>\
            </label>\
        </td>\
        <td class="prop-value">\
            <select data-field="killchain" id="BrutusinForms#killchain"\
                class="   " title="" >\
                <option value=""></option>\
                <option value="Reconnaissance">' +
            _("Reconnaissance").t() +
            '\
                </option>\
                <option value="Weaponization">' +
            _("Weaponization").t() +
            '\
                </option>\
                <option value="Delivery">' +
            _("Delivery").t() +
            '\
                </option>\
                <option value="Exploitation">' +
            _("Exploitation").t() +
            '\
                </option>\
                <option value="Installation">' +
            _("Installation").t() +
            '\
                </option>\
                <option value="Command and Control">' +
            _("Command & Control").t() +
            '\
                </option>\
                <option value="Actions On Objectives">' +
            _("Actions On Objectives").t() +
            '\
                </option>\
            </select>\
        </td>\
    </tr>\
    <tr><td colspan="2"><a href="https://en.wikipedia.org/wiki/Kill_chain" class="ext external external-link drilldown">' +
            _("Wikipedia Reference").t() +
            '</a></td></tr>\
    <tr>\
        <td class="prop-name">\
            <label for="BrutusinForms#0_0" class="">' +
            _("SPL Ease").t() +
            ':\
                <sup>\
                </sup>\
            </label>\
        </td>\
        <td class="prop-value" data-children-count="2">\
            <select data-field="SPLEase" id="BrutusinForms#0_0"\
                class="   " title="" >\
                <option value=""></option>\
                <option value="Advanced">' +
            _("Advanced").t() +
            '\
                </option>\
                <option value="Basic">' +
            _("Basic").t() +
            '\
                </option>\
                <option value="Hard">' +
            _("Hard").t() +
            '\
                </option>\
                <option value="Medium">' +
            _("Medium").t() +
            '\
                </option>\
                <option value="None">' +
            _("None").t() +
            '\
                </option>\
            </select>\
        </td>\
    </tr>\
    <tr><td colspan="2">' +
            _(
                "How easy is this SPL to understand (for those looking at SSE just as a learning tool)."
            ).t() +
            '</td></tr>\
    <tr>\
        <td class="prop-name">\
            <label class="">' +
            _("MITRE ATT&CK").t() +
            ':\
                <sup>\
                </sup>\
            </label>\
        </td>\
        <td class="prop-value">\
        </td>\
    </tr>\
    <tr><td colspan="2"><div id="mitre_container"></div></td></tr>\
    <tr>\
        <td class="prop-name">\
            <label for="BrutusinForms#0_21" class="">' +
            _("Search Keywords").t() +
            ':\
                <sup>\
                </sup>\
            </label>\
        </td>\
        <td class="prop-value">\
            <input data-field="searchkeywords" type="text" id="BrutusinForms#0_21" class=" ">\
        </td>\
    </tr>\
    <tr><td colspan="2">' +
            _(
                'The in-browser search keywords automatically indexes the description, title, category, use case, how to respond, how to implement, known false positives, and help. But if you want to add some highly-weighted custom words (e.g., "AWS cloudtrail amazon web services") then you can add them here, space separated.'
            ).t() +
            '</td></tr>\
    <tr>\
        <td class="prop-name">\
            <label for="BrutusinForms#advanced" class="">' +
            _("Advanced Tags").t() +
            ':\
                <sup>\
                </sup>\
            </label>\
        </td>\
        <td class="prop-value">\
            <input data-field="advancedtags" type="text" id="BrutusinForms#advanced" class=" ">\
        </td>\
    </tr>\
    <tr><td colspan="2">' +
            _(
                'You can optionally add advanced tags here, which will show up in the Advanced filter. For multiple tags, separate with pipes (e.g., "Development|Cool Search|Mary")'
            ).t() +
            '</td></tr>\
    <tr>\
        <td class="prop-name">\
            <label for="BrutusinForms#0_18" class="">' +
            _("Printable Image URL").t() +
            ':\
                <sup>\
                </sup>\
            </label>\
        </td>\
        <td class="prop-value">\
            <input data-field="printable_image" type="text" id="BrutusinForms#0_18" class=" " />\
        </td>\
    </tr>\
    <tr><td colspan="2">' +
            _(
                "Optional field: When creating a PDF export, we will include a screenshot showing the demo results."
            ).t() +
            '</td></tr>\
    <tr>\
        <td class="prop-name">\
            <label for="BrutusinForms#0_11" class="">' +
            _("Icon").t() +
            ':\
                <sup>\
                </sup>\
            </label>\
        </td>\
        <td class="prop-value">\
            <input type="text" data-field="icon" id="BrutusinForms#0_11" class=" ">\
        </td>\
    </tr>\
    <tr><td colspan="2">' +
            _(
                "The icon that shows up on the main Security Content page (or wherever the tile exists)."
            ).t() +
            '</td></tr>\
    <tr>\
        <td class="prop-name">\
            <label class="">' +
            _("Company Logo").t() +
            ':\
                <sup>\
                </sup>\
            </label>\
        </td>\
        <td class="prop-value">\
        <label for="BrutusinForms#company_logo">URL</label>\
        <input type="text" data-field="company_logo" id="BrutusinForms#company_logo" class=" ">\
        <label for="BrutusinForms#company_logo_width">Width (Pixels)</label>\
        <input type="text" data-field="company_logo_width" id="BrutusinForms#company_logo_width" class=" ">\
        <label for="BrutusinForms#company_logo_height">Height (Pixels)</label>\
        <input type="text" data-field="company_logo_height" id="BrutusinForms#company_logo_height" class=" ">\
        </td>\
    </tr>\
    <tr><td colspan="2">' +
            _(
                "If you would like to present a logo for your organization when a user views this content, provide the URL and dimensions here. The height may not be more than 250 px, and the width may not be more than 500 pixels. For a good user experience, it is recommended not going more than 400x150px."
            ).t() +
            '</td></tr>\
    <tr>\
        <td class="prop-name">\
            <label for="BrutusinForms#company_name" class="">' +
            _("Company Name").t() +
            ':\
                <sup>\
                </sup>\
            </label>\
        </td>\
        <td class="prop-value">\
            <input type="text" data-field="company_name" id="BrutusinForms#company_name" class=" ">\
        </td>\
    </tr>\
    <tr><td colspan="2">' +
            _(
                "If you would like to present the name for your organization when a user views this content, insert the name here."
            ).t() +
            '</td></tr>\
    <tr>\
        <td class="prop-name">\
            <label for="BrutusinForms#company_description" class="">' +
            _("Company Description").t() +
            ':\
                <sup>\
                </sup>\
            </label>\
        </td>\
        <td class="prop-value">\
            <textarea style="width: 100%; height: 200px;" data-field="company_description" id="BrutusinForms#company_description" class=" " ></textarea>\
        </td>\
    </tr>\
    <tr><td colspan="2">' +
            _(
                "If you would like to present a description of your company when a user views this content, insert it here."
            ).t() +
            '</td></tr>\
    <tr>\
        <td class="prop-name">\
            <label for="BrutusinForms#company_link" class="">' +
            _("Company Link").t() +
            ':\
                <sup>\
                </sup>\
            </label>\
        </td>\
        <td class="prop-value">\
            <input type="text" data-field="company_link" id="BrutusinForms#company_link" class=" ">\
        </td>\
    </tr>\
    <tr><td colspan="2">' +
            _(
                'If you would like a "Learn More" link to appear after the description when a user views this content, provide the URL here.'
            ).t() +
            '</td></tr>\
    <tr>\
        <td class="prop-name">\
            <label for="BrutusinForms#0_3" class="">' +
            _("Dashboard").t() +
            ':\
                <sup>\
                </sup>\
            </label>\
        </td>\
        <td class="prop-value">\
            <input data-field="dashboard" type="text" id="BrutusinForms#0_3" class=" ">\
        </td>\
    </tr>\
    <tr><td colspan="2">' +
            _(
                "If you want to have users go to a dashboard when they click on the name, provide that dashboard name here."
            ).t() +
            '</td></tr>\
    </tbody></table>\
    <table class="dvexpand table table-chrome"><thead><tr><th colspan="2" class="expands">\
    <h2 style="line-height: 1.5em; font-size: 1.2em; margin-top: 0; margin-bottom: 0;"><a href="#" class="dropdowntext" style="color: black;" onclick=\'$("#customContentDescriptive").toggle(); if($("#customContentDescriptive_arrow").attr("class")=="icon-chevron-right"){$("#customContentDescriptive_arrow").attr("class","icon-chevron-down"); $("#customContentDescriptive_table").addClass("expanded"); $("#customContentDescriptive_table").removeClass("table-chrome");  $("#customContentDescriptive_table").find("th").css("border-top","1px solid darkgray");  }else{$("#customContentDescriptive_arrow").attr("class","icon-chevron-right");  $("#customContentDescriptive_table").removeClass("expanded");  $("#customContentDescriptive_table").addClass("table-chrome"); } return false;\'>&nbsp;&nbsp;<i id="customContentDescriptive_arrow" class="icon-chevron-right"></i>\
    Descriptive Fields</a></h2></th></tr></thead><tbody style="display: none" id="customContentDescriptive">\
    <tr>\
        <td class="prop-name">\
            <label for="BrutusinForms#0_20" class="">' +
            _("Security Impact").t() +
            ':\
                <sup>\
                </sup>\
            </label>\
        </td>\
        <td class="prop-value">\
            <textarea style="width: 100%; height: 200px;" data-field="relevance" type="text" id="BrutusinForms#0_20" class=" " ></textarea>\
        </td>\
    </tr>\
    <tr><td colspan="2">' +
            _(
                "(Recommended) Text describing in lamens terms why this content is important."
            ).t() +
            '</td></tr>\
    <tr>\
        <td class="prop-name">\
            <label for="BrutusinForms#0_8" class="">' +
            _("Help").t() +
            ':\
                <sup>\
                </sup>\
            </label>\
        </td>\
        <td class="prop-value">\
            <textarea style="width: 100%; height: 200px;" data-field="help" id="BrutusinForms#0_8" class=" " ></textarea>\
        </td>\
    </tr>\
    <tr><td colspan="2">' +
            _(
                "The value for the help field (less prominently displayed, generally less important)"
            ).t() +
            '</td></tr>\
    <tr>\
        <td class="prop-name">\
            <label for="BrutusinForms#0_10" class="">' +
            _("How to Implement").t() +
            ':\
                <sup>\
                </sup>\
            </label>\
        </td>\
        <td class="prop-value">\
            <textarea style="width: 100%; height: 200px;" data-field="howToImplement" id="BrutusinForms#0_10" class=" " ></textarea>\
        </td>\
    </tr>\
    <tr>\
        <td class="prop-name">\
            <label for="BrutusinForms#0_14" class="">' +
            _("Known False Positives").t() +
            ':\
                <sup>\
                </sup>\
            </label>\
        </td>\
        <td class="prop-value">\
            <textarea style="width: 100%; height: 200px;" data-field="knownFP" id="BrutusinForms#0_14" class=" " ></textarea>\
        </td>\
    </tr>\
    <tr><td colspan="2">' +
            _(
                "Optional text describing the known false positives that will be created for this search."
            ).t() +
            '</td></tr>\
    <tr>\
        <td class="prop-name">\
            <label for="BrutusinForms#0_17" class="">' +
            _("How to Respond").t() +
            ':\
                <sup>\
                </sup>\
            </label>\
        </td>\
        <td class="prop-value">\
            <textarea style="width: 100%; height: 200px;" data-field="operationalize" type="text" id="BrutusinForms#0_17" class=" " ></textarea>\
        </td>\
    </tr>\
    <tr><td colspan="2">' +
            _(
                "Optional text describing the how to respond when this search fires."
            ).t() +
            '</td></tr></tbody></table>\
    <table class="dvexpand table table-chrome"><thead><tr><th colspan="2" class="expands">\
    <h2 style="line-height: 1.5em; font-size: 1.2em; margin-top: 0; margin-bottom: 0;"><a href="#" class="dropdowntext" style="color: black;" onclick=\'$("#customContentSearch").toggle(); if($("#customContentSearch_arrow").attr("class")=="icon-chevron-right"){$("#customContentSearch_arrow").attr("class","icon-chevron-down"); $("#customContentSearch_table").addClass("expanded"); $("#customContentSearch_table").removeClass("table-chrome");  $("#customContentSearch_table").find("th").css("border-top","1px solid darkgray");  }else{$("#customContentSearch_arrow").attr("class","icon-chevron-right");  $("#customContentSearch_table").removeClass("expanded");  $("#customContentSearch_table").addClass("table-chrome"); } return false;\'>&nbsp;&nbsp;<i id="customContentSearch_arrow" class="icon-chevron-right"></i>\
    Search Fields</a></h2></th></tr></thead><tbody style="display: none" id="customContentSearch">\
    <tr>\
        <td class="prop-name">\
            <label for="BrutusinForms#search" class="">' +
            _("Search").t() +
            ':\
                <sup>\
                </sup>\
            </label>\
        </td>\
        <td class="prop-value">\
            <textarea style="width: 100%; height: 200px;" data-field="search" id="BrutusinForms#search" class=" " ></textarea>\
        </td>\
    </tr>\
</tbody>\
</table>'
        const myBody = $(myBodyText)
        function getBodyElem(fieldName, fieldType = "data-field") {
            return myBody.find(`[${fieldType}="${fieldName}"]`)
        }

        let fillFromSavedSearchButton = $(
            '<button id="fillFromSavedSearchButton" class="btn-primary">' +
                _("Create From Local Saved Search").t() +
                "</button>"
        ).click(function (evt) {
            let summary = {}
            //let content = JSON.parse($(evt.target).closest("tr").attr("data-content"))
            //let search_title = $(evt.target).closest("tr").attr("data-searchname")
            //console.log("Running New for", content)
            SavedSearchSelectorModal = generateSavedSearchSelectorModal()
                .then((returnedModal) => {
                    newCustomModal.hide()

                    $("h3.modal-title").text(
                        "Select local saved search to fill form and map to the new custom content"
                    )
                    $("table#contentList").on("update", function () {
                        $(".action_acceptRecommendation").click(function (evt) {
                            let content = JSON.parse(
                                $(evt.target).closest("tr").attr("data-content")
                            )
                            let search_title = $(evt.target)
                                .closest("tr")
                                .attr("data-searchname")
                            //let newShowcaseId = "custom_" + search_title.replace(/ /g, "_").replace(/[^a-zA-Z0-9_]/g, "");
                            summary = {
                                name: content.search.displayTitle,
                                displayapp: "Custom Content",
                                app: content.search.app,
                                description: content.search.description,
                                bookmark_status: "successfullyImplemented",
                                bookmark_user: $C["USERNAME"],
                                search: content.search.search,
                                search_title: content.search.displayTitle,
                                data_source_categories:
                                    content.search.data_source_category,
                                inSplunk: "yes",
                                //,"id": newShowcaseId
                            }
                            //Generate a showcaseId from the saved search title
                            showcaseId = search_title
                                .replace(/[^a-zA-Z0-9 ]/g, "")
                                .replace(/[^a-zA-Z0-9]/g, "_")
                            returnedModal.hide()

                            customContentModal(
                                function (showcaseId, summary) {
                                    $.ajax({
                                        url:
                                            $C["SPLUNKD_PATH"] +
                                            "/services/SSEShowcaseInfo?locale=" +
                                            window.localeString +
                                            "&bust=" +
                                            Math.round(
                                                Math.random() * 20000000
                                            ),
                                        async: true,
                                        success: async function (returneddata) {
                                            let summary =
                                                returneddata.summaries[
                                                    showcaseId
                                                ]
                                            console.log("Successfully Got it back", showcaseId, summary)
                                            ShowcaseInfo.summaries[showcaseId] =
                                                summary
                                            ShowcaseInfo.roles.default.summaries.push(
                                                showcaseId
                                            )
                                            addContentMapping(
                                                search_title,
                                                showcaseId
                                            )
                                            await ProcessSummaryUI.addItem_async(
                                                $,
                                                ShowcaseInfo,
                                                summary
                                            )
                                        },
                                    })
                                },
                                summary,
                                content["search"]["extractions"]
                            )
                        })
                    })
                    $("table#contentList").trigger("update")
                })
                .catch((err) => {
                    console.log("Error : ", err)
                })
        })

        var SSEContentModal = new Modal(
            "newCustom1",
            {
                title: "Select SSE content to fill form and map to the new custom content",
                destroyOnHide: true,
            },
            $
        )

        var Loader = $(
            '<div class="loader" id="loading" style="margin-right: auto; margin-left: auto;"></div>'
        )

        async function addUseCase(summaryIdList) {
            let tiles = $('<ul class="showcase-list"></ul>')

            for (const summaryId of summaryIdList) {
                let tile = $(
                    BuildTile.build_tile(
                        localShowcaseInfo.summaries[summaryId],
                        true
                    )
                )
                let journeyStage = tile.find("a[href^=journey]").text()
                let dashboardhref = tile.find("a").first().attr("href")
                tile.attr("data-showcaseid", summaryId)
                // console.log("Got my dashboardhref", dashboardhref)
                while (tile.find("a").length > 0) {
                    tile.find("a")[0].outerHTML = tile
                        .find("a")[0]
                        .outerHTML.replace(/^<a/, "<span")
                        .replace(/<\/a>/, "</span>")
                }

                tile.click(function (event) {
                    let target = $(event.target)
                    let showcaseId = target
                        .closest("li")
                        .find(".contentstile")
                        .attr("data-showcaseid")
                    let selectedSummary = JSON.parse(
                        JSON.stringify(localShowcaseInfo.summaries[showcaseId])
                    )
                    if (selectedSummary.id) delete selectedSummary.id
                    if (selectedSummary.dashboard)
                        delete selectedSummary.dashboard
                    if (selectedSummary.category) {
                        selectedSummary.category =
                            selectedSummary.category.split("|")
                    }
                    SSEContentModal.hide()
                    customContentModal(function (showcaseId, summary) {
                        // console.log("Successfully Edited", showcaseId, summary);
                        // There's some processing that occurs in SSEShowcaseInfo and we want to get the full detail here.
                        $.ajax({
                            url:
                                $C["SPLUNKD_PATH"] +
                                "/services/SSEShowcaseInfo?locale=" +
                                window.localeString +
                                "&bust=" +
                                Math.round(Math.random() * 20000000),
                            async: true,
                            success: function (returneddata) {
                                let summary = returneddata.summaries[showcaseId]
                                ShowcaseInfo.summaries[showcaseId] = summary
                                ProcessSummaryUI.addItem_async(
                                    $,
                                    ShowcaseInfo,
                                    summary
                                )
                            },
                        })
                    }, selectedSummary)
                    console.log("Clicked ===> ", target, showcaseId)
                })

                tile.find("a[href^=journey]").replaceWith(
                    '<span style="font-weight: normal">Journey ' +
                        journeyStage +
                        "</span>"
                )

                tile.prepend(
                    '<a href="' +
                        dashboardhref +
                        '" style="float: right" class="external drilldown-icon" target="_blank"></a>'
                )
                tiles.append(
                    $('<li style="width: 230px; height: 320px"></li>').append(
                        tile
                    )
                )
            }

            return tiles
        }

        async function doSearch() {
            $("#searchResults").html(Loader)
            let results = index.search($("#searchBar").val())
            let resultIds = results.map((result) => result.ref)
            let resultHtml = await addUseCase(resultIds)
            if (resultHtml) {
                $("#searchResults").html(resultHtml)
            }
        }

        let createExistingContentInSSE = $(
            '<button id="createExistingContentInSSE" class="btn-primary">' +
                _("Create Existing Content In Security Essentials").t() +
                "</button>"
        )
            .css({ "margin-left": "20px" })
            .click(async function (event) {
                newCustomModal.hide()
                $(SSEContentModal.$el).addClass("modal-extra-wide")

                let body = $("<div>")
                var timeoutId = 0
                body.append(
                    '<input id="searchBar" type="text" style="width: 300px; margin-top: 20px;" aria-label="Input" placeholder="Enter Search Here..." />'
                ).on("keyup", function (event) {
                    let code = event.keyCode || event.which
                    if (code == 13) {
                        clearTimeout(timeoutId)
                        doSearch()
                    } else if (event.target.value.length >= 4) {
                        clearTimeout(timeoutId)
                        timeoutId = setTimeout(doSearch, 500)
                    }
                })
                body.append('<div id="searchResults"></div>')
                $("#searchResults").html(Loader)
                SSEContentModal.body.html(body)
                SSEContentModal.footer.append(
                    $("<button>")
                        .attr({
                            type: "button",
                            "data-dismiss": "modal",
                            "data-bs-dismiss": "modal",
                            "data-dismiss": "modal",
                        })
                        .addClass("btn btn-primary")
                        .text("Cancel")
                        .on("click", function () {
                            // Not taking any action here
                        })
                )
                SSEContentModal.show()
                let resultHtml = await addUseCase(
                    Object.keys(localShowcaseInfo.summaries)
                )
                $("#searchResults").html(resultHtml)
            })
        myBody.first().prepend(createExistingContentInSSE)
        myBody.first().prepend(fillFromSavedSearchButton)
        window.summary = summary

        let mitre = SummarizeMitre(mitre_attack)
        window.mitre = mitre
        window.active_techniques = []
        window.active_sub_techniques = []
        window.active_tactics = []
        window.mitre_notes = ""
        window.active_datasources = []

        if (summary) {
            // console.log("Running customContentModal on showcase", summary)
            if (summary.mitre_technique) {
                summary.mitre_technique = summary.mitre_technique
                    .replace(/^\|/, "")
                    .replace(/\|$/, "")
                window.active_techniques = summary.mitre_technique.split(/\|/)
            }
            if (summary.mitre_sub_technique) {
                summary.mitre_sub_technique = summary.mitre_sub_technique
                    .replace(/^\|/, "")
                    .replace(/\|$/, "")
                window.active_sub_techniques =
                    summary.mitre_sub_technique.split(/\|/)
            }
            if (summary.mitre_tactic) {
                summary.mitre_tactic = summary.mitre_tactic
                    .replace(/^\|/, "")
                    .replace(/\|$/, "")
                window.active_tactics = summary.mitre_tactic.split(/\|/)
            }
            if (summary.mitre_notes) {
                window.mitre_notes = summary.mitre_notes
            }
            if (summary.data_source_categories) {
                summary.data_source_categories = summary.data_source_categories
                    .replace(/^\|/, "")
                    .replace(/\|$/, "")
                window.active_datasources =
                    summary.data_source_categories.split(/\|/)
                // console.log("Setting data sources to ", window.active_datasources)
            }
            const RADIO_FIELD = "inSplunk"
            for (field in summary) {
                if (field === RADIO_FIELD) {
                    continue // do not set the radio button here.
                }
                const dataField = getBodyElem(field)
                if (dataField.length > 0) {
                    dataField.val(summary[field])
                }
            }
            // set the radio inSplunk here:
            const radios = getBodyElem(RADIO_FIELD, "name")
            if (radios.length > 1) {
                const yesInSplunk = summary[RADIO_FIELD] === "yes"
                radios[0].checked = yesInSplunk // "Solved in Splunk"
                radios[1].checked = !yesInSplunk // "Solved Outside of Splunk"
            }

            const descrElem = getBodyElem("description")
            if (
                typeof descrEelem != "undefined" &&
                descrElem.val().length == 0
            ) {
                let default_description =
                    'Generated by the Splunk Security Essentials app from the saved search "' +
                    getBodyElem("name").val() +
                    '" at ' +
                    new Date().toUTCString()
                descrEelem.val(default_description)
            }
        }
        if (potentialExtractions) {
            if (
                potentialExtractions["alertvolume"] &&
                potentialExtractions["alertvolume"] != "" &&
                potentialExtractions["alertvolume"] != null
            ) {
                let success = false
                let options = []
                let select = getBodyElem("alertvolume")
                for (let i = 0; i < select.find("option").length; i++) {
                    let option = $(select.find("option")[i]).attr("value")
                    if (option != "") {
                        options.push(option)
                    }
                }
                if (options.indexOf(potentialExtractions["alertvolume"]) >= 0) {
                    select.val(potentialExtractions["alertvolume"])
                    success = true
                }
                if (!success) {
                    myBody
                        .first()
                        .prepend(
                            '<div style="background-color: #FFAEAE; border: 1px solid #DF4141; border-radius: 6px;">' +
                                _(
                                    "Warning, heuristics extracted a potential Alert Volume but couldn't match it:"
                                ).t() +
                                " " +
                                potentialExtractions["confidence"] +
                                "</div>"
                        )
                }
            }
            if (
                potentialExtractions["impact"] &&
                potentialExtractions["impact"] != "" &&
                potentialExtractions["impact"] != null
            ) {
                let success = false
                let options = []
                let select = getBodyElem("severity")
                for (let i = 0; i < select.find("option").length; i++) {
                    let option = $(select.find("option")[i]).attr("value")
                    if (option != "") {
                        options.push(option)
                    }
                }
                if (options.indexOf(potentialExtractions["impact"]) >= 0) {
                    select.val(potentialExtractions["impact"])
                    success = true
                }
                if (!success) {
                    myBody
                        .first()
                        .prepend(
                            '<div style="background-color: #FFAEAE; border: 1px solid #DF4141; border-radius: 6px;">' +
                                _(
                                    "Warning, heuristics extracted a potential severity but couldn't match it:"
                                ).t() +
                                " " +
                                potentialExtractions["severity"] +
                                "</div>"
                        )
                }
            }
            if (potentialExtractions.technique) {
                let success = false
                if (mitre.technique_master[potentialExtractions.technique]) {
                    active_techniques.push(potentialExtractions.technique)
                    success = true
                    if (!potentialExtractions.tactic) {
                        for (
                            let i = 0;
                            i <
                            mitre.technique_to_tactic[
                                potentialExtractions.technique
                            ].length;
                            i++
                        ) {
                            active_tactics.push(
                                mitre.technique_to_tactic[
                                    potentialExtractions.technique
                                ][i]
                            )
                        }
                    }
                } else if (
                    mitre.sub_technique_master[potentialExtractions.technique]
                ) {
                    active_sub_techniques.push(potentialExtractions.technique)
                    success = true
                    if (!potentialExtractions.tactic) {
                        for (
                            let i = 0;
                            i <
                            mitre.technique_to_tactic[
                                potentialExtractions.technique
                            ].length;
                            i++
                        ) {
                            active_tactics.push(
                                mitre.technique_to_tactic[
                                    potentialExtractions.technique
                                ][i]
                            )
                        }
                    }
                } else {
                    for (let technique in mitre.technique_master) {
                        if (
                            typeof mitre.technique_master[technique] !=
                                "undefined" &&
                            (potentialExtractions.technique == technique ||
                                potentialExtractions.technique.includes(
                                    technique
                                ))
                        ) {
                            active_techniques.push(technique)
                            success = true
                            if (
                                !potentialExtractions.tactic ||
                                potentialExtractions.tactic == "" ||
                                potentialExtractions["tactic"] == null
                            ) {
                                for (
                                    let i = 0;
                                    i <
                                    mitre.technique_to_tactic[technique].length;
                                    i++
                                ) {
                                    active_tactics.push(
                                        mitre.technique_to_tactic[technique][i]
                                    )
                                }
                            }
                        }
                    }
                    for (let technique in mitre.sub_technique_master) {
                        if (
                            typeof mitre.sub_technique_master[technique] !=
                                "undefined" &&
                            (potentialExtractions.technique == technique ||
                                potentialExtractions.technique.includes(
                                    technique
                                ))
                        ) {
                            active_sub_techniques.push(technique)
                            success = true
                            console.log(
                                "found sub technique 2",
                                potentialExtractions.technique
                            )
                            if (
                                !potentialExtractions.tactic ||
                                potentialExtractions.tactic == "" ||
                                potentialExtractions["tactic"] == null
                            ) {
                                if (
                                    typeof mitre.technique_to_tactic[
                                        technique.split(".")[0]
                                    ] != "undefined"
                                ) {
                                    for (
                                        let i = 0;
                                        i <
                                        mitre.technique_to_tactic[
                                            technique.split(".")[0]
                                        ].length;
                                        i++
                                    ) {
                                        active_tactics.push(
                                            mitre.technique_to_tactic[
                                                technique.split(".")[0]
                                            ][i]
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
                if (!success) {
                    myBody
                        .first()
                        .prepend(
                            '<div style="background-color: #FFAEAE; border: 1px solid #DF4141; border-radius: 6px;">' +
                                _(
                                    "Warning, heuristics extracted a potential technique but couldn't match it:"
                                ).t() +
                                " " +
                                potentialExtractions["technique"] +
                                "</div>"
                        )
                }
            }
            if (
                potentialExtractions["tactic"] &&
                potentialExtractions["tactic"] != "" &&
                potentialExtractions["tactic"] != null
            ) {
                let success = false
                if (mitre.allTactics[potentialExtractions["tactic"]]) {
                    active_tactics.push(potentialExtractions["tactic"])
                    success = true
                } else {
                    for (let tactic in mitre.allTactics) {
                        if (
                            potentialExtractions["tactic"] ==
                            mitre.allTactics[tactic]["name"]
                        ) {
                            active_tactics.push(tactic)
                            success = true
                        }
                    }
                }
                if (!success) {
                    myBody
                        .first()
                        .prepend(
                            '<div style="background-color: #FFAEAE; border: 1px solid #DF4141; border-radius: 6px;">' +
                                _(
                                    "Warning, heuristics extracted a potential tactic but couldn't match it:"
                                ).t() +
                                " " +
                                potentialExtractions["tactic"] +
                                "</div>"
                        )
                }
            }
        }

        function launchNotesWindow(target) {
            let showcaseId = target.closest(".showcase").attr("id")
            let existingNotes = window.mitre_notes

            require([
                "jquery",
                Splunk.util.make_full_url(
                    "/static/app/Splunk_Security_Essentials/components/controls/Modal.js"
                ),
            ], function ($, Modal) {
                // Now we initialize the Modal itself
                var myModal = new Modal(
                    "addNotes",
                    {
                        title: "Add MITRE Notes",
                        backdrop: "static",
                        keyboard: false,
                        destroyOnHide: true,
                        type: "normal",
                    },
                    $
                )

                $(myModal.$el).on("show", function () {})
                myModal.body.append(
                    $("<p>").text(
                        _(
                            "Insert Notes Below, and click Save to record those notes for the future."
                        ).t()
                    ),
                    $(
                        '<textarea showcaseid="' +
                            showcaseId +
                            '" id="method_notes" style="width: 100%; height: 300px;"></textarea>'
                    ).text(existingNotes)
                )

                myModal.footer.append(
                    $("<button>")
                        .attr({
                            type: "button",
                            "data-dismiss": "modal",
                            "data-bs-dismiss": "modal",
                        })
                        .addClass("btn ")
                        .text("Cancel")
                        .on("click", function () {
                            // Not taking any action here
                        }),
                    $("<button>")
                        .attr({
                            type: "button",
                        })
                        .addClass("btn btn-primary")
                        .text("Save")
                        .on("click", function () {
                            let showcaseId =
                                $("#method_notes").attr("showcaseid")
                            window.mitre_notes = $("#method_notes").val()
                            //ShowcaseInfo['summaries'][showcaseId]['mitre_notes'] = notes;
                            $(".methodology-notes").text(window.mitre_notes)
                            $("[data-bs-dismiss=modal").click()
                        })
                )
                myModal.show() // Launch it!
            })
        }

        function GenerateListOfMITRETechniques(tactic, tacticId) {
            let container = $("<div>")
            container.append(
                '<h3 class="add_description">' +
                    _("Select Technique To Add").t() +
                    "</h3>"
            )

            let techniquelist = Object.keys(tactic.techniques)
            for (
                let techniquenum = 0;
                techniquenum < techniquelist.length;
                techniquenum++
            ) {
                let extraClass = ""
                if (
                    window.active_techniques.indexOf(
                        techniquelist[techniquenum]
                    ) >= 0
                ) {
                    extraClass += " active"
                }
                name = mitre.technique_master[techniquelist[techniquenum]].name
                if (tacticId == techniquelist[techniquenum]) {
                    name = "Generic: " + name
                }
                container.append(
                    $(
                        '<button class="mitreTechnique' +
                            extraClass +
                            '" tactic="' +
                            tacticId +
                            '" technique="' +
                            techniquelist[techniquenum] +
                            '">'
                    )
                        .text(techniquelist[techniquenum] + " - " + name)
                        .click(function (evt) {
                            let target = $(evt.target)
                            let tacticId = target.attr("tactic")
                            let techniqueId = target.attr("technique")
                            // let showcaseId = target.closest(".showcase").attr("id")
                            let container = target.closest(".modal-body")
                            if (target.attr("class").indexOf("active") >= 0) {
                                // console.log("Removing", techniqueId, window.active_techniques)
                                target.removeClass("active")
                                var numRemaining = container.find(
                                    ".mitreTechnique.active"
                                ).length
                                window.active_techniques.splice(
                                    window.active_techniques.indexOf(
                                        techniqueId
                                    ),
                                    1
                                )

                                if (numRemaining == 0) {
                                    container
                                        .find(
                                            ".mitreTactic[tactic=" +
                                                tacticId +
                                                "]"
                                        )
                                        .removeClass("active")

                                    if (
                                        container.find(".mitreTactic.active")
                                            .length == 0
                                    ) {
                                        container.removeClass("completed")
                                    }
                                }
                                // console.log(numRemaining, "remaining")
                            } else {
                                window.active_techniques.push(techniqueId)
                                container.addClass("completed")
                                // console.log("Adding", techniqueId, window.active_techniques)
                                target.addClass("active")
                                container
                                    .find(
                                        ".mitreTactic[tactic=" + tacticId + "]"
                                    )
                                    .addClass("active")
                            }
                            container.find(".sub_technique_container").html("")
                            if (
                                typeof mitre.technique_to_sub_technique[
                                    techniqueId
                                ] != "undefined"
                            ) {
                                container
                                    .find(".sub_technique_container")
                                    .append(
                                        GenerateListOfMITRESubTechniques(
                                            mitre.attack[tacticId].techniques[
                                                techniqueId
                                            ],
                                            techniqueId
                                        )
                                    )
                                container
                                    .find(".technique_container")
                                    .append(
                                        container.find(
                                            ".sub_technique_container"
                                        )
                                    )
                            }
                        })
                )
            }
            return container
        }
        function GenerateListOfMITRESubTechniques(technique, techniqueId) {
            let container = $("<div>")
            container.append(
                '<h3 class="add_description">' +
                    _("Select Sub-technique To Add").t() +
                    "</h3>"
            )

            let sub_techniquelist = Object.keys(technique.sub_techniques)

            for (
                let techniquenum = 0;
                techniquenum < sub_techniquelist.length;
                techniquenum++
            ) {
                let extraClass = ""
                if (
                    window.active_sub_techniques.indexOf(
                        sub_techniquelist[techniquenum]
                    ) >= 0
                ) {
                    extraClass += " active"
                }
                name =
                    mitre.sub_technique_master[sub_techniquelist[techniquenum]]
                        .name

                //if (tacticId == sub_techniquelist[techniquenum]) {
                //    name = "Generic: " + name
                //}
                container.append(
                    $(
                        '<button class="mitreTechnique mitreSubTechnique' +
                            extraClass +
                            '" technique="' +
                            techniqueId +
                            '" subtechnique="' +
                            sub_techniquelist[techniquenum] +
                            '">'
                    )
                        .text(sub_techniquelist[techniquenum] + " - " + name)
                        .click(function (evt) {
                            let target = $(evt.target)
                            //let tacticId = target.attr("tactic")
                            let techniqueId = target.attr("technique")
                            let sub_techniqueId = target.attr("sub_technique")
                            // let showcaseId = target.closest(".showcase").attr("id")
                            let container = target.closest(".modal-body")
                            if (target.attr("class").indexOf("active") >= 0) {
                                // console.log("Removing", techniqueId, window.active_techniques)
                                target.removeClass("active")
                                var numRemaining = container.find(
                                    ".mitreSubTechnique.active"
                                ).length
                                window.active_sub_techniques.splice(
                                    window.active_sub_techniques.indexOf(
                                        sub_techniqueId
                                    ),
                                    1
                                )

                                if (numRemaining == 0) {
                                    container
                                        .find(
                                            ".mitreTechnique[technique=" +
                                                techniqueId +
                                                "]"
                                        )
                                        .removeClass("active")

                                    if (
                                        container.find(".mitreTechnique.active")
                                            .length == 0
                                    ) {
                                        container.removeClass("completed")
                                    }
                                }
                                // console.log(numRemaining, "remaining")
                            } else {
                                window.active_sub_techniques.push(
                                    sub_techniqueId
                                )
                                container.addClass("completed")
                                // console.log("Adding", techniqueId, window.active_techniques)
                                target.addClass("active")
                                container
                                    .find(
                                        ".mitreSubTechnique[sub_technique=" +
                                            sub_techniqueId +
                                            "]"
                                    )
                                    .addClass("active")
                            }
                        })
                )
            }
            return container
        }

        function SummarizeMitre(mitre_attack) {
            let master = {
                attack: {},
                technique_master: {},
                sub_technique_master: {},
                short_name_to_tactic: {},
                allTactics: {},
                name_to_tactic: {},
                name_to_technique: {},
                name_to_sub_technique: {},
                technique_to_tactic: {},
                technique_to_sub_technique: {},
            }
            for (let i = 0; i < mitre_attack.objects.length; i++) {
                let obj = mitre_attack.objects[i]

                //Exclude the techniques that are either revoked or deprecated
                excluded = false
                if (
                    (typeof obj.revoked != "undefined" &&
                        obj.revoked == true) ||
                    (typeof obj.description != "undefined" &&
                        obj.description.indexOf(
                            "This technique has been deprecated"
                        ) >= 0)
                ) {
                    //console.log("obj.revoked",obj.revoked)
                    excluded = true
                }
                if (
                    typeof obj.description != "undefined" &&
                    obj.description.indexOf(
                        "This technique has been deprecated"
                    ) >= 0
                ) {
                    //console.log("obj.description",obj.description)
                    excluded = true
                }

                if (typeof obj.external_references != "undefined") {
                    for (let g = 0; g < obj.external_references.length; g++) {
                        if (
                            !excluded &&
                            obj.external_references[g].source_name.indexOf(
                                "mitre"
                            ) >= 0 &&
                            typeof obj.external_references[g].external_id !=
                                "undefined" &&
                            obj.external_references[g].external_id.indexOf(
                                "T1"
                            ) == 0 &&
                            obj.type == "attack-pattern" &&
                            obj.external_references[g].external_id.indexOf(
                                "."
                            ) == -1
                        ) {
                            let id = obj.external_references[g].external_id
                            master["technique_master"][id] = obj
                            master["name_to_technique"][obj.name] = id
                        }

                        if (
                            !excluded &&
                            obj.external_references[g].source_name.indexOf(
                                "mitre"
                            ) >= 0 &&
                            typeof obj.external_references[g].external_id !=
                                "undefined" &&
                            obj.external_references[g].external_id.indexOf(
                                "T1"
                            ) == 0 &&
                            obj.type == "attack-pattern" &&
                            obj.external_references[g].external_id.indexOf(
                                "."
                            ) > -1
                        ) {
                            let id = obj.external_references[g].external_id
                            let techniqueId = obj.external_references[
                                g
                            ].external_id.split(".", 1)
                            if (
                                !master["technique_to_sub_technique"][
                                    techniqueId
                                ]
                            ) {
                                master["technique_to_sub_technique"][
                                    techniqueId
                                ] = []
                            }
                            master["sub_technique_master"][id] = obj
                            master["name_to_sub_technique"][obj.name] = id
                            master["technique_to_sub_technique"][
                                techniqueId
                            ].push(id)
                        }
                        if (
                            obj.external_references[g].source_name.indexOf(
                                "mitre"
                            ) >= 0 &&
                            typeof obj.external_references[g].external_id !=
                                "undefined" &&
                            obj.external_references[g].external_id.indexOf(
                                "TA"
                            ) == 0
                        ) {
                            let id = obj.external_references[g].external_id
                            master["attack"][id] = obj
                            master["technique_master"][id] = obj
                            master["name_to_technique"][obj.name] = id
                            master["technique_to_tactic"][id] = id
                            master["sub_technique_master"][id] = obj
                            master["name_to_sub_technique"][obj.name] = id
                            master["allTactics"][id] = obj
                            let techniqueBlob = {}
                            techniqueBlob[id] = { name: "Generic " + obj.name }
                            master["attack"][id].techniques = techniqueBlob
                            master["name_to_tactic"][obj.name] = id
                            master["short_name_to_tactic"][
                                obj.x_mitre_shortname
                            ] = { phase: "attack", id: id }
                        }
                    }
                }
            }

            for (let id in master.sub_technique_master) {
                let techniqueId = id.split(".", 1)
                let sub_technique = master.sub_technique_master[id]
                if (
                    typeof master.technique_master[techniqueId]
                        .sub_techniques == "undefined"
                ) {
                    master.technique_master[techniqueId].sub_techniques = []
                }
                if (
                    typeof master.technique_master[techniqueId].sub_techniques[
                        id
                    ] == "undefined"
                ) {
                    master.technique_master[techniqueId].sub_techniques[id] = []
                }
                master.technique_master[techniqueId].sub_techniques[id].push(
                    sub_technique
                )
            }

            for (let id in master.technique_master) {
                let technique = master.technique_master[id]
                if (typeof technique.kill_chain_phases != "undefined") {
                    for (
                        let g = 0;
                        g < technique.kill_chain_phases.length;
                        g++
                    ) {
                        if (
                            technique.kill_chain_phases[g].kill_chain_name ==
                            "mitre-attack"
                        ) {
                            master.attack[
                                master.short_name_to_tactic[
                                    technique.kill_chain_phases[g].phase_name
                                ].id
                            ].techniques[id] = technique
                            if (
                                typeof master["technique_to_tactic"][id] ==
                                "undefined"
                            ) {
                                master["technique_to_tactic"][id] = []
                            }
                            master["technique_to_tactic"][id].push(
                                master.short_name_to_tactic[
                                    technique.kill_chain_phases[g].phase_name
                                ].id
                            )
                        }
                    }
                }
            }

            return master
        }
        let mitre_parent = $('<div class="customize-mitre">')
        let mitre_techniques = $('<div class="technique_container">')
        let mitre_sub_techniques = $('<div class="sub_technique_container">')

        let notesIfPresent = $('<div class="methodology-notes">')
        mitre_parent.append(
            $("<p>Methodology Notes </p>").append(
                $('<i class="icon-pencil"/>').click(function (evt) {
                    launchNotesWindow($(evt.target))
                })
            ),
            notesIfPresent
        )

        mitre_parent.append($("<h3>" + _("Tactics").t() + ":</h3>"))

        sorted_tactics = Object.keys(mitre.attack).sort()
        for (let counter = 0; counter < sorted_tactics.length; counter++) {
            let tactic = sorted_tactics[counter]
            let extraClass = ""
            if (window.active_tactics.indexOf(tactic) >= 0) {
                extraClass += " active"
            }
            mitre_parent.append(
                $(
                    '<button class="mitreTactic ' +
                        extraClass +
                        '" tactic="' +
                        tactic +
                        '">'
                )
                    .text(mitre.attack[tactic].name)
                    .click(function (evt) {
                        let target = $(evt.target)
                        let tacticId = target.attr("tactic")
                        let showcaseId = target.closest(".showcase").attr("id")
                        let container = target.closest(".customize-mitre")
                        container.find(".technique_container").html("")
                        //container.find(".technique_container").append(GenerateListOfMITRETechniques(mitre.attack[tacticId], tacticId, ShowcaseInfo['summaries'][showcaseId].mitre_technique))
                        //console.log("mitre",mitre)
                        container
                            .find(".technique_container")
                            .append(
                                GenerateListOfMITRETechniques(
                                    mitre.attack[tacticId],
                                    tacticId
                                )
                            )
                    })
            )
        }
        mitre_parent.append(mitre_techniques)
        mitre_parent.append(mitre_sub_techniques)

        myBody.find("#mitre_container").append(mitre_parent)

        let ds_parent = $('<div class="customize-datasources">')
        datasources = Object.keys(data_inventory).sort()
        for (let counter = 0; counter < datasources.length; counter++) {
            let ds = datasources[counter]
            let extraClass = ""
            if (
                _.intersection(
                    Object.keys(data_inventory[ds].eventtypes),
                    window.active_datasources
                ).length > 0
            ) {
                extraClass += " active"
            }

            ds_parent.append(
                $(
                    '<button class="dataSourceSelection ' +
                        extraClass +
                        '" data-ds="' +
                        ds +
                        '">'
                )
                    .attr("title", data_inventory[ds].description)
                    .text(data_inventory[ds].name)
                    .click(function (evt) {
                        let target = $(evt.target)
                        let ds = target.attr("data-ds")
                        let container = target.closest(".customize-datasources")
                        container.find(".dsc_container").html("")
                        //container.find(".technique_container").append(GenerateListOfMITRETechniques(mitre.attack[tacticId], tacticId, ShowcaseInfo['summaries'][showcaseId].mitre_technique))
                        container
                            .find(".dsc_container")
                            .append(GenerateListOfDSCs(ds))
                    })
            )
        }

        let dsc = $('<div class="dsc_container">')
        ds_parent.append(dsc)
        myBody.find("#data_source_categories").append(ds_parent)

        function GenerateListOfDSCs(ds) {
            let container = $("<div>")
            container.append(
                '<p class="add_dsc">' +
                    _("Select Data Source Category To Add").t() +
                    "</p>"
            )

            let dscList = Object.keys(data_inventory[ds].eventtypes)
            for (let i = 0; i < dscList.length; i++) {
                let extraClass = ""
                if (window.active_datasources.indexOf(dscList[i]) >= 0) {
                    extraClass += " active"
                }
                // console.log("Looking for", dscList[i], "in", window.active_datasources, "with result", extraClass)
                name = data_inventory[ds].eventtypes[dscList[i]].name

                container.append(
                    $(
                        '<button class="dscSelection ' +
                            extraClass +
                            '" data-ds="' +
                            ds +
                            '" data-dsc="' +
                            dscList[i] +
                            '">'
                    )
                        .attr(
                            "title",
                            data_inventory[ds].eventtypes[dscList[i]]
                                .description
                        )
                        .text(name)
                        .click(function (evt) {
                            let target = $(evt.target)
                            let dsId = target.attr("data-ds")
                            let dscId = target.attr("data-dsc")
                            // let showcaseId = target.closest(".showcase").attr("id")
                            let container = target.closest(".modal-body")
                            if (target.attr("class").indexOf("active") >= 0) {
                                // console.log("Removing", dsId, dscId, window.active_datasources)
                                target.removeClass("active")
                                var numRemaining = container.find(
                                    ".dscSelection.active"
                                ).length
                                window.active_datasources.splice(
                                    window.active_datasources.indexOf(dscId),
                                    1
                                )

                                if (numRemaining == 0) {
                                    container
                                        .find(
                                            ".dataSourceSelection[data-ds=" +
                                                ds +
                                                "]"
                                        )
                                        .removeClass("active")

                                    if (
                                        container.find(".mitreTactic.active")
                                            .length == 0
                                    ) {
                                        container.removeClass("completed")
                                    }
                                }
                                // console.log(numRemaining, "remaining")
                            } else {
                                window.active_datasources.push(dscId)
                                container.addClass("completed")
                                // console.log("Adding", dsId, dscId, window.active_datasources)
                                target.addClass("active")
                                container
                                    .find(
                                        ".dataSourceSelection[data-ds=" +
                                            dsId +
                                            "]"
                                    )
                                    .addClass("active")
                            }
                        })
                )
            }
            return container
        }

        myBody
            .find(".prop-name, .prop-value")
            .css("border-top", "1px solid gray")
            .css("margin-top", "20px")
            .css("padding-top", "10px")
        $(newCustomModal.$el)
            .addClass("modal-extra-wide")
            .on("hide", function () {
                // Not taking any action on hide, but you can if you want to!
            })

        //Logic for Originating App field
        myBody.find("input[name='inSplunk'][value='no']").click(function () {
            $("tr#displayapp").css("display", "table-row")
        })
        myBody.find("input[name='inSplunk'][value='yes']").click(function () {
            myBody.find("input[data-field='displayapp']").val("")
            $("tr#displayapp").css("display", "none")
        })
        if (myBody.find("input[name='inSplunk'][value='no']").is(":checked")) {
            myBody.find("tr#displayapp").css("display", "table-row")
        }
        if (myBody.find("input[name='inSplunk'][value='yes']").is(":checked")) {
            myBody.find("input[data-field='displayapp']").val("")
            myBody.find("tr#displayapp").css("display", "none")
        }
        //Limit to alphanumeric
        myBody.find("input[data-field='displayapp']").on("input", function () {
            var c = this.selectionStart,
                r = /[^a-z0-9\s_-]/gi,
                v = $(this).val()
            if (r.test(v)) {
                $(this).val(v.replace(r, ""))
                c--
            }
            this.setSelectionRange(c, c)
        })

        newCustomModal.body.append(myBody)
        let ButtonTextString = "Add"
        if (summary && summary.id) {
            ButtonTextString = _("Update").t()
        }
        // console.log("Button text: " + ButtonTextString);
        newCustomModal.footer.append(
            $("<button>")
                .addClass("mlts-modal-cancel")
                .attr({
                    type: "button",
                    "data-dismiss": "modal",
                    "data-bs-dismiss": "modal",
                })
                .addClass("btn btn-secondary mlts-modal-cancel")
                .text("Cancel"),
            $("<button>")
                .addClass("mlts-modal-submit")
                .attr({
                    type: "button",
                })
                .addClass("btn btn-primary mlts-modal-submit")
                .attr("id", "saveNewFilters")
                .text(ButtonTextString)
                .on("click", function () {
                    let obj = {}
                    let fields = $(".modal-body").find("[data-field]")
                    let haveAllRequired = true
                    const radioField = "inSplunk"
                    const multiSelectField = "category"
                    for (let i = 0; i < fields.length; i++) {
                        const dataField =
                            $(".modal-body").find("[data-field]")[i]
                        let value = $(dataField).val()
                        let field = $(dataField).attr("data-field")
                        if (field === radioField) {
                            if (!dataField.checked) {
                                continue // this is not the selected value.
                            }
                        }
                        if (field === multiSelectField) {
                            value = value.join("|")
                        }
                        let container = $(dataField).closest("tr")
                        let isRequired =
                            typeof container.find("label").attr("class") !=
                                "undefined" &&
                            container
                                .find("label")
                                .attr("class")
                                .indexOf("required") >= 0
                                ? true
                                : false
                        if (field === "dashboard" && value) {
                            value = encodeURIComponent(value)
                        }
                        if (isRequired == true && value == "") {
                            haveAllRequired = false
                            container
                                .find("td")
                                .css("background-color", "#FFEEEE")
                            container.addClass("missingValue")
                            // console.log("Missing Text for required field ", field)
                        } else if (typeof value != "undefined" && value != "") {
                            // console.log("Got ", field, "with", value);
                            obj[field] = value
                            container.removeClass("missingValue")
                            container
                                .find("td")
                                .css("background-color", "#ffffff")
                        } else {
                            // console.log("Got empty ", field);
                            obj[field] = ""
                        }
                    }

                    let channel = "custom"
                    if (
                        typeof obj["displayapp"] != "undefined" &&
                        obj["displayapp"] != "" &&
                        obj["displayapp"] != "Custom Content"
                    ) {
                        channel = channel + "_" + obj["displayapp"]
                    }
                    if (
                        (typeof obj["icon"] != "undefined" &&
                            obj["icon"] == "") ||
                        typeof obj["icon"] == "undefined"
                    ) {
                        if (
                            /[a-zA-Z]/.test(
                                obj["name"].substr(0, 1).toLowerCase()
                            )
                        ) {
                            obj["icon"] =
                                obj["name"].substr(0, 1).toLowerCase() + ".png"
                        } else {
                            obj["icon"] = "custom_content.png"
                        }
                    }
                    let bookmark_status = ""
                    let isBookmarkChanged = true
                    if (
                        typeof obj["bookmark_status"] != "undefined" &&
                        obj["bookmark_status"] != ""
                    ) {
                        bookmark_status = obj["bookmark_status"]
                        delete obj["bookmark_status"]
                    }
                    if (
                        summary &&
                        summary.id &&
                        summary.bookmark_status &&
                        summary.bookmark_status == bookmark_status
                    ) {
                        isBookmarkChanged = false
                    }
                    // Handle for data sources
                    if (window.active_datasources.length > 0) {
                        obj["data_source_categories"] =
                            window.active_datasources.join("|")
                        let container = $(".modal-body")
                            .find("#data_source_categories")
                            .closest("tr")
                        container.removeClass("missingValue")
                        container.find("td").css("background-color", "#ffffff")
                    } else {
                        haveAllRequired = false
                        let container = $(".modal-body")
                            .find("#data_source_categories")
                            .closest("tr")
                        container.find("td").css("background-color", "#FFEEEE")
                        container.addClass("missingValue")
                        // console.log("Missing Text for required field", "data_source_categories")
                    }

                    if (window.active_techniques.length > 0) {
                        obj["mitre_technique"] = window.active_techniques
                            .filter((item) => {
                                if (typeof item === "string") {
                                    return item.toLowerCase() !== "none"
                                } else if (Array.isArray(item)) {
                                    return item[0].toLowerCase() !== "none"
                                }
                            })
                            .join("|")

                        let selectedSubTechniques = $(
                            ".mitreSubTechnique.active"
                        )
                        let subTechniqueArray = []
                        for (let i = 0; i < selectedSubTechniques.length; i++) {
                            subTechniqueArray.push(
                                $(selectedSubTechniques[i]).attr("subtechnique")
                            )
                        }
                        obj["mitre_sub_technique"] = subTechniqueArray.join("|")
                        //console.log("adding sub techniques",obj['mitre_sub_technique'])

                        let selectedTactics = $(".mitreTactic.active")
                        let tacticArray = []
                        for (let i = 0; i < selectedTactics.length; i++) {
                            tacticArray.push(
                                $(selectedTactics[i]).attr("tactic")
                            )
                        }
                        obj["mitre_tactic"] = tacticArray.join("|")
                    }

                    if (haveAllRequired) {
                        let newShowcaseId =
                            "custom_" +
                            obj["name"]
                                .replace(/ /g, "_")
                                .replace(/[^a-zA-Z0-9_]/g, "")
                        if (summary && summary.id) {
                            newShowcaseId = summary.id
                            // We never change the summary id, 'cause it could screw up bookmarks, etc.
                        }
                        // console.log("Fin", haveAllRequired, obj);
                        // Check to see if there's a match
                        let blockingShowcaseId = ""
                        let errorType = ""

                        let keys = Object.keys(localShowcaseInfo["summaries"])
                        for (let i = 0; i < keys.length; i++) {
                            if (
                                summary &&
                                summary.id &&
                                keys[i] == summary.id
                            ) {
                                continue
                            }
                            if (
                                localShowcaseInfo.summaries[keys[i]].search &&
                                obj.search ==
                                    localShowcaseInfo.summaries[keys[i]].search
                            ) {
                                blockingShowcaseId = keys[i]
                                errorType = "search"
                            }
                            if (
                                keys[i] == newShowcaseId ||
                                localShowcaseInfo.summaries[
                                    keys[i]
                                ].name.toLowerCase() == obj.name.toLowerCase()
                            ) {
                                blockingShowcaseId = keys[i]
                                errorType = "name"
                            }
                        }

                        if (blockingShowcaseId != "") {
                            require([
                                "jquery",
                                Splunk.util.make_full_url(
                                    "/static/app/Splunk_Security_Essentials/components/controls/Modal.js"
                                ),
                            ], function ($, Modal) {
                                // Now we initialize the Modal itself
                                var myModal = new Modal(
                                    "existingDetectionPresent",
                                    {
                                        title: _(
                                            "Existing Detection Present"
                                        ).t(),
                                        backdrop: "static",
                                        keyboard: false,
                                        destroyOnHide: true,
                                        type: "normal",
                                    },
                                    $
                                )

                                let message = ""

                                if (errorType == "search") {
                                    message =
                                        "Error! This saved search is already mapped to a custom content."
                                }
                                if (errorType == "name") {
                                    message =
                                        "Error! There is already an example with that name -- no two examples can have the same name."
                                }
                                myModal.body.append(
                                    $("<p>").text(_(message).t())
                                )

                                myModal.footer.append(
                                    $("<button>")
                                        .attr({
                                            type: "button",
                                            "data-dismiss": "modal",
                                            "data-bs-dismiss": "modal",
                                        })
                                        .addClass("btn btn-primary")
                                        .text(_("Close").t())
                                )
                                myModal.show() // Launch it!
                            })
                        } else {
                            let record = {
                                _time: new Date().getTime() / 1000,
                                _key: newShowcaseId,
                                showcaseId: newShowcaseId,
                                channel: channel,
                                json: JSON.stringify(obj),
                                user: Splunk.util.getConfigValue("USERNAME"),
                            }
                            if (summary && summary.id) {
                                handleNewContentTelemetry("update", obj)
                                $.ajax({
                                    url:
                                        $C["SPLUNKD_PATH"] +
                                        "/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/custom_content/" +
                                        record["_key"],
                                    type: "POST",
                                    headers: {
                                        "X-Requested-With": "XMLHttpRequest",
                                        "X-Splunk-Form-Key":
                                            window.getFormKey(),
                                    },
                                    contentType: "application/json",
                                    async: true,
                                    data: JSON.stringify(record),
                                    success: function (returneddata) {
                                        bustCache()
                                        newkey = returneddata
                                        // console.log("Got a response", returneddata);
                                        $("#newCustom").modal("hide")
                                        var myModal = new Modal(
                                            "detectionUpdated",
                                            {
                                                title: _("Updated").t(),
                                                backdrop: "static",
                                                keyboard: false,
                                                destroyOnHide: true,
                                                type: "normal",
                                            },
                                            $
                                        )
                                        $(myModal.$el).on("hide", function () {
                                            successCallback(record["_key"], obj)
                                        })
                                        myModal.body.append(
                                            $("<p>").text("Success!")
                                        )

                                        myModal.footer.append(
                                            $("<button>")
                                                .attr({
                                                    type: "button",
                                                    "data-dismiss": "modal",
                                                    "data-bs-dismiss": "modal",
                                                })
                                                .addClass("btn btn-primary")
                                                .text("Close")
                                        )
                                        $(myModal.$el).on(
                                            "hidden.bs.modal",
                                            function (e) {
                                                location.reload()
                                            }
                                        )
                                        myModal.show() // Launch it!
                                    },
                                    error: function (xhr, textStatus, error) {
                                        console.error(
                                            "Error Updating!",
                                            xhr,
                                            textStatus,
                                            error
                                        )
                                        triggerError(xhr.responseText)
                                    },
                                })
                            } else {
                                handleNewContentTelemetry("add", obj)
                                $.ajax({
                                    url:
                                        $C["SPLUNKD_PATH"] +
                                        "/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/custom_content",
                                    type: "POST",
                                    contentType: "application/json",
                                    headers: {
                                        "X-Requested-With": "XMLHttpRequest",
                                        "X-Splunk-Form-Key":
                                            window.getFormKey(),
                                    },
                                    async: true,
                                    data: JSON.stringify(record),
                                    success: function (returneddata) {
                                        //add the mapping relationship into local_search_mappings when adding custom content from saved search
                                        if (
                                            summary &&
                                            summary["search_title"]
                                        ) {
                                            addContentMapping(
                                                summary["search_title"],
                                                record["showcaseId"]
                                            )
                                        }
                                        bustCache()
                                        newkey = returneddata
                                        //Add new line to the UI table
                                        obj.custom_user =
                                            Splunk.util.getConfigValue(
                                                "USERNAME"
                                            )
                                        obj.custom_time =
                                            new Date().getTime() / 1000
                                        obj.id = record["showcaseId"]
                                            ? record["showcaseId"]
                                            : ""
                                        // ProcessSummaryUI.addItem_async($, obj)
                                        // console.log("Got a response", returneddata);
                                        $("#newCustom").modal("hide")
                                        var myModal = new Modal(
                                            "detectionAdded",
                                            {
                                                title: _("Added").t(),
                                                backdrop: "static",
                                                keyboard: false,
                                                destroyOnHide: true,
                                                type: "normal",
                                            },
                                            $
                                        )
                                        $(myModal.$el).on("hide", function () {
                                            successCallback(record["_key"], obj)
                                        })
                                        myModal.body.append(
                                            $("<p>").text(_("Success!").t())
                                        )

                                        myModal.footer.append(
                                            $("<button>")
                                                .attr({
                                                    type: "button",
                                                    "data-dismiss": "modal",
                                                    "data-bs-dismiss": "modal",
                                                })
                                                .addClass("btn btn-primary")
                                                .text(_("Close").t())
                                        )
                                        $(myModal.$el).on(
                                            "hidden.bs.modal",
                                            function (e) {
                                                location.reload()
                                            }
                                        )
                                        myModal.show() // Launch it!
                                    },
                                    error: function (xhr, textStatus, error) {
                                        console.error(
                                            "Error Updating!",
                                            xhr,
                                            textStatus,
                                            error
                                        )
                                        triggerError(xhr.responseText)
                                    },
                                })
                            }
                            if (isBookmarkChanged) {
                                let record = {
                                    _time: new Date().getTime() / 1000,
                                    _key: newShowcaseId,
                                    showcase_name: obj["name"],
                                    status: bookmark_status,
                                    user: Splunk.util.getConfigValue(
                                        "USERNAME"
                                    ),
                                }

                                $.ajax({
                                    url:
                                        $C["SPLUNKD_PATH"] +
                                        '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/bookmark/?query={"_key": "' +
                                        record["_key"] +
                                        '"}',
                                    type: "GET",
                                    contentType: "application/json",
                                    async: false,
                                    success: function (returneddata) {
                                        if (returneddata.length == 0) {
                                            $.ajax({
                                                url:
                                                    $C["SPLUNKD_PATH"] +
                                                    "/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/bookmark/",
                                                type: "POST",
                                                headers: {
                                                    "X-Requested-With":
                                                        "XMLHttpRequest",
                                                    "X-Splunk-Form-Key":
                                                        window.getFormKey(),
                                                },
                                                contentType: "application/json",
                                                async: false,
                                                data: JSON.stringify(record),
                                                success: function (
                                                    returneddata
                                                ) {
                                                    bustCache()
                                                    newkey = returneddata
                                                },
                                                error: function (
                                                    xhr,
                                                    textStatus,
                                                    error
                                                ) {},
                                            })
                                        } else {
                                            // Old
                                            $.ajax({
                                                url:
                                                    $C["SPLUNKD_PATH"] +
                                                    "/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/bookmark/" +
                                                    record["_key"],
                                                type: "POST",
                                                headers: {
                                                    "X-Requested-With":
                                                        "XMLHttpRequest",
                                                    "X-Splunk-Form-Key":
                                                        window.getFormKey(),
                                                },
                                                contentType: "application/json",
                                                async: false,
                                                data: JSON.stringify(record),
                                                success: function (
                                                    returneddata
                                                ) {
                                                    bustCache()
                                                    newkey = returneddata
                                                },
                                                error: function (
                                                    xhr,
                                                    textStatus,
                                                    error
                                                ) {
                                                    //              console.log("Error Updating!", xhr, textStatus, error)
                                                },
                                            })
                                        }
                                    },
                                    error: function (error, data, other) {
                                        //     console.log("Error Code!", error, data, other)
                                    },
                                })
                            }
                        }
                    } else {
                        // console.log("Missing Content", haveAllRequired, obj);

                        let myModal = $(".modal-body:visible")
                        let scrollTo = $("tr.missingValue").first()

                        myModal.scrollTop(
                            scrollTo.offset().top -
                                myModal.offset().top +
                                myModal.scrollTop()
                        )
                        scrollTo.find("[data-field]").focus()
                    }
                })
        )
        newCustomModal.show()
        $(document).ready(function () {
            $("#BrutusinForms_category").multiselect({
                buttonClass: "form-select",
                templates: {
                    button: '<button type="button" class="multiselect dropdown-toggle" data-bs-toggle="dropdown"><span class="multiselect-selected-text"></span></button>',
                },
            })
        })
    })
}
