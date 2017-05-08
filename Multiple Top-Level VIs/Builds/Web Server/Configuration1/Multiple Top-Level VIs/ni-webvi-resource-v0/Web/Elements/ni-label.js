//****************************************
// Label Prototype
// DOM Registration: No
// National Instruments Copyright 2015
//****************************************

// Constructor Function: Empty (Not Invoked)
NationalInstruments.HtmlVI.Elements.Label = function () {
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

        proto.addProperty(targetPrototype, {
            propertyName: 'controlId',
            defaultValue: ''
        });
    };

    proto.attachedCallback = function () {
        var firstCall = parent.prototype.attachedCallback.call(this),
            labelTag;

        if (firstCall === true) {
            labelTag = document.createElement('label');
            this.appendChild(labelTag);
            labelTag.textContent = this.text;
            // We want to eventually associate labels with their widgets so that screen readers can associate them.
            // This is sort of how we would do it, but this doesn't work because the id that htmlFor points to
            // needs to be an input, which our controls are not (the have children that are inputs)
            // labelTag.htmlFor = this.controlId;
        }

        return firstCall;
    };

    proto.propertyUpdated = function (propertyName) {
        parent.prototype.propertyUpdated.call(this, propertyName);

        var labelElement = this.firstElementChild;

        switch (propertyName) {
            case 'text':
                labelElement.textContent = this.text;
                break;
            default:
                break;
        }
    };

    proto.defineElementInfo(proto, 'ni-label', 'HTMLNILabel');
}(NationalInstruments.HtmlVI.Elements.Label, NationalInstruments.HtmlVI.Elements.Visual));
