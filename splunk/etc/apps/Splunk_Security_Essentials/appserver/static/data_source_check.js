"use strict"
var hexMapping = {}

function toHex(str) {
    //http://forums.devshed.com/javascript-development-115/convert-string-hex-674138.html
    for (const [key, value] of Object.entries(hexMapping)) {
        if (value === str) {
            return key
        }
    }
    var hex = ""
    for (var i = 0; i < str.length; i++) {
        hex += "" + str.charCodeAt(i).toString(16)
    }
    hexMapping[hex] = str
    return hex
}

function fromHex(hexx) {
    let str = hexMapping[hexx]
    //https://stackoverflow.com/questions/3745666/how-to-convert-from-hex-to-ascii-in-javascript
    if (!str) {
        console.log("not found in cache")
        var hex = hexx.toString() //force conversion
        str = ""
        for (var i = 0; i < hex.length && hex.substr(i, 2) !== "00"; i += 2) {
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16))
        }

        console.log("not found in cache", str)
    }
    return str
}

var threshold = 5
var retryCount = 0

function checkRemainingItems(itemList) {
    console.log("From checkRemainingItems, itemList ===> ", itemList.length)
    if (itemList.length > 0) {
        let stillRemainingList = []
        for (const item of itemList) {
            let isChecked = checkItem(item)
            if (!isChecked) {
                console.log("Item is not checked ===> ", item)
                console.log(
                    "stillRemainingList before push ===> ",
                    stillRemainingList
                )
                stillRemainingList.push(item)
                console.log(
                    "stillRemainingList after push ===> ",
                    stillRemainingList
                )
            }
        }

        if (stillRemainingList.length <= 0) {
            setTimeout(() => {
                RecordStatusOfPreCheck()
            }, 10000)
        }
        return stillRemainingList
    } else {
        setTimeout(() => {
            RecordStatusOfPreCheck()
        }, 5000)

        return []
    }
}

window.NumSearchesSelected = 0

function trigger_clicked(str) {
    if (document.getElementById("checkbox_" + str).checked) {
        window.NumSearchesSelected += 1
    } else {
        window.NumSearchesSelected -= 1
    }
    $("#NumSearches").text(window.NumSearchesSelected)
}

window.SearchesInProgress = []
window.SearchesInQueue = []
window.SearchesComplete = []
window.Viz = []
localStorage["splunk-security-essentials-maxconcurrentsearches"] =
    localStorage["splunk-security-essentials-maxconcurrentsearches"] || 5
window.hasAnyEverRun = false
window.inferences = {}
window.publishedInferences = {}

function Modal() {
    require(["underscore"], function (_) {
        var _createClass = (function () {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i]
                    descriptor.enumerable = descriptor.enumerable || false
                    descriptor.configurable = true
                    if ("value" in descriptor) descriptor.writable = true
                    Object.defineProperty(target, descriptor.key, descriptor)
                }
            }

            return function (Constructor, protoProps, staticProps) {
                if (protoProps)
                    defineProperties(Constructor.prototype, protoProps)
                if (staticProps) defineProperties(Constructor, staticProps)
                return Constructor
            }
        })()

        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function")
            }
        }

        function Modal(id, options) {
            var _this = this

            _classCallCheck(this, Modal)

            var modalOptions = _.extend({ show: false }, options)

            // if "id" is the element that triggers the modal display, extract the actual id from it; otherwise use it as-is
            var modalId = id //!= null && (typeof id === 'undefined' ? 'undefined' : _typeof(id)) === 'object' && id.jquery != null ? id.attr('data-target').slice(1) : id;

            var header = $("<div>").addClass("modal-header")

            var headerCloseButton = $("<button>")
                .addClass("close")
                .attr({
                    type: "button",
                    "data-dismiss": "modal",
                    "data-bs-dismiss": "modal",
                    "aria-label": "Close",
                })
                .append($("<span>").attr("aria-hidden", true).text("&times;"))

            this.title = $("<h3>").addClass("modal-title")

            this.body = $("<div>").addClass("modal-body")

            this.footer = $("<div>").addClass("modal-footer")

            this.$el = $("<div>")
                .addClass("modal mlts-modal")
                .attr("id", modalId)
                .append(
                    $("<div>")
                        .addClass("modal-dialog")
                        .append(
                            $("<div>")
                                .addClass("modal-content")
                                .append(
                                    header.append(
                                        headerCloseButton,
                                        this.title
                                    ),
                                    this.body,
                                    this.footer
                                )
                        )
                )

            if (modalOptions.title != null) this.setTitle(modalOptions.title)

            if (modalOptions.type === "wide") {
                this.$el.addClass("modal-wide")
            } else if (modalOptions.type === "noPadding")
                this.$el.addClass("mlts-modal-no-padding")

            // remove the modal from the dom after it's hidden
            if (modalOptions.destroyOnHide !== false) {
                this.$el.on("hidden.bs.modal", function () {
                    return _this.$el.remove()
                })
            }

            this.$el.modal(modalOptions)
        }

        _createClass(Modal, [
            {
                key: "setTitle",
                value: function setTitle(titleText) {
                    this.title.text(titleText)
                },
            },
            {
                key: "show",
                value: function show() {
                    this.$el.modal("show")
                },
            },
            {
                key: "hide",
                value: function hide() {
                    this.$el.modal("hide")
                },
            },
        ])
        window.Modal = Modal
        return Modal
    })
}

