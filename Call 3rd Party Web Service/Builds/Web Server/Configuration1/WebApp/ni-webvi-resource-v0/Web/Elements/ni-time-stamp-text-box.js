//****************************************
// Time Stamp Text Box Prototype
// DOM Registration: No
// National Instruments Copyright 2015
//****************************************

// Constructor Function: Empty (Not Invoked)
NationalInstruments.HtmlVI.Elements.TimeStampTextBox = function () {
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

    // Static Private Variables
    // None

    // Static Private Functions
    var serialisedTSToJsDate = function (value) {
        return (new window.NITimestamp(value)).toDate();
    };

    // Public Prototype Methods
    proto.addAllProperties = function (targetPrototype) {
        parent.prototype.addAllProperties.call(this, targetPrototype);

        proto.addProperty(targetPrototype, {
            propertyName: 'value',
            defaultValue: '0:0',
            fireEvent: true,
            addNonSignalingProperty: true
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'minimum',
            defaultValue: '-9223372036854775808:0'
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'maximum',
            defaultValue: '9223372036854775807:0'
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'showCalendarButtonOnControl',
            defaultValue: false
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'popupEnabled',
            defaultValue: false
        });

        NI_SUPPORT.setValuePropertyDescriptor(targetPrototype, 'value', 'value', 'valueNonSignaling', 'value-changed');
    };

    proto.isTextEditFocusable = function () {
        return true;
    };

    proto.attachedCallback = function () {
        var firstCall = parent.prototype.attachedCallback.call(this),
            widgetSettings,
            childElement,
            jqref,
            format,
            culture,
            calendar,
            that = this;

        if (firstCall === true) {
            childElement = document.createElement('div');
            childElement.classList.add('ni-time-stamp-box');

            that.innerHTML = '';
            that.appendChild(childElement);

            format = 'MM/dd/yyyy hh:mm:ss tt';
            culture = Globalize.culture(window.NIEmbeddedBrowser.formatLanguage);
            if (culture !== undefined) {
                calendar = culture.calendar;
                format = calendar.patterns.d + ' ' + calendar.patterns.T;
            }

            widgetSettings = {
                disabled: that.readOnly,
                culture: window.NIEmbeddedBrowser.formatLanguage,
                formatString: format,
                min: serialisedTSToJsDate(that.minimum),
                max: serialisedTSToJsDate(that.maximum),
                value: serialisedTSToJsDate(that.value),
                showCalendarButton: !that.readOnly && that.popupEnabled
            };

            jqref = $(childElement);
            jqref.jqxDateTimeInput(widgetSettings);
            jqref.on('valueChanged', function (event) {
                that.value = (new window.NITimestamp(event.args.date)).toString();
            });

            jqref.on('keydown', function (e) {
                if (e.keyCode === 13) { // Enter / Return
                    jqref.find(' input').blur(); // This commits the input's value
                    return false;
                }
            });
        }

        return firstCall;
    };

    proto.forceResize = function (size) {
        parent.prototype.forceResize.call(this, size);
        $(this.firstElementChild).jqxDateTimeInput(size);
    };

    proto.propertyUpdated = function (propertyName) {
        parent.prototype.propertyUpdated.call(this, propertyName);

        var childElement = this.firstElementChild,
            jqref = $(childElement);

        switch (propertyName) {
            case 'value':
                jqref.jqxDateTimeInput('setDate', serialisedTSToJsDate(this.value));
                break;
            case 'minimum':
                jqref.jqxDateTimeInput({min: serialisedTSToJsDate(this.minimum)});
                break;
            case 'maximum':
                jqref.jqxDateTimeInput({max: serialisedTSToJsDate(this.maximum)});
                break;
            case 'readOnly':
                jqref.jqxDateTimeInput({
                    disabled: this.readOnly,
                    showCalendarButton: !this.readOnly && this.popupEnabled
                });
                break;
        }
    };

    proto.defineElementInfo(proto, 'ni-time-stamp-text-box', 'HTMLNITimeStampTextBox');
    // Inheritance is different from C# view (where time stamp is a numeric) so that min/max/value properties can have a different datatype
}(NationalInstruments.HtmlVI.Elements.TimeStampTextBox, NationalInstruments.HtmlVI.Elements.Visual));
