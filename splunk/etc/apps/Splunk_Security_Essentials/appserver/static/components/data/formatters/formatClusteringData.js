(function() {
  define(function(require, exports, module) {
    var Point, Points, formatClusteringData;
    Point = require("../types/Point");
    Points = require("../types/Points");
    return formatClusteringData = function(data, classFieldName, xAxisFieldName, yAxisFieldName) {
      var classFieldIndex, classLabel, classLabelToPoints, field, fieldIndex, fields, i, j, len, len1, max, maxDataValue, min, minDataValue, point, points, results, row, rows, xAxisFieldIndex, xValue, yAxisFieldIndex, yValue;
      rows = data.rows;
      fields = data.fields;
      if ((rows == null) || (fields == null)) {
        return;
      }
      fieldIndex = 0;
      for (i = 0, len = fields.length; i < len; i++) {
        field = fields[i];
        if (field === classFieldName) {
          classFieldIndex = fieldIndex;
        }
        if (field === xAxisFieldName) {
          xAxisFieldIndex = fieldIndex;
        }
        if (field === yAxisFieldName) {
          yAxisFieldIndex = fieldIndex;
        }
        fieldIndex = fieldIndex + 1;
      }
      classLabelToPoints = {};
      for (j = 0, len1 = rows.length; j < len1; j++) {
        row = rows[j];
        xValue = parseFloat(row[xAxisFieldIndex]);
        yValue = parseFloat(row[yAxisFieldIndex]);
        if (!isNaN(xValue) && !isNaN(yValue)) {
          point = new Point(xValue, yValue);
          classLabel = row[classFieldIndex];
          points = classLabelToPoints[classLabel];
          if (points == null) {
            points = new Points();
            classLabelToPoints[classLabel] = points;
          }
          points.add(point);
          min = Math.min(xValue, yValue);
          max = Math.max(xValue, yValue);
          if ((typeof minDataValue === "undefined" || minDataValue === null) || minDataValue > min) {
            minDataValue = min;
          }
          if ((typeof maxDataValue === "undefined" || maxDataValue === null) || maxDataValue < max) {
            maxDataValue = max;
          }
        }
      }
      results = [];
      for (classLabel in classLabelToPoints) {
        points = classLabelToPoints[classLabel];
        results.push(points);
      }
      return results;
    };
  });

}).call(this);
