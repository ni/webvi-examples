//****************************************
// Data Grid Model
// National Instruments Copyright 2015
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var NIType = window.NIType;

    // Constructor Function
    NationalInstruments.HtmlVI.Models.DataGridModel = function (id) {
        parent.call(this, id);

        this.niType = new NIType({name: 'Array', rank: 1, subtype: {name: 'Cluster', fields: []}});
        // Public Instance Properties
        // None

        // Private Instance Properties
        // None
    };

    // Static Public Variables
    // None

    // Static Public Functions
    // None

    // Prototype creation
    var child = NationalInstruments.HtmlVI.Models.DataGridModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    NationalInstruments.HtmlVI.Models.DataGridModel.MODEL_KIND = 'niDataGrid';

    // Methods
    proto.registerModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);

        proto.addModelProperty(targetPrototype, { propertyName: 'rowHeaderVisible', defaultValue: true });
        proto.addModelProperty(targetPrototype, { propertyName: 'columnHeaderVisible', defaultValue: true });
        proto.addModelProperty(targetPrototype, { propertyName: 'showAddRowsToolBar', defaultValue: true });
        proto.addModelProperty(targetPrototype, { propertyName: 'allowSorting', defaultValue: false });
        proto.addModelProperty(targetPrototype, { propertyName: 'allowPaging', defaultValue: false });
        proto.addModelProperty(targetPrototype, { propertyName: 'allowFiltering', defaultValue: false });
        proto.addModelProperty(targetPrototype, { propertyName: 'allowGrouping', defaultValue: false });
        proto.addModelProperty(targetPrototype, { propertyName: 'rowHeight', defaultValue: 25 });
        proto.addModelProperty(targetPrototype, { propertyName: 'altRowColors', defaultValue: false });
        proto.addModelProperty(targetPrototype, { propertyName: 'altRowStart', defaultValue: 1 });
        proto.addModelProperty(targetPrototype, { propertyName: 'altRowStep', defaultValue: 1 });
        proto.addModelProperty(targetPrototype, { propertyName: 'value', defaultValue: [] });
        proto.addModelProperty(targetPrototype, { propertyName: 'isInEditMode', defaultValue: false });
        proto.addModelProperty(targetPrototype, { propertyName: 'selectedColumn', defaultValue: -1 });
    });

    proto.propertyUsesNITypeProperty = function (propertyName) {
        return propertyName === 'value';
    };

    proto.controlChanged = function () {
        parent.prototype.controlChanged.call(this, 'value', this.value);
    };

    NationalInstruments.HtmlVI.NIModelProvider.registerModel(child);
}(NationalInstruments.HtmlVI.Models.VisualModel));
