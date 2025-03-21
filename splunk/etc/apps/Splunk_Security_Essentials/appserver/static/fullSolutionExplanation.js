// This was built as an opportunity for PMM explanation, but PMM didn't have cycles to provide verbiage so commenting out

// 'use strict';

// // set the runtime environment, which controls cache busting
// var runtimeEnvironment = 'production';

// // set the build number, which is the same one being set in app.conf
// var build = '10148';

// // get app and page names
// var pathComponents = location.pathname.split('?')[0].split('/');
// var appName = 'Splunk_Security_Essentials';
// var pageIndex = pathComponents.indexOf(appName);
// var pageName = pathComponents[pageIndex + 1];

// // path to the root of the current app
// var appPath = "../app/" + appName;

// // This code is originally from setRequireConfig.es6 and is injected into runPageScript.es6 and every visualization.es6 file using @setRequireConfig.es6@

// var requireConfigOptions = {
//     paths: {
//         // app-wide path shortcuts
//         "components": appPath + "/components",
//         "vendor": appPath + "/vendor",
//         "Options": appPath + "/components/data/parameters/Options",

//         // requirejs loader modules
//         "text": appPath + "/vendor/text/text",
//         "json": appPath + "/vendor/json/json",
//         "css": appPath + "/vendor/require-css/css",

//         // jquery shims
//         "jquery-ui-slider": appPath + "/vendor/jquery-ui-slider/jquery-ui.min",

//         // highcharts shims
//         "highcharts-amd": appPath + "/vendor/highcharts/highcharts.amd",
//         "highcharts-more": appPath + "/vendor/highcharts/highcharts-more.amd",
//         "highcharts-downsample": appPath + "/vendor/highcharts/modules/highcharts-downsample.amd",
//         "no-data-to-display": appPath + "/vendor/highcharts/modules/no-data-to-display.amd",

//         // srcviewer shims
//         "prettify": appPath + "/vendor/prettify/prettify",
//         "showdown": appPath + "/vendor/showdown/showdown",
//         "codeview": appPath + "/vendor/srcviewer/codeview"
//     },
//     shim: {
//         "jquery-ui-slider": {
//             deps: ["css!" + appPath + "/vendor/jquery-ui-slider/jquery-ui.min.css"]
//         }
//     },
//     config: {
//         "Options": {
//             // app-wide options
//             "options": {
//                 "appName": 'Splunk_Security_Essentials',
//                 // the number of points that's considered "large" - how each plot handles this is up to it
//                 "plotPointThreshold": 1000,
//                 "maxSeriesThreshold": 1000,
//                 "smallLoaderScale": 0.4,
//                 "largeLoaderScale": 1,
//                 "highchartsValueDecimals": 2,
//                 "defaultModelName": "default_model_name",
//                 "defaultRoleName": "default",
//                 "dashboardHistoryTablePageSize": 5
//             }
//         }
//     }
// };

// require.config(requireConfigOptions);




// require(['jquery', 'splunkjs/mvc/simplexml/controller', 'app/Splunk_Security_Essentials/components/controls/Modal'], function($, DashboardController, Modal) {

//     var triggerModal = function(bodycontent) {
//         var myModal = new Modal('MyModalID-irrelevant-unless-you-want-many', {
//             title: 'Find Out More',
//             destroyOnHide: true,
//             type: 'wide'
//         });

//         $(myModal.$el).on("hide", function() {
//             // Not taking any action on hide, but you can if you want to!
//         })

//         myModal.body.addClass('mlts-modal-form-inline')
//             .append($(bodycontent));

//         myModal.footer.append($('<button>').addClass('mlts-modal-submit').attr({
//             type: 'button',
//             'data-dismiss': 'modal'
//         }).addClass('btn btn-primary mlts-modal-submit').text('Close').on('click', function() {
//             // Not taking any action on Close... but I could!        
//         }))
//         myModal.show(); // Launch it!
//     }
//     window.triggerModal = triggerModal



//     var myApps = ["Splunk_Security_Essentials"]

//     for (var i = 0; i < myApps.length; i++) {
//         myApp = myApps[i]
//         var data = []
//         $.ajax({ url: $C['SPLUNKD_PATH'] + '/services/SSEShowcaseInfo?locale=' + window.localeString, async: true, success: function(returneddata) { data = returneddata } });

