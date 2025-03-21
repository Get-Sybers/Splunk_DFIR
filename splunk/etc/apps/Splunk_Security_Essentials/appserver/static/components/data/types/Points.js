'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define([], function () {
    var Points = function () {
        /**
         *
         * @param {string} label
         * @param {number} [priority] Determines how important this series is (higher priority is better; ex. the z-index of this series on a graph)
         */
        function Points(label) {
            var priority = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

            _classCallCheck(this, Points);

            this.label = label;
            this.priority = priority;
            this.pointArray = [];
            this.maxValue = null;
            this.minValue = null;
        }

        _createClass(Points, [{
            key: 'add',
            value: function add(point) {
                this.pointArray.push(point);
            }
        }, {
            key: 'get',
            value: function get(index) {
                return this.pointArray[index];
            }
        }, {
            key: 'getAll',
            value: function getAll() {
                return this.pointArray.slice();
            }
        }, {
            key: 'getLabel',
            value: function getLabel() {
                return this.label;
            }
        }, {
            key: 'calculateMinMaxValue',
            value: function calculateMinMaxValue() {
                var dataArray = this.toDataArray();
                var minValue = null,
                    maxValue = null;
                dataArray.forEach(function (point) {
                    var min = Math.min(point[0], point[1]);
                    var max = Math.max(point[0], point[1]);
                    if (minValue == null || minValue > min) minValue = min;
                    if (maxValue == null || maxValue < max) maxValue = max;
                });

                return [minValue, maxValue];
            }
        }, {
            key: 'toDataArray',
            value: function toDataArray() {
                var dataArray = [];
                this.pointArray.forEach(function (point) {
                    dataArray.push(point.toDataArray());
                });
                return dataArray;
            }
        }]);

        return Points;
    }();

    return Points;
});
