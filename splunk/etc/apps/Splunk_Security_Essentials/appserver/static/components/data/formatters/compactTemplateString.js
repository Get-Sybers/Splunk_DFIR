'use strict';

/*
Compacts an es6 template string by converting all multiple whitespaces to one
 */

define([], function () {
    return function (strings) {
        var result = '';

        for (var i = 0; i < strings.length; i++) {
            result += strings[i].replace(/\s+/g, ' ');
            if (i < (arguments.length <= 1 ? 0 : arguments.length - 1)) {
                result += arguments.length <= i + 1 ? undefined : arguments[i + 1];
            }
        }

        return result;
    };
});
