"use strict";


// Open the Content Introspection Page
function openContentIntrospectionDialog() {
    $('a:contains("Content Introspection")').trigger('click');
    $('button:contains("Look for Enabled Content")').trigger('click');
}

let refreshTerm = "content-refresh";
let noRefreshTerm = "no-refresh";
if (window.location.href.includes(refreshTerm)) {
    if (!window.location.href.includes(noRefreshTerm)) {
        setTimeout(function() {
            openContentIntrospectionDialog();
            // window.location.href = window.location.href.replace(refreshTerm, "#");
        }, 3000);

    }
}




require([
    "jquery",
], function ($) {
    window.translationLoaded = $.Deferred()
    let languageLoaded = $.Deferred()
    let splunkJSLoaded = $.Deferred()

    $.when(languageLoaded, splunkJSLoaded).then(function (localizeStrings) {
        function runTranslation() {
            let translatable = $("[data-translate-id]")
            for (let i = 0; i < translatable.length; i++) {
                let id = $(translatable[i]).attr("data-translate-id")
                if (localizeStrings[id]) {
                    translatable[i].innerHTML = localizeStrings[id]
                }
            }
            // console.log("Language Loading Complete", Date.now() - window.startTime)
        }

        function runTranslationOnElement(element) {
            for (let id in localizeStrings) {
                if (element.find("#" + id).length) {
                    element.find("#" + id).html(localizeStrings[id])
                }
            }
        }
        runTranslation()
        window.runTranslationOnElement = runTranslationOnElement
        window.translationLoaded.resolve()
    })
    if (
        typeof localStorage[appName + "-i18n-" + window.localeString] !=
            "undefined" &&
        localStorage[appName + "-i18n-" + window.localeString] != ""
    ) {
        let langObject = JSON.parse(
            localStorage[appName + "-i18n-" + window.localeString]
        )
        if (langObject["build"] == build) {
            languageLoaded.resolve(langObject)

            if (
                window.location.href.indexOf("127.0.0.1") >= 0 ||
                window.location.href.indexOf("localhost") >= 0
            ) {
                // only refresh in a dev env (or at least one without latency), otherwise it's not necessary as long as the build is the same.
                // console.log("Found cache hit in localStorage", Date.now() - window.startTime)
                $.ajax({
                    url:
                        $C["SPLUNKD_PATH"] +
                        "/services/pullJSON?config=htmlpanels&locale=" +
                        window.localeString,
                    async: true,
                    success: function (localizeStrings) {
                        localizeStrings["build"] = build
                        localStorage[appName + "-i18n-" + window.localeString] =
                            JSON.stringify(localizeStrings)
                    },
                })
                $.ajax({
                    url:
                        $C["SPLUNKD_PATH"] +
                        "/services/pullJSON?config=sselabels&locale=" +
                        window.localeString,
                    async: true,
                    success: function (localizeStrings) {
                        localStorage[
                            appName + "-i18n-labels-" + window.localeString
                        ] = JSON.stringify(localizeStrings)
                    },
                })
            }
        } else {
            // console.log("localStorage out of date, starting to grab file", Date.now() - window.startTime)

            $.ajax({
                url:
                    $C["SPLUNKD_PATH"] +
                    "/services/pullJSON?config=htmlpanels&locale=" +
                    window.localeString,
                async: true,
                success: function (localizeStrings) {
                    languageLoaded.resolve(localizeStrings)
                    localizeStrings["build"] = build
                    localStorage[appName + "-i18n-" + window.localeString] =
                        JSON.stringify(localizeStrings)
                },
            })
            $.ajax({
                url:
                    $C["SPLUNKD_PATH"] +
                    "/services/pullJSON?config=sselabels&locale=" +
                    window.localeString,
                async: true,
                success: function (localizeStrings) {
                    localStorage[
                        appName + "-i18n-labels-" + window.localeString
                    ] = JSON.stringify(localizeStrings)
                },
            })
        }
    } else {
        // console.log("Not in localStorage, starting to grab file", Date.now() - window.startTime)
        $.ajax({
            url:
                $C["SPLUNKD_PATH"] +
                "/services/pullJSON?config=sselabels&locale=" +
                window.localeString,
            async: true,
            success: function (localizeStrings) {
                localStorage[appName + "-i18n-labels-" + window.localeString] =
                    JSON.stringify(localizeStrings)
            },
        })
        $.ajax({
            url:
                $C["SPLUNKD_PATH"] +
                "/services/pullJSON?config=htmlpanels&locale=" +
                window.localeString,
            async: true,
            success: function (localizeStrings) {
                languageLoaded.resolve(localizeStrings)
                localizeStrings["build"] = build
                localStorage[appName + "-i18n-" + window.localeString] =
                    JSON.stringify(localizeStrings)
            },
        })
    }

    require(["jquery", "splunkjs/ready!"], function ($) {
        // not resolving anything here...
        // console.log("SplunkJS Ready", Date.now() - window.startTime)
    })

    require(["jquery", "splunkjs/mvc/simplexml/ready!"], function ($) {
        // console.log("SimpleXML Ready", Date.now() - window.startTime)
        splunkJSLoaded.resolve()
    })
})




function toHex(str) {
    //http://forums.devshed.com/javascript-development-115/convert-string-hex-674138.html
    var hex = '';
    for (var i = 0; i < str.length; i++) {
        hex += '' + str.charCodeAt(i).toString(16);
    }
    return hex;
}

window.NumSearchesSelected = 0

var addingIndividualContent = $.Deferred()
var examples = {}
loadSPL()

function trigger_clicked(str) {
    if (document.getElementById("checkbox_" + str).checked) {
        window.NumSearchesSelected += 1;
    } else {
        window.NumSearchesSelected -= 1;
    }
    $("#NumSearches").text(window.NumSearchesSelected)
}


window.allDataSources = new Object();
//var BookmarkStatus = { "none": "Not On List", "bookmarked": "Bookmarked", "needData": "Waiting on Data", "inQueue": "Ready for Deployment", "issuesDeploying": "Deployment Issues", "needsTuning": "Needs Tuning", "successfullyImplemented": "Successfully Implemented" }