require([
    "jquery",
    "underscore",
    "splunkjs/mvc",
    "splunkjs/mvc/utils",
    "splunkjs/mvc/tokenutils",
    "splunkjs/mvc/simplexml",
    "splunkjs/mvc/searchmanager",
    "splunkjs/ready!",
    "vendor/bootstrap/bootstrap.bundle",
    "css!../app/Splunk_Security_Essentials/style/data_source_check.css",
    "css!../app/Splunk_Security_Essentials/style/app.css",
], function (
    $,
    _,
    mvc,
    utils,
    TokenUtils,
    DashboardController,
    SearchManager,
    //AlertModal,
    // Modal,
    Ready //,
    //ShowcaseInfo
) {
    function KickItOff() {
        //window.SearchesInQueue = ["7c2072657374202f73657276696365732f617070732f6c6f63616c207c207365617263682064697361626c65643d30206c6162656c3d2255524c20546f6f6c626f7822207c20737461747320636f756e74"]
        $("#pullKVStoreButton").remove()
        for (var item in window.datacheck) {
            if (item.indexOf("-") == -1 && item.indexOf("t") == -1) {
                $("#" + item).html(
                    '<img title="Loading" src="' +
                        Splunk.util.make_full_url(
                            "/static//app/Splunk_Security_Essentials/images/general_images/loader.gif"
                        ) +
                        '">'
                )
                //          console.log("Loading...", item)
            }
        }
        $(".tableaccel:not(:first)").each(function (num, element) {
            if ($(element).find("img").length == 0) {
                $(element).html(
                    '<p class="dvPopover" href="" data-bs-toggle="popover" title="Not Applicable" data-bs-trigger="hover" data-bs-content="We do not currently have a search that leverages the accelerated data.">' +
                        '<span style="color: black;" title="Not Applicable (no search present)">N/A</span>' +
                        "</p>"
                )
                $(element).find("p").popover({
                    html: true,
                    trigger: "hover",
                })
            }
        })
        $("#percContainer").css("height", "15px")
        $("#percContainer").css("display", "inline-block")
        //$("#KickItOffButton").attr("disabled", true)
        setTimeout(function () {
            $("#KickItOffButton").unbind("click")
            $("#KickItOffButton").html(
                '<i class="icon-cancel"></i> Cancel Searches'
            )
            $("#KickItOffButton").click(function () {
                FinalizeSearches()
                $("#KickItOffButton").attr("disabled", true)
            })
        }, 2500)
        ProcessSearchQueue()
    }

    $(".fieldset")
        .first()
        .html(
            '<div style="width: 70%; display: inline-block; float:left;"><p>Select "Start Searches", to launch about sixty searches in order to verify if the data sources exist for examples in Splunk Security Essentials. <br />After you verify that your data sources exist, select “Create Posture Dashboards" to see a basic overview of host, account, and network security for the data sources found.</p></div><div style="width: 30%; display: inline-block; float:right; text-align:center; vertical-align: center;"><button type="button" id="KickItOffButton" class="btn btn-primary"><i class="icon-play"></i> Start Searches</button><div id="placeholderForRestore"></div><button id="CreateDashboardsButton" class="btn">Create Posture Dashboards</button></div>'
        )

    $("#CreateDashboardsButton").click(function () {
        GenerateDashboardModals()
    })
    $("#KickItOffButton").click(function () {
        KickItOff()
    })
    var HTMLBlock = ""
    var unsubmittedTokens = mvc.Components.getInstance("default")
    var submittedTokens = mvc.Components.getInstance("submitted")
    var myDataset = "No dataset provided"

    window.datacheck = []
    var items = new Object()
    appName = "Splunk_Security_Essentials"
    $.getJSON(
        "/static/app/Splunk_Security_Essentials/components/data/sampleSearches/showcase_first_seen_demo.json",
        function (data) {
            items = Object.assign(items, data)
        }
    )
    $.getJSON(
        "/static/app/Splunk_Security_Essentials/components/data/sampleSearches/showcase_standard_deviation.json",
        function (data) {
            items = Object.assign(items, data)
        }
    )
    $.getJSON(
        "/static/app/Splunk_Security_Essentials/components/data/sampleSearches/showcase_simple_search.json",
        function (data) {
            items = Object.assign(items, data)
        }
    )

    ShowcaseInfo = ""
    $("#main_content").append(
        '<table style="" id="main_table" class="table table-chrome" ><thead><tr class="dvbanner"><th style="width: 20px;" class="tableexpand"><i class="icon-info"></i></th><th>Example Content</th><th class="tabledemo">Demo Data</th><th class="tablelive">Live Data</th><th class="tableaccel">Accelerated Data</th></th></thead><tbody id="main_table_body"></tbody></table>'
    )
    $.getJSON(
        $C["SPLUNKD_PATH"] +
            "/services/SSEShowcaseInfo?locale=" +
            window.localeString,
        function (data) {
            for (let summary in data.summaries) {
                if (data.summaries[summary].split_multiple_examples) {
                    for (
                        let i = 0;
                        i < data.summaries[summary].examples.length;
                        i++
                    ) {
                        if (
                            data.summaries[summary].examples[i]
                                .live_split_eligible
                        ) {
                            let newId =
                                data.summaries[summary].id + "_VERSION" + i
                            let newSummary = JSON.parse(
                                JSON.stringify(data.summaries[summary])
                            )
                            newSummary.name +=
                                " (" +
                                data.summaries[summary].examples[i].label +
                                ")"
                            newSummary.id = newId
                            for (
                                let g = 0;
                                g < newSummary.examples.length;
                                g++
                            ) {
                                if (newSummary.examples[g].is_live_version) {
                                    delete newSummary.examples[g]
                                        .is_live_version
                                }
                            }
                            newSummary.examples[i].is_live_version = true
                            newSummary.dashboard = newSummary.dashboard.replace(
                                /dataset=.*/,
                                "dataset=" + newSummary.examples[i].name
                            )
                            data.summaries[newId] = newSummary
                            data.roles.default.summaries.push(newId)
                        }
                    }
                    delete data.summaries[summary]
                    data.roles.default.summaries.splice(
                        data.roles.default.summaries.indexOf(summary),
                        1
                    )
                }
            }
            for (let summary in data.summaries) {
                if (data.summaries[summary].examples) {
                    for (
                        let i = 0;
                        i < data.summaries[summary].examples.length;
                        i++
                    ) {
                        if (
                            data.summaries[summary].examples[i].is_live_version
                        ) {
                            data.summaries[summary].examples[i].label =
                                "Live Data"
                        }
                    }
                }
            }
            var ShowcaseInfo = data
            window.ShowcaseInfo = ShowcaseInfo

            window.Searches = items
            window.SearchToShowcase = new Object()

            /*
                            var showcaseSummaries = ShowcaseInfo.summaries;

                            ShowcaseInfo.summaries.sort(function(a, b){

                                if(showcaseSummaries[a].name < showcaseSummaries[b].name) return -1;
                                if(showcaseSummaries[a].name > showcaseSummaries[b].name) return 1;
                                return 0;
                            })
                            */

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
                summary_name = ShowcaseInfo.roles.default.summaries[i]
                // console.log("Processing summary", summary)

                dashboardname = summary.dashboard
                if (dashboardname.indexOf("?") > 0) {
                    dashboardname = dashboardname.substr(
                        0,
                        dashboardname.indexOf("?")
                    )
                }
                example = undefined
                if (summary.dashboard.indexOf("=") > 0) {
                    example = summary.dashboard
                        .substr(summary.dashboard.indexOf("=") + 1)
                        .replace(/ \-.*/, "")
                }
                // console.log("Using summary", example, summary)
                //panelStart = "<div id=\"rowDescription\" class=\"dashboard-row dashboard-rowDescription splunk-view\">        <div id=\"panelDescription\" class=\"dashboard-cell last-visible splunk-view\" style=\"width: 100%;\">            <div class=\"dashboard-panel clearfix\" style=\"min-height: 0px;\"><h2 class=\"panel-title empty\"></h2><div id=\"view_description\" class=\"fieldset splunk-view editable hide-label hidden empty\"></div>                                <div class=\"panel-element-row\">                    <div id=\"elementdescription\" class=\"dashboard-element html splunk-view\" style=\"width: 100%;\">                        <div class=\"panel-body html\"> <div id=\"contentDescription\"> "
                //panelEnd =  "</div></div>                    </div>                </div>            </div>        </div>    </div>"
                var demo = ""
                var live = ""
                var accel = ""
                if (typeof example != "undefined") {
                    exampleText = ""
                    exampleList = $("<span></span>")
                    //console.log("ShowcaseInfo: New Title", document.title)
                    if (typeof summary.examples != "undefined") {
                        exampleText =
                            summary.examples.length > 1
                                ? "<b>Examples:</b>"
                                : "<b>Example:</b>"
                        exampleList = $('<ul class="example-list"></ul>')

                        summary.examples.forEach(function (example) {
                            var showcaseURLDefault = summary.dashboard
                            if (summary.dashboard.indexOf("?") > 0) {
                                showcaseURLDefault = summary.dashboard.substr(
                                    0,
                                    summary.dashboard.indexOf("?")
                                )
                            }

                            var url =
                                showcaseURLDefault +
                                "?ml_toolkit.dataset=" +
                                example.name
                            window.SearchToShowcase[example.name] = summary_name
                            window.SearchToShowcase[
                                example.name.replace(/ \- .*/, "")
                            ] = summary_name
                            if (example.label == "Demo Data") {
                                demo = example.name
                            }
                            if (example.label == "Live Data") {
                                live = example.name
                            }
                            if (example.label == "Accelerated Data") {
                                accel = example.name
                            }
                            //exampleList.append($('<li></li>').text(example.label));
                            exampleList.append(
                                $("<li></li>").append(
                                    $("<a></a>")
                                        .attr("href", url)
                                        .attr("target", "_blank")
                                        .attr(
                                            "class",
                                            "external drilldown-link"
                                        )
                                        .append(example.label)
                                )
                            )
                        })
                    }
                    if (
                        summary.description.match(
                            /<b>\s*Alert Volume:*\s*<\/b>:*\s*Very Low/
                        )
                    ) {
                        summary.description = summary.description.replace(
                            /<b>\s*Alert Volume:*\s*<\/b>:*\s*Very Low/,
                            '<b>Alert Volume:</b> Very Low <a class="dvPopover" id="alertVolumetooltip" href="" title="Alert Volume: Very Low" data-placement="right" data-bs-toggle="popover" data-bs-trigger="hover" data-bs-content="An alert volume of Very Low indicates that a typical environment will rarely see alerts from this search, maybe after a brief period of tuning. This search should trigger infrequently enough that you could send it directly to the SOC as an alert, although you should also send it into a data-analysis based threat detection solution, such as Splunk UBA (or as a starting point, Splunk ES\'s Risk Framework)">(?)</a>'
                        )
                    } else if (
                        summary.description.match(
                            /<b>\s*Alert Volume:*\s*<\/b>:*\s*Low/
                        )
                    ) {
                        summary.description = summary.description.replace(
                            /<b>\s*Alert Volume:*\s*<\/b>:*\s*Low/,
                            '<b>Alert Volume:</b> Low <a class="dvPopover" id="alertVolumetooltip" href="" title="Alert Volume: Low" data-bs-placement="right" data-bs-toggle="popover" data-bs-trigger="hover" data-bs-content="An alert volume of Low indicates that a typical environment will occasionally see alerts from this search -- probably 0-1 alerts per week, maybe after a brief period of tuning. This search should trigger infrequently enough that you could send it directly to the SOC as an alert if you decide it is relevant to your risk profile, although you should also send it into a data-analysis based threat detection solution, such as Splunk UBA (or as a starting point, Splunk ES\'s Risk Framework)">(?)</a>'
                        )
                    } else if (
                        summary.description.match(
                            /<b>\s*Alert Volume:*\s*<\/b>:*\s*Medium/
                        )
                    ) {
                        summary.description = summary.description.replace(
                            /<b>\s*Alert Volume:*\s*<\/b>:*\s*Medium/,
                            '<b>Alert Volume:</b> Medium <a class="dvPopover" id="alertVolumetooltip" href="" title="Alert Volume: Medium" data-bs-placement="right" data-bs-toggle="popover" data-bs-trigger="hover" data-bs-content="An alert volume of Medium indicates that you\'re likely to see one to two alerts per day in a typical organization, though this can vary substantially from one organization to another. It is recommended that you feed these to an anomaly aggregation technology, such as Splunk UBA (or as a starting point, Splunk ES\'s Risk Framework)">(?)</a>'
                        )
                    } else if (
                        summary.description.match(
                            /<b>\s*Alert Volume:*\s*<\/b>:*\s*High/
                        )
                    ) {
                        summary.description = summary.description.replace(
                            /<b>\s*Alert Volume:*\s*<\/b>:*\s*High/,
                            '<b>Alert Volume:</b> High <a class="dvPopover" id="alertVolumetooltip" href="" title="Alert Volume: High" data-bs-placement="right" data-bs-toggle="popover" data-bs-trigger="hover" data-bs-content="An alert volume of High indicates that you\'re likely to see several alerts per day in a typical organization, though this can vary substantially from one organization to another. It is highly recommended that you feed these to an anomaly aggregation technology, such as Splunk UBA (or as a starting point, Splunk ES\'s Risk Framework)">(?)</a>'
                        )
                    } else if (
                        summary.description.match(
                            /<b>\s*Alert Volume:*\s*<\/b>:*\s*Very High/
                        )
                    ) {
                        summary.description = summary.description.replace(
                            /<b>\s*Alert Volume:*\s*<\/b>:*\s*Very High/,
                            '<b>Alert Volume:</b> Very High <a class="dvPopover" id="alertVolumetooltip" href="" title="Alert Volume: Very High" data-bs-placement="right" data-bs-toggle="popover" data-bs-trigger="hover" data-bs-content="An alert volume of Very High indicates that you\'re likely to see many alerts per day in a typical organization. You need a well thought out high volume indicator search to get value from this alert volume. Splunk ES\'s Risk Framework is a starting point, but is probably insufficient given how common these events are. IT is highly recommended that you either build correlation searches based on the output of this search, or leverage Splunk UBA with it\'s threat models to surface the high risk indicators.">(?)</a>'
                        )
                    } else {
                        summary.description = summary.description.replace(
                            /(<b>\s*Alert Volume:.*?)(?:<\/p>)/,
                            '$1 <a class="dvPopover" id="alertVolumetooltip" href="" title="Alert Volume" data-bs-placement="right" data-bs-toggle="popover" data-bs-trigger="hover" data-bs-content="The alert volume indicates how often a typical organization can expect this search to fire. On the Very Low / Low side, alerts should be rare enough to even send these events directly to the SIEM for review. Oh the High / Very High side, your SOC would be buried under the volume, and you must send the events only to an anomaly aggregation and threat detection solution, such as Splunk UBA (or for a partial solution, Splunk ES\'s risk framework). To that end, *all* alerts, regardless of alert volume, should be sent to that anomaly aggregation and threat detection solution. More data, more indicators, should make these capabilites stronger, and make your organization more secure.">(?)</a>'
                        )
                    }
                    var per_instance_help = summary.help
                        ? "<p><h3>" +
                          summary.name +
                          " Help</h3></p>" +
                          summary.help
                        : ""

                    if ((dashboardname = "showcase_first_seen_demo")) {
                    } else if (
                        (dashboardname = "showcase_standard_deviation")
                    ) {
                    } else if ((dashboardname = "showcase_simple_search")) {
                    }
                    var demodisplay = ""
                    var livedisplay = ""
                    var acceldisplay = ""
                    if (
                        demo != "" &&
                        typeof items[demo] != "undefined" &&
                        typeof items[demo].prereqs == "object"
                    ) {
                        //demodisplay="<img style=\"height:22px; width:20px;\" src=\"" + Splunk.util.make_full_url("/static/app/Splunk_Security_Essentials/images/general_images/loader.gif") + "\">"
                    }
                    if (
                        live != "" &&
                        typeof items[live] != "undefined" &&
                        typeof items[live].prereqs == "object"
                    ) {
                        //livedisplay="<img style=\"height:22px; width:20px;\" src=\"" + Splunk.util.make_full_url("/static/app/Splunk_Security_Essentials/images/general_images/loader.gif") + "\">"
                    }
                    if (
                        accel != "" &&
                        typeof items[accel] != "undefined" &&
                        typeof items[accel].prereqs == "object"
                    ) {
                        //acceldisplay="<img style=\"height:22px; width:20px;\" src=\"" + Splunk.util.make_full_url("/static/app/Splunk_Security_Essentials/images/general_images/loader.gif") + "\">"
                    }

                    relevance = summary.relevance
                        ? "<p><b>Security Impact:</b> <br />" +
                          summary.relevance +
                          "</p>"
                        : ""

                    if (
                        (demo != "" &&
                            typeof items[demo] != "undefined" &&
                            typeof items[demo].prereqs == "object") ||
                        (live != "" &&
                            typeof items[live] != "undefined" &&
                            typeof items[live].prereqs == "object") ||
                        (accel != "" &&
                            typeof items[accel] != "undefined" &&
                            typeof items[accel].prereqs == "object")
                    ) {
                        // START (mostly) COPY FROM BUIDTILE.JS
                        var bookmarkWidget = ""
                        let enabledWidget = ""

                        if (typeof summary.bookmark_status != "undefined") {
                            switch (summary.bookmark_status) {
                                case "none":
                                    bookmarkWidget =
                                        '<img class="bookmarkIcon" title="Bookmark this content to look up later" data-showcase="' +
                                        summary.name +
                                        '" src="' +
                                        Splunk.util.make_full_url(
                                            "/static/app/Splunk_Security_Essentials/images/general_images/nobookmark.png"
                                        ) +
                                        '" onclick=\'createWishlistBox(this, "' +
                                        summary.name +
                                        "\"); return false;'>"
                                    enabledWidget = $(
                                        '<img class="enabledIcon" title="Mark that the content is already enabled" onclick="markContentEnabled(this);" data-showcase="' +
                                            summary.name +
                                            '" src="' +
                                            Splunk.util.make_full_url(
                                                "/static/app/Splunk_Security_Essentials/images/general_images/notenabled.png"
                                            ) +
                                            '">'
                                    )
                                    break
                                case "bookmarked":
                                    bookmarkWidget =
                                        '<i class="icon-bookmark" data-showcase="' +
                                        summary.name +
                                        '" title="Bookmarked" onclick=\'createWishlistBox(this, "' +
                                        summary.name +
                                        "\"); return false;'></i>"
                                    break
                                case "needData":
                                    bookmarkWidget =
                                        '<i class="icon-bookmark" data-showcase="' +
                                        summary.name +
                                        '" title="Bookmarked" onclick=\'createWishlistBox(this, "' +
                                        summary.name +
                                        "\"); return false;'></i>"
                                    break
                                case "inQueue":
                                    bookmarkWidget =
                                        '<i class="icon-bookmark" data-showcase="' +
                                        summary.name +
                                        '" title="Bookmarked" onclick=\'createWishlistBox(this, "' +
                                        summary.name +
                                        "\"); return false;'></i>"
                                    break
                                case "needsTuning":
                                    bookmarkWidget =
                                        '<i class="icon-bookmark" data-showcase="' +
                                        summary.name +
                                        '" title="Bookmarked" onclick=\'createWishlistBox(this, "' +
                                        summary.name +
                                        "\"); return false;'></i>"
                                    break
                                case "issuesDeploying":
                                    bookmarkWidget =
                                        '<i class="icon-bookmark" data-showcase="' +
                                        summary.name +
                                        '" title="Bookmarked" onclick=\'createWishlistBox(this, "' +
                                        summary.name +
                                        "\"); return false;'></i>"
                                    break
                                case "successfullyImplemented":
                                    bookmarkWidget =
                                        '<i class="icon-check" data-showcase="' +
                                        summary.name +
                                        '" title="Implemented" onclick=\'createWishlistBox(this, "' +
                                        summary.name +
                                        "\"); return false;'></i>"
                                    break
                            }
                        } else {
                            bookmarkWidget =
                                '<img class="bookmarkIcon" title="Bookmark this content to look up later" data-showcase="' +
                                summary.name +
                                '" src="' +
                                Splunk.util.make_full_url(
                                    "/static/app/Splunk_Security_Essentials/images/general_images/nobookmark.png"
                                ) +
                                '" onclick=\'createWishlistBox(this, "' +
                                summary.name +
                                "\"); return false;'>"
                            enabledWidget = $(
                                '<img class="enabledIcon" title="Mark that the content is already enabled" onclick="markContentEnabled(this);" data-showcase="' +
                                    summary.name +
                                    '" src="' +
                                    Splunk.util.make_full_url(
                                        "/static/app/Splunk_Security_Essentials/images/general_images/notenabled.png"
                                    ) +
                                    '">'
                            )
                        }
                        window.markContentEnabled = function (obj) {
                            let showcaseId = $(obj)
                                .closest("tr")
                                .attr("data-showcaseId")
                            let target = $(obj)
                            let name = target.attr("data-showcase")
                            // console.log("Marking conte")
                            if (
                                target.attr("title") ==
                                "Mark that the content is already enabled"
                            ) {
                                setbookmark_status(
                                    name,
                                    showcaseId,
                                    "successfullyImplemented"
                                )
                                target
                                    .closest(".bookmarkIcons")
                                    .html(
                                        '<i class="icon-check" data-showcase="' +
                                            name +
                                            '" title="Implemented" onclick=\'createWishlistBox(this, "' +
                                            name +
                                            "\"); return false;'></i>"
                                    )
                            }
                        }
                        window.createWishlistBox = function (obj, name) {
                            // console.log("Running with", obj, name, obj.outerHTML)

                            let showcaseId = $(obj)
                                .closest("tr")
                                .attr("data-showcaseId")
                            if ($(obj).is("img")) {
                                let container = $(obj).closest(".bookmarkIcons")
                                container.html(
                                    '<i class="icon-bookmark" data-showcase="' +
                                        name +
                                        '" title="Bookmarked" onclick=\'createWishlistBox(this, "' +
                                        name +
                                        "\"); return false;'></i>"
                                )
                                //container.append(bookmarkWidget, enabledWidget)
                                setbookmark_status(
                                    name,
                                    showcaseId,
                                    "bookmarked"
                                )
                            } else {
                                let name = $(obj).attr("data-showcase")
                                let bookmarkWidget = $(
                                    '<img class="bookmarkIcon" title="Bookmark this content to look up later" data-showcase="' +
                                        name +
                                        '" src="' +
                                        Splunk.util.make_full_url(
                                            "/static/app/Splunk_Security_Essentials/images/general_images/nobookmark.png"
                                        ) +
                                        '" onclick=\'createWishlistBox(this, "' +
                                        name +
                                        "\"); return false;'>"
                                )
                                let enabledWidget = $(
                                    '<img class="enabledIcon" title="Mark that the content is already enabled" onclick="markContentEnabled(this);" data-showcase="' +
                                        name +
                                        '" src="' +
                                        Splunk.util.make_full_url(
                                            "/static/app/Splunk_Security_Essentials/images/general_images/notenabled.png"
                                        ) +
                                        '">'
                                )
                                let container = $(obj).closest(".bookmarkIcons")
                                container.html("")
                                container.append(bookmarkWidget, enabledWidget)
                                setbookmark_status(name, showcaseId, "none")
                            }
                        }
                        window.setbookmark_status = function (
                            name,
                            showcaseId,
                            status,
                            action
                        ) {
                            if (!action) {
                                action =
                                    splunkjs.mvc.Components.getInstance(
                                        "env"
                                    ).toJSON()["page"]
                            }
                            require([
                                "components/data/sendTelemetry",
                                "json!" +
                                    $C["SPLUNKD_PATH"] +
                                    "/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/sse_app_config",
                            ], function (Telemetry, appConfig) {
                                let record = {
                                    status: status,
                                    name: name,
                                    selectionType: action,
                                }
                                for (let i = 0; i < appConfig.length; i++) {
                                    if (
                                        appConfig[i].param == "demoMode" &&
                                        appConfig[i].value == "true"
                                    ) {
                                        record.demoMode = true
                                    }
                                }
                                Telemetry.SendTelemetryToSplunk(
                                    "BookmarkChange",
                                    record
                                )
                            })

                            require([
                                "splunkjs/mvc/utils",
                                "splunkjs/mvc/searchmanager",
                            ], function (utils, SearchManager) {
                                new SearchManager(
                                    {
                                        id:
                                            "logBookmarkChange-" +
                                            name.replace(/[^a-zA-Z0-9]/g, "_"),
                                        latest_time: "0",
                                        autostart: true,
                                        earliest_time: "now",
                                        search:
                                            '| makeresults | eval app="' +
                                            utils.getCurrentApp() +
                                            '", page="' +
                                            splunkjs.mvc.Components.getInstance(
                                                "env"
                                            ).toJSON()["page"] +
                                            '", user="' +
                                            $C["USERNAME"] +
                                            '", name="' +
                                            name +
                                            '", status="' +
                                            status +
                                            '" | collect index=_internal sourcetype=essentials:bookmark',
                                        app: utils.getCurrentApp(),
                                        auto_cancel: 90,
                                    },
                                    { tokens: false }
                                )
                            })
                            for (
                                var i = 0;
                                i < window.ShowcaseInfo.roles.default.summaries;
                                i++
                            ) {
                                if (
                                    name ==
                                    window.ShowcaseInfo.summaries[
                                        window.ShowcaseInfo.roles.default
                                            .summaries[i]
                                    ]
                                ) {
                                    window.ShowcaseInfo.summaries[
                                        window.ShowcaseInfo.roles.default.summaries[
                                            i
                                        ]
                                    ].bookmark_status = status
                                }
                            }

                            var record = {
                                _time: new Date().getTime() / 1000,
                                _key: showcaseId,
                                showcase_name: name,
                                status: status,
                                user: Splunk.util.getConfigValue("USERNAME"),
                            }
                            // console.log("Updating kvstore for", record)
                            // $.ajax({
                            //     url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/bookmark',
                            //     type: 'POST',
                            //     contentType: "application/json",
                            //     async: true,
                            //     data: JSON.stringify(record),
                            //     success: function() {
                            //         console.log("Successfully updated", arguments)
                            //     },
                            //     error: function() {
                            //         console.log("failed to update updated", arguments)
                            //     }
                            // })

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
                                        // New

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
                                            success: function (returneddata) {
                                                bustCache()
                                                newkey = returneddata
                                            },
                                            error: function (
                                                xhr,
                                                textStatus,
                                                error
                                            ) {
                                                bustCache()
                                            },
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
                                            success: function (returneddata) {
                                                bustCache()
                                                newkey = returneddata
                                            },
                                            error: function (
                                                xhr,
                                                textStatus,
                                                error
                                            ) {
                                                bustCache()
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
                        // END COPY FROM BUIDTILE.JS
                        let Icons = $('<div class="bookmarkIcons">').append(
                            $(bookmarkWidget),
                            enabledWidget
                        )
                        // console.log("For ", summary, Icons.html())
                        $("#main_table_body").append(
                            '<tr data-showcaseid="' +
                                summary.id +
                                '" id="row-' +
                                toHex(example) +
                                '" class="dvbanner"><td class="tableexpand" class="downarrow" id="expand-' +
                                toHex(example) +
                                '"><a href="#" onclick="doToggle(\'' +
                                toHex(example) +
                                '\'); return false;"><i class="icon-chevron-right"></i></a></td><td class="name"><a href="#" onclick="doToggle(\'' +
                                toHex(example) +
                                "'); return false;\">" +
                                summary.name +
                                "</a>&nbsp;" +
                                Icons[0].outerHTML +
                                '</td><td class="tabledemo" id="' +
                                toHex(example + "-demo") +
                                '">' +
                                demodisplay +
                                '</td><td class="tablelive" id="' +
                                toHex(example + "-live") +
                                '">' +
                                livedisplay +
                                '</td><td class="tableaccel" id="' +
                                toHex(example + "-accel") +
                                '">' +
                                acceldisplay +
                                "</td></tr>"
                        )
                        $("#main_table_body").append(
                            '<tr id="description-' +
                                toHex(example) +
                                '" style="display: none;"><td colspan="5">' +
                                "<b>Description:</b> " +
                                summary.description +
                                relevance +
                                exampleText +
                                "<ul>" +
                                exampleList.html() +
                                "</ul>" +
                                '<div id="prereqs-' +
                                toHex(example) +
                                '"></div></td></tr>'
                        )
                    }
                    if (demo != "" && typeof items[demo] != "undefined") {
                        if (
                            typeof items[demo].prereqs != "undefined" &&
                            items[demo].prereqs.length > 0
                        ) {
                            runPreReqs(
                                items[demo].prereqs,
                                toHex(example + "-demo"),
                                "#prereqs-" + toHex(example),
                                "Demo Data"
                            )
                            demo =
                                '<img style="height:22px; width:20px;" src="' +
                                Splunk.util.make_full_url(
                                    "/static/app/Splunk_Security_Essentials/images/general_images/loader.gif"
                                ) +
                                '">'
                        } else {
                            demo = ""
                        }
                    }
                    if (live != "" && typeof items[live] != "undefined") {
                        if (
                            items[live].eventtypeInference &&
                            items[live].eventtypeInference != ""
                        ) {
                            window.inferences[toHex(example + "-live")] =
                                items[live].eventtypeInference
                        }
                        if (
                            typeof items[live].prereqs != "undefined" &&
                            items[live].prereqs.length > 0
                        ) {
                            runPreReqs(
                                items[live].prereqs,
                                toHex(example + "-live"),
                                "#prereqs-" + toHex(example),
                                "Live Data"
                            )
                            live =
                                '<img style="height:22px; width:20px;" src="' +
                                Splunk.util.make_full_url(
                                    "/static/app/Splunk_Security_Essentials/images/general_images/loader.gif"
                                ) +
                                '">'
                        } else {
                            live = ""
                        }
                    }
                    if (accel != "" && typeof items[accel] != "undefined") {
                        if (
                            items[accel].eventtypeInference &&
                            items[accel].eventtypeInference != ""
                        ) {
                            window.inferences[toHex(example + "-accel")] =
                                items[accel].eventtypeInference
                        }
                        if (
                            typeof items[accel].prereqs != "undefined" &&
                            items[accel].prereqs.length > 0
                        ) {
                            runPreReqs(
                                items[accel].prereqs,
                                toHex(example + "-accel"),
                                "#prereqs-" + toHex(example),
                                "Accelerated Data"
                            )
                            accel =
                                '<img style="height:22px; width:20px;" src="' +
                                Splunk.util.make_full_url(
                                    "/static/app/Splunk_Security_Essentials/images/general_images/loader.gif"
                                ) +
                                '">'
                        } else {
                            accel = ""
                        }
                    }
                }
            }

            require(["vendor/bootstrap/bootstrap.bundle"], function () {
                if ($(".dvTooltip").length > 0) {
                    $(".dvTooltip").tooltip({ html: true })
                }
                if ($(".dvPopover").length > 0) {
                    $(".dvPopover").popover({
                        html: true,
                        trigger: "hover",
                    })
                }
            })

            $("#layout1").append(HTMLBlock) //#main_content
            $("#main_content").prepend(
                '<div id="percContainer" style="width: 100%; display:none; height: 0px;"><div id="completeContainer" style="width:0%; display: inline-block; height: 100%; background-color: blue;"></div><div id="inProgressContainer" style="width:0%; display: inline-block; height: 100%; background-color: lightblue;"></div><div id="queueContainer" style="width:100%; display: inline-block; height: 100%; background-color: gray;"></div></div>'
            )
            $(".dvbanner").css("font-size", "15px")
            $(".tabledemo").css("text-align", "center")
            $(".tablelive").css("text-align", "center")
            $(".tableaccel").css("text-align", "center")
            $(".panel-body").css("padding", "0px")

            // Let's see if we have history in the kvstore.

            $.ajax({
                url:
                    $C["SPLUNKD_PATH"] +
                    "/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/data_source_check/",
                type: "GET",
                contentType: "application/json",
                async: false,
                success: function (returneddata) {
                    if (returneddata.length > 1) {
                        window.KVStoreHistory = returneddata
                        // Print the Button
                        $("#placeholderForRestore")[0].outerHTML =
                            '<button type="button" id="pullKVStoreButton" class="btn btn-primary"><i class="icon-rotate-counter"></i> Retrieve Last Result</button>'
                        $("#pullKVStoreButton").click(function () {
                            RetrieveSearchKVstore()
                            $("#KickItOffButton").remove()
                            $("#pullKVStoreButton")
                                .addClass("disabled")
                                .attr("disabled", "disabled")
                        })
                    }
                },
            })
        }
    )

    function runPreReqs(prereqs, element, div, label) {
        if (prereqs.length > 0) {
            $(div).append(
                '<div id="row11" class="dashboard-row dashboard-row1 splunk-view">        <div id="panel11" class="dashboard-cell last-visible splunk-view" style="width: 100%;">            <div class="dashboard-panel clearfix" style="min-height: 0px;"><h2 class="panel-title empty"></h2><div id="view_22841" class="fieldset splunk-view editable hide-label hidden empty"></div>                                <div class="panel-element-row">                    <div id="element11" class="dashboard-element html splunk-view" style="width: 100%;">                        <div class="panel-body html">                         <h3>' +
                    label +
                    '</h3>  <table class="table table-striped data_check_table" id="data_check_table-' +
                    element +
                    '" >                            <tr><td style="width: 25%">Data Check</td><td style="text-align: center;" style="width: 6%">Status</td><td style="width: 9%">Open in Search</td><td style="width: 60%">Resolution (if needed)</td></tr>                            </table>                        </div>                    </div>                </div>            </div>        </div>    </div>'
            )
            window.datacheck[element] = new Object()
            for (var i = 0; i < prereqs.length; i++) {
                window.datacheck[element][i] = new Object()
                // create table entry including unique id for the status
                $("#data_check_table-" + element + " tr:last").after(
                    "<tr><td>" +
                        prereqs[i].name +
                        '</td><td style="text-align: center;" tag="' +
                        toHex(prereqs[i].test) +
                        '" id="data_check_test-' +
                        element +
                        "-" +
                        i +
                        '"><img title="In Queue..." src="' +
                        Splunk.util.make_full_url(
                            "/static//app/Splunk_Security_Essentials/images/general_images/queue_icon.png"
                        ) +
                        '"></td><td><a target="_blank" href="' +
                        Splunk.util.make_full_url(
                            "/app/Splunk_Security_Essentials/search?q=" +
                                encodeURI(prereqs[i].test)
                        ) +
                        '">Open in Search</a></td><td>' +
                        prereqs[i].resolution +
                        "</td></tr>"
                )
                if (window.location.href.indexOf("debug=true") >= 0) {
                    param = "#data_check_test-" + element + "-" + i
                    $(param).append(
                        ' <a href="#" onclick="runDebug(\'' +
                            $(param).attr("id") +
                            "'); return false\">(debug)</a>"
                    )
                }

                var searchHex = toHex(prereqs[i].test)

                // test if search manager already exists
                if (typeof window.datacheck[searchHex] == "undefined") {
                    //    console.log("Do need to create a search manager for ", toHex(prereqs[i].test), prereqs[i].test)
                    window.datacheck[searchHex] = new Object()
                    window.datacheck[searchHex].registerResults = []
                    window.datacheck[searchHex].registerResults.push(
                        "data_check_test-" + element + "-" + i
                    )
                    window.datacheck[searchHex].prereq = prereqs[i]
                    window.datacheck["data_check_test-" + element + "-" + i] =
                        searchHex
                    window.SearchesInQueue.push(searchHex)
                    // create search manager

                    window.datacheck[searchHex].mainSearch = new SearchManager(
                        {
                            id: searchHex,
                            cancelOnUnload: true,
                            latest_time: "",
                            status_buckets: 0,
                            earliest_time: "0",
                            search: prereqs[i].test,
                            app: appName,
                            auto_cancel: 20,
                            //"auto_finalize_ec": 2000,
                            max_time: prereqs[i].override_auto_finalize || 20,
                            preview: true,
                            runWhenTimeIsUndefined: false,
                            autostart: false,
                        },
                        {
                            tokens: true,
                            tokenNamespace: "submitted",
                        }
                    )

                    window.datacheck[searchHex].myResults = window.datacheck[
                        searchHex
                    ].mainSearch.data("results", {
                        output_mode: "json",
                        count: 0,
                    })

                    window.datacheck[searchHex].mainSearch.on(
                        "search:start",
                        function (properties) {
                            for (
                                var g = 0;
                                g <
                                window.datacheck[
                                    properties.content.request.label
                                ].registerResults.length;
                                g++
                            ) {
                                var searchName =
                                    window.datacheck[
                                        properties.content.request.label
                                    ].registerResults[g]
                                var matches = /.*?\-([^\-]*)\-(\d*)/.exec(
                                    searchName
                                )
                                var element = matches[1]
                                var myCheckNum = matches[2]

                                document.getElementById(
                                    "data_check_test-" +
                                        element +
                                        "-" +
                                        myCheckNum
                                ).innerHTML =
                                    '<img title="Loading" src="' +
                                    Splunk.util.make_full_url(
                                        "/static//app/Splunk_Security_Essentials/images/general_images/loader.gif"
                                    ) +
                                    '">'
                                if (
                                    window.location.href.indexOf(
                                        "debug=true"
                                    ) >= 0
                                ) {
                                    param =
                                        "#data_check_test-" +
                                        element +
                                        "-" +
                                        myCheckNum
                                    $(param).append(
                                        ' <a href="#" onclick="runDebug(\'' +
                                            $(param).attr("id") +
                                            "'); return false\">(debug)</a>"
                                    )
                                }
                                // console.log("Data Check Failure code 3", searchName, myCheckNum, prereqs[myCheckNum])
                                doDataCheck(element)
                            }
                        }
                    )
                    window.datacheck[searchHex].mainSearch.on(
                        "search:error",
                        function (properties) {
                            for (
                                var g = 0;
                                g <
                                window.datacheck[
                                    properties.content.request.label
                                ].registerResults.length;
                                g++
                            ) {
                                var searchName =
                                    window.datacheck[
                                        properties.content.request.label
                                    ].registerResults[g]
                                var matches = /.*?\-([^\-]*)\-(\d*)/.exec(
                                    searchName
                                )
                                var element = matches[1]
                                var myCheckNum = matches[2]

                                document.getElementById(
                                    "data_check_test-" +
                                        element +
                                        "-" +
                                        myCheckNum
                                ).innerHTML =
                                    '<img title="Error" src="' +
                                    Splunk.util.make_full_url(
                                        "/static//app/Splunk_Security_Essentials/images/general_images/err_ico.gif"
                                    ) +
                                    '">'
                                if (
                                    window.location.href.indexOf(
                                        "debug=true"
                                    ) >= 0
                                ) {
                                    param =
                                        "#data_check_test-" +
                                        element +
                                        "-" +
                                        myCheckNum
                                    $(param).append(
                                        ' <a href="#" onclick="runDebug(\'' +
                                            $(param).attr("id") +
                                            "'); return false\">(debug)</a>"
                                    )
                                }
                                // console.log("Data Check Failure code 3", searchName, myCheckNum, prereqs[myCheckNum])
                                doDataCheck(element)
                            }
                        }
                    )
                    window.datacheck[searchHex].mainSearch.on(
                        "search:fail",
                        function (properties) {
                            for (
                                var g = 0;
                                g <
                                window.datacheck[
                                    properties.content.request.label
                                ].registerResults.length;
                                g++
                            ) {
                                var searchName =
                                    window.datacheck[
                                        properties.content.request.label
                                    ].registerResults[g]

                                var matches = /.*?\-([^\-]*)\-(\d*)/.exec(
                                    searchName
                                )
                                var element = matches[1]
                                var myCheckNum = matches[2]

                                document.getElementById(
                                    "data_check_test-" +
                                        element +
                                        "-" +
                                        myCheckNum
                                ).innerHTML =
                                    '<img title="Error" src="' +
                                    Splunk.util.make_full_url(
                                        "/static//app/Splunk_Security_Essentials/images/general_images/err_ico.gif"
                                    ) +
                                    '">'
                                if (
                                    window.location.href.indexOf(
                                        "debug=true"
                                    ) >= 0
                                ) {
                                    param =
                                        "#data_check_test-" +
                                        element +
                                        "-" +
                                        myCheckNum
                                    $(param).append(
                                        ' <a href="#" onclick="runDebug(\'' +
                                            $(param).attr("id") +
                                            "'); return false\">(debug)</a>"
                                    )
                                }
                                // console.log("Data Check Failure code 4", searchName, myCheckNum, prereqs[myCheckNum])
                                doDataCheck(element)
                            }
                        }
                    )
                    window.datacheck[searchHex].mainSearch.on(
                        "search:done",
                        function (properties) {
                            var searchHex = properties.content.request.label

                            //  console.log("Got Results from Data Check Search", searchName, myCheckNum, properties);

                            if (
                                window.datacheck[searchHex].mainSearch
                                    .attributes.data.resultCount == 0
                            ) {
                                //     console.log("No Results from Data Check Search", "data_check_test-" + element + "-" + myCheckNum, searchName, myCheckNum, properties);
                                for (
                                    var g = 0;
                                    g <
                                    window.datacheck[
                                        properties.content.request.label
                                    ].registerResults.length;
                                    g++
                                ) {
                                    var searchName =
                                        window.datacheck[
                                            properties.content.request.label
                                        ].registerResults[g]
                                    var matches = /.*?\-([^\-]*)\-(\d*)/.exec(
                                        searchName
                                    )
                                    var element = matches[1]
                                    var myCheckNum = matches[2]
                                    document.getElementById(
                                        "data_check_test-" +
                                            element +
                                            "-" +
                                            myCheckNum
                                    ).innerHTML =
                                        '<img title="Error" src="' +
                                        Splunk.util.make_full_url(
                                            "/static//app/Splunk_Security_Essentials/images/general_images/err_ico.gif"
                                        ) +
                                        '">'

                                    if (
                                        window.location.href.indexOf(
                                            "debug=true"
                                        ) >= 0
                                    ) {
                                        param =
                                            "#data_check_test-" +
                                            element +
                                            "-" +
                                            myCheckNum
                                        $(param).append(
                                            ' <a href="#" onclick="runDebug(\'' +
                                                $(param).attr("id") +
                                                "'); return false\">(debug)</a>"
                                        )
                                    }
                                    doDataCheck(element)
                                }
                                //   console.log("Data Check Failure code 1", preqreqs[myCheckNum])
                                return
                            }

                            window.datacheck[searchHex].myResults.on(
                                "data",
                                function (properties) {
                                    //    console.log("Data Check -- her'es my check for myResults...", properties, searchHex)
                                    var searchHex =
                                        properties.attributes.manager.id

                                    for (
                                        var g = 0;
                                        g <
                                        window.datacheck[searchHex]
                                            .registerResults.length;
                                        g++
                                    ) {
                                        var searchName =
                                            window.datacheck[searchHex]
                                                .registerResults[g]
                                        var matches =
                                            /.*?\-([^\-]*)\-(\d*)/.exec(
                                                searchName
                                            )
                                        var element = matches[1]
                                        var myCheckNum = matches[2]
                                        var data =
                                            window.datacheck[
                                                searchHex
                                            ].myResults.data().results
                                        //      console.log("Got Data from Data Check Search", data, myField, properties);
                                        var myField =
                                            window.datacheck[searchHex].prereq
                                                .field
                                        var status = false
                                        if (
                                            typeof data[0][myField] !==
                                            "undefined"
                                        ) {
                                            status = true
                                            if (
                                                typeof window.datacheck[
                                                    searchHex
                                                ].prereq.greaterorequalto !==
                                                "undefined"
                                            ) {
                                                if (
                                                    data[0][myField] >=
                                                    window.datacheck[searchHex]
                                                        .prereq.greaterorequalto
                                                ) {
                                                    status = true
                                                } else {
                                                    status = false
                                                }
                                            }
                                        }

                                        if (status == true) {
                                            document.getElementById(
                                                "data_check_test-" +
                                                    element +
                                                    "-" +
                                                    myCheckNum
                                            ).innerHTML =
                                                '<img title="Success" src="' +
                                                Splunk.util.make_full_url(
                                                    "/static//app/Splunk_Security_Essentials/images/general_images/ok_ico.gif"
                                                ) +
                                                '">'
                                            if (
                                                window.location.href.indexOf(
                                                    "debug=true"
                                                ) >= 0
                                            ) {
                                                param =
                                                    "#data_check_test-" +
                                                    element +
                                                    "-" +
                                                    myCheckNum
                                                $(param).append(
                                                    ' <a href="#" onclick="runDebug(\'' +
                                                        $(param).attr("id") +
                                                        "'); return false\">(debug)</a>"
                                                )
                                            }
                                            //     console.log("Data Check success",searchName, myCheckNum, prereqs[myCheckNum])
                                        } else {
                                            document.getElementById(
                                                "data_check_test-" +
                                                    element +
                                                    "-" +
                                                    myCheckNum
                                            ).innerHTML =
                                                '<img title="Error" src="' +
                                                Splunk.util.make_full_url(
                                                    "/static//app/Splunk_Security_Essentials/images/general_images/err_ico.gif"
                                                ) +
                                                '">'
                                            if (
                                                window.location.href.indexOf(
                                                    "debug=true"
                                                ) >= 0
                                            ) {
                                                param =
                                                    "#data_check_test-" +
                                                    element +
                                                    "-" +
                                                    myCheckNum
                                                $(param).append(
                                                    ' <a href="#" onclick="runDebug(\'' +
                                                        $(param).attr("id") +
                                                        "'); return false\">(debug)</a>"
                                                )
                                            }
                                            //        console.log("Data Check Failure code 2",searchName, myCheckNum, prereqs[myCheckNum])
                                        }
                                        setTimeout(function () {
                                            checkItem(searchHex)
                                        }, 1000)
                                        doDataCheck(element)
                                    }
                                }
                            )
                        }
                    )
                } else {
                    //     console.log("Don't need to create a search manager for ", toHex(prereqs[i].test), prereqs[i].test)

                    window.datacheck["data_check_test-" + element + "-" + i] =
                        searchHex
                    window.datacheck[
                        toHex(prereqs[i].test)
                    ].registerResults.push(
                        "data_check_test-" + element + "-" + i
                    )
                    checkItem(toHex(prereqs[i].test))
                }
            }
        }
    }

    require(["vendor/bootstrap/bootstrap.bundle"], function () {
        if ($(".dvTooltip").length > 0) {
            $(".dvTooltip").tooltip({ html: true })
        }
        if ($(".dvPopover").length > 0) {
            $(".dvPopover").popover({
                html: true,
                trigger: "hover",
            })
        }
        $(".dvbanner").css("font-size", "15px")
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
})

function ProcessSearchQueue() {
    if (window.SearchesInProgress.length > 0) {
        for (var i = 0; i < window.SearchesInProgress.length; i++) {
            curSearch = window.SearchesInProgress.shift()
            if (
                window.datacheck[curSearch].mainSearch &&
                window.datacheck[curSearch].mainSearch.attributes &&
                window.datacheck[curSearch].mainSearch.attributes.data &&
                window.datacheck[curSearch].mainSearch.attributes.data
                    .doneProgress != 1 &&
                window.datacheck[curSearch].mainSearch.attributes.data
                    .dispatchState != "DONE"
            ) {
                window.SearchesInProgress.push(curSearch)
            } else {
                window.SearchesComplete.push(curSearch)
            }
        }
    }

    if (
        window.SearchesInQueue.length > 0 &&
        window.SearchesInProgress.length <
            localStorage["splunk-security-essentials-maxconcurrentsearches"]
    ) {
        for (
            var i = 0;
            i <
            Math.min(
                localStorage[
                    "splunk-security-essentials-maxconcurrentsearches"
                ] - window.SearchesInProgress.length,
                window.SearchesInQueue.length
            );
            i++
        ) {
            var mySearch = window.SearchesInQueue.shift()
            window.SearchesInProgress.push(mySearch)
            window.datacheck[mySearch].mainSearch.startSearch()
            window.hasAnyEverRun = true
        }
    }
    var interval = 3000
    if (
        Math.max(
            window.SearchesInQueue.length,
            window.SearchesInProgress.length
        ) > 0
    ) {
        interval = 1000
    } else if (window.hasAnyEverRun == false) {
        interval = 2000
    }
    var total =
        window.SearchesInQueue.length +
        window.SearchesComplete.length +
        window.SearchesInProgress.length
    $("#queueContainer").css(
        "width",
        Math.round(100 * (window.SearchesInQueue.length / total)) + "%"
    )
    $("#inProgressContainer").css(
        "width",
        Math.round(100 * (window.SearchesInProgress.length / total)) + "%"
    )
    $("#completeContainer").css(
        "width",
        100 -
            (Math.round(100 * (window.SearchesInQueue.length / total)) +
                Math.round(100 * (window.SearchesInProgress.length / total))) +
            "%"
    )
    var ShouldIterate = true
    if (
        window.SearchesInQueue.length == 0 &&
        window.SearchesInProgress.length == 0 &&
        total > 0
    ) {
        $("#completeContainer").html("Complete!")
        $("#completeContainer").css("color", "white")
        $("#completeContainer").css("text-align", "center")
        $("#KickItOffButton").attr("disabled", true)
        setTimeout(function () {
            $("#percContainer").css("display", "none")
            // checkRemainingItems(Object.keys(hexMapping));
            // let loadingElements = $("td[id^='data_check_test-']>img[title='Loading']");
            // while(loadingElements.length > 0){
            //     console.log("from while");
            //     for(const element of loadingElements){
            //         let tag = $(element).parent().attr("tag");
            //         checkItem(tag);
            //     }
            //     loadingElements = $("td[id^='data_check_test-']>img[title='Loading']");
            // }
        }, 2500)
        retryCount = 0

        // RecordStatusOfPreCheck();
        ShouldIterate = false

        setTimeout(() => {
            let remainingList = checkRemainingItems(Object.keys(hexMapping))
            while (remainingList.length > 0 && retryCount < threshold) {
                retryCount++

                if (retryCount < threshold) {
                    remainingList = checkRemainingItems(remainingList)
                }
            }
        }, 5000)
    }
    if (ShouldIterate) {
        setTimeout(function () {
            ProcessSearchQueue()
        }, interval)
    }
}

function doToggle(element) {
    if (
        $("#expand-" + element)
            .find("i")
            .attr("class") == "icon-chevron-down"
    ) {
        $("#description-" + element).css("display", "none")
        $("#expand-" + element)
            .find("i")
            .attr("class", "icon-chevron-right")
    } else {
        $("#description-" + element).css("display", "table-row")
        //$("#row-" + element).after($("#description-" + element))

        $("#expand-" + element)
            .find("i")
            .attr("class", "icon-chevron-down")
        //$("#expand-" + element).find("img")[0].src = $("#expand-" + element).find("img")[0].src.replace("downarrow", "uparrow")
        $("#description-" + element)
            .find("td")
            .css("border-top", 0)
    }
}

function checkItem(searchHex) {
    // console.log("EXISITING -- Initialized checkItem with", searchHex)
    let checked = false
    if (window.datacheck[searchHex]?.registerResults?.length > 0) {
        for (
            var g = 0;
            g < window.datacheck[searchHex].registerResults.length;
            g++
        ) {
            if (
                typeof window.datacheck[searchHex].mainSearch.attributes.data !=
                    "undefined" &&
                window.datacheck[searchHex].mainSearch.attributes.data
                    .doneProgress == 1
            ) {
                var matches = /.*?\-([^\-]*)\-(\d*)/.exec(
                    window.datacheck[searchHex].registerResults[g]
                )
                var element = matches[1]
                var myCheckNum = matches[2]
                //   console.log("EXISTING - already run", g,window.datacheck[searchHex], window.datacheck[searchHex].registerResults[g],  window.datacheck[searchHex].mainSearch.attributes.data)
                if (
                    window.datacheck[searchHex].mainSearch.attributes.data
                        .isFailed == 1 ||
                    window.datacheck[searchHex].mainSearch.attributes.data
                        .resultCount == 0
                ) {
                    // console.log('EXISTING - already failed', window.datacheck[searchHex].mainSearch.attributes.data);
                    document.getElementById(
                        window.datacheck[searchHex].registerResults[g]
                    ).innerHTML =
                        '<img title="Error" src="' +
                        Splunk.util.make_full_url(
                            "/static//app/Splunk_Security_Essentials/images/general_images/err_ico.gif"
                        ) +
                        '">'
                    checked = true
                    // console.log("Data Check Failure code 11",$("#" + window.datacheck[searchHex].registerResults[g]), searchHex)
                } else {
                    var data =
                        window.datacheck[searchHex].myResults?.data()?.results
                    var myField = window.datacheck[searchHex].prereq?.field
                    var status = false
                    // console.log("Evaluating...", searchHex, window.datacheck[searchHex].registerResults[g], data[0][myField], window.datacheck[searchHex].prereq.greaterorequalto)
                    if (data && typeof data[0][myField] !== "undefined") {
                        status = true
                        if (
                            typeof window.datacheck[searchHex].prereq
                                .greaterorequalto !== "undefined"
                        ) {
                            if (
                                data[0][myField] >=
                                window.datacheck[searchHex].prereq
                                    .greaterorequalto
                            ) {
                                status = true
                            } else {
                                status = false
                            }
                        }
                    }

                    if (status == true) {
                        document.getElementById(
                            "data_check_test-" + element + "-" + myCheckNum
                        ).innerHTML =
                            '<img title="Success" src="' +
                            Splunk.util.make_full_url(
                                "/static//app/Splunk_Security_Essentials/images/general_images/ok_ico.gif"
                            ) +
                            '">'
                        checked = true
                        if (window.location.href.indexOf("debug=true") >= 0) {
                            param =
                                "#data_check_test-" + element + "-" + myCheckNum
                            $(param).append(
                                ' <a href="#" onclick="runDebug(\'' +
                                    $(param).attr("id") +
                                    "'); return false\">(debug)</a>"
                            )
                        }
                        // console.log("Data Check success",$("#data_check_test-" + element + "-" + myCheckNum), myCheckNum)
                    } else {
                        document.getElementById(
                            "data_check_test-" + element + "-" + myCheckNum
                        ).innerHTML =
                            '<img title="Error" src="' +
                            Splunk.util.make_full_url(
                                "/static//app/Splunk_Security_Essentials/images/general_images/err_ico.gif"
                            ) +
                            '">'
                        checked = true
                        if (window.location.href.indexOf("debug=true") >= 0) {
                            param =
                                "#data_check_test-" + element + "-" + myCheckNum
                            $(param).append(
                                ' <a href="#" onclick="runDebug(\'' +
                                    $(param).attr("id") +
                                    "'); return false\">(debug)</a>"
                            )
                        }
                        // console.log("Data Check Failure code 2",$("#data_check_test-" + element + "-" + myCheckNum), myCheckNum)
                    }
                    // console.log("EXISTING - already success", window.datacheck[searchHex].mainSearch.attributes.data)
                    //document.getElementById(window.datacheck[searchHex].registerResults[g]).innerHTML = "<img title=\"Success\" src=\"" + Splunk.util.make_full_url("/static//app/Splunk_Security_Essentials/images/general_images/ok_ico.gif") + "\">";
                    // console.log("Data Check success",searchName, myCheckNum, prereqs[myCheckNum])
                }
                doDataCheck(element)
            }
        }
    } else {
        checked = "pass"
    }
    return checked
}

window.result_tracking = new Object()

function doDataCheck(element) {
    var status = "ok_ico.gif"
    $(".dvbanner").css("font-size", "15px")

    for (var i = 0; i < Object.keys(window.datacheck[element]).length; i++) {
        //console.log("Checking", element, i, $("#data_check_test-" + element + "-" + i).find("img")[0].src)
        if (status == "err_ico.gif") {
            // Don't worry
        } else if (
            $("#data_check_test-" + element + "-" + i)
                .find("img")[0]
                .src.indexOf("err_ico.gif") > 0
        ) {
            status = "err_ico.gif"
        } else if (
            $("#data_check_test-" + element + "-" + i)
                .find("img")[0]
                .src.indexOf("loader.gif") > 0
        ) {
            status = "loader.gif"
        } else if (
            $("#data_check_test-" + element + "-" + i)
                .find("img")[0]
                .src.indexOf("queue_icon.png") > 0
        ) {
            status = "loader.gif"
            //       console.log("Look, I should be a loader!", element, i, $("#data_check_test-" + element + "-" + i).find("img")[0].src)
        }
    }
    //console.log("Based on this, I have determined", status)
    //console.log("Running on element", element, status)
    require(["vendor/bootstrap/bootstrap.bundle"], function () {
        var popover = "<p>"
        var title = ""
        if (status == "ok_ico.gif") {
            title = "Success"
            popover =
                '<p class="dvPopover" href="" data-bs-toggle="popover" title="' +
                title +
                '" data-bs-trigger="hover" data-bs-content="All of the prerequisite checks were complete for this search, so you should be able to run it in your environment. Click the expand icon on the right to find out more, or for a link to the search.">'
        }
        if (status == "loader.gif") {
            title = "Loading"
            popover =
                '<p class="dvPopover" href="" data-bs-toggle="popover" title="' +
                title +
                '" data-bs-trigger="hover" data-bs-content="One or more of the prerequisite checks are still running for this search. Click the expand icon on the right to find out more, or for a link to the search.">'
        }
        if (status == "err_ico.gif") {
            title = "Error"
            popover =
                '<p class="dvPopover" href="" data-bs-toggle="popover" title="' +
                title +
                '" data-bs-trigger="hover" data-bs-content="One of more of the prerequisite checks for this search failed. Click the expand icon on the right to find which failed, and how to remediate those.">'
        }
        if ($("#" + element).find("img")[0]) {
            $("#" + element).html(
                popover +
                    '<img title="' +
                    title +
                    '" src="' +
                    Splunk.util.make_full_url(
                        "/static/app/Splunk_Security_Essentials/images/general_images/" +
                            status +
                            ""
                    ) +
                    '" ></p>'
            )
            $("#" + element)
                .find("p")
                .popover({
                    html: true,
                    trigger: "hover",
                })
        }
        pullVizForCompletedRows($("#" + element).parent(), true, element)
    })
}

function pullVizForCompletedRows(parentElement, doUpdate, idofelement) {
    let status_to_post = ""
    // console.log("Called with", parentElement, doUpdate)
    if (
        typeof window.result_tracking[parentElement.attr("id")] == "undefined"
    ) {
        window.result_tracking[parentElement.attr("id")] = {
            accel: 0,
            live: 0,
            error: 0,
        }
    }
    if (
        parentElement.find(".tableaccel").find("img").length &&
        parentElement
            .find(".tableaccel")
            .find("img")
            .attr("src")
            .match(/ok_ico.gif/) &&
        window.result_tracking[parentElement.attr("id")]["accel"] == 0
    ) {
        // Use Accelerated
        //  console.log("Got Accel for parentElement", fromHex(parentElement.attr("id").replace("row-","")), parentElement)
        //  console.log("Attempting to resolve to Summary", fromHex(parentElement.attr("id").replace("row-","")), window.SearchToShowcase[fromHex(parentElement.attr("id").replace("row-",""))])

        window.result_tracking[parentElement.attr("id")]["accel"] += 1
        status_to_post = "accel"
        if (doUpdate == true) {
            gotInferenceUpdate(idofelement)
            updateStatus(
                window.SearchToShowcase[
                    fromHex(parentElement.attr("id").replace("row-", ""))
                ],
                ShowcaseInfo["summaries"][
                    window.SearchToShowcase[
                        fromHex(parentElement.attr("id").replace("row-", ""))
                    ]
                ]["name"],
                "accel"
            )
        }
        addSearch(
            window.SearchToShowcase[
                fromHex(parentElement.attr("id").replace("row-", ""))
            ],
            "Accelerated Data",
            true
        )
    }
    if (
        ((parentElement.find(".tableaccel").find("img").length &&
            parentElement
                .find(".tableaccel")
                .find("img")
                .attr("src")
                .match(/err_ico.gif/)) ||
            parentElement.find(".tableaccel").find("a:contains(N/A)").length) &&
        parentElement.find(".tablelive").find("img").length &&
        parentElement
            .find(".tablelive")
            .find("img")
            .attr("src")
            .match(/ok_ico.gif/) &&
        window.result_tracking[parentElement.attr("id")]["live"] == 0
    ) {
        // Use Live
        //  console.log("Got Live for parentElement", fromHex(parentElement.attr("id").replace("row-","")), parentElement)
        //console.log("Attempting to resolve to Summary", fromHex(parentElement.attr("id").replace("row-","")), window.SearchToShowcase[fromHex(parentElement.attr("id").replace("row-",""))])
        window.result_tracking[parentElement.attr("id")]["live"] += 1
        status_to_post = "live"
        if (doUpdate == true) {
            gotInferenceUpdate(idofelement)
            updateStatus(
                window.SearchToShowcase[
                    fromHex(parentElement.attr("id").replace("row-", ""))
                ],
                ShowcaseInfo["summaries"][
                    window.SearchToShowcase[
                        fromHex(parentElement.attr("id").replace("row-", ""))
                    ]
                ]["name"],
                "live"
            )
        }
        addSearch(
            window.SearchToShowcase[
                fromHex(parentElement.attr("id").replace("row-", ""))
            ],
            "Live Data",
            true
        )
    }
    if (
        ((parentElement.find(".tableaccel").find("img").length &&
            parentElement
                .find(".tableaccel")
                .find("img")
                .attr("src")
                .match(/err_ico.gif/)) ||
            parentElement.find(".tableaccel").find("a:contains(N/A)").length) &&
        parentElement.find(".tablelive").find("img").length &&
        parentElement
            .find(".tablelive")
            .find("img")
            .attr("src")
            .match(/err_ico.gif/) &&
        window.result_tracking[parentElement.attr("id")]["error"] == 0
    ) {
        // Use Error
        // console.log("Got an Error for parentElement", fromHex(parentElement.attr("id").replace("row-","")), parentElement)
        //  console.log("Attempting to resolve to Summary", fromHex(parentElement.attr("id").replace("row-","")), window.SearchToShowcase[fromHex(parentElement.attr("id").replace("row-",""))])
        window.result_tracking[parentElement.attr("id")]["error"] += 1
        status_to_post = "error"
        if (doUpdate == true) {
            gotInferenceUpdate(idofelement)
            updateStatus(
                window.SearchToShowcase[
                    fromHex(parentElement.attr("id").replace("row-", ""))
                ],
                ShowcaseInfo["summaries"][
                    window.SearchToShowcase[
                        fromHex(parentElement.attr("id").replace("row-", ""))
                    ]
                ]["name"],
                "error"
            )
        }
        addSearch(
            window.SearchToShowcase[
                fromHex(parentElement.attr("id").replace("row-", ""))
            ],
            "Live Data",
            false
        )
    }

    if (
        $(parentElement).find("img[title=Loading]").length == 0 &&
        status_to_post != ""
    ) {
        // Hey, this time it's _actually_ done. What was I thinking with this function naming...
        // if(doUpdate == true){
        //     updateStatus(window.SearchToShowcase[fromHex(parentElement.attr("id").replace("row-",""))], ShowcaseInfo['summaries'][window.SearchToShowcase[fromHex(parentElement.attr("id").replace("row-",""))]]['name'], "error")
        // }
    }
}

function addSearch(SummaryName, ExampleName, status) {
    var visualizations = []
    var summary = window.ShowcaseInfo["summaries"][SummaryName]
    var sampleSearch = ""
    if (typeof summary != "undefined") {
        for (var i = 0; i < summary.examples.length; i++) {
            //console.log("Comparing", summary.examples[i].label, ExampleName)
            if (summary.examples[i].label == ExampleName) {
                //console.log("Got it! ", summary.examples[i].name)
                sampleSearch = window.Searches[summary.examples[i].name]
            }
        }
        if (typeof summary.visualizations != "undefined") {
            visualizations = summary.visualizations
        }
    }

    if (
        typeof sampleSearch.visualizations != "undefined" &&
        sampleSearch.visualizations.length > 0
    ) {
        for (var i = 0; i < sampleSearch.visualizations.length; i++) {
            if (typeof sampleSearch.visualizations[i].panel != "undefined") {
                var shouldAppend = true
                for (var g = 0; g < visualizations.length; g++) {
                    if (
                        sampleSearch.visualizations[i].panel ==
                        visualizations[g].panel
                    ) {
                        shouldAppend = false
                        visualizations[g] = sampleSearch.visualizations[i]
                    }
                }
                if (shouldAppend) {
                    visualizations.push(sampleSearch.visualizations[i])
                }
            }
        }
    }
    //  console.log("Final Viz for ", SummaryName, ExampleName, visualizations)
    for (var i = 0; i < visualizations.length; i++) {
        visualizations[i].status = status
        visualizations[i].sourceSummary = SummaryName // For alphabetical sorting
        window.Viz.push(visualizations[i])
    }
}

function runDebug(element) {
    // console.log("Got Element", element)
    masterSearch = window.datacheck[element]
    if (
        window.datacheck[masterSearch].myResults &&
        window.datacheck[masterSearch].myResults.data()
    ) {
        window.datacheck[masterSearch].resultSet =
            window.datacheck[masterSearch].myResults.data().results
    }
    if (
        window.datacheck[masterSearch].mainSearch &&
        window.datacheck[masterSearch].mainSearch.attributes
    ) {
        window.datacheck[masterSearch].mainSearchAttributes =
            window.datacheck[masterSearch].mainSearch.attributes
    }
    if (
        window.datacheck[masterSearch].mainSearch &&
        window.datacheck[masterSearch].mainSearch.attributes &&
        window.datacheck[masterSearch].mainSearch.attributes.data
    ) {
        window.datacheck[masterSearch].mainSearchAttributesData =
            window.datacheck[masterSearch].mainSearch.attributes.data
    }

    window.datacheck[masterSearch].callingDebug = $("#".element).html()
    //   console.log(window.datacheck[masterSearch].callingDebug)
    var myString = JSON.stringify(window.datacheck[masterSearch], null, 2)
    var confirmVizAlertModal = new Modal(
        "debug-" + element,
        {
            title: "View Debug",
            destroyOnHide: true,
            type: "wide",
        },
        $
    )
    confirmVizAlertModal.header.append(
        $("<button>")
            .addClass("close")
            .attr({
                type: "button",
                "data-dismiss": "modal",
                "data-bs-dismiss": "modal",
                "aria-label": "Close",
            })
            .append($("<span>").attr("aria-hidden", true).text("&times;"))
            .click(function () {
                confirmVizAlertModal.hide()
                $(".modal-backdrop.in").hide()
            })
    )

    $(confirmVizAlertModal.$el).on("hide", function () {
        // Not taking any action on hide...
    })
    // console.log("1", confirmVizAlertModal)
    // console.log("2", confirmVizAlertModal.body)
    var counter = 0
    confirmVizAlertModal.body.append(
        $(
            '<p>Here is the debug info</p><textarea style="width: 600px; height: 300px;" id="debugTextArea">' +
                myString +
                "</textarea>"
        )
    )
    confirmVizAlertModal.footer.append(
        $("<button>")
            .attr({
                type: "button",
                "data-dismiss": "modal",
                "data-bs-dismiss": "modal",
            })
            .addClass("btn btn-primary")
            .text("Close")
            .on("click", function () {
                // Not taking any action on Close
            })
    )

    confirmVizAlertModal.show()
}

function gotInferenceUpdate(elementId) {
    return // Not being used anymore
    if (typeof window.inferences[elementId] != "undefined") {
        let eventtypes = window.inferences[elementId].split("|")

        for (let i = 0; i < eventtypes.length; i++) {
            let eventtype = eventtypes[i]
            let newStatus = ""
            if (
                (typeof window.publishedInferences[eventtype] == "undefined" &&
                    $("#" + elementId).find("img").length > 0 &&
                    $("#" + elementId)
                        .find("img")
                        .attr("src")
                        .indexOf("ok_ico") >= 0) ||
                (typeof window.publishedInferences[eventtype] != "undefined" &&
                    window.publishedInferences[eventtype] != 100 &&
                    $("#" + elementId).find("img").length > 0 &&
                    $("#" + elementId)
                        .find("img")
                        .attr("src")
                        .indexOf("ok_ico") >= 0)
            ) {
                newStatus = 100
            } else if (
                typeof window.publishedInferences[eventtype] == "undefined" &&
                $("#" + elementId).find("img").length > 0 &&
                $("#" + elementId)
                    .find("img")
                    .attr("src")
                    .indexOf("err_ico") >= 0
            ) {
                newStatus = 0
            }

            if (newStatus !== "") {
                window.publishedInferences[eventtype] = newStatus

                var record = {
                    _time: new Date().getTime() / 1000,
                    _key: eventtype,
                    basesearch: "",
                    eventtypeId: eventtype,
                    status: newStatus,
                }

                $.ajax({
                    url:
                        $C["SPLUNKD_PATH"] +
                        "/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/data_inventory_eventtypes/",
                    type: "POST",
                    contentType: "application/json",
                    async: false,
                    data: JSON.stringify(record),
                    success: function (returneddata) {
                        bustCache()
                        newkey = returneddata
                        // console.log("Got a successful inference post", returneddata)
                    },
                    error: function (xhr, textStatus, error) {
                        bustCache()
                        // console.log("Error Updating!", xhr, textStatus, error)
                        // We aren't going to override an existing configuration.

                        // $.ajax({
                        //     url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/data_inventory_eventtypes/' + eventtype,
                        //     type: 'POST',
                        //     contentType: "application/json",
                        //     async: false,
                        //     data: JSON.stringify(record),
                        //     success: function(returneddata) { newkey = returneddata },
                        //     error: function(xhr, textStatus, error){
                        // //      console.log("Error Updating!", xhr, textStatus, error)
                        //     }
                        // })
                    },
                })

                require([
                    Splunk.util.make_full_url(
                        "/static/app/Splunk_Security_Essentials/components/data/sendTelemetry.js"
                    ),
                ], function (Telemetry) {
                    Telemetry.SendTelemetryToSplunk("DataStatusChange", {
                        status: newStatus,
                        selectionType: "data_source_check",
                        category: eventtype,
                    })
                })
            }
        }
    }
}

function updateStatus(element, elementName, status) {
    // fields_list = _key, _time, elementId, elementName, status
    var record = {
        _time: new Date().getTime() / 1000,
        _key: element,
        elementId: element,
        elementName: elementName,
        status: status,
    }

    $.ajax({
        url:
            $C["SPLUNKD_PATH"] +
            "/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/data_source_check_outputs/",
        type: "POST",
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            "X-Splunk-Form-Key": window.getFormKey(),
        },
        contentType: "application/json",
        async: false,
        data: JSON.stringify(record),
        success: function (returneddata) {
            bustCache()
            newkey = returneddata
        },
        error: function (xhr, textStatus, error) {
            $.ajax({
                url:
                    $C["SPLUNKD_PATH"] +
                    "/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/data_source_check_outputs/" +
                    element,
                type: "POST",
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    "X-Splunk-Form-Key": window.getFormKey(),
                },
                contentType: "application/json",
                async: false,
                data: JSON.stringify(record),
                success: function (returneddata) {
                    bustCache()
                    newkey = returneddata
                },
                error: function (xhr, textStatus, error) {
                    bustCache()
                    //      console.log("Error Updating!", xhr, textStatus, error)
                },
            })
        },
    })
}

function postDashboard(dashboardName, XML) {
    dashboardName = dashboardName
        .replace(/ /g, "_")
        .replace(/[^a-zA-Z0-9_\-]/g, "")
    var record = {
        "eai:data": XML,
        name: dashboardName,
    }

    $.ajax({
        url:
            $C["SPLUNKD_PATH"] +
            "/servicesNS/nobody/Splunk_Security_Essentials/data/ui/views/",
        data: record,
        contentType: "application/json",
        type: "POST",
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            "X-Splunk-Form-Key": window.getFormKey(),
        },
        success: function (data) {
            // Successful
        },
        error: function (data, error) {
            // Almost always dashboard already exists, should add error checking to code for HTTP 409
            var record = {
                "eai:data": XML,
            }
            $.ajax({
                url:
                    $C["SPLUNKD_PATH"] +
                    "/servicesNS/nobody/Splunk_Security_Essentials/data/ui/views/" +
                    dashboardName,
                data: record,
                contentType: "application/json",
                type: "POST",
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    "X-Splunk-Form-Key": window.getFormKey(),
                },
                success: function (data) {
                    // Successful
                },
                error: function (data, error) {
                    // Should add error handling
                },
            })
        },
    })
    return dashboardName
}

