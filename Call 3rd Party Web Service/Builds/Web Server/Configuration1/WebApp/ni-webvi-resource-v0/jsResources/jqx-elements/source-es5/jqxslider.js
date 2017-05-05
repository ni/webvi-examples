'use strict';

/**
 * Slider custom element.
 */
JQX('jqx-slider', function (_JQX$Tank) {
    babelHelpers.inherits(Slider, _JQX$Tank);

    function Slider() {
        babelHelpers.classCallCheck(this, Slider);
        return babelHelpers.possibleConstructorReturn(this, (Slider.__proto__ || Object.getPrototypeOf(Slider)).apply(this, arguments));
    }

    babelHelpers.createClass(Slider, [{
        key: 'template',


        /**
         * Slider's HTML template.
         */
        value: function template() {
            var template = '<div id="container" class="jqx-container">\n            <div id="scaleNear" class="jqx-scale jqx-scale-near"></div>\n            <div id="trackContainer" class="jqx-track-container">\n                <jqx-repeat-button id="leftButton" class="jqx-spin-button">\n                    <div id="leftArrow" class="jqx-arrow"></div>\n                </jqx-repeat-button>\n                <div id="track" class="jqx-track">\n                    <div id="fill" class="jqx-value"></div>\n                    <div id="trackTicksContainer" class="jqx-track-ticks-container jqx-hidden"></div>\n                    <div id="thumb" class="jqx-thumb">\n                        <div id="tooltip" class="jqx-tooltip">\n                            <div id="tooltipContent" class="jqx-tooltip-content jqx-unselectable"></div>\n                        </div>\n                    </div>\n                    <div id="secondThumb" class="jqx-thumb">\n                        <div id="secondTooltip" class="jqx-tooltip">\n                            <div id="secondTooltipContent" class="jqx-tooltip-content jqx-unselectable"></div>\n                        </div>\n                    </div>\n                </div>\n                <jqx-repeat-button id="rightButton" class="jqx-spin-button">\n                    <div id="rightArrow" class="jqx-arrow"></div>\n                </jqx-repeat-button>\n            </div>\n            <div id="scaleFar" class="jqx-scale jqx-scale-far"></div>\n        </div>';

            return template;
        }
    }, {
        key: '_createElement',
        value: function _createElement() {
            var that = this;

            that._checkMissingModules();
            that._setSettingsObject();
            that._setDrawVariables();
            that._getLayoutType();

            //Creating instances of NumericProcessor and NumberRenderer
            that._numericProcessor = new JQX.Utilities.NumericProcessor(that, 'scaleType');
            that._numberRenderer = new JQX.Utilities.NumberRenderer();

            that._setInitialComponentDisplay();

            that._measurements = {};
            that._getMeasurements();
            that._wordLengthNumber = that._numericProcessor.getWordLength(that.wordLength);

            that._validateInitialPropertyValues();

            that._setTicksAndInterval();

            var valuesHandler = that._valuesHandler = that.rangeSlider ? new JQX.Utilities.SliderMultipleValueHandler(that) : new JQX.Utilities.SliderSingleValueHandler(that);

            valuesHandler.validate(true); // initial value(s) validation
            that._setTabIndex();
            that._makeThumbAccessible();
        }
        /*
         * Public methods
         */

        /**
         * Sets or gets the value of the slider.
         *
         * @param {Number/String} value Optional value to be set to the slider. If this parameter is not set, the method gets the value.
         */

    }, {
        key: 'val',
        value: function val(value) {
            var that = this,
                isEmptyObject = (typeof value === 'undefined' ? 'undefined' : babelHelpers.typeof(value)) === 'object' && Object.keys(value).length === 0,
                valuesHandler = that._valuesHandler;

            if (value !== undefined && isEmptyObject === false) {
                // use as value setter
                if (valuesHandler.areDifferent(value)) {
                    that._programmaticValueIsSet = true;
                    valuesHandler.validate(false, value);
                    that._programmaticValueIsSet = false;
                }
            } else {
                // use as value getter
                return valuesHandler.getValue();
            }
        }

        /**
         * Gets the optimal size of the slider.
         */

    }, {
        key: 'getOptimalSize',
        value: function getOptimalSize() {
            var that = this,
                sliderStyle = window.getComputedStyle(that),
                trackStyle = window.getComputedStyle(that.$.trackContainer);
            var optimalSize = 0,
                largestLabelSize = void 0,
                optimalOtherSize = void 0,
                labels = void 0,
                firstLabel = void 0,
                lastLabel = void 0,
                firstRect = void 0,
                lastRect = void 0,
                difference = void 0;

            if (that.labelsVisibility === 'all') {
                largestLabelSize = that._numericProcessor._longestLabelSize;
            } else if (that.labelsVisibility === 'endPoints') {
                largestLabelSize = Math.max(that._tickIntervalHandler.labelsSize.minLabelOtherSize, that._tickIntervalHandler.labelsSize.maxLabelOtherSize);
            } else {
                largestLabelSize = 0;
            }

            if (that.orientation === 'horizontal') {
                optimalSize += parseFloat(trackStyle.marginTop) + parseFloat(trackStyle.marginBottom) + that.$.track.offsetHeight;
                if (that.scalePosition === 'near' || that.scalePosition === 'both') {
                    optimalSize += largestLabelSize;
                    labels = that.$.scaleNear.getElementsByClassName('jqx-label');
                    firstLabel = labels[0];
                    lastLabel = labels[labels.length - 1];
                    optimalSize += parseFloat(window.getComputedStyle(firstLabel).bottom);
                }
                if (that.scalePosition === 'far' || that.scalePosition === 'both') {
                    optimalSize += largestLabelSize;
                    labels = that.$.scaleFar.getElementsByClassName('jqx-label');
                    firstLabel = labels[0];
                    lastLabel = labels[labels.length - 1];
                    optimalSize += parseFloat(window.getComputedStyle(firstLabel).top);
                }
                optimalSize += parseFloat(sliderStyle.paddingTop) + parseFloat(sliderStyle.paddingBottom);

                optimalOtherSize = that.offsetWidth;

                if (that.scalePosition !== 'none') {
                    firstRect = firstLabel.getBoundingClientRect();
                    lastRect = lastLabel.getBoundingClientRect();

                    difference = firstRect.left + firstLabel.offsetWidth - lastRect.left;
                    if (difference > 0) {
                        optimalOtherSize = firstLabel.offsetWidth + lastLabel.offsetWidth + Math.max(10, that.$.thumb.offsetWidth);
                    }
                }

                return { width: optimalOtherSize, height: optimalSize };
            } else {
                optimalSize += parseFloat(trackStyle.marginLeft) + parseFloat(trackStyle.marginRight) + that.$.track.offsetWidth;
                if (that.scalePosition === 'near' || that.scalePosition === 'both') {
                    optimalSize += largestLabelSize;
                    labels = that.$.scaleNear.getElementsByClassName('jqx-label');
                    firstLabel = labels[0];
                    lastLabel = labels[labels.length - 1];
                    optimalSize += parseFloat(window.getComputedStyle(firstLabel).right);
                }
                if (that.scalePosition === 'far' || that.scalePosition === 'both') {
                    optimalSize += largestLabelSize;
                    labels = that.$.scaleFar.getElementsByClassName('jqx-label');
                    firstLabel = labels[0];
                    lastLabel = labels[labels.length - 1];
                    optimalSize += parseFloat(window.getComputedStyle(firstLabel).left);
                }
                optimalSize += parseFloat(sliderStyle.paddingLeft) + parseFloat(sliderStyle.paddingRight);

                optimalOtherSize = that.offsetHeight;

                if (that.scalePosition !== 'none') {
                    firstRect = firstLabel.getBoundingClientRect();
                    lastRect = lastLabel.getBoundingClientRect();

                    difference = firstRect.top + firstLabel.offsetHeight - lastRect.top;
                    if (difference > 0) {
                        optimalOtherSize = firstLabel.offsetHeight + lastLabel.offsetHeight + Math.max(10, that.$.thumb.offsetHeight);
                    }
                }

                return { width: optimalSize, height: optimalOtherSize };
            }
        }

        /**
         * Invoked when the value of a public property has been changed by the user.
         */

    }, {
        key: 'propertyChangedHandler',
        value: function propertyChangedHandler(key, oldValue, value) {
            var that = this,
                sameHandlers = ['disabled', 'readonly', 'ticksPosition', 'tooltipPosition'];

            if (sameHandlers.indexOf(key) !== -1) {
                babelHelpers.get(Slider.prototype.__proto__ || Object.getPrototypeOf(Slider.prototype), 'propertyChangedHandler', this).call(this, key, oldValue, value);
                return;
            }

            var valuesHandler = that._valuesHandler;

            function redraw() {
                that._setTicksAndInterval();
                valuesHandler.validate(false, valuesHandler.getValue());
            }

            // eslint-disable-next-line
            if (key !== 'values' && value != oldValue || key === 'values' && (value[0] != oldValue[0] || value[1] !== oldValue[1])) {
                switch (key) {
                    case 'coerce':
                        if (value) {
                            var valueBeforeCoercion = valuesHandler.getValue();
                            valuesHandler.validate(false, valueBeforeCoercion);
                            that._valueBeforeCoercion = valueBeforeCoercion; // stores value before coercion
                        } else {
                            if (that._valueBeforeCoercion !== undefined) {
                                valuesHandler.validate(false, that._valueBeforeCoercion); // restores the value from before coercion
                            }
                        }
                        break;
                    case 'decimalSeparator':
                    case 'labelFormatFunction':
                    case 'scientificNotation':
                        redraw();
                        break;
                    case 'interval':
                        //Validates the Interval
                        that._numericProcessor.validateInterval(value);

                        valuesHandler.validate(false, valuesHandler.getValue());
                        break;
                    case 'inverted':
                        {
                            that._getLayoutType();
                            if (that._normalLayout) {
                                that.$.fill.style[that._settings.margin] = '0px';
                            }

                            redraw();
                            break;
                        }
                    case 'labelsVisibility':
                    case 'ticksVisibility':
                        return;
                    case 'logarithmicScale':
                        that._validateMinMax('both');
                        redraw();
                        break;
                    case 'min':
                    case 'max':
                        {
                            that._validateMinMax(key, false, oldValue);
                            redraw();
                            break;
                        }
                    case 'orientation':
                        {
                            // clears previously applied inline styles
                            that.$.container.removeAttribute('style');
                            that.$.trackContainer.removeAttribute('style');
                            that.$.fill.removeAttribute('style');
                            that.$.thumb.removeAttribute('style');
                            that.$.secondThumb.removeAttribute('style');

                            that._setSettingsObject();
                            that._getLayoutType();
                            that._getMeasurements();

                            redraw();

                            if (value === 'horizontal') {
                                that.$leftArrow.removeClass('jqx-arrow-up');
                                that.$rightArrow.removeClass('jqx-arrow-down');
                                that.$leftArrow.addClass('jqx-arrow-left');
                                that.$rightArrow.addClass('jqx-arrow-right');
                            } else {
                                that.$leftArrow.removeClass('jqx-arrow-left');
                                that.$rightArrow.removeClass('jqx-arrow-right');
                                that.$leftArrow.addClass('jqx-arrow-up');
                                that.$rightArrow.addClass('jqx-arrow-down');
                            }
                            break;
                        }
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

                        redraw();
                        break;
                    case 'rangeSlider':
                        if (value) {
                            that.values = [that.min, that.value];
                            that._drawValues = [that._drawMin, that._drawValue];

                            if (that._valueBeforeCoercion !== undefined) {
                                that._valueBeforeCoercion = [that.min, that._valueBeforeCoercion];
                            }
                            valuesHandler = that._valuesHandler = new JQX.Utilities.SliderMultipleValueHandler(that);
                        } else {
                            that.value = that.values[1];
                            that._drawValue = that._drawValues[1];

                            if (that._valueBeforeCoercion !== undefined) {
                                that._valueBeforeCoercion = that._valueBeforeCoercion[1];
                            }
                            valuesHandler = that._valuesHandler = new JQX.Utilities.SliderSingleValueHandler(that);
                            that.$.fill.style.marginTop = 0;
                            that.$.fill.style.marginLeft = 0;
                        }
                        valuesHandler.validate(false, valuesHandler.getValue());
                        break;
                    case 'scalePosition':
                        that._setInitialComponentDisplay();
                        redraw();
                        break;
                    case 'scaleType':
                        that._numericProcessor = new JQX.Utilities.NumericProcessor(that, 'scaleType');

                        that._validateMinMax('both');

                        that._setTicksAndInterval();
                        valuesHandler.validate(true);
                        break;
                    case 'showButtons':
                        if (value) {
                            that.$leftButton.removeClass('jqx-hidden');
                            that.$rightButton.removeClass('jqx-hidden');
                        } else {
                            that.$leftButton.addClass('jqx-hidden');
                            that.$rightButton.addClass('jqx-hidden');
                        }
                        that._setTicksAndInterval();
                        valuesHandler.moveThumbBasedOnValue(valuesHandler.getDrawValue(), undefined, true);
                        break;
                    case 'showUnit':
                    case 'unit':
                        {
                            that._setTicksAndInterval();
                            break;
                        }
                    case 'value':
                    case 'values':
                        if (that.rangeSlider && key === 'value') {
                            return;
                        }
                        that._programmaticValueIsSet = true;
                        valuesHandler.validate(false, value);
                        that._programmaticValueIsSet = false;
                        break;
                    case 'wordLength':
                        {
                            that._wordLengthNumber = that._numericProcessor.getWordLength(value);
                            that._validateMinMax('both');
                            redraw();
                            break;
                        }
                }
            } else if (typeof value !== 'string' && typeof oldValue === 'string') {
                that[key] = oldValue;
            }
        }

        /**
         * Sets the display of the scales.
         */

    }, {
        key: '_setInitialComponentDisplay',
        value: function _setInitialComponentDisplay() {
            babelHelpers.get(Slider.prototype.__proto__ || Object.getPrototypeOf(Slider.prototype), '_setInitialComponentDisplay', this).call(this);

            var that = this;

            that.$secondTooltip.addClass('jqx-hidden');

            if (!that.showButtons) {
                that.$leftButton.addClass('jqx-hidden');
                that.$rightButton.addClass('jqx-hidden');
            }
        }

        /**
         * Measures some elements of the slider and stores the results.
         */

    }, {
        key: '_getMeasurements',
        value: function _getMeasurements() {
            var that = this,
                measurements = that._measurements,
                track = that.$.track,
                thumb = that.$.thumb;

            if (that.orientation === 'horizontal') {
                measurements.trackWidth = track.offsetHeight;
                measurements.thumbSize = thumb.offsetWidth;
                measurements.borderWidth = parseFloat(window.getComputedStyle(that.$.track).borderLeftWidth);
            } else {
                measurements.trackWidth = track.offsetWidth;
                measurements.thumbSize = thumb.offsetHeight;
                measurements.borderWidth = parseFloat(window.getComputedStyle(that.$.track).borderTopWidth);
            }
            measurements.halfThumbSize = measurements.thumbSize / 2;
        }

        /**
         * Applies necessary paddings to the track container.
         */

    }, {
        key: '_layout',
        value: function _layout() {
            var that = this,
                measurements = that._measurements,
                containerStyle = that.$.container.style,
                thumbPadding = measurements.halfThumbSize,
                labelsSize = that._tickIntervalHandler.labelsSize;
            var minLabelPadding = void 0,
                maxLabelPadding = void 0,
                paddingStart = void 0,
                paddingEnd = void 0;

            if (that.scalePosition !== 'none') {
                minLabelPadding = labelsSize.minLabelSize / 2;
                maxLabelPadding = labelsSize.maxLabelSize / 2;
            } else {
                minLabelPadding = 0;
                maxLabelPadding = 0;
            }

            if (!that.showButtons) {
                paddingStart = Math.max(thumbPadding, minLabelPadding) + 'px';
                paddingEnd = Math.max(thumbPadding, maxLabelPadding) + 'px';
            } else {
                var spinButtonSize = that.$.leftButton[that._settings.size],
                    buttonSize = spinButtonSize + thumbPadding;
                paddingStart = Math.max(minLabelPadding - buttonSize, 0) + 'px';
                paddingEnd = Math.max(maxLabelPadding - buttonSize, 0) + 'px';
            }

            if (that.orientation === 'horizontal') {
                if (!that.inverted) {
                    containerStyle.paddingLeft = paddingStart;
                    containerStyle.paddingRight = paddingEnd;
                } else {
                    containerStyle.paddingLeft = paddingEnd;
                    containerStyle.paddingRight = paddingStart;
                }

                measurements.trackLength = that.$.track.clientWidth;

                that.$leftArrow.addClass('jqx-arrow-left');
                that.$rightArrow.addClass('jqx-arrow-right');
            } else {
                if (!that.inverted) {
                    containerStyle.paddingBottom = paddingStart;
                    containerStyle.paddingTop = paddingEnd;
                } else {
                    containerStyle.paddingBottom = paddingEnd;
                    containerStyle.paddingTop = paddingStart;
                }

                measurements.trackLength = that.$.track.clientHeight;

                that.$leftArrow.addClass('jqx-arrow-up');
                that.$rightArrow.addClass('jqx-arrow-down');
            }
        }

        /**
         * Track click event handler.
         */

    }, {
        key: '_trackDownHandler',
        value: function _trackDownHandler(event) {
            var that = this,
                mechanicalAction = that.mechanicalAction;

            if (that.disabled || that.readonly || !that.rangeSlider && event.target === that.$.thumb) {
                return;
            }

            if (that._stopTrackDownHandler) {
                that._stopTrackDownHandler = false;
                return;
            }

            if (mechanicalAction === 'switchUntilReleased') {
                that._valueAtDragStart = that._valuesHandler.getValue();
            }

            that._getTrackStartAndEnd();
            that._valuesHandler.setActiveThumbOnTrackClick(event);
            that._moveThumbBasedOnCoordinates(event, true, mechanicalAction !== 'switchWhenReleased');

            that._thumbDragged = true;
            if (that.showTooltip) {
                that._movedTooltip.removeClass('jqx-hidden');
            }
        }

        /**
         * Thumb mousedown event handler.
         */

    }, {
        key: '_thumbDownHandler',
        value: function _thumbDownHandler(event) {
            var that = this;

            if (that.disabled || that.readonly) {
                return;
            }
            that._getTrackStartAndEnd();

            if (event.pageX < that._trackStart || event.pageX > that._trackEnd) {
                that._stopTrackDownHandler = true;
            }

            if (that.mechanicalAction === 'switchUntilReleased') {
                that._valueAtDragStart = that._valuesHandler.getValue();
            }

            window.getSelection().removeAllRanges();

            that._thumbDragged = true;
            that.$track.addClass('jqx-dragged');
            that._movedThumb = event.target;
            that._movedTooltip = that.$tooltip;
            if (that.rangeSlider) {
                if (that._movedThumb === that.$.thumb) {
                    that._staticThumb = that.$.secondThumb;
                } else {
                    that._staticThumb = that.$.thumb;
                    that._movedTooltip = that.$secondTooltip;
                }
            }

            if (that.showTooltip) {
                that._movedTooltip.removeClass('jqx-hidden');
            }

            event.stopPropagation();
        }

        /**
         * Thumb mouseenter and mouseleave event handler.
         */

    }, {
        key: '_thumbMouseenterMouseleaveHandler',
        value: function _thumbMouseenterMouseleaveHandler(event) {
            var that = this,
                fn = event.type === 'mouseenter' ? 'addClass' : 'removeClass';

            if (that.disabled || that.readonly) {
                return;
            }

            event.target.$[fn]('hovered');
        }

        /**
         * Document mousemove event handler.
         */

    }, {
        key: '_documentMoveHandler',
        value: function _documentMoveHandler(event) {
            var that = this;
            if (that._thumbDragged) {
                that._moveThumbBasedOnCoordinates(event, true, that.mechanicalAction !== 'switchWhenReleased');
            }
        }

        /**
         * Document mouseup event handler.
         */

    }, {
        key: '_documentUpHandler',
        value: function _documentUpHandler(event) {
            var that = this;

            if (!that._thumbDragged) {
                return;
            }

            if (that.mechanicalAction === 'switchUntilReleased') {
                that._valuesHandler.validate(false, that._valueAtDragStart);
            } else if (that.mechanicalAction === 'switchWhenReleased') {
                that._moveThumbBasedOnCoordinates(event, true, true);
            }

            if (that.showTooltip) {
                that._movedTooltip.addClass('jqx-hidden');
            }

            that._thumbDragged = false;
            that.$track.removeClass('jqx-dragged');

            that._makeThumbAccessible();
        }

        /**
         * Spin button click event handler.
         */

    }, {
        key: '_spinButtonClickHandler',
        value: function _spinButtonClickHandler(event) {
            var that = this;

            if (that.disabled || that.readonly) {
                return;
            }

            var operation = void 0;

            if (that.$.leftButton.contains(event.target) === that._normalLayout) {
                operation = 'subtract';
            } else {
                operation = 'add';
            }

            that._valuesHandler.incrementOrDecrement(operation);
        }

        /**
         * Slider keydown event handler.
         */

    }, {
        key: '_keydownHandlerSlider',
        value: function _keydownHandlerSlider(event) {
            this._valuesHandler.keydownHandler(event);
        }

        /**
         * Slider resize and styleChanged event handler.
         */

    }, {
        key: '_resizeAndStyleChangedHandler',
        value: function _resizeAndStyleChangedHandler(event) {
            var that = this,
                valuesHandler = that._valuesHandler;

            that._setTicksAndInterval();
            valuesHandler.validate(false, valuesHandler.getValue());

            if (event.type === 'styleChanged') {
                var changedStyleProperties = event.detail.styleProperties;

                if (changedStyleProperties['font-size'] || changedStyleProperties['font-family'] || changedStyleProperties['font-style'] || changedStyleProperties['font-weight']) {
                    var optimum = that.getOptimalSize();
                    that.style.width = optimum.width + 'px';
                    that.style.height = optimum.height + 'px';
                }
            }
        }

        /**
         * Moves the slider's thumb and updates the filled part of the track based on the position of the mouse.
         */

    }, {
        key: '_moveThumbBasedOnCoordinates',
        value: function _moveThumbBasedOnCoordinates(event, checkBoundaries, changeValue) {
            var that = this,
                numericProcessor = that._numericProcessor,
                trackStart = that._trackStart,
                margin = that._settings.margin;
            var coordinate = event[that._settings.page];

            if (checkBoundaries) {
                coordinate = that._valuesHandler.restrictThumbCoordinates(coordinate, trackStart, that._trackEnd);
            }

            var newValue = numericProcessor.pxToValue(coordinate),
                actualNewValue = newValue;

            if (!that.logarithmicScale) {
                newValue = numericProcessor.getCoercedValue(newValue);
                actualNewValue = newValue;
            } else {
                newValue = numericProcessor.getCoercedValue(Math.log10(newValue));
                actualNewValue = parseFloat(Math.pow(10, newValue).toFixed(13));
            }
            coordinate = numericProcessor.valueToPx(newValue) + trackStart;

            var size = coordinate - trackStart;

            that._movedThumb.style[margin] = size - that._measurements.halfThumbSize + 'px';

            that._valuesHandler.updateFillSizeAndPosition(size, margin, actualNewValue, true, changeValue);

            if (event.originalEvent) {
                event.originalEvent.stopPropagation();
                event.originalEvent.preventDefault();
            }
        }

        /**
         * Moves the slider's thumb and updates the filled part of the track based on a passed value.
         */

    }, {
        key: '_moveThumbBasedOnValue',
        value: function _moveThumbBasedOnValue(thumb, value, triggerEvent) {
            var that = this,
                px = that._numericProcessor.valueToPx(value),
                margin = that._settings.margin;

            thumb.style[margin] = px - that._measurements.halfThumbSize + 'px';

            var actualValue = that._getSingleActualValue(value);

            that._valuesHandler.updateFillSizeAndPosition(px, margin, actualValue, triggerEvent, triggerEvent);
        }

        /**
         * Calls the appropriate validation function.
         */

    }, {
        key: '_validate',
        value: function _validate(initialValidation, programmaticValue) {
            this._valuesHandler.validate(initialValidation, programmaticValue);
        }

        /**
         * Calls the appropriate update function.
         */

    }, {
        key: '_updateValue',
        value: function _updateValue(value) {
            var valuesHandler = this._valuesHandler;
            valuesHandler.updateValue(valuesHandler.getActualValue(value));
        }

        /**
         * Makes the first thumb accessible.
         */

    }, {
        key: '_makeThumbAccessible',
        value: function _makeThumbAccessible() {
            var that = this;
            if (that.rangeSlider) {
                if (that.$.thumb[that._settings.offset] === that.$.secondThumb[that._settings.offset] && that._numericProcessor.compare(that.values[1], that.max) === false) {
                    that.$thumb.addClass('accessible');
                } else {
                    that.$thumb.removeClass('accessible');
                }
            }
        }
    }, {
        key: '_getSingleActualValue',
        value: function _getSingleActualValue(value) {
            if (this.logarithmicScale) {
                return parseFloat(Math.pow(10, value).toFixed(13));
            }
            return value.toString();
        }
    }], [{
        key: 'properties',

        /**
         * Slider's properties.
         */
        get: function get() {
            return {
                'orientation': {
                    value: 'horizontal',
                    allowedValues: ['horizontal', 'vertical'],
                    type: 'string',
                    defaultReflectToAttribute: true
                },
                'rangeSlider': {
                    value: false,
                    type: 'boolean'
                },
                'showButtons': {
                    value: false,
                    type: 'boolean'
                },
                'values': {
                    value: ['0', '100'],
                    type: 'array'
                }
            };
        }

        /**
         * Slider's event listeners.
         */

    }, {
        key: 'listeners',
        get: function get() {
            return {
                'track.down': '_trackDownHandler',
                'thumb.down': '_thumbDownHandler',
                'secondThumb.down': '_thumbDownHandler',
                'thumb.mouseenter': '_thumbMouseenterMouseleaveHandler',
                'secondThumb.mouseenter': '_thumbMouseenterMouseleaveHandler',
                'thumb.mouseleave': '_thumbMouseenterMouseleaveHandler',
                'secondThumb.mouseleave': '_thumbMouseenterMouseleaveHandler',
                'document.move': '_documentMoveHandler',
                'document.up': '_documentUpHandler',
                'leftButton.click': '_spinButtonClickHandler',
                'rightButton.click': '_spinButtonClickHandler',
                'keydown': '_keydownHandlerSlider',
                'resize': '_resizeAndStyleChangedHandler',
                'styleChanged': '_resizeAndStyleChangedHandler',
                'document.selectstart': '_selectStartHandler'
            };
        }
    }]);
    return Slider;
}(JQX.Tank));