require([
    "jquery",
    "underscore",
    "splunkjs/mvc",
    "splunkjs/mvc/utils",
    "splunkjs/mvc/tokenutils",
    "splunkjs/mvc/simplexml",
    "splunkjs/mvc/searchmanager",
    Splunk.util.make_full_url(
        "/static/app/Splunk_Security_Essentials/components/data/sendTelemetry.js"
    ),
    "components/controls/Modal",
    "splunkjs/ready!",
    "json!" +
        $C["SPLUNKD_PATH"] +
        "/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/bookmark_names",
    Splunk.util.make_full_url(
        "/static/app/Splunk_Security_Essentials/components/controls/ProcessSummaryUI.js"
    ),
    "css!../app/Splunk_Security_Essentials/style/data_source_check.css",

], function (
    $,
    _,
    mvc,
    utils,
    TokenUtils,
    DashboardController,
    SearchManager,
    Telemetry,
    Modal,
    Ready,
    bookmark_names,
    ProcessSummaryUI
) {

    // Sending Telemetry whenever this page is opened
    let record = {
        "status": "opened",
        "page": mvc.Components.getInstance("env").toJSON()['page']
    }

    Telemetry.SendTelemetryToSplunk("ManageBookmarks", record)

    // add these to the beginning and end of the array since we need them later to get an accurate count of bookmarks
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

    // since the kvstore doesn't expect a reference name we look it up based on the bookmark object in common_objects
    for (let i = 0; i < bookmark_names.length; i++) {
        if (bookmark_names[i]["referenceName"] == "") {
            bookmark_names[i]["referenceName"] = getKeyByValue(
                window.BookmarkStatus,
                bookmark_names[i]["name"]
            )
        }
    }
    $("#manageBookmarkLink").click(function () {
       require([
           Splunk.util.make_full_url(
               "/static/app/Splunk_Security_Essentials/components/controls/ManageSnapshots.js"
           ),
       ], function () {
           manageContentModal()
       })
    })

    function deferralLookForEnabledContent(deferral) {
        let search_name_to_showcase_names = {}
        let SPL_to_name = {}
        // console.log("Here's my showcaseInfo", fullShowcaseInfo)
        for (let SummaryName in fullShowcaseInfo["summaries"]) {
            if (fullShowcaseInfo["summaries"][SummaryName]["search_name"]) {
                search_name_to_showcase_names[
                    fullShowcaseInfo["summaries"][SummaryName]["search_name"]
                ] = SummaryName
            }
            if (fullShowcaseInfo["summaries"][SummaryName]["examples"]) {
                for (
                    let i = 0;
                    i <
                    fullShowcaseInfo["summaries"][SummaryName]["examples"]
                        .length;
                    i++
                ) {
                    if (
                        fullShowcaseInfo["summaries"][SummaryName]["examples"][
                            i
                        ]["label"] &&
                        fullShowcaseInfo["summaries"][SummaryName]["examples"][
                            i
                        ]["label"].indexOf("Demo") == -1 &&
                        fullShowcaseInfo["summaries"][SummaryName]["examples"][
                            i
                        ]["showcase"] &&
                        fullShowcaseInfo["summaries"][SummaryName]["examples"][
                            i
                        ]["showcase"]["value"]
                    ) {
                        if (
                            !SPL_to_name[
                                fullShowcaseInfo["summaries"][SummaryName][
                                    "examples"
                                ][i]["showcase"]["value"].replace(/\s/g, "")
                            ]
                        ) {
                            SPL_to_name[
                                fullShowcaseInfo["summaries"][SummaryName][
                                    "examples"
                                ][i]["showcase"]["value"].replace(/\s/g, "")
                            ] = []
                        }
                        //console.log("Adding to spl_to_name", fullShowcaseInfo['summaries'][SummaryName]['examples'][i])
                        SPL_to_name[
                            fullShowcaseInfo["summaries"][SummaryName][
                                "examples"
                            ][i]["showcase"]["value"].replace(/\s/g, "")
                        ].push(SummaryName)
                    }
                }
            }
        }
        // console.log("Here's my search name to showcse name", search_name_to_showcase_names)
        $.ajax({
            url:
                $C["SPLUNKD_PATH"] +
                "/servicesNS/" +
                $C["USERNAME"] +
                "/-/saved/searches?output_mode=json&count=0",
            type: "GET",
            async: true,
            success: function (savedSearchObj) {
                let enabled_searches = {}

                // First look to see if exact ES or ESCU
                for (let i = 0; i < savedSearchObj.entry.length; i++) {
                    let search = savedSearchObj.entry[i]
                    if (
                        !SPL_to_name[search.content.search.replace(/\s/g, "")]
                    ) {
                        SPL_to_name[search.content.search.replace(/\s/g, "")] =
                            []
                    }
                    SPL_to_name[search.content.search.replace(/\s/g, "")].push(
                        search.name
                    )
                    // console.log("Extra logging 1 ", search.name)
                    if (search_name_to_showcase_names[search.name]) {
                        if (!search.content.disabled) {
                            if (
                                !enabled_searches[
                                    search_name_to_showcase_names[search.name]
                                ]
                            ) {
                                enabled_searches[
                                    search_name_to_showcase_names[search.name]
                                ] = []
                            }
                            enabled_searches[
                                search_name_to_showcase_names[search.name]
                            ].push({ name: search.name })
                            // console.log("Got a match", search.name, fullShowcaseInfo['summaries'][search_name_to_showcase_names[search.name]]['data_source_categories'], search.content.disabled)
                        }
                    }
                }
                for (let i = 0; i < savedSearchObj.entry.length; i++) {
                    let search = savedSearchObj.entry[i]
                    if (
                        SPL_to_name[search.content.search.replace(/\s/g, "")] &&
                        SPL_to_name[search.content.search.replace(/\s/g, "")]
                            .length > 1 &&
                        search.content.disabled == false
                    ) {
                        for (
                            let i = 0;
                            i <
                            SPL_to_name[
                                search.content.search.replace(/\s/g, "")
                            ].length;
                            i++
                        ) {
                            if (
                                search_name_to_showcase_names[
                                    SPL_to_name[
                                        search.content.search.replace(/\s/g, "")
                                    ][i]
                                ]
                            ) {
                                let searchName =
                                    SPL_to_name[
                                        search.content.search.replace(/\s/g, "")
                                    ][i]
                                if (search_name_to_showcase_names[searchName]) {
                                    if (
                                        !enabled_searches[
                                            search_name_to_showcase_names[
                                                searchName
                                            ]
                                        ]
                                    ) {
                                        enabled_searches[
                                            search_name_to_showcase_names[
                                                searchName
                                            ]
                                        ] = []
                                    }
                                    enabled_searches[
                                        search_name_to_showcase_names[
                                            searchName
                                        ]
                                    ].push({ name: search.name })
                                }

                                //  console.log("Found an instance of an ES / ESCU Search", search.name, search_name_to_showcase_names[SPL_to_name[search.content.search.replace(/\s/g, "")][i]], SPL_to_name[search.content.search.replace(/\s/g, "")], search.content.search)
                            } else if (
                                fullShowcaseInfo["summaries"][
                                    SPL_to_name[
                                        search.content.search.replace(/\s/g, "")
                                    ][i]
                                ]
                            ) {
                                if (
                                    !enabled_searches[
                                        SPL_to_name[
                                            search.content.search.replace(
                                                /\s/g,
                                                ""
                                            )
                                        ][i]
                                    ]
                                ) {
                                    enabled_searches[
                                        SPL_to_name[
                                            search.content.search.replace(
                                                /\s/g,
                                                ""
                                            )
                                        ][i]
                                    ] = []
                                }
                                enabled_searches[
                                    SPL_to_name[
                                        search.content.search.replace(/\s/g, "")
                                    ][i]
                                ].push({ name: search.name })

                                // console.log("Found an instance of an SSE Search", search.name, fullShowcaseInfo['summaries'][SPL_to_name[search.content.search.replace(/\s/g, "")][i]], search.content.search)
                            }
                        }
                    }
                }
                deferral.resolve(enabled_searches)
            },
            error: function (xhr, textStatus, error) {
                console.error("Error Updating!", xhr, textStatus, error)
                //triggerError(xhr.responseText);
            },
        })
    }

    splunkjs.mvc.Components.getInstance("submitted").on(
        "change:implemented",
        function (obj, value) {
            if (value < 5) {
                if (
                    typeof localStorage["sse-haveRunSearchIntrospection"] ==
                        "undefined" ||
                    localStorage["sse-haveRunSearchIntrospection"] == ""
                ) {
                    localStorage["sse-haveRunSearchIntrospection"] = "done"
                    let localContent = $("<div>")
                        .html(
                            $(
                                "<p>You have yet to run introspection to look for any of Splunk's pre-built content that is running on this local system. If you would like to, we can introspect your environment to look for any content that you've enabled, and note that it's active in order to take advantage of all our dashboards helping you understand the content in Splunk. Today, we will find the following content:</p>"
                            )
                        )
                        .append(
                            $("<ul>").append(
                                $("<li>").text(
                                    "ES or ESCU content enabled directly from the app (without copy-pasting the SPL into a new search)"
                                ),
                                $("<li>").text(
                                    "ES, ESCU, or SSE content where you directly copy-pasted the SPL into a new search that you activated."
                                )
                            ),
                            $("<p>").text(
                                'If you would like to close the dialog for now, you can always re-open it by clicking "Content Introspection" in the upper-right corner of this page.'
                            )
                        )
                    popModalToLookForEnabledContent(localContent)
                }
            }
        }
    )
    if (location.hash.indexOf("launchContentIntrospection") >= 0) {
        location.hash = ""
        popModalToLookForEnabledContent()
    }

    function popModalToLookForEnabledContent(alternateParagraphElement) {
        let myModal = new Modal(
            "confirmActive",
            {
                title: "Look for Active Content",
                destroyOnHide: true,
                type: "wide",
            },
            $
        )
        $(myModal.$el).on("hide", function () {
            // Not taking any action on hide, but you can if you want to!
        })
        if (typeof alternateParagraphElement != "undefined") {
            myModal.body.html($("<div>").append(alternateParagraphElement))
        } else {
            myModal.body.html(
                $("<div>").append(
                    $(
                        "<p>" +
                            _(
                                "In order to help you prioritize new content via the Analytics Advisor dashboards, it's useful to be able to show your existing levels of coverage and areas of focus. To make this as easy as possible, this app includes a workflow for listing all of your local saved searches and then either mapping them to Splunk's out-of-the-box-content, or creating new content in Splunk Security Essentials that you can tag with all of the metadata you care about."
                            ).t() +
                            "</p>"
                    ),
                    $(
                        "<p>" +
                            _(
                                "Finally, remember that you can always come back here and change any of these settings."
                            ).t() +
                            "</p>"
                    )
                )
            )
        }

        myModal.body.append(
            $(
                '<button class="btn btn-primary">' +
                    _("Look for Enabled Content").t() +
                    "</button>"
            ).click(function (evt) {
                $("#confirmActive").modal("hide")

                let myModal = new Modal(
                    "localContentLoading",
                    {
                        title: "Gathering Data...",
                        destroyOnHide: true,
                    },
                    $
                )
                window.dvtest = myModal
                myModal.$el.addClass("modal-basically-full-screen")

                myModal.body.html(
                    $("<p>Please wait a moment while we gather data.</p>")
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

                require([
                    Splunk.util.make_full_url(
                        "/static/app/Splunk_Security_Essentials/components/controls/MapExistingSearchContent.js"
                    ),
                ], function (_) {
                    // Let loose the beast
                    mapExistingSearchContent();
                })
            })
        )

        myModal.body.append($('<div id="DoIntrospection">'))

        myModal.footer.append(
            $("<button>")
                .attr({
                    type: "button",
                    "data-dismiss": "modal",
                    "data-bs-dismiss": "modal",
                })
                .addClass("btn btn-primary ")
                .text("Close")
                .on("click", function () {})
        )
        myModal.show()
    }
    window.popModalToLookForEnabledContent = popModalToLookForEnabledContent

    /////////////////////////////////////////
    /////    Core Functionality   ///////////
    /////////////////////////////////////////

    var HTMLBlock = ""
    var unsubmittedTokens = mvc.Components.getInstance("default")
    var submittedTokens = mvc.Components.getInstance("submitted")
    var myDataset = "No dataset provided"

    unsubmittedTokens.set("gotsearchrow", "I got it!")
    // generate the table at the bottom of the bookmark pages
    // loads the names and descriptions from the kvstore

    let tableBeginning =
        '<table style="" id="main_table" class="table table-chrome" > <thead> <tr class="dvbanner"><th style="width: 10px; text-align: center" class="tableexpand"><i class="icon-info"></i></th> <th class="tableExample">Content</th> <th style="text-align: center">Open</th>'
    let tableEnd =
        '<th style="text-align: center" class="tablenotes"><span data-placement="top" data-toggle="tooltip" title="Many people wish to take notes on the status of content -- this is the place to do so!">Notes<i class="icon-info-circle" /></span></th><th style="text-align: center" class="tableclose"><span data-placement="top" data-toggle="tooltip" title="Removing here just means removing the bookmark, not the entire content. You will still be able to find it on the Security Contents page, and be able to re-add the bookmark later.">Remove <i class="icon-info-circle" /></span></th></tr></thead><tbody id="main_table_body"></tbody></table>'

    // table name is the name with spaces removed. we do this also in common objects
    // load the content and add it to the tableBeginning template for the table

    // add a count key to each item in the array that we'll use later to tally up how many of each bookmarks we have
    for (let name in bookmark_names) {
        bookmark_names[name]["count"] = 0
    }
    for (let i = 0; i < bookmark_names.length; i++) {
        let tableName
        if (bookmark_names[i]["referenceName"]) {
            tableName = bookmark_names[i]["referenceName"]
        } else {
            tableName = bookmark_names[i]["name"].split(" ").join("")
            tableName = tableName.charAt(0).toLowerCase() + tableName.slice(1)
        }
        let tableContent = `<th style=\"text-aligh: center\" class=\"${tableName}\"><span data-placement=\"top\" data-toggle=\"tooltip\" title=\"${bookmark_names[i]["description"]}\">${bookmark_names[i]["name"]} <i class=\"icon-info-circle\" /></span></th>`
        tableBeginning += tableContent
    }

    // add the final template to the table content that was generated automatically
    tableBeginning += tableEnd
    $("#bookmark_table").append(tableBeginning)

    //$("#bookmark_table").append("<table style=\"\" id=\"main_table\" class=\"table table-chrome\" ><thead><tr class=\"dvbanner\"><th style=\"width: 10px; text-align: center\" class=\"tableexpand\"><i class=\"icon-info\"></i></th><th class=\"tableExample\">Content</th><th style=\"text-align: center\">Open</th>" /*<th class=\"tableChangeStatus\" style=\"text-align: center\">Change Status</th>" */ + "<th style=\"text-align: center\" class=\"tablebookmarked\"><span data-placement=\"top\" data-toggle=\"tooltip\" title=\"Bookmarked is the default status -- it's provided just so that you can remember items to review later.\">Bookmarked <i class=\"icon-info-circle\" /></span></th><th style=\"text-align: center\" class=\"tableawaitingdata\"><span data-placement=\"top\" data-toggle=\"tooltip\" title=\"Waiting on Data indicates that you have plans to ingest the data, but it's not currently on-board.\">Waiting on Data <i class=\"icon-info-circle\" /></span></th><th style=\"text-align: center\" class=\"tablereadyfordeploy\"><span data-placement=\"top\" data-toggle=\"tooltip\" title=\"Ready for Deployment indicates that the data in ingested, and it's now time to start implementing this detection.\">Ready for Deployment <i class=\"icon-info-circle\" /></span></th><th style=\"text-align: center\" class=\"tabledeploymentissues\"><span data-placement=\"top\" data-toggle=\"tooltip\" title=\"Deployment Issues indicates that you've attempted to start building out the detection, but ran into a problem with scale, field extractions... anything except for too many alerts. Content with this status isn't ready for use yet.\">Deployment Issues <i class=\"icon-info-circle\" /></span></th><th style=\"text-align: center\" class=\"tableneedstuning\"><span data-placement=\"top\" data-toggle=\"tooltip\" title=\"Needs Tuning indicates that the content has successfully been implemented, but too many alerts are being sent. Detections in this category are generally in use despite the noise.\">Needs Tuning <i class=\"icon-info-circle\" /></span></th><th style=\"text-align: center\" class=\"tablesuccess\"><span data-placement=\"top\" data-toggle=\"tooltip\" title=\"Successfully Implemented is the ideal state -- it means that detections are deployed and working pretty well!\">Successfully Implemented <i class=\"icon-info-circle\" /></span></th><th style=\"text-align: center\" class=\"tablenotes\"><span data-placement=\"top\" data-toggle=\"tooltip\" title=\"Many people wish to take notes on the status of content -- this is the place to do so!\">Notes <i class=\"icon-info-circle\" /></span></th><th style=\"text-align: center\" class=\"tableclose\"><span data-placement=\"top\" data-toggle=\"tooltip\" title=\"Removing here just means removing the bookmark, not the entire content. You will still be able to find it on the Security Contents page, and be able to re-add the bookmark later.\">Remove <i class=\"icon-info-circle\" /></span></th></tr></thead><tbody id=\"main_table_body\"></tbody></table>");
    require(["vendor/bootstrap/bootstrap.bundle"], function () {
        $("[data-toggle=tooltip]").tooltip({ html: true })
    })
    $.getJSON(
        $C["SPLUNKD_PATH"] +
            "/services/SSEShowcaseInfo?locale=" +
            window.localeString,
        async function (ShowcaseInfo) {
            // console.log("Got this ShowcaseInfo..", ShowcaseInfo);
            let fullShowcaseInfo = JSON.parse(JSON.stringify(ShowcaseInfo))
            window.fullShowcaseInfo = fullShowcaseInfo
            checkForErrors(fullShowcaseInfo)
            checkForOutOfDateBookmarkConfig(fullShowcaseInfo)

            let ShowcaseList = Object.keys(ShowcaseInfo.summaries)
            for (let i = 0; i < ShowcaseList.length; i++) {
                if (
                    !ShowcaseInfo.summaries[ShowcaseList[i]].bookmark_status ||
                    ShowcaseInfo.summaries[ShowcaseList[i]].bookmark_status.toLowerCase() ==
                        "none"
                ) {
                    delete ShowcaseInfo.summaries[ShowcaseList[i]]
                    if (
                        ShowcaseInfo.roles.default.summaries.indexOf(
                            ShowcaseList[i]
                        ) >= 0
                    ) {
                        ShowcaseInfo.roles.default.summaries.splice(
                            ShowcaseInfo.roles.default.summaries.indexOf(
                                ShowcaseList[i]
                            ),
                            1
                        )
                    }
                }
            }
            if (ShowcaseInfo.roles.default.summaries.length == 0) {
                setTimeout(function () {
                    noContentMessage()
                }, 500)
            }
            //console.log("After: ", ShowcaseInfo)
            //console.log("After new: ", newShowcaseInfo)

            // content for search tiles
            // iterate through the showcase info items and compare to the bookmarks names and update the bounts in the bookmark_names object
            for (var i in ShowcaseInfo["summaries"]) {
                for (var j in bookmark_names) {
                    if (
                        ShowcaseInfo["summaries"][i]["bookmark_status"] ==
                        bookmark_names[j]["referenceName"]
                    ) {
                        bookmark_names[j]["count"]++
                    }
                }
            }

            // at this point bookmark_names has an up to date count of how many items are bookmarked and we can generate our
            // html to append to the main page

            let panelTable = '<div class="container">'
            //for(let item in bookmark_names) {
            //    panelTable += `<div class="box"><h2>${bookmark_names[item]["name"]}</h2><br /><p>${bookmark_names[item]["count"]}</p></div>`
            //}
            for (let i = 0; i < bookmark_names.length; i++) {
                panelTable += `<div class="box"><h2>${bookmark_names[i]["name"]}</h2><br /><p>${bookmark_names[i]["count"]}</p></div>`
            }
            panelTable += "</div>"
            $("#mainContentBoxes").append(panelTable)

            ShowcaseInfo.roles.default.summaries.sort(function (a, b) {
                if (
                    ShowcaseInfo.summaries[a].name >
                    ShowcaseInfo.summaries[b].name
                ) {
                    return 1
                }
                if (
                    ShowcaseInfo.summaries[a].name <
                    ShowcaseInfo.summaries[b].name
                ) {
                    return -1
                }
                return 0
            })
            for (
                var i = 0;
                i < ShowcaseInfo.roles.default.summaries.length;
                i++
            ) {
                summary =
                    ShowcaseInfo.summaries[
                        ShowcaseInfo.roles.default.summaries[i]
                    ]
                await ProcessSummaryUI.addItemBM_async($,ShowcaseInfo, summary);
            }

            addingIndividualContent.resolve()
            window.ShowcaseInfo = ShowcaseInfo
            updateDataSourceBlock()

            $("#layout1").append(HTMLBlock) //#main_content

            $("#layout1").append('<div id="bottomTextBlock" style=""></div>')
            contentMessage()

            $(".tabledemo").css("text-align", "center")
            $(".tablelive").css("text-align", "center")
            $(".tableaccel").css("text-align", "center")
            $(".panel-body").css("padding", "0px")
        }
    )

    require(["vendor/bootstrap/bootstrap.bundle"], function () {
        if ($(".dvTooltip").length > 0) {
            $(".dvTooltip").tooltip({ html: true })
        }
        if ($(".dvPopover").length > 0) {
            $(".dvPopover").popover({ html: true })
        }
    })

    //ProcessSearchQueue()
    $(".data_check_table")
        .find("tr")
        .each(function (num, blah) {
            $(blah).find("td").first().css("width", "20%")
        })
    $(".data_check_table")
        .find("tr")
        .each(function (num, blah) {
            $(blah).find("td").last().css("width", "65%")
        })

    unsubmittedTokens.set(myDataset.replace(/\W/g, ""), "Test")

    submittedTokens.set(unsubmittedTokens.toJSON())

    $(".dashboard-export-container").css("display", "none")

    $(".dashboard-view-controls").prepend(
        $(
            '<a class="btn" style="margin-right: 4px;" href="#" >Export <i class="icon-export" /></a>'
        ).click(function () {
            LaunchExportDialog(ShowcaseInfo)
        })
    )

    // $(".dashboard-view-controls").prepend($("<button style=\"margin-left: 5px;\" class=\"btn\">Print to PDF</button>").click(function() { window.print() }));
    $("#introspectContentLink").prepend(
        // '<img class="content_mapping_link_image" src="/static/app/Splunk_Security_Essentials/images/general_images/content_mapped.png" />'
        '<img class="content_mapping_link_image" src="' + Splunk.util.make_full_url('/static/app/Splunk_Security_Essentials/images/general_images/content_mapped.png')+'"/>'

    )
    $("#introspectContentLink").click(function () {
        popModalToLookForEnabledContent()
    })
})


function doToggle(obj) {
    let container = $(obj).closest(".titleRow");
    let showcaseId = container.attr("data-showcaseid");
    let chevron = container.find(".icon-chevron-down, .icon-chevron-right")
    if (chevron.attr("class") == "icon-chevron-down") {
        $(".descriptionRow[data-showcaseid=" + showcaseId + "]").css("display", "none")
        chevron.attr("class", "icon-chevron-right")
    } else {
        $(".descriptionRow[data-showcaseid=" + showcaseId + "]").css("display", "table-row")
        chevron.attr("class", "icon-chevron-down")
        $(".descriptionRow[data-showcaseid=" + showcaseId + "]").find("td").css("border-top", 0)
    }

}


function noContentMessage() {
    $("#bottomTextBlock").css("background-color", "white")
    $("#bottomTextBlock").css("text-align", "center")
    $("#bottomTextBlock").html("<h3>No Content Bookmarked</h3><p>Please visit the <a href=\"contents\">Security Content page</a> to view the content in Splunk Security Essentials, and bookmark what you find useful.</p>")
    $("#dataSourcePanel").html("")
}

function contentMessage() {
    $("#bottomTextBlock").html('<div class="printandexporticons"><a href="#" id="printUseCaseIcon" onclick="doPrint(); return false;"><i class="icon-print icon-no-underline" style="font-size: 16pt;" /> Print Page </a>&nbsp;&nbsp;<a href="#" id="downloadUseCaseIcon" onclick="DownloadAllUseCases(); return false;"><i class="icon-export" style="font-size: 16pt;" /> Export Content List </a></div>')
    //$("#bottomTextBlock").css("background-color","#f0f2f3")
    $("#bottomTextBlock").css("background-color", "rgba(0,0,0,0)")
    $("#bottomTextBlock").css("text-align", "right")

}

function radioUpdateSetting(obj) {

    require([
        'components/controls/Modal',
        'json!' + $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/bookmark_names'
    ],
        function(Modal,
            bookmark_names,
            BookmarkStatus) {
            let target = $(obj);
            //let newName = ShowcaseInfo['summaries'][target.attr("data-name")]['name'];
            let showcaseName = target.attr("data-name")
            let showcaseId = target.attr("data-showcaseid")
            let status = target.attr("data-status");
            let notes = ShowcaseInfo['summaries'][showcaseId]['bookmark_notes'] || "";

            // console.log("Setting ", newName, status)
            if (status == "none") {

                var confirmModal = new Modal('newCustom', {
                    title: 'Confirm Deletion?',
                    destroyOnHide: true
                }, $);
                confirmModal.body.append($("<p>Are you sure you want to remove this bookmark?</p><p>" + showcaseName + "</p>"))

                confirmModal.footer.append($('<button>').attr({
                    type: 'button',
                    'data-dismiss': 'modal',
                    'data-bs-dismiss': 'modal'
                }).addClass('btn btn-secondary').text('Cancel'), $('<button>').attr('data-name', name).attr({
                    type: 'button',
                }).addClass('btn btn-primary ').text('Confirm').attr("data-showcaseid", showcaseId).attr("data-status", status).attr("data-name", showcaseName).on('click', function(evt) {
                    let target = $(evt.target);
                    let showcaseName = target.attr("data-name");
                    let showcaseId = target.attr("data-showcaseid");

                    let status = target.attr("data-status");
                    removeRow(showcaseId);
                    setbookmark_status(showcaseName, showcaseId, status, notes);
                    $('[data-bs-dismiss=modal').click()
                }))
                confirmModal.show()
            } else if (window.ShowcaseInfo.summaries[showcaseId]["bookmark_status"] !== status) {
                setbookmark_status(showcaseName, showcaseId, status, notes);
                updateHTMLWithStatus(showcaseId, status);
                updateNotes(showcaseId, notes)
            }
            updateDataSourceBlock();
            updateNotes(showcaseId, notes)
        })
}

function updateHTMLWithStatus(showcaseId, status) {
    $(".descriptionRow[data-showcaseid=" + showcaseId + "]").find("a.showcase_bookmark_status").text(BookmarkStatus[status])
    $(".printable_section[data-showcaseid=" + showcaseId + "]").find("h2:contains(Status)").first().next().text(BookmarkStatus[status])
}

function updateNotes(showcaseId, notes) {
    if (notes && notes != "" && notes != null && notes != "None") {
        $(".bookmarkNotes[data-showcaseid=" + showcaseId + "]").css("display", "block").find("p").text(notes)
        $("i.icon-pencil[data-showcaseid=" + showcaseId + "]").css("color", "black")
    } else {
        $(".bookmarkNotes[data-showcaseid=" + showcaseId + "]").css("display", "hide").find("p").text("")
        $("i.icon-pencil[data-showcaseid=" + showcaseId + "]").css("color", "gray")
    }
}

function removeRow(showcaseId) {
    //console.log("Removing row for", id, ShowcaseInfo.summaries[id],ShowcaseInfo.summaries[id].name, $("td:contains(" + ShowcaseInfo.summaries[id].name + ")"))

    $(".titleRow[data-showcaseid=" + showcaseId + "]").remove()
    $(".descriptionRow[data-showcaseid=" + showcaseId + "]").remove()
    $(".printable_section[data-showcaseid=" + showcaseId + "]").remove()

    if ($("#main_table_body tr").length == 0) {
        noContentMessage()
    }

    delete window.ShowcaseInfo.summaries[showcaseId]
    window.ShowcaseInfo.roles.default.summaries.splice(window.ShowcaseInfo.roles.default.summaries.indexOf(showcaseId), 1)
}

function setbookmark_status(name, showcaseId, status, notes, action) {
    if (!action) {
        action = "bookmarked_content"
    }
    require(["components/data/sendTelemetry", 'json!' + $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/sse_app_config'], function(Telemetry, appConfig) {
        let record = { "status": status, "name": name, "selectionType": action }
        for (let i = 0; i < appConfig.length; i++) {
            if (appConfig[i].param == "demoMode" && appConfig[i].value == "true") {
                record.demoMode = true
            }
        }
        Telemetry.SendTelemetryToSplunk("BookmarkChange", record)
    })
    require(["splunkjs/mvc/utils", "splunkjs/mvc/searchmanager"], function(utils, SearchManager) {
        let desiredSearchName = "logBookmarkChange-" + name.replace(/[^a-zA-Z0-9]/g, "_")
        if (typeof splunkjs.mvc.Components.getInstance(desiredSearchName) == "object") {
            // console.log(desiredSearchName, "already exists. This probably means you're copy-pasting the same code repeatedly, and so we will clear out the old object for convenience")
            splunkjs.mvc.Components.revokeInstance(desiredSearchName)
        }
        new SearchManager({
            "id": desiredSearchName,
            "latest_time": "0",
            "autostart": true,
            "earliest_time": "now",
            "search": '| makeresults | eval app="' + utils.getCurrentApp() + '", page="' + splunkjs.mvc.Components.getInstance("env").toJSON()['page'] + '", user="' + $C['USERNAME'] + '", name="' + name + '", status="' + status + '" | collect index=_internal sourcetype=essentials:bookmark',
            "app": utils.getCurrentApp(),
            "auto_cancel": 90
        }, { tokens: false });
    })

    if (status != "none") {
        ShowcaseInfo.summaries[showcaseId].bookmark_status = status;
    }
    for (var i = 0; i < window.ShowcaseInfo.roles.default.summaries; i++) {
        if (name == window.ShowcaseInfo.summaries[window.ShowcaseInfo.roles.default.summaries[i]]) {
            window.ShowcaseInfo.summaries[window.ShowcaseInfo.roles.default.summaries[i]].bookmark_status = status
        }
    }

    var record = { _time: (new Date).getTime() / 1000, _key: showcaseId, showcase_name: name, status: status, notes: notes, user: Splunk.util.getConfigValue("USERNAME") }

    $.ajax({
        url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/bookmark/?query={"_key": "' + record['_key'] + '"}',
        type: 'GET',
        contentType: "application/json",
        async: false,
        success: function(returneddata) {
            if (returneddata.length == 0) {
                // New

                $.ajax({
                    url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/bookmark/',
                    type: 'POST',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-Splunk-Form-Key': window.getFormKey(),
                    },
                    contentType: "application/json",
                    async: false,
                    data: JSON.stringify(record),
                    success: function(returneddata) { bustCache(); newkey = returneddata },
                    error: function(xhr, textStatus, error) {

                    }
                })


            } else {
                // Old
                $.ajax({
                    url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/bookmark/' + record['_key'],
                    type: 'POST',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-Splunk-Form-Key': window.getFormKey(),
                    },
                    contentType: "application/json",
                    async: false,
                    data: JSON.stringify(record),
                    success: function(returneddata) { bustCache(); newkey = returneddata },
                    error: function(xhr, textStatus, error) {
                        //              console.log("Error Updating!", xhr, textStatus, error)
                    }
                })
            }
        },
        error: function(error, data, other) {
            //     console.log("Error Code!", error, data, other)
        }
    })


    generateTableContent();
}

