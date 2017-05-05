'use strict';

JQX.Utilities.Assign('NumberRenderer', function () {
    function NumberRenderer(numericValue) {
        babelHelpers.classCallCheck(this, NumberRenderer);

        var that = this;

        that.numericValue = numericValue;

        that.powersToPrefixes = { '24': 'Y', '21': 'Z', '18': 'E', '15': 'P', '12': 'T', '9': 'G', '6': 'M', '3': 'k', '0': '', '-2': 'c', '-3': 'm', '-6': 'u', '-9': 'n', '-12': 'p', '-15': 'f', '-18': 'a', '-21': 'z', '-24': 'y' };
    }

    babelHelpers.createClass(NumberRenderer, [{
        key: 'isENotation',
        value: function isENotation(value) {
            return new RegExp(/e/i).test(value);
        }

        /**
         * Converts a large exponential value to its decimal representation (used when "inputFormat" is 'integer').
         */

    }, {
        key: 'largeExponentialToDecimal',
        value: function largeExponentialToDecimal(exponential) {
            try {
                BigNumber;
            } catch (error) {
                throw new Error('Missing reference to jqxmath.js.');
            }

            if (exponential === undefined) {
                exponential = this.numericValue;
            }

            var stringExponential = exponential.toString().toLowerCase(),
                indexOfE = stringExponential.indexOf('e'),
                mantissa = new BigNumber(stringExponential.slice(0, indexOfE)),
                exponent = stringExponential.slice(indexOfE + 2),
                sign = stringExponential.slice(indexOfE + 1, indexOfE + 2),
                bigTen = new BigNumber(10),
                multyplyBy = bigTen.pow(sign + exponent),
                result = mantissa.multiply(multyplyBy);

            return result.toString();
        }

        /**
         * Converts a BigNumber integer value to an exponential value
         */

    }, {
        key: 'bigNumberToExponent',
        value: function bigNumberToExponent(significantDigits) {
            var value = this.numericValue;

            if (value.constructor !== BigNumber) {
                value = new BigNumber(value);
            }

            var numberLength = value._f;
            var numericString = value.toString();

            if (numberLength <= 10) {
                // 32-bit or lower
                return new JQX.Utilities.NumberRenderer(parseFloat(numericString)).toDigits(significantDigits);
            } else {
                // 64-bit
                if (significantDigits >= numberLength) {
                    return numericString;
                } else {
                    var sign = void 0;
                    if (value._s === false) {
                        sign = '';
                    } else {
                        sign = '-';
                        numericString = numericString.slice(1);
                    }

                    var digitsAfterDecimalSeparator = numericString.slice(1, significantDigits);
                    while (digitsAfterDecimalSeparator.length > 0 && digitsAfterDecimalSeparator.charAt(digitsAfterDecimalSeparator.length - 1) === '0') {
                        digitsAfterDecimalSeparator = digitsAfterDecimalSeparator.slice(0, digitsAfterDecimalSeparator.length - 1);
                    }

                    var decimalSeparator = digitsAfterDecimalSeparator.length > 0 ? '.' : '',
                        power = numberLength - 1;

                    return sign + numericString.slice(0, 1) + decimalSeparator + digitsAfterDecimalSeparator + 'E+' + power;
                }
            }
        }

        /**
         * Converts a plain number to scientific notation.
         */

    }, {
        key: 'toScientific',
        value: function toScientific() {
            var that = this,
                exponentialValue = Number(that.numericValue.toString()).toExponential(),
                indexOfE = exponentialValue.indexOf('e'),
                power = exponentialValue.slice(indexOfE + 1);

            var coefficient = parseFloat(exponentialValue.slice(0, indexOfE));

            if (power === '-2') {
                return coefficient + 'c';
            }

            var remainderPower = parseInt(power, 10) % 3;

            if (remainderPower > 0) {
                for (var i = 0; i < remainderPower; i++) {
                    coefficient = coefficient * 10;
                }
            } else if (remainderPower < 0) {
                coefficient = parseFloat(new BigNumber(coefficient).multiply(Math.pow(10, remainderPower)).toString());
            }

            if (power > 0) {
                var removeSign = coefficient >= 0 ? 0 : 1,
                    floatFix = exponentialValue.slice(removeSign, indexOfE).length - remainderPower - 2;
                if (floatFix >= 0) {
                    coefficient = coefficient.toFixed(floatFix);
                }
            }

            var finalPower = parseInt(power, 10) - remainderPower,
                scientificValue = coefficient + that.powersToPrefixes[finalPower.toString()];

            return scientificValue;
        }

        /**
         * Applies the significant digits or precision digits settings to the number.
         */

    }, {
        key: 'toDigits',
        value: function toDigits(significantDigits, precisionDigits) {
            var that = this;
            var renderedValue = void 0;

            if (significantDigits !== null) {
                renderedValue = that.applySignificantDigits(significantDigits);
            } else if (precisionDigits !== null) {
                renderedValue = that.applyPrecisionDigits(precisionDigits);
            } else {
                renderedValue = that.applySignificantDigits(8);
            }
            return renderedValue;
        }

        /**
         * Returns the number with a specified number of significant digits.
         */

    }, {
        key: 'applySignificantDigits',
        value: function applySignificantDigits(significantDigits) {
            var that = this;

            significantDigits = Math.max(1, Math.min(significantDigits, 21));

            // removes insignificant trailing zeroes
            function removeTrailingZeroes(value) {
                while (value.charAt(value.length - 1) === '0') {
                    value = value.slice(0, -1);
                }
                if (value.charAt(value.length - 1) === '.') {
                    value = value.slice(0, -1);
                }
                return value;
            }

            var renderedValue = parseFloat(that.numericValue).toPrecision(significantDigits).toUpperCase();

            if (renderedValue.indexOf('.') !== -1) {
                if (that.isENotation(renderedValue)) {
                    var indexOfDecimalSeparator = renderedValue.indexOf('.'),
                        indexOfE = renderedValue.indexOf('E');

                    var digitsAfterDecimalSeparator = renderedValue.slice(indexOfDecimalSeparator, indexOfE);
                    digitsAfterDecimalSeparator = removeTrailingZeroes(digitsAfterDecimalSeparator);
                    renderedValue = renderedValue.slice(0, indexOfDecimalSeparator) + digitsAfterDecimalSeparator + renderedValue.slice(indexOfE);
                } else {
                    renderedValue = removeTrailingZeroes(renderedValue);
                }
            }

            return renderedValue;
        }

        /**
         * Returns the number with a specified number of precision digits.
         */

    }, {
        key: 'applyPrecisionDigits',
        value: function applyPrecisionDigits(precisionDigits) {
            var that = this;

            precisionDigits = Math.max(0, Math.min(precisionDigits, 20));

            var renderedValue = parseFloat(that.numericValue).toFixed(precisionDigits);

            if (that.isENotation(renderedValue)) {
                renderedValue = that.largeExponentialToDecimal(renderedValue) + '.' + '0'.repeat(precisionDigits);
            }

            return renderedValue;
        }

        /**
         * Returns the logarithm of a value (for use in logarithmic scales).
         */

    }, {
        key: 'getLogarithm',
        value: function getLogarithm(base) {
            var value = this.numericValue;
            var result = void 0;

            if (base === undefined) {
                base = 10;
            }

            if (base === 10) {
                try {
                    result = Math.log10(value);
                } catch (error) {
                    result = Math.log(value) / Math.log(10);
                }
            } else {
                result = Math.log(value) / Math.log(base);
            }

            return result;
        }
    }]);
    return NumberRenderer;
}());