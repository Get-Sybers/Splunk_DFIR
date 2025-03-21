"use strict"

define([
    "jquery",
    "underscore",
    "module",
    "showdown",
    "components/data/sendTelemetry",
    "components/controls/BuildTile",
    "splunkjs/mvc/searchmanager",
    "splunkjs/mvc/simplexml/element/chart",
    "splunkjs/mvc/simplexml/element/map",
    "splunkjs/mvc/simplexml/element/table",
    "splunkjs/mvc/simplexml/element/single",
    "splunkjs/mvc/resultslinkview",
    "vendor/jquery.highlight/highlight.pack",
    "json!" +
    $C["SPLUNKD_PATH"] +
    "/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/bookmark_names",
    "components/controls/SavedSearchSelectorModal",
    Splunk.util.make_full_url(
        "/static/app/Splunk_Security_Essentials/components/data/common_data_objects.js"
    ),
], function (
    $,
    _,
    module,
    showdown,
    Telemetry,
    BuildTile,
    SearchManager,
    ChartElement,
    MapElement,
    TableElement,
    SingleElement,
    ResultsLinkView,
    hljs,
    bookmark_names,
    SavedSearchSelectorModal
) {
    var config = module.config()
    let searchManId = 1
    return {
        runPreReqs: function runPreReqs(prereqs) {
            if (prereqs.length > 0) {
                $.ajax({
                    url:
                        $C["SPLUNKD_PATH"] +
                        "/services/apps/local?output_mode=json&count=0",
                    type: "GET",
                    async: false,
                    success: function (returneddata) {
                        for (let i = 0; i < returneddata["entry"].length; i++) {
                            if (
                                returneddata["entry"][i].name ==
                                "SplunkEnterpriseSecuritySuite"
                            ) {
                                localStorage["isESInstalled"] = "true"
                            }
                        }
                        if (!localStorage["isESInstalled"]) {
                            localStorage["isESInstalled"] = "false"
                        }
                    },
                    error: function (xhr, textStatus, error) {
                        localStorage["isESInstalled"] = "false"
                    },
                })
                window.aggregateStatus = { total: 0, success: 0, failure: 0 }
                window.datacheck = []
                //console.log("Got " + prereqs.length + " prereqs!",prereqs);
                var prereqTable = $(
                    '<div id="row11" class="dashboard-row dashboard-row1 splunk-view">        <div id="panel11" class="dashboard-cell last-visible splunk-view" style="width: 100%;">            <div class="dashboard-panel clearfix" style="min-height: 0px;"><div id="view_22841" class="fieldset splunk-view editable hide-label hidden empty"></div>                                <div class="panel-element-row">                    <div id="element11" class="dashboard-element html splunk-view" style="width: 100%;">                        <div class="panel-body html"><label class=""><strong>Prerequisites</strong></label>                            <table class="table table-striped" id="data_check_table" >                            <tr><td><strong>Check</strong></td><td><strong>Status</strong></td><td><strong>Open in Search</strong></td><td><strong>Resolution (if needed)</strong></td></tr>                            </table>                        </div>                    </div>                </div>            </div>        </div>    </div>'
                )

                if (
                    ["showcase_security_content"].indexOf(
                        splunkjs.mvc.Components.getInstance("env").toJSON()[
                        "page"
                        ]
                    ) == -1
                ) {
                    prereqTable.insertBefore($(".fieldset").first())
                } else {
                    prereqTable.insertBefore($("#layout1").first())
                }

                for (var i = 0; i < prereqs.length; i++) {
                    window.datacheck[i] = new Object()
                    // create table entry including unique id for the status

                    //$("#data_check_table tr:last").after("<tr><td>" + prereqs[i].name + "</td><td id=\"data_check_test" + i + "\"><img title=\"Checking...\" src=\"" + Splunk.util.make_full_url("/static//app/Splunk_Security_Essentials/images/general_images/loader.gif") + "\"></td><td><a target=\"_blank\" href=\"" + Splunk.util.make_full_url("/app/Splunk_Security_Essentials/search?q=" + encodeURI(prereqs[i].test)) + "\">Open in Search</a></td><td>" + prereqs[i].resolution + "</td></tr>")
                    $("#data_check_table tr:last").after(
                        "<tr><td>" +
                        prereqs[i].name +
                        '</td><td id="data_check_test' +
                        i +
                        '"><div class="updatestatusicon spinner-border"></div></td><td><a target="_blank" href="' +
                        Splunk.util.make_full_url(
                            "/app/Splunk_Security_Essentials/search?q=" +
                            encodeURI(prereqs[i].test)
                        ) +
                        '">Open in Search</a></td><td>' +
                        prereqs[i].resolution +
                        "</td></tr>"
                    )

                    // create search manager

                    window.datacheck[i].mainSearch = new SearchManager(
                        {
                            id: "data_check_search" + i,
                            cancelOnUnload: true,
                            latest_time: "",
                            status_buckets: 0,
                            earliest_time: "0",
                            search: prereqs[i].test,
                            app: appName,
                            auto_cancel: 90,
                            preview: true,
                            runWhenTimeIsUndefined: false,
                        },
                        { tokens: true, tokenNamespace: "submitted" }
                    )
                    prereqs[i]["searchManagerId"] = "data_check_search" + i

                    window.datacheck[i].myResults = window.datacheck[
                        i
                    ].mainSearch.data("results", {
                        output_mode: "json",
                        count: 0,
                    })

                    window.datacheck[i].myResults.on(
                        "data",
                        function (properties) {
                            updateMacroConditions(
                                properties.attributes.manager.id
                            )
                        }
                    )

                    window.datacheck[i].mainSearch.on(
                        "search:start",
                        function (properties) {
                            window.aggregateStatus.total++
                        }
                    )
                    window.datacheck[i].mainSearch.on(
                        "search:error",
                        function (properties) {
                            var searchName = properties.content.request.label
                            var myCheckNum = searchName.substr(17, 20)
                            $("#row11").css("display", "block")
                            document.getElementById(
                                "data_check_test" + myCheckNum
                            ).innerHTML =
                                '<img title="Error" src="' +
                                Splunk.util.make_full_url(
                                    "/static//app/Splunk_Security_Essentials/images/general_images/err_ico.gif"
                                ) +
                                '">'
                            $("#data_check_test" + myCheckNum)
                                .parent()
                                .find("button")
                                .removeAttr("disabled")
                            // console.log("Data Check Failure code 3", searchName, myCheckNum, prereqs[myCheckNum])
                        }
                    )
                    window.datacheck[i].mainSearch.on(
                        "search:fail",
                        function (properties) {
                            var searchName = properties.content.request.label
                            var myCheckNum = searchName.substr(17, 20)
                            $("#row11").css("display", "block")
                            document.getElementById(
                                "data_check_test" + myCheckNum
                            ).innerHTML =
                                '<img title="Error" src="' +
                                Splunk.util.make_full_url(
                                    "/static//app/Splunk_Security_Essentials/images/general_images/err_ico.gif"
                                ) +
                                '">'
                            $("#data_check_test" + myCheckNum)
                                .parent()
                                .find("button")
                                .removeAttr("disabled")
                            // console.log("Data Check Failure code 4", searchName, myCheckNum, prereqs[myCheckNum])
                        }
                    )
                    window.datacheck[i].mainSearch.on(
                        "search:done",
                        function (properties) {
                            var searchName = properties.content.request.label
                            var myCheckNum = searchName.substr(17, 20)

                            if (
                                window.datacheck[myCheckNum].mainSearch
                                    .attributes.data.resultCount == 0 ||
                                !window.datacheck[
                                    myCheckNum
                                ].myResults.hasData()
                            ) {
                                document.getElementById(
                                    "data_check_test" + myCheckNum
                                ).innerHTML =
                                    '<img title="Error" src="' +
                                    Splunk.util.make_full_url(
                                        "/static//app/Splunk_Security_Essentials/images/general_images/err_ico.gif"
                                    ) +
                                    '">'
                                $("#data_check_test" + myCheckNum)
                                    .parent()
                                    .find("button")
                                    .removeAttr("disabled")
                                //console.log("Data Check Failure code 1", searchName, myCheckNum)
                                return
                            }

                            updateMacroConditions(
                                window.datacheck[myCheckNum].myResults
                                    .attributes.manager.id
                            )
                        }
                    )
                    function updateMacroConditions(searchName) {
                        try {
                            var myCheckNum = searchName.substr(17, 20)
                            var data =
                                window.datacheck[myCheckNum].myResults.data()
                                    .results
                            let prereq_value = []

                            let status = false
                            if (
                                typeof data[0][prereqs[myCheckNum].field] !==
                                "undefined"
                            ) {
                                status = true
                                prereq_value[prereqs[myCheckNum].id] =
                                    data[0][prereqs[myCheckNum].field]
                                if (
                                    typeof prereqs[myCheckNum]
                                        .greaterorequalto !== "undefined"
                                ) {
                                    if (
                                        data[0][prereqs[myCheckNum].field] >=
                                        prereqs[myCheckNum].greaterorequalto
                                    ) {
                                        status = true
                                    } else {
                                        status = false
                                    }
                                }
                            }

                            if (status) {
                                document.getElementById(
                                    "data_check_test" + myCheckNum
                                ).innerHTML =
                                    '<img title="Success" src="' +
                                    Splunk.util.make_full_url(
                                        "/static//app/Splunk_Security_Essentials/images/general_images/ok_ico.gif"
                                    ) +
                                    '">'
                                let data_check_test_button = $(
                                    "#data_check_test" + myCheckNum
                                )
                                    .parent()
                                    .find("button")

                                //If this is an Add Macro button we change to Edit Macro
                                if (
                                    $(data_check_test_button).html() ==
                                    "Add Macro"
                                ) {
                                    $(data_check_test_button).removeAttr(
                                        "disabled"
                                    )
                                    $(data_check_test_button).text("Edit Macro")
                                    $(data_check_test_button).addClass(
                                        "external"
                                    )
                                    $(data_check_test_button).prop(
                                        "title",
                                        "Click to Edit Macro"
                                    )
                                    $(data_check_test_button).on(
                                        "click",
                                        function () {
                                            let macro_name = $(
                                                data_check_test_button
                                            )
                                                .attr("id")
                                                .split("add-macro-")[1]
                                            let obj = summary.macros.find(
                                                (element) =>
                                                    element.name == macro_name
                                            )
                                            if (
                                                typeof obj.arguments !=
                                                "undefined" &&
                                                obj.arguments != ""
                                            ) {
                                                obj.name +=
                                                    "(" +
                                                    obj.arguments.length +
                                                    ")"
                                            }
                                            let macro_app =
                                                "Splunk_Security_Essentials"
                                            if (
                                                typeof prereq_value[
                                                macro_name
                                                ] != "undefined" &&
                                                prereq_value[macro_name] != ""
                                            ) {
                                                macro_app =
                                                    prereq_value[macro_name]
                                            }
                                            let edit_macro_link_url =
                                                "/manager/" +
                                                macro_app +
                                                "/admin/macros/" +
                                                obj.name +
                                                "?action=edit"
                                            //Link format changed in 8.2
                                            if (
                                                parseInt(
                                                    localStorage[
                                                    "splunk-major-version"
                                                    ]
                                                ) > 8 ||
                                                (parseInt(
                                                    localStorage[
                                                    "splunk-major-version"
                                                    ]
                                                ) == 8 &&
                                                    parseInt(
                                                        localStorage[
                                                        "splunk-minor-version"
                                                        ]
                                                    ) == 2)
                                            ) {
                                                edit_macro_link_url =
                                                    "/manager/" +
                                                    macro_app +
                                                    "/data/macros/" +
                                                    obj.name +
                                                    "?action=edit"
                                            }

                                            window.open(
                                                edit_macro_link_url,
                                                "_blank"
                                            )
                                        }
                                    )
                                } else if (
                                    $(data_check_test_button).html() ==
                                    "Edit Macro"
                                ) {
                                    //Do nothing
                                } else {
                                    $(data_check_test_button).hide()
                                }

                                // console.log("Data Check success", searchName, myCheckNum, prereqs[myCheckNum])
                                window.aggregateStatus.success++
                            } else {
                                document.getElementById(
                                    "data_check_test" + myCheckNum
                                ).innerHTML =
                                    '<img title="Error" src="' +
                                    Splunk.util.make_full_url(
                                        "/static//app/Splunk_Security_Essentials/images/general_images/err_ico.gif"
                                    ) +
                                    '">'
                                $("#data_check_test" + myCheckNum)
                                    .parent()
                                    .find("button")
                                    .removeAttr("disabled")
                                $("#row11").css("display", "block")
                                window.aggregateStatus.failure++
                                //console.log("Data Check Failure code 2", searchName, myCheckNum, prereqs[myCheckNum])
                            }
                            if (
                                window.aggregateStatus.total > 0 &&
                                window.aggregateStatus.total ==
                                window.aggregateStatus.success +
                                window.aggregateStatus.failure
                            ) {
                                let myInterval = setInterval(function () {
                                    if (
                                        $(".schedule-alert-button").length >
                                        0 &&
                                        localStorage["isESInstalled"] == "true"
                                    ) {
                                        let myAlert = $(
                                            ".schedule-alert-button"
                                        )
                                            .first()
                                            .clone()
                                            .addClass("btn-primary")
                                            .css("float", "right")
                                            .click(function () {
                                                $(".schedule-alert-button")
                                                    .last()
                                                    .click()
                                            })
                                        if (
                                            localStorage["isESInstalled"] ==
                                            "true"
                                        ) {
                                            myAlert.text(
                                                _("Schedule in ES").t()
                                            )
                                        }
                                        $(
                                            ".panel-body:contains(Data Check)"
                                        ).prepend(myAlert)
                                        clearInterval(myInterval)
                                    }
                                }, 500)
                            }
                        } catch (error) {
                            console.log(error)

                            document.getElementById(
                                "data_check_test" + myCheckNum
                            ).innerHTML =
                                '<img title="Error" src="' +
                                Splunk.util.make_full_url(
                                    "/static//app/Splunk_Security_Essentials/images/general_images/err_ico.gif"
                                ) +
                                '">'
                            $("#data_check_test" + myCheckNum)
                                .parent()
                                .find("button")
                                .removeAttr("disabled")
                            $("#row11").css("display", "block")
                            window.aggregateStatus.failure++
                        }
                    }
                }
            }
        },
        // GenerateShowcaseHTMLBody: function GenerateShowcaseHTMLBody(
        //     summary,
        //     ShowcaseInfo,
        //     textonly
        // ) {
        //     let markdown = new showdown.converter()
        //     setTimeout(function () {
        //         require([
        //             "json!" +
        //                 $C["SPLUNKD_PATH"] +
        //                 "/services/pullJSON?config=mitreattack&locale=" +
        //                 window.localeString,
        //         ], function (mitre_attack) {
        //             // pre-loading these
        //         })
        //     }, 1000)

        //     let translatedLabels = {}
        //     try {
        //         if (
        //             localStorage[
        //                 "Splunk_Security_Essentials-i18n-labels-" +
        //                     window.localeString
        //             ] != undefined
        //         ) {
        //             translatedLabels = JSON.parse(
        //                 localStorage[
        //                     "Splunk_Security_Essentials-i18n-labels-" +
        //                         window.localeString
        //                 ]
        //             )
        //         }
        //     } catch (error) {}

        //     if (!textonly || textonly == false) {
        //         window.summary = summary
        //     }
        //     //var Template = "<div class=\"detailSectionContainer expands\" style=\"display: block; border: black solid 1px; padding-top: 0; \"><h2 style=\"background-color: #F0F0F0; line-height: 1.5em; font-size: 1.2em; margin-top: 0; margin-bottom: 0;\"><a href=\"#\" class=\"dropdowntext\" style=\"color: black;\" onclick='$(\"#SHORTNAMESection\").toggle(); if($(\"#SHORTNAME_arrow\").attr(\"class\")==\"icon-chevron-right\"){$(\"#SHORTNAME_arrow\").attr(\"class\",\"icon-chevron-down\")}else{$(\"#SHORTNAME_arrow\").attr(\"class\",\"icon-chevron-right\")} return false;'>&nbsp;&nbsp;<i id=\"SHORTNAME_arrow\" class=\"icon-chevron-right\"></i> TITLE</a></h2><div style=\"display: none; padding: 8px;\" id=\"SHORTNAMESection\">"
        //     var Template =
        //         '<table id="' +
        //         summary.id +
        //         'SHORTNAME_table" class="dvexpand table table-chrome"><thead><tr><th class="expands"><h2 style="line-height: 1.5em; font-size: 1.2em; margin-top: 0; margin-bottom: 0;"><a href="#" class="dropdowntext" style="color: black;" onclick=\'$("#' +
        //         summary.id +
        //         'SHORTNAMESection").toggle(); if($("#SHORTNAME_arrow").attr("class")=="icon-chevron-right"){$("#' +
        //         summary.id +
        //         'SHORTNAME_arrow").attr("class","icon-chevron-down"); $("#' +
        //         summary.id +
        //         'SHORTNAME_table").addClass("expanded"); $("#' +
        //         summary.id +
        //         'SHORTNAME_table").removeClass("table-chrome");  $("#' +
        //         summary.id +
        //         'SHORTNAME_table").find("th").css("border-top","1px solid darkgray");  }else{$("#' +
        //         summary.id +
        //         'SHORTNAME_arrow").attr("class","icon-chevron-right");  $("#' +
        //         summary.id +
        //         'SHORTNAME_table").removeClass("expanded");  $("#' +
        //         summary.id +
        //         'SHORTNAME_table").addClass("table-chrome"); } return false;\'>&nbsp;&nbsp;<i id="' +
        //         summary.id +
        //         'SHORTNAME_arrow" class="icon-chevron-right"></i> TITLE</a></h2></th></tr></thead><tbody><tr><td class="summaryui-detailed-data" style="display: none; border-top-width: 0;" id="' +
        //         summary.id +
        //         'SHORTNAMESection">'
        //     var Template_OpenByDefault =
        //         '<table id="' +
        //         summary.id +
        //         'SHORTNAME_table" class="dvexpand expanded table table-chrome"><thead><tr><th class="expands"><h2 style="line-height: 1.5em; font-size: 1.2em; margin-top: 0; margin-bottom: 0;"><a href="#" class="dropdowntext" style="color: black;" onclick=\'$("#' +
        //         summary.id +
        //         'SHORTNAMESection").toggle(); if($("#SHORTNAME_arrow").attr("class")=="icon-chevron-right"){$("#' +
        //         summary.id +
        //         'SHORTNAME_arrow").attr("class","icon-chevron-down"); $("#' +
        //         summary.id +
        //         'SHORTNAME_table").addClass("expanded"); $("#' +
        //         summary.id +
        //         'SHORTNAME_table").removeClass("table-chrome");  $("#' +
        //         summary.id +
        //         'SHORTNAME_table").find("th").css("border-top","1px solid darkgray");  }else{$("#' +
        //         summary.id +
        //         'SHORTNAME_arrow").attr("class","icon-chevron-right");  $("#' +
        //         summary.id +
        //         'SHORTNAME_table").removeClass("expanded");  $("#' +
        //         summary.id +
        //         'SHORTNAME_table").addClass("table-chrome"); } return false;\'>&nbsp;&nbsp;<i id="' +
        //         summary.id +
        //         'SHORTNAME_arrow" class="icon-chevron-down"></i> TITLE</a></h2></th></tr></thead><tbody><tr><td class="summaryui-detailed-data" style="display: block; border-top-width: 0;" id="' +
        //         summary.id +
        //         'SHORTNAMESection">'

        //     var areaText = ""
        //     if (typeof summary.category != "undefined") {
        //         let categories = summary.category.split("|").sort()
        //         //Add External link to certain categories
        //         for (var c = 0; c < categories.length; c++) {
        //             if (categories[c] == "Zero Trust") {
        //                 let externallink =
        //                     "https://www.splunk.com/en_us/form/zero-trust-security-model-in-government.html"
        //                 let externallinkDescription =
        //                     "Read more about Splunk and Zero Trust here"
        //                 categories[c] =
        //                     '<a class="external drilldown-link" data-toggle="tooltip" title="' +
        //                     externallinkDescription +
        //                     '" target="_blank" href="' +
        //                     externallink +
        //                     '"> ' +
        //                     categories[c] +
        //                     "</a>"
        //             }
        //         }
        //         areaText =
        //             "<p><h2>" +
        //             _("Category").t() +
        //             "</h2>" +
        //             categories.join(", ") +
        //             "</p>"
        //     }

        //     var usecaseText = ""
        //     if (typeof summary.category != "undefined") {
        //         usecaseText =
        //             "<p><h2>" +
        //             _("Use Case").t() +
        //             "</h2>" +
        //             summary.usecase.split("|").join(", ") +
        //             "</p>"
        //     }

        //     // var showSPLButton = '<div id="showSPLMenu" />' // Line-by-Line SPL Documentation Button
        //     // What follows is Advanced SPL Option
        //     var checkedtext = ""
        //     //Always have SPL mode unless - JB
        //     if (
        //         typeof localStorage["sse-splMode"] == "undefined" ||
        //         localStorage["sse-splMode"] == "true"
        //     )
        //         checkedtext = " checked"

        //     // $("#DemoModeSwitch").html('<div class="tooltipcontainer  filterItem" style="margin-right: 45px;"><label class="filterswitch floatright" style="margin-left: 8px;">' /* + tooltipText*/ + '<input type="checkbox" id="FILTER_DEMOMODE" name="FILTER_DEMOMODE" ' + demoModeInputSetting + '><span class="filterslider "></span></label><div class="filterLine">Demo Mode <a href=\"#\" data-placement=\"bottom\" onclick=\"return false;\" class=\"icon-info\" title=\"SPL is hidden by default and <br />demo searches show up first.\"> </a></div></div> ')
        //     var showAdvancedMode =
        //         '<div style="width: 300px; margin-top: 15px;" class="tooltipcontainer filterItem"><label class="filterswitch"><input type="checkbox" id="enableAdvancedSPL" ' +
        //         checkedtext +
        //         '><span class="filterslider "></span></label><div style="display: inline;" class="filterLine">Enable SPL Mode</div></div><div>Turning this on will show searches, along with the buttons that will allow saving searches. This will be saved in your browser, and be the default for any other content you view, but won\'t impact other users.</div> '

        //     if (
        //         (!textonly || textonly == false) &&
        //         typeof summary.hideSPLMode != "undefined" &&
        //         summary.hideSPLMode == true
        //     ) {
        //         showAdvancedMode = ""
        //         $("#fieldset1").hide() // Search Bar
        //         $("#row11").hide() // Prereq
        //     }

        //     var showSPLText = ""
        //     if (
        //         (!textonly || textonly == false) &&
        //         summary.hasSearch == "Yes" &&
        //         [
        //             "showcase_first_seen_demo",
        //             "showcase_simple_search",
        //             "showcase_standard_deviation",
        //         ].indexOf(
        //             splunkjs.mvc.Components.getInstance("env").toJSON()["page"]
        //         ) >= 0
        //     ) {
        //         showSPLText = Template.replace(/SHORTNAME/g, "showSPL").replace(
        //             "TITLE",
        //             "SPL Mode"
        //         )
        //         showSPLText += showAdvancedMode + "</td></tr></table>"
        //     }

        //     var knownFPText = ""
        //     if (
        //         typeof summary.knownFP != "undefined" &&
        //         summary.knownFP != ""
        //     ) {
        //         knownFPText =
        //             Template.replace(/SHORTNAME/g, "knownFP").replace(
        //                 "TITLE",
        //                 _("Known False Positives").t()
        //             ) +
        //             markdown.makeHtml(summary.knownFP) +
        //             "</td></tr></table>" // "<h2>Known False Positives</h2><p>" + summary.knownFP + "</p>"
        //     }
        //     // console.log("Checking How to Implement", summary.howToImplement)
        //     var howToImplementText = ""
        //     if (
        //         typeof summary.howToImplement != "undefined" &&
        //         summary.howToImplement != ""
        //     ) {
        //         howToImplementText =
        //             Template.replace(/SHORTNAME/g, "howToImplement").replace(
        //                 "TITLE",
        //                 _("How to Implement").t()
        //             ) +
        //             markdown.makeHtml(summary.howToImplement) +
        //             "</td></tr></table>" // "<h2>How to Implement</h2><p>" + summary.howToImplemement + "</p>"
        //     }

        //     var eli5Text = ""
        //     if (typeof summary.eli5 != "undefined" && summary.eli5 != "") {
        //         eli5Text =
        //             Template.replace(/SHORTNAME/g, "eli5").replace(
        //                 "TITLE",
        //                 _("Detailed Search Explanation").t()
        //             ) +
        //             markdown.makeHtml(summary.eli5) +
        //             "</td></tr></table>" // "<h2>Detailed Search Explanation</h2><p>" + summary.eli5 + "</p>"
        //     }

        //     var searchStringText = ""
        //     if (
        //         typeof summary.search != "undefined" &&
        //         summary.search != "" &&
        //         ["showcase_security_content"].indexOf(
        //             splunkjs.mvc.Components.getInstance("env").toJSON()["page"]
        //         ) == -1
        //     ) {
        //         let searchjq = $("<pre>")
        //             .attr("class", "search")
        //             .append($('<code class="spl">').text(summary.search))
        //         // searchStringText = Template.replace(/SHORTNAME/g, "searchString").replace("TITLE", _("Search").t()) + searchjq[0].outerHTML + "</td></tr></table>"
        //         let button =
        //             '<a class="btn external drilldown-link" target="_blank" style="background-color: #76BD64; margin-bottom: 10px; color: white;" href="search?q=' +
        //             encodeURIComponent(summary.search) +
        //             '">' +
        //             _("Open in Search").t() +
        //             "</a>"
        //         if (
        //             summary["open_search_panel"] &&
        //             summary["open_search_panel"] == false
        //         ) {
        //             searchStringText =
        //                 Template.replace(/SHORTNAME/g, "searchString").replace(
        //                     "TITLE",
        //                     _("Search").t()
        //                 ) +
        //                 searchjq[0].outerHTML +
        //                 button +
        //                 "</td></tr></table>"
        //         } else {
        //             searchStringText =
        //                 Template_OpenByDefault.replace(
        //                     /SHORTNAME/g,
        //                     "searchString"
        //                 ).replace("TITLE", _("Search").t()) +
        //                 searchjq[0].outerHTML +
        //                 button +
        //                 "</td></tr></table>"
        //         }
        //     }

        //     var analyticStoryText = ""
        //     if (
        //         typeof summary.analytic_stories != "undefined" &&
        //         Object.keys(summary.analytic_stories).length > 0
        //     ) {
        //         //Create the html for analytic_story here
        //         for (const analytic_story_id in summary.analytic_stories) {
        //             let analytic_story_container = ""
        //             let analytic_story =
        //                 summary.analytic_stories[analytic_story_id]
        //             if (analytic_story["detections"].length != 0) {
        //                 analytic_story_container +=
        //                     "<p>This story is made up of the following detections: </p>"
        //                 analytic_story_container += "<ul>"
        //                 for (
        //                     let j = 0;
        //                     j < analytic_story["detections"].length;
        //                     j++
        //                 ) {
        //                     if (
        //                         analytic_story["detections"][j].name == null ||
        //                         analytic_story["detections"][j].name ==
        //                             undefined
        //                     ) {
        //                         continue
        //                     }

        //                     analytic_story_container +=
        //                         "<li class='analytic_story_detection' title='" +
        //                         analytic_story["detections"][j].name +
        //                         "'><a href='showcase_security_content?showcaseId=" +
        //                         analytic_story["detections"][j].id +
        //                         "' class='analytic_story_detection_link external drilldown-link' target='_blank' title='" +
        //                         analytic_story["detections"][j].name +
        //                         "'>" +
        //                         analytic_story["detections"][j].name +
        //                         "</a></li>"
        //                 }
        //                 analytic_story_container += "</ul>"
        //             }
        //             analyticStoryText +=
        //                 Template.replace(
        //                     /SHORTNAME/g,
        //                     "__" + analytic_story_id
        //                 ).replace(
        //                     "TITLE",
        //                     _(
        //                         'Other Detections in Analytic Story "' +
        //                             analytic_story["name"] +
        //                             '"'
        //                     ).t()
        //                 ) +
        //                 analytic_story_container +
        //                 "</td></tr></table>"
        //         }
        //     }

        //     var baselinesText = ""
        //     if (
        //         typeof summary.baselines != "undefined" &&
        //         summary.baselines.length > 0
        //     ) {
        //         //Create the html for analytic_story here
        //         let baselines_container = ""
        //         if (summary.baselines.length > 1) {
        //             baselines_container +=
        //                 "<h3>This detection relies on the following searches to generate the baseline lookup.</h3>"
        //         } else {
        //             baselines_container +=
        //                 "<h3>This detection relies on the following search to generate the baseline lookup.</h3>"
        //         }
        //         baselines_container += "<ul>"
        //         for (b = 0; b < summary.baselines.length; b++) {
        //             let baseline = summary.baselines[b]
        //             baselines_container +=
        //                 "<li class='baselines_detection' title='" +
        //                 baseline.name +
        //                 "'><a href='search?q=" +
        //                 encodeURIComponent(baseline.search) +
        //                 "' class='baseline_detection_link external drilldown-link' target='_blank' title='" +
        //                 baseline.name +
        //                 "'>" +
        //                 baseline.name +
        //                 "</a></li>"
        //         }
        //         baselines_container += "</ul>"
        //         baselinesText +=
        //             Template.replace(/SHORTNAME/g, "__baselines").replace(
        //                 "TITLE",
        //                 _("Baseline Generation Searches").t()
        //             ) +
        //             baselines_container +
        //             "</td></tr></table>"
        //     }

        //     var SPLEaseText = ""
        //     if (
        //         typeof summary.SPLEase != "undefined" &&
        //         summary.SPLEase != "" &&
        //         summary.SPLEase != "None"
        //     ) {
        //         SPLEaseText =
        //             "<h2>" +
        //             _("SPL Difficulty").t() +
        //             "</h2><p>" +
        //             summary.SPLEase +
        //             "</p>"
        //     }

        //     var operationalizeText = ""
        //     if (
        //         typeof summary.operationalize != "undefined" &&
        //         summary.operationalize != ""
        //     ) {
        //         operationalizeText =
        //             Template.replace(/SHORTNAME/g, "operationalize").replace(
        //                 "TITLE",
        //                 _("How To Respond").t()
        //             ) +
        //             markdown.makeHtml(summary.operationalize) +
        //             "</td></tr></table>" // "<h2>Handle Alerts</h2><p>" + summary.operationalize + "</p>"
        //     }

        //     var gdprText = ""
        //     if (
        //         typeof summary.gdprtext != "undefined" &&
        //         summary.gdprtext != ""
        //     ) {
        //         gdprText =
        //             Template.replace(/SHORTNAME/g, "gdprtext").replace(
        //                 "TITLE",
        //                 _("GDPR Relevance").t()
        //             ) +
        //             markdown.makeHtml(summary.gdprtext) +
        //             "</td></tr></table>" // "<h2>Handle Alerts</h2><p>" + summary.operationalize + "</p>"
        //     }

        //     var relevance = ""
        //     if (
        //         typeof summary.relevance != "undefined" &&
        //         summary.relevance != ""
        //     ) {
        //         relevance =
        //             "<h2>" +
        //             _("Security Impact").t() +
        //             "</h2><p>" +
        //             markdown.makeHtml(summary.relevance) +
        //             "</p>" // "<h2>Handle Alerts</h2><p>" + summary.operationalize + "</p>"
        //     }

        //     let appsToExcludePartnerDisclaimer = [
        //         "Splunk_Security_Essentials",
        //         "Splunk_App_for_Enterprise_Security",
        //         "Enterprise_Security_Content_Update",
        //         "Splunk_SOAR",
        //         "Splunk_User_Behavior_Analytics",
        //         "Custom",
        //     ]
        //     let companyTextBanner = ""
        //     let companyTextDescription = ""
        //     let companyTextSectionLabel = ""
        //     if (
        //         summary.company_name ||
        //         summary.company_logo ||
        //         summary.company_description ||
        //         summary.company_link
        //     ) {
        //         // company_logo company_logo_width company_logo_height company_description company_link
        //         companyTextBanner = "<h2>" + _("Content Producer").t() + "</h2>"
        //         if (summary.company_name) {
        //             if (!summary.company_logo) {
        //                 companyTextBanner +=
        //                     "<p>" +
        //                     Splunk.util.sprintf(
        //                         _("Content supplied by %s").t(),
        //                         _(summary.company_name).t()
        //                     ) +
        //                     "</p>"
        //             }
        //             companyTextSectionLabel =
        //                 "About " + _(summary.company_name).t()
        //         } else {
        //             companyTextSectionLabel = "About Content Producer" //<p><h2>Full Splunk Capabilities</h2></p>"
        //         }
        //         companyTextDescription = Template.replace(
        //             /SHORTNAME/g,
        //             "companyDescription"
        //         ).replace("TITLE", companyTextSectionLabel) //<p><h2>Full Splunk Capabilities</h2></p>"
        //         if (summary.company_logo) {
        //             let style = ""
        //             let max_width = 350
        //             let actual_width = ""
        //             let max_height = 100
        //             let actual_height = ""
        //             if (summary.company_logo_width) {
        //                 summary.company_logo_width = parseInt(
        //                     summary.company_logo_width
        //                 )
        //                 if (summary.company_logo_width > max_width) {
        //                     actual_width = max_width
        //                 } else {
        //                     actual_width = summary.company_logo_width
        //                 }
        //                 try {
        //                     style = "width: " + actual_width + "px; "
        //                 } catch (error) {
        //                     style = ""
        //                 }
        //             }
        //             if (summary.company_logo_height) {
        //                 summary.company_logo_height = parseInt(
        //                     summary.company_logo_height
        //                 )
        //                 if (actual_width != "") {
        //                     actual_height =
        //                         summary.company_logo_height *
        //                         (actual_width / summary.company_logo_width)
        //                     if (actual_height > max_height) {
        //                         actual_height = max_height
        //                         actual_width =
        //                             summary.company_logo_width *
        //                             (actual_height /
        //                                 summary.company_logo_height)
        //                         style = "width: " + actual_width + "px; "
        //                     }
        //                 } else if (summary.company_logo_height > max_height) {
        //                     actual_height = max_height
        //                 } else {
        //                     actual_height = summary.company_logo_height
        //                 }
        //                 try {
        //                     style += "height: " + actual_height + "px; "
        //                 } catch (error) {
        //                     style = ""
        //                 }
        //             }
        //             if (style == "") {
        //                 style = "max-width: 350px;"
        //             }
        //             const companyLogo = cleanLink(summary.company_logo, false) // false: relative link ok
        //             const companyLink = cleanLink(summary.company_link)
        //             if (companyLink) {
        //                 companyTextDescription +=
        //                     '<a target="_blank" href="' +
        //                     companyLink +
        //                     '"><img style="margin: 5px; ' +
        //                     style +
        //                     '" src="' +
        //                     companyLogo +
        //                     '" /></a>'
        //                 companyTextBanner +=
        //                     '<a target="_blank" href="' +
        //                     companyLink +
        //                     '"><img style="margin: 5px; ' +
        //                     style +
        //                     '" src="' +
        //                     companyLogo +
        //                     '" /></a>'
        //             } else {
        //                 companyTextDescription +=
        //                     '<img style="margin: 5px; ' +
        //                     style +
        //                     '" src="' +
        //                     companyLogo +
        //                     '" />'
        //                 companyTextBanner +=
        //                     '<img style="margin: 5px; ' +
        //                     style +
        //                     '" src="' +
        //                     companyLogo +
        //                     '" />'
        //             }
        //         }
        //         if (summary.company_description) {
        //             companyTextDescription +=
        //                 "<p>" +
        //                 markdown.makeHtml(
        //                     _(summary.company_description)
        //                         .t()
        //                         .replace(/\\n/g, "<br/>")
        //                 ) +
        //                 "</p>"
        //         }
        //         if (summary.company_link) {
        //             companyTextDescription +=
        //                 '<a class="btn external drilldown-link" target="_blank" style="background-color: #3498db; margin-bottom: 10px; color: white;" href="' +
        //                 cleanLink(summary.company_link) +
        //                 '">' +
        //                 _("Learn More...").t() +
        //                 "</a>"
        //         }

        //         companyTextDescription += "</td></tr></table>"
        //     } else if (
        //         typeof summary.channel != "undefined" &&
        //         appsToExcludePartnerDisclaimer.indexOf(summary.channel) == -1
        //     ) {
        //         companyTextDescription =
        //             Template.replace(
        //                 /SHORTNAME/g,
        //                 "companyDescription"
        //             ).replace("TITLE", "About Content Provider") +
        //             Splunk.util.sprintf(
        //                 _(
        //                     "This content provider didn't provide any information about their organization. The content provided is %s."
        //                 ).t(),
        //                 summary.channel
        //             ) +
        //             "</td></tr></table>"
        //     }

        //     let additionalContextText = ""
        //     if (
        //         typeof summary["additional_context"] == "object" &&
        //         summary["additional_context"].length
        //     ) {
        //         // Written to support optional context objects provided by partners
        //         for (let i = 0; i < summary["additional_context"].length; i++) {
        //             let obj = summary["additional_context"][i]
        //             let title = "Additional Context"

        //             if (obj.title) {
        //                 title = obj.title
        //             }
        //             let localHTML = Template.replace(
        //                 /SHORTNAME/g,
        //                 "additional_context_" + i
        //             ).replace("TITLE", title)
        //             if (obj["open_panel"]) {
        //                 localHTML = Template_OpenByDefault.replace(
        //                     /SHORTNAME/g,
        //                     "additional_context_" + i
        //                 ).replace("TITLE", title)
        //             }
        //             if (obj.detail) {
        //                 localHTML +=
        //                     "<p>" +
        //                     markdown.makeHtml(
        //                         _(obj.detail).t().replace(/\\n/g, "<br/>")
        //                     ) +
        //                     "</p>"
        //             }

        //             //Splunk.util.sprintf(_("This content is made available by a third-party (“Third-Party Content”) and is subject to the provisions governing Third-Party Content set forth in the Splunk Software License Agreement. Splunk neither controls nor endorses, nor is Splunk responsible for, any Third-Party Content, including the accuracy, integrity, quality, legality, usefulness or safety of Third-Party Content. Use of such Third-Party Content is at the user’s own risk and may be subject to additional terms, conditions and policies applicable to such Third-Party Content (such as license terms, terms of service or privacy policies of the provider of such Third-Party Content). <br/><br/>For information on the provider of this Third-Party Content, please review the \"%s\" section below.").t(), companyTextSectionLabel)
        //             if (obj.search) {
        //                 let label = "Search"
        //                 if (obj.search_label) {
        //                     label = obj.search_label
        //                 }
        //                 localHTML += "<h3>" + label + "</h3>"
        //                 let lang = "spl"

        //                 if (obj.search_lang) {
        //                     lang = obj.search_lang
        //                 }
        //                 localHTML += $("<div>")
        //                     .append(
        //                         $("<pre>")
        //                             .attr("class", "search")
        //                             .append(
        //                                 $("<code>")
        //                                     .attr("class", lang)
        //                                     .text(obj.search)
        //                             )
        //                     )
        //                     .html()
        //                 if (lang == "spl") {
        //                     localHTML +=
        //                         '<a class="btn external drilldown-link" target="_blank" style="background-color: #76BD64; margin-bottom: 10px; color: white;" href="search?q=' +
        //                         encodeURIComponent(obj.search) +
        //                         '">' +
        //                         _("Open in Search").t() +
        //                         "</a>"
        //                 }
        //             }
        //             if (obj.link) {
        //                 localHTML +=
        //                     '<a class="btn external drilldown-link" target="_blank" style="background-color: #3498db; margin-bottom: 10px; color: white;" href="' +
        //                     cleanLink(obj.link) +
        //                     '">' +
        //                     _("Learn More...").t() +
        //                     "</a>"
        //             }
        //             localHTML += "</td></tr></table>"
        //             additionalContextText += localHTML
        //         }
        //     }

        //     let partnerText = ""

        //     if (
        //         typeof summary.channel != "undefined" &&
        //         appsToExcludePartnerDisclaimer.indexOf(summary.channel) == -1
        //     ) {
        //         partnerText =
        //             Template.replace(/SHORTNAME/g, "externalText").replace(
        //                 "TITLE",
        //                 _("External Content").t()
        //             ) +
        //             Splunk.util.sprintf(
        //                 _(
        //                     'This content is made available by a third-party (“Third-Party Content”) and is subject to the provisions governing Third-Party Content set forth in the Splunk Software License Agreement. Splunk neither controls nor endorses, nor is Splunk responsible for, any Third-Party Content, including the accuracy, integrity, quality, legality, usefulness or safety of Third-Party Content. Use of such Third-Party Content is at the user’s own risk and may be subject to additional terms, conditions and policies applicable to such Third-Party Content (such as license terms, terms of service or privacy policies of the provider of such Third-Party Content). <br/><br/>For information on the provider of this Third-Party Content, please review the "%s" section below.'
        //                 ).t(),
        //                 companyTextSectionLabel
        //             ) +
        //             "</td></tr></table>"
        //     }

        //     var descriptionText =
        //         "<div class='descriptionBlock'><h2>" +
        //         _("Description").t() +
        //         "</h2>" // "<h2>Handle Alerts</h2><p>" + summary.operationalize + "</p>"
        //     var alertVolumeText = "<h2>" + _("Alert Volume").t() + "</h2>"

        //     if (
        //         summary.alertvolume == "Very Low" ||
        //         summary.description.match(
        //             /<b>\s*Alert Volume:*\s*<\/b>:*\s*Very Low/
        //         )
        //     ) {
        //         alertVolumeText +=
        //             '<span class="dvPopover popoverlink" id="alertVolumetooltip" title="Alert Volume: Very Low" data-placement="right" data-toggle="popover" data-trigger="hover" data-bs-content="' +
        //             _(
        //                 "An alert volume of Very Low indicates that a typical environment will rarely see alerts from this search, maybe after a brief period of tuning. This search should trigger infrequently enough that you could send it directly to the SOC as an alert, although you should also send it into a data-analysis based threat detection solution, such as Splunk UBA (or as a starting point, Splunk ES's Risk Framework)"
        //             ).t() +
        //             '">' +
        //             _("Very Low").t() +
        //             "</span>"
        //         descriptionText += markdown.makeHtml(
        //             summary.description.replace(
        //                 /<b>\s*Alert Volume:*\s*<\/b>:*\s*Very Low/,
        //                 ""
        //             )
        //         )
        //     } else if (
        //         summary.alertvolume == "Low" ||
        //         summary.description.match(
        //             /<b>\s*Alert Volume:*\s*<\/b>:*\s*Low/
        //         )
        //     ) {
        //         alertVolumeText +=
        //             '<span class="dvPopover popoverlink" id="alertVolumetooltip" title="Alert Volume: Low" data-placement="right" data-toggle="popover" data-trigger="hover" data-bs-content="' +
        //             _(
        //                 "An alert volume of Low indicates that a typical environment will occasionally see alerts from this search -- probably 0-1 alerts per week, maybe after a brief period of tuning. This search should trigger infrequently enough that you could send it directly to the SOC as an alert if you decide it is relevant to your risk profile, although you should also send it into a data-analysis based threat detection solution, such as Splunk UBA (or as a starting point, Splunk ES's Risk Framework)"
        //             ).t() +
        //             '">' +
        //             _("Low").t() +
        //             "</span>"
        //         descriptionText += markdown.makeHtml(
        //             summary.description.replace(
        //                 /<b>\s*Alert Volume:*\s*<\/b>:*\s*Low/,
        //                 ""
        //             )
        //         )
        //     } else if (
        //         summary.alertvolume == "Medium" ||
        //         summary.description.match(
        //             /<b>\s*Alert Volume:*\s*<\/b>:*\s*Medium/
        //         )
        //     ) {
        //         alertVolumeText +=
        //             '<span class="dvPopover popoverlink" id="alertVolumetooltip" title="Alert Volume: Medium" data-placement="right" data-toggle="popover" data-trigger="hover" data-bs-content="' +
        //             _(
        //                 "An alert volume of Medium indicates that you're likely to see one to two alerts per day in a typical organization, though this can vary substantially from one organization to another. It is recommended that you feed these to an anomaly aggregation technology, such as Splunk UBA (or as a starting point, Splunk ES's Risk Framework)"
        //             ).t() +
        //             '">' +
        //             _("Medium").t() +
        //             "</span>"
        //         descriptionText += markdown.makeHtml(
        //             summary.description.replace(
        //                 /<b>\s*Alert Volume:*\s*<\/b>:*\s*Medium/,
        //                 ""
        //             )
        //         )
        //     } else if (
        //         summary.alertvolume == "High" ||
        //         summary.description.match(
        //             /<b>\s*Alert Volume:*\s*<\/b>:*\s*High/
        //         )
        //     ) {
        //         alertVolumeText +=
        //             '<span class="dvPopover popoverlink" id="alertVolumetooltip" title="Alert Volume: High" data-placement="right" data-toggle="popover" data-trigger="hover" data-bs-content="' +
        //             _(
        //                 "An alert volume of High indicates that you're likely to see several alerts per day in a typical organization, though this can vary substantially from one organization to another. It is highly recommended that you feed these to an anomaly aggregation technology, such as Splunk UBA (or as a starting point, Splunk ES's Risk Framework)"
        //             ).t() +
        //             '">' +
        //             _("High").t() +
        //             "</span>"
        //         descriptionText += markdown.makeHtml(
        //             summary.description.replace(
        //                 /<b>\s*Alert Volume:*\s*<\/b>:*\s*High/,
        //                 ""
        //             )
        //         )
        //     } else if (
        //         summary.alertvolume == "Very High" ||
        //         summary.description.match(
        //             /<b>\s*Alert Volume:*\s*<\/b>:*\s*Very High/
        //         )
        //     ) {
        //         alertVolumeText +=
        //             '<span class="dvPopover popoverlink" id="alertVolumetooltip" title="Alert Volume: Very High" data-placement="right" data-toggle="popover" data-trigger="hover" data-bs-content="' +
        //             _(
        //                 "An alert volume of Very High indicates that you're likely to see many alerts per day in a typical organization. You need a well thought out high volume indicator search to get value from this alert volume. Splunk ES's Risk Framework is a starting point, but is probably insufficient given how common these events are. It is highly recommended that you either build correlation searches based on the output of this search, or leverage Splunk UBA with it's threat models to surface the high risk indicators."
        //             ).t() +
        //             '">' +
        //             _("Very High").t() +
        //             "</span>"
        //         descriptionText += markdown.makeHtml(
        //             summary.description.replace(
        //                 /<b>\s*Alert Volume:*\s*<\/b>:*\s*Very High/,
        //                 ""
        //             )
        //         )
        //     } else {
        //         //alertVolumeText += summary.description.replace(/(<b>\s*Alert Volume:.*?)<\/p>.*/, '$1 <a class="dvPopover" id="alertVolumetooltip" href="#" title="Alert Volume" data-placement="right" data-toggle="popover" data-trigger="hover" data-bs-content="' + _("The alert volume indicates how often a typical organization can expect this search to fire. On the Very Low / Low side, alerts should be rare enough to even send these events directly to the SIEM for review. Oh the High / Very High side, your SOC would be buried under the volume, and you must send the events only to an anomaly aggregation and threat detection solution, such as Splunk UBA (or for a partial solution, Splunk ES\'s risk framework). To that end, *all* alerts, regardless of alert volume, should be sent to that anomaly aggregation and threat detection solution. More data, more indicators, should make these capabilites stronger, and make your organization more secure.").t() + '">(?)</a>')
        //         alertVolumeText = ""
        //         descriptionText +=
        //             markdown.makeHtml(
        //                 summary.description.replace(
        //                     /(<b>\s*Alert Volume:.*?)(?:<\/p>)/,
        //                     ""
        //                 )
        //             ) + "</div>"
        //     }
        //     descriptionText += "</div>"
        //     //Security Content specific fields
        //     //For Security Content showcase template we display these alongside the other descriptions at the top. I.e. Skip the accordion.
        //     var security_content_fields = {}
        //     security_content_fields["analytic_stories"] =
        //         "<h2>" + _("Analytic Story").t() + "</h2>"
        //     security_content_fields["how_to_implement"] =
        //         "<h2>" + _("How to Implement").t() + "</h2>"
        //     security_content_fields["known_false_positives"] =
        //         "<h2>" + _("Known False Positives").t() + "</h2>"
        //     security_content_fields["role_based_alerting"] =
        //         "<h2>" + _("Risk Based Alerting").t() + "</h2>"
        //     security_content_fields["references"] =
        //         "<h2>" + _("References").t() + "</h2>"
        //     security_content_fields["asset_type"] =
        //         "<h2>" + _("Asset Type").t() + "</h2>"
        //     security_content_fields["dataset"] =
        //         "<h2>" + _("Sample Data").t() + "</h2>"
        //     security_content_fields["version"] = _("Version").t() + ": "
        //     security_content_fields["date"] = _("Updated").t() + ": "
        //     for (let field in security_content_fields) {
        //         if (
        //             typeof summary[field] != "undefined" &&
        //             summary[field] != "" &&
        //             summary[field] != "None" &&
        //             summary[field] != "undefined"
        //         ) {
        //             //security_content_fields[field]+= markdown.makeHtml(summary[field])
        //             if (field == "dataset" || field == "references") {
        //                 for (var x = 0; x < summary[field].length; x++) {
        //                     security_content_fields[field] +=
        //                         "<a class='referenceLink external drilldown-link' target='_blank' href='" +
        //                         summary[field][x] +
        //                         "'>" +
        //                         summary[field][x] +
        //                         "</a>"
        //                     if (x < summary[field].length - 1) {
        //                         security_content_fields[field] += "<br />"
        //                     }
        //                 }
        //             } else if (field == "analytic_stories") {
        //                 if (Object.keys(summary[field]).length > 0) {
        //                     let analytic_story_links = []
        //                     for (const analytic_story_id in summary[field]) {
        //                         let analytic_story =
        //                             summary[field][analytic_story_id]
        //                         let content =
        //                             "<h3>Description</h3><p>" +
        //                             analytic_story.description
        //                                 .replace(/'/g, "")
        //                                 .replace(/\n/g, "<br>") +
        //                             "</p>" +
        //                             "<h3>Narrative</h3><p>" +
        //                             analytic_story.narrative
        //                                 .replace(/'/g, "")
        //                                 .replace(/\n/g, "<br>")
        //                                 .replace(/\\/g, "") +
        //                             "</p>"
        //                         analytic_story_links.push(
        //                             "<span class='whatsthis analytic_story' data-toggle='popover' data-trigger='hover' data-placement='right' data-placement='right' data-html='true' title='" +
        //                                 analytic_story.name +
        //                                 "' data-bs-content='" +
        //                                 content +
        //                                 "'>" +
        //                                 analytic_story.name +
        //                                 "</span>"
        //                         )
        //                     }
        //                     security_content_fields[field] +=
        //                         analytic_story_links.join(", ")
        //                 }
        //             } else {
        //                 if (
        //                     typeof summary[field] == "string" &&
        //                     summary[field].length > 50
        //                 ) {
        //                     security_content_fields[field] += markdown
        //                         .makeHtml(summary[field].toString())
        //                         .replace(/\\\n/g, "<br>")
        //                         .replace(/\n/g, "<br>")
        //                 } else {
        //                     security_content_fields[field] += summary[field]
        //                 }
        //             }
        //         } else if (field == "role_based_alerting") {
        //             var rbaText = ""
        //             if (
        //                 typeof summary.risk_object_type != "undefined" &&
        //                 summary.risk_object_type != ""
        //             ) {
        //                 rbaText +=
        //                     "<div><h3>Risk objects</h3><span>" +
        //                     summary.risk_object_type.split("|").join(", ") +
        //                     "</span></div>"
        //             }
        //             if (
        //                 typeof summary.threat_object_type != "undefined" &&
        //                 summary.threat_object_type != ""
        //             ) {
        //                 rbaText +=
        //                     "<div><h3>Threat objects</h3><span>" +
        //                     summary.threat_object_type.split("|").join(", ") +
        //                     "</span></div>"
        //             }
        //             if (
        //                 typeof summary.risk_score != "undefined" &&
        //                 summary.risk_score != ""
        //             ) {
        //                 rbaText +=
        //                     "<div><h3>Risk score</h3><span>" +
        //                     summary.risk_score +
        //                     "</span></div>"
        //             }
        //             if (
        //                 typeof summary.risk_message != "undefined" &&
        //                 summary.risk_message != ""
        //             ) {
        //                 rbaText +=
        //                     "<div><h3>Risk message</h3><span>" +
        //                     markdown.makeHtml(summary.risk_message) +
        //                     "</span></div>"
        //             }
        //             if (typeof rbaText != "undefined" && rbaText != "") {
        //                 security_content_fields[field] += rbaText
        //             } else {
        //                 security_content_fields[field] = ""
        //             }
        //         } else {
        //             security_content_fields[field] = ""
        //         }
        //     }
        //     descriptionText += "<div class='columnWrapper'>"
        //     descriptionText +=
        //         "<div id='contentMappingBlock_" + summary.id + "'>"
        //     console.log("Passing summary: " + summary)
        //     descriptionText += generateContentMappingBlock(summary)
        //     descriptionText += "</div>"
        //     descriptionText += "<div class='releaseInformationBlock'>"
        //     if (security_content_fields["version"] != "") {
        //         descriptionText += security_content_fields["version"]
        //         if (security_content_fields["date"] != "") {
        //             descriptionText += ", "
        //             descriptionText += security_content_fields["date"]
        //         }
        //     }
        //     descriptionText += "</div>"
        //     descriptionText += "</div>"

        //     var cloneToCustomContent =
        //         "<div id='cloneToCustomContent' class='clone-custom-content'>Clone This Content Into Custom Content</div>"

        //     //alertVolumeText += "</div></div>"

        //     //relevance = summary.relevance ? "<p><h2>Security Impact</h2>" +  + "</p>" : ""

        //     per_instance_help = ""
        //     if (
        //         typeof summary.help != "undefined" &&
        //         summary.help &&
        //         summary.help != "" &&
        //         summary.help != undefined &&
        //         summary.help != null &&
        //         summary.help != "undefined" &&
        //         summary.help.indexOf("Help not needed") != 0 &&
        //         ["showcase_security_content"].indexOf(
        //             splunkjs.mvc.Components.getInstance("env").toJSON()["page"]
        //         ) == -1
        //     ) {
        //         // console.log("Got help for summary", summary.id, summary)
        //         per_instance_help = Template.replace(
        //             /SHORTNAME/g,
        //             "help"
        //         ).replace("TITLE", "Help")
        //         if ($("h3:contains(How Does This Detection Work)").length > 0) {
        //             per_instance_help += $(
        //                 "h3:contains(How Does This Detection Work)"
        //             )
        //                 .parent()
        //                 .html()
        //         }
        //         per_instance_help +=
        //             "<p><h3>" +
        //             summary.name +
        //             " Help</h3></p>" +
        //             markdown.makeHtml(summary.help)
        //         per_instance_help += "</td></tr></table>"
        //     }
        //     panelStart =
        //         '<div id="rowDescription" class="dashboard-row dashboard-rowDescription splunk-view">        <div id="panelDescription" class="dashboard-cell last-visible splunk-view" style="width: 100%;">            <div class="dashboard-panel clearfix" style="min-height: 0px;"><h2 class="panel-title empty"></h2><div id="view_description" class="fieldset splunk-view editable hide-label hidden empty"></div>                                <div class="panel-element-row">                    <div id="elementdescription" class="dashboard-element html splunk-view" style="width: 100%;">                        <div class="panel-body html"> <div class="contentDescription" data-showcaseid="' +
        //         summary.id +
        //         '" id="contentDescription"> '
        //     panelEnd =
        //         "</div></div>                    </div>                </div>            </div>        </div>    </div>"

        //     //console.log("Here's my summary!", summary)

        //     var relatedUseCasesText = ""
        //     if (
        //         (!textonly || textonly == false) &&
        //         typeof summary.relatedUseCases != "undefined" &&
        //         summary.relatedUseCases.length > 0
        //     ) {
        //         relatedUseCasesText =
        //             "<h2>" + _("Related Use Cases").t() + "</h2>"
        //         var tiles = $('<ul class="showcase-list"></ul>')
        //         for (var i = 0; i < summary.relatedUseCases.length; i++) {
        //             if (
        //                 typeof ShowcaseInfo["summaries"][
        //                     summary.relatedUseCases[i]
        //                 ] != "undefined"
        //             )
        //                 tiles.append(
        //                     $(
        //                         '<li style="width: 230px; height: 320px"></li>'
        //                     ).append(
        //                         BuildTile.build_tile(
        //                             ShowcaseInfo["summaries"][
        //                                 summary.relatedUseCases[i]
        //                             ],
        //                             true
        //                         )
        //                     )
        //                 )
        //         }
        //         relatedUseCasesText +=
        //             '<ul class="showcase-list">' + tiles.html() + "</ul>"
        //     }

        //     let soarPlaybookText = ""
        //     if (
        //         (!textonly || textonly == false) &&
        //         typeof summary.soarPlaybooks != "undefined" &&
        //         summary.soarPlaybooks.length > 0
        //     ) {
        //         soarPlaybookText = "<h2>" + _("SOAR Playbooks").t() + "</h2>"
        //         var tiles = $('<ul class="showcase-list"></ul>')
        //         for (var i = 0; i < summary.soarPlaybooks.length; i++) {
        //             if (
        //                 typeof ShowcaseInfo["summaries"][
        //                     summary.soarPlaybooks[i]
        //                 ] != "undefined"
        //             )
        //                 tiles.append(
        //                     $(
        //                         '<li style="width: 230px; height: 320px"></li>'
        //                     ).append(
        //                         BuildTile.build_tile(
        //                             ShowcaseInfo["summaries"][
        //                                 summary.soarPlaybooks[i]
        //                             ],
        //                             true
        //                         )
        //                     )
        //                 )
        //         }
        //         soarPlaybookText +=
        //             '<ul class="showcase-list">' + tiles.html() + "</ul>"
        //     }

        //     var similarUseCasesText = ""
        //     if (
        //         (!textonly || textonly == false) &&
        //         typeof summary.similarUseCases != "undefined" &&
        //         summary.similarUseCases.length > 0
        //     ) {
        //         similarUseCasesText =
        //             "<h2>" +
        //             _("Similar Use Cases").t() +
        //             "</h2><p>Sometimes Splunk will solve the same problem in multiple ways, based on greater requirements. What we can do with a simple example for one data source at Stage 1 of the Journey, we can do across all datasets at Stage 2, and with more impact at Stage 4. Here are other versions of the same underlying technique.</p>"
        //         var tiles = $('<ul class="showcase-list"></ul>')
        //         for (var i = 0; i < summary.similarUseCases.length; i++) {
        //             if (
        //                 typeof ShowcaseInfo["summaries"][
        //                     summary.similarUseCases[i]
        //                 ] != "undefined"
        //             )
        //                 tiles.append(
        //                     $(
        //                         '<li style="width: 230px; height: 320px"></li>'
        //                     ).append(
        //                         BuildTile.build_tile(
        //                             ShowcaseInfo["summaries"][
        //                                 summary.similarUseCases[i]
        //                             ],
        //                             true
        //                         )
        //                     )
        //                 )
        //         }
        //         similarUseCasesText +=
        //             '<ul class="showcase-list">' + tiles.html() + "</ul>"
        //         //  console.log("Here's my similar use cases..", similarUseCasesText)
        //     }

        //     var fullSolutionText = ""
        //     // if (typeof summary.fullSolution != "undefined") {
        //     //     fullSolutionText += "<br/><h2>" + _("Relevant Splunk Premium Solution Capabilities").t() + "</h2><button class=\"btn\" onclick=\"triggerModal(window.fullSolutionText); return false;\">Find more Splunk content for this Use Case</button>"

        //     // }

        //     var otherSplunkCapabilitiesText = ""
        //     if (
        //         relatedUseCasesText != "" ||
        //         similarUseCasesText != "" ||
        //         fullSolutionText != ""
        //     ) {
        //         otherSplunkCapabilitiesText = Template.replace(
        //             /SHORTNAME/g,
        //             "fullSolution"
        //         ).replace("TITLE", "Related Splunk Capabilities") //<p><h2>Full Splunk Capabilities</h2></p>"
        //         otherSplunkCapabilitiesText += similarUseCasesText
        //         otherSplunkCapabilitiesText += relatedUseCasesText
        //         // otherSplunkCapabilitiesText += soarPlaybookText
        //         otherSplunkCapabilitiesText += fullSolutionText
        //         otherSplunkCapabilitiesText += "</td></tr></table>"
        //     }
        //     var SOARText = ""
        //     if (soarPlaybookText != "") {
        //         SOARText = Template.replace(
        //             /SHORTNAME/g,
        //             "soarPlaybookContent"
        //         ).replace("TITLE", "Recommended SOAR Playbooks") //<p><h2>Full Splunk Capabilities</h2></p>"
        //         SOARText += soarPlaybookText
        //         SOARText += "</td></tr></table>"
        //     }

        //     var supportingImagesText = ""
        //     if (
        //         typeof summary.images == "object" &&
        //         typeof summary.images.length == "number" &&
        //         summary.images.length > 0
        //     ) {
        //         supportingImagesText =
        //             '<table id="SHORTNAME_table" class="dvexpand table table-chrome"><thead><tr><th class="expands"><h2 style="line-height: 1.5em; font-size: 1.2em; margin-top: 0; margin-bottom: 0;"><a href="#" class="dropdowntext" style="color: black;" onclick=\'$("#SHORTNAMESection").toggle(); if($("#SHORTNAME_arrow").attr("class")=="icon-chevron-right"){$("#SHORTNAME_arrow").attr("class","icon-chevron-down"); $("#SHORTNAME_table").addClass("expanded"); $("#SHORTNAME_table").removeClass("table-chrome");  $("#SHORTNAME_table").find("th").css("border-top","1px solid darkgray");  }else{$("#SHORTNAME_arrow").attr("class","icon-chevron-right");  $("#SHORTNAME_table").removeClass("expanded");  $("#SHORTNAME_table").addClass("table-chrome"); } ; window.DoImageSubtitles(); return false;\'>&nbsp;&nbsp;<i id="SHORTNAME_arrow" class="icon-chevron-right"></i> TITLE</a></h2></th></tr></thead><tbody><tr><td style="display: none; border-top-width: 0;" id="SHORTNAMESection">'
        //         supportingImagesText = supportingImagesText
        //             .replace(/SHORTNAME/g, "supportingImages")
        //             .replace("TITLE", "Screenshots")
        //         var images = ""
        //         for (var i = 0; i < summary.images.length; i++) {
        //             images +=
        //                 '<img crossorigin="anonymous" class="screenshot" setwidth="650" zoomin="true" src="' +
        //                 summary.images[i].path +
        //                 '" title="' +
        //                 summary.images[i].label +
        //                 '" />'
        //         }
        //         supportingImagesText += images
        //         supportingImagesText += "</td></tr></table>"
        //     }

        //     var BookmarkStatus =
        //         '<h2 class="bookmarkDisplayComponents" style="margin-bottom: 5px;">Bookmark Status</h2><span class="bookmarkDisplayComponents" style="margin-top: 0; margin-bottom: 15px;"><a title="Click to edit" class="showcase_bookmark_status" href="#" onclick="popBookmarkOptions(this); return false;">' +
        //         summary.bookmark_status_display +
        //         ' <i class="icon-pencil"></i></a></span> '

        //     if (
        //         summary.bookmark_notes &&
        //         summary.bookmark_notes != "" &&
        //         summary.bookmark_notes != null
        //     ) {
        //         BookmarkStatus +=
        //             '<div class="bookmarkDisplayComponents" data-showcaseid="' +
        //             summary.id +
        //             '" class="bookmarkNotes"><p>' +
        //             summary.bookmark_notes +
        //             "</p></div>"
        //     } else {
        //         BookmarkStatus +=
        //             '<div class="bookmarkDisplayComponents" style="display: none; reallyshow: none;" data-showcaseid="' +
        //             summary.id +
        //             '" class="bookmarkNotes"><p>' +
        //             summary.bookmark_notes +
        //             "</p></div>"
        //     }

        //     var DataAvailabilityStatus =
        //         '<h2 style="margin-bottom: 5px;"><span data-toggle="tooltip" title="' +
        //         _(
        //             "Data Availability is driven by the Data Inventory dashboard, and allows Splunk Security Essentials to provide recommendations for available content that fits your needs and uses your existing data."
        //         ).t() +
        //         '">' +
        //         _("Data Availability").t() +
        //         '</span> <a href="data_inventory" target="_blank" class="external drilldown-link"></a></h2><span style="margin-top: 0; margin-bottom: 15px;"><a href="#" onclick="data_available_modal(this); return false;">' +
        //         summary.data_available +
        //         "</a></span> "
        //     var Stage =
        //         '<h2 style="margin-bottom: 5px;">Journey</h2><span style="margin-top: 0; margin-bottom: 15px;"><a target="_blank" class="external link drilldown-icon" href="journey?stage=' +
        //         summary.journey.replace(/Stage_/g, "") +
        //         '">' +
        //         summary.journey.replace(/_/g, " ") +
        //         "</a></span> "

        //     var datasourceText = ""
        //     if (
        //         typeof summary.datasources == "undefined" &&
        //         summary.datasource != "undefined" &&
        //         summary.datasource != ""
        //     ) {
        //         summary.datasources = summary.datasource
        //     }
        //     if (
        //         typeof summary.datasources != "undefined" &&
        //         summary.datasources != "Other" &&
        //         summary.datasources != ""
        //     ) {
        //         datasources = summary.datasources.split("|")
        //         if (datasources.length > 0 && datasourceText == "") {
        //             datasourceText = "<h2>Data Sources</h2>"
        //         }
        //         for (var i = 0; i < datasources.length; i++) {
        //             var link = datasources[i].replace(/[^\w\- ]/g, "")
        //             var description = datasources[i]
        //             datasourceText +=
        //                 '<div class="coredatasource"><a target="_blank" href="data_source?datasource=' +
        //                 link +
        //                 '">' +
        //                 description +
        //                 "</a></div>"
        //         }
        //         datasourceText += '<br style="clear: both;"/>'
        //     }

        //     var datamodelText = ""
        //     if (
        //         typeof summary.datamodel != "undefined" &&
        //         summary.datamodel != "Other" &&
        //         summary.datamodel != "" &&
        //         summary.datamodel != "None"
        //     ) {
        //         datamodels = summary.datamodel.split("|")
        //         if (datamodels.length > 0 && datamodelText == "") {
        //             datamodelText = "<h2>Data Model</h2>"
        //         }
        //         for (var i = 0; i < datamodels.length; i++) {
        //             var link =
        //                 "https://docs.splunk.com/Documentation/CIM/latest/User/" +
        //                 datamodels[i].split(".")[0]
        //             var description = datamodels[i]
        //             datamodelText +=
        //                 '<a class="external link" target="_blank" href="' +
        //                 link +
        //                 '">' +
        //                 description +
        //                 "</a> "
        //         }
        //         datamodelText += '<br style="clear: both;"/>'
        //     }

        //     var mitreText = ""
        //     if (
        //         typeof summary.mitre_tactic_display != "undefined" &&
        //         summary.mitre_tactic_display != ""
        //     ) {
        //         let mitreName = summary.mitre_tactic_display.split("|")
        //         let mitreId = summary.mitre_tactic.split("|")
        //         if (mitreName.indexOf("None") >= 0) {
        //             mitreName = mitreName.splice(mitreName.indexOf("None"), 1)
        //         }
        //         if (mitreName.length > 0 && mitreText == "") {
        //             mitreText =
        //                 '<h2 style="margin-bottom: 5px;">' +
        //                 _("MITRE ATT&CK Tactics").t() +
        //                 "  (Click for Detail)</h2>"
        //         }
        //         let numAdded = 0
        //         for (var i = 0; i < mitreName.length; i++) {
        //             if (mitreName[i] == "None") {
        //                 continue
        //             }
        //             numAdded++
        //             let tooltip = mitreId[i] + " - " + mitreName[i]
        //             mitreText +=
        //                 "<div style=\"cursor: pointer\" data-toggle='tooltip' title='" +
        //                 tooltip +
        //                 "' onclick=\"showMITREElement('x-mitre-tactic', '" +
        //                 mitreName[i] +
        //                 "')\" mitre_tactic='" +
        //                 mitreId[i] +
        //                 '\' class="primary mitre_tactic_displayElements">' +
        //                 mitreName[i] +
        //                 "</div>"
        //         }
        //         mitreText += '<br style="clear: both;"/>'
        //         if (numAdded == 0) {
        //             mitreText = ""
        //         }
        //     }

        //     var mitreTechniqueText = ""
        //     let mitreTecniques = {}
        //     if (
        //         typeof summary.mitre_technique_display != "undefined" &&
        //         summary.mitre_technique_display != ""
        //     ) {
        //         let mitreName = summary.mitre_technique_display.split("|")
        //         let mitreId =
        //             summary.mitre_technique.substr(0, 1) === "|"
        //                 ? summary.mitre_technique
        //                       .substr(1, summary.mitre_technique.length)
        //                       .split("|")
        //                 : summary.mitre_technique.split("|")

        //         if (mitreName.indexOf("None") >= 0) {
        //             mitreName = mitreName.splice(mitreName.indexOf("None"), 1)
        //         }
        //         if (mitreName.length > 0 && mitreTechniqueText == "") {
        //             mitreTechniqueText =
        //                 '<h2 style="margin-bottom: 5px;">' +
        //                 _("MITRE ATT&CK Techniques").t() +
        //                 "  (Click for Detail)</h2>"
        //         }
        //         let numAdded = 0
        //         let mitreTechName =
        //             summary.mitre_sub_technique_display.substr(0, 1) === "|"
        //                 ? summary.mitre_sub_technique_display
        //                       .substr(
        //                           1,
        //                           summary.mitre_sub_technique_display.length
        //                       )
        //                       .split("|")
        //                 : summary.mitre_sub_technique_display.split("|")

        //         console.log("mitreName: ", mitreName)
        //         console.log("mitreTechName: ", mitreTechName)
        //         for (var i = 0; i < mitreName.length; i++) {
        //             if (!mitreTechName.includes(mitreName[i])) {
        //                 if (mitreName[i] == "None") {
        //                     continue
        //                 }
        //                 numAdded++
        //                 let tooltip = mitreId[i] + " - " + mitreName[i]
        //                 mitreTecniques[mitreId[i]] = mitreName[i]
        //                 mitreTechniqueText +=
        //                     "<div style=\"cursor: pointer\" data-toggle='tooltip' title='" +
        //                     tooltip +
        //                     "' onclick=\"showMITREElement('attack-pattern', '" +
        //                     mitreName[i] +
        //                     "')\" mitre_technique='" +
        //                     mitreId[i] +
        //                     '\' class="primary mitre_technique_displayElements">' +
        //                     mitreName[i] +
        //                     "</div>"
        //             }
        //         }
        //         if (
        //             typeof summary.mitre_sub_technique_display == "undefined" ||
        //             summary.mitre_sub_technique_display == ""
        //         ) {
        //             mitreTechniqueText += '<br style="clear: both;"/>'
        //         }
        //         if (numAdded == 0) {
        //             mitreTechniqueText = ""
        //         }
        //     }
        //     if (
        //         typeof summary.mitre_sub_technique_display != "undefined" &&
        //         summary.mitre_sub_technique_display != ""
        //     ) {
        //         let mitreName = summary.mitre_sub_technique_display.split("|")
        //         let mitreId =
        //             summary.mitre_sub_technique.substr(0, 1) === "|"
        //                 ? summary.mitre_sub_technique
        //                       .substr(1, summary.mitre_sub_technique.length)
        //                       .split("|")
        //                 : summary.mitre_sub_technique.split("|")
        //         if (mitreName.indexOf("None") >= 0) {
        //             mitreName = mitreName.splice(mitreName.indexOf("None"), 1)
        //         }

        //         if (mitreName.length > 0 && mitreTechniqueText == "") {
        //             mitreTechniqueText =
        //                 '<h2 style="margin-bottom: 5px;">' +
        //                 _("MITRE ATT&CK Techniques").t() +
        //                 "  (Click for Detail)</h2>"
        //         }

        //         let numAdded = 0
        //         for (var i = 0; i < mitreName.length; i++) {
        //             if (mitreName[i] == "None") {
        //                 continue
        //             }
        //             numAdded++
        //             let tooltip = mitreId[i] + " - " + mitreName[i]
        //             mitreTechniqueText +=
        //                 "<div style=\"cursor: pointer\" data-toggle='tooltip' title='" +
        //                 tooltip +
        //                 "' onclick=\"showMITREElement('attack-pattern', '" +
        //                 mitreId[i] +
        //                 "')\" mitre_sub_technique='" +
        //                 mitreId[i] +
        //                 '\' class="primary mitre_technique_displayElements mitre_sub_technique_displayElements">' +
        //                 mitreName[i] +
        //                 "</div>"
        //         }
        //         mitreTechniqueText += '<br style="clear: both;"/>'
        //     }

        //     function showGroup(groupName) {
        //         // console.log("Got a group!", groupName)

        //         require([
        //             "underscore",
        //             "jquery",
        //             "components/controls/Modal",
        //             "json!" +
        //                 $C["SPLUNKD_PATH"] +
        //                 "/services/pullJSON?config=mitreattack&locale=" +
        //                 window.localeString,
        //         ], function (_, $, Modal, mitre_attack) {
        //             let relevantGroups = [groupName]
        //             let relevantTechniques = []
        //             let group_ref = []
        //             let technique_ref = []
        //             let group_ref_to_description = {}
        //             let refs = {}
        //             window.mitre = mitre_attack
        //             window.threat_groups = {}
        //             $(".mitre_technique_displayElements.primary").each(
        //                 function (num, obj) {
        //                     relevantTechniques.push($(obj).text())
        //                 }
        //             )
        //             // console.log("Rolling forward with", relevantGroups, relevantTechniques)
        //             for (let i = 0; i < mitre_attack.objects.length; i++) {
        //                 if (mitre_attack.objects[i].type == "attack-pattern") {
        //                     // console.log("Looking for ", mitre_attack.objects[i].name, "in", relevantTechniques, relevantTechniques.indexOf(mitre_attack.objects[i].name))
        //                 }

        //                 if (
        //                     mitre_attack.objects[i].type == "attack-pattern" &&
        //                     relevantTechniques.indexOf(
        //                         mitre_attack.objects[i].name
        //                     ) >= 0
        //                 ) {
        //                     for (
        //                         let g = 0;
        //                         g <
        //                         mitre_attack.objects[i].external_references
        //                             .length;
        //                         g++
        //                     ) {
        //                         if (
        //                             mitre_attack.objects[i].external_references[
        //                                 g
        //                             ].external_id &&
        //                             mitre_attack.objects[i].external_references[
        //                                 g
        //                             ].url.indexOf("attack.mitre.org/") >= 0
        //                         ) {
        //                             mitre_attack.objects[i].technique_id =
        //                                 mitre_attack.objects[
        //                                     i
        //                                 ].external_references[g].external_id
        //                         }
        //                     }
        //                     mitre_attack.objects[i].technique_name =
        //                         mitre_attack.objects[i].name
        //                     technique_ref.push(mitre_attack.objects[i].id)
        //                     refs[mitre_attack.objects[i].id] =
        //                         mitre_attack.objects[i]
        //                 } else if (
        //                     mitre_attack.objects[i].type == "intrusion-set" &&
        //                     relevantGroups.indexOf(
        //                         mitre_attack.objects[i].name
        //                     ) >= 0
        //                 ) {
        //                     group_ref.push(mitre_attack.objects[i].id)
        //                     group_ref_to_description[
        //                         mitre_attack.objects[i].id
        //                     ] = mitre_attack.objects[i].description
        //                     refs[mitre_attack.objects[i].id] =
        //                         mitre_attack.objects[i]
        //                 }
        //             }

        //             for (let i = 0; i < mitre_attack.objects.length; i++) {
        //                 if (mitre_attack.objects[i].type == "relationship") {
        //                     if (
        //                         group_ref.indexOf(
        //                             mitre_attack.objects[i].source_ref
        //                         ) >= 0 &&
        //                         technique_ref.indexOf(
        //                             mitre_attack.objects[i].target_ref
        //                         ) >= 0
        //                     ) {
        //                         if (
        //                             !window.threat_groups[
        //                                 refs[mitre_attack.objects[i].source_ref]
        //                                     .name
        //                             ]
        //                         ) {
        //                             window.threat_groups[
        //                                 refs[
        //                                     mitre_attack.objects[i].source_ref
        //                                 ].name
        //                             ] = []
        //                         }
        //                         refs[
        //                             mitre_attack.objects[i].target_ref
        //                         ].group_description =
        //                             group_ref_to_description[
        //                                 mitre_attack.objects[i].source_ref
        //                             ]
        //                         let relationshipObj = JSON.parse(
        //                             JSON.stringify(
        //                                 refs[mitre_attack.objects[i].target_ref]
        //                             )
        //                         )
        //                         relationshipObj.relationship_notes =
        //                             mitre_attack.objects[i]
        //                         window.threat_groups[
        //                             refs[mitre_attack.objects[i].source_ref]
        //                                 .name
        //                         ].push(relationshipObj)
        //                     }
        //                     if (
        //                         group_ref.indexOf(
        //                             mitre_attack.objects[i].target_ref
        //                         ) >= 0 &&
        //                         technique_ref.indexOf(
        //                             mitre_attack.objects[i].source_ref
        //                         ) >= 0
        //                     ) {
        //                         if (
        //                             !window.threat_groups[
        //                                 refs[mitre_attack.objects[i].target_ref]
        //                                     .name
        //                             ]
        //                         ) {
        //                             window.threat_groups[
        //                                 refs[
        //                                     mitre_attack.objects[i].target_ref
        //                                 ].name
        //                             ] = []
        //                         }
        //                         refs[
        //                             mitre_attack.objects[i].target_ref
        //                         ].group_description =
        //                             group_ref_to_description[
        //                                 mitre_attack.objects[i].source_ref
        //                             ]
        //                         let relationshipObj = JSON.parse(
        //                             JSON.stringify(
        //                                 refs[mitre_attack.objects[i].source_ref]
        //                             )
        //                         )
        //                         relationshipObj.relationship_notes =
        //                             mitre_attack.objects[i]
        //                         window.threat_groups[
        //                             refs[mitre_attack.objects[i].target_ref]
        //                                 .name
        //                         ].push(relationshipObj)
        //                     }
        //                     refs[mitre_attack.objects[i].id] =
        //                         mitre_attack.objects[i]
        //                 }
        //             }

        //             function numberToWord(num) {
        //                 let numbersToWords = [
        //                     "zero",
        //                     "one",
        //                     "two",
        //                     "three",
        //                     "four",
        //                     "five",
        //                     "six",
        //                     "seven",
        //                     "eight",
        //                     "nine",
        //                     "ten",
        //                     "eleven",
        //                     "twelve",
        //                     "thirteen",
        //                     "fourteen",
        //                     "fifteen",
        //                     "sixteen",
        //                     "seventeen",
        //                     "eighteen",
        //                     "nineteen",
        //                     "twenty",
        //                     "twenty-one",
        //                     "twenty-two",
        //                     "twenty-three",
        //                     "twenty-four",
        //                     "twenty-five",
        //                     "twenty-six",
        //                     "twenty-seven",
        //                     "twenty-eight",
        //                     "twenty-nine",
        //                     "thirty",
        //                     "thirty-one",
        //                     "thirty-two",
        //                     "thirty-three",
        //                     "thirty-four",
        //                     "thirty-five",
        //                     "thirty-six",
        //                     "thirty-seven",
        //                     "thirty-eight",
        //                     "thirty-nine",
        //                     "forty",
        //                     "forty-one",
        //                     "forty-two",
        //                     "forty-three",
        //                     "forty-four",
        //                     "forty-five",
        //                     "forty-six",
        //                     "forty-seven",
        //                     "forty-eight",
        //                     "forty-nine",
        //                     "fifty",
        //                     "fifty-one",
        //                     "fifty-two",
        //                     "fifty-three",
        //                     "fifty-four",
        //                     "fifty-five",
        //                     "fifty-six",
        //                     "fifty-seven",
        //                     "fifty-eight",
        //                     "fifty-nine",
        //                     "sixty",
        //                     "sixty-one",
        //                     "sixty-two",
        //                     "sixty-three",
        //                     "sixty-four",
        //                     "sixty-five",
        //                     "sixty-six",
        //                     "sixty-seven",
        //                     "sixty-eight",
        //                     "sixty-nine",
        //                     "seventy",
        //                     "seventy-one",
        //                     "seventy-two",
        //                     "seventy-three",
        //                     "seventy-four",
        //                     "seventy-five",
        //                     "seventy-six",
        //                     "seventy-seven",
        //                     "seventy-eight",
        //                     "seventy-nine",
        //                     "eighty",
        //                     "eighty-one",
        //                     "eighty-two",
        //                     "eighty-three",
        //                     "eighty-four",
        //                     "eighty-five",
        //                     "eighty-six",
        //                     "eighty-seven",
        //                     "eighty-eight",
        //                     "eighty-nine",
        //                     "ninety",
        //                     "ninety-one",
        //                     "ninety-two",
        //                     "ninety-three",
        //                     "ninety-four",
        //                     "ninety-five",
        //                     "ninety-six",
        //                     "ninety-seven",
        //                     "ninety-eight",
        //                     "ninety-nine",
        //                     "one hundred",
        //                 ]
        //                 let str = numbersToWords[num]
        //                 str = str.charAt(0).toUpperCase() + str.slice(1)
        //                 return str
        //             }

        //             // console.log("In the Modal", groupName)
        //             // Now we initialize the Modal itself
        //             var myModal = new Modal(
        //                 "threatGroups",
        //                 {
        //                     title: Splunk.util.sprintf(
        //                         _("Threat Group: %s").t(),
        //                         groupName
        //                     ),
        //                     backdrop: "static",
        //                     keyboard: true,
        //                     destroyOnHide: true,
        //                 },
        //                 $
        //             )
        //             myModal.$el.addClass("modal-extra-wide")
        //             let myBody = $("<div>")
        //             if (!window.threat_groups[groupName]) {
        //                 myBody.html(
        //                     "<p>Application Error -- " +
        //                         groupName +
        //                         " not found.</p>"
        //                 )
        //             } else {
        //                 if (
        //                     window.threat_groups[groupName][0][
        //                         "group_description"
        //                     ]
        //                 ) {
        //                     myBody.append(
        //                         "<h4>" + _("Description").t() + "</h4>"
        //                     )
        //                     let description
        //                     try {
        //                         description = window.threat_groups[
        //                             groupName
        //                         ][0]["group_description"].replace(
        //                             /\[([^\]]*)\]\(.*?\)/g,
        //                             "$1"
        //                         )
        //                     } catch (error) {
        //                         description =
        //                             window.threat_groups[groupName][0][
        //                                 "group_description"
        //                             ]
        //                     }
        //                     myBody.append(
        //                         $('<p style="white-space: pre-line">').text(
        //                             description
        //                         )
        //                     )
        //                 }
        //                 myBody.append("<h4>" + _("Links").t() + "</h4>")

        //                 // extract the url in the mitre description
        //                 let regExp = /\(([^)]+)\)/
        //                 let group_description_url = regExp.exec(
        //                     window.threat_groups[groupName][0][
        //                         "group_description"
        //                     ]
        //                 )[1]

        //                 myBody.append(
        //                     $("<p>").append(
        //                         $(
        //                             '<a target="_blank" class="external drilldown-icon">'
        //                         )
        //                             .text(_("MITRE ATT&CK Site").t())
        //                             .attr("href", group_description_url)
        //                     )
        //                 )

        //                 myBody.append(
        //                     $("<p>").append(
        //                         $(
        //                             '<a target="_blank" class="external drilldown-icon">'
        //                         )
        //                             .text(
        //                                 _(
        //                                     "Splunk Security Essentials Content"
        //                                 ).t()
        //                             )
        //                             .attr(
        //                                 "href",
        //                                 "contents#mitre_threat_groups=" +
        //                                     encodeURIComponent(
        //                                         window.threat_groups[
        //                                             groupName
        //                                         ][0]["group_name"]
        //                                     )
        //                             )
        //                     )
        //                 )
        //                 myBody.append("<h4>" + _("Techniques").t() + "</h4>")
        //                 if (window.threat_groups[groupName].length > 1) {
        //                     myBody.append(
        //                         "<p>" +
        //                             Splunk.util.sprintf(
        //                                 _(
        //                                     "%s techniques used by %s For %s"
        //                                 ).t(),
        //                                 numberToWord(
        //                                     window.threat_groups[groupName]
        //                                         .length
        //                                 ),
        //                                 groupName,
        //                                 window.summary.name
        //                             ) +
        //                             "</p>"
        //                     )
        //                 } else {
        //                     myBody.append(
        //                         "<p>" +
        //                             Splunk.util.sprintf(
        //                                 _("%s technique used by %s For %s").t(),
        //                                 numberToWord(
        //                                     window.threat_groups[groupName]
        //                                         .length
        //                                 ),
        //                                 groupName,
        //                                 window.summary.name
        //                             ) +
        //                             "</p>"
        //                     )
        //                 }

        //                 for (
        //                     let i = 0;
        //                     i < window.threat_groups[groupName].length;
        //                     i++
        //                 ) {
        //                     if (i > 0) {
        //                         myBody.append("<hr/>")
        //                     }
        //                     myBody.append(
        //                         $("<h4>").append(
        //                             $(
        //                                 '<a href="#" click="return false;" style="color: black"><i  class="icon-chevron-right" /> ' +
        //                                     window.threat_groups[groupName][i][
        //                                         "technique_id"
        //                                     ] +
        //                                     ": " +
        //                                     window.threat_groups[groupName][i][
        //                                         "technique_name"
        //                                     ] +
        //                                     "</a>"
        //                             )
        //                                 .attr(
        //                                     "data-id",
        //                                     window.threat_groups[groupName][i][
        //                                         "technique_id"
        //                                     ]
        //                                 )
        //                                 .click(function (evt) {
        //                                     let id = $(evt.target)
        //                                         .closest("h4")
        //                                         .find("a")
        //                                         .attr("data-id")
        //                                     let descriptionObj = $(
        //                                         "#" + id + "_description"
        //                                     )
        //                                     let myObj = $(evt.target)
        //                                         .closest("h4")
        //                                         .find("i")
        //                                     let currentStatus =
        //                                         myObj.attr("class")
        //                                     if (
        //                                         currentStatus ==
        //                                         "icon-chevron-down"
        //                                     ) {
        //                                         myObj.attr(
        //                                             "class",
        //                                             "icon-chevron-right"
        //                                         )
        //                                         descriptionObj.css(
        //                                             "display",
        //                                             "none"
        //                                         )
        //                                     } else {
        //                                         myObj.attr(
        //                                             "class",
        //                                             "icon-chevron-down"
        //                                         )
        //                                         descriptionObj.css(
        //                                             "display",
        //                                             "block"
        //                                         )
        //                                     }
        //                                     return false
        //                                 })
        //                         )
        //                     )

        //                     let description
        //                     try {
        //                         description = window.threat_groups[groupName][
        //                             i
        //                         ]["description"].replace(
        //                             /\[([^\]]*)\]\(.*?\)/g,
        //                             "$1"
        //                         )
        //                     } catch (error) {
        //                         description =
        //                             window.threat_groups[groupName][i][
        //                                 "description"
        //                             ]
        //                     }

        //                     myBody.append(
        //                         $(
        //                             '<p id="' +
        //                                 window.threat_groups[groupName][i][
        //                                     "technique_id"
        //                                 ] +
        //                                 '_description" style="display: none; white-space: pre-line">'
        //                         ).text(description)
        //                     )
        //                     myBody.append(
        //                         $("<p>").text(
        //                             _("MITRE ATT&CK Summary: ").t() +
        //                                 window.threat_groups[groupName][i][
        //                                     "relationship_notes"
        //                                 ]["description"].replace(
        //                                     /\[([^\]]*)\]\(.*?\)/g,
        //                                     "$1"
        //                                 )
        //                         )
        //                     )
        //                     if (
        //                         window.threat_groups[groupName][i][
        //                             "relationship_notes"
        //                         ]["external_references"].length > 0
        //                     ) {
        //                         let shouldAppend = false
        //                         let myTable = $(
        //                             '<table class="table"><thead><tr><th>Source Name</th><th>Description</th><th>Link</th></tr></thead><tbody></tbody></table>'
        //                         )
        //                         for (
        //                             let g = 0;
        //                             g <
        //                             window.threat_groups[groupName][i][
        //                                 "relationship_notes"
        //                             ]["external_references"].length;
        //                             g++
        //                         ) {
        //                             if (
        //                                 !window.threat_groups[groupName][i][
        //                                     "relationship_notes"
        //                                 ]["external_references"][g][
        //                                     "description"
        //                                 ] ||
        //                                 window.threat_groups[groupName][i][
        //                                     "relationship_notes"
        //                                 ]["external_references"][g][
        //                                     "description"
        //                                 ] == ""
        //                             ) {
        //                                 continue
        //                             }
        //                             shouldAppend = true
        //                             let description
        //                             try {
        //                                 description = window.threat_groups[
        //                                     groupName
        //                                 ][i]["relationship_notes"][
        //                                     "external_references"
        //                                 ][g]["description"].replace(
        //                                     /\[([^\]]*)\]\(.*?\)/g,
        //                                     "$1"
        //                                 )
        //                             } catch (error) {
        //                                 description =
        //                                     window.threat_groups[groupName][i][
        //                                         "relationship_notes"
        //                                     ]["external_references"][g][
        //                                         "description"
        //                                     ]
        //                             }
        //                             myTable.find("tbody").append(
        //                                 $("<tr>").append(
        //                                     $("<td>").text(
        //                                         window.threat_groups[groupName][
        //                                             i
        //                                         ]["relationship_notes"][
        //                                             "external_references"
        //                                         ][g]["source_name"]
        //                                     ),
        //                                     $(
        //                                         '<td style="white-space: pre-line">'
        //                                     ).text(description), // (window.threat_groups[groupName][i]['external_references'][g]['description']),
        //                                     $("<td>").html(
        //                                         $(
        //                                             '<a target="_blank" class="external drilldown-icon"></a>'
        //                                         ).attr(
        //                                             "href",
        //                                             window.threat_groups[
        //                                                 groupName
        //                                             ][i]["relationship_notes"][
        //                                                 "external_references"
        //                                             ][g]["url"]
        //                                         )
        //                                     )
        //                                 )
        //                             )
        //                         }
        //                         if (shouldAppend) {
        //                             myBody.append(myTable)
        //                         }
        //                     }
        //                 }
        //             }
        //             myModal.body.append(myBody)

        //             myModal.footer.append(
        //                 $("<button>")
        //                     .attr({
        //                         type: "button",
        //                         "data-dismiss": "modal",
        //                         "data-bs-dismiss": "modal",
        //                     })
        //                     .addClass("btn btn-primary")
        //                     .text(_("Close").t())
        //                     .on("click", function () {
        //                         // Not taking any action here
        //                     })
        //             )
        //             myModal.show() // Launch it!
        //         })
        //     }
        //     window.showGroup = showGroup

        //     var mitreThreatGroupText = ""

        //     if (
        //         typeof summary.mitre_threat_groups != "undefined" &&
        //         summary.mitre_threat_groups != ""
        //     ) {
        //         let mitre = summary.mitre_threat_groups.split("|")
        //         if (mitre.indexOf("None") >= 0) {
        //             mitre = mitre.splice(mitre.indexOf("None"), 1)
        //         }
        //         if (mitre.length > 0 && mitreThreatGroupText == "") {
        //             mitreThreatGroupText =
        //                 '<h2 style="margin-bottom: 5px;">' +
        //                 _("MITRE Threat Groups").t() +
        //                 " (" +
        //                 _("Click for Detail").t() +
        //                 ")</h2>" // + " <a href=\"https://attack.mitre.org/groups/\" class=\"external drilldown-icon\" target=\"_blank\"></a></h2>"
        //         }
        //         let numAdded = 0
        //         for (var i = 0; i < mitre.length; i++) {
        //             if (mitre[i] == "None") {
        //                 continue
        //             }
        //             numAdded++
        //             mitreThreatGroupText +=
        //                 '<div class="mitre_threat_groupsElements" onclick="showGroup(\'' +
        //                 mitre[i] +
        //                 "')\">" +
        //                 mitre[i] +
        //                 "</div>"
        //         }
        //         mitreThreatGroupText += '<br style="clear: both;"/>'
        //         if (numAdded == 0) {
        //             mitreThreatGroupText = ""
        //         }
        //     }
        //     // if (typeof summary.mitre_technique_group_json != "undefined" && summary.mitre_technique_group_json != "") {
        //     //     try{
        //     //         let groups = JSON.parse(summary.mitre_technique_group_json)
        //     //         let group_names = Object.keys(groups);
        //     //         group_names.sort()
        //     //         window.threat_groups = groups;
        //     //         if (group_names.length > 0) {
        //     //             mitreThreatGroupText = "<h2 style=\"margin-bottom: 5px;\">" + _("MITRE Threat Groups").t() + " (Click for Detail)</h2>"
        //     //         }
        //     //         for(let i = 0; i < group_names.length; i++){

        //     //             mitreThreatGroupText += "<div class=\"mitre_threat_groupsElements\" onclick=\"showGroup('" + group_names[i] + "')\">" + group_names[i] + "</div>"
        //     //         }

        //     //         mitreThreatGroupText += "<br style=\"clear: both;\"/>"
        //     //         console.log("Hey! Got groups", groups)
        //     //     }catch(error){
        //     //         console.log("Error parsing groups", error)

        //     //     }
        //     // }
        //     // if (typeof summary.mitre_threat_groups != "undefined" && summary.mitre_threat_groups != "") {
        //     //     let mitre = summary.mitre_threat_groups.split("|")
        //     //     if (mitre.indexOf("None") >= 0) {
        //     //         mitre = mitre.splice(mitre.indexOf("None"), 1);
        //     //     }
        //     //     if (mitre.length > 0 && mitreThreatGroupText == "") {
        //     //         mitreThreatGroupText = "<h2 style=\"margin-bottom: 5px;\">" + _("MITRE Threat Groups").t() + " <a href=\"https://attack.mitre.org/groups/\" class=\"external drilldown-icon\" target=\"_blank\"></a></h2>"
        //     //     }
        //     //     let numAdded = 0;
        //     //     for (var i = 0; i < mitre.length; i++) {
        //     //         if (mitre[i] == "None") {
        //     //             continue;
        //     //         }
        //     //         numAdded++;
        //     //         mitreThreatGroupText += "<div class=\"mitre_threat_groupsElements\">" + mitre[i] + "</div>"
        //     //     }
        //     //     mitreThreatGroupText += "<br style=\"clear: both;\"/>"
        //     //     if (numAdded == 0) {
        //     //         mitreThreatGroupText = ""
        //     //     }
        //     // }

        //     var killchainText = ""
        //     if (
        //         typeof summary.killchain != "undefined" &&
        //         summary.killchain != ""
        //     ) {
        //         let killchain = summary.killchain
        //             ? summary.killchain.split("|")
        //             : []
        //         if (killchain.length > 0 && killchainText == "") {
        //             killchainText =
        //                 '<h2 style="margin-bottom: 5px;">' +
        //                 _("Kill Chain Phases").t() +
        //                 ' <a href="https://www.lockheedmartin.com/us/what-we-do/aerospace-defense/cyber/cyber-kill-chain.html" class="external drilldown-icon" target="_blank"></a></h2>'
        //         }
        //         let numAdded = 0
        //         for (var i = 0; i < killchain.length; i++) {
        //             if (killchain[i] == "None") {
        //                 continue
        //             }
        //             numAdded++
        //             killchainText +=
        //                 '<div class="killchain">' + killchain[i] + "</div>"
        //         }
        //         killchainText += '<br style="clear: both;"/>'
        //         if (numAdded == 0) {
        //             killchainText = ""
        //         }
        //     }

        //     var cisText = ""
        //     if (typeof summary.cis != "undefined") {
        //         cis = summary.cis.split("|")
        //         for (var i = 0; i < cis.length; i++) {
        //             cisText += '<div class="cis">' + cis[i] + "</div>"
        //         }
        //         cisText += "<br/><br/>"
        //     }

        //     var technologyText = ""
        //     if (typeof summary.technology != "undefined") {
        //         technology = summary.technology.split("|")
        //         for (var i = 0; i < technology.length; i++) {
        //             technologyText +=
        //                 '<div class="technology">' + technology[i] + "</div>"
        //         }
        //         technologyText += "<br/><br/>"
        //     }
        //     var YouTubeText = ""
        //     if (typeof summary.youtube != "undefined") {
        //         YouTubeText = Template.replace(/SHORTNAME/g, "youtube").replace(
        //             "TITLE",
        //             "Search Explanation - Video"
        //         )
        //         YouTubeText +=
        //             '<div class="auto-resizable-iframe"><div><iframe src="' +
        //             summary.youtube +
        //             '" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>'
        //         YouTubeText += "</div></div><br/><br/></td></tr></table>"
        //     }

        //     var box1 =
        //         '<div style="overflow: hidden; padding: 10px; margin: 0px; width: 50%; min-width:585px; min-height: 250px; display: table-cell; border: 1px solid darkgray;">' +
        //         usecaseText +
        //         areaText +
        //         relevance +
        //         alertVolumeText +
        //         SPLEaseText +
        //         security_content_fields["analytic_stories"] +
        //         security_content_fields["dataset"] +
        //         security_content_fields["how_to_implement"] +
        //         security_content_fields["known_false_positives"] +
        //         security_content_fields["role_based_alerting"] +
        //         "</div>"
        //     var box2 =
        //         '<div style="overflow: hidden; padding: 10px; margin: 0px; width: 49%; min-width:305px; min-height: 250px; display: table-cell; border: 1px solid darkgray; border-left: 0">' +
        //         BookmarkStatus +
        //         DataAvailabilityStatus +
        //         Stage +
        //         mitreText +
        //         mitreTechniqueText +
        //         mitreThreatGroupText +
        //         killchainText +
        //         cisText +
        //         technologyText +
        //         datasourceText +
        //         datamodelText +
        //         security_content_fields["asset_type"] +
        //         security_content_fields["references"] +
        //         "</div>"
        //     description =
        //         panelStart +
        //         descriptionText +
        //         companyTextBanner +
        //         cloneToCustomContent +
        //         '<br/><div style=" display: table;">' +
        //         box1 +
        //         box2 +
        //         "</div>" +
        //         panelEnd
        //     var descriptiontwo =
        //         panelStart +
        //         partnerText +
        //         companyTextDescription +
        //         gdprText +
        //         otherSplunkCapabilitiesText +
        //         SOARText +
        //         howToImplementText +
        //         eli5Text +
        //         YouTubeText +
        //         knownFPText +
        //         operationalizeText +
        //         supportingImagesText +
        //         showSPLText +
        //         per_instance_help +
        //         additionalContextText +
        //         searchStringText +
        //         baselinesText +
        //         analyticStoryText +
        //         panelEnd
        //     //description = panelStart + descriptionText + '<br/><div style=" display: table;">' + box1 + box2 + '</div><br/>' + gdprText + otherSplunkCapabilitiesText + SOARText + howToImplementText + eli5Text + YouTubeText + knownFPText + operationalizeText + supportingImagesText + showSPLText + per_instance_help + searchStringText + panelEnd

        //     // Helper Functions
        //     function data_available_modal(obj) {
        //         require([
        //             "jquery",
        //             "components/controls/Modal",
        //             "json!" +
        //                 $C["SPLUNKD_PATH"] +
        //                 "/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/data_inventory_eventtypes",
        //             "json!" +
        //                 $C["SPLUNKD_PATH"] +
        //                 "/services/pullJSON?config=data_inventory&locale=" +
        //                 window.localeString,
        //         ], function (
        //             $,
        //             Modal,
        //             data_inventory_eventtypes,
        //             data_inventory
        //         ) {
        //             let myModal = new Modal(
        //                 "data_sources",
        //                 {
        //                     title: "Dependent Data Sources",
        //                     destroyOnHide: true,
        //                 },
        //                 $
        //             )
        //             if (!window.ShowcaseInfo) {
        //                 $.ajax({
        //                     url:
        //                         $C["SPLUNKD_PATH"] +
        //                         "/services/SSEShowcaseInfo?locale=" +
        //                         window.localeString,
        //                     async: false,
        //                     success: function (returneddata) {
        //                         window.ShowcaseInfo = returneddata
        //                     },
        //                 })
        //             }

        //             let body = $("<div>")
        //             let container = $(obj).closest(".contentDescription")
        //             if (!summary) {
        //                 let showcaseId = container.attr("data-showcaseid")
        //                 let summary =
        //                     window.ShowcaseInfo["summaries"][showcaseId]
        //             }
        //             let dscs = summary.data_source_categories.split("|")
        //             // console.log("blah blah", summary, dscs)

        //             body.append(
        //                 $("<p>").html(
        //                     _(
        //                         'The data availability metric is driven by the configuration on the <a href="data_inventory" target="_blank" class="drilldown-link">Data Inventory</a> dashboard.'
        //                     ).t()
        //                 )
        //             )

        //             if (dscs.length > 1) {
        //                 body.append(
        //                     $("<p>").html(
        //                         _(
        //                             "There are multiple potential data source categories for this example. The aggregate score is taken by averaging all of the following."
        //                         ).t()
        //                     )
        //                 )
        //             }

        //             let table = $(
        //                 '<table class="table"><thead><tr><th>' +
        //                     _("Data Source Category").t() +
        //                     "</th><th>" +
        //                     _("Status").t() +
        //                     "</th><th>Open</th></tr></thead><tbody></tbody></table>"
        //             )

        //             for (let i = 0; i < dscs.length; i++) {
        //                 let status = "?"
        //                 for (
        //                     let g = 0;
        //                     g < data_inventory_eventtypes.length;
        //                     g++
        //                 ) {
        //                     if (
        //                         data_inventory_eventtypes[g]["eventtypeId"] ==
        //                         dscs[i]
        //                     ) {
        //                         if (
        //                             data_inventory_eventtypes[g][
        //                                 "coverage_level"
        //                             ] &&
        //                             data_inventory_eventtypes[g][
        //                                 "coverage_level"
        //                             ] != "" &&
        //                             parseInt(
        //                                 data_inventory_eventtypes[g][
        //                                     "coverage_level"
        //                                 ]
        //                             ) >= 0
        //                         ) {
        //                             status =
        //                                 data_inventory_eventtypes[g][
        //                                     "coverage_level"
        //                                 ] + "%"
        //                         } else if (
        //                             data_inventory_eventtypes[g]["status"] &&
        //                             data_inventory_eventtypes[g]["status"] ==
        //                                 "failure"
        //                         ) {
        //                             status = "None"
        //                         } else {
        //                             status = "Complete"
        //                         }
        //                     }
        //                 }
        //                 let name = ""
        //                 for (let ds in data_inventory) {
        //                     for (let dsc in data_inventory[ds]["eventtypes"]) {
        //                         if (dsc == dscs[i]) {
        //                             name =
        //                                 data_inventory[ds]["eventtypes"][dsc][
        //                                     "name"
        //                                 ]
        //                         }
        //                     }
        //                 }
        //                 table
        //                     .find("tbody")
        //                     .append(
        //                         $(
        //                             "<tr><td>" +
        //                                 name +
        //                                 "</td><td>" +
        //                                 status +
        //                                 '</td><td><a href="data_inventory#id=' +
        //                                 dscs[i] +
        //                                 '" target="_blank" class="external drilldown-link"></a></td></tr>'
        //                         )
        //                     )
        //             }
        //             body.append(table)

        //             myModal.body.html(body)

        //             myModal.footer.append(
        //                 $("<button>")
        //                     .attr({
        //                         type: "button",
        //                         "data-dismiss": "modal",
        //                         "data-bs-dismiss": "modal",
        //                     })
        //                     .addClass("btn btn-primary")
        //                     .text("Close")
        //                     .on("click", function () {
        //                         // Not taking any action on Close
        //                     })
        //             )
        //             myModal.show()
        //         })
        //     }
        //     window.data_available_modal = data_available_modal

        //     function generateContentMappingBlock(summary) {
        //         var content_mappings = {}
        //         if (typeof summary.search_title != "undefined") {
        //             content_mappings = summary.search_title.split("|")
        //         }

        //         let block = ""
        //         block +=
        //             '<h2>Content Mapping<img class="content_mapping_link_image" src="/static/app/Splunk_Security_Essentials/images/general_images/content_mapped.png" /></h2>'
        //         if (content_mappings.length > 0 && content_mappings[0] != "") {
        //             if (content_mappings.length > 1) {
        //                 block +=
        //                     "<p>This content has been mapped to the local saved searches:"
        //             } else {
        //                 block +=
        //                     "<p>This content has been mapped to the local saved search:"
        //             }
        //             block +=
        //                 " <a class='add_content_mapping_link' data-id='" +
        //                 summary.id +
        //                 "' onclick=\"savedSearchSelector('" +
        //                 summary.id +
        //                 "'); return false;\">Edit mapping</a>"
        //             block += "<ul>"
        //             for (var i = 0; i < content_mappings.length; i++) {
        //                 let localsavedsearch = []
        //                 let localsavedsearchapp = "Splunk_Security_Essentials"
        //                 let contentMapping = content_mappings[i]
        //                 getSavedSearchByName(contentMapping)
        //                     .then((data) => {
        //                         if (data) {
        //                             localsavedsearch = data
        //                             localsavedsearchapp =
        //                                 localsavedsearch["app"]
        //                             if (
        //                                 localStorage["isESInstalled"] ===
        //                                     "true" &&
        //                                 localsavedsearccontentBlockShowcaseId
        //                             ) {
        //                                 localsavedsearchapp =
        //                                     "SplunkEnterpriseSecuritySuite"
        //                                 //Content management view with filter
        //                                 var edit_alert_link_base =
        //                                     "/app/" +
        //                                     localsavedsearchapp +
        //                                     "/ess_content_management?textFilter="
        //                                 edit_alert_link_url =
        //                                     edit_alert_link_base +
        //                                     encodeURIComponent(
        //                                         localsavedsearch["name"]
        //                                     )
        //                             } else {
        //                                 //Saved search search editor
        //                                 var edit_alert_link_url =
        //                                     "/manager/" +
        //                                     localsavedsearchapp +
        //                                     "/saved/searches/" +
        //                                     encodeURIComponent(
        //                                         localsavedsearch["name"]
        //                                     ) +
        //                                     "?app=" +
        //                                     localsavedsearchapp +
        //                                     "&search=%22" +
        //                                     encodeURIComponent(
        //                                         localsavedsearch["name"]
        //                                     ) +
        //                                     "%22" +
        //                                     "&uri=%2FservicesNS%2Fnobody%2F" +
        //                                     localsavedsearchapp +
        //                                     "%2Fsaved%2Fsearches%2F" +
        //                                     encodeURIComponent(
        //                                         encodeURIComponent(
        //                                             localsavedsearch["name"]
        //                                         )
        //                                     ) +
        //                                     "&action=edit"
        //                             }
        //                             content_mapping_link_url =
        //                                 edit_alert_link_url
        //                             var content_mapping_id =
        //                                 contentMapping.replace(
        //                                     /[^a-zA-Z0-9]/g,
        //                                     ""
        //                                 )
        //                             block +=
        //                                 "<li id='mapping_" +
        //                                 content_mapping_id +
        //                                 '\'><a class="external drilldown-link" target="_blank" href="' +
        //                                 content_mapping_link_url +
        //                                 '"> ' +
        //                                 contentMapping +
        //                                 '</a> <span><a class="delete_content_mapping" onclick=deleteContentMappingRow(\'' +
        //                                 content_mapping_id +
        //                                 "');deleteContentMapping('" +
        //                                 encodeURI(contentMapping) +
        //                                 "');return false;>[Remove]</a><span></li>"
        //                         }
        //                         if (i === content_mappings.length - 1) {
        //                             block += "</ul>"
        //                             block += "</p>"
        //                             return block
        //                         }
        //                     })
        //                     .catch((error) => {
        //                         console.log("Error: ", error)
        //                     })
        //             }
        //         } else {
        //             block +=
        //                 "<p>This content is not mapped to any local saved search. <a class='add_content_mapping_link' data-id='" +
        //                 summary.id +
        //                 "' onclick=\"savedSearchSelector('" +
        //                 summary.id +
        //                 "'); return false;\">Add mapping</a></p>"

        //             return block
        //         }
        //     }
        //     window.generateContentMappingBlock = generateContentMappingBlock

        //     function updateContenMappingblock(summary) {
        //         $("#contentMappingBlock_" + summary.id).empty()
        //         $("#contentMappingBlock_" + summary.id).html(
        //             generateContentMappingBlock(summary)
        //         )
        //     }
        //     window.updateContenMappingblock = updateContenMappingblock

        //     function savedSearchSelector(showcaseId) {
        //         var contentMappings = []
        //         if (typeof summary.search_title != "undefined") {
        //             contentMappings = summary.search_title.split("|")
        //         }
        //         window.showcaseId = showcaseId
        //         if (
        //             typeof fullShowcaseInfo != "undefined" &&
        //             typeof fullShowcaseInfo.summaries[showcaseId] !=
        //                 "undefined" &&
        //             fullShowcaseInfo.summaries[showcaseId] != ""
        //         ) {
        //             summary = fullShowcaseInfo.summaries[showcaseId]
        //         }
        //         SavedSearchSelectorModal = window
        //             .generateSavedSearchSelectorModal(contentMappings)
        //             .then((_) => {
        //                 $("h3.modal-title").text(
        //                     'Map "' +
        //                         summary["name"] +
        //                         '" to local saved searches'
        //                 )
        //                 $("table#contentList").on("update", function () {
        //                     //$(".action_acceptRecommendation").trigger("click");
        //                     $(".action_acceptRecommendation").click(function (
        //                         evt
        //                     ) {
        //                         let content = JSON.parse(
        //                             $(evt.target)
        //                                 .closest("tr")
        //                                 .attr("data-content")
        //                         )
        //                         //let showcaseId = $(evt.target).closest("tr").attr("data-prediction")
        //                         let search_title = $(evt.target)
        //                             .closest("tr")
        //                             .attr("data-searchname")
        //                         if ($(this).hasClass("selected")) {
        //                             //Selected happens before inside the Modal definition, that's why it looks backward
        //                             //KVStore change
        //                             updateStatus(
        //                                 search_title,
        //                                 showcaseId,
        //                                 "create"
        //                             )
        //                             //Gui change
        //                             addContentMappingRow(
        //                                 search_title,
        //                                 showcaseId
        //                             )
        //                         } else {
        //                             //KVStore change
        //                             updateStatus(
        //                                 search_title,
        //                                 showcaseId,
        //                                 "delete"
        //                             )
        //                             //Gui change
        //                             deleteContentMappingRow(search_title)
        //                             deleteContentMapping(
        //                                 encodeURI(search_title)
        //                             )
        //                         }
        //                     })
        //                 })
        //                 $("table#contentList").trigger("update")
        //             })
        //             .catch((err) => {
        //                 console.log("Failed to -> ", err)
        //             })
        //     }
        //     window.savedSearchSelector = savedSearchSelector

        //     function deleteContentMappingRow(search_title) {
        //         var search_title_key = search_title.replace(/[^a-zA-Z0-9]/g, "")
        //         var contentBlockShowcaseId = $("#mapping_" + search_title_key)
        //             .closest("div")
        //             .attr("id")
        //             .split("contentMappingBlock_")[1]
        //         if (
        //             typeof fullShowcaseInfo != "undefined" &&
        //             typeof fullShowcaseInfo.summaries[contentBlockShowcaseId] !=
        //                 "undefined" &&
        //             fullShowcaseInfo.summaries[contentBlockShowcaseId] != ""
        //         ) {
        //             summary = fullShowcaseInfo.summaries[contentBlockShowcaseId]
        //         }
        //         var listlength = $("#mapping_" + search_title_key)
        //             .closest("div")
        //             .find("li").length
        //         //Delete the line in the GUI
        //         $("#mapping_" + search_title_key).remove()

        //         //Delete entry in the saved summary cache
        //         var content_mappings = summary.search_title.split("|")
        //         var newMappings = content_mappings.map((value) =>
        //             value.replace(/[^a-zA-Z0-9]/g, "")
        //         )

        //         content_mappings.splice(
        //             newMappings.indexOf(search_title_key),
        //             1
        //         )
        //         summary.search_title = content_mappings.join("|")
        //         if (typeof fullShowcaseInfo != "undefined") {
        //             fullShowcaseInfo.summaries[contentBlockShowcaseId] = summary
        //         }
        //         if (listlength == 1) {
        //             //Need to rerender the block to change text and add link
        //             updateContenMappingblock(summary)
        //         } else {
        //             //Just delete the line and the entry in the summary
        //         }
        //     }

        //     window.deleteContentMappingRow = deleteContentMappingRow

        //     function addContentMappingRow(search_title, showcaseId) {
        //         if (
        //             typeof fullShowcaseInfo != "undefined" &&
        //             typeof fullShowcaseInfo.summaries[showcaseId] !=
        //                 "undefined" &&
        //             fullShowcaseInfo.summaries[showcaseId] != ""
        //         ) {
        //             summary = fullShowcaseInfo.summaries[showcaseId]
        //         }
        //         var content_mappings = summary.search_title.split("|")
        //         if (content_mappings.length == 1 && content_mappings[0] == "") {
        //             summary.search_title = search_title
        //         } else {
        //             summary.search_title += "|" + search_title
        //         }
        //         updateContenMappingblock(summary)
        //     }
        //     window.addContentMappingRow = addContentMappingRow

        //     window.popBookmarkOptions = function (obj) {
        //         let showcaseId = $(obj)
        //             .closest(".contentDescription")
        //             .attr("data-showcaseid")

        //         function getKeyByValue(object, value) {
        //             return Object.keys(object).find(
        //                 (key) => object[key] === value
        //             )
        //         }

        //         // since the kvstore doesn't expect a reference name we look it up based on the bookmark object in common_objects
        //         for (let i = 0; i < bookmark_names.length; i++) {
        //             if (bookmark_names[i]["referenceName"] == "") {
        //                 bookmark_names[i]["referenceName"] = getKeyByValue(
        //                     window.BookmarkStatus,
        //                     bookmark_names[i]["name"]
        //                 )
        //             }
        //         }

        //         // use this as a way to get an idea of how large to make the dropdown of bookmark items
        //         let contentLength = bookmark_names.length * 56 + 30

        //         var boxHTML = $(
        //             '<div id="box-' +
        //                 name.replace(/ /g, "_").replace(/[^a-zA-Z0-9_]/g, "") +
        //                 '" style="background-color: white; border: 1px gray solid; position: absolute; padding: 7px; left: 190px; top: 0px; width: 210px; height: ' +
        //                 contentLength +
        //                 'px;"></div>'
        //         ).append(
        //             '<i class="icon-close" onclick="$(this).parent().remove()" style="float: right;"></i>',
        //             '<h5 style="padding-top: 0px;padding-bottom: 5px; margin-top: 0px;">Change Status</h5>'
        //         )
        //         boxHTML.append(
        //             $(
        //                 '<p class="bookmarkStatus" id="none" style="cursor: pointer"><span style="display: inline-block; text-align: center; width: 18px;"><img src="' +
        //                     Splunk.util.make_full_url(
        //                         "/static/app/Splunk_Security_Essentials/images/general_images/nobookmark.png"
        //                     ) +
        //                     '" style="height: 18px" /></span> <a href="#" onclick="return false;">' +
        //                     _("Clear Bookmark").t() +
        //                     "</a></p>"
        //             )
        //         )
        //         boxHTML.append(
        //             $(
        //                 '<p class="bookmarkStatus" id="bookmarked" style="cursor: pointer"><span style="display: inline-block; text-align: center; width: 18px;"><i style="font-size: 24px;" class="icon-bookmark"></i></span> <a href="#" onclick="return false;">' +
        //                     _("Bookmarked (no status)").t() +
        //                     "</a></p>"
        //             )
        //         )

        //         // iterate through bookmark_names and add each item to boxHTML with the id from reference ID
        //         for (let i = 0; i < bookmark_names.length; i++) {
        //             boxHTML.append(
        //                 $(
        //                     `<p class="bookmarkStatus" id="${bookmark_names[i]["referenceName"]}" style="cursor: pointer"><span style="display: inline-block; text-align: center; width: 18px;"><i style="font-size: 20px;" class="icon-chevron-right"></i></span> <a href="#" onclick="return false;">${bookmark_names[i]["name"]}</a></div>`
        //                 )
        //             )
        //         }

        //         boxHTML.append(
        //             $(
        //                 '<p class="bookmarkStatus" id="successfullyImplemented" style="cursor: pointer"><span style="display: inline-block; text-align: center; width: 18px;"><i style="font-size: 20px;" class="icon-check-circle"></i></span> <a href="#" onclick="return false;">' +
        //                     _("Successfully Implemented").t() +
        //                     "</a>"
        //             )
        //         )
        //         boxHTML.append($("</div>"))

        //         // register a click listener
        //         $(document).on("click", "p.bookmarkStatus", function () {
        //             //console.log("clicked")
        //             let id = $(this).attr("id")
        //             let text = $(this).find("a").text()
        //             // if showcaseid is empty we need to generate it from the name of the detection
        //             if (typeof showcaseId == "undefined") {
        //                 showcaseId = name.split(" ").join("_").toLowerCase()
        //             }

        //             setbookmark_status(name, showcaseId, id)
        //             $(obj).text(text)
        //             $(obj).append(' <i class="icon-pencil"/>')
        //             setTimeout(function () {
        //                 $(
        //                     "#box-" +
        //                         name
        //                             .replace(/ /g, "_")
        //                             .replace(/[^a-zA-Z0-9_]/g, "")
        //                 ).remove()
        //             }, 1000)
        //         })

        //         var pos = $(obj).offset()
        //         var leftPos = pos.left + 10
        //         var topPos = pos.top + 20
        //         if (leftPos + 200 > $(window).width()) {
        //             leftPos = leftPos - 195
        //             topPos = topPos + 20
        //         }

        //         $(document).keyup(function (e) {
        //             if (e.keyCode === 27)
        //                 if (
        //                     document.getElementById(
        //                         "box-" +
        //                             name
        //                                 .replace(/ /g, "_")
        //                                 .replace(/[^a-zA-Z0-9_]/g, "")
        //                     ) != null
        //                 ) {
        //                     $(
        //                         "#box-" +
        //                             name
        //                                 .replace(/ /g, "_")
        //                                 .replace(/[^a-zA-Z0-9_]/g, "")
        //                     ).remove()
        //                 }
        //         })
        //         $(document).mouseup(function (e) {
        //             var container = $(
        //                 "#box-" +
        //                     name
        //                         .replace(/ /g, "_")
        //                         .replace(/[^a-zA-Z0-9_]/g, "")
        //             )

        //             // if the target of the click isn't the container nor a descendant of the container
        //             if (
        //                 !container.is(e.target) &&
        //                 container.has(e.target).length === 0
        //             ) {
        //                 container.remove()
        //             }
        //         })
        //         $("body").append(boxHTML)
        //         $(
        //             "#" +
        //                 "box-" +
        //                 name.replace(/ /g, "_").replace(/[^a-zA-Z0-9_]/g, "")
        //         ).css({ top: topPos, left: leftPos })
        //     }
        //     return [description, descriptiontwo]
        // },
        // process_chosen_summary: function process_chosen_summary(
        //     $,
        //     summary,
        //     sampleSearch,
        //     ShowcaseInfo,
        //     showcaseName,
        //     showcaseType = "showcase_content"
        // ) {
        //     let translatedLabels = {}
        //     try {
        //         if (
        //             localStorage[
        //                 "Splunk_Security_Essentials-i18n-labels-" +
        //                     window.localeString
        //             ] != undefined
        //         ) {
        //             translatedLabels = JSON.parse(
        //                 localStorage[
        //                     "Splunk_Security_Essentials-i18n-labels-" +
        //                         window.localeString
        //                 ]
        //             )
        //         }
        //     } catch (error) {}

        //     //console.log("ShowcaseInfo: Got it!", summary, sampleSearch, showcaseName)
        //     if (
        //         typeof sampleSearch.label != "undefined" &&
        //         sampleSearch.label.indexOf(" - Demo") > 0
        //     ) {
        //         var unsubmittedTokens =
        //             splunkjs.mvc.Components.getInstance("default")
        //         var submittedTokens =
        //             splunkjs.mvc.Components.getInstance("submitted")
        //         unsubmittedTokens.set("demodata", "blank")
        //         submittedTokens.set(unsubmittedTokens.toJSON())
        //     }

        //     var DoImageSubtitles = function (numLoops) {
        //         if (typeof numLoops == "undefined") numLoops = 1
        //         var doAnotherLoop = false
        //         //console.log("Starting the Subtitle..")
        //         $(".screenshot").each(function (count, img) {
        //             //console.log("got a subtitle", img)

        //             if (
        //                 typeof $(img).css("width") != "undefined" &&
        //                 parseInt($(img).css("width").replace("px")) > 10 &&
        //                 typeof $(img).attr("processed") == "undefined"
        //             ) {
        //                 var width = "width: " + $(img).css("width")

        //                 var myTitle = ""
        //                 if (
        //                     typeof $(img).attr("title") != "undefined" &&
        //                     $(img).attr("title") != ""
        //                 ) {
        //                     myTitle =
        //                         '<p style="color: gray; display: inline-block; clear:both;' +
        //                         width +
        //                         '"><center><i>' +
        //                         $(img).attr("title") +
        //                         "</i></center>"
        //                 }
        //                 $(img).attr("processed", "true")
        //                 if (
        //                     typeof $(img).attr("zoomin") != "undefined" &&
        //                     $(img).attr("zoomin") != ""
        //                 ) {
        //                     // console.log("Handling subtitle zoom...", width, $(img).attr("zoomin"), $(img).attr("setWidth"), (typeof $(img).attr("zoomin") != "undefined" && $(img).attr("zoomin") != ""))
        //                     if (
        //                         typeof $(img).attr("setwidth") != "undefined" &&
        //                         parseInt($(img).css("width").replace("px")) >
        //                             parseInt($(img).attr("setwidth"))
        //                     ) {
        //                         width =
        //                             "width: " + $(img).attr("setwidth") + "px"
        //                     }
        //                     $(img).replaceWith(
        //                         '<div style="display: inline-block; margin:10px; border: 1px solid lightgray;' +
        //                             width +
        //                             '"><a href="' +
        //                             $(img).attr("src") +
        //                             '" target="_blank">' +
        //                             img.outerHTML +
        //                             "</a>" +
        //                             myTitle +
        //                             "</div>"
        //                     )
        //                 } else {
        //                     $(img).replaceWith(
        //                         '<div style="display: block; margin:10px; border: 1px solid lightgray;' +
        //                             width +
        //                             '">' +
        //                             img.outerHTML +
        //                             myTitle +
        //                             "</div>"
        //                     )
        //                 }
        //             } else {
        //                 doAnotherLoop = true
        //                 //console.log("Analyzing image: ", $(img).css("width"), $(img).attr("processed"), $(img))
        //             }
        //         })
        //         if (doAnotherLoop && numLoops < 30) {
        //             numLoops++
        //             setTimeout(function () {
        //                 DoImageSubtitles(numLoops)
        //             }, 500)
        //         }
        //     }
        //     window.DoImageSubtitles = DoImageSubtitles
        //     require([
        //         "json!" +
        //             $C["SPLUNKD_PATH"] +
        //             "/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/sse_app_config",
        //     ], function (appConfig) {
        //         let telemetryObj = {
        //             status: "exampleLoaded",
        //             exampleName: summary.name,
        //             searchName: sampleSearch.label,
        //         }
        //         for (let i = 0; i < appConfig.length; i++) {
        //             if (
        //                 appConfig[i].param == "demoMode" &&
        //                 appConfig[i].value == "true"
        //             ) {
        //                 telemetryObj.demoMode = true
        //             }
        //         }
        //         Telemetry.SendTelemetryToSplunk("PageStatus", telemetryObj)
        //     })

        //     $("#row1").hide() // Hide the basic search link
        //     $(".hide-global-filters").hide() // Hide the "Hide Filters" link

        //     if (typeof $(".dashboard-header-title")[0] != "undefined") {
        //         $(".dashboard-header-description").html(
        //             "Assistant: " + $(".dashboard-header-title").first().html()
        //         )
        //         $(".dashboard-header-title").html(
        //             '<a href="contents">' +
        //                 _("Security Content").t() +
        //                 "</a> / " +
        //                 summary.name
        //         )

        //         // Add edit button on the custom content showcase page
        //         let showcaseId = summary.id
        //         if (showcaseId.includes("custom_")) {
        //             require(["components/pages/custom_content"], function (
        //                 custom_content
        //             ) {
        //                 $(".dashboard-header-title").append(
        //                     $(
        //                         '<i class="icon-pencil action_custom_edit"></i><span class="action_custom_edit"> Edit</span></h1>'
        //                     ).click(function (evt) {
        //                         editCustomContent(
        //                             showcaseId,
        //                             ShowcaseInfo,
        //                             summary,
        //                             true
        //                         )
        //                     })
        //                 )
        //             })
        //         }
        //     } else {
        //         //$(".dashboard-header-description").html("Assistant: " + $(".dashboard-header-title").first().html() )
        //         $(".dashboard-header h2")
        //             .first()
        //             .html(
        //                 summary.name +
        //                     " (Assistant: " +
        //                     $(".dashboard-header h2").first().html() +
        //                     ")"
        //             )
        //     }
        //     //console.log("ShowcaseInfo: Original Title", document.title)
        //     document.title =
        //         summary.name +
        //         document.title.substr(document.title.indexOf("|") - 1)
        //     var exampleText = ""
        //     var exampleList = $("<span></span>")
        //     //console.log("ShowcaseInfo: New Title", document.title)
        //     if (typeof summary.examples != "undefined") {
        //         exampleText = $(
        //             '<div id="exampleList" class="panel-body html"> <strong>' +
        //                 _("View").t() +
        //                 "</strong><br /></div>"
        //         )
        //         //exampleText = '<div id="searchList" style="float: right; border: solid lightgray 1px; padding: 5px;"><a name="searchListAnchor" />'
        //         //exampleText += summary.examples.length > 1 ? '<h2 style="padding-top: 0;">Searches:</h2>' : '<h2 style="padding-top: 0;">Search:</h2>';
        //         //exampleList = $('<ul class="example-list"></ul>');

        //         summary.examples.forEach(function (example) {
        //             var showcaseURLDefault = summary.dashboard
        //             if (summary.dashboard.indexOf("?") > 0) {
        //                 showcaseURLDefault = summary.dashboard.substr(
        //                     0,
        //                     summary.dashboard.indexOf("?")
        //                 )
        //             }

        //             var url =
        //                 showcaseURLDefault +
        //                 "?ml_toolkit.dataset=" +
        //                 example.name
        //             let label = example.label
        //             if (
        //                 translatedLabels[label] &&
        //                 translatedLabels[label] != undefined &&
        //                 translatedLabels[label] != ""
        //             ) {
        //                 label = translatedLabels[label]
        //             }
        //             if (example.name == sampleSearch.label) {
        //                 exampleText.append(
        //                     $("<button></button>")
        //                         .attr("data-label", label)
        //                         .addClass("selectedButton")
        //                         .text(label)
        //                 )
        //             } else {
        //                 exampleText.append(
        //                     $("<button></button>")
        //                         .attr("data-label", label)
        //                         .text(label)
        //                         .click(function () {
        //                             window.location.href = url
        //                         })
        //                 )
        //             }
        //         })
        //         //exampleText += "<ul>" + exampleList.html() + "</ul></div>"
        //         exampleText.find("button").first().addClass("first")
        //         exampleText.find("button").last().addClass("last")
        //         //("Got my Example Text...", exampleText)
        //         if (summary.examples.length > 1) {
        //             var content =
        //                 "<span>" +
        //                 _("Demo Data").t() +
        //                 "</span> You're looking at the <i>" +
        //                 sampleSearch.label.replace(/^.*\- /, "") +
        //                 "</i> search right now. Did you know that we have " +
        //                 summary.examples.length +
        //                 " searches for this example? <a style=\"color: white; font-weight: bold; text-decoration: underline\" href=\"#\" onclick=\"var jElement = $('#exampleList'); $('html, body').animate({ scrollTop: jElement.offset().top-30}); $('body').append('<div class=\\'modal-backdrop  in\\'></div>');  jElement.addClass('searchListHighlight');setTimeout(function(){ $('.modal-backdrop').remove(); jElement.removeClass('searchListHighlight'); },2000);return false;\">Scroll Up</a> to the top to see the other searches."

        //             setTimeout(function () {
        //                 $("#searchLabelMessage").html(content)
        //                 //console.log("Setting the reference content to ", content)
        //             }, 1000)
        //         }
        //     }
        //     if (
        //         typeof summary.hideSearches != "undefined" &&
        //         summary.hideSearches == true
        //     ) {
        //         showSPLText = "" // Hide the search accordian
        //         $("#fieldset1").hide() // hide  the search bar
        //         $("#row11").hide() // Prereq
        //         for (var i = 2; i <= 10; i++) {
        //             //all of the dashboard panel
        //             $("#row" + i).hide()
        //         }
        //     }

        //     let name = summary.name
        //     window.setbookmark_status = function (
        //         name,
        //         showcaseId,
        //         status,
        //         action
        //     ) {
        //         if (!action) {
        //             action =
        //                 splunkjs.mvc.Components.getInstance("env").toJSON()[
        //                     "page"
        //                 ]
        //         }

        //         require([
        //             "components/data/sendTelemetry",
        //             "json!" +
        //                 $C["SPLUNKD_PATH"] +
        //                 "/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/sse_app_config",
        //         ], function (Telemetry, appConfig) {
        //             let record = {
        //                 status: status,
        //                 name: name,
        //                 selectionType: action,
        //             }
        //             for (let i = 0; i < appConfig.length; i++) {
        //                 if (
        //                     appConfig[i].param == "demoMode" &&
        //                     appConfig[i].value == "true"
        //                 ) {
        //                     record.demoMode = true
        //                 }
        //             }
        //             Telemetry.SendTelemetryToSplunk("BookmarkChange", record)
        //         })

        //         require([
        //             "splunkjs/mvc/utils",
        //             "splunkjs/mvc/searchmanager",
        //         ], function (utils, SearchManager) {
        //             const id = `logBookmarkChange-${name.replace(
        //                 /[^a-zA-Z0-9]/g,
        //                 "_"
        //             )}-${searchManId++}`
        //             new SearchManager(
        //                 {
        //                     id,
        //                     latest_time: "0",
        //                     autostart: true,
        //                     earliest_time: "now",
        //                     search:
        //                         '| makeresults | eval app="' +
        //                         utils.getCurrentApp() +
        //                         '", page="' +
        //                         splunkjs.mvc.Components.getInstance(
        //                             "env"
        //                         ).toJSON()["page"] +
        //                         '", user="' +
        //                         $C["USERNAME"] +
        //                         '", name="' +
        //                         name +
        //                         '", status="' +
        //                         status +
        //                         '" | collect index=_internal sourcetype=essentials:bookmark',
        //                     app: utils.getCurrentApp(),
        //                     auto_cancel: 90,
        //                 },
        //                 { tokens: false }
        //             )
        //         })
        //         var record = {
        //             _time: new Date().getTime() / 1000,
        //             _key: showcaseId,
        //             showcase_name: name,
        //             status: status,
        //             notes: summary.bookmark_notes,
        //             user: Splunk.util.getConfigValue("USERNAME"),
        //         }

        //         $.ajax({
        //             url:
        //                 $C["SPLUNKD_PATH"] +
        //                 '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/bookmark/?query={"_key": "' +
        //                 record["_key"] +
        //                 '"}',
        //             type: "GET",
        //             contentType: "application/json",
        //             async: false,
        //             success: function (returneddata) {
        //                 if (returneddata.length == 0) {
        //                     // New

        //                     $.ajax({
        //                         url:
        //                             $C["SPLUNKD_PATH"] +
        //                             "/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/bookmark/",
        //                         type: "POST",
        //                         headers: {
        //                             "X-Requested-With": "XMLHttpRequest",
        //                             "X-Splunk-Form-Key": window.getFormKey(),
        //                         },
        //                         contentType: "application/json",
        //                         async: false,
        //                         data: JSON.stringify(record),
        //                         success: function (returneddata) {
        //                             bustCache()
        //                             newkey = returneddata
        //                         },
        //                         error: function (xhr, textStatus, error) {},
        //                     })
        //                 } else {
        //                     // Old
        //                     $.ajax({
        //                         url:
        //                             $C["SPLUNKD_PATH"] +
        //                             "/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/bookmark/" +
        //                             record["_key"],
        //                         type: "POST",
        //                         headers: {
        //                             "X-Requested-With": "XMLHttpRequest",
        //                             "X-Splunk-Form-Key": window.getFormKey(),
        //                         },
        //                         contentType: "application/json",
        //                         async: false,
        //                         data: JSON.stringify(record),
        //                         success: function (returneddata) {
        //                             bustCache()
        //                             newkey = returneddata
        //                         },
        //                         error: function (xhr, textStatus, error) {
        //                             //              console.log("Error Updating!", xhr, textStatus, error)
        //                         },
        //                     })
        //                 }
        //             },
        //             error: function (error, data, other) {
        //                 //     console.log("Error Code!", error, data, other)
        //             },
        //         })
        //     }

        //     let summaryUI = this.GenerateShowcaseHTMLBody(summary, ShowcaseInfo)
        //     //let description = summaryUI[0] + summaryUI[1]
        //     if (typeof $(".dashboard-header-description")[0] != "undefined") {
        //         $(".dashboard-header-description")
        //             .parent()
        //             .append($("<br/>" + summaryUI[0]))
        //     } else {
        //         $(".dashboard-header .description").first().html(summaryUI[0])
        //     }
        //     // window.dvtest = summaryUI[1]
        //     // console.log("Looking to add..", $("#fieldset1").length, $("#layout1").length, summaryUI[1] )
        //     if ($("#fieldset1").length > 0) {
        //         $(summaryUI[1]).insertAfter("#fieldset1")
        //     } else if ($("#layout1").length > 0) {
        //         $(summaryUI[1]).insertAfter("#layout1")
        //     } else {
        //         $(".dashboard-body").append(summaryUI[1])
        //     }

        //     $("#cloneToCustomContent")
        //         .css({
        //             cursor: "pointer",
        //             width: "max-content",
        //             padding: "4px 8px 4px 8px",
        //             "background-color": "lightgray",
        //             "border-radius": "6px",
        //             "font-weight": "bold",
        //         })
        //         .click(function () {
        //             localStorage.setItem(
        //                 "sse-summarySelectedToClone",
        //                 JSON.stringify(summary)
        //             )
        //             location.href = "custom_content"
        //         })
        //     //$("#fieldset1").insertAfter($(summaryUI[1]))
        //     //$("#alertVolumetooltip").popover()
        //     $("[data-toggle=tooltip]").tooltip({ html: true })
        //     $("[data-toggle=popover]").popover({
        //         trigger: "hover",
        //         html: true,
        //         placement: "right",
        //     })
        //     if (
        //         showcaseType != "showcase_security_content" &&
        //         showcaseType != "showcase_custom"
        //     ) {
        //         $("#contentDescription").prepend(
        //             '<div id="Tour" style="float: right" class="tour"><a class="external drilldown-link" style="color: white;" href="' +
        //                 window.location.href +
        //                 "&tour=" +
        //                 showcaseName +
        //                 "-tour" +
        //                 '">' +
        //                 _("Learn how to use this page").t() +
        //                 "</a></div>"
        //         )
        //     }
        //     if (exampleText) {
        //         exampleText.insertBefore($("#layout1").first())
        //     }

        //     $("#fullSolution_table th.expands")
        //         .find("a")
        //         .click(function () {
        //             $(".contentstile")
        //                 .find("h3")
        //                 .each(function (a, b) {
        //                     if ($(b).height() > 60) {
        //                         $(b).text(
        //                             $(b)
        //                                 .text()
        //                                 .replace(/^(.{55}).*/, "$1...")
        //                         )
        //                     }
        //                 })
        //         })
        //     if (typeof summary.autoOpen != "undefined") {
        //         $("#" + summary.autoOpen + " th.expands")
        //             .find("a")
        //             .trigger("click")
        //     }
        //     if ($("#gdprtext_table").length > 0) {
        //         $("#gdprtext_table th.expands").find("a").trigger("click")
        //     }
        //     var visualizations = []

        //     if (typeof summary.visualizations != "undefined") {
        //         visualizations = summary.visualizations
        //     }

        //     if (
        //         typeof sampleSearch.visualizations != "undefined" &&
        //         sampleSearch.visualizations.length > 0
        //     ) {
        //         for (var i = 0; i < sampleSearch.visualizations.length; i++) {
        //             if (
        //                 typeof sampleSearch.visualizations[i].panel !=
        //                 "undefined"
        //             ) {
        //                 var shouldAppend = true
        //                 for (var g = 0; g < visualizations.length; g++) {
        //                     if (
        //                         sampleSearch.visualizations[i].panel ==
        //                         visualizations[g].panel
        //                     ) {
        //                         shouldAppend = false
        //                         visualizations[g] =
        //                             sampleSearch.visualizations[i]
        //                     }
        //                 }
        //                 if (shouldAppend) {
        //                     visualizations.push(sampleSearch.visualizations[i])
        //                 }
        //             }
        //         }
        //     }
        //     //      console.log("Visualization Status", visualizations, sampleSearch, summary)
        //     if (visualizations.length > 0) {
        //         var triggerSubtitles = false
        //         for (var i = 0; i < visualizations.length; i++) {
        //             // console.log("Analyzing panle", visualizations[i])
        //             if (
        //                 typeof visualizations[i].panel != "undefined" &&
        //                 typeof visualizations[i].type != "undefined" &&
        //                 (typeof visualizations[i].hideInSearchBuilder ==
        //                     "undefined" ||
        //                     visualizations[i].hideInSearchBuilder == false)
        //             ) {
        //                 if (
        //                     visualizations[i].type == "HTML" &&
        //                     typeof visualizations[i].html != "undefined"
        //                 ) {
        //                     // console.log("Enabling panle", visualizations[i].panel)
        //                     var unsubmittedTokens =
        //                         splunkjs.mvc.Components.getInstance("default")
        //                     var submittedTokens =
        //                         splunkjs.mvc.Components.getInstance("submitted")
        //                     unsubmittedTokens.set(
        //                         visualizations[i].panel,
        //                         "blank"
        //                     )
        //                     submittedTokens.set(unsubmittedTokens.toJSON())

        //                     $("#" + visualizations[i].panel).html(
        //                         visualizations[i].html
        //                     )
        //                 } else if (
        //                     visualizations[i].type == "image" &&
        //                     typeof visualizations[i].path != "undefined"
        //                 ) {
        //                     // console.log("Enabling panle", visualizations[i].panel)
        //                     var unsubmittedTokens =
        //                         splunkjs.mvc.Components.getInstance("default")
        //                     var submittedTokens =
        //                         splunkjs.mvc.Components.getInstance("submitted")
        //                     unsubmittedTokens.set(
        //                         visualizations[i].panel,
        //                         "blank"
        //                     )
        //                     submittedTokens.set(unsubmittedTokens.toJSON())
        //                     var style = ""
        //                     if (typeof visualizations[i].style != "undefined")
        //                         style =
        //                             'style="' + visualizations[i].style + '"'
        //                     var title = ""
        //                     if (typeof visualizations[i].title != "undefined")
        //                         title =
        //                             'title="' + visualizations[i].title + '"'
        //                     // console.log("Her'es my panle title", title)
        //                     $("#" + visualizations[i].panel).html(
        //                         '<img class="screenshot" ' +
        //                             style +
        //                             ' src="' +
        //                             visualizations[i].path +
        //                             '" ' +
        //                             title +
        //                             " />"
        //                     )
        //                     triggerSubtitles = true
        //                 } else if (visualizations[i].type == "viz") {
        //                     // console.log("Enabling panle", visualizations[i].panel)
        //                     var unsubmittedTokens =
        //                         splunkjs.mvc.Components.getInstance("default")
        //                     var submittedTokens =
        //                         splunkjs.mvc.Components.getInstance("submitted")
        //                     unsubmittedTokens.set(
        //                         visualizations[i].panel,
        //                         "blank"
        //                     )
        //                     submittedTokens.set(unsubmittedTokens.toJSON())
        //                     $("#" + visualizations[i].panel).html(
        //                         '<div id="element' +
        //                             visualizations[i].panel +
        //                             '" />'
        //                     )
        //                     //Get time range from the timepicker and apply to all panels
        //                     let baseTimerange =
        //                         splunkjs.mvc.Components.getInstance(
        //                             "searchBarControl"
        //                         ).timerange.val()
        //                     var SMConfig = {
        //                         status_buckets: 0,
        //                         cancelOnUnload: true,
        //                         sample_ratio: null,
        //                         app: "Splunk_Security_Essentials",
        //                         auto_cancel: 90,
        //                         preview: true,
        //                         tokenDependencies: {},
        //                         runWhenTimeIsUndefined: false,
        //                         earliest_time: baseTimerange.earliest_time,
        //                         latest_time: baseTimerange.latest_time,
        //                     }
        //                     SMConfig.id = "search" + visualizations[i].panel
        //                     if (
        //                         typeof visualizations[i].basesearch ==
        //                         "undefined"
        //                     ) {
        //                         //              console.log("No Base Search Detected", visualizations[i])
        //                         SMConfig.search = visualizations[i].search
        //                     } else {
        //                         //              console.log("Woo! Base Search Detected", visualizations[i])
        //                         if (visualizations[i].search.match(/^\s*\|/)) {
        //                             SMConfig.search =
        //                                 visualizations[i].basesearch +
        //                                 " " +
        //                                 visualizations[i].search
        //                         } else {
        //                             SMConfig.search =
        //                                 visualizations[i].basesearch +
        //                                 "| " +
        //                                 visualizations[i].search
        //                         }
        //                     }

        //                     /*new SearchManager({
        //                         "id": "search8",
        //                         "latest_time": "now",
        //                         "status_buckets": 0,
        //                         "cancelOnUnload": true,
        //                         "earliest_time": "-24h@h",
        //                         "sample_ratio": null,
        //                         "search": "| makeresults count=15 | streamstats count",
        //                         "app": utils.getCurrentApp(),
        //                         "auto_cancel": 90,
        //                         "preview": true,
        //                         "tokenDependencies": {
        //                         },
        //                         "runWhenTimeIsUndefined": false
        //                     }, {tokens: true, tokenNamespace: "submitted"});*/
        //                     var VizConfig = visualizations[i].vizParameters
        //                     VizConfig.id = "element" + visualizations[i].panel
        //                     VizConfig.managerid =
        //                         "search" + visualizations[i].panel
        //                     VizConfig.el = $(
        //                         "#element" + visualizations[i].panel
        //                     )

        //                     // console.log("Got our panle SM Config", SMConfig)
        //                     // console.log("Got our panle Viz Config", VizConfig)
        //                     /*{
        //                         "id": "element2",
        //                         "charting.drilldown": "none",
        //                         "resizable": true,
        //                         "charting.chart": "area",
        //                         "managerid": "search2",
        //                         "el": $('#element2')
        //                     }*/
        //                     var SM = new SearchManager(SMConfig, {
        //                         tokens: true,
        //                         tokenNamespace: "submitted",
        //                     })
        //                     // console.log("Got our panle SM", SM)
        //                     var Viz
        //                     if (visualizations[i].vizType == "ChartElement") {
        //                         Viz = new ChartElement(VizConfig, {
        //                             tokens: true,
        //                             tokenNamespace: "submitted",
        //                         }).render()
        //                     } else if (
        //                         visualizations[i].vizType == "SingleElement"
        //                     ) {
        //                         Viz = new SingleElement(VizConfig, {
        //                             tokens: true,
        //                             tokenNamespace: "submitted",
        //                         }).render()
        //                     } else if (
        //                         visualizations[i].vizType == "MapElement"
        //                     ) {
        //                         Viz = new MapElement(VizConfig, {
        //                             tokens: true,
        //                             tokenNamespace: "submitted",
        //                         }).render()
        //                     } else if (
        //                         visualizations[i].vizType == "TableElement"
        //                     ) {
        //                         Viz = new TableElement(VizConfig, {
        //                             tokens: true,
        //                             tokenNamespace: "submitted",
        //                         }).render()
        //                     }
        //                     // console.log("Got our panle Viz", Viz)

        //                     SM.on("search:done", function (properties) {
        //                         //console.log("search complete", properties.content.label)
        //                         var panelName =
        //                             properties.content.label.replace(
        //                                 /search/,
        //                                 ""
        //                             )

        //                         // Instantiate the results link view if it does not already exist. Sometimes this event is striggered more than once
        //                         if (
        //                             typeof splunkjs.mvc.Components.getInstance(
        //                                 "search" + panelName + "-resultsLink"
        //                             ) == "undefined"
        //                         ) {
        //                             var resultsLink = new ResultsLinkView({
        //                                 id:
        //                                     "search" +
        //                                     panelName +
        //                                     "-resultsLink",
        //                                 managerid: "search" + panelName, //,
        //                                 //el: $("#row1cell1").find(".panel-body")
        //                             })

        //                             // Display the results link view
        //                             resultsLink
        //                                 .render()
        //                                 .$el.appendTo(
        //                                     $("#" + panelName).find(
        //                                         ".panel-body"
        //                                     )
        //                                 )
        //                             $(
        //                                 "#search" + panelName + "-resultsLink"
        //                             ).addClass("resultLink")
        //                         }
        //                     })
        //                 }
        //                 if (
        //                     typeof visualizations[i].title != "undefined" &&
        //                     visualizations[i].title != ""
        //                 ) {
        //                     $("#element" + visualizations[i].panel)
        //                         .parent()
        //                         .prepend(
        //                             '<h2 class="panel-title">' +
        //                                 visualizations[i].title +
        //                                 "</h2>"
        //                         )
        //                 }
        //             }
        //         }
        //         if (triggerSubtitles) {
        //             DoImageSubtitles()
        //         }

        //         //Add trigger so the panels time range is also changed when you change the dropdown
        //         // mytimerange.on("change", function() {
        //         //     mysearch.settings.set(mytimerange.val());
        //         // });

        //         let searchBarControlVal =
        //             splunkjs.mvc.Components.getInstance("searchBarControl")

        //         if (searchBarControlVal) {
        //             searchBarControlVal.timerange.on("change", function () {
        //                 for (var i = 0; i < visualizations.length; i++) {
        //                     if (
        //                         typeof splunkjs.mvc.Components.getInstance(
        //                             "search" + visualizations[i].panel
        //                         ) != "undefined"
        //                     ) {
        //                         let baseTimerange = this.val()
        //                         splunkjs.mvc.Components.getInstance(
        //                             "search" + visualizations[i].panel
        //                         ).search.set(baseTimerange)
        //                     }
        //                 }
        //             })
        //         }
        //     }

        //     $("#enableAdvancedSPL").click(function (event) {
        //         if (event.target.checked == true) {
        //             localStorage["sse-splMode"] = "true"
        //             $(".mlts-panel-footer").show()
        //             $(
        //                 "#outliersPanel .mlts-panel-footer :not(.mlts-show-spl)"
        //             ).show()
        //             $("#fieldset1").show()
        //             $("#row11").show()
        //         } else {
        //             localStorage["sse-splMode"] = "false"
        //             $(".mlts-panel-footer").hide()
        //             $("#outliersPanel .mlts-panel-footer").show()
        //             $(
        //                 "#outliersPanel .mlts-panel-footer :not(.mlts-show-spl)"
        //             ).hide()
        //             $("#fieldset1").hide()
        //             $("#row11").hide()
        //         }
        //     })
        //     if (
        //         typeof localStorage["sse-splMode"] != "undefined" &&
        //         localStorage["sse-splMode"] == "false"
        //     ) {
        //         // console.log("SPL Mode is off, hiding everything")
        //         $(".mlts-panel-footer").hide()
        //         $("#outliersPanel .mlts-panel-footer").show()
        //         $(
        //             "#outliersPanel .mlts-panel-footer :not(.mlts-show-spl)"
        //         ).hide()
        //         $("#fieldset1").hide()
        //         $("#row11").hide()
        //     } else {
        //         $(".mlts-panel-footer").show()
        //         $(
        //             "#outliersPanel .mlts-panel-footer :not(.mlts-show-spl)"
        //         ).show()
        //         $("#fieldset1").show()
        //         $("#row11").show()
        //     }
        //     $(".dashboard-header").css("margin-bottom", "0")

        //     document.querySelectorAll("pre code").forEach((block) => {
        //         hljs.highlightBlock(block)
        //     })
        //     //$("<a href=\"" + window.location.href + "&tour=" + showcaseName + "-tour\"><div id=\"Tour\" class=\"tourbtn\" style=\"float: right; margin-right: 15px; margin-top: 5px; \">Launch Tour</div></a>").insertAfter("#searchList")
        // },
        GenerateShowcaseHTMLBodyAsync:
            async function GenerateShowcaseHTMLBodyAsync(
                summary,
                ShowcaseInfo,
                textonly
            ) {
                let markdown = new showdown.converter()
                setTimeout(function () {
                    require([
                        "json!" +
                        $C["SPLUNKD_PATH"] +
                        "/services/pullJSON?config=mitreattack&locale=" +
                        window.localeString,
                    ], function (mitre_attack) {
                        // pre-loading these
                    })
                }, 1000)

                let translatedLabels = {}
                try {
                    if (
                        localStorage[
                        "Splunk_Security_Essentials-i18n-labels-" +
                        window.localeString
                        ] != undefined
                    ) {
                        translatedLabels = JSON.parse(
                            localStorage[
                            "Splunk_Security_Essentials-i18n-labels-" +
                            window.localeString
                            ]
                        )
                    }
                } catch (error) {}

                if (!textonly || textonly == false) {
                    window.summary = summary
                }
                //var Template = "<div class=\"detailSectionContainer expands\" style=\"display: block; border: black solid 1px; padding-top: 0; \"><h2 style=\"background-color: #F0F0F0; line-height: 1.5em; font-size: 1.2em; margin-top: 0; margin-bottom: 0;\"><a href=\"#\" class=\"dropdowntext\" style=\"color: black;\" onclick='$(\"#SHORTNAMESection\").toggle(); if($(\"#SHORTNAME_arrow\").attr(\"class\")==\"icon-chevron-right\"){$(\"#SHORTNAME_arrow\").attr(\"class\",\"icon-chevron-down\")}else{$(\"#SHORTNAME_arrow\").attr(\"class\",\"icon-chevron-right\")} return false;'>&nbsp;&nbsp;<i id=\"SHORTNAME_arrow\" class=\"icon-chevron-right\"></i> TITLE</a></h2><div style=\"display: none; padding: 8px;\" id=\"SHORTNAMESection\">"
                var Template =
                    '<table id="' +
                    summary.id +
                    'SHORTNAME_table" class="dvexpand table table-chrome"><thead><tr><th class="expands"><h2 style="line-height: 1.5em; font-size: 1.2em; margin-top: 0; margin-bottom: 0;"><a href="#" class="dropdowntext" style="color: black;" onclick=\'$("#' +
                    summary.id +
                    'SHORTNAMESection").toggle(); if($("#SHORTNAME_arrow").attr("class")=="icon-chevron-right"){$("#' +
                    summary.id +
                    'SHORTNAME_arrow").attr("class","icon-chevron-down"); $("#' +
                    summary.id +
                    'SHORTNAME_table").addClass("expanded"); $("#' +
                    summary.id +
                    'SHORTNAME_table").removeClass("table-chrome");  $("#' +
                    summary.id +
                    'SHORTNAME_table").find("th").css("border-top","1px solid darkgray");  }else{$("#' +
                    summary.id +
                    'SHORTNAME_arrow").attr("class","icon-chevron-right");  $("#' +
                    summary.id +
                    'SHORTNAME_table").removeClass("expanded");  $("#' +
                    summary.id +
                    'SHORTNAME_table").addClass("table-chrome"); } return false;\'>&nbsp;&nbsp;<i id="' +
                    summary.id +
                    'SHORTNAME_arrow" class="icon-chevron-right"></i> TITLE</a></h2></th></tr></thead><tbody><tr><td class="summaryui-detailed-data" style="display: none; border-top-width: 0;" id="' +
                    summary.id +
                    'SHORTNAMESection">'
                var Template_OpenByDefault =
                    '<table id="' +
                    summary.id +
                    'SHORTNAME_table" class="dvexpand expanded table table-chrome"><thead><tr><th class="expands"><h2 style="line-height: 1.5em; font-size: 1.2em; margin-top: 0; margin-bottom: 0;"><a href="#" class="dropdowntext" style="color: black;" onclick=\'$("#' +
                    summary.id +
                    'SHORTNAMESection").toggle(); if($("#SHORTNAME_arrow").attr("class")=="icon-chevron-right"){$("#' +
                    summary.id +
                    'SHORTNAME_arrow").attr("class","icon-chevron-down"); $("#' +
                    summary.id +
                    'SHORTNAME_table").addClass("expanded"); $("#' +
                    summary.id +
                    'SHORTNAME_table").removeClass("table-chrome");  $("#' +
                    summary.id +
                    'SHORTNAME_table").find("th").css("border-top","1px solid darkgray");  }else{$("#' +
                    summary.id +
                    'SHORTNAME_arrow").attr("class","icon-chevron-right");  $("#' +
                    summary.id +
                    'SHORTNAME_table").removeClass("expanded");  $("#' +
                    summary.id +
                    'SHORTNAME_table").addClass("table-chrome"); } return false;\'>&nbsp;&nbsp;<i id="' +
                    summary.id +
                    'SHORTNAME_arrow" class="icon-chevron-down"></i> TITLE</a></h2></th></tr></thead><tbody><tr><td class="summaryui-detailed-data" style="display: block; border-top-width: 0;" id="' +
                    summary.id +
                    'SHORTNAMESection">'

                var areaText = ""
                if (typeof summary.category != "undefined") {
                    let categories = summary.category.split("|").sort()
                    //Add External link to certain categories
                    for (var c = 0; c < categories.length; c++) {
                        if (categories[c] == "Zero Trust") {
                            let externallink =
                                "https://www.splunk.com/en_us/form/zero-trust-security-model-in-government.html"
                            let externallinkDescription =
                                "Read more about Splunk and Zero Trust here"
                            categories[c] =
                                '<a class="external drilldown-link" data-toggle="tooltip" title="' +
                                externallinkDescription +
                                '" target="_blank" href="' +
                                externallink +
                                '"> ' +
                                categories[c] +
                                "</a>"
                        }
                    }
                    areaText =
                        "<p><h2>" +
                        _("Category").t() +
                        "</h2>" +
                        categories.join(", ") +
                        "</p>"
                }

                var usecaseText = ""
                if (typeof summary.category != "undefined") {
                    usecaseText =
                        "<p><h2>" +
                        _("Use Case").t() +
                        "</h2>" +
                        summary.usecase.split("|").join(", ") +
                        "</p>"
                }

                // var showSPLButton = '<div id="showSPLMenu" />' // Line-by-Line SPL Documentation Button
                // What follows is Advanced SPL Option
                var checkedtext = ""
                //Always have SPL mode unless - JB
                if (
                    typeof localStorage["sse-splMode"] == "undefined" ||
                    localStorage["sse-splMode"] == "true"
                )
                    checkedtext = " checked"

                // $("#DemoModeSwitch").html('<div class="tooltipcontainer  filterItem" style="margin-right: 45px;"><label class="filterswitch floatright" style="margin-left: 8px;">' /* + tooltipText*/ + '<input type="checkbox" id="FILTER_DEMOMODE" name="FILTER_DEMOMODE" ' + demoModeInputSetting + '><span class="filterslider "></span></label><div class="filterLine">Demo Mode <a href=\"#\" data-placement=\"bottom\" onclick=\"return false;\" class=\"icon-info\" title=\"SPL is hidden by default and <br />demo searches show up first.\"> </a></div></div> ')
                var showAdvancedMode =
                    '<div style="width: 300px; margin-top: 15px;" class="tooltipcontainer filterItem"><label class="filterswitch"><input type="checkbox" id="enableAdvancedSPL" ' +
                    checkedtext +
                    '><span class="filterslider "></span></label><div style="display: inline;" class="filterLine">Enable SPL Mode</div></div><div>Turning this on will show searches, along with the buttons that will allow saving searches. This will be saved in your browser, and be the default for any other content you view, but won\'t impact other users.</div> '

                if (
                    (!textonly || textonly == false) &&
                    typeof summary.hideSPLMode != "undefined" &&
                    summary.hideSPLMode == true
                ) {
                    showAdvancedMode = ""
                    $("#fieldset1").hide() // Search Bar
                    $("#row11").hide() // Prereq
                }

                var showSPLText = ""
                if (
                    (!textonly || textonly == false) &&
                    summary.hasSearch == "Yes" &&
                    [
                        "showcase_first_seen_demo",
                        "showcase_simple_search",
                        "showcase_standard_deviation",
                    ].indexOf(
                        splunkjs.mvc.Components.getInstance("env").toJSON()[
                        "page"
                        ]
                    ) >= 0
                ) {
                    showSPLText = Template.replace(
                        /SHORTNAME/g,
                        "showSPL"
                    ).replace("TITLE", "SPL Mode")
                    showSPLText += showAdvancedMode + "</td></tr></table>"
                }

                var knownFPText = ""
                if (
                    typeof summary.knownFP != "undefined" &&
                    summary.knownFP != ""
                ) {
                    knownFPText =
                        Template.replace(/SHORTNAME/g, "knownFP").replace(
                            "TITLE",
                            _("Known False Positives").t()
                        ) +
                        markdown.makeHtml(summary.knownFP) +
                        "</td></tr></table>" // "<h2>Known False Positives</h2><p>" + summary.knownFP + "</p>"
                }
                // console.log("Checking How to Implement", summary.howToImplement)
                var howToImplementText = ""
                if (
                    typeof summary.howToImplement != "undefined" &&
                    summary.howToImplement != ""
                ) {
                    howToImplementText =
                        Template.replace(
                            /SHORTNAME/g,
                            "howToImplement"
                        ).replace("TITLE", _("How to Implement").t()) +
                        markdown.makeHtml(summary.howToImplement) +
                        "</td></tr></table>" // "<h2>How to Implement</h2><p>" + summary.howToImplemement + "</p>"
                }

                var eli5Text = ""
                if (typeof summary.eli5 != "undefined" && summary.eli5 != "") {
                    eli5Text =
                        Template.replace(/SHORTNAME/g, "eli5").replace(
                            "TITLE",
                            _("Detailed Search Explanation").t()
                        ) +
                        markdown.makeHtml(summary.eli5) +
                        "</td></tr></table>" // "<h2>Detailed Search Explanation</h2><p>" + summary.eli5 + "</p>"
                }

                var searchStringText = ""
                if (
                    typeof summary.search != "undefined" &&
                    summary.search != "" &&
                    ["showcase_security_content"].indexOf(
                        splunkjs.mvc.Components.getInstance("env").toJSON()[
                        "page"
                        ]
                    ) == -1
                ) {
                    let searchjq = $("<pre>")
                        .attr("class", "search")
                        .append($('<code class="spl">').text(summary.search))
                    // searchStringText = Template.replace(/SHORTNAME/g, "searchString").replace("TITLE", _("Search").t()) + searchjq[0].outerHTML + "</td></tr></table>"
                    let button =
                        '<a class="btn external drilldown-link" target="_blank" style="background-color: #76BD64; margin-bottom: 10px; color: white;" href="search?q=' +
                        encodeURIComponent(summary.search) +
                        '">' +
                        _("Open in Search").t() +
                        "</a>"
                    if (
                        summary["open_search_panel"] &&
                        summary["open_search_panel"] == false
                    ) {
                        searchStringText =
                            Template.replace(
                                /SHORTNAME/g,
                                "searchString"
                            ).replace("TITLE", _("Search").t()) +
                            searchjq[0].outerHTML +
                            button +
                            "</td></tr></table>"
                    } else {
                        searchStringText =
                            Template_OpenByDefault.replace(
                                /SHORTNAME/g,
                                "searchString"
                            ).replace("TITLE", _("Search").t()) +
                            searchjq[0].outerHTML +
                            button +
                            "</td></tr></table>"
                    }
                }

                var analyticStoryText = ""
                if (
                    typeof summary.analytic_stories != "undefined" &&
                    Object.keys(summary.analytic_stories).length > 0
                ) {
                    //Create the html for analytic_story here
                    for (const analytic_story_id in summary.analytic_stories) {
                        let analytic_story_container = ""
                        let analytic_story =
                            summary.analytic_stories[analytic_story_id]
                        if (analytic_story["detections"].length != 0) {
                            analytic_story_container +=
                                "<p>This story is made up of the following detections: </p>"
                            analytic_story_container += "<ul>"
                            for (
                                let j = 0;
                                j < analytic_story["detections"].length;
                                j++
                            ) {
                                if (
                                    analytic_story["detections"][j].name ==
                                    null ||
                                    analytic_story["detections"][j].name ==
                                    undefined
                                ) {
                                    continue
                                }

                                analytic_story_container +=
                                    "<li class='analytic_story_detection' title='" +
                                    analytic_story["detections"][j].name +
                                    "'><a href='showcase_security_content?showcaseId=" +
                                    analytic_story["detections"][j].id +
                                    "' class='analytic_story_detection_link external drilldown-link' target='_blank' title='" +
                                    analytic_story["detections"][j].name +
                                    "'>" +
                                    analytic_story["detections"][j].name +
                                    "</a></li>"
                            }
                            analytic_story_container += "</ul>"
                        }
                        analyticStoryText +=
                            Template.replace(
                                /SHORTNAME/g,
                                "__" + analytic_story_id
                            ).replace(
                                "TITLE",
                                _(
                                    'Other Detections in Analytic Story "' +
                                    analytic_story["name"] +
                                    '"'
                                ).t()
                            ) +
                            analytic_story_container +
                            "</td></tr></table>"
                    }
                }

                var baselinesText = ""
                if (
                    typeof summary.baselines != "undefined" &&
                    summary.baselines.length > 0
                ) {
                    //Create the html for analytic_story here
                    let baselines_container = ""
                    if (summary.baselines.length > 1) {
                        baselines_container +=
                            "<h3>This detection relies on the following searches to generate the baseline lookup.</h3>"
                    } else {
                        baselines_container +=
                            "<h3>This detection relies on the following search to generate the baseline lookup.</h3>"
                    }
                    baselines_container += "<ul>"
                    for (b = 0; b < summary.baselines.length; b++) {
                        let baseline = summary.baselines[b]
                        baselines_container +=
                            "<li class='baselines_detection' title='" +
                            baseline.name +
                            "'><a href='search?q=" +
                            encodeURIComponent(baseline.search) +
                            "' class='baseline_detection_link external drilldown-link' target='_blank' title='" +
                            baseline.name +
                            "'>" +
                            baseline.name +
                            "</a></li>"
                    }
                    baselines_container += "</ul>"
                    baselinesText +=
                        Template.replace(/SHORTNAME/g, "__baselines").replace(
                            "TITLE",
                            _("Baseline Generation Searches").t()
                        ) +
                        baselines_container +
                        "</td></tr></table>"
                }

                var SPLEaseText = ""
                if (
                    typeof summary.SPLEase != "undefined" &&
                    summary.SPLEase != "" &&
                    summary.SPLEase != "None"
                ) {
                    SPLEaseText =
                        "<h2>" +
                        _("SPL Difficulty").t() +
                        "</h2><p>" +
                        summary.SPLEase +
                        "</p>"
                }

                var operationalizeText = ""
                if (
                    typeof summary.operationalize != "undefined" &&
                    summary.operationalize != ""
                ) {
                    operationalizeText =
                        Template.replace(
                            /SHORTNAME/g,
                            "operationalize"
                        ).replace("TITLE", _("How To Respond").t()) +
                        markdown.makeHtml(summary.operationalize) +
                        "</td></tr></table>" // "<h2>Handle Alerts</h2><p>" + summary.operationalize + "</p>"
                }

                var gdprText = ""
                if (
                    typeof summary.gdprtext != "undefined" &&
                    summary.gdprtext != ""
                ) {
                    gdprText =
                        Template.replace(/SHORTNAME/g, "gdprtext").replace(
                            "TITLE",
                            _("GDPR Relevance").t()
                        ) +
                        markdown.makeHtml(summary.gdprtext) +
                        "</td></tr></table>" // "<h2>Handle Alerts</h2><p>" + summary.operationalize + "</p>"
                }

                var relevance = ""
                if (
                    typeof summary.relevance != "undefined" &&
                    summary.relevance != ""
                ) {
                    relevance =
                        "<h2>" +
                        _("Security Impact").t() +
                        "</h2><p>" +
                        markdown.makeHtml(summary.relevance) +
                        "</p>" // "<h2>Handle Alerts</h2><p>" + summary.operationalize + "</p>"
                }

                let appsToExcludePartnerDisclaimer = [
                    "Splunk_Security_Essentials",
                    "Splunk_App_for_Enterprise_Security",
                    "Enterprise_Security_Content_Update",
                    "Splunk_SOAR",
                    "Splunk_User_Behavior_Analytics",
                    "Custom",
                ]
                let companyTextBanner = ""
                let companyTextDescription = ""
                let companyTextSectionLabel = ""
                if (
                    summary.company_name ||
                    summary.company_logo ||
                    summary.company_description ||
                    summary.company_link
                ) {
                    // company_logo company_logo_width company_logo_height company_description company_link
                    companyTextBanner =
                        "<h2>" + _("Content Producer").t() + "</h2>"
                    if (summary.company_name) {
                        if (!summary.company_logo) {
                            companyTextBanner +=
                                "<p>" +
                                Splunk.util.sprintf(
                                    _("Content supplied by %s").t(),
                                    _(summary.company_name).t()
                                ) +
                                "</p>"
                        }
                        companyTextSectionLabel =
                            "About " + _(summary.company_name).t()
                    } else {
                        companyTextSectionLabel = "About Content Producer" //<p><h2>Full Splunk Capabilities</h2></p>"
                    }
                    companyTextDescription = Template.replace(
                        /SHORTNAME/g,
                        "companyDescription"
                    ).replace("TITLE", companyTextSectionLabel) //<p><h2>Full Splunk Capabilities</h2></p>"
                    if (summary.company_logo) {
                        let style = ""
                        let max_width = 350
                        let actual_width = ""
                        let max_height = 100
                        let actual_height = ""
                        if (summary.company_logo_width) {
                            summary.company_logo_width = parseInt(
                                summary.company_logo_width
                            )
                            if (summary.company_logo_width > max_width) {
                                actual_width = max_width
                            } else {
                                actual_width = summary.company_logo_width
                            }
                            try {
                                style = "width: " + actual_width + "px; "
                            } catch (error) {
                                style = ""
                            }
                        }
                        if (summary.company_logo_height) {
                            summary.company_logo_height = parseInt(
                                summary.company_logo_height
                            )
                            if (actual_width != "") {
                                actual_height =
                                    summary.company_logo_height *
                                    (actual_width / summary.company_logo_width)
                                if (actual_height > max_height) {
                                    actual_height = max_height
                                    actual_width =
                                        summary.company_logo_width *
                                        (actual_height /
                                            summary.company_logo_height)
                                    style = "width: " + actual_width + "px; "
                                }
                            } else if (
                                summary.company_logo_height > max_height
                            ) {
                                actual_height = max_height
                            } else {
                                actual_height = summary.company_logo_height
                            }
                            try {
                                style += "height: " + actual_height + "px; "
                            } catch (error) {
                                style = ""
                            }
                        }
                        if (style == "") {
                            style = "max-width: 350px;"
                        }
                        const companyLogo = cleanLink(
                            summary.company_logo,
                            false
                        ) // false: relative link ok
                        const companyLink = cleanLink(summary.company_link)
                        if (companyLink) {
                            companyTextDescription +=
                                '<a target="_blank" href="' +
                                companyLink +
                                '"><img style="margin: 5px; ' +
                                style +
                                '" src="' +
                                companyLogo +
                                '" /></a>'
                            companyTextBanner +=
                                '<a target="_blank" href="' +
                                companyLink +
                                '"><img style="margin: 5px; ' +
                                style +
                                '" src="' +
                                companyLogo +
                                '" /></a>'
                        } else {
                            companyTextDescription +=
                                '<img style="margin: 5px; ' +
                                style +
                                '" src="' +
                                companyLogo +
                                '" />'
                            companyTextBanner +=
                                '<img style="margin: 5px; ' +
                                style +
                                '" src="' +
                                companyLogo +
                                '" />'
                        }
                    }
                    if (summary.company_description) {
                        companyTextDescription +=
                            "<p>" +
                            markdown.makeHtml(
                                _(summary.company_description)
                                    .t()
                                    .replace(/\\n/g, "<br/>")
                            ) +
                            "</p>"
                    }
                    if (summary.company_link) {
                        companyTextDescription +=
                            '<a class="btn external drilldown-link" target="_blank" style="background-color: #3498db; margin-bottom: 10px; color: white;" href="' +
                            cleanLink(summary.company_link) +
                            '">' +
                            _("Learn More...").t() +
                            "</a>"
                    }

                    companyTextDescription += "</td></tr></table>"
                } else if (
                    typeof summary.channel != "undefined" &&
                    appsToExcludePartnerDisclaimer.indexOf(summary.channel) ==
                    -1
                ) {
                    companyTextDescription =
                        Template.replace(
                            /SHORTNAME/g,
                            "companyDescription"
                        ).replace("TITLE", "About Content Provider") +
                        Splunk.util.sprintf(
                            _(
                                "This content provider didn't provide any information about their organization. The content provided is %s."
                            ).t(),
                            summary.channel
                        ) +
                        "</td></tr></table>"
                }

                let additionalContextText = ""
                if (
                    typeof summary["additional_context"] == "object" &&
                    summary["additional_context"].length
                ) {
                    // Written to support optional context objects provided by partners
                    for (
                        let i = 0;
                        i < summary["additional_context"].length;
                        i++
                    ) {
                        let obj = summary["additional_context"][i]
                        let title = "Additional Context"

                        if (obj.title) {
                            title = obj.title
                        }
                        let localHTML = Template.replace(
                            /SHORTNAME/g,
                            "additional_context_" + i
                        ).replace("TITLE", title)
                        if (obj["open_panel"]) {
                            localHTML = Template_OpenByDefault.replace(
                                /SHORTNAME/g,
                                "additional_context_" + i
                            ).replace("TITLE", title)
                        }
                        if (obj.detail) {
                            localHTML +=
                                "<p>" +
                                markdown.makeHtml(
                                    _(obj.detail).t().replace(/\\n/g, "<br/>")
                                ) +
                                "</p>"
                        }

                        //Splunk.util.sprintf(_("This content is made available by a third-party (“Third-Party Content”) and is subject to the provisions governing Third-Party Content set forth in the Splunk Software License Agreement. Splunk neither controls nor endorses, nor is Splunk responsible for, any Third-Party Content, including the accuracy, integrity, quality, legality, usefulness or safety of Third-Party Content. Use of such Third-Party Content is at the user’s own risk and may be subject to additional terms, conditions and policies applicable to such Third-Party Content (such as license terms, terms of service or privacy policies of the provider of such Third-Party Content). <br/><br/>For information on the provider of this Third-Party Content, please review the \"%s\" section below.").t(), companyTextSectionLabel)
                        if (obj.search) {
                            let label = "Search"
                            if (obj.search_label) {
                                label = obj.search_label
                            }
                            localHTML += "<h3>" + label + "</h3>"
                            let lang = "spl"

                            if (obj.search_lang) {
                                lang = obj.search_lang
                            }
                            localHTML += $("<div>")
                                .append(
                                    $("<pre>")
                                        .attr("class", "search")
                                        .append(
                                            $("<code>")
                                                .attr("class", lang)
                                                .text(obj.search)
                                        )
                                )
                                .html()
                            if (lang == "spl") {
                                localHTML +=
                                    '<a class="btn external drilldown-link" target="_blank" style="background-color: #76BD64; margin-bottom: 10px; color: white;" href="search?q=' +
                                    encodeURIComponent(obj.search) +
                                    '">' +
                                    _("Open in Search").t() +
                                    "</a>"
                            }
                        }
                        if (obj.link) {
                            localHTML +=
                                '<a class="btn external drilldown-link" target="_blank" style="background-color: #3498db; margin-bottom: 10px; color: white;" href="' +
                                cleanLink(obj.link) +
                                '">' +
                                _("Learn More...").t() +
                                "</a>"
                        }
                        localHTML += "</td></tr></table>"
                        additionalContextText += localHTML
                    }
                }

                let partnerText = ""

                if (
                    typeof summary.channel != "undefined" &&
                    appsToExcludePartnerDisclaimer.indexOf(summary.channel) ==
                    -1
                ) {
                    partnerText =
                        Template.replace(/SHORTNAME/g, "externalText").replace(
                            "TITLE",
                            _("External Content").t()
                        ) +
                        Splunk.util.sprintf(
                            _(
                                'This content is made available by a third-party (“Third-Party Content”) and is subject to the provisions governing Third-Party Content set forth in the Splunk Software License Agreement. Splunk neither controls nor endorses, nor is Splunk responsible for, any Third-Party Content, including the accuracy, integrity, quality, legality, usefulness or safety of Third-Party Content. Use of such Third-Party Content is at the user’s own risk and may be subject to additional terms, conditions and policies applicable to such Third-Party Content (such as license terms, terms of service or privacy policies of the provider of such Third-Party Content). <br/><br/>For information on the provider of this Third-Party Content, please review the "%s" section below.'
                            ).t(),
                            companyTextSectionLabel
                        ) +
                        "</td></tr></table>"
                }

                var descriptionText =
                    "<div class='descriptionBlock'><h2>" +
                    _("Description").t() +
                    "</h2>" // "<h2>Handle Alerts</h2><p>" + summary.operationalize + "</p>"
                var alertVolumeText = "<h2>" + _("Alert Volume").t() + "</h2>"

                if (
                    summary.alertvolume == "Very Low" ||
                    summary.description.match(
                        /<b>\s*Alert Volume:*\s*<\/b>:*\s*Very Low/
                    )
                ) {
                    alertVolumeText +=
                        '<span class="dvPopover popoverlink" id="alertVolumetooltip" title="Alert Volume: Very Low" data-placement="right" data-toggle="popover" data-trigger="hover" data-bs-content="' +
                        _(
                            "An alert volume of Very Low indicates that a typical environment will rarely see alerts from this search, maybe after a brief period of tuning. This search should trigger infrequently enough that you could send it directly to the SOC as an alert, although you should also send it into a data-analysis based threat detection solution, such as Splunk UBA (or as a starting point, Splunk ES's Risk Framework)"
                        ).t() +
                        '">' +
                        _("Very Low").t() +
                        "</span>"
                    descriptionText += markdown.makeHtml(
                        summary.description.replace(
                            /<b>\s*Alert Volume:*\s*<\/b>:*\s*Very Low/,
                            ""
                        )
                    )
                } else if (
                    summary.alertvolume == "Low" ||
                    summary.description.match(
                        /<b>\s*Alert Volume:*\s*<\/b>:*\s*Low/
                    )
                ) {
                    alertVolumeText +=
                        '<span class="dvPopover popoverlink" id="alertVolumetooltip" title="Alert Volume: Low" data-placement="right" data-toggle="popover" data-trigger="hover" data-bs-content="' +
                        _(
                            "An alert volume of Low indicates that a typical environment will occasionally see alerts from this search -- probably 0-1 alerts per week, maybe after a brief period of tuning. This search should trigger infrequently enough that you could send it directly to the SOC as an alert if you decide it is relevant to your risk profile, although you should also send it into a data-analysis based threat detection solution, such as Splunk UBA (or as a starting point, Splunk ES's Risk Framework)"
                        ).t() +
                        '">' +
                        _("Low").t() +
                        "</span>"
                    descriptionText += markdown.makeHtml(
                        summary.description.replace(
                            /<b>\s*Alert Volume:*\s*<\/b>:*\s*Low/,
                            ""
                        )
                    )
                } else if (
                    summary.alertvolume == "Medium" ||
                    summary.description.match(
                        /<b>\s*Alert Volume:*\s*<\/b>:*\s*Medium/
                    )
                ) {
                    alertVolumeText +=
                        '<span class="dvPopover popoverlink" id="alertVolumetooltip" title="Alert Volume: Medium" data-placement="right" data-toggle="popover" data-trigger="hover" data-bs-content="' +
                        _(
                            "An alert volume of Medium indicates that you're likely to see one to two alerts per day in a typical organization, though this can vary substantially from one organization to another. It is recommended that you feed these to an anomaly aggregation technology, such as Splunk UBA (or as a starting point, Splunk ES's Risk Framework)"
                        ).t() +
                        '">' +
                        _("Medium").t() +
                        "</span>"
                    descriptionText += markdown.makeHtml(
                        summary.description.replace(
                            /<b>\s*Alert Volume:*\s*<\/b>:*\s*Medium/,
                            ""
                        )
                    )
                } else if (
                    summary.alertvolume == "High" ||
                    summary.description.match(
                        /<b>\s*Alert Volume:*\s*<\/b>:*\s*High/
                    )
                ) {
                    alertVolumeText +=
                        '<span class="dvPopover popoverlink" id="alertVolumetooltip" title="Alert Volume: High" data-placement="right" data-toggle="popover" data-trigger="hover" data-bs-content="' +
                        _(
                            "An alert volume of High indicates that you're likely to see several alerts per day in a typical organization, though this can vary substantially from one organization to another. It is highly recommended that you feed these to an anomaly aggregation technology, such as Splunk UBA (or as a starting point, Splunk ES's Risk Framework)"
                        ).t() +
                        '">' +
                        _("High").t() +
                        "</span>"
                    descriptionText += markdown.makeHtml(
                        summary.description.replace(
                            /<b>\s*Alert Volume:*\s*<\/b>:*\s*High/,
                            ""
                        )
                    )
                } else if (
                    summary.alertvolume == "Very High" ||
                    summary.description.match(
                        /<b>\s*Alert Volume:*\s*<\/b>:*\s*Very High/
                    )
                ) {
                    alertVolumeText +=
                        '<span class="dvPopover popoverlink" id="alertVolumetooltip" title="Alert Volume: Very High" data-placement="right" data-toggle="popover" data-trigger="hover" data-bs-content="' +
                        _(
                            "An alert volume of Very High indicates that you're likely to see many alerts per day in a typical organization. You need a well thought out high volume indicator search to get value from this alert volume. Splunk ES's Risk Framework is a starting point, but is probably insufficient given how common these events are. It is highly recommended that you either build correlation searches based on the output of this search, or leverage Splunk UBA with it's threat models to surface the high risk indicators."
                        ).t() +
                        '">' +
                        _("Very High").t() +
                        "</span>"
                    descriptionText += markdown.makeHtml(
                        summary.description.replace(
                            /<b>\s*Alert Volume:*\s*<\/b>:*\s*Very High/,
                            ""
                        )
                    )
                } else {
                    //alertVolumeText += summary.description.replace(/(<b>\s*Alert Volume:.*?)<\/p>.*/, '$1 <a class="dvPopover" id="alertVolumetooltip" href="#" title="Alert Volume" data-placement="right" data-toggle="popover" data-trigger="hover" data-bs-content="' + _("The alert volume indicates how often a typical organization can expect this search to fire. On the Very Low / Low side, alerts should be rare enough to even send these events directly to the SIEM for review. Oh the High / Very High side, your SOC would be buried under the volume, and you must send the events only to an anomaly aggregation and threat detection solution, such as Splunk UBA (or for a partial solution, Splunk ES\'s risk framework). To that end, *all* alerts, regardless of alert volume, should be sent to that anomaly aggregation and threat detection solution. More data, more indicators, should make these capabilites stronger, and make your organization more secure.").t() + '">(?)</a>')
                    alertVolumeText = ""
                    descriptionText +=
                        markdown.makeHtml(
                            summary.description.replace(
                                /(<b>\s*Alert Volume:.*?)(?:<\/p>)/,
                                ""
                            )
                        ) + "</div>"
                }
                descriptionText += "</div>"
                //Security Content specific fields
                //For Security Content showcase template we display these alongside the other descriptions at the top. I.e. Skip the accordion.
                var security_content_fields = {}
                security_content_fields["analytic_stories"] =
                    "<h2>" + _("Analytic Story").t() + "</h2>"
                security_content_fields["how_to_implement"] =
                    "<h2>" + _("How to Implement").t() + "</h2>"
                security_content_fields["known_false_positives"] =
                    "<h2>" + _("Known False Positives").t() + "</h2>"
                security_content_fields["role_based_alerting"] =
                    "<h2>" + _("Risk Based Alerting").t() + "</h2>"
                security_content_fields["references"] =
                    "<h2>" + _("References").t() + "</h2>"
                security_content_fields["asset_type"] =
                    "<h2>" + _("Asset Type").t() + "</h2>"
                security_content_fields["dataset"] =
                    "<h2>" + _("Sample Data").t() + "</h2>"
                security_content_fields["version"] = _("Version").t() + ": "
                security_content_fields["date"] = _("Updated").t() + ": "
                for (let field in security_content_fields) {
                    if (
                        typeof summary[field] != "undefined" &&
                        summary[field] != "" &&
                        summary[field] != "None" &&
                        summary[field] != "undefined"
                    ) {
                        //security_content_fields[field]+= markdown.makeHtml(summary[field])
                        if (field == "dataset" || field == "references") {
                            for (var x = 0; x < summary[field].length; x++) {
                                security_content_fields[field] +=
                                    "<a class='referenceLink external drilldown-link' target='_blank' href='" +
                                    summary[field][x] +
                                    "'>" +
                                    summary[field][x] +
                                    "</a>"
                                if (x < summary[field].length - 1) {
                                    security_content_fields[field] += "<br />"
                                }
                            }
                        } else if (field == "analytic_stories") {
                            if (Object.keys(summary[field]).length > 0) {
                                let analytic_story_links = []
                                for (const analytic_story_id in summary[
                                    field
                                ]) {
                                    let analytic_story =
                                        summary[field][analytic_story_id]
                                    let content =
                                        "<h3>Description</h3><p>" +
                                        analytic_story.description
                                            .replace(/'/g, "")
                                            .replace(/\n/g, "<br>") +
                                        "</p>" +
                                        "<h3>Narrative</h3><p>" +
                                        analytic_story.narrative
                                            .replace(/'/g, "")
                                            .replace(/\n/g, "<br>")
                                            .replace(/\\/g, "") +
                                        "</p>"
                                    analytic_story_links.push(
                                        "<span class='whatsthis analytic_story' data-toggle='popover' data-trigger='hover' data-placement='right' data-placement='right' data-html='true' title='" +
                                        analytic_story.name +
                                        "' data-bs-content='" +
                                        content +
                                        "'>" +
                                        analytic_story.name +
                                        "</span>"
                                    )
                                }
                                security_content_fields[field] +=
                                    analytic_story_links.join(", ")
                            }
                        } else {
                            if (
                                typeof summary[field] == "string" &&
                                summary[field].length > 50
                            ) {
                                security_content_fields[field] += markdown
                                    .makeHtml(summary[field].toString())
                                    .replace(/\\\n/g, "<br>")
                                    .replace(/\n/g, "<br>")
                            } else {
                                security_content_fields[field] += summary[field]
                            }
                        }
                    } else if (field == "role_based_alerting") {
                        var rbaText = ""
                        if (
                            typeof summary.risk_object_type != "undefined" &&
                            summary.risk_object_type != ""
                        ) {
                            rbaText +=
                                "<div><h3>Risk objects</h3><span>" +
                                summary.risk_object_type.split("|").join(", ") +
                                "</span></div>"
                        }
                        if (
                            typeof summary.threat_object_type != "undefined" &&
                            summary.threat_object_type != ""
                        ) {
                            rbaText +=
                                "<div><h3>Threat objects</h3><span>" +
                                summary.threat_object_type
                                    .split("|")
                                    .join(", ") +
                                "</span></div>"
                        }
                        if (
                            typeof summary.risk_score != "undefined" &&
                            summary.risk_score != ""
                        ) {
                            rbaText +=
                                "<div><h3>Risk score</h3><span>" +
                                summary.risk_score +
                                "</span></div>"
                        }
                        if (
                            typeof summary.risk_message != "undefined" &&
                            summary.risk_message != ""
                        ) {
                            rbaText +=
                                "<div><h3>Risk message</h3><span>" +
                                markdown.makeHtml(summary.risk_message) +
                                "</span></div>"
                        }
                        if (typeof rbaText != "undefined" && rbaText != "") {
                            security_content_fields[field] += rbaText
                        } else {
                            security_content_fields[field] = ""
                        }
                    } else {
                        security_content_fields[field] = ""
                    }
                }
                descriptionText += "<div class='columnWrapper'>"
                descriptionText +=
                    "<div id='contentMappingBlock_" + summary.id + "'>"
                descriptionText += await generateContentMappingBlockAsync(
                    summary
                )
                descriptionText += "</div>"
                descriptionText += "<div class='releaseInformationBlock'>"
                if (security_content_fields["version"] != "") {
                    descriptionText += security_content_fields["version"]
                    if (security_content_fields["date"] != "") {
                        descriptionText += ", "
                        descriptionText += security_content_fields["date"]
                    }
                }
                descriptionText += "</div>"
                descriptionText += "</div>"

                var cloneToCustomContent =
                    "<div id='cloneToCustomContent' class='clone-custom-content' style='visibility:hidden;'>Clone This Content Into Custom Content</div>"

                //alertVolumeText += "</div></div>"

                //relevance = summary.relevance ? "<p><h2>Security Impact</h2>" +  + "</p>" : ""

                per_instance_help = ""
                if (
                    typeof summary.help != "undefined" &&
                    summary.help &&
                    summary.help != "" &&
                    summary.help != undefined &&
                    summary.help != null &&
                    summary.help != "undefined" &&
                    summary.help.indexOf("Help not needed") != 0 &&
                    ["showcase_security_content"].indexOf(
                        splunkjs.mvc.Components.getInstance("env").toJSON()[
                        "page"
                        ]
                    ) == -1
                ) {
                    // console.log("Got help for summary", summary.id, summary)
                    per_instance_help = Template.replace(
                        /SHORTNAME/g,
                        "help"
                    ).replace("TITLE", "Help")
                    if (
                        $("h3:contains(How Does This Detection Work)").length >
                        0
                    ) {
                        per_instance_help += $(
                            "h3:contains(How Does This Detection Work)"
                        )
                            .parent()
                            .html()
                    }
                    per_instance_help +=
                        "<p><h3>" +
                        summary.name +
                        " Help</h3></p>" +
                        markdown.makeHtml(summary.help)
                    per_instance_help += "</td></tr></table>"
                }
                panelStart =
                    '<div id="rowDescription" class="dashboard-row dashboard-rowDescription splunk-view">        <div id="panelDescription" class="dashboard-cell last-visible splunk-view" style="width: 100%;">            <div class="dashboard-panel clearfix" style="min-height: 0px;"><h2 class="panel-title empty"></h2><div id="view_description" class="fieldset splunk-view editable hide-label hidden empty"></div>                                <div class="panel-element-row">                    <div id="elementdescription" class="dashboard-element html splunk-view" style="width: 100%;">                        <div class="panel-body html"> <div class="contentDescription" data-showcaseid="' +
                    summary.id +
                    '" id="contentDescription"> '
                panelEnd =
                    "</div></div>                    </div>                </div>            </div>        </div>    </div>"

                //console.log("Here's my summary!", summary)

                var relatedUseCasesText = ""
                if (
                    (!textonly || textonly == false) &&
                    typeof summary.relatedUseCases != "undefined" &&
                    summary.relatedUseCases.length > 0
                ) {
                    relatedUseCasesText =
                        "<h2>" + _("Related Use Cases").t() + "</h2>"
                    var tiles = $('<ul class="showcase-list"></ul>')
                    for (var i = 0; i < summary.relatedUseCases.length; i++) {
                        if (
                            typeof ShowcaseInfo["summaries"][
                            summary.relatedUseCases[i]
                            ] != "undefined"
                        )
                            tiles.append(
                                $(
                                    '<li style="width: 230px; height: 320px"></li>'
                                ).append(
                                    BuildTile.build_tile(
                                        ShowcaseInfo["summaries"][
                                        summary.relatedUseCases[i]
                                        ],
                                        true
                                    )
                                )
                            )
                    }
                    relatedUseCasesText +=
                        '<ul class="showcase-list">' + tiles.html() + "</ul>"
                }

                let soarPlaybookText = ""
                if (
                    (!textonly || textonly == false) &&
                    typeof summary.soarPlaybooks != "undefined" &&
                    summary.soarPlaybooks.length > 0
                ) {
                    soarPlaybookText =
                        "<h2>" + _("SOAR Playbooks").t() + "</h2>"
                    var tiles = $('<ul class="showcase-list"></ul>')
                    for (var i = 0; i < summary.soarPlaybooks.length; i++) {
                        if (
                            typeof ShowcaseInfo["summaries"][
                            summary.soarPlaybooks[i]
                            ] != "undefined"
                        )
                            tiles.append(
                                $(
                                    '<li style="width: 230px; height: 320px"></li>'
                                ).append(
                                    BuildTile.build_tile(
                                        ShowcaseInfo["summaries"][
                                        summary.soarPlaybooks[i]
                                        ],
                                        true
                                    )
                                )
                            )
                    }
                    soarPlaybookText +=
                        '<ul class="showcase-list">' + tiles.html() + "</ul>"
                }

                var similarUseCasesText = ""
                if (
                    (!textonly || textonly == false) &&
                    typeof summary.similarUseCases != "undefined" &&
                    summary.similarUseCases.length > 0
                ) {
                    similarUseCasesText =
                        "<h2>" +
                        _("Similar Use Cases").t() +
                        "</h2><p>Sometimes Splunk will solve the same problem in multiple ways, based on greater requirements. What we can do with a simple example for one data source at Stage 1 of the Journey, we can do across all datasets at Stage 2, and with more impact at Stage 4. Here are other versions of the same underlying technique.</p>"
                    var tiles = $('<ul class="showcase-list"></ul>')
                    for (var i = 0; i < summary.similarUseCases.length; i++) {
                        if (
                            typeof ShowcaseInfo["summaries"][
                            summary.similarUseCases[i]
                            ] != "undefined"
                        )
                            tiles.append(
                                $(
                                    '<li style="width: 230px; height: 320px"></li>'
                                ).append(
                                    BuildTile.build_tile(
                                        ShowcaseInfo["summaries"][
                                        summary.similarUseCases[i]
                                        ],
                                        true
                                    )
                                )
                            )
                    }
                    similarUseCasesText +=
                        '<ul class="showcase-list">' + tiles.html() + "</ul>"
                    //  console.log("Here's my similar use cases..", similarUseCasesText)
                }

                var fullSolutionText = ""
                // if (typeof summary.fullSolution != "undefined") {
                //     fullSolutionText += "<br/><h2>" + _("Relevant Splunk Premium Solution Capabilities").t() + "</h2><button class=\"btn\" onclick=\"triggerModal(window.fullSolutionText); return false;\">Find more Splunk content for this Use Case</button>"

                // }

                var otherSplunkCapabilitiesText = ""
                if (
                    relatedUseCasesText != "" ||
                    similarUseCasesText != "" ||
                    fullSolutionText != ""
                ) {
                    otherSplunkCapabilitiesText = Template.replace(
                        /SHORTNAME/g,
                        "fullSolution"
                    ).replace("TITLE", "Related Splunk Capabilities") //<p><h2>Full Splunk Capabilities</h2></p>"
                    otherSplunkCapabilitiesText += similarUseCasesText
                    otherSplunkCapabilitiesText += relatedUseCasesText
                    // otherSplunkCapabilitiesText += soarPlaybookText
                    otherSplunkCapabilitiesText += fullSolutionText
                    otherSplunkCapabilitiesText += "</td></tr></table>"
                }
                var SOARText = ""
                if (soarPlaybookText != "") {
                    SOARText = Template.replace(
                        /SHORTNAME/g,
                        "soarPlaybookContent"
                    ).replace("TITLE", "Recommended SOAR Playbooks") //<p><h2>Full Splunk Capabilities</h2></p>"
                    SOARText += soarPlaybookText
                    SOARText += "</td></tr></table>"
                }

                var supportingImagesText = ""
                if (
                    typeof summary.images == "object" &&
                    typeof summary.images.length == "number" &&
                    summary.images.length > 0
                ) {
                    supportingImagesText =
                        '<table id="SHORTNAME_table" class="dvexpand table table-chrome"><thead><tr><th class="expands"><h2 style="line-height: 1.5em; font-size: 1.2em; margin-top: 0; margin-bottom: 0;"><a href="#" class="dropdowntext" style="color: black;" onclick=\'$("#SHORTNAMESection").toggle(); if($("#SHORTNAME_arrow").attr("class")=="icon-chevron-right"){$("#SHORTNAME_arrow").attr("class","icon-chevron-down"); $("#SHORTNAME_table").addClass("expanded"); $("#SHORTNAME_table").removeClass("table-chrome");  $("#SHORTNAME_table").find("th").css("border-top","1px solid darkgray");  }else{$("#SHORTNAME_arrow").attr("class","icon-chevron-right");  $("#SHORTNAME_table").removeClass("expanded");  $("#SHORTNAME_table").addClass("table-chrome"); } ; window.DoImageSubtitles(); return false;\'>&nbsp;&nbsp;<i id="SHORTNAME_arrow" class="icon-chevron-right"></i> TITLE</a></h2></th></tr></thead><tbody><tr><td style="display: none; border-top-width: 0;" id="SHORTNAMESection">'
                    supportingImagesText = supportingImagesText
                        .replace(/SHORTNAME/g, "supportingImages")
                        .replace("TITLE", "Screenshots")
                    var images = ""
                    for (var i = 0; i < summary.images.length; i++) {
                        images +=
                            '<img crossorigin="anonymous" class="screenshot" setwidth="650" zoomin="true" src="' +
                            summary.images[i].path +
                            '" title="' +
                            summary.images[i].label +
                            '" />'
                    }
                    supportingImagesText += images
                    supportingImagesText += "</td></tr></table>"
                }

                var BookmarkStatus =
                    '<h2 class="bookmarkDisplayComponents" style="margin-bottom: 5px;">Bookmark Status</h2><span class="bookmarkDisplayComponents" style="margin-top: 0; margin-bottom: 15px;"><a title="Click to edit" class="showcase_bookmark_status" href="#" onclick="popBookmarkOptions(this); return false;">' +
                    summary.bookmark_status_display +
                    ' <i class="icon-pencil"></i></a></span> '

                if (
                    summary.bookmark_notes &&
                    summary.bookmark_notes != "" &&
                    summary.bookmark_notes != null
                ) {
                    BookmarkStatus +=
                        '<div class="bookmarkDisplayComponents" data-showcaseid="' +
                        summary.id +
                        '" class="bookmarkNotes"><p>' +
                        summary.bookmark_notes +
                        "</p></div>"
                } else {
                    BookmarkStatus +=
                        '<div class="bookmarkDisplayComponents" style="display: none; reallyshow: none;" data-showcaseid="' +
                        summary.id +
                        '" class="bookmarkNotes"><p>' +
                        summary.bookmark_notes +
                        "</p></div>"
                }

                var DataAvailabilityStatus =
                    '<h2 style="margin-bottom: 5px;"><span data-toggle="tooltip" title="' +
                    _(
                        "Data Availability is driven by the Data Inventory dashboard, and allows Splunk Security Essentials to provide recommendations for available content that fits your needs and uses your existing data."
                    ).t() +
                    '">' +
                    _("Data Availability").t() +
                    '</span> <a href="data_inventory" target="_blank" class="external drilldown-link"></a></h2><span style="margin-top: 0; margin-bottom: 15px;"><a href="#" onclick="data_available_modal(this); return false;">' +
                    summary.data_available +
                    "</a></span> "
                var Stage =
                    '<h2 style="margin-bottom: 5px;">Security Data Journey</h2><span style="margin-top: 0; margin-bottom: 15px;"><a target="_blank" class="external link drilldown-icon" href="journey?stage=' +
                    (summary.securityDataJourney?.replace(/Level_/g, "") || summary.journey?.replace(/Stage_/g, "")) +
                    '">Level ' +
                    (summary.securityDataJourney?.replace(/Level_/g, "") 
                    || (summary.journey?.replace(/Stage_/g, "") > 4 ? 2:summary.journey?.replace(/Stage_/g, ""))) +
                    "</a></span> "

                var datasourceText = ""
                if (
                    typeof summary.datasources == "undefined" &&
                    summary.datasource != "undefined" &&
                    summary.datasource != ""
                ) {
                    summary.datasources = summary.datasource
                }
                if (
                    typeof summary.datasources != "undefined" &&
                    summary.datasources != "Other" &&
                    summary.datasources != ""
                ) {
                    datasources = summary.datasources.split("|")
                    if (datasources.length > 0 && datasourceText == "") {
                        datasourceText = "<h2>Data Sources</h2>"
                    }
                    for (var i = 0; i < datasources.length; i++) {
                        var link = datasources[i].replace(/[^\w\- ]/g, "")
                        var description = datasources[i]
                        datasourceText +=
                            '<div class="coredatasource"><a target="_blank" href="data_source?datasource=' +
                            link +
                            '">' +
                            description +
                            "</a></div>"
                    }
                    datasourceText += '<br style="clear: both;"/>'
                }

                var datamodelText = ""
                if (
                    typeof summary.datamodel != "undefined" &&
                    summary.datamodel != "Other" &&
                    summary.datamodel != "" &&
                    summary.datamodel != "None"
                ) {
                    datamodels = summary.datamodel.split("|")
                    if (datamodels.length > 0 && datamodelText == "") {
                        datamodelText = "<h2>Data Model</h2>"
                    }
                    for (var i = 0; i < datamodels.length; i++) {
                        var link =
                            "https://docs.splunk.com/Documentation/CIM/latest/User/" +
                            datamodels[i].split(".")[0]
                        var description = datamodels[i]
                        datamodelText +=
                            '<a class="external link" target="_blank" href="' +
                            link +
                            '">' +
                            description +
                            "</a> "
                    }
                    datamodelText += '<br style="clear: both;"/>'
                }

                var mitreText = ""
                if (
                    typeof summary.mitre_tactic_display != "undefined" &&
                    summary.mitre_tactic_display != ""
                ) {
                    let mitreName = summary.mitre_tactic_display.split("|")
                    let mitreId = summary.mitre_tactic.split("|")
                    if (mitreName.indexOf("None") >= 0) {
                        mitreName = mitreName.splice(
                            mitreName.indexOf("None"),
                            1
                        )
                    }
                    if (mitreName.length > 0 && mitreText == "") {
                        mitreText =
                            '<h2 style="margin-bottom: 5px;">' +
                            _("MITRE ATT&CK Tactics").t() +
                            "  (Click for Detail)</h2>"
                    }
                    let numAdded = 0
                    for (var i = 0; i < mitreName.length; i++) {
                        if (mitreName[i] == "None") {
                            continue
                        }
                        numAdded++
                        let tooltip = mitreId[i] + " - " + mitreName[i]
                        mitreText +=
                            "<div style=\"cursor: pointer\" data-toggle='tooltip' title='" +
                            tooltip +
                            "' onclick=\"showMITREElement('x-mitre-tactic', '" +
                            mitreName[i] +
                            "')\" mitre_tactic='" +
                            mitreId[i] +
                            '\' class="primary mitre_tactic_displayElements">' +
                            mitreName[i] +
                            "</div>"
                    }
                    mitreText += '<br style="clear: both;"/>'
                    if (numAdded == 0) {
                        mitreText = ""
                    }
                }

                var mitreTechniqueText = ""
                let mitreTecniques = {}
                if (
                    typeof summary.mitre_technique_display != "undefined" &&
                    summary.mitre_technique_display != ""
                ) {
                    let mitreName = summary.mitre_technique_display.split("|")
                    let mitreId =
                        summary.mitre_technique.substr(0, 1) === "|"
                            ? summary.mitre_technique
                                .substr(1, summary.mitre_technique.length)
                                .split("|")
                            : summary.mitre_technique.split("|")

                    if (mitreName.indexOf("None") >= 0) {
                        mitreName = mitreName.splice(
                            mitreName.indexOf("None"),
                            1
                        )
                    }
                    if (mitreName.length > 0 && mitreTechniqueText == "") {
                        mitreTechniqueText =
                            '<h2 style="margin-bottom: 5px;">' +
                            _("MITRE ATT&CK Techniques").t() +
                            "  (Click for Detail)</h2>"
                    }
                    let numAdded = 0
                    let mitreTechName =
                        summary.mitre_sub_technique_display.substr(0, 1) === "|"
                            ? summary.mitre_sub_technique_display
                                .substr(
                                    1,
                                    summary.mitre_sub_technique_display.length
                                )
                                .split("|")
                            : summary.mitre_sub_technique_display.split("|")

                    // console.log("mitreName: ", mitreName)
                    // console.log("mitreTechName: ", mitreTechName)
                    for (var i = 0; i < mitreName.length; i++) {
                        if (!mitreTechName.includes(mitreName[i])) {
                            if (mitreName[i] == "None") {
                                continue
                            }
                            numAdded++
                            let tooltip = mitreId[i] + " - " + mitreName[i]
                            mitreTecniques[mitreId[i]] = mitreName[i]
                            mitreTechniqueText +=
                                "<div style=\"cursor: pointer\" data-toggle='tooltip' title='" +
                                tooltip +
                                "' onclick=\"showMITREElement('attack-pattern', '" +
                                mitreName[i] +
                                "')\" mitre_technique='" +
                                mitreId[i] +
                                '\' class="primary mitre_technique_displayElements">' +
                                mitreName[i] +
                                "</div>"
                        }
                    }
                    if (
                        typeof summary.mitre_sub_technique_display ==
                        "undefined" ||
                        summary.mitre_sub_technique_display == ""
                    ) {
                        mitreTechniqueText += '<br style="clear: both;"/>'
                    }
                    if (numAdded == 0) {
                        mitreTechniqueText = ""
                    }
                }
                if (
                    typeof summary.mitre_sub_technique_display != "undefined" &&
                    summary.mitre_sub_technique_display != ""
                ) {
                    let mitreName =
                        summary.mitre_sub_technique_display.split("|")
                    let mitreId =
                        summary.mitre_sub_technique.substr(0, 1) === "|"
                            ? summary.mitre_sub_technique
                                .substr(1, summary.mitre_sub_technique.length)
                                .split("|")
                            : summary.mitre_sub_technique.split("|")
                    if (mitreName.indexOf("None") >= 0) {
                        mitreName = mitreName.splice(
                            mitreName.indexOf("None"),
                            1
                        )
                    }

                    if (mitreName.length > 0 && mitreTechniqueText == "") {
                        mitreTechniqueText =
                            '<h2 style="margin-bottom: 5px;">' +
                            _("MITRE ATT&CK Techniques").t() +
                            "  (Click for Detail)</h2>"
                    }

                    let numAdded = 0
                    for (var i = 0; i < mitreName.length; i++) {
                        if (mitreName[i] == "None") {
                            continue
                        }
                        numAdded++
                        let tooltip = mitreId[i] + " - " + mitreName[i]
                        mitreTechniqueText +=
                            "<div style=\"cursor: pointer\" data-toggle='tooltip' title='" +
                            tooltip +
                            "' onclick=\"showMITREElement('attack-pattern', '" +
                            mitreId[i] +
                            "')\" mitre_sub_technique='" +
                            mitreId[i] +
                            '\' class="primary mitre_technique_displayElements mitre_sub_technique_displayElements">' +
                            mitreName[i] +
                            "</div>"
                    }
                    mitreTechniqueText += '<br style="clear: both;"/>'
                }

                function showGroup(groupName) {
                    // console.log("Got a group!", groupName)

                    require([
                        "underscore",
                        "jquery",
                        "components/controls/Modal",
                        "json!" +
                        $C["SPLUNKD_PATH"] +
                        "/services/pullJSON?config=mitreattack&locale=" +
                        window.localeString,
                    ], function (_, $, Modal, mitre_attack) {
                        let relevantGroups = [groupName]
                        let relevantTechniques = []
                        let group_ref = []
                        let technique_ref = []
                        let group_ref_to_description = {}
                        let refs = {}
                        window.mitre = mitre_attack
                        window.threat_groups = {}
                        $(".mitre_technique_displayElements.primary").each(
                            function (num, obj) {
                                relevantTechniques.push($(obj).text())
                            }
                        )
                        // console.log("Rolling forward with", relevantGroups, relevantTechniques)
                        for (let i = 0; i < mitre_attack.objects.length; i++) {
                            if (
                                mitre_attack.objects[i].type == "attack-pattern"
                            ) {
                                // console.log("Looking for ", mitre_attack.objects[i].name, "in", relevantTechniques, relevantTechniques.indexOf(mitre_attack.objects[i].name))
                            }

                            if (
                                mitre_attack.objects[i].type ==
                                "attack-pattern" &&
                                relevantTechniques.indexOf(
                                    mitre_attack.objects[i].name
                                ) >= 0
                            ) {
                                for (
                                    let g = 0;
                                    g <
                                    mitre_attack.objects[i].external_references
                                        .length;
                                    g++
                                ) {
                                    if (
                                        mitre_attack.objects[i]
                                            .external_references[g]
                                            .external_id &&
                                        mitre_attack.objects[
                                            i
                                        ].external_references[g].url.indexOf(
                                            "attack.mitre.org/"
                                        ) >= 0
                                    ) {
                                        mitre_attack.objects[i].technique_id =
                                            mitre_attack.objects[
                                                i
                                            ].external_references[g].external_id
                                    }
                                }
                                mitre_attack.objects[i].technique_name =
                                    mitre_attack.objects[i].name
                                technique_ref.push(mitre_attack.objects[i].id)
                                refs[mitre_attack.objects[i].id] =
                                    mitre_attack.objects[i]
                            } else if (
                                mitre_attack.objects[i].type ==
                                "intrusion-set" &&
                                relevantGroups.indexOf(
                                    mitre_attack.objects[i].name
                                ) >= 0
                            ) {
                                group_ref.push(mitre_attack.objects[i].id)
                                group_ref_to_description[
                                    mitre_attack.objects[i].id
                                ] = mitre_attack.objects[i].description
                                refs[mitre_attack.objects[i].id] =
                                    mitre_attack.objects[i]
                            }
                        }

                        for (let i = 0; i < mitre_attack.objects.length; i++) {
                            if (
                                mitre_attack.objects[i].type == "relationship"
                            ) {
                                if (
                                    group_ref.indexOf(
                                        mitre_attack.objects[i].source_ref
                                    ) >= 0 &&
                                    technique_ref.indexOf(
                                        mitre_attack.objects[i].target_ref
                                    ) >= 0
                                ) {
                                    if (
                                        !window.threat_groups[
                                        refs[
                                            mitre_attack.objects[i]
                                                .source_ref
                                        ].name
                                        ]
                                    ) {
                                        window.threat_groups[
                                            refs[
                                                mitre_attack.objects[
                                                    i
                                                ].source_ref
                                            ].name
                                        ] = []
                                    }
                                    refs[
                                        mitre_attack.objects[i].target_ref
                                    ].group_description =
                                        group_ref_to_description[
                                        mitre_attack.objects[i].source_ref
                                        ]
                                    let relationshipObj = JSON.parse(
                                        JSON.stringify(
                                            refs[
                                            mitre_attack.objects[i]
                                                .target_ref
                                            ]
                                        )
                                    )
                                    relationshipObj.relationship_notes =
                                        mitre_attack.objects[i]
                                    window.threat_groups[
                                        refs[mitre_attack.objects[i].source_ref]
                                            .name
                                    ].push(relationshipObj)
                                }
                                if (
                                    group_ref.indexOf(
                                        mitre_attack.objects[i].target_ref
                                    ) >= 0 &&
                                    technique_ref.indexOf(
                                        mitre_attack.objects[i].source_ref
                                    ) >= 0
                                ) {
                                    if (
                                        !window.threat_groups[
                                        refs[
                                            mitre_attack.objects[i]
                                                .target_ref
                                        ].name
                                        ]
                                    ) {
                                        window.threat_groups[
                                            refs[
                                                mitre_attack.objects[
                                                    i
                                                ].target_ref
                                            ].name
                                        ] = []
                                    }
                                    refs[
                                        mitre_attack.objects[i].target_ref
                                    ].group_description =
                                        group_ref_to_description[
                                        mitre_attack.objects[i].source_ref
                                        ]
                                    let relationshipObj = JSON.parse(
                                        JSON.stringify(
                                            refs[
                                            mitre_attack.objects[i]
                                                .source_ref
                                            ]
                                        )
                                    )
                                    relationshipObj.relationship_notes =
                                        mitre_attack.objects[i]
                                    window.threat_groups[
                                        refs[mitre_attack.objects[i].target_ref]
                                            .name
                                    ].push(relationshipObj)
                                }
                                refs[mitre_attack.objects[i].id] =
                                    mitre_attack.objects[i]
                            }
                        }

                        function numberToWord(num) {
                            let numbersToWords = [
                                "zero",
                                "one",
                                "two",
                                "three",
                                "four",
                                "five",
                                "six",
                                "seven",
                                "eight",
                                "nine",
                                "ten",
                                "eleven",
                                "twelve",
                                "thirteen",
                                "fourteen",
                                "fifteen",
                                "sixteen",
                                "seventeen",
                                "eighteen",
                                "nineteen",
                                "twenty",
                                "twenty-one",
                                "twenty-two",
                                "twenty-three",
                                "twenty-four",
                                "twenty-five",
                                "twenty-six",
                                "twenty-seven",
                                "twenty-eight",
                                "twenty-nine",
                                "thirty",
                                "thirty-one",
                                "thirty-two",
                                "thirty-three",
                                "thirty-four",
                                "thirty-five",
                                "thirty-six",
                                "thirty-seven",
                                "thirty-eight",
                                "thirty-nine",
                                "forty",
                                "forty-one",
                                "forty-two",
                                "forty-three",
                                "forty-four",
                                "forty-five",
                                "forty-six",
                                "forty-seven",
                                "forty-eight",
                                "forty-nine",
                                "fifty",
                                "fifty-one",
                                "fifty-two",
                                "fifty-three",
                                "fifty-four",
                                "fifty-five",
                                "fifty-six",
                                "fifty-seven",
                                "fifty-eight",
                                "fifty-nine",
                                "sixty",
                                "sixty-one",
                                "sixty-two",
                                "sixty-three",
                                "sixty-four",
                                "sixty-five",
                                "sixty-six",
                                "sixty-seven",
                                "sixty-eight",
                                "sixty-nine",
                                "seventy",
                                "seventy-one",
                                "seventy-two",
                                "seventy-three",
                                "seventy-four",
                                "seventy-five",
                                "seventy-six",
                                "seventy-seven",
                                "seventy-eight",
                                "seventy-nine",
                                "eighty",
                                "eighty-one",
                                "eighty-two",
                                "eighty-three",
                                "eighty-four",
                                "eighty-five",
                                "eighty-six",
                                "eighty-seven",
                                "eighty-eight",
                                "eighty-nine",
                                "ninety",
                                "ninety-one",
                                "ninety-two",
                                "ninety-three",
                                "ninety-four",
                                "ninety-five",
                                "ninety-six",
                                "ninety-seven",
                                "ninety-eight",
                                "ninety-nine",
                                "one hundred",
                            ]
                            let str = numbersToWords[num]
                            str = str.charAt(0).toUpperCase() + str.slice(1)
                            return str
                        }

                        // console.log("In the Modal", groupName)
                        // Now we initialize the Modal itself
                        var myModal = new Modal(
                            "threatGroups",
                            {
                                title: Splunk.util.sprintf(
                                    _("Threat Group: %s").t(),
                                    groupName
                                ),
                                backdrop: "static",
                                keyboard: true,
                                destroyOnHide: true,
                            },
                            $
                        )
                        myModal.$el.addClass("modal-extra-wide")
                        let myBody = $("<div>")
                        if (!window.threat_groups[groupName]) {
                            myBody.html(
                                "<p>Application Error -- " +
                                groupName +
                                " not found.</p>"
                            )
                        } else {
                            if (
                                window.threat_groups[groupName][0][
                                "group_description"
                                ]
                            ) {
                                myBody.append(
                                    "<h4>" + _("Description").t() + "</h4>"
                                )
                                let description
                                try {
                                    description = window.threat_groups[
                                        groupName
                                    ][0]["group_description"].replace(
                                        /\[([^\]]*)\]\(.*?\)/g,
                                        "$1"
                                    )
                                } catch (error) {
                                    description =
                                        window.threat_groups[groupName][0][
                                        "group_description"
                                        ]
                                }
                                myBody.append(
                                    $('<p style="white-space: pre-line">').text(
                                        description
                                    )
                                )
                            }
                            myBody.append("<h4>" + _("Links").t() + "</h4>")

                            // extract the url in the mitre description
                            let regExp = /\(([^)]+)\)/
                            let group_description_url = regExp.exec(
                                window.threat_groups[groupName][0][
                                "group_description"
                                ]
                            )[1]

                            myBody.append(
                                $("<p>").append(
                                    $(
                                        '<a target="_blank" class="external drilldown-icon">'
                                    )
                                        .text(_("MITRE ATT&CK Site").t())
                                        .attr("href", group_description_url)
                                )
                            )

                            myBody.append(
                                $("<p>").append(
                                    $(
                                        '<a target="_blank" class="external drilldown-icon">'
                                    )
                                        .text(
                                            _(
                                                "Splunk Security Essentials Content"
                                            ).t()
                                        )
                                        .attr(
                                            "href",
                                            "contents#mitre_threat_groups=" +
                                            encodeURIComponent(
                                                window.threat_groups[
                                                groupName
                                                ][0]["group_name"]
                                            )
                                        )
                                )
                            )
                            myBody.append(
                                "<h4>" + _("Techniques").t() + "</h4>"
                            )
                            if (window.threat_groups[groupName].length > 1) {
                                myBody.append(
                                    "<p>" +
                                    Splunk.util.sprintf(
                                        _(
                                            "%s techniques used by %s For %s"
                                        ).t(),
                                        numberToWord(
                                            window.threat_groups[groupName]
                                                .length
                                        ),
                                        groupName,
                                        window.summary.name
                                    ) +
                                    "</p>"
                                )
                            } else {
                                myBody.append(
                                    "<p>" +
                                    Splunk.util.sprintf(
                                        _(
                                            "%s technique used by %s For %s"
                                        ).t(),
                                        numberToWord(
                                            window.threat_groups[groupName]
                                                .length
                                        ),
                                        groupName,
                                        window.summary.name
                                    ) +
                                    "</p>"
                                )
                            }

                            for (
                                let i = 0;
                                i < window.threat_groups[groupName].length;
                                i++
                            ) {
                                if (i > 0) {
                                    myBody.append("<hr/>")
                                }
                                myBody.append(
                                    $("<h4>").append(
                                        $(
                                            '<a href="#" click="return false;" style="color: black"><i  class="icon-chevron-right" /> ' +
                                            window.threat_groups[groupName][
                                            i
                                            ]["technique_id"] +
                                            ": " +
                                            window.threat_groups[groupName][
                                            i
                                            ]["technique_name"] +
                                            "</a>"
                                        )
                                            .attr(
                                                "data-id",
                                                window.threat_groups[groupName][
                                                i
                                                ]["technique_id"]
                                            )
                                            .click(function (evt) {
                                                let id = $(evt.target)
                                                    .closest("h4")
                                                    .find("a")
                                                    .attr("data-id")
                                                let descriptionObj = $(
                                                    "#" + id + "_description"
                                                )
                                                let myObj = $(evt.target)
                                                    .closest("h4")
                                                    .find("i")
                                                let currentStatus =
                                                    myObj.attr("class")
                                                if (
                                                    currentStatus ==
                                                    "icon-chevron-down"
                                                ) {
                                                    myObj.attr(
                                                        "class",
                                                        "icon-chevron-right"
                                                    )
                                                    descriptionObj.css(
                                                        "display",
                                                        "none"
                                                    )
                                                } else {
                                                    myObj.attr(
                                                        "class",
                                                        "icon-chevron-down"
                                                    )
                                                    descriptionObj.css(
                                                        "display",
                                                        "block"
                                                    )
                                                }
                                                return false
                                            })
                                    )
                                )

                                let description
                                try {
                                    description = window.threat_groups[
                                        groupName
                                    ][i]["description"].replace(
                                        /\[([^\]]*)\]\(.*?\)/g,
                                        "$1"
                                    )
                                } catch (error) {
                                    description =
                                        window.threat_groups[groupName][i][
                                        "description"
                                        ]
                                }

                                myBody.append(
                                    $(
                                        '<p id="' +
                                        window.threat_groups[groupName][i][
                                        "technique_id"
                                        ] +
                                        '_description" style="display: none; white-space: pre-line">'
                                    ).text(description)
                                )
                                myBody.append(
                                    $("<p>").text(
                                        _("MITRE ATT&CK Summary: ").t() +
                                        window.threat_groups[groupName][i][
                                            "relationship_notes"
                                        ]["description"].replace(
                                            /\[([^\]]*)\]\(.*?\)/g,
                                            "$1"
                                        )
                                    )
                                )
                                if (
                                    window.threat_groups[groupName][i][
                                        "relationship_notes"
                                    ]["external_references"].length > 0
                                ) {
                                    let shouldAppend = false
                                    let myTable = $(
                                        '<table class="table"><thead><tr><th>Source Name</th><th>Description</th><th>Link</th></tr></thead><tbody></tbody></table>'
                                    )
                                    for (
                                        let g = 0;
                                        g <
                                        window.threat_groups[groupName][i][
                                            "relationship_notes"
                                        ]["external_references"].length;
                                        g++
                                    ) {
                                        if (
                                            !window.threat_groups[groupName][i][
                                            "relationship_notes"
                                            ]["external_references"][g][
                                            "description"
                                            ] ||
                                            window.threat_groups[groupName][i][
                                            "relationship_notes"
                                            ]["external_references"][g][
                                            "description"
                                            ] == ""
                                        ) {
                                            continue
                                        }
                                        shouldAppend = true
                                        let description
                                        try {
                                            description = window.threat_groups[
                                                groupName
                                            ][i]["relationship_notes"][
                                                "external_references"
                                            ][g]["description"].replace(
                                                /\[([^\]]*)\]\(.*?\)/g,
                                                "$1"
                                            )
                                        } catch (error) {
                                            description =
                                                window.threat_groups[groupName][
                                                i
                                                ]["relationship_notes"][
                                                "external_references"
                                                ][g]["description"]
                                        }
                                        myTable.find("tbody").append(
                                            $("<tr>").append(
                                                $("<td>").text(
                                                    window.threat_groups[
                                                    groupName
                                                    ][i]["relationship_notes"][
                                                    "external_references"
                                                    ][g]["source_name"]
                                                ),
                                                $(
                                                    '<td style="white-space: pre-line">'
                                                ).text(description), // (window.threat_groups[groupName][i]['external_references'][g]['description']),
                                                $("<td>").html(
                                                    $(
                                                        '<a target="_blank" class="external drilldown-icon"></a>'
                                                    ).attr(
                                                        "href",
                                                        window.threat_groups[
                                                        groupName
                                                        ][i][
                                                        "relationship_notes"
                                                        ][
                                                        "external_references"
                                                        ][g]["url"]
                                                    )
                                                )
                                            )
                                        )
                                    }
                                    if (shouldAppend) {
                                        myBody.append(myTable)
                                    }
                                }
                            }
                        }
                        myModal.body.append(myBody)

                        myModal.footer.append(
                            $("<button>")
                                .attr({
                                    type: "button",
                                    "data-dismiss": "modal",
                                    "data-bs-dismiss": "modal",
                                })
                                .addClass("btn btn-primary")
                                .text(_("Close").t())
                                .on("click", function () {
                                    // Not taking any action here
                                })
                        )
                        myModal.show() // Launch it!
                    })
                }
                window.showGroup = showGroup

                var mitreThreatGroupText = ""

                if (
                    typeof summary.mitre_threat_groups != "undefined" &&
                    summary.mitre_threat_groups != ""
                ) {
                    let mitre = summary.mitre_threat_groups.split("|")
                    if (mitre.indexOf("None") >= 0) {
                        mitre = mitre.splice(mitre.indexOf("None"), 1)
                    }
                    if (mitre.length > 0 && mitreThreatGroupText == "") {
                        mitreThreatGroupText =
                            '<h2 style="margin-bottom: 5px;">' +
                            _("MITRE Threat Groups").t() +
                            " (" +
                            _("Click for Detail").t() +
                            ")</h2>" // + " <a href=\"https://attack.mitre.org/groups/\" class=\"external drilldown-icon\" target=\"_blank\"></a></h2>"
                    }
                    let numAdded = 0
                    for (var i = 0; i < mitre.length; i++) {
                        if (mitre[i] == "None") {
                            continue
                        }
                        numAdded++
                        mitreThreatGroupText +=
                            '<div class="mitre_threat_groupsElements" onclick="showGroup(\'' +
                            mitre[i] +
                            "')\">" +
                            mitre[i] +
                            "</div>"
                    }
                    mitreThreatGroupText += '<br style="clear: both;"/>'
                    if (numAdded == 0) {
                        mitreThreatGroupText = ""
                    }
                }
                // if (typeof summary.mitre_technique_group_json != "undefined" && summary.mitre_technique_group_json != "") {
                //     try{
                //         let groups = JSON.parse(summary.mitre_technique_group_json)
                //         let group_names = Object.keys(groups);
                //         group_names.sort()
                //         window.threat_groups = groups;
                //         if (group_names.length > 0) {
                //             mitreThreatGroupText = "<h2 style=\"margin-bottom: 5px;\">" + _("MITRE Threat Groups").t() + " (Click for Detail)</h2>"
                //         }
                //         for(let i = 0; i < group_names.length; i++){

                //             mitreThreatGroupText += "<div class=\"mitre_threat_groupsElements\" onclick=\"showGroup('" + group_names[i] + "')\">" + group_names[i] + "</div>"
                //         }

                //         mitreThreatGroupText += "<br style=\"clear: both;\"/>"
                //         console.log("Hey! Got groups", groups)
                //     }catch(error){
                //         console.log("Error parsing groups", error)

                //     }
                // }
                // if (typeof summary.mitre_threat_groups != "undefined" && summary.mitre_threat_groups != "") {
                //     let mitre = summary.mitre_threat_groups.split("|")
                //     if (mitre.indexOf("None") >= 0) {
                //         mitre = mitre.splice(mitre.indexOf("None"), 1);
                //     }
                //     if (mitre.length > 0 && mitreThreatGroupText == "") {
                //         mitreThreatGroupText = "<h2 style=\"margin-bottom: 5px;\">" + _("MITRE Threat Groups").t() + " <a href=\"https://attack.mitre.org/groups/\" class=\"external drilldown-icon\" target=\"_blank\"></a></h2>"
                //     }
                //     let numAdded = 0;
                //     for (var i = 0; i < mitre.length; i++) {
                //         if (mitre[i] == "None") {
                //             continue;
                //         }
                //         numAdded++;
                //         mitreThreatGroupText += "<div class=\"mitre_threat_groupsElements\">" + mitre[i] + "</div>"
                //     }
                //     mitreThreatGroupText += "<br style=\"clear: both;\"/>"
                //     if (numAdded == 0) {
                //         mitreThreatGroupText = ""
                //     }
                // }

                var killchainText = ""
                if (
                    typeof summary.killchain != "undefined" &&
                    summary.killchain != ""
                ) {
                    let killchain = summary.killchain
                        ? summary.killchain.split("|")
                        : []
                    if (killchain.length > 0 && killchainText == "") {
                        killchainText =
                            '<h2 style="margin-bottom: 5px;">' +
                            _("Kill Chain Phases").t() +
                            ' <a href="https://www.lockheedmartin.com/us/what-we-do/aerospace-defense/cyber/cyber-kill-chain.html" class="external drilldown-icon" target="_blank"></a></h2>'
                    }
                    let numAdded = 0
                    for (var i = 0; i < killchain.length; i++) {
                        if (killchain[i] == "None") {
                            continue
                        }
                        numAdded++
                        killchainText +=
                            '<div class="killchain">' + killchain[i] + "</div>"
                    }
                    killchainText += '<br style="clear: both;"/>'
                    if (numAdded == 0) {
                        killchainText = ""
                    }
                }

                var cisText = ""
                if (typeof summary.cis != "undefined") {
                    cis = summary.cis.split("|")
                    for (var i = 0; i < cis.length; i++) {
                        cisText += '<div class="cis">' + cis[i] + "</div>"
                    }
                    cisText += "<br/><br/>"
                }

                var technologyText = ""
                if (typeof summary.technology != "undefined") {
                    technology = summary.technology.split("|")
                    for (var i = 0; i < technology.length; i++) {
                        technologyText +=
                            '<div class="technology">' +
                            technology[i] +
                            "</div>"
                    }
                    technologyText += "<br/><br/>"
                }
                var YouTubeText = ""
                if (typeof summary.youtube != "undefined") {
                    YouTubeText = Template.replace(
                        /SHORTNAME/g,
                        "youtube"
                    ).replace("TITLE", "Search Explanation - Video")
                    YouTubeText +=
                        '<div class="auto-resizable-iframe"><div><iframe src="' +
                        summary.youtube +
                        '" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>'
                    YouTubeText += "</div></div><br/><br/></td></tr></table>"
                }

                var box1 =
                    '<div style="overflow: hidden; padding: 10px; margin: 0px; width: 50%; min-width:585px; min-height: 250px; display: table-cell; border: 1px solid darkgray;">' +
                    usecaseText +
                    areaText +
                    relevance +
                    alertVolumeText +
                    SPLEaseText +
                    security_content_fields["analytic_stories"] +
                    security_content_fields["dataset"] +
                    security_content_fields["how_to_implement"] +
                    security_content_fields["known_false_positives"] +
                    security_content_fields["role_based_alerting"] +
                    "</div>"
                var box2 =
                    '<div style="overflow: hidden; padding: 10px; margin: 0px; width: 49%; min-width:305px; min-height: 250px; display: table-cell; border: 1px solid darkgray; border-left: 0">' +
                    BookmarkStatus +
                    DataAvailabilityStatus +
                    Stage +
                    mitreText +
                    mitreTechniqueText +
                    mitreThreatGroupText +
                    killchainText +
                    cisText +
                    technologyText +
                    datasourceText +
                    datamodelText +
                    security_content_fields["asset_type"] +
                    security_content_fields["references"] +
                    "</div>"
                description =
                    panelStart +
                    descriptionText +
                    companyTextBanner +
                    cloneToCustomContent +
                    '<br/><div style=" display: table;">' +
                    box1 +
                    box2 +
                    "</div>" +
                    panelEnd
                var descriptiontwo =
                    panelStart +
                    partnerText +
                    companyTextDescription +
                    gdprText +
                    otherSplunkCapabilitiesText +
                    SOARText +
                    howToImplementText +
                    eli5Text +
                    YouTubeText +
                    knownFPText +
                    operationalizeText +
                    supportingImagesText +
                    showSPLText +
                    per_instance_help +
                    additionalContextText +
                    searchStringText +
                    baselinesText +
                    analyticStoryText +
                    panelEnd
                //description = panelStart + descriptionText + '<br/><div style=" display: table;">' + box1 + box2 + '</div><br/>' + gdprText + otherSplunkCapabilitiesText + SOARText + howToImplementText + eli5Text + YouTubeText + knownFPText + operationalizeText + supportingImagesText + showSPLText + per_instance_help + searchStringText + panelEnd

                // Helper Functions
                function data_available_modal(obj) {
                    require([
                        "jquery",
                        "components/controls/Modal",
                        "json!" +
                        $C["SPLUNKD_PATH"] +
                        "/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/data_inventory_eventtypes",
                        "json!" +
                        $C["SPLUNKD_PATH"] +
                        "/services/pullJSON?config=data_inventory&locale=" +
                        window.localeString,
                    ], function (
                        $,
                        Modal,
                        data_inventory_eventtypes,
                        data_inventory
                    ) {
                        let myModal = new Modal(
                            "data_sources",
                            {
                                title: "Dependent Data Sources",
                                destroyOnHide: true,
                            },
                            $
                        )
                        if (!window.ShowcaseInfo) {
                            $.ajax({
                                url:
                                    $C["SPLUNKD_PATH"] +
                                    "/services/SSEShowcaseInfo?locale=" +
                                    window.localeString,
                                async: false,
                                success: function (returneddata) {
                                    window.ShowcaseInfo = returneddata
                                },
                            })
                        }

                        let body = $("<div>")
                        let container = $(obj).closest(".contentDescription")
                        if (!summary) {
                            let showcaseId = container.attr("data-showcaseid")
                            let summary =
                                window.ShowcaseInfo["summaries"][showcaseId]
                        }
                        let dscs = summary.data_source_categories.split("|")
                        // console.log("blah blah", summary, dscs)

                        body.append(
                            $("<p>").html(
                                _(
                                    'The data availability metric is driven by the configuration on the <a href="data_inventory" target="_blank" class="drilldown-link">Data Inventory</a> dashboard.'
                                ).t()
                            )
                        )

                        if (dscs.length > 1) {
                            body.append(
                                $("<p>").html(
                                    _(
                                        "There are multiple potential data source categories for this example. The aggregate score is taken by averaging all of the following."
                                    ).t()
                                )
                            )
                        }

                        let table = $(
                            '<table class="table"><thead><tr><th>' +
                            _("Data Source Category").t() +
                            "</th><th>" +
                            _("Status").t() +
                            "</th><th>Open</th></tr></thead><tbody></tbody></table>"
                        )

                        for (let i = 0; i < dscs.length; i++) {
                            let status = "?"
                            for (
                                let g = 0;
                                g < data_inventory_eventtypes.length;
                                g++
                            ) {
                                if (
                                    data_inventory_eventtypes[g][
                                    "eventtypeId"
                                    ] == dscs[i]
                                ) {
                                    if (
                                        data_inventory_eventtypes[g][
                                        "coverage_level"
                                        ] &&
                                        data_inventory_eventtypes[g][
                                        "coverage_level"
                                        ] != "" &&
                                        parseInt(
                                            data_inventory_eventtypes[g][
                                            "coverage_level"
                                            ]
                                        ) >= 0
                                    ) {
                                        status =
                                            data_inventory_eventtypes[g][
                                            "coverage_level"
                                            ] + "%"
                                    } else if (
                                        data_inventory_eventtypes[g][
                                        "status"
                                        ] &&
                                        data_inventory_eventtypes[g][
                                        "status"
                                        ] == "failure"
                                    ) {
                                        status = "None"
                                    } else {
                                        status = "Complete"
                                    }
                                }
                            }
                            let name = ""
                            for (let ds in data_inventory) {
                                for (let dsc in data_inventory[ds][
                                    "eventtypes"
                                ]) {
                                    if (dsc == dscs[i]) {
                                        name =
                                            data_inventory[ds]["eventtypes"][
                                            dsc
                                            ]["name"]
                                    }
                                }
                            }
                            table
                                .find("tbody")
                                .append(
                                    $(
                                        "<tr><td>" +
                                        name +
                                        "</td><td>" +
                                        status +
                                        '</td><td><a href="data_inventory#id=' +
                                        dscs[i] +
                                        '" target="_blank" class="external drilldown-link"></a></td></tr>'
                                    )
                                )
                        }
                        body.append(table)

                        myModal.body.html(body)

                        myModal.footer.append(
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
                        myModal.show()
                    })
                }
                window.data_available_modal = data_available_modal

                async function generateContentMappingBlockAsync(summary) {
                    var content_mappings = {}
                    if (typeof summary.search_title != "undefined") {
                        content_mappings = summary.search_title.split("|")
                    }

                    let block = ""
                    block +=
                        // '<h2>Content Mapping<img class="content_mapping_link_image" src="/static/app/Splunk_Security_Essentials/images/general_images/content_mapped.png" /></h2>'
                        '<h2>Content Mapping<img class="content_mapping_link_image" src="' +Splunk.util.make_full_url('/static/app/Splunk_Security_Essentials/images/general_images/content_mapped.png' ) + '"/></h2>'
                    if (
                        content_mappings.length > 0 &&
                        content_mappings[0] != ""
                    ) {
                        if (content_mappings.length > 1) {
                            block +=
                                "<p>This content has been mapped to the local saved searches:"
                        } else {
                            block +=
                                "<p>This content has been mapped to the local saved search:"
                        }
                        block +=
                            " <a class='add_content_mapping_link' data-id='" +
                            summary.id +
                            "' onclick=\"savedSearchSelector('" +
                            summary.id +
                            "'); return false;\">Edit mapping</a>"
                        block += "<ul>"
                        for (var i = 0; i < content_mappings.length; i++) {
                            let localsavedsearchapp =
                                "Splunk_Security_Essentials"
                            let contentMapping = content_mappings[i]
                            let localsavedsearch = await getSavedSearchByName(
                                contentMapping
                            )
                            localsavedsearchapp = localsavedsearch["app"]
                            if (
                                localStorage["isESInstalled"] === "true"
                                // &&
                                // localsavedsearccontentBlockShowcaseId
                            ) {
                                localsavedsearchapp =
                                    "SplunkEnterpriseSecuritySuite"
                                //Content management view with filter
                                var edit_alert_link_base =
                                    "/app/" +
                                    localsavedsearchapp +
                                    "/ess_content_management?textFilter="
                                edit_alert_link_url =
                                    edit_alert_link_base +
                                    encodeURIComponent(localsavedsearch["name"])
                            } else {
                                //Saved search search editor
                                var edit_alert_link_url =
                                    "/manager/" +
                                    localsavedsearchapp +
                                    "/saved/searches/" +
                                    encodeURIComponent(
                                        localsavedsearch["name"]
                                    ) +
                                    "?app=" +
                                    localsavedsearchapp +
                                    "&search=%22" +
                                    encodeURIComponent(
                                        localsavedsearch["name"]
                                    ) +
                                    "%22" +
                                    "&uri=%2FservicesNS%2Fnobody%2F" +
                                    localsavedsearchapp +
                                    "%2Fsaved%2Fsearches%2F" +
                                    encodeURIComponent(
                                        encodeURIComponent(
                                            localsavedsearch["name"]
                                        )
                                    ) +
                                    "&action=edit"
                            }
                            content_mapping_link_url = edit_alert_link_url
                            var content_mapping_id = contentMapping.replace(
                                /[^a-zA-Z0-9]/g,
                                ""
                            )
                            block +=
                                "<li id='mapping_" +
                                content_mapping_id +
                                '\'><a class="external drilldown-link" target="_blank" href="' +
                                content_mapping_link_url +
                                '"> ' +
                                contentMapping +
                                '</a> <span><a class="delete_content_mapping" data-id="'+summary.id+'" onclick=deleteContentMappingRow(\'' +
                                content_mapping_id +
                                "');deleteContentMapping('" +
                                encodeURI(contentMapping) +
                                "','"+summary.id+"');return false;>[Remove]</a><span></li>"
                        }

                        block += "</ul>"
                        block += "</p>"
                        return block
                    } else {
                        block +=
                            "<p>This content is not mapped to any local saved search. <a class='add_content_mapping_link' data-id='" +
                            summary.id +
                            "' onclick=\"savedSearchSelector('" +
                            summary.id +
                            "'); return false;\">Add mapping</a></p>"

                        return block
                    }
                }
                window.generateContentMappingBlockAsync =
                    generateContentMappingBlockAsync

                async function updateContenMappingblockAsync(summary) {
                    $("#contentMappingBlock_" + summary.id).empty()
                    $("#contentMappingBlock_" + summary.id).html(
                        await generateContentMappingBlockAsync(summary)
                    )
                }
                window.updateContenMappingblockAsync =
                    updateContenMappingblockAsync

                function savedSearchSelector(showcaseId) {
                    var contentMappings = []
                    if (typeof summary.search_title != "undefined") {
                        contentMappings = summary.search_title.split("|")
                    }
                    window.showcaseId = showcaseId
                    if (
                        typeof fullShowcaseInfo != "undefined" &&
                        typeof fullShowcaseInfo.summaries[showcaseId] !=
                        "undefined" &&
                        fullShowcaseInfo.summaries[showcaseId] != ""
                    ) {
                        summary = fullShowcaseInfo.summaries[showcaseId]
                    }
                    SavedSearchSelectorModal = window
                        .generateSavedSearchSelectorModal(contentMappings)
                        .then((_) => {
                            $("h3.modal-title").text(
                                'Map "' +
                                summary["name"] +
                                '" to local saved searches'
                            )
                            $("table#contentList").on("update", function () {
                                //$(".action_acceptRecommendation").trigger("click");
                                $(".action_acceptRecommendation").click(
                                    function (evt) {
                                        let content = JSON.parse(
                                            $(evt.target)
                                                .closest("tr")
                                                .attr("data-content")
                                        )
                                        //let showcaseId = $(evt.target).closest("tr").attr("data-prediction")
                                        let search_title = $(evt.target)
                                            .closest("tr")
                                            .attr("data-searchname")
                                        if ($(this).hasClass("selected")) {
                                            //Selected happens before inside the Modal definition, that's why it looks backward
                                            //KVStore change
                                            updateStatus(
                                                search_title,
                                                showcaseId,
                                                "create"
                                            )
                                            //Gui change
                                            addContentMappingRow(
                                                search_title,
                                                showcaseId
                                            )
                                        } else {
                                            //KVStore change
                                            updateStatus(
                                                search_title,
                                                showcaseId,
                                                "delete"
                                            )
                                            //Gui change
                                            deleteContentMappingRow(
                                                search_title
                                            )
                                            deleteContentMapping(
                                                encodeURI(search_title), showcaseId
                                            )
                                        }
                                    }
                                )
                            })
                            $("table#contentList").trigger("update")
                        })
                        .catch((err) => {
                            console.log("Failed to -> ", err)
                        })
                }
                window.savedSearchSelector = savedSearchSelector

                function deleteContentMappingRow(search_title) {
                    var search_title_key = search_title.replace(
                        /[^a-zA-Z0-9]/g,
                        ""
                    )
                    var contentBlockShowcaseId = $(
                        "#mapping_" + search_title_key
                    )
                        .closest("div")
                        .attr("id")
                        .split("contentMappingBlock_")[1]
                    if (
                        typeof fullShowcaseInfo != "undefined" &&
                        typeof fullShowcaseInfo.summaries[
                        contentBlockShowcaseId
                        ] != "undefined" &&
                        fullShowcaseInfo.summaries[contentBlockShowcaseId] != ""
                    ) {
                        summary =
                            fullShowcaseInfo.summaries[contentBlockShowcaseId]
                    }
                    var listlength = $("#mapping_" + search_title_key)
                        .closest("div")
                        .find("li").length
                    //Delete the line in the GUI
                    $("#mapping_" + search_title_key).remove()

                    //Delete entry in the saved summary cache
                    var content_mappings = summary.search_title.split("|")
                    var newMappings = content_mappings.map((value) =>
                        value.replace(/[^a-zA-Z0-9]/g, "")
                    )

                    content_mappings.splice(
                        newMappings.indexOf(search_title_key),
                        1
                    )
                    summary.search_title = content_mappings.join("|")
                    if (typeof fullShowcaseInfo != "undefined") {
                        fullShowcaseInfo.summaries[contentBlockShowcaseId] =
                            summary
                    }
                    if (listlength == 1) {
                        //Need to rerender the block to change text and add link
                        updateContenMappingblockAsync(summary)
                    } else {
                        //Just delete the line and the entry in the summary
                    }
                }

                window.deleteContentMappingRow = deleteContentMappingRow

                function addContentMappingRow(search_title, showcaseId) {
                    if (
                        typeof fullShowcaseInfo != "undefined" &&
                        typeof fullShowcaseInfo.summaries[showcaseId] !=
                        "undefined" &&
                        fullShowcaseInfo.summaries[showcaseId] != ""
                    ) {
                        summary = fullShowcaseInfo.summaries[showcaseId]
                    }
                    var content_mappings = summary.search_title.split("|")
                    if (
                        content_mappings.length == 1 &&
                        content_mappings[0] == ""
                    ) {
                        summary.search_title = search_title
                    } else {
                        summary.search_title += "|" + search_title
                    }
                    updateContenMappingblockAsync(summary)
                }
                window.addContentMappingRow = addContentMappingRow

                window.popBookmarkOptions = function (obj) {
                    let showcaseId = $(obj)
                        .closest(".contentDescription")
                        .attr("data-showcaseid")

                    function getKeyByValue(object, value) {
                        return Object.keys(object).find(
                            (key) => object[key] === value
                        )
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

                    // use this as a way to get an idea of how large to make the dropdown of bookmark items
                    let contentLength = bookmark_names.length * 56 + 30

                    var boxHTML = $(
                        '<div id="box-' +
                        name
                            .replace(/ /g, "_")
                            .replace(/[^a-zA-Z0-9_]/g, "") +
                        '" style="background-color: white; border: 1px gray solid; position: absolute; padding: 7px; left: 190px; top: 0px; width: 210px; height: ' +
                        contentLength +
                        'px;"></div>'
                    ).append(
                        '<i class="icon-close" onclick="$(this).parent().remove()" style="float: right;"></i>',
                        '<h5 style="padding-top: 0px;padding-bottom: 5px; margin-top: 0px;">Change Status</h5>'
                    )
                    boxHTML.append(
                        $(
                            '<p class="bookmarkStatus" id="none" style="cursor: pointer"><span style="display: inline-block; text-align: center; width: 18px;"><img src="' +
                            Splunk.util.make_full_url(
                                "/static/app/Splunk_Security_Essentials/images/general_images/nobookmark.png"
                            ) +
                            '" style="height: 18px" /></span> <a href="#" onclick="return false;">' +
                            _("Clear Bookmark").t() +
                            "</a></p>"
                        )
                    )
                    boxHTML.append(
                        $(
                            '<p class="bookmarkStatus" id="bookmarked" style="cursor: pointer"><span style="display: inline-block; text-align: center; width: 18px;"><i style="font-size: 24px;" class="icon-bookmark"></i></span> <a href="#" onclick="return false;">' +
                            _("Bookmarked (no status)").t() +
                            "</a></p>"
                        )
                    )

                    // iterate through bookmark_names and add each item to boxHTML with the id from reference ID
                    for (let i = 0; i < bookmark_names.length; i++) {
                        boxHTML.append(
                            $(
                                `<p class="bookmarkStatus" id="${bookmark_names[i]["referenceName"]}" style="cursor: pointer"><span style="display: inline-block; text-align: center; width: 18px;"><i style="font-size: 20px;" class="icon-chevron-right"></i></span> <a href="#" onclick="return false;">${bookmark_names[i]["name"]}</a></div>`
                            )
                        )
                    }

                    boxHTML.append(
                        $(
                            '<p class="bookmarkStatus" id="successfullyImplemented" style="cursor: pointer"><span style="display: inline-block; text-align: center; width: 18px;"><i style="font-size: 20px;" class="icon-check-circle"></i></span> <a href="#" onclick="return false;">' +
                            _("Successfully Implemented").t() +
                            "</a>"
                        )
                    )
                    boxHTML.append($("</div>"))

                    // register a click listener
                    $(document).on("click", "p.bookmarkStatus", function () {
                        //console.log("clicked")
                        let id = $(this).attr("id")
                        let text = $(this).find("a").text()
                        // if showcaseid is empty we need to generate it from the name of the detection
                        if (typeof showcaseId == "undefined") {
                            showcaseId = name.split(" ").join("_").toLowerCase()
                        }

                        setbookmark_status(name, showcaseId, id)
                        $(obj).text(text)
                        $(obj).append(' <i class="icon-pencil"/>')
                        setTimeout(function () {
                            $(
                                "#box-" +
                                name
                                    .replace(/ /g, "_")
                                    .replace(/[^a-zA-Z0-9_]/g, "")
                            ).remove()
                        }, 1000)
                    })

                    var pos = $(obj).offset()
                    var leftPos = pos.left + 10
                    var topPos = pos.top + 20
                    if (leftPos + 200 > $(window).width()) {
                        leftPos = leftPos - 195
                        topPos = topPos + 20
                    }

                    $(document).keyup(function (e) {
                        if (e.keyCode === 27)
                            if (
                                document.getElementById(
                                    "box-" +
                                    name
                                        .replace(/ /g, "_")
                                        .replace(/[^a-zA-Z0-9_]/g, "")
                                ) != null
                            ) {
                                $(
                                    "#box-" +
                                    name
                                        .replace(/ /g, "_")
                                        .replace(/[^a-zA-Z0-9_]/g, "")
                                ).remove()
                            }
                    })
                    $(document).mouseup(function (e) {
                        var container = $(
                            "#box-" +
                            name
                                .replace(/ /g, "_")
                                .replace(/[^a-zA-Z0-9_]/g, "")
                        )

                        // if the target of the click isn't the container nor a descendant of the container
                        if (
                            !container.is(e.target) &&
                            container.has(e.target).length === 0
                        ) {
                            container.remove()
                        }
                    })
                    $("body").append(boxHTML)
                    $(
                        "#" +
                        "box-" +
                        name
                            .replace(/ /g, "_")
                            .replace(/[^a-zA-Z0-9_]/g, "")
                    ).css({ top: topPos, left: leftPos })
                }
                return [description, descriptiontwo]
            },
        process_chosen_summary_async:
            async function process_chosen_summary_async(
                $,
                summary,
                sampleSearch,
                ShowcaseInfo,
                showcaseName,
                showcaseType = "showcase_content"
            ) {
                let translatedLabels = {}
                try {
                    if (
                        localStorage[
                        "Splunk_Security_Essentials-i18n-labels-" +
                        window.localeString
                        ] != undefined
                    ) {
                        translatedLabels = JSON.parse(
                            localStorage[
                            "Splunk_Security_Essentials-i18n-labels-" +
                            window.localeString
                            ]
                        )
                    }
                } catch (error) {}

                //console.log("ShowcaseInfo: Got it!", summary, sampleSearch, showcaseName)
                if (
                    typeof sampleSearch.label != "undefined" &&
                    sampleSearch.label.indexOf(" - Demo") > 0
                ) {
                    var unsubmittedTokens =
                        splunkjs.mvc.Components.getInstance("default")
                    var submittedTokens =
                        splunkjs.mvc.Components.getInstance("submitted")
                    unsubmittedTokens.set("demodata", "blank")
                    submittedTokens.set(unsubmittedTokens.toJSON())
                }

                var DoImageSubtitles = function (numLoops) {
                    if (typeof numLoops == "undefined") numLoops = 1
                    var doAnotherLoop = false
                    //console.log("Starting the Subtitle..")
                    $(".screenshot").each(function (count, img) {
                        //console.log("got a subtitle", img)

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
                                // console.log("Handling subtitle zoom...", width, $(img).attr("zoomin"), $(img).attr("setWidth"), (typeof $(img).attr("zoomin") != "undefined" && $(img).attr("zoomin") != ""))
                                if (
                                    typeof $(img).attr("setwidth") !=
                                    "undefined" &&
                                    parseInt(
                                        $(img).css("width").replace("px")
                                    ) > parseInt($(img).attr("setwidth"))
                                ) {
                                    width =
                                        "width: " +
                                        $(img).attr("setwidth") +
                                        "px"
                                }
                                $(img).replaceWith(
                                    '<div style="display: inline-block; margin:10px; border: 1px solid lightgray;' +
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
                            //console.log("Analyzing image: ", $(img).css("width"), $(img).attr("processed"), $(img))
                        }
                    })
                    if (doAnotherLoop && numLoops < 30) {
                        numLoops++
                        setTimeout(function () {
                            DoImageSubtitles(numLoops)
                        }, 500)
                    }
                }
                window.DoImageSubtitles = DoImageSubtitles
                require([
                    "json!" +
                    $C["SPLUNKD_PATH"] +
                    "/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/sse_app_config",
                ], function (appConfig) {
                    let telemetryObj = {
                        status: "exampleLoaded",
                        exampleName: summary.name,
                        searchName: sampleSearch.label,
                    }
                    for (let i = 0; i < appConfig.length; i++) {
                        if (
                            appConfig[i].param == "demoMode" &&
                            appConfig[i].value == "true"
                        ) {
                            telemetryObj.demoMode = true
                        }
                    }
                    Telemetry.SendTelemetryToSplunk("PageStatus", telemetryObj)
                })

                $("#row1").hide() // Hide the basic search link
                $(".hide-global-filters").hide() // Hide the "Hide Filters" link

                if (typeof $(".dashboard-header-title")[0] != "undefined") {
                    $(".dashboard-header-description").html(
                        "Assistant: " +
                        $(".dashboard-header-title").first().html()
                    )
                    $(".dashboard-header-title").html(
                        '<a href="security_content">' +
                        _("Security Content").t() +
                        "</a> / " +
                        summary.name
                    )

                    // Add edit button on the custom content showcase page
                    let showcaseId = summary.id
                    if (showcaseId.includes("custom_")) {
                        require(["components/pages/custom_content"], function (
                            custom_content
                        ) {
                            $(".dashboard-header-title").append(
                                $(
                                    '<i class="icon-pencil action_custom_edit"></i><span class="action_custom_edit"> Edit</span></h1>'
                                ).click(function (evt) {
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
                                    //     true
                                    // )
                                })
                            )
                        })
                    }
                } else {
                    //$(".dashboard-header-description").html("Assistant: " + $(".dashboard-header-title").first().html() )
                    $(".dashboard-header h2")
                        .first()
                        .html(
                            summary.name +
                            " (Assistant: " +
                            $(".dashboard-header h2").first().html() +
                            ")"
                        )
                }
                //console.log("ShowcaseInfo: Original Title", document.title)
                document.title =
                    summary.name +
                    document.title.substr(document.title.indexOf("|") - 1)
                var exampleText = ""
                var exampleList = $("<span></span>")
                //console.log("ShowcaseInfo: New Title", document.title)
                if (typeof summary.examples != "undefined") {
                    exampleText = $(
                        '<div id="exampleList" class="panel-body html"> <strong>' +
                        _("View").t() +
                        "</strong><br /></div>"
                    )
                    //exampleText = '<div id="searchList" style="float: right; border: solid lightgray 1px; padding: 5px;"><a name="searchListAnchor" />'
                    //exampleText += summary.examples.length > 1 ? '<h2 style="padding-top: 0;">Searches:</h2>' : '<h2 style="padding-top: 0;">Search:</h2>';
                    //exampleList = $('<ul class="example-list"></ul>');

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
                        let label = example.label
                        if (
                            translatedLabels[label] &&
                            translatedLabels[label] != undefined &&
                            translatedLabels[label] != ""
                        ) {
                            label = translatedLabels[label]
                        }
                        if (example.name == sampleSearch.label) {
                            exampleText.append(
                                $("<button></button>")
                                    .attr("data-label", label)
                                    .addClass("selectedButton")
                                    .text(label)
                            )
                        } else {
                            exampleText.append(
                                $("<button></button>")
                                    .attr("data-label", label)
                                    .text(label)
                                    .click(function () {
                                        window.location.href = url
                                    })
                            )
                        }
                    })
                    //exampleText += "<ul>" + exampleList.html() + "</ul></div>"
                    exampleText.find("button").first().addClass("first")
                    exampleText.find("button").last().addClass("last")
                    //("Got my Example Text...", exampleText)
                    if (summary.examples.length > 1) {
                        var content =
                            "<span>" +
                            _("Demo Data").t() +
                            "</span> You're looking at the <i>" +
                            sampleSearch.label.replace(/^.*\- /, "") +
                            "</i> search right now. Did you know that we have " +
                            summary.examples.length +
                            " searches for this example? <a style=\"color: white; font-weight: bold; text-decoration: underline\" href=\"#\" onclick=\"var jElement = $('#exampleList'); $('html, body').animate({ scrollTop: jElement.offset().top-30}); $('body').append('<div class=\\'modal-backdrop  in\\'></div>');  jElement.addClass('searchListHighlight');setTimeout(function(){ $('.modal-backdrop').remove(); jElement.removeClass('searchListHighlight'); },2000);return false;\">Scroll Up</a> to the top to see the other searches."

                        setTimeout(function () {
                            $("#searchLabelMessage").html(content)
                            //console.log("Setting the reference content to ", content)
                        }, 1000)
                    }
                }
                if (
                    typeof summary.hideSearches != "undefined" &&
                    summary.hideSearches == true
                ) {
                    showSPLText = "" // Hide the search accordian
                    $("#fieldset1").hide() // hide  the search bar
                    $("#row11").hide() // Prereq
                    for (var i = 2; i <= 10; i++) {
                        //all of the dashboard panel
                        $("#row" + i).hide()
                    }
                }

                let name = summary.name
                window.setbookmark_status = function (
                    name,
                    showcaseId,
                    status,
                    action
                ) {
                    if (!action) {
                        action =
                            splunkjs.mvc.Components.getInstance("env").toJSON()[
                            "page"
                            ]
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
                        const id = `logBookmarkChange-${name.replace(
                            /[^a-zA-Z0-9]/g,
                            "_"
                        )}-${searchManId++}`
                        new SearchManager(
                            {
                                id,
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
                    var record = {
                        _time: new Date().getTime() / 1000,
                        _key: showcaseId,
                        showcase_name: name,
                        status: status,
                        notes: summary.bookmark_notes,
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
                                        "X-Requested-With": "XMLHttpRequest",
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
                                    async: false,
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

                let summaryUI = await this.GenerateShowcaseHTMLBodyAsync(
                    summary,
                    ShowcaseInfo
                )
                //let description = summaryUI[0] + summaryUI[1]
                if (
                    typeof $(".dashboard-header-description")[0] != "undefined"
                ) {
                    $(".dashboard-header-description")
                        .parent()
                        .append($("<br/>" + summaryUI[0]))
                } else {
                    $(".dashboard-header .description")
                        .first()
                        .html(summaryUI[0])
                }
                // window.dvtest = summaryUI[1]
                // console.log("Looking to add..", $("#fieldset1").length, $("#layout1").length, summaryUI[1] )
                if ($("#fieldset1").length > 0) {
                    $(summaryUI[1]).insertAfter("#fieldset1")
                } else if ($("#layout1").length > 0) {
                    $(summaryUI[1]).insertAfter("#layout1")
                } else {
                    $(".dashboard-body").append(summaryUI[1])
                }
                $("#cloneToCustomContent")
                    .css({
                        cursor: "pointer",
                        width: "max-content",
                        padding: "4px 8px 4px 8px",
                        "background-color": "lightgray",
                        "border-radius": "6px",
                        "font-weight": "bold",
                        "visibility": "visible",
                    })
                    .click(function () {
                        localStorage.setItem(
                            "sse-summarySelectedToClone",
                            JSON.stringify(summary)
                        )
                        localStorage.setItem("sse-activeClick-custom", "clone")
                        location.href = "custom_content"
                    })
                //$("#fieldset1").insertAfter($(summaryUI[1]))
                //$("#alertVolumetooltip").popover()
                $("[data-toggle=tooltip]").tooltip({ html: true })
                $("[data-toggle=popover]").popover({
                    trigger: "hover",
                    html: true,
                    placement: "right",
                })
                if (
                    showcaseType != "showcase_security_content" &&
                    showcaseType != "showcase_custom"
                ) {
                    $("#contentDescription").prepend(
                        '<div id="Tour" style="float: right" class="tour"><a class="external drilldown-link" style="color: white;" href="' +
                        window.location.href +
                        "&tour=" +
                        showcaseName +
                        "-tour" +
                        '">' +
                        _("Learn how to use this page").t() +
                        "</a></div>"
                    )
                }
                if (exampleText) {
                    exampleText.insertBefore($("#layout1").first())
                }

                $("#fullSolution_table th.expands")
                    .find("a")
                    .click(function () {
                        $(".contentstile")
                            .find("h3")
                            .each(function (a, b) {
                                if ($(b).height() > 60) {
                                    $(b).text(
                                        $(b)
                                            .text()
                                            .replace(/^(.{55}).*/, "$1...")
                                    )
                                }
                            })
                    })
                if (typeof summary.autoOpen != "undefined") {
                    $("#" + summary.autoOpen + " th.expands")
                        .find("a")
                        .trigger("click")
                }
                if ($("#gdprtext_table").length > 0) {
                    $("#gdprtext_table th.expands").find("a").trigger("click")
                }
                var visualizations = []

                if (typeof summary.visualizations != "undefined") {
                    visualizations = summary.visualizations
                }

                if (
                    typeof sampleSearch.visualizations != "undefined" &&
                    sampleSearch.visualizations.length > 0
                ) {
                    for (
                        var i = 0;
                        i < sampleSearch.visualizations.length;
                        i++
                    ) {
                        if (
                            typeof sampleSearch.visualizations[i].panel !=
                            "undefined"
                        ) {
                            var shouldAppend = true
                            for (var g = 0; g < visualizations.length; g++) {
                                if (
                                    sampleSearch.visualizations[i].panel ==
                                    visualizations[g].panel
                                ) {
                                    shouldAppend = false
                                    visualizations[g] =
                                        sampleSearch.visualizations[i]
                                }
                            }
                            if (shouldAppend) {
                                visualizations.push(
                                    sampleSearch.visualizations[i]
                                )
                            }
                        }
                    }
                }
                //      console.log("Visualization Status", visualizations, sampleSearch, summary)
                if (visualizations.length > 0) {
                    var triggerSubtitles = false
                    for (var i = 0; i < visualizations.length; i++) {
                        // console.log("Analyzing panle", visualizations[i])
                        if (
                            typeof visualizations[i].panel != "undefined" &&
                            typeof visualizations[i].type != "undefined" &&
                            (typeof visualizations[i].hideInSearchBuilder ==
                                "undefined" ||
                                visualizations[i].hideInSearchBuilder == false)
                        ) {
                            if (
                                visualizations[i].type == "HTML" &&
                                typeof visualizations[i].html != "undefined"
                            ) {
                                // console.log("Enabling panle", visualizations[i].panel)
                                var unsubmittedTokens =
                                    splunkjs.mvc.Components.getInstance(
                                        "default"
                                    )
                                var submittedTokens =
                                    splunkjs.mvc.Components.getInstance(
                                        "submitted"
                                    )
                                unsubmittedTokens.set(
                                    visualizations[i].panel,
                                    "blank"
                                )
                                submittedTokens.set(unsubmittedTokens.toJSON())

                                $("#" + visualizations[i].panel).html(
                                    visualizations[i].html
                                )
                            } else if (
                                visualizations[i].type == "image" &&
                                typeof visualizations[i].path != "undefined"
                            ) {
                                // console.log("Enabling panle", visualizations[i].panel)
                                var unsubmittedTokens =
                                    splunkjs.mvc.Components.getInstance(
                                        "default"
                                    )
                                var submittedTokens =
                                    splunkjs.mvc.Components.getInstance(
                                        "submitted"
                                    )
                                unsubmittedTokens.set(
                                    visualizations[i].panel,
                                    "blank"
                                )
                                submittedTokens.set(unsubmittedTokens.toJSON())
                                var style = ""
                                if (
                                    typeof visualizations[i].style !=
                                    "undefined"
                                )
                                    style =
                                        'style="' +
                                        visualizations[i].style +
                                        '"'
                                var title = ""
                                if (
                                    typeof visualizations[i].title !=
                                    "undefined"
                                )
                                    title =
                                        'title="' +
                                        visualizations[i].title +
                                        '"'
                                // console.log("Her'es my panle title", title)
                                $("#" + visualizations[i].panel).html(
                                    '<img class="screenshot" ' +
                                    style +
                                    ' src="' +
                                    visualizations[i].path +
                                    '" ' +
                                    title +
                                    " />"
                                )
                                triggerSubtitles = true
                            } else if (visualizations[i].type == "viz") {
                                // console.log("Enabling panle", visualizations[i].panel)
                                var unsubmittedTokens =
                                    splunkjs.mvc.Components.getInstance(
                                        "default"
                                    )
                                var submittedTokens =
                                    splunkjs.mvc.Components.getInstance(
                                        "submitted"
                                    )
                                unsubmittedTokens.set(
                                    visualizations[i].panel,
                                    "blank"
                                )
                                submittedTokens.set(unsubmittedTokens.toJSON())
                                $("#" + visualizations[i].panel).html(
                                    '<div id="element' +
                                    visualizations[i].panel +
                                    '" />'
                                )
                                //Get time range from the timepicker and apply to all panels
                                let baseTimerange =
                                    splunkjs.mvc.Components.getInstance(
                                        "searchBarControl"
                                    ).timerange.val()
                                var SMConfig = {
                                    status_buckets: 0,
                                    cancelOnUnload: true,
                                    sample_ratio: null,
                                    app: "Splunk_Security_Essentials",
                                    auto_cancel: 90,
                                    preview: true,
                                    tokenDependencies: {},
                                    runWhenTimeIsUndefined: false,
                                    earliest_time: baseTimerange.earliest_time,
                                    latest_time: baseTimerange.latest_time,
                                }
                                SMConfig.id = "search" + visualizations[i].panel
                                if (
                                    typeof visualizations[i].basesearch ==
                                    "undefined"
                                ) {
                                    //              console.log("No Base Search Detected", visualizations[i])
                                    SMConfig.search = visualizations[i].search
                                } else {
                                    //              console.log("Woo! Base Search Detected", visualizations[i])
                                    if (
                                        visualizations[i].search.match(/^\s*\|/)
                                    ) {
                                        SMConfig.search =
                                            visualizations[i].basesearch +
                                            " " +
                                            visualizations[i].search
                                    } else {
                                        SMConfig.search =
                                            visualizations[i].basesearch +
                                            "| " +
                                            visualizations[i].search
                                    }
                                }

                                /*new SearchManager({
                                "id": "search8",
                                "latest_time": "now",
                                "status_buckets": 0,
                                "cancelOnUnload": true,
                                "earliest_time": "-24h@h",
                                "sample_ratio": null,
                                "search": "| makeresults count=15 | streamstats count",
                                "app": utils.getCurrentApp(),
                                "auto_cancel": 90,
                                "preview": true,
                                "tokenDependencies": {
                                },
                                "runWhenTimeIsUndefined": false
                            }, {tokens: true, tokenNamespace: "submitted"});*/
                                var VizConfig = visualizations[i].vizParameters
                                VizConfig.id =
                                    "element" + visualizations[i].panel
                                VizConfig.managerid =
                                    "search" + visualizations[i].panel
                                VizConfig.el = $(
                                    "#element" + visualizations[i].panel
                                )

                                // console.log("Got our panle SM Config", SMConfig)
                                // console.log("Got our panle Viz Config", VizConfig)
                                /*{
                                "id": "element2",
                                "charting.drilldown": "none",
                                "resizable": true,
                                "charting.chart": "area",
                                "managerid": "search2",
                                "el": $('#element2')
                            }*/
                                var SM = new SearchManager(SMConfig, {
                                    tokens: true,
                                    tokenNamespace: "submitted",
                                })
                                // console.log("Got our panle SM", SM)
                                var Viz
                                if (
                                    visualizations[i].vizType == "ChartElement"
                                ) {
                                    Viz = new ChartElement(VizConfig, {
                                        tokens: true,
                                        tokenNamespace: "submitted",
                                    }).render()
                                } else if (
                                    visualizations[i].vizType == "SingleElement"
                                ) {
                                    Viz = new SingleElement(VizConfig, {
                                        tokens: true,
                                        tokenNamespace: "submitted",
                                    }).render()
                                } else if (
                                    visualizations[i].vizType == "MapElement"
                                ) {
                                    Viz = new MapElement(VizConfig, {
                                        tokens: true,
                                        tokenNamespace: "submitted",
                                    }).render()
                                } else if (
                                    visualizations[i].vizType == "TableElement"
                                ) {
                                    Viz = new TableElement(VizConfig, {
                                        tokens: true,
                                        tokenNamespace: "submitted",
                                    }).render()
                                }
                                // console.log("Got our panle Viz", Viz)

                                SM.on("search:done", function (properties) {
                                    //console.log("search complete", properties.content.label)
                                    var panelName =
                                        properties.content.label.replace(
                                            /search/,
                                            ""
                                        )

                                    // Instantiate the results link view if it does not already exist. Sometimes this event is striggered more than once
                                    if (
                                        typeof splunkjs.mvc.Components.getInstance(
                                            "search" +
                                            panelName +
                                            "-resultsLink"
                                        ) == "undefined"
                                    ) {
                                        var resultsLink = new ResultsLinkView({
                                            id:
                                                "search" +
                                                panelName +
                                                "-resultsLink",
                                            managerid: "search" + panelName, //,
                                            //el: $("#row1cell1").find(".panel-body")
                                        })

                                        // Display the results link view
                                        resultsLink
                                            .render()
                                            .$el.appendTo(
                                                $("#" + panelName).find(
                                                    ".panel-body"
                                                )
                                            )
                                        $(
                                            "#search" +
                                            panelName +
                                            "-resultsLink"
                                        ).addClass("resultLink")
                                    }
                                })
                            }
                            if (
                                typeof visualizations[i].title != "undefined" &&
                                visualizations[i].title != ""
                            ) {
                                $("#element" + visualizations[i].panel)
                                    .parent()
                                    .prepend(
                                        '<h2 class="panel-title">' +
                                        visualizations[i].title +
                                        "</h2>"
                                    )
                            }
                        }
                    }
                    if (triggerSubtitles) {
                        DoImageSubtitles()
                    }

                    //Add trigger so the panels time range is also changed when you change the dropdown
                    // mytimerange.on("change", function() {
                    //     mysearch.settings.set(mytimerange.val());
                    // });

                    let searchBarControlVal =
                        splunkjs.mvc.Components.getInstance("searchBarControl")

                    if (searchBarControlVal) {
                        searchBarControlVal.timerange.on("change", function () {
                            for (var i = 0; i < visualizations.length; i++) {
                                if (
                                    typeof splunkjs.mvc.Components.getInstance(
                                        "search" + visualizations[i].panel
                                    ) != "undefined"
                                ) {
                                    let baseTimerange = this.val()
                                    splunkjs.mvc.Components.getInstance(
                                        "search" + visualizations[i].panel
                                    ).search.set(baseTimerange)
                                }
                            }
                        })
                    }
                }

                $("#enableAdvancedSPL").click(function (event) {
                    if (event.target.checked == true) {
                        localStorage["sse-splMode"] = "true"
                        $(".mlts-panel-footer").show()
                        $(
                            "#outliersPanel .mlts-panel-footer :not(.mlts-show-spl)"
                        ).show()
                        $("#fieldset1").show()
                        $("#row11").show()
                    } else {
                        localStorage["sse-splMode"] = "false"
                        $(".mlts-panel-footer").hide()
                        $("#outliersPanel .mlts-panel-footer").show()
                        $(
                            "#outliersPanel .mlts-panel-footer :not(.mlts-show-spl)"
                        ).hide()
                        $("#fieldset1").hide()
                        $("#row11").hide()
                    }
                })
                if (
                    typeof localStorage["sse-splMode"] != "undefined" &&
                    localStorage["sse-splMode"] == "false"
                ) {
                    // console.log("SPL Mode is off, hiding everything")
                    $(".mlts-panel-footer").hide()
                    $("#outliersPanel .mlts-panel-footer").show()
                    $(
                        "#outliersPanel .mlts-panel-footer :not(.mlts-show-spl)"
                    ).hide()
                    $("#fieldset1").hide()
                    $("#row11").hide()
                } else {
                    $(".mlts-panel-footer").show()
                    $(
                        "#outliersPanel .mlts-panel-footer :not(.mlts-show-spl)"
                    ).show()
                    $("#fieldset1").show()
                    $("#row11").show()
                }
                $(".dashboard-header").css("margin-bottom", "0")

                document.querySelectorAll("pre code").forEach((block) => {
                    hljs.highlightBlock(block)
                })
                //$("<a href=\"" + window.location.href + "&tour=" + showcaseName + "-tour\"><div id=\"Tour\" class=\"tourbtn\" style=\"float: right; margin-right: 15px; margin-top: 5px; \">Launch Tour</div></a>").insertAfter("#searchList")
            },
        addItem_async: async function addItem($, ShowcaseInfo, summary) {
            //console.log("Running addItem on", summary)
            // console.log("Summary: ", summary);
            let rowStatus = ""
            let statuses = Object.keys(BookmarkStatus)
            for (let i = 0; i < statuses.length; i++) {
                if (statuses[i] == "none") {
                    continue
                }
                rowStatus +=
                    '<td style="text-align: center" class="table' +
                    statuses[i] +
                    '">' +
                    '<input type="radio" name="' +
                    summary.id +
                    '" data-status="' +
                    statuses[i] +
                    '" data-showcaseid="' +
                    summary.id +
                    '" data-name="' +
                    summary.name +
                    '" onclick="radioUpdateSetting(this)" ' +
                    (summary.bookmark_status == statuses[i] ? "checked" : "") +
                    ">" +
                    "</td>"
            }
            rowStatus +=
                '<td style="text-align: center" class="tableclose" >' +
                '<i class="icon-close" style="font-size: 20px;"  name="' +
                summary.id +
                '" data-status="none" data-showcaseid="' +
                summary.id +
                '" data-name="' +
                summary.name +
                '" onclick="radioUpdateSetting(this)" >' +
                "</td>"
            var status_display = BookmarkStatus[summary.bookmark_status]
            var SPL = $('<div class="donotbreak"></div>')
            if (
                typeof summary.examples == "object" &&
                summary.examples.length > 0
            ) {
                SPL.append("<h2>SPL for " + summary.name + "</h2>")
                for (var i = 0; i < summary.examples.length; i++) {
                    if (
                        typeof examples[summary.examples[i].name] != "undefined"
                    ) {
                        var localexample = $(
                            '<div class="donotbreak"></div>'
                        ).append(
                            $("<h3>" + summary.examples[i].tag + "</h3>"),
                            $(examples[summary.examples[i].name].linebylineSPL)
                        )
                        SPL.append(localexample)
                    }
                }
            }
            var printableimage = $("")
            if (
                typeof summary.printable_image != "undefined" &&
                summary.printable_image != "" &&
                summary.printable_image != null
            ) {
                printableimage = $(
                    '<div class="donotbreak" style="margin-top: 15px;"><h2>Screenshot of Demo Data</h2></div>'
                ).append(
                    $('<img class="printonly" />').attr(
                        "src",
                        summary.printable_image
                    )
                )
            }
            function fullyDecodeURIComponent(uriComponent) {
                const isEncoded = function (uriComponent) {
                    uriComponent = uriComponent || ""
                    return uriComponent !== decodeURIComponent(uriComponent)
                }

                while (isEncoded(uriComponent)) {
                    uriComponent = decodeURIComponent(uriComponent)
                }
                return uriComponent
            }
            var linkToExample = ""
            if (typeof summary.dashboard != "undefined") {
                linkToExample =
                    '<a href="' +
                    cleanLink(
                        fullyDecodeURIComponent(summary.dashboard),
                        false
                    ) +
                    '" class="external drilldown-link" target="_blank"></a>'
            }
            // <th style=\"width: 10px; text-align: center\" class=\"tableexpand\"><i class=\"icon-info\"></i></th>"+
            //                         "<th class=\"tableExample\">Content</th>" +
            //                         "<th style=\"text-align: center\">Open</th>"+
            //                         "<th style=\"text-align: center\">User</th>"+
            //                         "<th style=\"text-align: center\">When Added</th>"+
            //                         "<th style=\"text-align: center\">Edit</th>"+
            //                         "<th style=\"text-align: center\"><span data-placement=\"top\" data-toggle=\"tooltip\" title=\"Removing here just means removing the bookmark, not the entire content. You will still be able to find it on the Security Contents page, and be able to re-add the bookmark later.\">Remove <i class=\"icon-info-circle\" /></span></th>" +
            //                         "</tr></thead><tbody id=\"main_table_body\"></tbody></ta
            var date = new Date(parseInt(summary.custom_time * 1000))
            let timeStr = date.toLocaleString(window.localeString, {
                month: "numeric",
                year: "numeric",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                hour12: false,
            })
            let displayapp = summary.displayapp
            if (summary.inSplunk == "no" && displayapp == "Custom Content") {
                displayapp = ""
            } else if (summary.inSplunk == "yes") {
                displayapp = "Splunk"
            }

            let titleRow = $(
                '<tr class="titleRow" data-showcaseId="' +
                summary.id +
                '"  class="dvbanner">' +
                '<td class="tableexpand" class="downarrow" ><a href="#" onclick="doToggle(this); return false;"><i class="icon-chevron-right" /></a></td>' +
                '<td class="name content-name"><div></div><a href="#" onclick="doToggle(this); return false;">' +
                summary.name +
                "</a></td>" +
                '<td style="text-align: center">' +
                linkToExample +
                "</td>" +
                '<td style="text-align: center">' +
                displayapp +
                "</td>" +
                '<td class="content-user" style="text-align: center">' +
                cleanLink(summary.custom_user, false) +
                "</td>" +
                '<td class="content-time" style="text-align: center">' +
                timeStr +
                "</td>" +
                '<td style="text-align: center" class="tableedit" ><i class="icon-pencil" style="font-size: 20px;"  name="' +
                summary.id +
                '" data-showcaseid="' +
                summary.id +
                '" data-name="' +
                summary.name +
                '" onclick="editContent(this)" ></td>' +
                '<td style="text-align: center" class="tableclose" ><i class="icon-close" style="font-size: 20px;"  name="' +
                summary.id +
                '" data-status="none" data-showcaseid="' +
                summary.id +
                '" data-name="' +
                summary.name +
                '" onclick="removeContent(this)" ></td>' +
                "</tr>"
            )

            let custom_json = {
                name: summary.name,
                inSplunk: summary.inSplunk,
                displayapp: summary.displayapp,
                securityDataJourney: summary.securityDataJourney,
                usecase: summary.usecase,
                highlight: summary.highlight,
                alertvolume: summary.alertvolume,
                severity: summary.severity,
                category: summary.category,
                description: summary.description,
                domain: summary.domain,
                killchain: summary.killchain,
                SPLEase: summary.SPLEase,
                searchkeywords: summary.searchkeywords,
                advancedtags: summary.advancedtags,
                printable_image: summary.printable_image,
                icon: summary.icon,
                company_logo: summary.company_logo,
                company_logo_width: summary.company_logo_width,
                company_logo_height: summary.company_logo_height,
                company_name: summary.company_name,
                company_description: summary.company_description,
                company_link: summary.company_link,
                dashboard: summary.dashboard,
                relevance: summary.relevance,
                help: summary.help,
                howToImplement: summary.howToImplement,
                knownFP: summary.knownFP,
                operationalize: summary.operationalize,
                search: summary.search,
                data_source_categories: summary.data_source_categories,
                mitre_technique: summary.mitre_technique,
                mitre_sub_technique: summary.mitre_sub_technique,
                mitre_tactic: summary.mitre_tactic
            }
            let custom_content_obj = [{
                channel: summary.channel,
                json: JSON.stringify(custom_json)
                        .replace(/\\\|/g, "|")
                        .replace(/\\\"/g, '"')
                        .replace(/\\"/g, '"'),
                showcaseId: summary.id,
                user: summary.custom_user,
                _key: summary.id,
                _time: summary.custom_time,
                _user: "nobody"
            }]
            let bookmarks_json = [{
                notes: summary.bookmark_notes,
                showcase_name: summary.name,
                status: summary.bookmark_status,
                user: summary.bookmark_user,
                _key: summary.id,
                _time: summary.custom_time,
                _user: "nobody"
            }]
            let mappings_json = [{
                search_title: summary.search_title,
                showcaseId: summary.id,
                _key: summary.id,
                _time: summary.custom_time,
                _user: "nobody"
            }]
            let main_json = {
                bookmarks: bookmarks_json,
                customContent: custom_content_obj,
                // dscs: dscs_json,
                mappings: mappings_json,
                // products: products_json
            }
            titleRow.attr(
                "data-json",
                JSON.stringify(main_json)
                    .replace(/\\/g, "\\\\")
                    .replace(/"/g, '\\"')
                    .replace(/\|/g, "\\|")
            )
            titleRow.append(
                $('<td  style="text-align: center" class="snapshot-">').html(
                    $('<i class="icon-export" style="cursor: pointer;">').click(
                        function (evt) {
                            let target = $(evt.target)
                            let row = target.closest("tr")
                            let output = {}
                            output["name"] = row.find(".content-name").text()
                            output["time"] = row.find(".content-time").text()
                            output["user"] = row.find(".content-user").text()
                            output["num_bookmarks"] = "0"
                            output["num_custom_items"] = "1"
                            window.dvtest = row.attr("data-json")
                            output["json"] = JSON.parse([
                                row
                                    .attr("data-json")
                                    .replace(/\\\|/g, "|")
                                    .replace(/\\\"/g, '"')
                                    .replace(/\\"/g, '"'),
                            ])
                            let base64Output = b64EncodeUnicode(
                                JSON.stringify(output)
                            )
                            require([
                                "jquery",
                                "components/controls/Modal",
                            ], function ($, Modal) {
                                let myModal = new Modal(
                                    "snapshotJSON",
                                    {
                                        title: "Export a Backup",
                                        destroyOnHide: true,
                                    },
                                    $
                                )
                                $(myModal.$el).on("hide", function () {
                                    // Not taking any action on hide, but you can if you want to!
                                })

                                let body = $("<div>")
                                body.append(
                                    "<p>The following includes the content of this backup export, which is a JSON output encoded as base64. You can import this export into a Splunk Security Essentials instance by copying and pasting it into the Import Backup screen.</p>"
                                )
                                body.append(
                                    $(
                                        '<textarea id="importSnapshotBlob" />'
                                    ).text(base64Output)
                                )
                                body.append(
                                    $(
                                        '<a href="#" style="margin-left: 2%;">Copy Export</a>'
                                    ).click(function () {
                                        var copyText =
                                            document.getElementById(
                                                "importSnapshotBlob"
                                            )
                                        copyText.select()
                                        document.execCommand("copy")
                                    })
                                )
                                myModal.body.html(body)

                                myModal.footer.append(
                                    $("<button>")
                                        .attr({
                                            type: "button",
                                            "data-dismiss": "modal",
                                            "data-bs-dismiss": "modal",
                                        })
                                        .addClass("btn ")
                                        .text("Close")
                                        .on("click", function () {})
                                )
                                myModal.show()
                            })
                        }
                    )
                )
            )
            let summaryUI = await this.GenerateShowcaseHTMLBodyAsync(
                summary,
                ShowcaseInfo,
                true
            )
            let description = summaryUI[0] + summaryUI[1]
            let descriptionRow = $(
                '<tr class="descriptionRow" data-showcaseId="' +
                summary.id +
                '"  style="display: none;"><td colspan="10">' +
                description +
                "</td></tr>"
            )
            if ($(".titleRow[data-showcaseid=" + summary.id + "]").length > 0) {
                $("#bookmark_printable_table")
                    .find("div[data-showcaseid=" + summary.id + "]")
                    .remove()
                $("#bookmark_printable_table").append(
                    $("<div>")
                        .addClass("printable_section")
                        .attr("data-showcaseid", summary.id)
                        .append(
                            $(
                                "<h1>" +
                                summary.name +
                                "</h1><h2>Status</h2><p>" +
                                status_display +
                                "</p>" +
                                "<h2>App</h2><p>" +
                                summary.displayapp +
                                "</p>" +
                                $(description.replace(/display: none/g, ""))
                                    .find("#contentDescription")
                                    .html()
                            ),
                            SPL,
                            printableimage
                        )
                )
                $(".titleRow[data-showcaseid=" + summary.id + "]").replaceWith(
                    titleRow
                )
                $(
                    ".descriptionRow[data-showcaseid=" + summary.id + "]"
                ).replaceWith(descriptionRow)
            } else {
                $("#bookmark_printable_table").append(
                    $("<div>")
                        .addClass("printable_section")
                        .attr("data-showcaseid", summary.id)
                        .append(
                            $(
                                "<h1>" +
                                summary.name +
                                "</h1><h2>Status</h2><p>" +
                                status_display +
                                "</p>" +
                                "<h2>App</h2><p>" +
                                summary.displayapp +
                                "</p>" +
                                $(description.replace(/display: none/g, ""))
                                    .find("#contentDescription")
                                    .html()
                            ),
                            SPL,
                            printableimage
                        )
                )
                $("#main_table_body").append(titleRow)
                $("#main_table_body").append(descriptionRow)
            }

            if ($("tr.titleRow").length > 0) {
                $("#bottomTextBlock").hide()
            }
        },
        addItemBM_async: async function addItemBM_async(
            $,
            ShowcaseInfo,
            summary
        ) {
            let rowStatus = ""
            let statuses = Object.keys(BookmarkStatus)
            for (let i = 0; i < statuses.length; i++) {
                if (statuses[i] == "none") {
                    continue
                }
                rowStatus +=
                    '<td style="text-align: center" class="table' +
                    statuses[i] +
                    '">' +
                    '<input type="radio" name="' +
                    summary.id +
                    '" data-status="' +
                    statuses[i] +
                    '" data-showcaseid="' +
                    summary.id +
                    '" data-name="' +
                    summary.name +
                    '" onclick="radioUpdateSetting(this)" ' +
                    (summary.bookmark_status == statuses[i] ? "checked" : "") +
                    ">" +
                    "</td>"
            }
            if (
                summary.bookmark_notes &&
                summary.bookmark_notes != "" &&
                summary.bookmark_notes != null &&
                summary.bookmark_notes != "None"
            ) {
                rowStatus +=
                    '<td style="text-align: center" class="tablenotes" >' +
                    '<i class="icon-pencil" style="font-size: 20px;"  name="' +
                    summary.id +
                    '"  data-showcaseid="' +
                    summary.id +
                    '" data-name="' +
                    summary.name +
                    '" onclick="triggerNotes(this)" >' +
                    "</td>"
            } else {
                rowStatus +=
                    '<td style="text-align: center" class="tablenotes" >' +
                    '<i class="icon-pencil" style="font-size: 20px; color: gray;"  name="' +
                    summary.id +
                    '"  data-showcaseid="' +
                    summary.id +
                    '" data-name="' +
                    summary.name +
                    '" onclick="triggerNotes(this)" >' +
                    "</td>"
            }
            rowStatus +=
                '<td style="text-align: center" class="tableclose" >' +
                '<i class="icon-close" style="font-size: 20px;"  name="' +
                summary.id +
                '" data-status="none" data-showcaseid="' +
                summary.id +
                '" data-name="' +
                summary.name +
                '" onclick="radioUpdateSetting(this)" >' +
                "</td>"
            var status_display = BookmarkStatus[summary.bookmark_status]
            var SPL = $('<div class="donotbreak"></div>')
            if (
                typeof summary.examples == "object" &&
                summary.examples.length > 0
            ) {
                SPL.append("<h2>SPL for " + summary.name + "</h2>")
                for (var i = 0; i < summary.examples.length; i++) {
                    if (
                        typeof examples[summary.examples[i].name] != "undefined"
                    ) {
                        var localexample = $(
                            '<div class="donotbreak"></div>'
                        ).append(
                            $("<h3>" + summary.examples[i].label + "</h3>"),
                            $(examples[summary.examples[i].name].linebylineSPL)
                        )
                        SPL.append(localexample)
                    }
                }
            }
            var printableimage = $("")
            if (
                typeof summary.printable_image != "undefined" &&
                summary.printable_image != "" &&
                summary.printable_image != null
            ) {
                printableimage = $(
                    '<div class="donotbreak" style="margin-top: 15px;"><h2>Screenshot of Demo Data</h2></div>'
                ).append(
                    $('<img class="printonly" />').attr(
                        "src",
                        Splunk.util.make_full_url(summary.printable_image)
                    )
                )
            }
            var linkToExample = ""
            if (typeof summary.dashboard != "undefined") {
                if (
                    summary.dashboard == "ES_Use_Case" ||
                    summary.dashboard == "UBA_Use_Case" ||
                    summary.dashboard == "ESCU_Use_Case" ||
                    summary.dashboard == "PS_Use_Case"
                ) {
                    link =
                        summary.dashboard +
                        "?form.needed=stage" +
                        summary.securityDataJourney.split("|")[0].replace("Level", "") +
                        "&showcase=" +
                        summary.name
                } else if (summary.channel === "custom") {
                    link = cleanLink(summary.dashboard, false)
                } else {
                    link = summary.dashboard
                }
                linkToExample =
                    '<a href="' +
                    link +
                    '" class="external drilldown-link" target="_blank"></a>'
            }
            $("#main_table_body").append(
                '<tr class="titleRow" data-showcaseId="' +
                summary.id +
                '"  class="dvbanner"><td class="tableexpand" class="downarrow" ><a href="#" onclick="doToggle(this); return false;"><i class="icon-chevron-right" /></a></td><td class="name"><div></div><a href="#" onclick="doToggle(this); return false;">' +
                summary.name +
                '</a></td><td style="text-align: center">' +
                linkToExample +
                "</td>" +
                rowStatus +
                "</tr>"
            )
            let summaryUI = await this.GenerateShowcaseHTMLBodyAsync(
                summary,
                ShowcaseInfo,
                true
            )
            let description = summaryUI[0] + summaryUI[1]
            $("#main_table_body").append(
                '<tr class="descriptionRow" data-showcaseId="' +
                summary.id +
                '"  style="display: none;"><td colspan="10">' +
                description +
                "</td></tr>"
            )
            $("#bookmark_printable_table").append(
                $("<div>")
                    .addClass("printable_section")
                    .attr("data-showcaseid", summary.id)
                    .append(
                        $(
                            '<h1 class="printable-showcase-name">' +
                            summary.name +
                            "</h1><h2>Status</h2><p>" +
                            status_display +
                            "</p>" +
                            "<h2>App</h2><p>" +
                            summary.displayapp +
                            "</p>" +
                            $(
                                description
                                    .replace(/display: none/g, "")
                                    .replace(
                                        /reallyshow: none/,
                                        "display: none"
                                    )
                            )
                                .find("#contentDescription")
                                .html()
                        ),
                        SPL,
                        printableimage
                    )
            )
        },
    }
})
