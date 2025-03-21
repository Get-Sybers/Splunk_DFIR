'use strict';

// A class for adding Splunk-style messages to inputs
define(['jquery'], function ($) {
    var wrapperClass = 'textinput-with-message';
    var messageClass = 'textinput-message';

    function getMessage$El(textInput) {
        return $(textInput.el).find('.' + messageClass);
    }

    return {
        setFormInputStatus: function setFormInputStatus(textInput, isValid) {
            var textInputs = Array.isArray(textInput) ? textInput : [textInput];

            textInputs.forEach(function (input) {
                input.$el[isValid ? 'removeClass' : 'addClass']('error');
            });
        },

        setTextInputMessage: function setTextInputMessage(textInput, message) {
            var message$El = getMessage$El(textInput);

            if (message$El.length === 0) {
                message$El = $('<span>').addClass(messageClass);
                $(textInput.el).append(message$El);
            }

            // this forces any animations queued for this element to complete
            // then shows it (the 0 argument to show makes the animation "queued" instead of immediate)
            message$El.stop(true, true).show(0, function () {
                $(textInput.$el).addClass(wrapperClass);
                message$El.text(message);
            });
        },
        removeTextInputMessage: function removeTextInputMessage(textInput) {
            var message$El = getMessage$El(textInput);

            // visible check prevents hide animation from being called twice in quick succession
            if (message$El.is(':visible')) {
                // hides the element with a 0-ms delay
                // this allows whatever caused the blur to happen before the DOM reflow caused by the element being hidden
                message$El.stop(true, true).hide(0, function () {
                    $(textInput.$el).removeClass(wrapperClass);
                });
            }
        },
        /**
         * Displays a message using the built-in $_messageEl on a Splunk dropdown view
         * @param {object} dropdownView
         * @param {string} message
         */
        setDropdownMessage: function setDropdownMessage(dropdownView, message) {
            if (dropdownView != null && dropdownView._$messageEl != null) {
                dropdownView._$messageEl.text(message);
                dropdownView._$messageEl.attr("title", message);

                try {
                    // same as Splunk, wrapping the tooltip in case of error
                    dropdownView._$messageEl.tooltip('destroy');
                    dropdownView._$messageEl.tooltip({ animation: false });
                } catch (e) {}
            }
        },
        removeDropdownMessage: function removeDropdownMessage(dropdownView) {
            this.setDropdownMessage(dropdownView, '');
        },
        setAlert: function setAlert(wrapper$El) {
            var alertMessage = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];
            var alertType = arguments.length <= 2 || arguments[2] === undefined ? 'error' : arguments[2];
            var extraClasses = arguments.length <= 3 || arguments[3] === undefined ? '' : arguments[3];
            var showWrapper = arguments[4];

            if (wrapper$El != null) {
                if (showWrapper) wrapper$El.show();

                var alert$El = $('<div></div>').addClass('alert alert-' + alertType + ' ' + extraClasses);
                var icon$El = $('<i></i>').addClass('icon-alert');
                var message$El = $('<p></p>').text(alertMessage);

                wrapper$El.append(alert$El.append(icon$El, message$El));
            }
        },
        removeAlert: function removeAlert(wrapper$El) {
            var hideWrapper = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

            if (wrapper$El != null) {
                wrapper$El.children('.alert').remove();
                if (hideWrapper) wrapper$El.hide();
            }
        }
    };
});
