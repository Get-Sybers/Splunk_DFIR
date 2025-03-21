'use strict';

/*
A version checker resembling Python's LooseVersion, customized for our specific needs.
Splits on periods and groups of alphabetic characters (ie., 0.95pre1 becomes [0,95,pre,1])
Compares the version parts alphabetically or numerically, as appropriate; different types are compares as number > null > string.
 */

define([], function () {
    var typeWeight = {
        'string': 0,
        'undefined': 1,
        'number': 2
    };

    function splitVersion(version) {
        return version.split(/(\d+|[a-z]+|\.)/).filter(function (part) {
            return part.length > 0 && part !== '.';
        });
    }

    function getType(value) {
        if (value == null) return 'undefined';else if (!isNaN(value)) return 'number';else return 'string';
    }

    return {
        /**
         * @param {string} version1
         * @param {string} version2
         * @returns {number} The results of the comparison following standard JS convention (-1 if v1 < v2, 1 if v1 > v2, 0 if v1=v2)
         */
        compareVersions: function compareVersions(version1, version2) {
            var splitVersion1 = splitVersion(version1);
            var splitVersion2 = splitVersion(version2);

            var length = Math.max(splitVersion1.length, splitVersion2.length);

            var equality = 0;

            for (var i = 0; i < length; i++) {
                if (splitVersion1[i] !== splitVersion2[i]) {
                    var type1 = getType(splitVersion1[i]);
                    var type2 = getType(splitVersion2[i]);

                    // if types unequal, number > undefined > string
                    if (type1 !== type2) {
                        equality = typeWeight[type1] < typeWeight[type2] ? -1 : 1;
                    }
                    // if both numbers, compare numerically
                    else if (type1 === 'number') {
                            equality = parseInt(splitVersion1[i], 10) < parseInt(splitVersion2[i], 10) ? -1 : 1;
                        }
                        // if both strings, compare lexically
                        else if (type1 === 'string') {
                                equality = splitVersion1[i] < splitVersion2[i] ? -1 : 1;
                            }

                    break;
                }
            }

            return equality;
        }
    };
});
