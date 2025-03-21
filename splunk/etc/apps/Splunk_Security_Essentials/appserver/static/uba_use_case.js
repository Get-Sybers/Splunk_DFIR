"use strict";

require([
        "jquery",
        "splunkjs/mvc",
        "splunkjs/mvc/utils",
        "splunkjs/mvc/tokenutils",
        "splunkjs/mvc/simplexml",
        "splunkjs/ready!",
    ],
    function(
        $,
        mvc,
        utils,
        TokenUtils,
        DashboardController,
        Ready //,
        //ShowcaseInfo
    ) {


        var unsubmittedTokens = mvc.Components.getInstance('default');
        var submittedTokens = mvc.Components.getInstance('submitted');
        var myDataset = unsubmittedTokens.get("ml_toolkit.dataset")
            // console.log("Running Dataset..", myDataset.replace(/\W/g,""))
        ShowcaseInfo = ""
        $.getJSON($C['SPLUNKD_PATH'] + '/services/SSEShowcaseInfo?locale=' + window.localeString, function(data) {
            // console.log("Got a dataset!", data)
            ShowcaseInfo = data
                // console.log("ShowcaseInfo: - Checking ShowcaseInfo", ShowcaseInfo)
            for (var summary in ShowcaseInfo.summaries) {
                summary = ShowcaseInfo.summaries[summary]
                dashboardname = summary.dashboard
                if (dashboardname.indexOf("?") > 0) {
                    dashboardname = dashboardname.substr(0, dashboardname.indexOf("?"))
                }
                example = undefined
                if (summary.dashboard.indexOf("=") > 0) {
                    example = summary.dashboard.substr(summary.dashboard.indexOf("=") + 1)
                }

                // console.log("Outer Comparing ", dashboardname, " and " , "UBA_Use_Case", "also", example, "and", myDataset, "for", summary)
                if (dashboardname == "UBA_Use_Case" && example == myDataset) {

                    // console.log("ShowcaseInfo: Got it!", summary)
                    if (typeof $(".dashboard-header-title")[0] != "undefined") {
                        $(".dashboard-header-title").first().html(summary.name + " (Assistant: " + $(".dashboard-header-title").first().html() + ")")
                    } else {
                        $(".dashboard-header h2").first().html(summary.name + " (Assistant: " + $(".dashboard-header h2").first().html() + ")")
                    }
                    if (typeof $(".dashboard-header-description")[0] != "undefined") {
                        $(".dashboard-header-description").first().html(summary.description)
                    } else {
                        $(".dashboard-header .description").first().html(summary.description)
                    }

                }
            }
        });
        require(['vendor/bootstrap/bootstrap.bundle'],function(){
            if ($(".dvTooltip").length > 0) { $(".dvTooltip").tooltip() }
            if ($(".dvPopover").length > 0) { $(".dvPopover").popover() }
        })

        unsubmittedTokens.set(myDataset.replace(/\W/g, ""), "Test");

        submittedTokens.set(unsubmittedTokens.toJSON());
    }
);