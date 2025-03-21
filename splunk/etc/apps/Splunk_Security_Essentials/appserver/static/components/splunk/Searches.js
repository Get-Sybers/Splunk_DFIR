"use strict";

// SplunkJS Searches
define(["splunkjs/mvc", "splunkjs/mvc/utils", "splunkjs/mvc/searchmanager", "components/splunk/Forms"], function (mvc, utils, SearchManager, Forms) {
    var defaultSearchAttributes = {
        "app": utils.getCurrentApp(),
        "auto_cancel": 90,
        "cache": false,
        "cancelOnUnload": true,
        "preview": true,
        "runWhenTimeIsUndefined": true,
        "status_buckets": 0,
        autostart: true,
        search: ''
    };

    var defaultSearchOptions = {
        "tokens": true,
        "tokenNamespace": "submitted"
    };

    var defaultSearchResultsOptions = {
        "count": 0,
        "output_mode": "json_rows"
    };

    function applyDefaults(object, defaultObject) {
        if (object == null) {
            return defaultObject;
        } else {
            Object.keys(defaultObject).forEach(function (key) {
                if (object[key] == null) object[key] = defaultObject[key];
            });

            return object;
        }
    }

    function runCallback(callback) {
        var argumentArray = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

        if (typeof callback === "function") {
            callback.apply(callback, argumentArray);
        }
    }

    function _getSearchResults(searchManager, options) {
        options = applyDefaults(options, defaultSearchResultsOptions);
        return searchManager.data("results", options);
    }

    function getSearchAttributes(attributes, searchManagerId) {
        attributes = applyDefaults(attributes, defaultSearchAttributes);
        attributes.id = searchManagerId;

        return attributes;
    }

    function log(searchManagerId, status) {
        var message = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];

        var paddedStatus = '';
        for (var i = 0; i < 9; i++) {
            // pad up to the longest possible status, "CANCELLED"
            if (status[i] != null) paddedStatus += status[i];else paddedStatus += ' ';
        }

        var resultsString = "[" + Date.now() + " SEARCH " + paddedStatus + " " + searchManagerId + "] " + message;

        if (status === 'ERROR' || status === 'FAILED') {
          //  console.error(resultsString);
        } else {
        //    console.info(resultsString);
        }
    }

    function searchErrorEventToString(searchErrorMessage, searchErrorObject) {
        var resultString = '';

        if (searchErrorObject != null) {
            if (searchErrorObject.data != null) {
                var messagesString = searchErrorMessagesToString(searchErrorObject.data.messages);

                if (searchErrorObject.error != null) {
                    resultString += searchErrorObject.error;
                    if (messagesString.length > 0) resultString += "[ " + messagesString + "]";
                }
            }
        }

        if (searchErrorMessage != null && testValidSearchErrorMessage(searchErrorMessage)) {
            if (resultString.length > 0) resultString = searchErrorMessage + " ( " + resultString + ")";
        }

        return resultString;
    }

    function searchErrorContentEventToString(searchErrorContentObject) {
        var messagesString = '';

        if (searchErrorContentObject != null && searchErrorContentObject.content != null) {
            messagesString += searchErrorMessagesToString(searchErrorContentObject.content.messages);
        }

        return messagesString;
    }

    /**
     * Converts one or more search error messages to a string.
     * @param {object[]} searchErrorMessages
     * @returns {string}
     */
    function searchErrorMessagesToString(searchErrorMessages) {
        var messagesSet = {};

        if (searchErrorMessages != null) {
            searchErrorMessages.forEach(function (message) {
                if (message.text != null && message.type != null) {
                    if (message.type === "FATAL" || message.type === "ERROR") {
                        messagesSet[message.text] = true;
                    }
                }
            });
        }

        return Object.keys(messagesSet).join("; ");
    }

    function testValidSearchErrorMessage(searchErrorMessage) {
        var invalidSearchErrorMessages = ["No search query provided.", "Search is waiting for input..."];

        return invalidSearchErrorMessages.indexOf(searchErrorMessage) < 0;
    }

    return {
        getSearchManager: function getSearchManager(searchManagerId) {
            return mvc.Components.getInstance(searchManagerId);
        },
        startSearch: function startSearch(searchManagerId) {
            var searchManager = this.getSearchManager(searchManagerId);
            if (searchManager != null) searchManager.startSearch();
        },
        cancelSearch: function cancelSearch(searchManagerId) {
            var searchManager = this.getSearchManager(searchManagerId);
            if (searchManager != null) searchManager.cancel();
        },
        /**
         * A utility function to get the search id that also papers over the Fluttershy->Galaxy API change
         * @param {object|string} searchManager Either a search manager or a search manager id
         * @returns {string} The search id
         */
        getSid: function getSid(searchManager) {
            if (typeof searchManager === 'string') searchManager = this.getSearchManager(searchManager);
            return typeof searchManager.getSid === 'function' ? searchManager.getSid() : searchManager.job.sid;
        },
        getResultCount: function getResultCount(searchManager) {
            var resultCount = null;

            if (searchManager && searchManager.job != null && searchManager.job.state != null) {
                var state = searchManager.job.state();

                if (state != null && state.content != null) {
                    resultCount = state.content.resultCount;
                }
            }

            return resultCount;
        },
        /**
         *
         * @param {string}   searchManagerId
         * @param {object}   options
         * @param {string|string[]} options.searchString
         * @param {boolean}         [options.autostart]
         * @param {string}          [options.targetJobIdTokenName]
         * @param {function}        [options.onCreateCallback]
         * @param {function}        [options.onStartCallback]
         * @param {function}        [options.onDoneCallback]
         * @param {function}        [options.onDataCallback]
         * @param {function}        [options.onErrorCallback]
         * @param {function}        [options.onCancelCallback]
         * @param {function}        [options.onFinallyCallback] Fired when the 'done', 'cancelled', 'error', or 'failed' events happen. Use this to clean up the search, regardless of how it ended,
         * @param {boolean}         [options.attributes]
         * @returns {*}
         */
        setSearch: function setSearch(searchManagerId, options) {
            var _this = this;

            var _log = function () {
                return function (status, message) {
                    log(searchManagerId, status, message);
                };
            }();

            var searchManager = mvc.Components.getInstance(searchManagerId);

            if (searchManager == null) {
                (function () {
                    var attributes = applyDefaults(options.attributes, {
                        search: Array.isArray(options.searchString) ? options.searchString.join(' ') : options.searchString,
                        autostart: options.autostart
                    });

                    var searchAttributes = getSearchAttributes(attributes, searchManagerId);

                    searchManager = new SearchManager(searchAttributes, defaultSearchOptions);

                    //_log("CREATED", "created search manager");

                    runCallback(options.onCreateCallback, [searchManager]);

                    searchManager.on("search:done", function (searchDoneObject) {
                        var sid = _this.getSid(searchManager);

                        //_log("DONE", "job id: " + sid);

                        var searchErrorContentString = searchErrorContentEventToString(searchDoneObject);

                        if (searchErrorContentString.length > 0) {
                            //_log("FAILED", searchErrorContentString);
                            runCallback(options.onErrorCallback, [searchErrorContentString]);
                        } else {
                            if (options.targetJobIdTokenName != null) {
                                Forms.setToken(options.targetJobIdTokenName, sid);
                            }

                            runCallback(options.onDoneCallback, [searchManager]);
                        }

                        runCallback(options.onFinallyCallback);
                    });

                    searchManager.on("search:error", function (searchErrorMessage, searchErrorObject) {
                        var searchErrorString = searchErrorEventToString(searchErrorMessage, searchErrorObject);

                        // there are search errors that get triggered without any details - don't take action on those
                        if (searchErrorString.length > 0) {
                            //_log("ERROR", searchErrorString);
                            runCallback(options.onErrorCallback, [searchErrorString]);
                            runCallback(options.onFinallyCallback);
                        }
                    });

                    searchManager.on("search:fail", function (searchFailObject) {
                        var searchErrorContentString = searchErrorContentEventToString(searchFailObject);

                        //_log("FAILED", searchErrorContentString);
                        runCallback(options.onErrorCallback, [searchErrorContentString]);
                        runCallback(options.onFinallyCallback);
                    });

                    searchManager.on("search:cancelled", function () {
                        //_log('CANCELLED');

                        runCallback(options.onCancelCallback);
                        runCallback(options.onFinallyCallback);
                    });

                    searchManager.on("search:start", function (searchStartObject) {
                        //_log("STARTED", searchStartObject.content.request.search);

                        if (options.targetJobIdTokenName != null) {
                            Forms.unsetToken(options.targetJobIdTokenName);
                        }

                        runCallback(options.onStartCallback, [searchStartObject]);
                    });

                    var searchResults = _getSearchResults(searchManager);

                    searchResults.on("data", function () {
                        var data = searchResults.data();

                        if (data != null) {
                            var fieldCount = data.fields != null ? data.fields.length : 0;
                            var rowCount = data.rows != null ? data.rows.length : 0;

                            //_log("RESULTS", fieldCount + " fields, " + rowCount + " rows");
                        } else {
                            //_log("RESULTS", "no results");
                        }

                        runCallback(options.onDataCallback, [data]);
                    });
                })();
            }

            return searchManager;
        },
        getSearchResults: function getSearchResults(searchManagerId) {
            return _getSearchResults(this.getSearchManager(searchManagerId));
        },
        /**
         * A utility function for setting multiple properties on a SearchBarView at once
         * @param {object} searchBarView
         * @param {string} query
         * @param {string} [earliestTime]
         * @param {string} [latestTime]
         */
        setSearchBarProperties: function setSearchBarProperties(searchBarView, query, earliestTime, latestTime) {
            // set this before searchBarView.val() because there are events watching searchBarView for changes but none watching searchBarView.timerange
            searchBarView.timerange.val({
                earliest_time: earliestTime != null ? earliestTime : '',
                latest_time: latestTime != null ? latestTime : ''
            });

            searchBarView.val(query);
        }
    };
});
