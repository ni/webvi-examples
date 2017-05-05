/*jslint nomen: true, devel:true*/
/*global NationalInstruments*/
//****************************************
// Boolean Control Prototype
// DOM Registration: No
// National Instruments Copyright 2014
//****************************************

// Constructor Function: Empty (Not Invoked)
NationalInstruments.HtmlVI.Elements.ProgressBar = function () {
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
            propertyName: 'value',
            defaultValue: 0,
            fireEvent: true,
            addNonSignalingProperty: true
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'minimum',
            defaultValue: 0
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'maximum',
            defaultValue: 10
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'orientation',
            defaultValue: 'horizontal'
        });

        NI_SUPPORT.setValuePropertyDescriptor(targetPrototype, 'value', 'value', 'valueNonSignaling', 'value-changed');
    };

}(NationalInstruments.HtmlVI.Elements.ProgressBar, NationalInstruments.HtmlVI.Elements.Visual));
