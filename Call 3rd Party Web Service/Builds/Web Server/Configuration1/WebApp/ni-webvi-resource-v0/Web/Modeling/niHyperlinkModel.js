//****************************************
// Hyperlink Model
// National Instruments Copyright 2015
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var NITypes = window.NITypes;

    // Constructor Function
    NationalInstruments.HtmlVI.Models.HyperlinkModel = function (id) {
        parent.call(this, id);

        this.niType = NITypes.STRING;
        // Public Instance Properties
        // None

        // Private Instance Properties
        // None
    };

    // Static Public Variables
    NationalInstruments.HtmlVI.Models.HyperlinkModel.MODEL_KIND = 'niHyperlink';

    // Static Public Functions
    // None

    // Prototype creation
    var child = NationalInstruments.HtmlVI.Models.HyperlinkModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.registerModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);

        proto.addModelProperty(targetPrototype, { propertyName: 'href', defaultValue: '' });
        proto.addModelProperty(targetPrototype, { propertyName: 'content', defaultValue: '' });
    });

    proto.propertyUsesNITypeProperty = function (propertyName) {
        return propertyName === 'href';
    };

    NationalInstruments.HtmlVI.NIModelProvider.registerModel(child);
}(NationalInstruments.HtmlVI.Models.VisualModel));
