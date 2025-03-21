'use strict';

let myObj = $("a[data-target-view=home]").clone()
myObj.removeAttr("data-active")
myObj.attr("id", "launchConfigurationLink")
myObj.find("span").text("Configuration")
myObj.removeAttr("data-target-view")
myObj.attr("title", "Configuration")
myObj.attr("href", "#")
myObj.click(function () {
    $("#systemConfig").css("display", "block");
    $("#systemConfigBackdrop").css("display", "block");
    return false;
})
$("a[data-target-view=home]").parent().append(myObj)

//Get JSON property dynamically
function getProperty(json, path) {
    var tokens = path.split(".");
    var obj = json;
    for (var i = 0; i < tokens.length; i++) {
        obj = obj[tokens[i]];
    }
    return obj;
}


setTimeout(function () {

    require(['jquery',
        'underscore',
        Splunk.util.make_full_url("/static/app/Splunk_Security_Essentials/components/controls/Modal.js"),
        // 'json!' + $C['SPLUNKD_PATH'] + '/services/SSEShowcaseInfo?locale=' + window.localeString,
        'json!' + $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/external_content/',
        'json!' + $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/sse_app_config',
        "components/splunk/Searches",
        'components/data/health_checks'
    ], function ($,
        _,
        Modal,
        // ShowcaseInfo,
        external_content,
        appConfig,
        Searches) {

        const callContentUpdate = function (queue) {
            // Here we have added 7 because the final object will look like this,
            // {
            //     Splunk_Research_Baselines: true,
            //     Splunk_Research_Deployments: true,
            //     Splunk_Research_Detections: true,
            //     Splunk_Research_Lookups: true,
            //     Splunk_Research_Macros: true,
            //     Splunk_Research_Stories: true,
            //     Splunk_Research_Version: true,
            // }
            if (Object.keys(queue).length > 6) {
                if (Object.values(queue).every(element => element === true)) {
                    updateShowcaseInfo()
                    updatesecurityDataJourneyCustomContent();
                }
            }
        }
        let sendPublicKey = "True";
        const utilityFun = (verification, content, newBuild, lastBuild, contentUpdateQueue, lastIteration = false) => {
            if (sessionStorage.getItem("public_key")) {
                sendPublicKey = "False";
            }

            $.ajax({
                url: $C['SPLUNKD_PATH'] + '/services/downloadContentUpdate?config=' + content.channel + "&version=" + newBuild + "&verification=" + verification + "&sendPublicKey=" + sendPublicKey,
                async: true,
                type: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-Splunk-Form-Key': window.getFormKey(),
                },
                timeout: 60000,
                success: function (returneddata) {
                    // Clear session Storage
                    sessionStorage.removeItem("verification" + content.channel)

                    if (returneddata.JSON) {
                        if (returneddata.PGP) {
                            sessionStorage.setItem("public_key", returneddata.PGP)
                        }
                        verifySignatures(sessionStorage.getItem("public_key"), returneddata.sign, returneddata.JSON, content, newBuild, lastBuild, contentUpdateQueue)
                        return;
                    }
                    if (lastIteration) {
                        sessionStorage.removeItem("public_key");
                    }

                    if (typeof returneddata == "string") {
                        try {
                            returneddata = JSON.parse(returneddata);
                        } catch (error) {
                            return;
                        }
                    }
                    //console.log("newBuild",newBuild, "lastBuild",lastBuild,content.channel )
                    if (newBuild == "") {
                        if (typeof returneddata['build_id'] === 'undefined') {
                            newBuild = JSON.stringify(returneddata).length;
                        } else {
                            newBuild = returneddata['build_id']
                        }

                        if (newBuild == lastBuild) {
                            return true;
                        }
                    }

                    if (content.type == "app") {
                        let showcasesToUpdate = []
                        //console.log("CONTENTUPDATE - data to add", returneddata)
                        for (let showcase in returneddata) {
                            //_key, _time, showcaseId, channel, local_json, json, user
                            let summary = returneddata[showcase];

                            //Always set the individual content channel to be the same as the master channel
                            summary['channel'] = content.channel
                            if (typeof summary['dashboard'] === 'undefined') {
                                summary['dashboard'] = "showcase_custom?showcaseId=" + summary['id']
                            }

                            let valid = true;
                            let requiredNonNullFields = ["name", "description", "dashboard", "journey", "usecase", "category"]
                            let missingOrInvalidFields = []
                            //console.log("CONTENTUPDATE - Posting to custom_content", summary)
                            for (let i = 0; i < requiredNonNullFields.length; i++) {
                                if (!summary[requiredNonNullFields[i]] || summary[requiredNonNullFields[i]] == "") {
                                    valid = false;
                                    missingOrInvalidFields.push(requiredNonNullFields[i])
                                }
                            }
                            if (valid) {
                                let id = showcase;
                                let myChannel = "";
                                if (summary.app) {
                                    myChannel = summary.app;
                                } else if (summary.channel) {
                                    myChannel = summary.channel;
                                }

                                showcasesToUpdate.push({
                                    _key: summary.id,
                                    _time: Date.now() / 1000,
                                    showcaseId: id,
                                    channel: myChannel,
                                    user: "AutomaticallyDownloaded",
                                    json: JSON.stringify(summary)
                                })
                            } else {
                                //console.log("Got invalid fields for downloaded content", missingOrInvalidFields, summary)
                            }
                        }
                        if (showcasesToUpdate.length > 0) {

                            $.ajax({
                                url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/custom_content/batch_save',
                                type: 'POST',
                                headers: {
                                    'X-Requested-With': 'XMLHttpRequest',
                                    'X-Splunk-Form-Key': window.getFormKey(),
                                },
                                contentType: "application/json",
                                async: true,
                                data: JSON.stringify(showcasesToUpdate),
                                success: function (returneddata) {
                                    content_update.resolve()
                                },
                                error: function (returneddata) {
                                    // content_update.resolve()
                                }
                            })
                        }

                        //console.log("CONTENTUPDATE - newBuild lastBuild and buildObj and etc.", lastBuild, buildObj, newBuild, content)
                        buildObj.build = newBuild
                        buildObj.last_updated = Date.now() / 1000
                        let build_id_update = $.Deferred();
                        let content_update = $.Deferred();
                        $.ajax({
                            url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/external_content/batch_save',
                            type: 'POST',
                            headers: {
                                'X-Requested-With': 'XMLHttpRequest',
                                'X-Splunk-Form-Key': window.getFormKey(),
                            },
                            contentType: "application/json",
                            async: true,
                            data: JSON.stringify([buildObj]),
                            success: function (returneddata) {
                                build_id_update.resolve()
                            },
                            error: function (returneddata) {
                                build_id_update.resolve()
                            }
                        })

                        $.when(build_id_update, content_update).then(function () {
                            triggerUpdateAvailable(content.name);
                        })

                    } else if (content.type == "splunkresearch" || content.type == "mitre") {
                        // console.log("Checking", content.channel, content);
                        //let new_build_id = newdata.length;
                        let new_build_id = newBuild;
                        //newdata = JSON.parse(returneddata);
                        let newdata = returneddata;
                        // console.log("Got data", newdata)
                        let found = false
                        // console.log("Got an external_content_library", external_content)
                        let contentUpdateRequests = external_content.map((data) => {
                            if (data._key == content.channel && data.build != new_build_id) {
                                //Content already downloaded and stored in the KVstore from downloadContentUpdate endpoint
                                found = true;
                                contentUpdateRequestsQueue[content.channel] = true;
                                callContentUpdate(contentUpdateRequestsQueue);
                            }
                        })

                        let buildIdUpdateRequests = external_content.map((data) => {
                            if (typeof data != "undefined" && typeof data._key != "undefined" && data._key == content.channel && data.build != new_build_id) {

                                // console.log('Creating request for -> ', data._key);
                                found = true
                                let build_object = data;
                                //console.log("Updated content found. Updating "+content.channel+" from "+data.build+" to "+new_build_id);
                                build_object['build'] = new_build_id;
                                build_object['last_checked'] = Date.now() / 1000;
                                build_object['last_updated'] = Date.now() / 1000;


                                return $.ajax({
                                    url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/external_content/' + build_object['_key'],
                                    type: 'POST',
                                    headers: {
                                        'X-Requested-With': 'XMLHttpRequest',
                                        'X-Splunk-Form-Key': window.getFormKey(),
                                    },
                                    contentType: "application/json",
                                    async: true,
                                    data: JSON.stringify(build_object),
                                })
                            } else if (typeof data != "undefined" && typeof data.channel != "undefined" && data.channel == content.channel && data.build == new_build_id) {
                                found = true;
                                //console.log("Found the same build id for", content.channel, data.build, new_build_id)
                                let build_object = data;
                                build_object['last_checked'] = Date.now() / 1000;
                                return $.ajax({
                                    url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/external_content/' + build_object['_key'],
                                    type: 'POST',
                                    headers: {
                                        'X-Requested-With': 'XMLHttpRequest',
                                        'X-Splunk-Form-Key': window.getFormKey(),
                                    },
                                    contentType: "application/json",
                                    async: true,
                                    data: JSON.stringify(build_object),
                                })
                            }
                        })

                        if (contentUpdateRequests.length > 0) {
                            $.when(contentUpdateRequests).then(response => {
                                bustCache();
                                // content_update.resolve()
                                // if (content.channel == "Splunk_Research_Detections") {
                                //     //Splunk_Research_Detections completes last so if this one is finished we can run the merge script
                                //     updateShowcaseInfo()
                                // }
                            })
                        }


                        if (buildIdUpdateRequests.length > 0) {
                            $.when(buildIdUpdateRequests).then(response => {
                                bustCache();
                                triggerUpdateAvailable(content.name);
                            })
                        }

                        if (!found) {
                            let build_object = {
                                "_key": content.channel,
                                "first_checked": Date.now() / 1000,
                                "last_checked": Date.now() / 1000,
                                "last_updated": Date.now() / 1000,
                                "channel": content.channel,
                                "build": new_build_id
                            }
                            let jsonstorage = {
                                "_key": content.channel,
                                "_time": Date.now() / 1000,
                                "version": new_build_id,
                                "description": content.description,
                                "json": JSON.stringify(newdata),
                                "compression": content.channel == "mitreattack",
                                "config": content.channel,
                            }

                            // console.log(content)
                            // console.log("New content found. Downloading "+content.channel+" "+new_build_id);
                            contentUpdateQueue[content.channel] = true;
                            callContentUpdate(contentUpdateQueue);
                            let contentUpdate = true;

                            let buildIdUpdate = $.ajax({
                                url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/external_content',
                                type: 'POST',
                                headers: {
                                    'X-Requested-With': 'XMLHttpRequest',
                                    'X-Splunk-Form-Key': window.getFormKey(),
                                },
                                contentType: "application/json",
                                async: true,
                                data: JSON.stringify(build_object),
                            })


                            $.when([contentUpdate, buildIdUpdate]).then(function (response1) {

                                // console.log('Response1 -> ',response1[0]);
                                // console.log('Response2 -> ',response1[1]);

                                bustCache();
                                // if (content.channel == "Splunk_Research_Detections") {
                                //     //Splunk_Research_Detections completes last so if this one is finished we can run the merge script
                                //     // console.log('Calling updateShowcase from not found state');
                                //     updateShowcaseInfo()
                                // }
                                triggerUpdateAvailable(content.name);
                            })

                        }
                    }
                },
                error: function (xhr, textStatus, error) {
                    console.log("Error downloading new external content", xhr, textStatus, error)
                    // console.log("Didn't get any new content")
                    // customSummaryInfo.roles.default.summaries = Object.keys(customSummaryInfo.summaries)
                    // LaunchExportDialog(customSummaryInfo, wereKeysDeleted)
                }
            })

        }

        const verifySignatures = (passedPublicKey, passedSignature, passedMessage, content, newBuild, lastBuild, contentUpdateQueue) => {

            (async () => {
                // Reading Public Key
                const publicKey = await openpgp.readKey({ armoredKey: passedPublicKey });
                // Reading the message
                const message = await openpgp.createMessage({ text: passedMessage });
                // Reading the signature
                const signature = await openpgp.readSignature({
                    armoredSignature: passedSignature // parse detached signature
                });

                const verificationResult = await openpgp.verify({
                    message, // Message object
                    signature,
                    verificationKeys: publicKey
                });
                const { verified, keyID } = verificationResult.signatures[0];
                try {
                    await verified; // throws on invalid signature
                    // console.log(`Signature verified (for ${content.channel})`);
                    utilityFun("verified", content, newBuild, lastBuild, contentUpdateQueue)
                } catch (e) {
                    throw new Error(`Signature could not be verified (for ${content.channel}):  ${e.message}`);
                }
            })()
        }



        //Check if ES and ESCU installed
        $.ajax({
            url: $C['SPLUNKD_PATH'] + '/services/apps/local?output_mode=json&count=0',
            type: 'GET',
            async: false,
            success: function (returneddata) {

                for (let i = 0; i < returneddata['entry'].length; i++) {
                    if (returneddata['entry'][i].name == "SplunkEnterpriseSecuritySuite") {
                        localStorage["isESInstalled"] = true
                        localStorage["es-version"] = returneddata['entry'][i]["content"]["version"]
                        localStorage["es-major-version"] = returneddata['entry'][i]["content"]["version"].split(".")[0]
                        localStorage["es-minor-version"] = returneddata['entry'][i]["content"]["version"].split(".")[1]
                        localStorage["es-patch-version"] = returneddata['entry'][i]["content"]["version"].split(".")[2]
                    }
                    if (returneddata['entry'][i].name == "DA-ESS-ContentUpdate") {
                        localStorage["isESCUInstalled"] = true
                        localStorage["escu-version"] = returneddata['entry'][i]["content"]["version"]
                        localStorage["escu-major-version"] = returneddata['entry'][i]["content"]["version"].split(".")[0]
                        localStorage["escu-minor-version"] = returneddata['entry'][i]["content"]["version"].split(".")[1]
                        localStorage["escu-patch-version"] = returneddata['entry'][i]["content"]["version"].split(".")[2]
                    }
                    if (returneddata['entry'][i].name == "Splunk_Security_Essentials") {
                        localStorage["sse-version"] = returneddata['entry'][i]["content"]["version"]
                        localStorage["sse-build"] = returneddata['entry'][i]["content"]["build"]
                        localStorage["sse-update.version"] = returneddata['entry'][i]["content"]["update.version"] ?? ""
                        localStorage["sse-update.homepage"] = returneddata['entry'][i]["content"]["update.homepage"] ?? ""
                        if (localStorage["sse-update.version"] != "") {
                            localStorage["sse-has-update"] = true
                        } else {
                            localStorage["sse-has-update"] = false
                        }
                    }
                }
                if (!localStorage["isESInstalled"]) {
                    localStorage["isESInstalled"] = false
                }
                if (!localStorage["isESCUInstalled"]) {
                    localStorage["isESCUInstalled"] = false
                }
            },
            error: function (xhr, textStatus, error) {
                localStorage["isESInstalled"] = false
                localStorage["isESCUInstalled"] = false
            }
        })

        //Store down Splunk versions for use in dashboard logic
        localStorage["splunk-version"] = $C["VERSION_LABEL"]
        localStorage["splunk-major-version"] = $C["VERSION_LABEL"].split(".")[0]
        localStorage["splunk-minor-version"] = $C["VERSION_LABEL"].split(".")[1]
        localStorage["splunk-patch-version"] = $C["VERSION_LABEL"].split(".")[2]

        //Check if we have a Showcaseinfo in the KVStore that hasn't been updated yet
        setTimeout(function () {
            if (
                typeof ShowcaseInfo != "undefined" &&
                (
                    (
                        typeof ShowcaseInfo["research_version"] != "undefined" &&
                        typeof localStorage[localStoragePreface + "-" + "Splunk_Research_Detections-version"] != "undefined" &&
                        ShowcaseInfo["research_version"] != localStorage[localStoragePreface + "-" + "Splunk_Research_Detections-version"]
                    )
                    ||
                    (
                        typeof ShowcaseInfo["research_version"] == "undefined" &&
                        typeof localStorage[localStoragePreface + "-" + "Splunk_Research_Detections-version"] != "undefined"
                    )
                )
            ) {
                updateShowcaseInfo()
                updatesecurityDataJourneyCustomContent();
            } else {
                //console.log("ShowcaseInfo[\"research_version\"]",ShowcaseInfo)
                //console.log("localStorage[\"sse-Splunk_Research_Detections-version\"]",localStorage[localStoragePreface + "-" + "Splunk_Research_Detections-version"])
                if (typeof localStorage["sse-Splunk_Research_Detections-version"] != "undefined") {
                    localStorage[localStoragePreface + "-" + "showcaseinfo-version"] = localStorage[localStoragePreface + "-" + "Splunk_Research_Detections-version"]
                }
            }
        }, 3500)

        //Check if the MITRE looku list is built correctly or is outdated, otherwise rebuild.
        setTimeout(function () {
            var shouldUpdateMitreLookup = false
            Searches.setSearch("checkMITREListLookup", {
                autostart: true,
                targetJobIdTokenName: "checkMITREListLookup",
                searchString: ['| inputlookup mitre_enterprise_list'],
                onDataCallback: function onDataCallback(data) {
                    if (typeof data.rows == "undefined") {
                        //Run Update
                        //console.log("No rows returned from lookup",data)
                        shouldUpdateMitreLookup = true

                    } else if (data.rows.length < 200) {
                        //Lookup not correct, run update
                        //console.log("Too few rows in lookup",data.rows.length)
                        shouldUpdateMitreLookup = true

                    } else if (typeof data.fields != "undefined" && data.fields.indexOf("Version") > -1) {
                        var MitreVersion = data.rows[0][data.fields.indexOf("Version")]
                        if (MitreVersion != localStorage[localStoragePreface + "-" + "mitreattack-version"]) {
                            //Version is not the same as in the KVstore, run update
                            //console.log("Version is not the same as in the KVstore,",MitreVersion,localStorage[localStoragePreface + "-" + "mitreattack-version"])
                            shouldUpdateMitreLookup = true
                        } else {
                            //console.log("Version is  the same as in the KVstore",MitreVersion,localStorage[localStoragePreface + "-" + "mitreattack-version"])
                        }
                    } else {
                        //All good, do nothing
                        //console.log("All good do nothing")
                    }

                    if (shouldUpdateMitreLookup) {
                        //Run update
                        if (typeof localStorage[localStoragePreface + "-" + "mitreattack-version"] != "undefined") {
                            updateMitreMatrixList(localStorage[localStoragePreface + "-" + "mitreattack-version"])
                        } else (
                            //Run update, but we don't seem to know the version. Just add 1 for now.
                            updateMitreMatrixList(1)
                        )
                    }

                }, onDoneCallback: function onDoneCallback(response) {
                    if (typeof response._previousAttributes.data.messages[0] != "undefined" && typeof response._previousAttributes.data.messages[0].type != "undefined" && response._previousAttributes.data.messages[0].type == "INFO") {
                        //console.log("All done, no need to do anything here",response._previousAttributes.data.messages[0].type, response._previousAttributes.data.messages[0].text)
                    } else {
                        //console.log("All done, lookup had no data, run update",response)
                        shouldUpdateMitreLookup = true
                        //Run update
                        if (typeof localStorage[localStoragePreface + "-" + "mitreattack-version"] != "undefined") {
                            updateMitreMatrixList(localStorage[localStoragePreface + "-" + "mitreattack-version"])
                        } else (
                            //Run update, but we don't seem to know the version. Just add 1 for now.
                            updateMitreMatrixList(1)
                        )
                    }

                }, onErrorCallback: function onErrorCallback(errorMessage) {
                    //console.log("All error do something")
                    shouldUpdateMitreLookup = true
                    if (typeof localStorage[localStoragePreface + "-" + "mitreattack-version"] != "undefined") {
                        updateMitreMatrixList(localStorage[localStoragePreface + "-" + "mitreattack-version"])
                    } else (
                        //Run update, but we don't seem to know the version. Just add 1 for now.
                        updateMitreMatrixList(1)
                    )
                }
            });
        }, 2500)


        function setUpDemoConfig(demofile) {
            if (!demofile) {
                demofile = "botsv3"
            }
            let config = {
                "searches": "1",
                "data_inventory": "1",
                "custom_content": "1",
                "bookmarks": "1"
            }
            let enabledAppsDeferral = $.Deferred()
            $.ajax({
                url: $C['SPLUNKD_PATH'] + '/services/apps/local?output_mode=json&count=0',
                type: 'GET',
                async: true,
                success: function (returneddata) {
                    enabledAppsDeferral.resolve(returneddata);
                },
                error: function (xhr, textStatus, error) {
                    enabledAppsDeferral.resolve({ "entry": [] })
                }
            })
            let savedSearchesDeferral = $.Deferred()
            $.ajax({
                url: $C['SPLUNKD_PATH'] + '/services/saved/searches?output_mode=json&count=0',
                type: 'GET',
                async: true,
                success: function (returneddata) {
                    savedSearchesDeferral.resolve(returneddata);
                },
                error: function (xhr, textStatus, error) {
                    savedSearchesDeferral.resolve({ "entry": [] })
                }
            })

            let demoBlobDeferral = $.Deferred()

            $.ajax({
                url: 'https://sse-content.s3.amazonaws.com/demo_config_' + demofile + '.json',
                type: 'GET',
                async: true,
                success: function (returneddata) {
                    demoBlobDeferral.resolve(returneddata);
                },
                error: function (xhr, textStatus, error) {
                    triggerError("Got an error grabbing your demo config. Please refresh this page to try again.")
                }
            })


            $.when(enabledAppsDeferral, savedSearchesDeferral, demoBlobDeferral).then(function (enabledApps, savedSearches, blob) {
                // console.log("loaded", arguments)
                // console.log("enabledApps", enabledApps)
                // console.log("savedSearches", savedSearches)
                let apps = []
                for (let i = 0; i < enabledApps.entry.length; i++) {
                    apps.push(enabledApps.entry[i].name)
                }
                window.dvapps = apps
                // console.log("finalApps", apps)
                let searches = []
                let validKeys = ["action.correlationsearch", "action.correlationsearch.enabled", "action.correlationsearch.label", "action.email.sendresults", "action.notable", "action.notable.param.default_owner", "action.notable.param.default_status", "action.notable.param.drilldown_name", "action.notable.param.drilldown_search", "action.notable.param.nes_fields", "action.notable.param.rule_description", "action.notable.param.rule_title", "action.notable.param.security_domain", "action.notable.param.severity", "action.risk", "action.risk.param._risk_object", "action.risk.param._risk_object_type", "action.risk.param._risk_score", "action.summary_index._name", "alert.digest_mode", "alert.suppress", "alert.suppress.fields", "alert.suppress.period", "alert.track", "counttype", "cron_schedule", "description", "disabled", "dispatch.earliest_time", "dispatch.latest_time", "dispatch.rt_backfill", "enableSched", "is_visible", "quantity", "relation", "search"]
                for (let i = 0; i < savedSearches.entry.length; i++) {
                    searches[savedSearches.entry[i].name] = {}
                    for (let key in savedSearches.entry[i]['content']) {
                        if (validKeys.indexOf(key) >= 0) {
                            searches[savedSearches.entry[i].name][key] = savedSearches.entry[i]['content'][key]
                        }
                    }
                }
                window.dvsearches = searches
                // console.log("finalSearches", searches)

                config["enabledApps"] = apps
                config["savedSearches"] = searches
                loadDemoSetup(config, blob)
            })

        }
        function loadDemoSetup(config, blob) {

            if (config["enabledApps"] && config["searches"] && config["searches"] == 1) {
                // console.log("Launching saved searches")

                let svc = splunkjs.mvc.createService();


                for (let i = 0; i < blob["searches"].length; i++) {
                    if (config["enabledApps"].indexOf(blob["searches"][i].app) == -1) {
                        blob["searches"][i].app = "search";
                    }
                    if (!config["savedSearches"][blob["searches"][i].source]) {
                        let title = blob["searches"][i].source
                        let record = {
                            "cron_schedule": "1 2 3 4 5",
                            "disabled": "0",
                            "action.correlationsearch": "0",
                            "action.correlationsearch.enabled": "1",
                            "action.correlationsearch.label": title.replace(/^.*?- /, "").replace(/ -.*?$/, ""),
                            "action.email.sendresults": "0",
                            "action.notable": "1",
                            "action.notable.param.security_domain": title.replace(/ - .*/, "").toLowerCase(),
                            "action.notable.param.severity": "high",
                            "action.notable.param.rule_title": title.replace(/^.*?- /, "").replace(/ -.*?$/, ""),
                            "action.notable.param.rule_description": "Placeholder Generated - " + title.replace(/^.*?- /, "").replace(/ -.*?$/, ""),
                            "action.notable.param.nes_fields": "dest,extension",
                            "action.notable.param.drilldown_name": "View details",
                            "action.notable.param.drilldown_search": "| Generic Placeholder",
                            "action.notable.param.default_status": "",
                            "action.notable.param.default_owner": "",
                            "action.risk": "1",
                            "action.risk.param._risk_object": "dest",
                            "action.risk.param._risk_object_type": "system",
                            "action.risk.param._risk_score": "100",
                            "action.summary_index._name": "notable",
                            "alert.digest_mode": "1",
                            "alert.suppress": "1",
                            "alert.suppress.fields": "dest,extension",
                            "alert.suppress.period": "86300s",
                            "alert.track": "false",
                            "counttype": "number of events",
                            "relation": "greater than",
                            "quantity": "0",
                            "description": "Generic Placeholder - " + title.replace(/ - .*/, "").toLowerCase(),
                            "dispatch.earliest_time": "rt-5m@m",
                            "dispatch.latest_time": "rt+5m@m",
                            "dispatch.rt_backfill": "1",
                            "enableSched": "1",
                            "is_visible": "false",
                            "search": "| generic placeholder",
                        }

                        let fileDeferred = $.Deferred();
                        let appscope = {}
                        appscope['owner'] = "admin"
                        appscope['app'] = blob["searches"][i].app;
                        appscope['sharing'] = "app";
                        let files = svc.configurations(appscope);

                        files.fetch({ 'search': 'name=savedsearches"' }, function (err, files) {
                            let confFile = files.item("savedsearches");
                            fileDeferred.resolve(confFile)

                        });
                        fileDeferred.done(function (confFile) {
                            confFile.create(title, record, function (err, stanza) {
                                if (err) {

                                } else {
                                    // console.log("save issue", arguments)
                                    return true;
                                }
                            })
                        });

                        // console.log("Saving", title, record)
                    } else {

                        config["savedSearches"][blob["searches"][i].source]["cron_schedule"] = "1 2 3 4 5"
                        config["savedSearches"][blob["searches"][i].source]["disabled"] = "0"

                        let fileDeferred = $.Deferred();
                        let appscope = {}
                        appscope['owner'] = "admin"
                        appscope['app'] = blob["searches"][i].app;
                        appscope['sharing'] = "app";
                        let files = svc.configurations(appscope);
                        files.fetch({ 'search': 'name=savedsearches"' }, function (err, files) {
                            let confFile = files.item("savedsearches");
                            fileDeferred.resolve(confFile)

                        });
                        fileDeferred.done(function (confFile) {
                            confFile.post(blob["searches"][i].source, config["savedSearches"][blob["searches"][i].source], function (err, stanza) {
                                if (err) {

                                } else {
                                    // console.log("save issue", arguments)
                                    return true;
                                }
                            })
                        });

                        // console.log("Updating", blob["searches"][i].source, config["savedSearches"][blob["searches"][i].source])
                    }
                }
            } else {
                // console.log("Skipping searches")
            }
            let deferrals = []
            if (config["data_inventory"] && config["data_inventory"] == 1) {
                let myDeferral1 = $.Deferred()
                let myDeferral2 = $.Deferred()
                deferrals.push(myDeferral1)
                deferrals.push(myDeferral2)
                // console.log("Launching data inventory")
                for (let i = 0; i < blob["data_inventory_products"].length; i++) {
                    blob["data_inventory_products"][i]["_key"] = blob["data_inventory_products"][i]["productId"]
                }
                for (let i = 0; i < blob["data_inventory_eventtypes"].length; i++) {
                    blob["data_inventory_eventtypes"][i]["_key"] = blob["data_inventory_eventtypes"][i]["eventtypeId"]
                }
                setTimeout(function () {

                    $.ajax({
                        url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/data_inventory_products/',
                        type: 'DELETE',
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest',
                            'X-Splunk-Form-Key': window.getFormKey(),
                        },
                        async: true,
                        success: function (returneddata) {
                        },
                        error: function (xhr, textStatus, error) {
                        }
                    })
                }, 4000)


                setTimeout(function () {

                    $.ajax({
                        url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/data_inventory_products/batch_save',
                        type: 'POST',
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest',
                            'X-Splunk-Form-Key': window.getFormKey(),
                        },
                        contentType: "application/json",
                        async: true,
                        data: JSON.stringify(blob["data_inventory_products"]),
                        success: function (returneddata) {
                            // console.log("Got a return from my big update", returneddata)
                            myDeferral1.resolve()
                        },
                        error: function () {
                            // console.log("kvstore errors", arguments);
                            myDeferral1.resolve()
                        }
                    })
                }, 4500)

                setTimeout(function () {

                    $.ajax({
                        url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/data_inventory_eventtypes/',
                        type: 'DELETE',
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest',
                            'X-Splunk-Form-Key': window.getFormKey(),
                        },
                        async: true,
                        success: function (returneddata) {
                        },
                        error: function (xhr, textStatus, error) {
                        }
                    })
                }, 5500)

                setTimeout(function () {

                    $.ajax({
                        url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/data_inventory_eventtypes/batch_save',
                        type: 'POST',
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest',
                            'X-Splunk-Form-Key': window.getFormKey(),
                        },
                        contentType: "application/json",
                        async: true,
                        data: JSON.stringify(blob["data_inventory_eventtypes"]),
                        success: function (returneddata) {
                            // console.log("Got a return from my big update", returneddata)
                            myDeferral2.resolve()
                        },
                        error: function () {
                            // console.log("kvstore errors", arguments);
                            myDeferral2.resolve()
                        }
                    })
                }, 6000)

            } else {
                // console.log("Skipping data_inventory")
            }
            if (config["bookmarks"] && config["bookmarks"] == 1) {
                // console.log("Launching bookmarks")
                let myDeferral1 = $.Deferred()
                let myDeferral2 = $.Deferred()
                let myDeferral3 = $.Deferred()
                deferrals.push(myDeferral1)
                deferrals.push(myDeferral2)
                deferrals.push(myDeferral3)

                for (let i = 0; i < blob["bookmark"].length; i++) {
                    blob["bookmark"][i]["_time"] = Math.round(Date.now() / 1000)
                    blob["bookmark"][i]["_key"] = blob["bookmark"][i]["key"]
                }
                for (let i = 0; i < blob["local_search_mappings"].length; i++) {
                    blob["local_search_mappings"][i]["_time"] = Math.round(Date.now() / 1000)
                    blob["local_search_mappings"][i]["_key"] = blob["local_search_mappings"][i]["search_title"].replace(/[^a-zA-Z0-9]/g, "")
                }
                for (let i = 0; i < blob["custom_content"].length; i++) {
                    blob["custom_content"][i]["_time"] = Math.round(Date.now() / 1000)
                    blob["custom_content"][i]["_key"] = blob["custom_content"][i]["showcaseId"]
                }
                setTimeout(function () {

                    $.ajax({
                        url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/bookmark/',
                        type: 'DELETE',
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest',
                            'X-Splunk-Form-Key': window.getFormKey(),
                        },
                        async: true,
                        success: function (returneddata) {
                        },
                        error: function (xhr, textStatus, error) {
                        }
                    })
                }, 7500)

                setTimeout(function () {

                    $.ajax({
                        url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/bookmark/batch_save',
                        type: 'POST',
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest',
                            'X-Splunk-Form-Key': window.getFormKey(),
                        },
                        contentType: "application/json",
                        async: true,
                        data: JSON.stringify(blob["bookmark"]),
                        success: function (returneddata) {
                            // console.log("Got a return from my big update", returneddata)
                            myDeferral1.resolve()
                        },
                        error: function () {
                            // console.log("kvstore errors", arguments);
                            myDeferral1.resolve()
                        }
                    })
                }, 8000)

                setTimeout(function () {

                    $.ajax({
                        url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/local_search_mappings/',
                        type: 'DELETE',
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest',
                            'X-Splunk-Form-Key': window.getFormKey(),
                        },
                        async: true,
                        success: function (returneddata) {
                        },
                        error: function (xhr, textStatus, error) {
                        }
                    })
                }, 8500)

                setTimeout(function () {

                    $.ajax({
                        url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/local_search_mappings/batch_save',
                        type: 'POST',
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest',
                            'X-Splunk-Form-Key': window.getFormKey(),
                        },
                        contentType: "application/json",
                        async: true,
                        data: JSON.stringify(blob["local_search_mappings"]),
                        success: function (returneddata) {
                            // console.log("Got a return from my big update", returneddata)
                            myDeferral2.resolve()
                        },
                        error: function () {
                            // console.log("kvstore errors", arguments);
                            myDeferral2.resolve()
                        }
                    })
                }, 9000)

                setTimeout(function () {

                    $.ajax({
                        url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/custom_content/',
                        type: 'DELETE',
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest',
                            'X-Splunk-Form-Key': window.getFormKey(),
                        },
                        async: true,
                        success: function (returneddata) {
                        },
                        error: function (xhr, textStatus, error) {
                        }
                    })
                }, 9500)

                setTimeout(function () {

                    $.ajax({
                        url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/custom_content/batch_save',
                        type: 'POST',
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest',
                            'X-Splunk-Form-Key': window.getFormKey(),
                        },
                        contentType: "application/json",
                        async: true,
                        data: JSON.stringify(blob["custom_content"]),
                        success: function (returneddata) {
                            // console.log console.log("Got a return from my big update", returneddata)
                            myDeferral3.resolve()
                        },
                        error: function () {
                            // console.log("kvstore errors", arguments);
                            myDeferral3.resolve()
                        }
                    })
                }, 10000)

            } else {
                // console.log("Skipping bookmarks")
            }
            $.when.apply($, deferrals).then(function () {

                bustCache(true)
                // setTimeout(function(){
                //     location.reload()
                // }, 4000)
            });
        }
        function HandleAppImportUpdate(deferral) {
            let versionCheck = $.Deferred();
            CheckIfESInstalled(versionCheck)

            $.when(versionCheck).then(function (returnObj) {
                let isOld = returnObj["isOld"]
                let isPresent = returnObj["isPresent"]
                let version = returnObj["version"]

                if (isOld) {
                    let update_es = $.Deferred()
                    let update_es_da = $.Deferred()
                    let update_es_main = $.Deferred()
                    $.ajax({
                        url: Splunk.util.make_full_url('/splunkd/__raw/servicesNS/nobody/SplunkEnterpriseSecuritySuite/properties/inputs/app_imports_update%3A%2F%2Fupdate_es?output_mode=json'),
                        async: true,
                        error: function () {
                            update_es.resolve({ "status": "errored" })
                        },
                        success: function (returneddata) {
                            let stanza = {}
                            let status = "errored"
                            // console.log("Got the App Import Result", returneddata)
                            for (let i = 0; i < returneddata['entry'].length; i++) {
                                stanza[returneddata['entry'][i].name] = returneddata['entry'][i].content;
                                if (returneddata['entry'][i].name == "app_regex") {
                                    if (returneddata['entry'][i].content.indexOf("Splunk_Security_Essentials") >= 0) {
                                        status = "notneeded"
                                    } else {
                                        status = "needed"
                                        stanza[returneddata['entry'][i].name] = returneddata['entry'][i].content + "|(Splunk_Security_Essentials)"
                                    }
                                }
                            }
                            update_es.resolve({ "status": status, "stanza": stanza })
                        }
                    })

                    $.ajax({
                        url: Splunk.util.make_full_url('/splunkd/__raw/servicesNS/nobody/SplunkEnterpriseSecuritySuite/properties/inputs/app_imports_update%3A%2F%2Fupdate_es_da?output_mode=json'),
                        async: true,
                        error: function () {
                            update_es_da.resolve({ "status": "errored" })
                        },
                        success: function (returneddata) {
                            let stanza = {}
                            let status = "errored"
                            // console.log("Got the App Import Result", returneddata)
                            for (let i = 0; i < returneddata['entry'].length; i++) {
                                stanza[returneddata['entry'][i].name] = returneddata['entry'][i].content;
                                if (returneddata['entry'][i].name == "app_regex") {
                                    if (returneddata['entry'][i].content.indexOf("Splunk_Security_Essentials") >= 0) {
                                        status = "notneeded"
                                    } else {
                                        status = "needed"
                                        stanza[returneddata['entry'][i].name] = returneddata['entry'][i].content + "|(Splunk_Security_Essentials)"
                                    }
                                }
                            }
                            update_es_da.resolve({ "status": status, "stanza": stanza })
                        }
                    })

                    $.ajax({
                        url: Splunk.util.make_full_url('/splunkd/__raw/servicesNS/nobody/SplunkEnterpriseSecuritySuite/properties/inputs/app_imports_update%3A%2F%2Fupdate_es_main?output_mode=json'),
                        async: true,
                        error: function () {
                            update_es_main.resolve({ "status": "errored" })
                        },
                        success: function (returneddata) {
                            let stanza = {}
                            let status = "errored"
                            // console.log("Got the App Import Result", returneddata)
                            for (let i = 0; i < returneddata['entry'].length; i++) {
                                stanza[returneddata['entry'][i].name] = returneddata['entry'][i].content;
                                if (returneddata['entry'][i].name == "app_regex") {
                                    if (returneddata['entry'][i].content.indexOf("Splunk_Security_Essentials") >= 0) {
                                        status = "notneeded"
                                    } else {
                                        status = "needed"
                                        stanza[returneddata['entry'][i].name] = returneddata['entry'][i].content + "|(Splunk_Security_Essentials)"
                                    }
                                }
                            }
                            update_es_main.resolve({ "status": status, "stanza": stanza })
                        }
                    })

                    $.when(update_es, update_es_da, update_es_main).then(function (es, es_da, es_main) {
                        // reusing variable names? I know, I'm a jerk. But lots of code to code.
                        // console.log("Got status for each", es, es_da, es_main)
                        let update_es = $.Deferred()
                        let update_es_da = $.Deferred()
                        let update_es_main = $.Deferred()
                        var appscope = {}
                        appscope['owner'] = "nobody"
                        appscope['app'] = 'SplunkEnterpriseSecuritySuite';
                        appscope['sharing'] = "app";
                        let svc = splunkjs.mvc.createService();
                        let files = svc.configurations(appscope);
                        if (es.status == "needed") {
                            // console.log("Updating es App Imports Stanza", es)
                            let fileDeferred = $.Deferred();
                            let name = "app_imports_update%3A%2F%2Fupdate_es";
                            files.fetch({ 'search': 'name=inputs"' }, function (err, files) {
                                let confFile = files.item("inputs");
                                fileDeferred.resolve(confFile)

                            });
                            fileDeferred.done(function (confFile) {
                                confFile.post(name, es.stanza, function (err, stanza) {
                                    if (err) {
                                        update_es.resolve({ "status": "error", "error": err, "args": arguments })
                                    } else {
                                        update_es.resolve({ "status": "success", "args": arguments })
                                        return true;
                                    }
                                })
                            });
                        } else {
                            update_es.resolve({ "status": "success" });
                        }

                        if (es_da.status == "needed") {
                            // console.log("Updating es_da App Imports Stanza", es_da)
                            let fileDeferred = $.Deferred();
                            let name = "app_imports_update%3A%2F%2Fupdate_es_da";
                            files.fetch({ 'search': 'name=inputs"' }, function (err, files) {
                                let confFile = files.item("inputs");
                                fileDeferred.resolve(confFile)

                            });
                            fileDeferred.done(function (confFile) {
                                confFile.post(name, es_da.stanza, function (err, stanza) {
                                    if (err) {
                                        update_es_da.resolve({ "status": "error", "error": err, "args": arguments })
                                    } else {
                                        update_es_da.resolve({ "status": "success", "args": arguments })
                                        return true;
                                    }
                                })
                            });
                        } else {
                            update_es_da.resolve({ "status": "success" });
                        }

                        if (es_main.status == "needed") {
                            // console.log("Updating es App Imports Stanza", es_main)
                            let fileDeferred = $.Deferred();
                            let name = "app_imports_update%3A%2F%2Fupdate_es_main";
                            files.fetch({ 'search': 'name=inputs"' }, function (err, files) {
                                let confFile = files.item("inputs");
                                fileDeferred.resolve(confFile)

                            });
                            fileDeferred.done(function (confFile) {
                                confFile.post(name, es_main.stanza, function (err, stanza) {
                                    if (err) {
                                        update_es_main.resolve({ "status": "error", "error": err, "args": arguments })
                                    } else {
                                        update_es_main.resolve({ "status": "success", "args": arguments })
                                        return true;
                                    }
                                })
                            });
                        } else {
                            update_es_main.resolve({ "status": "success" });
                        }

                        $.when(update_es, update_es_da, update_es_main).then(function (es, es_da, es_main) {
                            // console.log("Complete!", es, es_da, es_main)
                            let wereAllSuccessful = true;
                            if (es.status == "error" || es_da.status == "error" || es_main == "error") {
                                wereAllSuccessful = false;
                            }
                            deferral.resolve(wereAllSuccessful)
                        })
                    })

                }
            })
        }





        function addMITREToLogReview(mystanza, deferral) {

            var appscope = {}
            appscope['owner'] = Splunk.util.getConfigValue("USERNAME")
            appscope['app'] = 'SA-ThreatIntelligence';
            appscope['sharing'] = "global";
            var svc = splunkjs.mvc.createService();
            var files = svc.configurations(appscope);
            var fileDeferred = $.Deferred();
            let name = "incident_review";
            files.fetch({ 'search': 'name=log_review"' }, function (err, files) {
                var confFile = files.item("log_review");
                fileDeferred.resolve(confFile)

            });
            fileDeferred.done(function (confFile) {
                confFile.post(name, mystanza, function (err, stanza) {
                    if (err) {
                        deferral.resolve("error", err)
                    } else {
                        deferral.resolve("success")
                        return true;
                    }
                })
            });
        }
        // Now we initialize the Modal itself
        var myModal = new Modal("systemConfig", {
            title: _("System Configuration").t(),
            backdrop: 'static',
            keyboard: false,
            destroyOnHide: false
        }, $);

        myModal.$el.addClass("modal-extra-wide")

        myModal.$el.on("shown.bs.modal", function () {
            $(".modal-header").append($('<button>').addClass('close').attr({
                'type': 'button',
                'data-dismiss': 'modal',
                'data-bs-dismiss': 'modal',
                'aria-label': 'Close'
            }).append($('<span>').attr('aria-hidden', true).text('&times;')).click(function () {
                $("#systemConfig").hide()
                $("#systemConfigBackdrop").hide()
            })
            );

            // Suggested Apps
            $("#suggested_apps").append("<p>" + _("Splunk Security Essentials leverages the capabilities of several other Splunk apps. Consider adding theser to get full value out of the app, and out of Splunk.").t() + "</p>")
            $("#suggested_apps").append(
                $("<div>").append(
                    $("<h4>" + _("Visualizations used for SSE itself").t() + "</h4>"),
                    $('<table class=\"table\"><colgroup><col span="1" style="width: 20%"/> <col span="1" style="width: 15%"/> <col span="1" style="width: 15%"/><col span="1" style="width: 50%"/></colgroup>  <col span="1" style="width: 15%"/> <thead><tr><th>App Name</th><th>Status</th><th>Splunkbase</th><th>Notes</th></tr></thead><tbody><tr><td>Sankey</td><td id="sse-setup-app-sankey"></td><td><a href="https://splunkbase.splunk.com/app/3112/" class="external drilldown-link" target="_blank" rel="noopener noreferrer">link </td><td>Used to visualize related functionality, and connections betweens content and metadata.</td></tr><tr><td>Radar Chart</td><td id="sse-setup-app-radar"></td><td><a href="https://splunkbase.splunk.com/app/3772/" class="external drilldown-link" target="_blank" rel="noopener noreferrer">link </td><td>Used in the Analytics Advisor dashboards to track coverage of content across multiple dimensions.</td></tr><tr><td>Timeline Visualization</td><td id="sse-setup-app-timeline"></td><td><a href="https://splunkbase.splunk.com/app/3120/" class="external drilldown-link" target="_blank" rel="noopener noreferrer">link </td><td>Used in the Analyze ES Risk Attributions dashboard to track risk events over time for an object.</td></tr></tbody></table>'),
                    $("<h4>" + _("Apps used for Analytics").t() + "</h4>"),
                    $('<table class=\"table\"><colgroup><col span="1" style="width: 20%"/> <col span="1" style="width: 15%"/> <col span="1" style="width: 15%"/><col span="1" style="width: 50%"/></colgroup><thead><tr><th>App Name</th><th>Status</th><th>Splunkbase</th><th>Notes</th></tr></thead><tbody><tr><td>URL Toolbox</td><td id="sse-setup-app-utbox"></td><td><a href="https://splunkbase.splunk.com/app/2734/" class="external drilldown-link" target="_blank" rel="noopener noreferrer">link </td><td>Enables string similarity testing, domain parsing, and basic randomness detection.</td></tr><tr><td>Machine Learning Toolkit</td><td id="sse-setup-app-mltk"></td><td><a href="https://splunkbase.splunk.com/app/2890/" class="external drilldown-link" target="_blank" rel="noopener noreferrer">link </td><td>Used by the Data Availability dashboard to analyze ingested data latency.</td></tr></tbody></table>'),
                    $("<h4>" + _("Optional apps not used in Splunk Security Essentials, but often recommended").t() + "</h4>"),
                    $('<table class=\"table\"><colgroup><col span="1" style="width: 20%"/> <col span="1" style="width: 15%"/> <col span="1" style="width: 15%"/><col span="1" style="width: 50%"/></colgroup><thead><tr><th>App Name</th><th>Status</th><th>Splunkbase</th><th>Notes</th></tr></thead><tbody><tr><td>SA-Investigator</td><td id="sse-setup-app-sa-inv"></td><td><a href="https://splunkbase.splunk.com/app/3749/" class="external drilldown-link" target="_blank" rel="noopener noreferrer">link </td><td>' + _("Tab-based dashboards that complement ES for better/faster/stronger investigation.").t() + '</td></tr><tr><td>InfoSec App</td><td id="sse-setup-app-infosec"></td><td><a href="https://splunkbase.splunk.com/app/4240/" class="external drilldown-link" target="_blank" rel="noopener noreferrer">link </td><td>' + _("Visualizations for those getting started.").t() + '</td></tr><tr><td>Enterprise Security Content Update</td><td id="sse-setup-app-escu"></td><td><a href="https://splunkbase.splunk.com/app/3449/" class="external drilldown-link" target="_blank" rel="noopener noreferrer">link </td><td>' + _("Provides Enterprise Security customers out-of-the-box content for detection, investigation, and response of security events.").t() + '</td></tr><tr><td>Lookup File Editor</td><td id="sse-setup-app-lookup"></td><td><a href="https://splunkbase.splunk.com/app/1724/" class="external drilldown-link" target="_blank" rel="noopener noreferrer">link </td><td>' + _("Easy ability to update CSV or KVStore lookups through the UI.").t() + '</td></tr><tr><td>SA-cim_vladiator</td><td id="sse-setup-app-sa-cim"></td><td><a href="https://splunkbase.splunk.com/app/2968/" class="external drilldown-link" target="_blank" rel="noopener noreferrer">link </td><td>' + _("The CIM Compliance checks in this app are a simplified version of SA-cim_validator.").t() + '</td></tr><tr><td>ThreatHunting</td><td id="sse-setup-app-threathunting"></td><td><a href="https://splunkbase.splunk.com/app/4305/" class="external drilldown-link" target="_blank" rel="noopener noreferrer">link </td><td>' + _("Olaf Hartong's app has a large amount of content useful for threat hunting.").t() + '</td></tr></tbody></table>')
                )
            )
            // clears out the kvstore and refreshes the page to trigger an automatic update
            $("#update_sse").on("opened", function () {

                let sseAppVersion = window.localStorage["sse-version"]
                let releaseNotesSSEExternalLinkUrl = window.makeHelpLinkURL("Splunk_Security_Essentials", "systemConfig.sse.latest.releaseNotes1", "latest")
                let releaseNotesSSEExternalLinkDescription = "Open Release Notes on docs.splunk.com"
                let releaseNotesSSEExternalLink = "<a class=\"external drilldown-link\" data-toggle=\"tooltip\" title=\"" + releaseNotesSSEExternalLinkDescription + "\" target=\"_blank\" rel=\"noopener noreferrer\" href=\"" + releaseNotesSSEExternalLinkUrl + "\">Release Notes</a>"
                let sseBuild = window.localStorage["sse-build"]
                let sseUpdateVersion = window.localStorage["sse-update.version"]
                let sseUpdateLink = window.localStorage["sse-update.homepage"]

                let researchVersion = window.localStorage["sse-Splunk_Research_Version-version"]
                let sseVersion = window.localStorage["sse-showcaseinfo-version"]
                let releaseNotesExternalLinkUrl = "https://github.com/splunk/security-content/releases/tag/v" + researchVersion
                let releaseNotesExternalLinkDescription = "Open Release Notes on Github"
                let releaseNotesExternalLink = "<a class=\"external drilldown-link\" data-toggle=\"tooltip\" title=\"" + releaseNotesExternalLinkDescription + "\" target=\"_blank\" rel=\"noopener noreferrer\" href=\"" + releaseNotesExternalLinkUrl + "\">Release Notes</a>"
                let mitreAttackVersion = window.localStorage["sse-mitreattack-version"]
                $("#update_sse").html(
                    $(`<h4>App</h4>`)
                )
                if (localStorage["sse-has-update"] == "true") {
                    let downloadSSEExternalLink = "<a class=\"external drilldown-link\" data-toggle=\"tooltip\" title=\"Splunk Security Essentials on Splunkbase\" target=\"_blank\" rel=\"noopener noreferrer\" href=\"" + sseUpdateLink + "\">" + sseUpdateVersion + "</a>"
                    let releaseNotesSSEUpdateExternalLinkUrl = window.makeHelpLinkURL("Splunk_Security_Essentials", "systemConfig.sse.latest.releaseNotes2", "latest")
                    let releaseNotesSSEUpdateExternalLink = "<a class=\"external drilldown-link\" data-toggle=\"tooltip\" title=\"" + releaseNotesSSEExternalLinkDescription + "\" target=\"_blank\" rel=\"noopener noreferrer\" href=\"" + releaseNotesSSEUpdateExternalLinkUrl + "\">Release Notes</a>"
                    $("#update_sse").append(
                        $(`<p>There's a new version of Splunk Security Essentials available - ${downloadSSEExternalLink}
                        <br />${releaseNotesSSEUpdateExternalLink}</p>`)
                    )
                }
                $("#update_sse").append(
                    $(`<p>Current version: ${sseAppVersion} 
                    <br />Current build: ${sseBuild}
                    <br />${releaseNotesSSEExternalLink}</p>`)
                )

                $("#update_sse").append(
                    $(`<h4>Security Content</h4>`)
                )
                $("#update_sse").append(
                    $(
                        `<p>Current downloaded security content version: ${researchVersion} <br />Current ShowcaseInfo version: ${sseVersion} <br />Current Mitre ATT&CK version: ${mitreAttackVersion} <br/>${releaseNotesExternalLink}</p>`
                    )
                )

                $("#update_sse").append(
                    $(`<p>Trigger an update of the Security Research Content</p>
                        <button class=\"btn\">Force Update</button><div class=\"forceupdatestatus\"></div>`).click(function () {
                        $(".forceupdatestatus").addClass("button-spinner spinner-border")
                        forceUpdateEssentials();
                    })
                )
            })

            $("#scheduled_searches").on("opened", function () {
                $("#scheduled_searches").html("Processing...")
                let relevantSearches = {
                    "Generate Data Availability ML Model for Latency": {
                        "description": "Generates the nightly baseline for the Data Availability model. Only required if you have configured the Data Inventory.",
                        "desiredCron": "49 2 * * *"
                    }
                }
                $.ajax({
                    url: $C['SPLUNKD_PATH'] + '/servicesNS/-/Splunk_Security_Essentials/saved/searches?output_mode=json&count=0',
                    type: 'GET',
                    async: true,
                    success: function (savedSearchObj) {
                        let table = $('<table class="table"><thead><tr><th>Search Name</th><th>Status</th><th>Description</th></tr></thead><tbody></tbody></table>')

                        for (let i = 0; i < savedSearchObj.entry.length; i++) {
                            if (relevantSearches[savedSearchObj.entry[i].name]) {

                                let row = $("<tr>").append($("<td>").text(savedSearchObj.entry[i].name))
                                if (savedSearchObj.entry[i].content['disabled'] == false && savedSearchObj.entry[i].content.cron_schedule.length >= 9) {
                                    row.append($("<td>").text("Enabled"))
                                } else {
                                    row.append($("<td>").html("<p>Not Enabled</p>").append($('<button class="btn">Enable</button>').attr("data-desired-cron", relevantSearches[savedSearchObj.entry[i].name].desiredCron).attr("data-search-name", savedSearchObj.entry[i].name).click(function (evt) {
                                        let searchName = $(evt.target).attr("data-search-name");
                                        let desiredCron = $(evt.target).attr("data-desired-cron");
                                        let statusTD = $(evt.target).closest("td")
                                        var appscope = {}
                                        appscope['owner'] = 'nobody'
                                        appscope['app'] = splunkjs.mvc.Components.getInstance("env").toJSON()['app'];
                                        appscope['sharing'] = "app";
                                        var mystanza = {}
                                        mystanza["disabled"] = "0";
                                        mystanza["cron_schedule"] = desiredCron;
                                        var svc = splunkjs.mvc.createService();
                                        var files = svc.configurations(appscope);
                                        var fileDeferred = $.Deferred();
                                        files.fetch({ 'search': 'name=savedsearches"' }, function (err, files) {
                                            var macrosFile = files.item("savedsearches");
                                            window.macrosFile = macrosFile;
                                            fileDeferred.resolve(macrosFile)

                                        });
                                        fileDeferred.done(function (macrosFile) {
                                            macrosFile.post(searchName, mystanza, function (err, stanza) {
                                                if (err) {
                                                    // console.log("Error Updating Search", err)
                                                    statusTD.html("Error Updating")
                                                    triggerError(err)
                                                } else {
                                                    // console.log("Updated")
                                                    statusTD.html("Enabled")
                                                }
                                            })
                                        });

                                        // console.log("Enabling!", searchName, desiredCron)
                                    })))
                                }
                                row.append($("<td>").text(relevantSearches[savedSearchObj.entry[i].name].description))
                                // console.log("got it", savedSearchObj.entry[i])
                                table.find("tbody").append(row)
                            }
                        }
                        $("#scheduled_searches").html(table)
                    },
                    error: function () {
                        $("#scheduled_searches").html("Error checking search status. You can manually check the following search names:")
                        let mylist = $("<ul>")
                        for (let searchName in relevantSearches) {
                            mylist.append($("<li>").text(searchName + " - " + relevantSearches[searchName].description))
                        }
                        $("#scheduled_searches").append(mylist);
                    }
                })


            })
            $("#content_mapped").on("opened", function () {
                $("#content_mapped").html("Processing...")
                let searchAnalysisDeferral = $.Deferred()
                CheckIfSearchesAreMapped(searchAnalysisDeferral)

                $.when(searchAnalysisDeferral).then(function (returnObj) {

                    // TO PULL INTO PAGE GUIDE

                    let statusDiv = $("<div>")

                    let mappedStatus = $("<div>").append("<h4>" + _("Saved Search Mappings").t() + "</h4>");
                    mappedStatus.append($('<p style="color: gray">').text(_("The Bookmarked Content page allows you to pull a list of your local saved searches, and map those to either out-of-the-box content in Splunk Security Essentials, or to custom content you create. Walking through this configuration is not required, but it makes easier for you to configure all of your active content.").t()))
                    if (returnObj["num_mapped_saved_searches"] + returnObj["num_nondetection_searches"] == 0) {
                        mappedStatus.append("<p>" + _("Not Started").t() + "</p>")
                    } else if (returnObj["num_mapped_saved_searches"] + returnObj["num_nondetection_searches"] == 1 && returnObj["num_mapped_saved_searches"] + returnObj["num_nondetection_searches"] < returnObj["num_saved_searches"]) {
                        mappedStatus.append("<p>" + Splunk.util.sprintf(_("%s saved search has been mapped (or marked as \"Not a Detection\"), out of %s total.").t(), returnObj["num_mapped_saved_searches"] + returnObj["num_nondetection_searches"], returnObj["num_saved_searches"]) + "</p>")
                    } else if (returnObj["num_mapped_saved_searches"] + returnObj["num_nondetection_searches"] > 1 && returnObj["num_mapped_saved_searches"] + returnObj["num_nondetection_searches"] < returnObj["num_saved_searches"]) {
                        mappedStatus.append("<p>" + Splunk.util.sprintf(_("%s saved searches have been mapped (or marked as \"Not a Detection\"), out of %s total.").t(), returnObj["num_mapped_saved_searches"] + returnObj["num_nondetection_searches"], returnObj["num_saved_searches"]) + "</p>")
                    } else {
                        mappedStatus.append("<p>" + Splunk.util.sprintf(_("Complete! All %s saved searches have been mapped.").t(), returnObj["num_saved_searches"]) + "</p>")
                    }
                    statusDiv.append(mappedStatus)

                    let bookmarkStatus = $("<div>").append("<h4>" + _("Bookmarks").t() + "</h4>");
                    bookmarkStatus.append($('<p style="color: gray">').text(_("Ultimately what drives the analytics advisor dashboards (which provides you the MITRE ATT&CK Matrix for your content, and the overall guide to what content is available for your data sources) and the ES integrations (pushing MITRE and Kill Chain details into the ES Incident Review dashboard, and the Risk dashboard) in Splunk Security Essentials is the concept of bookmarking. You can bookmark content that you want to remember, or you can define a status such as Active, or Needs Tuning.").t()))
                    if (returnObj["num_bookmarked_content"] == 0) {
                        bookmarkStatus.append("<p>" + _("Not Started").t() + "</p>")
                    } else if (returnObj["num_bookmarked_content"] == 1 && returnObj["num_enabled_content"] == 0) {
                        bookmarkStatus.append("<p>" + Splunk.util.sprintf(_("%s piece of content is bookmarked, but none have been marked as active").t(), returnObj["num_bookmarked_content"]) + "</p>")
                    } else if (returnObj["num_bookmarked_content"] > 1 && returnObj["num_enabled_content"] == 0) {
                        bookmarkStatus.append("<p>" + Splunk.util.sprintf(_("%s pieces of content are bookmarked, but none have been marked as active").t(), returnObj["num_bookmarked_content"]) + "</p>")
                    } else if (returnObj["num_bookmarked_content"] > 0 && returnObj["num_enabled_content"] < 20) {
                        bookmarkStatus.append("<p>" + Splunk.util.sprintf(_("%s pieces of content are bookmarked, and %s of those have been marked as active. This looks good, though %s is fewer searches than most organizations have. Consider marking all of your active content, or use Splunk Security Essentials to find and turn on more content.").t(), returnObj["num_bookmarked_content"], returnObj["num_enabled_content"], returnObj["num_enabled_content"]) + "</p>")
                    } else {
                        bookmarkStatus.append("<p>" + Splunk.util.sprintf(_("%s pieces of content have been bookmarked, and %s of those have been marked as active. This looks good!").t(), returnObj["num_bookmarked_content"], returnObj["num_enabled_content"]) + "</p>")
                    }
                    statusDiv.append(bookmarkStatus)
                    $("#content_mapped").html(statusDiv)


                    // console.log("Complete", "num_saved_searches", num_saved_searches, "num_mapped_saved_searches", num_mapped_saved_searches, "num_nondetection_searches", num_nondetection_searches, "num_enabled_content", num_enabled_content, "num_bookmarked_content", num_bookmarked_content, "num_custom_content", num_custom_content)
                })

            })

            $("#data_inventoried").on("opened", function () {
                $("#data_inventoried").html("Processing...")
                let dataInventoryAnalysis = $.Deferred()
                CheckIfDataInventoryComplete(dataInventoryAnalysis)
                // TO PULL INTO PAGE GUIDE
                $.when(dataInventoryAnalysis).then(function (returnObj) {
                    let statusDiv = $("<div>")

                    let eventtypeStatus = $("<div>").append("<h4>" + _("Data Source Category Configuration").t() + "</h4>");
                    eventtypeStatus.append($('<p style="color: gray">').text(_("Data Source Categories use standardized searches to find data configured with the tags that are used in Splunk's Common Information Model.").t()))
                    if (returnObj["dsc_checked"] == 0) {
                        eventtypeStatus.append("<p>" + _("Not Started").t() + "</p>")
                    } else if (returnObj["dsc_checked"] == returnObj["dsc_count"] && returnObj["dsc_count"] < 15) {
                        eventtypeStatus.append("<p>" + _("Configuration invalid. Please open the status indicator on the data inventory page and click Reset Configurations.").t() + "</p>")
                    } else if (returnObj["dsc_checked"] == returnObj["dsc_count"]) {
                        eventtypeStatus.append("<p>" + _("Complete!").t() + "</p>")
                    } else {
                        eventtypeStatus.append("<p>" + Splunk.util.sprintf(_("%s categories analyzed, out of %s total.").t(), returnObj["dsc_checked"], returnObj["dsc_count"]) + "</p>")
                    }
                    statusDiv.append(eventtypeStatus)

                    let productStatus = $("<div>").append("<h4>" + _("Product Configuration").t() + "</h4>");
                    productStatus.append($('<p style="color: gray">').text(_("Whether found by looking at the result of the Data Source Category searches, by a set of standardized Splunk source / sourcetype-based searches, or you have manually configured it, the result of configuring your data inventory is a list of products, each of which maps to one or more data source categories.").t()))

                    if (returnObj["dscs_with_products"] == 0) {
                        productStatus.append("<p>" + _("Not Started").t() + "</p>")
                    } else if (returnObj["products_default_checked"] == returnObj["products_default_total"]) {
                        if (returnObj["products_custom_total"] == 0) {
                            productStatus.append("<p>" + _("All default products are analyzed, though no custom products have been added.").t() + "</p>")
                        } else if (returnObj["products_custom_needsReview"] > 0) {
                            productStatus.append("<p>" + _("All default products are analyzed, but there are products in \"Needs Review\" status.").t() + "</p>")
                        } else {
                            productStatus.append("<p>" + _("Complete! All default products are analyzed, and custom products are added!").t() + "</p>")
                        }
                    } else if (returnObj["products_custom_total"] > 0) {
                        productStatus.append("<p>" + Splunk.util.sprintf(_("Only found %s analyzed out of %s default products in total, but did find %s custom products are added!").t(), returnObj["products_default_checked"], returnObj["products_default_total"], returnObj["products_custom_total"]) + "</p>")
                    } else {
                        productStatus.append("<p>" + Splunk.util.sprintf(_("%s analyzed, out of %s default products in total.").t(), returnObj["products_default_checked"], returnObj["products_default_total"]) + "</p>")
                    }

                    statusDiv.append(productStatus)
                    $("#data_inventoried").html(statusDiv)

                })
            })


            $("#suggested_apps").on("opened", function () {
                let appAnalysis = $.Deferred()
                CheckWhatAppsArePresent(appAnalysis)
                $.when(appAnalysis).then(function (apps) {
                    for (let app in apps) {
                        if (apps[app].status == "installed") {
                            $("#" + app).text("Installed (" + apps[app].version + ")")
                        } else {
                            $("#" + app).text("Not Installed")
                        }
                    }

                })

            })






            // Demo Setup
            $("#demo_setup").append($("<p>" + _("This app contains a set of demo configurations for data inventory, bookmarked, and custom content, that we can load up if you'd like.").t() + "</p>"), $('<div id="demo_setup_contents">' + _('Checking required permissions...').t() + '</div>'))
            $("#demo_setup").on("opened", function () {
                $.ajax({
                    url: $C['SPLUNKD_PATH'] + '/services/authentication/current-context?output_mode=json&count=0',
                    type: 'GET',
                    async: true,
                    success: function (returneddata) {
                        // console.log("got the current auth context", returneddata)
                        window.dveuve = returneddata
                        if (returneddata.entry[0].content.capabilities.indexOf("admin_all_objects") >= 0) {
                            $("#demo_setup_contents").html($("<div>").append($('<label for="demofile">Demo File (leave blank for normal)</label>'), $('<input id="demofile">'),
                                $("<br/>"), $("<br/>"), $("<button class=\"button btn-primary\">Load Demo Data</button>").click(function () {
                                    window.demo_data_file = $("#demofile").val()

                                    let myModal = new Modal('confirmDemo', {
                                        title: _('Confirm Apply Demo').t(),
                                        destroyOnHide: true
                                    }, $);
                                    $(myModal.$el).on("hide", function () {
                                        // Not taking any action on hide, but you can if you want to!
                                    })

                                    let body = $("<div>")
                                    body.append("<p>" + _("Loading the Demo Configuration will erase all configurations on this system. Are you sure you want to continue? We will automatically create a snapshot of configuration first.").t() + "</p>")

                                    myModal.body.html(body)

                                    myModal.footer.append($('<button>').attr({
                                        type: 'button',
                                    }).addClass('btn ').text(_('Cancel').t()).on('click', function () {

                                    }), $('<button>').attr({
                                        type: 'button',
                                    }).addClass('btn btn-primary').text(_('Load Demo Config').t()).on('click', function () {
                                        $("#demo_setup_contents").html("<p>Processing...</p>")
                                        require([
                                            "jquery",
                                            "underscore",
                                            Splunk.util.make_full_url("/static/app/Splunk_Security_Essentials/components/controls/ManageSnapshots.js") + "?bust=32342"
                                        ],
                                            function (
                                                $,
                                                _
                                            ) {
                                                createBookmarkOfCurrentContent("Snapshot Prior to Loading Demo")
                                                setTimeout(function () {
                                                    setUpDemoConfig(window.demo_data_file)
                                                }, 1000)
                                            })
                                        $('[data-bs-dismiss=modal').click()
                                    }))
                                    myModal.show()


                                }), $("<br/>"), $("<br/>"), $("<p>").text("Importing demo data will take approximately 20 seconds, and then your browser will immediately refresh.")))
                        }
                    },
                    error: function (xhr, textStatus, error) {
                        triggerError("Got an error pulling your permissions structure. This shouldn't happen...")
                    }
                })

            })


            $("#es_integration").on("opened", function () {
                // console.log("You just opened ES Integration")
                $("#es_integration").html('<div id="es_integration_status">' + _('Checking Status...').t() + '</div>')
                let status = $.Deferred();
                checkForMITREInLogReview(status)
                $.when(status).then(function (shouldUpdate, stanza) {
                    if (shouldUpdate == "needed") {
                        $("#es_integration").attr("data-stanza", JSON.stringify(stanza)).html('<div id="es_integration_status">' + _("ES Not Configured").t() + '</div>').append(
                            $("<button>" + _("Update ES").t() + "</button>").click(function () {
                                $(".checkESstatus").addClass("button-spinner spinner-border")
                                let stanza = JSON.parse($("#es_integration").attr("data-stanza"));
                                // console.log("Going for update with stanza", stanza)
                                let updateDeferral = $.Deferred()
                                addMITREToLogReview(stanza, updateDeferral)
                                $.when(updateDeferral).then(function (status) {
                                    if (status == "success") {
                                        $(".checkESstatus").removeClass("button-spinner spinner-border")
                                        $("#es_integration").html('<div id="es_integration_status">Configuration set (it may take up to a minute to take effect). Once you have mapped your content in Bookmarked Content, you will see any Kill Chain or MITRE ATT&CK mappings in ES Incident Review.</div>')
                                        let appImportDeferral = $.Deferred()
                                        HandleAppImportUpdate(appImportDeferral);
                                        $.when(appImportDeferral).then(function (success) {
                                            if (!success) {
                                                $("#es_integration").html('<div id="es_integration_status">Error configuring (or checking the configuration). You must have admin rights on Splunk in order to complete this operation -- if you have admin rights and still see this error, please reach out for support on Splunk Answers.</div>')
                                            }
                                        })
                                    } else {
                                        $(".checkESstatus").removeClass("button-spinner spinner-border")
                                        $("#es_integration").html(_('<div id="es_integration_status">Error applying the change. We recommend updating the fields directly though ES (<a href="">link</a>). If you are using ES prior to 5.3, you will also need to add Splunk Security Essentials to the app imports (<a href="' + window.makeHelpLinkURL("Splunk_Security_Essentials", "systemConfig.es.install.importCustomApps", "latest") + '">docs</a>, <a href="/manager/SplunkEnterpriseSecuritySuite/data/inputs/app_imports_update">link).</div>').t())
                                    }
                                })
                            })
                        ).append("<div class=\"checkESstatus\"></div>")
                    } else if (shouldUpdate == "errored") {
                        $("#es_integration").html(_('<div id="es_integration_status">Error checking log_review.conf settings. This does not appear to be an ES environment.</div>').t())
                    } else if (shouldUpdate == "notneeded") {
                        $("#es_integration").html(_('<div id="es_integration_status">Already Configured! If you are running into issues, please ask for support on Splunk Answers.</div>').t())
                    }
                    $("#es_integration_status").append(`<div style="text-align: justify">
                    <h3><a class="external drilldown-link" data-toggle="tooltip" target="_blank" href="https://docs.splunk.com/Documentation/SSE/3.6.0/User/CustomizeSSE"">How do I use Splunk Enterprise Security (ES) with Splunk Security Essentials?</a></h3><p>If you have Splunk Enterprise Security (ES) in your environment, Click <strong>Update ES</strong> to have Splunk Security Essentials push MITRE ATT&CK and Cyber Kill Chain attributions to the ES Incident Review dashboard, along with raw searches of <samp>index=risk</samp> or <samp>index=notable</samp>.</p></div>`)
                })
            })
            $("#systemConfig").css("display", "none");
            $(".modal-backdrop:not([id])").attr("id", "systemConfigBackdrop").css("display", "none");
        })
        let navItems = {
            "enabledApps": {
                "name": "Enabled Apps / Channels",
                "content": "<div id=\"content_sources\"></div>"
            },
            "requiredApps": {
                "name": "Suggested Apps",
                "content": "<div id=\"suggested_apps\"></div>"
            },
            "esIntegration": {
                "name": "ES Integration",
                "content": "<div id=\"es_integration\"></div>"
            },
            "contentMapped": {
                "name": "Content Mapping",
                "content": "<div id=\"content_mapped\"></div>"
            },
            "dataInventoried": {
                "name": "Data Inventory",
                "content": "<div id=\"data_inventoried\"></div>"
            },
            "enabledSearch": {
                "name": "Scheduled Searches",
                "content": "<div id=\"scheduled_searches\"></div>"
            },
            "updateSSE": {
                "name": "Update Content",
                "content": "<div id=\"update_sse\"></div>"
            }
        }

        for (let i = 0; i < appConfig.length; i++) {
            if (appConfig[i].param == "demoMode" && appConfig[i].value == "true") {
                navItems["demoConfig"] = {
                    "name": "Demo Environment Setup",
                    "content": "<div id=\"demo_setup\"></div>"
                }
            }
        }

        ////// START
        let output = $("<div class=\"main_output\"></div>")
        let sysconfignav = $('<div class="system_config_nav"></div>')
        let mainBlock = $('<div class="sysconfig_main"  style="width: 100%">').html('<div class="sysconfig_header"></div>').append('<div class="sysconfig_body"><h3>' + _("Configuration").t() + '</h3>' + _('Welcome to the Splunk Security Essentials Configuration menu. Find configuration options in the menu to the left.').t() + '</div>')
        for (let item in navItems) {
            $(".sysconfig_header").remove()
            let navitem = $('<div class="sysconfig_item" status="">').attr("data-item", item).click(function (evt) {
                let item = $(evt.target).closest("div.sysconfig_item").attr("data-item")
                // console.log("Trying to show", item, evt.target)
                $(".sysconfig_item_active").removeClass("sysconfig_item_active")
                $("div.sysconfig_item[data-item=" + item + "]").addClass("sysconfig_item_active")
                $("div.sysconfig_body").hide()
                $("div.sysconfig_body[data-item=" + item + "]").show()
                $("div.sysconfig_body[data-item=" + item + "]").children(":last").trigger("opened")
            })
            //let statusText = $('<div style="position: relative;">').html(buildStatusIcon(eventtype.status))
            navitem.append($('<div class="sysconfig_status">').append(/*statusText*/))
            navitem.append($("<h3>").text(navItems[item]['name']))
            sysconfignav.append(navitem)

            let main_container = $('<div class="sysconfig_body" style="display: none;">').attr("data-item", item)

            let header = $('<div class="sysconfig_header">')
            header.append($("<h3>").text(navItems[item]['name']))
            main_container.html(header)
            main_container.append(navItems[item]['content'])
            mainBlock.append(main_container)
        }

        output.append(sysconfignav, mainBlock)

        ////// COMPLETE
        myModal.body.html(output).css("min-height", "300px")

        myModal.footer.append($('<button>').attr({
            type: 'button',
        }).addClass('btn ').text('Close').on('click', function () {
            $("#systemConfig").css("display", "none");
            $("#systemConfigBackdrop").css("display", "none");
            $('[data-bs-dismiss=modal').click()
        }))
        myModal.show(); // Launch it!

        if (location.hash.indexOf("launchSystemConfig") >= 0) {
            location.hash = ""
            $("#systemConfig").css("display", "block");
            $("#systemConfigBackdrop").css("display", "block");
        }

        function triggerUpdateAvailable(elementUpdated) {
            // $("#sysConfigButton").tooltip('destroy')
            let elements = elementUpdated;

            try {
                if ($("#launchConfigurationLink").attr("data-status") == "elementUpdated") {
                    let current = $("#launchConfigurationLink").attr("data-original-title").replace("Update Available For: ", "").split(", ")
                    current.push(elementUpdated)
                    elements = current.join(", ")
                }
            } catch (error) {

            }


            if ($("#launchConfigurationLink div.updatestatusicon").length > 0 && (elementUpdated.search("Splunk Security Content - Stories") > -1)) {
                //This code is now trigger then UpdateShowcaseinfo has fired successfully
                // $("#launchConfigurationLink .updatestatusicon").attr("class","updatestatusicon icon-rotate")
                // $("#launchConfigurationLink").attr("data-placement", "bottom").css("background-color", "#00950E").css("color", "white").attr("data-status", "elementUpdated").attr("data-original-title", "Update Available For: " + elements).tooltip().unbind("click").click(function(){
                //     location.reload()
                // })
            } else if ($("#launchConfigurationLink div.updatestatusicon").length == 0 && (elementUpdated.search("Splunk Security Content") > -1)) {
                //When we update the Splunk Research Content we have an animated slider to get people to wait a bit longer.
                $("#launchConfigurationLink").append('<div class="updatestatusicon spinner-border">')
                $("#launchConfigurationLink").attr("data-placement", "bottom").attr("data-status", "elementUpdated").attr("title", "Updating " + elements).tooltip().unbind("click")
            } else if ($("#launchConfigurationLink div.updatestatusicon").length == 0) {
                $("#launchConfigurationLink").append('<div class="updatestatusicon icon-rotate">')
                $("#launchConfigurationLink").attr("data-placement", "bottom").css("background-color", "#00950E").css("color", "white").attr("data-status", "elementUpdated").attr("title", "Update Available For: " + elements).tooltip().unbind("click").click(function () {
                    location.reload()
                })
            }
        }
        $.ajax({
            url: Splunk.util.make_full_url('/splunkd/__raw/servicesNS/nobody/' + splunkjs.mvc.Components.getInstance("env").toJSON()['app'] + '/properties/essentials_updates?output_mode=json'),
            async: true,
            success: function (returneddataMain) {
                let deferralStack = []
                let contentUpdateQueue = {}
                let contentUpdateRequestsQueue = {}

                //console.log("Here's my overall...", returneddata)
                for (let i = 0; i < returneddataMain.entry.length; i++) {
                    let name = returneddataMain.entry[i].name
                    let localDeferral = $.Deferred()
                    deferralStack.push(localDeferral)
                    $.ajax({
                        url: Splunk.util.make_full_url('/splunkd/__raw/servicesNS/nobody/' + splunkjs.mvc.Components.getInstance("env").toJSON()['app'] + '/configs/conf-essentials_updates/' + name + '?output_mode=json'),
                        //url: '/splunkd/__raw/servicesNS/nobody/' + splunkjs.mvc.Components.getInstance("env").toJSON()['app'] + '/properties/essentials_updates/' + name + '/value?output_mode=json',
                        async: true,
                        success: function (returneddata) {
                            let content = returneddata.entry[0].content;

                            let obj = $("<div class=\"configObject\"></div>")
                            let checkedtext = " checked"
                            //console.log("Evaluating", content)
                            //We run this for external content with no build URL
                            if (content.order && (content.order == "-1" || content.order == -1)) {
                                // console.log("got a mitre update", content)
                                setTimeout(function () {

                                    require([
                                        'json!' + $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/external_content/?query={"_key": "' + content.channel + '"}'
                                    ], function (external_content) {

                                        //console.log("Here's my notes..", external_content[i]['last_checked'], Date.now()/1000 - parseInt(external_content[i]['last_checked']), parseInt(external_content[i]['last_checked']), content, external_content[i])

                                        //Save down the current mitre version in localStorage
                                        if (typeof external_content != "undefined" && typeof external_content[0] != "undefined" && typeof external_content[0]["channel"] != "undefined" && typeof external_content[0]["build"] != "undefined") {
                                            localStorage[localStoragePreface + "-" + external_content[0]["channel"] + "-version"] = external_content[0]["build"]
                                        }

                                        if (external_content.length > 0 && external_content[0]['last_checked'] && Date.now() / 1000 - parseInt(external_content[0]['last_checked']) < 3600 * 24) {
                                            // console.log("We recently checked, skipping this time.", content);

                                            return;
                                        }
                                        // console.log("Making call to ", content.content_download_url);
                                        $.ajax({
                                            url: content.content_download_url,
                                            type: 'GET',
                                            async: true,
                                            success: function (newdata) {
                                                // console.log("Checking", content.channel, content);
                                                let new_build_id = newdata.length;
                                                newdata = JSON.parse(newdata);
                                                // console.log("Got data", newdata)
                                                window.dvtest = newdata
                                                let found = false
                                                // console.log("Got an external_content_library", external_content)
                                                for (let i = 0; i < external_content.length; i++) {
                                                    // console.log("Looking for a match", external_content[i].channel , content.channel , external_content[i].build , new_build_id)
                                                    if (external_content[i].channel == content.channel && external_content[i].build != new_build_id) {

                                                        found = true
                                                        let build_object = external_content[i];
                                                        //console.log("Found the build object for", content.channel, build_object, "updating build to", new_build_id);
                                                        build_object['build'] = new_build_id;
                                                        build_object['last_checked'] = Date.now() / 1000;
                                                        build_object['last_updated'] = Date.now() / 1000;
                                                        let build_id_update = $.Deferred();
                                                        let content_update = $.Deferred();
                                                        let jsonstorage = {
                                                            "_key": content.channel,
                                                            "_time": Date.now() / 1000,
                                                            "version": new_build_id,
                                                            "description": content.description,
                                                            "json": JSON.stringify(newdata),
                                                            "compression": content.channel == "mitreattack",
                                                            "config": content.channel
                                                        }
                                                        $.ajax({
                                                            url: $C['SPLUNKD_PATH'] + '/services/downloadContentUpdate?config=' + content.channel,
                                                            async: true,
                                                            type: 'GET',
                                                            headers: {
                                                                'X-Requested-With': 'XMLHttpRequest',
                                                                'X-Splunk-Form-Key': window.getFormKey(),
                                                            },
                                                            success: function (pushJsonData) {
                                                                bustCache();
                                                                content_update.resolve();
                                                            },
                                                            error: function (xhr, textStatus, error) {
                                                                // console.log("Adding data of mitre attack failed",xhr, textStatus, error)
                                                            }
                                                        });

                                                        $.ajax({
                                                            url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/external_content/' + build_object['_key'],
                                                            type: 'POST',
                                                            headers: {
                                                                'X-Requested-With': 'XMLHttpRequest',
                                                                'X-Splunk-Form-Key': window.getFormKey(),
                                                            },
                                                            contentType: "application/json",
                                                            async: true,
                                                            data: JSON.stringify(build_object),
                                                            success: function (returneddata) {
                                                                bustCache();
                                                                build_id_update.resolve()

                                                            }, error: function (returneddata) {
                                                                // If the channel is missing in the external kvstore we would get 404. Happens during incomplete download. Try with posting new key instead.
                                                                $.ajax({
                                                                    url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/external_content',
                                                                    type: 'POST',
                                                                    headers: {
                                                                        'X-Requested-With': 'XMLHttpRequest',
                                                                        'X-Splunk-Form-Key': window.getFormKey(),
                                                                    },
                                                                    contentType: "application/json",
                                                                    async: true,
                                                                    data: JSON.stringify(build_object),
                                                                    success: function (returneddata) {
                                                                        bustCache();
                                                                        build_id_update.resolve()

                                                                    }
                                                                })
                                                            }
                                                        })
                                                        $.when(build_id_update, content_update).then(function () {
                                                            updateMitreMatrixList(build_object['build']);
                                                            triggerUpdateAvailable(content.name);
                                                        })
                                                        // post update
                                                    } else if (external_content[i].channel == content.channel && external_content[i].build == new_build_id) {
                                                        found = true;
                                                        // console.log("Found the same build id for", content.channel)
                                                        let build_object = external_content[i];
                                                        build_object['last_checked'] = Date.now() / 1000;
                                                        $.ajax({
                                                            url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/external_content/' + build_object['_key'],
                                                            type: 'POST',
                                                            headers: {
                                                                'X-Requested-With': 'XMLHttpRequest',
                                                                'X-Splunk-Form-Key': window.getFormKey(),
                                                            },
                                                            contentType: "application/json",
                                                            async: true,
                                                            data: JSON.stringify(build_object),
                                                            success: function (returneddata) {

                                                            }
                                                        })
                                                    }
                                                }
                                                if (!found) {
                                                    // console.log('Going in not found state');

                                                    let build_object = {
                                                        "_key": content.channel,
                                                        "first_checked": Date.now() / 1000,
                                                        "last_checked": Date.now() / 1000,
                                                        "last_updated": Date.now() / 1000,
                                                        "channel": content.channel,
                                                        "build": new_build_id
                                                    }

                                                    let build_id_update = $.Deferred();
                                                    let content_update = $.Deferred();
                                                    let jsonstorage = {
                                                        "_key": content.channel,
                                                        "_time": Date.now() / 1000,
                                                        "version": new_build_id,
                                                        "description": content.description,
                                                        "json": JSON.stringify(newdata),
                                                        "compression": content.channel == "mitreattack",
                                                        "config": content.channel,
                                                    }

                                                    $.ajax({
                                                        url: $C['SPLUNKD_PATH'] + '/services/downloadContentUpdate?config=' + content.channel,
                                                        async: true,
                                                        type: 'GET',
                                                        headers: {
                                                            'X-Requested-With': 'XMLHttpRequest',
                                                            'X-Splunk-Form-Key': window.getFormKey(),
                                                        },
                                                        success: function (pushJsonData) {
                                                            // console.log('Completed', pushJsonData)
                                                        },
                                                        error: function (xhr, textStatus, error) {
                                                            // console.log("Adding data of mitre attack failed",xhr, textStatus, error)
                                                        }
                                                    });

                                                    $.ajax({
                                                        url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/external_content',
                                                        type: 'POST',
                                                        headers: {
                                                            'X-Requested-With': 'XMLHttpRequest',
                                                            'X-Splunk-Form-Key': window.getFormKey(),
                                                        },
                                                        contentType: "application/json",
                                                        async: true,
                                                        data: JSON.stringify(build_object),
                                                        success: function (returneddata) {
                                                            bustCache();
                                                            build_id_update.resolve()
                                                        },
                                                        error: function (returneddata) {
                                                            console.log('Getting error for external_content', returneddata);

                                                            // If the channel is already existing in the external kvstore we would get 409. Happens during incomplete download. Try with updating key instead.
                                                            $.ajax({
                                                                url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/external_content/' + content.channel,
                                                                type: 'POST',
                                                                headers: {
                                                                    'X-Requested-With': 'XMLHttpRequest',
                                                                    'X-Splunk-Form-Key': window.getFormKey(),
                                                                },
                                                                contentType: "application/json",
                                                                async: true,
                                                                data: JSON.stringify(build_object),
                                                                success: function (returneddata) {
                                                                    bustCache();
                                                                    build_id_update.resolve()
                                                                },
                                                                error: function (returneddata) {
                                                                    bustCache();
                                                                    build_id_update.resolve()
                                                                }
                                                            })
                                                        }
                                                    })
                                                    $.when(build_id_update, content_update).then(function () {
                                                        updateMitreMatrixList(build_object['build']);
                                                        triggerUpdateAvailable(content.name);
                                                    })
                                                    //console.log("Found no build object -- initializing one for", content.channel, build_object)
                                                }
                                            },
                                            error: function (xhr, textStatus, error) {
                                                // console.log("Error Updating!", xhr, textStatus, error)
                                            }
                                        })
                                    })
                                }, 8000)
                            }
                            //console.log("APPUPDATE: Looking at app", content.channel, content, content.content_download_url,content.type)
                            if ((content.type == "app" || content.type == "splunkresearch" || content.type == "mitre") && content.content_download_url && content.content_download_url != "" && !content.disabled) {
                                //console.log("APPUPDATE: Working on updating!", content.channel, content, content.content_download_url)
                                if (content.build_url && content.build_url.indexOf("SPLUNKD") == 0) {
                                    content.build_url = Splunk.util.make_full_url(content.build_url.replace("SPLUNKD", ""))
                                }
                                if (content.content_download_url && content.content_download_url.indexOf("SPLUNKD") == 0) {
                                    content.content_download_url = Splunk.util.make_full_url(content.content_download_url.replace("SPLUNKD", ""))
                                    //console.log("Got a replacement content_download_url", content.content_download_url)
                                }
                                let runUpdate = $.Deferred()
                                //console.log("Checking for updates..", content, external_content)
                                let shouldUpdate = true;
                                let lastBuild = ""
                                let buildObj = {}
                                let newBuild = ""
                                for (let i = 0; i < external_content.length; i++) {
                                    if (external_content[i].channel == content.channel) {
                                        //console.log("Last Checked",external_content[i].channel , external_content[i]['last_checked'], Date.now()/1000 - parseInt(external_content[i]['last_checked']), 60*60*24)
                                        //console.log("Last Checked (seconds): ",Date.now()/1000 - parseInt(external_content[i]['last_checked']), "Limit is: ",60*60*24)
                                        //if(! external_content[i].last_updated || external_content[i].last_updated == "" || external_content[i].last_updated < (new Date).getTime()/1000 - 24*3600){
                                        localStorage[localStoragePreface + "-" + external_content[i]["channel"] + "-version"] = external_content[i]["build"].replace("v", "")
                                        if (!external_content[i].last_updated || external_content[i].last_updated == "" || (Date.now() / 1000 - parseInt(external_content[i]['last_checked'])) > 60 * 60 * 24) {
                                            shouldUpdate = true;
                                            //console.log("Doing Update of ",external_content[i].channel,(Date.now()/1000 - parseInt(external_content[i]['last_checked'])), "Since last update")
                                        } else {
                                            shouldUpdate = false;
                                            //console.log("Skipping Update of",external_content[i].channel,(Date.now()/1000 - parseInt(external_content[i]['last_checked'])), "Since last update")
                                        }
                                        if (external_content[i].build) {
                                            lastBuild = external_content[i].build
                                            buildObj = external_content[i]
                                        }
                                        //Mark the ones that have a corresponding essentials_updates channel
                                        external_content[i].hasChannel = "1"
                                    }
                                }
                                // console.log("CONTENTUPDATE - lastBuild and buildObj and etc.", lastBuild, buildObj)
                                if (Object.keys(buildObj).length == 0) {
                                    buildObj = {
                                        "_key": content.channel,
                                        "first_checked": Date.now() / 1000,
                                        "last_checked": Date.now() / 1000,
                                        "last_updated": Date.now() / 1000,
                                        "channel": content.channel,
                                        "build": ""
                                    }
                                }

                                if (shouldUpdate) {
                                    //console.log("APPUPDATE: Pulling!", content.channel, content,content.build_field, content.build_url)
                                    setTimeout(function () { // Delaying 3 seconds
                                        if (content.build_url && content.build_url != "" && content.build_field && content.build_field != "") {
                                            $.ajax({
                                                url: content.build_url,
                                                type: 'GET',
                                                async: true,
                                                timeout: 5000,
                                                success: function (returneddata) {
                                                    try {
                                                        let obj = returneddata;
                                                        //console.log("APPUPDATE: Got data", returneddata)

                                                        if (typeof obj == "string") {
                                                            obj = JSON.parse(obj)
                                                        }
                                                        newBuild = getProperty(obj, content.build_field).replace(/[^\d\.!?]/g, '')
                                                        if (typeof newBuild == "undefined") {
                                                            newBuild = ""
                                                        }
                                                        //console.log("newBuild", newBuild)
                                                        if (newBuild && newBuild != "") {
                                                            if (lastBuild != newBuild) {
                                                                runUpdate.resolve()
                                                            } else {
                                                                //console.log("Build number the same , just updateding last_checked", content.channel)
                                                                let buildObjLastCheckedUpdate = {
                                                                    "_key": content.channel,
                                                                    "build": lastBuild,
                                                                    "channel": content.channel,
                                                                    "first_checked": buildObj.first_checked,
                                                                    "last_checked": Date.now() / 1000,
                                                                    "last_updated": buildObj.last_updated
                                                                }

                                                                $.ajax({
                                                                    url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/external_content/' + content.channel,
                                                                    type: 'POST',
                                                                    headers: {
                                                                        'X-Requested-With': 'XMLHttpRequest',
                                                                        'X-Splunk-Form-Key': window.getFormKey(),
                                                                    },
                                                                    contentType: "application/json",
                                                                    async: true,
                                                                    data: JSON.stringify(buildObjLastCheckedUpdate),
                                                                    success: function (returneddata) {
                                                                        bustCache();
                                                                    },
                                                                    error: function (returneddata) {

                                                                    }
                                                                })
                                                            }
                                                        } else {
                                                            runUpdate.resolve()
                                                        }
                                                    } catch (error) {
                                                        //runUpdate.resolve()
                                                        return;
                                                    }
                                                },
                                                error: function (xhr, textStatus, error) {
                                                    //console.log("Error connecting to build url",xhr, textStatus, error)
                                                    //unUpdate.resolve()
                                                    return;
                                                }
                                            })
                                        } else {
                                            runUpdate.resolve()
                                        }

                                        $.when(runUpdate).then(function () {
                                            if (content.content_download_url.indexOf("LOCALIZATIONSCHEME")) {
                                                content.content_download_url = content.content_download_url.replace("LOCALIZATIONSCHEME", $C['LOCALE'])
                                            }
                                            if (!sessionStorage.getItem("verification" + content.channel)) {
                                                const verificationKeyByPassContents = ["Splunk_Research_Detections","Splunk_Research_Stories","mitreattack"]
                                                if (verificationKeyByPassContents.includes(content.channel)) {
                                                    utilityFun("verified", content, newBuild, lastBuild, contentUpdateQueue)
                                                } else {
                                                    sessionStorage.setItem("verification" + content.channel, "pending")
                                                    let last_iteration = false;
                                                    if (i === (returneddataMain.entry.length - 1)) {
                                                        last_iteration = true
                                                    }
                                                    let verification = sessionStorage.getItem("verification" + content.channel)
                                                    utilityFun(verification, content, newBuild, lastBuild, contentUpdateQueue, last_iteration)

                                                }
                                            }
                                        })
                                    }, 4000)
                                }
                            }

                            if (content.disabled) {
                                checkedtext = ""
                                if (content.default != "disabled") {
                                    $("#launchConfigurationLink").css("background-color", "#050")
                                }

                            } else {
                                if (content.default == "disabled") {
                                    $("#launchConfigurationLink").css("background-color", "#050")
                                }
                            }
                            if (content.name)
                                obj.append('<div class="tooltipcontainer  filterItem" style="width: 100%"><label class="filterswitch">' + '<input type="checkbox" ' + /* onclick="console.log(this)"*/ ' id="FILTER_' + name + '" name="FILTER_' + name + '"' + checkedtext + '><span class="filterslider "></span></label><div class="filterLine"><b>' + content.name + '</b>' + (content.description ? (": " + content.description) : "") + '</div></div> ')

                            if (content.default) {
                                obj.find("input").attr("data-default", content.default)
                            }
                            if (content.order) {
                                obj.attr("data-order", content.order)
                                obj.attr("data-name", name)
                            } else {
                                obj.attr("data-order", "99")
                                obj.attr("data-name", name)
                            }
                            if (content.build_url && content.build_url != "" && content.build_url != null && content.content_download_url && content.content_download_url != "" && content.content_download_url != null) {
                                //obj.find("input").attr("data-build_url", content.build_url).attr("data-content_download_url", content.content_download_url)
                                checkContentVersion(content);
                            }
                            obj.find("input").attr("data-name", name).attr("data-obj", JSON.stringify(content)).click(function (evt) {
                                let target = $(evt.target);
                                if (target.is(":checked")) {
                                    updateEssentials(target.attr("data-name"), "false")
                                } else {
                                    updateEssentials(target.attr("data-name"), "true")
                                }
                            })
                            if (content.type != "splunkresearch") {
                                $("#content_sources").append(obj);
                            }

                            localDeferral.resolve()
                        },
                        error: function (xhr, textStatus, error) {
                            console.error("Error 2!", xhr, textStatus, error);

                        }
                    });
                }

                $.when.apply($, deferralStack).then(function () {
                    let desiredObjects = []
                    for (let i = 0; i < $("div.configObject[data-order]").length; i++) {
                        desiredObjects.push({
                            name: $($("div.configObject[data-order]")[i]).attr("data-name"),
                            order: $($("div.configObject[data-order]")[i]).attr("data-order")
                        })
                    }
                    desiredObjects.sort(function (a, b) {

                        if (a.order > b.order) {
                            return 1;
                        }
                        if (a.order < b.order) {
                            return -1;
                        }
                        return 0;
                    });
                    let container = $("div.configObject[data-order]").first().parent();
                    for (let i = 0; i < desiredObjects.length; i++) {
                        $("div.configObject[data-name=" + desiredObjects[i].name + "]").appendTo(container)
                    }
                })
            },
            error: function (xhr, textStatus, error) {
                console.error("Error 1!", xhr, textStatus, error);

            }
        });
        //Comment out as website is now a redirect.
        /*
        setTimeout(function(){
            $.ajax({
                url: 'https://www.splunksecurityessentials.com/partners',
                type: 'GET',
                async: true,
                success: function(returneddata) {
                    // No 404! Let's do it...
                    $("#content_sources").prepend($("<p>Splunk Security Essentials ships with a variety of content from Splunk apps, but also can be expanded with additional partner content. You may enable or disable any content sources below.</p><p>To look for new content sources, <a href=\"https://www.splunksecurityessentials.com/partners\" target=\"_blank\" class=\"external drilldown-link\">browse here</a>.</p>"))
                },
                error: function(xhr, textStatus, error) {
                    // No action, 'cause we have a 404 on the partners page.
                }
            })
        }, 1000)
        */

        // $(".dashboard-view-controls").prepend($('<button id="sysConfigButton" class="button btn" style="margin-right: 4px; height: 32px;" href="#" ><i class="icon-gear" style="font-size: 24px" /></button>').click(function() {
        //     $("#systemConfig").css("display", "block");
        //     $("#systemConfigBackdrop").css("display", "block");

        // }))

        function checkContentVersion(content) {

        }
        function forceUpdateEssentials() {

            Searches.setSearch("resetSSEContent", {
                autostart: true,
                targetJobIdTokenName: "resetSSEContent",
                searchString: ['| inputlookup external_content_lookup | where a=b | outputlookup external_content_lookup |inputlookup append=T sse_json_doc_storage_lookup | where a=b |outputlookup sse_json_doc_storage_lookup  '],
                onFinallyCallback: function onFinallyCallback() {
                    location.reload()
                }
            });



        }

        function updateEssentials(name, isEnabled) {
            var appscope = {}
            appscope['owner'] = Splunk.util.getConfigValue("USERNAME")
            appscope['app'] = splunkjs.mvc.Components.getInstance("env").toJSON()['app'];
            appscope['sharing'] = "app";
            var mystanza = {}
            mystanza["disabled"] = isEnabled;
            var svc = splunkjs.mvc.createService();
            var files = svc.configurations(appscope);
            var fileDeferred = $.Deferred();
            files.fetch({ 'search': 'name=essentials_updates"' }, function (err, files) {
                var macrosFile = files.item("essentials_updates");
                window.macrosFile = macrosFile;
                fileDeferred.resolve(macrosFile)

            });
            fileDeferred.done(function (macrosFile) {
                macrosFile.post(name, mystanza, function (err, stanza) {
                    if (err) { } else {
                        return true;
                    }
                })
            });

            if ($("#systemConfig").find("input:not(:checked):not([data-default=disabled])").length + $("#systemConfig").find("input[data-default=disabled]:checked").length == 0) {
                $("#sysConfigButton").removeClass("btn-primary")
            } else {
                $("#sysConfigButton").addClass("btn-primary")
            }
            if ($("#systemConfig").find(".modal-footer").find("button.btn").attr("data-isrefreshset") != "yes") {
                $("#systemConfig").find(".modal-footer").find("button.btn").attr("data-isrefreshset", "yes").text(_("Refresh Page").t()).click(function () {
                    location.reload()
                })
                $("#systemConfig").find(".modal-header").find(".close").click(function () {
                    location.reload()
                })

            }
        }

    })
}, 1000)