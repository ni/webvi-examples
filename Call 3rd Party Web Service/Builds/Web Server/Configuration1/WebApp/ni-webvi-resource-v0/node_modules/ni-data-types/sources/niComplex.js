//****************************************
// NIComplex data type
// National Instruments Copyright 2016
//****************************************

(function () {
    'use strict';

    // Constructor Function
    window.NIComplex = function (value, imag) {
        if (typeof value === 'string') {
            var complexNumber = this.parseFromString(value);
            this.realPart = complexNumber[0];
            this.imaginaryPart = complexNumber[1];
        } else if (typeof value === 'number') {
            this.realPart = value;
            if (typeof imag === 'number') {
                this.imaginaryPart = imag;
            } else if (typeof imag === 'undefined') {
                this.imaginaryPart = 0;
            } else {
                throw new Error('Can\'t create complex number: invalid imaginary part');
            }

        } else {
            throw new Error('Can\'t create complex number');
        }
    };

    // Static Private Variables
    var spaceRemovalRegex = /\s+/g;
    var middleSignRegex = /[^eE][-+]/;
    var testRealRegex = /^[-+]?([0-9]+|[0-9]+\.|[0-9]*\.[0-9]+)$/;
    var testImagRegex = /^[-+]?([0-9]*|[0-9]+\.|[0-9]*\.[0-9]+)i$/;
    var testRealScientificNotationRegex = /^[-+]?([0-9]+|[0-9]+\.|[0-9]+\.|[0-9]*\.[0-9]+)[eE][-+]?[0-9]+$/;
    var testImagScientificNotationRegex = /^[-+]?([0-9]+|[0-9]+\.|[0-9]+\.|[0-9]*\.[0-9]+)[eE][-+]?[0-9]+i$/;
    var checkRealInfinityRegex = /^[-+]?Infinity$/;
    var checkImagInfinityRegex = /^[-+]?Infinityi$/;
    var transformInfinityRegex = /[iI]nf(inity)?/g;
    var checkOnlyI = /^[-+]?i$/;
    var checkNaN = /^[-+]?NaNi?$/;
    var fastPathComplexRegex = /^[-+]?([0-9]+|[0-9]+\.[0-9]+)([eE][-+]?[0-9]+)?[-+]([0-9]+|[0-9]+\.[0-9]+)([eE][-+]?[0-9]+)?i$/;
    var realPartOnlyRegex = /^[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?$/;
    var imaginaryPartOnlyRegex = /^[+\-]?((?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?)?i$/;
    var realPartSIRegex = /([-+]?([0-9]*\.[0-9]+|[0-9]+))(Y|Z|E|P|T|G|M|k|c|m|u|n|p|f|a|z|y)(?!i)/;
    var imaginaryPartSIRegex = /([-+]?([0-9]*\.[0-9]+|[0-9]+))(Y|Z|E|P|T|G|M|k|c|m|u|n|p|f|a|z|y)i/;

    // Static Public Functions
    // None

    // Prototype creation
    var proto = window.NIComplex.prototype;

    // Static Private Functions
    var getRealPart = function (value) {
        var result;

        if (value === '') {
            return 0;
        } else if (checkNaN.test(value)) {
            return NaN;
        }

        if (value.search(/[eE]/) === -1) {
            if (!(testRealRegex.test(value) || checkRealInfinityRegex.test(value))) {
                throw new Error('Invalid real part format');
            }

            result = parseFloat(value);
        } else {
            if (!testRealScientificNotationRegex.test(value)) {
                throw new Error('Invalid real part scientific notation');
            }

            result = parseFloat(value);
        }

        return result;
    };

    var getImaginaryPart = function (value) {
        var result;

        if (value === '') {
            return 0;
        } else if (checkNaN.test(value)) {
            return NaN;
        }

        var valueWithoutI = value.slice(0, -1); //removes the i at the end

        if (value.search(/[eE]/) === -1) {
            if (!(testImagRegex.test(value) || checkImagInfinityRegex.test(value))) {
                throw new Error('Invalid imaginary part format');
            }

            if (checkOnlyI.test(value)) {
                return parseFloat(valueWithoutI + '1');
            }

            result = parseFloat(valueWithoutI);
        } else {
            if (!testImagScientificNotationRegex.test(value)) {
                throw new Error('Invalid imaginary part scientific notation');
            }

            result = parseFloat(valueWithoutI);
        }

        return result;
    };

    var fastParseFromString = function (complexString) {
        var middleSignIndex = complexString.search(middleSignRegex);
        var real = parseFloat(complexString.substring(0, middleSignIndex + 1));
        var imag = parseFloat(complexString.substring(middleSignIndex + 1, complexString.length - 1));

        return [real, imag];
    };

    var thoroughParseFromString = function (complexString) {
        var realSubString, imagSubString;

        if (complexString === '' || typeof complexString === 'undefined' || complexString === null) {
            throw new Error('Invalid number format');
        }

		complexString = complexString.replace(transformInfinityRegex, 'Infinity');

        var middleSignIndex = complexString.search(middleSignRegex);
        var imagIndex = complexString.search(/i[-+]|i$/);

        if (middleSignIndex < imagIndex) {
            realSubString = complexString.substring(0, middleSignIndex + 1);
            imagSubString = complexString.substring(middleSignIndex + 1);
        } else {
            imagSubString = complexString.substring(0, middleSignIndex + 1);
            realSubString = complexString.substring(middleSignIndex + 1);
        }

        // Checks if real and/or imaginary parts have SI prefixes
        var realPartSITest = realPartSIRegex.test(complexString),
            imaginaryPartSITest = imaginaryPartSIRegex.test(complexString),
            realPart, imaginaryPart;

        if (realPartSITest) {
            realPart = scientificToDecimal(realSubString);
            if (isNaN(realPart)) {
                throw new Error('Invalid real part format');
            }
        }

        if (imaginaryPartSITest) {
            imaginaryPart = scientificToDecimal(imagSubString.slice(0, imagSubString.length - 1));
            if (isNaN(imaginaryPart)) {
                throw new Error('Invalid imaginary part format');
            }
        }

        if (realPart !== undefined && imaginaryPart !== undefined) {
            return [realPart, imaginaryPart];
        }
        else if (realPart !== undefined) {
            return [realPart, getImaginaryPart(imagSubString)];
        }
        else if (imaginaryPart !== undefined) {
            return [getRealPart(realSubString), imaginaryPart];
        }

        return [getRealPart(realSubString), getImaginaryPart(imagSubString)];
    };

    var scientificToDecimal = function (scientificValue) {
        var prefixesToPowers = { 'Y': 24, 'Z': 21, 'E': 18, 'P': 15, 'T': 12, 'G': 9, 'M': 6, 'k': 3, 'c': -2, 'm': -3, 'u': -6, 'n': -9, 'p': -12, 'f': -15, 'a': -18, 'z': -21, 'y': -24 },            numericPart = scientificValue.replace(/[a-z]/gi, ''),
            prefix = scientificValue.replace(/[-+]?([0-9]*\.[0-9]+|[0-9]+)/g, ''),
            number = parseFloat(numericPart) * (Math.pow(10, prefixesToPowers[prefix]));

        return number;
    };

    // Public Prototype Methods
    proto.parseFromString = function (complexString) {
        complexString = complexString.replace(spaceRemovalRegex, '');

        if (realPartOnlyRegex.test(complexString)) {
            // if only real part has been passed in the string
            return [parseFloat(complexString), 0];
        } else if (imaginaryPartOnlyRegex.test(complexString)) {
            // if only imaginary part has been passed in the string
            var numericPartOfImaginary = complexString.slice(0, -1);
            if (checkOnlyI.test(complexString)) {
                numericPartOfImaginary += '1';
            }
            return [0, parseFloat(numericPartOfImaginary)];
        } else if (fastPathComplexRegex.test(complexString)) {
            return fastParseFromString(complexString);
        } else {
            return thoroughParseFromString(complexString);
        }
    };

    proto.compare = function (complexNumb) {
        var complexNumbMagnitute = Math.sqrt(Math.pow(complexNumb.realPart, 2) + Math.pow(complexNumb.imaginaryPart, 2));
        var thisMagnitute = Math.sqrt(Math.pow(this.realPart, 2) + Math.pow(this.imaginaryPart, 2));

        if (thisMagnitute > complexNumbMagnitute) {
            return 1;
        } else if (thisMagnitute < complexNumbMagnitute) {
            return -1;
        } else {
            return 0;
        }
    };

    proto.toString = function () {
        if (this.imaginaryPart >= 0) {
            return this.realPart + ' + ' + this.imaginaryPart + 'i';
        } else {
            return this.realPart + ' - ' + Math.abs(this.imaginaryPart) + 'i';
        }
    };
}());
