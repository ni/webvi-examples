//****************************************
// Slider Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static private reference aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    // Constructor Function
    NationalInstruments.HtmlVI.Models.SliderModel = function (id) {
        parent.call(this, id);

        // Public Instance Properties
        // None

        // Private Instance Properties
        // None
    };

    // Static Public Variables
    NationalInstruments.HtmlVI.Models.SliderModel.MODEL_KIND = 'niSlider';

    // Static Public Functions
    // None

    // Prototype creation
    var child = NationalInstruments.HtmlVI.Models.SliderModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.registerModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);

        proto.addModelProperty(targetPrototype, { propertyName: 'showTooltip', defaultValue: true });
    });

    NationalInstruments.HtmlVI.NIModelProvider.registerModel(child);
}(NationalInstruments.HtmlVI.Models.LinearNumericPointerModel));
