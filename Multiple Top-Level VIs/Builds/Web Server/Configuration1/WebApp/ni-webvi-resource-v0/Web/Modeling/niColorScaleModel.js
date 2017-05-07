//****************************************
// Cartesian Axis Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    // Constructor Function
    NationalInstruments.HtmlVI.Models.ColorScaleModel = function (id) {
        parent.call(this, id);

        // Public Instance Properties
        // None

        // Private Instance Properties
        // None
    };

    // Static Public Variables
    NationalInstruments.HtmlVI.Models.ColorScaleModel.MODEL_KIND = 'niColorScale';

    // Static Public Functions
    // None

    // Prototype creation
    var child = NationalInstruments.HtmlVI.Models.ColorScaleModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.registerModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);

        proto.addModelProperty(targetPrototype, { propertyName: 'axisPosition', defaultValue: 'right' });
        proto.addModelProperty(targetPrototype, { propertyName: 'autoScale', defaultValue: 'auto' });
        proto.addModelProperty(targetPrototype, { propertyName: 'showAxis', defaultValue: true });
        proto.addModelProperty(targetPrototype, { propertyName: 'highColor', defaultValue: '#ffffff' });
        proto.addModelProperty(targetPrototype, { propertyName: 'lowColor', defaultValue: '#000000' });
        proto.addModelProperty(targetPrototype, { propertyName: 'markers', defaultValue: '' });
        proto.addModelProperty(targetPrototype, { propertyName: 'label', defaultValue: '' });
        proto.addModelProperty(targetPrototype, { propertyName: 'showLabel', defaultValue: true });
        proto.addModelProperty(targetPrototype, { propertyName: 'show', defaultValue: true });
    });

    NationalInstruments.HtmlVI.NIModelProvider.registerModel(child);
}(NationalInstruments.HtmlVI.Models.VisualModel));
