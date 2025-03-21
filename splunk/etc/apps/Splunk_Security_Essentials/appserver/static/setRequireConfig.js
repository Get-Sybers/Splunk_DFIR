"use strict";

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
        "showdown": appPath + "/vendor/showdown/showdown" //,
            //"codeview": appPath + "/vendor/srcviewer/codeview"
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