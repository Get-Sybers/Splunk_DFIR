'use strict';

// An extension to jQuery's .val() that allows an element to store its previous value.
define(['jquery'], function ($) {
    $.fn.extend({
        setValue: function setValue(value) {
            if (this.data('currentValue') !== value) {
                this.data('previousValue', this.data('currentValue'));
                this.data('currentValue', value);
                this.val(value);
            }
        }
    });
});
