//****************************************
// Linear Numeric Pointer Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static private reference aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    // Constructor Function
    NationalInstruments.HtmlVI.Models.LinearNumericPointerModel = function (id) {
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
    var child = NationalInstruments.HtmlVI.Models.LinearNumericPointerModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.registerModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);

        proto.addModelProperty(targetPrototype, { propertyName: 'orientation', defaultValue: 'horizontal' });
        proto.addModelProperty(targetPrototype, { propertyName: 'mechanicalAction', defaultValue: 'switchWhileDragging' });
    });

    proto.sizeChanged = function (dimension, value) {
        this.internalControlEventOccurred('DesiredSizeChanged', { dimension: dimension, value: value });
    };

}(NationalInstruments.HtmlVI.Models.NumericPointerModel));