function generateTableContent() {
    require(["jquery", 'json!' + $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/bookmark_names'], function($, bookmark_names) {

        // reset the counter before generating the table
        for (let i = 0; i < bookmark_names.length; i++) {
            bookmark_names[i]["count"] = 0
        }

        $.getJSON($C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/bookmark?locale=' + window.localString, function(ShowcaseInfo) {
            let filteredShowcaseInfo = ShowcaseInfo.filter((item) => (item.status && item.status.toLowerCase() !== "none")); 
            for (let i = 0; i < filteredShowcaseInfo.length; i++) {
                for (let j = 0; j < bookmark_names.length; j++) {
                    if (filteredShowcaseInfo[i]["status"] == bookmark_names[j]["referenceName"]) {
                        console.log("1. ", filteredShowcaseInfo[i], bookmark_names[j]);
                        bookmark_names[j]["count"]++
                    }
                }
            }

            console.log(bookmark_names)
            let panelTable = '<div class="container">'

            for (let i = 0; i < bookmark_names.length; i++) {
                panelTable += `<div class="box"><h2>${bookmark_names[i]["name"]}</h2><br /><p>${bookmark_names[i]["count"]}</p></div>`
            }
            panelTable += '</div>'
            $(".container").remove();
            $("#mainContentBoxes").append(panelTable)



        })
    })
}


