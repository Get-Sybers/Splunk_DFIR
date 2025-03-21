'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

define(['vendor/url/url', 'Options'], function (url, Options) {
    // vendor/url is not used through the RequireJS reference because it declares a global

    var appName = Options.getOptionByName('appName');

    function getQueryParameters(searchURI) {
        var queryParameters = {};
        // console.log("Search URI (getQueryParameters)", searchURI)
        if (typeof searchURI === 'string') {
            // trim the leading ? if present
            searchURI = searchURI[0] === '?' ? searchURI.substring(1) : searchURI;

            searchURI.split('&').forEach(function (part) {
                if (part.length > 0) {
                    var _part$split$map = part.split('=').map(decodeURIComponent);

                    var _part$split$map2 = _slicedToArray(_part$split$map, 2);

                    var name = _part$split$map2[0];
                    var value = _part$split$map2[1];
                    // handle value-less query params cleanly

                    var cleanValue = value != null ? value : '';

                    if (queryParameters[name] != null) {
                        // handle multiple url params with the same name by putting them in an array
                        if (!Array.isArray(queryParameters[name])) queryParameters[name] = [queryParameters[name]];
                        queryParameters[name].push(cleanValue);
                    } else {
                        queryParameters[name] = cleanValue;
                    }
                }
            });
        }

        return queryParameters;
    }

    // remove "search" from the start of the query, like what Splunk does on the search page
    function stripSearchFromSearchQuery(search) {
        var searchString = 'search';
        return search != null && search.indexOf(searchString) === 0 ? search.slice(searchString.length).trim() : search;
    }

    function getSearchParameters() {
        var urlParams = getQueryParameters(window.location.search);

        // if there's no url params, check if there's any in the referrer
        if (Object.keys(urlParams).length === 0 && document.referrer != null && document.referrer.length > 0) {
            var referrer = new URL(document.referrer);

            // don't import anything from the referrer unless we're coming from the same domain
            if (window.location.host === referrer.host) {
                var pathComponents = referrer.pathname.split('/');
                var appIndex = pathComponents.indexOf(appName);

                // also skip importing anything from the referrer if it isn't the search page
                if (appIndex > -1 && pathComponents[appIndex + 1] === 'search') {
                    var urlSearch = '';

                    if (referrer.search.length > 0) {
                        urlSearch = referrer.search;
                    } else if (referrer.hash.length > 0) {
                        // handle older browsers where Splunk puts the search inside the hash
                        var searchStart = referrer.hash.indexOf('?');
                        if (searchStart > -1) urlSearch = referrer.hash.slice(searchStart);
                    }

                    urlParams = getQueryParameters(urlSearch);
                }
            }
        }

        return urlParams;
    }

    return function (assistantName) {
        var searchParameters = getSearchParameters();

        var assistantParameters = {
            value: stripSearchFromSearchQuery(searchParameters.q || ''),
            earliestTime: searchParameters.earliest || '',
            latestTime: searchParameters.latest || ''
        };

        if (searchParameters['ml_toolkit.dataset'] != null) {
            assistantParameters.mlToolkitDataset = searchParameters['ml_toolkit.dataset'];
        } else if (assistantName != null) {
            (function () {
                var assistantPrefix = 'ml_toolkit.assistant.' + assistantName + '.';

                Object.keys(searchParameters).forEach(function (key) {
                    if (key.indexOf(assistantPrefix) === 0) assistantParameters[key.substr(assistantPrefix.length)] = searchParameters[key];
                });
            })();
        }

        if (searchParameters.autostart == null) assistantParameters.autostart = false;

        return assistantParameters;
    };
});
