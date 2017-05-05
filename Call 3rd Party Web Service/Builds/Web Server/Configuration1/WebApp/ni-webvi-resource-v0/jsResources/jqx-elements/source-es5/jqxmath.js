'use strict';

(function (window) {
    'use strict';
    //+ Jonas Raoni Soares Silva
    //@ http://jsfromhell.com/classes/bignumber [rev. #4]

    window.BigNumber = function (n, p, r) {
        var o = this,
            i;
        if (n instanceof BigNumber) {
            for (i in { precision: 0, roundType: 0, _s: 0, _f: 0 }) {
                o[i] = n[i];
            }o._d = n._d.slice();

            if (n._s && n._d.length === 1 && n._d[0] === 0) {
                // n is -0
                o._s = false;
            }

            return;
        }

        if (n !== undefined) {
            if (n === '-0') {
                n = '0';
            }

            // exponential notation support
            if (new RegExp(/e/i).test(n)) {
                var stringExponential = n.toString().toLowerCase(),
                    indexOfE = stringExponential.indexOf('e'),
                    mantissa = new BigNumber(stringExponential.slice(0, indexOfE)),
                    exponent = stringExponential.slice(indexOfE + 2),
                    sign = stringExponential.slice(indexOfE + 1, indexOfE + 2),
                    bigTen = new BigNumber(10),
                    multyplyBy = bigTen.pow(sign + exponent),
                    result = mantissa.multiply(multyplyBy);

                n = result.toString();
            }
        }

        o.precision = isNaN(p = Math.abs(p)) ? BigNumber.defaultPrecision : p;
        o.roundType = isNaN(r = Math.abs(r)) ? BigNumber.defaultRoundType : r;
        o._s = (n += '').charAt(0) == '-';
        o._f = ((n = n.replace(/[^\d.]/g, '').split('.', 2))[0] = n[0].replace(/^0+/, '') || '0').length;
        for (i = (n = o._d = (n.join('') || '0').split('')).length; i; n[--i] = +n[i]) {}
        o.round();
    };
    var $ = BigNumber,
        o = BigNumber.prototype;

    $.ROUND_HALF_EVEN = ($.ROUND_HALF_DOWN = ($.ROUND_HALF_UP = ($.ROUND_FLOOR = ($.ROUND_CEIL = ($.ROUND_DOWN = ($.ROUND_UP = 0) + 1) + 1) + 1) + 1) + 1) + 1;
    $.defaultPrecision = 40;
    $.defaultRoundType = $.ROUND_HALF_UP;
    o.add = function (n) {
        if (this.isZero() && this._s) {
            // this.toString() is '-0'
            this._s = false;
        }

        if (n === 0 || n.constructor === BigNumber && n._d.length === 1 && n._d[0] === 0) {
            return new BigNumber(this);
        }

        if (this._s != (n = new BigNumber(n))._s) return n._s ^= 1, this.subtract(n);
        var o = new BigNumber(this),
            a = o._d,
            b = n._d,
            la = o._f,
            lb = n._f,
            i,
            r;
        n = Math.max(la, lb);
        la != lb && ((lb = la - lb) > 0 ? o._zeroes(b, lb, 1) : o._zeroes(a, -lb, 1));
        i = (la = a.length) == (lb = b.length) ? a.length : ((lb = la - lb) > 0 ? o._zeroes(b, lb) : o._zeroes(a, -lb)).length;
        for (r = 0; i; r = (a[--i] = a[i] + b[i] + r) / 10 >>> 0, a[i] %= 10) {}
        return r && ++n && a.unshift(r), o._f = n, o.round();
    };
    o.subtract = function (n) {
        if (this.isZero() && this._s) {
            // this.toString() is '-0'
            this._s = false;
        }

        if (n === 0 || n.constructor === BigNumber && n._d.length === 1 && n._d[0] === 0) {
            return new BigNumber(this);
        }

        if (this._s != (n = new BigNumber(n))._s) return n._s ^= 1, this.add(n);
        var o = new BigNumber(this),
            c = o.abs().compare(n.abs()) + 1,
            a = c ? o : n,
            b = c ? n : o,
            la = a._f,
            lb = b._f,
            d = la,
            i,
            j;
        a = a._d, b = b._d, la != lb && ((lb = la - lb) > 0 ? o._zeroes(b, lb, 1) : o._zeroes(a, -lb, 1));
        for (i = (la = a.length) == (lb = b.length) ? a.length : ((lb = la - lb) > 0 ? o._zeroes(b, lb) : o._zeroes(a, -lb)).length; i;) {
            if (a[--i] < b[i]) {
                for (j = i; j && !a[--j]; a[j] = 9) {}
                --a[j], a[i] += 10;
            }
            b[i] = a[i] - b[i];
        }
        return c || (o._s ^= 1), o._f = d, o._d = b, o.round();
    };
    o.multiply = function (n) {
        var o = new BigNumber(this),
            r = o._d.length >= (n = new BigNumber(n))._d.length,
            a = (r ? o : n)._d,
            b = (r ? n : o)._d,
            la = a.length,
            lb = b.length,
            x = new BigNumber(),
            i,
            j,
            s;
        for (i = lb; i; r && s.unshift(r), x.set(x.add(new BigNumber(s.join(''))))) {
            for (s = new Array(lb - --i).join('0').split(''), r = 0, j = la; j; r += a[--j] * b[i], s.unshift(r % 10), r = r / 10 >>> 0) {}
        }return o._s = o._s != n._s, o._f = ((r = la + lb - o._f - n._f) >= (j = (o._d = x._d).length) ? this._zeroes(o._d, r - j + 1, 1).length : j) - r, o.round();
    };
    o.divide = function (n) {
        if ((n = new BigNumber(n)) == '0') throw new Error('Division by 0');else if (this == '0') return new BigNumber();
        var o = new BigNumber(this),
            a = o._d,
            b = n._d,
            la = a.length - o._f,
            lb = b.length - n._f,
            r = new BigNumber(),
            i = 0,
            j,
            s,
            l,
            f = 1,
            c = 0,
            e = 0;
        r._s = o._s != n._s, r.precision = Math.max(o.precision, n.precision), r._f = +r._d.pop(), la != lb && o._zeroes(la > lb ? b : a, Math.abs(la - lb));
        n._f = b.length, b = n, b._s = false, b = b.round();
        for (n = new BigNumber(); a[0] == '0'; a.shift()) {}
        out: do {
            for (l = c = 0, n == '0' && (n._d = [], n._f = 0); i < a.length && n.compare(b) == -1; ++i) {
                (l = i + 1 == a.length, !f && ++c > 1 || (e = l && n == '0' && a[i] == '0')) && (r._f == r._d.length && ++r._f, r._d.push(0));
                a[i] == '0' && n == '0' || (n._d.push(a[i]), ++n._f);
                if (e) break out;
                if (l && n.compare(b) == -1 && (r._f == r._d.length && ++r._f, 1) || (l = 0)) while (r._d.push(0), n._d.push(0), ++n._f, n.compare(b) == -1) {}
            }
            if (f = 0, n.compare(b) == -1 && !(l = 0)) while (l ? r._d.push(0) : l = 1, n._d.push(0), ++n._f, n.compare(b) == -1) {}
            var y;
            for (s = new BigNumber(), j = 0; n.compare(y = s.add(b)) + 1 && ++j; s.set(y)) {}
            n.set(n.subtract(s)), !l && r._f == r._d.length && ++r._f, r._d.push(j);
        } while ((i < a.length || n != '0') && r._d.length - r._f <= r.precision);
        return r.round();
    };
    o.mod = function (n) {
        var result = this.subtract(this.divide(n).intPart().multiply(n));
        if (result.isZero() && result._s) {
            result._s = !result._s;
        }
        return result;
    };
    o.pow = function (n) {
        var o = new BigNumber(this),
            i;
        if ((n = new BigNumber(n).intPart()) == 0) return o.set(1);
        for (i = Math.abs(n); --i; o.set(o.multiply(this))) {}
        return n < 0 ? o.set(new BigNumber(1).divide(o)) : o;
    };
    o.set = function (n) {
        return this.constructor(n), this;
    };
    o.compare = function (n) {
        var a = this,
            la = this._f,
            b = new BigNumber(n),
            lb = b._f,
            r = [-1, 1],
            i,
            l,
            arr;
        if (a.isZero() && b.isZero()) {
            return 0;
        }
        if (a._s != b._s) return a._s ? -1 : 1;
        if (la != lb) return r[la > lb ^ a._s];
        for (la = (arr = a._d).length, lb = (b = b._d).length, i = -1, l = Math.min(la, lb); ++i < l;) {
            if (arr[i] != b[i]) return r[arr[i] > b[i] ^ a._s];
        }return la != lb ? r[la > lb ^ a._s] : 0;
    };
    o.negate = function () {
        var n = new BigNumber(this);return n._s ^= 1, n;
    };
    o.abs = function () {
        var n = new BigNumber(this);return n._s = 0, n;
    };
    o.intPart = function () {
        return new BigNumber((this._s ? '-' : '') + (this._d.slice(0, this._f).join('') || '0'));
    };
    o.valueOf = o.toString = function (radix, wordLength) {
        function negativeBinary(result, radix, wordLength) {
            var reversedResult = '';

            if (String.prototype.repeat) {
                var zeroPadding = '0'.repeat(wordLength - result.length);
                result = zeroPadding + result;
            }{
                while (result.length < wordLength) {
                    result = '0' + result;
                }
            }

            reversedResult = result.replace(/0/g, 'a');
            reversedResult = reversedResult.replace(/1/g, 'b');
            reversedResult = reversedResult.replace(/a/g, '1');
            reversedResult = reversedResult.replace(/b/g, '0');

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
                    var totalOct, zeroesToAdd;
                    switch (wordLength) {
                        case 8:
                            totalOct = 3;
                            zeroesToAdd = '0';
                            break;
                        case 16:
                            totalOct = 6;
                            zeroesToAdd = '00';
                            break;
                        case 32:
                            totalOct = 11;
                            zeroesToAdd = '0';
                            break;
                        case 64:
                            totalOct = 22;
                            zeroesToAdd = '00';
                            break;
                    }

                    finalResult = zeroesToAdd + finalResult;
                    var octResult = '';
                    for (var k = totalOct; k >= 1; k--) {
                        var currentOct = finalResult[k * 3 - 3] + '' + finalResult[k * 3 - 2] + '' + finalResult[k * 3 - 1];
                        octResult = parseInt(currentOct, 2).toString(8) + '' + octResult;
                    }
                    return octResult;
                case 16:
                    var totalHex;
                    switch (wordLength) {
                        case 8:
                            totalHex = 2;
                            break;
                        case 16:
                            totalHex = 4;
                            break;
                        case 32:
                            totalHex = 8;
                            break;
                        case 64:
                            totalHex = 16;
                            break;
                    }

                    var hexResult = '';
                    for (var l = totalHex; l >= 1; l--) {
                        var currentHex = finalResult[l * 4 - 4] + '' + finalResult[l * 4 - 3] + '' + finalResult[l * 4 - 2] + '' + finalResult[l * 4 - 1];
                        hexResult = parseInt(currentHex, 2).toString(16) + '' + hexResult;
                    }
                    return hexResult.toUpperCase();
            }
        }

        function toBinary(positiveNumber) {
            var two = new BigNumber(2),
                remainder,
                remaindersArray = [],
                temp;
            if (positiveNumber === undefined) {
                temp = o;
            } else {
                temp = positiveNumber;
            }
            do {
                remainder = temp.mod(two);
                remaindersArray.push(remainder.toString());
                temp = temp.subtract(remainder).divide(two).intPart();
            } while (temp.compare(new BigNumber(0)) === 1);
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
            decimal = (o._s ? '-' : '') + (o._d.slice(0, o._f).join('') || '0') + (o._f != o._d.length ? '.' + o._d.slice(o._f).join('') : ''),
            result;

        if (radix === undefined) {
            radix = 10;
        }

        if (radix === 10) {
            return decimal;
        }

        if (this.compare(0) > -1) {
            switch (radix) {
                case 2:
                    result = toBinary();
                    break;
                case 8:
                    result = toOctal(toBinary());
                    break;
                case 16:
                    result = toHexadecimal(toBinary()).toUpperCase();
                    break;
            }
        } else {
            var positiveNumber = o.negate(),
                positiveBinary = toBinary(positiveNumber);
            result = negativeBinary(positiveBinary, radix, wordLength);
        }

        return result;
    };
    o._zeroes = function (n, l, t) {
        var s = ['push', 'unshift'][t || 0];
        for (++l; --l; n[s](0)) {}
        return n;
    };
    o.round = function () {
        if ('_rounding' in this) return this;
        var $ = BigNumber,
            r = this.roundType,
            b = this._d,
            d,
            p,
            n,
            x;
        for (this._rounding = true; this._f > 1 && !b[0]; --this._f, b.shift()) {}
        for (d = this._f, p = this.precision + d, n = b[p]; b.length > d && !b[b.length - 1]; b.pop()) {}
        x = (this._s ? '-' : '') + (p - d ? '0.' + this._zeroes([], p - d - 1).join('') : '') + 1;
        if (b.length > p) {
            n && (r == $.DOWN ? false : r == $.UP ? true : r == $.CEIL ? !this._s : r == $.FLOOR ? this._s : r == $.HALF_UP ? n >= 5 : r == $.HALF_DOWN ? n > 5 : r == $.HALF_EVEN ? n >= 5 && b[p - 1] & 1 : false) && this.add(x);
            b.splice(p, b.length - p);
        }
        return delete this._rounding, this;
    };
    o.isZero = function () {
        return this._d.length === 1 && this._d[0] === 0;
    };
})(window);