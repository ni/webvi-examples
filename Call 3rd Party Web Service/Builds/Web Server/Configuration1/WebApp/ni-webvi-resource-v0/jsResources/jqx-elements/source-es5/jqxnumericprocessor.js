'use strict';

/**
 * A class for instantiating a number processor object.
 */
JQX.Utilities.Assign('NumericProcessor', function NumericProcessor(context, numericFormatProperty) {
    babelHelpers.classCallCheck(this, NumericProcessor);

    switch (context[numericFormatProperty]) {
        case 'integer':
            return new JQX.Utilities.IntegerNumericProcessor(context, numericFormatProperty);
        case 'floatingPoint':
            return new JQX.Utilities.DecimalNumericProcessor(context, numericFormatProperty);
        case 'complex':
            return new JQX.Utilities.ComplexNumericProcessor(context, numericFormatProperty);
    }
});

/**
 * A base class for processesing numbers.
 */
JQX.Utilities.Assign('BaseNumericProcessor', function () {
    function BaseNumericProcessor(context, numericFormatProperty) {
        babelHelpers.classCallCheck(this, BaseNumericProcessor);

        var that = this;

        that.context = context;
        that._longestLabelSize = 0;
        that.numericFormatProperty = numericFormatProperty;
        that.regexScientificNotation = new RegExp(/^([-+]?([0-9]*\.[0-9]+|[0-9]+))(Y|Z|E|P|T|G|M|k|c|m|u|n|p|f|a|z|y){1}$/); // regular expressions for scientific notation
        that.regexNoLeadingZero = new RegExp(/^[.]\d+$/);
        that.prefixesToPowers = { 'Y': 24, 'Z': 21, 'E': 18, 'P': 15, 'T': 12, 'G': 9, 'M': 6, 'k': 3, 'c': -2, 'm': -3, 'u': -6, 'n': -9, 'p': -12, 'f': -15, 'a': -18, 'z': -21, 'y': -24 };
    }

    babelHelpers.createClass(BaseNumericProcessor, [{
        key: 'prepareForValidation',
        value: function prepareForValidation(initialValidation, programmaticValue, value) {
            var that = this.context,
                initialOrProgrammatic = initialValidation || programmaticValue !== undefined;

            value = value.replace(/\s/g, '');
            value = that._discardDecimalSeparator(value);

            if (this.regexNoLeadingZero.test(value)) {
                value = '0' + value;
            } else if ((that[this.numericFormatProperty] === 'integer' && (that._radixNumber === 10 || initialOrProgrammatic) || that[this.numericFormatProperty] === 'floatingPoint') && this.regexScientificNotation.test(value)) {
                // scientific notation test
                value = this.scientificToDecimal(value);
            }

            var complexNumberIsEntered = false,
                enteredComplexNumber = void 0;

            if (that[this.numericFormatProperty] === 'complex' && that._regexSpecial.nonNumericValue.test(value) === false) {
                try {
                    if (that._regexSpecial.exaValue.test(value)) {
                        // handles ambiguous "exa" case
                        var indexOfExa = value.indexOf('E'),
                            realPart = parseFloat(value.slice(0, indexOfExa)) * Math.pow(10, 18),
                            imaginaryPart = parseFloat(value.slice(indexOfExa + 1, -1));

                        enteredComplexNumber = new NIComplex(realPart, imaginaryPart);
                    } else {
                        enteredComplexNumber = new NIComplex(value);
                    }
                    complexNumberIsEntered = true;
                } catch (error) {
                    complexNumberIsEntered = false;
                }
            }

            // if the entered value is not a number
            if (complexNumberIsEntered === false && (!initialOrProgrammatic && that._regex[that._radixNumber].test(value) === false || initialOrProgrammatic && that._regex[10].test(value) === false)) {
                that._handleNonNumericValue(initialValidation, programmaticValue, value);
                return;
            }

            return { value: value, enteredComplexNumber: enteredComplexNumber };
        }

        /**
         * Checks if a number is in exponential notation.
         */

    }, {
        key: 'isENotation',
        value: function isENotation(value) {
            var eNotationRegex = new RegExp(/e/i);

            return eNotationRegex.test(value.toString());
        }

        /**
         * Converts a number in scientific notation to a plain number.
         */

    }, {
        key: 'scientificToDecimal',
        value: function scientificToDecimal(scientificValue) {
            var numericPart = scientificValue.replace(/[a-z]/gi, ''),
                prefix = scientificValue.replace(/[-+]?([0-9]*\.[0-9]+|[0-9]+)/g, ''),
                number = parseFloat(numericPart) * Math.pow(10, this.prefixesToPowers[prefix]);

            return number;
        }

        /**
         * Creates a label dummy element.
         */

    }, {
        key: '_createMeasureLabel',
        value: function _createMeasureLabel() {
            var context = this.context,
                measureLabel = document.createElement('div');

            measureLabel.className = 'jqx-label';
            measureLabel.style.position = 'absolute';
            measureLabel.style.visibility = 'hidden';
            if (context.scalePosition !== 'far') {
                context._measureLabelScale = context.$.scaleNear;
            } else {
                context._measureLabelScale = context.$.scaleFar;
            }
            context._measureLabelScale.appendChild(measureLabel);

            return measureLabel;
        }

        /**
         * Adds a major tick and its respective label.
         */

    }, {
        key: '_addMajorTickAndLabel',
        value: function _addMajorTickAndLabel(htmlValue, labelSize, plot, value, middle) {
            var that = this.context,
                leftOrTop = that._settings.leftOrTop,
                offset = this.valueToPx(value);

            var currentTick = '',
                currentLabel = '';

            if (parseInt(offset) > parseInt(that._measurements.trackLength)) {
                return { tick: currentTick, label: currentLabel };
            }

            if (that.logarithmicScale) {
                htmlValue = that._formatLabel(Math.pow(10, value));
            }

            if (that.nodeName.toLowerCase() === 'jqx-tank' || that._intervalHasChanged) {
                var tickIntervalLabelSize = that._tickIntervalHandler.labelsSize;

                if (middle) {
                    that._labelDummy.innerHTML = htmlValue;

                    var tickPosition = this.valueToPx(value),
                        maxPosition = this.valueToPx(parseFloat(that._drawMax)),
                        minPosition = this.valueToPx(parseFloat(that._drawMin)),
                        _labelSize = that._labelDummy[that._settings.size],
                        labelOtherSize = that.orientation === 'vertical' ? that._labelDummy.offsetWidth : that._labelDummy.offsetHeight,
                        distanceToMin = (_labelSize + tickIntervalLabelSize.minLabelSize) / 2,
                        distanceToMax = (_labelSize + tickIntervalLabelSize.maxLabelSize) / 2;

                    that._normalLayout ? plot = tickPosition + distanceToMax < maxPosition && tickPosition - distanceToMin > minPosition : plot = tickPosition - distanceToMax > maxPosition && tickPosition + distanceToMin < minPosition;

                    if (labelOtherSize > this._longestLabelSize) {
                        this._longestLabelSize = labelOtherSize;
                    }
                } else {
                    this._longestLabelSize = Math.max(tickIntervalLabelSize.minLabelOtherSize, tickIntervalLabelSize.maxLabelOtherSize, this._longestLabelSize);
                }
            }

            that._tickValues.push(value);

            currentTick = '<div style="' + leftOrTop + ': ' + offset + 'px;" class="jqx-tick"></div>';

            if (plot !== false) {
                if (labelSize === undefined) {
                    that._labelDummy.innerHTML = htmlValue;
                    labelSize = that._labelDummy[that._settings.size];
                }
                var labelOffset = offset - labelSize / 2;

                currentLabel += '<div class="jqx-label' + (middle ? ' jqx-label-middle' : '') + '" style="' + leftOrTop + ': ' + labelOffset + 'px;">' + htmlValue + '</div>';
            }

            return { tick: currentTick, label: currentLabel };
        }

        /**
         * Gets the internal numeric word length based on the "wordLength" property.
         */

    }, {
        key: 'getWordLength',
        value: function getWordLength(wordLength) {
            this.context._unsigned = wordLength.charAt(0) === 'u';

            switch (wordLength) {
                case 'int8':
                case 'uint8':
                    return 8;
                case 'int16':
                case 'uint16':
                    return 16;
                case 'int32':
                case 'uint32':
                    return 32;
                case 'int64':
                case 'uint64':
                    return 64;
            }
        }

        /**
         * Returns the angle equivalent of a value.
         */

    }, {
        key: 'getAngleByValue',
        value: function getAngleByValue(value, calculateDrawValue, returnDegrees) {
            var that = this.context;

            if (calculateDrawValue !== false && that.logarithmicScale) {
                value = Math.log10(value);
            }

            var angleOffset = (value - that._drawMin) * that._angleRangeCoefficient;
            var degrees = void 0;

            if (!that.inverted) {
                degrees = that.endAngle - angleOffset;
            } else {
                degrees = that.startAngle + angleOffset;
            }

            if (returnDegrees) {
                return degrees;
            }
            return degrees * Math.PI / 180 + Math.PI / 2;
        }

        /**
         * Returns the value equivalent of an angle.
         */

    }, {
        key: 'getValueByAngle',
        value: function getValueByAngle(angle, integer) {
            var that = this.context;
            var minuendAngle = void 0,
                subtrahendAngle = void 0,
                value = void 0;

            if (!that.inverted) {
                minuendAngle = that.endAngle;
                subtrahendAngle = angle;
            } else {
                minuendAngle = angle;
                subtrahendAngle = that._normalizedStartAngle;
            }

            while (minuendAngle < subtrahendAngle) {
                minuendAngle += 360;
            }value = (minuendAngle - subtrahendAngle) / that._angleDifference * that._range + parseFloat(that._drawMin);

            if (that.logarithmicScale) {
                value = Math.pow(10, value);
            }

            if (integer && !that.coerce) {
                return Math.round(value);
            }

            return this.getCoercedValue(value, false);
        }

        /**
         * Updates the values of the Gauge and its digital display and fires the "change" event.
         */

    }, {
        key: 'updateGaugeValue',
        value: function updateGaugeValue(newValue) {
            var that = this.context,
                oldValue = that.value;

            that.value = newValue;
            that._drawValue = that.logarithmicScale ? Math.log10(newValue).toString() : newValue;
            that._number = this.createDescriptor(that.value);
            that.$.digitalDisplay.value = newValue;
            that.$.fireEvent('change', { 'value': newValue, 'oldValue': oldValue });

            delete that._valueBeforeCoercion;
        }

        /**
         * Validates the start or end value of a Gauge color range.
         */

    }, {
        key: 'validateColorRange',
        value: function validateColorRange(value) {
            var that = this.context;

            return Math.min(Math.max(value, that.min), that.max);
        }

        /**
         * Returns a value based on the passed "draw" value.
         */

    }, {
        key: 'getActualValue',
        value: function getActualValue(value) {
            if (!this.context.logarithmicScale) {
                return value;
            } else {
                return Math.pow(10, value);
            }
        }

        /**
         * Draws minor ticks on a Gauge logarithmic scale.
         */

    }, {
        key: 'drawGaugeLogarithmicScaleMinorTicks',
        value: function drawGaugeLogarithmicScaleMinorTicks(majorTickValues, majorStep, drawMinor) {
            var that = this.context;
            var firstWholePower = void 0;

            if (majorStep instanceof BigNumber) {
                majorStep = parseFloat(majorStep.toString());
            }

            for (var i in majorTickValues) {
                firstWholePower = i;
                if (i >= 0 && i % 1 === 0) {
                    break;
                }
            }

            // positive powers
            for (var _i = parseFloat(firstWholePower); _i < that._drawMax; _i += majorStep) {
                for (var j = 2; j <= 9; j++) {
                    var value = j * Math.pow(10, _i + majorStep - 1);

                    if (value < that.max) {
                        drawMinor(value);
                    }
                }
            }

            // negative powers
            for (var _i2 = parseFloat(firstWholePower); _i2 > that._drawMin; _i2 -= majorStep) {
                for (var _j = 2; _j <= 9; _j++) {
                    var _value = _j * Math.pow(10, _i2 - 1);

                    if (_value > that.min) {
                        drawMinor(_value);
                    }
                }
            }
        }
    }]);
    return BaseNumericProcessor;
}());

