//****************************************
// Tank Prototype
// DOM Registration: HTMLTank
// National Instruments Copyright 2014
//****************************************

// Constructor Function: Empty (Not Invoked)
NationalInstruments.HtmlVI.Elements.Tank = function () {
    'use strict';
};

// Static Public Variables
// None

(function (child, parent) {
    'use strict';
    // Static Private Reference Aliases
    var $ = NationalInstruments.Globals.jQuery;
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    NI_SUPPORT.inheritFromParent(child, parent);
    var proto = child.prototype;

    // Static private reference aliases
    var NUM_VAL_CONVERTER = NationalInstruments.HtmlVI.ValueConverters.NumericValueConverter;
    var NUM_HELPER = NationalInstruments.HtmlVI.NINumerics.Helpers;

    // Static Private Variables
    var ENDPOINTS_ONLY = 1;
    var MINORTICKS_FOR_ENDPOINTS_ONLY = 10;
    var MAJOR_TICK_SIZE = '10px';
    var MINOR_TICK_SIZE = '5px';

    // Static Private Functions
    var setupWidget = function (target) {
        var widgetSettings,
            childElement,
            jqref,
            that = target;

        widgetSettings = {};

        widgetSettings.int64 = NUM_HELPER.isSigned64BitInt(that.valueType) ? 's' : NUM_HELPER.is64BitInt(that.valueType) ? 'u' : false;
        widgetSettings.background = { visible: false };
        widgetSettings.animationDuration = 0;

        that.applyScaleSettings(widgetSettings);

        widgetSettings.orientation = that.orientation;
        var max = NUM_VAL_CONVERTER.convertBack(that.maximum, that.valueType);
        var min = NUM_VAL_CONVERTER.convertBack(that.minimum, that.valueType);

        widgetSettings.min = min;
        widgetSettings.max = max;
        widgetSettings.value = NUM_VAL_CONVERTER.convertBack(that.value, that.valueType);
        childElement = document.createElement('div');
        childElement.style.width = '100%';
        childElement.style.height = '100%';

        that.appendChild(childElement);

        jqref = $(childElement);
        jqref.jqxLinearGauge(widgetSettings);

        // Adding CSS class names
        jqref.addClass('ni-tank-box');
    };

    proto.forceResize = function (size) {
        parent.prototype.forceResize.call(this, size);
        $(this.firstElementChild).jqxLinearGauge(size);
    };

    // Public Prototype Methods
    proto.applyScaleSettings = function (settings) {
        var pointerOffset,
            ticksOffset,
            ticksMajor = (typeof settings.ticksMajor !== 'object' || settings.ticksMajor === null) ? {} : settings.ticksMajor,
            ticksMinor = (typeof settings.ticksMinor !== 'object' || settings.ticksMinor === null) ? {} : settings.ticksMinor,
            labels = (typeof settings.labels !== 'object' || settings.labels === null) ? {} : settings.labels,
            ticksAndLabelsPosition = 'near';

        if (this.orientation === 'vertical') {
            ticksOffset = ['20%', '5%'];
            pointerOffset = '5%';
        } else {
            ticksOffset = ['5%', '20%'];
            pointerOffset = '105%';
        }

        ticksMajor.size = MAJOR_TICK_SIZE;
        ticksMajor.visible = this.majorTicksVisible && this.scaleVisible;

        ticksMinor.size = MINOR_TICK_SIZE;
        ticksMinor.visible = this.minorTicksVisible && this.scaleVisible;

        labels.position = ticksAndLabelsPosition;
        labels.visible = this.labelsVisible && this.scaleVisible;
        this.updateLabelsFontAndFormat(labels);
        labels.interval = NUM_VAL_CONVERTER.convertBack(this.interval, this.valueType);

        if (this.rangeDivisionsMode === 'auto') {
            settings.tickMode = 'default';
            settings.niceInterval = true;
        } else {
            settings.tickMode = 'tickNumber';
            settings.niceInterval = false;
            ticksMajor.number = ENDPOINTS_ONLY;
            ticksMinor.number = MINORTICKS_FOR_ENDPOINTS_ONLY;
            labels.number = ENDPOINTS_ONLY;
        }

        settings.ticksMajor = ticksMajor;
        settings.ticksMinor = ticksMinor;
        settings.ticksOffset = ticksOffset;
        settings.labels = labels;
        settings.ticksPosition = ticksAndLabelsPosition;
        settings.pointer = { size: '100%' };
        settings.pointer.offset = pointerOffset;
        settings.int64 = NUM_HELPER.isSigned64BitInt(this.valueType) ? 's' : NUM_HELPER.is64BitInt(this.valueType) ? 'u' : false;
    };

    proto.updateScaleVisibility = function (jqref) {
        var settings = {};
        settings.ticksMajor = jqref.jqxLinearGauge('ticksMajor');
        settings.ticksMinor = jqref.jqxLinearGauge('ticksMinor');
        settings.labels = jqref.jqxLinearGauge('labels');
        this.applyScaleSettings(settings);
        jqref.jqxLinearGauge(settings);
    };

    proto.updateRange = function (jqref) {
        var settings = { int64: NUM_HELPER.isSigned64BitInt(this.valueType) ? 's' : NUM_HELPER.is64BitInt(this.valueType) ? 'u' : false};
        settings.min = NUM_VAL_CONVERTER.convertBack(this.minimum, this.valueType);
        settings.max = NUM_VAL_CONVERTER.convertBack(this.maximum, this.valueType);
        settings.value = NUM_VAL_CONVERTER.convertBack(this.value, this.valueType);

        jqref.jqxLinearGauge(settings);
    };

    proto.updateLabelsFontAndFormat = function (labels) {
        var jqref = $(this), digits;
        labels = labels || jqref.jqxLinearGauge('labels');
        labels.fontSize = jqref.css('font-size');
        labels.fontFamily = jqref.css('font-family');
        labels.fontStyle = jqref.css('font-style');
        labels.fontWeight = jqref.css('font-weight');
        digits = NUM_HELPER.coerceDisplayDigits(this.significantDigits, this.precisionDigits);
        labels.formatSettings = {
            outputNotation: this.format === 'floating point' ? 'decimal' : 'exponential',
            radix: this.convertFormatToRadix(this.format),
            digits: digits.significantDigits,
            decimalDigits: digits.precisionDigits
        };
    };

    proto.updateDivisionsMode = function (jqref) {
        var interval, settings = {};

        settings.ticksMajor = jqref.jqxLinearGauge('ticksMajor');
        settings.ticksMinor = jqref.jqxLinearGauge('ticksMinor');
        settings.labels = jqref.jqxLinearGauge('labels');

        if (this.rangeDivisionsMode === 'auto') {
            settings.labels.number = undefined;
            settings.ticksMinor.number = undefined;
            settings.ticksMajor.number = undefined;
            settings.tickMode = 'default';
            settings.niceInterval = true;
        } else {
            interval = this.getRange();
            settings.labels.interval = interval;
            settings.labels.number = ENDPOINTS_ONLY;
            settings.ticksMinor.number = MINORTICKS_FOR_ENDPOINTS_ONLY;
            settings.ticksMajor.number = ENDPOINTS_ONLY;
            settings.ticksMajor.interval = interval;
            settings.ticksMinor.interval = interval;
            settings.tickMode = 'tickNumber';
            settings.niceInterval = false;
        }

        jqref.jqxLinearGauge(settings);
    };

    proto.attachedCallback = function () {
        var firstCall = parent.prototype.attachedCallback.call(this);

        if (firstCall === true) {
            setupWidget(this);
        }

        return firstCall;
    };

    proto.setFont = function (fontSize, fontFamily, fontWeight, fontStyle, textDecoration) {
        parent.prototype.setFont.call(this, fontSize, fontFamily, fontWeight, fontStyle, textDecoration);

        var childElement = this.firstElementChild,
            jqref = $(childElement), labels;

        labels = jqref.jqxLinearGauge('labels');
        this.updateLabelsFontAndFormat(labels);
        jqref.jqxLinearGauge({ labels: labels });
        jqref.jqxLinearGauge('refresh', false);
    };

    proto.propertyUpdated = function (propertyName) {
        parent.prototype.propertyUpdated.call(this, propertyName);

        var childElement = this.firstElementChild,
            ticksMinor, ticksMajor,
            jqref = $(childElement), labels,
            value = this.value;

        switch (propertyName) {
            case 'valueType':
                var int64 = jqref.jqxLinearGauge('int64');
                if ((NUM_HELPER.is64BitInt(this.valueType) && int64 === false) ||
                    (!NUM_HELPER.is64BitInt(this.valueType) && int64 === true)) {
                    return; //this type change will result in a new gauge being created
                }

                this.updateRange(jqref);
                break;
            case 'value':
                if (this.coercionMode) {
                    value = NUM_HELPER.roundToNearest(value, this.valueType, this.interval);
                }

                jqref.jqxLinearGauge({ value: NUM_VAL_CONVERTER.convertBack(value, this.valueType) });
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
                    jqref.jqxLinearGauge({ value: NUM_VAL_CONVERTER.convertBack(value, this.valueType) });
                }

                this.updateRange(jqref);
                break;
            case 'coercionMode':
                if (this.coercionMode) {
                    value = NUM_HELPER.roundToNearest(value, this.valueType, this.interval);
                }

                jqref.jqxLinearGauge({ value: NUM_VAL_CONVERTER.convertBack(value, this.valueType) });
                break;
            case 'scaleVisible':
                this.updateScaleVisibility(jqref);
                break;
            case 'labelsVisible':
                labels = jqref.jqxLinearGauge('labels');
                labels.visible = this.labelsVisible && this.scaleVisible;
                jqref.jqxLinearGauge({ labels: labels });
                jqref.jqxLinearGauge('refresh', false);
                break;
            case 'majorTicksVisible':
                ticksMajor = jqref.jqxLinearGauge('ticksMajor');
                ticksMajor.visible = this.majorTicksVisible && this.scaleVisible;
                jqref.jqxLinearGauge({ ticksMajor: ticksMajor });
                jqref.jqxLinearGauge('refresh', false);
                break;
            case 'minorTicksVisible':
                ticksMinor = jqref.jqxLinearGauge('ticksMinor');
                ticksMinor.visible = this.minorTicksVisible && this.scaleVisible;
                jqref.jqxLinearGauge({ ticksMinor: ticksMinor });
                jqref.jqxLinearGauge('refresh', false);
                break;
            case 'rangeDivisionsMode':
                this.updateDivisionsMode(jqref);
                break;
            case 'format':
            case 'significantDigits':
            case 'precisionDigits':
                labels = jqref.jqxLinearGauge('labels');
                this.updateLabelsFontAndFormat(labels);
                jqref.jqxLinearGauge({ labels: labels });
                jqref.jqxLinearGauge('refresh', false);
                break;
            case 'orientation':
                this.removeChild(childElement);
                setupWidget(this);
                break;
            default:
                break;
        }
    };

    proto.defineElementInfo(proto, 'ni-tank', 'HTMLNITank');
}(NationalInstruments.HtmlVI.Elements.Tank, NationalInstruments.HtmlVI.Elements.LinearNumericPointer));
