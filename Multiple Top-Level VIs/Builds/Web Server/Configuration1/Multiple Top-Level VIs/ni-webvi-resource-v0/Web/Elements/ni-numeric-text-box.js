//****************************************
//Numeric TextBox Prototype
// DOM Registration: HTMLNumericTextBox
// National Instruments Copyright 2014
//****************************************

// Constructor Function: Empty (Not Invoked)
NationalInstruments.HtmlVI.Elements.NumericTextBox = function () {
    'use strict';
};

// Static Public Variables
// None

// Static Public Functions

// NationalInstruments.HtmlVI.Elements.NumericTextBox.ValidateInputValue(config, valueAsString)
// (Returns valueAsString if it's valid, otherwise returns config.value as a string)
// valueAsString: The string value to validate (representing a numeric)
// config: { value, minimum, maximum, valueType }
//   value, minimum, maximum are in the format { numberValue: x, stringValue: y } (same as for the element)
// Note: This function is only meant to plug the gaps in the validation that the jqx controls have, not to be
// a full implementation of numeric validation. For example, the jqx control will make sure a Double value
// is coerced to be in-range of its min and max, so that's not checked here.
NationalInstruments.HtmlVI.Elements.NumericTextBox.ValidateInputValue =
    (function () {
        'use strict';

        var NUM_VAL_CONVERTER = NationalInstruments.HtmlVI.ValueConverters.NumericValueConverter;
        var NUM_HELPERS = NationalInstruments.HtmlVI.NINumerics.Helpers;

        var validateNumberValue = function (config, numberValue) {
            var validNumberValue = numberValue;
            if (isNaN(numberValue)) {
                // This means that jqref sent a value that is actually not a number.
                // So we revert to previous value.
                validNumberValue = config.value.numberValue;
            }

            // Finally if it isn't a float, we should round the number.
            if (NUM_HELPERS.isFloat(config.valueType) === false) {
                validNumberValue = Math.round(validNumberValue);
            }

            return validNumberValue;
        };

        var validateStringValue = function (config, stringValue) {
            var validStringValue = stringValue;
            var temp, int64min, int64max;

            if (NUM_HELPERS.is64BitInt(config.valueType) === true) {
                temp = new BigNumber(stringValue);
                int64min = new BigNumber(config.minimum.stringValue);
                int64max = new BigNumber(config.maximum.stringValue);
                if (temp.toString() === '0' && stringValue !== '0') {
                    // This BigNumber implementation doesn't throw errors if you enter text or empty string, it sets the value to 0
                    // So anytime we get 0 where the user didn't enter 0, we assume that's an invalid value, and revert
                    validStringValue = config.value.stringValue;
                } else {
                    // Round to integer
                    if (temp.compare(0) < 0) {
                        temp = temp.subtract(0.5).intPart();
                    } else {
                        temp = temp.add(0.5).intPart();
                    }
                    // Coerce to be within [min, max]
                    // For some reason, this BigNumber implementation doesn't always return the right compare()
                    // result. For example, new BigNumber(Int64.MinValue - d).compare(new BigNumber(Int64.MinValue))
                    // returns 1 instead of -1 for d > 0). So the extra subtract here works around that bug - we get
                    // the delta (which is smaller), then call compare on that, which returns the expected result.
                    if (temp.subtract(int64min).compare(0) < 0) {         // newVal < min
                        validStringValue = config.minimum.stringValue;
                    } else if (temp.subtract(int64max).compare(0) > 0) {  // newVal > max
                        validStringValue = config.maximum.stringValue;
                    } else {
                        validStringValue = temp.toString();
                    }
                }
            }

            if (NUM_HELPERS.isComplex(config.valueType) === true) {
                // Note: Eventually this code should go away and be handled by the jqx control.
                // Also, NIComplex only accepts 'Infinity' and '-Infinity', but the user would type
                // Inf or -Inf instead, so this won't handle those cases correctly.
                // However, none of our numerics support the user typing Infinity anyway (see
                // US94177), so it's irrelevant for now.
                try {
                    temp = new window.NIComplex(stringValue);
                } catch (error) {
                    // Invalid value, revert to previous value
                    validStringValue = config.value.stringValue;
                }
            }

            return validStringValue;
        };

        return function (config, valueAsString) {
            var convertedValue = NUM_VAL_CONVERTER.convert(valueAsString, config.valueType, true);
            var valueOnControl;

            if (convertedValue.numberValue !== undefined) {
                valueOnControl = validateNumberValue(config, convertedValue.numberValue);
            } else if (convertedValue.stringValue !== undefined) {
                valueOnControl = validateStringValue(config, convertedValue.stringValue);
            }

            var newInputVal = valueOnControl;
            if (typeof newInputVal === 'number') {
                // Since we're putting the value back on an HTML input here, we turn numeric values back to a string
                // (since htmlInput.value is a string)
                newInputVal = newInputVal.toString();
            }

            return newInputVal;
        };
    }());

