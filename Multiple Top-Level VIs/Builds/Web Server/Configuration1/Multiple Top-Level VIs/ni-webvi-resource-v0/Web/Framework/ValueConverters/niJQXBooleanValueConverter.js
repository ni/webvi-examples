(function () {
    'use strict';

    NationalInstruments.HtmlVI.ValueConverters.JQXBooleanValueConverter = function () {

    };

    // Static Public Variables
    // None

    // State Public Functions
    // None

    // Prototype creation
    var valueConverter = NationalInstruments.HtmlVI.ValueConverters.JQXBooleanValueConverter;

    // Public Prototype Methods
    valueConverter.convert = function (value, params) {
        // jshint unused: vars
        return value.toString();
    };

    valueConverter.convertBack = function (value, params) {
        // jshint unused: vars
        return value === 'true';
    };
}());
