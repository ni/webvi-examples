//****************************************
//Numeric TextBox Prototype
// DOM Registration: HTMLGauge
// National Instruments Copyright 2014
//****************************************

// Constructor Function: Empty (Not Invoked)
NationalInstruments.HtmlVI.Elements.Gauge = function () {
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
    var NIType = window.NIType;
    var NITypes = window.NITypes;

    NI_SUPPORT.inheritFromParent(child, parent);
    var proto = child.prototype;

    // Static Private Variables
    var ENDPOINTS_ONLY = 1;
    var MINORTICKS_FOR_ENDPOINTS_ONLY = 5;
    var MAJOR_TICK_SIZE = '10%';
    var MINOR_TICK_SIZE = '5%';

    // Static Private Functions
    // There are some bugs with the same root cause from jqWidgets, basically, setting
    // any property on the Gauge resets other properties asociated with it.
    // e.g. setting the fontSize would require only to do something like:
    //
    //      jqref.jqxGauge({labels: {fontSize: '12px'}});
    //
    // if we now want to set the fontStyle, calling jqref.jqxGauge({labels: {fontStyle: 'italic'}});
    // would reset the fontSize since it was not specified this time.
    // The fix is for each high level property we want to modify, first we need to get the internal
    // state of the property, modify that object, and then pass it to the jqref using their API.
    var getAndSet = function (jqref, propName, properties) {
        var props = jqref.jqxGauge(propName);
        for (var prop in properties) {
            if (properties.hasOwnProperty(prop)) {
                props[prop] = properties[prop];
            }
        }

        var propsToSet = {};
        propsToSet[propName] = props;
        jqref.jqxGauge(propsToSet);
    };

    // Public Prototype Methods
    proto.createdCallback = function () {
        parent.prototype.createdCallback.call(this);
        this._currentNIType = NITypes.DOUBLE;
    };

    proto.attachedCallback = function () {
        var firstCall = parent.prototype.attachedCallback.call(this),
            widgetSettings,
            labels,
            ticksMajor,
            ticksMinor,
            digits,
            childElement,
            jqref,
            niValueType;

        if (firstCall === true) {
            niValueType = new NIType(this.niType);
            this._currentNIType = niValueType;
            widgetSettings = {};
            widgetSettings.width = '100%';
            widgetSettings.height = '100%';
            widgetSettings.animationDuration = 0;
            widgetSettings.border = {size: '1%', showGradient: false};
            // Update the model
            digits = NUM_HELPER.coerceDisplayDigits(this.significantDigits, this.precisionDigits);
            labels = {
                interval: 1,
                visible: true,
                distance: '30%',
                fontSize: $(this).css('font-size'),
                fontFamily: $(this).css('font-family'),
                fontStyle: $(this).css('font-style'),
                fontWeight: $(this).css('font-weight'),
                formatSettings: {
                    outputNotation: this.format === 'floating point' ? 'decimal' : 'exponential',
                    radix: this.convertFormatToRadix(this.format),
                    digits: digits.significantDigits,
                    decimalDigits: digits.precisionDigits
                }
            };
            ticksMajor = {
                visible: this.majorTicksVisible && this.scaleVisible,
                size: MAJOR_TICK_SIZE
            };
            ticksMinor = {
                visible: this.minorTicksVisible && this.scaleVisible,
                size: MINOR_TICK_SIZE
            };

            labels.interval = NUM_VAL_CONVERTER.convertBack(this.interval, niValueType);
            labels.visible = this.labelsVisible && this.scaleVisible;
            widgetSettings.labels = labels;
            if (this.rangeDivisionsMode === 'auto') {
                widgetSettings.tickMode = 'default';
                widgetSettings.niceInterval = true;
            } else {
                widgetSettings.tickMode = 'tickNumber';
                widgetSettings.niceInterval = false;
                ticksMajor.number = ENDPOINTS_ONLY;
                ticksMinor.number = MINORTICKS_FOR_ENDPOINTS_ONLY;
                labels.number = ENDPOINTS_ONLY;
            }

            widgetSettings.ticksMajor = ticksMajor;
            widgetSettings.ticksMinor = ticksMinor;
            widgetSettings.ticksDistance = '5%';

            widgetSettings.max = NUM_VAL_CONVERTER.convertBack(this.maximum, niValueType);
            widgetSettings.min = NUM_VAL_CONVERTER.convertBack(this.minimum, niValueType);

            widgetSettings.startAngle = this.startAngle;
            widgetSettings.endAngle = this.endAngle;

            widgetSettings.value = NUM_VAL_CONVERTER.convertBack(this.value, niValueType);
            widgetSettings.int64 = false;
            if (niValueType.is64BitInteger()) {
                widgetSettings.int64 = niValueType.isSignedInteger() ? 's' : 'u';
            }

            childElement = document.createElement('div');
            childElement.style.width = '100%';
            childElement.style.height = '100%';

            this.appendChild(childElement);

            jqref = $(childElement);

            jqref.jqxGauge(widgetSettings);
            jqref.on('resize', function (event) {
                event.stopPropagation();
            });

            // Adding CSS class names
            jqref.addClass('ni-gauge-box');
        }

        return firstCall;
    };

    proto.forceResize = function (size) {
        parent.prototype.forceResize.call(this, size);
        $(this.firstElementChild).jqxGauge(size);
    };

    proto.updateRange = function (jqref) {
        var settings = { int64: false},
            niValueType = new NIType(this.niType);

        if (niValueType.is64BitInteger()) {
            settings.int64 = niValueType.isSignedInteger() ? 's' : 'u';
        }

        settings.min = NUM_VAL_CONVERTER.convertBack(this.minimum, niValueType);
        settings.max = NUM_VAL_CONVERTER.convertBack(this.maximum, niValueType);
        settings.value = NUM_VAL_CONVERTER.convertBack(this.value, niValueType);

        jqref.jqxGauge(settings);
    };

    proto.setFont = function (fontSize, fontFamily, fontWeight, fontStyle, textDecoration) {
        parent.prototype.setFont.call(this, fontSize, fontFamily, fontWeight, fontStyle, textDecoration);

        var childElement = this.firstElementChild,
            jqref = $(childElement);

        getAndSet(jqref, 'labels', {
            fontSize: fontSize,
            fontFamily: fontFamily,
            fontStyle: fontStyle,
            fontWeight: fontWeight
        });
        jqref.jqxGauge('refresh');
    };

    proto.propertyUpdated = function (propertyName) {
        parent.prototype.propertyUpdated.call(this, propertyName);

        var childElement = this.firstElementChild,
            ticksMajor,
            ticksMinor,
            digits,
            value = this.value,
            jqref = $(childElement);

        switch (propertyName) {
            case 'niType':
                this._currentNIType = new NIType(this.niType);
                var int64 = jqref.jqxGauge('int64'),
                    is64bit = this._currentNIType.is64BitInteger();
                if ((is64bit && int64 === false) || (!is64bit && int64 === true)) {
                    return; //this type change will result in a new gauge being created
                }

                this.updateRange(jqref);
                break;
            case 'startAngle':
                jqref.jqxGauge({startAngle: this.startAngle});
                break;
            case 'endAngle':
                jqref.jqxGauge({endAngle: this.endAngle});
                break;
            case 'maximum':
                this.updateRange(jqref);
                break;
            case 'minimum':
                this.updateRange(jqref);
                break;
            case 'value':
                var isNon64BitInt = this._currentNIType.isNumeric() && !this._currentNIType.is64BitInteger();
                if (this.coercionMode || isNon64BitInt) {
                    value = NUM_HELPER.roundToNearest(value, this._currentNIType, this.interval);
                }

                jqref.jqxGauge({ value: NUM_VAL_CONVERTER.convertBack(value, this._currentNIType) });
                break;
            case 'interval':
                if (this.coercionMode) {
                    value = NUM_HELPER.roundToNearest(value, this._currentNIType, this.interval);
                    jqref.jqxGauge({ value: NUM_VAL_CONVERTER.convertBack(value, this._currentNIType) });
                }

                this.updateRange(jqref);
                break;
            case 'coercionMode':
                if (this.coercionMode) {
                    value = NUM_HELPER.roundToNearest(value, this._currentNIType, this.interval);
                }

                jqref.jqxGauge({ value: NUM_VAL_CONVERTER.convertBack(value, this._currentNIType) });
                break;
            case 'scaleVisible':
                getAndSet(jqref, 'ticksMajor', {visible: this.majorTicksVisible && this.scaleVisible });
                getAndSet(jqref, 'ticksMinor', {visible: this.minorTicksVisible && this.scaleVisible });
                jqref.jqxGauge('refresh');
                break;
            case 'labelsVisible':
                getAndSet(jqref, 'labels', { visible: this.labelsVisible && this.scaleVisible });
                jqref.jqxGauge('refresh');
                break;
            case 'majorTicksVisible':
                getAndSet(jqref, 'ticksMajor', {visible: this.majorTicksVisible && this.scaleVisible });
                jqref.jqxGauge('refresh');
                break;
            case 'minorTicksVisible':
                getAndSet(jqref, 'ticksMinor', {visible: this.minorTicksVisible && this.scaleVisible });
                jqref.jqxGauge('refresh');
                break;
            case 'rangeDivisionsMode':
                // For the gauge we have to retrieve the current state of the objects inside it.
                // If not we lose all other properties not set by this procedure.
                var interval, rangeDivProps = {};
                var labels = jqref.jqxGauge('labels');
                ticksMajor = jqref.jqxGauge('ticksMajor');
                ticksMinor = jqref.jqxGauge('ticksMinor');

                // Update labels and scale visibility.
                labels.visible = this.labelsVisible && this.scaleVisible;
                ticksMajor.visible = this.majorTicksVisible && this.scaleVisible;
                ticksMinor.visible = this.minorTicksVisible && this.scaleVisible;

                // This the object that sets all updated properties on the jqxGauge.
                rangeDivProps.labels = labels;
                rangeDivProps.ticksMajor = ticksMajor;
                rangeDivProps.ticksMinor = ticksMinor;

                if (this.rangeDivisionsMode === 'auto') {
                    // Show all
                    rangeDivProps.tickMode = 'default';
                    rangeDivProps.niceInterval = true;
                } else {
                    // Show Endpoints only
                    interval = this.getRange();
                    labels.number = ENDPOINTS_ONLY;
                    ticksMajor.interval = interval;
                    ticksMajor.number = ENDPOINTS_ONLY;

                    ticksMinor.interval = interval;
                    ticksMinor.number = MINORTICKS_FOR_ENDPOINTS_ONLY;

                    rangeDivProps.tickMode = 'tickNumber';
                    rangeDivProps.niceInterval = false;
                }

                jqref.jqxGauge(rangeDivProps);
                jqref.jqxGauge('refresh');
                break;
            case 'format':
            case 'significantDigits':
            case 'precisionDigits':
                digits = NUM_HELPER.coerceDisplayDigits(this.significantDigits, this.precisionDigits);
                getAndSet(jqref, 'labels', {
                    formatSettings: {
                            outputNotation: this.format === 'floating point' ? 'decimal' : 'exponential',
                            radix: this.convertFormatToRadix(this.format),
                            digits: digits.significantDigits,
                            decimalDigits: digits.precisionDigits
                        }
                });
                jqref.jqxGauge('refresh');
                break;
            default:
                break;
        }
    };

    proto.defineElementInfo(proto, 'ni-gauge', 'HTMLNIGauge');
}(NationalInstruments.HtmlVI.Elements.Gauge, NationalInstruments.HtmlVI.Elements.RadialNumericPointer));
