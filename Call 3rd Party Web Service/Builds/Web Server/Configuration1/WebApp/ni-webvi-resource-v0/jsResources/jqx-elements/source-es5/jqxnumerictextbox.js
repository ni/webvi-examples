'use strict';

/**
 * Numeric text box custom element.
 */
JQX('jqx-numeric-text-box', function (_JQX$BaseElement) {
    babelHelpers.inherits(NumericTextBox, _JQX$BaseElement);

    function NumericTextBox() {
        babelHelpers.classCallCheck(this, NumericTextBox);
        return babelHelpers.possibleConstructorReturn(this, (NumericTextBox.__proto__ || Object.getPrototypeOf(NumericTextBox)).apply(this, arguments));
    }

    babelHelpers.createClass(NumericTextBox, [{
        key: 'template',


        /**
         * Numeric text box's HTML template.
         */
        value: function template() {
            var template = '<div id="container" class="jqx-container">' + '<div id="radixDisplayButton" class="jqx-unselectable jqx-numeric-text-box-component jqx-numeric-text-box-radix-display"></div>' + '<input id="input" type="text" class="jqx-numeric-text-box-component" placeholder="[[placeholder]]" readonly="[[readonly]]" disabled="[[disabled]]">' + '<div id="unitDisplay" class="jqx-unselectable jqx-numeric-text-box-component jqx-numeric-text-box-unit-display"></div>' + '<div id="spinButtonsContainer" class="jqx-numeric-text-box-component jqx-spin-buttons-container">' + '<jqx-repeat-button initial-delay="0" delay="75" id="upButton" class="jqx-spin-button">' + '<div class="jqx-arrow jqx-arrow-up"></div>' + '</jqx-repeat-button>' + '<jqx-repeat-button initial-delay="0" delay="75" id="downButton" class="jqx-spin-button">' + '<div class="jqx-arrow jqx-arrow-down"></div>' + '</jqx-repeat-button>' + '</div>' + '<ul id="popup" class="jqx-hidden jqx-popup">' + '<li id="popupItem2" class="jqx-list-item" data-value="2"></li>' + '<li id="popupItem8" class="jqx-list-item" data-value="8"></li>' + '<li id="popupItem10" class="jqx-list-item" data-value="10"></li>' + '<li id="popupItem16" class="jqx-list-item" data-value="16"></li>' + '</ul>' + '</div>';

            return template;
        }

        /**
         * Invoked when an instance of custom element is attached to the DOM for the first time.
         */

    }, {
        key: 'ready',
        value: function ready() {
            babelHelpers.get(NumericTextBox.prototype.__proto__ || Object.getPrototypeOf(NumericTextBox.prototype), 'ready', this).call(this);

            var that = this;

            that._checkMissingModules();

            that._numericProcessor = new JQX.Utilities.NumericProcessor(that, 'inputFormat');

            that._radixPrefixes = { 10: 'd', 2: 'b', 8: 'o', 16: 'x' };

            // regular expressions for binary, octal, decimal and hexadecimal numbers
            that._regex = {
                2: new RegExp(/^[0-1]*$/),
                8: new RegExp(/^[0-7]*$/),
                10: new RegExp(/^[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?$/),
                16: new RegExp(/^[0-9a-f]*$/i)
            };
            // regular expressions for special values
            that._regexSpecial = {
                nan: new RegExp(/^(nan)$/i),
                inf: new RegExp(/^-?inf(inity)?$/i),
                nonNumericValue: new RegExp(/^((nan)|(-?inf(inity)?))$/i),
                exaValue: new RegExp(/^[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[E][+\-]\d*)?i$/)
            };

            that._initialPopupOptionsSet = false;

            if (that.spinButtonsPosition === 'left') {
                that.$.container.insertBefore(that.$.spinButtonsContainer, that.$.radixDisplayButton);
            }

            that._setInitialComponentDisplay();

            that._initialAdjustments();

            that._initialized = true;
        }

        /*
         * Public methods
         */

        /**
         * Sets or gets the value of the numeric text box.
         *
         * @param {Number/String} value Optional value to be set to the numeric text box. If this parameter is not set, the method gets the value.
         * @param {Boolean} suppressValidation Optional If true is passed, the value is not validated.
         */

    }, {
        key: 'val',
        value: function val(value, suppressValidation) {
            var that = this,
                isEmptyObject = (typeof value === 'undefined' ? 'undefined' : babelHelpers.typeof(value)) === 'object' && Object.keys(value).length === 0;

            if (value !== undefined && isEmptyObject === false) {
                // use as value setter
                value = value.toString();
                if (value.toUpperCase() !== that.value.toString().toUpperCase()) {
                    if (suppressValidation === undefined) {
                        // sets the value after validation
                        that._validate(false, value);
                    } else {
                        // sets the value without validation
                        that._setValue(value);
                    }

                    that._programmaticValueIsSet = true;
                } else {
                    return value;
                }
            } else {
                // use as value getter
                return that.value;
            }
        }

        /**
         * Focuses the input of the numeric text box.
         */

    }, {
        key: 'focus',
        value: function focus() {
            this.$.input.focus();
        }

        /*
         * Private methods
         */

        /**
         * Throws an error if some necessary modules have not been loaded.
         */

    }, {
        key: '_checkMissingModules',
        value: function _checkMissingModules() {
            var that = this;
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

            try {
                NIComplex;
            } catch (error) {
                missingModules.push('niComplex.js');
            }

            if (missingModules.length > 0) {
                that.error(that.localize('missingReference', { files: missingModules.join(', ') }));
            }
        }

        /**
         * Updates the internal spin buttons step object ("_spinButtonsStepObject").
         */

    }, {
        key: '_updateSpinButtonsStepObject',
        value: function _updateSpinButtonsStepObject() {
            var that = this;
            that._spinButtonsStepObject = that._numericProcessor.createDescriptor(that.spinButtonsStep, true);
        }

        /**
         * Sets the initial display of the various numeric text box components.
         */

    }, {
        key: '_setInitialComponentDisplay',
        value: function _setInitialComponentDisplay() {
            var that = this;

            if (that.spinButtons === false) {
                that.$spinButtonsContainer.addClass('jqx-hidden');
            }

            if (that.radixDisplay === false) {
                that.$radixDisplayButton.addClass('jqx-hidden');
            }

            if (that.showUnit === false) {
                that.$unitDisplay.addClass('jqx-hidden');
            }
        }

        /**
         * Makes initial validations and adjustments to the numeric text box.
         */

    }, {
        key: '_initialAdjustments',
        value: function _initialAdjustments() {
            var that = this;

            that._radixNumber = that._getRadix(that.radix);
            that._wordLengthNumber = that._numericProcessor.getWordLength(that.wordLength);

            that._validatePropertyCompatibility();
            that._numericProcessor.validateMinMax(true, true);

            that._updateSpinButtonsStepObject();

            that._validate(true);
            that._cachedInputValue = that.$.input.value;

            that.$.radixDisplayButton.innerHTML = that._radixPrefixes[that._radixNumber];
            that.$.unitDisplay.innerHTML = that.unit;
        }

        /**
         * Validates some initial non-numeric property values.
         */

    }, {
        key: '_validatePropertyCompatibility',
        value: function _validatePropertyCompatibility() {
            var that = this;

            if (that.inputFormat !== 'integer') {
                if (that._radixNumber !== 10) {
                    that.error(that.localize('integerOnly', { property: 'radix' }));
                }

                if (that.radixDisplay) {
                    that.error(that.localize('integerOnly', { property: 'radixDisplay' }));
                }

                if (that.wordLength !== 'int32') {
                    that.error(that.localize('integerOnly', { property: 'wordLength' }));
                }
            }

            if (that.significantDigits === null && that.precisionDigits === null) {
                that.significantDigits = 8;
            } else if (that.significantDigits !== null && that.precisionDigits !== null) {
                that.error(that.localize('significantPrecisionDigits'));
            }
        }

        /**
         * Validates the value of the numeric text box.
         */

    }, {
        key: '_validate',
        value: function _validate(initialValidation, programmaticValue) {
            var that = this;
            var value = void 0;

            if (initialValidation) {
                value = that.value;
            } else {
                if (programmaticValue === undefined) {
                    value = that.$.input.value;
                    if (value === that.value && that._programmaticValueIsSet !== true) {
                        return;
                    }
                } else {
                    value = programmaticValue;
                }
            }

            var validationOptions = that._numericProcessor.prepareForValidation(initialValidation, programmaticValue, value);
            if (validationOptions === undefined) {
                return;
            }

            var validNumber = that._numericProcessor.createDescriptor(validationOptions.value, true, true, programmaticValue === undefined, initialValidation || programmaticValue !== undefined, validationOptions.enteredComplexNumber);

            if (initialValidation) {
                that._number = validNumber;
                var renderedValue = that._renderValue(validNumber);
                that.value = validNumber.toString();
                that.$.input.value = renderedValue;
            } else {
                that._updateValue(validNumber);
            }

            that._programmaticValueIsSet = false;
        }

        /**
         * Validates the value of the numeric text box when it is not a number.
         */

    }, {
        key: '_handleNonNumericValue',
        value: function _handleNonNumericValue(initialValidation, programmaticValue, value) {
            var that = this;
            if (that.inputFormat !== 'integer') {
                if (that._regexSpecial.nan.test(value)) {
                    // 'NaN' (or a derivative) has been entered
                    that._handleNaN(initialValidation);
                    return;
                }

                if (that._regexSpecial.inf.test(value)) {
                    // '(-)Inf' (or a derivative) has been entered
                    that._handleInfinity(initialValidation, programmaticValue, value);
                    return;
                }
            }

            // invalid input
            if (initialValidation) {
                var defaultValue = that._numericProcessor.createDescriptor(0);
                that._number = that._validateRange(defaultValue);
                var defaultValidValue = that._renderValue(that._number);
                that.value = that._number.toString();
                that.$.input.value = defaultValidValue;
            } else {
                // the old value is reverted
                if (programmaticValue === undefined) {
                    that.$.input.value = that._cachedInputValue;
                } else {
                    var correctValue = that._number.toString();
                    if (that.value !== correctValue) {
                        that.value = correctValue;
                    }
                }
            }
        }

        /**
         * Handles NaN (or derivative) entered value.
         */

    }, {
        key: '_handleNaN',
        value: function _handleNaN(initialValidation) {
            var that = this;

            that.$.input.value = 'NaN';

            if (initialValidation) {
                that.value = NaN;
                that._number = NaN;
            } else {
                var oldValue = that.value;

                if (oldValue.toString() !== 'NaN') {
                    that.value = NaN;
                    that._number = NaN;

                    that._cachedInputValue = 'NaN';
                    if (that._triggerChangeEvent) {
                        that.$.fireEvent('change', { 'value': NaN, 'oldValue': oldValue, 'radix': that._radixNumber });
                    }
                }
            }
        }

        /**
         * Handles (-)Infinity (or derivative) entered value.
         */

    }, {
        key: '_handleInfinity',
        value: function _handleInfinity(initialValidation, programmaticValue, value) {
            var that = this;
            var newInputValue = void 0,
                newValue = void 0;
            if (value.charAt(0) === '-') {
                newInputValue = '-Inf';
                newValue = -Infinity;
            } else {
                newInputValue = 'Inf';
                newValue = Infinity;
            }

            if (newInputValue === '-Inf' && that.min === -Infinity || newInputValue === 'Inf' && that.max === Infinity || programmaticValue !== undefined) {
                if (initialValidation) {
                    that.value = newValue;
                    that._number = newValue;
                    that.$.input.value = newInputValue;
                } else {
                    var oldValue = that.value;
                    if (value !== newInputValue) {
                        that.$.input.value = newInputValue;
                    }

                    if (oldValue !== newValue) {
                        that.value = newValue;
                        that._number = newValue;

                        that._cachedInputValue = newInputValue;
                        if (that._triggerChangeEvent) {
                            that.$.fireEvent('change', { 'value': newValue, 'oldValue': oldValue, 'radix': that._radixNumber });
                        }
                    }
                }
            } else {
                // if -Infinity/Infinity is out of the "min"-"max" range, the value is set to "min"/"max" instead
                if (newInputValue === '-Inf') {
                    that._validate(false, that.min);
                } else {
                    that._validate(false, that.max);
                }
            }
        }

        /**
         * Checks if the value is within the range from min to max.
         */

    }, {
        key: '_validateRange',
        value: function _validateRange(numberToValidate) {
            var that = this;
            numberToValidate = that._numericProcessor.validate(numberToValidate, that._minObject, that._maxObject);
            return numberToValidate;
        }

        /**
         * Invoked when the value of a public property has been changed by the user.
         */

    }, {
        key: 'propertyChangedHandler',
        value: function propertyChangedHandler(key, oldValue, value) {
            babelHelpers.get(NumericTextBox.prototype.__proto__ || Object.getPrototypeOf(NumericTextBox.prototype), 'propertyChangedHandler', this).call(this, key, oldValue, value);

            var that = this,
                input = that.$.input;

            // eslint-disable-next-line
            if (value != oldValue) {
                switch (key) {
                    case 'enableMouseWheelAction':
                    case 'disabled':
                    case 'placeholder':
                    case 'readonly':
                        break;
                    case 'value':
                        {
                            var stringValue = value.toString(),
                                stringOldValue = oldValue.toString();

                            if (stringOldValue !== stringValue) {
                                if (stringOldValue.toUpperCase() === stringValue.toUpperCase()) {
                                    that.value = oldValue;
                                }

                                that._validate(false, stringValue);
                                that._programmaticValueIsSet = true;
                            }
                            break;
                        }
                    case 'radix':
                        if (that.inputFormat === 'integer') {
                            that._changeRadix(value);
                        } else {
                            that.error(that.localize('integerOnly', { property: 'radix' }));
                        }
                        break;
                    case 'min':
                    case 'max':
                        {
                            if (value !== null) {
                                that['_' + key + 'IsNull'] = false;
                            }
                            that._numericProcessor.validateMinMax(key === 'min', key === 'max');
                            if (that._regexSpecial.nonNumericValue.test(that.value) === false) {
                                var numberToValidate = that._numericProcessor.createDescriptor(that._number),
                                    validValue = that._validateRange(numberToValidate);
                                that._updateValue(validValue);
                            }
                            break;
                        }
                    case 'spinButtons':
                        if (value) {
                            that.$spinButtonsContainer.removeClass('jqx-hidden');
                        } else {
                            that.$spinButtonsContainer.addClass('jqx-hidden');
                        }
                        break;
                    case 'spinButtonsStep':
                        that._updateSpinButtonsStepObject();
                        break;
                    case 'significantDigits':
                    case 'precisionDigits':
                        {
                            if (key === 'precisionDigits' && that.inputFormat === 'integer') {
                                that.error(that.localize('noInteger', { property: key }));
                            }

                            if (key === 'significantDigits' && that.precisionDigits !== null) {
                                that.precisionDigits = null;
                            } else if (key === 'precisionDigits' && that.significantDigits !== null) {
                                that.significantDigits = null;
                            }

                            var renderedValue = that._renderValue(that._number);
                            input.value = renderedValue;
                            break;
                        }
                    case 'decimalSeparator':
                        {
                            var numericValue = that._discardDecimalSeparator(input.value, oldValue),
                                valueWithNewSeparator = that._applyDecimalSeparator(numericValue);

                            input.value = valueWithNewSeparator;
                            break;
                        }
                    case 'spinButtonsPosition':
                        if (value === 'left') {
                            that.$.container.insertBefore(that.$.spinButtonsContainer, that.$.radixDisplayButton);
                        } else {
                            that.$.container.insertBefore(that.$.spinButtonsContainer, that.$.popup);
                        }
                        break;
                    case 'wordLength':
                        that._wordLengthNumber = that._numericProcessor.getWordLength(value);

                        if (that.inputFormat === 'integer') {
                            that._numericProcessor.validateMinMax(true, true);
                            if (that._regexSpecial.nonNumericValue.test(that.value) === false) {
                                var _validValue = that._validateRange(new BigNumber(that._number));
                                that._updateValue(_validValue);
                            }
                        }
                        break;
                    case 'radixDisplay':
                        if (value) {
                            if (that.inputFormat !== 'integer') {
                                that.error(that.localize('integerOnly', { property: 'radixDisplay' }));
                            }

                            that.$radixDisplayButton.removeClass('jqx-hidden');
                        } else {
                            that.$radixDisplayButton.addClass('jqx-hidden');
                        }
                        break;
                    case 'inputFormat':
                        that._changeInputFormat(oldValue, value);
                        break;
                    case 'showUnit':
                        if (value) {
                            that.$unitDisplay.removeClass('jqx-hidden');
                        } else {
                            that.$unitDisplay.addClass('jqx-hidden');
                        }
                        break;
                    case 'unit':
                        that.$.unitDisplay.innerHTML = value;
                        break;
                    case 'scientificNotation':
                        {
                            var _renderedValue = that._renderValue(that._number);
                            input.value = _renderedValue;

                            break;
                        }
                    case 'language':
                    case 'messages':
                        that._initialPopupOptionsSet = false;
                        break;
                }
            } else if (typeof value !== 'string' && typeof oldValue === 'string') {
                that[key] = oldValue;
            }
            that._cachedInputValue = input.value;
        }

        /**
         * Changes the input format.
         */

    }, {
        key: '_changeInputFormat',
        value: function _changeInputFormat(oldFormat, newFormat) {
            var that = this;

            that._numericProcessor = new JQX.Utilities.NumericProcessor(that, 'inputFormat');

            if (oldFormat === 'complex') {
                // 'complex' -> 'integer'/'floatingPoint'
                that._changeFromComplexInputFormat(newFormat);
                return;
            }

            if (newFormat === 'integer' && oldFormat === 'floatingPoint') {
                // 'floatingPoint' -> 'integer'
                that._changeFromIntegerToFloatingPointInputFormat();
            }

            if (newFormat === 'floatingPoint' && oldFormat === 'integer') {
                // 'integer' -> 'floatingPoint'
                that._changeFromFloatingPointToIntegerInputFormat();
            }

            if (newFormat === 'complex') {
                // 'integer'/'floatingPoint' -> 'complex'
                that._changeToComplexInputFormat(oldFormat);
            }

            that._updateSpinButtonsStepObject();
            that._inputFormatChangedFlag = true;
            that._validate(undefined, that._number.toString());
            that._inputFormatChangedFlag = false;
        }

        /**
         * Changes the input format from 'complex' to 'integer' or 'floatingPoint'.
         */

    }, {
        key: '_changeFromComplexInputFormat',
        value: function _changeFromComplexInputFormat(newFormat) {
            var that = this;
            that.spinButtonsStep = that._spinButtonsStepObject.realPart;
            that._updateSpinButtonsStepObject();

            if (newFormat === 'integer') {
                if (that.min === -Infinity) {
                    that.min = null;
                } else {
                    that.min = that._minObject.realPart;
                }
                if (that.max === Infinity) {
                    that.max = null;
                } else {
                    that.min = that._maxObject.realPart;
                }
            } else {
                if (that.min !== -Infinity) {
                    that.min = that._minObject.realPart;
                }
                if (that.max !== Infinity) {
                    that.max = that._maxObject.realPart;
                }
            }
            that._numericProcessor.validateMinMax(true, true);

            that._inputFormatChangedFlag = true;
            that._validate(undefined, that._number.realPart.toString());
            that._inputFormatChangedFlag = false;
        }

        /**
         * Changes the input format from 'integer' to 'floatingPoint'.
         */

    }, {
        key: '_changeFromIntegerToFloatingPointInputFormat',
        value: function _changeFromIntegerToFloatingPointInputFormat() {
            var that = this;
            if (that.min === -Infinity) {
                that.min = null;
            }
            if (that.max === Infinity) {
                that.max = null;
            }
            that._numericProcessor.validateMinMax(true, true);
        }

        /**
         * Changes the input format from 'floatingPoint' to 'integer'.
         */

    }, {
        key: '_changeFromFloatingPointToIntegerInputFormat',
        value: function _changeFromFloatingPointToIntegerInputFormat() {
            var that = this;
            if (that.radixDisplay) {
                that.radixDisplay = false;
                that.$radixDisplayButton.addClass('jqx-hidden');
            }

            if (that._radixNumber !== 10) {
                that.radix = 10;
                that._radixNumber = 10;
            }

            if (that._minIsNull) {
                that.min = -Infinity;
                that._minObject = -Infinity;
            } else {
                that._minObject = parseFloat(that._minObject.toString());
            }

            if (that._maxIsNull) {
                that.max = Infinity;
                that._maxObject = Infinity;
            } else {
                that._maxObject = parseFloat(that._maxObject.toString());
            }
        }

        /**
         * Changes the input format from 'integer' to 'floatingPoint'.
         */

    }, {
        key: '_changeToComplexInputFormat',
        value: function _changeToComplexInputFormat(oldFormat) {
            var that = this;
            if (oldFormat === 'integer') {
                if (that.radixDisplay) {
                    that.radixDisplay = false;
                    that.$radixDisplayButton.addClass('jqx-hidden');
                }

                if (that._minIsNull) {
                    that.min = null;
                }
                if (that._maxIsNull) {
                    that.max = null;
                }
            }

            that._numericProcessor.validateMinMax(that.min !== -Infinity, that.max !== Infinity);
        }

        /**
         * Updates the value of the numeric text box input and the "value" property and triggers the respective events.
         */

    }, {
        key: '_updateValue',
        value: function _updateValue(value) {
            var that = this,
                enteredValue = that.$.input.value,
                newValue = value.toString(that._radixNumber, that._wordLengthNumber);

            if (enteredValue !== newValue || enteredValue !== that._cachedInputValue) {
                var renderedValue = that._renderValue(value),
                    oldValue = that.value,
                    newValueIsNotNumeric = that._regexSpecial.nonNumericValue.test(newValue);

                that.$.input.value = renderedValue;
                that._cachedInputValue = renderedValue;

                if (newValueIsNotNumeric && renderedValue !== oldValue || newValueIsNotNumeric === false && that._numericProcessor.compare(value, that._number) || that._inputFormatChangedFlag) {
                    that._number = that._numericProcessor.createDescriptor(value);

                    var actualNewValue = that._number.toString();
                    that.value = actualNewValue;

                    that._setPopupOptions();

                    if (that._triggerChangeEvent) {
                        that.$.fireEvent('change', { 'value': actualNewValue, 'oldValue': oldValue, 'radix': that._radixNumber });
                    }
                }
            }
        }

        /**
         * Sets a decimal numeric value to the numeric text box without any validation.
         */

    }, {
        key: '_setValue',
        value: function _setValue(value) {
            var that = this;

            that.value = value;
            that.$.input.value = value;

            that._number = that._numericProcessor.createDescriptor(value, true);

            that._setPopupOptions();
        }

        /**
         * Changes the radix (numeral system).
         */

    }, {
        key: '_changeRadix',
        value: function _changeRadix(radix) {
            var that = this,
                newRadix = that._getRadix(radix),
                oldRadix = that.radix;

            if (newRadix === that._radixNumber) {
                return;
            }

            that.radix = radix;
            that._radixNumber = newRadix;

            var input = that.$.input,
                oldValue = input.value,
                newValue = that._number.toString(newRadix, that._wordLengthNumber),
                renderedValue = that._renderValue(newValue);

            input.value = renderedValue;

            that.$.radixDisplayButton.innerHTML = that._radixPrefixes[newRadix];

            that.$.fireEvent('radixChange', { 'radix': radix, 'oldRadix': oldRadix, 'displayedValue': renderedValue, 'oldDisplayedValue': oldValue });
        }

        /**
         * Opens the radix selection drop down.
         */

    }, {
        key: '_openRadix',
        value: function _openRadix() {
            var that = this;

            if (that.radixDisplay === false) {
                return;
            }

            if (that._initialPopupOptionsSet === false) {
                that._setPopupOptions();
                that._initialPopupOptionsSet = true;
            }

            that.$radixDisplayButton.addClass('jqx-numeric-text-box-pressed-component');
            that.$popup.addClass('jqx-shown');

            that._opened = true;
            that.$.fireEvent('open', { popup: that.$.popup });
        }

        /**
         * Closes the radix selection drop down.
         */

    }, {
        key: '_closeRadix',
        value: function _closeRadix() {
            var that = this;

            if (that.radixDisplay === false) {
                return;
            }

            that.$radixDisplayButton.removeClass('jqx-numeric-text-box-pressed-component');
            that.$popup.removeClass('jqx-shown');

            that._opened = false;
            that.$.fireEvent('close', { popup: that.$.popup });
        }

        /**
         * Checks if left button is pressed.
         */

    }, {
        key: '_isLeftButtonPressed',
        value: function _isLeftButtonPressed(event) {
            var buttons = event.buttons === 0 || event.which === 1;

            return event.detail.buttons === 1 || buttons;
        }

        /**
         * Checks if incrementation and decrementation are allowed
         */

    }, {
        key: '_isIncrementOrDecrementAllowed',
        value: function _isIncrementOrDecrementAllowed() {
            var that = this;

            return !that.disabled && !that.readonly && that._regexSpecial.nonNumericValue.test(that.$.input.value) === false;
        }

        /**
         * Up button mousedown event handler.
         */

    }, {
        key: '_upButtonClickHandler',
        value: function _upButtonClickHandler(event) {
            var that = this,
                isLeftButton = that._isLeftButtonPressed(event);

            if (isLeftButton && that._isIncrementOrDecrementAllowed()) {
                that.$upButton.addClass('jqx-numeric-text-box-pressed-component');
                that._incrementOrDecrement('add');
            }
        }

        /**
         * Down button mousedown event handler.
         */

    }, {
        key: '_downButtonClickHandler',
        value: function _downButtonClickHandler(event) {
            var that = this,
                isLeftButton = that._isLeftButtonPressed(event);

            if (isLeftButton && that._isIncrementOrDecrementAllowed()) {
                that.$downButton.addClass('jqx-numeric-text-box-pressed-component');
                that._incrementOrDecrement('subtract');
            }
        }

        /**
         * Document mousedown event handler.
         */

    }, {
        key: '_documentMousedownHandler',
        value: function _documentMousedownHandler(event) {
            var that = this;
            if (that._opened && !that.contains(event.target)) {
                that._closeRadix();
            }
        }

        /**
         * Document mouseup event handler.
         */

    }, {
        key: '_documentMouseupHandler',
        value: function _documentMouseupHandler() {
            var that = this;

            that.$upButton.removeClass('jqx-numeric-text-box-pressed-component');
            that.$downButton.removeClass('jqx-numeric-text-box-pressed-component');
        }

        /**
         * Radix display button click event handler.
         */

    }, {
        key: '_radixDisplayButtonClickHandler',
        value: function _radixDisplayButtonClickHandler() {
            var that = this;
            if (that.popupEnabled && !that.disabled) {
                if (that._opened) {
                    that._closeRadix();
                } else {
                    that._openRadix();
                }
            }
        }

        /**
         * Pop-up item click event handler.
         */

    }, {
        key: '_popupItemClickHandler',
        value: function _popupItemClickHandler(event) {
            if (event.target.classList.contains('jqx-list-item')) {
                var that = this;
                var radix = event.target.getAttribute('data-value');

                that._changeRadix(parseInt(radix, 10));
                that._closeRadix();
            }
        }

        /**
         * Spin button, radix display button and pop-up item mouseenter and mouseleave event handler.
         */

    }, {
        key: '_mouseenterMouseleaveHandler',
        value: function _mouseenterMouseleaveHandler(event) {
            var that = this,
                fn = event.type === 'mouseenter' || event.type === 'mouseover' ? 'addClass' : 'removeClass';

            if (event.target === that.$.popup || that.disabled || that.readonly) {
                return;
            }

            event.target.$[fn]('hovered');
        }

        /**
         * Input keydown event handler.
         */

    }, {
        key: '_inputKeydownHandler',
        value: function _inputKeydownHandler(e) {
            var that = this,
                keyCode = !e.charCode ? e.which : e.charCode;

            if (keyCode === 40 && that._isIncrementOrDecrementAllowed()) {
                // decrement when Down Arrow is pressed
                that._incrementOrDecrement('subtract');
            } else if (keyCode === 38 && that._isIncrementOrDecrementAllowed()) {
                // increment when Up Arrow is pressed
                that._incrementOrDecrement('add');
            }
        }

        /**
         * Input keyup event handler.
         */

    }, {
        key: '_inputKeyupHandler',
        value: function _inputKeyupHandler(event) {
            var that = this;

            if (event.keyCode === 13) {
                // when Enter is pressed, validation occurs
                that._triggerChangeEvent = true;
                that._validate();
                that._triggerChangeEvent = false;
                that.$.input.blur();
            } else if (event.keyCode === 27) {
                // when Escape is pressed, changes are discarded
                that.$.input.value = that._cachedInputValue;
            }

            event.stopPropagation();
            event.preventDefault();
        }

        /**
         * Input blur event handler.
         */

    }, {
        key: '_inputBlurHandler',
        value: function _inputBlurHandler() {
            var that = this;

            if (that._suppressBlurEvent === true) {
                // suppresses validation because it was already handled in "_incrementOrDecrement" function
                that._suppressBlurEvent = false;
            } else {
                that._triggerChangeEvent = true;
                that._validate();
                that._triggerChangeEvent = false;
            }

            if (that.radixDisplay) {
                that.$radixDisplayButton.removeClass('jqx-numeric-text-box-focused-component');
            }

            if (that._opened) {
                that._closeRadix();
            }

            if (that.spinButtons) {
                that.$spinButtonsContainer.removeClass('jqx-numeric-text-box-focused-component');
            }
            if (that.showUnit) {
                that.$unitDisplay.removeClass('jqx-numeric-text-box-focused-component');
            }
        }

        /**
         * Input focus event handler.
         */

    }, {
        key: '_inputFocusHandler',
        value: function _inputFocusHandler() {
            var that = this;

            if (that.spinButtons) {
                that.$spinButtonsContainer.addClass('jqx-numeric-text-box-focused-component');
            }
            if (that.radixDisplay) {
                that.$radixDisplayButton.addClass('jqx-numeric-text-box-focused-component');
            }
            if (that.showUnit) {
                that.$unitDisplay.addClass('jqx-numeric-text-box-focused-component');
            }

            if (that._opened) {
                that._closeRadix();
            }
        }

        /**
         * Input change event handler.
         */

    }, {
        key: '_inputChangeHandler',
        value: function _inputChangeHandler(event) {
            event.stopPropagation();
            event.preventDefault();
        }

        /**
         * Input mousewheel event handler.
         */

    }, {
        key: '_inputMousewheelHandler',
        value: function _inputMousewheelHandler(event) {
            var that = this;

            if (that.$.input === document.activeElement && that.enableMouseWheelAction && that._isIncrementOrDecrementAllowed()) {
                event.stopPropagation();
                event.preventDefault();
                if (event.wheelDelta > 0) {
                    that._incrementOrDecrement('add');
                } else {
                    that._incrementOrDecrement('subtract');
                }
            }
        }

        /**
         * Gets the internal numeric radix based on the "radix" property.
         */

    }, {
        key: '_getRadix',
        value: function _getRadix(radix) {
            switch (radix.toString()) {
                case '10':
                case 'decimal':
                    return 10;
                case '2':
                case 'binary':
                    return 2;
                case '8':
                case 'octal':
                    return 8;
                case '16':
                case 'hexadecimal':
                    return 16;
            }
        }

        /**
         * Sets the pop-up list radix options.
         */

    }, {
        key: '_setPopupOptions',
        value: function _setPopupOptions() {
            var that = this;

            if (that.radixDisplay === false) {
                return;
            }

            var wordLength = that._wordLengthNumber;

            that.$.popupItem2.innerHTML = that._number.toString(2, wordLength) + ' (' + that.localize('binary') + ')';
            that.$.popupItem8.innerHTML = that._number.toString(8, wordLength) + ' (' + that.localize('octal') + ')';
            that.$.popupItem10.innerHTML = that._renderValue(that._number.toString(10, wordLength), true) + ' (' + that.localize('decimal') + ')';
            that.$.popupItem16.innerHTML = that._number.toString(16, wordLength) + ' (' + that.localize('hexadecimal') + ')';
        }

        /**
         * Increments or decrements the number in the numeric text box input.
         */

    }, {
        key: '_incrementOrDecrement',
        value: function _incrementOrDecrement(func) {
            var that = this;

            if (that.$.input === document.activeElement) {
                that._suppressBlurEvent = true;
            }

            if (that.$.input.value !== that._cachedInputValue || that._programmaticValueIsSet) {
                // validates the value before incrementing or decrementing
                that._triggerChangeEvent = true;
                that._validate();
                that._triggerChangeEvent = false;
                if (that._isIncrementOrDecrementAllowed() === false) {
                    return;
                }
            }

            var currentNumber = that._numericProcessor.incrementDecrement(that._number, func, that._spinButtonsStepObject),
                validNumber = that._validateRange(currentNumber);
            that._triggerChangeEvent = true;
            that._updateValue(validNumber);
            that._triggerChangeEvent = false;
        }

        /**
         * Returns a BigNumber object from a binary, octal, decimal or hexadecimal value.
         */

    }, {
        key: '_toBigNumberDecimal',
        value: function _toBigNumberDecimal(number, radix) {
            var that = this;
            var result = void 0;

            if (radix === 10) {
                result = new BigNumber(number);
            } else {
                if (that._isNegative(number, radix) === false) {
                    if (that._wordLengthNumber < 64) {
                        result = parseInt(number, radix);
                        result = new BigNumber(result);
                    } else {
                        result = that._getBigNumberFrom64BitBinOctHex(number, radix);
                    }
                } else {
                    result = that._getNegativeDecimal(number, radix);
                    result = new BigNumber(result);
                }
            }
            return result;
        }

        /**
         * Checks if the passed binary, octal or hexadecimal value is negative based on the word length.
         */

    }, {
        key: '_isNegative',
        value: function _isNegative(value, radix) {
            var that = this,
                valueLength = value.length,
                firstCharacter = value.charAt(0).toLowerCase();

            if (radix === 2) {
                return valueLength === that._wordLengthNumber && firstCharacter === '1';
            } else if (radix === 8) {
                switch (that._wordLengthNumber) {
                    case 8:
                        return valueLength === 3 && (firstCharacter === '2' || firstCharacter === '3');
                    case 16:
                        return valueLength === 5 && firstCharacter === '1';
                    case 32:
                        return valueLength === 11 && (firstCharacter === '2' || firstCharacter === '3');
                    case 64:
                        return valueLength === 22 && firstCharacter === '1';
                }
            } else {
                return valueLength === that._wordLengthNumber / 4 && ['8', '9', 'a', 'b', 'c', 'd', 'e', 'f'].indexOf(firstCharacter) !== -1;
            }
        }

        /**
         * Returns a BigNumber object from a positive binary, octal or hexadecimal value.
         */

    }, {
        key: '_getBigNumberFrom64BitBinOctHex',
        value: function _getBigNumberFrom64BitBinOctHex(number, radix) {
            var result = new BigNumber(0);
            for (var i = number.length - 1; i >= 0; i--) {
                var current = new BigNumber(parseInt(number.charAt(i), radix));
                result = result.add(current.multiply(new BigNumber(radix).pow(number.length - 1 - i)));
            }
            return result;
        }

        /**
         * Returns a BigNumber object from a negative binary, octal or hexadecimal value.
         */

    }, {
        key: '_getNegativeDecimal',
        value: function _getNegativeDecimal(value, radix) {
            var that = this;
            var negativeBinary = value;

            if (radix === 8) {
                var threeBits = [];
                for (var i = 0; i < value.length; i++) {
                    var threeBit = parseInt(value.charAt(i), 8).toString(2);
                    while (threeBit.length !== 3) {
                        threeBit = '0' + threeBit;
                    }
                    threeBits.push(threeBit);
                }
                negativeBinary = threeBits.join('');
                while (negativeBinary.charAt(0) === '0') {
                    negativeBinary = negativeBinary.slice(1);
                }
            } else if (radix === 16) {
                var bytes = [];
                for (var j = 0; j < value.length; j++) {
                    var currentByte = parseInt(value.charAt(j), 16).toString(2);
                    while (currentByte.length !== 4) {
                        currentByte = '0' + currentByte;
                    }
                    bytes.push(currentByte);
                }
                negativeBinary = bytes.join('');
            }

            var negativeDecimal = negativeBinary.replace(/0/g, 'a');
            negativeDecimal = negativeDecimal.replace(/1/g, 'b');
            negativeDecimal = negativeDecimal.replace(/a/g, '1');
            negativeDecimal = negativeDecimal.replace(/b/g, '0');

            if (this._wordLengthNumber < 64) {
                negativeDecimal = (parseInt(negativeDecimal, 2) + 1) * -1;
            } else {
                negativeDecimal = that._getBigNumberFrom64BitBinOctHex(negativeDecimal, radix);
                negativeDecimal = negativeDecimal.add(1).negate();
            }

            return negativeDecimal;
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

            if (separator !== '.' && value !== Infinity && value !== -Infinity) {
                var decimalSeparatorRegExp = new RegExp(separator, 'g');
                return value.replace(decimalSeparatorRegExp, '.');
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
         * Applies the scientific notation, significant digits, precision digits and decimal separator settings.
         */

    }, {
        key: '_renderValue',
        value: function _renderValue(renderedValue, ignoreRadixNumber) {
            var that = this;

            ignoreRadixNumber = that._radixNumber === 10 || ignoreRadixNumber === true;

            renderedValue = that._numericProcessor.render(renderedValue, ignoreRadixNumber);

            // decimal separator
            if (that.decimalSeparator !== '.' && ignoreRadixNumber) {
                renderedValue = that._applyDecimalSeparator(renderedValue);
            }

            return renderedValue;
        }
    }], [{
        key: 'properties',

        /**
         * Numeric text box's properties.
         */
        get: function get() {
            return {
                'decimalSeparator': {
                    value: '.',
                    type: 'string'
                },
                'enableMouseWheelAction': {
                    value: false,
                    type: 'boolean'
                },
                'inputFormat': {
                    value: 'integer',
                    allowedValues: ['integer', 'floatingPoint', 'complex'],
                    type: 'string'
                },
                'max': {
                    value: null,
                    type: 'any'
                },
                'messages': {
                    value: {
                        'en': {
                            'binary': 'BIN',
                            'octal': 'OCT',
                            'decimal': 'DEC',
                            'hexadecimal': 'HEX',
                            'missingReference': 'jqxNumericTextBox: Missing reference to {{files}}.',
                            'integerOnly': 'jqxNumericTextBox: The property {{property}} can only be set when inputFormat is integer.',
                            'noInteger': 'jqxNumericTextBox: the property {{property}} cannot be set when inputFormat is integer.',
                            'significantPrecisionDigits': 'jqxNumericTextBox: the properties significantDigits and precisionDigits cannot be set at the same time.'
                        }
                    },
                    type: 'object',
                    extend: true
                },
                'min': {
                    value: null,
                    type: 'any'
                },
                'placeholder': {
                    value: '',
                    type: 'string'
                },
                'popupEnabled': {
                    value: false,
                    type: 'boolean'
                },
                'precisionDigits': {
                    value: null,
                    type: 'number?'
                },
                'radix': {
                    value: 10,
                    allowedValues: [2, 8, 10, 16, 'binary', 'octal', 'decimal', 'hexadecimal'],
                    type: 'any'
                },
                'radixDisplay': {
                    value: false,
                    type: 'boolean'
                },
                'readonly': {
                    value: false,
                    type: 'boolean'
                },
                'scientificNotation': {
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
                'spinButtons': {
                    value: false,
                    type: 'boolean'
                },
                'spinButtonsPosition': {
                    value: 'right',
                    allowedValues: ['left', 'right'],
                    type: 'string'
                },
                'spinButtonsStep': {
                    value: '1',
                    type: 'any'
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
         * Numeric text box's event listeners.
         */

    }, {
        key: 'listeners',
        get: function get() {
            return {
                'input.focus': '_inputFocusHandler',
                'input.blur': '_inputBlurHandler',
                'input.keydown': '_inputKeydownHandler',
                'input.keyup': '_inputKeyupHandler',
                'input.change': '_inputChangeHandler',
                'input.mousewheel': '_inputMousewheelHandler',
                'upButton.click': '_upButtonClickHandler',
                'upButton.mouseenter': '_mouseenterMouseleaveHandler',
                'upButton.mouseleave': '_mouseenterMouseleaveHandler',
                'downButton.click': '_downButtonClickHandler',
                'downButton.mouseenter': '_mouseenterMouseleaveHandler',
                'downButton.mouseleave': '_mouseenterMouseleaveHandler',
                'document.mousedown': '_documentMousedownHandler',
                'document.mouseup': '_documentMouseupHandler',
                'popup.click': '_popupItemClickHandler',
                'popup.mouseover': '_mouseenterMouseleaveHandler',
                'popup.mouseout': '_mouseenterMouseleaveHandler',
                'radixDisplayButton.click': '_radixDisplayButtonClickHandler',
                'radixDisplayButton.mouseenter': '_mouseenterMouseleaveHandler',
                'radixDisplayButton.mouseleave': '_mouseenterMouseleaveHandler'
            };
        }
    }]);
    return NumericTextBox;
}(JQX.BaseElement));