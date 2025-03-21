var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

// const _createClass = (function() {
//     function defineProperties(target, props) {
//         for (let i = 0; i < props.length; i += 1) {
//             const descriptor = props[i];
//             descriptor.enumerable = descriptor.enumerable || false;
//             descriptor.configurable = true;
//             if ('value' in descriptor) {
//                 descriptor.writable = true;
//             }
//             Object.defineProperty(target, descriptor.key, descriptor);
//         }
//     }
//     return function(Constructor, protoProps, staticProps) {
//         if (protoProps) {
//             defineProperties(Constructor.prototype, protoProps);
//         }
//         if (staticProps) {
//             defineProperties(Constructor, staticProps);
//         }
//         return Constructor;
//     };
// }());

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
    }
}

define(['splunkjs/mvc/simpleform/input/submit'], function(/* SubmitButton */) {
    return (function() {
        /**
         *
         * @param {element} wrapper
         * @param {string} submitButtonText
         * @param {boolean} [showScheduleButton=false] If false, hide this button
         * @returns {{}}
         */
        function AssistantControlsFooter(wrapper, submitButtonText) {
            const showScheduleButton = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

            _classCallCheck(this, AssistantControlsFooter);

            this.controls = {};

            wrapper.addClass('mlts-assistant-controls-footer');

            this.controls.submitButton = $('<button>').attr('id', 'submitControl').addClass('btn btn-primary mlts-submit').text(submitButtonText).on('click', function(e) {
                $(e.target).trigger('submit', this);
            });

            if (showScheduleButton) {
                this.controls.scheduleButton = $('<button>').addClass('btn btn-primary mlts-schedule-fit').append($('<i>').addClass('icon icon-clock')).tooltip({
                    title: `${submitButtonText} On A Schedule`,
                    container: 'body', // prevents breakage of rounded corners on button
                });

                wrapper.append($('<div>').addClass('btn-group').append(this.controls.submitButton, this.controls.scheduleButton));
            } else {
                wrapper.append(this.controls.submitButton);
            }

            this.controls.openInSearchButton = $('<button>').addClass('btn btn-secondary mlts-open-in-search').text('Open in Search');
            this.controls.showSPLButton = $('<button>').addClass('btn btn-secondary mlts-show-spl').text('Line-by-Line SPL Documentation');

            wrapper.append(this.controls.openInSearchButton, this.controls.showSPLButton);
        }

        _createClass(AssistantControlsFooter, [{
            key: 'getDisabled',
            value: function() {
                return this.controls.submitButton.attr('disabled');
            },
        }, {
            key: 'setDisabled',
            value: function(disabled) {
                this.controls.submitButton.attr('disabled', disabled);
                this.controls.openInSearchButton.attr('disabled', disabled);
                this.controls.showSPLButton.attr('disabled', disabled);
                if (this.controls.scheduleButton != null) this.controls.scheduleButton.attr('disabled', disabled);
            },
        }]);

        return AssistantControlsFooter;
    }());
});
