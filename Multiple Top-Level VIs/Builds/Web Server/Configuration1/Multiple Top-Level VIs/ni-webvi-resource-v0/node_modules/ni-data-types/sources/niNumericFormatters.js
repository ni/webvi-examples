//****************************************
// NINumeric data type
// National Instruments Copyright 2016
//****************************************

(function () {
    'use strict';

    // Constructor function
    window.NINumericFormatters = function () {
    };

    // Static Private Variables
    // None

    // Static Public Functions
    // None

    // Prototype creation
    var proto = window.NINumericFormatters.prototype;

    // Static Private Functions
    // Some browsers(PhantomJS, IE) dont support Math.log10(x)
    var getLog10 = function (x) {
        return Math.log(x) * Math.LOG10E;
    };

    var getExtension = function (exponent) {
        var extensionTable = ['y', 'z', 'a', 'f', 'p', 'n', 'μ', 'm', '', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
        var index = 8;

        if (exponent >= 3) {
            if (exponent >= 24) {
                index = 16;
            } else {
                index = Math.floor(exponent / 3) + 8;
            }
        } else {
            if (exponent <= -3) {
                if (exponent <= -24) {
                    index = 0;
                } else {
                    index = Math.round((exponent - 1) / 3) + 8;
                }
            }

            if (exponent === -2 || exponent === -1) {
                index = 7;
            }
        }

        return {
            conversion: Math.pow(10, (index - 8) * 3),
            extension: extensionTable[index]
        };
    };

    var removeLastZero = function (value) {
        var numberStr = value;
        if (typeof value !== 'string') {
            numberStr = value.toString();
        }

        var exp = '';
        var exponential = numberStr.indexOf('e') !== -1;
        //split the number into mantissa and exponent
        if (exponential) {
            exp = numberStr.substring(numberStr.indexOf('e'), numberStr.length);
            numberStr = numberStr.substring(0, numberStr.indexOf('e'));
        }

        var dotIndex = numberStr.indexOf('.');
        //remove 0s
        if (dotIndex !== -1) {
            var lastZero = numberStr.lastIndexOf('0');

            //remove 0s one by one
            while (lastZero === numberStr.length - 1) {
                numberStr = numberStr.slice(0, -1);
                lastZero = numberStr.lastIndexOf('0');
            }

            //delete the dot if is last
            if (dotIndex === numberStr.length - 1) {
                numberStr = numberStr.slice(0, -1);
            }
        }

        var result = '0';
        if (numberStr !== '0' && numberStr !== '-0') {
            result = numberStr;
        }

        //rebuild the number
        return result + exp.toUpperCase();
    };

    // Public Prototype Methods
    // toSiNotation(1.5e-8, 3) returns '15n'
    // toSiNotation(1.5, 1) returns '1.5'
    // toSiNotation(-1.5e12, 3) returns '-1.500T'
    proto.toSiNotation = function (value, nrOfDecimals) {
        var decimals = 0;
        if (isFinite(nrOfDecimals) && nrOfDecimals !== null) {
            if (nrOfDecimals > 20) {
                decimals = 20;
            } else {
                if (nrOfDecimals < 0) {
                    decimals = 0;
                } else {
                    decimals = nrOfDecimals;
                }
            }
        }

        var mantissa, extensionData;
        if (value === 0) {
            return '0';
        } else {
            if (value === null || value === undefined) {
                return (value === null) ? 'null' : 'undefined';
            }

            if (!isFinite(value)) {
                return isNaN(value) ? 'NaN' : value.toString();
            }

            var exponent = Math.floor(getLog10(Math.abs(value)));

            extensionData = getExtension(exponent);
            mantissa = value / extensionData.conversion;

            if (exponent >= 45 || exponent <= -45) {
                mantissa = mantissa.toExponential(decimals);
            }
        }

        if (mantissa.toString().indexOf('e') === -1) {
            mantissa = mantissa.toFixed(decimals);
        }

        var result = removeLastZero(mantissa),
            extension = '';

        if (result !== '0' && result !== '-0') {
            extension = extensionData.extension;
        }

        return result + extension;
    };

    // toDecPrecision(1000, 2) returns '1E+3'
    // toDecPrecision(-1.212E-21, 3) returns '-1.2E-21'
    // toDecPrecision(1100.5, 4) returns '1101'
    proto.toDecPrecisionNotation = function (value, nrOfDigits) {
        if (value === null || value === undefined) {
            return value === null ? 'null' : 'undefined';
        }

        if (!isFinite(value)) {
            return isNaN(value) ? 'NaN' : value.toString();
        }

        var partialVal;
        if (isFinite(nrOfDigits) && nrOfDigits !== null) {
            var stringValue = Math.abs(value).toString();
            var dotPosition = stringValue.indexOf('.');
            var eNotation = (stringValue.indexOf('e') !== -1) || (stringValue.indexOf('E') !== -1);

            if (dotPosition !== -1 && dotPosition < nrOfDigits && !eNotation) {
                partialVal = value.toPrecision(nrOfDigits);
            } else {
                partialVal = (nrOfDigits < 1 || 21 < nrOfDigits || nrOfDigits > stringValue.length) ? value.toPrecision() : value.toPrecision(nrOfDigits);
            }
        } else {
            partialVal = value.toPrecision();
        }

        return removeLastZero(partialVal);
    };

    // toDecFixedNotation(1000, 2) returns '1000.00'
    // toDecFixedNotation(20.49, 0) returns '20'
    // toDecFixedNotation(-1.2E-20, 20) returns '-0.00000000000000000001'
    proto.toDecFixedNotation = function (value, nrOfecimals) {
        if (value === null || value === undefined) {
            return value === null ? 'null' : 'undefined';
        }

        if (!isFinite(value)) {
            return isNaN(value) ? 'NaN' : value.toString();
        }

        // toFixed(decimals) on negative numbers represented in
        // scientific notation(ex: -100E21) is returning a number(-1000000...) not a string('-1e+23')
        var sign = '';
        var number = value;
        if (value < 0) {
            sign = '-';
            number = Math.abs(value);
        }

        var result = '0';
        if (isFinite(nrOfecimals) && nrOfecimals !== null) {
            if (nrOfecimals < 0 || 20 < nrOfecimals) {
                result = number.toFixed();
            } else {
                result = number.toFixed(nrOfecimals);
            }
        } else {
            result = number.toFixed();
        }

        return sign + result.toUpperCase();
    };
}());
