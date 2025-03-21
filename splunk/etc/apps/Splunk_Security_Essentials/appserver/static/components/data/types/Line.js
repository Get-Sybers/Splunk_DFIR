'use strict';
//abandoned?

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define([], function () {
    var Line = function () {
        function Line(startPoint, endPoint) {
            _classCallCheck(this, Line);

            this.startPoint = startPoint;
            this.endPoint = endPoint;
        }

        _createClass(Line, [{
            key: 'toDataArray',
            value: function toDataArray() {
                return [this.startPoint.toDataArray(), this.endPoint.toDataArray()];
            }
        }]);

        return Line;
    }();

    return Line;
});