//         for (summaryName in data.summaries) {
//             data.summaries[summaryName].app = myApp
//             if (typeof data.summaries[summaryName].category == "undefined") {
//                 switch (data.summaries[summaryName].app) {
//                     case "Splunk_Security_Essentials":
//                         data.summaries[summaryName].category = "UEBA"
//                         break;
//                     case "Splunk_Security_Essentials_for_Ransomware":
//                         data.summaries[summaryName].category = "Ransomware"
//                         break;
//                     case "Splunk-SE-Fraud-Detection":
//                         data.summaries[summaryName].category = "Fraud"
//                         break;
//                     default:
//                         var classicNameRegex = /Splunk_Security_Essentials_for_(.*)/;
//                         var match = classicNameRegex.exec(data.summaries[summaryName].app);
//                         if (match != null) {
//                             data.summaries[summaryName].category = match[1].replace(/[\-_]/g, " ")
//                             break;
//                         }
//                         var saNameRegex = /SA-SSE-(.*)/;
//                         var match = classicNameRegex.exec(data.summaries[summaryName].app);
//                         if (match != null) {
//                             data.summaries[summaryName].category = match[1].replace(/[\-_]/g, " ")
//                             break;
//                         }
//                         data.summaries[summaryName].category = "Other"
//                 }
//             }
//             if (typeof data.summaries[summaryName].domain == "undefined") {
//                 // Rules handling for legacy data dictionaries

//                 for (roleName in data.roles) {
//                     var isRole = false
//                     if (roleName != "All Examples") {
//                         for (var i = 0; i < data.roles[roleName].summaries.length; i++) {
//                             if (data.roles[roleName].summaries[i] == summaryName) {
//                                 isRole = roleName
//                             }
//                         }
//                     }
//                     if (isRole != false) {
//                         data.summaries[summaryName].domain = isRole.replace(" Domain", "") // Ransomware says the domain is "Endpoint Domain" instead of Endpoint
//                     }
//                 }
//             }
//         }
//         if (typeof window.ShowcaseInfoSources == "undefined") {
//             window.ShowcaseInfoSources = []
//         }
//         window.ShowcaseInfoSources.push(data)

//     }

//     for (var i = 0; i < window.ShowcaseInfoSources.length; i++) {
//         var data = window.ShowcaseInfoSources[i]
//         if (typeof window.ShowcaseInfo != "undefined") {
//             for (summaryName in data.summaries) {
//                 if (typeof window.ShowcaseInfo.summaries[summaryName] != "undefined" && window.ShowcaseInfo.summaries[summaryName].app != data.summaries[summaryName].app) {
//                     // console.log("************ERRROR********* Uh oh! We have overlap -- two different apps have the same summary name. This has to be resolved by the engineering teams.", window.ShowcaseInfo.summaries[summaryName].app, data.summaries[summaryName].app)
//                 } else if (typeof window.ShowcaseInfo.summaries[summaryName] != "undefined" && window.ShowcaseInfo.summaries[summaryName].app == data.summaries[summaryName].app) {
//                     // Just chill
//                 } else {
//                     window.ShowcaseInfo.summaries[summaryName] = data.summaries[summaryName]
//                     window.ShowcaseInfo.roles["default"].summaries.push(summaryName)
//                 }
//             }
//         } else {
//             window.ShowcaseInfo = data
//         }
//     }

//     // Special Treament for the Fraud App Special Implementation
//     var data = []
//     $.ajax({ url: Splunk.util.make_full_url('/static/app/Splunk-SE-Fraud-Detection/exampleInfo.json'), async: false, success: function(returneddata) { data = returneddata } });
//     for (var i = 0; i < data.length; i++) {
//         var example = data[i]
//         example.app = "Splunk-SE-Fraud-Detection"
//         example.category = "Fraud"
//         example.domain = "Fraud"
//         example.name = example.title // + " (" + example.category + ")"

//         example.description = example["short-description"]
//         example.dashboard = example.id
//         example.icon = Splunk.util.make_full_url("/static/app/Splunk-SE-Fraud-Detection/icons/" + example.id + ".png")
//         if (example.id != "about") {
//             window.ShowcaseInfo.summaries[example.id] = example
//             window.ShowcaseInfo.roles["default"].summaries.push(example.id)

//         }

//     }
//     window.ShowcaseInfo.roles.done = {}
//     window.ShowcaseInfo.roles.done.summaries = []



//     if (pageName.indexOf("showcase_") != 0) {
//         var summary = window.ShowcaseInfo.summaries[pageName]
//         if (typeof summary != "undefined" && typeof summary.fullSolution != "undefined") {
//             window.fullSolutionText = summary.fullSolution
//             var fullSolutionText = "<p><button class=\"btn\" onclick=\"triggerModal(window.fullSolutionText); return false;\">Find more Splunk content for this Use Case</button></p>"
//             if (document.getElementById("fieldset1") != null) {
//                 $("#fielset1").append(fullSolutionText)
//             } else {
//                 $(".dashboard-header-title").append(fullSolutionText)
//             }
//         }
//     }
// })