function GenerateDashboardModals() {
    // set the runtime environment, which controls cache busting
    var runtimeEnvironment = "production"

    // set the build number, which is the same one being set in app.conf
    var build = "10138"

    // get app and page names
    var pathComponents = location.pathname.split("?")[0].split("/")
    var appName = "Splunk_Security_Essentials"
    var pageIndex = pathComponents.indexOf(appName)
    var pageName = pathComponents[pageIndex + 1]

    // path to the root of the current app
    var appPath = "../app/" + appName

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
        "app/Splunk_Security_Essentials/components/controls/Modal",
    ], function ($, Modal) {
        if (
            window.SearchesInProgress.length == 0 &&
            window.SearchesComplete.length == 0
        ) {
            var myTestModal = new Modal(
                "blah",
                {
                    title: "Please Run Searches",
                    destroyOnHide: true,
                    type: "wide",
                },
                $
            )
            myTestModal.body.append(
                "<p>Please click the Run Searches button on the upper right, so the system can check what visualizations are available to with your data.</p>"
            )

            myTestModal.footer.append(
                $("<button>")
                    .addClass("mlts-modal-submit")
                    .attr({
                        type: "button",
                        "data-dismiss": "modal",
                        "data-bs-dismiss": "modal",
                    })
                    .addClass("btn btn-primary mlts-modal-submit")
                    .text("Close")
                    .on("click", function () {
                        // Not taking any action on Close
                    })
            )
            myTestModal.show()
        } else if (
            window.SearchesInProgress.length > 0 ||
            window.SearchesInQueue.length > 0
        ) {
            var myTestModal = new Modal(
                "blah",
                {
                    title: "Please Wait Until Searches Complete",
                    destroyOnHide: true,
                    type: "wide",
                },
                $
            )
            myTestModal.body.append(
                "<p>Please wait until searches complete before running.</p>"
            )

            myTestModal.footer.append(
                $("<button>")
                    .addClass("mlts-modal-submit")
                    .attr({
                        type: "button",
                        "data-dismiss": "modal",
                        "data-bs-dismiss": "modal",
                    })
                    .addClass("btn btn-primary mlts-modal-submit")
                    .text("Close")
                    .on("click", function () {
                        // Not taking any action on Close
                    })
            )
            myTestModal.show()
        } else {
            window.Viz.sort(function (a, b) {
                if (a.status == true && b.status != true) {
                    return -1
                }
                if (a.status != true && b.status == true) {
                    return 1
                }
                if (a.sourceSummary > b.sourceSummary) {
                    return 1
                }
                if (a.sourceSummary < b.sourceSummary) {
                    return -1
                }
                if (a.header > b.header) {
                    return 1
                }
                if (a.header < b.header) {
                    return -1
                }
                return 0
            })

            var AllViz = new Object()
            var template = $('<button class="btn viz"></button>')

            require([
                "jquery",
                Splunk.util.make_full_url(
                    "/static/app/Splunk_Security_Essentials/vendor/jquery.md5/jquery.md5.js"
                ),
            ], function ($) {
                window.Viz.forEach(function (singleViz) {
                    if (singleViz.header != "Broken") {
                        if (typeof AllViz[singleViz.dashboard] == "undefined") {
                            AllViz[singleViz.dashboard] = new Object()
                        }
                        if (
                            typeof AllViz[singleViz.dashboard][
                                singleViz.header
                            ] == "undefined"
                        ) {
                            AllViz[singleViz.dashboard][singleViz.header] = []
                        }
                        var myLocal = template.clone()
                        myLocal
                            .css("margin", "5px")
                            .css("padding-left", "40px")
                            .css("padding-right", "40px")
                            .css("max-width", "400px")
                            .css("white-space", "normal")
                            .css("position", "relative")
                        if (
                            typeof singleViz.description == "undefined" ||
                            singleViz.description == ""
                        ) {
                            myLocal.html(
                                '<i style="float: left; width: 20px; height: 20px; color: green; border: solid gray 1px; position: absolute; left: 5px; "></i><span class="panelTitle">' +
                                    singleViz.title +
                                    "</span>"
                            )
                        } else {
                            myLocal.html(
                                '<i style="float: left; width: 20px; height: 20px; color: green; border: solid gray 1px; position: absolute; left: 5px; "></i><span class="panelTitle">' +
                                    singleViz.title +
                                    '</span><hr style="margin-top: 3px; margin-bottom: 3px; margin-left: auto; margin-right: auto; width: 50%"><span class="panelDescription">' +
                                    singleViz.description +
                                    "</span>"
                            )
                        }
                        if (singleViz.status == false) {
                            myLocal
                                .attr("disabled", "disabled")
                                .addClass("disabled")
                            myLocal.find("i").css("display", "none")
                            myLocal
                                .css("padding-left", "20px")
                                .css("padding-right", "20px")
                            var links = []
                            window.ShowcaseInfo["summaries"][
                                singleViz.sourceSummary
                            ].datasource
                                .split("|")
                                .forEach(function (source) {
                                    links.push(
                                        '<a href="data_source?datasource=' +
                                            source.replace(/ /g, "%20") +
                                            '" target="_blank">' +
                                            source +
                                            "</a>"
                                    )
                                })

                            myLocal.append(
                                '<hr style="margin-top: 3px; margin-bottom: 3px; margin-left: auto; margin-right: auto; width: 50%"><span class="panelDescription">Missing Data Sources:<br/>' +
                                    links.join(", ") +
                                    "</span>"
                            )
                        } else {
                            if (
                                typeof singleViz.recommended == "undefined" ||
                                singleViz.recommended == true
                            ) {
                                myLocal.addClass("active")
                                myLocal.find("i").toggleClass("icon-check")
                            }
                            myLocal.click(function (evt) {
                                var obj = $(evt.target)
                                if (obj.is("button") != true) {
                                    obj = obj.closest("button")
                                }
                                obj.toggleClass("active")
                                obj.find("i").toggleClass("icon-check")
                                CalculateStatusForDashboardHeader(
                                    obj.closest(".dashboardViz")
                                )
                            })
                        }
                        AllViz[singleViz.dashboard][singleViz.header].push(
                            myLocal
                        )
                    }
                })

                var vizOptionsModal = new Modal(
                    "VizOptionPanel",
                    {
                        title: "Available Visualizations",
                        destroyOnHide: true,
                        type: "wide",
                    },
                    $
                )
                vizOptionsModal.$el
                    .css("width", "90%")
                    .css("margin-left", "-45%")
                    .css("height", window.innerHeight - 50 + "px")

                vizOptionsModal.body
                    .append(
                        '<p>Below, please find the list of available dashboard elements. We have taken the liberty of enabling several dashboard panels that are frequently requested, but you can click on or off any panels based on your needs. To ensure a good user experience, we\'ve disabled any panels for which you do not have the required data.</p><div id="viz_elements"></div> '
                    )
                    .css("overflow", "scroll")

                vizOptionsModal.footer
                    .append(
                        $("<button>")
                            .attr({
                                type: "button",
                                class: "btn btn-secondary",
                                "data-dismiss": "modal",
                                "data-bs-dismiss": "modal",
                            })
                            .text("Cancel")
                            .on("click", function () {
                                // Not taking any action on Close
                            })
                    )
                    .append(
                        $("<button>")
                            .attr({
                                type: "button",
                            })
                            .addClass("btn btn-primary")
                            .text("Create Dashboards")
                            .on("click", function () {
                                // Not taking any action on Close
                                var newDashboards = $("<div>").html(
                                    "<p>Dashboard(s) complete, and added into the navigation! (You'll see them on the next page you open up.) You can also click below to open them.</p>"
                                )
                                var listOfDashboards = []
                                $(
                                    ".dashboardViz:has(button.viz.active):has(.dashboardEnabled:checked)"
                                ).each(function (num, obj) {
                                    var dashboardViz = $(obj)
                                    var simpleXML =
                                        '<form version="1.1">\n\t<label>' +
                                        dashboardViz.find("h2").text() +
                                        "</label>\nBASESEARCHPLACEHOLDER"
                                    simpleXML +=
                                        '\n\t<fieldset submitButton="false">\n\t\t<input type="time" token="timerange">\n\t\t\t<label></label>\n\t\t\t<default>\n\t\t\t\t<earliest>-7d@d</earliest>\n\t\t\t\t<latest>now</latest>\n\t\t\t</default>\n\t\t\n\t</input></fieldset>'
                                    var baseSearch = new Object()
                                    dashboardViz
                                        .find(
                                            ".headerViz:has(button.viz.active)"
                                        )
                                        .each(function (num, obj) {
                                            var headerViz = $(obj)
                                            var row =
                                                "\n\t<row>\n\t\t<panel>\n\t\t\t<title>" +
                                                headerViz.find("h3").text() +
                                                "</title>\n\t\t\t<html>\n\t\t\t</html>\n\t\t</panel>\n\t</row>\n\t<row>"
                                            headerViz
                                                .find("button.viz.active")
                                                .each(function (num, obj) {
                                                    var button = $(obj)
                                                    row +=
                                                        "\n\t\t<panel>\n\t\t\t<title>" +
                                                        button
                                                            .find(".panelTitle")
                                                            .text() +
                                                        "</title>"
                                                    if (
                                                        button.find(
                                                            ".panelDescription"
                                                        ).length >= 1
                                                    ) {
                                                        row +=
                                                            "\n\t\t\t<description>" +
                                                            button
                                                                .find(
                                                                    ".panelDescription"
                                                                )
                                                                .text() +
                                                            "</description>"
                                                    }
                                                    window.Viz.forEach(
                                                        function (singleViz) {
                                                            if (
                                                                singleViz.title ==
                                                                button
                                                                    .find(
                                                                        ".panelTitle"
                                                                    )
                                                                    .text()
                                                            ) {
                                                                var BaseSearchRef =
                                                                    ""
                                                                //                 console.log("Analyzing singleViz", singleViz)
                                                                if (
                                                                    typeof singleViz.basesearch !=
                                                                    "undefined"
                                                                ) {
                                                                    BaseSearchRef =
                                                                        ' base="search' +
                                                                        $.md5(
                                                                            singleViz.basesearch
                                                                        ) +
                                                                        '"'
                                                                    baseSearch[
                                                                        $.md5(
                                                                            singleViz.basesearch
                                                                        )
                                                                    ] =
                                                                        '\n\t<search id="search' +
                                                                        $.md5(
                                                                            singleViz.basesearch
                                                                        ) +
                                                                        '">\n\t\t<query>' +
                                                                        splunkEncode(
                                                                            singleViz.basesearch
                                                                        ) +
                                                                        "</query>\n\t\t<earliest>$timerange.earliest$</earliest>\n\t\t<latest>$timerange.latest$</latest>\n\t</search>"
                                                                }
                                                                row +=
                                                                    "\n\t\t\t<" +
                                                                    singleViz.vizType +
                                                                    ">"
                                                                row +=
                                                                    "\n\t\t\t\t<search" +
                                                                    BaseSearchRef +
                                                                    ">"
                                                                row +=
                                                                    "\n\t\t\t\t\t<query>" +
                                                                    splunkEncode(
                                                                        singleViz.search
                                                                    ) +
                                                                    "</query>"
                                                                if (
                                                                    typeof singleViz.basesearch ==
                                                                    "undefined"
                                                                ) {
                                                                    row +=
                                                                        "\n\t\t\t\t\t<earliest>$timerange.earliest$</earliest>\n\t\t\t\t\t<latest>$timerange.latest$</latest>\n\t"
                                                                }
                                                                row +=
                                                                    "\n\t\t\t\t</search>"
                                                                for (var param in singleViz.vizParameters) {
                                                                    row +=
                                                                        '\n\t\t\t\t<option name="' +
                                                                        param +
                                                                        '">' +
                                                                        singleViz
                                                                            .vizParameters[
                                                                            param
                                                                        ] +
                                                                        "</option>"
                                                                }
                                                                row +=
                                                                    "\n\t\t\t</" +
                                                                    singleViz.vizType +
                                                                    ">"

                                                                if (
                                                                    typeof singleViz.description !=
                                                                        "undefined" &&
                                                                    singleViz.description !=
                                                                        ""
                                                                ) {
                                                                    row +=
                                                                        "\n\t\t\t<html><p>" +
                                                                        button
                                                                            .find(
                                                                                ".panelDescription"
                                                                            )
                                                                            .text() +
                                                                        "</p></html>"
                                                                }
                                                            }
                                                        }
                                                    )
                                                    row += "\n\t\t</panel>"
                                                })
                                            row += "\n\t</row>"
                                            row = row
                                                .replace(
                                                    /ChartElement/g,
                                                    "chart"
                                                )
                                                .replace(
                                                    /SingleElement/g,
                                                    "single"
                                                )
                                                .replace(/MapElement/g, "map")
                                                .replace(
                                                    /TableElement/g,
                                                    "table"
                                                )
                                            simpleXML += row
                                        })
                                    simpleXML += "\n</form>"
                                    var allBaseSearches = ""
                                    for (var bsid in baseSearch) {
                                        allBaseSearches += baseSearch[bsid]
                                    }
                                    simpleXML = simpleXML.replace(
                                        /BASESEARCHPLACEHOLDER/,
                                        allBaseSearches
                                    )
                                    var officialDashboardName = postDashboard(
                                        dashboardViz.find("h2").text(),
                                        simpleXML
                                    )
                                    newDashboards.append(
                                        $("<p>").append(
                                            $("<a>")
                                                .attr("target", "_blank")
                                                .attr(
                                                    "href",
                                                    officialDashboardName
                                                )
                                                .text(
                                                    dashboardViz
                                                        .find("h2")
                                                        .text()
                                                )
                                        )
                                    )
                                    listOfDashboards.push(officialDashboardName)
                                })
                                AddPostureDashboardsToNav(listOfDashboards)
                                vizOptionsModal.hide()

                                var myCompletedModal = new Modal(
                                    "completedModal",
                                    {
                                        title: "Dashboards Complete!",
                                        destroyOnHide: true,
                                        type: "wide",
                                    },
                                    $
                                )
                                myCompletedModal.body.append(newDashboards)

                                myCompletedModal.footer.append(
                                    $("<button>")
                                        .attr({
                                            type: "button",
                                            "data-dismiss": "modal",
                                            "data-bs-dismiss": "modal",
                                        })
                                        .addClass("btn btn-primary")
                                        .text("Close")
                                )
                                myCompletedModal.show()
                            })
                    )
                for (var dashboard in AllViz) {
                    //   console.log("dvtest", AllViz)
                    var dashboardDiv = $(
                        '<div class="dashboardViz"></div>'
                    ).append(
                        $('<div class="dashboardHeader">').append(
                            $(
                                '<input type="checkbox" class="dashboardEnabled">'
                            ),
                            $('<h2 class="dashboardName">').text(dashboard),
                            $('<div class="dashboardStatus">')
                        )
                    )
                    dashboardDiv
                        .find(".dashboardEnabled")
                        .css("margin-top", "0px")
                        .css("margin-right", "10px")
                        .click(function (evt) {
                            var dashboardDiv = $(evt.target).closest(
                                ".dashboardViz"
                            )
                            if (evt.target.checked) {
                                dashboardDiv
                                    .find(".headerViz")
                                    .css("display", "block")
                            } else {
                                dashboardDiv
                                    .find(".headerViz")
                                    .css("display", "none")
                            }
                            CalculateStatusForDashboardHeader(dashboardDiv)
                            dashboardDiv
                                .closest(".modal-body")
                                .css(
                                    "max-height",
                                    window.innerHeight - 175 + "px"
                                )
                        })
                    dashboardDiv.find(".dashboardName").css("display", "inline")
                    dashboardDiv.find(".dashboardStatus").css("float", "right")
                    dashboardDiv
                        .css("border", "1.5px gray solid")
                        .css("border-radius", "15px")
                        .css("padding", "15px")
                        .css("margin-top", "5px")
                        .css("margin-bottom", "5px")
                    for (var header in AllViz[dashboard]) {
                        var headerDiv = $(
                            '<div class="headerViz" style="display: none;"></div>'
                        ).append($("<h3>").text(header))
                        for (
                            var i = 0;
                            i < AllViz[dashboard][header].length;
                            i++
                        ) {
                            headerDiv.append(AllViz[dashboard][header][i])
                        }
                        dashboardDiv.append(headerDiv)
                    }
                    CalculateStatusForDashboardHeader(dashboardDiv)
                    vizOptionsModal.body
                        .find("#viz_elements")
                        .append(dashboardDiv)
                }
                vizOptionsModal.body
                    .find("#viz_elements")
                    .append(
                        '<div><p><a href="" id="loadDemoLink">Use Demo Datasets</a></p></div>'
                    )
                vizOptionsModal.body.find("#loadDemoLink").click(function () {
                    PushDemoDashboards()
                    return false
                })

                vizOptionsModal.show()
            })
        }
    })
}

