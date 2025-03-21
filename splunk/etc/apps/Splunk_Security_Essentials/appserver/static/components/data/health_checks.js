function checkForMITREInLogReview(deferral) {
    $.ajax({
        url: Splunk.util.make_full_url(
            "/splunkd/__raw/servicesNS/nobody/SA-ThreatIntelligence/properties/log_review/incident_review?output_mode=json"
        ),
        async: true,
        error: function () {
            deferral.resolve("errored")
        },
        success: function (returneddata) {
            if (
                !returneddata ||
                returneddata.length == 0 ||
                Object.keys(returneddata).length == 0
            ) {
                deferral.resolve("errored")
            }
            var mystanza = {}
            for (let i = 0; i < returneddata.entry.length; i++) {
                mystanza[returneddata.entry[i].name] =
                    returneddata.entry[i].content
            }
            let newEventAttributes = JSON.parse(mystanza["event_attributes"])
            let addMITRETactic = true
            let addMITRETactic_Display = true
            let addMITRETechnique = true
            let addMITREAttack = true
            let addMITRETechnique_Display = true
            let addMITREDescription = false
            let addKillChain = true
            let addAnalyticStory = true
            for (let i = 0; i < newEventAttributes.length; i++) {
                if (newEventAttributes[i].field == "annotations.mitre_attack") {
                    addMITREAttack = false
                }
                if (
                    newEventAttributes[i].field ==
                    "annotations.mitre_attack.mitre_tactic"
                ) {
                    addMITRETactic_Display = false
                }
                if (
                    newEventAttributes[i].field ==
                    "annotations.mitre_attack.mitre_tactic_id"
                ) {
                    addMITRETactic = false
                }
                if (
                    newEventAttributes[i].field ==
                    "annotations.mitre_attack.mitre_technique"
                ) {
                    addMITRETechnique_Display = false
                }
                if (
                    newEventAttributes[i].field ==
                    "annotations.mitre_attack.mitre_technique_id"
                ) {
                    addMITRETechnique = false
                }
                if (newEventAttributes[i].field == "mitre_description") {
                    addMITREDescription = false
                }
                if (newEventAttributes[i].field == "killchain") {
                    addKillChain = false
                }
                if (newEventAttributes[i].field == "analytic_story") {
                    addAnalyticStory = false
                }
            }
            let shouldUpdate = false
            if (addMITREAttack) {
                shouldUpdate = true
                newEventAttributes.unshift({
                    field: "annotations.mitre_attack",
                    label: "MITRE ATT&CK",
                })
            }
            if (addMITRETactic_Display) {
                shouldUpdate = true
                newEventAttributes.unshift({
                    field: "annotations.mitre_attack.mitre_tactic",
                    label: "MITRE ATT&CK Tactic",
                })
            }
            if (addMITRETactic) {
                shouldUpdate = true
                newEventAttributes.unshift({
                    field: "annotations.mitre_attack.mitre_tactic_id",
                    label: "MITRE ATT&CK Tactic ID",
                })
            }
            if (addMITRETechnique_Display) {
                shouldUpdate = true
                newEventAttributes.unshift({
                    field: "annotations.mitre_attack.mitre_technique",
                    label: "MITRE ATT&CK Technique",
                })
            }
            if (addMITRETechnique) {
                shouldUpdate = true
                newEventAttributes.unshift({
                    field: "annotations.mitre_attack.mitre_technique_id",
                    label: "MITRE ATT&CK Technique ID",
                })
            }
            if (addMITREDescription) {
                shouldUpdate = true
                newEventAttributes.unshift({
                    field: "mitre_description",
                    label: "MITRE ATT&CK Description",
                })
            }
            if (addKillChain) {
                shouldUpdate = true
                newEventAttributes.unshift({
                    field: "killchain",
                    label: "Kill Chain Phase",
                })
            }
            if (addAnalyticStory) {
                shouldUpdate = true
                newEventAttributes.unshift({
                    field: "analytic_story",
                    label: "Analytic Story",
                })
            }
            mystanza["event_attributes"] = JSON.stringify(newEventAttributes)
            if (shouldUpdate) {
                deferral.resolve("needed", mystanza)
            } else {
                deferral.resolve("notneeded")
            }
        },
    })
}

