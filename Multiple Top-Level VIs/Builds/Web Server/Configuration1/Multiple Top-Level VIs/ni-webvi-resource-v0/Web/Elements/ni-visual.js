//****************************************
// Visual Prototype
// DOM Registration: No
// National Instruments Copyright 2014
//****************************************

// Constructor Function: Empty (Not Invoked)
NationalInstruments.HtmlVI.Elements.Visual = function () {
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
            propertyName: 'readOnly',
            defaultValue: false
        });
    };

    proto.isTextEditFocusable = function () {
        return false;
    };

    // Only implement for broken child elements that for some reason do not inherit
    // font properties from the containing custom element
    proto.setFont = function (fontSize, fontFamily, fontWeight, fontStyle, textDecoration) {
        this.style.fontSize = fontSize;
        this.style.fontFamily = fontFamily;
        this.style.fontWeight = fontWeight;
        this.style.fontStyle = fontStyle;
        this.style.textDecoration = textDecoration;
    };

}(NationalInstruments.HtmlVI.Elements.Visual, NationalInstruments.HtmlVI.Elements.VisualComponent));