/**
 * A class for instantiating a tooltip handler object (standard case).
 */
JQX.Utilities.Assign('SliderSingleValueHandler', function () {
    function SliderSingleValueHandler(context) {
        babelHelpers.classCallCheck(this, SliderSingleValueHandler);

        this.context = context;
    }

    babelHelpers.createClass(SliderSingleValueHandler, [{
        key: 'applyFunctionToValue',
        value: function applyFunctionToValue(fn, argument) {
            var that = this,
                context = that.context;

            if (argument === undefined) {
                argument = context.value;
            }

            var result = fn.apply(context, [argument]);

            return result;
        }
    }, {
        key: 'areDifferent',
        value: function areDifferent(other) {
            return this.context.value !== other;
        }
    }, {
        key: 'incrementOrDecrement',
        value: function incrementOrDecrement(operation) {
            var context = this.context,
                newValue = context._keyIncrementDecrement(operation);
            this.validate(false, newValue);
        }
    }, {
        key: 'setActiveThumbOnTrackClick',
        value: function setActiveThumbOnTrackClick() {
            var context = this.context;
            context._movedThumb = context.$.thumb;
            context._movedTooltip = context.$tooltip;
        }
    }, {
        key: 'getActualValue',
        value: function getActualValue(value) {
            return this.context._getSingleActualValue(value);
        }
    }, {
        key: 'getCoercedLogarithmicValue',
        value: function getCoercedLogarithmicValue(value) {
            var context = this.context;
            if (context.logarithmicScale) {
                var newDrawValue = context._numericProcessor.getCoercedValue(Math.log10(value));
                return this.getActualValue(newDrawValue);
            }
            return value;
        }
    }, {
        key: 'getDrawValue',
        value: function getDrawValue() {
            return this.context._drawValue;
        }
    }, {
        key: 'getValue',
        value: function getValue() {
            return this.context.value;
        }
    }, {
        key: 'keydownHandler',
        value: function keydownHandler(event) {
            this.context._keydownHandler(event);
        }
    }, {
        key: 'moveThumbBasedOnValue',
        value: function moveThumbBasedOnValue(value, triggerEvent, noUpdate) {
            var context = this.context;

            if (value === undefined) {
                value = context.value;
            }

            context._moveThumbBasedOnValue(context.$.thumb, value, triggerEvent);

            if (noUpdate !== true) {
                context._drawValue = value;
                var actualValue = this.getActualValue(value);

                if (context._valueNoRangeValidation !== undefined) {
                    context.value = context._valueNoRangeValidation.toString();
                } else {
                    context.value = actualValue.toString();
                }

                delete context._valueBeforeCoercion;
                this.updateTooltipValue(actualValue);
            }
        }
    }, {
        key: 'restrictThumbCoordinates',
        value: function restrictThumbCoordinates(coordinate, trackStart, trackEnd) {
            coordinate = Math.max(coordinate, trackStart);
            coordinate = Math.min(coordinate, trackEnd);
            return coordinate;
        }
    }, {
        key: 'updateFillSizeAndPosition',
        value: function updateFillSizeAndPosition(size, margin, newValue, updateTooltip, changeValue) {
            var context = this.context,
                fillStyle = context.$.fill.style,
                dimension = context._settings.dimension;

            if (context._normalLayout) {
                fillStyle[dimension] = size + 'px';
            } else {
                fillStyle[dimension] = context._measurements.trackLength - size + 'px';
                fillStyle[margin] = size + 'px';
            }

            if (updateTooltip) {
                var oldValue = context.value,
                    numericProcessor = context._numericProcessor;
                if (numericProcessor.compare(numericProcessor.createDescriptor(newValue), numericProcessor.createDescriptor(oldValue))) {
                    this.updateTooltipValue(newValue);

                    if (changeValue) {
                        context._drawValue = context.logarithmicScale ? Math.log10(newValue) : newValue;
                        if (context._valueNoRangeValidation !== undefined) {
                            context.value = context._valueNoRangeValidation.toString();
                        } else {
                            context.value = newValue.toString();
                        }

                        delete context._valueBeforeCoercion;
                        if (context._programmaticValueIsSet !== true) {
                            context.$.fireEvent('change', { 'value': context.value, 'oldValue': oldValue });
                        }
                    }
                }
            }
        }
    }, {
        key: 'updateTooltipValue',
        value: function updateTooltipValue(newValue) {
            var context = this.context;

            if (newValue === undefined) {
                newValue = context.value;
            }

            var newFormattedValue = context._formatLabel(newValue);

            if (context.$.tooltipContent.innerHTML !== newFormattedValue) {
                context.$.tooltipContent.innerHTML = newFormattedValue;
            }
        }
    }, {
        key: 'updateValue',
        value: function updateValue(value) {
            var context = this.context,
                renderedValue = context._numericProcessor.createDescriptor(value, true, false);

            context._drawValue = context.logarithmicScale ? Math.log10(renderedValue) : renderedValue;
            this.moveThumbBasedOnValue(context._drawValue, true);
        }
    }, {
        key: 'validate',
        value: function validate(initialValidation, programmaticValue) {
            var context = this.context,
                numericProcessor = context._numericProcessor;
            var value = void 0;

            if (initialValidation) {
                value = context.value;
            } else {
                value = programmaticValue;
            }

            var validNumber = void 0;
            if (context.logarithmicScale) {
                value = this.getCoercedLogarithmicValue(value);
            } else {
                value = numericProcessor.getCoercedValue(value);
            }

            context._valueNoRangeValidation = numericProcessor.createDescriptor(value, true, true, false);
            validNumber = numericProcessor.validate(context._valueNoRangeValidation, context._minObject, context._maxObject);

            if (initialValidation) {
                context._drawValue = context.logarithmicScale ? Math.log10(validNumber) : validNumber;
                context.value = context._valueNoRangeValidation.toString();
                this.moveThumbBasedOnValue(context._drawValue, undefined, true);
                context._programmaticValueIsSet = false;
            } else {
                this.updateValue(validNumber);
            }

            delete context._valueNoRangeValidation;
        }
    }]);
    return SliderSingleValueHandler;
}());

