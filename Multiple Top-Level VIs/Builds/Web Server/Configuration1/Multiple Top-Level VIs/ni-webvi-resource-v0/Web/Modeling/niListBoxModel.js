//****************************************
// ListBox Model
// National Instruments Copyright 2015
//****************************************
(function (parent) {
    'use strict';
    // Static private reference aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var SELECTION_MODE_ENUM = NationalInstruments.HtmlVI.NIListBox.SelectionModeEnum;
    var NITypes = window.NITypes;

    // Constructor Function
    NationalInstruments.HtmlVI.Models.ListBoxModel = function (id) {
        parent.call(this, id);

        this.niType = NITypes.INT32;

        // Public Instance Properties
        // None

        // Private Instance Properties
        // None
    };

    // Static Public Variables
    NationalInstruments.HtmlVI.Models.ListBoxModel.MODEL_KIND = 'niListBox';

    // Static Public Functions
    // None

    // Prototype creation
    var child = NationalInstruments.HtmlVI.Models.ListBoxModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.registerModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);

        proto.addModelProperty(targetPrototype, { propertyName: 'selectionMode', defaultValue: SELECTION_MODE_ENUM.ONE });
        proto.addModelProperty(targetPrototype, { propertyName: 'selectedIndex', defaultValue: -1 });
    });

    proto.propertyUsesNITypeProperty = function (propertyName) {
        return propertyName === 'selectedIndex';
    };

    proto.controlChanged = function () {
        parent.prototype.controlChanged.call(this, 'selectedIndex', this.selectedIndex);
    };

    NationalInstruments.HtmlVI.NIModelProvider.registerModel(child);
}(NationalInstruments.HtmlVI.Models.SelectorModel));
