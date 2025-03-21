'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define([], function () {
    var Series = function () {
        function Series() {
            _classCallCheck(this, Series);

            this.elementArray = [];
        }

        _createClass(Series, [{
            key: 'add',
            value: function add(element) {
                this.elementArray.push(element);
            }
        }, {
            key: 'get',
            value: function get(index) {
                return this.elementArray[index];
            }
        }, {
            key: 'toDataArray',
            value: function toDataArray() {
                var dataArray = [];
                this.elementArray.forEach(function (element) {
                    dataArray.push(element);
                });
                return dataArray;
            }
        }]);

        return Series;
    }();

    return Series;
});
