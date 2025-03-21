"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

define(["components/controls/DrilldownLinker", "components/controls/Modal", "components/splunk/Forms", "components/data/parameters/ColorPalette"], function (DrilldownLinker, Modal, Forms, ColorPalette) {
    function createSearchStringTable(searchLines, commentLines) {
        var searchStringDisplayTable = $('<table>').addClass('mlts-search-string-display-table table table-striped');
        var tbody = $('<tbody>');

        searchStringDisplayTable.append(tbody);

        tbody.get(0).addEventListener('copy', function (event) {
            var text = getSelectedText(event.target.cellIndex);

            event.clipboardData.setData('text', text);
            event.preventDefault();
        });

        tbody.on('mousedown', 'td', function (event) {
            tbody.find('td').each(function (i, td) {
                $(td)[td.cellIndex !== event.target.cellIndex ? 'addClass' : 'removeClass']('mlts-no-select');
            });
        });

        var commentColor = ColorPalette.getColorByIndex(15);

        searchLines.forEach(function (searchLine, index) {
            var commentsTd = commentLines != null ? $('<td>').css('color', commentColor).text(commentLines[index] != null ? '// ' + commentLines[index] : '') : null;

            tbody.append($('<tr>').css('font-family', 'monospace').append($('<td>').text(Forms.parseTemplate(searchLine)), commentsTd));
        });

        return searchStringDisplayTable;
    }

    function getSelectedText(columnIndex) {
        var selectedNodes = window.getSelection().getRangeAt(0).cloneContents();
        var selectedRows = selectedNodes.querySelectorAll('tr');
        var text = '';

        if (selectedRows.length === 0) {
            // if the selection is the inside of table row, get all the text
            text = selectedNodes.textContent;
        } else {
            text = Array.prototype.map.call(selectedRows, function (tr) {
                // if the section starts at the second cell, use 0 instead of the column index
                // this will not work for tables with more than two columns
                return tr.cells[tr.cells.length === 1 ? 0 : columnIndex].textContent;
            }).join('\n');
        }

        return text;
    }

    return {
        /**
         * Sets a drilldown link and the accompanying block explaining the search string
         * @param {string}        container$El
         * @param {string|object} drilldownTitle  Either a string to set the title too, or a jQuery element to use as the title
         * @param {string}        target          The drilldown link target - either "search" for the search page or an assistant name
         * @param {string[]}      searchLines
         * @param {string[]}      [commentLines]
         * @param {object}        [searchOptions]
         * @param {object}        [extraParams]
         */
        setString: function setString(container$El, drilldownTitle, target, searchLines, commentLines, searchOptions, extraParams) {
            var drilldownTitleIsEl = drilldownTitle != null && (typeof drilldownTitle === "undefined" ? "undefined" : _typeof(drilldownTitle)) === 'object' && drilldownTitle.jquery != null;

            var drilldownLink$El = drilldownTitleIsEl ? drilldownTitle : $('<h3>').text(drilldownTitle);

            var search = DrilldownLinker.createSearch(searchLines, searchOptions);

            DrilldownLinker.setDrilldown(drilldownLink$El, target, search, extraParams);

            container$El.empty().show();

            if (!drilldownTitleIsEl) container$El.append(drilldownLink$El);

            container$El.append(createSearchStringTable(searchLines, commentLines));
        },
        setSearchString: function setSearchString(container$El, drilldownTitle, searchLines, commentLines, searchOptions, extraParams) {
            this.setString(container$El, drilldownTitle, 'search', searchLines, commentLines, searchOptions, extraParams);
        },
        clear: function clear(container$El) {
            container$El.empty().hide();
        },
        /**
         * A utility function for directly opening a modal with a search string displayed in it.
         * @param id
         * @param title
         * @param searchLines
         * @param commentLines
         * @param searchOptions
         * @param extraParams
         * @returns {*}
         */
        showSearchStringModal: function showSearchStringModal(id, title, searchLines, commentLines, searchOptions, extraParams) {
            var searchStringModal = new Modal(id, {
                title: title,
                type: 'noPadding',
                show: true
            }, $);

            this.setSearchString(searchStringModal.body, searchStringModal.title, searchLines, commentLines, searchOptions, extraParams);

            return searchStringModal;
        }
    };
});
