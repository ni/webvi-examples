//****************************************
// Numeric Pointer Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static private reference aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    // Constructor Function
    NationalInstruments.HtmlVI.Models.NumericPointerModel = function (id) {
        parent.call(this, id);

        // Public Instance Properties
        // None

        // Private Instance Properties
        // None
    };

    // Static Public Variables
    // None

    // Static Public Functions
    // None

    // Prototype creation
    var child = NationalInstruments.HtmlVI.Models.NumericPointerModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.registerModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);

        proto.addModelProperty(targetPrototype, { propertyName: 'scaleVisible', defaultValue: true });
        proto.addModelProperty(targetPrototype, { propertyName: 'majorTicksVisible', defaultValue: true });
        proto.addModelProperty(targetPrototype, { propertyName: 'minorTicksVisible', defaultValue: true });
        proto.addModelProperty(targetPrototype, { propertyName: 'labelsVisible', defaultValue: true });
        proto.addModelProperty(targetPrototype, { propertyName: 'coercionMode', defaultValue: false });
        proto.addModelProperty(targetPrototype, { propertyName: 'rangeDivisionsMode', defaultValue: 'auto' });
    });

}(NationalInstruments.HtmlVI.Models.NumericControlModel));

