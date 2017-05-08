//****************************************
// Numeric Control Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static private reference aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var NITypes = window.NITypes;

    // Constructor Function
    NationalInstruments.HtmlVI.Models.NumericControlModel = function (id) {
        parent.call(this, id);

        this.niType = NITypes.DOUBLE;
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
    var child = NationalInstruments.HtmlVI.Models.NumericControlModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    var NI_TYPE_PROPERTIES = {
        'value': true,
        'interval': true,
        'minimum': true,
        'maximum': true
    };

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.registerModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);

        proto.addModelProperty(targetPrototype, { propertyName: 'minimum', defaultValue: 0 });
        proto.addModelProperty(targetPrototype, { propertyName: 'maximum', defaultValue: 10 });
        proto.addModelProperty(targetPrototype, { propertyName: 'interval', defaultValue: 1 });
        proto.addModelProperty(targetPrototype, { propertyName: 'value', defaultValue: 0 });
        proto.addModelProperty(targetPrototype, { propertyName: 'significantDigits', defaultValue: 2 });
        proto.addModelProperty(targetPrototype, { propertyName: 'precisionDigits', defaultValue: -1 });
        proto.addModelProperty(targetPrototype, { propertyName: 'format', defaultValue: 'floating point' });
    });

    proto.propertyUsesNITypeProperty = function (propertyName) {
        return NI_TYPE_PROPERTIES[propertyName] === true;
    };

    proto.controlChanged = function () {
        parent.prototype.controlChanged.call(this, 'value', this.value);
    };

}(NationalInstruments.HtmlVI.Models.VisualModel));
