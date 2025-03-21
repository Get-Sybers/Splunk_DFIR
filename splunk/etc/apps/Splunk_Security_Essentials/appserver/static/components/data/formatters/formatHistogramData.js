"use strict";

define(["../types/Point", "../types/Points"], function (Point, Points) {
    return function (data, bucketFieldName, countFieldName) {
        var formattedData = {
            points: new Points(),
            minValue: null,
            maxValue: null
        };

        if (data.rows != null && data.fields != null) {
            (function () {
                var bucketFieldIndex = data.fields.indexOf(bucketFieldName);
                var countFieldIndex = data.fields.indexOf(countFieldName);

                if (bucketFieldIndex != null && countFieldIndex != null) {
                    data.rows.forEach(function (row) {
                        var bucket = parseFloat(row[bucketFieldIndex]);
                        var count = parseInt(row[countFieldIndex]);

                        formattedData.points.add(new Point(bucket, count));
                    });

                    formattedData.minValue = parseFloat(data.rows[0][bucketFieldIndex]);
                    formattedData.maxValue = parseFloat(data.rows[data.rows.length - 1][bucketFieldIndex]);
                }
            })();
        }

        return formattedData;
    };
});
