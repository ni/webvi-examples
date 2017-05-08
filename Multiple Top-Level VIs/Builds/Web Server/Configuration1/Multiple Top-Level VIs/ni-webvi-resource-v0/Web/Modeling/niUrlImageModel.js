//****************************************
// Url Image Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var STRETCH_ENUM = NationalInstruments.HtmlVI.Elements.UrlImage.StretchEnum;
    var NITypes = window.NITypes;

    // Constructor Function
    NationalInstruments.HtmlVI.Models.UrlImageModel = function (id) {
        parent.call(this, id);

        this.niType = NITypes.STRING;

        // Public Instance Properties
        // None

        // Private Instance Properties
        // None
    };

    // Static Public Variables
    NationalInstruments.HtmlVI.Models.UrlImageModel.MODEL_KIND = 'niUrlImage';

    // Static Public Functions
    // None

    // Prototype creation
    var child = NationalInstruments.HtmlVI.Models.UrlImageModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.registerModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);

        proto.addModelProperty(targetPrototype, { propertyName: 'source', defaultValue: '' });
        proto.addModelProperty(targetPrototype, { propertyName: 'alternate', defaultValue: '' });
        proto.addModelProperty(targetPrototype, { propertyName: 'stretch', defaultValue: STRETCH_ENUM.UNIFORM });
    });

    proto.propertyUsesNITypeProperty = function (propertyName) {
        return propertyName === 'source';
    };

    NationalInstruments.HtmlVI.NIModelProvider.registerModel(child);
}(NationalInstruments.HtmlVI.Models.VisualModel));
