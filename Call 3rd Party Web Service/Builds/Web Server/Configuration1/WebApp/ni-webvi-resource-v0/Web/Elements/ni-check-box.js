//****************************************
// CheckBox Prototype
// DOM Registration: HTMLNICheckBox
// National Instruments Copyright 2014
//****************************************

// Constructor Function: Empty (Not Invoked)
NationalInstruments.HtmlVI.Elements.CheckBox = function () {
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
            childElement,
            jqref,
            labelText;

        if (firstCall === true) {
            widgetSettings = {};
            widgetSettings.checked = this.value;
            widgetSettings.animationShowDelay = 0;
            widgetSettings.animationHideDelay = 0;

            childElement = document.createElement('div');
            childElement.classList.add('ni-boolean-box');

            labelText = document.createElement('label');
            labelText.textContent = this.content;

            this.innerHTML = '';
            this.appendChild(childElement);
            this.appendChild(labelText);

            jqref = $(childElement);
            jqref.jqxCheckBox(widgetSettings);
            jqref.jqxCheckBox('_removeHandlers');

            // jqx will generate an id so use it after invoked
            labelText.setAttribute('for', childElement.id);
        }

        return firstCall;
    };

    proto.propertyUpdated = function (propertyName) {
        parent.prototype.propertyUpdated.call(this, propertyName);

        var childElement = this.firstElementChild,
            labelText = this.lastElementChild,
            jqref = $(childElement),
            that = this;

        switch (propertyName) {
        case 'content':
            labelText.textContent = this.content;
            break;
        case 'value':
            jqref.jqxCheckBox({
                checked: that.value
            });
            break;
        }
    };

    proto.defineElementInfo(proto, 'ni-check-box', 'HTMLNICheckBox');
}(NationalInstruments.HtmlVI.Elements.CheckBox, NationalInstruments.HtmlVI.Elements.BooleanControl));
