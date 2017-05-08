//****************************************
// Numeric Slider
// DOM Registration: HTMLSlider
// National Instruments Copyright 2014
//****************************************

// Constructor Function: Empty (Not Invoked)
NationalInstruments.HtmlVI.Elements.Slider = function () {
    'use strict';
};

// Static Public Variables
// None

(function (child, parent) {
    'use strict';
    // Static Private Reference Aliases
    var $ = NationalInstruments.Globals.jQuery;
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var NUM_VAL_CONVERTER = NationalInstruments.HtmlVI.ValueConverters.NumericValueConverter;
    var NUM_HELPER = NationalInstruments.HtmlVI.NINumerics.Helpers;

    NI_SUPPORT.inheritFromParent(child, parent);
    var proto = child.prototype;

    // Static Private Variables
    var ENDPOINTS_ONLY = 1;

    // Static Private Functions
    var setupWidget = function (target) {
        var widgetSettings,
            childElement,
            jqref,
            min,
            max,
            digits,
            that = target;

        widgetSettings = {};
        widgetSettings.width = '100%';
        widgetSettings.height = '100%';
        widgetSettings.disabled = that.readOnly;

        widgetSettings.int64 = NUM_HELPER.isSigned64BitInt(that.valueType) ? 's' : NUM_HELPER.is64BitInt(that.valueType) ? 'u' : false;
        widgetSettings.step = NUM_VAL_CONVERTER.convertBack(that.interval, that.valueType);
        widgetSettings.orientation = that.orientation;
        max = NUM_VAL_CONVERTER.convertBack(that.maximum, that.valueType);
        min = NUM_VAL_CONVERTER.convertBack(that.minimum, that.valueType);

        widgetSettings.min = min;
        widgetSettings.max = max;
        if (that.rangeDivisionsMode === 'auto') {
            widgetSettings.tickMode = 'default';
            widgetSettings.niceInterval = true;
        } else {
            widgetSettings.tickMode = 'tickNumber';
            widgetSettings.niceInterval = false;
            widgetSettings.tickNumber = ENDPOINTS_ONLY;
        }

        digits = NUM_HELPER.coerceDisplayDigits(that.significantDigits, that.precisionDigits);

        widgetSettings.padding = 1;
        widgetSettings.tickLabelFormatSettings = {
            outputNotation: that.format === 'floating point' ? 'decimal' : 'exponential',
            radix: that.convertFormatToRadix(that.format),
            digits: digits.significantDigits,
            decimalDigits: digits.precisionDigits
        };
        widgetSettings.tooltipFormatSettings = {
            outputNotation: that.format === 'floating point' ? 'decimal' : 'exponential',
            radix: that.convertFormatToRadix(that.format),
            digits: digits.significantDigits,
            decimalDigits: digits.precisionDigits
        };

        that.applyScaleSettings(widgetSettings);

        widgetSettings.showButtons = false;
        widgetSettings.ticksPosition = 'bottom';
        widgetSettings.mode = that.coercionMode ? 'fixedRange' : 'default';
        widgetSettings.tooltip = true;
        widgetSettings.value = NUM_VAL_CONVERTER.convertBack(that.value, that.valueType);

        childElement = document.createElement('div');
        childElement.style.width = '100%';
        childElement.style.height = '100%';

        that.appendChild(childElement);

        jqref = $(childElement);

        jqref.jqxSlider(widgetSettings);
        jqref.css('font-size', $(that).css('font-size'));
        jqref.css('font-family', $(that).css('font-family'));
        jqref.css('font-weight', $(that).css('font-weight'));
        jqref.css('font-style', $(that).css('font-style'));
        jqref.on('change', function (event) {
            if (that.valueType === NationalInstruments.HtmlVI.NINumerics.ValueTypes.INT64) {
                var bigNumEventValue = new BigNumber(event.args.value);
                var bigNumModelValue = new BigNumber(that.value.stringValue);
                if (bigNumEventValue.compare(bigNumModelValue) !== 0) {
                    that.value = NUM_VAL_CONVERTER.convert(event.args.value, that.valueType, true);
                }
            } else {
                that.value = NUM_VAL_CONVERTER.convert(event.args.value, that.valueType, true);
                if (that.coercionMode || NUM_HELPER.isNon64BitInt(that.valueType)) {
                    that.value = NUM_HELPER.roundToNearest(that.value, that.valueType, that.interval);
                    jqref.jqxSlider({ value: NUM_VAL_CONVERTER.convertBack(that.value, that.valueType) });
                }
            }
        });
        jqref.on('resize', function (event) {
            event.stopPropagation();
        });

        // Adding CSS class names
        jqref.addClass('ni-slider-box');
        // The classes we are searching do not exist after upgrading to jqWidgets 4.2.1. The slider CSS test has been disabled.
        // jqref.find(' .jqx-slider-tickscontainer').addClass('ni-ticks');
        // jqref.find(' .jqx-slider-slider').addClass('ni-thumb');
        // jqref.find(' .jqx-slider-tick').addClass('ni-tick');
        // jqref.find(' .jqx-slider-track ').addClass('ni-track');
        // jqref.find(' .jqx-slider-rangebar').addClass('ni-range-bar');
    };

    proto.forceResize = function (size) {
        parent.prototype.forceResize.call(this, size);
        $(this.firstElementChild).jqxSlider(size);
    };

    // Public Prototype Methods
    proto.updateRange = function (jqref) {
        var settings = { int64: NUM_HELPER.isSigned64BitInt(this.valueType) ? 's' : NUM_HELPER.is64BitInt(this.valueType) ? 'u' : false};
        settings.min = NUM_VAL_CONVERTER.convertBack(this.minimum, this.valueType);
        settings.max = NUM_VAL_CONVERTER.convertBack(this.maximum, this.valueType);
        settings.value = NUM_VAL_CONVERTER.convertBack(this.value, this.valueType);
        settings.step = NUM_VAL_CONVERTER.convertBack(this.interval, this.valueType);

        jqref.jqxSlider(settings);
    };

    proto.applyScaleSettings = function (settings) {
        settings.showTicks = this.scaleVisible;
        settings.tickSize = this.majorTicksVisible ? 7 : 0;
        settings.showMinorTicks = this.minorTicksVisible && this.scaleVisible;
        settings.showTickLabels = this.labelsVisible && this.scaleVisible;
    };

    proto.updateScaleVisibility = function (jqref) {
        var settings = { };
        this.applyScaleSettings(settings);
        jqref.jqxSlider(settings);
    };

    proto.setFont = function (fontSize, fontFamily, fontWeight, fontStyle, textDecoration) {
        parent.prototype.setFont.call(this, fontSize, fontFamily, fontWeight, fontStyle, textDecoration);

        var childElement = this.firstElementChild,
            jqref = $(childElement);

        jqref.css({ 'font-size': fontSize,
                   'font-family': fontFamily,
                   'font-weight': fontWeight,
                   'font-style': fontStyle
                  });
        $(childElement).trigger('refresh');
    };

    proto.attachedCallback = function () {
        var firstCall = parent.prototype.attachedCallback.call(this);

        if (firstCall === true) {
            setupWidget(this);
        }

        return firstCall;
    };

    proto.propertyUpdated = function (propertyName) {
        parent.prototype.propertyUpdated.call(this, propertyName);

        var childElement = this.firstElementChild,
            jqref = $(childElement),
            digits,
            value = this.value;

        switch (propertyName) {
            case 'valueType':
                this.updateRange(jqref);
                break;
            case 'value':
                if (this.coercionMode || NUM_HELPER.isNon64BitInt(this.valueType)) {
                    value = NUM_HELPER.roundToNearest(value, this.valueType, this.interval);
                }

                jqref.jqxSlider({ value: NUM_VAL_CONVERTER.convertBack(value, this.valueType) });
                break;
            case 'minimum':
                this.updateRange(jqref);
                break;
            case 'maximum':
                this.updateRange(jqref);
                break;
            case 'interval':
                if (this.coercionMode) {
                    value = NUM_HELPER.roundToNearest(value, this.valueType, this.interval);
                    jqref.jqxSlider({ value: NUM_VAL_CONVERTER.convertBack(value, this.valueType) });
                }

                this.updateRange(jqref);
                break;
            case 'coercionMode':
                if (this.coercionMode) {
                    value = NUM_HELPER.roundToNearest(value, this.valueType, this.interval);
                }

                jqref.jqxSlider({ value: NUM_VAL_CONVERTER.convertBack(value, this.valueType) });
                break;
            case 'orientation':
                this.removeChild(childElement);
                setupWidget(this);
                break;
            case 'readOnly':
                jqref.jqxSlider({ disabled: this.readOnly });
                break;
            case 'scaleVisible':
                this.updateScaleVisibility(jqref);
                break;
            case 'majorTicksVisible':
                this.updateScaleVisibility(jqref);
                break;
            case 'minorTicksVisible':
                this.updateScaleVisibility(jqref);
                break;
            case 'labelsVisible':
                this.updateScaleVisibility(jqref);
                break;
            case 'coercionMode':
                jqref.jqxSlider({ mode: this.coercionMode ? 'fixedRange' : 'default' });
                break;
            case 'rangeDivisionsMode':
                jqref.jqxSlider({ tickMode: this.rangeDivisionsMode === 'auto' || this.rangeDivisionsMode === 'none' ? 'default' : 'tickNumber' });
                jqref.jqxSlider({ niceInterval: this.rangeDivisionsMode === 'auto' || this.rangeDivisionsMode === 'none' ? true : false });
                if (this.rangeDivisionsMode !== 'auto' && this.rangeDivisionsMode !== 'none') {
                    jqref.jqxSlider({ tickNumber: ENDPOINTS_ONLY });
                }

                break;
            case 'format':
            case 'significantDigits':
            case 'precisionDigits':
                digits = NUM_HELPER.coerceDisplayDigits(this.significantDigits, this.precisionDigits);
                jqref.jqxSlider({
                    tickLabelFormatSettings: {
                        outputNotation: this.format === 'floating point' ? 'decimal' : 'exponential',
                        radix: this.convertFormatToRadix(this.format),
                        digits: digits.significantDigits,
                        decimalDigits: digits.precisionDigits
                    }
                });
                jqref.jqxSlider({
                    tooltipFormatSettings: {
                        outputNotation: this.format === 'floating point' ? 'decimal' : 'exponential',
                        radix: this.convertFormatToRadix(this.format),
                        digits: digits.significantDigits,
                        decimalDigits: digits.precisionDigits
                    }
                });

                break;
            default:
                break;
        }
    };

    proto.defineElementInfo(proto, 'ni-slider', 'HTMLNISlider');
}(NationalInstruments.HtmlVI.Elements.Slider, NationalInstruments.HtmlVI.Elements.LinearNumericPointer));
