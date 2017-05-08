//****************************************
// Hyperlink Control Prototype
// DOM Registration: No
// National Instruments Copyright 2015
//****************************************

// Constructor Function: Empty (Not Invoked)
NationalInstruments.HtmlVI.Elements.Hyperlink = function () {
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
            propertyName: 'href',
            defaultValue: '',
            fireEvent: true,
            addNonSignalingProperty: true
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'content',
            defaultValue: ''
        });

        NI_SUPPORT.setValuePropertyDescriptor(targetPrototype, 'href', 'href', 'hrefNonSignaling', 'href-changed');
    };

    proto.attachedCallback = function () {
        var firstCall = parent.prototype.attachedCallback.call(this),
            childElement;

        if (firstCall === true) {
            childElement = document.createElement('a');
            childElement.setAttribute('href', this.href);
            childElement.setAttribute('target', '_blank'); // We want to open the link in a new tab/window. devdocs.io/html/element/a#attr-target
            childElement.textContent = this.content;

            // Clear out existing child elements
            this.innerHTML = '';
            this.appendChild(childElement);
        }

        return firstCall;
    };

    proto.propertyUpdated = function (propertyName) {
        parent.prototype.propertyUpdated.call(this, propertyName);

        var childElement = this.firstElementChild;

        switch (propertyName) {
            case 'href':
                childElement.setAttribute('href', this.href);
                break;
            case 'content':
                childElement.textContent = this.content;
                break;
        }
    };

    proto.defineElementInfo(proto, 'ni-hyperlink', 'HTMLNIHyperlink');
}(NationalInstruments.HtmlVI.Elements.Hyperlink, NationalInstruments.HtmlVI.Elements.Visual));
