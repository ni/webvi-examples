//****************************************
// String Control Model
// National Instruments Copyright 2015
//****************************************
(function (parent) {
    'use strict';
    // Static private reference aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var NITypes = window.NITypes;

    // Constructor Function
    NationalInstruments.HtmlVI.Models.StringControlModel = function (id) {
        parent.call(this, id);

        this.niType = NITypes.STRING;

        // Public Instance Properties
        // None

        // Private Instance Properties
        // None
    };

    // Static Public Variables
    NationalInstruments.HtmlVI.Models.StringControlModel.MODEL_KIND = 'niStringControl';

    // Static Public Functions
    // None

    // Prototype creation
    var child = NationalInstruments.HtmlVI.Models.StringControlModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.registerModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);

        proto.addModelProperty(targetPrototype, { propertyName: 'text', defaultValue: '' });
        proto.addModelProperty(targetPrototype, { propertyName: 'acceptsReturn', defaultValue: false });
        proto.addModelProperty(targetPrototype, { propertyName: 'typeToReplace', defaultValue: false });
    });

    proto.propertyUsesNITypeProperty = function (propertyName) {
        return propertyName === 'text';
    };

    proto.controlChanged = function () {
        parent.prototype.controlChanged.call(this, 'text', this.text);
    };

    NationalInstruments.HtmlVI.NIModelProvider.registerModel(child);
}(NationalInstruments.HtmlVI.Models.VisualModel));
