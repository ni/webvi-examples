'use strict';

/**
 * Tank custom element.
 */
JQX('jqx-tank', function (_JQX$BaseElement) {
    babelHelpers.inherits(Tank, _JQX$BaseElement);

    function Tank() {
        babelHelpers.classCallCheck(this, Tank);
        return babelHelpers.possibleConstructorReturn(this, (Tank.__proto__ || Object.getPrototypeOf(Tank)).apply(this, arguments));
    }

    babelHelpers.createClass(Tank, [{
        key: 'template',


        /**
         * Tank's HTML template.
         */
        value: function template() {
            var template = '<div id="container" class="jqx-container">' + '<div id="scaleNear" class="jqx-scale jqx-scale-near"></div>' + '<div id="track" class="jqx-track">' + '<div id="fill" class="jqx-value">' + '<div id="tooltip" class="jqx-tooltip">' + '<div id="tooltipContent" class="jqx-tooltip-content jqx-unselectable"></div>' + '</div>' + '</div>' + '<div id="thumb" class="jqx-thumb">' + '</div>' + '<div id="trackTicksContainer" class="jqx-track-ticks-container jqx-hidden"></div>' + '</div>' + '<div id="scaleFar" class="jqx-scale jqx-scale-far"></div>' + '</div>';

            return template;
        }

        /**
         * Invoked when an instance of custom element is attached to the DOM for the first time.
         */

    }, {
        key: 'ready',
        value: function ready() {
            babelHelpers.get(Tank.prototype.__proto__ || Object.getPrototypeOf(Tank.prototype), 'ready', this).call(this);

            this._createElement();
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
            that._wordLengthNumber = that._numericProcessor.getWordLength(that.wordLength);
            that._validateInitialPropertyValues();
            that._setTicksAndInterval();

            // Initial adjustments
            that._validate(true);

            that._updateTooltipValue(that._drawValue);
            that._setTabIndex();
            that._setTrackSize();
        }
        /*
         * Public methods
         */

        /**
         * Sets or gets the value of the tank.
         *
         * @param {Number/String} value Optional value to be set to the tank. If this parameter is not set, the method gets the value.
         */

    }, {
        key: 'val',
        value: function val(value) {
            var that = this,
                isEmptyObject = (typeof value === 'undefined' ? 'undefined' : babelHelpers.typeof(value)) === 'object' && Object.keys(value).length === 0;

            if (value !== undefined && isEmptyObject === false) {
                if (that.value.toString().toUpperCase() !== value.toString().toUpperCase()) {

                    // use as value setter
                    value = value.toString().replace(/\s/g, '');
                    if (that._numericProcessor.regexScientificNotation.test(value)) {
                        value = that._numericProcessor.scientificToDecimal(value);
                    }

                    value = that.logarithmicScale ? that._formatNumber(Math.pow(10, that._numericProcessor.getCoercedValue(Math.log10(value)))) : that._numericProcessor.getCoercedValue(value);

                    var valueToValidate = value.toString();

                    that._validate(false, valueToValidate, true);
                    that._programmaticValueIsSet = true;
                    that.value = that._discardDecimalSeparator(valueToValidate);
                    delete that._valueBeforeCoercion;
                } else {
                    return that.value = typeof value === 'string' ? value : value.toString();
                }
            } else {
                // use as value getter
                return that.value;
            }
        }
    }, {
        key: '_setTrackSize',
        value: function _setTrackSize() {
            var that = this;

            //Calculte initial track size
            if (that.orientation === 'vertical') {
                that._trackSize = that.$.track.offsetWidth;
            } else {
                that._trackSize = that.$.track.offsetHeight;
            }
        }

        /**
         * Gets the optimal size of the tank.
         */

    }, {
        key: 'getOptimalSize',
        value: function getOptimalSize() {
            var that = this;
            var propertiesObj = void 0,
                largestLabelSize = void 0,
                sizeObject = void 0;

            switch (that.labelsVisibility) {
                case 'all':
                    largestLabelSize = that._numericProcessor._longestLabelSize;
                    break;
                case 'endPoints':
                    largestLabelSize = Math.max(that._tickIntervalHandler.labelsSize.minLabelOtherSize, that._tickIntervalHandler.labelsSize.maxLabelOtherSize);
                    break;
                case 'none':
                    largestLabelSize = 0;
                    break;
            }

            switch (that.orientation) {
                case 'horizontal':
                    propertiesObj = {
                        marginA: 'marginBottom',
                        marginB: 'marginTop',
                        nearScaleDistance: 'bottom',
                        farScaleDistance: 'top',
                        paddingA: 'paddingBottom',
                        paddingB: 'paddingTop',
                        offset: 'offsetWidth',
                        distance: 'left'
                    };

                    if (that._orientationChanged) {
                        propertiesObj.offset = 'offsetHeight';
                        that._trackChanged = true;
                    }

                    sizeObject = that._getSize(largestLabelSize, propertiesObj);
                    return { width: sizeObject.optimalOtherSize, height: sizeObject.optimalSize };
                case 'vertical':
                    propertiesObj = {
                        marginA: 'marginLeft',
                        marginB: 'marginRight',
                        nearScaleDistance: 'right',
                        farScaleDistance: 'left',
                        paddingA: 'paddingLeft',
                        paddingB: 'paddingRight',
                        offset: 'offsetHeight',
                        distance: 'top'
                    };

                    if (that._orientationChanged) {
                        propertiesObj.offset = 'offsetWidth';
                        that._trackChanged = true;
                    }

                    sizeObject = that._getSize(largestLabelSize, propertiesObj);
                    return { width: sizeObject.optimalSize, height: sizeObject.optimalOtherSize };
            }
        }

        /**
         * Invoked when the value of a public property has been changed by the user.
         */

    }, {
        key: 'propertyChangedHandler',
        value: function propertyChangedHandler(key, oldValue, value) {
            babelHelpers.get(Tank.prototype.__proto__ || Object.getPrototypeOf(Tank.prototype), 'propertyChangedHandler', this).call(this, key, oldValue, value);

            var that = this;

            switch (key) {
                case 'labelsVisibility':
                case 'ticksVisibility':
                    that._updateScaleWidth(that._numericProcessor._longestLabelSize);
                    return;
                case 'coerce':
                    if (value) {
                        var valueBeforeCoercion = that.value,
                            coercedValue = value = that.logarithmicScale ? that._formatNumber(Math.pow(10, that._numericProcessor.getCoercedValue(Math.log10(valueBeforeCoercion)))) : that._numericProcessor.getCoercedValue(valueBeforeCoercion);

                        that._validate(false, coercedValue, true);
                        that._valueBeforeCoercion = valueBeforeCoercion; // stores value before coercion
                    } else {
                        if (that._valueBeforeCoercion !== undefined) {
                            that._validate(false, that._valueBeforeCoercion, false);
                        }
                    }
                    return;
                case 'interval':
                    {
                        //Validates the Interval
                        that._numericProcessor.validateInterval(value);

                        var newValue = value = that.logarithmicScale ? that._formatNumber(Math.pow(10, that._numericProcessor.getCoercedValue(Math.log10(that.value)))) : that._numericProcessor.getCoercedValue(that.value);
                        that._validate(false, newValue, that.coerce);
                        break;
                    }
                case 'min':
                case 'max':
                    {
                        that._validateMinMax(key, false, oldValue);
                        var numberToValidate = that._numericProcessor.createDescriptor(that._discardDecimalSeparator(that.value, that.decimalSeparator)),
                            validValue = that._numericProcessor.validate(numberToValidate, that._minObject, that._maxObject);

                        that._setTicksAndInterval();
                        that._numericProcessor.updateValue(validValue);
                        break;
                    }
                case 'inverted':
                    {
                        that._getLayoutType();
                        if (that._normalLayout) {
                            that.$.fill.style[that._settings.margin] = '0px';
                        }

                        var invertedNumberToValidate = that._numericProcessor.createDescriptor(that.value),
                            validInvertedValue = that._numericProcessor.validate(invertedNumberToValidate, that._minObject, that._maxObject);

                        that._setTicksAndInterval();
                        that._numericProcessor.updateValue(validInvertedValue);
                        break;
                    }
                case 'orientation':
                    {
                        var fillStyle = that.$.fill.style,
                            containerStyle = that.$.container.style;

                        //resizeChange handler flag
                        if (that._orientationChanged !== true) {
                            that._orientationChanged = true;
                        }
                        that._tankSizeBeforeOrientation = { width: that.offsetWidth, height: that.offsetHeight };
                        that._setSettingsObject();
                        that._getLayoutType();

                        if (that.inverted) {
                            fillStyle.marginTop = '0';
                            fillStyle.marginLeft = '0';
                        }
                        switch (that.orientation) {
                            case 'vertical':
                                if (!that.inverted) {
                                    fillStyle.marginTop = 'auto';
                                    fillStyle.marginLeft = '0';
                                }
                                fillStyle.width = '100%';
                                containerStyle.paddingLeft = '0';
                                containerStyle.paddingRight = '0';
                                break;
                            case 'horizontal':
                                if (!that.inverted) {
                                    fillStyle.marginTop = '0';
                                    fillStyle.marginLeft = 'auto';
                                }
                                fillStyle.height = '100%';
                                containerStyle.paddingTop = '0';
                                containerStyle.paddingBottom = '0';
                                break;
                        }
                        that._validateMinMax('both');

                        var orientationNumberToValidate = that._numericProcessor.createDescriptor(that.value),
                            validOrientationValue = that._numericProcessor.validate(orientationNumberToValidate, that._minObject, that._maxObject);

                        that._setTicksAndInterval();
                        that._setTicksAndInterval(); //
                        that._numericProcessor.updateValue(validOrientationValue);
                        break;
                    }
                case 'significantDigits':
                case 'precisionDigits':
                    {

                        if (key === 'precisionDigits' && that.scaleType === 'integer') {
                            that.error(that.localize('noInteger', { elementType: that.nodeName.toLowerCase(), property: key }));
                        }

                        if (key === 'significantDigits' && that.precisionDigits !== null) {
                            that.precisionDigits = null;
                        } else if (key === 'precisionDigits' && that.significantDigits !== null) {
                            that.significantDigits = null;
                        }

                        // Validates significantDigits
                        that._validateInitialPropertyValues();

                        // Redraw the labels
                        that._setTicksAndInterval();

                        if (that.orientation === 'horizontal' && that.inverted) {
                            var px = that._numericProcessor.valueToPx(that._numericProcessor.getCoercedValue(that._drawValue));

                            that.updateFillSizeAndPosition(px, that._settings.margin, value, false);
                        }
                        break;
                    }
                case 'decimalSeparator':
                    {
                        if (that.scaleType === 'integer') {
                            return;
                        }

                        var numericValue = that._discardDecimalSeparator(that.value, oldValue),
                            valueWithNewSeparator = that._applyDecimalSeparator(numericValue);

                        that.value = numericValue;
                        delete that._valueBeforeCoercion;

                        // Redraw the labels
                        that._numericProcessor.addTicksAndLabels();
                        that._updateTooltipValue(valueWithNewSeparator);
                        break;
                    }
                case 'value':
                    {
                        if (value === null) return;

                        if (that.value.toString().toUpperCase() !== oldValue.toString().toUpperCase()) {
                            var valueToValidate = value !== undefined ? value.toString().replace(/\s/g, '') : oldValue.toString().replace(/\s/g, '');

                            if (that._numericProcessor.regexScientificNotation.test(valueToValidate)) {
                                valueToValidate = that._numericProcessor.scientificToDecimal(valueToValidate);
                            }

                            that._validate(false, valueToValidate);
                            that._programmaticValueIsSet = true;
                            delete that._valueBeforeCoercion;
                        } else {
                            that.value = typeof value === 'string' ? value : value.toString();
                        }

                        break;
                    }
                case 'scaleType':
                    that._changeScaleType(oldValue, value);
                    break;
                case 'disabled':
                case 'readonly':
                    that._setTabIndex();
                    break;
                case 'showUnit':
                case 'unit':
                    {
                        that._setTicksAndInterval();
                        that._moveThumbBasedOnValue(that._drawValue);
                        break;
                    }
                case 'tooltipPosition':
                    break;
                case 'wordLength':
                    {
                        that._wordLengthNumber = that._numericProcessor.getWordLength(value);
                        that._validateMinMax('both');

                        var _numberToValidate = that._numericProcessor.createDescriptor(that.value),
                            _validValue = that._numericProcessor.validate(_numberToValidate, that._minObject, that._maxObject);

                        that._setTicksAndInterval();
                        that._numericProcessor.updateValue(_validValue);
                        break;
                    }
                case 'scalePosition':
                    {
                        that._setInitialComponentDisplay();
                        that._setTicksAndInterval();
                        that._numericProcessor.updateValue(that.value);
                        break;
                    }
                case 'labelFormatFunction':
                case 'scientificNotation':
                    {
                        var _numericValue = that._discardDecimalSeparator(that.value, that.decimalSeparator);

                        // Recalculate label position and redraw the labels
                        that._setTicksAndInterval();

                        //Update toolTip\'s value
                        that._updateTooltipValue(_numericValue);
                        break;
                    }
                case 'logarithmicScale':
                    {
                        that._validateMinMax('both');
                        var _numberToValidate2 = that._numericProcessor.createDescriptor(that.value),
                            _validValue2 = that._numericProcessor.validate(_numberToValidate2, that._minObject, that._maxObject);

                        that._setTicksAndInterval();
                        that._numericProcessor.updateValue(_validValue2);
                        break;
                    }
                case 'ticksPosition':
                    if (value === 'scale') {
                        that.$trackTicksContainer.addClass('jqx-hidden');
                        that.$.trackTicksContainer.innerHTML = '';
                    } else {
                        that.$trackTicksContainer.removeClass('jqx-hidden');
                    }
                    that._numericProcessor.addTicksAndLabels();
                    break;
            }
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

            if (JQX.Utilities.NumberRenderer === undefined) {
                missingModules.push('jqxnumberrenderer.js');
            }

            if (JQX.Utilities.NumericProcessor === undefined) {
                missingModules.push('jqxnumericprocessor.js');
            }

            if (JQX.Utilities.TickIntervalHandler === undefined) {
                missingModules.push('jqxtickintervalhandler.js');
            }

            if (missingModules.length > 0) {
                var that = this;
                that.error(that.localize('missingReference', { elementType: that.nodeName.toLowerCase(), files: missingModules.join(', ') }));
            }
        }

        /**
         * Sets the "_settings" object.
         */

    }, {
        key: '_setSettingsObject',
        value: function _setSettingsObject() {
            var that = this;

            if (that.orientation === 'horizontal') {
                that._settings = {
                    clientSize: 'clientWidth',
                    dimension: 'width',
                    leftOrTop: 'left',
                    margin: 'marginLeft',
                    offset: 'offsetLeft',
                    otherSize: 'offsetHeight',
                    size: 'offsetWidth',
                    page: 'pageX'
                };
            } else {
                that._settings = {
                    clientSize: 'clientHeight',
                    dimension: 'height',
                    leftOrTop: 'top',
                    margin: 'marginTop',
                    offset: 'offsetTop',
                    otherSize: 'offsetWidth',
                    size: 'offsetHeight',
                    page: 'pageY'
                };
            }
        }

        /**
         * Sets the display of the scales.
         */

    }, {
        key: '_setInitialComponentDisplay',
        value: function _setInitialComponentDisplay() {
            var that = this;

            switch (that.scalePosition) {
                case 'near':
                    that.$scaleNear.removeClass('jqx-hidden');
                    that.$scaleFar.addClass('jqx-hidden');
                    break;
                case 'far':
                    that.$scaleNear.addClass('jqx-hidden');
                    that.$scaleFar.removeClass('jqx-hidden');
                    break;
                case 'both':
                    that.$scaleFar.removeClass('jqx-hidden');
                    that.$scaleNear.removeClass('jqx-hidden');
                    break;
                case 'none':
                    that.$scaleFar.addClass('jqx-hidden');
                    that.$scaleNear.addClass('jqx-hidden');
                    break;
            }
            that.$tooltip.addClass('jqx-hidden');

            if (that.ticksPosition === 'track') {
                that.$trackTicksContainer.removeClass('jqx-hidden');
            }
        }

        /**
        * Style changed event handler.
        **/

    }, {
        key: '_styleChangedHandler',
        value: function _styleChangedHandler() {
            var that = this;

            that._setTicksAndInterval();
            that._moveThumbBasedOnValue(that._drawValue);
        }

        /**
         * Validates initial property values.
         */

    }, {
        key: '_validateInitialPropertyValues',
        value: function _validateInitialPropertyValues() {
            var that = this,
                value = babelHelpers.typeof(that.value) === String ? that.value.replace(/\s/g, '') : that.value.toString().replace(/\s/g, '');

            if (that._numericProcessor.regexScientificNotation.test(value)) {
                that.value = that._numericProcessor.scientificToDecimal(value);
                delete that._valueBeforeCoercion;
            }

            //Validates significantDigits
            that.significantDigits = that.significantDigits !== null ? Math.min(Math.max(that.significantDigits, 1), 21) : null;

            if (that.significantDigits === null && that.precisionDigits === null) {
                that.significantDigits = 8;
            } else if (that.significantDigits !== null && that.precisionDigits !== null) {
                that.error(that.localize('significantPrecisionDigits', { elementType: that.nodeName.toLowerCase() }));
            }

            //minMax validation
            that._validateMinMax('both', true);
        }

        /**
          * Validates the properties "min" and "max".
          */

    }, {
        key: '_validateMinMax',
        value: function _validateMinMax(validatedProperty, initialValidation, oldValue) {
            var that = this;

            var validateMin = validatedProperty === 'min' || validatedProperty === 'both',
                validateMax = validatedProperty === 'max' || validatedProperty === 'both';

            if ((typeof initialValidation === 'undefined' ? 'undefined' : babelHelpers.typeof(initialValidation)) === undefined) {
                initialValidation = false;
            }

            if (validatedProperty === 'both') {
                validator('min', oldValue);
                validator('max', oldValue);
            } else {
                validator(validatedProperty, oldValue);
            }

            function validator(param, oldValue) {
                that._numericProcessor.validateMinMax(param === 'min' || initialValidation, param === 'max' || initialValidation);
                var value = that['_' + param + 'Object'];

                var validateCondition = param === 'min' ? new BigNumber(that.max).compare(value) <= 0 : new BigNumber(that.min).compare(value) > 0;

                if (validateCondition) {
                    if (oldValue) {
                        that._numberRenderer = new JQX.Utilities.NumberRenderer(oldValue);
                        param === 'min' ? validateMin = false : validateMax = false;
                        that[param] = oldValue;
                        that['_' + param + 'Object'] = oldValue;
                    } else {
                        that.error(that.localize('invalidMinOrMax', { elementType: that.nodeName.toLowerCase(), property: param }));
                    }
                } else {
                    that._numberRenderer = new JQX.Utilities.NumberRenderer(value);
                    that[param] = that['_' + param + 'Object'];
                }
            }

            if (that.logarithmicScale) {
                that._validateOnLogarithmicScale(validateMin, validateMax, oldValue);
            } else {
                that._drawMin = that.min;
                that._drawMax = that.max;
            }

            that.min = that.min.toString();
            that.max = that.max.toString();

            that._minObject = that._numericProcessor.createDescriptor(that.min);
            that._maxObject = that._numericProcessor.createDescriptor(that.max);

            //Validates the Interval
            that._numericProcessor.validateInterval(that.interval);
        }

        /**
         * Calculates the tank's major and minor ticks interval.
         */

    }, {
        key: '_calculateTickInterval',
        value: function _calculateTickInterval() {
            var that = this;
            var intervals = that._tickIntervalHandler.getInterval('linear', that._drawMin, that._drawMax, that.$.track, that.logarithmicScale);

            if (intervals.major !== that._majorTicksInterval) {
                that._intervalHasChanged = true;
                that._majorTicksInterval = intervals.major;
            } else {
                that._intervalHasChanged = true;
            }

            that._minorTicksInterval = intervals.minor;
        }

        /**
         * Formats the value.
         */

    }, {
        key: '_formatNumber',
        value: function _formatNumber(value) {
            var that = this,
                numberRenderer = that._numberRenderer;
            var renderedNumber = parseFloat(value);

            numberRenderer.numericValue = value;

            if (that.scientificNotation) {
                renderedNumber = that._numberRenderer.toScientific();
            } else {
                switch (that.scaleType) {
                    case 'floatingPoint':
                        renderedNumber = that._applyDecimalSeparator(numberRenderer.toDigits(that.significantDigits, that.precisionDigits));
                        break;
                    case 'integer':
                        renderedNumber = numberRenderer.isENotation(renderedNumber) ? Math.round(numberRenderer.largeExponentialToDecimal(renderedNumber)) : Math.round(renderedNumber);
                        renderedNumber = numberRenderer.toDigits(that.significantDigits, 0);
                        break;
                }
            }
            return renderedNumber;
        }

        /**
        * Applies formatting to tank labels.
        */

    }, {
        key: '_formatLabel',
        value: function _formatLabel(labelValue, unselectableUnit) {
            var that = this;
            var renderedLabel = void 0;

            if (that.labelFormatFunction) {
                renderedLabel = that.labelFormatFunction(labelValue);

                if (renderedLabel !== undefined && renderedLabel !== '') {
                    return renderedLabel;
                }
            }

            renderedLabel = that._formatNumber(labelValue);
            that._numberRenderer = new JQX.Utilities.NumberRenderer(renderedLabel);
            if (that.showUnit) {
                if (unselectableUnit !== false) {
                    renderedLabel += ' <span class="jqx-unselectable">' + that.unit + '</span>';
                } else {
                    renderedLabel += ' ' + that.unit;
                }
            }
            return renderedLabel;
        }

        /**
         * Applies necessary paddings to the track container.
         */

    }, {
        key: '_layout',
        value: function _layout() {
            var that = this,
                containerStyle = that.$.container.style,
                paddingStart = that._tickIntervalHandler.labelsSize.minLabelSize / 2 + 'px',
                paddingEnd = that._tickIntervalHandler.labelsSize.maxLabelSize / 2 + 'px';

            switch (that.orientation) {
                case 'horizontal':
                    if (that.scalePosition === 'none') {
                        containerStyle.paddingLeft = '';
                        containerStyle.paddingRight = '';
                        break;
                    }
                    if (!that.inverted) {
                        containerStyle.paddingLeft = paddingStart;
                        containerStyle.paddingRight = paddingEnd;
                    } else {
                        containerStyle.paddingLeft = paddingEnd;
                        containerStyle.paddingRight = paddingStart;
                    }
                    break;
                case 'vertical':
                    if (that.scalePosition === 'none') {
                        containerStyle.paddingTop = '';
                        containerStyle.paddingBottom = '';
                        break;
                    }
                    if (!that.inverted) {
                        containerStyle.paddingBottom = paddingStart;
                        containerStyle.paddingTop = paddingEnd;
                    } else {
                        containerStyle.paddingBottom = paddingEnd;
                        containerStyle.paddingTop = paddingStart;
                    }
                    break;
            }
            that._measurements.trackLength = that.$.track[this._settings.clientSize];
        }

        /**
         * Track click event handler.
         */

    }, {
        key: '_trackDownHandler',
        value: function _trackDownHandler(event) {
            var that = this;

            if (that.disabled || that.readonly) {
                return;
            }

            if (that.mechanicalAction === 'switchUntilReleased') {
                that._cachedValue = {};
                that._cachedValue._drawValue = that._drawValue;
                that._cachedValue.value = that.value;
            }

            that._getTrackStartAndEnd();
            that._moveThumbBasedOnCoordinates(event, true, that.mechanicalAction !== 'switchWhenReleased');
            that._thumbDragged = true;
            that.$track.addClass('jqx-dragged');

            if (that.showTooltip) {
                that.$tooltip.removeClass('jqx-hidden');
            }
        }

        /**
         * Document mousemove event handler.
         */

    }, {
        key: '_documentMoveHandler',
        value: function _documentMoveHandler(event) {
            var that = this;

            if (that._thumbDragged) {
                event.preventDefault();
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

            if (that.mechanicalAction === 'switchWhenReleased') {
                that._moveThumbBasedOnCoordinates(event, true, true);
            } else if (that.mechanicalAction === 'switchUntilReleased') {
                var oldValue = that.value;

                that._drawValue = that._cachedValue._drawValue;
                that.value = that._cachedValue.value;
                that._moveThumbBasedOnValue(that._drawValue);
                that.$.fireEvent('change', { 'value': that.value, 'oldValue': oldValue });
            }

            if (that.showTooltip) {
                that.$tooltip.addClass('jqx-hidden');
            }

            that._thumbDragged = false;
            that.$track.removeClass('jqx-dragged');
        }

        /**
         * Document select start handler.
         */

    }, {
        key: '_selectStartHandler',
        value: function _selectStartHandler(event) {
            var that = this;

            if (that._thumbDragged) {
                event.preventDefault();
            }
        }

        /**
         * Tank resize event handler.
         */

    }, {
        key: '_resizeHandler',
        value: function _resizeHandler() {
            var that = this;

            if (that._orientationChanged !== true) {
                that._setTicksAndInterval();
                that._moveThumbBasedOnValue(that._drawValue);
            }

            //Needed for getOptimalSize method
            if (that._trackChanged) {
                that._measurements.trackLength = that.$.track[this._settings.clientSize];
                that._numericProcessor.addTicksAndLabels();
                that._moveThumbBasedOnValue(that._drawValue);
            }

            that._setTrackSize();
            delete that._orientationChanged;
            delete that._trackChanged;
        }

        /**
         * Moves the tank's thumb and updates the filled part of the track based on the position of the mouse.
         */

    }, {
        key: '_moveThumbBasedOnCoordinates',
        value: function _moveThumbBasedOnCoordinates(event, checkBoundaries, changeValue) {
            var that = this;
            var coordinate = checkBoundaries ? Math.min(Math.max(event[that._settings.page], that._trackStart), that._trackEnd) : event[that._settings.page],
                value = that._numericProcessor.pxToValue(coordinate);

            if (that.logarithmicScale) {
                value = that._numericProcessor.getCoercedValue(Math.log10(value));
            } else {
                value = that._numericProcessor.getCoercedValue(value);
            }

            // Validating the coordinate
            coordinate = Math.min(Math.max(that._numericProcessor.valueToPx(value) + that._trackStart, that._trackStart), that._trackEnd);

            var size = coordinate - that._trackStart;

            that.updateFillSizeAndPosition(size, that._settings.margin, value, true, changeValue);

            if (event.originalEvent) {
                event.originalEvent.stopPropagation();
            }
        }

        /**
         * Moves the tank's thumb and updates the filled part of the track based on a passed value.
         */

    }, {
        key: '_moveThumbBasedOnValue',
        value: function _moveThumbBasedOnValue(value) {
            var that = this,
                px = that._numericProcessor.valueToPx(that._numericProcessor.getCoercedValue(value));

            that.updateFillSizeAndPosition(px, that._settings.margin, value, true);
        }

        /**
        * Applies the filling, updates the tooltip and the value
        */

    }, {
        key: 'updateFillSizeAndPosition',
        value: function updateFillSizeAndPosition(size, margin, newValue, updateTooltip, changeValue) {
            var that = this,
                fillStyle = that.$.fill.style;

            if (that._normalLayout) {
                fillStyle[that._settings.dimension] = size + 'px';
            } else {
                fillStyle[that._settings.dimension] = Math.min(that._measurements.trackLength, Math.max(0, that._measurements.trackLength - size)) + 'px';
                fillStyle[margin] = size + 'px';
            }

            if (updateTooltip) {
                var oldValue = that.value;

                delete that._valueBeforeCoercion;
                that._numericProcessor.updateToolTipAndValue(newValue, oldValue, changeValue);
            }
        }

        /**
        * Sets tooltip's value.
        */

    }, {
        key: '_updateTooltipValue',
        value: function _updateTooltipValue(value) {
            var that = this;

            if (that.logarithmicScale) {
                value = Math.pow(10, value);
            }

            value = value !== undefined ? that._formatLabel(value) : that.value;
            that.$.tooltipContent.innerHTML = value;
        }

        /**
        * Returns the optimal size, based on tank settings.
        **/

    }, {
        key: '_getSize',
        value: function _getSize(largestLabelSize, properties) {
            var that = this,
                tankStyle = window.getComputedStyle(that),
                trackStyle = window.getComputedStyle(that.$.track),
                trackSize = that._trackSize + parseFloat(trackStyle[properties.marginA]) + parseFloat(trackStyle[properties.marginB]);
            var firstLabel = void 0,
                lastLabel = void 0,
                optimalSize = void 0,
                optimalOtherSize = void 0;

            function calcScaleSize(selector, distance) {
                var labels = selector.getElementsByClassName('jqx-label');

                firstLabel = labels[0];
                lastLabel = labels[labels.length - 1];

                var firstLabelStyle = window.getComputedStyle(labels[0])[distance];

                optimalSize += parseFloat(firstLabelStyle);
            }

            optimalSize = trackSize;
            switch (that.scalePosition) {
                case 'none':
                    optimalSize += parseFloat(tankStyle[properties.paddingA]) + parseFloat(tankStyle[properties.paddingB]);
                    if (typeof that._tankSizeBeforeOrientation !== 'undefined') {
                        optimalOtherSize = that.orientation === 'horizontal' ? that._tankSizeBeforeOrientation.height : that._tankSizeBeforeOrientation.width;
                    } else {
                        optimalOtherSize = that.orientation === 'horizontal' ? parseFloat(trackStyle.width) : parseFloat(trackStyle.height);
                    }
                    if (that._trackChanged !== true) {
                        that._trackChanged = true;
                    }

                    return { optimalSize: optimalSize, optimalOtherSize: optimalOtherSize };
                case 'near':
                    optimalSize += largestLabelSize;
                    calcScaleSize(that.$.scaleNear, properties.nearScaleDistance);
                    break;
                case 'far':
                    optimalSize += largestLabelSize;
                    calcScaleSize(that.$.scaleFar, properties.farScaleDistance);
                    break;
                case 'both':
                    optimalSize += 2 * largestLabelSize;
                    calcScaleSize(that.$.scaleNear, properties.nearScaleDistance);
                    calcScaleSize(that.$.scaleFar, properties.farScaleDistance);
                    break;
            }

            var firstRect = void 0,
                lastRect = void 0,
                difference = void 0;

            optimalSize += parseFloat(tankStyle[properties.paddingA]) + parseFloat(tankStyle[properties.paddingB]);
            firstRect = firstLabel.getBoundingClientRect();
            lastRect = lastLabel.getBoundingClientRect();

            optimalOtherSize = that[properties.offset];

            difference = firstRect[properties.distance] + firstLabel[properties.offset] - lastRect[properties.distance];
            if (difference > 0) {
                optimalOtherSize = firstLabel[properties.offset] + lastLabel[properties.offset];
            }

            return { optimalSize: optimalSize, optimalOtherSize: optimalOtherSize };
        }

        /**
         * Calculates the tank's current value range.
         */

    }, {
        key: '_getRange',
        value: function _getRange() {
            var that = this;

            if (that.logarithmicScale) {
                that._range = that._drawMax - that._drawMin;
                return;
            }
            that._range = new BigNumber(that._drawMax).subtract(new BigNumber(that._drawMin)).toString();
        }

        /**
         * Gets the coordinates of the track and the value per pixel ratio.
         */

    }, {
        key: '_getTrackStartAndEnd',
        value: function _getTrackStartAndEnd() {
            var that = this;
            var trackStart = void 0,
                offset = that.$.track.getBoundingClientRect();

            if (that.orientation === 'horizontal') {
                var scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;
                trackStart = offset.left + scrollLeft;
            } else {
                var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
                trackStart = offset.top + scrollTop;
            }

            var trackEnd = trackStart + that._measurements.trackLength,
                pxRange = trackEnd - trackStart;

            that._trackStart = trackStart;
            that._trackEnd = trackEnd;
            that._valuePerPx = that._numericProcessor.getValuePerPx(that._range, pxRange);
        }

        /**
        * Update scale's width.
        */

    }, {
        key: '_updateScaleWidth',
        value: function _updateScaleWidth(longestLabelSize) {
            var that = this;
            var scaleCoeficient = that.ticksPosition === 'track' ? 4 : 12;

            switch (that.labelsVisibility) {
                case 'all':
                    longestLabelSize = that._numericProcessor._longestLabelSize;
                    break;
                case 'endPoints':
                    longestLabelSize = Math.max(that._tickIntervalHandler.labelsSize.minLabelOtherSize, that._tickIntervalHandler.labelsSize.maxLabelOtherSize);
                    break;
                case 'none':
                    longestLabelSize = 0;
                    break;
            }

            var scaleSize = scaleCoeficient + longestLabelSize,
                variablesUsed = Boolean(window.getComputedStyle(that.$.track).getPropertyValue('--jqx-tank-scale-size'));

            if (variablesUsed) {
                that.$.container.style.setProperty('--jqx-tank-scale-size', scaleSize + 'px');
            } else {
                var computedStyles = window.getComputedStyle(that),
                    scaleNearStyle = that.$.scaleNear.style,
                    scaleFarStyle = that.$.scaleFar.style,
                    trackStyle = that.$.track.style;
                var dimension = void 0,
                    dimension2 = void 0,
                    dimensionValue = void 0,
                    paddings = void 0;

                switch (that.orientation) {
                    case 'horizontal':
                        dimension = 'height';
                        dimension2 = 'width';
                        dimensionValue = that.offsetHeight;
                        paddings = parseFloat(computedStyles.getPropertyValue('padding-top')) + parseFloat(computedStyles.getPropertyValue('padding-bottom'));
                        break;
                    case 'vertical':
                        dimension = 'width';
                        dimension2 = 'height';
                        dimensionValue = that.offsetWidth;
                        paddings = parseFloat(computedStyles.getPropertyValue('padding-left')) + parseFloat(computedStyles.getPropertyValue('padding-right'));
                        break;
                }
                switch (that.scalePosition) {
                    case 'near':
                        scaleNearStyle.setProperty(dimension, scaleSize + 'px');
                        trackStyle.setProperty(dimension, dimensionValue - paddings - scaleSize - 4 + 'px');
                        break;
                    case 'far':
                        scaleFarStyle.setProperty(dimension, scaleSize + 'px');
                        trackStyle.setProperty(dimension, dimensionValue - paddings - scaleSize - 4 + 'px');
                        break;
                    case 'both':
                        scaleNearStyle.setProperty(dimension, scaleSize + 'px');
                        scaleFarStyle.setProperty(dimension, scaleSize + 'px');
                        trackStyle.setProperty(dimension, dimensionValue - paddings - 2 * scaleSize - 4 + 'px');
                        break;
                    case 'none':
                        trackStyle.setProperty(dimension, '');
                        break;
                }

                trackStyle.setProperty(dimension2, '100%');
                scaleNearStyle.setProperty(dimension2, '100%');
                scaleFarStyle.setProperty(dimension2, '100%');
            }
        }

        /**
         * Appends ticks and labels to the scales.
         */

    }, {
        key: '_appendTicksAndLabelsToScales',
        value: function _appendTicksAndLabelsToScales(ticks, labels) {
            var that = this;

            function applyTicksAndLabels(scaleElement) {
                scaleElement.innerHTML = labels;

                if (that.ticksPosition === 'scale') scaleElement.innerHTML += ticks;
            }

            switch (that.scalePosition) {
                case 'near':
                    applyTicksAndLabels(that.$.scaleNear);
                    break;
                case 'far':
                    applyTicksAndLabels(that.$.scaleFar);
                    break;
                case 'both':
                    applyTicksAndLabels(that.$.scaleNear);
                    applyTicksAndLabels(that.$.scaleFar);
                    break;
            }

            if (that.ticksPosition === 'track') {
                that.$.trackTicksContainer.innerHTML = ticks;
            }
        }

        /**
         * Replaces a custom decimal separator with the default one.
         */

    }, {
        key: '_discardDecimalSeparator',
        value: function _discardDecimalSeparator(value, separator) {
            var that = this;

            if (separator === undefined) {
                separator = that.decimalSeparator;
            }

            if (separator !== '.') {
                var decimalSeparatorRegExp = new RegExp(separator, 'g');
                return typeof value === 'string' ? value.replace(decimalSeparatorRegExp, '.') : value.toString().replace(decimalSeparatorRegExp, '.');
            } else {
                return value;
            }
        }

        /**
        * Applies a custom decimal separator.
        */

    }, {
        key: '_applyDecimalSeparator',
        value: function _applyDecimalSeparator(value) {
            var that = this;

            if (typeof value !== 'string') {
                value = value.toString();
            }

            if (that.decimalSeparator !== '.') {
                value = value.replace(/\./g, that.decimalSeparator);
            }

            return value;
        }

        /**
         * Validates the value of the numeric text box.
         */

    }, {
        key: '_validate',
        value: function _validate(initialValidation, programmaticValue, coerced) {
            var that = this;
            var value = void 0;

            if (initialValidation) {
                value = that.value;
            } else {
                value = programmaticValue;
            }

            var actualValue = that._numericProcessor.createDescriptor(value, true, true, false),
                validNumber = that._numericProcessor.validate(actualValue, that._minObject, that._maxObject);

            if (coerced !== true) {
                validNumber = that.logarithmicScale ? that._formatNumber(Math.pow(10, that._numericProcessor.getCoercedValue(Math.log10(validNumber)))) : that._numericProcessor.getCoercedValue(validNumber);
            }

            if (that._numericProcessor.regexScientificNotation.test(validNumber)) {
                validNumber = that._numericProcessor.scientificToDecimal(validNumber);
            }

            validNumber = that._discardDecimalSeparator(validNumber, that.decimalSeparator);

            if (initialValidation) {
                that._number = validNumber;
                that._drawValue = that.logarithmicScale ? Math.log10(validNumber) : validNumber;
                that.value = actualValue.toString();
                delete that._valueBeforeCoercion;
                that._moveThumbBasedOnValue(that._drawValue);
                that._programmaticValueIsSet = false;
            } else {
                that._numericProcessor.updateValue(actualValue);
            }
        }

        /**
         * Changes the input format.
         */

    }, {
        key: '_changeScaleType',
        value: function _changeScaleType() {
            var that = this;

            that._numericProcessor = new JQX.Utilities.NumericProcessor(that, 'scaleType');

            that._validateMinMax('both');

            that._setTicksAndInterval();
            that._scaleTypeChangedFlag = true;
            that._validate(true, that._number.toString());
            that._scaleTypeChangedFlag = false;
        }

        /**
        * Sets new Ticks and Interval 
        */

    }, {
        key: '_setTicksAndInterval',
        value: function _setTicksAndInterval() {
            var that = this;

            //Set the New Format here
            var minLabel = that._formatLabel(that.min),
                maxLabel = that._formatLabel(that.max);

            //gets the range with the new min/max
            that._getRange();

            //creates a new tickIntervalHandler instance
            that._tickIntervalHandler = new JQX.Utilities.TickIntervalHandler(that, minLabel, maxLabel, 'jqx-label', that._settings.size, that.scaleType === 'integer', that.logarithmicScale);

            //re-arranges the layout
            that._layout();

            // calculates the tickInterval
            that._calculateTickInterval();

            // Add the ticks and labels
            that._numericProcessor.addTicksAndLabels();
        }

        /**
        * Sets tab index 
        */

    }, {
        key: '_setTabIndex',
        value: function _setTabIndex() {
            var that = this;

            if (that.disabled || that.readonly) {
                that.removeAttribute('tabindex');
                return;
            }

            var isIE = /*@cc_on!@*/false || !!document.documentMode,
                isEdge = !isIE && !!window.StyleMedia;

            if (!(isIE || isEdge) && that.tabIndex === -1) {
                that.tabIndex = 0;
            } else if ((isIE || isEdge) && that.tabIndex === 0) {
                that.tabIndex = 1;
            }
        }

        /**
         * Increments or decrements a value when a key is pressed.
         */

    }, {
        key: '_keyIncrementDecrement',
        value: function _keyIncrementDecrement(action) {
            var that = this,
                preValue = that.logarithmicScale ? new BigNumber(that._drawValue) : that._drawValue;

            var newValue = that._numericProcessor.incrementDecrement(preValue, action, that._validInterval);
            if (that.logarithmicScale) {
                that._drawValue = newValue;
                newValue = Math.pow(10, Math.round(newValue));
            }
            return newValue;
        }

        /**
        * Tank keydown event handler. Changes the value when user press an arrow, home or end key.
        */

    }, {
        key: '_keydownHandler',
        value: function _keydownHandler(event) {
            var that = this;

            if (that.disabled || that.readonly) {
                return;
            }

            var keyCode = !event.charCode ? event.which : event.charCode,
                handledKeyCodes = [35, 36, 37, 38, 39, 40],
                isIncrementKey = [35, 38, 39].indexOf(keyCode) > -1,
                isDecrementKey = [36, 37, 40].indexOf(keyCode) > -1;
            var newValue = void 0;

            if (that.scaleType === 'floatingPoint') {
                if (parseFloat(that.value) <= parseFloat(that.min) && isDecrementKey || parseFloat(that.value) >= parseFloat(that.max) && isIncrementKey) {
                    return;
                }
            } else {
                var testValue = new BigNumber(that._drawValue);

                if (testValue.compare(that._drawMin) !== 1 && isDecrementKey || testValue.compare(that._drawMax) !== -1 && isIncrementKey) {
                    return;
                }
            }

            if (handledKeyCodes.indexOf(keyCode) > -1) {
                event.preventDefault();

                switch (keyCode) {
                    case 40: //down arrow
                    case 37:
                        //left arrow
                        newValue = that._keyIncrementDecrement('subtract');
                        break;
                    case 38: //top arrow
                    case 39:
                        //right arrow
                        newValue = that._keyIncrementDecrement('add');
                        break;
                    case 36:
                        //home
                        that._drawValue = that._drawMin;
                        newValue = that.min;
                        break;
                    case 35:
                        //end
                        that._drawValue = that._drawMax;
                        newValue = that.max;
                        break;
                }
                that._validate(false, newValue);
                return false;
            }
        }

        /**
        * Sets internal variables, used about scale drawing and preserving the value from initial validation
        **/

    }, {
        key: '_setDrawVariables',
        value: function _setDrawVariables() {
            var that = this;

            if (that.logarithmicScale) {
                that._drawValue = Math.log10(that.value);
                that._drawMin = Math.log10(that.min);
                that._drawMax = Math.log10(that.max);
            } else {
                that._drawValue = that.value;
                that._drawMin = that.min;
                that._drawMax = that.max;
            }
        }

        /**
        * validates values when is used logarithmic scale
        **/

    }, {
        key: '_validateOnLogarithmicScale',
        value: function _validateOnLogarithmicScale(validateMin, validateMax) {
            var that = this;

            function findNearestPowerOfTen(value) {
                return Math.pow(10, Math.round(Math.log10(value) - Math.log10(5.5) + 0.5));
            }

            if (validateMin) {
                if (that.min <= 0) {
                    that.min = 1;
                    that._drawMin = 0;
                } else if (Math.log10(that.min) % 1 !== 0) {
                    var nearestPowerOfTen = findNearestPowerOfTen(parseFloat(that.min));
                    if (nearestPowerOfTen > that.min) {
                        nearestPowerOfTen /= 10;
                    }
                    that._drawMin = Math.log10(that.min);
                } else {
                    that._drawMin = Math.log10(that.min);
                }
            }

            if (validateMax) {
                if (that.max <= 0) {
                    that.max = 1;
                    that._drawMax = 0;
                } else if (Math.log10(that.max) % 1 !== 0) {
                    var _nearestPowerOfTen = findNearestPowerOfTen(parseFloat(that.max));
                    if (_nearestPowerOfTen < that.max) {
                        _nearestPowerOfTen *= 10;
                    }
                    that._drawMax = Math.log10(that.max);
                } else {
                    that._drawMax = Math.log10(that.max);
                }
            }

            if (that.scaleType === 'integer') {
                if (that._drawMin < 0) {
                    that._drawMin = 0;
                    that.min = 1;
                }

                if (that._drawMax < 0) {
                    that._drawMax = 1;
                    that.max = 10;
                }
            }

            if (that._drawMax === that._drawMin) {
                that._drawMax = that._drawMin + 1;
            }
        }

        /**
         * Sets the internal property "_normalLayout" based on the properties "orientation" and "inverted".
         */

    }, {
        key: '_getLayoutType',
        value: function _getLayoutType() {
            var that = this,
                orientation = that.orientation,
                inverted = that.inverted;

            that._normalLayout = orientation === 'horizontal' && !inverted || orientation === 'vertical' && inverted;
        }

        /**
         * Applies a CSS class to change fill's pointer. Used instead of :hover CSS selector.
        **/

    }, {
        key: '_trackOnMouseEnterHandler',
        value: function _trackOnMouseEnterHandler() {
            var that = this;

            if (!that.readonly && !that.disabled) {
                that.$track.addClass('track-hovered');
            }
        }

        /**
         * Removes the CSS class used to change fill's pointer.
        **/

    }, {
        key: '_trackOnMouseLeaveHandler',
        value: function _trackOnMouseLeaveHandler() {
            var that = this;

            if (!that.readonly && !that.disabled) {
                that.$track.removeClass('track-hovered');
            }
        }
    }], [{
        key: 'properties',

        /**
         * Tank's properties.
         */
        get: function get() {
            return {
                'coerce': {
                    value: false,
                    type: 'boolean'
                },
                'decimalSeparator': {
                    value: '.',
                    type: 'string'
                },
                'interval': {
                    value: '1',
                    type: 'any'
                },
                'inverted': {
                    value: false,
                    type: 'boolean'
                },
                'labelFormatFunction': {
                    value: null,
                    type: 'function'
                },
                'labelsVisibility': {
                    value: 'all',
                    allowedValues: ['all', 'endPoints', 'none'],
                    type: 'string'
                },
                'logarithmicScale': {
                    value: false,
                    type: 'boolean'
                },
                'max': {
                    value: '100',
                    type: 'any'
                },
                'mechanicalAction': {
                    value: 'switchWhileDragging',
                    allowedValues: ['switchUntilReleased', 'switchWhenReleased', 'switchWhileDragging'],
                    type: 'string'
                },
                'messages': {
                    value: {
                        'en': {
                            'missingReference': '{{elementType}}: Missing reference to {{files}}.',
                            'significantPrecisionDigits': '{{elementType}}: the properties significantDigits and precisionDigits cannot be set at the same time.',
                            'invalidMinOrMax': '{{elementType}}: Invalid {{property}} value. Max cannot be lower than Min.',
                            'noInteger': '{{elementType}}: precisionDigits could be set only on "floatingPoint" scaleType.'
                        }
                    },
                    type: 'object',
                    extend: true
                },
                'min': {
                    value: '0',
                    type: 'any'
                },
                'orientation': {
                    value: 'vertical',
                    allowedValues: ['horizontal', 'vertical'],
                    type: 'string'
                },
                'precisionDigits': {
                    value: null,
                    type: 'number?'
                },
                'readonly': {
                    value: false,
                    type: 'boolean'
                },
                'scalePosition': {
                    value: 'near',
                    allowedValues: ['near', 'far', 'both', 'none'],
                    type: 'string'
                },
                'scaleType': {
                    value: 'floatingPoint',
                    allowedValues: ['floatingPoint', 'integer'],
                    type: 'string'
                },
                'scientificNotation': {
                    value: false,
                    type: 'boolean'
                },
                'showTooltip': {
                    value: false,
                    type: 'boolean'
                },
                'showUnit': {
                    value: false,
                    type: 'boolean'
                },
                'significantDigits': {
                    value: null,
                    type: 'number?'
                },
                'ticksPosition': {
                    value: 'scale',
                    allowedValues: ['scale', 'track'],
                    type: 'string'
                },
                'ticksVisibility': {
                    value: 'minor',
                    allowedValues: ['major', 'minor', 'none'],
                    type: 'string'
                },
                'tooltipPosition': {
                    value: 'near',
                    allowedValues: ['near', 'far'],
                    type: 'string'
                },
                'unit': {
                    value: 'kg',
                    type: 'string'
                },
                'value': {
                    value: '0',
                    type: 'any'
                },
                'wordLength': {
                    value: 'int32',
                    allowedValues: ['int8', 'uint8', 'int16', 'uint16', 'int32', 'uint32', 'int64', 'uint64'],
                    type: 'string'
                }
            };
        }

        /**
         * Tank's event listeners.
         */

    }, {
        key: 'listeners',
        get: function get() {
            return {
                'track.down': '_trackDownHandler',
                'document.move': '_documentMoveHandler',
                'document.up': '_documentUpHandler',
                'keydown': '_keydownHandler',
                'resize': '_resizeHandler',
                'styleChanged': '_styleChangedHandler',
                'document.selectstart': '_selectStartHandler',
                'track.mouseenter': '_trackOnMouseEnterHandler',
                'track.mouseleave': '_trackOnMouseLeaveHandler'
            };
        }
    }]);
    return Tank;
}(JQX.BaseElement));