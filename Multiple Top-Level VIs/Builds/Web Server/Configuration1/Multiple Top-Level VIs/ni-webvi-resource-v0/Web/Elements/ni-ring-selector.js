//****************************************
// RingSelector Prototype
// DOM Registration: No
// National Instruments Copyright 2015
//****************************************

// Constructor Function: Empty (Not Invoked)
NationalInstruments.HtmlVI.Elements.RingSelector = function () {
    'use strict';
};

// Static Public Variables
// None

(function (child, parent) {
    'use strict';
    // Static Private Reference Aliases
    var $ = NationalInstruments.Globals.jQuery;
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var NIType = window.NIType;

    NI_SUPPORT.inheritFromParent(child, parent);
    var proto = child.prototype;

    // Static private reference aliases
    var NUM_VAL_CONVERTER = NationalInstruments.HtmlVI.ValueConverters.NumericValueConverter;

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.addAllProperties = function (targetPrototype) {
        parent.prototype.addAllProperties.call(this, targetPrototype);

        proto.addProperty(targetPrototype, {
            propertyName: 'allowUndefined',
            defaultValue: false
        });
    };

    proto.createdCallback = function () {
        parent.prototype.createdCallback.call(this);
        this._valueChanging = false;
        this._itemsUpdating = false;
    };

    proto.attachedCallback = function () {
        var firstCall = parent.prototype.attachedCallback.call(this),
            widgetSettings, jqref, jqrefNumeric,
            that = this;

        if (firstCall === true) {
            widgetSettings = {};

            var dropDownContainer = document.createElement('div');
            this.appendChild(dropDownContainer);

            jqref = $(dropDownContainer);
            jqref.jqxDropDownList(widgetSettings);

            var numericInput = document.createElement('input');
            numericInput.type = 'text';
            this.appendChild(numericInput);

            jqrefNumeric = $(numericInput);
            var numericWidgetSettings = {};
            numericWidgetSettings.readOnly = this.readOnly;
            numericWidgetSettings.spinButtons = false;

            jqrefNumeric.jqxFormattedInput(numericWidgetSettings);

            var data = this.getSourceAndSelectedIndexFromSource();
            var selectedIndex = data.selectedIndex;
            var source = data.source;

            jqref.jqxDropDownList({ source: source, selectedIndex: selectedIndex, autoDropDownHeight: true, disabled: this.readOnly });
            // TODO: gleon check with jqWidgets about this hack.
            if (this.popupEnabled === false) {
                jqref.on('open', function () {
                    jqref.jqxDropDownList('close');
                });
                jqref.jqxDropDownList({animationType: 'none'});
            }

            jqref.on('change', function (event) {
                var args = event.args;
                if (args && !that._itemsUpdating) {
                    var displayValue = args.item.value;
                    var numericIndex = that.selectChangedHandler(displayValue);
                    that._valueChanging = true;
                    jqrefNumeric.jqxFormattedInput('val', numericIndex);
                    that._valueChanging = false;
                }
            });
            jqrefNumeric.on('change', function () {
                var value = jqrefNumeric.val();
                that.value = NUM_VAL_CONVERTER.convert(value, new NIType(that.niType), true);
            });

            // Add CSS class names
            jqref.addClass('ni-expand-button');
            jqrefNumeric.addClass('ni-ring-numeric-input');
        }

        return firstCall;
    };

    proto.forceResize = function (size) {
        parent.prototype.forceResize.call(this, size);
        var jqref = $(this.firstElementChild),
            jqrefNumeric = $(this.querySelector('input'));

        if (this.allowUndefined) {
            size.width *= 0.7;
            jqrefNumeric.trigger('resize');
        }

        jqref.jqxDropDownList(size);
    };

    proto.propertyUpdated = function (propertyName) {
        parent.prototype.propertyUpdated.call(this, propertyName);
        var jqref = $(this.firstElementChild),
            jqrefNumeric = $(this.querySelector('input'));

        switch (propertyName) {
            case 'items':
            case 'readOnly':
                this._itemsUpdating = true;
                this.propertyUpdatedHelper(propertyName, jqref, true);
                this._itemsUpdating = false;
                break;
            case 'value':
                if (!this._itemsUpdating && !this._valueChanging) {
                    this._valueChanging = true;
                    this.propertyUpdatedHelper(propertyName, jqref, this.allowUndefined);

                    var numericWidgetSettings = {
                        value: NUM_VAL_CONVERTER.convertBack(this.value, new NIType(this.niType))
                    };
                    jqrefNumeric.jqxFormattedInput(numericWidgetSettings);
                    this._valueChanging = false;
                }

                break;
            case 'allowUndefined':
                var width = $(this).width();
                if (this.allowUndefined) {
                    width *= 0.7;
                } else {
                    var itemsArray = this.itemsCache().itemsArray;
                    var lastItem = itemsArray[itemsArray.length - 1];
                    var displayValue = lastItem.displayValue;
                    if (displayValue.substring(0, 1) === '<') {
                        this.itemsCache().pop();
                        this.propertyUpdatedHelper('items', jqref, false);
                    }
                }

                jqref.jqxDropDownList({ width: width });
                break;
            default:
                break;
        }
    };

    proto.defineElementInfo(proto, 'ni-ring-selector', 'HTMLNIRingSelector');
}(NationalInstruments.HtmlVI.Elements.RingSelector, NationalInstruments.HtmlVI.Elements.NumericValueSelector));
