(function ($) {
    $.jqx.longInt = function () {
        var that = this;

        that.longObj = new Object();
        var longObj = that.longObj;
        longObj.mathObj = new Object();
        longObj.mathObj.Long = new Object();

        longObj.mathObj.Long = function (low, high) {
            this.lowBits = low | 0;
            this.highBits = high | 0;
        };

        longObj.mathObj.Long.IntCache = {};

        longObj.mathObj.Long.fromInt = function (value) {
            if (-128 <= value && value < 128) {
                var cachedObj = longObj.mathObj.Long.IntCache[value];
                if (cachedObj) {
                    return cachedObj;
                }
            }

            var obj = new longObj.mathObj.Long(value | 0, value < 0 ? -1 : 0);
            if (-128 <= value && value < 128) {
                longObj.mathObj.Long.IntCache[value] = obj;
            }
            return obj;
        };

        longObj.mathObj.Long.fromNumber = function (value) {
            if (isNaN(value) || !isFinite(value)) {
                return longObj.mathObj.Long.ZERO;
            } else if (value <= -longObj.mathObj.Long.TWO_PWR_63_DBL_) {
                return longObj.mathObj.Long.MIN_VALUE;
            } else if (value + 1 >= longObj.mathObj.Long.TWO_PWR_63_DBL_) {
                return longObj.mathObj.Long.MAX_VALUE;
            } else if (value < 0) {
                return longObj.mathObj.Long.fromNumber(-value).negate();
            } else {
                return new longObj.mathObj.Long(
    (value % longObj.mathObj.Long.TWO_PWR_32_DBL_) | 0,
    (value / longObj.mathObj.Long.TWO_PWR_32_DBL_) | 0);
            }
        };

        longObj.mathObj.Long.fromBits = function (lowBits, highBits) {
            return new longObj.mathObj.Long(lowBits, highBits);
        };

        longObj.mathObj.Long.fromString = function (str, optRadix) {
            if (str.length === 0) {
                throw new Error('number format error: empty string');
            }

            var radix = optRadix || 10;
            if (radix < 2 || 36 < radix) {
                throw new Error('radix out of range: ' + radix);
            }

            if (str.charAt(0) === '-') {
                return longObj.mathObj.Long.fromString(str.substring(1), radix).negate();
            } else if (str.indexOf('-') >= 0) {
                throw new Error('number format error: interior "-" character: ' + str);
            }

            var radixToPower = longObj.mathObj.Long.fromNumber(Math.pow(radix, 8));

            var result = longObj.mathObj.Long.ZERO;
            for (var i = 0; i < str.length; i += 8) {
                var size = Math.min(8, str.length - i);
                var value = parseInt(str.substring(i, i + size), radix);
                if (size < 8) {
                    var power = longObj.mathObj.Long.fromNumber(Math.pow(radix, size));
                    result = result.multiply(power).add(longObj.mathObj.Long.fromNumber(value));
                } else {
                    result = result.multiply(radixToPower);
                    result = result.add(longObj.mathObj.Long.fromNumber(value));
                }
            }
            return result;
        };

        longObj.mathObj.Long.TWO_PWR_16_DBL_ = 1 << 16;
        longObj.mathObj.Long.TWO_PWR_24_DBL_ = 1 << 24;
        longObj.mathObj.Long.TWO_PWR_32_DBL_ =
longObj.mathObj.Long.TWO_PWR_16_DBL_ * longObj.mathObj.Long.TWO_PWR_16_DBL_;
        longObj.mathObj.Long.TWO_PWR_31_DBL_ =
longObj.mathObj.Long.TWO_PWR_32_DBL_ / 2;
        longObj.mathObj.Long.TWO_PWR_48_DBL_ =
longObj.mathObj.Long.TWO_PWR_32_DBL_ * longObj.mathObj.Long.TWO_PWR_16_DBL_;
        longObj.mathObj.Long.TWO_PWR_64_DBL_ =
longObj.mathObj.Long.TWO_PWR_32_DBL_ * longObj.mathObj.Long.TWO_PWR_32_DBL_;
        longObj.mathObj.Long.TWO_PWR_63_DBL_ =
longObj.mathObj.Long.TWO_PWR_64_DBL_ / 2;
        longObj.mathObj.Long.ZERO = longObj.mathObj.Long.fromInt(0);
        longObj.mathObj.Long.ONE = longObj.mathObj.Long.fromInt(1);
        longObj.mathObj.Long.NEG_ONE = longObj.mathObj.Long.fromInt(-1);
        longObj.mathObj.Long.MAX_VALUE =
longObj.mathObj.Long.fromBits(0xFFFFFFFF | 0, 0x7FFFFFFF | 0);
        longObj.mathObj.Long.MIN_VALUE = longObj.mathObj.Long.fromBits(0, 0x80000000 | 0);
        longObj.mathObj.Long.TWO_PWR_24_ = longObj.mathObj.Long.fromInt(1 << 24);

        longObj.mathObj.Long.prototype.toInt = function () {
            return this.lowBits;
        };

        longObj.mathObj.Long.prototype.toNumber = function () {
            return this.highBits * longObj.mathObj.Long.TWO_PWR_32_DBL_ +
     this.getLowBitsUnsigned();
        };

        longObj.mathObj.Long.prototype.toString = function (optRadix) {
            var radix = optRadix || 10;
            if (radix < 2 || 36 < radix) {
                throw new Error('radix out of range: ' + radix);
            }

            if (this.isZero()) {
                return '0';
            }

            var rem, result;

            function negativeBinary(result, radix) {
                var reversedResult = '';
                while (result.length < 64) {
                    result = '0' + result;
                }

                for (var i = 0; i < result.length; i++) {
                    var reversedDigit = result.charAt(i) === '1' ? '0' : '1';
                    reversedResult += reversedDigit;
                }

                var plusOne = true;
                var finalResult = '';

                for (var j = reversedResult.length - 1; j >= 0; j--) {
                    var currentDigit = reversedResult.charAt(j);
                    var newDigit;

                    if (currentDigit === '0') {
                        if (plusOne === true) {
                            newDigit = '1';
                            plusOne = false;
                        } else {
                            newDigit = '0';
                        }
                    } else {
                        if (plusOne === true) {
                            newDigit = '0';
                        } else {
                            newDigit = '1';
                        }
                    }
                    finalResult = newDigit + '' + finalResult;
                }

                switch (radix) {
                    case 2:
                        return finalResult;
                    case 8:
                        finalResult = '00' + finalResult;
                        var octResult = '';
                        for (var k = 22; k >= 1; k--) {
                            var currentOct = finalResult[k * 3 - 3] + '' + finalResult[k * 3 - 2] + '' + finalResult[k * 3 - 1];
                            octResult = parseInt(currentOct, 2).toString(8) + '' + octResult;
                        }
                        return octResult;
                    case 16:
                        var hexResult = '';
                        for (var l = 16; l >= 1; l--) {
                            var currentHex = finalResult[l * 4 - 4] + '' + finalResult[l * 4 - 3] + '' + finalResult[l * 4 - 2] + '' + finalResult[l * 4 - 1];
                            hexResult = parseInt(currentHex, 2).toString(16) + '' + hexResult;
                        }
                        return hexResult;
                }
            };

            if (this.isNegative()) {
                if (this.equals(longObj.mathObj.Long.MIN_VALUE)) {
                    var radixLong = longObj.mathObj.Long.fromNumber(radix);
                    var div = this.div(radixLong);
                    rem = div.multiply(radixLong).subtract(this);
                    return div.toString(radix) + rem.toInt().toString(radix);
                } else {
                    switch (radix) {
                        case 2:
                        case 8:
                        case 16:
                            result = this.negate().toString(2);
                            return negativeBinary(result, radix);
                        default:
                            result = '-' + this.negate().toString(radix);
                            return result;
                    }
                }
            }

            var radixToPower = longObj.mathObj.Long.fromNumber(Math.pow(radix, 6));

            rem = this;
            result = '';
            while (true) {
                var remDiv = rem.div(radixToPower);
                var intval = rem.subtract(remDiv.multiply(radixToPower)).toInt();
                var digits = intval.toString(radix);

                rem = remDiv;
                if (rem.isZero()) {
                    return digits + result;
                } else {
                    while (digits.length < 6) {
                        digits = '0' + digits;
                    }
                    result = '' + digits + result;
                }
            }
        };


        longObj.mathObj.Long.prototype.getHighBits = function () {
            return this.highBits;
        };

        longObj.mathObj.Long.prototype.getLowBits = function () {
            return this.lowBits;
        };

        longObj.mathObj.Long.prototype.getLowBitsUnsigned = function () {
            return (this.lowBits >= 0) ?
  this.lowBits : longObj.mathObj.Long.TWO_PWR_32_DBL_ + this.lowBits;
        };

        longObj.mathObj.Long.prototype.getNumBitsAbs = function () {
            if (this.isNegative()) {
                if (this.equals(longObj.mathObj.Long.MIN_VALUE)) {
                    return 64;
                } else {
                    return this.negate().getNumBitsAbs();
                }
            } else {
                var val = this.highBits !== 0 ? this.highBits : this.lowBits;
                for (var bit = 31; bit > 0; bit--) {
                    if ((val & (1 << bit)) !== 0) {
                        break;
                    }
                }
                return this.highBits !== 0 ? bit + 33 : bit + 1;
            }
        };

        longObj.mathObj.Long.prototype.isZero = function () {
            return this.highBits === 0 && this.lowBits === 0;
        };

        longObj.mathObj.Long.prototype.isNegative = function () {
            return this.highBits < 0;
        };

        longObj.mathObj.Long.prototype.isOdd = function () {
            return (this.lowBits & 1) === 1;
        };

        longObj.mathObj.Long.prototype.equals = function (other) {
            return (this.highBits === other.highBits) && (this.lowBits === other.lowBits);
        };

        longObj.mathObj.Long.prototype.notEquals = function (other) {
            return (this.highBits !== other.highBits) || (this.lowBits !== other.lowBits);
        };

        longObj.mathObj.Long.prototype.lessThan = function (other) {
            return this.compare(other) < 0;
        };

        longObj.mathObj.Long.prototype.lessThanOrEqual = function (other) {
            return this.compare(other) <= 0;
        };

        longObj.mathObj.Long.prototype.greaterThan = function (other) {
            return this.compare(other) > 0;
        };

        longObj.mathObj.Long.prototype.greaterThanOrEqual = function (other) {
            return this.compare(other) >= 0;
        };

        longObj.mathObj.Long.prototype.compare = function (other) {
            if (this.equals(other)) {
                return 0;
            }

            var thisNeg = this.isNegative();
            var otherNeg = other.isNegative();
            if (thisNeg && !otherNeg) {
                return -1;
            }
            if (!thisNeg && otherNeg) {
                return 1;
            }

            if (this.subtract(other).isNegative()) {
                return -1;
            } else {
                return 1;
            }
        };


        longObj.mathObj.Long.prototype.negate = function () {
            if (this.equals(longObj.mathObj.Long.MIN_VALUE)) {
                return longObj.mathObj.Long.MIN_VALUE;
            } else {
                return this.not().add(longObj.mathObj.Long.ONE);
            }
        };

        longObj.mathObj.Long.prototype.add = function (other) {
            var a48 = this.highBits >>> 16;
            var a32 = this.highBits & 0xFFFF;
            var a16 = this.lowBits >>> 16;
            var a00 = this.lowBits & 0xFFFF;

            var b48 = other.highBits >>> 16;
            var b32 = other.highBits & 0xFFFF;
            var b16 = other.lowBits >>> 16;
            var b00 = other.lowBits & 0xFFFF;

            var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
            c00 += a00 + b00;
            c16 += c00 >>> 16;
            c00 &= 0xFFFF;
            c16 += a16 + b16;
            c32 += c16 >>> 16;
            c16 &= 0xFFFF;
            c32 += a32 + b32;
            c48 += c32 >>> 16;
            c32 &= 0xFFFF;
            c48 += a48 + b48;
            c48 &= 0xFFFF;
            return longObj.mathObj.Long.fromBits((c16 << 16) | c00, (c48 << 16) | c32);
        };

        longObj.mathObj.Long.prototype.subtract = function (other) {
            return this.add(other.negate());
        };

        longObj.mathObj.Long.prototype.multiply = function (other) {
            if (this.isZero()) {
                return longObj.mathObj.Long.ZERO;
            } else if (other.isZero()) {
                return longObj.mathObj.Long.ZERO;
            }

            if (this.equals(longObj.mathObj.Long.MIN_VALUE)) {
                return other.isOdd() ? longObj.mathObj.Long.MIN_VALUE : longObj.mathObj.Long.ZERO;
            } else if (other.equals(longObj.mathObj.Long.MIN_VALUE)) {
                return this.isOdd() ? longObj.mathObj.Long.MIN_VALUE : longObj.mathObj.Long.ZERO;
            }

            if (this.isNegative()) {
                if (other.isNegative()) {
                    return this.negate().multiply(other.negate());
                } else {
                    return this.negate().multiply(other).negate();
                }
            } else if (other.isNegative()) {
                return this.multiply(other.negate()).negate();
            }

            if (this.lessThan(longObj.mathObj.Long.TWO_PWR_24_) &&
  other.lessThan(longObj.mathObj.Long.TWO_PWR_24_)) {
                return longObj.mathObj.Long.fromNumber(this.toNumber() * other.toNumber());
            }

            var a48 = this.highBits >>> 16;
            var a32 = this.highBits & 0xFFFF;
            var a16 = this.lowBits >>> 16;
            var a00 = this.lowBits & 0xFFFF;

            var b48 = other.highBits >>> 16;
            var b32 = other.highBits & 0xFFFF;
            var b16 = other.lowBits >>> 16;
            var b00 = other.lowBits & 0xFFFF;

            var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
            c00 += a00 * b00;
            c16 += c00 >>> 16;
            c00 &= 0xFFFF;
            c16 += a16 * b00;
            c32 += c16 >>> 16;
            c16 &= 0xFFFF;
            c16 += a00 * b16;
            c32 += c16 >>> 16;
            c16 &= 0xFFFF;
            c32 += a32 * b00;
            c48 += c32 >>> 16;
            c32 &= 0xFFFF;
            c32 += a16 * b16;
            c48 += c32 >>> 16;
            c32 &= 0xFFFF;
            c32 += a00 * b32;
            c48 += c32 >>> 16;
            c32 &= 0xFFFF;
            c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
            c48 &= 0xFFFF;
            return longObj.mathObj.Long.fromBits((c16 << 16) | c00, (c48 << 16) | c32);
        };

        longObj.mathObj.Long.prototype.div = function (other) {
            if (other.isZero()) {
                throw new Error('division by zero');
            } else if (this.isZero()) {
                return longObj.mathObj.Long.ZERO;
            }

            var approx, rem;

            if (this.equals(longObj.mathObj.Long.MIN_VALUE)) {
                if (other.equals(longObj.mathObj.Long.ONE) ||
    other.equals(longObj.mathObj.Long.NEG_ONE)) {
                    return longObj.mathObj.Long.MIN_VALUE;
                } else if (other.equals(longObj.mathObj.Long.MIN_VALUE)) {
                    return longObj.mathObj.Long.ONE;
                } else {
                    var halfThis = this.shiftRight(1);
                    approx = halfThis.div(other).shiftLeft(1);
                    if (approx.equals(longObj.mathObj.Long.ZERO)) {
                        return other.isNegative() ? longObj.mathObj.Long.ONE : longObj.mathObj.Long.NEG_ONE;
                    } else {
                        rem = this.subtract(other.multiply(approx));
                        var result = approx.add(rem.div(other));
                        return result;
                    }
                }
            } else if (other.equals(longObj.mathObj.Long.MIN_VALUE)) {
                return longObj.mathObj.Long.ZERO;
            }

            if (this.isNegative()) {
                if (other.isNegative()) {
                    return this.negate().div(other.negate());
                } else {
                    return this.negate().div(other).negate();
                }
            } else if (other.isNegative()) {
                return this.div(other.negate()).negate();
            }

            var res = longObj.mathObj.Long.ZERO;
            rem = this;
            while (rem.greaterThanOrEqual(other)) {
                approx = Math.max(1, Math.floor(rem.toNumber() / other.toNumber()));

                var log2 = Math.ceil(Math.log(approx) / Math.LN2);
                var delta = (log2 <= 48) ? 1 : Math.pow(2, log2 - 48);

                var approxRes = longObj.mathObj.Long.fromNumber(approx);
                var approxRem = approxRes.multiply(other);
                while (approxRem.isNegative() || approxRem.greaterThan(rem)) {
                    approx -= delta;
                    approxRes = longObj.mathObj.Long.fromNumber(approx);
                    approxRem = approxRes.multiply(other);
                }

                if (approxRes.isZero()) {
                    approxRes = longObj.mathObj.Long.ONE;
                }

                res = res.add(approxRes);
                rem = rem.subtract(approxRem);
            }
            return res;
        };

        longObj.mathObj.Long.prototype.modulo = function (other) {
            return this.subtract(this.div(other).multiply(other));
        };

        longObj.mathObj.Long.prototype.not = function () {
            return longObj.mathObj.Long.fromBits(~this.lowBits, ~this.highBits);
        };

        longObj.mathObj.Long.prototype.and = function (other) {
            return longObj.mathObj.Long.fromBits(this.lowBits & other.lowBits,
                             this.highBits & other.highBits);
        };

        longObj.mathObj.Long.prototype.or = function (other) {
            return longObj.mathObj.Long.fromBits(this.lowBits | other.lowBits,
                             this.highBits | other.highBits);
        };

        longObj.mathObj.Long.prototype.xor = function (other) {
            return longObj.mathObj.Long.fromBits(this.lowBits ^ other.lowBits,
                             this.highBits ^ other.highBits);
        };

        longObj.mathObj.Long.prototype.shiftLeft = function (numBits) {
            numBits &= 63;
            if (numBits === 0) {
                return this;
            } else {
                var low = this.lowBits;
                if (numBits < 32) {
                    var high = this.highBits;
                    return longObj.mathObj.Long.fromBits(
      low << numBits,
      (high << numBits) | (low >>> (32 - numBits)));
                } else {
                    return longObj.mathObj.Long.fromBits(0, low << (numBits - 32));
                }
            }
        };

        longObj.mathObj.Long.prototype.shiftRight = function (numBits) {
            numBits &= 63;
            if (numBits === 0) {
                return this;
            } else {
                var high = this.highBits;
                if (numBits < 32) {
                    var low = this.lowBits;
                    return longObj.mathObj.Long.fromBits(
      (low >>> numBits) | (high << (32 - numBits)),
      high >> numBits);
                } else {
                    return longObj.mathObj.Long.fromBits(
      high >> (numBits - 32),
      high >= 0 ? 0 : -1);
                }
            }
        };

        longObj.mathObj.Long.prototype.shiftRightUnsigned = function (numBits) {
            numBits &= 63;
            if (numBits === 0) {
                return this;
            } else {
                var high = this.highBits;
                if (numBits < 32) {
                    var low = this.lowBits;
                    return longObj.mathObj.Long.fromBits(
      (low >>> numBits) | (high << (32 - numBits)),
      high >>> numBits);
                } else if (numBits === 32) {
                    return longObj.mathObj.Long.fromBits(high, 0);
                } else {
                    return longObj.mathObj.Long.fromBits(high >>> (numBits - 32), 0);
                }
            }
        };
        return longObj;
    }

    $.jqx.math = function () {
        var mathObj = new Object();
        var longObj = new $.jqx.longInt();
        mathObj.getDecimalNotation = function (value, outputNotation, decimalDigits, digits) {
            if (outputNotation === 'decimal') {
                return value;
            }

            value = value.toString();

            function toSuperScript(value) {
                var chars = '-0123456789';
                var sup = '⁻⁰¹²³⁴⁵⁶⁷⁸⁹';
                var result = '';

                for (var i = 0; i < value.length; i++) {
                    var n = chars.indexOf(value.charAt(i));
                    result += (n !== -1 ? sup[n] : value[i]);
                }
                return result;
            }

            function exponentialToScientific(exponentialValue) {
                var indexOfE = exponentialValue.indexOf('e');
                var power = exponentialValue.slice(indexOfE + 1);
                var scientificValue = exponentialValue.slice(0, indexOfE + 1);
                scientificValue = scientificValue.replace('e', '×10');
                scientificValue += toSuperScript(power);
                scientificValue = scientificValue.replace('+', '');

                return scientificValue;
            }

            function exponentialToEngineering(exponentialValue) {
                var indexOfE = exponentialValue.indexOf('e');
                var power = exponentialValue.slice(indexOfE + 1);
                var coefficient = exponentialValue.slice(0, indexOfE);
                var remainderPower = parseInt(power, 10) % 3;

                coefficient = coefficient * Math.pow(10, remainderPower);
                if (power > 0) {
                    var floatFix = exponentialValue.slice(0, indexOfE).length - remainderPower - 2;
                    if (floatFix >= 0) {
                        coefficient = coefficient.toFixed(floatFix);
                    }
                }

                var finalPower = (parseInt(power, 10) - remainderPower);
                var sign;
                if (finalPower < 0) {
                    sign = '';
                } else {
                    sign = '+';
                }

                if (decimalDigits !== undefined) {
                    coefficient = Number(coefficient).toFixed(decimalDigits);
                } else if (digits !== undefined) {
                    coefficient = Number(Number(coefficient).toPrecision(digits)).toString();
                }

                var engineeringValue = coefficient + 'e' + sign + finalPower;

                return engineeringValue;
            }

            var exponentialValue = Number(value).toExponential();
            if (outputNotation === 'scientific') {
                return exponentialToScientific(exponentialValue);
            } else if (outputNotation === 'engineering') {
                return exponentialToEngineering(exponentialValue);
            } else {
                var fractionDigits;
                if (decimalDigits !== undefined) {
                    fractionDigits = decimalDigits;
                } else if (digits !== undefined) {
                    fractionDigits = digits - 1;
                }

                if (fractionDigits !== undefined) {
                    exponentialValue = Number(value).toExponential(fractionDigits);
                }
                return exponentialValue;
            }
        }
        mathObj.getRadixValue = function (value, int64, radix) {
            function dec2Float(expression) {

                var sci = new ScientificNumber("", "", "", "");
                var dec = new DecimalNumber("", "", "", "");
                var single = new IEEESingle("", "", "");

                sci.parse(expression);
                dec.fromScientific(sci, -45, 45);
                single.fromDecimal(dec);

                return (single.getHex());

            }
            function hex2bin(hexNumber) {

                var hexaString = "0123456789ABCDEF";
                var binaryArray = new Array("0000", "0001", "0010", "0011", "0100", "0101", "0110", "0111", "1000", "1001", "1010", "1011", "1100", "1101", "1110", "1111");

                var binaryString;

                binaryString = "";
                for (var index = 0; index < hexNumber.length; index++) {
                    binaryString += binaryArray[hexaString.indexOf(hexNumber.charAt(index))];
                }

                return binaryString;

            }
            function ScientificNumber(sign, firstCoefficient, otherCoefficients, exponent) {

                this.sign = sign;
                this.firstCoefficient = firstCoefficient;
                this.otherCoefficients = otherCoefficients;
                this.exponent = exponent;
                this.NaN = 0;
                this.infinity = 0;

                this.parse = ScientificNumber_parse;
            }
            function ScientificNumber_parse(numberString) {

                var char;
                var state;

                var PLUS;
                var MINUS;
                var DOT;
                var NZF;
                var F;
                var Z;
                var E;

                var sign;
                var coefficientFirst;
                var coefficientOthers;
                var expSign;
                var exponent;

                var noZeroCoefficientOthers;

                var temp;

                PLUS = "+";
                MINUS = "-";
                DOT = ".";
                NZF = "123456789";
                F = "0123456789";
                Z = "0";
                E = "Ee";

                sign = "+";
                coefficientFirst = "";
                coefficientOthers = "";
                expSign = 1;
                shift = 0;
                exponent = "";

                state = 0;

                for (var index = 0; index < numberString.length; index++) {

                    char = numberString.charAt(index);

                    switch (state) {
                        case 0:
                            state = -1;
                            if (PLUS.indexOf(char) != -1) { state = 1; sign = "+"; }
                            if (MINUS.indexOf(char) != -1) { state = 2; sign = "-"; }
                            if (NZF.indexOf(char) != -1) { state = 3; sign = "+"; coefficientFirst = char; }
                            if (DOT.indexOf(char) != -1) { state = 4; sign = "+"; shift--; }
                            if (Z.indexOf(char) != -1) { state = 5; sign = "+"; }
                            break;

                        case 1:
                            state = -1;
                            if (NZF.indexOf(char) != -1) { state = 3; coefficientFirst = char; }
                            if (DOT.indexOf(char) != -1) { state = 4; shift--; }
                            if (Z.indexOf(char) != -1) { state = 5; }
                            break;

                        case 2:
                            state = -1;
                            if (NZF.indexOf(char) != -1) { state = 3; coefficientFirst = char; }
                            if (DOT.indexOf(char) != -1) { state = 4; shift--; }
                            if (Z.indexOf(char) != -1) { state = 5; }
                            break;

                        case 3:
                            state = -1;
                            if (DOT.indexOf(char) != -1) { state = 6; }
                            if (F.indexOf(char) != -1) { state = 3; shift++; coefficientOthers += char; }
                            if (E.indexOf(char) != -1) { state = 9; }
                            break;

                        case 4:
                            state = -1;
                            if (NZF.indexOf(char) != -1) { state = 8; coefficientFirst = char; }
                            if (Z.indexOf(char) != -1) { state = 7; shift--; }
                            break;

                        case 5:
                            state = -1;
                            if (NZF.indexOf(char) != -1) { state = 3; coefficientFirst = char; }
                            if (DOT.indexOf(char) != -1) { state = 4; shift--; }
                            if (Z.indexOf(char) != -1) { state = 5; }
                            break;

                        case 6:
                            state = -1;
                            if (F.indexOf(char) != -1) { state = 6; coefficientOthers += char; }
                            if (E.indexOf(char) != -1) { state = 9; }
                            break;

                        case 7:
                            state = -1;
                            if (Z.indexOf(char) != -1) { state = 7; shift--; }
                            if (NZF.indexOf(char) != -1) { state = 8; coefficientFirst = char; }
                            if (E.indexOf(char) != -1) { state = 9; }
                            break;

                        case 8:
                            state = -1;
                            if (F.indexOf(char) != -1) { state = 8; coefficientOthers += char; }
                            if (E.indexOf(char) != -1) { state = 9; }
                            break;

                        case 9:
                            state = -1;
                            if (PLUS.indexOf(char) != -1) { state = 10; expSign = 1; }
                            if (MINUS.indexOf(char) != -1) { state = 11; expSign = -1; }
                            if (F.indexOf(char) != -1) { state = 12; expSign = 1; exponent += char; }
                            break;

                        case 10:
                            state = -1;
                            if (F.indexOf(char) != -1) { state = 12; exponent += char; }
                            break;

                        case 11:
                            state = -1;
                            if (F.indexOf(char) != -1) { state = 12; exponent += char; }
                            break;

                        case 12:
                            state = -1;
                            if (F.indexOf(char) != -1) { state = 12; exponent += char; }
                            break;

                    }

                }


                noZeroCoefficientOthers = "";

                if (state == -1) {

                    if (numberString.toLowerCase() == "infinity") {
                        this.sign = "+";
                        this.firstCoefficient = "";
                        this.otherCoefficients = "";
                        this.exponent = 0;
                        this.NaN = 0;
                        this.infinity = 1;

                        return 0;
                    }

                    else if (numberString.toLowerCase() == "+infinity") {
                        this.sign = "+";
                        this.firstCoefficient = "";
                        this.otherCoefficients = "";
                        this.exponent = 0;
                        this.NaN = 0;
                        this.infinity = 1;

                        return 0;
                    }

                    else if (numberString.toLowerCase() == "-infinity") {
                        this.sign = "-";
                        this.firstCoefficient = "";
                        this.otherCoefficients = "";
                        this.exponent = 0;
                        this.NaN = 0;
                        this.infinity = 1;

                        return 0;
                    }

                    else {

                        this.sign = "";
                        this.firstCoefficient = "";
                        this.otherCoefficients = "";
                        this.exponent = 0;
                        this.NaN = 1;
                        this.infinity = 0;

                        return -1;

                    }


                }

                state = 0;

                for (var index = coefficientOthers.length - 1; index >= 0; index--) {
                    char = coefficientOthers.charAt(index);

                    switch (state) {
                        case 0:
                            if (Z.indexOf(char) != -1) { state = 1; }
                            if (NZF.indexOf(char) != -1) { state = 2; noZeroCoefficientOthers = char + noZeroCoefficientOthers; }
                            break;

                        case 1:
                            if (Z.indexOf(char) != -1) { state = 1; }
                            if (NZF.indexOf(char) != -1) { state = 2; noZeroCoefficientOthers = char + noZeroCoefficientOthers; }
                            break;

                        case 2:
                            if (F.indexOf(char) != -1) { state = 2; noZeroCoefficientOthers = char + noZeroCoefficientOthers; }
                            break;
                    }

                }

                if (exponent == "") {
                    exponent = "0";
                }
                exponent = ((parseInt(exponent, 10)) * expSign + shift) + "";

                if (noZeroCoefficientOthers == "") {
                    noZeroCoefficientOthers = "0";
                }

                if (coefficientFirst == "") {
                    coefficientFirst = "0";
                    noZeroCoefficientOthers = "0";
                    expSign = "+";
                    exponent = "0";
                }

                this.sign = sign;
                this.firstCoefficient = coefficientFirst;
                this.otherCoefficients = noZeroCoefficientOthers;
                this.exponent = parseInt(exponent, 10);
                this.NaN = 0;
                this.infinity = 0;

                return 0;

            }
            function DecimalNumber(decInt, decFrac, sign, status) {

                this.integer = decInt;
                this.fractional = decFrac;
                this.sign = sign;
                this.status = status;

                this.fromScientific = DecimalNumber_fromScientific;
            }
            function DecimalNumber_fromScientific(sciNumber, expMin, expMax) {

                var integer;
                var fractional;



                if (sciNumber.NaN == 0) {

                    if (sciNumber.infinity == 1) {
                        this.integer = "0";
                        this.fractional = "0";
                        this.sign = sciNumber.sign;
                        this.status = "infinity";
                    }

                    else if ((sciNumber.exponent >= expMin) && (sciNumber.exponent <= expMax)) {

                        if (sciNumber.exponent < 0) {
                            integer = "0";
                            fractional = padZerosLeft(sciNumber.firstCoefficient + sciNumber.otherCoefficients, -1 * sciNumber.exponent - 1);
                        }

                        if (sciNumber.exponent >= 0) {
                            integer = (sciNumber.firstCoefficient + (sciNumber.otherCoefficients).substr(0, sciNumber.exponent));
                            integer = padZerosRight(integer, (sciNumber.exponent - (sciNumber.otherCoefficients).length));
                            fractional = (sciNumber.otherCoefficients).substr(sciNumber.exponent);

                            if (fractional == "") {
                                fractional = "0";
                            }
                        }

                        this.integer = integer;
                        this.fractional = fractional;
                        this.sign = sciNumber.sign;
                        this.status = "normal";

                    }

                    else if (sciNumber.exponent < expMin) {
                        this.integer = "0";
                        this.fractional = "0";
                        this.sign = sciNumber.sign;
                        this.status = "normal";
                    }

                    else if (sciNumber.exponent > expMax) {
                        this.integer = "";
                        this.fractional = "";
                        this.sign = sciNumber.sign;
                        this.status = "infinity";
                    }

                }
                else {
                    this.integer = "";
                    this.fractional = "";
                    this.sign = "";
                    this.status = "NaN";

                }

            }
            function IEEESingle(mantissa, exponent, sign) {

                this.mantissa = mantissa;
                this.exponent = exponent;
                this.sign = sign;

                this.getBinary = IEEESingle_getBinary;
                this.getHex = IEEESingle_getHex;
                this.fromDecimal = IEEESingle_fromDecimal;

            }
            function IEEESingle_fromDecimal(decNumber) {

                var decInt;
                var decFrac;
                var sign;

                decInt = decNumber.integer;
                decFrac = decNumber.fractional;
                sign = decNumber.sign;

                var binInt;
                var binFrac;
                var allString;
                var deNorm;

                var exponent;
                var mantissa;
                var temp;

                if (decNumber.status == "infinity") {
                    this.mantissa = "00000000000000000000000";
                    this.exponent = 128;
                    this.sign = sign;
                }

                else if (decNumber.status == "NaN") {
                    this.mantissa = "11111111111111111111111";
                    this.exponent = 128;
                    this.sign = "+";

                }

                else {

                    binInt = dec2binInt(decInt);

                    if (binInt != "0") {
                        binFrac = dec2binFrac(decFrac, 25 - binInt.length, 0);
                    }
                    else {

                        binFrac = dec2binFrac(decFrac, 25, 1);
                    }

                    if ((parseInt(binInt, 10) == 0) && (parseInt(binFrac, 10) == 0)) {

                        exponent = -127;
                        mantissa = "00000000000000000000000";
                    }
                    else {
                        allString = binInt + "." + binFrac;

                        exponent = allString.indexOf(".") - allString.indexOf("1");

                        if (exponent > 0) {
                            exponent--;
                        }

                        if (exponent < -126) {
                            deNorm = -126 - exponent;
                        }
                        else {
                            deNorm = 0;
                        }

                        allString = binInt + binFrac;

                        mantissa = allString.substr(allString.indexOf("1") + 1 - deNorm, 24);

                        temp = mantissa.length

                        for (var index = 0; index < (23 - temp); index++) {
                            mantissa += "0";
                        }

                        temp = roundBinary(mantissa.substr(0, 23), parseInt(mantissa.charAt(23), 10));


                        if (temp.length > 23) {
                            mantissa = temp.substr(1);
                            exponent++;
                        }
                        else {
                            mantissa = temp;
                        }

                        if (exponent < -126) {
                            exponent = -127;
                        }

                        if (exponent > 127) {
                            exponent = 128;
                            mantissa = "00000000000000000000000";
                        }
                    }

                    this.mantissa = mantissa;
                    this.exponent = exponent;
                    this.sign = sign;

                }

            }
            function IEEESingle_getBinary() {

                var exponent;
                var sign;

                var temp;

                exponent = dec2binInt((this.exponent + 127) + "");

                temp = 8 - exponent.length;

                for (var index = 0; index < temp; index++) {
                    exponent = "0" + exponent;
                }

                if (this.sign == "+") {
                    sign = "0";
                }
                else {
                    sign = "1";
                }

                return (sign + exponent + this.mantissa);

            }
            function IEEESingle_getHex() {
                return bin2hex(this.getBinary());
            }
            function padZerosLeft(expression, numberZeros) {

                for (var index = 0; index < numberZeros; index++) {
                    expression = "0" + expression;
                }

                return expression;

            }
            function dec2binInt(decString) {

                var bufferSize = 13;
                var bufferMax = 10000000000000;

                var remainder;
                var padDecString;

                var bufferArray = new Array();
                var indexArray;
                var lengthArray;
                var zeroIndex;

                var roundNumberFigures;
                var indexFigures;

                var binArray = new Array("000", "001", "010", "011", "100", "101", "110", "111");
                var outputBin;

                var checkAllZero;

                roundNumberFigures = Math.floor((Math.floor(Math.log(Math.pow(10, decString.length)) / Math.LN2) + 1) / 3) * 3 + 3;

                var carry;

                var temp;

                // Check if the number of characters is a multiple of the buffersize
                remainder = decString.length - (Math.floor(decString.length / bufferSize) * bufferSize);

                // If not, pad with zeros
                padDecString = decString;

                if (remainder != 0) {

                    for (var index = remainder; index < bufferSize; index++) {
                        padDecString = "0" + padDecString;
                    }

                }

                // Load string into array
                indexArray = 0;
                for (var index = 0; index < padDecString.length; index += bufferSize) {

                    bufferArray[indexArray] = parseInt(padDecString.substr(index, bufferSize), 10);

                    indexArray++;

                }

                lengthArray = indexArray;



                // Shift right

                outputBin = "";
                indexFigures = 0;
                zerosCount = 0;

                checkAllZero = 1;
                while ((indexFigures < roundNumberFigures) && (checkAllZero != 0)) {
                    carry = 0;
                    checkAllZero = 0;

                    for (var index = 0; index < lengthArray; index++) {

                        bufferArray[index] += (carry * bufferMax);

                        temp = Math.floor(bufferArray[index] / 8);

                        carry = bufferArray[index] - (temp * 8);

                        bufferArray[index] = temp;

                        checkAllZero += bufferArray[index];

                    }

                    outputBin = binArray[carry] + outputBin;

                    if (indexFigures != 0) {
                        indexFigures += 3;
                    }
                    else {
                        if (binArray[carry].indexOf("1") != -1) {
                            indexFigures = 3 - binArray[carry].indexOf("1");
                            zerosCount += 2 - binArray[carry].indexOf("1");
                        }
                        else {
                            zerosCount += 3;
                        }
                    }

                }

                // Remove extra zeros
                if (outputBin.indexOf("1") == -1) {
                    outputBin = "0";
                }
                else {
                    outputBin = outputBin.substr(outputBin.indexOf("1"));
                }

                return outputBin;


            }
            function dec2binFrac(decString, numberFigures, intPartIsZero) {

                var bufferSize = 15;
                var bufferMax = 1000000000000000;

                var remainder;
                var padDecString;

                var bufferArray = new Array();
                var indexArray;
                var lengthArray;
                var zeroIndex;

                var roundNumberFigures;
                var indexFigures;

                var binArray = new Array("000", "001", "010", "011", "100", "101", "110", "111");
                var outputBin;

                var checkAllZero;
                var zerosCount;

                roundNumberFigures = Math.floor(numberFigures / 3) * 3 + 3;

                var carry;

                var temp;

                // Check if the number of characters is a multiple of the buffersize
                remainder = decString.length - (Math.floor(decString.length / bufferSize) * bufferSize);

                // If not, pad with zeros
                padDecString = decString;

                if (remainder != 0) {

                    for (var index = remainder; index < bufferSize; index++) {
                        padDecString += "0";
                    }

                }


                // Load string into array
                indexArray = 0;
                for (var index = 0; index < padDecString.length; index += bufferSize) {

                    bufferArray[indexArray] = parseInt(padDecString.substr(index, bufferSize), 10);

                    indexArray++;

                }

                lengthArray = indexArray;


                // Shift left

                outputBin = "";
                if (intPartIsZero == 0) {
                    indexFigures = 0;
                }
                else {
                    indexFigures = -1;
                }
                zerosCount = 0;

                checkAllZero = 1;
                while ((indexFigures < roundNumberFigures) && (checkAllZero != 0)) {
                    carry = 0;
                    checkAllZero = 0;

                    for (var index = lengthArray - 1; index >= 0; index--) {
                        bufferArray[index] = bufferArray[index] * 8 + carry;

                        carry = Math.floor(bufferArray[index] / bufferMax);

                        bufferArray[index] -= carry * bufferMax;

                        checkAllZero += bufferArray[index];

                    }

                    outputBin += binArray[carry];

                    if (indexFigures != -1) {
                        indexFigures += 3;
                    }
                    else {
                        if (binArray[carry].indexOf("1") != -1) {
                            indexFigures = 3 - binArray[carry].indexOf("1");
                            zerosCount += binArray[carry].indexOf("1");
                        }
                        else {
                            zerosCount += 3;
                        }
                    }

                }

                // If not enough bits, pad with zeros
                if (outputBin.length < numberFigures) {

                    temp = numberFigures - outputBin.length;

                    for (var index = 0; index < temp; index++) {
                        outputBin += "0";
                    }
                }
                // Else remove extra bits
                else {
                    outputBin = outputBin.substr(0, zerosCount + numberFigures);
                }

                return outputBin;

            }
            function roundBinary(binString, carry) {

                var roundString;
                var sum;
                var digit;

                if (carry == 1) {
                    roundString = "";
                    for (var index = binString.length - 1; index >= 0; index--) {

                        digit = parseInt(binString.charAt(index), 10);

                        if ((carry == 1) && (digit == 1)) {
                            sum = 0;
                            carry = 1;
                        }
                        else if ((carry == 0) && (digit == 0)) {
                            sum = 0;
                            carry = 0;
                        }
                        else {
                            sum = 1;
                            carry = 0;
                        }

                        roundString = sum + roundString;
                    }

                    if (carry == 1) {
                        roundString = carry + roundString;
                    }

                }
                else {
                    roundString = binString;
                }

                return roundString;

            }
            function bin2hex(binNumber) {

                var arrayHex = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F");

                var hexNumber;

                hexNumber = "";

                for (var index = 0; index < binNumber.length; index += 4) {
                    hexNumber += arrayHex[parseInt(binNumber.substr(index, 4), 2)];
                }

                return hexNumber;

            }
            function padZerosRight(expression, numberZeros) {

                for (var index = 0; index < numberZeros; index++) {
                    expression = expression + "0";
                }

                return expression;

            }

            var result;
            switch (int64) {
                case false:
                    if (radix !== 10) {
                        //                        if (value % 1 === 0) {
                        //                            result = parseInt(value);
                        //                        } else {
                        var hexadecimal = dec2Float(value.toString()),
                                binary = hex2bin(hexadecimal);
                        switch (radix) {
                            case 2:
                                return binary;
                                break;
                            case 8:
                                return parseInt(binary, 2).toString(8)
                                break;
                            case 16:
                                return hexadecimal;
                                break;
                        }
                        // }

                        result = parseInt(value);
                    } else {
                        result = parseFloat(value);
                    }
                    result = result.toString(radix);
                    break;
                case 's':
                    var valueSInt64 = new $.jqx.longObj.mathObj.Long.fromString(value.toString(), 10);
                    result = valueSInt64.toString(radix);
                    break;
                case 'u':
                    var valueUInt64 = new BigNumber(value);
                    if (valueUInt64.compare(0) === -1) {
                        throw new Error('Unsigned 64-bit integers cannot be negative.');
                    }
                    result = valueUInt64.toString(radix);
                    break;
            }
            return result;
        }
        $.extend(mathObj, longObj.mathObj.Long);
        return mathObj;
    }

    //+ Jonas Raoni Soares Silva
    //@ http://jsfromhell.com/classes/bignumber [rev. #4]

    BigNumber = function (n, p, r) {
        var o = this, i;
        if (n instanceof BigNumber) {
            for (i in { precision: 0, roundType: 0, _s: 0, _f: 0 }) o[i] = n[i];
            o._d = n._d.slice();
            return;
        }
        o.precision = isNaN(p = Math.abs(p)) ? BigNumber.defaultPrecision : p;
        o.roundType = isNaN(r = Math.abs(r)) ? BigNumber.defaultRoundType : r;
        o._s = (n += "").charAt(0) == "-";
        o._f = ((n = n.replace(/[^\d.]/g, "").split(".", 2))[0] = n[0].replace(/^0+/, "") || "0").length;
        for (i = (n = o._d = (n.join("") || "0").split("")).length; i; n[--i] = +n[i]);
        o.round();
    };
    with ({ $: BigNumber, o: BigNumber.prototype }) {
        $.ROUND_HALF_EVEN = ($.ROUND_HALF_DOWN = ($.ROUND_HALF_UP = ($.ROUND_FLOOR = ($.ROUND_CEIL = ($.ROUND_DOWN = ($.ROUND_UP = 0) + 1) + 1) + 1) + 1) + 1) + 1;
        $.defaultPrecision = 40;
        $.defaultRoundType = $.ROUND_HALF_UP;
        o.add = function (n) {
            if (this._s != (n = new BigNumber(n))._s)
                return n._s ^= 1, this.subtract(n);
            var o = new BigNumber(this), a = o._d, b = n._d, la = o._f,
		lb = n._f, n = Math.max(la, lb), i, r;
            la != lb && ((lb = la - lb) > 0 ? o._zeroes(b, lb, 1) : o._zeroes(a, -lb, 1));
            i = (la = a.length) == (lb = b.length) ? a.length : ((lb = la - lb) > 0 ? o._zeroes(b, lb) : o._zeroes(a, -lb)).length;
            for (r = 0; i; r = (a[--i] = a[i] + b[i] + r) / 10 >>> 0, a[i] %= 10);
            return r && ++n && a.unshift(r), o._f = n, o.round();
        };
        o.subtract = function (n) {
            if (this._s != (n = new BigNumber(n))._s)
                return n._s ^= 1, this.add(n);
            var o = new BigNumber(this), c = o.abs().compare(n.abs()) + 1, a = c ? o : n, b = c ? n : o, la = a._f, lb = b._f, d = la, i, j;
            a = a._d, b = b._d, la != lb && ((lb = la - lb) > 0 ? o._zeroes(b, lb, 1) : o._zeroes(a, -lb, 1));
            for (i = (la = a.length) == (lb = b.length) ? a.length : ((lb = la - lb) > 0 ? o._zeroes(b, lb) : o._zeroes(a, -lb)).length; i; ) {
                if (a[--i] < b[i]) {
                    for (j = i; j && !a[--j]; a[j] = 9);
                    --a[j], a[i] += 10;
                }
                b[i] = a[i] - b[i];
            }
            return c || (o._s ^= 1), o._f = d, o._d = b, o.round();
        };
        o.multiply = function (n) {
            var o = new BigNumber(this), r = o._d.length >= (n = new BigNumber(n))._d.length, a = (r ? o : n)._d,
		b = (r ? n : o)._d, la = a.length, lb = b.length, x = new BigNumber, i, j, s;
            for (i = lb; i; r && s.unshift(r), x.set(x.add(new BigNumber(s.join("")))))
                for (s = (new Array(lb - --i)).join("0").split(""), r = 0, j = la; j; r += a[--j] * b[i], s.unshift(r % 10), r = (r / 10) >>> 0);
            return o._s = o._s != n._s, o._f = ((r = la + lb - o._f - n._f) >= (j = (o._d = x._d).length) ? this._zeroes(o._d, r - j + 1, 1).length : j) - r, o.round();
        };
        o.divide = function (n) {
            if ((n = new BigNumber(n)) == "0")
                throw new Error("Division by 0");
            else if (this == "0")
                return new BigNumber;
            var o = new BigNumber(this), a = o._d, b = n._d, la = a.length - o._f,
		lb = b.length - n._f, r = new BigNumber, i = 0, j, s, l, f = 1, c = 0, e = 0;
            r._s = o._s != n._s, r.precision = Math.max(o.precision, n.precision),
		r._f = +r._d.pop(), la != lb && o._zeroes(la > lb ? b : a, Math.abs(la - lb));
            n._f = b.length, b = n, b._s = false, b = b.round();
            for (n = new BigNumber; a[0] == "0"; a.shift());
            out:
            do {
                for (l = c = 0, n == "0" && (n._d = [], n._f = 0); i < a.length && n.compare(b) == -1; ++i) {
                    (l = i + 1 == a.length, (!f && ++c > 1 || (e = l && n == "0" && a[i] == "0")))
				&& (r._f == r._d.length && ++r._f, r._d.push(0));
                    (a[i] == "0" && n == "0") || (n._d.push(a[i]), ++n._f);
                    if (e)
                        break out;
                    if ((l && n.compare(b) == -1 && (r._f == r._d.length && ++r._f, 1)) || (l = 0))
                        while (r._d.push(0), n._d.push(0), ++n._f, n.compare(b) == -1);
                }
                if (f = 0, n.compare(b) == -1 && !(l = 0))
                    while (l ? r._d.push(0) : l = 1, n._d.push(0), ++n._f, n.compare(b) == -1);
                for (s = new BigNumber, j = 0; n.compare(y = s.add(b)) + 1 && ++j; s.set(y));
                n.set(n.subtract(s)), !l && r._f == r._d.length && ++r._f, r._d.push(j);
            }
            while ((i < a.length || n != "0") && (r._d.length - r._f) <= r.precision);
            return r.round();
        };
        o.mod = function (n) {
            return this.subtract(this.divide(n).intPart().multiply(n));
        };
        o.pow = function (n) {
            var o = new BigNumber(this), i;
            if ((n = (new BigNumber(n)).intPart()) == 0) return o.set(1);
            for (i = Math.abs(n); --i; o.set(o.multiply(this)));
            return n < 0 ? o.set((new BigNumber(1)).divide(o)) : o;
        };
        o.set = function (n) {
            return this.constructor(n), this;
        };
        o.compare = function (n) {
            var a = this, la = this._f, b = new BigNumber(n), lb = b._f, r = [-1, 1], i, l, arr;
            if (a._s != b._s)
                return a._s ? -1 : 1;
            if (la != lb)
                return r[(la > lb) ^ a._s];
            for (la = (arr = a._d).length, lb = (b = b._d).length, i = -1, l = Math.min(la, lb) ; ++i < l;)
                if (arr[i] != b[i])
                    return r[(arr[i] > b[i]) ^ a._s];
            return la != lb ? r[(la > lb) ^ a._s] : 0;
        };
        o.negate = function () {
            var n = new BigNumber(this); return n._s ^= 1, n;
        };
        o.abs = function () {
            var n = new BigNumber(this); return n._s = 0, n;
        };
        o.intPart = function () {
            return new BigNumber((this._s ? "-" : "") + (this._d.slice(0, this._f).join("") || "0"));
        };
        o.valueOf = o.toString = function (radix) {
            function toBinary() {
                var two = new BigNumber(2),
                temp = o,
                remainder,
                remaindersArray = [];
                do {
                    remainder = temp.mod(two);
                    remaindersArray.push(remainder.toString());
                    temp = temp.subtract(remainder).divide(two).intPart();
                }
                while (temp.compare(new BigNumber(0)) === 1);
                return remaindersArray.reverse().join('');
            }
            function toOctal(binary) {
                var result = '';
                while (binary.length % 3 !== 0) {
                    binary = '0' + binary;
                }
                for (var k = binary.length / 3; k >= 1; k--) {
                    var currentOct = binary[k * 3 - 3] + '' + binary[k * 3 - 2] + '' + binary[k * 3 - 1];
                    result = parseInt(currentOct, 2).toString(8) + '' + result;
                }
                return result;
            }
            function toHexadecimal(binary) {
                var result = '';
                while (binary.length % 4 !== 0) {
                    binary = '0' + binary;
                }
                for (var l = binary.length / 4; l >= 1; l--) {
                    var currentHex = binary[l * 4 - 4] + '' + binary[l * 4 - 3] + '' + binary[l * 4 - 2] + '' + binary[l * 4 - 1];
                    result = parseInt(currentHex, 2).toString(16) + '' + result;
                }
                return result;
            }

            var o = this,
            decimal = (o._s ? "-" : "") + (o._d.slice(0, o._f).join("") || "0") + (o._f != o._d.length ? "." + o._d.slice(o._f).join("") : ""),
            result;

            if (radix === undefined) {
                radix = 10;
            }
            switch (radix) {
                case 10:
                    result = decimal;
                    break;
                case 2:
                    result = toBinary();
                    break;
                case 8:
                    result = toOctal(toBinary());
                    break;
                case 16:
                    result = toHexadecimal(toBinary());
                    break;
            }
            return result;
        };
        o._zeroes = function (n, l, t) {
            var s = ["push", "unshift"][t || 0];
            for (++l; --l; n[s](0));
            return n;
        };
        o.round = function () {
            if ("_rounding" in this) return this;
            var $ = BigNumber, r = this.roundType, b = this._d, d, p, n, x;
            for (this._rounding = true; this._f > 1 && !b[0]; --this._f, b.shift());
            for (d = this._f, p = this.precision + d, n = b[p]; b.length > d && !b[b.length - 1]; b.pop());
            x = (this._s ? "-" : "") + (p - d ? "0." + this._zeroes([], p - d - 1).join("") : "") + 1;
            if (b.length > p) {
                n && (r == $.DOWN ? false : r == $.UP ? true : r == $.CEIL ? !this._s
			: r == $.FLOOR ? this._s : r == $.HALF_UP ? n >= 5 : r == $.HALF_DOWN ? n > 5
			: r == $.HALF_EVEN ? n >= 5 && b[p - 1] & 1 : false) && this.add(x);
                b.splice(p, b.length - p);
            }
            return delete this._rounding, this;
        };
    }
})(jqxBaseFramework);