'use strict';

// set the runtime environment, which controls cache busting
var runtimeEnvironment = 'production';

var build;

$("#processing").html(
    '<img style="width: 30px;" src="' +
      Splunk.util.make_full_url(
        "/static/app/Splunk_Security_Essentials/images/general_images/loader.gif"
      ) +
      '" title="Loading..."></img>'
  );

// get app and page names
var pathComponents = location.pathname.split('?')[0].split('/');
var appName = 'Splunk_Security_Essentials';
var pageIndex = pathComponents.indexOf(appName);
var pageName = pathComponents[pageIndex + 1];
var additionalConfigOptions = {
    config: {}
};

// path to the root of the current app
var appPath = "../app/" + appName;

// Queue translation early, before other work occurs
window.localeString = location.href.replace(/\/app\/.*/, "").replace(/^.*\//, "")
window.startTime = Date.now()

// console.log("Starting", Date.now() - window.startTime)
require(
    [
        'jquery',
        //'json!' + $C['SPLUNKD_PATH'] + '/services/apps/local/Splunk_Security_Essentials?output_mode=json',
        Splunk.util.make_full_url("/static/app/Splunk_Security_Essentials/properties.js"),
        "components/data/sendTelemetry",
        'splunkjs/mvc'
    ],
    function(
        $,
        props,
        Telemetry,
        mvc
    ) {

        // Sending Telemetry data when an external link is clicked
        let record = {
            "status": "opened",
            "page": mvc.Components.getInstance("env").toJSON()['page'],
            "event": "clicked",
        }
        
        $(".external").click(function(){
            Telemetry.SendTelemetryToSplunk("ExternalLink", record)
        });
        

        const { build }  = props;
        additionalConfigOptions.urlArgs = "bust=" + (runtimeEnvironment === 'develop' ? Date.now() : build);
        // the query in properties.js that fetches the props will fail if it has the bust=... param included.
        // so bust= ... is set after the props are retrieved (we don't have the build value until now anyway).
        require.config(additionalConfigOptions);

        window.translationLoaded = $.Deferred();
        let languageLoaded = $.Deferred();
        let splunkJSLoaded = $.Deferred();


        //build = props.entry[0].content.build
        //build = props.build
        //buildLoaded.resolve()

        $.when(languageLoaded, splunkJSLoaded).then(function(localizeStrings) {
            function runTranslation() {
                // console.log("TRANSLATE: Running Translation!", localizeStrings)
                let translatable = $("[data-translate-id]");
                for (let i = 0; i < translatable.length; i++) {
                    let id = $(translatable[i]).attr("data-translate-id");
                    // console.log("TRANSLATE: Working on " + id)
                    if (localizeStrings[id]) {
                        // console.log("TRANSLATE: For " + id + " got ", localizeStrings[id])
                        translatable[i].innerHTML = localizeStrings[id]
                    }

                }
                // console.log("TRANSLATE: Language Loading Complete", Date.now() - window.startTime)
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
        if (typeof localStorage[appName + "-i18n-" + window.localeString] != "undefined" && localStorage[appName + "-i18n-" + window.localeString] != "") {
            let langObject = JSON.parse(localStorage[appName + "-i18n-" + window.localeString])
            if (langObject['build'] == build) {
                languageLoaded.resolve(langObject)

                if (window.location.href.indexOf("127.0.0.1") >= 0 || window.location.href.indexOf("localhost") >= 0) { // only refresh in a dev env (or one without latency), otherwise it's not necessary as long as the build is the same.
                    // console.log("Found cache hit in localStorage", Date.now() - window.startTime)
                    $.ajax({
                        url: $C['SPLUNKD_PATH'] + '/services/pullJSON?config=htmlpanels&locale=' + window.localeString,
                        async: true,
                        success: function(localizeStrings) {
                            localizeStrings['build'] = build;
                            localStorage[appName + "-i18n-" + window.localeString] = JSON.stringify(localizeStrings)
                        }
                    });
                    $.ajax({
                        url: $C['SPLUNKD_PATH'] + '/services/pullJSON?config=sselabels&locale=' + window.localeString,
                        async: true,
                        success: function(localizeStrings) {
                            localStorage[appName + "-i18n-labels-" + window.localeString] = JSON.stringify(localizeStrings)
                        }
                    });

                }
            } else {
                // console.log("localStorage out of date, starting to grab file", Date.now() - window.startTime)
                $.ajax({
                    url: $C['SPLUNKD_PATH'] + '/services/pullJSON?config=htmlpanels&locale=' + window.localeString,
                    async: true,
                    success: function(localizeStrings) {
                        languageLoaded.resolve(localizeStrings)
                        localizeStrings['build'] = build;
                        localStorage[appName + "-i18n-" + window.localeString] = JSON.stringify(localizeStrings)
                    }
                });
                $.ajax({
                    url: $C['SPLUNKD_PATH'] + '/services/pullJSON?config=sselabels&locale=' + window.localeString,
                    async: true,
                    success: function(localizeStrings) {
                        localStorage[appName + "-i18n-labels-" + window.localeString] = JSON.stringify(localizeStrings)
                    }
                });
            }
        } else {
            // console.log("Not in localStorage, starting to grab file", Date.now() - window.startTime)
            $.ajax({
                url: $C['SPLUNKD_PATH'] + '/services/pullJSON?config=htmlpanels&locale=' + window.localeString,
                async: true,
                success: function(localizeStrings) {

                    languageLoaded.resolve(localizeStrings)
                    localizeStrings['build'] = build;
                    localStorage[appName + "-i18n-" + window.localeString] = JSON.stringify(localizeStrings)
                }
            });
            $.ajax({
                url: $C['SPLUNKD_PATH'] + '/services/pullJSON?config=sselabels&locale=' + window.localeString,
                async: true,
                success: function(localizeStrings) {
                    localStorage[appName + "-i18n-labels-" + window.localeString] = JSON.stringify(localizeStrings)
                }
            });
        }

        require(
            [
                'jquery',
                "splunkjs/ready!",

            ],
            function(
                $
            ) {
                // not resolving anything here...
                // console.log("SplunkJS Ready", Date.now() - window.startTime)
            })

        require(
            [
                'jquery',
                "splunkjs/mvc/simplexml/ready!",

            ],
            function(
                $
            ) {
                // console.log("SimpleXML Ready", Date.now() - window.startTime)
                splunkJSLoaded.resolve()
            })


    })

// This code is originally from setRequireConfig.es6 and is injected into runPageScript.es6 and every visualization.es6 file using @setRequireConfig.es6@

var requireConfigOptions = {
    paths: {
        // app-wide path shortcuts
        "components": appPath + "/components",
        "vendor": appPath + "/vendor",
        "Options": appPath + "/components/data/parameters/Options",

        // requirejs loader modules
        "text": appPath + "/vendor/text/text",
        "json": appPath + "/vendor/json/json",
        "css": appPath + "/vendor/require-css/css",

        // srcviewer shims
        "prettify": appPath + "/vendor/prettify/prettify",
        "showdown": appPath + "/vendor/showdown/showdown",
        "codeview": appPath + "/vendor/srcviewer/codeview",
        "jquery-ui": appPath + "/vendor/jquery-ui/jquery-ui",
    },
    config: {
        "Options": {
            // app-wide options
            "options": {
                "appName": 'Splunk_Security_Essentials',
                // the number of points that's considered "large" - how each plot handles this is up to it
                "plotPointThreshold": 1000,
                "maxSeriesThreshold": 1000,
                "smallLoaderScale": 0.4,
                "largeLoaderScale": 1,
                "defaultModelName": "default_model_name",
                "defaultRoleName": "default",
                "dashboardHistoryTablePageSize": 5
            }
        }
    }
};

require.config(requireConfigOptions);

// End of setRequireConfig.es6

// path to the script for the current page
var scriptPath = "components/pages/" + pageName;

var requireModules = ["jquery", "splunkjs/ready!", "components/controls/PreviousValueStore", "css!" + appPath + "/style/app", "css!" + appPath + "/style/" + pageName];

let exportEligiblePages = ["contents", "bookmarked_content", "custom_content", "home"];
if (exportEligiblePages.indexOf(pageName) >= 0) {
    requireModules.push("components/controls/export_panel")
}

// console.log("Page Name", pageName, pageName.indexOf("contents"))
let pagesWithJS = ["contents", "data_inventory", "data_inventory_alpha", "bookmarked_content",
                    "custom_content", "mitre_focused_content_recommendation", "rba_content_recommendation", "home", "sse_cim_compliance","showcase_security_content", "analytic_story_details"];
if (pagesWithJS.indexOf(pageName) >= 0) {
    requireModules.push('components/data/common_data_objects')
    requireModules.push('components/pages/' + pageName)
    requireModules.push(Splunk.util.make_full_url('/static/app/' + appName + '/data_source.js'))
    requireModules.push(Splunk.util.make_full_url('/static/app/' + appName + '/data_source_util.js'))
}

requireModules.push("components/controls/system_config")
requireModules.push(
    Splunk.util.make_full_url("/static/app/" + appName + "/indexed.js")
)

// To use openpgp

try{
    requireModules.push(
        Splunk.util.make_full_url("/static/app/" + appName + "/vendor/openpgp/openpgp.js")
    )
}
catch(error){
    console.log("Error in setting openpgp");
}


if (typeof localStorage[appName + '-PageViews'] == "undefined") {
    localStorage[appName + '-PageViews'] = 1
} else {
    localStorage[appName + '-PageViews'] = parseInt(localStorage[appName + '-PageViews']) + 1
}

if(pageName.indexOf("ES_Use_Case") >= 0 || pageName.indexOf("ESCU_Use_Case") >= 0 || pageName.indexOf("UBA_Use_Case") >= 0 || pageName.indexOf("PS_Use_Case") >= 0){

    requireModules.push(Splunk.util.make_full_url('/static/app/' + appName + '/es_use_case.js'))
    requireModules.splice(requireModules.indexOf("css!../app/Splunk_Security_Essentials/style/" + pageName), 1)
}

// additional config options and require modules for showcases. showcase_security_content has search directly in the Showcseinfo and no sample data so no need.
if (pageName.indexOf("showcase_") >= 0 && pageName!="showcase_security_content") {
    requireModules.push('components/controls/LangIcon')
    requireModules.push('components/data/sampleSearches/SampleSearchLoader', scriptPath);

    additionalConfigOptions.config['components/data/sampleSearches/SampleSearchLoader'] = {
        pageName: pageName
    };
}
if (pageName.indexOf("mitre_overview") >= 0 || pageName.indexOf("content_overview") >= 0 || pageName.indexOf("kill_chain_overview") >= 0) {
    requireModules.push('components/controls/LangIcon')
    requireModules.push("components/controls/system_config")
    requireModules.push("components/pages/analytics_advisor");
    requireModules.push(Splunk.util.make_full_url('/static/app/' + appName + '/components/splunk/Searches.js'));
    requireModules.push('css!' + Splunk.util.make_full_url('/static/app/' + appName + '/style/analytics_advisor.css'));
    requireModules.splice(requireModules.indexOf("css!../app/Splunk_Security_Essentials/style/" + pageName), 1)
}

if (pageName.indexOf("analytic_story_details") >= 0) {
    requireModules.push(Splunk.util.make_full_url('/static/app/' + appName + '/components/pages/analytic_story_details.js'));
    requireModules.push(Splunk.util.make_full_url('/static/app/' + appName + '/vendor/showdown/showdown.js'));
    requireModules.push(Splunk.util.make_full_url('/static/app/' + appName + '/vendor/jquery-ui/jquery-ui.js'));
    requireModules.push('css!' + Splunk.util.make_full_url('/static/app/' + appName + '/style/analytic_story_details.css'));
    requireModules.splice(requireModules.indexOf("css!../app/Splunk_Security_Essentials/style/" + pageName), 1);
} 
if (pageName.indexOf("ransomware_content_browser") >= 0) {
    requireModules.push('components/controls/LangIcon')
    requireModules.push("components/pages/ransomware_content_browser");
    requireModules.push('css!' + Splunk.util.make_full_url('/static/app/' + appName + '/style/ransomware_content_browser.css'));
    requireModules.splice(requireModules.indexOf("css!../app/Splunk_Security_Essentials/style/" + pageName), 1)
    requireModules.push("vendor/leader-line/leader-line.min");
}

if (pageName.indexOf("home") >= 0) {
    requireModules.push("vendor/leader-line/leader-line.min");
}

if(pageName.indexOf('data_source') >= 0){
    requireModules.push(Splunk.util.make_full_url('/static/app/' + appName + '/data_source.js'))
    requireModules.push(Splunk.util.make_full_url('/static/app/' + appName + '/data_source_util.js'))
    requireModules.push(Splunk.util.make_full_url('/static/app/' + appName + '/vendor/FileSaver/FileSaver.js'))
    requireModules.push(Splunk.util.make_full_url('/static/app/' + appName + '/components/splunk/Searches.js'))
    requireModules.push('css!' + Splunk.util.make_full_url('/static/app/' + appName + '/data_source.css'));
    requireModules.splice(requireModules.indexOf("css!../app/Splunk_Security_Essentials/" + pageName), 1)
}
if(pageName.indexOf('data_source_check') >= 0){
    requireModules.push(Splunk.util.make_full_url('/static/app/' + appName + '/components/splunk/Searches.js'))
}
if(pageName.indexOf('overview') >=0 || pageName.indexOf('data_inventory_overview') >= 0){
    requireModules.push('components/splunk/Searches')
}

if(pageName.indexOf('journey') >=0 || pageName.indexOf('sse_data_availability') >= 0){
    requireModules.push('components/splunk/Searches')
}

if(pageName.indexOf('mitre_benchmark') >=0){
    requireModules.push('components/splunk/Searches')
}

// console.log("ReallyAfter", requireModules)
// run page script
require(requireModules, function() {
    require(['splunkjs/mvc/simplexml/controller'/*, "components/controls/DependencyChecker"*/ /*, "components/data/parameters/RoleStorage"*/], function(DashboardController /*, DependencyChecker*/ /*, RoleStorage*/) {
        DashboardController.onReady(function() {
            DashboardController.onViewModelLoad(function() {

                //RoleStorage.updateMenu();
            });
        });
    });
});

