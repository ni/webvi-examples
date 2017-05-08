//****************************************
// Boolean LED
// DOM Registration: HTMLNIBooleanLED
// National Instruments Copyright 2014
//****************************************

// Constructor Function: Empty (Not Invoked)
NationalInstruments.HtmlVI.Elements.BooleanLED = function () {
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

        // Valid values:
        // round, square
        proto.addProperty(targetPrototype, {
            propertyName: 'shape',
            defaultValue: 'round'
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'highlight',
            defaultValue: ''
        });
    };

    proto.createdCallback = function () {
        parent.prototype.createdCallback.call(this);

        this._trueTextElement = undefined;
        this._falseTextElement = undefined;
    };

    proto.attachedCallback = function () {
        var firstCall = parent.prototype.attachedCallback.call(this),
            childElement, trueText, falseText;

        if (firstCall === true) {
            childElement = document.createElement('button');
            childElement.type = 'button';
            childElement.style.backgroundColor = this.highlight;
            childElement.style.borderColor = this.highlight;
            childElement.classList.add('ni-boolean-box');

            trueText = document.createElement('span');
            trueText.textContent = this.trueContent;
            trueText.classList.add('ni-true-text', 'ni-text');

            falseText = document.createElement('span');
            falseText.textContent = this.falseContent;
            falseText.classList.add('ni-false-text', 'ni-text');

            childElement.appendChild(trueText);
            childElement.appendChild(falseText);

            this._trueTextElement = trueText;
            this._falseTextElement = falseText;
            // Clear out existing child elements
            this.innerHTML = '';
            this.appendChild(childElement);
        }

        return firstCall;
    };

    proto.propertyUpdated = function (propertyName) {
        parent.prototype.propertyUpdated.call(this, propertyName);

        switch (propertyName) {
            case 'trueContent':
                this._trueTextElement.textContent = this.trueContent;
                break;
            case 'falseContent':
                this._falseTextElement.textContent = this.falseContent;
                break;
            case 'highlight':
                this.firstElementChild.style.backgroundColor = this.highlight;
                this.firstElementChild.style.borderColor = this.highlight;
                break;
        }
    };

    proto.defineElementInfo(proto, 'ni-boolean-led', 'HTMLNIBooleanLED');
})(NationalInstruments.HtmlVI.Elements.BooleanLED, NationalInstruments.HtmlVI.Elements.BooleanContentControl);
