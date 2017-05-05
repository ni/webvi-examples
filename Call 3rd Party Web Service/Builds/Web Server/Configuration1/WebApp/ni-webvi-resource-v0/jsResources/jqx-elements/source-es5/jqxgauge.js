'use strict';

/**
 * Gauge custom element.
 */
JQX('jqx-gauge', function (_JQX$Tank) {
    babelHelpers.inherits(Gauge, _JQX$Tank);

    function Gauge() {
        babelHelpers.classCallCheck(this, Gauge);
        return babelHelpers.possibleConstructorReturn(this, (Gauge.__proto__ || Object.getPrototypeOf(Gauge)).apply(this, arguments));
    }

    babelHelpers.createClass(Gauge, [{
        key: 'template',


        /**
         * Gauge's HTML template.
         */
        value: function template() {
            var template = '<div id="container">\n                <div class="jqx-digital-display-container">\n                    <jqx-numeric-text-box id="digitalDisplay"\n                                            class="jqx-digital-display"\n                                            decimal-separator="[[decimalSeparator]]"\n                                            max="[[max]]"\n                                            min="[[min]]"\n                                            readonly\n                                            input-format="[[scaleType]]"\n                                            scientific-notation="[[scientificNotation]]"\n                                            show-unit="[[showUnit]]"\n                                            unit="[[unit]]"\n                                            value="[[value]]"\n                                            word-length="[[wordLength]]">\n                    </jqx-numeric-text-box>\n                </div>\n                <div id="svgContainer" class="jqx-svg-container"></div>\n            </div>';

            return template;
        }

        /**
         * Invoked when an instance of custom element is attached to the DOM for the first time.
         */

    }, {
        key: 'ready',
        value: function ready() {
            babelHelpers.get(Gauge.prototype.__proto__ || Object.getPrototypeOf(Gauge.prototype), 'ready', this).call(this);
        }

        /**
         * Sets or gets the value of the Gauge.
         *
         * @param {Number/String} value Optional value to be set to the Gauge. If this parameter is not set, the method gets the value.
         */

    }, {
        key: 'val',
        value: function val(value) {
            var that = this,
                isEmptyObject = (typeof value === 'undefined' ? 'undefined' : babelHelpers.typeof(value)) === 'object' && Object.keys(value).length === 0;

            if (value !== undefined && isEmptyObject === false) {
                // use as value setter

                // eslint-disable-next-line
                if (value != that.value) {
                    that._validateValue(value, that.value);
                    that._updatePointer();
                }
            } else {
                // use as value getter
                return that.value;
            }
        }

        /**
         * Applies initial settings to the Gauge element.
         */

    }, {
        key: '_createElement',
        value: function _createElement() {
            var that = this;

            that._checkMissingModules();
            that._setSettingsObject();

            //Creating instances of NumericProcessor, NumberRenderer and Draw
            that._numericProcessor = new JQX.Utilities.NumericProcessor(that, 'scaleType');
            that._numberRenderer = new JQX.Utilities.NumberRenderer();
            that._draw = new JQX.Utilities.Draw(that.$.svgContainer);

            that._wordLengthNumber = that._numericProcessor.getWordLength(that.wordLength);

            that._measurements = {};
            that._validateInitialPropertyValues();
            that._getMeasurements();

            that._setDrawVariables();
            that._getRange();
            that._numericProcessor.getAngleRangeCoefficient();

            that._validateValue();

            that._initTickIntervalHandler();

            that._renderAnalogItems();

            that._setTabIndex();

            that._setUpdatePointerMethod();
        }

        /**
         * Invoked when the value of a public property has been changed by the user.
         */

    }, {
        key: 'propertyChangedHandler',
        value: function propertyChangedHandler(key, oldValue, value) {
            function validateMinMax(validateMin, validateMax, oldMin, oldMax) {
                var toValidate = validateMin && validateMax ? 'both' : key;

                that._validateMinMax(toValidate, false, oldValue);

                if (key !== 'logarithmicScale' && key !== 'scaleType' && (key !== 'wordLength' && that[key] === oldValue || key === 'wordLength' && that.min === oldMin && that.max === oldMax)) {
                    return;
                }

                that._setDrawVariables();
                that._getRange();
                that._numericProcessor.getAngleRangeCoefficient();
                that._initTickIntervalHandler();
                that._renderAnalogItems();

                that._validateValue();
                that._updatePointer();
            }

            var that = this;
            switch (key) {
                case 'analogDisplayType':
                    that._getMeasurements();
                    that._renderAnalogItems();

                    if (value === 'needle' && that.digitalDisplayPosition === 'center') {
                        that.digitalDisplayPosition = 'bottom';
                    } else if (oldValue === 'needle' && that.digitalDisplayPosition === 'bottom') {
                        that.digitalDisplayPosition = 'center';
                    }

                    that._setUpdatePointerMethod();
                    break;
                case 'coerce':
                    if (value) {
                        var valueBeforeCoercion = that.value;
                        that._validateValue(valueBeforeCoercion);
                        that._updatePointer();
                        that._valueBeforeCoercion = valueBeforeCoercion; // stores value before coercion
                    } else {
                        if (that._valueBeforeCoercion !== undefined) {
                            that._validateValue(that._valueBeforeCoercion); // restores the value from before coercion
                            that._updatePointer();
                        }
                    }
                    break;
                case 'decimalSeparator':
                case 'scientificNotation':
                case 'showUnit':
                case 'unit':
                    that._initTickIntervalHandler();
                    that._renderAnalogItems();
                    break;
                case 'digitalDisplay':
                case 'digitalDisplayPosition':
                case 'disabled':
                case 'mechanicalAction':
                case 'messages':
                case 'readonly':
                    break;
                case 'drawNeedle':
                    if (that.analogDisplayType !== 'needle') {
                        return;
                    }

                    if (oldValue === null) {
                        that._draw.removeElement(that._needle);
                    }

                    that._updatePointer();
                    break;
                case 'endAngle':
                case 'startAngle':
                    that._validateAngles();
                    that._numericProcessor.getAngleRangeCoefficient();
                    that._renderAnalogItems();
                    break;
                case 'interval':
                    that._numericProcessor.validateInterval(that.interval);
                    that._validateValue();
                    that._updatePointer();
                    break;
                case 'inverted':
                case 'labelFormatFunction':
                case 'scalePosition':
                case 'showRanges':
                    that._renderAnalogItems();
                    break;
                case 'labelsVisibility':
                    if (oldValue === 'all' && value === 'endPoints' || oldValue === 'endPoints' && value === 'all') {
                        return;
                    }
                    that._getMeasurements();
                    that._renderAnalogItems();
                    break;
                case 'logarithmicScale':
                    that._initTickIntervalHandler();
                    validateMinMax(true, true);
                    break;
                case 'max':
                case 'min':
                    validateMinMax(key === 'min', key === 'max');
                    break;
                case 'needlePosition':
                    if (that.analogDisplayType === 'needle') {
                        that._updatePointer();
                    }
                    break;
                case 'precisionDigits':
                case 'significantDigits':
                    if (key === 'precisionDigits' && that.scaleType === 'integer') {
                        that.error(that.localize('noInteger', { elementType: that.nodeName.toLowerCase(), property: key }));
                    }

                    if (key === 'significantDigits' && that.precisionDigits !== null) {
                        that.precisionDigits = null;
                    } else if (key === 'precisionDigits' && that.significantDigits !== null) {
                        that.significantDigits = null;
                    }

                    if (value !== null) {
                        that.$.digitalDisplay.precisionDigits = that.precisionDigits;
                        that.$.digitalDisplay.significantDigits = that.significantDigits;
                    }
                    that._initTickIntervalHandler();
                    that._renderAnalogItems();
                    break;
                case 'ranges':
                    if (!that.showRanges) {
                        return;
                    }

                    that._renderAnalogItems();
                    break;
                case 'scaleType':
                    that._numericProcessor = new JQX.Utilities.NumericProcessor(that, 'scaleType');

                    validateMinMax(true, true);
                    break;
                case 'ticksPosition':
                    that._getMeasurements();
                    that._renderAnalogItems();
                    break;
                case 'ticksVisibility':
                    if (oldValue === 'minor' && value === 'major' || oldValue === 'major' && value === 'minor') {
                        return;
                    }
                    that._getMeasurements();
                    that._renderAnalogItems();
                    break;
                case 'value':
                    {
                        that._validateValue(value, oldValue);

                        var stringValue = value.toString();

                        if (that.value.toString() === stringValue) {
                            that._drawValue = that.logarithmicScale ? Math.log10(stringValue).toString() : stringValue;
                        }

                        that._updatePointer();
                        break;
                    }
                case 'wordLength':
                    that._wordLengthNumber = that._numericProcessor.getWordLength(that.wordLength);
                    if (that.scaleType === 'integer') {
                        validateMinMax(true, true, that.min, that.max);
                    }
                    break;
            }
        }

        /**
         * Draws the Gauge's analog display.
         */

    }, {
        key: '_addAnalogDisplay',
        value: function _addAnalogDisplay() {
            var that = this,
                measurements = that._measurements,
                radius = measurements.radius,
                draw = that._draw;

            if (that.analogDisplayType === 'needle') {
                // needle
                that._drawNeedle(false);
                // central circle
                that._centralCircle = draw.circle(radius, radius, measurements.needleWidth + 5, { 'class': 'jqx-needle-central-circle' });
            } else {
                var distance = radius - that._distance.trackDistance - measurements.trackBorderWidth / 2 - 1;
                // track
                that._track = draw.pieslice(radius, radius, distance - measurements.trackWidth, distance, that.startAngle, that.endAngle, 0, { 'class': 'jqx-track' });
                new JQX.Utilities.InputEvents(that._track).down(function (event) {
                    that._SVGElementDownHandler(event);
                });
            }
        }

        /**
         * Calculates the tick drawing distance.
         */

    }, {
        key: '_calculateTickAndLabelDistance',
        value: function _calculateTickAndLabelDistance() {
            var that = this,
                measurements = that._measurements;

            if (that.scalePosition === 'none') {
                that._plotLabels = false;
                that._plotTicks = false;

                measurements.innerRadius = measurements.radius;

                return { majorTickDistance: 0, minorTickDistance: 0, labelDistance: 0, needleDistance: 0, trackDistance: 0 };
            }

            var labelsSize = that._tickIntervalHandler.labelsSize,
                labelSizeCoefficient = that._largestLabelSize || Math.max(labelsSize.minLabelSize, labelsSize.minLabelOtherSize, labelsSize.maxLabelSize, labelsSize.maxLabelOtherSize);
            var majorTickDistance = 1,
                minorTickDistance = void 0,
                labelDistance = void 0,
                needleDistance = void 0,
                trackDistance = 0;

            that._largestLabelSize = labelSizeCoefficient;

            if (that.scalePosition === 'outside') {
                majorTickDistance = labelSizeCoefficient;
                minorTickDistance = majorTickDistance + measurements.majorTickSize - measurements.minorTickSize;
                labelDistance = 0;
            }

            if (that.analogDisplayType === 'needle') {
                if (that.scalePosition === 'outside') {
                    needleDistance = majorTickDistance + measurements.majorTickSize;
                } else {
                    needleDistance = majorTickDistance + measurements.majorTickSize + labelSizeCoefficient;
                }

                if (that.ticksVisibility === 'none') {
                    labelDistance = 0;
                    needleDistance -= measurements.majorTickSize;
                }
                if (that.labelsVisibility === 'none') {
                    needleDistance -= labelSizeCoefficient;
                    if (that.scalePosition === 'outside') {
                        majorTickDistance -= labelSizeCoefficient;
                        minorTickDistance -= labelSizeCoefficient;
                    }
                }
            } else {
                if (that.labelsVisibility === 'none' && that.ticksVisibility === 'none') {
                    trackDistance = 0;
                } else {
                    if (that.scalePosition === 'outside') {
                        if (that.ticksPosition === 'scale') {
                            if (that.labelsVisibility === 'none') {
                                majorTickDistance = 1;
                                minorTickDistance = 1 + measurements.majorTickSize - measurements.minorTickSize;
                            }
                            if (that.ticksVisibility !== 'none') {
                                trackDistance = majorTickDistance + measurements.majorTickSize + 2;
                            } else {
                                trackDistance = labelSizeCoefficient;
                            }
                        } else {
                            if (that.labelsVisibility !== 'none') {
                                minorTickDistance = minorTickDistance - (measurements.trackWidth + measurements.trackBorderWidth) / 4;
                                trackDistance = majorTickDistance - 1;
                            } else {
                                majorTickDistance = 1;
                                minorTickDistance = (measurements.trackWidth + measurements.trackBorderWidth) / 4 + 1;
                                trackDistance = 0;
                            }
                        }
                    } else {
                        if (that.ticksPosition === 'scale') {
                            majorTickDistance = measurements.trackWidth + 1.5 * measurements.trackBorderWidth + 2;
                            if (that.ticksVisibility === 'none') {
                                labelDistance = majorTickDistance;
                            }
                        } else {
                            minorTickDistance = (measurements.trackWidth + measurements.trackBorderWidth) / 4 + 1;
                        }
                    }
                }
            }

            if (minorTickDistance === undefined) {
                minorTickDistance = majorTickDistance;
            }

            if (labelDistance === undefined) {
                labelDistance = majorTickDistance + measurements.majorTickSize;
            }

            measurements.innerRadius = measurements.radius - labelDistance;

            delete that._plotLabels;
            delete that._plotTicks;
            delete that._equalToHalfRadius;
            if (that.scalePosition === 'inside') {
                if (measurements.innerRadius < labelSizeCoefficient) {
                    that._plotLabels = false;

                    if (that.ticksPosition === 'scale') {
                        if (that.analogDisplayType !== 'needle') {
                            that._plotTicks = false;
                        }
                    } else {
                        that._equalToHalfRadius = true;
                        measurements.innerRadius = measurements.radius / 2;
                    }
                }
            } else if (measurements.radius - trackDistance - measurements.trackBorderWidth < measurements.trackWidth) {
                measurements.trackWidth = measurements.radius - trackDistance - measurements.trackBorderWidth;
                measurements.lineSize = measurements.trackWidth + measurements.trackBorderWidth;
                if (that.ticksPosition === 'track') {
                    measurements.majorTickSize = measurements.lineSize;
                    measurements.minorTickSize = measurements.majorTickSize / 2;
                    minorTickDistance = majorTickDistance + (measurements.majorTickSize - measurements.minorTickSize) / 2;
                }
            }

            return { majorTickDistance: majorTickDistance, minorTickDistance: minorTickDistance, labelDistance: labelDistance, needleDistance: needleDistance, trackDistance: trackDistance };
        }

        /**
         * Calculates the tank's major and minor ticks intervals.
         */

    }, {
        key: '_calculateTickInterval',
        value: function _calculateTickInterval() {
            var that = this,
                intervals = that._tickIntervalHandler.getInterval('radial', that._drawMin, that._drawMax, that.$.container, that.logarithmicScale);

            if (intervals.major !== that._majorTicksInterval) {
                that._intervalHasChanged = true;
                that._majorTicksInterval = intervals.major;
            } else {
                that._intervalHasChanged = true;
            }

            that._minorTicksInterval = intervals.minor;
        }

        /**
         * Throws an error if some necessary modules have not been loaded.
         */

    }, {
        key: '_checkMissingModules',
        value: function _checkMissingModules() {
            var missingModules = [];

            try {
                BigNumber;
            } catch (error) {
                missingModules.push('jqxmath.js');
            }

            if (JQX.Utilities.Draw === undefined) {
                missingModules.push('jqxdraw.js');
            }

            if (JQX.Utilities.NumberRenderer === undefined) {
                missingModules.push('jqxnumberrenderer.js');
            }

            if (JQX.Utilities.NumericProcessor === undefined) {
                missingModules.push('jqxnumericprocessor.js');
            }

            if (JQX.Utilities.TickIntervalHandler === undefined) {
                missingModules.push('jqxtickintervalhandler.js');
            }

            if (JQX.NumericTextBox === undefined) {
                missingModules.push('jqxnumerictextbox.js');
            }

            if (missingModules.length > 0) {
                var _that = this;
                _that.error(_that.localize('missingReference', { elementType: _that.nodeName.toLowerCase(), files: missingModules.join(', ') }));
            }
        }

        /**
         * Computes the points of a needle (needlePosition: 'center').
         */

    }, {
        key: '_computeNeedlePointsCenter',
        value: function _computeNeedlePointsCenter(pointerWidth, angle) {
            var that = this,
                measurements = that._measurements,
                innerRadius = measurements.innerRadius,
                radius = measurements.radius,
                sin = Math.sin(angle),
                cos = Math.cos(angle);
            var pointerLength = void 0;

            if (that.scalePosition === 'inside') {
                pointerLength = (innerRadius - that._largestLabelSize) * 0.9;
            } else {
                pointerLength = (innerRadius - that._distance.needleDistance) * 0.9;
            }

            var x = radius + pointerLength * sin,
                y = radius + pointerLength * cos,
                startX1 = radius + pointerWidth * cos,
                startY1 = radius - pointerWidth * sin,
                startX2 = radius - pointerWidth * cos,
                startY2 = radius + pointerWidth * sin,
                points = 'M ' + startX1 + ',' + startY1 + ' L ' + startX2 + ',' + startY2 + ' L ' + x + ',' + y + ' Z';

            return points;
        }

        /**
         * Computes the points of a needle (needlePosition: 'edge').
         */

    }, {
        key: '_computeNeedlePointsEdge',
        value: function _computeNeedlePointsEdge(pointerWidth, angle, pointerLength) {
            var that = this,
                radius = that._measurements.radius,
                distance = radius - that._distance.needleDistance,
                distanceMinusPointerLength = distance - pointerLength,
                sin = Math.sin(angle),
                cos = Math.cos(angle),
                hPointX = radius + distanceMinusPointerLength * sin,
                hPointY = radius + distanceMinusPointerLength * cos,
                startPointX1 = hPointX + pointerWidth * cos,
                startPointY1 = hPointY - pointerWidth * sin,
                startPointX2 = hPointX - pointerWidth * cos,
                startPointY2 = hPointY + pointerWidth * sin,
                endPointX = radius + distance * sin,
                endPointY = radius + distance * cos,
                points = 'M ' + startPointX1 + ',' + startPointY1 + ' L ' + startPointX2 + ',' + startPointY2 + ' L ' + endPointX + ',' + endPointY + ' Z';

            return points;
        }

        /**
         * Document (mouse)move event handler.
         */

    }, {
        key: '_documentMoveHandler',
        value: function _documentMoveHandler(event) {
            if (!this._dragging) {
                return;
            }

            var that = this,
                angle = that._getAngleByCoordinate(event.pageX, event.pageY),
                quadrant = that._getQuadrant(angle),
                rotationDirection = that._getRotationDirection();

            if (that._normalizedStartAngle === that.endAngle) {
                var normalizedReferentAngle = void 0;

                if (!that.inverted) {
                    if (that._lockCW && rotationDirection === 'ccw') {
                        normalizedReferentAngle = that.endAngle;
                        that._unlockRotation('_lockCW', angle, quadrant, normalizedReferentAngle, { firstCondition: angle > normalizedReferentAngle, secondCondition: angle < normalizedReferentAngle });
                    } else if (that._lockCCW && rotationDirection === 'cw') {
                        normalizedReferentAngle = that._normalizedStartAngle;
                        that._unlockRotation('_lockCCW', angle, quadrant, normalizedReferentAngle, { firstCondition: angle < normalizedReferentAngle, secondCondition: angle > normalizedReferentAngle });
                    }
                } else {
                    if (that._lockCW && rotationDirection === 'cw') {
                        normalizedReferentAngle = that._normalizedStartAngle;
                        that._unlockRotation('_lockCW', angle, quadrant, normalizedReferentAngle, { firstCondition: angle < normalizedReferentAngle, secondCondition: angle > normalizedReferentAngle });
                    } else if (that._lockCCW && rotationDirection === 'ccw') {
                        normalizedReferentAngle = that.endAngle;
                        that._unlockRotation('_lockCCW', angle, quadrant, normalizedReferentAngle, { firstCondition: angle > normalizedReferentAngle, secondCondition: angle < normalizedReferentAngle });
                    }
                }
            } else {
                if (that._lockCW && rotationDirection === 'ccw' && !that._outsideRange && that._getAngleDifference(angle, that._normalizedStartAngle) < 10) {
                    that._lockCW = false;
                } else if (that._lockCCW && rotationDirection === 'cw' && !that._outsideRange && that._getAngleDifference(angle, that.endAngle) < 10) {
                    that._lockCCW = false;
                }
            }

            that._angle = angle;
            that._quadrant = quadrant;

            if (event.originalEvent) {
                event.originalEvent.stopPropagation();
                event.originalEvent.preventDefault();
            }

            if (that._lockCW || that._lockCCW) {
                return;
            }

            var newValue = that._numericProcessor.getValueByAngle(angle);

            if (that._normalizedStartAngle === that.endAngle) {
                var lockedValue = that._numericProcessor.lockRotation(rotationDirection === 'cw' && !that.inverted || rotationDirection === 'ccw' && that.inverted, newValue);

                if (lockedValue !== undefined) {
                    newValue = lockedValue;
                }
            } else {
                if (rotationDirection === 'ccw' && that._outsideEnd) {
                    that._lockCCW = true;
                } else if (rotationDirection === 'cw' && that._outsideStart) {
                    that._lockCW = true;
                }
            }

            if (newValue !== undefined && newValue.toString() !== that.value) {
                that._updatePointer(newValue);
                if (that.mechanicalAction !== 'switchWhenReleased') {
                    that._numericProcessor.updateGaugeValue(newValue);
                } else {
                    that._valueAtMoveEnd = newValue;
                }
            }
        }

        /**
         * Gauge (mouse)up event handler.
         */

    }, {
        key: '_documentUpHandler',
        value: function _documentUpHandler() {
            var that = this;

            if (that._dragging) {
                that._lockCW = false;
                that._lockCCW = false;

                that._dragging = false;
                that.$.removeClass('dragged');

                if (that.mechanicalAction !== 'switchWhileDragging') {
                    var newValue = that.mechanicalAction === 'switchUntilReleased' ? that._valueAtDragStart : that._valueAtMoveEnd;
                    that._updatePointer(newValue);
                    that._numericProcessor.updateGaugeValue(newValue);
                }
            }
        }

        /**
         * Gauge (mouse)down event handler.
         */

    }, {
        key: '_downHandler',
        value: function _downHandler(event, targetIsTrack) {
            var that = this;

            if (that.analogDisplayType !== 'needle' && !targetIsTrack || that.disabled || that.readonly || 'buttons' in event && event.buttons !== 1 || event.which !== 1) {
                event.stopPropagation();
                return;
            }

            var x = event.pageX,
                y = event.pageY;

            that._measurements.center = that._getCenterCoordinates();

            if (that.analogDisplayType === 'needle') {
                var distanceFromCenter = Math.sqrt(Math.pow(that._measurements.center.x - x, 2) + Math.pow(that._measurements.center.y - y, 2));
                if (distanceFromCenter > that._measurements.radius) {
                    event.stopPropagation();
                    return;
                }
            }

            if (that.mechanicalAction === 'switchUntilReleased') {
                that._valueAtDragStart = that.value;
            }

            that._angle = that._getAngleByCoordinate(x, y);
            that._quadrant = that._getQuadrant(that._angle);

            var newValue = that._numericProcessor.getValueByAngle(that._angle);

            if (newValue !== undefined && newValue.toString() !== that.value) {
                that._updatePointer(newValue);
                if (that.mechanicalAction !== 'switchWhenReleased') {
                    that._numericProcessor.updateGaugeValue(newValue);
                } else {
                    that._valueAtMoveEnd = newValue;
                }
            }

            that._dragging = true;
            that.$.addClass('dragged');
        }

        /**
         * Draws/updates the fill or line.
         */

    }, {
        key: '_drawFill',
        value: function _drawFill(update, value) {
            var that = this;

            if (that.analogDisplayType === 'needle') {
                return;
            }

            if (value === undefined) {
                value = that._number;
            }

            var measurements = that._measurements,
                radius = measurements.radius,
                distance = radius - that._distance.trackDistance - measurements.trackBorderWidth / 2 - 1;

            if (that.analogDisplayType === 'fill') {
                var angle = that._numericProcessor.getAngleByValue(value, true, true);
                var startAngle = void 0,
                    endAngle = void 0;

                if (!that.inverted) {
                    startAngle = angle;
                    endAngle = that.endAngle;
                } else {
                    startAngle = that.startAngle;
                    endAngle = angle;
                }

                if (update) {
                    that._fill.setAttribute('d', that._draw.pieSlicePath(radius, radius, distance - measurements.trackWidth, distance, startAngle, endAngle, 0));
                } else {
                    that._fill = that._draw.pieslice(radius, radius, distance - measurements.trackWidth, distance, startAngle, endAngle, 0, { 'class': 'jqx-value' });
                    new JQX.Utilities.InputEvents(that._fill).down(function (event) {
                        that._SVGElementDownHandler(event);
                    });
                }
            } else {
                var width = distance + measurements.trackBorderWidth / 2,
                    innerWidth = width - measurements.lineSize,
                    _angle = that._numericProcessor.getAngleByValue(value),
                    angleSin = Math.sin(_angle),
                    angleCos = Math.cos(_angle),
                    x1 = radius + width * angleSin,
                    y1 = radius + width * angleCos,
                    x2 = radius + innerWidth * angleSin,
                    y2 = radius + innerWidth * angleCos;

                if (update) {
                    that._line.setAttribute('x1', x1);
                    that._line.setAttribute('y1', y1);
                    that._line.setAttribute('x2', x2);
                    that._line.setAttribute('y2', y2);
                } else {
                    that._line = that._draw.line(x1, y1, x2, y2, { 'class': 'jqx-line' });
                    new JQX.Utilities.InputEvents(that._line).down(function (event) {
                        that._SVGElementDownHandler(event);
                    });
                }
            }
        }

        /**
         * Draws a label.
         */

    }, {
        key: '_drawLabel',
        value: function _drawLabel(angle, value, distance, middle) {
            var that = this,
                measurements = that._measurements,
                r = measurements.radius,
                stylingObj = {
                'class': 'jqx-label' + (middle !== false ? ' jqx-label-middle' : ''),
                'font-size': measurements.fontSize,
                'font-family': measurements.fontFamily,
                'font-weight': measurements.fontWeight,
                'font-style': measurements.fontStyle
            };

            value = that._formatLabel(value.toString(), false);

            var textSize = that._draw.measureText(value, 0, stylingObj),
                w = r - distance - that._largestLabelSize / 2,
                x = r + w * Math.sin(angle),
                y = r + w * Math.cos(angle);

            that._draw.text(value, Math.round(x) - textSize.width / 2, Math.round(y) - textSize.height / 2, textSize.width, textSize.height, 0, stylingObj);
        }

        /**
         * Draws/updates the needle.
         */

    }, {
        key: '_drawNeedle',
        value: function _drawNeedle(update, value) {
            var that = this,
                measurements = that._measurements;

            if (value === undefined) {
                value = that._number;
            }

            var angle = that._numericProcessor.getAngleByValue(value);

            if (!that.drawNeedle) {
                var points = void 0;

                if (that.needlePosition === 'center') {
                    points = that._computeNeedlePointsCenter(measurements.needleWidth, angle);
                } else {
                    points = that._computeNeedlePointsEdge(measurements.needleWidth, angle, measurements.needleLength);
                }

                if (update) {
                    that._needle.setAttribute('d', points);
                } else {
                    that._needle = that._draw.path(points, { 'class': 'jqx-needle' });
                }
            } else {
                that._customSVGElements = that.drawNeedle(that, that._draw, measurements.radius, angle, that._distance.needleDistance);
                if (that._customSVGElements) {
                    var parent = that._customSVGElements[0].parentElement || that._customSVGElements[0].parentNode;
                    for (var i = 0; i < that._customSVGElements.length; i++) {
                        parent.insertBefore(that._customSVGElements[i], that._centralCircle);
                    }
                }
            }
        }

        /**
         * Draws ranges.
         */

    }, {
        key: '_drawRanges',
        value: function _drawRanges() {
            var that = this,
                numericProcessor = that._numericProcessor,
                ranges = that.ranges;

            if (!that.showRanges || ranges.length === 0) {
                return;
            }

            var measurements = that._measurements,
                radius = measurements.radius;
            var distance = void 0,
                rangeSize = void 0,
                startValue = void 0,
                endValue = void 0;

            if (that.analogDisplayType === 'needle') {
                rangeSize = measurements.rangeSize;
                if (that.scalePosition === 'inside') {
                    distance = radius - 1;
                } else {
                    distance = radius - that._distance.needleDistance - 2;
                    if (that.labelsVisibility === 'none' && that.ticksVisibility === 'none') {
                        distance += 1;
                    }
                }
            } else {
                distance = radius - that._distance.trackDistance - measurements.trackBorderWidth / 2 - 1;
                rangeSize = measurements.trackWidth;
            }

            if (!that.inverted) {
                startValue = 'startValue';
                endValue = 'endValue';
            } else {
                startValue = 'endValue';
                endValue = 'startValue';
            }

            for (var i = 0; i < ranges.length; i += 1) {
                var currentRange = ranges[i],
                    validStartValue = numericProcessor.validateColorRange(currentRange[startValue]),
                    validEndValue = numericProcessor.validateColorRange(currentRange[endValue]);

                that._draw.pieslice(radius, radius, distance - rangeSize, distance, numericProcessor.getAngleByValue(validEndValue, true, true), numericProcessor.getAngleByValue(validStartValue, true, true), 0, { 'class': 'jqx-range ' + currentRange.className });
            }
        }

        /**
         * Draws a tick.
         */

    }, {
        key: '_drawTick',
        value: function _drawTick(angle, width, type) {
            var that = this,
                measurements = that._measurements,
                r = measurements.radius;

            var className = 'jqx-tick',
                size = void 0;

            if (type === 'major') {
                size = measurements.majorTickSize;
            } else {
                size = measurements.minorTickSize;
                className += ' jqx-tick-minor';
            }

            var innerWidth = width - size,
                x1 = r + width * Math.sin(angle),
                y1 = r + width * Math.cos(angle),
                x2 = r + innerWidth * Math.sin(angle),
                y2 = r + innerWidth * Math.cos(angle);
            that._draw.line(x1, y1, x2, y2, { 'class': className });
        }

        /**
         * Returns the angle equivalent of coordinates.
         */

    }, {
        key: '_getAngleByCoordinate',
        value: function _getAngleByCoordinate(x, y) {
            function isInRange(from, to, angle) {
                while (to < from) {
                    to += 360;
                }while (angle < from) {
                    angle += 360;
                }return angle >= from && angle <= to;
            }

            var that = this,
                center = that._measurements.center,
                angleRadians = Math.atan2(y - center.y, x - center.x);
            var angleDeg = -1 * angleRadians * 180 / Math.PI;

            if (angleDeg < 0) {
                angleDeg += 360;
            }

            that._actualAngle = angleDeg;

            if (that._normalizedStartAngle !== that.endAngle && !isInRange(that._normalizedStartAngle, that.endAngle, angleDeg)) {
                // coordinates are outside the range
                if (that._getAngleDifference(angleDeg, that._normalizedStartAngle) <= that._getAngleDifference(angleDeg, that.endAngle)) {
                    angleDeg = that._normalizedStartAngle;
                    that._outsideStart = true;
                    that._outsideEnd = false;
                } else {
                    angleDeg = that.endAngle;
                    that._outsideEnd = true;
                    that._outsideStart = false;
                }

                that._outsideRange = true;
            } else {
                that._outsideRange = false;
                that._outsideStart = false;
                that._outsideEnd = false;
            }

            return angleDeg;
        }

        /**
         * Returns the difference between two angles.
         */

    }, {
        key: '_getAngleDifference',
        value: function _getAngleDifference(angle1, angle2) {
            var phi = Math.abs(angle2 - angle1) % 360,
                distance = phi > 180 ? 360 - phi : phi;
            return distance;
        }

        /**
         * Returns the coordinates of the Gauge's center.
         */

    }, {
        key: '_getCenterCoordinates',
        value: function _getCenterCoordinates() {
            var that = this,
                offset = that.getBoundingClientRect(),
                radius = that._measurements.radius,
                scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft,
                scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
            return { x: offset.left + scrollLeft + radius, y: offset.top + scrollTop + radius };
        }

        /**
         * Measures some elements of the Gauge and stores the results.
         */

    }, {
        key: '_getMeasurements',
        value: function _getMeasurements() {
            var that = this,
                measurements = that._measurements;

            measurements.cachedWidth = that.offsetWidth;
            measurements.cachedHeight = that.offsetHeight;

            measurements.radius = measurements.cachedWidth / 2;

            var measureElement = document.createElement('div');
            that.appendChild(measureElement);

            // ticks
            measureElement.className = 'jqx-tick';
            measurements.majorTickSize = measureElement.offsetWidth;
            measureElement.className += ' jqx-tick-minor';
            measurements.minorTickSize = measureElement.offsetWidth;

            // labels
            measureElement.className = 'jqx-label';
            var measureElementStyle = window.getComputedStyle(measureElement);
            measurements.fontSize = measureElementStyle.fontSize;
            measurements.fontFamily = measureElementStyle.fontFamily;
            measurements.fontWeight = measureElementStyle.fontWeight;
            measurements.fontStyle = measureElementStyle.fontStyle;

            measurements.trackWidth = 0;
            measurements.trackBorderWidth = 0;

            if (that.analogDisplayType === 'needle') {
                // needle
                measureElement.className = 'jqx-needle';
                measurements.needleWidth = measureElement.offsetWidth;
                measurements.needleLength = measureElement.offsetHeight;

                // ranges
                measureElement.className = 'jqx-range';
                measurements.rangeSize = measureElement.offsetWidth;
            } else {
                // 'fill' and 'line' case
                // track
                measureElement.className = 'jqx-track';
                measurements.trackBorderWidth = parseFloat(measureElementStyle.strokeWidth);
                measurements.trackWidth = Math.min(measureElement.offsetWidth, measurements.radius - measurements.trackBorderWidth);
                measurements.lineSize = measurements.trackWidth + measurements.trackBorderWidth;

                if (that.ticksPosition === 'track') {
                    measurements.majorTickSize = measurements.lineSize;
                    measurements.minorTickSize = measurements.majorTickSize / 2;
                }
            }

            that.removeChild(measureElement);
        }

        /**
         * Returns the quadrant of an angle.
         */

    }, {
        key: '_getQuadrant',
        value: function _getQuadrant(angle) {
            if (angle > 270) {
                return 4;
            } else if (angle > 180) {
                return 3;
            } else if (angle > 90) {
                return 2;
            } else {
                return 1;
            }
        }

        /**
         * Returns the rotation direction.
         */

    }, {
        key: '_getRotationDirection',
        value: function _getRotationDirection() {
            var that = this,
                quadrant = that._getQuadrant(that._actualAngle);

            if (that._actualAngle < that._angle && (quadrant !== 1 || that._quadrant !== 4) || that._actualAngle > that._angle && quadrant === 4 && that._quadrant === 1) {
                return 'cw';
            } else {
                return 'ccw';
            }
        }

        /**
         * Creates a new TickIntervalHandler instance.
         */

    }, {
        key: '_initTickIntervalHandler',
        value: function _initTickIntervalHandler() {
            var that = this,
                minLabel = that._formatLabel(that.min, false),
                maxLabel = that._formatLabel(that.max, false);

            that._tickIntervalHandler = new JQX.Utilities.TickIntervalHandler(that, minLabel, maxLabel, 'jqx-label', that._settings.size, that.scaleType === 'integer', that.logarithmicScale);
        }

        /**
         * Gauge keydown event handler.
         */

    }, {
        key: '_keydownHandler',
        value: function _keydownHandler(event) {
            var that = this,
                oldValue = that.value.toString();

            if (that.value.toString() !== that._number.toString()) {
                that.value = that._number.toString();
                that.$.digitalDisplay.value = that._number.toString();
            }

            babelHelpers.get(Gauge.prototype.__proto__ || Object.getPrototypeOf(Gauge.prototype), '_keydownHandler', this).call(this, event);

            if (that.value.toString() !== oldValue) {
                that.$.fireEvent('change', { 'value': that.value, 'oldValue': oldValue });
            }
        }

        /**
         * Normalizes the value of an angle.
         */

    }, {
        key: '_normalizeAngle',
        value: function _normalizeAngle(angle) {
            angle = angle % 360;

            if (angle < 0) {
                angle += 360;
            }

            return angle;
        }

        /**
         * Renders the analog display, ticks and labels in the correct order
         */

    }, {
        key: '_renderAnalogItems',
        value: function _renderAnalogItems(distanceCalculation) {
            var that = this;

            that._draw.clear();
            delete that._needle;
            delete that._centralCircle;
            delete that._track;
            delete that._fill;
            delete that._line;

            if (distanceCalculation !== false) {
                that._distance = that._calculateTickAndLabelDistance();
            }

            that._calculateTickInterval();

            var cachedLabelsSize = that._cachedLabelsSize,
                alternativeLargestLabelSize = Math.max(cachedLabelsSize.minLabelSize, cachedLabelsSize.minLabelOtherSize, cachedLabelsSize.maxLabelSize, cachedLabelsSize.maxLabelOtherSize);
            if (distanceCalculation !== false && that._largestLabelSize !== alternativeLargestLabelSize) {
                that._largestLabelSize = alternativeLargestLabelSize;

                that._distance = that._calculateTickAndLabelDistance();
                that._calculateTickInterval();
            }

            that._drawRanges();
            that._addAnalogDisplay();
            that._numericProcessor.addGaugeTicksAndLabels();
            that._drawFill(false);
        }

        /**
         * Gauge resize event handler. Ensures the Gauge's bounding box always has the correct proportions.
         */

    }, {
        key: '_resizeHandler',
        value: function _resizeHandler() {
            var that = this,
                measurements = that._measurements;

            if (measurements.cachedWidth === that.offsetWidth && measurements.cachedHeight === that.offsetHeight) {
                return;
            }

            if (that.offsetWidth !== that.offsetHeight) {
                if (measurements.cachedWidth !== that.offsetWidth) {
                    that.style.height = that.offsetWidth + 'px';
                } else if (measurements.cachedHeight !== that.offsetHeight) {
                    that.style.width = that.offsetHeight + 'px';
                }
            }

            measurements.cachedWidth = that.offsetWidth;
            measurements.cachedHeight = that.offsetHeight;
            measurements.radius = measurements.cachedWidth / 2;

            if (!that._equalToHalfRadius) {
                measurements.innerRadius = measurements.radius - that._distance.labelDistance;
            } else {
                measurements.innerRadius = measurements.radius / 2;
            }

            that._renderAnalogItems(false);
        }

        /**
         * Document select start handler.
         */

    }, {
        key: '_selectStartHandler',
        value: function _selectStartHandler(event) {
            if (this._dragging) {
                event.preventDefault();
            }
        }

        /**
         * Specifies the behaviour of the method "_updatePointer".
         */

    }, {
        key: '_setUpdatePointerMethod',
        value: function _setUpdatePointerMethod() {
            var that = this;

            if (that.analogDisplayType === 'needle') {
                that._updatePointer = function (value) {
                    if (that._customSVGElements) {
                        for (var i = 0; i < that._customSVGElements.length; i++) {
                            that._draw.removeElement(that._customSVGElements[i]);
                        }
                    }

                    that._drawNeedle(true, value);
                };
            } else {
                that._updatePointer = function (value) {
                    that._drawFill(true, value);
                };
            }
        }

        /**
         * styleChanged event handler.
         */

    }, {
        key: '_styleChangedHandler',
        value: function _styleChangedHandler() {
            var that = this;

            that._getMeasurements();
            that._initTickIntervalHandler();
            that._renderAnalogItems();
        }

        /**
         * (Mouse)down event handler for the track, fill and line SVG elements.
         */

    }, {
        key: '_SVGElementDownHandler',
        value: function _SVGElementDownHandler(event) {
            var that = this,
                oldContext = that.context;

            that.context = that;
            that._downHandler(event, true);
            that.context = oldContext;
        }

        /**
         * Unlocks rotation of the analog display.
         */

    }, {
        key: '_unlockRotation',
        value: function _unlockRotation(lockName, angle, quadrant, referentAngle, conditions) {
            var that = this,
                firstCondition = conditions.firstCondition,
                secondCondition = conditions.secondCondition,
                angleQuadrant = that._getQuadrant(referentAngle);

            if ((firstCondition && (quadrant !== 4 || angleQuadrant !== 1) || secondCondition && quadrant === 4 && angleQuadrant === 1) && that._getAngleDifference(angle, referentAngle) < 10) {
                that[lockName] = false;
            }
        }

        /**
         * Updates the values of the Gauge and its digital display and fires the "change" event.
         */

    }, {
        key: '_updateValue',
        value: function _updateValue(newValue) {
            this._numericProcessor.updateGaugeValue(newValue);
        }

        /**
         * Validates the value and updates the pointer.
         */

    }, {
        key: '_validate',
        value: function _validate(initialValidation, programmaticValue) {
            var that = this;

            that._validateValue(programmaticValue);
            that._updatePointer();
        }

        /**
         * Validates the startAngle and endAngle properties.
         */

    }, {
        key: '_validateAngles',
        value: function _validateAngles() {
            var that = this;

            that._normalizedStartAngle = that._normalizeAngle(that.startAngle);
            that.endAngle = that._normalizeAngle(that.endAngle);

            if (that._normalizedStartAngle < that.endAngle) {
                that.startAngle = that._normalizedStartAngle;
            } else {
                that.startAngle = that._normalizedStartAngle - 360;
            }

            that._angleDifference = that.endAngle - that.startAngle;
        }

        /**
         * Validates initial property values.
         */

    }, {
        key: '_validateInitialPropertyValues',
        value: function _validateInitialPropertyValues() {
            babelHelpers.get(Gauge.prototype.__proto__ || Object.getPrototypeOf(Gauge.prototype), '_validateInitialPropertyValues', this).call(this);

            var that = this;

            if (that.offsetWidth < that.offsetHeight) {
                that.style.height = that.offsetWidth + 'px';
            } else if (that.offsetWidth > that.offsetHeight) {
                that.style.width = that.offsetHeight + 'px';
            }

            that._validateAngles();

            if ((that.analogDisplayType === 'fill' || that.analogDisplayType === 'line') && that.digitalDisplayPosition === 'bottom') {
                that.digitalDisplayPosition = 'center';
            }

            if (that.significantDigits !== null) {
                that.$.digitalDisplay.significantDigits = that.significantDigits;
            } else if (that.precisionDigits !== null) {
                that.$.digitalDisplay.precisionDigits = that.precisionDigits;
            }

            that.$.digitalDisplay.$.input.setAttribute('tabindex', -1);
        }

        /**
         * Validates the Gauge's value.
         */

    }, {
        key: '_validateValue',
        value: function _validateValue(value, oldValue) {
            var that = this,
                numericProcessor = that._numericProcessor;

            if (value === undefined) {
                value = that.value;
            } else {
                value = value.toString();
            }

            if (numericProcessor.regexScientificNotation.test(value)) {
                value = numericProcessor.scientificToDecimal(value);
            }

            if (isNaN(value)) {
                value = oldValue || 0;
            }

            var valueNoRangeValidation = numericProcessor.getCoercedValue(numericProcessor.createDescriptor(value, true, true, false), false);
            that._number = numericProcessor.validate(valueNoRangeValidation, numericProcessor.createDescriptor(that._minObject), numericProcessor.createDescriptor(that._maxObject));

            var stringValueNoRangeValidation = valueNoRangeValidation.toString(),
                stringValue = that._number.toString();

            that.value = stringValueNoRangeValidation; // the "value" property continues to return the value set by the user
            that._drawValue = that.logarithmicScale ? Math.log10(stringValue).toString() : stringValue;
            that.$.digitalDisplay.value = stringValueNoRangeValidation;

            delete that._valueBeforeCoercion;
        }
    }], [{
        key: 'properties',

        /**
         * Gauge's properties.
         */
        get: function get() {
            return {
                'analogDisplayType': {
                    value: 'needle',
                    allowedValues: ['needle', 'fill', 'line'],
                    type: 'string'
                },
                'digitalDisplay': {
                    value: false,
                    type: 'boolean'
                },
                'digitalDisplayPosition': {
                    value: 'bottom',
                    allowedValues: ['top', 'bottom', 'right', 'left', 'center'],
                    type: 'string'
                },
                'drawNeedle': {
                    value: null,
                    type: 'function'
                },
                'endAngle': {
                    value: 210,
                    type: 'number'
                },
                'needlePosition': {
                    value: 'center',
                    allowedValues: ['center', 'edge'],
                    type: 'string'
                },
                'ranges': {
                    value: [],
                    type: 'array'
                },
                'scalePosition': {
                    value: 'inside',
                    allowedValues: ['outside', 'inside', 'none'],
                    type: 'string'
                },
                'showRanges': {
                    value: false,
                    type: 'boolean'
                },
                'startAngle': {
                    value: -30,
                    type: 'number'
                }
            };
        }

        /**
         * Gauge's event listeners.
         */

    }, {
        key: 'listeners',
        get: function get() {
            return {
                'down': '_downHandler',
                'resize': '_resizeHandler',
                'styleChanged': '_styleChangedHandler',
                'document.move': '_documentMoveHandler',
                'document.up': '_documentUpHandler',
                'document.selectstart': '_selectStartHandler',
                'keydown': '_keydownHandler'
            };
        }
    }]);
    return Gauge;
}(JQX.Tank));