function triggerNotes(obj) {

    require([
        'components/controls/Modal'], function(Modal) {
            let showcaseId = $(obj).attr("data-showcaseid");
            // console.log("Got a note request for", showcaseId)
            let existingNotes = ""
            if (typeof ShowcaseInfo['summaries'][showcaseId]['bookmark_notes'] != "undefined") {
                existingNotes = ShowcaseInfo['summaries'][showcaseId]['bookmark_notes']
            }

            var myModal = new Modal("addNotes", {
                title: "Add Notes",
                backdrop: 'static',
                keyboard: false,
                destroyOnHide: true,
                type: 'normal'
            }, $);

            $(myModal.$el).on("show", function() {

            })

            myModal.body
                .append($("<p>").text("Insert Notes Below, and click Save to record those notes for the future."), $(`<p>Following characters are not allowed to enter in notes: "(Double quotes)</p>`), $(`<textarea data-showcaseid=${showcaseId} onkeyup='this.value = this.value.replace(/["]/g,"")' id="bookmark_notes" style="width: 100%; height: 300px;"></textarea>`).text(existingNotes == "None" ? "" : existingNotes));
                
            myModal.footer.append($('<button>').attr({
                type: 'button',
                'data-dismiss': 'modal',
                'data-bs-dismiss': 'modal'
            }).addClass('btn ').text('Cancel').on('click', function() {
                // Not taking any action here
            }), $('<button>').attr({
                type: 'button',
            }).addClass('btn btn-primary').text('Save').on('click', function() {
                let showcaseId = $("#bookmark_notes").attr("data-showcaseid");
                let notes = $("#bookmark_notes").val();
                ShowcaseInfo['summaries'][showcaseId]['bookmark_notes'] = notes;
                //$("div#" + showcaseId).find(".bookmark_notes").text(notes)
                setbookmark_status(ShowcaseInfo['summaries'][showcaseId]['name'], showcaseId, ShowcaseInfo['summaries'][showcaseId]['bookmark_status'], notes)
                updateNotes(showcaseId, notes)
                $('[data-bs-dismiss=modal').click()
            }))
            myModal.show(); // Launch it!

        })
}

