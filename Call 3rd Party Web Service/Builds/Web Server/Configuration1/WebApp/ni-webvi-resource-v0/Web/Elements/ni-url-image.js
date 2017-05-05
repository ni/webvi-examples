//****************************************
// Url Image Control Prototype
// DOM Registration: No
// National Instruments Copyright 2015
//****************************************

// Constructor Function: Empty (Not Invoked)
NationalInstruments.HtmlVI.Elements.UrlImage = function () {
    'use strict';
};

// Static Public Variables
NationalInstruments.HtmlVI.Elements.UrlImage.StretchEnum = Object.freeze({
    NONE: 'none',                     // Size at the images natural size (Size to actual image size)
    UNIFORM: 'uniform',               // Stretch but maintain aspect ratio (Fit image in space)
    UNIFORM_TO_FILL: 'uniformtofill', // Size respecting aspect ratio, but fill given space (Fit but maintain aspect ratio)
    FILL: 'fill'                      // Size so that the image fills the space ignoring aspect ratio (Stretch to fill space)
});

(function (child, parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var STRETCH_ENUM = NationalInstruments.HtmlVI.Elements.UrlImage.StretchEnum;

    NI_SUPPORT.inheritFromParent(child, parent);
    var proto = child.prototype;

    // Static Private Variables
    // None

    // Static Private Functions
    var createImage = function (urlImageElement) {
        var that = urlImageElement;

        // A div element with background css is used instead of an img element because the img element does not support the different stretch modes
        // but background images with css do support the different stretch modes
        var childElement = document.createElement('div');
        childElement.classList.add('ni-image-box');
        childElement.style.width = '100%';
        childElement.style.height = '100%';

        if (that.source !== '') {
            childElement.style.backgroundImage = 'url(' + that.source + ')';
        }

        // TODO mraj should validate enum value? currently assumes valid string
        if (that.stretch !== '' && that.stretch !== STRETCH_ENUM.NONE) {
            childElement.classList.add('ni-stretch-' + that.stretch);
        }

        childElement.title = that.alternate;
        that.innerHTML = '';
        that.appendChild(childElement);
    };

    // Public Prototype Methods
    proto.addAllProperties = function (targetPrototype) {
        parent.prototype.addAllProperties.call(this, targetPrototype);

        proto.addProperty(targetPrototype, {
            propertyName: 'source',
            defaultValue: '',
            fireEvent: true,
            addNonSignalingProperty: true
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'alternate',
            defaultValue: ''
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'stretch',
            defaultValue: STRETCH_ENUM.UNIFORM
        });

        NI_SUPPORT.setValuePropertyDescriptor(targetPrototype, 'source', 'source', 'sourceNonSignaling', 'source-changed');
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
            case 'alternate':
                createImage(this);
                break;
            case 'stretch':
                createImage(this);
                break;
        }
    };

    proto.defineElementInfo(proto, 'ni-url-image', 'HTMLNIUrlImage');
}(NationalInstruments.HtmlVI.Elements.UrlImage, NationalInstruments.HtmlVI.Elements.Visual));