function CheckWhatAppsArePresent(deferral) {
    let apps = {
        sankey_diagram_app: "sse-setup-app-sankey",
        "custom-radar-chart-viz": "sse-setup-app-radar",
        timeline_app: "sse-setup-app-timeline",
        "URL Toolbox": "sse-setup-app-utbox",
        "SA-Investigator": "sse-setup-app-sa-inv",
        InfoSec_App_for_Splunk: "sse-setup-app-infosec",
        "DA-ESS-ContentUpdate": "sse-setup-app-escu",
        lookup_editor: "sse-setup-app-lookup",
        Splunk_ML_Toolkit: "sse-setup-app-mltk",
        ThreatHunting: "sse-setup-app-threathunting",
        "SA-cim_vladiator": "sse-setup-app-sa-cim",
    }
    let returnObj = {}
    $.ajax({
        url:
            $C["SPLUNKD_PATH"] +
            "/services/apps/local?output_mode=json&count=0",
        type: "GET",
        async: false,
        success: function (returneddata) {
            for (let i = 0; i < returneddata.entry.length; i++) {
                // console.log("Got app 1", returneddata.entry[i])
                if (apps[returneddata.entry[i].name]) {
                    // console.log("Got app 2", returneddata.entry[i])
                    returnObj[apps[returneddata.entry[i].name]] = {
                        status: "installed",
                        version: returneddata.entry[i].content.version,
                    }
                    delete apps[returneddata.entry[i].name]
                }
                if (apps[returneddata.entry[i].content.label]) {
                    // console.log("Got app 3", returneddata.entry[i])
                    returnObj[apps[returneddata.entry[i].content.label]] = {
                        status: "installed",
                        version: returneddata.entry[i].content.version,
                    }
                    delete apps[returneddata.entry[i].content.label]
                }
            }
            for (let key in apps) {
                // console.log("No luck with", key, apps[key])
                returnObj[apps[key]] = {
                    status: "not_installed",
                    version: "N/A",
                }
            }
            deferral.resolve(returnObj)
        },
        error: function (xhr, textStatus, error) {},
    })
}
function CheckToSeeIfContentSourcesAreEnabled(deferral) {
    let returnObj = {}
    $.ajax({
        url: Splunk.util.make_full_url(
            "/splunkd/__raw/servicesNS/nobody/" +
                splunkjs.mvc.Components.getInstance("env").toJSON()["app"] +
                "/properties/essentials_updates?output_mode=json"
        ),
        async: true,
        success: function (returneddata) {
            let deferralStack = []
            for (let i = 0; i < returneddata.entry.length; i++) {
                let name = returneddata.entry[i].name
                let localDeferral = $.Deferred()
                deferralStack.push(localDeferral)
                $.ajax({
                    url: Splunk.util.make_full_url(
                        "/splunkd/__raw/servicesNS/nobody/" +
                            splunkjs.mvc.Components.getInstance("env").toJSON()[
                                "app"
                            ] +
                            "/configs/conf-essentials_updates/" +
                            name +
                            "?output_mode=json"
                    ),
                    //url: '/splunkd/__raw/servicesNS/nobody/' + splunkjs.mvc.Components.getInstance("env").toJSON()['app'] + '/properties/essentials_updates/' + name + '/value?output_mode=json',
                    async: true,
                    success: function (returneddata) {
                        let content = returneddata.entry[0].content
                        if (content.order && content.order > 0) {
                            returnObj[name] = content.disabled
                        }
                        localDeferral.resolve()
                    },
                    error: function (xhr, textStatus, error) {
                        localDeferral.resolve()
                    },
                })
            }
            $.when.apply($, deferralStack).then(function () {
                deferral.resolve(returnObj)
            })
        },
        error: function (xhr, textStatus, error) {
            deferral.resolve(returnObj)
        },
    })
}
function CheckIfESInstalled(deferral) {
    let returnObj = {
        isPresent: false,
        isOld: false,
        version: "N/A",
    }
    $.ajax({
        url: Splunk.util.make_full_url(
            "/splunkd/__raw/services/apps/local?output_mode=json&count=0"
        ),
        async: true,
        error: function () {
            deferral.resolve(returnObj)
        },
        success: function (returneddata) {
            // console.log("Got the ES Version Check Result", returneddata)
            for (let i = 0; i < returneddata["entry"].length; i++) {
                if (
                    returneddata["entry"][i].name ==
                    "SplunkEnterpriseSecuritySuite"
                ) {
                    if (
                        /^(5\.[012]\.*|4\..*|3\..*)/.test(
                            returneddata["entry"][i].content.version
                        )
                    ) {
                        // console.log("Needs Update", returneddata['entry'][i].content.version)
                        returnObj["isPresent"] = true
                        returnObj["isOld"] = true
                        returnObj["version"] =
                            returneddata["entry"][i].content.version
                    } else {
                        // console.log("No Update Needed", returneddata['entry'][i].content.version)
                        returnObj["isPresent"] = true
                        returnObj["isOld"] = false
                        returnObj["version"] =
                            returneddata["entry"][i].content.version
                    }
                }
            }
            deferral.resolve(returnObj)
        },
    })
}

