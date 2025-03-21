'use strict';

define([], function () {
    /**
     * A utility for describing common Highcharts legend layouts with a single setting
     * @param {string} legendAlign Can be "top", "bottom", "left", or "right"
     */
    function simpleLegendAlign(legendAlign) {
        var legendOptions = {};

        if (legendAlign != null) {
            if (legendAlign === 'left' || legendAlign === 'right') {
                legendOptions.align = legendAlign;
                legendOptions.verticalAlign = 'middle';
                legendOptions.layout = 'vertical';
            } else if (legendAlign === 'top' || legendAlign === 'bottom') {
                legendOptions.align = 'center';
                legendOptions.verticalAlign = legendAlign;
                legendOptions.layout = 'horizontal';
            }
        }

        return legendOptions;
    }

    return simpleLegendAlign;
});
