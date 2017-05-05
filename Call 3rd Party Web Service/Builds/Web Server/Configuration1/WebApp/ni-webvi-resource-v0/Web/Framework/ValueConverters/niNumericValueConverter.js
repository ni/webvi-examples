(function () {
    'use strict';

    // Static private reference aliases
    // None

    NationalInstruments.HtmlVI.ValueConverters.NumericValueConverter = function () {

    };

    // Prototype creation
    var numericValueConverter = NationalInstruments.HtmlVI.ValueConverters.NumericValueConverter;

    // Private static methods
    // None

    // Public prototype methods
    // Given a primitive number value (float or string), and a value type, converts it into an object of the form
    // { numberValue: x } or { stringValue: y }.
    // If the parseNumberValue parameter is true, then value can be a string even if the value type implies it should
    // be represented as a float, and therefore parseFloat will be called on the input primitive first.
    numericValueConverter.convert = function (value, niType, parseNumberValue) {
        var numberValue = value;

        if (niType.isComplex() || niType.is64BitInteger()) {
            if (typeof value !== 'string') {
                throw new Error('value should be a string but is ' + typeof value + ' instead.');
            }

            return { stringValue: value };
        }

        if (parseNumberValue === true) {
            numberValue = parseFloat(value);
        }

        if (typeof numberValue !== 'number') {
            throw new Error('value should be a number but is ' + typeof numberValue + 'with value ' + numberValue + ' instead.');
        }

        return {numberValue: numberValue};
    };

    // Given an object of the form { numberValue: x } or { stringValue: y } (depending on the
    // value type), extracts the primitive value (float or string) from it.
    numericValueConverter.convertBack = function (obj, niType) {

        if (typeof obj !== 'object') {
            throw new Error('obj must be an object but is ' + typeof obj + ' instead.');
        }

        if (niType === undefined) {
            return obj.numberValue;
        }

        if (niType.isComplex() || niType.is64BitInteger()) {
            if (typeof obj.stringValue !== 'string') {
                throw new Error('obj.stringValue must be a string but is ' + typeof obj.stringValue + ' instead');
            }

            return obj.stringValue;
        }

        if (typeof obj.numberValue !== 'number') {
            throw new Error('obj.numberValue must be a number but is ' + obj.numberValue + ' instead');
        }

        return obj.numberValue;
    };

}());