function CheckWhatScheduledSearchesScheduled(deferral) {
    let relevantSearches = {
        "Generate Data Availability ML Model for Latency": {
            description:
                "Generates the nightly baseline for the Data Availability model. Only required if you have configured the Data Inventory.",
            desiredCron: "49 2 * * *",
            shortName: "Data_Availability_Model",
        },
    }

    let returnObj = {}
    for (let search in relevantSearches) {
        returnObj[relevantSearches[search].shortName] = false
    }

    $.ajax({
        url:
            $C["SPLUNKD_PATH"] +
            "/servicesNS/-/Splunk_Security_Essentials/saved/searches?output_mode=json&count=0",
        type: "GET",
        async: true,
        success: function (savedSearchObj) {
            for (let i = 0; i < savedSearchObj.entry.length; i++) {
                if (relevantSearches[savedSearchObj.entry[i].name]) {
                    if (
                        savedSearchObj.entry[i].content["disabled"] == false &&
                        savedSearchObj.entry[i].content.cron_schedule.length >=
                            9
                    ) {
                        returnObj[
                            relevantSearches[
                                savedSearchObj.entry[i].name
                            ].shortName
                        ] = true
                    }
                }
            }
            deferral.resolve(returnObj)
        },
        error: function () {
            deferral.resolve(returnObj)
        },
    })
}
function CheckIfDataInventoryComplete(deferral) {
    require([
        "jquery",
        "underscore",
        //'json!' + $C['SPLUNKD_PATH'] + '/services/pullJSON?config=data_inventory&locale=' + window.localeString,
        "json!" +
            $C["SPLUNKD_PATH"] +
            "/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/data_inventory_products?bust=" +
            Math.round(Math.random() * 50000),
        "json!" +
            $C["SPLUNKD_PATH"] +
            "/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/data_inventory_eventtypes?bust=" +
            Math.round(Math.random() * 50000),
        "json!" +
            $C["SPLUNKD_PATH"] +
            "/services/pullCSV?config=sse-default-products",
    ], function (
        $,
        _,
        //data_inventory,
        data_inventory_products,
        data_inventory_eventtypes,
        sse_default_products
    ) {
        // console.log("I got this", data_inventory_products, data_inventory_eventtypes, sse_default_products)
        let dsc_count = 0
        let dsc_checked = 0

        let dscs_with_products = 0

        let products_default_total = 0
        let products_default_checked = 0
        let products_custom_total = 0
        let products_custom_needsReview = 0

        let hash_products_default = {}
        let hash_dscs = {}

        for (let i = 0; i < data_inventory_eventtypes.length; i++) {
            dsc_count++
            if (
                data_inventory_eventtypes[i].status == "complete" ||
                data_inventory_eventtypes[i].status == "failure"
            ) {
                dsc_checked++
            }
        }

        for (let i = 0; i < sse_default_products.length; i++) {
            if (
                !(
                    sse_default_products[i]["default_sourcetype_search"] &&
                    sse_default_products[i]["vendorName"] &&
                    sse_default_products[i]["productName"]
                )
            ) {
                continue
            }
            let productId = ""
            // this is 'cause of some weird bug in pullCSV where I think it's inserting an invalid character at the start of the first line. I don't use it much though, so just doing a workaround for now.
            for (key in sse_default_products[i]) {
                if (key.indexOf("productId") >= 0) {
                    productId = sse_default_products[i][key]
                }
            }
            hash_products_default[productId] = sse_default_products[i]
            // console.log("default product hash", hash_products_default)
            products_default_total++
        }

        for (let i = 0; i < data_inventory_products.length; i++) {
            if (
                !(
                    data_inventory_products[i].stage == "step-sourcetype" &&
                    (data_inventory_products[i].status == "pending" ||
                        data_inventory_products[i].status == "blocked" ||
                        data_inventory_products[i].status == "new")
                )
            ) {
                // console.log("Looking at a product", data_inventory_products[i].productId, data_inventory_products[i], hash_products_default)
                if (
                    hash_products_default[data_inventory_products[i].productId]
                ) {
                    products_default_checked++
                } else {
                    products_custom_total++
                    if (
                        data_inventory_products[i].stage == "needsConfirmation"
                    ) {
                        products_custom_needsReview++
                    }
                }
                if (
                    typeof data_inventory_products[i].eventtypeId !=
                        "undefined" &&
                    data_inventory_products[i].eventtypeId != "undefined"
                ) {
                    let dscs = data_inventory_products[i].eventtypeId.split("|")
                    for (let g = 0; g < dscs.length; g++) {
                        if (hash_dscs[dscs[g]]) {
                            hash_dscs[dscs[g]]++
                        } else {
                            hash_dscs[dscs[g]] = 1
                        }
                    }
                }
            }
        }

        dscs_with_products = Object.keys(hash_dscs).length

        let returnObj = {
            dsc_count: dsc_count,
            dsc_checked: dsc_checked,
            dscs_with_products: dscs_with_products,
            products_default_total: products_default_total,
            products_default_checked: products_default_checked,
            products_custom_total: products_custom_total,
            products_custom_needsReview: products_custom_needsReview,
        }
        deferral.resolve(returnObj)
    })
}