/**
 * A class for processesing integer numbers.
 */
JQX.Utilities.Assign('IntegerNumericProcessor', function (_JQX$Utilities$BaseNu) {
    babelHelpers.inherits(IntegerNumericProcessor, _JQX$Utilities$BaseNu);

    function IntegerNumericProcessor(context, numericFormatProperty) {
        babelHelpers.classCallCheck(this, IntegerNumericProcessor);

        var _this = babelHelpers.possibleConstructorReturn(this, (IntegerNumericProcessor.__proto__ || Object.getPrototypeOf(IntegerNumericProcessor)).call(this, context, numericFormatProperty));

        var that = _this;

        that.context = context;
        that.defaultMins = { int8: '-128', uint8: '0', int16: '-32768', uint16: '0', int32: '-2147483648', uint32: '0', int64: '-9223372036854775808', uint64: '0' };
        that.defaultMaxs = { int8: '127', uint8: '255', int16: '32767', uint16: '65535', int32: '2147483647', uint32: '4294967295', int64: '9223372036854775807', uint64: '18446744073709551615' };
        return _this;
    }

    babelHelpers.createClass(IntegerNumericProcessor, [{
        key: 'createDescriptor',
        value: function createDescriptor(initialValue, supportsENotation, validateConstruction, validateMinMax, discardRadix) {
            var that = this.context;
            var returnValue = void 0;

            if (initialValue.constructor !== BigNumber) {
                var radix = !discardRadix && that._radixNumber ? that._radixNumber : 10;

                if (radix === 10 && supportsENotation && initialValue.constructor !== BigNumber && this.isENotation(initialValue)) {
                    initialValue = new JQX.Utilities.NumberRenderer(initialValue).largeExponentialToDecimal();
                }
                if (that._toBigNumberDecimal) {
                    returnValue = that._toBigNumberDecimal(initialValue.toString(radix, that._wordLengthNumber), radix);
                } else {
                    returnValue = new BigNumber(initialValue);
                }
            } else {
                returnValue = new BigNumber(initialValue);
            }
            if (validateConstruction) {
                // if the entered number is negative and the "wordLength" is "uint", the number is set to 0
                if (that._unsigned && returnValue.compare(0) === -1) {
                    returnValue = returnValue.set(0);
                }
                if (validateMinMax) {
                    // if the entered number is outside the range defined by "min" and "max", the number is changed to the value of "min" or "max"
                    returnValue = this.validate(returnValue, that._minObject, that._maxObject);
                }
                returnValue = this.round(returnValue);
            }
            return returnValue;
        }

        /**
        * Returns a rounded BigNumber object
        */

    }, {
        key: 'round',
        value: function round(value) {
            if (this.context._wordLengthNumber < 64) {
                return new BigNumber(Math.round(value.toString()));
            }

            var fraction = value.mod(1);

            if (!(fraction._d.length === 1 && fraction._d[0] === 0)) {
                // if the entered number is with a decimal value, it is rounded up or down to its nearest integer equivalent

                value = value.intPart();
                if (!value._s) {
                    // round positive number
                    if (fraction._d[1] > 4) {
                        value = value.add(1);
                    }
                } else {
                    // round negative number
                    if (fraction._d[1] > 5) {
                        value = value.add(-1);
                    }
                }
            }
            return value;
        }

        /**
         * Validates value.
         */

    }, {
        key: 'validate',
        value: function validate(initialValue, min, max) {
            var returnValue = void 0;

            if (initialValue.compare(min) === -1) {
                returnValue = min;
            } else if (initialValue.compare(max) === 1) {
                returnValue = max;
            } else {
                returnValue = initialValue;
            }
            return returnValue;
        }

        /**
         * Validates min/max.
         */

    }, {
        key: 'validateMinMax',
        value: function validateMinMax(validateMin, validateMax) {
            var that = this.context;

            var defaultMin = this.defaultMins[that.wordLength],
                defaultBigMin = new BigNumber(defaultMin),
                defaultMax = this.defaultMaxs[that.wordLength],
                defaultBigMax = new BigNumber(defaultMax);

            if (that._numberRenderer === undefined) {
                that._numberRenderer = new JQX.Utilities.NumberRenderer();
            }

            if (validateMin) {
                if (that.min !== null) {
                    that.min = that.min.toString().replace(/\s/g, '');
                    if (this.regexScientificNotation.test(that.min)) {
                        that.min = this.scientificToDecimal(that.min);
                    }
                }
                var currentBigMin = this.round(new BigNumber(that.min));

                if (that.min !== null && (!that._minIsNull || !that._initialized) && currentBigMin.compare(defaultBigMin) >= 0) {
                    that._minObject = currentBigMin;
                } else {
                    that._minIsNull = true;
                    that.min = defaultMin;
                    that._minObject = defaultBigMin;
                }
            }

            if (validateMax) {
                if (that.max !== null) {
                    that.max = that.max.toString().replace(/\s/g, '');
                    if (this.regexScientificNotation.test(that.max)) {
                        that.max = this.scientificToDecimal(that.max);
                    }
                }
                var currentBigMax = this.round(new BigNumber(that.max));

                if (that.max !== null && (!that._maxIsNull || !that._initialized) && currentBigMax.compare(defaultBigMax) <= 0) {
                    that._maxObject = currentBigMax;
                } else {
                    that._maxIsNull = true;
                    that.max = defaultMax;
                    that._maxObject = defaultBigMax;
                }
            }

            if (!this.compare(that._minObject, that._maxObject)) {
                //Set default values
                that._minObject = defaultBigMin;
                that._maxObject = defaultBigMax;
                that._drawMin = that.logarithmicScale ? 0 : defaultMin;
                that._drawMax = that.logarithmicScale ? 10 : defaultMax;
                that.min = defaultMin;
                that.max = defaultMax;
            }
        }

        /**
         * Converts value to pixels.
         */

    }, {
        key: 'valueToPx',
        value: function valueToPx(value) {
            var that = this.context,
                lengthRangeRatio = new BigNumber(that._measurements.trackLength).divide(new BigNumber(that._range));

            var result = void 0;

            if (that._normalLayout) {
                var drawMin = that._drawMin instanceof BigNumber ? that._drawMin : new BigNumber(that._drawMin);

                value = new BigNumber(value);
                result = parseFloat(lengthRangeRatio.multiply(value.subtract(drawMin)).toString());
            } else {
                var drawMax = that._drawMax instanceof BigNumber ? that._drawMax : new BigNumber(that._drawMax);

                result = parseFloat(this.round(drawMax.subtract(value).multiply(lengthRangeRatio)).toString());
            }
            return result;
        }

        /**
        * Returns the value equivalent of a pixel offset.
        */

    }, {
        key: 'pxToValue',
        value: function pxToValue(px) {
            var that = this.context;

            var result = void 0;

            if (that._normalLayout) {
                result = that._valuePerPx.multiply(px - that._trackStart);
            } else {
                result = that._valuePerPx.multiply(that._trackEnd - px);
            }

            if (that.logarithmicScale) {
                var power = parseFloat(result) + parseFloat(that._drawMin);

                that._drawValue = power;
                return new BigNumber(Math.round(Math.pow(10, power)));
            }
            var returnedValue = this.createDescriptor(that._minObject.add(result), false, true, true);
            that._drawValue = returnedValue;

            return returnedValue;
        }

        /**
         * BigNumber compare method.
         */

    }, {
        key: 'compare',
        value: function compare(initialValue, otherValue) {
            if (initialValue.constructor !== BigNumber) {
                initialValue = new BigNumber(initialValue);
            }

            return initialValue.compare(otherValue) !== 0;
        }

        /**
         * Increments/Decrements value. Keyboard navigation operations.
         */

    }, {
        key: 'incrementDecrement',
        value: function incrementDecrement(initialValue, operation, stepObject) {
            var that = this.context;

            var returnValue = void 0;

            if (initialValue.constructor !== BigNumber) {
                initialValue = new BigNumber(initialValue);
            }

            if (operation === 'add') {
                returnValue = initialValue.add(stepObject);
                if (that._drawMax !== undefined) {
                    return returnValue.compare(that._drawMax) > 0 ? new BigNumber(that._drawMax) : returnValue;
                }
            } else {
                returnValue = initialValue.subtract(stepObject);
                if (that._drawMin !== undefined) {
                    return returnValue.compare(that._drawMin) < 0 ? new BigNumber(that._drawMin) : returnValue;
                }
            }
            return returnValue;
        }

        /**
         * Renders the value. Scientific notation renderer.
         */

    }, {
        key: 'render',
        value: function render(initialValue, ignoreRadixNumber) {
            var context = this.context;

            if (!context.scientificNotation && ignoreRadixNumber === true) {
                return new JQX.Utilities.NumberRenderer(new BigNumber(initialValue)).bigNumberToExponent(context.significantDigits);
            }

            // scientific notation
            var returnValue = initialValue;

            if (typeof initialValue !== 'string') {
                returnValue = initialValue.toString(context._radixNumber, context._wordLengthNumber);
            }

            if (context.scientificNotation && ignoreRadixNumber === true) {
                returnValue = new JQX.Utilities.NumberRenderer(returnValue).toScientific();
            }
            return returnValue;
        }

        /**
         * Adds tank\'s ticks and labels.
         */

    }, {
        key: 'addTicksAndLabels',
        value: function addTicksAndLabels() {

            var that = this.context,
                trackLength = that._measurements.trackLength,
                normalLayout = that._normalLayout,
                ticksFrequency = that._majorTicksInterval,
                tickscount = this.round(new BigNumber(that._range).divide(ticksFrequency)),
                ticksDistance = trackLength / tickscount,
                min = new BigNumber(that._drawMin),
                max = new BigNumber(that._drawMax);

            var first = void 0,
                second = void 0,
                distanceModifier = void 0,
                last = void 0,
                firstLabelValue = void 0,
                firstLabelSize = void 0,
                lastLabelValue = void 0,
                lastLabelSize = void 0,
                currentTickAndLabel = void 0,
                ticks = '',
                labels = '';

            that._tickValues = [];
            this._longestLabelSize = 0;

            if (normalLayout) {
                first = min;
                second = ticksFrequency.add(first.subtract(first.mod(ticksFrequency)));
                distanceModifier = second.subtract(first);
                firstLabelValue = that._formatLabel(min);
                firstLabelSize = that._tickIntervalHandler.labelsSize.minLabelSize;
                last = max;
                lastLabelValue = that._formatLabel(max);
                lastLabelSize = that._tickIntervalHandler.labelsSize.maxLabelSize;
            } else {
                first = max;
                second = first.subtract(first.mod(ticksFrequency));
                distanceModifier = first.subtract(second);
                firstLabelValue = that._formatLabel(max);
                firstLabelSize = that._tickIntervalHandler.labelsSize.maxLabelSize;
                last = min;
                lastLabelValue = that._formatLabel(min);
                lastLabelSize = that._tickIntervalHandler.labelsSize.minLabelSize;
            }

            that._labelDummy = this._createMeasureLabel();

            currentTickAndLabel = this._addMajorTickAndLabel(firstLabelValue, firstLabelSize, true, first); // first tick and label
            ticks += currentTickAndLabel.tick;
            labels += currentTickAndLabel.label;

            // special case for second tick and label
            var distanceFromFirstToSecond = distanceModifier.divide(ticksFrequency).multiply(ticksDistance);

            if (second.compare(that.max) !== 0 && distanceFromFirstToSecond.compare(trackLength) < 0) {
                // second item rendering
                var secondItemHtmlValue = that._formatLabel(second.toString()),
                    plotSecond = distanceFromFirstToSecond.compare(firstLabelSize) > 0;

                currentTickAndLabel = this._addMajorTickAndLabel(secondItemHtmlValue, undefined, plotSecond, second, true);
                ticks += currentTickAndLabel.tick;
                labels += currentTickAndLabel.label;
            }
            currentTickAndLabel = this.addMiddleMajorTicks(tickscount, ticksDistance, distanceFromFirstToSecond, distanceModifier, normalLayout, ticksFrequency);
            ticks += currentTickAndLabel.tick;
            labels += currentTickAndLabel.label;
            currentTickAndLabel = this._addMajorTickAndLabel(lastLabelValue, lastLabelSize, true, last); // last tick and label
            ticks += currentTickAndLabel.tick;
            labels += currentTickAndLabel.label;
            ticks += this.addMinorTicks(normalLayout);

            that._measureLabelScale.removeChild(that._labelDummy);
            delete that._labelDummy;
            delete that._measureLabelScale;

            if (that.nodeName.toLowerCase() === 'jqx-tank') {
                that._updateScaleWidth(this._longestLabelSize);
            }

            that._appendTicksAndLabelsToScales(ticks, labels);
        }

        /**
        * Adds the middle major ticks and their respective labels.
        */

    }, {
        key: 'addMiddleMajorTicks',
        value: function addMiddleMajorTicks(tickscount, ticksDistance, distanceFromFirstToSecond, distanceModifier, normalLayout, ticksFrequency) {
            var that = this.context;

            var majorTicks = '',
                majorLabels = '',
                valuePlusExponent = void 0;

            for (var i = 1; i < tickscount; i++) {
                var number = distanceFromFirstToSecond.add(i * ticksDistance),
                    value = void 0;

                if (normalLayout) {
                    value = ticksFrequency.multiply(i).add(distanceModifier.add(new BigNumber(that._drawMin)));
                } else {
                    value = new BigNumber(that._drawMax).subtract(distanceModifier).subtract(ticksFrequency.multiply(i));

                    // if the value of the penultimate is 0 we add the exponent to accurately calculate its size
                    if (i === tickscount - 1 && value.compare(0) === 0) {
                        that._numberRenderer.numericValue = that._tickIntervalHandler.nearestPowerOfTen;
                        valuePlusExponent = that._numberRenderer.bigNumberToExponent(1);
                    }
                }
                if (value.compare(that._drawMax) !== 0) {
                    var htmlValue = that._formatLabel(value.toString()),
                        plot = true;

                    that._labelDummy.innerHTML = valuePlusExponent ? valuePlusExponent : htmlValue;
                    var dimensionValue = that._labelDummy[that._settings.size];

                    if (number.add(dimensionValue).compare(tickscount * ticksDistance) >= 0) {
                        // + 5 is an experimental value
                        plot = false; // does not plot the second to last label if it intersects with the last one
                    }

                    var currentTickAndLabel = this._addMajorTickAndLabel(htmlValue, undefined, plot, value, true);

                    majorTicks += currentTickAndLabel.tick;
                    majorLabels += currentTickAndLabel.label;
                }
            }
            return { tick: majorTicks, label: majorLabels };
        }

        /**
         * Adds minor ticks.
         */

    }, {
        key: 'addMinorTicks',
        value: function addMinorTicks(normalLayout) {
            function addMinorTick(i) {
                if (tickValues.indexOf(i) === -1 && i % minorTicksInterval === 0) {
                    minorTicks += '<div style="' + leftOrTop + ': ' + that._numericProcessor.valueToPx(i) + 'px;" class="jqx-tick jqx-tick-minor"></div>';
                }
            }

            var that = this.context,
                tickValues = that._tickValues,
                nearestPowerOfTen = that._tickIntervalHandler.nearestPowerOfTen,
                minorTicksInterval = that._minorTicksInterval,
                leftOrTop = that._settings.leftOrTop;

            var firstTickValue = void 0,
                secondTickValue = void 0,
                lastTickValue = void 0,
                minorTicks = '';

            if (normalLayout) {
                firstTickValue = tickValues[0];
                secondTickValue = tickValues[1];
                lastTickValue = tickValues[tickValues.length - 1];
            } else {
                firstTickValue = tickValues[tickValues.length - 1];
                secondTickValue = tickValues[tickValues.length - 2];
                lastTickValue = tickValues[0];
            }

            if (that.logarithmicScale) {
                addMinorTickOnLogarithmicScale();
            } else {
                // minor ticks from the beginning to the second major tick
                for (var i = secondTickValue; firstTickValue.compare(i) < 0; i = i.subtract(nearestPowerOfTen)) {
                    addMinorTick(i);
                }

                // minor ticks from the second major tick to the end
                for (var _i3 = secondTickValue.add(nearestPowerOfTen); lastTickValue.compare(_i3) > 0; _i3 = _i3.add(nearestPowerOfTen)) {
                    addMinorTick(_i3);
                }
            }

            function addMinorTickOnLogarithmicScale() {
                var trackLength = that._measurements.trackLength,
                    partialTrackLength = trackLength / tickValues.length,
                    modifierCoef = 0.1;

                if (partialTrackLength < 20) {
                    modifierCoef = 1;
                } else if (partialTrackLength >= 20 && partialTrackLength < 40) {
                    modifierCoef = secondTickValue - firstTickValue > 1 ? 1 : 0.5;
                } else if (partialTrackLength >= 40 && partialTrackLength < 80) {
                    modifierCoef = 0.2;
                }

                var nearestPowerOf10BelowMax = Math.floor(that._drawMax),
                    distanceToNearestPowerOf10 = that._drawMax - nearestPowerOf10BelowMax,
                    ticksOnPowerOf10 = that._drawMax - that._drawMin > tickValues.length;

                for (var j = that._drawMax; j > 0; j = j - 1) {
                    var range = distanceToNearestPowerOf10 > 0 ? Math.pow(10, j - distanceToNearestPowerOf10 + 1) : Math.pow(10, j),
                        modifier = range * modifierCoef;

                    for (var _i4 = range; _i4 > 0; _i4 = _i4 - modifier) {
                        if (_i4 < that.max && _i4 > that.min) {
                            var value = new BigNumber(Math.log10(_i4));

                            if (value % 1 === 0 && ticksOnPowerOf10 || !ticksOnPowerOf10) {
                                minorTicks += '<div style="' + leftOrTop + ': ' + that._numericProcessor.valueToPx(value) + 'px;" class="jqx-tick jqx-tick-minor"></div>';
                            }
                        }
                    }
                }
            }

            return minorTicks;
        }

        /**
         * Plots the Gauge's ticks and labels.
         */

    }, {
        key: 'addGaugeTicksAndLabels',
        value: function addGaugeTicksAndLabels() {
            var that = this.context;

            if (that.ticksVisibility === 'none' && that.labelsVisibility === 'none') {
                return;
            }

            var numericProcessor = this,
                maxLabelHeight = Math.max(that._tickIntervalHandler.labelsSize.minLabelSize, that._tickIntervalHandler.labelsSize.maxLabelSize),
                majorStep = that._majorTicksInterval,
                minorStep = that._minorTicksInterval,
                majorTickValues = {},
                distance = that._distance,
                radius = that._measurements.radius,
                majorTickWidth = radius - distance.majorTickDistance,
                minorTickWidth = radius - distance.minorTickDistance,
                bigDrawMin = new BigNumber(that._drawMin),
                bigDrawMax = new BigNumber(that._drawMax);
            var drawMajor = void 0,
                drawMinor = void 0,
                addLabel = void 0,
                currentAngle = void 0,
                angleAtMin = void 0,
                angleAtMax = void 0;

            if (that.ticksVisibility !== 'none') {
                drawMajor = function drawMajor(angle) {
                    that._drawTick(angle, majorTickWidth, 'major');
                };

                drawMinor = function drawMinor(value) {
                    that._drawTick(numericProcessor.getAngleByValue(value, true), minorTickWidth, 'minor');
                };
            } else {
                drawMajor = function drawMajor() {};
                drawMinor = function drawMinor() {};
            }

            if (that.labelsVisibility !== 'none') {
                addLabel = function addLabel(angle, currentLabel, middle) {
                    that._drawLabel(angle, currentLabel, distance.labelDistance, middle);
                };
            } else {
                addLabel = function addLabel() {};
            }

            if (!that.inverted) {
                angleAtMin = that.endAngle;
                angleAtMax = that.startAngle;
            } else {
                angleAtMin = that.startAngle;
                angleAtMax = that.endAngle;
            }

            // first major tick and label
            currentAngle = numericProcessor.getAngleByValue(bigDrawMin, false);
            drawMajor(currentAngle);
            majorTickValues[that._drawMin.toString()] = true;
            addLabel(currentAngle, that.min, false);

            var second = bigDrawMin.subtract(bigDrawMin.mod(majorStep)),
                firstMinTick = void 0;

            if (bigDrawMin.compare(0) !== -1) {
                second = second.add(majorStep);
            }

            // determines the value at the first minor tick
            for (var _i5 = new BigNumber(second); _i5.compare(bigDrawMin) !== -1; _i5 = _i5.subtract(minorStep)) {
                firstMinTick = _i5;
            }

            // second major tick and label
            currentAngle = numericProcessor.getAngleByValue(second, false);
            drawMajor(currentAngle);
            majorTickValues[second.toString()] = true;
            if (2 * Math.PI * that._measurements.innerRadius * (that._getAngleDifference(angleAtMin, numericProcessor.getAngleByValue(second, false, true)) / 360) > maxLabelHeight) {
                addLabel(currentAngle, this.getActualValue(second), second.compare(bigDrawMax) === -1);
            }

            var i = void 0;
            // middle major ticks and labels
            for (i = second.add(majorStep); i.compare(bigDrawMax.subtract(majorStep)) === -1; i = i.add(majorStep)) {
                currentAngle = numericProcessor.getAngleByValue(i, false);
                drawMajor(currentAngle);
                majorTickValues[i.toString()] = true;
                addLabel(currentAngle, this.getActualValue(i), false);
            }

            if (majorTickValues[i.toString()] === undefined && i.compare(bigDrawMax) !== 1) {
                // second-to-last major tick and label
                currentAngle = numericProcessor.getAngleByValue(i, false);
                drawMajor(currentAngle);
                majorTickValues[i.toString()] = true;
                if (2 * Math.PI * that._measurements.innerRadius * (that._getAngleDifference(angleAtMax, numericProcessor.getAngleByValue(i, false, true)) / 360) >= maxLabelHeight) {
                    addLabel(currentAngle, this.getActualValue(i), true);
                }

                if (that._normalizedStartAngle !== that.endAngle) {
                    // last major tick and label
                    currentAngle = numericProcessor.getAngleByValue(bigDrawMax, false);
                    drawMajor(currentAngle);
                    if (2 * Math.PI * that._measurements.innerRadius * (that._getAngleDifference(angleAtMax, angleAtMin) / 360) >= maxLabelHeight) {
                        addLabel(currentAngle, that.max, false);
                    }
                }
            }

            // minor ticks
            if (!that.logarithmicScale) {
                for (var j = firstMinTick; j.compare(bigDrawMax) === -1; j = j.add(minorStep)) {
                    if (majorTickValues[j.toString()]) {
                        continue; // does not plot minor ticks over major ones
                    }
                    drawMinor(j);
                }
            } else {
                this.drawGaugeLogarithmicScaleMinorTicks(majorTickValues, majorStep, drawMinor);
            }
        }

        /**
         * Sets toolTip's value and updates the value of the element.
         */

    }, {
        key: 'updateToolTipAndValue',
        value: function updateToolTipAndValue(value, oldValue, changeValue) {
            var that = this.context;

            that._updateTooltipValue(value.toString());
            if (that.logarithmicScale) {
                value = parseFloat(Math.pow(10, parseFloat(value)).toFixed(13));
            }

            value = value instanceof BigNumber ? value : new BigNumber(value);

            // eslint-disable-next-line
            if (value.compare(oldValue) !== 0) {
                if (changeValue) {
                    that._drawValue = value.toString();
                    that.value = that._drawValue;
                    that.$.fireEvent('change', { 'value': that.value, 'oldValue': oldValue });
                }
            }
        }

        /**
         * Validates the interval property.
         */

    }, {
        key: 'validateInterval',
        value: function validateInterval(interval) {
            var that = this.context,
                range = that._maxObject.subtract(that._minObject);

            that._validInterval = new BigNumber(interval);
            that._validInterval = this.round(that._validInterval);

            if (that._validInterval.compare(range) === 1) {
                that._validInterval = range;
            }

            that.interval = that._validInterval.toString();
        }

        /**
         * Returns a coerced value based on the interval.
         */

    }, {
        key: 'getCoercedValue',
        value: function getCoercedValue(value, useDrawVariables) {
            var that = this.context;

            if (!that.coerce) {
                return value;
            }

            value = value instanceof BigNumber ? value : new BigNumber(value);

            var minValue = void 0,
                maxValue = void 0;

            if (useDrawVariables !== false) {
                minValue = new BigNumber(that._drawMin);
                maxValue = new BigNumber(that._drawMax);
            } else {
                minValue = new BigNumber(that.min);
                maxValue = new BigNumber(that.max);
            }

            var noMin = value.subtract(minValue),
                remainder = noMin.mod(that._validInterval);

            if (remainder.compare(0) === 0) {
                return value;
            }

            var lowerValue = noMin.subtract(remainder),
                greaterValue = lowerValue.add(that._validInterval);

            if (noMin.subtract(lowerValue).abs().compare(noMin.subtract(greaterValue).abs()) < 0) {
                return lowerValue.add(minValue);
            } else {
                var biggerValue = greaterValue.add(minValue);

                return biggerValue.compare(maxValue) <= 0 ? biggerValue : lowerValue.add(minValue);
            }
        }

        /**
         * Updates the value of the Tank and the "value" property and triggers the respective events.
         */

    }, {
        key: 'updateValue',
        value: function updateValue(value) {
            var that = this.context,
                renderedValue = this.validate(value, that._minObject, that._maxObject),
                oldValue = that._number;

            value = value instanceof BigNumber ? value : new BigNumber(value);

            if (this.compare(value, that._number) || that._scaleTypeChangedFlag) {
                that.value = value.toString();
                that._number = renderedValue;
                that.$.fireEvent('change', { 'value': that.value, 'oldValue': oldValue });
            } else {
                that.value = value.toString();
            }

            that._drawValue = that.logarithmicScale ? Math.log10(renderedValue) : renderedValue;
            that._moveThumbBasedOnValue(that._drawValue);
        }

        /**
         * Returns value per pixel.
         */

    }, {
        key: 'getValuePerPx',
        value: function getValuePerPx(range, pxRange) {
            return new BigNumber(range).divide(pxRange);
        }

        /**
         * Restricts the thumbs to not pass each other.
         */

    }, {
        key: 'restrictValue',
        value: function restrictValue(values) {
            if (values[1].constructor === BigNumber) {
                if (values[1].compare(values[0]) === -1) {
                    values[1].set(values[0]);
                }
            } else {
                if (values[1] < values[0]) {
                    values[1] = values[0];
                }
            }
        }

        /**
         * Returns the angle equivalent of a value.
         */

    }, {
        key: 'getAngleByValue',
        value: function getAngleByValue(value, calculateDrawValue, returnDegrees) {
            var that = this.context;

            if (that._wordLengthNumber < 64) {
                return babelHelpers.get(IntegerNumericProcessor.prototype.__proto__ || Object.getPrototypeOf(IntegerNumericProcessor.prototype), 'getAngleByValue', this).call(this, parseFloat(value.toString()), calculateDrawValue, returnDegrees);
            }

            if (value instanceof BigNumber === false) {
                value = new BigNumber(value);
            }

            if (calculateDrawValue !== false && that.logarithmicScale) {
                value = new BigNumber(Math.log10(value.toString()));
            }

            var angleOffset = value.subtract(that._drawMin).multiply(that._angleRangeCoefficient);
            var degrees = void 0;

            if (!that.inverted) {
                degrees = angleOffset.multiply(-1).add(that.endAngle);
            } else {
                degrees = angleOffset.add(that.startAngle);
            }

            degrees = parseFloat(degrees.toString());

            if (returnDegrees) {
                return degrees;
            }
            return degrees * Math.PI / 180 + Math.PI / 2;
        }

        /**
         * Returns the value equivalent of an angle.
         */

    }, {
        key: 'getValueByAngle',
        value: function getValueByAngle(angle) {
            var that = this.context;

            if (that._wordLengthNumber < 64) {
                return babelHelpers.get(IntegerNumericProcessor.prototype.__proto__ || Object.getPrototypeOf(IntegerNumericProcessor.prototype), 'getValueByAngle', this).call(this, angle, true);
            }

            var minuendAngle = void 0,
                subtrahendAngle = void 0,
                value = void 0;

            if (!that.inverted) {
                minuendAngle = that.endAngle;
                subtrahendAngle = angle;
            } else {
                minuendAngle = angle;
                subtrahendAngle = that._normalizedStartAngle;
            }

            while (minuendAngle < subtrahendAngle) {
                minuendAngle += 360;
            }value = new BigNumber((minuendAngle - subtrahendAngle) / that._angleDifference).multiply(that._range).add(that._drawMin);

            if (that.logarithmicScale) {
                value = new BigNumber(Math.pow(10, value.toString()));
            }

            if (that.coerce) {
                return this.getCoercedValue(value, false);
            } else {
                return this.round(value);
            }
        }

        /**
         * Updates the values of the Gauge and its digital display and fires the "change" event.
         */

    }, {
        key: 'updateGaugeValue',
        value: function updateGaugeValue(newValue) {
            if (newValue instanceof BigNumber === false) {
                babelHelpers.get(IntegerNumericProcessor.prototype.__proto__ || Object.getPrototypeOf(IntegerNumericProcessor.prototype), 'updateGaugeValue', this).call(this, newValue);
            }

            var that = this.context,
                oldValue = that.value;

            that.value = newValue.toString();
            that._drawValue = that.logarithmicScale ? Math.log10(that.value).toString() : that.value;
            that._number = newValue;
            that.$.digitalDisplay.value = that.value;
            that.$.fireEvent('change', { 'value': that.value, 'oldValue': oldValue });
        }

        /**
         * Validates the start or end value of a Gauge color range.
         */

    }, {
        key: 'validateColorRange',
        value: function validateColorRange(value) {
            var that = this.context;

            if (that._wordLengthNumber < 64) {
                return babelHelpers.get(IntegerNumericProcessor.prototype.__proto__ || Object.getPrototypeOf(IntegerNumericProcessor.prototype), 'validateColorRange', this).call(this, value);
            }

            value = new BigNumber(value);

            var bigMin = new BigNumber(that.min),
                bigMax = new BigNumber(that.max);

            if (value.compare(bigMin) === -1) {
                value = bigMin;
            }

            if (value.compare(bigMax) === 1) {
                value = bigMax;
            }

            return value;
        }

        /**
         * Locks the Gauge's interaction with the mouse.
         */

    }, {
        key: 'lockRotation',
        value: function lockRotation(directionCondition, newValue) {
            var that = this.context;

            if (newValue instanceof BigNumber === false) {
                newValue = new BigNumber(newValue);
            }

            if (directionCondition && newValue.compare(that._number) === -1) {
                that._lockCW = true;
                if (newValue.compare(that._maxObject) === -1) {
                    return new BigNumber(that._maxObject);
                }
            } else if (!directionCondition && newValue.compare(that._number) === 1) {
                that._lockCCW = true;
                if (newValue.compare(that._minObject) === 1) {
                    return new BigNumber(that._minObject);
                }
            }
        }

        /**
         * Gets the angle-range coefficient.
         */

    }, {
        key: 'getAngleRangeCoefficient',
        value: function getAngleRangeCoefficient() {
            var that = this.context;

            that._angleRangeCoefficient = new BigNumber(that._angleDifference).divide(that._range);
        }
    }]);
    return IntegerNumericProcessor;
}(JQX.Utilities.BaseNumericProcessor));

