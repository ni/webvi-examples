//****************************************
// Array viewer Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var NIType = window.NIType;
    var NITypeNames = window.NITypeNames;

    // Constructor Function
    NationalInstruments.HtmlVI.Models.ArrayViewerModel = function (id) {
        parent.call(this, id);

        this.niType = new NIType({name: NITypeNames.ARRAY, rank: 1, subtype: {name: NITypeNames.VOID}});
        // Public Instance Properties
        // None

        // Private Instance Properties
        // None
    };

    // Static Public Variables
    NI_SUPPORT.defineConstReference(NationalInstruments.HtmlVI.Models.ArrayViewerModel, 'MODEL_KIND', 'niArrayViewer');

    // Static Public Functions
    // None

    // Prototype creation
    var child = NationalInstruments.HtmlVI.Models.ArrayViewerModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.registerModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);

        proto.addModelProperty(targetPrototype, { propertyName: 'rowsAndColumns', defaultValue: '1,1' });
        proto.addModelProperty(targetPrototype, { propertyName: 'dimensions', defaultValue: 1 });
        proto.addModelProperty(targetPrototype, { propertyName: 'indexEditorWidth', defaultValue: 46 });
        proto.addModelProperty(targetPrototype, { propertyName: 'indexVisibility', defaultValue: false });
        proto.addModelProperty(targetPrototype, { propertyName: 'orientation', defaultValue: 'horizontal' });
        proto.addModelProperty(targetPrototype, { propertyName: 'allowsChildPosition', defaultValue: false });
        proto.addModelProperty(targetPrototype, { propertyName: 'horizontalScrollbarVisibility', defaultValue: false });
        proto.addModelProperty(targetPrototype, { propertyName: 'verticalScrollbarVisibility', defaultValue: false });
        proto.addModelProperty(targetPrototype, { propertyName: 'focusedCell', defaultValue: '' });
        proto.addModelProperty(targetPrototype, { propertyName: 'value', defaultValue: [] });
    });

    proto.propertyUsesNITypeProperty = function (propertyName) {
        return propertyName === 'value';
    };

    proto.controlChanged = function () {
        parent.prototype.controlChanged.call(this, 'value', this.value);
    };

    // special case for keeping the editor up to date on the scroll position of the array
    proto.scrollChanged = function (indices) {
        this.internalControlEventOccurred('ArrayScrolledEvent', indices);
    };

    NationalInstruments.HtmlVI.NIModelProvider.registerModel(child);
}(NationalInstruments.HtmlVI.Models.VisualModel));