/**
 * A class for instantiating a tooltip handler object (range slider case).
 */
JQX.Utilities.Assign('SliderMultipleValueHandler', function () {
    function SliderMultipleValueHandler(context) {
        babelHelpers.classCallCheck(this, SliderMultipleValueHandler);

        this.context = context;
    }

    babelHelpers.createClass(SliderMultipleValueHandler, [{
        key: 'applyFunctionToValue',
        value: function applyFunctionToValue(fn, argument) {
            var that = this,
                context = that.context,
                result = [];

            if (argument === undefined) {
                argument = context.values;
            }

            result[0] = fn.apply(context, [argument[0]]);
            result[1] = fn.apply(context, [argument[1]]);

            return result;
        }
    }, {
        key: 'areDifferent',
        value: function areDifferent(other) {
            var values = this.context.values;
            return values[0] !== other[0] || values[1] !== other[1];
        }
    }, {
        key: 'incrementOrDecrement',
        value: function incrementOrDecrement(operation) {
            var context = this.context,
                changedValues = context.values.slice(0);
            var changedIndex = void 0;

            if (operation === 'add') {
                changedIndex = 1;
            } else {
                changedIndex = 0;
            }

            changedValues[changedIndex] = this.keyIncrementDecrement(operation, changedIndex);

            this.validate(false, changedValues);
        }
    }, {
        key: 'keydownHandler',
        value: function keydownHandler(event) {
            var context = this.context;

            if (context.disabled || context.readonly) {
                return;
            }

            var keyCode = !event.charCode ? event.which : event.charCode,
                handledKeyCodes = [35, 36, 37, 38, 39, 40];

            if (handledKeyCodes.indexOf(keyCode) !== -1) {
                event.preventDefault();

                var updatedValues = context.values.slice(0);
                var newValue = void 0;

                switch (keyCode) {
                    case 40: //down arrow
                    case 37:
                        //left arrow
                        newValue = this.keyIncrementDecrement('subtract', 0);
                        updatedValues[0] = newValue;
                        break;
                    case 38: //top arrow
                    case 39:
                        //right arrow
                        newValue = this.keyIncrementDecrement('add', 1);
                        updatedValues[1] = newValue;
                        break;
                    case 36:
                        //home
                        context._drawValues[0] = context._drawMin;
                        updatedValues[0] = context.min;
                        break;
                    case 35:
                        //end
                        context._drawValues[1] = context._drawMax;
                        updatedValues[1] = context.max;
                        break;
                }
                this.validate(false, updatedValues);
                return false;
            }
        }
    }, {
        key: 'keyIncrementDecrement',
        value: function keyIncrementDecrement(action, changedIndex) {
            var context = this.context,
                drawValue = context._drawValues[changedIndex],
                preValue = context._numericProcessor.createDescriptor(drawValue);

            var newValue = context._numericProcessor.incrementDecrement(preValue, action, context._validInterval);
            if (context.logarithmicScale) {
                context._drawValues[changedIndex] = newValue;
                newValue = parseFloat(Math.pow(10, Math.round(newValue)).toFixed(13));
            }
            return newValue;
        }
    }, {
        key: 'setActiveThumbOnTrackClick',
        value: function setActiveThumbOnTrackClick(event) {
            var context = this.context,
                commonTerm = context._trackStart + context._measurements.halfThumbSize,
                offset = context._settings.offset,
                thumb = context.$.thumb,
                secondThumb = context.$.secondThumb,
                thumbOffset = thumb[offset],
                secondThumbOffset = secondThumb[offset],
                clickedCoordinate = event[context._settings.page];

            var middleBetweenThumbs = context._normalLayout ? commonTerm + thumbOffset + (secondThumbOffset - thumbOffset) / 2 : commonTerm + secondThumbOffset + (thumbOffset - secondThumbOffset) / 2;

            if (context._normalLayout && clickedCoordinate <= middleBetweenThumbs || !context._normalLayout && clickedCoordinate > middleBetweenThumbs) {
                context._movedThumb = thumb;
                context._staticThumb = secondThumb;
                context._movedTooltip = context.$tooltip;
            } else {
                context._movedThumb = secondThumb;
                context._staticThumb = thumb;
                context._movedTooltip = context.$secondTooltip;
            }
        }
    }, {
        key: 'getActualValue',
        value: function getActualValue(values) {
            if (this.context.logarithmicScale) {
                return [parseFloat(Math.pow(10, values[0].toString()).toFixed(13)), parseFloat(Math.pow(10, values[1].toString()).toFixed(13))];
            }
            return [values[0].toString(), values[1].toString()];
        }
    }, {
        key: 'getCoercedLogarithmicValue',
        value: function getCoercedLogarithmicValue(values) {
            var context = this.context;
            if (context.logarithmicScale) {
                var newDrawValues = [];
                newDrawValues[0] = context._numericProcessor.getCoercedValue(Math.log10(values[0]));
                newDrawValues[1] = context._numericProcessor.getCoercedValue(Math.log10(values[1]));
                return this.getActualValue(newDrawValues);
            }
            return values;
        }
    }, {
        key: 'getDrawValue',
        value: function getDrawValue() {
            return this.context._drawValues;
        }
    }, {
        key: 'getValue',
        value: function getValue() {
            return this.context.values.slice(0);
        }
    }, {
        key: 'moveThumbBasedOnValue',
        value: function moveThumbBasedOnValue(value, changedIndex, noUpdate) {
            var context = this.context;

            if (value === undefined) {
                value = context.values;
            }

            context._numericProcessor.restrictValue(value);

            if (changedIndex === undefined || changedIndex === 0) {
                context._movedThumb = context.$.thumb;
                context._moveThumbBasedOnValue(context.$.thumb, value[0], true);
            }
            if (changedIndex === undefined || changedIndex === 1) {
                context._movedThumb = context.$.secondThumb;
                context._moveThumbBasedOnValue(context.$.secondThumb, value[1], true);
            }

            if (noUpdate !== true) {
                context._drawValues = value;
                var actualValues = this.getActualValue(value);

                if (context._valuesNoRangeValidation) {
                    context.values = [context._valuesNoRangeValidation[0].toString(), context._valuesNoRangeValidation[1].toString()];
                } else {
                    context.values = actualValues;
                }

                delete context._valueBeforeCoercion;
                this.updateTooltipValue();
            }
        }
    }, {
        key: 'restrictThumbCoordinates',
        value: function restrictThumbCoordinates(coordinate, trackStart, trackEnd) {
            var context = this.context,
                staticThumbOffset = trackStart + context._staticThumb[context._settings.offset] + context._measurements.halfThumbSize;

            if (context._movedThumb === context.$.thumb && context._normalLayout || context._movedThumb === context.$.secondThumb && !context._normalLayout) {
                coordinate = Math.max(coordinate, trackStart);
                coordinate = Math.min(coordinate, trackEnd, staticThumbOffset);
            } else {
                coordinate = Math.max(coordinate, trackStart, staticThumbOffset);
                coordinate = Math.min(coordinate, trackEnd);
            }

            return coordinate;
        }
    }, {
        key: 'updateFillSizeAndPosition',
        value: function updateFillSizeAndPosition(size, margin, newValue, updateTooltip, changeValue) {
            var context = this.context,
                fillStyle = context.$.fill.style,
                dimension = context._settings.dimension,
                offset = context._settings.offset,
                halfThumbSize = context._measurements.halfThumbSize;

            if (context._normalLayout) {
                fillStyle[dimension] = context.$.secondThumb[offset] - context.$.thumb[offset] + 'px';
                fillStyle[margin] = context.$.thumb[offset] + halfThumbSize + 'px';
            } else {
                fillStyle[dimension] = context.$.thumb[offset] - context.$.secondThumb[offset] + 'px';
                fillStyle[margin] = context.$.secondThumb[offset] + halfThumbSize + 'px';
            }

            if (updateTooltip) {
                var numericProcessor = context._numericProcessor,
                    index = context._movedThumb === context.$.thumb ? 0 : 1,
                    oldValue = context.values[index],
                    oldValues = context.values.slice(0);
                if (numericProcessor.compare(numericProcessor.createDescriptor(newValue), numericProcessor.createDescriptor(oldValue))) {
                    var updatedValues = context.values.slice(0);
                    updatedValues[index] = newValue.toString();
                    this.updateTooltipValue(newValue, index);

                    if (changeValue) {
                        this.updateDrawValues(updatedValues);

                        if (context._valuesNoRangeValidation) {
                            context.values = [context._valuesNoRangeValidation[0].toString(), context._valuesNoRangeValidation[1].toString()];
                        } else {
                            context.values = updatedValues;
                        }

                        delete context._valueBeforeCoercion;
                        if (context._programmaticValueIsSet !== true) {
                            context.$.fireEvent('change', { 'value': context.values.slice(0), 'oldValue': oldValues });
                        }
                    }
                }
            }
        }
    }, {
        key: 'updateDrawValues',
        value: function updateDrawValues(values) {
            var context = this.context;

            if (context.logarithmicScale) {
                context._drawValues[0] = Math.log10(values[0]);
                context._drawValues[1] = Math.log10(values[1]);
            } else {
                context._drawValues = values.slice(0);
            }
        }
    }, {
        key: 'updateTooltipValue',
        value: function updateTooltipValue(newValue, index) {
            var context = this.context;
            if (newValue === undefined) {
                var values = context.values,
                    formattedFirstValue = context._formatLabel(values[0]),
                    formattedSecondValue = context._formatLabel(values[1]);

                if (context.$.tooltipContent.innerHTML !== formattedFirstValue) {
                    context.$.tooltipContent.innerHTML = formattedFirstValue;
                }

                if (context.$.secondTooltipContent.innerHTML !== formattedSecondValue) {
                    context.$.secondTooltipContent.innerHTML = formattedSecondValue;
                }
            } else {
                var formattedNewValue = context._formatLabel(newValue);

                if (index === 0 && context.$.tooltipContent.innerHTML !== formattedNewValue) {
                    context.$.tooltipContent.innerHTML = formattedNewValue;
                } else if (index === 1 && context.$.secondTooltipContent.innerHTML !== formattedNewValue) {
                    context.$.secondTooltipContent.innerHTML = formattedNewValue;
                }
            }
        }
    }, {
        key: 'updateValue',
        value: function updateValue(values) {
            var context = this.context,
                renderedValues = [];

            renderedValues[0] = context._numericProcessor.createDescriptor(values[0], true, false);
            renderedValues[1] = context._numericProcessor.createDescriptor(values[1], true, false);

            this.updateDrawValues(renderedValues);
            this.moveThumbBasedOnValue(context._drawValues.slice(0));
        }
    }, {
        key: 'validate',
        value: function validate(initialValidation, programmaticValue) {
            var context = this.context,
                numericProcessor = context._numericProcessor;
            var validNumbers = [],
                values = void 0;

            if (initialValidation) {
                values = context.values.slice(0);
            } else {
                values = programmaticValue;
            }

            if (context.logarithmicScale) {
                values = this.getCoercedLogarithmicValue(values);
            } else {
                values[0] = numericProcessor.getCoercedValue(values[0]);
                values[1] = numericProcessor.getCoercedValue(values[1]);
            }

            context._valuesNoRangeValidation = [];
            context._valuesNoRangeValidation[0] = numericProcessor.createDescriptor(values[0], true, true, false);
            context._valuesNoRangeValidation[1] = numericProcessor.createDescriptor(values[1], true, true, false);

            context._numericProcessor.restrictValue(context._valuesNoRangeValidation);

            validNumbers[0] = numericProcessor.validate(context._valuesNoRangeValidation[0], context._minObject, context._maxObject);
            validNumbers[1] = numericProcessor.validate(context._valuesNoRangeValidation[1], context._minObject, context._maxObject);

            if (initialValidation) {
                context._drawValues = [];
                this.updateDrawValues(validNumbers);
                context.values = [context._valuesNoRangeValidation[0].toString(), context._valuesNoRangeValidation[1].toString()];
                this.moveThumbBasedOnValue(context._drawValues, undefined, true);
                context._programmaticValueIsSet = false;
            } else {
                this.updateValue(validNumbers);
            }

            delete context._valuesNoRangeValidation;
        }
    }]);
    return SliderMultipleValueHandler;
}());