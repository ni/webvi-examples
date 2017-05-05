//****************************************
// Graph Base Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var NIType = window.NIType;
    var NITypeNames = window.NITypeNames;

    // Constructor Function
    NationalInstruments.HtmlVI.Models.GraphBaseModel = function (id) {
        parent.call(this, id);

        this.niType = new NIType({name: NITypeNames.ARRAY, rank: 1, subtype: NITypeNames.DOUBLE });
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
    var child = NationalInstruments.HtmlVI.Models.GraphBaseModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.registerModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);

        proto.addModelProperty(targetPrototype, {
            propertyName: 'value',
            defaultValue: [],
            customSetter: function (oldValue, newValue) {
                if (typeof newValue === 'string') {
                    return JSON.parse(newValue);
                } else {
                    return newValue;
                }
            }
        });
        proto.addModelProperty(targetPrototype, { propertyName: 'plotAreaMargin', defaultValue: '' });
    });

    proto.propertyUsesNITypeProperty = function (propertyName) {
        return propertyName === 'value';
    };

}(NationalInstruments.HtmlVI.Models.VisualModel));
