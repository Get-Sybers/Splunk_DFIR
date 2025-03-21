'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(['splunkjs/mvc/tableview', 'components/controls/Messages', 'components/controls/Modal', 'components/splunk/KVStore', 'components/splunk/Searches', 'Options'], function (TableView, Messages, Modal, KVStore, Searches, Options) {
    var QueryHistoryTable = function () {
        /**
         *
         * @param {object}   el                  The HTML element to render the table around
         * @param {string}   managerid           The search manager responsible for loading the history
         * @param {string}   historyCollectionId The ID of the KVStore collection that stores the history
         * @param {string[]} fields              A list of fields to display in the table, in order
         * @param {string}   submitButtonText    The text for the submit button
         * @param {function} onLoadCallback      Called when the "Load" or "Load and Run" buttons are clicked. It is passed two params: a map of properties, and an autorun boolean
         * @param {function} onDeleteCallback    Called when the "Remove from history" button is clicked. It is passed the _key of the KVstore row that was deleted
         * @returns {*}
         */
        function QueryHistoryTable(el, managerid, historyCollectionId, fields, submitButtonText) {
            var _this = this;

            var onLoadCallback = arguments.length <= 5 || arguments[5] === undefined ? function () {} : arguments[5];
            var onDeleteCallback = arguments.length <= 6 || arguments[6] === undefined ? function () {} : arguments[6];

            _classCallCheck(this, QueryHistoryTable);

            var dashboardHistoryTablePageSize = Options.getOptionByName("dashboardHistoryTablePageSize", 5);

            el.addClass('dashboard-history-table');

            var ControlsRenderer = TableView.BaseCellRenderer.extend({
                canRender: function canRender(cellData) {
                    return cellData.field === 'Actions';
                },
                render: function render($td, cellData) {
                    $td.addClass('dashboard-history-controls');

                    var loadButton = $('<button>').addClass('btn btn-secondary dashboard-history-load').text('Load Settings');
                    var loadAndRunButton = $('<button>').addClass('btn btn-secondary dashboard-history-load-and-run').text(submitButtonText);
                    var deleteButton = $('<button>').addClass('btn btn-secondary dashboard-history-delete').text('Remove from history');

                    $td.append(loadButton, loadAndRunButton, deleteButton);
                }
            });

            var confirmDeleteModal = new Modal('dashboard-history-delete-modal',null, $);
            confirmDeleteModal.setTitle('Delete Record');

            var errorWrapper = $('<div>').hide();

            confirmDeleteModal.body.append(errorWrapper);
            confirmDeleteModal.body.append($('<div>').text('Remove this record from history?'));

            confirmDeleteModal.$el.on('hide.bs.modal', function () {
                Messages.removeAlert(errorWrapper, true);
                confirmDeleteModal.rowId = null;
            });

            confirmDeleteModal.footer.append($('<button>').attr({
                id: 'dashboard-history-delete-cancel',
                type: 'button',
            }).addClass('btn btn-primary').text('Cancel'), $('<button>').attr({
                id: 'dashboard-history-delete-confirm',
                type: 'button'
            }).on('click', function () {
                Messages.removeAlert(errorWrapper, true);

                KVStore.deleteCollection(historyCollectionId, confirmDeleteModal.rowId, function (error, rowId) {
                    if (error == null) {
                        onDeleteCallback(confirmDeleteModal.rowId);
                        confirmDeleteModal.$el.modal('hide');
                        Searches.getSearchManager(managerid).startSearch();
                    } else {
                        var errorString = 'Unable to delete record.';

                        if (error.data != null && error.data.messages != null && error.data.messages[0] != null) {
                            errorString = error.data.messages[0].text;
                        }

                        Messages.setAlert(errorWrapper, errorString, undefined, undefined, true);
                    }
                });
                $('[data-bs-dismiss=modal').click()
            }).addClass('btn btn-secondary').text('Delete'));

            var queryHistoryTable = new TableView({
                id: 'queryHistoryTable',
                el: el,
                managerid: managerid,
                drilldown: 'cell',
                drilldownRedirect: false,
                pageSize: dashboardHistoryTablePageSize,
                sortKey: '_time',
                sortDirection: 'desc',
                fields: fields
            });

            queryHistoryTable.addCellRenderer(new ControlsRenderer());

            queryHistoryTable.on('click:cell', function (params) {
                var eventTarget = $(params.originalEvent.target);
                var sampleSearch = null;

                if (eventTarget.hasClass('dashboard-history-load')) {
                    onLoadCallback(params, false);
                } else if (eventTarget.hasClass('dashboard-history-load-and-run')) {
                    onLoadCallback(params);
                } else if (eventTarget.hasClass('dashboard-history-delete')) {
                    confirmDeleteModal.rowId = params.data['row._key'];
                    confirmDeleteModal.$el.modal('show');
                }
            });

            Searches.getSearchManager(managerid).on("search:done", function () {
                _this.jumpToLastPage(queryHistoryTable);
            });

            queryHistoryTable.render();

            return queryHistoryTable;
        }

        _createClass(QueryHistoryTable, [{
            key: 'jumpToLastPage',
            value: function jumpToLastPage(queryHistoryTable) {
                if (queryHistoryTable.paginator != null) {
                    var currentPage = queryHistoryTable.paginator.settings.get('page');
                    var pageSize = queryHistoryTable.paginator.settings.get('pageSize');
                    var itemCount = queryHistoryTable.paginator.settings.get('itemCount');

                    //if currentPage does not contain any records, move to the nearest page that has records
                    if (itemCount > 0 && itemCount <= currentPage * pageSize) {
                        //page is zero-indexed
                        var newPage = Math.ceil(itemCount / pageSize) - 1;
                        queryHistoryTable.paginator.settings.set({ page: newPage });
                    }
                }
            }
        }]);

        return QueryHistoryTable;
    }();

    return QueryHistoryTable;
});
