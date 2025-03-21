require([
    "underscore",
    "components/controls/Modal",
    Splunk.util.make_full_url(
        "/static/app/Splunk_Security_Essentials/indexed.js"
    ),
    "json!" +
        Splunk.util.make_full_url(
            "/splunkd/__raw/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/local_search_mappings?bust=" +
                Math.round(Math.random() * 15000000)
        ),
    Splunk.util.make_full_url(
        "/static/app/Splunk_Security_Essentials/components/data/common_data_objects.js"
    ),
], function (_, Modal, indexed) {
    const { getData, KEY_SAVEDSEARCHES } = indexed
    setTimeout(function () {
        require([
            Splunk.util.make_full_url(
                "/static/app/Splunk_Security_Essentials/components/controls/CustomContent.js"
            ),
        ], function () {
            // Pre-loaded
        })
    }, 1000)

    function handleContentMappingTelemetry(status, method, obj) {
        let allowedChannels = [
            "Enterprise_Security_Content_Update",
            "Splunk_App_for_Enterprise_Security",
            "Splunk_SOAR",
            "Splunk_Security_Essentials",
            "Splunk_User_Behavior_Analytics",
        ]
        let record = { area: "content_mapping", status: status, method: method }
        if (obj && obj.channel) {
            if (allowedChannels.indexOf(obj.channel) >= 0) {
                record.content = obj.id || obj.name
            }
        } else if (obj && obj.app) {
            if (allowedChannels.indexOf(obj.app) >= 0) {
                record.content = obj.id || obj.name
            }
        }
        // console.log("ADDING TELEMETRY", "BookmarkChange", record)

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
            Telemetry.SendTelemetryToSplunk("BookmarkChange", record)
        })
    }
    let counter = 0
    let standardESApps = [
        "SA-AccessProtection",
        "DA-ESS-AccessProtection",
        "SplunkEnterpriseSecuritySuite",
        "SA-AuditAndDataProtection",
        "SA-Utils",
        "DA-ESS-ThreatIntelligence",
        "SA-EndpointProtection",
        "Splunk_SA_CIM",
        "DA-ESS-NetworkProtection",
        "DA-ESS-EndpointProtection",
        "DA-ESS-ContentUpdate",
        "SA-IdentityManagement",
        "DA-ESS-IdentityManagement",
        "SA-NetworkProtection",
        "SA-ThreatIntelligence",
        "SA-UEBA",
    ]
    let standardIrrelevantApps = [
        "splunk_archiver",
        "splunk_monitoring_console",
        "splunk_instrumentation",
    ]

    let enabled_searches = {}
    let enabled_content = {}
    let content = []

    //Drop down filters
    var showOnlyApp = "*"
    var showOnlyEnabled = ""
    var showOnlyCorrelations = ""
    var showOnlyScheduled = ""

    //generateSavedSearchSelectorModal(showcaseId)

    function generateSavedSearchSelectorModal(savedMappings = []) {
        return getSavedSearches()
            .then((savedSearches) => {
                $(document).data("searches", savedSearches)
                var savedSearchObj = JSON.parse(
                    JSON.stringify($(document).data("searches"))
                )
                generateContentList(savedSearchObj)

                let dropdowns = $('<div class="filterDropdowns">')

                let showOnlyAppDropdownFilter = $(
                    '<div class="ssecolumn"><div data-toggle="tooltip" data-bs-placement="right" title="" class="ssecolumn tooltiplabel" data-bs-original-title="Filter to show only searches from app">App</div><div class="multiselect-native-select"><select data-field="showOnlyApp" id="showOnlyAppDropdown" class="showOnlyFilter"><option value="*">All</option></select></div></div>'
                )
                let showOnlyEnabledDropdownFilter = $(
                    '<div class="ssecolumn"><div data-toggle="tooltip" data-bs-placement="right" title="" class="ssecolumn tooltiplabel" data-bs-original-title="Filter to show only enabled searches">Enabled</div><div class="multiselect-native-select"><select data-field="showOnlyEnabled" class="showOnlyFilter"><option value="">All</option><option value="true">Yes</option><option value="false">No</option></select></div></div>'
                )
                let showOnlyCorrelationsDropdownFilter = $(
                    '<div class="ssecolumn"><div data-toggle="tooltip" data-bs-placement="right" title="" class="ssecolumn tooltiplabel" data-bs-original-title="Filter to show only correlation searches">Correlation search</div><div class="multiselect-native-select"><select data-field="showOnlyCorrelations" class="showOnlyFilter"><option value="">All</option><option value="true">Yes</option><option value="false">No</option></select></div></div>'
                )
                let showOnlyScheduledDropdownFilter = $(
                    '<div class="ssecolumn"><div data-toggle="tooltip" data-bs-placement="right" title="" class="ssecolumn tooltiplabel" data-bs-original-title="Filter to show only scheduled searches">Scheduled</div><div class="multiselect-native-select"><select data-field="showOnlyScheduled" class="showOnlyFilter"><option value="">All</option><option value="true">Yes</option><option value="false">No</option></select></div></div>'
                )
                require(["vendor/bootstrap/bootstrap.bundle"], function () {
                    $("[data-toggle=tooltip]").tooltip({ html: true })
                })
                dropdowns.append(showOnlyAppDropdownFilter)
                dropdowns.append(showOnlyEnabledDropdownFilter)
                dropdowns.append(showOnlyCorrelationsDropdownFilter)
                dropdowns.append(showOnlyScheduledDropdownFilter)
                let table = $(
                    '<table id="contentList" class="table"><thead><tr><th><i class="icon-info" /></th><th>' +
                        _("Name of Existing Saved Search").t() +
                        "</th><th>" +
                        _("Actions").t() +
                        "</th></tr></thead><tbody></tbody></table>"
                )
                //let tbody = table.find("tbody")
                // console.log("Got my data!", data)
                let tbody = generateSearchTableBody(content, savedMappings)
                table.append(tbody)

                let myModal = new Modal(
                    "localContent",
                    {
                        title: _("Title placeholder"),
                        destroyOnHide: true,
                        type: "wide",
                    },
                    $
                )
                window.SavedSearchSelectorModal = myModal
                myModal.$el.addClass("modal-basically-full-screen")

                myModal.body.html(
                    $(
                        "<p>" +
                            _(
                                "Below is a list of all scheduled searches in your environment."
                            ).t() +
                            "</p>"
                    )
                )
                myModal.body.append(dropdowns)
                myModal.body.append(table)
                myModal.footer.append(
                    $("<button>")
                        .attr({
                            type: "button",
                            "data-dismiss": "modal",
                            "data-bs-dismiss": "modal",
                        })
                        .addClass("btn btn-primary ")
                        .text("Close")
                )
                myModal.show()
                //$("#localContent").find(".modal-header").append($("<div>").attr("id", "ContentMappingStatus"))

                //Add handler for dropdown filters
                $(".showOnlyFilter").on("change", function (event) {
                    let dropdown = $(this).attr("data-field")
                    let selectedValue = this.value
                    switch (dropdown) {
                        case "showOnlyApp":
                            showOnlyApp = selectedValue
                            break
                        case "showOnlyEnabled":
                            showOnlyEnabled = selectedValue
                            break
                        case "showOnlyCorrelations":
                            showOnlyCorrelations = selectedValue
                            break
                        case "showOnlyScheduled":
                            showOnlyScheduled = selectedValue
                            break
                    }

                    //console.log("Content before generateContentList")
                    //console.log(content)
                    generateContentList(savedSearchObj)
                    //console.log("Content after generateContentList")
                    //console.log(content)
                    $("table#contentList tbody").remove()
                    tbody = generateSearchTableBody(content, savedMappings)
                    $("table#contentList").append(tbody)
                    //console.log("Before trigger update")
                    $("table#contentList").trigger("update")
                })

                //Generate entries for the App dropdown and sort
                showOnlyAppDropDown = $("#showOnlyAppDropdown")
                apps = []
                $.each(content, function (i, entry) {
                    if ($.inArray(entry.search.app, apps) == -1) {
                        apps.push(entry.search.app)
                    }
                })
                apps.sort()
                $.each(apps, function (i, app) {
                    showOnlyAppDropDown.append(
                        '<option value="' + app + '">' + app + "</option>"
                    )
                })

                return myModal
            })
            .catch((error) => {
                console.log("Error: ", error)
            })
    }
    window.generateSavedSearchSelectorModal = generateSavedSearchSelectorModal

    function generateContentList(savedSearchObj) {
        //Reset content before we add new data to it
        content = []

        for (let i = 0; i < savedSearchObj.entry.length; i++) {
            let search = savedSearchObj.entry[i]

            let obj = search
            let autoirrelevant = false
            /*
            obj["title"] = search.name;
            obj["app"] = search.app;
            obj["link"] = search.link;
            obj["search"] = search.search;
            obj["displayTitle"] = search.displayTitle || obj["title"];
            obj["description"] = search.description;
            obj["isCorrelationSearch"] = search.isCorrelationSearch;
            obj["description"] = search.description;
            obj["description"] = search.description;
            */

            let potentialATTACKTactic = pullFieldsFromSearch(obj["search"], [
                "attack_tactic",
                "tactic",
            ])
            let potentialATTACKTechnique = ""

            //Check title first as search string match not working so well
            let matches = Array.from(
                findAll(
                    /([Tt][0-9]{4})(\.[0-9]{3}){0,1}[\"\s]/g,
                    obj["displayTitle"]
                )
            )
            if (
                typeof matches != "undefined" &&
                typeof matches[0] != "undefined" &&
                matches[0][1] != ""
            ) {
                potentialATTACKTechnique = matches.map((match) => match[1])
                //console.log("potentialATTACKTechnique: "+potentialATTACKTechnique)
            }
            //Check search string using simple regex - only matches Technique (not Sub-Technique)
            matches = Array.from(
                findAll(/([Tt][0-9]{4})(\.[0-9]{3}){0,1}[\"\s]/g, obj["search"])
            )
            if (
                typeof matches != "undefined" &&
                typeof matches[0] != "undefined" &&
                matches[0][1] != ""
            ) {
                potentialATTACKTechnique = matches.map((match) => match[1])
                //console.log("potentialATTACKTechnique: "+potentialATTACKTechnique)
            }

            //Check if we have annotations and map those to SSE custom content
            if (search["annotations"]) {
                try {
                    search["annotations"] = JSON.parse(search["annotations"])
                } catch (err) {
                    //do nothing
                }

                if (search["annotations"]["mitre_attack"]) {
                    if (potentialATTACKTechnique.length > 0) {
                        const isContain = search["annotations"][
                            "mitre_attack"
                        ].every((val) => potentialATTACKTechnique.includes(val))
                        if (!isContain) {
                            isUpdate = true
                            mitreTechnique = potentialATTACKTechnique
                            //This function creates a deduped list of annotations and what was discovered in the title and search string
                            potentialATTACKTechnique = updateMitreTechnique(
                                mitreTechnique,
                                search["annotations"]["mitre_attack"]
                            ).split("|")
                        }
                    } else {
                        isUpdate = true
                        mitreTechnique = []
                        potentialATTACKTechnique = updateMitreTechnique(
                            mitreTechnique,
                            search["annotations"]["mitre_attack"]
                        ).split("|")
                    }
                }
            }
            //Also check search title for Technique IDs
            if (potentialATTACKTechnique == "") {
                let potentialATTACKTechnique = pullFieldsFromSearch(
                    obj["search"],
                    ["attack_technique", "attack_technique"]
                )
            }

            obj["extractions"] = {
                //"confidence": potentialConfidence,
                tactic: potentialATTACKTactic,
                technique: potentialATTACKTechnique,
            }

            //obj["searchObj"] = search
            autoirrelevant = false
            if (
                search.name.indexOf(" - Lookup Gen") >= 0 ||
                search.name.indexOf(" - Threat Gen") >= 0 ||
                search.name.indexOf(" - Context Gen") >= 0 ||
                (standardESApps.indexOf(obj["app"]) >= 0 &&
                    obj["isCorrelationSearch"] == false) ||
                standardIrrelevantApps.indexOf(obj["app"]) >= 0
            ) {
                autoirrelevant = true
            }

            //Added filters
            if (
                ((obj["isCorrelationSearch"] == "true" &&
                    showOnlyCorrelations == "true") ||
                    (obj["isCorrelationSearch"] == "false" &&
                        showOnlyCorrelations == "false") ||
                    showOnlyCorrelations == "") &&
                ((obj["isEnabled"] == "true" && showOnlyEnabled == "true") ||
                    (obj["isEnabled"] == "false" &&
                        showOnlyEnabled == "false") ||
                    showOnlyEnabled == "") &&
                ((obj["isScheduled"] == "true" &&
                    showOnlyScheduled == "true") ||
                    (obj["isScheduled"] == "false" &&
                        showOnlyScheduled == "false") ||
                    showOnlyScheduled == "") &&
                (showOnlyApp == "*" || obj["app"] == showOnlyApp) &&
                autoirrelevant == false
            ) {
                counter++
                content.push({
                    search: obj,
                })

                // console.log(obj['title'], searchTitle, status, potentialMatch, potentialMatchName, searchResults)
            }
        }
    }

    function generateSearchTableBody(content, savedMappings = []) {
        let tablebody = $("<tbody>")
        let selectedFlag = false
        for (let i = 0; i < content.length; i++) {
            let contentDescriptionRow = $("<tr>")
                .css("display", "none")
                .addClass("contentDescriptionRow")
                .attr("data-searchname", content[i]["search"]["displayTitle"])
                .attr(
                    "data-id",
                    content[i]["search"]["displayTitle"].replace(
                        /[^a-zA-Z0-9\-_]/g,
                        ""
                    )
                )
            let descriptionContent = $('<td colspan="5">')
            let descriptionContentRow = $('<div class="row">')
            let descriptionContentColumn1 = $('<div class="column">')
            let descriptionContentColumn2 = $('<div class="column">')
            descriptionContentColumn1.append(
                $(
                    "<div><h3>" +
                        _("App").t() +
                        "</h3><p>" +
                        content[i].search.app +
                        "</p></div>"
                )
            )
            descriptionContentColumn1.append(
                $(
                    "<div><h3>" +
                        _("Description").t() +
                        "</h3><p>" +
                        content[i].search.description +
                        "</p></div>"
                )
            )
            descriptionContentColumn1.append(
                $(
                    "<div><h3>" +
                        _("Last Updated").t() +
                        "</h3><p>" +
                        content[i].search.updated +
                        "</p></div></div>"
                )
            )
            descriptionContentColumn2.append(
                $(
                    "<div><h3>" +
                        _("Enabled").t() +
                        "</h3><p>" +
                        (content[i].search.isEnabled == "true"
                            ? 'Yes <i class="icon-check enable-icon"></i>'
                            : "No") +
                        "</p></div>"
                )
            )
            descriptionContentColumn2.append(
                $(
                    "<div><h3>" +
                        _("Correlation Search").t() +
                        "</h3><p>" +
                        (content[i].search.isCorrelationSearch == "true"
                            ? 'Yes <i class="icon-check enable-icon"></i>'
                            : "No") +
                        "</p></div>"
                )
            )
            descriptionContentColumn2.append(
                $(
                    "<div><h3>" +
                        _("Scheduled").t() +
                        "</h3><p>" +
                        (content[i].search.isScheduled == "true"
                            ? '</i>Yes <i class="icon-check enable-icon"></i>'
                            : "No") +
                        "<br >Next scheduled time: " +
                        content[i].search.next_scheduled_time +
                        "<br >Schedule: " +
                        content[i].search.schedule +
                        "</p></div></div></div>"
                )
            )
            descriptionContentRow.append(descriptionContentColumn1)
            descriptionContentRow.append(descriptionContentColumn2)
            descriptionContent.append(descriptionContentRow)
            descriptionContent.append(
                $("<div><h3>" + _("Search String").t() + "</h3></div>").append(
                    $("<p>").text(content[i].search.search)
                )
            )

            contentDescriptionRow.append(descriptionContent)

            let row = $("<tr>")
                .addClass("contentTitleRow")
                .attr("data-searchname", content[i]["search"]["displayTitle"])
                .attr(
                    "data-id",
                    content[i]["search"]["displayTitle"].replace(
                        /[^a-zA-Z0-9\-_]/g,
                        ""
                    )
                )
                .attr("data-content", JSON.stringify(content[i]))

            row.append(
                '<td class="tableexpand" class="downarrow" ><a href="#" onclick="doSearchMapToggle(this); return false;"><i class="icon-chevron-right" /></a></td>'
            )
            let link =
                $C["SPLUNKD_PATH"].replace("/splunkd/__raw", "") +
                "/manager/Splunk_Security_Essentials/saved/searches?app=" +
                content[i].search.app +
                "&count=10&offset=0&itemType=&owner=&search=" +
                encodeURIComponent(content[i]["search"]["displayTitle"])
            row.append(
                $('<td class="content-searchname">')
                    .text(content[i]["search"]["displayTitle"])
                    .append(
                        $("<a>")
                            .attr("href", link)
                            .attr("target", "_blank")
                            .addClass("external drilldown-link")
                    )
            )

            selectedFlag = false

            for (let j = 0; j < savedMappings.length; j++) {
                if (content[i].search.displayTitle === savedMappings[j]) {
                    selectedFlag = true
                    break
                }
            }

            row.append(
                $('<td class="content-actions">').append(
                    generateActionText(content[i], selectedFlag)
                )
            )

            tablebody.append(row, contentDescriptionRow)
        }
        return tablebody
    }

    function generateActionText(content, selectedFlag) {
        let fullClass

        if (selectedFlag) {
            fullClass = "action_acceptRecommendation selected"
        } else {
            fullClass = "action_acceptRecommendation"
        }

        let actionText = $("<div>")
        actionText.append(
            $("<div>")
                .addClass(fullClass)
                .text("Select")
                .click(function (evt) {
                    let content = JSON.parse(
                        $(evt.target).closest("tr").attr("data-content")
                    )
                    //let showcaseId = $(evt.target).closest("tr").attr("data-prediction")
                    let search_title = $(evt.target)
                        .closest("tr")
                        .attr("data-searchname")
                    if ($(this).hasClass("selected")) {
                        $(this).toggleClass("selected")
                        //KVStore change
                        //updateStatus(search_title,showcaseId, "delete")
                        //Gui change
                        //deleteContentMappingRow(search_title)
                    } else {
                        $(this).toggleClass("selected")
                        //KVStore change
                        //updateStatus(search_title,showcaseId, "create")
                        //Gui change
                        //addContentMappingRow(search_title,showcaseId)
                    }
                })
        )
        return actionText
    }

    function pullFieldsFromSearch(string, fields) {
        for (let i = 0; i < fields.length; i++) {
            window.dvtest3 = fields[i]
            if (
                fields[i] == "attack_technique" &&
                string.indexOf("eval " + fields[i] + '="T')
            ) {
                let segment = string.substring(
                    string.indexOf("eval " + fields[i] + '="T') +
                        ("eval " + fields[i] + '="').length
                )
                // console.log("segment", fields[i], segment, string)
                return segment
                    .substr(0, segment.indexOf(" "))
                    .replace(/[^T\d]/g, "")
            }

            if (string.indexOf("eval " + fields[i] + '="') >= 0) {
                window.dvtest1 = string
                window.dvtest2 = fields[i]
                let segment = string.substring(
                    string.indexOf("eval " + fields[i] + '="') +
                        ("eval " + fields[i] + '="').length
                )
                segment = segment.substr(0, segment.indexOf('"'))
                // console.log("segment", fields[i], segment)
                if (segment.indexOf("|") == -1) {
                    return segment
                }
            }
            if (string.indexOf(", " + fields[i] + '="') >= 0) {
                let segment = string.substring(
                    string.indexOf("eval " + fields[i] + '="') +
                        ("eval " + fields[i] + '="').length
                )
                segment = segment.substr(0, segment.indexOf('"'))
                // console.log("segment", fields[i], segment)
                if (segment.indexOf("|") == -1) {
                    return segment
                }
            }
        }
        return ""
    }

    function updateStatus(search_title, showcaseId, method) {
        bustCache()
        if (method == "create") {
            addContentMapping(search_title, showcaseId)

            //Here we update the bookmark
            let status = "successfullyImplemented"
            let bookmark_notes = ""
            if (
                typeof fullShowcaseInfo != "undefined" &&
                typeof fullShowcaseInfo.summaries[showcaseId] != "undefined" &&
                typeof fullShowcaseInfo.summaries[showcaseId][
                    "bookmark_status"
                ] != "undefined" &&
                fullShowcaseInfo.summaries[showcaseId]["bookmark_status"] !=
                    "" &&
                fullShowcaseInfo.summaries[showcaseId]["bookmark_status"] !=
                    "none"
            ) {
                status = fullShowcaseInfo.summaries[showcaseId].bookmark_status
                bookmark_notes =
                    fullShowcaseInfo.summaries[showcaseId].bookmark_notes
                showcaseName = fullShowcaseInfo.summaries[showcaseId].name
                handleContentMappingTelemetry(
                    "exact",
                    method,
                    fullShowcaseInfo.summaries[showcaseId]
                )
            } else {
                //If we are here we are on a single showcase page. Then we update the bookmark to "successfullyImplemented"
                bookmark_notes = summary.bookmark_notes ?? ""
                showcaseName = summary.name
                handleContentMappingTelemetry("exact", method, summary)
            }
            let bookmark_record = {
                _time: new Date().getTime() / 1000,
                _key: showcaseId,
                showcase_name: showcaseName,
                status: status,
                notes: bookmark_notes,
                user: Splunk.util.getConfigValue("USERNAME"),
            }
            //console.log("Trying to set bookmark status for", record)
            $.ajax({
                url:
                    $C["SPLUNKD_PATH"] +
                    '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/bookmark/?query={"_key": "' +
                    bookmark_record["_key"] +
                    '"}',
                type: "GET",
                contentType: "application/json",
                async: true,
                success: function (returneddata) {
                    if (returneddata.length == 0) {
                        $.ajax({
                            url:
                                $C["SPLUNKD_PATH"] +
                                "/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/bookmark/",
                            type: "POST",
                            headers: {
                                "X-Requested-With": "XMLHttpRequest",
                                "X-Splunk-Form-Key": window.getFormKey(),
                            },
                            contentType: "application/json",
                            async: true,
                            data: JSON.stringify(bookmark_record),
                            success: function (returneddata) {
                                bustCache()
                                newkey = returneddata
                            },
                            error: function (xhr, textStatus, error) {},
                        })
                    } else {
                        // Old
                        $.ajax({
                            url:
                                $C["SPLUNKD_PATH"] +
                                "/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/bookmark/" +
                                bookmark_record["_key"],
                            type: "POST",
                            headers: {
                                "X-Requested-With": "XMLHttpRequest",
                                "X-Splunk-Form-Key": window.getFormKey(),
                            },
                            contentType: "application/json",
                            async: true,
                            data: JSON.stringify(bookmark_record),
                            success: function (returneddata) {
                                bustCache()
                                newkey = returneddata
                            },
                            error: function (xhr, textStatus, error) {
                                //              console.log("Error Updating!", xhr, textStatus, error)
                            },
                        })
                    }
                },
                error: function (error, data, other) {
                    //     console.log("Error Code!", error, data, other)
                },
            })
        } else if ((method = "delete")) {
            deleteContentMapping(search_title, showcaseId)
        }
    }
    window.updateStatus = updateStatus

    function getSavedSearches() {
        return new Promise((resolve, reject) => {
            let result = {}
            getData(KEY_SAVEDSEARCHES)
                .then((returneddata) => {
                    if (returneddata) {
                        result["entry"] = JSON.parse(returneddata)
                        resolve(result)
                    }
                })
                .catch((error) => {
                    console.log("Error: ", error)
                    reject(error)
                })
        })
    }
})

function doSearchMapToggle(obj) {
    let container = $(obj).closest(".contentTitleRow")
    let rowId = container.attr("data-id")
    let chevron = container.find(".icon-chevron-down, .icon-chevron-right")
    if (chevron.attr("class") == "icon-chevron-down") {
        $('.contentDescriptionRow[data-id="' + rowId + '"]').css(
            "display",
            "none"
        )
        chevron.attr("class", "icon-chevron-right")
    } else {
        $('.contentDescriptionRow[data-id="' + rowId + '"]').css(
            "display",
            "table-row"
        )
        chevron.attr("class", "icon-chevron-down")
        $('.contentDescriptionRow[data-id="' + rowId + '"]')
            .find("td")
            .css("border-top", 0)
    }
}

function findAll(regexPattern, sourceString) {
    let output = []
    let match
    // make sure the pattern has the global flag
    let regexPatternWithGlobal = RegExp(regexPattern, "g")
    while ((match = regexPatternWithGlobal.exec(sourceString))) {
        // get rid of the string copy
        delete match.input
        // store the match data
        output.push(match)
    }
    return output
}
