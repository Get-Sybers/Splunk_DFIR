function mapExistingSearchContent() {
    require([
        "json!" +
            $C["SPLUNKD_PATH"] +
            "/services/SSEShowcaseInfo?locale=" +
            window.localeString,
        "underscore",
        "components/controls/BuildTile",
        "components/controls/Modal",
        "components/controls/utilities",
        Splunk.util.make_full_url(
            "/static/app/Splunk_Security_Essentials/vendor/lunr.js/lunr.js"
        ),
        "json!" +
            Splunk.util.make_full_url(
                "/splunkd/__raw/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/local_search_mappings?bust=" +
                    Math.round(Math.random() * 15000000)
            ),
        Splunk.util.make_full_url(
            "/static/app/Splunk_Security_Essentials/components/data/common_data_objects.js"
        ),
        Splunk.util.make_full_url(
            "/static/app/Splunk_Security_Essentials/indexed.js"
        ),
    ], function (
        ShowcaseInfo,
        _,
        BuildTile,
        Modal,
        utilities,
        lunr,
        local_search_mappings,
        common_data_objects,
        indexed
    ) {
        setTimeout(function () {
            require([
                Splunk.util.make_full_url(
                    "/static/app/Splunk_Security_Essentials/components/controls/CustomContent.js"
                ),
            ], function () {
                // Pre-loaded
            })
        }, 1000)
    
        const { getData, KEY_SAVEDSEARCHES } = indexed
    
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
    
        let search_name_to_showcase_names = {}
        let SPL_to_name = {}
        for (let SummaryName in ShowcaseInfo["summaries"]) {
            if (ShowcaseInfo["summaries"][SummaryName]["search_name"]) {
                search_name_to_showcase_names[
                    ShowcaseInfo["summaries"][SummaryName]["search_name"]
                ] = SummaryName
            }
            if (ShowcaseInfo["summaries"][SummaryName]["examples"]) {
                for (
                    let i = 0;
                    i < ShowcaseInfo["summaries"][SummaryName]["examples"].length;
                    i++
                ) {
                    if (
                        ShowcaseInfo["summaries"][SummaryName]["examples"][i][
                            "label"
                        ] &&
                        ShowcaseInfo["summaries"][SummaryName]["examples"][i][
                            "label"
                        ].indexOf("Demo") == -1 &&
                        ShowcaseInfo["summaries"][SummaryName]["examples"][i][
                            "showcase"
                        ] &&
                        ShowcaseInfo["summaries"][SummaryName]["examples"][i][
                            "showcase"
                        ]["value"]
                    ) {
                        if (
                            !SPL_to_name[
                                ShowcaseInfo["summaries"][SummaryName]["examples"][
                                    i
                                ]["showcase"]["value"].replace(/\s/g, "")
                            ]
                        ) {
                            SPL_to_name[
                                ShowcaseInfo["summaries"][SummaryName]["examples"][
                                    i
                                ]["showcase"]["value"].replace(/\s/g, "")
                            ] = []
                        }
                        SPL_to_name[
                            ShowcaseInfo["summaries"][SummaryName]["examples"][i][
                                "showcase"
                            ]["value"].replace(/\s/g, "")
                        ].push(SummaryName)
                    }
                }
            }
        }
    
        /* Standard Search Engine Init*/
        let documents = []
        let fields = Object.keys(window.searchEngineDefaults)
        for (let SummaryName in ShowcaseInfo["roles"]["default"]["summaries"]) {
            SummaryName = ShowcaseInfo["roles"]["default"]["summaries"][SummaryName]
            if (typeof ShowcaseInfo["summaries"][SummaryName] == "object") {
                let myobj = { id: SummaryName }
                for (let myfield in fields) {
                    myfield = fields[myfield]
                    if (
                        typeof ShowcaseInfo["summaries"][SummaryName][myfield] !=
                        "undefined"
                    ) {
                        myobj[myfield] =
                            ShowcaseInfo["summaries"][SummaryName][myfield]
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
    
        /* Custom Matching Search Engine Init*/
        let localSchema = {
            description: 3,
            searchKeywords: 20,
            name: 10,
            relevance: 5,
            story: 5,
        }
        let custom_documents = []
        let custom_fields = Object.keys(localSchema)
        for (let SummaryName in ShowcaseInfo["roles"]["default"]["summaries"]) {
            SummaryName = ShowcaseInfo["roles"]["default"]["summaries"][SummaryName]
            if (typeof ShowcaseInfo["summaries"][SummaryName] == "object") {
                let myobj = { id: SummaryName }
                for (let myfield in custom_fields) {
                    myfield = custom_fields[myfield]
                    if (
                        typeof ShowcaseInfo["summaries"][SummaryName][myfield] !=
                        "undefined"
                    ) {
                        myobj[myfield] =
                            ShowcaseInfo["summaries"][SummaryName][myfield]
                    }
                }
                custom_documents.push(myobj)
            }
        }
        let custom_index = lunr(function () {
            for (let field in localSchema) {
                this.field(field, {
                    boost: localSchema[field],
                })
            }
            this.ref("id")
            custom_documents.forEach(function (doc) {
                this.add(doc)
            }, this)
        })
    
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
        var showOnlyEnabled = "true"
        var showOnlyCorrelations = ""
        var showOnlyScheduled = ""
        var showOnlyStatus = "*"
    
        let savedSearches
    
        getSavedSearches()
            .then((data) => {
                if (data) {
                    savedSearches = data
                }
                $(document).data("searches", savedSearches)
                var savedSearchObj = $.parseJSON(
                    JSON.stringify($(document).data("searches"))
                )
    
                generateContentList(savedSearchObj)
    
                // get all auto-created custom content cards for later use
                let autoContentCardSet = getAutoContentCardSet()
    
                let dropdowns = $('<div class="filterDropdowns">')
    
                let showOnlyAppDropdownFilter = $(
                    '<div class="ssecolumn"><div data-toggle="tooltip" data-bs-placement="right" title="" class="ssecolumn tooltiplabel" data-bs-original-title="Filter to show only searches from app">App</div><div class="multiselect-native-select"><select data-field="showOnlyApp" id="showOnlyAppDropdown" class="showOnlyFilter"><option value="*">All</option></select></div></div>'
                )
                let showOnlyEnabledDropdownFilter = $(
                    '<div class="ssecolumn"><div data-toggle="tooltip" data-bs-placement="right" title="" class="ssecolumn tooltiplabel" data-bs-original-title="Filter to show only enabled searches">Enabled</div><div class="multiselect-native-select"><select data-field="showOnlyEnabled" class="showOnlyFilter"><option value="">All</option><option value="true" selected="selected">Yes</option><option value="false">No</option></select></div></div>'
                )
                let showOnlyCorrelationsDropdownFilter = $(
                    '<div class="ssecolumn"><div data-toggle="tooltip" data-bs-placement="right" title="" class="ssecolumn tooltiplabel" data-bs-original-title="Filter to show only correlation searches">Correlation search</div><div class="multiselect-native-select"><select data-field="showOnlyCorrelations" class="showOnlyFilter"><option value="">All</option><option value="true">Yes</option><option value="false">No</option></select></div></div>'
                )
                let showOnlyScheduledDropdownFilter = $(
                    '<div class="ssecolumn"><div data-toggle="tooltip" data-bs-placement="right" title="" class="ssecolumn tooltiplabel" data-bs-original-title="Filter to show only scheduled searches">Scheduled</div><div class="multiselect-native-select"><select data-field="showOnlyScheduled" class="showOnlyFilter"><option value="">All</option><option value="true">Yes</option><option value="false">No</option></select></div></div>'
                )
                let showOnlyStatusDropdownFilter = $(
                    '<div class="ssecolumn"><div data-toggle="tooltip" data-bs-placement="right" title="" class="ssecolumn tooltiplabel" data-bs-original-title="Filter to show only searches with the selected mapping status.">Status</div><div class="multiselect-native-select"><select data-field="showOnlyStatus" id="showOnlyStatusDropdown" class="showOnlyFilter"><option value="*">All</option><option value="exact">Mapped</option><option value="likely">Likely Match</option><option value="potentials">Potential Match</option><option value="low">Low Match</option><option value="none">No Match</option></select></div></div>'
                )
                let searchBar = $(
                    '<input type="text" placeholder="Enter search here..." id="myInput">'
                )
                require(["vendor/bootstrap/bootstrap.bundle"], function () {
                    $("[data-toggle=tooltip]").tooltip({ html: true })
                })
                dropdowns.append(showOnlyAppDropdownFilter)
                dropdowns.append(showOnlyEnabledDropdownFilter)
                dropdowns.append(showOnlyCorrelationsDropdownFilter)
                dropdowns.append(showOnlyScheduledDropdownFilter)
                dropdowns.append(showOnlyStatusDropdownFilter)
                dropdowns.append(searchBar)
    
                let table = $(
                    '<table id="contentList" class="table"><thead><tr><th><i class="icon-info" /></th><th>' +
                        _("Name of Existing Saved Search").t() +
                        "</th><th>" +
                        _("Status").t() +
                        "</th><th>" +
                        _("Splunk Security Essentials Content Name").t() +
                        "</th><th>" +
                        _("Actions").t() +
                        "</th></tr></thead><tbody></tbody></table>"
                )
                //let tbody = table.find("tbody")
                // console.log("Got my data!", data)
                let tbody = generateSearchTableBody(content)
                table.append(tbody)
                // console.log("Table Body ", tbody)
                $("#localContentLoading").modal("hide")
                let myModal = new Modal(
                    "localContent",
                    {
                        title: _(
                            "Map Saved Searches to Splunk's Out-Of-The-Box Content"
                        ).t(),
                        destroyOnHide: true,
                        type: "wide",
                    },
                    $
                )
                window.dvtest = myModal
                myModal.$el.addClass("modal-basically-full-screen")
    
                myModal.body.html(
                    $(
                        "<p>" +
                            _(
                                "Below is a list of all enabled scheduled searches in your environment."
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
                        })
                        .addClass("btn")
                        .css("float", "left")
                        .text(_("Button Explanation").t())
                        .click(function () {
                            let myModal = new Modal(
                                "buttonExplanation",
                                {
                                    title: _("Button Explanation").t(),
                                    destroyOnHide: true,
                                    type: "wide",
                                },
                                $
                            )
    
                            myModal.body.html(
                                $("<div>").append(
                                    $(
                                        "<p>" +
                                            _(
                                                "Click <i>Look for Enabled Content</i> below to get a list of all of your local saved searches. For each saved, you'll have the following options available:"
                                            ).t() +
                                            "</p>"
                                    ),
                                    $("<ul>").append(
                                        $("<li>").html(
                                            "<b>" +
                                                _("Accept Recommendation").t() +
                                                "</b>: " +
                                                _(
                                                    'If we can\'t find an exact match, but when we run your content through a search engine we get just one pretty decent match, you can click Accept Recommendation to map that saved search on your system to the suggested out-of-the-box Splunk content, marking that content as Successfully Implemented so it will show up as "Active" in the Analytics Advisor and include all of the metadata such as MITRE ATT&CK and Kill Chain mappings.'
                                                ).t()
                                        ),
                                        $("<li>").html(
                                            "<b>" +
                                                _("Search").t() +
                                                "</b>: " +
                                                _(
                                                    'Opens a search dialog that will look through all of the content in Splunk Security Essentials (including any custom content you\'ve created) and let you select the content that maps closely, marking that content as Successfully Implemented so it will show up as "Active" in the Analytics Advisor and include all of the metadata such as MITRE ATT&CK and Kill Chain mappings.'
                                                ).t()
                                        ),
                                        $("<li>").html(
                                            "<b>" +
                                                _("Create New").t() +
                                                "</b>: " +
                                                _(
                                                    "If you don't see any content in Splunk Security Essentials that represents this detection, you can create a piece of custom content in Splunk Security Essentials. Custom content lets you do all of the tagging that normal content has (MITRE, Kill Chain, Categories, and more!), and will show up in all parts of the app. You can even create content for detections you have that run outside of Splunk, so that the kill chain view is fully populated!"
                                                ).t()
                                        ),
                                        $("<li>").html(
                                            "<b>" +
                                                _("Not a Detection").t() +
                                                "</b>: " +
                                                _(
                                                    "If this particular piece of content is not a security detection, then you can mark it as such. This will be excluded from display anywhere in Splunk Security Essentials."
                                                ).t()
                                        ),
                                        $("<li>").html(
                                            "<b>" +
                                                _("Clear").t() +
                                                "</b>: " +
                                                _(
                                                    "If you accidentally marked this content, but have second thoughts, you can clear the mapping and we'll pretend you never clicked anything."
                                                ).t()
                                        )
                                    )
                                )
                            )
    
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
                        }),
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
                $("#localContent")
                    .find(".modal-header")
                    .append($("<div>").attr("id", "ContentMappingStatus"))
                updateCount()
    
                // Clear the text when a dropdown is active
                $(".showOnlyFilter").on("click", function () {
                    $("#myInput").val("")
                })
    
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
                        case "showOnlyStatus":
                            showOnlyStatus = selectedValue
                            break
                    }
    
                    // console.log("Content before generateContentList")
                    // console.log(content)
                    generateContentList(savedSearchObj)
                    // console.log("Content after generateContentList")
                    // console.log(content)
                    $("table#contentList tbody").remove()
                    tbody = generateSearchTableBody(content)
                    $("table#contentList").append(tbody)
                })
    
                // Logic for search the bar
                $("#myInput").on("keyup", function () {
                    var value = $(this).val().toLowerCase()
                    $("#contentList tbody tr").filter(function () {
                        $(this).toggle(
                            $(this)
                                .find("td:eq(1)")
                                .text()
                                .toLowerCase()
                                .indexOf(value) > -1 ||
                                $(this)
                                    .find("td:eq(3)")
                                    .text()
                                    .toLowerCase()
                                    .indexOf(value) > -1
                        )
                    })
                    $(".contentDescriptionRow").css("display", "none")
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
    
                /**
                 * Generate a default Custom Content Card for a saved search.
                 * @param {object} searchObj - The saved search object.
                 * @return {object} - An object represents the custom content.
                 */
                function generateContentCard(searchObj) {
                    const search_name = searchObj.displayTitle
                    let data_source_categories = searchObj.data_source_category
                    let description = searchObj.description
                    try {
                        searchObj["annotations"] = JSON.parse(
                            searchObj["annotations"]
                        )
                    } catch {
                        //do nothing
                    }
                    let mitre_id = ""
                    let mitre_technique = ""
                    let mitre_sub_technique = ""
                    if (
                        typeof searchObj["annotations"] != "undefined" &&
                        typeof searchObj["annotations"]["mitre_attack"] !=
                            "undefined"
                    ) {
                        mitre_id = searchObj["annotations"]["mitre_attack"]
                        mitre_technique = []
                        mitre_sub_technique = []
                        for (let i = 0; i < mitre_id.length; i++) {
                            t = mitre_id[i]
                            if (t.split(".").length > 1) {
                                mitre_sub_technique.push(t)
                            } else {
                                mitre_technique.push(t)
                            }
                        }
                        if (mitre_id.length == 0) {
                            mitre_id = ""
                        } else {
                            mitre_id = mitre_id.join("|")
                        }
                        if (mitre_technique.length == 0) {
                            mitre_technique = ""
                        } else {
                            mitre_technique = mitre_technique.join("|")
                        }
                        if (mitre_sub_technique.length == 0) {
                            mitre_sub_technique = ""
                        } else {
                            mitre_sub_technique = mitre_sub_technique.join("|")
                        }
                    }
                    let kill_chain_phases = ""
                    if (
                        typeof searchObj["annotations"] != "undefined" &&
                        typeof searchObj["annotations"]["kill_chain_phases"] !=
                            "undefined" &&
                        searchObj["annotations"]["kill_chain_phases"].length > 0
                    ) {
                        kill_chain_phases =
                            searchObj["annotations"]["kill_chain_phases"].join("|")
                    }
                    let cis = ""
                    if (
                        typeof searchObj["annotations"] != "undefined" &&
                        typeof searchObj["annotations"]["cis20"] != "undefined" &&
                        searchObj["annotations"]["cis20"].length > 0
                    ) {
                        cis = searchObj["annotations"]["cis20"].join("|")
                    }
                    let nist = ""
                    if (
                        typeof searchObj["annotations"] != "undefined" &&
                        typeof searchObj["annotations"]["nist"] != "undefined" &&
                        searchObj["annotations"]["nist"].length > 0
                    ) {
                        nist = searchObj["annotations"]["nist"].join("|")
                    }
                    // use the default template when description is undefined or description is empty string
                    if (description === undefined || description === "") {
                        description =
                            "Generated by the Splunk Security Essentials app from the saved search " +
                            search_name +
                            " at " +
                            Date()
                    }
                    if (
                        data_source_categories === undefined ||
                        data_source_categories === ""
                    ) {
                        data_source_categories = "VendorSpecific-AnySplunk"
                    }
                    const search = searchObj.search
    
                    // pre-fill the mandatory fields of content card form with default values
                    // add a field is_auto_created to indicate the content card is auto-created
                    return {
                        is_auto_created: true,
                        advancedtags: "",
                        alertvolume: "Other",
                        category: "Other",
                        company_description: "",
                        company_link: "",
                        company_logo: "",
                        company_logo_height: "",
                        company_logo_width: "",
                        company_name: "",
                        dashboard: "",
                        data_source_categories: data_source_categories,
                        description: description,
                        domain: "",
                        help: "",
                        highlight: "No",
                        howToImplement: "",
                        icon: "",
                        inSplunk: "no",
                        journey: "Stage_3",
                        killchain: kill_chain_phases,
                        escu_cis: cis,
                        escu_nist: nist,
                        mitre_id: mitre_id,
                        mitre_technique: mitre_technique,
                        mitre_sub_technique: mitre_sub_technique,
                        knownFP: "",
                        name: search_name,
                        operationalize: "",
                        printable_image: "",
                        relevance: "",
                        search: search,
                        searchkeywords: "",
                        severity: "Other",
                        SPLEase: "",
                        usecase: "Other",
                    }
                }
    
                /**
                 * Get an item from a specific lookup table by _key.
                 * @param {string} lookupTableName - The name of the lookup table to fetch.
                 * @param {string} key - The _key field of the queried item.
                 * @return {array} result - An array that stores the returned queried item.
                 */
                function getLookUpTableItem(lookupTableName, key) {
                    let result = []
                    $.ajax({
                        url:
                            $C["SPLUNKD_PATH"] +
                            "/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/" +
                            lookupTableName +
                            '/?query={"_key": "' +
                            key +
                            '"}',
                        type: "GET",
                        contentType: "application/json",
                        async: false,
                        success: function (returneddata) {
                            result = returneddata
                        },
                        error: function (xhr, textStatus, error) {
                            console.log(
                                "Error Getting item from",
                                lookupTableName,
                                xhr,
                                textStatus,
                                error
                            )
                        },
                    })
                    return result
                }
    
                /**
                 * List all items from a specific lookup table.
                 * @param {string} lookupTableName - The name of the lookup table to fetch.
                 * @return {array} result - An array that stores all items.
                 */
                function listLookUpTableItems(lookupTableName) {
                    let result = []
                    $.ajax({
                        url:
                            $C["SPLUNKD_PATH"] +
                            "/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/" +
                            lookupTableName,
                        type: "GET",
                        contentType: "application/json",
                        async: false,
                        success: function (returneddata) {
                            result = returneddata
                        },
                        error: function (xhr, textStatus, error) {
                            console.log(
                                "Error Listing items from",
                                lookupTableName,
                                xhr,
                                textStatus,
                                error
                            )
                        },
                    })
                    return result
                }
    
                /**
                 * Add an item into a specific lookup table.
                 * @param {string} lookupTableName - The name of the lookup table to fetch.
                 * @param {object} record - The valid entry for the specific lookup table.
                 * @return {boolean} isSuccess - Represents whether the item was successfully added.
                 */
                function addLookUpTableItem(lookupTableName, record) {
                    let isSuccess = false
                    $.ajax({
                        url:
                            $C["SPLUNKD_PATH"] +
                            "/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/" +
                            lookupTableName,
                        type: "POST",
                        headers: {
                            "X-Requested-With": "XMLHttpRequest",
                            "X-Splunk-Form-Key": window.getFormKey(),
                        },
                        contentType: "application/json",
                        async: false,
                        data: JSON.stringify(record),
                        success: function (returneddata) {
                            isSuccess = true
                            bustCache()
                        },
                        error: function (xhr, textStatus, error) {
                            console.log(
                                "Error Adding item to",
                                lookupTableName,
                                xhr,
                                textStatus,
                                error
                            )
                        },
                    })
                    return isSuccess
                }
    
                /**
                 * Update an item in a specific lookup table by _key.
                 * @param {string} lookupTableName - The name of the lookup table to fetch.
                 * @param {object} record - The valid entry for the specific lookup table.
                 * @return {boolean} isSuccess - Represents whether the item was successfully updated.
                 */
                function updateLookUpTableItem(lookupTableName, record) {
                    let isSuccess = false
                    $.ajax({
                        url:
                            $C["SPLUNKD_PATH"] +
                            "/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/" +
                            lookupTableName +
                            "/" +
                            record["_key"],
                        type: "POST",
                        headers: {
                            "X-Requested-With": "XMLHttpRequest",
                            "X-Splunk-Form-Key": window.getFormKey(),
                        },
                        contentType: "application/json",
                        async: false,
                        data: JSON.stringify(record),
                        success: function (returneddata) {
                            isSuccess = true
                            bustCache()
                        },
                        error: function (xhr, textStatus, error) {
                            console.log(
                                "Error Updating item to",
                                lookupTableName,
                                xhr,
                                textStatus,
                                error
                            )
                        },
                    })
                    return isSuccess
                }
    
                /**
                 * Add/Update bookmark status into bookmark lookup table for a specific custom content.
                 * @param {object} contentCardObj - The custom content object.
                 * @param {string} bookmark_status - The bookmark status.
                 */
                function addBookMark(contentCardObj, bookmark_status) {
                    // init the entry for bookmark lookup table
                    const newShowcaseId =
                        "custom_" +
                        contentCardObj.name
                            .replace(/ /g, "_")
                            .replace(/[^a-zA-Z0-9_]/g, "")
                    const record = {
                        _time: new Date().getTime() / 1000,
                        _key: newShowcaseId,
                        showcase_name: contentCardObj.name,
                        status: bookmark_status,
                        user: Splunk.util.getConfigValue("USERNAME"),
                    }
    
                    // check if there is existing bookmark_status entry for this record
                    const bookmarkEntry = getLookUpTableItem(
                        "bookmark",
                        record["_key"]
                    )
                    if (bookmarkEntry.length == 0) {
                        // New -> add
                        addLookUpTableItem("bookmark", record)
                    } else {
                        // Old -> update
                        updateLookUpTableItem("bookmark", record)
                    }
                }
    
                /**
                 * Add TELEMETRY.
                 * @param {string} component
                 * @param {object} record
                 */
                function addTelemetry(component, record) {
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
                        Telemetry.SendTelemetryToSplunk(component, record)
                    })
                }
    
                /**
                 * Clone the handleNewContentTelemetry from CustomContent.js
                 */
                function handleNewContentTelemetry(status, obj) {
                    let allowedKeys = [
                        "mitre_technique",
                        "mitre_tactic",
                        "killchain",
                        "usecase",
                        "category",
                        "data_source_categories",
                    ]
                    Object.filter = (obj, predicate) =>
                        Object.keys(obj)
                            .filter((key) => allowedKeys.includes(key))
                            .filter((key) => predicate(obj[key]))
                            .reduce((res, key) => ((res[key] = obj[key]), res), {})
    
                    let record = Object.filter(obj, (value) => value != "")
                    record["status"] = status
                    // console.log("ADDING TELEMETRY", "CustomContentCreated", record);
                    addTelemetry("CustomContentCreated", record)
                }
    
                /**
                 * Add the New Custom Content Card along with its Mapping Relationship and Bookmark Status into lookup tables, respectively.
                 * @param {object} contentCardObj - The custom content object.
                 * @return {boolean} isAutomation - Represents whether performing the automation to add/create new custom content.
                 */
                function addAutoCustomContentCard(contentCardObj) {
                    // init the entry for custom_content lookup table
                    const newShowcaseId =
                        "custom_" +
                        contentCardObj.name
                            .replace(/ /g, "_")
                            .replace(/[^a-zA-Z0-9_]/g, "")
                    const record = {
                        _time: new Date().getTime() / 1000,
                        _key: newShowcaseId,
                        showcaseId: newShowcaseId,
                        channel: "custom",
                        json: JSON.stringify(contentCardObj),
                        user: Splunk.util.getConfigValue("USERNAME"),
                    }
    
                    // set a flag to check if it does perform the Automation
                    let isAutomation = false
    
                    // check if there is existing content entry for this record
                    const contentEntry = getLookUpTableItem(
                        "custom_content",
                        record["_key"]
                    )
                    if (contentEntry.length == 0) {
                        // New -> add the new Content Card into custom_content lookup
                        handleNewContentTelemetry("add", contentCardObj)
                        const added = addLookUpTableItem("custom_content", record)
                        if (added) {
                            // add the mapping relationship into local_search_mappings lookup
                            addContentMapping(
                                contentCardObj.name,
                                record.showcaseId
                            )
                            // add the bookmark_status->"successfullyImplemented" into bookmark lookup
                            addBookMark(contentCardObj, "successfullyImplemented")
                        }
    
                        // reset the isAutomation to be true when the auto creation is done
                        isAutomation = true
                    }
                    return isAutomation
                }
    
                /**
                 * Auto-create a default Custom Content for a specific saved search.
                 * @param {object} searchObj - The saved search object.
                 * @return {boolean} - Represents whether performing the automation to create new custom content.
                 */
                function autoCreateCustomContent(searchObj) {
                    // generate a default content card for the saved search
                    const contentCard = generateContentCard(searchObj)
                    // add the content card into related lookups
                    return addAutoCustomContentCard(contentCard)
                }
    
                /**
                 * Fetch the custom_content lookup table to create a set that stores all auto-created custom contents.
                 * @return {set} autoContentCardSet - A set that stores all auto-created custom contents.
                 */
                function getAutoContentCardSet() {
                    let autoContentCardSet = new Set()
    
                    // get all items from custom_content lookup table
                    const contentList = listLookUpTableItems("custom_content")
                    if (contentList.length != 0) {
                        for (item of contentList) {
                            if (item.json) {
                                const customContentObj = JSON.parse(item.json)
                                if (customContentObj.is_auto_created) {
                                    autoContentCardSet.add(item.showcaseId)
                                }
                            }
                        }
                    }
                    return autoContentCardSet
                }
    
                function generateContentList(savedSearchObj) {
                    //Reset content before we add new data to it
                    content = []
    
                    // First look to see if exact ES or ESCU
                    for (let i = 0; i < savedSearchObj.entry.length; i++) {
                        let search = savedSearchObj.entry[i]
                        if (!SPL_to_name[search.search.replace(/\s/g, "")]) {
                            SPL_to_name[search.search.replace(/\s/g, "")] = []
                        }
                        SPL_to_name[search.search.replace(/\s/g, "")].push(
                            search.name
                        )
                        //console.log("Extra logging 1 ", search.name)
                        //console.log("search_name_to_showcase_names", search_name_to_showcase_names)
                        if (search_name_to_showcase_names[search.name]) {
                            //console.log("Extra logging  2", search.name)
                            if (!search.disabled) {
                                if (
                                    !enabled_content[
                                        search_name_to_showcase_names[search.name]
                                    ]
                                ) {
                                    enabled_content[
                                        search_name_to_showcase_names[search.name]
                                    ] = []
                                }
                                enabled_content[
                                    search_name_to_showcase_names[search.name]
                                ].push({ name: search.name })
                                if (!enabled_searches[search.name]) {
                                    enabled_searches[search.name] = []
                                }
                                enabled_searches[search.name].push(
                                    search_name_to_showcase_names[search.name]
                                )
                            }
                        }
                    }
    
                    for (let i = 0; i < savedSearchObj.entry.length; i++) {
                        let search = savedSearchObj.entry[i]
                        if (
                            SPL_to_name[search.search.replace(/\s/g, "")] &&
                            SPL_to_name[search.search.replace(/\s/g, "")].length >
                                1 &&
                            search.disabled == "false"
                        ) {
                            for (
                                let i = 0;
                                i <
                                SPL_to_name[search.search.replace(/\s/g, "")]
                                    .length;
                                i++
                            ) {
                                if (
                                    search_name_to_showcase_names[
                                        SPL_to_name[
                                            search.search.replace(/\s/g, "")
                                        ][i]
                                    ]
                                ) {
                                    let searchName =
                                        SPL_to_name[
                                            search.search.replace(/\s/g, "")
                                        ][i]
                                    if (search_name_to_showcase_names[searchName]) {
                                        if (
                                            !enabled_content[
                                                search_name_to_showcase_names[
                                                    searchName
                                                ]
                                            ]
                                        ) {
                                            enabled_content[
                                                search_name_to_showcase_names[
                                                    searchName
                                                ]
                                            ] = []
                                        }
                                        enabled_content[
                                            search_name_to_showcase_names[
                                                searchName
                                            ]
                                        ].push({ name: search.name })
                                        if (!enabled_searches[search.name]) {
                                            enabled_searches[search.name] = []
                                        }
                                        enabled_searches[search.name].push(
                                            search_name_to_showcase_names[
                                                searchName
                                            ]
                                        )
                                    }
                                } else if (
                                    ShowcaseInfo["summaries"][
                                        SPL_to_name[
                                            search.search.replace(/\s/g, "")
                                        ][i]
                                    ]
                                ) {
                                    if (
                                        !enabled_content[
                                            SPL_to_name[
                                                search.search.replace(/\s/g, "")
                                            ][i]
                                        ]
                                    ) {
                                        enabled_content[
                                            SPL_to_name[
                                                search.search.replace(/\s/g, "")
                                            ][i]
                                        ] = []
                                    }
                                    enabled_content[
                                        SPL_to_name[
                                            search.search.replace(/\s/g, "")
                                        ][i]
                                    ].push({ name: search.name })
                                    if (!enabled_searches[search.name]) {
                                        enabled_searches[search.name] = []
                                    }
                                    enabled_searches[search.name].push(
                                        SPL_to_name[
                                            search.search.replace(/\s/g, "")
                                        ][i]
                                    )
                                }
                            }
                        }
    
                        let obj = search
                        obj.title = search.displayTitle
                        let autoirrelevant = false
    
                        let potentialConfidence = pullFieldsFromSearch(
                            obj["search"],
                            [
                                "risk_confidence",
                                "risk_confidence_default",
                                "confidence",
                            ]
                        )
                        let potentialSeverity = pullFieldsFromSearch(
                            obj["search"],
                            [
                                "risk_severity",
                                "risk_impact",
                                "risk_severity_default",
                                "risk_severity_impact",
                                "severity",
                                "impact",
                            ]
                        )
                        let potentialATTACKTactic = pullFieldsFromSearch(
                            obj["search"],
                            ["attack_tactic", "tactic"]
                        )
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
                            potentialATTACKTechnique = matches.map(
                                (match) => match[1]
                            )
                            //console.log("potentialATTACKTechnique: "+potentialATTACKTechnique)
                        }
                        //Check search string using simple regex
                        matches = Array.from(
                            findAll(
                                /([Tt][0-9]{4})(\.[0-9]{3}){0,1}[\"\s]/g,
                                obj["search"]
                            )
                        )
                        if (
                            typeof matches != "undefined" &&
                            typeof matches[0] != "undefined" &&
                            matches[0][1] != ""
                        ) {
                            potentialATTACKTechnique = matches.map(
                                (match) => match[1]
                            )
                            //console.log("potentialATTACKTechnique: "+potentialATTACKTechnique)
                        }
                        //Also check search title for Technique IDs
                        if (potentialATTACKTechnique == "") {
                            let potentialATTACKTechnique = pullFieldsFromSearch(
                                obj["search"],
                                ["attack_technique", "attack_technique"]
                            )
                        }
                        let potentialAlertVolume = ""
                        if (potentialConfidence != "") {
                            // have to inverse confidence for alert volume
                            if (potentialConfidence == "Very High") {
                                potentialAlertVolume = "Very Low"
                            }
                            if (potentialConfidence == "High") {
                                potentialAlertVolume = "Low"
                            }
                            if (potentialConfidence == "Low") {
                                potentialAlertVolume = "High"
                            }
                            if (potentialConfidence == "Very Low") {
                                potentialAlertVolume = "Very High"
                            }
                        }
                        // obj["searchObj"] = search
                        autoirrelevant = false
                        if (
                            search.name.indexOf(" - Lookup Gen") >= 0 ||
                            search.name.indexOf(" - Threat Gen") >= 0 ||
                            search.name.indexOf(" - Context Gen") >= 0 ||
                            (standardESApps.indexOf(obj["app"]) >= 0 &&
                                obj["isCorrelationSearch"] == "false") ||
                            standardIrrelevantApps.indexOf(obj["app"]) >= 0
                        ) {
                            autoirrelevant = true
                            obj["status"] = ""
                        }
    
                        //Added filters
                        if (
                            ((obj["isCorrelationSearch"] == "true" &&
                                showOnlyCorrelations == "true") ||
                                (obj["isCorrelationSearch"] == "false" &&
                                    showOnlyCorrelations == "false") ||
                                showOnlyCorrelations == "") &&
                            ((obj["isEnabled"] == "true" &&
                                showOnlyEnabled == "true") ||
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
                            let searchTitle = obj["title"]
                                .replace(" - Rule", "")
                                .replace(/_/g, " ")
                                .replace(/:/g, "")
    
                            let searchResults
                            try {
                                searchResults = custom_index.search(searchTitle)
                            } catch (error) {
                                console.error("Error while searching", error)
                                searchResults = []
                            }
    
                            let status = "low"
                            let potentialMatch = ""
                            let potentialMatchName = ""
                            //console.log("Looking for", obj["title"], "in", enabled_searches, )
    
                            if (enabled_searches[obj["title"]]) {
                                status = "exact"
                                potentialMatch = enabled_searches[obj["title"]][0]
                                potentialMatchName =
                                    ShowcaseInfo.summaries[potentialMatch].name
                            } else if (searchResults.length == 0) {
                                status = "none"
                            } else if (searchResults[0].score > 30) {
                                if (
                                    searchResults.length == 1 ||
                                    searchResults[0].score -
                                        searchResults[1].score >
                                        5
                                ) {
                                    status = "likely"
                                    potentialMatch = searchResults[0].ref
                                    potentialMatchName =
                                        ShowcaseInfo.summaries[searchResults[0].ref]
                                            .name
                                } else {
                                    let listOfPotentials = []
                                    for (let i = 0; i < searchResults.length; i++) {
                                        if (searchResults[i].score > 30) {
                                            listOfPotentials.push(
                                                searchResults[i].ref
                                            )
                                        }
                                    }
                                    status = "potentials"
                                    potentialMatch = listOfPotentials.join("|")
                                }
                            }
    
                            content.push({
                                status: status,
                                autoirrelevant: autoirrelevant,
                                potentialMatch: potentialMatch,
                                potentialMatchName: potentialMatchName,
                                search: obj,
                            })
    
                            // console.log(obj['title'], searchTitle, status, potentialMatch, potentialMatchName, searchResults)
                        }
                    }
    
                    // set a flag to check if it performs the Automation for auto creating content card for a saved search
                    let isAutomation = false
    
                    // Merge in kvstore entries
                    for (let i = 0; i < content.length; i++) {
                        content[i]["current_bookmark_status"] = ""
                        content[i]["gotOverride"] = false
                        for (let g = 0; g < local_search_mappings.length; g++) {
                            if (
                                content[i].search.title ==
                                local_search_mappings[g].search_title
                            ) {
                                if (
                                    ShowcaseInfo.summaries[
                                        local_search_mappings[g].showcaseId
                                    ]
                                ) {
                                    content[i]["gotOverride"] = true
                                    content[i]["current_bookmark_status"] =
                                        ShowcaseInfo.summaries[
                                            local_search_mappings[g].showcaseId
                                        ]["bookmark_status"]
                                    content[i]["status"] = "exact"
                                    content[i]["potentialMatch"] =
                                        local_search_mappings[g].showcaseId
                                    content[i]["potentialMatchName"] =
                                        ShowcaseInfo.summaries[
                                            local_search_mappings[g].showcaseId
                                        ]["name"]
                                } else {
                                    content[i]["gotOverride"] = false
                                    content[i]["status"] = "irrelevant"
                                }
                            }
                        }
    
                        /****************************************
                         * Add the automation here
                         * **************************************/
    
                        // Try to start the Automation workflow for these saved searches,
                        // 1. which don't have mapped content card
                        // 2. which are CorrelationSearch
                        // 3. Which are enabled
    
                        if (
                            content[i]["status"] != "exact" &&
                            content[i]["search"]["isCorrelationSearch"] == "true" &&
                            content[i]["search"]["isEnabled"] == "true"
                        ) {
                            isAutomation =
                                autoCreateCustomContent(content[i]["search"]) ||
                                isAutomation
                        }
                    }
    
                    // Refresh the page after automation is complete, so that we can re-spawn and refresh the Dialog Box
                    if (isAutomation == true) {
                        window.location.href =
                            window.location.href.replace(
                                "bookmarked_content",
                                "bookmarked_content?#"
                            ) + "content-refresh"
                    } else {
                        parent.location.hash = "no-refresh"
                    }
                    // console.log("[====>] isAutomation: ", isAutomation);
    
                    let sortOrder = [
                        "likely",
                        "potentials",
                        "low",
                        "exact",
                        "irrelevant",
                    ]
    
                    content.sort(function (a, b) {
                        if (
                            sortOrder.indexOf(a.status) >
                            sortOrder.indexOf(b.status)
                        ) {
                            return 1
                        }
                        if (
                            sortOrder.indexOf(a.status) <
                            sortOrder.indexOf(b.status)
                        ) {
                            return -1
                        }
                        return 0
                    })
                }
    
                function generateSearchTableBody(content) {
                    let tablebody = $("<tbody>")
                    for (let i = 0; i < content.length; i++) {
                        if (
                            content[i]["status"] == "exact" &&
                            content[i]["gotOverride"] == false
                        ) {
                            updateStatus(
                                content[i]["search"]["title"],
                                content[i]["potentialMatch"],
                                "exact",
                                "automation"
                            )
                        }
                        if (
                            content[i]["status"] == "exact" &&
                            content[i]["current_bookmark_status"] !=
                                "successfullyImplemented"
                        ) {
                            updateStatus(
                                content[i]["search"]["title"],
                                content[i]["potentialMatch"],
                                "exact",
                                "automation"
                            )
                        }
    
                        if (
                            showOnlyStatus == "*" ||
                            content[i]["status"] == showOnlyStatus
                        ) {
                            let contentDescriptionRow = $("<tr>")
                                .css("display", "none")
                                .addClass("contentDescriptionRow")
                                .attr(
                                    "data-searchname",
                                    content[i]["search"]["title"]
                                )
                                .attr(
                                    "data-id",
                                    content[i]["search"]["title"].replace(
                                        /[^a-zA-Z0-9\-_]/g,
                                        ""
                                    )
                                )
                            let descriptionContent = $('<td colspan="5">')
                            let descriptionContentRow = $('<div class="row">')
                            let descriptionContentColumn1 = $(
                                '<div class="column">'
                            )
                            let descriptionContentColumn2 = $(
                                '<div class="column">'
                            )
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
                                        (content[i].search.disabled
                                            ? "No"
                                            : 'Yes <i class="icon-check enable-icon"></i>') +
                                        "</p></div>"
                                )
                            )
                            descriptionContentColumn2.append(
                                $(
                                    "<div><h3>" +
                                        _("Correlation Search").t() +
                                        "</h3><p>" +
                                        (content[i].search.isCorrelationSearch
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
                                        (content[i].search.isScheduled
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
                                $(
                                    "<div><h3>" +
                                        _("Search String").t() +
                                        "</h3></div>"
                                ).append($("<p>").text(content[i].search.search))
                            )
    
                            contentDescriptionRow.append(descriptionContent)
    
                            let row = $("<tr>")
                                .addClass("contentTitleRow")
                                .attr(
                                    "data-searchname",
                                    content[i]["search"]["title"]
                                )
                                .attr(
                                    "data-id",
                                    content[i]["search"]["title"].replace(
                                        /[^a-zA-Z0-9\-_]/g,
                                        ""
                                    )
                                )
                                .attr("data-content", JSON.stringify(content[i]))
                            if (content[i]["status"] == "exact") {
                                row.attr(
                                    "data-showcaseid",
                                    content[i]["potentialMatch"]
                                )
                            }
                            row.append(
                                '<td class="tableexpand" class="downarrow" ><a href="#" onclick="doSearchMapToggle(this); return false;"><i class="icon-chevron-right" /></a></td>'
                            )
                            let link =
                                $C["SPLUNKD_PATH"].replace("/splunkd/__raw", "") +
                                "/manager/Splunk_Security_Essentials/saved/searches?app=" +
                                content[i].search.app +
                                "&count=10&offset=0&itemType=&owner=&search=" +
                                encodeURIComponent(content[i]["search"]["title"])
    
                            row.append(
                                $('<td class="content-searchname">')
                                    .text(content[i]["search"]["title"])
                                    .append(
                                        $("<a>")
                                            .attr("href", link)
                                            .attr("target", "_blank")
                                            .addClass("external drilldown-link")
                                    )
                            )
    
                            row.append(
                                $('<td class="content-status">').append(
                                    generateStatusIcon(content[i]["status"])
                                )
                            )
    
                            let potentialMatchText = generateShowcaseColumnHTML(
                                content[i]["potentialMatch"]
                            )
                            if (content[i]["status"] == "likely") {
                                row.attr(
                                    "data-prediction",
                                    content[i]["potentialMatch"]
                                )
                                potentialMatchText.css("color", "gray")
                            } else if (content[i]["status"] == "potentials") {
                                potentialMatchText.css("color", "gray")
                            }
                            row.append(
                                $('<td class="content-potentialMatches">').append(
                                    potentialMatchText
                                )
                            )
    
                            row.append(
                                $('<td class="content-actions">').append(
                                    generateActionText(content[i], index)
                                )
                            )
    
                            tablebody.append(row, contentDescriptionRow)
                        }
                    }
                    return tablebody
                }
    
                function generateActionText(content, index) {
                    let actionText = $("<div>")
    
                    // If the custom content card is 1) auto created and 2) is mapped with a saved search,
                    // then it doesn't need these action buttons: Search, Create New, Not A Detection, Accept Recommendation.
                    // Logic to identify custom content: the showcaseId of custom content must start with "custom_"
                    let showcaseId =
                        "custom_" +
                        content["search"]["displayTitle"]
                            .replace(/ /g, "_")
                            .replace(/[^a-zA-Z0-9_]/g, "")
                    if (
                        !autoContentCardSet.has(showcaseId) ||
                        content["status"] != "exact"
                    ) {
                        if (content["status"] == "likely") {
                            actionText.append(
                                $("<div>")
                                    .addClass("action_acceptRecommendation")
                                    .text("Accept Recommendation")
                                    .click(function (evt) {
                                        let content = JSON.parse(
                                            $(evt.target)
                                                .closest("tr")
                                                .attr("data-content")
                                        )
                                        let showcaseId = $(evt.target)
                                            .closest("tr")
                                            .attr("data-prediction")
                                        let search_title = $(evt.target)
                                            .closest("tr")
                                            .attr("data-searchname")
                                        $(evt.target)
                                            .closest("tr")
                                            .find(".content-potentialMatches")
                                            .find("div")
                                            .css("color", "black")
                                        $(evt.target)
                                            .closest("tr")
                                            .find(".content-status")
                                            .html(generateStatusIcon("exact"))
    
                                        content["status"] = "exact"
                                        $(evt.target)
                                            .closest("tr")
                                            .attr(
                                                "data-content",
                                                JSON.stringify(content)
                                            )
                                        updateStatus(
                                            search_title,
                                            showcaseId,
                                            "exact",
                                            "manual"
                                        )
                                        $(evt.target)
                                            .closest("td")
                                            .html(
                                                generateActionText(content, index)
                                            )
                                    })
                            )
                        }
    
                        actionText.append(
                            $("<div>")
                                .addClass("action_findOther")
                                .text("Search")
                                .click(function (evt) {
                                    let content = JSON.parse(
                                        $(evt.target)
                                            .closest("tr")
                                            .attr("data-content")
                                    )
                                    let contentSelected = $.Deferred()
                                    let search_title = $(evt.target)
                                        .closest("tr")
                                        .attr("data-searchname")
                                    $.when(contentSelected).then(function (
                                        showcaseId
                                    ) {
                                        $(evt.target)
                                            .closest("tr")
                                            .find(".content-potentialMatches")
                                            .find("div")
                                            .css("color", "black")
                                            .html(
                                                generateShowcaseColumnHTML(
                                                    showcaseId
                                                )
                                            )
                                        $(evt.target)
                                            .closest("tr")
                                            .find(".content-status")
                                            .html(generateStatusIcon("exact"))
    
                                        content["status"] = "exact"
                                        $(evt.target)
                                            .closest("tr")
                                            .attr(
                                                "data-content",
                                                JSON.stringify(content)
                                            )
                                        updateStatus(
                                            search_title,
                                            showcaseId,
                                            "exact",
                                            "manual"
                                        )
                                        $(evt.target)
                                            .closest("td")
                                            .html(
                                                generateActionText(content, index)
                                            )
                                    })
    
                                    let myModal = new Modal(
                                        "SearchForContent",
                                        {
                                            title: "Search for Content",
                                            destroyOnHide: true,
                                            type: "wide",
                                        },
                                        $
                                    )
                                    myModal.$el.addClass("modal-extra-wide")
                                    myModal.body.html(
                                        $(
                                            "<p>" +
                                                _("Select Your Content Below").t() +
                                                "</p>"
                                        )
                                    )
    
                                    var timeoutId = 0
                                    myModal.body.append(
                                        $(
                                            '<input id="searchBar" type="text" style="width: 300px" aria-label="Input" />'
                                        ).on("keyup", function (e) {
                                            var code = e.keyCode || e.which
                                            if (code == 13) {
                                                clearTimeout(timeoutId)
    
                                                doSearch(
                                                    index.search(
                                                        $("#searchBar").val()
                                                    ),
                                                    contentSelected
                                                )
                                            } else if (
                                                $("#searchBar").val().length >= 4
                                            ) {
                                                clearTimeout(timeoutId)
                                                timeoutId = setTimeout(
                                                    doSearch,
                                                    500
                                                )
                                            }
                                        })
                                    )
    
                                    myModal.body.append("<hr />")
    
                                    myModal.body.append(
                                        '<p id="searchResultCount"></p>'
                                    )
    
                                    myModal.body.append(
                                        '<div id="searchResults"></div>'
                                    )
    
                                    myModal.footer.append(
                                        $("<button>")
                                            .attr({
                                                type: "button",
                                                "data-dismiss": "modal",
                                                "data-bs-dismiss": "modal",
                                            })
                                            .addClass("btn btn-primary ")
                                            .text("Cancel")
                                    )
                                    myModal.show()
                                })
                        )
    
                        actionText.append(
                            $("<div>")
                                .addClass("action_createNew")
                                .text("Create New")
                                .click(function (evt) {
    
                                    let content = JSON.parse(
                                        $(evt.target)
                                            .closest("tr")
                                            .attr("data-content")
                                    )
                                    let search_title = $(evt.target)
                                        .closest("tr")
                                        .attr("data-searchname")
                                    // console.log("Running New for", content)
    
                                    let summary = {
                                        name: content["search"]["displayTitle"],
                                        displayapp: content["search"]["app"],
                                        app: content["search"]["app"],
                                        description:
                                            content["search"]["description"],
                                        bookmark_status: "successfullyImplemented",
                                        bookmark_user: $C["USERNAME"],
                                        search: content["search"]["search"],
                                    }
    
                                    require([
                                        Splunk.util.make_full_url(
                                            "/static/app/Splunk_Security_Essentials/components/controls/CustomContent.js"
                                        ),
                                    ], function () {
                                        localStorage.setItem(
                                            "sse-summarySelectedToClone",
                                            JSON.stringify(summary)
                                        )
                                        localStorage.setItem(
                                            "sse-activeClick-custom",
                                            "clone"
                                        )
                                        location.href = "custom_content"
                                        // customContentModal(
                                        //     function (showcaseId, summary) {
                                        //         // There's some processing that occurs in SSEShowcaseInfo and we want to get the full detail here.
                                        //         ShowcaseInfo.summaries[showcaseId] =
                                        //             summary
                                        //         ShowcaseInfo.roles.default.summaries.push(
                                        //             showcaseId
                                        //         )
                                        //         // console.log("Return from creating new content", showcaseId, summary, generateShowcaseColumnHTML(showcaseId))
                                        //         $(evt.target)
                                        //             .closest("tr")
                                        //             .find(
                                        //                 ".content-potentialMatches"
                                        //             )
                                        //             .html(
                                        //                 generateShowcaseColumnHTML(
                                        //                     showcaseId
                                        //                 )
                                        //             )
                                        //         $(evt.target)
                                        //             .closest("tr")
                                        //             .find(".content-status")
                                        //             .html(
                                        //                 generateStatusIcon("exact")
                                        //             )
                                        //         content["status"] = "exact"
                                        //         $(evt.target)
                                        //             .closest("tr")
                                        //             .attr(
                                        //                 "data-content",
                                        //                 JSON.stringify(content)
                                        //             )
                                        //         updateStatus(
                                        //             search_title,
                                        //             showcaseId,
                                        //             "exact",
                                        //             "custom"
                                        //         )
                                        //         $(evt.target)
                                        //             .closest("td")
                                        //             .html(
                                        //                 generateActionText(
                                        //                     content,
                                        //                     index
                                        //                 )
                                        //             )
                                        //     },
                                        //     summary,
                                        //     content["search"]["extractions"]
                                        // )
                                    })
                                })
                        )
    
                        if (content["status"] != "irrelevant") {
                            actionText.append(
                                $("<div>")
                                    .addClass("action_markIrrelevant")
                                    .text("Not A Detection")
                                    .click(function (evt) {
                                        let content = JSON.parse(
                                            $(evt.target)
                                                .closest("tr")
                                                .attr("data-content")
                                        )
                                        content["status"] = "irrelevant"
                                        $(evt.target)
                                            .closest("tr")
                                            .attr(
                                                "data-content",
                                                JSON.stringify(content)
                                            )
                                        let search_title = $(evt.target)
                                            .closest("tr")
                                            .attr("data-searchname")
                                        $(evt.target)
                                            .closest("tr")
                                            .find(".content-potentialMatches")
                                            .html("")
                                        $(evt.target)
                                            .closest("tr")
                                            .find(".content-status")
                                            .html(generateStatusIcon("irrelevant"))
                                        updateStatus(
                                            search_title,
                                            "",
                                            "irrelevant",
                                            "manual"
                                        )
                                        $(evt.target)
                                            .closest("td")
                                            .html(
                                                generateActionText(content, index)
                                            )
                                    })
                            )
                        }
                    }
    
                    if (
                        content["status"] != "UNKNOWN" &&
                        content["status"] != "low"
                    ) {
                        actionText.append(
                            $("<div>")
                                .addClass("action_clear")
                                .text("Clear ")
                                .append('<i class="icon-close">')
                                .click(function (evt) {
                                    let content = JSON.parse(
                                        $(evt.target)
                                            .closest("tr")
                                            .attr("data-content")
                                    )
                                    content["status"] = "UNKNOWN"
                                    $(evt.target)
                                        .closest("tr")
                                        .attr(
                                            "data-content",
                                            JSON.stringify(content)
                                        )
    
                                    let search_title = $(evt.target)
                                        .closest("tr")
                                        .attr("data-searchname")
                                    $(evt.target)
                                        .closest("tr")
                                        .find(".content-potentialMatches")
                                        .html("")
                                    $(evt.target)
                                        .closest("tr")
                                        .find(".content-status")
                                        .html(generateStatusIcon("UNKNOWN"))
                                    updateStatus(
                                        search_title,
                                        "",
                                        "UNKNOWN",
                                        "manual"
                                    )
                                    $(evt.target)
                                        .closest("td")
                                        .html(generateActionText(content, index))
                                    // console.log("Running Clear for", content)
                                })
                        )
                    }
    
                    // Add edit button for custom contents which have mapped with a saved search
                    // No edit button for built-in contents
                    if (
                        ShowcaseInfo.summaries[showcaseId] !== undefined &&
                        content["status"] == "exact"
                    ) {
                        actionText.append(
                            $("<div>")
                                .addClass("action_edit")
                                .text("Edit")
                                .click(function (evt) {
                                    let summary = ShowcaseInfo.summaries[showcaseId]
                                    localStorage.setItem(
                                        "sse-summarySelectedToEdit",
                                        JSON.stringify(summary)
                                    )
                                    localStorage.setItem(
                                        "sse-activeClick-custom",
                                        "edit"
                                    )
                                    location.href = "custom_content"
                                    // editCustomContent(
                                    //     showcaseId,
                                    //     ShowcaseInfo,
                                    //     summary,
                                    //     false
                                    // )
                                })
                        )
                    }
    
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
    
                function doSearch(results, deferral) {
                    // This function is copied from addBookmark in bookmarked_content.js, but pulled var results = indexSearch($("#searchBar").val())
                    // console.log("Here are my search results against '" + $("#searchBar").val() + "'", results)
                    let maxSearchResults = 20
                    if (!results || results.length === 0) {
                        results = []
                        $("#searchResultCount").text(
                            Splunk.util.sprintf(_("Nothing found").t())
                        )
                    } else if (results.length > maxSearchResults) {
                        $("#searchResultCount").text(
                            Splunk.util.sprintf(
                                _("Showing %s out of %s results.").t(),
                                maxSearchResults,
                                results.length
                            )
                        )
                    } else {
                        $("#searchResultCount").text(
                            Splunk.util.sprintf(
                                _("Showing all %s results.").t(),
                                results.length
                            )
                        )
                    }
                    var tiles = $('<ul class="showcase-list"></ul>')
    
                    for (
                        var i = 0;
                        i < results.length && i < maxSearchResults;
                        i++
                    ) {
                        if (
                            typeof ShowcaseInfo["summaries"][results[i].ref] !=
                            "undefined"
                        ) {
                            const showcaseSetting =
                                ShowcaseInfo["summaries"][results[i].ref]
                            if (showcaseSetting.channel === "custom") {
                                // see Jira SSE-265
                                showcaseSetting.dashboard = cleanLink(
                                    showcaseSetting.dashboard,
                                    false
                                )
                            }
                            let tile = $(
                                '<li style="width: 230px; height: 320px"></li>'
                            )
                                .addClass("showcaseItemTile")
                                .append(BuildTile.build_tile(showcaseSetting, true))
                            if (results[i].score > 10) {
                                tile.addClass("topSearchHit")
                            }
                            let journeyStage = tile.find("a[href^=journey]").text()
                            let dashboardhref = tile.find("a").first().attr("href")
                            tile.attr("data-showcaseid", results[i].ref)
                            // console.log("Got my dashboardhref", dashboardhref)
                            while (tile.find("a").length > 0) {
                                tile.find("a")[0].outerHTML = tile
                                    .find("a")[0]
                                    .outerHTML.replace(/^<a/, "<span")
                                    .replace(/<\/a>/, "</span>")
                            }
                            tile.click(function (evt) {
                                let target = $(evt.target)
                                let showcaseId = target
                                    .closest("li")
                                    .attr("data-showcaseid")
    
                                if (target.prop("tagName") != "A") {
                                    deferral.resolve(showcaseId)
                                    $("#SearchForContent").modal("hide")
                                }
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
                            tiles.append(tile)
                        }
                    }
                    $("#searchResults").html(tiles)
                }
    
                function updateCount() {
                    let totalItems = $(".contentTitleRow")
                        .find(".content-status")
                        .find("i").length
                    let irrelevant = $(".contentTitleRow")
                        .find(".content-status")
                        .find("i.icon-close").length
                    let complete = $(".contentTitleRow")
                        .find(".content-status")
                        .find("i.icon-check").length
                    $("#ContentMappingStatus").html(
                        Splunk.util.sprintf(
                            _("%s complete / %s irrelevant / %s remaining").t(),
                            complete,
                            irrelevant,
                            totalItems - irrelevant - complete
                        )
                    )
                }
    
                function updateStatus(search_title, showcaseId, status, method) {
                    bustCache()
                    // console.log("Got a status update request for", search_title, status, showcaseId)
                    // Close the toggle if it's open
                    let search_title_cleaned = search_title.replace(
                        /[^a-zA-Z0-9\-_]/g,
                        ""
                    )
                    if (search_title_cleaned != "") {
                        if (
                            $(
                                ".contentDescriptionRow[data-id=" +
                                    search_title_cleaned +
                                    "]"
                            ).css("display") == "table-row"
                        ) {
                            doSearchMapToggle(
                                $(
                                    ".contentTitleRow[data-id=" +
                                        search_title_cleaned +
                                        "]"
                                ).find("td")[0]
                            )
                        }
                    }
    
                    // force refresh on the bookmark page
                    if (
                        $("#localContent")
                            .find(".modal-footer")
                            .find("button.btn-primary")
                            .attr("data-isrefreshset") != "yes"
                    ) {
                        $("#localContent").on("hide", function () {
                            location.reload()
                        })
                        $("#localContent")
                            .find(".modal-footer")
                            .find("button.btn-primary")
                            .attr("data-isrefreshset", "yes")
                            .text(_("Refresh Page").t())
                    }
    
                    updateCount()
                    // record status in dedicated kvstore
                    let record = {
                        _time: new Date().getTime() / 1000,
                        _key: search_title.replace(/[^a-zA-Z0-9]/g, ""),
                        search_title: search_title,
                        showcaseId: showcaseId,
                        user: Splunk.util.getConfigValue("USERNAME"),
                    }
                    handleContentMappingTelemetry(
                        status,
                        method,
                        ShowcaseInfo.summaries[showcaseId]
                    )
                    if (status == "UNKNOWN") {
                        deleteContentMapping(search_title, showcaseId)
                    } else {
                        addContentMapping(search_title, showcaseId)
                    }
                    // update bookmark_status
                    // get the current Showcase ID
    
                    // console.log("Evaluating clearing the bookmark from", )
                    let currentDivShowcaseId
                    if (search_title_cleaned != "") {
                        currentDivShowcaseId = $(
                            "tr.contentTitleRow[data-id=" +
                                search_title_cleaned +
                                "]"
                        ).attr("data-showcaseid")
                        // Set the new Showcase ID
                        $(
                            "tr.contentTitleRow[data-id=" +
                                search_title_cleaned +
                                "]"
                        ).attr("data-showcaseid", showcaseId)
                    }
    
                    if (
                        ((status == "UNKNOWN" || status == "irrelevant") &&
                            currentDivShowcaseId &&
                            currentDivShowcaseId != "") || // If we are unsetting the status altogether
                        (currentDivShowcaseId &&
                            currentDivShowcaseId != "" &&
                            showcaseId &&
                            showcaseId != "")
                    ) {
                        // If we're changing this to a new showcase
    
                        let ShouldUnset = true
                        for (let i = 0; i < $("tr.contentTitleRow").length; i++) {
                            if (
                                $($("tr.contentTitleRow")[i]).attr(
                                    "data-showcaseid"
                                ) == currentDivShowcaseId
                            ) {
                                ShouldUnset = false
                                // console.log("Not deleting the bookmark because we found a match", $($("tr.contentTitleRow")[i]))
                            }
                        }
                        // we need to unset this "successfullyImplemented" bookmark
                        if (ShouldUnset) {
                            $.ajax({
                                url:
                                    $C["SPLUNKD_PATH"] +
                                    '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/bookmark/?query={"_key": "' +
                                    currentDivShowcaseId +
                                    '"}',
                                type: "GET",
                                contentType: "application/json",
                                async: true,
                                success: function (returneddata) {
                                    if (returneddata.length != 0) {
                                        $.ajax({
                                            url:
                                                $C["SPLUNKD_PATH"] +
                                                "/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/bookmark/" +
                                                currentDivShowcaseId,
                                            type: "DELETE",
                                            headers: {
                                                "X-Requested-With":
                                                    "XMLHttpRequest",
                                                "X-Splunk-Form-Key":
                                                    window.getFormKey(),
                                            },
                                            async: true,
                                        })
                                    }
                                },
                                error: function (error, data, other) {
                                    //     console.log("Error Code!", error, data, other)
                                },
                            })
                        }
                    } else if (
                        showcaseId &&
                        showcaseId != "" &&
                        showcaseId != null
                    ) {
                        //console.log("Trying to set bookmark status for", ShowcaseInfo.summaries[showcaseId])
                        let status = "successfullyImplemented"
                        if (
                            typeof ShowcaseInfo.summaries[showcaseId]
                                .bookmark_status != "undefined" &&
                            ShowcaseInfo.summaries[showcaseId].bookmark_status !=
                                "" &&
                            ShowcaseInfo.summaries[showcaseId].bookmark_status !=
                                "none"
                        ) {
                            status =
                                ShowcaseInfo.summaries[showcaseId].bookmark_status
                        }
                        let record = {
                            _time: new Date().getTime() / 1000,
                            _key: showcaseId,
                            showcase_name: ShowcaseInfo.summaries[showcaseId].name,
                            status: status,
                            notes: ShowcaseInfo.summaries[showcaseId]
                                .bookmark_notes,
                            user: Splunk.util.getConfigValue("USERNAME"),
                        }
                        $.ajax({
                            url:
                                $C["SPLUNKD_PATH"] +
                                '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/bookmark/?query={"_key": "' +
                                record["_key"] +
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
                                            "X-Splunk-Form-Key":
                                                window.getFormKey(),
                                        },
                                        contentType: "application/json",
                                        async: true,
                                        data: JSON.stringify(record),
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
                    }
                    //
                }
    
                function generateStatusIcon(status) {
                    let statusText = $("<i>")
                        .css("font-size", "20px")
                        .attr("data-status", status)
                    if (status == "exact") {
                        statusText
                            .addClass("icon-check")
                            .css("color", "green")
                            .attr("title", _("Mapped").t())
                    } else if (status == "likely") {
                        statusText
                            .addClass("icon-question-circle")
                            .css("color", "orange")
                            .attr("title", _("Likely Match").t())
                    } else if (status == "potentials") {
                        statusText
                            .addClass("icon-question-circle")
                            .css("color", "gray")
                            .attr("title", _("Potential Match").t())
                    } else if (status == "irrelevant") {
                        statusText
                            .addClass("icon-close")
                            .css("color", "gray")
                            .attr("title", _("Marked as Irrelevant").t())
                    }
                    return statusText
                }
    
                function generateShowcaseColumnHTML(string) {
                    if (string) {
                        let potentialMatchText = $("<div>")
    
                        let ids = string.split("|")
                        for (let i = 0; i < ids.length; i++) {
                            let id = ids[i]
                            let local = $("<div>")
                            local.append(ShowcaseInfo.summaries[id].name)
    
                            // summary.dashboard is component of the content's showcase page URL
                            if (
                                ShowcaseInfo.summaries[id].dashboard &&
                                ShowcaseInfo.summaries[id].dashboard != "" &&
                                ShowcaseInfo.summaries[id].dashboard != null
                            ) {
                                local.append(
                                    $("<a>")
                                        .attr(
                                            "href",
                                            fullyDecodeURIComponent(
                                                ShowcaseInfo.summaries[id].dashboard
                                            )
                                        )
                                        .attr("target", "_blank")
                                        .addClass("external drilldown-link")
                                )
                            }
    
                            // add auto-create-flag if this content card is auto created by the automation
                            if (autoContentCardSet.has(id)) {
                                local.append(
                                    $("<p>")
                                        .addClass("auto-create-flag")
                                        .text("(Auto Created)")
                                )
                            }
                            potentialMatchText.append(local)
                        }
                        return potentialMatchText
                        // ShowcaseInfo.summaries[showcaseId]['name']
                        // let link = $C['SPLUNKD_PATH'].replace("/splunkd/__raw", "") + "/manager/Splunk_Security_Essentials/saved/searches?app=" + content[i].search.app + "&count=10&offset=0&itemType=&owner=&search=" + encodeURIComponent(content[i]['search']['title'])
                    } else {
                        return $("<div />")
                    }
                }
            })
            .catch((err) => {
                console.log("Error: ", err)
            })
    })
}

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
