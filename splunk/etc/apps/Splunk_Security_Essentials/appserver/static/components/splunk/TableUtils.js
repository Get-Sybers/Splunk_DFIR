'use strict';

define([], function () {
    return {
        /**
         * When using a custom cell renderer, Splunk's normal classes don't get applied; This is a utility to translate from column type to the correct class name.
         * @param {string} columnType
         * @returns {string}
         */
        columnTypeToClassName: function columnTypeToClassName(columnType) {
            if (columnType === 'number') {
                return 'numeric';
            } else if (columnType === 'timestamp') {
                return 'timestamp';
            } else {
                return 'string';
            }
        }
    };
});
