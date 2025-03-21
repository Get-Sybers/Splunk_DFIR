'use strict';

define(['json!' + $C['SPLUNKD_PATH'] + '/services/SSEShowcaseInfo?fields=mini&locale=' + window.localeString, 'splunkjs/mvc/simplexml/controller', 'Options'], function(ShowcaseInfo, DashboardController, Options) {
    var roleKey = 'sse-role';
    if (typeof localStorage['mlts-role'] == "string" && localStorage['mlts-role'] == "undefined") {
        localStorage['mlts-role'] = "default"
            // Apparently SSE was breaking the Machine Learning Toolkit because it couldn't handle an undefined role. So we're now checking and resetting to default if that's the case.
    }

    return {
        getRole: function getRole() {
            var roleName = localStorage.getItem(roleKey);
            // make sure we return the default role if it hasn't been defined in localStorage yet
            // for example, because the user went direct to a dashboard and has never loaded the contents.js since roles were implemented
            if (roleName == null) roleName = Options.getOptionByName('defaultRoleName');
            return roleName;
        },
        setRole: function setRole(role) {
            if (role != null) {
                localStorage.setItem(roleKey, role);
            } else {
                localStorage.deleteItem(roleKey);
            }
            return this.updateMenu();
        },
        updateMenu: function updateMenu() {
            var menuItemSelector = 'a[href*=' + '"' + DashboardController.model.app.get('app') + '/security_content"' + ']';
            var menuItemText = '';

            var role = this.getRole();
            var roleDetails = ShowcaseInfo.roles[role];

            // console.log("Got our Role Storage", role, roleDetails, ShowcaseInfo)

            menuItemText = 'Security Content';
            $(menuItemSelector).text(menuItemText).attr('title', menuItemText);
        }
    };
});