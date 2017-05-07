//****************************************
// Virtual Instrument Prototype
// DOM Registration: HTMLNIVirtualInstrument
// National Instruments Copyright 2014
//****************************************
NationalInstruments.HtmlVI.Elements.VirtualInstrument = function () {
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
            propertyName: 'viName',
            defaultValue: ''
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'viRef',
            defaultValue: ''
        });

    };

    proto.attachedCallback = function () {
        var firstCall = parent.prototype.attachedCallback.call(this);

        NationalInstruments.HtmlVI.viReferenceService.registerVIElement(this);

        return firstCall;
    };

    proto.detachedCallback = function () {
        NationalInstruments.HtmlVI.viReferenceService.unregisterVIElement(this);
    };

    proto.defineElementInfo(proto, 'ni-virtual-instrument', 'HTMLNIVirtualInstrument');
}(NationalInstruments.HtmlVI.Elements.VirtualInstrument, NationalInstruments.HtmlVI.Elements.NIElement));