/**
 * A class for processesing floating point numbers.
 */
JQX.Utilities.Assign('DecimalNumericProcessor', function (_JQX$Utilities$BaseNu2) {
    babelHelpers.inherits(DecimalNumericProcessor, _JQX$Utilities$BaseNu2);

    function DecimalNumericProcessor(context, numericFormatProperty) {
        babelHelpers.classCallCheck(this, DecimalNumericProcessor);

        var _this2 = babelHelpers.possibleConstructorReturn(this, (DecimalNumericProcessor.__proto__ || Object.getPrototypeOf(DecimalNumericProcessor)).call(this, context, numericFormatProperty));

        _this2.context = context;
        return _this2;
    }

    /**
     * Returns the precise modulo of the mod operation.
     */


    babelHelpers.createClass(DecimalNumericProcessor, [{
        key: 'getPreciseModulo',
        value: function getPreciseModulo(dividend, divisor, moduloCoefficient) {
            var sign = dividend >= 0 ? 1 : -1;

            dividend = Math.abs(dividend);
            divisor = Math.abs(divisor);

            if (typeof moduloCoefficient === 'undefined') {
                var dividendExponential = dividend.toExponential(),
                    divisorExponential = divisor.toExponential(),
                    dividendExponent = parseInt(dividendExponential.slice(dividendExponential.indexOf('e') + 1), 10),
                    divisorExponent = parseInt(divisorExponential.slice(divisorExponential.indexOf('e') + 1), 10),
                    dividendRoundCoefficient = dividendExponent < 0 ? Math.abs(dividendExponent) : 0,
                    divisorRoundCoefficient = divisorExponent < 0 ? Math.abs(divisorExponent) : 0,
                    _roundCoefficient = Math.max(dividendRoundCoefficient, divisorRoundCoefficient);

                this.roundCoefficient = _roundCoefficient;

                if (dividend < divisor) {
                    return sign * dividend;
                }
                if (dividend === divisor) {
                    return 0;
                }
                if ((dividend < -1 || dividend > 1) && (divisor < -1 || divisor > 1 || divisor === 1)) {
                    if (dividend % 1 === 0 && divisor % 1 === 0) {
                        return sign * (dividend % divisor);
                    } else {
                        return sign * parseFloat(new BigNumber(dividend).mod(divisor).toString());
                    }
                }

                var _moduloCoefficient = Math.pow(10, _roundCoefficient);

                return sign * (dividend * _moduloCoefficient % (divisor * _moduloCoefficient) / _moduloCoefficient);
            }
            return sign * (Math.round(dividend * moduloCoefficient) % Math.round(divisor * moduloCoefficient));
        }

        /**
         * Creates a descriptor.
         */

    }, {
        key: 'createDescriptor',
        value: function createDescriptor(initialValue, supportsENotation, validateConstruction, validateMinMax) {
            var returnValue = parseFloat(initialValue);

            if (validateMinMax) {
                returnValue = this.validate(returnValue, this.context._minObject, this.context._maxObject);
            }
            return returnValue;
        }

        /**
         * Validates the value.
         */

    }, {
        key: 'validate',
        value: function validate(initialValue, min, max) {
            var returnValue = void 0;

            if (initialValue < min) {
                returnValue = min;
            } else if (initialValue > max) {
                returnValue = max;
            } else {
                returnValue = initialValue;
            }
            return returnValue;
        }

        /**
         * Validates min/max.
         */

    }, {
        key: 'validateMinMax',
        value: function validateMinMax(validateMin, validateMax) {
            var that = this.context,
                checkSpecialRegexMin = typeof that._regexSpecial !== 'undefined' ? that._regexSpecial.inf.test(that.min) : false,
                checkSpecialRegexMax = typeof that._regexSpecial !== 'undefined' ? that._regexSpecial.inf.test(that.max) : false;

            if (validateMin) {
                if (that.min === null || checkSpecialRegexMin) {
                    that.min = -Infinity;
                }

                that.min = that.min.toString().replace(/\s/g, '');
                if (this.regexScientificNotation.test(that.min)) {
                    that.min = this.scientificToDecimal(that.min);
                }

                that._minObject = that._discardDecimalSeparator(that.min);
            }
            if (validateMax) {
                if (that.max === null || checkSpecialRegexMax) {
                    that.max = Infinity;
                }

                that.max = that.max.toString().replace(/\s/g, '');
                if (this.regexScientificNotation.test(that.max)) {
                    that.max = this.scientificToDecimal(that.max);
                }

                that._maxObject = that._discardDecimalSeparator(that.max);
            }

            if (!this.compare(that._minObject, that._maxObject)) {

                //Set default values
                that._maxObject = parseFloat(that._maxObject) + 1;
                that.max = that._maxObject;
            }
        }

        /**
         * Returns the pixel equivalent of a value.
         */

    }, {
        key: 'valueToPx',
        value: function valueToPx(value) {
            var that = this.context,
                lengthRangeRatio = that._measurements.trackLength / that._range;

            var result = void 0;

            if (that._normalLayout) {
                result = lengthRangeRatio * (value - that._drawMin);
            } else {
                result = lengthRangeRatio * (that._drawMax - value);
            }

            return Math.round(result);
        }

        /**
         * Returns the value equivalent of a pixel offset.
         */

    }, {
        key: 'pxToValue',
        value: function pxToValue(px) {
            var that = this.context;

            var result = void 0;

            if (that._normalLayout) {
                result = (px - that._trackStart) * that._valuePerPx;
            } else {
                result = (that._trackEnd - px) * that._valuePerPx;
            }

            if (that.logarithmicScale) {
                var power = result + parseFloat(that._drawMin);

                that._drawValue = power;
                return Math.pow(10, power);
            }

            result = this.validate(result + that._minObject, that._minObject, that._maxObject);
            that._drawValue = result;

            return result;
        }

        /**
         * Decimal compare method.
         */

    }, {
        key: 'compare',
        value: function compare(initialValue, otherValue) {
            return initialValue !== otherValue;
        }

        /**
         * Increments/Decrements value. Keyboard navigation operations.
         */

    }, {
        key: 'incrementDecrement',
        value: function incrementDecrement(initialValue, operation, stepObject) {
            var that = this.context;

            var returnValue = void 0;

            if (operation === 'add') {
                returnValue = parseFloat(initialValue) + parseFloat(stepObject);
                if (that._drawMax !== undefined) {
                    return returnValue > parseFloat(that._drawMax) ? that._drawMax : returnValue;
                }
            } else {
                returnValue = parseFloat(initialValue) - parseFloat(stepObject);
                if (that._drawMin !== undefined) {
                    return returnValue < parseFloat(that._drawMin) ? that._drawMin : returnValue;
                }
            }
            return returnValue;
        }

        /**
         * Renders the value.
         */

    }, {
        key: 'render',
        value: function render(initialValue) {
            var that = this.context,
                checkSpecialRegex = typeof that._regexSpecial !== 'undefined' ? that._regexSpecial.nonNumericValue.test(initialValue) : false;

            if (checkSpecialRegex) {
                return initialValue;
            } else {
                var numberRenderer = new JQX.Utilities.NumberRenderer(initialValue);

                if (that.scientificNotation) {
                    return numberRenderer.toScientific();
                } else {
                    return numberRenderer.toDigits(that.significantDigits, that.precisionDigits);
                }
            }
        }

        /**
         * Adds tank\'s ticks and labels.
         */

    }, {
        key: 'addTicksAndLabels',
        value: function addTicksAndLabels() {
            var that = this.context,
                trackLength = that._measurements.trackLength,
                normalLayout = that._normalLayout,
                ticksFrequency = that._majorTicksInterval,
                tickscount = Math.round(that._range / parseFloat(ticksFrequency.toString())),
                ticksDistance = trackLength / tickscount,
                min = parseFloat(that._drawMin),
                max = parseFloat(that._drawMax);

            var first = void 0,
                second = void 0,
                distanceModifier = void 0,
                last = void 0,
                firstLabelValue = void 0,
                firstLabelSize = void 0,
                lastLabelValue = void 0,
                lastLabelSize = void 0,
                currentTickAndLabel = void 0,
                ticks = '',
                labels = '';

            that._tickValues = [];
            this._longestLabelSize = 0;

            if (normalLayout) {
                first = min;

                //handling specific case
                if (that.logarithmicScale && min < 0 && min !== -1) {
                    second = parseFloat(first - this.getPreciseModulo(first, ticksFrequency));
                } else {
                    second = parseFloat(first - this.getPreciseModulo(first, ticksFrequency) + parseFloat(ticksFrequency));
                }

                distanceModifier = second - first;
                firstLabelValue = that._formatLabel(min);
                firstLabelSize = that._tickIntervalHandler.labelsSize.minLabelSize;
                last = max;
                lastLabelValue = that._formatLabel(max);
                lastLabelSize = that._tickIntervalHandler.labelsSize.maxLabelSize;
            } else {
                first = max;
                second = parseFloat(first - this.getPreciseModulo(first, ticksFrequency));
                distanceModifier = first - second;
                firstLabelValue = that._formatLabel(max);
                firstLabelSize = that._tickIntervalHandler.labelsSize.maxLabelSize;
                last = min;
                lastLabelValue = that._formatLabel(min);
                lastLabelSize = that._tickIntervalHandler.labelsSize.minLabelSize;
            }

            that._labelDummy = this._createMeasureLabel();

            currentTickAndLabel = this._addMajorTickAndLabel(firstLabelValue, firstLabelSize, true, first); // first tick and label
            ticks += currentTickAndLabel.tick;
            labels += currentTickAndLabel.label;

            // special case for second tick and label
            var distanceFromFirstToSecond = distanceModifier / ticksFrequency * ticksDistance;

            if (second.toString() !== that._drawMax.toString() && distanceFromFirstToSecond < trackLength) {
                // second item rendering
                var secondItemHtmlValue = that._formatLabel(second.toString()),
                    plotSecond = firstLabelSize < distanceFromFirstToSecond;

                currentTickAndLabel = this._addMajorTickAndLabel(secondItemHtmlValue, undefined, plotSecond, second, true);
                ticks += currentTickAndLabel.tick;
                labels += currentTickAndLabel.label;
            }

            currentTickAndLabel = this.addMiddleMajorTicks(tickscount, ticksDistance, distanceFromFirstToSecond, distanceModifier, normalLayout, ticksFrequency);
            ticks += currentTickAndLabel.tick;
            labels += currentTickAndLabel.label;
            currentTickAndLabel = this._addMajorTickAndLabel(lastLabelValue, lastLabelSize, true, last); // last tick and label
            ticks += currentTickAndLabel.tick;
            labels += currentTickAndLabel.label;
            ticks += this.addMinorTicks(normalLayout);

            that._measureLabelScale.removeChild(that._labelDummy);
            delete that._labelDummy;
            delete that._measureLabelScale;

            if (that.nodeName.toLowerCase() === 'jqx-tank') {
                that._updateScaleWidth(this._longestLabelSize);
            }

            that._appendTicksAndLabelsToScales(ticks, labels);
        }

        /**
        * Adds the middle major ticks and their respective labels.
        */

    }, {
        key: 'addMiddleMajorTicks',
        value: function addMiddleMajorTicks(tickscount, ticksDistance, distanceFromFirstToSecond, distanceModifier, normalLayout, ticksFrequency) {
            var that = this.context;

            var majorTicks = '',
                majorLabels = '';

            for (var i = 1; i < tickscount; i++) {
                var number = i * ticksDistance + distanceFromFirstToSecond,
                    value = void 0;

                if (normalLayout) {
                    value = parseFloat(that._drawMin) + ticksFrequency * i + distanceModifier;
                } else {
                    value = parseFloat(that._drawMax) - ticksFrequency * i - distanceModifier;
                }
                if (value.toString() !== that._drawMax.toString()) {
                    var htmlValue = that._formatLabel(value.toString()),
                        plot = true;

                    that._labelDummy.innerHTML = htmlValue;
                    var dimensionValue = that._labelDummy[that._settings.size];

                    if (number + dimensionValue >= tickscount * ticksDistance) {
                        // + 32 is an Experimental value
                        plot = false;
                    }
                    var currentTickAndLabel = this._addMajorTickAndLabel(htmlValue, undefined, plot, value, true);

                    majorTicks += currentTickAndLabel.tick;
                    majorLabels += currentTickAndLabel.label;
                }
            }
            return { tick: majorTicks, label: majorLabels };
        }

        /**
         * Adds minor ticks.
         */

    }, {
        key: 'addMinorTicks',
        value: function addMinorTicks(normalLayout) {
            function getPreciseFraction(i) {
                return parseFloat(i.toFixed(roundCoefficient));
            }

            function addMinorTick(i) {
                if (tickValues.indexOf(i) === -1 && that._numericProcessor.getPreciseModulo(i, minorTicksInterval, moduloCoefficient) === 0) {
                    minorTicks += '<div style="' + leftOrTop + ': ' + that._numericProcessor.valueToPx(i) + 'px;" class="jqx-tick jqx-tick-minor"></div>';
                }
            }
            var that = this.context,
                tickValues = that._tickValues,
                nearestPowerOfTen = that._tickIntervalHandler.nearestPowerOfTen,
                minorTicksInterval = that._minorTicksInterval,
                roundCoefficient = Math.log10(nearestPowerOfTen) < 0 ? Math.round(Math.abs(Math.log10(nearestPowerOfTen))) : 0,
                moduloCoefficient = Math.pow(10, roundCoefficient),
                leftOrTop = that._settings.leftOrTop;

            var firstTickValue = void 0,
                secondTickValue = void 0,
                lastTickValue = void 0,
                minorTicks = '';

            if (normalLayout) {
                firstTickValue = tickValues[0];
                secondTickValue = tickValues[1];
                lastTickValue = tickValues[tickValues.length - 1];
            } else {
                firstTickValue = tickValues[tickValues.length - 1];
                secondTickValue = tickValues[tickValues.length - 2];
                lastTickValue = tickValues[0];
            }

            if (that.logarithmicScale) {
                addMinorTickOnLogarithmicScale();
            } else {
                // minor ticks from the beginning to the second major tick
                for (var i = secondTickValue; i > firstTickValue; i = getPreciseFraction(i - nearestPowerOfTen)) {
                    addMinorTick(i);
                }

                // minor ticks from the second major tick to the end
                for (var _i6 = getPreciseFraction(secondTickValue + nearestPowerOfTen); _i6 < lastTickValue; _i6 = getPreciseFraction(_i6 + nearestPowerOfTen)) {
                    addMinorTick(_i6);
                }
            }

            function addMinorTickOnLogarithmicScale() {
                var trackLength = that._measurements.trackLength,
                    partialTrackLength = trackLength / tickValues.length,
                    modifierCoef = 0.1;

                if (partialTrackLength < 20) {
                    modifierCoef = 1;
                } else if (partialTrackLength >= 20 && partialTrackLength < 40) {
                    modifierCoef = secondTickValue - firstTickValue > 1 ? 1 : 0.5;
                } else if (partialTrackLength >= 40 && partialTrackLength < 80) {
                    modifierCoef = 0.2;
                }

                var nearestPowerOf10BelowMax = Math.floor(that._drawMax),
                    distanceToNearestPowerOf10 = that._drawMax - nearestPowerOf10BelowMax,
                    ticksOnPowerOf10 = that._drawMax - that._drawMin > tickValues.length;

                for (var j = that._drawMax; j > that._drawMin - 1; j = j - 1) {
                    var range = distanceToNearestPowerOf10 > 0 ? Math.pow(10, j - distanceToNearestPowerOf10 + 1) : Math.pow(10, j),
                        modifier = range * modifierCoef;

                    for (var _i7 = range; _i7 > 0; _i7 = _i7 - modifier) {
                        if (_i7 < that.max && _i7 > that.min) {
                            var value = new BigNumber(Math.log10(_i7));

                            if (value % 1 === 0 && ticksOnPowerOf10 || !ticksOnPowerOf10) {
                                minorTicks += '<div style="' + leftOrTop + ': ' + that._numericProcessor.valueToPx(value) + 'px;" class="jqx-tick jqx-tick-minor"></div>';
                            }
                        }
                    }
                }
            }
            return minorTicks;
        }

        /**
         * Plots the Gauge's ticks and labels.
         */

    }, {
        key: 'addGaugeTicksAndLabels',
        value: function addGaugeTicksAndLabels() {
            var that = this.context;

            if (that.ticksVisibility === 'none' && that.labelsVisibility === 'none') {
                return;
            }

            var numericProcessor = this,
                maxLabelHeight = Math.max(that._tickIntervalHandler.labelsSize.minLabelSize, that._tickIntervalHandler.labelsSize.maxLabelSize),
                majorStep = that._majorTicksInterval,
                minorStep = that._minorTicksInterval,
                majorTickValues = {},
                distance = that._distance,
                radius = that._measurements.radius,
                majorTickWidth = radius - distance.majorTickDistance,
                minorTickWidth = radius - distance.minorTickDistance;
            var drawMajor = void 0,
                drawMinor = void 0,
                addLabel = void 0,
                currentAngle = void 0,
                angleAtMin = void 0,
                angleAtMax = void 0;

            if (that.ticksVisibility !== 'none' && that._plotTicks !== false) {
                drawMajor = function drawMajor(angle) {
                    that._drawTick(angle, majorTickWidth, 'major');
                };

                drawMinor = function drawMinor(value) {
                    that._drawTick(numericProcessor.getAngleByValue(value, true), minorTickWidth, 'minor');
                };
            } else {
                drawMajor = function drawMajor() {};
                drawMinor = function drawMinor() {};
            }

            if (that.labelsVisibility !== 'none' && that._plotLabels !== false) {
                addLabel = function addLabel(angle, currentLabel, middle) {
                    that._drawLabel(angle, currentLabel, distance.labelDistance, middle);
                };
            } else {
                addLabel = function addLabel() {};
            }

            if (!that.inverted) {
                angleAtMin = that.endAngle;
                angleAtMax = that.startAngle;
            } else {
                angleAtMin = that.startAngle;
                angleAtMax = that.endAngle;
            }

            // first major tick and label
            currentAngle = numericProcessor.getAngleByValue(that._drawMin, false);
            drawMajor(currentAngle);
            majorTickValues[that._drawMin] = true;
            addLabel(currentAngle, that.min, false);

            var second = that._drawMin - numericProcessor.getPreciseModulo(that._drawMin, majorStep),
                firstMinTick = void 0;

            if (that._drawMin >= 0) {
                second += majorStep;
            }

            // determines the value at the first minor tick
            for (var _i8 = second; _i8 >= that._drawMin; _i8 = _i8 - minorStep) {
                firstMinTick = _i8;
            }

            // second major tick and label
            currentAngle = numericProcessor.getAngleByValue(second, false);
            drawMajor(currentAngle);
            majorTickValues[second] = true;
            if (2 * Math.PI * that._measurements.innerRadius * (that._getAngleDifference(angleAtMin, numericProcessor.getAngleByValue(second, false, true)) / 360) > maxLabelHeight) {
                addLabel(currentAngle, this.getActualValue(second), second < that._drawMax);
            }

            var i = void 0;
            // middle major ticks and labels
            for (i = second + majorStep; i < that._drawMax - majorStep; i += majorStep) {
                currentAngle = numericProcessor.getAngleByValue(i, false);
                drawMajor(currentAngle);
                majorTickValues[i] = true;
                addLabel(currentAngle, this.getActualValue(i), true);
            }

            if (majorTickValues[i] === undefined && i <= that._drawMax) {
                // second-to-last major tick and label
                currentAngle = numericProcessor.getAngleByValue(i, false);
                drawMajor(currentAngle);
                majorTickValues[i] = true;
                if (2 * Math.PI * that._measurements.innerRadius * (that._getAngleDifference(angleAtMax, numericProcessor.getAngleByValue(i, false, true)) / 360) >= maxLabelHeight) {
                    addLabel(currentAngle, this.getActualValue(i), true);
                }

                if (that._normalizedStartAngle !== that.endAngle) {
                    // last major tick and label
                    currentAngle = numericProcessor.getAngleByValue(that._drawMax, false);
                    drawMajor(currentAngle);
                    majorTickValues[that._drawMax] = true;
                    if (2 * Math.PI * that._measurements.innerRadius * (that._getAngleDifference(angleAtMax, angleAtMin) / 360) >= maxLabelHeight) {
                        addLabel(currentAngle, that.max, false);
                    }
                }
            }

            // minor ticks
            if (!that.logarithmicScale) {
                for (var j = firstMinTick; j < that._drawMax; j += minorStep) {
                    if (majorTickValues[j]) {
                        continue; // does not plot minor ticks over major ones
                    }
                    drawMinor(j);
                }
            } else {
                this.drawGaugeLogarithmicScaleMinorTicks(majorTickValues, majorStep, drawMinor);
            }
        }

        /**
         * Sets toolTip's value and updates the value of the element.
         */

    }, {
        key: 'updateToolTipAndValue',
        value: function updateToolTipAndValue(value, oldValue, changeValue) {
            var that = this.context;

            that._updateTooltipValue(value);
            if (that.logarithmicScale) {
                value = parseFloat(Math.pow(10, parseFloat(value)).toFixed(13));
            }

            // eslint-disable-next-line
            if (value !== oldValue) {
                if (changeValue) {
                    that._drawValue = value.toString();
                    that.value = that._discardDecimalSeparator(that._drawValue);
                    that.$.fireEvent('change', { 'value': that.value, 'oldValue': oldValue });
                }
            }
        }

        /**
         * Validates the interval property.
         */

    }, {
        key: 'validateInterval',
        value: function validateInterval(interval) {
            var that = this.context,
                range = that._maxObject - that._minObject;

            that._validInterval = Math.min(parseFloat(interval), range);
            that.interval = that._validInterval;
        }

        /**
          * Returns a coerced value based on the interval.
          */

    }, {
        key: 'getCoercedValue',
        value: function getCoercedValue(value, useDrawVariables) {
            var that = this.context;

            if (!that.coerce) {
                return value;
            }

            var minValue = void 0,
                maxValue = void 0;

            if (useDrawVariables !== false) {
                minValue = parseFloat(that._drawMin);
                maxValue = parseFloat(that._drawMax);
            } else {
                minValue = parseFloat(that.min);
                maxValue = parseFloat(that.max);
            }

            var noMin = value - minValue,
                remainder = this.getPreciseModulo(noMin, parseFloat(that.interval)),
                coef = this.roundCoefficient;

            if (remainder === 0) {
                return value;
            }

            if (this.roundCoefficient === 0) {
                coef = 12;
            }

            var lowerValue = parseFloat((noMin - remainder).toFixed(coef)),
                greaterValue = lowerValue + parseFloat(that.interval);

            if (that.max - that.min <= parseFloat(that.interval) && !that.logarithmicScale) {
                var min = minValue,
                    max = maxValue;

                return value >= min + (max - min) / 2 ? max : min;
            }

            if (Math.abs(noMin - lowerValue) < Math.abs(noMin - greaterValue)) {
                return lowerValue + minValue;
            } else {
                var biggerValue = greaterValue + minValue;

                return biggerValue > maxValue ? lowerValue + minValue : biggerValue;
            }
        }

        /**
           * Updates the value of the Tank and the "value" property and triggers the respective events.
           */

    }, {
        key: 'updateValue',
        value: function updateValue(value) {
            var that = this.context,
                renderedValue = this.validate(value, that._minObject, that._maxObject),
                oldValue = that.value;

            if (parseFloat(value) !== oldValue || that._scaleTypeChangedFlag) {
                that.value = value.toString();
                that._number = renderedValue;
                that.$.fireEvent('change', { 'value': that.value, 'oldValue': oldValue });
            } else {
                that.value = typeof value === 'string' ? value : value.toString();
            }

            that._drawValue = that.logarithmicScale ? Math.log10(renderedValue).toString() : renderedValue.toString();
            that._moveThumbBasedOnValue(that._drawValue);
        }

        /**
         * Returns value per pixel.
         */

    }, {
        key: 'getValuePerPx',
        value: function getValuePerPx(range, pxRange) {
            return parseFloat(range) / pxRange;
        }

        /**
         * Restricts the thumbs to not pass each other.
         */

    }, {
        key: 'restrictValue',
        value: function restrictValue(values) {
            if (values[1] < values[0]) {
                values[1] = values[0];
            }
        }

        /**
         * Locks the Gauge's interaction with the mouse.
         */

    }, {
        key: 'lockRotation',
        value: function lockRotation(directionCondition, newValue) {
            var that = this.context;

            if (directionCondition && newValue < that._number) {
                that._lockCW = true;
                if (newValue < that._maxObject) {
                    return that._maxObject;
                }
            } else if (!directionCondition && newValue > that._number) {
                that._lockCCW = true;
                if (newValue > that._minObject) {
                    return that._minObject;
                }
            }
        }

        /**
         * Gets the angle-range coefficient.
         */

    }, {
        key: 'getAngleRangeCoefficient',
        value: function getAngleRangeCoefficient() {
            var that = this.context;

            that._angleRangeCoefficient = that._angleDifference / that._range;
        }
    }]);
    return DecimalNumericProcessor;
}(JQX.Utilities.BaseNumericProcessor));

