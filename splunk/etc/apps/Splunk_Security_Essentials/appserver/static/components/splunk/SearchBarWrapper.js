'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * A utility class that unifies certain aspects of Splunk's SearchBarView and SearchControlsView
 * Unifies the various change events into a single (debounced) event and provides a way to set the search bar timerange and value together.
 */

define(['underscore', 'splunkjs/mvc/searchbarview', 'splunkjs/mvc/searchcontrolsview'], function (_, SearchBarView, SearchControlsView) {
    return function () {
        function SearchBarWrapper(searchBarViewOptions, searchControlsViewOptions, onChangeCallback) {
            _classCallCheck(this, SearchBarWrapper);

            this.searchBarView = new SearchBarView(searchBarViewOptions);
            this.searchControlsView = new SearchControlsView(searchControlsViewOptions);

            // avoid firing the "change" event when setting multiple parts of the search (ie. value and time) in close succession
            var debouncedCallback = typeof onChangeCallback === 'function' ? _.debounce(_.bind(onChangeCallback, this), 200) : function () {};

            // handle the search mode changing
            this.searchControlsView._state.on('change', function () {
                debouncedCallback();
            });

            this.searchBarView.timerange.on('change', function () {
                debouncedCallback();
            });

            this.searchBarView.on('change', function () {
                // fix for the search bar not correctly auto-resizing when search is set programatically
                this.$el.find('textarea').keyup();

                debouncedCallback();
            });

            this.searchBarView.render();
            this.searchControlsView.render();
        }

        /**
         * Sets multiple properties on the SearchBarView at once
         * @param {string} query
         * @param {string} [earliestTime]
         * @param {string} [latestTime]
         */


        _createClass(SearchBarWrapper, [{
            key: 'setProperties',
            value: function setProperties(query, earliestTime, latestTime) {
                // set this before searchBarView.val() because there are events watching searchBarView for changes but none watching searchBarView.timerange
                this.searchBarView.timerange.val({
                    earliest_time: earliestTime != null ? earliestTime : '',
                    latest_time: latestTime != null ? latestTime : ''
                });

                this.searchBarView.val(query);
            }
        }]);

        return SearchBarWrapper;
    }();
});
