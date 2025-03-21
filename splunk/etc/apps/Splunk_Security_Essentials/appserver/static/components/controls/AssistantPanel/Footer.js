'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define([], function () {
    return (
        /**
         *
         * @param {element}         panel
         * @param {object|boolean} [footerButtons={}]                        If false, hide footer buttons; can also be an object to control individual buttons
         * @param {boolean}        [footerButtons.openInSearchButton=true]   If false, hide this button
         * @param {boolean}        [footerButtons.showSPLButton=true]        If false, hide this button
         * @param {boolean}        [footerButtons.scheduleAlertButton=false] If false, hide this button
         * @returns {{footer: (*|jQuery)}}
         */
        function AssistantPanelFooter(panel) {
            var footerButtons = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            _classCallCheck(this, AssistantPanelFooter);

            var panelElements = {
                footer: $('<div>').addClass('mlts-panel-footer')
            };

            panel.find('.panel-body').append(panelElements.footer);
            
            let _ = require("underscore")

            if (footerButtons !== false) {
                if (footerButtons.openInSearchButton !== false) {
                    panelElements.openInSearchButton = $('<button>').addClass('btn btn-secondary').text(_('Open in Search').t() );
                }

                if (footerButtons.showSPLButton !== false) {
                    panelElements.showSPLButton = $('<button>').addClass('btn btn-secondary mlts-show-spl').text(_('Line-by-Line SPL Documentation').t());
                }

                if (footerButtons.scheduleAlertButton === true) {
                    panelElements.scheduleAlertButton = $('<button>').addClass('btn btn-secondary schedule-alert-button').text(_('Save Scheduled Search').t());
                }

                if (footerButtons.scheduleHighCardinalityAlertButton === true) {
                    panelElements.scheduleHighCardinalityAlertButton = $('<button>').addClass('btn btn-secondary').text(_('Schedule High Cardinality Alert').t());
                }

                panelElements.footer.append(panelElements.openInSearchButton, panelElements.showSPLButton, panelElements.scheduleAlertButton, panelElements.scheduleHighCardinalityAlertButton);
            }

            return panelElements;
        }
    );
});