async function addItem(summary) {
    require(["jquery",
        "underscore"
    ],
        async function($,
            _,
        ) {
            let rowStatus = "";
            let statuses = Object.keys(BookmarkStatus);
            for (let i = 0; i < statuses.length; i++) {
                if (statuses[i] == "none") {
                    continue;
                }
                rowStatus += "<td style=\"text-align: center\" class=\"table" + statuses[i] + "\">" +
                    '<input type="radio" name="' + summary.id + '" data-status="' + statuses[i] + '" data-showcaseid="' + summary.id + '" data-name="' + summary.name + '" onclick="radioUpdateSetting(this)" ' + ((summary.bookmark_status == statuses[i]) ? "checked" : "") + '>' +
                    "</td>"
            }
            if (summary.bookmark_notes && summary.bookmark_notes != "" && summary.bookmark_notes != null && summary.bookmark_notes != "None") {
                rowStatus += '<td style="text-align: center" class="tablenotes" >' +
                    '<i class="icon-pencil" style="font-size: 20px;"  name="' + summary.id + '"  data-showcaseid="' + summary.id + '" data-name="' + summary.name + '" onclick="triggerNotes(this)" >' +
                    "</td>"
            } else {
                rowStatus += '<td style="text-align: center" class="tablenotes" >' +
                    '<i class="icon-pencil" style="font-size: 20px; color: gray;"  name="' + summary.id + '"  data-showcaseid="' + summary.id + '" data-name="' + summary.name + '" onclick="triggerNotes(this)" >' +
                    "</td>"
            }
            rowStatus += '<td style="text-align: center" class="tableclose" >' +
                '<i class="icon-close" style="font-size: 20px;"  name="' + summary.id + '" data-status="none" data-showcaseid="' + summary.id + '" data-name="' + summary.name + '" onclick="radioUpdateSetting(this)" >' +
                "</td>"
            var status_display = BookmarkStatus[summary.bookmark_status]
            var SPL = $("<div class=\"donotbreak\"></div>")
            if (typeof summary.examples == "object" && summary.examples.length > 0) {
                SPL.append("<h2>SPL for " + summary.name + "</h2>")
                for (var i = 0; i < summary.examples.length; i++) {
                    if (typeof examples[summary.examples[i].name] != "undefined") {
                        var localexample = $("<div class=\"donotbreak\"></div>").append($("<h3>" + summary.examples[i].label + "</h3>"), $(examples[summary.examples[i].name].linebylineSPL))
                        SPL.append(localexample)
                    }
                }
            }
            var printableimage = $("")
            if (typeof summary.printable_image != "undefined" && summary.printable_image != "" && summary.printable_image != null) {
                printableimage = $("<div class=\"donotbreak\" style=\"margin-top: 15px;\"><h2>Screenshot of Demo Data</h2></div>").append($('<img class="printonly" />').attr("src", Splunk.util.make_full_url(summary.printable_image)))

            }
            var linkToExample = "";
            if (typeof summary.dashboard != "undefined") {
                if (summary.dashboard == "ES_Use_Case" || summary.dashboard == "UBA_Use_Case" || summary.dashboard == "ESCU_Use_Case" || summary.dashboard == "PS_Use_Case") {
                    link = summary.dashboard + "?form.needed=stage" + summary.journey.split("|")[0].replace("Stage_", "") + "&showcase=" + summary.name;
                } else if (summary.channel === "custom") {
                    link = cleanLink(summary.dashboard, false);
                } else {
                    link = summary.dashboard;
                }
                linkToExample = '<a href="' + link + '" class="external drilldown-link" target="_blank"></a>';
            }
            $("#main_table_body").append("<tr class=\"titleRow\" data-showcaseId=\"" + summary.id + "\"  class=\"dvbanner\"><td class=\"tableexpand\" class=\"downarrow\" ><a href=\"#\" onclick=\"doToggle(this); return false;\"><i class=\"icon-chevron-right\" /></a></td><td class=\"name\"><div></div><a href=\"#\" onclick=\"doToggle(this); return false;\">" + summary.name + "</a></td><td style=\"text-align: center\">" + linkToExample + "</td>" + rowStatus + "</tr>")
            let summaryUI = await ProcessSummaryUI.GenerateShowcaseHTMLBodyAsync(summary, ShowcaseInfo, true);
            let description = summaryUI[0] + summaryUI[1]
            $("#main_table_body").append("<tr class=\"descriptionRow\" data-showcaseId=\"" + summary.id + "\"  style=\"display: none;\"><td colspan=\"10\">" + description + "</td></tr>")
            $("#bookmark_printable_table").append($("<div>").addClass("printable_section").attr("data-showcaseid", summary.id).append($("<h1 class=\"printable-showcase-name\">" + summary.name + "</h1><h2>Status</h2><p>" + status_display + "</p>" + "<h2>App</h2><p>" + summary.displayapp + "</p>" + $(description.replace(/display: none/g, "").replace(/reallyshow: none/, "display: none")).find("#contentDescription").html()), SPL, printableimage))
        })
}




