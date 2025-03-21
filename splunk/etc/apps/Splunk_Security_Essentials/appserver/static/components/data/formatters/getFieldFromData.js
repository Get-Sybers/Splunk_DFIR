"use strict";

// get field from data
define(function () {
    return function (data, fieldName) {
        var results = [];

        if (data.rows != null && data.fields != null) {
            (function () {
                var fieldIndex = data.fields.indexOf(fieldName);

                if (fieldIndex >= 0) {
                    data.rows.forEach(function (row) {
                        if (row[fieldIndex] != null) {
                            results.push(row[fieldIndex]);
                        }
                    });
                }
            })();
        }

        return results;
    };
});
