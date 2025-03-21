'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
A utility for persisting showcase history entries. Caches the current history item until either:
    - all fields have a value -> persist to KVStore
    - the id changes -> reset the previously stored field values
 */
define(['components/splunk/KVStore'], function (KVStore) {
    return function () {
        function ShowcaseHistorySerializer(historyCollectionName, historyEntryTemplate) {
            var onPersistCallback = arguments.length <= 2 || arguments[2] === undefined ? function () {} : arguments[2];

            _classCallCheck(this, ShowcaseHistorySerializer);

            this.historyCollectionName = historyCollectionName;
            this.historyEntryTemplate = historyEntryTemplate;
            this.onPersistCallback = onPersistCallback;
            this.reset();
        }

        _createClass(ShowcaseHistorySerializer, [{
            key: 'persist',
            value: function persist(id, historyEntry) {
                var _this = this,
                    _arguments = arguments;

                if (historyEntry == null || this.currentHistoryEntryId != id) {
                    this.reset();
                }

                var readyToPersist = true;

                this.currentHistoryEntryId = id;

                Object.keys(this.historyEntryTemplate).forEach(function (key) {
                    if (_this.currentHistoryEntry[key] == null) {
                        _this.currentHistoryEntry[key] = historyEntry[key];
                    }

                    if (_this.currentHistoryEntry[key] == null) {
                        readyToPersist = false;
                    }
                });

                if (readyToPersist) {
                    KVStore.setCollection(this.historyCollectionName, this.currentHistoryEntry, function () {
                        _this.reset();
                        _this.onPersistCallback.apply(_this, _arguments);
                    });
                }
            }
        }, {
            key: 'reset',
            value: function reset() {
                var _this2 = this;

                this.currentHistoryEntryId = null;
                this.currentHistoryEntry = {};

                Object.keys(this.historyEntryTemplate).forEach(function (key) {
                    _this2.currentHistoryEntry[key] = null;
                });
            }
        }]);

        return ShowcaseHistorySerializer;
    }();
});