function splunkEncode(str) {
    return str.replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

function CalculateStatusForDashboardHeader(element) {
    //  console.log("Running on dashboard header for", element)
    var active = 0
    if (element.find(".dashboardEnabled")[0].checked) {
        active = element.find("button.active").length
    }
    var total = element.find("button").length
    var available = total - element.find("button[disabled]").length
    element.find(".dashboardStatus").html("")
    element
        .find(".dashboardStatus")
        .append(
            $(
                "<span><b>" +
                    active +
                    "</b> selected " +
                    '<span style="color: gray">|&nbsp;</span></span>'
            ),
            $(
                "<span>" +
                    available +
                    ' available <span style="color: gray">|&nbsp;</span></span>'
            ),
            $("<span>" + total + " total</span>")
        )
    CheckWhetherAnyDashboardsAreEnabled()
}

function CheckWhetherAnyDashboardsAreEnabled() {
    var count = 0
    $(".dashboardStatus").each(function (num, obj) {
        count += parseInt(
            $(obj)
                .text()
                .replace(/ selected.*/, "")
        )
    })
    if (count == 0) {
        $(".dashboardStatus")
            .first()
            .closest(".modal")
            .find(".modal-footer")
            .find(".btn-primary")
            .addClass("disabled")
            .attr("disabled", "disabled")
    } else {
        $(".dashboardStatus")
            .first()
            .closest(".modal")
            .find(".modal-footer")
            .find(".btn-primary")
            .removeClass("disabled")
            .removeAttr("disabled")
    }
}

function AddPostureDashboardsToNav(listOfDashboards) {
    // They're already in nav now (why I didn't do this before was.. hard to imagine)
    return true
    var dashboardStr = ""
    for (var i = 0; i < listOfDashboards.length; i++) {
        dashboardStr += '\n    <view name="' + listOfDashboards[i] + '"></view>'
    }
    if (dashboardStr != "") {
        $.ajax({
            url:
                $C["SPLUNKD_PATH"] +
                "/servicesNS/nobody/Splunk_Security_Essentials/data/ui/nav/default",

            type: "GET",
            success: function (data) {
                var newNav = $(data)
                    .find("[name='eai:data']")
                    .text()
                    .replace(
                        /<collection label="Posture Dashboards">[\n\s!-~]*?<\/collection>\n/,
                        ""
                    )
                    .replace(
                        /<\/nav>/,
                        '  <collection label="Posture Dashboards">' +
                            dashboardStr +
                            "\n  </collection>\n</nav>"
                    )

                var data = {
                    "eai:data": newNav,
                }
                //           console.log("Moving forward with this new nav", newNav, data)
                $.ajax({
                    url:
                        $C["SPLUNKD_PATH"] +
                        "/servicesNS/nobody/Splunk_Security_Essentials/data/ui/nav/default",
                    data: data,
                    type: "POST",
                    success: function (data) {
                        // Eh, sit around
                    },
                    error: function (data, error) {
                        // Error Handling? We don't need no stinkin' error handling!
                    },
                })
            },
            error: function (data, error) {
                //      console.error("Error!", data, error);
            },
        })
    }
}

function FinalizeSearches() {
    for (var obj in splunkjs.mvc.Components.attributes) {
        if (
            typeof splunkjs.mvc.Components.getInstance(obj).attributes !=
                "undefined" &&
            typeof splunkjs.mvc.Components.getInstance(obj).attributes.search !=
                "undefined"
        ) {
            splunkjs.mvc.Components.getInstance(obj).cancel()
        }
    }
    window.SearchesInProgress = []
    window.SearchesInQueue = []
}

function RecordStatusOfPreCheck() {
    window.startdvtest = 0
    $(".tableaccel,.tablelive,.tabledemo").each(function (num, obj) {
        window.startdvtest += 1
        // console.log("Iterating ", window.startdvtest)
        var status = ""
        if ($(obj).find("img").length > 0) {
            if (
                $(obj)
                    .find("img")
                    .attr("src")
                    .match(/ok_ico.gif/)
            ) {
                status = "Good"
            } else if (
                $(obj)
                    .find("img")
                    .attr("src")
                    .match(/err_ico.gif/)
            ) {
                status = "Error"
            } else if (
                $(obj)
                    .find("img")
                    .attr("src")
                    .match(/loader.gif/)
            ) {
                status = "NotComplete"
            }
        } else if ($(obj).find("a:contains(N/A)").length > 0) {
            status = "NotApplicable"
        }
        if (
            status != "NotApplicable" &&
            typeof status != "undefined" &&
            status != ""
        ) {
            var searchId = obj.id
            var searchName = fromHex(searchId)
                .replace(/-live/, " - Live")
                .replace(/-demo/, " - Demo")
                .replace(/-accel/, " - Accelerated")

            try {
                var showcaseId = SearchToShowcase[searchName]
                if (showcaseId) {
                    //console.log("Here's our Status and ID", status, searchId, searchName, showcaseId)
                    var showcaseName =
                        ShowcaseInfo["summaries"][showcaseId].name
                    //console.log("Here's our Status and ID", status, searchName, searchId, showcaseId, showcaseName)
                    UpdateSearchKVstore(
                        status,
                        searchName,
                        searchId,
                        showcaseId,
                        showcaseName
                    )
                }
            } catch (error) {}
        }
    })
}

function UpdateSearchKVstore(
    status,
    searchName,
    searchId,
    showcaseId,
    showcaseName
) {
    var record = {
        _time: new Date().getTime() / 1000,
        _key: searchId,
        searchId: searchId,
        searchName: searchName,
        showcaseId: showcaseId,
        showcaseName: showcaseName,
        status: status,
    }

    $.ajax({
        url:
            $C["SPLUNKD_PATH"] +
            '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/data_source_check/?query={"_key": "' +
            searchId +
            '"}',
        type: "GET",
        contentType: "application/json",
        async: true,
        success: function (returneddata) {
            if (returneddata.length == 0) {
                // New

                $.ajax({
                    url:
                        $C["SPLUNKD_PATH"] +
                        "/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/data_source_check/",
                    type: "POST",
                    headers: {
                        "X-Requested-With": "XMLHttpRequest",
                        "X-Splunk-Form-Key": window.getFormKey(),
                    },
                    contentType: "application/json",
                    async: true,
                    data: JSON.stringify(record),
                    success: function (returneddata) {
                        newkey = returneddata
                    },
                    error: function (xhr, textStatus, error) {},
                })
            } else {
                // Old
                $.ajax({
                    url:
                        $C["SPLUNKD_PATH"] +
                        "/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/data_source_check/" +
                        searchId,
                    type: "POST",
                    headers: {
                        "X-Requested-With": "XMLHttpRequest",
                        "X-Splunk-Form-Key": window.getFormKey(),
                    },
                    contentType: "application/json",
                    async: true,
                    data: JSON.stringify(record),
                    success: function (returneddata) {
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

function RetrieveSearchKVstore() {
    if (
        typeof window.KVStoreHistory != "undefined" &&
        window.KVStoreHistory.length > 1
    ) {
        var result = new Object()
        result["Good"] =
            '<p class="dvPopover" href="" data-bs-original-title="Success" data-bs-toggle="popover" title="Success" data-bs-trigger="hover" data-bs-content="All of the prerequisite checks were complete for this search, so you should be able to run it in your environment. Click the expand icon on the right to find out more, or for a link to the search."><img title="Success" src="' +
            Splunk.util.make_full_url(
                "/static/app/Splunk_Security_Essentials/images/general_images/ok_ico.gif"
            ) +
            '"></p>'
        result["Error"] =
            '<p class="dvPopover" href="" data-bs-original-title="Error" data-bs-toggle="popover" title="Error" data-bs-trigger="hover" data-bs-content="One of more of the prerequisite checks for this search failed. Click the expand icon on the right to find which failed, and how to remediate those."><img title="Error" src="' +
            Splunk.util.make_full_url(
                "/static/app/Splunk_Security_Essentials/images/general_images/err_ico.gif"
            ) +
            '"></p>'
        result["NotComplete"] =
            '<p class="dvPopover" href="" data-bs-original-title="Loading" data-bs-toggle="popover" title="Loading" data-bs-trigger="hover" data-bs-content="One or more of the prerequisite checks are still running for this search. Click the expand icon on the right to find out more, or for a link to the search."><img title="Loading" src="' +
            Splunk.util.make_full_url(
                "/static/app/Splunk_Security_Essentials/images/general_images/loader.gif"
            ) +
            '"></p>'

        for (var i = 0; i < window.KVStoreHistory.length; i++) {
            //         console.log("Looking up ", $(window.KVStoreHistory[i]['_key']), "and with status", window.KVStoreHistory[i].status)
            $("#" + window.KVStoreHistory[i]["_key"]).html(
                result[window.KVStoreHistory[i].status]
            )
            var exampleName = ""
            //       console.log("Looking for the examples for", window.KVStoreHistory[i].showcaseId)
            if (
                window.ShowcaseInfo["summaries"][
                    window.KVStoreHistory[i].showcaseId
                ] &&
                window.ShowcaseInfo["summaries"][
                    window.KVStoreHistory[i].showcaseId
                ].examples
            ) {
                for (
                    var g = 0;
                    g <
                    window.ShowcaseInfo["summaries"][
                        window.KVStoreHistory[i].showcaseId
                    ].examples.length;
                    g++
                ) {
                    if (
                        window.ShowcaseInfo["summaries"][
                            window.KVStoreHistory[i].showcaseId
                        ].examples[g].name ==
                        window.KVStoreHistory[i].searchName
                    ) {
                        exampleName =
                            window.ShowcaseInfo["summaries"][
                                window.KVStoreHistory[i].showcaseId
                            ].examples[g].label
                    }
                }
            }
            var status = false
            if (window.KVStoreHistory[i].status == "Good") {
                status = true
            }
            //    console.log("Adding Search", window.KVStoreHistory[i].showcaseId, exampleName, status)
            //addSearch(window.KVStoreHistory[i].showcaseId, exampleName, status)
        }
        $("td.tableaccel:empty").html(
            '<p class="dvPopover" href="" data-bs-toggle="popover" title="Not Applicable" data-bs-trigger="hover" data-bs-content="We do not currently have a search that leverages the accelerated data.">' +
                '<span style="color: black;" title="Not Applicable (no search present)">N/A</span>' +
                "</p>"
        )
        window.SearchesComplete = window.SearchesInQueue
        window.SearchesInQueue = []

        $("tr.dvbanner").each(function (num, obj) {
            pullVizForCompletedRows($(obj), false)
        })

        $('img[title="In Queue..."]').each(function (num, obj) {
            let td = $(obj).parent()
            let link = $(
                '<a href="" title="Detailed status not provided when restoring from kvstore." click="return false;">?</a>'
            )
            td.html(link)
            td.find(link).tooltip()
        })
        require(["vendor/bootstrap/bootstrap.bundle"], function () {
            if ($(".dvTooltip").length > 0) {
                $(".dvTooltip").tooltip({ html: true })
            }
            if ($(".dvPopover").length > 0) {
                $(".dvPopover").popover({
                    html: true,
                    trigger: "hover",
                })
            }
        })
    }
}

function PushDemoDashboards() {
    $("button.close").click()
    window.Viz = []
    var stages = [0, 0, 0, 0, 0, 0, 0]
    Object.keys(window.ShowcaseInfo.summaries).forEach(function (obj) {
        stages[0]++
        if (typeof window.ShowcaseInfo.summaries[obj] != "undefined") {
            stages[1]++
            var examples = window.ShowcaseInfo.summaries[obj].examples
            if (typeof examples != "undefined") {
                stages[2]++
                examples.forEach(function (example) {
                    stages[3]++
                    if (example.name.match(/ - Demo/)) {
                        stages[4]++
                        if (
                            typeof window.Searches[example.name] !=
                                "undefined" &&
                            typeof window.Searches[example.name]
                                .visualizations != "undefined" &&
                            window.Searches[example.name].visualizations
                                .length >= 1
                        ) {
                            stages[5]++
                            window.Searches[
                                example.name
                            ].visualizations.forEach(function (viz) {
                                stages[6]++
                                viz.status = true
                                viz.sourceSummary = obj // For alphabetical sorting
                                window.Viz.push(viz)
                            })
                        }
                    }
                })
            }
        }
    })
    // console.log(stages)
    GenerateDashboardModals()
}
