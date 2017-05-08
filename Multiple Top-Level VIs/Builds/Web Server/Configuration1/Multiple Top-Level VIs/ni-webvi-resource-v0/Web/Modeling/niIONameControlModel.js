//****************************************
// IOName control Model
// National Instruments Copyright 2015
//****************************************
(function (parent) {
    'use strict';
    // Static private reference aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    // Constructor Function
    NationalInstruments.HtmlVI.Models.IONameControlModel = function (id) {
        parent.call(this, id);

        // Public Instance Properties
        // None

        // Private Instance Properties
        // None
    };

    // Static Public Variables
    NationalInstruments.HtmlVI.Models.IONameControlModel.MODEL_KIND = 'niIoNameControl';

    // Static Public Functions
    // None

    // Prototype creation
    var child = NationalInstruments.HtmlVI.Models.IONameControlModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.registerModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);

        proto.addModelProperty(targetPrototype, { propertyName: 'source', defaultValue: [] });
        proto.addModelProperty(targetPrototype, { propertyName: 'selectedValue', defaultValue: '' });
        proto.addModelProperty(targetPrototype, { propertyName: 'allowMultipleSelection', defaultValue: true });
        proto.addModelProperty(targetPrototype, { propertyName: 'allowUndefinedValues', defaultValue: true });
        proto.addModelProperty(targetPrototype, { propertyName: 'showUserCreateResource', defaultValue: true });
        proto.addModelProperty(targetPrototype, { propertyName: 'showUserRefresh', defaultValue: false });
        proto.addModelProperty(targetPrototype, { propertyName: 'showUserBrowse', defaultValue: false });
        proto.addModelProperty(targetPrototype, { propertyName: 'caseSensitive', defaultValue: false });
    });

    proto.controlChanged = function () {
        parent.prototype.controlChanged.call(this, 'selectedValue', this.selectedValue);
    };

    NationalInstruments.HtmlVI.NIModelProvider.registerModel(child);
}(NationalInstruments.HtmlVI.Models.VisualModel));
