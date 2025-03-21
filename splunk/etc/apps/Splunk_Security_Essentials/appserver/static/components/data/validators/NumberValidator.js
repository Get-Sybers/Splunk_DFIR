'use strict';

define([], function () {
    return {
        /**
         * @param {string|number} value
         * @param {object}        [options]
         * @param {number}        [options.min]
         * @param {number}        [options.max]
         * @param {boolean}       [options.allowFloats = true]
         */
        validate: function validate(value) {
            var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            var parsedValue = null;
            var isNumber = false;

            if (typeof value === 'number') {
                parsedValue = value;

                // if floats allowed or number is not a float
                isNumber = options.allowFloats !== false || value % 1 === 0;
            } else {
                parsedValue = options.allowFloats !== false ? parseFloat(value) : parseInt(value, 10);

                isNumber = parsedValue.toString() === value;
            }

            return isNumber && (options.min == null || parsedValue >= options.min) && (options.max == null || parsedValue <= options.max);
        }
    };
});