/**
 * A class for processesing complex numbers.
 */
JQX.Utilities.Assign('ComplexNumericProcessor', function (_JQX$Utilities$BaseNu3) {
    babelHelpers.inherits(ComplexNumericProcessor, _JQX$Utilities$BaseNu3);

    function ComplexNumericProcessor(context, numericFormatProperty) {
        babelHelpers.classCallCheck(this, ComplexNumericProcessor);

        var _this3 = babelHelpers.possibleConstructorReturn(this, (ComplexNumericProcessor.__proto__ || Object.getPrototypeOf(ComplexNumericProcessor)).call(this, context, numericFormatProperty));

        _this3.context = context;
        return _this3;
    }

    /**
     * Creates a Complex number descriptor.
     */


    babelHelpers.createClass(ComplexNumericProcessor, [{
        key: 'createDescriptor',
        value: function createDescriptor(initialValue, supportsENotation, validateConstruction, validateMinMax, discardRadix, presetComplexNumber) {
            var returnValue = void 0;

            if (presetComplexNumber) {
                returnValue = presetComplexNumber;
            } else {
                var constructorArguments = [];

                if (initialValue.constructor === NIComplex) {
                    constructorArguments[0] = initialValue.realPart;
                    constructorArguments[1] = initialValue.imaginaryPart;
                } else {
                    constructorArguments[0] = initialValue;
                }
                returnValue = new (Function.prototype.bind.apply(NIComplex, [null].concat(constructorArguments)))();
            }
            if (validateMinMax) {
                returnValue = this.validate(returnValue, this.context._minObject, this.context._maxObject);
            }
            return returnValue;
        }

        /**
         * Validates value.
         */

    }, {
        key: 'validate',
        value: function validate(initialValue, min, max) {
            var returnValue = initialValue;

            if (min !== -Infinity) {
                if (this.compareComplexNumbers(initialValue, min) === -1) {
                    returnValue = new NIComplex(min.realPart, min.imaginaryPart);
                }
            } else if (max !== Infinity) {
                if (this.compareComplexNumbers(initialValue, max) === 1) {
                    returnValue = new NIComplex(max.realPart, max.imaginaryPart);
                }
            }
            return returnValue;
        }

        /**
         * Complex number compare method.
         */

    }, {
        key: 'compare',
        value: function compare(initialValue, otherValue) {
            return this.compareComplexNumbers(initialValue, otherValue) !== 0;
        }

        /**
         * Validates min/max.
         */

    }, {
        key: 'validateMinMax',
        value: function validateMinMax(validateMin, validateMax) {
            var that = this.context;

            if (validateMin) {
                if (that.min === null || that._regexSpecial.inf.test(that.min)) {
                    that.min = -Infinity;
                    that._minObject = -Infinity;
                } else {
                    that._minObject = new NIComplex(that.min);
                }
            }

            if (validateMax) {
                if (that.max === null || that._regexSpecial.inf.test(that.max)) {
                    that.max = Infinity;
                    that._maxObject = Infinity;
                } else {
                    that._maxObject = new NIComplex(that.max);
                }
            }
        }

        /**
         * Increments/Decrements value. Keyboard navigation operations.
         */

    }, {
        key: 'incrementDecrement',
        value: function incrementDecrement(initialValue, operation) {
            var returnValue = new NIComplex(initialValue.realPart, initialValue.imaginaryPart),
                spinButtonsStepObject = this.context._spinButtonsStepObject;

            if (operation === 'add') {
                returnValue.realPart += spinButtonsStepObject.realPart;
                returnValue.imaginaryPart += spinButtonsStepObject.imaginaryPart;
            } else {
                returnValue.realPart -= spinButtonsStepObject.realPart;
                returnValue.imaginaryPart -= spinButtonsStepObject.imaginaryPart;
            }
            return returnValue;
        }

        /**
         * Renders the value. Complex number renderer.
         */

    }, {
        key: 'render',
        value: function render(initialValue) {
            var returnValue = initialValue;

            if (this.context._regexSpecial.nonNumericValue.test(initialValue) === false) {
                var realPart = returnValue.realPart,
                    imaginaryPart = returnValue.imaginaryPart,
                    sign = void 0,
                    significantDigits = this.context.significantDigits,
                    precisionDigits = this.context.precisionDigits;

                if (imaginaryPart >= 0) {
                    sign = '+';
                } else {
                    sign = '-';
                    imaginaryPart = Math.abs(imaginaryPart);
                }

                var realPartRenderer = new JQX.Utilities.NumberRenderer(realPart),
                    imaginaryPartRenderer = new JQX.Utilities.NumberRenderer(imaginaryPart);

                if (this.context.scientificNotation) {
                    realPart = realPartRenderer.toScientific();
                    imaginaryPart = imaginaryPartRenderer.toScientific();
                } else {
                    realPart = realPartRenderer.toDigits(significantDigits, precisionDigits);
                    imaginaryPart = imaginaryPartRenderer.toDigits(significantDigits, precisionDigits);
                }

                returnValue = realPart + ' ' + sign + ' ' + imaginaryPart + 'i';
            }
            return returnValue;
        }

        /**
         * Complex number compare method.
         */

    }, {
        key: 'compareComplexNumbers',
        value: function compareComplexNumbers(left, right) {
            if (left.constructor !== NIComplex || right.constructor !== NIComplex) {
                // if at least one of the numbers is not an NIComplex object, the numbers are different
                return -1;
            }

            var leftReal = left.realPart,
                rightReal = right.realPart;

            if (leftReal < rightReal) {
                return -1;
            } else if (leftReal > rightReal) {
                return 1;
            } else {
                var leftImaginary = left.imaginaryPart,
                    rightImaginary = right.imaginaryPart;

                if (leftImaginary < rightImaginary) {
                    return -1;
                } else if (leftImaginary > rightImaginary) {
                    return 1;
                } else {
                    return 0;
                }
            }
        }
    }]);
    return ComplexNumericProcessor;
}(JQX.Utilities.BaseNumericProcessor));