(function (child, parent) {
    'use strict';
    // Static Private Reference Aliases
    var $ = NationalInstruments.Globals.jQuery;
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var NUM_VAL_CONVERTER = NationalInstruments.HtmlVI.ValueConverters.NumericValueConverter;
    var NUM_HELPERS = NationalInstruments.HtmlVI.NINumerics.Helpers;
    var NIType = window.NIType;

    NI_SUPPORT.inheritFromParent(child, parent);
    var proto = child.prototype;

    // Static Private Variables
    // None

    // Static Private Functions
    var convertFormatToOutputNotation = function (format) {
        switch (format) {
            case 'floating point':
                return 'default';
            case 'exponential':
                return 'exponential';
            case 'engineering':
                return 'engineering';
            case 'systeminternational':
                break;
        }

        return 'default';
    };

    var setValue = function (jqref, value, valueType) {
        if (NUM_HELPERS.isComplex(valueType) === false) {
            jqref.jqxFormattedInput('setValue', value);
        } else {
            jqref.val(value);
        }
    };

    // Public Prototype Methods
    proto.isTextEditFocusable = function () {
        return true;
    };

    proto.createdCallback = function () {
        parent.prototype.createdCallback.call(this);
        this._valueChanging = false;
    };

    proto.attachedCallback = function () {
        var firstCall = parent.prototype.attachedCallback.call(this),
            childElement,
            widgetSettings,
            spinnerElement,
            textElement,
            jqref,
            digits,
            niValueType,
            that = this;

        if (firstCall === true) {
            widgetSettings = {};
            niValueType = new NIType(this.valueType);
            var language = window.engine !== undefined && window.engine.IsAttached && window.NIEmbeddedBrowser !== undefined ? window.NIEmbeddedBrowser.language : window.navigator.language;
            var culture = Globalize.culture(language);
            if (culture !== undefined) {
                var numberFormat = culture.numberFormat;
                widgetSettings.decimalSeparator = numberFormat['.'];
            }

            if (niValueType.isComplex() === false) {
                widgetSettings.int64 = false;
                if (niValueType.is64BitInteger()) {
                    widgetSettings.int64 = niValueType.isSignedInteger() ? 's' : 'u';
                }
            }

            widgetSettings.readOnly = this.readOnly;
            widgetSettings.spinButtons = true;
            if (this.format === 'floating point' || this.format === 'exponential') {
                widgetSettings.outputNotation = convertFormatToOutputNotation(this.format);
            } else {
                widgetSettings.radix = this.format;
            }

            widgetSettings.value = NUM_VAL_CONVERTER.convertBack(this.value, niValueType);
            widgetSettings.max = NUM_VAL_CONVERTER.convertBack(this.maximum, niValueType);
            widgetSettings.min = NUM_VAL_CONVERTER.convertBack(this.minimum, niValueType);

            if (niValueType.isComplex() === false) {
                widgetSettings.spinButtonsStep = NUM_VAL_CONVERTER.convertBack(this.interval, niValueType);
            } else {
                widgetSettings.interval = NUM_VAL_CONVERTER.convertBack(this.interval, niValueType);
            }

            digits = NUM_HELPERS.coerceDisplayDigits(this.significantDigits, this.precisionDigits, null);
            widgetSettings.digits = digits.significantDigits;
            widgetSettings.decimalDigits = digits.precisionDigits;

            childElement = document.createElement('div');
            // TODO mraj jqx removes this class, they need to stop
            //childElement.classList.add('ni-numeric-box');

            textElement = document.createElement('input');
            // TODO mraj jqx removes this class, they need to stop
            // textElement.classList.add('ni-text-field');
            textElement.type = 'text';

            spinnerElement = document.createElement('div');
            // TODO mraj jqx removes this class, they need to stop
            //spinnerElement.classList.add('ni-spins-box');

            childElement.appendChild(textElement);
            childElement.appendChild(spinnerElement);

            this.appendChild(childElement);
            jqref = $(childElement);
            if (niValueType.isComplex() === false) {
                jqref.jqxFormattedInput(widgetSettings);
            } else {
                widgetSettings.spinMode = 'advanced';
                jqref.jqxComplexInput(widgetSettings);
            }

            var spinSettings = {
                spinButtons: !this.readOnly,
                readOnly: this.readOnly
            };
            if (niValueType.isComplex() === false) {
                jqref.jqxFormattedInput(spinSettings);
            } else {
                jqref.jqxComplexInput(spinSettings);
            }

            jqref.on('change', function (event) {
                var val;
                if (event.args !== undefined) { // jqxComplexInput fires change events twice, and one doesn't have args
                    val = event.args.value;
                    if (NUM_HELPERS.isComplex(that.valueType) === true) {
                        // The JQX control always sends complex numbers as "a + bi", with spaces around the +.
                        // The editor does "a+bi" (no spaces), and thats also what our Value Type Representations doc
                        // says. So here we just remove the extra spaces. If we didn't, we could end up triggering a value
                        // change back to C# that's unnecessary / incorrect. (Example: User sets 2+2i as the default value,
                        // we set it on the control which triggers this event, and the jqx control gives us "2 + 2i". Without
                        // handling spaces here, we'd send this back to the editor, and set it as the current control value,
                        // which is wrong.
                        val = val.replace(/ /g, '');
                    }

                    that._valueChanging = true;
                    that.value = NUM_VAL_CONVERTER.convert(val, that.valueType, true);
                    that._valueChanging = false;
                }
            });

            // We're listening to the blur event on ourselves (with useCapture = true) so we can validate the
            // textbox value before jqx handles it. The jqx control has a change event, but it doesn't give you the opportunity
            // to change the value (if you set it to something else while handling the change, it triggers a 2nd event and the control value
            // gets out of sync from the textbox)
            that.addEventListener('blur', function () {
                var valToValidate = textElement.value;
                var config = { value: that.value, minimum: that.minimum, maximum: that.maximum, valueType: that.valueType };
                var newInputVal = NationalInstruments.HtmlVI.Elements.NumericTextBox.ValidateInputValue(config, valToValidate);

                if (valToValidate !== newInputVal) {
                    textElement.value = newInputVal;

                    if (valToValidate === '') {
                        // If the user cleared the textbox, the jqx control has a bug where the inc/ dec buttons get disabled (their state is updated on keypress, so
                        // if we fix up the value, their enabled state is stale until the next user keypress).
                        // Disabling and re-enabling the control causes the inc/ dec buttons to get re-enabled if they should be, so we do that here.
                        // TODO remove this (it's a jqx bug workaround)
                        if (NUM_HELPERS.isComplex(that.valueType) === false) {
                            jqref.jqxFormattedInput({ disabled: true });
                            jqref.jqxFormattedInput({ disabled: false });
                        } else {
                            jqref.jqxComplexInput({ disabled: true });
                            jqref.jqxComplexInput({ disabled: false });
                        }
                    }
                }
            }, true);

            $(textElement).on('keydown', function (e) {
                if (e.keyCode === 13) { // Enter / Return
                    textElement.blur(); // This commits the input's value
                    return false;
                }
            });

            jqref.on('resize', function (e) {
                e.stopPropagation();
            });
        }

        return firstCall;
    };

    proto.forceResize = function (size) {
        parent.prototype.forceResize.call(this, size);
        var jqref = $(this.firstElementChild);

        if (NUM_HELPERS.isComplex(this.valueType) === false) {
            // TODO gleon we should call jqxFormattedInput just once for setting the size of a widget.
            jqref.jqxFormattedInput({ width: size.width });
            jqref.jqxFormattedInput({ height: size.height });
        } else {
            jqref.jqxComplexInput({ width: size.width });
            jqref.jqxComplexInput({ height: size.height });
        }
    };

    proto.propertyUpdated = function (propertyName) {
        parent.prototype.propertyUpdated.call(this, propertyName);

        var childElement = this.firstElementChild,
            jqref = $(childElement),
            widgetSetting = {},
            digits,
            isSet = false,
            niValueType = new NIType(this.valueType);

        switch (propertyName) {
            case 'maximum':
                widgetSetting = {
                    max: NUM_VAL_CONVERTER.convertBack(this.maximum, niValueType)
                };

                isSet = true;
                break;
            case 'minimum':
                widgetSetting = {
                    min: NUM_VAL_CONVERTER.convertBack(this.minimum, niValueType)
                };

                isSet = true;
                break;
            case 'interval':
                if (niValueType.isComplex() === false) {
                    jqref.jqxFormattedInput({ spinButtonsStep: NUM_VAL_CONVERTER.convertBack(this.interval, niValueType) });
                } else {
                    jqref.jqxComplexInput({ interval: NUM_VAL_CONVERTER.convertBack(this.interval, niValueType) });
                }

                break;
            case 'readOnly':
                widgetSetting = {
                    spinButtons: !this.readOnly,
                    readOnly: this.readOnly
                };

                isSet = true;
                break;
            case 'significantDigits':
            case 'precisionDigits':
                digits = NUM_HELPERS.coerceDisplayDigits(this.significantDigits, this.precisionDigits, null);
                // Note: The order that we set digits and decimalDigits in is important here.
                // Basically we just need to avoid getting in a situation where the jqx control
                // temporarily has both digits and decimalDigits set to null. So we figure out
                // which of digits / decimalDigits is set, and apply that first, before clearing
                // the other one.
                if (niValueType.isComplex() === false) {
                    if (digits.precisionDigits === null) {
                        jqref.jqxFormattedInput({ digits: digits.significantDigits });
                        jqref.jqxFormattedInput({ decimalDigits: null });
                    } else {
                        jqref.jqxFormattedInput({ decimalDigits: digits.precisionDigits });
                        jqref.jqxFormattedInput({ digits: null });
                    }

                } else {
                    if (digits.precisionDigits === null) {
                        jqref.jqxComplexInput({ digits: digits.significantDigits });
                        jqref.jqxComplexInput({ decimalDigits: null });
                    } else {
                        jqref.jqxComplexInput({ decimalDigits: digits.precisionDigits });
                        jqref.jqxComplexInput({ digits: null });
                    }
                }

                break;
            case 'format':
                if (this.format === 'floating point' || this.format === 'exponential') {
                    widgetSetting.outputNotation = convertFormatToOutputNotation(this.format);
                } else {
                    widgetSetting.radix = this.format;
                }

                isSet = true;
                break;
            case 'value':
                if (this._valueChanging === false) {
                    var value = NUM_VAL_CONVERTER.convertBack(this.value, niValueType);
                    setValue(jqref, value, niValueType);
                }

                break;
            default:
                break;
        }

        if (isSet === true) {
            if (niValueType.isComplex() === false) {
                jqref.jqxFormattedInput(widgetSetting);
            } else {
                jqref.jqxComplexInput(widgetSetting);
            }
        }
    };

    proto.defineElementInfo(proto, 'ni-numeric-text-box', 'HTMLNINumericTextBox');
}(NationalInstruments.HtmlVI.Elements.NumericTextBox, NationalInstruments.HtmlVI.Elements.NumericControl));
