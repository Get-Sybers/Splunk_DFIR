'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define([], function () {
    var Point = function () {
        function Point(x, y, originalX, originalY) {
            var originalIndex = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];

            _classCallCheck(this, Point);

            this.x = !isNaN(x) ? x : null;
            this.y = !isNaN(y) ? y : null;
            this.originalX = originalX;
            this.originalY = originalY;
            this.originalIndex = originalIndex;
        }

        _createClass(Point, [{
            key: 'toDataArray',
            value: function toDataArray() {
                return [this.x, this.y];
            }
        }, {
            key: 'getOriginalIndex',
            value: function getOriginalIndex() {
                return this.originalIndex;
            }
        }]);

        return Point;
    }();

    return Point;
});
