'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

// Drilldown Linker
define(['splunkjs/mvc', 'components/splunk/Forms', 'components/splunk/Searches'], function (mvc, Forms, Searches) {
    function makeQueryArgument(parameterName, parameterValue) {
        var parameterValueIsTokenTemplate = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

        if (parameterValue != null) {
            if (parameterValueIsTokenTemplate) parameterValue = Forms.parseTemplate(parameterValue);

            return encodeURIComponent(parameterName) + "=" + encodeURIComponent(parameterValue);
        }
    }

    function getUrl(target, search, extraParams) {
        var searchUrl = '';
        var searchString = search;
        var earliestTime = null;
        var latestTime = null;

        if (Array.isArray(search)) {
            searchString = search.join(' ');
        } else if ((typeof search === 'undefined' ? 'undefined' : _typeof(search)) === "object") {
            if (search.attributes != null) search = search.attributes;

            searchString = search.searchString || search.search || search.q;
            earliestTime = search.earliestTime || search.earliest_time || search.earliest;
            latestTime = search.latestTime || search.latest_time || search.latest;
        }

        var searchArgument = makeQueryArgument("q", searchString, true);

        if (searchArgument != null) {
            (function () {
                var queryArguments = [searchArgument];

                var earliestTimeArgument = makeQueryArgument("earliest", earliestTime);
                if (earliestTimeArgument != null) queryArguments.push(earliestTimeArgument);

                var latestTimeArgument = makeQueryArgument("latest", latestTime);
                if (latestTimeArgument != null) queryArguments.push(latestTimeArgument);

                if (extraParams != null) {
                    Object.keys(extraParams).forEach(function (paramName) {
                        var extraArgument = makeQueryArgument(paramName, extraParams[paramName]);
                        queryArguments.push(extraArgument);
                    });
                }

                searchUrl = target + '?' + queryArguments.join('&');
            })();
        }

        return searchUrl;
    }

    function createLink$El(linkHtml, target, search, extraParams) {
        return $("<a/>").addClass('external drilldown-link').attr("target", "_blank").html(linkHtml).attr("href", getUrl(target, search, extraParams));
    }

    function setDrilldownLink($el, target, search, extraParams) {
        var link$El = createLink$El($el.html(), target, search, extraParams);
        $el.empty().append(link$El);
    }

    /**
     * Removes a drilldown link and injects the contents of the drilldown link back into its parent element.
     * @param {element} $el
     */
    function removeDrilldownLink($el) {
        var drilldownLink$El = $el.children('a.drilldown-link');
        var drilldownLinkContents = drilldownLink$El.contents();

        drilldownLink$El.remove();

        $el.append(drilldownLinkContents);
    }

    /**
     * Builds an options object that tells Splunk which visualization to load
     * @param {object}  vizOptions
     * @param {string}  vizOptions.category The visualization category - charting, custom, etc.
     * @param {string}  [vizOptions.type]   The visualization type - line, area, <App>.<Viz> for ModViz, etc.
     * @returns {object}
     */
    function parseVizOptions(vizOptions) {
        var parsedVizOptions = {};

        if (vizOptions != null) {
            parsedVizOptions['display.page.search.tab'] = 'visualizations';
            parsedVizOptions['display.general.type'] = 'visualizations';
            parsedVizOptions['display.visualizations.type'] = vizOptions.category;

            if (vizOptions.type != null) {
                // Splunk's charting vizes use a different namespace from every other type of viz for some reason so we account for that here
                var customVizKey = vizOptions.category === 'charting' ? 'chart' : 'type';
                parsedVizOptions['display.visualizations.' + vizOptions.category + '.' + customVizKey] = vizOptions.type;
            }
        }

        return parsedVizOptions;
    }

    function parseAssistantOptions(assistantName, assistantOptions) {
        var parsedAssistantOptions = {};

        Object.keys(assistantOptions).forEach(function (key) {
            parsedAssistantOptions['ml_toolkit.assistant.' + assistantName + '.' + key] = assistantOptions[key];
        });

        return parsedAssistantOptions;
    }

    return {
        /**
         * Sets a drilldown query string on an element.
         * @param {element}                drilldownLinkContainer$El The jQuery-wrapped element to set the link on
         * @param {string}                 target                    The drilldown link target - either "search" for the search page or an assistant name
         * @param {string|string[]|object} search                    Either a search query (as either a string or an array) or a Splunk search object
         * @param {object}                 [extraParams]
         */
        setDrilldown: function setDrilldown(drilldownLinkContainer$El, target, search, extraParams) {
            if (drilldownLinkContainer$El != null) {
                removeDrilldownLink(drilldownLinkContainer$El);
                setDrilldownLink(drilldownLinkContainer$El, target, search, extraParams);
            }
        },
        setSearchDrilldown: function setSearchDrilldown(drilldownLinkContainer$El, search, extraParams) {
            this.setDrilldown(drilldownLinkContainer$El, 'search', search, extraParams);
        },
        getUrl: getUrl,
        /**
         * Builds a set of search parameters.
         * @param {string|string[]} searchString
         * @param {object}          [parameters]
         * @returns {object}
         */
        createSearch: function createSearch(searchString, parameters) {
            var search = {
                searchString: Array.isArray(searchString) ? searchString.join(' ') : searchString
            };

            if (parameters != null) {
                Object.keys(parameters).forEach(function (parameterName) {
                    search[parameterName] = parameters[parameterName];
                });
            }

            return search;
        },
        parseVizOptions: parseVizOptions,
        parseAssistantOptions: parseAssistantOptions
    };
});
