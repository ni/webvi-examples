//****************************************
// DropDown Prototype
// DOM Registration: No
// National Instruments Copyright 2015
//****************************************

// Constructor Function: Empty (Not Invoked)
NationalInstruments.HtmlVI.Elements.DropDown = function () {
    'use strict';
};

// Static Public Variables
// None

(function (child, parent) {
    'use strict';
    // Static Private Reference Aliases
    var $ = NationalInstruments.Globals.jQuery;
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var SELECTOR = NationalInstruments.HtmlVI.Elements.Selector;

    NI_SUPPORT.inheritFromParent(child, parent);
    var proto = child.prototype;

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.addAllProperties = function (targetPrototype) {
        parent.prototype.addAllProperties.call(this, targetPrototype);

        proto.addProperty(targetPrototype, {
            propertyName: 'selectedIndex',
            defaultValue: -1,
            fireEvent: true,
            addNonSignalingProperty: true
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'popupEnabled',
            defaultValue: false
        });

        NI_SUPPORT.setValuePropertyDescriptor(targetPrototype, 'selectedIndex', 'selectedIndex', 'selectedIndexNonSignaling', 'selected-index-changed');
    };

    proto.attachedCallback = function () {
        var firstCall = parent.prototype.attachedCallback.call(this),
            widgetSettings,
            childElement,
            jqref,
            that = this;

        if (firstCall === true) {
            widgetSettings = {
                source: SELECTOR.parseAndEscapeSource(this.source),
                selectedIndex: this.selectedIndex,
                autoDropDownHeight: true,
                disabled: this.readOnly
            };

            childElement = document.createElement('div');
            childElement.classList.add('ni-expand-button');

            this.appendChild(childElement);

            jqref = $(childElement);
            jqref.jqxDropDownList(widgetSettings);
            jqref.on('change', function (event) {
                that.selectedIndex = event.args.index;
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

        var childElement = this.firstElementChild,
            jqref = $(childElement);

        switch (propertyName) {
            case 'source':
                jqref.jqxDropDownList({ source: SELECTOR.parseAndEscapeSource(this.source) });
                break;
            case 'selectedIndex':
                jqref.jqxDropDownList({ selectedIndex: this.selectedIndex });
                break;
        }
    };

    proto.defineElementInfo(proto, 'ni-drop-down', 'HTMLNIDropDown');
}(NationalInstruments.HtmlVI.Elements.DropDown, NationalInstruments.HtmlVI.Elements.Selector));
