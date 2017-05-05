/*jslint nomen: true, devel:true*/
/*global NationalInstruments*/
//****************************************
// Boolean Control Prototype
// DOM Registration: No
// National Instruments Copyright 2014
//****************************************

// Constructor Function: Empty (Not Invoked)
NationalInstruments.HtmlVI.Elements.NumericPointer = function () {
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
            propertyName: 'scaleVisible',
            defaultValue: false
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'majorTicksVisible',
            defaultValue: false
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'minorTicksVisible',
            defaultValue: false
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'labelsVisible',
            defaultValue: false
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'coercionMode',
            defaultValue: false
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'rangeDivisionsMode',
            defaultValue: 'auto'
        });
    };

    proto.convertFormatToRadix = function (format) {
        switch (format) {
            case 'hexadecimal':
                return 16;
            case 'octal':
                return 8;
            case 'binary':
                return 2;
        }

        return undefined;
    };

}(NationalInstruments.HtmlVI.Elements.NumericPointer, NationalInstruments.HtmlVI.Elements.NumericControl));
