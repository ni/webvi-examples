//****************************************
// Boolean Button
// DOM Registration: HTMLNIBooleanButton
// National Instruments Copyright 2014
//****************************************

// Constructor Function: Empty (Not Invoked)
NationalInstruments.HtmlVI.Elements.BooleanButton = function () {
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
            propertyName: 'glyph',
            defaultValue: 0
        });
    };

    proto.attachedCallback = function () {
        var firstCall = parent.prototype.attachedCallback.call(this),
            childElement;

        if (firstCall === true) {

            childElement = document.createElement('button');
            childElement.type = 'button';
            childElement.classList.add('ni-boolean-box');

            var glyphDiv = document.createElement('div');
            glyphDiv.textContent = String.fromCharCode(this.glyph);
            glyphDiv.classList.add('ni-glyph');

            var contentSpan = document.createElement('span');
            contentSpan.textContent = this.content;
            contentSpan.classList.add('ni-text');

            childElement.appendChild(glyphDiv);
            childElement.appendChild(contentSpan);

            // Clear out existing child elements
            this.innerHTML = '';
            this.appendChild(childElement);
        }

        return firstCall;
    };

    proto.propertyUpdated = function (propertyName) {
        parent.prototype.propertyUpdated.call(this, propertyName);

        var childElement = this.firstElementChild,
            glyphDiv = childElement.childNodes[0],
            contentSpan = childElement.childNodes[1];

        switch (propertyName) {
        case 'content':
            contentSpan.textContent = this.content;
            break;
        case 'glyph':
            glyphDiv.textContent = String.fromCharCode(this.glyph);
            break;
        }
    };

    proto.defineElementInfo(proto, 'ni-boolean-button', 'HTMLNIBooleanButton');
}(NationalInstruments.HtmlVI.Elements.BooleanButton, NationalInstruments.HtmlVI.Elements.BooleanControl));
