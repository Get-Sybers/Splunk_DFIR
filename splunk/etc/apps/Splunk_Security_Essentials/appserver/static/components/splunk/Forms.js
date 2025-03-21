"use strict";

// SplunkJS Forms
define(["underscore", "splunkjs/mvc", "splunkjs/mvc/simpleform/formutils", "splunkjs/mvc/tokenutils", "components/controls/Messages"], function (_, mvc, FormUtils, TokenUtils, Messages) {
    return {
        submitTokens: function submitTokens() {
            FormUtils.submitForm();
        },
        setToken: function setToken(name, value) {
            mvc.Components.getInstance("default").set(name, value);
            mvc.Components.getInstance("submitted").set(name, value);
        },
        getToken: function getToken(name) {
            var token = mvc.Components.getInstance("default").get(name);
            return token != null ? token : mvc.Components.getInstance("submitted").get(name);
        },
        parseTemplate: function parseTemplate(template) {
            return TokenUtils.replaceTokens(template, mvc.Components, "default");
        },
        unsetToken: function unsetToken(tokenNames) {
            var defaultComponent = mvc.Components.getInstance("default");
            var submittedComponent = mvc.Components.getInstance("submitted");

            if (!Array.isArray(tokenNames)) tokenNames = [tokenNames];

            tokenNames.forEach(function (tokenName) {
                defaultComponent.unset(tokenName);
                submittedComponent.unset(tokenName);
            });
        },
        escape: function escape(string) {
            return TokenUtils.getEscaper("s")(string);
        },
        clearChoiceView: function clearChoiceView(choiceViewControl, clearOptions) {
            if (choiceViewControl != null && choiceViewControl.settings != null) {
                choiceViewControl.settings.unset("value");

                if (clearOptions) this.clearChoiceViewOptions(choiceViewControl);
            }
        },
        clearChoiceViewOptions: function clearChoiceViewOptions(choiceViewControl) {
            if (choiceViewControl != null) {
                choiceViewControl._data = [];
                choiceViewControl.render();
            }
        },
        /**
         * Finds the intersection of two arrays.
         * @param {Array}   arrayA
         * @param {Array}   arrayB
         * @param {boolean} [alwaysIncludeWildcards] If true, include any strings with
         * @returns {*}
         */
        intersect: function intersect(arrayA, arrayB, alwaysIncludeWildcards) {
            var intersection = _.intersection(arrayA, arrayB);

            if (alwaysIncludeWildcards) {
                // combine both arrays, then filter out the
                var wildcards = _.union(arrayA, arrayB).filter(function (word) {
                    return typeof word === 'string' && word.indexOf('*') >= 0;
                });

                intersection = _.union(wildcards, intersection);
            }

            return intersection;
        },
        /**
         * Selects all options in a Splunk MultiDropdownView
         * @param {object} choiceViewControl A MultiDropdownView
         * @param {number} [maxChoices] The maximum number of choices to select.
         */
        selectAllChoiceViewOptions: function selectAllChoiceViewOptions(choiceViewControl, maxChoices) {
            var tooManyChoices = false;

            if (choiceViewControl != null) {
                var choices = this.getChoiceViewChoices(choiceViewControl);

                if (choices.length > 0) {
                    tooManyChoices = maxChoices > 0 && choices.length > maxChoices;

                    // this "if" statement is deliberately not combined with the next one to allow change events to fire before the message is set
                    if (tooManyChoices) choices = choices.slice(0, maxChoices);

                    choiceViewControl.val(choices);

                    if (tooManyChoices) {
                        Messages.setDropdownMessage(choiceViewControl, "This input contains a very large number of entries. Selected " + maxChoices + " entries instead.");
                    } else {
                        Messages.removeDropdownMessage(choiceViewControl);
                    }
                }
            }
        },
        getChoiceViewChoices: function getChoiceViewChoices(choiceViewControl) {
            var skipSelected = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

            var choices = [];

            if (choiceViewControl != null) {
                var displayedChoices = choiceViewControl.getDisplayedChoices();

                displayedChoices.forEach(function (displayedChoice) {
                    choices.push(displayedChoice.value);
                });

                if (skipSelected) {
                    var selected = choiceViewControl.val();
                    if (!Array.isArray(selected)) selected = [selected];
                    choices = _.difference(choices, selected);
                }

                return choices;
            }
        },
        // sets a choice view by its label rather than its value
        setChoiceViewByLabel: function setChoiceViewByLabel(choiceViewControl, label) {
            if (choiceViewControl != null) {
                var displayedChoices = choiceViewControl.getDisplayedChoices();
                var value = null;

                displayedChoices.forEach(function (displayedChoice) {
                    if (displayedChoice.label === label) value = displayedChoice.value;
                });

                if (value != null) choiceViewControl.val(value);
            }
        }
    };
});
