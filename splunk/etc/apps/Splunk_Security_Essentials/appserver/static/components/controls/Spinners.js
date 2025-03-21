'use strict';

// jQuery loader utility class
define(['Options', 'vendor/spin/spin.min'], function (Options, Spinner) {
    var largeLoaderScale = Options.getOptionByName('largeLoaderScale');
    var noIdErrorString = 'Element passed to showLoadingOverlay() must have an id';

    return {
        panelLoaderTimeouts: {},
        showLoadingOverlay: function showLoadingOverlay() {
            var _this = this;

            var panelIds = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
            var scale = arguments.length <= 1 || arguments[1] === undefined ? largeLoaderScale : arguments[1];

            if (!Array.isArray(panelIds)) panelIds = [panelIds];

            panelIds.forEach(function (panelId) {
                // allows a panel id without a # prefix to work
                if (typeof panelId === 'string' && panelId[0] !== '#') panelId = '#' + panelId;

                var panel$El = $(panelId);
                panelId = panel$El.attr('id');

                if (panel$El != null && panelId != null) {
                    if (_this.panelLoaderTimeouts[panelId] !== undefined) {
                        clearTimeout(_this.panelLoaderTimeouts[panelId]);
                        delete _this.panelLoaderTimeouts[panelId];
                    } else {
                        var spinner = new Spinner({
                            scale: scale
                        }).spin();

                        panel$El.append(spinner.el);
                    }
                } else {
              //      console.error(noIdErrorString);
                }
            });
        },
        hideLoadingOverlay: function hideLoadingOverlay(panelIds) {
            var _this2 = this;

            if (!Array.isArray(panelIds)) panelIds = [panelIds];

            panelIds.forEach(function (panelId) {
                // allows a panel id without a # prefix to work
                if (typeof panelId === 'string' && panelId[0] !== '#') panelId = '#' + panelId;

                var panel$El = $(panelId);
                panelId = panel$El.attr('id');

                if (panel$El != null && panelId != null) {
                    clearTimeout(_this2.panelLoaderTimeouts[panelId]);

                    // prevents flicker as loading spinner is shown-hidden in quick succession
                    _this2.panelLoaderTimeouts[panelId] = setTimeout(function (panel$El, panelId) {
                        if (panel$El != null) panel$El.children('.spinner').remove();

                        delete this.panelLoaderTimeouts[panelId];
                    }.bind(_this2, panel$El, panelId), 250); // bind is a workaround for IE9 setTimeout not accepting additional arguments
                } else {
              //      console.error(noIdErrorString);
                }
            });
        }
    };
});