function CheckIfSearchesAreMapped(deferral) {
    require([
        "jquery",
        "underscore",
        Splunk.util.make_full_url(
            "/static/app/Splunk_Security_Essentials/indexed.js"
        ),
        //'json!' + $C['SPLUNKD_PATH'] + '/services/pullJSON?config=data_inventory&locale=' + window.localeString,
        "json!" +
            $C["SPLUNKD_PATH"] +
            "/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/bookmark?bust=" +
            Math.round(Math.random() * 50000),
        "json!" +
            $C["SPLUNKD_PATH"] +
            "/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/local_search_mappings?bust=" +
            Math.round(Math.random() * 50000),
        "json!" +
            $C["SPLUNKD_PATH"] +
            "/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/custom_content?bust=" +
            Math.round(Math.random() * 50000),
    ], function (
        $,
        _,
        indexed,
        //data_inventory,
        bookmarks,
        local_search_mappings,
        custom_content
    ) {
        const { getData, KEY_SAVEDSEARCHES } = indexed
        getSavedSearches()
            .then((data) => {
                if (data) {
                    saved_searches = data
                }
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

                let num_saved_searches = 0 // done
                let num_mapped_saved_searches = 0 // done
                let num_nondetection_searches = 0 // done

                let num_enabled_content = 0
                let num_bookmarked_content = 0

                let num_custom_content = custom_content.length

                for (let i = 0; i < local_search_mappings.length; i++) {
                    if (local_search_mappings[i].showcaseId == "") {
                        num_nondetection_searches++
                    } else {
                        num_mapped_saved_searches++
                    }
                }
                for (let i = 0; i < saved_searches.length; i++) {
                    // console.log("saved_searches[i]",saved_searches[i])
                    if (
                        saved_searches[i]["isEnabled"] == "true" &&
                        saved_searches[i]["isScheduled"] == "true" &&
                        !(
                            saved_searches[i].name.indexOf(" - Lookup Gen") >=
                                0 ||
                            saved_searches[i].name.indexOf(" - Threat Gen") >=
                                0 ||
                            saved_searches[i].name.indexOf(" - Context Gen") >=
                                0 ||
                            (standardESApps.indexOf(saved_searches[i].app) >=
                                0 &&
                                !(
                                    saved_searches[i]["isCorrelationSearch"] ==
                                    "false"
                                )) ||
                            standardIrrelevantApps.indexOf(
                                saved_searches[i].app
                            ) >= 0
                        )
                    ) {
                        num_saved_searches++
                        // console.log("Got saved search #",num_saved_searches, saved_searches[i])
                    }
                }

                for (let i = 0; i < bookmarks.length; i++) {
                    if (bookmarks[i].status == "successfullyImplemented") {
                        num_enabled_content++
                    }
                    if (bookmarks[i].status != "none") {
                        num_bookmarked_content++
                    }
                }

                let returnObj = {
                    num_enabled_content: num_enabled_content,
                    num_bookmarked_content: num_bookmarked_content,
                    num_saved_searches: num_saved_searches,
                    num_mapped_saved_searches: num_mapped_saved_searches,
                    num_nondetection_searches: num_nondetection_searches,
                    num_custom_content: num_custom_content,
                }
                deferral.resolve(returnObj)
            })
            .catch((error) => {
                console.log("Error: ", error)
            })
    })
}

function getSavedSearchByName(name) {
    return new Promise((resolve, reject) => {
        getData(KEY_SAVEDSEARCHES)
            .then((returneddata) => {
                if (returneddata) {
                    let searches = JSON.parse(returneddata)
                    for (let i = 0; i < searches.length; i++) {
                        if (searches[i]["name"] === name) {
                            resolve(searches[i])
                            break
                        }
                    }
                    resolve(-1)
                }
            })
            .catch((error) => {
                console.log("Error: ", error)
                reject(error)
            })
    })
}

function getSavedSearches() {
    return new Promise((resolve, reject) => {
        getData(KEY_SAVEDSEARCHES)
            .then((returneddata) => {
                if (returneddata) {
                    resolve(returneddata)
                }
            })
            .catch((error) => {
                console.log("Error: ", error)
                reject(error)
            })
    })
}
