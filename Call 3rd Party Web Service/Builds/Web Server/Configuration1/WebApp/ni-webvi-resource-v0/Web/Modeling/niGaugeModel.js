//****************************************
// Gauge Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    // Constructor Function
    NationalInstruments.HtmlVI.Models.GaugeModel = function (id) {
        parent.call(this, id);

        // Public Instance Properties
        // None

        // Private Instance Properties
        // None
    };

    // Static Public Variables
    NationalInstruments.HtmlVI.Models.GaugeModel.MODEL_KIND = 'niGauge';

    // Static Public Functions
    // None

    // Prototype creation
    var child = NationalInstruments.HtmlVI.Models.GaugeModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.registerModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);

        proto.addModelProperty(targetPrototype, { propertyName: 'analogDisplayType', defaultValue: 'needle' });
        proto.addModelProperty(targetPrototype, { propertyName: 'digitalDisplayVisible', defaultValue: false });
        proto.addModelProperty(targetPrototype, { propertyName: 'digitalDisplayPosition', defaultValue: 'bottom' });
    });

    NationalInstruments.HtmlVI.NIModelProvider.registerModel(child);
}(NationalInstruments.HtmlVI.Models.RadialNumericPointerModel));
