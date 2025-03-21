/**
 * all-purpose app-wide Options
 */
'use strict';

define(["module"], function (module) {
    var options = {};
    var config = module.config();

    if (config != null) {
        options = config.options;
    }

    return {
        getOptionByName: function getOptionByName(name) {
            var defaultValue = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

            var value = options != null ? options[name] : void 0;
            if (value == null) {
                value = defaultValue;
            }
            return value;
        }
    };
});
