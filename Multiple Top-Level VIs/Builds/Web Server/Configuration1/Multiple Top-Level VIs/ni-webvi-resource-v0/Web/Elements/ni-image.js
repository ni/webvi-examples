//****************************************
// Image Control Prototype
// DOM Registration: Yes
// National Instruments Copyright 2016
//****************************************

// Constructor Function: Empty (Not Invoked)
NationalInstruments.HtmlVI.Elements.Image = function () {
    'use strict';
};

// Static Public Variables
NationalInstruments.HtmlVI.Elements.Image.StretchEnum = Object.freeze({
    NONE: 'none',                     // Size at the images natural size (Size to actual image size)
    UNIFORM: 'uniform',               // Stretch but maintain aspect ratio (Fit image in space)
    UNIFORM_TO_FILL: 'uniformtofill', // Size respecting aspect ratio, but fill given space (Fit but maintain aspect ratio)
    FILL: 'fill'                      // Size so that the image fills the space ignoring aspect ratio (Stretch to fill space)
});

(function (child, parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var STRETCH_ENUM = NationalInstruments.HtmlVI.Elements.Image.StretchEnum;

    NI_SUPPORT.inheritFromParent(child, parent);
    var proto = child.prototype;

    // Static Private Variables
    // None

    // Static Private Functions
    var createImage = function (imageElement) {
        var that = imageElement;

        // A div element with background css is used instead of an img element because the img element does not support the different stretch modes
        // but background images with css do support the different stretch modes
        var childElement = document.createElement('div');
        childElement.classList.add('ni-image-box');
        childElement.style.width = '100%';
        childElement.style.height = '100%';

        if (that.source !== '') {
            childElement.style.backgroundImage = 'url(data:;base64,' + that.source + ')';
        }

        // TODO mraj should validate enum value? currently assumes valid string
        if (that.stretch !== '' && that.stretch !== STRETCH_ENUM.NONE) {
            childElement.classList.add('ni-stretch-' + that.stretch);
        }

        that.innerHTML = '';
        that.appendChild(childElement);
    };

    // Public Prototype Methods
    proto.addAllProperties = function (targetPrototype) {
        parent.prototype.addAllProperties.call(this, targetPrototype);

        proto.addProperty(targetPrototype, {
            propertyName: 'source',
            defaultValue: ''
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'stretch',
            defaultValue: STRETCH_ENUM.UNIFORM
        });
    };

    proto.attachedCallback = function () {
        var firstCall = parent.prototype.attachedCallback.call(this);

        if (firstCall === true) {
            createImage(this);
        }

        return firstCall;
    };

    proto.propertyUpdated = function (propertyName) {
        parent.prototype.propertyUpdated.call(this, propertyName);

        switch (propertyName) {
            case 'source':
                createImage(this);
                break;
            case 'stretch':
                createImage(this);
                break;
        }
    };

    proto.defineElementInfo(proto, 'ni-image', 'HTMLNIImage');
}(NationalInstruments.HtmlVI.Elements.Image, NationalInstruments.HtmlVI.Elements.Visual));
