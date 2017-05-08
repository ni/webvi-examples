(function () {
    'use strict';
    // Private static aliases
    var NIType = window.NIType;
    var NITypes = window.NITypes;

    NationalInstruments.HtmlVI.ValueConverters.JQXNumericValueConverter = function () {

    };

    // Static Public Variables
    // None

    // State Public Functions
    // None

    // Prototype creation
    var valueConverter = NationalInstruments.HtmlVI.ValueConverters.JQXNumericValueConverter;

    valueConverter.convertNITypeToJQX = function (niType) {
        if (niType.isComplex()) {
            return 'complex';
        }

        if (niType.isFloat()) {
            return 'floatingPoint';
        }

        return 'integer';
    };

    valueConverter.convertJQXTypeToNI = function (element) {
        var niType, valueType;
        if (element.inputFormat === 'integer' || element.scaleType === 'integer') {
            valueType = element.wordLength.replace(/(u?i)/, function (match) {
                return match.toUpperCase();
            });
            niType = new NIType(JSON.stringify(valueType));
        } else if (element.inputFormat === 'floatingPoint' || element.scaleType === 'floatingPoint') {
            niType = NITypes.DOUBLE;
        } else {
            niType = NITypes.COMPLEXDOUBLE;
        }

        return niType;
    };

    // Public Prototype Methods
    // jqx value is always string
    valueConverter.convert = function (value, niType) {
        // jshint unused: vars
        return value.toString();
    };

    valueConverter.convertBack = function (value, niType) {

        if (niType === undefined || niType.isInteger() && niType.is64BitInteger() === false) {
            return parseInt(value);
        } else if (niType.isFloat()) {
            return parseFloat(value);
        } else if (niType.is64BitInteger() || niType.isComplex()) {
            return value.toString();
        }

        return value.toString();
    };
}());
