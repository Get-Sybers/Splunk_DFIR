'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(['@splunk/swc-sse/models/shared/Application', '@splunk/swc-sse/models/search/Report', 'splunkjs/mvc/sharedmodels', '@splunk/swc-sse/views/shared/alertcontrols/dialogs/saveas/Master'], function(AppModel, ReportModel, SharedModels, AlertDialog) {
    return function AlertModal() {
        var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        _classCallCheck(this, AlertModal);

        if (options.model == null) {
            options.model = {
                user: SharedModels.get('user'),
                serverInfo: SharedModels.get('serverInfo')
            };


            // we can't use the AppModel from SharedModels because it sets the "page" parameter to the current page
            // this is problematic because AlertDialog sets "request.ui_dispatch_view" to the "page" parameter
            // this in turn causes sets the Triggered Alert url to point back at the assistant, which can't load saved alert results
            // to combat this, we create our own AppModel and override its "page" parameter to always point at the search page, which can handle saved alert results
            var sharedAppModel = SharedModels.get('app');
            var myApp = sharedAppModel.get('app');

            $.ajax({
                type: "GET",
                url: $C['SPLUNKD_PATH'] + "/servicesNS/-/-/apps/local?count=0&output_mode=json",
                async: false,
                success: function(data, textStatus, xhr) {
                    // console.log("Deciding which app to use...", data)
                    for (var i = 0; i < data.entry.length; i++) {
                        if (data.entry[i].name == "SplunkEnterpriseSecuritySuite") {
                            // console.log("Deciding which app to use.. Found ES!")
                            myApp = data.entry[i].name
                        }
                    }
                }
            });

            options.model.application = new AppModel({
                owner: sharedAppModel.get('owner'),
                root: sharedAppModel.get('root'),
                locale: sharedAppModel.get('locale'),
                app: myApp,
                page: 'search'
            });
        }

        if (options.model.report == null) {
            options.model.report = new ReportModel();
            options.model.report.entry.content.set('search', options.searchString);
        }

        if (options.showSearch == null) options.showSearch = true;

        if (options.onHiddenRemove == null) options.onHiddenRemove = true;
        // window.dvtest_alertModalOptions = options;
        let myDialog = new AlertDialog(options);
        myDialog.$el.attr("id", "dv_alertModal")
        let counter = 0;
        let myInterval = setInterval(function(){
            // console.log("testing..", counter, $("#dv_alertModal:visible").length)
            if($("#dv_alertModal:visible").length>0){
                clearInterval(myInterval);
                return 0;
            }
            if(counter == 3){
                // console.log("Attempting to secondarily force the alertDialog visibility", myDialog.$el)
                myDialog.$el.removeClass("fade").css("display", "block").css("opacity", "1")
                // console.log("after Attempting to secondarily force the alertDialog visibility", myDialog.$el)
            }
            counter++;
        }, 100)
        // window.dvtest_alertDialog = myDialog
        return myDialog
    };
});