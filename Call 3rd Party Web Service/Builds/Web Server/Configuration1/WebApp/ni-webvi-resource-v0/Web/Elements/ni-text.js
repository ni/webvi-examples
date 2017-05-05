//****************************************
// Text Prototype
// DOM Registration: No
// National Instruments Copyright 2015
//****************************************

// Constructor Function: Empty (Not Invoked)
NationalInstruments.HtmlVI.Elements.Text = function () {
    'use strict';
};

// Static Public Variables
// None

(function (child, parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

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
            propertyName: 'text',
            defaultValue: ''
        });
    };

    proto.attachedCallback = function () {
        var firstCall = parent.prototype.attachedCallback.call(this),
            divTag;

        if (firstCall === true) {
            divTag = document.createElement('div');
            divTag.textContent = this.text;
            this.appendChild(divTag);
        }

        return firstCall;
    };

    proto.propertyUpdated = function (propertyName) {
        parent.prototype.propertyUpdated.call(this, propertyName);

        var divElement = this.firstElementChild;

        switch (propertyName) {
            case 'text':
                divElement.textContent = this.text;
                break;
            default:
                break;
        }
    };

    proto.defineElementInfo(proto, 'ni-text', 'HTMLNIText');
}(NationalInstruments.HtmlVI.Elements.Text, NationalInstruments.HtmlVI.Elements.Visual));
