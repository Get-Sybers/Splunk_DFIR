/**
 ColorPalette from main Splunk color palette at
 js_charting/components/ColorPalette.js
 */
'use strict';

define([], function () {
    var colorPalette = ['#1e93c6', // light blue
    '#f2b827', // light orange
    '#d6563c', // red
    '#6a5c9e', '#31a35f', '#ed8440', '#3863a0', '#a2cc3e', // light green
    '#cc5068', '#73427f', '#11a88b', '#ea9600', // dark orange
    '#0e776d', '#ffb380', '#aa3977', '#91af27', // green
    '#4453aa', '#99712b', '#553577', '#97bc71', '#d35c2d', '#314d5b', '#99962b', '#844539', '#00b290', '#e2c188', // medium orange
    '#a34a41', '#44416d', '#e29847', '#8c8910', '#0b416d', '#774772', '#3d9988', '#bdbd5e', '#5f7396', // dark blue
    '#844539', '#AAAAAA', '#ffffff'];

    function RGBToHex(r, g, b) {
        var bin = r << 16 | g << 8 | b;
        return function (h) {
            return new Array(7 - h.length).join("0") + h;
        }(bin.toString(16).toUpperCase());
    }

    function hexToRGB(hex) {
        hex = hex.replace(/[^0-9A-F]/gi, '');
        hex = parseInt(hex, 16);

        var r = hex >> 16;
        var g = hex >> 8 & 0xFF;
        var b = hex & 0xFF;
        return [r, g, b];
    }

    return {
        getColors: function getColors() {
            return colorPalette;
        },
        getColorByIndex: function getColorByIndex(colorIndex, asRGB) {
            var color = colorPalette[colorIndex];

            if (asRGB) color = hexToRGB(color);

            return color;
        },
        getGradientColor: function getGradientColor(startingColorIndex, endingColorIndex, weight) {
            var color1 = this.getColorByIndex(startingColorIndex, true);
            var color2 = this.getColorByIndex(endingColorIndex, true);

            var w1 = 1 - weight;
            var w2 = weight;

            var rgb = [Math.round(color1[0] * w1 + color2[0] * w2), Math.round(color1[1] * w1 + color2[1] * w2), Math.round(color1[2] * w1 + color2[2] * w2)];

            return '#' + RGBToHex.apply(this, rgb);
        }
    };
});
