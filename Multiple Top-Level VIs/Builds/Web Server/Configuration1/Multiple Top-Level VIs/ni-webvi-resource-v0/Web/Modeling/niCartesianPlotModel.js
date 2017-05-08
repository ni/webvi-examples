//****************************************
// Cartesian Plot Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    // Constructor Function
    NationalInstruments.HtmlVI.Models.CartesianPlotModel = function (id) {
        parent.call(this, id);

        // Public Instance Properties
        // None

        // Private Instance Properties
        // None
    };

    // Static Public Variables
    NationalInstruments.HtmlVI.Models.CartesianPlotModel.MODEL_KIND = 'niCartesianPlot';

    // Static Public Functions
    // None

    // Prototype creation
    var child = NationalInstruments.HtmlVI.Models.CartesianPlotModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.registerModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);

        proto.addModelProperty(targetPrototype, { propertyName: 'label', defaultValue: '' });
        proto.addModelProperty(targetPrototype, { propertyName: 'show', defaultValue: false });
        proto.addModelProperty(targetPrototype, { propertyName: 'xaxis', defaultValue: null });
        proto.addModelProperty(targetPrototype, { propertyName: 'yaxis', defaultValue: null });
        proto.addModelProperty(targetPrototype, { propertyName: 'enableHover', defaultValue: false });
        proto.addModelProperty(targetPrototype, { propertyName: 'hoverFormat', defaultValue: '' });

        // TODO mraj the following properties are emitted by LabVIEW but did not exist on this model
        proto.addModelProperty(targetPrototype, {
            propertyName: 'showLabel',
            computedProp: true,
            customGetter: function () { },
            customSetter: function () { }
        });
    });

    NationalInstruments.HtmlVI.NIModelProvider.registerModel(child);
}(NationalInstruments.HtmlVI.Models.VisualModel));
