'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
A helper for linking tabs and the tab content together.
Usage:
    tabListContainer should be a <ul> with a list of boostrap tabs, ie:
        <ul>
            <li>
                <a class="tab-title-text" data-tab="tabID">
            </li>
            ...
        </ul>
    tabContentContainer should be a <div> with one or more child <div>s with matching data-tab attributes, ie:
        <div>
            <div data-tab="tabID">
            ...
        </div>
 */
define([], function () {
    var Tabs = function () {
        function Tabs(tabListContainer, tabContentContainer) {
            var _this = this;

            _classCallCheck(this, Tabs);

            this.tabListContainer = tabListContainer;
            this.tabContentContainer = tabContentContainer;

            this.tabListContainer.addClass('dashboard-tabs nav nav-tabs');
            this.tabContentContainer.addClass('dashboard-tab-content tab-content');

            this.tabListContainer.on('click', 'li', function (event) {
                _this.activate($(event.target).attr('data-tab'));
            });

            var tabs = tabListContainer.children('li');

            if (tabs.length > 0) {
                this.activate($(tabs[0]).children('a.tab-title-text').attr('data-tab'));
            }
        }

        _createClass(Tabs, [{
            key: 'activate',
            value: function activate(id) {
                this.tabListContainer.children('li').each(function (index, tab) {
                    tab = $(tab);

                    var tabLink = tab.children('a.tab-title-text');

                    if (tabLink.attr('data-tab') === id) {
                        tab.addClass('active');
                    } else {
                        tab.removeClass('active');
                    }
                });

                this.tabContentContainer.children('div').each(function (index, tab) {
                    tab = $(tab);

                    if (tab.attr('data-tab') === id) {
                        tab.show();
                    } else {
                        tab.hide();
                    }
                });
            }
        }]);

        return Tabs;
    }();

    return Tabs;
});