function DownloadAllUseCases() {
    var myDownload = []
    var myCSV = ""
    var myHeader = ["Name", "Description", "Wish List Status"]
    for (var filterCount = 0; filterCount < allFilters.length; filterCount++) {
        if (typeof allFilters[filterCount].export != "undefined" && allFilters[filterCount].export == "yes")
            myHeader.push(allFilters[filterCount].displayName)

    }
    myDownload.push(myHeader)
    myCSV += myHeader.join(",") + "\n"
    for (var i = 0; i < ShowcaseInfo.roles.default.summaries.length; i++) {
        var row = ['"' + ShowcaseInfo.summaries[ShowcaseInfo.roles.default.summaries[i]]['name'].replace(/"/g, '""') + '"', '"' + ShowcaseInfo.summaries[ShowcaseInfo.roles.default.summaries[i]]['description'].replace(/"/g, '""').replace(/<br[^>]*>/g, " ") + '"']

        row.push('"' + BookmarkStatus[ShowcaseInfo.summaries[ShowcaseInfo.roles.default.summaries[i]]['bookmark_status']] + '"')
        for (var filterCount = 0; filterCount < allFilters.length; filterCount++) {
            if (typeof allFilters[filterCount].export != "undefined" && allFilters[filterCount].export == "yes") {
                var line = ShowcaseInfo.summaries[ShowcaseInfo.roles.default.summaries[i]][allFilters[filterCount].fieldName] || "";
                if (allFilters[filterCount].type == "search")
                    line = line.replace(/\|/g, ", ")
                if (typeof allFilters[filterCount].manipulateDisplay != "undefined")
                    line = allFilters[filterCount].manipulateDisplay(line)

                row.push('"' + line.replace(/"/g, '""') + '"')
            }
        }
        myDownload.push(row)
        myCSV += row.join(",") + "\n"
    }
    var filename = "Splunk_Security_Use_Cases.csv"

    var blob = new Blob([myCSV], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

$("#downloadUseCaseIcon").click(function() { DownloadAllUseCases(); return false; })

function updateDataSourceBlock() {
    var content = new Object()
    var fullcontent = new Object()

    // while we are here, let's also update all of those counts..
    $("text.single-result").text("0")

    for (var i = 0; i < ShowcaseInfo.roles.default.summaries.length; i++) {
        if (!ShowcaseInfo.summaries[ShowcaseInfo.roles.default.summaries[i]] || !ShowcaseInfo.summaries[ShowcaseInfo.roles.default.summaries[i]].datasource) {
            continue;
        }
        var sources = ShowcaseInfo.summaries[ShowcaseInfo.roles.default.summaries[i]].datasource.split(/\|/)
        for (var g = 0; g < sources.length; g++) {
            if (typeof content[sources[g]] == "undefined") {
                content[sources[g]] = $("<ul></ul>")
                fullcontent[sources[g]] = []
            }

            content[sources[g]].append("<li>" + ShowcaseInfo.summaries[ShowcaseInfo.roles.default.summaries[i]].name + "</li>")
            fullcontent[sources[g]].push(ShowcaseInfo.roles.default.summaries[i])
        }
        // while we are here, let's also update all of those counts..
        if (typeof ShowcaseInfo.summaries[ShowcaseInfo.roles.default.summaries[i]].isCustom != "undefined" && ShowcaseInfo.summaries[ShowcaseInfo.roles.default.summaries[i]].isCustom == true)
            $("#customSearches").find("text").text(parseInt($("#customSearches").find("text").text()) + 1)
        if ($("#" + ShowcaseInfo.summaries[ShowcaseInfo.roles.default.summaries[i]].bookmark_status).find("text").length > 0)
            $("#" + ShowcaseInfo.summaries[ShowcaseInfo.roles.default.summaries[i]].bookmark_status).find("text").text(parseInt($("#" + ShowcaseInfo.summaries[ShowcaseInfo.roles.default.summaries[i]].bookmark_status).find("text").text()) + 1)
    }
    //console.log("Full Content!", fullcontent)
    var contentlist = Object.keys(content).sort()
    var final = $("<div class=\"box-for-initial-data-source-boxes\"></div>")
    var tableversion = "<table class=\"table printonly table-chrome\" style=\"\"><thead><tr><th>Data Source</th><th>Use Cases</th><th>Categories</th><th>Description</th></tr></thead><tbody>"

    for (var i = 0; i < contentlist.length; i++) {
        final.append($('<div class="dataSourceBox" id="data-source-' + contentlist[i].replace(/[^a-zA-Z0-9]/g, "") + '" ></div>').append("<b>" + contentlist[i] + "</b>", content[contentlist[i]]))
        var description = fullcontent[contentlist[i]].length + " use cases selected"
        var usecaselist = new Object()
        var usecases = ""
        var categorylist = new Object()
        var categories = ""
        for (var g = 0; g < fullcontent[contentlist[i]].length; g++) {
            var localusecases = ShowcaseInfo.summaries[fullcontent[contentlist[i]][g]].usecase.split("|")
            var localcategories = ShowcaseInfo.summaries[fullcontent[contentlist[i]][g]].category.split("|")
            for (var h = 0; h < localusecases.length; h++) {
                usecaselist[localusecases[h]] = 1
            }
            for (var h = 0; h < localcategories.length; h++) {
                categorylist[localcategories[h]] = 1
            }

        }
        for (var g = 0; g < Object.keys(usecaselist).length; g++) {
            // console.log("Running full content with ", Object.keys(usecaselist)[g ])
            if (usecases != "")
                usecases += "<br />"
            if (typeof prettyDescriptions['usecase'][Object.keys(usecaselist)[g]] != "undefined")
                usecases += Object.keys(usecaselist)[g] + ": " + prettyDescriptions['usecase'][Object.keys(usecaselist)[g]]
            else
                usecases += Object.keys(usecaselist)[g]
        }
        for (var g = 0; g < Object.keys(categorylist).length; g++) {
            // console.log("Running full content with ", Object.keys(categorylist)[g ])
            if (categories != "")
                categories += ", "
            categories += Object.keys(categorylist)[g]
        }

        tableversion += "<tr><td>" + contentlist[i] + "</td><td>" + usecases + "</td><td>" + categories + "</td><td>" + description + "</td></tr>"
    }
    tableversion += "</tbody></table>"
    $("#dataSourcePanel").html($("<div></div>").append($("<div></div>").append($("<h2 class=\"printonly\">Data Sources Required</h2>")).append($(tableversion))).append($("<div style=\"break-inside: avoid;\"></div>").append($("<h2 class=\"printonly\" >Use Cases for Data Sources</h2>")).append($(final), $("<div class=\"box-for-data-source-boxes\"></div>"))))
    // console.log("Full Content table version", tableversion)

    function handleBoxLayout() {
        let max_height = 0;
        let objects = []
        let desired_layout_height = 200;
        // box-for-initial-data-source-boxes
        // box-for-data-source-boxes
        let numBoxes = $(".dataSourceBox").length
        for (let i = 0; i < numBoxes; i++) {
            let object = { "height": $($(".dataSourceBox")[i]).height(), "id": $($(".dataSourceBox")[i]).attr("id") }
            objects.push(object)
            if ($($(".dataSourceBox")[i]).height() > max_height) {
                max_height = $($(".dataSourceBox")[i]).height()
            }
        }
        let actual_max_height = Math.max(max_height, desired_layout_height);
        let columns = [$('<div class="data_source_column">')];
        let current_height_calculator = 0;

        for (let i = 0; i < numBoxes; i++) {
            let targetObject = $("#" + objects[i]['id']);
            if (current_height_calculator + targetObject.height() > actual_max_height) {
                columns.push($('<div class="data_source_column">'))
                current_height_calculator = 0;
            }
            current_height_calculator = current_height_calculator + targetObject.height();
            targetObject.detach().appendTo(columns[columns.length - 1])
        }
        for (let i = 0; i < columns.length; i++) {
            $(".box-for-data-source-boxes").append(columns[i])
        }
        //$(".dataSourceBox").css("min-width", "275px").css("width", Math.round(85 / columns.length) + "%")
        $(".data_source_column").css("min-width", "305px").css("width", Math.round(95 / columns.length) + "%")


        // Now to calculate the height


    }
    handleBoxLayout()
}

function doPrint() {

    window.print();
}


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

$.when(addingIndividualContent).then(function() {
    // console.log("I got this")

    var newElement = $("#row1").clone().attr("id", "intropage").addClass("printonly")
    newElement.find(".panel-body").html('<img src="' + Splunk.util.make_full_url("/static/app/Splunk_Security_Essentials/images/general_images/splunk_icon.png") + '" style="position: absolute; right: 10px; top: -40px; display: block;" /><div id="intropageblock" style="margin-top: 200px;"><h1>Summary of Bookmarked Content</h1><h2>Prepared ' + formatDate(new Date()) + '</h2><h2 style="margin-top: 200px;">Table of Contents</h3><ol><li>Use Case Overview</li><li>Data Sources</li><li>Use Cases for Data Sources</li><li>Content Detail<ul id="usecasetoc"></ul></li></ol> </div>')
    newElement.insertBefore("#row1")
    setTimeout(function() {
        $(".printable-showcase-name").each(function(count, obj) {

            $("#usecasetoc").append("<li>" + $(obj).html() + "</li>")
        })
    }, 1500)
    $("#row1").addClass("breakbeforethis")



})

$("#addBookmark").click(function() {
    addUseCase()
})

function addUseCase() {
    require([
        "json!" +
            $C["SPLUNKD_PATH"] +
            "/services/SSEShowcaseInfo?locale=" +
            window.localeString,
        "components/controls/BuildTile",
        Splunk.util.make_full_url(
            "/static/app/Splunk_Security_Essentials/vendor/lunr.js/lunr.js"
        ),
        "components/controls/Modal",
        "json!" +
            $C["SPLUNKD_PATH"] +
            "/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/bookmark_names",
        Splunk.util.make_full_url(
            "/static/app/Splunk_Security_Essentials/components/controls/ProcessSummaryUI.js"
        ),
    ], function (
        ShowcaseInfo,
        BuildTile,
        lunr,
        Modal,
        BookmarkStatus,
        ProcessSummaryUI
    ) {
        // console.log("Loading everything.. Here's a modal check", Modal);

        /* Standard Search Engine Init*/
        let documents = []
        let fields = Object.keys(window.searchEngineDefaults)
        for (let SummaryName in ShowcaseInfo["roles"]["default"]["summaries"]) {
            SummaryName =
                ShowcaseInfo["roles"]["default"]["summaries"][SummaryName]
            if (typeof ShowcaseInfo["summaries"][SummaryName] == "object") {
                let myobj = { id: SummaryName }
                for (let myfield in fields) {
                    myfield = fields[myfield]
                    if (
                        typeof ShowcaseInfo["summaries"][SummaryName][
                            myfield
                        ] != "undefined"
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

        // Now we initialize the Modal itself
        var myModal = new Modal(
            "addExisting",
            {
                title: "Bookmark Additional Content",
                backdrop: "static",
                keyboard: false,
                destroyOnHide: true,
            },
            $
        )

        $(myModal.$el)
            .addClass("modal-extra-wide")
            .on("show", function () {})
        let body = $("<div>")
        body.append(
            '<p>Please enter a search term below. The top 10 matches will then show up below. You can click the <i class="external drilldown-link" /> icon to open the content in a new tab to get more detail, or click anywhere else in the tile to select it.</p>'
        )

        var timeoutId = 0
        body.append(
            $(
                '<input id="searchBar" type="text" style="width: 300px" aria-label="Input" />'
            ).on("keyup", function (e) {
                var code = e.keyCode || e.which
                // if ($("#searchBar").val().length > 0 || (code > 47 && code < 58) || (code > 64 && code < 91) || (code > 96 && code < 123)) {
                //     $("#searchCloseIcon").css("visibility", "visible")
                // } else {
                //     $("#searchCloseIcon").css("visibility", "hidden")
                // }
                if (code == 13) {
                    clearTimeout(timeoutId)
                    doSearch()
                } else if ($("#searchBar").val().length >= 4) {
                    clearTimeout(timeoutId)
                    timeoutId = setTimeout(doSearch, 500)
                }
            })
        )
        body.append("<hr />")

        body.append('<p id="searchResultCount"></p>')

        body.append('<div id="searchResults"></div>')

        function doSearch() {
            var results = index.search($("#searchBar").val())
            // console.log("Here are my search results against '" + $("#searchBar").val() + "'", results)
            if (results.length > 10) {
                $("#searchResultCount").text(
                    "Showing 10 out of " + results.length + " results."
                )
            } else {
                $("#searchResultCount").text(
                    "Showing all " + results.length + " results."
                )
            }
            var tiles = $('<ul class="showcase-list"></ul>')

            for (var i = 0; i < results.length && i < 10; i++) {
                if (
                    typeof ShowcaseInfo["summaries"][results[i].ref] !=
                    "undefined"
                ) {
                    let tile = $(
                        BuildTile.build_tile(
                            ShowcaseInfo["summaries"][results[i].ref],
                            true
                        )
                    )
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
                            .find(".contentstile")
                            .attr("data-showcaseid")

                        if (target.prop("tagName") != "A") {
                            // let tile = target.closest("li")
                            // $(".showcase-list").find("li:active").removeClass("topSearchHit")
                            // $(".showcase-list").find("li").hide()
                            // tile.show()
                            // tile.addClass("topSearchHit")
                            $(".showcase-list").hide()
                            $("#searchResultCount").hide()
                            $("#searchResults").append(
                                $(
                                    '<p class="itemSelected" data-showcaseid="' +
                                        showcaseId +
                                        '">Selected: ' +
                                        ShowcaseInfo.summaries[showcaseId]
                                            .name +
                                        " </p>"
                                ).append(
                                    $(
                                        '<a href="#" class="icon-close" style="color: gray" />'
                                    ).click(function () {
                                        $(".itemSelected").remove()
                                        $(".showcase-list").show()
                                        $("#searchResultCount").show()
                                        $("#addBookmarkButton").attr(
                                            "disabled",
                                            "disabled"
                                        )
                                        $("#searchResults > select").remove()
                                    })
                                )
                            )

                            $("#searchResults").append(
                                $(
                                    '<select data-field="bookmark_status" class="   " title="" >\
                                <option value="none" selected>Not Bookmarked</option>\
                                <option value="bookmarked">Bookmarked</option>\
                                <option value="needData">Awaiting Data</option>\
                                <option value="inQueue">Ready for Deployment</option>\
                                <option value="issuesDeploying">Deployment Issues</option>\
                                <option value="needsTuning">Needs Tuning</option>\
                                <option value="successfullyImplemented">Successfully Implemented</option>\
                            </select>'
                                ).on("change", function (evt) {
                                    let newValue = $(evt.target).val()
                                    // console.log("Got a newValue", newValue);
                                    if (newValue == "none") {
                                        $("#addBookmarkButton").attr(
                                            "disabled",
                                            "disabled"
                                        )
                                    } else {
                                        $("#addBookmarkButton").removeAttr(
                                            "disabled"
                                        )
                                    }
                                })
                            )
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
                    tiles.append(
                        $(
                            '<li style="width: 230px; height: 320px"></li>'
                        ).append(tile)
                    )
                }
            }
            $("#searchResults").html(tiles)
            //for(my )
        }
        window.doSearch = doSearch
        window.index = index

        myModal.body.html(body)
        myModal.footer.append(
            $("<button>")
                .attr({
                    type: "button",
                    "data-dismiss": "modal",
                    "data-bs-dismiss": "modal",
                    "data-dismiss": "modal",
                })
                .addClass("btn btn-secondary")
                .text("Cancel")
                .on("click", function () {
                    // Not taking any action here
                }),
            $("<button>")
                .attr({
                    type: "button",
                })
                .addClass("btn btn-primary")
                .attr("id", "addBookmarkButton")
                .attr("disabled", "disabled")
                .text("Add")
                .on("click", async function () {
                    let showcaseId = $("p.itemSelected").attr("data-showcaseid")
                    let showcaseName = ShowcaseInfo.summaries[showcaseId].name
                    let status = $("select[data-field=bookmark_status]").val()
                    // console.log("Adding New Bookmark", showcaseId, showcaseName, status)
                    let NEW_BOOKMARK = false
                    if (
                        ShowcaseInfo.summaries[showcaseId].bookmark_status ==
                        "none"
                    ) {
                        NEW_BOOKMARK = true
                    }
                    ShowcaseInfo.summaries[showcaseId].bookmark_status = status
                    ShowcaseInfo.summaries[showcaseId].bookmark_status_display =
                        BookmarkStatus[status]
                    if (NEW_BOOKMARK) {
                        await ProcessSummaryUI.addItemBM_async(
                            $,
                            ShowcaseInfo,
                            ShowcaseInfo.summaries[showcaseId]
                        )
                    } else {
                        $(
                            "input[data-showcaseid='" +
                                showcaseId +
                                "'][data-status='" +
                                status +
                                "']"
                        ).click()
                    }
                    window.ShowcaseInfo.summaries[showcaseId] =
                        ShowcaseInfo.summaries[showcaseId]
                    window.ShowcaseInfo.roles.default.summaries.push(showcaseId)
                    updateDataSourceBlock()
                    setbookmark_status(showcaseName, showcaseId, status, "")
                    $("[data-bs-dismiss=modal").click()
                })
        )
        myModal.show() // Launch it!
    })
}


function loadSPL() {
    $.ajax({
        url: Splunk.util.make_full_url('/static/app/Splunk_Security_Essentials/components/data/sampleSearches/showcase_simple_search.json'),
        async: true,
        success: function(returneddata) {
            var objects = Object.keys(returneddata)
            for (var i = 0; i < objects.length; i++) {
                examples[objects[i]] = returneddata[objects[i]]
                examples[objects[i]].file = "showcase_simple_search"
                examples[objects[i]].searchString = examples[objects[i]].value
                examples[objects[i]].linebylineSPL = "<pre>" + examples[objects[i]].searchString + "</pre>"
                var linebylineSPL = examples[objects[i]].searchString.split(/\n/)
                if (typeof examples[objects[i]].description != "undefined" && linebylineSPL.length > 0) {
                    var myTable = "<table class=\"linebylinespl\">"
                    for (var g = 0; g < linebylineSPL.length; g++) {
                        myTable += "<tr>" + '<td class="splside">' + linebylineSPL[g] + '</td>' + '<td class="docside">' + (examples[objects[i]].description[g] || "") + '</td></tr>'
                    }
                    myTable += "</table>"
                    examples[objects[i]].linebylineSPL = myTable
                }
            }
        }
    });
    $.ajax({
        url: Splunk.util.make_full_url('/static/app/Splunk_Security_Essentials/components/data/sampleSearches/showcase_standard_deviation.json'),
        async: true,
        success: function(returneddata) {
            var objects = Object.keys(returneddata)
            for (var i = 0; i < objects.length; i++) {
                examples[objects[i]] = returneddata[objects[i]]
                examples[objects[i]].file = "showcase_standard_deviation"
                examples[objects[i]].searchString = examples[objects[i]].value + '\n| stats count as num_data_samples max(eval(if(_time >= relative_time(now(), "-1d@d"), \'$outlierVariableToken$\',null))) as \'$outlierVariableToken$\' avg(eval(if(_time<relative_time(now(),"-1d@d"),\'$outlierVariableToken$\',null))) as avg stdev(eval(if(_time<relative_time(now(),"-1d@d"),\'$outlierVariableToken$\',null))) as stdev by \'$outlierVariableSubjectToken$\' \n| eval upperBound=(avg+stdev*$scaleFactorToken$) \n | where \'$outlierVariableToken$\' > upperBound'
                examples[objects[i]].searchString = examples[objects[i]].searchString.replace(/\$outlierVariableToken\$/g, examples[objects[i]].outlierVariable).replace(/\$outlierVariableSubjectToken\$/g, examples[objects[i]].outlierVariableSubject).replace(/\$scaleFactorToken\$/g, examples[objects[i]].scaleFactor).replace(/\</g, "&lt;").replace(/\>/g, "&gt;").replace(/\n\s*/g, "\n")
                examples[objects[i]].linebylineSPL = "<pre>" + examples[objects[i]].searchString + "</pre>"
                var linebylineSPL = examples[objects[i]].searchString.split(/\n/)
                if (typeof examples[objects[i]].description != "undefined" && linebylineSPL.length > 0) {
                    examples[objects[i]].description.push("calculate the mean, standard deviation and most recent value", "Calculate the upper boundary (X standard deviations above the average)", "Filter where where the most recent result is above the upper boundary")
                    var myTable = "<table class=\"linebylinespl\">"
                    for (var g = 0; g < linebylineSPL.length; g++) {
                        myTable += "<tr>" + '<td class="splside">' + linebylineSPL[g] + '</td>' + '<td class="docside">' + (examples[objects[i]].description[g] || "") + '</td></tr>'
                    }
                    myTable += "</table>"
                    examples[objects[i]].linebylineSPL = myTable
                }



            }
        }
    });

    $.ajax({
        url: Splunk.util.make_full_url('/static/app/Splunk_Security_Essentials/components/data/sampleSearches/showcase_first_seen_demo.json'),
        async: true,
        success: function(returneddata) {
            var objects = Object.keys(returneddata)
            for (var i = 0; i < objects.length; i++) {
                examples[objects[i]] = returneddata[objects[i]]
                examples[objects[i]].file = "showcase_first_seen_demo"
                examples[objects[i]].searchString = examples[objects[i]].value + '\n| stats earliest(_time) as earliest latest(_time) as latest  by $outlierValueTracked1Token$, $outlierValueTracked2Token$ \n| where earliest >= relative_time(now(), \"-1d@d\")'
                examples[objects[i]].searchString = examples[objects[i]].searchString.replace(/\$outlierValueTracked1Token\$/g, examples[objects[i]].outlierValueTracked1).replace(/\$outlierValueTracked2Token\$/g, examples[objects[i]].outlierValueTracked2).replace(/\</g, "&lt;").replace(/\>/g, "&gt;").replace(/\n\s*/g, "\n")
                examples[objects[i]].linebylineSPL = "<pre>" + examples[objects[i]].searchString + "</pre>"
                var linebylineSPL = examples[objects[i]].searchString.split(/\n/)
                if (typeof examples[objects[i]].description != "undefined" && linebylineSPL.length > 0) {
                    examples[objects[i]].description.push("Here we use the stats command to calculate what the earliest and the latest time is that we have seen this combination of fields.", "Now we look to see if the earliest time we saw this event was in the last day (aka, brand new).")
                    var myTable = "<table class=\"linebylinespl\">"
                    for (var g = 0; g < linebylineSPL.length; g++) {
                        myTable += "<tr>" + '<td class="splside">' + linebylineSPL[g] + '</td>' + '<td class="docside">' + (examples[objects[i]].description[g] || "") + '</td></tr>'
                    }
                    examples[objects[i]].linebylineSPL = myTable
                    myTable += "</table>"
                    //     console.log("I got this:", examples[objects[i]].linebylineSPL)
                }
            }
        }
    });
}


function checkForOutOfDateBookmarkConfig(fullShowcaseInfo) {
    require([
        'components/controls/Modal'], function(Modal) {

            var bookmarkItems = []
            $.ajax({ url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/bookmark', async: false, success: function(returneddata) { bookmarkItems = returneddata } });

            let showcaseItems = new Object();
            for (var i = 0; i < bookmarkItems.length; i++) {
                showcaseItems[bookmarkItems[i].showcase_name] = bookmarkItems[i]
            }

            // Start code to update old Showcase Name to ShowcaseId to accommodate internationalization
            let bookmarksNeedingCorrection = {};
            for (let i = 0; i < bookmarkItems.length; i++) {
                // console.log("Looking at bookmark", bookmarkItems[i])
                if (fullShowcaseInfo['roles']['default']['summaries'].indexOf(bookmarkItems[i]['_key']) == -1) {
                    for (let SummaryName in fullShowcaseInfo['summaries']) {
                        if (fullShowcaseInfo['summaries'][SummaryName]['name'] == bookmarkItems[i]['showcase_name']) {
                            bookmarksNeedingCorrection[bookmarkItems[i]['showcase_name']] = SummaryName;
                        }
                    }
                }
            }

            if (Object.keys(bookmarksNeedingCorrection).length > 0) {
                // console.log("We found bookmarks needing correction", Object.keys(bookmarksNeedingCorrection).length);

                let myModal = new Modal('fixBookmarks', {
                    title: 'Update Bookmarks',
                    destroyOnHide: true
                }, $);
                myModal.body.append($('<p>We have updated the schema for bookmarks and found older format bookmarks in your environment. We are updating those now...</p>'), $('<div id="bookmarkStatus">Processing...</div>'))

                $(myModal.$el).on("shown.bs.modal", function() {
                    // console.log("Modal Shown");
                    let newBookmarkKVStore = {};
                    for (let displayName in bookmarksNeedingCorrection) {
                        let bookmark = showcaseItems[displayName]
                        newBookmarkKVStore[bookmarksNeedingCorrection[displayName]] = {
                            _key: bookmarksNeedingCorrection[displayName],
                            showcase_name: bookmark.showcase_name,
                            status: bookmark.status,
                            user: bookmark.user,
                            _time: bookmark['_time']
                        }
                    }
                    for (let i = 0; i < bookmarkItems.length; i++) {
                        // console.log("Round Two Looking at bookmark", bookmarkItems[i])
                        if (fullShowcaseInfo['roles']['default']['summaries'].indexOf(bookmarkItems[i]['_key']) >= 0) {
                            let bookmark = bookmarkItems[i]
                            newBookmarkKVStore[bookmarkItems[i]['_key']] = {
                                _key: bookmarkItems[i]['_key'],
                                showcase_name: bookmark.showcase_name,
                                status: bookmark.status,
                                user: bookmark.user,
                                _time: bookmark['_time']
                            }
                        }
                    }

                    $.ajax({
                        url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/bookmark',
                        type: 'DELETE',
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest',
                            'X-Splunk-Form-Key': window.getFormKey(),
                        },
                        async: true,
                        success: function(returneddata) {
                            let ListOfDeferrals = [];
                            for (let obj in newBookmarkKVStore) {
                                let myLocalDeferral = $.Deferred();
                                $.ajax({
                                    url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/bookmark/',
                                    type: 'POST',
                                    headers: {
                                        'X-Requested-With': 'XMLHttpRequest',
                                        'X-Splunk-Form-Key': window.getFormKey(),
                                    },
                                    contentType: "application/json",
                                    async: true,
                                    data: JSON.stringify(newBookmarkKVStore[obj]),
                                    success: function(returneddata) { bustCache(); myLocalDeferral.resolve(true) },
                                    error: function(xhr, textStatus, error) {
                                        myLocalDeferral.resolve(false)
                                    }
                                })
                                ListOfDeferrals.push(myLocalDeferral);
                            }
                            $.when.apply($, ListOfDeferrals).then(function() {
                                let allTrue = true;
                                for (let i = 0; i < arguments; i++) {
                                    // console.log("Arg: ", arguments[i])
                                    if (arguments[i] != true) {
                                        allTrue = false;
                                    }
                                }
                                $("#bookmarkStatus").attr("data-complete", "success").html("<p>Bookmarks have updated. This page will reload when you close this window.</p>")

                                $("#fixBookmarks").modal().on("hide", function() {
                                    location.reload()
                                })
                                $("#buttonSchemaRefresh").removeAttr("disabled")
                                $("#buttonSchemaCancel").remove()

                            })
                        },
                        error: function(xhr, textStatus, error) {

                            $("#bookmarkStatus").attr("data-complete", "error").html("<p>Bookmark update failed. Please reach out to <a href=\"mailto:sse@splunk.com\">sse@splunk.com</a> for assistance.</p>")
                            $("#buttonSchemaCancel").removeAttr("disabled")
                            $("#buttonSchemaRefresh").remove()

                        }
                    })

                })

                myModal.footer.append($('<button>').attr({
                    type: 'button',
                    'data-dismiss': 'modal',
                    'data-bs-dismiss': 'modal'
                }).addClass('btn ').attr("id", "buttonSchemaCancel").attr("disabled", "disabled").text('Cancel').on('click', function() {

                }), $('<button>').attr({
                    type: 'button',
                    'data-dismiss': 'modal',
                    'data-bs-dismiss': 'modal'
                }).addClass('btn btn-primary').attr("id", "buttonSchemaRefresh").attr("disabled", "disabled").text('Refresh').on('click', function() {

                }))
                setTimeout(function() {
                    if (!$("#bookmarkStatus").attr("data-complete")) {
                        $("#buttonSchemaCancel").removeAttr("disabled")
                        $("#bookmarkStatus").html("<h2>Error: Timeout</h2><p>This shouldn't occur. Please reach out to <a href=\"mailto:sse@splunk.com\">sse@splunk.com</a> for assistance.</p>")
                    }
                }, 10000)
                myModal.show()
            }

        })
}



//# sourceURL=bookmarked_content.js