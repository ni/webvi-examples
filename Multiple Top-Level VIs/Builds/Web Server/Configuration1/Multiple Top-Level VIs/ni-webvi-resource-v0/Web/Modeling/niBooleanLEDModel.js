//****************************************
// Boolean LED Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    // Constructor Function
    NationalInstruments.HtmlVI.Models.BooleanLEDModel = function (id) {
        parent.call(this, id);

        // Public Instance Properties
        // None

        // Private Instance Properties
        // None
    };

    // Static Public Variables
    NI_SUPPORT.defineConstReference(NationalInstruments.HtmlVI.Models.BooleanLEDModel, 'MODEL_KIND', 'niBooleanLED');

    NI_SUPPORT.defineConstReference(NationalInstruments.HtmlVI.Models.BooleanLEDModel, 'ShapeEnum', Object.freeze({
        ROUND:      'round',
        SQUARE:     'square'
    }));

    // Static Public Functions
    // None

    // Prototype creation
    var child = NationalInstruments.HtmlVI.Models.BooleanLEDModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.registerModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);

        proto.addModelProperty(targetPrototype, { propertyName: 'shape', defaultValue: NationalInstruments.HtmlVI.Models.BooleanLEDModel.ShapeEnum.ROUND });
        proto.addModelProperty(targetPrototype, { propertyName: 'highlight', defaultValue: '' });
    });

    NationalInstruments.HtmlVI.NIModelProvider.registerModel(child);
}(NationalInstruments.HtmlVI.Models.BooleanContentControlModel));
