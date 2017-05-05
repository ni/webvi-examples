(function () {
    'use strict';

    // Static private reference aliases
    // None

    NationalInstruments.HtmlVI.ValueConverters.JsonValueConverter = function () {
        // Private variables
    };

    var jsonValueConverter = NationalInstruments.HtmlVI.ValueConverters.JsonValueConverter;

    // Public methods
    // Model -> Element
    jsonValueConverter.convert = function (obj, params) {
        // jshint unused: vars
        var convertedValue = JSON.stringify(obj);
        return convertedValue;
    };

    // Element -> Model
    jsonValueConverter.convertBack = function (value, params) {
        // jshint unused: vars
        var convertedValue = JSON.parse(value);
        return convertedValue;
    };

}());
