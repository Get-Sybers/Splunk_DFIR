'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(['underscore', './Footer'], function (_, AssistantPanelFooter) {
    return (
        /**
         *
         * @param {element}        panel
         * @param {string}         titleText
         * @param {object}         [viz] A built-in Splunk visualization or a ModViz
         * @param {object}         [vizOptions] Arguments to be passed to the visualization
         * @param {object}         [options]
         * @param {object|boolean} [options.panelWrapper] Either a jQuery reference to the panel body, or "false" to use the panel itself
         * @param {object|boolean} [options.footerButtons]
         * @returns {object}
         */
        function AssistantPanel(panel, titleText, viz, vizOptions) {
            var options = arguments.length <= 4 || arguments[4] === undefined ? {} : arguments[4];

            _classCallCheck(this, AssistantPanel);

            var panelElements = {
                title: $('<h3>').addClass('mlts-panel-title').html(titleText),
                body: $('<div>').addClass('mlts-panel-body')
            };

            var panelWrapper = options.panelWrapper === false ? panel : options.panelWrapper || panel.find('.panel-body');

            panelWrapper.append(panelElements.title, panelElements.body);

            if (viz != null) {
                if (vizOptions.height == null) {
                    var panelHeight = panelElements.body.height();
                    if (panelHeight > 0) vizOptions.height = panelHeight;
                }

                panelElements.viz = new viz(_.extend({ el: panelElements.body }, vizOptions)).render();
            }

            var footer = new AssistantPanelFooter(panel, options.footerButtons);
            
            return _.extend(panelElements, footer);
        }
    );
});
