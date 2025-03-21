"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

// format scatter line with slope = 1 reference line for plotting, return an array of Points class
define(["../types/Point", "../types/Points"], function (Point, Points) {
    return function (data, xAxisFieldName, yAxisFieldName, classFieldName) {
        if (data.rows != null && data.fields != null) {
            var _ret = function () {
                var classFieldIndex = classFieldName != null ? data.fields.indexOf(classFieldName) : -1;
                var xAxisFieldIndex = data.fields.indexOf(xAxisFieldName);
                var yAxisFieldIndex = data.fields.indexOf(yAxisFieldName);

                var classLabelToPoints = {};
                var pointsArray = [];
                var minValue = null,
                    maxValue = null,
                    curMinValue = null,
                    curMaxValue = null;

                var points = new Points();

                data.rows.forEach(function (row, index) {
                    var xValue = parseFloat(row[xAxisFieldIndex]);
                    var yValue = parseFloat(row[yAxisFieldIndex]);

                    if (!isNaN(xValue) && !isNaN(yValue)) {
                        var point = new Point(xValue, yValue, row[xAxisFieldIndex], row[yAxisFieldIndex], index);
                        if (classFieldName != null) {
                            // labeled data
                            var classLabel = row[classFieldIndex];
                            points = classLabelToPoints[classLabel];

                            if (points == null) {
                                points = new Points(classLabel);
                                classLabelToPoints[classLabel] = points;
                            }
                        }
                        points.add(point);
                    }
                });

                if (classFieldName == null) {
                    var _points$calculateMinM = points.calculateMinMaxValue();

                    var _points$calculateMinM2 = _slicedToArray(_points$calculateMinM, 2);

                    minValue = _points$calculateMinM2[0];
                    maxValue = _points$calculateMinM2[1];

                    pointsArray = [points];
                } else {
                    pointsArray = Object.keys(classLabelToPoints).map(function (key) {
                        var _classLabelToPoints$k = classLabelToPoints[key].calculateMinMaxValue();

                        var _classLabelToPoints$k2 = _slicedToArray(_classLabelToPoints$k, 2);

                        curMinValue = _classLabelToPoints$k2[0];
                        curMaxValue = _classLabelToPoints$k2[1];

                        if (minValue == null || minValue > curMinValue) minValue = curMinValue;
                        if (maxValue == null || maxValue < curMaxValue) maxValue = curMaxValue;
                        return classLabelToPoints[key];
                    });
                }
                return {
                    v: {
                        pointsArray: pointsArray,
                        minValue: minValue,
                        maxValue: maxValue
                    }
                };
            }();

            if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
        }
    };
});
