//****************************************
// Plot Renderer Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static private reference aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    // Constructor Function
    NationalInstruments.HtmlVI.Models.PlotRendererModel = function (id) {
        parent.call(this, id);

        // Public Instance Properties
        // None

        // Private Instance Properties
        // None
    };

    // Static Public Variables
    NationalInstruments.HtmlVI.Models.PlotRendererModel.MODEL_KIND = 'niCartesianPlotRenderer';

    // Static Public Functions
    // None

    // Prototype creation
    var child = NationalInstruments.HtmlVI.Models.PlotRendererModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.registerModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);

        proto.addModelProperty(targetPrototype, { propertyName: 'lineWidth', defaultValue: 1 });
        proto.addModelProperty(targetPrototype, { propertyName: 'pointSize', defaultValue: 1 });
        proto.addModelProperty(targetPrototype, { propertyName: 'pointColor', defaultValue: 'red' });
        proto.addModelProperty(targetPrototype, { propertyName: 'pointShape', defaultValue: 'square' });
        proto.addModelProperty(targetPrototype, { propertyName: 'lineStroke', defaultValue: 'black' });
        proto.addModelProperty(targetPrototype, { propertyName: 'lineStyle', defaultValue: 'solid' });
        proto.addModelProperty(targetPrototype, { propertyName: 'areaFill', defaultValue: '' });
        proto.addModelProperty(targetPrototype, { propertyName: 'barFill', defaultValue: '' });
        proto.addModelProperty(targetPrototype, { propertyName: 'areaBaseLine', defaultValue: 'zero' });
    });

    NationalInstruments.HtmlVI.NIModelProvider.registerModel(child);
}(NationalInstruments.HtmlVI.Models.VisualComponentModel));
