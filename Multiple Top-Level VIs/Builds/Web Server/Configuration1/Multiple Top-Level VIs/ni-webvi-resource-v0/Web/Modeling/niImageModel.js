//****************************************
// Image Model
// National Instruments Copyright 2016
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var STRETCH_ENUM = NationalInstruments.HtmlVI.Elements.Image.StretchEnum;
    var NITypes = window.NITypes;

    // Constructor Function
    NationalInstruments.HtmlVI.Models.ImageModel = function (id) {
        parent.call(this, id);

        this.niType = NITypes.STRING;
        // Public Instance Properties
        // None

        // Private Instance Properties
        // None
    };

    // Static Public Variables
    NationalInstruments.HtmlVI.Models.ImageModel.MODEL_KIND = 'niImage';

    // Static Public Functions
    // None

    // Prototype creation
    var child = NationalInstruments.HtmlVI.Models.ImageModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.registerModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);

        proto.addModelProperty(targetPrototype, { propertyName: 'source', defaultValue: '' });
        proto.addModelProperty(targetPrototype, { propertyName: 'stretch', defaultValue: STRETCH_ENUM.UNIFORM });
    });

    proto.propertyUsesNITypeProperty = function (propertyName) {
        return propertyName === 'source';
    };

    NationalInstruments.HtmlVI.NIModelProvider.registerModel(child);
}(NationalInstruments.HtmlVI.Models.VisualModel));
