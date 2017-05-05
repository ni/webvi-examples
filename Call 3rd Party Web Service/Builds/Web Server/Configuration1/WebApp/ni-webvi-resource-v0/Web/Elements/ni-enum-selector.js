//****************************************
// EnumSelector Prototype
// DOM Registration: No
// National Instruments Copyright 2015
//****************************************

// Constructor Function: Empty (Not Invoked)
NationalInstruments.HtmlVI.Elements.EnumSelector = function () {
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
    // None

    // Public Prototype Methods

    proto.attachedCallback = function () {
        var firstCall = parent.prototype.attachedCallback.call(this),
            widgetSettings,
            jqref,
            that = this;

        if (firstCall === true) {
            widgetSettings = {};
            var dropDownChildElement = document.createElement('div');
            dropDownChildElement.classList.add('ni-expand-button');

            this.innerHTML = '';
            this.appendChild(dropDownChildElement);
            jqref = $(dropDownChildElement);

            var data = this.getSourceAndSelectedIndexFromSource();
            widgetSettings.selectedIndex = data.selectedIndex;
            widgetSettings.source = data.source;
            widgetSettings.autoDropDownHeight = true;
            widgetSettings.disabled = this.readOnly;

            jqref.jqxDropDownList(widgetSettings);
            jqref.on('change', function (event) {
                var args = event.args;
                if (args) {
                    var displayValue = args.item.value;
                    that.selectChangedHandler(displayValue);
                }
            });
            // TODO: gleon check with jqWidgets about this hack.
            if (this.popupEnabled === false) {
                jqref.on('open', function () {
                    jqref.jqxDropDownList('close');
                });
                jqref.jqxDropDownList({animationType: 'none'});
            }
        }

        return firstCall;
    };

    proto.forceResize = function (size) {
        parent.prototype.forceResize.call(this, size);
        $(this.firstElementChild).jqxDropDownList(size);
    };

    proto.propertyUpdated = function (propertyName) {
        parent.prototype.propertyUpdated.call(this, propertyName);
        var jqref = $(this.firstElementChild);
        switch (propertyName) {
            case 'items':
            case 'value':
            case 'readOnly':
                this.propertyUpdatedHelper.call(this, propertyName, jqref, false);
                break;
            default:
                break;
        }
    };

    proto.defineElementInfo(proto, 'ni-enum-selector', 'HTMLNIEnumSelector');
}(NationalInstruments.HtmlVI.Elements.EnumSelector, NationalInstruments.HtmlVI.Elements.NumericValueSelector));
