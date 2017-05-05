//****************************************
// Cluster Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var NIType = window.NIType;

    // Constructor Function
    NationalInstruments.HtmlVI.Models.ClusterModel = function (id) {
        parent.call(this, id);

        this.niType = new NIType({name: 'Cluster', fields: []});
        // Public Instance Properties
        // None

        // Private Instance Properties
        // None
    };

    // Static Public Variables
    NationalInstruments.HtmlVI.Models.ClusterModel.MODEL_KIND = 'niCluster';

    // Static Public Functions
    // None

    // Prototype creation
    var child = NationalInstruments.HtmlVI.Models.ClusterModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.addChildModel = function (child) {
        child.suppressControlChanged = true;
        parent.prototype.addChildModel.call(this, child);
    };

    proto.registerModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);

        proto.addModelProperty(targetPrototype, { propertyName: 'value', defaultValue: {} });
    });

    proto.propertyUsesNITypeProperty = function (propertyName) {
        return propertyName === 'value';
    };

    proto.controlChanged = function () {
        parent.prototype.controlChanged.call(this, 'value', this.value);
    };

    NationalInstruments.HtmlVI.NIModelProvider.registerModel(child);
}(NationalInstruments.HtmlVI.Models.VisualModel));
