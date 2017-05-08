//****************************************
// Boolean Button Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static private reference aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var NITypes = window.NITypes;

    // Constructor Function
    NationalInstruments.HtmlVI.Models.TabControlModel = function (id) {
        parent.call(this, id);

        this.niType = NITypes.INT32;

        // Public Instance Properties
        // None

        // Private Instance Properties
        // None
    };

    // Static Public Variables
    NationalInstruments.HtmlVI.Models.TabControlModel.MODEL_KIND = 'niTabControl';

    // Static Public Functions
    // None

    // Prototype creation
    var child = NationalInstruments.HtmlVI.Models.TabControlModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.registerModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);

        proto.addModelProperty(targetPrototype, { propertyName: 'tabStripPlacement', defaultValue: 'top' });
        proto.addModelProperty(targetPrototype, { propertyName: 'selectedIndex', defaultValue: 0 });
    });

    proto.propertyUsesNITypeProperty = function (propertyName) {
        return propertyName === 'selectedIndex';
    };

    proto.controlChanged = function () {
        parent.prototype.controlChanged.call(this, 'selectedIndex', this.selectedIndex);
    };

    NationalInstruments.HtmlVI.NIModelProvider.registerModel(child);
}(NationalInstruments.HtmlVI.Models.VisualModel));
