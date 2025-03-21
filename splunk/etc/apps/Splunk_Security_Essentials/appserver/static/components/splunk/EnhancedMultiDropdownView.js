'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(['splunkjs/mvc/multidropdownview', 'components/splunk/Forms', 'components/controls/Messages'], function (MultiDropdownView, Forms, Messages) {
    var multiDropdownSelectAllLimit = 100;

    return function () {
        function EnhancedMultiDropdownView() {
            var _this = this;

            _classCallCheck(this, EnhancedMultiDropdownView);

            var selectAllText = 'Select All Fields';
            var clearText = 'Clear Fields';

            var controlsClass = 'enhanced-multidropdown-view-controls';
            var selectAllClass = 'enhanced-multidropdown-view-select-all';
            var clearClass = 'enhanced-multidropdown-view-clear';

            this.multidropdownview = new (Function.prototype.bind.apply(MultiDropdownView, [null].concat(Array.prototype.slice.call(arguments))))();

            this.selectAllButton = $('<button>').addClass('btn btn-secondary ' + selectAllClass).text(selectAllText);
            this.clearButton = $('<button>').addClass('btn btn-secondary ' + clearClass).text(clearText);

            this.multidropdownview.on('datachange', function () {
                return _this.updateControls();
            });
            this.multidropdownview.on('change', function () {
                return _this.updateControls();
            });

            this.multidropdownview.$el.on('select2-open', function () {
                var resultsList = $('.select2-results:visible'); // there should only be one dropdown visible (the one that fired the open event
                // clearing the dropdown sometimes wipes out these controls, so we need to check if they're present and re-create them if not
                if (resultsList.length === 1 && resultsList.prev('.' + controlsClass).length === 0) {
                    $('<div>').addClass(controlsClass).append(_this.selectAllButton, _this.clearButton).insertBefore(resultsList).delegate('.btn', 'click', function (e) {
                        var target = $(e.target);

                        if (!target.hasClass('disabled')) {
                            if (target.hasClass(selectAllClass)) {
                                Forms.selectAllChoiceViewOptions(_this.multidropdownview, multiDropdownSelectAllLimit);
                            } else if (target.hasClass(clearClass)) {
                                Forms.clearChoiceView(_this.multidropdownview);
                            }

                            _this.hideDropdown();
                        }
                    });
                }

                _this.updateControls();
            });

            return this.multidropdownview;
        }

        _createClass(EnhancedMultiDropdownView, [{
            key: 'hideDropdown',
            value: function hideDropdown() {
                $('.select2-drop-mask').click();
            }
        }, {
            key: 'updateControls',
            value: function updateControls() {
                var selectedOptions = this.multidropdownview.val();
                var tooManyChoices = selectedOptions != null && selectedOptions.length >= multiDropdownSelectAllLimit;
                var unselectedOptions = Forms.getChoiceViewChoices(this.multidropdownview, true);

                this.clearButton[selectedOptions != null && selectedOptions.length > 0 ? 'removeClass' : 'addClass']('disabled');
                this.selectAllButton[unselectedOptions.length > 0 && !tooManyChoices ? 'removeClass' : 'addClass']('disabled');

                // this message is cleared before any subsequent messages are set on the control
                Messages.removeDropdownMessage(this.multidropdownview);
            }
        }]);

        return EnhancedMultiDropdownView;
    }();
});
