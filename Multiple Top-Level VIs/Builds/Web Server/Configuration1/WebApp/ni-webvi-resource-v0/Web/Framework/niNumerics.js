//****************************************
// NI Numeric helpers
// National Instruments Copyright 2016
//****************************************

// Namespace for NI Numerics
NationalInstruments.HtmlVI.NINumerics = {};

NationalInstruments.HtmlVI.NINumerics.Helpers =
    (function () {
        'use strict';
        var coerceSignificantDigits = function (sigDigits, unsetValue) {
                if (sigDigits === -1) {
                    return unsetValue;
                }

                // Coerce to [1, 21], see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toPrecision
                return Math.max(1, Math.min(21, sigDigits));
            },

            coercePrecisionDigits = function (precisionDigits, unsetValue) {
                if (precisionDigits === -1) {
                    return unsetValue;
                }

                // Coerce to [0, 20], see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed
                return Math.max(0, Math.min(20, precisionDigits));
            },

            coerceDisplayDigits = function (significantDigits, precisionDigits, unsetValue) {
                var result = {};
                result.significantDigits = coerceSignificantDigits(significantDigits, unsetValue);
                result.precisionDigits = coercePrecisionDigits(precisionDigits, unsetValue);

                // sigificantDigits and precisionDigits are expected to be mutually exclusive.
                // If both are set, we prefer significantDigits (and ignore precisionDigits)
                // If neither are set, we default to 0 digits of precision.
                if (result.precisionDigits !== unsetValue && result.significantDigits !== unsetValue) {
                    result.precisionDigits = unsetValue;
                } else if (result.precisionDigits === unsetValue && result.significantDigits === unsetValue) {
                    result.precisionDigits = 0;
                }

                return result;
            },

            roundToNearestNumber = function (value, factor) {
                if (factor === 0) {
                    return value;
                }

                if (factor < 0) {
                    throw new Error('factor: ' + factor + ' factor must be greater than 0');
                }

                var mod = value % factor;
                if (mod === 0) {
                    return value;
                }

                var half = factor / 2;
                if (value > 0) {
                    if (mod <= half) {
                        return value - mod;
                    }

                    return value + (factor - mod);
                }

                if (mod + factor <= half) {
                    return value - (factor + mod);
                }

                return value - mod;
            },

            roundToNearestBigNumber = function (valueBig, factorBig) {
                var value = new BigNumber(valueBig),
                    factor = new BigNumber(factorBig),
                    zero = new BigNumber('0'),
                    two = new BigNumber('2');

                if (factor.compare(zero) === 0) {
                    return value;
                }

                if (factor.compare(zero) < 0) {
                    throw new Error('factor: ' + factor + ' factor must be greater than 0');
                }

                var mod = value.mod(factor);
                if (mod.compare(zero) === 0) {
                    return value;
                }

                var half = factor.divide(two);
                if (value.compare(zero) > 0) {
                    if (mod.compare(half) <= 0) {
                        return value.subtract(mod);
                    }

                    return value.add(factor.subtract(mod));
                }

                if (mod.add(factor).compare(half) <= 0) {
                    return value.subtract(factor.add(mod));
                }

                return value.subtract(mod);
            },

            roundToNearest = function (value, niType, factor) {
                var val;
                if (niType.is64BitInteger()) {
                    val = roundToNearestBigNumber(value.stringValue, factor.stringValue);
                    return { numberValue: 0, stringValue: val.toString(10) };
                } else {
                    val = roundToNearestNumber(value.numberValue, factor.numberValue);
                    return { numberValue: val, stringValue: '' };
                }
            };

        return Object.freeze({
            coerceDisplayDigits: coerceDisplayDigits,
            roundToNearest: roundToNearest
        });
    }());
