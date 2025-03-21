'use strict';

define(['util/time', 'components/data/formatters/getFieldFromData', 'components/data/types/Point', 'components/data/types/Points'], function (time, getFieldFromData, Point, Points) {
    /**
     *
     * @param {object}   data
     * @param {string[]} data.fields
     * @param {Array}    data.rows
     * @returns {{type: string, seriesList: (Array|*)}}
     */
    function formatLinesData(data) {
        // make a list of the indexes in the fields array that correspond to internal fields (those that don't start with _)
        var externalFields = data.fields.reduce(function (indexList, field, index) {
            // additionally, exclude the first field (this becomes the x-axis if it's a _time field)
            if (index > 0 && field.length > 0 && field[0] !== '_') {
                indexList.push({
                    label: field,
                    index: index
                });
            }
            return indexList;
        }, []);

        var sortByField = getFieldFromData(data, '_sortBy')[0];

        var formattedData = {
            type: 'linear',
            seriesList: externalFields.map(function (field) {
                return new Points(field.label, field.label === sortByField ? 1 : 0);
            })
        };

        // behave the same as Splunk where we expect the _time to be the first field if it exists at all
        var timeIndex = data.fields[0] === '_time' ? 0 : -1;

        // holds an array of parsed dates from the _time column of the data, if applicable
        var parsedDates = [];

        if (timeIndex > -1) {
            // check that every timestamp in the _time field is in ascending order
            var hasTimestamps = data.rows.every(function (row, index) {
                var hasTimestamp = false;

                var currentPoint = row[timeIndex];
                // using Splunk's time utils to show dates in server time instead of local time
                var currentDate = time.isoToDateObject(currentPoint).valueOf();

                if (currentPoint != null && !isNaN(currentDate) && (index === 0 || parsedDates[index - 1] < currentDate)) {
                    parsedDates[index] = currentDate;
                    hasTimestamp = true;
                }

                return hasTimestamp;
            });

            if (hasTimestamps) formattedData.type = 'datetime';
        }

        data.rows.forEach(function (row, rowIndex) {
            externalFields.forEach(function (field, index) {
                var xValue = formattedData.type === 'datetime' ? parsedDates[rowIndex] : rowIndex;
                var yValue = row[field.index];

                formattedData.seriesList[index].add(new Point(xValue, parseFloat(yValue), null, yValue));
            });
        });

        return formattedData;
    }

    return formatLinesData;
});
